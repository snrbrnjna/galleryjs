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

        this.button = this.$('.cockpit_button');
        this.body = this.$('.cockpit_body').addClass('hidden');
        this._bodyTemplate = this.getTemplate();
        this.slider = this.options.slider;
        
        this.listenTo(this.model, 'slider:newImage', this.onNewImage);

        // not over built in events => doesn't work well on touch devices
        // this falls back to mouse events, when no touch events supported
        this.button.swipe({
          tap: _.bind(this.toggleBody, this)
        });
      }
    },
    
    // override Backbone.View#remove to remove the touch event listener
    remove: function() {
      this.button.swipe('destroy');
      Backbone.View.prototype.remove.call(this); // call super()
      // could also be written as:
      // this.constructor.__super__.remove.call(this);
    },

    isOpen: function() {
      return !this.body.hasClass('hidden');
    },
    
    toggleBody: function(evt) {
      this.body.toggleClass('hidden');
      this.update(this.model.getCurrent());
    },

    onNewImage: function(largeView) {
      this.update(largeView.model);
    },
    
    update: function(imageModel) {
      if (this.isOpen()) {
        this.body.html(this._bodyTemplate({img: imageModel}));
      }
    },

    getTemplate: function() {
      var tmpl = $('#template-cockpitBody');
      if (tmpl.length) {
        return _.template(tmpl.html());
      } else {
        console.error('Missing Template for Cockpit ($("#template-cockpitBody")! => Cockpit not initialized.');
        this.$el.hide();
      }
      
    }
  });
  
  return CockpitView;
});
