scoreboard objectives add rm1911 dummy
tag @s[hasitem={item=zex:556p}] add reload
clear @s[hasitem={item=zex:556p}] zex:556p 0 1
execute @s[tag=reload] ~~~ playsound fire.reload @s ~~~
scoreboard players set @s[tag=reload] rm1911 40