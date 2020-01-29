/** @typedef {import('phaser')} Phaser */
import settings from "./settings.js";
import { Map } from "./map.js";
import IsoPlugin from "./phaser3-plugin-isometric/IsoPlugin.js";
import IsoSprite from "./phaser3-plugin-isometric/IsoSprite.js";
import EnhancedIsoSprite from "./EnhancedIsoSprite.js";
import { sortByDistance } from "./helpers.js";

/* +x is down to right, +y is down to left */

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
    this.score = 0;
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

    this.load.image("ground", "assets/cube.png");
    this.load.image("door", "assets/door.png");
    this.load.atlas("hero", "assets/Knight.png", "assets/Knight.json");
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


    this.load.image("particle", "assets/animations/particle.png");

    this.RandomlyPlacedObjects = [
      "Chest1_closed",
      "Chest2_opened",
      "fountain",
      "Rock_1",
      "Rock_2",
      "over_grass_flower1",
      "flag",
      "lever",
      "jewel",
      "key"
    ];

    this.load.audio("click", "assets/audio/click.mp3");
    this.load.audio("ding", "assets/audio/ding.mp3");
    this.load.audio("doorClose", "assets/audio/doorClose.mp3");
    this.load.audio("knock", "assets/audio/knock.mp3");
    this.load.audio("thump", "assets/audio/thump.mp3");
    this.load.audio("waterfall", "assets/audio/waterfall.mp3");
    this.load.audio("music", "assets/audio/background_music.mp3");
    this.load.audio("footsteps", "assets/audio/footsteps.mp3");
  }

  create() {
    this.isoGroup = this.add.group();
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
    let { x: ix, y: iy } = this.map.initial_position;

    this.room = this.map.initial_room;

    this.tiles = [];
    this.map.rooms.forEach(room => {
      let objects = [...Phaser.Math.RND.shuffle(this.RandomlyPlacedObjects)];
      /* I bet this can be done by looking at the height of the images */
      let heights = {
        Chest1_closed: 0,
        Chest2_opened: 0,
        fountain: 0,
        over_grass_flower1: -1 / 2,
        Rock_1: -1 / 2,
        Rock_2: -1 / 2,
        flag: 0,
        lever: 0,
        jewel: 0,
        key: 0
      };
      let audio = {
        Chest1_closed: "knock",
        Chest2_opened: "doorClose",
        fountain: "waterfall",
        over_grass_flower1: "ding",
        Rock_1: "thump",
        Rock_2: "thump",
        flag: "thump",
        lever: "thump",
        jewel: "thump",
        key: "thump"
      };
      let prettyNames = {
        Chest1_closed: "red chest",
        Chest2_opened: "open green chest",
        fountain: "flowing fountain",
        over_grass_flower1: "flower",
        Rock_1: "rock",
        Rock_2: "rock",
        flag: "flag",
        lever: "lever",
        jewel: "jewel",
        key: "key"
      };
      let animations = {
        Chest1_closed: "a red chest",
        Chest2_opened: "an open green chest",
        fountain: "a flowing fountain",
        over_grass_flower1: "a pretty flower",
        Rock_1: "a rock",
        Rock_2: "a rock",
        flag: "a flag",
        lever: "a lever",
        jewel: "a jewel",
        key: "a key"
      };
      let positions = this.generateObjectPositions(room);
      // remove the player position
      positions = positions.filter(([px, py]) => px != ix || py != iy);
      positions = Phaser.Math.RND.shuffle(positions);
      const nobjects = Phaser.Math.RND.between(0, 3);
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
          z: heights[o],
          texture: o,
          group: this.isoGroup,
          description: prettyNames[o],
          reward: 1,
          room: room,
          audio: audio[o]
        });
        isoObj.scale = Math.sqrt(3) / isoObj.width;
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

    this.scoreDisplay = this.add.text(20, 20, "0", { fontSize: 20 });

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

    this.updateRoomDescription();

    if (settings.mode != "full") {
      this.setRoomInfo("press any key to start sound!");
      this.autoPlay();
    }
    if(settings.dictation){
      this.speak(this.getRoomDescription());
    }
    
    let music = this.sound.add("music", {loop: true});
    if(settings.sound && settings.backgroundMusic){
      music.play();
    } else {
      music.stop();
    }
  }

  speak(text) {
    if (settings.sound && settings.dictation) {
      this.utterThis = new SpeechSynthesisUtterance(text);
      this.utterThis.voice = this.speaker.getVoices().filter(voice => voice.name == settings.voice)[0];
      this.utterThis.rate = settings.rate;
      this.utterThis.pitch = settings.pitch;
      this.speaker.speak(this.utterThis);
    }
  }

  setRoomInfo(text) {
    document.getElementById("information_box").innerHTML = "";
    document.getElementById("information_box").innerHTML = text;
    // if(text == "This room is empty! Go explore others."){
    //   this.speak();
    // }
  }

  getRoomInfo() {
    return document.getElementById("information_box").innerHTML;
  }

  updateRoomDescription() {
    this.setRoomInfo(this.getRoomDescription());
  }

  getRoomDescription() {
    if (this.room.objects.length == 0) {
      return "This room is empty! Go explore others.";
    }
    // let description = "You've found ";
    // let index = 0;
    // this.room.objects.forEach(o => {
    //   if (
    //     index == this.room.objects.length - 1 &&
    //     this.room.objects.length > 1
    //   ) {
    //     description += " and ";
    //   } else if (
    //     index < this.room.objects.length - 1 &&
    //     this.room.objects.length > 2 &&
    //     index > 0
    //   ) {
    //     description += ", ";
    //   }
    //   description += o.getDescription();
    //   index++;
    // });
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
    let music = this.playSound("footsteps");
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
        onStart: () => music.play(),
        onComplete: () => {
          this.player.anims.stop();
          resolve();
          music.stop();
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
      await this.simulateClick("button#select");
      this.updateRoomDescription();
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
      const targets = this.getTargets();
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
      this.speak("exit");
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

  playSound(sound) {
    if (settings.sound) {
      console.log(sound);
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
      this.updateRoomDescription();
      this.speak(this.getRoomDescription());
      this.playSound("click");
    } else {
      // allow the object to provide the destination
      let { x, y, z } = target.object.position();
      // get the path there
      let path = await this.map.path(this.player.isoX, this.player.isoY, x, y);
      // allow the object to edit the path
      path = target.object.path(path);
      // go there
      await this.moveCharacter(path);
      // interact with the object
      let keep = await target.object.interact(this.player, this.room);
      if (!keep) {
        console.log("emit", x, y, target);
        this.particles.emitParticleAt(target.object.x, target.object.y);
        console.log("emitter", this.emitter);
        console.log("particles", this.particles);
        this.map.removeObject(target.object, x, y);
        this.updateRoomDescription();
        // this.speak("You've chosen " + target.object.description);
        this.playSound(target.object.audio);
        target.object.destroy();
      }
      this.score++;
    }
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
