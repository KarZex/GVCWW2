event entity @s gvcv5:become_GERteam
tag @s remove wantToBeGER
tellraw @a { "rawtext": [{"selector": "@s"},{ "translate": "script.gvcv5.youAreInGERteam.name"}] }