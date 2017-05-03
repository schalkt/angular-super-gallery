Angular Super Gallery
===

*Angular 2 and Angular 4 versions are under development*

### Demo

See demo/index.html or [online demo](http://schalk.hu/projects/angular-super-gallery/demo/)

![angular-super-gallery-screenshot-1](http://schalk.hu/projects/angular-super-gallery/screenshot1.jpg)
![angular-super-gallery-screenshot-2](http://schalk.hu/projects/angular-super-gallery/screenshot2.jpg)

### Requirements
- [angular](https://github.com/angular/angular.js/tree/v1.6.4) 1.6.4
- [angular-animate](https://github.com/angular/bower-angular-animate/tree/v1.6.4) 1.6.4
- [angular-touch](https://github.com/angular/bower-angular-touch/tree/v1.6.4) 1.6.4
- [angular-fullscreen](https://github.com/fabiobiondi/angular-fullscreen) 1.0.1 
- [bootstrap](https://github.com/twbs/bootstrap/tree/v3.3.7) 3.3.7


### Features
- separated angular components (modal, panel and image)
- keyboard shortcuts in modal window
- highly configurable
- full responsive
- 3 built-in themes
- 9 image transitions (CSS3 3D)
- wide and fit image display mode
- touch support

### Install

`bower install --save angular-super-gallery`

### Usage

in Controller
```
this.nature1Options = {
    baseUrl: "https://",
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
		"url": "wallpaperscraft.com/image/nature_waterfall_summer_lake_trees_90400_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/nature_waterfall_summer_lake_trees_90400_300x168.jpg",
	}, {
		"url": "wallpaperscraft.com/image/summer_mountains_nature_lake_river_grass_93164_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/summer_mountains_nature_lake_river_grass_93164_300x168.jpg",
	}
];
```


in HTML
```
<asg-setup data-id="nature1" data-options="ctrl.nature1Options" data-items="ctrl.nature1"></asg-setup>
<asg-panel data-id="nature1"></asg-panel>
<asg-image data-id="nature1"></asg-image>
<asg-modal data-id="nature1"></asg-modal>
```

### Available options
```
{
    baseUrl: "", // url prefix
    fields: {
        url: "url", // url input field name
        title: "title", // title input field name
        description: "description", // description input field name
        thumbnail: "thumbnail" // thumbnail input field name
    },
    autoplay: {
        enabled: false, // slideshow autoplay enabled/disabled
        delay: 4100 // autoplay delay in millisecond
    },
    theme: 'default', // css style [default, darkblue, whitegold]
    preload: [0], // preload images by index number
    modal: {
        title: "", // modal window title
        subtitle: "", // modal window subtitle
        caption: true, // show/hide image caption
        menu: true, // show/hide menu
        help: false, // show/hide help
        transition: 'rotateLR', // transition effect
        wide: false // enable/disable wide image display mode
    },
    panel: {
        item: {
            class: 'col-md-3' // item class
        },
    },
    image: {
        transition: 'rotateLR', // transition effect
        wide: false, // enable/disable wide image display mode
        height: 300 // height
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


### Keyboard shortcuts in modal window
- SPACE : forward
- RIGHT : forward
- LEFT : backward
- UP : first
- DOWN : last
- ESC : exit
- P : play/pause
- F : toggle fullscreen
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
- keyboard shortcuts setup / YouTube play/pause (K), skip forward (L), jump back (J)
- image preload fix (and/or http://jariz.github.io/vibrant.js/)
- multiple image sizes (thumbnail, medium, original)
- publish package to npm (webpack support)
- exit button must be visible on modal when menubar hidden
- image zoom / drag / rotate
- image info (original width and height / bytes)
- angular component for controls (play/stop/next/prev)
- transitions fix in Microsoft Edge
- rotateLR transition fix in Firefox on MAC (or somebody fix the Firefox ;)

### Photos
[wallpaperscraft.com](https://wallpaperscraft.com)

### License
MIT