const key = "base-config";
const version = 1;
let speaker = window.speechSynthesis;
class Settings {
  constructor() {
    this.mode = "auto";
    this.sound = true;
    this.delay = 300;
    this.dictation = false;
    this.voice = "Alex";
    this.rate = 1;
    this.pitch = 1;
    this.backgroundMusic = false;
    this.fixedGame = false;
    this.includeObstacles = false;
  }

  persist() {
    const data = {
      version: version,
      mode: this.mode,
      sound: this.sound,
      delay: this.delay,
      dictation: this.dictation,
      voice: this.voice,
      rate: this.rate,
      pitch: this.pitch,
      backgroundMusic: this.backgroundMusic,
      fixedGame: this.fixedGame,
      includeObstacles: this.includeObstacles
    };
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
  }

  restore() {
    const json = localStorage.getItem(key);
    if (json) {
      const data = JSON.parse(json);
      if (data.version == version) {
        this.mode = data.mode;
        this.sound = data.sound;
        this.delay = data.delay;
        this.dictation = data.dictation;
        this.voice = data.voice;
        this.rate = data.rate;
        this.pitch = data.pitch;
        this.backgroundMusic = data.backgroundMusic;
        this.fixedGame = data.fixedGame;
        this.includeObstacles = data.includeObstacles;
      }
    }
  }
}

let populateVoiceList = () => {
  if(typeof speaker === 'undefined') {
    return;
  }
  var voices = speaker.getVoices().filter(voice => voice.lang == "en-US");

  for(let i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name;
    option.setAttribute('voice-name', voices[i].name);
    console.log(option);
    document.getElementById("voiceSelect").appendChild(option);
  }
}


const settings = new Settings();

// for it to work in Safari:
populateVoiceList();

// for it to work in Chrome:
window.speechSynthesis.onvoiceschanged = () => {
  populateVoiceList();
}

settings.restore();

export default settings;