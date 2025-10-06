import { world, system, EquipmentSlot, EntityComponentTypes,GameMode, EntityInitializationCause, ItemComponent, ItemComponentTypes, TicksPerSecond, EffectType, EffectTypes, EntityDamageCause  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";
import { craftData } from "./crafts";
import { raidData } from "./raid";
import { absVector3,getVector3E,isMoving,turning2 } from "./usefulFunction"
import "./compornents";
import "./team";
import "./vehicleMain";
import { attachmentData } from "./attach";
import { gunAttach } from "./gunAttach";


/*
world.afterEvents.entityHurt.subscribe( e => {
	print(`value:${e.damage} at:${e.hurtEntity.typeId} by:${e.damageSource.damagingEntity.typeId} type:${e.damageSource.cause}`)
} )
*/
export const tankImmuneEntities = [
    `armor_stand`,
    `area_effect_cloud`,
    `item`,
    `xp_orb`
]

const headshotTypes = [
	//2m height entities like player(humanoid)
	`minecraft:player`,
	`minecraft:zombie`,
	`minecraft:skeleton`,
	`minecraft:creeper`,
	`minecraft:piglin`,
	`minecraft:vindicator`,
	`minecraft:evoker`,
	`minecraft:witch`,
	`minecraft:pillager`,
	`minecraft:zombified_piglin`,
	`minecraft:husk`,
	`minecraft:stray`,
	`minecraft:drowned`,
	`minecraft:zombie_villager`,
	`minecraft:wither_skeleton`,
	`minecraft:villager_v2`,
	`minecraft:wandering_trader`,
	`minecraft:blaze`,
	`minecraft:breeze`,
	`gvcww2:sov_soldier`,
	`gvcww2:ger_soldier`,
	`gvcww2:usa_soldier`,
	`gvcww2:jap_soldier`,
	`gvcww2:eng_soldier`
]

world.afterEvents.entitySpawn.subscribe( e => {
	const entity = e.entity;
	//cant use grenade on downed players
	if( entity.getComponent(EntityComponentTypes.Projectile) != undefined  ){
		const player = entity.getComponent(EntityComponentTypes.Projectile).owner;
		if(player != undefined && player.hasTag(`down`)){
			entity.remove();
		}
	}
	if( entity.typeId.split(`:`)[1] == `sov_soldier` && !world.getDynamicProperty(`gvcv5:buildingSpawnSOV`) ) {
		entity.remove()
	}
	else if( entity.typeId.split(`:`)[1] == `ger_soldier` && !world.getDynamicProperty(`gvcv5:buildingSpawnGER`) ) {
		entity.remove()
	}
	else if( entity.typeId.split(`:`)[1] == `usa_soldier` && !world.getDynamicProperty(`gvcv5:buildingSpawnUSA`) ) {
		entity.remove()
	}
	else if( entity.typeId.split(`:`)[1] == `jap_soldier` && !world.getDynamicProperty(`gvcv5:buildingSpawnJAP`) ) {
		entity.remove()
	}
	else if( entity.typeId.split(`:`)[1] == `eng_soldier` && !world.getDynamicProperty(`gvcv5:buildingSpawnENG`) ) {
		entity.remove()
	}

})

world.afterEvents.playerSpawn.subscribe( e => {
	const player = e.player;
	player.setDynamicProperty(`gvcv5:gunUsed`,0)
} )

function printDamage(player,damage,victim){
	if( player.getDynamicProperty(`gvcww2:hitEntityId`) != victim.id ){
		player.setDynamicProperty(`gvcww2:hitEntityId`,victim.id)
		player.setDynamicProperty(`gvcww2:hitdamage`, 0 )
	}
	const hitDamage = player.getDynamicProperty(`gvcww2:hitdamage`);
	if( hitDamage == undefined ){ player.setDynamicProperty(`gvcww2:hitdamage`, 0 ); }
	player.setDynamicProperty(`gvcww2:hitdamage`, hitDamage + damage);
	world.scoreboard.getObjective(`printDamage`).setScore(player,40);
	
}

function print(text){
	world.sendMessage(`§a[System]§r: ${text}`);
}

function getInventoryItem(player,typeId){
	let c = 0
	for(let j = 0; j < 36; j++){
		let Haditem = player.getComponent("inventory").container.getItem(j);
		if( Haditem != undefined && Haditem.typeId == typeId ){
			c += player.getComponent("inventory").container.getItem(j).amount;
		}
	}
	return c;
}

function setArmorValue( itemName ){
	if( itemName.includes("leather") ){ return 0.05 }
	else if( itemName.includes("chainmail") ){ return 0.1 }
	else if( itemName.includes("iron") ){ return 0.15 }
	else if( itemName.includes("golden") ){ return 0.15 }
	else if( itemName.includes("diamond") ){ return 0.225 }
	else if( itemName.includes("plastic") ){ return 0.2 }
	else if( itemName.includes("ghilliesuit") ){ return 0.05 }
	else if( itemName.includes("trench") ){ return 0.15 }
	else if( itemName.includes("mghelmet") ){ return 0.15 }
	else if( itemName.includes("firemask") ){ return 0.05 }
	else if( itemName.includes("droneguided") ){ return 0.15 }
	else if( itemName.includes("copper") ){ return 0.25 }
	else if( itemName.includes("netherite") ){ return 0.25 }
	else { return 0 }
}

world.afterEvents.entitySpawn.subscribe( e => {
	if( e.entity.typeId == "fire:lunge"  ){
		const projectile = e.entity;
		const player = projectile.getComponent(EntityComponentTypes.Projectile).owner;
		player.applyDamage(100,{ cause: EntityDamageCause.entityExplosion });
	}
	//set on fire
	else if( e.entity.typeId.includes("fire")  ){
		const projectile = e.entity;
		
		const player = projectile.getComponent(EntityComponentTypes.Projectile).owner;
		if( player.typeId == `minecraft:player` && !player.hasTag("isRiding") ){
			const gun = player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
			const ench = gun.getItem().getComponent(ItemComponentTypes.Enchantable);
			if( ench.hasEnchantment(`minecraft:flame`) ){
				projectile.setOnFire(10,true);
			}
		}
		else {
			if( player.getDynamicProperty(`Ench_flame`) != undefined ){
				projectile.setOnFire(10,true);
			}
		}

		if( player.typeId != `minecraft:player` ){
			const ride = player.dimension.getEntities({location:player.location,families:[ `air` ],maxDistance:4,closest:1})[0];
			if( ride != undefined ){
				const V = projectile.getVelocity()
				let vx = turning2( getVector3E(V),getVector3E(ride.getViewDirection()),Math.PI/12 )
				//print(`a`)
				projectile.applyImpulse(vx);

			}
			else{
				//print(`b`)
			}
		}
	}
} )

world.afterEvents.projectileHitEntity.subscribe( e => {
	if( e.projectile.typeId.includes("fire")){
		const vict = e.getEntityHit().entity;
		let def = 0;
		let gunName = e.projectile.typeId;
		const owner = e.source;
		if( gunName.includes("fire:ads_") ){ gunName = gunName.replace("fire:ads_",""); }
		else if( gunName.includes("fire:") ){ gunName = gunName.replace("fire:",""); }

		const damageType = gunData[`${gunName}`][`damageType`];
		const damageIgnoreDef = gunData[`${gunName}`][`damageIgnoreDef`];
		const equipmentComp = vict.getComponent(EntityComponentTypes.Equippable)

		if( equipmentComp && vict.typeId == "minecraft:player" ){
			const slots = [ EquipmentSlot.Head,EquipmentSlot.Chest,EquipmentSlot.Legs,EquipmentSlot.Feet ];
			for( const slot of slots ){
				if( equipmentComp.getEquipment(slot) != undefined ){ 
					def = def + setArmorValue(equipmentComp.getEquipmentSlot(slot).typeId) 
				}
			}
		}
		if( vict.getEffect("resistance") != undefined ){
			def = def + (1 + vict.getEffect("resistance").amplifier) * 0.5;
		}
		if( vict.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`air`) ){
			def = def + 1;
		}
		if( vict.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`tank`) ){
			def = def + 1;
		}
		if( damageIgnoreDef > 0 ){
			def = def - damageIgnoreDef
		}
		if( damageType != `override` ){
			def = def/2;
		}
		if (def > 1){ def = 1 }

		//headshot (1.5 times)
		if( e.location.y - vict.location.y > 1.5 && headshotTypes.includes(vict.typeId) ){
			def = def - 0.5;//armor ignore 50% on headshot
			if( e.source.typeId == "minecraft:player" ){
				e.dimension.playSound(`note.bell`,e.source.location,{ volume:1, pitch:2 });
			}
			e.source.setDynamicProperty(`gvcww2:headshot`,1);
			e.source.runCommand(`title @s subtitle §4HEADSHOT§r`);
		}
		//feet shot (0.75 times)
		else if( e.location.y - vict.location.y < 0.75 && headshotTypes.includes(vict.typeId) ){
			def = def + 0.25;//armor effect 25% more on feet shot
			e.source.setDynamicProperty(`gvcww2:headshot`,0);
		}
		//Body
		else{
			e.source.setDynamicProperty(`gvcww2:headshot`,0);
		}
		
		if (def > 1){ def = 1 }
		
		//get Damage
		let damage = gunData[`${gunName}`][`damage`];

		//Ench
		if( owner.typeId == `minecraft:player` && !owner.hasTag("isRiding") ){
			const gun = owner.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
			const ench = gun.getItem().getComponent(ItemComponentTypes.Enchantable);
			if( ench.hasEnchantment(`minecraft:power`) ){
				const level = ench.getEnchantment(`minecraft:power`).level;
				damage = damage * 0.25 * (level + 5);
			}
		}

		//Damage Ratio
		if ( vict.typeId == "minecraft:player" ){ 
			damage = damage * world.getDynamicProperty("gvcv5:playerDamage");
		}
		else{
			damage = damage * world.getDynamicProperty("gvcv5:mobDamage");
		}
		//final damage
		damage = damage * (1 - def);

		//Override
        if( damageType == `override` && vict.getEffect("resistance") == undefined && vict.hasTag("antiBullet") == false ){
			if (def > 1){ def = 1 }
			if( e.source.typeId == "minecraft:player" ){ printDamage(e.source,damage,vict); }
			if( world.getDynamicProperty("gvcv5:nodiein1hit") && vict.typeId == "minecraft:player" && damage > 20 ){
				vict.applyDamage(10,{ cause: EntityDamageCause.entityAttack,damagingEntity: e.source });
			}
			else if( world.getDynamicProperty("gvcv5:playerDamageCool") && vict.typeId == "minecraft:player" ){
				vict.applyDamage(damage,{ cause: EntityDamageCause.entityAttack,damagingEntity: e.source });
			}
			else{
				vict.applyDamage(damage,{ cause: damageType,damagingEntity: e.source });
			}
            vict.applyKnockback({x:0,z:0},0);
        }
		else if( damageType != `override` ){
			if( e.source.typeId == "minecraft:player" ){ printDamage(e.source,damage,vict); }
			if( world.getDynamicProperty("gvcv5:nodiein1hit") && vict.typeId == "minecraft:player" ){
				if(damage > 20 ){ vict.applyDamage(10,{ cause: EntityDamageCause.entityAttack,damagingEntity: e.source }); }
				else{ vict.applyDamage(damage/2,{ cause: EntityDamageCause.entityAttack,damagingEntity: e.source }); }
			}
			else{
				vict.applyDamage(damage,{ cause: damageType,damagingEntity: e.source });
			}
            vict.applyKnockback({x:0,z:0},0);
		}
		try{
			e.projectile.triggerEvent("minecraft:explode");
		}
		catch( error ){
		}
	}
})

