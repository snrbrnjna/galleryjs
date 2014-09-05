define([
  'jquery',
  'jquery-touchswipe',
  'backbone',
  'gallery/views/selection/select.button'
],
function($, nope, Backbone, SelectButton) {
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

      this.doubleTap = this.gallery.get('opts')['double_tap_thumb'];
    },

    // need swipeTouch here for tap shit working correctly
    // events: {
    //   'click': 'openInSlider'
    // },

    // override Backbone.View#remove to remove the touch event listener
    remove: function() {
      this.$el.swipe('destroy');
      Backbone.View.prototype.remove.call(this); // call super()
      // could also be written as:
      // this.constructor.__super__.remove.call(this);
    },

    // double tap feature, when touched
    clickOrTapped: function(evt) {
      if (evt.type == 'touchend' && this.doubleTap) {
        this.$el.addClass('double-tap'); // mark as double tap touch interaction for css styling
        if (this.$el[0].querySelector(':hover') !== null) {
          this.openInSlider(); 
        }
      } else {
        this.openInSlider();
      }
    },
    
    openInSlider: function() {
      this.gallery.trigger('thumb:clicked', this.model);
    },
    
    render: function() {
      var html = this.template({img: this.model}).trim();
      this.setElement($.parseHTML(html));

      // not with built in events => doesn't work well on touch devices
      // this falls back to mouse events, when no touch events supported
      this.$el.swipe({
        tap: _.bind(this.clickOrTapped, this)
      });

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
