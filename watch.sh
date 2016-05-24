command_exists () {
  type "$1" &> /dev/null ;
}

if command_exists fswatch ; then
  fswatch -o ./content | xargs -n1 moss/make.sh
fi
