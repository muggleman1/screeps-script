const BodyPartSelector=require('utilities.bodyParts');
const Util=require('utilities');

module.exports = {
    run: function(creep) {
        const STATE_HARVESTING=0;
        const STATE_DEPOSITING=1;

        const state=creep.memory.state;
        switch(state){
            case STATE_HARVESTING:
                let sId=creep.getId(CREEP_ID_SOURCE);
                let ret=true;
                if(sId===undefined) {
                    ret=creep.setMine(CREEP_ID_SOURCE);
                    if(ret)
                        creep.memory.mineralType=Game.getObjectById(creep.getId(CREEP_ID_SOURCE)).mineralType;
                }
                creep.gather();

                if(creep.carry.energy===creep.carryCapacity){
                    creep.memory.state=STATE_DEPOSITING;
                    //This does not reset sourceId, the mine will not change ever
                }
                break;
            case STATE_DEPOSITING:
                let hasTarget=true;
                let id=creep.getId(CREEP_ID_DROPOFF);
                if(id===undefined){
                    hasTarget=creep.setBuilding(CREEP_ID_DROPOFF,
                        (building) => building.structureType === STRUCTURE_STORAGE,
                        function(a,b) {return a.storeSum()-b.storeSum});
                    if(hasTarget)
                        id=creep.getId(CREEP_ID_DROPOFF);
                }

                if(hasTarget)
                    creep.refillBuildings(CREEP_ID_DROPOFF,creep.memory.mineralType);
                else{
                    creep.memory.state=STATE_HARVESTING;
                    creep.setId(CREEP_ID_DROPOFF,undefined);
                }
                if(creep.carry.energy===0){
                    creep.memory.state=STATE_HARVESTING;
                    creep.setId(CREEP_ID_DROPOFF,undefined);
                }
                break;
            default:
                creep.memory.state=STATE_HARVESTING;
                break;
        }
	},

    spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.workerParts(energy),Util.selectCreepName('extractor'),
            {memory: {role: 'extractor',state: 0,home: room.name}});
    }
};