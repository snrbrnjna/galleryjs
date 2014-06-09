/* jshint camelcase: false */
/*
 * Gallery App
 *
 * Options:
 * - el: Element to initialize the Gallery on.
 * - onInit: Callback for when the GalleryApp is initialized (the Images are 
 *           loaded). The callback receives to args: GalleryApp and GalleryModel
 */
define([
  'backbone',
  'underscore',
  'gallery/models/gallery.factory',
  'gallery/collections/selection.collection',
  'gallery/views/thumb.container.view',
  'gallery/views/thumb.container.dynamic.view',
  'gallery/views/slider.view',
  'gallery/utils/responsive.adapter',
  'gallery/views/selection/toggle.button',
  'gallery/views/selection/pdf.button',
  'gallery/views/selection/indicator',
  'gallery/views/selection/component'
],
function(Backbone, _, GalleryFactory, SelectionCollection,
  ThumbContainerView, ThumbContainerDynamicView, SliderView, ResponsiveAdapter,
  SelectionToggleButton, SelectionPdfButton, SelectionIndicator,
  SelectionComponent) {
  
  var GalleryApp = Backbone.View.extend({
    
    el: 'article.gallery',

    initialize: function(opts) {
      if (this.$el.length) {
        
        // Init GalleryModel
        this.model = GalleryFactory.create(this.$el);

        // Init Selection
        if (ResponsiveAdapter.getMediaType() === 'desktop') {
          this.initSelection();
        } else {
          this.$el.removeAttr('data-gal-selection');
        }

        // Init ThumbContainerView
        this.initThumbContainer();
        
        // Fetch Gallery Data from Server
        this.model.fetch({
          success: _.bind(function(model, resp, _opts) {
            var $el = this.$el;
            // mark DOM Element as initialized
            $el.addClass('initialized');
            // mark DOM Element as empty
            if (model.get('images').isEmpty()) {
              $el.addClass('empty');
            }
            // listenTo remove Events => mark empty
            this.listenTo(model.get('images'), 'remove', function(m,c,o) {
              if (c.isEmpty()) { $el.addClass('empty'); }
            });
            if (opts.onInit) { opts.onInit(this, this.model); }
          }, this)
        });

        // Instanciate the SliderView
        this.initSlider();

        // make gallery object available in DOM
        this.$el.data('gallery', this);
      }
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

        // init selection components, which only need to be initialized and set active/inactive
        new SelectionComponent({
          el: $('.selection .component'),
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
