#!/bin/bash

build=$1
if [[ $build = 'passing' ]]; then
  sed -i '1s/.*/'"![Code Build](https:\/\/img.shields.io\/badge\/build-$build-brightgreen)"'/' ./README.md
else
  sed -i '1s/.*/'"![Code Build](https:\/\/img.shields.io\/badge\/build-$build-red)"'/' ./README.md
fi