define([
  'jquery',
  'jquery-touchswipe',
  'underscore',
  'backbone',
  'gallery/views/selection/select.button'
],
function($, nope, _, Backbone, SelectButton) {
  
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

        // not with built in events => doesn't work well on touch devices
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
      this.renderBody(this.model.getCurrent());
    },

    onNewImage: function(largeView) {
      this.renderBody(largeView.model);
    },
    
    renderBody: function(imageModel) {
      if (this.isOpen()) {
        // render image meta
        this.body.html(this._bodyTemplate({img: imageModel}));
        
        // update SelectButton if present in template
        var selector = this.$('.selector');
        if (selector.length) {
          this.updateSelectButton(selector, imageModel);
        }
      }
    },

    updateSelectButton: function(selector, imageModel) {
      if (this.selectButton) { // remove old SelectButton if present
        this.selectButton.remove();
      }
      this.selectButton = new SelectButton({
        model: imageModel,
        el: selector
      });
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
