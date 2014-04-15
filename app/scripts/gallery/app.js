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
  'gallery/views/selection.toggle.button',
  'gallery/views/selection.pdf.button'
],
function(Backbone, _, GalleryModel, SelectionCollection, ThumbContainerView,
  ThumbContainerDynamicView, SliderView, ResponsiveAdapter, SelectionToggleButton,
  SelectionPdfButton) {
  
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
      this.model = new GalleryModel({
        project: this.$el.data('project'),
        opts: this.$el.data('opts')
      });
    },

    // Init SelectionCollection only when there is the data attrib data-gal-selector
    initSelection: function() {
      if (this.$el.data('gal-selection')) {
        // init selection collection
        this.selection = new SelectionCollection([], {
          gallery: this.model
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
