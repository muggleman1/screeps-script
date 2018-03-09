const BodyPartSelector=require('utilities.bodyParts');
const Util=require('utilities');

module.exports = {
    run: function(creep){
        const STATE_HARVESTING=0;

        const state=creep.memory.state;
        switch(state){
            case STATE_HARVESTING:
                let sId=creep.getId(CREEP_ID_SOURCE);
                if(sId===undefined) {
                    creep.setSource('miner');
                }
                creep.gather();
                //TODO: add dropping into containers? or force pathing onto a container
                break;
            default:
                creep.memory.state=STATE_HARVESTING;
                break;
        }
    },

    spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.minerParts(energy),Util.selectCreepName('miner'),
            {memory: {role: 'miner',state: 0,home: room.name}});
    }
};