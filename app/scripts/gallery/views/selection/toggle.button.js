/* SelectionToggleButton
 * ---------------
 *
 * A view Component for toggling between the Images in the selection and all the 
 * images of the current gallery.
 *
 * Collection: SelectionCollection
 *
 */
define([
  'backbone',
  'gallery/views/selection/component'
],
function(Backbone, SelectionComponent) {

  var SelectionToggleButton = SelectionComponent.extend({

    el: '.selection .button.toggle',

    events: {
      'click': 'toggle'
    },

    toggle: function() {
      if (this.$el.hasClass('active')) {
        this.filter();
      }
    },

    filter: function() {
      if (!this.$el.hasClass('filtered')) {
        this.collection.gallery.set('images', this.collection);
      } else {
        this.collection.gallery.fetch();
      }
      this.$el.toggleClass('filtered');
    },

    selectionChanged: function(opts) {
      // toggle filter if selection empty and currently filtered.
      if (this.collection.length === 0 && this.$el.hasClass('filtered')) {
        this.filter();
      }
    }

  });

  return SelectionToggleButton;

});
