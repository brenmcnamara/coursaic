
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
            dist: {
                files: {
                    'public/js/bundle.js': 'public/js/main.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('test', ['jshint', 'jasmine_node']);
    grunt.registerTask('launch', ['browserify']);
};