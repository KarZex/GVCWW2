function reload

execute @s[tag=!started] ~~~ function gunstart

function sounds

function cooldown

event entity @s ww2

execute @s[tag=!na] ~~~ function react

execute @a[family=!SOV] ~~~ event entity @e[family=SOV,tag=!free] free
execute @a[family=!SOV] ~~~ tag @e[family=SOV,tag=!free] add free
execute @a[family=SOV] ~~~ event entity @e[family=SOV,tag=free] attack
execute @a[family=SOV] ~~~ tag @e[family=SOV,tag=free] remove free

execute @a[family=!GER] ~~~ event entity @e[family=GER,tag=!free] free
execute @a[family=!GER] ~~~ tag @e[family=GER,tag=!free] add free
execute @a[family=GER] ~~~ event entity @e[family=GER,tag=free] attack
execute @a[family=GER] ~~~ tag @e[family=GER,tag=free] remove free

execute @a[family=!USA] ~~~ event entity @e[family=USA,tag=!free] free
execute @a[family=!USA] ~~~ tag @e[family=USA,tag=!free] add free
execute @a[family=USA] ~~~ event entity @e[family=USA,tag=free] attack
execute @a[family=USA] ~~~ tag @e[family=USA,tag=free] remove free

execute @a[family=!JAP] ~~~ event entity @e[family=JAP,tag=!free] free
execute @a[family=!JAP] ~~~ tag @e[family=JAP,tag=!free] add free
execute @a[family=JAP] ~~~ event entity @e[family=JAP,tag=free] attack
execute @a[family=JAP] ~~~ tag @e[family=JAP,tag=free] remove free


ride @e[type=addon:f1r,tag=!rider] summon_rider addon:c1 F
tag @e[type=addon:f1r] add rider
ride @e[type=addon:f2r,tag=!rider] summon_rider addon:c2 F
tag @e[type=addon:f2r] add rider
ride @e[type=addon:f3r,tag=!rider] summon_rider addon:c3 F
tag @e[type=addon:f3r] add rider
ride @e[type=addon:f4r,tag=!rider] summon_rider addon:c4 F
tag @e[type=addon:f4r] add rider

