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
        const form = new ActionFormData();
        form.title("GERチーム兵科選択");
        form.body("兵科を選択してください");
        form.button("アサルト");
        form.button("SMG");
        form.button("LMG");
        form.button("スナイパー");
        form.button("戦車");
        form.button("飛行機");
        form.show(user).then(result => {
            if(!result.canceled){
                switch(result.selection){
                    case 0:
                        user.sendMessage("アサルトを選択しました");
                        user.runCommand(`give @s gun:stg44`);
                        user.runCommand(`give @s gun:p90`);
                        user.runCommand(`give @s zex:762m 180`);
                        break;
                    case 1:
                        user.sendMessage("SMGを選択しました");
                        // SMG用の処理
                        break;
                    case 2:
                        user.sendMessage("LMGを選択しました");
                        // LMG用の処理
                        break;
                    case 3:
                        user.sendMessage("スナイパーを選択しました");
                        // スナイパー用の処理
                        break;
                    case 4:
                        user.sendMessage("戦車を選択しました");
                        // 戦車用の処理
                        break;
                    case 5:
                        user.sendMessage("飛行機を選択しました");
                        // 飛行機用の処理
                        break;
                }
            }
        });
    }
});