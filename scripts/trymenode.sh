#!/bin/bash
  
##
# Bring a checked out template repository to a working form
#
# Usage: ./trymenode
##

REDIS_VERSION="2.8.17"

function epilogue {
  echo "Change the name of the project, edit .git/config, and commit changes"
}

function install_redis {
  wget http://download.redis.io/releases/redis-${REDIS_VERSION}.tar.gz
  tar xzf redis-${REDIS_VERSION}.tar.gz redis/
  cd redis/
  make
  echo "To run redis, go to  'redis-${REDIS_VERSION}/src' and type './redis-server &'"
  echo "For the console, type './redis-cli'; to shutdown, type './redis-cli shutdown'"
}

function execute {
  npm install
  rm $0
  
  echo "Should we launch app? [Y/n]"
  read repl
  epilogue
  if [[ $repl == "n" ]]; then
    exit
  fi
  
  node app.js
}
