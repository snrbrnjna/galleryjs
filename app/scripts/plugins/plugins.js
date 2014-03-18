define([], function() {
  
  /*
   * polyfill for console
   * Avoid `console` errors in browsers that lack a console.
   */
  var method;
  var noop = function () {};
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
  
  /*
   * Utility for padding Numbers, like 1 => 01.
   * stolen from: http://stackoverflow.com/questions/10632346/how-to-format-a-date-in-mm-dd-yyyy-hhmmss-format-in-javascript 
   */
  Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
  };
   
  /*
  * parse Date String manually. Format: '2013-09-13 15:01:34 UTC' 
  * !! only UTC works as expected !!
  */
  Date.parseManually = function(ds) {
    ds = ds.split(' ');
    var date = ds[0].split('-');
    var time = ds[1].split(':');
    date = new Date(Date.UTC(
      parseInt(date[0],10), parseInt(date[1],10) - 1, parseInt(date[2],10),
      parseInt(time[0],10), parseInt(time[1],10), parseInt(time[2],10)
    ));
    return date;
  };
 
  // parseUri 1.2.2
  // (c) Steven Levithan <stevenlevithan.com>
  // MIT License
  window.parseUri = function(str) {
    var o   = window.parseUri.options,
      m   = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str),
      uri = {},
      i   = 14;

    while (i--) {uri[o.key[i]] = m[i] || '';}

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) {uri[o.q.name][$1] = $2;}
    });

    return uri;
  };

  window.parseUri.options = {
    strictMode: false,
    key: ['source','protocol','authority','userInfo','user','password','host','port','relative','path','directory','file','query','anchor'],
    q:   {
      name:   'queryKey',
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  };
   
});
