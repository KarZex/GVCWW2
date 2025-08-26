tag @s add subattack

execute if entity @e[r=4,type=vehicle:bf109] run event entity @s[scores={subWeapon=..30}] fire:23mmmcair

execute if entity @e[r=4,type=vehicle:bf109] run scoreboard players add @s[scores={subWeapon=..30}] subWeapon 1

scoreboard players set @s maxsubcool 30

execute if entity @e[r=4,type=vehicle:ju87] run event entity @s[scores={subWeapon=..30}] fire:30mmmcair

execute if entity @e[r=4,type=vehicle:ju87] run scoreboard players add @s[scores={subWeapon=..30}] subWeapon 1

scoreboard players set @s maxsubcool 30
