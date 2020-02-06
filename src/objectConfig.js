export class objectConfig {
    constructor(){
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
            dragon: 0
          };
           this.audio = {
            Chest1_closed: "knock",
            Chest2_opened: "doorClose",
            fountain: "waterfall",
            over_grass_flower1: "ding",
            Rock_1: "thump",
            Rock_2: "thump",
            flag: "thump",
            lever: "thump",
            jewel: "thump",
            key: "thump",
            coin: "ding",
            ruby: "ding",
            sapphire: "ding",
            dragon: "thump"
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
            dragon: "dragon"
          };
          this.animations = {
            Chest1_closed: "explosion",
            Chest2_opened: "explosion",
            fountain: "explosion",
            over_grass_flower1: "explosion",
            Rock_1: "explosion",
            Rock_2: "explosion",
            flag: "particles",
            lever: "particles",
            jewel: "particles",
            key: "particles",
            coin: "particles",
            ruby: "particles",
            sapphire: "particles",
            dragon: "explosion"
          };
           this.rewards = {
            jewel: 1,
            coin: 2,
            ruby: 3,
            sapphire: 4,
            dragon: 20
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
            dragon: false
          }
    }
}