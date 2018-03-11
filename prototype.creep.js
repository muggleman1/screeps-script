const Util=require('utilities');

//Miscellaneous
/**
 * Summary. Return true if the creep is full
 *
 * @returns {boolean}
 */
Creep.prototype.isFull=function(){
    return _.sum(this.carry)===this.carryCapacity;
};

/**
 * Summary. Return true if the creep is empty
 *
 * @returns {boolean}
 */
Creep.prototype.isEmpty=function(){
    return _.sum(this.carry)===0;
};

/**
 * Summary. Returns the percent of the creep's capacity that is full
 *
 * @returns {number}
 */
Creep.prototype.percentFull=function(){
    return _.sum(this.carry)/this.carryCapacity;
};

/**
 * Summary. Return all resources in the creep's carry parts
 *
 * @returns {String[]} All resources in the creep's carry
 */
Creep.prototype.findHolding=function(){
    let held=[];
    for(let i of allResources){
        if(this.carry[i] && this.carry[i]!==0)
            held.push(i);
    }
    return held;
};

//Memory management via CREEP_ID_* constants
/**
 * Summary. Returns the value stored in the creep's memory designated by type
 *
 * @param {String} type One of the CREEP_ID_* constants
 * 
 * @returns {undefined|*} Value in memory
 */
Creep.prototype.getId=function(type){
    let ret=undefined;
    switch(type){
        case CREEP_ID_TARGET:
            ret=this.memory.targetId;
            break;
        case CREEP_ID_STORAGE:
            ret=this.memory.storageId;
            break;
        case CREEP_ID_PICKUP:
            ret=this.memory.pickupId;
            break;
        case CREEP_ID_DROPOFF:
            ret=this.memory.dropoffId;
            break;
        case CREEP_ID_SOURCE:
            ret=this.memory.sourceId;
            break;
        case CREEP_ID_SITE:
            ret=this.memory.siteId;
            break;
        case CREEP_ID_ENEMY:
            ret=this.memory.enemyId;
            break;
    }
    return ret;
};

/**
 * Summary. Sets the value in the creep's memory designated by type to be value
 *
 * @param {String} type One of the CREEP_ID_* constants
 * @param value Value to be stored into creep memory
 */
Creep.prototype.setId=function(type,value){
    switch(type){
        case CREEP_ID_TARGET:
            this.memory.targetId=value;
            break;
        case CREEP_ID_STORAGE:
            this.memory.storageId=value;
            break;
        case CREEP_ID_PICKUP:
            this.memory.pickupId=value;
            break;
        case CREEP_ID_DROPOFF:
            this.memory.dropoffId=value;
            break;
        case CREEP_ID_SOURCE:
            this.memory.sourceId=value;
            break;
        case CREEP_ID_SITE:
            this.memory.siteId=value;
            break;
        case CREEP_ID_ENEMY:
            this.memory.enemyId=value;
            break;
    }
};

//Actions
//TODO: update move function
//TODO: move to home
/**
 * Summary. Performs any action by searching for the object at the given ID
 *
 * @param {String} type One of the CREEP_ID_* constants
 * @param {function} onFound Performs onFound given the Object found by using type, if an object is found
 * @param {function} onNotFound Executes if an object is not found by using type
 * @returns {number} 0 if target is found
 */
Creep.prototype.performAction=function(type,onFound,onNotFound){
    const id=this.getId(type);
    if(id !== undefined){
        const target=Game.getObjectById(id);
        if(target !== null) {
            onFound(this,target);
            return 0;
        }
        else {
            onNotFound(this);
            return -1;
        }
    }
    else
        return -2;
};

/**
 * Summary. Causes the creep to build the object specified by targetId.
 *
 * @type {prototype}
 *
 * @param {String} type One of the CREEP_ID_* constants
 *
 * @returns {boolean} Whether the function completed
 */
Creep.prototype.construct=function(type) {
    const found=function(creep,target) {
        if (Util.isWithinRange(creep.pos, target.pos)) {
            creep.build(target);
        }
        if (!Util.areAdjacent(creep.pos, target.pos)) {
            if (creep.fatigue === 0) {
                creep.moveTo(target);
            }
        }
    };
    const notFound=function(creep) {
        creep.setId(type, undefined);
    };
    return this.performAction(type,found,notFound)===0;
};

/**
 * Summary. Causes the creep to harvest energy or minerals from the source/mine specified by sourceId
 *
 * @type {prototype}
 *
 * @returns {boolean} Whether the function completed
 */
