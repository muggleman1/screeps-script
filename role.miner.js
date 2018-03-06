const actions=require('actions.creeps');
const memoryActions=require('utilities.creeps');
const BodyPartSelector=require('utilities.bodyParts');

const Util=require('utilities');

module.exports = {
    run: function(creep){
        const STATE_PATHING=0;
        const STATE_HARVESTING=1;

        const state=creep.memory.state;
        switch(state){
            case STATE_PATHING:{
                var valid=true;
                if(creep.memory.sourceId===undefined){
                    const roomCreeps=creep.room.getMyCreeps();
                    const sources=creep.room.getSources();
                    valid=memoryActions.setSource(creep,roomCreeps,sources,'miner');
                }
                if(valid) {
                    actions.gatherEnergy(creep);

                    const target=creep.memory.sourceId;
                    if(Game.getObjectById(target)===null){
                        creep.memory.sourceId=undefined;
                    }
                    else if (Util.areAdjacent(creep.pos, Game.getObjectById(target).pos)) {
                        creep.memory.state = STATE_HARVESTING;
                    }
                }
            }
                break;
            case STATE_HARVESTING:{
                const canGather=actions.gatherEnergy(creep);
                if(!canGather){
                    creep.memory.state=STATE_PATHING;
                }

                if(creep.carry.energy>creep.carryCapacity*.9){
                    let valid=true;
                    if(creep.memory.containerId){
                        const container=Game.getObjectById(creep.memory.containerId);
                        if(!container||container.storeSum()===container.storeCapacity)
                            valid=false;
                    }
                    if(!valid||creep.memory.containerId===undefined) {
                        const buildings=creep.room.getBuildings();
                        const containers = _.filter(buildings, (building) => building.structureType === STRUCTURE_CONTAINER);
                        const sourcePos = Game.getObjectById(creep.memory.sourceId).pos;
                        for(var i=0;i<containers.length;i++) {
                            if (Util.areAdjacent(containers[i].pos,sourcePos)) {
                                creep.memory.containerId=containers[i].id;
                                break;
                            }
                        }
                    }
                    if(creep.memory.containerId!==undefined) {
                        const target=Game.getObjectById(creep.memory.containerId);
                        if(Util.areAdjacent(creep.pos,target.pos)){
                            creep.transfer(Game.getObjectById(creep.memory.containerId), RESOURCE_ENERGY);
                        }
                        else{
                            if(creep.fatigue===0) {
                                creep.moveTo(target);
                            }
                        }
                    }
                }
            }
                break;
            default:{
                creep.memory.state=STATE_PATHING;
            }
                break;
        }
    },

    spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.minerParts(energy),Util.selectCreepName('miner'),
            {memory: {role: 'miner',state: 0,home: room.name}});
    }
};