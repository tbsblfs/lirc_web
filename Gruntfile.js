module.exports = function(grunt) {
    var STATIC_FOLDER = 'lib/app/static/'
    
    // Load some tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-develop');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            app: {
                src: [STATIC_FOLDER + 'js/vendor/zepto.min.js',
                      STATIC_FOLDER + 'js/vendor/zepto.touch.js',
                      STATIC_FOLDER + 'js/vendor/fastclick.js',
                      STATIC_FOLDER + 'js/app/*.js'],
                dest: STATIC_FOLDER + 'js/compiled/app.js'
            }
        },

        less: {
            app: {
                files: {
                    "lib/app/static/css/compiled/app.css": "lib/app/static/css/app.less"
                }
            }
        },

        watch: {
            scripts: {
                files: [STATIC_FOLDER + 'js/app/*.js', STATIC_FOLDER + 'js/vendor/*.js'],
                tasks: ['uglify:app']
            },
            stylesheets: {
                files: [STATIC_FOLDER + 'css/*.less'],
                tasks: ['less']
            }
        },

        develop: {
            server: {
                file: 'app.js',
                env: { NODE_ENV: 'development'}
            }
        }
    });

    grunt.registerTask('default', ['uglify', 'less']);
    grunt.registerTask('server', ['uglify', 'less', 'develop', 'watch']);

};
