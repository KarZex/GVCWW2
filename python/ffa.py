import json
import csv
import shutil
teams = [ "SOV","GER","USA","JAP","ENG" ]
for team in teams:
    with open("behavior_packs/GVCWW2Bedrock/entities/mob/{}_soldier".format(team),"r") as f:
        team_json = json.load(f)
        team_json["minecraft:entity"]["components"]["minecraft:behavior.nearest_attackable_target"]["entity_types"] = [
            {
                "filters": {
                "all_of": [
                    { "test": "is_family", "subject": "other", "value": "ww2_soldier" },
                    { "test": "is_family","subject": "other","operator":"!=","value": "{}team".format(team)}
                ]
                },
                "max_dist": 42
            },
            {
                "filters": {
                "all_of": [
                    { "test": "is_family", "subject": "other", "value": "player" },
                    { "test": "is_family","subject": "other","operator":"!=","value": "{}team".format(team)},
                    { "test": "has_tag","operator":"!=","subject": "other","value": "{}Sub".format(team)}
                ]
                },
                "max_dist": 42
            },
            {
                "filters": {
                "any_of": [
                    { "test": "is_family", "subject": "other", "value": "monster" }
                ]
                },
                "max_dist": 42
            }
        ]
    
    with open("behavior_packs/GVCWW2Bedrock/entities/mob/{}_soldier".format(team),"w") as f:
        json.dump(team_json,f,indent=2)

        