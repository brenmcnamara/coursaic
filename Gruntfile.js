
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: ['Gruntfile.js', 'public/js/*.js']
        },
        
        jasmine_node: {
            all: ['public/*']
        },

        browserify: {
            options: {
                transform: [ require('grunt-react').browserify ]
            },

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
            javascript: {
                files: ['./public/js/**/*.js']
            }
            
        },

        execute: {
            app: {
                target: {
                    src: ['app.js'],
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

    grunt.registerTask('test', ['jshint', 'jasmine_node']);
    grunt.registerTask('build', ['browserify', 'watch', 'execute:app']);

};