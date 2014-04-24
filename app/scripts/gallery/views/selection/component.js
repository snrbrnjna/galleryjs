/* SelectionComponent
 * ---------------
 *
 * A view Component. Baseclass for Selection View Components.
 * 
 * Waits for Initialization (sync) of the Collection, listens to changes of
 * Collection and sets active class on Element, when Collection is not empty.
 *
 * Collection: SelectionCollection
 *
 */
define([
  'backbone'
],
function(Backbone) {

  var SelectionComponent = Backbone.View.extend({

    initialize: function() {
      if (this.$el.length && this.collection) {
        this.listenToOnce(this.collection, 'sync', this.selectionSynced);
      }
    },

    selectionSynced: function(collection, resp, opts) {
      this.render(); // zero op, override, when needed.
      this.renderActive(collection.length > 0);
      this.$el.addClass('initialized');
      this.listenTo(this.collection, 'add', this.itemAdded);
      this.listenTo(this.collection, 'remove', this.itemRemoved);
    },

    itemAdded: function(model, col, opts) {
      if (col.length === 1) {
        this.renderActive(true);
      }
      this.selectionChanged(opts);
    },

    itemRemoved: function(model, col, opts) {
      if (col.length === 0) {
        this.renderActive(false);
      }
      this.selectionChanged(opts);
    },

    // zero op here, override this in your Class
    selectionChanged: function(opts) {
      return;
    },

    renderActive: function(active) {
      if (active) {
        this.$el.addClass('active');
      } else {
        this.$el.removeClass('active');
      }
    }

  });

  return SelectionComponent;

});
