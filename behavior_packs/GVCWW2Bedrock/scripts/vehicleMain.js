import { world, system, EquipmentSlot, EntityComponentTypes,GameMode, EntityInitializationCause, ItemComponent, ItemComponentTypes, TicksPerSecond, EffectType, EffectTypes, EntityDamageCause  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";
import { vehicleData } from "./vehicle";
import { absVector2,getVector2E,absVector3,isMoving,DistanceVector3,getUnderBlocksTo,Vector3Sub,getVector3E,Vector3Add,turning,turning2,DistanceVector3in2dim} from "./usefulFunction"

export const tankImmuneEntities = [
    `armor_stand`,
    `area_effect_cloud`,
    `item`,
    `xp_orb`
]

function getEnemies( player ){
    if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`SOVteam`) ){
        return [ `axis_soldier` ];
    }
    else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`GERteam`) ){
        return [ `allied_soldier` ];
    }
    else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`USAteam`) ){
        return [ `axis_soldier` ];
    }
    else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`JAPteam`) ){
        return [ `allied_soldier` ];
    }
    else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`ENGteam`) ){
        return [ `axis_soldier` ];
    }
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

function airCraftlader( player ){
	const V = player.getViewDirection();
	const P0 = player.location;
	const d0 = Math.atan2(V.z, V.x);
	let team = `noteam`;
	let print = [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ];
	if( player.hasTag(`red`) ){ team = `red`; }
	else if( player.hasTag(`blue`) ){ team = `blue`; }
	else if( player.hasTag(`green`) ){ team = `green`; }
	else if( player.hasTag(`yellow`) ){ team = `yellow`; }
	const allPlayers = world.getAllPlayers();
	for( let i of allPlayers ){
		const Pi = i.location;
		if( i.hasTag(`${team}`) || i.nameTag == player.nameTag || (!i.hasTag(`air`) && !i.hasTag(`heri`) )){
			continue;
		}
		const ri = Math.sqrt( (Pi.x - P0.x) * (Pi.x - P0.x) + (Pi.z - P0.z) * (Pi.z - P0.z) );
		const adi = Math.atan2((Pi.z - P0.z)/ri, (Pi.x - P0.x)/ri);
		const di = Math.atan2((Pi.z - P0.z)/ri, (Pi.x - P0.x)/ri) - d0;
		for( let j = 0; j < 21; j++ ){
			if( - Math.PI/2 + j * Math.PI / 21 <= di && di < - Math.PI/2 + (j + 1) * Math.PI / 21 ){
				if( 1024 <= ri && ri < 2048  && print[j] < 1 ){
					print[j] = 1;
				}
				else if( (512 <= ri && ri < 1024) && print[j] < 2 ){
					print[j] = 2;
				}
				else if( (256 <= ri && ri < 512) && print[j] < 3 ){
					print[j] = 3;
				}
				else if( (64 <= ri && ri < 256) && print[j] < 4 ){
					print[j] = 4;
				}
				else if( (ri < 64) && print[j] < 5 ){
					print[j] = 5;
				}

			}
		}

	}
	for( let j = 0; j < 21; j++ ){
		if( print[j] == 0 ){
			print[j] = `§7`;
		}
		else if( print[j] == 1 ){
			print[j] = `§f`;
		}
		else if( print[j] == 2 ){
			print[j] = `§e`;
		}
		else if( print[j] == 3 ){
			print[j] = `§g`;
		}
		else if( print[j] == 4 ){
			print[j] = `§6`;
		}
		else if( print[j] == 5 ){
			print[j] = `§4`;
		}
	}
	return `{"text":"${print[0]}|${print[1]}|${print[2]}|${print[3]}|${print[4]}|${print[5]}|${print[6]}|${print[7]}|${print[8]}|${print[9]}| ${print[10]}${Math.floor(-180*d0/Math.PI)} ${print[11]}|${print[12]}|${print[13]}|${print[14]}|${print[15]}|${print[16]}|${print[17]}|${print[18]}|${print[19]}|${print[20]}|\n"}`;
}

