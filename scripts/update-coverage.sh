#!/bin/bash

create_new_shield() {
  local color=$1
  echo $color
  local pct=$2
  code_coverage='![Code Coverage](https:\/\/img.shields.io\/badge\/coverage-'$pct'%25-'$color')' 
  sed -i '2s/.*/'"$code_coverage"'/' ./README.md
}

pct=$(jq '.total.lines.pct' "./coverage/coverage-summary.json")
if (( $(echo "$pct >= 85" | bc -l) )); then
  create_new_shield 'brightgreen' "$pct"
elif (( $(echo "$pct >= 60" | bc -l) )); then 
  create_new_shield 'yellow' "$pct"
else
  create_new_shield 'red' "$pct"
fi