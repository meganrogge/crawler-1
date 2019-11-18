/** @typedef {import('phaser')} Phaser */
import settings from "./settings.js";
import Dungeon from "./dungeon-generator/generators/dungeon.js";
import EasyStar from "./easystar/easystar.js";
import IsoPlugin from "./phaser3-plugin-isometric/IsoPlugin.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameScene",
      mapAdd: { isoPlugin: "iso" }
    });
    this.canvas = document.querySelector("canvas");
    this.score = 0;
    this.exitIndex = 0;
    this.doorSelection = null;
    this.associatedExit = null;
    this.objectIndex = 0;
    this.objectSelection = null;
    // cast this once so I don't have to below
    // shouldn't I be able to just assert this?
    this.sound = /** @type {Phaser.Sound.WebAudioSoundManager} */ (super.sound);
  }

  preload() {
    this.load.scenePlugin({
      key: "IsoPlugin",
      url: IsoPlugin,
      sceneKey: "iso"
    });

    this.load.image("tileset", "assets/cube.png");
    this.load.image("door", "assets/door.png");
    this.load.spritesheet("g", "assets/george.png", {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet("phaserguyFrontRight", "assets/Knight/Knight_Front-Walking-Front-Left.png", {
      frameWidth: 32,
      frameHeight: 57
    });
    this.load.spritesheet("phaserguyFrontLeft", "assets/Knight/Knight_Front-Walking-Front.png", {
      frameWidth: 32,
      frameHeight: 57
    });
    this.load.spritesheet("phaserguyBackLeft", "assets/Knight/Knight_Back-Walking-Back-Right.png", {
      frameWidth: 32,
      frameHeight: 57
    });
    this.load.spritesheet("phaserguyBackRight", "assets/Knight/Knight_Back-Walking-Back.png", {
      frameWidth: 32,
      frameHeight: 57
    });
    this.load.image("Chest1_closed", "assets/Chest1_closed.png");
    this.load.image("Chest2_opened", "assets/Chest2_opened.png");
    this.load.image("fountain", "assets/fountain.png");
    this.load.image("Rock_1", "assets/Rock_1.png");
    this.load.image("Rock_2", "assets/Rock_2.png");
    this.load.image("over_grass_flower1", "assets/over_grass_flower1.png");
  }

  create() {
    this.isoGroup = this.add.group();
    this.iso.projector.origin.setTo(0.5, 0.3);

    this.dungeon = new Dungeon({
      size: [100, 100],
      // seed: "abcd", //omit for generated seed
      rooms: {
        initial: {
          min_size: [3, 3],
          max_size: [6, 6],
          max_exits: 2
        },
        any: {
          min_size: [3, 3],
          max_size: [7, 7],
          max_exits: 4
        }
      },
      max_corridor_length: 20,
      min_corridor_length: 5,
      corridor_density: 0.0, //corridors per room
      symmetric_rooms: false, // exits must be in the center of a wall if true
      interconnects: 5, //extra corridors to connect rooms and make circular paths. not 100% guaranteed
      max_interconnect_length: 10,
      room_count: 10,
      max_object_count: 5,
    });
    this.dungeon.generate();
    let [ix, iy] = this.dungeon.start_pos;
    this.room = this.dungeon.initial_room;
    // translate into a tilemap
    let [width, height] = this.dungeon.size;
    let grid = [];
    for (let y = 0; y < height; y++) {
      let row = [];
      for (let x = 0; x < width; x++) {
        let t = this.dungeon.walls.get([x, y]);
        row.push(t ? 0 : 28);
      }
      grid.push(row);
    }
    this.dungeon.children.forEach(room => {
      console.log(room);
      room.objects.forEach(o => {
        this.add.isoSprite(
          room.position[0]*32,
          room.position[1]*32,
          20,
          o
        );
        console.log("o"+o);
        console.log(room.objects);
      });
    });

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y][x] === 0) continue;
        let tile = this.add.isoSprite(
          x * 32,
          y * 32,
          grid[y][x] === 0 ? 16 : 0,
          "tileset",
          this.isoGroup
        );
        if (grid[y][x] !== 0) {
          // walkable
          tile.tint = 0x99badd;
          tile.setInteractive();
          tile.on("pointerdown", () => {
            this.moveTo(tile.isoX, tile.isoY);
          });
        }
      }
    }

    var phaserGuy = this.add.isoSprite(
      ix * 32,
      iy * 32,
      32,
      "phaserguyFrontLeft",
      this.isoGroup,
      null
    );

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("phaserguyFrontLeft"),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("phaserguyBackLeft"),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("phaserguyBackRight"),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("phaserguyFrontRight"),
      frameRate: 5,
      repeat: -1
    });
    this.player = phaserGuy;

    this.finder = new EasyStar.js();
    this.finder.setGrid(grid);
    this.finder.setAcceptableTiles([28]);

    this.scoreDisplay = this.add.text(20, 20, "0", { fontSize: 20 });

    // control sound
    if (settings.sound) {
    }

    // configure the camera
    this.cameras.main.setSize(20 * 32, 20 * 32);
    this.cameras.main.startFollow(this.player);

    // respond to switch input
    this.input.keyboard.on("keydown", e => {
      if (e.key == "Enter" || e.key == "ArrowLeft") {
        this.makeChoice();
      } else if (e.keyCode == 32 || e.key == "ArrowRight") {
        this.selectNext();
      }
    });

    // respond to eye gaze user button click
    document
      .getElementById("left")
      .addEventListener("click", e => this.makeChoice());
    document
      .getElementById("right")
      .addEventListener("click", e => this.selectNext());
  }

  moveTo(x, y) {
    var toX = Math.floor(x / 32);
    var toY = Math.floor(y / 32);
    var fromX = Math.floor(this.player.isoX / 32);
    var fromY = Math.floor(this.player.isoY / 32);

    this.finder.findPath(fromX, fromY, toX, toY, path => {
      if (path === null) {
        console.log(fromX+" "+fromY + " "+toX+" "+toY);
        console.warn("Path was not found.");
      } else {
        this.moveCharacter(path);
      }
    });
    this.finder.calculate(); // don't fthis, otherwise nothing happens
  }

  moveCharacter(path) {
    // Sets up a list of tweens, one for each tile to walk,
    // that will be chained by the timeline
    const tweens = [];
    for (var i = 1; i < path.length; i++) {
      const ex = path[i].x;
      const ey = path[i].y;
      const dx = ex - path[i - 1].x;
      const dy = ey - path[i - 1].y;
      var dir = "";
      if (dx < 0) {
        dir = "left";
      } else if (dx > 0) {
        dir = "right";
      } else if (dy < 0) {
        dir = "up";
      } else if (dy > 0) {
        dir = "down";
      }
      const start = dir => () => this.player.play(dir, true);
      tweens.push({
        targets: this.player,
        isoX: { value: ex * 32, duration: 200 },
        isoY: { value: ey * 32, duration: 200 },
        onStart: start(dir)
      });
    }
    console.log(this.dungeon.rooms);
    console.log(this.dungeon.room_tags);
    this.tweens.timeline({
      tweens: tweens,
      onComplete: () => this.player.anims.stop()
    });
  }

  makeChoice() {
    if(this.doorSelection != null){
      console.log("choice made");
      this.exitIndex = 0;
      let [xy, rot, room] = this.associatedExit;
      xy = this.room.global_pos(xy);
      let x = xy[0];
      let y = xy[1];
      switch (rot) {
        case 0:
          y = (y-1);
          break;
        case 90:
          x = (x-1);
          break;
        case 180:
          y = (y+1);
          break;
        case 270:
          x = (x+1);
          break;
      }
      this.moveTo(x*32, y*32);
      this.room = room;
    }
    if(this.doorSelection != null){
      this.doorSelection.destroy();
      this.doorSelection = null;
    }
  }

  selectNext() {
    if (this.doorSelection != null) {
      this.doorSelection.destroy();
      this.doorSelection = null;
    }
    console.log("next choice");

    this.exitIndex++;

    let [xy, rot, room] = this.room.exits[this.exitIndex % this.room.exits.length];

    this.associatedExit = [xy, rot, room];

    xy = this.room.global_pos(xy);

    this.doorSelection = this.add.isoSprite(
      xy[0] * 32,
      xy[1] * 32,
      0,
      "door"
    );
    this.doorSelection.setInteractive();
  }
}