function vehicleHp( HP,HPMax ){
	let hpbar = ``;
	if( HP >= HPMax * 0.5 ){
		hpbar = `§a${Math.floor(HP)}/${Math.floor(HPMax)}§r\n`;
	}
	else if( HP >= HPMax * 0.25 ){
		hpbar = `§g${Math.floor(HP)}/${Math.floor(HPMax)}§r\n`;
	}
	else{
		hpbar = `§4${Math.floor(HP)}/${Math.floor(HPMax)}§r\n`;
	}
	return hpbar;
}
function Weapon1( player,vehicle,mtype ){
	//world.sendMessage(`§aSelected Slot Index: ${mtype}`);
	const Weapon = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon1`];
	const WeaponName = `{"translate":"gvcww2.${Weapon}.name"}`;
	const WeaponScore = world.scoreboard.getObjective(`weaponi`).getScore(player);
	const WeaponScoreMax = world.scoreboard.getObjective(`weaponi_max`).getScore(player);
	const WeaponCool = world.scoreboard.getObjective(`weaponi_cool`).getScore(player);

	let mainWeaponAmmo = ``
	if( Weapon != "" ){
		mainWeaponAmmo = gunData[`${Weapon}`][`ammoType`];
	}
	let TypeData = ``;
	if( mtype == 0){
		TypeData = `{"text":"§e"},`;
	}
	let WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax}§r\n"}`;
	if( WeaponCool <= 20 ){
		WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax} ${getInventoryItem(player,mainWeaponAmmo)}§r\n"}`;
	}
	else if( WeaponCool > 20 ){
		WeaponData = `{"text":": §cCOOL ${WeaponCool}§r\n"}`;
	}
	return `${TypeData}${WeaponName},${WeaponData}`;
}
function Weapon2( player,vehicle,mtype ){
	const Weapon = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon2`];
	const WeaponName = `{"translate":"gvcww2.${Weapon}.name"}`;
	const WeaponScore = world.scoreboard.getObjective(`weaponii`).getScore(player);
	const WeaponScoreMax = world.scoreboard.getObjective(`weaponii_max`).getScore(player);
	const WeaponCool = world.scoreboard.getObjective(`weaponii_cool`).getScore(player);
	let mainWeaponAmmo = ``
	if( Weapon != "" ){
		mainWeaponAmmo = gunData[`${Weapon}`][`ammoType`];
	}
	let TypeData = ``;
	if( mtype == 1){
		TypeData = `{"text":"§e"},`;
		if( Weapon == `` ){
			world.scoreboard.getObjective(`mtype`).setScore(player,0);
		}
	}
	let WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax}§r\n"}`;
	if( WeaponCool <= 20 ){
		WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax} ${getInventoryItem(player,mainWeaponAmmo)}§r\n"}`;
	}
	else if( WeaponCool > 20 ){
		WeaponData = `{"text":": §cCOOL ${WeaponCool}§r\n"}`;
	}
	return `${TypeData}${WeaponName},${WeaponData}`;
}
function Weapon3( player,vehicle,mtype ){
	const Weapon = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon3`];
	const WeaponName = `{"translate":"gvcww2.${Weapon}.name"}`;
	const WeaponScore = world.scoreboard.getObjective(`weaponiii`).getScore(player);
	const WeaponScoreMax = world.scoreboard.getObjective(`weaponiii_max`).getScore(player);
	const WeaponCool = world.scoreboard.getObjective(`weaponiii_cool`).getScore(player);
	let mainWeaponAmmo = ``
	if( Weapon != "" ){
		mainWeaponAmmo = gunData[`${Weapon}`][`ammoType`];
	}
	let TypeData = ``;
	if( mtype == 2){
		TypeData = `{"text":"§e"},`;
		if( Weapon == `` ){
			world.scoreboard.getObjective(`mtype`).setScore(player,0);
		}
	}
	let WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax}§r\n"}`;
	if( WeaponCool <= 20 ){
		WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax} ${getInventoryItem(player,mainWeaponAmmo)}§r\n"}`;
	}
	else if( WeaponCool > 20 ){
		WeaponData = `{"text":": §cCOOL ${WeaponCool}§r\n"}`;
	}
	return `${TypeData}${WeaponName},${WeaponData}`;
}
function Weapon4( player,vehicle,mtype ){
	const Weapon = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon4`];
	const WeaponName = `{"translate":"gvcww2.${Weapon}.name"}`;
	const WeaponScore = world.scoreboard.getObjective(`weaponiv`).getScore(player);
	const WeaponScoreMax = world.scoreboard.getObjective(`weaponiv_max`).getScore(player);
	const WeaponCool = world.scoreboard.getObjective(`weaponiv_cool`).getScore(player);
	let mainWeaponAmmo = ``
	if( Weapon != "" ){
		mainWeaponAmmo = gunData[`${Weapon}`][`ammoType`];
	}
	let TypeData = ``;
	if( mtype == 3){
		TypeData = `{"text":"§e"},`;
		if( Weapon == `` ){
			world.scoreboard.getObjective(`mtype`).setScore(player,0);
		}
	}
	let WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax}§r\n"}`;
	if( WeaponCool <= 20 ){
		WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax} ${getInventoryItem(player,mainWeaponAmmo)}§r\n"}`;
	}
	else if( WeaponCool > 20 ){
		WeaponData = `{"text":": §cCOOL ${WeaponCool}§r\n"}`;
	}
	return `${TypeData}${WeaponName},${WeaponData}`;
}

