#!/bin/bash
  
##
# Bring a checked out template repository to a working form
#
# Usage: source this file and run install-app
# TODO: Create a scaffolding script, a la init.sh
#       which asks name, clones kangaroo, sets up remotes (origin, upstream)
#             pulls database, find/sed name from all files
#
# TODO: later on, can add DB independence (mongo vs. redis vs. hyperdex)
# TODO: Need to promote FORKS instead of CLONES
##

REDIS_VERSION="2.8.17"
APP_NAME="k2" # That's just a default value, user is prompted for change later

function epilogue {
  echo "Run 'launch-app'"
}

function install-redis {
  echo "Installing redis"
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

function init {
  # init via clone, not FORK~!
  default="k2"
  read -p "Project name [$default]: " APP_NAME
  APP_NAME=${APP_NAME:-$default}
  echo "Creating node project for $APP_NAME"
  git clone git@github.com:nvasilakis/kangaroo.git "./${APP_NAME}"
  cd "./${APP_NAME}"

  default="git@github.com:nvasilakis/${APP_NAME}.git"
  read -p "Make sure you've created the origin (remote git repository).\nURL for origin [$default]: " ORIGIN
  ORIGIN=${ORIGIN:-$default}
  echo "Setting remote URLs for origin (ssh) and upstream (https)"
  git remote set-url origin "${ORIGIN}"
  git remote add upstream 'https://github.com/nvasilakis/kangaroo.git'
  git pull upstream master # -- pulling any latest changes

  default="Kool Projektz"
  read -p "Description/tagline [$default]: " DESC
  DESC=${ODESC:-$default}

  default="git@github.com:nvasilakis/${APP_NAME}.git"
  read -p "Homepage: " HOMEPAGE
  HOMEPAGE=${HOMEPAGE:-$default}

  sed "s/Kangaroo/${APP_NAME}/" package.json | sed "s/A node.js template application for quick scaffolding\!/${DESC}/" | sed "s/kangaroo.vasilak.is/${HOMEPAGE}/" > package.json_BK
  mv package.json_BK package.json

  echo "Pulling dependencies"
  npm install

  echo "Install a database (e.g., install-redis for redis.io)"
}

function launch-app {
  pwd
  cd ${APP_NAME}
  ./redis/src/redis-server &
  ./scripts/populateDB.js
  node app.js
}

