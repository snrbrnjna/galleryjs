define([
  'backbone'
],
function(Backbone) {

  var SelectionIndicator = Backbone.View.extend({

    el: '.selection.indicator',

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
