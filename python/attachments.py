import json
import csv
import os

teams = ["eng", "sov", "ger", "usa", "jap"]
true_teams = [ "ENG", "SOV", "GER", "USA", "JAP" ]

attach_types = []
attachdata_json = {}

attach_directory = "resource_packs/GVCWW2Bedrock/attachables/gun/"

item_json = json.load(open("resource_packs/GVCWW2Bedrock/textures/item_texture.json","r"))
csv_path = open("csv/attach.csv","r")
csv_reader = csv.reader(csv_path)
row_count = 0

with open("tool/attach_scopes.json","r") as f:
    scope_render = json.load(f)

for row in csv_reader:
    if( row_count >= 1 ):
        attach_id = row[1]
        attach_type = row[2]
        attach_number = int(row[3])
        attach_is_2d_scope = row[4]

        if( not attach_type in attach_types  ):
            attach_types.append(attach_type)
            attachdata_json["{}".format(attach_type)] = [ "none" ]

        attachdata_json["{}".format(attach_type)].append(attach_id)
        
        with open("tool/attach_item.json","r") as f:
            attach_json = json.load(f)
            attach_json["minecraft:item"]["description"]["identifier"] = "zex:{}".format(attach_id)
            attach_json["minecraft:item"]["components"]["minecraft:icon"] = "{}".format(attach_id)

        with open("behavior_packs/GVCWW2Bedrock/items/attachment/{0}.json".format(attach_id),"w") as f:
            json.dump(attach_json,f,indent=4)

        
        if attach_is_2d_scope != "":
            array_length = len(scope_render["render_controllers"]["controller.render.scope"]["arrays"]["textures"]["Array.base"])
            if( array_length-1 < attach_number ):
                for i in range( attach_number - array_length+1 ):
                    scope_render["render_controllers"]["controller.render.scope"]["arrays"]["textures"]["Array.base"].append("Texture.scope")

            scope_render["render_controllers"]["controller.render.scope"]["arrays"]["textures"]["Array.base"][attach_number] = "Texture.{}_scope".format(attach_id)




        for root, dirs, files in os.walk(attach_directory):
            for file in files:
                if file.endswith('.json'):
                    file_path = os.path.join(root, file)
                    with open(file_path, 'r', encoding='utf-8') as f:
                        try:
                            data = json.load(f)
                            data["minecraft:attachable"]["description"]["materials"]["default"] = "iron_golem"
                            data["minecraft:attachable"]["description"]["textures"]["none".format(attach_id)] = "textures/models/leemk4.png"
                            data["minecraft:attachable"]["description"]["geometry"]["none".format(attach_id)] = "geometry.sniperscope"
                            data["minecraft:attachable"]["description"]["textures"]["{}".format(attach_id)] = "textures/models/leemk4.png"
                            data["minecraft:attachable"]["description"]["geometry"]["{}".format(attach_id)] = "geometry.{}".format(attach_id)
                            if attach_is_2d_scope != "":
                                data["minecraft:attachable"]["description"]["textures"]["{}_scope".format(attach_id)] = "textures/models/{}.png".format(attach_is_2d_scope)
                                data["minecraft:attachable"]["description"]["geometry"]["scope"] = "geometry.scope"

                            with open(file_path, 'w', encoding='utf-8') as f:
                                json.dump(data, f, ensure_ascii=False, indent=4)

                        except json.JSONDecodeError as e:
                            print(f"Error decoding JSON from {file_path}: {e}")
        
        item_json["texture_data"]["{}".format(attach_id)] = { "textures": "textures/items/gun/{}".format(attach_id) }

        print("create {}".format(attach_id))
    

    row_count += 1


with open("tool/player_team.json","r") as f:
    player_json = json.load(f)
    player_json["minecraft:entity"]["description"]["properties"]["zex:is_scoping".format(attach_type)] = {
        "client_sync": True,
        "type": "bool",
        "default": False
    }
    for attach_type in attach_types:
        player_json["minecraft:entity"]["description"]["properties"]["zex:{}".format(attach_type)] = {
          "client_sync": True,
          "type": "int",
          "range": [ 0,255 ],
          "default": 0
        }
