/**
 * angular-super-gallery - AngularJS Super Gallery
 * 
 * @version v1.4.7
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
                duplicates: false,
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
                'zlideLR',
                'zlideTB',
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
                DOUBLE_IMAGE: 'ASG-double-image-',
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
                var length_1 = edit.add.length;
                for (var key = 0; key < length_1; key++) {
                    this.addImage(edit.add[key]);
                }
            }
            if (edit.update) {
                this.selected = null;
                var length_2 = edit.update.length;
                for (var key = 0; key < length_2; key++) {
                    this.addImage(edit.update[key], key);
                }
                var count = this.files.length - edit.update.length;
                if (count > 0) {
                    this.deleteImage(length_2, count);
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
        ServiceController.prototype.findImage = function (filename) {
            var length = this.files.length;
            for (var key = 0; key < length; key++) {
                if (this.files[key].source.modal === filename) {
                    return this.files[key];
                }
            }
            return false;
        };
        ServiceController.prototype.addImage = function (value, index) {
            if (value === undefined || value === null) {
                return;
            }
            var self = this;
            if (angular.isString(value) === true) {
                value = { source: { modal: value } };
            }
            var getAvailableSource = function (type, src) {
                if (src[type]) {
                    return self.options.baseUrl + src[type];
                }
                else {
                    if (type === 'panel') {
                        type = 'image';
                        if (src[type]) {
                            return self.options.baseUrl + src[type];
                        }
                    }
                    if (type === 'image') {
                        type = 'modal';
                        if (src[type]) {
                            return self.options.baseUrl + src[type];
                        }
                    }
                    if (type === 'modal') {
                        type = 'image';
                        if (src[type]) {
                            return self.options.baseUrl + src[type];
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
                if (self.options.duplicates !== true && this.findImage(file.source.modal)) {
                    self.event(self.events.DOUBLE_IMAGE, file);
                    return;
                }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzZy50cyIsImFzZy1jb250cm9sLnRzIiwiYXNnLWltYWdlLnRzIiwiYXNnLWluZm8udHMiLCJhc2ctbW9kYWwudHMiLCJhc2ctcGFuZWwudHMiLCJhc2ctc2VydmljZS50cyIsImFzZy10aHVtYm5haWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBVSxtQkFBbUIsQ0EyQjVCO0FBM0JELFdBQVUsbUJBQW1CO0lBRTVCLElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFdkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDdEIsT0FBTyxVQUFVLEtBQVcsRUFBRSxTQUFrQjtZQUUvQyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDakQsT0FBTyxFQUFFLENBQUM7YUFDVjtZQUVELElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtnQkFDaEIsT0FBTyxHQUFHLENBQUM7YUFDWDtZQUVELElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxFQUFFO2dCQUNyQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO2FBQ2Q7WUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FB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R0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztpQkFDbEU7Z0JBRUQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1lBRTNELENBQUM7OztXQUFBO1FBRUYsMEJBQUM7SUFBRCxDQWpJQSxBQWlJQyxJQUFBO0lBaklZLHVDQUFtQixzQkFpSS9CLENBQUE7SUFFRCxJQUFJLEdBQUcsR0FBZSxPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFFNUQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUU7UUFDN0IsVUFBVSxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsbUJBQW1CLENBQUMsbUJBQW1CLENBQUM7UUFDekYsUUFBUSxFQUFFLG9LQUFvSztRQUM5SyxRQUFRLEVBQUU7WUFDVCxFQUFFLEVBQUUsR0FBRztZQUNQLEtBQUssRUFBRSxJQUFJO1lBQ1gsT0FBTyxFQUFFLElBQUk7WUFDYixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUUsSUFBSTtTQUNiO0tBQ0QsQ0FBQyxDQUFDO0FBRUosQ0FBQyxFQXJKUyxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBcUo1QiIsImZpbGUiOiJhbmd1bGFyLXN1cGVyLWdhbGxlcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5uYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknLCBbJ25nQW5pbWF0ZScsICduZ1RvdWNoJ10pO1xyXG5cclxuXHRhcHAuZmlsdGVyKCdhc2dCeXRlcycsICgpID0+IHtcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoYnl0ZXMgOiBhbnksIHByZWNpc2lvbiA6IG51bWJlcikgOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0aWYgKGlzTmFOKHBhcnNlRmxvYXQoYnl0ZXMpKSB8fCAhaXNGaW5pdGUoYnl0ZXMpKSB7XHJcblx0XHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoYnl0ZXMgPT09IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gJzAnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodHlwZW9mIHByZWNpc2lvbiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRwcmVjaXNpb24gPSAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgdW5pdHMgPSBbJ2J5dGVzJywgJ2tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJ10sXHJcblx0XHRcdFx0bnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZygxMDI0KSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gKGJ5dGVzIC8gTWF0aC5wb3coMTAyNCwgTWF0aC5mbG9vcihudW1iZXIpKSkudG9GaXhlZChwcmVjaXNpb24pICsgJyAnICsgdW5pdHNbbnVtYmVyXTtcclxuXHJcblx0XHR9O1xyXG5cdH0pO1xyXG5cclxufVxyXG5cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgQ29udHJvbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZDogc3RyaW5nO1xyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ2NvbnRyb2wnO1xyXG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgdGVtcGxhdGU7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IoXHJcblx0XHRcdHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRwcml2YXRlICRzY29wZTogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHR0aGlzLnRlbXBsYXRlID0gJ3ZpZXdzL2FzZy1jb250cm9sLmh0bWwnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdFx0dGhpcy4kc2NvcGUuZm9yd2FyZCA9ICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQodHJ1ZSk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR0aGlzLiRzY29wZS5iYWNrd2FyZCA9ICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IGltYWdlIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKTogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZTogSU9wdGlvbnNJbWFnZSkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0NvbnRyb2wnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5Db250cm9sQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctY29udHJvbCB7eyAkY3RybC5hc2cuY2xhc3NlcyB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgSW1hZ2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmwgOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ2ltYWdlJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHJvb3RTY29wZSA6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkZWxlbWVudCA6IG5nLklSb290RWxlbWVudFNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICR3aW5kb3cgOiBuZy5JV2luZG93U2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCgncmVzaXplJywgKGV2ZW50KSA9PiB7XHJcblx0XHRcdFx0dGhpcy5vblJlc2l6ZSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBvblJlc2l6ZSgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5oZWlnaHRBdXRvLm9ucmVzaXplKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRIZWlnaHQodGhpcy5hc2cuZmlsZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHRcdC8vIHNldCBpbWFnZSBjb21wb25lbnQgaGVpZ2h0XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kb24odGhpcy5hc2cuZXZlbnRzLkZJUlNUX0lNQUdFICsgdGhpcy5pZCwgKGV2ZW50LCBkYXRhKSA9PiB7XHJcblxyXG5cdFx0XHRcdGlmICghdGhpcy5jb25maWcuaGVpZ2h0ICYmIHRoaXMuY29uZmlnLmhlaWdodEF1dG8uaW5pdGlhbCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRIZWlnaHQoZGF0YS5pbWcpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5hc2cudGh1bWJuYWlsc01vdmUoMjAwKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gc2NvcGUgYXBwbHkgd2hlbiBpbWFnZSBsb2FkZWRcclxuXHRcdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmFzZy5ldmVudHMuTE9BRF9JTUFHRSArIHRoaXMuaWQsIChldmVudCwgZGF0YSkgPT4ge1xyXG5cclxuXHRcdFx0XHR0aGlzLiRzY29wZS4kYXBwbHkoKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29tcG9uZW50IGhlaWdodFxyXG5cdFx0cHJpdmF0ZSBzZXRIZWlnaHQoaW1nKSB7XHJcblxyXG5cdFx0XHRsZXQgd2lkdGggPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCdkaXYnKVswXS5jbGllbnRXaWR0aDtcclxuXHRcdFx0bGV0IHJhdGlvID0gaW1nLndpZHRoIC8gaW1nLmhlaWdodDtcclxuXHRcdFx0dGhpcy5jb25maWcuaGVpZ2h0ID0gd2lkdGggLyByYXRpbztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaGVpZ2h0XHJcblx0XHRwdWJsaWMgZ2V0IGhlaWdodCgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5oZWlnaHQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zSW1hZ2UpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHRcclxuXHRcdHB1YmxpYyB0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICgkZXZlbnQpIHtcclxuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0ZvcndhcmQoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKCRldmVudCkge1xyXG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHN0b3ApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgaG92ZXIoaW5kZXggOiBudW1iZXIsICRldmVudD8gOiBNb3VzZUV2ZW50KSB7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuYXJyb3dzLnByZWxvYWQgPT09IHRydWUpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5ob3ZlclByZWxvYWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gbW9kYWwgYXZhaWxhYmxlXHJcblx0XHRwdWJsaWMgZ2V0IG1vZGFsQXZhaWxhYmxlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm1vZGFsQXZhaWxhYmxlICYmIHRoaXMuY29uZmlnLmNsaWNrLm1vZGFsO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBvcGVuIHRoZSBtb2RhbFxyXG5cdFx0cHVibGljIG1vZGFsT3BlbigkZXZlbnQgOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHRpZiAoJGV2ZW50KSB7XHJcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2subW9kYWwpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbE9wZW4odGhpcy5hc2cuc2VsZWN0ZWQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnSW1hZ2UnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHJvb3RTY29wZScsICckZWxlbWVudCcsICckd2luZG93JywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuSW1hZ2VDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLWltYWdlLmh0bWwnLFxyXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdGJhc2VVcmw6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIEluZm9Db250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcclxuXHRcdHByaXZhdGUgYXNnOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblx0XHRwcml2YXRlIHR5cGU7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKFxyXG5cdFx0XHRwcml2YXRlIHNlcnZpY2U6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0cHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdFx0dGhpcy50eXBlID0gJ2luZm8nO1xyXG5cdFx0XHR0aGlzLnRlbXBsYXRlID0gJ3ZpZXdzL2FzZy1pbmZvLmh0bWwnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgZ2V0IGZpbGUoKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5maWxlO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dJbmZvJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuSW5mb0NvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYXNnLWluZm8ge3sgJGN0cmwuYXNnLmNsYXNzZXMgfX1cIj48ZGl2IG5nLWluY2x1ZGU9XCIkY3RybC50ZW1wbGF0ZVwiPjwvZGl2PjwvZGl2PicsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIE1vZGFsQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHRcdHB1YmxpYyBiYXNlVXJsIDogc3RyaW5nO1xyXG5cclxuXHRcdHByaXZhdGUgdHlwZSA9ICdtb2RhbCc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgYXJyb3dzVmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHdpbmRvdyA6IG5nLklXaW5kb3dTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkcm9vdFNjb3BlIDogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICRzY29wZSA6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHRcdFx0dGhpcy5hc2cubW9kYWxBdmFpbGFibGUgPSB0cnVlO1xyXG5cclxuXHRcdFx0Ly8gc2NvcGUgYXBwbHkgd2hlbiBpbWFnZSBsb2FkZWRcclxuXHRcdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmFzZy5ldmVudHMuTE9BRF9JTUFHRSArIHRoaXMuaWQsIChldmVudCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuJHNjb3BlLiRhcHBseSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwcml2YXRlIGdldENsYXNzKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmNvbmZpZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IG5nQ2xhc3MgPSBbXTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5oZWFkZXIuZHluYW1pYykge1xyXG5cdFx0XHRcdG5nQ2xhc3MucHVzaCgnZHluYW1pYycpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRuZ0NsYXNzLnB1c2godGhpcy5hc2cub3B0aW9ucy50aGVtZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gbmdDbGFzcy5qb2luKCcgJyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBhY3Rpb24gZnJvbSBrZXljb2Rlc1xyXG5cdFx0cHJpdmF0ZSBnZXRBY3Rpb25CeUtleUNvZGUoa2V5Q29kZSA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0bGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5rZXljb2Rlcyk7XHJcblx0XHRcdGxldCBhY3Rpb247XHJcblxyXG5cdFx0XHRmb3IgKGxldCBrZXkgaW4ga2V5cykge1xyXG5cclxuXHRcdFx0XHRsZXQgY29kZXMgPSB0aGlzLmNvbmZpZy5rZXljb2Rlc1trZXlzW2tleV1dO1xyXG5cclxuXHRcdFx0XHRpZiAoIWNvZGVzKSB7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBpbmRleCA9IGNvZGVzLmluZGV4T2Yoa2V5Q29kZSk7XHJcblxyXG5cdFx0XHRcdGlmIChpbmRleCA+IC0xKSB7XHJcblx0XHRcdFx0XHRhY3Rpb24gPSBrZXlzW2tleV07XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gYWN0aW9uO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGNsb3NlKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xvc2UoKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbCkge1xyXG5cdFx0XHRcdHRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsLmV4aXQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgaW1hZ2VDbGljaygkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLmNsb3NlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxDbG9zZSgpO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy4kd2luZG93LnNjcmVlbmZ1bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsLmV4aXQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGhvdmVyKGluZGV4IDogbnVtYmVyLCAkZXZlbnQ/IDogTW91c2VFdmVudCkge1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmFycm93cy5wcmVsb2FkID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuaG92ZXJQcmVsb2FkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc2V0Rm9jdXMoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5VG9nZ2xlKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLmF1dG9QbGF5VG9nZ2xlKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0ZpcnN0KHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cudG9GaXJzdCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9CYWNrd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0ZvcndhcmQoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0xhc3Qoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy50b0xhc3Qoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGRvIGtleWJvYXJkIGFjdGlvblxyXG5cdFx0cHVibGljIGtleVVwKGUgOiBLZXlib2FyZEV2ZW50KSB7XHJcblxyXG5cdFx0XHRsZXQgYWN0aW9uIDogc3RyaW5nID0gdGhpcy5nZXRBY3Rpb25CeUtleUNvZGUoZS5rZXlDb2RlKTtcclxuXHJcblx0XHRcdHN3aXRjaCAoYWN0aW9uKSB7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2V4aXQnOlxyXG5cdFx0XHRcdFx0dGhpcy5jbG9zZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3BsYXlwYXVzZSc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy5hdXRvUGxheVRvZ2dsZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2ZvcndhcmQnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2JhY2t3YXJkJzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnZmlyc3QnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9GaXJzdCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdsYXN0JzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvTGFzdCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdmdWxsc2NyZWVuJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlRnVsbFNjcmVlbigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ21lbnUnOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNZW51KCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnY2FwdGlvbic6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUNhcHRpb24oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdoZWxwJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlSGVscCgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3NpemUnOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVTaXplKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAndHJhbnNpdGlvbic6XHJcblx0XHRcdFx0XHR0aGlzLm5leHRUcmFuc2l0aW9uKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLmxvZygndW5rbm93biBrZXlib2FyZCBhY3Rpb246ICcgKyBlLmtleUNvZGUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBzd2l0Y2ggdG8gbmV4dCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHJpdmF0ZSBuZXh0VHJhbnNpdGlvbigkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHRsZXQgaWR4ID0gdGhpcy5hc2cudHJhbnNpdGlvbnMuaW5kZXhPZih0aGlzLmNvbmZpZy50cmFuc2l0aW9uKSArIDE7XHJcblx0XHRcdGxldCBuZXh0ID0gaWR4ID49IHRoaXMuYXNnLnRyYW5zaXRpb25zLmxlbmd0aCA/IDAgOiBpZHg7XHJcblx0XHRcdHRoaXMuY29uZmlnLnRyYW5zaXRpb24gPSB0aGlzLmFzZy50cmFuc2l0aW9uc1tuZXh0XTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHRvZ2dsZSBmdWxsc2NyZWVuXHJcblx0XHRwcml2YXRlIHRvZ2dsZUZ1bGxTY3JlZW4oJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHRcdGlmICh0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbCkge1xyXG5cdFx0XHRcdHRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsLnRvZ2dsZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSB0aHVtYm5haWxzXHJcblx0XHRwcml2YXRlIHRvZ2dsZVRodW1ibmFpbHMoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcudGh1bWJuYWlsLmR5bmFtaWMgPSAhdGhpcy5jb25maWcudGh1bWJuYWlsLmR5bmFtaWM7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHVibGljIHNldFRyYW5zaXRpb24odHJhbnNpdGlvbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGVtZVxyXG5cdFx0cHVibGljIHNldFRoZW1lKHRoZW1lIDogc3RyaW5nLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zLnRoZW1lID0gdGhlbWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBoZWxwXHJcblx0XHRwcml2YXRlIHRvZ2dsZUhlbHAoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcuaGVscCA9ICF0aGlzLmNvbmZpZy5oZWxwO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgc2l6ZVxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVTaXplKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdGxldCBpbmRleCA9IHRoaXMuYXNnLnNpemVzLmluZGV4T2YodGhpcy5jb25maWcuc2l6ZSk7XHJcblx0XHRcdGluZGV4ID0gKGluZGV4ICsgMSkgPj0gdGhpcy5hc2cuc2l6ZXMubGVuZ3RoID8gMCA6ICsraW5kZXg7XHJcblx0XHRcdHRoaXMuY29uZmlnLnNpemUgPSB0aGlzLmFzZy5zaXplc1tpbmRleF07XHJcblx0XHRcdHRoaXMuYXNnLmxvZygndG9nZ2xlIGltYWdlIHNpemU6JywgW3RoaXMuY29uZmlnLnNpemUsIGluZGV4XSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBtZW51XHJcblx0XHRwcml2YXRlIHRvZ2dsZU1lbnUoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcuaGVhZGVyLmR5bmFtaWMgPSAhdGhpcy5jb25maWcuaGVhZGVyLmR5bmFtaWM7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBjYXB0aW9uXHJcblx0XHRwcml2YXRlIHRvZ2dsZUNhcHRpb24oKSB7XHJcblxyXG5cdFx0XHR0aGlzLmNvbmZpZy5jYXB0aW9uLnZpc2libGUgPSAhdGhpcy5jb25maWcuY2FwdGlvbi52aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbWFyZ2ludCB0b3BcclxuXHRcdHB1YmxpYyBnZXQgbWFyZ2luVG9wKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLm1hcmdpblRvcDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1hcmdpbiBib3R0b21cclxuXHRcdHB1YmxpYyBnZXQgbWFyZ2luQm90dG9tKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLm1hcmdpbkJvdHRvbTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1vZGFsIHZpc2libGVcclxuXHRcdHB1YmxpYyBnZXQgdmlzaWJsZSgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5tb2RhbFZpc2libGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBtb2RhbCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgc2V0IHZpc2libGUodmFsdWUgOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbFZpc2libGUgPSB2YWx1ZTtcclxuXHRcdFx0dGhpcy5hc2cuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtb2RhbCBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc01vZGFsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBtb2RhbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNNb2RhbCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ01vZGFsJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyR3aW5kb3cnLCAnJHJvb3RTY29wZScsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5Lk1vZGFsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FzZy1tb2RhbC5odG1sJyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR2aXNpYmxlOiAnPT8nLFxyXG5cdFx0XHRiYXNlVXJsOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIFBhbmVsQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9uczogSU9wdGlvbnM7XHJcblx0XHRwdWJsaWMgaXRlbXM6IEFycmF5PElGaWxlPjtcclxuXHRcdHB1YmxpYyBiYXNlVXJsOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ3BhbmVsJztcclxuXHRcdHByaXZhdGUgdGVtcGxhdGU7XHJcblx0XHRwcml2YXRlIGFzZzogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKFxyXG5cdFx0XHRwcml2YXRlIHNlcnZpY2U6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0cHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdFx0dGhpcy50ZW1wbGF0ZSA9ICd2aWV3cy9hc2ctcGFuZWwuaHRtbCc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldFNlbGVjdGVkKGluZGV4OiBudW1iZXIsICRldmVudD86IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5tb2RhbCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLm1vZGFsT3BlbihpbmRleCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2suc2VsZWN0KSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBob3ZlcihpbmRleDogbnVtYmVyLCAkZXZlbnQ/OiBNb3VzZUV2ZW50KSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuaG92ZXIucHJlbG9hZCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5ob3Zlci5zZWxlY3QgPT09IHRydWUpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5zZXRTZWxlY3RlZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHBhbmVsIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKTogSU9wdGlvbnNQYW5lbCB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgcGFuZWwgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZTogSU9wdGlvbnNQYW5lbCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnUGFuZWwnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5QYW5lbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYXNnLXBhbmVsIHt7ICRjdHJsLmFzZy5jbGFzc2VzIH19XCIgbmctbW91c2VvdmVyPVwiJGN0cmwuYXNnLm92ZXIucGFuZWwgPSB0cnVlO1wiIG5nLW1vdXNlbGVhdmU9XCIkY3RybC5hc2cub3Zlci5wYW5lbCA9IGZhbHNlO1wiIG5nLXNob3c9XCIkY3RybC5jb25maWcudmlzaWJsZVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPjwvZGl2PicsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAJyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR2aXNpYmxlOiAnPT8nLFxyXG5cdFx0XHR0ZW1wbGF0ZTogJ0A/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XG5cbm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcblxuXHQvLyBtb2RhbCBjb21wb25lbnQgb3B0aW9uc1xuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zTW9kYWwge1xuXG5cdFx0aGVhZGVyPzoge1xuXHRcdFx0ZW5hYmxlZD86IGJvb2xlYW47XG5cdFx0XHRkeW5hbWljPzogYm9vbGVhbjtcblx0XHRcdGJ1dHRvbnM6IEFycmF5PHN0cmluZz47XG5cdFx0fTtcblx0XHRoZWxwPzogYm9vbGVhbjtcblx0XHRjYXB0aW9uPzoge1xuXHRcdFx0ZGlzYWJsZWQ/OiBib29sZWFuO1xuXHRcdFx0dmlzaWJsZT86IGJvb2xlYW47XG5cdFx0XHRwb3NpdGlvbj86IHN0cmluZztcblx0XHR9O1xuXHRcdHRyYW5zaXRpb24/OiBzdHJpbmc7XG5cdFx0dGl0bGU/OiBzdHJpbmc7XG5cdFx0c3VidGl0bGU/OiBzdHJpbmc7XG5cdFx0YXJyb3dzPzoge1xuXHRcdFx0cHJlbG9hZD86IGJvb2xlYW47XG5cdFx0XHRlbmFibGVkPzogYm9vbGVhbjtcblx0XHR9O1xuXHRcdHNpemU/OiBzdHJpbmc7XG5cdFx0dGh1bWJuYWlsPzogSU9wdGlvbnNUaHVtYm5haWw7XG5cdFx0bWFyZ2luVG9wPzogbnVtYmVyO1xuXHRcdG1hcmdpbkJvdHRvbT86IG51bWJlcjtcblx0XHRjbGljaz86IHtcblx0XHRcdGNsb3NlOiBib29sZWFuO1xuXHRcdH07XG5cdFx0a2V5Y29kZXM/OiB7XG5cdFx0XHRleGl0PzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdHBsYXlwYXVzZT86IEFycmF5PG51bWJlcj47XG5cdFx0XHRmb3J3YXJkPzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGJhY2t3YXJkPzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGZpcnN0PzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGxhc3Q/OiBBcnJheTxudW1iZXI+O1xuXHRcdFx0ZnVsbHNjcmVlbj86IEFycmF5PG51bWJlcj47XG5cdFx0XHRtZW51PzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGNhcHRpb24/OiBBcnJheTxudW1iZXI+O1xuXHRcdFx0aGVscD86IEFycmF5PG51bWJlcj47XG5cdFx0XHRzaXplPzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdHRyYW5zaXRpb24/OiBBcnJheTxudW1iZXI+O1xuXHRcdH07XG5cdH1cblxuXHQvLyBwYW5lbCBjb21wb25lbnQgb3B0aW9uc1xuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zUGFuZWwge1xuXG5cdFx0dmlzaWJsZT86IGJvb2xlYW47XG5cdFx0aXRlbT86IHtcblx0XHRcdGNsYXNzPzogc3RyaW5nO1xuXHRcdFx0Y2FwdGlvbjogYm9vbGVhbjtcblx0XHRcdGluZGV4OiBib29sZWFuO1xuXHRcdH07XG5cdFx0aG92ZXI/OiB7XG5cdFx0XHRwcmVsb2FkOiBib29sZWFuO1xuXHRcdFx0c2VsZWN0OiBib29sZWFuO1xuXHRcdH07XG5cdFx0Y2xpY2s/OiB7XG5cdFx0XHRzZWxlY3Q6IGJvb2xlYW47XG5cdFx0XHRtb2RhbDogYm9vbGVhbjtcblx0XHR9O1xuXG5cdH1cblxuXHQvLyB0aHVtYm5haWwgY29tcG9uZW50IG9wdGlvbnNcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc1RodW1ibmFpbCB7XG5cblx0XHRoZWlnaHQ/OiBudW1iZXI7XG5cdFx0aW5kZXg/OiBib29sZWFuO1xuXHRcdGVuYWJsZWQ/OiBib29sZWFuO1xuXHRcdGR5bmFtaWM/OiBib29sZWFuO1xuXHRcdGF1dG9oaWRlOiBib29sZWFuO1xuXHRcdGNsaWNrPzoge1xuXHRcdFx0c2VsZWN0OiBib29sZWFuO1xuXHRcdFx0bW9kYWw6IGJvb2xlYW47XG5cdFx0fTtcblx0XHRob3Zlcj86IHtcblx0XHRcdHByZWxvYWQ6IGJvb2xlYW47XG5cdFx0XHRzZWxlY3Q6IGJvb2xlYW47XG5cdFx0fTtcblxuXHR9XG5cblx0Ly8gaW5mbyBjb21wb25lbnQgb3B0aW9uc1xuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zSW5mbyB7XG5cblx0fVxuXG5cdC8vIGltYWdlIGNvbXBvbmVudCBvcHRpb25zXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNJbWFnZSB7XG5cblx0XHR0cmFuc2l0aW9uPzogc3RyaW5nO1xuXHRcdHNpemU/OiBzdHJpbmc7XG5cdFx0YXJyb3dzPzoge1xuXHRcdFx0cHJlbG9hZD86IGJvb2xlYW47XG5cdFx0XHRlbmFibGVkPzogYm9vbGVhbjtcblx0XHR9O1xuXHRcdGNsaWNrPzoge1xuXHRcdFx0bW9kYWw6IGJvb2xlYW47XG5cdFx0fTtcblx0XHRoZWlnaHQ/OiBudW1iZXI7XG5cdFx0aGVpZ2h0TWluPzogbnVtYmVyO1xuXHRcdGhlaWdodEF1dG8/OiB7XG5cdFx0XHRpbml0aWFsPzogYm9vbGVhbjtcblx0XHRcdG9ucmVzaXplPzogYm9vbGVhbjtcblx0XHR9O1xuXG5cdH1cblxuXHQvLyBnYWxsZXJ5IG9wdGlvbnNcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9ucyB7XG5cblx0XHRkZWJ1Zz86IGJvb2xlYW47XG5cdFx0YmFzZVVybD86IHN0cmluZztcblx0XHRoYXNoVXJsPzogYm9vbGVhbjtcblx0XHRkdXBsaWNhdGVzPzogYm9vbGVhbjtcblx0XHRmaWVsZHM/OiB7XG5cdFx0XHRzb3VyY2U/OiB7XG5cdFx0XHRcdG1vZGFsPzogc3RyaW5nO1xuXHRcdFx0XHRwYW5lbD86IHN0cmluZztcblx0XHRcdFx0aW1hZ2U/OiBzdHJpbmc7XG5cdFx0XHRcdHBsYWNlaG9sZGVyPzogc3RyaW5nO1xuXHRcdFx0fVxuXHRcdFx0dGl0bGU/OiBzdHJpbmc7XG5cdFx0XHRkZXNjcmlwdGlvbj86IHN0cmluZztcblx0XHRcdHRodW1ibmFpbD86IHN0cmluZztcblx0XHR9O1xuXHRcdGF1dG9wbGF5Pzoge1xuXHRcdFx0ZW5hYmxlZD86IGJvb2xlYW47XG5cdFx0XHRkZWxheT86IG51bWJlcjtcblx0XHR9O1xuXHRcdHRoZW1lPzogc3RyaW5nO1xuXHRcdHByZWxvYWQ/OiBBcnJheTxudW1iZXI+O1xuXHRcdHByZWxvYWROZXh0PzogYm9vbGVhbjtcblx0XHRwcmVsb2FkRGVsYXk/OiBudW1iZXI7XG5cdFx0bG9hZGluZ0ltYWdlPzogc3RyaW5nO1xuXHRcdG1vZGFsPzogSU9wdGlvbnNNb2RhbDtcblx0XHRwYW5lbD86IElPcHRpb25zUGFuZWw7XG5cdFx0aW1hZ2U/OiBJT3B0aW9uc0ltYWdlO1xuXHRcdHRodW1ibmFpbD86IElPcHRpb25zVGh1bWJuYWlsO1xuXG5cdH1cblxuXHQvLyBpbWFnZSBzb3VyY2Vcblx0ZXhwb3J0IGludGVyZmFjZSBJU291cmNlIHtcblxuXHRcdG1vZGFsOiBzdHJpbmc7IC8vIG9yaWdpbmFsLCByZXF1aXJlZFxuXHRcdHBhbmVsPzogc3RyaW5nO1xuXHRcdGltYWdlPzogc3RyaW5nO1xuXHRcdGNvbG9yPzogc3RyaW5nO1xuXHRcdHBsYWNlaG9sZGVyPzogc3RyaW5nO1xuXG5cdH1cblxuXHQvLyBpbWFnZSBmaWxlXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUZpbGUge1xuXG5cdFx0c291cmNlOiBJU291cmNlO1xuXHRcdHRpdGxlPzogc3RyaW5nO1xuXHRcdG5hbWU/OiBzdHJpbmc7XG5cdFx0ZXh0ZW5zaW9uPzogc3RyaW5nO1xuXHRcdGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXHRcdGRvd25sb2FkPzogc3RyaW5nO1xuXHRcdGxvYWRlZD86IHtcblx0XHRcdG1vZGFsPzogYm9vbGVhbjtcblx0XHRcdHBhbmVsPzogYm9vbGVhbjtcblx0XHRcdGltYWdlPzogYm9vbGVhbjtcblx0XHR9O1xuXHRcdHdpZHRoPzogbnVtYmVyO1xuXHRcdGhlaWdodD86IG51bWJlcjtcblxuXHR9XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJT3ZlciB7XG5cdFx0bW9kYWxJbWFnZTogYm9vbGVhbjtcblx0XHRwYW5lbDogYm9vbGVhbjtcblx0fVxuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUVkaXQge1xuXHRcdGRlbGV0ZTogbnVtYmVyO1xuXHRcdGFkZDogQXJyYXk8SUZpbGU+O1xuXHRcdHVwZGF0ZTogQXJyYXk8SUZpbGU+O1xuXHRcdHJlZnJlc2g6IGJvb2xlYW47XG5cdFx0b3B0aW9uczogSU9wdGlvbnM7XG5cdFx0ZGVsYXlUaHVtYm5haWxzOiBudW1iZXI7XG5cdFx0ZGVsYXlSZWZyZXNoOiBudW1iZXI7XG5cdH1cblxuXHQvLyBzZXJ2aWNlIGNvbnRyb2xsZXIgaW50ZXJmYWNlXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVNlcnZpY2VDb250cm9sbGVyIHtcblxuXHRcdG1vZGFsVmlzaWJsZTogYm9vbGVhbjtcblx0XHRwYW5lbFZpc2libGU6IGJvb2xlYW47XG5cdFx0bW9kYWxBdmFpbGFibGU6IGJvb2xlYW47XG5cdFx0bW9kYWxJbml0aWFsaXplZDogYm9vbGVhbjtcblx0XHR0cmFuc2l0aW9uczogQXJyYXk8c3RyaW5nPjtcblx0XHR0aGVtZXM6IEFycmF5PHN0cmluZz47XG5cdFx0Y2xhc3Nlczogc3RyaW5nO1xuXHRcdG9wdGlvbnM6IElPcHRpb25zO1xuXHRcdGl0ZW1zOiBBcnJheTxJRmlsZT47XG5cdFx0c2VsZWN0ZWQ6IG51bWJlcjtcblx0XHRmaWxlOiBJRmlsZTtcblx0XHRzaXplczogQXJyYXk8c3RyaW5nPjtcblx0XHRpZDogc3RyaW5nO1xuXHRcdGlzU2luZ2xlOiBib29sZWFuO1xuXHRcdGV2ZW50czoge1xuXHRcdFx0Q09ORklHX0xPQUQ6IHN0cmluZztcblx0XHRcdEFVVE9QTEFZX1NUQVJUOiBzdHJpbmc7XG5cdFx0XHRBVVRPUExBWV9TVE9QOiBzdHJpbmc7XG5cdFx0XHRQQVJTRV9JTUFHRVM6IHN0cmluZztcblx0XHRcdExPQURfSU1BR0U6IHN0cmluZztcblx0XHRcdEZJUlNUX0lNQUdFOiBzdHJpbmc7XG5cdFx0XHRDSEFOR0VfSU1BR0U6IHN0cmluZztcblx0XHRcdERPVUJMRV9JTUFHRTogc3RyaW5nO1xuXHRcdFx0TU9EQUxfT1BFTjogc3RyaW5nO1xuXHRcdFx0TU9EQUxfQ0xPU0U6IHN0cmluZztcblx0XHRcdEdBTExFUllfVVBEQVRFRDogc3RyaW5nO1xuXHRcdFx0R0FMTEVSWV9FRElUOiBzdHJpbmc7XG5cdFx0fTtcblxuXHRcdGdldEluc3RhbmNlKGNvbXBvbmVudDogYW55KTogSVNlcnZpY2VDb250cm9sbGVyO1xuXG5cdFx0c2V0RGVmYXVsdHMoKTogdm9pZDtcblxuXHRcdHNldE9wdGlvbnMob3B0aW9uczogSU9wdGlvbnMpOiBJT3B0aW9ucztcblxuXHRcdHNldEl0ZW1zKGl0ZW1zOiBBcnJheTxJRmlsZT4sIGZvcmNlPzogYm9vbGVhbik6IHZvaWQ7XG5cblx0XHRwcmVsb2FkKHdhaXQ/OiBudW1iZXIpOiB2b2lkO1xuXG5cdFx0bm9ybWFsaXplKGluZGV4OiBudW1iZXIpOiBudW1iZXI7XG5cblx0XHRzZXRGb2N1cygpOiB2b2lkO1xuXG5cdFx0c2V0U2VsZWN0ZWQoaW5kZXg6IG51bWJlcik7XG5cblx0XHRtb2RhbE9wZW4oaW5kZXg6IG51bWJlcik6IHZvaWQ7XG5cblx0XHRtb2RhbENsb3NlKCk6IHZvaWQ7XG5cblx0XHRtb2RhbENsaWNrKCRldmVudD86IFVJRXZlbnQpOiB2b2lkO1xuXG5cdFx0dGh1bWJuYWlsc01vdmUoZGVsYXk/OiBudW1iZXIpOiB2b2lkO1xuXG5cdFx0dG9CYWNrd2FyZChzdG9wPzogYm9vbGVhbik6IHZvaWQ7XG5cblx0XHR0b0ZvcndhcmQoc3RvcD86IGJvb2xlYW4pOiB2b2lkO1xuXG5cdFx0dG9GaXJzdChzdG9wPzogYm9vbGVhbik6IHZvaWQ7XG5cblx0XHR0b0xhc3Qoc3RvcD86IGJvb2xlYW4pOiB2b2lkO1xuXG5cdFx0bG9hZEltYWdlKGluZGV4PzogbnVtYmVyKTogdm9pZDtcblxuXHRcdGxvYWRJbWFnZXMoaW5kZXhlczogQXJyYXk8bnVtYmVyPik6IHZvaWQ7XG5cblx0XHRob3ZlclByZWxvYWQoaW5kZXg6IG51bWJlcik6IHZvaWQ7XG5cblx0XHRhdXRvUGxheVRvZ2dsZSgpOiB2b2lkO1xuXG5cdFx0dG9nZ2xlKGVsZW1lbnQ6IHN0cmluZyk6IHZvaWQ7XG5cblx0XHRzZXRIYXNoKCk6IHZvaWQ7XG5cblx0XHRkb3dubG9hZExpbmsoKTogc3RyaW5nO1xuXG5cdFx0ZWwoc2VsZWN0b3IpOiBOb2RlTGlzdDtcblxuXHRcdGxvZyhldmVudDogc3RyaW5nLCBkYXRhPzogYW55KTogdm9pZDtcblxuXG5cdH1cblxuXHQvLyBzZXJ2aWNlIGNvbnRyb2xsZXJcblx0ZXhwb3J0IGNsYXNzIFNlcnZpY2VDb250cm9sbGVyIHtcblxuXHRcdHB1YmxpYyBzbHVnID0gJ2FzZyc7XG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XG5cdFx0cHVibGljIGl0ZW1zOiBhbnk7XG5cdFx0cHVibGljIGZpbGVzOiBBcnJheTxJRmlsZT4gPSBbXTtcblx0XHRwdWJsaWMgZGlyZWN0aW9uOiBzdHJpbmc7XG5cdFx0cHVibGljIG1vZGFsQXZhaWxhYmxlID0gZmFsc2U7XG5cdFx0cHVibGljIG1vZGFsSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuXHRcdHByaXZhdGUgaW5zdGFuY2VzOiB7fSA9IHt9O1xuXHRcdHByaXZhdGUgX3NlbGVjdGVkOiBudW1iZXI7XG5cdFx0cHJpdmF0ZSBfdmlzaWJsZSA9IGZhbHNlO1xuXHRcdHByaXZhdGUgYXV0b3BsYXk6IGFuZ3VsYXIuSVByb21pc2U8YW55Pjtcblx0XHRwcml2YXRlIGZpcnN0ID0gZmFsc2U7XG5cdFx0cHJpdmF0ZSBlZGl0aW5nID0gZmFsc2U7XG5cblx0XHRwdWJsaWMgb3B0aW9uczogSU9wdGlvbnMgPSBudWxsO1xuXHRcdHB1YmxpYyBvcHRpb25zTG9hZGVkID0gZmFsc2U7XG5cdFx0cHVibGljIGRlZmF1bHRzOiBJT3B0aW9ucyA9IHtcblx0XHRcdGRlYnVnOiBmYWxzZSwgLy8gaW1hZ2UgbG9hZCwgYXV0b3BsYXksIGV0Yy4gaW5mbyBpbiBjb25zb2xlLmxvZ1xuXHRcdFx0aGFzaFVybDogdHJ1ZSwgLy8gZW5hYmxlL2Rpc2FibGUgaGFzaCB1c2FnZSBpbiB1cmwgKCNhc2ctbmF0dXJlLTQpXG5cdFx0XHRiYXNlVXJsOiAnJywgLy8gdXJsIHByZWZpeFxuXHRcdFx0ZHVwbGljYXRlczogZmFsc2UsIC8vIGVuYWJsZSBvciBkaXNhYmxlIHNhbWUgaW1hZ2VzICh1cmwpIGluIGdhbGxlcnlcblx0XHRcdGZpZWxkczoge1xuXHRcdFx0XHRzb3VyY2U6IHtcblx0XHRcdFx0XHRtb2RhbDogJ3VybCcsIC8vIHJlcXVpcmVkLCBpbWFnZSB1cmwgZm9yIG1vZGFsIGNvbXBvbmVudCAobGFyZ2Ugc2l6ZSlcblx0XHRcdFx0XHRwYW5lbDogJ3VybCcsIC8vIGltYWdlIHVybCBmb3IgcGFuZWwgY29tcG9uZW50ICh0aHVtYm5haWwgc2l6ZSlcblx0XHRcdFx0XHRpbWFnZTogJ3VybCcsIC8vIGltYWdlIHVybCBmb3IgaW1hZ2UgKG1lZGl1bSBvciBjdXN0b20gc2l6ZSlcblx0XHRcdFx0XHRwbGFjZWhvbGRlcjogbnVsbCAvLyBpbWFnZSB1cmwgZm9yIHByZWxvYWQgbG93cmVzIGltYWdlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRpdGxlOiAndGl0bGUnLCAvLyB0aXRsZSBmaWVsZCBuYW1lXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiAnZGVzY3JpcHRpb24nLCAvLyBkZXNjcmlwdGlvbiBmaWVsZCBuYW1lXG5cdFx0XHR9LFxuXHRcdFx0YXV0b3BsYXk6IHtcblx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsIC8vIHNsaWRlc2hvdyBwbGF5IGVuYWJsZWQvZGlzYWJsZWRcblx0XHRcdFx0ZGVsYXk6IDQxMDAgLy8gYXV0b3BsYXkgZGVsYXkgaW4gbWlsbGlzZWNvbmRcblx0XHRcdH0sXG5cdFx0XHR0aGVtZTogJ2RlZmF1bHQnLCAvLyBjc3Mgc3R5bGUgW2RlZmF1bHQsIGRhcmtibHVlLCBkYXJrcmVkLCB3aGl0ZWdvbGRdXG5cdFx0XHRwcmVsb2FkTmV4dDogZmFsc2UsIC8vIHByZWxvYWQgbmV4dCBpbWFnZSAoZm9yd2FyZC9iYWNrd2FyZClcblx0XHRcdHByZWxvYWREZWxheTogNzcwLCAvLyBwcmVsb2FkIGRlbGF5IGZvciBwcmVsb2FkTmV4dFxuXHRcdFx0bG9hZGluZ0ltYWdlOiAncHJlbG9hZC5zdmcnLCAvLyBsb2FkZXIgaW1hZ2Vcblx0XHRcdHByZWxvYWQ6IFtdLCAvLyBwcmVsb2FkIGltYWdlcyBieSBpbmRleCBudW1iZXJcblx0XHRcdG1vZGFsOiB7XG5cdFx0XHRcdHRpdGxlOiAnJywgLy8gbW9kYWwgd2luZG93IHRpdGxlXG5cdFx0XHRcdHN1YnRpdGxlOiAnJywgLy8gbW9kYWwgd2luZG93IHN1YnRpdGxlXG5cdFx0XHRcdGNhcHRpb246IHtcblx0XHRcdFx0XHRkaXNhYmxlZDogZmFsc2UsIC8vIGRpc2FibGUgaW1hZ2UgY2FwdGlvblxuXHRcdFx0XHRcdHZpc2libGU6IHRydWUsIC8vIHNob3cvaGlkZSBpbWFnZSBjYXB0aW9uXG5cdFx0XHRcdFx0cG9zaXRpb246ICd0b3AnIC8vIGNhcHRpb24gcG9zaXRpb24gW3RvcCwgYm90dG9tXVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRoZWFkZXI6IHtcblx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLCAvLyBlbmFibGUvZGlzYWJsZSBtb2RhbCBtZW51XG5cdFx0XHRcdFx0ZHluYW1pYzogZmFsc2UsIC8vIHNob3cvaGlkZSBtb2RhbCBtZW51IG9uIG1vdXNlb3ZlclxuXHRcdFx0XHRcdGJ1dHRvbnM6IFsncGxheXN0b3AnLCAnaW5kZXgnLCAncHJldicsICduZXh0JywgJ3BpbicsICdzaXplJywgJ3RyYW5zaXRpb24nLCAndGh1bWJuYWlscycsICdmdWxsc2NyZWVuJywgJ2hlbHAnLCAnY2xvc2UnXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0aGVscDogZmFsc2UsIC8vIHNob3cvaGlkZSBoZWxwXG5cdFx0XHRcdGFycm93czoge1xuXHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsIC8vIHNob3cvaGlkZSBhcnJvd3Ncblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjbGljazoge1xuXHRcdFx0XHRcdGNsb3NlOiB0cnVlIC8vIHdoZW4gY2xpY2sgb24gdGhlIGltYWdlIGNsb3NlIHRoZSBtb2RhbFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aHVtYm5haWw6IHtcblx0XHRcdFx0XHRoZWlnaHQ6IDUwLCAvLyB0aHVtYm5haWwgaW1hZ2UgaGVpZ2h0IGluIHBpeGVsXG5cdFx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93IGluZGV4IG51bWJlciBvbiB0aHVtYm5haWxcblx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLCAvLyBlbmFibGUvZGlzYWJsZSB0aHVtYm5haWxzXG5cdFx0XHRcdFx0ZHluYW1pYzogZmFsc2UsIC8vIGlmIHRydWUgdGh1bWJuYWlscyB2aXNpYmxlIG9ubHkgd2hlbiBtb3VzZW92ZXJcblx0XHRcdFx0XHRhdXRvaGlkZTogdHJ1ZSwgLy8gaGlkZSB0aHVtYm5haWwgY29tcG9uZW50IHdoZW4gc2luZ2xlIGltYWdlXG5cdFx0XHRcdFx0Y2xpY2s6IHtcblx0XHRcdFx0XHRcdHNlbGVjdDogdHJ1ZSwgLy8gc2V0IHNlbGVjdGVkIGltYWdlIHdoZW4gdHJ1ZVxuXHRcdFx0XHRcdFx0bW9kYWw6IGZhbHNlIC8vIG9wZW4gbW9kYWwgd2hlbiB0cnVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRob3Zlcjoge1xuXHRcdFx0XHRcdFx0cHJlbG9hZDogdHJ1ZSwgLy8gcHJlbG9hZCBpbWFnZSBvbiBtb3VzZW92ZXJcblx0XHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XG5cdFx0XHRcdHNpemU6ICdjb3ZlcicsIC8vIGNvbnRhaW4sIGNvdmVyLCBhdXRvLCBzdHJldGNoXG5cdFx0XHRcdGtleWNvZGVzOiB7XG5cdFx0XHRcdFx0ZXhpdDogWzI3XSwgLy8gZXNjXG5cdFx0XHRcdFx0cGxheXBhdXNlOiBbODBdLCAvLyBwXG5cdFx0XHRcdFx0Zm9yd2FyZDogWzMyLCAzOV0sIC8vIHNwYWNlLCByaWdodCBhcnJvd1xuXHRcdFx0XHRcdGJhY2t3YXJkOiBbMzddLCAvLyBsZWZ0IGFycm93XG5cdFx0XHRcdFx0Zmlyc3Q6IFszOCwgMzZdLCAvLyB1cCBhcnJvdywgaG9tZVxuXHRcdFx0XHRcdGxhc3Q6IFs0MCwgMzVdLCAvLyBkb3duIGFycm93LCBlbmRcblx0XHRcdFx0XHRmdWxsc2NyZWVuOiBbMTNdLCAvLyBlbnRlclxuXHRcdFx0XHRcdG1lbnU6IFs3N10sIC8vIG1cblx0XHRcdFx0XHRjYXB0aW9uOiBbNjddLCAvLyBjXG5cdFx0XHRcdFx0aGVscDogWzcyXSwgLy8gaFxuXHRcdFx0XHRcdHNpemU6IFs4M10sIC8vIHNcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiBbODRdIC8vIHRcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHRodW1ibmFpbDoge1xuXHRcdFx0XHRoZWlnaHQ6IDUwLCAvLyB0aHVtYm5haWwgaW1hZ2UgaGVpZ2h0IGluIHBpeGVsXG5cdFx0XHRcdGluZGV4OiBmYWxzZSwgLy8gc2hvdyBpbmRleCBudW1iZXIgb24gdGh1bWJuYWlsXG5cdFx0XHRcdGR5bmFtaWM6IGZhbHNlLCAvLyBpZiB0cnVlIHRodW1ibmFpbHMgdmlzaWJsZSBvbmx5IHdoZW4gbW91c2VvdmVyXG5cdFx0XHRcdGF1dG9oaWRlOiBmYWxzZSwgLy8gaGlkZSB0aHVtYm5haWwgY29tcG9uZW50IHdoZW4gc2luZ2xlIGltYWdlXG5cdFx0XHRcdGNsaWNrOiB7XG5cdFx0XHRcdFx0c2VsZWN0OiB0cnVlLCAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugd2hlbiB0cnVlXG5cdFx0XHRcdFx0bW9kYWw6IGZhbHNlIC8vIG9wZW4gbW9kYWwgd2hlbiB0cnVlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhvdmVyOiB7XG5cdFx0XHRcdFx0cHJlbG9hZDogdHJ1ZSwgLy8gcHJlbG9hZCBpbWFnZSBvbiBtb3VzZW92ZXJcblx0XHRcdFx0XHRzZWxlY3Q6IGZhbHNlIC8vIHNldCBzZWxlY3RlZCBpbWFnZSBvbiBtb3VzZW92ZXIgd2hlbiB0cnVlXG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdFx0cGFuZWw6IHtcblx0XHRcdFx0dmlzaWJsZTogdHJ1ZSxcblx0XHRcdFx0aXRlbToge1xuXHRcdFx0XHRcdGNsYXNzOiAnY29sLW1kLTMnLCAvLyBpdGVtIGNsYXNzXG5cdFx0XHRcdFx0Y2FwdGlvbjogZmFsc2UsIC8vIHNob3cvaGlkZSBpbWFnZSBjYXB0aW9uXG5cdFx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93L2hpZGUgaW1hZ2UgaW5kZXhcblx0XHRcdFx0fSxcblx0XHRcdFx0aG92ZXI6IHtcblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxuXHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcblx0XHRcdFx0fSxcblx0XHRcdFx0Y2xpY2s6IHtcblx0XHRcdFx0XHRzZWxlY3Q6IGZhbHNlLCAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugd2hlbiB0cnVlXG5cdFx0XHRcdFx0bW9kYWw6IHRydWUgLy8gb3BlbiBtb2RhbCB3aGVuIHRydWVcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0XHRpbWFnZToge1xuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XG5cdFx0XHRcdHNpemU6ICdjb3ZlcicsIC8vIGNvbnRhaW4sIGNvdmVyLCBhdXRvLCBzdHJldGNoXG5cdFx0XHRcdGFycm93czoge1xuXHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsICAvLyBzaG93L2hpZGUgYXJyb3dzXG5cdFx0XHRcdFx0cHJlbG9hZDogdHJ1ZSwgLy8gcHJlbG9hZCBpbWFnZSBvbiBtb3VzZW92ZXJcblx0XHRcdFx0fSxcblx0XHRcdFx0Y2xpY2s6IHtcblx0XHRcdFx0XHRtb2RhbDogdHJ1ZSAvLyB3aGVuIGNsaWNrIG9uIHRoZSBpbWFnZSBvcGVuIHRoZSBtb2RhbCB3aW5kb3dcblx0XHRcdFx0fSxcblx0XHRcdFx0aGVpZ2h0OiBudWxsLCAvLyBoZWlnaHQgaW4gcGl4ZWxcblx0XHRcdFx0aGVpZ2h0TWluOiBudWxsLCAvLyBtaW4gaGVpZ2h0IGluIHBpeGVsXG5cdFx0XHRcdGhlaWdodEF1dG86IHtcblx0XHRcdFx0XHRpbml0aWFsOiB0cnVlLCAvLyBjYWxjdWxhdGUgZGl2IGhlaWdodCBieSBmaXJzdCBpbWFnZVxuXHRcdFx0XHRcdG9ucmVzaXplOiBmYWxzZSAvLyBjYWxjdWxhdGUgZGl2IGhlaWdodCBvbiB3aW5kb3cgcmVzaXplXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Ly8gYXZhaWxhYmxlIGltYWdlIHNpemVzXG5cdFx0cHVibGljIHNpemVzOiBBcnJheTxzdHJpbmc+ID0gW1xuXHRcdFx0J2NvbnRhaW4nLFxuXHRcdFx0J2NvdmVyJyxcblx0XHRcdCdhdXRvJyxcblx0XHRcdCdzdHJldGNoJ1xuXHRcdF07XG5cblx0XHQvLyBhdmFpbGFibGUgdGhlbWVzXG5cdFx0cHVibGljIHRoZW1lczogQXJyYXk8c3RyaW5nPiA9IFtcblx0XHRcdCdkZWZhdWx0Jyxcblx0XHRcdCdkYXJrYmx1ZScsXG5cdFx0XHQnd2hpdGVnb2xkJ1xuXHRcdF07XG5cblx0XHQvLyBhdmFpbGFibGUgdHJhbnNpdGlvbnNcblx0XHRwdWJsaWMgdHJhbnNpdGlvbnM6IEFycmF5PHN0cmluZz4gPSBbXG5cdFx0XHQnbm8nLFxuXHRcdFx0J2ZhZGVJbk91dCcsXG5cdFx0XHQnem9vbUluJyxcblx0XHRcdCd6b29tT3V0Jyxcblx0XHRcdCd6b29tSW5PdXQnLFxuXHRcdFx0J3JvdGF0ZUxSJyxcblx0XHRcdCdyb3RhdGVUQicsXG5cdFx0XHQncm90YXRlWlknLFxuXHRcdFx0J3NsaWRlTFInLFxuXHRcdFx0J3NsaWRlVEInLFxuXHRcdFx0J3psaWRlTFInLFxuXHRcdFx0J3psaWRlVEInLFxuXHRcdFx0J2ZsaXBYJyxcblx0XHRcdCdmbGlwWSdcblx0XHRdO1xuXG5cdFx0cHVibGljIGV2ZW50cyA9IHtcblx0XHRcdENPTkZJR19MT0FEOiAnQVNHLWNvbmZpZy1sb2FkLScsXG5cdFx0XHRBVVRPUExBWV9TVEFSVDogJ0FTRy1hdXRvcGxheS1zdGFydC0nLFxuXHRcdFx0QVVUT1BMQVlfU1RPUDogJ0FTRy1hdXRvcGxheS1zdG9wLScsXG5cdFx0XHRQQVJTRV9JTUFHRVM6ICdBU0ctcGFyc2UtaW1hZ2VzLScsXG5cdFx0XHRMT0FEX0lNQUdFOiAnQVNHLWxvYWQtaW1hZ2UtJyxcblx0XHRcdEZJUlNUX0lNQUdFOiAnQVNHLWZpcnN0LWltYWdlLScsXG5cdFx0XHRDSEFOR0VfSU1BR0U6ICdBU0ctY2hhbmdlLWltYWdlLScsXG5cdFx0XHRET1VCTEVfSU1BR0U6ICdBU0ctZG91YmxlLWltYWdlLScsXG5cdFx0XHRNT0RBTF9PUEVOOiAnQVNHLW1vZGFsLW9wZW4tJyxcblx0XHRcdE1PREFMX0NMT1NFOiAnQVNHLW1vZGFsLWNsb3NlLScsXG5cdFx0XHRUSFVNQk5BSUxfTU9WRTogJ0FTRy10aHVtYm5haWwtbW92ZS0nLFxuXHRcdFx0R0FMTEVSWV9VUERBVEVEOiAnQVNHLWdhbGxlcnktdXBkYXRlZC0nLFxuXHRcdFx0R0FMTEVSWV9FRElUOiAnQVNHLWdhbGxlcnktZWRpdCcsXG5cdFx0fTtcblxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSBpbnRlcnZhbDogbmcuSUludGVydmFsU2VydmljZSxcblx0XHRcdHByaXZhdGUgbG9jYXRpb246IG5nLklMb2NhdGlvblNlcnZpY2UsXG5cdFx0XHRwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSAkd2luZG93OiBuZy5JV2luZG93U2VydmljZSkge1xuXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCgncmVzaXplJywgKGV2ZW50KSA9PiB7XG5cdFx0XHRcdHRoaXMudGh1bWJuYWlsc01vdmUoMjAwKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBwYXJzZUhhc2goKSB7XG5cblx0XHRcdGlmICghdGhpcy5pZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICghdGhpcy5vcHRpb25zLmhhc2hVcmwpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgaGFzaCA9IHRoaXMubG9jYXRpb24uaGFzaCgpO1xuXHRcdFx0bGV0IHBhcnRzID0gaGFzaCA/IGhhc2guc3BsaXQoJy0nKSA6IG51bGw7XG5cblx0XHRcdGlmIChwYXJ0cyA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChwYXJ0c1swXSAhPT0gdGhpcy5zbHVnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHBhcnRzLmxlbmd0aCAhPT0gMykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChwYXJ0c1sxXSAhPT0gdGhpcy5pZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBpbmRleCA9IHBhcnNlSW50KHBhcnRzWzJdLCAxMCk7XG5cblx0XHRcdGlmICghYW5ndWxhci5pc051bWJlcihpbmRleCkpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xuXG5cdFx0XHRcdGluZGV4LS07XG5cdFx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleDtcblx0XHRcdFx0dGhpcy5tb2RhbE9wZW4oaW5kZXgpO1xuXG5cdFx0XHR9LCAyMCk7XG5cblx0XHR9XG5cblx0XHQvLyBjYWxjdWxhdGUgb2JqZWN0IGhhc2ggaWRcblx0XHRwdWJsaWMgb2JqZWN0SGFzaElkKG9iamVjdDogYW55KTogc3RyaW5nIHtcblxuXHRcdFx0bGV0IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KG9iamVjdCk7XG5cblx0XHRcdGlmICghc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgYWJjID0gc3RyaW5nLnJlcGxhY2UoL1teYS16QS1aMC05XSsvZywgJycpO1xuXHRcdFx0bGV0IGNvZGUgPSAwO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMCwgbiA9IGFiYy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0bGV0IGNoYXJjb2RlID0gYWJjLmNoYXJDb2RlQXQoaSk7XG5cdFx0XHRcdGNvZGUgKz0gKGNoYXJjb2RlICogaSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAnaWQnICsgY29kZS50b1N0cmluZygyMSk7XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZSBmb3IgY3VycmVudCBnYWxsZXJ5IGJ5IGNvbXBvbmVudCBpZFxuXHRcdHB1YmxpYyBnZXRJbnN0YW5jZShjb21wb25lbnQ6IGFueSkge1xuXG5cdFx0XHRpZiAoIWNvbXBvbmVudC5pZCkge1xuXG5cdFx0XHRcdC8vIGdldCBwYXJlbnQgYXNnIGNvbXBvbmVudCBpZFxuXHRcdFx0XHRpZiAoY29tcG9uZW50LiRzY29wZSAmJiBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQgJiYgY29tcG9uZW50LiRzY29wZS4kcGFyZW50LiRwYXJlbnQgJiYgY29tcG9uZW50LiRzY29wZS4kcGFyZW50LiRwYXJlbnQuJGN0cmwpIHtcblx0XHRcdFx0XHRjb21wb25lbnQuaWQgPSBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQuJHBhcmVudC4kY3RybC5pZDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb21wb25lbnQuaWQgPSB0aGlzLm9iamVjdEhhc2hJZChjb21wb25lbnQub3B0aW9ucyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBpZCA9IGNvbXBvbmVudC5pZDtcblx0XHRcdGxldCBpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzW2lkXTtcblxuXHRcdFx0Ly8gbmV3IGluc3RhbmNlIGFuZCBzZXQgb3B0aW9ucyBhbmQgaXRlbXNcblx0XHRcdGlmIChpbnN0YW5jZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGluc3RhbmNlID0gbmV3IFNlcnZpY2VDb250cm9sbGVyKHRoaXMudGltZW91dCwgdGhpcy5pbnRlcnZhbCwgdGhpcy5sb2NhdGlvbiwgdGhpcy4kcm9vdFNjb3BlLCB0aGlzLiR3aW5kb3cpO1xuXHRcdFx0XHRpbnN0YW5jZS5pZCA9IGlkO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY29tcG9uZW50LmJhc2VVcmwpIHtcblx0XHRcdFx0Y29tcG9uZW50Lm9wdGlvbnMuYmFzZVVybCA9IGNvbXBvbmVudC5iYXNlVXJsO1xuXHRcdFx0fVxuXG5cdFx0XHRpbnN0YW5jZS5zZXRPcHRpb25zKGNvbXBvbmVudC5vcHRpb25zKTtcblx0XHRcdGluc3RhbmNlLnNldEl0ZW1zKGNvbXBvbmVudC5pdGVtcyk7XG5cdFx0XHRpbnN0YW5jZS5zZWxlY3RlZCA9IGNvbXBvbmVudC5zZWxlY3RlZCA/IGNvbXBvbmVudC5zZWxlY3RlZCA6IDA7XG5cdFx0XHRpbnN0YW5jZS5wYXJzZUhhc2goKTtcblxuXHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMpIHtcblxuXHRcdFx0XHRpbnN0YW5jZS5sb2FkSW1hZ2VzKGluc3RhbmNlLm9wdGlvbnMucHJlbG9hZCk7XG5cblx0XHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMuYXV0b3BsYXkgJiYgaW5zdGFuY2Uub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkICYmICFpbnN0YW5jZS5hdXRvcGxheSkge1xuXHRcdFx0XHRcdGluc3RhbmNlLmF1dG9QbGF5U3RhcnQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdC8vIHVwZGF0ZSBpbWFnZXMgd2hlbiBlZGl0IGV2ZW50XG5cdFx0XHRpbnN0YW5jZS4kcm9vdFNjb3BlLiRvbih0aGlzLmV2ZW50cy5HQUxMRVJZX0VESVQsIChldmVudCwgZGF0YSkgPT4ge1xuXHRcdFx0XHRpZiAoaWQgPT09IGRhdGEuaWQgJiYgY29tcG9uZW50Lml0ZW1zKSB7XG5cdFx0XHRcdFx0aW5zdGFuY2UuZWRpdEdhbGxlcnkoZGF0YSwgY29tcG9uZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuaW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xuXHRcdFx0cmV0dXJuIGluc3RhbmNlO1xuXG5cdFx0fVxuXG5cdFx0Ly8gcHJlcGFyZSBpbWFnZXMgYXJyYXlcblx0XHRwdWJsaWMgc2V0SXRlbXMoaXRlbXM6IEFycmF5PElGaWxlPikge1xuXG5cdFx0XHRpZiAoIWl0ZW1zKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5pdGVtcyA9IGl0ZW1zO1xuXHRcdFx0dGhpcy5wcmVwYXJlSXRlbXMoKTtcblxuXHRcdH1cblxuXHRcdC8vIG9wdGlvbnMgc2V0dXBcblx0XHRwdWJsaWMgc2V0T3B0aW9ucyhvcHRpb25zOiBJT3B0aW9ucykge1xuXG5cdFx0XHQvLyBpZiBvcHRpb25zIGFscmVhZHkgc2V0dXBcblx0XHRcdGlmICh0aGlzLm9wdGlvbnNMb2FkZWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3B0aW9ucykge1xuXG5cdFx0XHRcdG9wdGlvbnMgPSBhbmd1bGFyLm1lcmdlKGFuZ3VsYXIuY29weSh0aGlzLmRlZmF1bHRzKSwgb3B0aW9ucyk7XG5cdFx0XHRcdHRoaXMub3B0aW9ucyA9IGFuZ3VsYXIuY29weShvcHRpb25zKTtcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5tb2RhbCAmJiBvcHRpb25zLm1vZGFsLmhlYWRlciAmJiBvcHRpb25zLm1vZGFsLmhlYWRlci5idXR0b25zKSB7XG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLm1vZGFsLmhlYWRlci5idXR0b25zID0gb3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMub3B0aW9uc0xvYWRlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLm9wdGlvbnMgPSBhbmd1bGFyLmNvcHkodGhpcy5kZWZhdWx0cyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGltcG9ydGFudCFcblx0XHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQ09ORklHX0xPQUQsIHRoaXMub3B0aW9ucyk7XG5cblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnM7XG5cblx0XHR9XG5cblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Vcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHY6IG51bWJlcikge1xuXG5cdFx0XHR2ID0gdGhpcy5ub3JtYWxpemUodik7XG5cdFx0XHRsZXQgcHJldiA9IHRoaXMuX3NlbGVjdGVkO1xuXG5cdFx0XHR0aGlzLl9zZWxlY3RlZCA9IHY7XG5cdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLl9zZWxlY3RlZCk7XG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcblxuXHRcdFx0aWYgKHByZXYgIT09IHRoaXMuX3NlbGVjdGVkKSB7XG5cblx0XHRcdFx0dGhpcy50aHVtYm5haWxzTW92ZSgpO1xuXHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkNIQU5HRV9JTUFHRSwge1xuXHRcdFx0XHRcdGluZGV4OiB2LFxuXHRcdFx0XHRcdGZpbGU6IHRoaXMuZmlsZVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZm9yY2Ugc2VsZWN0IGltYWdlXG5cdFx0cHVibGljIGZvcmNlU2VsZWN0KGluZGV4KSB7XG5cblx0XHRcdGluZGV4ID0gdGhpcy5ub3JtYWxpemUoaW5kZXgpO1xuXHRcdFx0dGhpcy5fc2VsZWN0ZWQgPSBpbmRleDtcblx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuX3NlbGVjdGVkKTtcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5DSEFOR0VfSU1BR0UsIHtcblx0XHRcdFx0aW5kZXg6IGluZGV4LFxuXHRcdFx0XHRmaWxlOiB0aGlzLmZpbGVcblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXg6IG51bWJlcikge1xuXG5cdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSBpbmRleCA+IHRoaXMuc2VsZWN0ZWQgPyAnZm9yd2FyZCcgOiAnYmFja3dhcmQnO1xuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IGluZGV4O1xuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XG5cblx0XHR9XG5cblxuXHRcdC8vIGdvIHRvIGJhY2t3YXJkXG5cdFx0cHVibGljIHRvQmFja3dhcmQoc3RvcD86IGJvb2xlYW4pIHtcblxuXHRcdFx0aWYgKHN0b3ApIHtcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnYmFja3dhcmQnO1xuXHRcdFx0dGhpcy5zZWxlY3RlZC0tO1xuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XG5cblx0XHR9XG5cblx0XHQvLyBnbyB0byBmb3J3YXJkXG5cdFx0cHVibGljIHRvRm9yd2FyZChzdG9wPzogYm9vbGVhbikge1xuXG5cdFx0XHRpZiAoc3RvcCkge1xuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdmb3J3YXJkJztcblx0XHRcdHRoaXMuc2VsZWN0ZWQrKztcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdG8gZmlyc3Rcblx0XHRwdWJsaWMgdG9GaXJzdChzdG9wPzogYm9vbGVhbikge1xuXG5cdFx0XHRpZiAoc3RvcCkge1xuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gMDtcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdG8gbGFzdFxuXHRcdHB1YmxpYyB0b0xhc3Qoc3RvcD86IGJvb2xlYW4pIHtcblxuXHRcdFx0aWYgKHN0b3ApIHtcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5pdGVtcy5sZW5ndGggLSAxO1xuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgc2V0SGFzaCgpIHtcblxuXHRcdFx0aWYgKHRoaXMubW9kYWxWaXNpYmxlICYmIHRoaXMub3B0aW9ucy5oYXNoVXJsKSB7XG5cdFx0XHRcdHRoaXMubG9jYXRpb24uaGFzaChbdGhpcy5zbHVnLCB0aGlzLmlkLCB0aGlzLnNlbGVjdGVkICsgMV0uam9pbignLScpKTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHB1YmxpYyBhdXRvUGxheVRvZ2dsZSgpIHtcblxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkKSB7XG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RhcnQoKTtcblx0XHRcdH1cblxuXHRcdH1cblxuXG5cdFx0cHVibGljIGF1dG9QbGF5U3RvcCgpIHtcblxuXHRcdFx0aWYgKCF0aGlzLmF1dG9wbGF5KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5pbnRlcnZhbC5jYW5jZWwodGhpcy5hdXRvcGxheSk7XG5cdFx0XHR0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0dGhpcy5hdXRvcGxheSA9IG51bGw7XG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkFVVE9QTEFZX1NUT1AsIHsgaW5kZXg6IHRoaXMuc2VsZWN0ZWQsIGZpbGU6IHRoaXMuZmlsZSB9KTtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyBhdXRvUGxheVN0YXJ0KCkge1xuXG5cdFx0XHRpZiAodGhpcy5hdXRvcGxheSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkID0gdHJ1ZTtcblx0XHRcdHRoaXMuYXV0b3BsYXkgPSB0aGlzLmludGVydmFsKCgpID0+IHtcblx0XHRcdFx0dGhpcy50b0ZvcndhcmQoKTtcblx0XHRcdH0sIHRoaXMub3B0aW9ucy5hdXRvcGxheS5kZWxheSk7XG5cblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQVVUT1BMQVlfU1RBUlQsIHsgaW5kZXg6IHRoaXMuc2VsZWN0ZWQsIGZpbGU6IHRoaXMuZmlsZSB9KTtcblxuXHRcdH1cblxuXG5cdFx0cHJpdmF0ZSBwcmVwYXJlSXRlbXMoKSB7XG5cblx0XHRcdGxldCBsZW5ndGggPSB0aGlzLml0ZW1zLmxlbmd0aDtcblx0XHRcdGZvciAobGV0IGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcblx0XHRcdFx0dGhpcy5hZGRJbWFnZSh0aGlzLml0ZW1zW2tleV0pO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLlBBUlNFX0lNQUdFUywgdGhpcy5maWxlcyk7XG5cblx0XHR9XG5cblx0XHQvLyBwcmVsb2FkIHRoZSBpbWFnZSB3aGVuIG1vdXNlb3ZlclxuXHRcdHB1YmxpYyBob3ZlclByZWxvYWQoaW5kZXg6IG51bWJlcikge1xuXG5cdFx0XHR0aGlzLmxvYWRJbWFnZShpbmRleCk7XG5cblx0XHR9XG5cblx0XHQvLyBpbWFnZSBwcmVsb2FkXG5cdFx0cHJpdmF0ZSBwcmVsb2FkKHdhaXQ/OiBudW1iZXIpIHtcblxuXHRcdFx0bGV0IGluZGV4ID0gdGhpcy5kaXJlY3Rpb24gPT09ICdmb3J3YXJkJyA/IHRoaXMuc2VsZWN0ZWQgKyAxIDogdGhpcy5zZWxlY3RlZCAtIDE7XG5cblx0XHRcdGlmICh0aGlzLm9wdGlvbnMucHJlbG9hZE5leHQgPT09IHRydWUpIHtcblx0XHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHR0aGlzLmxvYWRJbWFnZShpbmRleCk7XG5cdFx0XHRcdH0sICh3YWl0ICE9PSB1bmRlZmluZWQpID8gd2FpdCA6IHRoaXMub3B0aW9ucy5wcmVsb2FkRGVsYXkpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cHVibGljIG5vcm1hbGl6ZShpbmRleDogbnVtYmVyKSB7XG5cblx0XHRcdGxldCBsYXN0ID0gdGhpcy5maWxlcy5sZW5ndGggLSAxO1xuXG5cdFx0XHRpZiAoaW5kZXggPiBsYXN0KSB7XG5cdFx0XHRcdHJldHVybiAoaW5kZXggLSBsYXN0KSAtIDE7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpbmRleCA8IDApIHtcblx0XHRcdFx0cmV0dXJuIGxhc3QgLSBNYXRoLmFicyhpbmRleCkgKyAxO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gaW5kZXg7XG5cblx0XHR9XG5cblxuXHRcdHB1YmxpYyBsb2FkSW1hZ2VzKGluZGV4ZXM6IEFycmF5PG51bWJlcj4sIHR5cGU6IHN0cmluZykge1xuXG5cdFx0XHRpZiAoIWluZGV4ZXMgfHwgaW5kZXhlcy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0XHRcdGluZGV4ZXMuZm9yRWFjaCgoaW5kZXg6IG51bWJlcikgPT4ge1xuXHRcdFx0XHRzZWxmLmxvYWRJbWFnZShpbmRleCk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblxuXG5cdFx0cHVibGljIGxvYWRJbWFnZShpbmRleD86IG51bWJlciwgY2FsbGJhY2s/OiB7fSkge1xuXG5cdFx0XHRpbmRleCA9IGluZGV4ID8gaW5kZXggOiB0aGlzLnNlbGVjdGVkO1xuXHRcdFx0aW5kZXggPSB0aGlzLm5vcm1hbGl6ZShpbmRleCk7XG5cblx0XHRcdGlmICghdGhpcy5maWxlc1tpbmRleF0pIHtcblx0XHRcdFx0dGhpcy5sb2coJ2ludmFsaWQgZmlsZSBpbmRleCcsIHsgaW5kZXg6IGluZGV4IH0pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLm1vZGFsVmlzaWJsZSkge1xuXG5cdFx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWQubW9kYWwgPT09IHRydWUpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgbW9kYWwgPSBuZXcgSW1hZ2UoKTtcblx0XHRcdFx0bW9kYWwuc3JjID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlLm1vZGFsO1xuXHRcdFx0XHRtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5hZnRlckxvYWQoaW5kZXgsICdtb2RhbCcsIG1vZGFsKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZC5pbWFnZSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXHRcdFx0XHRpbWFnZS5zcmMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2UuaW1hZ2U7XG5cdFx0XHRcdGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5hZnRlckxvYWQoaW5kZXgsICdpbWFnZScsIGltYWdlKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIGdldCBmaWxlIG5hbWVcblx0XHRwcml2YXRlIGdldEZpbGVuYW1lKGluZGV4OiBudW1iZXIsIHR5cGU/OiBzdHJpbmcpIHtcblxuXHRcdFx0dHlwZSA9IHR5cGUgPyB0eXBlIDogJ21vZGFsJztcblx0XHRcdGxldCBmaWxlcGFydHMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2VbdHlwZV0uc3BsaXQoJy8nKTtcblx0XHRcdGxldCBmaWxlbmFtZSA9IGZpbGVwYXJ0c1tmaWxlcGFydHMubGVuZ3RoIC0gMV07XG5cdFx0XHRyZXR1cm4gZmlsZW5hbWU7XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgZmlsZSBleHRlbnNpb25cblx0XHRwcml2YXRlIGdldEV4dGVuc2lvbihpbmRleDogbnVtYmVyLCB0eXBlPzogc3RyaW5nKSB7XG5cblx0XHRcdHR5cGUgPSB0eXBlID8gdHlwZSA6ICdtb2RhbCc7XG5cdFx0XHRsZXQgZmlsZXBhcnRzID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlW3R5cGVdLnNwbGl0KCcuJyk7XG5cdFx0XHRsZXQgZXh0ZW5zaW9uID0gZmlsZXBhcnRzW2ZpbGVwYXJ0cy5sZW5ndGggLSAxXTtcblx0XHRcdHJldHVybiBleHRlbnNpb247XG5cblx0XHR9XG5cblx0XHQvLyBhZnRlciBsb2FkIGltYWdlXG5cdFx0cHJpdmF0ZSBhZnRlckxvYWQoaW5kZXgsIHR5cGUsIGltYWdlKSB7XG5cblx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWRbdHlwZV0gPT09IHRydWUpIHtcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubG9hZGVkW3R5cGVdID0gdHJ1ZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWRbdHlwZV0gPSB0cnVlO1xuXG5cdFx0XHRpZiAodHlwZSA9PT0gJ21vZGFsJykge1xuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS53aWR0aCA9IGltYWdlLndpZHRoO1xuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLm5hbWUgPSB0aGlzLmdldEZpbGVuYW1lKGluZGV4LCB0eXBlKTtcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0uZXh0ZW5zaW9uID0gdGhpcy5nZXRFeHRlbnNpb24oaW5kZXgsIHR5cGUpO1xuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5kb3dubG9hZCA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5tb2RhbDtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGRhdGEgPSB7IHR5cGU6IHR5cGUsIGluZGV4OiBpbmRleCwgZmlsZTogdGhpcy5maWxlLCBpbWc6IGltYWdlIH07XG5cblx0XHRcdGlmICghdGhpcy5maXJzdCkge1xuXHRcdFx0XHR0aGlzLmZpcnN0ID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5GSVJTVF9JTUFHRSwgZGF0YSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuTE9BRF9JTUFHRSwgZGF0YSk7XG5cblx0XHR9XG5cblxuXHRcdC8vIGlzIHNpbmdsZT9cblx0XHRwdWJsaWMgZ2V0IGlzU2luZ2xlKCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlcy5sZW5ndGggPiAxID8gZmFsc2UgOiB0cnVlO1xuXG5cdFx0fVxuXG5cblx0XHQvLyBnZXQgdGhlIGRvd25sb2FkIGxpbmtcblx0XHRwdWJsaWMgZG93bmxvYWRMaW5rKCkge1xuXG5cdFx0XHRpZiAodGhpcy5zZWxlY3RlZCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZmlsZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5maWxlc1t0aGlzLnNlbGVjdGVkXS5zb3VyY2UubW9kYWw7XG5cdFx0XHR9XG5cblx0XHR9XG5cblxuXHRcdC8vIGdldCB0aGUgZmlsZVxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpOiBJRmlsZSB7XG5cblx0XHRcdHJldHVybiB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdO1xuXG5cdFx0fVxuXG5cdFx0Ly8gdG9nZ2xlIGVsZW1lbnQgdmlzaWJsZVxuXHRcdHB1YmxpYyB0b2dnbGUoZWxlbWVudDogc3RyaW5nKTogdm9pZCB7XG5cblx0XHRcdHRoaXMub3B0aW9uc1tlbGVtZW50XS52aXNpYmxlID0gIXRoaXMub3B0aW9uc1tlbGVtZW50XS52aXNpYmxlO1xuXG5cdFx0fVxuXG5cblx0XHQvLyBnZXQgdmlzaWJsZVxuXHRcdHB1YmxpYyBnZXQgbW9kYWxWaXNpYmxlKCk6IGJvb2xlYW4ge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fdmlzaWJsZTtcblxuXHRcdH1cblxuXG5cdFx0Ly8gZ2V0IHRoZW1lXG5cdFx0cHVibGljIGdldCB0aGVtZSgpOiBzdHJpbmcge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLnRoZW1lO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IGNsYXNzZXNcblx0XHRwdWJsaWMgZ2V0IGNsYXNzZXMoKTogc3RyaW5nIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucy50aGVtZSArICcgJyArIHRoaXMuaWQgKyAodGhpcy5lZGl0aW5nID8gJyBlZGl0aW5nJyA6ICcnKTtcblxuXHRcdH1cblxuXHRcdC8vIGdldCBwcmVsb2FkIHN0eWxlXG5cdFx0cHVibGljIHByZWxvYWRTdHlsZShmaWxlOiBJRmlsZSwgdHlwZTogc3RyaW5nKSB7XG5cblx0XHRcdGxldCBzdHlsZSA9IHt9O1xuXG5cdFx0XHRpZiAoZmlsZS5zb3VyY2UuY29sb3IpIHtcblx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtY29sb3InXSA9IGZpbGUuc291cmNlLmNvbG9yO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmxvYWRpbmdJbWFnZSAmJiBmaWxlLmxvYWRlZFt0eXBlXSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtaW1hZ2UnXSA9ICd1cmwoJyArIHRoaXMub3B0aW9ucy5sb2FkaW5nSW1hZ2UgKyAnKSc7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzdHlsZTtcblxuXHRcdH1cblxuXHRcdC8vIGdldCBwbGFjZWhvbGRlciBzdHlsZVxuXHRcdHB1YmxpYyBwbGFjZWhvbGRlclN0eWxlKGZpbGU6IElGaWxlKSB7XG5cblx0XHRcdGxldCBzdHlsZSA9IHt9O1xuXG5cdFx0XHRpZiAoZmlsZS5zb3VyY2UuY29sb3IpIHtcblx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtY29sb3InXSA9IGZpbGUuc291cmNlLmNvbG9yO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZmlsZS5zb3VyY2UucGxhY2Vob2xkZXIpIHtcblx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtaW1hZ2UnXSA9ICd1cmwoJyArIGZpbGUuc291cmNlLnBsYWNlaG9sZGVyICsgJyknO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cblx0XHR9XG5cblx0XHQvLyBzZXQgdmlzaWJsZVxuXHRcdHB1YmxpYyBzZXQgbW9kYWxWaXNpYmxlKHZhbHVlOiBib29sZWFuKSB7XG5cblx0XHRcdHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcblxuXHRcdFx0Ly8gc2V0IGluZGV4IDAgaWYgIXNlbGVjdGVkXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZCA/IHRoaXMuc2VsZWN0ZWQgOiAwO1xuXG5cdFx0XHRsZXQgYm9keSA9IGRvY3VtZW50LmJvZHk7XG5cdFx0XHRsZXQgY2xhc3NOYW1lID0gJyBhc2cteWhpZGRlbic7XG5cblx0XHRcdGlmICh2YWx1ZSkge1xuXG5cdFx0XHRcdGlmIChib2R5LmNsYXNzTmFtZS5pbmRleE9mKGNsYXNzTmFtZSkgPCAwKSB7XG5cdFx0XHRcdFx0Ym9keS5jbGFzc05hbWUgPSBib2R5LmNsYXNzTmFtZSArIGNsYXNzTmFtZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMubW9kYWxJbml0KCk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ym9keS5jbGFzc05hbWUgPSBib2R5LmNsYXNzTmFtZS5yZXBsYWNlKGNsYXNzTmFtZSwgJycpO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBpbml0aWFsaXplIHRoZSBnYWxsZXJ5XG5cdFx0cHJpdmF0ZSBtb2RhbEluaXQoKSB7XG5cblx0XHRcdGxldCBzZWxmID0gdGhpcztcblxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcblx0XHRcdFx0c2VsZi5zZXRGb2N1cygpO1xuXHRcdFx0fSwgMTAwKTtcblxuXHRcdFx0dGhpcy50aHVtYm5haWxzTW92ZSg0NDApO1xuXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR0aGlzLm1vZGFsSW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHRcdFx0fSwgNDYwKTtcblxuXHRcdH1cblxuXG5cdFx0cHVibGljIG1vZGFsT3BlbihpbmRleDogbnVtYmVyKSB7XG5cblx0XHRcdGlmICghdGhpcy5tb2RhbEF2YWlsYWJsZSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleCAhPT0gdW5kZWZpbmVkID8gaW5kZXggOiB0aGlzLnNlbGVjdGVkO1xuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoKTtcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5NT0RBTF9PUEVOLCB7IGluZGV4OiB0aGlzLnNlbGVjdGVkIH0pO1xuXG5cdFx0fVxuXG5cdFx0cHVibGljIG1vZGFsQ2xvc2UoKSB7XG5cblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuaGFzaFVybCkge1xuXHRcdFx0XHR0aGlzLmxvY2F0aW9uLmhhc2goJycpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLm1vZGFsSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblx0XHRcdHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XG5cdFx0XHR0aGlzLmxvYWRJbWFnZSgpO1xuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5NT0RBTF9DTE9TRSwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCB9KTtcblxuXHRcdH1cblxuXHRcdC8vIG1vdmUgdGh1bWJuYWlscyB0byBjb3JyZWN0IHBvc2l0aW9uXG5cdFx0cHVibGljIHRodW1ibmFpbHNNb3ZlKGRlbGF5PzogbnVtYmVyKSB7XG5cblx0XHRcdGxldCBtb3ZlID0gKCkgPT4ge1xuXG5cdFx0XHRcdGxldCBjb250YWluZXJzID0gdGhpcy5lbCgnZGl2LmFzZy10aHVtYm5haWwuJyArIHRoaXMuaWQpO1xuXG5cdFx0XHRcdGlmICghY29udGFpbmVycy5sZW5ndGgpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRhaW5lcnMubGVuZ3RoOyBpKyspIHtcblxuXHRcdFx0XHRcdGxldCBjb250YWluZXI6IGFueSA9IGNvbnRhaW5lcnNbaV07XG5cblx0XHRcdFx0XHRpZiAoY29udGFpbmVyLm9mZnNldFdpZHRoKSB7XG5cblx0XHRcdFx0XHRcdGxldCBpdGVtczogYW55ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5pdGVtcycpO1xuXHRcdFx0XHRcdFx0bGV0IGl0ZW06IGFueSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdkaXYuaXRlbScpO1xuXHRcdFx0XHRcdFx0bGV0IHRodW1ibmFpbCwgbW92ZVgsIHJlbWFpbjtcblxuXHRcdFx0XHRcdFx0aWYgKGl0ZW0pIHtcblxuXHRcdFx0XHRcdFx0XHRpZiAoaXRlbXMuc2Nyb2xsV2lkdGggPiBjb250YWluZXIub2Zmc2V0V2lkdGgpIHtcblx0XHRcdFx0XHRcdFx0XHR0aHVtYm5haWwgPSBpdGVtcy5zY3JvbGxXaWR0aCAvIHRoaXMuZmlsZXMubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRcdG1vdmVYID0gKGNvbnRhaW5lci5vZmZzZXRXaWR0aCAvIDIpIC0gKHRoaXMuc2VsZWN0ZWQgKiB0aHVtYm5haWwpIC0gdGh1bWJuYWlsIC8gMjtcblx0XHRcdFx0XHRcdFx0XHRyZW1haW4gPSBpdGVtcy5zY3JvbGxXaWR0aCArIG1vdmVYO1xuXHRcdFx0XHRcdFx0XHRcdG1vdmVYID0gbW92ZVggPiAwID8gMCA6IG1vdmVYO1xuXHRcdFx0XHRcdFx0XHRcdG1vdmVYID0gcmVtYWluIDwgY29udGFpbmVyLm9mZnNldFdpZHRoID8gY29udGFpbmVyLm9mZnNldFdpZHRoIC0gaXRlbXMuc2Nyb2xsV2lkdGggOiBtb3ZlWDtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR0aHVtYm5haWwgPSB0aGlzLmdldFJlYWxXaWR0aChpdGVtKTtcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IChjb250YWluZXIub2Zmc2V0V2lkdGggLSB0aHVtYm5haWwgKiB0aGlzLmZpbGVzLmxlbmd0aCkgLyAyO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aXRlbXMuc3R5bGUubGVmdCA9IG1vdmVYICsgJ3B4JztcblxuXHRcdFx0XHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLlRIVU1CTkFJTF9NT1ZFLCB7XG5cdFx0XHRcdFx0XHRcdFx0dGh1bWJuYWlsOiB0aHVtYm5haWwsXG5cdFx0XHRcdFx0XHRcdFx0bW92ZTogbW92ZVgsXG5cdFx0XHRcdFx0XHRcdFx0cmVtYWluOiByZW1haW4sXG5cdFx0XHRcdFx0XHRcdFx0Y29udGFpbmVyOiBjb250YWluZXIub2Zmc2V0V2lkdGgsXG5cdFx0XHRcdFx0XHRcdFx0aXRlbXM6IGl0ZW1zLnNjcm9sbFdpZHRoXG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKGRlbGF5KSB7XG5cdFx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0bW92ZSgpO1xuXHRcdFx0XHR9LCBkZWxheSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtb3ZlKCk7XG5cdFx0XHR9XG5cblxuXHRcdH1cblxuXHRcdHB1YmxpYyBtb2RhbENsaWNrKCRldmVudD86IFVJRXZlbnQpIHtcblxuXHRcdFx0aWYgKCRldmVudCkge1xuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuc2V0Rm9jdXMoKTtcblxuXHRcdH1cblxuXHRcdC8vIHNldCB0aGUgZm9jdXNcblx0XHRwdWJsaWMgc2V0Rm9jdXMoKSB7XG5cblx0XHRcdGlmICh0aGlzLm1vZGFsVmlzaWJsZSkge1xuXG5cdFx0XHRcdGxldCBlbGVtZW50OiBOb2RlID0gdGhpcy5lbCgnZGl2LmFzZy1tb2RhbC4nICsgdGhpcy5pZCArICcgLmtleUlucHV0JylbMF07XG5cblx0XHRcdFx0aWYgKGVsZW1lbnQpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbWVudClbMF0uZm9jdXMoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRwcml2YXRlIGV2ZW50KGV2ZW50OiBzdHJpbmcsIGRhdGE/OiBhbnkpIHtcblxuXHRcdFx0ZXZlbnQgPSBldmVudCArIHRoaXMuaWQ7XG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJGVtaXQoZXZlbnQsIGRhdGEpO1xuXHRcdFx0dGhpcy5sb2coZXZlbnQsIGRhdGEpO1xuXG5cdFx0fVxuXG5cdFx0cHVibGljIGxvZyhldmVudDogc3RyaW5nLCBkYXRhPzogYW55KSB7XG5cblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZGVidWcpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coZXZlbnQsIGRhdGEgPyBkYXRhIDogbnVsbCk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgZWxlbWVudFxuXHRcdHB1YmxpYyBlbChzZWxlY3Rvcik6IE5vZGVMaXN0IHtcblxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gY2FsY3VsYXRpbmcgZWxlbWVudCByZWFsIHdpZHRoXG5cdFx0cHVibGljIGdldFJlYWxXaWR0aChpdGVtKSB7XG5cblx0XHRcdGxldCBzdHlsZSA9IGl0ZW0uY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGl0ZW0pLFxuXHRcdFx0XHR3aWR0aCA9IGl0ZW0ub2Zmc2V0V2lkdGgsXG5cdFx0XHRcdG1hcmdpbiA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpblJpZ2h0KSxcblx0XHRcdFx0Ly8gcGFkZGluZyA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0xlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nUmlnaHQpLFxuXHRcdFx0XHRib3JkZXIgPSBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlckxlZnRXaWR0aCkgKyBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlclJpZ2h0V2lkdGgpO1xuXG5cdFx0XHRyZXR1cm4gd2lkdGggKyBtYXJnaW4gKyBib3JkZXI7XG5cblx0XHR9XG5cblx0XHQvLyBjYWxjdWxhdGluZyBlbGVtZW50IHJlYWwgaGVpZ2h0XG5cdFx0cHVibGljIGdldFJlYWxIZWlnaHQoaXRlbSkge1xuXG5cdFx0XHRsZXQgc3R5bGUgPSBpdGVtLmN1cnJlbnRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShpdGVtKSxcblx0XHRcdFx0aGVpZ2h0ID0gaXRlbS5vZmZzZXRIZWlnaHQsXG5cdFx0XHRcdG1hcmdpbiA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luQm90dG9tKSxcblx0XHRcdFx0Ly8gcGFkZGluZyA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1RvcCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pLFxuXHRcdFx0XHRib3JkZXIgPSBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlclRvcFdpZHRoKSArIHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyQm90dG9tV2lkdGgpO1xuXG5cdFx0XHRyZXR1cm4gaGVpZ2h0ICsgbWFyZ2luICsgYm9yZGVyO1xuXG5cdFx0fVxuXG5cblx0XHQvLyBlZGl0IGdhbGxlcnlcblx0XHRwdWJsaWMgZWRpdEdhbGxlcnkoZWRpdDogSUVkaXQsIGNvbXBvbmVudCkge1xuXG5cdFx0XHR0aGlzLmVkaXRpbmcgPSB0cnVlO1xuXHRcdFx0bGV0IHNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZDtcblxuXHRcdFx0aWYgKGVkaXQub3B0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMub3B0aW9uc0xvYWRlZCA9IGZhbHNlO1xuXHRcdFx0XHR0aGlzLnNldE9wdGlvbnMoZWRpdC5vcHRpb25zKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGVkaXQuZGVsZXRlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5kZWxldGVJbWFnZShlZGl0LmRlbGV0ZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlZGl0LmFkZCkge1xuXHRcdFx0XHRzZWxlY3RlZCA9IHRoaXMuZmlsZXMubGVuZ3RoO1xuXHRcdFx0XHRsZXQgbGVuZ3RoID0gZWRpdC5hZGQubGVuZ3RoO1xuXHRcdFx0XHRmb3IgKGxldCBrZXkgPSAwOyBrZXkgPCBsZW5ndGg7IGtleSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5hZGRJbWFnZShlZGl0LmFkZFtrZXldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZWRpdC51cGRhdGUpIHtcblxuXHRcdFx0XHR0aGlzLnNlbGVjdGVkID0gbnVsbDtcblxuXHRcdFx0XHRsZXQgbGVuZ3RoID0gZWRpdC51cGRhdGUubGVuZ3RoO1xuXG5cdFx0XHRcdGZvciAobGV0IGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcblx0XHRcdFx0XHR0aGlzLmFkZEltYWdlKGVkaXQudXBkYXRlW2tleV0sIGtleSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgY291bnQgPSB0aGlzLmZpbGVzLmxlbmd0aCAtIGVkaXQudXBkYXRlLmxlbmd0aDtcblx0XHRcdFx0aWYgKGNvdW50ID4gMCkge1xuXHRcdFx0XHRcdHRoaXMuZGVsZXRlSW1hZ2UobGVuZ3RoLCBjb3VudCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcblxuXHRcdFx0XHRzZWxlY3RlZCA9IHRoaXMuZmlsZXNbc2VsZWN0ZWRdID8gc2VsZWN0ZWQgOiAoc2VsZWN0ZWQgPj0gdGhpcy5maWxlcy5sZW5ndGggPyBzZWxlY3RlZCAtIDEgOiBzZWxlY3RlZCArIDEpO1xuXG5cdFx0XHRcdHRoaXMuZm9yY2VTZWxlY3QodGhpcy5maWxlc1tzZWxlY3RlZF0gPyBzZWxlY3RlZCA6IDApO1xuXHRcdFx0XHR0aGlzLmVkaXRpbmcgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5HQUxMRVJZX1VQREFURUQsIGVkaXQpO1xuXHRcdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKGVkaXQuZGVsYXlUaHVtYm5haWxzICE9PSB1bmRlZmluZWQgPyBlZGl0LmRlbGF5VGh1bWJuYWlscyA6IDIyMCk7XG5cblx0XHRcdH0sIChlZGl0LmRlbGF5UmVmcmVzaCAhPT0gdW5kZWZpbmVkID8gZWRpdC5kZWxheVJlZnJlc2ggOiA0NDApKTtcblxuXHRcdH1cblxuXG5cdFx0Ly8gZGVsZXRlIGltYWdlXG5cdFx0cHVibGljIGRlbGV0ZUltYWdlKGluZGV4OiBudW1iZXIsIGNvdW50PzogbnVtYmVyKSB7XG5cblx0XHRcdGluZGV4ID0gaW5kZXggPT09IG51bGwgfHwgaW5kZXggPT09IHVuZGVmaW5lZCA/IHRoaXMuc2VsZWN0ZWQgOiBpbmRleDtcblx0XHRcdHRoaXMuZmlsZXMuc3BsaWNlKGluZGV4LCBjb3VudCA/IGNvdW50IDogMSk7XG5cblx0XHR9XG5cblx0XHQvLyBmaW5kIGltYWdlIGluIGdhbGxlcnkgYnkgbW9kYWwgc291cmNlXG5cdFx0cHVibGljIGZpbmRJbWFnZShmaWxlbmFtZSA6IHN0cmluZykge1xuXG5cdFx0XHRsZXQgbGVuZ3RoID0gdGhpcy5maWxlcy5sZW5ndGg7XG5cblx0XHRcdGZvciAobGV0IGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcblx0XHRcdFx0aWYgKHRoaXMuZmlsZXNba2V5XS5zb3VyY2UubW9kYWwgPT09IGZpbGVuYW1lKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZmlsZXNba2V5XTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHR9XG5cblx0XHQvLyBhZGQgaW1hZ2Vcblx0XHRwdWJsaWMgYWRkSW1hZ2UodmFsdWU6IGFueSwgaW5kZXg/OiBudW1iZXIpIHtcblxuXHRcdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzZWxmID0gdGhpcztcblxuXHRcdFx0aWYgKGFuZ3VsYXIuaXNTdHJpbmcodmFsdWUpID09PSB0cnVlKSB7XG5cdFx0XHRcdHZhbHVlID0geyBzb3VyY2U6IHsgbW9kYWw6IHZhbHVlIH0gfTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGdldEF2YWlsYWJsZVNvdXJjZSA9IGZ1bmN0aW9uICh0eXBlOiBzdHJpbmcsIHNyYzogSVNvdXJjZSkge1xuXG5cdFx0XHRcdGlmIChzcmNbdHlwZV0pIHtcblxuXHRcdFx0XHRcdHJldHVybiBzZWxmLm9wdGlvbnMuYmFzZVVybCArIHNyY1t0eXBlXTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICdwYW5lbCcpIHtcblx0XHRcdFx0XHRcdHR5cGUgPSAnaW1hZ2UnO1xuXHRcdFx0XHRcdFx0aWYgKHNyY1t0eXBlXSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5vcHRpb25zLmJhc2VVcmwgKyBzcmNbdHlwZV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICdpbWFnZScpIHtcblx0XHRcdFx0XHRcdHR5cGUgPSAnbW9kYWwnO1xuXHRcdFx0XHRcdFx0aWYgKHNyY1t0eXBlXSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5vcHRpb25zLmJhc2VVcmwgKyBzcmNbdHlwZV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICdtb2RhbCcpIHtcblx0XHRcdFx0XHRcdHR5cGUgPSAnaW1hZ2UnO1xuXHRcdFx0XHRcdFx0aWYgKHNyY1t0eXBlXSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5vcHRpb25zLmJhc2VVcmwgKyBzcmNbdHlwZV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCF2YWx1ZS5zb3VyY2UpIHtcblx0XHRcdFx0dmFsdWUuc291cmNlID0ge1xuXHRcdFx0XHRcdG1vZGFsOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5tb2RhbF0sXG5cdFx0XHRcdFx0cGFuZWw6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLnBhbmVsXSxcblx0XHRcdFx0XHRpbWFnZTogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UuaW1hZ2VdLFxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5wbGFjZWhvbGRlcl1cblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHNvdXJjZSA9IHtcblx0XHRcdFx0bW9kYWw6IGdldEF2YWlsYWJsZVNvdXJjZSgnbW9kYWwnLCB2YWx1ZS5zb3VyY2UpLFxuXHRcdFx0XHRwYW5lbDogZ2V0QXZhaWxhYmxlU291cmNlKCdwYW5lbCcsIHZhbHVlLnNvdXJjZSksXG5cdFx0XHRcdGltYWdlOiBnZXRBdmFpbGFibGVTb3VyY2UoJ2ltYWdlJywgdmFsdWUuc291cmNlKSxcblx0XHRcdFx0Y29sb3I6IHZhbHVlLmNvbG9yID8gdmFsdWUuY29sb3IgOiAndHJhbnNwYXJlbnQnLFxuXHRcdFx0XHRwbGFjZWhvbGRlcjogdmFsdWUucGxhY2Vob2xkZXIgPyBzZWxmLm9wdGlvbnMuYmFzZVVybCArIHZhbHVlLnBsYWNlaG9sZGVyIDogbnVsbFxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCFzb3VyY2UubW9kYWwpIHtcblx0XHRcdFx0c2VsZi5sb2coJ2ludmFsaWQgaW1hZ2UgZGF0YScsIHsgc291cmNlOiBzb3VyY2UsIHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgcGFydHMgPSBzb3VyY2UubW9kYWwuc3BsaXQoJy8nKTtcblx0XHRcdGxldCBmaWxlbmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuXHRcdFx0bGV0IHRpdGxlLCBkZXNjcmlwdGlvbjtcblxuXHRcdFx0aWYgKHNlbGYub3B0aW9ucy5maWVsZHMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aXRsZSA9IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aXRsZV0gOiBmaWxlbmFtZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRpdGxlID0gZmlsZW5hbWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzZWxmLm9wdGlvbnMuZmllbGRzICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0ZGVzY3JpcHRpb24gPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuZGVzY3JpcHRpb25dIDogbnVsbDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRlc2NyaXB0aW9uID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGZpbGUgPSB7XG5cdFx0XHRcdHNvdXJjZTogc291cmNlLFxuXHRcdFx0XHR0aXRsZTogdGl0bGUsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcblx0XHRcdFx0bG9hZGVkOiB7XG5cdFx0XHRcdFx0bW9kYWw6IGZhbHNlLFxuXHRcdFx0XHRcdHBhbmVsOiBmYWxzZSxcblx0XHRcdFx0XHRpbWFnZTogZmFsc2Vcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKGluZGV4ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5maWxlc1tpbmRleF0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XSA9IGZpbGU7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGlmIChzZWxmLm9wdGlvbnMuZHVwbGljYXRlcyAhPT0gdHJ1ZSAmJiB0aGlzLmZpbmRJbWFnZShmaWxlLnNvdXJjZS5tb2RhbCkpIHtcblx0XHRcdFx0XHRzZWxmLmV2ZW50KHNlbGYuZXZlbnRzLkRPVUJMRV9JTUFHRSwgZmlsZSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5maWxlcy5wdXNoKGZpbGUpO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fVxuXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xuXG5cdGFwcC5zZXJ2aWNlKCdhc2dTZXJ2aWNlJywgWyckdGltZW91dCcsICckaW50ZXJ2YWwnLCAnJGxvY2F0aW9uJywgJyRyb290U2NvcGUnLCAnJHdpbmRvdycsIFNlcnZpY2VDb250cm9sbGVyXSk7XG5cbn1cblxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgVGh1bWJuYWlsQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9uczogSU9wdGlvbnM7XHJcblx0XHRwdWJsaWMgaXRlbXM6IEFycmF5PElGaWxlPjtcclxuXHRcdHB1YmxpYyBiYXNlVXJsOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ3RodW1ibmFpbCc7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlO1xyXG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgbW9kYWwgPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihcclxuXHRcdFx0cHJpdmF0ZSBzZXJ2aWNlOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUsXHJcblx0XHRcdHByaXZhdGUgJGVsZW1lbnQ6IG5nLklSb290RWxlbWVudFNlcnZpY2UpIHtcclxuXHJcblx0XHRcdHRoaXMudGVtcGxhdGUgPSAndmlld3MvYXNnLXRodW1ibmFpbC5odG1sJztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHRcdC8vIGdldCBwYXJlbnQgYXNnIGNvbXBvbmVudCAobW9kYWwpXHJcblx0XHRcdGlmICh0aGlzLiRzY29wZSAmJiB0aGlzLiRzY29wZS4kcGFyZW50ICYmIHRoaXMuJHNjb3BlLiRwYXJlbnQuJHBhcmVudCAmJiB0aGlzLiRzY29wZS4kcGFyZW50LiRwYXJlbnQuJGN0cmwpIHtcclxuXHRcdFx0XHR0aGlzLm1vZGFsID0gdGhpcy4kc2NvcGUuJHBhcmVudC4kcGFyZW50LiRjdHJsLnR5cGUgPT09ICdtb2RhbCcgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXg6IG51bWJlciwgJGV2ZW50PzogTW91c2VFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLm1vZGFsKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxPcGVuKGluZGV4KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5zZWxlY3QpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5zZXRTZWxlY3RlZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gcHJlbG9kIHdoZW4gbW91c2VvdmVyIGFuZCBzZXQgc2VsZWN0ZWQgaWYgZW5hYmxlZFxyXG5cdFx0cHVibGljIGhvdmVyKGluZGV4OiBudW1iZXIsICRldmVudD86IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5ob3Zlci5wcmVsb2FkID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuaG92ZXJQcmVsb2FkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhvdmVyLnNlbGVjdCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgdGh1bWJuYWlsIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKTogSU9wdGlvbnNUaHVtYm5haWwge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMubW9kYWwgPyB0aGlzLmFzZy5vcHRpb25zLm1vZGFsW3RoaXMudHlwZV0gOiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aHVtYm5haWwgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZTogSU9wdGlvbnNUaHVtYm5haWwpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm1vZGFsKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5hc2cub3B0aW9ucy5tb2RhbFt0aGlzLnR5cGVdID0gdmFsdWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHY6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBhYm92ZSBmcm9tIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBkeW5hbWljKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLmR5bmFtaWMgPyAnZHluYW1pYycgOiAnJztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gYXV0b2hpZGUgYW5kIGlzU2luZ2xlID09IHRydWUgP1xyXG5cdFx0cHVibGljIGdldCBhdXRvaGlkZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5hdXRvaGlkZSAmJiB0aGlzLmFzZy5pc1NpbmdsZSA/IHRydWUgOiBmYWxzZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGNsYXNzZXNcclxuXHRcdHB1YmxpYyBnZXQgY2xhc3NlcygpOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0bGV0IHNob3cgPSAnaW5pdGlhbGl6ZWQnO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubW9kYWwpIHtcclxuXHRcdFx0XHRzaG93ID0gdGhpcy5hc2cubW9kYWxJbml0aWFsaXplZCA/ICdpbml0aWFsaXplZCcgOiAnaW5pdGlhbGl6aW5nJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLmNsYXNzZXMgKyAnICcgKyB0aGlzLmR5bmFtaWMgKyAnICcgKyBzaG93O1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnVGh1bWJuYWlsJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsICckZWxlbWVudCcsIGFuZ3VsYXJTdXBlckdhbGxlcnkuVGh1bWJuYWlsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgZGF0YS1uZy1pZj1cIiEkY3RybC5hdXRvaGlkZVwiIGNsYXNzPVwiYXNnLXRodW1ibmFpbCB7eyAkY3RybC5jbGFzc2VzIH19XCIgbmctY2xpY2s9XCIkY3RybC5hc2cubW9kYWxDbGljaygkZXZlbnQpO1wiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQCcsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dmlzaWJsZTogJz0/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPycsXHJcblx0XHRcdGJhc2VVcmw6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIl19

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