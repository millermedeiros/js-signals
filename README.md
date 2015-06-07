# JS-Signals #

[![Build Status](https://secure.travis-ci.org/millermedeiros/js-signals.png)](https://travis-ci.org/millermedeiros/js-signals)

Custom event/messaging system for JavaScript inspired by [AS3-Signals](https://github.com/robertpenner/as3-signals).

For a more in-depth introduction read the [JS-Signals Project Page](http://millermedeiros.github.com/js-signals/) and visit the links below.


## Links ##

 * [Project Page](http://millermedeiros.github.com/js-signals/)
 * [Wiki](http://github.com/millermedeiros/js-signals/wiki/)
 * [Documentation](http://millermedeiros.github.com/js-signals/docs)
 * [Changelog](http://github.com/millermedeiros/js-signals/blob/master/CHANGELOG.md)
 * [CompoundSignal - special Signal kind](https://github.com/millermedeiros/CompoundSignal)
 * [jasmine-signals](https://github.com/AdamNowotny/jasmine-signals)
   (Jasmine assertions to simplify signals testing)


## License ##

 * [MIT License](http://www.opensource.org/licenses/mit-license.php)


## Distribution Files ##

You can use the same distribution file for all the evironments, browser script
tag, AMD, CommonJS (since v0.7.0).

Files inside `dist` folder:

 * docs/index.html : Documentation.
 * signals.js : Uncompressed source code with comments.
 * signals.min.js : Compressed code.

You can install JS-Signals on Node.js using [NPM](http://npmjs.org/)

    npm install signals


## CompoundSignal

Note that there is an advanced Signal type called `CompoundSignal` that is
compatible with js-signals v0.7.0+. It's useful for cases where you may need to
execute an action after multiple Signals are dispatched. It was split into its'
own repository since this feature isn't always needed and that way it can be
easily distributed trough npm.

[CompoundSignal repository](https://github.com/millermedeiros/CompoundSignal)



## Repository Structure ##

### Folder Structure ###

    |-build       ->  files used on the build process
    |-src         ->  source files
    |-tests       ->  unit tests
    `-dist        ->  distribution files
      `-docs        ->  documentation

### Branches ###

    master      ->  always contain code from the latest stable version
    release-**  ->  code canditate for the next stable version (alpha/beta)
    develop     ->  main development branch (nightly)
    **other**   ->  features/hotfixes/experimental, probably non-stable code


## Building your own ##

This project now uses [Grunt](http://gruntjs.com/) for build process. If you need to build a custom version of JS-Signals install Grunt and run:

    grunt build

This will delete all JS files inside the `dist` folder, merge/update/compress source files, validate generated code using [JSHint](http://gruntjs.com/) and copy the output to the `dist` folder.

There is also a task to generate documentation based on [JSDoc3](http://usejsdoc.org/)
(used before each deploy):

    grunt deploy

**IMPORTANT:** `dist` folder always contain the latest version, regular users should **not** need to run build task.

## Running Tests ##

The specs work on the browser and on node.js, during development you can use
the `spec/runner_dev.html` file to avoid doing a build every time you make
changes to the source files. On node.js you need to run `ant compile` after
each source file change otherwise `npm test` will execute the files from last
build - not adding it as a `pretest` script since the build adds information
about the build date and build number and that would pollute the commit
history.

