titleraw @a[scores={DeathTime=1..}] actionbar {"rawtext":[{"text":"\u00A7cYou are dead. Respawn in \u00A7e"} ,{"score":{"name":"@s","objective":"DeathTime"}},{"text":"\u00A7c ticks."}]}
scoreboard players remove @s[scores={DeathTime=1..}] DeathTime 1
execute as @s[tag=onDeath,scores={DeathTime=..0}] run scriptevent zex:spawnpoint
tag @s[tag=onDeath,scores={DeathTime=..0}] remove onDeath