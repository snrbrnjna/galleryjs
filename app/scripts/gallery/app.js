/* jshint camelcase: false */
/*
 * Gallery App
 *
 * Options:
 * - el: Element to initialize the Gallery on.
 * - onInit: Callback for when the GalleryApp is initialized (the Images are
 *           loaded). The callback receives to args: GalleryApp and GalleryModel
 * - galleryOpts: opts for the gallery (override the ones in the gallery DOM
                  element (data-gal-opts) and the gallery json).
 */
define([
  'backbone',
  'underscore',
  'gallery/models/gallery.factory',
  'gallery/views/thumb.container.masonry',
  'gallery/views/thumb.container.dynamic',
  'gallery/views/thumb.container.dynamic.masonry',
  'gallery/views/slider.view',
  'gallery/utils/responsive.adapter',
  'gallery/collections/selection.collection',
  'gallery/views/selection/component',
  'gallery/views/selection/indicator',
  'gallery/views/selection/toggle.button'
],
function(
  Backbone, _, GalleryFactory,
  ThumbContainerMasonry, ThumbContainerDynamic, ThumbContainerDynamicMasonry,
  SliderView, ResponsiveAdapter,
  SelectionCollection, SelectionComponent, SelectionIndicator, SelectionToggleButton
) {

  var GalleryApp = Backbone.View.extend({

    el: 'article.gallery',

    // default options for gallery app
    defaultOpts: {
      layout: 'masonry'
    },

    initialize: function(opts) {

      // get options
      if (this.$el.data('gal-layout')) {
        this.defaultOpts.layout = this.$el.data('gal-layout');
      }
      this.options = _.extend({}, this.defaultOpts, this.options);

      // Init GalleryModel
      this.model = GalleryFactory.create(this.$el, opts['galleryOpts']);

      // Init Selection
      this.initSelection(opts['selectionOpts']);

      if (this.model) {
        // Init ThumbContainerView
        this.initThumbContainer();

        // Fetch Gallery Data from Server
        this.model.fetch({
          success: _.bind(function(model, resp, _opts) {
            var $el = this.$el;
            // mark DOM Element as initialized
            $el.addClass('initialized');
            // mark DOM Element as empty
            if (model.get('images').isEmpty()) {
              $el.addClass('empty');
            }
            // listenTo remove Events => mark empty
            this.listenTo(model.get('images'), 'remove', function(m,c,o) {
              if (c.isEmpty()) { $el.addClass('empty'); }
            });
            if (opts.onInit) { opts.onInit(this, this.model); }
          }, this)
        });

        // Instanciate the SliderView
        this.initSlider();

        // make gallery object available in DOM
        this.$el.data('gallery', this);
      }
    },

    // Init Selections
    initSelection: function(opts) {
      // Global SelectionCollection for gallery only when there is the
      // data attrib data-gal-selection
      var galSelectionAttrib = this.$el.data('gal-selection');
      if (!!galSelectionAttrib) {
        // merge element opts with app opts
        opts = _.extend({}, this.$el.data('gal-selection-opts'), opts);
        // init selection collection
        this.selection = SelectionCollection.get(this.$el.data('gal-selection'), this.model, opts);

        // init selection indicator
        this.selectionIndicator = new SelectionIndicator({
          collection: this.selection
        });

        // init toggle button
        this.selectionToggleButton = new SelectionToggleButton({
          collection: this.selection
        });

        // init selection components, which only need to be initialized and set active/inactive
        new SelectionComponent({
          el: $('.selection .component'),
          collection: this.selection
        });
      }

      // Explicitly addressed selection indicators
      // Group them by selection keys
      var mapping = {};
      $('[data-selection].indicator').each(function() {
        var $el = $(this);
        mapping[$el.data('selection')] =
          mapping[$el.data('selection')] === undefined ? $el : mapping[$el.data('selection')].add($el);
      });
      // initialize a indicator view for every selection key.
      _.each(mapping, function($elements, key) {
        var sel = SelectionCollection.get(key, this.model);
        new SelectionIndicator({ collection: sel, el: $elements });
        if (sel.gallery === undefined) {
          sel.fetch();
        }
      }, this);
    },

    // Instanciate the ThumbContainerView (dynamic or standard?)
    initThumbContainer: function() {
      var thumbContainerOptions = {
        model: this.model,
        itemSelector: '.photo'
      };

      // nothing dynamic, all photos are rendered at loading time
      if (this.$('.container.photos .photo').length) {
        this.containerView = new ThumbContainerMasonry(thumbContainerOptions);
      } else {
        if (this.options.layout === 'none') {
          this.containerView = new ThumbContainerDynamic(thumbContainerOptions);
        } else {
          this.containerView = new ThumbContainerDynamicMasonry(thumbContainerOptions);
        }
      }
    },

    // Instanciate the Slider view
    initSlider: function() {
      this.sliderView = new SliderView({
        el: this.$('.slider'),
        model: this.model
      });
    },

    // Give app user access to the ResponsiveAdapter
    getResponsiveAdapter: function() {
      if (this.responsiveAdapter === undefined) {
        this.responsiveAdapter = ResponsiveAdapter;
      }
      return this.responsiveAdapter;
    }

  });

  return GalleryApp;

});
