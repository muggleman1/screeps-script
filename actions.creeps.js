const Util=require('utilities');

//TODO: add this to creep prototypes
module.exports = {
    /**
     * Summary. Causes the creep to build the object specified by targetId.
     *
     * @type {function}
     *
     * @param {Creep} creep Acts on this creep object
     *
     * @returns {boolean} Whether the function completed
     */
    construct: function(creep) {
        if(creep.memory.targetId!==undefined){
            const target=Game.getObjectById(creep.memory.targetId);
            if(target!==null) {
                if(Util.isWithinRange(creep.pos,target.pos)){
                    creep.build(target);
                }
                if(!Util.areAdjacent(creep.pos,target.pos)){
                    if(creep.fatigue===0) {
                        creep.moveTo(target);
                    }
                }
                return true;
            }
            else {
                creep.memory.targetId=undefined;
                return false;
            }
        }
        else
            return false;
    },

    /**
     * Summary. Causes the creep to harvest energy from the source specified by sourceId.
     *
     * @type {function}
     *
     * @param {Creep} creep Acts on this creep object
     *
     * @returns {boolean} Whether the function completed
     */
    gatherEnergy: function(creep) {
        if(creep.memory.sourceId!==null){
            const source = Game.getObjectById(creep.memory.sourceId);
            if(source!==null){
                if(Util.areAdjacent(creep.pos,source.pos)){
                    creep.harvest(source);
                }
                else{
                    if(creep.fatigue===0) {
                        creep.moveTo(source);
                    }
                }
            }
            else
                return false;
        }
        else
            return false;
    },

    /**
     * Summary. Causes the creep to move towards and deposit energy into the building specified in targetId
     *
     * @type {function}
     *
     * @param {Creep} creep Acts on this creep object
     *
     * @returns {boolean} Whether the function completed
     */
    refillEnergyBuildings: function(creep){
        return refillBuildings(creep,RESOURCE_ENERGY);
    },

    /**
     * Summary. Causes the creep to move towards and deposit minerals into the building specified in targetId
     *
     * @type {function}
     *
     * @param {Creep} creep Acts on this creep object
     *
     * @returns {boolean} Whether the function completed
     */
    refillMineralBuildings: function(creep){
        //TODO: use an ID for this?
        let resource=null;
        if(creep.carry[RESOURCE_HYDROGEN]!==undefined){
            resource=RESOURCE_HYDROGEN;
        }
        else if(creep.carry[RESOURCE_OXYGEN]!==undefined){
            resource=RESOURCE_OXYGEN;
        }
        else if(creep.carry[RESOURCE_UTRIUM]!==undefined){
            resource=RESOURCE_UTRIUM;
        }
        else if(creep.carry[RESOURCE_LEMERGIUM]!==undefined){
            resource=RESOURCE_LEMERGIUM;
        }
        else if(creep.carry[RESOURCE_KEANIUM]!==undefined){
            resource=RESOURCE_KEANIUM;
        }
        else if(creep.carry[RESOURCE_ZYNTHIUM]!==undefined){
            resource=RESOURCE_ZYNTHIUM;
        }
        else if(creep.carry[RESOURCE_CATALYST]!==undefined){
            resource=RESOURCE_CATALYST;
        }
        else if(creep.carry[RESOURCE_GHODIUM]!==undefined){
            resource=RESOURCE_GHODIUM;
        }

        if(resource!==null){
            return refillBuildings(creep,resource);
        }
        else
            return false;
    },

    /**
     * Summary. Causes the creep to go towards the controller, but moves it towards the "x" and "y" in memory,
     *          which is within upgrading range of the controller
     *
     * @type {function}
     *
     * @param {Creep} creep Acts on this creep object
     *
     * @returns {boolean} Whether the function completed
     */
    upgradeController: function(creep){
        if(creep.memory.x===undefined||creep.memory.y===undefined){
            const controller=creep.room.controller;
            let xOptions,yOptions;
            if(creep.pos.x<controller.pos.x){
                xOptions=[0,-1,1,-2,2,-3,3];
            }
            else{
                xOptions=[0,1,-1,2,-2,3,-3];
            }
            if(creep.pos.y<controller.pos.y){
                yOptions=[0,-1,1,-2,2,-3,3];
            }
            else{
                yOptions=[0,1,-1,2,-2,3,-3];
            }
            let complete=false;
            for(let i=0;i<xOptions.length;i++){
                for(let j=0;j<yOptions.length;j++){
                    const newx=controller.pos.x+xOptions[i];
                    const newy=controller.pos.y+yOptions[j];
                    if(Game.map.getTerrainAt(newx,newy,creep.room.name)!=="wall"){
                        if(creep.moveTo(newx,newy)!==ERR_NO_PATH){
                            complete=true;
                            creep.memory.x=newx;
                            creep.memory.y=newy;
                            break;
                        }
                    }
                }
                if(complete)
                    break;
            }
            if(!complete){
                return false;
            }
        }
        else{
            if(Util.isWithinRange(creep.pos,creep.room.controller.pos)){
                creep.upgradeController(creep.room.controller);
            }
            if(!Util.areAdjacent(creep.pos,creep.room.controller.pos)){
                if(creep.fatigue===0) {
                    if(creep.moveTo(creep.memory.x,creep.memory.y) === ERR_NO_PATH){
                        creep.memory.x=undefined;
                        creep.memory.y=undefined;
                    }
                }
            }
            return true;
        }
    },

    gatherMinerals: function(creep){
        if(creep.memory.mineId!==null){
            const mine = Game.getObjectById(creep.memory.mineId);
            if(mine!==null){
                if(Util.areAdjacent(creep.pos,mine.pos)){
                    creep.harvest(mine);
                }
                else{
                    if(creep.fatigue===0) {
                        creep.moveTo(mine);
                    }
                }
            }
            else
                return false;
        }
        else
            return false;
    },

    attackEnemy: function(creep){
        if(creep.memory.enemyId===null){
            return false;
        }
        let enemy=Game.getObjectById(creep.memory.enemyId);
        if(enemy!==null){
            if(creep.attackEnemy()===ERR_NOT_IN_RANGE)
                creep.moveTo(enemy);
            creep.rangedHeal(creep);
        }
        else
            return false;
    }
};

/**
 * Summary. Causes the creep to move towards and deposit energy into the building specified in targetId
 *
 * @type {function}
 *
 * @param {Creep} creep Acts on this creep object
 * @param {String} resource Resource type that the creep should be depositing
 *
 * @returns {boolean} Whether the function completed
 */
function refillBuildings(creep,resource){
    if(creep.memory.targetId!==null){
        const target=Game.getObjectById(creep.memory.targetId);
        if(target!==null) {
            if(Util.areAdjacent(creep.pos,target.pos)){
                creep.transfer(target,resource);
                creep.memory.targetId=undefined;
            }
            else{
                if(creep.fatigue===0) {
                    creep.moveTo(target);
                }
            }
            return true;
        }
    }
    return false;
}