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
  'gallery/utils/responsive.adapter'
],
function(Backbone, _, GalleryModel, SelectionCollection, ThumbContainerView, ThumbContainerDynamicView, SliderView, ResponsiveAdapter) {
  
  var GalleryApp = Backbone.View.extend({
    
    el: 'article.gallery',

    defaults: {
      min_col_width: {
        desktop: 320,
        pad: 320,
        phone: 300
      },
      gutter_width: 3,
      chunk_size: 8,
      first_chunk: 15
    },
    
    initialize: function() {
      if (this.$el.length) {
        
        // Read in Options from gallery template
        this.opts = _.extend({}, this.defaults, this.$el.data('opts'));
        
        // Initialize the GalleryModel
        this.model = new GalleryModel({
          project: this.$el.data('project')
        });

        
        // Setup responsive Adapter
        this.responsiveAdapter = new ResponsiveAdapter(this.opts);
        
        // Init Selection only
        //   a) when there is the data attrib data-gal-selector
        //   b) on desktop
        if (this.responsiveAdapter.getMediaType() !== 'desktop') {
          // attr because we need a DOM manipulation here so that the css 
          // recognizes this setting
          this.$el.attr('data-gal-selection', false);
        }
        if (this.$el.data('gal-selection')) {
          this.selection = new SelectionCollection([], {
            gallery: this.model
          });
        }

        // Instanciate the ThumbContainerView (dynamic or standard?)
        var thumbContainer = this.$el.find('.container.photos');
        var thumbContainerOptions = {
          model: this.model,
          el: thumbContainer,
          itemSelector: '.photo',
          responsiveAdapter: this.responsiveAdapter,
          gallery_opts: this.opts
        };
        if (thumbContainer.find('.photo').length) {
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
