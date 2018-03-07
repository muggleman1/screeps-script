const util=require('utilities');

/**
 * Summary. Places buildings based on the appropriate RCL
 *
 * @type {prototype}
 */
Room.prototype.controllerChange=function(){
    const currLevel=this.memory.level;
    const controllerLevel=this.controller.level;
    const centerX=this.memory.centerX;
    const centerY=this.memory.centerY;
    if(centerX && centerY && currLevel<controllerLevel){
        switch(currLevel){
            case 1:
                this.place(STRUCTURE_EXTENSION,5);
                break;
            case 2:
                this.place(STRUCTURE_EXTENSION,5);
                this.place(STRUCTURE_TOWER);
                this.place(STRUCTURE_ROAD,999999);
                //TODO: place walls and ramparts
                break;
            case 3:
                this.place(STRUCTURE_EXTENSION,10);
                this.place(STRUCTURE_STORAGE);
                break;
            case 4:
                this.place(STRUCTURE_EXTENSION,10);
                this.place(STRUCTURE_TOWER);
                //TODO: add 2 links
                break;
            case 5:
                this.place(STRUCTURE_EXTENSION,10);
                const min=this.find(FIND_MINERALS)[0];
                if(min) {
                    min.pos.createConstructionSite(STRUCTURE_EXTRACTOR);
                    this.memory.mineralType=min.mineralType;
                }
                this.place(STRUCTURE_LAB,3);
                //TODO: add 1 link
                break;
            case 6:
                this.place(STRUCTURE_SPAWN);
                this.place(STRUCTURE_EXTENSION,10);
                this.place(STRUCTURE_TOWER);
                this.place(STRUCTURE_TERMINAL);
                this.place(STRUCTURE_LAB,3);
                //TODO: add 1 link
                break;
            case 7:
                this.place(STRUCTURE_SPAWN);
                this.place(STRUCTURE_EXTENSION,10);
                this.place(STRUCTURE_TOWER,3);
                this.place(STRUCTURE_LAB,4);
                this.place(STRUCTURE_OBSERVER);
                this.place(STRUCTURE_NUKER);
                this.place(STRUCTURE_POWER_SPAWN);
                //TODO: add 2 links
                break;
        }
        this.memory.level++;
    }
};

/**
 * Summary. Places buildings of the indicated number based on the predefined base layout
 *
 * @type {prototype}
 *
 * @param {String} type The type of structure to place
 * @param number Number of Structures to place, default 1
 */
