/* an abstraction over dungeon-generated and easystar for a game */
import Dungeon from "./dungeon-generator/generators/dungeon.js";
import EasyStar from "./easystar/easystar.js";

export class Exit {
  constructor(x, y, nextroom, stepIn) {
    this.x = x;
    this.y = y;
    this.nextroom = nextroom;
    this.stepIn = stepIn;
  }
}

export class Room {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.objects = [];
    this.exits = [];
  }

  addObject(object) {}
}

export class Map {
  constructor(config) {
    this.dungeon = new Dungeon(config);
    this.dungeon.generate();
    this.size = { width: this.dungeon.size[0], height: this.dungeon.size[1] };
    this.rooms = this.dungeon.children.map(
      room =>
        new Room(
          room.position[0] + 1,
          room.position[1] + 1,
          room.room_size[0],
          room.room_size[1]
        )
    );
    for (let i = 0; i < this.rooms.length; i++) {
      const room = this.rooms[i];
      const droom = this.dungeon.children[i];
      room.exits = droom.exits.map(([xy, rot, nextroom]) => {
        xy = droom.global_pos(xy);
        const ndx = this.dungeon.children.indexOf(nextroom);
        const [sx, sy] = [[0, 1], [-1, 0], [0, -1], [1, 0]][rot / 90];
        return new Exit(xy[0], xy[1], this.rooms[ndx], { x: sx, y: sy });
      });
    }
    this.initial_room = this.rooms[
      this.dungeon.children.indexOf(this.dungeon.initial_room)
    ];
    this.initial_position = {
      x: this.dungeon.start_pos[0],
      y: this.dungeon.start_pos[1]
    };

    // initialize easystar
    let [width, height] = this.dungeon.size;
    let easygrid = [];
    for (let y = 0; y < height; y++) {
      let row = [];
      for (let x = 0; x < width; x++) {
        let t = this.dungeon.walls.get([x, y]);
        row.push(t ? 0 : 1);
      }
      easygrid.push(row);
    }

    this.finder = new EasyStar.js();
    this.finder.setGrid(easygrid);
    this.finder.setAcceptableTiles([1]);

    console.log(this);
  }

  // return the room that contains location x, y
  roomFromXY(x, y) {
    for (const room of this.rooms) {
      if (
        x >= room.x &&
        x < room.x + room.w &&
        y >= room.y &&
        y < room.y + room.h
      ) {
        return room;
      }
    }
    console.log("room not found", x, y, this.rooms);
  }

  addObject(object, x, y) {
    const room = this.roomFromXY(x, y);
    room.objects.push(object);
    this.finder.setAdditionalPointCost(x, y, 1000);
  }

  removeObject(object, x, y) {
    const room = this.roomFromXY(x, y);
    const ndx = room.objects.indexOf(object);
    if (ndx >= 0) {
      room.objects.splice(ndx, 1);
    } else {
      console.log("object not found", object, room, x, y);
    }
    this.finder.setAdditionalPointCost(x, y, 0);
  }

  walkable(x, y) {
    return !this.dungeon.walls.get([x, y]);
  }

  // this is async
  path(fromX, fromY, toX, toY) {
    return new Promise((resolve, reject) => {
      this.finder.findPath(fromX, fromY, toX, toY, path => {
        resolve(path || []);
      });
      this.finder.calculate();
    });
  }
}