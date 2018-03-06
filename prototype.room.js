Room.prototype.controllerChange=function(){
    const currLevel=this.memory.level;
    const controllerLevel=this.controller.level;
    const centerX=this.memory.centerX;
    const centerY=this.memory.centerY;
    if(centerX && centerY && currLevel<controllerLevel){
        switch(currLevel){ //TODO: place all appropriate structures into the room
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
            case 8:
                break;
        }
        this.memory.level++;
    }
};