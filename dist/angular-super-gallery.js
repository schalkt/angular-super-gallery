/**
 * angular-super-gallery - AngularJS Super Gallery
 * 
 * @version v1.1.2
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
                _this.asg.thumbnailsMove(200);
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
        ImageController.prototype.toBackward = function (stop, $event) {
            if ($event) {
                $event.stopPropagation();
            }
            this.asg.toBackward(stop);
        };
        ImageController.prototype.toForward = function (stop, $event) {
            if ($event) {
                $event.stopPropagation();
            }
            this.asg.toForward(stop);
        };
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
            selected: '=?',
            baseUrl: '@?'
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
            this.config.thumbnail.dynamic = !this.config.thumbnail.dynamic;
        };
        ModalController.prototype.setTransition = function (transition, $event) {
            this.asg.modalClick($event);
            this.config.transition = transition;
        };
        ModalController.prototype.setTheme = function (theme, $event) {
            this.asg.modalClick($event);
            this.asg.options.theme = theme;
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
            visible: '=?',
            baseUrl: '@?'
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
            if (this.config.click.modal) {
                this.asg.modalOpen(index);
                return;
            }
            if (this.config.click.select) {
                this.asg.setSelected(index);
            }
        };
        PanelController.prototype.hover = function (index, $event) {
            this.asg.hoverPreload(index);
            if (this.config.hover.select === true) {
                this.asg.setSelected(index);
            }
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
        template: '<div class="asg-panel {{ $ctrl.asg.theme }}" ng-mouseover="$ctrl.asg.over.panel = true;" ng-mouseleave="$ctrl.asg.over.panel = false;" ng-show="$ctrl.config.visible"><div ng-include="$ctrl.template"></div><ng-transclude></ng-transclude></div>',
        transclude: true,
        bindings: {
            id: '@',
            items: '=?',
            options: '=?',
            selected: '=?',
            visible: '=?',
            template: '@?',
            baseUrl: '@?'
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
                    arrows: true,
                    thumbnail: {
                        height: 50,
                        index: false,
                        dynamic: false,
                        click: {
                            select: true,
                            modal: false
                        },
                        hover: {
                            select: false
                        },
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
                    index: false,
                    dynamic: false,
                    click: {
                        select: true,
                        modal: false
                    },
                    hover: {
                        select: false
                    },
                },
                panel: {
                    visible: true,
                    item: {
                        class: 'col-md-3',
                        caption: false,
                        index: false,
                    },
                    hover: {
                        select: false
                    },
                    click: {
                        select: false,
                        modal: true
                    },
                },
                image: {
                    transition: 'slideLR',
                    size: 'cover',
                    arrows: true,
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
                _this.thumbnailsMove(200);
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
            if (component.baseUrl) {
                component.options.baseUrl = component.baseUrl;
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
            this.setHash();
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
            this.selected = index !== undefined ? index : this.selected;
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
        Object.defineProperty(ThumbnailController.prototype, "dynamic", {
            get: function () {
                return this.config.dynamic ? 'dynamic' : null;
            },
            enumerable: true,
            configurable: true
        });
        ThumbnailController.prototype.setSelected = function (index, $event) {
            this.asg.modalClick($event);
            if (this.config.click.modal) {
                this.asg.modalOpen(index);
                return;
            }
            if (this.config.click.select) {
                this.asg.setSelected(index);
            }
        };
        ThumbnailController.prototype.hover = function (index, $event) {
            this.asg.hoverPreload(index);
            if (this.config.hover.select === true) {
                this.asg.setSelected(index);
            }
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
        template: '<div ng-show="$ctrl.config.visible" class="asg-thumbnail {{ $ctrl.asg.theme }} {{ $ctrl.id }} {{ $ctrl.dynamic }}" ng-click="$ctrl.asg.modalClick($event);"><div ng-include="$ctrl.template"></div></div>',
        bindings: {
            id: '@',
            items: '=?',
            options: '=?',
            selected: '=?',
            visible: '=?',
            template: '@?',
            baseUrl: '@?'
        }
    });
})(angularSuperGallery || (angularSuperGallery = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzZy50cyIsImFzZy1jb250cm9sLnRzIiwiYXNnLWltYWdlLnRzIiwiYXNnLWluZm8udHMiLCJhc2ctbW9kYWwudHMiLCJhc2ctcGFuZWwudHMiLCJhc2ctc2VydmljZS50cyIsImFzZy10aHVtYm5haWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBVSxtQkFBbUIsQ0EyQjVCO0FBM0JELFdBQVUsbUJBQW1CO0lBRTVCLElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFdkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDdEIsTUFBTSxDQUFDLFVBQVUsS0FBVyxFQUFFLFNBQWtCO1lBRS9DLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDWCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDWixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsU0FBUyxHQUFHLENBQUMsQ0FBQztZQUNmLENBQUM7WUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5RixDQUFDLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUVKLENBQUMsRUEzQlMsbUJBQW1CLEtBQW5CLG1CQUFtQixRQTJCNUI7O0FDN0JELElBQVUsbUJBQW1CLENBaUY1QjtBQWpGRCxXQUFVLG1CQUFtQjtJQUU1QjtRQU9DLDJCQUFvQixPQUE0QixFQUNyQyxNQUFrQjtZQURULFlBQU8sR0FBUCxPQUFPLENBQXFCO1lBQ3JDLFdBQU0sR0FBTixNQUFNLENBQVk7WUFMckIsU0FBSSxHQUFHLFNBQVMsQ0FBQztZQUVqQixhQUFRLEdBQUcsd0JBQXdCLENBQUM7UUFLNUMsQ0FBQztRQUVNLG1DQUFPLEdBQWQ7WUFBQSxpQkFhQztZQVZBLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUc7Z0JBQ3JCLEtBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQztZQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHO2dCQUN0QixLQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUM7UUFFSCxDQUFDO1FBSUQsc0JBQVcscUNBQU07aUJBQWpCO2dCQUVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFcEMsQ0FBQztpQkFHRCxVQUFrQixLQUFxQjtnQkFFdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUVyQyxDQUFDOzs7V0FQQTtRQVVELHNCQUFXLHVDQUFRO2lCQVduQjtnQkFFQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQztnQkFDUixDQUFDO2dCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztZQUUxQixDQUFDO2lCQW5CRCxVQUFvQixDQUFVO2dCQUU3QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQztnQkFDUixDQUFDO2dCQUVELElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUV2QixDQUFDOzs7V0FBQTtRQWNGLHdCQUFDO0lBQUQsQ0FqRUEsQUFpRUMsSUFBQTtJQWpFWSxxQ0FBaUIsb0JBaUU3QixDQUFBO0lBRUQsSUFBSSxHQUFHLEdBQWdCLE9BQU8sQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUU3RCxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRTtRQUMzQixVQUFVLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixDQUFDLGlCQUFpQixDQUFDO1FBQzNFLFFBQVEsRUFBRSw4RkFBOEY7UUFDeEcsUUFBUSxFQUFFO1lBQ1QsRUFBRSxFQUFFLElBQUk7WUFDUixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFBRSxJQUFJO1NBQ2Q7S0FDRCxDQUFDLENBQUM7QUFFSixDQUFDLEVBakZTLG1CQUFtQixLQUFuQixtQkFBbUIsUUFpRjVCOztBQ2pGRCxJQUFVLG1CQUFtQixDQTZJNUI7QUE3SUQsV0FBVSxtQkFBbUI7SUFFNUI7UUFVQyx5QkFBb0IsT0FBNEIsRUFDckMsVUFBaUMsRUFDakMsUUFBaUMsRUFDakMsT0FBMkIsRUFDM0IsTUFBa0I7WUFKN0IsaUJBVUM7WUFWbUIsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7WUFDckMsZUFBVSxHQUFWLFVBQVUsQ0FBdUI7WUFDakMsYUFBUSxHQUFSLFFBQVEsQ0FBeUI7WUFDakMsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7WUFDM0IsV0FBTSxHQUFOLE1BQU0sQ0FBWTtZQVByQixTQUFJLEdBQUcsT0FBTyxDQUFDO1lBU3RCLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLEtBQUs7Z0JBQzdDLEtBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztRQUVKLENBQUM7UUFFTyxrQ0FBUSxHQUFoQjtZQUVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixDQUFDO1FBRUYsQ0FBQztRQUVNLGlDQUFPLEdBQWQ7WUFBQSxpQkFnQkM7WUFiQSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRzFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLFVBQUMsS0FBSyxFQUFFLElBQUk7Z0JBRXRFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3BFLEtBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQixDQUFDO2dCQUVELEtBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRTlCLENBQUMsQ0FBQyxDQUFDO1FBRUosQ0FBQztRQUdPLG1DQUFTLEdBQWpCLFVBQWtCLEdBQUc7WUFFcEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO1lBQ3pELElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRXBDLENBQUM7UUFHRCxzQkFBVyxtQ0FBTTtpQkFBakI7Z0JBRUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBRTNCLENBQUM7OztXQUFBO1FBSUQsc0JBQVcsbUNBQU07aUJBQWpCO2dCQUVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFcEMsQ0FBQztpQkFHRCxVQUFrQixLQUFxQjtnQkFFdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUVyQyxDQUFDOzs7V0FQQTtRQVNNLG9DQUFVLEdBQWpCLFVBQWtCLElBQWUsRUFBRSxNQUFpQjtZQUVuRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNaLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUMxQixDQUFDO1lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFM0IsQ0FBQztRQUVNLG1DQUFTLEdBQWhCLFVBQWlCLElBQWUsRUFBRSxNQUFpQjtZQUVsRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNaLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUMxQixDQUFDO1lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUIsQ0FBQztRQUdELHNCQUFXLHFDQUFRO2lCQVduQjtnQkFFQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQztnQkFDUixDQUFDO2dCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztZQUUxQixDQUFDO2lCQW5CRCxVQUFvQixDQUFVO2dCQUU3QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQztnQkFDUixDQUFDO2dCQUVELElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUV2QixDQUFDOzs7V0FBQTtRQWFGLHNCQUFDO0lBQUQsQ0F6SEEsQUF5SEMsSUFBQTtJQXpIWSxtQ0FBZSxrQkF5SDNCLENBQUE7SUFFRCxJQUFJLEdBQUcsR0FBZ0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRTdELEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFO1FBQ3pCLFVBQVUsRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLENBQUMsZUFBZSxDQUFDO1FBQzlHLFdBQVcsRUFBRSxzQkFBc0I7UUFDbkMsVUFBVSxFQUFFLElBQUk7UUFDaEIsUUFBUSxFQUFFO1lBQ1QsRUFBRSxFQUFFLElBQUk7WUFDUixLQUFLLEVBQUUsSUFBSTtZQUNYLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUUsSUFBSTtTQUNiO0tBQ0QsQ0FBQyxDQUFDO0FBR0osQ0FBQyxFQTdJUyxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBNkk1Qjs7QUM3SUQsSUFBVSxtQkFBbUIsQ0F1QzVCO0FBdkNELFdBQVUsbUJBQW1CO0lBRTVCO1FBT0Msd0JBQW9CLE9BQTRCLEVBQ3JDLE1BQWtCO1lBRFQsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7WUFDckMsV0FBTSxHQUFOLE1BQU0sQ0FBWTtZQUxyQixTQUFJLEdBQUcsTUFBTSxDQUFDO1lBRWQsYUFBUSxHQUFHLHFCQUFxQixDQUFDO1FBS3pDLENBQUM7UUFFTSxnQ0FBTyxHQUFkO1lBR0MsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUzQyxDQUFDO1FBRUQsc0JBQVcsZ0NBQUk7aUJBQWY7Z0JBQ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3RCLENBQUM7OztXQUFBO1FBRUYscUJBQUM7SUFBRCxDQXZCQSxBQXVCQyxJQUFBO0lBdkJZLGtDQUFjLGlCQXVCMUIsQ0FBQTtJQUVELElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFFN0QsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7UUFDeEIsVUFBVSxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxjQUFjLENBQUM7UUFDeEUsUUFBUSxFQUFFLDJGQUEyRjtRQUNyRyxVQUFVLEVBQUUsSUFBSTtRQUNoQixRQUFRLEVBQUU7WUFDVCxFQUFFLEVBQUUsSUFBSTtZQUNSLFFBQVEsRUFBRSxJQUFJO1NBQ2Q7S0FDRCxDQUFDLENBQUM7QUFFSixDQUFDLEVBdkNTLG1CQUFtQixLQUFuQixtQkFBbUIsUUF1QzVCOztBQ3ZDRCxJQUFVLG1CQUFtQixDQXFXNUI7QUFyV0QsV0FBVSxtQkFBbUI7SUFFNUI7UUFXQyx5QkFBb0IsT0FBNEIsRUFDckMsT0FBMkIsRUFDM0IsTUFBa0I7WUFGVCxZQUFPLEdBQVAsT0FBTyxDQUFxQjtZQUNyQyxZQUFPLEdBQVAsT0FBTyxDQUFvQjtZQUMzQixXQUFNLEdBQU4sTUFBTSxDQUFZO1lBTnJCLFNBQUksR0FBRyxPQUFPLENBQUM7WUFFZixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQU05QixDQUFDO1FBR00saUNBQU8sR0FBZDtZQUdDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBRWhDLENBQUM7UUFHTyxrQ0FBUSxHQUFoQjtZQUVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFFakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUVELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFckMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFMUIsQ0FBQztRQUdPLDRDQUFrQixHQUExQixVQUEyQixPQUFnQjtZQUUxQyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0MsSUFBSSxNQUFNLENBQUM7WUFFWCxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUV0QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNaLFFBQVEsQ0FBQztnQkFDVixDQUFDO2dCQUVELElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRW5DLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ25CLEtBQUssQ0FBQztnQkFDUCxDQUFDO1lBRUYsQ0FBQztZQUVELE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFZixDQUFDO1FBR00sK0JBQUssR0FBWixVQUFhLE1BQWlCO1lBRTdCLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFaEMsQ0FBQztRQUVNLGtDQUFRLEdBQWYsVUFBZ0IsTUFBaUI7WUFFaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0IsQ0FBQztRQUVNLHdDQUFjLEdBQXJCLFVBQXNCLE1BQWlCO1lBRXRDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFM0IsQ0FBQztRQUVNLGlDQUFPLEdBQWQsVUFBZSxJQUFlLEVBQUUsTUFBaUI7WUFFaEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVwQixDQUFDO1FBRU0sb0NBQVUsR0FBakIsVUFBa0IsSUFBZSxFQUFFLE1BQWlCO1lBRW5ELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTNCLENBQUM7UUFFTSxtQ0FBUyxHQUFoQixVQUFpQixJQUFlLEVBQUUsTUFBaUI7WUFFbEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUIsQ0FBQztRQUVNLGdDQUFNLEdBQWIsVUFBYyxJQUFlLEVBQUUsTUFBaUI7WUFFL0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkIsQ0FBQztRQUdNLCtCQUFLLEdBQVosVUFBYSxDQUFpQjtZQUU3QixJQUFJLE1BQU0sR0FBWSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXpELE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBRWhCLEtBQUssTUFBTTtvQkFDVixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2IsS0FBSyxDQUFDO2dCQUVQLEtBQUssV0FBVztvQkFDZixJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUMxQixLQUFLLENBQUM7Z0JBRVAsS0FBSyxTQUFTO29CQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN6QixLQUFLLENBQUM7Z0JBRVAsS0FBSyxVQUFVO29CQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMxQixLQUFLLENBQUM7Z0JBRVAsS0FBSyxPQUFPO29CQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN2QixLQUFLLENBQUM7Z0JBRVAsS0FBSyxNQUFNO29CQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN0QixLQUFLLENBQUM7Z0JBRVAsS0FBSyxZQUFZO29CQUNoQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztvQkFDeEIsS0FBSyxDQUFDO2dCQUVQLEtBQUssTUFBTTtvQkFDVixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQ2xCLEtBQUssQ0FBQztnQkFFUCxLQUFLLFNBQVM7b0JBQ2IsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUNyQixLQUFLLENBQUM7Z0JBRVAsS0FBSyxNQUFNO29CQUNWLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDbEIsS0FBSyxDQUFDO2dCQUVQLEtBQUssTUFBTTtvQkFDVixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQ2xCLEtBQUssQ0FBQztnQkFFUCxLQUFLLFlBQVk7b0JBQ2hCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDdEIsS0FBSyxDQUFDO2dCQUVQO29CQUNDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDdEQsS0FBSyxDQUFDO1lBRVIsQ0FBQztRQUVGLENBQUM7UUFJTyx3Q0FBYyxHQUF0QixVQUF1QixNQUFpQjtZQUV2QyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkUsSUFBSSxJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckQsQ0FBQztRQUlPLDBDQUFnQixHQUF4QixVQUF5QixNQUFpQjtZQUV6QyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVsQyxDQUFDO1FBR08sMENBQWdCLEdBQXhCLFVBQXlCLE1BQWlCO1lBRXpDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUVoRSxDQUFDO1FBR00sdUNBQWEsR0FBcEIsVUFBcUIsVUFBVSxFQUFFLE1BQWlCO1lBRWpELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUVyQyxDQUFDO1FBR00sa0NBQVEsR0FBZixVQUFnQixLQUFjLEVBQUUsTUFBaUI7WUFFaEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVoQyxDQUFDO1FBR08sb0NBQVUsR0FBbEIsVUFBbUIsTUFBaUI7WUFFbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUV0QyxDQUFDO1FBR08sb0NBQVUsR0FBbEIsVUFBbUIsTUFBaUI7WUFFbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckQsS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQztZQUMzRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFL0QsQ0FBQztRQUdPLG9DQUFVLEdBQWxCLFVBQW1CLE1BQWlCO1lBRW5DLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFFdEMsQ0FBQztRQUdPLHVDQUFhLEdBQXJCO1lBRUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBRTVELENBQUM7UUFHRCxzQkFBVyxzQ0FBUztpQkFBcEI7Z0JBRUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBRTlCLENBQUM7OztXQUFBO1FBR0Qsc0JBQVcseUNBQVk7aUJBQXZCO2dCQUVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztZQUVqQyxDQUFDOzs7V0FBQTtRQUdELHNCQUFXLG9DQUFPO2lCQUFsQjtnQkFFQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQztnQkFDUixDQUFDO2dCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztZQUU5QixDQUFDO2lCQUdELFVBQW1CLEtBQWU7Z0JBRWpDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDO2dCQUNSLENBQUM7Z0JBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRXBCLENBQUM7OztXQVpBO1FBZUQsc0JBQVcscUNBQVE7aUJBV25CO2dCQUVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDO2dCQUNSLENBQUM7Z0JBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBRTFCLENBQUM7aUJBbkJELFVBQW9CLENBQVU7Z0JBRTdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDO2dCQUNSLENBQUM7Z0JBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBRXZCLENBQUM7OztXQUFBO1FBY0Qsc0JBQVcsbUNBQU07aUJBQWpCO2dCQUVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFcEMsQ0FBQztpQkFHRCxVQUFrQixLQUFxQjtnQkFFdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUVyQyxDQUFDOzs7V0FQQTtRQVNGLHNCQUFDO0lBQUQsQ0FoVkEsQUFnVkMsSUFBQTtJQWhWWSxtQ0FBZSxrQkFnVjNCLENBQUE7SUFHRCxJQUFJLEdBQUcsR0FBZ0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRTdELEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFO1FBQ3pCLFVBQVUsRUFBRSxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixDQUFDLGVBQWUsQ0FBQztRQUNwRixXQUFXLEVBQUUsc0JBQXNCO1FBQ25DLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFFBQVEsRUFBRTtZQUNULEVBQUUsRUFBRSxJQUFJO1lBQ1IsS0FBSyxFQUFFLElBQUk7WUFDWCxPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFLElBQUk7WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNiO0tBQ0QsQ0FBQyxDQUFDO0FBRUosQ0FBQyxFQXJXUyxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBcVc1Qjs7QUNyV0QsSUFBVSxtQkFBbUIsQ0EwRzVCO0FBMUdELFdBQVUsbUJBQW1CO0lBRTVCO1FBV0MseUJBQW9CLE9BQTRCLEVBQ3JDLE1BQWtCO1lBRFQsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7WUFDckMsV0FBTSxHQUFOLE1BQU0sQ0FBWTtZQUxyQixTQUFJLEdBQUcsT0FBTyxDQUFDO1lBQ2YsYUFBUSxHQUFHLHNCQUFzQixDQUFDO1FBTTFDLENBQUM7UUFFTSxpQ0FBTyxHQUFkO1lBR0MsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUzQyxDQUFDO1FBR00scUNBQVcsR0FBbEIsVUFBbUIsS0FBYyxFQUFFLE1BQW9CO1lBRXRELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxQixNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0IsQ0FBQztRQUVGLENBQUM7UUFFTSwrQkFBSyxHQUFaLFVBQWEsS0FBYyxFQUFFLE1BQW9CO1lBRWhELElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QixDQUFDO1FBRUYsQ0FBQztRQUdELHNCQUFXLG1DQUFNO2lCQUFqQjtnQkFFQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXBDLENBQUM7aUJBR0QsVUFBa0IsS0FBcUI7Z0JBRXRDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7WUFFckMsQ0FBQzs7O1dBUEE7UUFVRCxzQkFBVyxxQ0FBUTtpQkFXbkI7Z0JBRUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDZixNQUFNLENBQUM7Z0JBQ1IsQ0FBQztnQkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7WUFFMUIsQ0FBQztpQkFuQkQsVUFBb0IsQ0FBVTtnQkFFN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDZixNQUFNLENBQUM7Z0JBQ1IsQ0FBQztnQkFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFFdkIsQ0FBQzs7O1dBQUE7UUFhRixzQkFBQztJQUFELENBckZBLEFBcUZDLElBQUE7SUFyRlksbUNBQWUsa0JBcUYzQixDQUFBO0lBRUQsSUFBSSxHQUFHLEdBQWdCLE9BQU8sQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUU3RCxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRTtRQUN6QixVQUFVLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixDQUFDLGVBQWUsQ0FBQztRQUN6RSxRQUFRLEVBQUUsb1BBQW9QO1FBQzlQLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFFBQVEsRUFBRTtZQUNULEVBQUUsRUFBRSxHQUFHO1lBQ1AsS0FBSyxFQUFFLElBQUk7WUFDWCxPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFLElBQUk7WUFDYixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxJQUFJO1NBQ2I7S0FDRCxDQUFDLENBQUM7QUFFSixDQUFDLEVBMUdTLG1CQUFtQixLQUFuQixtQkFBbUIsUUEwRzVCOztBQ3hHRCxJQUFVLG1CQUFtQixDQThvQzVCO0FBOW9DRCxXQUFVLG1CQUFtQjtJQXdPNUI7UUFnS0MsMkJBQW9CLE9BQTRCLEVBQ3JDLFFBQThCLEVBQzlCLFFBQThCLEVBQzlCLFVBQWlDLEVBQ2pDLE9BQTJCO1lBSnRDLGlCQVVDO1lBVm1CLFlBQU8sR0FBUCxPQUFPLENBQXFCO1lBQ3JDLGFBQVEsR0FBUixRQUFRLENBQXNCO1lBQzlCLGFBQVEsR0FBUixRQUFRLENBQXNCO1lBQzlCLGVBQVUsR0FBVixVQUFVLENBQXVCO1lBQ2pDLFlBQU8sR0FBUCxPQUFPLENBQW9CO1lBbEsvQixTQUFJLEdBQUcsS0FBSyxDQUFDO1lBR2IsVUFBSyxHQUFrQixFQUFFLENBQUM7WUFFMUIsbUJBQWMsR0FBRyxLQUFLLENBQUM7WUFFdEIsY0FBUyxHQUFRLEVBQUUsQ0FBQztZQUVwQixhQUFRLEdBQUcsS0FBSyxDQUFDO1lBRWpCLFVBQUssR0FBRyxLQUFLLENBQUM7WUFFZixZQUFPLEdBQWMsSUFBSSxDQUFDO1lBQzFCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLGFBQVEsR0FBYztnQkFDNUIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsTUFBTSxFQUFFO29CQUNQLE1BQU0sRUFBRTt3QkFDUCxLQUFLLEVBQUUsS0FBSzt3QkFDWixLQUFLLEVBQUUsS0FBSzt3QkFDWixLQUFLLEVBQUUsS0FBSztxQkFDWjtvQkFDRCxLQUFLLEVBQUUsT0FBTztvQkFDZCxXQUFXLEVBQUUsYUFBYTtvQkFDMUIsU0FBUyxFQUFFLFdBQVc7aUJBQ3RCO2dCQUNELFFBQVEsRUFBRTtvQkFDVCxPQUFPLEVBQUUsS0FBSztvQkFDZCxLQUFLLEVBQUUsSUFBSTtpQkFDWDtnQkFDRCxLQUFLLEVBQUUsU0FBUztnQkFDaEIsWUFBWSxFQUFFLEdBQUc7Z0JBQ2pCLE9BQU8sRUFBRSxFQUFFO2dCQUNYLEtBQUssRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRTtvQkFDVCxRQUFRLEVBQUUsRUFBRTtvQkFDWixPQUFPLEVBQUU7d0JBQ1IsT0FBTyxFQUFFLElBQUk7d0JBQ2IsUUFBUSxFQUFFLEtBQUs7cUJBQ2Y7b0JBQ0QsSUFBSSxFQUFFLElBQUk7b0JBQ1YsSUFBSSxFQUFFLEtBQUs7b0JBQ1gsTUFBTSxFQUFHLElBQUk7b0JBQ2IsU0FBUyxFQUFFO3dCQUNWLE1BQU0sRUFBRSxFQUFFO3dCQUNWLEtBQUssRUFBRSxLQUFLO3dCQUNaLE9BQU8sRUFBRSxLQUFLO3dCQUNkLEtBQUssRUFBRTs0QkFDTixNQUFNLEVBQUUsSUFBSTs0QkFDWixLQUFLLEVBQUUsS0FBSzt5QkFDWjt3QkFDRCxLQUFLLEVBQUU7NEJBQ04sTUFBTSxFQUFFLEtBQUs7eUJBQ2I7cUJBQ0Q7b0JBQ0QsVUFBVSxFQUFFLFNBQVM7b0JBQ3JCLElBQUksRUFBRSxPQUFPO29CQUNiLFFBQVEsRUFBRTt3QkFDVCxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7d0JBQ1YsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDO3dCQUNmLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7d0JBQ2pCLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQzt3QkFDZCxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO3dCQUNmLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7d0JBQ2QsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDO3dCQUNoQixJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7d0JBQ1YsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO3dCQUNiLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQzt3QkFDVixJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7d0JBQ1YsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDO3FCQUNoQjtpQkFDRDtnQkFDRCxTQUFTLEVBQUU7b0JBQ1YsTUFBTSxFQUFFLEVBQUU7b0JBQ1YsS0FBSyxFQUFFLEtBQUs7b0JBQ1osT0FBTyxFQUFFLEtBQUs7b0JBQ2QsS0FBSyxFQUFFO3dCQUNOLE1BQU0sRUFBRSxJQUFJO3dCQUNaLEtBQUssRUFBRSxLQUFLO3FCQUNaO29CQUNELEtBQUssRUFBRTt3QkFDTixNQUFNLEVBQUUsS0FBSztxQkFDYjtpQkFDRDtnQkFDRCxLQUFLLEVBQUU7b0JBQ04sT0FBTyxFQUFFLElBQUk7b0JBQ2IsSUFBSSxFQUFFO3dCQUNMLEtBQUssRUFBRSxVQUFVO3dCQUNqQixPQUFPLEVBQUUsS0FBSzt3QkFDZCxLQUFLLEVBQUUsS0FBSztxQkFDWjtvQkFDRCxLQUFLLEVBQUU7d0JBQ04sTUFBTSxFQUFFLEtBQUs7cUJBQ2I7b0JBQ0QsS0FBSyxFQUFFO3dCQUNOLE1BQU0sRUFBRSxLQUFLO3dCQUNiLEtBQUssRUFBRSxJQUFJO3FCQUNYO2lCQUNEO2dCQUNELEtBQUssRUFBRTtvQkFDTixVQUFVLEVBQUUsU0FBUztvQkFDckIsSUFBSSxFQUFFLE9BQU87b0JBQ2IsTUFBTSxFQUFHLElBQUk7b0JBQ2IsTUFBTSxFQUFFLElBQUk7b0JBQ1osU0FBUyxFQUFFLElBQUk7b0JBQ2YsVUFBVSxFQUFFO3dCQUNYLE9BQU8sRUFBRSxJQUFJO3dCQUNiLFFBQVEsRUFBRSxLQUFLO3FCQUNmO2lCQUNEO2FBQ0QsQ0FBQztZQUdLLFVBQUssR0FBbUI7Z0JBQzlCLFNBQVM7Z0JBQ1QsT0FBTztnQkFDUCxNQUFNO2dCQUNOLFNBQVM7YUFDVCxDQUFDO1lBR0ssV0FBTSxHQUFtQjtnQkFDL0IsU0FBUztnQkFDVCxVQUFVO2dCQUNWLFdBQVc7YUFDWCxDQUFDO1lBR0ssZ0JBQVcsR0FBbUI7Z0JBQ3BDLElBQUk7Z0JBQ0osV0FBVztnQkFDWCxRQUFRO2dCQUNSLFNBQVM7Z0JBQ1QsV0FBVztnQkFDWCxVQUFVO2dCQUNWLFVBQVU7Z0JBQ1YsVUFBVTtnQkFDVixTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsT0FBTztnQkFDUCxPQUFPO2FBQ1AsQ0FBQztZQUVLLFdBQU0sR0FBRztnQkFDZixXQUFXLEVBQUUsa0JBQWtCO2dCQUMvQixjQUFjLEVBQUUscUJBQXFCO2dCQUNyQyxhQUFhLEVBQUUsb0JBQW9CO2dCQUNuQyxZQUFZLEVBQUUsbUJBQW1CO2dCQUNqQyxVQUFVLEVBQUUsaUJBQWlCO2dCQUM3QixXQUFXLEVBQUUsa0JBQWtCO2dCQUMvQixZQUFZLEVBQUUsbUJBQW1CO2dCQUNqQyxVQUFVLEVBQUUsaUJBQWlCO2dCQUM3QixXQUFXLEVBQUUsa0JBQWtCO2dCQUMvQixjQUFjLEVBQUUscUJBQXFCO2FBQ3JDLENBQUM7WUFRRCxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBQyxLQUFLO2dCQUM3QyxLQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUosQ0FBQztRQUVPLHFDQUFTLEdBQWpCO1lBQUEsaUJBdUNDO1lBckNBLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsTUFBTSxDQUFDO1lBQ1IsQ0FBQztZQUVELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDaEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFFMUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRW5DLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUVaLEtBQUssRUFBRSxDQUFDO2dCQUNSLEtBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2dCQUN0QixLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXZCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVSLENBQUM7UUFHTSx3Q0FBWSxHQUFuQixVQUFvQixNQUFZO1lBRS9CLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDYixDQUFDO1lBRUQsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMvQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7WUFFYixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM1QyxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTFCLENBQUM7UUFHTSx1Q0FBVyxHQUFsQixVQUFtQixTQUFlO1lBRWpDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBR25CLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNoSSxTQUFTLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUMxRCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNQLFNBQVMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3JELENBQUM7WUFFRixDQUFDO1lBRUQsSUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQztZQUN4QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBR2xDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixRQUFRLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDNUcsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDbEIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO1lBQy9DLENBQUM7WUFFRCxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQyxRQUFRLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRSxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7WUFFckIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBRXRCLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFOUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQzFGLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDMUIsQ0FBQztZQUVGLENBQUM7WUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUM5QixNQUFNLENBQUMsUUFBUSxDQUFDO1FBRWpCLENBQUM7UUFHTSxvQ0FBUSxHQUFmLFVBQWdCLEtBQW9CO1lBRW5DLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLENBQUM7WUFDUixDQUFDO1lBR0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFHRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBRXpDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUNoQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDO1lBRUYsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVQLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBRXBCLENBQUM7WUFFRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFckIsQ0FBQztRQUdNLHNDQUFVLEdBQWpCLFVBQWtCLE9BQWtCO1lBR25DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDYixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDM0IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNQLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM5QixDQUFDO1lBR0QsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFFdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFbEQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFckIsQ0FBQztRQUdELHNCQUFXLHVDQUFRO2lCQXFCbkI7Z0JBRUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFFdkIsQ0FBQztpQkF6QkQsVUFBb0IsQ0FBVTtnQkFFN0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBRTFCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBRWYsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUU3QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7d0JBQ3BDLEtBQUssRUFBRSxDQUFDO3dCQUNSLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtxQkFDZixDQUFDLENBQUM7Z0JBRUosQ0FBQztZQUVGLENBQUM7OztXQUFBO1FBVU0sdUNBQVcsR0FBbEIsVUFBbUIsS0FBYztZQUVoQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7WUFDaEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWhCLENBQUM7UUFJTSxzQ0FBVSxHQUFqQixVQUFrQixJQUFlO1lBRWhDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3JCLENBQUM7WUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztZQUM1QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVoQixDQUFDO1FBR00scUNBQVMsR0FBaEIsVUFBaUIsSUFBZTtZQUUvQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNWLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNyQixDQUFDO1lBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDM0IsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFaEIsQ0FBQztRQUdNLG1DQUFPLEdBQWQsVUFBZSxJQUFlO1lBRTdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3JCLENBQUM7WUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztZQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUNsQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFaEIsQ0FBQztRQUdNLGtDQUFNLEdBQWIsVUFBYyxJQUFlO1lBRTVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3JCLENBQUM7WUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztZQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFaEIsQ0FBQztRQUVNLG1DQUFPLEdBQWQ7WUFFQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN2RSxDQUFDO1FBRUYsQ0FBQztRQUVNLDBDQUFjLEdBQXJCO1lBRUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3JCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDdEIsQ0FBQztRQUVGLENBQUM7UUFHTSx3Q0FBWSxHQUFuQjtZQUVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBRWhGLENBQUM7UUFFTSx5Q0FBYSxHQUFwQjtZQUFBLGlCQWFDO1lBWEEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDN0IsS0FBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2xCLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVoQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBRWpGLENBQUM7UUFHTyx3Q0FBWSxHQUFwQjtZQUVDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztZQUVsQixJQUFJLGtCQUFrQixHQUFHLFVBQVUsSUFBYSxFQUFFLE1BQWdCO2dCQUVqRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQixDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUN0QixNQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUN0QixNQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUN0QixNQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO1lBRUYsQ0FBQyxDQUFDO1lBR0YsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQVUsS0FBSyxFQUFFLEdBQUc7Z0JBRS9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBRW5CLEtBQUssQ0FBQyxNQUFNLEdBQUc7d0JBQ2QsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUM5QyxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7d0JBQzlDLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztxQkFDOUMsQ0FBQztnQkFFSCxDQUFDO2dCQUVELElBQUksTUFBTSxHQUFHO29CQUNaLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQztvQkFDdkUsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDO29CQUN2RSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUM7aUJBQ3ZFLENBQUM7Z0JBR0YsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3BDLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUV2QyxJQUFJLEtBQUssRUFBRSxXQUFXLENBQUM7Z0JBRXZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUN4RixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNQLEtBQUssR0FBRyxRQUFRLENBQUM7Z0JBQ2xCLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDdkMsV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3RHLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ1AsV0FBVyxHQUFHLElBQUksQ0FBQztnQkFDcEIsQ0FBQztnQkFFRCxJQUFJLElBQUksR0FBRztvQkFDVixNQUFNLEVBQUUsTUFBTTtvQkFDZCxLQUFLLEVBQUUsS0FBSztvQkFDWixXQUFXLEVBQUUsV0FBVztvQkFDeEIsTUFBTSxFQUFFO3dCQUNQLEtBQUssRUFBRSxLQUFLO3dCQUNaLEtBQUssRUFBRSxLQUFLO3dCQUNaLEtBQUssRUFBRSxLQUFLO3FCQUNaO2lCQUNELENBQUM7Z0JBRUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdkIsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsRCxDQUFDO1FBR00sd0NBQVksR0FBbkIsVUFBb0IsS0FBYztZQUNqQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFJTyxtQ0FBTyxHQUFmLFVBQWdCLElBQWM7WUFBOUIsaUJBUUM7WUFOQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU5QixJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNaLEtBQUksQ0FBQyxTQUFTLENBQUMsS0FBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNuQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUU3RCxDQUFDO1FBRU0scUNBQVMsR0FBaEIsVUFBaUIsS0FBYztZQUU5QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFFakMsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkMsQ0FBQztZQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFFZCxDQUFDO1FBR00sc0NBQVUsR0FBakIsVUFBa0IsT0FBdUIsRUFBRSxJQUFhO1lBRXZELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDZCxNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBRWhCLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFjO2dCQUM5QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxDQUFDO1FBRUosQ0FBQztRQUdNLHFDQUFTLEdBQWhCLFVBQWlCLEtBQWUsRUFBRSxRQUFjO1lBQWhELGlCQTBCQztZQXhCQSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDdEMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFOUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO2dCQUMvQyxNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxDQUFDO1lBQ1IsQ0FBQztZQUVELElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7WUFDeEIsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDM0MsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRTtnQkFDOUIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUN4QixLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUMzQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSztnQkFDcEMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBRUosQ0FBQztRQUdPLHVDQUFXLEdBQW5CLFVBQW9CLEtBQWMsRUFBRSxJQUFjO1lBRWpELElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzdCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxRCxJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBRWpCLENBQUM7UUFHTyx3Q0FBWSxHQUFwQixVQUFxQixLQUFjLEVBQUUsSUFBYztZQUVsRCxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUM3QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUQsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUVsQixDQUFDO1FBR08scUNBQVMsR0FBakIsVUFBa0IsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLO1lBRW5DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7WUFFdEMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN2RCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDN0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQzdELENBQUM7WUFFRCxJQUFJLElBQUksR0FBRyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFDLENBQUM7WUFFbkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUVELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFMUMsQ0FBQztRQUlELHNCQUFXLHVDQUFRO2lCQUFuQjtnQkFFQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUU3QyxDQUFDOzs7V0FBQTtRQUlNLHdDQUFZLEdBQW5CO1lBRUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDL0MsQ0FBQztRQUVGLENBQUM7UUFJRCxzQkFBVyxtQ0FBSTtpQkFBZjtnQkFFQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFbEMsQ0FBQzs7O1dBQUE7UUFHTSxrQ0FBTSxHQUFiLFVBQWMsT0FBZ0I7WUFFN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUVoRSxDQUFDO1FBSUQsc0JBQVcsMkNBQVk7aUJBQXZCO2dCQUVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBRXRCLENBQUM7aUJBWUQsVUFBd0IsS0FBZTtnQkFFdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7Z0JBRXRCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBRVgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNqQixJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFckMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFFUCxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFeEMsQ0FBQztZQUVGLENBQUM7OztXQTVCQTtRQUlELHNCQUFXLG9DQUFLO2lCQUFoQjtnQkFFQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFFM0IsQ0FBQzs7O1dBQUE7UUF1Qk8scUNBQVMsR0FBakI7WUFBQSxpQkEwQkM7WUF4QkEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBRWhCLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBR1osSUFBSSxPQUFPLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsc0JBQXNCLENBQUM7Z0JBRS9ELEtBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUs7b0JBRWpELEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFFeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN2QyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEMsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDUCxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDckMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ25DLENBQUM7Z0JBRUYsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRWpCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVULENBQUM7UUFHTSxxQ0FBUyxHQUFoQixVQUFpQixLQUFjO1lBRTlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM1RCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUN6QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUMsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTFCLENBQUM7UUFFTSxzQ0FBVSxHQUFqQjtZQUVDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFFN0QsQ0FBQztRQUdNLDBDQUFjLEdBQXJCLFVBQXNCLEtBQWU7WUFBckMsaUJBdURDO1lBckRBLElBQUksSUFBSSxHQUFHO2dCQUVWLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUV0RCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFFNUMsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUU5QixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzt3QkFFM0IsSUFBSSxLQUFLLEdBQVMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkUsSUFBSSxJQUFJLEdBQVMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDakUsSUFBSSxTQUFTLFNBQUEsRUFBRSxLQUFLLFNBQUEsRUFBRSxNQUFNLFNBQUEsQ0FBQzt3QkFFN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFFVixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dDQUMvQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFdBQVcsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztnQ0FDbEQsS0FBSyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztnQ0FDbEYsTUFBTSxHQUFHLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO2dDQUNuQyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0NBQzlCLEtBQUssR0FBRyxNQUFNLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7NEJBQzVGLENBQUM7NEJBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQ1AsU0FBUyxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQ3BDLEtBQUssR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUNyRSxDQUFDOzRCQUVELEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7NEJBRWhDLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUU7Z0NBQ3RDLFNBQVMsRUFBRSxTQUFTO2dDQUNwQixJQUFJLEVBQUUsS0FBSztnQ0FDWCxNQUFNLEVBQUUsTUFBTTtnQ0FDZCxTQUFTLEVBQUUsU0FBUyxDQUFDLFdBQVc7Z0NBQ2hDLEtBQUssRUFBRSxLQUFLLENBQUMsV0FBVzs2QkFDeEIsQ0FBQyxDQUFBO3dCQUVILENBQUM7b0JBRUYsQ0FBQztnQkFFRixDQUFDO1lBQ0YsQ0FBQyxDQUFDO1lBRUYsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDO29CQUNaLElBQUksRUFBRSxDQUFDO2dCQUNSLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNYLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxJQUFJLEVBQUUsQ0FBQztZQUNSLENBQUM7UUFHRixDQUFDO1FBRU0sc0NBQVUsR0FBakIsVUFBa0IsTUFBaUI7WUFFbEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDMUIsQ0FBQztZQUVELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVqQixDQUFDO1FBR00sb0NBQVEsR0FBZjtZQUVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMxRSxDQUFDO1FBRUYsQ0FBQztRQUVPLGlDQUFLLEdBQWIsVUFBYyxLQUFjLEVBQUUsSUFBVztZQUV4QyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXZCLENBQUM7UUFFTSwrQkFBRyxHQUFWLFVBQVcsS0FBYyxFQUFFLElBQVc7WUFFckMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEMsQ0FBQztRQUVGLENBQUM7UUFFTSw4QkFBRSxHQUFULFVBQVUsUUFBUTtZQUVqQixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVsQyxDQUFDO1FBR00sd0NBQVksR0FBbkIsVUFBb0IsSUFBSTtZQUV2QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFDN0QsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ3hCLE1BQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBRXJFLE1BQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUVqRixNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFaEMsQ0FBQztRQUdNLHlDQUFhLEdBQXBCLFVBQXFCLElBQUk7WUFFeEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQzdELE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxFQUMxQixNQUFNLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUVyRSxNQUFNLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFFakYsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRWpDLENBQUM7UUFFRix3QkFBQztJQUFELENBaDZCQSxBQWc2QkMsSUFBQTtJQWg2QlkscUNBQWlCLG9CQWc2QjdCLENBQUE7SUFFRCxJQUFJLEdBQUcsR0FBZ0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRTdELEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7QUFFL0csQ0FBQyxFQTlvQ1MsbUJBQW1CLEtBQW5CLG1CQUFtQixRQThvQzVCOztBQ2hwQ0QsSUFBVSxtQkFBbUIsQ0E0SDVCO0FBNUhELFdBQVUsbUJBQW1CO0lBRTVCO1FBWUMsNkJBQW9CLE9BQTRCLEVBQ3JDLE1BQWtCLEVBQ2xCLFFBQWlDO1lBRnhCLFlBQU8sR0FBUCxPQUFPLENBQXFCO1lBQ3JDLFdBQU0sR0FBTixNQUFNLENBQVk7WUFDbEIsYUFBUSxHQUFSLFFBQVEsQ0FBeUI7WUFQcEMsU0FBSSxHQUFHLFdBQVcsQ0FBQztZQUNuQixhQUFRLEdBQUcsMEJBQTBCLENBQUM7WUFFdEMsVUFBSyxHQUFHLEtBQUssQ0FBQztRQU10QixDQUFDO1FBRU0scUNBQU8sR0FBZDtZQUdDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFHMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzVHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUMvRSxDQUFDO1FBRUYsQ0FBQztRQUdELHNCQUFXLHdDQUFPO2lCQUFsQjtnQkFFQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBRS9DLENBQUM7OztXQUFBO1FBR00seUNBQVcsR0FBbEIsVUFBbUIsS0FBYyxFQUFFLE1BQW9CO1lBRXRELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxQixNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0IsQ0FBQztRQUVGLENBQUM7UUFHTSxtQ0FBSyxHQUFaLFVBQWEsS0FBYyxFQUFFLE1BQW9CO1lBRWhELElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QixDQUFDO1FBRUYsQ0FBQztRQUdELHNCQUFXLHVDQUFNO2lCQUFqQjtnQkFFQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFeEYsQ0FBQztpQkFHRCxVQUFrQixLQUF5QjtnQkFFMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ3JDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ1AsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDOUMsQ0FBQztZQUVGLENBQUM7OztXQVhBO1FBY0Qsc0JBQVcseUNBQVE7aUJBV25CO2dCQUVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDO2dCQUNSLENBQUM7Z0JBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBRTFCLENBQUM7aUJBbkJELFVBQW9CLENBQVU7Z0JBRTdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDO2dCQUNSLENBQUM7Z0JBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBRXZCLENBQUM7OztXQUFBO1FBYUYsMEJBQUM7SUFBRCxDQXhHQSxBQXdHQyxJQUFBO0lBeEdZLHVDQUFtQixzQkF3Ry9CLENBQUE7SUFFRCxJQUFJLEdBQUcsR0FBZ0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRTdELEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFO1FBQzdCLFVBQVUsRUFBRSxDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixDQUFDLG1CQUFtQixDQUFDO1FBQ3pGLFFBQVEsRUFBRSwyTUFBMk07UUFDck4sUUFBUSxFQUFFO1lBQ1QsRUFBRSxFQUFFLEdBQUc7WUFDUCxLQUFLLEVBQUUsSUFBSTtZQUNYLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFLElBQUk7U0FDYjtLQUNELENBQUMsQ0FBQztBQUVKLENBQUMsRUE1SFMsbUJBQW1CLEtBQW5CLG1CQUFtQixRQTRINUIiLCJmaWxlIjoiYW5ndWxhci1zdXBlci1nYWxsZXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi8uLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxyXG5cclxubmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5JywgWyduZ0FuaW1hdGUnLCAnbmdUb3VjaCddKTtcclxuXHJcblx0YXBwLmZpbHRlcignYXNnQnl0ZXMnLCAoKSA9PiB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGJ5dGVzIDogYW55LCBwcmVjaXNpb24gOiBudW1iZXIpIDogc3RyaW5nIHtcclxuXHJcblx0XHRcdGlmIChpc05hTihwYXJzZUZsb2F0KGJ5dGVzKSkgfHwgIWlzRmluaXRlKGJ5dGVzKSkge1xyXG5cdFx0XHRcdHJldHVybiAnJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGJ5dGVzID09PSAwKSB7XHJcblx0XHRcdFx0cmV0dXJuICcwJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHR5cGVvZiBwcmVjaXNpb24gPT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0cHJlY2lzaW9uID0gMTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IHVuaXRzID0gWydieXRlcycsICdrQicsICdNQicsICdHQicsICdUQicsICdQQiddLFxyXG5cdFx0XHRcdG51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5sb2coYnl0ZXMpIC8gTWF0aC5sb2coMTAyNCkpO1xyXG5cclxuXHRcdFx0cmV0dXJuIChieXRlcyAvIE1hdGgucG93KDEwMjQsIE1hdGguZmxvb3IobnVtYmVyKSkpLnRvRml4ZWQocHJlY2lzaW9uKSArICcgJyArIHVuaXRzW251bWJlcl07XHJcblxyXG5cdFx0fTtcclxuXHR9KTtcclxuXHJcbn1cclxuXHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIENvbnRyb2xDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIHR5cGUgPSAnY29udHJvbCc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgdGVtcGxhdGUgPSAndmlld3MvYXNnLWNvbnRyb2wuaHRtbCc7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkc2NvcGUgOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHRcdHRoaXMuJHNjb3BlLmZvcndhcmQgPSAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dGhpcy4kc2NvcGUuYmFja3dhcmQgPSAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZCh0cnVlKTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCBpbWFnZSBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBpbWFnZSBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNJbWFnZSkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnQ29udHJvbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LkNvbnRyb2xDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImFzZy1jb250cm9sIHt7ICRjdHJsLmFzZy50aGVtZSB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgSW1hZ2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmwgOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ2ltYWdlJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHJvb3RTY29wZSA6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkZWxlbWVudCA6IG5nLklSb290RWxlbWVudFNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICR3aW5kb3cgOiBuZy5JV2luZG93U2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCgncmVzaXplJywgKGV2ZW50KSA9PiB7XHJcblx0XHRcdFx0dGhpcy5vblJlc2l6ZSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBvblJlc2l6ZSgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5oZWlnaHRBdXRvLm9ucmVzaXplKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRIZWlnaHQodGhpcy5hc2cuZmlsZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHRcdC8vIHNldCBpbWFnZSBjb21wb25lbnQgaGVpZ2h0XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kb24odGhpcy5hc2cuZXZlbnRzLkZJUlNUX0lNQUdFICsgdGhpcy5pZCwgKGV2ZW50LCBkYXRhKSA9PiB7XHJcblxyXG5cdFx0XHRcdGlmICghdGhpcy5jb25maWcuaGVpZ2h0ICYmIHRoaXMuY29uZmlnLmhlaWdodEF1dG8uaW5pdGlhbCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRIZWlnaHQoZGF0YS5pbWcpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5hc2cudGh1bWJuYWlsc01vdmUoMjAwKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29tcG9uZW50IGhlaWdodFxyXG5cdFx0cHJpdmF0ZSBzZXRIZWlnaHQoaW1nKSB7XHJcblxyXG5cdFx0XHRsZXQgd2lkdGggPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCdkaXYnKVswXS5jbGllbnRXaWR0aDtcclxuXHRcdFx0bGV0IHJhdGlvID0gaW1nLndpZHRoIC8gaW1nLmhlaWdodDtcclxuXHRcdFx0dGhpcy5jb25maWcuaGVpZ2h0ID0gd2lkdGggLyByYXRpbztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaGVpZ2h0XHJcblx0XHRwdWJsaWMgZ2V0IGhlaWdodCgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5oZWlnaHQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zSW1hZ2UpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9CYWNrd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHRpZiAoJGV2ZW50KSB7XHJcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHN0b3ApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICgkZXZlbnQpIHtcclxuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0ltYWdlJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnJGVsZW1lbnQnLCAnJHdpbmRvdycsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LkltYWdlQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FzZy1pbWFnZS5odG1sJyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHRiYXNlVXJsOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBJbmZvQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ2luZm8nO1xyXG5cdFx0cHJpdmF0ZSBhc2cgOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlID0gJ3ZpZXdzL2FzZy1pbmZvLmh0bWwnO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLmZpbGU7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dJbmZvJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuSW5mb0NvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYXNnLWluZm8ge3sgJGN0cmwuYXNnLnRoZW1lIH19XCI+PGRpdiBuZy1pbmNsdWRlPVwiJGN0cmwudGVtcGxhdGVcIj48L2Rpdj48L2Rpdj4nLFxyXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHR0ZW1wbGF0ZTogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBNb2RhbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZCA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRwdWJsaWMgaXRlbXMgOiBBcnJheTxJRmlsZT47XHJcblx0XHRwdWJsaWMgYmFzZVVybCA6IHN0cmluZztcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgPSAnbW9kYWwnO1xyXG5cdFx0cHJpdmF0ZSBhc2cgOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblx0XHRwcml2YXRlIGFycm93c1Zpc2libGUgPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdFx0XHRwcml2YXRlICR3aW5kb3cgOiBuZy5JV2luZG93U2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbEF2YWlsYWJsZSA9IHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwcml2YXRlIGdldENsYXNzKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmNvbmZpZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IG5nQ2xhc3MgPSBbXTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5jb25maWcubWVudSkge1xyXG5cdFx0XHRcdG5nQ2xhc3MucHVzaCgnbm9tZW51Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5nQ2xhc3MucHVzaCh0aGlzLmFzZy5vcHRpb25zLnRoZW1lKTtcclxuXHJcblx0XHRcdHJldHVybiBuZ0NsYXNzLmpvaW4oJyAnKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGFjdGlvbiBmcm9tIGtleWNvZGVzXHJcblx0XHRwcml2YXRlIGdldEFjdGlvbkJ5S2V5Q29kZShrZXlDb2RlIDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmtleWNvZGVzKTtcclxuXHRcdFx0bGV0IGFjdGlvbjtcclxuXHJcblx0XHRcdGZvciAobGV0IGtleSBpbiBrZXlzKSB7XHJcblxyXG5cdFx0XHRcdGxldCBjb2RlcyA9IHRoaXMuY29uZmlnLmtleWNvZGVzW2tleXNba2V5XV07XHJcblxyXG5cdFx0XHRcdGlmICghY29kZXMpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGluZGV4ID0gY29kZXMuaW5kZXhPZihrZXlDb2RlKTtcclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcclxuXHRcdFx0XHRcdGFjdGlvbiA9IGtleXNba2V5XTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBhY3Rpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgY2xvc2UoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbG9zZSgpO1xyXG5cdFx0XHR0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbC5leGl0KCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBzZXRGb2N1cygkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlUb2dnbGUoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cuYXV0b1BsYXlUb2dnbGUoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvRmlyc3Qoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy50b0ZpcnN0KCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvRm9yd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvTGFzdChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnRvTGFzdChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZG8ga2V5Ym9hcmQgYWN0aW9uXHJcblx0XHRwdWJsaWMga2V5VXAoZSA6IEtleWJvYXJkRXZlbnQpIHtcclxuXHJcblx0XHRcdGxldCBhY3Rpb24gOiBzdHJpbmcgPSB0aGlzLmdldEFjdGlvbkJ5S2V5Q29kZShlLmtleUNvZGUpO1xyXG5cclxuXHRcdFx0c3dpdGNoIChhY3Rpb24pIHtcclxuXHJcblx0XHRcdFx0Y2FzZSAnZXhpdCc6XHJcblx0XHRcdFx0XHR0aGlzLmNsb3NlKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAncGxheXBhdXNlJzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLmF1dG9QbGF5VG9nZ2xlKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnZm9yd2FyZCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnYmFja3dhcmQnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdmaXJzdCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0ZpcnN0KHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2xhc3QnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9MYXN0KHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2Z1bGxzY3JlZW4nOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVGdWxsU2NyZWVuKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnbWVudSc6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1lbnUoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdjYXB0aW9uJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlQ2FwdGlvbigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2hlbHAnOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVIZWxwKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnc2l6ZSc6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZVNpemUoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICd0cmFuc2l0aW9uJzpcclxuXHRcdFx0XHRcdHRoaXMubmV4dFRyYW5zaXRpb24oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cubG9nKCd1bmtub3duIGtleWJvYXJkIGFjdGlvbjogJyArIGUua2V5Q29kZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHN3aXRjaCB0byBuZXh0IHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRwcml2YXRlIG5leHRUcmFuc2l0aW9uKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdGxldCBpZHggPSB0aGlzLmFzZy50cmFuc2l0aW9ucy5pbmRleE9mKHRoaXMuY29uZmlnLnRyYW5zaXRpb24pICsgMTtcclxuXHRcdFx0bGV0IG5leHQgPSBpZHggPj0gdGhpcy5hc2cudHJhbnNpdGlvbnMubGVuZ3RoID8gMCA6IGlkeDtcclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRoaXMuYXNnLnRyYW5zaXRpb25zW25leHRdO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGZ1bGxzY3JlZW5cclxuXHRcdHByaXZhdGUgdG9nZ2xlRnVsbFNjcmVlbigkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbC50b2dnbGUoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIHRodW1ibmFpbHNcclxuXHRcdHByaXZhdGUgdG9nZ2xlVGh1bWJuYWlscygkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmNvbmZpZy50aHVtYm5haWwuZHluYW1pYyA9ICF0aGlzLmNvbmZpZy50aHVtYm5haWwuZHluYW1pYztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRwdWJsaWMgc2V0VHJhbnNpdGlvbih0cmFuc2l0aW9uLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmNvbmZpZy50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRoZW1lXHJcblx0XHRwdWJsaWMgc2V0VGhlbWUodGhlbWUgOiBzdHJpbmcsICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnMudGhlbWUgPSB0aGVtZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGhlbHBcclxuXHRcdHByaXZhdGUgdG9nZ2xlSGVscCgkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmNvbmZpZy5oZWxwID0gIXRoaXMuY29uZmlnLmhlbHA7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBzaXplXHJcblx0XHRwcml2YXRlIHRvZ2dsZVNpemUoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0bGV0IGluZGV4ID0gdGhpcy5hc2cuc2l6ZXMuaW5kZXhPZih0aGlzLmNvbmZpZy5zaXplKTtcclxuXHRcdFx0aW5kZXggPSAoaW5kZXggKyAxKSA+PSB0aGlzLmFzZy5zaXplcy5sZW5ndGggPyAwIDogKytpbmRleDtcclxuXHRcdFx0dGhpcy5jb25maWcuc2l6ZSA9IHRoaXMuYXNnLnNpemVzW2luZGV4XTtcclxuXHRcdFx0dGhpcy5hc2cubG9nKCd0b2dnbGUgaW1hZ2Ugc2l6ZTonLCBbdGhpcy5jb25maWcuc2l6ZSwgaW5kZXhdKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIG1lbnVcclxuXHRcdHByaXZhdGUgdG9nZ2xlTWVudSgkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmNvbmZpZy5tZW51ID0gIXRoaXMuY29uZmlnLm1lbnU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBjYXB0aW9uXHJcblx0XHRwcml2YXRlIHRvZ2dsZUNhcHRpb24oKSB7XHJcblxyXG5cdFx0XHR0aGlzLmNvbmZpZy5jYXB0aW9uLnZpc2libGUgPSAhdGhpcy5jb25maWcuY2FwdGlvbi52aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbWFyZ2ludCB0b3BcclxuXHRcdHB1YmxpYyBnZXQgbWFyZ2luVG9wKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLm1hcmdpblRvcDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1hcmdpbiBib3R0b21cclxuXHRcdHB1YmxpYyBnZXQgbWFyZ2luQm90dG9tKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLm1hcmdpbkJvdHRvbTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1vZGFsIHZpc2libGVcclxuXHRcdHB1YmxpYyBnZXQgdmlzaWJsZSgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5tb2RhbFZpc2libGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBtb2RhbCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgc2V0IHZpc2libGUodmFsdWUgOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbFZpc2libGUgPSB2YWx1ZTtcclxuXHRcdFx0dGhpcy5hc2cuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtb2RhbCBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc01vZGFsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBtb2RhbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNNb2RhbCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ01vZGFsJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyR3aW5kb3cnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5Nb2RhbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9hc2ctbW9kYWwuaHRtbCcsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dmlzaWJsZTogJz0/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBQYW5lbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZCA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRwdWJsaWMgaXRlbXMgOiBBcnJheTxJRmlsZT47XHJcblx0XHRwdWJsaWMgYmFzZVVybCA6IHN0cmluZztcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgPSAncGFuZWwnO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZSA9ICd2aWV3cy9hc2ctcGFuZWwuaHRtbCc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdFx0XHRwcml2YXRlICRzY29wZSA6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXRTZWxlY3RlZChpbmRleCA6IG51bWJlciwgJGV2ZW50PyA6IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5tb2RhbCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLm1vZGFsT3BlbihpbmRleCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2suc2VsZWN0KSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBob3ZlcihpbmRleCA6IG51bWJlciwgJGV2ZW50PyA6IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuaG92ZXIuc2VsZWN0ID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBwYW5lbCBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc1BhbmVsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBwYW5lbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNQYW5lbCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dQYW5lbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LlBhbmVsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctcGFuZWwge3sgJGN0cmwuYXNnLnRoZW1lIH19XCIgbmctbW91c2VvdmVyPVwiJGN0cmwuYXNnLm92ZXIucGFuZWwgPSB0cnVlO1wiIG5nLW1vdXNlbGVhdmU9XCIkY3RybC5hc2cub3Zlci5wYW5lbCA9IGZhbHNlO1wiIG5nLXNob3c9XCIkY3RybC5jb25maWcudmlzaWJsZVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPjwvZGl2PicsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAJyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR2aXNpYmxlOiAnPT8nLFxyXG5cdFx0XHR0ZW1wbGF0ZTogJ0A/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5uYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdC8vIG1vZGFsIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc01vZGFsIHtcclxuXHJcblx0XHRtZW51PyA6IGJvb2xlYW47XHJcblx0XHRoZWxwPyA6IGJvb2xlYW47XHJcblx0XHRjYXB0aW9uPyA6IHtcclxuXHRcdFx0dmlzaWJsZSA6IGJvb2xlYW47XHJcblx0XHRcdHBvc2l0aW9uIDogc3RyaW5nO1xyXG5cdFx0fTtcclxuXHRcdHRyYW5zaXRpb24/IDogc3RyaW5nO1xyXG5cdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0c3VidGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0YXJyb3dzPyA6IGJvb2xlYW47XHJcblx0XHRzaXplPyA6IHN0cmluZztcclxuXHRcdHRodW1ibmFpbD8gOiBJT3B0aW9uc1RodW1ibmFpbDtcclxuXHRcdG1hcmdpblRvcD8gOiBudW1iZXI7XHJcblx0XHRtYXJnaW5Cb3R0b20/IDogbnVtYmVyO1xyXG5cdFx0a2V5Y29kZXM/IDoge1xyXG5cdFx0XHRleGl0PyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdHBsYXlwYXVzZT8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRmb3J3YXJkPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGJhY2t3YXJkPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGZpcnN0PyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGxhc3Q/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0ZnVsbHNjcmVlbj8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRtZW51PyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGNhcHRpb24/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0aGVscD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRzaXplPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdHRyYW5zaXRpb24/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHQvLyBwYW5lbCBjb21wb25lbnQgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNQYW5lbCB7XHJcblxyXG5cdFx0dmlzaWJsZT8gOiBib29sZWFuO1xyXG5cdFx0aXRlbT8gOiB7XHJcblx0XHRcdGNsYXNzPyA6IHN0cmluZztcclxuXHRcdFx0Y2FwdGlvbiA6IGJvb2xlYW47XHJcblx0XHRcdGluZGV4IDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRob3Zlcj8gOiB7XHJcblx0XHRcdHNlbGVjdCA6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0Y2xpY2s/IDoge1xyXG5cdFx0XHRzZWxlY3QgOiBib29sZWFuO1xyXG5cdFx0XHRtb2RhbCA6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIHRodW1ibmFpbCBjb21wb25lbnQgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNUaHVtYm5haWwge1xyXG5cclxuXHRcdGhlaWdodD8gOiBudW1iZXIsXHJcblx0XHRpbmRleD8gOiBib29sZWFuO1xyXG5cdFx0ZHluYW1pYz8gOiBib29sZWFuO1xyXG5cdFx0Y2xpY2s/IDoge1xyXG5cdFx0XHRzZWxlY3QgOiBib29sZWFuO1xyXG5cdFx0XHRtb2RhbCA6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0aG92ZXI/IDoge1xyXG5cdFx0XHRzZWxlY3QgOiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHQvLyBpbmZvIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0luZm8ge1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHR0cmFuc2l0aW9uPyA6IHN0cmluZztcclxuXHRcdHNpemU/IDogc3RyaW5nO1xyXG5cdFx0YXJyb3dzPyA6IGJvb2xlYW47XHJcblx0XHRoZWlnaHQ/IDogbnVtYmVyO1xyXG5cdFx0aGVpZ2h0TWluPyA6IG51bWJlcjtcclxuXHRcdGhlaWdodEF1dG8/IDoge1xyXG5cdFx0XHRpbml0aWFsPyA6IGJvb2xlYW47XHJcblx0XHRcdG9ucmVzaXplPyA6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGdhbGxlcnkgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xyXG5cclxuXHRcdGRlYnVnPyA6IGJvb2xlYW47XHJcblx0XHRiYXNlVXJsPyA6IHN0cmluZztcclxuXHRcdGZpZWxkcz8gOiB7XHJcblx0XHRcdHNvdXJjZT8gOiB7XHJcblx0XHRcdFx0bW9kYWw/IDogc3RyaW5nO1xyXG5cdFx0XHRcdHBhbmVsPyA6IHN0cmluZztcclxuXHRcdFx0XHRpbWFnZT8gOiBzdHJpbmc7XHJcblx0XHRcdH1cclxuXHRcdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0XHRkZXNjcmlwdGlvbj8gOiBzdHJpbmc7XHJcblx0XHRcdHRodW1ibmFpbD8gOiBzdHJpbmc7XHJcblx0XHR9O1xyXG5cdFx0YXV0b3BsYXk/IDoge1xyXG5cdFx0XHRlbmFibGVkPyA6IGJvb2xlYW47XHJcblx0XHRcdGRlbGF5PyA6IG51bWJlcjtcclxuXHRcdH07XHJcblx0XHR0aGVtZT8gOiBzdHJpbmc7XHJcblx0XHRwcmVsb2FkRGVsYXk/IDogbnVtYmVyO1xyXG5cdFx0cHJlbG9hZD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0bW9kYWw/IDogSU9wdGlvbnNNb2RhbDtcclxuXHRcdHBhbmVsPyA6IElPcHRpb25zUGFuZWw7XHJcblx0XHRpbWFnZT8gOiBJT3B0aW9uc0ltYWdlO1xyXG5cdFx0dGh1bWJuYWlsPyA6IElPcHRpb25zVGh1bWJuYWlsO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIHNvdXJjZVxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVNvdXJjZSB7XHJcblxyXG5cdFx0bW9kYWwgOiBzdHJpbmc7IC8vIG9yaWdpbmFsLCByZXF1aXJlZFxyXG5cdFx0cGFuZWw/IDogc3RyaW5nO1xyXG5cdFx0aW1hZ2U/IDogc3RyaW5nO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGZpbGVcclxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWxlIHtcclxuXHJcblx0XHRzb3VyY2UgOiBJU291cmNlO1xyXG5cdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0bmFtZT8gOiBzdHJpbmc7XHJcblx0XHRleHRlbnNpb24/IDogc3RyaW5nO1xyXG5cdFx0ZGVzY3JpcHRpb24/IDogc3RyaW5nO1xyXG5cdFx0ZG93bmxvYWQ/IDogc3RyaW5nO1xyXG5cdFx0bG9hZGVkPyA6IHtcclxuXHRcdFx0bW9kYWw/IDogYm9vbGVhbjtcclxuXHRcdFx0cGFuZWw/IDogYm9vbGVhbjtcclxuXHRcdFx0aW1hZ2U/IDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHR3aWR0aD8gOiBudW1iZXI7XHJcblx0XHRoZWlnaHQ/IDogbnVtYmVyO1xyXG5cclxuXHR9XHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU92ZXIge1xyXG5cdFx0bW9kYWxJbWFnZSA6IGJvb2xlYW47XHJcblx0XHRwYW5lbCA6IGJvb2xlYW47XHJcblx0fVxyXG5cclxuXHQvLyBzZXJ2aWNlIGNvbnRyb2xsZXIgaW50ZXJmYWNlXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJU2VydmljZUNvbnRyb2xsZXIge1xyXG5cclxuXHRcdG1vZGFsVmlzaWJsZSA6IGJvb2xlYW47XHJcblx0XHRwYW5lbFZpc2libGUgOiBib29sZWFuO1xyXG5cdFx0bW9kYWxBdmFpbGFibGUgOiBib29sZWFuO1xyXG5cdFx0dHJhbnNpdGlvbnMgOiBBcnJheTxzdHJpbmc+O1xyXG5cdFx0dGhlbWVzIDogQXJyYXk8c3RyaW5nPjtcclxuXHRcdG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0c2VsZWN0ZWQgOiBudW1iZXI7XHJcblx0XHRmaWxlIDogSUZpbGU7XHJcblx0XHRzaXplcyA6IEFycmF5PHN0cmluZz47XHJcblx0XHRpZCA6IHN0cmluZztcclxuXHRcdGV2ZW50cyA6IHtcclxuXHRcdFx0Q09ORklHX0xPQUQgOiBzdHJpbmc7XHJcblx0XHRcdEFVVE9QTEFZX1NUQVJUIDogc3RyaW5nO1xyXG5cdFx0XHRBVVRPUExBWV9TVE9QIDogc3RyaW5nO1xyXG5cdFx0XHRQQVJTRV9JTUFHRVMgOiBzdHJpbmc7XHJcblx0XHRcdExPQURfSU1BR0UgOiBzdHJpbmc7XHJcblx0XHRcdEZJUlNUX0lNQUdFIDogc3RyaW5nO1xyXG5cdFx0XHRDSEFOR0VfSU1BR0UgOiBzdHJpbmc7XHJcblx0XHRcdE1PREFMX09QRU4gOiBzdHJpbmc7XHJcblx0XHRcdE1PREFMX0NMT1NFIDogc3RyaW5nO1xyXG5cdFx0fTtcclxuXHJcblx0XHRnZXRJbnN0YW5jZShjb21wb25lbnQgOiBhbnkpIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdHNldERlZmF1bHRzKCkgOiB2b2lkO1xyXG5cclxuXHRcdHNldE9wdGlvbnMob3B0aW9ucyA6IElPcHRpb25zKSA6IElPcHRpb25zO1xyXG5cclxuXHRcdHNldEl0ZW1zKGl0ZW1zIDogQXJyYXk8SUZpbGU+KSA6IHZvaWQ7XHJcblxyXG5cdFx0cHJlbG9hZCh3YWl0PyA6IG51bWJlcikgOiB2b2lkO1xyXG5cclxuXHRcdG5vcm1hbGl6ZShpbmRleCA6IG51bWJlcikgOiBudW1iZXI7XHJcblxyXG5cdFx0c2V0Rm9jdXMoKSA6IHZvaWQ7XHJcblxyXG5cdFx0c2V0U2VsZWN0ZWQoaW5kZXggOiBudW1iZXIpO1xyXG5cclxuXHRcdG1vZGFsT3BlbihpbmRleCA6IG51bWJlcikgOiB2b2lkO1xyXG5cclxuXHRcdG1vZGFsQ2xvc2UoKSA6IHZvaWQ7XHJcblxyXG5cdFx0bW9kYWxDbGljaygkZXZlbnQ/IDogVUlFdmVudCkgOiB2b2lkO1xyXG5cclxuXHRcdHRodW1ibmFpbHNNb3ZlKGRlbGF5PyA6IG51bWJlcikgOiB2b2lkO1xyXG5cclxuXHRcdHRvQmFja3dhcmQoc3RvcD8gOiBib29sZWFuKSA6IHZvaWQ7XHJcblxyXG5cdFx0dG9Gb3J3YXJkKHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cclxuXHRcdHRvRmlyc3Qoc3RvcD8gOiBib29sZWFuKSA6IHZvaWQ7XHJcblxyXG5cdFx0dG9MYXN0KHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cclxuXHRcdGxvYWRJbWFnZShpbmRleD8gOiBudW1iZXIpIDogdm9pZDtcclxuXHJcblx0XHRsb2FkSW1hZ2VzKGluZGV4ZXMgOiBBcnJheTxudW1iZXI+KSA6IHZvaWQ7XHJcblxyXG5cdFx0aG92ZXJQcmVsb2FkKGluZGV4IDogbnVtYmVyKSA6IHZvaWQ7XHJcblxyXG5cdFx0YXV0b1BsYXlUb2dnbGUoKSA6IHZvaWQ7XHJcblxyXG5cdFx0dG9nZ2xlKGVsZW1lbnQgOiBzdHJpbmcpIDogdm9pZDtcclxuXHJcblx0XHRzZXRIYXNoKCkgOiB2b2lkO1xyXG5cclxuXHRcdGRvd25sb2FkTGluaygpIDogc3RyaW5nO1xyXG5cclxuXHRcdGVsKHNlbGVjdG9yKSA6IGFueTtcclxuXHJcblx0XHRsb2coZXZlbnQgOiBzdHJpbmcsIGRhdGE/IDogYW55KSA6IHZvaWQ7XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdC8vIHNlcnZpY2UgY29udHJvbGxlclxyXG5cdGV4cG9ydCBjbGFzcyBTZXJ2aWNlQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIHNsdWcgPSAnYXNnJztcclxuXHRcdHB1YmxpYyBpZCA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IGFueTtcclxuXHRcdHB1YmxpYyBmaWxlcyA6IEFycmF5PElGaWxlPiA9IFtdO1xyXG5cdFx0cHVibGljIGRpcmVjdGlvbiA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBtb2RhbEF2YWlsYWJsZSA9IGZhbHNlO1xyXG5cclxuXHRcdHByaXZhdGUgaW5zdGFuY2VzIDoge30gPSB7fTtcclxuXHRcdHByaXZhdGUgX3NlbGVjdGVkIDogbnVtYmVyO1xyXG5cdFx0cHJpdmF0ZSBfdmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBhdXRvcGxheSA6IGFuZ3VsYXIuSVByb21pc2U8YW55PjtcclxuXHRcdHByaXZhdGUgZmlyc3QgPSBmYWxzZTtcclxuXHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zID0gbnVsbDtcclxuXHRcdHB1YmxpYyBvcHRpb25zTG9hZGVkID0gZmFsc2U7XHJcblx0XHRwdWJsaWMgZGVmYXVsdHMgOiBJT3B0aW9ucyA9IHtcclxuXHRcdFx0ZGVidWc6IGZhbHNlLCAvLyBpbWFnZSBsb2FkIGFuZCBhdXRvcGxheSBpbmZvIGluIGNvbnNvbGUubG9nXHJcblx0XHRcdGJhc2VVcmw6ICcnLCAvLyB1cmwgcHJlZml4XHJcblx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdHNvdXJjZToge1xyXG5cdFx0XHRcdFx0bW9kYWw6ICd1cmwnLCAvLyByZXF1aXJlZCwgaW1hZ2UgdXJsIGZvciBtb2RhbCBjb21wb25lbnQgKGxhcmdlIHNpemUpXHJcblx0XHRcdFx0XHRwYW5lbDogJ3VybCcsIC8vIGltYWdlIHVybCBmb3IgcGFuZWwgY29tcG9uZW50ICh0aHVtYm5haWwgc2l6ZSlcclxuXHRcdFx0XHRcdGltYWdlOiAndXJsJyAvLyBpbWFnZSB1cmwgZm9yIGltYWdlIChtZWRpdW0gc2l6ZSlcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHRpdGxlOiAndGl0bGUnLCAvLyB0aXRsZSBpbnB1dCBmaWVsZCBuYW1lXHJcblx0XHRcdFx0ZGVzY3JpcHRpb246ICdkZXNjcmlwdGlvbicsIC8vIGRlc2NyaXB0aW9uIGlucHV0IGZpZWxkIG5hbWVcclxuXHRcdFx0XHR0aHVtYm5haWw6ICd0aHVtYm5haWwnIC8vIHRodW1ibmFpbCBpbnB1dCBmaWVsZCBuYW1lXHJcblx0XHRcdH0sXHJcblx0XHRcdGF1dG9wbGF5OiB7XHJcblx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsIC8vIHNsaWRlc2hvdyBwbGF5IGVuYWJsZWQvZGlzYWJsZWRcclxuXHRcdFx0XHRkZWxheTogNDEwMCAvLyBhdXRvcGxheSBkZWxheSBpbiBtaWxsaXNlY29uZFxyXG5cdFx0XHR9LFxyXG5cdFx0XHR0aGVtZTogJ2RlZmF1bHQnLCAvLyBjc3Mgc3R5bGUgW2RlZmF1bHQsIGRhcmtibHVlLCB3aGl0ZWdvbGRdXHJcblx0XHRcdHByZWxvYWREZWxheTogNzcwLFxyXG5cdFx0XHRwcmVsb2FkOiBbXSwgLy8gcHJlbG9hZCBpbWFnZXMgYnkgaW5kZXggbnVtYmVyXHJcblx0XHRcdG1vZGFsOiB7XHJcblx0XHRcdFx0dGl0bGU6ICcnLCAvLyBtb2RhbCB3aW5kb3cgdGl0bGVcclxuXHRcdFx0XHRzdWJ0aXRsZTogJycsIC8vIG1vZGFsIHdpbmRvdyBzdWJ0aXRsZVxyXG5cdFx0XHRcdGNhcHRpb246IHtcclxuXHRcdFx0XHRcdHZpc2libGU6IHRydWUsIC8vIHNob3cvaGlkZSBpbWFnZSBjYXB0aW9uXHJcblx0XHRcdFx0XHRwb3NpdGlvbjogJ3RvcCcgLy8gY2FwdGlvbiBwb3NpdGlvbiBbdG9wLCBib3R0b21dXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRtZW51OiB0cnVlLCAvLyBzaG93L2hpZGUgbW9kYWwgbWVudVxyXG5cdFx0XHRcdGhlbHA6IGZhbHNlLCAvLyBzaG93L2hpZGUgaGVscFxyXG5cdFx0XHRcdGFycm93cyA6IHRydWUsIC8vIHNob3cvaGlkZSBhcnJvd3NcclxuXHRcdFx0XHR0aHVtYm5haWw6IHtcclxuXHRcdFx0XHRcdGhlaWdodDogNTAsIC8vIHRodW1ibmFpbCBpbWFnZSBoZWlnaHQgaW4gcGl4ZWxcclxuXHRcdFx0XHRcdGluZGV4OiBmYWxzZSwgLy8gc2hvdyBpbmRleCBudW1iZXIgb24gdGh1bWJuYWlsXHJcblx0XHRcdFx0XHRkeW5hbWljOiBmYWxzZSwgLy8gaWYgdHJ1ZSB0aHVtYm5haWxzIHZpc2libGUgb25seSB3aGVuIG1vdXNlb3ZlclxyXG5cdFx0XHRcdFx0Y2xpY2s6IHtcclxuXHRcdFx0XHRcdFx0c2VsZWN0OiB0cnVlLCAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugd2hlbiB0cnVlXHJcblx0XHRcdFx0XHRcdG1vZGFsOiBmYWxzZSAvLyBvcGVuIG1vZGFsIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGhvdmVyOiB7XHJcblx0XHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRcdFx0c2l6ZTogJ2NvdmVyJywgLy8gY29udGFpbiwgY292ZXIsIGF1dG8sIHN0cmV0Y2hcclxuXHRcdFx0XHRrZXljb2Rlczoge1xyXG5cdFx0XHRcdFx0ZXhpdDogWzI3XSwgLy8gZXNjXHJcblx0XHRcdFx0XHRwbGF5cGF1c2U6IFs4MF0sIC8vIHBcclxuXHRcdFx0XHRcdGZvcndhcmQ6IFszMiwgMzldLCAvLyBzcGFjZSwgcmlnaHQgYXJyb3dcclxuXHRcdFx0XHRcdGJhY2t3YXJkOiBbMzddLCAvLyBsZWZ0IGFycm93XHJcblx0XHRcdFx0XHRmaXJzdDogWzM4LCAzNl0sIC8vIHVwIGFycm93LCBob21lXHJcblx0XHRcdFx0XHRsYXN0OiBbNDAsIDM1XSwgLy8gZG93biBhcnJvdywgZW5kXHJcblx0XHRcdFx0XHRmdWxsc2NyZWVuOiBbMTNdLCAvLyBlbnRlclxyXG5cdFx0XHRcdFx0bWVudTogWzc3XSwgLy8gbVxyXG5cdFx0XHRcdFx0Y2FwdGlvbjogWzY3XSwgLy8gY1xyXG5cdFx0XHRcdFx0aGVscDogWzcyXSwgLy8gaFxyXG5cdFx0XHRcdFx0c2l6ZTogWzgzXSwgLy8gc1xyXG5cdFx0XHRcdFx0dHJhbnNpdGlvbjogWzg0XSAvLyB0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR0aHVtYm5haWw6IHtcclxuXHRcdFx0XHRoZWlnaHQ6IDUwLCAvLyB0aHVtYm5haWwgaW1hZ2UgaGVpZ2h0IGluIHBpeGVsXHJcblx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93IGluZGV4IG51bWJlciBvbiB0aHVtYm5haWxcclxuXHRcdFx0XHRkeW5hbWljOiBmYWxzZSwgLy8gaWYgdHJ1ZSB0aHVtYm5haWxzIHZpc2libGUgb25seSB3aGVuIG1vdXNlb3ZlclxyXG5cdFx0XHRcdGNsaWNrOiB7XHJcblx0XHRcdFx0XHRzZWxlY3Q6IHRydWUsIC8vIHNldCBzZWxlY3RlZCBpbWFnZSB3aGVuIHRydWVcclxuXHRcdFx0XHRcdG1vZGFsOiBmYWxzZSAvLyBvcGVuIG1vZGFsIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aG92ZXI6IHtcclxuXHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRwYW5lbDoge1xyXG5cdFx0XHRcdHZpc2libGU6IHRydWUsXHJcblx0XHRcdFx0aXRlbToge1xyXG5cdFx0XHRcdFx0Y2xhc3M6ICdjb2wtbWQtMycsIC8vIGl0ZW0gY2xhc3NcclxuXHRcdFx0XHRcdGNhcHRpb246IGZhbHNlLFxyXG5cdFx0XHRcdFx0aW5kZXg6IGZhbHNlLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aG92ZXI6IHtcclxuXHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGNsaWNrOiB7XHJcblx0XHRcdFx0XHRzZWxlY3Q6IGZhbHNlLCAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugd2hlbiB0cnVlXHJcblx0XHRcdFx0XHRtb2RhbDogdHJ1ZSAvLyBvcGVuIG1vZGFsIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdGltYWdlOiB7XHJcblx0XHRcdFx0dHJhbnNpdGlvbjogJ3NsaWRlTFInLCAvLyB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0XHRcdHNpemU6ICdjb3ZlcicsIC8vIGNvbnRhaW4sIGNvdmVyLCBhdXRvLCBzdHJldGNoXHJcblx0XHRcdFx0YXJyb3dzIDogdHJ1ZSwgLy8gc2hvdy9oaWRlIGFycm93c1xyXG5cdFx0XHRcdGhlaWdodDogbnVsbCwgLy8gaGVpZ2h0XHJcblx0XHRcdFx0aGVpZ2h0TWluOiBudWxsLCAvLyBtaW4gaGVpZ2h0XHJcblx0XHRcdFx0aGVpZ2h0QXV0bzoge1xyXG5cdFx0XHRcdFx0aW5pdGlhbDogdHJ1ZSxcclxuXHRcdFx0XHRcdG9ucmVzaXplOiBmYWxzZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBhdmFpbGFibGUgaW1hZ2Ugc2l6ZXNcclxuXHRcdHB1YmxpYyBzaXplcyA6IEFycmF5PHN0cmluZz4gPSBbXHJcblx0XHRcdCdjb250YWluJyxcclxuXHRcdFx0J2NvdmVyJyxcclxuXHRcdFx0J2F1dG8nLFxyXG5cdFx0XHQnc3RyZXRjaCdcclxuXHRcdF07XHJcblxyXG5cdFx0Ly8gYXZhaWxhYmxlIHRoZW1lc1xyXG5cdFx0cHVibGljIHRoZW1lcyA6IEFycmF5PHN0cmluZz4gPSBbXHJcblx0XHRcdCdkZWZhdWx0JyxcclxuXHRcdFx0J2RhcmtibHVlJyxcclxuXHRcdFx0J3doaXRlZ29sZCdcclxuXHRcdF07XHJcblxyXG5cdFx0Ly8gYXZhaWxhYmxlIHRyYW5zaXRpb25zXHJcblx0XHRwdWJsaWMgdHJhbnNpdGlvbnMgOiBBcnJheTxzdHJpbmc+ID0gW1xyXG5cdFx0XHQnbm8nLFxyXG5cdFx0XHQnZmFkZUluT3V0JyxcclxuXHRcdFx0J3pvb21JbicsXHJcblx0XHRcdCd6b29tT3V0JyxcclxuXHRcdFx0J3pvb21Jbk91dCcsXHJcblx0XHRcdCdyb3RhdGVMUicsXHJcblx0XHRcdCdyb3RhdGVUQicsXHJcblx0XHRcdCdyb3RhdGVaWScsXHJcblx0XHRcdCdzbGlkZUxSJyxcclxuXHRcdFx0J3NsaWRlVEInLFxyXG5cdFx0XHQnZmxpcFgnLFxyXG5cdFx0XHQnZmxpcFknXHJcblx0XHRdO1xyXG5cclxuXHRcdHB1YmxpYyBldmVudHMgPSB7XHJcblx0XHRcdENPTkZJR19MT0FEOiAnQVNHLWNvbmZpZy1sb2FkLScsXHJcblx0XHRcdEFVVE9QTEFZX1NUQVJUOiAnQVNHLWF1dG9wbGF5LXN0YXJ0LScsXHJcblx0XHRcdEFVVE9QTEFZX1NUT1A6ICdBU0ctYXV0b3BsYXktc3RvcC0nLFxyXG5cdFx0XHRQQVJTRV9JTUFHRVM6ICdBU0ctcGFyc2UtaW1hZ2VzLScsXHJcblx0XHRcdExPQURfSU1BR0U6ICdBU0ctbG9hZC1pbWFnZS0nLFxyXG5cdFx0XHRGSVJTVF9JTUFHRTogJ0FTRy1maXJzdC1pbWFnZS0nLFxyXG5cdFx0XHRDSEFOR0VfSU1BR0U6ICdBU0ctY2hhbmdlLWltYWdlLScsXHJcblx0XHRcdE1PREFMX09QRU46ICdBU0ctbW9kYWwtb3Blbi0nLFxyXG5cdFx0XHRNT0RBTF9DTE9TRTogJ0FTRy1tb2RhbC1jbG9zZS0nLFxyXG5cdFx0XHRUSFVNQk5BSUxfTU9WRTogJ0FTRy10aHVtYm5haWwtbW92ZS0nLFxyXG5cdFx0fTtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHRpbWVvdXQgOiBuZy5JVGltZW91dFNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlIGludGVydmFsIDogbmcuSUludGVydmFsU2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgbG9jYXRpb24gOiBuZy5JTG9jYXRpb25TZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkcm9vdFNjb3BlIDogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICR3aW5kb3cgOiBuZy5JV2luZG93U2VydmljZSkge1xyXG5cclxuXHRcdFx0YW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoJ3Jlc2l6ZScsIChldmVudCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMudGh1bWJuYWlsc01vdmUoMjAwKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgcGFyc2VIYXNoKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmlkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgaGFzaCA9IHRoaXMubG9jYXRpb24uaGFzaCgpO1xyXG5cdFx0XHRsZXQgcGFydHMgPSBoYXNoID8gaGFzaC5zcGxpdCgnLScpIDogbnVsbDtcclxuXHJcblx0XHRcdGlmIChwYXJ0cyA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHBhcnRzWzBdICE9PSB0aGlzLnNsdWcpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChwYXJ0cy5sZW5ndGggIT09IDMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChwYXJ0c1sxXSAhPT0gdGhpcy5pZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGluZGV4ID0gcGFyc2VJbnQocGFydHNbMl0sIDEwKTtcclxuXHJcblx0XHRcdGlmICghYW5ndWxhci5pc051bWJlcihpbmRleCkpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblxyXG5cdFx0XHRcdGluZGV4LS07XHJcblx0XHRcdFx0dGhpcy5zZWxlY3RlZCA9IGluZGV4O1xyXG5cdFx0XHRcdHRoaXMubW9kYWxPcGVuKGluZGV4KTtcclxuXHJcblx0XHRcdH0sIDIwKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRlIG9iamVjdCBoYXNoIGlkXHJcblx0XHRwdWJsaWMgb2JqZWN0SGFzaElkKG9iamVjdCA6IGFueSkgOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0bGV0IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KG9iamVjdCk7XHJcblxyXG5cdFx0XHRpZiAoIXN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgYWJjID0gc3RyaW5nLnJlcGxhY2UoL1teYS16QS1aMC05XSsvZywgJycpO1xyXG5cdFx0XHRsZXQgY29kZSA9IDA7XHJcblxyXG5cdFx0XHRmb3IgKGxldCBpID0gMCwgbiA9IGFiYy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuXHRcdFx0XHRsZXQgY2hhcmNvZGUgPSBhYmMuY2hhckNvZGVBdChpKTtcclxuXHRcdFx0XHRjb2RlICs9IChjaGFyY29kZSAqIGkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gY29kZS50b1N0cmluZygyMSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlIGZvciBjdXJyZW50IGdhbGxlcnkgYnkgY29tcG9uZW50IGlkXHJcblx0XHRwdWJsaWMgZ2V0SW5zdGFuY2UoY29tcG9uZW50IDogYW55KSB7XHJcblxyXG5cdFx0XHRpZiAoIWNvbXBvbmVudC5pZCkge1xyXG5cclxuXHRcdFx0XHQvLyBnZXQgcGFyZW50IGFzZyBjb21wb25lbnQgaWRcclxuXHRcdFx0XHRpZiAoY29tcG9uZW50LiRzY29wZSAmJiBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQgJiYgY29tcG9uZW50LiRzY29wZS4kcGFyZW50LiRwYXJlbnQgJiYgY29tcG9uZW50LiRzY29wZS4kcGFyZW50LiRwYXJlbnQuJGN0cmwpIHtcclxuXHRcdFx0XHRcdGNvbXBvbmVudC5pZCA9IGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudC4kcGFyZW50LiRjdHJsLmlkO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb21wb25lbnQuaWQgPSB0aGlzLm9iamVjdEhhc2hJZChjb21wb25lbnQub3B0aW9ucyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgaWQgPSBjb21wb25lbnQuaWQ7XHJcblx0XHRcdGxldCBpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzW2lkXTtcclxuXHJcblx0XHRcdC8vIG5ldyBpbnN0YW5jZSBhbmQgc2V0IG9wdGlvbnMgYW5kIGl0ZW1zXHJcblx0XHRcdGlmIChpbnN0YW5jZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0aW5zdGFuY2UgPSBuZXcgU2VydmljZUNvbnRyb2xsZXIodGhpcy50aW1lb3V0LCB0aGlzLmludGVydmFsLCB0aGlzLmxvY2F0aW9uLCB0aGlzLiRyb290U2NvcGUsIHRoaXMuJHdpbmRvdyk7XHJcblx0XHRcdFx0aW5zdGFuY2UuaWQgPSBpZDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGNvbXBvbmVudC5iYXNlVXJsKSB7XHJcblx0XHRcdFx0Y29tcG9uZW50Lm9wdGlvbnMuYmFzZVVybCA9IGNvbXBvbmVudC5iYXNlVXJsO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpbnN0YW5jZS5zZXRPcHRpb25zKGNvbXBvbmVudC5vcHRpb25zKTtcclxuXHRcdFx0aW5zdGFuY2Uuc2V0SXRlbXMoY29tcG9uZW50Lml0ZW1zKTtcclxuXHRcdFx0aW5zdGFuY2Uuc2VsZWN0ZWQgPSBjb21wb25lbnQuc2VsZWN0ZWQgPyBjb21wb25lbnQuc2VsZWN0ZWQgOiAwO1xyXG5cdFx0XHRpbnN0YW5jZS5wYXJzZUhhc2goKTtcclxuXHJcblx0XHRcdGlmIChpbnN0YW5jZS5vcHRpb25zKSB7XHJcblxyXG5cdFx0XHRcdGluc3RhbmNlLmxvYWRJbWFnZXMoaW5zdGFuY2Uub3B0aW9ucy5wcmVsb2FkKTtcclxuXHJcblx0XHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMuYXV0b3BsYXkgJiYgaW5zdGFuY2Uub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkICYmICFpbnN0YW5jZS5hdXRvcGxheSkge1xyXG5cdFx0XHRcdFx0aW5zdGFuY2UuYXV0b1BsYXlTdGFydCgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuaW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xyXG5cdFx0XHRyZXR1cm4gaW5zdGFuY2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHByZXBhcmUgaW1hZ2VzIGFycmF5XHJcblx0XHRwdWJsaWMgc2V0SXRlbXMoaXRlbXMgOiBBcnJheTxJRmlsZT4pIHtcclxuXHJcblx0XHRcdGlmICghaXRlbXMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGlmIGFscmVhZHlcclxuXHRcdFx0aWYgKHRoaXMuaXRlbXMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHBhcnNlIGFycmF5IHN0cmluZyBlbGVtZW50c1xyXG5cdFx0XHRpZiAoYW5ndWxhci5pc1N0cmluZyhpdGVtc1swXSkgPT09IHRydWUpIHtcclxuXHJcblx0XHRcdFx0dGhpcy5pdGVtcyA9IFtdO1xyXG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdHRoaXMuaXRlbXMucHVzaCh7c291cmNlOiB7bW9kYWw6IGl0ZW1zW2ldfX0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdHRoaXMuaXRlbXMgPSBpdGVtcztcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMucHJlcGFyZUl0ZW1zKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG9wdGlvbnMgc2V0dXBcclxuXHRcdHB1YmxpYyBzZXRPcHRpb25zKG9wdGlvbnMgOiBJT3B0aW9ucykge1xyXG5cclxuXHRcdFx0Ly8gaWYgb3B0aW9ucyBhbHJlYWR5IHNldHVwXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnNMb2FkZWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChvcHRpb25zKSB7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25zID0gYW5ndWxhci5tZXJnZSh0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnNMb2FkZWQgPSB0cnVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMub3B0aW9ucyA9IHRoaXMuZGVmYXVsdHM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGltcG9ydGFudCFcclxuXHRcdFx0b3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQ09ORklHX0xPQUQsIHRoaXMub3B0aW9ucyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0diA9IHRoaXMubm9ybWFsaXplKHYpO1xyXG5cdFx0XHRsZXQgcHJldiA9IHRoaXMuX3NlbGVjdGVkO1xyXG5cclxuXHRcdFx0dGhpcy5fc2VsZWN0ZWQgPSB2O1xyXG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcclxuXHJcblx0XHRcdGlmIChwcmV2ICE9PSB0aGlzLl9zZWxlY3RlZCkge1xyXG5cclxuXHRcdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKCk7XHJcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5DSEFOR0VfSU1BR0UsIHtcclxuXHRcdFx0XHRcdGluZGV4OiB2LFxyXG5cdFx0XHRcdFx0ZmlsZTogdGhpcy5maWxlXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLl9zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBzZXRTZWxlY3RlZChpbmRleCA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSBpbmRleCA+IHRoaXMuc2VsZWN0ZWQgPyAnZm9yd2FyZCcgOiAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXg7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ28gdG8gYmFja3dhcmRcclxuXHRcdHB1YmxpYyB0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0aWYgKHN0b3ApIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQtLTtcclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCAtIDEpO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gZm9yd2FyZFxyXG5cdFx0cHVibGljIHRvRm9yd2FyZChzdG9wPyA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmIChzdG9wKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQrKztcclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCArIDEpO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gZmlyc3RcclxuXHRcdHB1YmxpYyB0b0ZpcnN0KHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0aWYgKHN0b3ApIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSAwO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gbGFzdFxyXG5cdFx0cHVibGljIHRvTGFzdChzdG9wPyA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmIChzdG9wKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLml0ZW1zLmxlbmd0aCAtIDE7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc2V0SGFzaCgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm1vZGFsVmlzaWJsZSkge1xyXG5cdFx0XHRcdHRoaXMubG9jYXRpb24uaGFzaChbdGhpcy5zbHVnLCB0aGlzLmlkLCB0aGlzLnNlbGVjdGVkICsgMV0uam9pbignLScpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlUb2dnbGUoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQpIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdGFydCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlTdG9wKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmludGVydmFsLmNhbmNlbCh0aGlzLmF1dG9wbGF5KTtcclxuXHRcdFx0dGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5hdXRvcGxheSA9IG51bGw7XHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQVVUT1BMQVlfU1RPUCwge2luZGV4OiB0aGlzLnNlbGVjdGVkLCBmaWxlOiB0aGlzLmZpbGV9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5U3RhcnQoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5hdXRvcGxheSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLmF1dG9wbGF5ID0gdGhpcy5pbnRlcnZhbCgoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy50b0ZvcndhcmQoKTtcclxuXHRcdFx0fSwgdGhpcy5vcHRpb25zLmF1dG9wbGF5LmRlbGF5KTtcclxuXHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQVVUT1BMQVlfU1RBUlQsIHtpbmRleDogdGhpcy5zZWxlY3RlZCwgZmlsZTogdGhpcy5maWxlfSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwcml2YXRlIHByZXBhcmVJdGVtcygpIHtcclxuXHJcblx0XHRcdGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0bGV0IGdldEF2YWlsYWJsZVNvdXJjZSA9IGZ1bmN0aW9uICh0eXBlIDogc3RyaW5nLCBzb3VyY2UgOiBJU291cmNlKSB7XHJcblxyXG5cdFx0XHRcdGlmIChzb3VyY2VbdHlwZV0pIHtcclxuXHRcdFx0XHRcdHJldHVybiBzb3VyY2VbdHlwZV07XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ3BhbmVsJykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGdldEF2YWlsYWJsZVNvdXJjZSgnaW1hZ2UnLCBzb3VyY2UpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdpbWFnZScpIHtcclxuXHRcdFx0XHRcdHJldHVybiBnZXRBdmFpbGFibGVTb3VyY2UoJ21vZGFsJywgc291cmNlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlID09PSAnbW9kYWwnKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZ2V0QXZhaWxhYmxlU291cmNlKCdpbWFnZScsIHNvdXJjZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fTtcclxuXHJcblxyXG5cdFx0XHRhbmd1bGFyLmZvckVhY2godGhpcy5pdGVtcywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcclxuXHJcblx0XHRcdFx0aWYgKCF2YWx1ZS5zb3VyY2UpIHtcclxuXHJcblx0XHRcdFx0XHR2YWx1ZS5zb3VyY2UgPSB7XHJcblx0XHRcdFx0XHRcdG1vZGFsOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5tb2RhbF0sXHJcblx0XHRcdFx0XHRcdHBhbmVsOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5wYW5lbF0sXHJcblx0XHRcdFx0XHRcdGltYWdlOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5pbWFnZV0sXHJcblx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBzb3VyY2UgPSB7XHJcblx0XHRcdFx0XHRtb2RhbDogc2VsZi5vcHRpb25zLmJhc2VVcmwgKyBnZXRBdmFpbGFibGVTb3VyY2UoJ21vZGFsJywgdmFsdWUuc291cmNlKSxcclxuXHRcdFx0XHRcdHBhbmVsOiBzZWxmLm9wdGlvbnMuYmFzZVVybCArIGdldEF2YWlsYWJsZVNvdXJjZSgncGFuZWwnLCB2YWx1ZS5zb3VyY2UpLFxyXG5cdFx0XHRcdFx0aW1hZ2U6IHNlbGYub3B0aW9ucy5iYXNlVXJsICsgZ2V0QXZhaWxhYmxlU291cmNlKCdpbWFnZScsIHZhbHVlLnNvdXJjZSksXHJcblx0XHRcdFx0fTtcclxuXHJcblxyXG5cdFx0XHRcdGxldCBwYXJ0cyA9IHNvdXJjZS5tb2RhbC5zcGxpdCgnLycpO1xyXG5cdFx0XHRcdGxldCBmaWxlbmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xyXG5cclxuXHRcdFx0XHRsZXQgdGl0bGUsIGRlc2NyaXB0aW9uO1xyXG5cclxuXHRcdFx0XHRpZiAoc2VsZi5vcHRpb25zLmZpZWxkcyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHR0aXRsZSA9IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aXRsZV0gOiBmaWxlbmFtZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGl0bGUgPSBmaWxlbmFtZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChzZWxmLm9wdGlvbnMuZmllbGRzICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uID0gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5kZXNjcmlwdGlvbl0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA6IG51bGw7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uID0gbnVsbDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBmaWxlID0ge1xyXG5cdFx0XHRcdFx0c291cmNlOiBzb3VyY2UsXHJcblx0XHRcdFx0XHR0aXRsZTogdGl0bGUsXHJcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRsb2FkZWQ6IHtcclxuXHRcdFx0XHRcdFx0bW9kYWw6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHRwYW5lbDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdGltYWdlOiBmYWxzZVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdHNlbGYuZmlsZXMucHVzaChmaWxlKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5QQVJTRV9JTUFHRVMsIHRoaXMuZmlsZXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBwcmVsb2FkIHRoZSBpbWFnZSB3aGVuIG1vdXNlb3ZlclxyXG5cdFx0cHVibGljIGhvdmVyUHJlbG9hZChpbmRleCA6IG51bWJlcikge1xyXG5cdFx0XHR0aGlzLmxvYWRJbWFnZShpbmRleCk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGltYWdlIHByZWxvYWRcclxuXHRcdHByaXZhdGUgcHJlbG9hZCh3YWl0PyA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCk7XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQgKyAxKTtcclxuXHRcdFx0fSwgKHdhaXQgIT09IHVuZGVmaW5lZCkgPyB3YWl0IDogdGhpcy5vcHRpb25zLnByZWxvYWREZWxheSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBub3JtYWxpemUoaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGxldCBsYXN0ID0gdGhpcy5maWxlcy5sZW5ndGggLSAxO1xyXG5cclxuXHRcdFx0aWYgKGluZGV4ID4gbGFzdCkge1xyXG5cdFx0XHRcdHJldHVybiAoaW5kZXggLSBsYXN0KSAtIDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChpbmRleCA8IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gbGFzdCAtIE1hdGguYWJzKGluZGV4KSArIDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBpbmRleDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBsb2FkSW1hZ2VzKGluZGV4ZXMgOiBBcnJheTxudW1iZXI+LCB0eXBlIDogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHRpZiAoIWluZGV4ZXMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdGluZGV4ZXMuZm9yRWFjaCgoaW5kZXggOiBudW1iZXIpID0+IHtcclxuXHRcdFx0XHRzZWxmLmxvYWRJbWFnZShpbmRleCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGxvYWRJbWFnZShpbmRleD8gOiBudW1iZXIsIGNhbGxiYWNrPyA6IHt9KSB7XHJcblxyXG5cdFx0XHRpbmRleCA9IGluZGV4ID8gaW5kZXggOiB0aGlzLnNlbGVjdGVkO1xyXG5cdFx0XHRpbmRleCA9IHRoaXMubm9ybWFsaXplKGluZGV4KTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5maWxlc1tpbmRleF0pIHtcclxuXHRcdFx0XHR0aGlzLmxvZygnaW52YWxpZCBmaWxlIGluZGV4Jywge2luZGV4OiBpbmRleH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZC5tb2RhbCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcblx0XHRcdGltYWdlLnNyYyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5pbWFnZTtcclxuXHRcdFx0aW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFmdGVyTG9hZChpbmRleCwgJ2ltYWdlJywgaW1hZ2UpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGxldCBtb2RhbCA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0XHRtb2RhbC5zcmMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2UubW9kYWw7XHJcblx0XHRcdG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFmdGVyTG9hZChpbmRleCwgJ21vZGFsJywgbW9kYWwpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGZpbGUgbmFtZVxyXG5cdFx0cHJpdmF0ZSBnZXRGaWxlbmFtZShpbmRleCA6IG51bWJlciwgdHlwZT8gOiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdHR5cGUgPSB0eXBlID8gdHlwZSA6ICdtb2RhbCc7XHJcblx0XHRcdGxldCBmaWxlcGFydHMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2VbdHlwZV0uc3BsaXQoJy8nKTtcclxuXHRcdFx0bGV0IGZpbGVuYW1lID0gZmlsZXBhcnRzW2ZpbGVwYXJ0cy5sZW5ndGggLSAxXTtcclxuXHRcdFx0cmV0dXJuIGZpbGVuYW1lO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgZmlsZSBleHRlbnNpb25cclxuXHRcdHByaXZhdGUgZ2V0RXh0ZW5zaW9uKGluZGV4IDogbnVtYmVyLCB0eXBlPyA6IHN0cmluZykge1xyXG5cclxuXHRcdFx0dHlwZSA9IHR5cGUgPyB0eXBlIDogJ21vZGFsJztcclxuXHRcdFx0bGV0IGZpbGVwYXJ0cyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZVt0eXBlXS5zcGxpdCgnLicpO1xyXG5cdFx0XHRsZXQgZXh0ZW5zaW9uID0gZmlsZXBhcnRzW2ZpbGVwYXJ0cy5sZW5ndGggLSAxXTtcclxuXHRcdFx0cmV0dXJuIGV4dGVuc2lvbjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gYWZ0ZXIgbG9hZCBpbWFnZVxyXG5cdFx0cHJpdmF0ZSBhZnRlckxvYWQoaW5kZXgsIHR5cGUsIGltYWdlKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5maWxlc1tpbmRleF0ubG9hZGVkW3R5cGVdID09PSB0cnVlKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWRbdHlwZV0gPSB0cnVlO1xyXG5cclxuXHRcdFx0aWYgKHR5cGUgPT09ICdtb2RhbCcpIHtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS53aWR0aCA9IGltYWdlLndpZHRoO1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmhlaWdodCA9IGltYWdlLmhlaWdodDtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5uYW1lID0gdGhpcy5nZXRGaWxlbmFtZShpbmRleCwgdHlwZSk7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0uZXh0ZW5zaW9uID0gdGhpcy5nZXRFeHRlbnNpb24oaW5kZXgsIHR5cGUpO1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmRvd25sb2FkID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlLm1vZGFsO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgZGF0YSA9IHt0eXBlOiB0eXBlLCBpbmRleDogaW5kZXgsIGZpbGU6IHRoaXMuZmlsZSwgaW1nOiBpbWFnZX07XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuZmlyc3QpIHtcclxuXHRcdFx0XHR0aGlzLmZpcnN0ID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkZJUlNUX0lNQUdFLCBkYXRhKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5MT0FEX0lNQUdFLCBkYXRhKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGlzIHNpbmdsZT9cclxuXHRcdHB1YmxpYyBnZXQgaXNTaW5nbGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlcy5sZW5ndGggPiAxID8gZmFsc2UgOiB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZSBkb3dubG9hZCBsaW5rXHJcblx0XHRwdWJsaWMgZG93bmxvYWRMaW5rKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuc2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmZpbGVzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5maWxlc1t0aGlzLnNlbGVjdGVkXS5zb3VyY2UubW9kYWw7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB0aGUgZmlsZVxyXG5cdFx0cHVibGljIGdldCBmaWxlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuZmlsZXNbdGhpcy5zZWxlY3RlZF07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBlbGVtZW50IHZpc2libGVcclxuXHRcdHB1YmxpYyB0b2dnbGUoZWxlbWVudCA6IHN0cmluZykge1xyXG5cclxuXHRcdFx0dGhpcy5vcHRpb25zW2VsZW1lbnRdLnZpc2libGUgPSAhdGhpcy5vcHRpb25zW2VsZW1lbnRdLnZpc2libGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgdmlzaWJsZVxyXG5cdFx0cHVibGljIGdldCBtb2RhbFZpc2libGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5fdmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB0aGVtZVxyXG5cdFx0cHVibGljIGdldCB0aGVtZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnMudGhlbWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBzZXQgdmlzaWJsZVxyXG5cdFx0cHVibGljIHNldCBtb2RhbFZpc2libGUodmFsdWUgOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHR0aGlzLl92aXNpYmxlID0gdmFsdWU7XHJcblxyXG5cdFx0XHRpZiAodmFsdWUpIHtcclxuXHJcblx0XHRcdFx0dGhpcy5wcmVsb2FkKDEpO1xyXG5cdFx0XHRcdHRoaXMubW9kYWxJbml0KCk7XHJcblx0XHRcdFx0dGhpcy5lbCgnYm9keScpLmFkZENsYXNzKCd5aGlkZGVuJyk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHR0aGlzLmVsKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3loaWRkZW4nKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaW5pdGlhbGl6ZSB0aGUgZ2FsbGVyeVxyXG5cdFx0cHJpdmF0ZSBtb2RhbEluaXQoKSB7XHJcblxyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cclxuXHRcdFx0XHQvLyBzdWJtZW51IGNsaWNrIGV2ZW50c1xyXG5cdFx0XHRcdGxldCBlbGVtZW50ID0gJy5hc2ctbW9kYWwuJyArIHNlbGYuaWQgKyAnIGxpLmRyb3Bkb3duLXN1Ym1lbnUnO1xyXG5cclxuXHRcdFx0XHR0aGlzLmVsKGVsZW1lbnQpLm9mZigpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cclxuXHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuXHRcdFx0XHRcdGlmICh0aGlzLmVsKGVsZW1lbnQpLmhhc0NsYXNzKCdvcGVuJykpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lbChlbGVtZW50KS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lbChlbGVtZW50KS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVsKGVsZW1lbnQpLmFkZENsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRzZWxmLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0XHR9LCAxMDApO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIG1vZGFsT3BlbihpbmRleCA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLm1vZGFsQXZhaWxhYmxlKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXggIT09IHVuZGVmaW5lZCA/IGluZGV4IDogdGhpcy5zZWxlY3RlZDtcclxuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5NT0RBTF9PUEVOLCB7aW5kZXg6IHRoaXMuc2VsZWN0ZWR9KTtcclxuXHRcdFx0dGhpcy5zZXRGb2N1cygpO1xyXG5cdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKDIwMCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBtb2RhbENsb3NlKCkge1xyXG5cclxuXHRcdFx0dGhpcy5sb2NhdGlvbi5oYXNoKCcnKTtcclxuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5NT0RBTF9DTE9TRSwge2luZGV4OiB0aGlzLnNlbGVjdGVkfSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG1vdmUgdGh1bWJuYWlscyB0byBjb3JyZWN0IHBvc2l0aW9uXHJcblx0XHRwdWJsaWMgdGh1bWJuYWlsc01vdmUoZGVsYXk/IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRsZXQgbW92ZSA9ICgpID0+IHtcclxuXHJcblx0XHRcdFx0bGV0IGNvbnRhaW5lcnMgPSB0aGlzLmVsKCcuYXNnLXRodW1ibmFpbC4nICsgdGhpcy5pZCk7XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY29udGFpbmVycy5sZW5ndGg7IGkrKykge1xyXG5cclxuXHRcdFx0XHRcdGxldCBjb250YWluZXIgPSBjb250YWluZXJzW2ldO1xyXG5cclxuXHRcdFx0XHRcdGlmIChjb250YWluZXIub2Zmc2V0V2lkdGgpIHtcclxuXHJcblx0XHRcdFx0XHRcdGxldCBpdGVtcyA6IGFueSA9IHRoaXMuZWwoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5pdGVtcycpKVswXTtcclxuXHRcdFx0XHRcdFx0bGV0IGl0ZW0gOiBhbnkgPSB0aGlzLmVsKGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuaXRlbScpKVswXTtcclxuXHRcdFx0XHRcdFx0bGV0IHRodW1ibmFpbCwgbW92ZVgsIHJlbWFpbjtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChpdGVtKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChpdGVtcy5zY3JvbGxXaWR0aCA+IGNvbnRhaW5lci5vZmZzZXRXaWR0aCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGh1bWJuYWlsID0gaXRlbXMuc2Nyb2xsV2lkdGggLyB0aGlzLmZpbGVzLmxlbmd0aDtcclxuXHRcdFx0XHRcdFx0XHRcdG1vdmVYID0gKGNvbnRhaW5lci5vZmZzZXRXaWR0aCAvIDIpIC0gKHRoaXMuc2VsZWN0ZWQgKiB0aHVtYm5haWwpIC0gdGh1bWJuYWlsIC8gMjtcclxuXHRcdFx0XHRcdFx0XHRcdHJlbWFpbiA9IGl0ZW1zLnNjcm9sbFdpZHRoICsgbW92ZVg7XHJcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IG1vdmVYID4gMCA/IDAgOiBtb3ZlWDtcclxuXHRcdFx0XHRcdFx0XHRcdG1vdmVYID0gcmVtYWluIDwgY29udGFpbmVyLm9mZnNldFdpZHRoID8gY29udGFpbmVyLm9mZnNldFdpZHRoIC0gaXRlbXMuc2Nyb2xsV2lkdGggOiBtb3ZlWDtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGh1bWJuYWlsID0gdGhpcy5nZXRSZWFsV2lkdGgoaXRlbSk7XHJcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IChjb250YWluZXIub2Zmc2V0V2lkdGggLSB0aHVtYm5haWwgKiB0aGlzLmZpbGVzLmxlbmd0aCkgLyAyO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aXRlbXMuc3R5bGUubGVmdCA9IG1vdmVYICsgJ3B4JztcclxuXHJcblx0XHRcdFx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5USFVNQk5BSUxfTU9WRSwge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGh1bWJuYWlsOiB0aHVtYm5haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRtb3ZlOiBtb3ZlWCxcclxuXHRcdFx0XHRcdFx0XHRcdHJlbWFpbjogcmVtYWluLFxyXG5cdFx0XHRcdFx0XHRcdFx0Y29udGFpbmVyOiBjb250YWluZXIub2Zmc2V0V2lkdGgsXHJcblx0XHRcdFx0XHRcdFx0XHRpdGVtczogaXRlbXMuc2Nyb2xsV2lkdGhcclxuXHRcdFx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKGRlbGF5KSB7XHJcblx0XHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdG1vdmUoKTtcclxuXHRcdFx0XHR9LCBkZWxheSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bW92ZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgbW9kYWxDbGljaygkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKCRldmVudCkge1xyXG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5zZXRGb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdGhlIGZvY3VzXHJcblx0XHRwdWJsaWMgc2V0Rm9jdXMoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5tb2RhbFZpc2libGUpIHtcclxuXHRcdFx0XHR0aGlzLmVsKCcuYXNnLW1vZGFsLicgKyB0aGlzLmlkICsgJyAua2V5SW5wdXQnKS50cmlnZ2VyKCdmb2N1cycpLmZvY3VzKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBldmVudChldmVudCA6IHN0cmluZywgZGF0YT8gOiBhbnkpIHtcclxuXHJcblx0XHRcdGV2ZW50ID0gZXZlbnQgKyB0aGlzLmlkO1xyXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJGVtaXQoZXZlbnQsIGRhdGEpO1xyXG5cdFx0XHR0aGlzLmxvZyhldmVudCwgZGF0YSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBsb2coZXZlbnQgOiBzdHJpbmcsIGRhdGE/IDogYW55KSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmRlYnVnKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXZlbnQsIGRhdGEgPyBkYXRhIDogbnVsbCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGVsKHNlbGVjdG9yKSA6IGFueSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gYW5ndWxhci5lbGVtZW50KHNlbGVjdG9yKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRpbmcgZWxlbWVudCByZWFsIHdpZHRoXHJcblx0XHRwdWJsaWMgZ2V0UmVhbFdpZHRoKGl0ZW0pIHtcclxuXHJcblx0XHRcdGxldCBzdHlsZSA9IGl0ZW0uY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGl0ZW0pLFxyXG5cdFx0XHRcdHdpZHRoID0gaXRlbS5vZmZzZXRXaWR0aCxcclxuXHRcdFx0XHRtYXJnaW4gPSBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkxlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5SaWdodCksXHJcblx0XHRcdFx0Ly9wYWRkaW5nID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdSaWdodCksXHJcblx0XHRcdFx0Ym9yZGVyID0gcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJMZWZ0V2lkdGgpICsgcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJSaWdodFdpZHRoKTtcclxuXHJcblx0XHRcdHJldHVybiB3aWR0aCArIG1hcmdpbiArIGJvcmRlcjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRpbmcgZWxlbWVudCByZWFsIGhlaWdodFxyXG5cdFx0cHVibGljIGdldFJlYWxIZWlnaHQoaXRlbSkge1xyXG5cclxuXHRcdFx0bGV0IHN0eWxlID0gaXRlbS5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUoaXRlbSksXHJcblx0XHRcdFx0aGVpZ2h0ID0gaXRlbS5vZmZzZXRIZWlnaHQsXHJcblx0XHRcdFx0bWFyZ2luID0gcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Ub3ApICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Cb3R0b20pLFxyXG5cdFx0XHRcdC8vcGFkZGluZyA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1RvcCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pLFxyXG5cdFx0XHRcdGJvcmRlciA9IHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyVG9wV2lkdGgpICsgcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gaGVpZ2h0ICsgbWFyZ2luICsgYm9yZGVyO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5zZXJ2aWNlKCdhc2dTZXJ2aWNlJywgWyckdGltZW91dCcsICckaW50ZXJ2YWwnLCAnJGxvY2F0aW9uJywgJyRyb290U2NvcGUnLCAnJHdpbmRvdycsIFNlcnZpY2VDb250cm9sbGVyXSk7XHJcblxyXG59XHJcblxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBUaHVtYm5haWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmwgOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ3RodW1ibmFpbCc7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlID0gJ3ZpZXdzL2FzZy10aHVtYm5haWwuaHRtbCc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgbW9kYWwgPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdFx0XHRwcml2YXRlICRzY29wZSA6IG5nLklTY29wZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJGVsZW1lbnQgOiBuZy5JUm9vdEVsZW1lbnRTZXJ2aWNlKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0XHQvLyBnZXQgcGFyZW50IGFzZyBjb21wb25lbnQgKG1vZGFsKVxyXG5cdFx0XHRpZiAodGhpcy4kc2NvcGUgJiYgdGhpcy4kc2NvcGUuJHBhcmVudCAmJiB0aGlzLiRzY29wZS4kcGFyZW50LiRwYXJlbnQgJiYgdGhpcy4kc2NvcGUuJHBhcmVudC4kcGFyZW50LiRjdHJsKSB7XHJcblx0XHRcdFx0dGhpcy5tb2RhbCA9IHRoaXMuJHNjb3BlLiRwYXJlbnQuJHBhcmVudC4kY3RybC50eXBlID09ICdtb2RhbCcgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGFib3ZlIGZyb20gY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGR5bmFtaWMoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcuZHluYW1pYyA/ICdkeW5hbWljJyA6IG51bGw7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldFNlbGVjdGVkKGluZGV4IDogbnVtYmVyLCAkZXZlbnQ/IDogTW91c2VFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLm1vZGFsKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxPcGVuKGluZGV4KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5zZWxlY3QpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5zZXRTZWxlY3RlZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gcHJlbG9kIHdoZW4gbW91c2VvdmVyIGFuZCBzZXQgc2VsZWN0ZWQgaWYgZW5hYmxlZFxyXG5cdFx0cHVibGljIGhvdmVyKGluZGV4IDogbnVtYmVyLCAkZXZlbnQ/IDogTW91c2VFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cuaG92ZXJQcmVsb2FkKGluZGV4KTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5ob3Zlci5zZWxlY3QgPT09IHRydWUpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5zZXRTZWxlY3RlZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHRodW1ibmFpbCBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc1RodW1ibmFpbCB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5tb2RhbCA/IHRoaXMuYXNnLm9wdGlvbnNbJ21vZGFsJ11bdGhpcy50eXBlXSA6IHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRodW1ibmFpbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNUaHVtYm5haWwpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm1vZGFsKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5hc2cub3B0aW9uc1snbW9kYWwnXVt0aGlzLnR5cGVdID0gdmFsdWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ1RodW1ibmFpbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCAnJGVsZW1lbnQnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LlRodW1ibmFpbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IG5nLXNob3c9XCIkY3RybC5jb25maWcudmlzaWJsZVwiIGNsYXNzPVwiYXNnLXRodW1ibmFpbCB7eyAkY3RybC5hc2cudGhlbWUgfX0ge3sgJGN0cmwuaWQgfX0ge3sgJGN0cmwuZHluYW1pYyB9fVwiIG5nLWNsaWNrPVwiJGN0cmwuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcIj48ZGl2IG5nLWluY2x1ZGU9XCIkY3RybC50ZW1wbGF0ZVwiPjwvZGl2PjwvZGl2PicsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0AnLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nLFxyXG5cdFx0XHRiYXNlVXJsOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiJdfQ==

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/asg-control.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.autoPlayToggle()">\r\n\t<span ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t<span ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toFirst(true)">\r\n\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toBackward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toForward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n</button>\r\n\r\n');
$templateCache.put('views/asg-image.html','<div class="asg-image {{ $ctrl.asg.theme }} {{ $ctrl.id }}" ng-class="{\'nomodal\' : !$ctrl.asg.modalAvailable}" ng-style="{\'min-height\' : $ctrl.config.heightMin + \'px\', \'height\' : $ctrl.height + \'px\'}">\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)">\r\n\r\n\t\t<div class="img" ng-repeat="(key,file) in $ctrl.asg.files" ng-show="$ctrl.asg.selected == key" ng-class="{\'loading\' : !file.loaded.image}">\r\n\r\n\t\t\t<div class="source {{ $ctrl.config.size }}" ng-style="{\'background-image\': \'url(\' + file.source.image + \')\'}" ng-if="file.loaded.image" ng-mouseover="$ctrl.asg.hoverPreload(key)" ng-click="$ctrl.asg.modalOpen()"></div>\r\n\r\n\t\t</div>\r\n\t</div>\r\n\t<div class="arrows" ng-if="$ctrl.config.arrows" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.asg.modalOpen()">\r\n\r\n\t\t<div ng-if="!$ctrl.asg.isSingle" class="toBackward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div ng-if="!$ctrl.asg.isSingle" class="toForward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t</div>\r\n\t<ng-transclude></ng-transclude>\r\n</div>\r\n\r\n\r\n\r\n');
$templateCache.put('views/asg-info.html','<div class="row">\r\n\r\n\t<div class="col-md-12">\r\n\t\t<h3>{{ $ctrl.file.title }}</h3>\r\n\t</div>\r\n\r\n\t<div class="col-md-12">\r\n\t\t{{ $ctrl.file.description }}\r\n\t\t<a target="_blank" href="{{ $ctrl.download }}"><span class="glyphicon glyphicon-download"></span></a>\r\n\t</div>\r\n\r\n</div>\r\n\r\n\r\n');
$templateCache.put('views/asg-modal.html','<script type="text/ng-template" id="help.html">\r\n\t<ul>\r\n\t\t<li>SPACE : forward</li>\r\n\t\t<li>RIGHT : forward</li>\r\n\t\t<li>LEFT : backward</li>\r\n\t\t<li>UP / HOME : first</li>\r\n\t\t<li>DOWN / END : last</li>\r\n\t\t<li>ENTER : toggle fullscreen</li>\r\n\t\t<li>ESC : exit</li>\r\n\t\t<li>p : play/pause</li>\r\n\t\t<li>t : change transition effect</li>\r\n\t\t<li>m : toggle menu</li>\r\n\t\t<li>s : toggle image size</li>\r\n\t\t<li>c : toggle caption</li>\r\n\t\t<li>h : toggle help</li>\r\n\t</ul>\r\n</script>\r\n\r\n<div class="asg-modal {{ $ctrl.id }}" ng-class="$ctrl.getClass()" ng-click="$ctrl.close($event);" ng-show="$ctrl.asg.modalVisible" ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="frame" ng-click="$ctrl.asg.modalClick($event);">\r\n\r\n\t\t<div class="header" ng-click="$ctrl.asg.modalClick($event);">\r\n\r\n\t\t\t<span class="buttons visible-xs pull-right">\r\n\t\t\t\t <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs">\r\n\t\t\t\t\t\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n\t\t\t\t </button>\r\n\t\t\t</span>\r\n\r\n\t\t\t<span class="buttons hidden-xs pull-right">\r\n\r\n\t\t\t   <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.autoPlayToggle($event)">\r\n                    <span ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t\t\t\t   <span ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n                </button>\r\n\r\n                <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toFirst(true, $event)">\r\n                    {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n                </button>\r\n\r\n                <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toBackward(true, $event)">\r\n                    <span class="glyphicon glyphicon-chevron-left"></span>\r\n                </button>\r\n\r\n                <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toForward(true, $event)">\r\n                    <span class="glyphicon glyphicon-chevron-right"></span>\r\n                </button>\r\n\r\n             <span ng-if="!$ctrl.asg.isSingle && false" class="dropdown">\r\n                    <button class="btn btn-default btn-sm dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                        <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu pull-right">\r\n                        <li class="dropdown-submenu">\r\n                            <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" ng-click="$ctrl.setTransition(transition, $event)" ng-repeat="transition in $ctrl.asg.transitions">\r\n                                    <span ng-class="{\'highlight\' : transition == $ctrl.config.transition}">\r\n                                        {{ transition }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" ng-click="$ctrl.setTheme(theme, $event)" ng-repeat="theme in $ctrl.themes">\r\n                                    <span ng-class="{\'highlight\' : theme == $ctrl.asg.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                        <li><a href="#" tabindex="-1" ng-click="$ctrl.toggleHelp($event)">Help</a></li>\r\n                    </ul>\r\n                </span>\r\n\r\n\r\n                <button class="btn btn-default btn-sm" ng-click="$ctrl.toggleMenu($event)">\r\n                    <span ng-if="$ctrl.config.menu" class="glyphicon glyphicon-chevron-up"></span>\r\n                    <span ng-if="!$ctrl.config.menu" class="glyphicon glyphicon-chevron-down"></span>\r\n                </button>\r\n\r\n\t\t\t \t<button class="btn btn-default btn-sm btn-size" ng-click="$ctrl.toggleSize($event)">\r\n                    {{ $ctrl.config.size }}\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm hidden-xs btn-transitions" data-ng-if="!$ctrl.asg.isSingle" data-ng-click="$ctrl.nextTransition($event)">\r\n                    {{ $ctrl.config.transition }}\r\n                </button>\r\n\r\n\t\t\t\t<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toggleThumbnails($event)">\r\n\t\t\t\t   <span class="glyphicon glyphicon-option-horizontal"></span>\r\n\t\t\t    </button>\r\n\r\n                <button class="btn btn-default btn-sm" ng-click="$ctrl.toggleFullScreen($event)">\r\n                    <span class="glyphicon glyphicon-fullscreen"></span>\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleHelp($event)">\r\n                    <span class="glyphicon glyphicon-question-sign"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" ng-click="$ctrl.close($event)">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n\r\n            </span>\r\n\r\n\t\t\t<span ng-if="$ctrl.config.title">\r\n\t\t\t\t<span class="title">{{ $ctrl.config.title }}</span>\r\n\t\t\t\t<span class="subtitle hidden-xs" ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span>\r\n\t\t\t</span>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div class="help text-right" ng-click="$ctrl.toggleHelp($event)" ng-show="$ctrl.config.help" ng-include src="\'help.html\'"></div>\r\n\r\n\t\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}" ng-style="{\'top\': $ctrl.marginTop + \'px\', \'bottom\': $ctrl.marginBottom + \'px\'}" ng-mouseover="$ctrl.asg.over.modalImage = true;" ng-mouseleave="$ctrl.asg.over.modalImage = false;">\r\n\r\n\t\t\t<div class="arrows" ng-if="$ctrl.config.arrows" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.close($event)">\r\n\r\n\t\t\t\t<div ng-if="!$ctrl.asg.isSingle" class="toBackward">\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<div ng-if="!$ctrl.asg.isSingle" class="toForward">\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t</div>\r\n\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class="img" ng-repeat="(key,file) in $ctrl.asg.files" ng-show="$ctrl.asg.selected == key" ng-class="{\'loading\' : !file.loaded.modal}">\r\n\r\n\t\t\t\t<div class="source {{ $ctrl.config.size }}" ng-style="{\'background-image\': \'url(\' + file.source.modal + \')\'}" ng-if="file.loaded.modal"></div>\r\n\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class="caption {{ $ctrl.config.caption.position }}" ng-class="{\'visible\' : $ctrl.config.caption.visible}">\r\n\t\t\t\t<div class="content">\r\n\t\t\t\t\t<span class="title">{{ $ctrl.asg.file.title }}</span>\r\n\t\t\t\t\t<span ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description"> - </span>\r\n\t\t\t\t\t<span class="description">{{ $ctrl.asg.file.description }}</span>\r\n\t\t\t\t\t<a href="{{ $ctrl.asg.downloadLink() }}" target="_blank" class="btn btn-default btn-xs">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-download"></span> Download\r\n\t\t\t\t\t</a>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\r\n\t\t</div>\r\n\r\n\t\t<ng-transclude></ng-transclude>\r\n\r\n\t</div>\r\n\r\n</div>');
$templateCache.put('views/asg-panel.html','<div class="items">\r\n\t<div class="item {{ $ctrl.asg.options.panel.item.class }}" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files" ng-class="{\'selected\' : $ctrl.asg.selected == key}">\r\n\r\n\t\t<img ng-src="{{ file.source.panel }}" ng-click="$ctrl.setSelected(key, $event)" alt="{{ file.title }}">\r\n\r\n\t\t<span class="index" ng-if="$ctrl.config.item.index">{{ key + 1 }}</span>\r\n\r\n\t\t<div class="caption" ng-if="$ctrl.config.item.caption">\r\n\t\t\t<span>{{ file.title }}</span>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n');
$templateCache.put('views/asg-thumbnail.html','<div class="items">\r\n\t<div class="item" ng-click="$ctrl.setSelected(key, $event)" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files" ng-class="{\'selected\' : $ctrl.asg.selected == key}">\r\n\r\n\t\t<img ng-src="{{ file.source.panel }}" ng-style="{\'height\': $ctrl.config.height + \'px\'}" alt="{{ file.title }}">\r\n\r\n\t\t<span class="index" ng-if="$ctrl.config.index">{{ key + 1 }}</span>\r\n\r\n\t</div>\r\n</div>\r\n');}]);