function hasFuel(player,vehicle){
	if( !world.getDynamicProperty(`gvcv5:doFuelConsume`) ){
		return `{"text":"Fuel:§aInfinite§r\n"}`;
	}
	else{
		let fuel = 0;
		for(let i = 0; i < 36; i++){
			let Haditem = player.getComponent("inventory").container.getItem(i);
			if( Haditem != undefined && Haditem.typeId.includes(`gvcv5:fuel`) ){
				const ItemFuel = Haditem.getComponent(ItemComponentTypes.Durability).maxDurability -  Haditem.getComponent(ItemComponentTypes.Durability).damage;
				fuel = fuel + ItemFuel;
			}
		}
		//30 second to empty
		if( fuel < 30 * Number(vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`FuelPerSecond`]) ){
			return `{"text":"Fuel:§4${fuel}§r\n"}`;
		}
		//120 second to empty
		else if( fuel < 120 * Number(vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`FuelPerSecond`]) ){
			return `{"text":"Fuel:§g${fuel}§r\n"}`;
		}
		else{
			return `{"text":"Fuel:§a${fuel}§r\n"}`;
		}
	}
}

system.runInterval( () => {
	const overTanks = world.getDimension(`minecraft:overworld`).getEntities({families:[`tank`]});
	const netherTanks = world.getDimension(`minecraft:nether`).getEntities({families:[`tank`]});
	const endTanks = world.getDimension(`minecraft:the_end`).getEntities({families:[`tank`]});
	for( let t of overTanks ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 && isMoving(t) ){
			world.getDimension(`minecraft:overworld`).playSound(`sound.gvcww2.tank`,t.location,{ volume:8 })
		}
	}
	for( let t of netherTanks ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 && isMoving(t) ){
			world.getDimension(`minecraft:nether`).playSound(`sound.gvcww2.tank`,t.location,{ volume:8 })
		}
	}
	for( let t of endTanks ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 && isMoving(t) ){
			world.getDimension(`minecraft:the_end`).playSound(`sound.gvcww2.tank`,t.location,{ volume:8 })
		}
	}
},16)
system.runInterval( () => {
	const overAirs = world.getDimension(`minecraft:overworld`).getEntities({families:[`air`]});
	const netherAirs = world.getDimension(`minecraft:nether`).getEntities({families:[`air`]});
	const endAirs = world.getDimension(`minecraft:the_end`).getEntities({families:[`air`]});
	for( let t of overAirs ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 && isMoving(t) ){
			world.getDimension(`minecraft:overworld`).playSound(`sound.gvcww2.air`,t.location,{ volume:8 })
		}
	}
	for( let t of netherAirs ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 && isMoving(t)  ){
			world.getDimension(`minecraft:nether`).playSound(`sound.gvcww2.air`,t.location,{ volume:8 })
		}
	}
	for( let t of endAirs ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 && isMoving(t)  ){
			world.getDimension(`minecraft:the_end`).playSound(`sound.gvcww2.air`,t.location,{ volume:8 })
		}
	}
},7)

