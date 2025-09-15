
execute if entity @e[r=4,type=vehicle:ju87] if entity @s[scores={mcooli=0}] run event entity @s[scores={mtype=1..}] fire:37mmrocket
execute if entity @e[r=4,type=vehicle:ju87] if entity @s[scores={mcooli=0}] run scoreboard players set @s[scores={mtype=1..}] mcooli 50

execute if entity @e[r=4,type=vehicle:ju87] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0}] fire:bomb
execute if entity @e[r=4,type=vehicle:ju87] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0}] mcool 50

execute if entity @e[r=4,type=vehicle:battle] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0..}] fire:bomb
execute if entity @e[r=4,type=vehicle:battle] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0..}] mcool 50

execute if entity @e[r=4,type=vehicle:sbd] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0..}] fire:bomb
execute if entity @e[r=4,type=vehicle:sbd] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0..}] mcool 50

execute if entity @e[r=4,type=vehicle:il2] if entity @s[scores={mcooli=0}] run event entity @s[scores={mtype=1..}] fire:37mmrocket
execute if entity @e[r=4,type=vehicle:il2] if entity @s[scores={mcooli=0}] run scoreboard players set @s[scores={mtype=1..}] mcooli 50

execute if entity @e[r=4,type=vehicle:il2] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0}] fire:bombii
execute if entity @e[r=4,type=vehicle:il2] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0}] mcool 50

execute if entity @e[r=4,type=vehicle:b7a] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0..}] fire:bomb
execute if entity @e[r=4,type=vehicle:b7a] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0..}] mcool 50

execute if entity @e[r=4,type=vehicle:t34] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0..}] fire:85mm
execute if entity @e[r=4,type=vehicle:t34] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0..}] mcool 80

execute if entity @e[r=4,type=vehicle:panzer] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0..}] fire:76mm
execute if entity @e[r=4,type=vehicle:panzer] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0..}] mcool 60

execute if entity @e[r=4,type=vehicle:m4] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0..}] fire:76mm
execute if entity @e[r=4,type=vehicle:m4] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0..}] mcool 60

execute if entity @e[r=4,type=vehicle:t97t] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0..}] fire:47mm
execute if entity @e[r=4,type=vehicle:t97t] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0..}] mcool 30

execute if entity @e[r=4,type=vehicle:valentine] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0..}] fire:57mm
execute if entity @e[r=4,type=vehicle:valentine] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0..}] mcool 40

execute if entity @e[r=4,type=vehicle:kv2] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0..}] fire:152mm
execute if entity @e[r=4,type=vehicle:kv2] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0..}] mcool 160

execute if entity @e[r=4,type=vehicle:tiger] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0..}] fire:88mm
execute if entity @e[r=4,type=vehicle:tiger] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0..}] mcool 80

execute if entity @e[r=4,type=vehicle:t98t] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0..}] fire:37mm
execute if entity @e[r=4,type=vehicle:t98t] if entity @s[scores={mcool=0}] run scoreboard players set @s[scores={mtype=0..}] mcool 20

execute if entity @e[r=4,type=vehicle:t17e1] if entity @s[scores={mcool=0}] run event entity @s[scores={mtype=0..}] fire:37mm
