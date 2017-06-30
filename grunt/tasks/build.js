/**
 * Build tasks
 */
'use strict';

module.exports = function( grunt ) {

  return grunt.registerTask( 'build', 'Build advert', function() {
    var taskList = [];

    taskList = taskList.concat([
      'clean:dist'
    ]);

    // Default or Expandable template.
    if ( grunt.config('pkg.advert.template') === 'default' || grunt.config('pkg.advert.template') === 'expandable' ) {

      taskList = taskList.concat([
        // Copy src to dist (img,html,fonts)
        'copy:dist',
        // Injects Bower components into the HTML file (html)
        'wiredep:advert',
        // Inject Bower components into the HTML file (sass)
        'wiredep:sass',
        /**
         * Reads HTML for usemin blocks to enable smart builds that automatically
         * concat and minify files. Creates configurations in memory so
         * additional tasks can operate on them
         */
        'useminPrepare',
        //Run the following tasks in parallel (newer:sass:dist,imagemin,svgmin)
        'concurrent:dist',
        // Autoprefixes CSS
        'postcss:dist',
        // Concatenates css and js files to the destination folder.
        'concat',
        // Minify CSS
        'cssmin',
        // uglifies the js
        'uglify:generated',
        // Performs rewrites based on useminPrepare configuration
        'usemin'
      ]);

    }
    // Standard template or Staging build option.
    if ( grunt.config('pkg.advert.template') === 'standard' || grunt.config('config.publisher') === 'standard-staging' ) {

      taskList = taskList.concat([
        'copy:standardDist',
        'useminPrepare',
        'string-replace:standardPublish',
        'concurrent:standardDist',
        'copy:standardStyles',
        'postcss',
        'string-replace:standardImages',
        'uglify:standard',
        'copy-standard-assets',
        'usemin',
        'inline:dist',
        'replace-image-paths',
        'htmlmin:dist'
      ]);

    }
    // Slider template or Pictela option.
    if ( grunt.config('pkg.advert.template') === 'slider' || grunt.config('config.publisher') === 'pictela' ) {

      taskList = taskList.concat([
        'copy:sliderDist',
        'useminPrepare',
        'wiredep:slider',
        'concurrent:dist',
        'postcss',
        'concat',
        'cssmin',
        'uglify:generated',
        'usemin'
      ]);

    }

    grunt.task.run(taskList);

    // Repetitve tasks
    grunt.registerTask('copy-standard-assets', function( pkg ) {
      var adverts = grunt.config('pkg.adverts');

      for ( var i in adverts ) {
        grunt.task.run([ 'copy:' + adverts[i] ]);
        grunt.log.ok( 'Assets copied into ' + adverts[i] + ' folder' );
      }
    });

    grunt.registerTask('replace-image-paths', function( pkg ) {
      var adverts = grunt.config('pkg.adverts');

      for ( var i in adverts ) {
        grunt.task.run([ 'string-replace:' + adverts[i] +'ImagePth' ]);
      }
    });

  });

};
