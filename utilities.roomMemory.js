const objsToIds=function(objs){
    let ids=[];
    for(let i in objs){
        ids.push(objs[i].id);
    }
    return ids;
};

const idsToObjs=function(ids){
    let objs = [];
    for(let i in ids){
        objs.push(Game.getObjectById(ids[i]));
    }
    return objs;
};

const getSources=function(room){
    if(room.memory.sources===undefined){
        let sources=room.find(FIND_SOURCES);
        room.memory.sources=JSON.stringify(objsToIds(sources));
        return sources;
    }
    else {
        return idsToObjs(JSON.parse(room.memory.sources));
    }
};

const getBuildings=function(room){
    if(room.memory.buildings===undefined){
        let buildings=room.find(FIND_STRUCTURES);
        room.memory.buildings=JSON.stringify(objsToIds(buildings));
        return buildings;
    }
    else {
        return idsToObjs(JSON.parse(room.memory.buildings));
    }
};

const getMyCreeps=function(room){
    if(room.memory.myCreeps===undefined){
        let myCreeps=room.find(FIND_MY_CREEPS);
        room.memory.myCreeps=JSON.stringify(objsToIds(myCreeps));
        return myCreeps;
    }
    else {
        return idsToObjs(JSON.parse(room.memory.myCreeps));
    }
};

const setMyCreeps=function(room,myCreeps) {
    room.memory.myCreeps = JSON.stringify(objsToIds(myCreeps));
};

const getEnemyCreeps=function(room){
    if(room.memory.enemyCreeps===undefined){
        let enemyCreeps=room.find(FIND_HOSTILE_CREEPS);
        room.memory.enemyCreeps=JSON.stringify(objsToIds(enemyCreeps));
        return enemyCreeps;
    }
    else {
        return idsToObjs(JSON.parse(room.memory.enemyCreeps));
    }
};

const getSpawns=function(room){
    if(room.memory.spawns===undefined){
        let spawns=_.filter(getBuildings(room),(building)=>building.structureType===STRUCTURE_SPAWN);
        room.memory.spawns=JSON.stringify(objsToIds(spawns));
        return spawns;
    }
    else
        return idsToObjs(JSON.parse(room.memory.spawns));
};

const resetTempMemory=function(room){
    room.memory.buildings=undefined;
    room.memory.myCreeps=undefined;
    room.memory.enemyCreeps=undefined;
    room.memory.spawns=undefined;
};

const resetAllMemory=function(room) {
    for (var i in room.memory) {
        room.memory[i] = undefined;
    }
};

module.exports = {
    getSources: getSources,

    getBuildings: getBuildings,

    getMyCreeps: getMyCreeps,

    setMyCreeps: setMyCreeps,

    getEnemyCreeps: getEnemyCreeps,

    getSpawns: getSpawns,

    resetTempMemory: resetTempMemory,

    resetAllMemory: resetAllMemory
};