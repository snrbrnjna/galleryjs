define([
  'backbone'
],
function (Backbone) {

  /*
   * Model: ImageModel
   * Element: set with constructor
   */
  var SelectButton = Backbone.View.extend({

    initialize: function() {
      if (this.model && this.el) {
        this.listenTo(this.model, 'change:selected', this.updateSelected);
        this.updateSelected(this.model, this.model.get('selected'));
      }
    },

    events: {
      'click': 'toggleSelected'
    },

    toggleSelected: function(evt) {
      evt.stopImmediatePropagation();
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
