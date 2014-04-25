/* jshint camelcase: false */
/*
 * Gallery App
 */
define([
  'backbone',
  'underscore',
  'gallery/models/gallery.model',
  'gallery/collections/selection.collection',
  'gallery/views/thumb.container.view',
  'gallery/views/thumb.container.dynamic.view',
  'gallery/views/slider.view',
  'gallery/utils/responsive.adapter',
  'gallery/views/selection/toggle.button',
  'gallery/views/selection/pdf.button',
  'gallery/views/selection/indicator'
],
function(Backbone, _, GalleryModel, SelectionCollection, ThumbContainerView,
  ThumbContainerDynamicView, SliderView, ResponsiveAdapter, SelectionToggleButton,
  SelectionPdfButton, SelectionIndicator) {
  
  var GalleryApp = Backbone.View.extend({
    
    el: 'article.gallery',

    initialize: function() {
      if (this.$el.length) {
        
        // Init Model
        this.initGalleryModel();

        // Init Selection
        if (ResponsiveAdapter.getMediaType() === 'desktop') {
          this.initSelection();
        } else {
          this.$el.removeAttr('data-gal-selection');
        }

        // Init ThumbContainerView
        this.initThumbContainer();
        
        // Fetch Gallery Data from Server
        this.model.fetch();

        // Instanciate the SliderView
        this.initSlider();
      }
    },

    // Initialize the GalleryModel
    initGalleryModel: function() {

      // get Gallery source
      var src = this.$el.data('src');
      if (src === undefined) {
        if (this.$el.data('project')) {
          src = this.$el.data('project') + '.json';
          console.warn('"data-project" as a data source for galleryjs is deprecated! Use "data-src" instead!');
        }
      }

      // initialize GalleryModel
      this.model = new GalleryModel({
        src: src,
        opts: this.$el.data('opts')
      });
    },

    // Init SelectionCollection only when there is the data attrib data-gal-selector
    initSelection: function() {
      if (this.$el.data('gal-selection') !== undefined) {
        // init selection collection
        this.selection = new SelectionCollection([], {
          gallery: this.model,
          key: this.$el.data('gal-selection')
        });

        // init selection indicator
        this.selectionIndicator = new SelectionIndicator({
          collection: this.selection
        });

        // init toggle button
        this.selectionToggleButton = new SelectionToggleButton({
          collection: this.selection
        });

        // init pdf button
        this.selectionPdfButton = new SelectionPdfButton({
          collection: this.selection
        });
      }
    },

    // Instanciate the ThumbContainerView (dynamic or standard?)
    initThumbContainer: function() {
      var thumbContainerOptions = {
        model: this.model,
        itemSelector: '.photo'
      };
      if (this.$('.container.photos .photo').length) {
        this.containerView = new ThumbContainerView(thumbContainerOptions);
      } else {
        this.containerView = new ThumbContainerDynamicView(thumbContainerOptions);
      }
    },

    initSlider: function() {
      this.sliderView = new SliderView({
        el: this.$('.slider'),
        model: this.model
      });
    }

  });
  
  return GalleryApp;

});
