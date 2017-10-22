/**
 * angular-super-gallery - AngularJS Super Gallery
 * 
 * @version v1.0.0
 * @link https://github.com/schalkt/angular-super-gallery
 * @license MIT
 */
var ASG;
(function (ASG) {
    var app = angular.module('angularSuperGallery', ['ngAnimate', 'FBAngular', 'ngTouch']);
    app.filter('asgBytes', function () {
        return function (bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
                return '';
            }
            if (bytes === 0) {
                return '0';
            }
            if (typeof precision === 'undefined') {
                precision = 1;
            }
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'], number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        };
    });
})(ASG || (ASG = {}));

var ASG;
(function (ASG) {
    var ControlController = (function () {
        function ControlController(service, $scope) {
            this.service = service;
            this.$scope = $scope;
            this.type = 'control';
            this.template = 'views/asg-control.html';
        }
        ControlController.prototype.$onInit = function () {
            var _this = this;
            this.asg = this.service.getInstance(this);
            this.$scope.forward = function () {
                _this.asg.toForward(true);
            };
            this.$scope.backward = function () {
                _this.asg.toBackward(true);
            };
        };
        Object.defineProperty(ControlController.prototype, "config", {
            get: function () {
                return this.asg.options[this.type];
            },
            set: function (value) {
                this.asg.options[this.type] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ControlController.prototype, "selected", {
            get: function () {
                if (!this.asg) {
                    return;
                }
                return this.asg.selected;
            },
            set: function (v) {
                if (!this.asg) {
                    return;
                }
                this.asg.selected = v;
            },
            enumerable: true,
            configurable: true
        });
        return ControlController;
    }());
    ASG.ControlController = ControlController;
    var app = angular.module('angularSuperGallery');
    app.component('asgControl', {
        controller: ['asgService', '$scope', ASG.ControlController],
        template: '<div class="asg-control {{ $ctrl.asg.theme }}"><div ng-include="$ctrl.template"></div></div>',
        bindings: {
            id: '@?',
            selected: '=?',
            template: '@?'
        }
    });
})(ASG || (ASG = {}));

var ASG;
(function (ASG) {
    var ImageController = (function () {
        function ImageController(service, $rootScope, $element, $window, $scope) {
            var _this = this;
            this.service = service;
            this.$rootScope = $rootScope;
            this.$element = $element;
            this.$window = $window;
            this.$scope = $scope;
            this.type = 'image';
            angular.element($window).bind('resize', function (event) {
                _this.onResize();
            });
        }
        ImageController.prototype.onResize = function () {
            if (this.config.heightAuto.onresize) {
                this.setHeight(this.asg.file);
            }
        };
        ImageController.prototype.$onInit = function () {
            var _this = this;
            this.asg = this.service.getInstance(this);
            this.$rootScope.$on(this.asg.events.FIRST_IMAGE + this.id, function (event, data) {
                if (!_this.config.height && _this.config.heightAuto.initial === true) {
                    _this.setHeight(data.img);
                }
            });
        };
        ImageController.prototype.setHeight = function (img) {
            var width = this.$element.children('div').width();
            var ratio = img.width / img.height;
            this.config.height = width / ratio;
        };
        Object.defineProperty(ImageController.prototype, "height", {
            get: function () {
                return this.config.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageController.prototype, "config", {
            get: function () {
                return this.asg.options[this.type];
            },
            set: function (value) {
                this.asg.options[this.type] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageController.prototype, "selected", {
            get: function () {
                if (!this.asg) {
                    return;
                }
                return this.asg.selected;
            },
            set: function (v) {
                if (!this.asg) {
                    return;
                }
                this.asg.selected = v;
            },
            enumerable: true,
            configurable: true
        });
        return ImageController;
    }());
    ASG.ImageController = ImageController;
    var app = angular.module('angularSuperGallery');
    app.component('asgImage', {
        controller: ['asgService', '$rootScope', '$element', '$window', '$scope', ASG.ImageController],
        templateUrl: 'views/asg-image.html',
        transclude: true,
        bindings: {
            id: '@?',
            items: '=?',
            options: '=?',
            selected: '=?'
        }
    });
})(ASG || (ASG = {}));

var ASG;
(function (ASG) {
    var InfoController = (function () {
        function InfoController(service, $scope) {
            this.service = service;
            this.$scope = $scope;
            this.type = 'info';
            this.template = 'views/asg-info.html';
        }
        InfoController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this);
        };
        Object.defineProperty(InfoController.prototype, "file", {
            get: function () {
                return this.asg.file;
            },
            enumerable: true,
            configurable: true
        });
        return InfoController;
    }());
    ASG.InfoController = InfoController;
    var app = angular.module('angularSuperGallery');
    app.component('asgInfo', {
        controller: ['asgService', '$scope', ASG.InfoController],
        template: '<div class="asg-info {{ $ctrl.asg.theme }}"><div ng-include="$ctrl.template"></div></div>',
        transclude: true,
        bindings: {
            id: '@?',
            template: '@?'
        }
    });
})(ASG || (ASG = {}));

var ASG;
(function (ASG) {
    var ModalController = (function () {
        function ModalController(service, fullscreen, $scope) {
            this.service = service;
            this.fullscreen = fullscreen;
            this.$scope = $scope;
            this.type = 'modal';
            this.arrowsVisible = false;
        }
        ModalController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this);
            this.asg.modalAvailable = true;
        };
        ModalController.prototype.getClass = function () {
            if (!this.config) {
                return;
            }
            var ngClass = [];
            if (!this.config.menu) {
                ngClass.push('nomenu');
            }
            ngClass.push(this.asg.options.theme);
            return ngClass.join(' ');
        };
        ModalController.prototype.getActionByKeyCode = function (keyCode) {
            var keys = Object.keys(this.config.keycodes);
            var action;
            for (var key in keys) {
                var codes = this.config.keycodes[keys[key]];
                if (!codes) {
                    continue;
                }
                var index = codes.indexOf(keyCode);
                if (index > -1) {
                    action = keys[key];
                    break;
                }
            }
            return action;
        };
        ModalController.prototype.close = function () {
            this.asg.modalClose();
            this.fullscreen.cancel();
        };
        ModalController.prototype.keyUp = function (e) {
            var action = this.getActionByKeyCode(e.keyCode);
            switch (action) {
                case 'exit':
                    this.close();
                    break;
                case 'playpause':
                    this.asg.autoPlayToggle();
                    break;
                case 'forward':
                    this.asg.toForward(true);
                    break;
                case 'backward':
                    this.asg.toBackward(true);
                    break;
                case 'first':
                    this.asg.toFirst(true);
                    break;
                case 'last':
                    this.asg.toLast(true);
                    break;
                case 'fullscreen':
                    this.toggleFullScreen();
                    break;
                case 'menu':
                    this.toggleMenu();
                    break;
                case 'caption':
                    this.toggleCaption();
                    break;
                case 'help':
                    this.toggleHelp();
                    break;
                case 'size':
                    this.toggleSize();
                    break;
                case 'transition':
                    this.nextTransition();
                    break;
                default:
                    console.warn('unknown keyboard action');
                    break;
            }
        };
        ModalController.prototype.nextTransition = function () {
            var idx = this.asg.transitions.indexOf(this.config.transition) + 1;
            var next = idx >= this.asg.transitions.length ? 0 : idx;
            this.config.transition = this.asg.transitions[next];
        };
        ModalController.prototype.toggleFullScreen = function () {
            if (this.fullscreen.isEnabled()) {
                this.fullscreen.cancel();
            }
            else {
                this.fullscreen.all();
            }
            this.asg.setFocus();
        };
        ModalController.prototype.setTransition = function (transition) {
            this.config.transition = transition;
            this.asg.setFocus();
        };
        ModalController.prototype.setTheme = function (theme) {
            this.asg.options.theme = theme;
            this.asg.setFocus();
        };
        ModalController.prototype.arrowsHide = function () {
            this.arrowsVisible = false;
        };
        ModalController.prototype.arrowsShow = function () {
            this.arrowsVisible = true;
        };
        ModalController.prototype.toggleHelp = function () {
            this.config.help = !this.config.help;
            this.asg.setFocus();
        };
        ModalController.prototype.toggleSize = function () {
            var index = this.asg.sizes.indexOf(this.config.size);
            index = (index + 1) >= this.asg.sizes.length ? 0 : ++index;
            this.config.size = this.asg.sizes[index];
            this.asg.log('toggle image size:', [this.config.size, index]);
        };
        ModalController.prototype.toggleMenu = function () {
            this.config.menu = !this.config.menu;
        };
        ModalController.prototype.toggleCaption = function () {
            this.config.caption = !this.config.caption;
        };
        Object.defineProperty(ModalController.prototype, "visible", {
            get: function () {
                if (!this.asg) {
                    return;
                }
                return this.asg.modalVisible;
            },
            set: function (value) {
                if (!this.asg) {
                    return;
                }
                this.asg.modalVisible = value;
                console.log('modal set visible', this.asg, this);
                this.asg.setHash();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModalController.prototype, "selected", {
            get: function () {
                if (!this.asg) {
                    return;
                }
                return this.asg.selected;
            },
            set: function (v) {
                if (!this.asg) {
                    return;
                }
                this.asg.selected = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModalController.prototype, "config", {
            get: function () {
                return this.asg.options[this.type];
            },
            set: function (value) {
                this.asg.options[this.type] = value;
            },
            enumerable: true,
            configurable: true
        });
        return ModalController;
    }());
    ASG.ModalController = ModalController;
    var app = angular.module('angularSuperGallery');
    app.component('asgModal', {
        controller: ['asgService', 'Fullscreen', '$scope', ASG.ModalController],
        templateUrl: 'views/asg-modal.html',
        bindings: {
            id: '@?',
            items: '=?',
            options: '=?',
            selected: '=?',
            visible: '=?'
        }
    });
})(ASG || (ASG = {}));

var ASG;
(function (ASG) {
    var PanelController = (function () {
        function PanelController(service, $scope) {
            this.service = service;
            this.$scope = $scope;
            this.type = 'panel';
        }
        PanelController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this);
        };
        Object.defineProperty(PanelController.prototype, "config", {
            get: function () {
                return this.asg.options[this.type];
            },
            set: function (value) {
                this.asg.options[this.type] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PanelController.prototype, "selected", {
            get: function () {
                if (!this.asg) {
                    return;
                }
                return this.asg.selected;
            },
            set: function (v) {
                if (!this.asg) {
                    return;
                }
                this.asg.selected = v;
            },
            enumerable: true,
            configurable: true
        });
        return PanelController;
    }());
    ASG.PanelController = PanelController;
    var app = angular.module('angularSuperGallery');
    app.component('asgPanel', {
        controller: ['asgService', '$scope', ASG.PanelController],
        templateUrl: 'views/asg-panel.html',
        bindings: {
            id: '@',
            items: '=?',
            options: '=?',
            selected: '=?',
            visible: '=?'
        }
    });
})(ASG || (ASG = {}));

var ASG;
(function (ASG) {
    var ServiceController = (function () {
        function ServiceController(timeout, interval, location, $rootScope) {
            this.timeout = timeout;
            this.interval = interval;
            this.location = location;
            this.$rootScope = $rootScope;
            this.slug = 'asg';
            this.files = [];
            this.modalAvailable = false;
            this.instances = {};
            this._visible = false;
            this.first = false;
            this.options = null;
            this.optionsLoaded = false;
            this.defaults = {
                debug: false,
                baseUrl: '',
                fields: {
                    source: {
                        modal: 'url',
                        panel: 'url',
                        image: 'url'
                    },
                    title: 'title',
                    description: 'description',
                    thumbnail: 'thumbnail'
                },
                autoplay: {
                    enabled: false,
                    delay: 4100
                },
                theme: 'default',
                preloadDelay: 770,
                preload: [],
                modal: {
                    title: '',
                    subtitle: '',
                    caption: true,
                    menu: true,
                    help: false,
                    transition: 'slideLR',
                    size: 'cover',
                    keycodes: {
                        exit: [27],
                        playpause: [80],
                        forward: [32, 39],
                        backward: [37],
                        first: [38, 36],
                        last: [40, 35],
                        fullscreen: [13],
                        menu: [77],
                        caption: [67],
                        help: [72],
                        size: [83],
                        transition: [84]
                    }
                },
                panel: {
                    visible: true,
                    item: {
                        class: 'col-md-3',
                        caption: false
                    },
                },
                image: {
                    transition: 'slideLR',
                    size: 'cover',
                    height: 0,
                    heightMin: 0,
                    heightAuto: {
                        initial: true,
                        onresize: false
                    }
                }
            };
            this.sizes = [
                'contain',
                'cover',
                'auto',
                'stretch'
            ];
            this.themes = [
                'default',
                'darkblue',
                'whitegold'
            ];
            this.transitions = [
                'no',
                'fadeInOut',
                'zoomIn',
                'zoomOut',
                'zoomInOut',
                'rotateLR',
                'rotateTB',
                'rotateZY',
                'slideLR',
                'slideTB',
                'flipX',
                'flipY'
            ];
            this.events = {
                CONFIG_LOAD: 'ASG-config-load-',
                AUTOPLAY_START: 'ASG-autoplay-start-',
                AUTOPLAY_STOP: 'ASG-autoplay-stop-',
                PARSE_IMAGES: 'ASG-parse-images-',
                LOAD_IMAGE: 'ASG-load-image-',
                FIRST_IMAGE: 'ASG-first-image-',
                CHANGE_IMAGE: 'ASG-change-image-',
                MODAL_OPEN: 'ASG-modal-open-',
                MODAL_CLOSE: 'ASG-modal-close-',
            };
        }
        ServiceController.prototype.parseHash = function () {
            var _this = this;
            if (!this.id) {
                return;
            }
            var hash = this.location.hash();
            var parts = hash ? hash.split('-') : null;
            if (parts === null) {
                return;
            }
            if (parts[0] !== this.slug) {
                return;
            }
            if (parts.length !== 3) {
                return;
            }
            if (parts[1] !== this.id) {
                return;
            }
            var index = parseInt(parts[2], 10);
            if (!angular.isNumber(index)) {
                return;
            }
            this.timeout(function () {
                index--;
                _this.selected = index;
                _this.modalOpen(index);
            }, 20);
        };
        ServiceController.prototype.objectHashId = function (object) {
            var string = JSON.stringify(object);
            var abc = string.replace(/[^a-zA-Z0-9]+/g, '');
            var code = 0;
            for (var i = 0, n = abc.length; i < n; i++) {
                var charcode = abc.charCodeAt(i);
                code += (charcode * i);
            }
            return code.toString(21);
        };
        ServiceController.prototype.getInstance = function (component) {
            if (!component.id) {
                if (component.$scope && component.$scope.$parent && component.$scope.$parent.$parent && component.$scope.$parent.$parent.$ctrl) {
                    component.id = component.$scope.$parent.$parent.$ctrl.id;
                }
                else {
                    component.id = this.objectHashId(component.options);
                }
            }
            var id = component.id;
            var instance = this.instances[id];
            if (instance === undefined) {
                instance = new ServiceController(this.timeout, this.interval, this.location, this.$rootScope);
                instance.id = id;
            }
            instance.setOptions(component.options);
            instance.setItems(component.items);
            instance.selected = component.selected ? component.selected : 0;
            instance.parseHash();
            if (instance.options) {
                instance.loadImages(instance.options.preload);
                if (instance.options.autoplay && instance.options.autoplay.enabled && !instance.autoplay) {
                    instance.autoPlayStart();
                }
            }
            this.instances[id] = instance;
            return instance;
        };
        ServiceController.prototype.setItems = function (items) {
            if (!items) {
                return;
            }
            if (this.items) {
                return;
            }
            if (angular.isString(items[0]) === true) {
                this.items = [];
                for (var i = 0; i < items.length; i++) {
                    this.items.push({ source: { modal: items[i] } });
                }
            }
            else {
                this.items = items;
            }
            this.prepareItems();
        };
        ServiceController.prototype.setOptions = function (options) {
            if (this.optionsLoaded) {
                return;
            }
            if (options) {
                this.options = angular.merge(this.defaults, options);
                this.optionsLoaded = true;
            }
            else {
                this.options = this.defaults;
            }
            options = this.options;
            this.event(this.events.CONFIG_LOAD, this.options);
            return this.options;
        };
        Object.defineProperty(ServiceController.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (v) {
                v = this.normalize(v);
                if (v !== this._selected) {
                    this.event(this.events.CHANGE_IMAGE, { index: v, file: this.file });
                }
                this._selected = v;
                this.preload();
            },
            enumerable: true,
            configurable: true
        });
        ServiceController.prototype.setSelected = function (index) {
            this.autoPlayStop();
            this.direction = index > this.selected ? 'forward' : 'backward';
            this.selected = index;
        };
        ServiceController.prototype.toBackward = function (stop, $event) {
            if ($event) {
                $event.stopPropagation();
            }
            if (stop) {
                this.autoPlayStop();
            }
            this.direction = 'backward';
            this.selected--;
            this.loadImage(this.selected - 1);
            this.setHash();
            this.setFocus();
        };
        ServiceController.prototype.toForward = function (stop, $event) {
            if ($event) {
                $event.stopPropagation();
            }
            if (stop) {
                this.autoPlayStop();
            }
            this.direction = 'forward';
            this.selected++;
            this.loadImage(this.selected + 1);
            this.setHash();
            this.setFocus();
        };
        ServiceController.prototype.toFirst = function (stop) {
            if (stop) {
                this.autoPlayStop();
            }
            this.direction = 'backward';
            this.selected = 0;
            this.setHash();
        };
        ServiceController.prototype.toLast = function (stop) {
            if (stop) {
                this.autoPlayStop();
            }
            this.direction = 'forward';
            this.selected = this.items.length - 1;
            this.setHash();
        };
        ServiceController.prototype.setHash = function () {
            if (this.modalVisible) {
                this.location.hash([this.slug, this.id, this.selected + 1].join('-'));
            }
        };
        ServiceController.prototype.autoPlayToggle = function () {
            if (this.options.autoplay.enabled) {
                this.autoPlayStop();
            }
            else {
                this.autoPlayStart();
            }
        };
        ServiceController.prototype.autoPlayStop = function () {
            if (!this.autoplay) {
                return;
            }
            this.interval.cancel(this.autoplay);
            this.options.autoplay.enabled = false;
            this.autoplay = null;
            this.event(this.events.AUTOPLAY_STOP, { index: this.selected, file: this.file });
        };
        ServiceController.prototype.autoPlayStart = function () {
            var _this = this;
            if (this.autoplay) {
                return;
            }
            this.options.autoplay.enabled = true;
            this.autoplay = this.interval(function () {
                _this.toForward();
            }, this.options.autoplay.delay);
            this.event(this.events.AUTOPLAY_START, { index: this.selected, file: this.file });
        };
        ServiceController.prototype.prepareItems = function () {
            var self = this;
            var getAvailableSource = function (type, source) {
                if (source[type]) {
                    return source[type];
                }
                if (type === 'panel') {
                    return getAvailableSource('image', source);
                }
                if (type === 'image') {
                    return getAvailableSource('modal', source);
                }
                if (type === 'modal') {
                    return getAvailableSource('image', source);
                }
            };
            angular.forEach(this.items, function (value, key) {
                if (!value.source) {
                    value.source = {
                        modal: value[self.options.fields.source.modal],
                        panel: value[self.options.fields.source.panel],
                        image: value[self.options.fields.source.image],
                    };
                }
                var source = {
                    modal: self.options.baseUrl + getAvailableSource('modal', value.source),
                    panel: self.options.baseUrl + getAvailableSource('panel', value.source),
                    image: self.options.baseUrl + getAvailableSource('image', value.source),
                };
                var parts = source.modal.split('/');
                var filename = parts[parts.length - 1];
                var title, description;
                if (self.options.fields !== undefined) {
                    title = value[self.options.fields.title] ? value[self.options.fields.title] : filename;
                }
                else {
                    title = filename;
                }
                if (self.options.fields !== undefined) {
                    description = value[self.options.fields.description] ? value[self.options.fields.description] : null;
                }
                else {
                    description = null;
                }
                var file = {
                    source: source,
                    title: title,
                    description: description,
                    loaded: {
                        modal: false,
                        panel: false,
                        image: false
                    }
                };
                self.files.push(file);
            });
            this.event(this.events.PARSE_IMAGES, this.files);
        };
        ServiceController.prototype.hoverPreload = function (index) {
            this.loadImage(index);
        };
        ServiceController.prototype.preload = function (wait) {
            var _this = this;
            this.loadImage(this.selected);
            this.timeout(function () {
                _this.loadImage(_this.selected + 1);
            }, (wait !== undefined) ? wait : this.options.preloadDelay);
        };
        ServiceController.prototype.normalize = function (index) {
            var last = this.files.length - 1;
            if (index > last) {
                return (index - last) - 1;
            }
            if (index < 0) {
                return last - Math.abs(index) + 1;
            }
            return index;
        };
        ServiceController.prototype.loadImages = function (indexes, type) {
            if (!indexes) {
                return;
            }
            var self = this;
            indexes.forEach(function (index) {
                self.loadImage(index);
            });
        };
        ServiceController.prototype.loadImage = function (index, callback) {
            var _this = this;
            index = index ? index : this.selected;
            index = this.normalize(index);
            if (!this.files[index]) {
                this.log('invalid file index', { index: index });
                return;
            }
            if (this.files[index].loaded.modal) {
                return;
            }
            var image = new Image();
            image.src = this.files[index].source.image;
            image.addEventListener('load', function () {
                _this.afterLoad(index, 'image', image);
            });
            var modal = new Image();
            modal.src = this.files[index].source.modal;
            modal.addEventListener('load', function (event) {
                _this.afterLoad(index, 'modal', modal);
            });
        };
        ServiceController.prototype.getFilename = function (index, type) {
            type = type ? type : 'modal';
            var fileparts = this.files[index].source[type].split('/');
            var filename = fileparts[fileparts.length - 1];
            return filename;
        };
        ServiceController.prototype.getExtension = function (index, type) {
            type = type ? type : 'modal';
            var fileparts = this.files[index].source[type].split('.');
            var extension = fileparts[fileparts.length - 1];
            return extension;
        };
        ServiceController.prototype.afterLoad = function (index, type, image) {
            if (this.files[index].loaded[type] === true) {
                return;
            }
            this.files[index].loaded[type] = true;
            if (type === 'modal') {
                this.files[index].width = image.width;
                this.files[index].height = image.height;
                this.files[index].name = this.getFilename(index, type);
                this.files[index].extension = this.getExtension(index, type);
                this.files[index].download = this.files[index].source.modal;
            }
            var data = { type: type, index: index, file: this.file, img: image };
            if (!this.first) {
                this.first = true;
                this.event(this.events.FIRST_IMAGE, data);
            }
            this.event(this.events.LOAD_IMAGE, data);
        };
        Object.defineProperty(ServiceController.prototype, "isSingle", {
            get: function () {
                return this.files.length > 1 ? false : true;
            },
            enumerable: true,
            configurable: true
        });
        ServiceController.prototype.downloadLink = function () {
            if (this.selected !== undefined && this.files.length > 0) {
                return this.files[this.selected].source.modal;
            }
        };
        Object.defineProperty(ServiceController.prototype, "file", {
            get: function () {
                return this.files[this.selected];
            },
            enumerable: true,
            configurable: true
        });
        ServiceController.prototype.toggle = function (element) {
            this.options[element].visible = !this.options[element].visible;
        };
        Object.defineProperty(ServiceController.prototype, "modalVisible", {
            get: function () {
                return this._visible;
            },
            set: function (value) {
                this._visible = value;
                if (value) {
                    this.preload(1);
                    this.modalInit();
                    this.el('body').addClass('yhidden');
                }
                else {
                    this.el('body').removeClass('yhidden');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServiceController.prototype, "theme", {
            get: function () {
                return this.options.theme;
            },
            enumerable: true,
            configurable: true
        });
        ServiceController.prototype.setFocus = function () {
            this.el('.asg-modal.' + this.id + ' .keyInput').trigger('focus').focus();
        };
        ServiceController.prototype.modalInit = function () {
            var _this = this;
            var self = this;
            this.timeout(function () {
                var element = '.gallery-modal.' + self.id + ' li.dropdown-submenu';
                _this.el(element).off().on('click', function (event) {
                    event.stopPropagation();
                    if (this.el(this).hasClass('open')) {
                        this.el(this).removeClass('open');
                    }
                    else {
                        this.el(element).removeClass('open');
                        this.el(this).addClass('open');
                    }
                });
                self.setFocus();
            }, 100);
        };
        ServiceController.prototype.modalOpen = function (index) {
            if (!this.modalAvailable) {
                return;
            }
            this.selected = index ? index : this.selected;
            this.modalVisible = true;
            this.setHash();
            this.event(this.events.MODAL_OPEN, { index: this.selected });
        };
        ServiceController.prototype.modalClose = function () {
            this.location.hash('');
            this.modalVisible = false;
            this.event(this.events.MODAL_CLOSE, { index: this.selected });
        };
        ServiceController.prototype.event = function (event, data) {
            event = event + this.id;
            this.$rootScope.$emit(event, data);
            this.log(event, data);
        };
        ServiceController.prototype.log = function (event, data) {
            if (this.options.debug) {
                console.log(event, data ? data : null);
            }
        };
        ServiceController.prototype.el = function (selector) {
            return angular.element(selector);
        };
        return ServiceController;
    }());
    ASG.ServiceController = ServiceController;
    var app = angular.module('angularSuperGallery');
    app.service('asgService', ['$timeout', '$interval', '$location', '$rootScope', ServiceController]);
})(ASG || (ASG = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzZy50cyIsImFzZy1jb250cm9sLnRzIiwiYXNnLWltYWdlLnRzIiwiYXNnLWluZm8udHMiLCJhc2ctbW9kYWwudHMiLCJhc2ctcGFuZWwudHMiLCJhc2ctc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxJQUFVLEdBQUcsQ0EyQlo7QUEzQkQsV0FBVSxHQUFHO0lBRVosSUFBSSxHQUFHLEdBQWdCLE9BQU8sQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFcEcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDdEIsTUFBTSxDQUFDLFVBQVUsS0FBVyxFQUFFLFNBQWtCO1lBRS9DLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDWCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDWixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsU0FBUyxHQUFHLENBQUMsQ0FBQztZQUNmLENBQUM7WUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FB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SyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUV2QixDQUFDO1FBRU0sK0JBQUcsR0FBVixVQUFXLEtBQWMsRUFBRSxJQUFXO1lBRXJDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hDLENBQUM7UUFFRixDQUFDO1FBRU8sOEJBQUUsR0FBVixVQUFXLFFBQVE7WUFFbEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbEMsQ0FBQztRQUdGLHdCQUFDO0lBQUQsQ0FueEJBLEFBbXhCQyxJQUFBO0lBbnhCWSxxQkFBaUIsb0JBbXhCN0IsQ0FBQTtJQUVELElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFFN0QsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0FBRXBHLENBQUMsRUFoOUJTLEdBQUcsS0FBSCxHQUFHLFFBZzlCWiIsImZpbGUiOiJhbmd1bGFyLXN1cGVyLWdhbGxlcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5uYW1lc3BhY2UgQVNHIHtcclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScsIFsnbmdBbmltYXRlJywgJ0ZCQW5ndWxhcicsICduZ1RvdWNoJ10pO1xyXG5cclxuXHRhcHAuZmlsdGVyKCdhc2dCeXRlcycsICgpID0+IHtcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoYnl0ZXMgOiBhbnksIHByZWNpc2lvbiA6IG51bWJlcikgOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0aWYgKGlzTmFOKHBhcnNlRmxvYXQoYnl0ZXMpKSB8fCAhaXNGaW5pdGUoYnl0ZXMpKSB7XHJcblx0XHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoYnl0ZXMgPT09IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gJzAnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodHlwZW9mIHByZWNpc2lvbiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRwcmVjaXNpb24gPSAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgdW5pdHMgPSBbJ2J5dGVzJywgJ2tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJ10sXHJcblx0XHRcdFx0bnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZygxMDI0KSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gKGJ5dGVzIC8gTWF0aC5wb3coMTAyNCwgTWF0aC5mbG9vcihudW1iZXIpKSkudG9GaXhlZChwcmVjaXNpb24pICsgJyAnICsgdW5pdHNbbnVtYmVyXTtcclxuXHJcblx0XHR9O1xyXG5cdH0pO1xyXG5cclxufVxyXG5cclxuIiwibmFtZXNwYWNlIEFTRyB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBDb250cm9sQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ2NvbnRyb2wnO1xyXG5cdFx0cHJpdmF0ZSBhc2cgOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlID0gJ3ZpZXdzL2FzZy1jb250cm9sLmh0bWwnO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0XHR0aGlzLiRzY29wZS5mb3J3YXJkID0gKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZCh0cnVlKTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHRoaXMuJHNjb3BlLmJhY2t3YXJkID0gKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQodHJ1ZSk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zSW1hZ2UpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0NvbnRyb2wnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgQVNHLkNvbnRyb2xDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImFzZy1jb250cm9sIHt7ICRjdHJsLmFzZy50aGVtZSB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIEFTRyB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBJbWFnZUNvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZCA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRwdWJsaWMgaXRlbXMgOiBBcnJheTxJRmlsZT47XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ2ltYWdlJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHJvb3RTY29wZSA6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkZWxlbWVudCA6IG5nLklSb290RWxlbWVudFNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICR3aW5kb3cgOiBuZy5JV2luZG93U2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCgncmVzaXplJywgKGV2ZW50KSA9PiB7XHJcblx0XHRcdFx0dGhpcy5vblJlc2l6ZSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBvblJlc2l6ZSgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5oZWlnaHRBdXRvLm9ucmVzaXplKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRIZWlnaHQodGhpcy5hc2cuZmlsZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHRcdC8vIHNldCBpbWFnZSBjb21wb25lbnQgaGVpZ2h0XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kb24odGhpcy5hc2cuZXZlbnRzLkZJUlNUX0lNQUdFICsgdGhpcy5pZCwgKGV2ZW50LCBkYXRhKSA9PiB7XHJcblxyXG5cdFx0XHRcdGlmICghdGhpcy5jb25maWcuaGVpZ2h0ICYmIHRoaXMuY29uZmlnLmhlaWdodEF1dG8uaW5pdGlhbCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRIZWlnaHQoZGF0YS5pbWcpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29tcG9uZW50IGhlaWdodFxyXG5cdFx0cHJpdmF0ZSBzZXRIZWlnaHQoaW1nKSB7XHJcblxyXG5cdFx0XHRsZXQgd2lkdGggPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCdkaXYnKS53aWR0aCgpO1xyXG5cdFx0XHRsZXQgcmF0aW8gPSBpbWcud2lkdGggLyBpbWcuaGVpZ2h0O1xyXG5cdFx0XHR0aGlzLmNvbmZpZy5oZWlnaHQgPSB3aWR0aCAvIHJhdGlvO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBoZWlnaHRcclxuXHRcdHB1YmxpYyBnZXQgaGVpZ2h0KCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLmhlaWdodDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCBpbWFnZSBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBpbWFnZSBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNJbWFnZSkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dJbWFnZScsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckcm9vdFNjb3BlJywgJyRlbGVtZW50JywgJyR3aW5kb3cnLCAnJHNjb3BlJywgQVNHLkltYWdlQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FzZy1pbWFnZS5odG1sJyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgQVNHIHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIEluZm9Db250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIHR5cGUgPSAnaW5mbyc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgdGVtcGxhdGUgPSAndmlld3MvYXNnLWluZm8uaHRtbCc7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkc2NvcGUgOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGdldCBmaWxlKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuZmlsZTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0luZm8nLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgQVNHLkluZm9Db250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImFzZy1pbmZvIHt7ICRjdHJsLmFzZy50aGVtZSB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIEFTRyB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBNb2RhbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZCA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRwdWJsaWMgaXRlbXMgOiBBcnJheTxJRmlsZT47XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ21vZGFsJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSBhcnJvd3NWaXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSBmdWxsc2NyZWVuLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkc2NvcGUgOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQXZhaWxhYmxlID0gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgZ2V0Q2xhc3MoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuY29uZmlnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgbmdDbGFzcyA9IFtdO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmNvbmZpZy5tZW51KSB7XHJcblx0XHRcdFx0bmdDbGFzcy5wdXNoKCdub21lbnUnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bmdDbGFzcy5wdXNoKHRoaXMuYXNnLm9wdGlvbnMudGhlbWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIG5nQ2xhc3Muam9pbignICcpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgYWN0aW9uIGZyb20ga2V5Y29kZXNcclxuXHRcdHByaXZhdGUgZ2V0QWN0aW9uQnlLZXlDb2RlKGtleUNvZGUgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGxldCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5jb25maWcua2V5Y29kZXMpO1xyXG5cdFx0XHRsZXQgYWN0aW9uO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQga2V5IGluIGtleXMpIHtcclxuXHJcblx0XHRcdFx0bGV0IGNvZGVzID0gdGhpcy5jb25maWcua2V5Y29kZXNba2V5c1trZXldXTtcclxuXHJcblx0XHRcdFx0aWYgKCFjb2Rlcykge1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgaW5kZXggPSBjb2Rlcy5pbmRleE9mKGtleUNvZGUpO1xyXG5cclxuXHRcdFx0XHRpZiAoaW5kZXggPiAtMSkge1xyXG5cdFx0XHRcdFx0YWN0aW9uID0ga2V5c1trZXldO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGFjdGlvbjtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBjbG9zZSgpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xvc2UoKTtcclxuXHRcdFx0dGhpcy5mdWxsc2NyZWVuLmNhbmNlbCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBkbyBrZXlib2FyZCBhY3Rpb25cclxuXHRcdHB1YmxpYyBrZXlVcChlIDogS2V5Ym9hcmRFdmVudCkge1xyXG5cclxuXHRcdFx0bGV0IGFjdGlvbiA6IHN0cmluZyA9IHRoaXMuZ2V0QWN0aW9uQnlLZXlDb2RlKGUua2V5Q29kZSk7XHJcblxyXG5cdFx0XHRzd2l0Y2ggKGFjdGlvbikge1xyXG5cclxuXHRcdFx0XHRjYXNlICdleGl0JzpcclxuXHRcdFx0XHRcdHRoaXMuY2xvc2UoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdwbGF5cGF1c2UnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cuYXV0b1BsYXlUb2dnbGUoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdmb3J3YXJkJzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdiYWNrd2FyZCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2ZpcnN0JzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvRmlyc3QodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnbGFzdCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0xhc3QodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnZnVsbHNjcmVlbic6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUZ1bGxTY3JlZW4oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdtZW51JzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTWVudSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2NhcHRpb24nOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVDYXB0aW9uKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnaGVscCc6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUhlbHAoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdzaXplJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlU2l6ZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3RyYW5zaXRpb24nOlxyXG5cdFx0XHRcdFx0dGhpcy5uZXh0VHJhbnNpdGlvbigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oJ3Vua25vd24ga2V5Ym9hcmQgYWN0aW9uJyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHN3aXRjaCB0byBuZXh0IHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRwcml2YXRlIG5leHRUcmFuc2l0aW9uKCkge1xyXG5cclxuXHRcdFx0bGV0IGlkeCA9IHRoaXMuYXNnLnRyYW5zaXRpb25zLmluZGV4T2YodGhpcy5jb25maWcudHJhbnNpdGlvbikgKyAxO1xyXG5cdFx0XHRsZXQgbmV4dCA9IGlkeCA+PSB0aGlzLmFzZy50cmFuc2l0aW9ucy5sZW5ndGggPyAwIDogaWR4O1xyXG5cdFx0XHR0aGlzLmNvbmZpZy50cmFuc2l0aW9uID0gdGhpcy5hc2cudHJhbnNpdGlvbnNbbmV4dF07XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyB0b2dnbGUgZnVsbHNjcmVlblxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVGdWxsU2NyZWVuKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuZnVsbHNjcmVlbi5pc0VuYWJsZWQoKSkge1xyXG5cdFx0XHRcdHRoaXMuZnVsbHNjcmVlbi5jYW5jZWwoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmZ1bGxzY3JlZW4uYWxsKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHVibGljIHNldFRyYW5zaXRpb24odHJhbnNpdGlvbikge1xyXG5cclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGVtZVxyXG5cdFx0cHVibGljIHNldFRoZW1lKHRoZW1lIDogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zLnRoZW1lID0gdGhlbWU7XHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG92ZXJsYXkgYXJyb3dzIGhpZGVcclxuXHRcdHB1YmxpYyBhcnJvd3NIaWRlKCkge1xyXG5cclxuXHRcdFx0dGhpcy5hcnJvd3NWaXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG92ZXJsYXkgYXJyb3dzIHNob3dcclxuXHRcdHB1YmxpYyBhcnJvd3NTaG93KCkge1xyXG5cclxuXHRcdFx0dGhpcy5hcnJvd3NWaXNpYmxlID0gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGhlbHBcclxuXHRcdHByaXZhdGUgdG9nZ2xlSGVscCgpIHtcclxuXHJcblx0XHRcdHRoaXMuY29uZmlnLmhlbHAgPSAhdGhpcy5jb25maWcuaGVscDtcclxuXHRcdFx0dGhpcy5hc2cuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIHNpemVcclxuXHRcdHByaXZhdGUgdG9nZ2xlU2l6ZSgpIHtcclxuXHJcblx0XHRcdGxldCBpbmRleCA9IHRoaXMuYXNnLnNpemVzLmluZGV4T2YodGhpcy5jb25maWcuc2l6ZSk7XHJcblx0XHRcdGluZGV4ID0gKGluZGV4ICsgMSkgPj0gdGhpcy5hc2cuc2l6ZXMubGVuZ3RoID8gMCA6ICsraW5kZXg7XHJcblx0XHRcdHRoaXMuY29uZmlnLnNpemUgPSB0aGlzLmFzZy5zaXplc1tpbmRleF07XHJcblx0XHRcdHRoaXMuYXNnLmxvZygndG9nZ2xlIGltYWdlIHNpemU6JywgW3RoaXMuY29uZmlnLnNpemUsIGluZGV4XSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBtZW51XHJcblx0XHRwcml2YXRlIHRvZ2dsZU1lbnUoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmNvbmZpZy5tZW51ID0gIXRoaXMuY29uZmlnLm1lbnU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBjYXB0aW9uXHJcblx0XHRwcml2YXRlIHRvZ2dsZUNhcHRpb24oKSB7XHJcblxyXG5cdFx0XHR0aGlzLmNvbmZpZy5jYXB0aW9uID0gIXRoaXMuY29uZmlnLmNhcHRpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtb2RhbCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgZ2V0IHZpc2libGUoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cubW9kYWxWaXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgbW9kYWwgdmlzaWJsZVxyXG5cdFx0cHVibGljIHNldCB2aXNpYmxlKHZhbHVlIDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxWaXNpYmxlID0gdmFsdWU7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdtb2RhbCBzZXQgdmlzaWJsZScsIHRoaXMuYXNnLCB0aGlzKTtcclxuXHRcdFx0dGhpcy5hc2cuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtb2RhbCBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc01vZGFsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBtb2RhbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNNb2RhbCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ01vZGFsJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJ0Z1bGxzY3JlZW4nLCAnJHNjb3BlJywgQVNHLk1vZGFsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FzZy1tb2RhbC5odG1sJyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIEFTRyB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBQYW5lbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZCA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRwdWJsaWMgaXRlbXMgOiBBcnJheTxJRmlsZT47XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ3BhbmVsJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBwYW5lbCBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc1BhbmVsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBwYW5lbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNQYW5lbCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dQYW5lbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCBBU0cuUGFuZWxDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLXBhbmVsLmh0bWwnLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAJyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR2aXNpYmxlOiAnPT8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBBU0cge1xyXG5cclxuXHQvLyBtb2RhbCBjb21wb25lbnQgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNNb2RhbCB7XHJcblxyXG5cdFx0bWVudT8gOiBib29sZWFuO1xyXG5cdFx0aGVscD8gOiBib29sZWFuO1xyXG5cdFx0Y2FwdGlvbj8gOiBib29sZWFuO1xyXG5cdFx0dHJhbnNpdGlvbj8gOiBzdHJpbmc7XHJcblx0XHR0aXRsZT8gOiBzdHJpbmc7XHJcblx0XHRzdWJ0aXRsZT8gOiBzdHJpbmc7XHJcblx0XHRzaXplPyA6IHN0cmluZztcclxuXHRcdGtleWNvZGVzPyA6IHtcclxuXHRcdFx0ZXhpdD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRwbGF5cGF1c2U/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0Zm9yd2FyZD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRiYWNrd2FyZD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRmaXJzdD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRsYXN0PyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGZ1bGxzY3JlZW4/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0bWVudT8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRjYXB0aW9uPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGhlbHA/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0c2l6ZT8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHR0cmFuc2l0aW9uPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Ly8gcGFuZWwgY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zUGFuZWwge1xyXG5cclxuXHRcdHZpc2libGU/IDogYm9vbGVhbjtcclxuXHRcdGl0ZW0/IDoge1xyXG5cdFx0XHRjbGFzcz8gOiBzdHJpbmc7XHJcblx0XHRcdGNhcHRpb24gOiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHQvLyBpbmZvIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0luZm8ge1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHR0cmFuc2l0aW9uPyA6IHN0cmluZztcclxuXHRcdHNpemU/IDogc3RyaW5nO1xyXG5cdFx0aGVpZ2h0PyA6IG51bWJlcjtcclxuXHRcdGhlaWdodE1pbj8gOiBudW1iZXI7XHJcblx0XHRoZWlnaHRBdXRvPyA6IHtcclxuXHRcdFx0aW5pdGlhbD8gOiBib29sZWFuLFxyXG5cdFx0XHRvbnJlc2l6ZT8gOiBib29sZWFuXHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGdhbGxlcnkgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xyXG5cclxuXHRcdGRlYnVnPyA6IGJvb2xlYW47XHJcblx0XHRiYXNlVXJsPyA6IHN0cmluZztcclxuXHRcdGZpZWxkcz8gOiB7XHJcblx0XHRcdHNvdXJjZT8gOiB7XHJcblx0XHRcdFx0bW9kYWw/IDogc3RyaW5nO1xyXG5cdFx0XHRcdHBhbmVsPyA6IHN0cmluZztcclxuXHRcdFx0XHRpbWFnZT8gOiBzdHJpbmc7XHJcblx0XHRcdH1cclxuXHRcdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0XHRkZXNjcmlwdGlvbj8gOiBzdHJpbmc7XHJcblx0XHRcdHRodW1ibmFpbD8gOiBzdHJpbmc7XHJcblx0XHR9O1xyXG5cdFx0YXV0b3BsYXk/IDoge1xyXG5cdFx0XHRlbmFibGVkPyA6IGJvb2xlYW47XHJcblx0XHRcdGRlbGF5PyA6IG51bWJlcjtcclxuXHRcdH07XHJcblx0XHR0aGVtZT8gOiBzdHJpbmc7XHJcblx0XHRwcmVsb2FkRGVsYXk/IDogbnVtYmVyO1xyXG5cdFx0cHJlbG9hZD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0bW9kYWw/IDogSU9wdGlvbnNNb2RhbDtcclxuXHRcdHBhbmVsPyA6IElPcHRpb25zUGFuZWw7XHJcblx0XHRpbWFnZT8gOiBJT3B0aW9uc0ltYWdlO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIHNvdXJjZVxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVNvdXJjZSB7XHJcblxyXG5cdFx0bW9kYWwgOiBzdHJpbmc7IC8vIG9yaWdpbmFsLCByZXF1aXJlZFxyXG5cdFx0cGFuZWw/IDogc3RyaW5nO1xyXG5cdFx0aW1hZ2U/IDogc3RyaW5nO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGZpbGVcclxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWxlIHtcclxuXHJcblx0XHRzb3VyY2UgOiBJU291cmNlO1xyXG5cdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0bmFtZT8gOiBzdHJpbmc7XHJcblx0XHRleHRlbnNpb24/IDogc3RyaW5nO1xyXG5cdFx0ZGVzY3JpcHRpb24/IDogc3RyaW5nO1xyXG5cdFx0ZG93bmxvYWQ/IDogc3RyaW5nO1xyXG5cdFx0bG9hZGVkPyA6IHtcclxuXHRcdFx0bW9kYWw/IDogYm9vbGVhbjtcclxuXHRcdFx0cGFuZWw/IDogYm9vbGVhbjtcclxuXHRcdFx0aW1hZ2U/IDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHR3aWR0aD8gOiBudW1iZXI7XHJcblx0XHRoZWlnaHQ/IDogbnVtYmVyO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIHNlcnZpY2UgY29udHJvbGxlciBpbnRlcmZhY2VcclxuXHRleHBvcnQgaW50ZXJmYWNlIElTZXJ2aWNlQ29udHJvbGxlciB7XHJcblxyXG5cdFx0bW9kYWxWaXNpYmxlIDogYm9vbGVhbjtcclxuXHRcdHBhbmVsVmlzaWJsZSA6IGJvb2xlYW47XHJcblx0XHRtb2RhbEF2YWlsYWJsZSA6IGJvb2xlYW47XHJcblx0XHR0cmFuc2l0aW9ucyA6IEFycmF5PHN0cmluZz47XHJcblx0XHR0aGVtZXMgOiBBcnJheTxzdHJpbmc+O1xyXG5cdFx0b3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0aXRlbXMgOiBBcnJheTxJRmlsZT47XHJcblx0XHRzZWxlY3RlZCA6IG51bWJlcjtcclxuXHRcdGZpbGUgOiBJRmlsZTtcclxuXHRcdHNpemVzIDogQXJyYXk8c3RyaW5nPjtcclxuXHRcdGV2ZW50cyA6IHtcclxuXHRcdFx0Q09ORklHX0xPQUQgOiBzdHJpbmc7XHJcblx0XHRcdEFVVE9QTEFZX1NUQVJUIDogc3RyaW5nO1xyXG5cdFx0XHRBVVRPUExBWV9TVE9QIDogc3RyaW5nO1xyXG5cdFx0XHRQQVJTRV9JTUFHRVMgOiBzdHJpbmc7XHJcblx0XHRcdExPQURfSU1BR0UgOiBzdHJpbmc7XHJcblx0XHRcdEZJUlNUX0lNQUdFIDogc3RyaW5nO1xyXG5cdFx0XHRDSEFOR0VfSU1BR0UgOiBzdHJpbmc7XHJcblx0XHRcdE1PREFMX09QRU4gOiBzdHJpbmc7XHJcblx0XHRcdE1PREFMX0NMT1NFIDogc3RyaW5nO1xyXG5cdFx0fTtcclxuXHJcblx0XHRnZXRJbnN0YW5jZShjb21wb25lbnQgOiBhbnkpIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdHNldERlZmF1bHRzKCkgOiB2b2lkO1xyXG5cclxuXHRcdHNldE9wdGlvbnMob3B0aW9ucyA6IElPcHRpb25zKSA6IElPcHRpb25zO1xyXG5cclxuXHRcdHNldEl0ZW1zKGl0ZW1zIDogQXJyYXk8SUZpbGU+KSA6IHZvaWQ7XHJcblxyXG5cdFx0cHJlbG9hZCh3YWl0PyA6IG51bWJlcikgOiB2b2lkO1xyXG5cclxuXHRcdG5vcm1hbGl6ZShpbmRleCA6IG51bWJlcikgOiBudW1iZXI7XHJcblxyXG5cdFx0c2V0Rm9jdXMoKSA6IHZvaWQ7XHJcblxyXG5cdFx0bW9kYWxPcGVuKGluZGV4IDogbnVtYmVyKSA6IHZvaWQ7XHJcblxyXG5cdFx0bW9kYWxDbG9zZSgpIDogdm9pZDtcclxuXHJcblx0XHR0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cclxuXHRcdHRvRm9yd2FyZChzdG9wPyA6IGJvb2xlYW4pIDogdm9pZDtcclxuXHJcblx0XHR0b0ZpcnN0KHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cclxuXHRcdHRvTGFzdChzdG9wPyA6IGJvb2xlYW4pIDogdm9pZDtcclxuXHJcblx0XHRsb2FkSW1hZ2UoaW5kZXg/IDogbnVtYmVyKSA6IHZvaWQ7XHJcblxyXG5cdFx0bG9hZEltYWdlcyhpbmRleGVzIDogQXJyYXk8bnVtYmVyPikgOiB2b2lkO1xyXG5cclxuXHRcdGF1dG9QbGF5VG9nZ2xlKCkgOiB2b2lkO1xyXG5cclxuXHRcdHRvZ2dsZShlbGVtZW50IDogc3RyaW5nKSA6IHZvaWQ7XHJcblxyXG5cdFx0c2V0SGFzaCgpIDogdm9pZDtcclxuXHJcblx0XHRkb3dubG9hZExpbmsoKSA6IHN0cmluZztcclxuXHJcblx0XHRsb2coZXZlbnQgOiBzdHJpbmcsIGRhdGE/IDogYW55KSA6IHZvaWQ7XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdC8vIHNlcnZpY2UgY29udHJvbGxlclxyXG5cdGV4cG9ydCBjbGFzcyBTZXJ2aWNlQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIHNsdWcgPSAnYXNnJztcclxuXHRcdHB1YmxpYyBpZCA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IGFueTtcclxuXHRcdHB1YmxpYyBmaWxlcyA6IEFycmF5PElGaWxlPiA9IFtdO1xyXG5cdFx0cHVibGljIGRpcmVjdGlvbiA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBtb2RhbEF2YWlsYWJsZSA9IGZhbHNlO1xyXG5cclxuXHRcdHByaXZhdGUgaW5zdGFuY2VzIDoge30gPSB7fTtcclxuXHRcdHByaXZhdGUgX3NlbGVjdGVkIDogbnVtYmVyO1xyXG5cdFx0cHJpdmF0ZSBfdmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBhdXRvcGxheSA6IGFuZ3VsYXIuSVByb21pc2U8YW55PjtcclxuXHRcdHByaXZhdGUgZmlyc3QgPSBmYWxzZTtcclxuXHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zID0gbnVsbDtcclxuXHRcdHB1YmxpYyBvcHRpb25zTG9hZGVkID0gZmFsc2U7XHJcblxyXG5cclxuXHRcdHB1YmxpYyBkZWZhdWx0cyA6IElPcHRpb25zID0ge1xyXG5cdFx0XHRkZWJ1ZzogZmFsc2UsIC8vIGltYWdlIGxvYWQgYW5kIGF1dG9wbGF5IGluZm8gaW4gY29uc29sZS5sb2dcclxuXHRcdFx0YmFzZVVybDogJycsIC8vIHVybCBwcmVmaXhcclxuXHRcdFx0ZmllbGRzOiB7XHJcblx0XHRcdFx0c291cmNlOiB7XHJcblx0XHRcdFx0XHRtb2RhbDogJ3VybCcsIC8vIHJlcXVpcmVkLCBpbWFnZSB1cmwgZm9yIG1vZGFsIGNvbXBvbmVudCAobGFyZ2Ugc2l6ZSlcclxuXHRcdFx0XHRcdHBhbmVsOiAndXJsJywgLy8gaW1hZ2UgdXJsIGZvciBwYW5lbCBjb21wb25lbnQgKHRodW1ibmFpbCBzaXplKVxyXG5cdFx0XHRcdFx0aW1hZ2U6ICd1cmwnIC8vIGltYWdlIHVybCBmb3IgaW1hZ2UgKG1lZGl1bSBzaXplKVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dGl0bGU6ICd0aXRsZScsIC8vIHRpdGxlIGlucHV0IGZpZWxkIG5hbWVcclxuXHRcdFx0XHRkZXNjcmlwdGlvbjogJ2Rlc2NyaXB0aW9uJywgLy8gZGVzY3JpcHRpb24gaW5wdXQgZmllbGQgbmFtZVxyXG5cdFx0XHRcdHRodW1ibmFpbDogJ3RodW1ibmFpbCcgLy8gdGh1bWJuYWlsIGlucHV0IGZpZWxkIG5hbWVcclxuXHRcdFx0fSxcclxuXHRcdFx0YXV0b3BsYXk6IHtcclxuXHRcdFx0XHRlbmFibGVkOiBmYWxzZSwgLy8gc2xpZGVzaG93IHBsYXkgZW5hYmxlZC9kaXNhYmxlZFxyXG5cdFx0XHRcdGRlbGF5OiA0MTAwIC8vIGF1dG9wbGF5IGRlbGF5IGluIG1pbGxpc2Vjb25kXHJcblx0XHRcdH0sXHJcblx0XHRcdHRoZW1lOiAnZGVmYXVsdCcsIC8vIGNzcyBzdHlsZSBbZGVmYXVsdCwgZGFya2JsdWUsIHdoaXRlZ29sZF1cclxuXHRcdFx0cHJlbG9hZERlbGF5OiA3NzAsXHJcblx0XHRcdHByZWxvYWQ6IFtdLCAvLyBwcmVsb2FkIGltYWdlcyBieSBpbmRleCBudW1iZXJcclxuXHRcdFx0bW9kYWw6IHtcclxuXHRcdFx0XHR0aXRsZTogJycsIC8vIG1vZGFsIHdpbmRvdyB0aXRsZVxyXG5cdFx0XHRcdHN1YnRpdGxlOiAnJywgLy8gbW9kYWwgd2luZG93IHN1YnRpdGxlXHJcblx0XHRcdFx0Y2FwdGlvbjogdHJ1ZSwgLy8gc2hvdy9oaWRlIGltYWdlIGNhcHRpb25cclxuXHRcdFx0XHRtZW51OiB0cnVlLCAvLyBzaG93L2hpZGUgbW9kYWwgbWVudVxyXG5cdFx0XHRcdGhlbHA6IGZhbHNlLCAvLyBzaG93L2hpZGUgaGVscFxyXG5cdFx0XHRcdHRyYW5zaXRpb246ICdzbGlkZUxSJywgLy8gdHJhbnNpdGlvbiBlZmZlY3RcclxuXHRcdFx0XHRzaXplOiAnY292ZXInLCAvLyBjb250YWluLCBjb3ZlciwgYXV0bywgc3RyZXRjaFxyXG5cdFx0XHRcdGtleWNvZGVzOiB7XHJcblx0XHRcdFx0XHRleGl0OiBbMjddLCAvLyBlc2NcclxuXHRcdFx0XHRcdHBsYXlwYXVzZTogWzgwXSwgLy8gcFxyXG5cdFx0XHRcdFx0Zm9yd2FyZDogWzMyLCAzOV0sIC8vIHNwYWNlLCByaWdodCBhcnJvd1xyXG5cdFx0XHRcdFx0YmFja3dhcmQ6IFszN10sIC8vIGxlZnQgYXJyb3dcclxuXHRcdFx0XHRcdGZpcnN0OiBbMzgsIDM2XSwgLy8gdXAgYXJyb3csIGhvbWVcclxuXHRcdFx0XHRcdGxhc3Q6IFs0MCwgMzVdLCAvLyBkb3duIGFycm93LCBlbmRcclxuXHRcdFx0XHRcdGZ1bGxzY3JlZW46IFsxM10sIC8vIGVudGVyXHJcblx0XHRcdFx0XHRtZW51OiBbNzddLCAvLyBtXHJcblx0XHRcdFx0XHRjYXB0aW9uOiBbNjddLCAvLyBjXHJcblx0XHRcdFx0XHRoZWxwOiBbNzJdLCAvLyBoXHJcblx0XHRcdFx0XHRzaXplOiBbODNdLCAvLyBzXHJcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiBbODRdIC8vIHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHBhbmVsOiB7XHJcblx0XHRcdFx0dmlzaWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRpdGVtOiB7XHJcblx0XHRcdFx0XHRjbGFzczogJ2NvbC1tZC0zJywgLy8gaXRlbSBjbGFzc1xyXG5cdFx0XHRcdFx0Y2FwdGlvbjogZmFsc2VcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRpbWFnZToge1xyXG5cdFx0XHRcdHRyYW5zaXRpb246ICdzbGlkZUxSJywgLy8gdHJhbnNpdGlvbiBlZmZlY3RcclxuXHRcdFx0XHRzaXplOiAnY292ZXInLCAvLyBjb250YWluLCBjb3ZlciwgYXV0bywgc3RyZXRjaFxyXG5cdFx0XHRcdGhlaWdodDogMCwgLy8gaGVpZ2h0XHJcblx0XHRcdFx0aGVpZ2h0TWluOiAwLCAvLyBtaW4gaGVpZ2h0XHJcblx0XHRcdFx0aGVpZ2h0QXV0bzoge1xyXG5cdFx0XHRcdFx0aW5pdGlhbDogdHJ1ZSxcclxuXHRcdFx0XHRcdG9ucmVzaXplOiBmYWxzZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBhdmFpbGFibGUgaW1hZ2Ugc2l6ZXNcclxuXHRcdHB1YmxpYyBzaXplcyA6IEFycmF5PHN0cmluZz4gPSBbXHJcblx0XHRcdCdjb250YWluJyxcclxuXHRcdFx0J2NvdmVyJyxcclxuXHRcdFx0J2F1dG8nLFxyXG5cdFx0XHQnc3RyZXRjaCdcclxuXHRcdF07XHJcblxyXG5cdFx0Ly8gYXZhaWxhYmxlIHRoZW1lc1xyXG5cdFx0cHVibGljIHRoZW1lcyA6IEFycmF5PHN0cmluZz4gPSBbXHJcblx0XHRcdCdkZWZhdWx0JyxcclxuXHRcdFx0J2RhcmtibHVlJyxcclxuXHRcdFx0J3doaXRlZ29sZCdcclxuXHRcdF07XHJcblxyXG5cdFx0Ly8gYXZhaWxhYmxlIHRyYW5zaXRpb25zXHJcblx0XHRwdWJsaWMgdHJhbnNpdGlvbnMgOiBBcnJheTxzdHJpbmc+ID0gW1xyXG5cdFx0XHQnbm8nLFxyXG5cdFx0XHQnZmFkZUluT3V0JyxcclxuXHRcdFx0J3pvb21JbicsXHJcblx0XHRcdCd6b29tT3V0JyxcclxuXHRcdFx0J3pvb21Jbk91dCcsXHJcblx0XHRcdCdyb3RhdGVMUicsXHJcblx0XHRcdCdyb3RhdGVUQicsXHJcblx0XHRcdCdyb3RhdGVaWScsXHJcblx0XHRcdCdzbGlkZUxSJyxcclxuXHRcdFx0J3NsaWRlVEInLFxyXG5cdFx0XHQnZmxpcFgnLFxyXG5cdFx0XHQnZmxpcFknXHJcblx0XHRdO1xyXG5cclxuXHRcdHB1YmxpYyBldmVudHMgPSB7XHJcblx0XHRcdENPTkZJR19MT0FEOiAnQVNHLWNvbmZpZy1sb2FkLScsXHJcblx0XHRcdEFVVE9QTEFZX1NUQVJUOiAnQVNHLWF1dG9wbGF5LXN0YXJ0LScsXHJcblx0XHRcdEFVVE9QTEFZX1NUT1A6ICdBU0ctYXV0b3BsYXktc3RvcC0nLFxyXG5cdFx0XHRQQVJTRV9JTUFHRVM6ICdBU0ctcGFyc2UtaW1hZ2VzLScsXHJcblx0XHRcdExPQURfSU1BR0U6ICdBU0ctbG9hZC1pbWFnZS0nLFxyXG5cdFx0XHRGSVJTVF9JTUFHRTogJ0FTRy1maXJzdC1pbWFnZS0nLFxyXG5cdFx0XHRDSEFOR0VfSU1BR0U6ICdBU0ctY2hhbmdlLWltYWdlLScsXHJcblx0XHRcdE1PREFMX09QRU46ICdBU0ctbW9kYWwtb3Blbi0nLFxyXG5cdFx0XHRNT0RBTF9DTE9TRTogJ0FTRy1tb2RhbC1jbG9zZS0nLFxyXG5cdFx0fTtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHRpbWVvdXQgOiBuZy5JVGltZW91dFNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlIGludGVydmFsIDogbmcuSUludGVydmFsU2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgbG9jYXRpb24gOiBuZy5JTG9jYXRpb25TZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkcm9vdFNjb3BlIDogbmcuSVJvb3RTY29wZVNlcnZpY2UpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBwYXJzZUhhc2goKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuaWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBoYXNoID0gdGhpcy5sb2NhdGlvbi5oYXNoKCk7XHJcblx0XHRcdGxldCBwYXJ0cyA9IGhhc2ggPyBoYXNoLnNwbGl0KCctJykgOiBudWxsO1xyXG5cclxuXHRcdFx0aWYgKHBhcnRzID09PSBudWxsKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocGFydHNbMF0gIT09IHRoaXMuc2x1Zykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHBhcnRzLmxlbmd0aCAhPT0gMykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHBhcnRzWzFdICE9PSB0aGlzLmlkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgaW5kZXggPSBwYXJzZUludChwYXJ0c1syXSwgMTApO1xyXG5cclxuXHRcdFx0aWYgKCFhbmd1bGFyLmlzTnVtYmVyKGluZGV4KSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHJcblx0XHRcdFx0aW5kZXgtLTtcclxuXHRcdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXg7XHJcblx0XHRcdFx0dGhpcy5tb2RhbE9wZW4oaW5kZXgpO1xyXG5cclxuXHRcdFx0fSwgMjApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBjYWxjdWxhdGUgb2JqZWN0IGhhc2ggaWRcclxuXHRcdHB1YmxpYyBvYmplY3RIYXNoSWQob2JqZWN0IDogYW55KSA6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRsZXQgc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkob2JqZWN0KTtcclxuXHRcdFx0bGV0IGFiYyA9IHN0cmluZy5yZXBsYWNlKC9bXmEtekEtWjAtOV0rL2csICcnKTtcclxuXHRcdFx0bGV0IGNvZGUgPSAwO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaSA9IDAsIG4gPSBhYmMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcblx0XHRcdFx0bGV0IGNoYXJjb2RlID0gYWJjLmNoYXJDb2RlQXQoaSk7XHJcblx0XHRcdFx0Y29kZSArPSAoY2hhcmNvZGUgKiBpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGNvZGUudG9TdHJpbmcoMjEpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZSBmb3IgY3VycmVudCBnYWxsZXJ5IGJ5IGNvbXBvbmVudCBpZFxyXG5cdFx0cHVibGljIGdldEluc3RhbmNlKGNvbXBvbmVudCA6IGFueSkge1xyXG5cclxuXHRcdFx0aWYgKCFjb21wb25lbnQuaWQpIHtcclxuXHJcblx0XHRcdFx0Ly8gZ2V0IHBhcmVudCBhc2cgY29tcG9uZW50IGlkXHJcblx0XHRcdFx0aWYgKGNvbXBvbmVudC4kc2NvcGUgJiYgY29tcG9uZW50LiRzY29wZS4kcGFyZW50ICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudC4kcGFyZW50ICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudC4kcGFyZW50LiRjdHJsKSB7XHJcblx0XHRcdFx0XHRjb21wb25lbnQuaWQgPSBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQuJHBhcmVudC4kY3RybC5pZDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y29tcG9uZW50LmlkID0gdGhpcy5vYmplY3RIYXNoSWQoY29tcG9uZW50Lm9wdGlvbnMpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IGlkID0gY29tcG9uZW50LmlkO1xyXG5cdFx0XHRsZXQgaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1tpZF07XHJcblxyXG5cdFx0XHQvLyBuZXcgaW5zdGFuY2UgYW5kIHNldCBvcHRpb25zIGFuZCBpdGVtc1xyXG5cdFx0XHRpZiAoaW5zdGFuY2UgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGluc3RhbmNlID0gbmV3IFNlcnZpY2VDb250cm9sbGVyKHRoaXMudGltZW91dCwgdGhpcy5pbnRlcnZhbCwgdGhpcy5sb2NhdGlvbiwgdGhpcy4kcm9vdFNjb3BlKTtcclxuXHRcdFx0XHRpbnN0YW5jZS5pZCA9IGlkO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpbnN0YW5jZS5zZXRPcHRpb25zKGNvbXBvbmVudC5vcHRpb25zKTtcclxuXHRcdFx0aW5zdGFuY2Uuc2V0SXRlbXMoY29tcG9uZW50Lml0ZW1zKTtcclxuXHRcdFx0aW5zdGFuY2Uuc2VsZWN0ZWQgPSBjb21wb25lbnQuc2VsZWN0ZWQgPyBjb21wb25lbnQuc2VsZWN0ZWQgOiAwO1xyXG5cdFx0XHRpbnN0YW5jZS5wYXJzZUhhc2goKTtcclxuXHJcblx0XHRcdGlmIChpbnN0YW5jZS5vcHRpb25zKSB7XHJcblxyXG5cdFx0XHRcdGluc3RhbmNlLmxvYWRJbWFnZXMoaW5zdGFuY2Uub3B0aW9ucy5wcmVsb2FkKTtcclxuXHJcblx0XHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMuYXV0b3BsYXkgJiYgaW5zdGFuY2Uub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkICYmICFpbnN0YW5jZS5hdXRvcGxheSkge1xyXG5cdFx0XHRcdFx0aW5zdGFuY2UuYXV0b1BsYXlTdGFydCgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuaW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xyXG5cdFx0XHRyZXR1cm4gaW5zdGFuY2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHByZXBhcmUgaW1hZ2VzIGFycmF5XHJcblx0XHRwdWJsaWMgc2V0SXRlbXMoaXRlbXMgOiBBcnJheTxJRmlsZT4pIHtcclxuXHJcblx0XHRcdGlmICghaXRlbXMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGlmIGFscmVhZHlcclxuXHRcdFx0aWYgKHRoaXMuaXRlbXMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHBhcnNlIGFycmF5IHN0cmluZyBlbGVtZW50c1xyXG5cdFx0XHRpZiAoYW5ndWxhci5pc1N0cmluZyhpdGVtc1swXSkgPT09IHRydWUpIHtcclxuXHJcblx0XHRcdFx0dGhpcy5pdGVtcyA9IFtdO1xyXG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdHRoaXMuaXRlbXMucHVzaCh7c291cmNlOiB7bW9kYWw6IGl0ZW1zW2ldfX0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdHRoaXMuaXRlbXMgPSBpdGVtcztcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMucHJlcGFyZUl0ZW1zKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG9wdGlvbnMgc2V0dXBcclxuXHRcdHB1YmxpYyBzZXRPcHRpb25zKG9wdGlvbnMgOiBJT3B0aW9ucykge1xyXG5cclxuXHRcdFx0Ly8gaWYgb3B0aW9ucyBhbHJlYWR5IHNldHVwXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnNMb2FkZWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChvcHRpb25zKSB7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25zID0gYW5ndWxhci5tZXJnZSh0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnNMb2FkZWQgPSB0cnVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMub3B0aW9ucyA9IHRoaXMuZGVmYXVsdHM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGltcG9ydGFudCFcclxuXHRcdFx0b3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQ09ORklHX0xPQUQsIHRoaXMub3B0aW9ucyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0diA9IHRoaXMubm9ybWFsaXplKHYpO1xyXG5cclxuXHRcdFx0aWYgKHYgIT09IHRoaXMuX3NlbGVjdGVkKSB7XHJcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5DSEFOR0VfSU1BR0UsIHtpbmRleDogdiwgZmlsZTogdGhpcy5maWxlfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX3NlbGVjdGVkID0gdjtcclxuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLl9zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBzZXRTZWxlY3RlZChpbmRleCA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSBpbmRleCA+IHRoaXMuc2VsZWN0ZWQgPyAnZm9yd2FyZCcgOiAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXg7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnbyB0byBiYWNrd2FyZFxyXG5cdFx0cHVibGljIHRvQmFja3dhcmQoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKCRldmVudCkge1xyXG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHN0b3ApIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQtLTtcclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCAtIDEpO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHRcdFx0dGhpcy5zZXRGb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBmb3J3YXJkXHJcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICgkZXZlbnQpIHtcclxuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChzdG9wKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQrKztcclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCArIDEpO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHRcdFx0dGhpcy5zZXRGb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBmaXJzdFxyXG5cdFx0cHVibGljIHRvRmlyc3Qoc3RvcD8gOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoc3RvcCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2JhY2t3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IDA7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBsYXN0XHJcblx0XHRwdWJsaWMgdG9MYXN0KHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0aWYgKHN0b3ApIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdmb3J3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IHRoaXMuaXRlbXMubGVuZ3RoIC0gMTtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBzZXRIYXNoKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubW9kYWxWaXNpYmxlKSB7XHJcblx0XHRcdFx0dGhpcy5sb2NhdGlvbi5oYXNoKFt0aGlzLnNsdWcsIHRoaXMuaWQsIHRoaXMuc2VsZWN0ZWQgKyAxXS5qb2luKCctJykpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBhdXRvUGxheVRvZ2dsZSgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0YXJ0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBhdXRvUGxheVN0b3AoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXV0b3BsYXkpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuaW50ZXJ2YWwuY2FuY2VsKHRoaXMuYXV0b3BsYXkpO1xyXG5cdFx0XHR0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLmF1dG9wbGF5ID0gbnVsbDtcclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5BVVRPUExBWV9TVE9QLCB7aW5kZXg6IHRoaXMuc2VsZWN0ZWQsIGZpbGU6IHRoaXMuZmlsZX0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlTdGFydCgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuYXV0b3BsYXkgPSB0aGlzLmludGVydmFsKCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnRvRm9yd2FyZCgpO1xyXG5cdFx0XHR9LCB0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZGVsYXkpO1xyXG5cclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5BVVRPUExBWV9TVEFSVCwge2luZGV4OiB0aGlzLnNlbGVjdGVkLCBmaWxlOiB0aGlzLmZpbGV9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgcHJlcGFyZUl0ZW1zKCkge1xyXG5cclxuXHRcdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRsZXQgZ2V0QXZhaWxhYmxlU291cmNlID0gZnVuY3Rpb24gKHR5cGUgOiBzdHJpbmcsIHNvdXJjZSA6IElTb3VyY2UpIHtcclxuXHJcblx0XHRcdFx0aWYgKHNvdXJjZVt0eXBlXSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHNvdXJjZVt0eXBlXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlID09PSAncGFuZWwnKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZ2V0QXZhaWxhYmxlU291cmNlKCdpbWFnZScsIHNvdXJjZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ2ltYWdlJykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGdldEF2YWlsYWJsZVNvdXJjZSgnbW9kYWwnLCBzb3VyY2UpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdtb2RhbCcpIHtcclxuXHRcdFx0XHRcdHJldHVybiBnZXRBdmFpbGFibGVTb3VyY2UoJ2ltYWdlJywgc291cmNlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHJcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh0aGlzLml0ZW1zLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG5cclxuXHRcdFx0XHRpZiAoIXZhbHVlLnNvdXJjZSkge1xyXG5cclxuXHRcdFx0XHRcdHZhbHVlLnNvdXJjZSA9IHtcclxuXHRcdFx0XHRcdFx0bW9kYWw6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLm1vZGFsXSxcclxuXHRcdFx0XHRcdFx0cGFuZWw6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLnBhbmVsXSxcclxuXHRcdFx0XHRcdFx0aW1hZ2U6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLmltYWdlXSxcclxuXHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IHNvdXJjZSA9IHtcclxuXHRcdFx0XHRcdG1vZGFsOiBzZWxmLm9wdGlvbnMuYmFzZVVybCArIGdldEF2YWlsYWJsZVNvdXJjZSgnbW9kYWwnLCB2YWx1ZS5zb3VyY2UpLFxyXG5cdFx0XHRcdFx0cGFuZWw6IHNlbGYub3B0aW9ucy5iYXNlVXJsICsgZ2V0QXZhaWxhYmxlU291cmNlKCdwYW5lbCcsIHZhbHVlLnNvdXJjZSksXHJcblx0XHRcdFx0XHRpbWFnZTogc2VsZi5vcHRpb25zLmJhc2VVcmwgKyBnZXRBdmFpbGFibGVTb3VyY2UoJ2ltYWdlJywgdmFsdWUuc291cmNlKSxcclxuXHRcdFx0XHR9O1xyXG5cclxuXHJcblx0XHRcdFx0bGV0IHBhcnRzID0gc291cmNlLm1vZGFsLnNwbGl0KCcvJyk7XHJcblx0XHRcdFx0bGV0IGZpbGVuYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XHJcblxyXG5cdFx0XHRcdGxldCB0aXRsZSwgZGVzY3JpcHRpb247XHJcblxyXG5cdFx0XHRcdGlmIChzZWxmLm9wdGlvbnMuZmllbGRzICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdHRpdGxlID0gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aXRsZV0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRpdGxlXSA6IGZpbGVuYW1lO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aXRsZSA9IGZpbGVuYW1lO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHNlbGYub3B0aW9ucy5maWVsZHMgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb24gPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuZGVzY3JpcHRpb25dIDogbnVsbDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb24gPSBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGZpbGUgPSB7XHJcblx0XHRcdFx0XHRzb3VyY2U6IHNvdXJjZSxcclxuXHRcdFx0XHRcdHRpdGxlOiB0aXRsZSxcclxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdGxvYWRlZDoge1xyXG5cdFx0XHRcdFx0XHRtb2RhbDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdHBhbmVsOiBmYWxzZSxcclxuXHRcdFx0XHRcdFx0aW1hZ2U6IGZhbHNlXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0c2VsZi5maWxlcy5wdXNoKGZpbGUpO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLlBBUlNFX0lNQUdFUywgdGhpcy5maWxlcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgaG92ZXJQcmVsb2FkKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLmxvYWRJbWFnZShpbmRleCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBpbWFnZSBwcmVsb2FkXHJcblx0XHRwcml2YXRlIHByZWxvYWQod2FpdD8gOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQpO1xyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkICsgMSk7XHJcblx0XHRcdH0sICh3YWl0ICE9PSB1bmRlZmluZWQpID8gd2FpdCA6IHRoaXMub3B0aW9ucy5wcmVsb2FkRGVsYXkpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgbm9ybWFsaXplKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRsZXQgbGFzdCA9IHRoaXMuZmlsZXMubGVuZ3RoIC0gMTtcclxuXHJcblx0XHRcdGlmIChpbmRleCA+IGxhc3QpIHtcclxuXHRcdFx0XHRyZXR1cm4gKGluZGV4IC0gbGFzdCkgLSAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoaW5kZXggPCAwKSB7XHJcblx0XHRcdFx0cmV0dXJuIGxhc3QgLSBNYXRoLmFicyhpbmRleCkgKyAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gaW5kZXg7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbG9hZEltYWdlcyhpbmRleGVzIDogQXJyYXk8bnVtYmVyPiwgdHlwZSA6IHN0cmluZykge1xyXG5cclxuXHRcdFx0aWYgKCFpbmRleGVzKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRpbmRleGVzLmZvckVhY2goKGluZGV4IDogbnVtYmVyKSA9PiB7XHJcblx0XHRcdFx0c2VsZi5sb2FkSW1hZ2UoaW5kZXgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBsb2FkSW1hZ2UoaW5kZXg/IDogbnVtYmVyLCBjYWxsYmFjaz8gOiB7fSkge1xyXG5cclxuXHRcdFx0aW5kZXggPSBpbmRleCA/IGluZGV4IDogdGhpcy5zZWxlY3RlZDtcclxuXHRcdFx0aW5kZXggPSB0aGlzLm5vcm1hbGl6ZShpbmRleCk7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuZmlsZXNbaW5kZXhdKSB7XHJcblx0XHRcdFx0dGhpcy5sb2coJ2ludmFsaWQgZmlsZSBpbmRleCcsIHtpbmRleDogaW5kZXh9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWQubW9kYWwpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0XHRpbWFnZS5zcmMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2UuaW1hZ2U7XHJcblx0XHRcdGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5hZnRlckxvYWQoaW5kZXgsICdpbWFnZScsIGltYWdlKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRsZXQgbW9kYWwgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdFx0bW9kYWwuc3JjID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlLm1vZGFsO1xyXG5cdFx0XHRtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XHJcblx0XHRcdFx0dGhpcy5hZnRlckxvYWQoaW5kZXgsICdtb2RhbCcsIG1vZGFsKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBmaWxlIG5hbWVcclxuXHRcdHByaXZhdGUgZ2V0RmlsZW5hbWUoaW5kZXggOiBudW1iZXIsIHR5cGU/IDogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHR0eXBlID0gdHlwZSA/IHR5cGUgOiAnbW9kYWwnO1xyXG5cdFx0XHRsZXQgZmlsZXBhcnRzID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlW3R5cGVdLnNwbGl0KCcvJyk7XHJcblx0XHRcdGxldCBmaWxlbmFtZSA9IGZpbGVwYXJ0c1tmaWxlcGFydHMubGVuZ3RoIC0gMV07XHJcblx0XHRcdHJldHVybiBmaWxlbmFtZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGZpbGUgZXh0ZW5zaW9uXHJcblx0XHRwcml2YXRlIGdldEV4dGVuc2lvbihpbmRleCA6IG51bWJlciwgdHlwZT8gOiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdHR5cGUgPSB0eXBlID8gdHlwZSA6ICdtb2RhbCc7XHJcblx0XHRcdGxldCBmaWxlcGFydHMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2VbdHlwZV0uc3BsaXQoJy4nKTtcclxuXHRcdFx0bGV0IGV4dGVuc2lvbiA9IGZpbGVwYXJ0c1tmaWxlcGFydHMubGVuZ3RoIC0gMV07XHJcblx0XHRcdHJldHVybiBleHRlbnNpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGFmdGVyIGxvYWQgaW1hZ2VcclxuXHRcdHByaXZhdGUgYWZ0ZXJMb2FkKGluZGV4LCB0eXBlLCBpbWFnZSkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZFt0eXBlXSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubG9hZGVkW3R5cGVdID0gdHJ1ZTtcclxuXHJcblx0XHRcdGlmICh0eXBlID09PSAnbW9kYWwnKSB7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0ud2lkdGggPSBpbWFnZS53aWR0aDtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubmFtZSA9IHRoaXMuZ2V0RmlsZW5hbWUoaW5kZXgsIHR5cGUpO1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmV4dGVuc2lvbiA9IHRoaXMuZ2V0RXh0ZW5zaW9uKGluZGV4LCB0eXBlKTtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5kb3dubG9hZCA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5tb2RhbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGRhdGEgPSB7dHlwZTogdHlwZSwgaW5kZXg6IGluZGV4LCBmaWxlOiB0aGlzLmZpbGUsIGltZzogaW1hZ2V9O1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmZpcnN0KSB7XHJcblx0XHRcdFx0dGhpcy5maXJzdCA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5GSVJTVF9JTUFHRSwgZGF0YSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuTE9BRF9JTUFHRSwgZGF0YSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBpcyBzaW5nbGU/XHJcblx0XHRwdWJsaWMgZ2V0IGlzU2luZ2xlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuZmlsZXMubGVuZ3RoID4gMSA/IGZhbHNlIDogdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB0aGUgZG93bmxvYWQgbGlua1xyXG5cdFx0cHVibGljIGRvd25sb2FkTGluaygpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLnNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgdGhpcy5maWxlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZmlsZXNbdGhpcy5zZWxlY3RlZF0uc291cmNlLm1vZGFsO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgdGhlIGZpbGVcclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgZWxlbWVudCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgdG9nZ2xlKGVsZW1lbnQgOiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdHRoaXMub3B0aW9uc1tlbGVtZW50XS52aXNpYmxlID0gIXRoaXMub3B0aW9uc1tlbGVtZW50XS52aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHZpc2libGVcclxuXHRcdHB1YmxpYyBnZXQgbW9kYWxWaXNpYmxlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuX3Zpc2libGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgdGhlbWVcclxuXHRcdHB1YmxpYyBnZXQgdGhlbWUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLnRoZW1lO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gc2V0IHZpc2libGVcclxuXHRcdHB1YmxpYyBzZXQgbW9kYWxWaXNpYmxlKHZhbHVlIDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0dGhpcy5fdmlzaWJsZSA9IHZhbHVlO1xyXG5cclxuXHRcdFx0aWYgKHZhbHVlKSB7XHJcblxyXG5cdFx0XHRcdHRoaXMucHJlbG9hZCgxKTtcclxuXHRcdFx0XHR0aGlzLm1vZGFsSW5pdCgpO1xyXG5cdFx0XHRcdHRoaXMuZWwoJ2JvZHknKS5hZGRDbGFzcygneWhpZGRlbicpO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0dGhpcy5lbCgnYm9keScpLnJlbW92ZUNsYXNzKCd5aGlkZGVuJyk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGUgZm9jdXNcclxuXHRcdHB1YmxpYyBzZXRGb2N1cygpIHtcclxuXHJcblx0XHRcdHRoaXMuZWwoJy5hc2ctbW9kYWwuJyArIHRoaXMuaWQgKyAnIC5rZXlJbnB1dCcpLnRyaWdnZXIoJ2ZvY3VzJykuZm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGluaXRpYWxpemUgdGhlIGdhbGxlcnlcclxuXHRcdHByaXZhdGUgbW9kYWxJbml0KCkge1xyXG5cclxuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHJcblx0XHRcdFx0Ly8gc3VibWVudSBjbGljayBldmVudHNcclxuXHRcdFx0XHRsZXQgZWxlbWVudCA9ICcuZ2FsbGVyeS1tb2RhbC4nICsgc2VsZi5pZCArICcgbGkuZHJvcGRvd24tc3VibWVudSc7XHJcblxyXG5cdFx0XHRcdHRoaXMuZWwoZWxlbWVudCkub2ZmKCkub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblxyXG5cdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuZWwodGhpcykuaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVsKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVsKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHRcdHRoaXMuZWwodGhpcykuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdHNlbGYuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHRcdH0sIDEwMCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbW9kYWxPcGVuKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMubW9kYWxBdmFpbGFibGUpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleCA/IGluZGV4IDogdGhpcy5zZWxlY3RlZDtcclxuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5NT0RBTF9PUEVOLCB7aW5kZXg6IHRoaXMuc2VsZWN0ZWR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG1vZGFsQ2xvc2UoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmxvY2F0aW9uLmhhc2goJycpO1xyXG5cdFx0XHR0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLk1PREFMX0NMT1NFLCB7aW5kZXg6IHRoaXMuc2VsZWN0ZWR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgZXZlbnQoZXZlbnQgOiBzdHJpbmcsIGRhdGE/IDogYW55KSB7XHJcblxyXG5cdFx0XHRldmVudCA9IGV2ZW50ICsgdGhpcy5pZDtcclxuXHRcdFx0dGhpcy4kcm9vdFNjb3BlLiRlbWl0KGV2ZW50LCBkYXRhKTtcclxuXHRcdFx0dGhpcy5sb2coZXZlbnQsIGRhdGEpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgbG9nKGV2ZW50IDogc3RyaW5nLCBkYXRhPyA6IGFueSkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5kZWJ1Zykge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGV2ZW50LCBkYXRhID8gZGF0YSA6IG51bGwpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgZWwoc2VsZWN0b3IpIDogYW55IHtcclxuXHJcblx0XHRcdHJldHVybiBhbmd1bGFyLmVsZW1lbnQoc2VsZWN0b3IpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuc2VydmljZSgnYXNnU2VydmljZScsIFsnJHRpbWVvdXQnLCAnJGludGVydmFsJywgJyRsb2NhdGlvbicsICckcm9vdFNjb3BlJywgU2VydmljZUNvbnRyb2xsZXJdKTtcclxuXHJcbn1cclxuXHJcbiJdfQ==

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/asg-control.html','<button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.autoPlayToggle()">\r\n\t<span data-ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t<span data-ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n</button>\r\n\r\n<button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toFirst(true)">\r\n\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n</button>\r\n\r\n<button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toBackward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n</button>\r\n\r\n<button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toForward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n</button>\r\n\r\n');
$templateCache.put('views/asg-image.html','<div class="asg-image {{ $ctrl.asg.theme }}" data-ng-class="{\'nomodal\' : !$ctrl.asg.modalAvailable}" data-ng-style="{\'min-height\' : $ctrl.config.heightMin, \'height\' : $ctrl.height}">\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" data-ng-swipe-left="$ctrl.asg.toForward(true)" data-ng-swipe-right="$ctrl.asg.toBackward(true)">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.asg.files" data-ng-show="$ctrl.asg.selected == key" data-ng-class="{\'loading\' : !file.loaded.image}">\r\n\r\n\t\t\t<div class="source {{ $ctrl.config.size }}" data-ng-style="{\'background-image\': \'url(\' + file.source.image + \')\'}" data-ng-if="file.loaded.image" data-ng-mouseover="$ctrl.asg.hoverPreload(key)" data-ng-click="$ctrl.asg.modalOpen()"></div>\r\n\r\n\t\t</div>\r\n\t</div>\r\n\t<ng-transclude></ng-transclude>\r\n</div>\r\n\r\n\r\n\r\n');
$templateCache.put('views/asg-info.html','<div class="row">\r\n\r\n\t<div class="col-md-12">\r\n\t\t<h3>{{ $ctrl.file.title }}</h3>\r\n\t</div>\r\n\r\n\t<div class="col-md-12">\r\n\t\t{{ $ctrl.file.description }}\r\n\t\t<a target="_blank" href="{{ $ctrl.download }}"><span class="glyphicon glyphicon-download"></span></a>\r\n\t</div>\r\n\r\n</div>\r\n\r\n\r\n');
$templateCache.put('views/asg-modal.html','<script type="text/ng-template" id="help.html">\r\n\t<ul>\r\n\t\t<li>SPACE : forward</li>\r\n\t\t<li>RIGHT : forward</li>\r\n\t\t<li>LEFT : backward</li>\r\n\t\t<li>UP / HOME : first</li>\r\n\t\t<li>DOWN / END : last</li>\r\n\t\t<li>ENTER : toggle fullscreen</li>\r\n\t\t<li>ESC : exit</li>\r\n\t\t<li>p : play/pause</li>\r\n\t\t<li>t : change transition effect</li>\r\n\t\t<li>m : toggle menu</li>\r\n\t\t<li>s : toggle image size</li>\r\n\t\t<li>c : toggle caption</li>\r\n\t\t<li>h : toggle help</li>\r\n\t</ul>\r\n</script>\r\n\r\n<div class="asg-modal {{ $ctrl.id }}" data-ng-class="$ctrl.getClass()" data-ng-click="$ctrl.asg.setFocus()" data-ng-show="$ctrl.asg.modalVisible" data-ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" data-ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="header">\r\n\r\n\t\t<span class="buttons visible-xs pull-right">\r\n\t\t\t <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs">\r\n                    {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n\t\t\t </button>\r\n\t\t</span>\r\n\r\n\t\t<span class="buttons hidden-xs pull-right">\r\n\r\n\t\t\t   <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.autoPlayToggle()">\r\n                    <span data-ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t\t\t\t   <span data-ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toFirst(true)">\r\n                    {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toBackward(true)">\r\n                    <span class="glyphicon glyphicon-chevron-left"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toForward(true)">\r\n                    <span class="glyphicon glyphicon-chevron-right"></span>\r\n                </button>\r\n\r\n             <span data-ng-if="!$ctrl.asg.isSingle && false" class="dropdown">\r\n                    <button class="btn btn-default btn-sm dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                        <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu pull-right">\r\n                        <li class="dropdown-submenu">\r\n                            <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.asg.transitions">\r\n                                    <span data-ng-class="{\'highlight\' : transition == $ctrl.config.transition}">\r\n                                        {{ transition }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTheme(theme)" data-ng-repeat="theme in $ctrl.themes">\r\n                                    <span data-ng-class="{\'highlight\' : theme == $ctrl.asg.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                        <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                    </ul>\r\n                </span>\r\n\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleMenu()">\r\n                    <span data-ng-if="$ctrl.config.menu" class="glyphicon glyphicon-chevron-up"></span>\r\n                    <span data-ng-if="!$ctrl.config.menu" class="glyphicon glyphicon-chevron-down"></span>\r\n                </button>\r\n\r\n\t\t\t \t<button class="btn btn-default btn-sm btn-size" data-ng-click="$ctrl.toggleSize()">\r\n                    {{ $ctrl.config.size }}\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm hidden-xs btn-transitions" data-ng-click="$ctrl.nextTransition()">\r\n                    {{ $ctrl.config.transition }}\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleFullScreen()">\r\n                    <span class="glyphicon glyphicon-fullscreen"></span>\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleHelp()">\r\n                    <span class="glyphicon glyphicon-question-sign"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.close()">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n\r\n            </span>\r\n\r\n\t\t<span data-ng-click="$ctrl.asg.modalClose()" data-ng-if="$ctrl.config.title">\r\n\t\t\t<span class="title">{{ $ctrl.config.title }}</span>\r\n\t\t\t<span class="subtitle hidden-xs" data-ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span>\r\n\t\t</span>\r\n\r\n\t</div>\r\n\r\n\t<div class="help text-right" data-ng-click="$ctrl.toggleHelp()" data-ng-show="$ctrl.config.help" data-ng-include src="\'help.html\'"></div>\r\n\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.asg.files" data-ng-show="$ctrl.asg.selected == key" data-ng-class="{\'loading\' : !file.loaded.modal}">\r\n\r\n\t\t\t<div class="source {{ $ctrl.config.size }}" data-ng-style="{\'background-image\': \'url(\' + file.source.modal + \')\'}" data-ng-if="file.loaded.modal"></div>\r\n\r\n\t\t</div>\r\n\r\n\t</div>\r\n\r\n\t<div class="arrows" data-ng-mouseover="$ctrl.arrowsShow()" data-ng-mouseleave="$ctrl.arrowsHide()" data-ng-swipe-left="$ctrl.asg.toForward(true)" data-ng-swipe-right="$ctrl.asg.toBackward(true)" data-ng-click="$ctrl.asg.modalClose()">\r\n\r\n\t\t<div data-ng-if="!$ctrl.asg.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toBackward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.asg.toBackward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" data-ng-click="$ctrl.asg.toBackward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.asg.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toForward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.asg.toForward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" data-ng-click="$ctrl.asg.toForward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t</div>\r\n\r\n\t<div class="caption" data-ng-class="{\'visible\' : $ctrl.config.caption}">\r\n\t\t<div class="content">\r\n\t\t\t<span class="title">{{ $ctrl.asg.file.title }}</span>\r\n\t\t\t<span data-ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description"> - </span>\r\n\t\t\t<span class="description">{{ $ctrl.asg.file.description }}</span>\r\n\t\t\t<a href="{{ $ctrl.asg.downloadLink() }}" target="_blank" class="btn btn-default btn-xs">\r\n\t\t\t\t<span class="glyphicon glyphicon-download"></span> Download\r\n\t\t\t</a>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>');
$templateCache.put('views/asg-panel.html','<div class="asg-panel {{ $ctrl.asg.theme }}" data-ng-show="$ctrl.config.visible">\r\n\r\n\t<div data-ng-repeat="(key,file) in $ctrl.asg.files" class="item {{ $ctrl.asg.options.panel.item.class }}" data-ng-class="{\'selected\' : $ctrl.asg.selected == key}" data-ng-mouseover="indexShow = true" data-ng-mouseleave="indexShow = false">\r\n\r\n\t\t<img data-ng-src="{{ file.source.panel }}" data-ng-click="$ctrl.asg.setSelected(key)" data-ng-mouseover="$ctrl.asg.hoverPreload(key)" alt="{{ file.title }}">\r\n\t\t<span class="index" data-ng-if="$ctrl.config.item.index && indexShow">{{ key + 1 }}</span>\r\n\r\n\t\t<div class="caption" data-ng-if="$ctrl.config.item.caption">\r\n\t\t\t<span>{{ file.title }}</span>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>');}]);