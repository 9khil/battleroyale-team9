const pathfindah = require('./pathfindah.js');

var walls = [];
let body, powerups, me, enemy, grid;

function addWall(wall) {
  if (walls.find((item) => {
      return wall.x === item.x && wall.y === item.y;
    })) {
    walls.push(wall);
  }
}

function shouldShoot() {
  if (me.shotsPossible < enemy.shotsPossible) {
    return false;
  } else {
    return true;
  }
}

function areWeInEnemyShootingSight(body) {
  const me = body.you; // fjerne?
  const enemy = body.enemies[0]; // fjerne?

  if(typeof enemy === "undefined"){
    return false;
  }

  let wallsArray = [];
  if (enemy.x === me.x) {
    if (enemyOver() && enemy.direction === 'bottom') {
      wallsArray = walls.filter(wall => {
        return wall.x === me.x && wall.y < me.y && wall.y > enemy.y;
      });
    } else if (enemy.direction === 'top' && enemyUnder()) {
      wallsArray = walls.filter(wall => {
        return wall.x === me.x && wall.y < enemy.y && wall.y > me.y;
      });
    }
    if (wallsArray.length) {
      return false;
    } else {
      if (me.y - enemy.y < enemy.weaponRange && ((enemyOver() && enemy.direction === 'bottom') || (enemy.direction === 'top' && enemyUnder()))) {
        return true;
      } else {
        return false;
      }
    }
  } else if (enemy.y === me.y) {
    if (enemy.direction === 'right' && enemyLeft()) {
      wallsArray = walls.filter(wall => {
        return wall.y === me.y && wall.x > enemy.x && wall.x < me.x;
      });
    } else if (enemy.direction === 'left' && enemyRight()) {
      wallsArray = walls.filter(wall => {
        return wall.y === me.y && wall.x < enemy.x && wall.x > me.x;
      });
    }

    if (wallsArray.length) {
      return false;
    } else {
      if (me.x - enemy.x < enemy.weaponRange && ((enemy.direction === 'right' && enemyLeft()) || (enemy.direction === 'left' && enemyRight()))) {
        return true;
      } else {
        return false;
      }
    }
  }
}

function enemyInOurShootingSight(body){
  console.log("IsInShootingSight");
  const me = body.you; // fjerne?
  const enemy = body.enemies[0]; // fjerne?

  if(typeof enemy === "undefined"){
    return false;
  }

  let wallsArray = [];
  if (enemy.x === me.x) {
    console.log("enemy X equals my X");
    if (enemyUnder() && me.direction === 'bottom') {
      wallsArray = walls.filter(wall => {
        return wall.x === me.x && wall.y > me.y && wall.y < enemy.y;
      });
    } else if (me.direction === 'top' && enemyOver()) {
      wallsArray = walls.filter(wall => {
        return wall.x === me.x && wall.y < me.y && wall.y > enemy.y;
      });
    }

    if (wallsArray.length){
      return false;
    } else {
      console.log("no walls in between");
      if (enemy.y - me.y < me.weaponRange && ((enemyUnder() && me.direction === 'bottom') || (me.direction === 'top' && enemyOver()))) {
        return true;
      } else {
        return false;
      }
    }
  } else if (enemy.y === me.y) {
    console.log("enemy Y equals my Y");
    if (me.direction === 'right' && enemyRight()) {
      wallsArray = walls.filter(wall => {
        return wall.y === me.y && wall.x > me.x && wall.x < enemy.x;
      });
    } else if (me.direction === 'left' && enemyLeft()) {
      wallsArray = walls.filter(wall => {
        return wall.y === me.y && wall.x < me.x && wall.x > enemy.x;
      });
    }

    if (wallsArray.length) {
      return false;
    } else {
      if (enemy.x - me.x < me.weaponRange && ((me.direction === 'right' && enemyRight()) || (me.direction === 'left' && enemyLeft()))) {
        return true;
      } else {
        return false;
      }
    }
  }
  return false;
};

function info() {
  return {
    name: 'Emperor Atle',
    team: 'The copy/paste team'
  };
}

