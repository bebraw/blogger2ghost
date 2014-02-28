[![build status](https://secure.travis-ci.org/bebraw/blogger2ghost.png)](http://travis-ci.org/bebraw/blogger2ghost)
# blogger2ghost - Blogspot JSON migrator plugin for Ghost

`blogger2ghost` allows you to convert your Blogspot blog content into [one compatible with Ghost](https://github.com/tryghost/Ghost/wiki/import-format).

## Usage

### cli

1. Get posts in JSON format from your blog using `<your blog>/feeds/posts/default?alt=json&max-results=10000` and save it to some file (say `data.json`)
2. `npm install blogger2ghost -g`. Alternatively you can install and invoke it as a library (ie. `npm install blogger2ghost` and `node_modules/blogger2ghost -i data.json`)
2. `blogger2ghost -i data.json > ghost.json`
3. Surf to `ghost/debug/` at your blog
4. Use `Import` controls to import the data to your blog

### lib

```js
var convert = require('blogger2ghost');


convert({...}, function(data, post) {
    // manipulate data based on post fields (see blogger data content above)
    // you can see data fields available at https://github.com/tryghost/Ghost/wiki/import-format
    ...

    // once you are done with manipulation, return result
    return data;
});
```

## License

`blogger2ghost` is available under MIT. See LICENSE for more details.

