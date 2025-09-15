import { world, system } from "@minecraft/server";
system.afterEvents.scriptEventReceive.subscribe(async (event) => {
    if( event.id === "gvcww2:flying" ){
        const player = event.sourceEntity;
        if( player.isOnGround ){
            player.kill();
            player.removeTag(`flying`)
        }
         
    }
    if( event.id === "gvcww2:selectWeaponSOV" ){
        const user = event.sourceEntity;
        const form = new ActionFormData();
        form.title("Soviet Team Weapon Selection");
        form.body("Select your weapon type:");
        form.button("§3SMG Type§r\nPPSh41,TT33");
        form.button("§1Rifle Type§r\nMosin,TT33");
        form.button("§2LMG Type§r\nDP28,TT33");
        if( world.scoreboard.getObjective("cool").getScore(`SOV`) >= 6000 ){
            form.button("§6Vehicle Option§r");
        }
        form.show(user).then(result => {
            if(!result.canceled){
                switch(result.selection){
                    case 0:
                        user.sendMessage("You selected §3SMG Type");
                        user.runCommand(`give @s minecraft:iron_sword`);//Melee Weapon
                        user.runCommand(`give @s gun:ppsh`);
                        user.runCommand(`give @s gun:tt33`);
                        user.runCommand(`give @s zex:mm9 600`);
                        user.runCommand(`give @s gvcv5:fragment 4`);//Grenade
                        user.runCommand(`give @s zex:aidkit 2`);//Aid Kit
                        break;
                    case 1:
                        user.sendMessage("You selected §1Rifle Type");
                        user.runCommand(`give @s minecraft:iron_sword`);
                        user.runCommand(`give @s gun:mosin`);
                        user.runCommand(`give @s gun:tt33`);
                        user.runCommand(`give @s zex:762m 120`);
                        user.runCommand(`give @s gvcv5:fragment 4`);//Grenade
                        user.runCommand(`give @s zex:aidkit 2`);//Aid Kitq
                        break;
                    case 2:
                        user.sendMessage("You selected §2LMG Type");
                        user.runCommand(`give @s minecraft:iron_sword`);
                        user.runCommand(`give @s gun:dp28`);
                        user.runCommand(`give @s gun:tt33`);
                        user.runCommand(`give @s zex:762m 240`);
                        user.runCommand(`give @s gvcv5:fragment 4`);
                        user.runCommand(`give @s zex:aidkit 2`);//Aid Kit
                        break;
                    case 3://Tank
                        user.sendMessage("You selected §6Vehicle Option");
                        const vehicle_form = new ActionFormData();
                        vehicle_form.title("Vehicle Selection");
                        vehicle_form.body("Select your vehicle type:");
                        vehicle_form.button("§6Medium Tank Type§r\nT34");
                        vehicle_form.button("§4Heavy Tank Type§r\nKV2");
                        vehicle_form.button("§eFighter Type§r\nYak-9");
                        vehicle_form.button("§bCAS Type§r\nIL2");
                        vehicle_form.show(user).then(result => {
                            if(!result.canceled){
                                user.runCommand(`give @s gun:camera 1`);
                                user.runCommand(`give @s gun:mgg 1`);
                                user.runCommand(`give @s gun:tank 1`);
                                user.runCommand(`give @s zex:mtype 1`); 
                                world.scoreboard.getObjective("cool").addScore(`SOV`, -6000);
                                switch(result.selection){
                                    case 0:
                                        user.sendMessage("You selected §6Medium Tank Type");
                                        user.runCommand(`ride @s summon_ride vehicle:t34`);
                                        break;
                                    case 1:
                                        user.sendMessage("You selected §4Heavy Tank Type");
                                        user.runCommand(`ride @s summon_ride vehicle:kv2`);
                                        break;
                                    case 2:
                                        user.sendMessage("You selected §eFighter Type");
                                        user.runCommand(`ride @s summon_ride vehicle:yak9`);
                                        break;
                                    case 3:
                                        user.sendMessage("You selected §bCAS Type");
                                        user.runCommand(`ride @s summon_ride vehicle:il2`);
                                        break;
                                }
                            }
                        });
                        break;
                }
            }
        });
    }
    if( event.id === "gvcww2:selectWeaponGER" ){
        const user = event.sourceEntity;
        const form = new ActionFormData();
        form.title("German Team Weapon Selection");
        form.body("Select your weapon type:");
        form.button("§4Assault Type§r\nSTG44,Panzerfaust");
        form.button("§3SMG Type§r\nMP40,Panzerfaust");
        //form.button("§2LMG Type§r\nMG42,P38");
        form.button("§1Ryfle Type§r\nKar98k, P38");
        form.button("§6Vehicle Option§r");
        form.show(user).then(result => {
            if(!result.canceled){
                switch(result.selection){
                    case 0:
                        user.sendMessage("You selected §4Assault Type");
                        user.runCommand(`give @s minecraft:iron_sword`);//Melee Weapon
                        user.runCommand(`give @s gun:stg44`);//STG44
                        user.runCommand(`give @s gun:p90`);//Panzerfaust
                        user.runCommand(`give @s zex:762m 240`);
                        user.runCommand(`give @s zex:rocketm 4`);
                        user.runCommand(`give @s gvcv5:fragment 4`);//Grenade
                        user.runCommand(`give @s zex:aidkit 2`);//Aid Kit
                        break;
                    case 1:
                        user.sendMessage("You selected §3SMG Type");
                        user.runCommand(`give @s minecraft:iron_sword`);//Melee Weapon
                        user.runCommand(`give @s gun:mp40`);
                        user.runCommand(`give @s gun:p90`);
                        user.runCommand(`give @s zex:mm9 320`);
                        user.runCommand(`give @s zex:rocketm 4`);
                        user.runCommand(`give @s gvcv5:fragment 4`);//Grenade
                        user.runCommand(`give @s zex:aidkit 2`);//Aid Kit
                        break;
                    case 2: //Sniper
                        user.sendMessage("You selected §1Sniper Type");
                        user.runCommand(`give @s minecraft:iron_sword`);//Melee Weapon
                        user.runCommand(`give @s gun:k98`);
                        user.runCommand(`give @s gun:p38`);
                        user.runCommand(`give @s zex:762m 64`);
                        user.runCommand(`give @s zex:rocketm 4`);
                        user.runCommand(`give @s gvcv5:fragment 4`);
                        break;
                    case 3://Tank
                        user.sendMessage("You selected §6Vehicle Option");
                        const vehicle_form = new ActionFormData();
                        vehicle_form.title("Vehicle Selection");
                        vehicle_form.body("Select your vehicle type:");
                        vehicle_form.button("§4Medium Tank Type§r\nPanzer IV");
                        vehicle_form.button("§3Heavy Tank Type§r\nTiger I");
                        vehicle_form.button("§eFighter Type§r\nbf109");
                        vehicle_form.button("§bCAS Type§r\nJu87");
                        vehicle_form.show(user).then(result => {
                            if(!result.canceled){
                                user.runCommand(`give @s gun:camera 1`);
                                user.runCommand(`give @s gun:mgg 1`);
                                user.runCommand(`give @s gun:tank 1`);
                                user.runCommand(`give @s zex:mtype 1`); 
                                world.scoreboard.getObjective("cool").addScore(`GER`, -6000);
                                switch(result.selection){
                                    case 0:
                                        user.sendMessage("You selected §4Medium Tank Type");
                                        user.runCommand(`ride @s summon_ride vehicle:panzer`);
                                        break;
                                    case 1:
                                        user.sendMessage("You selected §3Heavy Tank Type");
                                        user.runCommand(`ride @s summon_ride vehicle:tiger`);
                                        break;
                                    case 2:
                                        user.sendMessage("You selected §eFighter Type");
                                        user.runCommand(`ride @s summon_ride vehicle:bf109`);
                                        break;
                                    case 3:
                                        user.sendMessage("You selected §bCAS Type");
                                        user.runCommand(`ride @s summon_ride vehicle:ju87`);
                                        break;
                                }

                            }
                        });
                        break;
                }
            }
        });
    }
});