const BaseFlag=require('controller.base');

const HarvestTime = require('role.harvester');
const UpgradeTime = require('role.upgrader');
const BuildTime = require('role.builder');
const RepairTime = require('role.repairMan');
const MineTime = require('role.miner');
const DeliveryTime = require('role.deliveryBoy');
const DistributeTime = require('role.distributor');
const ExtractTime = require('role.extractor');
const DefendTime = require('role.defender');

const roomGetters = require('utilities.roomMemory');

console.log('Script Reloaded');

module.exports.loop = function() {
    //run all creep AI
    for(let name in Memory.creeps){
        //Delete memory for creeps that no longer exist
        const creep=Game.creeps[name];
        if(!creep) {
            delete Memory.creeps[name];
            continue;
        }

        //TODO: updated move function
        //TODO: move this back into the rooms? we partition anyway
        //Activate creep scripts as corresponding to their role
        switch(creep.memory.role){
            case 'miner':
                MineTime.run(creep);
                break;
            case 'deliveryBoy':
                DeliveryTime.run(creep);
                break;
            case 'distributor':
                DistributeTime.run(creep);
                break;
            case 'harvester':
                HarvestTime.run(creep);
                break;
            case 'upgrader':
                UpgradeTime.run(creep);
                break;
            case 'builder':
                BuildTime.run(creep);
                break;
            case 'extractor':
                ExtractTime.run(creep);
                break;
            case 'defender':
                DefendTime.run(creep);
                break;
            case 'repairMan':
                RepairTime.run(creep); //TODO: fix
                break;
            //TODO: other creeps that attack
        }
    }

    const groupedCreeps=_.groupBy(Game.creeps,(creep)=>creep.memory.home);

    let isWorking=false;
    //Flag controllers
    for(let roomName in Memory.rooms){
        const room=Game.rooms[roomName];
        //Remove if there is errors that cause the room to not finish execution
        //roomGetters.resetTempMemory(room);
        if(room) {
            isWorking=true;
            if (room.memory.level > 0) {
                BaseFlag.run(room,groupedCreeps[room.name]);
            }
            else if (room.memory.level === 0) {
                //TODO: use for energy farming rooms
            }
            else if (room.memory.level === -1) {
                //TODO: other rooms which creeps may venture into (ex. enemy bases or portal rooms?)
            }
            else{
                if(room.controller) {
                    if (room.controller.my) {
                        room.memory.level = room.controller.level;
                    }
                    else {
                        room.memory.level = -1;
                    }
                }
                //TODO: define behavior for rooms with no controller (remove unnecessary rooms?)
            }

            roomGetters.resetTempMemory(room);
        }
    }
    if(!isWorking){//Should only be necessary at the very beginning of the script running
        const spawn=Game.spawns.Spawn1;
        spawn.room.memory.level=spawn.room.controller.level;
    }
};