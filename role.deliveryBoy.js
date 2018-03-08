const BodyPartSelector=require('utilities.bodyParts');

const Util=require('utilities');

module.exports = {
    run: function(creep){
        const STATE_PICKING_UP=0;
        const STATE_EMPTYING_BINS=1;
        const STATE_DISTRIBUTING=2;

        const state=creep.memory.state;
        switch(state){
            case STATE_PICKING_UP:
                let ret=true;
                let id=creep.getId(CREEP_ID_PICKUP);
                changed=false;
                if(id===undefined||Game.getObjectById(id)===null) {
                    changed=true;
                    ret=creep.setDropped(CREEP_ID_PICKUP,RESOURCE_ENERGY);
                }
                if(ret){
                    if(changed)
                        id=creep.getId(CREEP_ID_PICKUP);
                    creep.pickupResource(CREEP_ID_PICKUP);
                }
                else {
                    creep.memory.state=STATE_EMPTYING_BINS;
                    creep.setId(CREEP_ID_PICKUP,undefined);
                }

                if(creep.carry.energy===creep.carryCapacity){
                    creep.memory.state=STATE_DISTRIBUTING;
                    creep.setId(CREEP_ID_PICKUP,undefined);
                }
                break;
            case STATE_EMPTYING_BINS:
                let cRet=true;
                let cId=creep.getId(CREEP_ID_PICKUP);
                let changed=false;
                if(cId===undefined || Game.getObjectById(cId)===null){
                    changed=true;
                    cRet = creep.setBuilding(CREEP_ID_PICKUP,
                        (building) => building.structureType === STRUCTURE_CONTAINER
                            && building.store[RESOURCE_ENERGY] > 0,
                        function(a,b) {return b.energy - a.energy});
                }
                if(cRet){
                    if(changed){
                        cId=creep.getId(CREEP_ID_PICKUP);
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
                let canDistribute=true;
                let dId=creep.getId(CREEP_ID_DROPOFF);
                let isChanged=false;
                if(dId===undefined || Game.getObjectById(dId)===null){
                    isChanged=true;
                    canDistribute = creep.setBuilding(CREEP_ID_DROPOFF,
                        (building) => building.structureType === STRUCTURE_STORAGE);
                }
                if(canDistribute){
                    if(isChanged){
                        dId=creep.getId(CREEP_ID_DROPOFF);
                    }
                    creep.refillBuildings(CREEP_ID_DROPOFF,RESOURCE_ENERGY);

                    if (creep.carry.energy === 0) {
                        creep.memory.state = STATE_PICKING_UP;
                        creep.setId(CREEP_ID_DROPOFF,undefined);
                    }
                }
                else{
                    creep.memory.state = STATE_PICKING_UP;
                    creep.setId(CREEP_ID_DROPOFF,undefined);
                }
                break;
            default:
                creep.memory.state=STATE_PICKING_UP;
                break;
        }
    },

    spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.carrierParts(energy),Util.selectCreepName('deliveryBoy'),
            {memory: {role: 'deliveryBoy',state: 0,home: room.name}});
    }
};