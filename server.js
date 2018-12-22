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

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {
  led1,
  led2,
  open,
  Linear,
  LinearAndKeep,
  SineWave,
  Parabola1,
  Parabola2,
  Flash3,
  Half,
  SyncMusic,
  On,
  Off,
  close
} = require('./flashing_pattern.js');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'build')));

let led1Flash;
let led2Flash;

const patterns = [
  { patternLabel: "同時に点滅", patternName: "HalfSync", speedMin: 1, speedMax: 200, speedInit: 10 },
  { patternLabel: "交互に点滅", patternName: "Half", speedMin: 1, speedMax: 200, speedInit: 10 },
  { patternLabel: "交互に3回ずつ点滅", patternName: "Flash3", speedMin: 1, speedMax: 80, speedInit: 20 },
  { patternLabel: "交互に緩やかに点滅その1", patternName: "Parabola1", speedMin: 1, speedMax: 100, speedInit: 10 },
  { patternLabel: "交互に緩やかに点滅その2", patternName: "Parabola2", speedMin: 1, speedMax: 100, speedInit: 10 },
  { patternLabel: "同時に緩やかに点滅してしばらくキープ", patternName: "LinearAndKeepSync", speedMin: 1, speedMax: 100, speedInit: 10 },
  { patternLabel: "交互に緩やかに点滅してしばらくキープ", patternName: "LinearAndKeep", speedMin: 1, speedMax: 100, speedInit: 10 },
  { patternLabel: "つきっぱなし", patternName: "On" },
  { patternLabel: "消す", patternName: "Off" }
];

app.get('/patterns', (req, res) => {
  res.json(patterns);
});

app.put('/flash', (req, res) => {
  led1Flash.stop();
  led2Flash.stop();

  const targetPattern = patterns.find(pattern => pattern.patternName === req.body.pattern);
  
  if (!targetPattern) {
    res.json({
      "result": "NG"
    });
    return;
  }
  
  let speed = parseInt(req.body.speed);
  if (isNaN(speed)) {
    if (targetPattern.speedMax) {
      speed = parseInt((targetPattern.speedMin + targetPattern.speedMax) / 2);
    }
  } else if (speed < targetPattern.speedMin) {
    speed = targetPattern.speedMin;
  } else if (speed > targetPattern.speedMax) {
    speed = targetPattern.speedMax;
  }

  console.log(`pattern = ${targetPattern.patternName}, speed = ${speed}`);
  
  let period;
  switch (targetPattern.patternName) {
    case "HalfSync":
      period = 30000 / speed;
      led1Flash = new Half(led1, period, 0);
      led2Flash = new Half(led2, period, 0);
      break;
    case "Half":
      period = 30000 / speed;
      led1Flash = new Half(led1, period, 0);
      led2Flash = new Half(led2, period, period / 2);
      break;
    case "Flash3":
      period = 40000 / speed;
      led1Flash = new Flash3(led1, period, 0);
      led2Flash = new Flash3(led2, period, period / 2);
      break;
    case "Parabola1":
      period = 30000 / speed;
      led1Flash = new Parabola1(led1, period, 0);
      led2Flash = new Parabola1(led2, period, period / 2);
      break;
    case "Parabola2":
      period = 30000 / speed;
      led1Flash = new Parabola2(led1, period, 0);
      led2Flash = new Parabola2(led2, period, period / 2);
      break;
    case "LinearAndKeepSync":
      period = 60000 / speed;
      led1Flash = new LinearAndKeep(led1, period, 0);
      led2Flash = new LinearAndKeep(led2, period, 0);
      break;
    case "LinearAndKeep":
      period = 60000 / speed;
      led1Flash = new LinearAndKeep(led1, period, 0);
      led2Flash = new LinearAndKeep(led2, period, period / 2);
      break;
    case "On":
      led1Flash = new On(led1);
      led2Flash = new On(led2);
      break;
    default:
      led1Flash = new Off(led1);
      led2Flash = new Off(led2);
      break;
  }

  led1Flash.start();
  led2Flash.start();
  
  res.json({
    "result": "OK"
  });
});

process.on('SIGINT', () => {
  led1Flash.stop();
  led2Flash.stop();
  close();
  process.exit();
});

app.listen(port, () => {
  // init led flashes with Off
  open();
  led1Flash = new Off(led1);
  led2Flash = new Off(led2);
  led1Flash.start();
  led2Flash.start();
  console.log(`server listening on port ${port}`);
});
