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

    // the ones with data-selection get their elements passed in explicitly (see app.js)
    el: '.selection .indicator:not([data-selection])',

    selectionChanged: function(opts) {
      this.render();
    },

    render: function() {
      this.$el.html(this.collection.length);
    }

  });

  return SelectionIndicator;

});
