'use strict'
const utils = require('loader-utils');
const pug = require('pug');

module.exports = function (source) {
    this.cacheable && this.cacheable(true);
    
    // get config
    var config = utils.getLoaderConfig(this, "pug");
    
    // fill out anything else needed in the config
    config.filename = this.resourcePath;
    config.basedir = config.locals.basedir;
    config.doctype = "html";
    config.compileDebug = false;
    
    // compile the template to a function
    const tmplFunc = pug.compile(source, config);

    tmplFunc.dependencies.map( this.addDependency.bind(this) );
    
    tmplFunc(config.locals);
    return "";
}
