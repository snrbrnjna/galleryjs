/* ImageCollection
 * ---------------
 *
 * The collection of ImageModel objects.
 *
 */
define(['backbone', 'gallery/models/image.model'],
  function(Backbone, ImageModel) {
    
    var ImageCollection = Backbone.Collection.extend({

      // Reference to this collection's model.
      model: ImageModel

    });
    
    return ImageCollection;
  }
);
