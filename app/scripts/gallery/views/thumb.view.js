define([
  'jquery',
  'backbone'
], 
function($, Backbone) {
  /*
   * Model: ImageModel
   * Element: Thumb Container
   * #gallery: GalleryModel
   */
  var ThumbView = Backbone.View.extend({
    
    /*
     * options.gallery expected!
     */
    initialize: function() {        
      // Reference the view on the model. TODO: do we need this?
      this.model.setThumbView(this);
      this.gallery = this.options.gallery;
      this.template = this.options.template;
      this.responsiveAdapter = this.options.responsiveAdapter;
    },
    
    events: {
      'click': 'openInSlider'
    },
    
    openInSlider: function() {
      this.gallery.trigger('thumb:clicked', this.model);
    },
    
    render: function() {
      var preset = this.responsiveAdapter.presetMapperThumb(this.model);
      var html = this.template({
        src: preset['src'],
        digest: this.model.get('digest')
      }).trim();
      this.setElement($.parseHTML(html));
      return this;
    }
    
  });
  
  return ThumbView;
});