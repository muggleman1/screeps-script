const BodyPartSelector=require('utilities.bodyParts');

const Util=require('utilities');

module.exports = {
    run: function(creep){
        const STATE_PICKING_UP=0;
        const STATE_DISTRIBUTING=1;

        const state=creep.memory.state;
        switch(state){
            case STATE_PICKING_UP:
                let ret=true;
                let sId=creep.getId(CREEP_ID_PICKUP);
                let changed=false;
                if(sId===undefined || Game.getObjectById(sId)===null){
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
                        sId=creep.getId(CREEP_ID_PICKUP);
                    }
                    creep.withdrawResource(CREEP_ID_PICKUP,RESOURCE_ENERGY);

                    if (creep.carry.energy === creep.carryCapacity) {
                        creep.memory.state = STATE_DISTRIBUTING;
                        creep.setId(CREEP_ID_PICKUP,undefined);
                    }
                }
                else{
                    creep.memory.state = STATE_DISTRIBUTING;
                    creep.setId(CREEP_ID_PICKUP,undefined);
                }
                break;
            case STATE_DISTRIBUTING:
                let hasTarget=true;
                let id=creep.getId(CREEP_ID_DROPOFF);
                if(id===undefined){
                    hasTarget=creep.setEnergyBuilding(CREEP_ID_DROPOFF);
                    if(hasTarget)
                        id=creep.getId(CREEP_ID_DROPOFF);
                    else{
                        hasTarget=creep.setBuilding(CREEP_ID_DROPOFF,
                            (building)=>building.structureType===STRUCTURE_TERMINAL);
                        if(hasTarget)
                            id=creep.getId(CREEP_ID_DROPOFF);
                    }
                }

                if(hasTarget)
                    creep.refillBuildings(CREEP_ID_DROPOFF,RESOURCE_ENERGY);
                else{
                    creep.memory.state=STATE_PICKING_UP;
                    creep.setId(CREEP_ID_DROPOFF,undefined);
                }
                if(creep.carry.energy===0){
                    creep.memory.state=STATE_PICKING_UP;
                    creep.setId(CREEP_ID_DROPOFF,undefined);
                }
                break;
            default:
                creep.memory.state=STATE_PICKING_UP;
                break;
        }
    },

    spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.carrierParts(energy),Util.selectCreepName('distributor'),
            {memory: {role: 'distributor',state: 0,home: room.name}});
    }
};