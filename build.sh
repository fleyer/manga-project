#!/bin/bash
npm cache clean --force

npm --prefix src/front-end install
npm --prefix src/front-end run build 

npm --prefix src/back-end install 
