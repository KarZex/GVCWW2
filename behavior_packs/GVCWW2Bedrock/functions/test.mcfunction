execute unless block ~~-1~ minecraft:grass_path unless block ~~-1~ air unless block ~~-1~ minecraft:water run event entity @s gvcv5:explode

execute if entity @e[r=4,type=vehicle:aaa] if entity @s[scores={mcoolii=0},hasitem={item=zex:556m,}] run event entity @s[scores={{mtype=2..}}] fire:{1}