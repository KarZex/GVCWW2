effect @s[tag=!ride] health_boost 99999 70 true
effect @s[tag=!ride] instant_health 1 255 true

execute as @s[tag=!ride] if entity @e[r=4,type=vehicle:bf109] run event entity @s 20mmmcair

execute as @s[tag=!ride] if entity @e[r=4,type=vehicle:ju87] run event entity @s bomb

execute as @s[tag=!ride] if entity @e[r=4,type=vehicle:spitfire] run event entity @s 20mmmcaird

execute as @s[tag=!ride] if entity @e[r=4,type=vehicle:battle] run event entity @s bomb

execute as @s[tag=!ride] if entity @e[r=4,type=vehicle:yak9] run event entity @s 20mmmcair

execute as @s[tag=!ride] if entity @e[r=4,type=vehicle:il2] run event entity @s bomb

execute as @s[tag=!ride] if entity @e[r=4,type=vehicle:zero] run event entity @s 20mmmcaird

execute as @s[tag=!ride] if entity @e[r=4,type=vehicle:b7a] run event entity @s bomb

execute as @s[tag=!ride] if entity @e[r=4,type=vehicle:kv2] run event entity @s 152mm

execute as @s[tag=!ride] if entity @e[r=4,type=vehicle:t34] run event entity @s 85mm
