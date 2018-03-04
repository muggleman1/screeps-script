const actions= require('CreepActions');
const memoryActions=require('CreepMemorySet');
const BodyPartSelector=require('BodyPartSelector');

const Util=require('Util');
const roomGetters=require('utilities.roomMemory');

module.exports = {
    run: function(creep) {
        const STATE_ATTACKING=0;

        const state=creep.memory.state;
        switch(state){
            case STATE_ATTACKING:{
                if(creep.memory.enemyId===undefined||Game.getObjectById(creep.memory.enemyId)===null) {
                    const enemyCreeps=roomGetters.getEnemyCreeps(creep.room);
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