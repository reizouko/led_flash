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
import { fromJS } from 'immutable';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentPatternName: "Off",
      patterns: []
    };
    this.changePattern = this.changePattern.bind(this);
  }
  
  componentDidMount() {
    fetch("/patterns").then(response => response.json()).then(data => {
      const patterns = data.map(pattern => {
        if (pattern.speedInit) {
          pattern.currentSpeed = pattern.speedInit;
          delete pattern.speedInit;
        }
        return pattern;
      });
      this.setState({
        patterns: patterns
      });
    });
  }
  
  changePattern(event) {
    const newPatternName = event.target.value;
    console.log(`change to ${newPatternName}`);
    this.sendPatternAndSpeed(newPatternName, this.state.patterns.find(pattern => pattern.patternName === newPatternName).currentSpeed);
    this.setState({ currentPatternName: newPatternName });
  }
  
  changeSliderValue(patternName, newSpeed) {
    const newPatterns = fromJS(this.state.patterns).map(pattern =>
      pattern.get("patternName") === patternName ? pattern.set("currentSpeed", newSpeed) : pattern
    ).toJS();
    this.setState({
      patterns: newPatterns
    });
  }
  changeSpeed(patternName) {
    if (this.state.currentPatternName === patternName) {
      const speed = this.state.patterns.find(pattern => pattern.patternName === patternName).currentSpeed;
      console.log(`change speed of ${patternName} to ${speed}`);
      this.sendPatternAndSpeed(patternName, speed);
    }
  }
  
  sendPatternAndSpeed(patternName, speed) {
    fetch("/flash", {
      method: "PUT",
      cache: "no-cache",
      headers: {
          "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        pattern: patternName,
        speed: speed
      })
    });
  }
  
  render() {
    return (
      <Grid container className="root">
        <Grid item>
          <Paper className="paper">
            <Grid container spacing={16}>
              <Grid item xs={6}>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="Flashing pattern"
                    onChange={this.changePattern}
                    name="pattern"
                    value={this.state.currentPatternName}>
                    {
                      this.state.patterns.map(pattern =>
                        <FormControlLabel value={pattern.patternName} label={pattern.patternLabel} control={<Radio/>}/>
                      )
                    }
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Typography>点滅の速さ</Typography>
                {
                  this.state.patterns.map(pattern => pattern.speedMax ?
                    <div className="slider_area">
                      <Slider
                        min={pattern.speedMin}
                        max={pattern.speedMax}
                        value={pattern.currentSpeed}
                        disabled={this.state.currentPatternName !== pattern.patternName}
                        onDragEnd={this.changeSpeed.bind(this, pattern.patternName)}
                        onChange={(event, value) => this.changeSliderValue(pattern.patternName, value)}/>
                    </div> : <div className="slider_area"></div>
                  )
                }
              </Grid>
            </Grid>
            <audio src="./whitesnow.mp3" preload="auto" loop="true" id="music_whitesnow"/>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default App;
