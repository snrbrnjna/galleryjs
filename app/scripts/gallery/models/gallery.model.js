/* global parseUri */
/*
 * GalleryModel
 * ----------
 */
define([
  'underscore',
  'backbone',
  'gallery/collections/image.collection',
  'plugins/plugins',
  'md5'
],
  function(_, Backbone, ImageCollection, nope, md5) {

  var GalleryModel = Backbone.Model.extend({

    // local or remote
    url: function() {
      return this.get('src');
    },

    // Default attributes for the gallery. they get automatically wired before 
    // initialize call.
    defaults: function() {
      return {
        src: '',
        title: '',
        image_pages: false,
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
      min_col_width: { // jshint ignore:line
        desktop: 320,
        pad: 320,
        phone: 300
      },
      gutter_width: 3, // jshint ignore:line
      chunk_size: 8, // jshint ignore:line
      first_chunk: 15, // jshint ignore:line
      double_tap_thumb: false // jshint ignore:line
    },
    
    initialize: function() {
      this.id = md5(this.get('src'));
      this.sliderState = 'closed';
      this._current = undefined;
    },
    
    parse: function(response) {
      var galleryHash = response.gallery;
      // Init Collection with response Hash
      galleryHash.images = new ImageCollection(galleryHash.images, {
        presets: this._parsePresets(galleryHash.presets),
        gallery: {
          basepath: galleryHash.postBasepath,
          baseurl: galleryHash.postBaseurl,
          path: galleryHash.postPath,
          imagePages: galleryHash.imagePages
        }
      });
      // Precedence in these options:
      // 1) options given as attributes into the constructor (the ones written in data-attributes)
      // 2) options coming with the fetched json data
      // 3) default options
      galleryHash.opts = _.extend({}, 
        this.defaultOpts, galleryHash.opts, this.attributes.opts);

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
        var currentIndex = this._current.index();
        if (currentIndex < images.length-1) {
          return images.at(currentIndex + 1);
        }
      }
    },
    
    // ImageModel instance
    getPrev: function() {
      if (this._current) {
        var currentIndex = this._current.index();
        if (currentIndex > 0) {
          return this.attributes.images.at(currentIndex - 1);
        }
      }
    }
  });
  
  return GalleryModel;
  
});
