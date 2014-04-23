/* SelectionToggleButton
 * ---------------
 *
 * A view Component indicating the number of selected images. 
 * It serves also as a btton for toggling between the selection and all the 
 * images in the current gallery.
 *
 * Collection: SelectionCollection
 *
 */
define([
  'backbone',
  'gallery/views/selection/indicator'
],
function(Backbone, SelectionIndicator) {

  var SelectionToggleButton = SelectionIndicator.extend({

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
      this.render();
    }

  });

  return SelectionToggleButton;

});
