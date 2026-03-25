import { world, system, EquipmentSlot, EntityComponentTypes  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import "./teamCompornents";
import { getInventoryItem } from "./main";

const GlobalFlags = [ 
	`redmainbase`,`bluemainbase`,`greenmainbase`,`airbase`,`airbaseii`,`city`,`cityii`,`abandoned_factory`,`abandoned_factoryii`,`ruins`,`ruinsii`,`reichstag`,`reichstagii`,`triumphal_arch`,`triumphal_archii`,`cv`,`cvii`
];

const worldDimensions = [ `overworld`, `nether`, `the_end` ];

const Teams = [
	//ww2 using Hoi4 country tag
	`SOV`, //Soviet Union ; Red Dye( id :14 ); Text color : §c ; Allied Power
	`GER`, //Nazi Germany ; Black Dye( id : 0 ); Text color : §8 ; Axis Power
	`USA`, //United States ; Blue Dye( id : 11 ); Text color : §9 ; Allied Power
	`JAP`, //Empire of Japan ; Green Dye( id : 10 ); Text color : §a ; Axis Power
	`ENG` //United Kingdom ; Yellow Dye( id : 4 ); Text color : §e ; Allied Power
	//`ITA`, //Kingdom of Italy ; Brown Dye( id : 3 ); Text color : §6 ; Axis Power
	//`FRA`, //France ; Light Blue Dye( id : 3 ); Text color : §3 ; Allied Power
	//`CHI`, //Republic of China ; Purple Dye( id : 10 ); Text color : §5 ; Allied Power
]

function dateScore(){
	//score is towerd by 5 days 
	const tick = world.getAbsoluteTime();
	return Math.pow(2, 1+Math.floor(tick / 120000));
	
}

function getTeam( team ){
	if( team == `sov` || team == `SOV` ){
		return `SOV`
	}
	else if( team == `ger` || team == `GER` ){
		return `GER`
	}
	else if( team == `usa` || team == `USA` ){
		return `USA`
	}
	else if( team == `jap` || team == `JAP` ){
		return `JAP`
	}
	else if( team == `eng` || team == `ENG` ){
		return `ENG`
	}
	return `noteam`

}

function getTeam2( team ){
	if( team == `sov` || team == `SOV` ){
		return `sov`
	}
	else if( team == `ger` || team == `GER` ){
		return `ger`
	}
	else if( team == `usa` || team == `USA` ){
		return `usa`
	}
	else if( team == `jap` || team == `JAP` ){
		return `jap`
	}
	else if( team == `eng` || team == `ENG` ){
		return `eng`
	}
	return `noteam`

}

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

function getYYYYMMDD() {
	const day = world.getAbsoluteTime() / 24000;
	const year = 1942 + Math.floor(day / 365);
	const month = Math.floor((day % 365) / 30) + 1;
	const date = Math.floor((day % 365) % 30) + 1;
	return `${year}-${month}-${date}`;
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
			user.runCommand(`tellraw @a[tag=${team}Leader] {\"rawtext\":[{\"text\":\"${user.name}\"},{\"translate\":\"script.gvcv5.wantToBe.name\"}]}`)
		}
	}
}

function gvcv5CreateTeam( user,team ){
	user.triggerEvent(`gvcv5:become_${team}team`);
	world.sendMessage([{text: `${user.name}`},{ translate: `script.gvcv5.youAreIn${team}team.name`}]);
	world.setDynamicProperty(`${team}chat`,``);
	world.setDynamicProperty(`${team}list`,`${user.name}`);
	world.setDynamicProperty(`${team}Leader`,`${user.name}`);
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
		world.setDynamicProperty(`${team}list`,`${user.name}`);
	}
	else{
		world.setDynamicProperty(`${team}list`,`${world.getDynamicProperty(`${team}list`)}\n${user.name}`);
	}
}
function gvcv5RemoveTeamList( user,team ){
	if( world.getDynamicProperty(`${team}list`) != undefined ){
		world.setDynamicProperty(`${team}list`,`${world.getDynamicProperty(`${team}list`).replace(`\n${user.name}`,"")}`);
	}
}

function gvcww2teamTPBlock ( user, flag, team){
	let userFamily = team;
	const team2 = getTeam2(team);
	const form = new ActionFormData();
	let locateName = `unnamed`
	form.title(`.debug Home Menu`);	
	for( let i = 0; i < 9; i++ ){
		form.button(`${world.getDynamicProperty(`${userFamily}_slot${i}_name`)}`,`textures/ui/phone/number${i}`);
	}
	form.show(user).then( result => {
		if ( !result.canceled ){
			const form = new ModalFormData()
			const PreName = `${world.getDynamicProperty(`${userFamily}_slot${result.selection}_name`)}`
			form.title(`script.gvcv5.phone_set_tp_block_name.name`)
			form.textField(`script.gvcv5.phone_set_tp_block_name.name`,`${PreName}`, {defaultValue: `${PreName}`});
			form.show(user).then( r => {
				if (!r.canceled) {
					const bossFlag = world.getDimension(flag.dimension.id).spawnEntity(`gvcww2:flag_${team2}_main_base`,flag.location);
					locateName = r.formValues[0]
					bossFlag.nameTag = `${locateName}`;
					bossFlag.setDynamicProperty(`TPBlockSlot`,result.selection);
					world.setDynamicProperty(`${userFamily}_slot${result.selection}`,flag.location);
					world.setDynamicProperty(`${userFamily}_slot${result.selection}_flag`,true);
					world.setDynamicProperty(`${userFamily}_slot${result.selection}_dimension`,flag.dimension.id);
					world.setDynamicProperty(`${userFamily}_slot${result.selection}_name`,locateName);

					flag.remove();
					//Set team main base flag if flag lost, Tp block will be lost.
					//you cant set same number of flag because of this, but you can set same flag in different team.
				}
			},)
		}
	},)
}


