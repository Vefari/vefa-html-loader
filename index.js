'use strict'
const utils = require('loader-utils');
const pug = require('pug');

module.exports = function (source) {
    this.cacheable && this.cacheable(true);
    
    // get config
    let config = utils.getOptions(this);
    
    // fill out anything else needed in the config
    config.filename = this.resourcePath
    config.doctype = config.doctype || "html"
    config.compileDebug = config.compileDebug || false
    config.debug = config.debug || false
    config.pretty = config.pretty || false
    config.self = config.self || false
    config.cache = config.cache || false
    
    config.basedir = config.locals.basedir

    if (config.vefa) {
        config.locals = Object.assign(
            config.locals, 
            {
                Vefa: require('vefa'),
                vefa: {},
                vefari: new Map()
            }
        )
    }

    let context = {
        context: config.context,
        content: source.content ? source.content : source
    }
    let tmplFunc = ""

    // if data, then we are using markdown files
    if ( source.data ){
        config.locals.page = Object.assign({}, source.data)
        
        if (source.data.slug) {
            config.filename = `${source.data.slug}.html`
            this.resourcePath = `${source.data.slug}`
        }

        // console.log(source.data)
        tmplFunc = pug.compile(source.data.template_file, config)
        tmplFunc.dependencies.map( this.addDependency.bind(this) )
        // we need to return the rendered template so we can output it

        source.content = tmplFunc(config.locals)
        source.resourcePath = this.resourcePath;
        
    }
    else {
        let process = true

        if (config.emit) {
            // only process the files we want to emit
            
            // break up the file path into the parts that we need
            let req_parts = utils.interpolateName(
                this,
                "[folder]!![path]!![name]!![ext]",
                context
            )
            
            const [folder, process_path, file, file_ext] = req_parts.split('!!')
            let process_path_parts = process_path.split("/")
            
            let parts_check = config.emit.indexOf(process_path_parts[0]);
            
            // check for a full path
            let path_check = config.emit.indexOf(process_path);
            
            // check for full path plus name
            let deep_file_check = config.emit.indexOf(`${process_path}${file}`);
            let file_check = config.emit.indexOf(`${file}.${file_ext}`);
            
            if ( parts_check < 0 && path_check < 0 && deep_file_check < 0 && file_check < 0) {
                process = false
            } 
        }
        
        if (process) {
            // compile the template to a function
            tmplFunc = pug.compile(source, config)
            // lets make it so that included files drive a re-render of parent files
            tmplFunc.dependencies.map( this.addDependency.bind(this) )
            // we need to return the rendered template so we can output it
            source = tmplFunc(config.locals)
        }
    }
    
    return source;
}
