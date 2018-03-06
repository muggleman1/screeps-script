const Tower=require('controller.towers');
const BodyPartSelector=require('utilities.bodyParts');
const Util=require('utilities');

const HarvestTime = require('role.harvester');
const UpgradeTime = require('role.upgrader');
const BuildTime = require('role.builder');
const RepairTime = require('role.repairMan');
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
        Tower.act(towers,buildings);

        let spawnPos=0;
        let availableSpawns=Util.chooseSpawns(room.getSpawns());
        //Respawn creeps as necessary
        if (availableSpawns.length) {
            //Periodically check if there are no creeps. If so, spawn a harvester
            if(Game.time%20===0){
                if(!roomCreeps||roomCreeps.length===0){
                    HarvestTime.spawn(availableSpawns[spawnPos], room.energyAvailable, room);
                    spawnPos++;
                }
            }
            if(Game.time%5===0 && spawnPos<availableSpawns.length){
                let enemyCreeps=room.getEnemyCreeps();
                if(enemyCreeps.length){
                    DefendTime.spawn(availableSpawns[spawnPos],room.energyCapacityAvailable,room);
                    spawnPos++;
                }
            }

            //TODO: save these in memory in controllerChange?
            let numHarvesters = 0;
            let numUpgraders = 0;
            let numBuilders = 0;
            let numMiners = 0;
            let numDeliveryBoys = 0;
            let numDistributors = 0;
            const roomEnergyAvailable=room.energyCapacityAvailable;
            const partitionedCreeps=_.groupBy(roomCreeps,(creep)=>creep.memory.role);
            
            //Set number of each creep
            if(roomEnergyAvailable<550){ //RCL 1
                numHarvesters = 2;
                numUpgraders = 1;
                numBuilders = 1;
            }
            else if (roomEnergyAvailable<800){ //RCL 2
                numHarvesters = 3;
                numUpgraders = 2;
                numBuilders = 3;
            }
            else if (roomEnergyAvailable<1300){ //RCL 3
                numHarvesters = 4;
                numUpgraders = 2;
                numBuilders = 4;
            }
            else if (roomEnergyAvailable<1800){ //RCL 4 //TODO: colony dies so fix that shit
                const sources=room.getSources();
                numMiners=sources.length;
                numDeliveryBoys=numMiners*1.5;
                numUpgraders=1;
                numBuilders=2;
                numDistributors=1; //The storage should be constructed FIRST
            }
            else if (roomEnergyAvailable<2300){ //RCL 5
                const sources=room.getSources();
                numMiners=sources.length;
                numDeliveryBoys=numMiners*1.5;
                numUpgraders=1;
                numBuilders=2;
                numDistributors=1;
            }
            else if (roomEnergyAvailable<5600){ //RCL 6
                const sources=room.getSources();
                numMiners=sources.length;
                numDeliveryBoys=numMiners*1.5;
                numUpgraders=1;
                numBuilders=2;
                numDistributors=1;
            }
            else if (roomEnergyAvailable<12900){ //RCL 7
                const sources=room.getSources();
                numMiners=sources.length;
                numDeliveryBoys=numMiners*1.5;
                numUpgraders=1;
                numBuilders=2;
                numDistributors=1;
            }
            else { //RCL 8
                const sources=room.getSources();
                numMiners=sources.length;
                numDeliveryBoys=numMiners*1.5;
                numUpgraders=1;
                numBuilders=2;
                numDistributors=1;
            }

            while(spawnPos<availableSpawns.length) {
                if (numHarvesters !== 0 && (!partitionedCreeps['harvester'] ||
                        numHarvesters > partitionedCreeps['harvester'].length)) {
                    HarvestTime.spawn(availableSpawns[spawnPos], room.energyCapacityAvailable, room);
                    spawnPos++;
                }
                else if (numMiners !== 0 && (!partitionedCreeps['miner'] ||
                        numMiners > partitionedCreeps['miner'].length)) {
                    MineTime.spawn(availableSpawns[spawnPos], room.energyCapacityAvailable, room);
                    spawnPos++;
                }
                else if (numDeliveryBoys !== 0 && (!partitionedCreeps['deliveryBoy'] ||
                        numDeliveryBoys > partitionedCreeps['deliveryBoy'].length)) {
                    DeliveryTime.spawn(availableSpawns[spawnPos], room.energyCapacityAvailable, room);
                    spawnPos++;
                }
                else if (numDistributors !== 0 && (!partitionedCreeps['distributor'] ||
                        numDistributors > partitionedCreeps['distributor'].length)) {
                    DistributeTime.spawn(availableSpawns[spawnPos], room.energyCapacityAvailable, room);
                    spawnPos++;
                }
                else if (numUpgraders !== 0 && (!partitionedCreeps['upgrader'] ||
                        numUpgraders > partitionedCreeps['upgrader'].length)) {
                    UpgradeTime.spawn(availableSpawns[spawnPos], room.energyCapacityAvailable, room);
                }
                else if (numBuilders !== 0 && (!partitionedCreeps['builder'] ||
                        numBuilders > partitionedCreeps['builder'].length)) {
                    BuildTime.spawn(availableSpawns[spawnPos], room.energyCapacityAvailable, room);
                    spawnPos++;
                }
                else { //What to do if all creeps are at optimal levels
                    if (roomEnergyAvailable < 800) {
                        BuildTime.spawn(availableSpawns[spawnPos], room.energyCapacityAvailable, room);
                        spawnPos++;
                    }
                    else
                        break;
                }
                break; //TODO: figure out while this while loop does not terminate
            }
        }
    }
};