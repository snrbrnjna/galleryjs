define([
  'jquery',
  'jqueryui',
  'vendor/jquery.throttle-debounce',
  'underscore',
  'backbone',
  'lib/isotope.patcheko',
  'gallery/views/thumb.view'
],
function($, nope, nope2, _, Backbone, isotope, ThumbView) {
  
  /*
   * Model: GalleryModel
   *
   * listens once to 'change' on GalleryModel => init Thumbs
   * listens to 'slider:newImage' on GalleryModel => scrollToThumb
   * listens to 'resize.thumbContainer' on window => rearrange Thumbs
   *
   * The cosntructor needs the following options
   * - model
   * - el 
   */
  var ThumbContainerView = Backbone.View.extend({
  
    defaults: {
      itemSelector: '.photo'
    },
  
    initialize: function(options) {
      // merge defaults and options
      this.options = _.extend({}, this.defaults, this.options);
      
      // Checks on which device we are.
      this.responsiveAdapter = this.options.responsiveAdapter;

      // wait for the ImageCollection to be fetched
      this.listenToOnce(this.model, 'change', this.initThumbs);
      
      // handle resize
      $(window).on('resize.thumbContainer', _.bind($.debounce(200, this.resize), this));
    },
    
    initThumbs: function() {
      // initialize ThumbViews by iterating over existing thumbs in this container
      // and connect the ThumbViews with their respective thumb DOM element
      var galleryModel = this.model;
      var images = galleryModel.get('images');
      this.$(this.options.itemSelector).each(function() {
        var thumbContainer = $(this);
        // the digest has to be the id of the Thumb container
        var imageModel = images.get(thumbContainer.attr('id'));
        new ThumbView({
          model: imageModel,
          el: thumbContainer,
          gallery: galleryModel
        });
      });

      // initialize masonry/isotope on the thumb Container
      this.initMasonry(galleryModel.get('opts'));
            
      // Fade in initialized thumbs... (see gallery.css for details)
      // better to fade in every thumb on its own, when its loaded... (TODO) 
      this.$el.removeClass('loading'); // hide loading indicator
      this.$el.find(this.options.itemSelector).addClass('loaded', 400); // fade in thumbs
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
          minColWidth: this.responsiveAdapter.getOptionByMediaType(galleryOpts, 'min_col_width'),
          gutterWidth: this.responsiveAdapter.getOptionByMediaType(galleryOpts, 'gutter_width')
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
