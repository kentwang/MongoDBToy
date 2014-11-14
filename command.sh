# remove commas and UTF-8 special characters
# add commas as field delimiters
sed 's/,//g' 260mv.csv | tr -cd '\11\12\15\40-\176' | awk '{ $1=$1","; $2=$2",";$3=$3",";  print }' > 260mv_clean.csv

# import the 260mv_clean.csv file into mongoDB
mongoimport --db users --collection movies --type csv --headerline --file ~/Dropbox/2014\ Fall/CS\ 557/assignments/assignment\ 7/data/260mv_clean.csv