system.afterEvents.scriptEventReceive.subscribe( async e => {
	if (e.id === "gvcv5:test"){
		const user = e.sourceEntity;
		user.lookAt({x:0,y:0,z:0})
	}
	if (e.id === "gvcv5:rocket_first"){
		const projectile = e.sourceEntity;
		const player = projectile.getComponent(EntityComponentTypes.Projectile).owner;
		if( player.getRotation().x > 0 ){
			const V = projectile.getVelocity();
			projectile.clearVelocity()
			projectile.applyImpulse({ x:V.x,y:-V.y,z:V.z });
		}
	}
	if (e.id === "gvcv5:gravity"){
		try{
			const projectile = e.sourceEntity;
			projectile.applyImpulse({ x:0,y:-0.05,z:0 });
		}catch{}
	}

	else if( e.id == "zex:start" ){
		const buildingS = Number(world.getDynamicProperty(`gvcv5:buildingSpawnS`))
		const buildingM = Number(world.getDynamicProperty(`gvcv5:buildingSpawnM`))
		const buildingL = Number(world.getDynamicProperty(`gvcv5:buildingSpawnL`))
		const buildingA = Number(world.getDynamicProperty(`gvcv5:buildingSpawnA`))
		e.sourceEntity.runCommand(`scoreboard players set S building ${buildingS}`);
		e.sourceEntity.runCommand(`scoreboard players set M building ${buildingM}`);
		e.sourceEntity.runCommand(`scoreboard players set L building ${buildingL}`);
		e.sourceEntity.runCommand(`scoreboard players set A building ${buildingA}`);
	}
	else if (e.id === "gvcv5:gunUse"){
		//tag=!reload,tag=!down
		const player = e.sourceEntity;
		const gunName = e.message;
		const gun = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
		const dmgCom = gun.getComponent(ItemComponentTypes.Durability);
		const damage = dmgCom.damage;
		const maxAmmo = dmgCom.maxDurability;
		let usedGun = player.getDynamicProperty(`gvcv5:gunUsed`);
		const ench = gun.getComponent(ItemComponentTypes.Enchantable);
		if( usedGun == undefined ){
			usedGun = 0;
		}
		if( damage + usedGun < maxAmmo && !player.hasTag(`reload`) && !player.hasTag(`down`) ){
			
			if( ench.hasEnchantment(`minecraft:unbreaking`) ){
				const level = ench.getEnchantment(`minecraft:unbreaking`).level;
				if( Math.random() < 1/level ){
					player.setDynamicProperty(`gvcv5:gunUsed`,usedGun+1);
				}
			}
			else{
				player.setDynamicProperty(`gvcv5:gunUsed`,usedGun+1);
			}
			player.triggerEvent(`fire:${gunName}`);
			try{
				if( player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == `gun:${gunName}` ){
					await system.waitTicks(2);
					player.triggerEvent(`fire:${gunName}`);
				}
			}catch{}
		}
	}
	else if (e.id === "gvcv5:pistolUse"){
		//tag=!reload,tag=!down
		const player = e.sourceEntity;
		const gunName = e.message;
		const gun = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
		const dmgCom = gun.getComponent(ItemComponentTypes.Durability);
		const damage = dmgCom.damage;
		const maxAmmo = dmgCom.maxDurability;
		let usedGun = player.getDynamicProperty(`gvcv5:gunUsed`);
		const ench = gun.getComponent(ItemComponentTypes.Enchantable);
		if( usedGun == undefined ){
			usedGun = 0;
		}
		if( damage + usedGun < maxAmmo && !player.hasTag(`pistolreload`)&& !player.hasTag(`down`) ){
			
			if( ench.hasEnchantment(`minecraft:unbreaking`) ){
				const level = ench.getEnchantment(`minecraft:unbreaking`).level;
				if( Math.random() < 1/level ){
					player.setDynamicProperty(`gvcv5:gunUsed`,usedGun+1);
				}
			}
			else{
				player.setDynamicProperty(`gvcv5:gunUsed`,usedGun+1);
			}
			player.triggerEvent(`fire:${gunName}`);
			try{
				if( player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == `gun:${gunName}` ){
					await system.waitTicks(2);
					player.triggerEvent(`fire:${gunName}`);
				}
			}catch{}
		}
	}
	else if (e.id === "gvcv5:gunapply"){
		//tag=!reload,tag=!down
		const player = e.sourceEntity;
		if( player.getDynamicProperty(`gvcv5:gunUsed`) == undefined ){
			player.setDynamicProperty(`gvcv5:gunUsed`,0);
		}
		const gunUsed = player.getDynamicProperty(`gvcv5:gunUsed`);
		const gun = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
		const dmgCom = gun.getComponent(ItemComponentTypes.Durability);
		const damage = dmgCom.damage;
		const maxAmmo = dmgCom.maxDurability;
		const newDamage = damage + gunUsed;
		if( newDamage < maxAmmo ){
			gun.getComponent(ItemComponentTypes.Durability).damage = newDamage;
			player.getComponent("minecraft:inventory").container.setItem(player.selectedSlotIndex, gun);
			player.setDynamicProperty(`gvcv5:gunUsed`,0);
		}
		else{
			gun.getComponent(ItemComponentTypes.Durability).damage = maxAmmo;
			player.getComponent("minecraft:inventory").container.setItem(player.selectedSlotIndex, gun);
			player.setDynamicProperty(`gvcv5:gunUsed`,newDamage - maxAmmo);
		}
		try{
			if( player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == gun.typeId ){
				let gunOff = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand);
				gunOff.getComponent(ItemComponentTypes.Durability).damage = gun.getComponent(ItemComponentTypes.Durability).damage;
				await system.waitTicks(2);
				player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Offhand).setItem(gunOff);
			}
		}catch{}
	}
	else if (e.id === "gvcv5:vgun"){
		let player = e.sourceEntity;
		const gunName = e.message;
		const Ammo = gunData[`${gunName}`]["bullet"];
		const slow = gunData[`${gunName}`]["slowness"];
		const gunSlot = player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
		let gun = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
		const dmgCom = gun.getComponent(ItemComponentTypes.Durability);
		let damage = dmgCom.damage;
		let maxAmmo = dmgCom.maxDurability;
		let usedGun = player.getDynamicProperty(`gvcv5:gunUsed`);
		for( const attachment of attachmentData[`attachTypes`] ){
			if( gunSlot.getDynamicProperty(`zex:${attachment}`) != undefined ){
				const scope = gunSlot.getDynamicProperty(`zex:${attachment}`);
				player.setProperty(`zex:${attachment}`,scope);
			}
			else{
				player.setProperty(`zex:${attachment}`,0);
			}
		}

		
		try{
			if( player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == gun.typeId ){
				let gunOff = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand);
				const dmgComOff = gunOff.getComponent(ItemComponentTypes.Durability);
				damage = damage + dmgComOff.damage;
				maxAmmo = maxAmmo * 2;
			}
		}catch{}

		if( usedGun == undefined ){
			usedGun = 0;
		}
		if( slow > 0 ){
			player.addEffect("slowness", 20,{ amplifier: slow });
		}
		if( gunSlot.getDynamicProperty(`zex:bayonet`) == 1 ){
			player.addEffect("strength", 20,{ amplifier: 3 });
		}
		if( !player.hasTag(`reload`) && !player.hasTag(`down`) ){
			player.runCommand(`titleraw @s actionbar {\"rawtext\":[{\"translate\":\"script.gvcww2:${Ammo}.name\"},{\"text\":\" ${maxAmmo-usedGun-damage}/${maxAmmo} ${getInventoryItem(player, Ammo)}\"}]}`)
		}
		if( damage >= maxAmmo  ){
			player.runCommand(`execute if entity @s[tag=autoReload,tag=!reload,tag=!down,hasitem={item=${Ammo}}] run scriptevent gvcv5:reload ${gunName}`);
		}
	}
	else if (e.id === "gvcv5:reload"){
		const p = e.sourceEntity;
		const gunName = e.message;
		let gun = p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
		const dmgCom = gun.getComponent(ItemComponentTypes.Durability)
		const damage = dmgCom.damage;
		const isOffhand = ( p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand) != undefined );
		const reloadTime = gunData[`${gunName}`]["reloadTime"];
		const Ammo = gunData[`${gunName}`]["bullet"];
		const ench = gun.getComponent(ItemComponentTypes.Enchantable);
		let c = 0;
		if( damage > 0 ){
			for(let i = 0; i < 36; i++){
				let Haditem = p.getComponent("inventory").container.getItem(i);
				if( Haditem != undefined && Haditem.typeId === Ammo ){
					c += p.getComponent("inventory").container.getItem(i).amount;
				}
			}
			if( isOffhand &&p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == gun.typeId ){
				c = Math.floor(c/2);
			}

			if( world.getDynamicProperty(`gvcv5:doBulletSpend`) == false ){
				p.addEffect("slowness", reloadTime,{ amplifier: 2 });
				p.addTag("reload");
				if( gunData[`${gunName}`]["fireOnReload"] == true ){
					p.addTag("pistolreload");
				}
				gun.getComponent(ItemComponentTypes.Durability).damage = 0;
				p.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand,gun);
				if( isOffhand &&p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == gun.typeId ){
					let gunOff = p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand);
					gunOff.getComponent(ItemComponentTypes.Durability).damage = gun.getComponent(ItemComponentTypes.Durability).damage;
					p.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Offhand).setItem(gunOff);
				}
				world.scoreboard.getObjective("reloading").setScore(p,Number(reloadTime));
				p.runCommand("playsound reload.ak47 @s ~~~ ");
			}
			if( ench.hasEnchantment(`minecraft:infinity`) ){
				p.addEffect("slowness", reloadTime,{ amplifier: 2 });
				p.addTag("reload")
				if( gunData[`${gunName}`]["fireOnReload"] == true ){
					p.addTag("pistolreload");
				}
				gun.getComponent(ItemComponentTypes.Durability).damage = 0;
				p.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand,gun);
				if( isOffhand &&p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == gun.typeId ){
					let gunOff = p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand);
					gunOff.getComponent(ItemComponentTypes.Durability).damage = gun.getComponent(ItemComponentTypes.Durability).damage;
					p.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Offhand).setItem(gunOff);
				}
				world.scoreboard.getObjective("reloading").setScore(p,Number(reloadTime));
				p.runCommand("playsound reload.ak47 @s ~~~ ");
			}
			else if (c > 0){
				if( c > damage ){
					gun.getComponent(ItemComponentTypes.Durability).damage = 0;
					p.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand,gun);

					if( isOffhand && p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == gun.typeId ){
						p.runCommand(`clear @s ${Ammo} 0 ${damage*2}`);
					}
					else{
						p.runCommand(`clear @s ${Ammo} 0 ${damage}`);
					}
						
				}
				else{
					gun.getComponent(ItemComponentTypes.Durability).damage = damage - c;
					p.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand,gun);
					p.runCommand(`clear @s ${Ammo} 0 9999`);
				}

				if( isOffhand &&p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == gun.typeId ){
					let gunOff = p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand);
					gunOff.getComponent(ItemComponentTypes.Durability).damage = gun.getComponent(ItemComponentTypes.Durability).damage;
					p.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Offhand).setItem(gunOff);
				}

				p.addEffect("slowness", reloadTime,{ amplifier: 2 });
				p.addTag("reload")
				if( gunData[`${gunName}`]["fireOnReload"] == true ){
					p.addTag("pistolreload");
				}
				world.scoreboard.getObjective("reloading").setScore(p,Number(reloadTime));
				p.runCommand("playsound reload.ak47 @s ~~~ ");
			}
		}
	}
	else if( e.id == "gvcv5:craft" ){
		const craftType = e.message;
		const player = e.sourceEntity;
		const form = new ActionFormData();
		form.title(`tile.gvcv5:${craftType}.name`);
		const sells = craftData[`${craftType}`][`sell`];
		const buys = craftData[`${craftType}`][`buy`];
		let itemRawText = []
		let sellItemCounts = []
		for( let i = 0; i < sells.length; i++ ){
			let c = 0
			for(let j = 0; j < 36; j++){
				let Haditem = player.getComponent("inventory").container.getItem(j);
				if( Haditem != undefined && Haditem.typeId == sells[i] ){
					c += player.getComponent("inventory").container.getItem(j).amount;
				}
			}
			itemRawText.push({ translate: `script.gvcv5.${sells[i]}.name` });
			itemRawText.push({ text: `:${c}\n` });
			sellItemCounts.push(c);
		}
		form.body({ rawtext: itemRawText});
		for(let i = 0; i < buys.length; i++){
			let buyData = [{ text:`§l`},{ translate: `item.${buys[i]["give"]}`},{ text:`x${buys[i]["count"]}§r\nneed:`}];
			for( let j = 0; j < sells.length; j++ ){
				if( buys[i]["cost"][j] > 0 ){
					buyData.push({ translate: `script.gvcv5.${sells[j]}.name` });
					buyData.push({ text: `x${buys[i]["cost"][j]}` });
				}
			}
			form.button({ rawtext: buyData},buys[i]["texture"]);
		}
		form.show(player).then( result => {
			if ( !result.canceled ){
				if( sellItemCounts.every( (value, index) => value >= buys[result.selection]["cost"][index] ) ){
					for( let i = 0; i < sells.length; i++ ){
						player.runCommand(`clear @s ${sells[i]} 0 ${buys[result.selection]["cost"][i]}`);
					}
					player.runCommand(`give @s ${buys[result.selection]["give"]} ${buys[result.selection]["count"]}`);
				}
				else{
					player.sendMessage({ translate: `script.gvcv5.no_ma.name`});
				}
				player.runCommand(`scriptevent gvcv5:craft ${craftType}`);
			}
		} )
		
	}
	else if( e.id == "gvcv5:attach_table" ){
		const player = e.sourceEntity;
		const gun = player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
		if( gun.typeId.includes(`gun:`) ){
			const gunId = gun.typeId.split(`:`)[1];
			let attachTypes2 = []
			const attachTypes = attachmentData[`attachTypes`];
			const Iform = new ActionFormData();
			Iform.title(`script.gvcww2.attachment_table.name`);
			Iform.body(`script.gvcww2.attachment_table.body.name`);
			for( const attachType of attachTypes ){
				if(Array.isArray(gunAttach[`${gunId}`][`${attachType}`])){
					Iform.button(`script.gvcww2.${attachType}.name`,`textures/items/attachment/${attachmentData[`${attachType}`][gun.getDynamicProperty(`zex:${attachType}`)]}`);
				}
				else{
					Iform.button(`script.gvcww2.${attachType}.name`,`textures/items/attachment/not`);
				}
				attachTypes2.push(attachType)
			}
			Iform.show(player).then( r => {
				if ( !r.canceled ){
					const attachType = attachTypes2[r.selection];
					if( Array.isArray(gunAttach[`${gunId}`][`${attachType}`]) ){
						let phoneArray = [  ]
						let phoneArray2 = [  ]
						const form = new ActionFormData();
						form.title(`script.gvcww2.${attachType}.name`);
						form.body(`script.gvcww2.${attachType}.body.name`);
						form.button(`script.gvcww2.remove_attach.name`);
						phoneArray2.push(0);
						for( let i = 1; i < attachmentData[`${attachType}`].length; i++ ){
							if( getInventoryItem(player,`zex:${attachmentData[`${attachType}`][i]}`) > 0 && gun.getDynamicProperty(`zex:${attachType}`) != i ){
								form.button(`item.zex:${attachmentData[`${attachType}`][i]}`,`textures/items/attachment/${attachmentData[`${attachType}`][i]}`);
								phoneArray.push(attachmentData[`${attachType}`][i])
								phoneArray2.push(i);
							}
						}
						form.show(player).then( result => {
							if ( !result.canceled ){
								if( result.selection != 0 ){
									//print(`${phoneArray2[result.selection]}`)
									player.runCommand(`clear @s zex:${phoneArray[result.selection-1]} 0 1` )
								}
								if( gun.getDynamicProperty(`zex:${attachType}`) != undefined && gun.getDynamicProperty(`zex:${attachType}`) != 0 ){
									player.runCommand(`give @s zex:${attachmentData[`${attachType}`][gun.getDynamicProperty(`zex:${attachType}`)]}`)
								}
								gun.setDynamicProperty(`zex:${attachType}`,phoneArray2[result.selection]);
								player.runCommand(`scriptevent gvcv5:attach_table` )
							}
						})
					}
					else{
						player.sendMessage({translate:`script.gvcww2.cant_attach.name`});
						player.runCommand(`scriptevent gvcv5:attach_table` );
					}
				}
			})

		}
		else{
			player.sendMessage({ translate:`script.gvcww2.hold_gun.name`})
		}
		
	}
	else if( e.id == "gvcv5:printDamage" && !e.sourceEntity.hasTag(`no_print`) ){
		const user = e.sourceEntity;
		if( world.scoreboard.getObjective(`printDamage`).getScore(user) > 0 ){
			if( user.getDynamicProperty(`gvcww2:headshot`) == 1 ){
				user.runCommand(`title @s subtitle §4HEADSHOT§r`);
			}
			else{
				user.runCommand(`title @s subtitle ""`);
			}
			user.runCommand(`titleraw @s title {"rawtext":[{"text":"\n\n\n\n\n${user.getDynamicProperty(`gvcww2:hitdamage`)}"}]}`);
		}
		else{
			user.setDynamicProperty(`gvcww2:hitdamage`,0);
			user.runCommand(`title @s clear`);
		}
	}
	else if( e.id == `gvcv5:admin` ){
		if( e.message== `guns` ){
			const form = new ModalFormData();
			form.title(`Admin Settings`);
			form.textField(`Player Damage`,`${world.getDynamicProperty(`gvcv5:playerDamage`)}`, {defaultValue: `${world.getDynamicProperty(`gvcv5:playerDamage`)}`,tooltip:`Current is ${world.getDynamicProperty(`gvcv5:playerDamage`)}`});
			form.textField(`Mob Damage`,`${world.getDynamicProperty(`gvcv5:mobDamage`)}`, {defaultValue: `${world.getDynamicProperty(`gvcv5:mobDamage`)}`,tooltip:`Current is ${world.getDynamicProperty(`gvcv5:mobDamage`)}`});
			form.toggle(`Bullet Spend`, {defaultValue: world.getDynamicProperty(`gvcv5:doBulletSpend`),tooltip:`Bullet Spend`});
			form.toggle(`Player damage cool time`, {defaultValue: world.getDynamicProperty(`gvcv5:playerDamageCool`),tooltip:`Player damage cool time`});
			form.toggle(`no die in 1 hit`, {defaultValue: world.getDynamicProperty(`gvcv5:nodiein1hit`),tooltip:`Player no die in 1 hit`});
			form.show(e.sourceEntity).then( result => {
				if ( !result.canceled ){
					if( world.getDynamicProperty(`gvcv5:playerDamage`) != Number(result.formValues[0]) ){
						world.setDynamicProperty(`gvcv5:playerDamage`,Number(result.formValues[0]));
						world.sendMessage(`Player Damage rate is now ${result.formValues[0]}`);
					}
					if( world.getDynamicProperty(`gvcv5:mobDamage`) != Number(result.formValues[1]) ){
						world.setDynamicProperty(`gvcv5:mobDamage`,Number(result.formValues[1]));
						world.sendMessage(`Mob Damage rate is now ${result.formValues[1]}`);
					}
					if( world.getDynamicProperty(`gvcv5:doBulletSpend`) != Boolean(result.formValues[2]) ){
						world.setDynamicProperty(`gvcv5:doBulletSpend`,Boolean(result.formValues[2]));
						world.sendMessage(`Bullet Spend is now ${result.formValues[2]}`);
					}
					if( world.getDynamicProperty(`gvcv5:playerDamageCool`) != Boolean(result.formValues[3]) ){
						world.setDynamicProperty(`gvcv5:playerDamageCool`,Boolean(result.formValues[3]));
						world.sendMessage(`Player damage cool is now ${result.formValues[3]}`);
					}
					if( world.getDynamicProperty(`gvcv5:nodiein1hit`) != Boolean(result.formValues[4]) ){
						world.setDynamicProperty(`gvcv5:nodiein1hit`,Boolean(result.formValues[4]));
						world.sendMessage(`no die in 1 hit is now ${result.formValues[4]}`);
						world.scoreboard.getObjective(`building`).setScore(`P`,Number(result.formValues[4]));
					}
				}
			} )
		}
		else if( e.message == `building`){
			const form = new ModalFormData();
			form.title(`Building Settings`);
			form.toggle(`Soviet Building Spawn`, {defaultValue: world.getDynamicProperty(`gvcv5:buildingSpawnSOV`),tooltip:`Soviet Building Spawn`});
			form.toggle(`German Building Spawn`, {defaultValue: world.getDynamicProperty(`gvcv5:buildingSpawnGER`),tooltip:`German Building Spawn`});
			form.toggle(`US Building Spawn`, {defaultValue: world.getDynamicProperty(`gvcv5:buildingSpawnUSA`),tooltip:`US Building Spawn`});
			form.toggle(`Japanese Building Spawn`, {defaultValue: world.getDynamicProperty(`gvcv5:buildingSpawnJAP`),tooltip:`Japanese Building Spawn`});
			form.toggle(`British Building Spawn`, {defaultValue: world.getDynamicProperty(`gvcv5:buildingSpawnENG`),tooltip:`British Building Spawn`});
			form.show(e.sourceEntity).then( result => {
				if ( !result.canceled ){
					if( world.getDynamicProperty(`gvcv5:buildingSpawnSOV`) != Boolean(result.formValues[0]) ){
						world.setDynamicProperty(`gvcv5:buildingSpawnSOV`,Boolean(result.formValues[0]));
						world.scoreboard.getObjective(`building`).setScore(`SOV`,Number(result.formValues[0]));
						world.sendMessage(`Soviet Building Spawn is now ${result.formValues[0]}`);
					}
					if( world.getDynamicProperty(`gvcv5:buildingSpawnGER`) != Boolean(result.formValues[1]) ){
						world.setDynamicProperty(`gvcv5:buildingSpawnGER`,Boolean(result.formValues[1]));
						world.scoreboard.getObjective(`building`).setScore(`GER`,Number(result.formValues[1]));
						world.sendMessage(`German Building Spawn is now ${result.formValues[1]}`);
					}
					if( world.getDynamicProperty(`gvcv5:buildingSpawnUSA`) != Boolean(result.formValues[2]) ){
						world.setDynamicProperty(`gvcv5:buildingSpawnUSA`,Boolean(result.formValues[2]));
						world.scoreboard.getObjective(`building`).setScore(`USA`,Number(result.formValues[2]));
						world.sendMessage(`US Building Spawn is now ${result.formValues[2]}`);
					}
					if( world.getDynamicProperty(`gvcv5:buildingSpawnJAP`) != Boolean(result.formValues[3]) ){
						world.setDynamicProperty(`gvcv5:buildingSpawnJAP`,Boolean(result.formValues[3]));
						world.scoreboard.getObjective(`building`).setScore(`JAP`,Number(result.formValues[3]));
						world.sendMessage(`Japanese Building Spawn is now ${result.formValues[3]}`);
					}
					if( world.getDynamicProperty(`gvcv5:buildingSpawnENG`) != Boolean(result.formValues[4]) ){
						world.setDynamicProperty(`gvcv5:buildingSpawnENG`,Boolean(result.formValues[4]));
						world.scoreboard.getObjective(`building`).setScore(`ENG`,Number(result.formValues[4]));
						world.sendMessage(`British Building Spawn is now ${result.formValues[4]}`);
					}
				}
			} )


		}
		else if( e.message == `mobSpawn`){
			const form = new ModalFormData();
			form.title(`mobSpawn Settings`);
			form.toggle(`Block Spawn`, {defaultValue: world.getDynamicProperty(`gvcv5:doSpawnFromBlock`),tooltip:`Block Spawn`});
			form.toggle(`Beacon Spawn`, {defaultValue: world.getDynamicProperty(`gvcv5:doSpawnFromBeacon`),tooltip:`Beacon Spawn`});
			form.show(e.sourceEntity).then( result => {
				if ( !result.canceled ){
					if( world.getDynamicProperty(`gvcv5:doSpawnFromBlock`) != Boolean(result.formValues[0]) ){
						world.setDynamicProperty(`gvcv5:doSpawnFromBlock`,Boolean(result.formValues[0]));
						world.sendMessage(`Block Spawn is now ${result.formValues[0]}`);
					}
					if( world.getDynamicProperty(`gvcv5:doSpawnFromBeacon`) != Boolean(result.formValues[1]) ){
						world.setDynamicProperty(`gvcv5:doSpawnFromBeacon`,Boolean(result.formValues[1]));
						world.sendMessage(`Beacon Spawn is now ${result.formValues[1]}`);
					}
				}
			} )


		}
		else if( e.message == `gameRule`){
			const form = new ModalFormData();
			form.title(`gameRule Settings`);
			form.toggle(`Enable WorldLimit`, {defaultValue: world.getDynamicProperty(`gvcv5:worldLimit`),tooltip:`Enable WorldLimit`});
			form.toggle(`Vehchle Fuel Consumption`, {defaultValue: world.getDynamicProperty(`gvcv5:doFuelConsume`),tooltip:`Vechile Fuel Consumption`});
			form.toggle(`Vehcle Spend Ammo`, {defaultValue: world.getDynamicProperty(`gvcv5:doVechileAmmoSpend`),tooltip:`Vehcle Spend Ammo`});
			form.textField(`World Limit O`,`${world.getDynamicProperty(`gvcv5:worldLimitO`)}`, {defaultValue: `${world.getDynamicProperty(`gvcv5:worldLimitO`)}`,tooltip:`Current is ${world.getDynamicProperty(`gvcv5:worldLimitO`)}`});
			form.textField(`World Limit N`,`${world.getDynamicProperty(`gvcv5:worldLimitN`)}`, {defaultValue: `${world.getDynamicProperty(`gvcv5:worldLimitN`)}`,tooltip:`Current is ${world.getDynamicProperty(`gvcv5:worldLimitN`)}`});
			form.textField(`World Limit E`,`${world.getDynamicProperty(`gvcv5:worldLimitE`)}`, {defaultValue: `${world.getDynamicProperty(`gvcv5:worldLimitE`)}`,tooltip:`Current is ${world.getDynamicProperty(`gvcv5:worldLimitE`)}`});
			form.toggle(`Disable AirCraft With Item`, {defaultValue: world.getDynamicProperty(`gvcv5:airCraftWithItem`),tooltip:`Disable AirCraft With Item`});
			form.show(e.sourceEntity).then( result => {
				if ( !result.canceled ){
					if( world.getDynamicProperty(`gvcv5:worldLimit`) != Boolean(result.formValues[0]) ){
						world.setDynamicProperty(`gvcv5:worldLimit`,Boolean(result.formValues[0]));
						world.sendMessage(`World Limit is now ${result.formValues[0]}`);
					}
					if( world.getDynamicProperty(`gvcv5:doFuelConsume`) != Boolean(result.formValues[1]) ){
						world.setDynamicProperty(`gvcv5:doFuelConsume`,Boolean(result.formValues[1]));
						world.sendMessage(`Vechile Fuel Consumption is now ${result.formValues[1]}`);
					}
					if( world.getDynamicProperty(`gvcv5:doVechileAmmoSpend`) != Boolean(result.formValues[2]) ){
						world.setDynamicProperty(`gvcv5:doVechileAmmoSpend`,Boolean(result.formValues[2]));
						world.sendMessage(`Vehcle Spend Ammo is now ${result.formValues[2]}`);
					}
					if( world.getDynamicProperty(`gvcv5:worldLimitO`) != Number(result.formValues[3]) ){
						world.setDynamicProperty(`gvcv5:worldLimitO`,Number(result.formValues[3]));
						world.sendMessage(`World Limit O is now ${result.formValues[3]}`);
					}
					if( world.getDynamicProperty(`gvcv5:worldLimitN`) != Number(result.formValues[4]) ){
						world.setDynamicProperty(`gvcv5:worldLimitN`,Number(result.formValues[4]));
						world.sendMessage(`World Limit N is now ${result.formValues[4]}`);
					}
					if( world.getDynamicProperty(`gvcv5:worldLimitE`) != Number(result.formValues[5]) ){
						world.setDynamicProperty(`gvcv5:worldLimitE`,Number(result.formValues[5]));
						world.sendMessage(`World Limit E is now ${result.formValues[5]}`);
					}
					if( world.getDynamicProperty(`gvcv5:airCraftWithItem`) != Boolean(result.formValues[6]) ){
						world.setDynamicProperty(`gvcv5:airCraftWithItem`,Boolean(result.formValues[6]));
						world.sendMessage(`Disable AirCraft With Item is now ${result.formValues[6]}`);
					}
				}
			} )


		}

	}
},)