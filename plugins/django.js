const _tag = (prop, expression="") => {
    if (expression) {
        return `{% ${ prop } ${ expression } %}`
    }

    return `{% ${ prop } %}`
}

const template_filters = (filters) => {
    if (filters.length > 0) {
        let filter_list = [""]
        filter_list.push(...filters)
        filter_list = filter_list.join("|")
        return filter_list
    }
    return ""
}

const _endtag = (prop) => {
    return `{% end${ prop } %}`
}

const _single = (prop, expression="") => {
    let template = `{% ${ prop } %}`

    if (expression) {
        template = `{% ${ prop } ${ expression } %}`
    }

    return template
}

module.exports = (config, locals) => {
    return {
        output_json (obj) {
            return JSON.stringify(obj);
        },

        _tag,
        _endtag,
        _single,
        template_filters,

        v (prop, ...filters) {
            if (locals.shopify || locals.django) {
                return `{{ ${ prop }${ template_filters(filters) } }}`
            }
            else {
                return prop
            }
        },

        test_v (prop, ...filters) {
            return `{{ ${ prop }${ template_filters(filters) } }}`
        },

        static (file) {
            if (locals.django) {
                return _tag("static", `'${ config.static_prefix}${ file }'`)
            }
            else {
                return `/static/${ config.static_prefix}${file}`
            }
        },

        url (slug) {
            if (locals.django) {
                return _single("url", `'${ slug }'`)
            }
            else {
                return slug
            }
        },

        if_else (if_val, else_val) {
            if (locals.django) {
                return `
                    ${ _tag("if", if_val) }
                    ${ v(if_val) }
                    ${ _tag("else") }
                    ${ v(else_val) }
                    ${ _endtag("if") }
                `
            }
            else {
                return if_val ? if_val : else_val
            }
        },

        attr_switch (if_val, then_val) {
            if (locals.django) {
                return `${ _tag("if", if_val) }${ then_val }${ _endtag("if") }`
            }
            else {
                if (if_val) {
                    return then_val
                }
            }
        },

        class_switch (if_val, then_val) {
            if (locals.django) {
                return `${ _tag("if", if_val) }${ then_val } ${ _endtag("if") }`
            }
            else {
                if (if_val) {
                    return then_val
                }
            }
        }

    }
}
