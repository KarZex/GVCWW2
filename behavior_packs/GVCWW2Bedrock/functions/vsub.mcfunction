tag @s add subattack

execute if entity @e[r=4,type=vehicle:bf109] run event entity @s[scores={subWeapon=..30}] fire:20mmmcair

execute if entity @e[r=4,type=vehicle:bf109] run scoreboard players add @s[scores={subWeapon=..30}] subWeapon 1

scoreboard players set @s maxsubcool 30
execute if entity @e[r=4,type=vehicle:bf109] run scoreboard players set @s scool 2

execute if entity @e[r=4,type=vehicle:ju87] run event entity @s[scores={subWeapon=..30}] fire:7.62mmmgs

execute if entity @e[r=4,type=vehicle:ju87] run scoreboard players add @s[scores={subWeapon=..30}] subWeapon 1

scoreboard players set @s maxsubcool 30

execute if entity @e[r=4,type=vehicle:spitfire] run event entity @s[scores={subWeapon=..30}] fire:20mmmcaird

execute if entity @e[r=4,type=vehicle:spitfire] run scoreboard players add @s[scores={subWeapon=..30}] subWeapon 1

scoreboard players set @s maxsubcool 30
execute if entity @e[r=4,type=vehicle:spitfire] run scoreboard players set @s scool 2

execute if entity @e[r=4,type=vehicle:battle] run event entity @s[scores={subWeapon=..30}] fire:7.62mmmg

execute if entity @e[r=4,type=vehicle:battle] run scoreboard players add @s[scores={subWeapon=..30}] subWeapon 1

scoreboard players set @s maxsubcool 30

execute if entity @e[r=4,type=vehicle:yak9] run event entity @s[scores={subWeapon=..30}] fire:20mmmcair

execute if entity @e[r=4,type=vehicle:yak9] run scoreboard players add @s[scores={subWeapon=..30}] subWeapon 1

scoreboard players set @s maxsubcool 30

execute if entity @e[r=4,type=vehicle:il2] run event entity @s[scores={subWeapon=..30}] fire:20mmmcaird

execute if entity @e[r=4,type=vehicle:il2] run scoreboard players add @s[scores={subWeapon=..30}] subWeapon 1

scoreboard players set @s maxsubcool 30
execute if entity @e[r=4,type=vehicle:il2] run scoreboard players set @s scool 2

execute if entity @e[r=4,type=vehicle:zero] run event entity @s[scores={subWeapon=..30}] fire:20mmmcaird

execute if entity @e[r=4,type=vehicle:zero] run scoreboard players add @s[scores={subWeapon=..30}] subWeapon 1

scoreboard players set @s maxsubcool 30
execute if entity @e[r=4,type=vehicle:zero] run scoreboard players set @s scool 2

execute if entity @e[r=4,type=vehicle:b7a] run event entity @s[scores={subWeapon=..30}] fire:20mmmcaird

execute if entity @e[r=4,type=vehicle:b7a] run scoreboard players add @s[scores={subWeapon=..30}] subWeapon 1

scoreboard players set @s maxsubcool 30
execute if entity @e[r=4,type=vehicle:b7a] run scoreboard players set @s scool 2

execute if entity @e[r=4,type=vehicle:t34] run event entity @s[scores={subWeapon=..30}] fire:vmg

execute if entity @e[r=4,type=vehicle:t34] run scoreboard players add @s[scores={subWeapon=..30}] subWeapon 1

scoreboard players set @s maxsubcool 30
execute if entity @e[r=4,type=vehicle:t34] run scoreboard players set @s scool 2
