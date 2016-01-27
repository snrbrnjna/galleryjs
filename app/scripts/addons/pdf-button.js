$(function () {

  /*
   * PdfButton is a addon to the gallery library.
   *
   * It sends the images of the given gallery selection to an api endpoint specified via
   * the data-url attribute, which generates a pdf with all the given images in it.
   *
   * The Button needs to specify data-key and data-title for the PDF service to
   * work. The markup for this component to get activated:
   *
   * ``<span class="pdf button" title="download selected photos as PDF document"
   *         data-url="https://pdf-gen-host.org/api"
   *         data-title="Title for Folio"
   *         data-key="site-key"></span>``
   */

  const PdfButton = function($el, selection) {
    this.$el = $el;
    this.parseOptions($el);

    this.selection = selection;
    if (selection) { // only initialize, when selection given.
      this.init();
    }
  };

  PdfButton.prototype.init = function() {
    this.renderActive(this.selection.length > 0);
    this.$el.addClass('initialized');
    this.$el.on('click', this.downloadClick.bind(this));
    this.selection.on('add', this.itemAdded.bind(this));
    this.selection.on('remove', this.itemRemoved.bind(this));
  };

  PdfButton.prototype.parseOptions = function($el) {
    this.opts = {
      url: $el.data('url'),
      title: $el.data('title'),
      key: $el.data('key'),
      template: $el.data('template')
    };
  };

  PdfButton.prototype.getData = function() {
    var data = {
      title: this.opts.title,
      key: this.opts.key,
      template: this.opts.template,
      images: []
    };
    this.selection.forEach(function(imageModel) {
      data.images.push(imageModel.attributes);
    });
    return {folio: data};
  }

  PdfButton.prototype.itemAdded = function(model, col, opts) {
    if (col.length === 1) {
      this.renderActive(true);
    }
    this.selectionChanged(opts);
  };

  PdfButton.prototype.itemRemoved = function(model, col, opts) {
    if (col.length === 0) {
      this.renderActive(false);
    }
    this.selectionChanged(opts);
  };

  // zero op here, override this in your Class
  PdfButton.prototype.selectionChanged = function(opts) {
    return;
  };

  PdfButton.prototype.renderActive = function(active) {
    this.$el.html('Download PDF');
    this.$el.removeClass('loading');
    if (active) {
      this.$el.addClass('active');
    } else {
      this.$el.removeClass('active');
    }
  };

  PdfButton.prototype.renderError = function() {
    this.$el.removeClass('loading active');
    this.$el.addClass('error');
    this.$el.html('Download PDF');
    this.$el.attr('title', 'Something went wrong: Server Error! Try again in a moment');
  };

  PdfButton.prototype.renderLoading = function() {
    this.$el.html('Loading PDF');
    this.$el.removeClass('active');
    this.$el.addClass('loading');
  };

  PdfButton.prototype.downloadClick = function() {
    if (this.$el.hasClass('active')) {
      this.renderLoading();
      var data = JSON.stringify(this.getData());
      $.ajax({
          type: 'POST',
          url: this.opts.url,
          data: data,
          success: function(data) {
            if (data.folio.url) {
              this.downloadPdf(data.folio.url);
              this.renderActive(this.selection.length > 0);
            } else {
              this.renderError();
            }
          }.bind(this),
          error: function(resp) {
            this.renderError();
            console.log('Something went wrong while generating the PDF!', resp.responseJSON);
          }.bind(this),
          contentType: 'application/json',
          dataType: 'json'
        });
    }
  },

  PdfButton.prototype.downloadPdf = function(url) {
    window.location.href = url;
  },


  window.PdfButton = PdfButton;

});
