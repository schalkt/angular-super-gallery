/**
 * angular-super-gallery - AngularJS Super Gallery
 * 
 * @version v1.5.11
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
            this.items = [];
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
                selected: 0,
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
                    titleFromImage: false,
                    subtitleFromImage: false,
                    placeholder: 'panel',
                    caption: {
                        disabled: false,
                        visible: true,
                        position: 'top',
                        download: false
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
                    },
                    placeholder: 'panel'
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
            $rootScope.$on(this.events.GALLERY_EDIT, function (event, data) {
                if (_this.instances[data.id]) {
                    _this.instances[data.id].editGallery(data);
                }
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
            instance.selected = component.selected ? component.selected : instance.options.selected;
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
            this.items = items ? items : [];
            this.prepareItems();
        };
        ServiceController.prototype.setOptions = function (options) {
            if (this.optionsLoaded) {
                return;
            }
            if (options) {
                this.options = angular.copy(this.defaults);
                angular.merge(this.options, options);
                if (options.modal && options.modal.header && options.modal.header.buttons) {
                    this.options.modal.header.buttons = options.modal.header.buttons;
                    this.options.modal.header.buttons = this.options.modal.header.buttons.filter(function (x, i, a) {
                        return a.indexOf(x) === i;
                    });
                }
                this.optionsLoaded = true;
            }
            else {
                this.options = angular.copy(this.defaults);
            }
            if (!this.$window.screenfull) {
                this.options.modal.header.buttons = this.options.modal.header.buttons.filter(function (x, i, a) {
                    return x !== 'fullscreen';
                });
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
                if (this.file) {
                    if (this.options.modal.titleFromImage && this.file.title) {
                        this.options.modal.title = this.file.title;
                    }
                    if (this.options.modal.subtitleFromImage && this.file.description) {
                        this.options.modal.subtitle = this.file.description;
                    }
                }
                if (prev !== this._selected) {
                    this.thumbnailsMove();
                    this.event(this.events.CHANGE_IMAGE, {
                        index: v,
                        file: this.file
                    });
                }
                this.options.selected = this._selected;
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
            if (!this.files[index] || !this.files[index].loaded) {
                return;
            }
            if (this.files[index].loaded[type] === true) {
                this.files[index].loaded[type] = true;
                return;
            }
            if (type === 'modal') {
                this.files[index].width = image.width;
                this.files[index].height = image.height;
                this.files[index].name = this.getFilename(index, type);
                this.files[index].extension = this.getExtension(index, type);
                this.files[index].download = this.files[index].source.modal;
            }
            this.files[index].loaded[type] = true;
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
                var className = 'asg-yhidden';
                if (value) {
                    if (body.className.indexOf(className) < 0) {
                        body.className = body.className + ' ' + className;
                    }
                    this.modalInit();
                }
                else {
                    body.className = body.className.replace(className, '').trim();
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
        ServiceController.prototype.placeholderStyle = function (file, type) {
            var style = {};
            if (this.options[type].placeholder) {
                var index = this.options[type].placeholder;
                var isFull = (index.indexOf('//') === 0 || index.indexOf('http') === 0) ? true : false;
                var source = void 0;
                if (isFull) {
                    source = index;
                }
                else {
                    source = file.source[index];
                }
                if (source) {
                    style['background-image'] = 'url(' + source + ')';
                }
            }
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
        ServiceController.prototype.editGallery = function (edit) {
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
                var length_1 = edit.add.length;
                for (var key = 0; key < length_1; key++) {
                    this.addImage(edit.add[key]);
                }
            }
            if (edit.update) {
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
                if (edit.selected >= 0) {
                    selected = edit.selected;
                }
                selected = _this.files[selected] ? selected : (selected >= _this.files.length ? _this.files.length - 1 : 0);
                _this.forceSelect(_this.files[selected] ? selected : 0);
                _this.editing = false;
                _this.event(_this.events.GALLERY_UPDATED, edit);
                _this.thumbnailsMove(edit.delayThumbnails !== undefined ? edit.delayThumbnails : 220);
            }, (edit.delayRefresh !== undefined ? edit.delayRefresh : 420));
        };
        ServiceController.prototype.deleteImage = function (index, count) {
            index = index === null || index === undefined ? this.selected : index;
            count = count ? count : 1;
            this.files.splice(index, count);
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
        ServiceController.prototype.getFullUrl = function (url, baseUrl) {
            baseUrl = baseUrl === undefined ? this.options.baseUrl : baseUrl;
            var isFull = (url.indexOf('//') === 0 || url.indexOf('http') === 0) ? true : false;
            return isFull ? url : baseUrl + url;
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
                    return self.getFullUrl(src[type]);
                }
                else {
                    if (type === 'panel') {
                        type = 'image';
                        if (src[type]) {
                            return self.getFullUrl(src[type]);
                        }
                    }
                    if (type === 'image') {
                        type = 'modal';
                        if (src[type]) {
                            return self.getFullUrl(src[type]);
                        }
                    }
                    if (type === 'modal') {
                        type = 'image';
                        if (src[type]) {
                            return self.getFullUrl(src[type]);
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
                placeholder: value.placeholder ? self.getFullUrl(value.placeholder) : null
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
        function ThumbnailController(service, $scope, $element, $timeout) {
            this.service = service;
            this.$scope = $scope;
            this.$element = $element;
            this.$timeout = $timeout;
            this.type = 'thumbnail';
            this.modal = false;
            this.initialized = false;
            this.template = 'views/asg-thumbnail.html';
        }
        ThumbnailController.prototype.$onInit = function () {
            var _this = this;
            this.asg = this.service.getInstance(this);
            if (this.$scope && this.$scope.$parent && this.$scope.$parent.$parent && this.$scope.$parent.$parent.$ctrl) {
                this.modal = this.$scope.$parent.$parent.$ctrl.type === 'modal' ? true : false;
            }
            if (!this.modal) {
                this.$timeout(function () {
                    _this.initialized = true;
                }, 420);
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
                var show;
                if (this.modal) {
                    show = this.asg.modalInitialized ? 'initialized' : 'initializing';
                }
                else {
                    show = this.initialized ? 'initialized' : 'initializing';
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
        controller: ['asgService', '$scope', '$element', '$timeout', angularSuperGallery.ThumbnailController],
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzZy50cyIsImFzZy1jb250cm9sLnRzIiwiYXNnLWltYWdlLnRzIiwiYXNnLWluZm8udHMiLCJhc2ctbW9kYWwudHMiLCJhc2ctcGFuZWwudHMiLCJhc2ctc2VydmljZS50cyIsImFzZy10aHVtYm5haWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBVSxtQkFBbUIsQ0EyQjVCO0FBM0JELFdBQVUsbUJBQW1CO0lBRTVCLElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFdkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDdEIsT0FBTyxVQUFVLEtBQVcsRUFBRSxTQUFrQjtZQUUvQyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDakQsT0FBTyxFQUFFLENBQUM7YUFDVjtZQUVELElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtnQkFDaEIsT0FBTyxHQUFHLENBQUM7YUFDWDtZQUVELElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxFQUFFO2dCQUNyQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO2FBQ2Q7WUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FB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SyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRTtnQkFDcEQsT0FBTzthQUNQO1lBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDdEMsT0FBTzthQUNQO1lBRUQsSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFO2dCQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzdELElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzthQUM1RDtZQUVELElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztZQUV0QyxJQUFJLElBQUksR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUM7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Q0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRTVELEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFO1FBQzdCLFVBQVUsRUFBRSxDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQztRQUNyRyxRQUFRLEVBQUUsb0tBQW9LO1FBQzlLLFFBQVEsRUFBRTtZQUNULEVBQUUsRUFBRSxHQUFHO1lBQ1AsS0FBSyxFQUFFLElBQUk7WUFDWCxPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFLElBQUk7WUFDYixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxJQUFJO1NBQ2I7S0FDRCxDQUFDLENBQUM7QUFFSixDQUFDLEVBL0pTLG1CQUFtQixLQUFuQixtQkFBbUIsUUErSjVCIiwiZmlsZSI6ImFuZ3VsYXItc3VwZXItZ2FsbGVyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScsIFsnbmdBbmltYXRlJywgJ25nVG91Y2gnXSk7XHJcblxyXG5cdGFwcC5maWx0ZXIoJ2FzZ0J5dGVzJywgKCkgPT4ge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChieXRlcyA6IGFueSwgcHJlY2lzaW9uIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRpZiAoaXNOYU4ocGFyc2VGbG9hdChieXRlcykpIHx8ICFpc0Zpbml0ZShieXRlcykpIHtcclxuXHRcdFx0XHRyZXR1cm4gJyc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChieXRlcyA9PT0gMCkge1xyXG5cdFx0XHRcdHJldHVybiAnMCc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0eXBlb2YgcHJlY2lzaW9uID09PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdHByZWNpc2lvbiA9IDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCB1bml0cyA9IFsnYnl0ZXMnLCAna0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInXSxcclxuXHRcdFx0XHRudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgubG9nKGJ5dGVzKSAvIE1hdGgubG9nKDEwMjQpKTtcclxuXHJcblx0XHRcdHJldHVybiAoYnl0ZXMgLyBNYXRoLnBvdygxMDI0LCBNYXRoLmZsb29yKG51bWJlcikpKS50b0ZpeGVkKHByZWNpc2lvbikgKyAnICcgKyB1bml0c1tudW1iZXJdO1xyXG5cclxuXHRcdH07XHJcblx0fSk7XHJcblxyXG59XHJcblxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBDb250cm9sQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIHR5cGUgPSAnY29udHJvbCc7XHJcblx0XHRwcml2YXRlIGFzZzogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZTtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihcclxuXHRcdFx0cHJpdmF0ZSBzZXJ2aWNlOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHRcdHRoaXMudGVtcGxhdGUgPSAndmlld3MvYXNnLWNvbnRyb2wuaHRtbCc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0XHR0aGlzLiRzY29wZS5mb3J3YXJkID0gKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZCh0cnVlKTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHRoaXMuJHNjb3BlLmJhY2t3YXJkID0gKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQodHJ1ZSk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpOiBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBpbWFnZSBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlOiBJT3B0aW9uc0ltYWdlKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHY6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnQ29udHJvbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LkNvbnRyb2xDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImFzZy1jb250cm9sIHt7ICRjdHJsLmFzZy5jbGFzc2VzIH19XCI+PGRpdiBuZy1pbmNsdWRlPVwiJGN0cmwudGVtcGxhdGVcIj48L2Rpdj48L2Rpdj4nLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR0ZW1wbGF0ZTogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBJbWFnZUNvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZCA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRwdWJsaWMgaXRlbXMgOiBBcnJheTxJRmlsZT47XHJcblx0XHRwdWJsaWMgYmFzZVVybCA6IHN0cmluZztcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgPSAnaW1hZ2UnO1xyXG5cdFx0cHJpdmF0ZSBhc2cgOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkcm9vdFNjb3BlIDogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICRlbGVtZW50IDogbmcuSVJvb3RFbGVtZW50U2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHdpbmRvdyA6IG5nLklXaW5kb3dTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkc2NvcGUgOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHRcdGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKCdyZXNpemUnLCAoZXZlbnQpID0+IHtcclxuXHRcdFx0XHR0aGlzLm9uUmVzaXplKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIG9uUmVzaXplKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhlaWdodEF1dG8ub25yZXNpemUpIHtcclxuXHRcdFx0XHR0aGlzLnNldEhlaWdodCh0aGlzLmFzZy5maWxlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdFx0Ly8gc2V0IGltYWdlIGNvbXBvbmVudCBoZWlnaHRcclxuXHRcdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmFzZy5ldmVudHMuRklSU1RfSU1BR0UgKyB0aGlzLmlkLCAoZXZlbnQsIGRhdGEpID0+IHtcclxuXHJcblx0XHRcdFx0aWYgKCF0aGlzLmNvbmZpZy5oZWlnaHQgJiYgdGhpcy5jb25maWcuaGVpZ2h0QXV0by5pbml0aWFsID09PSB0cnVlKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldEhlaWdodChkYXRhLmltZyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLmFzZy50aHVtYm5haWxzTW92ZSgyMDApO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBzY29wZSBhcHBseSB3aGVuIGltYWdlIGxvYWRlZFxyXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJG9uKHRoaXMuYXNnLmV2ZW50cy5MT0FEX0lNQUdFICsgdGhpcy5pZCwgKGV2ZW50LCBkYXRhKSA9PiB7XHJcblxyXG5cdFx0XHRcdHRoaXMuJHNjb3BlLiRhcHBseSgpO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBpbWFnZSBjb21wb25lbnQgaGVpZ2h0XHJcblx0XHRwcml2YXRlIHNldEhlaWdodChpbWcpIHtcclxuXHJcblx0XHRcdGxldCB3aWR0aCA9IHRoaXMuJGVsZW1lbnQuY2hpbGRyZW4oJ2RpdicpWzBdLmNsaWVudFdpZHRoO1xyXG5cdFx0XHRsZXQgcmF0aW8gPSBpbWcud2lkdGggLyBpbWcuaGVpZ2h0O1xyXG5cdFx0XHR0aGlzLmNvbmZpZy5oZWlnaHQgPSB3aWR0aCAvIHJhdGlvO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBoZWlnaHRcclxuXHRcdHB1YmxpYyBnZXQgaGVpZ2h0KCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLmhlaWdodDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCBpbWFnZSBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBpbWFnZSBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNJbWFnZSkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cdFxyXG5cdFx0cHVibGljIHRvQmFja3dhcmQoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKCRldmVudCkge1xyXG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvRm9yd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHRpZiAoJGV2ZW50KSB7XHJcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBob3ZlcihpbmRleCA6IG51bWJlciwgJGV2ZW50PyA6IE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5hcnJvd3MucHJlbG9hZCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBtb2RhbCBhdmFpbGFibGVcclxuXHRcdHB1YmxpYyBnZXQgbW9kYWxBdmFpbGFibGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cubW9kYWxBdmFpbGFibGUgJiYgdGhpcy5jb25maWcuY2xpY2subW9kYWw7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG9wZW4gdGhlIG1vZGFsXHJcblx0XHRwdWJsaWMgbW9kYWxPcGVuKCRldmVudCA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICgkZXZlbnQpIHtcclxuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5tb2RhbCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLm1vZGFsT3Blbih0aGlzLmFzZy5zZWxlY3RlZCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dJbWFnZScsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckcm9vdFNjb3BlJywgJyRlbGVtZW50JywgJyR3aW5kb3cnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5JbWFnZUNvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9hc2ctaW1hZ2UuaHRtbCcsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgSW5mb0NvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZDogc3RyaW5nO1xyXG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgdHlwZTtcclxuXHRcdHByaXZhdGUgdGVtcGxhdGU7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IoXHJcblx0XHRcdHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRwcml2YXRlICRzY29wZTogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHR0aGlzLnR5cGUgPSAnaW5mbyc7XHJcblx0XHRcdHRoaXMudGVtcGxhdGUgPSAndmlld3MvYXNnLWluZm8uaHRtbCc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLmZpbGU7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0luZm8nLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5JbmZvQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctaW5mbyB7eyAkY3RybC5hc2cuY2xhc3NlcyB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgTW9kYWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmwgOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ21vZGFsJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSBhcnJvd3NWaXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkd2luZG93IDogbmcuSVdpbmRvd1NlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICRyb290U2NvcGUgOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbEF2YWlsYWJsZSA9IHRydWU7XHJcblxyXG5cdFx0XHQvLyBzY29wZSBhcHBseSB3aGVuIGltYWdlIGxvYWRlZFxyXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJG9uKHRoaXMuYXNnLmV2ZW50cy5MT0FEX0lNQUdFICsgdGhpcy5pZCwgKGV2ZW50LCBkYXRhKSA9PiB7XHJcblx0XHRcdFx0dGhpcy4kc2NvcGUuJGFwcGx5KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgZ2V0Q2xhc3MoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuY29uZmlnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgbmdDbGFzcyA9IFtdO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhlYWRlci5keW5hbWljKSB7XHJcblx0XHRcdFx0bmdDbGFzcy5wdXNoKCdkeW5hbWljJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5nQ2xhc3MucHVzaCh0aGlzLmFzZy5vcHRpb25zLnRoZW1lKTtcclxuXHJcblx0XHRcdHJldHVybiBuZ0NsYXNzLmpvaW4oJyAnKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGFjdGlvbiBmcm9tIGtleWNvZGVzXHJcblx0XHRwcml2YXRlIGdldEFjdGlvbkJ5S2V5Q29kZShrZXlDb2RlIDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmtleWNvZGVzKTtcclxuXHRcdFx0bGV0IGFjdGlvbjtcclxuXHJcblx0XHRcdGZvciAobGV0IGtleSBpbiBrZXlzKSB7XHJcblxyXG5cdFx0XHRcdGxldCBjb2RlcyA9IHRoaXMuY29uZmlnLmtleWNvZGVzW2tleXNba2V5XV07XHJcblxyXG5cdFx0XHRcdGlmICghY29kZXMpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGluZGV4ID0gY29kZXMuaW5kZXhPZihrZXlDb2RlKTtcclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcclxuXHRcdFx0XHRcdGFjdGlvbiA9IGtleXNba2V5XTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBhY3Rpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgY2xvc2UoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbG9zZSgpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsKSB7XHJcblx0XHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwuZXhpdCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBpbWFnZUNsaWNrKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2suY2xvc2UpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbENsb3NlKCk7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwuZXhpdCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgaG92ZXIoaW5kZXggOiBudW1iZXIsICRldmVudD8gOiBNb3VzZUV2ZW50KSB7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuYXJyb3dzLnByZWxvYWQgPT09IHRydWUpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5ob3ZlclByZWxvYWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBzZXRGb2N1cygkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlUb2dnbGUoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cuYXV0b1BsYXlUb2dnbGUoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvRmlyc3Qoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy50b0ZpcnN0KCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvRm9yd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvTGFzdChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnRvTGFzdChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZG8ga2V5Ym9hcmQgYWN0aW9uXHJcblx0XHRwdWJsaWMga2V5VXAoZSA6IEtleWJvYXJkRXZlbnQpIHtcclxuXHJcblx0XHRcdGxldCBhY3Rpb24gOiBzdHJpbmcgPSB0aGlzLmdldEFjdGlvbkJ5S2V5Q29kZShlLmtleUNvZGUpO1xyXG5cclxuXHRcdFx0c3dpdGNoIChhY3Rpb24pIHtcclxuXHJcblx0XHRcdFx0Y2FzZSAnZXhpdCc6XHJcblx0XHRcdFx0XHR0aGlzLmNsb3NlKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAncGxheXBhdXNlJzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLmF1dG9QbGF5VG9nZ2xlKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnZm9yd2FyZCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnYmFja3dhcmQnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdmaXJzdCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0ZpcnN0KHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2xhc3QnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9MYXN0KHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2Z1bGxzY3JlZW4nOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVGdWxsU2NyZWVuKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnbWVudSc6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1lbnUoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdjYXB0aW9uJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlQ2FwdGlvbigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2hlbHAnOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVIZWxwKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnc2l6ZSc6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZVNpemUoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICd0cmFuc2l0aW9uJzpcclxuXHRcdFx0XHRcdHRoaXMubmV4dFRyYW5zaXRpb24oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cubG9nKCd1bmtub3duIGtleWJvYXJkIGFjdGlvbjogJyArIGUua2V5Q29kZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHN3aXRjaCB0byBuZXh0IHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRwcml2YXRlIG5leHRUcmFuc2l0aW9uKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdGxldCBpZHggPSB0aGlzLmFzZy50cmFuc2l0aW9ucy5pbmRleE9mKHRoaXMuY29uZmlnLnRyYW5zaXRpb24pICsgMTtcclxuXHRcdFx0bGV0IG5leHQgPSBpZHggPj0gdGhpcy5hc2cudHJhbnNpdGlvbnMubGVuZ3RoID8gMCA6IGlkeDtcclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRoaXMuYXNnLnRyYW5zaXRpb25zW25leHRdO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGZ1bGxzY3JlZW5cclxuXHRcdHByaXZhdGUgdG9nZ2xlRnVsbFNjcmVlbigkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsKSB7XHJcblx0XHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwudG9nZ2xlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIHRodW1ibmFpbHNcclxuXHRcdHByaXZhdGUgdG9nZ2xlVGh1bWJuYWlscygkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmNvbmZpZy50aHVtYm5haWwuZHluYW1pYyA9ICF0aGlzLmNvbmZpZy50aHVtYm5haWwuZHluYW1pYztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRwdWJsaWMgc2V0VHJhbnNpdGlvbih0cmFuc2l0aW9uLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmNvbmZpZy50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRoZW1lXHJcblx0XHRwdWJsaWMgc2V0VGhlbWUodGhlbWUgOiBzdHJpbmcsICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnMudGhlbWUgPSB0aGVtZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGhlbHBcclxuXHRcdHByaXZhdGUgdG9nZ2xlSGVscCgkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmNvbmZpZy5oZWxwID0gIXRoaXMuY29uZmlnLmhlbHA7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBzaXplXHJcblx0XHRwcml2YXRlIHRvZ2dsZVNpemUoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0bGV0IGluZGV4ID0gdGhpcy5hc2cuc2l6ZXMuaW5kZXhPZih0aGlzLmNvbmZpZy5zaXplKTtcclxuXHRcdFx0aW5kZXggPSAoaW5kZXggKyAxKSA+PSB0aGlzLmFzZy5zaXplcy5sZW5ndGggPyAwIDogKytpbmRleDtcclxuXHRcdFx0dGhpcy5jb25maWcuc2l6ZSA9IHRoaXMuYXNnLnNpemVzW2luZGV4XTtcclxuXHRcdFx0dGhpcy5hc2cubG9nKCd0b2dnbGUgaW1hZ2Ugc2l6ZTonLCBbdGhpcy5jb25maWcuc2l6ZSwgaW5kZXhdKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIG1lbnVcclxuXHRcdHByaXZhdGUgdG9nZ2xlTWVudSgkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmNvbmZpZy5oZWFkZXIuZHluYW1pYyA9ICF0aGlzLmNvbmZpZy5oZWFkZXIuZHluYW1pYztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGNhcHRpb25cclxuXHRcdHByaXZhdGUgdG9nZ2xlQ2FwdGlvbigpIHtcclxuXHJcblx0XHRcdHRoaXMuY29uZmlnLmNhcHRpb24udmlzaWJsZSA9ICF0aGlzLmNvbmZpZy5jYXB0aW9uLnZpc2libGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtYXJnaW50IHRvcFxyXG5cdFx0cHVibGljIGdldCBtYXJnaW5Ub3AoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcubWFyZ2luVG9wO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbWFyZ2luIGJvdHRvbVxyXG5cdFx0cHVibGljIGdldCBtYXJnaW5Cb3R0b20oKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcubWFyZ2luQm90dG9tO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbW9kYWwgdmlzaWJsZVxyXG5cdFx0cHVibGljIGdldCB2aXNpYmxlKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm1vZGFsVmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IG1vZGFsIHZpc2libGVcclxuXHRcdHB1YmxpYyBzZXQgdmlzaWJsZSh2YWx1ZSA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsVmlzaWJsZSA9IHZhbHVlO1xyXG5cdFx0XHR0aGlzLmFzZy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1vZGFsIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKSA6IElPcHRpb25zTW9kYWwge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IG1vZGFsIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc01vZGFsKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnTW9kYWwnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHdpbmRvdycsICckcm9vdFNjb3BlJywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuTW9kYWxDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLW1vZGFsLmh0bWwnLFxyXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PycsXHJcblx0XHRcdGJhc2VVcmw6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgUGFuZWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtczogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmw6IHN0cmluZztcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgPSAncGFuZWwnO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZTtcclxuXHRcdHByaXZhdGUgYXNnOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IoXHJcblx0XHRcdHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRwcml2YXRlICRzY29wZTogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHR0aGlzLnRlbXBsYXRlID0gJ3ZpZXdzL2FzZy1wYW5lbC5odG1sJztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXg6IG51bWJlciwgJGV2ZW50PzogTW91c2VFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLm1vZGFsKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxPcGVuKGluZGV4KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5zZWxlY3QpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5zZXRTZWxlY3RlZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGhvdmVyKGluZGV4OiBudW1iZXIsICRldmVudD86IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5ob3Zlci5wcmVsb2FkID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuaG92ZXJQcmVsb2FkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhvdmVyLnNlbGVjdCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgcGFuZWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpOiBJT3B0aW9uc1BhbmVsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBwYW5lbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlOiBJT3B0aW9uc1BhbmVsKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHY6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dQYW5lbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LlBhbmVsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctcGFuZWwge3sgJGN0cmwuYXNnLmNsYXNzZXMgfX1cIiBuZy1tb3VzZW92ZXI9XCIkY3RybC5hc2cub3Zlci5wYW5lbCA9IHRydWU7XCIgbmctbW91c2VsZWF2ZT1cIiRjdHJsLmFzZy5vdmVyLnBhbmVsID0gZmFsc2U7XCIgbmctc2hvdz1cIiRjdHJsLmNvbmZpZy52aXNpYmxlXCI+PGRpdiBuZy1pbmNsdWRlPVwiJGN0cmwudGVtcGxhdGVcIj48L2Rpdj48bmctdHJhbnNjbHVkZT48L25nLXRyYW5zY2x1ZGU+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0AnLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nLFxyXG5cdFx0XHRiYXNlVXJsOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0Ly8gbW9kYWwgY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zTW9kYWwge1xyXG5cclxuXHRcdGhlYWRlcj86IHtcclxuXHRcdFx0ZW5hYmxlZD86IGJvb2xlYW47XHJcblx0XHRcdGR5bmFtaWM/OiBib29sZWFuO1xyXG5cdFx0XHRidXR0b25zOiBBcnJheTxzdHJpbmc+O1xyXG5cdFx0fTtcclxuXHRcdGhlbHA/OiBib29sZWFuO1xyXG5cdFx0Y2FwdGlvbj86IHtcclxuXHRcdFx0ZGlzYWJsZWQ/OiBib29sZWFuO1xyXG5cdFx0XHR2aXNpYmxlPzogYm9vbGVhbjtcclxuXHRcdFx0cG9zaXRpb24/OiBzdHJpbmc7XHJcblx0XHRcdGRvd25sb2FkPzogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRwbGFjZWhvbGRlcj86IHN0cmluZztcclxuXHRcdHRyYW5zaXRpb24/OiBzdHJpbmc7XHJcblx0XHR0aXRsZT86IHN0cmluZztcclxuXHRcdHN1YnRpdGxlPzogc3RyaW5nO1xyXG5cdFx0dGl0bGVGcm9tSW1hZ2U/IDogYm9vbGVhbjtcclxuXHRcdHN1YnRpdGxlRnJvbUltYWdlPyA6IGJvb2xlYW47XHJcblx0XHRhcnJvd3M/OiB7XHJcblx0XHRcdHByZWxvYWQ/OiBib29sZWFuO1xyXG5cdFx0XHRlbmFibGVkPzogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRzaXplPzogc3RyaW5nO1xyXG5cdFx0dGh1bWJuYWlsPzogSU9wdGlvbnNUaHVtYm5haWw7XHJcblx0XHRtYXJnaW5Ub3A/OiBudW1iZXI7XHJcblx0XHRtYXJnaW5Cb3R0b20/OiBudW1iZXI7XHJcblx0XHRjbGljaz86IHtcclxuXHRcdFx0Y2xvc2U6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0a2V5Y29kZXM/OiB7XHJcblx0XHRcdGV4aXQ/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRwbGF5cGF1c2U/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRmb3J3YXJkPzogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0YmFja3dhcmQ/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRmaXJzdD86IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGxhc3Q/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRmdWxsc2NyZWVuPzogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0bWVudT86IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGNhcHRpb24/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRoZWxwPzogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0c2l6ZT86IEFycmF5PG51bWJlcj47XHJcblx0XHRcdHRyYW5zaXRpb24/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdC8vIHBhbmVsIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc1BhbmVsIHtcclxuXHJcblx0XHR2aXNpYmxlPzogYm9vbGVhbjtcclxuXHRcdGl0ZW0/OiB7XHJcblx0XHRcdGNsYXNzPzogc3RyaW5nO1xyXG5cdFx0XHRjYXB0aW9uOiBib29sZWFuO1xyXG5cdFx0XHRpbmRleDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRob3Zlcj86IHtcclxuXHRcdFx0cHJlbG9hZDogYm9vbGVhbjtcclxuXHRcdFx0c2VsZWN0OiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHRcdGNsaWNrPzoge1xyXG5cdFx0XHRzZWxlY3Q6IGJvb2xlYW47XHJcblx0XHRcdG1vZGFsOiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHQvLyB0aHVtYm5haWwgY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zVGh1bWJuYWlsIHtcclxuXHJcblx0XHRoZWlnaHQ/OiBudW1iZXI7XHJcblx0XHRpbmRleD86IGJvb2xlYW47XHJcblx0XHRlbmFibGVkPzogYm9vbGVhbjtcclxuXHRcdGR5bmFtaWM/OiBib29sZWFuO1xyXG5cdFx0YXV0b2hpZGU6IGJvb2xlYW47XHJcblx0XHRjbGljaz86IHtcclxuXHRcdFx0c2VsZWN0OiBib29sZWFuO1xyXG5cdFx0XHRtb2RhbDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRob3Zlcj86IHtcclxuXHRcdFx0cHJlbG9hZDogYm9vbGVhbjtcclxuXHRcdFx0c2VsZWN0OiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHQvLyBpbmZvIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0luZm8ge1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHR0cmFuc2l0aW9uPzogc3RyaW5nO1xyXG5cdFx0c2l6ZT86IHN0cmluZztcclxuXHRcdGFycm93cz86IHtcclxuXHRcdFx0cHJlbG9hZD86IGJvb2xlYW47XHJcblx0XHRcdGVuYWJsZWQ/OiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHRcdGNsaWNrPzoge1xyXG5cdFx0XHRtb2RhbDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRoZWlnaHQ/OiBudW1iZXI7XHJcblx0XHRoZWlnaHRNaW4/OiBudW1iZXI7XHJcblx0XHRoZWlnaHRBdXRvPzoge1xyXG5cdFx0XHRpbml0aWFsPzogYm9vbGVhbjtcclxuXHRcdFx0b25yZXNpemU/OiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHRcdHBsYWNlaG9sZGVyOiBzdHJpbmc7XHJcblx0fVxyXG5cclxuXHQvLyBnYWxsZXJ5IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zIHtcclxuXHJcblx0XHRkZWJ1Zz86IGJvb2xlYW47XHJcblx0XHRiYXNlVXJsPzogc3RyaW5nO1xyXG5cdFx0aGFzaFVybD86IGJvb2xlYW47XHJcblx0XHRkdXBsaWNhdGVzPzogYm9vbGVhbjtcclxuXHRcdHNlbGVjdGVkPzogbnVtYmVyO1xyXG5cdFx0ZmllbGRzPzoge1xyXG5cdFx0XHRzb3VyY2U/OiB7XHJcblx0XHRcdFx0bW9kYWw/OiBzdHJpbmc7XHJcblx0XHRcdFx0cGFuZWw/OiBzdHJpbmc7XHJcblx0XHRcdFx0aW1hZ2U/OiBzdHJpbmc7XHJcblx0XHRcdFx0cGxhY2Vob2xkZXI/OiBzdHJpbmc7XHJcblx0XHRcdH1cclxuXHRcdFx0dGl0bGU/OiBzdHJpbmc7XHJcblx0XHRcdGRlc2NyaXB0aW9uPzogc3RyaW5nO1xyXG5cdFx0XHR0aHVtYm5haWw/OiBzdHJpbmc7XHJcblx0XHR9O1xyXG5cdFx0YXV0b3BsYXk/OiB7XHJcblx0XHRcdGVuYWJsZWQ/OiBib29sZWFuO1xyXG5cdFx0XHRkZWxheT86IG51bWJlcjtcclxuXHRcdH07XHJcblx0XHR0aGVtZT86IHN0cmluZztcclxuXHRcdHByZWxvYWQ/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0cHJlbG9hZE5leHQ/OiBib29sZWFuO1xyXG5cdFx0cHJlbG9hZERlbGF5PzogbnVtYmVyO1xyXG5cdFx0bG9hZGluZ0ltYWdlPzogc3RyaW5nO1xyXG5cdFx0bW9kYWw/OiBJT3B0aW9uc01vZGFsO1xyXG5cdFx0cGFuZWw/OiBJT3B0aW9uc1BhbmVsO1xyXG5cdFx0aW1hZ2U/OiBJT3B0aW9uc0ltYWdlO1xyXG5cdFx0dGh1bWJuYWlsPzogSU9wdGlvbnNUaHVtYm5haWw7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gaW1hZ2Ugc291cmNlXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJU291cmNlIHtcclxuXHJcblx0XHRtb2RhbDogc3RyaW5nOyAvLyBvcmlnaW5hbCwgcmVxdWlyZWRcclxuXHRcdHBhbmVsPzogc3RyaW5nO1xyXG5cdFx0aW1hZ2U/OiBzdHJpbmc7XHJcblx0XHRjb2xvcj86IHN0cmluZztcclxuXHRcdHBsYWNlaG9sZGVyPzogc3RyaW5nO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGZpbGVcclxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWxlIHtcclxuXHJcblx0XHRzb3VyY2U6IElTb3VyY2U7XHJcblx0XHR0aXRsZT86IHN0cmluZztcclxuXHRcdG5hbWU/OiBzdHJpbmc7XHJcblx0XHRleHRlbnNpb24/OiBzdHJpbmc7XHJcblx0XHRkZXNjcmlwdGlvbj86IHN0cmluZztcclxuXHRcdGRvd25sb2FkPzogc3RyaW5nO1xyXG5cdFx0bG9hZGVkPzoge1xyXG5cdFx0XHRtb2RhbD86IGJvb2xlYW47XHJcblx0XHRcdHBhbmVsPzogYm9vbGVhbjtcclxuXHRcdFx0aW1hZ2U/OiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHRcdHdpZHRoPzogbnVtYmVyO1xyXG5cdFx0aGVpZ2h0PzogbnVtYmVyO1xyXG5cclxuXHR9XHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU92ZXIge1xyXG5cdFx0bW9kYWxJbWFnZTogYm9vbGVhbjtcclxuXHRcdHBhbmVsOiBib29sZWFuO1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJRWRpdCB7XHJcblx0XHRpZDogbnVtYmVyO1xyXG5cdFx0ZGVsZXRlPzogbnVtYmVyO1xyXG5cdFx0YWRkPzogQXJyYXk8SUZpbGU+O1xyXG5cdFx0dXBkYXRlPzogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cmVmcmVzaD86IGJvb2xlYW47XHJcblx0XHRzZWxlY3RlZD86IG51bWJlcjtcclxuXHRcdG9wdGlvbnM/OiBJT3B0aW9ucztcclxuXHRcdGRlbGF5VGh1bWJuYWlscz86IG51bWJlcjtcclxuXHRcdGRlbGF5UmVmcmVzaD86IG51bWJlcjtcclxuXHR9XHJcblxyXG5cdC8vIHNlcnZpY2UgY29udHJvbGxlciBpbnRlcmZhY2VcclxuXHRleHBvcnQgaW50ZXJmYWNlIElTZXJ2aWNlQ29udHJvbGxlciB7XHJcblxyXG5cdFx0bW9kYWxWaXNpYmxlOiBib29sZWFuO1xyXG5cdFx0cGFuZWxWaXNpYmxlOiBib29sZWFuO1xyXG5cdFx0bW9kYWxBdmFpbGFibGU6IGJvb2xlYW47XHJcblx0XHRtb2RhbEluaXRpYWxpemVkOiBib29sZWFuO1xyXG5cdFx0dHJhbnNpdGlvbnM6IEFycmF5PHN0cmluZz47XHJcblx0XHR0aGVtZXM6IEFycmF5PHN0cmluZz47XHJcblx0XHRjbGFzc2VzOiBzdHJpbmc7XHJcblx0XHRvcHRpb25zOiBJT3B0aW9ucztcclxuXHRcdGl0ZW1zOiBBcnJheTxJRmlsZT47XHJcblx0XHRzZWxlY3RlZDogbnVtYmVyO1xyXG5cdFx0ZmlsZTogSUZpbGU7XHJcblx0XHRmaWxlczogQXJyYXk8SUZpbGU+O1xyXG5cdFx0c2l6ZXM6IEFycmF5PHN0cmluZz47XHJcblx0XHRpZDogc3RyaW5nO1xyXG5cdFx0aXNTaW5nbGU6IGJvb2xlYW47XHJcblx0XHRldmVudHM6IHtcclxuXHRcdFx0Q09ORklHX0xPQUQ6IHN0cmluZztcclxuXHRcdFx0QVVUT1BMQVlfU1RBUlQ6IHN0cmluZztcclxuXHRcdFx0QVVUT1BMQVlfU1RPUDogc3RyaW5nO1xyXG5cdFx0XHRQQVJTRV9JTUFHRVM6IHN0cmluZztcclxuXHRcdFx0TE9BRF9JTUFHRTogc3RyaW5nO1xyXG5cdFx0XHRGSVJTVF9JTUFHRTogc3RyaW5nO1xyXG5cdFx0XHRDSEFOR0VfSU1BR0U6IHN0cmluZztcclxuXHRcdFx0RE9VQkxFX0lNQUdFOiBzdHJpbmc7XHJcblx0XHRcdE1PREFMX09QRU46IHN0cmluZztcclxuXHRcdFx0TU9EQUxfQ0xPU0U6IHN0cmluZztcclxuXHRcdFx0R0FMTEVSWV9VUERBVEVEOiBzdHJpbmc7XHJcblx0XHRcdEdBTExFUllfRURJVDogc3RyaW5nO1xyXG5cdFx0fTtcclxuXHJcblx0XHRnZXRJbnN0YW5jZShjb21wb25lbnQ6IGFueSk6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRzZXREZWZhdWx0cygpOiB2b2lkO1xyXG5cclxuXHRcdHNldE9wdGlvbnMob3B0aW9uczogSU9wdGlvbnMpOiBJT3B0aW9ucztcclxuXHJcblx0XHRzZXRJdGVtcyhpdGVtczogQXJyYXk8SUZpbGU+LCBmb3JjZT86IGJvb2xlYW4pOiB2b2lkO1xyXG5cclxuXHRcdHByZWxvYWQod2FpdD86IG51bWJlcik6IHZvaWQ7XHJcblxyXG5cdFx0bm9ybWFsaXplKGluZGV4OiBudW1iZXIpOiBudW1iZXI7XHJcblxyXG5cdFx0c2V0Rm9jdXMoKTogdm9pZDtcclxuXHJcblx0XHRzZXRTZWxlY3RlZChpbmRleDogbnVtYmVyKTtcclxuXHJcblx0XHRtb2RhbE9wZW4oaW5kZXg6IG51bWJlcik6IHZvaWQ7XHJcblxyXG5cdFx0bW9kYWxDbG9zZSgpOiB2b2lkO1xyXG5cclxuXHRcdG1vZGFsQ2xpY2soJGV2ZW50PzogVUlFdmVudCk6IHZvaWQ7XHJcblxyXG5cdFx0dGh1bWJuYWlsc01vdmUoZGVsYXk/OiBudW1iZXIpOiB2b2lkO1xyXG5cclxuXHRcdHRvQmFja3dhcmQoc3RvcD86IGJvb2xlYW4pOiB2b2lkO1xyXG5cclxuXHRcdHRvRm9yd2FyZChzdG9wPzogYm9vbGVhbik6IHZvaWQ7XHJcblxyXG5cdFx0dG9GaXJzdChzdG9wPzogYm9vbGVhbik6IHZvaWQ7XHJcblxyXG5cdFx0dG9MYXN0KHN0b3A/OiBib29sZWFuKTogdm9pZDtcclxuXHJcblx0XHRsb2FkSW1hZ2UoaW5kZXg/OiBudW1iZXIpOiB2b2lkO1xyXG5cclxuXHRcdGxvYWRJbWFnZXMoaW5kZXhlczogQXJyYXk8bnVtYmVyPik6IHZvaWQ7XHJcblxyXG5cdFx0aG92ZXJQcmVsb2FkKGluZGV4OiBudW1iZXIpOiB2b2lkO1xyXG5cclxuXHRcdGF1dG9QbGF5VG9nZ2xlKCk6IHZvaWQ7XHJcblxyXG5cdFx0dG9nZ2xlKGVsZW1lbnQ6IHN0cmluZyk6IHZvaWQ7XHJcblxyXG5cdFx0c2V0SGFzaCgpOiB2b2lkO1xyXG5cclxuXHRcdGRvd25sb2FkTGluaygpOiBzdHJpbmc7XHJcblxyXG5cdFx0ZWwoc2VsZWN0b3IpOiBOb2RlTGlzdDtcclxuXHJcblx0XHRsb2coZXZlbnQ6IHN0cmluZywgZGF0YT86IGFueSk6IHZvaWQ7XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdC8vIHNlcnZpY2UgY29udHJvbGxlclxyXG5cdGV4cG9ydCBjbGFzcyBTZXJ2aWNlQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIHNsdWcgPSAnYXNnJztcclxuXHRcdHB1YmxpYyBpZDogc3RyaW5nO1xyXG5cdFx0cHVibGljIGl0ZW1zOiBBcnJheTxJRmlsZT4gPSBbXTtcclxuXHRcdHB1YmxpYyBmaWxlczogQXJyYXk8SUZpbGU+ID0gW107XHJcblx0XHRwdWJsaWMgZGlyZWN0aW9uOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgbW9kYWxBdmFpbGFibGUgPSBmYWxzZTtcclxuXHRcdHB1YmxpYyBtb2RhbEluaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG5cdFx0cHJpdmF0ZSBpbnN0YW5jZXM6IHt9ID0ge307XHJcblx0XHRwcml2YXRlIF9zZWxlY3RlZDogbnVtYmVyO1xyXG5cdFx0cHJpdmF0ZSBfdmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBhdXRvcGxheTogYW5ndWxhci5JUHJvbWlzZTxhbnk+O1xyXG5cdFx0cHJpdmF0ZSBmaXJzdCA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBlZGl0aW5nID0gZmFsc2U7XHJcblxyXG5cdFx0cHVibGljIG9wdGlvbnM6IElPcHRpb25zID0gbnVsbDtcclxuXHRcdHB1YmxpYyBvcHRpb25zTG9hZGVkID0gZmFsc2U7XHJcblx0XHRwdWJsaWMgZGVmYXVsdHM6IElPcHRpb25zID0ge1xyXG5cdFx0XHRkZWJ1ZzogZmFsc2UsIC8vIGltYWdlIGxvYWQsIGF1dG9wbGF5LCBldGMuIGluZm8gaW4gY29uc29sZS5sb2dcclxuXHRcdFx0aGFzaFVybDogdHJ1ZSwgLy8gZW5hYmxlL2Rpc2FibGUgaGFzaCB1c2FnZSBpbiB1cmwgKCNhc2ctbmF0dXJlLTQpXHJcblx0XHRcdGJhc2VVcmw6ICcnLCAvLyB1cmwgcHJlZml4XHJcblx0XHRcdGR1cGxpY2F0ZXM6IGZhbHNlLCAvLyBlbmFibGUgb3IgZGlzYWJsZSBzYW1lIGltYWdlcyAodXJsKSBpbiBnYWxsZXJ5XHJcblx0XHRcdHNlbGVjdGVkOiAwLCAvLyBzZWxlY3RlZCBpbWFnZSBvbiBpbml0XHJcblx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdHNvdXJjZToge1xyXG5cdFx0XHRcdFx0bW9kYWw6ICd1cmwnLCAvLyByZXF1aXJlZCwgaW1hZ2UgdXJsIGZvciBtb2RhbCBjb21wb25lbnQgKGxhcmdlIHNpemUpXHJcblx0XHRcdFx0XHRwYW5lbDogJ3VybCcsIC8vIGltYWdlIHVybCBmb3IgcGFuZWwgY29tcG9uZW50ICh0aHVtYm5haWwgc2l6ZSlcclxuXHRcdFx0XHRcdGltYWdlOiAndXJsJywgLy8gaW1hZ2UgdXJsIGZvciBpbWFnZSAobWVkaXVtIG9yIGN1c3RvbSBzaXplKVxyXG5cdFx0XHRcdFx0cGxhY2Vob2xkZXI6IG51bGwgLy8gaW1hZ2UgdXJsIGZvciBwcmVsb2FkIGxvd3JlcyBpbWFnZVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dGl0bGU6ICd0aXRsZScsIC8vIHRpdGxlIGZpZWxkIG5hbWVcclxuXHRcdFx0XHRkZXNjcmlwdGlvbjogJ2Rlc2NyaXB0aW9uJywgLy8gZGVzY3JpcHRpb24gZmllbGQgbmFtZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhdXRvcGxheToge1xyXG5cdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLCAvLyBzbGlkZXNob3cgcGxheSBlbmFibGVkL2Rpc2FibGVkXHJcblx0XHRcdFx0ZGVsYXk6IDQxMDAgLy8gYXV0b3BsYXkgZGVsYXkgaW4gbWlsbGlzZWNvbmRcclxuXHRcdFx0fSxcclxuXHRcdFx0dGhlbWU6ICdkZWZhdWx0JywgLy8gY3NzIHN0eWxlIFtkZWZhdWx0LCBkYXJrYmx1ZSwgZGFya3JlZCwgd2hpdGVnb2xkXVxyXG5cdFx0XHRwcmVsb2FkTmV4dDogZmFsc2UsIC8vIHByZWxvYWQgbmV4dCBpbWFnZSAoZm9yd2FyZC9iYWNrd2FyZClcclxuXHRcdFx0cHJlbG9hZERlbGF5OiA3NzAsIC8vIHByZWxvYWQgZGVsYXkgZm9yIHByZWxvYWROZXh0XHJcblx0XHRcdGxvYWRpbmdJbWFnZTogJ3ByZWxvYWQuc3ZnJywgLy8gbG9hZGVyIGltYWdlXHJcblx0XHRcdHByZWxvYWQ6IFtdLCAvLyBwcmVsb2FkIGltYWdlcyBieSBpbmRleCBudW1iZXJcclxuXHRcdFx0bW9kYWw6IHtcclxuXHRcdFx0XHR0aXRsZTogJycsIC8vIG1vZGFsIHdpbmRvdyB0aXRsZVxyXG5cdFx0XHRcdHN1YnRpdGxlOiAnJywgLy8gbW9kYWwgd2luZG93IHN1YnRpdGxlXHJcblx0XHRcdFx0dGl0bGVGcm9tSW1hZ2U6IGZhbHNlLCAvLyBmb3JjZSB1cGRhdGUgdGhlIGdhbGxlcnkgdGl0bGUgYnkgaW1hZ2UgdGl0bGVcclxuXHRcdFx0XHRzdWJ0aXRsZUZyb21JbWFnZTogZmFsc2UsIC8vIGZvcmNlIHVwZGF0ZSB0aGUgZ2FsbGVyeSBzdWJ0aXRsZSBieSBpbWFnZSBkZXNjcmlwdGlvblxyXG5cdFx0XHRcdHBsYWNlaG9sZGVyOiAncGFuZWwnLCAvLyBzZXQgaW1hZ2UgcGxhY2Vob2xkZXIgc291cmNlIHR5cGUgKHRodW1ibmFpbCkgb3IgZnVsbCB1cmwgKGh0dHAuLi4pXHJcblx0XHRcdFx0Y2FwdGlvbjoge1xyXG5cdFx0XHRcdFx0ZGlzYWJsZWQ6IGZhbHNlLCAvLyBkaXNhYmxlIGltYWdlIGNhcHRpb25cclxuXHRcdFx0XHRcdHZpc2libGU6IHRydWUsIC8vIHNob3cvaGlkZSBpbWFnZSBjYXB0aW9uXHJcblx0XHRcdFx0XHRwb3NpdGlvbjogJ3RvcCcsIC8vIGNhcHRpb24gcG9zaXRpb24gW3RvcCwgYm90dG9tXVxyXG5cdFx0XHRcdFx0ZG93bmxvYWQ6IGZhbHNlIC8vIHNob3cvaGlkZSBkb3dubG9hZCBsaW5rXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRoZWFkZXI6IHtcclxuXHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsIC8vIGVuYWJsZS9kaXNhYmxlIG1vZGFsIG1lbnVcclxuXHRcdFx0XHRcdGR5bmFtaWM6IGZhbHNlLCAvLyBzaG93L2hpZGUgbW9kYWwgbWVudSBvbiBtb3VzZW92ZXJcclxuXHRcdFx0XHRcdGJ1dHRvbnM6IFsncGxheXN0b3AnLCAnaW5kZXgnLCAncHJldicsICduZXh0JywgJ3BpbicsICdzaXplJywgJ3RyYW5zaXRpb24nLCAndGh1bWJuYWlscycsICdmdWxsc2NyZWVuJywgJ2hlbHAnLCAnY2xvc2UnXSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGhlbHA6IGZhbHNlLCAvLyBzaG93L2hpZGUgaGVscFxyXG5cdFx0XHRcdGFycm93czoge1xyXG5cdFx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSwgLy8gc2hvdy9oaWRlIGFycm93c1xyXG5cdFx0XHRcdFx0cHJlbG9hZDogdHJ1ZSwgLy8gcHJlbG9hZCBpbWFnZSBvbiBtb3VzZW92ZXJcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGNsaWNrOiB7XHJcblx0XHRcdFx0XHRjbG9zZTogdHJ1ZSAvLyB3aGVuIGNsaWNrIG9uIHRoZSBpbWFnZSBjbG9zZSB0aGUgbW9kYWxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHRodW1ibmFpbDoge1xyXG5cdFx0XHRcdFx0aGVpZ2h0OiA1MCwgLy8gdGh1bWJuYWlsIGltYWdlIGhlaWdodCBpbiBwaXhlbFxyXG5cdFx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93IGluZGV4IG51bWJlciBvbiB0aHVtYm5haWxcclxuXHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsIC8vIGVuYWJsZS9kaXNhYmxlIHRodW1ibmFpbHNcclxuXHRcdFx0XHRcdGR5bmFtaWM6IGZhbHNlLCAvLyBpZiB0cnVlIHRodW1ibmFpbHMgdmlzaWJsZSBvbmx5IHdoZW4gbW91c2VvdmVyXHJcblx0XHRcdFx0XHRhdXRvaGlkZTogdHJ1ZSwgLy8gaGlkZSB0aHVtYm5haWwgY29tcG9uZW50IHdoZW4gc2luZ2xlIGltYWdlXHJcblx0XHRcdFx0XHRjbGljazoge1xyXG5cdFx0XHRcdFx0XHRzZWxlY3Q6IHRydWUsIC8vIHNldCBzZWxlY3RlZCBpbWFnZSB3aGVuIHRydWVcclxuXHRcdFx0XHRcdFx0bW9kYWw6IGZhbHNlIC8vIG9wZW4gbW9kYWwgd2hlbiB0cnVlXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0aG92ZXI6IHtcclxuXHRcdFx0XHRcdFx0cHJlbG9hZDogdHJ1ZSwgLy8gcHJlbG9hZCBpbWFnZSBvbiBtb3VzZW92ZXJcclxuXHRcdFx0XHRcdFx0c2VsZWN0OiBmYWxzZSAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugb24gbW91c2VvdmVyIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHRyYW5zaXRpb246ICdzbGlkZUxSJywgLy8gdHJhbnNpdGlvbiBlZmZlY3RcclxuXHRcdFx0XHRzaXplOiAnY292ZXInLCAvLyBjb250YWluLCBjb3ZlciwgYXV0bywgc3RyZXRjaFxyXG5cdFx0XHRcdGtleWNvZGVzOiB7XHJcblx0XHRcdFx0XHRleGl0OiBbMjddLCAvLyBlc2NcclxuXHRcdFx0XHRcdHBsYXlwYXVzZTogWzgwXSwgLy8gcFxyXG5cdFx0XHRcdFx0Zm9yd2FyZDogWzMyLCAzOV0sIC8vIHNwYWNlLCByaWdodCBhcnJvd1xyXG5cdFx0XHRcdFx0YmFja3dhcmQ6IFszN10sIC8vIGxlZnQgYXJyb3dcclxuXHRcdFx0XHRcdGZpcnN0OiBbMzgsIDM2XSwgLy8gdXAgYXJyb3csIGhvbWVcclxuXHRcdFx0XHRcdGxhc3Q6IFs0MCwgMzVdLCAvLyBkb3duIGFycm93LCBlbmRcclxuXHRcdFx0XHRcdGZ1bGxzY3JlZW46IFsxM10sIC8vIGVudGVyXHJcblx0XHRcdFx0XHRtZW51OiBbNzddLCAvLyBtXHJcblx0XHRcdFx0XHRjYXB0aW9uOiBbNjddLCAvLyBjXHJcblx0XHRcdFx0XHRoZWxwOiBbNzJdLCAvLyBoXHJcblx0XHRcdFx0XHRzaXplOiBbODNdLCAvLyBzXHJcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiBbODRdIC8vIHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHRodW1ibmFpbDoge1xyXG5cdFx0XHRcdGhlaWdodDogNTAsIC8vIHRodW1ibmFpbCBpbWFnZSBoZWlnaHQgaW4gcGl4ZWxcclxuXHRcdFx0XHRpbmRleDogZmFsc2UsIC8vIHNob3cgaW5kZXggbnVtYmVyIG9uIHRodW1ibmFpbFxyXG5cdFx0XHRcdGR5bmFtaWM6IGZhbHNlLCAvLyBpZiB0cnVlIHRodW1ibmFpbHMgdmlzaWJsZSBvbmx5IHdoZW4gbW91c2VvdmVyXHJcblx0XHRcdFx0YXV0b2hpZGU6IGZhbHNlLCAvLyBoaWRlIHRodW1ibmFpbCBjb21wb25lbnQgd2hlbiBzaW5nbGUgaW1hZ2VcclxuXHRcdFx0XHRjbGljazoge1xyXG5cdFx0XHRcdFx0c2VsZWN0OiB0cnVlLCAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugd2hlbiB0cnVlXHJcblx0XHRcdFx0XHRtb2RhbDogZmFsc2UgLy8gb3BlbiBtb2RhbCB3aGVuIHRydWVcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGhvdmVyOiB7XHJcblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxyXG5cdFx0XHRcdFx0c2VsZWN0OiBmYWxzZSAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugb24gbW91c2VvdmVyIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdHBhbmVsOiB7XHJcblx0XHRcdFx0dmlzaWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRpdGVtOiB7XHJcblx0XHRcdFx0XHRjbGFzczogJ2NvbC1tZC0zJywgLy8gaXRlbSBjbGFzc1xyXG5cdFx0XHRcdFx0Y2FwdGlvbjogZmFsc2UsIC8vIHNob3cvaGlkZSBpbWFnZSBjYXB0aW9uXHJcblx0XHRcdFx0XHRpbmRleDogZmFsc2UsIC8vIHNob3cvaGlkZSBpbWFnZSBpbmRleFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aG92ZXI6IHtcclxuXHRcdFx0XHRcdHByZWxvYWQ6IHRydWUsIC8vIHByZWxvYWQgaW1hZ2Ugb24gbW91c2VvdmVyXHJcblx0XHRcdFx0XHRzZWxlY3Q6IGZhbHNlIC8vIHNldCBzZWxlY3RlZCBpbWFnZSBvbiBtb3VzZW92ZXIgd2hlbiB0cnVlXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRjbGljazoge1xyXG5cdFx0XHRcdFx0c2VsZWN0OiBmYWxzZSwgLy8gc2V0IHNlbGVjdGVkIGltYWdlIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdFx0bW9kYWw6IHRydWUgLy8gb3BlbiBtb2RhbCB3aGVuIHRydWVcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRpbWFnZToge1xyXG5cdFx0XHRcdHRyYW5zaXRpb246ICdzbGlkZUxSJywgLy8gdHJhbnNpdGlvbiBlZmZlY3RcclxuXHRcdFx0XHRzaXplOiAnY292ZXInLCAvLyBjb250YWluLCBjb3ZlciwgYXV0bywgc3RyZXRjaFxyXG5cdFx0XHRcdGFycm93czoge1xyXG5cdFx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSwgIC8vIHNob3cvaGlkZSBhcnJvd3NcclxuXHRcdFx0XHRcdHByZWxvYWQ6IHRydWUsIC8vIHByZWxvYWQgaW1hZ2Ugb24gbW91c2VvdmVyXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRjbGljazoge1xyXG5cdFx0XHRcdFx0bW9kYWw6IHRydWUgLy8gd2hlbiBjbGljayBvbiB0aGUgaW1hZ2Ugb3BlbiB0aGUgbW9kYWwgd2luZG93XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRoZWlnaHQ6IG51bGwsIC8vIGhlaWdodCBpbiBwaXhlbFxyXG5cdFx0XHRcdGhlaWdodE1pbjogbnVsbCwgLy8gbWluIGhlaWdodCBpbiBwaXhlbFxyXG5cdFx0XHRcdGhlaWdodEF1dG86IHtcclxuXHRcdFx0XHRcdGluaXRpYWw6IHRydWUsIC8vIGNhbGN1bGF0ZSBkaXYgaGVpZ2h0IGJ5IGZpcnN0IGltYWdlXHJcblx0XHRcdFx0XHRvbnJlc2l6ZTogZmFsc2UgLy8gY2FsY3VsYXRlIGRpdiBoZWlnaHQgb24gd2luZG93IHJlc2l6ZVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cGxhY2Vob2xkZXI6ICdwYW5lbCcgLy8gc2V0IGltYWdlIHBsYWNlaG9sZGVyIHNvdXJjZSB0eXBlICh0aHVtYm5haWwpIG9yIGZ1bGwgdXJsIChodHRwLi4uKVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIGF2YWlsYWJsZSBpbWFnZSBzaXplc1xyXG5cdFx0cHVibGljIHNpemVzOiBBcnJheTxzdHJpbmc+ID0gW1xyXG5cdFx0XHQnY29udGFpbicsXHJcblx0XHRcdCdjb3ZlcicsXHJcblx0XHRcdCdhdXRvJyxcclxuXHRcdFx0J3N0cmV0Y2gnXHJcblx0XHRdO1xyXG5cclxuXHRcdC8vIGF2YWlsYWJsZSB0aGVtZXNcclxuXHRcdHB1YmxpYyB0aGVtZXM6IEFycmF5PHN0cmluZz4gPSBbXHJcblx0XHRcdCdkZWZhdWx0JyxcclxuXHRcdFx0J2RhcmtibHVlJyxcclxuXHRcdFx0J3doaXRlZ29sZCdcclxuXHRcdF07XHJcblxyXG5cdFx0Ly8gYXZhaWxhYmxlIHRyYW5zaXRpb25zXHJcblx0XHRwdWJsaWMgdHJhbnNpdGlvbnM6IEFycmF5PHN0cmluZz4gPSBbXHJcblx0XHRcdCdubycsXHJcblx0XHRcdCdmYWRlSW5PdXQnLFxyXG5cdFx0XHQnem9vbUluJyxcclxuXHRcdFx0J3pvb21PdXQnLFxyXG5cdFx0XHQnem9vbUluT3V0JyxcclxuXHRcdFx0J3JvdGF0ZUxSJyxcclxuXHRcdFx0J3JvdGF0ZVRCJyxcclxuXHRcdFx0J3JvdGF0ZVpZJyxcclxuXHRcdFx0J3NsaWRlTFInLFxyXG5cdFx0XHQnc2xpZGVUQicsXHJcblx0XHRcdCd6bGlkZUxSJyxcclxuXHRcdFx0J3psaWRlVEInLFxyXG5cdFx0XHQnZmxpcFgnLFxyXG5cdFx0XHQnZmxpcFknXHJcblx0XHRdO1xyXG5cclxuXHRcdHB1YmxpYyBldmVudHMgPSB7XHJcblx0XHRcdENPTkZJR19MT0FEOiAnQVNHLWNvbmZpZy1sb2FkLScsXHJcblx0XHRcdEFVVE9QTEFZX1NUQVJUOiAnQVNHLWF1dG9wbGF5LXN0YXJ0LScsXHJcblx0XHRcdEFVVE9QTEFZX1NUT1A6ICdBU0ctYXV0b3BsYXktc3RvcC0nLFxyXG5cdFx0XHRQQVJTRV9JTUFHRVM6ICdBU0ctcGFyc2UtaW1hZ2VzLScsXHJcblx0XHRcdExPQURfSU1BR0U6ICdBU0ctbG9hZC1pbWFnZS0nLFxyXG5cdFx0XHRGSVJTVF9JTUFHRTogJ0FTRy1maXJzdC1pbWFnZS0nLFxyXG5cdFx0XHRDSEFOR0VfSU1BR0U6ICdBU0ctY2hhbmdlLWltYWdlLScsXHJcblx0XHRcdERPVUJMRV9JTUFHRTogJ0FTRy1kb3VibGUtaW1hZ2UtJyxcclxuXHRcdFx0TU9EQUxfT1BFTjogJ0FTRy1tb2RhbC1vcGVuLScsXHJcblx0XHRcdE1PREFMX0NMT1NFOiAnQVNHLW1vZGFsLWNsb3NlLScsXHJcblx0XHRcdFRIVU1CTkFJTF9NT1ZFOiAnQVNHLXRodW1ibmFpbC1tb3ZlLScsXHJcblx0XHRcdEdBTExFUllfVVBEQVRFRDogJ0FTRy1nYWxsZXJ5LXVwZGF0ZWQtJyxcclxuXHRcdFx0R0FMTEVSWV9FRElUOiAnQVNHLWdhbGxlcnktZWRpdCcsXHJcblx0XHR9O1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxyXG5cdFx0XHRwcml2YXRlIGludGVydmFsOiBuZy5JSW50ZXJ2YWxTZXJ2aWNlLFxyXG5cdFx0XHRwcml2YXRlIGxvY2F0aW9uOiBuZy5JTG9jYXRpb25TZXJ2aWNlLFxyXG5cdFx0XHRwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG5cdFx0XHRwcml2YXRlICR3aW5kb3c6IG5nLklXaW5kb3dTZXJ2aWNlKSB7XHJcblxyXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCgncmVzaXplJywgKGV2ZW50KSA9PiB7XHJcblx0XHRcdFx0dGhpcy50aHVtYm5haWxzTW92ZSgyMDApO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIHVwZGF0ZSBpbWFnZXMgd2hlbiBlZGl0IGV2ZW50XHJcblx0XHRcdCRyb290U2NvcGUuJG9uKHRoaXMuZXZlbnRzLkdBTExFUllfRURJVCwgKGV2ZW50LCBkYXRhKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaW5zdGFuY2VzW2RhdGEuaWRdKSB7XHJcblx0XHRcdFx0XHR0aGlzLmluc3RhbmNlc1tkYXRhLmlkXS5lZGl0R2FsbGVyeShkYXRhKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIHBhcnNlSGFzaCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5pZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCF0aGlzLm9wdGlvbnMuaGFzaFVybCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGhhc2ggPSB0aGlzLmxvY2F0aW9uLmhhc2goKTtcclxuXHRcdFx0bGV0IHBhcnRzID0gaGFzaCA/IGhhc2guc3BsaXQoJy0nKSA6IG51bGw7XHJcblxyXG5cdFx0XHRpZiAocGFydHMgPT09IG51bGwpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChwYXJ0c1swXSAhPT0gdGhpcy5zbHVnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocGFydHMubGVuZ3RoICE9PSAzKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocGFydHNbMV0gIT09IHRoaXMuaWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBpbmRleCA9IHBhcnNlSW50KHBhcnRzWzJdLCAxMCk7XHJcblxyXG5cdFx0XHRpZiAoIWFuZ3VsYXIuaXNOdW1iZXIoaW5kZXgpKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cclxuXHRcdFx0XHRpbmRleC0tO1xyXG5cdFx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleDtcclxuXHRcdFx0XHR0aGlzLm1vZGFsT3BlbihpbmRleCk7XHJcblxyXG5cdFx0XHR9LCAyMCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNhbGN1bGF0ZSBvYmplY3QgaGFzaCBpZFxyXG5cdFx0cHVibGljIG9iamVjdEhhc2hJZChvYmplY3Q6IGFueSk6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRsZXQgc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkob2JqZWN0KTtcclxuXHJcblx0XHRcdGlmICghc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBhYmMgPSBzdHJpbmcucmVwbGFjZSgvW15hLXpBLVowLTldKy9nLCAnJyk7XHJcblx0XHRcdGxldCBjb2RlID0gMDtcclxuXHJcblx0XHRcdGZvciAobGV0IGkgPSAwLCBuID0gYWJjLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG5cdFx0XHRcdGxldCBjaGFyY29kZSA9IGFiYy5jaGFyQ29kZUF0KGkpO1xyXG5cdFx0XHRcdGNvZGUgKz0gKGNoYXJjb2RlICogaSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiAnaWQnICsgY29kZS50b1N0cmluZygyMSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlIGZvciBjdXJyZW50IGdhbGxlcnkgYnkgY29tcG9uZW50IGlkXHJcblx0XHRwdWJsaWMgZ2V0SW5zdGFuY2UoY29tcG9uZW50OiBhbnkpIHtcclxuXHJcblx0XHRcdGlmICghY29tcG9uZW50LmlkKSB7XHJcblxyXG5cdFx0XHRcdC8vIGdldCBwYXJlbnQgYXNnIGNvbXBvbmVudCBpZFxyXG5cdFx0XHRcdGlmIChjb21wb25lbnQuJHNjb3BlICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudCAmJiBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQuJHBhcmVudCAmJiBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQuJHBhcmVudC4kY3RybCkge1xyXG5cdFx0XHRcdFx0Y29tcG9uZW50LmlkID0gY29tcG9uZW50LiRzY29wZS4kcGFyZW50LiRwYXJlbnQuJGN0cmwuaWQ7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbXBvbmVudC5pZCA9IHRoaXMub2JqZWN0SGFzaElkKGNvbXBvbmVudC5vcHRpb25zKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBpZCA9IGNvbXBvbmVudC5pZDtcclxuXHRcdFx0bGV0IGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbaWRdO1xyXG5cclxuXHRcdFx0Ly8gbmV3IGluc3RhbmNlIGFuZCBzZXQgb3B0aW9ucyBhbmQgaXRlbXNcclxuXHRcdFx0aWYgKGluc3RhbmNlID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRpbnN0YW5jZSA9IG5ldyBTZXJ2aWNlQ29udHJvbGxlcih0aGlzLnRpbWVvdXQsIHRoaXMuaW50ZXJ2YWwsIHRoaXMubG9jYXRpb24sIHRoaXMuJHJvb3RTY29wZSwgdGhpcy4kd2luZG93KTtcclxuXHRcdFx0XHRpbnN0YW5jZS5pZCA9IGlkO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoY29tcG9uZW50LmJhc2VVcmwpIHtcclxuXHRcdFx0XHRjb21wb25lbnQub3B0aW9ucy5iYXNlVXJsID0gY29tcG9uZW50LmJhc2VVcmw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGluc3RhbmNlLnNldE9wdGlvbnMoY29tcG9uZW50Lm9wdGlvbnMpO1xyXG5cdFx0XHRpbnN0YW5jZS5zZXRJdGVtcyhjb21wb25lbnQuaXRlbXMpO1xyXG5cdFx0XHRpbnN0YW5jZS5zZWxlY3RlZCA9IGNvbXBvbmVudC5zZWxlY3RlZCA/IGNvbXBvbmVudC5zZWxlY3RlZCA6IGluc3RhbmNlLm9wdGlvbnMuc2VsZWN0ZWQ7XHJcblx0XHRcdGluc3RhbmNlLnBhcnNlSGFzaCgpO1xyXG5cclxuXHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMpIHtcclxuXHJcblx0XHRcdFx0aW5zdGFuY2UubG9hZEltYWdlcyhpbnN0YW5jZS5vcHRpb25zLnByZWxvYWQpO1xyXG5cclxuXHRcdFx0XHRpZiAoaW5zdGFuY2Uub3B0aW9ucy5hdXRvcGxheSAmJiBpbnN0YW5jZS5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgJiYgIWluc3RhbmNlLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0XHRpbnN0YW5jZS5hdXRvUGxheVN0YXJ0KCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5pbnN0YW5jZXNbaWRdID0gaW5zdGFuY2U7XHJcblx0XHRcdHJldHVybiBpbnN0YW5jZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gcHJlcGFyZSBpbWFnZXMgYXJyYXlcclxuXHRcdHB1YmxpYyBzZXRJdGVtcyhpdGVtczogQXJyYXk8SUZpbGU+KSB7XHJcblxyXG5cdFx0XHR0aGlzLml0ZW1zID0gaXRlbXMgPyBpdGVtcyA6IFtdO1xyXG5cdFx0XHR0aGlzLnByZXBhcmVJdGVtcygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBvcHRpb25zIHNldHVwXHJcblx0XHRwdWJsaWMgc2V0T3B0aW9ucyhvcHRpb25zOiBJT3B0aW9ucykge1xyXG5cclxuXHRcdFx0Ly8gaWYgb3B0aW9ucyBhbHJlYWR5IHNldHVwXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnNMb2FkZWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChvcHRpb25zKSB7XHJcblxyXG5cdFx0XHRcdHRoaXMub3B0aW9ucyA9IGFuZ3VsYXIuY29weSh0aGlzLmRlZmF1bHRzKTtcclxuXHRcdFx0XHRhbmd1bGFyLm1lcmdlKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XHJcblxyXG5cdFx0XHRcdGlmIChvcHRpb25zLm1vZGFsICYmIG9wdGlvbnMubW9kYWwuaGVhZGVyICYmIG9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnMpIHtcclxuXHJcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnMgPSBvcHRpb25zLm1vZGFsLmhlYWRlci5idXR0b25zO1xyXG5cclxuXHRcdFx0XHRcdC8vIHJlbW92ZSBkdXBsaWNhdGVzIGZyb20gYnV0dG9uc1xyXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLm1vZGFsLmhlYWRlci5idXR0b25zID0gdGhpcy5vcHRpb25zLm1vZGFsLmhlYWRlci5idXR0b25zLmZpbHRlcihmdW5jdGlvbiAoeCwgaSwgYSkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gYS5pbmRleE9mKHgpID09PSBpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5vcHRpb25zTG9hZGVkID0gdHJ1ZTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25zID0gYW5ndWxhci5jb3B5KHRoaXMuZGVmYXVsdHMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpZiAhdGhpcy4kd2luZG93LnNjcmVlbmZ1bGxcclxuXHRcdFx0aWYgKCF0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbCkge1xyXG5cdFx0XHRcdHRoaXMub3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucyA9IHRoaXMub3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucy5maWx0ZXIoZnVuY3Rpb24gKHgsIGksIGEpIHtcclxuXHRcdFx0XHRcdHJldHVybiB4ICE9PSAnZnVsbHNjcmVlbic7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHQvLyBpbXBvcnRhbnQhXHJcblx0XHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkNPTkZJR19MT0FELCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHY6IG51bWJlcikge1xyXG5cclxuXHRcdFx0diA9IHRoaXMubm9ybWFsaXplKHYpO1xyXG5cdFx0XHRsZXQgcHJldiA9IHRoaXMuX3NlbGVjdGVkO1xyXG5cclxuXHRcdFx0dGhpcy5fc2VsZWN0ZWQgPSB2O1xyXG5cdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLl9zZWxlY3RlZCk7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuZmlsZSkge1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5vcHRpb25zLm1vZGFsLnRpdGxlRnJvbUltYWdlICYmIHRoaXMuZmlsZS50aXRsZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLm1vZGFsLnRpdGxlID0gdGhpcy5maWxlLnRpdGxlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHRoaXMub3B0aW9ucy5tb2RhbC5zdWJ0aXRsZUZyb21JbWFnZSAmJiB0aGlzLmZpbGUuZGVzY3JpcHRpb24pIHtcclxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5tb2RhbC5zdWJ0aXRsZSA9IHRoaXMuZmlsZS5kZXNjcmlwdGlvbjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocHJldiAhPT0gdGhpcy5fc2VsZWN0ZWQpIHtcclxuXHJcblx0XHRcdFx0dGhpcy50aHVtYm5haWxzTW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQ0hBTkdFX0lNQUdFLCB7XHJcblx0XHRcdFx0XHRpbmRleDogdixcclxuXHRcdFx0XHRcdGZpbGU6IHRoaXMuZmlsZVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5vcHRpb25zLnNlbGVjdGVkID0gdGhpcy5fc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLl9zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZm9yY2Ugc2VsZWN0IGltYWdlXHJcblx0XHRwdWJsaWMgZm9yY2VTZWxlY3QoaW5kZXgpIHtcclxuXHJcblx0XHRcdGluZGV4ID0gdGhpcy5ub3JtYWxpemUoaW5kZXgpO1xyXG5cdFx0XHR0aGlzLl9zZWxlY3RlZCA9IGluZGV4O1xyXG5cdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLl9zZWxlY3RlZCk7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkNIQU5HRV9JTUFHRSwge1xyXG5cdFx0XHRcdGluZGV4OiBpbmRleCxcclxuXHRcdFx0XHRmaWxlOiB0aGlzLmZpbGVcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXg6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSBpbmRleCA+IHRoaXMuc2VsZWN0ZWQgPyAnZm9yd2FyZCcgOiAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXg7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ28gdG8gYmFja3dhcmRcclxuXHRcdHB1YmxpYyB0b0JhY2t3YXJkKHN0b3A/OiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoc3RvcCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2JhY2t3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZC0tO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gZm9yd2FyZFxyXG5cdFx0cHVibGljIHRvRm9yd2FyZChzdG9wPzogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0aWYgKHN0b3ApIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdmb3J3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCsrO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gZmlyc3RcclxuXHRcdHB1YmxpYyB0b0ZpcnN0KHN0b3A/OiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoc3RvcCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2JhY2t3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IDA7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBsYXN0XHJcblx0XHRwdWJsaWMgdG9MYXN0KHN0b3A/OiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoc3RvcCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2ZvcndhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5pdGVtcy5sZW5ndGggLSAxO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHNldEhhc2goKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5tb2RhbFZpc2libGUgJiYgdGhpcy5vcHRpb25zLmhhc2hVcmwpIHtcclxuXHRcdFx0XHR0aGlzLmxvY2F0aW9uLmhhc2goW3RoaXMuc2x1ZywgdGhpcy5pZCwgdGhpcy5zZWxlY3RlZCArIDFdLmpvaW4oJy0nKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5VG9nZ2xlKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RhcnQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5U3RvcCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hdXRvcGxheSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5pbnRlcnZhbC5jYW5jZWwodGhpcy5hdXRvcGxheSk7XHJcblx0XHRcdHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuYXV0b3BsYXkgPSBudWxsO1xyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkFVVE9QTEFZX1NUT1AsIHsgaW5kZXg6IHRoaXMuc2VsZWN0ZWQsIGZpbGU6IHRoaXMuZmlsZSB9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5U3RhcnQoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5hdXRvcGxheSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLmF1dG9wbGF5ID0gdGhpcy5pbnRlcnZhbCgoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy50b0ZvcndhcmQoKTtcclxuXHRcdFx0fSwgdGhpcy5vcHRpb25zLmF1dG9wbGF5LmRlbGF5KTtcclxuXHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQVVUT1BMQVlfU1RBUlQsIHsgaW5kZXg6IHRoaXMuc2VsZWN0ZWQsIGZpbGU6IHRoaXMuZmlsZSB9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgcHJlcGFyZUl0ZW1zKCkge1xyXG5cclxuXHRcdFx0bGV0IGxlbmd0aCA9IHRoaXMuaXRlbXMubGVuZ3RoO1xyXG5cdFx0XHRmb3IgKGxldCBrZXkgPSAwOyBrZXkgPCBsZW5ndGg7IGtleSsrKSB7XHJcblx0XHRcdFx0dGhpcy5hZGRJbWFnZSh0aGlzLml0ZW1zW2tleV0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLlBBUlNFX0lNQUdFUywgdGhpcy5maWxlcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHByZWxvYWQgdGhlIGltYWdlIHdoZW4gbW91c2VvdmVyXHJcblx0XHRwdWJsaWMgaG92ZXJQcmVsb2FkKGluZGV4OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMubG9hZEltYWdlKGluZGV4KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaW1hZ2UgcHJlbG9hZFxyXG5cdFx0cHJpdmF0ZSBwcmVsb2FkKHdhaXQ/OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGxldCBpbmRleCA9IHRoaXMuZGlyZWN0aW9uID09PSAnZm9yd2FyZCcgPyB0aGlzLnNlbGVjdGVkICsgMSA6IHRoaXMuc2VsZWN0ZWQgLSAxO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5wcmVsb2FkTmV4dCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmxvYWRJbWFnZShpbmRleCk7XHJcblx0XHRcdFx0fSwgKHdhaXQgIT09IHVuZGVmaW5lZCkgPyB3YWl0IDogdGhpcy5vcHRpb25zLnByZWxvYWREZWxheSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG5vcm1hbGl6ZShpbmRleDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRsZXQgbGFzdCA9IHRoaXMuZmlsZXMubGVuZ3RoIC0gMTtcclxuXHJcblx0XHRcdGlmIChpbmRleCA+IGxhc3QpIHtcclxuXHRcdFx0XHRyZXR1cm4gKGluZGV4IC0gbGFzdCkgLSAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoaW5kZXggPCAwKSB7XHJcblx0XHRcdFx0cmV0dXJuIGxhc3QgLSBNYXRoLmFicyhpbmRleCkgKyAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gaW5kZXg7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbG9hZEltYWdlcyhpbmRleGVzOiBBcnJheTxudW1iZXI+LCB0eXBlOiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdGlmICghaW5kZXhlcyB8fCBpbmRleGVzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0aW5kZXhlcy5mb3JFYWNoKChpbmRleDogbnVtYmVyKSA9PiB7XHJcblx0XHRcdFx0c2VsZi5sb2FkSW1hZ2UoaW5kZXgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBsb2FkSW1hZ2UoaW5kZXg/OiBudW1iZXIsIGNhbGxiYWNrPzoge30pIHtcclxuXHJcblx0XHRcdGluZGV4ID0gaW5kZXggPyBpbmRleCA6IHRoaXMuc2VsZWN0ZWQ7XHJcblx0XHRcdGluZGV4ID0gdGhpcy5ub3JtYWxpemUoaW5kZXgpO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmZpbGVzW2luZGV4XSkge1xyXG5cdFx0XHRcdHRoaXMubG9nKCdpbnZhbGlkIGZpbGUgaW5kZXgnLCB7IGluZGV4OiBpbmRleCB9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLm1vZGFsVmlzaWJsZSkge1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5maWxlc1tpbmRleF0ubG9hZGVkLm1vZGFsID09PSB0cnVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgbW9kYWwgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdFx0XHRtb2RhbC5zcmMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2UubW9kYWw7XHJcblx0XHRcdFx0bW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5hZnRlckxvYWQoaW5kZXgsICdtb2RhbCcsIG1vZGFsKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWQuaW1hZ2UgPT09IHRydWUpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0XHRcdGltYWdlLnNyYyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5pbWFnZTtcclxuXHRcdFx0XHRpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5hZnRlckxvYWQoaW5kZXgsICdpbWFnZScsIGltYWdlKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGZpbGUgbmFtZVxyXG5cdFx0cHJpdmF0ZSBnZXRGaWxlbmFtZShpbmRleDogbnVtYmVyLCB0eXBlPzogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHR0eXBlID0gdHlwZSA/IHR5cGUgOiAnbW9kYWwnO1xyXG5cdFx0XHRsZXQgZmlsZXBhcnRzID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlW3R5cGVdLnNwbGl0KCcvJyk7XHJcblx0XHRcdGxldCBmaWxlbmFtZSA9IGZpbGVwYXJ0c1tmaWxlcGFydHMubGVuZ3RoIC0gMV07XHJcblx0XHRcdHJldHVybiBmaWxlbmFtZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGZpbGUgZXh0ZW5zaW9uXHJcblx0XHRwcml2YXRlIGdldEV4dGVuc2lvbihpbmRleDogbnVtYmVyLCB0eXBlPzogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHR0eXBlID0gdHlwZSA/IHR5cGUgOiAnbW9kYWwnO1xyXG5cdFx0XHRsZXQgZmlsZXBhcnRzID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlW3R5cGVdLnNwbGl0KCcuJyk7XHJcblx0XHRcdGxldCBleHRlbnNpb24gPSBmaWxlcGFydHNbZmlsZXBhcnRzLmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRyZXR1cm4gZXh0ZW5zaW9uO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBhZnRlciBsb2FkIGltYWdlXHJcblx0XHRwcml2YXRlIGFmdGVyTG9hZChpbmRleCwgdHlwZSwgaW1hZ2UpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5maWxlc1tpbmRleF0gfHwgIXRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZFt0eXBlXSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZFt0eXBlXSA9IHRydWU7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodHlwZSA9PT0gJ21vZGFsJykge1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLndpZHRoID0gaW1hZ2Uud2lkdGg7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0uaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLm5hbWUgPSB0aGlzLmdldEZpbGVuYW1lKGluZGV4LCB0eXBlKTtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5leHRlbnNpb24gPSB0aGlzLmdldEV4dGVuc2lvbihpbmRleCwgdHlwZSk7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0uZG93bmxvYWQgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2UubW9kYWw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZFt0eXBlXSA9IHRydWU7XHJcblxyXG5cdFx0XHRsZXQgZGF0YSA9IHsgdHlwZTogdHlwZSwgaW5kZXg6IGluZGV4LCBmaWxlOiB0aGlzLmZpbGUsIGltZzogaW1hZ2UgfTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5maXJzdCkge1xyXG5cdFx0XHRcdHRoaXMuZmlyc3QgPSB0cnVlO1xyXG5cdFx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuRklSU1RfSU1BR0UsIGRhdGEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkxPQURfSU1BR0UsIGRhdGEpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gaXMgc2luZ2xlP1xyXG5cdFx0cHVibGljIGdldCBpc1NpbmdsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmZpbGVzLmxlbmd0aCA+IDEgPyBmYWxzZSA6IHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgdGhlIGRvd25sb2FkIGxpbmtcclxuXHRcdHB1YmxpYyBkb3dubG9hZExpbmsoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5zZWxlY3RlZCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZmlsZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdLnNvdXJjZS5tb2RhbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZSBmaWxlXHJcblx0XHRwdWJsaWMgZ2V0IGZpbGUoKTogSUZpbGUge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuZmlsZXNbdGhpcy5zZWxlY3RlZF07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBlbGVtZW50IHZpc2libGVcclxuXHRcdHB1YmxpYyB0b2dnbGUoZWxlbWVudDogc3RyaW5nKTogdm9pZCB7XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnNbZWxlbWVudF0udmlzaWJsZSA9ICF0aGlzLm9wdGlvbnNbZWxlbWVudF0udmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgZ2V0IG1vZGFsVmlzaWJsZSgpOiBib29sZWFuIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLl92aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZW1lXHJcblx0XHRwdWJsaWMgZ2V0IHRoZW1lKCk6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLnRoZW1lO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgY2xhc3Nlc1xyXG5cdFx0cHVibGljIGdldCBjbGFzc2VzKCk6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLnRoZW1lICsgJyAnICsgdGhpcy5pZCArICh0aGlzLmVkaXRpbmcgPyAnIGVkaXRpbmcnIDogJycpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgcHJlbG9hZCBzdHlsZVxyXG5cdFx0cHVibGljIHByZWxvYWRTdHlsZShmaWxlOiBJRmlsZSwgdHlwZTogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHRsZXQgc3R5bGUgPSB7fTtcclxuXHJcblx0XHRcdGlmIChmaWxlLnNvdXJjZS5jb2xvcikge1xyXG5cdFx0XHRcdHN0eWxlWydiYWNrZ3JvdW5kLWNvbG9yJ10gPSBmaWxlLnNvdXJjZS5jb2xvcjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5sb2FkaW5nSW1hZ2UgJiYgZmlsZS5sb2FkZWRbdHlwZV0gPT09IGZhbHNlKSB7XHJcblx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtaW1hZ2UnXSA9ICd1cmwoJyArIHRoaXMub3B0aW9ucy5sb2FkaW5nSW1hZ2UgKyAnKSc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBzdHlsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHBsYWNlaG9sZGVyIHN0eWxlXHJcblx0XHRwdWJsaWMgcGxhY2Vob2xkZXJTdHlsZShmaWxlOiBJRmlsZSwgdHlwZTogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHRsZXQgc3R5bGUgPSB7fTtcclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnNbdHlwZV0ucGxhY2Vob2xkZXIpIHtcclxuXHJcblx0XHRcdFx0bGV0IGluZGV4ID0gdGhpcy5vcHRpb25zW3R5cGVdLnBsYWNlaG9sZGVyO1xyXG5cdFx0XHRcdGxldCBpc0Z1bGwgPSAoaW5kZXguaW5kZXhPZignLy8nKSA9PT0gMCB8fCBpbmRleC5pbmRleE9mKCdodHRwJykgPT09IDApID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdGxldCBzb3VyY2U7XHJcblxyXG5cdFx0XHRcdGlmIChpc0Z1bGwpIHtcclxuXHRcdFx0XHRcdHNvdXJjZSA9IGluZGV4O1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzb3VyY2UgPSBmaWxlLnNvdXJjZVtpbmRleF07XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoc291cmNlKSB7XHJcblx0XHRcdFx0XHRzdHlsZVsnYmFja2dyb3VuZC1pbWFnZSddID0gJ3VybCgnICsgc291cmNlICsgJyknO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChmaWxlLnNvdXJjZS5jb2xvcikge1xyXG5cdFx0XHRcdHN0eWxlWydiYWNrZ3JvdW5kLWNvbG9yJ10gPSBmaWxlLnNvdXJjZS5jb2xvcjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGZpbGUuc291cmNlLnBsYWNlaG9sZGVyKSB7XHJcblx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtaW1hZ2UnXSA9ICd1cmwoJyArIGZpbGUuc291cmNlLnBsYWNlaG9sZGVyICsgJyknO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gc3R5bGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgc2V0IG1vZGFsVmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0dGhpcy5fdmlzaWJsZSA9IHZhbHVlO1xyXG5cclxuXHRcdFx0Ly8gc2V0IGluZGV4IDAgaWYgIXNlbGVjdGVkXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkID8gdGhpcy5zZWxlY3RlZCA6IDA7XHJcblxyXG5cdFx0XHRsZXQgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcblx0XHRcdGxldCBjbGFzc05hbWUgPSAnYXNnLXloaWRkZW4nO1xyXG5cclxuXHRcdFx0aWYgKHZhbHVlKSB7XHJcblxyXG5cdFx0XHRcdGlmIChib2R5LmNsYXNzTmFtZS5pbmRleE9mKGNsYXNzTmFtZSkgPCAwKSB7XHJcblx0XHRcdFx0XHRib2R5LmNsYXNzTmFtZSA9IGJvZHkuY2xhc3NOYW1lICsgJyAnICsgY2xhc3NOYW1lO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5tb2RhbEluaXQoKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdGJvZHkuY2xhc3NOYW1lID0gYm9keS5jbGFzc05hbWUucmVwbGFjZShjbGFzc05hbWUsICcnKS50cmltKCk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGluaXRpYWxpemUgdGhlIGdhbGxlcnlcclxuXHRcdHByaXZhdGUgbW9kYWxJbml0KCkge1xyXG5cclxuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRzZWxmLnNldEZvY3VzKCk7XHJcblx0XHRcdH0sIDEwMCk7XHJcblxyXG5cdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKDQ0MCk7XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMubW9kYWxJbml0aWFsaXplZCA9IHRydWU7XHJcblx0XHRcdH0sIDQ2MCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbW9kYWxPcGVuKGluZGV4OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5tb2RhbEF2YWlsYWJsZSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IGluZGV4ICE9PSB1bmRlZmluZWQgPyBpbmRleCA6IHRoaXMuc2VsZWN0ZWQ7XHJcblx0XHRcdHRoaXMubW9kYWxWaXNpYmxlID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoKTtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuTU9EQUxfT1BFTiwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCB9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG1vZGFsQ2xvc2UoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmhhc2hVcmwpIHtcclxuXHRcdFx0XHR0aGlzLmxvY2F0aW9uLmhhc2goJycpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm1vZGFsSW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoKTtcclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5NT0RBTF9DTE9TRSwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCB9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gbW92ZSB0aHVtYm5haWxzIHRvIGNvcnJlY3QgcG9zaXRpb25cclxuXHRcdHB1YmxpYyB0aHVtYm5haWxzTW92ZShkZWxheT86IG51bWJlcikge1xyXG5cclxuXHRcdFx0bGV0IG1vdmUgPSAoKSA9PiB7XHJcblxyXG5cdFx0XHRcdGxldCBjb250YWluZXJzID0gdGhpcy5lbCgnZGl2LmFzZy10aHVtYm5haWwuJyArIHRoaXMuaWQpO1xyXG5cclxuXHRcdFx0XHRpZiAoIWNvbnRhaW5lcnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRhaW5lcnMubGVuZ3RoOyBpKyspIHtcclxuXHJcblx0XHRcdFx0XHRsZXQgY29udGFpbmVyOiBhbnkgPSBjb250YWluZXJzW2ldO1xyXG5cclxuXHRcdFx0XHRcdGlmIChjb250YWluZXIub2Zmc2V0V2lkdGgpIHtcclxuXHJcblx0XHRcdFx0XHRcdGxldCBpdGVtczogYW55ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5pdGVtcycpO1xyXG5cdFx0XHRcdFx0XHRsZXQgaXRlbTogYW55ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5pdGVtJyk7XHJcblx0XHRcdFx0XHRcdGxldCB0aHVtYm5haWwsIG1vdmVYLCByZW1haW47XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbSkge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoaXRlbXMuc2Nyb2xsV2lkdGggPiBjb250YWluZXIub2Zmc2V0V2lkdGgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbCA9IGl0ZW1zLnNjcm9sbFdpZHRoIC8gdGhpcy5maWxlcy5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IChjb250YWluZXIub2Zmc2V0V2lkdGggLyAyKSAtICh0aGlzLnNlbGVjdGVkICogdGh1bWJuYWlsKSAtIHRodW1ibmFpbCAvIDI7XHJcblx0XHRcdFx0XHRcdFx0XHRyZW1haW4gPSBpdGVtcy5zY3JvbGxXaWR0aCArIG1vdmVYO1xyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZVggPSBtb3ZlWCA+IDAgPyAwIDogbW92ZVg7XHJcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IHJlbWFpbiA8IGNvbnRhaW5lci5vZmZzZXRXaWR0aCA/IGNvbnRhaW5lci5vZmZzZXRXaWR0aCAtIGl0ZW1zLnNjcm9sbFdpZHRoIDogbW92ZVg7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbCA9IHRoaXMuZ2V0UmVhbFdpZHRoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZVggPSAoY29udGFpbmVyLm9mZnNldFdpZHRoIC0gdGh1bWJuYWlsICogdGhpcy5maWxlcy5sZW5ndGgpIC8gMjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGl0ZW1zLnN0eWxlLmxlZnQgPSBtb3ZlWCArICdweCc7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuVEhVTUJOQUlMX01PVkUsIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbDogdGh1bWJuYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZTogbW92ZVgsXHJcblx0XHRcdFx0XHRcdFx0XHRyZW1haW46IHJlbWFpbixcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnRhaW5lcjogY29udGFpbmVyLm9mZnNldFdpZHRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbXM6IGl0ZW1zLnNjcm9sbFdpZHRoXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpZiAoZGVsYXkpIHtcclxuXHRcdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0bW92ZSgpO1xyXG5cdFx0XHRcdH0sIGRlbGF5KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtb3ZlKCk7XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBtb2RhbENsaWNrKCRldmVudD86IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICgkZXZlbnQpIHtcclxuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRoZSBmb2N1c1xyXG5cdFx0cHVibGljIHNldEZvY3VzKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubW9kYWxWaXNpYmxlKSB7XHJcblxyXG5cdFx0XHRcdGxldCBlbGVtZW50OiBOb2RlID0gdGhpcy5lbCgnZGl2LmFzZy1tb2RhbC4nICsgdGhpcy5pZCArICcgLmtleUlucHV0JylbMF07XHJcblxyXG5cdFx0XHRcdGlmIChlbGVtZW50KSB7XHJcblx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbWVudClbMF0uZm9jdXMoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgZXZlbnQoZXZlbnQ6IHN0cmluZywgZGF0YT86IGFueSkge1xyXG5cclxuXHRcdFx0ZXZlbnQgPSBldmVudCArIHRoaXMuaWQ7XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kZW1pdChldmVudCwgZGF0YSk7XHJcblx0XHRcdHRoaXMubG9nKGV2ZW50LCBkYXRhKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGxvZyhldmVudDogc3RyaW5nLCBkYXRhPzogYW55KSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmRlYnVnKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXZlbnQsIGRhdGEgPyBkYXRhIDogbnVsbCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGVsZW1lbnRcclxuXHRcdHB1YmxpYyBlbChzZWxlY3Rvcik6IE5vZGVMaXN0IHtcclxuXHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRpbmcgZWxlbWVudCByZWFsIHdpZHRoXHJcblx0XHRwdWJsaWMgZ2V0UmVhbFdpZHRoKGl0ZW0pIHtcclxuXHJcblx0XHRcdGxldCBzdHlsZSA9IGl0ZW0uY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGl0ZW0pLFxyXG5cdFx0XHRcdHdpZHRoID0gaXRlbS5vZmZzZXRXaWR0aCxcclxuXHRcdFx0XHRtYXJnaW4gPSBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkxlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5SaWdodCksXHJcblx0XHRcdFx0Ly8gcGFkZGluZyA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0xlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nUmlnaHQpLFxyXG5cdFx0XHRcdGJvcmRlciA9IHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyTGVmdFdpZHRoKSArIHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyUmlnaHRXaWR0aCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gd2lkdGggKyBtYXJnaW4gKyBib3JkZXI7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNhbGN1bGF0aW5nIGVsZW1lbnQgcmVhbCBoZWlnaHRcclxuXHRcdHB1YmxpYyBnZXRSZWFsSGVpZ2h0KGl0ZW0pIHtcclxuXHJcblx0XHRcdGxldCBzdHlsZSA9IGl0ZW0uY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGl0ZW0pLFxyXG5cdFx0XHRcdGhlaWdodCA9IGl0ZW0ub2Zmc2V0SGVpZ2h0LFxyXG5cdFx0XHRcdG1hcmdpbiA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luQm90dG9tKSxcclxuXHRcdFx0XHQvLyBwYWRkaW5nID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0JvdHRvbSksXHJcblx0XHRcdFx0Ym9yZGVyID0gcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJUb3BXaWR0aCkgKyBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlckJvdHRvbVdpZHRoKTtcclxuXHJcblx0XHRcdHJldHVybiBoZWlnaHQgKyBtYXJnaW4gKyBib3JkZXI7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBlZGl0IGdhbGxlcnlcclxuXHRcdHB1YmxpYyBlZGl0R2FsbGVyeShlZGl0OiBJRWRpdCkge1xyXG5cclxuXHRcdFx0dGhpcy5lZGl0aW5nID0gdHJ1ZTtcclxuXHRcdFx0bGV0IHNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZDtcclxuXHJcblx0XHRcdGlmIChlZGl0Lm9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHRoaXMub3B0aW9uc0xvYWRlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMuc2V0T3B0aW9ucyhlZGl0Lm9wdGlvbnMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoZWRpdC5kZWxldGUgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHRoaXMuZGVsZXRlSW1hZ2UoZWRpdC5kZWxldGUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoZWRpdC5hZGQpIHtcclxuXHRcdFx0XHRsZXQgbGVuZ3RoID0gZWRpdC5hZGQubGVuZ3RoO1xyXG5cdFx0XHRcdGZvciAobGV0IGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcclxuXHRcdFx0XHRcdHRoaXMuYWRkSW1hZ2UoZWRpdC5hZGRba2V5XSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoZWRpdC51cGRhdGUpIHtcclxuXHJcblx0XHRcdFx0bGV0IGxlbmd0aCA9IGVkaXQudXBkYXRlLmxlbmd0aDtcclxuXHJcblx0XHRcdFx0Zm9yIChsZXQga2V5ID0gMDsga2V5IDwgbGVuZ3RoOyBrZXkrKykge1xyXG5cdFx0XHRcdFx0dGhpcy5hZGRJbWFnZShlZGl0LnVwZGF0ZVtrZXldLCBrZXkpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGNvdW50ID0gdGhpcy5maWxlcy5sZW5ndGggLSBlZGl0LnVwZGF0ZS5sZW5ndGg7XHJcblx0XHRcdFx0aWYgKGNvdW50ID4gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5kZWxldGVJbWFnZShsZW5ndGgsIGNvdW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblxyXG5cdFx0XHRcdGlmIChlZGl0LnNlbGVjdGVkID49IDApIHtcclxuXHRcdFx0XHRcdHNlbGVjdGVkID0gZWRpdC5zZWxlY3RlZDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHNlbGVjdGVkID0gdGhpcy5maWxlc1tzZWxlY3RlZF0gPyBzZWxlY3RlZCA6IChzZWxlY3RlZCA+PSB0aGlzLmZpbGVzLmxlbmd0aCA/IHRoaXMuZmlsZXMubGVuZ3RoIC0gMSA6IDApO1xyXG5cclxuXHRcdFx0XHR0aGlzLmZvcmNlU2VsZWN0KHRoaXMuZmlsZXNbc2VsZWN0ZWRdID8gc2VsZWN0ZWQgOiAwKTtcclxuXHRcdFx0XHR0aGlzLmVkaXRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkdBTExFUllfVVBEQVRFRCwgZWRpdCk7XHJcblx0XHRcdFx0dGhpcy50aHVtYm5haWxzTW92ZShlZGl0LmRlbGF5VGh1bWJuYWlscyAhPT0gdW5kZWZpbmVkID8gZWRpdC5kZWxheVRodW1ibmFpbHMgOiAyMjApO1xyXG5cclxuXHRcdFx0fSwgKGVkaXQuZGVsYXlSZWZyZXNoICE9PSB1bmRlZmluZWQgPyBlZGl0LmRlbGF5UmVmcmVzaCA6IDQyMCkpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZGVsZXRlIGltYWdlXHJcblx0XHRwdWJsaWMgZGVsZXRlSW1hZ2UoaW5kZXg6IG51bWJlciwgY291bnQ/OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGluZGV4ID0gaW5kZXggPT09IG51bGwgfHwgaW5kZXggPT09IHVuZGVmaW5lZCA/IHRoaXMuc2VsZWN0ZWQgOiBpbmRleDtcclxuXHRcdFx0Y291bnQgPSBjb3VudCA/IGNvdW50IDogMTtcclxuXHJcblx0XHRcdHRoaXMuZmlsZXMuc3BsaWNlKGluZGV4LCBjb3VudCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGZpbmQgaW1hZ2UgaW4gZ2FsbGVyeSBieSBtb2RhbCBzb3VyY2VcclxuXHRcdHB1YmxpYyBmaW5kSW1hZ2UoZmlsZW5hbWUgOiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdGxldCBsZW5ndGggPSB0aGlzLmZpbGVzLmxlbmd0aDtcclxuXHJcblx0XHRcdGZvciAobGV0IGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcclxuXHRcdFx0XHRpZiAodGhpcy5maWxlc1trZXldLnNvdXJjZS5tb2RhbCA9PT0gZmlsZW5hbWUpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZpbGVzW2tleV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgZ2V0RnVsbFVybCh1cmwgOiBzdHJpbmcsIGJhc2VVcmw/OiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdGJhc2VVcmwgPSBiYXNlVXJsID09PSB1bmRlZmluZWQgPyB0aGlzLm9wdGlvbnMuYmFzZVVybCA6IGJhc2VVcmw7XHJcblx0XHRcdGxldCBpc0Z1bGwgPSAodXJsLmluZGV4T2YoJy8vJykgPT09IDAgfHwgdXJsLmluZGV4T2YoJ2h0dHAnKSA9PT0gMCkgPyB0cnVlIDogZmFsc2U7XHJcblxyXG5cdFx0XHRyZXR1cm4gaXNGdWxsID8gdXJsIDogYmFzZVVybCArIHVybDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gYWRkIGltYWdlXHJcblx0XHRwdWJsaWMgYWRkSW1hZ2UodmFsdWU6IGFueSwgaW5kZXg/OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdGlmIChhbmd1bGFyLmlzU3RyaW5nKHZhbHVlKSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHZhbHVlID0geyBzb3VyY2U6IHsgbW9kYWw6IHZhbHVlIH0gfTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGdldEF2YWlsYWJsZVNvdXJjZSA9IGZ1bmN0aW9uICh0eXBlOiBzdHJpbmcsIHNyYzogSVNvdXJjZSkge1xyXG5cclxuXHRcdFx0XHRpZiAoc3JjW3R5cGVdKSB7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIHNlbGYuZ2V0RnVsbFVybChzcmNbdHlwZV0pO1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAncGFuZWwnKSB7XHJcblx0XHRcdFx0XHRcdHR5cGUgPSAnaW1hZ2UnO1xyXG5cdFx0XHRcdFx0XHRpZiAoc3JjW3R5cGVdKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHNlbGYuZ2V0RnVsbFVybChzcmNbdHlwZV0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICdpbWFnZScpIHtcclxuXHRcdFx0XHRcdFx0dHlwZSA9ICdtb2RhbCc7XHJcblx0XHRcdFx0XHRcdGlmIChzcmNbdHlwZV0pIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5nZXRGdWxsVXJsKHNyY1t0eXBlXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ21vZGFsJykge1xyXG5cdFx0XHRcdFx0XHR0eXBlID0gJ2ltYWdlJztcclxuXHRcdFx0XHRcdFx0aWYgKHNyY1t0eXBlXSkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBzZWxmLmdldEZ1bGxVcmwoc3JjW3R5cGVdKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKCF2YWx1ZS5zb3VyY2UpIHtcclxuXHRcdFx0XHR2YWx1ZS5zb3VyY2UgPSB7XHJcblx0XHRcdFx0XHRtb2RhbDogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UubW9kYWxdLFxyXG5cdFx0XHRcdFx0cGFuZWw6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLnBhbmVsXSxcclxuXHRcdFx0XHRcdGltYWdlOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5pbWFnZV0sXHJcblx0XHRcdFx0XHRwbGFjZWhvbGRlcjogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UucGxhY2Vob2xkZXJdXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IHNvdXJjZSA9IHtcclxuXHRcdFx0XHRtb2RhbDogZ2V0QXZhaWxhYmxlU291cmNlKCdtb2RhbCcsIHZhbHVlLnNvdXJjZSksXHJcblx0XHRcdFx0cGFuZWw6IGdldEF2YWlsYWJsZVNvdXJjZSgncGFuZWwnLCB2YWx1ZS5zb3VyY2UpLFxyXG5cdFx0XHRcdGltYWdlOiBnZXRBdmFpbGFibGVTb3VyY2UoJ2ltYWdlJywgdmFsdWUuc291cmNlKSxcclxuXHRcdFx0XHRjb2xvcjogdmFsdWUuY29sb3IgPyB2YWx1ZS5jb2xvciA6ICd0cmFuc3BhcmVudCcsXHJcblx0XHRcdFx0cGxhY2Vob2xkZXI6IHZhbHVlLnBsYWNlaG9sZGVyID8gc2VsZi5nZXRGdWxsVXJsKHZhbHVlLnBsYWNlaG9sZGVyKSA6IG51bGxcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGlmICghc291cmNlLm1vZGFsKSB7XHJcblx0XHRcdFx0c2VsZi5sb2coJ2ludmFsaWQgaW1hZ2UgZGF0YScsIHsgc291cmNlOiBzb3VyY2UsIHZhbHVlOiB2YWx1ZSB9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBwYXJ0cyA9IHNvdXJjZS5tb2RhbC5zcGxpdCgnLycpO1xyXG5cdFx0XHRsZXQgZmlsZW5hbWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcclxuXHRcdFx0bGV0IHRpdGxlLCBkZXNjcmlwdGlvbjtcclxuXHJcblx0XHRcdGlmIChzZWxmLm9wdGlvbnMuZmllbGRzICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHR0aXRsZSA9IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aXRsZV0gOiBmaWxlbmFtZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aXRsZSA9IGZpbGVuYW1lO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoc2VsZi5vcHRpb25zLmZpZWxkcyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0ZGVzY3JpcHRpb24gPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuZGVzY3JpcHRpb25dIDogbnVsbDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkZXNjcmlwdGlvbiA9IG51bGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBmaWxlID0ge1xyXG5cdFx0XHRcdHNvdXJjZTogc291cmNlLFxyXG5cdFx0XHRcdHRpdGxlOiB0aXRsZSxcclxuXHRcdFx0XHRkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0bG9hZGVkOiB7XHJcblx0XHRcdFx0XHRtb2RhbDogZmFsc2UsXHJcblx0XHRcdFx0XHRwYW5lbDogZmFsc2UsXHJcblx0XHRcdFx0XHRpbWFnZTogZmFsc2VcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpZiAoaW5kZXggIT09IHVuZGVmaW5lZCAmJiB0aGlzLmZpbGVzW2luZGV4XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0gPSBmaWxlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRpZiAoc2VsZi5vcHRpb25zLmR1cGxpY2F0ZXMgIT09IHRydWUgJiYgdGhpcy5maW5kSW1hZ2UoZmlsZS5zb3VyY2UubW9kYWwpKSB7XHJcblx0XHRcdFx0XHRzZWxmLmV2ZW50KHNlbGYuZXZlbnRzLkRPVUJMRV9JTUFHRSwgZmlsZSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLmZpbGVzLnB1c2goZmlsZSk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuc2VydmljZSgnYXNnU2VydmljZScsIFsnJHRpbWVvdXQnLCAnJGludGVydmFsJywgJyRsb2NhdGlvbicsICckcm9vdFNjb3BlJywgJyR3aW5kb3cnLCBTZXJ2aWNlQ29udHJvbGxlcl0pO1xyXG5cclxufVxyXG5cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgVGh1bWJuYWlsQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9uczogSU9wdGlvbnM7XHJcblx0XHRwdWJsaWMgaXRlbXM6IEFycmF5PElGaWxlPjtcclxuXHRcdHB1YmxpYyBiYXNlVXJsOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ3RodW1ibmFpbCc7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlO1xyXG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgbW9kYWwgPSBmYWxzZTtcclxuXHRcdHByaXZhdGUgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihcclxuXHRcdFx0cHJpdmF0ZSBzZXJ2aWNlOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUsXHJcblx0XHRcdHByaXZhdGUgJGVsZW1lbnQ6IG5nLklSb290RWxlbWVudFNlcnZpY2UsXHJcblx0XHRcdHByaXZhdGUgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZSkge1xyXG5cclxuXHRcdFx0dGhpcy50ZW1wbGF0ZSA9ICd2aWV3cy9hc2ctdGh1bWJuYWlsLmh0bWwnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHBhcmVudCBhc2cgY29tcG9uZW50IChtb2RhbClcclxuXHRcdFx0aWYgKHRoaXMuJHNjb3BlICYmIHRoaXMuJHNjb3BlLiRwYXJlbnQgJiYgdGhpcy4kc2NvcGUuJHBhcmVudC4kcGFyZW50ICYmIHRoaXMuJHNjb3BlLiRwYXJlbnQuJHBhcmVudC4kY3RybCkge1xyXG5cdFx0XHRcdHRoaXMubW9kYWwgPSB0aGlzLiRzY29wZS4kcGFyZW50LiRwYXJlbnQuJGN0cmwudHlwZSA9PT0gJ21vZGFsJyA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCF0aGlzLm1vZGFsKSB7XHJcblx0XHRcdFx0dGhpcy4kdGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHRcdFx0XHR9LCA0MjApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldFNlbGVjdGVkKGluZGV4OiBudW1iZXIsICRldmVudD86IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5tb2RhbCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLm1vZGFsT3BlbihpbmRleCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2suc2VsZWN0KSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHByZWxvZCB3aGVuIG1vdXNlb3ZlciBhbmQgc2V0IHNlbGVjdGVkIGlmIGVuYWJsZWRcclxuXHRcdHB1YmxpYyBob3ZlcihpbmRleDogbnVtYmVyLCAkZXZlbnQ/OiBNb3VzZUV2ZW50KSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuaG92ZXIucHJlbG9hZCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5ob3Zlci5zZWxlY3QgPT09IHRydWUpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5zZXRTZWxlY3RlZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHRodW1ibmFpbCBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCk6IElPcHRpb25zVGh1bWJuYWlsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLm1vZGFsID8gdGhpcy5hc2cub3B0aW9ucy5tb2RhbFt0aGlzLnR5cGVdIDogdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdGh1bWJuYWlsIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWU6IElPcHRpb25zVGh1bWJuYWlsKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5tb2RhbCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuYXNnLm9wdGlvbnMubW9kYWxbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgYWJvdmUgZnJvbSBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgZHluYW1pYygpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5keW5hbWljID8gJ2R5bmFtaWMnIDogJyc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGF1dG9oaWRlIGFuZCBpc1NpbmdsZSA9PSB0cnVlID9cclxuXHRcdHB1YmxpYyBnZXQgYXV0b2hpZGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcuYXV0b2hpZGUgJiYgdGhpcy5hc2cuaXNTaW5nbGUgPyB0cnVlIDogZmFsc2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBjbGFzc2VzXHJcblx0XHRwdWJsaWMgZ2V0IGNsYXNzZXMoKTogc3RyaW5nIHtcclxuXHJcblx0XHRcdGxldCBzaG93O1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubW9kYWwpIHtcclxuXHRcdFx0XHRzaG93ID0gdGhpcy5hc2cubW9kYWxJbml0aWFsaXplZCA/ICdpbml0aWFsaXplZCcgOiAnaW5pdGlhbGl6aW5nJztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzaG93ID0gdGhpcy5pbml0aWFsaXplZCA/ICdpbml0aWFsaXplZCcgOiAnaW5pdGlhbGl6aW5nJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLmNsYXNzZXMgKyAnICcgKyB0aGlzLmR5bmFtaWMgKyAnICcgKyBzaG93O1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnVGh1bWJuYWlsJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsICckZWxlbWVudCcsICckdGltZW91dCcsIGFuZ3VsYXJTdXBlckdhbGxlcnkuVGh1bWJuYWlsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgZGF0YS1uZy1pZj1cIiEkY3RybC5hdXRvaGlkZVwiIGNsYXNzPVwiYXNnLXRodW1ibmFpbCB7eyAkY3RybC5jbGFzc2VzIH19XCIgbmctY2xpY2s9XCIkY3RybC5hc2cubW9kYWxDbGljaygkZXZlbnQpO1wiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQCcsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dmlzaWJsZTogJz0/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPycsXHJcblx0XHRcdGJhc2VVcmw6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIl19

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/asg-control.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.autoPlayToggle()">\r\n\t<span ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t<span ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toFirst(true)">\r\n\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toBackward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n</button>\r\n\r\n<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toForward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n</button>\r\n\r\n');
$templateCache.put('views/asg-help.html','<ul>\r\n\t<li>SPACE : forward</li>\r\n\t<li>RIGHT : forward</li>\r\n\t<li>LEFT : backward</li>\r\n\t<li>UP / HOME : first</li>\r\n\t<li>DOWN / END : last</li>\r\n\t<li>ENTER : toggle fullscreen</li>\r\n\t<li>ESC : exit</li>\r\n\t<li>p : play/pause</li>\r\n\t<li>t : change transition effect</li>\r\n\t<li>m : toggle menu</li>\r\n\t<li>s : toggle image size</li>\r\n\t<li>c : toggle caption</li>\r\n\t<li>h : toggle help</li>\r\n</ul>');
$templateCache.put('views/asg-image.html','<div class="asg-image {{ $ctrl.asg.classes }}" ng-class="{\'modalon\' : $ctrl.modalAvailable }" ng-style="{\'min-height\' : $ctrl.config.heightMin + \'px\', \'height\' : $ctrl.height + \'px\'}">\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)">\r\n\r\n\t\t<div class="img" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-show="$ctrl.asg.selected == key" ng-style="$ctrl.asg.preloadStyle(file, \'image\')" ng-class="{\'loaded\' : file.loaded.image}">\r\n\r\n\t\t\t<div class="placeholder {{ $ctrl.config.size }}" ng-style="$ctrl.asg.placeholderStyle(file, \'image\')"></div>\r\n\t\t\t<div class="source {{ $ctrl.config.size }}" ng-style="{\'background-image\': \'url(\' + file.source.image + \')\'}" ng-mouseover="$ctrl.asg.hoverPreload(key)" ng-click="$ctrl.modalOpen($event)"></div>\r\n\r\n\t\t</div>\r\n\t</div>\r\n\t<div class="arrows" ng-if="$ctrl.config.arrows.enabled" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.modalOpen($event)">\r\n\r\n\t\t<div ng-if="!$ctrl.asg.isSingle" class="toBackward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div ng-if="!$ctrl.asg.isSingle" class="toForward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t</div>\r\n\t<ng-transclude></ng-transclude>\r\n</div>\r\n\r\n\r\n\r\n');
$templateCache.put('views/asg-info.html','<div class="row">\r\n\r\n\t<div class="col-md-12">\r\n\t\t<h3>{{ $ctrl.file.title }}</h3>\r\n\t</div>\r\n\r\n\t<div class="col-md-12">\r\n\t\t{{ $ctrl.file.description }}\r\n\t\t<a target="_blank" href="{{ $ctrl.download }}"><span class="glyphicon glyphicon-download"></span></a>\r\n\t</div>\r\n\r\n</div>\r\n\r\n\r\n');
$templateCache.put('views/asg-modal.html','<div class="asg-modal {{ $ctrl.asg.classes }}" ng-class="$ctrl.getClass()" ng-click="$ctrl.imageClick($event);" ng-if="$ctrl.asg.modalVisible" ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="frame" ng-click="$ctrl.asg.modalClick($event);">\r\n\r\n\t\t<div class="header" ng-if="$ctrl.config.header.enabled" ng-click="$ctrl.asg.modalClick($event);">\r\n\r\n\t\t\t<span class="buttons visible-xs pull-right">\r\n\t\t\t\t<span ng-include="\'views/button/asg-index-xs.html\'"></span>\r\n\t\t\t</span>\r\n\r\n\t\t\t<span class="buttons hidden-xs pull-right">\r\n\t\t\t\t<span ng-repeat="item in $ctrl.config.header.buttons" ng-include="(\'views/button/asg-\' + item + \'.html\')"></span>\r\n            </span>\r\n\r\n\t\t\t<span ng-if="$ctrl.config.title">\r\n\t\t\t\t<span class="title">{{ $ctrl.config.title }}</span>\r\n\t\t\t\t<span class="subtitle hidden-xs" ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span>\r\n\t\t\t</span>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}" ng-style="{\'top\': $ctrl.marginTop + \'px\', \'bottom\': $ctrl.marginBottom + \'px\'}" ng-mouseover="$ctrl.asg.over.modalImage = true;" ng-mouseleave="$ctrl.asg.over.modalImage = false;">\r\n\r\n\t\t\t<div class="help text-right" ng-click="$ctrl.toggleHelp($event)" ng-show="$ctrl.config.help" ng-include="\'views/asg-help.html\'"></div>\r\n\r\n\t\t\t<div class="arrows" ng-if="$ctrl.config.arrows.enabled" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.imageClick($event)">\r\n\r\n\t\t\t\t<div ng-if="!$ctrl.asg.isSingle" class="toBackward">\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)" ng-click="$ctrl.toBackward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<div ng-if="!$ctrl.asg.isSingle" class="toForward">\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)" ng-click="$ctrl.toForward(true, $event)">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t</div>\r\n\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class="img" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-show="$ctrl.asg.selected == key" ng-style="$ctrl.asg.preloadStyle(file, \'modal\')" ng-class="{\'loaded\' : file.loaded.modal}">\r\n\r\n\t\t\t\t<div class="placeholder {{ $ctrl.config.size }}" ng-style="$ctrl.asg.placeholderStyle(file, \'modal\')"></div>\r\n\t\t\t\t<div class="source {{ $ctrl.config.size }}" ng-if="file.loaded.modal" ng-style="{\'background-image\': \'url(\' + file.source.modal + \')\'}">\r\n\t\t\t\t</div>\r\n\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class="caption {{ $ctrl.config.caption.position }}" ng-show="!$ctrl.config.caption.disabled" ng-class="{\'visible\' : $ctrl.config.caption.visible}">\r\n\t\t\t\t<div class="content">\r\n\t\t\t\t\t<span class="title">{{ $ctrl.asg.file.title }}</span>\r\n\t\t\t\t\t<span ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description"> - </span>\r\n\t\t\t\t\t<span class="description">{{ $ctrl.asg.file.description }}</span>\r\n\t\t\t\t\t<a ng-if="$ctrl.config.caption.download" href="{{ $ctrl.asg.downloadLink() }}" target="_blank" class="btn btn-default btn-xs">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-download"></span> Download\r\n\t\t\t\t\t</a>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\r\n\t\t</div>\r\n\r\n\t\t<ng-transclude></ng-transclude>\r\n\r\n\t</div>\r\n\r\n</div>\r\n');
$templateCache.put('views/asg-panel.html','<div class="items">\r\n\t<div class="item {{ $ctrl.asg.options.panel.item.class }}" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-style="{\'background-color\': file.source.color}" ng-class="{\'selected\' : $ctrl.asg.selected == key}">\r\n\r\n\t\t<img ng-src="{{ file.source.panel }}" ng-click="$ctrl.setSelected(key, $event)" alt="{{ file.title }}">\r\n\r\n\t\t<span class="index" ng-if="$ctrl.config.item.index">{{ key + 1 }}</span>\r\n\r\n\t\t<div class="caption" ng-if="$ctrl.config.item.caption">\r\n\t\t\t<span>{{ file.title }}</span>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n');
$templateCache.put('views/asg-thumbnail.html','<div class="items">\r\n\t<div class="item" ng-click="$ctrl.setSelected(key, $event)" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-style="{\'background-color\': file.source.color}" ng-class="{\'selected\' : $ctrl.asg.selected == key}">\r\n\r\n\t\t<img ng-src="{{ file.source.panel }}" ng-style="{\'height\': $ctrl.config.height + \'px\'}" alt="{{ file.title }}">\r\n\r\n\t\t<span class="index" ng-if="$ctrl.config.index">{{ key + 1 }}</span>\r\n\r\n\t</div>\r\n</div>\r\n');
$templateCache.put('views/button/asg-close.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.close($event)">\r\n\t<span class="glyphicon glyphicon-remove"></span>\r\n</button>');
$templateCache.put('views/button/asg-fullscreen.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleFullScreen($event)">\r\n\t<span class="glyphicon glyphicon-fullscreen"></span>\r\n</button>');
$templateCache.put('views/button/asg-help.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleHelp($event)">\r\n\t<span class="glyphicon glyphicon-question-sign"></span>\r\n</button>');
$templateCache.put('views/button/asg-index-xs.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs">\r\n\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n</button>');
$templateCache.put('views/button/asg-index.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toFirst(true, $event)">\r\n\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n</button>');
$templateCache.put('views/button/asg-next.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toForward(true, $event)">\r\n\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n</button>');
$templateCache.put('views/button/asg-pin.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleMenu($event)">\r\n\t<span ng-if="!$ctrl.config.header.dynamic" class="glyphicon glyphicon-chevron-up"></span>\r\n\t<span ng-if="$ctrl.config.header.dynamic" class="glyphicon glyphicon-chevron-down"></span>\r\n</button>\r\n');
$templateCache.put('views/button/asg-playstop.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.autoPlayToggle($event)">\r\n\t<span ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t<span ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n</button>');
$templateCache.put('views/button/asg-prev.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toBackward(true, $event)">\r\n\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n</button>');
$templateCache.put('views/button/asg-size.html','<button class="btn btn-default btn-sm btn-size" ng-click="$ctrl.toggleSize($event)">\r\n\t{{ $ctrl.config.size }}\r\n</button>');
$templateCache.put('views/button/asg-thumbnails.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toggleThumbnails($event)">\r\n\t<span class="glyphicon glyphicon-option-horizontal"></span>\r\n</button>');
$templateCache.put('views/button/asg-transition.html','<button class="btn btn-default btn-sm hidden-xs btn-transitions" data-ng-if="!$ctrl.asg.isSingle" data-ng-click="$ctrl.nextTransition($event)">\r\n\t{{ $ctrl.config.transition }}\r\n</button>');}]);