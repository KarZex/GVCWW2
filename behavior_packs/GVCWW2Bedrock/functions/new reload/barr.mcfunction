scoreboard objectives add rbar dummy
tag @s[hasitem={item=zex:762p}] add reload
clear @s[hasitem={item=zex:762p}] zex:762p 0 1
execute @s[tag=reload] ~~~ playsound fire.reload @s ~~~
scoreboard players set @s[tag=reload] rbar 40