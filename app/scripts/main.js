/* global define, GalleryApp */

(function () {

  if (typeof define === 'function' && define.amd) { // grunt dev task
    // if require.js is loaded (=> define is a amd function),
    // then load its config and the Gallery Module as such...
    require(['rconfig', 'gallery/app'], function(nope, GalleryApp) {
      main(GalleryApp);
    });
  } else { // grunt dist task
    // require.js seems not to be present => GalleryApp has to be loaded as an
    // independent script => instanciate it without loading any dependencies
    main(GalleryApp);
  }

  function main(GalleryAppClass) {
    $(function () {
      // initialize Gallery
      new GalleryAppClass({
        el: $('.gallery-app'),
        galleryOpts: {},
        onInit: function(app, model) {
          console.log('Gallery initialized!', app, model);
          window.pdfButton = new window.PdfButton($('.selection .button.pdf'), app.selection);
        }
      });
    });
  }

})();
