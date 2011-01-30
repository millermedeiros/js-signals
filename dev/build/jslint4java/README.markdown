jslint for java <http://code.google.com/p/jslint4java/>
=======================================================

This is a java wrapper around the fabulous tool by Douglas Crockford, jslint
(See <http://jslint.com/>). It provides a simple interface for detecting
potential problems in JavaScript code.

You can run it on the command line:

    % java -jar jslint4java-1.4.6.jar application.js
    jslint:application.js:11:9:Line breaking error ')'.
    jslint:application.js:11:10:Missing semicolon.

There are a multitude of options; try `--help` for more details.

The output is colon separated fields.  The fields are:

 * "jslint"
 * the file name
 * the line number (starting at zero)
 * the character number (starting at zero)
 * the problem that was found

You may also use the jar as an ant task.  The quickest way to get started is
to drop it in `~/.ant/lib`.  See `docs/ant.html` for more details.

**NB:** The packaged jar file includes a builtin version of rhino (a JavaScript
engine).  If this causes trouble, you can download a standalone version
through the maven repository.

If you wish to use jslint4java from within Java, please use a maven dependency:

    <dependency>
      <groupId>com.googlecode.jslint4java</groupId>
      <artifactId>jslint4java</artifactId>
      <version>1.4.6</version>
    </dependency>

If you have any comments or queries, please send them to dom [at] happygiraffe.net.

This software is licenced under the BSD licence (see LICENCE.txt).

