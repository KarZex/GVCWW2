import json

teams = [ "sov","ger","usa","jap","eng" ]
dyes = [ "red", "gray", "blue", "green", "yellow" ]

for i in range(5):
    with open("pmc.json","r") as f:
        recipe_json = json.load(f)
        recipe_json["minecraft:recipe_shaped"]["description"]["identifier"] = "gvcww2:{}_soldier_recipe".format(teams[i])
        recipe_json["minecraft:recipe_shaped"]["key"]["A"]["item"] = "minecraft:{}_dye".format(dyes[i])
        recipe_json["minecraft:recipe_shaped"]["key"]["B"]["item"] = "minecraft:egg"
        recipe_json["minecraft:recipe_shaped"]["result"]["item"] = "gvcww2:{}_soldier_spawn_egg".format(teams[i])
    
    #normal egg
    with open("{}_soldier.json".format(teams[i]),"w") as f:
        json.dump(recipe_json, f, indent=2)
    
    #blue egg
    with open("{}_soldier_blue.json".format(teams[i]),"w") as f:
        recipe_json["minecraft:recipe_shaped"]["description"]["identifier"] = "gvcww2:{}_soldier_blue_recipe".format(teams[i])
        recipe_json["minecraft:recipe_shaped"]["key"]["B"]["item"] = "minecraft:egg_blue"
        json.dump(recipe_json, f, indent=2)
        
    #brown egg
    with open("{}_soldier_brown.json".format(teams[i]),"w") as f:
        recipe_json["minecraft:recipe_shaped"]["description"]["identifier"] = "gvcww2:{}_soldier_brown_recipe".format(teams[i])
        recipe_json["minecraft:recipe_shaped"]["key"]["B"]["item"] = "minecraft:egg_brown"
        json.dump(recipe_json, f, indent=2)
