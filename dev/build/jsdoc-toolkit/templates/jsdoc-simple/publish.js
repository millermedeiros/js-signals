
/** Called automatically by JsDoc Toolkit. */
function publish(symbolSet) {
	publish.conf = {  // trailing slash expected for dirs
		ext:         ".html",
		outDir:      JSDOC.opt.d || SYS.pwd+"../out/jsdoc/",
		templatesDir: JSDOC.opt.t || SYS.pwd+"../templates/jsdoc/",
		symbolsDir:  "symbols/",
		srcDir:      "symbols/src/"
	};

    load(publish.conf.templatesDir+'js/mootools-1.2.4-core-server.js');
    load(publish.conf.templatesDir+'js/htmlparser.js');
    load(publish.conf.templatesDir+'js/jsdom.js');
    load(publish.conf.templatesDir+'js/showdown.js');
    markdownConverter = new Showdown.converter();
	
	// is source output is suppressed, just display the links to the source file
	if (JSDOC.opt.s && defined(Link) && Link.prototype._makeSrcLink) {
		Link.prototype._makeSrcLink = function(srcFilePath) {
			return "&lt;"+srcFilePath+"&gt;";
		}
	}

	// create the folders and subfolders to hold the output
	IO.mkPath((publish.conf.outDir+"symbols/src").split("/"));
		
	// used to allow Link to check the details of things being linked to
	Link.symbolSet = symbolSet;

	// create the required templates
	try {
		var classTemplate = new JSDOC.JsPlate(publish.conf.templatesDir+"class.tmpl");
		var classesTemplate = new JSDOC.JsPlate(publish.conf.templatesDir+"allclasses.tmpl");
        var docsIndexTemplate = new JSDOC.JsPlate(publish.conf.templatesDir+"docsindex.tmpl");
        var userDocTemplate = new JSDOC.JsPlate(publish.conf.templatesDir+"userdoc.tmpl");
	}
	catch(e) {
		print("Couldn't create the required templates: "+e);
		quit();
	}
	
	// some ustility filters
	function hasNoParent($) {return ($.memberOf == "")}
	function isaFile($) {return ($.is("FILE"))}
	function isaClass($) {return ($.is("CONSTRUCTOR") || $.isNamespace)}
	
	// get an array version of the symbolset, useful for filtering
	var symbols = symbolSet.toArray();
	
	// create the hilited source code files
	var files = JSDOC.opt.srcFiles;
 	for (var i = 0, l = files.length; i < l; i++) {
 		var file = files[i];
 		var srcDir = publish.conf.outDir + "symbols/src/";
		makeSrcFile(file, srcDir);
 	}

 	// get a list of all the classes in the symbolset
 	var classes = symbols.filter(isaClass).sort(makeSortby("alias"));
	
    // create a filemap in which outfiles must be to be named uniquely,
    // ignoring case
	if (JSDOC.opt.u) {
		var filemapCounts = {};
		Link.filemap = {};
		for (var i = 0, l = classes.length; i < l; i++) {
			var lcAlias = classes[i].alias.toLowerCase();
			
			if (!filemapCounts[lcAlias]) filemapCounts[lcAlias] = 1;
			else filemapCounts[lcAlias]++;
			
			Link.filemap[classes[i].alias] = 
				(filemapCounts[lcAlias] > 1)?
				lcAlias+"_"+filemapCounts[lcAlias] : lcAlias;
		}
	}

    // create a class index, displayed in the left-hand column of every class
    // page

	Link.base = "../";
    var docsConfig = JSDOC.opt.docs;
    var hasDocsList = docsConfig !== undefined && docsConfig !== null && 
                      docsConfig.content instanceof Array && 
                      docsConfig.content.length > 0;
    var docsList = hasDocsList ? docsConfig.content : null;
    if (hasDocsList) {
        for (var i = 0; i < docsList.length; i++) {
            docsList[i].outFile = 'userdocs/' + i + '.html';
        }
    }

    publish.docsIndex = hasDocsList ? docsIndexTemplate.process(docsList) : "";
 	publish.classesIndex = classesTemplate.process(classes); // kept in memory

    // copy resources
    var stdResources = copyResources(publish.conf.outDir+'userdocs/', 
                                  ((docsConfig === null || docsConfig === undefined)
                                    || !docsConfig.resources) ? 
                                      null : 
                                      docsConfig.resources);
    //var stdResources = {};
    var dynResources = {};

    if (hasDocsList) {
        IO.mkPath((publish.conf.outDir+'userdocs').split('/'));

        for (var i = 0; i < docsList.length; i++) {
            var content, header = "", doc = docsList[i];

            if (doc.preprocess || docsConfig.preprocess) {
                content = processWithCommand(docsConfig.preprocess || 
                                             doc.preprocess, doc.src);
            } else {
                content = IO.readFile(doc.src);
                ext = FilePath.fileExtension(doc.src);
                if (ext === 'markdown' || ext === 'md') {
                    content = markdownConverter.makeHtml(content);
                }
                var absPath = new Packages.java.io.File(doc.src).
                              getAbsolutePath();

                stdResources['=' + absPath] = doc.outFile;
            }

            var docDOM = parseDom(content);
            
            if (docDOM instanceof Array) {
                docDOM = docDOM.filter(function(d){
                    return d instanceof DomText ? d.innerText == true : true;
                });
            }

            if (!(docDOM instanceof Array) && docDOM.tagName.toLowerCase() === 'html')
            {
                content = docDOM.getElement('body').innerHTML;
                header = docDOM.getElement('head') || null;
                if (header) {
                    header.getElements("script").forEach(function (node){
                        if( node.getAttribute('src') &&
                            !isURL(node.getAttribute('src'))) 
                        {
                            var src = addResource(publish.conf,
                                                  doc, 
                                                  stdResources,
                                                  dynResources,
                                                  node.getAttribute('src'));
                            node.setAttribute('src', src);
                        }
                    });
                    header.getElements("link").forEach(function (node) {
                        if (!isURL(node.getAttribute('href'))) {
                            var src = addResource(publish.conf,
                                                  doc,
                                                  stdResources,
                                                  dynResources,
                                                  node.getAttribute('href'));
                            node.setAttribute('href', src);
                        }
                    });
                }
                header = header.innerHTML || "";
            }

            var docText = userDocTemplate.process({ content: content
                                                  , header: header
                                                  , title: doc.title
                                                  });

            IO.saveFile(publish.conf.outDir+'userdocs/', 
                        i + '.html', docText);
        }
    }
	
	// create each of the class pages
	for (var i = 0, l = classes.length; i < l; i++) {
		var symbol = classes[i];
		
		symbol.events = symbol.getEvents();   // 1 order matters
		symbol.methods = symbol.getMethods(); // 2
		
		var output = "";
		output = classTemplate.process(symbol);
		
		IO.saveFile(publish.conf.outDir+"symbols/", 
                    ((JSDOC.opt.u)? Link.filemap[symbol.alias] : 
                                    symbol.alias) + 
                    publish.conf.ext, output);
	}
	
    // regenerate the index with different relative links, used in the index
    // pages
	Link.base = "";
    publish.docsIndex    = hasDocsList ? 
                               docsIndexTemplate.process(docsList) : 
                               "";

	publish.classesIndex = classesTemplate.process(classes);

	// create the class index page
	try {
		var classesindexTemplate = new JSDOC.JsPlate(publish.conf.templatesDir+"index.tmpl");
	}
	catch(e) { print(e.message); quit(); }
	
	var classesIndex = classesindexTemplate.process(classes);
	IO.saveFile(publish.conf.outDir, "index"+publish.conf.ext, classesIndex);

    try {
        var symbolIndexTemplate = new JSDOC.JsPlate(publish.conf.templatesDir+'symbolindex.tmpl');
    } catch(e) { print(e.message); quit(); }

    var symbolIndex = symbolIndexTemplate.process(buildSymbolList(classes));
    IO.saveFile(publish.conf.outDir, 'symbolindex'+publish.conf.ext, symbolIndex);

    symbolIndex = symbolIndexTemplate = null;
	classesindexTemplate = classesIndex = classes = null;
	
	// create the file index page
	try {
		var fileindexTemplate = new JSDOC.JsPlate(publish.conf.templatesDir+"allfiles.tmpl");
	}
	catch(e) { print(e.message); quit(); }
	
	var documentedFiles = symbols.filter(isaFile); // files that have file-level docs
	var allFiles = []; // not all files have file-level docs, but we need to list every one
	
	for (var i = 0; i < files.length; i++) {
		allFiles.push(new JSDOC.Symbol(files[i], [], "FILE", new JSDOC.DocComment("/** */")));
	}
	
	for (var i = 0; i < documentedFiles.length; i++) {
		var offset = files.indexOf(documentedFiles[i].alias);
		allFiles[offset] = documentedFiles[i];
	}
		
	allFiles = allFiles.sort(makeSortby("name"));

	// output the file index page
	var filesIndex = fileindexTemplate.process(allFiles);
	IO.saveFile(publish.conf.outDir, "files"+publish.conf.ext, filesIndex);
	fileindexTemplate = filesIndex = files = null;

    var staticDir = publish.conf.outDir + 'static';
	IO.mkPath(staticDir.split('/'));
    IO.ls( publish.conf.templatesDir+'static' ).forEach(function(f){
        IO.copyFile(f, staticDir);
    });
}


