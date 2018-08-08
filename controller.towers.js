const missingHealthMin=800; //Towers will not heal a structure if it has < this amount of health
const wallMax=5e5;

module.exports = {
    act: function(towers){
        if(towers.length) {
            const room=towers[0].room;
            let roomCenter=towers[0].pos;
            if(room.memory.centerX!==undefined && room.memory.centerY!==undefined )
                roomCenter=new RoomPosition(room.memory.centerX,room.memory.centerY,room.name);
            const hostiles= room.getEnemyCreeps();
            //Attack hostiles
            if (hostiles.length > 0) {
                let canDamage=false;
                for(let creep of hostiles){
                    if(creep.pos.x<48 && creep.pos.x>1 && creep.pos.y<48 && creep.pos.y>1) {
                        const xDif=roomCenter.x-creep.pos.x;
                        const yDif=roomCenter.y-creep.pos.y;
                        if(xDif<10 && xDif>-10 && yDif<10 && yDif>-10) {
                            canDamage = true;
                            break;
                        }

                        const body = creep.body;
                        for (let part of body) {
                            if (part.type === WORK || part.type === ATTACK ||
                                part.type === RANGED_ATTACK || part.type === CLAIM) {
                                canDamage = true;
                                break;
                            }
                        }
                        if (canDamage)
                            break;
                    }
                }

                if(canDamage) {
                    const target = roomCenter.findClosestByRange(hostiles);
                    for (let tower of towers) {
                        tower.attack(target);
                    }
                    return;
                }
            }
            //Repair Buildings
            let idealTowers=towers.filter(
                function(value){
                    return value.energy>value.energyCapacity/2;
                }
            );
            if(idealTowers.length){
                const structures = room.getBuildings();
                const maximumHealth = room.memory.maxBuildingHealth; //prevents overhealing of walls
                let targets = _.filter(structures,
                    (structure1) => structure1.hits <= Math.min(structure1.hitsMax,maximumHealth)-missingHealthMin &&
                        structure1.structureType !== STRUCTURE_WALL &&
                        structure1.structureType !== STRUCTURE_RAMPART);
                if (targets.length>0) {
                    targets.sort(function(a,b){
                        return a.hits-b.hits;
                    }); //sort based on percent of hits missing, ascending order

                    let counter=0;
                    for(let tower of idealTowers){
                        tower.repair(targets[counter%targets.length]);
                        counter++;
                    }
                }
                else if(room.storage && room.storage.store.energy>200000){
                    const bigBoyz=room.getBuildings().filter(building=>building.structureType===STRUCTURE_WALL ||
                        building.structureType===STRUCTURE_RAMPART);
                    if(room.memory.maxBuildingHealth<wallMax && bigBoyz.length>0){
                        room.memory.maxBuildingHealth*=2;
                        if(room.memory.maxBuildingHealth>wallMax)
                            room.memory.maxBuildingHealth=wallMax;
                    }
                }
            }
        }
    }
};