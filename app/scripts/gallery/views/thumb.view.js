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
      'click': 'openInSlider',
      'click .selector': 'toggleSelector'
    },
    
    openInSlider: function() {
      this.gallery.trigger('thumb:clicked', this.model);
    },

    toggleSelector: function(evt) {
      evt.stopImmediatePropagation();
      this.selector && this.selector.toggleClass('selected'); // jshint ignore:line
      console.log('toggglglglggggle!', this.selector);
    },
    
    render: function() {
      var preset = this.responsiveAdapter.presetMapperThumb(this.model);
      var html = this.template({
        src: preset['src'],
        digest: this.model.get('digest')
      }).trim();
      this.setElement($.parseHTML(html));
      this.selector = this.$('.selector');
      return this;
    }
    
  });
  
  return ThumbView;
});
