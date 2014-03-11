/*
 * Gallery App
 */
define([
  'backbone',
  'gallery/models/gallery.model',
  'gallery/views/thumb.container.view', 
  'gallery/views/thumb.container.dynamic.view', 
  'gallery/views/slider.view',
  'gallery/utils/responsive.adapter'
], 
function(Backbone, GalleryModel, ThumbContainerView, ThumbContainerDynamicView, SliderView, ResponsiveAdapter) {
  
  var GalleryApp = Backbone.View.extend({
    
    el: 'article.gallery',
    
    initialize: function() {
      if (this.$el.length) {
        
        // Read in Options from gallery template
        this.opts = this.$el.data('opts');
        
        // Initialize the GalleryModel
        this.model = new GalleryModel({
          project: this.$el.data('project')
        });
        
        // Setup responsive Adapter
        this.responsiveAdapter = new ResponsiveAdapter(this.opts);
        
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
          model: this.model, 
          responsiveAdapter: this.responsiveAdapter
        });
      }
    }
  });
  
  return GalleryApp;

});