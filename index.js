'use strict'
const utils = require('loader-utils');
const pug = require('pug');

module.exports = function (source) {
    this.cacheable && this.cacheable(true);
    
    // get config
    var config = utils.getLoaderConfig(this, "pug");
    
    // fill out anything else needed in the config
    config.filename = this.resourcePath;
    config.doctype = "html";
    config.compileDebug = false;
    config.pretty = true;

    // we can overload the webpack options object to share locals across files
    // if thats not present, then lets go ahead and just grab any configuration locals
    config.locals = utils.getLoaderConfig(this, "locals");
    config.basedir = config.locals.basedir;

    // compile the template to a function
    const tmplFunc = pug.compile(source, config);

    tmplFunc.dependencies.map( this.addDependency.bind(this) );
    
    // we need to return the rendered template so we can output it
    return tmplFunc(config.locals);
}
