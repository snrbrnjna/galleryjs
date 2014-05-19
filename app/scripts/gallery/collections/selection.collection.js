/* SelectionCollection
 * ---------------
 *
 * A collection of selected ImageModel objects. It gets saved in localStorage of
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


      /*
       * TODO: SelectionCollection auch ohne gallery object ?? => explizites Fetchen und kein Beobachten 
       */
      initialize: function (models, options) {
        this.gallery = options.gallery;

        // A key for identifying the Selection
        this.key = typeof(options.key) === 'boolean' ?
          'GallerySelection-' + this.gallery.id :  // identified by the given Gallery
          'GallerySelection-' + options.key; // identified by a given key

        // Selection is saved in localStorage
        this.localStorage = new Backbone.LocalStorage(this.key);

        // wait for the ImageCollection to be fetched 
        // => listenTo it & fetch selection from localStorage
        this.listenToOnce(this.gallery, 'change', this.initGallery);
      },

      // Called, when the GalleryModel is initialized/loaded
      // Now we can 
      // - fetch this selection from the localStorage and mark all it's images
      //   as selected in the ImageCollection of the GalleryModel.
      // - listen to any changes to the 'selected' attribute of the ImageModels
      //   in the Gallery.
      initGallery: function() {
        // before we setup the change-listener, else we have 1 superfluos 
        // callback-roundtrip
        this.fetch();

        this.listenTo(
          this.gallery.get('images'), 'change:selected', this.selectionChanged);
      },

      // Called by SelectionCollection#fetch
      // Marks all the fetched images as selected in the ImageCollection of the 
      // GalleryModel.
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
