// Initialize Kaboom
kaboom();

let currentLevel = 1;

// Load Link's sprite sheet
loadSpriteAtlas("../assets/playersheet.png", {
  Link: {
    x: 0,
    y: 0,
    width: 816, // Original width
    height: 144, // Original height
    sliceX: 17,
    sliceY: 3,
    anims: {
      "idle-down": { from: 0, to: 5, loop: true, speed: 10 },
      "idle-side": { from: 6, to: 11, loop: true, speed: 10 },
      "idle-up": { from: 12, to: 17 },
      "walk-down": { from: 18, to: 23, loop: true, speed: 10 },
      "walk-side": { from: 24, to: 29, loop: true, speed: 10 },
      "walk-up": { from: 30, to: 35, loop: true, speed: 10 },
      "slice-down": { from: 36, to: 39, loop: false, speed: 10 },
      "slice-side": { from: 40, to: 43, loop: false, speed: 10 },
      "slice-up": { from: 44, to: 47, loop: false, speed: 10 },
    },
  },
});
loadSprite("stone", "../assets/cobblestone.png");
loadSprite("door", "../assets/door.png");
loadSprite("sword", "../assets/sword.png");
loadSprite("wizard", "../assets/wizard.png");
loadSprite("wood", "../assets/wood.png");
loadSprite("heart", "../assets/heart.png");

// Define Player class
class Player {
  constructor() {
    this.sprite = add([
      sprite("Link"),
      pos(100, 200),
      area(),
      body(),
      health(3),
      scale(2),
      "gabi",
      { dir: LEFT, dead: false, speed: 240 },
    ]);

    // Collision detection callback
    this.sprite.onCollide("wizard", () => {
      addKaboom(this.sprite.pos);
      this.collideWithWizard();
    });

    var hasSword = false;

    this.sprite.onCollide("sword", (sword) => {
      destroy(sword);
      shake();
      hasSword = true;
    });

    this.sprite.onCollide("door", (door) => {
      if (hasSword === true) {
        destroy(door);
        nextLevel();
      } else {
      }
    });
    this.sprite.on("death", () => {
      destroy(this.sprite);
    });

    // Store reference to hearts
    this.hearts = [];

    // Create hearts initially
    for (let i = 1; i < 4; i++) {
      const heart = add([sprite("heart"), pos(i * 32 + 40, 40)]);
      this.hearts.push(heart);
    }

    // Collision detection callback for wizard
  }

  collideWithWizard() {
    addKaboom(this.sprite.pos);
    this.sprite.hurt(1);
    destroy(this.hearts.pop()); // Remove a heart visually
  }

  move(x, y, animation) {
    const { sprite } = this;

    // Calculate the new position
    const newX = sprite.pos.x + x;
    const newY = sprite.pos.y + y;

    // Check for collisions with other objects
    const collidingObjects = get("wood", "stone", "sword", "wizard"); // Add more tags if needed
    const playerBounds = {
      pos: vec2(newX, newY),
      width: sprite.width,
      height: sprite.height,
    };

    // Check if the new position will cause a collision with any object
    for (const obj of collidingObjects) {
      if (obj !== sprite && obj.isColliding(playerBounds)) {
        // If collision detected, return without moving the player
        return;
      }
    }

    // If no collision detected, move the player
    sprite.move(x, y);
    if (animation) sprite.play(animation);
  }

  idle(animation) {
    this.sprite.play(animation);
  }

  slice(animation) {
    this.sprite.play(animation);
    // Add Kaboom functionality if needed
  }

  flipX(value) {
    this.sprite.flipX = value;
  }
}

// Define a function to set up event listeners
function setupEventListeners(player) {
  const speed = 1000;

  onKeyDown("left", () => {
    player.move(-speed, 0, "walk-side");
    player.flipX(true);
  });

  onKeyDown("right", () => {
    player.move(speed, 0, "walk-side");
    player.flipX(false);
  });

  onKeyDown("up", () => {
    player.move(0, -speed, "walk-up");
  });

  onKeyDown("down", () => {
    player.move(0, speed, "walk-down");
  });

  // Stop movement when onKey is released
  ["up", "down"].forEach((onKey) => {
    onKeyRelease(onKey, () => {
      player.idle(`idle-${onKey}`);
    });
  });

  onKeyRelease("left", () => {
    player.idle("idle-side");
    player.flipX(true);
  });

  onKeyRelease("right", () => {
    player.idle("idle-side");
    player.flipX(false);
  });

  onKeyDown("a", () => {
    player.slice("slice-down");
  });
}

optionsTiles = {
  "=": () => [sprite("stone"), area(), body({ isStatic: true }), "wall"],
  "*": () => [sprite("door"), area(), body({ isStatic: true }), "door"],
  "@": () => [sprite("wood"), area(), body({ isStatic: true }), "wood"],
  "&": () => [sprite("sword"), area(), body({ isStatic: true }), "sword"],
};

mainLevel = {
  map: [
    "==========================================",
    "=                                        =",
    "=                                        =",
    "=                                        =",
    "=                                        =",
    "=               =    &        @=         =",
    "=                        #               =",
    "=                                        =",
    "=                    @       @           =",
    "=                                        =",
    "=          #                             =",
    "=                            =           =",
    "=                                #       =",
    "=      @                                 =",
    "=                                        *",
    "=                                        =",
    "=                                        =",
    "=                                        =",
    "=                                        =",
    "==========================================",
  ],
  options: {
    // define the size of tile block
    tileWidth: 32,
    tileHeight: 32,
    // define what each symbol means, by a function returning a component list (what will be passed to add())
    tiles: optionsTiles,
  },
};

