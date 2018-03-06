/**
 * Summary. Sums the value of the building's store
 *
 * @returns {number} Sums the value of the building's store. -1 if the building has no store
 */
Structure.prototype.storeSum=function(){
    if(this.store){
        return _.sum(this.store);
    }
    else
        return -1;
};