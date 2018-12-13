const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {
  led1,
  led2,
  open,
  Linear,
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
		case "Flash3":
			led1Flash = new Flash3(led1, 2000, 0);
			led2Flash = new Flash3(led2, 2000, 1000);
			break;
		case "Parabola":
			led1Flash = new Parabola1(led1, 3000, 0);
			led2Flash = new Parabola2(led2, 3000, 0);
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

const server = app.listen(port, () => {
	// init led flashes with Off
	open();
	led1Flash = new Off(led1);
	led2Flash = new Off(led2);
	led1Flash.start();
	led2Flash.start();
	console.log(`server listening on port ${port}`);
});
