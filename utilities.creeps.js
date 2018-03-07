module.exports = {
    /**
     * Summary. Sets the targetId of the creep to the StructureStorage in the room if possible
     *
     * @param {Creep} creep Acts on this creep object
     * @param {Structure[]} buildings All buildings in the creep's room
     * @returns {boolean} Whether there are valid storages in the room
     */
    setTargetStorage: function(creep,buildings){
        const storages=_.filter(buildings, (building) => building.structureType === STRUCTURE_STORAGE
            && building.storeSum()<building.storeCapacity);
        if (storages.length){
            creep.memory.targetId=storages[0].id;
            return true;
        }
        else
            return false;
    },

    /**
     * Summary. Sets the targetId of the creep to an energy-holding Structure in the room, prioritizing
     *          StructureSpawn and StructureExtension objects, otherwise using StructureTowers
     *
     * @param {Creep} creep Acts on this creep object
     * @param {Structure[]} buildings All buildings in the creep's room
     * @returns {boolean} Whether there are valid energy buildings in the room
     */
    setTargetEnergyBuilding: function(creep,buildings){
        let targets = _.filter(buildings,(structure) => (structure.structureType===STRUCTURE_EXTENSION
            ||structure.structureType === STRUCTURE_SPAWN)&&structure.energy < structure.energyCapacity);
        if(targets.length){
            targets.sort(function(a,b){
                return a.energy-b.energy;
            });
            creep.memory.targetId=targets[0].id;
            return true;
        }
        else{
            targets=_.filter(buildings,(structure) => structure.structureType===STRUCTURE_TOWER
                && structure.energy < structure.energyCapacity*.9);
            if(targets.length) {
                targets.sort(function(a,b){
                    return a.energy-b.energy;
                });
                creep.memory.targetId=targets[0].id;
                return true;
            }
            else
                return false;
        }
    },

    /**
     * Summary. Sets the targetId of the creep to a ConstructionSite in the room if possible, prioritizing ones
     *          created first
     *
     * @param {Creep} creep Acts on this creep object
     * @returns {boolean} Whether there are valid energy ConstructionSite objects in the room
     */
    setTargetConstructionSite: function(creep){
        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length) {
            creep.memory.targetId = targets[0].id;
            return true;
        }
        else
            return false;
    },

    /**
     * Summary. Sets the sourceId of the creep to the id of a source in  sources that has the fewest Creeps
     *          in roomCreeps that has sourceId set to that source. If it is a tie, use the one with the most energy
     *
     * @param {Creep} creep Acts on this creep object
     * @param {Creep[]} roomCreeps The other Creeps to check the sourceId of
     * @param {Source[]} sources
     * @param {String} creepRole Role to filter roomCreeps by
     * @returns {boolean} Whether there is one valid source in the room
     */
    setSource: function(creep,roomCreeps,sources,creepRole=null){
        if(sources.length){
            let place=-1;
            if(sources.length===1){
                place=0;
            }
            else{
                let min=-1;
                let maxEnergy=-1;
                for(let i in sources) {
                    let users;
                    if(creepRole===null) {
                        users=_.filter(roomCreeps, (creep) => creep.memory.sourceId === sources[i].id);
                    }
                    else {
                        users=_.filter(roomCreeps, (creep) => creep.memory.sourceId === sources[i].id
                            && creep.memory.role === creepRole);
                    }
                    if(min===-1||users.length<min||(users.length===min&&sources[i].energy>maxEnergy)){
                        min=users.length;
                        place=i;
                        maxEnergy=sources[i].energy;
                    }
                }
            }

            if(place===-1)
                return false;
            creep.memory.sourceId=sources[place].id;
            return true;
        }
        else{
            return false;
        }
    },

    /**
     * Summary. Sets the creep's mineId to the mine in the room
     *
     * @param {Creep} creep Acts on this creep object
     * @returns {boolean} Whether there is a valid mine or not
     */
    setExtractor: function(creep){
        const minerals=creep.room.find(FIND_MINERALS)[0];
        if(minerals.length){
            creep.memory.mineId=minerals[0].id;
            return true;
        }
        else
            return false;
    },

    /**
     * Summary. Sets the creep's enemyId to the first enemy creep in the room
     *
     * @param {Creep} creep Acts on this creep object
     * @param {Creep[]} enemyCreeps The list of all enemy creeps in the room
     * @returns {boolean} True if successful (list length > 0)
     */
    setEnemy: function(creep,enemyCreeps){
        if(enemyCreeps.length){
            creep.memory.enemyId=enemyCreeps[0].id;
            return true;
        }
        else
            return false;
    }
};