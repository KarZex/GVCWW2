import json
import csv
import shutil

csv_path = open("csv/gunData.csv","r")
csv_reader = csv.reader(csv_path) 

row_count = 0

text = ""

player_json = json.load(open("tool/player_team.json","r"))
USA_json = json.load(open("tool/usa_team.json","r"))
GER_json = json.load(open("tool/ger_team.json","r"))
SOV_json = json.load(open("tool/sov_team.json","r"))
JAP_json = json.load(open("tool/jap_team.json","r"))
ENG_json = json.load(open("tool/eng_team.json","r"))

#aasdasd
for row in csv_reader:

    if( row_count >= 1 ):
        #from CSV
        gun_id = row[1]
        gun_damage = int(row[4])
        gun_interval = int(row[8])
        gun_bomb =  int(row[9])
        gun_power = float(row[5])
        gun_aim = float(row[6])
        gun_reload = int(row[7])
        gun_maxammo = int(row[2])
        gun_ammo = row[3]
        gun_burst = int(row[11])
        gun_sound = row[13]
        gun_bullet_num = int(row[14])
        gun_damage_type = row[15]
        gun_fullauto = int(row[16])
        gun_break = int(row[19])
        gun_special = row[21]

        if(row[10] == "T"):
            gun_break_block = True
        else:
            gun_break_block = False

        if(row[12] == "T"):
            gun_onehand = True
        else:
            gun_onehand = False

        if(row[20] == "T"):
            gun_wallbreak = True
        else:
            gun_wallbreak = False


        if(gun_ammo == "zex:556m"):
            ammo_name = "§6.22Cal§r"
        elif(gun_ammo == "zex:762m"):
            ammo_name = "§3.30Cal§r"
        elif(gun_ammo == "zex:mm9"):
            ammo_name = "§99mmHG§r"
        elif(gun_ammo == "zex:btm"):
            ammo_name = "§aBattery§r"
        elif(gun_ammo == "zex:1270m"):
            ammo_name = "§c.50Cal§r"
        elif(gun_ammo == "zex:rocketm"):
            ammo_name = "§b.Rocket§r"
        elif(gun_ammo == "zex:12m"):
            ammo_name = "§412Gauge§r"
        elif(gun_ammo == "zex:40m"):
            ammo_name = "§e40mmGrenade§r"

        Rare = ""
        if( row[23] == "2" ): Rare = "§a"
        if( row[23] == "3" ): Rare = "§b"
        if( row[23] == "4" ): Rare = "§d"
        if( row[23] == "5" ): Rare = "§6"
        if( row[23] == "6" ): Rare = "§c"
            
        text += "item.gun:{0}={2}{1}§r\n".format(gun_id,row[0],Rare)

        #player
        spawn_entity = { 
            "minecraft:spawn_entity":{
                "entities": [
                    {
                        "filters": [
                            {"test":"has_tag","operator":"!=","value":"scope"}
                        ],
                        "max_wait_time": 0,
                        "min_wait_time": 0,
                        "num_to_spawn": gun_bullet_num,
                        "single_use": True,
                        "spawn_entity": "fire:{}".format(gun_id)
                    },
                    {
                        "filters": [
                            {"test":"has_tag","operator":"==","value":"scope"}
                        ],
                        "max_wait_time": 0,
                        "min_wait_time": 0,
                        "num_to_spawn": gun_bullet_num,
                        "single_use": True,
                        "spawn_entity": "fire:ads_{}".format(gun_id)
                    }
                ]
            }
        }
        event = {
            "add": {
                "component_groups": [
                    "fire:{}".format(gun_id)
                ]
            }
        }
        player_json["minecraft:entity"]["component_groups"]["fire:{}".format(gun_id)] = spawn_entity
        player_json["minecraft:entity"]["events"]["fire:{}".format(gun_id)] = event


        #enemy and allieds
        attack_interval = 3.0
        burst_shots = 10
        if gun_burst > 1:
            burst_shots = gun_burst
            attack_interval = 0.5 + gun_interval * 0.05 

        
        burst_interval = 0.05 + gun_interval * 0.05
        if gun_bullet_num > 1: 
            burst_interval = 0
            burst_shots = 1
        if gun_maxammo == 1: 
            attack_interval += gun_reload * 0.05 
            burst_shots = 1
        spawn_entity = {
            "minecraft:behavior.ranged_attack": {
                "priority": 3,
                "burst_shots": burst_shots,
                "burst_interval": burst_interval,
                "charge_charged_trigger": 0.0,
                "charge_shoot_trigger": 0.0,
                "attack_interval_min": attack_interval,
                "attack_interval_max": attack_interval,
                "attack_radius": 20.0
            },
            "minecraft:shooter": {
                "def": "fire:{}".format(gun_id)
            },
            "minecraft:equipment": {
                "table": "loot_tables/gun/{}.json".format(gun_id)
            }
        }
        event = {
            "add": {
                "component_groups": [
                    "{}".format(gun_id)
                ]
            }
        }

        USA_weapon_change = {
            "use_item": False,
            "play_sounds": "enderchest.open",
            "interact_text": "action.gvc.item",
            "on_interact": {
              "filters": {
                "all_of": [
                  {
                    "test": "is_sneaking",
                    "subject": "other",
                    "value": True
                  },
                  {
                    "test": "is_family",
                    "subject": "other",
                    "value": "USAteam"
                  },
                  {
                    "test": "has_equipment",
                    "subject": "other",
                    "domain": "hand",
                    "value": "gun:{}".format(gun_id)
                  }
                ]
              },
              "event": "{}".format(gun_id),
              "target": "self"
            }
          }
        
        GER_weapon_change = {
            "use_item": False,
            "play_sounds": "enderchest.open",
            "interact_text": "action.gvc.item",
            "on_interact": {
              "filters": {
                "all_of": [
                  {
                    "test": "is_sneaking",
                    "subject": "other",
                    "value": True
                  },
                  {
                    "test": "is_family",
                    "subject": "other",
                    "value": "GERteam"
                  },
                  {
                    "test": "has_equipment",
                    "subject": "other",
                    "domain": "hand",
                    "value": "gun:{}".format(gun_id)
                  }
                ]
              },
              "event": "{}".format(gun_id),
              "target": "self"
            }
          }
        
        SOV_weapon_change = {
            "use_item": False,
            "play_sounds": "enderchest.open",
            "interact_text": "action.gvc.item",
            "on_interact": {
              "filters": {
                "all_of": [
                  {
                    "test": "is_sneaking",
                    "subject": "other",
                    "value": True
                  },
                  {
                    "test": "is_family",
                    "subject": "other",
                    "value": "SOVteam"
                  },
                  {
                    "test": "has_equipment",
                    "subject": "other",
                    "domain": "hand",
                    "value": "gun:{}".format(gun_id)
                  }
                ]
              },
              "event": "{}".format(gun_id),
              "target": "self"
            }
          }
        
        JAP_weapon_change = {
            "use_item": False,
            "play_sounds": "enderchest.open",
            "interact_text": "action.gvc.item",
            "on_interact": {
              "filters": {
                "all_of": [
                  {
                    "test": "is_sneaking",
                    "subject": "other",
                    "value": True
                  },
                  {
                    "test": "is_family",
                    "subject": "other",
                    "value": "JAPteam"
                  },
                  {
                    "test": "has_equipment",
                    "subject": "other",
                    "domain": "hand",
                    "value": "gun:{}".format(gun_id)
                  }
                ]
              },
              "event": "{}".format(gun_id),
              "target": "self"
            }
          }
        
        ENG_weapon_change = {
            "use_item": False,
            "play_sounds": "enderchest.open",
            "interact_text": "action.gvc.item",
            "on_interact": {
              "filters": {
                "all_of": [
                  {
                    "test": "is_sneaking",
                    "subject": "other",
                    "value": True
                  },
                  {
                    "test": "is_family",
                    "subject": "other",
                    "value": "ENGteam"
                  },
                  {
                    "test": "has_equipment",
                    "subject": "other",
                    "domain": "hand",
                    "value": "gun:{}".format(gun_id)
                  }
                ]
              },
              "event": "{}".format(gun_id),
              "target": "self"
            }
          }


        USA_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        USA_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        USA_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(USA_weapon_change)
        GER_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        GER_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        GER_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(GER_weapon_change)
        SOV_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        SOV_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        SOV_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(SOV_weapon_change)
        JAP_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        JAP_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        JAP_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(JAP_weapon_change)
        ENG_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        ENG_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        ENG_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(ENG_weapon_change)

        print("created {0} with {1}".format(gun_id,gun_damage_type))
    row_count += 1


