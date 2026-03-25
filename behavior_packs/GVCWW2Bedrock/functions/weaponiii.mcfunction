tag @s add weaponiiiattack

execute if entity @e[r=7,type=vehicle:ju87] run event entity @s[scores={weaponiii=..8},hasitem={item=zex:s37m}] fire:37mmrocket

execute if entity @e[r=7,type=vehicle:ju87] run clear @s[scores={weaponiii=..8},hasitem={item=zex:s37m}] zex:s37m 0 1

execute if entity @e[r=7,type=vehicle:ju87] run scoreboard players add @s[scores={weaponiii=..8},hasitem={item=zex:s37m}] weaponiii 1

execute if entity @e[r=7,type=vehicle:ju87] run scoreboard players set @s weaponiii_max 8
execute if entity @e[r=7,type=vehicle:ju87] run scoreboard players set @s weaponiii_cool 51

execute if entity @e[r=7,type=vehicle:il2] run event entity @s[scores={weaponiii=..8},hasitem={item=zex:s37m}] fire:37mmrocket

execute if entity @e[r=7,type=vehicle:il2] run clear @s[scores={weaponiii=..8},hasitem={item=zex:s37m}] zex:s37m 0 1

execute if entity @e[r=7,type=vehicle:il2] run scoreboard players add @s[scores={weaponiii=..8},hasitem={item=zex:s37m}] weaponiii 1

execute if entity @e[r=7,type=vehicle:il2] run scoreboard players set @s weaponiii_max 8
execute if entity @e[r=7,type=vehicle:il2] run scoreboard players set @s weaponiii_cool 51
