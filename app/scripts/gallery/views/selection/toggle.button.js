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
  'backbone'
],
function(Backbone) {

  var SelectionToggleButton = Backbone.View.extend({

    el: '.selection .button.toggle',

    events: {
      'click': 'toggle'
    },

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
    },

    render: function() {
      this.$el.html(this.collection.length + ' photos');
      if (this.collection.length) {
        this.$el.addClass('active');
      } else {
        this.$el.removeClass('active');
      }
    }

  });

  return SelectionToggleButton;

});