Room.prototype.place=function(type,number=1){
    const centerX=this.memory.centerX;
    const centerY=this.memory.centerY;
    const orientation=this.memory.orientation;
    const name=this.name;
    if(centerX && centerY && orientation) {
        let xVals=[];
        let yVals=[];
        switch (type) {
            case STRUCTURE_SPAWN:
                xVals=[-2,2,-3];
                yVals=[0,0,-1];
                break;
            case STRUCTURE_EXTENSION:
                //This took a very long time
                xVals=[
                    -1, 1,-1, 1, 0,
                     0,-1,-2,-2,-3,
                    -3,-1,-2,-2,-3,
                    -4,-4,-4, 2, 2,
                     1, 1, 2, 3, 3,
                     4, 4, 4, 3, 2,
                     0, 0, 1, 2, 3,
                     3, 1, 2, 2, 3,
                     4, 4, 4,-1,-2,
                    -3,-3,-1,-2,-2,
                    -3,-4,-4,-4,-4,
                    -5,-5,-5,-5,-4
                ];
                yVals=[
                    -2,-2,-3,-3,-4,
                    -5,-5,-3,-4,-4,
                    -5,-6,-6,-7,-7,
                    -7,-6,-5,-3,-4,
                    -5,-6,-6,-4,-5,
                    -5,-6,-7,-7,-7,
                     4, 5, 5, 4, 4,
                     5, 6, 6, 7, 7,
                     7, 6, 5, 5, 4,
                     4, 5, 6, 6, 7,
                     7, 7, 6, 5, 1,
                     1, 0,-1,-2,-2
                ];
                break;
            case STRUCTURE_POWER_SPAWN:
                xVals=[3];
                yVals=[1];
                break;
            case STRUCTURE_LAB:
                xVals=[4,5,5,6,7,7,7,6,6,5];
                yVals=[1,1,2,2,2,1,0,0,-1,-1];
                break;
            case STRUCTURE_STORAGE:
                xVals=[0];
                yVals=[0];
                break;
            case STRUCTURE_LINK:
                xVals=[-3,3];
                yVals=[1,-1];
                break;
            case STRUCTURE_OBSERVER:
                xVals=[-4];
                yVals=[2];
                break;
            case STRUCTURE_TOWER:
                xVals=[-1,1,-2,-1,1,2];
                yVals=[2,2,3,3,3,3];
                break;
            case STRUCTURE_NUKER:
                xVals=[4];
                yVals=[-2];
                break;
            case STRUCTURE_TERMINAL:
                xVals=[4];
                yVals=[2];
                break;
            case STRUCTURE_ROAD:
                xVals=[
                     0, 1, 1, 1, 0,
                    -1,-1,-1, 0, 0,
                    -1, 1,-2, 2,-3,
                     3, 0, 0,-1, 1,
                    -2, 2,-3, 3,-3,
                    -4,-4, 3, 4, 4,
                     5, 5,-2,-2,-3,
                    -3,-4,-4,-5,-5,
                     2, 2, 3, 3, 4,
                     4, 5, 5,-2,-2,
                    -3,-3,-4,-4,-5,
                    -5, 2, 2, 3, 3,
                     4, 4, 5, 5
                ];
                yVals=[
                    -1,-1, 0, 1, 1,
                     1, 0,-1,-2,-3,
                    -4,-4,-5,-5,-6,
                    -6, 2, 3, 4, 4,
                     5, 5, 6, 6, 0,
                     0,-1, 0, 0,-1,
                     0, 1,-1,-2,-2,
                    -3,-3,-4,-4,-5,
                    -1,-2,-2,-3,-3,
                    -4,-4,-5, 1, 2,
                     2, 3, 3, 4, 4,
                     5, 1, 2, 2, 3,
                     3, 4, 4, 5
                ];
                break;
        }
        let validLocations=[];
        for(let i=0;i<xVals.length;i++) {
            if (orientation === 'vertical')
                validLocations.push(new RoomPosition(centerX + xVals[i], centerY + yVals[i], name));
            else
                validLocations.push(new RoomPosition(centerX + yVals[i], centerY + xVals[i], name));
        }

        let placed=0;
        for(let pos of validLocations){
            let ret=this.createConstructionSite(pos,type);
            if(ret===OK){
                placed++;
                if(placed>=number)
                    return;
            }
            else if(ret===ERR_RCL_NOT_ENOUGH){
                return;
            }
        }
    }
};

/**
 * Summary. Calculates the best possible center for the base given the layout of the room and the predefined base
 *          formation and updates the room's memory
 *
 * @type {prototype}
 */
Room.prototype.findCenter=function(){
    this.memory.centerX=-1;
    this.memory.centerY=-1;
    this.memory.orientation='vertical';

    //Initialize the array of all potential valid centers
    let possibleCenters=[];
    for(let i=0;i<50;i++){
        possibleCenters.push([]);
        for(let j=0;j<50;j++){
            possibleCenters[i].push(i>7&&i<42&&j>8&&j<41); //Whether the initial location is valid
        }
    }

    //Test each terrain in the room
    for(let i=0;i<50;i++){
        for(let j=0;j<50;j++){
            let loc=this.lookForAt(LOOK_TERRAIN,i,j);
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
                            const centerX=i+k-6;
                            const centerY=j+m-7;
                            if(centerX>0&&centerX<50&&centerY>0&&centerY<50) {
                                possibleCenters[centerX][centerY] = false;
                            }
                        }
                    }
                }
            }
        }
    }

    for(let i=0;i<50;i++){
        for(let j=0;j<50;j++){
            if(possibleCenters[i][j]===true){
                this.memory.centerX=i;
                this.memory.centerY=j;
                //TODO: push x,y coords to another array and choose the best one
                return;
            }
        }
    }
};