csv_path2 = open("csv/vehiclewData.csv","r")
csv_reader2 = csv.reader(csv_path2)
row_count = 0
#aasdasd
for row in csv_reader2:

    if( row_count >= 1 ):
        #from CSV
        gun_id = row[1]
        gun_damage = int(row[2])
        gun_power = float(row[3])
        gun_aim = float(row[4])
        gun_interval = int(row[5])
        gun_bomb =  int(row[6])
        gun_sound = row[8]
        gun_damage_type = row[9]
        gun_offset = row[10]
        bombattack = "bomb"

        if(row[7] == "T"):
            gun_break_block = True
        else:
            gun_break_block = False
        #player
        if(  gun_offset == "D"  ):
            spawn_entity = { 
                "minecraft:spawn_entity":{
                    "entities": [
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}r".format(gun_id)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}l".format(gun_id)
                        }
                    ]
                }
            }
        elif( "M" in gun_offset and not "MM" in gun_offset  ):
            spawn_entity = { 
                "minecraft:spawn_entity":{
                    "entities": [
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}ir".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}iiir".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}il".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}iiil".format(bombattack)
                        }
                    ]
                }
            }

        elif( "MM" in gun_offset ):
            spawn_entity = { 
                "minecraft:spawn_entity":{
                    "entities": [
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}ir".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}iir".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}iiir".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}ivr".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}il".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}iil".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}iiil".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}ivl".format(bombattack)
                        }
                    ]
                }
            }

        else:
            spawn_entity = { 
                "minecraft:spawn_entity":{
                    "entities": [
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}".format(gun_id)
                        }
                    ]
                }
            }
        event = {
            "add": {
                "component_groups": [
                    "fire:{}".format(gun_id)
                ]
            }
        }
        player_json["minecraft:entity"]["component_groups"]["fire:{}".format(gun_id)] = spawn_entity
        player_json["minecraft:entity"]["events"]["fire:{}".format(gun_id)] = event
        
        #enemy and allieds
        attack_interval = gun_interval * 0.05

        spawn_entity = {
            "minecraft:behavior.ranged_attack": {
                "priority": 3,
                "burst_shots": 1,
                "burst_interval": 0,
                "charge_charged_trigger": 0.0,
                "charge_shoot_trigger": 0.0,
                "attack_interval_min": attack_interval,
                "attack_interval_max": attack_interval,
                "attack_radius": 20.0
            },
            "minecraft:shooter": {
                "def": "fire:{}".format(gun_id)
            }
        }
        event = {
            "add": {
                "component_groups": [
                    "{}".format(gun_id)
                ]
            }
        }
        USA_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        USA_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        GER_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        GER_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        SOV_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        SOV_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        JAP_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        JAP_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        ENG_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        ENG_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event

        print("created {}".format(gun_id))
    row_count += 1
    
