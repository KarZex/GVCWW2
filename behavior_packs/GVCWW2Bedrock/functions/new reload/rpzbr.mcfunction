scoreboard objectives add rrpzb dummy
tag @s[hasitem={item=zex:762m}] add reload
clear @s[hasitem={item=zex:762m}] zex:762m 0 1
execute @s[tag=reload] ~~~ playsound fire.reload @s ~~~
scoreboard players set @s[tag=reload] rrpzb 40