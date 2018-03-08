const BodyPartSelector=require('utilities.bodyParts');
const Util=require('utilities');

module.exports = {
    run: function(creep) {
        const STATE_HARVESTING=0;
        const STATE_DISTRIBUTING=1;
        const STATE_UPGRADING=2;

        const state=creep.memory.state;
        switch(state){
            case STATE_HARVESTING:
                let sId=creep.getId(CREEP_ID_SOURCE);
                if(sId===undefined) {
                    const roomCreeps=creep.room.getMyCreeps();
                    const sources=creep.room.getSources();
                    creep.setSource(roomCreeps, sources);
                }
                creep.gather();

                if(creep.carry.energy===creep.carryCapacity){
                    creep.memory.state=STATE_DISTRIBUTING;
                    creep.setId(CREEP_ID_SOURCE,undefined);
                }
                break;
            case STATE_DISTRIBUTING:
                let hasTarget=true;
                let id=creep.getId(CREEP_ID_DROPOFF);
                if(id===undefined){
                    hasTarget=creep.setEnergyBuilding(CREEP_ID_DROPOFF);
                    if(hasTarget)
                        id=creep.getId(CREEP_ID_DROPOFF);
                }

                if(hasTarget)
                    creep.refillBuildings(CREEP_ID_DROPOFF,RESOURCE_ENERGY);
                else{
                    creep.memory.state=STATE_UPGRADING;
                    creep.setId(CREEP_ID_DROPOFF,undefined);
                }
                if(creep.carry.energy===0){
                    creep.memory.state=STATE_HARVESTING;
                    creep.setId(CREEP_ID_DROPOFF,undefined);
                }
                break;
            case STATE_UPGRADING:
                let ret=true;
                if(creep.memory.controllerX===undefined || creep.memory.controllerY===undefined)
                    ret=creep.setControllerMem();
                if(ret) {
                    creep.upgrade();

                    if (creep.carry.energy === 0) {
                        creep.memory.state = STATE_HARVESTING;
                        creep.memory.controllerX=undefined;
                        creep.memory.controllerY=undefined;
                    }
                }
                else{
                    creep.memory.state = STATE_HARVESTING;
                    creep.memory.controllerX=undefined;
                    creep.memory.controllerY=undefined;
                }
                break;
            default:
                creep.memory.state=STATE_HARVESTING;
                break;
        }
	},

	spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.workerParts(energy),Util.selectCreepName('harvester'),
            {memory: {role: 'harvester',state: 0,home: room.name}});
    }
};