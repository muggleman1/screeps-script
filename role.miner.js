const BodyPartSelector=require('utilities.bodyParts');
const Util=require('utilities');

module.exports = {
    run: function(creep){
        const STATE_PATHING=0;
        const STATE_HARVESTING=1;

        const state=creep.memory.state;
        switch(state){
            case STATE_PATHING:
                let cId=creep.getId(CREEP_ID_TARGET);
                if(cId===undefined || Game.getObjectById(cId)===null) {
                    let id = creep.getId(CREEP_ID_SOURCE);
                    if (id === undefined) {
                        creep.setSource('miner');
                        id = creep.getId(CREEP_ID_SOURCE);
                    }
                    let ret = creep.setBuilding(CREEP_ID_TARGET,
                        (building) => building.structureType === STRUCTURE_CONTAINER &&
                            Util.areAdjacent(Game.getObjectById(id).pos, building.pos));
                    cId=creep.getId(CREEP_ID_TARGET);
                    if(!ret){
                        creep.memory.state=STATE_HARVESTING;
                        break;
                    }
                }
                const cont=Game.getObjectById(cId);
                creep.moveTo(cont);
                if (Util.distance(cont.pos, creep.pos) === 0) {
                    creep.memory.state = STATE_HARVESTING;
                }
                break;
            case STATE_HARVESTING:
                let sId=creep.getId(CREEP_ID_SOURCE);
                if(sId===undefined) {
                    creep.memory.state=STATE_PATHING;
                    break;
                }
                creep.gather();
                break;
            default:
                creep.memory.state=STATE_PATHING;
                break;
        }
    },

    spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.minerParts(energy),Util.selectCreepName('miner'),
            {memory: {role: 'miner',state: 0,home: room.name}});
    }
};