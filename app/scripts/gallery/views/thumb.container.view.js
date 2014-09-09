define([
  'jquery',
  'vendor/jquery.throttle-debounce',
  'underscore',
  'backbone',
  'jquery-bridget/jquery.bridget',
  'fluid-masonry',
  'gallery/views/thumb.view',
  'gallery/utils/responsive.adapter'
],
function($, nope, _, Backbone, nope2, FluidMasonry, ThumbView, ResponsiveAdapter) {
  
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
  var ThumbContainerView = Backbone.View.extend({
  
    el: '.container.photos', // default, can be overridden with constructor

    defaults: {
      itemSelector: '.photo'
    },
  
    initialize: function(options) {
      // merge defaults and options
      this.options = _.extend({}, this.defaults, this.options);

      // mark container as loading
      this.$el.addClass('loading');

      // wait for the ImageCollection to be fetched
      this.listenTo(this.model, 'change', this.galleryFetched);
    },

    galleryFetched: function() {
      this.$el.addClass('fetched');
      this.initGallery();
      this.initThumbs();
    },
    
    initGallery: function() {
      // initialize masonry on the thumb Container
      this.initMasonry(this.model.get('opts'));
    },

    initThumbs: function() {
      // initialize ThumbViews by iterating over existing thumbs in this container
      // and connect the ThumbViews with their respective thumb DOM element
      var imageCollection = this.model.get('images');
      this.$(this.options.itemSelector).each(function() {
        var thumbContainer = $(this);
        // the digest has to be the id of the Thumb container
        var imageModel = imageCollection.get(thumbContainer.attr('id'));
        new ThumbView({
          model: imageModel,
          el: thumbContainer,
          gallery: this.model
        });
      });
            
      // Fade in initialized thumbs... (see gallery.css for details)
      this.$el.removeClass('loading'); // hide loading indicator
      this.$el.find(this.options.itemSelector).addClass('loaded'); // fade in thumbs
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
  
    arrangeThumbs: function() {
      this.$el.fluidMasonry();
    },
            
    // scroll to thumbView
    scrollToThumb: function(imageModel) {
      window.setTimeout(function() {
        if (imageModel) {
          var thumbView = imageModel.getThumbView();
          if (thumbView) {
            $('html, body').animate({
              scrollTop: thumbView.$el.offset().top
            }, 100);
          }
        }
      }, 200);
    }
    
  });

  return ThumbContainerView;
});