with open( "tool/player_team.json","w" ) as f:
    json.dump(player_json,f,indent=4)

with open("tool/sov_team.json","r") as f:
    player_json = json.load(f)
    player_json["minecraft:entity"]["description"]["properties"] = {}
    player_json["minecraft:entity"]["description"]["properties"]["zex:is_scoping"] = {
        "client_sync": True,
        "type": "bool",
        "default": False
    }
    for attach_type in attach_types:
        player_json["minecraft:entity"]["description"]["properties"]["zex:{}".format(attach_type)] = {
          "client_sync": True,
          "type": "int",
          "range": [ 0,255 ],
          "default": 0
        }
with open( "tool/sov_team.json","w" ) as f:
    json.dump(player_json,f,indent=4)

with open("tool/ger_team.json","r") as f:
    player_json = json.load(f)
    player_json["minecraft:entity"]["description"]["properties"] = {}
    player_json["minecraft:entity"]["description"]["properties"]["zex:is_scoping"] = {
        "client_sync": True,
        "type": "bool",
        "default": False
    }
    for attach_type in attach_types:
        player_json["minecraft:entity"]["description"]["properties"]["zex:{}".format(attach_type)] = {
          "client_sync": True,
          "type": "int",
          "range": [ 0,255 ],
          "default": 0
        }
with open( "tool/ger_team.json","w" ) as f:
    json.dump(player_json,f,indent=4)

with open("tool/usa_team.json","r") as f:
    player_json = json.load(f)
    player_json["minecraft:entity"]["description"]["properties"] = {}
    player_json["minecraft:entity"]["description"]["properties"]["zex:is_scoping"] = {
        "client_sync": True,
        "type": "bool",
        "default": False
    }
    for attach_type in attach_types:
        player_json["minecraft:entity"]["description"]["properties"]["zex:{}".format(attach_type)] = {
          "client_sync": True,
          "type": "int",
          "range": [ 0,255 ],
          "default": 0
        }
with open( "tool/usa_team.json","w" ) as f:
    json.dump(player_json,f,indent=4)

with open("tool/jap_team.json","r") as f:
    player_json = json.load(f)
    player_json["minecraft:entity"]["description"]["properties"] = {}
    player_json["minecraft:entity"]["description"]["properties"]["zex:is_scoping"] = {
        "client_sync": True,
        "type": "bool",
        "default": False
    }
    for attach_type in attach_types:
        player_json["minecraft:entity"]["description"]["properties"]["zex:{}".format(attach_type)] = {
          "client_sync": True,
          "type": "int",
          "range": [ 0,255 ],
          "default": 0
        }
with open( "tool/jap_team.json","w" ) as f:
    json.dump(player_json,f,indent=4)

with open("tool/eng_team.json","r") as f:
    player_json = json.load(f)
    player_json["minecraft:entity"]["description"]["properties"] = {}
    player_json["minecraft:entity"]["description"]["properties"]["zex:is_scoping"] = {
        "client_sync": True,
        "type": "bool",
        "default": False
    }
    for attach_type in attach_types:
        player_json["minecraft:entity"]["description"]["properties"]["zex:{}".format(attach_type)] = {
          "client_sync": True,
          "type": "int",
          "range": [ 0,255 ],
          "default": 0
        }

with open( "tool/eng_team.json","w" ) as f:
    json.dump(player_json,f,indent=4)

