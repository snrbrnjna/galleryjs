define([
  'jquery',
  'underscore',
  'backbone',
  'gallery/views/selection/select.button',
  'hammerjs'
],
function($, _, Backbone, SelectButton, Hammer) {

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

      this.doubleTapEnabled = this.gallery.get('opts')['double_tap_thumb'];
    },

    // override Backbone.View#remove to remove the touch event listener
    remove: function() {
      this.mc.off('tap');
      Backbone.View.prototype.remove.call(this); // call super()
      // could also be written as:
      // this.constructor.__super__.remove.call(this);
    },

    // double tap feature, when touched
    tap: function(evt) {
      // DEBUG
      // console.log('ThumbView tap, target:', evt.target, 'selectorVisible:', this.selectButton.isVisible());

      // target selectButton and button is visible => no tap thumb functionality
      if (evt.target === this.selectButton.$el[0] && this.selectButton.isVisible()) {return true;}

      // double tap only with real touch events
      if (this.doubleTapEnabled && evt.pointerType !== 'mouse') {
        // mark as tapped for double tap interaction and for css styling
        this.$el.siblings('.tapped').not(this.$el).removeClass('tapped');
        if (!this.$el.hasClass('tapped')) {
          this.$el.addClass('tapped');
          return;
        }
      }
      this.openInSlider();
    },

    openInSlider: function() {
      this.gallery.trigger('thumb:clicked', this.model);
    },

    render: function() {
      var html = this.template({img: this.model}).trim();
      this.setElement($.parseHTML(html));

      // listen on tap events => extra behaviour for taps, when double_tap_thumb option
      // hammerjs simulates taps when using a mouse or other pointer.
      this.mc = new Hammer.Manager(this.$el[0], {recognizers: [[Hammer.Tap]]});
      this.mc.on('tap', _.bind(this.tap, this));

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
