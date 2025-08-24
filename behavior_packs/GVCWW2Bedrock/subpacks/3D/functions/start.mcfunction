function reload

execute @s[tag=!started] ~~~ function gunstart

function sounds

function cooldown

event entity @s ww2

execute @s[tag=!na] ~~~ function react

event entity @e[family=SOV,tag=!free] free
tag @e[family=SOV,tag=!free] add free

event entity @e[family=GER,tag=!free] free
tag @e[family=GER,tag=!free] add free

event entity @e[family=USA,tag=!free] free
tag @e[family=USA,tag=!free] add free

event entity @e[family=JAP,tag=!free] free
tag @e[family=JAP,tag=!free] add free


ride @e[type=addon:f1r,tag=!rider] summon_rider addon:c1 F
tag @e[type=addon:f1r] add rider
ride @e[type=addon:f2r,tag=!rider] summon_rider addon:c2 F
tag @e[type=addon:f2r] add rider
ride @e[type=addon:f3r,tag=!rider] summon_rider addon:c3 F
tag @e[type=addon:f3r] add rider
ride @e[type=addon:f4r,tag=!rider] summon_rider addon:c4 F
tag @e[type=addon:f4r] add rider

