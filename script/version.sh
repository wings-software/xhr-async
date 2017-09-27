version=$(node -p "require('./package.json').version")
str="xhr.defaults.headers.common['User-Agent'] = 'xhr-async/$version';"

echo -e "\n\n$str" >> dist/xhr-async.js