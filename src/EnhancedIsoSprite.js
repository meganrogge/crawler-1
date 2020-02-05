import IsoSprite from "./phaser3-plugin-isometric/IsoSprite.js";

export default class EnhancedIsoSprite extends IsoSprite {
  constructor(config) {
    super(
      config.scene,
      config.x,
      config.y,
      config.z,
      config.texture,
      config.frame || 0
    );
    this.audio = config.audio;
    this.description = config.description;
    this.room = config.room;
    this.animation = config.animation;
    this.config = config;
    config.scene.add.existing(this);
    if (config.group) config.group.add(this);
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
    if(path.length < 2){
      return path;
    }
    switch (this.description) {
      // for landmarks that serve no purpose,
      // don't go to the object. stop one square before it.
      case "fountain":
        return path.slice(0, -1);
      case "flag":
        return path.slice(0, -1);
      case "rock":
        return path.slice(0, -1);
    }
    return path;
  }

  /*
   * Interact with the object
   */
  async interact(player, room) {
    // keep landmarks that can't be collected
    switch (this.description) {
      case "fountain":
        return true;
      case "flag":
        return true;
    }
    // don't keep things that are collected
    return false;
  }

  getDescription() {
    return this.description;
  }
}
