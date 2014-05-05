define([
  'jquery',
  'backbone',
  'gallery/views/selection/select.button'
],
function($, Backbone, SelectButton) {
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
      this.model.setThumbView(this);
      this.gallery = this.options.gallery;
      this.template = this.options.template;
    },
    
    events: {
      'click': 'openInSlider'
    },
    
    openInSlider: function() {
      this.gallery.trigger('thumb:clicked', this.model);
    },
    
    render: function() {
      var html = this.template({img: this.model}).trim();
      this.setElement($.parseHTML(html));
      if (!this.selectButton) {
        this.selectButton = new SelectButton({
          model: this.model,
          el: this.$('.selector')
        });
      }
      return this;
    }
    
  });
  
  return ThumbView;
});
