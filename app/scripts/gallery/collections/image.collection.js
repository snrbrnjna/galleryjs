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
      model: ImageModel,
      
      // We keep the Todos in sequential order, despite being saved by unordered
      // GUID in the database. This generates the next order number for new items.
      nextOrder: function() {
        if (!this.length) return 1;
        return this.last().get('order') + 1;
      },

      // Todos are sorted by their original insertion order.
      comparator: 'order'

    });
    
    return ImageCollection;
  }
);