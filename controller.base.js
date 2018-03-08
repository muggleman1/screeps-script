const Tower=require('controller.towers');
const Util=require('utilities');

const HarvestTime = require('role.harvester');
const UpgradeTime = require('role.upgrader');
const BuildTime = require('role.builder');
const MineTime = require('role.miner');
const DeliveryTime = require('role.deliveryBoy');
const DistributeTime = require('role.distributor');
const ExtractTime = require('role.extractor');
const DefendTime = require('role.defender');

//TODO: add containers next to sources!
module.exports = {
    run: function(room,roomCreeps){
        //Will be used for placing buildings if necessary
        if(!room.memory.centerX||!room.memory.centerY){
            room.findCenter();
        }

        const controllerLevel=room.controller.level;
        if(controllerLevel>room.memory.level){
            room.controllerChange();
        }

        room.setMyCreeps(roomCreeps);
        //Room functions that will happen consistently every tick
        const buildings=room.getBuildings();
        //TODO: better distributor respawning (just convert deliveryBoy?)

        const towers=_.filter(buildings,(structure)=>(structure.structureType===STRUCTURE_TOWER));
        Tower.act(towers);

        let spawnPos=0;
        let availableSpawns=Util.chooseSpawns(room.getSpawns());
        //Respawn creeps as necessary
        if (availableSpawns.length) {
            //Periodically check if there are no creeps. If so, spawn a harvester
            if(Game.time%25===0){
                if(!roomCreeps||roomCreeps.length===0){
                    HarvestTime.spawn(availableSpawns[spawnPos], room.energyAvailable, room);
                    spawnPos++;
                    //TODO: maybe spawn a distributor if there is a lot of stuff in storage?
                }
            }
            if(Game.time%10===0 && spawnPos<availableSpawns.length){
                let enemyCreeps=room.getEnemyCreeps();
                if(enemyCreeps.length) {
                    let canDamage = false;
                    for(let creep of enemyCreeps) {
                        const body = creep.body;
                        for(let part of body) {
                            if (part === WORK || part === ATTACK || part === RANGED_ATTACK || part === CLAIM) {
                                canDamage = true;
                                break;
                            }
                        }
                        if(canDamage)
                            break;
                    }
                    if(canDamage) {
                        DefendTime.spawn(availableSpawns[spawnPos], room.energyCapacityAvailable, room);
                        spawnPos++;
                    }
                }
            }

            const roomEnergyAvailable=room.energyCapacityAvailable;
            const partitionedCreeps=_.groupBy(roomCreeps,(creep)=>creep.memory.role);

            let roles={harvester:0,upgrader:0,builder:0,miner:0,deliveryBoy:0,distributor:0,extractor:0};
            let rolesNeeded={harvester:0,upgrader:0,builder:0,miner:0,deliveryBoy:0,distributor:0,extractor:0};
            if(roomEnergyAvailable<550){ //RCL 1
                roles.harvester = 2;
                roles.upgrader = 1;
                roles.builder = 1;
            }
            else if (roomEnergyAvailable<800){ //RCL 2
                roles.harvester = 3;
                roles.upgrader = 2;
                roles.builder = 3;
            }
            else if (roomEnergyAvailable<1300){ //RCL 3
                roles.harvester = 4;
                roles.upgrader = 2;
                roles.builder = 4;
            }
            else if (roomEnergyAvailable<1800){ //RCL 4 //TODO: colony dies so fix that shit
                const sources=room.getSources();
                roles.miner = sources.length;
                roles.deliveryBoy = sources.length*1.5;
                roles.upgrader = 1;
                roles.builder = 2;
                roles.distributor = 1;
            }
            else if (roomEnergyAvailable<2300){ //RCL 5
                const sources=room.getSources();
                roles.miner = sources.length;
                roles.deliveryBoy = sources.length*1.5;
                roles.upgrader = 1;
                roles.builder = 2;
                roles.distributor = 1;
            }
            else if (roomEnergyAvailable<5600){ //RCL 6
                const sources=room.getSources();
                roles.miner = sources.length;
                roles.deliveryBoy = sources.length*1.5;
                roles.upgrader = 1;
                roles.builder = 2;
                roles.distributor = 1;
                roles.extractor = 1;
            }
            else if (roomEnergyAvailable<12900){ //RCL 7
                const sources=room.getSources();
                roles.miner = sources.length;
                roles.deliveryBoy = sources.length*1.5;
                roles.upgrader = 1;
                roles.builder = 2;
                roles.distributor = 1;
                roles.extractor = 1;
            }
            else { //RCL 8
                const sources=room.getSources();
                roles.miner = sources.length;
                roles.deliveryBoy = sources.length*1.5;
                roles.upgrader = 1;
                roles.builder = 2;
                roles.distributor = 1;
                roles.extractor = 1;
            }

            //Set rolesNeeded
            if(!partitionedCreeps['harvester']) {rolesNeeded.harvester=roles.harvester;}
            else {rolesNeeded.harvester=Math.max(0,roles.harvester-partitionedCreeps['harvester'].length); }

            if(!partitionedCreeps['upgrader']) {rolesNeeded.upgrader=roles.upgrader;}
            else {rolesNeeded.upgrader=Math.max(0,roles.upgrader-partitionedCreeps['upgrader'].length);}

            if(!partitionedCreeps['builder']) {rolesNeeded.builder=roles.builder;}
            else {rolesNeeded.builder=Math.max(0,roles.builder-partitionedCreeps['builder'].length);}

            if(!partitionedCreeps['miner']) {rolesNeeded.miner=roles.miner;}
            else {rolesNeeded.miner=Math.max(0,roles.miner-partitionedCreeps['miner'].length);}

            if(!partitionedCreeps['deliveryBoy']) {rolesNeeded.deliveryBoy=roles.deliveryBoy;}
            else {rolesNeeded.deliveryBoy=Math.max(0,roles.deliveryBoy-partitionedCreeps['deliveryBoy'].length);}

            if(!partitionedCreeps['distributor']) {rolesNeeded.distributor=roles.distributor;}
            else {rolesNeeded.distributor=Math.max(0,roles.distributor-partitionedCreeps['distributor'].length);}

            if(!partitionedCreeps['extractor']) {rolesNeeded.extractor=roles.extractor;}
            else {rolesNeeded.extractor=Math.max(0,roles.extractor-partitionedCreeps['extractor'].length);}

            //Spawn based on needed creeps
            for(let i=spawnPos;i<availableSpawns.length;i++){
                if(rolesNeeded.harvester>0){
                    HarvestTime.spawn(availableSpawns[i], room.energyCapacityAvailable, room);
                    rolesNeeded.harvester--;
                }
                else if(rolesNeeded.upgrader>0){
                    UpgradeTime.spawn(availableSpawns[i], room.energyCapacityAvailable, room);
                    rolesNeeded.upgrader--;
                }
                else if(rolesNeeded.builder>0){
                    BuildTime.spawn(availableSpawns[i], room.energyCapacityAvailable, room);
                    rolesNeeded.builder--;
                }
                else if(rolesNeeded.miner>0){
                    MineTime.spawn(availableSpawns[i], room.energyCapacityAvailable, room);
                    rolesNeeded.miner--;
                }
                else if(rolesNeeded.deliveryBoy>0){
                    DeliveryTime.spawn(availableSpawns[i], room.energyCapacityAvailable, room);
                    rolesNeeded.deliveryBoy--;
                }
                else if(rolesNeeded.distributor>0){
                    DistributeTime.spawn(availableSpawns[i], room.energyCapacityAvailable, room);
                    rolesNeeded.distributor--;
                }
                else if(rolesNeeded.extractor>0){
                    ExtractTime.spawn(availableSpawns[i], room.energyCapacityAvailable, room);
                    rolesNeeded.extractor--;
                }
                else{
                    if (roomEnergyAvailable < 800) {
                        BuildTime.spawn(availableSpawns[spawnPos], room.energyCapacityAvailable, room);
                    }
                    else
                        break;
                }
            }
        }
    }
};