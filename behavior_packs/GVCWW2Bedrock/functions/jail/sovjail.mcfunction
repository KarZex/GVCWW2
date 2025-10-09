execute positioned ~-42~~-42 run scoreboard players set @a[dx=84,dz=84,family=!SOVteam,tag=!working] antiMining 200
kill @e[type=minecraft:tnt_minecart,r=60]
kill @e[type=minecraft:tnt,r=60]
kill @e[family=drop,r=60]
kill @e[family=air,r=60]
execute positioned ~-42~-320~-42 as @a[dx=84,dy=640,dz=84,tag=SOVSub,tag=working] run scriptevent zex:jailwork SOV
