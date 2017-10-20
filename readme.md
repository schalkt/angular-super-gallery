Angular Super Gallery
===

*AngularJS image gallery*

### Demo

See demo/index.html or [online demo](http://schalk.hu/projects/angular-super-gallery/demo/)

![angular-super-gallery-screenshot-1](http://schalk.hu/projects/angular-super-gallery/screenshot1.jpg)
![angular-super-gallery-screenshot-2](http://schalk.hu/projects/angular-super-gallery/screenshot2.jpg)

### Requirements
- [jQuery](https://github.com/jquery/jquery/tree/3.2.1) ^3.2.1
- [angular](https://github.com/angular/angular.js/tree/v1.6.4) 1.6.4
- [angular-animate](https://github.com/angular/bower-angular-animate/tree/v1.6.4) 1.6.4
- [angular-touch](https://github.com/angular/bower-angular-touch/tree/v1.6.4) 1.6.4
- [angular-fullscreen](https://github.com/fabiobiondi/angular-fullscreen) 1.0.1 
- [bootstrap](https://github.com/twbs/bootstrap/tree/v3.3.7) 3.3.7


### Features
- separated angular components (image, modal, panel, info and controls)
- responsive and highly configurable
- image display mode (cover, contain, auto, stretch)
- multiple image sizes / thumbnail (for panel) , medium (for image), original (for modal)
- 3 built-in themes
- 9 image transitions (CSS3 3D)
- configurable keyboard shortcuts in modal window ([keyCodes](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes))
- touch support (swipe)


### Install

- `npm install --save angular-super-gallery`


### Setup in AngularJS
```
angular.module("App", ['angularSuperGallery']);
```

### Quick usage in HTML
```
<asg-image 
       data-options='{"baseUrl" : "https://wallpaperscraft.com/image/"}'
       data-items='[
        "porsche_panamera_rear_view_white_auto_96846_1920x1080.jpg",
        "subaru_brz_subaru_cars_sunset_93895_1920x1080.jpg" 
       ]'>
    <asg-modal></asg-modal>
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
        wide: true,
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
<asg-image data-id="nature"></asg-image>
<asg-panel data-id="nature" data-options="ctrl.nature1Options" data-items="ctrl.nature1"></asg-panel>
<asg-modal data-id="nature" data-visible="ctrl.showModal"></asg-modal>
```
or (without thumbnails)
```
<asg-image data-id="nature" data-options="ctrl.nature1Options" data-items="ctrl.nature1"></asg-image>
<asg-modal data-id="nature" data-visible="ctrl.showModal"></asg-modal>
```

### Available options
```
debug: false, // image load and autoplay info in console.log
baseUrl: "", // url prefix
fields: {
    source: {
        modal: "url", // required, image url for modal component (large size)
        panel: "url", // image url for panel component (thumbnail size)
        image: "url" // image url for image (medium size)
    },
    title: "title", // title input field name
    description: "description", // description input field name
    thumbnail: "thumbnail" // thumbnail input field name
},
autoplay: {
    enabled: false, // slideshow play enabled/disabled
    delay: 4100 // autoplay delay in millisecond
},
theme: 'default', // css style [default, darkblue, whitegold]
preloadDelay: 770,
preload: [], // preload images by index number
modal: {
    title: "", // modal window title
    subtitle: "", // modal window subtitle
    caption: true, // show/hide image caption
    menu: true, // show/hide modal menu
    help: false, // show/hide help
    transition: 'slideLR', // transition effect
    size: 'contain', // contain, cover, auto, stretch
    keycodes: {
        exit: [27], // ESC
        playpause: [80], // p
        forward: [32, 39], // SPACE, RIGHT ARROW
        backward: [37], // LEFT ARROW
        first: [38, 36], // UP ARROW, HOME
        last: [40, 35], // DOWN ARROW, END
        fullscreen: [13], // ENTER
        menu: [77], // m
        caption: [67], // c
        help: [72], // h
        size: [83], // s
        transition: [84] // t
    }
},
panel: {
    visible: true,
    item: {
        class: 'col-md-3', // item class
        caption: false
    },
},
image: {
    transition: 'slideLR', // transition effect
    size: 'contain', // contain, cover, auto, stretch
    height: 0, // height
    heightMin: 0, // min height
    heightAuto: {
        initial: true,
        onresize: false
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


### Build
- `npm install`
- `typings install`
- `gulp dev`
- `gulp prod` (minified javascript and css file)
- `gulp watch` (automatic build under development)


### Todo
- panel custom template for thumbnails
- load images from API endpoint
- thumbnails (panel component) on modal
- events (init, first image loaded, change image, modal open/close, etc.)
- exit button must be visible on modal when menubar hidden
- image zoom / drag / rotate
- image info (original width and height / bytes)
- transitions fix in Microsoft Edge (or fix Edge :)


### Photos
[wallpaperscraft.com](https://wallpaperscraft.com)

### License
MIT