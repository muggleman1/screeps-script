const util=require('utilities');

//Misc.
/**
 * Summary. Returns a list of available spawns from the given list
 *
 * @param spawns List of spawns to select from
 * @returns {StructureSpawn[]}
 */
Room.prototype.chooseSpawns=function() {
    let spawns=this.getSpawns();
    return spawns.filter(function(spawn){
        return spawn.isActive() && spawn.spawning===null;
    });
};

//Building Placement
/**
 * Summary. Places buildings based on the appropriate RCL
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
                this.place(STRUCTURE_STORAGE);
                this.place(STRUCTURE_EXTENSION,10);
                break;
            case 4:
                this.place(STRUCTURE_EXTENSION,10);
                this.place(STRUCTURE_TOWER);
                //TODO: add 2 links
                break;
            case 5:
                const min=this.find(FIND_MINERALS)[0];
                if(min) {
                    min.pos.createConstructionSite(STRUCTURE_EXTRACTOR);
                    this.memory.mineralType=min.mineralType;
                }
                this.place(STRUCTURE_EXTENSION,10);
                this.place(STRUCTURE_LAB,3);
                this.place(STRUCTURE_TERMINAL);
                //TODO: add 1 link
                break;
            case 6:
                this.place(STRUCTURE_SPAWN);
                this.place(STRUCTURE_EXTENSION,10);
                this.place(STRUCTURE_TOWER);
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
                     5, 6,-2,-2,-3,
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
 */
Room.prototype.findCenter=function(){
    this.memory.centerX=-1;
    this.memory.centerY=-1;
    this.memory.orientation='vertical';

    //Initialize the array of all potential valid centers
    let possibleCentersV=[];
    let possibleCentersH=[];
    for(let i=0;i<50;i++){
        possibleCentersV.push([]);
        possibleCentersH.push([]);
        for(let j=0;j<50;j++){
            const valid=i>7&&i<42&&j>8&&j<41;
            possibleCentersV[i].push(valid); //Whether the initial location is valid
            possibleCentersH[i].push(valid);
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
                    //Iterate through all centers that a wall conflicts with
                    for(let k=0;k<13;k++){
                        for(let m=0;m<15;m++){
                            const centerX=i+k-6;
                            const centerY=j+m-7;
                            if(centerX>0&&centerX<50&&centerY>0&&centerY<50) {
                                possibleCentersV[centerX][centerY] = false;
                            }
                        }
                    }
                    //The same but for horizontal centers
                    for(let k=0;k<15;k++){
                        for(let m=0;m<13;m++){
                            const centerX=i+k-7;
                            const centerY=j+m-6;
                            if(centerX>0&&centerX<50&&centerY>0&&centerY<50) {
                                possibleCentersH[centerX][centerY] = false;
                            }
                        }
                    }
                }
            }
        }
    }

    let centers=[];
    for(let i=0;i<50;i++){
        for(let j=0;j<50;j++){
            //push x,y coords to another array and choose the best one
            if(possibleCentersV[i][j]===true){
                centers.push({x:i,y:j,o:'vertical'});
            }
            if(possibleCentersH[i][j]===true){
                centers.push({x:i,y:j,o:'horizontal'});
            }
        }
    }

    const sources=this.getSources();
    for(let i in centers){
        const curr=centers[i];
        let heur=0;
        for(let j in sources){
            heur+=util.distance(sources[j].pos,new RoomPosition(curr.x,curr.y,this.name));
        }
        heur+=util.distance(this.controller.pos,new RoomPosition(curr.x,curr.y,this.name));
        centers[i].heur=heur;
    }

    centers.sort(function(a,b){
        return a.heur-b.heur;
    });

    this.memory.centerX=centers[0].x;
    this.memory.centerY=centers[0].y;
};


Room.prototype.findMinerals=function(){
    let minerals = this.find(FIND_MINERALS)[0];
    this.memory.mineralId = minerals.id;
};

//Memory Management
/**
 * Summary. Returns all sources in the room. Parses from memory or calls Room.find and sets memory
 *
 * @returns {Source[]} All sources in the room
 */
