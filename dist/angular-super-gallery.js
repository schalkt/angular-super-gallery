/**
 * angular-super-gallery - AngularJS Super Gallery
 * 
 * @version v1.4.2
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
            this.$rootScope.$on(this.asg.events.LOAD_IMAGE + this.id, function (event, data) {
                _this.$scope.$apply();
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
        ImageController.prototype.hover = function (index, $event) {
            if (this.config.arrows.preload === true) {
                this.asg.hoverPreload(index);
            }
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
        function ModalController(service, $window, $rootScope, $scope) {
            this.service = service;
            this.$window = $window;
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.type = 'modal';
            this.arrowsVisible = false;
        }
        ModalController.prototype.$onInit = function () {
            var _this = this;
            this.asg = this.service.getInstance(this);
            this.asg.modalAvailable = true;
            this.$rootScope.$on(this.asg.events.LOAD_IMAGE + this.id, function (event, data) {
                _this.$scope.$apply();
            });
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
        ModalController.prototype.hover = function (index, $event) {
            if (this.config.arrows.preload === true) {
                this.asg.hoverPreload(index);
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
        controller: ['asgService', '$window', '$rootScope', '$scope', angularSuperGallery.ModalController],
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
            if (this.config.hover.preload === true) {
                this.asg.hoverPreload(index);
            }
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
            this.modalInitialized = false;
            this.instances = {};
            this._visible = false;
            this.first = false;
            this.editing = false;
            this.options = null;
            this.optionsLoaded = false;
            this.defaults = {
                debug: false,
                hashUrl: true,
                baseUrl: '',
                fields: {
                    source: {
                        modal: 'url',
                        panel: 'url',
                        image: 'url',
                        placeholder: null
                    },
                    title: 'title',
                    description: 'description',
                },
                autoplay: {
                    enabled: false,
                    delay: 4100
                },
                theme: 'default',
                preloadNext: false,
                preloadDelay: 770,
                loadingImage: 'preload.svg',
                preload: [],
                modal: {
                    title: '',
                    subtitle: '',
                    caption: {
                        disabled: false,
                        visible: true,
                        position: 'top'
                    },
                    header: {
                        enabled: true,
                        dynamic: false,
                        buttons: ['playstop', 'index', 'prev', 'next', 'pin', 'size', 'transition', 'thumbnails', 'fullscreen', 'help', 'close'],
                    },
                    help: false,
                    arrows: {
                        enabled: true,
                        preload: true,
                    },
                    click: {
                        close: true
                    },
                    thumbnail: {
                        height: 50,
                        index: false,
                        enabled: true,
                        dynamic: false,
                        autohide: true,
                        click: {
                            select: true,
                            modal: false
                        },
                        hover: {
                            preload: true,
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
                    autohide: false,
                    click: {
                        select: true,
                        modal: false
                    },
                    hover: {
                        preload: true,
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
                        preload: true,
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
                    arrows: {
                        enabled: true,
                        preload: true,
                    },
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
                GALLERY_UPDATED: 'ASG-gallery-updated-',
                GALLERY_EDIT: 'ASG-gallery-edit',
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
            if (!this.options.hashUrl) {
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
            return 'id' + code.toString(21);
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
            instance.$rootScope.$on(this.events.GALLERY_EDIT, function (event, data) {
                if (id === data.id && component.items) {
                    instance.editGallery(data, component);
                }
            });
            this.instances[id] = instance;
            return instance;
        };
        ServiceController.prototype.setItems = function (items) {
            if (!items) {
                return;
            }
            this.items = items;
            this.prepareItems();
        };
        ServiceController.prototype.setOptions = function (options) {
            if (this.optionsLoaded) {
                return;
            }
            if (options) {
                options = angular.merge(angular.copy(this.defaults), options);
                this.options = angular.copy(options);
                if (options.modal && options.modal.header && options.modal.header.buttons) {
                    this.options.modal.header.buttons = options.modal.header.buttons;
                }
                this.optionsLoaded = true;
            }
            else {
                this.options = angular.copy(this.defaults);
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
                this.loadImage(this._selected);
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
        ServiceController.prototype.forceSelect = function (index) {
            index = this.normalize(index);
            this._selected = index;
            this.loadImage(this._selected);
            this.preload();
            this.event(this.events.CHANGE_IMAGE, {
                index: index,
                file: this.file
            });
        };
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
            this.setHash();
        };
        ServiceController.prototype.toForward = function (stop) {
            if (stop) {
                this.autoPlayStop();
            }
            this.direction = 'forward';
            this.selected++;
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
            if (this.modalVisible && this.options.hashUrl) {
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
            var length = this.items.length;
            for (var key = 0; key < length; key++) {
                this.addImage(this.items[key]);
            }
            ;
            this.event(this.events.PARSE_IMAGES, this.files);
        };
        ServiceController.prototype.hoverPreload = function (index) {
            this.loadImage(index);
        };
        ServiceController.prototype.preload = function (wait) {
            var _this = this;
            var index = this.direction === 'forward' ? this.selected + 1 : this.selected - 1;
            if (this.options.preloadNext === true) {
                this.timeout(function () {
                    _this.loadImage(index);
                }, (wait !== undefined) ? wait : this.options.preloadDelay);
            }
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
            if (!indexes || indexes.length === 0) {
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
            if (this.modalVisible) {
                if (this.files[index].loaded.modal === true) {
                    return;
                }
                var modal_1 = new Image();
                modal_1.src = this.files[index].source.modal;
                modal_1.addEventListener('load', function (event) {
                    _this.afterLoad(index, 'modal', modal_1);
                });
            }
            else {
                if (this.files[index].loaded.image === true) {
                    return;
                }
                var image_1 = new Image();
                image_1.src = this.files[index].source.image;
                image_1.addEventListener('load', function () {
                    _this.afterLoad(index, 'image', image_1);
                });
            }
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
                this.files[index].loaded[type] = true;
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
                this.selected = this.selected ? this.selected : 0;
                var body = document.body;
                var className = ' asg-yhidden';
                if (value) {
                    if (body.className.indexOf(className) < 0) {
                        body.className = body.className + className;
                    }
                    this.modalInit();
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
                return this.options.theme + ' ' + this.id + (this.editing ? ' editing' : '');
            },
            enumerable: true,
            configurable: true
        });
        ServiceController.prototype.preloadStyle = function (file, type) {
            var style = {};
            if (file.source.color) {
                style['background-color'] = file.source.color;
            }
            if (this.options.loadingImage && file.loaded[type] === false) {
                style['background-image'] = 'url(' + this.options.loadingImage + ')';
            }
            return style;
        };
        ServiceController.prototype.placeholderStyle = function (file) {
            var style = {};
            if (file.source.color) {
                style['background-color'] = file.source.color;
            }
            if (file.source.placeholder) {
                style['background-image'] = 'url(' + file.source.placeholder + ')';
            }
            return style;
        };
        ServiceController.prototype.modalInit = function () {
            var _this = this;
            var self = this;
            this.timeout(function () {
                self.setFocus();
            }, 100);
            this.thumbnailsMove(440);
            this.timeout(function () {
                _this.modalInitialized = true;
            }, 460);
        };
        ServiceController.prototype.modalOpen = function (index) {
            if (!this.modalAvailable) {
                return;
            }
            this.selected = index !== undefined ? index : this.selected;
            this.modalVisible = true;
            this.loadImage();
            this.setHash();
            this.event(this.events.MODAL_OPEN, { index: this.selected });
        };
        ServiceController.prototype.modalClose = function () {
            if (this.options.hashUrl) {
                this.location.hash('');
            }
            this.modalInitialized = false;
            this.modalVisible = false;
            this.loadImage();
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
        ServiceController.prototype.editGallery = function (edit, component) {
            var _this = this;
            this.editing = true;
            var selected = this.selected;
            if (edit.options !== undefined) {
                this.optionsLoaded = false;
                this.setOptions(edit.options);
            }
            if (edit.delete !== undefined) {
                this.deleteImage(edit.delete);
            }
            if (edit.add) {
                selected = this.files.length;
                var length = edit.add.length;
                for (var key = 0; key < length; key++) {
                    this.addImage(edit.add[key]);
                }
            }
            if (edit.update) {
                this.selected = null;
                var length = edit.update.length;
                for (var key = 0; key < length; key++) {
                    this.addImage(edit.update[key], key);
                }
                ;
                var count = this.files.length - edit.update.length;
                if (count > 0) {
                    this.deleteImage(length, count);
                }
            }
            this.timeout(function () {
                selected = _this.files[selected] ? selected : (selected >= _this.files.length ? selected - 1 : selected + 1);
                _this.forceSelect(_this.files[selected] ? selected : 0);
                _this.editing = false;
                _this.event(_this.events.GALLERY_UPDATED, edit);
                _this.thumbnailsMove(edit.delayThumbnails !== undefined ? edit.delayThumbnails : 220);
            }, (edit.delayRefresh !== undefined ? edit.delayRefresh : 440));
        };
        ServiceController.prototype.deleteImage = function (index, count) {
            index = index === null || index === undefined ? this.selected : index;
            this.files.splice(index, count ? count : 1);
        };
        ServiceController.prototype.addImage = function (value, index) {
            if (value === undefined || value === null) {
                return;
            }
            var self = this;
            if (angular.isString(value) === true) {
                value = { source: { modal: value } };
            }
            var getAvailableSource = function (type, source) {
                if (source[type]) {
                    return self.options.baseUrl + source[type];
                }
                else {
                    if (type === 'panel') {
                        type = 'image';
                        if (source[type]) {
                            return self.options.baseUrl + source[type];
                        }
                    }
                    if (type === 'image') {
                        type = 'modal';
                        if (source[type]) {
                            return self.options.baseUrl + source[type];
                        }
                    }
                    if (type === 'modal') {
                        type = 'image';
                        if (source[type]) {
                            return self.options.baseUrl + source[type];
                        }
                    }
                }
            };
            if (!value.source) {
                value.source = {
                    modal: value[self.options.fields.source.modal],
                    panel: value[self.options.fields.source.panel],
                    image: value[self.options.fields.source.image],
                    placeholder: value[self.options.fields.source.placeholder]
                };
            }
            var source = {
                modal: getAvailableSource('modal', value.source),
                panel: getAvailableSource('panel', value.source),
                image: getAvailableSource('image', value.source),
                color: value.color ? value.color : 'transparent',
                placeholder: value.placeholder ? self.options.baseUrl + value.placeholder : null
            };
            if (!source.modal) {
                self.log('invalid image data', { source: source, value: value });
                return;
            }
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
            if (index !== undefined && this.files[index] !== undefined) {
                this.files[index] = file;
            }
            else {
                this.files.push(file);
            }
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
            this.modal = false;
            this.template = 'views/asg-thumbnail.html';
        }
        ThumbnailController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this);
            if (this.$scope && this.$scope.$parent && this.$scope.$parent.$parent && this.$scope.$parent.$parent.$ctrl) {
                this.modal = this.$scope.$parent.$parent.$ctrl.type === 'modal' ? true : false;
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
            if (this.config.hover.preload === true) {
                this.asg.hoverPreload(index);
            }
            if (this.config.hover.select === true) {
                this.asg.setSelected(index);
            }
        };
        Object.defineProperty(ThumbnailController.prototype, "config", {
            get: function () {
                return this.modal ? this.asg.options.modal[this.type] : this.asg.options[this.type];
            },
            set: function (value) {
                if (this.modal) {
                    this.asg.options[this.type] = value;
                }
                else {
                    this.asg.options.modal[this.type] = value;
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
        Object.defineProperty(ThumbnailController.prototype, "autohide", {
            get: function () {
                return this.config.autohide && this.asg.isSingle ? true : false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ThumbnailController.prototype, "classes", {
            get: function () {
                var show = 'initialized';
                if (this.modal) {
                    show = this.asg.modalInitialized ? 'initialized' : 'initializing';
                }
                return this.asg.classes + ' ' + this.dynamic + ' ' + show;
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
        template: '<div data-ng-if="!$ctrl.autohide" class="asg-thumbnail {{ $ctrl.classes }}" ng-click="$ctrl.asg.modalClick($event);"><div ng-include="$ctrl.template"></div></div>',
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzZy50cyIsImFzZy1jb250cm9sLnRzIiwiYXNnLWltYWdlLnRzIiwiYXNnLWluZm8udHMiLCJhc2ctbW9kYWwudHMiLCJhc2ctcGFuZWwudHMiLCJhc2ctc2VydmljZS50cyIsImFzZy10aHVtYm5haWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBVSxtQkFBbUIsQ0EyQjVCO0FBM0JELFdBQVUsbUJBQW1CO0lBRTVCLElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFdkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDdEIsT0FBTyxVQUFVLEtBQVcsRUFBRSxTQUFrQjtZQUUvQyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDakQsT0FBTyxFQUFFLENBQUM7YUFDVjtZQUVELElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtnQkFDaEIsT0FBTyxHQUFHLENBQUM7YUFDWDtZQUVELElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxFQUFFO2dCQUNyQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO2FBQ2Q7WUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FB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QUk7WUFDYixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxJQUFJO1NBQ2I7S0FDRCxDQUFDLENBQUM7QUFFSixDQUFDLEVBckpTLG1CQUFtQixLQUFuQixtQkFBbUIsUUFxSjVCIiwiZmlsZSI6ImFuZ3VsYXItc3VwZXItZ2FsbGVyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScsIFsnbmdBbmltYXRlJywgJ25nVG91Y2gnXSk7XHJcblxyXG5cdGFwcC5maWx0ZXIoJ2FzZ0J5dGVzJywgKCkgPT4ge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChieXRlcyA6IGFueSwgcHJlY2lzaW9uIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRpZiAoaXNOYU4ocGFyc2VGbG9hdChieXRlcykpIHx8ICFpc0Zpbml0ZShieXRlcykpIHtcclxuXHRcdFx0XHRyZXR1cm4gJyc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChieXRlcyA9PT0gMCkge1xyXG5cdFx0XHRcdHJldHVybiAnMCc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0eXBlb2YgcHJlY2lzaW9uID09PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdHByZWNpc2lvbiA9IDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCB1bml0cyA9IFsnYnl0ZXMnLCAna0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInXSxcclxuXHRcdFx0XHRudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgubG9nKGJ5dGVzKSAvIE1hdGgubG9nKDEwMjQpKTtcclxuXHJcblx0XHRcdHJldHVybiAoYnl0ZXMgLyBNYXRoLnBvdygxMDI0LCBNYXRoLmZsb29yKG51bWJlcikpKS50b0ZpeGVkKHByZWNpc2lvbikgKyAnICcgKyB1bml0c1tudW1iZXJdO1xyXG5cclxuXHRcdH07XHJcblx0fSk7XHJcblxyXG59XHJcblxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBDb250cm9sQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIHR5cGUgPSAnY29udHJvbCc7XHJcblx0XHRwcml2YXRlIGFzZzogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZTtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihcclxuXHRcdFx0cHJpdmF0ZSBzZXJ2aWNlOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHRcdHRoaXMudGVtcGxhdGUgPSAndmlld3MvYXNnLWNvbnRyb2wuaHRtbCc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0XHR0aGlzLiRzY29wZS5mb3J3YXJkID0gKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZCh0cnVlKTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHRoaXMuJHNjb3BlLmJhY2t3YXJkID0gKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQodHJ1ZSk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpOiBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBpbWFnZSBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlOiBJT3B0aW9uc0ltYWdlKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHY6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnQ29udHJvbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LkNvbnRyb2xDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImFzZy1jb250cm9sIHt7ICRjdHJsLmFzZy5jbGFzc2VzIH19XCI+PGRpdiBuZy1pbmNsdWRlPVwiJGN0cmwudGVtcGxhdGVcIj48L2Rpdj48L2Rpdj4nLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR0ZW1wbGF0ZTogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBJbWFnZUNvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZCA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRwdWJsaWMgaXRlbXMgOiBBcnJheTxJRmlsZT47XHJcblx0XHRwdWJsaWMgYmFzZVVybCA6IHN0cmluZztcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgPSAnaW1hZ2UnO1xyXG5cdFx0cHJpdmF0ZSBhc2cgOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkcm9vdFNjb3BlIDogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICRlbGVtZW50IDogbmcuSVJvb3RFbGVtZW50U2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHdpbmRvdyA6IG5nLklXaW5kb3dTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkc2NvcGUgOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHRcdGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKCdyZXNpemUnLCAoZXZlbnQpID0+IHtcclxuXHRcdFx0XHR0aGlzLm9uUmVzaXplKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIG9uUmVzaXplKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhlaWdodEF1dG8ub25yZXNpemUpIHtcclxuXHRcdFx0XHR0aGlzLnNldEhlaWdodCh0aGlzLmFzZy5maWxlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdFx0Ly8gc2V0IGltYWdlIGNvbXBvbmVudCBoZWlnaHRcclxuXHRcdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmFzZy5ldmVudHMuRklSU1RfSU1BR0UgKyB0aGlzLmlkLCAoZXZlbnQsIGRhdGEpID0+IHtcclxuXHJcblx0XHRcdFx0aWYgKCF0aGlzLmNvbmZpZy5oZWlnaHQgJiYgdGhpcy5jb25maWcuaGVpZ2h0QXV0by5pbml0aWFsID09PSB0cnVlKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldEhlaWdodChkYXRhLmltZyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLmFzZy50aHVtYm5haWxzTW92ZSgyMDApO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBzY29wZSBhcHBseSB3aGVuIGltYWdlIGxvYWRlZFxyXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJG9uKHRoaXMuYXNnLmV2ZW50cy5MT0FEX0lNQUdFICsgdGhpcy5pZCwgKGV2ZW50LCBkYXRhKSA9PiB7XHJcblxyXG5cdFx0XHRcdHRoaXMuJHNjb3BlLiRhcHBseSgpO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBpbWFnZSBjb21wb25lbnQgaGVpZ2h0XHJcblx0XHRwcml2YXRlIHNldEhlaWdodChpbWcpIHtcclxuXHJcblx0XHRcdGxldCB3aWR0aCA9IHRoaXMuJGVsZW1lbnQuY2hpbGRyZW4oJ2RpdicpWzBdLmNsaWVudFdpZHRoO1xyXG5cdFx0XHRsZXQgcmF0aW8gPSBpbWcud2lkdGggLyBpbWcuaGVpZ2h0O1xyXG5cdFx0XHR0aGlzLmNvbmZpZy5oZWlnaHQgPSB3aWR0aCAvIHJhdGlvO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBoZWlnaHRcclxuXHRcdHB1YmxpYyBnZXQgaGVpZ2h0KCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLmhlaWdodDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCBpbWFnZSBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBpbWFnZSBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNJbWFnZSkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cdFxyXG5cdFx0cHVibGljIHRvQmFja3dhcmQoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKCRldmVudCkge1xyXG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvRm9yd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHRpZiAoJGV2ZW50KSB7XHJcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBob3ZlcihpbmRleCA6IG51bWJlciwgJGV2ZW50PyA6IE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5hcnJvd3MucHJlbG9hZCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBtb2RhbCBhdmFpbGFibGVcclxuXHRcdHB1YmxpYyBnZXQgbW9kYWxBdmFpbGFibGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cubW9kYWxBdmFpbGFibGUgJiYgdGhpcy5jb25maWcuY2xpY2subW9kYWw7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG9wZW4gdGhlIG1vZGFsXHJcblx0XHRwdWJsaWMgbW9kYWxPcGVuKCRldmVudCA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICgkZXZlbnQpIHtcclxuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5tb2RhbCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLm1vZGFsT3Blbih0aGlzLmFzZy5zZWxlY3RlZCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dJbWFnZScsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckcm9vdFNjb3BlJywgJyRlbGVtZW50JywgJyR3aW5kb3cnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5JbWFnZUNvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9hc2ctaW1hZ2UuaHRtbCcsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgSW5mb0NvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZDogc3RyaW5nO1xyXG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgdHlwZTtcclxuXHRcdHByaXZhdGUgdGVtcGxhdGU7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IoXHJcblx0XHRcdHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRwcml2YXRlICRzY29wZTogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHR0aGlzLnR5cGUgPSAnaW5mbyc7XHJcblx0XHRcdHRoaXMudGVtcGxhdGUgPSAndmlld3MvYXNnLWluZm8uaHRtbCc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLmZpbGU7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0luZm8nLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5JbmZvQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctaW5mbyB7eyAkY3RybC5hc2cuY2xhc3NlcyB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgTW9kYWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmwgOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ21vZGFsJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSBhcnJvd3NWaXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkd2luZG93IDogbmcuSVdpbmRvd1NlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICRyb290U2NvcGUgOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbEF2YWlsYWJsZSA9IHRydWU7XHJcblxyXG5cdFx0XHQvLyBzY29wZSBhcHBseSB3aGVuIGltYWdlIGxvYWRlZFxyXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJG9uKHRoaXMuYXNnLmV2ZW50cy5MT0FEX0lNQUdFICsgdGhpcy5pZCwgKGV2ZW50LCBkYXRhKSA9PiB7XHJcblx0XHRcdFx0dGhpcy4kc2NvcGUuJGFwcGx5KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgZ2V0Q2xhc3MoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuY29uZmlnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgbmdDbGFzcyA9IFtdO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhlYWRlci5keW5hbWljKSB7XHJcblx0XHRcdFx0bmdDbGFzcy5wdXNoKCdkeW5hbWljJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5nQ2xhc3MucHVzaCh0aGlzLmFzZy5vcHRpb25zLnRoZW1lKTtcclxuXHJcblx0XHRcdHJldHVybiBuZ0NsYXNzLmpvaW4oJyAnKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGFjdGlvbiBmcm9tIGtleWNvZGVzXHJcblx0XHRwcml2YXRlIGdldEFjdGlvbkJ5S2V5Q29kZShrZXlDb2RlIDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmtleWNvZGVzKTtcclxuXHRcdFx0bGV0IGFjdGlvbjtcclxuXHJcblx0XHRcdGZvciAobGV0IGtleSBpbiBrZXlzKSB7XHJcblxyXG5cdFx0XHRcdGxldCBjb2RlcyA9IHRoaXMuY29uZmlnLmtleWNvZGVzW2tleXNba2V5XV07XHJcblxyXG5cdFx0XHRcdGlmICghY29kZXMpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGluZGV4ID0gY29kZXMuaW5kZXhPZihrZXlDb2RlKTtcclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcclxuXHRcdFx0XHRcdGFjdGlvbiA9IGtleXNba2V5XTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBhY3Rpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgY2xvc2UoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbG9zZSgpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsKSB7XHJcblx0XHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwuZXhpdCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBpbWFnZUNsaWNrKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2suY2xvc2UpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbENsb3NlKCk7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwuZXhpdCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgaG92ZXIoaW5kZXggOiBudW1iZXIsICRldmVudD8gOiBNb3VzZUV2ZW50KSB7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuYXJyb3dzLnByZWxvYWQgPT09IHRydWUpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5ob3ZlclByZWxvYWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBzZXRGb2N1cygkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlUb2dnbGUoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cuYXV0b1BsYXlUb2dnbGUoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvRmlyc3Qoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy50b0ZpcnN0KCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvRm9yd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvTGFzdChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnRvTGFzdChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZG8ga2V5Ym9hcmQgYWN0aW9uXHJcblx0XHRwdWJsaWMga2V5VXAoZSA6IEtleWJvYXJkRXZlbnQpIHtcclxuXHJcblx0XHRcdGxldCBhY3Rpb24gOiBzdHJpbmcgPSB0aGlzLmdldEFjdGlvbkJ5S2V5Q29kZShlLmtleUNvZGUpO1xyXG5cclxuXHRcdFx0c3dpdGNoIChhY3Rpb24pIHtcclxuXHJcblx0XHRcdFx0Y2FzZSAnZXhpdCc6XHJcblx0XHRcdFx0XHR0aGlzLmNsb3NlKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAncGxheXBhdXNlJzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLmF1dG9QbGF5VG9nZ2xlKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnZm9yd2FyZCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnYmFja3dhcmQnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdmaXJzdCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0ZpcnN0KHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2xhc3QnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9MYXN0KHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2Z1bGxzY3JlZW4nOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVGdWxsU2NyZWVuKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnbWVudSc6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1lbnUoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdjYXB0aW9uJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlQ2FwdGlvbigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2hlbHAnOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVIZWxwKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnc2l6ZSc6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZVNpemUoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICd0cmFuc2l0aW9uJzpcclxuXHRcdFx0XHRcdHRoaXMubmV4dFRyYW5zaXRpb24oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cubG9nKCd1bmtub3duIGtleWJvYXJkIGFjdGlvbjogJyArIGUua2V5Q29kZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHN3aXRjaCB0byBuZXh0IHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRwcml2YXRlIG5leHRUcmFuc2l0aW9uKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdGxldCBpZHggPSB0aGlzLmFzZy50cmFuc2l0aW9ucy5pbmRleE9mKHRoaXMuY29uZmlnLnRyYW5zaXRpb24pICsgMTtcclxuXHRcdFx0bGV0IG5leHQgPSBpZHggPj0gdGhpcy5hc2cudHJhbnNpdGlvbnMubGVuZ3RoID8gMCA6IGlkeDtcclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRoaXMuYXNnLnRyYW5zaXRpb25zW25leHRdO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGZ1bGxzY3JlZW5cclxuXHRcdHByaXZhdGUgdG9nZ2xlRnVsbFNjcmVlbigkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsKSB7XHJcblx0XHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwudG9nZ2xlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIHRodW1ibmFpbHNcclxuXHRcdHByaXZhdGUgdG9nZ2xlVGh1bWJuYWlscygkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmNvbmZpZy50aHVtYm5haWwuZHluYW1pYyA9ICF0aGlzLmNvbmZpZy50aHVtYm5haWwuZHluYW1pYztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRwdWJsaWMgc2V0VHJhbnNpdGlvbih0cmFuc2l0aW9uLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmNvbmZpZy50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRoZW1lXHJcblx0XHRwdWJsaWMgc2V0VGhlbWUodGhlbWUgOiBzdHJpbmcsICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnMudGhlbWUgPSB0aGVtZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGhlbHBcclxuXHRcdHByaXZhdGUgdG9nZ2xlSGVscCgkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmNvbmZpZy5oZWxwID0gIXRoaXMuY29uZmlnLmhlbHA7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBzaXplXHJcblx0XHRwcml2YXRlIHRvZ2dsZVNpemUoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0bGV0IGluZGV4ID0gdGhpcy5hc2cuc2l6ZXMuaW5kZXhPZih0aGlzLmNvbmZpZy5zaXplKTtcclxuXHRcdFx0aW5kZXggPSAoaW5kZXggKyAxKSA+PSB0aGlzLmFzZy5zaXplcy5sZW5ndGggPyAwIDogKytpbmRleDtcclxuXHRcdFx0dGhpcy5jb25maWcuc2l6ZSA9IHRoaXMuYXNnLnNpemVzW2luZGV4XTtcclxuXHRcdFx0dGhpcy5hc2cubG9nKCd0b2dnbGUgaW1hZ2Ugc2l6ZTonLCBbdGhpcy5jb25maWcuc2l6ZSwgaW5kZXhdKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIG1lbnVcclxuXHRcdHByaXZhdGUgdG9nZ2xlTWVudSgkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmNvbmZpZy5oZWFkZXIuZHluYW1pYyA9ICF0aGlzLmNvbmZpZy5oZWFkZXIuZHluYW1pYztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGNhcHRpb25cclxuXHRcdHByaXZhdGUgdG9nZ2xlQ2FwdGlvbigpIHtcclxuXHJcblx0XHRcdHRoaXMuY29uZmlnLmNhcHRpb24udmlzaWJsZSA9ICF0aGlzLmNvbmZpZy5jYXB0aW9uLnZpc2libGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtYXJnaW50IHRvcFxyXG5cdFx0cHVibGljIGdldCBtYXJnaW5Ub3AoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcubWFyZ2luVG9wO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbWFyZ2luIGJvdHRvbVxyXG5cdFx0cHVibGljIGdldCBtYXJnaW5Cb3R0b20oKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcubWFyZ2luQm90dG9tO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbW9kYWwgdmlzaWJsZVxyXG5cdFx0cHVibGljIGdldCB2aXNpYmxlKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm1vZGFsVmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IG1vZGFsIHZpc2libGVcclxuXHRcdHB1YmxpYyBzZXQgdmlzaWJsZSh2YWx1ZSA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsVmlzaWJsZSA9IHZhbHVlO1xyXG5cdFx0XHR0aGlzLmFzZy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1vZGFsIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKSA6IElPcHRpb25zTW9kYWwge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IG1vZGFsIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc01vZGFsKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnTW9kYWwnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHdpbmRvdycsICckcm9vdFNjb3BlJywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuTW9kYWxDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLW1vZGFsLmh0bWwnLFxyXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PycsXHJcblx0XHRcdGJhc2VVcmw6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgUGFuZWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtczogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmw6IHN0cmluZztcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgPSAncGFuZWwnO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZTtcclxuXHRcdHByaXZhdGUgYXNnOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IoXHJcblx0XHRcdHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRwcml2YXRlICRzY29wZTogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHR0aGlzLnRlbXBsYXRlID0gJ3ZpZXdzL2FzZy1wYW5lbC5odG1sJztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXg6IG51bWJlciwgJGV2ZW50PzogTW91c2VFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLm1vZGFsKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxPcGVuKGluZGV4KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5zZWxlY3QpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5zZXRTZWxlY3RlZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGhvdmVyKGluZGV4OiBudW1iZXIsICRldmVudD86IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5ob3Zlci5wcmVsb2FkID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuaG92ZXJQcmVsb2FkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhvdmVyLnNlbGVjdCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgcGFuZWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpOiBJT3B0aW9uc1BhbmVsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBwYW5lbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlOiBJT3B0aW9uc1BhbmVsKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHY6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dQYW5lbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LlBhbmVsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctcGFuZWwge3sgJGN0cmwuYXNnLmNsYXNzZXMgfX1cIiBuZy1tb3VzZW92ZXI9XCIkY3RybC5hc2cub3Zlci5wYW5lbCA9IHRydWU7XCIgbmctbW91c2VsZWF2ZT1cIiRjdHJsLmFzZy5vdmVyLnBhbmVsID0gZmFsc2U7XCIgbmctc2hvdz1cIiRjdHJsLmNvbmZpZy52aXNpYmxlXCI+PGRpdiBuZy1pbmNsdWRlPVwiJGN0cmwudGVtcGxhdGVcIj48L2Rpdj48bmctdHJhbnNjbHVkZT48L25nLXRyYW5zY2x1ZGU+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0AnLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nLFxyXG5cdFx0XHRiYXNlVXJsOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0Ly8gbW9kYWwgY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zTW9kYWwge1xyXG5cclxuXHRcdGhlYWRlcj86IHtcclxuXHRcdFx0ZW5hYmxlZD86IGJvb2xlYW47XHJcblx0XHRcdGR5bmFtaWM/OiBib29sZWFuO1xyXG5cdFx0XHRidXR0b25zOiBBcnJheTxzdHJpbmc+O1xyXG5cdFx0fTtcclxuXHRcdGhlbHA/OiBib29sZWFuO1xyXG5cdFx0Y2FwdGlvbj86IHtcclxuXHRcdFx0ZGlzYWJsZWQ/OiBib29sZWFuO1xyXG5cdFx0XHR2aXNpYmxlPzogYm9vbGVhbjtcclxuXHRcdFx0cG9zaXRpb24/OiBzdHJpbmc7XHJcblx0XHR9O1xyXG5cdFx0dHJhbnNpdGlvbj86IHN0cmluZztcclxuXHRcdHRpdGxlPzogc3RyaW5nO1xyXG5cdFx0c3VidGl0bGU/OiBzdHJpbmc7XHJcblx0XHRhcnJvd3M/OiB7XHJcblx0XHRcdHByZWxvYWQ/OiBib29sZWFuO1xyXG5cdFx0XHRlbmFibGVkPzogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRzaXplPzogc3RyaW5nO1xyXG5cdFx0dGh1bWJuYWlsPzogSU9wdGlvbnNUaHVtYm5haWw7XHJcblx0XHRtYXJnaW5Ub3A/OiBudW1iZXI7XHJcblx0XHRtYXJnaW5Cb3R0b20/OiBudW1iZXI7XHJcblx0XHRjbGljaz86IHtcclxuXHRcdFx0Y2xvc2U6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0a2V5Y29kZXM/OiB7XHJcblx0XHRcdGV4aXQ/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRwbGF5cGF1c2U/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRmb3J3YXJkPzogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0YmFja3dhcmQ/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRmaXJzdD86IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGxhc3Q/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRmdWxsc2NyZWVuPzogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0bWVudT86IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGNhcHRpb24/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRoZWxwPzogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0c2l6ZT86IEFycmF5PG51bWJlcj47XHJcblx0XHRcdHRyYW5zaXRpb24/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdC8vIHBhbmVsIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc1BhbmVsIHtcclxuXHJcblx0XHR2aXNpYmxlPzogYm9vbGVhbjtcclxuXHRcdGl0ZW0/OiB7XHJcblx0XHRcdGNsYXNzPzogc3RyaW5nO1xyXG5cdFx0XHRjYXB0aW9uOiBib29sZWFuO1xyXG5cdFx0XHRpbmRleDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRob3Zlcj86IHtcclxuXHRcdFx0cHJlbG9hZDogYm9vbGVhbjtcclxuXHRcdFx0c2VsZWN0OiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHRcdGNsaWNrPzoge1xyXG5cdFx0XHRzZWxlY3Q6IGJvb2xlYW47XHJcblx0XHRcdG1vZGFsOiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHQvLyB0aHVtYm5haWwgY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zVGh1bWJuYWlsIHtcclxuXHJcblx0XHRoZWlnaHQ/OiBudW1iZXI7XHJcblx0XHRpbmRleD86IGJvb2xlYW47XHJcblx0XHRlbmFibGVkPzogYm9vbGVhbjtcclxuXHRcdGR5bmFtaWM/OiBib29sZWFuO1xyXG5cdFx0YXV0b2hpZGU6IGJvb2xlYW47XHJcblx0XHRjbGljaz86IHtcclxuXHRcdFx0c2VsZWN0OiBib29sZWFuO1xyXG5cdFx0XHRtb2RhbDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRob3Zlcj86IHtcclxuXHRcdFx0cHJlbG9hZDogYm9vbGVhbjtcclxuXHRcdFx0c2VsZWN0OiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHQvLyBpbmZvIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0luZm8ge1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHR0cmFuc2l0aW9uPzogc3RyaW5nO1xyXG5cdFx0c2l6ZT86IHN0cmluZztcclxuXHRcdGFycm93cz86IHtcclxuXHRcdFx0cHJlbG9hZD86IGJvb2xlYW47XHJcblx0XHRcdGVuYWJsZWQ/OiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHRcdGNsaWNrPzoge1xyXG5cdFx0XHRtb2RhbDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRoZWlnaHQ/OiBudW1iZXI7XHJcblx0XHRoZWlnaHRNaW4/OiBudW1iZXI7XHJcblx0XHRoZWlnaHRBdXRvPzoge1xyXG5cdFx0XHRpbml0aWFsPzogYm9vbGVhbjtcclxuXHRcdFx0b25yZXNpemU/OiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHQvLyBnYWxsZXJ5IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zIHtcclxuXHJcblx0XHRkZWJ1Zz86IGJvb2xlYW47XHJcblx0XHRiYXNlVXJsPzogc3RyaW5nO1xyXG5cdFx0aGFzaFVybD86IGJvb2xlYW47XHJcblx0XHRmaWVsZHM/OiB7XHJcblx0XHRcdHNvdXJjZT86IHtcclxuXHRcdFx0XHRtb2RhbD86IHN0cmluZztcclxuXHRcdFx0XHRwYW5lbD86IHN0cmluZztcclxuXHRcdFx0XHRpbWFnZT86IHN0cmluZztcclxuXHRcdFx0XHRwbGFjZWhvbGRlcj86IHN0cmluZztcclxuXHRcdFx0fVxyXG5cdFx0XHR0aXRsZT86IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb24/OiBzdHJpbmc7XHJcblx0XHRcdHRodW1ibmFpbD86IHN0cmluZztcclxuXHRcdH07XHJcblx0XHRhdXRvcGxheT86IHtcclxuXHRcdFx0ZW5hYmxlZD86IGJvb2xlYW47XHJcblx0XHRcdGRlbGF5PzogbnVtYmVyO1xyXG5cdFx0fTtcclxuXHRcdHRoZW1lPzogc3RyaW5nO1xyXG5cdFx0cHJlbG9hZD86IEFycmF5PG51bWJlcj47XHJcblx0XHRwcmVsb2FkTmV4dD86IGJvb2xlYW47XHJcblx0XHRwcmVsb2FkRGVsYXk/OiBudW1iZXI7XHJcblx0XHRsb2FkaW5nSW1hZ2U/OiBzdHJpbmc7XHJcblx0XHRtb2RhbD86IElPcHRpb25zTW9kYWw7XHJcblx0XHRwYW5lbD86IElPcHRpb25zUGFuZWw7XHJcblx0XHRpbWFnZT86IElPcHRpb25zSW1hZ2U7XHJcblx0XHR0aHVtYm5haWw/OiBJT3B0aW9uc1RodW1ibmFpbDtcclxuXHJcblx0fVxyXG5cclxuXHQvLyBpbWFnZSBzb3VyY2VcclxuXHRleHBvcnQgaW50ZXJmYWNlIElTb3VyY2Uge1xyXG5cclxuXHRcdG1vZGFsOiBzdHJpbmc7IC8vIG9yaWdpbmFsLCByZXF1aXJlZFxyXG5cdFx0cGFuZWw/OiBzdHJpbmc7XHJcblx0XHRpbWFnZT86IHN0cmluZztcclxuXHRcdGNvbG9yPzogc3RyaW5nO1xyXG5cdFx0cGxhY2Vob2xkZXI/OiBzdHJpbmc7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gaW1hZ2UgZmlsZVxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUZpbGUge1xyXG5cclxuXHRcdHNvdXJjZTogSVNvdXJjZTtcclxuXHRcdHRpdGxlPzogc3RyaW5nO1xyXG5cdFx0bmFtZT86IHN0cmluZztcclxuXHRcdGV4dGVuc2lvbj86IHN0cmluZztcclxuXHRcdGRlc2NyaXB0aW9uPzogc3RyaW5nO1xyXG5cdFx0ZG93bmxvYWQ/OiBzdHJpbmc7XHJcblx0XHRsb2FkZWQ/OiB7XHJcblx0XHRcdG1vZGFsPzogYm9vbGVhbjtcclxuXHRcdFx0cGFuZWw/OiBib29sZWFuO1xyXG5cdFx0XHRpbWFnZT86IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0d2lkdGg/OiBudW1iZXI7XHJcblx0XHRoZWlnaHQ/OiBudW1iZXI7XHJcblxyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3ZlciB7XHJcblx0XHRtb2RhbEltYWdlOiBib29sZWFuO1xyXG5cdFx0cGFuZWw6IGJvb2xlYW47XHJcblx0fVxyXG5cclxuXHRleHBvcnQgaW50ZXJmYWNlIElFZGl0IHtcclxuXHRcdGRlbGV0ZTogbnVtYmVyO1xyXG5cdFx0YWRkOiBBcnJheTxJRmlsZT47XHJcblx0XHR1cGRhdGU6IEFycmF5PElGaWxlPjtcclxuXHRcdHJlZnJlc2g6IGJvb2xlYW47XHJcblx0XHRvcHRpb25zOiBJT3B0aW9ucztcclxuXHRcdGRlbGF5VGh1bWJuYWlsczogbnVtYmVyO1xyXG5cdFx0ZGVsYXlSZWZyZXNoOiBudW1iZXI7XHJcblx0fVxyXG5cclxuXHQvLyBzZXJ2aWNlIGNvbnRyb2xsZXIgaW50ZXJmYWNlXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJU2VydmljZUNvbnRyb2xsZXIge1xyXG5cclxuXHRcdG1vZGFsVmlzaWJsZTogYm9vbGVhbjtcclxuXHRcdHBhbmVsVmlzaWJsZTogYm9vbGVhbjtcclxuXHRcdG1vZGFsQXZhaWxhYmxlOiBib29sZWFuO1xyXG5cdFx0bW9kYWxJbml0aWFsaXplZDogYm9vbGVhbjtcclxuXHRcdHRyYW5zaXRpb25zOiBBcnJheTxzdHJpbmc+O1xyXG5cdFx0dGhlbWVzOiBBcnJheTxzdHJpbmc+O1xyXG5cdFx0Y2xhc3Nlczogc3RyaW5nO1xyXG5cdFx0b3B0aW9uczogSU9wdGlvbnM7XHJcblx0XHRpdGVtczogQXJyYXk8SUZpbGU+O1xyXG5cdFx0c2VsZWN0ZWQ6IG51bWJlcjtcclxuXHRcdGZpbGU6IElGaWxlO1xyXG5cdFx0c2l6ZXM6IEFycmF5PHN0cmluZz47XHJcblx0XHRpZDogc3RyaW5nO1xyXG5cdFx0aXNTaW5nbGU6IGJvb2xlYW47XHJcblx0XHRldmVudHM6IHtcclxuXHRcdFx0Q09ORklHX0xPQUQ6IHN0cmluZztcclxuXHRcdFx0QVVUT1BMQVlfU1RBUlQ6IHN0cmluZztcclxuXHRcdFx0QVVUT1BMQVlfU1RPUDogc3RyaW5nO1xyXG5cdFx0XHRQQVJTRV9JTUFHRVM6IHN0cmluZztcclxuXHRcdFx0TE9BRF9JTUFHRTogc3RyaW5nO1xyXG5cdFx0XHRGSVJTVF9JTUFHRTogc3RyaW5nO1xyXG5cdFx0XHRDSEFOR0VfSU1BR0U6IHN0cmluZztcclxuXHRcdFx0TU9EQUxfT1BFTjogc3RyaW5nO1xyXG5cdFx0XHRNT0RBTF9DTE9TRTogc3RyaW5nO1xyXG5cdFx0XHRHQUxMRVJZX1VQREFURUQ6IHN0cmluZztcclxuXHRcdFx0R0FMTEVSWV9FRElUOiBzdHJpbmc7XHJcblx0XHR9O1xyXG5cclxuXHRcdGdldEluc3RhbmNlKGNvbXBvbmVudDogYW55KTogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdHNldERlZmF1bHRzKCk6IHZvaWQ7XHJcblxyXG5cdFx0c2V0T3B0aW9ucyhvcHRpb25zOiBJT3B0aW9ucyk6IElPcHRpb25zO1xyXG5cclxuXHRcdHNldEl0ZW1zKGl0ZW1zOiBBcnJheTxJRmlsZT4sIGZvcmNlPzogYm9vbGVhbik6IHZvaWQ7XHJcblxyXG5cdFx0cHJlbG9hZCh3YWl0PzogbnVtYmVyKTogdm9pZDtcclxuXHJcblx0XHRub3JtYWxpemUoaW5kZXg6IG51bWJlcik6IG51bWJlcjtcclxuXHJcblx0XHRzZXRGb2N1cygpOiB2b2lkO1xyXG5cclxuXHRcdHNldFNlbGVjdGVkKGluZGV4OiBudW1iZXIpO1xyXG5cclxuXHRcdG1vZGFsT3BlbihpbmRleDogbnVtYmVyKTogdm9pZDtcclxuXHJcblx0XHRtb2RhbENsb3NlKCk6IHZvaWQ7XHJcblxyXG5cdFx0bW9kYWxDbGljaygkZXZlbnQ/OiBVSUV2ZW50KTogdm9pZDtcclxuXHJcblx0XHR0aHVtYm5haWxzTW92ZShkZWxheT86IG51bWJlcik6IHZvaWQ7XHJcblxyXG5cdFx0dG9CYWNrd2FyZChzdG9wPzogYm9vbGVhbik6IHZvaWQ7XHJcblxyXG5cdFx0dG9Gb3J3YXJkKHN0b3A/OiBib29sZWFuKTogdm9pZDtcclxuXHJcblx0XHR0b0ZpcnN0KHN0b3A/OiBib29sZWFuKTogdm9pZDtcclxuXHJcblx0XHR0b0xhc3Qoc3RvcD86IGJvb2xlYW4pOiB2b2lkO1xyXG5cclxuXHRcdGxvYWRJbWFnZShpbmRleD86IG51bWJlcik6IHZvaWQ7XHJcblxyXG5cdFx0bG9hZEltYWdlcyhpbmRleGVzOiBBcnJheTxudW1iZXI+KTogdm9pZDtcclxuXHJcblx0XHRob3ZlclByZWxvYWQoaW5kZXg6IG51bWJlcik6IHZvaWQ7XHJcblxyXG5cdFx0YXV0b1BsYXlUb2dnbGUoKTogdm9pZDtcclxuXHJcblx0XHR0b2dnbGUoZWxlbWVudDogc3RyaW5nKTogdm9pZDtcclxuXHJcblx0XHRzZXRIYXNoKCk6IHZvaWQ7XHJcblxyXG5cdFx0ZG93bmxvYWRMaW5rKCk6IHN0cmluZztcclxuXHJcblx0XHRlbChzZWxlY3Rvcik6IE5vZGVMaXN0O1xyXG5cclxuXHRcdGxvZyhldmVudDogc3RyaW5nLCBkYXRhPzogYW55KTogdm9pZDtcclxuXHJcblxyXG5cdH1cclxuXHJcblx0Ly8gc2VydmljZSBjb250cm9sbGVyXHJcblx0ZXhwb3J0IGNsYXNzIFNlcnZpY2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgc2x1ZyA9ICdhc2cnO1xyXG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgaXRlbXM6IGFueTtcclxuXHRcdHB1YmxpYyBmaWxlczogQXJyYXk8SUZpbGU+ID0gW107XHJcblx0XHRwdWJsaWMgZGlyZWN0aW9uOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgbW9kYWxBdmFpbGFibGUgPSBmYWxzZTtcclxuXHRcdHB1YmxpYyBtb2RhbEluaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG5cdFx0cHJpdmF0ZSBpbnN0YW5jZXM6IHt9ID0ge307XHJcblx0XHRwcml2YXRlIF9zZWxlY3RlZDogbnVtYmVyO1xyXG5cdFx0cHJpdmF0ZSBfdmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBhdXRvcGxheTogYW5ndWxhci5JUHJvbWlzZTxhbnk+O1xyXG5cdFx0cHJpdmF0ZSBmaXJzdCA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBlZGl0aW5nID0gZmFsc2U7XHJcblxyXG5cdFx0cHVibGljIG9wdGlvbnM6IElPcHRpb25zID0gbnVsbDtcclxuXHRcdHB1YmxpYyBvcHRpb25zTG9hZGVkID0gZmFsc2U7XHJcblx0XHRwdWJsaWMgZGVmYXVsdHM6IElPcHRpb25zID0ge1xyXG5cdFx0XHRkZWJ1ZzogZmFsc2UsIC8vIGltYWdlIGxvYWQsIGF1dG9wbGF5LCBldGMuIGluZm8gaW4gY29uc29sZS5sb2dcclxuXHRcdFx0aGFzaFVybDogdHJ1ZSwgLy8gZW5hYmxlL2Rpc2FibGUgaGFzaCB1c2FnZSBpbiB1cmwgKCNhc2ctbmF0dXJlLTQpXHJcblx0XHRcdGJhc2VVcmw6ICcnLCAvLyB1cmwgcHJlZml4XHJcblx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdHNvdXJjZToge1xyXG5cdFx0XHRcdFx0bW9kYWw6ICd1cmwnLCAvLyByZXF1aXJlZCwgaW1hZ2UgdXJsIGZvciBtb2RhbCBjb21wb25lbnQgKGxhcmdlIHNpemUpXHJcblx0XHRcdFx0XHRwYW5lbDogJ3VybCcsIC8vIGltYWdlIHVybCBmb3IgcGFuZWwgY29tcG9uZW50ICh0aHVtYm5haWwgc2l6ZSlcclxuXHRcdFx0XHRcdGltYWdlOiAndXJsJywgLy8gaW1hZ2UgdXJsIGZvciBpbWFnZSAobWVkaXVtIG9yIGN1c3RvbSBzaXplKVxyXG5cdFx0XHRcdFx0cGxhY2Vob2xkZXI6IG51bGwgLy8gaW1hZ2UgdXJsIGZvciBwcmVsb2FkIGxvd3JlcyBpbWFnZVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dGl0bGU6ICd0aXRsZScsIC8vIHRpdGxlIGZpZWxkIG5hbWVcclxuXHRcdFx0XHRkZXNjcmlwdGlvbjogJ2Rlc2NyaXB0aW9uJywgLy8gZGVzY3JpcHRpb24gZmllbGQgbmFtZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhdXRvcGxheToge1xyXG5cdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLCAvLyBzbGlkZXNob3cgcGxheSBlbmFibGVkL2Rpc2FibGVkXHJcblx0XHRcdFx0ZGVsYXk6IDQxMDAgLy8gYXV0b3BsYXkgZGVsYXkgaW4gbWlsbGlzZWNvbmRcclxuXHRcdFx0fSxcclxuXHRcdFx0dGhlbWU6ICdkZWZhdWx0JywgLy8gY3NzIHN0eWxlIFtkZWZhdWx0LCBkYXJrYmx1ZSwgZGFya3JlZCwgd2hpdGVnb2xkXVx0XHRcclxuXHRcdFx0cHJlbG9hZE5leHQ6IGZhbHNlLCAvLyBwcmVsb2FkIG5leHQgaW1hZ2UgKGZvcndhcmQvYmFja3dhcmQpXHJcblx0XHRcdHByZWxvYWREZWxheTogNzcwLCAvLyBwcmVsb2FkIGRlbGF5IGZvciBwcmVsb2FkTmV4dFxyXG5cdFx0XHRsb2FkaW5nSW1hZ2U6ICdwcmVsb2FkLnN2ZycsIC8vIGxvYWRlciBpbWFnZVxyXG5cdFx0XHRwcmVsb2FkOiBbXSwgLy8gcHJlbG9hZCBpbWFnZXMgYnkgaW5kZXggbnVtYmVyXHJcblx0XHRcdG1vZGFsOiB7XHJcblx0XHRcdFx0dGl0bGU6ICcnLCAvLyBtb2RhbCB3aW5kb3cgdGl0bGVcclxuXHRcdFx0XHRzdWJ0aXRsZTogJycsIC8vIG1vZGFsIHdpbmRvdyBzdWJ0aXRsZVxyXG5cdFx0XHRcdGNhcHRpb246IHtcclxuXHRcdFx0XHRcdGRpc2FibGVkOiBmYWxzZSwgLy8gZGlzYWJsZSBpbWFnZSBjYXB0aW9uXHJcblx0XHRcdFx0XHR2aXNpYmxlOiB0cnVlLCAvLyBzaG93L2hpZGUgaW1hZ2UgY2FwdGlvblxyXG5cdFx0XHRcdFx0cG9zaXRpb246ICd0b3AnIC8vIGNhcHRpb24gcG9zaXRpb24gW3RvcCwgYm90dG9tXVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGVhZGVyOiB7XHJcblx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLCAvLyBlbmFibGUvZGlzYWJsZSBtb2RhbCBtZW51XHJcblx0XHRcdFx0XHRkeW5hbWljOiBmYWxzZSwgLy8gc2hvdy9oaWRlIG1vZGFsIG1lbnUgb24gbW91c2VvdmVyXHJcblx0XHRcdFx0XHRidXR0b25zOiBbJ3BsYXlzdG9wJywgJ2luZGV4JywgJ3ByZXYnLCAnbmV4dCcsICdwaW4nLCAnc2l6ZScsICd0cmFuc2l0aW9uJywgJ3RodW1ibmFpbHMnLCAnZnVsbHNjcmVlbicsICdoZWxwJywgJ2Nsb3NlJ10sXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRoZWxwOiBmYWxzZSwgLy8gc2hvdy9oaWRlIGhlbHBcclxuXHRcdFx0XHRhcnJvd3M6IHtcclxuXHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsIC8vIHNob3cvaGlkZSBhcnJvd3NcclxuXHRcdFx0XHRcdHByZWxvYWQ6IHRydWUsIC8vIHByZWxvYWQgaW1hZ2Ugb24gbW91c2VvdmVyXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRjbGljazoge1xyXG5cdFx0XHRcdFx0Y2xvc2U6IHRydWUgLy8gd2hlbiBjbGljayBvbiB0aGUgaW1hZ2UgY2xvc2UgdGhlIG1vZGFsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR0aHVtYm5haWw6IHtcclxuXHRcdFx0XHRcdGhlaWdodDogNTAsIC8vIHRodW1ibmFpbCBpbWFnZSBoZWlnaHQgaW4gcGl4ZWxcclxuXHRcdFx0XHRcdGluZGV4OiBmYWxzZSwgLy8gc2hvdyBpbmRleCBudW1iZXIgb24gdGh1bWJuYWlsXHJcblx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLCAvLyBlbmFibGUvZGlzYWJsZSB0aHVtYm5haWxzXHJcblx0XHRcdFx0XHRkeW5hbWljOiBmYWxzZSwgLy8gaWYgdHJ1ZSB0aHVtYm5haWxzIHZpc2libGUgb25seSB3aGVuIG1vdXNlb3ZlclxyXG5cdFx0XHRcdFx0YXV0b2hpZGU6IHRydWUsIC8vIGhpZGUgdGh1bWJuYWlsIGNvbXBvbmVudCB3aGVuIHNpbmdsZSBpbWFnZVxyXG5cdFx0XHRcdFx0Y2xpY2s6IHtcclxuXHRcdFx0XHRcdFx0c2VsZWN0OiB0cnVlLCAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugd2hlbiB0cnVlXHJcblx0XHRcdFx0XHRcdG1vZGFsOiBmYWxzZSAvLyBvcGVuIG1vZGFsIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGhvdmVyOiB7XHJcblx0XHRcdFx0XHRcdHByZWxvYWQ6IHRydWUsIC8vIHByZWxvYWQgaW1hZ2Ugb24gbW91c2VvdmVyXHJcblx0XHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRcdFx0c2l6ZTogJ2NvdmVyJywgLy8gY29udGFpbiwgY292ZXIsIGF1dG8sIHN0cmV0Y2hcclxuXHRcdFx0XHRrZXljb2Rlczoge1xyXG5cdFx0XHRcdFx0ZXhpdDogWzI3XSwgLy8gZXNjXHJcblx0XHRcdFx0XHRwbGF5cGF1c2U6IFs4MF0sIC8vIHBcclxuXHRcdFx0XHRcdGZvcndhcmQ6IFszMiwgMzldLCAvLyBzcGFjZSwgcmlnaHQgYXJyb3dcclxuXHRcdFx0XHRcdGJhY2t3YXJkOiBbMzddLCAvLyBsZWZ0IGFycm93XHJcblx0XHRcdFx0XHRmaXJzdDogWzM4LCAzNl0sIC8vIHVwIGFycm93LCBob21lXHJcblx0XHRcdFx0XHRsYXN0OiBbNDAsIDM1XSwgLy8gZG93biBhcnJvdywgZW5kXHJcblx0XHRcdFx0XHRmdWxsc2NyZWVuOiBbMTNdLCAvLyBlbnRlclxyXG5cdFx0XHRcdFx0bWVudTogWzc3XSwgLy8gbVxyXG5cdFx0XHRcdFx0Y2FwdGlvbjogWzY3XSwgLy8gY1xyXG5cdFx0XHRcdFx0aGVscDogWzcyXSwgLy8gaFxyXG5cdFx0XHRcdFx0c2l6ZTogWzgzXSwgLy8gc1xyXG5cdFx0XHRcdFx0dHJhbnNpdGlvbjogWzg0XSAvLyB0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR0aHVtYm5haWw6IHtcclxuXHRcdFx0XHRoZWlnaHQ6IDUwLCAvLyB0aHVtYm5haWwgaW1hZ2UgaGVpZ2h0IGluIHBpeGVsXHJcblx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93IGluZGV4IG51bWJlciBvbiB0aHVtYm5haWxcclxuXHRcdFx0XHRkeW5hbWljOiBmYWxzZSwgLy8gaWYgdHJ1ZSB0aHVtYm5haWxzIHZpc2libGUgb25seSB3aGVuIG1vdXNlb3ZlclxyXG5cdFx0XHRcdGF1dG9oaWRlOiBmYWxzZSwgLy8gaGlkZSB0aHVtYm5haWwgY29tcG9uZW50IHdoZW4gc2luZ2xlIGltYWdlXHJcblx0XHRcdFx0Y2xpY2s6IHtcclxuXHRcdFx0XHRcdHNlbGVjdDogdHJ1ZSwgLy8gc2V0IHNlbGVjdGVkIGltYWdlIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdFx0bW9kYWw6IGZhbHNlIC8vIG9wZW4gbW9kYWwgd2hlbiB0cnVlXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRob3Zlcjoge1xyXG5cdFx0XHRcdFx0cHJlbG9hZDogdHJ1ZSwgLy8gcHJlbG9hZCBpbWFnZSBvbiBtb3VzZW92ZXJcclxuXHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRwYW5lbDoge1xyXG5cdFx0XHRcdHZpc2libGU6IHRydWUsXHJcblx0XHRcdFx0aXRlbToge1xyXG5cdFx0XHRcdFx0Y2xhc3M6ICdjb2wtbWQtMycsIC8vIGl0ZW0gY2xhc3NcclxuXHRcdFx0XHRcdGNhcHRpb246IGZhbHNlLCAvLyBzaG93L2hpZGUgaW1hZ2UgY2FwdGlvblxyXG5cdFx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93L2hpZGUgaW1hZ2UgaW5kZXhcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGhvdmVyOiB7XHJcblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxyXG5cdFx0XHRcdFx0c2VsZWN0OiBmYWxzZSAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugb24gbW91c2VvdmVyIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0Y2xpY2s6IHtcclxuXHRcdFx0XHRcdHNlbGVjdDogZmFsc2UsIC8vIHNldCBzZWxlY3RlZCBpbWFnZSB3aGVuIHRydWVcclxuXHRcdFx0XHRcdG1vZGFsOiB0cnVlIC8vIG9wZW4gbW9kYWwgd2hlbiB0cnVlXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fSxcclxuXHRcdFx0aW1hZ2U6IHtcclxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRcdFx0c2l6ZTogJ2NvdmVyJywgLy8gY29udGFpbiwgY292ZXIsIGF1dG8sIHN0cmV0Y2hcclxuXHRcdFx0XHRhcnJvd3M6IHtcclxuXHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsICAvLyBzaG93L2hpZGUgYXJyb3dzXHJcblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0Y2xpY2s6IHtcclxuXHRcdFx0XHRcdG1vZGFsOiB0cnVlIC8vIHdoZW4gY2xpY2sgb24gdGhlIGltYWdlIG9wZW4gdGhlIG1vZGFsIHdpbmRvd1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGVpZ2h0OiBudWxsLCAvLyBoZWlnaHQgaW4gcGl4ZWxcclxuXHRcdFx0XHRoZWlnaHRNaW46IG51bGwsIC8vIG1pbiBoZWlnaHQgaW4gcGl4ZWxcclxuXHRcdFx0XHRoZWlnaHRBdXRvOiB7XHJcblx0XHRcdFx0XHRpbml0aWFsOiB0cnVlLCAvLyBjYWxjdWxhdGUgZGl2IGhlaWdodCBieSBmaXJzdCBpbWFnZVxyXG5cdFx0XHRcdFx0b25yZXNpemU6IGZhbHNlIC8vIGNhbGN1bGF0ZSBkaXYgaGVpZ2h0IG9uIHdpbmRvdyByZXNpemVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gYXZhaWxhYmxlIGltYWdlIHNpemVzXHJcblx0XHRwdWJsaWMgc2l6ZXM6IEFycmF5PHN0cmluZz4gPSBbXHJcblx0XHRcdCdjb250YWluJyxcclxuXHRcdFx0J2NvdmVyJyxcclxuXHRcdFx0J2F1dG8nLFxyXG5cdFx0XHQnc3RyZXRjaCdcclxuXHRcdF07XHJcblxyXG5cdFx0Ly8gYXZhaWxhYmxlIHRoZW1lc1xyXG5cdFx0cHVibGljIHRoZW1lczogQXJyYXk8c3RyaW5nPiA9IFtcclxuXHRcdFx0J2RlZmF1bHQnLFxyXG5cdFx0XHQnZGFya2JsdWUnLFxyXG5cdFx0XHQnd2hpdGVnb2xkJ1xyXG5cdFx0XTtcclxuXHJcblx0XHQvLyBhdmFpbGFibGUgdHJhbnNpdGlvbnNcclxuXHRcdHB1YmxpYyB0cmFuc2l0aW9uczogQXJyYXk8c3RyaW5nPiA9IFtcclxuXHRcdFx0J25vJyxcclxuXHRcdFx0J2ZhZGVJbk91dCcsXHJcblx0XHRcdCd6b29tSW4nLFxyXG5cdFx0XHQnem9vbU91dCcsXHJcblx0XHRcdCd6b29tSW5PdXQnLFxyXG5cdFx0XHQncm90YXRlTFInLFxyXG5cdFx0XHQncm90YXRlVEInLFxyXG5cdFx0XHQncm90YXRlWlknLFxyXG5cdFx0XHQnc2xpZGVMUicsXHJcblx0XHRcdCdzbGlkZVRCJyxcclxuXHRcdFx0J2ZsaXBYJyxcclxuXHRcdFx0J2ZsaXBZJ1xyXG5cdFx0XTtcclxuXHJcblx0XHRwdWJsaWMgZXZlbnRzID0ge1xyXG5cdFx0XHRDT05GSUdfTE9BRDogJ0FTRy1jb25maWctbG9hZC0nLFxyXG5cdFx0XHRBVVRPUExBWV9TVEFSVDogJ0FTRy1hdXRvcGxheS1zdGFydC0nLFxyXG5cdFx0XHRBVVRPUExBWV9TVE9QOiAnQVNHLWF1dG9wbGF5LXN0b3AtJyxcclxuXHRcdFx0UEFSU0VfSU1BR0VTOiAnQVNHLXBhcnNlLWltYWdlcy0nLFxyXG5cdFx0XHRMT0FEX0lNQUdFOiAnQVNHLWxvYWQtaW1hZ2UtJyxcclxuXHRcdFx0RklSU1RfSU1BR0U6ICdBU0ctZmlyc3QtaW1hZ2UtJyxcclxuXHRcdFx0Q0hBTkdFX0lNQUdFOiAnQVNHLWNoYW5nZS1pbWFnZS0nLFxyXG5cdFx0XHRNT0RBTF9PUEVOOiAnQVNHLW1vZGFsLW9wZW4tJyxcclxuXHRcdFx0TU9EQUxfQ0xPU0U6ICdBU0ctbW9kYWwtY2xvc2UtJyxcclxuXHRcdFx0VEhVTUJOQUlMX01PVkU6ICdBU0ctdGh1bWJuYWlsLW1vdmUtJyxcclxuXHRcdFx0R0FMTEVSWV9VUERBVEVEOiAnQVNHLWdhbGxlcnktdXBkYXRlZC0nLFxyXG5cdFx0XHRHQUxMRVJZX0VESVQ6ICdBU0ctZ2FsbGVyeS1lZGl0JyxcclxuXHRcdH07XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSB0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXHJcblx0XHRcdHByaXZhdGUgaW50ZXJ2YWw6IG5nLklJbnRlcnZhbFNlcnZpY2UsXHJcblx0XHRcdHByaXZhdGUgbG9jYXRpb246IG5nLklMb2NhdGlvblNlcnZpY2UsXHJcblx0XHRcdHByaXZhdGUgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcblx0XHRcdHByaXZhdGUgJHdpbmRvdzogbmcuSVdpbmRvd1NlcnZpY2UpIHtcclxuXHJcblx0XHRcdGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKCdyZXNpemUnLCAoZXZlbnQpID0+IHtcclxuXHRcdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKDIwMCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIHBhcnNlSGFzaCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5pZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCF0aGlzLm9wdGlvbnMuaGFzaFVybCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGhhc2ggPSB0aGlzLmxvY2F0aW9uLmhhc2goKTtcclxuXHRcdFx0bGV0IHBhcnRzID0gaGFzaCA/IGhhc2guc3BsaXQoJy0nKSA6IG51bGw7XHJcblxyXG5cdFx0XHRpZiAocGFydHMgPT09IG51bGwpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChwYXJ0c1swXSAhPT0gdGhpcy5zbHVnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocGFydHMubGVuZ3RoICE9PSAzKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocGFydHNbMV0gIT09IHRoaXMuaWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBpbmRleCA9IHBhcnNlSW50KHBhcnRzWzJdLCAxMCk7XHJcblxyXG5cdFx0XHRpZiAoIWFuZ3VsYXIuaXNOdW1iZXIoaW5kZXgpKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cclxuXHRcdFx0XHRpbmRleC0tO1xyXG5cdFx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleDtcclxuXHRcdFx0XHR0aGlzLm1vZGFsT3BlbihpbmRleCk7XHJcblxyXG5cdFx0XHR9LCAyMCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNhbGN1bGF0ZSBvYmplY3QgaGFzaCBpZFxyXG5cdFx0cHVibGljIG9iamVjdEhhc2hJZChvYmplY3Q6IGFueSk6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRsZXQgc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkob2JqZWN0KTtcclxuXHJcblx0XHRcdGlmICghc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBhYmMgPSBzdHJpbmcucmVwbGFjZSgvW15hLXpBLVowLTldKy9nLCAnJyk7XHJcblx0XHRcdGxldCBjb2RlID0gMDtcclxuXHJcblx0XHRcdGZvciAobGV0IGkgPSAwLCBuID0gYWJjLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG5cdFx0XHRcdGxldCBjaGFyY29kZSA9IGFiYy5jaGFyQ29kZUF0KGkpO1xyXG5cdFx0XHRcdGNvZGUgKz0gKGNoYXJjb2RlICogaSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiAnaWQnICsgY29kZS50b1N0cmluZygyMSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlIGZvciBjdXJyZW50IGdhbGxlcnkgYnkgY29tcG9uZW50IGlkXHJcblx0XHRwdWJsaWMgZ2V0SW5zdGFuY2UoY29tcG9uZW50OiBhbnkpIHtcclxuXHJcblx0XHRcdGlmICghY29tcG9uZW50LmlkKSB7XHJcblxyXG5cdFx0XHRcdC8vIGdldCBwYXJlbnQgYXNnIGNvbXBvbmVudCBpZFxyXG5cdFx0XHRcdGlmIChjb21wb25lbnQuJHNjb3BlICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudCAmJiBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQuJHBhcmVudCAmJiBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQuJHBhcmVudC4kY3RybCkge1xyXG5cdFx0XHRcdFx0Y29tcG9uZW50LmlkID0gY29tcG9uZW50LiRzY29wZS4kcGFyZW50LiRwYXJlbnQuJGN0cmwuaWQ7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbXBvbmVudC5pZCA9IHRoaXMub2JqZWN0SGFzaElkKGNvbXBvbmVudC5vcHRpb25zKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBpZCA9IGNvbXBvbmVudC5pZDtcclxuXHRcdFx0bGV0IGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbaWRdO1xyXG5cclxuXHRcdFx0Ly8gbmV3IGluc3RhbmNlIGFuZCBzZXQgb3B0aW9ucyBhbmQgaXRlbXNcclxuXHRcdFx0aWYgKGluc3RhbmNlID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRpbnN0YW5jZSA9IG5ldyBTZXJ2aWNlQ29udHJvbGxlcih0aGlzLnRpbWVvdXQsIHRoaXMuaW50ZXJ2YWwsIHRoaXMubG9jYXRpb24sIHRoaXMuJHJvb3RTY29wZSwgdGhpcy4kd2luZG93KTtcclxuXHRcdFx0XHRpbnN0YW5jZS5pZCA9IGlkO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoY29tcG9uZW50LmJhc2VVcmwpIHtcclxuXHRcdFx0XHRjb21wb25lbnQub3B0aW9ucy5iYXNlVXJsID0gY29tcG9uZW50LmJhc2VVcmw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGluc3RhbmNlLnNldE9wdGlvbnMoY29tcG9uZW50Lm9wdGlvbnMpO1xyXG5cdFx0XHRpbnN0YW5jZS5zZXRJdGVtcyhjb21wb25lbnQuaXRlbXMpO1xyXG5cdFx0XHRpbnN0YW5jZS5zZWxlY3RlZCA9IGNvbXBvbmVudC5zZWxlY3RlZCA/IGNvbXBvbmVudC5zZWxlY3RlZCA6IDA7XHJcblx0XHRcdGluc3RhbmNlLnBhcnNlSGFzaCgpO1xyXG5cclxuXHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMpIHtcclxuXHJcblx0XHRcdFx0aW5zdGFuY2UubG9hZEltYWdlcyhpbnN0YW5jZS5vcHRpb25zLnByZWxvYWQpO1xyXG5cclxuXHRcdFx0XHRpZiAoaW5zdGFuY2Uub3B0aW9ucy5hdXRvcGxheSAmJiBpbnN0YW5jZS5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgJiYgIWluc3RhbmNlLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0XHRpbnN0YW5jZS5hdXRvUGxheVN0YXJ0KCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gdXBkYXRlIGltYWdlcyB3aGVuIGVkaXQgZXZlbnRcclxuXHRcdFx0aW5zdGFuY2UuJHJvb3RTY29wZS4kb24odGhpcy5ldmVudHMuR0FMTEVSWV9FRElULCAoZXZlbnQsIGRhdGEpID0+IHtcclxuXHRcdFx0XHRpZiAoaWQgPT09IGRhdGEuaWQgJiYgY29tcG9uZW50Lml0ZW1zKSB7XHJcblx0XHRcdFx0XHRpbnN0YW5jZS5lZGl0R2FsbGVyeShkYXRhLCBjb21wb25lbnQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmluc3RhbmNlc1tpZF0gPSBpbnN0YW5jZTtcclxuXHRcdFx0cmV0dXJuIGluc3RhbmNlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBwcmVwYXJlIGltYWdlcyBhcnJheVxyXG5cdFx0cHVibGljIHNldEl0ZW1zKGl0ZW1zOiBBcnJheTxJRmlsZT4pIHtcclxuXHJcblx0XHRcdGlmICghaXRlbXMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuaXRlbXMgPSBpdGVtcztcclxuXHRcdFx0dGhpcy5wcmVwYXJlSXRlbXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3B0aW9ucyBzZXR1cFxyXG5cdFx0cHVibGljIHNldE9wdGlvbnMob3B0aW9uczogSU9wdGlvbnMpIHtcclxuXHJcblx0XHRcdC8vIGlmIG9wdGlvbnMgYWxyZWFkeSBzZXR1cFxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zTG9hZGVkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAob3B0aW9ucykge1xyXG5cclxuXHRcdFx0XHRvcHRpb25zID0gYW5ndWxhci5tZXJnZShhbmd1bGFyLmNvcHkodGhpcy5kZWZhdWx0cyksIG9wdGlvbnMpO1xyXG5cdFx0XHRcdHRoaXMub3B0aW9ucyA9IGFuZ3VsYXIuY29weShvcHRpb25zKTtcclxuXHJcblx0XHRcdFx0aWYgKG9wdGlvbnMubW9kYWwgJiYgb3B0aW9ucy5tb2RhbC5oZWFkZXIgJiYgb3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucykge1xyXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLm1vZGFsLmhlYWRlci5idXR0b25zID0gb3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMub3B0aW9uc0xvYWRlZCA9IHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25zID0gYW5ndWxhci5jb3B5KHRoaXMuZGVmYXVsdHMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpbXBvcnRhbnQhXHJcblx0XHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkNPTkZJR19MT0FELCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHY6IG51bWJlcikge1xyXG5cclxuXHRcdFx0diA9IHRoaXMubm9ybWFsaXplKHYpO1xyXG5cdFx0XHRsZXQgcHJldiA9IHRoaXMuX3NlbGVjdGVkO1xyXG5cclxuXHRcdFx0dGhpcy5fc2VsZWN0ZWQgPSB2O1xyXG5cdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLl9zZWxlY3RlZCk7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cclxuXHRcdFx0aWYgKHByZXYgIT09IHRoaXMuX3NlbGVjdGVkKSB7XHJcblxyXG5cdFx0XHRcdHRoaXMudGh1bWJuYWlsc01vdmUoKTtcclxuXHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkNIQU5HRV9JTUFHRSwge1xyXG5cdFx0XHRcdFx0aW5kZXg6IHYsXHJcblx0XHRcdFx0XHRmaWxlOiB0aGlzLmZpbGVcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBmb3JjZSBzZWxlY3QgaW1hZ2VcclxuXHRcdHB1YmxpYyBmb3JjZVNlbGVjdChpbmRleCkge1xyXG5cclxuXHRcdFx0aW5kZXggPSB0aGlzLm5vcm1hbGl6ZShpbmRleCk7XHJcblx0XHRcdHRoaXMuX3NlbGVjdGVkID0gaW5kZXg7XHJcblx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuX3NlbGVjdGVkKTtcclxuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQ0hBTkdFX0lNQUdFLCB7XHJcblx0XHRcdFx0aW5kZXg6IGluZGV4LFxyXG5cdFx0XHRcdGZpbGU6IHRoaXMuZmlsZVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBzZXRTZWxlY3RlZChpbmRleDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9IGluZGV4ID4gdGhpcy5zZWxlY3RlZCA/ICdmb3J3YXJkJyA6ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleDtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnbyB0byBiYWNrd2FyZFxyXG5cdFx0cHVibGljIHRvQmFja3dhcmQoc3RvcD86IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmIChzdG9wKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkLS07XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBmb3J3YXJkXHJcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKHN0b3A/OiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoc3RvcCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2ZvcndhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkKys7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBmaXJzdFxyXG5cdFx0cHVibGljIHRvRmlyc3Qoc3RvcD86IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmIChzdG9wKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gMDtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGxhc3RcclxuXHRcdHB1YmxpYyB0b0xhc3Qoc3RvcD86IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmIChzdG9wKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLml0ZW1zLmxlbmd0aCAtIDE7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc2V0SGFzaCgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm1vZGFsVmlzaWJsZSAmJiB0aGlzLm9wdGlvbnMuaGFzaFVybCkge1xyXG5cdFx0XHRcdHRoaXMubG9jYXRpb24uaGFzaChbdGhpcy5zbHVnLCB0aGlzLmlkLCB0aGlzLnNlbGVjdGVkICsgMV0uam9pbignLScpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlUb2dnbGUoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQpIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdGFydCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlTdG9wKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmludGVydmFsLmNhbmNlbCh0aGlzLmF1dG9wbGF5KTtcclxuXHRcdFx0dGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5hdXRvcGxheSA9IG51bGw7XHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQVVUT1BMQVlfU1RPUCwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCwgZmlsZTogdGhpcy5maWxlIH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlTdGFydCgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuYXV0b3BsYXkgPSB0aGlzLmludGVydmFsKCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnRvRm9yd2FyZCgpO1xyXG5cdFx0XHR9LCB0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZGVsYXkpO1xyXG5cclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5BVVRPUExBWV9TVEFSVCwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCwgZmlsZTogdGhpcy5maWxlIH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHJpdmF0ZSBwcmVwYXJlSXRlbXMoKSB7XHJcblxyXG5cdFx0XHR2YXIgbGVuZ3RoID0gdGhpcy5pdGVtcy5sZW5ndGg7XHJcblx0XHRcdGZvciAodmFyIGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcclxuXHRcdFx0XHR0aGlzLmFkZEltYWdlKHRoaXMuaXRlbXNba2V5XSk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLlBBUlNFX0lNQUdFUywgdGhpcy5maWxlcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHByZWxvYWQgdGhlIGltYWdlIHdoZW4gbW91c2VvdmVyXHJcblx0XHRwdWJsaWMgaG92ZXJQcmVsb2FkKGluZGV4OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMubG9hZEltYWdlKGluZGV4KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaW1hZ2UgcHJlbG9hZFxyXG5cdFx0cHJpdmF0ZSBwcmVsb2FkKHdhaXQ/OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGxldCBpbmRleCA9IHRoaXMuZGlyZWN0aW9uID09PSAnZm9yd2FyZCcgPyB0aGlzLnNlbGVjdGVkICsgMSA6IHRoaXMuc2VsZWN0ZWQgLSAxO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5wcmVsb2FkTmV4dCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmxvYWRJbWFnZShpbmRleCk7XHJcblx0XHRcdFx0fSwgKHdhaXQgIT09IHVuZGVmaW5lZCkgPyB3YWl0IDogdGhpcy5vcHRpb25zLnByZWxvYWREZWxheSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG5vcm1hbGl6ZShpbmRleDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRsZXQgbGFzdCA9IHRoaXMuZmlsZXMubGVuZ3RoIC0gMTtcclxuXHJcblx0XHRcdGlmIChpbmRleCA+IGxhc3QpIHtcclxuXHRcdFx0XHRyZXR1cm4gKGluZGV4IC0gbGFzdCkgLSAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoaW5kZXggPCAwKSB7XHJcblx0XHRcdFx0cmV0dXJuIGxhc3QgLSBNYXRoLmFicyhpbmRleCkgKyAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gaW5kZXg7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbG9hZEltYWdlcyhpbmRleGVzOiBBcnJheTxudW1iZXI+LCB0eXBlOiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdGlmICghaW5kZXhlcyB8fCBpbmRleGVzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0aW5kZXhlcy5mb3JFYWNoKChpbmRleDogbnVtYmVyKSA9PiB7XHJcblx0XHRcdFx0c2VsZi5sb2FkSW1hZ2UoaW5kZXgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBsb2FkSW1hZ2UoaW5kZXg/OiBudW1iZXIsIGNhbGxiYWNrPzoge30pIHtcclxuXHJcblx0XHRcdGluZGV4ID0gaW5kZXggPyBpbmRleCA6IHRoaXMuc2VsZWN0ZWQ7XHJcblx0XHRcdGluZGV4ID0gdGhpcy5ub3JtYWxpemUoaW5kZXgpO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmZpbGVzW2luZGV4XSkge1xyXG5cdFx0XHRcdHRoaXMubG9nKCdpbnZhbGlkIGZpbGUgaW5kZXgnLCB7IGluZGV4OiBpbmRleCB9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLm1vZGFsVmlzaWJsZSkge1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5maWxlc1tpbmRleF0ubG9hZGVkLm1vZGFsID09PSB0cnVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgbW9kYWwgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdFx0XHRtb2RhbC5zcmMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2UubW9kYWw7XHJcblx0XHRcdFx0bW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5hZnRlckxvYWQoaW5kZXgsICdtb2RhbCcsIG1vZGFsKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWQuaW1hZ2UgPT09IHRydWUpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0XHRcdGltYWdlLnNyYyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5pbWFnZTtcclxuXHRcdFx0XHRpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5hZnRlckxvYWQoaW5kZXgsICdpbWFnZScsIGltYWdlKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGZpbGUgbmFtZVxyXG5cdFx0cHJpdmF0ZSBnZXRGaWxlbmFtZShpbmRleDogbnVtYmVyLCB0eXBlPzogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHR0eXBlID0gdHlwZSA/IHR5cGUgOiAnbW9kYWwnO1xyXG5cdFx0XHRsZXQgZmlsZXBhcnRzID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlW3R5cGVdLnNwbGl0KCcvJyk7XHJcblx0XHRcdGxldCBmaWxlbmFtZSA9IGZpbGVwYXJ0c1tmaWxlcGFydHMubGVuZ3RoIC0gMV07XHJcblx0XHRcdHJldHVybiBmaWxlbmFtZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGZpbGUgZXh0ZW5zaW9uXHJcblx0XHRwcml2YXRlIGdldEV4dGVuc2lvbihpbmRleDogbnVtYmVyLCB0eXBlPzogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHR0eXBlID0gdHlwZSA/IHR5cGUgOiAnbW9kYWwnO1xyXG5cdFx0XHRsZXQgZmlsZXBhcnRzID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlW3R5cGVdLnNwbGl0KCcuJyk7XHJcblx0XHRcdGxldCBleHRlbnNpb24gPSBmaWxlcGFydHNbZmlsZXBhcnRzLmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRyZXR1cm4gZXh0ZW5zaW9uO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBhZnRlciBsb2FkIGltYWdlXHJcblx0XHRwcml2YXRlIGFmdGVyTG9hZChpbmRleCwgdHlwZSwgaW1hZ2UpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWRbdHlwZV0gPT09IHRydWUpIHtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWRbdHlwZV0gPSB0cnVlO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubG9hZGVkW3R5cGVdID0gdHJ1ZTtcclxuXHJcblx0XHRcdGlmICh0eXBlID09PSAnbW9kYWwnKSB7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0ud2lkdGggPSBpbWFnZS53aWR0aDtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubmFtZSA9IHRoaXMuZ2V0RmlsZW5hbWUoaW5kZXgsIHR5cGUpO1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmV4dGVuc2lvbiA9IHRoaXMuZ2V0RXh0ZW5zaW9uKGluZGV4LCB0eXBlKTtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5kb3dubG9hZCA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5tb2RhbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGRhdGEgPSB7IHR5cGU6IHR5cGUsIGluZGV4OiBpbmRleCwgZmlsZTogdGhpcy5maWxlLCBpbWc6IGltYWdlIH07XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuZmlyc3QpIHtcclxuXHRcdFx0XHR0aGlzLmZpcnN0ID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkZJUlNUX0lNQUdFLCBkYXRhKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5MT0FEX0lNQUdFLCBkYXRhKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGlzIHNpbmdsZT9cclxuXHRcdHB1YmxpYyBnZXQgaXNTaW5nbGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlcy5sZW5ndGggPiAxID8gZmFsc2UgOiB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZSBkb3dubG9hZCBsaW5rXHJcblx0XHRwdWJsaWMgZG93bmxvYWRMaW5rKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuc2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmZpbGVzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5maWxlc1t0aGlzLnNlbGVjdGVkXS5zb3VyY2UubW9kYWw7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB0aGUgZmlsZVxyXG5cdFx0cHVibGljIGdldCBmaWxlKCk6IElGaWxlIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgZWxlbWVudCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgdG9nZ2xlKGVsZW1lbnQ6IHN0cmluZyk6IHZvaWQge1xyXG5cclxuXHRcdFx0dGhpcy5vcHRpb25zW2VsZW1lbnRdLnZpc2libGUgPSAhdGhpcy5vcHRpb25zW2VsZW1lbnRdLnZpc2libGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgdmlzaWJsZVxyXG5cdFx0cHVibGljIGdldCBtb2RhbFZpc2libGUoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5fdmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB0aGVtZVxyXG5cdFx0cHVibGljIGdldCB0aGVtZSgpOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucy50aGVtZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGNsYXNzZXNcclxuXHRcdHB1YmxpYyBnZXQgY2xhc3NlcygpOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucy50aGVtZSArICcgJyArIHRoaXMuaWQgKyAodGhpcy5lZGl0aW5nID8gJyBlZGl0aW5nJyA6ICcnKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHByZWxvYWQgc3R5bGVcclxuXHRcdHB1YmxpYyBwcmVsb2FkU3R5bGUoZmlsZTogSUZpbGUsIHR5cGU6IHN0cmluZykge1xyXG5cclxuXHRcdFx0bGV0IHN0eWxlID0ge307XHJcblxyXG5cdFx0XHRpZiAoZmlsZS5zb3VyY2UuY29sb3IpIHtcclxuXHRcdFx0XHRzdHlsZVsnYmFja2dyb3VuZC1jb2xvciddID0gZmlsZS5zb3VyY2UuY29sb3I7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMubG9hZGluZ0ltYWdlICYmIGZpbGUubG9hZGVkW3R5cGVdID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdHN0eWxlWydiYWNrZ3JvdW5kLWltYWdlJ10gPSAndXJsKCcgKyB0aGlzLm9wdGlvbnMubG9hZGluZ0ltYWdlICsgJyknO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gc3R5bGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBwbGFjZWhvbGRlciBzdHlsZVxyXG5cdFx0cHVibGljIHBsYWNlaG9sZGVyU3R5bGUoZmlsZTogSUZpbGUpIHtcclxuXHJcblx0XHRcdGxldCBzdHlsZSA9IHt9O1xyXG5cclxuXHRcdFx0aWYgKGZpbGUuc291cmNlLmNvbG9yKSB7XHJcblx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtY29sb3InXSA9IGZpbGUuc291cmNlLmNvbG9yO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoZmlsZS5zb3VyY2UucGxhY2Vob2xkZXIpIHtcclxuXHRcdFx0XHRzdHlsZVsnYmFja2dyb3VuZC1pbWFnZSddID0gJ3VybCgnICsgZmlsZS5zb3VyY2UucGxhY2Vob2xkZXIgKyAnKSc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBzdHlsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHZpc2libGVcclxuXHRcdHB1YmxpYyBzZXQgbW9kYWxWaXNpYmxlKHZhbHVlOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHR0aGlzLl92aXNpYmxlID0gdmFsdWU7XHJcblxyXG5cdFx0XHQvLyBzZXQgaW5kZXggMCBpZiAhc2VsZWN0ZWQgXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkID8gdGhpcy5zZWxlY3RlZCA6IDA7XHJcblxyXG5cdFx0XHRsZXQgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcblx0XHRcdGxldCBjbGFzc05hbWUgPSAnIGFzZy15aGlkZGVuJztcclxuXHJcblx0XHRcdGlmICh2YWx1ZSkge1xyXG5cclxuXHRcdFx0XHRpZiAoYm9keS5jbGFzc05hbWUuaW5kZXhPZihjbGFzc05hbWUpIDwgMCkge1xyXG5cdFx0XHRcdFx0Ym9keS5jbGFzc05hbWUgPSBib2R5LmNsYXNzTmFtZSArIGNsYXNzTmFtZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMubW9kYWxJbml0KCk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRib2R5LmNsYXNzTmFtZSA9IGJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoY2xhc3NOYW1lLCAnJyk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGluaXRpYWxpemUgdGhlIGdhbGxlcnlcclxuXHRcdHByaXZhdGUgbW9kYWxJbml0KCkge1xyXG5cclxuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRzZWxmLnNldEZvY3VzKCk7XHJcblx0XHRcdH0sIDEwMCk7XHJcblxyXG5cdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKDQ0MCk7XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMubW9kYWxJbml0aWFsaXplZCA9IHRydWU7XHJcblx0XHRcdH0sIDQ2MCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbW9kYWxPcGVuKGluZGV4OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5tb2RhbEF2YWlsYWJsZSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IGluZGV4ICE9PSB1bmRlZmluZWQgPyBpbmRleCA6IHRoaXMuc2VsZWN0ZWQ7XHJcblx0XHRcdHRoaXMubW9kYWxWaXNpYmxlID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoKTtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuTU9EQUxfT1BFTiwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCB9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG1vZGFsQ2xvc2UoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmhhc2hVcmwpIHtcclxuXHRcdFx0XHR0aGlzLmxvY2F0aW9uLmhhc2goJycpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm1vZGFsSW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoKTtcclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5NT0RBTF9DTE9TRSwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCB9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gbW92ZSB0aHVtYm5haWxzIHRvIGNvcnJlY3QgcG9zaXRpb25cclxuXHRcdHB1YmxpYyB0aHVtYm5haWxzTW92ZShkZWxheT86IG51bWJlcikge1xyXG5cclxuXHRcdFx0bGV0IG1vdmUgPSAoKSA9PiB7XHJcblxyXG5cdFx0XHRcdGxldCBjb250YWluZXJzID0gdGhpcy5lbCgnZGl2LmFzZy10aHVtYm5haWwuJyArIHRoaXMuaWQpO1xyXG5cclxuXHRcdFx0XHRpZiAoIWNvbnRhaW5lcnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRhaW5lcnMubGVuZ3RoOyBpKyspIHtcclxuXHJcblx0XHRcdFx0XHRsZXQgY29udGFpbmVyOiBhbnkgPSBjb250YWluZXJzW2ldO1xyXG5cclxuXHRcdFx0XHRcdGlmIChjb250YWluZXIub2Zmc2V0V2lkdGgpIHtcclxuXHJcblx0XHRcdFx0XHRcdGxldCBpdGVtczogYW55ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5pdGVtcycpO1xyXG5cdFx0XHRcdFx0XHRsZXQgaXRlbTogYW55ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5pdGVtJyk7XHJcblx0XHRcdFx0XHRcdGxldCB0aHVtYm5haWwsIG1vdmVYLCByZW1haW47XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbSkge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoaXRlbXMuc2Nyb2xsV2lkdGggPiBjb250YWluZXIub2Zmc2V0V2lkdGgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbCA9IGl0ZW1zLnNjcm9sbFdpZHRoIC8gdGhpcy5maWxlcy5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IChjb250YWluZXIub2Zmc2V0V2lkdGggLyAyKSAtICh0aGlzLnNlbGVjdGVkICogdGh1bWJuYWlsKSAtIHRodW1ibmFpbCAvIDI7XHJcblx0XHRcdFx0XHRcdFx0XHRyZW1haW4gPSBpdGVtcy5zY3JvbGxXaWR0aCArIG1vdmVYO1xyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZVggPSBtb3ZlWCA+IDAgPyAwIDogbW92ZVg7XHJcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IHJlbWFpbiA8IGNvbnRhaW5lci5vZmZzZXRXaWR0aCA/IGNvbnRhaW5lci5vZmZzZXRXaWR0aCAtIGl0ZW1zLnNjcm9sbFdpZHRoIDogbW92ZVg7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbCA9IHRoaXMuZ2V0UmVhbFdpZHRoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZVggPSAoY29udGFpbmVyLm9mZnNldFdpZHRoIC0gdGh1bWJuYWlsICogdGhpcy5maWxlcy5sZW5ndGgpIC8gMjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGl0ZW1zLnN0eWxlLmxlZnQgPSBtb3ZlWCArICdweCc7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuVEhVTUJOQUlMX01PVkUsIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbDogdGh1bWJuYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZTogbW92ZVgsXHJcblx0XHRcdFx0XHRcdFx0XHRyZW1haW46IHJlbWFpbixcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnRhaW5lcjogY29udGFpbmVyLm9mZnNldFdpZHRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbXM6IGl0ZW1zLnNjcm9sbFdpZHRoXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpZiAoZGVsYXkpIHtcclxuXHRcdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0bW92ZSgpO1xyXG5cdFx0XHRcdH0sIGRlbGF5KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtb3ZlKCk7XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBtb2RhbENsaWNrKCRldmVudD86IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICgkZXZlbnQpIHtcclxuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRoZSBmb2N1c1xyXG5cdFx0cHVibGljIHNldEZvY3VzKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubW9kYWxWaXNpYmxlKSB7XHJcblxyXG5cdFx0XHRcdGxldCBlbGVtZW50OiBOb2RlID0gdGhpcy5lbCgnZGl2LmFzZy1tb2RhbC4nICsgdGhpcy5pZCArICcgLmtleUlucHV0JylbMF07XHJcblxyXG5cdFx0XHRcdGlmIChlbGVtZW50KSB7XHJcblx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbWVudClbMF0uZm9jdXMoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgZXZlbnQoZXZlbnQ6IHN0cmluZywgZGF0YT86IGFueSkge1xyXG5cclxuXHRcdFx0ZXZlbnQgPSBldmVudCArIHRoaXMuaWQ7XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kZW1pdChldmVudCwgZGF0YSk7XHJcblx0XHRcdHRoaXMubG9nKGV2ZW50LCBkYXRhKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGxvZyhldmVudDogc3RyaW5nLCBkYXRhPzogYW55KSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmRlYnVnKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXZlbnQsIGRhdGEgPyBkYXRhIDogbnVsbCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGVsZW1lbnRcclxuXHRcdHB1YmxpYyBlbChzZWxlY3Rvcik6IE5vZGVMaXN0IHtcclxuXHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRpbmcgZWxlbWVudCByZWFsIHdpZHRoXHJcblx0XHRwdWJsaWMgZ2V0UmVhbFdpZHRoKGl0ZW0pIHtcclxuXHJcblx0XHRcdGxldCBzdHlsZSA9IGl0ZW0uY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGl0ZW0pLFxyXG5cdFx0XHRcdHdpZHRoID0gaXRlbS5vZmZzZXRXaWR0aCxcclxuXHRcdFx0XHRtYXJnaW4gPSBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkxlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5SaWdodCksXHJcblx0XHRcdFx0Ly8gcGFkZGluZyA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0xlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nUmlnaHQpLFxyXG5cdFx0XHRcdGJvcmRlciA9IHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyTGVmdFdpZHRoKSArIHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyUmlnaHRXaWR0aCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gd2lkdGggKyBtYXJnaW4gKyBib3JkZXI7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNhbGN1bGF0aW5nIGVsZW1lbnQgcmVhbCBoZWlnaHRcclxuXHRcdHB1YmxpYyBnZXRSZWFsSGVpZ2h0KGl0ZW0pIHtcclxuXHJcblx0XHRcdGxldCBzdHlsZSA9IGl0ZW0uY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGl0ZW0pLFxyXG5cdFx0XHRcdGhlaWdodCA9IGl0ZW0ub2Zmc2V0SGVpZ2h0LFxyXG5cdFx0XHRcdG1hcmdpbiA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luQm90dG9tKSxcclxuXHRcdFx0XHQvLyBwYWRkaW5nID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0JvdHRvbSksXHJcblx0XHRcdFx0Ym9yZGVyID0gcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJUb3BXaWR0aCkgKyBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlckJvdHRvbVdpZHRoKTtcclxuXHJcblx0XHRcdHJldHVybiBoZWlnaHQgKyBtYXJnaW4gKyBib3JkZXI7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBlZGl0IGdhbGxlcnlcclxuXHRcdHB1YmxpYyBlZGl0R2FsbGVyeShlZGl0OiBJRWRpdCwgY29tcG9uZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmVkaXRpbmcgPSB0cnVlO1xyXG5cdFx0XHR2YXIgc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkO1xyXG5cclxuXHRcdFx0aWYgKGVkaXQub3B0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25zTG9hZGVkID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5zZXRPcHRpb25zKGVkaXQub3B0aW9ucyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChlZGl0LmRlbGV0ZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy5kZWxldGVJbWFnZShlZGl0LmRlbGV0ZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChlZGl0LmFkZCkge1xyXG5cdFx0XHRcdHNlbGVjdGVkID0gdGhpcy5maWxlcy5sZW5ndGg7XHJcblx0XHRcdFx0dmFyIGxlbmd0aCA9IGVkaXQuYWRkLmxlbmd0aDtcclxuXHRcdFx0XHRmb3IgKHZhciBrZXkgPSAwOyBrZXkgPCBsZW5ndGg7IGtleSsrKSB7XHJcblx0XHRcdFx0XHR0aGlzLmFkZEltYWdlKGVkaXQuYWRkW2tleV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGVkaXQudXBkYXRlKSB7XHJcblxyXG5cdFx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xyXG5cclxuXHRcdFx0XHR2YXIgbGVuZ3RoID0gZWRpdC51cGRhdGUubGVuZ3RoO1xyXG5cdFx0XHRcdGZvciAodmFyIGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcclxuXHRcdFx0XHRcdHRoaXMuYWRkSW1hZ2UoZWRpdC51cGRhdGVba2V5XSwga2V5KTtcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHR2YXIgY291bnQgPSB0aGlzLmZpbGVzLmxlbmd0aCAtIGVkaXQudXBkYXRlLmxlbmd0aDtcclxuXHRcdFx0XHRpZiAoY291bnQgPiAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLmRlbGV0ZUltYWdlKGxlbmd0aCwgY291bnQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHJcblx0XHRcdFx0c2VsZWN0ZWQgPSB0aGlzLmZpbGVzW3NlbGVjdGVkXSA/IHNlbGVjdGVkIDogKHNlbGVjdGVkID49IHRoaXMuZmlsZXMubGVuZ3RoID8gc2VsZWN0ZWQgLSAxIDogc2VsZWN0ZWQgKyAxKTtcclxuXHJcblx0XHRcdFx0dGhpcy5mb3JjZVNlbGVjdCh0aGlzLmZpbGVzW3NlbGVjdGVkXSA/IHNlbGVjdGVkIDogMCk7XHJcblx0XHRcdFx0dGhpcy5lZGl0aW5nID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5HQUxMRVJZX1VQREFURUQsIGVkaXQpO1xyXG5cdFx0XHRcdHRoaXMudGh1bWJuYWlsc01vdmUoZWRpdC5kZWxheVRodW1ibmFpbHMgIT09IHVuZGVmaW5lZCA/IGVkaXQuZGVsYXlUaHVtYm5haWxzIDogMjIwKTtcclxuXHJcblx0XHRcdH0sIChlZGl0LmRlbGF5UmVmcmVzaCAhPT0gdW5kZWZpbmVkID8gZWRpdC5kZWxheVJlZnJlc2ggOiA0NDApKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGRlbGV0ZSBpbWFnZVxyXG5cdFx0cHVibGljIGRlbGV0ZUltYWdlKGluZGV4OiBudW1iZXIsIGNvdW50PzogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpbmRleCA9IGluZGV4ID09PSBudWxsIHx8IGluZGV4ID09PSB1bmRlZmluZWQgPyB0aGlzLnNlbGVjdGVkIDogaW5kZXg7XHJcblx0XHRcdHRoaXMuZmlsZXMuc3BsaWNlKGluZGV4LCBjb3VudCA/IGNvdW50IDogMSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGFkZCBpbWFnZVxyXG5cdFx0cHVibGljIGFkZEltYWdlKHZhbHVlOiBhbnksIGluZGV4PzogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRpZiAoYW5ndWxhci5pc1N0cmluZyh2YWx1ZSkgPT09IHRydWUpIHtcclxuXHRcdFx0XHR2YWx1ZSA9IHsgc291cmNlOiB7IG1vZGFsOiB2YWx1ZSB9IH07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBnZXRBdmFpbGFibGVTb3VyY2UgPSBmdW5jdGlvbiAodHlwZTogc3RyaW5nLCBzb3VyY2U6IElTb3VyY2UpIHtcclxuXHJcblx0XHRcdFx0aWYgKHNvdXJjZVt0eXBlXSkge1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiBzZWxmLm9wdGlvbnMuYmFzZVVybCArIHNvdXJjZVt0eXBlXTtcclxuXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ3BhbmVsJykge1xyXG5cdFx0XHRcdFx0XHR0eXBlID0gJ2ltYWdlJztcclxuXHRcdFx0XHRcdFx0aWYgKHNvdXJjZVt0eXBlXSkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBzZWxmLm9wdGlvbnMuYmFzZVVybCArIHNvdXJjZVt0eXBlXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAnaW1hZ2UnKSB7XHJcblx0XHRcdFx0XHRcdHR5cGUgPSAnbW9kYWwnO1xyXG5cdFx0XHRcdFx0XHRpZiAoc291cmNlW3R5cGVdKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHNlbGYub3B0aW9ucy5iYXNlVXJsICsgc291cmNlW3R5cGVdO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICdtb2RhbCcpIHtcclxuXHRcdFx0XHRcdFx0dHlwZSA9ICdpbWFnZSc7XHJcblx0XHRcdFx0XHRcdGlmIChzb3VyY2VbdHlwZV0pIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5vcHRpb25zLmJhc2VVcmwgKyBzb3VyY2VbdHlwZV07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGlmICghdmFsdWUuc291cmNlKSB7XHJcblx0XHRcdFx0dmFsdWUuc291cmNlID0ge1xyXG5cdFx0XHRcdFx0bW9kYWw6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLm1vZGFsXSxcclxuXHRcdFx0XHRcdHBhbmVsOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5wYW5lbF0sXHJcblx0XHRcdFx0XHRpbWFnZTogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UuaW1hZ2VdLFxyXG5cdFx0XHRcdFx0cGxhY2Vob2xkZXI6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLnBsYWNlaG9sZGVyXVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBzb3VyY2UgPSB7XHJcblx0XHRcdFx0bW9kYWw6IGdldEF2YWlsYWJsZVNvdXJjZSgnbW9kYWwnLCB2YWx1ZS5zb3VyY2UpLFxyXG5cdFx0XHRcdHBhbmVsOiBnZXRBdmFpbGFibGVTb3VyY2UoJ3BhbmVsJywgdmFsdWUuc291cmNlKSxcclxuXHRcdFx0XHRpbWFnZTogZ2V0QXZhaWxhYmxlU291cmNlKCdpbWFnZScsIHZhbHVlLnNvdXJjZSksXHJcblx0XHRcdFx0Y29sb3I6IHZhbHVlLmNvbG9yID8gdmFsdWUuY29sb3IgOiAndHJhbnNwYXJlbnQnLFxyXG5cdFx0XHRcdHBsYWNlaG9sZGVyOiB2YWx1ZS5wbGFjZWhvbGRlciA/IHNlbGYub3B0aW9ucy5iYXNlVXJsICsgdmFsdWUucGxhY2Vob2xkZXIgOiBudWxsXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpZiAoIXNvdXJjZS5tb2RhbCkge1xyXG5cdFx0XHRcdHNlbGYubG9nKCdpbnZhbGlkIGltYWdlIGRhdGEnLCB7IHNvdXJjZTogc291cmNlLCB2YWx1ZTogdmFsdWUgfSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgcGFydHMgPSBzb3VyY2UubW9kYWwuc3BsaXQoJy8nKTtcclxuXHRcdFx0bGV0IGZpbGVuYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XHJcblx0XHRcdGxldCB0aXRsZSwgZGVzY3JpcHRpb247XHJcblxyXG5cdFx0XHRpZiAoc2VsZi5vcHRpb25zLmZpZWxkcyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGl0bGUgPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRpdGxlXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdIDogZmlsZW5hbWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGl0bGUgPSBmaWxlbmFtZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHNlbGYub3B0aW9ucy5maWVsZHMgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGRlc2NyaXB0aW9uID0gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5kZXNjcmlwdGlvbl0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA6IG51bGw7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZGVzY3JpcHRpb24gPSBudWxsO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgZmlsZSA9IHtcclxuXHRcdFx0XHRzb3VyY2U6IHNvdXJjZSxcclxuXHRcdFx0XHR0aXRsZTogdGl0bGUsXHJcblx0XHRcdFx0ZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdGxvYWRlZDoge1xyXG5cdFx0XHRcdFx0bW9kYWw6IGZhbHNlLFxyXG5cdFx0XHRcdFx0cGFuZWw6IGZhbHNlLFxyXG5cdFx0XHRcdFx0aW1hZ2U6IGZhbHNlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKGluZGV4ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5maWxlc1tpbmRleF0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdID0gZmlsZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmZpbGVzLnB1c2goZmlsZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5zZXJ2aWNlKCdhc2dTZXJ2aWNlJywgWyckdGltZW91dCcsICckaW50ZXJ2YWwnLCAnJGxvY2F0aW9uJywgJyRyb290U2NvcGUnLCAnJHdpbmRvdycsIFNlcnZpY2VDb250cm9sbGVyXSk7XHJcblxyXG59XHJcblxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBUaHVtYm5haWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtczogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmw6IHN0cmluZztcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgPSAndGh1bWJuYWlsJztcclxuXHRcdHByaXZhdGUgdGVtcGxhdGU7XHJcblx0XHRwcml2YXRlIGFzZzogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSBtb2RhbCA9IGZhbHNlO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKFxyXG5cdFx0XHRwcml2YXRlIHNlcnZpY2U6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0cHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSxcclxuXHRcdFx0cHJpdmF0ZSAkZWxlbWVudDogbmcuSVJvb3RFbGVtZW50U2VydmljZSkge1xyXG5cclxuXHRcdFx0dGhpcy50ZW1wbGF0ZSA9ICd2aWV3cy9hc2ctdGh1bWJuYWlsLmh0bWwnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHBhcmVudCBhc2cgY29tcG9uZW50IChtb2RhbClcclxuXHRcdFx0aWYgKHRoaXMuJHNjb3BlICYmIHRoaXMuJHNjb3BlLiRwYXJlbnQgJiYgdGhpcy4kc2NvcGUuJHBhcmVudC4kcGFyZW50ICYmIHRoaXMuJHNjb3BlLiRwYXJlbnQuJHBhcmVudC4kY3RybCkge1xyXG5cdFx0XHRcdHRoaXMubW9kYWwgPSB0aGlzLiRzY29wZS4kcGFyZW50LiRwYXJlbnQuJGN0cmwudHlwZSA9PT0gJ21vZGFsJyA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXRTZWxlY3RlZChpbmRleDogbnVtYmVyLCAkZXZlbnQ/OiBNb3VzZUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2subW9kYWwpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbE9wZW4oaW5kZXgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLnNlbGVjdCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBwcmVsb2Qgd2hlbiBtb3VzZW92ZXIgYW5kIHNldCBzZWxlY3RlZCBpZiBlbmFibGVkXHJcblx0XHRwdWJsaWMgaG92ZXIoaW5kZXg6IG51bWJlciwgJGV2ZW50PzogTW91c2VFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhvdmVyLnByZWxvYWQgPT09IHRydWUpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5ob3ZlclByZWxvYWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuaG92ZXIuc2VsZWN0ID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCB0aHVtYm5haWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpOiBJT3B0aW9uc1RodW1ibmFpbCB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5tb2RhbCA/IHRoaXMuYXNnLm9wdGlvbnMubW9kYWxbdGhpcy50eXBlXSA6IHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRodW1ibmFpbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlOiBJT3B0aW9uc1RodW1ibmFpbCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubW9kYWwpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5vcHRpb25zLm1vZGFsW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodjogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGFib3ZlIGZyb20gY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGR5bmFtaWMoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcuZHluYW1pYyA/ICdkeW5hbWljJyA6ICcnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBhdXRvaGlkZSBhbmQgaXNTaW5nbGUgPT0gdHJ1ZSA/XHJcblx0XHRwdWJsaWMgZ2V0IGF1dG9oaWRlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLmF1dG9oaWRlICYmIHRoaXMuYXNnLmlzU2luZ2xlID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgY2xhc3Nlc1xyXG5cdFx0cHVibGljIGdldCBjbGFzc2VzKCk6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRsZXQgc2hvdyA9ICdpbml0aWFsaXplZCc7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5tb2RhbCkge1xyXG5cdFx0XHRcdHNob3cgPSB0aGlzLmFzZy5tb2RhbEluaXRpYWxpemVkID8gJ2luaXRpYWxpemVkJyA6ICdpbml0aWFsaXppbmcnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuY2xhc3NlcyArICcgJyArIHRoaXMuZHluYW1pYyArICcgJyArIHNob3c7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dUaHVtYm5haWwnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgJyRlbGVtZW50JywgYW5ndWxhclN1cGVyR2FsbGVyeS5UaHVtYm5haWxDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBkYXRhLW5nLWlmPVwiISRjdHJsLmF1dG9oaWRlXCIgY2xhc3M9XCJhc2ctdGh1bWJuYWlsIHt7ICRjdHJsLmNsYXNzZXMgfX1cIiBuZy1jbGljaz1cIiRjdHJsLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XCI+PGRpdiBuZy1pbmNsdWRlPVwiJGN0cmwudGVtcGxhdGVcIj48L2Rpdj48L2Rpdj4nLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAJyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR2aXNpYmxlOiAnPT8nLFxyXG5cdFx0XHR0ZW1wbGF0ZTogJ0A/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iXX0=

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/asg-control.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.autoPlayToggle()">\r\n\t<span ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t<span ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toFirst(true)">\r\n\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toBackward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toForward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n</button>\r\n\r\n');
$templateCache.put('views/asg-help.html','<ul>\r\n\t<li>SPACE : forward</li>\r\n\t<li>RIGHT : forward</li>\r\n\t<li>LEFT : backward</li>\r\n\t<li>UP / HOME : first</li>\r\n\t<li>DOWN / END : last</li>\r\n\t<li>ENTER : toggle fullscreen</li>\r\n\t<li>ESC : exit</li>\r\n\t<li>p : play/pause</li>\r\n\t<li>t : change transition effect</li>\r\n\t<li>m : toggle menu</li>\r\n\t<li>s : toggle image size</li>\r\n\t<li>c : toggle caption</li>\r\n\t<li>h : toggle help</li>\r\n</ul>');
$templateCache.put('views/asg-image.html','<div class="asg-image {{ $ctrl.asg.classes }}" ng-class="{\'modalon\' : $ctrl.modalAvailable }" ng-style="{\'min-height\' : $ctrl.config.heightMin + \'px\', \'height\' : $ctrl.height + \'px\'}">\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)">\r\n\r\n\t\t<div class="img" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-show="$ctrl.asg.selected == key" ng-style="$ctrl.asg.preloadStyle(file, \'image\')" ng-class="{\'loaded\' : file.loaded.image}">\r\n\r\n\t\t\t<div class="placeholder {{ $ctrl.config.size }}" ng-style="$ctrl.asg.placeholderStyle(file)"></div>\r\n\t\t\t<div class="source {{ $ctrl.config.size }}" ng-style="{\'background-image\': \'url(\' + file.source.image + \')\'}" ng-mouseover="$ctrl.asg.hoverPreload(key)" ng-click="$ctrl.modalOpen($event)"></div>\r\n\r\n\t\t</div>\r\n\t</div>\r\n\t<div class="arrows" ng-if="$ctrl.config.arrows.enabled" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.modalOpen($event)">\r\n\r\n\t\t<div ng-if="!$ctrl.asg.isSingle" class="toBackward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div ng-if="!$ctrl.asg.isSingle" class="toForward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t</div>\r\n\t<ng-transclude></ng-transclude>\r\n</div>\r\n\r\n\r\n\r\n');
$templateCache.put('views/asg-info.html','<div class="row">\r\n\r\n\t<div class="col-md-12">\r\n\t\t<h3>{{ $ctrl.file.title }}</h3>\r\n\t</div>\r\n\r\n\t<div class="col-md-12">\r\n\t\t{{ $ctrl.file.description }}\r\n\t\t<a target="_blank" href="{{ $ctrl.download }}"><span class="glyphicon glyphicon-download"></span></a>\r\n\t</div>\r\n\r\n</div>\r\n\r\n\r\n');
$templateCache.put('views/asg-modal.html','<div class="asg-modal {{ $ctrl.asg.classes }}" ng-class="$ctrl.getClass()" ng-click="$ctrl.imageClick($event);" ng-if="$ctrl.asg.modalVisible" ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="frame" ng-click="$ctrl.asg.modalClick($event);">\r\n\r\n\t\t<div class="header" ng-if="$ctrl.config.header.enabled" ng-click="$ctrl.asg.modalClick($event);">\r\n\r\n\t\t\t<span class="buttons visible-xs pull-right">\r\n\t\t\t\t<span ng-include="\'views/button/asg-index-xs.html\'"></span>\r\n\t\t\t</span>\r\n\r\n\t\t\t<span class="buttons hidden-xs pull-right">\r\n\t\t\t\t<span ng-repeat="item in ::$ctrl.config.header.buttons" ng-include="(\'views/button/asg-\' + item + \'.html\')"></span>\r\n            </span>\r\n\r\n\t\t\t<span ng-if="$ctrl.config.title">\r\n\t\t\t\t<span class="title">{{ $ctrl.config.title }}</span>\r\n\t\t\t\t<span class="subtitle hidden-xs" ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span>\r\n\t\t\t</span>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}" ng-style="{\'top\': $ctrl.marginTop + \'px\', \'bottom\': $ctrl.marginBottom + \'px\'}" ng-mouseover="$ctrl.asg.over.modalImage = true;" ng-mouseleave="$ctrl.asg.over.modalImage = false;">\r\n\r\n\t\t\t<div class="help text-right" ng-click="$ctrl.toggleHelp($event)" ng-show="$ctrl.config.help" ng-include="\'views/asg-help.html\'"></div>\r\n\r\n\t\t\t<div class="arrows" ng-if="$ctrl.config.arrows.enabled" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.imageClick($event)">\r\n\r\n\t\t\t\t<div ng-if="!$ctrl.asg.isSingle" class="toBackward">\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<div ng-if="!$ctrl.asg.isSingle" class="toForward">\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t</div>\r\n\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class="img" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-show="$ctrl.asg.selected == key" ng-style="$ctrl.asg.preloadStyle(file, \'modal\')" ng-class="{\'loaded\' : file.loaded.modal}">\r\n\r\n\t\t\t\t<div class="placeholder {{ $ctrl.config.size }}" ng-style="$ctrl.asg.placeholderStyle(file)"></div>\r\n\t\t\t\t<div class="source {{ $ctrl.config.size }}" ng-if="file.loaded.modal" ng-style="{\'background-image\': \'url(\' + file.source.modal + \')\'}">\r\n\t\t\t\t</div>\r\n\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class="caption {{ $ctrl.config.caption.position }}" ng-show="!$ctrl.config.caption.disabled" ng-class="{\'visible\' : $ctrl.config.caption.visible}">\r\n\t\t\t\t<div class="content">\r\n\t\t\t\t\t<span class="title">{{ $ctrl.asg.file.title }}</span>\r\n\t\t\t\t\t<span ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description"> - </span>\r\n\t\t\t\t\t<span class="description">{{ $ctrl.asg.file.description }}</span>\r\n\t\t\t\t\t<a href="{{ $ctrl.asg.downloadLink() }}" target="_blank" class="btn btn-default btn-xs">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-download"></span> Download\r\n\t\t\t\t\t</a>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\r\n\t\t</div>\r\n\r\n\t\t<ng-transclude></ng-transclude>\r\n\r\n\t</div>\r\n\r\n</div>');
$templateCache.put('views/asg-panel.html','<div class="items">\r\n\t<div class="item {{ $ctrl.asg.options.panel.item.class }}" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-style="{\'background-color\': file.source.color}" ng-class="{\'selected\' : $ctrl.asg.selected == key}">\r\n\r\n\t\t<img ng-src="{{ file.source.panel }}" ng-click="$ctrl.setSelected(key, $event)" alt="{{ file.title }}">\r\n\r\n\t\t<span class="index" ng-if="$ctrl.config.item.index">{{ key + 1 }}</span>\r\n\r\n\t\t<div class="caption" ng-if="$ctrl.config.item.caption">\r\n\t\t\t<span>{{ file.title }}</span>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n');
$templateCache.put('views/asg-thumbnail.html','<div class="items">\r\n\t<div class="item" ng-click="$ctrl.setSelected(key, $event)" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-style="{\'background-color\': file.source.color}" ng-class="{\'selected\' : $ctrl.asg.selected == key}">\r\n\r\n\t\t<img ng-src="{{ file.source.panel }}" ng-style="{\'height\': $ctrl.config.height + \'px\'}" alt="{{ file.title }}">\r\n\r\n\t\t<span class="index" ng-if="$ctrl.config.index">{{ key + 1 }}</span>\r\n\r\n\t</div>\r\n</div>\r\n');
$templateCache.put('views/button/asg-close.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.close($event)">\r\n\t<span class="glyphicon glyphicon-remove"></span>\r\n</button>');
$templateCache.put('views/button/asg-fullscreen.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleFullScreen($event)">\r\n\t<span class="glyphicon glyphicon-fullscreen"></span>\r\n</button>');
$templateCache.put('views/button/asg-help.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleHelp($event)">\r\n\t<span class="glyphicon glyphicon-question-sign"></span>\r\n</button>');
$templateCache.put('views/button/asg-index-xs.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs">\r\n\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n</button>');
$templateCache.put('views/button/asg-index.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toFirst(true, $event)">\r\n\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n</button>');
$templateCache.put('views/button/asg-next.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toForward(true, $event)">\r\n\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n</button>');
$templateCache.put('views/button/asg-pin.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleMenu($event)">\r\n\t<span ng-if="$ctrl.config.menu" class="glyphicon glyphicon-chevron-up"></span>\r\n\t<span ng-if="!$ctrl.config.menu" class="glyphicon glyphicon-chevron-down"></span>\r\n</button>');
$templateCache.put('views/button/asg-playstop.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.autoPlayToggle($event)">\r\n\t<span ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t<span ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n</button>');
$templateCache.put('views/button/asg-prev.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toBackward(true, $event)">\r\n\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n</button>');
$templateCache.put('views/button/asg-size.html','<button class="btn btn-default btn-sm btn-size" ng-click="$ctrl.toggleSize($event)">\r\n\t{{ $ctrl.config.size }}\r\n</button>');
$templateCache.put('views/button/asg-thumbnails.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toggleThumbnails($event)">\r\n\t<span class="glyphicon glyphicon-option-horizontal"></span>\r\n</button>');
$templateCache.put('views/button/asg-transition.html','<button class="btn btn-default btn-sm hidden-xs btn-transitions" data-ng-if="!$ctrl.asg.isSingle" data-ng-click="$ctrl.nextTransition($event)">\r\n\t{{ $ctrl.config.transition }}\r\n</button>');}]);