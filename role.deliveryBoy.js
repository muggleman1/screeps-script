const actions=require('actions.creeps');
const memoryActions=require('utilities.creeps');
const BodyPartSelector=require('utilities.bodyParts');

const Util=require('utilities');
const roomGetters=require('utilities.roomMemory');

module.exports = { //TODO: look for resource on the ground
    run: function(creep){
        const STATE_PICKING_UP=0;
        const STATE_EMPTYING_BINS=1;
        const STATE_DISTRIBUTING=2;

        const state=creep.memory.state;
        switch(state){
            case STATE_PICKING_UP: { //TODO: this is horrible
                if(creep.memory.resourceId===undefined||Game.getObjectById(creep.memory.resourceId)===null) {
                    const targets = creep.room.find(FIND_DROPPED_RESOURCES);
                    if (targets.length) {
                        targets.filter((value)=>value>20);
                        targets.sort(function(a,b){
                           return a.amount-b.amount;
                        });
                        creep.memory.resourceId = targets[0].id;
                    }
                    else{
                        creep.memory.state=STATE_EMPTYING_BINS;
                        creep.memory.resourceId=0;
                        return;
                    }
                }
                const resource=Game.getObjectById(creep.memory.resourceId);
                if(Util.areAdjacent(creep.pos,resource.pos)){
                    creep.pickup(resource);
                    creep.memory.state=STATE_EMPTYING_BINS;
                    creep.memory.resourceId=0;
                }
                else{
                    if(creep.fatigue===0) {
                        creep.moveTo(resource);
                    }
                }
                if(creep.carry.energy===creep.carryCapacity){
                    creep.memory.state=STATE_DISTRIBUTING;
                    creep.memory.resourceId=0;
                }
            }
                break;
            case STATE_EMPTYING_BINS:{
                let valid=true;
                if(creep.memory.containerId){
                    const container=Game.getObjectById(creep.memory.containerId);
                    if(!container||Util.storeSum(container)===0)
                        valid=false;
                }
                if (!valid||creep.memory.containerId === undefined) {
                    const buildings=roomGetters.getBuildings(creep.room);

                    const containers=_.filter(buildings,(building)=>building.structureType===STRUCTURE_CONTAINER);
                    var max=0;
                    var index=-1;
                    for(var i=0;i<containers.length;i++){
                        if(containers[i].store.energy>max){
                            max=containers[i].store.energy;
                            index=i;
                        }
                    }
                    if(index>=0){
                        creep.memory.containerId=containers[index].id;
                    }
                }
                if(creep.memory.containerId!==undefined){
                    const target=Game.getObjectById(creep.memory.containerId);
                    if(Util.areAdjacent(creep.pos,target.pos)){
                        creep.withdraw(Game.getObjectById(creep.memory.containerId),RESOURCE_ENERGY);
                    }
                    else{
                        if(creep.fatigue===0) {
                            creep.moveTo(target);
                        }
                    }
                }

                if(creep.carry.energy===creep.carryCapacity){
                    creep.memory.state=STATE_DISTRIBUTING;
                    creep.memory.containerId=undefined;
                }
            }
                break;
            case STATE_DISTRIBUTING:{
                var hasTarget=true;
                if(creep.memory.targetId===undefined) {
                    const buildings=roomGetters.getBuildings(creep.room);
                    const valid=memoryActions.setTargetStorage(creep,buildings);
                    if(!valid) {
                        hasTarget=memoryActions.setTargetEnergyBuilding(creep, buildings);
                    }
                }
                if(hasTarget){
                    actions.refillEnergyBuildings(creep);
                }

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
        spawn.spawnCreep(BodyPartSelector.carrierParts(energy),Util.selectCreepName('deliveryBoy'),
            {memory: {role: 'deliveryBoy',state: 0,home: room.name}});
    }
};