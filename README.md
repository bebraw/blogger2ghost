[![build status](https://secure.travis-ci.org/bebraw/blogger2ghost.png)](http://travis-ci.org/bebraw/blogger2ghost)
# blogger2ghost - Blogspot JSON migrator plugin for Ghost"

`blogger2ghost` allows you to convert your Blogspot blog content into [one compatible with Ghost](https://github.com/tryghost/Ghost/wiki/import-format).

## Usage

1. Get posts in JSON format from your blog using `<your blog>/feeds/posts/default?alt=json&max-results=10000` and save it to some file (say `data.json`)
2. ./index.js -i data.json > ghost.json
3. Surf to `ghost/debug/` at your blog
4. Use `Import` controls to import the data to your blog

## License

`annofuzz` is available under MIT. See LICENSE for more details.
