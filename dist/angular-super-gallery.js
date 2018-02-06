/**
 * angular-super-gallery - AngularJS Super Gallery
 * 
 * @version v1.1.5
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
            if (this.config.header.dynamic) {
                ngClass.push('dynamic');
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
            if (this.$window.screenfull) {
                this.$window.screenfull.exit();
            }
        };
        ModalController.prototype.imageClick = function ($event) {
            this.asg.modalClick($event);
            if (this.config.click.close) {
                this.asg.modalClose();
                if (this.$window.screenfull) {
                    this.$window.screenfull.exit();
                }
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
            if (this.$window.screenfull) {
                this.$window.screenfull.toggle();
            }
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
            this.config.header.dynamic = !this.config.header.dynamic;
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
                    header: {
                        enabled: true,
                        dynamic: false
                    },
                    help: false,
                    arrows: true,
                    click: {
                        close: true
                    },
                    thumbnail: {
                        height: 50,
                        index: false,
                        enabled: true,
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
            return 'hash' + code.toString(21);
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
                var body = document.body;
                var className = ' asg-yhidden';
                if (value) {
                    this.preload(1);
                    this.modalInit();
                    if (body.className.indexOf(className) < 0) {
                        body.className = body.className + className;
                    }
                }
                else {
                    body.className = body.className.replace(className, '');
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
            var self = this;
            this.timeout(function () {
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
                var containers = _this.el('div.asg-thumbnail.' + _this.id);
                if (!containers.length) {
                    return;
                }
                for (var i = 0; i < containers.length; i++) {
                    var container = containers[i];
                    if (container.offsetWidth) {
                        var items = container.querySelector('div.items');
                        var item = container.querySelector('div.item');
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
                var element = this.el('div.asg-modal.' + this.id + ' .keyInput')[0];
                if (element) {
                    angular.element(element)[0].focus();
                }
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
            return document.querySelectorAll(selector);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzZy50cyIsImFzZy1jb250cm9sLnRzIiwiYXNnLWltYWdlLnRzIiwiYXNnLWluZm8udHMiLCJhc2ctbW9kYWwudHMiLCJhc2ctcGFuZWwudHMiLCJhc2ctc2VydmljZS50cyIsImFzZy10aHVtYm5haWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBVSxtQkFBbUIsQ0EyQjVCO0FBM0JELFdBQVUsbUJBQW1CO0lBRTVCLElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFdkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDdEIsTUFBTSxDQUFDLFVBQVUsS0FBVyxFQUFFLFNBQWtCO1lBRS9DLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDWCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDWixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsU0FBUyxHQUFHLENBQUMsQ0FBQztZQUNmLENBQUM7WUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELE1BQU0sQ0FB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QUM7Z0JBQ1IsQ0FBQztnQkFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFFdkIsQ0FBQzs7O1dBQUE7UUFjRCxzQkFBVyx3Q0FBTztpQkFBbEI7Z0JBRUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUU3QyxDQUFDOzs7V0FBQTtRQUdELHNCQUFXLHdDQUFPO2lCQUFsQjtnQkFFQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFFOUMsQ0FBQzs7O1dBQUE7UUFFRiwwQkFBQztJQUFELENBL0dBLEFBK0dDLElBQUE7SUEvR1ksdUNBQW1CLHNCQStHL0IsQ0FBQTtJQUVELElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFFN0QsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUU7UUFDN0IsVUFBVSxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsbUJBQW1CLENBQUMsbUJBQW1CLENBQUM7UUFDekYsUUFBUSxFQUFFLHVJQUF1STtRQUNqSixRQUFRLEVBQUU7WUFDVCxFQUFFLEVBQUUsR0FBRztZQUNQLEtBQUssRUFBRSxJQUFJO1lBQ1gsT0FBTyxFQUFFLElBQUk7WUFDYixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUUsSUFBSTtTQUNiO0tBQ0QsQ0FBQyxDQUFDO0FBRUosQ0FBQyxFQW5JUyxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBbUk1QiIsImZpbGUiOiJhbmd1bGFyLXN1cGVyLWdhbGxlcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5uYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknLCBbJ25nQW5pbWF0ZScsICduZ1RvdWNoJ10pO1xyXG5cclxuXHRhcHAuZmlsdGVyKCdhc2dCeXRlcycsICgpID0+IHtcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoYnl0ZXMgOiBhbnksIHByZWNpc2lvbiA6IG51bWJlcikgOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0aWYgKGlzTmFOKHBhcnNlRmxvYXQoYnl0ZXMpKSB8fCAhaXNGaW5pdGUoYnl0ZXMpKSB7XHJcblx0XHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoYnl0ZXMgPT09IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gJzAnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodHlwZW9mIHByZWNpc2lvbiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRwcmVjaXNpb24gPSAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgdW5pdHMgPSBbJ2J5dGVzJywgJ2tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJ10sXHJcblx0XHRcdFx0bnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZygxMDI0KSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gKGJ5dGVzIC8gTWF0aC5wb3coMTAyNCwgTWF0aC5mbG9vcihudW1iZXIpKSkudG9GaXhlZChwcmVjaXNpb24pICsgJyAnICsgdW5pdHNbbnVtYmVyXTtcclxuXHJcblx0XHR9O1xyXG5cdH0pO1xyXG5cclxufVxyXG5cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgQ29udHJvbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZCA6IHN0cmluZztcclxuXHRcdHByaXZhdGUgdHlwZSA9ICdjb250cm9sJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZSA9ICd2aWV3cy9hc2ctY29udHJvbC5odG1sJztcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdFx0XHRwcml2YXRlICRzY29wZSA6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdFx0dGhpcy4kc2NvcGUuZm9yd2FyZCA9ICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQodHJ1ZSk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR0aGlzLiRzY29wZS5iYWNrd2FyZCA9ICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IGltYWdlIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKSA6IElPcHRpb25zSW1hZ2Uge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IGltYWdlIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc0ltYWdlKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dDb250cm9sJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuQ29udHJvbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYXNnLWNvbnRyb2wge3sgJGN0cmwuYXNnLmNsYXNzZXMgfX1cIj48ZGl2IG5nLWluY2x1ZGU9XCIkY3RybC50ZW1wbGF0ZVwiPjwvZGl2PjwvZGl2PicsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIEltYWdlQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHRcdHB1YmxpYyBiYXNlVXJsIDogc3RyaW5nO1xyXG5cclxuXHRcdHByaXZhdGUgdHlwZSA9ICdpbWFnZSc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdFx0XHRwcml2YXRlICRyb290U2NvcGUgOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJGVsZW1lbnQgOiBuZy5JUm9vdEVsZW1lbnRTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkd2luZG93IDogbmcuSVdpbmRvd1NlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICRzY29wZSA6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdFx0YW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoJ3Jlc2l6ZScsIChldmVudCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMub25SZXNpemUoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgb25SZXNpemUoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuaGVpZ2h0QXV0by5vbnJlc2l6ZSkge1xyXG5cdFx0XHRcdHRoaXMuc2V0SGVpZ2h0KHRoaXMuYXNnLmZpbGUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0XHQvLyBzZXQgaW1hZ2UgY29tcG9uZW50IGhlaWdodFxyXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJG9uKHRoaXMuYXNnLmV2ZW50cy5GSVJTVF9JTUFHRSArIHRoaXMuaWQsIChldmVudCwgZGF0YSkgPT4ge1xyXG5cclxuXHRcdFx0XHRpZiAoIXRoaXMuY29uZmlnLmhlaWdodCAmJiB0aGlzLmNvbmZpZy5oZWlnaHRBdXRvLmluaXRpYWwgPT09IHRydWUpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0SGVpZ2h0KGRhdGEuaW1nKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuYXNnLnRodW1ibmFpbHNNb3ZlKDIwMCk7XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IGltYWdlIGNvbXBvbmVudCBoZWlnaHRcclxuXHRcdHByaXZhdGUgc2V0SGVpZ2h0KGltZykge1xyXG5cclxuXHRcdFx0bGV0IHdpZHRoID0gdGhpcy4kZWxlbWVudC5jaGlsZHJlbignZGl2JylbMF0uY2xpZW50V2lkdGg7XHJcblx0XHRcdGxldCByYXRpbyA9IGltZy53aWR0aCAvIGltZy5oZWlnaHQ7XHJcblx0XHRcdHRoaXMuY29uZmlnLmhlaWdodCA9IHdpZHRoIC8gcmF0aW87XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGhlaWdodFxyXG5cdFx0cHVibGljIGdldCBoZWlnaHQoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcuaGVpZ2h0O1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IGltYWdlIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKSA6IElPcHRpb25zSW1hZ2Uge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IGltYWdlIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc0ltYWdlKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvQmFja3dhcmQoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKCRldmVudCkge1xyXG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvRm9yd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHRpZiAoJGV2ZW50KSB7XHJcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gbW9kYWwgYXZhaWxhYmxlXHJcblx0XHRwdWJsaWMgZ2V0IG1vZGFsQXZhaWxhYmxlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm1vZGFsQXZhaWxhYmxlICYmIHRoaXMuY29uZmlnLmNsaWNrLm1vZGFsO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBvcGVuIHRoZSBtb2RhbFxyXG5cdFx0cHVibGljIG1vZGFsT3BlbigkZXZlbnQgOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHRpZiAoJGV2ZW50KSB7XHJcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLm1vZGFsKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxPcGVuKHRoaXMuYXNnLnNlbGVjdGVkKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0ltYWdlJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnJGVsZW1lbnQnLCAnJHdpbmRvdycsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LkltYWdlQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FzZy1pbWFnZS5odG1sJyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHRiYXNlVXJsOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBJbmZvQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ2luZm8nO1xyXG5cdFx0cHJpdmF0ZSBhc2cgOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlID0gJ3ZpZXdzL2FzZy1pbmZvLmh0bWwnO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLmZpbGU7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dJbmZvJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuSW5mb0NvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYXNnLWluZm8ge3sgJGN0cmwuYXNnLmNsYXNzZXMgfX1cIj48ZGl2IG5nLWluY2x1ZGU9XCIkY3RybC50ZW1wbGF0ZVwiPjwvZGl2PjwvZGl2PicsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIE1vZGFsQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHRcdHB1YmxpYyBiYXNlVXJsIDogc3RyaW5nO1xyXG5cclxuXHRcdHByaXZhdGUgdHlwZSA9ICdtb2RhbCc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgYXJyb3dzVmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHdpbmRvdyA6IG5nLklXaW5kb3dTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkc2NvcGUgOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQXZhaWxhYmxlID0gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgZ2V0Q2xhc3MoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuY29uZmlnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgbmdDbGFzcyA9IFtdO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhlYWRlci5keW5hbWljKSB7XHJcblx0XHRcdFx0bmdDbGFzcy5wdXNoKCdkeW5hbWljJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5nQ2xhc3MucHVzaCh0aGlzLmFzZy5vcHRpb25zLnRoZW1lKTtcclxuXHJcblx0XHRcdHJldHVybiBuZ0NsYXNzLmpvaW4oJyAnKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGFjdGlvbiBmcm9tIGtleWNvZGVzXHJcblx0XHRwcml2YXRlIGdldEFjdGlvbkJ5S2V5Q29kZShrZXlDb2RlIDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmtleWNvZGVzKTtcclxuXHRcdFx0bGV0IGFjdGlvbjtcclxuXHJcblx0XHRcdGZvciAobGV0IGtleSBpbiBrZXlzKSB7XHJcblxyXG5cdFx0XHRcdGxldCBjb2RlcyA9IHRoaXMuY29uZmlnLmtleWNvZGVzW2tleXNba2V5XV07XHJcblxyXG5cdFx0XHRcdGlmICghY29kZXMpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGluZGV4ID0gY29kZXMuaW5kZXhPZihrZXlDb2RlKTtcclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcclxuXHRcdFx0XHRcdGFjdGlvbiA9IGtleXNba2V5XTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBhY3Rpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgY2xvc2UoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbG9zZSgpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsKSB7XHJcblx0XHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwuZXhpdCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBpbWFnZUNsaWNrKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2suY2xvc2UpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbENsb3NlKCk7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwuZXhpdCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc2V0Rm9jdXMoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5VG9nZ2xlKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLmF1dG9QbGF5VG9nZ2xlKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0ZpcnN0KHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cudG9GaXJzdCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9CYWNrd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0ZvcndhcmQoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0xhc3Qoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy50b0xhc3Qoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGRvIGtleWJvYXJkIGFjdGlvblxyXG5cdFx0cHVibGljIGtleVVwKGUgOiBLZXlib2FyZEV2ZW50KSB7XHJcblxyXG5cdFx0XHRsZXQgYWN0aW9uIDogc3RyaW5nID0gdGhpcy5nZXRBY3Rpb25CeUtleUNvZGUoZS5rZXlDb2RlKTtcclxuXHJcblx0XHRcdHN3aXRjaCAoYWN0aW9uKSB7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2V4aXQnOlxyXG5cdFx0XHRcdFx0dGhpcy5jbG9zZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3BsYXlwYXVzZSc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy5hdXRvUGxheVRvZ2dsZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2ZvcndhcmQnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2JhY2t3YXJkJzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnZmlyc3QnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9GaXJzdCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdsYXN0JzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvTGFzdCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdmdWxsc2NyZWVuJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlRnVsbFNjcmVlbigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ21lbnUnOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNZW51KCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnY2FwdGlvbic6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUNhcHRpb24oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdoZWxwJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlSGVscCgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3NpemUnOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVTaXplKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAndHJhbnNpdGlvbic6XHJcblx0XHRcdFx0XHR0aGlzLm5leHRUcmFuc2l0aW9uKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLmxvZygndW5rbm93biBrZXlib2FyZCBhY3Rpb246ICcgKyBlLmtleUNvZGUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBzd2l0Y2ggdG8gbmV4dCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHJpdmF0ZSBuZXh0VHJhbnNpdGlvbigkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHRsZXQgaWR4ID0gdGhpcy5hc2cudHJhbnNpdGlvbnMuaW5kZXhPZih0aGlzLmNvbmZpZy50cmFuc2l0aW9uKSArIDE7XHJcblx0XHRcdGxldCBuZXh0ID0gaWR4ID49IHRoaXMuYXNnLnRyYW5zaXRpb25zLmxlbmd0aCA/IDAgOiBpZHg7XHJcblx0XHRcdHRoaXMuY29uZmlnLnRyYW5zaXRpb24gPSB0aGlzLmFzZy50cmFuc2l0aW9uc1tuZXh0XTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHRvZ2dsZSBmdWxsc2NyZWVuXHJcblx0XHRwcml2YXRlIHRvZ2dsZUZ1bGxTY3JlZW4oJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHRcdGlmICh0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbCkge1xyXG5cdFx0XHRcdHRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsLnRvZ2dsZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSB0aHVtYm5haWxzXHJcblx0XHRwcml2YXRlIHRvZ2dsZVRodW1ibmFpbHMoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcudGh1bWJuYWlsLmR5bmFtaWMgPSAhdGhpcy5jb25maWcudGh1bWJuYWlsLmR5bmFtaWM7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHVibGljIHNldFRyYW5zaXRpb24odHJhbnNpdGlvbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGVtZVxyXG5cdFx0cHVibGljIHNldFRoZW1lKHRoZW1lIDogc3RyaW5nLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zLnRoZW1lID0gdGhlbWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBoZWxwXHJcblx0XHRwcml2YXRlIHRvZ2dsZUhlbHAoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcuaGVscCA9ICF0aGlzLmNvbmZpZy5oZWxwO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgc2l6ZVxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVTaXplKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdGxldCBpbmRleCA9IHRoaXMuYXNnLnNpemVzLmluZGV4T2YodGhpcy5jb25maWcuc2l6ZSk7XHJcblx0XHRcdGluZGV4ID0gKGluZGV4ICsgMSkgPj0gdGhpcy5hc2cuc2l6ZXMubGVuZ3RoID8gMCA6ICsraW5kZXg7XHJcblx0XHRcdHRoaXMuY29uZmlnLnNpemUgPSB0aGlzLmFzZy5zaXplc1tpbmRleF07XHJcblx0XHRcdHRoaXMuYXNnLmxvZygndG9nZ2xlIGltYWdlIHNpemU6JywgW3RoaXMuY29uZmlnLnNpemUsIGluZGV4XSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBtZW51XHJcblx0XHRwcml2YXRlIHRvZ2dsZU1lbnUoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcuaGVhZGVyLmR5bmFtaWMgPSAhdGhpcy5jb25maWcuaGVhZGVyLmR5bmFtaWM7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBjYXB0aW9uXHJcblx0XHRwcml2YXRlIHRvZ2dsZUNhcHRpb24oKSB7XHJcblxyXG5cdFx0XHR0aGlzLmNvbmZpZy5jYXB0aW9uLnZpc2libGUgPSAhdGhpcy5jb25maWcuY2FwdGlvbi52aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbWFyZ2ludCB0b3BcclxuXHRcdHB1YmxpYyBnZXQgbWFyZ2luVG9wKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLm1hcmdpblRvcDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1hcmdpbiBib3R0b21cclxuXHRcdHB1YmxpYyBnZXQgbWFyZ2luQm90dG9tKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLm1hcmdpbkJvdHRvbTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1vZGFsIHZpc2libGVcclxuXHRcdHB1YmxpYyBnZXQgdmlzaWJsZSgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5tb2RhbFZpc2libGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBtb2RhbCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgc2V0IHZpc2libGUodmFsdWUgOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbFZpc2libGUgPSB2YWx1ZTtcclxuXHRcdFx0dGhpcy5hc2cuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtb2RhbCBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc01vZGFsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBtb2RhbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNNb2RhbCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ01vZGFsJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyR3aW5kb3cnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5Nb2RhbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9hc2ctbW9kYWwuaHRtbCcsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dmlzaWJsZTogJz0/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBQYW5lbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZCA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRwdWJsaWMgaXRlbXMgOiBBcnJheTxJRmlsZT47XHJcblx0XHRwdWJsaWMgYmFzZVVybCA6IHN0cmluZztcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgPSAncGFuZWwnO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZSA9ICd2aWV3cy9hc2ctcGFuZWwuaHRtbCc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdFx0XHRwcml2YXRlICRzY29wZSA6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXRTZWxlY3RlZChpbmRleCA6IG51bWJlciwgJGV2ZW50PyA6IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5tb2RhbCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLm1vZGFsT3BlbihpbmRleCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2suc2VsZWN0KSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBob3ZlcihpbmRleCA6IG51bWJlciwgJGV2ZW50PyA6IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuaG92ZXIuc2VsZWN0ID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBwYW5lbCBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc1BhbmVsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBwYW5lbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNQYW5lbCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dQYW5lbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LlBhbmVsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctcGFuZWwge3sgJGN0cmwuYXNnLmNsYXNzZXMgfX1cIiBuZy1tb3VzZW92ZXI9XCIkY3RybC5hc2cub3Zlci5wYW5lbCA9IHRydWU7XCIgbmctbW91c2VsZWF2ZT1cIiRjdHJsLmFzZy5vdmVyLnBhbmVsID0gZmFsc2U7XCIgbmctc2hvdz1cIiRjdHJsLmNvbmZpZy52aXNpYmxlXCI+PGRpdiBuZy1pbmNsdWRlPVwiJGN0cmwudGVtcGxhdGVcIj48L2Rpdj48bmctdHJhbnNjbHVkZT48L25nLXRyYW5zY2x1ZGU+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0AnLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nLFxyXG5cdFx0XHRiYXNlVXJsOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0Ly8gbW9kYWwgY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zTW9kYWwge1xyXG5cclxuXHRcdGhlYWRlcj8gOiB7XHJcblx0XHRcdGVuYWJsZWQ/IDogYm9vbGVhbjtcclxuXHRcdFx0ZHluYW1pYz8gOiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHRcdGhlbHA/IDogYm9vbGVhbjtcclxuXHRcdGNhcHRpb24/IDoge1xyXG5cdFx0XHR2aXNpYmxlPyA6IGJvb2xlYW47XHJcblx0XHRcdHBvc2l0aW9uPyA6IHN0cmluZztcclxuXHRcdH07XHJcblx0XHR0cmFuc2l0aW9uPyA6IHN0cmluZztcclxuXHRcdHRpdGxlPyA6IHN0cmluZztcclxuXHRcdHN1YnRpdGxlPyA6IHN0cmluZztcclxuXHRcdGFycm93cz8gOiBib29sZWFuO1xyXG5cdFx0c2l6ZT8gOiBzdHJpbmc7XHJcblx0XHR0aHVtYm5haWw/IDogSU9wdGlvbnNUaHVtYm5haWw7XHJcblx0XHRtYXJnaW5Ub3A/IDogbnVtYmVyO1xyXG5cdFx0bWFyZ2luQm90dG9tPyA6IG51bWJlcjtcclxuXHRcdGNsaWNrPyA6IHtcclxuXHRcdFx0Y2xvc2UgOiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHRcdGtleWNvZGVzPyA6IHtcclxuXHRcdFx0ZXhpdD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRwbGF5cGF1c2U/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0Zm9yd2FyZD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRiYWNrd2FyZD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRmaXJzdD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRsYXN0PyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGZ1bGxzY3JlZW4/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0bWVudT8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRjYXB0aW9uPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGhlbHA/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0c2l6ZT8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHR0cmFuc2l0aW9uPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Ly8gcGFuZWwgY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zUGFuZWwge1xyXG5cclxuXHRcdHZpc2libGU/IDogYm9vbGVhbjtcclxuXHRcdGl0ZW0/IDoge1xyXG5cdFx0XHRjbGFzcz8gOiBzdHJpbmc7XHJcblx0XHRcdGNhcHRpb24gOiBib29sZWFuO1xyXG5cdFx0XHRpbmRleCA6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0aG92ZXI/IDoge1xyXG5cdFx0XHRzZWxlY3QgOiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHRcdGNsaWNrPyA6IHtcclxuXHRcdFx0c2VsZWN0IDogYm9vbGVhbjtcclxuXHRcdFx0bW9kYWwgOiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHQvLyB0aHVtYm5haWwgY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zVGh1bWJuYWlsIHtcclxuXHJcblx0XHRoZWlnaHQ/IDogbnVtYmVyLFxyXG5cdFx0aW5kZXg/IDogYm9vbGVhbjtcclxuXHRcdGVuYWJsZWQ/IDogYm9vbGVhbjtcclxuXHRcdGR5bmFtaWM/IDogYm9vbGVhbjtcclxuXHRcdGNsaWNrPyA6IHtcclxuXHRcdFx0c2VsZWN0IDogYm9vbGVhbjtcclxuXHRcdFx0bW9kYWwgOiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHRcdGhvdmVyPyA6IHtcclxuXHRcdFx0c2VsZWN0IDogYm9vbGVhbjtcclxuXHRcdH07XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gaW5mbyBjb21wb25lbnQgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNJbmZvIHtcclxuXHJcblx0fVxyXG5cclxuXHQvLyBpbWFnZSBjb21wb25lbnQgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0dHJhbnNpdGlvbj8gOiBzdHJpbmc7XHJcblx0XHRzaXplPyA6IHN0cmluZztcclxuXHRcdGFycm93cz8gOiBib29sZWFuO1xyXG5cdFx0Y2xpY2s/IDoge1xyXG5cdFx0XHRtb2RhbCA6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0aGVpZ2h0PyA6IG51bWJlcjtcclxuXHRcdGhlaWdodE1pbj8gOiBudW1iZXI7XHJcblx0XHRoZWlnaHRBdXRvPyA6IHtcclxuXHRcdFx0aW5pdGlhbD8gOiBib29sZWFuO1xyXG5cdFx0XHRvbnJlc2l6ZT8gOiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHQvLyBnYWxsZXJ5IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zIHtcclxuXHJcblx0XHRkZWJ1Zz8gOiBib29sZWFuO1xyXG5cdFx0YmFzZVVybD8gOiBzdHJpbmc7XHJcblx0XHRmaWVsZHM/IDoge1xyXG5cdFx0XHRzb3VyY2U/IDoge1xyXG5cdFx0XHRcdG1vZGFsPyA6IHN0cmluZztcclxuXHRcdFx0XHRwYW5lbD8gOiBzdHJpbmc7XHJcblx0XHRcdFx0aW1hZ2U/IDogc3RyaW5nO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRpdGxlPyA6IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb24/IDogc3RyaW5nO1xyXG5cdFx0XHR0aHVtYm5haWw/IDogc3RyaW5nO1xyXG5cdFx0fTtcclxuXHRcdGF1dG9wbGF5PyA6IHtcclxuXHRcdFx0ZW5hYmxlZD8gOiBib29sZWFuO1xyXG5cdFx0XHRkZWxheT8gOiBudW1iZXI7XHJcblx0XHR9O1xyXG5cdFx0dGhlbWU/IDogc3RyaW5nO1xyXG5cdFx0cHJlbG9hZERlbGF5PyA6IG51bWJlcjtcclxuXHRcdHByZWxvYWQ/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdG1vZGFsPyA6IElPcHRpb25zTW9kYWw7XHJcblx0XHRwYW5lbD8gOiBJT3B0aW9uc1BhbmVsO1xyXG5cdFx0aW1hZ2U/IDogSU9wdGlvbnNJbWFnZTtcclxuXHRcdHRodW1ibmFpbD8gOiBJT3B0aW9uc1RodW1ibmFpbDtcclxuXHJcblx0fVxyXG5cclxuXHQvLyBpbWFnZSBzb3VyY2VcclxuXHRleHBvcnQgaW50ZXJmYWNlIElTb3VyY2Uge1xyXG5cclxuXHRcdG1vZGFsIDogc3RyaW5nOyAvLyBvcmlnaW5hbCwgcmVxdWlyZWRcclxuXHRcdHBhbmVsPyA6IHN0cmluZztcclxuXHRcdGltYWdlPyA6IHN0cmluZztcclxuXHJcblx0fVxyXG5cclxuXHQvLyBpbWFnZSBmaWxlXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJRmlsZSB7XHJcblxyXG5cdFx0c291cmNlIDogSVNvdXJjZTtcclxuXHRcdHRpdGxlPyA6IHN0cmluZztcclxuXHRcdG5hbWU/IDogc3RyaW5nO1xyXG5cdFx0ZXh0ZW5zaW9uPyA6IHN0cmluZztcclxuXHRcdGRlc2NyaXB0aW9uPyA6IHN0cmluZztcclxuXHRcdGRvd25sb2FkPyA6IHN0cmluZztcclxuXHRcdGxvYWRlZD8gOiB7XHJcblx0XHRcdG1vZGFsPyA6IGJvb2xlYW47XHJcblx0XHRcdHBhbmVsPyA6IGJvb2xlYW47XHJcblx0XHRcdGltYWdlPyA6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0d2lkdGg/IDogbnVtYmVyO1xyXG5cdFx0aGVpZ2h0PyA6IG51bWJlcjtcclxuXHJcblx0fVxyXG5cclxuXHRleHBvcnQgaW50ZXJmYWNlIElPdmVyIHtcclxuXHRcdG1vZGFsSW1hZ2UgOiBib29sZWFuO1xyXG5cdFx0cGFuZWwgOiBib29sZWFuO1xyXG5cdH1cclxuXHJcblx0Ly8gc2VydmljZSBjb250cm9sbGVyIGludGVyZmFjZVxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVNlcnZpY2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRtb2RhbFZpc2libGUgOiBib29sZWFuO1xyXG5cdFx0cGFuZWxWaXNpYmxlIDogYm9vbGVhbjtcclxuXHRcdG1vZGFsQXZhaWxhYmxlIDogYm9vbGVhbjtcclxuXHRcdHRyYW5zaXRpb25zIDogQXJyYXk8c3RyaW5nPjtcclxuXHRcdHRoZW1lcyA6IEFycmF5PHN0cmluZz47XHJcblx0XHRjbGFzc2VzIDogc3RyaW5nO1xyXG5cdFx0b3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0aXRlbXMgOiBBcnJheTxJRmlsZT47XHJcblx0XHRzZWxlY3RlZCA6IG51bWJlcjtcclxuXHRcdGZpbGUgOiBJRmlsZTtcclxuXHRcdHNpemVzIDogQXJyYXk8c3RyaW5nPjtcclxuXHRcdGlkIDogc3RyaW5nO1xyXG5cdFx0ZXZlbnRzIDoge1xyXG5cdFx0XHRDT05GSUdfTE9BRCA6IHN0cmluZztcclxuXHRcdFx0QVVUT1BMQVlfU1RBUlQgOiBzdHJpbmc7XHJcblx0XHRcdEFVVE9QTEFZX1NUT1AgOiBzdHJpbmc7XHJcblx0XHRcdFBBUlNFX0lNQUdFUyA6IHN0cmluZztcclxuXHRcdFx0TE9BRF9JTUFHRSA6IHN0cmluZztcclxuXHRcdFx0RklSU1RfSU1BR0UgOiBzdHJpbmc7XHJcblx0XHRcdENIQU5HRV9JTUFHRSA6IHN0cmluZztcclxuXHRcdFx0TU9EQUxfT1BFTiA6IHN0cmluZztcclxuXHRcdFx0TU9EQUxfQ0xPU0UgOiBzdHJpbmc7XHJcblx0XHR9O1xyXG5cclxuXHRcdGdldEluc3RhbmNlKGNvbXBvbmVudCA6IGFueSkgOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblxyXG5cdFx0c2V0RGVmYXVsdHMoKSA6IHZvaWQ7XHJcblxyXG5cdFx0c2V0T3B0aW9ucyhvcHRpb25zIDogSU9wdGlvbnMpIDogSU9wdGlvbnM7XHJcblxyXG5cdFx0c2V0SXRlbXMoaXRlbXMgOiBBcnJheTxJRmlsZT4pIDogdm9pZDtcclxuXHJcblx0XHRwcmVsb2FkKHdhaXQ/IDogbnVtYmVyKSA6IHZvaWQ7XHJcblxyXG5cdFx0bm9ybWFsaXplKGluZGV4IDogbnVtYmVyKSA6IG51bWJlcjtcclxuXHJcblx0XHRzZXRGb2N1cygpIDogdm9pZDtcclxuXHJcblx0XHRzZXRTZWxlY3RlZChpbmRleCA6IG51bWJlcik7XHJcblxyXG5cdFx0bW9kYWxPcGVuKGluZGV4IDogbnVtYmVyKSA6IHZvaWQ7XHJcblxyXG5cdFx0bW9kYWxDbG9zZSgpIDogdm9pZDtcclxuXHJcblx0XHRtb2RhbENsaWNrKCRldmVudD8gOiBVSUV2ZW50KSA6IHZvaWQ7XHJcblxyXG5cdFx0dGh1bWJuYWlsc01vdmUoZGVsYXk/IDogbnVtYmVyKSA6IHZvaWQ7XHJcblxyXG5cdFx0dG9CYWNrd2FyZChzdG9wPyA6IGJvb2xlYW4pIDogdm9pZDtcclxuXHJcblx0XHR0b0ZvcndhcmQoc3RvcD8gOiBib29sZWFuKSA6IHZvaWQ7XHJcblxyXG5cdFx0dG9GaXJzdChzdG9wPyA6IGJvb2xlYW4pIDogdm9pZDtcclxuXHJcblx0XHR0b0xhc3Qoc3RvcD8gOiBib29sZWFuKSA6IHZvaWQ7XHJcblxyXG5cdFx0bG9hZEltYWdlKGluZGV4PyA6IG51bWJlcikgOiB2b2lkO1xyXG5cclxuXHRcdGxvYWRJbWFnZXMoaW5kZXhlcyA6IEFycmF5PG51bWJlcj4pIDogdm9pZDtcclxuXHJcblx0XHRob3ZlclByZWxvYWQoaW5kZXggOiBudW1iZXIpIDogdm9pZDtcclxuXHJcblx0XHRhdXRvUGxheVRvZ2dsZSgpIDogdm9pZDtcclxuXHJcblx0XHR0b2dnbGUoZWxlbWVudCA6IHN0cmluZykgOiB2b2lkO1xyXG5cclxuXHRcdHNldEhhc2goKSA6IHZvaWQ7XHJcblxyXG5cdFx0ZG93bmxvYWRMaW5rKCkgOiBzdHJpbmc7XHJcblxyXG5cdFx0ZWwoc2VsZWN0b3IpIDogTm9kZUxpc3Q7XHJcblxyXG5cdFx0bG9nKGV2ZW50IDogc3RyaW5nLCBkYXRhPyA6IGFueSkgOiB2b2lkO1xyXG5cclxuXHJcblx0fVxyXG5cclxuXHQvLyBzZXJ2aWNlIGNvbnRyb2xsZXJcclxuXHRleHBvcnQgY2xhc3MgU2VydmljZUNvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBzbHVnID0gJ2FzZyc7XHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgaXRlbXMgOiBhbnk7XHJcblx0XHRwdWJsaWMgZmlsZXMgOiBBcnJheTxJRmlsZT4gPSBbXTtcclxuXHRcdHB1YmxpYyBkaXJlY3Rpb24gOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgbW9kYWxBdmFpbGFibGUgPSBmYWxzZTtcclxuXHJcblx0XHRwcml2YXRlIGluc3RhbmNlcyA6IHt9ID0ge307XHJcblx0XHRwcml2YXRlIF9zZWxlY3RlZCA6IG51bWJlcjtcclxuXHRcdHByaXZhdGUgX3Zpc2libGUgPSBmYWxzZTtcclxuXHRcdHByaXZhdGUgYXV0b3BsYXkgOiBhbmd1bGFyLklQcm9taXNlPGFueT47XHJcblx0XHRwcml2YXRlIGZpcnN0ID0gZmFsc2U7XHJcblxyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucyA9IG51bGw7XHJcblx0XHRwdWJsaWMgb3B0aW9uc0xvYWRlZCA9IGZhbHNlO1xyXG5cdFx0cHVibGljIGRlZmF1bHRzIDogSU9wdGlvbnMgPSB7XHJcblx0XHRcdGRlYnVnOiBmYWxzZSwgLy8gaW1hZ2UgbG9hZCwgYXV0b3BsYXksIGV0Yy4gaW5mbyBpbiBjb25zb2xlLmxvZ1xyXG5cdFx0XHRiYXNlVXJsOiAnJywgLy8gdXJsIHByZWZpeFxyXG5cdFx0XHRmaWVsZHM6IHtcclxuXHRcdFx0XHRzb3VyY2U6IHtcclxuXHRcdFx0XHRcdG1vZGFsOiAndXJsJywgLy8gcmVxdWlyZWQsIGltYWdlIHVybCBmb3IgbW9kYWwgY29tcG9uZW50IChsYXJnZSBzaXplKVxyXG5cdFx0XHRcdFx0cGFuZWw6ICd1cmwnLCAvLyBpbWFnZSB1cmwgZm9yIHBhbmVsIGNvbXBvbmVudCAodGh1bWJuYWlsIHNpemUpXHJcblx0XHRcdFx0XHRpbWFnZTogJ3VybCcgLy8gaW1hZ2UgdXJsIGZvciBpbWFnZSAobWVkaXVtIG9yIGN1c3RvbSBzaXplKVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dGl0bGU6ICd0aXRsZScsIC8vIHRpdGxlIGZpZWxkIG5hbWVcclxuXHRcdFx0XHRkZXNjcmlwdGlvbjogJ2Rlc2NyaXB0aW9uJywgLy8gZGVzY3JpcHRpb24gZmllbGQgbmFtZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhdXRvcGxheToge1xyXG5cdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLCAvLyBzbGlkZXNob3cgcGxheSBlbmFibGVkL2Rpc2FibGVkXHJcblx0XHRcdFx0ZGVsYXk6IDQxMDAgLy8gYXV0b3BsYXkgZGVsYXkgaW4gbWlsbGlzZWNvbmRcclxuXHRcdFx0fSxcclxuXHRcdFx0dGhlbWU6ICdkZWZhdWx0JywgLy8gY3NzIHN0eWxlIFtkZWZhdWx0LCBkYXJrYmx1ZSwgd2hpdGVnb2xkXVxyXG5cdFx0XHRwcmVsb2FkRGVsYXk6IDc3MCxcclxuXHRcdFx0cHJlbG9hZDogW10sIC8vIHByZWxvYWQgaW1hZ2VzIGJ5IGluZGV4IG51bWJlclxyXG5cdFx0XHRtb2RhbDoge1xyXG5cdFx0XHRcdHRpdGxlOiAnJywgLy8gbW9kYWwgd2luZG93IHRpdGxlXHJcblx0XHRcdFx0c3VidGl0bGU6ICcnLCAvLyBtb2RhbCB3aW5kb3cgc3VidGl0bGVcclxuXHRcdFx0XHRjYXB0aW9uOiB7XHJcblx0XHRcdFx0XHR2aXNpYmxlOiB0cnVlLCAvLyBzaG93L2hpZGUgaW1hZ2UgY2FwdGlvblxyXG5cdFx0XHRcdFx0cG9zaXRpb246ICd0b3AnIC8vIGNhcHRpb24gcG9zaXRpb24gW3RvcCwgYm90dG9tXVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGVhZGVyOiB7XHJcblx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLCAvLyBlbmFibGUvZGlzYWJsZSBtb2RhbCBtZW51XHJcblx0XHRcdFx0XHRkeW5hbWljOiBmYWxzZSAvLyBzaG93L2hpZGUgbW9kYWwgbWVudSBvbiBtb3VzZW92ZXJcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGhlbHA6IGZhbHNlLCAvLyBzaG93L2hpZGUgaGVscFxyXG5cdFx0XHRcdGFycm93czogdHJ1ZSwgLy8gc2hvdy9oaWRlIGFycm93c1xyXG5cdFx0XHRcdGNsaWNrOiB7XHJcblx0XHRcdFx0XHRjbG9zZTogdHJ1ZSAvLyB3aGVuIGNsaWNrIG9uIHRoZSBpbWFnZSBjbG9zZSB0aGUgbW9kYWxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHRodW1ibmFpbDoge1xyXG5cdFx0XHRcdFx0aGVpZ2h0OiA1MCwgLy8gdGh1bWJuYWlsIGltYWdlIGhlaWdodCBpbiBwaXhlbFxyXG5cdFx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93IGluZGV4IG51bWJlciBvbiB0aHVtYm5haWxcclxuXHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsIC8vIGVuYWJsZS9kaXNhYmxlIHRodW1ibmFpbHNcclxuXHRcdFx0XHRcdGR5bmFtaWM6IGZhbHNlLCAvLyBpZiB0cnVlIHRodW1ibmFpbHMgdmlzaWJsZSBvbmx5IHdoZW4gbW91c2VvdmVyXHJcblx0XHRcdFx0XHRjbGljazoge1xyXG5cdFx0XHRcdFx0XHRzZWxlY3Q6IHRydWUsIC8vIHNldCBzZWxlY3RlZCBpbWFnZSB3aGVuIHRydWVcclxuXHRcdFx0XHRcdFx0bW9kYWw6IGZhbHNlIC8vIG9wZW4gbW9kYWwgd2hlbiB0cnVlXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0aG92ZXI6IHtcclxuXHRcdFx0XHRcdFx0c2VsZWN0OiBmYWxzZSAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugb24gbW91c2VvdmVyIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHRyYW5zaXRpb246ICdzbGlkZUxSJywgLy8gdHJhbnNpdGlvbiBlZmZlY3RcclxuXHRcdFx0XHRzaXplOiAnY292ZXInLCAvLyBjb250YWluLCBjb3ZlciwgYXV0bywgc3RyZXRjaFxyXG5cdFx0XHRcdGtleWNvZGVzOiB7XHJcblx0XHRcdFx0XHRleGl0OiBbMjddLCAvLyBlc2NcclxuXHRcdFx0XHRcdHBsYXlwYXVzZTogWzgwXSwgLy8gcFxyXG5cdFx0XHRcdFx0Zm9yd2FyZDogWzMyLCAzOV0sIC8vIHNwYWNlLCByaWdodCBhcnJvd1xyXG5cdFx0XHRcdFx0YmFja3dhcmQ6IFszN10sIC8vIGxlZnQgYXJyb3dcclxuXHRcdFx0XHRcdGZpcnN0OiBbMzgsIDM2XSwgLy8gdXAgYXJyb3csIGhvbWVcclxuXHRcdFx0XHRcdGxhc3Q6IFs0MCwgMzVdLCAvLyBkb3duIGFycm93LCBlbmRcclxuXHRcdFx0XHRcdGZ1bGxzY3JlZW46IFsxM10sIC8vIGVudGVyXHJcblx0XHRcdFx0XHRtZW51OiBbNzddLCAvLyBtXHJcblx0XHRcdFx0XHRjYXB0aW9uOiBbNjddLCAvLyBjXHJcblx0XHRcdFx0XHRoZWxwOiBbNzJdLCAvLyBoXHJcblx0XHRcdFx0XHRzaXplOiBbODNdLCAvLyBzXHJcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiBbODRdIC8vIHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHRodW1ibmFpbDoge1xyXG5cdFx0XHRcdGhlaWdodDogNTAsIC8vIHRodW1ibmFpbCBpbWFnZSBoZWlnaHQgaW4gcGl4ZWxcclxuXHRcdFx0XHRpbmRleDogZmFsc2UsIC8vIHNob3cgaW5kZXggbnVtYmVyIG9uIHRodW1ibmFpbFxyXG5cdFx0XHRcdGR5bmFtaWM6IGZhbHNlLCAvLyBpZiB0cnVlIHRodW1ibmFpbHMgdmlzaWJsZSBvbmx5IHdoZW4gbW91c2VvdmVyXHJcblx0XHRcdFx0Y2xpY2s6IHtcclxuXHRcdFx0XHRcdHNlbGVjdDogdHJ1ZSwgLy8gc2V0IHNlbGVjdGVkIGltYWdlIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdFx0bW9kYWw6IGZhbHNlIC8vIG9wZW4gbW9kYWwgd2hlbiB0cnVlXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRob3Zlcjoge1xyXG5cdFx0XHRcdFx0c2VsZWN0OiBmYWxzZSAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugb24gbW91c2VvdmVyIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdHBhbmVsOiB7XHJcblx0XHRcdFx0dmlzaWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRpdGVtOiB7XHJcblx0XHRcdFx0XHRjbGFzczogJ2NvbC1tZC0zJywgLy8gaXRlbSBjbGFzc1xyXG5cdFx0XHRcdFx0Y2FwdGlvbjogZmFsc2UsIC8vIHNob3cvaGlkZSBpbWFnZSBjYXB0aW9uXHJcblx0XHRcdFx0XHRpbmRleDogZmFsc2UsIC8vIHNob3cvaGlkZSBpbWFnZSBpbmRleFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aG92ZXI6IHtcclxuXHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGNsaWNrOiB7XHJcblx0XHRcdFx0XHRzZWxlY3Q6IGZhbHNlLCAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugd2hlbiB0cnVlXHJcblx0XHRcdFx0XHRtb2RhbDogdHJ1ZSAvLyBvcGVuIG1vZGFsIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdGltYWdlOiB7XHJcblx0XHRcdFx0dHJhbnNpdGlvbjogJ3NsaWRlTFInLCAvLyB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0XHRcdHNpemU6ICdjb3ZlcicsIC8vIGNvbnRhaW4sIGNvdmVyLCBhdXRvLCBzdHJldGNoXHJcblx0XHRcdFx0YXJyb3dzOiB0cnVlLCAvLyBzaG93L2hpZGUgYXJyb3dzXHJcblx0XHRcdFx0Y2xpY2s6IHtcclxuXHRcdFx0XHRcdG1vZGFsOiB0cnVlIC8vIHdoZW4gY2xpY2sgb24gdGhlIGltYWdlIG9wZW4gdGhlIG1vZGFsIHdpbmRvd1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGVpZ2h0OiBudWxsLCAvLyBoZWlnaHQgaW4gcGl4ZWxcclxuXHRcdFx0XHRoZWlnaHRNaW46IG51bGwsIC8vIG1pbiBoZWlnaHQgaW4gcGl4ZWxcclxuXHRcdFx0XHRoZWlnaHRBdXRvOiB7XHJcblx0XHRcdFx0XHRpbml0aWFsOiB0cnVlLCAvLyBjYWxjdWxhdGUgZGl2IGhlaWdodCBieSBmaXJzdCBpbWFnZVxyXG5cdFx0XHRcdFx0b25yZXNpemU6IGZhbHNlIC8vIGNhbGN1bGF0ZSBkaXYgaGVpZ2h0IG9uIHdpbmRvdyByZXNpemVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gYXZhaWxhYmxlIGltYWdlIHNpemVzXHJcblx0XHRwdWJsaWMgc2l6ZXMgOiBBcnJheTxzdHJpbmc+ID0gW1xyXG5cdFx0XHQnY29udGFpbicsXHJcblx0XHRcdCdjb3ZlcicsXHJcblx0XHRcdCdhdXRvJyxcclxuXHRcdFx0J3N0cmV0Y2gnXHJcblx0XHRdO1xyXG5cclxuXHRcdC8vIGF2YWlsYWJsZSB0aGVtZXNcclxuXHRcdHB1YmxpYyB0aGVtZXMgOiBBcnJheTxzdHJpbmc+ID0gW1xyXG5cdFx0XHQnZGVmYXVsdCcsXHJcblx0XHRcdCdkYXJrYmx1ZScsXHJcblx0XHRcdCd3aGl0ZWdvbGQnXHJcblx0XHRdO1xyXG5cclxuXHRcdC8vIGF2YWlsYWJsZSB0cmFuc2l0aW9uc1xyXG5cdFx0cHVibGljIHRyYW5zaXRpb25zIDogQXJyYXk8c3RyaW5nPiA9IFtcclxuXHRcdFx0J25vJyxcclxuXHRcdFx0J2ZhZGVJbk91dCcsXHJcblx0XHRcdCd6b29tSW4nLFxyXG5cdFx0XHQnem9vbU91dCcsXHJcblx0XHRcdCd6b29tSW5PdXQnLFxyXG5cdFx0XHQncm90YXRlTFInLFxyXG5cdFx0XHQncm90YXRlVEInLFxyXG5cdFx0XHQncm90YXRlWlknLFxyXG5cdFx0XHQnc2xpZGVMUicsXHJcblx0XHRcdCdzbGlkZVRCJyxcclxuXHRcdFx0J2ZsaXBYJyxcclxuXHRcdFx0J2ZsaXBZJ1xyXG5cdFx0XTtcclxuXHJcblx0XHRwdWJsaWMgZXZlbnRzID0ge1xyXG5cdFx0XHRDT05GSUdfTE9BRDogJ0FTRy1jb25maWctbG9hZC0nLFxyXG5cdFx0XHRBVVRPUExBWV9TVEFSVDogJ0FTRy1hdXRvcGxheS1zdGFydC0nLFxyXG5cdFx0XHRBVVRPUExBWV9TVE9QOiAnQVNHLWF1dG9wbGF5LXN0b3AtJyxcclxuXHRcdFx0UEFSU0VfSU1BR0VTOiAnQVNHLXBhcnNlLWltYWdlcy0nLFxyXG5cdFx0XHRMT0FEX0lNQUdFOiAnQVNHLWxvYWQtaW1hZ2UtJyxcclxuXHRcdFx0RklSU1RfSU1BR0U6ICdBU0ctZmlyc3QtaW1hZ2UtJyxcclxuXHRcdFx0Q0hBTkdFX0lNQUdFOiAnQVNHLWNoYW5nZS1pbWFnZS0nLFxyXG5cdFx0XHRNT0RBTF9PUEVOOiAnQVNHLW1vZGFsLW9wZW4tJyxcclxuXHRcdFx0TU9EQUxfQ0xPU0U6ICdBU0ctbW9kYWwtY2xvc2UtJyxcclxuXHRcdFx0VEhVTUJOQUlMX01PVkU6ICdBU0ctdGh1bWJuYWlsLW1vdmUtJyxcclxuXHRcdH07XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSB0aW1lb3V0IDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSBpbnRlcnZhbCA6IG5nLklJbnRlcnZhbFNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlIGxvY2F0aW9uIDogbmcuSUxvY2F0aW9uU2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHJvb3RTY29wZSA6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkd2luZG93IDogbmcuSVdpbmRvd1NlcnZpY2UpIHtcclxuXHJcblx0XHRcdGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKCdyZXNpemUnLCAoZXZlbnQpID0+IHtcclxuXHRcdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKDIwMCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIHBhcnNlSGFzaCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5pZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGhhc2ggPSB0aGlzLmxvY2F0aW9uLmhhc2goKTtcclxuXHRcdFx0bGV0IHBhcnRzID0gaGFzaCA/IGhhc2guc3BsaXQoJy0nKSA6IG51bGw7XHJcblxyXG5cdFx0XHRpZiAocGFydHMgPT09IG51bGwpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChwYXJ0c1swXSAhPT0gdGhpcy5zbHVnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocGFydHMubGVuZ3RoICE9PSAzKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocGFydHNbMV0gIT09IHRoaXMuaWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBpbmRleCA9IHBhcnNlSW50KHBhcnRzWzJdLCAxMCk7XHJcblxyXG5cdFx0XHRpZiAoIWFuZ3VsYXIuaXNOdW1iZXIoaW5kZXgpKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cclxuXHRcdFx0XHRpbmRleC0tO1xyXG5cdFx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleDtcclxuXHRcdFx0XHR0aGlzLm1vZGFsT3BlbihpbmRleCk7XHJcblxyXG5cdFx0XHR9LCAyMCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNhbGN1bGF0ZSBvYmplY3QgaGFzaCBpZFxyXG5cdFx0cHVibGljIG9iamVjdEhhc2hJZChvYmplY3QgOiBhbnkpIDogc3RyaW5nIHtcclxuXHJcblx0XHRcdGxldCBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeShvYmplY3QpO1xyXG5cclxuXHRcdFx0aWYgKCFzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGFiYyA9IHN0cmluZy5yZXBsYWNlKC9bXmEtekEtWjAtOV0rL2csICcnKTtcclxuXHRcdFx0bGV0IGNvZGUgPSAwO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaSA9IDAsIG4gPSBhYmMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcblx0XHRcdFx0bGV0IGNoYXJjb2RlID0gYWJjLmNoYXJDb2RlQXQoaSk7XHJcblx0XHRcdFx0Y29kZSArPSAoY2hhcmNvZGUgKiBpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuICdoYXNoJyArIGNvZGUudG9TdHJpbmcoMjEpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZSBmb3IgY3VycmVudCBnYWxsZXJ5IGJ5IGNvbXBvbmVudCBpZFxyXG5cdFx0cHVibGljIGdldEluc3RhbmNlKGNvbXBvbmVudCA6IGFueSkge1xyXG5cclxuXHRcdFx0aWYgKCFjb21wb25lbnQuaWQpIHtcclxuXHJcblx0XHRcdFx0Ly8gZ2V0IHBhcmVudCBhc2cgY29tcG9uZW50IGlkXHJcblx0XHRcdFx0aWYgKGNvbXBvbmVudC4kc2NvcGUgJiYgY29tcG9uZW50LiRzY29wZS4kcGFyZW50ICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudC4kcGFyZW50ICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudC4kcGFyZW50LiRjdHJsKSB7XHJcblx0XHRcdFx0XHRjb21wb25lbnQuaWQgPSBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQuJHBhcmVudC4kY3RybC5pZDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y29tcG9uZW50LmlkID0gdGhpcy5vYmplY3RIYXNoSWQoY29tcG9uZW50Lm9wdGlvbnMpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IGlkID0gY29tcG9uZW50LmlkO1xyXG5cdFx0XHRsZXQgaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1tpZF07XHJcblxyXG5cdFx0XHQvLyBuZXcgaW5zdGFuY2UgYW5kIHNldCBvcHRpb25zIGFuZCBpdGVtc1xyXG5cdFx0XHRpZiAoaW5zdGFuY2UgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGluc3RhbmNlID0gbmV3IFNlcnZpY2VDb250cm9sbGVyKHRoaXMudGltZW91dCwgdGhpcy5pbnRlcnZhbCwgdGhpcy5sb2NhdGlvbiwgdGhpcy4kcm9vdFNjb3BlLCB0aGlzLiR3aW5kb3cpO1xyXG5cdFx0XHRcdGluc3RhbmNlLmlkID0gaWQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChjb21wb25lbnQuYmFzZVVybCkge1xyXG5cdFx0XHRcdGNvbXBvbmVudC5vcHRpb25zLmJhc2VVcmwgPSBjb21wb25lbnQuYmFzZVVybDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aW5zdGFuY2Uuc2V0T3B0aW9ucyhjb21wb25lbnQub3B0aW9ucyk7XHJcblx0XHRcdGluc3RhbmNlLnNldEl0ZW1zKGNvbXBvbmVudC5pdGVtcyk7XHJcblx0XHRcdGluc3RhbmNlLnNlbGVjdGVkID0gY29tcG9uZW50LnNlbGVjdGVkID8gY29tcG9uZW50LnNlbGVjdGVkIDogMDtcclxuXHRcdFx0aW5zdGFuY2UucGFyc2VIYXNoKCk7XHJcblxyXG5cdFx0XHRpZiAoaW5zdGFuY2Uub3B0aW9ucykge1xyXG5cclxuXHRcdFx0XHRpbnN0YW5jZS5sb2FkSW1hZ2VzKGluc3RhbmNlLm9wdGlvbnMucHJlbG9hZCk7XHJcblxyXG5cdFx0XHRcdGlmIChpbnN0YW5jZS5vcHRpb25zLmF1dG9wbGF5ICYmIGluc3RhbmNlLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCAmJiAhaW5zdGFuY2UuYXV0b3BsYXkpIHtcclxuXHRcdFx0XHRcdGluc3RhbmNlLmF1dG9QbGF5U3RhcnQoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmluc3RhbmNlc1tpZF0gPSBpbnN0YW5jZTtcclxuXHRcdFx0cmV0dXJuIGluc3RhbmNlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBwcmVwYXJlIGltYWdlcyBhcnJheVxyXG5cdFx0cHVibGljIHNldEl0ZW1zKGl0ZW1zIDogQXJyYXk8SUZpbGU+KSB7XHJcblxyXG5cdFx0XHRpZiAoIWl0ZW1zKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpZiBhbHJlYWR5XHJcblx0XHRcdGlmICh0aGlzLml0ZW1zKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBwYXJzZSBhcnJheSBzdHJpbmcgZWxlbWVudHNcclxuXHRcdFx0aWYgKGFuZ3VsYXIuaXNTdHJpbmcoaXRlbXNbMF0pID09PSB0cnVlKSB7XHJcblxyXG5cdFx0XHRcdHRoaXMuaXRlbXMgPSBbXTtcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHR0aGlzLml0ZW1zLnB1c2goe3NvdXJjZToge21vZGFsOiBpdGVtc1tpXX19KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHR0aGlzLml0ZW1zID0gaXRlbXM7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnByZXBhcmVJdGVtcygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBvcHRpb25zIHNldHVwXHJcblx0XHRwdWJsaWMgc2V0T3B0aW9ucyhvcHRpb25zIDogSU9wdGlvbnMpIHtcclxuXHJcblx0XHRcdC8vIGlmIG9wdGlvbnMgYWxyZWFkeSBzZXR1cFxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zTG9hZGVkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAob3B0aW9ucykge1xyXG5cdFx0XHRcdHRoaXMub3B0aW9ucyA9IGFuZ3VsYXIubWVyZ2UodGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25zTG9hZGVkID0gdHJ1ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMgPSB0aGlzLmRlZmF1bHRzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpbXBvcnRhbnQhXHJcblx0XHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkNPTkZJR19MT0FELCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHYgPSB0aGlzLm5vcm1hbGl6ZSh2KTtcclxuXHRcdFx0bGV0IHByZXYgPSB0aGlzLl9zZWxlY3RlZDtcclxuXHJcblx0XHRcdHRoaXMuX3NlbGVjdGVkID0gdjtcclxuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XHJcblxyXG5cdFx0XHRpZiAocHJldiAhPT0gdGhpcy5fc2VsZWN0ZWQpIHtcclxuXHJcblx0XHRcdFx0dGhpcy50aHVtYm5haWxzTW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQ0hBTkdFX0lNQUdFLCB7XHJcblx0XHRcdFx0XHRpbmRleDogdixcclxuXHRcdFx0XHRcdGZpbGU6IHRoaXMuZmlsZVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gaW5kZXggPiB0aGlzLnNlbGVjdGVkID8gJ2ZvcndhcmQnIDogJ2JhY2t3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IGluZGV4O1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdvIHRvIGJhY2t3YXJkXHJcblx0XHRwdWJsaWMgdG9CYWNrd2FyZChzdG9wPyA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmIChzdG9wKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkLS07XHJcblx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQgLSAxKTtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGZvcndhcmRcclxuXHRcdHB1YmxpYyB0b0ZvcndhcmQoc3RvcD8gOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoc3RvcCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2ZvcndhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkKys7XHJcblx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQgKyAxKTtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGZpcnN0XHJcblx0XHRwdWJsaWMgdG9GaXJzdChzdG9wPyA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmIChzdG9wKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gMDtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGxhc3RcclxuXHRcdHB1YmxpYyB0b0xhc3Qoc3RvcD8gOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoc3RvcCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2ZvcndhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5pdGVtcy5sZW5ndGggLSAxO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHNldEhhc2goKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5tb2RhbFZpc2libGUpIHtcclxuXHRcdFx0XHR0aGlzLmxvY2F0aW9uLmhhc2goW3RoaXMuc2x1ZywgdGhpcy5pZCwgdGhpcy5zZWxlY3RlZCArIDFdLmpvaW4oJy0nKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5VG9nZ2xlKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RhcnQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5U3RvcCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hdXRvcGxheSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5pbnRlcnZhbC5jYW5jZWwodGhpcy5hdXRvcGxheSk7XHJcblx0XHRcdHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuYXV0b3BsYXkgPSBudWxsO1xyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkFVVE9QTEFZX1NUT1AsIHtpbmRleDogdGhpcy5zZWxlY3RlZCwgZmlsZTogdGhpcy5maWxlfSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBhdXRvUGxheVN0YXJ0KCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuYXV0b3BsYXkpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5hdXRvcGxheSA9IHRoaXMuaW50ZXJ2YWwoKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMudG9Gb3J3YXJkKCk7XHJcblx0XHRcdH0sIHRoaXMub3B0aW9ucy5hdXRvcGxheS5kZWxheSk7XHJcblxyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkFVVE9QTEFZX1NUQVJULCB7aW5kZXg6IHRoaXMuc2VsZWN0ZWQsIGZpbGU6IHRoaXMuZmlsZX0pO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHJpdmF0ZSBwcmVwYXJlSXRlbXMoKSB7XHJcblxyXG5cdFx0XHRjb25zdCBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdGxldCBnZXRBdmFpbGFibGVTb3VyY2UgPSBmdW5jdGlvbiAodHlwZSA6IHN0cmluZywgc291cmNlIDogSVNvdXJjZSkge1xyXG5cclxuXHRcdFx0XHRpZiAoc291cmNlW3R5cGVdKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gc291cmNlW3R5cGVdO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdwYW5lbCcpIHtcclxuXHRcdFx0XHRcdHJldHVybiBnZXRBdmFpbGFibGVTb3VyY2UoJ2ltYWdlJywgc291cmNlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlID09PSAnaW1hZ2UnKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZ2V0QXZhaWxhYmxlU291cmNlKCdtb2RhbCcsIHNvdXJjZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ21vZGFsJykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGdldEF2YWlsYWJsZVNvdXJjZSgnaW1hZ2UnLCBzb3VyY2UpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH07XHJcblxyXG5cclxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHRoaXMuaXRlbXMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XHJcblxyXG5cdFx0XHRcdGlmICghdmFsdWUuc291cmNlKSB7XHJcblxyXG5cdFx0XHRcdFx0dmFsdWUuc291cmNlID0ge1xyXG5cdFx0XHRcdFx0XHRtb2RhbDogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UubW9kYWxdLFxyXG5cdFx0XHRcdFx0XHRwYW5lbDogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UucGFuZWxdLFxyXG5cdFx0XHRcdFx0XHRpbWFnZTogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UuaW1hZ2VdLFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgc291cmNlID0ge1xyXG5cdFx0XHRcdFx0bW9kYWw6IHNlbGYub3B0aW9ucy5iYXNlVXJsICsgZ2V0QXZhaWxhYmxlU291cmNlKCdtb2RhbCcsIHZhbHVlLnNvdXJjZSksXHJcblx0XHRcdFx0XHRwYW5lbDogc2VsZi5vcHRpb25zLmJhc2VVcmwgKyBnZXRBdmFpbGFibGVTb3VyY2UoJ3BhbmVsJywgdmFsdWUuc291cmNlKSxcclxuXHRcdFx0XHRcdGltYWdlOiBzZWxmLm9wdGlvbnMuYmFzZVVybCArIGdldEF2YWlsYWJsZVNvdXJjZSgnaW1hZ2UnLCB2YWx1ZS5zb3VyY2UpLFxyXG5cdFx0XHRcdH07XHJcblxyXG5cclxuXHRcdFx0XHRsZXQgcGFydHMgPSBzb3VyY2UubW9kYWwuc3BsaXQoJy8nKTtcclxuXHRcdFx0XHRsZXQgZmlsZW5hbWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcclxuXHJcblx0XHRcdFx0bGV0IHRpdGxlLCBkZXNjcmlwdGlvbjtcclxuXHJcblx0XHRcdFx0aWYgKHNlbGYub3B0aW9ucy5maWVsZHMgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0dGl0bGUgPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRpdGxlXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdIDogZmlsZW5hbWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRpdGxlID0gZmlsZW5hbWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoc2VsZi5vcHRpb25zLmZpZWxkcyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRkZXNjcmlwdGlvbiA9IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuZGVzY3JpcHRpb25dID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5kZXNjcmlwdGlvbl0gOiBudWxsO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRkZXNjcmlwdGlvbiA9IG51bGw7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgZmlsZSA9IHtcclxuXHRcdFx0XHRcdHNvdXJjZTogc291cmNlLFxyXG5cdFx0XHRcdFx0dGl0bGU6IHRpdGxlLFxyXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0bG9hZGVkOiB7XHJcblx0XHRcdFx0XHRcdG1vZGFsOiBmYWxzZSxcclxuXHRcdFx0XHRcdFx0cGFuZWw6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHRpbWFnZTogZmFsc2VcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRzZWxmLmZpbGVzLnB1c2goZmlsZSk7XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuUEFSU0VfSU1BR0VTLCB0aGlzLmZpbGVzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gcHJlbG9hZCB0aGUgaW1hZ2Ugd2hlbiBtb3VzZW92ZXJcclxuXHRcdHB1YmxpYyBob3ZlclByZWxvYWQoaW5kZXggOiBudW1iZXIpIHtcclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoaW5kZXgpO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBpbWFnZSBwcmVsb2FkXHJcblx0XHRwcml2YXRlIHByZWxvYWQod2FpdD8gOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQpO1xyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkICsgMSk7XHJcblx0XHRcdH0sICh3YWl0ICE9PSB1bmRlZmluZWQpID8gd2FpdCA6IHRoaXMub3B0aW9ucy5wcmVsb2FkRGVsYXkpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgbm9ybWFsaXplKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRsZXQgbGFzdCA9IHRoaXMuZmlsZXMubGVuZ3RoIC0gMTtcclxuXHJcblx0XHRcdGlmIChpbmRleCA+IGxhc3QpIHtcclxuXHRcdFx0XHRyZXR1cm4gKGluZGV4IC0gbGFzdCkgLSAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoaW5kZXggPCAwKSB7XHJcblx0XHRcdFx0cmV0dXJuIGxhc3QgLSBNYXRoLmFicyhpbmRleCkgKyAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gaW5kZXg7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbG9hZEltYWdlcyhpbmRleGVzIDogQXJyYXk8bnVtYmVyPiwgdHlwZSA6IHN0cmluZykge1xyXG5cclxuXHRcdFx0aWYgKCFpbmRleGVzKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRpbmRleGVzLmZvckVhY2goKGluZGV4IDogbnVtYmVyKSA9PiB7XHJcblx0XHRcdFx0c2VsZi5sb2FkSW1hZ2UoaW5kZXgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBsb2FkSW1hZ2UoaW5kZXg/IDogbnVtYmVyLCBjYWxsYmFjaz8gOiB7fSkge1xyXG5cclxuXHRcdFx0aW5kZXggPSBpbmRleCA/IGluZGV4IDogdGhpcy5zZWxlY3RlZDtcclxuXHRcdFx0aW5kZXggPSB0aGlzLm5vcm1hbGl6ZShpbmRleCk7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuZmlsZXNbaW5kZXhdKSB7XHJcblx0XHRcdFx0dGhpcy5sb2coJ2ludmFsaWQgZmlsZSBpbmRleCcsIHtpbmRleDogaW5kZXh9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWQubW9kYWwpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0XHRpbWFnZS5zcmMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2UuaW1hZ2U7XHJcblx0XHRcdGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5hZnRlckxvYWQoaW5kZXgsICdpbWFnZScsIGltYWdlKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRsZXQgbW9kYWwgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdFx0bW9kYWwuc3JjID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlLm1vZGFsO1xyXG5cdFx0XHRtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XHJcblx0XHRcdFx0dGhpcy5hZnRlckxvYWQoaW5kZXgsICdtb2RhbCcsIG1vZGFsKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBmaWxlIG5hbWVcclxuXHRcdHByaXZhdGUgZ2V0RmlsZW5hbWUoaW5kZXggOiBudW1iZXIsIHR5cGU/IDogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHR0eXBlID0gdHlwZSA/IHR5cGUgOiAnbW9kYWwnO1xyXG5cdFx0XHRsZXQgZmlsZXBhcnRzID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlW3R5cGVdLnNwbGl0KCcvJyk7XHJcblx0XHRcdGxldCBmaWxlbmFtZSA9IGZpbGVwYXJ0c1tmaWxlcGFydHMubGVuZ3RoIC0gMV07XHJcblx0XHRcdHJldHVybiBmaWxlbmFtZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGZpbGUgZXh0ZW5zaW9uXHJcblx0XHRwcml2YXRlIGdldEV4dGVuc2lvbihpbmRleCA6IG51bWJlciwgdHlwZT8gOiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdHR5cGUgPSB0eXBlID8gdHlwZSA6ICdtb2RhbCc7XHJcblx0XHRcdGxldCBmaWxlcGFydHMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2VbdHlwZV0uc3BsaXQoJy4nKTtcclxuXHRcdFx0bGV0IGV4dGVuc2lvbiA9IGZpbGVwYXJ0c1tmaWxlcGFydHMubGVuZ3RoIC0gMV07XHJcblx0XHRcdHJldHVybiBleHRlbnNpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGFmdGVyIGxvYWQgaW1hZ2VcclxuXHRcdHByaXZhdGUgYWZ0ZXJMb2FkKGluZGV4LCB0eXBlLCBpbWFnZSkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZFt0eXBlXSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubG9hZGVkW3R5cGVdID0gdHJ1ZTtcclxuXHJcblx0XHRcdGlmICh0eXBlID09PSAnbW9kYWwnKSB7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0ud2lkdGggPSBpbWFnZS53aWR0aDtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubmFtZSA9IHRoaXMuZ2V0RmlsZW5hbWUoaW5kZXgsIHR5cGUpO1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmV4dGVuc2lvbiA9IHRoaXMuZ2V0RXh0ZW5zaW9uKGluZGV4LCB0eXBlKTtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5kb3dubG9hZCA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5tb2RhbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGRhdGEgPSB7dHlwZTogdHlwZSwgaW5kZXg6IGluZGV4LCBmaWxlOiB0aGlzLmZpbGUsIGltZzogaW1hZ2V9O1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmZpcnN0KSB7XHJcblx0XHRcdFx0dGhpcy5maXJzdCA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5GSVJTVF9JTUFHRSwgZGF0YSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuTE9BRF9JTUFHRSwgZGF0YSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBpcyBzaW5nbGU/XHJcblx0XHRwdWJsaWMgZ2V0IGlzU2luZ2xlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuZmlsZXMubGVuZ3RoID4gMSA/IGZhbHNlIDogdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB0aGUgZG93bmxvYWQgbGlua1xyXG5cdFx0cHVibGljIGRvd25sb2FkTGluaygpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLnNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgdGhpcy5maWxlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZmlsZXNbdGhpcy5zZWxlY3RlZF0uc291cmNlLm1vZGFsO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgdGhlIGZpbGVcclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpIDogSUZpbGUge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuZmlsZXNbdGhpcy5zZWxlY3RlZF07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBlbGVtZW50IHZpc2libGVcclxuXHRcdHB1YmxpYyB0b2dnbGUoZWxlbWVudCA6IHN0cmluZykgOiB2b2lkIHtcclxuXHJcblx0XHRcdHRoaXMub3B0aW9uc1tlbGVtZW50XS52aXNpYmxlID0gIXRoaXMub3B0aW9uc1tlbGVtZW50XS52aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHZpc2libGVcclxuXHRcdHB1YmxpYyBnZXQgbW9kYWxWaXNpYmxlKCkgOiBib29sZWFuIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLl92aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZW1lXHJcblx0XHRwdWJsaWMgZ2V0IHRoZW1lKCkgOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucy50aGVtZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGNsYXNzZXNcclxuXHRcdHB1YmxpYyBnZXQgY2xhc3NlcygpIDogc3RyaW5nIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnMudGhlbWUgKyAnICcgKyB0aGlzLmlkO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gc2V0IHZpc2libGVcclxuXHRcdHB1YmxpYyBzZXQgbW9kYWxWaXNpYmxlKHZhbHVlIDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0dGhpcy5fdmlzaWJsZSA9IHZhbHVlO1xyXG5cclxuXHRcdFx0bGV0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG5cdFx0XHRsZXQgY2xhc3NOYW1lID0gJyBhc2cteWhpZGRlbic7XHJcblxyXG5cdFx0XHRpZiAodmFsdWUpIHtcclxuXHJcblx0XHRcdFx0dGhpcy5wcmVsb2FkKDEpO1xyXG5cdFx0XHRcdHRoaXMubW9kYWxJbml0KCk7XHJcblxyXG5cdFx0XHRcdGlmIChib2R5LmNsYXNzTmFtZS5pbmRleE9mKGNsYXNzTmFtZSkgPCAwKSB7XHJcblx0XHRcdFx0XHRib2R5LmNsYXNzTmFtZSA9IGJvZHkuY2xhc3NOYW1lICsgY2xhc3NOYW1lO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdGJvZHkuY2xhc3NOYW1lID0gYm9keS5jbGFzc05hbWUucmVwbGFjZShjbGFzc05hbWUsICcnKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaW5pdGlhbGl6ZSB0aGUgZ2FsbGVyeVxyXG5cdFx0cHJpdmF0ZSBtb2RhbEluaXQoKSB7XHJcblxyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdHNlbGYuc2V0Rm9jdXMoKTtcclxuXHRcdFx0fSwgMTAwKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBtb2RhbE9wZW4oaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5tb2RhbEF2YWlsYWJsZSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IGluZGV4ICE9PSB1bmRlZmluZWQgPyBpbmRleCA6IHRoaXMuc2VsZWN0ZWQ7XHJcblx0XHRcdHRoaXMubW9kYWxWaXNpYmxlID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuTU9EQUxfT1BFTiwge2luZGV4OiB0aGlzLnNlbGVjdGVkfSk7XHJcblx0XHRcdHRoaXMuc2V0Rm9jdXMoKTtcclxuXHRcdFx0dGhpcy50aHVtYm5haWxzTW92ZSgyMDApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgbW9kYWxDbG9zZSgpIHtcclxuXHJcblx0XHRcdHRoaXMubG9jYXRpb24uaGFzaCgnJyk7XHJcblx0XHRcdHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuTU9EQUxfQ0xPU0UsIHtpbmRleDogdGhpcy5zZWxlY3RlZH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBtb3ZlIHRodW1ibmFpbHMgdG8gY29ycmVjdCBwb3NpdGlvblxyXG5cdFx0cHVibGljIHRodW1ibmFpbHNNb3ZlKGRlbGF5PyA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0bGV0IG1vdmUgPSAoKSA9PiB7XHJcblxyXG5cdFx0XHRcdGxldCBjb250YWluZXJzID0gdGhpcy5lbCgnZGl2LmFzZy10aHVtYm5haWwuJyArIHRoaXMuaWQpO1xyXG5cclxuXHRcdFx0XHRpZiAoIWNvbnRhaW5lcnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNvbnRhaW5lcnMubGVuZ3RoOyBpKyspIHtcclxuXHJcblx0XHRcdFx0XHRsZXQgY29udGFpbmVyIDogYW55ID0gY29udGFpbmVyc1tpXTtcclxuXHJcblx0XHRcdFx0XHRpZiAoY29udGFpbmVyLm9mZnNldFdpZHRoKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRsZXQgaXRlbXMgOiBhbnkgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignZGl2Lml0ZW1zJyk7XHJcblx0XHRcdFx0XHRcdGxldCBpdGVtIDogYW55ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5pdGVtJyk7XHJcblx0XHRcdFx0XHRcdGxldCB0aHVtYm5haWwsIG1vdmVYLCByZW1haW47XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbSkge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoaXRlbXMuc2Nyb2xsV2lkdGggPiBjb250YWluZXIub2Zmc2V0V2lkdGgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbCA9IGl0ZW1zLnNjcm9sbFdpZHRoIC8gdGhpcy5maWxlcy5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IChjb250YWluZXIub2Zmc2V0V2lkdGggLyAyKSAtICh0aGlzLnNlbGVjdGVkICogdGh1bWJuYWlsKSAtIHRodW1ibmFpbCAvIDI7XHJcblx0XHRcdFx0XHRcdFx0XHRyZW1haW4gPSBpdGVtcy5zY3JvbGxXaWR0aCArIG1vdmVYO1xyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZVggPSBtb3ZlWCA+IDAgPyAwIDogbW92ZVg7XHJcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IHJlbWFpbiA8IGNvbnRhaW5lci5vZmZzZXRXaWR0aCA/IGNvbnRhaW5lci5vZmZzZXRXaWR0aCAtIGl0ZW1zLnNjcm9sbFdpZHRoIDogbW92ZVg7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbCA9IHRoaXMuZ2V0UmVhbFdpZHRoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZVggPSAoY29udGFpbmVyLm9mZnNldFdpZHRoIC0gdGh1bWJuYWlsICogdGhpcy5maWxlcy5sZW5ndGgpIC8gMjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGl0ZW1zLnN0eWxlLmxlZnQgPSBtb3ZlWCArICdweCc7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuVEhVTUJOQUlMX01PVkUsIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbDogdGh1bWJuYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZTogbW92ZVgsXHJcblx0XHRcdFx0XHRcdFx0XHRyZW1haW46IHJlbWFpbixcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnRhaW5lcjogY29udGFpbmVyLm9mZnNldFdpZHRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbXM6IGl0ZW1zLnNjcm9sbFdpZHRoXHJcblx0XHRcdFx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGlmIChkZWxheSkge1xyXG5cdFx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHRtb3ZlKCk7XHJcblx0XHRcdFx0fSwgZGVsYXkpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1vdmUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG1vZGFsQ2xpY2soJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICgkZXZlbnQpIHtcclxuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRoZSBmb2N1c1xyXG5cdFx0cHVibGljIHNldEZvY3VzKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubW9kYWxWaXNpYmxlKSB7XHJcblxyXG5cdFx0XHRcdGxldCBlbGVtZW50IDogTm9kZSA9IHRoaXMuZWwoJ2Rpdi5hc2ctbW9kYWwuJyArIHRoaXMuaWQgKyAnIC5rZXlJbnB1dCcpWzBdO1xyXG5cclxuXHRcdFx0XHRpZiAoZWxlbWVudCkge1xyXG5cdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW1lbnQpWzBdLmZvY3VzKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIGV2ZW50KGV2ZW50IDogc3RyaW5nLCBkYXRhPyA6IGFueSkge1xyXG5cclxuXHRcdFx0ZXZlbnQgPSBldmVudCArIHRoaXMuaWQ7XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kZW1pdChldmVudCwgZGF0YSk7XHJcblx0XHRcdHRoaXMubG9nKGV2ZW50LCBkYXRhKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGxvZyhldmVudCA6IHN0cmluZywgZGF0YT8gOiBhbnkpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZGVidWcpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhldmVudCwgZGF0YSA/IGRhdGEgOiBudWxsKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgZWxlbWVudFxyXG5cdFx0cHVibGljIGVsKHNlbGVjdG9yKSA6IE5vZGVMaXN0IHtcclxuXHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRpbmcgZWxlbWVudCByZWFsIHdpZHRoXHJcblx0XHRwdWJsaWMgZ2V0UmVhbFdpZHRoKGl0ZW0pIHtcclxuXHJcblx0XHRcdGxldCBzdHlsZSA9IGl0ZW0uY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGl0ZW0pLFxyXG5cdFx0XHRcdHdpZHRoID0gaXRlbS5vZmZzZXRXaWR0aCxcclxuXHRcdFx0XHRtYXJnaW4gPSBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkxlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5SaWdodCksXHJcblx0XHRcdFx0Ly9wYWRkaW5nID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdSaWdodCksXHJcblx0XHRcdFx0Ym9yZGVyID0gcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJMZWZ0V2lkdGgpICsgcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJSaWdodFdpZHRoKTtcclxuXHJcblx0XHRcdHJldHVybiB3aWR0aCArIG1hcmdpbiArIGJvcmRlcjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRpbmcgZWxlbWVudCByZWFsIGhlaWdodFxyXG5cdFx0cHVibGljIGdldFJlYWxIZWlnaHQoaXRlbSkge1xyXG5cclxuXHRcdFx0bGV0IHN0eWxlID0gaXRlbS5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUoaXRlbSksXHJcblx0XHRcdFx0aGVpZ2h0ID0gaXRlbS5vZmZzZXRIZWlnaHQsXHJcblx0XHRcdFx0bWFyZ2luID0gcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Ub3ApICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Cb3R0b20pLFxyXG5cdFx0XHRcdC8vcGFkZGluZyA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1RvcCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pLFxyXG5cdFx0XHRcdGJvcmRlciA9IHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyVG9wV2lkdGgpICsgcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gaGVpZ2h0ICsgbWFyZ2luICsgYm9yZGVyO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5zZXJ2aWNlKCdhc2dTZXJ2aWNlJywgWyckdGltZW91dCcsICckaW50ZXJ2YWwnLCAnJGxvY2F0aW9uJywgJyRyb290U2NvcGUnLCAnJHdpbmRvdycsIFNlcnZpY2VDb250cm9sbGVyXSk7XHJcblxyXG59XHJcblxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBUaHVtYm5haWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmwgOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ3RodW1ibmFpbCc7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlID0gJ3ZpZXdzL2FzZy10aHVtYm5haWwuaHRtbCc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgbW9kYWwgPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdFx0XHRwcml2YXRlICRzY29wZSA6IG5nLklTY29wZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJGVsZW1lbnQgOiBuZy5JUm9vdEVsZW1lbnRTZXJ2aWNlKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0XHQvLyBnZXQgcGFyZW50IGFzZyBjb21wb25lbnQgKG1vZGFsKVxyXG5cdFx0XHRpZiAodGhpcy4kc2NvcGUgJiYgdGhpcy4kc2NvcGUuJHBhcmVudCAmJiB0aGlzLiRzY29wZS4kcGFyZW50LiRwYXJlbnQgJiYgdGhpcy4kc2NvcGUuJHBhcmVudC4kcGFyZW50LiRjdHJsKSB7XHJcblx0XHRcdFx0dGhpcy5tb2RhbCA9IHRoaXMuJHNjb3BlLiRwYXJlbnQuJHBhcmVudC4kY3RybC50eXBlID09ICdtb2RhbCcgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXggOiBudW1iZXIsICRldmVudD8gOiBNb3VzZUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2subW9kYWwpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbE9wZW4oaW5kZXgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLnNlbGVjdCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBwcmVsb2Qgd2hlbiBtb3VzZW92ZXIgYW5kIHNldCBzZWxlY3RlZCBpZiBlbmFibGVkXHJcblx0XHRwdWJsaWMgaG92ZXIoaW5kZXggOiBudW1iZXIsICRldmVudD8gOiBNb3VzZUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5ob3ZlclByZWxvYWQoaW5kZXgpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhvdmVyLnNlbGVjdCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgdGh1bWJuYWlsIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKSA6IElPcHRpb25zVGh1bWJuYWlsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLm1vZGFsID8gdGhpcy5hc2cub3B0aW9uc1snbW9kYWwnXVt0aGlzLnR5cGVdIDogdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdGh1bWJuYWlsIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc1RodW1ibmFpbCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubW9kYWwpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5vcHRpb25zWydtb2RhbCddW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBhYm92ZSBmcm9tIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBkeW5hbWljKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLmR5bmFtaWMgPyAnZHluYW1pYycgOiAnJztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGNsYXNzZXNcclxuXHRcdHB1YmxpYyBnZXQgY2xhc3NlcygpIDogc3RyaW5nIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5jbGFzc2VzICsgJyAnICsgdGhpcy5keW5hbWljO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ1RodW1ibmFpbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCAnJGVsZW1lbnQnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LlRodW1ibmFpbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYXNnLXRodW1ibmFpbCB7eyAkY3RybC5jbGFzc2VzIH19XCIgbmctY2xpY2s9XCIkY3RybC5hc2cubW9kYWxDbGljaygkZXZlbnQpO1wiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQCcsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dmlzaWJsZTogJz0/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPycsXHJcblx0XHRcdGJhc2VVcmw6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIl19

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/asg-control.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.autoPlayToggle()">\r\n\t<span ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t<span ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toFirst(true)">\r\n\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toBackward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toForward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n</button>\r\n\r\n');
$templateCache.put('views/asg-image.html','<div class="asg-image {{ $ctrl.asg.classes }}" ng-class="{\'modalon\' : $ctrl.modalAvailable }" ng-style="{\'min-height\' : $ctrl.config.heightMin + \'px\', \'height\' : $ctrl.height + \'px\'}">\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)">\r\n\r\n\t\t<div class="img" ng-repeat="(key,file) in $ctrl.asg.files" ng-show="$ctrl.asg.selected == key" ng-class="{\'loading\' : !file.loaded.image}">\r\n\r\n\t\t\t<div class="source {{ $ctrl.config.size }}" ng-style="{\'background-image\': \'url(\' + file.source.image + \')\'}" ng-if="file.loaded.image" ng-mouseover="$ctrl.asg.hoverPreload(key)" ng-click="$ctrl.modalOpen($event)"></div>\r\n\r\n\t\t</div>\r\n\t</div>\r\n\t<div class="arrows" ng-if="$ctrl.config.arrows" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.modalOpen($event)">\r\n\r\n\t\t<div ng-if="!$ctrl.asg.isSingle" class="toBackward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div ng-if="!$ctrl.asg.isSingle" class="toForward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t</div>\r\n\t<ng-transclude></ng-transclude>\r\n</div>\r\n\r\n\r\n\r\n');
$templateCache.put('views/asg-info.html','<div class="row">\r\n\r\n\t<div class="col-md-12">\r\n\t\t<h3>{{ $ctrl.file.title }}</h3>\r\n\t</div>\r\n\r\n\t<div class="col-md-12">\r\n\t\t{{ $ctrl.file.description }}\r\n\t\t<a target="_blank" href="{{ $ctrl.download }}"><span class="glyphicon glyphicon-download"></span></a>\r\n\t</div>\r\n\r\n</div>\r\n\r\n\r\n');
$templateCache.put('views/asg-modal.html','<script type="text/ng-template" id="help.html">\r\n\t<ul>\r\n\t\t<li>SPACE : forward</li>\r\n\t\t<li>RIGHT : forward</li>\r\n\t\t<li>LEFT : backward</li>\r\n\t\t<li>UP / HOME : first</li>\r\n\t\t<li>DOWN / END : last</li>\r\n\t\t<li>ENTER : toggle fullscreen</li>\r\n\t\t<li>ESC : exit</li>\r\n\t\t<li>p : play/pause</li>\r\n\t\t<li>t : change transition effect</li>\r\n\t\t<li>m : toggle menu</li>\r\n\t\t<li>s : toggle image size</li>\r\n\t\t<li>c : toggle caption</li>\r\n\t\t<li>h : toggle help</li>\r\n\t</ul>\r\n</script>\r\n\r\n<div class="asg-modal {{ $ctrl.asg.classes }}" ng-class="$ctrl.getClass()" ng-click="$ctrl.imageClick($event);" ng-show="$ctrl.asg.modalVisible" ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="frame" ng-click="$ctrl.asg.modalClick($event);">\r\n\r\n\t\t<div class="header" ng-if="$ctrl.config.header.enabled" ng-click="$ctrl.asg.modalClick($event);">\r\n\r\n\t\t\t<span class="buttons visible-xs pull-right">\r\n\t\t\t\t <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs">\r\n\t\t\t\t\t\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n\t\t\t\t </button>\r\n\t\t\t</span>\r\n\r\n\t\t\t<span class="buttons hidden-xs pull-right">\r\n\r\n\t\t\t   <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.autoPlayToggle($event)">\r\n                    <span ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t\t\t\t   <span ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n                </button>\r\n\r\n                <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toFirst(true, $event)">\r\n                    {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n                </button>\r\n\r\n                <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toBackward(true, $event)">\r\n                    <span class="glyphicon glyphicon-chevron-left"></span>\r\n                </button>\r\n\r\n                <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toForward(true, $event)">\r\n                    <span class="glyphicon glyphicon-chevron-right"></span>\r\n                </button>\r\n\r\n             <span ng-if="!$ctrl.asg.isSingle && false" class="dropdown">\r\n                    <button class="btn btn-default btn-sm dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                        <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu pull-right">\r\n                        <li class="dropdown-submenu">\r\n                            <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" ng-click="$ctrl.setTransition(transition, $event)" ng-repeat="transition in $ctrl.asg.transitions">\r\n                                    <span ng-class="{\'highlight\' : transition == $ctrl.config.transition}">\r\n                                        {{ transition }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" ng-click="$ctrl.setTheme(theme, $event)" ng-repeat="theme in $ctrl.themes">\r\n                                    <span ng-class="{\'highlight\' : theme == $ctrl.asg.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                        <li><a href="#" tabindex="-1" ng-click="$ctrl.toggleHelp($event)">Help</a></li>\r\n                    </ul>\r\n                </span>\r\n\r\n\r\n                <button class="btn btn-default btn-sm" ng-click="$ctrl.toggleMenu($event)">\r\n                    <span ng-if="$ctrl.config.menu" class="glyphicon glyphicon-chevron-up"></span>\r\n                    <span ng-if="!$ctrl.config.menu" class="glyphicon glyphicon-chevron-down"></span>\r\n                </button>\r\n\r\n\t\t\t \t<button class="btn btn-default btn-sm btn-size" ng-click="$ctrl.toggleSize($event)">\r\n                    {{ $ctrl.config.size }}\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm hidden-xs btn-transitions" data-ng-if="!$ctrl.asg.isSingle" data-ng-click="$ctrl.nextTransition($event)">\r\n                    {{ $ctrl.config.transition }}\r\n                </button>\r\n\r\n\t\t\t\t<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toggleThumbnails($event)">\r\n\t\t\t\t   <span class="glyphicon glyphicon-option-horizontal"></span>\r\n\t\t\t    </button>\r\n\r\n                <button class="btn btn-default btn-sm" ng-click="$ctrl.toggleFullScreen($event)">\r\n                    <span class="glyphicon glyphicon-fullscreen"></span>\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleHelp($event)">\r\n                    <span class="glyphicon glyphicon-question-sign"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" ng-click="$ctrl.close($event)">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n\r\n            </span>\r\n\r\n\t\t\t<span ng-if="$ctrl.config.title">\r\n\t\t\t\t<span class="title">{{ $ctrl.config.title }}</span>\r\n\t\t\t\t<span class="subtitle hidden-xs" ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span>\r\n\t\t\t</span>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}" ng-style="{\'top\': $ctrl.marginTop + \'px\', \'bottom\': $ctrl.marginBottom + \'px\'}" ng-mouseover="$ctrl.asg.over.modalImage = true;" ng-mouseleave="$ctrl.asg.over.modalImage = false;">\r\n\r\n\t\t\t<div class="help text-right" ng-click="$ctrl.toggleHelp($event)" ng-show="$ctrl.config.help" ng-include src="\'help.html\'"></div>\r\n\r\n\t\t\t<div class="arrows" ng-if="$ctrl.config.arrows" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.imageClick($event)">\r\n\r\n\t\t\t\t<div ng-if="!$ctrl.asg.isSingle" class="toBackward">\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<div ng-if="!$ctrl.asg.isSingle" class="toForward">\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t</div>\r\n\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class="img" ng-repeat="(key,file) in $ctrl.asg.files" ng-show="$ctrl.asg.selected == key" ng-class="{\'loading\' : !file.loaded.modal}">\r\n\r\n\t\t\t\t<div class="source {{ $ctrl.config.size }}" ng-style="{\'background-image\': \'url(\' + file.source.modal + \')\'}" ng-if="file.loaded.modal"></div>\r\n\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class="caption {{ $ctrl.config.caption.position }}" ng-class="{\'visible\' : $ctrl.config.caption.visible}">\r\n\t\t\t\t<div class="content">\r\n\t\t\t\t\t<span class="title">{{ $ctrl.asg.file.title }}</span>\r\n\t\t\t\t\t<span ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description"> - </span>\r\n\t\t\t\t\t<span class="description">{{ $ctrl.asg.file.description }}</span>\r\n\t\t\t\t\t<a href="{{ $ctrl.asg.downloadLink() }}" target="_blank" class="btn btn-default btn-xs">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-download"></span> Download\r\n\t\t\t\t\t</a>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\r\n\t\t</div>\r\n\r\n\t\t<ng-transclude></ng-transclude>\r\n\r\n\t</div>\r\n\r\n</div>');
$templateCache.put('views/asg-panel.html','<div class="items">\r\n\t<div class="item {{ $ctrl.asg.options.panel.item.class }}" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files" ng-class="{\'selected\' : $ctrl.asg.selected == key}">\r\n\r\n\t\t<img ng-src="{{ file.source.panel }}" ng-click="$ctrl.setSelected(key, $event)" alt="{{ file.title }}">\r\n\r\n\t\t<span class="index" ng-if="$ctrl.config.item.index">{{ key + 1 }}</span>\r\n\r\n\t\t<div class="caption" ng-if="$ctrl.config.item.caption">\r\n\t\t\t<span>{{ file.title }}</span>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n');
$templateCache.put('views/asg-thumbnail.html','<div class="items">\r\n\t<div class="item" ng-click="$ctrl.setSelected(key, $event)" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files" ng-class="{\'selected\' : $ctrl.asg.selected == key}">\r\n\r\n\t\t<img ng-src="{{ file.source.panel }}" ng-style="{\'height\': $ctrl.config.height + \'px\'}" alt="{{ file.title }}">\r\n\r\n\t\t<span class="index" ng-if="$ctrl.config.index">{{ key + 1 }}</span>\r\n\r\n\t</div>\r\n</div>\r\n');}]);