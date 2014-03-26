/* global parseUri */
/*
 * GalleryModel
 * ----------
 */
define([
  'underscore',
  'backbone',
  'gallery/collections/image.collection',
  'plugins/plugins'
],
  function(_, Backbone, ImageCollection, nope) {

  var GalleryModel = Backbone.Model.extend({

    idAttribute: 'project',

    url: function() {
      return this.get('project') + '.json';
    },

    // Default attributes for the gallery. they get automatically wired before 
    // initialize call.
    defaults: function() {
      return {
        project: '',
        title: '',
        presets: {
          thumb: {
            width: 300
          },
          large: {
            width: 800
          }
        },
        images: undefined
      };
    },

    // These are the fallback Options, if neither the json, nor the markup gives 
    // us any.
    defaultOpts: {
      min_col_width: {
        desktop: 320,
        pad: 320,
        phone: 300
      },
      gutter_width: 3,
      chunk_size: 8,
      first_chunk: 15
    },
    
    initialize: function() {
      this.sliderState = 'closed';
      this._current = undefined;
    },
    
    parse: function(response) {
      var galleryHash = response.gallery;
      // Prepare and parse data
      var imageOptions = {presets: this._parsePresets(galleryHash.presets)};
      // Precedence in these options:
      // 1) options given as attributes into the constructor (the ones written in data-attributes)
      // 2) options coming with the fetched json data
      // 3) default options
      var galleryOpts = _.extend({}, this.defaultOpts, galleryHash.opts, this.attributes.opts);
      if (this.attributes && this.attributes.images) {
        this.attributes.images.reset(galleryHash.images, imageOptions); // Reset Collection
        this.attributes.opts = galleryOpts;
      } else {
        // Init Collection on response Hash
        galleryHash.images = new ImageCollection(galleryHash.images, imageOptions);
        galleryHash.opts = galleryOpts;
      }

      return galleryHash;
    },

    _parsePresets: function(presetHash) {
      _.forEach(presetHash, function(preset, presetKey) {
        // normalize baseUrl (can also be a path in the parsed json)
        var baseUrl = preset['baseurl'];
        if (!baseUrl.match(/http:\/\/|https:\/\//)) {
          var uri = parseUri(window.location.href);
          var root = uri.protocol+ '://' + uri.host + (uri.port ? ':' + uri.port : '');
          if (baseUrl.indexOf('/') === 0) { // absolute path
            preset['baseurl'] = root + baseUrl;
          } else { // relative path
            preset['baseurl'] = root + uri.directory + baseUrl;
          }
        }
      });
      return presetHash;
    },
    
    toggleSliderState: function() {
      this.sliderState = (this.sliderState === 'closed' ? 'opened' : 'closed');
    },

    setCurrent: function(imageModel) {
      this._current = imageModel;
    },
    
    // ImageModel instance
    getCurrent: function() {
      return this._current;
    },
    
    // ImageModel instance
    getNext: function() {
      if (this._current) {
        var images = this.attributes.images;
        if (this._current.index() < images.length-1) {
          return images.at(this._current.index() + 1);
        }
      }
    },
    
    // ImageModel instance
    getPrev: function() {
      if (this._current && this._current.index() > 0) {
        return this.attributes.images.at(this._current.index() - 1);
      }
    }
  });
  
  return GalleryModel;
  
});
