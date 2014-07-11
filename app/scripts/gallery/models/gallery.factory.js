define([
  'gallery/models/gallery.model',
  'gallery/models/selection.gallery.model'
], function (GalleryModel, SelectionGalleryModel) {

  var GalleryFactory = function() {
    
    /**
     * Factory method: returns an initialized GalleryModel object of the 
     * appropriate GalleryModel class.
     */
    function create($el, opts) {

      // get Gallery source
      var src = _getSource($el);

      // initialize GalleryModel
      if (src !== undefined) {
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

    }

    // extracts the corrects data attribute for the Gallery model to be 
    // instanciated.
    function _getSource($el) {
      var src = $el.data('gal-src') || $el.data('src');
      if (src === undefined) { // handle deprecated 'project' option
        if ($el.data('project')) {
          src = $el.data('project') + '.json';
          console.warn('"data-project" as a data source for galleryjs is deprecated! Use "data-src" instead!');
        }
      }
      return src;
    }


    // public methods
    return {
      create: create
    };

  }();

  return GalleryFactory;

});
