const actions= require('CreepActions');
const memoryActions=require('CreepMemorySet');
const BodyPartSelector=require('BodyPartSelector');

const Util=require('Util');
const roomGetters=require('utilities.roomMemory');

module.exports = {
    run: function(creep) {
        const STATE_HARVESTING=0;
        const STATE_DEPOSITING=1;

        const state=creep.memory.state;
        switch(state){
            case STATE_HARVESTING:{
                let valid=true;
                if(creep.memory.mineId===undefined)
                    valid=memoryActions.setExtractor(creep);
                if(valid)
                    actions.gatherMinerals(creep);

                if(creep.carry.energy===creep.carryCapacity){
                    creep.memory.state=STATE_DEPOSITING;
                    creep.memory.sourceId=undefined;
                }
            }
                break;
            case STATE_DEPOSITING:{
                var hasTarget=true;
                if(creep.memory.targetId===undefined){
                    const buildings=roomGetters.getBuildings(creep.room);
                    hasTarget=memoryActions.setTargetStorage(creep,buildings);
                }
                if(hasTarget)
                    actions.refillMineralBuildings(creep);

                if(creep.carry.energy===0){
                    creep.memory.state=STATE_HARVESTING;
                    creep.memory.targetId=undefined;
                }
            }
                break;
            default:{
                creep.memory.state=STATE_HARVESTING;
            }
                break;
        }
	},

    spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.workerParts(energy),Util.selectCreepName('extractor'),
            {memory: {role: 'extractor',state: 0,home: room.name}});
    }
};