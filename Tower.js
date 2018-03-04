module.exports = {
    act: function(towers,structures){
        if(towers.length) {
            let hostiles = towers[0].room.find(FIND_HOSTILE_CREEPS);

            if (hostiles.length > 0) {
                let canDamage=false;
                for(let creep of hostiles){
                    const body=creep.body;
                    for(let part of creep){
                        if(part===WORK||part===ATTACK||part===RANGED_ATTACK||part===CLAIM) {
                            canDamage = true;
                            break;
                        }
                    }
                    if(canDamage)
                        break;
                }

                const target=towers[0].pos.findClosestByRange(hostiles);
                for (let i in towers) {
                    towers[i].attack(target);
                }
            }
            else {
                //TODO: modify to prioritize repairs on non-walls/ramparts to save energy
                let repairTowers=towers.filter(
                    function(value){
                        return value.energy>value.energyCapacity/2;
                    }
                );

                if(repairTowers.length){
                    let maximumHealth=500000; //prevents overhealing of walls //TODO: change based on level
                    let targets = _.filter(structures,
                        (structure1) => structure1.hits <= Math.min(structure1.hitsMax,maximumHealth)-800);
                    if (targets.length) {
                        repairTowers.sort(function(a,b){
                            return a.energy>b.energy;
                        }); //sort towers in descending order of energy stored
                        targets.sort(function(a,b){
                            return (a.hitsMax-a.hits)/a.hitsMax<(b.hitsMax-b.hits)/b.hitsMax;
                        }); //sort based on percent of hits missing
                        for(let tower of repairTowers){
                            tower.repair(targets[0]); //TODO: allow for repairing more than one thing
                        }
                    }
                }
            }
        }
    }
};