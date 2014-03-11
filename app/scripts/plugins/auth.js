/*
 * Auth interface for Tracker
 *
 * #login, #logout, #isAdmin
 */
define([
  'underscore',
  'backbone',
  'jquery',
  'require'
], function(_, Backbone, $, require) {
  
  var Auth = function(tracker, opts) {
    this.tracker = tracker;
    this.currentUser;
    this.opts = _.extend({admin: 'snr@brnjna.net'}, opts);
    
    // load browserId polyfill
    require(['browserid'], _.bind(this._ready, this));
  };
  
  _.extend(Auth.prototype, Backbone.Events);
  
  _.extend(Auth.prototype, {
    
    /*
     * Callback for when browserid AMD module is loaded.
     */
    _ready: function() {
      this._id = navigator.id;
      
      navigator.id.watch({
        loggedInUser: this.currentUser,
        onlogin: _.bind(function(assertion) {
          // DEBUG
          // console.log('onlogin');
          // A user has logged in! Here you need to:
          // 1. Send the assertion to your backend for verification and to create a session.
          // 2. Update your UI.
          $.ajax({
            type: 'POST',
            crossDomain: true,
            xhrFields: {
              withCredentials: true
            },
            url: this.tracker.getServiceBaseUrl() + '/auth/login',
            data: {assertion: assertion},
            success: _.bind(function(res, status, xhr) { 
              this.setUser(res.email);
            }, this),
            error: _.bind(function(xhr, status, err) {
              navigator.id.logout();
              console.log("Login failure: " + err);
              console.log(xhr.responseJSON);
            }, this)
          });
        }, this),
        onlogout: _.bind(function() {
          // A user has logged out! Here you need to:
          // Tear down the user's session by redirecting the user or making a call to your backend.
          // Also, make sure loggedInUser will get set to null on the next page load.
          // (That's a literal JavaScript null. Not false, 0, or undefined. null.)
          $.ajax({
            type: 'POST',
            crossDomain: true,
            xhrFields: {
              withCredentials: true
            },
            url: this.tracker.getServiceBaseUrl() + '/auth/logout',
            success: _.bind(function(res, status, xhr) { 
              this.setUser(null);
            }, this),
            error: _.bind(function(xhr, status, err) { 
              console.log("Logout failure: " + err); 
            }, this)
          });
        }, this)
      });
      
    },
    
    setUser: function(email) {
      if (this.currentUser != email) {
        this.currentUser = email;
        if (email != null) {
          this.trigger('auth:login');
        } else {
          this.trigger('auth:logout');
        }
      }
    },
    
    login: function() {
      if (this._id) {
        this._id.request();
      } else {
        console.error('seems the browserid script could not be loaded!');
      }
    },
    
    logout: function() {
      if (this._id) {
        this._id.logout();
      } else {
        console.error('seems the browserid script could not be loaded!');
      }
    },
    
    isAdmin: function() {
      return this.currentUser == this.opts['admin'];
    }
    
  });
  
  return Auth;
  
});