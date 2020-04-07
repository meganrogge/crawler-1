export class ObjectConfig {
    constructor(){
        this.enemies = [
          "ghost",
          "medusa",
          "troll",
          "lava_monster",
          "dragon"
        ],
        this.objects = [
          ["mushrooms", "fountain", "over_grass_flower1", "ogre"],
          ["arrow", "jewel", "coin", "ruby", "sapphire", "cupcake", "ogre"],
          ["jewel", "coin", "ruby", "sapphire", "cupcake", "ogre"],
          ["jewel", "Chest2_closed", "coin", "key", "sapphire", "cupcake", "ogre"],
          ["over_grass_flower1", "Chest1_closed", "key", "coin", "ogre"]
        ];
        this.objectsNoLimit = [
          ["mushrooms", "fountain", "over_grass_flower1"],
          ["arrow", "jewel", "coin", "ruby", "sapphire", "cupcake"],
          ["jewel", "coin", "ruby", "sapphire", "cupcake"],
          ["jewel", "coin", "sapphire", "cupcake"],
          ["over_grass_flower1", "Chest1_closed", "coin"]
        ];
        // the max number of objects w index 0 corresponding to the number of enemies
        this.frequencies = {
           key: 1,
           ghost: 3,
           medusa: 4,
           troll: 3,
           lava_monster: 3,
           dragon: 3, 
           ogre: 3
        }
         this.heights = {
            Chest1_closed: 0,
            Chest2_closed: 0,
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
            medusa : 0,
            troll : 0,
            lava_monster : 1/4,
            dragon: 0,
            mushrooms: 0,
            arrow: 0
          };
           this.audio = {
            Chest1_closed: "knock",
            Chest2_closed: "knock",
            fountain: "waterfall",
            over_grass_flower1: "ding",
            Rock_1: "thump",
            Rock_2: "thump",
            flag: "thump",
            lever: "thump",
            jewel: "jewel",
            key: "ding",
            coin: "cha_ching",
            ruby: "jewel",
            sapphire: "jewel",
            dragon: "dragon_roar",
            cupcake: "yum",
            ogre: "timpani_failure",
            ghost: "ghost",
            medusa : "timpani_failure",
            troll : "timpani_failure",
            lava_monster : "timpani_failure",
            mushrooms: "slurp",
            arrow: "timpani_failure"
          };
           this.descriptions = {
            Chest1_closed: "locked red chest",
            Chest2_closed: "locked green chest",
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
            medusa : "medusa",
            troll : "troll",
            lava_monster : "lava_monster",
            mushrooms: "mushrooms",
            arrow: "arrow"
          };
          this.animations = {
            
          };
          this.power = {
            Chest1_closed: 2,
            Chest2_closed: 3,
            fountain: 10,
            over_grass_flower1: 2,
            Rock_1: 1,
            Rock_2: 1,
            flag: 3,
            lever: 2,
            jewel: 10,
            key: 15,
            coin: 15,
            ruby: 10,
            sapphire: 10,
            dragon: -60,
            cupcake: 30,
            ogre: -5,
            ghost: -20,
            medusa: -30,
            troll: -40,
            lava_monster: -50,
            mushrooms: 30,
            arrow: 20
          };
          this.isCollectible = {
            Chest1_closed: false,
            Chest2_closed: false,
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
            medusa: false,
            troll: false,
            lava_monster: false,
            mushrooms: true,
            arrow: true
          }
          this.isAnimated = {
            Chest1_closed: false,
            Chest2_closed: false,
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
            medusa: true,
            troll: true,
            mushrooms: false,
            arrow: false
          }
    }
}