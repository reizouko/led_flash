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

import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

class App extends Component {
  constructor() {
    super();
    this.state = {
      pattern: "Off"
    };
    this.changePattern = this.changePattern.bind(this);
  }
  
  changePattern(event) {
    const newPattern = event.target.value;
    console.log(`change to ${newPattern}`);
    fetch("/flash", {
      method: "PUT",
      cache: "no-cache",
      headers: {
          "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        pattern: newPattern
      })
    });
    this.setState({ pattern: newPattern });
  }
  
  render() {
    return (
      <Grid container className="root">
        <Grid item>
          <Paper className="paper">
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Flashing pattern"
                onChange={this.changePattern}
                name="pattern"
                value={this.state.pattern}>
                {
                  [
                    { label: "同時に点滅", value: "HalfSync" },
                    { label: "交互に点滅", value: "Half" },
                    { label: "交互に早く点滅", value: "HalfFast" },
                    { label: "交互に3回ずつ点滅", value: "Flash3" },
                    { label: "交互に緩やかに点滅", value: "Parabola" },
                    { label: "同時に緩やかに点滅してしばらくキープ", value: "LinearAndKeepSync" },
                    { label: "交互に緩やかに点滅してしばらくキープ", value: "LinearAndKeep" },
                    { label: "つきっぱなし", value: "On" },
                    { label: "消す", value: "Off" }
                  ].map(pattern =>
                      <FormControlLabel value={pattern.value} label={pattern.label} control={<Radio/>}/>
                  )
                }
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default App;
