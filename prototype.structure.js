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
/**
 * Summary. Gets an array of all minerals stored in the Structure
 *
 * @returns {number[]} All minerals that the Structure contains
 */
Structure.prototype.getContainedMinerals=function(){
    if(this.store){
        let allMin = [];
        for(let mineral of allResources){
            if(this.store[mineral]>0){
                allMin.push(mineral);
            }
        }
        return allMin;
    }
    else
        return [];
};