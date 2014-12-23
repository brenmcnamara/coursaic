
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: ['Gruntfile.js', 'public/js/*.js']
        },
        
        jasmine_node: {
            all: ['public/*']
        },

        react: {
            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        cwd: 'public/components',
                        src: ['**/*.js'],
                        dest: 'public/build',
                        ext: '.react.js'
                    }
                ]
            }
        },

        browserify: {

            dev: {
                src: ['./public/js/**/*.js'],
                dest: './public/build/bundle.js',

                options: {
                    ignore: ['./public/js/**/*.spec.js'],
                    watch: true
                }
            }
        },

        watch: {

            files: ['./public/js/**/*.js'],
            tasks: ['log']
        },

        execute: {
            app: {
                target: {
                    src: ['app.js']
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-execute');

    grunt.registerTask('log', 'Log stuff.', function() {
        grunt.log.writeln("Loggin change.");
    });
    grunt.registerTask('test', ['jshint', 'jasmine_node']);
    grunt.registerTask('build', ['react', 'browserify', 'watch', 'execute:app']);

};