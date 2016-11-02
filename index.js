'use strict'
const utils = require('loader-utils');
const pug = require('pug');

module.exports = function (source) {
    this.cacheable && this.cacheable(true);
    
    // get config
    let config = utils.getLoaderConfig(this, "pug");
    
    // fill out anything else needed in the config
    config.filename = this.resourcePath;
    config.doctype = "html";
    config.compileDebug = false;
    config.pretty = true;

    // we can overload the webpack options object to share locals across files
    // if thats not present, then lets go ahead and just grab any configuration locals
    config.locals = utils.getLoaderConfig(this, "locals");
    config.basedir = config.locals.basedir;

    let tmplFunc = "";
    
    // if data, then we are using markdown files
    if ( source.data ){
        config.locals.page = source.data;
        
        if (source.content) {
            config.locals.page.content = source.content;    
        }
        
        if (source.data.slug) {
            config.filename = `${source.data.slug}.html`;
            this.resourcePath = `${source.data.slug}`;
        }
        tmplFunc = pug.compile(source.data.template, config);
        tmplFunc.dependencies.map( this.addDependency.bind(this) );
        // we need to return the rendered template so we can output it
        source.content = tmplFunc(config.locals);
        source.resourcePath = this.resourcePath;
    }
    else {
        // compile the template to a function
        tmplFunc = pug.compile(source, config);
        tmplFunc.dependencies.map( this.addDependency.bind(this) );
        // we need to return the rendered template so we can output it
        source = tmplFunc(config.locals);
    }
    
    return source;
}