/** Just the first sentence (up to a full stop). Should not break on dotted
 *  variable names. 
 */
function summarize(desc) {
	if (typeof desc != "undefined")
		return desc.match(/([\w\W]+?\.)[^a-z0-9_$]/i)? RegExp.$1 : desc;
}

/** Make a symbol sorter by some attribute. */
function makeSortby(attribute) {
	return function(a, b) {
		if (a[attribute] != undefined && b[attribute] != undefined) {
			a = a[attribute].toLowerCase();
			b = b[attribute].toLowerCase();
			if (a < b) return -1;
			if (a > b) return 1;
			return 0;
		}
	}
}

/** Pull in the contents of an external file at the given path. */
function include(path) {
	var path = publish.conf.templatesDir+path;
	return IO.readFile(path);
}

/** Turn a raw source file into a code-hilited page in the docs. */
function makeSrcFile(path, srcDir, name) {
	if (JSDOC.opt.s) return;
	
	if (!name) {
		name = path.replace(/\.\.?[\\\/]/g, "").replace(/[\\\/]/g, "_");
		name = name.replace(/\:/g, "_");
	}
	
	var src = {path: path, name:name, charset: IO.encoding, hilited: ""};
	
	if (defined(JSDOC.PluginManager)) {
		JSDOC.PluginManager.run("onPublishSrc", src);
	}

	if (src.hilited) {
		IO.saveFile(srcDir, name+publish.conf.ext, src.hilited);
	}
}

