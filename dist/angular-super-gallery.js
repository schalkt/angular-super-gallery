/**
 * angular-super-gallery - AngularJS Super Gallery
 * 
 * @version v2.0.11
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
            this.template = '/views/asg-control.html';
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
    var DebugController = (function () {
        function DebugController(service, $scope) {
            this.service = service;
            this.$scope = $scope;
            this.type = 'info';
            this.template = '/views/asg-debug.html';
        }
        DebugController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this);
        };
        Object.defineProperty(DebugController.prototype, "file", {
            get: function () {
                return this.asg.file;
            },
            enumerable: true,
            configurable: true
        });
        return DebugController;
    }());
    angularSuperGallery.DebugController = DebugController;
    var app = angular.module('angularSuperGallery');
    app.component('asgDebug', {
        controller: ['asgService', '$scope', angularSuperGallery.DebugController],
        template: '<div class="asg-debug {{ $ctrl.asg.classes }}"><div ng-include="$ctrl.template"></div></div>',
        transclude: true,
        bindings: {
            id: '@?',
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
        templateUrl: '/views/asg-image.html',
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
            this.template = '/views/asg-info.html';
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
            this.exitFullScreen();
        };
        ModalController.prototype.imageClick = function ($event) {
            this.asg.modalClick($event);
            if (this.config.click.close) {
                this.asg.modalClose();
                this.exitFullScreen();
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
            if (!this.$window.screenfull) {
                return;
            }
            this.$window.screenfull.toggle();
        };
        ModalController.prototype.exitFullScreen = function () {
            if (!this.$window.screenfull) {
                return;
            }
            if (!this.$window.screenfull.isFullscreen) {
                return;
            }
            this.$window.screenfull.exit();
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
        templateUrl: '/views/asg-modal.html',
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
            this.template = '/views/asg-panel.html';
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
            this.version = "2.1.1";
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
                    subtitle: 'subtitle',
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
                    transitionSpeed: 0.7,
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
                    items: {
                        class: 'row',
                    },
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
                    transitionSpeed: 0.7,
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
        ServiceController.prototype.dynamicStyle = function (file, type, config) {
            var style = {};
            if (file.source.color) {
                style['background-color'] = file.source.color;
            }
            if (this.options.loadingImage && file.loaded[type] === false) {
                style['background-image'] = 'url(' + this.options.loadingImage + ')';
            }
            if (config.transitionSpeed !== undefined && config.transitionSpeed !== null) {
                style['transition'] = 'all ease ' + config.transitionSpeed + 's';
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
                    angular.element(element)[0]['focus']();
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
                if (edit.selected == -1) {
                    selected = _this.files.length - 1;
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
            var title, subtitle, description;
            if (self.options.fields !== undefined) {
                title = value[self.options.fields.title] ? value[self.options.fields.title] : filename;
                subtitle = value[self.options.fields.subtitle] ? value[self.options.fields.subtitle] : null;
                description = value[self.options.fields.description] ? value[self.options.fields.description] : null;
            }
            else {
                title = filename;
                subtitle = null;
                description = null;
            }
            var file = {
                source: source,
                title: title,
                subtitle: subtitle,
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
            this.template = '/views/asg-thumbnail.html';
        }
        ThumbnailController.prototype.$onInit = function () {
            var _this = this;
            this.asg = this.service.getInstance(this);
            if (this.$scope && this.$scope.$parent && this.$scope.$parent.$parent && this.$scope.$parent.$parent['$ctrl']) {
                this.modal = this.$scope.$parent.$parent['$ctrl'].type === 'modal' ? true : false;
            }
            if (!this.modal) {
                this.$timeout(function () {
                    _this.initialized = true;
                }, 640);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzZy50cyIsImFzZy1jb250cm9sLnRzIiwiYXNnLWRlYnVnLnRzIiwiYXNnLWltYWdlLnRzIiwiYXNnLWluZm8udHMiLCJhc2ctbW9kYWwudHMiLCJhc2ctcGFuZWwudHMiLCJhc2ctc2VydmljZS50cyIsImFzZy10aHVtYm5haWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBVSxtQkFBbUIsQ0EyQjVCO0FBM0JELFdBQVUsbUJBQW1CO0lBRTVCLElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFdkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDdEIsT0FBTyxVQUFVLEtBQVcsRUFBRSxTQUFrQjtZQUUvQyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDakQsT0FBTyxFQUFFLENBQUM7YUFDVjtZQUVELElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtnQkFDaEIsT0FBTyxHQUFHLENBQUM7YUFDWDtZQUVELElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxFQUFFO2dCQUNyQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO2FBQ2Q7WUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FB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bUJBQW1CLEtBQW5CLG1CQUFtQixRQStKNUIiLCJmaWxlIjoiYW5ndWxhci1zdXBlci1nYWxsZXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScsIFsnbmdBbmltYXRlJywgJ25nVG91Y2gnXSk7XHJcblxyXG5cdGFwcC5maWx0ZXIoJ2FzZ0J5dGVzJywgKCkgPT4ge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChieXRlcyA6IGFueSwgcHJlY2lzaW9uIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRpZiAoaXNOYU4ocGFyc2VGbG9hdChieXRlcykpIHx8ICFpc0Zpbml0ZShieXRlcykpIHtcclxuXHRcdFx0XHRyZXR1cm4gJyc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChieXRlcyA9PT0gMCkge1xyXG5cdFx0XHRcdHJldHVybiAnMCc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0eXBlb2YgcHJlY2lzaW9uID09PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdHByZWNpc2lvbiA9IDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCB1bml0cyA9IFsnYnl0ZXMnLCAna0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInXSxcclxuXHRcdFx0XHRudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgubG9nKGJ5dGVzKSAvIE1hdGgubG9nKDEwMjQpKTtcclxuXHJcblx0XHRcdHJldHVybiAoYnl0ZXMgLyBNYXRoLnBvdygxMDI0LCBNYXRoLmZsb29yKG51bWJlcikpKS50b0ZpeGVkKHByZWNpc2lvbikgKyAnICcgKyB1bml0c1tudW1iZXJdO1xyXG5cclxuXHRcdH07XHJcblx0fSk7XHJcblxyXG59XHJcblxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBDb250cm9sQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIHR5cGUgPSAnY29udHJvbCc7XHJcblx0XHRwcml2YXRlIGFzZzogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZTtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihcclxuXHRcdFx0cHJpdmF0ZSBzZXJ2aWNlOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBJU2NvcGUpIHtcclxuXHJcblx0XHRcdHRoaXMudGVtcGxhdGUgPSAnL3ZpZXdzL2FzZy1jb250cm9sLmh0bWwnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdFx0dGhpcy4kc2NvcGUuZm9yd2FyZCA9ICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQodHJ1ZSk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR0aGlzLiRzY29wZS5iYWNrd2FyZCA9ICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IGltYWdlIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKTogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZTogSU9wdGlvbnNJbWFnZSkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0NvbnRyb2wnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5Db250cm9sQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctY29udHJvbCB7eyAkY3RybC5hc2cuY2xhc3NlcyB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgRGVidWdDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcclxuXHRcdHByaXZhdGUgYXNnOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblx0XHRwcml2YXRlIHR5cGU7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKFxyXG5cdFx0XHRwcml2YXRlIHNlcnZpY2U6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0cHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdFx0dGhpcy50eXBlID0gJ2luZm8nO1xyXG5cdFx0XHR0aGlzLnRlbXBsYXRlID0gJy92aWV3cy9hc2ctZGVidWcuaHRtbCc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLmZpbGU7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0RlYnVnJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuRGVidWdDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImFzZy1kZWJ1ZyB7eyAkY3RybC5hc2cuY2xhc3NlcyB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgSW1hZ2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmwgOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ2ltYWdlJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHJvb3RTY29wZSA6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkZWxlbWVudCA6IG5nLklSb290RWxlbWVudFNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICR3aW5kb3cgOiBuZy5JV2luZG93U2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCgncmVzaXplJywgKGV2ZW50KSA9PiB7XHJcblx0XHRcdFx0dGhpcy5vblJlc2l6ZSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBvblJlc2l6ZSgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5oZWlnaHRBdXRvLm9ucmVzaXplKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRIZWlnaHQodGhpcy5hc2cuZmlsZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHRcdC8vIHNldCBpbWFnZSBjb21wb25lbnQgaGVpZ2h0XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kb24odGhpcy5hc2cuZXZlbnRzLkZJUlNUX0lNQUdFICsgdGhpcy5pZCwgKGV2ZW50LCBkYXRhKSA9PiB7XHJcblxyXG5cdFx0XHRcdGlmICghdGhpcy5jb25maWcuaGVpZ2h0ICYmIHRoaXMuY29uZmlnLmhlaWdodEF1dG8uaW5pdGlhbCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRIZWlnaHQoZGF0YS5pbWcpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5hc2cudGh1bWJuYWlsc01vdmUoMjAwKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gc2NvcGUgYXBwbHkgd2hlbiBpbWFnZSBsb2FkZWRcclxuXHRcdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmFzZy5ldmVudHMuTE9BRF9JTUFHRSArIHRoaXMuaWQsIChldmVudCwgZGF0YSkgPT4ge1xyXG5cclxuXHRcdFx0XHR0aGlzLiRzY29wZS4kYXBwbHkoKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29tcG9uZW50IGhlaWdodFxyXG5cdFx0cHJpdmF0ZSBzZXRIZWlnaHQoaW1nKSB7XHJcblxyXG5cdFx0XHRsZXQgd2lkdGggPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCdkaXYnKVswXS5jbGllbnRXaWR0aDtcclxuXHRcdFx0bGV0IHJhdGlvID0gaW1nLndpZHRoIC8gaW1nLmhlaWdodDtcclxuXHRcdFx0dGhpcy5jb25maWcuaGVpZ2h0ID0gd2lkdGggLyByYXRpbztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaGVpZ2h0XHJcblx0XHRwdWJsaWMgZ2V0IGhlaWdodCgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5oZWlnaHQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zSW1hZ2UpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9CYWNrd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHRpZiAoJGV2ZW50KSB7XHJcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHN0b3ApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICgkZXZlbnQpIHtcclxuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGhvdmVyKGluZGV4IDogbnVtYmVyLCAkZXZlbnQ/IDogTW91c2VFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmFycm93cy5wcmVsb2FkID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuaG92ZXJQcmVsb2FkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG1vZGFsIGF2YWlsYWJsZVxyXG5cdFx0cHVibGljIGdldCBtb2RhbEF2YWlsYWJsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5tb2RhbEF2YWlsYWJsZSAmJiB0aGlzLmNvbmZpZy5jbGljay5tb2RhbDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3BlbiB0aGUgbW9kYWxcclxuXHRcdHB1YmxpYyBtb2RhbE9wZW4oJGV2ZW50IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKCRldmVudCkge1xyXG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLm1vZGFsKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxPcGVuKHRoaXMuYXNnLnNlbGVjdGVkKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0ltYWdlJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnJGVsZW1lbnQnLCAnJHdpbmRvdycsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LkltYWdlQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hc2ctaW1hZ2UuaHRtbCcsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgSW5mb0NvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZDogc3RyaW5nO1xyXG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgdHlwZTtcclxuXHRcdHByaXZhdGUgdGVtcGxhdGU7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IoXHJcblx0XHRcdHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRwcml2YXRlICRzY29wZTogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHR0aGlzLnR5cGUgPSAnaW5mbyc7XHJcblx0XHRcdHRoaXMudGVtcGxhdGUgPSAnL3ZpZXdzL2FzZy1pbmZvLmh0bWwnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgZ2V0IGZpbGUoKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5maWxlO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dJbmZvJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuSW5mb0NvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYXNnLWluZm8ge3sgJGN0cmwuYXNnLmNsYXNzZXMgfX1cIj48ZGl2IG5nLWluY2x1ZGU9XCIkY3RybC50ZW1wbGF0ZVwiPjwvZGl2PjwvZGl2PicsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIE1vZGFsQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHRcdHB1YmxpYyBiYXNlVXJsIDogc3RyaW5nO1xyXG5cclxuXHRcdHByaXZhdGUgdHlwZSA9ICdtb2RhbCc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgYXJyb3dzVmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHdpbmRvdyA6IG5nLklXaW5kb3dTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkcm9vdFNjb3BlIDogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICRzY29wZSA6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHRcdFx0dGhpcy5hc2cubW9kYWxBdmFpbGFibGUgPSB0cnVlO1xyXG5cclxuXHRcdFx0Ly8gc2NvcGUgYXBwbHkgd2hlbiBpbWFnZSBsb2FkZWRcclxuXHRcdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmFzZy5ldmVudHMuTE9BRF9JTUFHRSArIHRoaXMuaWQsIChldmVudCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuJHNjb3BlLiRhcHBseSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgZ2V0Q2xhc3MoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuY29uZmlnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgbmdDbGFzcyA9IFtdO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhlYWRlci5keW5hbWljKSB7XHJcblx0XHRcdFx0bmdDbGFzcy5wdXNoKCdkeW5hbWljJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5nQ2xhc3MucHVzaCh0aGlzLmFzZy5vcHRpb25zLnRoZW1lKTtcclxuXHJcblx0XHRcdHJldHVybiBuZ0NsYXNzLmpvaW4oJyAnKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGFjdGlvbiBmcm9tIGtleWNvZGVzXHJcblx0XHRwcml2YXRlIGdldEFjdGlvbkJ5S2V5Q29kZShrZXlDb2RlIDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmtleWNvZGVzKTtcclxuXHRcdFx0bGV0IGFjdGlvbjtcclxuXHJcblx0XHRcdGZvciAobGV0IGtleSBpbiBrZXlzKSB7XHJcblxyXG5cdFx0XHRcdGxldCBjb2RlcyA9IHRoaXMuY29uZmlnLmtleWNvZGVzW2tleXNba2V5XV07XHJcblxyXG5cdFx0XHRcdGlmICghY29kZXMpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGluZGV4ID0gY29kZXMuaW5kZXhPZihrZXlDb2RlKTtcclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcclxuXHRcdFx0XHRcdGFjdGlvbiA9IGtleXNba2V5XTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBhY3Rpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgY2xvc2UoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbG9zZSgpO1xyXG5cdFx0XHR0aGlzLmV4aXRGdWxsU2NyZWVuKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBpbWFnZUNsaWNrKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2suY2xvc2UpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbENsb3NlKCk7XHJcblx0XHRcdFx0dGhpcy5leGl0RnVsbFNjcmVlbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBob3ZlcihpbmRleCA6IG51bWJlciwgJGV2ZW50PyA6IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5hcnJvd3MucHJlbG9hZCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHNldEZvY3VzKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBhdXRvUGxheVRvZ2dsZSgkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy5hdXRvUGxheVRvZ2dsZSgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9GaXJzdChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnRvRmlyc3QoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvQmFja3dhcmQoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHN0b3ApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHN0b3ApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9MYXN0KHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cudG9MYXN0KHN0b3ApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBkbyBrZXlib2FyZCBhY3Rpb25cclxuXHRcdHB1YmxpYyBrZXlVcChlIDogS2V5Ym9hcmRFdmVudCkge1xyXG5cclxuXHRcdFx0bGV0IGFjdGlvbiA6IHN0cmluZyA9IHRoaXMuZ2V0QWN0aW9uQnlLZXlDb2RlKGUua2V5Q29kZSk7XHJcblxyXG5cdFx0XHRzd2l0Y2ggKGFjdGlvbikge1xyXG5cclxuXHRcdFx0XHRjYXNlICdleGl0JzpcclxuXHRcdFx0XHRcdHRoaXMuY2xvc2UoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdwbGF5cGF1c2UnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cuYXV0b1BsYXlUb2dnbGUoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdmb3J3YXJkJzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdiYWNrd2FyZCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2ZpcnN0JzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvRmlyc3QodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnbGFzdCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0xhc3QodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnZnVsbHNjcmVlbic6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUZ1bGxTY3JlZW4oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdtZW51JzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTWVudSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2NhcHRpb24nOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVDYXB0aW9uKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnaGVscCc6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUhlbHAoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdzaXplJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlU2l6ZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3RyYW5zaXRpb24nOlxyXG5cdFx0XHRcdFx0dGhpcy5uZXh0VHJhbnNpdGlvbigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy5sb2coJ3Vua25vd24ga2V5Ym9hcmQgYWN0aW9uOiAnICsgZS5rZXlDb2RlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gc3dpdGNoIHRvIG5leHQgdHJhbnNpdGlvbiBlZmZlY3RcclxuXHRcdHByaXZhdGUgbmV4dFRyYW5zaXRpb24oJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0bGV0IGlkeCA9IHRoaXMuYXNnLnRyYW5zaXRpb25zLmluZGV4T2YodGhpcy5jb25maWcudHJhbnNpdGlvbikgKyAxO1xyXG5cdFx0XHRsZXQgbmV4dCA9IGlkeCA+PSB0aGlzLmFzZy50cmFuc2l0aW9ucy5sZW5ndGggPyAwIDogaWR4O1xyXG5cdFx0XHR0aGlzLmNvbmZpZy50cmFuc2l0aW9uID0gdGhpcy5hc2cudHJhbnNpdGlvbnNbbmV4dF07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBmdWxsc2NyZWVuXHJcblx0XHRwcml2YXRlIHRvZ2dsZUZ1bGxTY3JlZW4oJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHRcdGlmICghdGhpcy4kd2luZG93LnNjcmVlbmZ1bGwpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsLnRvZ2dsZSgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBleGl0IGZ1bGxzY3JlZW5cclxuXHRcdHByaXZhdGUgZXhpdEZ1bGxTY3JlZW4oKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsLmlzRnVsbHNjcmVlbikge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwuZXhpdCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgdGh1bWJuYWlsc1xyXG5cdFx0cHJpdmF0ZSB0b2dnbGVUaHVtYm5haWxzKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuY29uZmlnLnRodW1ibmFpbC5keW5hbWljID0gIXRoaXMuY29uZmlnLnRodW1ibmFpbC5keW5hbWljO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdHJhbnNpdGlvbiBlZmZlY3RcclxuXHRcdHB1YmxpYyBzZXRUcmFuc2l0aW9uKHRyYW5zaXRpb24sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuY29uZmlnLnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdGhlbWVcclxuXHRcdHB1YmxpYyBzZXRUaGVtZSh0aGVtZSA6IHN0cmluZywgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cub3B0aW9ucy50aGVtZSA9IHRoZW1lO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgaGVscFxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVIZWxwKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuY29uZmlnLmhlbHAgPSAhdGhpcy5jb25maWcuaGVscDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIHNpemVcclxuXHRcdHByaXZhdGUgdG9nZ2xlU2l6ZSgkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHRsZXQgaW5kZXggPSB0aGlzLmFzZy5zaXplcy5pbmRleE9mKHRoaXMuY29uZmlnLnNpemUpO1xyXG5cdFx0XHRpbmRleCA9IChpbmRleCArIDEpID49IHRoaXMuYXNnLnNpemVzLmxlbmd0aCA/IDAgOiArK2luZGV4O1xyXG5cdFx0XHR0aGlzLmNvbmZpZy5zaXplID0gdGhpcy5hc2cuc2l6ZXNbaW5kZXhdO1xyXG5cdFx0XHR0aGlzLmFzZy5sb2coJ3RvZ2dsZSBpbWFnZSBzaXplOicsIFt0aGlzLmNvbmZpZy5zaXplLCBpbmRleF0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgbWVudVxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVNZW51KCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuY29uZmlnLmhlYWRlci5keW5hbWljID0gIXRoaXMuY29uZmlnLmhlYWRlci5keW5hbWljO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgY2FwdGlvblxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVDYXB0aW9uKCkge1xyXG5cclxuXHRcdFx0dGhpcy5jb25maWcuY2FwdGlvbi52aXNpYmxlID0gIXRoaXMuY29uZmlnLmNhcHRpb24udmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1hcmdpbnQgdG9wXHJcblx0XHRwdWJsaWMgZ2V0IG1hcmdpblRvcCgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5tYXJnaW5Ub3A7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtYXJnaW4gYm90dG9tXHJcblx0XHRwdWJsaWMgZ2V0IG1hcmdpbkJvdHRvbSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5tYXJnaW5Cb3R0b207XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtb2RhbCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgZ2V0IHZpc2libGUoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cubW9kYWxWaXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgbW9kYWwgdmlzaWJsZVxyXG5cdFx0cHVibGljIHNldCB2aXNpYmxlKHZhbHVlIDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxWaXNpYmxlID0gdmFsdWU7XHJcblx0XHRcdHRoaXMuYXNnLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbW9kYWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNNb2RhbCB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgbW9kYWwgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zTW9kYWwpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dNb2RhbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckd2luZG93JywgJyRyb290U2NvcGUnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5Nb2RhbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXNnLW1vZGFsLmh0bWwnLFxyXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PycsXHJcblx0XHRcdGJhc2VVcmw6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgUGFuZWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtczogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmw6IHN0cmluZztcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgPSAncGFuZWwnO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZTtcclxuXHRcdHByaXZhdGUgYXNnOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IoXHJcblx0XHRcdHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRwcml2YXRlICRzY29wZTogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHR0aGlzLnRlbXBsYXRlID0gJy92aWV3cy9hc2ctcGFuZWwuaHRtbCc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldFNlbGVjdGVkKGluZGV4OiBudW1iZXIsICRldmVudD86IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5tb2RhbCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLm1vZGFsT3BlbihpbmRleCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2suc2VsZWN0KSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBob3ZlcihpbmRleDogbnVtYmVyLCAkZXZlbnQ/OiBNb3VzZUV2ZW50KSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuaG92ZXIucHJlbG9hZCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5ob3Zlci5zZWxlY3QgPT09IHRydWUpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5zZXRTZWxlY3RlZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHBhbmVsIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKTogSU9wdGlvbnNQYW5lbCB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgcGFuZWwgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZTogSU9wdGlvbnNQYW5lbCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnUGFuZWwnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5QYW5lbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYXNnLXBhbmVsIHt7ICRjdHJsLmFzZy5jbGFzc2VzIH19XCIgbmctbW91c2VvdmVyPVwiJGN0cmwuYXNnLm92ZXIucGFuZWwgPSB0cnVlO1wiIG5nLW1vdXNlbGVhdmU9XCIkY3RybC5hc2cub3Zlci5wYW5lbCA9IGZhbHNlO1wiIG5nLXNob3c9XCIkY3RybC5jb25maWcudmlzaWJsZVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPjwvZGl2PicsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAJyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR2aXNpYmxlOiAnPT8nLFxyXG5cdFx0XHR0ZW1wbGF0ZTogJ0A/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdC8vIG1vZGFsIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc01vZGFsIHtcclxuXHJcblx0XHRoZWFkZXI/OiB7XHJcblx0XHRcdGVuYWJsZWQ/OiBib29sZWFuO1xyXG5cdFx0XHRkeW5hbWljPzogYm9vbGVhbjtcclxuXHRcdFx0YnV0dG9uczogQXJyYXk8c3RyaW5nPjtcclxuXHRcdH07XHJcblx0XHRoZWxwPzogYm9vbGVhbjtcclxuXHRcdGNhcHRpb24/OiB7XHJcblx0XHRcdGRpc2FibGVkPzogYm9vbGVhbjtcclxuXHRcdFx0dmlzaWJsZT86IGJvb2xlYW47XHJcblx0XHRcdHBvc2l0aW9uPzogc3RyaW5nO1xyXG5cdFx0XHRkb3dubG9hZD86IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0cGxhY2Vob2xkZXI/OiBzdHJpbmc7XHJcblx0XHR0cmFuc2l0aW9uPzogc3RyaW5nO1xyXG5cdFx0dHJhbnNpdGlvblNwZWVkPyA6IG51bWJlcjtcclxuXHRcdHRpdGxlPzogc3RyaW5nO1xyXG5cdFx0c3VidGl0bGU/OiBzdHJpbmc7XHJcblx0XHR0aXRsZUZyb21JbWFnZT8gOiBib29sZWFuO1xyXG5cdFx0c3VidGl0bGVGcm9tSW1hZ2U/IDogYm9vbGVhbjtcclxuXHRcdGFycm93cz86IHtcclxuXHRcdFx0cHJlbG9hZD86IGJvb2xlYW47XHJcblx0XHRcdGVuYWJsZWQ/OiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHRcdHNpemU/OiBzdHJpbmc7XHJcblx0XHR0aHVtYm5haWw/OiBJT3B0aW9uc1RodW1ibmFpbDtcclxuXHRcdG1hcmdpblRvcD86IG51bWJlcjtcclxuXHRcdG1hcmdpbkJvdHRvbT86IG51bWJlcjtcclxuXHRcdGNsaWNrPzoge1xyXG5cdFx0XHRjbG9zZTogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRrZXljb2Rlcz86IHtcclxuXHRcdFx0ZXhpdD86IEFycmF5PG51bWJlcj47XHJcblx0XHRcdHBsYXlwYXVzZT86IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGZvcndhcmQ/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRiYWNrd2FyZD86IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGZpcnN0PzogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0bGFzdD86IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGZ1bGxzY3JlZW4/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRtZW51PzogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0Y2FwdGlvbj86IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGhlbHA/OiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRzaXplPzogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0dHJhbnNpdGlvbj86IEFycmF5PG51bWJlcj47XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Ly8gcGFuZWwgY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zUGFuZWwge1xyXG5cclxuXHRcdHZpc2libGU/OiBib29sZWFuO1xyXG5cdFx0aXRlbXM/OiB7XHJcblx0XHRcdGNsYXNzPzogc3RyaW5nO1xyXG5cdFx0fSxcclxuXHRcdGl0ZW0/OiB7XHJcblx0XHRcdGNsYXNzPzogc3RyaW5nO1xyXG5cdFx0XHRjYXB0aW9uOiBib29sZWFuO1xyXG5cdFx0XHRpbmRleDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRob3Zlcj86IHtcclxuXHRcdFx0cHJlbG9hZDogYm9vbGVhbjtcclxuXHRcdFx0c2VsZWN0OiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHRcdGNsaWNrPzoge1xyXG5cdFx0XHRzZWxlY3Q6IGJvb2xlYW47XHJcblx0XHRcdG1vZGFsOiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHQvLyB0aHVtYm5haWwgY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zVGh1bWJuYWlsIHtcclxuXHJcblx0XHRoZWlnaHQ/OiBudW1iZXI7XHJcblx0XHRpbmRleD86IGJvb2xlYW47XHJcblx0XHRlbmFibGVkPzogYm9vbGVhbjtcclxuXHRcdGR5bmFtaWM/OiBib29sZWFuO1xyXG5cdFx0YXV0b2hpZGU6IGJvb2xlYW47XHJcblx0XHRjbGljaz86IHtcclxuXHRcdFx0c2VsZWN0OiBib29sZWFuO1xyXG5cdFx0XHRtb2RhbDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRob3Zlcj86IHtcclxuXHRcdFx0cHJlbG9hZDogYm9vbGVhbjtcclxuXHRcdFx0c2VsZWN0OiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHQvLyBpbmZvIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0luZm8ge1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHR0cmFuc2l0aW9uPzogc3RyaW5nO1xyXG5cdFx0dHJhbnNpdGlvblNwZWVkPyA6IG51bWJlcjtcclxuXHRcdHNpemU/OiBzdHJpbmc7XHJcblx0XHRhcnJvd3M/OiB7XHJcblx0XHRcdHByZWxvYWQ/OiBib29sZWFuO1xyXG5cdFx0XHRlbmFibGVkPzogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRjbGljaz86IHtcclxuXHRcdFx0bW9kYWw6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0aGVpZ2h0PzogbnVtYmVyO1xyXG5cdFx0aGVpZ2h0TWluPzogbnVtYmVyO1xyXG5cdFx0aGVpZ2h0QXV0bz86IHtcclxuXHRcdFx0aW5pdGlhbD86IGJvb2xlYW47XHJcblx0XHRcdG9ucmVzaXplPzogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRwbGFjZWhvbGRlcjogc3RyaW5nO1xyXG5cdH1cclxuXHJcblx0Ly8gZ2FsbGVyeSBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9ucyB7XHJcblxyXG5cdFx0ZGVidWc/OiBib29sZWFuO1xyXG5cdFx0YmFzZVVybD86IHN0cmluZztcclxuXHRcdGhhc2hVcmw/OiBib29sZWFuO1xyXG5cdFx0ZHVwbGljYXRlcz86IGJvb2xlYW47XHJcblx0XHRzZWxlY3RlZD86IG51bWJlcjtcclxuXHRcdGZpZWxkcz86IHtcclxuXHRcdFx0c291cmNlPzoge1xyXG5cdFx0XHRcdG1vZGFsPzogc3RyaW5nO1xyXG5cdFx0XHRcdHBhbmVsPzogc3RyaW5nO1xyXG5cdFx0XHRcdGltYWdlPzogc3RyaW5nO1xyXG5cdFx0XHRcdHBsYWNlaG9sZGVyPzogc3RyaW5nO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRpdGxlPzogc3RyaW5nO1xyXG5cdFx0XHRzdWJ0aXRsZT86IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb24/OiBzdHJpbmc7XHJcblx0XHRcdHRodW1ibmFpbD86IHN0cmluZztcclxuXHRcdH07XHJcblx0XHRhdXRvcGxheT86IHtcclxuXHRcdFx0ZW5hYmxlZD86IGJvb2xlYW47XHJcblx0XHRcdGRlbGF5PzogbnVtYmVyO1xyXG5cdFx0fTtcclxuXHRcdHRoZW1lPzogc3RyaW5nO1xyXG5cdFx0cHJlbG9hZD86IEFycmF5PG51bWJlcj47XHJcblx0XHRwcmVsb2FkTmV4dD86IGJvb2xlYW47XHJcblx0XHRwcmVsb2FkRGVsYXk/OiBudW1iZXI7XHJcblx0XHRsb2FkaW5nSW1hZ2U/OiBzdHJpbmc7XHJcblx0XHRtb2RhbD86IElPcHRpb25zTW9kYWw7XHJcblx0XHRwYW5lbD86IElPcHRpb25zUGFuZWw7XHJcblx0XHRpbWFnZT86IElPcHRpb25zSW1hZ2U7XHRcdFxyXG5cdFx0dGh1bWJuYWlsPzogSU9wdGlvbnNUaHVtYm5haWw7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gaW1hZ2Ugc291cmNlXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJU291cmNlIHtcclxuXHJcblx0XHRtb2RhbDogc3RyaW5nOyAvLyBvcmlnaW5hbCwgcmVxdWlyZWRcclxuXHRcdHBhbmVsPzogc3RyaW5nO1xyXG5cdFx0aW1hZ2U/OiBzdHJpbmc7XHJcblx0XHRjb2xvcj86IHN0cmluZztcclxuXHRcdHBsYWNlaG9sZGVyPzogc3RyaW5nO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGZpbGVcclxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWxlIHtcclxuXHJcblx0XHRzb3VyY2U6IElTb3VyY2U7XHJcblx0XHR0aXRsZT86IHN0cmluZztcclxuXHRcdHN1YnRpdGxlPzogc3RyaW5nO1xyXG5cdFx0bmFtZT86IHN0cmluZztcclxuXHRcdGV4dGVuc2lvbj86IHN0cmluZztcclxuXHRcdGRlc2NyaXB0aW9uPzogc3RyaW5nO1xyXG5cdFx0ZG93bmxvYWQ/OiBzdHJpbmc7XHJcblx0XHRsb2FkZWQ/OiB7XHJcblx0XHRcdG1vZGFsPzogYm9vbGVhbjtcclxuXHRcdFx0cGFuZWw/OiBib29sZWFuO1xyXG5cdFx0XHRpbWFnZT86IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0d2lkdGg/OiBudW1iZXI7XHJcblx0XHRoZWlnaHQ/OiBudW1iZXI7XHJcblxyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3ZlciB7XHJcblx0XHRtb2RhbEltYWdlOiBib29sZWFuO1xyXG5cdFx0cGFuZWw6IGJvb2xlYW47XHJcblx0fVxyXG5cclxuXHRleHBvcnQgaW50ZXJmYWNlIElFZGl0IHtcclxuXHRcdGlkOiBudW1iZXI7XHJcblx0XHRkZWxldGU/OiBudW1iZXI7XHJcblx0XHRhZGQ/OiBBcnJheTxJRmlsZT47XHJcblx0XHR1cGRhdGU/OiBBcnJheTxJRmlsZT47XHJcblx0XHRyZWZyZXNoPzogYm9vbGVhbjtcclxuXHRcdHNlbGVjdGVkPzogbnVtYmVyO1xyXG5cdFx0b3B0aW9ucz86IElPcHRpb25zO1xyXG5cdFx0ZGVsYXlUaHVtYm5haWxzPzogbnVtYmVyO1xyXG5cdFx0ZGVsYXlSZWZyZXNoPzogbnVtYmVyO1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJU2NvcGUgZXh0ZW5kcyBuZy5JU2NvcGUge1xyXG5cdFx0Zm9yd2FyZDogKCkgPT4gdm9pZDtcclxuXHRcdGJhY2t3YXJkOiAoKSA9PiB2b2lkO1xyXG5cdH1cclxuXHJcblx0Ly8gc2VydmljZSBjb250cm9sbGVyIGludGVyZmFjZVxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVNlcnZpY2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRtb2RhbFZpc2libGU6IGJvb2xlYW47XHJcblx0XHRwYW5lbFZpc2libGU6IGJvb2xlYW47XHJcblx0XHRtb2RhbEF2YWlsYWJsZTogYm9vbGVhbjtcclxuXHRcdG1vZGFsSW5pdGlhbGl6ZWQ6IGJvb2xlYW47XHJcblx0XHR0cmFuc2l0aW9uczogQXJyYXk8c3RyaW5nPjtcclxuXHRcdHRoZW1lczogQXJyYXk8c3RyaW5nPjtcclxuXHRcdGNsYXNzZXM6IHN0cmluZztcclxuXHRcdG9wdGlvbnM6IElPcHRpb25zO1xyXG5cdFx0aXRlbXM6IEFycmF5PElGaWxlPjtcclxuXHRcdHNlbGVjdGVkOiBudW1iZXI7XHJcblx0XHRmaWxlOiBJRmlsZTtcclxuXHRcdGZpbGVzOiBBcnJheTxJRmlsZT47XHJcblx0XHRzaXplczogQXJyYXk8c3RyaW5nPjtcclxuXHRcdGlkOiBzdHJpbmc7XHJcblx0XHRpc1NpbmdsZTogYm9vbGVhbjtcclxuXHRcdGV2ZW50czoge1xyXG5cdFx0XHRDT05GSUdfTE9BRDogc3RyaW5nO1xyXG5cdFx0XHRBVVRPUExBWV9TVEFSVDogc3RyaW5nO1xyXG5cdFx0XHRBVVRPUExBWV9TVE9QOiBzdHJpbmc7XHJcblx0XHRcdFBBUlNFX0lNQUdFUzogc3RyaW5nO1xyXG5cdFx0XHRMT0FEX0lNQUdFOiBzdHJpbmc7XHJcblx0XHRcdEZJUlNUX0lNQUdFOiBzdHJpbmc7XHJcblx0XHRcdENIQU5HRV9JTUFHRTogc3RyaW5nO1xyXG5cdFx0XHRET1VCTEVfSU1BR0U6IHN0cmluZztcclxuXHRcdFx0TU9EQUxfT1BFTjogc3RyaW5nO1xyXG5cdFx0XHRNT0RBTF9DTE9TRTogc3RyaW5nO1xyXG5cdFx0XHRHQUxMRVJZX1VQREFURUQ6IHN0cmluZztcclxuXHRcdFx0R0FMTEVSWV9FRElUOiBzdHJpbmc7XHJcblx0XHR9O1xyXG5cclxuXHRcdGdldEluc3RhbmNlKGNvbXBvbmVudDogYW55KTogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdHNldERlZmF1bHRzKCk6IHZvaWQ7XHJcblxyXG5cdFx0c2V0T3B0aW9ucyhvcHRpb25zOiBJT3B0aW9ucyk6IElPcHRpb25zO1xyXG5cclxuXHRcdHNldEl0ZW1zKGl0ZW1zOiBBcnJheTxJRmlsZT4sIGZvcmNlPzogYm9vbGVhbik6IHZvaWQ7XHJcblxyXG5cdFx0cHJlbG9hZCh3YWl0PzogbnVtYmVyKTogdm9pZDtcclxuXHJcblx0XHRub3JtYWxpemUoaW5kZXg6IG51bWJlcik6IG51bWJlcjtcclxuXHJcblx0XHRzZXRGb2N1cygpOiB2b2lkO1xyXG5cclxuXHRcdHNldFNlbGVjdGVkKGluZGV4OiBudW1iZXIpO1xyXG5cclxuXHRcdG1vZGFsT3BlbihpbmRleDogbnVtYmVyKTogdm9pZDtcclxuXHJcblx0XHRtb2RhbENsb3NlKCk6IHZvaWQ7XHJcblxyXG5cdFx0bW9kYWxDbGljaygkZXZlbnQ/OiBVSUV2ZW50KTogdm9pZDtcclxuXHJcblx0XHR0aHVtYm5haWxzTW92ZShkZWxheT86IG51bWJlcik6IHZvaWQ7XHJcblxyXG5cdFx0dG9CYWNrd2FyZChzdG9wPzogYm9vbGVhbik6IHZvaWQ7XHJcblxyXG5cdFx0dG9Gb3J3YXJkKHN0b3A/OiBib29sZWFuKTogdm9pZDtcclxuXHJcblx0XHR0b0ZpcnN0KHN0b3A/OiBib29sZWFuKTogdm9pZDtcclxuXHJcblx0XHR0b0xhc3Qoc3RvcD86IGJvb2xlYW4pOiB2b2lkO1xyXG5cclxuXHRcdGxvYWRJbWFnZShpbmRleD86IG51bWJlcik6IHZvaWQ7XHJcblxyXG5cdFx0bG9hZEltYWdlcyhpbmRleGVzOiBBcnJheTxudW1iZXI+KTogdm9pZDtcclxuXHJcblx0XHRob3ZlclByZWxvYWQoaW5kZXg6IG51bWJlcik6IHZvaWQ7XHJcblxyXG5cdFx0YXV0b1BsYXlUb2dnbGUoKTogdm9pZDtcclxuXHJcblx0XHR0b2dnbGUoZWxlbWVudDogc3RyaW5nKTogdm9pZDtcclxuXHJcblx0XHRzZXRIYXNoKCk6IHZvaWQ7XHJcblxyXG5cdFx0ZG93bmxvYWRMaW5rKCk6IHN0cmluZztcclxuXHJcblx0XHRlbChzZWxlY3Rvcik6IE5vZGVMaXN0O1xyXG5cclxuXHRcdGxvZyhldmVudDogc3RyaW5nLCBkYXRhPzogYW55KTogdm9pZDtcclxuXHJcblxyXG5cdH1cclxuXHJcblx0Ly8gc2VydmljZSBjb250cm9sbGVyXHJcblx0ZXhwb3J0IGNsYXNzIFNlcnZpY2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgdmVyc2lvbiA9IFwiMi4xLjFcIjtcclxuXHRcdHB1YmxpYyBzbHVnID0gJ2FzZyc7XHJcblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcclxuXHRcdHB1YmxpYyBpdGVtczogQXJyYXk8SUZpbGU+ID0gW107XHJcblx0XHRwdWJsaWMgZmlsZXM6IEFycmF5PElGaWxlPiA9IFtdO1xyXG5cdFx0cHVibGljIGRpcmVjdGlvbjogc3RyaW5nO1xyXG5cdFx0cHVibGljIG1vZGFsQXZhaWxhYmxlID0gZmFsc2U7XHJcblx0XHRwdWJsaWMgbW9kYWxJbml0aWFsaXplZCA9IGZhbHNlO1xyXG5cclxuXHRcdHByaXZhdGUgaW5zdGFuY2VzOiB7fSA9IHt9O1xyXG5cdFx0cHJpdmF0ZSBfc2VsZWN0ZWQ6IG51bWJlcjtcclxuXHRcdHByaXZhdGUgX3Zpc2libGUgPSBmYWxzZTtcclxuXHRcdHByaXZhdGUgYXV0b3BsYXk6IGFuZ3VsYXIuSVByb21pc2U8YW55PjtcclxuXHRcdHByaXZhdGUgZmlyc3QgPSBmYWxzZTtcclxuXHRcdHByaXZhdGUgZWRpdGluZyA9IGZhbHNlO1xyXG5cclxuXHRcdHB1YmxpYyBvcHRpb25zOiBJT3B0aW9ucyA9IG51bGw7XHJcblx0XHRwdWJsaWMgb3B0aW9uc0xvYWRlZCA9IGZhbHNlO1xyXG5cdFx0cHVibGljIGRlZmF1bHRzOiBJT3B0aW9ucyA9IHtcclxuXHRcdFx0ZGVidWc6IGZhbHNlLCAvLyBpbWFnZSBsb2FkLCBhdXRvcGxheSwgZXRjLiBpbmZvIGluIGNvbnNvbGUubG9nXHJcblx0XHRcdGhhc2hVcmw6IHRydWUsIC8vIGVuYWJsZS9kaXNhYmxlIGhhc2ggdXNhZ2UgaW4gdXJsICgjYXNnLW5hdHVyZS00KVxyXG5cdFx0XHRiYXNlVXJsOiAnJywgLy8gdXJsIHByZWZpeFxyXG5cdFx0XHRkdXBsaWNhdGVzOiBmYWxzZSwgLy8gZW5hYmxlIG9yIGRpc2FibGUgc2FtZSBpbWFnZXMgKHVybCkgaW4gZ2FsbGVyeVxyXG5cdFx0XHRzZWxlY3RlZDogMCwgLy8gc2VsZWN0ZWQgaW1hZ2Ugb24gaW5pdFxyXG5cdFx0XHRmaWVsZHM6IHtcclxuXHRcdFx0XHRzb3VyY2U6IHtcclxuXHRcdFx0XHRcdG1vZGFsOiAndXJsJywgLy8gcmVxdWlyZWQsIGltYWdlIHVybCBmb3IgbW9kYWwgY29tcG9uZW50IChsYXJnZSBzaXplKVxyXG5cdFx0XHRcdFx0cGFuZWw6ICd1cmwnLCAvLyBpbWFnZSB1cmwgZm9yIHBhbmVsIGNvbXBvbmVudCAodGh1bWJuYWlsIHNpemUpXHJcblx0XHRcdFx0XHRpbWFnZTogJ3VybCcsIC8vIGltYWdlIHVybCBmb3IgaW1hZ2UgKG1lZGl1bSBvciBjdXN0b20gc2l6ZSlcclxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyOiBudWxsIC8vIGltYWdlIHVybCBmb3IgcHJlbG9hZCBsb3dyZXMgaW1hZ2VcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHRpdGxlOiAndGl0bGUnLCAvLyB0aXRsZSBmaWVsZCBuYW1lXHJcblx0XHRcdFx0c3VidGl0bGU6ICdzdWJ0aXRsZScsIC8vIHN1YnRpdGxlIGZpZWxkIG5hbWVcclxuXHRcdFx0XHRkZXNjcmlwdGlvbjogJ2Rlc2NyaXB0aW9uJywgLy8gZGVzY3JpcHRpb24gZmllbGQgbmFtZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhdXRvcGxheToge1xyXG5cdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLCAvLyBzbGlkZXNob3cgcGxheSBlbmFibGVkL2Rpc2FibGVkXHJcblx0XHRcdFx0ZGVsYXk6IDQxMDAgLy8gYXV0b3BsYXkgZGVsYXkgaW4gbWlsbGlzZWNvbmRcclxuXHRcdFx0fSxcclxuXHRcdFx0dGhlbWU6ICdkZWZhdWx0JywgLy8gY3NzIHN0eWxlIFtkZWZhdWx0LCBkYXJrYmx1ZSwgZGFya3JlZCwgd2hpdGVnb2xkXVxyXG5cdFx0XHRwcmVsb2FkTmV4dDogZmFsc2UsIC8vIHByZWxvYWQgbmV4dCBpbWFnZSAoZm9yd2FyZC9iYWNrd2FyZClcclxuXHRcdFx0cHJlbG9hZERlbGF5OiA3NzAsIC8vIHByZWxvYWQgZGVsYXkgZm9yIHByZWxvYWROZXh0XHJcblx0XHRcdGxvYWRpbmdJbWFnZTogJ3ByZWxvYWQuc3ZnJywgLy8gbG9hZGVyIGltYWdlXHJcblx0XHRcdHByZWxvYWQ6IFtdLCAvLyBwcmVsb2FkIGltYWdlcyBieSBpbmRleCBudW1iZXJcclxuXHRcdFx0bW9kYWw6IHtcclxuXHRcdFx0XHR0aXRsZTogJycsIC8vIG1vZGFsIHdpbmRvdyB0aXRsZVxyXG5cdFx0XHRcdHN1YnRpdGxlOiAnJywgLy8gbW9kYWwgd2luZG93IHN1YnRpdGxlXHJcblx0XHRcdFx0dGl0bGVGcm9tSW1hZ2U6IGZhbHNlLCAvLyBmb3JjZSB1cGRhdGUgdGhlIGdhbGxlcnkgdGl0bGUgYnkgaW1hZ2UgdGl0bGVcclxuXHRcdFx0XHRzdWJ0aXRsZUZyb21JbWFnZTogZmFsc2UsIC8vIGZvcmNlIHVwZGF0ZSB0aGUgZ2FsbGVyeSBzdWJ0aXRsZSBieSBpbWFnZSBkZXNjcmlwdGlvblxyXG5cdFx0XHRcdHBsYWNlaG9sZGVyOiAncGFuZWwnLCAvLyBzZXQgaW1hZ2UgcGxhY2Vob2xkZXIgc291cmNlIHR5cGUgKHRodW1ibmFpbCkgb3IgZnVsbCB1cmwgKGh0dHAuLi4pXHRcdFx0XHRcclxuXHRcdFx0XHRjYXB0aW9uOiB7XHJcblx0XHRcdFx0XHRkaXNhYmxlZDogZmFsc2UsIC8vIGRpc2FibGUgaW1hZ2UgY2FwdGlvblxyXG5cdFx0XHRcdFx0dmlzaWJsZTogdHJ1ZSwgLy8gc2hvdy9oaWRlIGltYWdlIGNhcHRpb25cclxuXHRcdFx0XHRcdHBvc2l0aW9uOiAndG9wJywgLy8gY2FwdGlvbiBwb3NpdGlvbiBbdG9wLCBib3R0b21dXHJcblx0XHRcdFx0XHRkb3dubG9hZDogZmFsc2UgLy8gc2hvdy9oaWRlIGRvd25sb2FkIGxpbmtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGhlYWRlcjoge1xyXG5cdFx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSwgLy8gZW5hYmxlL2Rpc2FibGUgbW9kYWwgbWVudVxyXG5cdFx0XHRcdFx0ZHluYW1pYzogZmFsc2UsIC8vIHNob3cvaGlkZSBtb2RhbCBtZW51IG9uIG1vdXNlb3ZlclxyXG5cdFx0XHRcdFx0YnV0dG9uczogWydwbGF5c3RvcCcsICdpbmRleCcsICdwcmV2JywgJ25leHQnLCAncGluJywgJ3NpemUnLCAndHJhbnNpdGlvbicsICd0aHVtYm5haWxzJywgJ2Z1bGxzY3JlZW4nLCAnaGVscCcsICdjbG9zZSddLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGVscDogZmFsc2UsIC8vIHNob3cvaGlkZSBoZWxwXHJcblx0XHRcdFx0YXJyb3dzOiB7XHJcblx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLCAvLyBzaG93L2hpZGUgYXJyb3dzXHJcblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0Y2xpY2s6IHtcclxuXHRcdFx0XHRcdGNsb3NlOiB0cnVlIC8vIHdoZW4gY2xpY2sgb24gdGhlIGltYWdlIGNsb3NlIHRoZSBtb2RhbFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dGh1bWJuYWlsOiB7XHJcblx0XHRcdFx0XHRoZWlnaHQ6IDUwLCAvLyB0aHVtYm5haWwgaW1hZ2UgaGVpZ2h0IGluIHBpeGVsXHJcblx0XHRcdFx0XHRpbmRleDogZmFsc2UsIC8vIHNob3cgaW5kZXggbnVtYmVyIG9uIHRodW1ibmFpbFxyXG5cdFx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSwgLy8gZW5hYmxlL2Rpc2FibGUgdGh1bWJuYWlsc1xyXG5cdFx0XHRcdFx0ZHluYW1pYzogZmFsc2UsIC8vIGlmIHRydWUgdGh1bWJuYWlscyB2aXNpYmxlIG9ubHkgd2hlbiBtb3VzZW92ZXJcclxuXHRcdFx0XHRcdGF1dG9oaWRlOiB0cnVlLCAvLyBoaWRlIHRodW1ibmFpbCBjb21wb25lbnQgd2hlbiBzaW5nbGUgaW1hZ2VcclxuXHRcdFx0XHRcdGNsaWNrOiB7XHJcblx0XHRcdFx0XHRcdHNlbGVjdDogdHJ1ZSwgLy8gc2V0IHNlbGVjdGVkIGltYWdlIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRtb2RhbDogZmFsc2UgLy8gb3BlbiBtb2RhbCB3aGVuIHRydWVcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRob3Zlcjoge1xyXG5cdFx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxyXG5cdFx0XHRcdFx0XHRzZWxlY3Q6IGZhbHNlIC8vIHNldCBzZWxlY3RlZCBpbWFnZSBvbiBtb3VzZW92ZXIgd2hlbiB0cnVlXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dHJhbnNpdGlvbjogJ3NsaWRlTFInLCAvLyB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0XHRcdHRyYW5zaXRpb25TcGVlZDogMC43LCAvLyB0cmFuc2l0aW9uIHNwZWVkIDAuN3NcclxuXHRcdFx0XHRzaXplOiAnY292ZXInLCAvLyBjb250YWluLCBjb3ZlciwgYXV0bywgc3RyZXRjaFxyXG5cdFx0XHRcdGtleWNvZGVzOiB7XHJcblx0XHRcdFx0XHRleGl0OiBbMjddLCAvLyBlc2NcclxuXHRcdFx0XHRcdHBsYXlwYXVzZTogWzgwXSwgLy8gcFxyXG5cdFx0XHRcdFx0Zm9yd2FyZDogWzMyLCAzOV0sIC8vIHNwYWNlLCByaWdodCBhcnJvd1xyXG5cdFx0XHRcdFx0YmFja3dhcmQ6IFszN10sIC8vIGxlZnQgYXJyb3dcclxuXHRcdFx0XHRcdGZpcnN0OiBbMzgsIDM2XSwgLy8gdXAgYXJyb3csIGhvbWVcclxuXHRcdFx0XHRcdGxhc3Q6IFs0MCwgMzVdLCAvLyBkb3duIGFycm93LCBlbmRcclxuXHRcdFx0XHRcdGZ1bGxzY3JlZW46IFsxM10sIC8vIGVudGVyXHJcblx0XHRcdFx0XHRtZW51OiBbNzddLCAvLyBtXHJcblx0XHRcdFx0XHRjYXB0aW9uOiBbNjddLCAvLyBjXHJcblx0XHRcdFx0XHRoZWxwOiBbNzJdLCAvLyBoXHJcblx0XHRcdFx0XHRzaXplOiBbODNdLCAvLyBzXHJcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiBbODRdIC8vIHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHRodW1ibmFpbDoge1xyXG5cdFx0XHRcdGhlaWdodDogNTAsIC8vIHRodW1ibmFpbCBpbWFnZSBoZWlnaHQgaW4gcGl4ZWxcclxuXHRcdFx0XHRpbmRleDogZmFsc2UsIC8vIHNob3cgaW5kZXggbnVtYmVyIG9uIHRodW1ibmFpbFxyXG5cdFx0XHRcdGR5bmFtaWM6IGZhbHNlLCAvLyBpZiB0cnVlIHRodW1ibmFpbHMgdmlzaWJsZSBvbmx5IHdoZW4gbW91c2VvdmVyXHJcblx0XHRcdFx0YXV0b2hpZGU6IGZhbHNlLCAvLyBoaWRlIHRodW1ibmFpbCBjb21wb25lbnQgd2hlbiBzaW5nbGUgaW1hZ2VcclxuXHRcdFx0XHRjbGljazoge1xyXG5cdFx0XHRcdFx0c2VsZWN0OiB0cnVlLCAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugd2hlbiB0cnVlXHJcblx0XHRcdFx0XHRtb2RhbDogZmFsc2UgLy8gb3BlbiBtb2RhbCB3aGVuIHRydWVcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGhvdmVyOiB7XHJcblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxyXG5cdFx0XHRcdFx0c2VsZWN0OiBmYWxzZSAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugb24gbW91c2VvdmVyIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdHBhbmVsOiB7XHJcblx0XHRcdFx0dmlzaWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRpdGVtczoge1xyXG5cdFx0XHRcdFx0Y2xhc3M6ICdyb3cnLCAvLyBpdGVtcyBjbGFzc1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aXRlbToge1xyXG5cdFx0XHRcdFx0Y2xhc3M6ICdjb2wtbWQtMycsIC8vIGl0ZW0gY2xhc3NcclxuXHRcdFx0XHRcdGNhcHRpb246IGZhbHNlLCAvLyBzaG93L2hpZGUgaW1hZ2UgY2FwdGlvblxyXG5cdFx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93L2hpZGUgaW1hZ2UgaW5kZXhcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGhvdmVyOiB7XHJcblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxyXG5cdFx0XHRcdFx0c2VsZWN0OiBmYWxzZSAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugb24gbW91c2VvdmVyIHdoZW4gdHJ1ZVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0Y2xpY2s6IHtcclxuXHRcdFx0XHRcdHNlbGVjdDogZmFsc2UsIC8vIHNldCBzZWxlY3RlZCBpbWFnZSB3aGVuIHRydWVcclxuXHRcdFx0XHRcdG1vZGFsOiB0cnVlIC8vIG9wZW4gbW9kYWwgd2hlbiB0cnVlXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fSxcclxuXHRcdFx0aW1hZ2U6IHtcclxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRcdFx0dHJhbnNpdGlvblNwZWVkOiAwLjcsIC8vIHRyYW5zaXRpb24gc3BlZWQgMC43c1xyXG5cdFx0XHRcdHNpemU6ICdjb3ZlcicsIC8vIGNvbnRhaW4sIGNvdmVyLCBhdXRvLCBzdHJldGNoXHJcblx0XHRcdFx0YXJyb3dzOiB7XHJcblx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLCAgLy8gc2hvdy9oaWRlIGFycm93c1xyXG5cdFx0XHRcdFx0cHJlbG9hZDogdHJ1ZSwgLy8gcHJlbG9hZCBpbWFnZSBvbiBtb3VzZW92ZXJcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGNsaWNrOiB7XHJcblx0XHRcdFx0XHRtb2RhbDogdHJ1ZSAvLyB3aGVuIGNsaWNrIG9uIHRoZSBpbWFnZSBvcGVuIHRoZSBtb2RhbCB3aW5kb3dcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGhlaWdodDogbnVsbCwgLy8gaGVpZ2h0IGluIHBpeGVsXHJcblx0XHRcdFx0aGVpZ2h0TWluOiBudWxsLCAvLyBtaW4gaGVpZ2h0IGluIHBpeGVsXHJcblx0XHRcdFx0aGVpZ2h0QXV0bzoge1xyXG5cdFx0XHRcdFx0aW5pdGlhbDogdHJ1ZSwgLy8gY2FsY3VsYXRlIGRpdiBoZWlnaHQgYnkgZmlyc3QgaW1hZ2VcclxuXHRcdFx0XHRcdG9ucmVzaXplOiBmYWxzZSAvLyBjYWxjdWxhdGUgZGl2IGhlaWdodCBvbiB3aW5kb3cgcmVzaXplXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRwbGFjZWhvbGRlcjogJ3BhbmVsJyAvLyBzZXQgaW1hZ2UgcGxhY2Vob2xkZXIgc291cmNlIHR5cGUgKHRodW1ibmFpbCkgb3IgZnVsbCB1cmwgKGh0dHAuLi4pXHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gYXZhaWxhYmxlIGltYWdlIHNpemVzXHJcblx0XHRwdWJsaWMgc2l6ZXM6IEFycmF5PHN0cmluZz4gPSBbXHJcblx0XHRcdCdjb250YWluJyxcclxuXHRcdFx0J2NvdmVyJyxcclxuXHRcdFx0J2F1dG8nLFxyXG5cdFx0XHQnc3RyZXRjaCdcclxuXHRcdF07XHJcblxyXG5cdFx0Ly8gYXZhaWxhYmxlIHRoZW1lc1xyXG5cdFx0cHVibGljIHRoZW1lczogQXJyYXk8c3RyaW5nPiA9IFtcclxuXHRcdFx0J2RlZmF1bHQnLFxyXG5cdFx0XHQnZGFya2JsdWUnLFxyXG5cdFx0XHQnd2hpdGVnb2xkJ1xyXG5cdFx0XTtcclxuXHJcblx0XHQvLyBhdmFpbGFibGUgdHJhbnNpdGlvbnNcclxuXHRcdHB1YmxpYyB0cmFuc2l0aW9uczogQXJyYXk8c3RyaW5nPiA9IFtcclxuXHRcdFx0J25vJyxcclxuXHRcdFx0J2ZhZGVJbk91dCcsXHJcblx0XHRcdCd6b29tSW4nLFxyXG5cdFx0XHQnem9vbU91dCcsXHJcblx0XHRcdCd6b29tSW5PdXQnLFxyXG5cdFx0XHQncm90YXRlTFInLFxyXG5cdFx0XHQncm90YXRlVEInLFxyXG5cdFx0XHQncm90YXRlWlknLFxyXG5cdFx0XHQnc2xpZGVMUicsXHJcblx0XHRcdCdzbGlkZVRCJyxcclxuXHRcdFx0J3psaWRlTFInLFxyXG5cdFx0XHQnemxpZGVUQicsXHJcblx0XHRcdCdmbGlwWCcsXHJcblx0XHRcdCdmbGlwWSdcclxuXHRcdF07XHJcblxyXG5cdFx0cHVibGljIGV2ZW50cyA9IHtcclxuXHRcdFx0Q09ORklHX0xPQUQ6ICdBU0ctY29uZmlnLWxvYWQtJyxcclxuXHRcdFx0QVVUT1BMQVlfU1RBUlQ6ICdBU0ctYXV0b3BsYXktc3RhcnQtJyxcclxuXHRcdFx0QVVUT1BMQVlfU1RPUDogJ0FTRy1hdXRvcGxheS1zdG9wLScsXHJcblx0XHRcdFBBUlNFX0lNQUdFUzogJ0FTRy1wYXJzZS1pbWFnZXMtJyxcclxuXHRcdFx0TE9BRF9JTUFHRTogJ0FTRy1sb2FkLWltYWdlLScsXHJcblx0XHRcdEZJUlNUX0lNQUdFOiAnQVNHLWZpcnN0LWltYWdlLScsXHJcblx0XHRcdENIQU5HRV9JTUFHRTogJ0FTRy1jaGFuZ2UtaW1hZ2UtJyxcclxuXHRcdFx0RE9VQkxFX0lNQUdFOiAnQVNHLWRvdWJsZS1pbWFnZS0nLFxyXG5cdFx0XHRNT0RBTF9PUEVOOiAnQVNHLW1vZGFsLW9wZW4tJyxcclxuXHRcdFx0TU9EQUxfQ0xPU0U6ICdBU0ctbW9kYWwtY2xvc2UtJyxcclxuXHRcdFx0VEhVTUJOQUlMX01PVkU6ICdBU0ctdGh1bWJuYWlsLW1vdmUtJyxcclxuXHRcdFx0R0FMTEVSWV9VUERBVEVEOiAnQVNHLWdhbGxlcnktdXBkYXRlZC0nLFxyXG5cdFx0XHRHQUxMRVJZX0VESVQ6ICdBU0ctZ2FsbGVyeS1lZGl0JyxcclxuXHRcdH07XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSB0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXHJcblx0XHRcdHByaXZhdGUgaW50ZXJ2YWw6IG5nLklJbnRlcnZhbFNlcnZpY2UsXHJcblx0XHRcdHByaXZhdGUgbG9jYXRpb246IG5nLklMb2NhdGlvblNlcnZpY2UsXHJcblx0XHRcdHByaXZhdGUgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcblx0XHRcdHByaXZhdGUgJHdpbmRvdzogbmcuSVdpbmRvd1NlcnZpY2UpIHtcclxuXHJcblx0XHRcdGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKCdyZXNpemUnLCAoZXZlbnQpID0+IHtcclxuXHRcdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKDIwMCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gdXBkYXRlIGltYWdlcyB3aGVuIGVkaXQgZXZlbnRcclxuXHRcdFx0JHJvb3RTY29wZS4kb24odGhpcy5ldmVudHMuR0FMTEVSWV9FRElULCAoZXZlbnQsIGRhdGEpID0+IHtcclxuXHRcdFx0XHRpZiAodGhpcy5pbnN0YW5jZXNbZGF0YS5pZF0pIHtcclxuXHRcdFx0XHRcdHRoaXMuaW5zdGFuY2VzW2RhdGEuaWRdLmVkaXRHYWxsZXJ5KGRhdGEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgcGFyc2VIYXNoKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmlkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMub3B0aW9ucy5oYXNoVXJsKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgaGFzaCA9IHRoaXMubG9jYXRpb24uaGFzaCgpO1xyXG5cdFx0XHRsZXQgcGFydHMgPSBoYXNoID8gaGFzaC5zcGxpdCgnLScpIDogbnVsbDtcclxuXHJcblx0XHRcdGlmIChwYXJ0cyA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHBhcnRzWzBdICE9PSB0aGlzLnNsdWcpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChwYXJ0cy5sZW5ndGggIT09IDMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChwYXJ0c1sxXSAhPT0gdGhpcy5pZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGluZGV4ID0gcGFyc2VJbnQocGFydHNbMl0sIDEwKTtcclxuXHJcblx0XHRcdGlmICghYW5ndWxhci5pc051bWJlcihpbmRleCkpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblxyXG5cdFx0XHRcdGluZGV4LS07XHJcblx0XHRcdFx0dGhpcy5zZWxlY3RlZCA9IGluZGV4O1xyXG5cdFx0XHRcdHRoaXMubW9kYWxPcGVuKGluZGV4KTtcclxuXHJcblx0XHRcdH0sIDIwKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRlIG9iamVjdCBoYXNoIGlkXHJcblx0XHRwdWJsaWMgb2JqZWN0SGFzaElkKG9iamVjdDogYW55KTogc3RyaW5nIHtcclxuXHJcblx0XHRcdGxldCBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeShvYmplY3QpO1xyXG5cclxuXHRcdFx0aWYgKCFzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGFiYyA9IHN0cmluZy5yZXBsYWNlKC9bXmEtekEtWjAtOV0rL2csICcnKTtcclxuXHRcdFx0bGV0IGNvZGUgPSAwO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaSA9IDAsIG4gPSBhYmMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcblx0XHRcdFx0bGV0IGNoYXJjb2RlID0gYWJjLmNoYXJDb2RlQXQoaSk7XHJcblx0XHRcdFx0Y29kZSArPSAoY2hhcmNvZGUgKiBpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuICdpZCcgKyBjb2RlLnRvU3RyaW5nKDIxKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2UgZm9yIGN1cnJlbnQgZ2FsbGVyeSBieSBjb21wb25lbnQgaWRcclxuXHRcdHB1YmxpYyBnZXRJbnN0YW5jZShjb21wb25lbnQ6IGFueSkge1xyXG5cclxuXHRcdFx0aWYgKCFjb21wb25lbnQuaWQpIHtcclxuXHJcblx0XHRcdFx0Ly8gZ2V0IHBhcmVudCBhc2cgY29tcG9uZW50IGlkXHJcblx0XHRcdFx0aWYgKGNvbXBvbmVudC4kc2NvcGUgJiYgY29tcG9uZW50LiRzY29wZS4kcGFyZW50ICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudC4kcGFyZW50ICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudC4kcGFyZW50LiRjdHJsKSB7XHJcblx0XHRcdFx0XHRjb21wb25lbnQuaWQgPSBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQuJHBhcmVudC4kY3RybC5pZDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y29tcG9uZW50LmlkID0gdGhpcy5vYmplY3RIYXNoSWQoY29tcG9uZW50Lm9wdGlvbnMpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IGlkID0gY29tcG9uZW50LmlkO1xyXG5cdFx0XHRsZXQgaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1tpZF07XHJcblxyXG5cdFx0XHQvLyBuZXcgaW5zdGFuY2UgYW5kIHNldCBvcHRpb25zIGFuZCBpdGVtc1xyXG5cdFx0XHRpZiAoaW5zdGFuY2UgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGluc3RhbmNlID0gbmV3IFNlcnZpY2VDb250cm9sbGVyKHRoaXMudGltZW91dCwgdGhpcy5pbnRlcnZhbCwgdGhpcy5sb2NhdGlvbiwgdGhpcy4kcm9vdFNjb3BlLCB0aGlzLiR3aW5kb3cpO1xyXG5cdFx0XHRcdGluc3RhbmNlLmlkID0gaWQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChjb21wb25lbnQuYmFzZVVybCkge1xyXG5cdFx0XHRcdGNvbXBvbmVudC5vcHRpb25zLmJhc2VVcmwgPSBjb21wb25lbnQuYmFzZVVybDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aW5zdGFuY2Uuc2V0T3B0aW9ucyhjb21wb25lbnQub3B0aW9ucyk7XHJcblx0XHRcdGluc3RhbmNlLnNldEl0ZW1zKGNvbXBvbmVudC5pdGVtcyk7XHJcblx0XHRcdGluc3RhbmNlLnNlbGVjdGVkID0gY29tcG9uZW50LnNlbGVjdGVkID8gY29tcG9uZW50LnNlbGVjdGVkIDogaW5zdGFuY2Uub3B0aW9ucy5zZWxlY3RlZDtcclxuXHRcdFx0aW5zdGFuY2UucGFyc2VIYXNoKCk7XHJcblxyXG5cdFx0XHRpZiAoaW5zdGFuY2Uub3B0aW9ucykge1xyXG5cclxuXHRcdFx0XHRpbnN0YW5jZS5sb2FkSW1hZ2VzKGluc3RhbmNlLm9wdGlvbnMucHJlbG9hZCk7XHJcblxyXG5cdFx0XHRcdGlmIChpbnN0YW5jZS5vcHRpb25zLmF1dG9wbGF5ICYmIGluc3RhbmNlLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCAmJiAhaW5zdGFuY2UuYXV0b3BsYXkpIHtcclxuXHRcdFx0XHRcdGluc3RhbmNlLmF1dG9QbGF5U3RhcnQoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmluc3RhbmNlc1tpZF0gPSBpbnN0YW5jZTtcclxuXHRcdFx0cmV0dXJuIGluc3RhbmNlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBwcmVwYXJlIGltYWdlcyBhcnJheVxyXG5cdFx0cHVibGljIHNldEl0ZW1zKGl0ZW1zOiBBcnJheTxJRmlsZT4pIHtcclxuXHJcblx0XHRcdHRoaXMuaXRlbXMgPSBpdGVtcyA/IGl0ZW1zIDogW107XHJcblx0XHRcdHRoaXMucHJlcGFyZUl0ZW1zKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG9wdGlvbnMgc2V0dXBcclxuXHRcdHB1YmxpYyBzZXRPcHRpb25zKG9wdGlvbnM6IElPcHRpb25zKSB7XHJcblxyXG5cdFx0XHQvLyBpZiBvcHRpb25zIGFscmVhZHkgc2V0dXBcclxuXHRcdFx0aWYgKHRoaXMub3B0aW9uc0xvYWRlZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKG9wdGlvbnMpIHtcclxuXHJcblx0XHRcdFx0dGhpcy5vcHRpb25zID0gYW5ndWxhci5jb3B5KHRoaXMuZGVmYXVsdHMpO1xyXG5cdFx0XHRcdGFuZ3VsYXIubWVyZ2UodGhpcy5vcHRpb25zLCBvcHRpb25zKTtcclxuXHJcblx0XHRcdFx0aWYgKG9wdGlvbnMubW9kYWwgJiYgb3B0aW9ucy5tb2RhbC5oZWFkZXIgJiYgb3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucykge1xyXG5cclxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucyA9IG9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnM7XHJcblxyXG5cdFx0XHRcdFx0Ly8gcmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBidXR0b25zXHJcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnMgPSB0aGlzLm9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnMuZmlsdGVyKGZ1bmN0aW9uICh4LCBpLCBhKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBhLmluZGV4T2YoeCkgPT09IGk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLm9wdGlvbnNMb2FkZWQgPSB0cnVlO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMgPSBhbmd1bGFyLmNvcHkodGhpcy5kZWZhdWx0cyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGlmICF0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbFxyXG5cdFx0XHRpZiAoIXRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsKSB7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25zLm1vZGFsLmhlYWRlci5idXR0b25zID0gdGhpcy5vcHRpb25zLm1vZGFsLmhlYWRlci5idXR0b25zLmZpbHRlcihmdW5jdGlvbiAoeCwgaSwgYSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHggIT09ICdmdWxsc2NyZWVuJztcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdC8vIGltcG9ydGFudCFcclxuXHRcdFx0b3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQ09ORklHX0xPQUQsIHRoaXMub3B0aW9ucyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodjogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR2ID0gdGhpcy5ub3JtYWxpemUodik7XHJcblx0XHRcdGxldCBwcmV2ID0gdGhpcy5fc2VsZWN0ZWQ7XHJcblxyXG5cdFx0XHR0aGlzLl9zZWxlY3RlZCA9IHY7XHJcblx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuX3NlbGVjdGVkKTtcclxuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5maWxlKSB7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLm9wdGlvbnMubW9kYWwudGl0bGVGcm9tSW1hZ2UgJiYgdGhpcy5maWxlLnRpdGxlKSB7XHJcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMubW9kYWwudGl0bGUgPSB0aGlzLmZpbGUudGl0bGU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5vcHRpb25zLm1vZGFsLnN1YnRpdGxlRnJvbUltYWdlICYmIHRoaXMuZmlsZS5kZXNjcmlwdGlvbikge1xyXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLm1vZGFsLnN1YnRpdGxlID0gdGhpcy5maWxlLmRlc2NyaXB0aW9uO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChwcmV2ICE9PSB0aGlzLl9zZWxlY3RlZCkge1xyXG5cclxuXHRcdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKCk7XHJcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5DSEFOR0VfSU1BR0UsIHtcclxuXHRcdFx0XHRcdGluZGV4OiB2LFxyXG5cdFx0XHRcdFx0ZmlsZTogdGhpcy5maWxlXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnMuc2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBmb3JjZSBzZWxlY3QgaW1hZ2VcclxuXHRcdHB1YmxpYyBmb3JjZVNlbGVjdChpbmRleCkge1xyXG5cclxuXHRcdFx0aW5kZXggPSB0aGlzLm5vcm1hbGl6ZShpbmRleCk7XHJcblx0XHRcdHRoaXMuX3NlbGVjdGVkID0gaW5kZXg7XHJcblx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuX3NlbGVjdGVkKTtcclxuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQ0hBTkdFX0lNQUdFLCB7XHJcblx0XHRcdFx0aW5kZXg6IGluZGV4LFxyXG5cdFx0XHRcdGZpbGU6IHRoaXMuZmlsZVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBzZXRTZWxlY3RlZChpbmRleDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9IGluZGV4ID4gdGhpcy5zZWxlY3RlZCA/ICdmb3J3YXJkJyA6ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleDtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnbyB0byBiYWNrd2FyZFxyXG5cdFx0cHVibGljIHRvQmFja3dhcmQoc3RvcD86IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmIChzdG9wKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkLS07XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBmb3J3YXJkXHJcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKHN0b3A/OiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoc3RvcCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2ZvcndhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkKys7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBmaXJzdFxyXG5cdFx0cHVibGljIHRvRmlyc3Qoc3RvcD86IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmIChzdG9wKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gMDtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGxhc3RcclxuXHRcdHB1YmxpYyB0b0xhc3Qoc3RvcD86IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmIChzdG9wKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLml0ZW1zLmxlbmd0aCAtIDE7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc2V0SGFzaCgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm1vZGFsVmlzaWJsZSAmJiB0aGlzLm9wdGlvbnMuaGFzaFVybCkge1xyXG5cdFx0XHRcdHRoaXMubG9jYXRpb24uaGFzaChbdGhpcy5zbHVnLCB0aGlzLmlkLCB0aGlzLnNlbGVjdGVkICsgMV0uam9pbignLScpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlUb2dnbGUoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQpIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdGFydCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlTdG9wKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmludGVydmFsLmNhbmNlbCh0aGlzLmF1dG9wbGF5KTtcclxuXHRcdFx0dGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5hdXRvcGxheSA9IG51bGw7XHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQVVUT1BMQVlfU1RPUCwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCwgZmlsZTogdGhpcy5maWxlIH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlTdGFydCgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuYXV0b3BsYXkgPSB0aGlzLmludGVydmFsKCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnRvRm9yd2FyZCgpO1xyXG5cdFx0XHR9LCB0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZGVsYXkpO1xyXG5cclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5BVVRPUExBWV9TVEFSVCwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCwgZmlsZTogdGhpcy5maWxlIH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHJpdmF0ZSBwcmVwYXJlSXRlbXMoKSB7XHJcblxyXG5cdFx0XHRsZXQgbGVuZ3RoID0gdGhpcy5pdGVtcy5sZW5ndGg7XHJcblx0XHRcdGZvciAobGV0IGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcclxuXHRcdFx0XHR0aGlzLmFkZEltYWdlKHRoaXMuaXRlbXNba2V5XSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuUEFSU0VfSU1BR0VTLCB0aGlzLmZpbGVzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gcHJlbG9hZCB0aGUgaW1hZ2Ugd2hlbiBtb3VzZW92ZXJcclxuXHRcdHB1YmxpYyBob3ZlclByZWxvYWQoaW5kZXg6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoaW5kZXgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBpbWFnZSBwcmVsb2FkXHJcblx0XHRwcml2YXRlIHByZWxvYWQod2FpdD86IG51bWJlcikge1xyXG5cclxuXHRcdFx0bGV0IGluZGV4ID0gdGhpcy5kaXJlY3Rpb24gPT09ICdmb3J3YXJkJyA/IHRoaXMuc2VsZWN0ZWQgKyAxIDogdGhpcy5zZWxlY3RlZCAtIDE7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnByZWxvYWROZXh0ID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMubG9hZEltYWdlKGluZGV4KTtcclxuXHRcdFx0XHR9LCAod2FpdCAhPT0gdW5kZWZpbmVkKSA/IHdhaXQgOiB0aGlzLm9wdGlvbnMucHJlbG9hZERlbGF5KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgbm9ybWFsaXplKGluZGV4OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGxldCBsYXN0ID0gdGhpcy5maWxlcy5sZW5ndGggLSAxO1xyXG5cclxuXHRcdFx0aWYgKGluZGV4ID4gbGFzdCkge1xyXG5cdFx0XHRcdHJldHVybiAoaW5kZXggLSBsYXN0KSAtIDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChpbmRleCA8IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gbGFzdCAtIE1hdGguYWJzKGluZGV4KSArIDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBpbmRleDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBsb2FkSW1hZ2VzKGluZGV4ZXM6IEFycmF5PG51bWJlcj4sIHR5cGU6IHN0cmluZykge1xyXG5cclxuXHRcdFx0aWYgKCFpbmRleGVzIHx8IGluZGV4ZXMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRpbmRleGVzLmZvckVhY2goKGluZGV4OiBudW1iZXIpID0+IHtcclxuXHRcdFx0XHRzZWxmLmxvYWRJbWFnZShpbmRleCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGxvYWRJbWFnZShpbmRleD86IG51bWJlciwgY2FsbGJhY2s/OiB7fSkge1xyXG5cclxuXHRcdFx0aW5kZXggPSBpbmRleCA/IGluZGV4IDogdGhpcy5zZWxlY3RlZDtcclxuXHRcdFx0aW5kZXggPSB0aGlzLm5vcm1hbGl6ZShpbmRleCk7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuZmlsZXNbaW5kZXhdKSB7XHJcblx0XHRcdFx0dGhpcy5sb2coJ2ludmFsaWQgZmlsZSBpbmRleCcsIHsgaW5kZXg6IGluZGV4IH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMubW9kYWxWaXNpYmxlKSB7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWQubW9kYWwgPT09IHRydWUpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBtb2RhbCA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0XHRcdG1vZGFsLnNyYyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5tb2RhbDtcclxuXHRcdFx0XHRtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmFmdGVyTG9hZChpbmRleCwgJ21vZGFsJywgbW9kYWwpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZC5pbWFnZSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcblx0XHRcdFx0aW1hZ2Uuc3JjID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlLmltYWdlO1xyXG5cdFx0XHRcdGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmFmdGVyTG9hZChpbmRleCwgJ2ltYWdlJywgaW1hZ2UpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgZmlsZSBuYW1lXHJcblx0XHRwcml2YXRlIGdldEZpbGVuYW1lKGluZGV4OiBudW1iZXIsIHR5cGU/OiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdHR5cGUgPSB0eXBlID8gdHlwZSA6ICdtb2RhbCc7XHJcblx0XHRcdGxldCBmaWxlcGFydHMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2VbdHlwZV0uc3BsaXQoJy8nKTtcclxuXHRcdFx0bGV0IGZpbGVuYW1lID0gZmlsZXBhcnRzW2ZpbGVwYXJ0cy5sZW5ndGggLSAxXTtcclxuXHRcdFx0cmV0dXJuIGZpbGVuYW1lO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgZmlsZSBleHRlbnNpb25cclxuXHRcdHByaXZhdGUgZ2V0RXh0ZW5zaW9uKGluZGV4OiBudW1iZXIsIHR5cGU/OiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdHR5cGUgPSB0eXBlID8gdHlwZSA6ICdtb2RhbCc7XHJcblx0XHRcdGxldCBmaWxlcGFydHMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2VbdHlwZV0uc3BsaXQoJy4nKTtcclxuXHRcdFx0bGV0IGV4dGVuc2lvbiA9IGZpbGVwYXJ0c1tmaWxlcGFydHMubGVuZ3RoIC0gMV07XHJcblx0XHRcdHJldHVybiBleHRlbnNpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGFmdGVyIGxvYWQgaW1hZ2VcclxuXHRcdHByaXZhdGUgYWZ0ZXJMb2FkKGluZGV4LCB0eXBlLCBpbWFnZSkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmZpbGVzW2luZGV4XSB8fCAhdGhpcy5maWxlc1tpbmRleF0ubG9hZGVkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5maWxlc1tpbmRleF0ubG9hZGVkW3R5cGVdID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubG9hZGVkW3R5cGVdID0gdHJ1ZTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0eXBlID09PSAnbW9kYWwnKSB7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0ud2lkdGggPSBpbWFnZS53aWR0aDtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubmFtZSA9IHRoaXMuZ2V0RmlsZW5hbWUoaW5kZXgsIHR5cGUpO1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmV4dGVuc2lvbiA9IHRoaXMuZ2V0RXh0ZW5zaW9uKGluZGV4LCB0eXBlKTtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5kb3dubG9hZCA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5tb2RhbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubG9hZGVkW3R5cGVdID0gdHJ1ZTtcclxuXHJcblx0XHRcdGxldCBkYXRhID0geyB0eXBlOiB0eXBlLCBpbmRleDogaW5kZXgsIGZpbGU6IHRoaXMuZmlsZSwgaW1nOiBpbWFnZSB9O1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmZpcnN0KSB7XHJcblx0XHRcdFx0dGhpcy5maXJzdCA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5GSVJTVF9JTUFHRSwgZGF0YSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuTE9BRF9JTUFHRSwgZGF0YSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBpcyBzaW5nbGU/XHJcblx0XHRwdWJsaWMgZ2V0IGlzU2luZ2xlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuZmlsZXMubGVuZ3RoID4gMSA/IGZhbHNlIDogdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB0aGUgZG93bmxvYWQgbGlua1xyXG5cdFx0cHVibGljIGRvd25sb2FkTGluaygpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLnNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgdGhpcy5maWxlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZmlsZXNbdGhpcy5zZWxlY3RlZF0uc291cmNlLm1vZGFsO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgdGhlIGZpbGVcclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpOiBJRmlsZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlc1t0aGlzLnNlbGVjdGVkXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGVsZW1lbnQgdmlzaWJsZVxyXG5cdFx0cHVibGljIHRvZ2dsZShlbGVtZW50OiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcblx0XHRcdHRoaXMub3B0aW9uc1tlbGVtZW50XS52aXNpYmxlID0gIXRoaXMub3B0aW9uc1tlbGVtZW50XS52aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHZpc2libGVcclxuXHRcdHB1YmxpYyBnZXQgbW9kYWxWaXNpYmxlKCk6IGJvb2xlYW4ge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuX3Zpc2libGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgdGhlbWVcclxuXHRcdHB1YmxpYyBnZXQgdGhlbWUoKTogc3RyaW5nIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnMudGhlbWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBjbGFzc2VzXHJcblx0XHRwdWJsaWMgZ2V0IGNsYXNzZXMoKTogc3RyaW5nIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnMudGhlbWUgKyAnICcgKyB0aGlzLmlkICsgKHRoaXMuZWRpdGluZyA/ICcgZWRpdGluZycgOiAnJyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBwcmVsb2FkIHN0eWxlXHJcblx0XHRwdWJsaWMgZHluYW1pY1N0eWxlKGZpbGU6IElGaWxlLCB0eXBlOiBzdHJpbmcsIGNvbmZpZzogSU9wdGlvbnNNb2RhbCB8IElPcHRpb25zSW1hZ2UpIHtcclxuXHJcblx0XHRcdGxldCBzdHlsZSA9IHt9O1xyXG5cclxuXHRcdFx0aWYgKGZpbGUuc291cmNlLmNvbG9yKSB7XHJcblx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtY29sb3InXSA9IGZpbGUuc291cmNlLmNvbG9yO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmxvYWRpbmdJbWFnZSAmJiBmaWxlLmxvYWRlZFt0eXBlXSA9PT0gZmFsc2UpIHtcclxuXHRcdFx0XHRzdHlsZVsnYmFja2dyb3VuZC1pbWFnZSddID0gJ3VybCgnICsgdGhpcy5vcHRpb25zLmxvYWRpbmdJbWFnZSArICcpJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGNvbmZpZy50cmFuc2l0aW9uU3BlZWQgIT09IHVuZGVmaW5lZCAmJiBjb25maWcudHJhbnNpdGlvblNwZWVkICE9PSBudWxsKSB7XHJcblx0XHRcdFx0c3R5bGVbJ3RyYW5zaXRpb24nXSA9ICdhbGwgZWFzZSAnICsgY29uZmlnLnRyYW5zaXRpb25TcGVlZCArICdzJztcclxuXHRcdFx0fVxyXG5cdFx0XHJcblx0XHRcdHJldHVybiBzdHlsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHBsYWNlaG9sZGVyIHN0eWxlXHJcblx0XHRwdWJsaWMgcGxhY2Vob2xkZXJTdHlsZShmaWxlOiBJRmlsZSwgdHlwZTogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHRsZXQgc3R5bGUgPSB7fTtcclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnNbdHlwZV0ucGxhY2Vob2xkZXIpIHtcclxuXHJcblx0XHRcdFx0bGV0IGluZGV4ID0gdGhpcy5vcHRpb25zW3R5cGVdLnBsYWNlaG9sZGVyO1xyXG5cdFx0XHRcdGxldCBpc0Z1bGwgPSAoaW5kZXguaW5kZXhPZignLy8nKSA9PT0gMCB8fCBpbmRleC5pbmRleE9mKCdodHRwJykgPT09IDApID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdGxldCBzb3VyY2U7XHJcblxyXG5cdFx0XHRcdGlmIChpc0Z1bGwpIHtcclxuXHRcdFx0XHRcdHNvdXJjZSA9IGluZGV4O1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzb3VyY2UgPSBmaWxlLnNvdXJjZVtpbmRleF07XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoc291cmNlKSB7XHJcblx0XHRcdFx0XHRzdHlsZVsnYmFja2dyb3VuZC1pbWFnZSddID0gJ3VybCgnICsgc291cmNlICsgJyknO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChmaWxlLnNvdXJjZS5jb2xvcikge1xyXG5cdFx0XHRcdHN0eWxlWydiYWNrZ3JvdW5kLWNvbG9yJ10gPSBmaWxlLnNvdXJjZS5jb2xvcjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGZpbGUuc291cmNlLnBsYWNlaG9sZGVyKSB7XHJcblx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtaW1hZ2UnXSA9ICd1cmwoJyArIGZpbGUuc291cmNlLnBsYWNlaG9sZGVyICsgJyknO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gc3R5bGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgc2V0IG1vZGFsVmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0dGhpcy5fdmlzaWJsZSA9IHZhbHVlO1xyXG5cclxuXHRcdFx0Ly8gc2V0IGluZGV4IDAgaWYgIXNlbGVjdGVkXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkID8gdGhpcy5zZWxlY3RlZCA6IDA7XHJcblxyXG5cdFx0XHRsZXQgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcblx0XHRcdGxldCBjbGFzc05hbWUgPSAnYXNnLXloaWRkZW4nO1xyXG5cclxuXHRcdFx0aWYgKHZhbHVlKSB7XHJcblxyXG5cdFx0XHRcdGlmIChib2R5LmNsYXNzTmFtZS5pbmRleE9mKGNsYXNzTmFtZSkgPCAwKSB7XHJcblx0XHRcdFx0XHRib2R5LmNsYXNzTmFtZSA9IGJvZHkuY2xhc3NOYW1lICsgJyAnICsgY2xhc3NOYW1lO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5tb2RhbEluaXQoKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdGJvZHkuY2xhc3NOYW1lID0gYm9keS5jbGFzc05hbWUucmVwbGFjZShjbGFzc05hbWUsICcnKS50cmltKCk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGluaXRpYWxpemUgdGhlIGdhbGxlcnlcclxuXHRcdHByaXZhdGUgbW9kYWxJbml0KCkge1xyXG5cclxuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRzZWxmLnNldEZvY3VzKCk7XHJcblx0XHRcdH0sIDEwMCk7XHJcblxyXG5cdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKDQ0MCk7XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMubW9kYWxJbml0aWFsaXplZCA9IHRydWU7XHJcblx0XHRcdH0sIDQ2MCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbW9kYWxPcGVuKGluZGV4OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5tb2RhbEF2YWlsYWJsZSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IGluZGV4ICE9PSB1bmRlZmluZWQgPyBpbmRleCA6IHRoaXMuc2VsZWN0ZWQ7XHJcblx0XHRcdHRoaXMubW9kYWxWaXNpYmxlID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoKTtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuTU9EQUxfT1BFTiwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCB9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG1vZGFsQ2xvc2UoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmhhc2hVcmwpIHtcclxuXHRcdFx0XHR0aGlzLmxvY2F0aW9uLmhhc2goJycpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm1vZGFsSW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoKTtcclxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5NT0RBTF9DTE9TRSwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCB9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gbW92ZSB0aHVtYm5haWxzIHRvIGNvcnJlY3QgcG9zaXRpb25cclxuXHRcdHB1YmxpYyB0aHVtYm5haWxzTW92ZShkZWxheT86IG51bWJlcikge1xyXG5cclxuXHRcdFx0bGV0IG1vdmUgPSAoKSA9PiB7XHJcblxyXG5cdFx0XHRcdGxldCBjb250YWluZXJzID0gdGhpcy5lbCgnZGl2LmFzZy10aHVtYm5haWwuJyArIHRoaXMuaWQpO1xyXG5cclxuXHRcdFx0XHRpZiAoIWNvbnRhaW5lcnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRhaW5lcnMubGVuZ3RoOyBpKyspIHtcclxuXHJcblx0XHRcdFx0XHRsZXQgY29udGFpbmVyOiBhbnkgPSBjb250YWluZXJzW2ldO1xyXG5cclxuXHRcdFx0XHRcdGlmIChjb250YWluZXIub2Zmc2V0V2lkdGgpIHtcclxuXHJcblx0XHRcdFx0XHRcdGxldCBpdGVtczogYW55ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5pdGVtcycpO1xyXG5cdFx0XHRcdFx0XHRsZXQgaXRlbTogYW55ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5pdGVtJyk7XHJcblx0XHRcdFx0XHRcdGxldCB0aHVtYm5haWwsIG1vdmVYLCByZW1haW47XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoaXRlbSkge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoaXRlbXMuc2Nyb2xsV2lkdGggPiBjb250YWluZXIub2Zmc2V0V2lkdGgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbCA9IGl0ZW1zLnNjcm9sbFdpZHRoIC8gdGhpcy5maWxlcy5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IChjb250YWluZXIub2Zmc2V0V2lkdGggLyAyKSAtICh0aGlzLnNlbGVjdGVkICogdGh1bWJuYWlsKSAtIHRodW1ibmFpbCAvIDI7XHJcblx0XHRcdFx0XHRcdFx0XHRyZW1haW4gPSBpdGVtcy5zY3JvbGxXaWR0aCArIG1vdmVYO1xyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZVggPSBtb3ZlWCA+IDAgPyAwIDogbW92ZVg7XHJcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IHJlbWFpbiA8IGNvbnRhaW5lci5vZmZzZXRXaWR0aCA/IGNvbnRhaW5lci5vZmZzZXRXaWR0aCAtIGl0ZW1zLnNjcm9sbFdpZHRoIDogbW92ZVg7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbCA9IHRoaXMuZ2V0UmVhbFdpZHRoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZVggPSAoY29udGFpbmVyLm9mZnNldFdpZHRoIC0gdGh1bWJuYWlsICogdGhpcy5maWxlcy5sZW5ndGgpIC8gMjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGl0ZW1zLnN0eWxlLmxlZnQgPSBtb3ZlWCArICdweCc7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuVEhVTUJOQUlMX01PVkUsIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbDogdGh1bWJuYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZTogbW92ZVgsXHJcblx0XHRcdFx0XHRcdFx0XHRyZW1haW46IHJlbWFpbixcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnRhaW5lcjogY29udGFpbmVyLm9mZnNldFdpZHRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbXM6IGl0ZW1zLnNjcm9sbFdpZHRoXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpZiAoZGVsYXkpIHtcclxuXHRcdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0bW92ZSgpO1xyXG5cdFx0XHRcdH0sIGRlbGF5KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtb3ZlKCk7XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBtb2RhbENsaWNrKCRldmVudD86IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICgkZXZlbnQpIHtcclxuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRoZSBmb2N1c1xyXG5cdFx0cHVibGljIHNldEZvY3VzKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubW9kYWxWaXNpYmxlKSB7XHJcblxyXG5cdFx0XHRcdGxldCBlbGVtZW50OiBOb2RlID0gdGhpcy5lbCgnZGl2LmFzZy1tb2RhbC4nICsgdGhpcy5pZCArICcgLmtleUlucHV0JylbMF07XHJcblxyXG5cdFx0XHRcdGlmIChlbGVtZW50KSB7XHJcblx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbWVudClbMF1bJ2ZvY3VzJ10oKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgZXZlbnQoZXZlbnQ6IHN0cmluZywgZGF0YT86IGFueSkge1xyXG5cclxuXHRcdFx0ZXZlbnQgPSBldmVudCArIHRoaXMuaWQ7XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kZW1pdChldmVudCwgZGF0YSk7XHJcblx0XHRcdHRoaXMubG9nKGV2ZW50LCBkYXRhKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGxvZyhldmVudDogc3RyaW5nLCBkYXRhPzogYW55KSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmRlYnVnKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXZlbnQsIGRhdGEgPyBkYXRhIDogbnVsbCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGVsZW1lbnRcclxuXHRcdHB1YmxpYyBlbChzZWxlY3Rvcik6IE5vZGVMaXN0IHtcclxuXHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRpbmcgZWxlbWVudCByZWFsIHdpZHRoXHJcblx0XHRwdWJsaWMgZ2V0UmVhbFdpZHRoKGl0ZW0pIHtcclxuXHJcblx0XHRcdGxldCBzdHlsZSA9IGl0ZW0uY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGl0ZW0pLFxyXG5cdFx0XHRcdHdpZHRoID0gaXRlbS5vZmZzZXRXaWR0aCxcclxuXHRcdFx0XHRtYXJnaW4gPSBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkxlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5SaWdodCksXHJcblx0XHRcdFx0Ly8gcGFkZGluZyA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0xlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nUmlnaHQpLFxyXG5cdFx0XHRcdGJvcmRlciA9IHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyTGVmdFdpZHRoKSArIHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyUmlnaHRXaWR0aCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gd2lkdGggKyBtYXJnaW4gKyBib3JkZXI7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNhbGN1bGF0aW5nIGVsZW1lbnQgcmVhbCBoZWlnaHRcclxuXHRcdHB1YmxpYyBnZXRSZWFsSGVpZ2h0KGl0ZW0pIHtcclxuXHJcblx0XHRcdGxldCBzdHlsZSA9IGl0ZW0uY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGl0ZW0pLFxyXG5cdFx0XHRcdGhlaWdodCA9IGl0ZW0ub2Zmc2V0SGVpZ2h0LFxyXG5cdFx0XHRcdG1hcmdpbiA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luQm90dG9tKSxcclxuXHRcdFx0XHQvLyBwYWRkaW5nID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0JvdHRvbSksXHJcblx0XHRcdFx0Ym9yZGVyID0gcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJUb3BXaWR0aCkgKyBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlckJvdHRvbVdpZHRoKTtcclxuXHJcblx0XHRcdHJldHVybiBoZWlnaHQgKyBtYXJnaW4gKyBib3JkZXI7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBlZGl0IGdhbGxlcnlcclxuXHRcdHB1YmxpYyBlZGl0R2FsbGVyeShlZGl0OiBJRWRpdCkge1xyXG5cclxuXHRcdFx0dGhpcy5lZGl0aW5nID0gdHJ1ZTtcclxuXHRcdFx0bGV0IHNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZDtcclxuXHJcblx0XHRcdGlmIChlZGl0Lm9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHRoaXMub3B0aW9uc0xvYWRlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMuc2V0T3B0aW9ucyhlZGl0Lm9wdGlvbnMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoZWRpdC5kZWxldGUgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHRoaXMuZGVsZXRlSW1hZ2UoZWRpdC5kZWxldGUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoZWRpdC5hZGQpIHtcclxuXHRcdFx0XHRsZXQgbGVuZ3RoID0gZWRpdC5hZGQubGVuZ3RoO1xyXG5cdFx0XHRcdGZvciAobGV0IGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcclxuXHRcdFx0XHRcdHRoaXMuYWRkSW1hZ2UoZWRpdC5hZGRba2V5XSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoZWRpdC51cGRhdGUpIHtcclxuXHJcblx0XHRcdFx0bGV0IGxlbmd0aCA9IGVkaXQudXBkYXRlLmxlbmd0aDtcclxuXHJcblx0XHRcdFx0Zm9yIChsZXQga2V5ID0gMDsga2V5IDwgbGVuZ3RoOyBrZXkrKykge1xyXG5cdFx0XHRcdFx0dGhpcy5hZGRJbWFnZShlZGl0LnVwZGF0ZVtrZXldLCBrZXkpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGNvdW50ID0gdGhpcy5maWxlcy5sZW5ndGggLSBlZGl0LnVwZGF0ZS5sZW5ndGg7XHJcblx0XHRcdFx0aWYgKGNvdW50ID4gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5kZWxldGVJbWFnZShsZW5ndGgsIGNvdW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblxyXG5cdFx0XHRcdGlmIChlZGl0LnNlbGVjdGVkID49IDApIHtcclxuXHRcdFx0XHRcdHNlbGVjdGVkID0gZWRpdC5zZWxlY3RlZDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChlZGl0LnNlbGVjdGVkID09IC0xKSB7XHJcblx0XHRcdFx0XHRzZWxlY3RlZCA9IHRoaXMuZmlsZXMubGVuZ3RoIC0gMTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHNlbGVjdGVkID0gdGhpcy5maWxlc1tzZWxlY3RlZF0gPyBzZWxlY3RlZCA6IChzZWxlY3RlZCA+PSB0aGlzLmZpbGVzLmxlbmd0aCA/IHRoaXMuZmlsZXMubGVuZ3RoIC0gMSA6IDApO1xyXG5cclxuXHRcdFx0XHR0aGlzLmZvcmNlU2VsZWN0KHRoaXMuZmlsZXNbc2VsZWN0ZWRdID8gc2VsZWN0ZWQgOiAwKTtcclxuXHRcdFx0XHR0aGlzLmVkaXRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkdBTExFUllfVVBEQVRFRCwgZWRpdCk7XHJcblx0XHRcdFx0dGhpcy50aHVtYm5haWxzTW92ZShlZGl0LmRlbGF5VGh1bWJuYWlscyAhPT0gdW5kZWZpbmVkID8gZWRpdC5kZWxheVRodW1ibmFpbHMgOiAyMjApO1xyXG5cclxuXHRcdFx0fSwgKGVkaXQuZGVsYXlSZWZyZXNoICE9PSB1bmRlZmluZWQgPyBlZGl0LmRlbGF5UmVmcmVzaCA6IDQyMCkpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZGVsZXRlIGltYWdlXHJcblx0XHRwdWJsaWMgZGVsZXRlSW1hZ2UoaW5kZXg6IG51bWJlciwgY291bnQ/OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGluZGV4ID0gaW5kZXggPT09IG51bGwgfHwgaW5kZXggPT09IHVuZGVmaW5lZCA/IHRoaXMuc2VsZWN0ZWQgOiBpbmRleDtcclxuXHRcdFx0Y291bnQgPSBjb3VudCA/IGNvdW50IDogMTtcclxuXHJcblx0XHRcdHRoaXMuZmlsZXMuc3BsaWNlKGluZGV4LCBjb3VudCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGZpbmQgaW1hZ2UgaW4gZ2FsbGVyeSBieSBtb2RhbCBzb3VyY2VcclxuXHRcdHB1YmxpYyBmaW5kSW1hZ2UoZmlsZW5hbWUgOiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdGxldCBsZW5ndGggPSB0aGlzLmZpbGVzLmxlbmd0aDtcclxuXHJcblx0XHRcdGZvciAobGV0IGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcclxuXHRcdFx0XHRpZiAodGhpcy5maWxlc1trZXldLnNvdXJjZS5tb2RhbCA9PT0gZmlsZW5hbWUpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZpbGVzW2tleV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgZ2V0RnVsbFVybCh1cmwgOiBzdHJpbmcsIGJhc2VVcmw/OiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdGJhc2VVcmwgPSBiYXNlVXJsID09PSB1bmRlZmluZWQgPyB0aGlzLm9wdGlvbnMuYmFzZVVybCA6IGJhc2VVcmw7XHJcblx0XHRcdGxldCBpc0Z1bGwgPSAodXJsLmluZGV4T2YoJy8vJykgPT09IDAgfHwgdXJsLmluZGV4T2YoJ2h0dHAnKSA9PT0gMCkgPyB0cnVlIDogZmFsc2U7XHJcblxyXG5cdFx0XHRyZXR1cm4gaXNGdWxsID8gdXJsIDogYmFzZVVybCArIHVybDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gYWRkIGltYWdlXHJcblx0XHRwdWJsaWMgYWRkSW1hZ2UodmFsdWU6IGFueSwgaW5kZXg/OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdGlmIChhbmd1bGFyLmlzU3RyaW5nKHZhbHVlKSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHZhbHVlID0geyBzb3VyY2U6IHsgbW9kYWw6IHZhbHVlIH0gfTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGdldEF2YWlsYWJsZVNvdXJjZSA9IGZ1bmN0aW9uICh0eXBlOiBzdHJpbmcsIHNyYzogSVNvdXJjZSkge1xyXG5cclxuXHRcdFx0XHRpZiAoc3JjW3R5cGVdKSB7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIHNlbGYuZ2V0RnVsbFVybChzcmNbdHlwZV0pO1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAncGFuZWwnKSB7XHJcblx0XHRcdFx0XHRcdHR5cGUgPSAnaW1hZ2UnO1xyXG5cdFx0XHRcdFx0XHRpZiAoc3JjW3R5cGVdKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHNlbGYuZ2V0RnVsbFVybChzcmNbdHlwZV0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICdpbWFnZScpIHtcclxuXHRcdFx0XHRcdFx0dHlwZSA9ICdtb2RhbCc7XHJcblx0XHRcdFx0XHRcdGlmIChzcmNbdHlwZV0pIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5nZXRGdWxsVXJsKHNyY1t0eXBlXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ21vZGFsJykge1xyXG5cdFx0XHRcdFx0XHR0eXBlID0gJ2ltYWdlJztcclxuXHRcdFx0XHRcdFx0aWYgKHNyY1t0eXBlXSkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBzZWxmLmdldEZ1bGxVcmwoc3JjW3R5cGVdKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKCF2YWx1ZS5zb3VyY2UpIHtcclxuXHRcdFx0XHR2YWx1ZS5zb3VyY2UgPSB7XHJcblx0XHRcdFx0XHRtb2RhbDogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UubW9kYWxdLFxyXG5cdFx0XHRcdFx0cGFuZWw6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLnBhbmVsXSxcclxuXHRcdFx0XHRcdGltYWdlOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5pbWFnZV0sXHJcblx0XHRcdFx0XHRwbGFjZWhvbGRlcjogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UucGxhY2Vob2xkZXJdXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IHNvdXJjZSA9IHtcclxuXHRcdFx0XHRtb2RhbDogZ2V0QXZhaWxhYmxlU291cmNlKCdtb2RhbCcsIHZhbHVlLnNvdXJjZSksXHJcblx0XHRcdFx0cGFuZWw6IGdldEF2YWlsYWJsZVNvdXJjZSgncGFuZWwnLCB2YWx1ZS5zb3VyY2UpLFxyXG5cdFx0XHRcdGltYWdlOiBnZXRBdmFpbGFibGVTb3VyY2UoJ2ltYWdlJywgdmFsdWUuc291cmNlKSxcclxuXHRcdFx0XHRjb2xvcjogdmFsdWUuY29sb3IgPyB2YWx1ZS5jb2xvciA6ICd0cmFuc3BhcmVudCcsXHJcblx0XHRcdFx0cGxhY2Vob2xkZXI6IHZhbHVlLnBsYWNlaG9sZGVyID8gc2VsZi5nZXRGdWxsVXJsKHZhbHVlLnBsYWNlaG9sZGVyKSA6IG51bGxcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGlmICghc291cmNlLm1vZGFsKSB7XHJcblx0XHRcdFx0c2VsZi5sb2coJ2ludmFsaWQgaW1hZ2UgZGF0YScsIHsgc291cmNlOiBzb3VyY2UsIHZhbHVlOiB2YWx1ZSB9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBwYXJ0cyA9IHNvdXJjZS5tb2RhbC5zcGxpdCgnLycpO1xyXG5cdFx0XHRsZXQgZmlsZW5hbWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcclxuXHRcdFx0bGV0IHRpdGxlLCBzdWJ0aXRsZSwgZGVzY3JpcHRpb247XHJcblxyXG5cdFx0XHRpZiAoc2VsZi5vcHRpb25zLmZpZWxkcyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGl0bGUgPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRpdGxlXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdIDogZmlsZW5hbWU7XHJcblx0XHRcdFx0c3VidGl0bGUgPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnN1YnRpdGxlXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc3VidGl0bGVdIDogbnVsbDtcclxuXHRcdFx0XHRkZXNjcmlwdGlvbiA9IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuZGVzY3JpcHRpb25dID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5kZXNjcmlwdGlvbl0gOiBudWxsO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRpdGxlID0gZmlsZW5hbWU7XHJcblx0XHRcdFx0c3VidGl0bGUgPSBudWxsO1xyXG5cdFx0XHRcdGRlc2NyaXB0aW9uID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0bGV0IGZpbGUgPSB7XHJcblx0XHRcdFx0c291cmNlOiBzb3VyY2UsXHJcblx0XHRcdFx0dGl0bGU6IHRpdGxlLFxyXG5cdFx0XHRcdHN1YnRpdGxlOiBzdWJ0aXRsZSxcclxuXHRcdFx0XHRkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0bG9hZGVkOiB7XHJcblx0XHRcdFx0XHRtb2RhbDogZmFsc2UsXHJcblx0XHRcdFx0XHRwYW5lbDogZmFsc2UsXHJcblx0XHRcdFx0XHRpbWFnZTogZmFsc2VcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpZiAoaW5kZXggIT09IHVuZGVmaW5lZCAmJiB0aGlzLmZpbGVzW2luZGV4XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0gPSBmaWxlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRpZiAoc2VsZi5vcHRpb25zLmR1cGxpY2F0ZXMgIT09IHRydWUgJiYgdGhpcy5maW5kSW1hZ2UoZmlsZS5zb3VyY2UubW9kYWwpKSB7XHJcblx0XHRcdFx0XHRzZWxmLmV2ZW50KHNlbGYuZXZlbnRzLkRPVUJMRV9JTUFHRSwgZmlsZSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLmZpbGVzLnB1c2goZmlsZSk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuc2VydmljZSgnYXNnU2VydmljZScsIFsnJHRpbWVvdXQnLCAnJGludGVydmFsJywgJyRsb2NhdGlvbicsICckcm9vdFNjb3BlJywgJyR3aW5kb3cnLCBTZXJ2aWNlQ29udHJvbGxlcl0pO1xyXG5cclxufVxyXG5cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgVGh1bWJuYWlsQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9uczogSU9wdGlvbnM7XHJcblx0XHRwdWJsaWMgaXRlbXM6IEFycmF5PElGaWxlPjtcclxuXHRcdHB1YmxpYyBiYXNlVXJsOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ3RodW1ibmFpbCc7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlO1xyXG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgbW9kYWwgPSBmYWxzZTtcclxuXHRcdHByaXZhdGUgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihcclxuXHRcdFx0cHJpdmF0ZSBzZXJ2aWNlOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBJU2NvcGUsXHJcblx0XHRcdHByaXZhdGUgJGVsZW1lbnQ6IG5nLklSb290RWxlbWVudFNlcnZpY2UsXHJcblx0XHRcdHByaXZhdGUgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZSkge1xyXG5cclxuXHRcdFx0dGhpcy50ZW1wbGF0ZSA9ICcvdmlld3MvYXNnLXRodW1ibmFpbC5odG1sJztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHRcdC8vIGdldCBwYXJlbnQgYXNnIGNvbXBvbmVudCAobW9kYWwpXHJcblx0XHRcdGlmICh0aGlzLiRzY29wZSAmJiB0aGlzLiRzY29wZS4kcGFyZW50ICYmIHRoaXMuJHNjb3BlLiRwYXJlbnQuJHBhcmVudCAmJiB0aGlzLiRzY29wZS4kcGFyZW50LiRwYXJlbnRbJyRjdHJsJ10pIHtcclxuXHRcdFx0XHR0aGlzLm1vZGFsID0gdGhpcy4kc2NvcGUuJHBhcmVudC4kcGFyZW50WyckY3RybCddLnR5cGUgPT09ICdtb2RhbCcgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICghdGhpcy5tb2RhbCkge1xyXG5cdFx0XHRcdHRoaXMuJHRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblx0XHRcdFx0fSwgNjQwKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXRTZWxlY3RlZChpbmRleDogbnVtYmVyLCAkZXZlbnQ/OiBNb3VzZUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2subW9kYWwpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbE9wZW4oaW5kZXgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLnNlbGVjdCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBwcmVsb2Qgd2hlbiBtb3VzZW92ZXIgYW5kIHNldCBzZWxlY3RlZCBpZiBlbmFibGVkXHJcblx0XHRwdWJsaWMgaG92ZXIoaW5kZXg6IG51bWJlciwgJGV2ZW50PzogTW91c2VFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhvdmVyLnByZWxvYWQgPT09IHRydWUpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5ob3ZlclByZWxvYWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuaG92ZXIuc2VsZWN0ID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCB0aHVtYm5haWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpOiBJT3B0aW9uc1RodW1ibmFpbCB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5tb2RhbCA/IHRoaXMuYXNnLm9wdGlvbnMubW9kYWxbdGhpcy50eXBlXSA6IHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRodW1ibmFpbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlOiBJT3B0aW9uc1RodW1ibmFpbCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubW9kYWwpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5vcHRpb25zLm1vZGFsW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodjogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGFib3ZlIGZyb20gY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGR5bmFtaWMoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcuZHluYW1pYyA/ICdkeW5hbWljJyA6ICcnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBhdXRvaGlkZSBhbmQgaXNTaW5nbGUgPT0gdHJ1ZSA/XHJcblx0XHRwdWJsaWMgZ2V0IGF1dG9oaWRlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLmF1dG9oaWRlICYmIHRoaXMuYXNnLmlzU2luZ2xlID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgY2xhc3Nlc1xyXG5cdFx0cHVibGljIGdldCBjbGFzc2VzKCk6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRsZXQgc2hvdztcclxuXHJcblx0XHRcdGlmICh0aGlzLm1vZGFsKSB7XHJcblx0XHRcdFx0c2hvdyA9IHRoaXMuYXNnLm1vZGFsSW5pdGlhbGl6ZWQgPyAnaW5pdGlhbGl6ZWQnIDogJ2luaXRpYWxpemluZyc7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2hvdyA9IHRoaXMuaW5pdGlhbGl6ZWQgPyAnaW5pdGlhbGl6ZWQnIDogJ2luaXRpYWxpemluZyc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5jbGFzc2VzICsgJyAnICsgdGhpcy5keW5hbWljICsgJyAnICsgc2hvdztcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ1RodW1ibmFpbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJHRpbWVvdXQnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LlRodW1ibmFpbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGRhdGEtbmctaWY9XCIhJGN0cmwuYXV0b2hpZGVcIiBjbGFzcz1cImFzZy10aHVtYm5haWwge3sgJGN0cmwuY2xhc3NlcyB9fVwiIG5nLWNsaWNrPVwiJGN0cmwuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcIj48ZGl2IG5nLWluY2x1ZGU9XCIkY3RybC50ZW1wbGF0ZVwiPjwvZGl2PjwvZGl2PicsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0AnLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nLFxyXG5cdFx0XHRiYXNlVXJsOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiJdfQ==

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('/views/asg-control.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.autoPlayToggle()"><span ng-if="!$ctrl.asg.options.autoplay.enabled" class="fa fa-play"></span> <span ng-if="$ctrl.asg.options.autoplay.enabled" class="fa fa-stop"></span></button> <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toFirst(true)">{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}</button> <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toBackward(true)"><span class="fa fa-chevron-left"></span></button> <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toForward(true)"><span class="fa fa-chevron-right"></span></button>');
$templateCache.put('/views/asg-debug.html','<pre>    \r\n    {{ $ctrl.file | json }}    \r\n</pre><hr><pre>        \r\n    {{ $ctrl.service.instances.abstracts.options | json }}\r\n</pre>');
$templateCache.put('/views/asg-help.html','<ul><li>SPACE : forward</li><li>RIGHT : forward</li><li>LEFT : backward</li><li>UP / HOME : first</li><li>DOWN / END : last</li><li>ENTER : toggle fullscreen</li><li>ESC : exit</li><li>p : play/pause</li><li>t : change transition effect</li><li>m : toggle menu</li><li>s : toggle image size</li><li>c : toggle caption</li><li>h : toggle help</li></ul>');
$templateCache.put('/views/asg-image.html','<div class="asg-image {{ $ctrl.asg.classes }}" ng-class="{\'modalon\' : $ctrl.modalAvailable }" ng-style="{\'min-height\' : $ctrl.config.heightMin + \'px\', \'height\' : $ctrl.height + \'px\'}"><div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)"><div class="img" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-show="$ctrl.asg.selected == key" ng-style="$ctrl.asg.dynamicStyle(file, \'image\', $ctrl.config)" ng-class="{\'loaded\' : file.loaded.image}"><div class="placeholder {{ $ctrl.config.size }}" ng-style="$ctrl.asg.placeholderStyle(file, \'image\')"></div><div class="source {{ $ctrl.config.size }}" ng-style="{\'background-image\': \'url(\' + file.source.image + \')\'}" ng-mouseover="$ctrl.asg.hoverPreload(key)" ng-click="$ctrl.modalOpen($event)"></div></div></div><div class="arrows" ng-if="$ctrl.config.arrows.enabled" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.modalOpen($event)"><div ng-if="!$ctrl.asg.isSingle" class="toBackward"><button class="btn btn-default btn-md pull-left" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)" ng-click="$ctrl.toBackward(true, $event)"><span class="fa fa-chevron-left"></span></button></div><div ng-if="!$ctrl.asg.isSingle" class="toForward"><button class="btn btn-default btn-md pull-right" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)" ng-click="$ctrl.toForward(true, $event)"><span class="fa fa-chevron-right"></span></button></div></div><ng-transclude></ng-transclude></div>');
$templateCache.put('/views/asg-info.html','<div class="row"><div class="col-md-12"><h3>{{ $ctrl.file.title }}</h3></div><div class="col-md-12">{{ $ctrl.file.description }} <a target="_blank" href="{{ $ctrl.download }}"><span class="fa fa-download"></span></a></div></div>');
$templateCache.put('/views/asg-modal.html','<div class="asg-modal {{ $ctrl.asg.classes }}" ng-class="$ctrl.getClass()" ng-click="$ctrl.imageClick($event);" ng-if="$ctrl.asg.modalVisible" ng-cloak><div tabindex="1" class="keyInput" ng-keydown="$ctrl.keyUp($event)"></div><div class="frame" ng-click="$ctrl.asg.modalClick($event);"><div class="header" ng-if="$ctrl.config.header.enabled" ng-click="$ctrl.asg.modalClick($event);"><span class="buttons d-block d-sm-none pull-right"><span ng-include="\'/views/button/asg-index-xs.html\'"></span> </span><span class="buttons d-none d-sm-block pull-right"><span ng-repeat="item in $ctrl.config.header.buttons" ng-include="(\'/views/button/asg-\' + item + \'.html\')"></span> </span><span ng-if="$ctrl.config.title"><span class="title">{{ $ctrl.config.title }}</span> <span class="subtitle d-none d-sm-block" ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span></span></div><div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}" ng-style="{\'top\': $ctrl.marginTop + \'px\', \'bottom\': $ctrl.marginBottom + \'px\'}" ng-mouseover="$ctrl.asg.over.modalImage = true;" ng-mouseleave="$ctrl.asg.over.modalImage = false;"><div class="help text-right" ng-click="$ctrl.toggleHelp($event)" ng-show="$ctrl.config.help" ng-include="\'/views/asg-help.html\'"></div><div class="arrows" ng-if="$ctrl.config.arrows.enabled" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.imageClick($event)"><div ng-if="!$ctrl.asg.isSingle" class="toBackward"><button class="btn btn-default btn-lg pull-left" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)" ng-click="$ctrl.toBackward(true, $event)"><span class="fa fa-chevron-left"></span></button></div><div ng-if="!$ctrl.asg.isSingle" class="toForward"><button class="btn btn-default btn-lg pull-right" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)" ng-click="$ctrl.toForward(true, $event)"><span class="fa fa-chevron-right"></span></button></div></div><div class="img" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-show="$ctrl.asg.selected == key" ng-style="$ctrl.asg.dynamicStyle(file, \'modal\', $ctrl.config)" ng-class="{\'loaded\' : file.loaded.modal}"><div class="placeholder {{ $ctrl.config.size }}" ng-style="$ctrl.asg.placeholderStyle(file, \'modal\')"></div><div class="source {{ $ctrl.config.size }}" ng-if="file.loaded.modal" ng-style="{\'background-image\': \'url(\' + file.source.modal + \')\'}"></div></div><div class="caption {{ $ctrl.config.caption.position }}" ng-show="!$ctrl.config.caption.disabled" ng-class="{\'visible\' : $ctrl.config.caption.visible}"><div class="content"><span class="title">{{ $ctrl.asg.file.title }}</span> <span ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description">- </span><span class="description">{{ $ctrl.asg.file.description }}</span> <a ng-if="$ctrl.config.caption.download" href="{{ $ctrl.asg.downloadLink() }}" target="_blank" class="btn btn-default btn-sm"><span class="fa fa-download"></span> Download</a></div></div></div><ng-transclude></ng-transclude></div></div>');
$templateCache.put('/views/asg-panel.html','<div class="items {{ $ctrl.asg.options.panel.items.class }}"><div class="item {{ $ctrl.asg.options.panel.item.class }}" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-style="{\'background-color\': file.source.color}" ng-class="{\'selected\' : $ctrl.asg.selected == key}"><img ng-src="{{ file.source.panel }}" ng-click="$ctrl.setSelected(key, $event)" alt="{{ file.title }}"><div class="caption" ng-if="$ctrl.config.item.caption"><span class="index" ng-if="$ctrl.config.item.index">{{ key + 1 }}</span> <span>{{ file.title }}</span></div></div></div>');
$templateCache.put('/views/asg-thumbnail.html','<div class="items"><div class="item" ng-click="$ctrl.setSelected(key, $event)" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-style="{\'background-color\': file.source.color}" ng-class="{\'selected\' : $ctrl.asg.selected == key}"><img ng-src="{{ file.source.panel }}" ng-style="{\'height\': $ctrl.config.height + \'px\'}" alt="{{ file.title }}"> <span class="index" ng-if="$ctrl.config.index">{{ key + 1 }}</span></div></div>');
$templateCache.put('/views/button/asg-close.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.close($event)"><span class="fa fa-times"></span></button>');
$templateCache.put('/views/button/asg-fullscreen.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleFullScreen($event)"><span class="fa fa-expand"></span></button>');
$templateCache.put('/views/button/asg-help.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleHelp($event)"><span class="fa fa-question"></span></button>');
$templateCache.put('/views/button/asg-index-xs.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm">{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}</button>');
$templateCache.put('/views/button/asg-index.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toFirst(true, $event)">{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}</button>');
$templateCache.put('/views/button/asg-next.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toForward(true, $event)"><span class="fa fa-chevron-right"></span></button>');
$templateCache.put('/views/button/asg-pin.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleMenu($event)"><span ng-if="!$ctrl.config.header.dynamic" class="fa fa-chevron-up"></span> <span ng-if="$ctrl.config.header.dynamic" class="fa fa-chevron-down"></span></button>');
$templateCache.put('/views/button/asg-playstop.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.autoPlayToggle($event)"><span ng-if="!$ctrl.asg.options.autoplay.enabled" class="fa fa-play"></span> <span ng-if="$ctrl.asg.options.autoplay.enabled" class="fa fa-stop"></span></button>');
$templateCache.put('/views/button/asg-prev.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toBackward(true, $event)"><span class="fa fa-chevron-left"></span></button>');
$templateCache.put('/views/button/asg-size.html','<button class="btn btn-default btn-sm btn-size" ng-click="$ctrl.toggleSize($event)">{{ $ctrl.config.size }}</button>');
$templateCache.put('/views/button/asg-thumbnails.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.toggleThumbnails($event)"><span class="fa fa-ellipsis-h"></span></button>');
$templateCache.put('/views/button/asg-transition.html','<button class="btn btn-default btn-sm btn-transitions" data-ng-if="!$ctrl.asg.isSingle" data-ng-click="$ctrl.nextTransition($event)">{{ $ctrl.config.transition }}</button>');}]);