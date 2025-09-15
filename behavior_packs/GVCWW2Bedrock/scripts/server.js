import { world, system } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
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
        form.button("§4Anti-Tank Type§r\nPTRD,TT33");
        if( world.scoreboard.getObjective("cool").getScore(`SOV`) >= 6000 ){
            form.button("§6Vehicle Option§r");
        }
        form.show(user).then(result => {
            if(!result.canceled){
                user.runCommand(`give @s gvcv5:fragment 4`);//Grenade
                user.runCommand(`give @s zex:aidkit 2`);//Aid Kit
                user.runCommand(`give @s bread 64`);//Aid Kit
                switch(result.selection){
                    case 0:
                        user.sendMessage("You selected §3SMG Type");
                        user.runCommand(`give @s minecraft:iron_sword`);//Melee Weapon
                        user.runCommand(`give @s gun:ppsh`);
                        user.runCommand(`give @s gun:tt33`);
                        user.runCommand(`give @s zex:mm9 600`);
                        break;
                    case 1:
                        user.sendMessage("You selected §1Rifle Type");
                        user.runCommand(`give @s minecraft:iron_sword`);
                        user.runCommand(`give @s gun:mosin`);
                        user.runCommand(`give @s gun:tt33`);
                        user.runCommand(`give @s zex:762m 120`);
                        break;
                    case 2:
                        user.sendMessage("You selected §2LMG Type");
                        user.runCommand(`give @s minecraft:iron_sword`);
                        user.runCommand(`give @s gun:dp28`);
                        user.runCommand(`give @s gun:tt33`);
                        user.runCommand(`give @s zex:762m 240`);
                        break;
                    case 3:
                        user.sendMessage("You selected §2LMG Type");
                        user.runCommand(`give @s minecraft:iron_sword`);
                        user.runCommand(`give @s gun:ptrd`);
                        user.runCommand(`give @s gun:tt33`);
                        user.runCommand(`give @s zex:1270m 16`);
                        user.runCommand(`give @s zex:762m 240`);
                        break;
                    case 4://Tank
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
        form.button("§2LMG Type§r\nMG42,P38");
        form.button("§1Ryfle Type§r\nKar98k, P38");
        if( world.scoreboard.getObjective("cool").getScore(`GER`) >= 6000 ){
            form.button("§6Vehicle Option§r");
        }
        form.show(user).then(result => {
            user.runCommand(`give @s gvcv5:fragment 4`);//Grenade
            user.runCommand(`give @s zex:aidkit 2`);//Aid Kit
            user.runCommand(`give @s bread 64`);//Aid Kit
            if(!result.canceled){
                switch(result.selection){
                    case 0:
                        user.sendMessage("You selected §4Assault Type");
                        user.runCommand(`give @s minecraft:iron_sword`);//Melee Weapon
                        user.runCommand(`give @s gun:stg44`);//STG44
                        user.runCommand(`give @s gun:p90`);//Panzerfaust
                        user.runCommand(`give @s zex:762m 240`);
                        user.runCommand(`give @s zex:rocketm 16`);
                        break;
                    case 1:
                        user.sendMessage("You selected §3SMG Type");
                        user.runCommand(`give @s minecraft:iron_sword`);//Melee Weapon
                        user.runCommand(`give @s gun:mp40`);
                        user.runCommand(`give @s gun:p90`);
                        user.runCommand(`give @s zex:mm9 320`);
                        user.runCommand(`give @s zex:rocketm 16`);
                        break;
                    case 2: //Sniper
                        user.sendMessage("You selected §2LMG Type");
                        user.runCommand(`give @s minecraft:iron_sword`);//Melee Weapon
                        user.runCommand(`give @s gun:mg42`);
                        user.runCommand(`give @s gun:p38`);
                        user.runCommand(`give @s zex:762m 600`);
                        break;
                    case 3: //Sniper
                        user.sendMessage("You selected §1Sniper Type");
                        user.runCommand(`give @s minecraft:iron_sword`);//Melee Weapon
                        user.runCommand(`give @s gun:k98`);
                        user.runCommand(`give @s gun:p38`);
                        user.runCommand(`give @s zex:762m 64`);
                        break;
                    case 4://Tank
                        user.sendMessage("You selected §6Vehicle Option");
                        const vehicle_form = new ActionFormData();
                        vehicle_form.title("Vehicle Selection");
                        vehicle_form.body("Select your vehicle type:");
                        vehicle_form.button("§4Medium Tank Type§r\nPanzer IV");
                        vehicle_form.button("§3Heavy Tank Type§r\nTiger I");
                        vehicle_form.button("§2Anti-Air Type§r\nWirbelwind");
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
                                        user.sendMessage("You selected §2Anti-Air Type");
                                        user.runCommand(`ride @s summon_ride vehicle:wirblwind`);
                                        break;
                                    case 3:
                                        user.sendMessage("You selected §eFighter Type");
                                        user.runCommand(`ride @s summon_ride vehicle:bf109`);
                                        break;
                                    case 4:
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
    if( event.id === "gvcww2:selectWeaponENG" ){
        const user = event.sourceEntity;
        const form = new ActionFormData();
        form.title("British Team Weapon Selection");
        form.body("Select your weapon type:");
        form.button("§4Assault Type§r\nBren,PIAT");
        form.button("§3SMG Type§r\nSten,PIAT");
        form.button("§2LMG Type§r\nLewis,M1911");
        form.button("§1Rifle Type§r\nLee-Enfield,M1911");
        if( world.scoreboard.getObjective("tankcool").getScore(`ENG`) >= 6000 ){
            form.button("§6Vehicle Option§r");
        }
        form.show(user).then(result => {
            user.runCommand(`give @s gvcv5:fragment 4`);
            user.runCommand(`give @s zex:aidkit 2`);//Aid Kit
            user.runCommand(`give @s bread 64`);//Aid Kit
            if(!result.canceled){
                switch(result.selection){
                    case 0:
                        user.sendMessage("You selected §4Assault Type");
                        user.runCommand(`give @s minecraft:iron_sword`);//Melee Weapon
                        user.runCommand(`give @s gun:bren`);//Bren
                        user.runCommand(`give @s gun:piat`);
                        user.runCommand(`give @s zex:762m 240`);
                        user.runCommand(`give @s zex:rocketm 16`);
                        break;
                    case 1:
                        user.sendMessage("You selected §3SMG Type");
                        user.runCommand(`give @s minecraft:iron_sword`);//Melee Weapon
                        user.runCommand(`give @s gun:sten`);
                        user.runCommand(`give @s gun:piat`);
                        user.runCommand(`give @s zex:mm9 320`);
                        user.runCommand(`give @s zex:rocketm 16`);
                        break;
                    case 2: //Sniper
                        user.sendMessage("You selected §2LMG Type");
                        user.runCommand(`give @s minecraft:iron_sword`);//Melee Weapon
                        user.runCommand(`give @s gun:lewis`);
                        user.runCommand(`give @s gun:m1911`);
                        user.runCommand(`give @s zex:762m 600`);
                        break;  
                    case 3: //Sniper
                        user.sendMessage("You selected §1Rifle Type");
                        user.runCommand(`give @s minecraft:iron_sword`);//Melee Weapon
                        user.runCommand(`give @s gun:lee`);
                        user.runCommand(`give @s gun:m1911`);
                        user.runCommand(`give @s zex:762m 64`);
                        break;
                    case 4://Tank
                        user.sendMessage("You selected §6Vehicle Option");
                        const vehicle_form = new ActionFormData();
                        vehicle_form.title("Vehicle Selection");
                        vehicle_form.body("Select your vehicle type:");
                        vehicle_form.button("§4Medium Tank Type§r\nValentine");
                        vehicle_form.button("§3APC Type§r\nT17E1");
                        vehicle_form.button("§2Anti-Air Type§r\nT17E2");
                        vehicle_form.button("§eFighter Type§r\nSpitfire");
                        vehicle_form.button("§bCAS Type§r\nBattle");
                        vehicle_form.show(user).then(result => {
                            if(!result.canceled){
                                user.runCommand(`give @s gun:camera 1`);
                                user.runCommand(`give @s gun:mgg 1`);
                                user.runCommand(`give @s gun:tank 1`);
                                user.runCommand(`give @s zex:mtype 1`); 
                                world.scoreboard.getObjective("tankcool").addScore(`ENG`, -6000);
                                switch(result.selection){
                                    case 0:
                                        user.sendMessage("You selected §4Medium Tank Type");
                                        user.runCommand(`ride @s summon_ride vehicle:valentine`);
                                        break;
                                    case 1:
                                        user.sendMessage("You selected §3APC Type");
                                        user.runCommand(`ride @s summon_ride vehicle:t17e1`);
                                        break;
                                    case 2:
                                        user.sendMessage("You selected §2Anti-Air Type");
                                        user.runCommand(`ride @s summon_ride vehicle:t17e2`);
                                        break;
                                    case 3:
                                        user.sendMessage("You selected §eFighter Type");
                                        user.runCommand(`ride @s summon_ride vehicle:spitfire`);
                                        break;
                                    case 4:
                                        user.sendMessage("You selected §bCAS Type");
                                        user.runCommand(`ride @s summon_ride vehicle:battle`);
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

world.afterEvents.entityDie.subscribe( e => {
    if( e.deadEntity.hasTag(`SOV`) ){
        world.scoreboard.getObjective(`kills`).addScore(`§8Germany`,1);
    }
    if( e.deadEntity.hasTag(`GER`) ){
        world.scoreboard.getObjective(`kills`).addScore(`§4Soviet`,1);
    }
} )

world.afterEvents.playerSpawn.subscribe( async e =>{
    const player = e.player;
    if( player.hasTag(`SOV`) ){
        player.runCommand(`scriptevent gvcww2:selectWeaponSOV`);
        player.teleport({ x:-70,y:30,z:196 })
    }
    else if(player.hasTag(`GER`)){
        player.runCommand(`scriptevent gvcww2:selectWeaponGER`);
        player.teleport({ x:10,y:30,z:-128 })
    }
    else{
        player.teleport({ x:-303,y:23,z:-303 })
    }
} )