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
        form.button("§6Tank Type§r\nT34");
        form.button("§eAircraft Type§r\nYak-9");
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
                        user.sendMessage("You selected §6Tank Type");
                        user.runCommand(`ride @s summon_ride vehicle:t34`);
                        user.runCommand(`give @s gun:mgg`);
                        user.runCommand(`give @s gun:tank`);
                        break;
                    case 4:
                        user.sendMessage("You selected §eAircraft Type");
                        user.runCommand(`ride @s summon_ride vehicle:yak9`);
                        user.runCommand(`give @s gun:mgg`);
                        user.runCommand(`give @s gun:tank`);
                        user.runCommand(`give @s gun:camera`);
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
        form.button("§6Tank Type§r\nPanzer IV");
        form.button("§eAircraft Type§r\nMesserschmitt Bf 109");
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
                        user.sendMessage("You selected §6Tank Type");
                        user.runCommand(`ride @s summon_ride vehicle:panzer`);
                        user.runCommand(`give @s gun:mgg`);
                        user.runCommand(`give @s gun:tank`);
                        break;
                    case 4:
                        user.sendMessage("You selected §eAircraft Type");
                        user.runCommand(`ride @s summon_ride vehicle:bf109`);
                        user.runCommand(`give @s gun:mgg`);
                        user.runCommand(`give @s gun:tank`);
                        user.runCommand(`give @s gun:camera`);
                        break;
                }
            }
        });
    }
});