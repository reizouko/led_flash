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
    this.musics = [
      { label: "White snow", filename: "whitesnow.mp3", id: "whitesnow" },
      { label: "きよしこの夜", filename: "kiyosikonoyoru.mp3", id: "kiyosikonoyoru" }
    ];
    this.state = {
      currentPatternName: "Off",
      patterns: [],
      currentMusic: "Off"
    };
    this.changePattern = this.changePattern.bind(this);
    this.changeMusic = this.changeMusic.bind(this);
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
  
  changeMusic(event) {
    const newMusic = event.target.value;
    console.log(`change music to ${newMusic}`);
    const currentMusic = this.state.currentMusic;
    if (currentMusic !== "Off") {
      document.getElementById(currentMusic).pause();
    }
    if (newMusic !== "Off") {
      const targetAudio = document.getElementById(newMusic);
      targetAudio.currentTime = 0;
      targetAudio.play();
    }
    this.setState({ currentMusic: newMusic });
  }
  
  render() {
    return (
      <Grid container className="root" spacing={32}>
        <Grid item xs={8}>
          <Paper className="paper">
            <Typography variant="h5" component="h3">
              点滅パターン
            </Typography>
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
                        <FormControlLabel value={pattern.patternName} label={pattern.patternLabel} control={<Radio color="primary"/>}/>
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
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className="paper">
            <Typography variant="h5" component="h3">
              音楽
            </Typography>
            <Grid container spacing={16}>
              <Grid item>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="Music"
                    onChange={this.changeMusic}
                    name="music"
                    value={this.state.currentMusic}>
                    {
                      this.musics.map(music =>
                        <FormControlLabel value={music.id} label={music.label} control={<Radio/>}/>
                      )
                    }
                    <FormControlLabel value="Off" label="Off" control={<Radio/>}/>
                  </RadioGroup>
                </FormControl>
                {
                  this.musics.map(music =>
                    <audio src={music.filename} preload="auto" loop="true" id={music.id}/>
                  )
                }
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            音楽素材提供
          </Typography>
          <p>
            Music-Note.jp<br />
            URL：<a href="http://www.music-note.jp/" target="_blank">http://www.music-note.jp/</a><br />
            運営：株式会社ピクセル<br />
            URL：<a href="http://pixel-co.com/" target="_blank">http://pixel-co.com/</a><br />
          </p>
          <p>
            ポケットサウンド – <a href="https://pocket-se.info/" target="_blank">https://pocket-se.info/</a>
          </p>
        </Grid>
      </Grid>
    );
  }
}

export default App;
