/* SelectionIndicator
 * ---------------
 *
 * A view Component indicating the number of selected images. 
 *
 * Collection: SelectionCollection
 *
 */
define([
  'backbone'
],
function(Backbone) {

  var SelectionIndicator = Backbone.View.extend({

    el: '.selection .indicator',

    initialize: function() {
      if (this.$el.length && this.collection) {
        this.listenToOnce(this.collection, 'sync', this.selectionSynced);
      }
    },

    selectionSynced: function(collection, resp, opts) {
      this.render();
      this.$el.addClass('initialized');
      this.listenTo(this.collection, 'add', this.itemAdded);
      this.listenTo(this.collection, 'remove', this.itemRemoved);
    },

    itemAdded: function(model, col, opts) {
      this.selectionChanged(opts);
    },

    itemRemoved: function(model, col, opts) {
      this.selectionChanged(opts);
    },

    selectionChanged: function(opts) {
      this.render();
    },

    render: function() {
      this.$el.html(this.collection.length);
      if (this.collection.length) {
        this.$el.addClass('active');
      } else {
        this.$el.removeClass('active');
      }
    }

  });

  return SelectionIndicator;

});
