event entity @s gvcv5:become_ENGteam
tag @s remove wantToBeENG
tellraw @a { "rawtext": [{"selector": "@s"},{ "translate": "script.gvcv5.youAreInENGteam.name"}] }