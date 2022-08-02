#! bin/bash
rm -r dist
NODE_ENV='production' webpack
cp ./package.json ./dist/package.json
RELEASE_VERSION=${GITHUB_REF#refs/*/}
sed -i 's/VERSION_NUMBER/$RELEASE_VERSION/g' ./dist/package.json