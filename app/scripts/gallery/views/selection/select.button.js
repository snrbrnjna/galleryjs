define([
  'underscore',
  'backbone',
  'jquery',
  'hammerjs'
],
function (_, Backbone, $, Hammer) {

  /*
   * Model: ImageModel
   * Element: set with constructor
   */
  var SelectButton = Backbone.View.extend({

    initialize: function() {
      if (this.model && this.el) {
        this.listenTo(this.model, 'change:selected', this.updateSelected);
        this.updateSelected(this.model, this.model.get('selected'));

        this.mc = new Hammer.Manager(this.$el[0], {recognizers: [[Hammer.Tap]]});
        this.mc.on('tap', _.bind(this.toggleSelected, this));
      }
    },

    isVisible: function() {
      return this.$el.is(':visible') && this.$el.css('opacity') > 0;
    },

    // override Backbone.View#remove to remove the touch event listener
    remove: function() {
      this.mc.off('tap');
      Backbone.View.prototype.remove.call(this); // call super()
      // could also be written as:
      // this.constructor.__super__.remove.call(this);
    },

    toggleSelected: function(evt) {
      // DEBUG
      // console.log('SelectButton', evt.target, 'visible', this.isVisible());
      if (this.isVisible()) { // only toggle selected, when button is visible.
        evt.srcEvent.stopImmediatePropagation();
        this.model.set('selected', !this.model.get('selected'));
      }
    },

    updateSelected: function(ImageModel, selected) {
      if (selected) {
        this.$el.addClass('selected');
      } else {
        this.$el.removeClass('selected');
      }
    }

  });

  return SelectButton;
});