async function startAttack(user, attacker, defender, attackFlag){
	//world.setDynamicProperty(`${userFamily}_attackCool`,world.getAbsoluteTime());
	world.setDynamicProperty(`gvcv5:flagAttacker`,attacker);
	world.setDynamicProperty(`gvcv5:flagDefender`,defender);
	world.setDynamicProperty(`gvcv5:flagDimension`,user.dimension.id);
	world.setDynamicProperty(`gvcv5:flagAttackFlag`,attackFlag);
	print(defender);
	world.scoreboard.getObjective(`ALLFlags`).setScore(`Prepare`,3600);
	// 3 minutes until start, you can change this time by changing the score of "Prepare"
	world.sendMessage([{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.${defender}team3.name` },{ text: `${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `03:00` }]);
	await system.waitTicks(1200); // 1 minutes in ticks
	// 2 minutes until start
	world.sendMessage([{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.${defender}team3.name` },{ text: `${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `02:00` }]);
	await system.waitTicks(1200); // 1 minutes in ticks
	// 1 minute until start
	world.sendMessage([{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.${defender}team3.name` },{ text: `${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `01:00` }]);
	await system.waitTicks(600); // 30s in ticks
	world.sendMessage([{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.${defender}team3.name` },{ text: `${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:30` }]);
	await system.waitTicks(300); // 15s in ticks
	world.sendMessage([{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.${defender}team3.name` },{ text: `${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:15` }]);
	await system.waitTicks(100); // 5s in ticks
	world.sendMessage([{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.${defender}team3.name` },{ text: `${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:10` }]);
	await system.waitTicks(100); // 5s in ticks
	world.sendMessage([{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.${defender}team3.name` },{ text: `${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:05` }]);
	await system.waitTicks(20);
	world.sendMessage([{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.${defender}team3.name` },{ text: `${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:04` }]);
	await system.waitTicks(20);
	world.sendMessage([{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.${defender}team3.name` },{ text: `${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:03` }]);
	await system.waitTicks(20);
	world.sendMessage([{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.${defender}team3.name` },{ text: `${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:02` }]);
	await system.waitTicks(20);
	world.sendMessage([{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.${defender}team3.name` },{ text: `${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:01` }]);
	await system.waitTicks(20);
	world.setDynamicProperty(`gvcv5:flagAttackStart`,true);
	world.sendMessage([{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.${defender}team3.name` },{ text: `${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlagStart1.name` }]);
	world.scoreboard.getObjective(`ALLFlags`).removeParticipant(`Prepare`);
	world.scoreboard.getObjective(`ALLFlags`).setScore(`Battle`,12000);
}

//Colored nameTags
system.runInterval( () => {
	const players = world.getAllPlayers();
	for( const player of players ){
		if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`SOVteam`) ){
			player.nameTag = `§c${player.name}§r`;
		}
		else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`GERteam`) ){
			player.nameTag = `§8${player.name}§r`;
		}
		else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`USAteam`) ){
			player.nameTag = `§9${player.name}§r`;
		}
		else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`JAPteam`) ){
			player.nameTag = `§a${player.name}§r`;
		}
		else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`ENGteam`) ){
			player.nameTag = `§e${player.name}§r`;
		}
		else{
			player.nameTag = `${player.name}`;
		}
	}
	if( world.getDynamicProperty("gvcv5:isBossFlag") ){
		for( const team of Teams ){
			const team2 = getTeam2(team);
			for( const d of worldDimensions ){
				const flags = world.getDimension(d).getEntities({ families: [`MainBase`,`${team}flag`] });
				for( const flag of flags ){
					if( flag.getDynamicProperty(`TPBlockSlot`) != undefined
						&& ( !world.getDynamicProperty(`gvcv5:flagAttackStart`) || world.getDynamicProperty(`gvcv5:flagDefender`) != team || world.getDynamicProperty(`gvcv5:flagAttackFlag`) != flag.getDynamicProperty(`TPBlockSlot`)  )
					){
						flag.runCommand(`execute as @s run function boss/${team2}`)
					}
				}
			}
		}

	}
},20 );


world.afterEvents.playerSpawn.subscribe( e => {
	const p = e.player;
	const SOVJail = world.getDynamicProperty(`SOVJail`);
	const GERJail = world.getDynamicProperty(`GERJail`);
	const USAJail = world.getDynamicProperty(`USAJail`);
	const JAPJail = world.getDynamicProperty(`JAPJail`);
	const ENGJail = world.getDynamicProperty(`ENGJail`);

	print(`${dateScore()}`)
	if( ( p.hasTag(`downedbySOV`) || p.hasTag(`SOVSub`) ) && world.getDynamicProperty(`teamJail`) ){
		p.teleport(SOVJail);
		if(  p.hasTag(`downedbySOV`) ){
			//Kill count 
			world.scoreboard.getObjective("ALLFlags").addScore(`§cSoviet`,1*dateScore());
			
			world.scoreboard.getObjective("DeathTime").setScore(p,120000);
			p.addTag(`SOVSub`);
			p.addTag(`onDeath`);
			p.runCommand(`replaceitem entity @s slot.hotbar 0 zex:jailphone 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
			p.runCommand(`give @s rotten_flesh 4`);
		}
	}
	else if( ( p.hasTag(`downedbyGER`) || p.hasTag(`GERSub`) ) && world.getDynamicProperty(`teamJail`) ){
		p.teleport(GERJail);
		print(`killed by Nazi Germany: ${dateScore()}`);
		if(  p.hasTag(`downedbyGER`) ){
			//Kill count
			world.scoreboard.getObjective("ALLFlags").addScore(`§8Germany`,1*dateScore());
			world.scoreboard.getObjective("DeathTime").setScore(p,120000);
			p.addTag(`GERSub`);
			p.addTag(`onDeath`);
			p.runCommand(`replaceitem entity @s slot.hotbar 0 zex:jailphone 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
			p.runCommand(`give @s rotten_flesh 4`);
		}
	}
	else if( ( p.hasTag(`downedbyUSA`) || p.hasTag(`USASub`) ) && world.getDynamicProperty(`teamJail`) ){
		p.teleport(USAJail);
		if(  p.hasTag(`downedbyUSA`) ){
			//Kill count
			world.scoreboard.getObjective("ALLFlags").addScore(`§9America`,1*dateScore());

			world.scoreboard.getObjective("DeathTime").setScore(p,120000);
			p.addTag(`USASub`);
			p.addTag(`onDeath`);
			p.runCommand(`replaceitem entity @s slot.hotbar 0 zex:jailphone 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
			p.runCommand(`give @s rotten_flesh 4`);
		}
	}
	else if( ( p.hasTag(`downedbyJAP`) || p.hasTag(`JAPSub`) ) && world.getDynamicProperty(`teamJail`) ){
		p.teleport(JAPJail);
		if(  p.hasTag(`downedbyJAP`) ){
			//Kill count
			world.scoreboard.getObjective("ALLFlags").addScore(`§aJapan`,1*dateScore());
			world.scoreboard.getObjective("DeathTime").setScore(p,120000);
			p.addTag(`JAPSub`);
			p.addTag(`onDeath`);
			p.runCommand(`replaceitem entity @s slot.hotbar 0 zex:jailphone 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
			p.runCommand(`give @s rotten_flesh 4`);
		}
	}
	else if( ( p.hasTag(`downedbyENG`) || p.hasTag(`ENGSub`) ) && world.getDynamicProperty(`teamJail`) ){
		p.teleport(ENGJail);
		if(  p.hasTag(`downedbyENG`) ){
			//Kill count
			world.scoreboard.getObjective("ALLFlags").addScore(`§eBritain`,1*dateScore());
			world.scoreboard.getObjective("DeathTime").setScore(p,120000);
			p.addTag(`ENGSub`);
			p.addTag(`onDeath`);
			p.runCommand(`replaceitem entity @s slot.hotbar 0 zex:jailphone 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
			p.runCommand(`give @s rotten_flesh 4`);
		}
	}

	p.runCommand(`inputpermission set @s movement enabled`);
	p.removeTag(`downedbySOV`);
	p.removeTag(`downedbyGER`);
	p.removeTag(`downedbyUSA`);
	p.removeTag(`downedbyJAP`);
	p.removeTag(`downedbyENG`);
} )

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

world.beforeEvents.playerBreakBlock.subscribe( e => {
	const player = e.player;
	const P = e.block.location;
	if( player.hasTag(`working`) ){
		let team;
		if( player.hasTag(`SOVSub`) ){
			team = `SOV`
		}
		else if( player.hasTag(`GERSub`) ){
			team = `GER`
		}
		else if( player.hasTag(`USASub`) ){
			team = `USA`
		}
		else if( player.hasTag(`JAPSub`) ){
			team = `JAP`
		}
		else if( player.hasTag(`ENGSub`) ){
			team = `ENG`
		}

		const O = world.getDynamicProperty(`${team}Jail`);
		if( O.x - 30 < P.x && P.x < O.x + 34 && O.z - 34 < P.z && P.z < O.z + 30 && P.y < O.y - 5 ){
			//in_working
		}
		else{
			player.sendMessage(`you cant break this block`)
			e.cancel = true;
		}
	}


} )

world.afterEvents.playerInteractWithEntity.subscribe( e => {
	const entity = e.target;
	const player = e.player;
	//Main Base Flag and Leader Phone have same type family, so check if it is not main base first, then check flag or phone.
	if( !entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`MainBase`) ){ 
		// Soviet Union Flag and Soviet Leader Phone
		if( entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`SOVflag`) 
		&& (player.hasTag(`SOVLeader`) || world.getDynamicProperty(`SOVLeader`) === player.name) ){
			gvcww2teamTPBlock(player,entity,`SOV`);
		}
		// Nazi Germany Flag and German Leader Phone
		else if( entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`GERflag`)
		&& (player.hasTag(`GERLeader`) || world.getDynamicProperty(`GERLeader`) === player.name) ){
			gvcww2teamTPBlock(player,entity,`GER`);
		}
		// United States Flag and American Leader Phone
		else if( entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`USAflag`)
		&& (player.hasTag(`USALeader`) || world.getDynamicProperty(`USALeader`) === player.name) ){
			gvcww2teamTPBlock(player,entity,`USA`);
		}
		// Empire of Japan Flag and Japanese Leader Phone
		else if( entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`JAPflag`)
		&& (player.hasTag(`JAPLeader`) || world.getDynamicProperty(`JAPLeader`) === player.name) ){
			gvcww2teamTPBlock(player,entity,`JAP`);
		}
		// United Kingdom Flag and British Leader Phone
		else if( entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`ENGflag`)
		&& (player.hasTag(`ENGLeader`) || world.getDynamicProperty(`ENGLeader`) === player.name) ){
			gvcww2teamTPBlock(player,entity,`ENG`);
		}
	}
} )

world.afterEvents.entityDie.subscribe( e => {
	const entity = e.deadEntity;
	try{
		if( entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`MainBase`) ){
			e.deadEntity.runCommand(`scriptevent gvcv5:win`);
			//SOV
			if( entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`SOVflag`) && entity.getDynamicProperty(`TPBlockSlot`) != undefined ){
				const N = entity.getDynamicProperty(`TPBlockSlot`);
				world.scoreboard.getObjective("ALLFlags").addScore(`§cSoviet`,20*dateScore());
				world.setDynamicProperty(`SOV_slot${N}`,undefined);
				world.setDynamicProperty(`SOV_slot${N}_flag`,false);
				world.setDynamicProperty(`SOV_slot${N}_dimension`,undefined);
				world.sendMessage([{ text: `§c Soviet ${world.getDynamicProperty(`SOV_slot${N}_name`)}` },{ translate: `script.gvcv5.flag_destroyed.name` }]);
				world.setDynamicProperty(`SOV_slot${N}_name`,undefined);
			}
			//GER
			else if( entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`GERflag`) && entity.getDynamicProperty(`TPBlockSlot`) != undefined ){
				const N = entity.getDynamicProperty(`TPBlockSlot`);
				world.scoreboard.getObjective("ALLFlags").addScore(`§8Germany`,20*dateScore());
				world.setDynamicProperty(`GER_slot${N}`,undefined);
				world.setDynamicProperty(`GER_slot${N}_flag`,false);
				world.setDynamicProperty(`GER_slot${N}_dimension`,undefined);
				world.sendMessage([{ text: `§8 German ${world.getDynamicProperty(`GER_slot${N}_name`)}` },{ translate: `script.gvcv5.flag_destroyed.name` }]);
				world.setDynamicProperty(`GER_slot${N}_name`,undefined);
			}
			//USA
			else if( entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`USAflag`) && entity.getDynamicProperty(`TPBlockSlot`) != undefined ){
				const N = entity.getDynamicProperty(`TPBlockSlot`);
				world.scoreboard.getObjective("ALLFlags").addScore(`§9America`,20*dateScore());
				world.setDynamicProperty(`USA_slot${N}`,undefined);
				world.setDynamicProperty(`USA_slot${N}_flag`,false);
				world.setDynamicProperty(`USA_slot${N}_dimension`,undefined);
				world.sendMessage([{ text: `§9 American ${world.getDynamicProperty(`USA_slot${N}_name`)}` },{ translate: `script.gvcv5.flag_destroyed.name` }]);
				world.setDynamicProperty(`USA_slot${N}_name`,undefined);
			}
			//JAP
			else if( entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`JAPflag`) && entity.getDynamicProperty(`TPBlockSlot`) != undefined ){
				const N = entity.getDynamicProperty(`TPBlockSlot`);
				world.scoreboard.getObjective("ALLFlags").addScore(`§aJapan`,20*dateScore());
				world.setDynamicProperty(`JAP_slot${N}`,undefined);
				world.setDynamicProperty(`JAP_slot${N}_flag`,false);
				world.setDynamicProperty(`JAP_slot${N}_dimension`,undefined);
				world.sendMessage([{ text: `§a Japanese ${world.getDynamicProperty(`JAP_slot${N}_name`)}` },{ translate: `script.gvcv5.flag_destroyed.name` }]);
				world.setDynamicProperty(`JAP_slot${N}_name`,undefined);
			}
			//ENG
			else if( entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`ENGflag`) && entity.getDynamicProperty(`TPBlockSlot`) != undefined ){
				const N = entity.getDynamicProperty(`TPBlockSlot`);
				world.scoreboard.getObjective("ALLFlags").addScore(`§eBritain`,20*dateScore());
				world.setDynamicProperty(`ENG_slot${N}`,undefined);
				world.setDynamicProperty(`ENG_slot${N}_flag`,false);
				world.setDynamicProperty(`ENG_slot${N}_dimension`,undefined);
				world.sendMessage([{ text: `§e British ${world.getDynamicProperty(`ENG_slot${N}_name`)}` },{ translate: `script.gvcv5.flag_destroyed.name` }]);
				world.setDynamicProperty(`ENG_slot${N}_name`,undefined);
			}
		}
	}
	catch(error){}
})



