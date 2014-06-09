/*!
 * gallery.js v0.6.0, (c) 2014 Snr Brnjna <snr@brnjna.net>, licenced under modified MIT
 * see https://github.com/snrbrnjna/galleryjs.git
 */
!function(){function a(a){$(function(){var b=$(".gallery-app");b.length&&new a({el:b,onInit:function(a,b){console.log("Gallery initialized!",a,b)}})})}"function"==typeof define&&define.amd?require(["rconfig","gallery/app"],function(b,c){a(c)}):a(GalleryApp)}();