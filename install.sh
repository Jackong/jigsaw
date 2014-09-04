#!/bin/sh
git init
git remote add origin https://github.com/Jackong/jigsaw.git
rm .cocos-project.json
rm -rf src
rm -rf res
rm main.js
rm project.json
rm CMakeLists.txt
rm index.html
git pull origin master
