import json
import csv
import shutil

teams = ["eng", "sov", "ger", "usa", "jap"]

def create_flag_json( team,teamTrue,structure_id, structure_loot,family):
    interact = {
        "on_interact": {
            "filters": {
                "all_of": [
                    {
                        "test": "is_family",
                        "subject": "other",
                        "value": "{}team".format(teamTrue)
                    }
                ]
            }
        },
        "cooldown": 300.0,
        "swing": True,
        "use_item": False,
        "interact_text": "アイテムを取得",
        "spawn_items": {
            "table": "loot_tables/boss/{}.json".format(structure_loot)
        }
    }
    with open("tool/a1{}.json".format(team),"r") as f:
        flag_json = json.load(f)
        flag_json["minecraft:entity"]["components"]["minecraft:boss"]["name"] = "boss.gvcww2:flag{0}_{1}.name".format(team, structure_id)
        flag_json["minecraft:entity"]["description"]["identifier"] = "gvcww2:flag_{0}_{1}".format(team, structure_id)
        flag_json["minecraft:entity"]["components"]["minecraft:behavior.summon_entity"]["summon_choices"][0]["sequence"][0]["entity_type"] = "gvcww2:{}_soldier".format(team)
        flag_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(interact)
        flag_json["minecraft:entity"]["events"]["minecraft:entity_spawned"] = { "queue_command": { "command":[ 
            #BB#"say §c{} is spawned".format(structure_id),
            #BB#"scriptevent zex:flagAdd {0} {1}".format(structure_id,team),
            #BB#"scoreboard players add §cRED ALLFlags 10"
        ] } }
        flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"] = [    
            "summon gvcv5:flag_garrison_ga ~~~",
            #BB#"say §c{} killed".format(structure_id),
            #BB#"scriptevent zex:flagRem {0} {1}".format(structure_id,team),
            "kill @s",
            #BB#"scoreboard players remove §cRED ALLFlags 10"
        ]
        flag_json["minecraft:entity"]["events"]["become_SOV"]["queue_command"]["command"] = [    
            "summon gvcww2:flag_sov_{} ~~~".format(structure_id),
            #BB#"say §c{} killed".format(structure_id),
            #BB#"scriptevent zex:flagRem {0} {1}".format(structure_id,team),
            "kill @s",
            #BB#"scoreboard players remove §cRED ALLFlags 10"
        ]
        flag_json["minecraft:entity"]["events"]["become_GER"]["queue_command"]["command"] = [    
            "summon gvcww2:flag_ger_{} ~~~".format(structure_id),
            #BB#"say §c{} killed".format(structure_id),
            #BB#"scriptevent zex:flagRem {0} {1}".format(structure_id,team),
            "kill @s",
            #BB#"scoreboard players remove §cRED ALLFlags 10"
        ]
        flag_json["minecraft:entity"]["events"]["become_USA"]["queue_command"]["command"] = [    
            "summon gvcww2:flag_usa_{} ~~~".format(structure_id),
            #BB#"say §c{} killed".format(structure_id),
            #BB#"scriptevent zex:flagRem {0} {1}".format(structure_id,team),
            "kill @s",
            #BB#"scoreboard players remove §cRED ALLFlags 10"
        ]
        flag_json["minecraft:entity"]["events"]["become_JAP"]["queue_command"]["command"] = [    
            "summon gvcww2:flag_jap_{} ~~~".format(structure_id),
            #BB#"say §c{} killed".format(structure_id),
            #BB#"scriptevent zex:flagRem {0} {1}".format(structure_id,team),
            "kill @s",
            #BB#"scoreboard players remove §cRED ALLFlags 10"
        ]
        flag_json["minecraft:entity"]["events"]["become_ENG"]["queue_command"]["command"] = [    
            "summon gvcww2:flag_eng_{} ~~~".format(structure_id),
            #BB#"say §c{} killed".format(structure_id),
            #BB#"scriptevent zex:flagRem {0} {1}".format(structure_id,team),
            "kill @s",
            #BB#"scoreboard players remove §cRED ALLFlags 10"
        ]
        flag_json["minecraft:entity"]["components"]["minecraft:type_family"]["family"] = family
        if structure_flag_type == "L":
            flag_json["minecraft:entity"]["components"]["minecraft:health"]["value"] = 400
            flag_json["minecraft:entity"]["components"]["minecraft:health"]["max"] = 400

    with open("behavior_packs/GVCWW2Bedrock/entities/flag/flag_{0}_{1}.json".format(team,structure_id),"w") as f:
        json.dump(flag_json,f,indent=2)

    with open("tool/flag_color.json","r") as f:
        flag_r_json = json.load(f)

    with open("resource_packs/GVCWW2Bedrock/entity/flag/{0}_{1}.json".format(structure_id,team),"w") as f:
        flag_r_json["minecraft:client_entity"]["description"]["identifier"] = "gvcww2:flag_{0}_{1}".format(team,structure_id)
        flag_r_json["minecraft:client_entity"]["description"]["textures"]["default"] = "textures/flag/{}team".format(team)
        json.dump(flag_r_json,f,indent=2)


