### 30 second work ### coal iron copper
execute if entity @p[r=1,hasitem={item=minecraft:coal,quantity=1..}] run loot insert ~~1~-2 loot "submit/coal"
scoreboard players remove @p[r=1,hasitem={item=minecraft:coal,quantity=1..}] DeathTime 600
clear @p[r=1,hasitem={item=minecraft:coal,quantity=1..}] minecraft:coal 0 1
execute if entity @p[r=1,hasitem={item=minecraft:raw_iron,quantity=1..}] run loot insert ~~1~-2 loot "submit/raw_iron"
scoreboard players remove @p[r=1,hasitem={item=minecraft:raw_iron,quantity=1..}] DeathTime 600
clear @p[r=1,hasitem={item=minecraft:raw_iron,quantity=1..}] minecraft:raw_iron 0 1
execute if entity @p[r=1,hasitem={item=minecraft:raw_copper,quantity=1..}] run loot insert ~~1~-2 loot "submit/raw_copper"
scoreboard players remove @p[r=1,hasitem={item=minecraft:raw_copper,quantity=1..}] DeathTime 600
clear @p[r=1,hasitem={item=minecraft:raw_copper,quantity=1..}] minecraft:raw_copper 0 1


### 60 second work ### gold lapis redstone emerald
execute if entity @p[r=1,hasitem={item=minecraft:raw_gold,quantity=1..}] run loot insert ~~1~-2 loot "submit/raw_gold"
scoreboard players remove @p[r=1,hasitem={item=minecraft:raw_gold,quantity=1..}] DeathTime 1200
clear @p[r=1,hasitem={item=minecraft:raw_gold,quantity=1..}] minecraft:raw_gold 0 1
execute if entity @p[r=1,hasitem={item=minecraft:lapis_lazuli,quantity=1..}] run loot insert ~~1~-2 loot "submit/lapis"
scoreboard players remove @p[r=1,hasitem={item=minecraft:lapis_lazuli,quantity=1..}] DeathTime 1200
clear @p[r=1,hasitem={item=minecraft:lapis_lazuli,quantity=1..}] minecraft:lapis_lazuli 0 1
execute if entity @p[r=1,hasitem={item=minecraft:redstone,quantity=1..}] run loot insert ~~1~-2 loot "submit/redstone"
scoreboard players remove @p[r=1,hasitem={item=minecraft:redstone,quantity=1..}] DeathTime 1200
clear @p[r=1,hasitem={item=minecraft:redstone,quantity=1..}] minecraft:redstone 0 1
execute if entity @p[r=1,hasitem={item=minecraft:emerald,quantity=1..}] run loot insert ~~1~-2 loot "submit/emerald"
scoreboard players remove @p[r=1,hasitem={item=minecraft:emerald,quantity=1..}] DeathTime 1200  
clear @p[r=1,hasitem={item=minecraft:emerald,quantity=1..}] minecraft:emerald 0 1

### 300 second work ### diamond 
execute if entity @p[r=1,hasitem={item=minecraft:diamond,quantity=1..}] run loot insert ~~1~-2 loot "submit/diamond"
scoreboard players remove @p[r=1,hasitem={item=minecraft:diamond,quantity=1..}] DeathTime 6000
clear @p[r=1,hasitem={item=minecraft:diamond,quantity=1..}] minecraft:diamond 0 1