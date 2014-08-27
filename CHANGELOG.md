<a name="0.9.2"></a>
### 0.9.2 (2014-08-27)


### 0.9.1 (2014-08-26)


#### Bug Fixes

* **chore:** fix link in readme ([d833f88b](https://github.com/snrbrnjna/galleryjs.git/commit/d833f88bba207e1a3049a8467ff70dcc1aa77263))


#### Features

* **selection:** now also on phones. ([060e5e89](https://github.com/snrbrnjna/galleryjs.git/commit/060e5e89d4806e2f8eb5f8194bd80242583ed815))


## 0.9.0 (2014-08-26)


#### Bug Fixes

* **selection:**
  * tap on select button opens slider ([e1185be2](https://github.com/snrbrnjna/galleryjs.git/commit/e1185be286734ee2b463f0db516eab5b36ebd4ac))
  * select buttons didn't work on touch devices ([dbfc605d](https://github.com/snrbrnjna/galleryjs.git/commit/dbfc605d48ac419f2a29a77a467869143ed4dc1d))


#### Features

* **responsive design:** double tap thumbs feature for a "touch friendly" hover effect on thumbs ([67e39533](https://github.com/snrbrnjna/galleryjs.git/commit/67e3953361642fa9fa2fe2bc2638e7548d36db37))


### 0.8.1 (2014-08-11)


#### Features

* **responsiveAdapter:** give galleryjs app user access to
 ResponsiveAdapter ([0cbad942](https://github.com/snrbrnjna/galleryjs.git/commit/0cbad942cda040ea4e403628ccc2c424dbb4db60))


## 0.8.0 (2014-07-11)


#### Bug Fixes

* **assemble pages:** fixed processing of usemin for dist pages ([270a6848](https://github.com/snrbrnjna/galleryjs.git/commit/270a68484c7b2ce4b0a2158a675ee4024056a44a))
* **grunt:** fix in watch/reload task for dev serve ([19ca74e7](https://github.com/snrbrnjna/galleryjs.git/commit/19ca74e7440804f14eeb9cbf707ddfdc9d646477))
* **package.json:** keywords have to be an array ([f15dabf9](https://github.com/snrbrnjna/galleryjs.git/commit/f15dabf9c2703967d0003d8fcdd91fef2cb209b4))


#### Features

* **assemble pages:** integrated readme.md and a index page ([fb0f1ba4](https://github.com/snrbrnjna/galleryjs.git/commit/fb0f1ba457622391acac7901b6f321799a681a9c))
* **selection:**
  * selection indicators also work without a gallery initialized ([c7deee31](https://github.com/snrbrnjna/galleryjs.git/commit/c7deee31962a6e66f353c73baa418aa7612b2c6e))
  * selection indicators also work without a gallery initialized ([d849fcba](https://github.com/snrbrnjna/galleryjs.git/commit/d849fcba6d3f7e8c1d89b8708ac550d1eac6df04))
  * selection functionality also on pads ([8e5fdf6a](https://github.com/snrbrnjna/galleryjs.git/commit/8e5fdf6adeb7978a4a3c5eededefc34bfc439631))
* **test galleries:** a test gallery without the selection feature ([4bdbb9be](https://github.com/snrbrnjna/galleryjs.git/commit/4bdbb9bee2e906eafd01b587f68cb60b8c1f56be))


### 0.7.3 (2014-06-19)


#### Bug Fixes

* **image_pages:** fixed url pattern for image_pages again and again ([4936c15d](https://github.com/snrbrnjna/galleryjs.git/commit/4936c15d27a0d66ac7290e89c9fc3a38b2ba0abe))


### 0.7.2 (2014-06-19)


#### Bug Fixes

* **image_pages:** fixed url pattern for image_pages again ([3d5b26d7](https://github.com/snrbrnjna/galleryjs.git/commit/3d5b26d7fadc44ef047c4eaf6dfd7141c0555593))


### 0.7.1 (2014-06-19)


#### Bug Fixes

* **image_pages:** fixed url pattern for image_pages ([a178f286](https://github.com/snrbrnjna/galleryjs.git/commit/a178f286af4df522449c3265dabc118f198258c0))


## 0.7.0 (2014-06-19)


#### Features

* **image_pages:** integrate image_pages feature into slider. it sets the URL of the opened image t ([242276bc](https://github.com/snrbrnjna/galleryjs.git/commit/242276bc074b6ab1f4b1b32768b35614787fc87b))


### 0.6.4 (2014-06-18)


#### Bug Fixes

* **styling:** cockpit border-box setting ([834f69a5](https://github.com/snrbrnjna/galleryjs.git/commit/834f69a539aeaadbab4ab071d872a0a773572736))


### 0.6.3 (2014-06-18)


### 0.6.2 (2014-06-11)


### 0.6.1 (2014-06-11)


## 0.6.0 (2014-06-09)


#### Bug Fixes

* **cockpit:** change in styles: cockpit always full width, image-meta: text-overflow:ellipsis ([3d2796ac](https://github.com/snrbrnjna/galleryjs.git/commit/3d2796ac0148dd76522d9af4e9e29bfaf1a074d9))
* **dist:** updated selection and index for dist version ([aed9a870](https://github.com/snrbrnjna/galleryjs.git/commit/aed9a87008811d41d5c0dff0e740973f7eff7b12))
* **thumb.container:** add padding to thumbs container before initializing isotope ([b7479291](https://github.com/snrbrnjna/galleryjs.git/commit/b74792918ed2f94906801e2c3a73c99e2280eb0e))


#### Features

* **app:**
  * add metadata to gallery model just as we can add it to images ([3ebc3277](https://github.com/snrbrnjna/galleryjs.git/commit/3ebc3277bb57d26283c160e5ee256b9ce532dcd1))
  * register onInit(app, galleryModel) callback on app ([156de9fa](https://github.com/snrbrnjna/galleryjs.git/commit/156de9fad70e0632f398cd5538f4c3552550c751))
  * give gallery DOM element css class, when the gallery is empty ([d012d355](https://github.com/snrbrnjna/galleryjs.git/commit/d012d35578355471eb043d4bd79691f4b679ed04))
* **gallery-model:** data-src attrib defines data source for GalleryModel ([853f4613](https://github.com/snrbrnjna/galleryjs.git/commit/853f4613bed1dd19dbb516a9e1e090389eac6639))
* **selection:**
  * add selection button as pure selection component, which gets intitialized and up ([adead502](https://github.com/snrbrnjna/galleryjs.git/commit/adead5021bef7134b21abde041b1f32322e0751d))
  * selection as a source for a gallery ([4fefdb45](https://github.com/snrbrnjna/galleryjs.git/commit/4fefdb45d8ef155b8980e7b8ef11f035564a9285))
  * selection key => possibility of 1 selection for various galleries ([c30f51e7](https://github.com/snrbrnjna/galleryjs.git/commit/c30f51e71b18b7220a527ea93716289786c2b490))
  * GalleryModel gets id = md5 hash of src attribute, extra Selection for every Gall ([d13b3614](https://github.com/snrbrnjna/galleryjs.git/commit/d13b36144b2a33de1a08a6eda35051cf0d53cdd1))
  * added select-button to cockpit ([6d8ca774](https://github.com/snrbrnjna/galleryjs.git/commit/6d8ca774bae6dea8f8be2bb1d4137305e49e8506))
  * toggle button extends indicator ([147e5feb](https://github.com/snrbrnjna/galleryjs.git/commit/147e5feb0e02addff6483397750daa4ee48b0985))
* **selection.gallery.model:** selection is only initialized once ([4b776f82](https://github.com/snrbrnjna/galleryjs.git/commit/4b776f827a94aa71bfc0843893b5f1e303fffa48))
* **style:** button states ([26b0aa90](https://github.com/snrbrnjna/galleryjs.git/commit/26b0aa9021dfe27fd7a3a53d98f30b6386227ee8))
* **styles:** demo-page nicer on phones ([1ad3cd54](https://github.com/snrbrnjna/galleryjs.git/commit/1ad3cd54ffe945a0d9e0811f26742cd02fd26158))


### 0.5.1 (2014-05-14)


#### Bug Fixes

* **style:** cockpit styles refactored ([1668bcb6](https://github.com/snrbrnjna/galleryjs.git/commit/1668bcb65aa654fb640694744a005139bc13f410))


## 0.5.0 (2014-04-16)


#### Features

* Cockpit body has it's own template and is therefore freely customizable by the l ([ad215f9f](https://github.com/snrbrnjna/galleryjs.git/commit/ad215f9f490a0bf623720bac444b5eccabe48807))
* ImageModel comes with filenameOrig attribute ([da8e4f92](https://github.com/snrbrnjna/galleryjs.git/commit/da8e4f92b153b0bebc8bb73f24c431e9d0ecdd69))
* ThumbView also passes meta data to template rendering ([4a819a99](https://github.com/snrbrnjna/galleryjs.git/commit/4a819a99a3143a4174b4fda23246a5ad3f09740c))


#### Breaking Changes

* thumb-template gets ImageModel to work with

to migrate:
``<%= digest %>`` becomes ``<%= img.get('digest') %>``
``<%= src %>`` becomes ``<%= img.getThumb().src %>``

 ([baa0c1e6](https://github.com/snrbrnjna/galleryjs.git/commit/baa0c1e63c10629d2a941030d16c194afb28c757))


### 0.4.1


#### Bug Fixes

* **style:** url to add.selection.button sprite made relative ([9a7f39ea](https://github.com/snrbrnjna/galleryjs.git/commit/9a7f39ea0a0e0bcf2636455be1be6c8a8897be5a))


#### Features

* **bower:** prepared bower.json for registering of package ([d4d93575](https://github.com/snrbrnjna/galleryjs.git/commit/d4d93575e58cd07683ee313fa938744b5707620e))
* **doku:** integrating gallery.js in a website ([e1368ec7](https://github.com/snrbrnjna/galleryjs.git/commit/e1368ec785f1eef967298588e97e6754a67d144c))


## 0.4.0 (2014-03-31)


#### Bug Fixes

* **Style:** Heading smaller ([6f5b3bc3](https://github.com/snrbrnjna/galleryjs.git/commit/6f5b3bc39ade91fd12de2a4b27a59079ea594226))
* **requirejs:** removed not needed lib browser.detect.js ([910d9044](https://github.com/snrbrnjna/galleryjs.git/commit/910d904421d92d9f45aaa5a07e428bceb3a1272b))


#### Features

* **Dist:** css and js files in lib folder ([14703590](https://github.com/snrbrnjna/galleryjs.git/commit/14703590aa95fa2799b13e2cba7d8ad5eb8853ac))
* **Grunt:** added copy jobs for lib files ([1822a02f](https://github.com/snrbrnjna/galleryjs.git/commit/1822a02f1737c366edcf2e20a08ef48834007c7e))
* **pdfbutton:** animated loading pdf button ([7f4c60ca](https://github.com/snrbrnjna/galleryjs.git/commit/7f4c60ca8cdab629c826224caf969d4132533c57))
* **styling:** added webfont for heading h1 ([dbc83ab0](https://github.com/snrbrnjna/galleryjs.git/commit/dbc83ab00fdb102c3becbcd4bccf534feb80e0be))

