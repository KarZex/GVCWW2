event entity @s gvcv5:become_SOVteam
tag @s remove wantToBeSOV
tellraw @a { "rawtext": [{"selector": "@s"},{ "translate": "script.gvcv5.youAreInSOVteam.name"}] }