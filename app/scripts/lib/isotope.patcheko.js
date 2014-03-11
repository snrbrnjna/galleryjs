define(['jquery', 'isotope'], function($, nope1) {
  /*
   * TODO:
   * - DONE! Bilder innerhalb von Layout schon resizen!
   * - Gutter:
   *   DONE! beim initialen Laden rechts kein Rand, danach schon.
   * - TODO noch Testen auf iPad! --(Langsam die Scheisse!)--
   * - TODO loading indicatoren auschecken! langsames Laden simulieren!
   * - TODO eigener Layout-Typ!
   * - TODO params: 
   *   > mit Faktoren arbeiten anstatt mit diff. => Bilder werden verkleinert...
   *     TODO: oder in Anleitung die Info, dass die zu ladenden Bilder immer 
   *     doppelt so groß sein müssen, wie die minColWidth.
   *
   *
   * Pimps the masonry layout mode of isotope.
   *
   * The given minColWidth is the minimum width of the masonry cells. The Layout
   * checks how many cells suit the container for the given minimum width. Then
   * the cells get blowed up so that they fill the container. 
   * This means, the Thumbs can get a maximum width of 2 times minColWidth.
   *
   * masonry params:
   * - minColWidth: 220,
   * - gutterWidth: 5
   */
  $.extend( $.Isotope.prototype, {
    
    debug: false,
      
    _getFluidMasonryColumns: function() {
      if ( this.options.masonry && this.options.masonry.minColWidth ) {
        this.masonry.gutterWidth = this.options.masonry.gutterWidth*2 || 0;
        this.containerWidth = this.element.width();
        this._calculateCols(this.options.masonry.minColWidth, this.masonry.gutterWidth);
      } else {
        throw 'TODO: Exception, falsche Konfiguration!';
      }
    },
    
    _calculateCols: function(minColWidth, gutterWidth) {
      if (this.debug) {console.log('Calculate the Params for the fluid masonry columns...')};
      minColWidth += gutterWidth;
      var cols = Math.floor( (this.containerWidth - gutterWidth) / minColWidth );
      cols = Math.max( cols, 1 );
      var restWidth = this.containerWidth - cols*minColWidth;
      var colWidth;
      if (restWidth >= 0) {
        colWidth = minColWidth + Math.floor(restWidth/cols); 
      } else if (restWidth < 0) {
        console.error(this);
        throw 'Margin to big for ' + cols + ' Columns';
      }
      if (this.debug) {
        console.log('Adding a restWidth of '+ restWidth +'px to the Columns');
        console.log('Setting column configuration to '+ cols +' columns with a width of '+ colWidth +' px (minColWidth was '+ this.options.masonry.minColWidth +'px).');
      }
      this.masonry.cols = cols;
      this.masonry.columnWidth = colWidth;
    },
    
    // sets the width for every item, respects the for the gutterWidth
    _masonryLayout : function( $elems ) {
      var instance = this,
        props = instance.masonry,
        colWidth = props.columnWidth - props.gutterWidth;
      $elems.each(function() {
        var $this = $(this);
        // Resize Image-Container
        $this.width( colWidth );
        instance._masonryPlaceBrick( $this, props.colYs );
      });
    },
    
    _masonryReset: function() {      
      // Only reset, when not initialized yet, or when the size of the container 
      // has changed
      if (this.masonry === undefined || 
        !(this.containerWidth && this.containerWidth == this.element.width())) {      
        // layout-specific props
        this.masonry = {};
        this._getFluidMasonryColumns();
      }
      var i = this.masonry.cols;
      this.masonry.colYs = [];
      while (i--) {
        this.masonry.colYs.push( 0 );
      }
    },
    
    _masonryResizeChanged: function() {
      var prevColWidth = this.masonry.columnWidth;
      // get updated cols
      this._getFluidMasonryColumns();
      return ( this.masonry.columnWidth !== prevColWidth );
    }
  });
});