csv_path3 = open("csv/vehicleData.csv","r")
csv_reader3 = csv.reader(csv_path3)
row_count = 0
for row in csv_reader3:
    if( row_count >= 1 ):
        #from CSV
        v_id = row[1]
        v_type = row[2]
        USA_json["minecraft:entity"]["events"]["vehicle:{}".format(v_id)] = { "queue_command": { "command": "ride @s summon_ride vehicle:{} no_ride_change summon_enemy".format(v_id) } }
        GER_json["minecraft:entity"]["events"]["vehicle:{}".format(v_id)] = { "queue_command": { "command": "ride @s summon_ride vehicle:{} no_ride_change summon_enemy".format(v_id) } }
        SOV_json["minecraft:entity"]["events"]["vehicle:{}".format(v_id)] = { "queue_command": { "command": "ride @s summon_ride vehicle:{} no_ride_change summon_enemy".format(v_id) } }
        JAP_json["minecraft:entity"]["events"]["vehicle:{}".format(v_id)] = { "queue_command": { "command": "ride @s summon_ride vehicle:{} no_ride_change summon_enemy".format(v_id) } }
        ENG_json["minecraft:entity"]["events"]["vehicle:{}".format(v_id)] = { "queue_command": { "command": "ride @s summon_ride vehicle:{} no_ride_change summon_enemy".format(v_id) } }
    
    row_count += 1


with open("behavior_packs/GVCWW2Bedrock/entities/player.json","w") as f:
    json.dump(player_json,f,indent=2)


with open("behavior_packs/GVCWW2Bedrock/entities/mob/USA_soldier.json","w") as f:
    json.dump(USA_json,f,indent=2)

with open("behavior_packs/GVCWW2Bedrock/entities/mob/GER_soldier.json","w") as f:
    json.dump(GER_json,f,indent=2)

with open("behavior_packs/GVCWW2Bedrock/entities/mob/SOV_soldier.json","w") as f:
    json.dump(SOV_json,f,indent=2)

with open("behavior_packs/GVCWW2Bedrock/entities/mob/JAP_soldier.json","w") as f:
    json.dump(JAP_json,f,indent=2)

with open("behavior_packs/GVCWW2Bedrock/entities/mob/ENG_soldier.json","w") as f:
    json.dump(ENG_json,f,indent=2)