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

    // override fetch to only fetch selection
    // TODO: Hier muss gedreht werden. Wir haben jetzt evtl 2 mal dieselbe 
    // collection: Einmal als Selection ausserhalb, einmal hier als Collection 
    // der Gallery Bilder. Das muss nicht sein, wenn die Selection eh in das 
    // GalleryModel wandert.
    fetch: function() {
      // this.attributes['images'] = new ImageCollection([], {
      //   localStorageKey: this.get('key')
      // });
      this.attributes['images'] = new SelectionCollection([], {
        gallery: this,
        key: this.id
      });

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
