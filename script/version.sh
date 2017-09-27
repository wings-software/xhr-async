version=$(node -p "require('./package.json').version")
str="if (typeof(window) === 'undefined') { xhr.defaults.headers.common['User-Agent'] = 'xhr-async/$version' }"

echo -e "\n\n$str" >> dist/xhr-async.js