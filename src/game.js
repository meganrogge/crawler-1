/** @typedef {import('phaser')} Phaser */
import settings from "./settings.js";
import { Map } from "./map.js";
import IsoPlugin from "./phaser3-plugin-isometric/IsoPlugin.js";
import IsoSprite from "./phaser3-plugin-isometric/IsoSprite.js";
import EnhancedIsoSprite from "./EnhancedIsoSprite.js";
import { sortByDistance } from "./helpers.js";
import { sortForDragons } from "./helpers.js";
import { ObjectConfig } from "./objectConfig.js";
/* +x is down to right, +y is down to left */
// @ts-ignore

const directions = [
  "x-1y-1",
  "x+0y-1",
  "x+1y-1",
  "x-1y+0",
  "x+0y+0",
  "x+1y+0",
  "x-1y+1",
  "x+0y+1",
  "x+1y+1"
];

export class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameScene",
      mapAdd: { isoPlugin: "iso" }
    });
    this.canvas = document.querySelector("canvas");
    this.health = 50;
    this.targetIndex = -1;
    this.speaker = window.speechSynthesis;

    // cast this once so I don't have to below
    // shouldn't I be able to just assert this?
    this.sound = /** @type {Phaser.Sound.WebAudioSoundManager} */ (super.sound);

    // used in one switch
    this.oneSwitchHandler = null;
  }

  preload() {
    this.load.scenePlugin({
      key: "IsoPlugin",
      url: IsoPlugin,
      sceneKey: "iso"
    });

    this.load.atlas("hero", "assets/Knight.png", "assets/Knight.json");
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

    this.load.image("ground", "assets/cube.png");
    this.load.image("door", "assets/door.png");
    this.load.image("particle", "assets/animations/particle.png");
    this.load.image("Chest1_closed", "assets/Chest1_closed.png");
    this.load.image("Chest2_opened", "assets/Chest2_opened.png");
    this.load.image("fountain", "assets/fountain.png");
    this.load.image("Rock_1", "assets/Rock_1.png");
    this.load.image("Rock_2", "assets/Rock_2.png");
    this.load.image("over_grass_flower1", "assets/over_grass_flower1.png");
    this.load.image("flag", "assets/kenny-isometric/flag_NE.png");
    this.load.image("lever", "assets/kenny-isometric/lever_NW.png");
    this.load.image("jewel", "assets/kenny-isometric/jewel_NE.png");
    this.load.image("key", "assets/kenny-isometric/key_SW.png");
    this.load.image("ruby", "assets/ruby.png");
    this.load.image("sapphire", "assets/sapphire.png");

    this.load.audio("click", "assets/audio/click.mp3");
    this.load.audio("ding", "assets/audio/ding.mp3");
    this.load.audio("door_close", "assets/audio/door_close.mp3");
    this.load.audio("knock", "assets/audio/knock.mp3");
    this.load.audio("thump", "assets/audio/thump.mp3");
    this.load.audio("waterfall", "assets/audio/waterfall.mp3");
    this.load.audio("background_music", "assets/audio/background_music.mp3");
    this.load.audio("footsteps", "assets/audio/footsteps.mp3");
    this.load.audio("dragon_roar", "assets/audio/dragon_roar.mp3");
    this.load.audio("cha_ching", "assets/audio/cha_ching.mp3");
  }

  create() {
    this.isoGroup = this.add.group();
    this.objectConfig = new ObjectConfig();
    this.map = new Map({
      size: [100, 100],
      rooms: {
        initial: {
          min_size: [4, 4],
          max_size: [6, 6],
          max_exits: 2
        },
        any: {
          min_size: [4, 4],
          max_size: [10, 10],
          max_exits: 3
        }
      },
      max_corridor_length: 0,
      min_corridor_length: 0,
      corridor_density: 0.0, //corridors per room
      symmetric_rooms: false, // exits must be in the center of a wall if true
      interconnects: 0, //extra corridors to connect rooms and make circular paths. not 100% guaranteed
      max_interconnect_length: 10,
      room_count: 10
    });
    this.RandomlyPlacedObjects = this.objectConfig.objects;

    let { x: ix, y: iy } = this.map.initial_position;

    this.room = this.map.initial_room;

    this.tiles = [];
    this.acquiredObjects = [];
    this.map.rooms.forEach(room => {
      let objects = [...Phaser.Math.RND.shuffle(this.RandomlyPlacedObjects)];
      /* I bet this can be done by looking at the height of the images */
      this.anims.create({
        key: "coin",
        frames: this.anims.generateFrameNames("coin"),
        frameRate: 2,
        repeat: -1
      });
      this.anims.create({
        key: "dragon",
        frames: this.anims.generateFrameNames("dragon"),
        frameRate: 2,
        repeat: -1
      });
      let positions = this.generateObjectPositions(room);
      // remove the player position
      positions = positions.filter(([px, py]) => px != ix || py != iy);
      positions = Phaser.Math.RND.shuffle(positions);
      const nobjects = Phaser.Math.RND.between(1, 3);
      for (let i = 0; i < nobjects; i++) {
        if (!positions.length) {
          break;
        }
        /// remove the position of the player
        let o = objects.pop();
        let [ox, oy] = positions.pop();
        let isoObj = new EnhancedIsoSprite({
          scene: this,
          x: ox,
          y: oy,
          z: this.objectConfig.heights[o],
          texture: o,
          group: this.isoGroup,
          description: this.objectConfig.descriptions[o],
          reward: this.objectConfig.rewards[o] || 0,
          room: room,
          audio: this.objectConfig.audio[o],
          animation: this.objectConfig.animations[o],
          isCollectible: this.objectConfig.isCollectible[o],
          isAnimated: this.objectConfig.isAnimated[o]
        });

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

    for (var direction of directions) {
      this.anims.create({
        key: direction,
        frames: this.anims.generateFrameNames("hero", {
          prefix: direction + "_",
          end: 9,
          zeroPad: 2
        }),
        frameRate: 20,
        repeat: -1
      });
    }
    this.player = hero;

    this.anims.create({
      key: "explosion",
      frames: this.anims.generateFrameNames("explosion", {
        prefix: "Explosions_Left-animation_",
        suffix: ".png",
        start: 0,
        end: 15
      }),
      frameRate: 4,
      repeat: 0
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
      on: false
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
    this.input.keyboard.on("keydown", async e => {
      if (this.inputEnabled) {
        this.inputEnabled = false;
        if (e.key == "Enter" || e.key == "ArrowLeft") {
          await this.makeChoice();
        } else if (e.key == " " || e.key == "ArrowRight") {
          await this.selectNext();
        }
        this.inputEnabled = true;
      }
    });

    // respond to eye gaze user button click
    document.getElementById("select").addEventListener("click", async e => {
      if (this.inputEnabled) {
        this.inputEnabled = false;
        await this.makeChoice();
        this.inputEnabled = true;
      }
    });
    document.getElementById("next").addEventListener("click", async e => {
      if (this.inputEnabled) {
        this.inputEnabled = false;
        this.selectNext();
        this.inputEnabled = true;
      }
    });

    this.setRoomInfo("press any key to start sound!");

    if (settings.mode != "full") {
      this.autoPlay();
    }
    if (settings.dictation) {
      this.speak(this.getRoomDescription());
    }

    let background_music = this.sound.add("background_music", { loop: true });
    if (settings.sound && settings.background_music) {
      background_music.play();
    } else {
      background_music.stop();
    }

    this.updateHealth();
  }

  speak(text) {
    if (settings.sound && settings.dictation) {
      this.utterThis = new SpeechSynthesisUtterance(text);
      this.utterThis.voice = this.speaker
        .getVoices()
        .filter(voice => voice.name == settings.voice)[0];
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
  }

  getRoomDescription() {
    if (this.room.objects.length == 0) {
      return "This room is empty!";
    }
    return "";
  }

  lighting() {
    this.isoGroup.getChildren().forEach(go => {
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
    this.updateRoomDescription();

    if (path.length == 0) {
      return;
    }
    let walkingSound = this.playSound("footsteps");
    return new Promise((resolve, reject) => {
      const tweens = [];
      const start = dir => () => this.player.play(dir, true);
      for (var i = 1; i < path.length; i++) {
        const ex = path[i].x;
        const ey = path[i].y;
        const dx = ex - path[i - 1].x;
        const dy = ey - path[i - 1].y;
        const duration = 200 * Math.hypot(dx, dy);
        const dir = directions[Math.sign(dx) + 1 + 3 * (Math.sign(dy) + 1)];
        tweens.push({
          targets: [this.player, this.selectionIndicator],
          isoX: ex,
          isoY: ey,
          duration: duration,
          onStart: start(dir),
          onUpdate: () => this.lighting()
        });
      }
      this.tweens.timeline({
        tweens: tweens,
        onStart: () => walkingSound.play(),
        onComplete: () => {
          this.player.anims.stop();
          resolve();
          walkingSound.stop();
        }
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
    await this.delay(settings.speed);
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
        exit: { nextroom: this.room }
      }
    ];
    // keep track of rooms visited so we don't get into loops
    const roomsVisited = [];
    // I'm making these helps internal, they could be methods

    // make it look like the player is selecting the object
    const simulateSelect = async obj => {
      await this.simulateClick("button#next");
      this.selectionIndicator.isoX = obj.isoX;
      this.selectionIndicator.isoY = obj.isoY;
      this.selectionIndicator.visible = true;
      if (settings.mode == "one") {
        await this.waitForInput();
      } else {
        await this.delay(settings.speed);
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
        const exits = this.getTargets().filter(x => "exit" in x);
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
      // remember that we came here
      roomsVisited.push(this.room);
      // get the local targets
      let targets = this.health <= 50 ? sortForDragons(this.getTargets(), this.health) : this.getTargets();
      // visit each of the targets
      for (const target of targets) {
        // exits are pushed onto the stack to handle later
        if ("exit" in target) {
          if (roomsVisited.indexOf(target.exit.nextroom) < 0) {
            targetsToVisit.push(target);
          }
        } else {
          await simulateSelect(target.object);
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
      this.speak(this.target.object.description);
    } else {
      this.speak("exit " + this.getExitNumber(targets));
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
    if ("exit" in target) {
      let { x, y, nextroom, stepIn } = target.exit;

      x += stepIn.x;
      y += stepIn.y;

      // get the path to the door
      let path = await this.map.path(this.player.isoX, this.player.isoY, x, y);
      // move there
      await this.moveCharacter(path);
      // it is now the current room
      this.room = nextroom;
      // this.updateRoomDescription();
      // this.speak(this.getRoomDescription());
      this.playSound("click");
    } else {
      // allow the object to provide the destination
      let { x, y, z } = target.object.position();

      // get the path there
      let path = await this.map.path(this.player.isoX, this.player.isoY, x, y);

      // allow the object to edit the path
      path = target.object.path(path, this.health);

      // go there
      await this.moveCharacter(path);

      // animate, create sound of, describe, dictate, update game state, and adjust health based on object-player interaction
      await this.interactWithObject(target.object, x, y);
    }
  }

  async interactWithObject(object, x, y) {
    this.playSound(object.audio);
    if (object.isCollectible) {
      // if object doesn't have a custom animation, upon collection, emit particles
      if (!object.animation) {
        this.particles.emitParticleAt(object.x, object.y);
      } else {
        this.createAnimation(object.animation, x, y);
      }
      this.map.removeObject(object, x, y);
      // collect object before it's destroyed
      this.acquiredObjects.push(object);
      object.destroy();
    } else if (object.description == "dragon") {
      if (this.health > 50) {
        // do kill animation at the dragon's coordinates
        // do player animation of fight and move to dragon's coordinates
        //this.createAnimation("kill", x, y);
        this.map.removeObject(object, x, y);
        object.destroy();
      } else {
        // change description to you need a shield to fight and defeat the dragon
        // do kill animation at the player's coordinates?
        // this.setRoomInfo("you need to be stronger to fight and slay the dragon!");
        this.createAnimation("explosion", this.player.isoX, this.player.isoY);
        this.player.destroy();
        this.setRoomInfo("Insufficient health to fight the dragon - game over!");
        this.inputEnabled = false;
        await this.delay(3000);
        document.getElementById('setup').click();
      }
    } else {
      if (object.description == "Chest1_closed") {
      if (this.hasAcquired("key")) {
        // unlock the chest (replacing closed with open chest) and
        // have contents pop out in surrounding area with announcement that
        // you've found these objects
      } else {
        // change description to you need a key to open the chest
        this.setRoomInfo("you need a key to open this chest!");
        this.updateRoomDescription();
      }
    } else if (object.description == "Chest2_open") {
      // change description to you've already opened that chest?
    }
  }
    this.health += object.reward;
    this.updateHealth();
  }

  updateHealth() {
    let healthBar = document.getElementById("health_box");
    this.health = this.health < 0 ? 0 : this.health;
    healthBar.style.width = this.health;
    healthBar.innerHTML = this.health;
    console.log(this.health);
    document.getElementById("health_box").innerHTML = "Health " + this.health;
  }

  hasAcquired = item => {
    return this.acquiredObjects.indexOf(item) > -1;
  };

  async createAnimation(type, x, y) {
    let a = this.add.isoSprite(x, y, 0, type, this.isoGroup, null);
    a.scale = Math.sqrt(3) / 50;
    a.play(type, true);
    await this.delay(1000);
    a.destroy();
  }

  getTargets() {
    // get objects in the room
    let px = this.player.isoX;
    let py = this.player.isoY;
    let targets = this.room.objects.map(object => {
      return { object, x: object.isoX, y: object.isoY };
    });
    sortByDistance(targets, px, py);
    let exits = this.room.exits.map(exit => {
      let { x, y } = exit;
      const tiles = this.tiles.filter(t => t.isoX == x && t.isoY == y);
      return {
        object: tiles[0],
        exit,
        x,
        y
      };
    });
    sortByDistance(exits, px, py);
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
