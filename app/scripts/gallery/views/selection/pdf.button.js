/* SelectionPdfButton
 * -------------------
 *
 * A View Component. Sends the selected Images to a remote Service specified via
 * the data-url attribute, which generates a PDF Folio for the Selection.
 *
 * The Component needs to specify data-key and data-title for the PDF service to
 * work. The markup for this component to get activated:
 *
 * ``<span class="pdf button" title="download selected photos as PDF document" 
 *         data-url="http://pdf-gen-host.org/api" 
 *         data-title="Title for Folio" 
 *         data-key="site-key"></span>``
 *
 * Collection: SelectionCollection
 */
define([
  'backbone'
], function(Backbone) {

  var SelectionPdfButton = Backbone.View.extend({

    el: '.selection .button.pdf',

    events: {
      'click': 'downloadClick'
    },

    initialize: function() {
      if (this.$el.length && this.collection) {
        // Prepare Data for PDF Request
        this.folioData = {};
        this.folioData.url = this.$el.data('url');
        this.folioData.title = this.$el.data('title');
        this.folioData.key = this.$el.data('key');
        // listen for initial SelectionCollection sync
        this.listenToOnce(this.collection, 'sync', this.selectionSynced);
      }
    },

    selectionSynced: function(collection, resp, opts) {
      this.renderActive();
      this.$el.addClass('initialized');
      this.listenTo(this.collection, 'add', this.itemAdded);
      this.listenTo(this.collection, 'remove', this.itemRemoved);
    },

    itemAdded: function(model, col, opts) {
      if (col.length === 1) {
        this.renderActive();
      }
    },

    itemRemoved: function(model, col, opts) {
      if (col.length === 0) {
        this.renderActive();
      }
    },

    downloadClick: function() {
      if (this.$el.hasClass('active')) {
        this.renderLoading();
        $.ajax({
            type: 'POST',
            url: this.folioData.url,
            data: JSON.stringify(
              this.getPdfGenPayload()
            ),
            success: function(data) {
              if (data.folio.exists) {
                this.downloadPdf(data.folio.url);
                this.renderActive();
              } else {
                this.tryAgain(data.folio.url, 1500);
              }
            }.bind(this),
            error: function(resp) {
              this.renderError();
              console.log('Something went wrong while generating the PDF!', resp);
            }.bind(this),
            contentType: 'application/json',
            dataType: 'json'
          });
      }
    },

    tryAgain: function(url, delay) {
      $.ajax({
        type: 'HEAD',
        url: url,
        success: function(resp) {
          window.clearTimeout(this.timeoutId);
          this.downloadPdf(url);
          this.renderActive();
        }.bind(this),
        error: function(resp) {
          window.clearTimeout(this.timeoutId);
          this.timeoutId = setTimeout(function() {
            this.tryAgain(url, delay);
          }.bind(this), delay);
        }.bind(this)
      });
    },

    downloadPdf: function(url) {
      window.location.href = url;
    },

    // TODO: raus hier, entweder in die Selection oder in den Server, das ist 
    // Model business!
    getPdfGenPayload: function() {
      var folioPayload = {
        title: this.folioData.title,
        key: this.folioData.key,
        images: []
      };
      this.collection.each(function(imageModel) {
        folioPayload.images.push({
          'url': imageModel.get('large').src
        });
      });
      return {folio: folioPayload};
    },

    renderError: function() {
      this.$el.removeClass('loading active');
      this.$el.addClass('error');
      this.$el.html('Download PDF');
      this.$el.attr('title', 'Something went wrong: Server Error! Try again in a moment');
    },

    renderLoading: function() {
      this.$el.html('Loading PDF');
      this.$el.removeClass('active');
      this.$el.addClass('loading');
    },

    renderActive: function() {
      this.$el.html('Download PDF');
      this.$el.removeClass('loading');
      if (this.collection.length) {
        this.$el.addClass('active');
      } else {
        this.$el.removeClass('active');
      }
    }

  });

  return SelectionPdfButton;
});