Room.prototype.getSources=function(){
    if(this.memory.sources!==undefined){
        const objs=util.idsToObjs(JSON.parse(this.memory.sources));
        let valid=true;
        for(let i in objs){
            if(objs[i]===null){
                valid=null;
                break;
            }
        }
        if(valid)
            return objs;
    }
    let sources=this.find(FIND_SOURCES);
    this.memory.sources=JSON.stringify(util.objsToIds(sources));
    return sources;
};

/**
 * Summary. Returns all structures in the room. Parses from memory or calls Room.find and sets memory
 *
 * @returns {Structure[]} All Structure objects in the room
 */
Room.prototype.getBuildings=function(){
    if(this.memory.buildings!==undefined){
        const objs=util.idsToObjs(JSON.parse(this.memory.buildings));
        let valid=true;
        for(let i in objs){
            if(objs[i]===null){
                valid=null;
                break;
            }
        }
        if(valid)
            return objs;
    }
    const buildings=this.find(FIND_STRUCTURES);
    this.memory.buildings=JSON.stringify(util.objsToIds(buildings));
    return buildings;
};

/**
 * Summary. Returns all friendly creeps in the room. Parses from memory or calls Room.find and sets memory
 *
 * @returns {Creep[]} All friendly Creep objects in the room
 */
Room.prototype.getMyCreeps=function(){
    if(this.memory.myCreeps!==undefined){
        const objs=util.idsToObjs(JSON.parse(this.memory.myCreeps));
        let valid=true;
        for(let i in objs){
            if(objs[i]===null){
                valid=null;
                break;
            }
        }
        if(valid)
            return objs;
    }
    const myCreeps=this.find(FIND_MY_CREEPS);
    this.memory.myCreeps=JSON.stringify(util.objsToIds(myCreeps));
    return myCreeps;
};

/**
 * Summary. Sets the Room.memory.myCreeps to represent the passed myCreeps
 *
 * @param {Creep[]} myCreeps All friendly creeps in the room
 */
Room.prototype.setMyCreeps=function(myCreeps) {
    this.memory.myCreeps = JSON.stringify(util.objsToIds(myCreeps));
};

/**
 * Summary. Returns all enemy creeps in the room. Parses from memory or calls Room.find and sets memory
 *
 * @returns {Creep[]} All enemy Creep objects in the room
 */
Room.prototype.getEnemyCreeps=function(){
    if(this.memory.enemyCreeps!==undefined){
        const objs=util.idsToObjs(JSON.parse(this.memory.enemyCreeps));
        let valid=true;
        for(let i in objs){
            if(objs[i]===null){
                valid=null;
                break;
            }
        }
        if(valid)
            return objs;
    }
    const enemyCreeps=this.find(FIND_HOSTILE_CREEPS);
    this.memory.enemyCreeps=JSON.stringify(util.objsToIds(enemyCreeps));
    return enemyCreeps;
};

/**
 * Summary. Returns all spawns in the room. Parses from memory or calls Room.find and sets memory
 *
 * @returns {StructureSpawn[]} All spawns in the room
 */
Room.prototype.getSpawns=function(){
    if(this.memory.spawns!==undefined){
        const objs=util.idsToObjs(JSON.parse(this.memory.spawns));
        let valid=true;
        for(let i in objs){
            if(objs[i]===null){
                valid=null;
                break;
            }
        }
        if(valid)
            return objs;
    }
    let spawns=_.filter(this.getBuildings(),(building)=>building.structureType===STRUCTURE_SPAWN);
    this.memory.spawns=JSON.stringify(util.objsToIds(spawns));
    return spawns;
};

/**
 * Summary. Clears temporary memory for the room
 */
Room.prototype.resetTempMemory=function(){
    this.memory.buildings=undefined;
    this.memory.myCreeps=undefined;
    this.memory.enemyCreeps=undefined;
    this.memory.spawns=undefined;
};

/**
 * Summary. Clears temporary memory for the room
 */
Room.prototype.resetAllMemory=function() {
    for (let i in this.memory) {
        this.memory[i] = undefined;
    }
};
