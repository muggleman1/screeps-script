const BodyPartSelector=require('utilities.bodyParts');
const Util=require('utilities');

module.exports = {
    run: function(creep) {
        const STATE_ATTACKING=0;
        const STATE_LEAVING_BASE=1;

        const state=creep.memory.state;
        switch(state){
            case STATE_ATTACKING:
                if(creep.memory.enemyId===undefined || Game.getObjectById(creep.memory.enemyId)===null) {
                    const ret=creep.setEnemy(creep.room.getEnemyCreeps());
                    if(!ret) {
                        if(creep.memory.lastTickAggro === undefined){
                            creep.memory.lastTickAggro = Game.time;
                        }
                        else if(Game.time - creep.memory.lastTickAggro >= 10){
                            creep.memory.state = STATE_LEAVING_BASE;
                        }
                        break;
                    }
                }
                creep.attackEnemy(CREEP_ID_ENEMY);
                break;
            case STATE_LEAVING_BASE:
                if(creep.memory.controllerX === undefined || creep.memory.controllerY === undefined){
                    creep.setControllerMem();
                }
                if(creep.x !== creep.memory.controllerX && creep.y !== creep.memory.controllerY){
                    creep.travelTo(creep.memory.controllerX, creep.memory.controllerY);
                }
                //TODO add returning to attacking state
                break;
            default:
                creep.memory.state=STATE_ATTACKING;
                break;
        }
	},

    spawn: function(spawn,energy,room){
        spawn.spawnCreep(BodyPartSelector.defenderParts(energy),Util.selectCreepName('defender'),
            {memory: {role: 'defender',state: 0,home: room.name}});
    }
};
