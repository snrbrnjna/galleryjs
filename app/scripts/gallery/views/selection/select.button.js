define([
  'backbone',
  'jquery',
  'vendor/jquery.touchSwipe'
],
function (Backbone, $, nope) {

  /*
   * Model: ImageModel
   * Element: set with constructor
   */
  var SelectButton = Backbone.View.extend({

    initialize: function() {
      if (this.model && this.el) {
        this.listenTo(this.model, 'change:selected', this.updateSelected);
        this.updateSelected(this.model, this.model.get('selected'));

        // not with built in events => doesn't work well on touch devices
        // this falls back to mouse events, when no touch events supported
        this.$el.swipe({
          tap: _.bind(this.toggleSelected, this)
        });
      }
    },

    // override Backbone.View#remove to remove the touch event listener
    remove: function() {
      this.$el.swipe('destroy');
      Backbone.View.prototype.remove.call(this); // call super()
      // could also be written as:
      // this.constructor.__super__.remove.call(this);
    },

    toggleSelected: function(evt) {
      evt.stopImmediatePropagation();
      evt.preventDefault();
      this.model.set('selected', !this.model.get('selected'));
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
