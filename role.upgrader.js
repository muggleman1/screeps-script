const actions= require('CreepActions');
const memoryActions=require('CreepMemorySet');
const BodyPartSelector=require('BodyPartSelector');

const Util=require('Util');
const roomGetters=require('utilities.roomMemory');

module.exports = {
    run: function(creep) {
        const STATE_PICKING_UP=0;
        const STATE_HARVESTING=1;
        const STATE_UPGRADING=2;

        const state=creep.memory.state;
        switch(state){
            case STATE_PICKING_UP:{
                let needsTarget=false;
                if(creep.memory.targetId){
                    const structure=Game.getObjectById(creep.memory.targetId);
                    if(!structure||structure.store[RESOURCE_ENERGY]===0)
                        needsTarget=true;
                }
                if (needsTarget||creep.memory.targetId === undefined) {
                    const buildings=roomGetters.getBuildings(creep.room);
                    if (!memoryActions.setTargetStorage(creep, buildings)||
                        Game.getObjectById(creep.memory.targetId).store[RESOURCE_ENERGY]===0) { //if storage is empty
                        const containers = _.filter(buildings, (building) => building.structureType === STRUCTURE_CONTAINER);
                        let max = 0;
                        let index = -1;
                        for (let i in containers) {
                            if (containers[i].store.energy > max) {
                                max = containers[i].store.energy;
                                index = i;
                            }
                        }
                        if (index >= 0) {
                            creep.memory.targetId = containers[index].id;
                        }
                        else{
                            creep.memory.state = STATE_HARVESTING;
                            creep.memory.targetId = undefined;
                            return;
                        }
                    }
                }

                const target=Game.getObjectById(creep.memory.targetId);
                if(Util.areAdjacent(creep.pos,target.pos)){
                    creep.withdraw(target,RESOURCE_ENERGY);
                }
                else{
                    if(creep.fatigue===0) {
                        creep.moveTo(target);
                    }
                }

                if (creep.carry.energy === creep.carryCapacity) {
                    creep.memory.state = STATE_UPGRADING;
                    creep.memory.targetId = undefined;
                }
            }
                break;
            case STATE_HARVESTING:{
                if(creep.memory.sourceId===undefined) {
                    const roomCreeps=roomGetters.getMyCreeps(creep.room);
                    const sources=roomGetters.getSources(creep.room);
                    memoryActions.setSource(creep, roomCreeps, sources);
                }
                actions.gatherEnergy(creep);

                if(creep.carry.energy===creep.carryCapacity){
                    creep.memory.state=STATE_UPGRADING;
                    creep.memory.sourceId=undefined;
                }
            }
                break;
            case STATE_UPGRADING:{
                actions.upgradeController(creep);

                if(creep.carry.energy===0){
                    creep.memory.state=STATE_PICKING_UP;
                }
            }
                break;
            default:{
                creep.memory.state=STATE_PICKING_UP;
            }
                break;
        }
	},

    spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.workerParts(energy),Util.selectCreepName('upgrader'),
            {memory: {role: 'upgrader',state: 0,home: room.name}});
    }
};