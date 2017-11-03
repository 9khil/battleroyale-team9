const walls = [];
let me, enemy ;

function addWall(wall){
  if (walls.find((item) => {
      return wall.x === item.x && wall.y === item.y;
    })) {
   walls.push(wall);
  }
}

function shouldShoot(){
  if ((me.strength / enemy.weaponDamage) < (enemy.strength / me.weaponDamage)) {
    return false;
  } else {
    return true;
  }
}


function areWeInEnemyRange(body) {
  const me = body.you;
  const enemy = body.enemies.pop();
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
    if (wallsArray.length){
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
    } else if(me.direction === 'left' && enemy.x > me.x) {
      wallsArray = walls.filter(wall => {
        return wall.y === me.y && wall.x < enemy.x && wall.x > me.x;
      });
    }

    if (wallsArray.length){
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
  const me = body.you;
  const enemy = body.enemies.pop();
  let wallsArray = [];
  if (enemy.x === me.x) {
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
      if (enemy.y - me.y < me.weaponRange) {
        return true;
      } else {
        return false;
      }
    }
  } else if (enemy.y === me.y) {
    if (me.direction === 'right' && enemy.x > me.x) {
      wallsArray = walls.filter(wall => {
        return wall.y === me.y && wall.x > me.x && wall.x < enemy.x;
      });
    } else if(me.direction === 'left' && enemy.x < me.x) {
      wallsArray = walls.filter(wall => {
        return wall.y === me.y && wall.x < me.x && wall.x > enemy.x;
      });
    }

    if (wallsArray.length){
      return false;
    } else {
      if (enemy.x - me.x < me.weaponRange) {
        return true;
      } else {
        return false;
      }
    }
  }
};

function doSomethingRandom(){
  var commands = [
    "rotate-right",
    "rotate-left",
    "advance",
    "retreat",
    "shoot"
  ];
  var rnd = Math.floor(Math.random() * 5);

  return commands[rnd];
}

function info(){
  return {
    name: "Mr. Randombird",
    team: "The best team"
  }
}

function action (body){
  return {
    command: doSomethingRandom()
  };
}


function getCommand(body){

  me = body.you;
  enemy = body.enemies.pop();
  const walls = body.walls;

  walls.map(addWall);

}

function getBody(req){
  if (req.query.path === "/command") {

    return  {
      command: getCommand(JSON.parse(req.body))
    };

  }
  if (req.query.path === "/info") {
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

