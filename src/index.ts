import {GameWorld} from "./World/gameworld";

const gameWorld = new GameWorld()
gameWorld.debug();

function loop(){
    gameWorld.update();
    gameWorld.render();
}

setInterval(loop, 1000);
