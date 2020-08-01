# AngularJS Super Gallery

Image gallery based on **AngularJS** and **Bootstrap 4**. (for Bootstrap 3 switch to the bootstrap3 branch)

[![npm](https://img.shields.io/npm/dt/angular-super-gallery.svg?style=flat-square)](https://www.npmjs.com/package/angular-super-gallery)
[![GitHub issues](https://img.shields.io/github/issues/schalkt/angular-super-gallery.svg?style=flat-square)](https://github.com/schalkt/angular-super-gallery/issues)
[![schalkt](https://img.shields.io/david/schalkt/angular-super-gallery.svg?style=flat-square)](https://david-dm.org/schalkt/angular-super-gallery)
[![Build Status](https://travis-ci.org/schalkt/angular-super-gallery.svg?branch=master)](https://travis-ci.org/schalkt/angular-super-gallery)
[![npm](https://img.shields.io/npm/v/angular-super-gallery.svg?style=flat-square)](https://www.npmjs.com/package/angular-super-gallery)

[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=schalkt_angular-super-gallery&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=schalkt_angular-super-gallery)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=schalkt_angular-super-gallery&metric=security_rating)](https://sonarcloud.io/dashboard?id=schalkt_angular-super-gallery)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=schalkt_angular-super-gallery&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=schalkt_angular-super-gallery)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=schalkt_angular-super-gallery&metric=bugs)](https://sonarcloud.io/dashboard?id=schalkt_angular-super-gallery)

## Preview

[![preview](https://img.shields.io/badge/preview-click_here-green.svg?style=flat-square)](http://schalk.hu/projects/angular-super-gallery/demo/) or check /demo/index.html

![angular-super-gallery-screenshot-1](https://schalk.hu/projects/angular-super-gallery/screenshot1.jpg)
![angular-super-gallery-screenshot-2](https://schalk.hu/projects/angular-super-gallery/screenshot2.jpg)

## Dependencies

```json
{
    "angular": "1.8.0",
    "angular-animate": "1.8.0",
    "angular-touch": "1.8.0",
    "bootstrap": "4.5.0",
    "font-awesome": "4.7.0",
    "jquery": "3.5.1",
    "screenfull": "5.0.2"
}
```

## Features

- separated Angular components (image, modal, thumbnail, panel, info and control)
- highly configurable
- image display modes (cover, contain, auto, stretch)
- multiple image sizes : thumbnail (for panel) , medium (for image), original (for modal)
- responsive and 4 built-in themes
- 13 image transitions (CSS3 3D)
- configurable keyboard shortcuts in modal window
- events (config load, image load, modal open/close, autoplay, update, etc.)
- placeholder image and loading animation
- touch support (swipe)

## Install

- `npm install --save angular-super-gallery` or `yarn add angular-super-gallery`

## Setup

```javascript
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

## Quick usage in HTML

```html
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

## Advanced usage

setup in controller

```javascript
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
        "thumbnail": "i1.wallpaperscraft.com/image/nature_waterfall_summer_lake_trees_90400_300x188.jpg",
        "medium": "i1.wallpaperscraft.com/image/nature_waterfall_summer_lake_trees_90400_602x339.jpg",
    }, {
        "link": "wallpaperscraft.com/image/summer_mountains_nature_lake_river_grass_93164_1920x1080.jpg",
        "thumbnail": "i1.wallpaperscraft.com/image/summer_mountains_nature_lake_river_grass_93164_300x188.jpg",
        "medium": "i1.wallpaperscraft.com/image/summer_mountains_nature_lake_river_grass_93164_602x339.jpg",
    }
];
```

in HTML

```html
<asg-image data-id="nature" data-options="ctrl.nature1Options" data-items="ctrl.nature1">
    <asg-thumbnail></asg-thumbnail>
    <asg-modal data-visible="ctrl.showModal"></asg-modal>
</asg-image>
<asg-panel data-id="nature"></asg-panel>
```

or (without thumbnails)

```html
<asg-image data-options="ctrl.nature1Options" data-items="ctrl.nature1">
    <asg-modal data-visible="ctrl.showModal"></asg-modal>
</asg-image>

```

## Available options

```javascript
    debug: false, // image load, autoplay, etc. info in console.log
    hashUrl: true, // enable/disable hash usage in url (#asg-nature-4)
    baseUrl: '', // url prefix
    duplicates: false, // enable or disable same images (url) in gallery
    selected: 0, // selected image on init
    fields: {
        source: {
            modal: 'url', // required, image url for modal component (large size)
            panel: 'url', // image url for panel component (thumbnail size)
            image: 'url', // image url for image (medium or custom size)
            placeholder: null // image url for preload lowres image
        },
        title: 'title', // title field name
        description: 'description', // description field name
    },
    autoplay: {
        enabled: false, // slideshow play enabled/disabled
        delay: 4100 // autoplay delay in millisecond
    },
    theme: 'default', // css style [default, darkblue, darkred, whitegold]
    preloadNext: false, // preload next image (forward/backward)
    preloadDelay: 770, // preload delay for preloadNext
    loadingImage: 'preload.svg', // loader image
    preload: [], // preload images by index number
    modal: {
        title: '', // modal window title
        subtitle: '', // modal window subtitle
        titleFromImage: false, // force update the gallery title by image title
        subtitleFromImage: false, // force update the gallery subtitle by image description
        placeholder: 'panel', // set image placeholder source type (thumbnail) or full url (http...)
        caption: {
            disabled: false, // disable image caption
            visible: true, // show/hide image caption
            position: 'top', // caption position [top, bottom]
            download: false // show/hide download link
        },
        header: {
            enabled: true, // enable/disable modal menu
            dynamic: false, // show/hide modal menu on mouseover
            buttons: ['playstop', 'index', 'prev', 'next', 'pin', 'size', 'transition', 'thumbnails', 'fullscreen', 'help', 'close'],
        },
        help: false, // show/hide help
        arrows: {
            enabled: true, // show/hide arrows
            preload: true, // preload image on mouseover
        },
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
                preload: true, // preload image on mouseover
                select: false // set selected image on mouseover when true
            },
        },
        transition: 'slideLR', // transition effect
        transitionSpeed: 0.7, // transition speed 0.7s
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
            preload: true, // preload image on mouseover
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
            preload: true, // preload image on mouseover
            select: false // set selected image on mouseover when true
        },
        click: {
            select: false, // set selected image when true
            modal: true // open modal when true
        },
    },
    image: {
        transition: 'slideLR', // transition effect
        transitionSpeed: 0.7, // transition speed 0.7s
        size: 'cover', // contain, cover, auto, stretch
        arrows: {
            enabled: true,  // show/hide arrows
            preload: true, // preload image on mouseover
        },
        click: {
            modal: true // when click on the image open the modal window
        },
        height: null, // height in pixel
        heightMin: null, // min height in pixel
        heightAuto: {
            initial: true, // calculate div height by first image
            onresize: false // calculate div height on window resize
        },
        placeholder: 'panel' // set image placeholder source type (thumbnail) or full url (http...)
    }
```

## Edit

### Add new image or images to the gallery by id

```javascript
$rootScope.$broadcast('ASG-gallery-edit', {
    id: 'nature',
    add: [{
        "link": "wallpaperscraft.com/image/tree_fog_nature_beautiful_84257_1920x1080.jpg",
        "thumbnail": "images.wallpaperscraft.com/image/tree_fog_nature_beautiful_84257_300x168.jpg",
        "medium": "images.wallpaperscraft.com/image/tree_fog_nature_beautiful_84257_960x544.jpg",
    }]
});
```

### Update gallery options and set selected image

```javascript
    $rootScope.$broadcast('ASG-gallery-edit', {
        id: 'nature',
        selected: 0,
        options: this.options1
    });
```

### Reload gallery images

```javascript
    $rootScope.$broadcast('ASG-gallery-edit', {
        id: 'nature',
        refresh: true
    });
```

### Delete image

```javascript
    $rootScope.$broadcast('ASG-gallery-edit', {
        id: 'nature',
        delete: null // index number or null for delete selected image
    });
```

### Update gallery images

```javascript
    $rootScope.$broadcast('ASG-gallery-edit', {
        id: 'nature',
        update: ['image1url', 'image2url', {source: {image: 'image3url', title: 'image3title'}}]; // use image url or object
    });
```

## Transitions

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
- zlideLR
- zlideTB
- flipX
- flipY

## Default keyboard shortcuts in modal window

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

## Events

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

## Build

- Node.js 12 recommended
- `npm install`
- `gulp dev`
- `gulp prod` (minified javascript and css file)
- `gulp watch` (automatic build under development)

## Todo

- slideshow mode (fullscreen, hide menu and arrows, start autoplay)
- indicator component
- theme color setup
- remove caption from modal and add asg-info
- control component custom buttons
- header component with controls = modal header?
- fix info component image width and height data
- exit button must be visible on modal when menubar hidden
- load images and config from API endpoint
- add edit mode (upload, delete, rename, etc.) for admin page
- options and info menu in modal
- image zoom / drag / rotate
- image info (original width and height / bytes)
- preloader svg fix in Microsoft Edge (or fix Edge :)
- remember website hash and set back when modal closed?

## Photos

[unsplash.com](https://unsplash.com/)

## License

MIT
