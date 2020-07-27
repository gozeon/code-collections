#!/bin/bash

set -x

TEST=40

node --experimental-worker index.js $TEST

sleep 20

node index2.js $TEST
