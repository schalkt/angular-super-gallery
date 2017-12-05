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
        template: '<div class="asg-control {{ $ctrl.asg.classes }}"><div ng-include="$ctrl.template"></div></div>',
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
        Object.defineProperty(ImageController.prototype, "modalAvailable", {
            get: function () {
                return this.asg.modalAvailable && this.config.click.modal;
            },
            enumerable: true,
            configurable: true
        });
        ImageController.prototype.modalOpen = function ($event) {
            if ($event) {
                $event.stopPropagation();
            }
            if (this.config.click.modal) {
                this.asg.modalOpen(this.asg.selected);
            }
        };
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
        template: '<div class="asg-info {{ $ctrl.asg.classes }}"><div ng-include="$ctrl.template"></div></div>',
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
        ModalController.prototype.imageClick = function ($event) {
            this.asg.modalClick($event);
            if (this.config.click.close) {
                this.asg.modalClose();
                this.$window.screenfull.exit();
            }
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
        template: '<div class="asg-panel {{ $ctrl.asg.classes }}" ng-mouseover="$ctrl.asg.over.panel = true;" ng-mouseleave="$ctrl.asg.over.panel = false;" ng-show="$ctrl.config.visible"><div ng-include="$ctrl.template"></div><ng-transclude></ng-transclude></div>',
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
                    click: {
                        close: true
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
                    click: {
                        modal: true
                    },
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
        Object.defineProperty(ServiceController.prototype, "classes", {
            get: function () {
                return this.options.theme + ' ' + this.id;
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
        Object.defineProperty(ThumbnailController.prototype, "dynamic", {
            get: function () {
                return this.config.dynamic ? 'dynamic' : '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ThumbnailController.prototype, "classes", {
            get: function () {
                return this.asg.classes + ' ' + this.dynamic;
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
        template: '<div class="asg-thumbnail {{ $ctrl.classes }}" ng-click="$ctrl.asg.modalClick($event);"><div ng-include="$ctrl.template"></div></div>',
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzZy50cyIsImFzZy1jb250cm9sLnRzIiwiYXNnLWltYWdlLnRzIiwiYXNnLWluZm8udHMiLCJhc2ctbW9kYWwudHMiLCJhc2ctcGFuZWwudHMiLCJhc2ctc2VydmljZS50cyIsImFzZy10aHVtYm5haWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBVSxtQkFBbUIsQ0EyQjVCO0FBM0JELFdBQVUsbUJBQW1CO0lBRTVCLElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFdkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDdEIsTUFBTSxDQUFDLFVBQVUsS0FBVyxFQUFFLFNBQWtCO1lBRS9DLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDWCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDWixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsU0FBUyxHQUFHLENBQUMsQ0FBQztZQUNmLENBQUM7WUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5RixDQUFDLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUVKLENBQUMsRUEzQlMsbUJBQW1CLEtBQW5CLG1CQUFtQixRQTJCNUI7O0FDN0JELElBQVUsbUJBQW1CLENBaUY1QjtBQWpGRCxXQUFVLG1CQUFtQjtJQUU1QjtRQU9DLDJCQUFvQixPQUE0QixFQUNyQyxNQUFrQjtZQURULFlBQU8sR0FBUCxPQUFPLENBQXFCO1lBQ3JDLFdBQU0sR0FBTixNQUFNLENBQVk7WUFMckIsU0FBSSxHQUFHLFNBQVMsQ0FBQztZQUVqQixhQUFRLEdBQUcsd0JBQXdCLENBQUM7UUFLNUMsQ0FBQztRQUVNLG1DQUFPLEdBQWQ7WUFBQSxpQkFhQztZQVZBLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUc7Z0JBQ3JCLEtBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQztZQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHO2dCQUN0QixLQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUM7UUFFSCxDQUFDO1FBSUQsc0JBQVcscUNBQU07aUJBQWpCO2dCQUVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFcEMsQ0FBQztpQkFHRCxVQUFrQixLQUFxQjtnQkFFdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUVyQyxDQUFDOzs7V0FQQTtRQVVELHNCQUFXLHVDQUFRO2lCQVduQjtnQkFFQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQztnQkFDUixDQUFDO2dCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztZQUUxQixDQUFDO2lCQW5CRCxVQUFvQixDQUFVO2dCQUU3QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQztnQkFDUixDQUFDO2dCQUVELElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUV2QixDQUFDOzs7V0FBQTtRQWNGLHdCQUFDO0lBQUQsQ0FqRUEsQUFpRUMsSUFBQTtJQWpFWSxxQ0FBaUIsb0JBaUU3QixDQUFBO0lBRUQsSUFBSSxHQUFHLEdBQWdCLE9BQU8sQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUU3RCxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRTtRQUMzQixVQUFVLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixDQUFDLGlCQUFpQixDQUFDO1FBQzNFLFFBQVEsRUFBRSxnR0FBZ0c7UUFDMUcsUUFBUSxFQUFFO1lBQ1QsRUFBRSxFQUFFLElBQUk7WUFDUixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFBRSxJQUFJO1NBQ2Q7S0FDRCxDQUFDLENBQUM7QUFFSixDQUFDLEVBakZTLG1CQUFtQixLQUFuQixtQkFBbUIsUUFpRjVCOztBQ2pGRCxJQUFVLG1CQUFtQixDQWtLNUI7QUFsS0QsV0FBVSxtQkFBbUI7SUFFNUI7UUFVQyx5QkFBb0IsT0FBNEIsRUFDckMsVUFBaUMsRUFDakMsUUFBaUMsRUFDakMsT0FBMkIsRUFDM0IsTUFBa0I7WUFKN0IsaUJBVUM7WUFWbUIsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7WUFDckMsZUFBVSxHQUFWLFVBQVUsQ0FBdUI7WUFDakMsYUFBUSxHQUFSLFFBQVEsQ0FBeUI7WUFDakMsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7WUFDM0IsV0FBTSxHQUFOLE1BQU0sQ0FBWTtZQVByQixTQUFJLEdBQUcsT0FBTyxDQUFDO1lBU3RCLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLEtBQUs7Z0JBQzdDLEtBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztRQUVKLENBQUM7UUFFTyxrQ0FBUSxHQUFoQjtZQUVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixDQUFDO1FBRUYsQ0FBQztRQUVNLGlDQUFPLEdBQWQ7WUFBQSxpQkFnQkM7WUFiQSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRzFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLFVBQUMsS0FBSyxFQUFFLElBQUk7Z0JBRXRFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3BFLEtBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQixDQUFDO2dCQUVELEtBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRTlCLENBQUMsQ0FBQyxDQUFDO1FBRUosQ0FBQztRQUdPLG1DQUFTLEdBQWpCLFVBQWtCLEdBQUc7WUFFcEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO1lBQ3pELElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRXBDLENBQUM7UUFHRCxzQkFBVyxtQ0FBTTtpQkFBakI7Z0JBRUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBRTNCLENBQUM7OztXQUFBO1FBSUQsc0JBQVcsbUNBQU07aUJBQWpCO2dCQUVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFcEMsQ0FBQztpQkFHRCxVQUFrQixLQUFxQjtnQkFFdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUVyQyxDQUFDOzs7V0FQQTtRQVNNLG9DQUFVLEdBQWpCLFVBQWtCLElBQWUsRUFBRSxNQUFpQjtZQUVuRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNaLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUMxQixDQUFDO1lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFM0IsQ0FBQztRQUVNLG1DQUFTLEdBQWhCLFVBQWlCLElBQWUsRUFBRSxNQUFpQjtZQUVsRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNaLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUMxQixDQUFDO1lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUIsQ0FBQztRQUdELHNCQUFXLHFDQUFRO2lCQVduQjtnQkFFQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQztnQkFDUixDQUFDO2dCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztZQUUxQixDQUFDO2lCQW5CRCxVQUFvQixDQUFVO2dCQUU3QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQztnQkFDUixDQUFDO2dCQUVELElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUV2QixDQUFDOzs7V0FBQTtRQWNELHNCQUFXLDJDQUFjO2lCQUF6QjtnQkFFQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBRTNELENBQUM7OztXQUFBO1FBR00sbUNBQVMsR0FBaEIsVUFBaUIsTUFBZ0I7WUFFaEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDMUIsQ0FBQztZQUdELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkMsQ0FBQztRQUVGLENBQUM7UUFFRixzQkFBQztJQUFELENBOUlBLEFBOElDLElBQUE7SUE5SVksbUNBQWUsa0JBOEkzQixDQUFBO0lBRUQsSUFBSSxHQUFHLEdBQWdCLE9BQU8sQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUU3RCxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRTtRQUN6QixVQUFVLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixDQUFDLGVBQWUsQ0FBQztRQUM5RyxXQUFXLEVBQUUsc0JBQXNCO1FBQ25DLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFFBQVEsRUFBRTtZQUNULEVBQUUsRUFBRSxJQUFJO1lBQ1IsS0FBSyxFQUFFLElBQUk7WUFDWCxPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFLElBQUk7U0FDYjtLQUNELENBQUMsQ0FBQztBQUdKLENBQUMsRUFsS1MsbUJBQW1CLEtBQW5CLG1CQUFtQixRQWtLNUI7O0FDbEtELElBQVUsbUJBQW1CLENBdUM1QjtBQXZDRCxXQUFVLG1CQUFtQjtJQUU1QjtRQU9DLHdCQUFvQixPQUE0QixFQUNyQyxNQUFrQjtZQURULFlBQU8sR0FBUCxPQUFPLENBQXFCO1lBQ3JDLFdBQU0sR0FBTixNQUFNLENBQVk7WUFMckIsU0FBSSxHQUFHLE1BQU0sQ0FBQztZQUVkLGFBQVEsR0FBRyxxQkFBcUIsQ0FBQztRQUt6QyxDQUFDO1FBRU0sZ0NBQU8sR0FBZDtZQUdDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFM0MsQ0FBQztRQUVELHNCQUFXLGdDQUFJO2lCQUFmO2dCQUNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztZQUN0QixDQUFDOzs7V0FBQTtRQUVGLHFCQUFDO0lBQUQsQ0F2QkEsQUF1QkMsSUFBQTtJQXZCWSxrQ0FBYyxpQkF1QjFCLENBQUE7SUFFRCxJQUFJLEdBQUcsR0FBZ0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRTdELEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO1FBQ3hCLFVBQVUsRUFBRSxDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsbUJBQW1CLENBQUMsY0FBYyxDQUFDO1FBQ3hFLFFBQVEsRUFBRSw2RkFBNkY7UUFDdkcsVUFBVSxFQUFFLElBQUk7UUFDaEIsUUFBUSxFQUFFO1lBQ1QsRUFBRSxFQUFFLElBQUk7WUFDUixRQUFRLEVBQUUsSUFBSTtTQUNkO0tBQ0QsQ0FBQyxDQUFDO0FBRUosQ0FBQyxFQXZDUyxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBdUM1Qjs7QUN2Q0QsSUFBVSxtQkFBbUIsQ0FnWDVCO0FBaFhELFdBQVUsbUJBQW1CO0lBRTVCO1FBV0MseUJBQW9CLE9BQTRCLEVBQ3JDLE9BQTJCLEVBQzNCLE1BQWtCO1lBRlQsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7WUFDckMsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7WUFDM0IsV0FBTSxHQUFOLE1BQU0sQ0FBWTtZQU5yQixTQUFJLEdBQUcsT0FBTyxDQUFDO1lBRWYsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFNOUIsQ0FBQztRQUdNLGlDQUFPLEdBQWQ7WUFHQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUVoQyxDQUFDO1FBR08sa0NBQVEsR0FBaEI7WUFFQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBRWpCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3hCLENBQUM7WUFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXJDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTFCLENBQUM7UUFHTyw0Q0FBa0IsR0FBMUIsVUFBMkIsT0FBZ0I7WUFFMUMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdDLElBQUksTUFBTSxDQUFDO1lBRVgsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFFdEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBRTVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDWixRQUFRLENBQUM7Z0JBQ1YsQ0FBQztnQkFFRCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUVuQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoQixNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNuQixLQUFLLENBQUM7Z0JBQ1AsQ0FBQztZQUVGLENBQUM7WUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRWYsQ0FBQztRQUdNLCtCQUFLLEdBQVosVUFBYSxNQUFpQjtZQUU3QixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRWhDLENBQUM7UUFFTSxvQ0FBVSxHQUFqQixVQUFrQixNQUFpQjtZQUVsQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUU1QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQyxDQUFDO1FBRUYsQ0FBQztRQUVNLGtDQUFRLEdBQWYsVUFBZ0IsTUFBaUI7WUFFaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0IsQ0FBQztRQUVNLHdDQUFjLEdBQXJCLFVBQXNCLE1BQWlCO1lBRXRDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFM0IsQ0FBQztRQUVNLGlDQUFPLEdBQWQsVUFBZSxJQUFlLEVBQUUsTUFBaUI7WUFFaEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVwQixDQUFDO1FBRU0sb0NBQVUsR0FBakIsVUFBa0IsSUFBZSxFQUFFLE1BQWlCO1lBRW5ELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTNCLENBQUM7UUFFTSxtQ0FBUyxHQUFoQixVQUFpQixJQUFlLEVBQUUsTUFBaUI7WUFFbEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUIsQ0FBQztRQUVNLGdDQUFNLEdBQWIsVUFBYyxJQUFlLEVBQUUsTUFBaUI7WUFFL0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkIsQ0FBQztRQUdNLCtCQUFLLEdBQVosVUFBYSxDQUFpQjtZQUU3QixJQUFJLE1BQU0sR0FBWSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXpELE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBRWhCLEtBQUssTUFBTTtvQkFDVixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2IsS0FBSyxDQUFDO2dCQUVQLEtBQUssV0FBVztvQkFDZixJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUMxQixLQUFLLENBQUM7Z0JBRVAsS0FBSyxTQUFTO29CQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN6QixLQUFLLENBQUM7Z0JBRVAsS0FBSyxVQUFVO29CQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMxQixLQUFLLENBQUM7Z0JBRVAsS0FBSyxPQUFPO29CQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN2QixLQUFLLENBQUM7Z0JBRVAsS0FBSyxNQUFNO29CQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN0QixLQUFLLENBQUM7Z0JBRVAsS0FBSyxZQUFZO29CQUNoQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztvQkFDeEIsS0FBSyxDQUFDO2dCQUVQLEtBQUssTUFBTTtvQkFDVixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQ2xCLEtBQUssQ0FBQztnQkFFUCxLQUFLLFNBQVM7b0JBQ2IsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUNyQixLQUFLLENBQUM7Z0JBRVAsS0FBSyxNQUFNO29CQUNWLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDbEIsS0FBSyxDQUFDO2dCQUVQLEtBQUssTUFBTTtvQkFDVixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQ2xCLEtBQUssQ0FBQztnQkFFUCxLQUFLLFlBQVk7b0JBQ2hCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDdEIsS0FBSyxDQUFDO2dCQUVQO29CQUNDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDdEQsS0FBSyxDQUFDO1lBRVIsQ0FBQztRQUVGLENBQUM7UUFJTyx3Q0FBYyxHQUF0QixVQUF1QixNQUFpQjtZQUV2QyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkUsSUFBSSxJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckQsQ0FBQztRQUlPLDBDQUFnQixHQUF4QixVQUF5QixNQUFpQjtZQUV6QyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVsQyxDQUFDO1FBR08sMENBQWdCLEdBQXhCLFVBQXlCLE1BQWlCO1lBRXpDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUVoRSxDQUFDO1FBR00sdUNBQWEsR0FBcEIsVUFBcUIsVUFBVSxFQUFFLE1BQWlCO1lBRWpELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUVyQyxDQUFDO1FBR00sa0NBQVEsR0FBZixVQUFnQixLQUFjLEVBQUUsTUFBaUI7WUFFaEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVoQyxDQUFDO1FBR08sb0NBQVUsR0FBbEIsVUFBbUIsTUFBaUI7WUFFbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUV0QyxDQUFDO1FBR08sb0NBQVUsR0FBbEIsVUFBbUIsTUFBaUI7WUFFbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckQsS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQztZQUMzRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFL0QsQ0FBQztRQUdPLG9DQUFVLEdBQWxCLFVBQW1CLE1BQWlCO1lBRW5DLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFFdEMsQ0FBQztRQUdPLHVDQUFhLEdBQXJCO1lBRUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBRTVELENBQUM7UUFHRCxzQkFBVyxzQ0FBUztpQkFBcEI7Z0JBRUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBRTlCLENBQUM7OztXQUFBO1FBR0Qsc0JBQVcseUNBQVk7aUJBQXZCO2dCQUVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztZQUVqQyxDQUFDOzs7V0FBQTtRQUdELHNCQUFXLG9DQUFPO2lCQUFsQjtnQkFFQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQztnQkFDUixDQUFDO2dCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztZQUU5QixDQUFDO2lCQUdELFVBQW1CLEtBQWU7Z0JBRWpDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDO2dCQUNSLENBQUM7Z0JBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRXBCLENBQUM7OztXQVpBO1FBZUQsc0JBQVcscUNBQVE7aUJBV25CO2dCQUVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDO2dCQUNSLENBQUM7Z0JBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBRTFCLENBQUM7aUJBbkJELFVBQW9CLENBQVU7Z0JBRTdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDO2dCQUNSLENBQUM7Z0JBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBRXZCLENBQUM7OztXQUFBO1FBY0Qsc0JBQVcsbUNBQU07aUJBQWpCO2dCQUVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFcEMsQ0FBQztpQkFHRCxVQUFrQixLQUFxQjtnQkFFdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUVyQyxDQUFDOzs7V0FQQTtRQVNGLHNCQUFDO0lBQUQsQ0EzVkEsQUEyVkMsSUFBQTtJQTNWWSxtQ0FBZSxrQkEyVjNCLENBQUE7SUFHRCxJQUFJLEdBQUcsR0FBZ0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRTdELEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFO1FBQ3pCLFVBQVUsRUFBRSxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixDQUFDLGVBQWUsQ0FBQztRQUNwRixXQUFXLEVBQUUsc0JBQXNCO1FBQ25DLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFFBQVEsRUFBRTtZQUNULEVBQUUsRUFBRSxJQUFJO1lBQ1IsS0FBSyxFQUFFLElBQUk7WUFDWCxPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFLElBQUk7WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNiO0tBQ0QsQ0FBQyxDQUFDO0FBRUosQ0FBQyxFQWhYUyxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBZ1g1Qjs7QUNoWEQsSUFBVSxtQkFBbUIsQ0EwRzVCO0FBMUdELFdBQVUsbUJBQW1CO0lBRTVCO1FBV0MseUJBQW9CLE9BQTRCLEVBQ3JDLE1BQWtCO1lBRFQsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7WUFDckMsV0FBTSxHQUFOLE1BQU0sQ0FBWTtZQUxyQixTQUFJLEdBQUcsT0FBTyxDQUFDO1lBQ2YsYUFBUSxHQUFHLHNCQUFzQixDQUFDO1FBTTFDLENBQUM7UUFFTSxpQ0FBTyxHQUFkO1lBR0MsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUzQyxDQUFDO1FBR00scUNBQVcsR0FBbEIsVUFBbUIsS0FBYyxFQUFFLE1BQW9CO1lBRXRELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxQixNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0IsQ0FBQztRQUVGLENBQUM7UUFFTSwrQkFBSyxHQUFaLFVBQWEsS0FBYyxFQUFFLE1BQW9CO1lBRWhELElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QixDQUFDO1FBRUYsQ0FBQztRQUdELHNCQUFXLG1DQUFNO2lCQUFqQjtnQkFFQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXBDLENBQUM7aUJBR0QsVUFBa0IsS0FBcUI7Z0JBRXRDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7WUFFckMsQ0FBQzs7O1dBUEE7UUFVRCxzQkFBVyxxQ0FBUTtpQkFXbkI7Z0JBRUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDZixNQUFNLENBQUM7Z0JBQ1IsQ0FBQztnQkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7WUFFMUIsQ0FBQztpQkFuQkQsVUFBb0IsQ0FBVTtnQkFFN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDZixNQUFNLENBQUM7Z0JBQ1IsQ0FBQztnQkFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFFdkIsQ0FBQzs7O1dBQUE7UUFhRixzQkFBQztJQUFELENBckZBLEFBcUZDLElBQUE7SUFyRlksbUNBQWUsa0JBcUYzQixDQUFBO0lBRUQsSUFBSSxHQUFHLEdBQWdCLE9BQU8sQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUU3RCxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRTtRQUN6QixVQUFVLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixDQUFDLGVBQWUsQ0FBQztRQUN6RSxRQUFRLEVBQUUsc1BBQXNQO1FBQ2hRLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFFBQVEsRUFBRTtZQUNULEVBQUUsRUFBRSxHQUFHO1lBQ1AsS0FBSyxFQUFFLElBQUk7WUFDWCxPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFLElBQUk7WUFDYixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxJQUFJO1NBQ2I7S0FDRCxDQUFDLENBQUM7QUFFSixDQUFDLEVBMUdTLG1CQUFtQixLQUFuQixtQkFBbUIsUUEwRzVCOztBQ3hHRCxJQUFVLG1CQUFtQixDQWlxQzVCO0FBanFDRCxXQUFVLG1CQUFtQjtJQStPNUI7UUFxS0MsMkJBQW9CLE9BQTRCLEVBQ3JDLFFBQThCLEVBQzlCLFFBQThCLEVBQzlCLFVBQWlDLEVBQ2pDLE9BQTJCO1lBSnRDLGlCQVVDO1lBVm1CLFlBQU8sR0FBUCxPQUFPLENBQXFCO1lBQ3JDLGFBQVEsR0FBUixRQUFRLENBQXNCO1lBQzlCLGFBQVEsR0FBUixRQUFRLENBQXNCO1lBQzlCLGVBQVUsR0FBVixVQUFVLENBQXVCO1lBQ2pDLFlBQU8sR0FBUCxPQUFPLENBQW9CO1lBdksvQixTQUFJLEdBQUcsS0FBSyxDQUFDO1lBR2IsVUFBSyxHQUFrQixFQUFFLENBQUM7WUFFMUIsbUJBQWMsR0FBRyxLQUFLLENBQUM7WUFFdEIsY0FBUyxHQUFRLEVBQUUsQ0FBQztZQUVwQixhQUFRLEdBQUcsS0FBSyxDQUFDO1lBRWpCLFVBQUssR0FBRyxLQUFLLENBQUM7WUFFZixZQUFPLEdBQWMsSUFBSSxDQUFDO1lBQzFCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLGFBQVEsR0FBYztnQkFDNUIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsTUFBTSxFQUFFO29CQUNQLE1BQU0sRUFBRTt3QkFDUCxLQUFLLEVBQUUsS0FBSzt3QkFDWixLQUFLLEVBQUUsS0FBSzt3QkFDWixLQUFLLEVBQUUsS0FBSztxQkFDWjtvQkFDRCxLQUFLLEVBQUUsT0FBTztvQkFDZCxXQUFXLEVBQUUsYUFBYTtpQkFDMUI7Z0JBQ0QsUUFBUSxFQUFFO29CQUNULE9BQU8sRUFBRSxLQUFLO29CQUNkLEtBQUssRUFBRSxJQUFJO2lCQUNYO2dCQUNELEtBQUssRUFBRSxTQUFTO2dCQUNoQixZQUFZLEVBQUUsR0FBRztnQkFDakIsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsS0FBSyxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFO29CQUNULFFBQVEsRUFBRSxFQUFFO29CQUNaLE9BQU8sRUFBRTt3QkFDUixPQUFPLEVBQUUsSUFBSTt3QkFDYixRQUFRLEVBQUUsS0FBSztxQkFDZjtvQkFDRCxJQUFJLEVBQUUsSUFBSTtvQkFDVixJQUFJLEVBQUUsS0FBSztvQkFDWCxNQUFNLEVBQUUsSUFBSTtvQkFDWixLQUFLLEVBQUU7d0JBQ04sS0FBSyxFQUFFLElBQUk7cUJBQ1g7b0JBQ0QsU0FBUyxFQUFFO3dCQUNWLE1BQU0sRUFBRSxFQUFFO3dCQUNWLEtBQUssRUFBRSxLQUFLO3dCQUNaLE9BQU8sRUFBRSxLQUFLO3dCQUNkLEtBQUssRUFBRTs0QkFDTixNQUFNLEVBQUUsSUFBSTs0QkFDWixLQUFLLEVBQUUsS0FBSzt5QkFDWjt3QkFDRCxLQUFLLEVBQUU7NEJBQ04sTUFBTSxFQUFFLEtBQUs7eUJBQ2I7cUJBQ0Q7b0JBQ0QsVUFBVSxFQUFFLFNBQVM7b0JBQ3JCLElBQUksRUFBRSxPQUFPO29CQUNiLFFBQVEsRUFBRTt3QkFDVCxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7d0JBQ1YsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDO3dCQUNmLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7d0JBQ2pCLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQzt3QkFDZCxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO3dCQUNmLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7d0JBQ2QsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDO3dCQUNoQixJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7d0JBQ1YsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO3dCQUNiLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQzt3QkFDVixJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7d0JBQ1YsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDO3FCQUNoQjtpQkFDRDtnQkFDRCxTQUFTLEVBQUU7b0JBQ1YsTUFBTSxFQUFFLEVBQUU7b0JBQ1YsS0FBSyxFQUFFLEtBQUs7b0JBQ1osT0FBTyxFQUFFLEtBQUs7b0JBQ2QsS0FBSyxFQUFFO3dCQUNOLE1BQU0sRUFBRSxJQUFJO3dCQUNaLEtBQUssRUFBRSxLQUFLO3FCQUNaO29CQUNELEtBQUssRUFBRTt3QkFDTixNQUFNLEVBQUUsS0FBSztxQkFDYjtpQkFDRDtnQkFDRCxLQUFLLEVBQUU7b0JBQ04sT0FBTyxFQUFFLElBQUk7b0JBQ2IsSUFBSSxFQUFFO3dCQUNMLEtBQUssRUFBRSxVQUFVO3dCQUNqQixPQUFPLEVBQUUsS0FBSzt3QkFDZCxLQUFLLEVBQUUsS0FBSztxQkFDWjtvQkFDRCxLQUFLLEVBQUU7d0JBQ04sTUFBTSxFQUFFLEtBQUs7cUJBQ2I7b0JBQ0QsS0FBSyxFQUFFO3dCQUNOLE1BQU0sRUFBRSxLQUFLO3dCQUNiLEtBQUssRUFBRSxJQUFJO3FCQUNYO2lCQUNEO2dCQUNELEtBQUssRUFBRTtvQkFDTixVQUFVLEVBQUUsU0FBUztvQkFDckIsSUFBSSxFQUFFLE9BQU87b0JBQ2IsTUFBTSxFQUFFLElBQUk7b0JBQ1osS0FBSyxFQUFFO3dCQUNOLEtBQUssRUFBRSxJQUFJO3FCQUNYO29CQUNELE1BQU0sRUFBRSxJQUFJO29CQUNaLFNBQVMsRUFBRSxJQUFJO29CQUNmLFVBQVUsRUFBRTt3QkFDWCxPQUFPLEVBQUUsSUFBSTt3QkFDYixRQUFRLEVBQUUsS0FBSztxQkFDZjtpQkFDRDthQUNELENBQUM7WUFHSyxVQUFLLEdBQW1CO2dCQUM5QixTQUFTO2dCQUNULE9BQU87Z0JBQ1AsTUFBTTtnQkFDTixTQUFTO2FBQ1QsQ0FBQztZQUdLLFdBQU0sR0FBbUI7Z0JBQy9CLFNBQVM7Z0JBQ1QsVUFBVTtnQkFDVixXQUFXO2FBQ1gsQ0FBQztZQUdLLGdCQUFXLEdBQW1CO2dCQUNwQyxJQUFJO2dCQUNKLFdBQVc7Z0JBQ1gsUUFBUTtnQkFDUixTQUFTO2dCQUNULFdBQVc7Z0JBQ1gsVUFBVTtnQkFDVixVQUFVO2dCQUNWLFVBQVU7Z0JBQ1YsU0FBUztnQkFDVCxTQUFTO2dCQUNULE9BQU87Z0JBQ1AsT0FBTzthQUNQLENBQUM7WUFFSyxXQUFNLEdBQUc7Z0JBQ2YsV0FBVyxFQUFFLGtCQUFrQjtnQkFDL0IsY0FBYyxFQUFFLHFCQUFxQjtnQkFDckMsYUFBYSxFQUFFLG9CQUFvQjtnQkFDbkMsWUFBWSxFQUFFLG1CQUFtQjtnQkFDakMsVUFBVSxFQUFFLGlCQUFpQjtnQkFDN0IsV0FBVyxFQUFFLGtCQUFrQjtnQkFDL0IsWUFBWSxFQUFFLG1CQUFtQjtnQkFDakMsVUFBVSxFQUFFLGlCQUFpQjtnQkFDN0IsV0FBVyxFQUFFLGtCQUFrQjtnQkFDL0IsY0FBYyxFQUFFLHFCQUFxQjthQUNyQyxDQUFDO1lBUUQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsS0FBSztnQkFDN0MsS0FBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQztRQUVKLENBQUM7UUFFTyxxQ0FBUyxHQUFqQjtZQUFBLGlCQXVDQztZQXJDQSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNkLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBRTFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFFWixLQUFLLEVBQUUsQ0FBQztnQkFDUixLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztnQkFDdEIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV2QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFUixDQUFDO1FBR00sd0NBQVksR0FBbkIsVUFBb0IsTUFBWTtZQUUvQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXBDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDL0MsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBRWIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDNUMsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUUxQixDQUFDO1FBR00sdUNBQVcsR0FBbEIsVUFBbUIsU0FBZTtZQUVqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUduQixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDaEksU0FBUyxDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDMUQsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDUCxTQUFTLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNyRCxDQUFDO1lBRUYsQ0FBQztZQUVELElBQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUM7WUFDeEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUdsQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsUUFBUSxHQUFHLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzVHLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztZQUMvQyxDQUFDO1lBRUQsUUFBUSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkMsUUFBUSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEUsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBRXJCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUV0QixRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRTlDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUMxRixRQUFRLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQzFCLENBQUM7WUFFRixDQUFDO1lBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDOUIsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUVqQixDQUFDO1FBR00sb0NBQVEsR0FBZixVQUFnQixLQUFvQjtZQUVuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1osTUFBTSxDQUFDO1lBQ1IsQ0FBQztZQUdELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixNQUFNLENBQUM7WUFDUixDQUFDO1lBR0QsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUV6QyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyxFQUFDLENBQUMsQ0FBQztnQkFDOUMsQ0FBQztZQUVGLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFFUCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUVwQixDQUFDO1lBRUQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXJCLENBQUM7UUFHTSxzQ0FBVSxHQUFqQixVQUFrQixPQUFrQjtZQUduQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxDQUFDO1lBQ1IsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3JELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzNCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDOUIsQ0FBQztZQUdELE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBRXZCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWxELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRXJCLENBQUM7UUFHRCxzQkFBVyx1Q0FBUTtpQkFxQm5CO2dCQUVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBRXZCLENBQUM7aUJBekJELFVBQW9CLENBQVU7Z0JBRTdCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUUxQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUVmLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFFN0IsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO3dCQUNwQyxLQUFLLEVBQUUsQ0FBQzt3QkFDUixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7cUJBQ2YsQ0FBQyxDQUFDO2dCQUVKLENBQUM7WUFFRixDQUFDOzs7V0FBQTtRQVVNLHVDQUFXLEdBQWxCLFVBQW1CLEtBQWM7WUFFaEMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQ2hFLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVoQixDQUFDO1FBSU0sc0NBQVUsR0FBakIsVUFBa0IsSUFBZTtZQUVoQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNWLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNyQixDQUFDO1lBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7WUFDNUIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFaEIsQ0FBQztRQUdNLHFDQUFTLEdBQWhCLFVBQWlCLElBQWU7WUFFL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDVixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDckIsQ0FBQztZQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWhCLENBQUM7UUFHTSxtQ0FBTyxHQUFkLFVBQWUsSUFBZTtZQUU3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNWLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNyQixDQUFDO1lBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7WUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWhCLENBQUM7UUFHTSxrQ0FBTSxHQUFiLFVBQWMsSUFBZTtZQUU1QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNWLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNyQixDQUFDO1lBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWhCLENBQUM7UUFFTSxtQ0FBTyxHQUFkO1lBRUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdkUsQ0FBQztRQUVGLENBQUM7UUFFTSwwQ0FBYyxHQUFyQjtZQUVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNyQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3RCLENBQUM7UUFFRixDQUFDO1FBR00sd0NBQVksR0FBbkI7WUFFQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUVoRixDQUFDO1FBRU0seUNBQWEsR0FBcEI7WUFBQSxpQkFhQztZQVhBLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQzdCLEtBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNsQixDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUVqRixDQUFDO1FBR08sd0NBQVksR0FBcEI7WUFFQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7WUFFbEIsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLElBQWEsRUFBRSxNQUFnQjtnQkFFakUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckIsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDNUMsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDNUMsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDNUMsQ0FBQztZQUVGLENBQUMsQ0FBQztZQUdGLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFVLEtBQUssRUFBRSxHQUFHO2dCQUUvQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUVuQixLQUFLLENBQUMsTUFBTSxHQUFHO3dCQUNkLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzt3QkFDOUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUM5QyxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7cUJBQzlDLENBQUM7Z0JBRUgsQ0FBQztnQkFFRCxJQUFJLE1BQU0sR0FBRztvQkFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUM7b0JBQ3ZFLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQztvQkFDdkUsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDO2lCQUN2RSxDQUFDO2dCQUdGLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFdkMsSUFBSSxLQUFLLEVBQUUsV0FBVyxDQUFDO2dCQUV2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztnQkFDeEYsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDUCxLQUFLLEdBQUcsUUFBUSxDQUFDO2dCQUNsQixDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUN0RyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNQLFdBQVcsR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLENBQUM7Z0JBRUQsSUFBSSxJQUFJLEdBQUc7b0JBQ1YsTUFBTSxFQUFFLE1BQU07b0JBQ2QsS0FBSyxFQUFFLEtBQUs7b0JBQ1osV0FBVyxFQUFFLFdBQVc7b0JBQ3hCLE1BQU0sRUFBRTt3QkFDUCxLQUFLLEVBQUUsS0FBSzt3QkFDWixLQUFLLEVBQUUsS0FBSzt3QkFDWixLQUFLLEVBQUUsS0FBSztxQkFDWjtpQkFDRCxDQUFDO2dCQUVGLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXZCLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbEQsQ0FBQztRQUdNLHdDQUFZLEdBQW5CLFVBQW9CLEtBQWM7WUFDakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBSU8sbUNBQU8sR0FBZixVQUFnQixJQUFjO1lBQTlCLGlCQVFDO1lBTkEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDWixLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFN0QsQ0FBQztRQUVNLHFDQUFTLEdBQWhCLFVBQWlCLEtBQWM7WUFFOUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBRWpDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixNQUFNLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRWQsQ0FBQztRQUdNLHNDQUFVLEdBQWpCLFVBQWtCLE9BQXVCLEVBQUUsSUFBYTtZQUV2RCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsTUFBTSxDQUFDO1lBQ1IsQ0FBQztZQUVELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztZQUVoQixPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBYztnQkFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQztRQUVKLENBQUM7UUFHTSxxQ0FBUyxHQUFoQixVQUFpQixLQUFlLEVBQUUsUUFBYztZQUFoRCxpQkEwQkM7WUF4QkEsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3RDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztnQkFDL0MsTUFBTSxDQUFDO1lBQ1IsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQzNDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7Z0JBQzlCLEtBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7WUFDeEIsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDM0MsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQUs7Z0JBQ3BDLEtBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztRQUVKLENBQUM7UUFHTyx1Q0FBVyxHQUFuQixVQUFvQixLQUFjLEVBQUUsSUFBYztZQUVqRCxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUM3QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUQsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDL0MsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUVqQixDQUFDO1FBR08sd0NBQVksR0FBcEIsVUFBcUIsS0FBYyxFQUFFLElBQWM7WUFFbEQsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDN0IsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFELElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFFbEIsQ0FBQztRQUdPLHFDQUFTLEdBQWpCLFVBQWtCLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSztZQUVuQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBRXRDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzdELElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUM3RCxDQUFDO1lBRUQsSUFBSSxJQUFJLEdBQUcsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBQyxDQUFDO1lBRW5FLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNDLENBQUM7WUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTFDLENBQUM7UUFJRCxzQkFBVyx1Q0FBUTtpQkFBbkI7Z0JBRUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFFN0MsQ0FBQzs7O1dBQUE7UUFJTSx3Q0FBWSxHQUFuQjtZQUVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQy9DLENBQUM7UUFFRixDQUFDO1FBSUQsc0JBQVcsbUNBQUk7aUJBQWY7Z0JBRUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWxDLENBQUM7OztXQUFBO1FBR00sa0NBQU0sR0FBYixVQUFjLE9BQWdCO1lBRTdCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFaEUsQ0FBQztRQUlELHNCQUFXLDJDQUFZO2lCQUF2QjtnQkFFQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUV0QixDQUFDO2lCQW1CRCxVQUF3QixLQUFlO2dCQUV0QyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztnQkFFdEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFFWCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUVyQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUVQLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUV4QyxDQUFDO1lBRUYsQ0FBQzs7O1dBbkNBO1FBSUQsc0JBQVcsb0NBQUs7aUJBQWhCO2dCQUVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUUzQixDQUFDOzs7V0FBQTtRQUdELHNCQUFXLHNDQUFPO2lCQUFsQjtnQkFFQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7WUFFM0MsQ0FBQzs7O1dBQUE7UUF1Qk8scUNBQVMsR0FBakI7WUFBQSxpQkEwQkM7WUF4QkEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBRWhCLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBR1osSUFBSSxPQUFPLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsc0JBQXNCLENBQUM7Z0JBRS9ELEtBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUs7b0JBRWpELEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFFeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN2QyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEMsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDUCxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDckMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ25DLENBQUM7Z0JBRUYsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRWpCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVULENBQUM7UUFHTSxxQ0FBUyxHQUFoQixVQUFpQixLQUFjO1lBRTlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM1RCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUN6QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUMsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTFCLENBQUM7UUFFTSxzQ0FBVSxHQUFqQjtZQUVDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFFN0QsQ0FBQztRQUdNLDBDQUFjLEdBQXJCLFVBQXNCLEtBQWU7WUFBckMsaUJBdURDO1lBckRBLElBQUksSUFBSSxHQUFHO2dCQUVWLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUV0RCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFFNUMsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUU5QixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzt3QkFFM0IsSUFBSSxLQUFLLEdBQVMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkUsSUFBSSxJQUFJLEdBQVMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDakUsSUFBSSxTQUFTLFNBQUEsRUFBRSxLQUFLLFNBQUEsRUFBRSxNQUFNLFNBQUEsQ0FBQzt3QkFFN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFFVixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dDQUMvQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFdBQVcsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztnQ0FDbEQsS0FBSyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztnQ0FDbEYsTUFBTSxHQUFHLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO2dDQUNuQyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0NBQzlCLEtBQUssR0FBRyxNQUFNLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7NEJBQzVGLENBQUM7NEJBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQ1AsU0FBUyxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQ3BDLEtBQUssR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUNyRSxDQUFDOzRCQUVELEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7NEJBRWhDLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUU7Z0NBQ3RDLFNBQVMsRUFBRSxTQUFTO2dDQUNwQixJQUFJLEVBQUUsS0FBSztnQ0FDWCxNQUFNLEVBQUUsTUFBTTtnQ0FDZCxTQUFTLEVBQUUsU0FBUyxDQUFDLFdBQVc7Z0NBQ2hDLEtBQUssRUFBRSxLQUFLLENBQUMsV0FBVzs2QkFDeEIsQ0FBQyxDQUFBO3dCQUVILENBQUM7b0JBRUYsQ0FBQztnQkFFRixDQUFDO1lBQ0YsQ0FBQyxDQUFDO1lBRUYsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDO29CQUNaLElBQUksRUFBRSxDQUFDO2dCQUNSLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNYLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxJQUFJLEVBQUUsQ0FBQztZQUNSLENBQUM7UUFHRixDQUFDO1FBRU0sc0NBQVUsR0FBakIsVUFBa0IsTUFBaUI7WUFFbEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDMUIsQ0FBQztZQUVELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVqQixDQUFDO1FBR00sb0NBQVEsR0FBZjtZQUVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMxRSxDQUFDO1FBRUYsQ0FBQztRQUVPLGlDQUFLLEdBQWIsVUFBYyxLQUFjLEVBQUUsSUFBVztZQUV4QyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXZCLENBQUM7UUFFTSwrQkFBRyxHQUFWLFVBQVcsS0FBYyxFQUFFLElBQVc7WUFFckMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEMsQ0FBQztRQUVGLENBQUM7UUFFTSw4QkFBRSxHQUFULFVBQVUsUUFBUTtZQUVqQixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVsQyxDQUFDO1FBR00sd0NBQVksR0FBbkIsVUFBb0IsSUFBSTtZQUV2QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFDN0QsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ3hCLE1BQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBRXJFLE1BQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUVqRixNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFaEMsQ0FBQztRQUdNLHlDQUFhLEdBQXBCLFVBQXFCLElBQUk7WUFFeEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQzdELE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxFQUMxQixNQUFNLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUVyRSxNQUFNLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFFakYsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRWpDLENBQUM7UUFFRix3QkFBQztJQUFELENBNTZCQSxBQTQ2QkMsSUFBQTtJQTU2QlkscUNBQWlCLG9CQTQ2QjdCLENBQUE7SUFFRCxJQUFJLEdBQUcsR0FBZ0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRTdELEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7QUFFL0csQ0FBQyxFQWpxQ1MsbUJBQW1CLEtBQW5CLG1CQUFtQixRQWlxQzVCOztBQ25xQ0QsSUFBVSxtQkFBbUIsQ0FtSTVCO0FBbklELFdBQVUsbUJBQW1CO0lBRTVCO1FBWUMsNkJBQW9CLE9BQTRCLEVBQ3JDLE1BQWtCLEVBQ2xCLFFBQWlDO1lBRnhCLFlBQU8sR0FBUCxPQUFPLENBQXFCO1lBQ3JDLFdBQU0sR0FBTixNQUFNLENBQVk7WUFDbEIsYUFBUSxHQUFSLFFBQVEsQ0FBeUI7WUFQcEMsU0FBSSxHQUFHLFdBQVcsQ0FBQztZQUNuQixhQUFRLEdBQUcsMEJBQTBCLENBQUM7WUFFdEMsVUFBSyxHQUFHLEtBQUssQ0FBQztRQU10QixDQUFDO1FBRU0scUNBQU8sR0FBZDtZQUdDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFHMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzVHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUMvRSxDQUFDO1FBRUYsQ0FBQztRQUdNLHlDQUFXLEdBQWxCLFVBQW1CLEtBQWMsRUFBRSxNQUFvQjtZQUV0RCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUU1QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDMUIsTUFBTSxDQUFDO1lBQ1IsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdCLENBQUM7UUFFRixDQUFDO1FBR00sbUNBQUssR0FBWixVQUFhLEtBQWMsRUFBRSxNQUFvQjtZQUVoRCxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0IsQ0FBQztRQUVGLENBQUM7UUFHRCxzQkFBVyx1Q0FBTTtpQkFBakI7Z0JBRUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXhGLENBQUM7aUJBR0QsVUFBa0IsS0FBeUI7Z0JBRTFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUNyQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNQLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQzlDLENBQUM7WUFFRixDQUFDOzs7V0FYQTtRQWNELHNCQUFXLHlDQUFRO2lCQVduQjtnQkFFQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQztnQkFDUixDQUFDO2dCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztZQUUxQixDQUFDO2lCQW5CRCxVQUFvQixDQUFVO2dCQUU3QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQztnQkFDUixDQUFDO2dCQUVELElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUV2QixDQUFDOzs7V0FBQTtRQWNELHNCQUFXLHdDQUFPO2lCQUFsQjtnQkFFQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBRTdDLENBQUM7OztXQUFBO1FBR0Qsc0JBQVcsd0NBQU87aUJBQWxCO2dCQUVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUU5QyxDQUFDOzs7V0FBQTtRQUVGLDBCQUFDO0lBQUQsQ0EvR0EsQUErR0MsSUFBQTtJQS9HWSx1Q0FBbUIsc0JBK0cvQixDQUFBO0lBRUQsSUFBSSxHQUFHLEdBQWdCLE9BQU8sQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUU3RCxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRTtRQUM3QixVQUFVLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQztRQUN6RixRQUFRLEVBQUUsdUlBQXVJO1FBQ2pKLFFBQVEsRUFBRTtZQUNULEVBQUUsRUFBRSxHQUFHO1lBQ1AsS0FBSyxFQUFFLElBQUk7WUFDWCxPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFLElBQUk7WUFDYixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxJQUFJO1NBQ2I7S0FDRCxDQUFDLENBQUM7QUFFSixDQUFDLEVBbklTLG1CQUFtQixLQUFuQixtQkFBbUIsUUFtSTVCIiwiZmlsZSI6ImFuZ3VsYXItc3VwZXItZ2FsbGVyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScsIFsnbmdBbmltYXRlJywgJ25nVG91Y2gnXSk7XHJcblxyXG5cdGFwcC5maWx0ZXIoJ2FzZ0J5dGVzJywgKCkgPT4ge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChieXRlcyA6IGFueSwgcHJlY2lzaW9uIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRpZiAoaXNOYU4ocGFyc2VGbG9hdChieXRlcykpIHx8ICFpc0Zpbml0ZShieXRlcykpIHtcclxuXHRcdFx0XHRyZXR1cm4gJyc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChieXRlcyA9PT0gMCkge1xyXG5cdFx0XHRcdHJldHVybiAnMCc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0eXBlb2YgcHJlY2lzaW9uID09PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdHByZWNpc2lvbiA9IDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCB1bml0cyA9IFsnYnl0ZXMnLCAna0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInXSxcclxuXHRcdFx0XHRudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgubG9nKGJ5dGVzKSAvIE1hdGgubG9nKDEwMjQpKTtcclxuXHJcblx0XHRcdHJldHVybiAoYnl0ZXMgLyBNYXRoLnBvdygxMDI0LCBNYXRoLmZsb29yKG51bWJlcikpKS50b0ZpeGVkKHByZWNpc2lvbikgKyAnICcgKyB1bml0c1tudW1iZXJdO1xyXG5cclxuXHRcdH07XHJcblx0fSk7XHJcblxyXG59XHJcblxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBDb250cm9sQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ2NvbnRyb2wnO1xyXG5cdFx0cHJpdmF0ZSBhc2cgOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlID0gJ3ZpZXdzL2FzZy1jb250cm9sLmh0bWwnO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0XHR0aGlzLiRzY29wZS5mb3J3YXJkID0gKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZCh0cnVlKTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHRoaXMuJHNjb3BlLmJhY2t3YXJkID0gKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQodHJ1ZSk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zSW1hZ2UpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0NvbnRyb2wnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5Db250cm9sQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctY29udHJvbCB7eyAkY3RybC5hc2cuY2xhc3NlcyB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgSW1hZ2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmwgOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ2ltYWdlJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHJvb3RTY29wZSA6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkZWxlbWVudCA6IG5nLklSb290RWxlbWVudFNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICR3aW5kb3cgOiBuZy5JV2luZG93U2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCgncmVzaXplJywgKGV2ZW50KSA9PiB7XHJcblx0XHRcdFx0dGhpcy5vblJlc2l6ZSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBvblJlc2l6ZSgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5oZWlnaHRBdXRvLm9ucmVzaXplKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRIZWlnaHQodGhpcy5hc2cuZmlsZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHRcdC8vIHNldCBpbWFnZSBjb21wb25lbnQgaGVpZ2h0XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kb24odGhpcy5hc2cuZXZlbnRzLkZJUlNUX0lNQUdFICsgdGhpcy5pZCwgKGV2ZW50LCBkYXRhKSA9PiB7XHJcblxyXG5cdFx0XHRcdGlmICghdGhpcy5jb25maWcuaGVpZ2h0ICYmIHRoaXMuY29uZmlnLmhlaWdodEF1dG8uaW5pdGlhbCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRIZWlnaHQoZGF0YS5pbWcpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5hc2cudGh1bWJuYWlsc01vdmUoMjAwKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29tcG9uZW50IGhlaWdodFxyXG5cdFx0cHJpdmF0ZSBzZXRIZWlnaHQoaW1nKSB7XHJcblxyXG5cdFx0XHRsZXQgd2lkdGggPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCdkaXYnKVswXS5jbGllbnRXaWR0aDtcclxuXHRcdFx0bGV0IHJhdGlvID0gaW1nLndpZHRoIC8gaW1nLmhlaWdodDtcclxuXHRcdFx0dGhpcy5jb25maWcuaGVpZ2h0ID0gd2lkdGggLyByYXRpbztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaGVpZ2h0XHJcblx0XHRwdWJsaWMgZ2V0IGhlaWdodCgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5oZWlnaHQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zSW1hZ2UpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9CYWNrd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHRpZiAoJGV2ZW50KSB7XHJcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHN0b3ApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICgkZXZlbnQpIHtcclxuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBtb2RhbCBhdmFpbGFibGVcclxuXHRcdHB1YmxpYyBnZXQgbW9kYWxBdmFpbGFibGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cubW9kYWxBdmFpbGFibGUgJiYgdGhpcy5jb25maWcuY2xpY2subW9kYWw7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG9wZW4gdGhlIG1vZGFsXHJcblx0XHRwdWJsaWMgbW9kYWxPcGVuKCRldmVudCA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICgkZXZlbnQpIHtcclxuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2subW9kYWwpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbE9wZW4odGhpcy5hc2cuc2VsZWN0ZWQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnSW1hZ2UnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHJvb3RTY29wZScsICckZWxlbWVudCcsICckd2luZG93JywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuSW1hZ2VDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLWltYWdlLmh0bWwnLFxyXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdGJhc2VVcmw6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIEluZm9Db250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIHR5cGUgPSAnaW5mbyc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgdGVtcGxhdGUgPSAndmlld3MvYXNnLWluZm8uaHRtbCc7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkc2NvcGUgOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGdldCBmaWxlKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuZmlsZTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0luZm8nLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5JbmZvQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctaW5mbyB7eyAkY3RybC5hc2cuY2xhc3NlcyB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgTW9kYWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmwgOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ21vZGFsJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSBhcnJvd3NWaXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkd2luZG93IDogbmcuSVdpbmRvd1NlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICRzY29wZSA6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHRcdFx0dGhpcy5hc2cubW9kYWxBdmFpbGFibGUgPSB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHJpdmF0ZSBnZXRDbGFzcygpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5jb25maWcpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBuZ0NsYXNzID0gW107XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuY29uZmlnLm1lbnUpIHtcclxuXHRcdFx0XHRuZ0NsYXNzLnB1c2goJ25vbWVudScpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRuZ0NsYXNzLnB1c2godGhpcy5hc2cub3B0aW9ucy50aGVtZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gbmdDbGFzcy5qb2luKCcgJyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBhY3Rpb24gZnJvbSBrZXljb2Rlc1xyXG5cdFx0cHJpdmF0ZSBnZXRBY3Rpb25CeUtleUNvZGUoa2V5Q29kZSA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0bGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5rZXljb2Rlcyk7XHJcblx0XHRcdGxldCBhY3Rpb247XHJcblxyXG5cdFx0XHRmb3IgKGxldCBrZXkgaW4ga2V5cykge1xyXG5cclxuXHRcdFx0XHRsZXQgY29kZXMgPSB0aGlzLmNvbmZpZy5rZXljb2Rlc1trZXlzW2tleV1dO1xyXG5cclxuXHRcdFx0XHRpZiAoIWNvZGVzKSB7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBpbmRleCA9IGNvZGVzLmluZGV4T2Yoa2V5Q29kZSk7XHJcblxyXG5cdFx0XHRcdGlmIChpbmRleCA+IC0xKSB7XHJcblx0XHRcdFx0XHRhY3Rpb24gPSBrZXlzW2tleV07XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gYWN0aW9uO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGNsb3NlKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xvc2UoKTtcclxuXHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwuZXhpdCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgaW1hZ2VDbGljaygkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLmNsb3NlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxDbG9zZSgpO1xyXG5cdFx0XHRcdHRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsLmV4aXQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc2V0Rm9jdXMoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5VG9nZ2xlKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLmF1dG9QbGF5VG9nZ2xlKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0ZpcnN0KHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cudG9GaXJzdCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9CYWNrd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0ZvcndhcmQoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0xhc3Qoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy50b0xhc3Qoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGRvIGtleWJvYXJkIGFjdGlvblxyXG5cdFx0cHVibGljIGtleVVwKGUgOiBLZXlib2FyZEV2ZW50KSB7XHJcblxyXG5cdFx0XHRsZXQgYWN0aW9uIDogc3RyaW5nID0gdGhpcy5nZXRBY3Rpb25CeUtleUNvZGUoZS5rZXlDb2RlKTtcclxuXHJcblx0XHRcdHN3aXRjaCAoYWN0aW9uKSB7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2V4aXQnOlxyXG5cdFx0XHRcdFx0dGhpcy5jbG9zZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3BsYXlwYXVzZSc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy5hdXRvUGxheVRvZ2dsZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2ZvcndhcmQnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2JhY2t3YXJkJzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnZmlyc3QnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9GaXJzdCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdsYXN0JzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvTGFzdCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdmdWxsc2NyZWVuJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlRnVsbFNjcmVlbigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ21lbnUnOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNZW51KCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnY2FwdGlvbic6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUNhcHRpb24oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdoZWxwJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlSGVscCgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3NpemUnOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVTaXplKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAndHJhbnNpdGlvbic6XHJcblx0XHRcdFx0XHR0aGlzLm5leHRUcmFuc2l0aW9uKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLmxvZygndW5rbm93biBrZXlib2FyZCBhY3Rpb246ICcgKyBlLmtleUNvZGUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBzd2l0Y2ggdG8gbmV4dCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHJpdmF0ZSBuZXh0VHJhbnNpdGlvbigkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHRsZXQgaWR4ID0gdGhpcy5hc2cudHJhbnNpdGlvbnMuaW5kZXhPZih0aGlzLmNvbmZpZy50cmFuc2l0aW9uKSArIDE7XHJcblx0XHRcdGxldCBuZXh0ID0gaWR4ID49IHRoaXMuYXNnLnRyYW5zaXRpb25zLmxlbmd0aCA/IDAgOiBpZHg7XHJcblx0XHRcdHRoaXMuY29uZmlnLnRyYW5zaXRpb24gPSB0aGlzLmFzZy50cmFuc2l0aW9uc1tuZXh0XTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHRvZ2dsZSBmdWxsc2NyZWVuXHJcblx0XHRwcml2YXRlIHRvZ2dsZUZ1bGxTY3JlZW4oJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwudG9nZ2xlKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSB0aHVtYm5haWxzXHJcblx0XHRwcml2YXRlIHRvZ2dsZVRodW1ibmFpbHMoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcudGh1bWJuYWlsLmR5bmFtaWMgPSAhdGhpcy5jb25maWcudGh1bWJuYWlsLmR5bmFtaWM7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHVibGljIHNldFRyYW5zaXRpb24odHJhbnNpdGlvbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGVtZVxyXG5cdFx0cHVibGljIHNldFRoZW1lKHRoZW1lIDogc3RyaW5nLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zLnRoZW1lID0gdGhlbWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBoZWxwXHJcblx0XHRwcml2YXRlIHRvZ2dsZUhlbHAoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcuaGVscCA9ICF0aGlzLmNvbmZpZy5oZWxwO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgc2l6ZVxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVTaXplKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdGxldCBpbmRleCA9IHRoaXMuYXNnLnNpemVzLmluZGV4T2YodGhpcy5jb25maWcuc2l6ZSk7XHJcblx0XHRcdGluZGV4ID0gKGluZGV4ICsgMSkgPj0gdGhpcy5hc2cuc2l6ZXMubGVuZ3RoID8gMCA6ICsraW5kZXg7XHJcblx0XHRcdHRoaXMuY29uZmlnLnNpemUgPSB0aGlzLmFzZy5zaXplc1tpbmRleF07XHJcblx0XHRcdHRoaXMuYXNnLmxvZygndG9nZ2xlIGltYWdlIHNpemU6JywgW3RoaXMuY29uZmlnLnNpemUsIGluZGV4XSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBtZW51XHJcblx0XHRwcml2YXRlIHRvZ2dsZU1lbnUoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcubWVudSA9ICF0aGlzLmNvbmZpZy5tZW51O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgY2FwdGlvblxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVDYXB0aW9uKCkge1xyXG5cclxuXHRcdFx0dGhpcy5jb25maWcuY2FwdGlvbi52aXNpYmxlID0gIXRoaXMuY29uZmlnLmNhcHRpb24udmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1hcmdpbnQgdG9wXHJcblx0XHRwdWJsaWMgZ2V0IG1hcmdpblRvcCgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5tYXJnaW5Ub3A7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtYXJnaW4gYm90dG9tXHJcblx0XHRwdWJsaWMgZ2V0IG1hcmdpbkJvdHRvbSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5tYXJnaW5Cb3R0b207XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtb2RhbCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgZ2V0IHZpc2libGUoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cubW9kYWxWaXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgbW9kYWwgdmlzaWJsZVxyXG5cdFx0cHVibGljIHNldCB2aXNpYmxlKHZhbHVlIDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxWaXNpYmxlID0gdmFsdWU7XHJcblx0XHRcdHRoaXMuYXNnLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbW9kYWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNNb2RhbCB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgbW9kYWwgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zTW9kYWwpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dNb2RhbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckd2luZG93JywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuTW9kYWxDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLW1vZGFsLmh0bWwnLFxyXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PycsXHJcblx0XHRcdGJhc2VVcmw6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgUGFuZWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmwgOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ3BhbmVsJztcclxuXHRcdHByaXZhdGUgdGVtcGxhdGUgPSAndmlld3MvYXNnLXBhbmVsLmh0bWwnO1xyXG5cdFx0cHJpdmF0ZSBhc2cgOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkc2NvcGUgOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXggOiBudW1iZXIsICRldmVudD8gOiBNb3VzZUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2subW9kYWwpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbE9wZW4oaW5kZXgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLnNlbGVjdCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgaG92ZXIoaW5kZXggOiBudW1iZXIsICRldmVudD8gOiBNb3VzZUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5ob3ZlclByZWxvYWQoaW5kZXgpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhvdmVyLnNlbGVjdCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgcGFuZWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNQYW5lbCB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgcGFuZWwgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zUGFuZWwpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnUGFuZWwnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5QYW5lbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYXNnLXBhbmVsIHt7ICRjdHJsLmFzZy5jbGFzc2VzIH19XCIgbmctbW91c2VvdmVyPVwiJGN0cmwuYXNnLm92ZXIucGFuZWwgPSB0cnVlO1wiIG5nLW1vdXNlbGVhdmU9XCIkY3RybC5hc2cub3Zlci5wYW5lbCA9IGZhbHNlO1wiIG5nLXNob3c9XCIkY3RybC5jb25maWcudmlzaWJsZVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPjwvZGl2PicsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAJyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR2aXNpYmxlOiAnPT8nLFxyXG5cdFx0XHR0ZW1wbGF0ZTogJ0A/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5uYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdC8vIG1vZGFsIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc01vZGFsIHtcclxuXHJcblx0XHRtZW51PyA6IGJvb2xlYW47XHJcblx0XHRoZWxwPyA6IGJvb2xlYW47XHJcblx0XHRjYXB0aW9uPyA6IHtcclxuXHRcdFx0dmlzaWJsZSA6IGJvb2xlYW47XHJcblx0XHRcdHBvc2l0aW9uIDogc3RyaW5nO1xyXG5cdFx0fTtcclxuXHRcdHRyYW5zaXRpb24/IDogc3RyaW5nO1xyXG5cdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0c3VidGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0YXJyb3dzPyA6IGJvb2xlYW47XHJcblx0XHRzaXplPyA6IHN0cmluZztcclxuXHRcdHRodW1ibmFpbD8gOiBJT3B0aW9uc1RodW1ibmFpbDtcclxuXHRcdG1hcmdpblRvcD8gOiBudW1iZXI7XHJcblx0XHRtYXJnaW5Cb3R0b20/IDogbnVtYmVyO1xyXG5cdFx0Y2xpY2s/IDoge1xyXG5cdFx0XHRjbG9zZSA6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0a2V5Y29kZXM/IDoge1xyXG5cdFx0XHRleGl0PyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdHBsYXlwYXVzZT8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRmb3J3YXJkPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGJhY2t3YXJkPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGZpcnN0PyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGxhc3Q/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0ZnVsbHNjcmVlbj8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRtZW51PyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGNhcHRpb24/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0aGVscD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRzaXplPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdHRyYW5zaXRpb24/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHQvLyBwYW5lbCBjb21wb25lbnQgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNQYW5lbCB7XHJcblxyXG5cdFx0dmlzaWJsZT8gOiBib29sZWFuO1xyXG5cdFx0aXRlbT8gOiB7XHJcblx0XHRcdGNsYXNzPyA6IHN0cmluZztcclxuXHRcdFx0Y2FwdGlvbiA6IGJvb2xlYW47XHJcblx0XHRcdGluZGV4IDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRob3Zlcj8gOiB7XHJcblx0XHRcdHNlbGVjdCA6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0Y2xpY2s/IDoge1xyXG5cdFx0XHRzZWxlY3QgOiBib29sZWFuO1xyXG5cdFx0XHRtb2RhbCA6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIHRodW1ibmFpbCBjb21wb25lbnQgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNUaHVtYm5haWwge1xyXG5cclxuXHRcdGhlaWdodD8gOiBudW1iZXIsXHJcblx0XHRpbmRleD8gOiBib29sZWFuO1xyXG5cdFx0ZHluYW1pYz8gOiBib29sZWFuO1xyXG5cdFx0Y2xpY2s/IDoge1xyXG5cdFx0XHRzZWxlY3QgOiBib29sZWFuO1xyXG5cdFx0XHRtb2RhbCA6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0aG92ZXI/IDoge1xyXG5cdFx0XHRzZWxlY3QgOiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHQvLyBpbmZvIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0luZm8ge1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHR0cmFuc2l0aW9uPyA6IHN0cmluZztcclxuXHRcdHNpemU/IDogc3RyaW5nO1xyXG5cdFx0YXJyb3dzPyA6IGJvb2xlYW47XHJcblx0XHRjbGljaz8gOiB7XHJcblx0XHRcdG1vZGFsIDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRoZWlnaHQ/IDogbnVtYmVyO1xyXG5cdFx0aGVpZ2h0TWluPyA6IG51bWJlcjtcclxuXHRcdGhlaWdodEF1dG8/IDoge1xyXG5cdFx0XHRpbml0aWFsPyA6IGJvb2xlYW47XHJcblx0XHRcdG9ucmVzaXplPyA6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGdhbGxlcnkgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xyXG5cclxuXHRcdGRlYnVnPyA6IGJvb2xlYW47XHJcblx0XHRiYXNlVXJsPyA6IHN0cmluZztcclxuXHRcdGZpZWxkcz8gOiB7XHJcblx0XHRcdHNvdXJjZT8gOiB7XHJcblx0XHRcdFx0bW9kYWw/IDogc3RyaW5nO1xyXG5cdFx0XHRcdHBhbmVsPyA6IHN0cmluZztcclxuXHRcdFx0XHRpbWFnZT8gOiBzdHJpbmc7XHJcblx0XHRcdH1cclxuXHRcdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0XHRkZXNjcmlwdGlvbj8gOiBzdHJpbmc7XHJcblx0XHRcdHRodW1ibmFpbD8gOiBzdHJpbmc7XHJcblx0XHR9O1xyXG5cdFx0YXV0b3BsYXk/IDoge1xyXG5cdFx0XHRlbmFibGVkPyA6IGJvb2xlYW47XHJcblx0XHRcdGRlbGF5PyA6IG51bWJlcjtcclxuXHRcdH07XHJcblx0XHR0aGVtZT8gOiBzdHJpbmc7XHJcblx0XHRwcmVsb2FkRGVsYXk/IDogbnVtYmVyO1xyXG5cdFx0cHJlbG9hZD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0bW9kYWw/IDogSU9wdGlvbnNNb2RhbDtcclxuXHRcdHBhbmVsPyA6IElPcHRpb25zUGFuZWw7XHJcblx0XHRpbWFnZT8gOiBJT3B0aW9uc0ltYWdlO1xyXG5cdFx0dGh1bWJuYWlsPyA6IElPcHRpb25zVGh1bWJuYWlsO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIHNvdXJjZVxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVNvdXJjZSB7XHJcblxyXG5cdFx0bW9kYWwgOiBzdHJpbmc7IC8vIG9yaWdpbmFsLCByZXF1aXJlZFxyXG5cdFx0cGFuZWw/IDogc3RyaW5nO1xyXG5cdFx0aW1hZ2U/IDogc3RyaW5nO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGZpbGVcclxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWxlIHtcclxuXHJcblx0XHRzb3VyY2UgOiBJU291cmNlO1xyXG5cdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0bmFtZT8gOiBzdHJpbmc7XHJcblx0XHRleHRlbnNpb24/IDogc3RyaW5nO1xyXG5cdFx0ZGVzY3JpcHRpb24/IDogc3RyaW5nO1xyXG5cdFx0ZG93bmxvYWQ/IDogc3RyaW5nO1xyXG5cdFx0bG9hZGVkPyA6IHtcclxuXHRcdFx0bW9kYWw/IDogYm9vbGVhbjtcclxuXHRcdFx0cGFuZWw/IDogYm9vbGVhbjtcclxuXHRcdFx0aW1hZ2U/IDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHR3aWR0aD8gOiBudW1iZXI7XHJcblx0XHRoZWlnaHQ/IDogbnVtYmVyO1xyXG5cclxuXHR9XHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU92ZXIge1xyXG5cdFx0bW9kYWxJbWFnZSA6IGJvb2xlYW47XHJcblx0XHRwYW5lbCA6IGJvb2xlYW47XHJcblx0fVxyXG5cclxuXHQvLyBzZXJ2aWNlIGNvbnRyb2xsZXIgaW50ZXJmYWNlXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJU2VydmljZUNvbnRyb2xsZXIge1xyXG5cclxuXHRcdG1vZGFsVmlzaWJsZSA6IGJvb2xlYW47XHJcblx0XHRwYW5lbFZpc2libGUgOiBib29sZWFuO1xyXG5cdFx0bW9kYWxBdmFpbGFibGUgOiBib29sZWFuO1xyXG5cdFx0dHJhbnNpdGlvbnMgOiBBcnJheTxzdHJpbmc+O1xyXG5cdFx0dGhlbWVzIDogQXJyYXk8c3RyaW5nPjtcclxuXHRcdGNsYXNzZXMgOiBzdHJpbmc7XHJcblx0XHRvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHRcdHNlbGVjdGVkIDogbnVtYmVyO1xyXG5cdFx0ZmlsZSA6IElGaWxlO1xyXG5cdFx0c2l6ZXMgOiBBcnJheTxzdHJpbmc+O1xyXG5cdFx0aWQgOiBzdHJpbmc7XHJcblx0XHRldmVudHMgOiB7XHJcblx0XHRcdENPTkZJR19MT0FEIDogc3RyaW5nO1xyXG5cdFx0XHRBVVRPUExBWV9TVEFSVCA6IHN0cmluZztcclxuXHRcdFx0QVVUT1BMQVlfU1RPUCA6IHN0cmluZztcclxuXHRcdFx0UEFSU0VfSU1BR0VTIDogc3RyaW5nO1xyXG5cdFx0XHRMT0FEX0lNQUdFIDogc3RyaW5nO1xyXG5cdFx0XHRGSVJTVF9JTUFHRSA6IHN0cmluZztcclxuXHRcdFx0Q0hBTkdFX0lNQUdFIDogc3RyaW5nO1xyXG5cdFx0XHRNT0RBTF9PUEVOIDogc3RyaW5nO1xyXG5cdFx0XHRNT0RBTF9DTE9TRSA6IHN0cmluZztcclxuXHRcdH07XHJcblxyXG5cdFx0Z2V0SW5zdGFuY2UoY29tcG9uZW50IDogYW55KSA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRzZXREZWZhdWx0cygpIDogdm9pZDtcclxuXHJcblx0XHRzZXRPcHRpb25zKG9wdGlvbnMgOiBJT3B0aW9ucykgOiBJT3B0aW9ucztcclxuXHJcblx0XHRzZXRJdGVtcyhpdGVtcyA6IEFycmF5PElGaWxlPikgOiB2b2lkO1xyXG5cclxuXHRcdHByZWxvYWQod2FpdD8gOiBudW1iZXIpIDogdm9pZDtcclxuXHJcblx0XHRub3JtYWxpemUoaW5kZXggOiBudW1iZXIpIDogbnVtYmVyO1xyXG5cclxuXHRcdHNldEZvY3VzKCkgOiB2b2lkO1xyXG5cclxuXHRcdHNldFNlbGVjdGVkKGluZGV4IDogbnVtYmVyKTtcclxuXHJcblx0XHRtb2RhbE9wZW4oaW5kZXggOiBudW1iZXIpIDogdm9pZDtcclxuXHJcblx0XHRtb2RhbENsb3NlKCkgOiB2b2lkO1xyXG5cclxuXHRcdG1vZGFsQ2xpY2soJGV2ZW50PyA6IFVJRXZlbnQpIDogdm9pZDtcclxuXHJcblx0XHR0aHVtYm5haWxzTW92ZShkZWxheT8gOiBudW1iZXIpIDogdm9pZDtcclxuXHJcblx0XHR0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cclxuXHRcdHRvRm9yd2FyZChzdG9wPyA6IGJvb2xlYW4pIDogdm9pZDtcclxuXHJcblx0XHR0b0ZpcnN0KHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cclxuXHRcdHRvTGFzdChzdG9wPyA6IGJvb2xlYW4pIDogdm9pZDtcclxuXHJcblx0XHRsb2FkSW1hZ2UoaW5kZXg/IDogbnVtYmVyKSA6IHZvaWQ7XHJcblxyXG5cdFx0bG9hZEltYWdlcyhpbmRleGVzIDogQXJyYXk8bnVtYmVyPikgOiB2b2lkO1xyXG5cclxuXHRcdGhvdmVyUHJlbG9hZChpbmRleCA6IG51bWJlcikgOiB2b2lkO1xyXG5cclxuXHRcdGF1dG9QbGF5VG9nZ2xlKCkgOiB2b2lkO1xyXG5cclxuXHRcdHRvZ2dsZShlbGVtZW50IDogc3RyaW5nKSA6IHZvaWQ7XHJcblxyXG5cdFx0c2V0SGFzaCgpIDogdm9pZDtcclxuXHJcblx0XHRkb3dubG9hZExpbmsoKSA6IHN0cmluZztcclxuXHJcblx0XHRlbChzZWxlY3RvcikgOiBhbnk7XHJcblxyXG5cdFx0bG9nKGV2ZW50IDogc3RyaW5nLCBkYXRhPyA6IGFueSkgOiB2b2lkO1xyXG5cclxuXHJcblx0fVxyXG5cclxuXHQvLyBzZXJ2aWNlIGNvbnRyb2xsZXJcclxuXHRleHBvcnQgY2xhc3MgU2VydmljZUNvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBzbHVnID0gJ2FzZyc7XHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgaXRlbXMgOiBhbnk7XHJcblx0XHRwdWJsaWMgZmlsZXMgOiBBcnJheTxJRmlsZT4gPSBbXTtcclxuXHRcdHB1YmxpYyBkaXJlY3Rpb24gOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgbW9kYWxBdmFpbGFibGUgPSBmYWxzZTtcclxuXHJcblx0XHRwcml2YXRlIGluc3RhbmNlcyA6IHt9ID0ge307XHJcblx0XHRwcml2YXRlIF9zZWxlY3RlZCA6IG51bWJlcjtcclxuXHRcdHByaXZhdGUgX3Zpc2libGUgPSBmYWxzZTtcclxuXHRcdHByaXZhdGUgYXV0b3BsYXkgOiBhbmd1bGFyLklQcm9taXNlPGFueT47XHJcblx0XHRwcml2YXRlIGZpcnN0ID0gZmFsc2U7XHJcblxyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucyA9IG51bGw7XHJcblx0XHRwdWJsaWMgb3B0aW9uc0xvYWRlZCA9IGZhbHNlO1xyXG5cdFx0cHVibGljIGRlZmF1bHRzIDogSU9wdGlvbnMgPSB7XHJcblx0XHRcdGRlYnVnOiBmYWxzZSwgLy8gaW1hZ2UgbG9hZCwgYXV0b3BsYXksIGV0Yy4gaW5mbyBpbiBjb25zb2xlLmxvZ1xyXG5cdFx0XHRiYXNlVXJsOiAnJywgLy8gdXJsIHByZWZpeFxyXG5cdFx0XHRmaWVsZHM6IHtcclxuXHRcdFx0XHRzb3VyY2U6IHtcclxuXHRcdFx0XHRcdG1vZGFsOiAndXJsJywgLy8gcmVxdWlyZWQsIGltYWdlIHVybCBmb3IgbW9kYWwgY29tcG9uZW50IChsYXJnZSBzaXplKVxyXG5cdFx0XHRcdFx0cGFuZWw6ICd1cmwnLCAvLyBpbWFnZSB1cmwgZm9yIHBhbmVsIGNvbXBvbmVudCAodGh1bWJuYWlsIHNpemUpXHJcblx0XHRcdFx0XHRpbWFnZTogJ3VybCcgLy8gaW1hZ2UgdXJsIGZvciBpbWFnZSAobWVkaXVtIG9yIGN1c3RvbSBzaXplKVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dGl0bGU6ICd0aXRsZScsIC8vIHRpdGxlIGZpZWxkIG5hbWVcclxuXHRcdFx0XHRkZXNjcmlwdGlvbjogJ2Rlc2NyaXB0aW9uJywgLy8gZGVzY3JpcHRpb24gZmllbGQgbmFtZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhdXRvcGxheToge1xyXG5cdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLCAvLyBzbGlkZXNob3cgcGxheSBlbmFibGVkL2Rpc2FibGVkXHJcblx0XHRcdFx0ZGVsYXk6IDQxMDAgLy8gYXV0b3BsYXkgZGVsYXkgaW4gbWlsbGlzZWNvbmRcclxuXHRcdFx0fSxcclxuXHRcdFx0dGhlbWU6ICdkZWZhdWx0JywgLy8gY3NzIHN0eWxlIFtkZWZhdWx0LCBkYXJrYmx1ZSwgd2hpdGVnb2xkXVxyXG5cdFx0XHRwcmVsb2FkRGVsYXk6IDc3MCxcclxuXHRcdFx0cHJlbG9hZDogW10sIC8vIHByZWxvYWQgaW1hZ2VzIGJ5IGluZGV4IG51bWJlclxyXG5cdFx0XHRtb2RhbDoge1xyXG5cdFx0XHRcdHRpdGxlOiAnJywgLy8gbW9kYWwgd2luZG93IHRpdGxlXHJcblx0XHRcdFx0c3VidGl0bGU6ICcnLCAvLyBtb2RhbCB3aW5kb3cgc3VidGl0bGVcclxuXHRcdFx0XHRjYXB0aW9uOiB7XHJcblx0XHRcdFx0XHR2aXNpYmxlOiB0cnVlLCAvLyBzaG93L2hpZGUgaW1hZ2UgY2FwdGlvblxyXG5cdFx0XHRcdFx0cG9zaXRpb246ICd0b3AnIC8vIGNhcHRpb24gcG9zaXRpb24gW3RvcCwgYm90dG9tXVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0bWVudTogdHJ1ZSwgLy8gc2hvdy9oaWRlIG1vZGFsIG1lbnVcclxuXHRcdFx0XHRoZWxwOiBmYWxzZSwgLy8gc2hvdy9oaWRlIGhlbHBcclxuXHRcdFx0XHRhcnJvd3M6IHRydWUsIC8vIHNob3cvaGlkZSBhcnJvd3NcclxuXHRcdFx0XHRjbGljazoge1xyXG5cdFx0XHRcdFx0Y2xvc2U6IHRydWUgLy8gd2hlbiBjbGljayBvbiB0aGUgaW1hZ2UgY2xvc2UgdGhlIG1vZGFsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR0aHVtYm5haWw6IHtcclxuXHRcdFx0XHRcdGhlaWdodDogNTAsIC8vIHRodW1ibmFpbCBpbWFnZSBoZWlnaHQgaW4gcGl4ZWxcclxuXHRcdFx0XHRcdGluZGV4OiBmYWxzZSwgLy8gc2hvdyBpbmRleCBudW1iZXIgb24gdGh1bWJuYWlsXHJcblx0XHRcdFx0XHRkeW5hbWljOiBmYWxzZSwgLy8gaWYgdHJ1ZSB0aHVtYm5haWxzIHZpc2libGUgb25seSB3aGVuIG1vdXNlb3ZlclxyXG5cdFx0XHRcdFx0Y2xpY2s6IHtcclxuXHRcdFx0XHRcdFx0c2VsZWN0OiB0cnVlLCAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugd2hlbiB0cnVlXHJcblx0XHRcdFx0XHRcdG1vZGFsOiBmYWxzZSAvLyBvcGVuIG1vZGFsIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGhvdmVyOiB7XHJcblx0XHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRcdFx0c2l6ZTogJ2NvdmVyJywgLy8gY29udGFpbiwgY292ZXIsIGF1dG8sIHN0cmV0Y2hcclxuXHRcdFx0XHRrZXljb2Rlczoge1xyXG5cdFx0XHRcdFx0ZXhpdDogWzI3XSwgLy8gZXNjXHJcblx0XHRcdFx0XHRwbGF5cGF1c2U6IFs4MF0sIC8vIHBcclxuXHRcdFx0XHRcdGZvcndhcmQ6IFszMiwgMzldLCAvLyBzcGFjZSwgcmlnaHQgYXJyb3dcclxuXHRcdFx0XHRcdGJhY2t3YXJkOiBbMzddLCAvLyBsZWZ0IGFycm93XHJcblx0XHRcdFx0XHRmaXJzdDogWzM4LCAzNl0sIC8vIHVwIGFycm93LCBob21lXHJcblx0XHRcdFx0XHRsYXN0OiBbNDAsIDM1XSwgLy8gZG93biBhcnJvdywgZW5kXHJcblx0XHRcdFx0XHRmdWxsc2NyZWVuOiBbMTNdLCAvLyBlbnRlclxyXG5cdFx0XHRcdFx0bWVudTogWzc3XSwgLy8gbVxyXG5cdFx0XHRcdFx0Y2FwdGlvbjogWzY3XSwgLy8gY1xyXG5cdFx0XHRcdFx0aGVscDogWzcyXSwgLy8gaFxyXG5cdFx0XHRcdFx0c2l6ZTogWzgzXSwgLy8gc1xyXG5cdFx0XHRcdFx0dHJhbnNpdGlvbjogWzg0XSAvLyB0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR0aHVtYm5haWw6IHtcclxuXHRcdFx0XHRoZWlnaHQ6IDUwLCAvLyB0aHVtYm5haWwgaW1hZ2UgaGVpZ2h0IGluIHBpeGVsXHJcblx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93IGluZGV4IG51bWJlciBvbiB0aHVtYm5haWxcclxuXHRcdFx0XHRkeW5hbWljOiBmYWxzZSwgLy8gaWYgdHJ1ZSB0aHVtYm5haWxzIHZpc2libGUgb25seSB3aGVuIG1vdXNlb3ZlclxyXG5cdFx0XHRcdGNsaWNrOiB7XHJcblx0XHRcdFx0XHRzZWxlY3Q6IHRydWUsIC8vIHNldCBzZWxlY3RlZCBpbWFnZSB3aGVuIHRydWVcclxuXHRcdFx0XHRcdG1vZGFsOiBmYWxzZSAvLyBvcGVuIG1vZGFsIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aG92ZXI6IHtcclxuXHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRwYW5lbDoge1xyXG5cdFx0XHRcdHZpc2libGU6IHRydWUsXHJcblx0XHRcdFx0aXRlbToge1xyXG5cdFx0XHRcdFx0Y2xhc3M6ICdjb2wtbWQtMycsIC8vIGl0ZW0gY2xhc3NcclxuXHRcdFx0XHRcdGNhcHRpb246IGZhbHNlLCAvLyBzaG93L2hpZGUgaW1hZ2UgY2FwdGlvblxyXG5cdFx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93L2hpZGUgaW1hZ2UgaW5kZXhcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGhvdmVyOiB7XHJcblx0XHRcdFx0XHRzZWxlY3Q6IGZhbHNlIC8vIHNldCBzZWxlY3RlZCBpbWFnZSBvbiBtb3VzZW92ZXIgd2hlbiB0cnVlXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRjbGljazoge1xyXG5cdFx0XHRcdFx0c2VsZWN0OiBmYWxzZSwgLy8gc2V0IHNlbGVjdGVkIGltYWdlIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdFx0bW9kYWw6IHRydWUgLy8gb3BlbiBtb2RhbCB3aGVuIHRydWVcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRpbWFnZToge1xyXG5cdFx0XHRcdHRyYW5zaXRpb246ICdzbGlkZUxSJywgLy8gdHJhbnNpdGlvbiBlZmZlY3RcclxuXHRcdFx0XHRzaXplOiAnY292ZXInLCAvLyBjb250YWluLCBjb3ZlciwgYXV0bywgc3RyZXRjaFxyXG5cdFx0XHRcdGFycm93czogdHJ1ZSwgLy8gc2hvdy9oaWRlIGFycm93c1xyXG5cdFx0XHRcdGNsaWNrOiB7XHJcblx0XHRcdFx0XHRtb2RhbDogdHJ1ZSAvLyB3aGVuIGNsaWNrIG9uIHRoZSBpbWFnZSBvcGVuIHRoZSBtb2RhbCB3aW5kb3dcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGhlaWdodDogbnVsbCwgLy8gaGVpZ2h0IGluIHBpeGVsXHJcblx0XHRcdFx0aGVpZ2h0TWluOiBudWxsLCAvLyBtaW4gaGVpZ2h0IGluIHBpeGVsXHJcblx0XHRcdFx0aGVpZ2h0QXV0bzoge1xyXG5cdFx0XHRcdFx0aW5pdGlhbDogdHJ1ZSwgLy8gY2FsY3VsYXRlIGRpdiBoZWlnaHQgYnkgZmlyc3QgaW1hZ2VcclxuXHRcdFx0XHRcdG9ucmVzaXplOiBmYWxzZSAvLyBjYWxjdWxhdGUgZGl2IGhlaWdodCBvbiB3aW5kb3cgcmVzaXplXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIGF2YWlsYWJsZSBpbWFnZSBzaXplc1xyXG5cdFx0cHVibGljIHNpemVzIDogQXJyYXk8c3RyaW5nPiA9IFtcclxuXHRcdFx0J2NvbnRhaW4nLFxyXG5cdFx0XHQnY292ZXInLFxyXG5cdFx0XHQnYXV0bycsXHJcblx0XHRcdCdzdHJldGNoJ1xyXG5cdFx0XTtcclxuXHJcblx0XHQvLyBhdmFpbGFibGUgdGhlbWVzXHJcblx0XHRwdWJsaWMgdGhlbWVzIDogQXJyYXk8c3RyaW5nPiA9IFtcclxuXHRcdFx0J2RlZmF1bHQnLFxyXG5cdFx0XHQnZGFya2JsdWUnLFxyXG5cdFx0XHQnd2hpdGVnb2xkJ1xyXG5cdFx0XTtcclxuXHJcblx0XHQvLyBhdmFpbGFibGUgdHJhbnNpdGlvbnNcclxuXHRcdHB1YmxpYyB0cmFuc2l0aW9ucyA6IEFycmF5PHN0cmluZz4gPSBbXHJcblx0XHRcdCdubycsXHJcblx0XHRcdCdmYWRlSW5PdXQnLFxyXG5cdFx0XHQnem9vbUluJyxcclxuXHRcdFx0J3pvb21PdXQnLFxyXG5cdFx0XHQnem9vbUluT3V0JyxcclxuXHRcdFx0J3JvdGF0ZUxSJyxcclxuXHRcdFx0J3JvdGF0ZVRCJyxcclxuXHRcdFx0J3JvdGF0ZVpZJyxcclxuXHRcdFx0J3NsaWRlTFInLFxyXG5cdFx0XHQnc2xpZGVUQicsXHJcblx0XHRcdCdmbGlwWCcsXHJcblx0XHRcdCdmbGlwWSdcclxuXHRcdF07XHJcblxyXG5cdFx0cHVibGljIGV2ZW50cyA9IHtcclxuXHRcdFx0Q09ORklHX0xPQUQ6ICdBU0ctY29uZmlnLWxvYWQtJyxcclxuXHRcdFx0QVVUT1BMQVlfU1RBUlQ6ICdBU0ctYXV0b3BsYXktc3RhcnQtJyxcclxuXHRcdFx0QVVUT1BMQVlfU1RPUDogJ0FTRy1hdXRvcGxheS1zdG9wLScsXHJcblx0XHRcdFBBUlNFX0lNQUdFUzogJ0FTRy1wYXJzZS1pbWFnZXMtJyxcclxuXHRcdFx0TE9BRF9JTUFHRTogJ0FTRy1sb2FkLWltYWdlLScsXHJcblx0XHRcdEZJUlNUX0lNQUdFOiAnQVNHLWZpcnN0LWltYWdlLScsXHJcblx0XHRcdENIQU5HRV9JTUFHRTogJ0FTRy1jaGFuZ2UtaW1hZ2UtJyxcclxuXHRcdFx0TU9EQUxfT1BFTjogJ0FTRy1tb2RhbC1vcGVuLScsXHJcblx0XHRcdE1PREFMX0NMT1NFOiAnQVNHLW1vZGFsLWNsb3NlLScsXHJcblx0XHRcdFRIVU1CTkFJTF9NT1ZFOiAnQVNHLXRodW1ibmFpbC1tb3ZlLScsXHJcblx0XHR9O1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgdGltZW91dCA6IG5nLklUaW1lb3V0U2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgaW50ZXJ2YWwgOiBuZy5JSW50ZXJ2YWxTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSBsb2NhdGlvbiA6IG5nLklMb2NhdGlvblNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICRyb290U2NvcGUgOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHdpbmRvdyA6IG5nLklXaW5kb3dTZXJ2aWNlKSB7XHJcblxyXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCgncmVzaXplJywgKGV2ZW50KSA9PiB7XHJcblx0XHRcdFx0dGhpcy50aHVtYm5haWxzTW92ZSgyMDApO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBwYXJzZUhhc2goKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuaWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBoYXNoID0gdGhpcy5sb2NhdGlvbi5oYXNoKCk7XHJcblx0XHRcdGxldCBwYXJ0cyA9IGhhc2ggPyBoYXNoLnNwbGl0KCctJykgOiBudWxsO1xyXG5cclxuXHRcdFx0aWYgKHBhcnRzID09PSBudWxsKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocGFydHNbMF0gIT09IHRoaXMuc2x1Zykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHBhcnRzLmxlbmd0aCAhPT0gMykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHBhcnRzWzFdICE9PSB0aGlzLmlkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgaW5kZXggPSBwYXJzZUludChwYXJ0c1syXSwgMTApO1xyXG5cclxuXHRcdFx0aWYgKCFhbmd1bGFyLmlzTnVtYmVyKGluZGV4KSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHJcblx0XHRcdFx0aW5kZXgtLTtcclxuXHRcdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXg7XHJcblx0XHRcdFx0dGhpcy5tb2RhbE9wZW4oaW5kZXgpO1xyXG5cclxuXHRcdFx0fSwgMjApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBjYWxjdWxhdGUgb2JqZWN0IGhhc2ggaWRcclxuXHRcdHB1YmxpYyBvYmplY3RIYXNoSWQob2JqZWN0IDogYW55KSA6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRsZXQgc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkob2JqZWN0KTtcclxuXHJcblx0XHRcdGlmICghc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBhYmMgPSBzdHJpbmcucmVwbGFjZSgvW15hLXpBLVowLTldKy9nLCAnJyk7XHJcblx0XHRcdGxldCBjb2RlID0gMDtcclxuXHJcblx0XHRcdGZvciAobGV0IGkgPSAwLCBuID0gYWJjLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG5cdFx0XHRcdGxldCBjaGFyY29kZSA9IGFiYy5jaGFyQ29kZUF0KGkpO1xyXG5cdFx0XHRcdGNvZGUgKz0gKGNoYXJjb2RlICogaSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBjb2RlLnRvU3RyaW5nKDIxKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2UgZm9yIGN1cnJlbnQgZ2FsbGVyeSBieSBjb21wb25lbnQgaWRcclxuXHRcdHB1YmxpYyBnZXRJbnN0YW5jZShjb21wb25lbnQgOiBhbnkpIHtcclxuXHJcblx0XHRcdGlmICghY29tcG9uZW50LmlkKSB7XHJcblxyXG5cdFx0XHRcdC8vIGdldCBwYXJlbnQgYXNnIGNvbXBvbmVudCBpZFxyXG5cdFx0XHRcdGlmIChjb21wb25lbnQuJHNjb3BlICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudCAmJiBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQuJHBhcmVudCAmJiBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQuJHBhcmVudC4kY3RybCkge1xyXG5cdFx0XHRcdFx0Y29tcG9uZW50LmlkID0gY29tcG9uZW50LiRzY29wZS4kcGFyZW50LiRwYXJlbnQuJGN0cmwuaWQ7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbXBvbmVudC5pZCA9IHRoaXMub2JqZWN0SGFzaElkKGNvbXBvbmVudC5vcHRpb25zKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBpZCA9IGNvbXBvbmVudC5pZDtcclxuXHRcdFx0bGV0IGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbaWRdO1xyXG5cclxuXHRcdFx0Ly8gbmV3IGluc3RhbmNlIGFuZCBzZXQgb3B0aW9ucyBhbmQgaXRlbXNcclxuXHRcdFx0aWYgKGluc3RhbmNlID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRpbnN0YW5jZSA9IG5ldyBTZXJ2aWNlQ29udHJvbGxlcih0aGlzLnRpbWVvdXQsIHRoaXMuaW50ZXJ2YWwsIHRoaXMubG9jYXRpb24sIHRoaXMuJHJvb3RTY29wZSwgdGhpcy4kd2luZG93KTtcclxuXHRcdFx0XHRpbnN0YW5jZS5pZCA9IGlkO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoY29tcG9uZW50LmJhc2VVcmwpIHtcclxuXHRcdFx0XHRjb21wb25lbnQub3B0aW9ucy5iYXNlVXJsID0gY29tcG9uZW50LmJhc2VVcmw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGluc3RhbmNlLnNldE9wdGlvbnMoY29tcG9uZW50Lm9wdGlvbnMpO1xyXG5cdFx0XHRpbnN0YW5jZS5zZXRJdGVtcyhjb21wb25lbnQuaXRlbXMpO1xyXG5cdFx0XHRpbnN0YW5jZS5zZWxlY3RlZCA9IGNvbXBvbmVudC5zZWxlY3RlZCA/IGNvbXBvbmVudC5zZWxlY3RlZCA6IDA7XHJcblx0XHRcdGluc3RhbmNlLnBhcnNlSGFzaCgpO1xyXG5cclxuXHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMpIHtcclxuXHJcblx0XHRcdFx0aW5zdGFuY2UubG9hZEltYWdlcyhpbnN0YW5jZS5vcHRpb25zLnByZWxvYWQpO1xyXG5cclxuXHRcdFx0XHRpZiAoaW5zdGFuY2Uub3B0aW9ucy5hdXRvcGxheSAmJiBpbnN0YW5jZS5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgJiYgIWluc3RhbmNlLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0XHRpbnN0YW5jZS5hdXRvUGxheVN0YXJ0KCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5pbnN0YW5jZXNbaWRdID0gaW5zdGFuY2U7XHJcblx0XHRcdHJldHVybiBpbnN0YW5jZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gcHJlcGFyZSBpbWFnZXMgYXJyYXlcclxuXHRcdHB1YmxpYyBzZXRJdGVtcyhpdGVtcyA6IEFycmF5PElGaWxlPikge1xyXG5cclxuXHRcdFx0aWYgKCFpdGVtcykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYgYWxyZWFkeVxyXG5cdFx0XHRpZiAodGhpcy5pdGVtcykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gcGFyc2UgYXJyYXkgc3RyaW5nIGVsZW1lbnRzXHJcblx0XHRcdGlmIChhbmd1bGFyLmlzU3RyaW5nKGl0ZW1zWzBdKSA9PT0gdHJ1ZSkge1xyXG5cclxuXHRcdFx0XHR0aGlzLml0ZW1zID0gW107XHJcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0dGhpcy5pdGVtcy5wdXNoKHtzb3VyY2U6IHttb2RhbDogaXRlbXNbaV19fSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0dGhpcy5pdGVtcyA9IGl0ZW1zO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5wcmVwYXJlSXRlbXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3B0aW9ucyBzZXR1cFxyXG5cdFx0cHVibGljIHNldE9wdGlvbnMob3B0aW9ucyA6IElPcHRpb25zKSB7XHJcblxyXG5cdFx0XHQvLyBpZiBvcHRpb25zIGFscmVhZHkgc2V0dXBcclxuXHRcdFx0aWYgKHRoaXMub3B0aW9uc0xvYWRlZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKG9wdGlvbnMpIHtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMgPSBhbmd1bGFyLm1lcmdlKHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cdFx0XHRcdHRoaXMub3B0aW9uc0xvYWRlZCA9IHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25zID0gdGhpcy5kZWZhdWx0cztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaW1wb3J0YW50IVxyXG5cdFx0XHRvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5DT05GSUdfTE9BRCwgdGhpcy5vcHRpb25zKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnM7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR2ID0gdGhpcy5ub3JtYWxpemUodik7XHJcblx0XHRcdGxldCBwcmV2ID0gdGhpcy5fc2VsZWN0ZWQ7XHJcblxyXG5cdFx0XHR0aGlzLl9zZWxlY3RlZCA9IHY7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cclxuXHRcdFx0aWYgKHByZXYgIT09IHRoaXMuX3NlbGVjdGVkKSB7XHJcblxyXG5cdFx0XHRcdHRoaXMudGh1bWJuYWlsc01vdmUoKTtcclxuXHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkNIQU5HRV9JTUFHRSwge1xyXG5cdFx0XHRcdFx0aW5kZXg6IHYsXHJcblx0XHRcdFx0XHRmaWxlOiB0aGlzLmZpbGVcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIHNldFNlbGVjdGVkKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9IGluZGV4ID4gdGhpcy5zZWxlY3RlZCA/ICdmb3J3YXJkJyA6ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleDtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnbyB0byBiYWNrd2FyZFxyXG5cdFx0cHVibGljIHRvQmFja3dhcmQoc3RvcD8gOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoc3RvcCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2JhY2t3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZC0tO1xyXG5cdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkIC0gMSk7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBmb3J3YXJkXHJcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0aWYgKHN0b3ApIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdmb3J3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCsrO1xyXG5cdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkICsgMSk7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBmaXJzdFxyXG5cdFx0cHVibGljIHRvRmlyc3Qoc3RvcD8gOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoc3RvcCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2JhY2t3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IDA7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBsYXN0XHJcblx0XHRwdWJsaWMgdG9MYXN0KHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0aWYgKHN0b3ApIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdmb3J3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IHRoaXMuaXRlbXMubGVuZ3RoIC0gMTtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBzZXRIYXNoKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubW9kYWxWaXNpYmxlKSB7XHJcblx0XHRcdFx0dGhpcy5sb2NhdGlvbi5oYXNoKFt0aGlzLnNsdWcsIHRoaXMuaWQsIHRoaXMuc2VsZWN0ZWQgKyAxXS5qb2luKCctJykpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBhdXRvUGxheVRvZ2dsZSgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0YXJ0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBhdXRvUGxheVN0b3AoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXV0b3BsYXkpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuaW50ZXJ2YWwuY2FuY2VsKHRoaXMuYXV0b3BsYXkpO1xyXG5cdFx0XHR0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLmF1dG9wbGF5ID0gbnVsbDtcclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5BVVRPUExBWV9TVE9QLCB7aW5kZXg6IHRoaXMuc2VsZWN0ZWQsIGZpbGU6IHRoaXMuZmlsZX0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlTdGFydCgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuYXV0b3BsYXkgPSB0aGlzLmludGVydmFsKCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnRvRm9yd2FyZCgpO1xyXG5cdFx0XHR9LCB0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZGVsYXkpO1xyXG5cclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5BVVRPUExBWV9TVEFSVCwge2luZGV4OiB0aGlzLnNlbGVjdGVkLCBmaWxlOiB0aGlzLmZpbGV9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgcHJlcGFyZUl0ZW1zKCkge1xyXG5cclxuXHRcdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRsZXQgZ2V0QXZhaWxhYmxlU291cmNlID0gZnVuY3Rpb24gKHR5cGUgOiBzdHJpbmcsIHNvdXJjZSA6IElTb3VyY2UpIHtcclxuXHJcblx0XHRcdFx0aWYgKHNvdXJjZVt0eXBlXSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHNvdXJjZVt0eXBlXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlID09PSAncGFuZWwnKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZ2V0QXZhaWxhYmxlU291cmNlKCdpbWFnZScsIHNvdXJjZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ2ltYWdlJykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGdldEF2YWlsYWJsZVNvdXJjZSgnbW9kYWwnLCBzb3VyY2UpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdtb2RhbCcpIHtcclxuXHRcdFx0XHRcdHJldHVybiBnZXRBdmFpbGFibGVTb3VyY2UoJ2ltYWdlJywgc291cmNlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHJcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh0aGlzLml0ZW1zLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG5cclxuXHRcdFx0XHRpZiAoIXZhbHVlLnNvdXJjZSkge1xyXG5cclxuXHRcdFx0XHRcdHZhbHVlLnNvdXJjZSA9IHtcclxuXHRcdFx0XHRcdFx0bW9kYWw6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLm1vZGFsXSxcclxuXHRcdFx0XHRcdFx0cGFuZWw6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLnBhbmVsXSxcclxuXHRcdFx0XHRcdFx0aW1hZ2U6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLmltYWdlXSxcclxuXHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IHNvdXJjZSA9IHtcclxuXHRcdFx0XHRcdG1vZGFsOiBzZWxmLm9wdGlvbnMuYmFzZVVybCArIGdldEF2YWlsYWJsZVNvdXJjZSgnbW9kYWwnLCB2YWx1ZS5zb3VyY2UpLFxyXG5cdFx0XHRcdFx0cGFuZWw6IHNlbGYub3B0aW9ucy5iYXNlVXJsICsgZ2V0QXZhaWxhYmxlU291cmNlKCdwYW5lbCcsIHZhbHVlLnNvdXJjZSksXHJcblx0XHRcdFx0XHRpbWFnZTogc2VsZi5vcHRpb25zLmJhc2VVcmwgKyBnZXRBdmFpbGFibGVTb3VyY2UoJ2ltYWdlJywgdmFsdWUuc291cmNlKSxcclxuXHRcdFx0XHR9O1xyXG5cclxuXHJcblx0XHRcdFx0bGV0IHBhcnRzID0gc291cmNlLm1vZGFsLnNwbGl0KCcvJyk7XHJcblx0XHRcdFx0bGV0IGZpbGVuYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XHJcblxyXG5cdFx0XHRcdGxldCB0aXRsZSwgZGVzY3JpcHRpb247XHJcblxyXG5cdFx0XHRcdGlmIChzZWxmLm9wdGlvbnMuZmllbGRzICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdHRpdGxlID0gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aXRsZV0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRpdGxlXSA6IGZpbGVuYW1lO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aXRsZSA9IGZpbGVuYW1lO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHNlbGYub3B0aW9ucy5maWVsZHMgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb24gPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuZGVzY3JpcHRpb25dIDogbnVsbDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb24gPSBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGZpbGUgPSB7XHJcblx0XHRcdFx0XHRzb3VyY2U6IHNvdXJjZSxcclxuXHRcdFx0XHRcdHRpdGxlOiB0aXRsZSxcclxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdGxvYWRlZDoge1xyXG5cdFx0XHRcdFx0XHRtb2RhbDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdHBhbmVsOiBmYWxzZSxcclxuXHRcdFx0XHRcdFx0aW1hZ2U6IGZhbHNlXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0c2VsZi5maWxlcy5wdXNoKGZpbGUpO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLlBBUlNFX0lNQUdFUywgdGhpcy5maWxlcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHByZWxvYWQgdGhlIGltYWdlIHdoZW4gbW91c2VvdmVyXHJcblx0XHRwdWJsaWMgaG92ZXJQcmVsb2FkKGluZGV4IDogbnVtYmVyKSB7XHJcblx0XHRcdHRoaXMubG9hZEltYWdlKGluZGV4KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gaW1hZ2UgcHJlbG9hZFxyXG5cdFx0cHJpdmF0ZSBwcmVsb2FkKHdhaXQ/IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkKTtcclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCArIDEpO1xyXG5cdFx0XHR9LCAod2FpdCAhPT0gdW5kZWZpbmVkKSA/IHdhaXQgOiB0aGlzLm9wdGlvbnMucHJlbG9hZERlbGF5KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG5vcm1hbGl6ZShpbmRleCA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0bGV0IGxhc3QgPSB0aGlzLmZpbGVzLmxlbmd0aCAtIDE7XHJcblxyXG5cdFx0XHRpZiAoaW5kZXggPiBsYXN0KSB7XHJcblx0XHRcdFx0cmV0dXJuIChpbmRleCAtIGxhc3QpIC0gMTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGluZGV4IDwgMCkge1xyXG5cdFx0XHRcdHJldHVybiBsYXN0IC0gTWF0aC5hYnMoaW5kZXgpICsgMTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGluZGV4O1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGxvYWRJbWFnZXMoaW5kZXhlcyA6IEFycmF5PG51bWJlcj4sIHR5cGUgOiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdGlmICghaW5kZXhlcykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0aW5kZXhlcy5mb3JFYWNoKChpbmRleCA6IG51bWJlcikgPT4ge1xyXG5cdFx0XHRcdHNlbGYubG9hZEltYWdlKGluZGV4KTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbG9hZEltYWdlKGluZGV4PyA6IG51bWJlciwgY2FsbGJhY2s/IDoge30pIHtcclxuXHJcblx0XHRcdGluZGV4ID0gaW5kZXggPyBpbmRleCA6IHRoaXMuc2VsZWN0ZWQ7XHJcblx0XHRcdGluZGV4ID0gdGhpcy5ub3JtYWxpemUoaW5kZXgpO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmZpbGVzW2luZGV4XSkge1xyXG5cdFx0XHRcdHRoaXMubG9nKCdpbnZhbGlkIGZpbGUgaW5kZXgnLCB7aW5kZXg6IGluZGV4fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5maWxlc1tpbmRleF0ubG9hZGVkLm1vZGFsKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdFx0aW1hZ2Uuc3JjID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlLmltYWdlO1xyXG5cdFx0XHRpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYWZ0ZXJMb2FkKGluZGV4LCAnaW1hZ2UnLCBpbWFnZSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bGV0IG1vZGFsID0gbmV3IEltYWdlKCk7XHJcblx0XHRcdG1vZGFsLnNyYyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5tb2RhbDtcclxuXHRcdFx0bW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYWZ0ZXJMb2FkKGluZGV4LCAnbW9kYWwnLCBtb2RhbCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgZmlsZSBuYW1lXHJcblx0XHRwcml2YXRlIGdldEZpbGVuYW1lKGluZGV4IDogbnVtYmVyLCB0eXBlPyA6IHN0cmluZykge1xyXG5cclxuXHRcdFx0dHlwZSA9IHR5cGUgPyB0eXBlIDogJ21vZGFsJztcclxuXHRcdFx0bGV0IGZpbGVwYXJ0cyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZVt0eXBlXS5zcGxpdCgnLycpO1xyXG5cdFx0XHRsZXQgZmlsZW5hbWUgPSBmaWxlcGFydHNbZmlsZXBhcnRzLmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRyZXR1cm4gZmlsZW5hbWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBmaWxlIGV4dGVuc2lvblxyXG5cdFx0cHJpdmF0ZSBnZXRFeHRlbnNpb24oaW5kZXggOiBudW1iZXIsIHR5cGU/IDogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHR0eXBlID0gdHlwZSA/IHR5cGUgOiAnbW9kYWwnO1xyXG5cdFx0XHRsZXQgZmlsZXBhcnRzID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlW3R5cGVdLnNwbGl0KCcuJyk7XHJcblx0XHRcdGxldCBleHRlbnNpb24gPSBmaWxlcGFydHNbZmlsZXBhcnRzLmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRyZXR1cm4gZXh0ZW5zaW9uO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBhZnRlciBsb2FkIGltYWdlXHJcblx0XHRwcml2YXRlIGFmdGVyTG9hZChpbmRleCwgdHlwZSwgaW1hZ2UpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWRbdHlwZV0gPT09IHRydWUpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZFt0eXBlXSA9IHRydWU7XHJcblxyXG5cdFx0XHRpZiAodHlwZSA9PT0gJ21vZGFsJykge1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLndpZHRoID0gaW1hZ2Uud2lkdGg7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0uaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLm5hbWUgPSB0aGlzLmdldEZpbGVuYW1lKGluZGV4LCB0eXBlKTtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5leHRlbnNpb24gPSB0aGlzLmdldEV4dGVuc2lvbihpbmRleCwgdHlwZSk7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0uZG93bmxvYWQgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2UubW9kYWw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBkYXRhID0ge3R5cGU6IHR5cGUsIGluZGV4OiBpbmRleCwgZmlsZTogdGhpcy5maWxlLCBpbWc6IGltYWdlfTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5maXJzdCkge1xyXG5cdFx0XHRcdHRoaXMuZmlyc3QgPSB0cnVlO1xyXG5cdFx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuRklSU1RfSU1BR0UsIGRhdGEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkxPQURfSU1BR0UsIGRhdGEpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gaXMgc2luZ2xlP1xyXG5cdFx0cHVibGljIGdldCBpc1NpbmdsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmZpbGVzLmxlbmd0aCA+IDEgPyBmYWxzZSA6IHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgdGhlIGRvd25sb2FkIGxpbmtcclxuXHRcdHB1YmxpYyBkb3dubG9hZExpbmsoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5zZWxlY3RlZCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZmlsZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdLnNvdXJjZS5tb2RhbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZSBmaWxlXHJcblx0XHRwdWJsaWMgZ2V0IGZpbGUoKSA6IElGaWxlIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgZWxlbWVudCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgdG9nZ2xlKGVsZW1lbnQgOiBzdHJpbmcpIDogdm9pZCB7XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnNbZWxlbWVudF0udmlzaWJsZSA9ICF0aGlzLm9wdGlvbnNbZWxlbWVudF0udmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgZ2V0IG1vZGFsVmlzaWJsZSgpIDogYm9vbGVhbiB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5fdmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB0aGVtZVxyXG5cdFx0cHVibGljIGdldCB0aGVtZSgpIDogc3RyaW5nIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnMudGhlbWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBjbGFzc2VzXHJcblx0XHRwdWJsaWMgZ2V0IGNsYXNzZXMoKSA6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLnRoZW1lICsgJyAnICsgdGhpcy5pZDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHNldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgc2V0IG1vZGFsVmlzaWJsZSh2YWx1ZSA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcclxuXHJcblx0XHRcdGlmICh2YWx1ZSkge1xyXG5cclxuXHRcdFx0XHR0aGlzLnByZWxvYWQoMSk7XHJcblx0XHRcdFx0dGhpcy5tb2RhbEluaXQoKTtcclxuXHRcdFx0XHR0aGlzLmVsKCdib2R5JykuYWRkQ2xhc3MoJ3loaWRkZW4nKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdHRoaXMuZWwoJ2JvZHknKS5yZW1vdmVDbGFzcygneWhpZGRlbicpO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBpbml0aWFsaXplIHRoZSBnYWxsZXJ5XHJcblx0XHRwcml2YXRlIG1vZGFsSW5pdCgpIHtcclxuXHJcblx0XHRcdGxldCBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblxyXG5cdFx0XHRcdC8vIHN1Ym1lbnUgY2xpY2sgZXZlbnRzXHJcblx0XHRcdFx0bGV0IGVsZW1lbnQgPSAnLmFzZy1tb2RhbC4nICsgc2VsZi5pZCArICcgbGkuZHJvcGRvd24tc3VibWVudSc7XHJcblxyXG5cdFx0XHRcdHRoaXMuZWwoZWxlbWVudCkub2ZmKCkub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblxyXG5cdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuZWwoZWxlbWVudCkuaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVsKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVsKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHRcdHRoaXMuZWwoZWxlbWVudCkuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdHNlbGYuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHRcdH0sIDEwMCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbW9kYWxPcGVuKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMubW9kYWxBdmFpbGFibGUpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleCAhPT0gdW5kZWZpbmVkID8gaW5kZXggOiB0aGlzLnNlbGVjdGVkO1xyXG5cdFx0XHR0aGlzLm1vZGFsVmlzaWJsZSA9IHRydWU7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLk1PREFMX09QRU4sIHtpbmRleDogdGhpcy5zZWxlY3RlZH0pO1xyXG5cdFx0XHR0aGlzLnNldEZvY3VzKCk7XHJcblx0XHRcdHRoaXMudGh1bWJuYWlsc01vdmUoMjAwKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG1vZGFsQ2xvc2UoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmxvY2F0aW9uLmhhc2goJycpO1xyXG5cdFx0XHR0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLk1PREFMX0NMT1NFLCB7aW5kZXg6IHRoaXMuc2VsZWN0ZWR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gbW92ZSB0aHVtYm5haWxzIHRvIGNvcnJlY3QgcG9zaXRpb25cclxuXHRcdHB1YmxpYyB0aHVtYm5haWxzTW92ZShkZWxheT8gOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGxldCBtb3ZlID0gKCkgPT4ge1xyXG5cclxuXHRcdFx0XHRsZXQgY29udGFpbmVycyA9IHRoaXMuZWwoJy5hc2ctdGh1bWJuYWlsLicgKyB0aGlzLmlkKTtcclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb250YWluZXJzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG5cdFx0XHRcdFx0bGV0IGNvbnRhaW5lciA9IGNvbnRhaW5lcnNbaV07XHJcblxyXG5cdFx0XHRcdFx0aWYgKGNvbnRhaW5lci5vZmZzZXRXaWR0aCkge1xyXG5cclxuXHRcdFx0XHRcdFx0bGV0IGl0ZW1zIDogYW55ID0gdGhpcy5lbChjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLml0ZW1zJykpWzBdO1xyXG5cdFx0XHRcdFx0XHRsZXQgaXRlbSA6IGFueSA9IHRoaXMuZWwoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5pdGVtJykpWzBdO1xyXG5cdFx0XHRcdFx0XHRsZXQgdGh1bWJuYWlsLCBtb3ZlWCwgcmVtYWluO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKGl0ZW0pIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW1zLnNjcm9sbFdpZHRoID4gY29udGFpbmVyLm9mZnNldFdpZHRoKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0aHVtYm5haWwgPSBpdGVtcy5zY3JvbGxXaWR0aCAvIHRoaXMuZmlsZXMubGVuZ3RoO1xyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZVggPSAoY29udGFpbmVyLm9mZnNldFdpZHRoIC8gMikgLSAodGhpcy5zZWxlY3RlZCAqIHRodW1ibmFpbCkgLSB0aHVtYm5haWwgLyAyO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVtYWluID0gaXRlbXMuc2Nyb2xsV2lkdGggKyBtb3ZlWDtcclxuXHRcdFx0XHRcdFx0XHRcdG1vdmVYID0gbW92ZVggPiAwID8gMCA6IG1vdmVYO1xyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZVggPSByZW1haW4gPCBjb250YWluZXIub2Zmc2V0V2lkdGggPyBjb250YWluZXIub2Zmc2V0V2lkdGggLSBpdGVtcy5zY3JvbGxXaWR0aCA6IG1vdmVYO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0aHVtYm5haWwgPSB0aGlzLmdldFJlYWxXaWR0aChpdGVtKTtcclxuXHRcdFx0XHRcdFx0XHRcdG1vdmVYID0gKGNvbnRhaW5lci5vZmZzZXRXaWR0aCAtIHRodW1ibmFpbCAqIHRoaXMuZmlsZXMubGVuZ3RoKSAvIDI7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpdGVtcy5zdHlsZS5sZWZ0ID0gbW92ZVggKyAncHgnO1xyXG5cclxuXHRcdFx0XHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLlRIVU1CTkFJTF9NT1ZFLCB7XHJcblx0XHRcdFx0XHRcdFx0XHR0aHVtYm5haWw6IHRodW1ibmFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdG1vdmU6IG1vdmVYLFxyXG5cdFx0XHRcdFx0XHRcdFx0cmVtYWluOiByZW1haW4sXHJcblx0XHRcdFx0XHRcdFx0XHRjb250YWluZXI6IGNvbnRhaW5lci5vZmZzZXRXaWR0aCxcclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW1zOiBpdGVtcy5zY3JvbGxXaWR0aFxyXG5cdFx0XHRcdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpZiAoZGVsYXkpIHtcclxuXHRcdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0bW92ZSgpO1xyXG5cdFx0XHRcdH0sIGRlbGF5KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtb3ZlKCk7XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBtb2RhbENsaWNrKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHRpZiAoJGV2ZW50KSB7XHJcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGUgZm9jdXNcclxuXHRcdHB1YmxpYyBzZXRGb2N1cygpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm1vZGFsVmlzaWJsZSkge1xyXG5cdFx0XHRcdHRoaXMuZWwoJy5hc2ctbW9kYWwuJyArIHRoaXMuaWQgKyAnIC5rZXlJbnB1dCcpLnRyaWdnZXIoJ2ZvY3VzJykuZm9jdXMoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIGV2ZW50KGV2ZW50IDogc3RyaW5nLCBkYXRhPyA6IGFueSkge1xyXG5cclxuXHRcdFx0ZXZlbnQgPSBldmVudCArIHRoaXMuaWQ7XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kZW1pdChldmVudCwgZGF0YSk7XHJcblx0XHRcdHRoaXMubG9nKGV2ZW50LCBkYXRhKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGxvZyhldmVudCA6IHN0cmluZywgZGF0YT8gOiBhbnkpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZGVidWcpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhldmVudCwgZGF0YSA/IGRhdGEgOiBudWxsKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgZWwoc2VsZWN0b3IpIDogYW55IHtcclxuXHJcblx0XHRcdHJldHVybiBhbmd1bGFyLmVsZW1lbnQoc2VsZWN0b3IpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBjYWxjdWxhdGluZyBlbGVtZW50IHJlYWwgd2lkdGhcclxuXHRcdHB1YmxpYyBnZXRSZWFsV2lkdGgoaXRlbSkge1xyXG5cclxuXHRcdFx0bGV0IHN0eWxlID0gaXRlbS5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUoaXRlbSksXHJcblx0XHRcdFx0d2lkdGggPSBpdGVtLm9mZnNldFdpZHRoLFxyXG5cdFx0XHRcdG1hcmdpbiA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpblJpZ2h0KSxcclxuXHRcdFx0XHQvL3BhZGRpbmcgPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdMZWZ0KSArIHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1JpZ2h0KSxcclxuXHRcdFx0XHRib3JkZXIgPSBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlckxlZnRXaWR0aCkgKyBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlclJpZ2h0V2lkdGgpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHdpZHRoICsgbWFyZ2luICsgYm9yZGVyO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBjYWxjdWxhdGluZyBlbGVtZW50IHJlYWwgaGVpZ2h0XHJcblx0XHRwdWJsaWMgZ2V0UmVhbEhlaWdodChpdGVtKSB7XHJcblxyXG5cdFx0XHRsZXQgc3R5bGUgPSBpdGVtLmN1cnJlbnRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShpdGVtKSxcclxuXHRcdFx0XHRoZWlnaHQgPSBpdGVtLm9mZnNldEhlaWdodCxcclxuXHRcdFx0XHRtYXJnaW4gPSBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpblRvcCkgKyBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkJvdHRvbSksXHJcblx0XHRcdFx0Ly9wYWRkaW5nID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0JvdHRvbSksXHJcblx0XHRcdFx0Ym9yZGVyID0gcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJUb3BXaWR0aCkgKyBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlckJvdHRvbVdpZHRoKTtcclxuXHJcblx0XHRcdHJldHVybiBoZWlnaHQgKyBtYXJnaW4gKyBib3JkZXI7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLnNlcnZpY2UoJ2FzZ1NlcnZpY2UnLCBbJyR0aW1lb3V0JywgJyRpbnRlcnZhbCcsICckbG9jYXRpb24nLCAnJHJvb3RTY29wZScsICckd2luZG93JywgU2VydmljZUNvbnRyb2xsZXJdKTtcclxuXHJcbn1cclxuXHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIFRodW1ibmFpbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZCA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRwdWJsaWMgaXRlbXMgOiBBcnJheTxJRmlsZT47XHJcblx0XHRwdWJsaWMgYmFzZVVybCA6IHN0cmluZztcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgPSAndGh1bWJuYWlsJztcclxuXHRcdHByaXZhdGUgdGVtcGxhdGUgPSAndmlld3MvYXNnLXRodW1ibmFpbC5odG1sJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSBtb2RhbCA9IGZhbHNlO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkZWxlbWVudCA6IG5nLklSb290RWxlbWVudFNlcnZpY2UpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHRcdC8vIGdldCBwYXJlbnQgYXNnIGNvbXBvbmVudCAobW9kYWwpXHJcblx0XHRcdGlmICh0aGlzLiRzY29wZSAmJiB0aGlzLiRzY29wZS4kcGFyZW50ICYmIHRoaXMuJHNjb3BlLiRwYXJlbnQuJHBhcmVudCAmJiB0aGlzLiRzY29wZS4kcGFyZW50LiRwYXJlbnQuJGN0cmwpIHtcclxuXHRcdFx0XHR0aGlzLm1vZGFsID0gdGhpcy4kc2NvcGUuJHBhcmVudC4kcGFyZW50LiRjdHJsLnR5cGUgPT0gJ21vZGFsJyA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXRTZWxlY3RlZChpbmRleCA6IG51bWJlciwgJGV2ZW50PyA6IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5tb2RhbCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLm1vZGFsT3BlbihpbmRleCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2suc2VsZWN0KSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHByZWxvZCB3aGVuIG1vdXNlb3ZlciBhbmQgc2V0IHNlbGVjdGVkIGlmIGVuYWJsZWRcclxuXHRcdHB1YmxpYyBob3ZlcihpbmRleCA6IG51bWJlciwgJGV2ZW50PyA6IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuaG92ZXIuc2VsZWN0ID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCB0aHVtYm5haWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNUaHVtYm5haWwge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMubW9kYWwgPyB0aGlzLmFzZy5vcHRpb25zWydtb2RhbCddW3RoaXMudHlwZV0gOiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aHVtYm5haWwgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zVGh1bWJuYWlsKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5tb2RhbCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbJ21vZGFsJ11bdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGFib3ZlIGZyb20gY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGR5bmFtaWMoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcuZHluYW1pYyA/ICdkeW5hbWljJyA6ICcnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgY2xhc3Nlc1xyXG5cdFx0cHVibGljIGdldCBjbGFzc2VzKCkgOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLmNsYXNzZXMgKyAnICcgKyB0aGlzLmR5bmFtaWM7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnVGh1bWJuYWlsJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsICckZWxlbWVudCcsIGFuZ3VsYXJTdXBlckdhbGxlcnkuVGh1bWJuYWlsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctdGh1bWJuYWlsIHt7ICRjdHJsLmNsYXNzZXMgfX1cIiBuZy1jbGljaz1cIiRjdHJsLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XCI+PGRpdiBuZy1pbmNsdWRlPVwiJGN0cmwudGVtcGxhdGVcIj48L2Rpdj48L2Rpdj4nLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAJyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR2aXNpYmxlOiAnPT8nLFxyXG5cdFx0XHR0ZW1wbGF0ZTogJ0A/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iXX0=

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/asg-control.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.autoPlayToggle()">\r\n\t<span ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t<span ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toFirst(true)">\r\n\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toBackward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toForward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n</button>\r\n\r\n');
$templateCache.put('views/asg-image.html','<div class="asg-image {{ $ctrl.asg.classes }}" ng-class="{\'modalon\' : $ctrl.modalAvailable }" ng-style="{\'min-height\' : $ctrl.config.heightMin + \'px\', \'height\' : $ctrl.height + \'px\'}">\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)">\r\n\r\n\t\t<div class="img" ng-repeat="(key,file) in $ctrl.asg.files" ng-show="$ctrl.asg.selected == key" ng-class="{\'loading\' : !file.loaded.image}">\r\n\r\n\t\t\t<div class="source {{ $ctrl.config.size }}" ng-style="{\'background-image\': \'url(\' + file.source.image + \')\'}" ng-if="file.loaded.image" ng-mouseover="$ctrl.asg.hoverPreload(key)" ng-click="$ctrl.modalOpen($event)"></div>\r\n\r\n\t\t</div>\r\n\t</div>\r\n\t<div class="arrows" ng-if="$ctrl.config.arrows" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.modalOpen($event)">\r\n\r\n\t\t<div ng-if="!$ctrl.asg.isSingle" class="toBackward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div ng-if="!$ctrl.asg.isSingle" class="toForward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t</div>\r\n\t<ng-transclude></ng-transclude>\r\n</div>\r\n\r\n\r\n\r\n');
$templateCache.put('views/asg-info.html','<div class="row">\r\n\r\n\t<div class="col-md-12">\r\n\t\t<h3>{{ $ctrl.file.title }}</h3>\r\n\t</div>\r\n\r\n\t<div class="col-md-12">\r\n\t\t{{ $ctrl.file.description }}\r\n\t\t<a target="_blank" href="{{ $ctrl.download }}"><span class="glyphicon glyphicon-download"></span></a>\r\n\t</div>\r\n\r\n</div>\r\n\r\n\r\n');
$templateCache.put('views/asg-modal.html','<script type="text/ng-template" id="help.html">\r\n\t<ul>\r\n\t\t<li>SPACE : forward</li>\r\n\t\t<li>RIGHT : forward</li>\r\n\t\t<li>LEFT : backward</li>\r\n\t\t<li>UP / HOME : first</li>\r\n\t\t<li>DOWN / END : last</li>\r\n\t\t<li>ENTER : toggle fullscreen</li>\r\n\t\t<li>ESC : exit</li>\r\n\t\t<li>p : play/pause</li>\r\n\t\t<li>t : change transition effect</li>\r\n\t\t<li>m : toggle menu</li>\r\n\t\t<li>s : toggle image size</li>\r\n\t\t<li>c : toggle caption</li>\r\n\t\t<li>h : toggle help</li>\r\n\t</ul>\r\n</script>\r\n\r\n<div class="asg-modal {{ $ctrl.asg.classes }}" ng-class="$ctrl.getClass()" ng-click="$ctrl.imageClick($event);" ng-show="$ctrl.asg.modalVisible" ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="frame" ng-click="$ctrl.asg.modalClick($event);">\r\n\r\n\t\t<div class="header" ng-click="$ctrl.asg.modalClick($event);">\r\n\r\n\t\t\t<span class="buttons visible-xs pull-right">\r\n\t\t\t\t <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs">\r\n\t\t\t\t\t\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n\t\t\t\t </button>\r\n\t\t\t</span>\r\n\r\n\t\t\t<span class="buttons hidden-xs pull-right">\r\n\r\n\t\t\t   <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.autoPlayToggle($event)">\r\n                    <span ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t\t\t\t   <span ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n                </button>\r\n\r\n                <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toFirst(true, $event)">\r\n                    {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n                </button>\r\n\r\n                <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toBackward(true, $event)">\r\n                    <span class="glyphicon glyphicon-chevron-left"></span>\r\n                </button>\r\n\r\n                <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toForward(true, $event)">\r\n                    <span class="glyphicon glyphicon-chevron-right"></span>\r\n                </button>\r\n\r\n             <span ng-if="!$ctrl.asg.isSingle && false" class="dropdown">\r\n                    <button class="btn btn-default btn-sm dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                        <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu pull-right">\r\n                        <li class="dropdown-submenu">\r\n                            <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" ng-click="$ctrl.setTransition(transition, $event)" ng-repeat="transition in $ctrl.asg.transitions">\r\n                                    <span ng-class="{\'highlight\' : transition == $ctrl.config.transition}">\r\n                                        {{ transition }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" ng-click="$ctrl.setTheme(theme, $event)" ng-repeat="theme in $ctrl.themes">\r\n                                    <span ng-class="{\'highlight\' : theme == $ctrl.asg.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                        <li><a href="#" tabindex="-1" ng-click="$ctrl.toggleHelp($event)">Help</a></li>\r\n                    </ul>\r\n                </span>\r\n\r\n\r\n                <button class="btn btn-default btn-sm" ng-click="$ctrl.toggleMenu($event)">\r\n                    <span ng-if="$ctrl.config.menu" class="glyphicon glyphicon-chevron-up"></span>\r\n                    <span ng-if="!$ctrl.config.menu" class="glyphicon glyphicon-chevron-down"></span>\r\n                </button>\r\n\r\n\t\t\t \t<button class="btn btn-default btn-sm btn-size" ng-click="$ctrl.toggleSize($event)">\r\n                    {{ $ctrl.config.size }}\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm hidden-xs btn-transitions" data-ng-if="!$ctrl.asg.isSingle" data-ng-click="$ctrl.nextTransition($event)">\r\n                    {{ $ctrl.config.transition }}\r\n                </button>\r\n\r\n\t\t\t\t<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toggleThumbnails($event)">\r\n\t\t\t\t   <span class="glyphicon glyphicon-option-horizontal"></span>\r\n\t\t\t    </button>\r\n\r\n                <button class="btn btn-default btn-sm" ng-click="$ctrl.toggleFullScreen($event)">\r\n                    <span class="glyphicon glyphicon-fullscreen"></span>\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleHelp($event)">\r\n                    <span class="glyphicon glyphicon-question-sign"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" ng-click="$ctrl.close($event)">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n\r\n            </span>\r\n\r\n\t\t\t<span ng-if="$ctrl.config.title">\r\n\t\t\t\t<span class="title">{{ $ctrl.config.title }}</span>\r\n\t\t\t\t<span class="subtitle hidden-xs" ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span>\r\n\t\t\t</span>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}" ng-style="{\'top\': $ctrl.marginTop + \'px\', \'bottom\': $ctrl.marginBottom + \'px\'}" ng-mouseover="$ctrl.asg.over.modalImage = true;" ng-mouseleave="$ctrl.asg.over.modalImage = false;">\r\n\r\n\t\t\t<div class="help text-right" ng-click="$ctrl.toggleHelp($event)" ng-show="$ctrl.config.help" ng-include src="\'help.html\'"></div>\r\n\r\n\t\t\t<div class="arrows" ng-if="$ctrl.config.arrows" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.imageClick($event)">\r\n\r\n\t\t\t\t<div ng-if="!$ctrl.asg.isSingle" class="toBackward">\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<div ng-if="!$ctrl.asg.isSingle" class="toForward">\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t</div>\r\n\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class="img" ng-repeat="(key,file) in $ctrl.asg.files" ng-show="$ctrl.asg.selected == key" ng-class="{\'loading\' : !file.loaded.modal}">\r\n\r\n\t\t\t\t<div class="source {{ $ctrl.config.size }}" ng-style="{\'background-image\': \'url(\' + file.source.modal + \')\'}" ng-if="file.loaded.modal"></div>\r\n\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class="caption {{ $ctrl.config.caption.position }}" ng-class="{\'visible\' : $ctrl.config.caption.visible}">\r\n\t\t\t\t<div class="content">\r\n\t\t\t\t\t<span class="title">{{ $ctrl.asg.file.title }}</span>\r\n\t\t\t\t\t<span ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description"> - </span>\r\n\t\t\t\t\t<span class="description">{{ $ctrl.asg.file.description }}</span>\r\n\t\t\t\t\t<a href="{{ $ctrl.asg.downloadLink() }}" target="_blank" class="btn btn-default btn-xs">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-download"></span> Download\r\n\t\t\t\t\t</a>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\r\n\t\t</div>\r\n\r\n\t\t<ng-transclude></ng-transclude>\r\n\r\n\t</div>\r\n\r\n</div>');
$templateCache.put('views/asg-panel.html','<div class="items">\r\n\t<div class="item {{ $ctrl.asg.options.panel.item.class }}" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files" ng-class="{\'selected\' : $ctrl.asg.selected == key}">\r\n\r\n\t\t<img ng-src="{{ file.source.panel }}" ng-click="$ctrl.setSelected(key, $event)" alt="{{ file.title }}">\r\n\r\n\t\t<span class="index" ng-if="$ctrl.config.item.index">{{ key + 1 }}</span>\r\n\r\n\t\t<div class="caption" ng-if="$ctrl.config.item.caption">\r\n\t\t\t<span>{{ file.title }}</span>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n');
$templateCache.put('views/asg-thumbnail.html','<div class="items">\r\n\t<div class="item" ng-click="$ctrl.setSelected(key, $event)" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files" ng-class="{\'selected\' : $ctrl.asg.selected == key}">\r\n\r\n\t\t<img ng-src="{{ file.source.panel }}" ng-style="{\'height\': $ctrl.config.height + \'px\'}" alt="{{ file.title }}">\r\n\r\n\t\t<span class="index" ng-if="$ctrl.config.index">{{ key + 1 }}</span>\r\n\r\n\t</div>\r\n</div>\r\n');}]);