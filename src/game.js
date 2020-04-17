/** @typedef {import('phaser')} Phaser */
import settings from "./settings.js";
import { Map } from "./map.js";
import IsoPlugin from "./phaser3-plugin-isometric/IsoPlugin.js";
import IsoSprite from "./phaser3-plugin-isometric/IsoSprite.js";
import EnhancedIsoSprite from "./EnhancedIsoSprite.js";
import { sortByVisited } from "./helpers.js";
import { sortForEnemies } from "./helpers.js";
import { sortOutChests } from "./helpers.js";
import { sortByDistance } from "./helpers.js";
import { ObjectConfig } from "./objectConfig.js";
/* +x is down to right, +y is down to left */
// @ts-ignore

export class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameScene",
      mapAdd: { isoPlugin: "iso" },
    });
    this.canvas = document.querySelector("canvas");
    this.power = 50;
    this.targetIndex = -1;
    this.speaker = window.speechSynthesis;
    this.levelCompleted = false;
    this.level = 0;
    this.sound = /** @type {Phaser.Sound.WebAudioSoundManager} */ (super.sound);

    // used in one switch
    this.oneSwitchHandler = null;
  }

  preload() {
    this.load.scenePlugin({
      key: "IsoPlugin",
      url: IsoPlugin,
      sceneKey: "iso",
    });

    this.load.atlas(
      "hero",
      "assets/animations/Knight/Knight.png",
      "assets/animations/Knight/Knight.json"
    );
    this.load.atlas(
      "explosion",
      "assets/animations/explosion/explosion.png",
      "assets/animations/explosion/explosion.json"
    );
    this.load.atlas(
      "coin",
      "assets/animations/coin/coin.png",
      "assets/animations/coin/coin.json"
    );
    this.load.atlas(
      "dragon",
      "assets/animations/dragon/dragon.png",
      "assets/animations/dragon/dragon.json"
    );
    this.load.atlas(
      "ogre",
      "assets/animations/ogre/ogre.png",
      "assets/animations/ogre/ogre.json"
    );
    this.load.atlas(
      "slime",
      "assets/animations/slime/slime.png",
      "assets/animations/slime/slime.json"
    );
    this.load.atlas(
      "poisin",
      "assets/animations/poisin/poisin.png",
      "assets/animations/poisin/poisin.json"
    );
    this.load.atlas(
      "ghost",
      "assets/animations/ghost/ghost.png",
      "assets/animations/ghost/ghost.json"
    );
    this.load.atlas(
      "medusa",
      "assets/animations/medusa/medusa.png",
      "assets/animations/medusa/medusa.json"
    );
    this.load.atlas(
      "lava_monster",
      "assets/animations/lava_monster/lava_monster.png",
      "assets/animations/lava_monster/lava_monster.json"
    );
    this.load.atlas(
      "troll",
      "assets/animations/troll/troll.png",
      "assets/animations/troll/troll.json"
    );
    this.load.atlas(
      "ice_bullets",
      "assets/animations/ice_bullets/ice_bullets.png",
      "assets/animations/ice_bullets/ice_bullets.json"
    );
    this.load.atlas(
      "dark_bullets",
      "assets/animations/dark_bullets/dark_bullets.png",
      "assets/animations/dark_bullets/dark_bullets.json"
    );
    this.load.atlas(
      "lava_ball",
      "assets/animations/lava_ball/lava_ball.png",
      "assets/animations/lava_ball/lava_ball.json"
    );

    this.load.image("Chest1_closed", "assets/objects/Chest1_closed.png");
    this.load.image("Chest2_closed", "assets/objects/Chest2_closed.png");
    this.load.image("Chest1_opened", "assets/objects/Chest1_opened.png");
    this.load.image("Chest2_opened", "assets/objects/Chest2_opened.png");
    this.load.image("cupcake", "assets/isometric-food/cupcake_NE.png");
    this.load.image("door", "assets/game_pieces/door.png");
    this.load.image("dragon_skeleton", "assets/objects/dragon_skeleton.png");
    this.load.image("flag", "assets/kenny-isometric/flag_NE.png");
    this.load.image("fountain", "assets/objects/fountain.png");
    this.load.image("ground", "assets/game_pieces/cube.png");
    this.load.image("jewel", "assets/kenny-isometric/jewel_NE.png");
    this.load.image("key", "assets/kenny-isometric/key_SW.png");
    this.load.image("lever", "assets/kenny-isometric/lever_NW.png");
    this.load.image("mushrooms", "assets/objects/mushrooms.png");
    this.load.image("arrow", "assets/objects/arrow.png");
    this.load.image("apple", "assets/objects/apple.png");
    this.load.image("bittenApple", "assets/objects/bittenApple.png");
    this.load.image("arrow_left", "assets/objects/arrow_left.png");
    this.load.image("arrow_right", "assets/objects/arrow_right.png");
    this.load.image("arrow_up", "assets/objects/arrow_up.png");
    this.load.image("arrow_down", "assets/objects/arrow_down.png");
    this.load.image(
      "over_grass_flower1",
      "assets/objects/over_grass_flower1.png"
    );
    this.load.image("particle", "assets/animations/particle.png");
    this.load.image("Rock_1", "assets/objects/Rock_1.png");
    this.load.image("Rock_2", "assets/objects/Rock_2.png");
    this.load.image("ruby", "assets/objects/ruby.png");
    this.load.image("sapphire", "assets/objects/sapphire.png");
this.load.image("banana", "assets/objects/banana.png");
this.load.image("lollypop", "assets/objects/lollypop.png");
this.load.image("burger", "assets/objects/burger.png");
this.load.image("cake", "assets/objects/cake.png");
this.load.image("cherries", "assets/objects/cherries.png");
this.load.image("milk", "assets/objects/milk.png");
this.load.image("cookie", "assets/objects/cookie.png");
this.load.image("donut", "assets/objects/donut.png");
this.load.image("popsicle", "assets/objects/popsicle.png");
this.load.image("sundae", "assets/objects/sundae.png");
this.load.image("grapes", "assets/objects/grapes.png");
this.load.image("icecream", "assets/objects/icecream.png");
this.load.image("pizza", "assets/objects/pizza.png");

    this.load.audio("ghost", "assets/audio/ghost.wav");
    this.load.audio("ghost_scream", "assets/audio/ghost_scream.mp3");
    this.load.audio("background_music", "assets/audio/background_music.mp3");
    this.load.audio("cha_ching", "assets/audio/cha_ching.mp3");
    this.load.audio("click", "assets/audio/click.mp3");
    this.load.audio("ding", "assets/audio/ding.mp3");
    this.load.audio("bite", "assets/audio/bite.wav");
    this.load.audio("door_close", "assets/audio/door_close.mp3");
    this.load.audio("dragon_roar", "assets/audio/dragon_roar.mp3");
    this.load.audio("footsteps", "assets/audio/footsteps.mp3");
    this.load.audio("hero", "assets/audio/ta_da.mp3");
    this.load.audio("knock", "assets/audio/knock.mp3");
    this.load.audio("power_increase", "assets/audio/power_increase.wav");
    this.load.audio("roar", "assets/audio/roar.wav");
    this.load.audio("sword_slice", "assets/audio/sword_slice.wav");
    this.load.audio("thump", "assets/audio/thump.mp3");
    this.load.audio("unsheath_sword", "assets/audio/unsheath_sword.mp3");
    this.load.audio("scream", "assets/audio/scream.mp3");
    this.load.audio("medusa", "assets/audio/medusa.wav");
    this.load.audio("arrow", "assets/audio/arrow.wav");
    this.load.audio("sonic_bullets", "assets/audio/sonic_bullets.wav");
    this.load.audio("awkward", "assets/audio/awkward.mp3");
    this.load.audio("bounce_powerup", "assets/audio/bounce_powerup.wav");
    this.load.audio("chimes_powerup", "assets/audio/chimes_powerup.wav");
    this.load.audio("failed_powerdown", "assets/audio/failed_powerdown.wav");
    this.load.audio("magical_falling", "assets/audio/magical_falling.mp3");
    this.load.audio("slay_dragon", "assets/audio/slay_dragon.wav");
    this.load.audio("sonic_powerup", "assets/audio/sonic_powerup.wav");
    this.load.audio("space_powerup", "assets/audio/space_powerup.wav");
    this.load.audio("timpani_failure", "assets/audio/timpani_failure.mp3");
    this.load.audio("applause", "assets/audio/applause.wav");
    this.load.audio("jewel", "assets/audio/jewel.wav");
    this.load.audio("waterfall", "assets/audio/waterfall.m4a");
    this.load.audio("slurp", "assets/audio/slurp.m4a");
     this.load.audio("lick", "assets/audio/lick.m4a");
    this.load.audio("yum", "assets/audio/yum.wav");
    this.load.audio(
      "troubled_powerdown",
      "assets/audio/troubled_powerdown.wav"
    );
    this.load.audio("fireball", "assets/audio/fireball.wav");
     this.load.audio("drink", "assets/audio/drink.wav");
    this.load.audio("deep_scream", "assets/audio/deep_scream.wav");
    this.load.audio("stomping", "assets/audio/stomping.wav");
    this.load.audio("uh_oh", "assets/audio/uh_oh.wav");
    this.load.audio("slime", "assets/audio/slime.wav");
    this.load.audio("open_door", "assets/audio/open_door.wav");
  }

  create() {
    this.isoGroup = this.add.group();
    this.objectConfig = new ObjectConfig();
    this.map = new Map({
      seed: settings.fixedGame ? "Abcd" : null,
      size: [100, 100],
      rooms: {
        initial: {
          min_size: [4, 4],
          max_size: [6, 6],
          max_exits: 2,
        },
        any: {
          min_size: [4, 4],
          max_size: [10, 10],
          max_exits: 3,
        },
      },
      max_corridor_length: 0,
      min_corridor_length: 0,
      corridor_density: 0.0, //corridors per room
      symmetric_rooms: false, // exits must be in the center of a wall if true
      interconnects: 0, //extra corridors to connect rooms and make circular paths. not 100% guaranteed
      max_interconnect_length: 10,
      room_count: 10,
    });
    this.objectsOnLevel = [];
    this.enemy = this.objectConfig.enemies[this.level];
    this.directions = [
      "x-1y-1",
      "x+0y-1",
      "x+1y-1",
      "x-1y+0",
      "x+0y+0",
      "x+1y+0",
      "x-1y+1",
      "x+0y+1",
      "x+1y+1",
    ];

    this.lowPowerIndex = 0;
    this.lowPowerDescriptions = [
      "Low power",
      "Get objects before challenging " + this.enemy + "s",
      "Insufficient power",
    ];

    this.objectConfig.objects[this.level].push(this.enemy);

    this.RandomlyPlacedObjects = !settings.includeObstacles
      ? this.objectConfig.objects[this.level].filter((obj) => obj != "ogre")
      : this.objectConfig.objects[this.level];

    let { x: ix, y: iy } = this.map.initial_position;

    this.room = this.map.initial_room;
    this.previousExit = null;
    this.tiles = [];
    this.acquiredObjects = [];
    this.enemiesDealtWith = 0;
    this.visitedRooms = [this.room];
    let numRooms = this.map.rooms.length;
    let roomIndex = 0;
    let noEnemies = true;
    let noKey = true;
    this.map.rooms.forEach((room) => {
      let objects = [...Phaser.Math.RND.shuffle(this.RandomlyPlacedObjects)];
      /* I bet this can be done by looking at the height of the images */
      this.anims.create({
        key: "coin",
        frames: this.anims.generateFrameNames("coin"),
        frameRate: 2,
        repeat: -1,
      });
      this.anims.create({
        key: "dragon",
        frames: this.anims.generateFrameNames("dragon"),
        frameRate: 2,
        repeat: -1,
      });
      this.anims.create({
        key: "ogre",
        frames: this.anims.generateFrameNames("ogre"),
        frameRate: 4,
        repeat: -1,
      });
      this.anims.create({
        key: "slime",
        frames: this.anims.generateFrameNames("slime"),
        frameRate: 4,
        repeat: 0,
      });
      this.anims.create({
        key: "poisin",
        frames: this.anims.generateFrameNames("poisin"),
        frameRate: 4,
        repeat: 0,
      });
      this.anims.create({
        key: "ghost",
        frames: this.anims.generateFrameNames("ghost"),
        frameRate: 4,
        repeat: -1,
      });
      this.anims.create({
        key: "medusa",
        frames: this.anims.generateFrameNames("medusa"),
        frameRate: 4,
        repeat: -1,
      });
      this.anims.create({
        key: "troll",
        frames: this.anims.generateFrameNames("troll"),
        frameRate: 4,
        repeat: -1,
      });
      this.anims.create({
        key: "lava_monster",
        frames: this.anims.generateFrameNames("lava_monster"),
        frameRate: 4,
        repeat: -1,
      });
      this.anims.create({
        key: "ice_bullets",
        frames: this.anims.generateFrameNames("ice_bullets"),
        frameRate: 4,
        repeat: -1,
      });
      this.anims.create({
        key: "dark_bullets",
        frames: this.anims.generateFrameNames("dark_bullets"),
        frameRate: 4,
        repeat: -1,
      });
      this.anims.create({
        key: "lava_ball",
        frames: this.anims.generateFrameNames("lava_ball"),
        frameRate: 4,
        repeat: -1,
      });
      this.levelJustStarted = true;
      let positions = this.generateObjectPositions(room);
      // remove the player position
      positions = positions.filter(([px, py]) => px != ix || py != iy);
      positions = Phaser.Math.RND.shuffle(positions);
      const numObjects = Phaser.Math.RND.between(1, 2);
      for (let i = 0; i < numObjects; i++) {
        if (!positions.length) {
          break;
        }
        if (roomIndex == numRooms - 1 && noEnemies) {
          // make sure each level has at least one enemy
          objects.pop();
          objects.push(this.enemy);
        }
        if (this.level >= 3 && roomIndex == numRooms -2 && noKey){
          objects.pop();
          objects.push("key");
        }
        /// remove the position of the player
        let o = objects.pop();

        let maxCountOfObject = this.objectConfig.frequencies[o];
        if (
          this.objectsOnLevel.filter((obj) => obj == o).length >=
          maxCountOfObject
        ) {
          // pick a new one
          o = Phaser.Math.RND.shuffle(
            this.objectConfig.objectsNoLimit[this.level]
          )[0];
        }
        if (o == this.enemy) {
          noEnemies = false;
        } else if(o.description == "key"){
          noKey = false;
        }
        let [ox, oy] = positions.pop();
        let isoObj = new EnhancedIsoSprite({
          scene: this,
          x: ox,
          y: oy,
          z: this.objectConfig.heights[o],
          texture: o,
          group: this.isoGroup,
          description: this.objectConfig.descriptions[o],
          power: this.objectConfig.power[o] || 0,
          room: room,
          audio: this.objectConfig.audio[o],
          animation: this.objectConfig.animations[o],
          isCollectible: this.objectConfig.isCollectible[o],
          isAnimated: this.objectConfig.isAnimated[o],
        });
        this.objectsOnLevel.push(o);
        
        isoObj.scale = Math.sqrt(3) / isoObj.width;

        if (isoObj.isAnimated) {
          isoObj.play(isoObj.description, true);
        }
        this.map.addObject(isoObj, ox, oy);
        // eliminate this position and its neighbors
        positions = positions.filter(
          ([px, py]) => Math.hypot(px - ox, py - oy) > 1
        );
      }
      roomIndex++;
    });

    let { width, height } = this.map.size;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (!this.map.walkable(x, y)) continue;
        // @ts-ignore
        let tile = this.add.isoSprite(x, y, -1, "ground", this.isoGroup);
        tile.scale = Math.sqrt(3) / tile.width;
        this.tiles.push(tile);
      }
    }

    // @ts-ignore
    var hero = this.add.isoSprite(ix, iy, 0, "hero", this.isoGroup, null);

    for (var direction of this.directions) {
      this.anims.create({
        key: direction,
        frames: this.anims.generateFrameNames("hero", {
          prefix: direction + "_",
          end: 9,
          zeroPad: 2,
        }),
        frameRate: 20,
        repeat: -1,
      });
    }
    this.player = hero;

    this.anims.create({
      key: "explosion",
      frames: this.anims.generateFrameNames("explosion", {
        prefix: "Explosions_Left-animation_",
        suffix: ".png",
        start: 0,
        end: 15,
      }),
      frameRate: 4,
      repeat: 0,
    });

    this.player.scale = (0.6 * Math.sqrt(3)) / this.player.width;
    this.lighting();

    // @ts-ignore
    this.selectionIndicator = this.add.isoSprite(
      this.player.isoX,
      this.player.isoY,
      0.01,
      "door",
      this.isoGroup,
      null
    );
    this.selectionIndicator.alpha = 0.8;
    this.selectionIndicator.visible = false;
    this.selectionIndicator.scale =
      Math.sqrt(3) / this.selectionIndicator.width;

    // put these last so the come out on top
    this.particles = this.add.particles("particle");
    this.emitter = this.particles.createEmitter({
      angle: { min: 0, max: 360 },
      speed: { min: 0.5, max: 40.0 },
      quantity: { min: 40, max: 400 },
      lifespan: { min: 200, max: 500 },
      alpha: { start: 1, end: 0 },
      scale: 0.05,
      rotate: { start: 0, end: 360 },
      on: false,
    });
    this.particles.depth = 100;

    // configure the camera
    // I'm making the camera follow the selection box and it follows the
    // player when the player moves. I'm using this hack to keep the selection
    // in view without too much motion. I still think it could be better.
    this.cameras.main.setZoom(38);
    this.cameras.main.startFollow(this.selectionIndicator, true, 0.2, 0.2);
    this.cameras.main.setDeadzone(10, 10);

    this.inputEnabled = true;
    // respond to switch input
    this.input.keyboard.on("keydown", async (e) => {
      if (this.inputEnabled) {
        this.inputEnabled = false;
        if (e.key == "Enter" || e.key == "ArrowLeft") {
          await this.makeChoice();
        } else if (e.key == " " || e.key == "ArrowRight") {
          await this.selectNext();
        } else if (e.key == "l") {
          this.level++;
          this.scene.restart();
        }
        this.inputEnabled = true;
      }
    });

    // respond to eye gaze user button click
    document.getElementById("select").addEventListener("click", async (e) => {
      if (this.inputEnabled) {
        this.inputEnabled = false;
        await this.makeChoice();
        this.inputEnabled = true;
      }
    });
    document.getElementById("next").addEventListener("click", async (e) => {
      if (this.inputEnabled) {
        this.inputEnabled = false;
        this.selectNext();
        this.inputEnabled = true;
      }
    });

    if (settings.mode != "full") {
      this.autoPlay();
    }
    let backgroundMusic = this.sound.add("background_music", { loop: true });
    if (settings.sound && settings.backgroundMusic) {
      backgroundMusic.play();
    } else {
      backgroundMusic.stop();
    }

    this.updatePower();

    this.updateOnEnemies();

    this.powerupSounds = [
      "sonic_powerup",
      "bounce_powerup",
      "space_powerup",
      "chimes_powerup",
    ];
    this.powerdownSounds = [
      "awkward",
      "timpani_failure",
      "magical_falling",
      "troubled_powerdown",
    ];
    this.numObjects(this.enemy);
  }

  speak(text) {
    if (settings.sound && settings.dictation) {
      this.utterThis = new SpeechSynthesisUtterance(text);
      this.utterThis.voice = this.speaker
        .getVoices()
        .filter((voice) => voice.name == settings.voice)[0];
      this.utterThis.rate = settings.rate;
      this.utterThis.pitch = settings.pitch;
      this.speaker.speak(this.utterThis);
    }
  }

  setRoomInfo(text) {
    document.getElementById("information_box").innerHTML = "";
    document.getElementById("information_box").innerHTML = text;
  }

  getRoomInfo() {
    return document.getElementById("information_box").innerHTML;
  }

  updateRoomDescription() {
    this.setRoomInfo(this.getRoomDescription());
    this.speak(this.roomDescription);
  }

  numObjects(objectType) {
    let objectCount = 0;
    this.map.rooms.forEach((r) => {
      objectCount += r.objects.filter((o) => o.description == objectType)
        .length;
    });
    console.log(objectType + " " + objectCount);
    return objectCount;
  }

  getRoomDescription() {
    // if (this.room.objects.length == 0) {
    //   return "This room is empty!";
    // }
    return this.roomDescription;
  }

  lighting() {
    this.isoGroup.getChildren().forEach((go) => {
      const tile = /** @type{IsoSprite} */ (go);
      if (tile === this.selectionIndicator) return;
      const px = this.player.isoX;
      const py = this.player.isoY;
      const tx = tile.isoX;
      const ty = tile.isoY;
      const d = Math.hypot(tx - px, ty - py);
      const dmin = 2;
      const dmax = 6;
      const u = Math.max(0, Math.min(1, (d - dmin) / (dmax - dmin)));
      const b = (255 * (1 - u)) & 0xff;
      if (b == 0) {
        tile.visible = false;
      } else {
        tile.visible = true;
        tile.tint = (b << 16) | (b << 8) | b;
      }
    });
  }

  moveCharacter(path) {
    // Sets up a list of tweens, one for each tile to walk,
    // that will be chained by the timeline
    if (path.length == 0) {
      return;
    }
    let walkingSound = this.playSound("footsteps");
    return new Promise((resolve, reject) => {
      const tweens = [];
      const start = (dir) => () => this.player.play(dir, true);
      for (var i = 1; i < path.length; i++) {
        const ex = path[i].x;
        const ey = path[i].y;
        const dx = ex - path[i - 1].x;
        const dy = ey - path[i - 1].y;
        const duration = 200 * Math.hypot(dx, dy);
        const dir = this.directions[
          Math.sign(dx) + 1 + 3 * (Math.sign(dy) + 1)
        ];
        tweens.push({
          targets: [this.player, this.selectionIndicator],
          isoX: ex,
          isoY: ey,
          duration: duration,
          onStart: start(dir),
          onUpdate: () => this.lighting(),
        });
      }
      this.tweens.timeline({
        tweens: tweens,
        onStart: () => {
          if (settings.sound) {
            walkingSound.play();
          }
        },
        onComplete: () => {
          this.player.anims.stop();
          resolve();
          if (settings.sound) {
            walkingSound.stop();
          }
        },
      });
    });
  }

  // allow waiting for input in the midst of autoplay
  async waitForInput() {
    return new Promise((resolve, reject) => {
      this.oneSwitchHandler = resolve;
      this.inputEnabled = true;
    });
  }

  // show the button we are clicking
  async simulateClick(selector) {
    const button = document.querySelector(selector);
    button.style.backgroundColor = "#99badd";
    await this.delay(settings.delay);
    button.style.backgroundColor = "#FFFFFF";
  }

  // wait for milliseconds to elapse
  async delay(t) {
    return new Promise((resolve, reject) =>
      this.time.delayedCall(t, resolve, null, null)
    );
  }

  // The loop pulls off the top room to visit.
  // If you aren't already in that room it computes the path to
  // there. Get the list of exits for the current room and compare
  // them to the points on the path you just computed.
  // When you get a hit, first show the player moving to the exit,
  // then update the room, and repeat.
  // That way it looks like the player stepped from room to room.

  async autoPlay() {
    // list of places yet to visit
    // I'm faking up the initial one to get things started
    // later ones will be targets as returned by getTargets
    const targetsToVisit = [
      {
        x: this.player.isoX,
        y: this.player.isoY,
        object: this.player,
        exit: { nextroom: this.room },
      },
    ];
    // keep track of rooms visited so we don't get into loops
    const roomsVisited = [];
    // I'm making these helps internal, they could be methods

    // make it look like the player is selecting the object
    const simulateSelect = async (obj) => {
      await this.simulateClick("button#next");
      this.selectionIndicator.isoX = obj.isoX;
      this.selectionIndicator.isoY = obj.isoY;
      this.selectionIndicator.visible = true;
      if (settings.mode == "one") {
        await this.waitForInput();
      } else {
        await this.delay(settings.delay);
        await this.simulateClick("button#select");
      }
      this.selectionIndicator.visible = false;
    };
    // return the exit that is on the path
    const firstExitOnPath = (exits, path) => {
      for (const { x, y } of path) {
        for (const exit of exits) {
          if (x == exit.x && y == exit.y) {
            return exit;
          }
        }
      }
    };
    // repeat for each place we need to visit
    while (targetsToVisit.length) {
      // get the next room to visit
      let { x, y, exit } = targetsToVisit.pop();
      let nextroom = exit.nextroom;
      // while we aren't in that room, step toward it
      while (this.room != nextroom) {
        const path = await this.map.path(
          this.player.isoX,
          this.player.isoY,
          x,
          y
        );
        const exits = this.getTargets().filter((x) => "exit" in x);
        // find the first exit on the path
        const exit = firstExitOnPath(exits, path);
        // if we found it go there
        if (exit) {
          await simulateSelect(exit.object);
          await this.visitChoice(exit);
          this.updateRoomDescription();
        } else {
          // if we didn't something is really wrong
          console.log("no exit");
          return;
        }
      }

      // get the local targets
      let targets = this.getTargets();
      let numTargets = targets.length;
      let enemiesToRevisit = false;
      let chestsToRevisit = false;
      if (this.power <= -1 * this.objectConfig.power[this.enemy]) {
        let result = sortForEnemies(this.enemy, targets, this.power);
        targets = result.nonEnemies;
        if (numTargets - targets.length > 0) {
          enemiesToRevisit = true;
        }
      } 
      if (this.level >= 3 && !this.hasAcquired("key")) {
        // sort so that key is gotten before any chests
        let items = sortOutChests(targets);
        targets = items;
        if (items.length != numTargets) {
          // revisit this room later with the key to open the chest
          chestsToRevisit = true;
        }
      }
      console.log("remaining enemies "+enemiesToRevisit);
      console.log("chests to revisit "+chestsToRevisit);
      
      if (!enemiesToRevisit && !chestsToRevisit) {
        // no need to visit this room later
        roomsVisited.push(this.room);
      }

      // visit each of the targets
      for (const target of targets) {
        // exits are pushed onto the stack to handle later
        if ("exit" in target) {
          if (roomsVisited.indexOf(target.exit.nextroom) < 0) {
            targetsToVisit.push(target);
          }
        } else {
          await simulateSelect(target.object);
          this.speak(target.object.description);
          await this.visitChoice(target);
        }
      }
    }
  }

  handleOneSwitch() {
    if (this.oneSwitchHandler) {
      this.oneSwitchHandler();
      this.oneSwitchHandler = null;
      return;
    }
  }

  selectNext() {
    this.simulateClick("#next");
    this.handleOneSwitch();
    const targets = this.getTargets();
    this.targetIndex += 1;
    this.target = targets[this.targetIndex % targets.length];
    if (this.target.object.description) {
      this.roomDescription = this.target.object.description;
      this.updateRoomDescription();
    } else {
      if (
        this.previousExit &&
        this.target.exit.x == this.previousExit.x &&
        this.target.exit.y == this.previousExit.y && 
        this.roomDescription != "back"
      ) {
        // let user know this exit takes them back to where they were so they don't go in circles
        this.roomDescription = "back";
      } else if(this.roomDescription != "exit "+this.getExitNumber(targets)) {
        this.roomDescription = "exit " + this.getExitNumber(targets);
      }
      this.updateRoomDescription();
    }
    this.selectionIndicator.visible = true;
    this.selectionIndicator.isoX = this.target.object.isoX;
    this.selectionIndicator.isoY = this.target.object.isoY;
    this.selectionIndicator._project();
  }

  async makeChoice() {
    this.simulateClick("#select");
    this.handleOneSwitch();
    if (this.target) {
      this.targetIndex = -1;
      this.selectionIndicator.visible = false;
      await this.visitChoice(this.target);
      this.target = null;
    }
  }

  getExitNumber(targets) {
    return (
      Number(
        Number(this.targetIndex % targets.length) % this.room.exits.length
      ) + Number(1)
    );
  }

  playSound(sound) {
    if (settings.sound && sound != null) {
      let music = this.sound.add(sound);
      music.play();
      return music;
    }
  }

  async visitChoice(target) {
    this.roomDescription = "";
    if ("exit" in target) {
      this.previousExit = target.exit;
      let { x, y, nextroom, stepIn } = target.exit;

      x += stepIn.x;
      y += stepIn.y;

      // get the path to the door
      let path = await this.map.path(this.player.isoX, this.player.isoY, x, y);
      // move there
      await this.moveCharacter(path);
      // it is now the current room
      this.room = nextroom;
      this.visitedRooms.push(this.room);
      // make the sound of a door to indicate room change
      //this.playSound("open_door");
      this.updateOnEnemies();
    } else {
      // allow the object to provide the destination
      let { x, y, z } = target.object.position();

      // get the path there
      let path = await this.map.path(this.player.isoX, this.player.isoY, x, y);

      // allow the object to edit the path
      path = target.object.path(path, this.power);

      // go there
      await this.moveCharacter(path);

      // animate, create sound of, describe, dictate, update game state, and adjust power based on object-player interaction
      await this.interactWithObject(target.object, x, y);
    }
  }

  updateOnEnemies() {
    let items = sortForEnemies(this.enemy, this.getTargets(), this.power);
    if (
      items.enemies.length > 0 &&
      this.power <= -1 * this.objectConfig.power[this.enemy] &&
      this.roomDescription != "Low power" &&
      this.roomDescription !=
        "Get objects before challenging " + this.enemy + "s" &&
      this.roomDescription != "Insufficient power"
    ) {
      // this room has enemies and is too weak to fight them
      this.roomDescription = this.lowPowerDescriptions[
        this.lowPowerIndex % this.lowPowerDescriptions.length
      ];
      this.lowPowerIndex++;
    } else {
      this.roomDescription = "";
    }
    this.updateRoomDescription();
  }

  async interactWithObject(object, x, y) {
    // since the chests are only worth something once you've obtained a key
    if (
      object.power > 0 &&
      object.description != "red chest" &&
      object.description != "green chest"
    ) {
      if (
        this.power <= -1 * this.objectConfig.power[this.enemy] &&
        object.power + this.power > -1 * this.objectConfig.power[this.enemy] &&
        this.roomDescription != "Sufficient power"
      ) {
        this.roomDescription = "Sufficient power";
        this.updateRoomDescription();
      }
    }
    if (object.isCollectible) {
      // if object doesn't have a custom animation, upon collection, emit particles
      if (!object.animation) {
        this.particles.emitParticleAt(object.x, object.y);
      } else {
        this.createAnimation(object.animation, x, y);
      }
      this.playSound(object.audio);
      this.map.removeObject(object, x, y, true);
      // collect object before it's destroyed
      this.acquiredObjects.push(object.description);
      object.destroy();
    } else if (object.description == "dragon") {
      await this.interactWithDragon(object, x, y);
    } else if (object.description == "ogre") {
      await this.interactWithOgre(object, x, y);
    } else if (object.description == "ghost") {
      await this.interactWithGhost(object, x, y);
    } else if (object.description == "medusa") {
      await this.interactWithMedusa(object, x, y);
    } else if (object.description == "troll") {
      await this.interactWithTroll(object, x, y);
    } else if (object.description == "lava_monster") {
      await this.interactWithLavaMonster(object, x, y);
    } else if(object.description == "apple"){
      await this.interactWithApple(object, x, y);
    } else if (
      object.description == "red chest" ||
      object.description == "green chest"
    ) {
      await this.interactWithChest(object, x, y);
    } else {
      this.playSound(object.audio);
      // since it wasn't removed from the game,
      // needs a high path weight
      this.map.removeObject(object, x, y, false);
    }
    await this.delay(2000);
    if (this.numObjects(this.enemy) == 0) {
      if (this.level == 4) {
        this.roomDescription = "You won the game!";
        this.updateRoomDescription();
        await this.delay(settings.delay * 4);
        document.getElementById("setup").click();
      } else if (!this.levelJustStarted) {
        if (this.level == 0) {
          this.roomDescription = "Next up: the mansion of medusa";
        } else if (this.level == 1) {
          this.roomDescription = "Going on a troll hunt";
        } else if (this.level == 2) {
          this.roomDescription = "Headed to the land of lava monsters";
        } else if (this.level == 3) {
          this.roomDescription = "Finally, the dreaded dragon dungeon";
        } else {
          console.log(this.level);
        }
        this.updateRoomDescription();
        await this.delay(settings.delay * 8);
        this.playSound("hero");
        await this.delay(settings.delay * 2);
        this.level++;
        this.scene.restart();
      }
    }
    if (
      object.description != "red chest" &&
      object.description != "green chest"
    ) {
      this.power += object.power;
    }
    this.updatePower();
    this.levelJustStarted = false;
  }

  async interactWithChest(object, x, y) {
    if (this.hasAcquired("key")) {
      // unlock/unlatch sound
      this.playSound("knock");
      this.map.removeObject(object, x, y, false);
      let d = this.add.isoSprite(
        x,
        y,
        0,
        object.description == "red chest" ? "Chest1_opened" : "Chest2_opened",
        this.isoGroup,
        null
      );
      if (
        this.power <= -1 * this.objectConfig.power[this.enemy] &&
        object.power + this.power > -1 * this.objectConfig.power[this.enemy] &&
        this.roomDescription != "Sufficient power"
      ) {
        this.roomDescription = "Sufficient power";
        this.updateRoomDescription();
      }
      this.power += object.power;
      this.updatePower();
      d.scale = Math.sqrt(3) / d.width;
      object.destroy();
      await this.delay(settings.delay);
      this.map.removeObject(d, x, y, false);
    } else {
      this.playSound("knock");
      this.roomDescription = "Find the key to open the chest";
      this.updateRoomDescription();
      await this.delay(settings.delay);
    }
  }

   async interactWithApple(object, x, y) {
      this.playSound("bite");
      this.map.removeObject(object, x, y, false);
      let d = this.add.isoSprite(
        x,
        y,
        0,
        "bittenApple",
        this.isoGroup,
        null
      );
      if (
        this.power <= -1 * this.objectConfig.power[this.enemy] &&
        object.power + this.power > -1 * this.objectConfig.power[this.enemy] &&
        this.roomDescription != "Sufficient power"
      ) {
        this.roomDescription = "Sufficient power";
        this.updateRoomDescription();
      }
      this.power += object.power;
      this.updatePower();
      d.scale = Math.sqrt(3) / d.width;
      object.destroy();
      await this.delay(settings.delay);
      this.map.removeObject(d, x, y, false);
  }

  async interactWithOgre(object, x, y) {
    await this.playSound("uh_oh");
    await this.delay(1000);
    await this.playSound("slime");
    this.map.removeObject(object, x, y, false);
    this.createAnimation("slime", this.player.isoX, this.player.isoY);
    this.roomDescription = "You got slimed!";
    this.updateRoomDescription();
    this.inputEnabled = false;
    await this.delay(settings.delay);
  }

  async interactWithGhost(object, x, y) {
    if (this.power > 20) {
      this.playSound("ghost_scream");
      this.createAnimation("poisin", x, y);
      await this.delay(settings.delay * 2);
      this.map.removeObject(object, x, y, true);
      object.destroy();
      await this.delay(2000);
      this.roomDescription = [
        "You've vaporized the ghost",
        "another " + this.enemy + " down" ,
        "You barely defeated the ghost",
        "The crowd goes wild!",
      ][this.enemiesDealtWith];
      this.updateRoomDescription();
      await this.delay(settings.delay * 3);
      this.playSound("applause");
    } else {
      this.playSound("ghost");
      await this.delay(settings.delay * 3);
      this.player.destroy();
      this.inputEnabled = false;
      this.roomDescription = [
        "Insufficient power to fight the ghost!",
        "You've been taken to the afterlife",
        "The ghost has stolen your soul",
        "The ghost has overpowered you",
      ][0];
      this.updateRoomDescription();
      await this.delay(settings.delay * 3);
      this.roomDescription = "Game over!";
      this.updateRoomDescription();
      await this.delay(settings.delay * 3);
      document.getElementById("setup").click();
    }
    this.enemiesDealtWith++;
  }

  async interactWithDragon(object, x, y) {
    if (this.power > 60) {
      this.playSound("unsheath_sword");
      await this.delay(settings.delay * 3);
      this.playSound("sword_slice");
      await this.delay(settings.delay * 3);
      this.playSound("roar");
      this.map.removeObject(object, x, y, true);
      let d = this.add.isoSprite(
        x,
        y,
        0,
        "dragon_skeleton",
        this.isoGroup,
        null
      );
      d.scale = Math.sqrt(3) / d.width;
      object.destroy();
      await this.delay(2000);
      this.roomDescription = [
        "Only the dragon's skeleton remains",
         "another " + this.enemy + " down" ,
        "Narrowly defeated the dragon",
        "Well fought battle!",
      ][this.enemiesDealtWith];
      this.updateRoomDescription();
      await this.delay(settings.delay * 3);
      d.destroy();
      this.playSound("sonic_powerup");
    } else {
      // change description to you need a shield to fight and defeat the dragon
      // do kill animation at the player's coordinates?
      this.playSound("dragon_roar");
      let fire = this.add.isoSprite(x, y, 0, "explosion", this.isoGroup, null);
      fire.scale = Math.sqrt(3) / fire.width;
      let tween = {
        targets: [fire],
        isoX: this.player.isoX,
        isoY: this.player.isoY,
        duration: 2000,
      };
      //let bulletSound = this.playSound("lava");
      this.tweens.timeline({
        tweens: tween,
        onStart: () => {
          if (settings.sound) {
            // bulletSound.play();
          }
        },
        onComplete: () => {
          if (settings.sound) {
            //bulletSound.stop();
            // this.playSound("deep_scream");
            fire.destroy();
          }
        },
      });
      await this.delay(2000);
      this.player.destroy();
      this.roomDescription = Phaser.Math.RND.shuffle([
        "Insufficient power to fight the dragon!",
        "You poked the dragon without enough power",
        "You're on fire",
        "The dragon threw flames at you",
      ])[0];
      this.updateRoomDescription();
      this.inputEnabled = false;
      await this.delay(3000);
      await this.levelDown();
    }
    this.enemiesDealtWith++;
  }

  correctOrientation(playerX, playerY, objectX, objectY) {
    if (Math.abs(playerX - objectX) > Math.abs(playerY - objectY)) {
      if (playerX < objectX) {
        return "arrow_right";
      } else {
        return "arrow_left";
      }
    } else if (Math.abs(playerX - objectX) < Math.abs(playerY - objectY)) {
      if (playerY < objectY) {
        return "arrow_down";
      } else {
        return "arrow_up";
      }
    } else {
      if (playerX < objectX) {
        return "arrow_up";
      } else {
        return "arrow_down";
      }
    }
  }

  async interactWithMedusa(object, x, y) {
    if (this.power > 30) {
      let oriented = this.correctOrientation(
        this.player.isoX,
        this.player.isoY,
        x,
        y
      );
      let arrow = this.add.isoSprite(
        this.player.isoX,
        this.player.isoY,
        0,
        oriented,
        this.isoGroup,
        null
      );
      arrow.scale =
        oriented == "arrow_down" || oriented == "arrow_up"
          ? Math.sqrt(3) / arrow.height
          : Math.sqrt(3) / arrow.width;
      let tween = {
        targets: [arrow, object],
        isoX: x,
        isoY: y,
        duration: 2000,
      };
      let arrowSound = this.playSound("arrow");
      this.tweens.timeline({
        tweens: tween,
        onStart: () => {
          if (settings.sound) {
            arrowSound.play();
          }
        },
        onComplete: () => {
          if (settings.sound) {
            arrowSound.stop();
          }
        },
      });
      this.playSound("arrow");
      await this.delay(settings.delay * 3);
      this.playSound("scream");
      this.map.removeObject(object, x, y, true);
      object.destroy();
      arrow.destroy();
      await this.delay(2000);
      this.roomDescription = [
        "Speared Medusa in the heart",
         "another " + this.enemy + " down" ,
        "Medusa had you in her grip till the very end",
        "Score: you 1 Medusa 0",
      ][this.enemiesDealtWith];
      this.updateRoomDescription();
      await this.delay(settings.delay * 3);
      this.playSound("bounce_powerup");
    } else {
      // add a tween that manages this
      this.playSound("medusa");
      this.map.removeObject(object, x, y, true);
      this.player.tint = 0x696969;
      await this.delay(settings.delay * 3);
      this.roomDescription = Phaser.Math.RND.shuffle([
        "You've turned to stone by medusa's stare",
        "Don't mess with medusa without enough power",
        "You enraged medusa and she killed you",
        "Score: medusa one - you zero",
      ])[0];
      this.updateRoomDescription();
      this.inputEnabled = false;
      await this.delay(settings.delay * 3);
      await this.levelDown();
    }
    this.enemiesDealtWith++;
  }

  async interactWithTroll(object, x, y) {
    if (this.power > 40) {
      let bullet = this.add.isoSprite(
        this.player.isoX,
        this.player.isoY,
        0,
        "dark_bullets",
        this.isoGroup,
        null
      );
      bullet.scale = Math.sqrt(3) / bullet.width;
      let tween = {
        targets: [bullet],
        isoX: x,
        isoY: y,
        duration: 1000,
      };
      let bulletSound = this.playSound("sonic_bullets");
      this.tweens.timeline({
        tweens: tween,
        onStart: () => {
          if (settings.sound) {
            bulletSound.play();
          }
        },
        onComplete: () => {
          if (settings.sound) {
            bulletSound.stop();
            this.playSound("deep_scream");
            object.destroy();
            bullet.destroy();
          }
        },
      });
      await this.delay(2000);
      this.map.removeObject(object, x, y, true);
      this.roomDescription = [
        "Bolted the troll with dark magic",
       "another " + this.enemy + " down" ,
        "Close call, you succeeded",
        "That was impressive",
      ][this.enemiesDealtWith];
      this.updateRoomDescription();
      await this.delay(settings.delay * 3);
      this.playSound("space_powerup");
    } else {
      // move troll to player's position
      let tween = {
        targets: [object],
        isoX: this.player.isoX,
        isoY: this.player.isoY,
        duration: 2000,
      };
      let stompingSound = this.playSound("stomping");
      this.tweens.timeline({
        tweens: tween,
        onStart: () => {
          if (settings.sound) {
            stompingSound.play();
          }
        },
        onComplete: () => {
          if (settings.sound) {
            stompingSound.stop();
            this.playSound("deep_scream");
            object.destroy();
            this.player.destroy();
          }
        },
      });
      await this.delay(2000);
      this.roomDescription = Phaser.Math.RND.shuffle([
        "The troll has stomped on you!",
        "Without enough power, you're no match for the troll",
        "You've aggravated the troll and he's out for revenge",
        "The troll has flattened you",
      ])[0];
      this.updateRoomDescription();
      this.inputEnabled = false;
      await this.delay(settings.delay);
      await this.levelDown();
    }
    this.enemiesDealtWith++;
  }

  async interactWithLavaMonster(object, x, y) {
    if (this.power > 50) {
      let bullet = this.add.isoSprite(
        this.player.isoX,
        this.player.isoY,
        0,
        "ice_bullets",
        this.isoGroup,
        null
      );
      bullet.scale = Math.sqrt(3) / bullet.width;
      let tween = {
        targets: [bullet],
        isoX: x,
        isoY: y,
        duration: 1000,
      };
      let bulletSound = this.playSound("sonic_bullets");
      this.tweens.timeline({
        tweens: tween,
        onStart: () => {
          if (settings.sound) {
            bulletSound.play();
          }
        },
        onComplete: () => {
          if (settings.sound) {
            bulletSound.stop();
            this.playSound("deep_scream");
            object.destroy();
            bullet.destroy();
          }
        },
      });
      await this.delay(2000);
      this.roomDescription = [
        "Ice beats fire",
         "another " + this.enemy + " down" ,
        "Lava is no match for ice bullets",
        "Barely made it out alive!",
      ][this.enemiesDealtWith];
      this.updateRoomDescription();
      this.map.removeObject(object, x, y, true);
      await this.delay(settings.delay * 3);
      this.playSound("chimes_powerup");
    } else {
      let fireSound = this.playSound("fireball");
      let lava = this.add.isoSprite(x, y, 0, "lava_ball", this.isoGroup, null);
      lava.scale = Math.sqrt(3) / lava.width;
      let tween = {
        targets: [lava],
        isoX: this.player.isoX,
        isoY: this.player.isoY,
        duration: 2000,
      };
      this.tweens.timeline({
        tweens: tween,
        onStart: () => {
          if (settings.sound) {
            fireSound.play();
          }
        },
        onComplete: () => {
          if (settings.sound) {
            fireSound.stop();
            this.playSound("uh_oh");
            lava.destroy();
          }
        },
      });
      await this.delay(2000);
      this.player.destroy();
      this.roomDescription = Phaser.Math.RND.shuffle([
        "You've melted into a puddle",
        "Without enough power, you couldn't bear the heat of the lava monster",
        "You've ignited in a burst of flames",
        "NOOOOOOOOOOOO",
      ])[0];
      this.updateRoomDescription();
      this.inputEnabled = false;
      await this.delay(2 * settings.delay);
      await this.levelDown();
    }
    this.enemiesDealtWith++;
  }

  async levelDown() {
    // since level starts at 0
    this.roomDescription = "Returning to level " + this.level;
    this.enemy = this.objectConfig.enemies[this.level - 1];
    this.updateRoomDescription();
    await this.delay(3 * settings.delay);
    this.level--;
    this.acquiredObjects = [];
    this.enemiesDealtWith = 0;
    this.visitedRooms = [];
    this.scene.stop();
    this.scene.restart();
  }

  updatePower() {
    let powerBar = document.getElementById("power_bar");
    this.power = this.power < 0 ? 0 : this.power;
    powerBar.style.width = this.power;
    powerBar.innerHTML = "Power " + this.power;
    powerBar.setAttribute(
      "style",
      "width: " + (this.power > 100 ? 100 : this.power) + "%"
    );
    if (this.power <= -1 * this.objectConfig.power[this.enemy]) {
      powerBar.classList.remove("progress-bar-success");
      powerBar.classList.add("progress-bar-danger");
    } else {
      powerBar.classList.remove("progress-bar-danger");
      powerBar.classList.add("progress-bar-success");
    }
  }

  hasAcquired = (item) => {
    return this.acquiredObjects.indexOf(item) > -1;
  };

  async createAnimation(type, x, y) {
    let a = this.add.isoSprite(x, y, 0, type, this.isoGroup, null);
    a.scale = Math.sqrt(3) / a.width;
    if (type == "slime" || type == "poisin") {
      a.scale /= 100;
    }
    a.play(type, true);
    await this.delay(2 * settings.delay);
    a.destroy();
  }

  getTargets() {
    // get objects in the room
    let px = this.player.isoX;
    let py = this.player.isoY;
    let targets = this.room.objects.map((object) => {
      return { object, x: object.isoX, y: object.isoY };
    });
    sortByDistance(targets, px, py);
    let exits = this.room.exits.map((exit) => {
      let { x, y } = exit;
      const tiles = this.tiles.filter((t) => t.isoX == x && t.isoY == y);
      return {
        object: tiles[0],
        exit,
        x,
        y,
      };
    });
    if (settings.mode == "full") {
      exits = sortByVisited(exits, this.visitedRooms);
    } else {
      sortByDistance(exits, px, py);
    }
    targets = [...targets, ...exits];
    return targets;
  }

  generateObjectPositions(room) {
    // positions is an array of [x,y] as viable locations
    // to place an object
    let positions = [];
    let x = room.x;
    let y = room.y;
    // the i = 2 here is necessary to prevent the exit columns/rows
    // from being valid positions
    for (let i = 1; i < room.w - 1; i++) {
      for (let j = 1; j < room.h - 1; j++) {
        positions.push([x + i, y + j]);
      }
    }
    return positions;
  }
}
