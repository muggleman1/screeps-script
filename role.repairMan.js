//runs at  controller level
//repairmen use [WORK,WORK,CARRY,MOVE,MOVE],{role:'repairman',destinId:0,target:0,building:false}
module.exports = {
    run: function(creep) {
        //TODO: make this code actually good
        /*
        if(!creep.memory.building){
            var storages=_.filter(creep.room.find(FIND_STRUCTURES), (structure1) => structure1.structureType===STRUCTURE_CONTAINER||structure1.structureType===STRUCTURE_STORAGE);
            var place=-1; //need to use as reference to go to sources if there are no suitable storages
            if(storages.length>0){
                var max=creep.carryCapacity;
                for(var i in storages){
                    if(storages[i].store.energy>=max){
                        max=storages[i].store.energy;
                        place=i;
                    }
                }
                if(place!==-1){
                    if(creep.withdraw(storages[place],RESOURCE_ENERGY,creep.carryCapacity)===ERR_NOT_IN_RANGE){
                        creep.moveTo(storages[place]);
                    }
                    else
                        creep.memory.building=true;
                }
            }
            if(storages.length===0||place===-1){
                if(creep.harvest(sources[creep.memory.target])===ERR_NOT_IN_RANGE){
                    creep.moveTo(sources[creep.memory.target]);
                }
                if(creep.carry.energy===creep.carryCapacity){
                    creep.memory.building=true;
                    creep.memory.target=0;
                }
            }
        }
        else{
            if(creep.memory.destinId===0){
                creep.memory.target=-1;
                var buildings = creep.room.find(FIND_STRUCTURES);
                var damaged = _.filter(buildings, (thing) => thing.hits<thing.hitsMax);
                if(damaged.length>0){
                    var dying=_.filter(damaged, (thing) => ((thing.hits<thing.hitsMax/4)&&thing.structureType!==STRUCTURE_WALL&&thing.structureType!==STRUCTURE_RAMPART)||(thing.hits<5000&&(thing.structureType==STRUCTURE_WALL||thing.structureType==STRUCTURE_RAMPART)));
                    if(dying.length>0){
                        creep.memory.destinId=dying[0].id;
                    }
                    else{
                        var hVal = _.filter(damaged, (structure1) => (structure1.structureType===STRUCTURE_SPAWN||structure1.structureType===STRUCTURE_EXTENSION));
                        if(hVal.length>0){
                            creep.memory.destinId=hVal[0].id;
                        }
                        else{
                            var mVal=_.filter(damaged, (structure1) => (structure1.structureType===STRUCTURE_CONTAINER||structure1.structureType===STRUCTURE_STORAGE)&&structure1.hitsMax/4*3>structure1.hits);
                            if(mVal.length>0){
                                creep.memory.destinId=mVal[0].id;
                            }
                            else{
                                var lVal=_.filter(damaged, (structure1) => structure1.structureType===STRUCTURE_ROAD&&structure1.hitsMax/4*3>structure1.hits);
                                if(lVal.length>0){
                                    creep.memory.destinId=lVal[0].id;
                                }
                                else{
                                    var min=1;
                                    var index=-1;
                                    for(var i in damaged){
                                        var thing =damaged[i].hits/damaged[i].hitsMax
                                        if(thing<min){
                                            min=thing;
                                            index=i;
                                        }
                                    }
                                    creep.memory.destinId=damaged[index].id;
                                }
                            }
                        }
                    }
                }
                else{ //builds construction sites when not repairing. if neither it will wait
                    var sites=creep.room.find(FIND_CONSTRUCTION_SITES);
                    if(sites.length>0){
                        if(creep.build(sites[0])===ERR_NOT_IN_RANGE)
                            creep.moveTo(sites[0]);
                    }
                }
            }
            if(creep.memory.destinId!==0){ //only runs when it has a destination (not building construction sites)
                var destin=Game.getObjectById(creep.memory.destinId);
                if(destin.hits===destin.hitsMax){
                    creep.memory.destinId=0;
                }
                else if(creep.repair(destin)===ERR_NOT_IN_RANGE){
                    creep.moveTo(destin);
                }    
                if(creep.carry.energy===0){
                    if(destin.structureType===STRUCTURE_RAMPART||destin.structureType===STRUCTURE_WALL)
                        creep.memory.destinId=0;
                    creep.memory.building=false;
                    //TODO: updated choosesource
                    ChooseSource.find(creep);
                }
            }
        }
        */
    }
};