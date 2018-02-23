Angular Super Gallery
===

*AngularJS image gallery*

[![preview](https://img.shields.io/badge/preview-click_here-green.svg?style=flat-square)](http://schalk.hu/projects/angular-super-gallery/demo/)
[![npm](https://img.shields.io/npm/dt/angular-super-gallery.svg?style=flat-square)](https://www.npmjs.com/package/angular-super-gallery)
[![GitHub issues](https://img.shields.io/github/issues/schalkt/angular-super-gallery.svg?style=flat-square)](https://github.com/schalkt/angular-super-gallery/issues)
[![npm](https://img.shields.io/npm/v/angular-super-gallery.svg?style=flat-square)](https://www.npmjs.com/package/angular-super-gallery)
[![schalkt](https://img.shields.io/david/schalkt/angular-super-gallery.svg?style=flat-square)](https://david-dm.org/schalkt/angular-super-gallery)

[![bitHound Overall Score](https://www.bithound.io/github/schalkt/angular-super-gallery/badges/score.svg)](https://www.bithound.io/github/schalkt/angular-super-gallery)
[![bitHound Dependencies](https://www.bithound.io/github/schalkt/angular-super-gallery/badges/dependencies.svg)](https://www.bithound.io/github/schalkt/angular-super-gallery/develop/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/schalkt/angular-super-gallery/badges/code.svg)](https://www.bithound.io/github/schalkt/angular-super-gallery)

### Demo

[online demo](http://schalk.hu/projects/angular-super-gallery/demo/) or see /demo/index.html

![angular-super-gallery-screenshot-1](http://schalk.hu/projects/angular-super-gallery/screenshot1.jpg)
![angular-super-gallery-screenshot-2](http://schalk.hu/projects/angular-super-gallery/screenshot2.jpg)

### Requirements
- [jQuery](https://github.com/jquery/jquery/tree/3.2.1) ^3.2.1
- [angular](https://github.com/angular/angular.js/tree/v1.6.4) 1.6.x
- [angular-animate](https://github.com/angular/bower-angular-animate/tree/v1.6.4) 1.6.x
- [angular-touch](https://github.com/angular/bower-angular-touch/tree/v1.6.4) 1.6.x
- [screenfull](https://www.npmjs.com/package/screenfull) 3.3.x
- [bootstrap](https://github.com/twbs/bootstrap/tree/v3.3.7) 3.3.x


### Features
- separated Angular components (image, modal, thumbnails, panel, info and controls)
- highly configurable
- image display mode (cover, contain, auto, stretch)
- multiple image sizes / thumbnail (for panel) , medium (for image), original (for modal)
- responsive and 4 built-in themes
- 11 image transitions (CSS3 3D)
- configurable keyboard shortcuts in modal window ([keyCodes](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes))
- events (config load, image load, modal open/close, autoplay start/stop, etc.)
- touch support (swipe)


### Install

- `npm install --save angular-super-gallery` or `yarn add angular-super-gallery`

### Setup
```
import 'bootstrap/dist/css/bootstrap.min.css';
import 'angular-super-gallery/dist/angular-super-gallery.css';
import 'jquery';
import 'angular';
import 'bootstrap';
import 'angular-animate';
import 'angular-touch';
import 'screenfull';
import angularSuperGallery from 'angular-super-gallery';

angular.module("app", [angularSuperGallery]);
```

### Quick usage in HTML
```
<asg-image 
       data-options='{"baseUrl" : "https://wallpaperscraft.com/image/"}'
       data-items='[
        "porsche_panamera_rear_view_white_auto_96846_1920x1080.jpg",
        "subaru_brz_subaru_cars_sunset_93895_1920x1080.jpg" 
       ]'>
    <asg-modal>
        <asg-thumbnail></asg-thumbnail>
    </asg-modal>
</asg-image>
```

### Advanced usage

setup in controller
```
this.showModal = false;
this.nature1Options = {
    baseUrl: "https://",
    fields: {
        source: {
            modal: "link",
            image: "medium",
            panel: "thumbnail"
        }
    },
    modal: {
        transition: 'zoomInOut'
    },
    panel: {
        thumbnail: {
            class: "col-md-4"
        },
    },
    image: {
        transition: 'fadeInOut'
    }
};


this.nature1 = [
    {
        "link": "wallpaperscraft.com/image/nature_waterfall_summer_lake_trees_90400_1920x1080.jpg",
  		"thumbnail": "i1.wallpaperscraft.com/image/nature_waterfall_summer_lake_trees_90400_300x168.jpg",
  		"medium": "i1.wallpaperscraft.com/image/nature_waterfall_summer_lake_trees_90400_602x339.jpg",
  	}, {
  		"link": "wallpaperscraft.com/image/summer_mountains_nature_lake_river_grass_93164_1920x1080.jpg",
  		"thumbnail": "i1.wallpaperscraft.com/image/summer_mountains_nature_lake_river_grass_93164_300x168.jpg",
  		"medium": "i1.wallpaperscraft.com/image/summer_mountains_nature_lake_river_grass_93164_602x339.jpg",
  	}
];
```


in HTML
```
<asg-image data-id="nature" data-options="ctrl.nature1Options" data-items="ctrl.nature1">
    <asg-thumbnail></asg-thumbnail>
    <asg-modal data-visible="ctrl.showModal"></asg-modal>
</asg-image>
<asg-panel data-id="nature"></asg-panel>
```
or (without thumbnails)
```
<asg-image data-options="ctrl.nature1Options" data-items="ctrl.nature1">
    <asg-modal data-visible="ctrl.showModal"></asg-modal>
</asg-image>

```

### Available options
```
    debug: false, // image load, autoplay, etc. info in console.log
    hashUrl: true, // enable/disable hash usage in url (#asg-nature-4)
    baseUrl: '', // url prefix
    fields: {
        source: {
            modal: 'url', // required, image url for modal component (large size)
            panel: 'url', // image url for panel component (thumbnail size)
            image: 'url' // image url for image (medium or custom size)
        },
        title: 'title', // title field name
        description: 'description', // description field name
    },
    autoplay: {
        enabled: false, // slideshow play enabled/disabled
        delay: 4100 // autoplay delay in millisecond
    },
    theme: 'default', // css style [default, darkblue, whitegold]
    preloadDelay: 770,
    preload: [], // preload images by index number
    modal: {
        title: '', // modal window title
        subtitle: '', // modal window subtitle
        caption: {
            disabled: false, // disable image caption
            visible: true, // show/hide image caption
            position: 'top' // caption position [top, bottom]
        },
        header: {
            enabled: true, // enable/disable modal menu
            dynamic: false, // show/hide modal menu on mouseover
            buttons: ['playstop', 'index', 'prev', 'next', 'pin', 'size', 'transition', 'thumbnails', 'fullscreen', 'help', 'close'],
        },
        help: false, // show/hide help
        arrows: true, // show/hide arrows
        click: {
            close: true // when click on the image close the modal
        },
        thumbnail: {
            height: 50, // thumbnail image height in pixel
            index: false, // show index number on thumbnail
            enabled: true, // enable/disable thumbnails
            dynamic: false, // if true thumbnails visible only when mouseover
            autohide: true, // hide thumbnail component when single image
            click: {
                select: true, // set selected image when true
                modal: false // open modal when true
            },
            hover: {
                select: false // set selected image on mouseover when true
            },
        },
        transition: 'slideLR', // transition effect
        size: 'cover', // contain, cover, auto, stretch
        keycodes: {
            exit: [27], // esc
            playpause: [80], // p
            forward: [32, 39], // space, right arrow
            backward: [37], // left arrow
            first: [38, 36], // up arrow, home
            last: [40, 35], // down arrow, end
            fullscreen: [13], // enter
            menu: [77], // m
            caption: [67], // c
            help: [72], // h
            size: [83], // s
            transition: [84] // t
        }
    },
    thumbnail: {
        height: 50, // thumbnail image height in pixel
        index: false, // show index number on thumbnail
        dynamic: false, // if true thumbnails visible only when mouseover
        autohide: false, // hide thumbnail component when single image
        click: {
            select: true, // set selected image when true
            modal: false // open modal when true
        },
        hover: {
            select: false // set selected image on mouseover when true
        },
    },
    panel: {
        visible: true,
        item: {
            class: 'col-md-3', // item class
            caption: false, // show/hide image caption
            index: false, // show/hide image index
        },
        hover: {
            select: false // set selected image on mouseover when true
        },
        click: {
            select: false, // set selected image when true
            modal: true // open modal when true
        },
    },
    image: {
        transition: 'slideLR', // transition effect
        size: 'cover', // contain, cover, auto, stretch
        arrows: true, // show/hide arrows
        click: {
            modal: true // when click on the image open the modal window
        },
        height: null, // height in pixel
        heightMin: null, // min height in pixel
        heightAuto: {
            initial: true, // calculate div height by first image
            onresize: false // calculate div height on window resize
        }
    }
```


### Transitions
- no
- fadeInOut
- zoomIn
- zoomOut
- zoomInOut
- rotateLR
- rotateTB
- rotateZY
- slideLR
- slideTB
- flipX
- flipY


### Default keyboard shortcuts in modal window
- RIGHT / SPACE : forward
- LEFT : backward
- UP / HOME : first
- DOWN / END : last
- ESC : exit
- ENTER : toggle fullscreen
- p : play/pause
- t : change transition effect
- m : toggle menu
- s : toggle image size
- c : toggle caption
- h : toggle help


### Events
- CONFIG_LOAD: `ASG-config-load-[gallery id]`,
- AUTOPLAY_START: `ASG-autoplay-start-[gallery id]`,
- AUTOPLAY_STOP: `ASG-autoplay-stop-[gallery id]`,
- PARSE_IMAGES: `ASG-parse-images-[gallery id]`,
- FIRST_IMAGE: `ASG-first-image-[gallery id]`,
- LOAD_IMAGE: `ASG-load-image-[gallery id]`,
- CHANGE_IMAGE: `ASG-change-image-[gallery id]`,
- MODAL_OPEN: `ASG-modal-open-[gallery id]`,
- MODAL_CLOSE: `ASG-modal-close-[gallery id]`,
- THUMBNAIL_MOVE: `ASG-thumbnail-move-[gallery id]`,


### Build
- `npm install`
- `typings install`
- `gulp dev`
- `gulp prod` (minified javascript and css file)
- `gulp watch` (automatic build under development)


### Todo
- remember website hash and set back when modal closed
- control component custom buttons
- header component with controls = modal header?
- exit button must be visible on modal when menubar hidden
- indicator component
- preload on image or thumbnail hover to options
- load images from API endpoint
- slideshow mode (fullscreen, hide menu and arrows, start autoplay)
- options and info menu in modal
- image zoom / drag / rotate
- image info (original width and height / bytes)
- npm and gulp -> yarn and webpack
- transitions fix in Microsoft Edge (or fix Edge :)


### Photos
[wallpaperscraft.com](https://wallpaperscraft.com)

### License
MIT
