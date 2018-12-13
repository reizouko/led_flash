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

class App extends Component {
  changePattern(newPattern) {
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
  }
  
  render() {
    return (
      <div>
        <button onClick={this.changePattern.bind(this, "Flash3")}>Flash</button>
        <button onClick={this.changePattern.bind(this, "Parabola")}>Parabola</button>
        <button onClick={this.changePattern.bind(this, "Off")}>Off</button>
      </div>
    );
  }
}

export default App;
