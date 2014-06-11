/*global require*/

require.config({
  baseUrl: '/scripts',
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
    jquery: '../bower_components/jquery/dist/jquery.min',
    backbone: '../bower_components/backbone/backbone',
    localstorage: '../bower_components/backbone.localstorage/backbone.localstorage',
    underscore: '../bower_components/underscore/underscore',
    imagesloaded: '../bower_components/imagesloaded/imagesloaded',
    eventEmitter: '../bower_components/eventEmitter', // needed for imagesloaded
    eventie: '../bower_components/eventie', // needed for imagesloaded
    'vendor/jquery.touchSwipe': '../bower_components/jquery-touchswipe/jquery.touchswipe',
    isotope: '../bower_components/isotope/jquery.isotope',
    md5: '../bower_components/js-md5/js/md5'
  }
});