function getEligablePowerup() {
  powerups = powerups.sort((a, b) => {
    // const pathA = getPath(a);
    // const pathB = getPath(b);
    // if (pathA.length > pathB.length) {
    //   return 1 ;
    // } else if (pathA.length === pathB.length){
    //   return 0;
    // }
    // return -1;
    return (Math.abs(a.x - me.x) + Math.abs(a.y - me.y)) - (Math.abs(b.x - me.x) + Math.abs(b.y - me.y));
  });

  return powerups.length ? powerups[0] : null;
}

function getMoveTowardsPowerup(powerup) {
  const path = getPath(powerup);
  const move = path[0];
  if (move === me.direction) {
    return 'advance';
  } else {
    if ((me.direction === 'top' || me.direction === 'bottom') && move === 'left') return 'rotate-left';
    if ((me.direction === 'top' || me.direction === 'bottom') && move === 'right') return 'rotate-right';
    if ((me.direction === 'left' || me.direction === 'right') && move === 'up') return 'rotate-right';
    if ((me.direction === 'left' || me.direction === 'right') && move === 'bottom') return 'rotate-left';
    return 'rotate-left';
  }
}

function enemyInRange() {
  return !!enemy.x;
}

function enemyAdvancementMove() {
  console.log("enemyAdvancementMove");
  if (me.direction === 'bottom' && enemyUnder()) {
    console.log("bottom and under");
    if (enemyRight() && enemy.direction === 'left') {
      return 'shoot';
    } else if (enemyLeft() && enemy.direction === 'right') {
      return 'shoot';
    }
  } else if(me.direction === 'top' && enemyOver()) {
    if (enemyRight() && enemy.direction === 'left') {
      return 'shoot';
    } else if (enemyLeft() && enemy.direction === 'right') {
      return 'shoot';
    }
  } else if(me.direction === 'left' && enemyLeft()){
    if (enemyOver() && enemy.direction === 'bottom') {
      return 'shoot';
    } else if (enemyUnder() && enemy.direction === 'top') {
      return 'shoot';
    }
  } else if (me.direction === 'right' && enemyRight()){
    if (enemyOver() && enemy.direction === 'bottom') {
      return 'shoot';
    } else if (enemyUnder() && enemy.direction === 'top') {
      return 'shoot';
    }
  }

  if (enemyOver() && me.direction !== 'top') {

    if(me.direction === 'left'){
      return 'rotate-right';
    }
    else{
      return 'rotate-left';
    }

    /*if ((enemy.direction === 'left' && enemyRight()) || (enemy.direction === 'bottom' && enemyOver())) {
      if (me.direction === 'left') {
        return 'rotate-left';
      } else {
        return 'rotate-right';
      }*/

  } else if (enemyUnder() && me.direction !== 'bottom') {
    //if ((enemy.direction === 'left' && enemyRight()) || (enemy.direction === 'right' && enemyLeft())) {
      if (me.direction === 'left') {
        return 'rotate-left';
      } else {
        return 'rotate-right';
      }
    //}
  } else if (enemyLeft() && me.direction !== 'left') {
  //  if ((enemy.direction === 'top' && enemyUnder()) || (enemy.direction === 'bottom' && enemyOver())) {
      if (me.direction === 'top') {
        return 'rotate-left';
      } else {
        return 'rotate-right';
      }
  //  }
  } else if (enemyRight() && me.direction !== 'right') {
  //  if ((enemy.direction === 'top' && enemyUnder()) || (enemy.direction === 'bottom' && enemyOver())) {
      if (me.direction === 'top') {
        return 'rotate-right';
      } else {
        return 'rotate-left';
      }
  //  }
  }

  return null;
}

function enemyOver(){
  return me.y > enemy.y;
}

function enemyUnder() {
  return me.y < enemy.y;
}

function enemyLeft() {
  return me.x > enemy.x;
}

function enemyRight(){
  return me.x < enemy.x;
}

