define([
  'jquery',
  'underscore',
  'backbone',
  'jquery-bridget/jquery.bridget',
  'fluid-masonry',
  'gallery/views/thumb.container',
  'gallery/utils/responsive.adapter'
],
function($, _, Backbone, nope, FluidMasonry, ThumbContainer, ResponsiveAdapter) {
  
  $.bridget('fluidMasonry', FluidMasonry);

  /*
   * Model: GalleryModel
   *
   * listens once to 'change' on GalleryModel => init Thumbs
   *
   * The constructor needs the following options
   * - model
   * - el 
   */
  var ThumbContainerMasonry = ThumbContainer.extend({
  
    initialize: function(options) {
      ThumbContainer.prototype.initialize.apply(this, arguments);
    },

    initGallery: function() {
      // initialize masonry on the thumb Container
      this.initMasonry(this.model.get('opts'));
    },
  
    /*
     * min_col_width: width of cell (thumb) in masonry layout (thumb can get till 
     * double in size, depending on container-width)
     */
    initMasonry: function(galleryOpts) {
      this.$el.fluidMasonry({
        itemSelector : this.options.itemSelector,
        minColumnWidth: ResponsiveAdapter.getOptionByMediaType(galleryOpts, 'min_col_width'),
        gutter: ResponsiveAdapter.getOptionByMediaType(galleryOpts, 'gutter_width'),
        isFitWidth: false
      });
    }
    
  });

  return ThumbContainerMasonry;
});
