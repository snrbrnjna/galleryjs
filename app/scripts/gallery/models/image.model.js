/*
 * GalleryImage Model
 * ----------
 *
 * Our basic **ImageModel** has attributes for the 'thumb',
 * 'large' and metadata like 'orientation', 'ratio', 'exif'...
 *
 */
define([
  'underscore',
  'backbone',
  'gallery/utils/responsive.adapter'
], function(_, Backbone, ResponsiveAdapter) {
  var ImageModel = Backbone.Model.extend({

    idAttribute: 'digest',

    // Default attributes for the GalleryImage.
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
        exif: {},
        meta: {}
      };
    },
    
    // Constructor/Initializer has to be called with a options.presets hash with 
    // a baseurl for every preset (minimum: thumb & large).
    initialize: function(attrs, options) {
      // set the src attribute for every preset
      if (options !== undefined) {
        _.forEach(options.presets, _.bind(function(preset, presetKey) {
          this.attributes[presetKey]['src'] = preset['baseurl'] + '/' + attrs['filename'];
        }, this));
      }
    },

    // Returns the preset Hash for the Thumb on the current device
    getThumb: function() {
      return ResponsiveAdapter.presetMapperThumb(this);
    },

    // Returns the preset Hash for the Large on the current device
    getLarge: function() {
      return ResponsiveAdapter.presetMapperLarge(this);
    },
    
    getThumbView: function() {
      return this._thumbView;
    },
    
    setThumbView: function(thumbView) {
      this._thumbView = thumbView;
    },
    
    getLargeView: function() {
      return this._largeView;
    },
    
    setLargeView: function(largeView) {
      this._largeView = largeView;
    },
        
    index: function() {
      if (this.attributes.index === undefined) {
        return this.collection ? this.collection.indexOf(this) : undefined;
      }
      return this.attributes.index;
    }
  });
  
  return ImageModel;
});
