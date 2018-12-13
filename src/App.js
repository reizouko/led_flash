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
