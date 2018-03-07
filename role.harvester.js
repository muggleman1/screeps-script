const actions= require('actions.creeps');
const memoryActions=require('utilities.creeps');
const BodyPartSelector=require('utilities.bodyParts');

const Util=require('utilities');

module.exports = {
    run: function(creep) {
        const STATE_HARVESTING=0;
        const STATE_DISTRIBUTING=1;

        const state=creep.memory.state;
        switch(state){
            case STATE_HARVESTING:{
                if(creep.memory.sourceId===undefined) {
                    const roomCreeps=creep.room.getMyCreeps();
                    const sources=creep.room.getSources();
                    memoryActions.setSource(creep, roomCreeps, sources);
                }
                actions.gatherEnergy(creep);

                if(creep.carry.energy===creep.carryCapacity){
                    creep.memory.state=STATE_DISTRIBUTING;
                    creep.memory.sourceId=undefined;
                }
            }
                break;
            case STATE_DISTRIBUTING:{
                let hasTarget=true;
                if(creep.memory.targetId===undefined){
                    const buildings=creep.room.getBuildings();
                    hasTarget=memoryActions.setTargetEnergyBuilding(creep,buildings);
                }
                if(creep.memory.targetId==="controller")
                    hasTarget=false;

                if(hasTarget)
                    actions.refillEnergyBuildings(creep);
                else{
                    creep.memory.targetId="controller";
                    actions.upgradeController(creep);
                }
                if(creep.carry.energy===0){
                    creep.memory.state=STATE_HARVESTING;
                    creep.memory.targetId=undefined;
                    creep.memory.x=undefined;
                    creep.memory.y=undefined;
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
        spawn.spawnCreep(BodyPartSelector.workerParts(energy),Util.selectCreepName('harvester'),
            {memory: {role: 'harvester',state: 0,home: room.name}});
    }
};