## Description

This repository contains a source files of the small browser puzzle game [Four Sides](https://shekn.itch.io/four-sides). This game is written on [TypeScript](https://www.typescriptlang.org/) by using simple HTML 2d-Canvas for graphics and [bitECS](https://github.com/NateTheGreatt/bitECS) library for game logic.

## Game rules

The game is a mix of tetris and 2048.

You have a canvas with square tiles of two colors. At each step you can shift all tiles to one of four direction by using arrow keys. After move some random tiles are appear. If a line (vertical or horizontal) contains tiles of one color, then it disappears and the global score increased by 1. The game finish when there are no empty space on the canvas.

## Game versions

It is possible to create different versions of the game by tweaking values in the ```constants.ts``` file. Some versions are easy to play (may be even without finish), in some of them it's impossible to get at least 1 item in the score.