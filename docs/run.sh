#!/bin/bash
./make.sh
./watch.sh &
ruby -run -ehttpd site -p8000
