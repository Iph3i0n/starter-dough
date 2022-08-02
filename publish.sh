#!/bin/bash
NODE_ENV='production' npx webpack
cp ./package.json ./dist/package.json
cd ./dist
sed -i 's/0.0.0/$RELEASE_VERSION/g' package.json
npm publish --access public