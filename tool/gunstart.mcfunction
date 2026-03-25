scoreboard objectives add cooldown dummy
scoreboard objectives add weaponi dummy
scoreboard objectives add weaponi_cool dummy
scoreboard objectives add weaponi_max dummy
scoreboard objectives add weaponii dummy
scoreboard objectives add weaponii_cool dummy
scoreboard objectives add weaponii_max dummy
scoreboard objectives add weaponiii dummy
scoreboard objectives add weaponiii_cool dummy
scoreboard objectives add weaponiii_max dummy
scoreboard objectives add weaponiv dummy
scoreboard objectives add weaponiv_cool dummy
scoreboard objectives add weaponiv_max dummy
scoreboard objectives add subWeapon dummy
scoreboard objectives add reloading dummy
scoreboard objectives add flag dummy
scoreboard objectives add antiMining dummy
scoreboard objectives add mtype dummy
scoreboard objectives add maxsubcool dummy

scoreboard objectives add DeathTime dummy
scoreboard objectives add ALLFlags dummy
scoreboard objectives add rise dummy
scoreboard objectives add out dummy
scoreboard objectives add building dummy
scoreboard objectives add printDamage dummy
#initialize
execute as @s[tag=!startedww2] run scoreboard players set @s weaponi 20
execute as @s[tag=!startedww2] run scoreboard players set @s weaponi_cool 0
execute as @s[tag=!startedww2] run scoreboard players set @s weaponi_max 0
execute as @s[tag=!startedww2] run scoreboard players set @s weaponii 0
execute as @s[tag=!startedww2] run scoreboard players set @s weaponii_cool 0
execute as @s[tag=!startedww2] run scoreboard players set @s weaponii_max 0
execute as @s[tag=!startedww2] run scoreboard players set @s weaponiii 0
execute as @s[tag=!startedww2] run scoreboard players set @s weaponiii_cool 0
execute as @s[tag=!startedww2] run scoreboard players set @s weaponiii_max 0
execute as @s[tag=!startedww2] run scoreboard players set @s weaponiv 0
execute as @s[tag=!startedww2] run scoreboard players set @s weaponiv_cool 0
execute as @s[tag=!startedww2] run scoreboard players set @s weaponiv_max 0
execute as @s[tag=!startedww2] run scoreboard players set @s flag 0
execute as @s[tag=!startedww2] run scoreboard players set @s rise 0
execute as @s[tag=!startedww2] run scoreboard players set @s out 10
execute as @s[tag=!startedww2] run scoreboard players set @s antiMining 0
execute as @s[tag=!startedww2] run scoreboard players set @s DeathTime 0
execute as @s[tag=!startedww2] run scoreboard players set @s mtype 0
execute as @s[tag=!startedww2] run scoreboard players set @s printDamage 0
execute as @s run scoreboard players set @s reloading 0
scoreboard objectives add fire dummy
execute as @s[tag=!startedww2] run scoreboard players set @s fire 30
#suppies
execute at @s[tag=!startedww2] run loot give @s loot supplies
#scriptevent
#scriptevent zex:start
#scriptevent gvcv5:phone
#guns