/**
 * Summary. Returns all sources in the room. Parses from memory or calls Room.find and sets memory
 *
 * @type {prototype}
 *
 * @returns {Source[]} All sources in the room
 */
Room.prototype.getSources=function(){
    if(this.memory.sources===undefined){
        let sources=this.find(FIND_SOURCES);
        this.memory.sources=JSON.stringify(util.objsToIds(sources));
        return sources;
    }
    else {
        return util.idsToObjs(JSON.parse(this.memory.sources));
    }
};

/**
 * Summary. Returns all structures in the room. Parses from memory or calls Room.find and sets memory
 *
 * @type {prototype}
 *
 * @returns {Structure[]} All Structure objects in the room
 */
Room.prototype.getBuildings=function(){
    if(this.memory.buildings===undefined){
        let buildings=this.find(FIND_STRUCTURES);
        this.memory.buildings=JSON.stringify(util.objsToIds(buildings));
        return buildings;
    }
    else {
        return util.idsToObjs(JSON.parse(this.memory.buildings));
    }
};

/**
 * Summary. Returns all friendly creeps in the room. Parses from memory or calls Room.find and sets memory
 *
 * @type {prototype}
 *
 * @returns {Creep[]} All friendly Creep objects in the room
 */
Room.prototype.getMyCreeps=function(){
    if(this.memory.myCreeps===undefined){
        let myCreeps=this.find(FIND_MY_CREEPS);
        this.memory.myCreeps=JSON.stringify(util.objsToIds(myCreeps));
        return myCreeps;
    }
    else {
        return util.idsToObjs(JSON.parse(this.memory.myCreeps));
    }
};

/**
 * Summary. Sets the Room.memory.myCreeps to represent the passed myCreeps
 *
 * @type {prototype}
 *
 * @param {Creep[]} myCreeps All friendly creeps in the room
 */
Room.prototype.setMyCreeps=function(myCreeps) {
    this.memory.myCreeps = JSON.stringify(util.objsToIds(myCreeps));
};

/**
 * Summary. Returns all enemy creeps in the room. Parses from memory or calls Room.find and sets memory
 *
 * @type {prototype}
 *
 * @returns {Creep[]} All enemy Creep objects in the room
 */
Room.prototype.getEnemyCreeps=function(){
    if(this.memory.enemyCreeps===undefined){
        let enemyCreeps=this.find(FIND_HOSTILE_CREEPS);
        this.memory.enemyCreeps=JSON.stringify(util.objsToIds(enemyCreeps));
        return enemyCreeps;
    }
    else {
        return util.idsToObjs(JSON.parse(this.memory.enemyCreeps));
    }
};

/**
 * Summary. Returns all spawns in the room. Parses from memory or calls Room.find and sets memory
 *
 * @type {prototype}
 *
 * @returns {StructureSpawn[]} All spawns in the room
 */
Room.prototype.getSpawns=function(){
    if(this.memory.spawns===undefined){
        let spawns=_.filter(this.getBuildings(),(building)=>building.structureType===STRUCTURE_SPAWN);
        this.memory.spawns=JSON.stringify(util.objsToIds(spawns));
        return spawns;
    }
    else
        return util.idsToObjs(JSON.parse(this.memory.spawns));
};

/**
 * Summary. Clears temporary memory for the room
 *
 * @type {prototype}
 */
Room.prototype.resetTempMemory=function(){
    this.memory.buildings=undefined;
    this.memory.myCreeps=undefined;
    this.memory.enemyCreeps=undefined;
    this.memory.spawns=undefined;
};

/**
 * Summary. Clears temporary memory for the room
 *
 * @type {prototype}
 */
Room.prototype.resetAllMemory=function() {
    for (let i in this.memory) {
        this.memory[i] = undefined;
    }
};