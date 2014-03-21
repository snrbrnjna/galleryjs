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
      this.threshold = 300;
      
      this.constructor.__super__.initialize.apply(this, arguments);
      
      this.stopper = this.$el.next('.stopper');
      // check for new Slider image => load thumbs...
      this.listenTo(this.model, 'slider:newImage', this.onNewSliderImage);
      // check for slider gets closed => scroll to current image
      this.listenTo(this.model, 'slider:closing', this.onSliderClosing);
    },
    
    initGallery: function() {
      // get options from fetched GalleryModel
      var galleryOpts = this.model.get('opts');
      this.firstChunk = this.responsiveAdapter.getOptionByMediaType(galleryOpts, 'first_chunk');
      this.chunkSize = this.responsiveAdapter.getOptionByMediaType(galleryOpts, 'chunk_size');

      this.constructor.__super__.initGallery.apply(this, arguments);
    },

    // override
    initThumbs: function() {
      this.remove(); // remove old Thumbs

      this._listeningForInview = false;

      this.imagesToLoad = this.model.get('images').models.slice(); // slice() means clone()
      
      // Render initial chunk of thumbs 
      var renderedThumbElements = this._renderChunk(this.firstChunk);
      
      // Reset Loading indicator on Container
      this.$el.removeClass('loading');
      
      // Check when Thumbs are loaded => Hide indicator & re-arrange masonry
      this._checkImagesLoaded(renderedThumbElements);
    },

    remove: function() {
      this.$el.isotope('remove', this.$el.children(), function() {
        console.log('items removed: ', arguments);
      });
    },
        
    renderNextChunk: function() {
      // HACK, when imagesLoaded doesn't reach 'always' callback (TODO: muss das noch sein?)
      this.timeoutBind = window.setTimeout(_.bind(this._bindInview, this), 2000);
      // unbind stopper
      this._unbindInview();
      // render next chunk of thumbs
      var renderedThumbElements = this._renderChunk(this.chunkSize);
      // register loaded images
      this._checkImagesLoaded(renderedThumbElements);
    },
    
    // Binds this._onStopperAppeared function to inview event
    _bindInview: function() {
      window.clearTimeout(this.timeoutBind);
      if (this.imagesToLoad.length && !this._listeningForInview) {
        this.stopper.show();
        this.stopper.on('inview', { threshold: this.threshold }, _.bind(this._onStopperAppeared, this));
        this._listeningForInview = true;
        $(window).trigger('scroll');
      } else {
        this.stopper.hide();
      }
    },
    // Unbinds this._onStopperAppeared
    _unbindInview: function() {
      this.stopper.off('inview');
      this._listeningForInview = false;
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
      var renderedThumbElements = [];
      var imageModel;
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
          renderedThumbElements.push(thumbView.el);
        } else {
          break;
        }
      }
      return renderedThumbElements;
    },
    
    _checkImagesLoaded: function(renderedThumbElements) {
      var instance = this;

      // Register imagesLoaded on newly rendered thumbs for switching 
      // loading/loaded classes
      new ImagesLoaded(renderedThumbElements)
        .on('progress', function(imagesLoaded, loadingImage) {
          if (loadingImage.isLoaded) {
            instance.switchThumbClass(loadingImage.img);
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
      $(renderedThumbElements).each(function(idx, thumbImg) {
        if ($(thumbImg).prop('complete')) {
          instance.switchThumbClass(thumbImg.img);
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
