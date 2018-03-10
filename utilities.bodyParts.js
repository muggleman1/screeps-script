module.exports = {
    /**
     * Summary. Returns an array of body parts for a Worker
     *
     * @param totalEnergy Max energy available for parts
     * @returns {*[]}
     */
    workerParts: function(totalEnergy){
        if(totalEnergy>=800){
            let parts=[];
            for(let i=0;i<4;i++){
                parts.push(WORK);
                parts.push(CARRY);
                parts.push(MOVE);
            }
            return parts;

        }
        else if(totalEnergy>=550){
            return [WORK,WORK,MOVE,CARRY,WORK,MOVE,CARRY,MOVE];
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
        if(totalEnergy>=650) { //TODO: use carry part?
            return [MOVE, WORK, WORK, WORK, WORK, WORK, MOVE];
        }
        else {
            return [WORK,WORK,MOVE]
        }
    },

    /**
     * Summary. Returns an array of body parts for a Carrier
     *
     * @param totalEnergy Max energy available for parts
     * @returns {*[]}
     */
    carrierParts: function(totalEnergy){
        let num=0;
        if(totalEnergy>=800){
            num=8;
        }
        else if(totalEnergy>=500){
            num=5;
        }
        else {
            num=3;
        }
        let parts=[];
        for(let i=0;i<num;i++){
            parts.push(CARRY);
            parts.push(MOVE);
        }
        return parts;
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