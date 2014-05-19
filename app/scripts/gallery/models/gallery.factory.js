define([
  'gallery/models/gallery.model',
  'gallery/models/selection.gallery.model'
], function (GalleryModel, SelectionGalleryModel) {

  var GalleryFactory = {
    create: function($el, opts) {

      // get Gallery source
      var src = $el.data('gal-src') || $el.data('src');
      if (src === undefined) { // handle deprecated 'project' option
        if ($el.data('project')) {
          src = $el.data('project') + '.json';
          console.warn('"data-project" as a data source for galleryjs is deprecated! Use "data-src" instead!');
        }
      }

      // initialize GalleryModel
      var model;
      if (src.indexOf('selection:') < 0) {
        model = new GalleryModel({
          src: src,
          opts: $el.data('gal-opts') || $el.data('opts')
        });
      } else {
        model = new SelectionGalleryModel({
          key: src.replace('selection:', ''),
          opts: $el.data('gal-opts') || $el.data('opts')
        });
      }

      return model;
    }
  };

  return GalleryFactory;

});
