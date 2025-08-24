#values definistion
scoreboard objectives add cooldown dummy
scoreboard objectives add mcool dummy
scoreboard objectives add mcooli dummy
scoreboard objectives add mcoolii dummy
scoreboard objectives add scool dummy
scoreboard objectives add subWeapon dummy
scoreboard objectives add reloading dummy
scoreboard objectives add flag dummy
scoreboard objectives add antiMining dummy
scoreboard objectives add mtype dummy
scoreboard objectives add maxsubcool dummy

scoreboard objectives add DeathTime dummy
scoreboard objectives add rise dummy
scoreboard objectives add out dummy
scoreboard objectives add building dummy
#initialize
execute as @s[tag=!startedv5] run scoreboard players set @s mcool 20
execute as @s[tag=!startedv5] run scoreboard players set @s mcooli 0
execute as @s[tag=!startedv5] run scoreboard players set @s mcoolii 0
execute as @s[tag=!startedv5] run scoreboard players set @s scool 0
execute as @s[tag=!startedv5] run scoreboard players set @s subWeapon 30
execute as @s[tag=!startedv5] run scoreboard players set @s maxsubcool 0
execute as @s[tag=!startedv5] run scoreboard players set @s flag 0
execute as @s[tag=!startedv5] run scoreboard players set @s rise 0
execute as @s[tag=!startedv5] run scoreboard players set @s out 10
execute as @s[tag=!startedv5] run scoreboard players set @s antiMining 0
execute as @s[tag=!startedv5] run scoreboard players set @s DeathTime 0
execute as @s[tag=!startedv5] run scoreboard players set @s mtype 0
execute as @s run scoreboard players set @s reloading 0
scoreboard objectives add fire dummy
execute as @s[tag=!startedv5] run scoreboard players set @s fire 30
#suppies
execute at @s[tag=!startedv5] run fill ^^^2 ^^^2 gvcv5:supplies
#scriptevent
scriptevent zex:start
scriptevent gvcv5:phone
#guns
scoreboard objectives add mosin dummy
execute as @a[tag=!startedv5] run scoreboard players set @s mosin 5
scoreboard objectives add ppsh dummy
execute as @a[tag=!startedv5] run scoreboard players set @s ppsh 72
scoreboard objectives add dp28 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s dp28 47
scoreboard objectives add tt33 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s tt33 8
scoreboard objectives add k98 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s k98 5
scoreboard objectives add mp40 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s mp40 20
scoreboard objectives add p90 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s p90 1
scoreboard objectives add m870 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m870 4
tag @a[tag=!startedv5] add startedv5
