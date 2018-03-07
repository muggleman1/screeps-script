const actions= require('actions.creeps');
const memoryActions=require('utilities.creeps');
const BodyPartSelector=require('utilities.bodyParts');

const Util=require('utilities');

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
                let hasTarget=true;
                if(creep.memory.targetId===undefined){
                    const buildings=creep.room.getBuildings();
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