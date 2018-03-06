module.exports = {
    /**
     * Summary. Returns an array of body parts for a Worker
     *
     * @param totalEnergy Max energy available for parts
     * @returns {*[]}
     */
    workerParts: function(totalEnergy){
        if(totalEnergy>=800){
            return [WORK,WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,
                MOVE, MOVE, MOVE, MOVE];
        }
        else if(totalEnergy>=550){
            return [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE];
        }
        else{
            return [WORK,WORK,CARRY,MOVE];
        }
    },

    /**
     * Summary. Returns an array of body parts for a Miner
     *
     * @param totalEnergy Max energy available for parts
     * @returns {*[]}
     */
    minerParts: function(totalEnergy){
        if(totalEnergy>=650) {
            return [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
        }
        else {
            return [WORK,WORK,CARRY,MOVE]
        }
    },

    /**
     * Summary. Returns an array of body parts for a Carrier
     *
     * @param totalEnergy Max energy available for parts
     * @returns {*[]}
     */
    carrierParts: function(totalEnergy){
        if(totalEnergy>=800){
            return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        else if(totalEnergy>=500){
            return [CARRY,CARRY,CARRY,CARRY,CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        else {
            return [CARRY,CARRY,CARRY,
                    MOVE, MOVE, MOVE];
        }
    },

    /**
     * Summary. Returns an array of body parts for a Defender
     *
     * @param totalEnergy Max energy available for parts
     * @returns {*[]}
     */
    defenderParts: function(totalEnergy){
        //TODO: more advanced?
        if(totalEnergy>=750){
            return [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                    MOVE,MOVE,MOVE,MOVE,
                    HEAL,
                    ATTACK,ATTACK,ATTACK]
        }
        else if(totalEnergy>=450){
            return [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                    ATTACK,     ATTACK,     ATTACK,
                    MOVE,MOVE,MOVE];
        }
        else if(totalEnergy>=300){
            return [TOUGH,TOUGH,TOUGH,TOUGH,
                    ATTACK,ATTACK,
                    MOVE,MOVE];
        }
        else{
            return [ATTACK,MOVE];
        }
    }
};