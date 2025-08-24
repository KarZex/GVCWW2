scoreboard objectives add rm1 dummy
tag @s[hasitem={item=zex:556m}] add reload
clear @s[hasitem={item=zex:556m}] zex:556m 0 1
execute @s[tag=reload] ~~~ playsound fire.reload @s ~~~
scoreboard players set @s[tag=reload] rm1 40