/*
 * GalleryImage Model
 * ----------
 *
 * Our basic **ImageModel** has attributes for the 'thumb',
 * 'large' and metadata like 'orientation', 'ratio', 'exif'...
 *
 */
define([
  'backbone'
], function(Backbone) {
  var ImageModel = Backbone.Model.extend({

    idAttribute: 'digest',

    // Default attributes for the todo item.
    defaults: function() {
      return {
        thumb: {
          src: undefined,
          width: undefined,
          height: undefined,
          _view: undefined
        },
        large: {
          src: undefined,
          width: undefined,
          height: undefined,
          _view: undefined
        },
        filename: undefined,
        digest: undefined,
        index: undefined,
        orientation: undefined, // landscape | portrait
        ratio: 0, // < 1 => portrait | > 1 landscape TODO: Doppelung
        exif: {} 
      };
    },
    
    // Constructor/Initializer has to be called with a options.presets hash with 
    // a baseurl for every preset (minimum: thumb & large).
    initialize: function(attrs, options) {
      // set the src attribute for every preset
      _.forEach(options.presets, _.bind(function(preset, preset_key) {
        this.attributes[preset_key]['src'] = preset['baseurl'] + '/' + attrs['filename'];
      }, this));
    },
    
    getThumbView: function() {
      return this.attributes.thumb['_view'];
    },
    
    setThumbView: function(thumbView) {
      this.attributes.thumb['_view'] = thumbView;
    },
    
    getLargeView: function() {
      return this.attributes.large['_view'];
    },
    
    setLargeView: function(thumbView) {
      this.attributes.large['_view'] = thumbView;
    },
        
    index: function() {
      return this.attributes.index;
    }
  });
  
  return ImageModel;
});