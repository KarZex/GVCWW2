execute as @a[tag=reload] run function reload

execute as @a[tag=onDeath] run function death
execute as @a[scores={mcool=1..}] run function mcool
execute as @a[scores={mcooli=1..}] run function mcooli
execute as @a[scores={mcoolii=1..}] run function mcoolii

playanimation @a[hasitem={item=gun:lunge,location=slot.weapon.mainhand}] animation.item.first none 0 "!query.is_item_equipped"

execute as @a run function scool

execute as @a[tag=!startedww2] run function gunstart
execute as @a[tag=down] run function down
execute as @a[tag=rise] run function rise
execute as @e[tag=raid] run function raid/zombietarget

gamemode a @a[m=s,scores={antiMining=1..}]
execute as @a[m=a,scores={antiMining=1..}] run function antiMining

execute as @a[tag=!subattack,scores={subWeapon=1..}] run scoreboard players remove @s subWeapon 1

function sounds

execute if score P building matches 1 run tag @a[tag=!nobomb] add nobomb
execute if score P building matches 0 run tag @a[tag=nobomb] remove nobomb

#particle

kill @e[type=item,name=83a5bfca04b6b421d23c]

gamerule commandblockoutput false

