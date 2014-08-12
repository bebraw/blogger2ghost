'use strict';

var cheerio = require('cheerio');
var snakeCase = require('change-case').snakeCase;
var flatten = require('annofp').flatten;
var is = require('annois');
var unidecode = require('unidecode');

var convertTag = require('./convert_tag');
var toMarkdown = require('./to_markdown');


module.exports = function(json, extend) {
    extend = extend || function(data) {
        return data;
    };

    if(!json.feed) {
        return {};
    }

    var slugs = [], images = [];

    var posts = json.feed.entry ? json.feed.entry.map(function(post, i) {
        var title = post.title['$t'].trim(),
            slug = snakeCase(unidecode(title)),
            html = post.content['$t'],
            markdown = tomd(html),
            published = Date.parse(post.published['$t']);

        // prevent duplicate slugs (suffix post index if slug exists)
        slug = slugs.indexOf(slug) === -1 ? slug : slug + i;
        slugs.push(slug);

        // grab a post's images and add to global images array (for download later)
        var postImages = markdown.match(/\[!\[]\((.*?)\)/);
        if (postImages !== null) {
            postImages.forEach(function(image){
                images.push(image.replace('[![](', '').replace(/.(jpg|JPG|jpeg|JPEG|gif|GIF|png|PNG)\)/, '.$1'));
            });
        }

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
            'author_id': 1,
            'created_at': published,
            'created_by': 1,
            'updated_at': Date.parse(post.updated['$t']),
            'updated_by': 1,
            'published_at': published,
            'published_by': 1
        }, post);
    }): [];

    var tagIds = {};
    var tags = json.feed.category ? json.feed.category.map(function(category, i) {
        var name = convertTag(category.term);

        tagIds[name] = i;

        return {
            id: i,
            name: name,
            slug: snakeCase(unidecode(name)),
            description: ''
        };
    }): [];

    var postsTags = json.feed.entry ? flatten(json.feed.entry.map(function(post, i) {
        if(!is.array(post.category)) {
            return [];
        }

        return post.category.map(function(category) {
            var term = convertTag(category.term);
            var tagId = tagIds[term];

            if(!is.defined(tagId)) {
                console.error(term + ' doesn\'t have a tag associated to it!');

                return {};
            }

            return {
                'tag_id': tagId,
                'post_id': i
            };
        });
    })): [];

    return {
        meta: {
            'exported_on': Date.now(),
            version: '000'
        },
        images: images,
        data: {
            posts: posts,
            tags: tags,
            'posts_tags': postsTags
        }
    };
};

function tomd(html) {
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

    // remove tables
    html = html.replace(/<table(.*?)>|<thead(.*?)>|<tbody(.*?)>|<tr(.*?)>|<td(.*?)>|<\/td>|<\/tr>|<\/tbody>|<\/thead>|<\/table>/gi, '');

    var markdown = toMarkdown(html);

    markdown = markdown
        .replace(/&nbsp;/gi, ' ') // remove nbsp's
        .replace(/&amp;/g, '&') // replace ampersands
        .replace(/  +/g, ' ') // remove double spaces
        .replace(/\!\[]\((.*?)\)/g, '![]($1)\n\n') // add double line break after images
        .replace(/(\n\s+)/g, '\n\n') // remove space at beginning of a line
        .trim(); // remove trailing whitespace

    return markdown;
}