csv_path = open("csv/feature_team.csv","r")
csv_reader = csv.reader(csv_path)

jptext = ""
entext = ""
j_text = ""
sj_text = ""

e_text = ""
se_text = ""

row_count = 0
#aasdasd
for row in csv_reader:

    if( row_count >= 1 and row[4] != "" ):
        #from CSV
        structure_id = row[2]
        structure_loadx = int(row[4])
        structure_loadz = int(row[5])
        structure_loady = int(row[6])
        structure_chance = float(row[7])
        structure_flag_type = row[8].replace("nf","")
        structure_is_ship = row[9]
        structure_loot = row[10]
        for team in teams:
            jptext += "tile.gvcww2:building_{0}_{1}.name={2}\n".format(team,structure_id,row[0])
            jptext += "tile.gvcww2:structure_end_{0}_{1}.name={1}\n".format(team,structure_id,row[0])
            entext += "tile.gvcww2:building_{0}_{1}.name={2}\n".format(team,structure_id,row[1])
            entext += "tile.gvcww2:structure_end_{0}_{1}.name={1}\n".format(team,structure_id,row[1])
            with open("tool/structure_end.json","r") as f:
                structure_end_json = json.load(f)
                structure_end_json["minecraft:block"]["description"]["identifier"] = "gvcv5:structure_end_{0}_{1}".format(team,structure_id)
                

            with open("behavior_packs/GVCWW2Bedrock/blocks/endblock/{0}_{1}_end.json".format(team,structure_id),"w") as f:
                json.dump(structure_end_json,f,indent=2)
            with open("behavior_packs/GVCWW2Bedrock/functions/structure/{0}_{1}.mcfunction".format(team,structure_id),"w") as f:
                f.write("execute if score {4} building matches 1 run tickingarea add ~~~ ~{0}~63~{1} {2}_{3} true\n".format(structure_loadx+16,structure_loadz+16,team,structure_id,structure_flag_type))
                f.write("execute if score {5} building matches 1 run structure load {3}_{4} ~~-{1}~\n".format(structure_loadx,structure_loady,structure_loadz,team,structure_id,structure_flag_type))
                if( structure_loadx > 64 ): f.write("execute if score {5} building matches 1 run structure load {3}_{4}_x64 ~64~-{1}~\n".format(structure_loadx,structure_loady,structure_loadz,team,structure_id,structure_flag_type))
                if( structure_loadz > 64 ): f.write("execute if score {5} building matches 1 run structure load {3}_{4}_z64 ~~-{1}~64\n".format(structure_loadx,structure_loady,structure_loadz,team,structure_id,structure_flag_type))
                if( structure_loadx > 64 and structure_loadz > 64 ): f.write("execute if score {5} building matches 1 run structure load {3}_{4}_x64z64 ~64~-{1}~64\n".format(structure_loadx,structure_loady,structure_loadz,team,structure_id,structure_flag_type))
                f.write("fill ~~~ ~~~ minecraft:air\n")
                
            with open("tool/feature.json","r") as f:
                feature_json = json.load(f)
                feature_json["minecraft:structure_template_feature"]["description"]["identifier"] = "gvcww2:{0}_{1}".format(team,structure_id)
                feature_json["minecraft:structure_template_feature"]["structure_name"] = "mystructure:f_{0}_{1}".format(team,structure_id)
                if structure_is_ship == "T": feature_json["minecraft:structure_template_feature"]["constraints"] = { "unburied":{} }
                else: feature_json["minecraft:structure_template_feature"]["constraints"] = { "grounded":{} }

            with open("behavior_packs/GVCWW2Bedrock/features/{0}_{1}.json".format(team,structure_id),"w") as f:
                json.dump(feature_json,f,indent=2)
                
            for l in range(7):
                if l == 0: chance = structure_chance
                elif l == 1: continue
                elif l == 2: chance = structure_chance * 0.25
                elif l == 3: chance = structure_chance * 0.5
                elif l == 4: chance = structure_chance * 2
                elif l == 5: chance = structure_chance * 4
                elif l == 6: chance = structure_chance * 8
                with open("tool/feature_rule.json","r") as f:
                    feature_rule_json = json.load(f)
                    feature_rule_json["minecraft:feature_rules"]["description"]["identifier"] = "gvcww2:{0}_{1}_rule".format(team,structure_id)
                    feature_rule_json["minecraft:feature_rules"]["description"]["places_feature"] = "gvcww2:{0}_{1}".format(team,structure_id)
                    feature_rule_json["minecraft:feature_rules"]["distribution"]["scatter_chance"] = chance
                    i = 11
                    j = -1
                    while not row[i] == "":
                        if not ";" in row[i]:
                            operator = row[i]
                            feature_rule_json["minecraft:feature_rules"]["conditions"]["minecraft:biome_filter"].append({ "{}_of".format(operator): [] })
                            j += 1
                        if ";" in row[i]:
                            op,biome = row[i].split(";")
                            if op == "F": op = "!="
                            else: op = "=="
                            biome_test = {  "test": "has_biome_tag", "operator": op, "value": biome }
                            feature_rule_json["minecraft:feature_rules"]["conditions"]["minecraft:biome_filter"][j]["{}_of".format(operator)].append(biome_test)
                            
                        i += 1

                

                with open("behavior_packs/GVCWW2Bedrock/subpacks/{2}/feature_rules/{0}_{1}_rule.json".format(team,structure_id,l),"w") as f:
                    json.dump(feature_rule_json,f,indent=2)


                with open("tool/structure_block.json","r") as f:
                    structure_block_json = json.load(f)
                    structure_block_json["minecraft:block"]["description"]["identifier"] = "gvcww2:building_{0}_{1}".format(team,structure_id)
                    

                with open("behavior_packs/GVCWW2Bedrock/blocks/buildings/{0}_{1}.json".format(team,structure_id),"w") as f:
                    json.dump(structure_block_json,f,indent=2)

        #Japanese
        j_text += "entity.gvcww2:flag_sov_{0}.name=§c{1}\n".format(structure_id,row[0].replace("ダンジョン","ソ連軍拠点"))
        j_text += "entity.gvcww2:flag_ger_{0}.name=§8{1}\n".format(structure_id,row[0].replace("ダンジョン","ドイツ軍拠点"))
        j_text += "entity.gvcww2:flag_usa_{0}.name=§9{1}\n".format(structure_id,row[0].replace("ダンジョン","アメリカ軍拠点"))
        j_text += "entity.gvcww2:flag_jap_{0}.name=§a{1}\n".format(structure_id,row[0].replace("ダンジョン","日本軍拠点"))
        j_text += "entity.gvcww2:flag_eng_{0}.name=§e{1}\n".format(structure_id,row[0].replace("ダンジョン","イギリス軍拠点"))
        sj_text += "item.spawn_egg.entity.gvcww2:flag_sov_{0}.name={1}\n".format(structure_id,row[0].replace("ダンジョン","ソ連軍拠点"))
        sj_text += "item.spawn_egg.entity.gvcww2:flag_ger_{0}.name={1}\n".format(structure_id,row[0].replace("ダンジョン","ドイツ軍拠点"))
        sj_text += "item.spawn_egg.entity.gvcww2:flag_usa_{0}.name={1}\n".format(structure_id,row[0].replace("ダンジョン","アメリカ軍拠点"))
        sj_text += "item.spawn_egg.entity.gvcww2:flag_jap_{0}.name={1}\n".format(structure_id,row[0].replace("ダンジョン","日本軍拠点"))
        sj_text += "item.spawn_egg.entity.gvcww2:flag_eng_{0}.name={1}\n".format(structure_id,row[0].replace("ダンジョン","イギリス軍拠点"))

        #for boss bar
        j_text += "boss.gvcww2:flagsov_{0}.name=§c{1}\n".format(structure_id,row[0].replace("ダンジョン","ソ連軍拠点"))
        j_text += "boss.gvcww2:flagger_{0}.name=§8{1}\n".format(structure_id,row[0].replace("ダンジョン","ドイツ軍拠点"))
        j_text += "boss.gvcww2:flagusa_{0}.name=§9{1}\n".format(structure_id,row[0].replace("ダンジョン","アメリカ軍拠点"))
        j_text += "boss.gvcww2:flagjap_{0}.name=§a{1}\n".format(structure_id,row[0].replace("ダンジョン","日本軍拠点"))
        j_text += "boss.gvcww2:flageng_{0}.name=§e{1}\n".format(structure_id,row[0].replace("ダンジョン","イギリス軍拠点"))
        e_text += "boss.gvcww2:flagsov_{0}.name=§c{1}\n".format(structure_id,row[1].replace("DDD","Soviet"))
        e_text += "boss.gvcww2:flagger_{0}.name=§8{1}\n".format(structure_id,row[1].replace("DDD","German"))
        e_text += "boss.gvcww2:flagusa_{0}.name=§9{1}\n".format(structure_id,row[1].replace("DDD","US"))
        e_text += "boss.gvcww2:flagjap_{0}.name=§a{1}\n".format(structure_id,row[1].replace("DDD","Japanese"))
        e_text += "boss.gvcww2:flageng_{0}.name=§e{1}\n".format(structure_id,row[1].replace("DDD","British"))

        #English
        e_text += "entity.gvcww2:flag_sov_{0}.name=§c{1}\n".format(structure_id,row[1].replace("DDD","Soviet"))
        e_text += "entity.gvcww2:flag_ger_{0}.name=§8{1}\n".format(structure_id,row[1].replace("DDD","German"))
        e_text += "entity.gvcww2:flag_usa_{0}.name=§9{1}\n".format(structure_id,row[1].replace("DDD","US"))
        e_text += "entity.gvcww2:flag_jap_{0}.name=§a{1}\n".format(structure_id,row[1].replace("DDD","Japanese"))
        e_text += "entity.gvcww2:flag_eng_{0}.name=§e{1}\n".format(structure_id,row[1].replace("DDD","British"))
        se_text += "item.spawn_egg.entity.gvcww2:flag_sov_{0}.name={1}\n".format(structure_id,row[1].replace("DDD","Soviet"))
        se_text += "item.spawn_egg.entity.gvcww2:flag_ger_{0}.name={1}\n".format(structure_id,row[1].replace("DDD","German"))
        se_text += "item.spawn_egg.entity.gvcww2:flag_usa_{0}.name={1}\n".format(structure_id,row[1].replace("DDD","US"))
        se_text += "item.spawn_egg.entity.gvcww2:flag_jap_{0}.name={1}\n".format(structure_id,row[1].replace("DDD","Japanese"))
        se_text += "item.spawn_egg.entity.gvcww2:flag_eng_{0}.name={1}\n".format(structure_id,row[1].replace("DDD","British"))

        if structure_loot == "":
            structure_loot = "flag"
            

        #SOV - Soviet Union
        sov_family = [ "SOVflag","flag","redteam","SOVteam","allied_soldier","inanimate" ]
        create_flag_json("sov","SOV",structure_id,structure_loot,sov_family)

        #%COLOR% = blue
        
        # "scriptevent zex:flagRem {} %COLOR%".format(structure_id),
        # "scriptevent zex:flagRem {} %COLOR%".format(structure_id),

        #GER - Nazi Germany
        ger_family = [ "GERflag","flag","grayteam","GERteam","axis_soldier","inanimate" ]
        create_flag_json("ger","GER",structure_id,structure_loot,ger_family)

        #USA - United States
        usa_family = [ "USAflag","flag","blueteam","USAteam","allied_soldier","inanimate" ]
        create_flag_json("usa","USA",structure_id,structure_loot,usa_family)

        #JAP - Imperial Japan
        jap_family = [ "JAPflag","flag","greenteam","JAPteam","axis_soldier","inanimate" ]
        create_flag_json("jap","JAP",structure_id,structure_loot,jap_family)

        #ENG - United Kingdom
        eng_family = [ "ENGflag","flag","yellowteam","ENGteam","allied_soldier","inanimate" ]
        create_flag_json("eng","ENG",structure_id,structure_loot,eng_family)

        for i in teams:
            with open("behavior_packs/GVCWW2Bedrock/functions/flag/{0}_{1}.mcfunction".format(i,structure_id),"w") as f:
                f.write("summon gvcww2:flag_{0}_{1}\n".format(i,structure_id))
                f.write("fill ~~~ ~~~ air\n")
            

        print("{}\n".format(structure_id))

            


    
    row_count += 1

with open("resource_packs/GVCWW2Bedrock/texts/buildings.txt","w",encoding="utf-8") as f:
    f.write(jptext)
with open("resource_packs/GVCWW2Bedrock/texts/endtext.txt","w",encoding="utf-8") as f:
    f.write(entext)
with open("resource_packs/GVCWW2Bedrock/texts/eflag.txt","w",encoding="utf-8") as f:
    f.write(e_text)
with open("resource_packs/GVCWW2Bedrock/texts/eflag_s.txt","w",encoding="utf-8") as f:
    f.write(se_text)

with open("resource_packs/GVCWW2Bedrock/texts/flag.txt","w",encoding="utf-8") as f:
    f.write(j_text)
with open("resource_packs/GVCWW2Bedrock/texts/flag_s.txt","w",encoding="utf-8") as f:
    f.write(sj_text)