system.afterEvents.scriptEventReceive.subscribe( async e => {
	if( e.id === "gvcv5:TeamList" ){
		let itemRawText = []
		for( const Ally of world.getPlayers({ families: [ "SOV" ] }) ){
			itemRawText.push({ text: `§c${Ally.name}§r\n` });
		}
		for( const Ally of world.getPlayers({ families: [ "GER" ] }) ){
			itemRawText.push({ text: `§8${Ally.name}§r\n` });
		}
		for( const Ally of world.getPlayers({ families: [ "USA" ] }) ){
			itemRawText.push({ text: `§9${Ally.name}§r\n` });
		}
		for( const Ally of world.getPlayers({ families: [ "JAP" ] }) ){
			itemRawText.push({ text: `§a${Ally.name}§r\n` });
		}
		for( const Ally of world.getPlayers({ families: [ "ENG" ] }) ){
			itemRawText.push({ text: `§e${Ally.name}§r\n` });
		}
		for( const Ally of world.getPlayers({ families: [ "noteam" ] }) ){
			itemRawText.push({ text: `${Ally.name}\n` });
		}
		world.sendMessage({ rawtext: itemRawText});
	}
	else if( e.id === "gvcv5:score" ){
		world.scoreboard.getObjective("ALLFlags").setScore(`§cSoviet`,0);
		world.scoreboard.getObjective("ALLFlags").setScore(`§8Germany`,0);
		world.scoreboard.getObjective("ALLFlags").setScore(`§9America`,0);
		world.scoreboard.getObjective("ALLFlags").setScore(`§aJapan`,0);
		world.scoreboard.getObjective("ALLFlags").setScore(`§eBritain`,0);
	}
	else if( e.id == "gvcv5:BattleNotice" ){
		const M = e.message;
		const attacker = world.getDynamicProperty(`gvcv5:flagAttacker`);
		const defender = world.getDynamicProperty(`gvcv5:flagDefender`);
		const dimension = world.getDynamicProperty(`gvcv5:flagDimension`);
		const attackFlag = world.getDynamicProperty(`gvcv5:flagAttackFlag`);
		world.sendMessage([{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.${defender}team2.name` },{ text: `${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlagNow.name` },{ text: M }]);
	}
	else if( e.id == "gvcv5:lose" ){
		world.scoreboard.getObjective(`ALLFlags`).setScore(`Battle`,-999);
		const attacker = world.getDynamicProperty(`gvcv5:flagAttacker`);
		const defender = world.getDynamicProperty(`gvcv5:flagDefender`);
		const dimension = world.getDynamicProperty(`gvcv5:flagDimension`);
		const attackFlag = world.getDynamicProperty(`gvcv5:flagAttackFlag`);
		world.setDynamicProperty(`gvcv5:flagAttackStart`,false);
		world.setDynamicProperty(`gvcv5:${attacker}_attackCool`,world.getAbsoluteTime());
		world.setDynamicProperty(`gvcv5:flagAttacker`,undefined);
		world.setDynamicProperty(`gvcv5:flagDefender`,undefined);
		world.setDynamicProperty(`gvcv5:flagDimension`,undefined);
		world.setDynamicProperty(`gvcv5:flagAttackFlag`,undefined);
		// const targetFlag = world.getDimension(dimension).getEntities( { type:`gvcv5:flag_${defender}_${attackFlag}` } )[0];
		// targetFlag.removeTag(`nowattack`);
		world.sendMessage([{ translate: `script.gvcv5.${defender}team.name` },{ translate: `script.gvcv5.defenced.name` },{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.defenced2.name` }]);
	}
	else if( e.id == "gvcv5:win" ){
			world.scoreboard.getObjective(`ALLFlags`).setScore(`Battle`,-999);
			const attacker = world.getDynamicProperty(`gvcv5:flagAttacker`);
			const defender = world.getDynamicProperty(`gvcv5:flagDefender`);
			world.setDynamicProperty(`gvcv5:flagAttacker`,undefined);
			world.setDynamicProperty(`gvcv5:flagDefender`,undefined);
			world.setDynamicProperty(`gvcv5:flagDimension`,undefined);
			world.setDynamicProperty(`gvcv5:flagAttackFlag`,undefined);
			world.setDynamicProperty(`gvcv5:${attacker}_attackCool`,0);
			world.setDynamicProperty(`gvcv5:flagAttackStart`,false);
			world.sendMessage([{ translate: `script.gvcv5.${attacker}team2.name` },{ translate: `script.gvcv5.defenced.name` },{ translate: `script.gvcv5.${defender}team3.name` },{ translate: `script.gvcv5.occupied.name` }]);
	}
	else if( e.id == `zex:spawnpoint` ){
		const player = e.sourceEntity;
		const location = player.getSpawnPoint();
		const O = world.getDefaultSpawnLocation();
		player.runCommand(`clear @s zex:jailphone`);
		player.removeTag(`working`);
		player.removeTag(`SOVSub`);
		player.removeTag(`GERSub`);
		player.removeTag(`USASub`);
		player.removeTag(`JAPSub`);
		player.removeTag(`ENGSub`);
		if( player.getSpawnPoint() != undefined  ){
			player.teleport({ x:location.x,y:location.y,z:location.z },{ dimension:location.dimension } );
		}
		else if ( player.hasTag(`SOV`) && world.getDynamicProperty(`teamSpawn`) != undefined ){
			player.teleport(world.getDynamicProperty(`SOVSpawn`),{ dimension:world.getDimension(`overworld`) } );
		}
		else if ( player.hasTag(`GER`) && world.getDynamicProperty(`teamSpawn`) != undefined ){
			player.teleport(world.getDynamicProperty(`GERSpawn`),{ dimension:world.getDimension(`overworld`) } );
		}
		else if ( player.hasTag(`USA`) && world.getDynamicProperty(`teamSpawn`) != undefined ){
			player.teleport(world.getDynamicProperty(`USASpawn`),{ dimension:world.getDimension(`overworld`) } );
		}
		else if ( player.hasTag(`JAP`) && world.getDynamicProperty(`teamSpawn`) != undefined ){
			player.teleport(world.getDynamicProperty(`JAPSpawn`),{ dimension:world.getDimension(`overworld`) } );
		}
		else if ( player.hasTag(`ENG`) && world.getDynamicProperty(`teamSpawn`) != undefined ){
			player.teleport(world.getDynamicProperty(`ENGSpawn`),{ dimension:world.getDimension(`overworld`) } );
		}
		else{
			player.teleport( {x:O.x,y:320,z:O.z} ,{ dimension:world.getDimension(`the_end`) } );
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
	else if( e.id === `zex:startwork` ){
		const player = e.sourceEntity;
		const P = player.location;
		player.teleport({ x:P.x - 1,y:P.y - 5,z:P.z });
		player.addTag(`working`);
		player.runCommand(`give @s iron_pickaxe`);
		player.runCommand(`give @s rotten_flesh 16`);
		player.runCommand(`give @s poisonous_potato 16`);
		player.runCommand(`give @s torch 256`);
		player.runCommand(`give @s ladder 64`);
	}
	else if( e.id === `zex:endwork` ){
		const player = e.sourceEntity;
		const P = player.location;
		let cancel = false;
		if( getInventoryItem(player,`minecraft:coal`) > 0 ){
			player.sendMessage(`Please submit your ores`);
			cancel = true;
		}
		if( getInventoryItem(player,`minecraft:raw_iron`) > 0 ){
			player.sendMessage(`Please submit your ores`);
			cancel = true;
		}
		if( getInventoryItem(player,`minecraft:raw_copper`) > 0 ){
			player.sendMessage(`Please submit your ores`);
			cancel = true;
		}
		if( getInventoryItem(player,`minecraft:raw_gold`) > 0 ){
			player.sendMessage(`Please submit your ores`);
			cancel = true;
		}
		if( getInventoryItem(player,`minecraft:lapis_lazuli`) > 0 ){
			player.sendMessage(`Please submit your ores`);
			cancel = true;
		}
		if( getInventoryItem(player,`minecraft:redstone`) > 0 ){
			player.sendMessage(`Please submit your ores`);
			cancel = true;
		}
		if( getInventoryItem(player,`minecraft:emerald`) > 0 ){
			player.sendMessage(`Please submit your ores`);
			cancel = true;
		}
		if( getInventoryItem(player,`minecraft:diamond`) > 0 ){
			player.sendMessage(`Please submit your ores`);
			cancel = true;
		}
		if( !cancel ){
			player.teleport({ x:P.x - 1,y:P.y + 6,z:P.z });
			player.removeTag(`working`);
			player.runCommand(`clear @s`);
			player.runCommand(`replaceitem entity @s slot.hotbar 0 zex:jailphone 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
		}


	}
	else if( e.id === `zex:jailwork` && e.sourceEntity.getDynamicProperty(`jailwork`) == true ){
		const player = e.sourceEntity;
		const team = e.message;
		const O = world.getDynamicProperty(`${team}Jail`);
		const P = player.location;
		if( O.x - 30 < P.x && P.x < O.x + 34 && O.z - 34 < P.z && P.z < O.z + 30  ){
			//in_working
		}
		else{
			player.setDynamicProperty(`jailwork`,false);
			let i = 10; //10 second
			while( true ){
				player.sendMessage(`Go Back Jail..${i}`);
				await system.waitTicks(20);
				let P = player.location;
				if( O.x - 30 < P.x && P.x < O.x + 34 && O.z - 34 < P.z && P.z < O.z + 30  ){
					//in_working
					player.setDynamicProperty(`jailwork`,true);
					break;
				}
				else{
					i = i - 1;
					if( i <= 0 ){
						player.removeTag(`working`);
						player.runCommand(`gamemode a @s`);
						player.teleport({ x:O.x + 12,y:O.y+1,z:O.z-28 });
						player.runCommand(`clear @s zex:jailphone`);
						player.setDynamicProperty(`jailwork`,true);
						break
					}
				}
			}
		}
	}
	else if( e.id === `zex:jailwork` && e.sourceEntity.getDynamicProperty(`jailwork`) != true ){
		//print(`${e.sourceEntity.getDynamicProperty(`jailwork`)}`);
		if( e.sourceEntity.getDynamicProperty(`jailwork`) == undefined ){
			e.sourceEntity.setDynamicProperty(`jailwork`,true);
		}
	}
	else if( e.id === `zex:execution` ){
		const user = e.sourceEntity;
		const location = user.location;
		const userFamily = e.message;
		const form = new ActionFormData();
		form.title(`script.gvcv5.execution.name`);
		const targets = world.getPlayers({tags: [`${userFamily}Sub`]});
		for( const target of targets ){
			form.button(`${target.name}`);
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
			form.button(`${target.name}`);
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
		if( world.getDynamicProperty(`${from}Leader`) == user.name ){
			gvcv5RemoveTeam(from);
		}
		else{
			gvcv5RemoveTeamList(user,from);
			user.removeTag(`${from}Leader`);
			world.sendMessage([{text: `${user.name}`},{ translate: `script.gvcv5.phone_left_${from}.name`}]);
		}
		gvcv5AddTeamList(user,to);

	}
	else if( e.id == "gvcv5:jail_phone" && !e.sourceEntity.hasTag(`down`) ){
		const user = e.sourceEntity;		
		let team;
		if( user.hasTag(`SOVSub`) ){
			team = `SOV`
		}
		else if( user.hasTag(`GERSub`) ){
			team = `GER`
		}
		else if( user.hasTag(`USASub`) ){
			team = `USA`
		}
		else if( user.hasTag(`JAPSub`) ){
			team = `JAP`
		}
		else if( user.hasTag(`ENGSub`) ){
			team = `ENG`
		}
		const O = world.getDynamicProperty(`${team}Jail`);
		const form = new ActionFormData();
		form.title(`Jail Mode`);
		form.button(`script.gvcv5.howTojail.name`,`textures/ui/phone/jail`);
		form.button(`script.gvcv5.howTojail2.name`,`textures/ui/phone/jailre`);
		form.button(`script.gvcv5.goToWork.name`,`textures/ui/phone/icon_iron_pickaxe`);
		if( team == `noteam` ){
			form.button(`script.gvcv5.select_team.name`,`textures/ui/phone/team`);
		}
		form.show(user).then( r => {
			if (!r.canceled) {
				if( r.selection == 0 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howTojail.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howTojail_desc.name` });
					itemRawText.push({ text: `\n\n` });
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:jail_phone`);
						}
					} )
				}
				else if( r.selection == 1 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howTojail2.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howTojail2_desc.name` });
					itemRawText.push({ text: `\n\n` });
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:jail_phone`);
						}
					} )
				}
				else if( r.selection == 2 && !user.hasTag(`working`) ){
					user.addTag(`working`);
					user.runCommand(`give @s iron_pickaxe`);
					user.runCommand(`give @s rotten_flesh 16`);
					user.runCommand(`give @s poisonous_potato 16`);
					user.runCommand(`give @s torch 256`);
					user.runCommand(`give @s ladder 64`);
					user.teleport({
						x:O.x+25,
						y:O.y-5,
						z:O.z
					})
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_noteam" && !e.sourceEntity.hasTag(`down`) ){
		const user = e.sourceEntity;
		const team = e.message;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const form = new ActionFormData();
		form.title(`.debug Home Menu`);
		form.button(`script.gvcv5.howToGun.name`,`textures/ui/phone/mp40`);
		form.button(`script.gvcv5.howToVechile.name`,`textures/ui/phone/t34`);
		form.button(`script.gvcv5.howToAir.name`,`textures/ui/phone/zero`);
		form.button(`script.gvcv5.phone_howToTeam.name`,`textures/ui/phone/missing_item`);
		form.button(`script.gvcv5.phone_teamList.name`,`textures/ui/phone/icon_multiplayer`);
		form.button(`script.gvcv5.phone_noteam_setting.name`,`textures/ui/phone/settings_glyph_color_2x`);
		if( team == `noteam` ){
			form.button(`script.gvcv5.select_team.name`,`textures/ui/phone/team`);
		}
		form.show(user).then( r => {
			if (!r.canceled) {
				if( r.selection == 0 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howToGun.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc0.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc1.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc2.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc3.name` });
					itemRawText.push({ text: `\n\n` });
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
						}
					} )
				}
				else if( r.selection == 1 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howToVechile.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc0.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc1.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc2.name` });
					itemRawText.push({ text: `\n\n` });
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
						}
					} )
				}
				else if( r.selection == 2 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howToAir.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howToAirDesc0.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToAirDesc1.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToAirDesc2.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToAirDesc3.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToAirDesc4.name` });
					itemRawText.push({ text: `\n\n` });
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
						}
					} )
				}
				else if( r.selection == 3 ){
					user.runCommand(`scriptevent gvcv5:phone_howToTeam ${team}`);
				}
				else if( r.selection == 4 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.phone_teamList.name`);
					let itemRawText = []
					for( const Ally of world.getPlayers({ families: [ "SOV" ] }) ){
						itemRawText.push({ text: `§c${Ally.name}§r\n` });
					}
					for( const Ally of world.getPlayers({ families: [ "GER" ] }) ){
						itemRawText.push({ text: `§8${Ally.name}§r\n` });
					}
					for( const Ally of world.getPlayers({ families: [ "USA" ] }) ){
						itemRawText.push({ text: `§9${Ally.name}§r\n` });
					}
					for( const Ally of world.getPlayers({ families: [ "JAP" ] }) ){
						itemRawText.push({ text: `§a${Ally.name}§r\n` });
					}
					for( const Ally of world.getPlayers({ families: [ "ENG" ] }) ){
						itemRawText.push({ text: `§e${Ally.name}§r\n` });
					}
					for( const Ally of world.getPlayers({ families: [ "noteam" ] }) ){
						itemRawText.push({ text: `${Ally.name}\n` });
					}
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
						}
					} )
				}
				else if( r.selection == 5 ){
					user.runCommand(`scriptevent gvcv5:phone_noteam_setting ${team}`);
				}
				else if( r.selection == 6 ){
					user.runCommand(`scriptevent gvcv5:phone_noteam_selectteam`);
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_noteam_setting" && !e.sourceEntity.hasTag(`down`) ){
		const form = new ModalFormData();
		const user = e.sourceEntity;
		form.title(`script.gvcv5.phone_noteam_setting.name`);
		form.toggle(`script.gvcv5.phone_noteam_setting_is_down.name`, {defaultValue: ( !user.hasTag(`nodownable`) )});
		form.toggle(`script.gvcv5.phone_noteam_setting_do_print_damage.name`, {defaultValue: ( !user.hasTag(`no_print`) )});
		form.toggle(`script.gvcv5.phone_noteam_setting_do_autoreload.name`, {defaultValue: ( user.hasTag(`autoReload`) )});
		form.show(e.sourceEntity).then( result => {
			if ( !result.canceled ){
				if( user.hasTag(`nodownable`) && Boolean(result.formValues[0]) == true ){
					user.removeTag(`nodownable`);
					user.sendMessage({ rawtext: [{ translate: `script.gvcv5.phone_noteam_setting_now_down.name` }]});
				}
				if( !user.hasTag(`nodownable`) && Boolean(result.formValues[0]) == false ){
					user.addTag(`nodownable`);
					user.sendMessage({ rawtext: [{ translate: `script.gvcv5.phone_noteam_setting_dont_down.name` }]});
				}
				if( user.hasTag(`no_print`) && Boolean(result.formValues[1]) == true ){
					user.removeTag(`no_print`);
					user.sendMessage({ rawtext: [{ translate: `script.gvcv5.phone_noteam_setting_now_print.name` }]});
				}
				if( !user.hasTag(`no_print`) && Boolean(result.formValues[1]) == false ){
					user.addTag(`no_print`);
					user.sendMessage({ rawtext: [{ translate: `script.gvcv5.phone_noteam_setting_dont_print.name` }]});
				}
				if( !user.hasTag(`autoReload`) && Boolean(result.formValues[2]) == true ){
					user.addTag(`autoReload`);
					user.sendMessage({ rawtext: [{ translate: `script.gvcv5.phone_noteam_setting_now_autoreload.name` }]});
				}
				if( user.hasTag(`autoReload`) && Boolean(result.formValues[2]) == false ){
					user.removeTag(`autoReload`);
					user.sendMessage({ rawtext: [{ translate: `script.gvcv5.phone_noteam_setting_dont_autoreload.name` }]});
				}
			}
		} )
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
		form.button({ rawtext: [ { translate: `script.gvcv5.become_SOV.name` },{ text : `\nleader:${world.getDynamicProperty(`SOVLeader`)}`} ]});
		form.button({ rawtext: [ { translate: `script.gvcv5.become_GER.name` },{ text : `\nleader:${world.getDynamicProperty(`GERLeader`)}`} ]});
		form.button({ rawtext: [ { translate: `script.gvcv5.become_USA.name` },{ text : `\nleader:${world.getDynamicProperty(`USALeader`)}`} ]});
		form.button({ rawtext: [ { translate: `script.gvcv5.become_JAP.name` },{ text : `\nleader:${world.getDynamicProperty(`JAPLeader`)}`} ]});
		form.button({ rawtext: [ { translate: `script.gvcv5.become_ENG.name` },{ text : `\nleader:${world.getDynamicProperty(`ENGLeader`)}`} ]});
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( r => {
			if (!r.canceled) {								
				if( r.selection == 0 ){
					gvcv5becomeTeam(user,`SOV`);
				}
				else if( r.selection == 1 ){
					gvcv5becomeTeam(user,`GER`);
				}
				else if( r.selection == 2 ){
					gvcv5becomeTeam(user,`USA`);
				}
				else if( r.selection == 3 ){
					gvcv5becomeTeam(user,`JAP`);
				}
				else if( r.selection == 4 ){
					gvcv5becomeTeam(user,`ENG`);
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
		for( let i = 0; i < 5; i++ ){
			form.button(`${phone.getDynamicProperty(`slot${i}_name`)}`);
		}
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == 5 ){
					user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
				}
				else if( phone.getDynamicProperty(`slot${result.selection}`) != undefined ){
					let location = phone.getDynamicProperty(`slot${result.selection}`);
					let dimension = world.getDimension(phone.getDynamicProperty(`slot${result.selection}_dimension`));
					tpWithDelay(user, location, dimension, 100);
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
		for( let i = 0; i < 5; i++ ){
			form.button(`${phone.getDynamicProperty(`slot${i}_name`)}`);
		}
		form.show(user).then( result => {
			if ( !result.canceled ){
				const form = new ModalFormData()
				const PreName = `${phone.getDynamicProperty(`slot${result.selection}_name`)}`
				form.title(`script.gvcv5.phone_set_tp_block_name.name`)
				form.textField(`script.gvcv5.phone_set_tp_block_name.name`,`${PreName}`, {defaultValue: `${PreName}`});
				form.show(user).then( r => {
					if (!r.canceled) {
						locateName = r.formValues[0]
						phone.setDynamicProperty(`slot${result.selection}`,user.location);
						phone.setDynamicProperty(`slot${result.selection}_dimension`,user.dimension.id);
						phone.setDynamicProperty(`slot${result.selection}_name`,locateName);
					}
				},)
			}
		},)
	}

	else if( e.id == "gvcv5:phone_tp_teamblock" && !e.sourceEntity.hasTag(`down`)  ){
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const userFamily = e.message;
		const form = new ActionFormData();
		form.title(`.debug Home Menu`);
		for( let i = 0; i < 9; i++ ){
			form.button(`${world.getDynamicProperty(`${userFamily}_slot${i}_name`)}`,`textures/ui/phone/number${i}`);
		}
		form.button(`script.gvcv5.phone_back.name`,`textures/ui/phone/crossout`);
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == 9 ){
					user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
				}
				else if( world.getDynamicProperty(`${userFamily}_slot${result.selection}`) != undefined ){
					let location = world.getDynamicProperty(`${userFamily}_slot${result.selection}`);
					let dimension = world.getDimension(world.getDynamicProperty(`${userFamily}_slot${result.selection}_dimension`));
					tpWithDelay(user, location, dimension, 100);
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_set_tp_teamblock" && !e.sourceEntity.hasTag(`down`)  ){
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const userFamily = e.message;
		
		let locateName = `unnamed`
		if( user.hasTag(`${userFamily}Leader`) || user.nameTag == world.getDynamicProperty(`${userFamily}Leader`) ){
			const form = new ActionFormData();
			let locateName = `unnamed`
			form.title(`.debug Home Menu`);	
			for( let i = 0; i < 9; i++ ){
				form.button(`${world.getDynamicProperty(`${userFamily}_slot${i}_name`)}`,`textures/ui/phone/number${i}`);
			}
			form.show(user).then( result => {
				if ( !result.canceled ){
					const form = new ModalFormData()
					const PreName = `${world.getDynamicProperty(`${userFamily}_slot${result.selection}_name`)}`
					form.title(`script.gvcv5.phone_set_tp_block_name.name`)
					form.textField(`script.gvcv5.phone_set_tp_block_name.name`,`${PreName}`, {defaultValue: `${PreName}`});
					form.show(user).then( r => {
						if (!r.canceled) {
							locateName = r.formValues[0]
							world.setDynamicProperty(`${userFamily}_slot${result.selection}`,user.location);
							world.setDynamicProperty(`${userFamily}_slot${result.selection}_flag`,true);
							world.setDynamicProperty(`${userFamily}_slot${result.selection}_dimension`,user.dimension.id);
							world.setDynamicProperty(`${userFamily}_slot${result.selection}_name`,locateName);
						}
					},)
				}
			},)
		}
		else{
			user.runCommand(`scriptevent gvcv5:phone_set_tp_block_user ${userFamily}`);
		}
	}

	else if( e.id == "gvcv5:phone_tp_block_attack" && !e.sourceEntity.hasTag(`down`)  ){
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const userFamily = e.message;
		const form = new ActionFormData();
		let attack = [];
		form.title(`script.gvcv5.phone_tp_block.name`);
		for( const Team of Teams ){
			if( Team == userFamily ){ continue; }
			else{
				for( let i = 0; i < 9; i++ ){
					if( world.getDynamicProperty(`${Team}_slot${i}`) != undefined ){
						attack.push({ team: Team, slot: i, name: world.getDynamicProperty(`${Team}_slot${i}_name`) });
						const buttonText = { 
							rawtext: [ 
								{ translate: `script.gvcv5.${Team}team3.name` }, 
								{ text: `${world.getDynamicProperty(`${Team}_slot${i}_name`)}` },
								{ text: `§r\n` }, 
								//Location and dimension info for debugging, can be removed later
								{ text: 
									`X:${Math.floor(world.getDynamicProperty(`${Team}_slot${i}`).x)},Y:${Math.floor(world.getDynamicProperty(`${Team}_slot${i}`).y)},Z:${Math.floor(world.getDynamicProperty(`${Team}_slot${i}`).z)},Dim:${world.getDimension(world.getDynamicProperty(`${Team}_slot${i}_dimension`))}` 
								},
							]
						};
						form.button(buttonText);
					}
				}
			}
		}
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == attack.length ){
					user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
				}
				else if( attack[result.selection] != undefined ){
					const attackFlag = attack[result.selection].slot;
					const attacker = userFamily;
					const defender = attack[result.selection].team;
					//const Escore = world.scoreboard.getObjective(`ALLFlags`).getScore(trueTeamName(defender));
					
					// Handle attack logic here
					if( world.getAbsoluteTime() - world.getDynamicProperty(`gvcv5:${userFamily}_attackCool`) > CoolTime && world.getDynamicProperty(`gvcv5:flagAttackFlag`) == undefined  ){
						startAttack(user, attacker, defender, attackFlag);
					}
					else if( world.getAbsoluteTime() - world.getDynamicProperty(`gvcv5:${userFamily}_attackCool`) < CoolTime ) {
						user.sendMessage(`§cYou are in cooldown! §7(${CoolTime - (world.getAbsoluteTime() - world.getDynamicProperty(`gvcv5:${userFamily}_attackCool`))} ticks left)`);
					}
					else if( world.getDynamicProperty(`gvcv5:flagAttackFlag`) != undefined ){
						user.sendMessage(`§cThere is already an attack in progress!`);
					}
					else if( world.getPlayers({ families: [ `${defender}team` ] }).length <= 1 ){
						user.sendMessage(`§cYou cannot attack a team with 1 or less members!`);
					}
					// else if( Escore > 0 && attackFlag.includes(`mainbase`) ){
					// 	user.sendMessage(`§cYou cannot attack the main base!`);
					// }
				}
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
		if( user.hasTag(`${userFamily}Leader`) ){
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
							text = `[${user.name}]:${r.formValues[0]}\n` + text;
							world.setDynamicProperty(`${userFamily}chat`,text);
							user.runCommand(`tellraw @a[hasitem={item=zex:phone_${userFamily}},rm=1] {\"rawtext\":[
								{\"translate\":\"script.gvcv5.newMessage_${userFamily}.name\"},
								{\"text\":\"[${user.name}]:${r.formValues[0]}\"}
							]}`);
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
		const userFamily = getTeam(e.message);
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		let phoneArray = [];
		if( world.scoreboard.getObjective("DeathTime").getScore(user) > 0 ){
			let itemRawText = []
			let jail = `noteam`
			if( user.hasTag(`SOVSub`) ){ jail = `SOV`; }
			else if( user.hasTag(`GERSub`) ){ jail = `GER`; }
			else if( user.hasTag(`USASub`) ){ jail = `USA`; }
			else if( user.hasTag(`JAPSub`) ){ jail = `JAP`; }
			else if( user.hasTag(`ENGSub`) ){ jail = `ENG`; }
			//release from jail
			world.scoreboard.getObjective("DeathTime").setScore(user,0);
			itemRawText.push({ translate: `script.gvcv5.newMessage_${jail}.name` });
			itemRawText.push({ translate: `script.gvcv5.phoneAbuse0.name` }); //warning
			itemRawText.push({ text: `${user.nameTag}` });
			itemRawText.push({ translate: `script.gvcv5.releasedJail0.name` }); //is released
			for( const myAlly of world.getPlayers({ families: [ jail ] }) ){
				myAlly.sendMessage({ rawtext: itemRawText });
			}
			user.sendMessage({ translate: `script.gvcv5.youreleased.name` })
		}
		const form = new ActionFormData();
		print(`${world.getDynamicProperty(`${userFamily}Leader`)}`)
		form.title(`.debug Home Menu`);
		form.button(`script.gvcv5.phone_tp.name`,`textures/ui/phone/icon_alex`);
		form.button(`script.gvcv5.phone_tp_block.name`,`textures/ui/phone/spawn_${userFamily}`);
		form.button(`script.gvcv5.phone_tp_block_team.name`,`textures/ui/phone/flag_${userFamily}`);
		form.button(`script.gvcv5.phone_teamChat.name`,`textures/ui/phone/message`);
		form.button(`script.gvcv5.phone_menber_list.name`,`textures/ui/phone/jail`);
		form.button(`script.gvcv5.phone_password.name`,`textures/ui/phone/icon_lock`);
		form.button(`script.gvcv5.phone_leave.name`,`textures/ui/phone/crossout`);
		form.button(`script.gvcv5.phone_howTo.name`,`textures/ui/phone/missing_item`);
		if( user.hasTag(`${userFamily}Leader`) ){
			form.button(`script.gvcv5.phone_attack.name`,`textures/ui/phone/attack`);
			form.button(`script.gvcv5.phone_accept_to_join.name`,`textures/ui/phone/confirm`);
			form.button(`script.gvcv5.phone_kick_member.name`,`textures/ui/phone/hammer_l`);
		}
		if( user.name == world.getDynamicProperty(`${userFamily}Leader`) ){
			form.button(`script.gvcv5.phone_transfer_leader.name`,`textures/ui/phone/permissions_op_crown`);
		}
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == 0 ){
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_tp.name`);
					for( const myAlly of world.getAllPlayers() ){
						if( myAlly.hasTag(`${userFamily}`) && world.scoreboard.getObjective("DeathTime").getScore(myAlly) <= 0 ){
							phoneArray.push( myAlly );
							form_tp.button(`${myAlly.nameTag}\nX:${Math.floor(myAlly.location.x)} Y:${Math.floor(myAlly.location.y)} Z:${Math.floor(myAlly.location.z)}`);
							continue;
						}
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection < phoneArray.length ){
								user.teleport(phoneArray[result.selection]);
								if( !user.hasTag(`${userFamily}`) ){
									user.sendMessage({ translate: `script.gvcv5.phoneAbuse.name` }); //warning
									user.runCommand(`clear @s zex:phone_${userFamily} 0 1`);
								}
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				else if( result.selection == 1 ){
					user.runCommand(`scriptevent gvcv5:phone_tp_block ${userFamily}`);
				}
				else if( result.selection == 2 ){ // teleport to Team Base
					user.runCommand(`scriptevent gvcv5:phone_tp_teamblock ${userFamily}`);
				}
				else if( result.selection == 3 ){
					user.runCommand(`scriptevent gvcv5:phone_teamChat ${userFamily}`);
				}
				else if( result.selection == 4 ){ //menber list
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_menber_list.name`);
					for( const myAlly of world.getPlayers({ tags:[ `${userFamily}Sub` ] }) ){
						phoneArray.push( myAlly );
						form_tp.button(`${myAlly.nameTag}`);
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( r => {
						if( r.selection < phoneArray.length ){
							const form_jail = new ActionFormData();
							form_jail.title(`script.gvcv5.phone_menber_list.name`);
							form_jail.button(`script.gvcv5.phone_release_menber.name`);
							form_jail.show(user).then( re => {
								if( re.selection == 0 ){ 
									world.scoreboard.getObjective("DeathTime").setScore(phoneArray[r.selection],0); 
									world.sendMessage([
										{text:`${phoneArray[r.selection].nameTag}`},
										{ translate:`script.gvcv5.released0.name` },
										{text:`${user.nameTag}`},
										{ translate:`script.gvcv5.released1.name` }
									])
									if( !user.hasTag(`${userFamily}`) ){
										user.sendMessage({ translate: `script.gvcv5.phoneAbuse.name` }); //warning
										user.runCommand(`clear @s zex:phone_${userFamily} 0 1`);
									}
								}
							} )
						}
						else{
							user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
						}
					} )
				}
				else if( result.selection == 5 ){ //change password
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
				else if( result.selection == 6 ){
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
								world.sendMessage([{text: `${user.name}`},{ translate: `script.gvcv5.phone_left_${userFamily}.name`}]);
								if( user.hasTag(`${userFamily}Leader`) ){
									gvcv5RemoveTeam(userFamily)
								}
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				else if( result.selection == 7 ){
					user.runCommand(`scriptevent gvcv5:phone_noteam ${userFamily}`);
				}
				else if( result.selection == 8 ){ // Attack Boss Flag
					user.runCommand(`scriptevent gvcv5:phone_tp_block_attack ${userFamily}`);
				}
				else if( result.selection == 9 ){
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_accept_to_join.name`);
					for( const myAlly of world.getPlayers({ tags: [ `wantToBe${userFamily}` ],families: [ `noteam` ] }) ){
						phoneArray.push( myAlly );
						form_tp.button(myAlly.name);
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
											world.sendMessage([{text: `${target.name}`},{ translate: `script.gvcv5.youAreIn${userFamily}team.name`}]);
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
				else if( result.selection == 10 ){ 
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_kick_member.name`);
					for( const myAlly of world.getPlayers({ families: [ userFamily ] }) ){
						if(!myAlly.hasTag(`${userFamily}Leader`)){
							phoneArray.push( myAlly );
							form_tp.button(myAlly.name);
						}
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection < phoneArray.length ){
								phoneArray[result.selection].triggerEvent(`gvcv5:become_noteam`);
								phoneArray[result.selection].runCommand(`clear @s zex:phone_${userFamily}`);
								phoneArray[result.selection].kill();
								world.sendMessage([{text: `${phoneArray[result.selection].name}`},{ translate: `script.gvcv5.phone_kicked_${userFamily}.name`}]);
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				else if( result.selection == 11 ){ //transfer leader
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_transfer_leader.name`);
					for( const myAlly of world.getPlayers({ families: [ userFamily ] }) ){
						if( myAlly.name != world.getDynamicProperty(`${userFamily}Leader`)){
							phoneArray.push( myAlly );
							form_tp.button(myAlly.name);
						}
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection < phoneArray.length ){
								const form_accept = new ActionFormData();
								const target = phoneArray[result.selection];
								form_accept.title(`script.gvcv5.phone_transfer_leader.name`);
								form_accept.button(`script.gvcv5.phone_set_leader.name`);
								if( target.hasTag(`${userFamily}Leader`) ){
									form_accept.button(`script.gvcv5.phone_remove_subleader.name`);
								}
								else{
									form_accept.button(`script.gvcv5.phone_set_subleader.name`);
								}
								form_accept.button(`script.gvcv5.phone_back.name`);
								form_accept.show(user).then( result => {
									if ( !result.canceled ){
										if(result.selection == 0){
											world.setDynamicProperty(`${userFamily}Leader`,`${target.name}`)
											target.sendMessage(`script.gvcv5.phone_new_leader.name`);
											target.addTag(`${userFamily}Leader`);
											user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
										}
										else if(result.selection == 1){
											if( target.hasTag(`${userFamily}Leader`) ){
												target.removeTag(`${userFamily}Leader`);
												target.sendMessage(`script.gvcv5.phone_remove_subleader_m.name`);
											}
											else{
												target.addTag(`${userFamily}Leader`);
												target.sendMessage(`script.gvcv5.phone_new_subleader.name`);
											}
											user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
										}
										else{
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
			}
		} )
	}

	else if( e.id == `gvcv5:admin` ){
		if( e.message== `team` ){
			const form = new ModalFormData();
			form.title(`Admin Settings`);
			form.textField(`SOV team Password`, `${world.getDynamicProperty(`SOVPass`)}`,{defaultValue:`${world.getDynamicProperty(`SOVPass`)}`,tooltip:`Current is ${world.getDynamicProperty(`SOVPass`)}`});
			form.textField(`GER team Password`, `${world.getDynamicProperty(`GERPass`)}`,{defaultValue:`${world.getDynamicProperty(`GERPass`)}`,tooltip:`Current is ${world.getDynamicProperty(`GERPass`)}`});
			form.textField(`USA team Password`, `${world.getDynamicProperty(`USAPass`)}`,{defaultValue:`${world.getDynamicProperty(`USAPass`)}`,tooltip:`Current is ${world.getDynamicProperty(`USAPass`)}`});
			form.textField(`JAP team Password`, `${world.getDynamicProperty(`JAPPass`)}`,{defaultValue:`${world.getDynamicProperty(`JAPPass`)}`,tooltip:`Current is ${world.getDynamicProperty(`JAPPass`)}`});
			form.textField(`ENG team Password`, `${world.getDynamicProperty(`ENGPass`)}`,{defaultValue:`${world.getDynamicProperty(`ENGPass`)}`,tooltip:`Current is ${world.getDynamicProperty(`ENGPass`)}`});
			form.toggle(`Delete SOV Team`,{defaultValue:false});
			form.toggle(`Delete GER Team`,{defaultValue:false});
			form.toggle(`Delete USA Team`,{defaultValue:false});
			form.toggle(`Delete JAP Team`,{defaultValue:false});
			form.toggle(`Delete ENG Team`,{defaultValue:false});
			form.toggle(`Team Jail`, {defaultValue: world.getDynamicProperty(`teamJail`)});
			form.show(e.sourceEntity).then( result => {
				if ( !result.canceled ){
					if( world.getDynamicProperty(`SOVPass`) != result.formValues[0] && result.formValues[0] != `undefined` ){
						world.setDynamicProperty(`SOVPass`,result.formValues[0]);
						e.sourceEntity.sendMessage(`SOV team Password is now ${result.formValues[0]}`);
					}
					if( world.getDynamicProperty(`GERPass`) != result.formValues[1] && result.formValues[1] != `undefined` ){
						world.setDynamicProperty(`GERPass`,result.formValues[1]);
						e.sourceEntity.sendMessage(`GER team Password is now ${result.formValues[1]}`);
					}
					if( world.getDynamicProperty(`USAPass`) != result.formValues[2] && result.formValues[2] != `undefined` ){
						world.setDynamicProperty(`USAPass`,result.formValues[2]);
						e.sourceEntity.sendMessage(`USA team Password is now ${result.formValues[2]}`);
					}
					if( world.getDynamicProperty(`JAPPass`) != result.formValues[3] && result.formValues[3] != `undefined` ){
						world.setDynamicProperty(`JAPPass`,result.formValues[3]);
						e.sourceEntity.sendMessage(`JAP team Password is now ${result.formValues[3]}`);
					}
					if( world.getDynamicProperty(`ENGPass`) != result.formValues[4] && result.formValues[4] != `undefined` ){
						world.setDynamicProperty(`ENGPass`,result.formValues[4]);
						e.sourceEntity.sendMessage(`ENG team Password is now ${result.formValues[4]}`);
					}
					if( result.formValues[5] ){
						gvcv5RemoveTeam("SOV")
					}
					if( result.formValues[6] ){
						gvcv5RemoveTeam("GER")
					}
					if( result.formValues[7] ){
						gvcv5RemoveTeam("USA")
					}
					if( result.formValues[8] ){
						gvcv5RemoveTeam("JAP")
					}
					if( result.formValues[9] ){
						gvcv5RemoveTeam("ENG")
					}
					if( world.getDynamicProperty(`teamJail`) != result.formValues[10] ){
						world.setDynamicProperty(`teamJail`,result.formValues[10]);
						e.sourceEntity.sendMessage(`Team Jail is now ${result.formValues[10]}`);
					}
				}
			} )
		}

	}
},)