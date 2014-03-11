/**
 * author Christopher Blum
 *    - originally from https://github.com/protonet/jquery.inview
 *    - based on the idea of Remy Sharp, http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 *    - forked from http://github.com/zuk/jquery.inview/
 * 
 * modified by patchekohoss
 * - to trigger only on events (scroll & resize)
 * - to use requirejs and throttle-debounce
 */
define([
  'jquery',
  'vendor/jquery.throttle-debounce'
], function($, nope) {
  
  var debug = false;
  
  var inviewObjects = {}, viewportSize, viewportOffset,
      d = document, w = window, documentElement = d.documentElement, expando = $.expando;

  $.event.special.inview = {
    add: function(data) {
      inviewObjects[data.guid + "-" + this[expando]] = { data: data, $element: $(this) };
      bindToViewPortChangeEvents();
    },

    remove: function(data) {
      unbindToViewPortChangeEvents();
      try { delete inviewObjects[data.guid + "-" + this[expando]]; } catch(e) {}
    }
  };

  function getViewportSize() {
    var mode, domObject, size = { height: w.innerHeight, width: w.innerWidth };

    // if this is correct then return it. iPad has compat Mode, so will
    // go into check clientHeight/clientWidth (which has the wrong value).
    if (!size.height) {
      mode = d.compatMode;
      if (mode || !$.support.boxModel) { // IE, Gecko
        domObject = mode === 'CSS1Compat' ?
          documentElement : // Standards
          d.body; // Quirks
        size = {
          height: domObject.clientHeight,
          width:  domObject.clientWidth
        };
      }
    }
    return size;
  }

  function getViewportOffset() {
    return {
      top:  w.pageYOffset || documentElement.scrollTop   || d.body.scrollTop,
      left: w.pageXOffset || documentElement.scrollLeft  || d.body.scrollLeft
    };
  }

  function checkInView() {
    var $elements = $(), elementsLength, i = 0;

    $.each(inviewObjects, function(i, inviewObject) {
      var selector  = inviewObject.data.selector,
          $element  = inviewObject.$element;
      $element = selector ? $element.find(selector) : $element;
      $element.data('inview_opts', inviewObject.data.data);
      $elements = $elements.add($element);
    });

    elementsLength = $elements.length;
    
    if (debug) {
      console.log('inviewObjects: ');
      console.log(inviewObjects);
      console.log('elementsLength: ' + elementsLength);
    }
    
    if (elementsLength) {
      viewportSize   = viewportSize   || getViewportSize();
      viewportOffset = viewportOffset || getViewportOffset();
      
      if (debug) {
        console.log('viewportSize: ');
        console.log(viewportSize);
        console.log('viewportOffset: ');
        console.log(viewportOffset);
      }

      for (; i<elementsLength; i++) {
        // Ignore elements that are not in the DOM tree
        if (!$.contains(documentElement, $elements[i])) {
          continue;
        }

        var $element      = $($elements[i]),
            elementSize   = { height: $element.height(), width: $element.width() },
            elementOffset = $element.offset(),
            inView        = $element.data('inview'),
            threshold     = $element.data('inview_opts').threshold, 
            visiblePartX,
            visiblePartY,
            visiblePartsMerged;

        if (threshold) {
          if (this.debug) {console.log('Threshold: ' + threshold);}
          var orig_top = elementOffset.top,
              orig_left = elementOffset.left;
          elementOffset = {
            top: orig_top - threshold,
            left: orig_left - threshold
          };
        }

        if (debug) {
          console.log('elementSize: ');
          console.log(elementSize);
          console.log('elementOffset: ');
          console.log(elementOffset);
        }

        // Don't ask me why because I haven't figured out yet:
        // viewportOffset and viewportSize are sometimes suddenly null in Firefox 5.
        // Even though it sounds weird:
        // It seems that the execution of this function is interferred by the onresize/onscroll event
        // where viewportOffset and viewportSize are unset
        if (!viewportOffset || !viewportSize) {
          return;
        }

        // Hmmm, that works better, Element doesn't have to be completely in viewport.
        // if (elementOffset.top + elementSize.height > viewportOffset.top &&
        //     elementOffset.top < viewportOffset.top + viewportSize.height &&
        //     elementOffset.left + elementSize.width > viewportOffset.left &&
        //     elementOffset.left < viewportOffset.left + viewportSize.width) {
        if (elementOffset.top < viewportOffset.top + viewportSize.height &&
            elementOffset.left < viewportOffset.left + viewportSize.width) {
          visiblePartX = (viewportOffset.left > elementOffset.left ?
            'right' : (viewportOffset.left + viewportSize.width) < (elementOffset.left + elementSize.width) ?
            'left' : 'both');
          visiblePartY = (viewportOffset.top > elementOffset.top ?
            'bottom' : (viewportOffset.top + viewportSize.height) < (elementOffset.top + elementSize.height) ?
            'top' : 'both');
          visiblePartsMerged = visiblePartX + "-" + visiblePartY;
          // uncomment if you want to trigger only if the current check result differs from teh last one
          // if (!inView || inView !== visiblePartsMerged) {
            $element.data('inview', visiblePartsMerged).trigger('inview', [true, visiblePartX, visiblePartY]);
          // }
        } else if (inView) {
          $element.data('inview', false).trigger('inview', [false]);
        }
      }
    }
  }

  function bindToViewPortChangeEvents() {
    $(w).bind("scroll.inview resize.inview", $.throttle(250, function() {
      if (debug) {
        console.log('Hello inview.js checks it out!');
      }
      viewportSize = viewportOffset = null;
      checkInView();
    }));

    // IE < 9 scrolls to focused elements without firing the "scroll" event
    // uncomment, if you want special treatment of IE < 9
    // if (!documentElement.addEventListener && documentElement.attachEvent) {
    //   documentElement.attachEvent("onfocusin", function() {
    //     viewportOffset = null;
    //   });
    // }
  }
  
  function unbindToViewPortChangeEvents() {
    $(w).unbind("scroll.inview resize.inview");
  }

  // Use setInterval in order to also make sure this captures elements within
  // "overflow:scroll" elements or elements that appeared in the dom tree due to
  // dom manipulation and reflow
  // old: $(window).scroll(checkInView);
  //
  // By the way, iOS (iPad, iPhone, ...) seems to not execute, or at least delays
  // intervals while the user scrolls. Therefore the inview event might fire a bit late there
  // setInterval(checkInView, 250);
  
});