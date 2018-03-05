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

const findCenter=function(room){
    room.memory.centerX=-1;
    room.memory.centerY=-1;
    //TODO: quickly and efficiently find an appropriate center for the room (needs to be 13 by 15)

    //This creates the array as 34 wide and 32 high of all possible centers
    let possibleCenters=[];
    for(let i=0;i<50;i++){
        possibleCenters.push([]);
        for(let j=0;j<50;j++){
            possibleCenters[i].push(i>7&&i<42&&j>8&&j<41); //Whether the initial location is valid
        }
    }

    for(let i=1;i<49;i++){
        for(let j=1;j<49;j++){
            let loc=room.lookForAt(LOOK_TERRAIN,i,j);
            let found=false;
            if(loc){
                //account for multiple 'terrain' in one location
                for(let terrain of loc){
                    if(terrain==='wall'){
                        found=true;
                    }
                }

                if(found){
                    //iterate through all centers that a wall conflicts with
                    for(let k=0;k<13;k++){
                        for(let m=0;m<15;m++){
                            const centerX=i+k-7;
                            const centerY=j+m-7;
                            if(centerX>0&&centerX<50&&centerY>0&&centerY<50)
                                possibleCenters[centerX][centerX]=0;
                        }
                    }
                }
            }
        }
    }

    //TODO: choose of the remaining centers
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

    findCenter: findCenter,

    resetTempMemory: resetTempMemory,

    resetAllMemory: resetAllMemory
};