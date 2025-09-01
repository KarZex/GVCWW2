event entity @s gvcv5:become_USAteam
tag @s remove wantToBeUSA
tellraw @a { "rawtext": [{"selector": "@s"},{ "translate": "script.gvcv5.youAreInUSAteam.name"}] }