/*
 * GalleryModel
 * ----------
 */
define(['backbone', 'gallery/collections/image.collection'],
  function(Backbone, ImageCollection) {

  var GalleryModel = Backbone.Model.extend({

    idAttribute: 'project',

    // Default attributes for the gallery.
    defaults: function() {
      return {
        project: '',
        title: '',
        presets: {
          thumb: {
            width: 300
          },
          large: {
            width: 800
          }
        },
        images: undefined
      };
    },
    
    initialize: function() {
      this.sliderState = 'closed';
      this._current = undefined;
    },
    
    toggleSliderState: function() {
      this.sliderState = (this.sliderState === 'closed' ? 'opened' : 'closed');
    },

    url: function() {
      return this.get('project') + '.json';
    },

    parse: function(response) {
      var galleryHash = response.gallery;
      var imageOptions = {presets: galleryHash.presets};
      if (this.attributes && this.attributes.images) {
        this.attributes.images.reset(galleryHash.images, imageOptions); // Reset Collection
      } else {
        // Init Collection on response Hash
        galleryHash.images = new ImageCollection(galleryHash.images, imageOptions);
      }
      return galleryHash;
    },
    
    setCurrent: function(imageModel) {
      this._current = imageModel;
    },
    
    // ImageModel instance
    getCurrent: function() {
      return this._current;
    },
    
    // ImageModel instance
    getNext: function() {
      if (this._current) {
        var images = this.attributes.images;
        if (this._current.index() < images.length-1) {
          return images.at(this._current.index() + 1);
        }
      }
    },
    
    // ImageModel instance
    getPrev: function() {
      if (this._current && this._current.index() > 0) {
        return this.attributes.images.at(this._current.index() - 1);
      }
    }
  });
  
  return GalleryModel;
  
});