for root, dirs, files in os.walk(attach_directory):
    for file in files:
        if file.endswith('.json'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    data["minecraft:attachable"]["description"]["animations"]["ads_scope"] = "animation.mosin.ads"
                    for ani in data["minecraft:attachable"]["description"]["scripts"]["animate"]:
                        if( "ads" in ani ):
                            ani["ads"] = "!query.property('zex:is_scoping') && (v.main_hand && c.is_first_person) && query.is_sneaking"
                        if( "ads_scope" in ani ):
                            del ani["ads_scope"]
                    
                    data["minecraft:attachable"]["description"]["scripts"]["animate"] = [item for item in data["minecraft:attachable"]["description"]["scripts"]["animate"] if item != {}]
                    
                    data["minecraft:attachable"]["description"]["scripts"]["animate"].append({
                        "ads_scope": "query.property('zex:is_scoping') && (v.main_hand && c.is_first_person) && query.is_sneaking"
                    })

                    data["minecraft:attachable"]["description"]["render_controllers"] = [
                        {"controller.render.armor":"(!query.property('zex:is_scoping') || !c.is_first_person)"},
                        { "controller.render.scope": "query.property('zex:is_scoping') && c.is_first_person" }
                    ]
                    for attach_type in attach_types:
                        render = { "controller.render.{0}".format(attach_type):"query.property('zex:{0}') != 0 && ((!query.property('zex:is_scoping') || !c.is_first_person))".format(attach_type) }
                        data["minecraft:attachable"]["description"]["render_controllers"].append(render)


                    with open(file_path, 'w', encoding='utf-8') as f:
                        json.dump(data, f, ensure_ascii=False, indent=4)

                except json.JSONDecodeError as e:
                    print(f"Error decoding JSON from {file_path}: {e}")


with open("resource_packs/GVCWW2Bedrock/render_controllers/scope.render_controllers.json","w") as f:
    json.dump(scope_render,f,indent=4)

for attach_type in attach_types:
    render_controller = {
        "format_version": "1.8.0",
        "render_controllers": {
            "controller.render.{0}".format(attach_type): {
                    "geometry": "Array.item_geo[query.property('zex:{0}')]".format(attach_type),
                    "materials": [{"*":"material.default"}],
                    "textures": ["Array.item_texture[query.property('zex:{0}')]".format(attach_type)],
                    "arrays": {
                        "geometries": {
                            "Array.item_geo": []
                        },
                        "textures": {
                            "Array.item_texture": []
                        }
                    } 
            }
        }
    }
    for attach_number in range(len(attachdata_json["{}".format(attach_type)])):
        attach_id = attachdata_json["{}".format(attach_type)][attach_number]
        array_length = len(render_controller["render_controllers"]["controller.render.{0}".format(attach_type)]["arrays"]["geometries"]["Array.item_geo"])
        if( array_length-1 < attach_number ):
            for i in range( attach_number - array_length+1 ):
                render_controller["render_controllers"]["controller.render.{0}".format(attach_type)]["arrays"]["geometries"]["Array.item_geo"].append("Texture.default")
        
        render_controller["render_controllers"]["controller.render.{0}".format(attach_type)]["arrays"]["geometries"]["Array.item_geo"][attach_number] = "geometry.{}".format(attach_id)

        array_length = len(render_controller["render_controllers"]["controller.render.{0}".format(attach_type)]["arrays"]["textures"]["Array.item_texture"])
        if( array_length-1 < attach_number ):
            for i in range( attach_number - array_length+1 ):
                render_controller["render_controllers"]["controller.render.{0}".format(attach_type)]["arrays"]["textures"]["Array.item_texture"].append("Texture.default")
        
        render_controller["render_controllers"]["controller.render.{0}".format(attach_type)]["arrays"]["textures"]["Array.item_texture"][attach_number] = "texture.{}".format(attach_id)
    
    with open( "resource_packs/GVCWW2Bedrock/render_controllers/{0}.render_controllers.json".format(attach_type), "w" ) as f:
        json.dump(render_controller,f,indent=4)


with open("behavior_packs/GVCWW2Bedrock/scripts/attach.json","w") as f:
    json.dump(attachdata_json,f,indent=2)

with open("behavior_packs/GVCWW2Bedrock/scripts/attach.json","r") as f:
    export = "import { EntityDamageCause } from \"@minecraft/server\";\nexport const attachmentData = " 
    export += f.read()
    export += ";"

with open("behavior_packs/GVCWW2Bedrock/scripts/attach.js","w") as f:
    f.write(export)