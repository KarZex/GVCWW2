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


for row in csv_reader:
    if( row_count >= 1 ):
        attach_id = row[1]
        attach_type = row[2]
        attach_number = int(row[3])
        attach_is_2d_scope = row[4]

        if( not attach_type in attach_types  ):
            attach_types.append(attach_type)
            attachdata_json["{}".format(attach_type)] = []

        attachdata_json["{}".format(attach_type)].append(attach_type)
        
        with open("tool/attach_item.json","r") as f:
            attach_json = json.load(f)
            attach_json["minecraft:item"]["description"]["identifier"] = "zex:{}".format(attach_id)
            attach_json["minecraft:item"]["components"]["minecraft:icon"] = "{}".format(attach_id)

        with open("behavior_packs/GVCWW2Bedrock/items/attachment/{0}.json".format(attach_id),"w") as f:
            json.dump(attach_json,f,indent=4)

        for root, dirs, files in os.walk(attach_directory):
            for file in files:
                if file.endswith('.json'):
                    file_path = os.path.join(root, file)
                    with open(file_path, 'r', encoding='utf-8') as f:
                        try:
                            data = json.load(f)
                            data["minecraft:attachable"]["description"]["materials"]["default"] = "iron_golem"
                            data["minecraft:attachable"]["description"]["textures"]["{}".format(attach_id)] = "textures/models/leemk4.png"
                            data["minecraft:attachable"]["description"]["geometry"]["{}".format(attach_id)] = "geometry.{}".format(attach_id)

                            with open(file_path, 'w', encoding='utf-8') as f:
                                json.dump(data, f, ensure_ascii=False, indent=4)

                        except json.JSONDecodeError as e:
                            print(f"Error decoding JSON from {file_path}: {e}")
        
        item_json["texture_data"]["{}".format(attach_id)] = { "textures": "textures/items/gun/{}".format(attach_id) }

        print("create {}".format(attach_id))
    

    row_count += 1


with open("tool/player_team.json","r") as f:
    player_json = json.load(f)
    for attach_type in attach_types:
        player_json["minecraft:entity"]["description"]["properties"]["zex:{}".format(attach_type)] = {
          "client_sync": True,
          "type": "int",
          "range": [ 0,255 ],
          "default": 0
        }

with open( "tool/player_team.json","w" ) as f:
    json.dump(player_json,f,indent=4)

for root, dirs, files in os.walk(attach_directory):
    for file in files:
        if file.endswith('.json'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    data["minecraft:attachable"]["description"]["animations"]["ads_scope"] = "animation.mosin.ads"
                    data["minecraft:attachable"]["description"]["scripts"] = {
                        "pre_animation": [
                            "v.main_hand = c.item_slot == 'main_hand';"
                        ],
                        "animate": [
                            {
                                "first": "(v.main_hand && c.is_first_person) && !query.is_sneaking"
                            },
                            {
                                "ads": "!query.property('zex:is_scoping') && (v.main_hand && c.is_first_person) && query.is_sneaking"
                            },
                            {
                                "ads_scope": "query.property('zex:is_scoping') && (v.main_hand && c.is_first_person) && query.is_sneaking"
                            },
                            {
                                "third": "v.main_hand && !c.is_first_person"
                            }
                        ]
                    }
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