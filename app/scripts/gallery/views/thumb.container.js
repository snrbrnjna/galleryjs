define([
  'jquery',
  'vendor/jquery.throttle-debounce',
  'underscore',
  'backbone',
  'gallery/views/thumb.view',
  'gallery/utils/responsive.adapter'
],
function($, nope, _, Backbone, ThumbView, ResponsiveAdapter) {
  
  /*
   * Model: GalleryModel
   *
   * listens once to 'change' on GalleryModel => init Thumbs
   *
   * The constructor needs the following options
   * - model
   * - el 
   */
  var ThumbContainer = Backbone.View.extend({
  
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
    
    // noop / abstract method
    initGallery: function() {},

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

  return ThumbContainer;
});
