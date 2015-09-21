'use strict';

var cheerio = require('cheerio');
var snakeCase = require('change-case').snakeCase;
var flatten = require('annofp').flatten;
var is = require('annois');
var unidecode = require('unidecode');

var convertTag = require('./convert_tag');
var stripDiacritics = require('./strip_diacritics');
var toMarkdown = require('./to_markdown');

var filenames = [];


var normaliseFilename = function(input) {
    var filename = input.replace(/[^a-z0-9-_]/gi, '_').toLowerCase()
        .replace('_apos', '');

    if (filenames.indexOf(filename) !== -1) {
        filename += filenames.indexOf(filename);
    }

    filenames.push(filename);

    return filename;
};

module.exports = function(json, options, extend) {
    options = options || {};
    options.authors = options.authors || {};

    extend = extend || function(data) {
        return data;
    };

    if (!json.feed) {
        return {};
    }

    var slugs = [],
        images = [];

    var posts = json.feed.entry ? json.feed.entry.map(function(post, i) {
        var title = post.title['$t'].trim();
        var html;

        if(post.content) {
            html = post.content['$t'];
        }
        else {
            console.warn('Post starting with "' +
                title.slice(0, 50) +
                '..." is missing content, using summary instead!!');

            html = post.summary['$t'];
        }

        if(!title) {
            if(!html) {
                return console.warn('Skipping post missing title and content!',
                    JSON.stringify(post, null, 4));
            }

            return console.warn('Skipping post starting with "' +
                html.slice(0, 50) +
                '..." because it is missing title!');
        }

        var slug = snakeCase(unidecode(title)),
            markdown = options.rawHtml ? html : tomd(html, options),
            published = Date.parse(post.published['$t']);

        // prevent duplicate slugs (suffix post index if slug exists)
        slug = slugs.indexOf(slug) === -1 ? slug : slug + i;
        slugs.push(slug);

        if (options.download) {
            // for each image
            markdown = markdown.replace(/\!\[\]\((.*?)\.(jpg|JPG|jpeg|JPEG|gif|GIF|png|PNG)\)/g, function(str, match, ext) {

                // get filename from url
                var name = match.replace(/(\bhttps?:\/\/[^\s()<>]+(?:\([\w\d]+\)|[^[:punct:]\s]|\/))/ig, '');

                // normalise filename
                name = normaliseFilename(name);

                // append extension
                name = [name, ext.toLowerCase().replace('jpeg', 'jpg')].join('.');

                if (name[0] !== '.') {
                    // add to global images array
                    images.push({
                        url: str.replace('![](', '').slice(0, -1),
                        name: name
                    });
                }

                // replace with local content path
                return '![](/content/images/' + options.download + '/' + name + ')';
            });
        }

        var authorName = post.author[0].name['$t'],
            authorId = options.authors[authorName] !== undefined ? options.authors[authorName].id : 1;

        return extend({
            id: i,
            title: title,
            slug: slug,
            markdown: markdown,
            html: html,
            image: null,
            featured: 0,
            page: 0,
            status: 'published',
            language: 'en_US',
            'meta_title': null,
            'meta_description': null,
            'author_id': authorId,
            'created_at': published,
            'created_by': authorId,
            'updated_at': Date.parse(post.updated['$t']),
            'updated_by': authorId,
            'published_at': published,
            'published_by': authorId
        }, post);
    }).filter(id) : [];

    var tagIds = {}, tagSlugs = {};
    var tags = json.feed.category ? json.feed.category.map(function(category, i) {
        var name = convertTag(category.term);

        if(options.stripDiacritics) {
            name = stripDiacritics(name);
        }

        tagIds[name] = i;

        var slug = snakeCase(unidecode(name));

        if (tagSlugs.hasOwnProperty(slug)) {
            // prevent duplicate slugs
            return null;
        }
        tagSlugs[slug] = i;

        return {
            id: i,
            name: name,
            slug: slug,
            description: ''
        };
    }).filter(id) : [];

    var postsTags = json.feed.entry ? flatten(json.feed.entry.map(function(post, i) {
        if (!is.array(post.category)) {
            return [];
        }

        return post.category.map(function(category) {
            var term = convertTag(category.term);

            if(options.stripDiacritics) {
                term = stripDiacritics(term);
            }

            var slug = snakeCase(unidecode(term));
            var tagId = tagSlugs[slug]; // Lookup by slug to normalize tags

            if (!is.defined(tagId)) {
                console.error(term + ' doesn\'t have a tag associated to it!');

                return {};
            }

            return {
                'tag_id': tagId,
                'post_id': i
            };
        });
    })) : [];

    var users = [];
    Object.keys(options.authors).forEach(function(author) {
        users.push({
            name: author,
            id: options.authors[author].id,
            email: options.authors[author].email
        });
    });

    var result = {
        meta: {
            'exported_on': Date.now(),
            version: '000'
        },
        data: {
            posts: posts,
            tags: tags,
            'posts_tags': postsTags
        }
    };

    if (images.length) {
        result.images = images;
    }

    if (users.length) {
        result.data.users = users;
    }

    return result;
};

function tomd(html, options) {
    var $ = cheerio.load(html);

    // remove links from img's that link to themselves
    $('a').replaceWith(function(i, e) {
        if ($(e).find('img').length) {
            if ($(e).attr('href') === $(e).find('img').first().attr('src')) {
                return $(e).find('img').first();
            }
        }

        return $(e);
    });

    html = $.html();

    // remove div's
    html = html.replace(/<div(.*?)>|<\/div>/gi, '');

    // remove span's
    html = html.replace(/<span(.*?)>|<\/span>/gi, '');

    if (options.removeTables) {
        // remove tables
        html = html.replace(/<table(.*?)>|<thead(.*?)>|<tbody(.*?)>|<tr(.*?)>|<td(.*?)>|<\/td>|<\/tr>|<\/tbody>|<\/thead>|<\/table>/gi, '');
    }

    var markdown = toMarkdown(html);

    markdown = markdown
    .replace(/&nbsp;/gi, ' ') // remove nbsp's
    .replace(/&amp;/g, '&') // replace ampersands
    .replace(/  +/g, ' ') // remove double spaces
    .replace(/\!\[]\((.*?)\.(jpg|JPG|jpeg|JPEG|gif|GIF|png|PNG)\)/g, '![]($1.$2)')
    .replace(/(\n\s+)/g, '\n\n') // remove space at beginning of a line
    .trim(); // remove trailing whitespace

    return markdown;
}

function id(a) {
    return a;
}
