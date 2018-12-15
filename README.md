led_flash
======================
Controls your led illumination with your Raspberry Pi.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Copyright](#copyright)

## Prerequisites

1. You have Raspberry Pi with 40 pins
2. You have a led illumination. it's much better you have two.
3. You created a circuit to supply a current to one led with Pin12 (GPIO18) and the other led with Pin33(GPIO13)

## Installation

Prepare the latest nodejs and npm to your Raspberry Pi referring to:  
https://github.com/nodesource/distributions/blob/master/README.md

    $ curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
    $ sudo apt-get install -y nodejs

clone repository

    $ git clone https://github.com/reizouko/led_flash.git

install libraries

    $ cd led_flash
    $ npm install

## Usage

Build client side  
You have to rebuild when client side source code modified

    $ npm run build

Execute server.js with root privilege  
Root is required for controlling GPIO PWM

    $ sudo node server.js

Access to http://(Raspberry Pi's hostname or IP):8080/

You can stop the server with press Ctrl+C

## Copyright

see ./LICENSE

Copyright 2018 Plus Project
