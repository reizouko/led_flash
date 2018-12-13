/**
 * Copyright 2018 Plus Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const rpio = require('rpio');

const led1 = 12;
const led2 = 33;
module.exports.led1 = led1;
module.exports.led2 = led2;
const clockDivider = 64;
const pwmMax = 1024;
const interval = 15;

function open() {
  rpio.init({
    gpiomem: false,
    mapping: 'physical'
  });
  rpio.open(led1, rpio.PWM);
  rpio.open(led2, rpio.PWM);
  rpio.pwmSetClockDivider(clockDivider);
  rpio.pwmSetRange(led1, pwmMax);
  rpio.pwmSetRange(led2, pwmMax);
}

class FlashingPattern {
  constructor(pin, period, offset) {
    this.pin = pin;
    this.period = period;
    this.offset = offset % period;
  }

  start() {
    let time = this.offset;
    this.timer = setInterval(() => {
      const value = this.calc(time);
      rpio.pwmSetData(this.pin, value);
      time = (time + interval) % this.period;
    }, interval);
  }

  stop() {
    clearInterval(this.timer);
    rpio.pwmSetData(this.pin, 0);
  }
}

class Linear extends FlashingPattern {
  constructor(pin, period, offset) {
    super(pin, period, offset);
    this.slope = pwmMax * 2 / period;
  }

  calc(time) {
    return (time < this.period / 2) ?
      this.slope * time :
      pwmMax * 2 - this.slope * time;
  }
}

class SineWave extends FlashingPattern {
  constructor(pin, period, offset) {
    super(pin, period, offset);
  }

  calc(time) {
    return pwmMax * (Math.sin(2 * Math.PI * time / this.period) + 1) / 2;
  }
}

class Parabola1 extends FlashingPattern {
  constructor(pin, period, offset) {
    super(pin, period, offset);
    this.half = period / 2;
  }

  calc(time) {
    return -pwmMax * time * (time - this.period) / Math.pow(this.half, 2);
  }
}

class Parabola2 extends FlashingPattern {
  constructor(pin, period, offset) {
    super(pin, period, offset);
    this.half = period / 2;
  }

  calc(time) {
    return pwmMax * Math.pow(time / this.half - 1, 2);
  }
}

class Flash3 extends FlashingPattern {
  constructor(pin, period, offset) {
    super(pin, period, offset);
    const flashingDuration = period / 15;
    this.period1Start = 0;
    this.period1End = this.period1Start + flashingDuration;
    this.period2Start = period / 8;
    this.period2End = this.period2Start + flashingDuration;
    this.period3Start = period / 4;
    this.period3End = this.period3Start + flashingDuration;
  }

  calc(time) {
    return (this.period1Start <= time && time < this.period1End) ||
          (this.period2Start <= time && time < this.period2End) ||
          (this.period3Start <= time && time < this.period3End) ?
        pwmMax : 0;
  }
}

class Half extends FlashingPattern {
  constructor(pin, period, offset) {
    super(pin, period, offset);
    this.half = period / 2;
  }

  calc(time) {
    return time < this.half ? pwmMax : 0;
  }
}
module.exports.Half = Half;

class On extends FlashingPattern {
  constructor(pin) {
    super(pin, 1000, 0);
  }

  start() {
    rpio.pwmSetData(this.pin, pwmMax);
  }

  stop() {
    rpio.pwmSetData(this.pin, 0);
  }
}

class Off extends FlashingPattern {
  constructor(pin) {
    super(pin, 1000, 0);
  }

  start() {
    rpio.pwmSetData(this.pin, 0);
  }

  stop() {}
}
module.exports.Off = Off;

function close() {
  rpio.close(led1);
  rpio.close(led2);
}

module.exports.open = open;
module.exports.Linear = Linear;
module.exports.SineWave = SineWave;
module.exports.Parabola1 = Parabola1;
module.exports.Parabola2 = Parabola2;
module.exports.Flash3 = Flash3;
module.exports.On = On;
module.exports.close = close;