system.runInterval( () => {
	const VechilesOver = world.getDimension(`overworld`).getEntities({families:[`vehicle`]});
	const VechilesNether = world.getDimension(`nether`).getEntities({families:[`vehicle`]});
	const VechilesEnd = world.getDimension(`the_end`).getEntities({families:[`vehicle`]});
	const Vechiles = VechilesOver.concat(VechilesNether).concat(VechilesEnd);
	for( let vehicle of Vechiles ){
		const riders = vehicle.getComponent(EntityComponentTypes.Rideable).getRiders();
		if( riders.length > 0 && riders[0].typeId == `minecraft:player` ){
			let fuelSpendonThisTick = false;
			const player = riders[0];
			if( world.getDynamicProperty(`gvcv5:doFuelConsume`) ){
				for(let i = 0; i < 36; i++){
					const Haditem = player.getComponent("inventory").container.getItem(i);
					if( Haditem != undefined && Haditem.typeId.includes(`gvcv5:fuel`) ){
						const ItemFuel = Haditem.getComponent(ItemComponentTypes.Durability).maxDurability -  Haditem.getComponent(ItemComponentTypes.Durability).damage
						if( !fuelSpendonThisTick && ItemFuel > vehicleData[`${vehicle.typeId.replace("vehicle:","")}`]["FuelPerSecond"] ){
							if(isMoving(vehicle)){
								Haditem.getComponent(ItemComponentTypes.Durability).damage += vehicleData[`${vehicle.typeId.replace("vehicle:","")}`]["FuelPerSecond"];
								player.getComponent("inventory").container.setItem(i,Haditem)
							}
							fuelSpendonThisTick = true;
							break;
						}
						else if( !fuelSpendonThisTick ){
							if(isMoving(vehicle)){
								player.getComponent("inventory").container.setItem(i,undefined);
							}
							fuelSpendonThisTick = true;
							break;
						}
					}
				}
			}

			if( world.getDynamicProperty(`gvcv5:doFuelConsume`) && !fuelSpendonThisTick && vehicle.getComponent(EntityComponentTypes.Movement).currentValue > 0 ){
				vehicle.triggerEvent(`gvcv5:no_fuel`);
				vehicle.addTag(`noFuel`);
			}
			else if( (!world.getDynamicProperty(`gvcv5:doFuelConsume`) || fuelSpendonThisTick) && vehicle.getComponent(EntityComponentTypes.Movement).currentValue <= 0 ){
				vehicle.triggerEvent(`gvcv5:have_fuel`);
				vehicle.removeTag(`noFuel`);
			}	
		}
		else{
			continue;
		}
	}
},20)

