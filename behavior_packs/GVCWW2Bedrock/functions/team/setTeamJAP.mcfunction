event entity @s gvcv5:become_JAPteam
tag @s remove wantToBeJAP
tellraw @a { "rawtext": [{"selector": "@s"},{ "translate": "script.gvcv5.youAreInJAPteam.name"}] }