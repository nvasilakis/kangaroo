#!/bin/bash
  
##
# Bring a checked out template repository to a working form
#
# Usage: ./trymenode
##

function epilogue {
  echo "Change the name of the project, edit .git/config, and commit changes"
}

npm install
rm $0

echo "Should we launch app? [Y/n]"
read repl
epilogue
if [[ $repl == "n" ]]; then
  exit
fi

node app.js
