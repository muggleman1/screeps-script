/**
 * Summary. Returns the distance between pos1 and pos2
 *
 * @param pos1
 * @param pos2
 * @returns {number}
 */
const distance=function(pos1,pos2){
    var xdif=pos1.x-pos2.x;
    var ydif=pos1.y-pos2.y;
    return Math.max(Math.abs(xdif),Math.abs(ydif));
};

module.exports = {
    /**
     * Summary. Returns true if pos1 and pos2 are adjacent, otherwise false
     *
     * @param pos1
     * @param pos2
     * @returns {boolean}
     */
    areAdjacent: function(pos1,pos2){
        return distance(pos1,pos2)<=1;
    },

    /**
     * Summary. Returns true if pos1 and pos2 are within 3 spaces of each other, otherwise false
     *
     * @param pos1
     * @param pos2
     * @returns {boolean}
     */
    isWithinRange: function(pos1,pos2){
        return distance(pos1,pos2)<=3;
    },

    /**
     * Summary. Sums the value of the building's store
     *
     * @param building
     * @returns {number} Sums the value of the building's store. -1 if the building has no store
     */
    storeSum: function(building){
        if(building.store){
            return _.sum(building.store);
        }
        else
            return -1;
    },

    /**
     * Summary. Returns a list of available spawns from the given list
     *
     * @param spawns List of spawns to select from
     * @returns {StructureSpawn[]}
     */
    chooseSpawns: function(spawns) {
        return spawns.filter(function(spawn){
            return !spawn.spawning
        });
    },

    /**
     * Summary. Generates a new creep name by adding to prefix
     *
     * @param {String} prefix Prefix to use for name generation, generally is the creep's role
     * @returns {String} Generated Name
     */
    selectCreepName: function(prefix){ //TODO: add this to a creep prototype?
        const letter="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let name;
        while(true){
            name=prefix;
            for(let i=0;i<4;i++){
                name+=letter.charAt(Math.floor(Math.random()*letter.length));
            }
            if(!Game.creeps[name])
                return name;
        }
    },

    /**
     * Summary. Generates an array of ids from an array of Structures
     *
     * @param {Structure[]} objs Array of structures to get IDs from
     * @returns {String[]} Array of IDs derive from objs
     */
    objsToIds: function(objs){
        let ids=[];
        for(let i in objs){
            ids.push(objs[i].id);
        }
        return ids;
    },

    /**
     * Summary. Generates an array of Structures from an array of IDs
     *
     * @param {String[]} ids Array of IDs to get Structures from
     * @returns {Structure[]} Array of Structures derive from ids
     */
    idsToObjs: function(ids){
        let objs = [];
        for(let i in ids){
            objs.push(Game.getObjectById(ids[i]));
        }
        return objs;
    }
};