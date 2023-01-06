#!/bin/bash

cd src/front-end/ 
npm install --legacy-peer-deps 
npm run build 
rm -Rf node_modules
npm prune --omit=dev --legacy-peer-deps

cd ../back-end/
npm install 