/** Build output for displaying function parameters. */
function makeSignature(params) {
	if (!params) return "()";
	var signature = "("
	+
	params.filter(
		function($) {
			return $.name.indexOf(".") == -1; // don't show config params in signature
		}
	).map(
		function($) {
			return $.name;
		}
	).join(", ")
	+
	")";
	return signature;
}

/** Find symbol {@link ...} strings in text and turn into html links */
function resolveLinks(str, from) {
	str = str.replace(/\{@link ([^} ]+) ?\}/gi,
		function(match, symbolName) {
			return new Link().toSymbol(symbolName);
		}
	);
	
	return str;
}

function processWithCommand(cmd, file) {
    var process, line, content = IO.readFile(file);

    if(!content){
        LOG.warn('could not read file: ' + file);
        quit();
        return null;
    }

    process = Packages.java.lang.Runtime.getRuntime().exec(cmd);
    if(!process) {
        LOG.warn('unable to execute command: ' + cmd);
        quit();
        return null;
    }

    var textIn = new Packages.java.io.BufferedReader(
        new Packages.java.io.InputStreamReader(
            process.getInputStream()));

    var textOut = new Packages.java.io.PrintWriter(
        new Packages.java.io.BufferedWriter(
            new Packages.java.io.OutputStreamWriter(
                process.getOutputStream())));

    textOut.print(content);
    textOut.close();

    content = "";
    while ((line = textIn.readLine())) {
        content += line;
        content += "\n";
    }
    textIn.close();

    process.waitFor();
    if(process.exitValue() != 0) {
        quit();
        return null;
    }

    return content;
}

