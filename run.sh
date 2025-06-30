#!/usr/bin/env bash
set -e
npm install
cd hell-app
docker-compose up -d
cd ..
npm run start

