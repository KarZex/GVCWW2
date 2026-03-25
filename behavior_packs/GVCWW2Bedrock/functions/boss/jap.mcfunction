##Japanese Boss Flag

effect @e[family=JAPteam,r=60] regeneration 1 2 false
effect @e[family=JAPteam,r=60] resistance 1 4 false

##kill another country's soldiers
damage @e[type=gvcww2:sov_soldier,r=60,type=!player] 1 override
damage @e[type=gvcww2:ger_soldier,r=60,type=!player] 1 override
damage @e[type=gvcww2:usa_soldier,r=60,type=!player] 1 override
damage @e[type=gvcww2:eng_soldier,r=60,type=!player] 1 override

## Another country player cant mine or placing
scoreboard players set @a[r=60,family=!JAPteam,tag=!working] antiMining 200


## warning
title @a[r=60,family=!JAPteam,tag=!working] title "This is Japanese Base"