#!/bin/bash
script/make.sh
script/watch.sh &
ruby -run -ehttpd assets -p8000
