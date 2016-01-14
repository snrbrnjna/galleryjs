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
- For development: ``npm run dev`` 
- For building the example gallery into a ``dist`` folder: ``npm run build``

## Integrate

### HTML
Hava a look at [index.html](/app/templates/layouts/gallery.hbs) inside the ``Gallery-App`` comments for the HTML markup needed for gallery.js.

### JS
Inizialize the gallery in your main.js:

``` js
new GalleryApp({
    el: $('.gallery-app'),
    layout: 'masonry',
    galleryOpts: {},
    onInit: function(app, model) {}
});
```

``el``: DOM element with options for the gallery (see [index.html](/app/templates/layouts/gallery.hbs) for details).

``layout``: 'masonry' is the default layout. With 'none', the thumbs are rendered into the dom without any masonry frills. This option can also be specified via the ``data-gal-layout`` attribute.

``galleryOpts``: options for the gallery model (see [gallery.model.js](/app/scripts/gallery/models/gallery.model.js) for details).

``onInit`` is called, when the gallery data is fetched. It gets 2 params: 
- the GalleryApp object, a backbone view representing the whole application and
- the GalleryModel object, a backbone model representing the Gallery data including the ImageCollection.

## Example Gallery

The [Images](https://snrbrnjna.github.io/galleryjs) are flyers for the [gutfeeling](http://gutfeeling.de) crew by the famous giftwrapping-doctor Sascha Schwegeler.
