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
scoreboard objectives add mosin dummy
execute as @a[tag=!startedww2] run scoreboard players set @s mosin 5
scoreboard objectives add ppsh dummy
execute as @a[tag=!startedww2] run scoreboard players set @s ppsh 72
scoreboard objectives add dp28 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s dp28 47
scoreboard objectives add tt33 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s tt33 8
scoreboard objectives add ptrd dummy
execute as @a[tag=!startedww2] run scoreboard players set @s ptrd 1
scoreboard objectives add k98 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s k98 5
scoreboard objectives add mp40 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s mp40 32
scoreboard objectives add stg44 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s stg44 30
scoreboard objectives add mg42 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s mg42 75
scoreboard objectives add p90 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s p90 1
scoreboard objectives add p38 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s p38 8
scoreboard objectives add m1 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s m1 8
scoreboard objectives add spring dummy
execute as @a[tag=!startedww2] run scoreboard players set @s spring 5
scoreboard objectives add bar dummy
execute as @a[tag=!startedww2] run scoreboard players set @s bar 20
scoreboard objectives add thom dummy
execute as @a[tag=!startedww2] run scoreboard players set @s thom 20
scoreboard objectives add m1911 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s m1911 8
scoreboard objectives add m1b dummy
execute as @a[tag=!startedww2] run scoreboard players set @s m1b 1
scoreboard objectives add leemk4 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s leemk4 10
scoreboard objectives add piat dummy
execute as @a[tag=!startedww2] run scoreboard players set @s piat 1
scoreboard objectives add lewis dummy
execute as @a[tag=!startedww2] run scoreboard players set @s lewis 47
scoreboard objectives add brengun dummy
execute as @a[tag=!startedww2] run scoreboard players set @s brengun 30
scoreboard objectives add stengun dummy
execute as @a[tag=!startedww2] run scoreboard players set @s stengun 32
scoreboard objectives add welrod dummy
execute as @a[tag=!startedww2] run scoreboard players set @s welrod 6
scoreboard objectives add t38 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s t38 5
scoreboard objectives add t100 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s t100 30
scoreboard objectives add t99 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s t99 30
scoreboard objectives add t14 dummy
execute as @a[tag=!startedww2] run scoreboard players set @s t14 8
scoreboard objectives add t89g dummy
execute as @a[tag=!startedww2] run scoreboard players set @s t89g 1
tag @a[tag=!startedww2] add startedww2