Creep.prototype.gather=function() {
    const found=function(creep,source) {
        if(Util.areAdjacent(creep.pos,source.pos)){
            creep.harvest(source);
        }
        else{
            if(creep.fatigue===0) {
                creep.moveTo(source);
            }
        }
    };
    return this.performAction(CREEP_ID_SOURCE,found,null)===0;
};

/**
 * Summary. Causes the creep to go towards controllerX and controllerY
 *
 * @type {prototype}
 *
 * @returns {boolean} Whether the function completed
 */
Creep.prototype.upgrade=function(){
    let valid=false;
    if(Util.isWithinRange(this.pos,this.room.controller.pos)){
        this.upgradeController(this.room.controller);
        valid=true;
    }
    if(Util.distance(this.pos,this.room.controller.pos)>2){
        if(this.fatigue===0) {
            if(this.moveTo(this.memory.controllerX,this.memory.controllerY) === ERR_NO_PATH){
                this.memory.controllerX=undefined;
                this.memory.controllerY=undefined;
                return false;
            }
        }
        return true;
    }
    return valid;
};

/**
 * Summary. Causes the creep to move towards and melee attack the creep specified by enemyId
 *
 * @type {prototype}
 *
 * @param {String} type One of the CREEP_ID_* constants
 *
 * @returns {boolean} Whether the function completed
 */
Creep.prototype.attackEnemy=function(type){
    const found=function(creep,enemy){
        if(creep.attack(enemy)===ERR_NOT_IN_RANGE)
            creep.moveTo(enemy);
        creep.rangedHeal(creep); //TODO: check if the creep has heal parts
    };
    return this.performAction(type,found,null)===0;
};

/**
 * Summary. Causes the creep to move towards and deposit the specified resource into the building specified by type
 *
 * @type {prototype}
 *
 * @param {String} type One of the CREEP_ID_* constants
 * @param {String} resource Resource type that the creep should be depositing
 *
 * @returns {boolean} Whether the function completed
 */
Creep.prototype.refillBuildings=function(type,resource){
    const found=function(creep,target){
        if(Util.areAdjacent(creep.pos,target.pos)){
            creep.transfer(target,resource);
            creep.setId(type,undefined);
        }
        else{
            if(creep.fatigue===0) {
                creep.moveTo(target);
            }
        }
    };
    return this.performAction(type,found,null)===0;
};

/**
 * Summary. Causes the creep to move towards and pickup the specified resource into the building specified by type
 *
 * @type {prototype}
 *
 * @param {String} type One of the CREEP_ID_* constants
 * @param {String} resource One of the RESOURCE_* constants
 *
 * @returns {boolean} Whether the function completed
 */
Creep.prototype.withdrawResource=function(type,resource){
    const found=function(creep,target){
        if(Util.areAdjacent(creep.pos,target.pos)){
            creep.withdraw(target,resource);
        }
        else{
            if(creep.fatigue===0) {
                creep.moveTo(target);
            }
        }
    };
    return this.performAction(type,found,null)===0;
};

/**
 * Summary. Causes the creep to move towards and pickup the dropped resource
 *
 * @param type One of the CREEP_ID_* constants
 *
 * @returns {boolean} Whether the function completed
 */
Creep.prototype.pickupResource=function(type){
    const found=function(creep,target){
        if(Util.areAdjacent(creep.pos,target.pos)){
            creep.pickup(target);
        }
        else{
            if(creep.fatigue===0) {
                creep.moveTo(target);
            }
        }
    };
    return this.performAction(type,found,null)===0;
};

//Memory Setters
/**
 * Summary. Sets the creep's memory by filtering buildings and then sorting
 *
 * @param {String} type One of the CREEP_ID_* constants
 * @param {function} filter Boolean function that filters buildings
 * @param {function} [sort] Compare funciton that will sort the found buildings
 *
 * @returns {boolean} True if the memory was set properly
 */
Creep.prototype.setBuilding=function(type,filter,sort=null){
    const buildings=_.filter(this.room.getBuildings(), filter);
    if (buildings.length){
        if(sort)
            buildings.sort(sort);
        this.setId(type,buildings[0].id);
        return true;
    }
    return false;
};

/**
 * Summary. Sets the targetId of the creep to an energy-holding Structure in the room, prioritizing
 *          StructureSpawn and StructureExtension objects, otherwise using StructureTowers
 *
 * @param {String} type One of the CREEP_ID_* constants
 * @param {Structure[]} buildings All buildings in the creep's room
 *
 * @returns {boolean} Whether there are valid energy buildings in the room
 */