system.afterEvents.scriptEventReceive.subscribe( async e => {
	if( e.id == "zex:air"){
		const airCraft = e.sourceEntity;
        const Hasrider = Boolean(airCraft.getComponent(EntityComponentTypes.Rideable).getRiders()[0] != undefined)
		if( Hasrider ){
			const maxSpeed = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue;
			const player = airCraft.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
			const selectedItemSlot = player.selectedSlotIndex;
            if( player.typeId == "minecraft:player" ){
                let v = airCraft.getVelocity();
                let abs_v = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
                const turnRad = Number(vehicleData[`${airCraft.typeId.replace("vehicle:","")}`]["turn"]) * Math.PI / 180;
                const HP = airCraft.getComponent(EntityComponentTypes.Health).currentValue;
                const HPMax = airCraft.getComponent(EntityComponentTypes.Health).defaultValue;
                let r = {
                    x:v.x/abs_v,
                    y:v.y/abs_v,
                    z:v.z/abs_v
                }
                if( abs_v > maxSpeed ){
                    abs_v = maxSpeed
                }

                if( abs_v < 0.1 ){
                    abs_v = 0
                }
                else{
                    let d = player.getViewDirection();
                    airCraft.clearVelocity();
                    d = turning(d,r,turnRad);
                    if( world.getDynamicProperty(`gvcv5:worldLimit`) && airCraft.dimension.id == `minecraft:overworld` ){
                        
                        if( airCraft.location.x > world.getDynamicProperty(`gvcv5:worldLimitO`)/2 && d.x > 0 ){
                            d.x = 0;
                        }
                        if( airCraft.location.x < -world.getDynamicProperty(`gvcv5:worldLimitO`)/2 && d.x < 0 ){
                            d.x = 0;
                        }
                        if( airCraft.location.y > 320 && d.y > 0 ){
                            d.y = 0;
                        }
                        if( airCraft.location.y < -64 && d.y < 0 ){
                            d.y = 0;
                        }
                        if( airCraft.location.z > world.getDynamicProperty(`gvcv5:worldLimitO`)/2 && d.z > 0 ){
                            d.z = 0;
                        }
                        if( airCraft.location.z < -world.getDynamicProperty(`gvcv5:worldLimitO`)/2 && d.z < 0 ){
                            d.z = 0;
                        }

                    }
                    else if( world.getDynamicProperty(`gvcv5:worldLimit`) && airCraft.dimension.id == `minecraft:nether` ){
                        if( airCraft.location.x > world.getDynamicProperty(`gvcv5:worldLimitN`)/2 && d.x > 0 ){
                            d.x = 0;
                        }
                        if( airCraft.location.x < -world.getDynamicProperty(`gvcv5:worldLimitN`)/2 && d.x < 0 ){
                            d.x = 0;
                        }
                        if( airCraft.location.y > 128 && d.y > 0 ){
                            d.y = 0;
                        }
                        if( airCraft.location.y < 0 && d.y < 0 ){
                            d.y = 0;
                        }
                        if( airCraft.location.z > world.getDynamicProperty(`gvcv5:worldLimitN`)/2 && d.z > 0 ){
                            d.z = 0;
                        }
                        if( airCraft.location.z < -world.getDynamicProperty(`gvcv5:worldLimitN`)/2 && d.z < 0 ){
                            d.z = 0;
                        }

                    }
                    if( !world.getDynamicProperty(`gvcv5:doFuelConsume`) || abs_v > 0 ){
                        airCraft.applyImpulse({x:d.x*abs_v,y:d.y*abs_v,z:d.z*abs_v});
                    }
                    else{
                        
                    }
                    player.runCommand(`
                        titleraw @s[tag=!reload,tag=!down] 
                        actionbar {"rawtext":[${airCraftlader(player)},
                        {"text":"§f§rzex.gvc.v${Math.round(abs_v*20*100)/100}m/s\n"},
                        {"text":"HP: ${vehicleHp(HP,HPMax)}"},
                        ${hasFuel(player,airCraft)},
						${Weapon1(player,airCraft,selectedItemSlot)},
						${Weapon2(player,airCraft,selectedItemSlot)},
						${Weapon3(player,airCraft,selectedItemSlot)},
						${Weapon4(player,airCraft,selectedItemSlot)}]}
                    `);
                }
            }
		}
	

	}
	else if( e.id == "zex:playerRotation" ){
		let player = e.sourceEntity;
		let rotation = e.message.split(" ");
		world.sendMessage(`§aX:${rotation[0]} Y:${rotation[1]}`);
		player.setRotation({x: Number(rotation[0]), y: Number(rotation[1])});
		//player.teleport( player.location, {rotation: {x: Number(rotation[0]), y: Number(rotation[1])} } );
	}
	else if( e.id == "zex:playerVfire" ){
		const player = e.sourceEntity;
		const selectedItemSlot = player.selectedSlotIndex;
		
		if( !player.hasTag(`reload`) ){
			if( selectedItemSlot == 0 && world.scoreboard.getObjective(`weaponi_cool`).getScore(player) <= 0 ){
				player.runCommand(`function weaponi`);
			}
			else if( selectedItemSlot == 1 && world.scoreboard.getObjective(`weaponii_cool`).getScore(player) <= 0 ){
				player.runCommand(`function weaponii`);
			}
			else if( selectedItemSlot == 2 && world.scoreboard.getObjective(`weaponiii_cool`).getScore(player) <= 0 ){
				player.runCommand(`function weaponiii`);
			}
			else if( selectedItemSlot == 3 && world.scoreboard.getObjective(`weaponiv_cool`).getScore(player) <= 0 ){
				player.runCommand(`function weaponiv`);
			}
		}
	}
	else if( e.id == "zex:vtext"){
		const vehicle = e.sourceEntity;
		const player = vehicle.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
		const selectedItemSlot = player.selectedSlotIndex;
		if( player.typeId == "minecraft:player" ){
			const attack = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`gattack`];
			const V = vehicle.dimension.getEntities({maxDistance:3,location:vehicle.location,excludeTypes:tankImmuneEntities,excludeNames:[`${player.nameTag}`],excludeFamilies:[`bullet`,`tank`]});
			if( V.length > 0 ){
				for( let vict of V ){
					vict.applyDamage(attack,{damagingEntity:player,cause:EntityDamageCause.entityAttack});
				}
			}
			let v = vehicle.getVelocity();
			let abs_v = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
			const HP = vehicle.getComponent(EntityComponentTypes.Health).currentValue;
			const HPMax = vehicle.getComponent(EntityComponentTypes.Health).defaultValue;
			let fuel = 0;
			let fuelSpendonThisTick = false;
			player.runCommand(`titleraw @s[tag=!reload,tag=!down] actionbar 
				{"rawtext":[{"text":"§f§rzex.gvc.v${Math.round(abs_v*20*100)/100}m/s\n"},
				{"text":"HP: ${vehicleHp(HP,HPMax)}"},
				${hasFuel(player,vehicle)},
				${Weapon1(player,vehicle,selectedItemSlot)},
				${Weapon2(player,vehicle,selectedItemSlot)},
				${Weapon3(player,vehicle,selectedItemSlot)},
				${Weapon4(player,vehicle,selectedItemSlot)}]}`
			);
		}
		else if( player.hasTag(`raid`) && vehicle.hasTag(`is_enemy`) ){
			vehicle.remove();
		}
		else if( player.hasTag(`cantriding`) && vehicle.hasTag(`is_enemy`) ){
			vehicle.remove();
			player.removeTag(`cantriding`);
		}
	}
	else if( e.id == "zex:test" ){
		const player = e.sourceEntity;
		const a = Infinity;
		player.setDynamicProperty(`gvcv5:gunUsed`,0);
	}
	else if( e.id == "zex:chkride"){
		if( world.getDynamicProperty(`gvcv5:airCraftWithItem`) ){
			const airCraft = e.sourceEntity;
			const p = airCraft.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
			let noItem = true;
			for(let i = 0; i < 36; i++){
				let Haditem = p.getComponent("inventory").container.getItem(i);
				if( Haditem != undefined && Haditem.typeId != "minecraft:air" ){
					airCraft.runCommand(`ride @s evict_riders`);
					noItem = false;
					p.sendMessage(`§cYou can't ride this vehicle with items!`);
					p.runCommand(`clear @s minecraft:barrier`);
					break;
				}
			}
			if( noItem ){
				for(let i = 0; i < 36; i++){
					p.runCommand(`replaceitem entity @s slot.inventory ${i} gun:no 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				}
				p.addTag(`onAir`);
				p.runCommand(`give @s gun:mgg 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s gun:tank 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s gun:camera 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s zex:mtype 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s spyglass 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s gun:no 4 0 {"item_lock": { "mode": "lock_in_slot" } }`);
			}
		}
	}
},)