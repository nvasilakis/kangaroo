#!/bin/bash
  
##
# Bring a checked out template repository to a working form
#
# Usage: source this file and run install-app
##

REDIS_VERSION="2.8.17"
APP_NAME="kangaroo"

function epilogue {
  echo "Run 'launch-app'"
}

function install-redis {
  wget http://download.redis.io/releases/redis-${REDIS_VERSION}.tar.gz
  tar xzf redis-${REDIS_VERSION}.tar.gz 
  cd redis*/
  make
  echo "To run redis, go to  'redis-${REDIS_VERSION}/src' and type './redis-server &'"
  echo "For the console, type './redis-cli'; to shutdown, type './redis-cli shutdown'"
}

function install-app {
  clone-app
  cd ${APP_NAME}
  install-redis
  npm install
  epilogue
}

function clone-app {
  git clone git@github.com:nvasilakis/${APP_NAME}.git
}

function launch-app {
  pwd
  cd ${APP_NAME}
  ./redis/src/redis-server &
  ./scripts/populateDB.js
  node app.js
}
