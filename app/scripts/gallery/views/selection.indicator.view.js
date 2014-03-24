/* SelectionIndicator
 * ---------------
 *
 * A view Component indicating the number of selected images. 
 * It serves also as a btton for toggling between the selection and all the 
 * images in the current gallery.
 *
 */
define([
  'backbone'
],
function(Backbone) {

  var SelectionIndicator = Backbone.View.extend({

    el: '.selection.indicator',

    events: {
      'click': 'filter'
    },

    initialize: function() {
      if (this.$el.length && this.collection) {
        if (!this.collection.gallery) {
          this.collection.fetch();
        }
        this.listenTo(this.collection, 'add', this.itemAdded);
        this.listenTo(this.collection, 'remove', this.itemRemoved);
        this.listenToOnce(this.collection, 'sync', this.selectionSynced);
      }
    },

    itemAdded: function(model, col, opts) {
      this.selectionChanged(opts);
    },

    itemRemoved: function(model, col, opts) {
      this.selectionChanged(opts);
    },

    selectionSynced: function(collection, resp, opts) {
      this.render();
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
      if (!opts.parse) {
        this.render();
      }
    },

    render: function() {
      this.$el.html(this.collection.length + ' photos');
    }

  });

  return SelectionIndicator;

});
