# gallery.js 

A [backbone](http://backbonejs.org/) app for a full width [masonry](http://masonry.desandro.com/) gallery. 

## Install

Install via [bower](http://bower.io/):

``` bash 
bower install gallery.js
```

Or get the latest script and stylesheet files from the [repo](/lib).

### Development
- Clone Repo
- Install dependencies:
    - npm install
    - bower install
- For development: ``grunt serve`` 
- For building the example gallery into a ``dist`` folder: ``grunt build``

## Integrate

### HTML
Hava a look at [index-dev.html](/app/index-dev.html) inside the ``Gallery-App`` comments for the HTML markup needed for gallery.js.

### JS
Inizialize the gallery in your main.js:

``` js
var galleryEl = $('.gallery-app');
if (galleryEl.length) {
    new GalleryApp({el: galleryEl});
}
```

## Example Gallery

The [Images](https://snrbrnjna.github.io/galleryjs) are flyers for the [gutfeeling](http://gutfeeling.de) collective by the famous giftwrapping-doctor Sascha Schwegler.
