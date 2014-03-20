/* SelectionCollection
 * ---------------
 *
 * The collection of selected ImageModel objects.
 *
 */
define([
  'underscore',
  'backbone',
  'localstorage',
  'gallery/models/image.model',
  'gallery/collections/image.collection'
],
function (_, Backbone, nope, ImageModel, ImageCollection) {
    
    var SelectionCollection = ImageCollection.extend({

      localStorage: new Backbone.LocalStorage('GallerySelection'),

      initialize: function (models, options) {
        this.gallery = options.gallery;

        // wait for the ImageCollection to be fetched 
        // => fetch selection from localStorage
        this.listenToOnce(this.gallery, 'change', this.initGallery);
      },

      // Called, when the GalleryModel is initialized/loaded
      // Now we can 
      // - fetch this selection from the localStorage and connect it with the
      //   ImageCollection of the GalleryModel
      // - listen to its ImageCollection for any changes to the selected attribute 
      //   of its ImageModels
      initGallery: function() {
        this.galleryImages = this.gallery.get('images');

        // before we setup the change-listener, else we have 1 superfluos 
        // callback-roundtrip
        this.fetch();

        this.listenTo(this.galleryImages, 'change:selected', this.selectionChanged);
      },

      parse: function(response) {
        _.each(response, function(selectionModel) {
          var imageModel = this.galleryImages.get(selectionModel.digest);
          if (imageModel) {
            imageModel.set('selected', true);
          }
        }, this);
        return response;
      },

      selectionChanged: function(imageModel, selected) {
        var selectionModel = this.get(imageModel.id);
        if (selected && !selectionModel) {
          var selectedImage = imageModel.clone();
          this.add(selectedImage);
          selectedImage.save();
        } else if (selectionModel) {
          selectionModel.destroy();
        }
      }
    });
    
    return SelectionCollection;
  }
);
