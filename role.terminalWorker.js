const BodyPartSelector=require('utilities.bodyParts');

const Util=require('utilities');


//TODO: integrate into distributor?
module.exports = {
    run: function(creep){
        const STATE_PICKING_UP=0;
        const STATE_DROPPING_OFF=1;
        const state=creep.memory.state;

        switch(state){
            case STATE_PICKING_UP:
                let ret=true;
                let sId=creep.getId(CREEP_ID_PICKUP);
                let changed=false;
                if(sId===undefined || Game.getObjectById(sId)===null || creep.memory.mineralType === undefined){
                    changed=true;
                    creep.setId(CREEP_ID_PICKUP,undefined);

                    ret=creep.setBuilding(CREEP_ID_PICKUP,
                        (building) => building.structureType === STRUCTURE_STORAGE
                            && building.storeSum() > 0,
                        (a,b)=>{return b.storeSum()-a.storeSum()});
                }
                if(ret){
                    if(changed){
                        sId = creep.getId(CREEP_ID_PICKUP);
                        let terminal = Game.rooms[creep.memory.home].terminal;
                        if(terminal.store[RESOURCE_ENERGY]>5e4) {
                            let target = Game.getObjectById(sId);
                            let minTypes = target.getContainedMinerals();
                            let max = 0;
                            let bestMin = undefined;
                            for (let mineral of minTypes) {
                                if (mineral !== RESOURCE_ENERGY && target.store[mineral] > max) {
                                    max = target.store[mineral];
                                    bestMin = mineral;
                                }
                            }

                            creep.memory.mineralType = bestMin;
                        }
                        else{
                            creep.memory.mineralType = RESOURCE_ENERGY;
                        }
                        sId=creep.getId(CREEP_ID_PICKUP);
                    }
                    creep.withdrawResource(CREEP_ID_PICKUP,creep.memory.mineralType);

                    if (creep.isFull()) {
                        creep.memory.state = STATE_DROPPING_OFF;
                        creep.setId(CREEP_ID_PICKUP,undefined);
                    }
                }
                else{
                    creep.memory.state = STATE_DROPPING_OFF;
                    creep.setId(CREEP_ID_PICKUP,undefined);
                }
                break;
            case STATE_DROPPING_OFF:
                let hasTarget=true;
                let id=creep.getId(CREEP_ID_DROPOFF);
                if(id===undefined){
                    hasTarget=creep.setBuilding(CREEP_ID_DROPOFF,
                        (building)=>building.structureType===STRUCTURE_TERMINAL);
                    if(hasTarget)
                        id=creep.getId(CREEP_ID_DROPOFF);
                }

                if(hasTarget)
                    creep.refillBuildings(CREEP_ID_DROPOFF,creep.memory.mineralType);
                else{
                    creep.memory.state=STATE_PICKING_UP;
                    creep.memory.mineralType = undefined;
                    creep.setId(CREEP_ID_DROPOFF,undefined);
                }
                if(creep.carry[creep.memory.mineralType] === undefined){
                    creep.memory.state=STATE_PICKING_UP;
                    creep.memory.mineralType = undefined;
                    creep.setId(CREEP_ID_DROPOFF,undefined);
                }
                break;
            default:
                creep.memory.state=STATE_PICKING_UP;
                break;
        }
    },

    spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.carrierParts(energy),Util.selectCreepName('terminalWorker'),
            {memory: {role: 'terminalWorker',state: 0,home: room.name}});
    }
};