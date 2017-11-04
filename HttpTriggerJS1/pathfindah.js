function findShortestPath(startCoordinates, grid) {
  let y = startCoordinates.y;
  let x = startCoordinates.x;

  let location = {
    y: y,
    x: x,
    path: [],
    status: 'Start'
  };

  // Initialize the queue with the start location already inside
  let queue = [location];

  // Loop through the grid searching for the goal
  while (queue.length > 0) {
    // Take the first location off the queue
    let currentLocation = queue.shift();

    let newLocation = exploreInDirection(currentLocation, 'top', grid);
    if (newLocation.status === 'Goal') {
      return newLocation.path;
    } else if (newLocation.status === 'Valid') {
      queue.push(newLocation);
    }

    // Explore right
    newLocation = exploreInDirection(currentLocation, 'right', grid);
    if (newLocation.status === 'Goal') {
      return newLocation.path;
    } else if (newLocation.status === 'Valid') {
      queue.push(newLocation);
    }

    // Explore bottom
    newLocation = exploreInDirection(currentLocation, 'bottom', grid);
    if (newLocation.status === 'Goal') {
      return newLocation.path;
    } else if (newLocation.status === 'Valid') {
      queue.push(newLocation);
    }

    // Explore left
    newLocation = exploreInDirection(currentLocation, 'left', grid);
    if (newLocation.status === 'Goal') {
      return newLocation.path;
    } else if (newLocation.status === 'Valid') {
      queue.push(newLocation);
    }
  }

  return false;
}

// This function will check a location's status
// (a location is "valid" if it is on the grid, is not an "wall",
// and has not yet been visited by our algorithm)
// Returns "Valid", "Invalid", "Blocked", or "Goal"
function locationStatus(location, grid) {
  let gridSize = grid.length;
  let dft = location.y;
  let dfl = location.x;

  if (location.x < 0 ||
    location.x >= gridSize ||
    location.y < 0 ||
    location.y >= gridSize) {

    // location is not on the grid--return false
    return 'Invalid';
  } else if (grid[dft][dfl] === 'Goal') {
    return 'Goal';
  } else if (grid[dft][dfl] !== 'Empty') {
    // location is either an wall or has been visited
    return 'Blocked';
  } else {
    return 'Valid';
  }
}

// Explores the grid from the given location in the given
// direction
function exploreInDirection(currentLocation, direction, grid) {
  let newPath = currentLocation.path.slice();
  newPath.push(direction);

  let dft = currentLocation.y;
  let dfl = currentLocation.x;

  if (direction === 'top') {
    dft -= 1;
  } else if (direction === 'right') {
    dfl += 1;
  } else if (direction === 'bottom') {
    dft += 1;
  } else if (direction === 'left') {
    dfl -= 1;
  }

  let newLocation = {
    y: dft,
    x: dfl,
    path: newPath,
    status: 'Unknown'
  };
  newLocation.status = locationStatus(newLocation, grid);

  // If this new location is valid, mark it as 'Visited'
  if (newLocation.status === 'Valid') {
    grid[newLocation.y][newLocation.x] = 'Visited';
  }

  return newLocation;
}

function createGrid(body, walls, destination) {
  const grid = [];
  for (let i = 0; i < body.mapHeight; i++) {
    grid[i] = [];
    for (let j = 0; j < body.mapWidth; j++) {
      grid[i][j] = 'Empty';
    }
  }
  walls.forEach(wall => {
    grid[wall.y][wall.x] = 'wall';
  });

  grid[destination.y][destination.x] = 'Goal';

  return grid;
}

module.exports = {
  createGrid: createGrid,
  findShortestPath: findShortestPath
};
