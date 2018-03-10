const BodyPartSelector=require('utilities.bodyParts');
const Util=require('utilities');

module.exports = {
    run: function(creep) {
        const STATE_PICKING_UP=0;
        const STATE_HARVESTING=1;
        const STATE_UPGRADING=2;

        const state=creep.memory.state;
        switch(state){
            case STATE_PICKING_UP:
                let ret=true;
                let id=creep.getId(CREEP_ID_PICKUP);
                let changed=false;
                if(id===undefined || Game.getObjectById(id)===null){
                    changed=true;
                    creep.setId(CREEP_ID_PICKUP,undefined);
                    ret=creep.setBuilding(CREEP_ID_PICKUP,
                        (building) => building.structureType === STRUCTURE_STORAGE
                            && building.store[RESOURCE_ENERGY] > 0,
                        (a,b)=>{return b.store[RESOURCE_ENERGY]-a.store[RESOURCE_ENERGY]});
                    if(!ret) {
                        ret = creep.setBuilding(CREEP_ID_PICKUP,
                            (building) => building.structureType === STRUCTURE_CONTAINER
                                && building.store[RESOURCE_ENERGY] > 0,
                            (a,b)=>{return b.store[RESOURCE_ENERGY]-a.store[RESOURCE_ENERGY]});
                    }
                }
                if(ret){
                    if(changed){
                        id=creep.getId(CREEP_ID_PICKUP);
                    }
                    creep.withdrawResource(CREEP_ID_PICKUP,RESOURCE_ENERGY);

                    if (creep.carry.energy === creep.carryCapacity) {
                        creep.memory.state = STATE_UPGRADING;
                        creep.setId(CREEP_ID_PICKUP,undefined);
                    }
                }
                else{
                    creep.memory.state = STATE_HARVESTING;
                    creep.setId(CREEP_ID_PICKUP,undefined);
                }
                break;
            case STATE_HARVESTING:
                let sId=creep.getId(CREEP_ID_SOURCE);
                if(sId===undefined) {
                    creep.setSource();
                }
                creep.gather();

                if(creep.carry.energy===creep.carryCapacity){
                    creep.memory.state=STATE_UPGRADING;
                    creep.setId(CREEP_ID_SOURCE,undefined);
                }
                break;
            case STATE_UPGRADING:
                let canUpgrade=true;
                if(creep.memory.controllerX===undefined || creep.memory.controllerY===undefined)
                    canUpgrade=creep.setControllerMem();
                if(canUpgrade) {
                    creep.upgrade();

                    if (creep.carry.energy === 0) {
                        creep.memory.state = STATE_PICKING_UP;
                    }
                }
                else{
                    creep.memory.state = STATE_PICKING_UP;
                }
                break;
            default:
                creep.memory.state=STATE_PICKING_UP;
                break;
        }
	},

    spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.workerParts(energy),Util.selectCreepName('upgrader'),
            {memory: {role: 'upgrader',state: 0,home: room.name}});
    }
};