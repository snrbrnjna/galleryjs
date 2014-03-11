define([
  'jquery',
  'underscore'
], function($, _) {
  
  /*
   * ResponsiveAdapter
   *
   * Knows how diverse Modules react different in some aspects to different 
   * devices.
   * Knows which preset to choose for the device on which we are. 
   * i.e. replaces thumb with thumb_phone
   *
   * opts comes with the different values from the gallery template (config.yml)
   */
  var ResponsiveAdapter = function(opts) {
    this.mediaType = this.setMediaType();
    this.opts = opts;
  };
  
  _.extend(ResponsiveAdapter.prototype, {
    
    setMediaType: function() {
      if (!window.getComputedStyle) {
        return this.mediaType = 'desktop';
      }
      var mt = window.getComputedStyle(document.body,':after')
        .getPropertyValue('content').match(/[a-zA-Z_\-0-9]+/g);
      
      console.log(mt);

      return this.mediaType = mt && mt.length>0 ? mt[0] : 'desktop';
    },
    
    /*
     * Mediatype is defined in devices.css with media queries. 
     * Default values for media types are 'desktop', 'pads', 'phones'
     */
    getMediaType: function() {
      return this.mediaType;
    },
    
    /*
     * minimum width of cell (thumb) in masonry layout (thumb can get till 
     * double in size, depending on container-width)
     */
    getMasonryMinColWidth: function() {
      if ($.isPlainObject(this.opts['min_col_width'])) {
        return this.opts['min_col_width'][this.mediaType];
      } else {
        return this.opts['min_col_width'];
      }
    },
    
    /*
     * Width of gutter (= space between masonry cells)
     */
    getMasonryGutterWidth: function() {
      if ($.isPlainObject(this.opts['gutter_width'])) {
        return this.opts['gutter_width'][this.mediaType];
      } else {
        return this.opts['gutter_width'];
      }
    },
    
    presetMapperThumb: function(imageModel) {
      var preset;
      switch(this.mediaType) {
        case 'desktop':
        case 'pad':
        case 'phone':
          preset = imageModel.get('thumb');
          break;
      }
      return preset;
    },

    presetMapperLarge: function(imageModel) {
      var preset;
      switch(this.mediaType) {
        case 'desktop':
          preset = imageModel.get('large');
          break;
        case 'pad':
          preset = imageModel.get('large_pads');
          break;
        case 'phone':
          preset = imageModel.get('large_phones');
          break;
      }
      return preset;
    }
    
  });
  
  return ResponsiveAdapter;
});