function buildSymbolList(classes) {
    var clazz, i,
        tmp = {},
        ret = [];

    function addSymbol(s) {
        var n = '=' + s.name;
        if (!tmp[n]) {
            tmp[n] = { name: s.name,
                       symbols: [s] };
        } else {
            tmp[n].symbols.push(s);
        }
    }

    function addMembers(c, lst) {
        if(lst){
            lst.filter(function(x){
                return x.memberOf == c.alias && !x.isNamespace || !x.isIgnored;
            }).forEach(addSymbol);
        }
    }

    for (i = 0; i < classes.length; i++) {
        clazz = classes[i];
        if(clazz.name !== '_global_') {
            switch(clazz.isa) {
                case 'OBJECT':
                case 'CONSTRUCTOR':
                    addSymbol(clazz);
            }
        }

        addMembers(clazz, clazz.properties);
        addMembers(clazz, clazz.methods);
        addMembers(clazz, clazz.events);
    }

    for (i in tmp) {
        ret.push(tmp[i]);
    }

    ret.sort(makeSortby('name'));

    return ret;
}

function copyDirectory(todir, fromdir) {
    var dir = new Packages.java.io.File(fromdir);
    var m = {};

    dir.listFiles().forEach(function(f){
        if (f.isFile()) {
            IO.copyFile(f, todir, f.getName());
            m['=' + f.getAbsolutePath()] = todir+f.getName();
        } else if (f.isDirectory()) {
            IO.mkPath(todir+f.getName());
            var tmp = copyDirectory(todir+f.getName()+'/', f);
            for(var i in tmp) {
                m[i] = tmp[i];
            }
        }
    });
    return m;
}

function copyResources(todir, resources) {
    var m = {};
    if (resources && resources instanceof Array) {
        resources.forEach(function (r) {
            var files, f = new Packages.java.io.File(r);

            if (f.isFile()) {
                IO.copyFile( f.getAbsolutePath(), todir, f.getName() );
                m['=' + f.getAbsolutePath()] = 
                    new Packages.java.io.File(todir+f.getName()).
                        getAbsolutePath();
            } else if (f.isDirectory()) {
                IO.mkPath(todir+f.getName());
                var tmp = copyDirectory(todir+f.getName()+'/', 
                                        f.getAbsolutePath());
                for(var i in tmp) {
                    m[i] = tmp[i];
                }
            }
        });
    }
    return m;
}

function isURL(str) {
    return /^http:\/\//.test(str);
}

function findRelativePath(from, to) {
    var fTo   = new Packages.java.io.File(to).getAbsoluteFile();
    var fFrom = new Packages.java.io.File(from).getAbsoluteFile();
    if(!fFrom.isDirectory())  fFrom = fFrom.getParentFile();

    var aFrom = String(fFrom.getAbsolutePath()).split(/[\\\/]/);
    var aTo   = String(fTo.getAbsolutePath()).split(/[\\\/]/);

    while(aFrom.length && aTo.length && aFrom[0] == aTo[0]) {
        aFrom.shift();
        aTo.shift();
    }

    var path = aFrom.map(function(){ return "..";}).join('/');
    if(aFrom.length > 0) path += '/';
    path += aTo.join('/');
    return path;
}

function addResource(conf, forDoc, staticResources, dynResources, res) {
    var f = new Packages.java.io.File(forDoc.src);
    var docDir = f.isDirectory() ? 
                    f.getAbsolutePath() : 
                    f.getAbsoluteFile().getParent();
    var resource = String(new Packages.java.io.File(docDir, res).
                          getCanonicalPath());
    var staticRes = staticResources['=' + resource];

    if (staticRes) {
        return findRelativePath( conf.outDir+forDoc.outFile, staticRes);
    }

    var dynRes    = dynResources['=' + resource];
    if (dynRes) {
        return findRelativePath( conf.outDir+forDoc.outFile, dynRes);
    }

    //copy resource file
    var fileName = FilePath.fileName(resource);
    IO.copyFile(resource, conf.outDir+'userdocs/', fileName);
    var dynRes = conf.outDir+'userdocs/'+fileName;
    dynResources['=' + resource] = dynRes;

    return findRelativePath(conf.outDir+forDoc.outFile, dynRes);
}