Creep.prototype.setEnergyBuilding=function(type){
    let ret=this.setBuilding(type,
        (structure) => (structure.structureType===STRUCTURE_EXTENSION||structure.structureType === STRUCTURE_SPAWN)
        && structure.energy < structure.energyCapacity,
        function(a,b){return a.energy-b.energy;});
    if(!ret){
        ret=this.setBuilding(type,(structure) => structure.structureType===STRUCTURE_TOWER
            && structure.energy < structure.energyCapacity * .9,
            function(a,b){return a.energy-b.energy;});
    }
    return ret;
};

/**
 * Summary. Sets the targetId of the creep to a ConstructionSite in the room if possible, prioritizing ones
 *          created first
 *
 * @param {String} type One of the CREEP_ID_* Constants
 *
 * @returns {boolean} Whether there are valid energy ConstructionSite objects in the room
 */
Creep.prototype.setConstructionSite=function(type){
    const targets = this.room.find(FIND_CONSTRUCTION_SITES);
    if(targets.length) {
        this.setId(type,targets[0].id);
        return true;
    }
    return false;
};

/**
 * Summary. Sets the sourceId of the creep to the id of a source in  sources that has the fewest Creeps
 *          in roomCreeps that has sourceId set to that source. If it is a tie, use the one with the most energy
 *
 * @param {String} creepRole Role to filter roomCreeps by
 *
 * @returns {boolean} Whether there is one valid source in the room
 */
Creep.prototype.setSource=function(creepRole=null){
    const sources=this.room.getSources();
    const roomCreeps=this.room.getMyCreeps();
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

        if(place!==-1) {
            this.setId(CREEP_ID_SOURCE,sources[place].id);
            return true;
        }
    }
    return false;
};

/**
 * Summary. Sets the creep's id to the mine in the room
 *
 * @param {String} type One of the CREEP_ID_* constants
 *
 * @returns {boolean} Whether there is a valid mine or not
 */
Creep.prototype.setMine=function(type){
    const minerals=this.room.find(FIND_MINERALS)[0];
    if(minerals.length){
        this.setId(type,minerals[0].id);
        return true;
    }
    return false;
};

/**
 * Summary. Sets the creep's enemyId to the first enemy creep in the room
 *
 * @param {Creep[]} enemyCreeps The list of all enemy creeps in the room
 *
 * @returns {boolean} True if successful (list length > 0)
 */
Creep.prototype.setEnemy=function(enemyCreeps){
    if(enemyCreeps.length){
        this.setId(CREEP_ID_ENEMY,enemyCreeps[0].id);
        return true;
    }
    return false;
};

/**
 * Summary. Sets the creep's memory to the largest dropped resource, filtering by the input resource
 *
 * @param {String} type One of the CREEP_ID_* constants
 * @param {String} [resource] One of the RESOURCE_* constants
 * @param {int} [min] Minimum amount of resource to find, default 20
 *
 * @returns {boolean} True if successful (list length > 0)
 */
Creep.prototype.setDropped=function(type,resource=null,min=20){
    const targets = this.room.find(FIND_DROPPED_RESOURCES);
    if (targets.length) {
        if(resource===null)
            targets.filter((value) => value.amount>min);
        else
            targets.filter((value) => value.amount>min && value.resourceType===resource);
        targets.sort(function(a,b){
            return b.amount-a.amount;
        });
        this.setId(type,targets[0].id);
        return true;
    }
    return false;
};

/**
 * Summary. Sets the controllerX and controllerY to allow pathing to the controller
 *
 * @returns {boolean} True if successful
 */
Creep.prototype.setControllerMem=function(){
    const controller=this.room.controller;
    let xOptions,yOptions;
    if(this.pos.x<controller.pos.x){
        xOptions=[0,-1,1,-2,2,-3,3];
    }
    else{
        xOptions=[0,1,-1,2,-2,3,-3];
    }
    if(this.pos.y<controller.pos.y){
        yOptions=[0,-1,1,-2,2,-3,3];
    }
    else{
        yOptions=[0,1,-1,2,-2,3,-3];
    }
    for(let i=0;i<xOptions.length;i++){
        for(let j=0;j<yOptions.length;j++){
            const newX=controller.pos.x+xOptions[i];
            const newY=controller.pos.y+yOptions[j];
            if(Game.map.getTerrainAt(newX,newY,this.room.name)!=="wall"){
                if(this.moveTo(newX,newY)!==ERR_NO_PATH){
                    this.memory.controllerX=newX;
                    this.memory.controllerY=newY;
                    return true;
                }
            }
        }
    }
    return false;
};