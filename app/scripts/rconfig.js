/*global require*/

require.config({
  baseUrl: '/bower_components',
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    }
  },
  paths: {
    gallery: '../scripts/gallery',
    vendor: '../scripts/vendor',
    lib: '../scripts/lib',
    plugins: '../scripts/plugins',
    jquery: 'jquery/dist/jquery.min',
    backbone: 'backbone/backbone',
    localstorage: 'backbone.localstorage/backbone.localstorage',
    underscore: 'underscore/underscore',
    'jquery-touchswipe': 'jquery-touchswipe/jquery.touchswipe',
    'fluid-masonry': 'fluid-masonry/fluid-masonry',
    md5: 'js-md5/js/md5'
  }
});
