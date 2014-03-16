if (typeof define === 'function' && define.amd) { // grunt dev task
  // if require.js is loaded (=> define is a amd function), 
  // then load its config and the Gallery Module as such...
  require(['rconfig', 'gallery/app'], function(nope, GalleryApp) {

    $(function () {
      var galleryEl = $('.gallery-app');
      if (galleryEl.length) {
        var galleryApp = new GalleryApp({el: galleryEl});
        console.log('Gallery App is running...', galleryApp);
      }
    });

  });
} else { // grunt dist task
  // require.js seems not to be present => GalleryApp has to beloaded as an 
  // independent script => instanciate it without loading any dependencies
  $(function () {
    var galleryEl = $('.gallery-app');
    if (galleryEl.length) {
      var galleryApp = new GalleryApp({el: galleryEl});
      console.log('Gallery App is running...', galleryApp);
    }
  });
}
