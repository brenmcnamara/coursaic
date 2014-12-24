
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

            watch: {
                src: ['./public/js/**/*.js'],
                dest: './public/build/bundle.js',

                options: {
                    ignore: ['./public/js/**/*.spec.js'],
                    watch: true
                }
            },

            build: {
                src: ['./public/js/**/*.js'],
                dest: './public/build/bundle.js',

                options: {
                    ignore: ['./public/js/**/*.spec.js']
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
                src: ['app.js'],
            }
        },

        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            watchThenExecute: ['continuousBuild', 'execute:app']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('test', ['jshint', 'jasmine_node']);
    grunt.registerTask('staticBuild', ['browserify:build']);
    grunt.registerTask('continuousBuild', ['browserify:watch', 'watch']);

    grunt.registerTask('dev', ['concurrent:watchThenExecute']);
    grunt.registerTask('default', ['staticBuild', 'execute:app']);

};