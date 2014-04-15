define([
  'jquery',
  'underscore',
  'backbone',
  'gallery/utils/responsive.adapter'
],
function($, _, Backbone, ResponsiveAdapter) {
  /*
   * Model: ImageModel
   * Element: Large <img>
   * 
   * #slider: SliderView
   */
  var LargeView = Backbone.View.extend({
    
    debug: false,
    
    initialize: function() {
      this.slider = this.options.slider;
      
      this.currentSliderRatio = undefined;
      this.curDims =  {};
      
      this.largeAttrs = ResponsiveAdapter.presetMapperLarge(this.model);
      
      // Set this.$el to new img
      this.setElement($('<img/>'));
      this.$el
        .attr('src', this.largeAttrs.src)
        // Set Max-Width and Max-Height for not upscaling the image greater then
        // its original dimensions.
        .css({
          'max-width': this.largeAttrs.width,
          'max-height': this.largeAttrs.height
        });
      
      this.model.setLargeView(this);
    },
    
    events: {
      'load': 'loaded'
    },

    resize: function() {
      // Don't do nothing, if the tray size hasn't changed
      if (this.currentSliderRatio !== this.slider.ratio) {
        
        // Save current Tray Ratio for next calc..
        this.currentSliderRatio = this.slider.ratio;
    
        // Calculating new Dimensions
        this.curDims = this._calculateDims();
      
        // Set the Image Dimensions for fitting in and filling it's container
        // in setTimeout, so that the reset from above gets time to be applied
        var large = this;
        window.setTimeout(function() {
          large.$el.animate({
            width: large.curDims['px'][0],// + 'px', //newDims[0],
            height: large.curDims['px'][1]// + 'px', //newDims[1]
          }, 0);
        }, 0);
      }
    },
    
    getWidth: function() {
      return this.curDims['px'][0];
    },
    
    getHeight: function() {
      return this.curDims['px'][1];
    },
    
    /*
     * Berechnet die tatsächlichen Dimension-Werte      
     */
    _calculateDims: function() {
      var imgOrient = this.model.get('orientation');
      if (imgOrient === 'landscape') {
        this._setLargeToFullWith();
        // to high for the slider, when set to full slider width?
        if (this.curDims['px'][1] > this.slider.height) {
          if (this.debug) {console.log('ups, image to high for slider, when set to full slider width!');}
          this._setLargeToFullHeight();
        }
      } else if (imgOrient === 'portrait') {
        this._setLargeToFullHeight();
        // to wide for the slider, when set to full slider height?
        if (this.curDims['px'][0] > this.slider.width) {
          if (this.debug) {console.log('ups, image to wide for slider, when set to full slider height!');}
          this._setLargeToFullWith();
        }
      }
      return this.curDims;
    },
    
    _setLargeToFullWith: function() {
      this.curDims['percent'] = ['100%', ''];
      this.curDims['px'] = [
        Math.min(this.slider.width, this.largeAttrs.width),
        Math.min(Math.floor(this.slider.width/this.model.get('ratio')), this.largeAttrs.height)
      ];
      if (this.debug) {
        console.log('100% width =>'+ this.slider.width +'x'+
          this.curDims['px'][1] +'px; Container: '+
          this.slider.width +'x'+ this.slider.height +'px.');
      }
    },
    
    _setLargeToFullHeight: function() {
      this.curDims['percent'] = ['', '100%'];
      this.curDims['px'] = [
        Math.min(Math.floor(this.slider.height*this.model.get('ratio')), this.largeAttrs.width),
        Math.min(this.slider.height, this.largeAttrs.height)
      ];
      if (this.debug) {
        console.log('100% height =>'+ this.curDims['px'][0] +'x'+
          this.curDims['px'][1] +'px; container: ' +
          this.slider.width +'x'+ this.slider.height +'px.');
      }
    },
    
    loaded: function() {
      if (this.debug) {console.log('LargeView for Image '+ this.model.id +' is loaded');}
    }
  });
  
  return LargeView;
});
