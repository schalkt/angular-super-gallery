/**
 * angular-super-gallery - AngularJS Super Gallery
 * 
 * @version v1.1.1
 * @link http://schalk.hu/projects/angular-super-gallery/demo/
 * @license MIT
 */
var angularSuperGallery;
(function (angularSuperGallery) {
    var app = angular.module('angularSuperGallery', ['ngAnimate', 'ngTouch']);
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
})(angularSuperGallery || (angularSuperGallery = {}));

var angularSuperGallery;
(function (angularSuperGallery) {
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
    angularSuperGallery.ControlController = ControlController;
    var app = angular.module('angularSuperGallery');
    app.component('asgControl', {
        controller: ['asgService', '$scope', angularSuperGallery.ControlController],
        template: '<div class="asg-control {{ $ctrl.asg.theme }}"><div ng-include="$ctrl.template"></div></div>',
        bindings: {
            id: '@?',
            selected: '=?',
            template: '@?'
        }
    });
})(angularSuperGallery || (angularSuperGallery = {}));

var angularSuperGallery;
(function (angularSuperGallery) {
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
                _this.asg.thumbnailsMove(50);
            });
        };
        ImageController.prototype.setHeight = function (img) {
            var width = this.$element.children('div')[0].clientWidth;
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
    angularSuperGallery.ImageController = ImageController;
    var app = angular.module('angularSuperGallery');
    app.component('asgImage', {
        controller: ['asgService', '$rootScope', '$element', '$window', '$scope', angularSuperGallery.ImageController],
        templateUrl: 'views/asg-image.html',
        transclude: true,
        bindings: {
            id: '@?',
            items: '=?',
            options: '=?',
            selected: '=?'
        }
    });
})(angularSuperGallery || (angularSuperGallery = {}));

var angularSuperGallery;
(function (angularSuperGallery) {
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
    angularSuperGallery.InfoController = InfoController;
    var app = angular.module('angularSuperGallery');
    app.component('asgInfo', {
        controller: ['asgService', '$scope', angularSuperGallery.InfoController],
        template: '<div class="asg-info {{ $ctrl.asg.theme }}"><div ng-include="$ctrl.template"></div></div>',
        transclude: true,
        bindings: {
            id: '@?',
            template: '@?'
        }
    });
})(angularSuperGallery || (angularSuperGallery = {}));

