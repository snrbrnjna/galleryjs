    //The modules for your project will be inlined above
    //this snippet. Ask almond to synchronously require the
    //module value for 'main' here and return it as the
    //value to use for the public API for the built file.

    // wrap global jQuery object into the 'jquery' module for all its 
    // dependencies in the Gallery App.
    // see: https://github.com/jrburke/almond/issues/12
    define('jquery', [], function () {
      return jQuery;
    });

    return require('gallery/app');
}));
