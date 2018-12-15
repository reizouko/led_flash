led_flash
======================
ラズパイでWebサーバ立てて、ブラウザからLED電飾の点滅を制御するやつ。

Web App that controls led illuminations from Raspberry Pi.

English follows Japanese.

## Table of Contents

- [前提条件](#前提条件)
- [インストール](#インストール)
- [使い方](#使い方)
- [著作権](#著作権)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Copyright](#copyright)

## 前提条件

1. 40本ピンがあるラズパイをお手元に用意してね。
2. そんで、5V以内で動作して、ただ光るだけのLED電飾も用意してね。2本あるといい感じだよ。
3. 12番ピン(GPIO18)と33番ピン(GPIO12)それぞれに電流が流れると、それぞれのLED電飾がつくように回路を作ってね。

## インストール

ここを参考にして、最新のNode.jsとnpmをインストールしてね。  
https://github.com/nodesource/distributions/blob/master/README.md

    $ curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
    $ sudo apt-get install -y nodejs

まずリポジトリをクローンするよ。

    $ git clone https://github.com/reizouko/led_flash.git

そしたら、このコマンドでライブラリをインストールしてね。

    $ cd led_flash
    $ npm install

## 使い方

まずクライアント側のソースをビルドするよ。  
時間かかって面倒なんだけど、クライアント側のソースを修正するたびにビルドし直してね。

    $ npm run build

root権限で、server.jsを実行してね。  
なんでrootなのかって言うと、GPIOでPWMを使うために必要なんだ。

    $ sudo node server.js

そしたらブラウザから、http://(ラズパイのホスト名またはIP):8080/ にアクセスしてね。

サーバを止めるには、Ctrl+CでOKだよ。

## Copyright

LICENSEファイルを見てね。

Copyright 2018 Plus Project

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
