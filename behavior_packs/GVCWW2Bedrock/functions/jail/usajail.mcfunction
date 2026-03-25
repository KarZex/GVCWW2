execute positioned ~-42~~-42 run scoreboard players set @a[dx=84,dz=84,family=!USAteam,tag=!working] antiMining 200
kill @e[type=minecraft:tnt_minecart,r=60]
kill @e[type=minecraft:tnt,r=60]
kill @e[family=drop,r=60]
kill @e[family=SOVteam,r=60,type=!minecraft:player]
kill @e[family=GERteam,r=60,type=!minecraft:player]
kill @e[family=JAPteam,r=60,type=!minecraft:player]
kill @e[family=ENGteam,r=60,type=!minecraft:player]
execute positioned ~-42~-320~-42 as @a[dx=84,dy=640,dz=84,tag=USASub,tag=working] run scriptevent zex:jailwork USA
