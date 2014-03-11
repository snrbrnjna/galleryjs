define([
  'jquery', 
  'vendor/jquery.touchSwipe',
  'underscore',
  'backbone'
],
function($, nope, _, Backbone) {
  
  /*
   * Model: GalleryModel
   */
  var CockpitView = Backbone.View.extend({
    
    el: '.cockpit',
    
    initialize: function() {
      if (this.$el.length) { // only when there's a cockpit on deck
        if (this.isActive()) { // activate cockpit: initialize buttons, etc
          this.button = this.$('.cockpit_button');
          this.body = this.$('.cockpit_body').addClass('hidden');
          this.slider = this.options.slider;
          
          this.listenTo(this.model, 'slider:newImage', this.updateImage);

          // not over built in events => doesn't work well on touch devices
          // this falls back to mouse events, when no touch events supported
          this.button.swipe({
            tap: _.bind(this.toggleBody, this)
          });
        } else { // hide and do nothing with CockpitView
          this.$el.hide();
        }
      }
    },
    
    // override Backbone.View#remove to remove the touch event listener
    remove: function() {
      this.button.swipe('destroy');
      Backbone.View.prototype.remove.call(this); // call super()
      // could also be written as:
      // this.constructor.__super__.remove.call(this);
    },
    
    isActive: function() {
      return this.options.cockpit;
    },
    
    toggleBody: function(evt) {
      this.body.toggleClass('hidden');
    },
    
    updateImage: function(largeView) {
      var imageModel = largeView.model;
      this.body.find('.index').html(imageModel.index()+1 +' / '+ this.model.get('images').length);
      this.body.find('.filename').html(imageModel.get('filename'));
    }
  });
  
  return CockpitView;
});