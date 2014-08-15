[![build status](https://secure.travis-ci.org/bebraw/blogger2ghost.png)](http://travis-ci.org/bebraw/blogger2ghost)

# blogger2ghost - Blogspot JSON migrator plugin for Ghost

`blogger2ghost` allows you to convert your Blogspot blog content into [one compatible with Ghost](https://github.com/tryghost/Ghost/wiki/import-format).

## Usage

### Basic

1. Get posts in JSON format from your blog using `<your blog>/feeds/posts/default?alt=json&max-results=10000` and save it to some file (eg. `data.json`)
2. `$ npm install blogger2ghost -g`
2. `$ blogger2ghost -i data.json > ghost.json`
3. Surf to `ghost/debug/` at your blog
4. Use `Import` controls to import the data to your blog

> Alternatively you can install and invoke it as a library (ie. `$ npm install blogger2ghost` and `node_modules/blogger2ghost -i data.json`)

### Advanced

**Remove tables from posts:**

`$ blogger2ghost -i data.json > ghost.json --remove-tables`

**Supply authors for multi-user Ghost:**

This will attribute imported posts to existing users, you should first create the users within Ghost.

1. Create `authors.json` file e.g.:

    ```js
    {
        "John Smith": { // key should match author name from blogger
            "id": 7, // id is arbitrary
            "email": "john@example.com" // email is used for lookup, must exist
        },
        "Jane Doe": {
            "id": 8,
            "email": "jane@gmail.com"
        }
    }
    ```
2. Run `$ blogger2ghost -i data.json > ghost.json -a authors.json`

**Download images from Blogger:**

This will download all images from existing Blogger posts and place them into a directory ready for upload to Ghost. It will also replace urls with normalised paths that will load from the local `content` directory of Ghost.

    # 'blogger-images' directory will be created
    $ blogger2ghost -i data.json > ghost.json -d blogger-images --download-limit 10


### Custom

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

## Contributors

* [ekaragodin](https://github.com/ekaragodin) - Fixed post import with non latin titles and tags
* [homerjam](https://github.com/homerjam) - Prettification of the output, support for multiple authors and downloading images

## License

`blogger2ghost` is available under MIT. See LICENSE for more details.

