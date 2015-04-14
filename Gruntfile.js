module.exports = function (grunt) {
    var props = grunt.file.readJSON('build/build.properties.json');
    var version = grunt.file.readJSON('package.json').version;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                src: props.dir.src + '/wrapper.js', 
                dest: props.dir.dist + '/' + props.names.dist
            }
        },
        'string-replace': {
            main: {
                files: [{
                    src: props.dir.dist + '/' + props.names.dist,
                    dest: props.dir.dist + '/' + props.names.dist
                }],
                options: {
                    replacements: [{
                        pattern: '//::LICENSE:://',
                        replacement: grunt.file.read(props.dir.src + '/license.txt')
                    },
                    {
                        pattern: '//::SIGNAL_BINDING_JS:://',
                        replacement: grunt.file.read(props.dir.src + '/SignalBinding.js')
                    },
                    {
                        pattern: '//::SIGNAL_JS:://',
                        replacement: grunt.file.read(props.dir.src + '/Signal.js')
                    },
                    {
                        pattern: '::BUILD_NUMBER::',
                        replacement: 273
                    },
                    {
                        pattern: '::BUILD_DATE::',
                        replacement: grunt.template.today("yyyy/MM/dd hh:mm")
                    },
                    {
                        pattern: '\'::VERSION_NUMBER::\'',
                        replacement: '\'' + version + '\''
                    }]
                }
            }
        },

        uglify: {
            main: {
                files: {
                    'dist/signals.min.js' : [ props.dir.dist + '/' + props.names.dist ]
                }
            }
        },

        'closure-compiler': {
            frontend: {
                js: props.dir.dist + '/' + props.names.dist,
                jsOutputFile: props.dir.dist + '/' + props.names.dist_min,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    externs: [
                      'externs.js'
                    ]
                }
            }
        },

        jshint: {
            files: [props.dir.dist + '/' + props.names.dist]
        },

        webpack: {
            dist: {
                entry: ['./src/Signal.js', './src/SignalBinding.js'],
                output: {
                    path: props.dir.dist,
                    filename: props.names.dist,
                }
            }
        },
        jsdoc : {
            dist : {
                src: [props.dir.dist + '/' + props.names.dist],
                options: {
                    destination: 'docs'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('build', ['compile', 'jsdoc', 'closure-compiler']);

    grunt.registerTask('compile-done', function(){
        grunt.log.writeln('%s built.', props.names.dist);
        grunt.log.writeln('Build complete.', props.names.dist);
    });

    grunt.registerTask('build-done', function(){
        grunt.log.writeln('Build complete.', props.names.dist);
    });

    grunt.registerTask('compile', 'Compile task', function(){
        grunt.log.writeln('Building %s..', props.names.dist);
        grunt.task.run(['copy:main', 'string-replace:main', 'compile-done']);
    } );
    
};