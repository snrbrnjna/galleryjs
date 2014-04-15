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
      this.model.setThumbView(this);
      this.gallery = this.options.gallery;
      this.template = this.options.template;

      this.listenTo(this.model, 'change:selected', this.updateSelected);
    },
    
    events: {
      'click': 'openInSlider',
      'click .selector': 'toggleSelected'
    },
    
    openInSlider: function() {
      this.gallery.trigger('thumb:clicked', this.model);
    },

    toggleSelected: function(evt) {
      evt.stopImmediatePropagation();
      if (this.selector) {
        this.model.set('selected', !this.model.get('selected'));
      }
    },

    updateSelected: function(ImageModel, selected) {
      if (selected) {
        this.$el.addClass('selected');
      } else {
        this.$el.removeClass('selected');
      }
    },
    
    render: function() {
      var html = this.template({img: this.model}).trim();
      this.setElement($.parseHTML(html));
      this.selector = this.$('.selector');
      this.updateSelected(this.model, this.model.get('selected'));
      return this;
    }
    
  });
  
  return ThumbView;
});