var angularSuperGallery;
(function (angularSuperGallery) {
    var ModalController = (function () {
        function ModalController(service, $window, $scope) {
            this.service = service;
            this.$window = $window;
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
        ModalController.prototype.close = function ($event) {
            this.asg.modalClick($event);
            this.asg.modalClose();
            this.$window.screenfull.exit();
        };
        ModalController.prototype.setFocus = function ($event) {
            this.asg.modalClick($event);
        };
        ModalController.prototype.autoPlayToggle = function ($event) {
            this.asg.modalClick($event);
            this.asg.autoPlayToggle();
        };
        ModalController.prototype.toFirst = function (stop, $event) {
            this.asg.modalClick($event);
            this.asg.toFirst();
        };
        ModalController.prototype.toBackward = function (stop, $event) {
            this.asg.modalClick($event);
            this.asg.toBackward(stop);
        };
        ModalController.prototype.toForward = function (stop, $event) {
            this.asg.modalClick($event);
            this.asg.toForward(stop);
        };
        ModalController.prototype.toLast = function (stop, $event) {
            this.asg.modalClick($event);
            this.asg.toLast(stop);
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
                    this.asg.log('unknown keyboard action: ' + e.keyCode);
                    break;
            }
        };
        ModalController.prototype.nextTransition = function ($event) {
            this.asg.modalClick($event);
            var idx = this.asg.transitions.indexOf(this.config.transition) + 1;
            var next = idx >= this.asg.transitions.length ? 0 : idx;
            this.config.transition = this.asg.transitions[next];
        };
        ModalController.prototype.toggleFullScreen = function ($event) {
            this.asg.modalClick($event);
            this.$window.screenfull.toggle();
        };
        ModalController.prototype.toggleThumbnails = function ($event) {
            this.asg.modalClick($event);
            this.config.thumbnail.visible = !this.config.thumbnail.visible;
        };
        ModalController.prototype.setTransition = function (transition, $event) {
            this.asg.modalClick($event);
            this.config.transition = transition;
        };
        ModalController.prototype.setTheme = function (theme, $event) {
            this.asg.modalClick($event);
            this.asg.options.theme = theme;
        };
        ModalController.prototype.arrowsHide = function () {
            this.arrowsVisible = false;
        };
        ModalController.prototype.arrowsShow = function () {
            this.arrowsVisible = true;
        };
        ModalController.prototype.toggleHelp = function ($event) {
            this.asg.modalClick($event);
            this.config.help = !this.config.help;
        };
        ModalController.prototype.toggleSize = function ($event) {
            this.asg.modalClick($event);
            var index = this.asg.sizes.indexOf(this.config.size);
            index = (index + 1) >= this.asg.sizes.length ? 0 : ++index;
            this.config.size = this.asg.sizes[index];
            this.asg.log('toggle image size:', [this.config.size, index]);
        };
        ModalController.prototype.toggleMenu = function ($event) {
            this.asg.modalClick($event);
            this.config.menu = !this.config.menu;
        };
        ModalController.prototype.toggleCaption = function () {
            this.config.caption.visible = !this.config.caption.visible;
        };
        Object.defineProperty(ModalController.prototype, "marginTop", {
            get: function () {
                return this.config.marginTop;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModalController.prototype, "marginBottom", {
            get: function () {
                return this.config.marginBottom;
            },
            enumerable: true,
            configurable: true
        });
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
    angularSuperGallery.ModalController = ModalController;
    var app = angular.module('angularSuperGallery');
    app.component('asgModal', {
        controller: ['asgService', '$window', '$scope', angularSuperGallery.ModalController],
        templateUrl: 'views/asg-modal.html',
        transclude: true,
        bindings: {
            id: '@?',
            items: '=?',
            options: '=?',
            selected: '=?',
            visible: '=?'
        }
    });
})(angularSuperGallery || (angularSuperGallery = {}));

var angularSuperGallery;
(function (angularSuperGallery) {
    var PanelController = (function () {
        function PanelController(service, $scope) {
            this.service = service;
            this.$scope = $scope;
            this.type = 'panel';
            this.template = 'views/asg-panel.html';
        }
        PanelController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this);
        };
        PanelController.prototype.setSelected = function (index, $event) {
            this.asg.modalClick($event);
            this.asg.setSelected(index);
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
    angularSuperGallery.PanelController = PanelController;
    var app = angular.module('angularSuperGallery');
    app.component('asgPanel', {
        controller: ['asgService', '$scope', angularSuperGallery.PanelController],
        template: '<div class="asg-panel {{ $ctrl.asg.theme }}" ng-mouseover="$ctrl.asg.over.panel = true;" ng-mouseleave="$ctrl.asg.over.panel = false;" ng-show="$ctrl.config.visible"><div ng-include="$ctrl.template"></div></div>',
        bindings: {
            id: '@',
            items: '=?',
            options: '=?',
            selected: '=?',
            visible: '=?',
            template: '@?'
        }
    });
})(angularSuperGallery || (angularSuperGallery = {}));

var angularSuperGallery;
(function (angularSuperGallery) {
    var ServiceController = (function () {
        function ServiceController(timeout, interval, location, $rootScope, $window) {
            var _this = this;
            this.timeout = timeout;
            this.interval = interval;
            this.location = location;
            this.$rootScope = $rootScope;
            this.$window = $window;
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
                    caption: {
                        visible: true,
                        position: 'top'
                    },
                    menu: true,
                    help: false,
                    thumbnail: {
                        height: 50,
                        visible: true,
                        index: false,
                        above: false,
                    },
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
                thumbnail: {
                    height: 50,
                    visible: true,
                    index: false,
                },
                panel: {
                    visible: true,
                    item: {
                        class: 'col-md-3',
                        caption: false,
                        index: false,
                    },
                },
                image: {
                    transition: 'slideLR',
                    size: 'cover',
                    height: null,
                    heightMin: null,
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
                THUMBNAIL_MOVE: 'ASG-thumbnail-move-',
            };
            angular.element($window).bind('resize', function (event) {
                _this.thumbnailsMove(100);
            });
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
            if (!string) {
                return null;
            }
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
                instance = new ServiceController(this.timeout, this.interval, this.location, this.$rootScope, this.$window);
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
                var prev = this._selected;
                this._selected = v;
                this.preload();
                if (prev !== this._selected) {
                    this.thumbnailsMove();
                    this.event(this.events.CHANGE_IMAGE, {
                        index: v,
                        file: this.file
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        ServiceController.prototype.setSelected = function (index) {
            this.autoPlayStop();
            this.direction = index > this.selected ? 'forward' : 'backward';
            this.selected = index;
        };
        ServiceController.prototype.toBackward = function (stop) {
            if (stop) {
                this.autoPlayStop();
            }
            this.direction = 'backward';
            this.selected--;
            this.loadImage(this.selected - 1);
            this.setHash();
        };
        ServiceController.prototype.toForward = function (stop) {
            if (stop) {
                this.autoPlayStop();
            }
            this.direction = 'forward';
            this.selected++;
            this.loadImage(this.selected + 1);
            this.setHash();
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
        ServiceController.prototype.modalInit = function () {
            var _this = this;
            var self = this;
            this.timeout(function () {
                var element = '.asg-modal.' + self.id + ' li.dropdown-submenu';
                _this.el(element).off().on('click', function (event) {
                    event.stopPropagation();
                    if (this.el(element).hasClass('open')) {
                        this.el(element).removeClass('open');
                    }
                    else {
                        this.el(element).removeClass('open');
                        this.el(element).addClass('open');
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
            this.setFocus();
            this.thumbnailsMove(200);
        };
        ServiceController.prototype.modalClose = function () {
            this.location.hash('');
            this.modalVisible = false;
            this.event(this.events.MODAL_CLOSE, { index: this.selected });
        };
        ServiceController.prototype.thumbnailsMove = function (delay) {
            var _this = this;
            var move = function () {
                var containers = _this.el('.asg-thumbnail.' + _this.id);
                for (var i = 0; i < containers.length; i++) {
                    var container = containers[i];
                    if (container.offsetWidth) {
                        var items = _this.el(container.querySelectorAll('.items'))[0];
                        var item = _this.el(container.querySelectorAll('.item'))[0];
                        var thumbnail = void 0, moveX = void 0, remain = void 0;
                        if (item) {
                            if (items.scrollWidth > container.offsetWidth) {
                                thumbnail = items.scrollWidth / _this.files.length;
                                moveX = (container.offsetWidth / 2) - (_this.selected * thumbnail) - thumbnail / 2;
                                remain = items.scrollWidth + moveX;
                                moveX = moveX > 0 ? 0 : moveX;
                                moveX = remain < container.offsetWidth ? container.offsetWidth - items.scrollWidth : moveX;
                            }
                            else {
                                thumbnail = _this.getRealWidth(item);
                                moveX = (container.offsetWidth - thumbnail * _this.files.length) / 2;
                            }
                            items.style.left = moveX + 'px';
                            _this.event(_this.events.THUMBNAIL_MOVE, {
                                thumbnail: thumbnail,
                                move: moveX,
                                remain: remain,
                                container: container.offsetWidth,
                                items: items.scrollWidth
                            });
                        }
                    }
                }
            };
            if (delay) {
                this.timeout(function () {
                    move();
                }, delay);
            }
            else {
                move();
            }
        };
        ServiceController.prototype.modalClick = function ($event) {
            if ($event) {
                $event.stopPropagation();
            }
            this.setFocus();
        };
        ServiceController.prototype.setFocus = function () {
            if (this.modalVisible) {
                this.el('.asg-modal.' + this.id + ' .keyInput').trigger('focus').focus();
            }
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
        ServiceController.prototype.getRealWidth = function (item) {
            var style = item.currentStyle || window.getComputedStyle(item), width = item.offsetWidth, margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight), border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
            return width + margin + border;
        };
        ServiceController.prototype.getRealHeight = function (item) {
            var style = item.currentStyle || window.getComputedStyle(item), height = item.offsetHeight, margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom), border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
            return height + margin + border;
        };
        return ServiceController;
    }());
    angularSuperGallery.ServiceController = ServiceController;
    var app = angular.module('angularSuperGallery');
    app.service('asgService', ['$timeout', '$interval', '$location', '$rootScope', '$window', ServiceController]);
})(angularSuperGallery || (angularSuperGallery = {}));

var angularSuperGallery;
(function (angularSuperGallery) {
    var ThumbnailController = (function () {
        function ThumbnailController(service, $scope, $element) {
            this.service = service;
            this.$scope = $scope;
            this.$element = $element;
            this.type = 'thumbnail';
            this.template = 'views/asg-thumbnail.html';
            this.modal = false;
        }
        ThumbnailController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this);
            if (this.$scope && this.$scope.$parent && this.$scope.$parent.$parent && this.$scope.$parent.$parent.$ctrl) {
                this.modal = this.$scope.$parent.$parent.$ctrl.type == 'modal' ? true : false;
            }
        };
        Object.defineProperty(ThumbnailController.prototype, "above", {
            get: function () {
                return this.config.above ? 'above' : null;
            },
            enumerable: true,
            configurable: true
        });
        ThumbnailController.prototype.setSelected = function (index, $event) {
            this.asg.modalClick($event);
            this.asg.setSelected(index);
        };
        Object.defineProperty(ThumbnailController.prototype, "config", {
            get: function () {
                return this.modal ? this.asg.options['modal'][this.type] : this.asg.options[this.type];
            },
            set: function (value) {
                if (this.modal) {
                    this.asg.options[this.type] = value;
                }
                else {
                    this.asg.options['modal'][this.type] = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ThumbnailController.prototype, "selected", {
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
        return ThumbnailController;
    }());
    angularSuperGallery.ThumbnailController = ThumbnailController;
    var app = angular.module('angularSuperGallery');
    app.component('asgThumbnail', {
        controller: ['asgService', '$scope', '$element', angularSuperGallery.ThumbnailController],
        template: '<div ng-show="$ctrl.config.visible" class="asg-thumbnail {{ $ctrl.asg.theme }} {{ $ctrl.id }} {{ $ctrl.above }}" ng-click="$ctrl.asg.modalClick($event);"><div ng-include="$ctrl.template"></div></div>',
        bindings: {
            id: '@',
            items: '=?',
            options: '=?',
            selected: '=?',
            visible: '=?',
            template: '@?'
        }
    });
})(angularSuperGallery || (angularSuperGallery = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzZy50cyIsImFzZy1jb250cm9sLnRzIiwiYXNnLWltYWdlLnRzIiwiYXNnLWluZm8udHMiLCJhc2ctbW9kYWwudHMiLCJhc2ctcGFuZWwudHMiLCJhc2ctc2VydmljZS50cyIsImFzZy10aHVtYm5haWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBVSxtQkFBbUIsQ0EyQjVCO0FBM0JELFdBQVUsbUJBQW1CO0lBRTVCLElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFdkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDdEIsTUFBTSxDQUFDLFVBQVUsS0FBVyxFQUFFLFNBQWtCO1lBRS9DLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDWCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDWixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsU0FBUyxHQUFHLENBQUMsQ0FBQztZQUNmLENBQUM7WUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELE1BQU0sQ0FB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Q0FBQztnQkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7WUFFMUIsQ0FBQztpQkFuQkQsVUFBb0IsQ0FBVTtnQkFFN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDZixNQUFNLENBQUM7Z0JBQ1IsQ0FBQztnQkFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFFdkIsQ0FBQzs7O1dBQUE7UUFhRiwwQkFBQztJQUFELENBcEZBLEFBb0ZDLElBQUE7SUFwRlksdUNBQW1CLHNCQW9GL0IsQ0FBQTtJQUVELElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFFN0QsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUU7UUFDN0IsVUFBVSxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsbUJBQW1CLENBQUMsbUJBQW1CLENBQUM7UUFDekYsUUFBUSxFQUFFLHlNQUF5TTtRQUNuTixRQUFRLEVBQUU7WUFDVCxFQUFFLEVBQUUsR0FBRztZQUNQLEtBQUssRUFBRSxJQUFJO1lBQ1gsT0FBTyxFQUFFLElBQUk7WUFDYixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUSxFQUFFLElBQUk7U0FDZDtLQUNELENBQUMsQ0FBQztBQUVKLENBQUMsRUF2R1MsbUJBQW1CLEtBQW5CLG1CQUFtQixRQXVHNUIiLCJmaWxlIjoiYW5ndWxhci1zdXBlci1nYWxsZXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi8uLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxyXG5cclxubmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5JywgWyduZ0FuaW1hdGUnLCAnbmdUb3VjaCddKTtcclxuXHJcblx0YXBwLmZpbHRlcignYXNnQnl0ZXMnLCAoKSA9PiB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGJ5dGVzIDogYW55LCBwcmVjaXNpb24gOiBudW1iZXIpIDogc3RyaW5nIHtcclxuXHJcblx0XHRcdGlmIChpc05hTihwYXJzZUZsb2F0KGJ5dGVzKSkgfHwgIWlzRmluaXRlKGJ5dGVzKSkge1xyXG5cdFx0XHRcdHJldHVybiAnJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGJ5dGVzID09PSAwKSB7XHJcblx0XHRcdFx0cmV0dXJuICcwJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHR5cGVvZiBwcmVjaXNpb24gPT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0cHJlY2lzaW9uID0gMTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IHVuaXRzID0gWydieXRlcycsICdrQicsICdNQicsICdHQicsICdUQicsICdQQiddLFxyXG5cdFx0XHRcdG51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5sb2coYnl0ZXMpIC8gTWF0aC5sb2coMTAyNCkpO1xyXG5cclxuXHRcdFx0cmV0dXJuIChieXRlcyAvIE1hdGgucG93KDEwMjQsIE1hdGguZmxvb3IobnVtYmVyKSkpLnRvRml4ZWQocHJlY2lzaW9uKSArICcgJyArIHVuaXRzW251bWJlcl07XHJcblxyXG5cdFx0fTtcclxuXHR9KTtcclxuXHJcbn1cclxuXHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIENvbnRyb2xDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIHR5cGUgPSAnY29udHJvbCc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgdGVtcGxhdGUgPSAndmlld3MvYXNnLWNvbnRyb2wuaHRtbCc7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkc2NvcGUgOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHRcdHRoaXMuJHNjb3BlLmZvcndhcmQgPSAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dGhpcy4kc2NvcGUuYmFja3dhcmQgPSAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZCh0cnVlKTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCBpbWFnZSBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBpbWFnZSBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNJbWFnZSkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnQ29udHJvbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LkNvbnRyb2xDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImFzZy1jb250cm9sIHt7ICRjdHJsLmFzZy50aGVtZSB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgSW1hZ2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cclxuXHRcdHByaXZhdGUgdHlwZSA9ICdpbWFnZSc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdFx0XHRwcml2YXRlICRyb290U2NvcGUgOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJGVsZW1lbnQgOiBuZy5JUm9vdEVsZW1lbnRTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkd2luZG93IDogbmcuSVdpbmRvd1NlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICRzY29wZSA6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdFx0YW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoJ3Jlc2l6ZScsIChldmVudCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMub25SZXNpemUoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgb25SZXNpemUoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuaGVpZ2h0QXV0by5vbnJlc2l6ZSkge1xyXG5cdFx0XHRcdHRoaXMuc2V0SGVpZ2h0KHRoaXMuYXNnLmZpbGUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0XHQvLyBzZXQgaW1hZ2UgY29tcG9uZW50IGhlaWdodFxyXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJG9uKHRoaXMuYXNnLmV2ZW50cy5GSVJTVF9JTUFHRSArIHRoaXMuaWQsIChldmVudCwgZGF0YSkgPT4ge1xyXG5cclxuXHRcdFx0XHRpZiAoIXRoaXMuY29uZmlnLmhlaWdodCAmJiB0aGlzLmNvbmZpZy5oZWlnaHRBdXRvLmluaXRpYWwgPT09IHRydWUpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0SGVpZ2h0KGRhdGEuaW1nKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuYXNnLnRodW1ibmFpbHNNb3ZlKDUwKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29tcG9uZW50IGhlaWdodFxyXG5cdFx0cHJpdmF0ZSBzZXRIZWlnaHQoaW1nKSB7XHJcblxyXG5cdFx0XHRsZXQgd2lkdGggPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCdkaXYnKVswXS5jbGllbnRXaWR0aDtcclxuXHRcdFx0bGV0IHJhdGlvID0gaW1nLndpZHRoIC8gaW1nLmhlaWdodDtcclxuXHRcdFx0dGhpcy5jb25maWcuaGVpZ2h0ID0gd2lkdGggLyByYXRpbztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaGVpZ2h0XHJcblx0XHRwdWJsaWMgZ2V0IGhlaWdodCgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5oZWlnaHQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zSW1hZ2UpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnSW1hZ2UnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHJvb3RTY29wZScsICckZWxlbWVudCcsICckd2luZG93JywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuSW1hZ2VDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLWltYWdlLmh0bWwnLFxyXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIEluZm9Db250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIHR5cGUgPSAnaW5mbyc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgdGVtcGxhdGUgPSAndmlld3MvYXNnLWluZm8uaHRtbCc7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkc2NvcGUgOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGdldCBmaWxlKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuZmlsZTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0luZm8nLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5JbmZvQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctaW5mbyB7eyAkY3RybC5hc2cudGhlbWUgfX1cIj48ZGl2IG5nLWluY2x1ZGU9XCIkY3RybC50ZW1wbGF0ZVwiPjwvZGl2PjwvZGl2PicsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIE1vZGFsQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgPSAnbW9kYWwnO1xyXG5cdFx0cHJpdmF0ZSBhc2cgOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblx0XHRwcml2YXRlIGFycm93c1Zpc2libGUgPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdFx0XHRwcml2YXRlICR3aW5kb3cgOiBuZy5JV2luZG93U2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbEF2YWlsYWJsZSA9IHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwcml2YXRlIGdldENsYXNzKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmNvbmZpZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IG5nQ2xhc3MgPSBbXTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5jb25maWcubWVudSkge1xyXG5cdFx0XHRcdG5nQ2xhc3MucHVzaCgnbm9tZW51Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5nQ2xhc3MucHVzaCh0aGlzLmFzZy5vcHRpb25zLnRoZW1lKTtcclxuXHJcblx0XHRcdHJldHVybiBuZ0NsYXNzLmpvaW4oJyAnKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGFjdGlvbiBmcm9tIGtleWNvZGVzXHJcblx0XHRwcml2YXRlIGdldEFjdGlvbkJ5S2V5Q29kZShrZXlDb2RlIDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmtleWNvZGVzKTtcclxuXHRcdFx0bGV0IGFjdGlvbjtcclxuXHJcblx0XHRcdGZvciAobGV0IGtleSBpbiBrZXlzKSB7XHJcblxyXG5cdFx0XHRcdGxldCBjb2RlcyA9IHRoaXMuY29uZmlnLmtleWNvZGVzW2tleXNba2V5XV07XHJcblxyXG5cdFx0XHRcdGlmICghY29kZXMpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGluZGV4ID0gY29kZXMuaW5kZXhPZihrZXlDb2RlKTtcclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcclxuXHRcdFx0XHRcdGFjdGlvbiA9IGtleXNba2V5XTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBhY3Rpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgY2xvc2UoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbG9zZSgpO1xyXG5cdFx0XHR0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbC5leGl0KCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBzZXRGb2N1cygkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlUb2dnbGUoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cuYXV0b1BsYXlUb2dnbGUoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvRmlyc3Qoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy50b0ZpcnN0KCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvRm9yd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvTGFzdChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnRvTGFzdChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZG8ga2V5Ym9hcmQgYWN0aW9uXHJcblx0XHRwdWJsaWMga2V5VXAoZSA6IEtleWJvYXJkRXZlbnQpIHtcclxuXHJcblx0XHRcdGxldCBhY3Rpb24gOiBzdHJpbmcgPSB0aGlzLmdldEFjdGlvbkJ5S2V5Q29kZShlLmtleUNvZGUpO1xyXG5cclxuXHRcdFx0c3dpdGNoIChhY3Rpb24pIHtcclxuXHJcblx0XHRcdFx0Y2FzZSAnZXhpdCc6XHJcblx0XHRcdFx0XHR0aGlzLmNsb3NlKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAncGxheXBhdXNlJzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLmF1dG9QbGF5VG9nZ2xlKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnZm9yd2FyZCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnYmFja3dhcmQnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdmaXJzdCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0ZpcnN0KHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2xhc3QnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9MYXN0KHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2Z1bGxzY3JlZW4nOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVGdWxsU2NyZWVuKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnbWVudSc6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1lbnUoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdjYXB0aW9uJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlQ2FwdGlvbigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2hlbHAnOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVIZWxwKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnc2l6ZSc6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZVNpemUoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICd0cmFuc2l0aW9uJzpcclxuXHRcdFx0XHRcdHRoaXMubmV4dFRyYW5zaXRpb24oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cubG9nKCd1bmtub3duIGtleWJvYXJkIGFjdGlvbjogJyArIGUua2V5Q29kZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHN3aXRjaCB0byBuZXh0IHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRwcml2YXRlIG5leHRUcmFuc2l0aW9uKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdGxldCBpZHggPSB0aGlzLmFzZy50cmFuc2l0aW9ucy5pbmRleE9mKHRoaXMuY29uZmlnLnRyYW5zaXRpb24pICsgMTtcclxuXHRcdFx0bGV0IG5leHQgPSBpZHggPj0gdGhpcy5hc2cudHJhbnNpdGlvbnMubGVuZ3RoID8gMCA6IGlkeDtcclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRoaXMuYXNnLnRyYW5zaXRpb25zW25leHRdO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGZ1bGxzY3JlZW5cclxuXHRcdHByaXZhdGUgdG9nZ2xlRnVsbFNjcmVlbigkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbC50b2dnbGUoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIHRodW1ibmFpbHNcclxuXHRcdHByaXZhdGUgdG9nZ2xlVGh1bWJuYWlscygkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmNvbmZpZy50aHVtYm5haWwudmlzaWJsZSA9ICF0aGlzLmNvbmZpZy50aHVtYm5haWwudmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRwdWJsaWMgc2V0VHJhbnNpdGlvbih0cmFuc2l0aW9uLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmNvbmZpZy50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRoZW1lXHJcblx0XHRwdWJsaWMgc2V0VGhlbWUodGhlbWUgOiBzdHJpbmcsICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnMudGhlbWUgPSB0aGVtZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3ZlcmxheSBhcnJvd3MgaGlkZVxyXG5cdFx0cHVibGljIGFycm93c0hpZGUoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFycm93c1Zpc2libGUgPSBmYWxzZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3ZlcmxheSBhcnJvd3Mgc2hvd1xyXG5cdFx0cHVibGljIGFycm93c1Nob3coKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFycm93c1Zpc2libGUgPSB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgaGVscFxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVIZWxwKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuY29uZmlnLmhlbHAgPSAhdGhpcy5jb25maWcuaGVscDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIHNpemVcclxuXHRcdHByaXZhdGUgdG9nZ2xlU2l6ZSgkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHRsZXQgaW5kZXggPSB0aGlzLmFzZy5zaXplcy5pbmRleE9mKHRoaXMuY29uZmlnLnNpemUpO1xyXG5cdFx0XHRpbmRleCA9IChpbmRleCArIDEpID49IHRoaXMuYXNnLnNpemVzLmxlbmd0aCA/IDAgOiArK2luZGV4O1xyXG5cdFx0XHR0aGlzLmNvbmZpZy5zaXplID0gdGhpcy5hc2cuc2l6ZXNbaW5kZXhdO1xyXG5cdFx0XHR0aGlzLmFzZy5sb2coJ3RvZ2dsZSBpbWFnZSBzaXplOicsIFt0aGlzLmNvbmZpZy5zaXplLCBpbmRleF0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgbWVudVxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVNZW51KCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuY29uZmlnLm1lbnUgPSAhdGhpcy5jb25maWcubWVudTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGNhcHRpb25cclxuXHRcdHByaXZhdGUgdG9nZ2xlQ2FwdGlvbigpIHtcclxuXHJcblx0XHRcdHRoaXMuY29uZmlnLmNhcHRpb24udmlzaWJsZSA9ICF0aGlzLmNvbmZpZy5jYXB0aW9uLnZpc2libGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtYXJnaW50IHRvcFxyXG5cdFx0cHVibGljIGdldCBtYXJnaW5Ub3AoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcubWFyZ2luVG9wO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbWFyZ2luIGJvdHRvbVxyXG5cdFx0cHVibGljIGdldCBtYXJnaW5Cb3R0b20oKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcubWFyZ2luQm90dG9tO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbW9kYWwgdmlzaWJsZVxyXG5cdFx0cHVibGljIGdldCB2aXNpYmxlKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm1vZGFsVmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IG1vZGFsIHZpc2libGVcclxuXHRcdHB1YmxpYyBzZXQgdmlzaWJsZSh2YWx1ZSA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsVmlzaWJsZSA9IHZhbHVlO1xyXG5cdFx0XHR0aGlzLmFzZy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1vZGFsIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKSA6IElPcHRpb25zTW9kYWwge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IG1vZGFsIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc01vZGFsKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnTW9kYWwnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHdpbmRvdycsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5Lk1vZGFsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FzZy1tb2RhbC5odG1sJyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR2aXNpYmxlOiAnPT8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIFBhbmVsQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgPSAncGFuZWwnO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZSA9ICd2aWV3cy9hc2ctcGFuZWwuaHRtbCc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdFx0XHRwcml2YXRlICRzY29wZSA6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXggOiBudW1iZXIsICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKGluZGV4KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHBhbmVsIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKSA6IElPcHRpb25zUGFuZWwge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHBhbmVsIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc1BhbmVsKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ1BhbmVsJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuUGFuZWxDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImFzZy1wYW5lbCB7eyAkY3RybC5hc2cudGhlbWUgfX1cIiBuZy1tb3VzZW92ZXI9XCIkY3RybC5hc2cub3Zlci5wYW5lbCA9IHRydWU7XCIgbmctbW91c2VsZWF2ZT1cIiRjdHJsLmFzZy5vdmVyLnBhbmVsID0gZmFsc2U7XCIgbmctc2hvdz1cIiRjdHJsLmNvbmZpZy52aXNpYmxlXCI+PGRpdiBuZy1pbmNsdWRlPVwiJGN0cmwudGVtcGxhdGVcIj48L2Rpdj48L2Rpdj4nLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAJyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR2aXNpYmxlOiAnPT8nLFxyXG5cdFx0XHR0ZW1wbGF0ZTogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5uYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdC8vIG1vZGFsIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc01vZGFsIHtcclxuXHJcblx0XHRtZW51PyA6IGJvb2xlYW47XHJcblx0XHRoZWxwPyA6IGJvb2xlYW47XHJcblx0XHRjYXB0aW9uPyA6IHtcclxuXHRcdFx0dmlzaWJsZSA6IGJvb2xlYW47XHJcblx0XHRcdHBvc2l0aW9uIDogc3RyaW5nO1xyXG5cdFx0fTtcclxuXHRcdHRyYW5zaXRpb24/IDogc3RyaW5nO1xyXG5cdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0c3VidGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0c2l6ZT8gOiBzdHJpbmc7XHJcblx0XHR0aHVtYm5haWw/IDogSU9wdGlvbnNUaHVtYm5haWw7XHJcblx0XHRtYXJnaW5Ub3A/IDogbnVtYmVyO1xyXG5cdFx0bWFyZ2luQm90dG9tPyA6IG51bWJlcjtcclxuXHRcdGtleWNvZGVzPyA6IHtcclxuXHRcdFx0ZXhpdD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRwbGF5cGF1c2U/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0Zm9yd2FyZD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRiYWNrd2FyZD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRmaXJzdD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRsYXN0PyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGZ1bGxzY3JlZW4/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0bWVudT8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRjYXB0aW9uPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGhlbHA/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0c2l6ZT8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHR0cmFuc2l0aW9uPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Ly8gcGFuZWwgY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zUGFuZWwge1xyXG5cclxuXHRcdHZpc2libGU/IDogYm9vbGVhbjtcclxuXHRcdGl0ZW0/IDoge1xyXG5cdFx0XHRjbGFzcz8gOiBzdHJpbmc7XHJcblx0XHRcdGNhcHRpb24gOiBib29sZWFuO1xyXG5cdFx0XHRpbmRleCA6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIHRodW1ibmFpbCBjb21wb25lbnQgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNUaHVtYm5haWwge1xyXG5cclxuXHRcdGhlaWdodD8gOiBudW1iZXIsXHJcblx0XHR2aXNpYmxlPyA6IGJvb2xlYW47XHJcblx0XHRpbmRleD8gOiBib29sZWFuO1xyXG5cdFx0YWJvdmU/IDogYm9vbGVhbjtcclxuXHJcblx0fVxyXG5cclxuXHQvLyBpbmZvIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0luZm8ge1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHR0cmFuc2l0aW9uPyA6IHN0cmluZztcclxuXHRcdHNpemU/IDogc3RyaW5nO1xyXG5cdFx0aGVpZ2h0PyA6IG51bWJlcjtcclxuXHRcdGhlaWdodE1pbj8gOiBudW1iZXI7XHJcblx0XHRoZWlnaHRBdXRvPyA6IHtcclxuXHRcdFx0aW5pdGlhbD8gOiBib29sZWFuLFxyXG5cdFx0XHRvbnJlc2l6ZT8gOiBib29sZWFuXHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGdhbGxlcnkgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xyXG5cclxuXHRcdGRlYnVnPyA6IGJvb2xlYW47XHJcblx0XHRiYXNlVXJsPyA6IHN0cmluZztcclxuXHRcdGZpZWxkcz8gOiB7XHJcblx0XHRcdHNvdXJjZT8gOiB7XHJcblx0XHRcdFx0bW9kYWw/IDogc3RyaW5nO1xyXG5cdFx0XHRcdHBhbmVsPyA6IHN0cmluZztcclxuXHRcdFx0XHRpbWFnZT8gOiBzdHJpbmc7XHJcblx0XHRcdH1cclxuXHRcdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0XHRkZXNjcmlwdGlvbj8gOiBzdHJpbmc7XHJcblx0XHRcdHRodW1ibmFpbD8gOiBzdHJpbmc7XHJcblx0XHR9O1xyXG5cdFx0YXV0b3BsYXk/IDoge1xyXG5cdFx0XHRlbmFibGVkPyA6IGJvb2xlYW47XHJcblx0XHRcdGRlbGF5PyA6IG51bWJlcjtcclxuXHRcdH07XHJcblx0XHR0aGVtZT8gOiBzdHJpbmc7XHJcblx0XHRwcmVsb2FkRGVsYXk/IDogbnVtYmVyO1xyXG5cdFx0cHJlbG9hZD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0bW9kYWw/IDogSU9wdGlvbnNNb2RhbDtcclxuXHRcdHBhbmVsPyA6IElPcHRpb25zUGFuZWw7XHJcblx0XHRpbWFnZT8gOiBJT3B0aW9uc0ltYWdlO1xyXG5cdFx0dGh1bWJuYWlsPyA6IElPcHRpb25zVGh1bWJuYWlsO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIHNvdXJjZVxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVNvdXJjZSB7XHJcblxyXG5cdFx0bW9kYWwgOiBzdHJpbmc7IC8vIG9yaWdpbmFsLCByZXF1aXJlZFxyXG5cdFx0cGFuZWw/IDogc3RyaW5nO1xyXG5cdFx0aW1hZ2U/IDogc3RyaW5nO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGZpbGVcclxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWxlIHtcclxuXHJcblx0XHRzb3VyY2UgOiBJU291cmNlO1xyXG5cdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0bmFtZT8gOiBzdHJpbmc7XHJcblx0XHRleHRlbnNpb24/IDogc3RyaW5nO1xyXG5cdFx0ZGVzY3JpcHRpb24/IDogc3RyaW5nO1xyXG5cdFx0ZG93bmxvYWQ/IDogc3RyaW5nO1xyXG5cdFx0bG9hZGVkPyA6IHtcclxuXHRcdFx0bW9kYWw/IDogYm9vbGVhbjtcclxuXHRcdFx0cGFuZWw/IDogYm9vbGVhbjtcclxuXHRcdFx0aW1hZ2U/IDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHR3aWR0aD8gOiBudW1iZXI7XHJcblx0XHRoZWlnaHQ/IDogbnVtYmVyO1xyXG5cclxuXHR9XHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU92ZXIge1xyXG5cdFx0bW9kYWxJbWFnZSA6IGJvb2xlYW47XHJcblx0XHRwYW5lbCA6IGJvb2xlYW47XHJcblx0fVxyXG5cclxuXHQvLyBzZXJ2aWNlIGNvbnRyb2xsZXIgaW50ZXJmYWNlXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJU2VydmljZUNvbnRyb2xsZXIge1xyXG5cclxuXHRcdG1vZGFsVmlzaWJsZSA6IGJvb2xlYW47XHJcblx0XHRwYW5lbFZpc2libGUgOiBib29sZWFuO1xyXG5cdFx0bW9kYWxBdmFpbGFibGUgOiBib29sZWFuO1xyXG5cdFx0dHJhbnNpdGlvbnMgOiBBcnJheTxzdHJpbmc+O1xyXG5cdFx0dGhlbWVzIDogQXJyYXk8c3RyaW5nPjtcclxuXHRcdG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0c2VsZWN0ZWQgOiBudW1iZXI7XHJcblx0XHRmaWxlIDogSUZpbGU7XHJcblx0XHRzaXplcyA6IEFycmF5PHN0cmluZz47XHJcblx0XHRpZCA6IHN0cmluZztcclxuXHRcdGV2ZW50cyA6IHtcclxuXHRcdFx0Q09ORklHX0xPQUQgOiBzdHJpbmc7XHJcblx0XHRcdEFVVE9QTEFZX1NUQVJUIDogc3RyaW5nO1xyXG5cdFx0XHRBVVRPUExBWV9TVE9QIDogc3RyaW5nO1xyXG5cdFx0XHRQQVJTRV9JTUFHRVMgOiBzdHJpbmc7XHJcblx0XHRcdExPQURfSU1BR0UgOiBzdHJpbmc7XHJcblx0XHRcdEZJUlNUX0lNQUdFIDogc3RyaW5nO1xyXG5cdFx0XHRDSEFOR0VfSU1BR0UgOiBzdHJpbmc7XHJcblx0XHRcdE1PREFMX09QRU4gOiBzdHJpbmc7XHJcblx0XHRcdE1PREFMX0NMT1NFIDogc3RyaW5nO1xyXG5cdFx0fTtcclxuXHJcblx0XHRnZXRJbnN0YW5jZShjb21wb25lbnQgOiBhbnkpIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdHNldERlZmF1bHRzKCkgOiB2b2lkO1xyXG5cclxuXHRcdHNldE9wdGlvbnMob3B0aW9ucyA6IElPcHRpb25zKSA6IElPcHRpb25zO1xyXG5cclxuXHRcdHNldEl0ZW1zKGl0ZW1zIDogQXJyYXk8SUZpbGU+KSA6IHZvaWQ7XHJcblxyXG5cdFx0cHJlbG9hZCh3YWl0PyA6IG51bWJlcikgOiB2b2lkO1xyXG5cclxuXHRcdG5vcm1hbGl6ZShpbmRleCA6IG51bWJlcikgOiBudW1iZXI7XHJcblxyXG5cdFx0c2V0Rm9jdXMoKSA6IHZvaWQ7XHJcblxyXG5cdFx0c2V0U2VsZWN0ZWQoaW5kZXggOiBudW1iZXIpO1xyXG5cclxuXHRcdG1vZGFsT3BlbihpbmRleCA6IG51bWJlcikgOiB2b2lkO1xyXG5cclxuXHRcdG1vZGFsQ2xvc2UoKSA6IHZvaWQ7XHJcblxyXG5cdFx0bW9kYWxDbGljaygkZXZlbnQ/IDogVUlFdmVudCkgOiB2b2lkO1xyXG5cclxuXHRcdHRodW1ibmFpbHNNb3ZlKGRlbGF5PyA6IG51bWJlcikgOiB2b2lkO1xyXG5cclxuXHRcdHRvQmFja3dhcmQoc3RvcD8gOiBib29sZWFuKSA6IHZvaWQ7XHJcblxyXG5cdFx0dG9Gb3J3YXJkKHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cclxuXHRcdHRvRmlyc3Qoc3RvcD8gOiBib29sZWFuKSA6IHZvaWQ7XHJcblxyXG5cdFx0dG9MYXN0KHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cclxuXHRcdGxvYWRJbWFnZShpbmRleD8gOiBudW1iZXIpIDogdm9pZDtcclxuXHJcblx0XHRsb2FkSW1hZ2VzKGluZGV4ZXMgOiBBcnJheTxudW1iZXI+KSA6IHZvaWQ7XHJcblxyXG5cdFx0YXV0b1BsYXlUb2dnbGUoKSA6IHZvaWQ7XHJcblxyXG5cdFx0dG9nZ2xlKGVsZW1lbnQgOiBzdHJpbmcpIDogdm9pZDtcclxuXHJcblx0XHRzZXRIYXNoKCkgOiB2b2lkO1xyXG5cclxuXHRcdGRvd25sb2FkTGluaygpIDogc3RyaW5nO1xyXG5cclxuXHRcdGVsKHNlbGVjdG9yKSA6IGFueTtcclxuXHJcblx0XHRsb2coZXZlbnQgOiBzdHJpbmcsIGRhdGE/IDogYW55KSA6IHZvaWQ7XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdC8vIHNlcnZpY2UgY29udHJvbGxlclxyXG5cdGV4cG9ydCBjbGFzcyBTZXJ2aWNlQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIHNsdWcgPSAnYXNnJztcclxuXHRcdHB1YmxpYyBpZCA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IGFueTtcclxuXHRcdHB1YmxpYyBmaWxlcyA6IEFycmF5PElGaWxlPiA9IFtdO1xyXG5cdFx0cHVibGljIGRpcmVjdGlvbiA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBtb2RhbEF2YWlsYWJsZSA9IGZhbHNlO1xyXG5cclxuXHRcdHByaXZhdGUgaW5zdGFuY2VzIDoge30gPSB7fTtcclxuXHRcdHByaXZhdGUgX3NlbGVjdGVkIDogbnVtYmVyO1xyXG5cdFx0cHJpdmF0ZSBfdmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBhdXRvcGxheSA6IGFuZ3VsYXIuSVByb21pc2U8YW55PjtcclxuXHRcdHByaXZhdGUgZmlyc3QgPSBmYWxzZTtcclxuXHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zID0gbnVsbDtcclxuXHRcdHB1YmxpYyBvcHRpb25zTG9hZGVkID0gZmFsc2U7XHJcblx0XHRwdWJsaWMgZGVmYXVsdHMgOiBJT3B0aW9ucyA9IHtcclxuXHRcdFx0ZGVidWc6IGZhbHNlLCAvLyBpbWFnZSBsb2FkIGFuZCBhdXRvcGxheSBpbmZvIGluIGNvbnNvbGUubG9nXHJcblx0XHRcdGJhc2VVcmw6ICcnLCAvLyB1cmwgcHJlZml4XHJcblx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdHNvdXJjZToge1xyXG5cdFx0XHRcdFx0bW9kYWw6ICd1cmwnLCAvLyByZXF1aXJlZCwgaW1hZ2UgdXJsIGZvciBtb2RhbCBjb21wb25lbnQgKGxhcmdlIHNpemUpXHJcblx0XHRcdFx0XHRwYW5lbDogJ3VybCcsIC8vIGltYWdlIHVybCBmb3IgcGFuZWwgY29tcG9uZW50ICh0aHVtYm5haWwgc2l6ZSlcclxuXHRcdFx0XHRcdGltYWdlOiAndXJsJyAvLyBpbWFnZSB1cmwgZm9yIGltYWdlIChtZWRpdW0gc2l6ZSlcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHRpdGxlOiAndGl0bGUnLCAvLyB0aXRsZSBpbnB1dCBmaWVsZCBuYW1lXHJcblx0XHRcdFx0ZGVzY3JpcHRpb246ICdkZXNjcmlwdGlvbicsIC8vIGRlc2NyaXB0aW9uIGlucHV0IGZpZWxkIG5hbWVcclxuXHRcdFx0XHR0aHVtYm5haWw6ICd0aHVtYm5haWwnIC8vIHRodW1ibmFpbCBpbnB1dCBmaWVsZCBuYW1lXHJcblx0XHRcdH0sXHJcblx0XHRcdGF1dG9wbGF5OiB7XHJcblx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsIC8vIHNsaWRlc2hvdyBwbGF5IGVuYWJsZWQvZGlzYWJsZWRcclxuXHRcdFx0XHRkZWxheTogNDEwMCAvLyBhdXRvcGxheSBkZWxheSBpbiBtaWxsaXNlY29uZFxyXG5cdFx0XHR9LFxyXG5cdFx0XHR0aGVtZTogJ2RlZmF1bHQnLCAvLyBjc3Mgc3R5bGUgW2RlZmF1bHQsIGRhcmtibHVlLCB3aGl0ZWdvbGRdXHJcblx0XHRcdHByZWxvYWREZWxheTogNzcwLFxyXG5cdFx0XHRwcmVsb2FkOiBbXSwgLy8gcHJlbG9hZCBpbWFnZXMgYnkgaW5kZXggbnVtYmVyXHJcblx0XHRcdG1vZGFsOiB7XHJcblx0XHRcdFx0dGl0bGU6ICcnLCAvLyBtb2RhbCB3aW5kb3cgdGl0bGVcclxuXHRcdFx0XHRzdWJ0aXRsZTogJycsIC8vIG1vZGFsIHdpbmRvdyBzdWJ0aXRsZVxyXG5cdFx0XHRcdGNhcHRpb246IHtcclxuXHRcdFx0XHRcdHZpc2libGU6IHRydWUsIC8vIHNob3cvaGlkZSBpbWFnZSBjYXB0aW9uXHJcblx0XHRcdFx0XHRwb3NpdGlvbjogJ3RvcCcgLy8gY2FwdGlvbiBwb3NpdGlvbiBbdG9wLCBib3R0b21dXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRtZW51OiB0cnVlLCAvLyBzaG93L2hpZGUgbW9kYWwgbWVudVxyXG5cdFx0XHRcdGhlbHA6IGZhbHNlLCAvLyBzaG93L2hpZGUgaGVscFxyXG5cdFx0XHRcdHRodW1ibmFpbDoge1xyXG5cdFx0XHRcdFx0aGVpZ2h0OiA1MCwgLy8gdGh1bWJuYWlsIGltYWdlIGhlaWdodCBpbiBwaXhlbFxyXG5cdFx0XHRcdFx0dmlzaWJsZTogdHJ1ZSwgLy8gc2hvdy9oaWRlIHRodW1ibmFpbHNcclxuXHRcdFx0XHRcdGluZGV4OiBmYWxzZSwgLy8gc2hvdyBpbmRleCBudW1iZXIgb24gdGh1bWJuYWlsXHJcblx0XHRcdFx0XHRhYm92ZTogZmFsc2UsIC8vIHRodW1ibmFpbHMgYWJvdmUgdGhlIGltYWdlc1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dHJhbnNpdGlvbjogJ3NsaWRlTFInLCAvLyB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0XHRcdHNpemU6ICdjb3ZlcicsIC8vIGNvbnRhaW4sIGNvdmVyLCBhdXRvLCBzdHJldGNoXHJcblx0XHRcdFx0a2V5Y29kZXM6IHtcclxuXHRcdFx0XHRcdGV4aXQ6IFsyN10sIC8vIGVzY1xyXG5cdFx0XHRcdFx0cGxheXBhdXNlOiBbODBdLCAvLyBwXHJcblx0XHRcdFx0XHRmb3J3YXJkOiBbMzIsIDM5XSwgLy8gc3BhY2UsIHJpZ2h0IGFycm93XHJcblx0XHRcdFx0XHRiYWNrd2FyZDogWzM3XSwgLy8gbGVmdCBhcnJvd1xyXG5cdFx0XHRcdFx0Zmlyc3Q6IFszOCwgMzZdLCAvLyB1cCBhcnJvdywgaG9tZVxyXG5cdFx0XHRcdFx0bGFzdDogWzQwLCAzNV0sIC8vIGRvd24gYXJyb3csIGVuZFxyXG5cdFx0XHRcdFx0ZnVsbHNjcmVlbjogWzEzXSwgLy8gZW50ZXJcclxuXHRcdFx0XHRcdG1lbnU6IFs3N10sIC8vIG1cclxuXHRcdFx0XHRcdGNhcHRpb246IFs2N10sIC8vIGNcclxuXHRcdFx0XHRcdGhlbHA6IFs3Ml0sIC8vIGhcclxuXHRcdFx0XHRcdHNpemU6IFs4M10sIC8vIHNcclxuXHRcdFx0XHRcdHRyYW5zaXRpb246IFs4NF0gLy8gdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0dGh1bWJuYWlsOiB7XHJcblx0XHRcdFx0aGVpZ2h0OiA1MCwgLy8gdGh1bWJuYWlsIGltYWdlIGhlaWdodCBpbiBwaXhlbFxyXG5cdFx0XHRcdHZpc2libGU6IHRydWUsIC8vIHNob3cvaGlkZSB0aHVtYm5haWxzXHJcblx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93IGluZGV4IG51bWJlciBvbiB0aHVtYm5haWxcclxuXHRcdFx0fSxcclxuXHRcdFx0cGFuZWw6IHtcclxuXHRcdFx0XHR2aXNpYmxlOiB0cnVlLFxyXG5cdFx0XHRcdGl0ZW06IHtcclxuXHRcdFx0XHRcdGNsYXNzOiAnY29sLW1kLTMnLCAvLyBpdGVtIGNsYXNzXHJcblx0XHRcdFx0XHRjYXB0aW9uOiBmYWxzZSxcclxuXHRcdFx0XHRcdGluZGV4OiBmYWxzZSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRpbWFnZToge1xyXG5cdFx0XHRcdHRyYW5zaXRpb246ICdzbGlkZUxSJywgLy8gdHJhbnNpdGlvbiBlZmZlY3RcclxuXHRcdFx0XHRzaXplOiAnY292ZXInLCAvLyBjb250YWluLCBjb3ZlciwgYXV0bywgc3RyZXRjaFxyXG5cdFx0XHRcdGhlaWdodDogbnVsbCwgLy8gaGVpZ2h0XHJcblx0XHRcdFx0aGVpZ2h0TWluOiBudWxsLCAvLyBtaW4gaGVpZ2h0XHJcblx0XHRcdFx0aGVpZ2h0QXV0bzoge1xyXG5cdFx0XHRcdFx0aW5pdGlhbDogdHJ1ZSxcclxuXHRcdFx0XHRcdG9ucmVzaXplOiBmYWxzZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBhdmFpbGFibGUgaW1hZ2Ugc2l6ZXNcclxuXHRcdHB1YmxpYyBzaXplcyA6IEFycmF5PHN0cmluZz4gPSBbXHJcblx0XHRcdCdjb250YWluJyxcclxuXHRcdFx0J2NvdmVyJyxcclxuXHRcdFx0J2F1dG8nLFxyXG5cdFx0XHQnc3RyZXRjaCdcclxuXHRcdF07XHJcblxyXG5cdFx0Ly8gYXZhaWxhYmxlIHRoZW1lc1xyXG5cdFx0cHVibGljIHRoZW1lcyA6IEFycmF5PHN0cmluZz4gPSBbXHJcblx0XHRcdCdkZWZhdWx0JyxcclxuXHRcdFx0J2RhcmtibHVlJyxcclxuXHRcdFx0J3doaXRlZ29sZCdcclxuXHRcdF07XHJcblxyXG5cdFx0Ly8gYXZhaWxhYmxlIHRyYW5zaXRpb25zXHJcblx0XHRwdWJsaWMgdHJhbnNpdGlvbnMgOiBBcnJheTxzdHJpbmc+ID0gW1xyXG5cdFx0XHQnbm8nLFxyXG5cdFx0XHQnZmFkZUluT3V0JyxcclxuXHRcdFx0J3pvb21JbicsXHJcblx0XHRcdCd6b29tT3V0JyxcclxuXHRcdFx0J3pvb21Jbk91dCcsXHJcblx0XHRcdCdyb3RhdGVMUicsXHJcblx0XHRcdCdyb3RhdGVUQicsXHJcblx0XHRcdCdyb3RhdGVaWScsXHJcblx0XHRcdCdzbGlkZUxSJyxcclxuXHRcdFx0J3NsaWRlVEInLFxyXG5cdFx0XHQnZmxpcFgnLFxyXG5cdFx0XHQnZmxpcFknXHJcblx0XHRdO1xyXG5cclxuXHRcdHB1YmxpYyBldmVudHMgPSB7XHJcblx0XHRcdENPTkZJR19MT0FEOiAnQVNHLWNvbmZpZy1sb2FkLScsXHJcblx0XHRcdEFVVE9QTEFZX1NUQVJUOiAnQVNHLWF1dG9wbGF5LXN0YXJ0LScsXHJcblx0XHRcdEFVVE9QTEFZX1NUT1A6ICdBU0ctYXV0b3BsYXktc3RvcC0nLFxyXG5cdFx0XHRQQVJTRV9JTUFHRVM6ICdBU0ctcGFyc2UtaW1hZ2VzLScsXHJcblx0XHRcdExPQURfSU1BR0U6ICdBU0ctbG9hZC1pbWFnZS0nLFxyXG5cdFx0XHRGSVJTVF9JTUFHRTogJ0FTRy1maXJzdC1pbWFnZS0nLFxyXG5cdFx0XHRDSEFOR0VfSU1BR0U6ICdBU0ctY2hhbmdlLWltYWdlLScsXHJcblx0XHRcdE1PREFMX09QRU46ICdBU0ctbW9kYWwtb3Blbi0nLFxyXG5cdFx0XHRNT0RBTF9DTE9TRTogJ0FTRy1tb2RhbC1jbG9zZS0nLFxyXG5cdFx0XHRUSFVNQk5BSUxfTU9WRTogJ0FTRy10aHVtYm5haWwtbW92ZS0nLFxyXG5cdFx0fTtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHRpbWVvdXQgOiBuZy5JVGltZW91dFNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlIGludGVydmFsIDogbmcuSUludGVydmFsU2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgbG9jYXRpb24gOiBuZy5JTG9jYXRpb25TZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkcm9vdFNjb3BlIDogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICR3aW5kb3cgOiBuZy5JV2luZG93U2VydmljZSkge1xyXG5cclxuXHRcdFx0YW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoJ3Jlc2l6ZScsIChldmVudCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMudGh1bWJuYWlsc01vdmUoMTAwKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgcGFyc2VIYXNoKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmlkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgaGFzaCA9IHRoaXMubG9jYXRpb24uaGFzaCgpO1xyXG5cdFx0XHRsZXQgcGFydHMgPSBoYXNoID8gaGFzaC5zcGxpdCgnLScpIDogbnVsbDtcclxuXHJcblx0XHRcdGlmIChwYXJ0cyA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHBhcnRzWzBdICE9PSB0aGlzLnNsdWcpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChwYXJ0cy5sZW5ndGggIT09IDMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChwYXJ0c1sxXSAhPT0gdGhpcy5pZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGluZGV4ID0gcGFyc2VJbnQocGFydHNbMl0sIDEwKTtcclxuXHJcblx0XHRcdGlmICghYW5ndWxhci5pc051bWJlcihpbmRleCkpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblxyXG5cdFx0XHRcdGluZGV4LS07XHJcblx0XHRcdFx0dGhpcy5zZWxlY3RlZCA9IGluZGV4O1xyXG5cdFx0XHRcdHRoaXMubW9kYWxPcGVuKGluZGV4KTtcclxuXHJcblx0XHRcdH0sIDIwKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRlIG9iamVjdCBoYXNoIGlkXHJcblx0XHRwdWJsaWMgb2JqZWN0SGFzaElkKG9iamVjdCA6IGFueSkgOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0bGV0IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KG9iamVjdCk7XHJcblxyXG5cdFx0XHRpZiAoIXN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgYWJjID0gc3RyaW5nLnJlcGxhY2UoL1teYS16QS1aMC05XSsvZywgJycpO1xyXG5cdFx0XHRsZXQgY29kZSA9IDA7XHJcblxyXG5cdFx0XHRmb3IgKGxldCBpID0gMCwgbiA9IGFiYy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuXHRcdFx0XHRsZXQgY2hhcmNvZGUgPSBhYmMuY2hhckNvZGVBdChpKTtcclxuXHRcdFx0XHRjb2RlICs9IChjaGFyY29kZSAqIGkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gY29kZS50b1N0cmluZygyMSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlIGZvciBjdXJyZW50IGdhbGxlcnkgYnkgY29tcG9uZW50IGlkXHJcblx0XHRwdWJsaWMgZ2V0SW5zdGFuY2UoY29tcG9uZW50IDogYW55KSB7XHJcblxyXG5cdFx0XHRpZiAoIWNvbXBvbmVudC5pZCkge1xyXG5cclxuXHRcdFx0XHQvLyBnZXQgcGFyZW50IGFzZyBjb21wb25lbnQgaWRcclxuXHRcdFx0XHRpZiAoY29tcG9uZW50LiRzY29wZSAmJiBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQgJiYgY29tcG9uZW50LiRzY29wZS4kcGFyZW50LiRwYXJlbnQgJiYgY29tcG9uZW50LiRzY29wZS4kcGFyZW50LiRwYXJlbnQuJGN0cmwpIHtcclxuXHRcdFx0XHRcdGNvbXBvbmVudC5pZCA9IGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudC4kcGFyZW50LiRjdHJsLmlkO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb21wb25lbnQuaWQgPSB0aGlzLm9iamVjdEhhc2hJZChjb21wb25lbnQub3B0aW9ucyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgaWQgPSBjb21wb25lbnQuaWQ7XHJcblx0XHRcdGxldCBpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzW2lkXTtcclxuXHJcblx0XHRcdC8vIG5ldyBpbnN0YW5jZSBhbmQgc2V0IG9wdGlvbnMgYW5kIGl0ZW1zXHJcblx0XHRcdGlmIChpbnN0YW5jZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0aW5zdGFuY2UgPSBuZXcgU2VydmljZUNvbnRyb2xsZXIodGhpcy50aW1lb3V0LCB0aGlzLmludGVydmFsLCB0aGlzLmxvY2F0aW9uLCB0aGlzLiRyb290U2NvcGUsIHRoaXMuJHdpbmRvdyk7XHJcblx0XHRcdFx0aW5zdGFuY2UuaWQgPSBpZDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aW5zdGFuY2Uuc2V0T3B0aW9ucyhjb21wb25lbnQub3B0aW9ucyk7XHJcblx0XHRcdGluc3RhbmNlLnNldEl0ZW1zKGNvbXBvbmVudC5pdGVtcyk7XHJcblx0XHRcdGluc3RhbmNlLnNlbGVjdGVkID0gY29tcG9uZW50LnNlbGVjdGVkID8gY29tcG9uZW50LnNlbGVjdGVkIDogMDtcclxuXHRcdFx0aW5zdGFuY2UucGFyc2VIYXNoKCk7XHJcblxyXG5cdFx0XHRpZiAoaW5zdGFuY2Uub3B0aW9ucykge1xyXG5cclxuXHRcdFx0XHRpbnN0YW5jZS5sb2FkSW1hZ2VzKGluc3RhbmNlLm9wdGlvbnMucHJlbG9hZCk7XHJcblxyXG5cdFx0XHRcdGlmIChpbnN0YW5jZS5vcHRpb25zLmF1dG9wbGF5ICYmIGluc3RhbmNlLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCAmJiAhaW5zdGFuY2UuYXV0b3BsYXkpIHtcclxuXHRcdFx0XHRcdGluc3RhbmNlLmF1dG9QbGF5U3RhcnQoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmluc3RhbmNlc1tpZF0gPSBpbnN0YW5jZTtcclxuXHRcdFx0cmV0dXJuIGluc3RhbmNlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBwcmVwYXJlIGltYWdlcyBhcnJheVxyXG5cdFx0cHVibGljIHNldEl0ZW1zKGl0ZW1zIDogQXJyYXk8SUZpbGU+KSB7XHJcblxyXG5cdFx0XHRpZiAoIWl0ZW1zKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpZiBhbHJlYWR5XHJcblx0XHRcdGlmICh0aGlzLml0ZW1zKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBwYXJzZSBhcnJheSBzdHJpbmcgZWxlbWVudHNcclxuXHRcdFx0aWYgKGFuZ3VsYXIuaXNTdHJpbmcoaXRlbXNbMF0pID09PSB0cnVlKSB7XHJcblxyXG5cdFx0XHRcdHRoaXMuaXRlbXMgPSBbXTtcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHR0aGlzLml0ZW1zLnB1c2goe3NvdXJjZToge21vZGFsOiBpdGVtc1tpXX19KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHR0aGlzLml0ZW1zID0gaXRlbXM7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnByZXBhcmVJdGVtcygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBvcHRpb25zIHNldHVwXHJcblx0XHRwdWJsaWMgc2V0T3B0aW9ucyhvcHRpb25zIDogSU9wdGlvbnMpIHtcclxuXHJcblx0XHRcdC8vIGlmIG9wdGlvbnMgYWxyZWFkeSBzZXR1cFxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zTG9hZGVkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAob3B0aW9ucykge1xyXG5cdFx0XHRcdHRoaXMub3B0aW9ucyA9IGFuZ3VsYXIubWVyZ2UodGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25zTG9hZGVkID0gdHJ1ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMgPSB0aGlzLmRlZmF1bHRzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpbXBvcnRhbnQhXHJcblx0XHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkNPTkZJR19MT0FELCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHYgPSB0aGlzLm5vcm1hbGl6ZSh2KTtcclxuXHRcdFx0bGV0IHByZXYgPSB0aGlzLl9zZWxlY3RlZDtcclxuXHJcblx0XHRcdHRoaXMuX3NlbGVjdGVkID0gdjtcclxuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XHJcblxyXG5cdFx0XHRpZiAocHJldiAhPT0gdGhpcy5fc2VsZWN0ZWQpIHtcclxuXHJcblx0XHRcdFx0dGhpcy50aHVtYm5haWxzTW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQ0hBTkdFX0lNQUdFLCB7XHJcblx0XHRcdFx0XHRpbmRleDogdixcclxuXHRcdFx0XHRcdGZpbGU6IHRoaXMuZmlsZVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gaW5kZXggPiB0aGlzLnNlbGVjdGVkID8gJ2ZvcndhcmQnIDogJ2JhY2t3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IGluZGV4O1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ28gdG8gYmFja3dhcmRcclxuXHRcdHB1YmxpYyB0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0aWYgKHN0b3ApIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQtLTtcclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCAtIDEpO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gZm9yd2FyZFxyXG5cdFx0cHVibGljIHRvRm9yd2FyZChzdG9wPyA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmIChzdG9wKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQrKztcclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCArIDEpO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gZmlyc3RcclxuXHRcdHB1YmxpYyB0b0ZpcnN0KHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0aWYgKHN0b3ApIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSAwO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gbGFzdFxyXG5cdFx0cHVibGljIHRvTGFzdChzdG9wPyA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmIChzdG9wKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLml0ZW1zLmxlbmd0aCAtIDE7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc2V0SGFzaCgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm1vZGFsVmlzaWJsZSkge1xyXG5cdFx0XHRcdHRoaXMubG9jYXRpb24uaGFzaChbdGhpcy5zbHVnLCB0aGlzLmlkLCB0aGlzLnNlbGVjdGVkICsgMV0uam9pbignLScpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlUb2dnbGUoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQpIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdGFydCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlTdG9wKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmludGVydmFsLmNhbmNlbCh0aGlzLmF1dG9wbGF5KTtcclxuXHRcdFx0dGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5hdXRvcGxheSA9IG51bGw7XHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQVVUT1BMQVlfU1RPUCwge2luZGV4OiB0aGlzLnNlbGVjdGVkLCBmaWxlOiB0aGlzLmZpbGV9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5U3RhcnQoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5hdXRvcGxheSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLmF1dG9wbGF5ID0gdGhpcy5pbnRlcnZhbCgoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy50b0ZvcndhcmQoKTtcclxuXHRcdFx0fSwgdGhpcy5vcHRpb25zLmF1dG9wbGF5LmRlbGF5KTtcclxuXHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQVVUT1BMQVlfU1RBUlQsIHtpbmRleDogdGhpcy5zZWxlY3RlZCwgZmlsZTogdGhpcy5maWxlfSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwcml2YXRlIHByZXBhcmVJdGVtcygpIHtcclxuXHJcblx0XHRcdGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0bGV0IGdldEF2YWlsYWJsZVNvdXJjZSA9IGZ1bmN0aW9uICh0eXBlIDogc3RyaW5nLCBzb3VyY2UgOiBJU291cmNlKSB7XHJcblxyXG5cdFx0XHRcdGlmIChzb3VyY2VbdHlwZV0pIHtcclxuXHRcdFx0XHRcdHJldHVybiBzb3VyY2VbdHlwZV07XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ3BhbmVsJykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGdldEF2YWlsYWJsZVNvdXJjZSgnaW1hZ2UnLCBzb3VyY2UpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdpbWFnZScpIHtcclxuXHRcdFx0XHRcdHJldHVybiBnZXRBdmFpbGFibGVTb3VyY2UoJ21vZGFsJywgc291cmNlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlID09PSAnbW9kYWwnKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZ2V0QXZhaWxhYmxlU291cmNlKCdpbWFnZScsIHNvdXJjZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fTtcclxuXHJcblxyXG5cdFx0XHRhbmd1bGFyLmZvckVhY2godGhpcy5pdGVtcywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcclxuXHJcblx0XHRcdFx0aWYgKCF2YWx1ZS5zb3VyY2UpIHtcclxuXHJcblx0XHRcdFx0XHR2YWx1ZS5zb3VyY2UgPSB7XHJcblx0XHRcdFx0XHRcdG1vZGFsOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5tb2RhbF0sXHJcblx0XHRcdFx0XHRcdHBhbmVsOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5wYW5lbF0sXHJcblx0XHRcdFx0XHRcdGltYWdlOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5pbWFnZV0sXHJcblx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBzb3VyY2UgPSB7XHJcblx0XHRcdFx0XHRtb2RhbDogc2VsZi5vcHRpb25zLmJhc2VVcmwgKyBnZXRBdmFpbGFibGVTb3VyY2UoJ21vZGFsJywgdmFsdWUuc291cmNlKSxcclxuXHRcdFx0XHRcdHBhbmVsOiBzZWxmLm9wdGlvbnMuYmFzZVVybCArIGdldEF2YWlsYWJsZVNvdXJjZSgncGFuZWwnLCB2YWx1ZS5zb3VyY2UpLFxyXG5cdFx0XHRcdFx0aW1hZ2U6IHNlbGYub3B0aW9ucy5iYXNlVXJsICsgZ2V0QXZhaWxhYmxlU291cmNlKCdpbWFnZScsIHZhbHVlLnNvdXJjZSksXHJcblx0XHRcdFx0fTtcclxuXHJcblxyXG5cdFx0XHRcdGxldCBwYXJ0cyA9IHNvdXJjZS5tb2RhbC5zcGxpdCgnLycpO1xyXG5cdFx0XHRcdGxldCBmaWxlbmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xyXG5cclxuXHRcdFx0XHRsZXQgdGl0bGUsIGRlc2NyaXB0aW9uO1xyXG5cclxuXHRcdFx0XHRpZiAoc2VsZi5vcHRpb25zLmZpZWxkcyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHR0aXRsZSA9IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aXRsZV0gOiBmaWxlbmFtZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGl0bGUgPSBmaWxlbmFtZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChzZWxmLm9wdGlvbnMuZmllbGRzICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uID0gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5kZXNjcmlwdGlvbl0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA6IG51bGw7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uID0gbnVsbDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBmaWxlID0ge1xyXG5cdFx0XHRcdFx0c291cmNlOiBzb3VyY2UsXHJcblx0XHRcdFx0XHR0aXRsZTogdGl0bGUsXHJcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRsb2FkZWQ6IHtcclxuXHRcdFx0XHRcdFx0bW9kYWw6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHRwYW5lbDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdGltYWdlOiBmYWxzZVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdHNlbGYuZmlsZXMucHVzaChmaWxlKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5QQVJTRV9JTUFHRVMsIHRoaXMuZmlsZXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGhvdmVyUHJlbG9hZChpbmRleCA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoaW5kZXgpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gaW1hZ2UgcHJlbG9hZFxyXG5cdFx0cHJpdmF0ZSBwcmVsb2FkKHdhaXQ/IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkKTtcclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCArIDEpO1xyXG5cdFx0XHR9LCAod2FpdCAhPT0gdW5kZWZpbmVkKSA/IHdhaXQgOiB0aGlzLm9wdGlvbnMucHJlbG9hZERlbGF5KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG5vcm1hbGl6ZShpbmRleCA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0bGV0IGxhc3QgPSB0aGlzLmZpbGVzLmxlbmd0aCAtIDE7XHJcblxyXG5cdFx0XHRpZiAoaW5kZXggPiBsYXN0KSB7XHJcblx0XHRcdFx0cmV0dXJuIChpbmRleCAtIGxhc3QpIC0gMTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGluZGV4IDwgMCkge1xyXG5cdFx0XHRcdHJldHVybiBsYXN0IC0gTWF0aC5hYnMoaW5kZXgpICsgMTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGluZGV4O1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGxvYWRJbWFnZXMoaW5kZXhlcyA6IEFycmF5PG51bWJlcj4sIHR5cGUgOiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdGlmICghaW5kZXhlcykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0aW5kZXhlcy5mb3JFYWNoKChpbmRleCA6IG51bWJlcikgPT4ge1xyXG5cdFx0XHRcdHNlbGYubG9hZEltYWdlKGluZGV4KTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbG9hZEltYWdlKGluZGV4PyA6IG51bWJlciwgY2FsbGJhY2s/IDoge30pIHtcclxuXHJcblx0XHRcdGluZGV4ID0gaW5kZXggPyBpbmRleCA6IHRoaXMuc2VsZWN0ZWQ7XHJcblx0XHRcdGluZGV4ID0gdGhpcy5ub3JtYWxpemUoaW5kZXgpO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmZpbGVzW2luZGV4XSkge1xyXG5cdFx0XHRcdHRoaXMubG9nKCdpbnZhbGlkIGZpbGUgaW5kZXgnLCB7aW5kZXg6IGluZGV4fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5maWxlc1tpbmRleF0ubG9hZGVkLm1vZGFsKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdFx0aW1hZ2Uuc3JjID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlLmltYWdlO1xyXG5cdFx0XHRpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYWZ0ZXJMb2FkKGluZGV4LCAnaW1hZ2UnLCBpbWFnZSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bGV0IG1vZGFsID0gbmV3IEltYWdlKCk7XHJcblx0XHRcdG1vZGFsLnNyYyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5tb2RhbDtcclxuXHRcdFx0bW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYWZ0ZXJMb2FkKGluZGV4LCAnbW9kYWwnLCBtb2RhbCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgZmlsZSBuYW1lXHJcblx0XHRwcml2YXRlIGdldEZpbGVuYW1lKGluZGV4IDogbnVtYmVyLCB0eXBlPyA6IHN0cmluZykge1xyXG5cclxuXHRcdFx0dHlwZSA9IHR5cGUgPyB0eXBlIDogJ21vZGFsJztcclxuXHRcdFx0bGV0IGZpbGVwYXJ0cyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZVt0eXBlXS5zcGxpdCgnLycpO1xyXG5cdFx0XHRsZXQgZmlsZW5hbWUgPSBmaWxlcGFydHNbZmlsZXBhcnRzLmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRyZXR1cm4gZmlsZW5hbWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBmaWxlIGV4dGVuc2lvblxyXG5cdFx0cHJpdmF0ZSBnZXRFeHRlbnNpb24oaW5kZXggOiBudW1iZXIsIHR5cGU/IDogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHR0eXBlID0gdHlwZSA/IHR5cGUgOiAnbW9kYWwnO1xyXG5cdFx0XHRsZXQgZmlsZXBhcnRzID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlW3R5cGVdLnNwbGl0KCcuJyk7XHJcblx0XHRcdGxldCBleHRlbnNpb24gPSBmaWxlcGFydHNbZmlsZXBhcnRzLmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRyZXR1cm4gZXh0ZW5zaW9uO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBhZnRlciBsb2FkIGltYWdlXHJcblx0XHRwcml2YXRlIGFmdGVyTG9hZChpbmRleCwgdHlwZSwgaW1hZ2UpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWRbdHlwZV0gPT09IHRydWUpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZFt0eXBlXSA9IHRydWU7XHJcblxyXG5cdFx0XHRpZiAodHlwZSA9PT0gJ21vZGFsJykge1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLndpZHRoID0gaW1hZ2Uud2lkdGg7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0uaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLm5hbWUgPSB0aGlzLmdldEZpbGVuYW1lKGluZGV4LCB0eXBlKTtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5leHRlbnNpb24gPSB0aGlzLmdldEV4dGVuc2lvbihpbmRleCwgdHlwZSk7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0uZG93bmxvYWQgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2UubW9kYWw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBkYXRhID0ge3R5cGU6IHR5cGUsIGluZGV4OiBpbmRleCwgZmlsZTogdGhpcy5maWxlLCBpbWc6IGltYWdlfTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5maXJzdCkge1xyXG5cdFx0XHRcdHRoaXMuZmlyc3QgPSB0cnVlO1xyXG5cdFx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuRklSU1RfSU1BR0UsIGRhdGEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkxPQURfSU1BR0UsIGRhdGEpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gaXMgc2luZ2xlP1xyXG5cdFx0cHVibGljIGdldCBpc1NpbmdsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmZpbGVzLmxlbmd0aCA+IDEgPyBmYWxzZSA6IHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgdGhlIGRvd25sb2FkIGxpbmtcclxuXHRcdHB1YmxpYyBkb3dubG9hZExpbmsoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5zZWxlY3RlZCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZmlsZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdLnNvdXJjZS5tb2RhbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZSBmaWxlXHJcblx0XHRwdWJsaWMgZ2V0IGZpbGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlc1t0aGlzLnNlbGVjdGVkXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGVsZW1lbnQgdmlzaWJsZVxyXG5cdFx0cHVibGljIHRvZ2dsZShlbGVtZW50IDogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnNbZWxlbWVudF0udmlzaWJsZSA9ICF0aGlzLm9wdGlvbnNbZWxlbWVudF0udmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgZ2V0IG1vZGFsVmlzaWJsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLl92aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZW1lXHJcblx0XHRwdWJsaWMgZ2V0IHRoZW1lKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucy50aGVtZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHNldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgc2V0IG1vZGFsVmlzaWJsZSh2YWx1ZSA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcclxuXHJcblx0XHRcdGlmICh2YWx1ZSkge1xyXG5cclxuXHRcdFx0XHR0aGlzLnByZWxvYWQoMSk7XHJcblx0XHRcdFx0dGhpcy5tb2RhbEluaXQoKTtcclxuXHRcdFx0XHR0aGlzLmVsKCdib2R5JykuYWRkQ2xhc3MoJ3loaWRkZW4nKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdHRoaXMuZWwoJ2JvZHknKS5yZW1vdmVDbGFzcygneWhpZGRlbicpO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBpbml0aWFsaXplIHRoZSBnYWxsZXJ5XHJcblx0XHRwcml2YXRlIG1vZGFsSW5pdCgpIHtcclxuXHJcblx0XHRcdGxldCBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblxyXG5cdFx0XHRcdC8vIHN1Ym1lbnUgY2xpY2sgZXZlbnRzXHJcblx0XHRcdFx0bGV0IGVsZW1lbnQgPSAnLmFzZy1tb2RhbC4nICsgc2VsZi5pZCArICcgbGkuZHJvcGRvd24tc3VibWVudSc7XHJcblxyXG5cdFx0XHRcdHRoaXMuZWwoZWxlbWVudCkub2ZmKCkub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblxyXG5cdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuZWwoZWxlbWVudCkuaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVsKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVsKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHRcdHRoaXMuZWwoZWxlbWVudCkuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdHNlbGYuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHRcdH0sIDEwMCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbW9kYWxPcGVuKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMubW9kYWxBdmFpbGFibGUpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleCA/IGluZGV4IDogdGhpcy5zZWxlY3RlZDtcclxuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5NT0RBTF9PUEVOLCB7aW5kZXg6IHRoaXMuc2VsZWN0ZWR9KTtcclxuXHRcdFx0dGhpcy5zZXRGb2N1cygpO1xyXG5cdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKDIwMCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBtb2RhbENsb3NlKCkge1xyXG5cclxuXHRcdFx0dGhpcy5sb2NhdGlvbi5oYXNoKCcnKTtcclxuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5NT0RBTF9DTE9TRSwge2luZGV4OiB0aGlzLnNlbGVjdGVkfSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG1vdmUgdGh1bWJuYWlscyB0byBjb3JyZWN0IHBvc2l0aW9uXHJcblx0XHRwdWJsaWMgdGh1bWJuYWlsc01vdmUoZGVsYXk/IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRsZXQgbW92ZSA9ICgpID0+IHtcclxuXHJcblx0XHRcdFx0bGV0IGNvbnRhaW5lcnMgPSB0aGlzLmVsKCcuYXNnLXRodW1ibmFpbC4nICsgdGhpcy5pZCk7XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY29udGFpbmVycy5sZW5ndGg7IGkrKykge1xyXG5cclxuXHRcdFx0XHRcdGxldCBjb250YWluZXIgPSBjb250YWluZXJzW2ldO1xyXG5cclxuXHRcdFx0XHRcdGlmIChjb250YWluZXIub2Zmc2V0V2lkdGgpIHtcclxuXHJcblx0XHRcdFx0XHRcdGxldCBpdGVtcyA6IGFueSA9IHRoaXMuZWwoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5pdGVtcycpKVswXTtcclxuXHRcdFx0XHRcdFx0bGV0IGl0ZW0gOiBhbnkgPSB0aGlzLmVsKGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuaXRlbScpKVswXTtcclxuXHRcdFx0XHRcdFx0bGV0IHRodW1ibmFpbCwgbW92ZVgsIHJlbWFpbjtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChpdGVtKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChpdGVtcy5zY3JvbGxXaWR0aCA+IGNvbnRhaW5lci5vZmZzZXRXaWR0aCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGh1bWJuYWlsID0gaXRlbXMuc2Nyb2xsV2lkdGggLyB0aGlzLmZpbGVzLmxlbmd0aDtcclxuXHRcdFx0XHRcdFx0XHRcdG1vdmVYID0gKGNvbnRhaW5lci5vZmZzZXRXaWR0aCAvIDIpIC0gKHRoaXMuc2VsZWN0ZWQgKiB0aHVtYm5haWwpIC0gdGh1bWJuYWlsIC8gMjtcclxuXHRcdFx0XHRcdFx0XHRcdHJlbWFpbiA9IGl0ZW1zLnNjcm9sbFdpZHRoICsgbW92ZVg7XHJcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IG1vdmVYID4gMCA/IDAgOiBtb3ZlWDtcclxuXHRcdFx0XHRcdFx0XHRcdG1vdmVYID0gcmVtYWluIDwgY29udGFpbmVyLm9mZnNldFdpZHRoID8gY29udGFpbmVyLm9mZnNldFdpZHRoIC0gaXRlbXMuc2Nyb2xsV2lkdGggOiBtb3ZlWDtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGh1bWJuYWlsID0gdGhpcy5nZXRSZWFsV2lkdGgoaXRlbSk7XHJcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IChjb250YWluZXIub2Zmc2V0V2lkdGggLSB0aHVtYm5haWwgKiB0aGlzLmZpbGVzLmxlbmd0aCkgLyAyO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aXRlbXMuc3R5bGUubGVmdCA9IG1vdmVYICsgJ3B4JztcclxuXHJcblx0XHRcdFx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5USFVNQk5BSUxfTU9WRSwge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGh1bWJuYWlsOiB0aHVtYm5haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRtb3ZlOiBtb3ZlWCxcclxuXHRcdFx0XHRcdFx0XHRcdHJlbWFpbjogcmVtYWluLFxyXG5cdFx0XHRcdFx0XHRcdFx0Y29udGFpbmVyOiBjb250YWluZXIub2Zmc2V0V2lkdGgsXHJcblx0XHRcdFx0XHRcdFx0XHRpdGVtczogaXRlbXMuc2Nyb2xsV2lkdGhcclxuXHRcdFx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKGRlbGF5KSB7XHJcblx0XHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdG1vdmUoKTtcclxuXHRcdFx0XHR9LCBkZWxheSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bW92ZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgbW9kYWxDbGljaygkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKCRldmVudCkge1xyXG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5zZXRGb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdGhlIGZvY3VzXHJcblx0XHRwdWJsaWMgc2V0Rm9jdXMoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5tb2RhbFZpc2libGUpIHtcclxuXHRcdFx0XHR0aGlzLmVsKCcuYXNnLW1vZGFsLicgKyB0aGlzLmlkICsgJyAua2V5SW5wdXQnKS50cmlnZ2VyKCdmb2N1cycpLmZvY3VzKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBldmVudChldmVudCA6IHN0cmluZywgZGF0YT8gOiBhbnkpIHtcclxuXHJcblx0XHRcdGV2ZW50ID0gZXZlbnQgKyB0aGlzLmlkO1xyXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJGVtaXQoZXZlbnQsIGRhdGEpO1xyXG5cdFx0XHR0aGlzLmxvZyhldmVudCwgZGF0YSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBsb2coZXZlbnQgOiBzdHJpbmcsIGRhdGE/IDogYW55KSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmRlYnVnKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXZlbnQsIGRhdGEgPyBkYXRhIDogbnVsbCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGVsKHNlbGVjdG9yKSA6IGFueSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gYW5ndWxhci5lbGVtZW50KHNlbGVjdG9yKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRpbmcgZWxlbWVudCByZWFsIHdpZHRoXHJcblx0XHRwdWJsaWMgZ2V0UmVhbFdpZHRoKGl0ZW0pIHtcclxuXHJcblx0XHRcdGxldCBzdHlsZSA9IGl0ZW0uY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGl0ZW0pLFxyXG5cdFx0XHRcdHdpZHRoID0gaXRlbS5vZmZzZXRXaWR0aCxcclxuXHRcdFx0XHRtYXJnaW4gPSBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkxlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5SaWdodCksXHJcblx0XHRcdFx0Ly9wYWRkaW5nID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdSaWdodCksXHJcblx0XHRcdFx0Ym9yZGVyID0gcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJMZWZ0V2lkdGgpICsgcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJSaWdodFdpZHRoKTtcclxuXHJcblx0XHRcdHJldHVybiB3aWR0aCArIG1hcmdpbiArIGJvcmRlcjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRpbmcgZWxlbWVudCByZWFsIGhlaWdodFxyXG5cdFx0cHVibGljIGdldFJlYWxIZWlnaHQoaXRlbSkge1xyXG5cclxuXHRcdFx0bGV0IHN0eWxlID0gaXRlbS5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUoaXRlbSksXHJcblx0XHRcdFx0aGVpZ2h0ID0gaXRlbS5vZmZzZXRIZWlnaHQsXHJcblx0XHRcdFx0bWFyZ2luID0gcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Ub3ApICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Cb3R0b20pLFxyXG5cdFx0XHRcdC8vcGFkZGluZyA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1RvcCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pLFxyXG5cdFx0XHRcdGJvcmRlciA9IHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyVG9wV2lkdGgpICsgcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gaGVpZ2h0ICsgbWFyZ2luICsgYm9yZGVyO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5zZXJ2aWNlKCdhc2dTZXJ2aWNlJywgWyckdGltZW91dCcsICckaW50ZXJ2YWwnLCAnJGxvY2F0aW9uJywgJyRyb290U2NvcGUnLCAnJHdpbmRvdycsIFNlcnZpY2VDb250cm9sbGVyXSk7XHJcblxyXG59XHJcblxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBUaHVtYm5haWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cclxuXHRcdHByaXZhdGUgdHlwZSA9ICd0aHVtYm5haWwnO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZSA9ICd2aWV3cy9hc2ctdGh1bWJuYWlsLmh0bWwnO1xyXG5cdFx0cHJpdmF0ZSBhc2cgOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblx0XHRwcml2YXRlIG1vZGFsID0gZmFsc2U7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkc2NvcGUgOiBuZy5JU2NvcGUsXHJcblx0XHRcdFx0XHRwcml2YXRlICRlbGVtZW50IDogbmcuSVJvb3RFbGVtZW50U2VydmljZSkge1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHBhcmVudCBhc2cgY29tcG9uZW50IChtb2RhbClcclxuXHRcdFx0aWYgKHRoaXMuJHNjb3BlICYmIHRoaXMuJHNjb3BlLiRwYXJlbnQgJiYgdGhpcy4kc2NvcGUuJHBhcmVudC4kcGFyZW50ICYmIHRoaXMuJHNjb3BlLiRwYXJlbnQuJHBhcmVudC4kY3RybCkge1xyXG5cdFx0XHRcdHRoaXMubW9kYWwgPSB0aGlzLiRzY29wZS4kcGFyZW50LiRwYXJlbnQuJGN0cmwudHlwZSA9PSAnbW9kYWwnID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBhYm92ZSBmcm9tIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBhYm92ZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5hYm92ZSA/ICdhYm92ZScgOiBudWxsO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXRTZWxlY3RlZChpbmRleCA6IG51bWJlciwgJGV2ZW50PyA6IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgdGh1bWJuYWlsIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKSA6IElPcHRpb25zVGh1bWJuYWlsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLm1vZGFsID8gdGhpcy5hc2cub3B0aW9uc1snbW9kYWwnXVt0aGlzLnR5cGVdIDogdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdGh1bWJuYWlsIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc1RodW1ibmFpbCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubW9kYWwpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5vcHRpb25zWydtb2RhbCddW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnVGh1bWJuYWlsJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsICckZWxlbWVudCcsIGFuZ3VsYXJTdXBlckdhbGxlcnkuVGh1bWJuYWlsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgbmctc2hvdz1cIiRjdHJsLmNvbmZpZy52aXNpYmxlXCIgY2xhc3M9XCJhc2ctdGh1bWJuYWlsIHt7ICRjdHJsLmFzZy50aGVtZSB9fSB7eyAkY3RybC5pZCB9fSB7eyAkY3RybC5hYm92ZSB9fVwiIG5nLWNsaWNrPVwiJGN0cmwuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcIj48ZGl2IG5nLWluY2x1ZGU9XCIkY3RybC50ZW1wbGF0ZVwiPjwvZGl2PjwvZGl2PicsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0AnLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiJdfQ==

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/asg-control.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.autoPlayToggle()">\r\n\t<span ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t<span ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toFirst(true)">\r\n\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toBackward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toForward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n</button>\r\n\r\n');
$templateCache.put('views/asg-image.html','<div class="asg-image {{ $ctrl.asg.theme }} {{ $ctrl.id }}" ng-class="{\'nomodal\' : !$ctrl.asg.modalAvailable}" ng-style="{\'min-height\' : $ctrl.config.heightMin + \'px\', \'height\' : $ctrl.height + \'px\'}">\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)">\r\n\r\n\t\t<div class="img" ng-repeat="(key,file) in $ctrl.asg.files" ng-show="$ctrl.asg.selected == key" ng-class="{\'loading\' : !file.loaded.image}">\r\n\r\n\t\t\t<div class="source {{ $ctrl.config.size }}" ng-style="{\'background-image\': \'url(\' + file.source.image + \')\'}" ng-if="file.loaded.image" ng-mouseover="$ctrl.asg.hoverPreload(key)" ng-click="$ctrl.asg.modalOpen()"></div>\r\n\r\n\t\t</div>\r\n\t</div>\r\n\t<ng-transclude></ng-transclude>\r\n</div>\r\n\r\n\r\n\r\n');
$templateCache.put('views/asg-info.html','<div class="row">\r\n\r\n\t<div class="col-md-12">\r\n\t\t<h3>{{ $ctrl.file.title }}</h3>\r\n\t</div>\r\n\r\n\t<div class="col-md-12">\r\n\t\t{{ $ctrl.file.description }}\r\n\t\t<a target="_blank" href="{{ $ctrl.download }}"><span class="glyphicon glyphicon-download"></span></a>\r\n\t</div>\r\n\r\n</div>\r\n\r\n\r\n');
$templateCache.put('views/asg-modal.html','<script type="text/ng-template" id="help.html">\r\n\t<ul>\r\n\t\t<li>SPACE : forward</li>\r\n\t\t<li>RIGHT : forward</li>\r\n\t\t<li>LEFT : backward</li>\r\n\t\t<li>UP / HOME : first</li>\r\n\t\t<li>DOWN / END : last</li>\r\n\t\t<li>ENTER : toggle fullscreen</li>\r\n\t\t<li>ESC : exit</li>\r\n\t\t<li>p : play/pause</li>\r\n\t\t<li>t : change transition effect</li>\r\n\t\t<li>m : toggle menu</li>\r\n\t\t<li>s : toggle image size</li>\r\n\t\t<li>c : toggle caption</li>\r\n\t\t<li>h : toggle help</li>\r\n\t</ul>\r\n</script>\r\n\r\n<div class="asg-modal {{ $ctrl.id }}" ng-class="$ctrl.getClass()" ng-click="$ctrl.close($event);" ng-show="$ctrl.asg.modalVisible" ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="frame" ng-click="$ctrl.asg.modalClick($event);">\r\n\r\n\t\t<div class="header" ng-click="$ctrl.asg.modalClick($event);">\r\n\r\n\t\t\t<span class="buttons visible-xs pull-right">\r\n\t\t\t\t <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs">\r\n\t\t\t\t\t\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n\t\t\t\t </button>\r\n\t\t\t</span>\r\n\r\n\t\t\t<span class="buttons hidden-xs pull-right">\r\n\r\n\t\t\t   <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.autoPlayToggle($event)">\r\n                    <span ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t\t\t\t   <span ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n                </button>\r\n\r\n                <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toFirst(true, $event)">\r\n                    {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n                </button>\r\n\r\n                <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toBackward(true, $event)">\r\n                    <span class="glyphicon glyphicon-chevron-left"></span>\r\n                </button>\r\n\r\n                <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toForward(true, $event)">\r\n                    <span class="glyphicon glyphicon-chevron-right"></span>\r\n                </button>\r\n\r\n             <span ng-if="!$ctrl.asg.isSingle && false" class="dropdown">\r\n                    <button class="btn btn-default btn-sm dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                        <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu pull-right">\r\n                        <li class="dropdown-submenu">\r\n                            <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" ng-click="$ctrl.setTransition(transition, $event)" ng-repeat="transition in $ctrl.asg.transitions">\r\n                                    <span ng-class="{\'highlight\' : transition == $ctrl.config.transition}">\r\n                                        {{ transition }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" ng-click="$ctrl.setTheme(theme, $event)" ng-repeat="theme in $ctrl.themes">\r\n                                    <span ng-class="{\'highlight\' : theme == $ctrl.asg.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                        <li><a href="#" tabindex="-1" ng-click="$ctrl.toggleHelp($event)">Help</a></li>\r\n                    </ul>\r\n                </span>\r\n\r\n\r\n                <button class="btn btn-default btn-sm" ng-click="$ctrl.toggleMenu($event)">\r\n                    <span ng-if="$ctrl.config.menu" class="glyphicon glyphicon-chevron-up"></span>\r\n                    <span ng-if="!$ctrl.config.menu" class="glyphicon glyphicon-chevron-down"></span>\r\n                </button>\r\n\r\n\t\t\t \t<button class="btn btn-default btn-sm btn-size" ng-click="$ctrl.toggleSize($event)">\r\n                    {{ $ctrl.config.size }}\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm hidden-xs btn-transitions" data-ng-if="!$ctrl.asg.isSingle" data-ng-click="$ctrl.nextTransition($event)">\r\n                    {{ $ctrl.config.transition }}\r\n                </button>\r\n\r\n\t\t\t\t<!--button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toggleThumbnails($event)">\r\n\t\t\t\t   <span class="glyphicon glyphicon-option-horizontal"></span>\r\n\t\t\t   </button-->\r\n\r\n                <button class="btn btn-default btn-sm" ng-click="$ctrl.toggleFullScreen($event)">\r\n                    <span class="glyphicon glyphicon-fullscreen"></span>\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleHelp($event)">\r\n                    <span class="glyphicon glyphicon-question-sign"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" ng-click="$ctrl.close($event)">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n\r\n            </span>\r\n\r\n\t\t\t<span ng-if="$ctrl.config.title">\r\n\t\t\t\t<span class="title">{{ $ctrl.config.title }}</span>\r\n\t\t\t\t<span class="subtitle hidden-xs" ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span>\r\n\t\t\t</span>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div class="help text-right" ng-click="$ctrl.toggleHelp($event)" ng-show="$ctrl.config.help" ng-include src="\'help.html\'"></div>\r\n\r\n\t\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}" ng-style="{\'top\': $ctrl.marginTop + \'px\', \'bottom\': $ctrl.marginBottom + \'px\'}" ng-mouseover="$ctrl.asg.over.modalImage = true;" ng-mouseleave="$ctrl.asg.over.modalImage = false;">\r\n\r\n\t\t\t<div class="arrows" ng-mouseover="$ctrl.arrowsShow()" ng-mouseleave="$ctrl.arrowsHide()" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.close($event)">\r\n\r\n\t\t\t\t<div ng-if="!$ctrl.asg.isSingle" ng-show="$ctrl.arrowsVisible" class="toBackward">\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<div ng-if="!$ctrl.asg.isSingle" ng-show="$ctrl.arrowsVisible" class="toForward">\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t</div>\r\n\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class="img" ng-repeat="(key,file) in $ctrl.asg.files" ng-show="$ctrl.asg.selected == key" ng-class="{\'loading\' : !file.loaded.modal}">\r\n\r\n\t\t\t\t<div class="source {{ $ctrl.config.size }}" ng-style="{\'background-image\': \'url(\' + file.source.modal + \')\'}" ng-if="file.loaded.modal"></div>\r\n\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class="caption {{ $ctrl.config.caption.position }}" ng-class="{\'visible\' : $ctrl.config.caption.visible}">\r\n\t\t\t\t<div class="content">\r\n\t\t\t\t\t<span class="title">{{ $ctrl.asg.file.title }}</span>\r\n\t\t\t\t\t<span ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description"> - </span>\r\n\t\t\t\t\t<span class="description">{{ $ctrl.asg.file.description }}</span>\r\n\t\t\t\t\t<a href="{{ $ctrl.asg.downloadLink() }}" target="_blank" class="btn btn-default btn-xs">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-download"></span> Download\r\n\t\t\t\t\t</a>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\r\n\t\t</div>\r\n\r\n\t\t<ng-transclude></ng-transclude>\r\n\r\n\t</div>\r\n\r\n</div>');
$templateCache.put('views/asg-panel.html','<div ng-repeat="(key,file) in $ctrl.asg.files" class="item {{ $ctrl.asg.options.panel.item.class }}" ng-class="{\'selected\' : $ctrl.asg.selected == key}" ng-mouseover="indexShow = true" ng-mouseleave="indexShow = false">\r\n\r\n\t<img ng-src="{{ file.source.panel }}" ng-click="$ctrl.setSelected(key, $event)" ng-mouseover="$ctrl.asg.hoverPreload(key)" alt="{{ file.title }}">\r\n\t<span class="index" ng-if="$ctrl.config.item.index && indexShow">{{ key + 1 }}</span>\r\n\r\n\t<div class="caption" ng-if="$ctrl.config.item.caption">\r\n\t\t<span>{{ file.title }}</span>\r\n\t</div>\r\n\r\n</div>');
$templateCache.put('views/asg-thumbnail.html','<div class="items">\r\n\t<div class="item" ng-click="$ctrl.setSelected(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files" ng-class="{\'selected\' : $ctrl.asg.selected == key}">\r\n\r\n\t\t<img ng-src="{{ file.source.panel }}" ng-mouseover="$ctrl.asg.hoverPreload(key)" ng-style="{\'height\': $ctrl.config.height + \'px\'}" alt="{{ file.title }}">\r\n\r\n\t\t<span class="index" ng-if="$ctrl.config.index">{{ key + 1 }}</span>\r\n\r\n\t</div>\r\n</div>\r\n');}]);