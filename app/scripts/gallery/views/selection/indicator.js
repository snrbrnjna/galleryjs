/* SelectionIndicator
 * ---------------
 *
 * A view Component indicating the number of selected images. 
 *
 * Collection: SelectionCollection
 *
 */
define([
  'backbone',
  'gallery/views/selection/component'
],
function(Backbone, SelectionComponent) {

  var SelectionIndicator = SelectionComponent.extend({

    el: '.selection .indicator',

    selectionChanged: function(opts) {
      this.render();
    },

    render: function() {
      this.$el.html(this.collection.length);
    }

  });

  return SelectionIndicator;

});
