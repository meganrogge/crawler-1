export class ObjectConfig {
    constructor(){
        this.objects = [
          "Chest1_closed",
          "Chest2_opened",
          "fountain",
          "Rock_1",
          "Rock_2",
          "over_grass_flower1",
          "flag",
          "lever",
          "jewel",
          "key",
          "coin",
          "ruby",
          "sapphire",
          "dragon",
          "cupcake"
        ];
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
            dragon: 0,
            cupcake: 0
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
            cupcake: "knock"
          };
           this.descriptions = {
            Chest1_closed: "red chest",
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
            cupcake: "cupcake"
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
            dragon: -20,
            cupcake: 30
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
            cupcake: true
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
            cupcake: false
          }
    }
}