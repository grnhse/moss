#!/bin/bash
moss/make.sh
moss/watch.sh &
ruby -run -ehttpd moss/site -p80
