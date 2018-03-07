const CREEP_ID_TARGET='targetId';
const CREEP_ID_STORAGE='storageId';
const CREEP_ID_PICKUP='pickupId';
const CREEP_ID_DROPOFF='dropoffId';
const CREEP_ID_SOURCE='sourceId'

/**
 * Summary. Returns the value stored in the creep's memory designated by type
 *
 * @type {prototype}
 *
 * @param type One of the CREEP_ID_* constants
 * @returns {undefined|*} Value in memory
 */
Creep.prototype.getId=function(type){
    let ret=undefined;
    switch(type){
        case CREEP_ID_TARGET:
            ret=this.memory.targetId;
            break;
        case CREEP_ID_STORAGE:
            ret=this.memory.storagtId;
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
    }
    return ret;
};

/**
 * Summary. Sets the value in the creep's memory designated by type to be value
 *
 * @type {prototype}
 *
 * @param type One of the CREEP_ID_* constants
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
    }
};