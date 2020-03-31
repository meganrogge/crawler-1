import IsoSprite from "./phaser3-plugin-isometric/IsoSprite.js";
import { ObjectConfig } from "./objectConfig.js";
let objectConfig = new ObjectConfig();
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
    this.power = config.power || 0;
    this.isCollectible = config.isCollectible;
    this.isAnimated = config.isAnimated;
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
  path(path, health) {
    if(!this.isCollectible){
      if(health <= objectConfig.power[this.description] && !(objectConfig.enemies.indexOf[this.description] < 0)){
        return [];
      } else if(this.description == "medusa" || this.description == "troll" || this.description == "lava_monster"){
        return [];
      }
      if(path.length > 2){
        console.log(path+ " "+ path.slice(0,-1));
        return path.slice(0, -1);
      } else {
        // don't move because you're already 1 square away
        return [];
      }
    } else {
      return path;
    }
  }

  /*
   * Interact with the object
   */
  async interact(player, room) {
    
  }

  getDescription() {
    return this.description;
  }
}