function getRetreatMove(body){
  let nextX, nextY;
  if (me.direction === 'right'){
    nextX = me.x - 1;
    nextY = me.y;
  } else if (me.direction === 'left' ) {
    nextX = me.x + 1 ;
    nextY = me.y;
  } else if (me.direction ==='top'){
    nextX = me.x;
    nextY = me.y + 1;
  } else {
    nextX = me.x ;
    nextY = me.y - 1;
  }
  let tempBody = body;

  tempBody.you.x = nextX;
  tempBody.you.y = nextY;
  if (!areWeInEnemyShootingSight(tempBody) && nextX > 0 && nextX < body.mapWidth && nextY > 0 &&
    nextY < body.mapHeight && !walls.find(wall => (wall.x === nextX && wall.y === nextY))) {
      return 'retreat';
  } else if(me.direction === 'bottom') {
    if(!walls.find(wall => (wall.x === me.x + 1 && wall.y === me.y))){
      return 'rotate-right';
    } else if (!walls.find(wall => (wall.x === me.x - 1 && wall.y === me.y))) {
      return 'rotate-left';
    }
  } else if (me.direction === 'top') {
    if(!walls.find(wall => (wall.x === me.x + 1 && wall.y === me.y))){
        return 'rotate-left';
    } else if (!walls.find(wall => (wall.x === me.x - 1 && wall.y === me.y))){
      return 'rotate-right';
    }
  } else if (me.direction === 'left') {
    if(!walls.find(wall => (wall.x === me.x && wall.y === me.y + 1))){
      return 'rotate-right';
    } else if (!walls.find(wall => (wall.x === me.x && wall.y === me.y - 1))) {
      return 'rotate-left';
    }
  } else if (me.direction === 'right') {
    if(!walls.find(wall => (wall.x === me.x && wall.y === me.y + 1))) {
      return 'rotate-left';
    } else if (!walls.find(wall => (wall.x === me.x && wall.y === me.y - 1))) {
      return 'rotate-right';
    }
  }
}

function getMove(){
  let nextX, nextY;
  if (me.direction === 'right'){
    nextX = me.x + 1;
    nextY = me.y;
  } else if (me.direction === 'left' ) {
    nextX = me.x -1 ;
    nextY = me.y;
  } else if (me.direction ==='top'){
    nextX = me.x;
    nextY = me.y - 1;
  } else {
    nextX = me.x ;
    nextY = me.y + 1;
  }

  console.log(walls);
  console.log(walls.filter(wall => (wall.x === nextX && wall.y === nextY)));

  if (nextX > 0 && nextX < body.mapWidth && nextY > 0 &&
    nextY < body.mapHeight && !walls.find(wall => (wall.x === nextX && wall.y === nextY))) {
    return 'advance';
  } else {
    /* Todo: Choose a wiser path here
        - Need to choose a smarter direction, not into walls
     */
    return 'rotate-right';
  }
}

// Finner korteste vei til "destination" - unngår vegger.
function getPath(destination) {
  grid = pathfindah.createGrid(body, walls, destination);
  return pathfindah.findShortestPath(me, grid);
}

function getCommand(request) {
  body = request;
  me = body.you;
  powerups = body.bonusTiles;
  enemy = body.enemies[0];
  me.shotsPossible = me.strength / enemy.weaponDamage;
  enemy.shotsPossible = enemy.strength / me.weaponDamage;
  walls = body.walls;

  walls.map(addWall);



  // can we see enemy?

  // Can shoot enemy
  // Should shoot?

  // Can enemy shoot us?
  // Can we beat enemy after movement?

  // No enemy in sight

  // Check eligble powerups

  // else move in current direction if no walls

  if(enemyInRange()){
    console.log("enemy is in range");
    if (enemyInOurShootingSight(body) && !areWeInEnemyShootingSight(body)) {
      return 'shoot';
    } else if (enemyInOurShootingSight(body) && areWeInEnemyShootingSight(body) && shouldShoot()) {
      return 'shoot';
    } else if(areWeInEnemyShootingSight(body)){
      return getRetreatMove(body);
    }
    const move = enemyAdvancementMove();
    if (move) return move;

  }

  let powerup = getEligablePowerup();
  if (powerup) {
    console.log('moving towards powerup at', powerup);
    return getMoveTowardsPowerup(powerup);
  }

  var random = Math.random(0,10);
  if(random < 3){
    return "(ಠ_ಠ)┌∩┐";
  }

  console.log("not in range. random move");

  return getMove();
}

function getBody(req) {
  if (req.query.path === '/command') {
    if (typeof req.body == 'object') {
      return {
        command: getCommand(req.body)
      };
    } else {
      return {
        command: getCommand(JSON.parse(req.body))
      };
    }

  }
  if (req.query.path === '/info') {
    return info();
  }
}

module.exports = function (context, req) {

  context.log('JavaScript HTTP trigger function processed a request.', req.body);
  context.res = {
    body: getBody(req)
  };
  context.done();
};
