/* ImageCollection
 * ---------------
 *
 * The collection of ImageModel objects.
 *
 */
define([
  'backbone', 
  'localstorage',
  'gallery/models/image.model'
], function(Backbone, nope, ImageModel) {
  
  var ImageCollection = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: ImageModel,

    // Make Collection a LocalStorage Collection, when opts.localStorageKey is
    // given.
    initialize: function(models, opts) {
      if (opts.localStorageKey) {
        this.key = opts.localStorageKey;
        this.localStorage = new Backbone.LocalStorage(this.key);
      }
    },

    parse: function(response) {
      return response;
    }

  });
  
  return ImageCollection;
});
