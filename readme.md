Angular Super Gallery
===

*Angular 2 and Angular 4 versions are under development*

### Demo

See demo/index.html or [online demo](http://schalk.hu/projects/angular-super-gallery/demo/)

![angular-super-gallery-screenshot-1](http://schalk.hu/projects/angular-super-gallery/screenshot1.jpg)
![angular-super-gallery-screenshot-2](http://schalk.hu/projects/angular-super-gallery/screenshot2.jpg)

### Requirements
- [jQuery](https://github.com/jquery/jquery/tree/2.2.4) ^2.2.4
- [angular](https://github.com/angular/angular.js/tree/v1.6.4) 1.6.4
- [angular-animate](https://github.com/angular/bower-angular-animate/tree/v1.6.4) 1.6.4
- [angular-touch](https://github.com/angular/bower-angular-touch/tree/v1.6.4) 1.6.4
- [angular-fullscreen](https://github.com/fabiobiondi/angular-fullscreen) 1.0.1 
- [bootstrap](https://github.com/twbs/bootstrap/tree/v3.3.7) 3.3.7


### Features
- separated angular components (modal, panel and image)
- many configuration options
- full responsive (under fixing)
- wide and fit image display mode
- multiple image sizes / thumbnail (for panel) , medium (for image), original (for modal)
- 3 built-in themes
- 9 image transitions (CSS3 3D)
- configurable keyboard shortcuts in modal window ([keyCodes](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes))
- touch support

### Install

- `npm install --save angular-super-gallery`
- or `bower install --save angular-super-gallery`
- webpack (CommonJS) supported

### Usage

```
angular.module("App", ['angularSuperGallery']);
```

in Controller
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
or (no thumbnails)
```
<asg-image data-id="nature" data-options="ctrl.nature1Options" data-items="ctrl.nature1"></asg-image>
<asg-modal data-id="nature" data-visible="ctrl.showModal"></asg-modal>
```

### Available options
```
{
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
        transition: 'rotateLR', // transition effect
        wide: false, // enable/disable wide image display mode
        keycodes: {
            exit: [27], // ESC
            playpause: [80], // p
            forward: [32, 39], // SPACE, RIGHT ARROW
            backward: [37], // LEFT ARROW
            first: [38, 36], // UP ARROW, HOME
            last: [40, 35], // DOWN ARROW, END
            fullscreen: [70, 13], // f, ENTER
            menu: [77], // m
            caption: [67], // c
            help: [72], // h
            wide: [87], // w
            transition: [84] // t
        }
    },
    panel: {
        item: {
            class: 'col-md-3' // item class
        },
    },
    image: {
        transition: 'rotateLR', // transition effect
        wide: false, // enable/disable wide image display mode
        height: 300, // height
    }
}
```


### Transitions
- no
- fadeInOut
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
- P : play/pause
- F / ENTER : toggle fullscreen
- T : change transition effect
- M : toggle menu
- W : toggle wide screen
- C : toggle caption
- H : toggle help


### Build
- `npm install`
- `typings install`
- `gulp dev`
- `gulp prod` (minified javascript and css file)


### Todo
- fix responsive view
- image preload fix
- publish package to npm (webpack support)
- exit button must be visible on modal when menubar hidden
- image zoom / drag / rotate
- image info (original width and height / bytes)
- angular component for controls (play/stop/next/prev)
- angular component for img
- transitions fix in Microsoft Edge
- rotateLR transition fix in Firefox on MAC (or somebody fix the Firefox ;)

### Photos
[wallpaperscraft.com](https://wallpaperscraft.com)

### License
MIT