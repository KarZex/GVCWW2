import { world, system } from "@minecraft/server";

system.afterEvents.scriptEventReceive.subscribe(async (event) => {
    if( event.id === "gvcww2:flying" ){
        const player = event.sourceEntity;
        if( player.isOnGround ){
            player.kill();
            player.removeTag(`flying`)
        }
         
    }
    if( event.id === "gvcww2:startfly" ){
        const player = event.sourceEntity;
        const m = event.message;
        player.teleport({x:0,y:120,z:0});
        await system.waitTicks(5)
        player.runCommand(`ride @s summon_ride vehicle:${m}`);
        player.addTag(`flying`);
         
    }
});