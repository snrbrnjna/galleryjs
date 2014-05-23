/*
 * SelectionGalleryModel
 * ----------
 */
define([
  'underscore',
  'gallery/models/gallery.model',
  'gallery/collections/image.collection',
  'gallery/collections/selection.collection'
],
  function(_, GalleryModel, ImageCollection, SelectionCollection) {

  var SelectionGalleryModel = GalleryModel.extend({
    
    initialize: function() {
      GalleryModel.prototype.initialize.apply(this, arguments);
      
      this.id = this.get('key');
    },

    // Override fetch to only fetch selection
    fetch: function() {
      // Is the selection already registered on this GalleryModel?
      var gallerySelection = this.get('selection');
      if (gallerySelection && gallerySelection.key == this.id) {
        this.attributes['images'] = gallerySelection;  
      } else { // no, we have to initialize a new SelectionCollection
        new SelectionCollection([], {
          gallery: this,
          key: this.id
        });
      }
      
      // Gallery default options merged with attribute-opts
      this.attributes['opts'] = _.extend({}, this.defaultOpts, this.attributes.opts);

      // fetch local ImageCollection
      this.attributes['images'].fetch({
        success: _.bind(function () {
          this.trigger('change');
        }, this)
      });
    }

  });
  
  return SelectionGalleryModel;
  
});
