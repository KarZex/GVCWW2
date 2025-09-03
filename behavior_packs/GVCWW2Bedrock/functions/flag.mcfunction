#SOV - Soviet Union
execute at @s[scores={flag=0},family=SOVteam] run event entity @e[type=gvcww2:sov_soldier,r=15] wait
execute at @s[scores={flag=1},family=SOVteam] run event entity @e[type=gvcww2:sov_soldier,r=15] follow
execute at @s[scores={flag=2},family=SOVteam] run event entity @e[type=gvcww2:sov_soldier,r=15] attack
execute at @s[scores={flag=2},family=SOVteam] run ride @e[family=SOVteam,type=!player,r=15] stop_riding

#GER - Nazi Germany
execute at @s[scores={flag=0},family=GERteam] run event entity @e[type=gvcww2:ger_soldier,r=15] wait
execute at @s[scores={flag=1},family=GERteam] run event entity @e[type=gvcww2:ger_soldier,r=15] follow
execute at @s[scores={flag=2},family=GERteam] run event entity @e[type=gvcww2:ger_soldier,r=15] attack
execute at @s[scores={flag=2},family=GERteam] run ride @e[family=GERteam,type=!player,r=15] stop_riding

#USA - United States
execute at @s[scores={flag=0},family=USAteam] run event entity @e[type=gvcww2:usa_soldier,r=15] wait
execute at @s[scores={flag=1},family=USAteam] run event entity @e[type=gvcww2:usa_soldier,r=15] follow
execute at @s[scores={flag=2},family=USAteam] run event entity @e[type=gvcww2:usa_soldier,r=15] attack
execute at @s[scores={flag=2},family=USAteam] run ride @e[family=USAteam,type=!player,r=15] stop_riding

#JAP - Empire of Japan
execute at @s[scores={flag=0},family=JAPteam] run event entity @e[type=gvcww2:jap_soldier,r=15] wait
execute at @s[scores={flag=1},family=JAPteam] run event entity @e[type=gvcww2:jap_soldier,r=15] follow
execute at @s[scores={flag=2},family=JAPteam] run event entity @e[type=gvcww2:jap_soldier,r=15] attack
execute at @s[scores={flag=2},family=JAPteam] run ride @e[family=JAPteam,type=!player,r=15] stop_riding

#ENG - United Kingdom
execute at @s[scores={flag=0},family=ENGteam] run event entity @e[type=gvcww2:eng_soldier,r=15] wait
execute at @s[scores={flag=1},family=ENGteam] run event entity @e[type=gvcww2:eng_soldier,r=15] follow
execute at @s[scores={flag=2},family=ENGteam] run event entity @e[type=gvcww2:eng_soldier,r=15] attack  
execute at @s[scores={flag=2},family=ENGteam] run ride @e[family=ENGteam,type=!player,r=15] stop_riding

execute at @s[scores={flag=0}] run ride @e[family=noteam,type=!player,r=15] stop_riding
scoreboard players add @s flag 1
scoreboard players set @s[scores={flag=3..}] flag 0