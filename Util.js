const roomGetters=require('utilities.roomMemory');

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

    selectCreepName: function(prefix){
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
    }
};