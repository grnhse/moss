# sort filenames by depth then path
find ./content -name '*.txt' \
  | awk -F/ '{printf("%04d %s\n", NF, $0)}' \
  | sort \
  | xargs cat > moss/site/data.txt
