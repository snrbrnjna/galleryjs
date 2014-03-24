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
  'gallery/views/selection.button.view'
],
function(Backbone, _, GalleryModel, SelectionCollection, ThumbContainerView,
  ThumbContainerDynamicView, SliderView, ResponsiveAdapter, SelectionButton) {
  
  var GalleryApp = Backbone.View.extend({
    
    el: 'article.gallery',

    initialize: function() {
      if (this.$el.length) {
        
        // Initialize the GalleryModel
        this.model = new GalleryModel({
          project: this.$el.data('project'),
          opts: this.$el.data('opts')
        });

        // Setup responsive Adapter
        this.responsiveAdapter = new ResponsiveAdapter();
        
        // Init SelectionCollection only
        // TODO: sollte in jedem Fall initialisiert werden. Wenn nicht aktiv, dann
        //       ohne gallery object.
        //   a) when there is the data attrib data-gal-selector
        //   b) on desktop
        if (this.responsiveAdapter.getMediaType() !== 'desktop') {
          // attr because we need a DOM manipulation here so that the css 
          // recognizes this setting
          this.$el.attr('data-gal-selection', false);
        }
        if (this.$el.data('gal-selection')) {
          this.selection = new SelectionCollection([], {
            gallery: this.model,
            storageKey: this.$el.data('gal-selection')
          });
          this.selectionButton = new SelectionButton({
            collection: this.selection
          });
        }

        // Instanciate the ThumbContainerView (dynamic or standard?)
        var thumbContainerOptions = {
          model: this.model,
          itemSelector: '.photo',
          responsiveAdapter: this.responsiveAdapter
        };
        if (this.$('.container.photos .photo').length) {
          this.containerView = new ThumbContainerView(thumbContainerOptions);
        } else {
          this.containerView = new ThumbContainerDynamicView(thumbContainerOptions);
        }
        
        // Fetch Gallery Data from Server
        this.model.fetch();

        // Instanciate the SliderView
        this.sliderView = new SliderView({
          el: this.$('.slider'),
          model: this.model,
          responsiveAdapter: this.responsiveAdapter
        });
      }
    }
  });
  
  return GalleryApp;

});
