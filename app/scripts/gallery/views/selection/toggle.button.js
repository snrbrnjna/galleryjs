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
  'underscore',
  'backbone',
  'gallery/views/selection/component'
],
function(_, Backbone, SelectionComponent) {

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
      var galleryImages = this.collection.gallery.get('images');
      
      if (!this.$el.hasClass('filtered')) {     // filter selected
        this.unfilteredImages = new Backbone.Collection(galleryImages.models);
        galleryImages.reset(this.collection.models);
      } else {                                  // unfilter selected
        galleryImages.reset(this.unfilteredImages.models);
        this.unfilteredImages = undefined;
      }
      this.$el.toggleClass('filtered');
    },

    // When an item gets removed and the selection is currently toggled (filtered), 
    // then we need to "synchronize" the corresponding ImageModel object in the 
    // unfiltered collection.
    itemRemoved: function(model, col, opts) {
      if (this.unfilteredImages) {
        var imageModel = this.unfilteredImages.get(model.id);
        if (imageModel) {
          imageModel.set('selected', false);
        }
      }
      SelectionComponent.prototype.itemRemoved.apply(this, arguments);
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
