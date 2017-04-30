Angular Super Gallery
===

*Angular 2 and Angular 4 versions are under development*

### Requirements
- [angular](https://github.com/angular/angular.js/tree/v1.6.4) 1.6.4
- [angular-animate](https://github.com/angular/bower-angular-animate/tree/v1.6.4) 1.6.4
- [angular-fullscreen](https://github.com/fabiobiondi/angular-fullscreen) 1.0.1 
- [bootstrap](https://github.com/twbs/bootstrap/tree/v3.3.7) 3.3.7

### Usage

See demo/index.html or [here](http://schalk.hu/projects/angular-super-gallery/demo/)
```
<asg-setup data-id="galleryUniqueId" data-options="ctrl.options2" data-items="ctrl.files2"></asg-setup>
<asg-panel data-id="galleryUniqueId"></asg-panel>
<asg-image data-id="galleryUniqueId"></asg-image>
<asg-modal data-id="galleryUniqueId" data-visible="showModal2"></asg-modal>
```

### Build
- `npm install`
- `typings install`
- `gulp dev`
- `gulp prod` (minified javascript and css file)

### Todos
- rotate image (left, right)
- zoom image and drag
- show original size
- angular component for controls (play/stop/next/prev)
- fix rotateLR transition in Firefox (or somebody fix the Firefox ;)

### Photos
Taken from [wallpaperscraft.com](https://wallpaperscraft.com). Thank you!

### License
MIT