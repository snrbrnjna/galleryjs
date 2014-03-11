define([
  'jquery',
  'jqueryui',
  'vendor/jquery.touchSwipe',
  'vendor/jquery.throttle-debounce',
  'underscore', 
  'backbone',
  'gallery/views/large.view',
  'gallery/views/cockpit.view'
], function($, nope, nope2, nope3, _, Backbone, LargeView, CockpitView) {
  
  /*
   * Model: GalleryModel
   *
   * listens to 'thumb:clicked' on GalleryModel
   * listens to 'resize.slider' on window
   * listens to 'click.slider' on this.$el
   * listens to 'mousemove.slider' on this.$el
   * listens to 'keyup.slider' (ESC[27], cursor-left[37], cursor-right[39])
   * listens once to 'sync' on GalleryModel
   * triggers 'slider:newImage' with current LargeView object on GalleryModel
   */
  var SliderView = Backbone.View.extend({
    
    defaults: {
      cockpit: true
    },
    
    el: '.gallery .slider',
    
    events: {
      'click .nav.prev': 'showPrev',
      'click .nav.next': 'showNext'
    },
    
    initialize: function() {
      // Merge defaults and options
      this.options = _.extend({}, this.defaults, this.options);
      
      // Mark with slider_closed class
      $('body').addClass('slider_closed');
      
      // Init Elements
      this.tray = this.$('.tray');
      this.current_box = this.$('.photo.current'); //TODO: Options
      this.prev_box = this.$('.photo.prev');
      this.next_box = this.$('.photo.next');
      this.nav_prev = this.$('.nav.prev'); // TODO: Options
      this.nav_next = this.$('.nav.next'); // TODO: Options
      this.current = undefined;
      
      this.responsiveAdapter = this.options.responsiveAdapter;
      
      // Register Handlers
      // Check, when Thumb was clicked
      this.listenTo(this.model, 'thumb:clicked', this.openSlider);
      // Listen on window resize to resize the current, the prev and the next large
      $(window).on("resize.slider", _.bind($.debounce(200, this.resize), this));
      // Listen to keyboard
      $(window).on('keyup.slider', _.bind(this.keys, this));
      // Listen to mousemove for hovering the prev/next buttons - only on 
      // non-touch devices (mixed devices (surface et al) don't get hover help)
      this.touchable = ('ontouchstart' in window);
      if (!this.touchable) { 
        this.tray.on('mousemove.slider', _.bind($.throttle(150, this.mousemove), this));
      }
            
      // Init Cockpit
      this.cockpit = new CockpitView({
        model: this.model, 
        cockpit: this.options.cockpit,
        slider: this
      });
      
      // Init Swipe-Handler and deactivate it 
      // => openSlider/closeSlider enables/disables it again
      this.initSwipeHandler();
      this.$el.swipe('disable');
      
      // Check if a ImageModel id is in the window.location.hash 
      // => open slider with this image
      this.listenToOnce(this.model, 'sync', function() {
        if (window.location.hash.length > 2) {
          var imageModel = this.model.get('images').get(window.location.hash.substr(2));
          if (imageModel) {
            this.openSlider(imageModel);
            // wait a millisecond till the thumbs are loaded and perhaps a scrollbar is
            // rendered => changes the dimensions of the slider
            window.setTimeout(_.bind(this.resize, this), 250);
          }
        }
      });
    },
    
    initSwipeHandler: function() {
      var instance = this;
      this.$el.swipe({
        swipeLeft: function(evt, direction, distance, duration, fingerCount) {
          instance.showNext();
          evt.preventDefault();
        },
        swipeRight: function(evt, direction, distance, duration, fingerCount) {
          instance.showPrev();
          evt.preventDefault();
        },
        tap: function(evt, target) {
          evt.preventDefault();
          instance.click(evt);
        },
        allowPageScroll: 'none'
      });
    },
        
    // override Backbone.View#remove to remove the event listener for 'resize.slider'
    remove: function() {
      $(window).off('resize.slider');
      $(window).off('keyup.slider');
      if (this.touchable) { this.tray.off('mousemove.slider'); }
      this.$el.swipe('destroy');
      Backbone.View.prototype.remove.call(this); // call super()
      // could also be written as:
      // this.constructor.__super__.remove.call(this);
    },
    
    keys: function(evt) {
      if (this.isOpen()) {
        switch(evt.keyCode) {
          case 27: // ESC
            this.closeSlider();
            break;
          case 39: // Right Cursor
            this.showNext();
            break;
          case 37: // Left Cursor
            this.showPrev();
            break;
        }
      }
    },
    
    // execute prev/next or close, depending on the area clicked.
    click: function(evt) {
      var mouseCmd = this._mapMouseEvent(evt);
      switch(mouseCmd) {
        case 'nav.prev':
          this.showPrev();
          break;
        case 'nav.next':
          this.showNext();
          break;
        case 'ESC':
          this.closeSlider();
          break;
      }
    },
    
    // "hover" effect for prev/next buttons while mouse is over image
    mousemove: function(evt) {
      var mouseCmd = this._mapMouseEvent(evt);
      if (mouseCmd == 'nav.prev') {
        this.nav_next.removeClass('active');
        this.nav_prev.addClass('active');
      } else if (mouseCmd == 'nav.next') {
        this.nav_prev.removeClass('active');
        this.nav_next.addClass('active');
      } else {
        this.nav_prev.removeClass('active');
        this.nav_next.removeClass('active');
      }
    },
    
    // Check which comand would be executed from the current mouse position
    _mapMouseEvent: function(evt) {
      var $target = $(evt.target);
      if ($target.is('.photo img')) {
        // touch events get the current page coordinates in another fashion than
        // pure old click events
        var pageX = (
          evt.changedTouches && evt.changedTouches.length ? 
            evt.changedTouches[0].pageX :
            evt.pageX
        );
        var offsetX = pageX - $(evt.target).offset().left;
        var offsetRelX = offsetX / this.current.getWidth();
        return (offsetRelX < 0.45 ? 'nav.prev' : 'nav.next');
      } else if ($target.closest('.cockpit').length == 0) { 
        // $.closest => all targets within the specified .cockpit container
        return 'ESC';
      }
    },
    
    isOpen: function() {
      return this.$el.hasClass('open');
    },
    
    openSlider: function(imageModel) {
      this._setDimensions();
      this._setCurrent(imageModel);
      this.$el.addClass('open');$('body').removeClass('slider_closed');
      this.$el.addClass('visible', 800);
      this.$el.swipe('enable');
      this.model.toggleSliderState();
    },
    
    showNext: function() {
      if (this.next) {
        var new_next_box = this.$el.find('#prev');
        
        this.prev = this.current;
        this.prev_box = this.current_box.attr('id','prev');        
        this.current = this.next;
        this.model.setCurrent(this.next.model);
        this.current_box = this.next_box.attr('id','current');
        this.next_box = new_next_box.attr('id','next');
        
        this.prev_box.switchClass('current','prev', {duration:300,queue:true,easing:'linear'});
        this.current_box.switchClass('next', 'current', {duration:300,queue:true,easing:'linear'});
        this.next_box.switchClass('prev', 'next', {duration:0,queue:true});
        
        this._setNext();
        this._currentChanged();
      }
    },
    
    showPrev: function() {
      if (this.prev) { 
        var new_prev_box = this.$el.find('#next');
        
        this.next = this.current;
        this.next_box = this.current_box.attr('id','next');
        this.current = this.prev;
        this.model.setCurrent(this.prev.model);
        this.current_box = this.prev_box.attr('id','current');
        this.prev_box = new_prev_box.attr('id', 'prev');
        
        this.next_box.switchClass('current', 'next', {duration:300,queue:true,easing:'linear'});
        this.current_box.switchClass('prev', 'current', {duration:300,queue:true,easing:'linear'});
        this.prev_box.switchClass('next', 'prev');
        
        this._setPrev();
        this._currentChanged();
      }
    },
    
    closeSlider: function() {
      this.model.trigger('slider:closing', this.current);
    
      this.$el.removeClass('open visible', 800);$('body').addClass('slider_closed');
      this._setCurrent(undefined);
      this.current = this.next = this.perv = undefined;
      this.$('.photo').empty();
    
      this._setHashbang('', 'ÄMPTI');
      // window.location.hash = '!';
    
      this.$el.swipe("disable");
      this.model.toggleSliderState();
    },
    
    _setHashbang: function(bangboombang, title) {
      if (Modernizr.history) {
        var newLoc = document.location.href;
        newLoc = newLoc.replace(/\#.*/, '') + '#!' + bangboombang;
        history.replaceState(null, title, newLoc);
      }
    },
    
    _currentChanged: function() {      
      this._setHashbang(this.current.model.id, 'Image ' + this.current.model.id);
      
      this.model.trigger('slider:newImage', this.current);
      
      if (this.next) { this.nav_next.removeClass('visuallyhidden'); } 
      else { this.nav_next.addClass('visuallyhidden'); }
      if (this.prev) { this.nav_prev.removeClass('visuallyhidden'); } 
      else { this.nav_prev.addClass('visuallyhidden'); }
      
    },
    
    _setCurrent: function(imageModel) {
      this.model.setCurrent(imageModel);
      var largeView = this._loadOrGetLarge(imageModel);
      if (largeView) {
        this.current = largeView;
        this.current_box.html(this.current.$el);
        this._currentChanged();
        this._setNext();
        this._setPrev();
      }
    } ,
    
    _setNext: function() {
      var imageCollection = this.model.get('images');
      this.next = this._loadOrGetLarge(this.model.getNext());
      if (this.next) {
        this.next_box.html(this.next.$el);
        this.nav_next.removeClass('visuallyhidden');
      } else {
        this.nav_next.addClass('visuallyhidden');
      }
      return this.next;
    },
    
    _setPrev: function() {
      var imageCollection = this.model.get('images');
      this.prev = this._loadOrGetLarge(this.model.getPrev());
      if (this.prev) {
        this.prev_box.html(this.prev.$el);
        this.nav_prev.removeClass('visuallyhidden');
      } else {
        this.nav_prev.addClass('visuallyhidden');
      }
      return this.prev;
    },
    
    // save current tray resolution on the ImageModel or LargeView
    _loadOrGetLarge: function(imageModel) {
      if (imageModel) {
        var largeView = (
          imageModel.getLargeView() || 
          new LargeView({
            model: imageModel, 
            slider: this
          })
        );
        largeView.resize();
        return largeView;
      } else {
        return undefined;
      }
    },

    resize: function() {
      this._setDimensions();
      
      if (this.current) { this.current.resize(); }
      if (this.next) { this.next.resize(); }
      if (this.prev) { this.prev.resize(); }
    },
    
    _setDimensions: function() {
      this.width = this.tray.width();
      this.height = this.tray.height();
      this.ratio = this.width / this.height;
      this.orientation = this.ratio > 1 ? 'landscape' : 'portrait';
    }
    
  });
  
  return SliderView;
});