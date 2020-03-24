export class ObjectConfig {
    constructor(){
        this.enemies = [
          "ghost",
          "meduza",
          "troll",
          "lava_monster",
          "dragon"
        ],
        this.objects = [
          ["mushrooms", "Chest2_opened", "fountain", "over_grass_flower1", "ogre"],
          ["arrow", "jewel", "coin", "ruby", "sapphire", "cupcake", "ogre"],
          ["jewel", "coin", "ruby", "sapphire", "cupcake", "ogre"],
          ["jewel", "coin", "ruby", "sapphire", "cupcake", "ogre"],
          ["flower", "Chest1_closed", "key", "coin", "ogre"]
        ];
        this.objectsNoLimit = [
          ["mushrooms", "Chest2_opened", "fountain", "over_grass_flower1"],
          ["arrow", "jewel", "coin", "ruby", "sapphire", "cupcake"],
          ["jewel", "coin", "ruby", "sapphire", "cupcake"],
          ["jewel", "coin", "ruby", "sapphire", "cupcake"],
          ["flower", "Chest1_closed", "coin"]
        ];
        // the max number of objects w index 0 corresponding to the number of enemies
        this.frequencies = {
           key: 1,
           ghost: 3,
           meduza: 4,
           troll: 4,
           lava_monster: 3,
           dragon: 3
        }
         this.heights = {
            Chest1_closed: 0,
            Chest2_opened: 0,
            fountain: 0,
            over_grass_flower1: -1 / 2,
            Rock_1: -1 / 2,
            Rock_2: -1 / 2,
            flag: 0,
            lever: 0,
            jewel: 0,
            key: 0,
            coin: 0,
            ruby: 0,
            sapphire: 0,
            cupcake: 0,
            ogre : 0,
            ghost : 0,
            meduza : 0,
            troll : 0,
            lava_monster : 1/4,
            dragon: 0,
            mushrooms: 0,
            arrow: 0
          };
           this.audio = {
            Chest1_closed: "knock",
            Chest2_opened: "door_close",
            fountain: "waterfall",
            over_grass_flower1: "ding",
            Rock_1: "thump",
            Rock_2: "thump",
            flag: "thump",
            lever: "thump",
            jewel: "cha_ching",
            key: "ding",
            coin: "cha_ching",
            ruby: "cha_ching",
            sapphire: "cha_ching",
            dragon: "dragon_roar",
            cupcake: "sonic_powerup",
            ogre: "timpani_failure",
            ghost: "ghost",
            meduza : "timpani_failure",
            troll : "timpani_failure",
            lava_monster : "timpani_failure",
            mushrooms: "chimes_powerup",
            arrow: "bounce_powerup"
          };
           this.descriptions = {
            Chest1_closed: "closed red chest",
            Chest2_opened: "open green chest",
            fountain: "fountain",
            over_grass_flower1: "flower",
            Rock_1: "rock",
            Rock_2: "rock",
            flag: "flag",
            lever: "lever",
            jewel: "jewel",
            key: "key",
            coin: "coin",
            ruby: "ruby",
            sapphire: "sapphire",
            dragon: "dragon",
            cupcake: "cupcake",
            ogre: "ogre",
            ghost: "ghost",
            meduza : "meduza",
            troll : "troll",
            lava_monster : "lava monster",
            mushrooms: "mushrooms",
            arrow: "arrow"
          };
          this.animations = {
            
          };
          this.power = {
            Chest1_closed: 2,
            Chest2_opened: 3,
            fountain: 10,
            over_grass_flower1: 2,
            Rock_1: 1,
            Rock_2: 1,
            flag: 3,
            lever: 2,
            jewel: 3,
            key: 15,
            coin: 10,
            ruby: 5,
            sapphire: 5,
            dragon: -40,
            cupcake: 30,
            ogre: -5,
            ghost: -30,
            meduza: -30,
            troll: -30,
            lava_monster: -40,
            mushrooms: 30,
            arrow: 20
          };
          this.isCollectible = {
            Chest1_closed: false,
            Chest2_opened: false,
            fountain: false,
            over_grass_flower1: true,
            Rock_1: false,
            Rock_2: false,
            flag: false,
            lever: false,
            jewel: true,
            key: true,
            coin: true,
            ruby: true,
            sapphire: true,
            dragon: false,
            cupcake: true,
            ogre: false,
            ghost: false,
            meduza: false,
            troll: false,
            lava_monster: false,
            mushrooms: true,
            arrow: true
          }
          this.isAnimated = {
            Chest1_closed: false,
            Chest2_opened: false,
            fountain: false,
            over_grass_flower1: false,
            Rock_1: false,
            Rock_2: false,
            flag: false,
            lever: false,
            jewel: false,
            key: false,
            coin: true,
            ruby: false,
            sapphire: false,
            dragon: true,
            cupcake: false,
            ogre: true,
            ghost: true,
            lava_monster: true,
            meduza: true,
            troll: true,
            mushrooms: false,
            arrow: false
          }
    }
}