import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe( (event) => {
    const { source, itemStack } = event
    switch( itemStack.typeId ) {
        case "minecraft:compass": 
            const ui = new ActionFormData()
            ui.title("Form")
            ui.body("")
            ui.button("button1")
            ui.button("button2")
            ui.button("button3")
            ui.show(source); 
        break;
        case "minecraft:clock":
            const customUi = new ActionFormData()
            customUi.title(".debug Home Menu")
            customUi.body("")
            customUi.button("script.gvcv5.phone_tp.name",`textures/ui/portalBg`)
            customUi.button("Lock",`textures/ui/icon_lock`)
            customUi.button("Steve",`textures/ui/icon_map`)
            customUi.button("Trade",`textures/ui/icon_deals`)
            customUi.show(source);
        break;
    }
} )