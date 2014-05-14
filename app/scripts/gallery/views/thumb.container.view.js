define([
  'jquery',
  'vendor/jquery.throttle-debounce',
  'underscore',
  'backbone',
  'lib/isotope.patcheko',
  'gallery/views/thumb.view',
  'gallery/utils/responsive.adapter'
],
function($, nope, _, Backbone, isotope, ThumbView, ResponsiveAdapter) {
  
  /*
   * Model: GalleryModel
   *
   * listens once to 'change' on GalleryModel => init Thumbs
   * listens to 'slider:newImage' on GalleryModel => scrollToThumb
   * listens to 'resize.thumbContainer' on window => rearrange Thumbs
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

      // wait for the ImageCollection to be fetched
      this.listenTo(this.model, 'change', this.galleryFetched);
      
      // handle resize
      $(window).on('resize.thumbContainer', _.bind($.debounce(200, this.resize), this));
    },

    galleryFetched: function() {
      this.initGallery();
      this.initThumbs();
    },
    
    initGallery: function() {
      // initialize masonry/isotope on the thumb Container
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
      this.$el.isotope({
        itemSelector : this.options.itemSelector,
        // we want to handle resizing differently depending on the current slider state
        resizable: false,
        masonry: {
          minColWidth: ResponsiveAdapter.getOptionByMediaType(galleryOpts, 'min_col_width'),
          gutterWidth: ResponsiveAdapter.getOptionByMediaType(galleryOpts, 'gutter_width')
        }
      });
    },
  
    arrangeThumbs: function() {
      this.$el.isotope();
    },
    
    resize: function() {
      if (this.debug) { console.log('Slider currently: '+ this.model.sliderState); }
      var delay = (this.model.sliderState === 'closed' ? 0 : 200);
      var instance = this;
      window.setTimeout(function() {
        instance.arrangeThumbs();
      }, delay);
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
