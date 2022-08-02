#! bin/bash
rm -r dist
NODE_ENV='production' webpack
cp ./package.json ./dist/package.json
sed -i 's/VERSION_NUMBER/$RELEASE_VERSION/g' ./dist/package.json
cd ./dist
npm publish --access public