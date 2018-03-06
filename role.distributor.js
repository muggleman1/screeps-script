const actions=require('actions.creeps');
const memoryActions=require('utilities.creeps');
const BodyPartSelector=require('utilities.bodyParts');

const Util=require('utilities');

module.exports = {
    run: function(creep){
        const STATE_PICKING_UP=0;
        const STATE_DISTRIBUTING=1;

        const state=creep.memory.state;
        switch(state){
            case STATE_PICKING_UP:{
                let valid=true;
                if (creep.memory.storageId === undefined) {
                    const buildings=creep.room.getBuildings();
                    const storages = _.filter(buildings,(building) => building.structureType===STRUCTURE_STORAGE);
                    if(storages.length&&storages[0].store[RESOURCE_ENERGY]>0){
                        creep.memory.storageId=storages[0].id;
                        return true;
                    }
                    else { //Use containers as a backup
                        const containers = _.filter(buildings, (building) => building.structureType === STRUCTURE_CONTAINER);
                        if (containers.length) {
                            let index = -1;
                            let max = -1;
                            for (var i in containers) {
                                if (containers[i].store[RESOURCE_ENERGY] > max) {
                                    max = containers[i].store[RESOURCE_ENERGY];
                                    index = i;
                                }
                            }
                            creep.memory.storageId = containers[index].id;
                            valid = true;
                        }
                        else
                            valid = false;
                    }
                }
                if(valid){
                    const target=Game.getObjectById(creep.memory.storageId);
                    if(Util.areAdjacent(creep.pos,target.pos)){
                        creep.withdraw(Game.getObjectById(creep.memory.storageId),RESOURCE_ENERGY);
                    }
                    else{
                        if(creep.fatigue===0) {
                            creep.moveTo(target);
                        }
                    }
                }

                if(creep.carry.energy===creep.carryCapacity){
                    creep.memory.state=STATE_DISTRIBUTING;
                    creep.memory.storageId=undefined;
                }
            }
                break;
            case STATE_DISTRIBUTING:{
                var hasTarget=true;
                if(creep.memory.targetId===undefined) {
                    const buildings=creep.room.getBuildings();
                    hasTarget=memoryActions.setTargetEnergyBuilding(creep,buildings);
                }

                if(hasTarget)
                    actions.refillEnergyBuildings(creep);

                if(creep.carry.energy===0){
                    creep.memory.state=STATE_PICKING_UP;
                    creep.memory.targetId=undefined;
                }
            }
                break;
            default:{
                creep.memory.state=STATE_PICKING_UP;
            }
                break;
        }
    },

    spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.carrierParts(energy),Util.selectCreepName('distributor'),
            {memory: {role: 'distributor',state: 0,home: room.name}});
    }
};