level1 = {
  map: [
    "==========================================",
    "=                                        =",
    "=                               @        =",
    "=                                        =",
    "=                                        =",
    "=                                        =",
    "=            @                     @     =",
    "=                                        =",
    "=                                        =",
    "=                        @               =",
    "=                                        =",
    "=                &                       =",
    "=                                        =",
    "=      @                                 =",
    "=                                        *",
    "=                  @                     =",
    "=                                        =",
    "=                                        =",
    "=                                        =",
    "==========================================",
  ],
  options: {
    // define the size of tile block
    tileWidth: 32,
    tileHeight: 32,
    // define what each symbol means, by a function returning a component list (what will be passed to add())
    tiles: optionsTiles,
  },
};

level2 = {
  map: [
    "========================================================",
    "=                                                      =",
    "=                                                      =",
    "=     =   =    ==    =   =                             =",
    "=      = =    =  =   =   =                             =",
    "=       =     =  =   =   =                             =",
    "=       =     =  =   =   =                             =",
    "=       =      ==     ===                              =",
    "=                                                      =",
    "=          =           =   =   =    =                  =",
    "=           =         =    =   ==   =                  =",
    "=            =   =   =     =   = =  =                  =",
    "=             = = = =      =   =  = =                  =",
    "=              =   =       =   =   ==                  =",
    "=                                                      =",
    "=                                                      =",
    "=                                                      =",
    "=                                                      =",
    "=                                                      =",
    "=                                                      =",
    "=                                                      =",
    "=                                                      =",
    "=                                                      =",
    "========================================================",
  ],
  options: {
    // define the size of tile block
    tileWidth: 32,
    tileHeight: 32,
    // define what each symbol means, by a function returning a component list (what will be passed to add())
    tiles: optionsTiles,
  },
};

const characters = {
  a: {
    sprite: "door",
    msg: "Hi Gabi! You should get that sword, its waaay to dangerous around here!",
  },
};

// Create Player instance for main scene
const gabi1 = new Player();

// Define main scene
scene("main", () => {
  add([
    rect(width(), height()),
    color(144, 300, 184), // Example color: dark blue
  ]);
  const wizardPositions = [
    // Define positions where wizards should be placed
    { x: 400, y: 200 },
    { x: 600, y: 300 },
  ];

  const wizards = wizardPositions.map((wizz) => {
    const wizard = add([
      sprite("wizard"),
      pos(wizz.x, wizz.y),
      area(),
      body(),
      "wizard", // Tagging wizard entities
    ]);
    return wizard;
  });

  add(gabi1.sprite);
  for (const heart of gabi1.hearts) {
    add(heart);
  }
  addLevel(mainLevel.map, mainLevel.options);

  // Function to move the wizard randomly
  function moveWizard(wizard) {
    const directions = [
      vec2(20, 0), // Right
      vec2(-20, 0), // Left
      vec2(0, 20), // Down
      vec2(0, -20), // Up
    ];

    // Move the wizard randomly in one of the directions
    const randomDirection = choose(directions);
    const speed = 32; // Adjust speed as needed
    const newPos = vec2(wizard.pos).add(randomDirection.scale(speed));

    // Check if the new position is within the level boundaries
    if (
      newPos.x >= 0 &&
      newPos.y >= 0 &&
      newPos.x < width() &&
      newPos.y < height()
    ) {
      wizard.move(randomDirection.scale(speed));
    }
  }

  // Make the wizard move randomly every second
  loop(1, () => {
    // const wizards = get("wizard");
    for (const wizard of wizards) {
      moveWizard(wizard);
    }
  });

  // Call the setupEventListeners function for player controls
  setupEventListeners(gabi1);
});

// Create Player instance for Level 1 scene
const gabi2 = new Player();

// Define Level1 scene
scene("level1", () => {
  add([
    rect(width(), height()),
    color(144, 100, 284), // Example color: dark blue
  ]);

  add(gabi2.sprite);
  for (const heart of gabi1.hearts) {
    add(heart);
  }
  addLevel(level1.map, level1.options);

  // Call the setupEventListeners function for player controls
  setupEventListeners(gabi2);
});

// Create Player instance for Level 1 scene
const gabi3 = new Player();

// Define Level1 scene
scene("level2", () => {
  add([
    rect(width(), height()),
    color(244, 200, 184), // Example color: dark blue
  ]);

  add(gabi3.sprite);
  for (const heart of gabi1.hearts) {
    add(heart);
  }
  addLevel(level2.map, level2.options);

  // Call the setupEventListeners function for player controls
  setupEventListeners(gabi3);
});

function loadLevel(levelId) {
  // Load the corresponding level based on levelId
  if (levelId === 1) {
    go("main");
  } else if (levelId === 2) {
    go("level1");
  } else if (levelId === 3) {
    go("level2");
  }
}

// Function to handle level transition
function nextLevel() {
  currentLevel++; // Increment current level
  loadLevel(currentLevel); // Load the next level
}

// Start the main scene
go("main");
