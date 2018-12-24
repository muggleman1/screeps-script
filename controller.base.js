const Tower=require('controller.towers');

const HarvestTime = require('role.harvester');
const UpgradeTime = require('role.upgrader');
const BuildTime = require('role.builder');
const MineTime = require('role.miner');
const DeliveryTime = require('role.deliveryBoy');
const DistributeTime = require('role.distributor');
const ExtractTime = require('role.extractor');
const DefendTime = require('role.defender');

//TODO: add containers next to sources!
module.exports = {
    run: function(room,roomCreeps){
        //TODO: creep state transitions are not clean
        //TODO: Add building replacement and ramparts

        //TODO: spawn terminal workers as necessary

        //Terminal Functionality
        if(room.terminal && room.terminal.cooldown === 0){
            //Auto-sell when full on resources
            let term = room.terminal;
            let orders = null;
            if(term.store[RESOURCE_ENERGY]>25e4 && room.storage && room.storage.store[RESOURCE_ENERGY]>3e5){
                orders = Game.market.getAllOrders(order => order.resourceType === RESOURCE_ENERGY &&
                                                            order.type === ORDER_BUY &&
                                                            order.amount > 0);
            }
            else if(term.storeSum()===term.storeCapacity){
                let mins = term.getContainedMinerals();
                if(mins && mins.length) {
                    if(mins[0] === RESOURCE_ENERGY && mins.length>1){
                        orders = Game.market.getAllOrders(order => order.resourceType === mins[1] &&
                            order.type === ORDER_BUY &&
                            order.amount > 0);
                    }
                    else{
                        orders = Game.market.getAllOrders(order => order.resourceType === mins[0] &&
                            order.type === ORDER_BUY &&
                            order.amount > 0);
                    }
                }
            }
            //TODO: better logic may be employed here
            if(orders) {
                orders = orders.sort((a, b) => b.price - a.price);
                let bestId = orders[0].id;

                let amount = Math.min(orders[0].amount,term.store[orders[0].resourceType]);
                if(Game.market.deal(bestId, amount, room.name) === 0) {
                    console.log("Sold " + amount + " units of " + orders[0].resourceType + " for " + orders[0].price);
                }
            }
        }

        //Will be used for placing buildings if necessary
        if(!room.memory.centerX||!room.memory.centerY){
            room.findCenter();
        }

        if(!room.memory.mineralId){
            console.log('finding minerals');
            room.findMinerals();
        }

        if(room.memory.maxBuildingHealth===undefined){
            room.memory.maxBuildingHealth=250000;
        }

        const controllerLevel=room.controller.level;
        if(controllerLevel>room.memory.level){
            room.controllerChange(); //TODO: convert some creeps to new roles?
        }

        room.setMyCreeps(roomCreeps);
        //Room functions that will happen consistently every tick
        const buildings=room.getBuildings();

        const towers=_.filter(buildings,(structure)=>(structure.structureType===STRUCTURE_TOWER));
        Tower.act(towers);

        let spawnPos=0;
        let availableSpawns=room.chooseSpawns();
        //Respawn creeps as necessary
        if (availableSpawns.length) {
            //Periodically check if there are no creeps. If so, spawn a harvester
            if(Game.time%25===0){
                if(!roomCreeps||roomCreeps.length===0){
                    if(room.storage && room.storage.store[RESOURCE_ENERGY]>5000) {
                        DistributeTime.spawn(availableSpawns[spawnPos], room.energyAvailable, room);
                        spawnPos++;
                    }
                    else{
                        HarvestTime.spawn(availableSpawns[spawnPos], room.energyAvailable, room);
                        spawnPos++;
                    }
                }
            }
            if(Game.time%10===0 && spawnPos<availableSpawns.length){
                let enemyCreeps=room.getEnemyCreeps();
                if(enemyCreeps.length) {
                    let canDamage = false;
                    for(let creep of enemyCreeps){
                        if(creep.pos.x<48 && creep.pos.x>1 && creep.pos.y<48 && creep.pos.y>1) {
                            const body = creep.body;
                            for (let part of body) {
                                if (part.type === WORK || part.type === ATTACK ||
                                    part.type === RANGED_ATTACK || part.type === CLAIM) {
                                    canDamage = true;
                                    break;
                                }
                            }
                            if (canDamage)
                                break;
                        }
                    }
                    if(canDamage) {
                        DefendTime.spawn(availableSpawns[spawnPos], room.energyCapacityAvailable, room);
                        spawnPos++;
                    }
                }
            }

            const roomEnergyAvailable=room.energyCapacityAvailable;
            const partitionedCreeps=_.groupBy(roomCreeps,(creep)=>creep.memory.role);

            let rolesNeeded={harvester:0,upgrader:0,builder:0,miner:0,deliveryBoy:0,distributor:0,extractor:0};
            let currCreeps={harvester:0,upgrader:0,builder:0,miner:0,deliveryBoy:0,distributor:0,extractor:0};
            if(roomEnergyAvailable<550){ //RCL 1
                rolesNeeded.harvester = 2;
                rolesNeeded.upgrader = 1;
                rolesNeeded.builder = 1;
            }
            else if (roomEnergyAvailable<800){ //RCL 2
                rolesNeeded.harvester = 3;
                rolesNeeded.upgrader = 2;
                rolesNeeded.builder = 3;
            }
            else if (roomEnergyAvailable<1300){ //RCL 3
                rolesNeeded.harvester = 4;
                rolesNeeded.upgrader = 2;
                rolesNeeded.builder = 4;
            }
            else if (roomEnergyAvailable<1800){ //RCL 4
                const sources=room.getSources();
                rolesNeeded.miner = sources.length;
                rolesNeeded.deliveryBoy = sources.length*2;
                const storage=room.storage;
                rolesNeeded.upgrader = 1;
                if(storage){
                    rolesNeeded.upgrader=Math.max(1,Math.floor(storage.store[RESOURCE_ENERGY]/100000));
                }
                rolesNeeded.builder = 2;
                rolesNeeded.distributor = 1;
            }
            else if (roomEnergyAvailable<2300){ //RCL 5
                const sources=room.getSources();
                rolesNeeded.miner = sources.length;
                rolesNeeded.deliveryBoy = sources.length*2;
                const storage=room.storage;
                rolesNeeded.upgrader = 1;
                if(storage){
                    rolesNeeded.upgrader=Math.max(1,Math.floor(storage.store[RESOURCE_ENERGY]/100000));
                }
                rolesNeeded.builder = 2;
                rolesNeeded.distributor = 1;
            }
            else if (roomEnergyAvailable<5600){ //RCL 6
                const sources=room.getSources();
                rolesNeeded.miner = sources.length;
                rolesNeeded.deliveryBoy = sources.length*2;
                const storage=room.storage;
                rolesNeeded.upgrader = 1;
                if(storage){
                    rolesNeeded.upgrader=Math.max(1,Math.floor(storage.store[RESOURCE_ENERGY]/100000));
                }
                rolesNeeded.builder = 2;
                rolesNeeded.distributor = 1;
                const minerals = Game.getObjectById(room.memory.mineralId);
                if(minerals.mineralAmount > 0) {
                    rolesNeeded.extractor = 1;
                }
            }
            else if (roomEnergyAvailable<12900){ //RCL 7
                const sources=room.getSources();
                rolesNeeded.miner = sources.length;
                rolesNeeded.deliveryBoy = sources.length*2;
                const storage=room.storage;
                rolesNeeded.upgrader = 1;
                if(storage){
                    rolesNeeded.upgrader=Math.max(1,Math.floor(storage.store[RESOURCE_ENERGY]/100000));
                }
                rolesNeeded.builder = 2;
                rolesNeeded.distributor = 1;
                const minerals = Game.getObjectById(room.memory.mineralId);
                if(minerals.mineralAmount > 0) {
                    rolesNeeded.extractor = 1;
                }
            }
            else { //RCL 8
                const sources=room.getSources();
                rolesNeeded.miner = sources.length;
                rolesNeeded.deliveryBoy = sources.length*2;
                const storage=room.storage;
                rolesNeeded.upgrader = 1;
                if(storage){
                    rolesNeeded.upgrader=Math.max(1,Math.floor(storage.store[RESOURCE_ENERGY]/100000));
                }
                rolesNeeded.builder = 2;
                rolesNeeded.distributor = 1;
                const minerals = Game.getObjectById(room.memory.mineralId);
                if(minerals.mineralAmount > 0) {
                    rolesNeeded.extractor = 1;
                }
            }

            //Set rolesNeeded
            if(partitionedCreeps['harvester']) {
                currCreeps.harvester=partitionedCreeps['harvester'].length;
            }
            if(partitionedCreeps['upgrader']) {
                currCreeps.upgrader=partitionedCreeps['upgrader'].length;
            }
            if(partitionedCreeps['builder']) {
                currCreeps.builder=partitionedCreeps['builder'].length;
            }
            if(partitionedCreeps['miner']) {
                currCreeps.miner=partitionedCreeps['miner'].length;
            }
            if(partitionedCreeps['deliveryBoy']) {
                currCreeps.deliveryBoy=partitionedCreeps['deliveryBoy'].length;
            }
            if(partitionedCreeps['distributor']) {
                currCreeps.distributor=partitionedCreeps['distributor'].length;
            }
            if(partitionedCreeps['extractor']) {
                currCreeps.extractor=partitionedCreeps['extractor'].length;
            }

            //Spawn based on needed creeps
            for(let i=spawnPos;i<availableSpawns.length;i++){ //TODO: conversion to rcl4 is still shaky
                if(rolesNeeded.harvester-currCreeps.harvester>0){
                    HarvestTime.spawn(availableSpawns[i], room.energyCapacityAvailable, room);
                    rolesNeeded.harvester--;
                }
                else if(rolesNeeded.miner-currCreeps.miner>0 ||
                        rolesNeeded.deliveryBoy-currCreeps.deliveryBoy>0 ||
                        rolesNeeded.distributor-currCreeps.distributor>0){
                    const needMiners=rolesNeeded.miner-currCreeps.miner>0;
                    const needDeliverers=rolesNeeded.deliveryBoy-currCreeps.deliveryBoy>0;
                    const needDistributors=rolesNeeded.distributor-currCreeps.distributor>0;

                    if(needMiners && (!needDeliverers || currCreeps.miner<=currCreeps.deliveryBoy) &&
                        (!needDistributors || currCreeps.miner<=currCreeps.distributor)) {
                        MineTime.spawn(availableSpawns[i], room.energyCapacityAvailable, room);
                        rolesNeeded.miner--;
                    }
                    else if(needDeliverers &&
                        (!needDistributors || currCreeps.deliveryBoy<=currCreeps.distributor)) {
                        DeliveryTime.spawn(availableSpawns[i], room.energyCapacityAvailable, room);
                        rolesNeeded.deliveryBoy--;
                    }
                    else {
                        DistributeTime.spawn(availableSpawns[i], room.energyCapacityAvailable, room);
                        rolesNeeded.distributor--;
                    }
                }
                else if(rolesNeeded.upgrader-currCreeps.upgrader>0){
                    UpgradeTime.spawn(availableSpawns[i], room.energyCapacityAvailable, room);
                    rolesNeeded.upgrader--;
                }
                else if(rolesNeeded.builder-currCreeps.builder>0){
                    BuildTime.spawn(availableSpawns[i], room.energyCapacityAvailable, room);
                    rolesNeeded.builder--;
                }
                else if(rolesNeeded.extractor-currCreeps.extractor>0){
                    ExtractTime.spawn(availableSpawns[i], room.energyCapacityAvailable, room);
                    rolesNeeded.extractor--;
                }
                else{
                    if (roomEnergyAvailable < 800) {
                        BuildTime.spawn(availableSpawns[spawnPos], room.energyCapacityAvailable, room);
                    }
                    else
                        break;
                }
            }
        }
    }
};