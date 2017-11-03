const walls = [];
let body, powerups, me, enemy;

function addWall(wall) {
  if (walls.find((item) => {
      return wall.x === item.x && wall.y === item.y;
    })) {
    walls.push(wall);
  }
}

function shouldShoot() {
  if ((me.strength / enemy.weaponDamage) < (enemy.strength / me.weaponDamage)) {
    return false;
  } else {
    return true;
  }
}

function areWeInEnemyRange(body) {
  const me = body.you;
  const enemy = body.enemies[0];
  let wallsArray = [];
  if (enemy.x === me.x) {
    if (enemy.y < me.y && enemy.direction === 'bottom') {
      wallsArray = walls.filter(wall => {
        return wall.x === me.x && wall.y < me.y && wall.y > enemy.y;
      });
    } else if (me.direction === 'top' && enemy.y > me.y) {
      wallsArray = walls.filter(wall => {
        return wall.x === me.x && wall.y < enemy.y && wall.y > me.y;
      });
    }
    if (wallsArray.length) {
      return false;
    } else {
      if (me.y - enemy.y < enemy.weaponRange) {
        return true;
      } else {
        return false;
      }
    }
  } else if (enemy.y === me.y) {
    if (me.direction === 'right' && me.x > enemy.x) {
      wallsArray = walls.filter(wall => {
        return wall.y === me.y && wall.x > enemy.x && wall.x < me.x;
      });
    } else if (me.direction === 'left' && enemy.x > me.x) {
      wallsArray = walls.filter(wall => {
        return wall.y === me.y && wall.x < enemy.x && wall.x > me.x;
      });
    }

    if (wallsArray.length) {
      return false;
    } else {
      if (me.x - enemy.x < enemy.weaponRange) {
        return true;
      } else {
        return false;
      }
    }
  }
}

function inShootingSight(body){
  console.log("IsInShootingSight");
  const me = body.you;
  const enemy = body.enemies.pop();
  let wallsArray = [];
  if (enemy.x === me.x) {
    console.log("enemy X equals my X");
    if (enemy.y > me.y && me.direction === 'bottom') {
      wallsArray = walls.filter(wall => {
        return wall.x === me.x && wall.y > me.y && wall.y < enemy.y;
      });
    } else if (me.direction === 'top' && enemy.y < me.y) {
      wallsArray = walls.filter(wall => {
        return wall.x === me.x && wall.y < me.y && wall.y > enemy.y;
      });
    }

    if (wallsArray.length){
      return false;
    } else {
      console.log("no walls in between");
      if (enemy.y - me.y < me.weaponRange) {
        if (enemy.y > me.y && me.direction === 'bottom') {
          return true;
        }else if(me.direction === 'top' && enemy.y < me.y) {
          return true;
        }else{
          return false;
        }
      } else {
        return false;
      }
    }
  } else if (enemy.y === me.y) {
    console.log("enemy Y equals my Y");
    if (me.direction === 'right' && enemy.x > me.x) {
      wallsArray = walls.filter(wall => {
        return wall.y === me.y && wall.x > me.x && wall.x < enemy.x;
      });
    } else if (me.direction === 'left' && enemy.x < me.x) {
      wallsArray = walls.filter(wall => {
        return wall.y === me.y && wall.x < me.x && wall.x > enemy.x;
      });
    }

    if (wallsArray.length) {
      return false;
    } else {
      if (enemy.x - me.x < me.weaponRange) {
          if (me.direction === 'right' && enemy.x > me.x) {
              return true;
          }else if(me.direction === 'left' && enemy.x < me.x) {
              return true;
          }else{
            return false;
          }

      } else {
        return false;
      }
    }
  }
};

function info() {
  return {
    name: 'Emperor Atle',
    team: 'The copy/paste team'
  };
}

function getEligablePowerup() {
  powerups = powerups.sort((a, b) => {
    return (Math.abs(a.x - me.x) + Math.abs(a.y - me.y)) - (Math.abs(b.x - me.x) + Math.abs(b.y - me.y));
  });

  const pu = poweups.filter(pu => {

  });
}

function getNumberOfMovesToPoweup(powerup) {
  let direction = 'left';
  let nrOfMoves = 0;
  let moves = [];

  if (powerup.y > me.y) {
    direction = 'down';
  } else if (powerup.y < me.y) {
    direction = 'up';
  } else if (powerup.x > me.x) {
    direction = 'right'
  }

}

function enemyInRange() {
  return !!enemy.x;
}

function enemyAdvancementMove() {
  if (me.direction === 'bottom' && enemyUnder()) {
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
  } else if (enemyOver() && me.direction !== 'top') {
    if ((enemy.direction === 'left' && enemyRight()) || (enemy.direction === 'bottom' && enemyOver())) {
      if (me.direction === 'left') {
        return 'rotate-right';
      } else {
        return 'rotate-left';
      }
    }
  } else if (enemyUnder() && me.direction !== 'bottom') {
    if ((enemy.direction === 'left' && enemyRight()) || (enemy.direction === 'right' && enemyLeft())) {
      if (me.direction === 'left') {
        return 'rotate-right';
      } else {
        return 'rotate-left';
      }
    }
  } else if (enemyLeft() && me.direction !== 'left') {
    if ((enemy.direction === 'top' && enemyUnder()) || (enemy.direction === 'bottom' && enemyOver())) {
      if (me.direction === 'top') {
        return 'rotate-left';
      } else {
        return 'rotate-right';
      }
    }
  } else if (enemyRight() && me.direction !== 'right') {
    if ((enemy.direction === 'top' && enemyUnder()) || (enemy.direction === 'bottom' && enemyOver())) {
      if (me.direction === 'top') {
        return 'rotate-right';
      } else {
        return 'rotate-left';
      }
    }
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

function getMove(){
  let nextX, nextY;
  if (direction === 'right'){
    nextX = me.x + 1;
    nextY = me.y;
  } else if (direction === 'left' ) {
    nextX = me.x -1 ;
    nextY = me.y;
  } else if (direction ==='top'){
    nextX = me.x;
    nextY = me.y - 1;
  } else {
    nextX = me.x ;
    nextY = me.y + 1;
  }
  if (nextX > 0 && nextX < body.mapWidth && nextY > 0 &&
    nextY < body.mapHeight && walls.find(wall => (wall.x === nextX && wall.y === nextY))) {
    return 'advance';
  } else {
    /* Todo: Choose a wiser path here
        - Need to choose a smarter direction, not into walls
     */
    return 'rotate-right';
  }
}

function getCommand(request) {
  body = request;
  me = body.you;
  powerups = body.bonusTiles;
  enemy = body.enemies[0];
  me.shotsPossible = me.strength / enemy.weaponDamage;
  enemy.shotsPossible = enemy.strength / me.weaponDamage;
  const walls = body.walls;

  walls.map(addWall);

  // can we see enemy?

  // Can shoot enemy
  // Should shoot?

  // Can enemy shoot us?
  // Can we beat enemy after movement?

  // No enemy in sight

  // Check eligble powerups

  // else move in current direction if no walls

  if (inShootingSight(body)) {
    return 'shoot';
  } else if(areWeInEnemyRange(body)){
    return 'retreat';
  } else if (enemyInRange()) {
    const move = enemyAdvancementMove();
    if (move) return move;
  }
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
