effect @s[tag=!ride] health_boost 99999 70 true
effect @s[tag=!ride] instant_health 1 255 true

execute as @s[tag=!ride] if entity @e[r=4,type=vehicle:bf109] run event entity @s 23mmmcair

execute as @s[tag=!ride] if entity @e[r=4,type=vehicle:ju87] run event entity @s bomb

execute as @s[tag=!ride] if entity @e[r=4,type=vehicle:spitfire] run event entity @s 23mmmcair
