# gallery.js 

A [backbone](http://backbonejs.org/) app for a full width [masonry](http://masonry.desandro.com/) gallery. 

## Installation

- Clone Repo
- Install dependencies:
    - npm install
    - bower install
- For development: ``grunt serve`` 
- For building the example gallery into a ``dist`` folder: ``grunt build``

## Integrating gallery.js

{% highlight javascript %} 
var galleryEl = $('.gallery-app');
if (galleryEl.length) {
    new GalleryApp({el: galleryEl});
}
{% endhighlight %}

## Example Gallery

The [Images](https://snrbrnjna.github.io/galleryjs) are flyers for the [gutfeeling](http://gutfeeling.de) collective by the famous giftwrapping-doctor Sascha Schwegler.
