class KeyControls {
  keys = {};
  codes = {
    "LEFT": 65,
    "RIGHT": 68,
    "FORWARD": 87,
    "BACKWARD": 83,
    "UP": 81,
    "DOWN": 69
  }

  constructor () {
    document.addEventListener("keydown", ::this.down, false);
    document.addEventListener("keyup", ::this.up, false);
  }

  down ({keyCode, key}) {
    //console.log(key, keyCode)
    this.keys[keyCode] = true;
  }

  up ({keyCode, key}) {
    this.keys[keyCode] = false;
  }

  isDown (code) {
    if (isNaN(code)) {
      code = this.codes[code];
    }
    return this.keys[code];
  }
}

module.exports = KeyControls;
