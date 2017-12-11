const typogr = require('typogr')

const md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true
})

md
    .use(require('markdown-it-attrs'))
    .use(require('markdown-it-abbr'))
    .use(require('markdown-it-deflist'))
    .use(require('markdown-it-footnote'))
    .use(require("markdown-it-block-image"))
    .use(require('markdown-it-anchor'))


module.exports = (block) => {
    return typogr( md.render(block) ).typogrify()
}
