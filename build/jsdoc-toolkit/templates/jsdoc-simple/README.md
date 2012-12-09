WARNING: this template is still under development and it might change every so
often.

jsdoc-simple
============

jsdoc-simple is a modified jsdoc toolkit (Version 2) template with support for
additional documentation.

## Features ##

- very simple and readable layout
- Support for additional files and resources
- Scripts and CSS-Files in additional Resource files will be copied
  automatically. So one can develop and test examples indiviually and easily
  create a self contained documentation.
- Support for Markdown Resource files
- Markdown processing for Class-, Method-, Property-, Event-descriptions
- Dynamically filterable(using regular expressions) symbol index

An example javascript library using jsdoc-simple can be found at: [http://github.com/urso/qc.js](http://github.com/urso/qc.js)

[Screenshots](http://github.com/urso/jsdoc-simple/wiki/Screenshots)

## Install ##

The whole template directory must be copied as is into jsdoc's template
directory.

## Usage ##

In order to use 'jsdoc-simple' you have to tell jsdoc toolkit to use it via
the '-t' flag when calling jsdoc or prepare a jsdoc toolkit configuration file
with option 't:' set to the template's directory.

You also may want to add some static documentation to the generated
documentation. To do so create a jsdoc toolkit configuration file and add the
option 'docs:' with the field 'content' being an array of files to add and
the optional field 'preprocess'.

Every Entry in the 'content' array MUST be an object having the fields 'src'
and 'title' plus the optional field 'preprocess'.

The 'preprocess' field MUST be a shell command to be execute on the 'src'
file. It is assumed that the command will read the file's content from stdin
and print its outcome to stdout.

For example this will add the files intro.pdc and tutorial.pdc to the
documentation, which are preprocessed using pandoc (Haskell based markdown
program) :

    {
        d: 'docs', // output directory 'docs'
        a: false,  // do not show all symbols
        docs: {
            preprocess: 'pandoc',   // preprocess all files with pandoc
            content: [ {src:'docsrc/intro.pdc',
                        title: 'Introduction' },
                       {src:'docsrc/tutorial.pdc',
                        title: 'Tutorial'}
                     ]
        }
    }

In the following example only the file intro.pdc is preprocessed using pandoc:

    {
        d: 'docs', // output directory 'docs'
        a: false,  // do not show all symbols
        docs: {
            content: [ {src:'docsrc/intro.pdc',
                        preprocess: 'pandoc',   // preprocess only this file with pandoc
                        title: 'Introduction' },
                       {src:'docsrc/tutorial.html',
                        title: 'Tutorial'}
                     ]
        }
    }

When using a global preprocessor for all documentations and a local one for a
file, the latter one is chosen for that file only whereas all others are
preprocessed using the former one.

Creating the documentation then will be as easy as (with \*nix shell):

    $ run.sh -c='jsdoc.conf' -t="$JSDOCDIR/templates/jsdoc-simple" src

## Handling additional Resources ##

When supplying further documentation to add to the final document you may want
to add further resources like images, css files or even script files for
showcasing. To do so, the 'docs' field in the jsdoc configuration file
supports a 'resources' field, which must be an Array of File and Directory
paths to copy.

For example:

    {
        d: 'docs', // output directory 'docs'
        a: false,  // do not show all symbols
        docs: {
            resources: ['docsrc/images'],
            content: [ {src:'docsrc/intro.html',
                        title: 'Introduction' },
                       {src:'docsrc/tutorial.html',
                        title: 'Tutorial'}
                     ]
        }
    }

If the additional documentation sports a valid html file with header and body,
this file will be processed as follows:

- get body-Element of the file and copy its inner content to the final output
  file

- get header-Element and analyze tags:
    - for every 'script' or 'link' tag the src/href attribute is
      adjusted to the file the source was copied to
    - for every 'script' or 'link' tag all files named in the src/href
      attribute are automatically copied to the documentation directory
    - automatically adjust path of output copied resources if needed
    - copy html header into template

Thus when writing JavaScript libraries for example you may showcase using the
relative path to your source file directory and still test it without
rebuilding the documentation. When building the documentation your library
will be copied then into the final output, such that your examples will still
work and the whole documentation is self contained and can be redistributed
without the original sources.

Furthermore if a markdown file is given (any file ending with .mk or .markdown)
but no preprocessor, the file is automatically converted to html.

## Using the Symbol Index ##

The Symbol index page features a text field used for filtering. When filtering
the content of this text field is interpreted as a regular expression. Thus
typing the expression "a|b|c" will find all symbols starting with a or b or c.
Furthermore the regular expression is interpreted to be case insensitive. But
if you have symbolic names using special characters like '$' proper escaping
is needed.  Meaning that if you want to filter all symbols starting with '$'
you have to type "\$".

## Credits ##

- JavaScript HTML Parser:
  HTML Parser By John Resig (ejohn.org)
  Original code by Erik Arvidsson, Mozilla Public License
  http://erik.eae.net/simplehtmlparser/simplehtmlparser.js

- [MooTools 1.2.4 Server](http://mootools.net/developers/):
  authors: The MooTools production team 

- [JSDom](http://github.com/urso/jsdom):
  JavaScript DOM duck typing classes for non browser environments

- [Showdown](http://attacklab.net/showdown/):
  Markdown for JavaScript 

