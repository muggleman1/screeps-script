const actions= require('actions.creeps');
const memoryActions=require('utilities.creeps');
const BodyPartSelector=require('utilities.bodyParts');

const Util=require('utilities');

module.exports = {
    run: function(creep) {
        const STATE_ATTACKING=0;

        const state=creep.memory.state;
        switch(state){
            case STATE_ATTACKING:{
                if(creep.memory.enemyId===undefined||Game.getObjectById(creep.memory.enemyId)===null) {
                    const enemyCreeps=creep.room.getEnemyCreeps();
                    memoryActions.setEnemy(creep, enemyCreeps);
                }
                actions.attackEnemy(creep);
            }
                break;
            default:{
                creep.memory.state=STATE_ATTACKING;
            }
                break;
        }
	},

    spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.defenderParts(energy),Util.selectCreepName('defender'),
            {memory: {role: 'defender',state: 0,home: room.name}});
    }
};