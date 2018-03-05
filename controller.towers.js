const missingHealthMin=800; //Towers will not heal a structure if it has < this amount of health

module.exports = {
    act: function(towers,structures){
        if(towers.length) {
            let hostiles = towers[0].room.find(FIND_HOSTILE_CREEPS);

            if (hostiles.length > 0) {
                let canDamage=false;
                for(let creep of hostiles){
                    const body=creep.body;
                    for(let part of body){
                        if(part===WORK||part===ATTACK||part===RANGED_ATTACK||part===CLAIM) {
                            canDamage = true;
                            break;
                        }
                    }
                    if(canDamage)
                        break;
                }

                const target=towers[0].pos.findClosestByRange(hostiles);
                for (let tower of towers) {
                    tower.attack(target);
                }
            }
            else {
                let idealTowers=towers.filter(
                    function(value){
                        return value.energy>value.energyCapacity/2;
                    }
                );

                if(idealTowers.length){
                    let maximumHealth=500000; //prevents overhealing of walls //TODO: change based on level
                    let targets = _.filter(structures,
                        (structure1) => structure1.hits <= Math.min(structure1.hitsMax,maximumHealth)-missingHealthMin);
                    if (targets.length) {
                        targets.sort(function(a,b){
                            return (a.hitsMax-a.hits)/a.hitsMax<(b.hitsMax-b.hits)/b.hitsMax;
                        }); //sort based on percent of hits missing, ascending order

                        let counter=0;
                        for(let tower of idealTowers){
                            tower.repair(targets[counter%targets.length]); //TODO: more sophisticated choosing
                            counter++;
                        }
                    }
                }
            }
        }
    }
};