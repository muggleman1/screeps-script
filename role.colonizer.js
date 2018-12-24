const BodyPartSelector=require('utilities.bodyParts');
const Util=require('utilities');

module.exports = {
    run: function(creep) {
        const CREATING_BASE=0;

        const state=creep.memory.state;
        switch(state){
            case CREATING_BASE:
                creep.travelTo(Game.rooms[creep.memory.home].controller); // TODO: FINISH THIS (also better move function??
                break;

            default:
                creep.memory.state=CREATING_BASE;
                break;
        }
    },

    spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.workerParts(energy),Util.selectCreepName('builder'),
            {memory: {role: 'builder',state: 0,home: room.name}});
    }
};
