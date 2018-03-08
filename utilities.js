/**
 * Summary. Returns the distance between pos1 and pos2
 *
 * @param pos1
 * @param pos2
 * @returns {number}
 */
const distance=function(pos1,pos2){
    let xdif=pos1.x-pos2.x;
    let ydif=pos1.y-pos2.y;
    return Math.max(Math.abs(xdif),Math.abs(ydif));
};

module.exports = {
    distance: distance,

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
    },

    /**
     * Summary. Generates an array of ids from an array of objects
     *
     * @param {*[]} objs Array of objects to get IDs from
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
     * Summary. Generates an array of objects from an array of IDs
     *
     * @param {*[]} ids Array of IDs to get objects from
     * @returns {Structure[]} Array of objects derive from ids
     */
    idsToObjs: function(ids){
        let objs = [];
        for(let i in ids){
            objs.push(Game.getObjectById(ids[i]));
        }
        return objs;
    }
};