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

The gallery can be configured in the markup via data attributes of the gallery element `el`. Additionally you can _override_ these settings with the options given to the GalleryApp constructor:
`el`: DOM element with the following options for the gallery:
- `data-gal-src`: Defines where to take the images from. 2 possibilities:
    + a url (relative or absolute) to a gallery-json ([example](/app/flyer-doc-remote.json))
    + `selection:<selection-key>` for a SelectionGalleryModel, which takes its images from a selection specified by the given `<selection-key>`.
- `data-gal-selection`: key for the Selection to use by the Gallery, or empty string for no selection.
- `data-gal-opts`: Stringified JSON options for the gallery model. These can be overridden by `galleryOpts`.
- `data-gal-layout`: layout to use in the ThumbContainer. Can be overriden by `layout`.

`layout`: 'masonry' is the default layout. With 'none', the thumbs are rendered into the dom without any masonry frills.

``galleryOpts``: options for the gallery model (see [gallery.model.js](/app/scripts/gallery/models/gallery.model.js) for details).

``onInit`` is called, when the gallery data is fetched. It gets 2 params: 
- the GalleryApp object, a backbone view representing the whole application and
- the GalleryModel object, a backbone model representing the Gallery data.

#### Addons
In the ``onInit`` callback you can hook your own _addons_ - components, that interact with the gallery, via the `GalleryApp` object. In the [addons](/app/scripts/addons) directory you can find examples for that.

## Example Gallery

The [Images](https://snrbrnjna.github.io/galleryjs) are flyers for the [gutfeeling](http://gutfeeling.de) crew by the famous giftwrapping-doctor Sascha Schwegeler.
