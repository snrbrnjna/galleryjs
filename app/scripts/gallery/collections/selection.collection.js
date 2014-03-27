/* SelectionCollection
 * ---------------
 *
 * The collection of selected ImageModel objects. Is saved in localStorage of
 * the client browser.
 *
 */
define([
  'underscore',
  'backbone',
  'localstorage',
  'gallery/models/image.model'
],
function (_, Backbone, nope, ImageModel) {
    
    var SelectionCollection = Backbone.Collection.extend({

      // Reference to this collection's model.
      model: ImageModel,

      // Selection is saved in localStorage
      localStorage: new Backbone.LocalStorage('GallerySelection'),

      initialize: function (models, options) {
        this.gallery = options.gallery;

        // wait for the ImageCollection to be fetched 
        // => listenTo it & fetch selection from localStorage
        this.listenTo(this.gallery, 'change', this.initGallery);
      },

      // Called, when the GalleryModel is initialized/loaded
      // Now we can 
      // - fetch this selection from the localStorage and connect it with the
      //   ImageCollection of the GalleryModel
      // - listen to its ImageCollection for any changes to the selected attribute 
      //   of its ImageModels
      initGallery: function() {
        var galleryImages = this.gallery.get('images');

        // before we setup the change-listener, else we have 1 superfluos 
        // callback-roundtrip
        this.fetch();

        this.listenTo(galleryImages, 'change:selected', this.selectionChanged);
      },

      // called by SelectionCollection#fetch
      parse: function(response) {
        if (this.gallery) {
          var galleryImages = this.gallery.get('images');
          _.each(response, function(selectionModel) {
            var imageModel = galleryImages.get(selectionModel.digest);
            if (imageModel) {
              imageModel.set('selected', true);
            }
          }, this);
        }
        return response;
      },

      selectionChanged: function(imageModel, selected) {
        var selectionModel = this.get(imageModel.id);
        if (selected && !selectionModel) {
          var selectedImage = imageModel.clone();
          // selected images have no fixed index, they are sorted by their insert-
          // order, but can be removed again later, so no index is stored
          // see ImageModel#index
          selectedImage.set('index', undefined);
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
