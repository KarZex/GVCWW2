
execute if entity @e[r=4,type=vehicle:ju87] if entity @s[scores={mcooli=0}] run event entity @s[scores={mtype=1..}] fire:37mmrocket
execute if entity @e[r=4,type=vehicle:ju87] if entity @s[scores={mcooli=0}] run scoreboard players set @s[scores={mtype=1..}] mcooli 50

execute if entity @e[r=4,type=vehicle:ju87] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0}] fire:bomb
execute if entity @e[r=4,type=vehicle:ju87] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0}] mcool 50

execute if entity @e[r=4,type=vehicle:il2] if entity @s[scores={mcooli=0}] run event entity @s[scores={mtype=1..}] fire:37mmrocket
execute if entity @e[r=4,type=vehicle:il2] if entity @s[scores={mcooli=0}] run scoreboard players set @s[scores={mtype=1..}] mcooli 50

execute if entity @e[r=4,type=vehicle:il2] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0}] fire:bomb
execute if entity @e[r=4,type=vehicle:il2] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0}] mcool 50

execute if entity @e[r=4,type=vehicle:b7a] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0..}] fire:bomb
execute if entity @e[r=4,type=vehicle:b7a] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0..}] mcool 50
