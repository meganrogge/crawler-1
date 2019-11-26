import IsoSprite from "./phaser3-plugin-isometric/IsoSprite.js";
let vowels = ['a', 'e', 'i', 'o', 'u'];
export default class EnhancedIsoSprite extends IsoSprite {
  constructor(config, audio) {
    super(
      config.scene,
      config.x,
      config.y,
      config.z,
      config.texture,
      config.frame
    );
    this.audio = audio;
    this.room = config.room;
    this.config = config;
    config.scene.add.existing(this);
    this.room.isoObjects.push(this);
    this.description = config.description;
  }

  /*
   * What is the likely reward for interacting with this?
   */
  reward(player) {
    return this.config.reward || 0;
  }

  /*
   * Return the location the player should come to for interaction
   * A treasure chest might want you to stand in a special place
   */
  position() {
    return this.isoPosition;
  }

  /*
   * Return the path to the interaction position given the path
   * The idea is to give the object an opportunity to edit the path
   */
  path(path) {
    return path;
  }

  // when we have the objects we know we want in the game, we should give them a property "pretty name"
  // vs doing all of this manipulation. 
  getDescription(){
   return vowels.indexOf(this.description.charAt(0)) > -1 ? "an "+this.description.toLowerCase() : "a "+this.description.toLowerCase();
  }

  /*
   * Interact with the object
   */
  async interact(player, room) {
    this.visible = false;
    this.room.isoObjects = this.room.isoObjects.filter(o => o !== this);
  }
}