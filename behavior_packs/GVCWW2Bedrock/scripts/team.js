import { world, system, EquipmentSlot, EntityComponentTypes  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import "./teamCompornents";

const GlobalFlags = [ 
	`redmainbase`,`bluemainbase`,`greenmainbase`,`airbase`,`airbaseii`,`city`,`cityii`,`abandoned_factory`,`abandoned_factoryii`,`ruins`,`ruinsii`,`reichstag`,`reichstagii`,`triumphal_arch`,`triumphal_archii`,`cv`,`cvii`
];

const Teams = [
	//ww2
	`SOV`, //Soviet
	`GER`, //Germany
	`USA`, //United States
	`JAP`, //Japan
	`ENG` //Britain
]

//1 day
const CoolTime = 24000;

function trueTeamName( team ){
	if( team == Teams[0] ){
		return `§cRED`
	}
	else if( team == Teams[1] ){
		return `§9BLUE`
	}
	else if( team == Teams[2] ){
		return `§aGREEN`
	}
	else if( team == Teams[3] ){
		return `§eYELLOW`
	}
}


function gvcv5GetTime() {
    const time = world.getAbsoluteTime();
    let day = Math.floor(time / 24000); // 1日 = 24000ティック
    let hour = Math.floor((time % 24000) / 1000) + 6; // 1時間 = 1000ティック、午前6時開始
    let minute = Math.floor((time % 1000) / 1000 * 60); // 1分 = 60秒

    // 時間が24以上の場合、次の日に繰り上げ
    if (hour >= 24) {
        hour -= 24;
        day += 1;
    }

    // 日、時間、分を2桁に整形
    if (day < 10) { day = `0${day}`; }
    if (hour < 10) { hour = `0${hour}`; }
    if (minute < 10) { minute = `0${minute}`; }

    return `${day}:${hour}:${minute}`;
}
async function tpWithDelay( user, location,dimension, delay){
	user.sendMessage(`you will be teleported in ${delay/20} seconds`);
	user.runCommand(`inputpermission set @s movement disabled`);
	await system.waitTicks(delay);
	user.runCommand(`inputpermission set @s movement enabled`);
	user.teleport(location, { dimension: dimension });
}

function gvcv5becomeTeam( user,team ){
	if( world.getDynamicProperty(`${team}Leader`) == undefined ){
		if( world.getDynamicProperty(`${team}Pass`) != undefined ){
			const form = new ModalFormData();
			form.title(`script.gvcv5.input_password.name`);
			form.textField(`script.gvcv5.input_password.name`,``);
			form.show(user).then( r => {
				if (!r.canceled) {
					if( world.getDynamicProperty(`${team}Pass`) == r.formValues[0] ){
						gvcv5CreateTeam(user,team);
					}
					else{
						user.sendMessage({ translate: `script.gvcv5.invaid_password.name`});
					}
				}
			},)
		}
		else{
			gvcv5CreateTeam(user,team);
		}
	}
	else{
		if( user.hasTag(`bannedFrom${team}`) ){
			user.sendMessage({ translate: `script.gvcv5.bannedFrom${team}.name`});
		}
		else {
			user.addTag(`wantToBe${team}`);
			user.runCommand(`tellraw @a[tag=${team}Leader] {\"rawtext\":[{\"text\":\"${user.nameTag}\"},{\"translate\":\"script.gvcv5.wantToBe.name\"}]}`)
		}
	}
}

function gvcv5CreateTeam( user,team ){
	user.triggerEvent(`gvcv5:become_${team}team`);
	world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.youAreIn${team}team.name`}]);
	world.setDynamicProperty(`${team}chat`,``);
	world.setDynamicProperty(`${team}list`,`${user.nameTag}`);
	world.setDynamicProperty(`${team}Leader`,`${user.nameTag}`);
	user.addTag(`${team}Leader`);
	if( world.getDynamicProperty(`teamJail`) ){
		user.runCommand(`give @s gvcv5:building_${team}jail_b`)
	}
}
function gvcv5RemoveTeam( team ){
	world.setDynamicProperty(`${team}Leader`,undefined);
	world.setDynamicProperty(`${team}list`,``);
	for( const myAlly of world.getPlayers({ families: [ team ] }) ){
		myAlly.triggerEvent(`gvcv5:become_noteam`);
		myAlly.removeTag(`${team}Leader`);
		myAlly.runCommand(`clear @s zex:phone_${team}`);
	}
	world.sendMessage([{ translate: `script.gvcv5.phone_dismantle_${team}.name`}]);
}
function gvcv5AddTeamList( user,team ){
	if( world.getDynamicProperty(`${team}list`) == undefined ){
		world.setDynamicProperty(`${team}list`,`${user.nameTag}`);
	}
	else{
		world.setDynamicProperty(`${team}list`,`${world.getDynamicProperty(`${team}list`)}\n${user.nameTag}`);
	}
}
function gvcv5RemoveTeamList( user,team ){
	if( world.getDynamicProperty(`${team}list`) != undefined ){
		world.setDynamicProperty(`${team}list`,`${world.getDynamicProperty(`${team}list`).replace(`\n${user.nameTag}`,"")}`);
	}
}
/*
world.afterEvents.playerSpawn.subscribe( e => {
	const p = e.player;
	const redJail = world.getDynamicProperty(`redJail`); 
	const blueJail = world.getDynamicProperty(`blueJail`); 
	const greenJail = world.getDynamicProperty(`greenJail`);
	const yellowJail = world.getDynamicProperty(`yellowJail`);
	let team = `noteam`;
	if( p.hasTag(`red`) ){
		team = `§cRED`;
	}
	else if( p.hasTag(`blue`) ){
		team = `§9BLUE`;
	}
	else if( p.hasTag(`green`) ){
		team = `§aGREEN`;
	}
	else if( p.hasTag(`yellow`) ){
		team = `§eYELLOW`;
	}

	if( ( p.hasTag(`downedbyred`) || p.hasTag(`redSub`) ) && world.getDynamicProperty(`teamJail`) ){
		p.teleport(redJail);
		if(  p.hasTag(`downedbyred`) ){
			world.scoreboard.getObjective("ALLFlags").addScore(team,-1);
			world.scoreboard.getObjective("DeathTime").setScore(p,24000);
			p.addTag(`redSub`);
			p.addTag(`onDeath`);
			p.runCommand(`give @s rotten_flesh 4`);
		}
	}

	else if(( p.hasTag(`downedbyblue`) || p.hasTag(`blueSub`) ) && world.getDynamicProperty(`teamJail`) ){
		p.teleport(blueJail);
		if(  p.hasTag(`downedbyblue`) ){
			world.scoreboard.getObjective("ALLFlags").addScore(team,-1);
			world.scoreboard.getObjective("DeathTime").setScore(p,24000);
			p.addTag(`blueSub`);
			p.addTag(`onDeath`);
			p.runCommand(`give @s rotten_flesh 4`);
		}
	}
	else if( (p.hasTag(`downedbygreen`) || p.hasTag(`greenSub`)) && world.getDynamicProperty(`teamJail`) ){
		p.teleport(greenJail);
		if(  p.hasTag(`downedbygreen`) ){
			world.scoreboard.getObjective("ALLFlags").addScore(team,-1);
			world.scoreboard.getObjective("DeathTime").setScore(p,24000);
			p.addTag(`greenSub`);
			p.addTag(`onDeath`);
			p.runCommand(`give @s rotten_flesh 4`);
		}
	}
	else if( (p.hasTag(`downedbyyellow`) || p.hasTag(`yellowSub`)) && world.getDynamicProperty(`teamJail`) ){
		p.teleport(yellowJail);
		if(  p.hasTag(`downedbyyellow`) ){
			world.scoreboard.getObjective("ALLFlags").addScore(team,-1);
			world.scoreboard.getObjective("DeathTime").setScore(p,24000);
			p.addTag(`yellowSub`);
			p.addTag(`onDeath`);
			p.runCommand(`give @s rotten_flesh 4`);
		}
	}
	p.runCommand(`inputpermission set @s movement enabled`);
	p.removeTag(`downedbyred`);
	p.removeTag(`downedbyblue`);
	p.removeTag(`downedbygreen`);
	p.removeTag(`downedbyyellow`);
} )
*/
world.beforeEvents.playerLeave.subscribe( e => {
	if( e.player.hasTag(`onDeath`) ){
		e.player.setDynamicProperty(`cTime`,world.getAbsoluteTime());
	}
} )
world.afterEvents.playerJoin.subscribe( e => {
	const player = world.getPlayers( { name : e.playerName } )[0];
	if( player.hasTag(`onDeath`) ){
		const score = world.getAbsoluteTime() - player.getDynamicProperty(`cTime`);
		world.scoreboard.getObjective("DeathTime").setScore(player,score);
	}
} )


system.afterEvents.scriptEventReceive.subscribe( e => {
	if( e.id === "gvcv5:TeamList" ){
		let itemRawText = []
		for( const Ally of world.getPlayers({ families: [ "SOV" ] }) ){
			itemRawText.push({ text: `§c${Ally.nameTag}§r\n` });
		}
		for( const Ally of world.getPlayers({ families: [ "GER" ] }) ){
			itemRawText.push({ text: `§8${Ally.nameTag}§r\n` });
		}
		for( const Ally of world.getPlayers({ families: [ "USA" ] }) ){
			itemRawText.push({ text: `§9${Ally.nameTag}§r\n` });
		}
		for( const Ally of world.getPlayers({ families: [ "JAP" ] }) ){
			itemRawText.push({ text: `§a${Ally.nameTag}§r\n` });
		}
		for( const Ally of world.getPlayers({ families: [ "ENG" ] }) ){
			itemRawText.push({ text: `§e${Ally.nameTag}§r\n` });
		}
		for( const Ally of world.getPlayers({ families: [ "noteam" ] }) ){
			itemRawText.push({ text: `${Ally.nameTag}\n` });
		}
		world.sendMessage({ rawtext: itemRawText});
	}
	else if( e.id == `zex:spawnpoint` ){
		const player = e.sourceEntity;
		const location = player.getSpawnPoint();
		const O = world.getDefaultSpawnLocation();
		player.removeTag(`redSub`);
		player.removeTag(`blueSub`);
		player.removeTag(`greenSub`);
		player.removeTag(`yellowSub`);
		if( player.getSpawnPoint() != undefined  ){
			player.teleport({ x:location.x,y:location.y,z:location.z },{ dimension:location.dimension } );
		}
		else if (player.hasTag(`red`) && world.getDynamicProperty(`redSpawn`) != undefined ){
			player.teleport(world.getDynamicProperty(`redSpawn`),{ dimension:world.getDimension(`overworld`) } );
		}
		else if (player.hasTag(`blue`) && world.getDynamicProperty(`blueSpawn`) != undefined ){
			player.teleport(world.getDynamicProperty(`blueSpawn`),{ dimension:world.getDimension(`overworld`) } );
		}
		else if (player.hasTag(`green`) && world.getDynamicProperty(`greenSpawn`) != undefined ){
			player.teleport(world.getDynamicProperty(`greenSpawn`),{ dimension:world.getDimension(`overworld`) } );
		}
		else if (player.hasTag(`yellow`) && world.getDynamicProperty(`yellowSpawn`) != undefined ){
			player.teleport(world.getDynamicProperty(`yellowSpawn`),{ dimension:world.getDimension(`overworld`) } );
		}
		else{
			player.teleport( {x:6,y:63,z:0} ,{ dimension:world.getDimension(`the_end`) } );
			player.addEffect(`resistance`,600,{ amplifier:255 } );
		}
	}
	else if( e.id == `zex:flagAdd` ){
		const flagId = e.message.split(` `)[0];
		const team = e.message.split(` `)[1];
		const Pos = e.sourceEntity.location;
		world.setDynamicProperty(`${flagId}_${team}`,Pos);
		const IsBattlle =  world.scoreboard.getObjective(`ALLFlags`).hasParticipant(`Battle`);
		if( IsBattlle ){
			world.scoreboard.getObjective(`ALLFlags`).setScore(`Battle`,-999);
			const attacker = world.getDynamicProperty(`gvcv5:flagAttacker`);
			const defender = world.getDynamicProperty(`gvcv5:flagDefender`);
			world.setDynamicProperty(`gvcv5:flagAttacker`,undefined);
			world.setDynamicProperty(`gvcv5:flagDefender`,undefined);
			world.setDynamicProperty(`gvcv5:flagDimension`,undefined);
			world.setDynamicProperty(`gvcv5:flagAttackFlag`,undefined);
			world.setDynamicProperty(`gvcv5:${attacker}_attackCool`,0);
			world.setDynamicProperty(`gvcv5:flagAttackStart`,false);
			world.sendMessage([{ translate: `script.gvcv5.${attacker}team.name` },{ translate: `script.gvcv5.defenced.name` },{ translate: `script.gvcv5.${defender}team.name` },{ translate: `script.gvcv5.occupied.name` }]);
		}
	}
	else if( e.id == `zex:flagRem` ){
		const flagId = e.message.split(` `)[0];
		const team = e.message.split(` `)[1];
		world.setDynamicProperty(`${flagId}_${team}`,undefined);
	}
	else if( e.id === `zex:jailpoint` ){
		const block = e.sourceBlock;
		const dimension = block.dimension;
		const location = block.location;
		const team = e.message;
		world.setDynamicProperty(`${team}Jail`,location);
		dimension.setBlockType(location, "minecraft:air");
	}
	else if( e.id === `zex:execution` ){
		const user = e.sourceEntity;
		const location = user.location;
		const userFamily = e.message;
		const form = new ActionFormData();
		form.title(`script.gvcv5.execution.name`);
		const targets = world.getPlayers({tags: [`${userFamily}Sub`]});
		for( const target of targets ){
			form.button(`${target.nameTag}`);
		}
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( result => {
			if ( !result.canceled && result.selection < targets.length ){
				targets[result.selection].teleport(location);
				targets[result.selection].runCommand(`inputpermission set @s movement disabled`);
			}
		})
	}
	else if( e.id === `zex:jail` ){
		const user = e.sourceEntity;
		const location = user.location;
		const userFamily = e.message;
		const form = new ActionFormData();
		form.title(`script.gvcv5.jail.name`);
		const targets = world.getPlayers({tags: [`${userFamily}Sub`]});
		for( const target of targets ){
			form.button(`${target.nameTag}`);
		}
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( result => {
			if ( !result.canceled && result.selection < targets.length ){
				targets[result.selection].teleport(location);
				targets[result.selection].addEffect("slowness", 100,{ amplifier: 10 });
			}
		})
	}
	else if( e.id == "zex:transferTeam" ){
		const user = e.sourceEntity;
		const from = e.message.split(" ")[0];
		const to = e.message.split(" ")[1];
		if( world.getDynamicProperty(`${from}Leader`) == user.nameTag ){
			gvcv5RemoveTeam(from);
		}
		else{
			gvcv5RemoveTeamList(user,from);
			user.removeTag(`${from}Leader`);
			world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.phone_left_${from}.name`}]);
		}
		gvcv5AddTeamList(user,to);

	}	else if( e.id == "gvcv5:phone_noteam" && !e.sourceEntity.hasTag(`down`) ){
		const user = e.sourceEntity;
		const team = e.message;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const form = new ActionFormData();
		form.title(`script.gvcv5.phone_noteam.name`);
		form.button(`script.gvcv5.howToGun.name`);
		form.button(`script.gvcv5.howToVechile.name`);
		form.button(`script.gvcv5.phone_howToTeam.name`);
		if( team == `noteam` ){
			form.button(`script.gvcv5.select_team.name`);
		}
		form.show(user).then( r => {
			if (!r.canceled) {
				if( r.selection == 0 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howToGun.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc0.name` });
					itemRawText.push({ text: `\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc1.name` });
					itemRawText.push({ text: `\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc2.name` });
					itemRawText.push({ text: `\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc3.name` });
					itemRawText.push({ text: `\n` });
					form.body({ rawtext: itemRawText});
					if( user.hasTag(`autoReload`) ){
						form.button(`script.gvcv5.autoReloadOff.name`);
					}
					else{
						form.button(`script.gvcv5.autoReloadOn.name`);
					}
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							
							if( r.selection == 0 ){
								if( user.hasTag(`autoReload`) ){
									user.removeTag(`autoReload`)
								}
								else{
									user.addTag(`autoReload`)
								}
							}
							user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
						}
					} )
				}
				else if( r.selection == 1 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howToVechile.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc0.name` });
					itemRawText.push({ text: `\n` });
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc1.name` });
					itemRawText.push({ text: `\n` });
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc2.name` });
					itemRawText.push({ text: `\n` });
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
						}
					} )
				}
				else if( r.selection == 2 ){
					user.runCommand(`scriptevent gvcv5:phone_howToTeam ${team}`);
				}
				else if( r.selection == 3 ){
					user.runCommand(`scriptevent gvcv5:phone_noteam_selectteam`);
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_howToTeam" && !e.sourceEntity.hasTag(`down`) ){
		const user = e.sourceEntity;
		const team = e.message;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const form = new ActionFormData();
		form.title(`script.gvcv5.phone_howToTeam.name`);
		form.body(`script.gvcv5.phone_howToTeamDesc.name`);
		form.button(`script.gvcv5.phone_howToTeam1.name`);
		form.button(`script.gvcv5.phone_howToTeam2.name`);
		form.button(`script.gvcv5.phone_howToTeam3.name`);
		form.button(`script.gvcv5.phone_howToTeam4.name`);
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( r => {
			if (!r.canceled) {
				if( r.selection == 0 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.phone_howToTeam1.name`);
					form.body(`script.gvcv5.phone_howToTeam1Desc.name`);
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_howToTeam ${team}`);
						}
					} )
				}
				else if( r.selection == 1 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.phone_howToTeam2.name`);
					form.body(`script.gvcv5.phone_howToTeam2Desc.name`);
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_howToTeam ${team}`);
						}
					} )
				}
				else if( r.selection == 2 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.phone_howToTeam3.name`);
					form.body(`script.gvcv5.phone_howToTeam3Desc.name`);
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_howToTeam ${team}`);
						}
					} )
				}
				else if( r.selection == 3 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.phone_howToTeam4.name`);
					form.body(`script.gvcv5.phone_howToTeam4Desc.name`);
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_howToTeam ${team}`);
						}
					} )
				}
				else if( r.selection == 4 ){
					user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_noteam_selectteam" && !e.sourceEntity.hasTag(`down`) ){
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const form = new ActionFormData();
		let alreadyTeam = false
		form.title(`script.gvcv5.select_team.name`);
		form.body(`script.gvcv5.select_team_body.name`);
		form.button(`script.gvcv5.become_SOV.name`);
		form.button(`script.gvcv5.become_GER.name`);
		form.button(`script.gvcv5.become_USA.name`);
		form.button(`script.gvcv5.become_JAP.name`);
		form.button(`script.gvcv5.become_ENG.name`);
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( r => {
			if (!r.canceled) {								
				if( r.selection == 0 ){
					gvcv5CreateTeam(user,`SOV`);
				}
				else if( r.selection == 1 ){
					gvcv5CreateTeam(user,`GER`);
				}
				else if( r.selection == 2 ){
					gvcv5CreateTeam(user,`USA`);
				}
				else if( r.selection == 3 ){
					gvcv5CreateTeam(user,`JAP`);
				}
				else if( r.selection == 4 ){
					gvcv5CreateTeam(user,`ENG`);
				}
				else if( r.selection == 5 ){
					user.runCommand(`scriptevent gvcv5:phone_noteam`);
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_locked" && !e.sourceEntity.hasTag(`down`)  ){
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const userFamily = e.message;
		if( phone.getDynamicProperty("password") != undefined ){
			const form = new ModalFormData();
			form.title(`script.gvcv5.input_password.name`);
			form.textField(`script.gvcv5.input_password.name`,``);
			form.show(user).then( r => {
				if (!r.canceled) {
					if( phone.getDynamicProperty("password") == r.formValues[0] ){
						user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
					}
					else{
						user.sendMessage({ translate: `script.gvcv5.invaid_password.name`});
					}
				}
			},)
		}
		else{
			user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
		}
	}
	else if( e.id == "gvcv5:phone_tp_block" && !e.sourceEntity.hasTag(`down`)  ){
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const userFamily = e.message;
		const form = new ActionFormData();
		form.title(`script.gvcv5.phone_tp_block.name`);
		form.button(`script.gvcv5.phone_back.name`);
		form.button(`${phone.getDynamicProperty("slot1_name")}`);
		form.button(`${phone.getDynamicProperty("slot2_name")}`);
		form.button(`${phone.getDynamicProperty("slot3_name")}`);
		form.button(`${phone.getDynamicProperty("slot4_name")}`);
		form.button(`${phone.getDynamicProperty("slot5_name")}`);
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == 0 ){
					user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
				}
				else if( result.selection == 1 && phone.getDynamicProperty("slot1") != undefined ){
					user.teleport(phone.getDynamicProperty("slot1"))
				}
				else if( result.selection == 2 && phone.getDynamicProperty("slot2") != undefined ){
					user.teleport(phone.getDynamicProperty("slot2"))
				}
				else if( result.selection == 3 && phone.getDynamicProperty("slot3") != undefined ){
					user.teleport(phone.getDynamicProperty("slot3"))
				}
				else if( result.selection == 4 && phone.getDynamicProperty("slot4") != undefined ){
					user.teleport(phone.getDynamicProperty("slot4"))
				}
				else if( result.selection == 5 && phone.getDynamicProperty("slot5") != undefined ){
					user.teleport(phone.getDynamicProperty("slot5"))
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_set_tp_block" && !e.sourceEntity.hasTag(`down`)  ){
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const userFamily = e.message;
		const form = new ActionFormData();
		let locateName = `unnamed`
		form.title(`script.gvcv5.phone_set_tp_block.name`);
		form.button(`${phone.getDynamicProperty("slot1_name")}`);
		form.button(`${phone.getDynamicProperty("slot2_name")}`);
		form.button(`${phone.getDynamicProperty("slot3_name")}`);
		form.button(`${phone.getDynamicProperty("slot4_name")}`);
		form.button(`${phone.getDynamicProperty("slot5_name")}`);
		form.show(user).then( result => {
			if ( !result.canceled ){
				const form = new ModalFormData()
				form.title(`script.gvcv5.phone_set_tp_block_name.name`)
				form.textField(`script.gvcv5.phone_set_tp_block_name.name`,`locateName`,`locateName`);
				form.show(user).then( r => {
					if (!r.canceled) {
						locateName = r.formValues[0]
						user.sendMessage(locateName)
						user.sendMessage(locateName)
						if( result.selection == 0 ){
							phone.setDynamicProperty("slot1",user.location);
							phone.setDynamicProperty("slot1_name",locateName);
						}
						else if( result.selection == 1 ){
							phone.setDynamicProperty("slot2",user.location);
							phone.setDynamicProperty("slot2_name",locateName);
						}
						else if( result.selection == 2 ){
							phone.setDynamicProperty("slot3",user.location);
							phone.setDynamicProperty("slot3_name",locateName);
						}
						else if( result.selection == 3 ){
							phone.setDynamicProperty("slot4",user.location);
							phone.setDynamicProperty("slot4_name",locateName);
						}
						else if( result.selection == 4 ){
							phone.setDynamicProperty("slot5",user.location);
							phone.setDynamicProperty("slot5_name",locateName);
						}
					}
				},)
			}
		},)
	}
	else if( e.id == "gvcv5:phone_teamChat" ){
		const userFamily = e.message;
		const user = e.sourceEntity;
		const form = new ActionFormData();
		let text = world.getDynamicProperty(`${userFamily}chat`);
		form.title(`script.gvcv5.phone_teamChat.name`);
		form.button(`script.gvcv5.phone_sendmessage.name`);
		form.button(`script.gvcv5.phone_back.name`);
		if( user.hasTag(`${userFamily}leader`) ){
			form.button(`script.gvcv5.phone_delete_chat.name`);
		}
		form.body(`${text}`);
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == 0 ){
					const form = new ModalFormData()
					form.title(`script.gvcv5.phone_sendmessage.name`)
					form.textField(`script.gvcv5.input_message.name`,``);
					form.show(user).then( r => {
						if (!r.canceled) {
							text += `[${user.nameTag}]:${r.formValues[0]}\n`;
							world.setDynamicProperty(`${userFamily}chat`,text);
							user.runCommand(`tellraw @a[hasitem={item=zex:phone_${userFamily}},rm=1] {\"rawtext\":[{\"translate\":\"script.gvcv5.newMessage_${userFamily}.name\"}]}`);
							user.runCommand(`scriptevent gvcv5:phone_teamChat ${userFamily}`);
						}
					},)
				}
				if( result.selection == 1 ){
					user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
				}
				if( result.selection == 2 ){
					world.setDynamicProperty(`${userFamily}chat`,``)
				}
			}
		} )
	}
	else if( e.id == "gvcv5:phone_unlocked" ){
		const userFamily = e.message;
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		let phoneArray = [];
		const form = new ActionFormData();
		form.title(`script.gvcv5.phone.name`);
		form.button(`script.gvcv5.phone_tp.name`);
		form.button(`script.gvcv5.phone_tp_block.name`);
		form.button(`script.gvcv5.phone_teamChat.name`);
		form.button(`script.gvcv5.phone_password.name`);
		form.button(`script.gvcv5.phone_leave.name`);
		form.button(`script.gvcv5.phone_howTo.name`);
		if( user.hasTag(`${userFamily}leader`) ){
			form.button(`script.gvcv5.phone_accept_to_join.name`);
			form.button(`script.gvcv5.phone_transfer_leader.name`);
			form.button(`script.gvcv5.phone_kick_member.name`);
		}
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == 0 ){
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_tp.name`);
					for( const myAlly of world.getPlayers({ families: [ userFamily ] }) ){
						phoneArray.push( myAlly.location );
						form_tp.button(myAlly.nameTag);
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection < phoneArray.length ){
								user.teleport(phoneArray[result.selection]);
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				if( result.selection == 1 ){
					user.runCommand(`scriptevent gvcv5:phone_tp_block ${userFamily}`);
				}
				else if( result.selection == 2 ){
					user.runCommand(`scriptevent gvcv5:phone_teamChat ${userFamily}`);
				}
				else if( result.selection == 3 ){
					const form = new ModalFormData()
					form.title(`script.gvcv5.phone_password.name`)
					form.textField(`script.gvcv5.input_password.name`,`${phone.getDynamicProperty("password")}`);
					form.show(user).then( r => {
						if (!r.canceled) {
							phone.setDynamicProperty("password",r.formValues[0]);
							user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
						}
					},)
				}
				if( result.selection == 4 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.phone_leave.name`);
					form.body(`script.gvcv5.leave_team_body.name`);
					form.button(`script.gvcv5.phone_accept.name`);
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection == 0 ){
								user.triggerEvent(`gvcv5:become_noteam`);
								user.runCommand(`clear @s zex:phone_${userFamily}`);
								user.kill();
								world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.phone_left_${userFamily}.name`}]);
								if( user.hasTag(`${userFamily}leader`) ){
									world.sendMessage([{ translate: `script.gvcv5.phone_dismantle_${userFamily}.name`}]);
									for( const myAlly of world.getPlayers({ families: [ userFamily ] }) ){
										myAlly.removeTag(`${userFamily}leader`);
										myAlly.triggerEvent(`gvcv5:become_noteam`);
										myAlly.runCommand(`clear @s zex:phone_${userFamily}`);
									}
								}
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				else if( result.selection == 5 ){
					user.runCommand(`scriptevent gvcv5:phone_noteam ${userFamily}`);
				}
				else if( result.selection == 6 ){
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_accept_to_join.name`);
					for( const myAlly of world.getPlayers({ tags: [ `wantToBe${userFamily}` ],families: [ `noteam` ] }) ){
						phoneArray.push( myAlly );
						form_tp.button(myAlly.nameTag);
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection < phoneArray.length ){
								const form_accept = new ActionFormData();
								const target = phoneArray[result.selection];
								form_accept.title(`script.gvcv5.phone_player_accept.name`);
								form_accept.button(`script.gvcv5.phone_accept.name`);
								form_accept.button(`script.gvcv5.phone_deny.name`);
								form_accept.show(user).then( result => {
									if ( !result.canceled ){
										if(result.selection == 0){
											target.triggerEvent(`gvcv5:become_${userFamily}team`);
											target.removeTag(`wantToBe${userFamily}`);
											world.sendMessage([{text: `${target.nameTag}`},{ translate: `script.gvcv5.youAreIn${userFamily}team.name`}]);
											user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
										}
										else if(result.selection == 1){
											target.removeTag(`wantToBe${userFamily}`);
											target.sendMessage({ translate: `script.gvcv5.wantToBe_deny.name`});
											user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
										}
									}
								} )
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				if( result.selection == 7 ){
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_transfer_leader.name`);
					for( const myAlly of world.getPlayers({ families: [ userFamily ] }) ){
						phoneArray.push( myAlly );
						form_tp.button(myAlly.nameTag);
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection < phoneArray.length ){
								user.removeTag(`${userFamily}leader`);
								phoneArray[result.selection].addTag(`${userFamily}leader`);
								phoneArray[result.selection].sendMessage(`script.gvcv5.phone_new_leader.name`);
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				if( result.selection == 8 ){ 
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_kick_member.name`);
					for( const myAlly of world.getPlayers({ families: [ userFamily ] }) ){
						if(!myAlly.hasTag(`${userFamily}leader`)){
							phoneArray.push( myAlly );
							form_tp.button(myAlly.nameTag);
						}
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection < phoneArray.length ){
								phoneArray[result.selection].triggerEvent(`gvcv5:become_noteam`);
								phoneArray[result.selection].runCommand(`clear @s zex:phone_${userFamily}`);
								phoneArray[result.selection].kill();
								world.sendMessage([{text: `${phoneArray[result.selection].nameTag}`},{ translate: `script.gvcv5.phone_kicked_${userFamily}.name`}]);
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
			}
		} )
	}
},)