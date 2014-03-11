define([
  'jquery',
  'imagesloaded', 
  'lib/jquery.inview',
  'underscore', 
  'backbone',
  'gallery/views/thumb.container.view',
  'gallery/views/thumb.view'
], function($, ImagesLoaded, nope, _, Backbone, ThumbContainerView, ThumbView) {
  
  /*
   * Adds the Thumbs in the Gallery json dynamically, when the json is loaded, to 
   * the Thumb Container. And not all thumbs at once, but in chunks as a 'stopper'
   * element comes into the viewport (jquery.inview).
   */
  var ThumbContainerDynamicView = ThumbContainerView.extend({
    
    debug: false,
    
    // override
    initialize: function() {
      // Read in inline Template 
      this.thumbTemplate = this.getThumbTemplate();
      
      this.loadedImages = 0;
      this.imagesToLoad;
      this.firstChunk = this.options.gallery_opts.first_chunk;
      this.chunkSize = this.options.gallery_opts.chunk_size;
      this.threshold = 300;
      
      this.constructor.__super__.initialize.apply(this, arguments);
      
      this.stopper = this.$el.next('.stopper');
      // check for new Slider image => load thumbs...
      this.listenTo(this.model, 'slider:newImage', this.onNewSliderImage);
      // check for slider gets closed => scroll to current image
      this.listenTo(this.model, 'slider:closing', this.onSliderClosing);
    },
    
    // override
    initThumbs: function() {
      
      this.imagesToLoad = this.model.get('images').models.slice(); // slice() means clone()
      
      // Render initial chunk of thumbs 
      var rendered_thumb_elements = this._renderChunk(this.firstChunk);
      
      // Reset Loading indicator on Container
      this.$el.removeClass('loading');
      
      // Check when Thumbs are loaded => Hide indicator & re-arrange masonry
      this._checkImagesLoaded(rendered_thumb_elements);
    },
        
    renderNextChunk: function() {
      // HACK, when imagesLoaded doesn't reach 'always' callback
      this.timeout_bind = window.setTimeout(_.bind(this._bindInview, this), 2000);
      // unbind stopper
      this._unbindInview();
      // render next chunk of thumbs
      var rendered_thumb_elements = this._renderChunk(this.chunkSize);
      // register loaded images
      this._checkImagesLoaded(rendered_thumb_elements);
    },
    
    // Binds this._onStopperAppeared function to inview event
    _bindInview: function() {
      window.clearTimeout(this.timeout_bind);
      if (this.imagesToLoad.length && !this._listening_for_inview) {
        this.stopper.show();
        this.stopper.on('inview', { threshold: this.threshold }, _.bind(this._onStopperAppeared, this));
        this._listening_for_inview = true;
        $(window).trigger('scroll');
      } else {
        this.stopper.hide();
      }
    },
    // Unbinds this._onStopperAppeared
    _unbindInview: function() {
      this.stopper.off('inview');
      this._listening_for_inview = false;
    },
    // Handler for 'endless-scroll' like inview.js events
    _onStopperAppeared: function(event, isInView, visiblePartX, visiblePartY) {
      if (isInView) {
        if (this.debug) {console.log('SToPPer gesichtet!');}
        this.renderNextChunk();
      } else {
        if (this.debug) {console.log('STopper out of sight!');}
      }
    },
    
    // returns number of remaining imagesToLoad
    _renderChunk: function(chunkSize) {      
      // Itearting over the loaded ImageModel objects and render them
      var rendered_thumb_elements = new Array();
      for(var i=0;i<chunkSize;i++) {
        imageModel = this.imagesToLoad.shift();
        if (imageModel) {
          var thumbView = new ThumbView({
            model: imageModel, 
            gallery: this.model,
            template: this.thumbTemplate,
            responsiveAdapter: this.responsiveAdapter
          });
          thumbView = thumbView.render();
          this.$el.append(thumbView.$el);
          this.$el.isotope('appended', thumbView.$el);
          rendered_thumb_elements.push(thumbView.el);
        } else {
          break;
        }
      }
      return rendered_thumb_elements;
    },
    
    _checkImagesLoaded: function(rendered_thumb_elements) {
      var instance = this;

      // Register imagesLoaded on newly rendered thumbs for switching 
      // loading/loaded classes
      ImagesLoaded(rendered_thumb_elements)
        .on('progress', function(imagesLoaded, loadingImage) {
          if (loadingImage.isLoaded) {
            var thumbItem = instance.switchThumbClass(loadingImage.img);
            instance.arrangeThumbs();
          }
        })
        .on('always', function() {
          if (instance.debug) {
            console.log('last stopperAppeared trigger completed.');
            console.log('left over imagesToLoad: ' + instance.imagesToLoad.length);
          }
          window.setTimeout(_.bind(instance.arrangeThumbs, instance), 200);
          instance._bindInview();
        })
        .on('fail', function(instance) {
          if (instance.debug) {
            console.log('FAIL - all images loaded, at least one is broken');
          }
        });
      
      // Check if some images are loaded yet 'before' ImagesLoaded call
      $(rendered_thumb_elements).each(function(idx, thumbImg) {
        if ($(thumbImg).prop('complete')) {
          var thumbItem = instance.switchThumbClass(thumbImg.img);
          instance.arrangeThumbs();
        }
      });
    },
    
    // TODO: Refactor into ThumbView
    switchThumbClass: function(img) {
      var thumbItem = $(img).parent();
      return thumbItem.switchClass('loading', 'loaded');
    },
    
    onNewSliderImage: function(largeView) {
      if (_.contains(this.imagesToLoad, largeView.model)) {
        window.setTimeout(_.bind(function() {this.renderNextChunk();}, this), 200);
      }
    },
    
    onSliderClosing: function(lastCurrentlargeView) {
      if (lastCurrentlargeView) {
        this.scrollToThumb(lastCurrentlargeView.model);      
      }
    },
    
    getThumbTemplate: function() {
      return _.template($('#template-thumb').html());
    }
    
  });
  
  return ThumbContainerDynamicView;
});