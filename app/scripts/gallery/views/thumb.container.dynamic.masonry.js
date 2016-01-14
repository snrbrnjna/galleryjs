define([
  'jquery',
  'jquery-bridget/jquery.bridget',
  'fluid-masonry',
  'underscore',
  'backbone',
  'gallery/views/thumb.container.dynamic',
  'gallery/utils/responsive.adapter',
  'vendor/jquery.throttle-debounce'
], function($, nope, FluidMasonry, _, Backbone, ThumbContainerDynamic, ResponsiveAdapter, nope2) {

  $.bridget('fluidMasonry', FluidMasonry);

  /*
   * Adds the Thumbs in the Gallery json dynamically, when the json is loaded, to
   * the Thumb Container. And not all thumbs at once, but in chunks as a 'stopper'
   * element comes into the viewport (jquery.inview).
   */
  var ThumbContainerDynamicMasonry = ThumbContainerDynamic.extend({

    debug: false,

    // override
    initialize: function() {
      ThumbContainerDynamic.prototype.initialize.apply(this, arguments);

      // Listen on window resize to eventually recalculate col with and gutter
      $(window).on('resize.masonry', $.debounce(300, _.bind(function() {
        this.initMasonry(this.model.get('opts'));
        $(window).trigger('scroll');
      }, this)));
    },

    initGallery: function() {
      ThumbContainerDynamic.prototype.initGallery.apply(this, arguments);
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
    },

    remove: function() {
      this.$el.fluidMasonry('remove', this.$el.children());
    },

    removeThumb: function(model, collection, options) {
      var $el = this.$el;
      $el.fluidMasonry('remove', model.getThumbView().$el);
      $el.fluidMasonry();
    },

    // (re)layout masonry
    // TODO/REFACTOR: wird von imagesloaded aufgerufen => ein weiteres/alle Bild(er) wurde fertig geladen.
    arrangeThumbs: function() {
      this.$el.fluidMasonry();
    },

    // callback for a new thumbView is instanciated and added to the dom
    thumbAdded: function(thumbView) {
      this.$el.fluidMasonry('appended', thumbView.$el);
    }

  });

  return ThumbContainerDynamicMasonry;
});
