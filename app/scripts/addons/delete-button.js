$(function () {

  /**
   * DeleteButton is a addon to the gallery library.
   *
   * It sends the images of the given gallery selection to an api endpoint specified via
   * the data-url attribute, which generates a pdf with all the given images in it.
   *
   * The Button needs to specify data-key and data-title for the PDF service to
   * work. The markup for this component to get activated:
   *
   * ``<span class="delete button" title="Remove all items from the selection" />``
  **/
  const DeleteButton = function($el, selection) {
    this.$el = $el;
    this.parseOptions($el);

    this.selection = selection;
    if (selection) { // only initialize, when selection given.
      this.init();
    }
  };

  DeleteButton.prototype.init = function() {
    this.renderActive(this.selection.length > 0);
    this.$el.addClass('initialized');
    this.$el.on('click', this.click.bind(this));
    this.selection.on('add', this.itemAdded.bind(this));
    this.selection.on('remove', this.itemRemoved.bind(this));
  };

  DeleteButton.prototype.parseOptions = function($el) {
    this.opts = {
      title: $el.data('title'),
    };
  };

  DeleteButton.prototype.itemAdded = function(model, col, opts) {
    if (col.length === 1) {
      this.renderActive(true);
    }
    this.selectionChanged(opts);
  };

  DeleteButton.prototype.itemRemoved = function(model, col, opts) {
    if (col.length === 0) {
      this.renderActive(false);
    }
    this.selectionChanged(opts);
  };

  // zero op here, override this in your Class
  DeleteButton.prototype.selectionChanged = function(opts) {
    return;
  };

  DeleteButton.prototype.renderActive = function(active) {
    this.$el.html('Wipe Selection');
    if (active) {
      this.$el.addClass('active');
    } else {
      this.$el.removeClass('active');
    }
  };

  DeleteButton.prototype.click = function() {
    if (this.$el.hasClass('active')) {
      // we have to set selected false on the gallery images => selection images get destroyed
      this.selection.gallery.get('images').forEach(function(imgModel) {
        if (imgModel.get('selected')) {
          imgModel.set('selected', false);
        }
      });
    }
  };

  window.DeleteButton = DeleteButton;

});
