# sort filenames by depth then path
find -L content -name '*.txt' \
  | awk -F/ '{printf("%04d %s\n", NF, $0)}' \
  | sort \
  | cut -d ' ' -f 2 \
  | xargs cat > moss/site/data.txt
