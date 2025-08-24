scoreboard objectives add rt100 dummy
tag @s[hasitem={item=zex:556p}] add reload
clear @s[hasitem={item=zex:556p}] zex:556p 0 1
execute @s[tag=reload] ~~~ playsound fire.reload @s ~~~
scoreboard players set @s[tag=reload] rt100 40