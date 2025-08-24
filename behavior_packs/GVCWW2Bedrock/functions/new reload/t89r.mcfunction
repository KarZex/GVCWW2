scoreboard objectives add rt89 dummy
tag @s[scores={t89=..4},hasitem={item=zex:762m}] add reload
clear @s[scores={t89=..4},hasitem={item=zex:762m}] zex:762m 0 1
execute @s[tag=reload] ~~~ playsound fire.reload @s ~~~
scoreboard players set @s[tag=reload] rt89 10