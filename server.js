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

app.put('/flash', (req, res) => {
  led1Flash.stop();
  led2Flash.stop();

  console.log(`pattern = ${req.body.pattern}`);
  
  switch (req.body.pattern) {
    case "HalfSync":
      led1Flash = new Half(led1, 2000, 0);
      led2Flash = new Half(led2, 2000, 0);
      break;
    case "Half":
      led1Flash = new Half(led1, 2000, 0);
      led2Flash = new Half(led2, 2000, 1000);
      break;
    case "HalfFast":
      led1Flash = new Half(led1, 1000, 0);
      led2Flash = new Half(led2, 1000, 500);
      break;
    case "Flash3":
      led1Flash = new Flash3(led1, 2000, 0);
      led2Flash = new Flash3(led2, 2000, 1000);
      break;
    case "Parabola":
      led1Flash = new Parabola1(led1, 3000, 0);
      led2Flash = new Parabola1(led2, 3000, 1500);
      break;
    case "LinearAndKeepSync":
      led1Flash = new LinearAndKeep(led1, 12000, 0);
      led2Flash = new LinearAndKeep(led2, 12000, 0);
      break;
    case "LinearAndKeep":
      led1Flash = new LinearAndKeep(led1, 12000, 0);
      led2Flash = new LinearAndKeep(led2, 12000, 6000);
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
