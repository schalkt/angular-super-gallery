/**
 * angular-super-gallery - AngularJS Super Gallery
 * 
 * @version v2.1.5
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
        function ImageController(service, $rootScope, $element, $timeout, $window, $scope) {
            var _this = this;
            this.service = service;
            this.$rootScope = $rootScope;
            this.$element = $element;
            this.$timeout = $timeout;
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
            var self = this;
            this.$rootScope.$on(this.asg.events.FIRST_IMAGE + this.id, function (event, data) {
                if (!_this.config.height && _this.config.heightAuto.initial === true) {
                    _this.$timeout(function () {
                        self.setHeight(data.img);
                    }, 10);
                }
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
        controller: ['asgService', '$rootScope', '$element', '$timeout', '$window', '$scope', angularSuperGallery.ImageController],
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
            this.version = "2.1.5";
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
                LAST_THUMBNAIL: 'ASG-last-thumbnail-',
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
            if (edit.selected >= 0) {
                selected = edit.selected;
            }
            if (edit.selected == -1) {
                selected = this.files.length - 1;
            }
            selected = this.files[selected] ? selected : (selected >= this.files.length ? this.files.length - 1 : 0);
            this.forceSelect(this.files[selected] ? selected : 0);
            this.timeout(function () {
                _this.editing = false;
                _this.event(_this.events.GALLERY_UPDATED, edit);
                _this.thumbnailsMove(edit.delayThumbnails !== undefined ? edit.delayThumbnails : 220);
                _this.event(_this.events.LAST_THUMBNAIL);
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
        function ThumbnailController(service, $scope, $rootScope, $element, $timeout) {
            this.service = service;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$element = $element;
            this.$timeout = $timeout;
            this.type = 'thumbnail';
            this.modal = false;
            this.loaded = 0;
            this.template = '/views/asg-thumbnail.html';
        }
        ThumbnailController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this);
            var self = this;
            if (this.$scope && this.$scope.$parent && this.$scope.$parent.$parent && this.$scope.$parent.$parent['$ctrl']) {
                this.modal = this.$scope.$parent.$parent['$ctrl'].type === 'modal' ? true : false;
            }
            this.$rootScope.$on(this.asg.events.LAST_THUMBNAIL + this.id, function (event, data) {
                self.asg.thumbnailsMove(10);
                self.$timeout(function () {
                    self.config.initialized = true;
                }, 120);
            });
        };
        ThumbnailController.prototype.onLoad = function (file) {
            file.loaded.panel = true;
            this.loaded++;
            if (this.loaded === this.asg.files.length) {
                this.asg.event(this.asg.events.LAST_THUMBNAIL, file);
                this.config.loaded = true;
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
                return this.asg.classes + ' ' + this.dynamic + ' ' + (this.config.initialized ? 'initialized' : 'initializing');
            },
            enumerable: true,
            configurable: true
        });
        return ThumbnailController;
    }());
    angularSuperGallery.ThumbnailController = ThumbnailController;
    var app = angular.module('angularSuperGallery');
    app.component('asgThumbnail', {
        controller: ['asgService', '$scope', '$rootScope', '$element', '$timeout', angularSuperGallery.ThumbnailController],
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzZy50cyIsImFzZy1jb250cm9sLnRzIiwiYXNnLWRlYnVnLnRzIiwiYXNnLWltYWdlLnRzIiwiYXNnLWluZm8udHMiLCJhc2ctbW9kYWwudHMiLCJhc2ctcGFuZWwudHMiLCJhc2ctc2VydmljZS50cyIsImFzZy10aHVtYm5haWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBVSxtQkFBbUIsQ0EyQjVCO0FBM0JELFdBQVUsbUJBQW1CO0lBRTVCLElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFdkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDdEIsT0FBTyxVQUFVLEtBQVcsRUFBRSxTQUFrQjtZQUUvQyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDakQsT0FBTyxFQUFFLENBQUM7YUFDVjtZQUVELElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtnQkFDaEIsT0FBTyxHQUFHLENBQUM7YUFDWDtZQUVELElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxFQUFFO2dCQUNyQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO2FBQ2Q7WUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FB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Q0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFakgsQ0FBQzs7O1dBQUE7UUFFRiwwQkFBQztJQUFELENBcEpBLEFBb0pDLElBQUE7SUFwSlksdUNBQW1CLHNCQW9KL0IsQ0FBQTtJQUVELElBQUksR0FBRyxHQUFlLE9BQU8sQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUU1RCxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRTtRQUM3QixVQUFVLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixDQUFDLG1CQUFtQixDQUFDO1FBQ25ILFFBQVEsRUFBRSxvS0FBb0s7UUFDOUssUUFBUSxFQUFFO1lBQ1QsRUFBRSxFQUFFLEdBQUc7WUFDUCxLQUFLLEVBQUUsSUFBSTtZQUNYLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFLElBQUk7U0FDYjtLQUNELENBQUMsQ0FBQztBQUVKLENBQUMsRUF4S1MsbUJBQW1CLEtBQW5CLG1CQUFtQixRQXdLNUIiLCJmaWxlIjoiYW5ndWxhci1zdXBlci1nYWxsZXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScsIFsnbmdBbmltYXRlJywgJ25nVG91Y2gnXSk7XHJcblxyXG5cdGFwcC5maWx0ZXIoJ2FzZ0J5dGVzJywgKCkgPT4ge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChieXRlcyA6IGFueSwgcHJlY2lzaW9uIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRpZiAoaXNOYU4ocGFyc2VGbG9hdChieXRlcykpIHx8ICFpc0Zpbml0ZShieXRlcykpIHtcclxuXHRcdFx0XHRyZXR1cm4gJyc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChieXRlcyA9PT0gMCkge1xyXG5cdFx0XHRcdHJldHVybiAnMCc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0eXBlb2YgcHJlY2lzaW9uID09PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdHByZWNpc2lvbiA9IDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCB1bml0cyA9IFsnYnl0ZXMnLCAna0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInXSxcclxuXHRcdFx0XHRudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgubG9nKGJ5dGVzKSAvIE1hdGgubG9nKDEwMjQpKTtcclxuXHJcblx0XHRcdHJldHVybiAoYnl0ZXMgLyBNYXRoLnBvdygxMDI0LCBNYXRoLmZsb29yKG51bWJlcikpKS50b0ZpeGVkKHByZWNpc2lvbikgKyAnICcgKyB1bml0c1tudW1iZXJdO1xyXG5cclxuXHRcdH07XHJcblx0fSk7XHJcblxyXG59XHJcblxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBDb250cm9sQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIHR5cGUgPSAnY29udHJvbCc7XHJcblx0XHRwcml2YXRlIGFzZzogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZTtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihcclxuXHRcdFx0cHJpdmF0ZSBzZXJ2aWNlOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBJU2NvcGUpIHtcclxuXHJcblx0XHRcdHRoaXMudGVtcGxhdGUgPSAnL3ZpZXdzL2FzZy1jb250cm9sLmh0bWwnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdFx0dGhpcy4kc2NvcGUuZm9yd2FyZCA9ICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQodHJ1ZSk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR0aGlzLiRzY29wZS5iYWNrd2FyZCA9ICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IGltYWdlIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKTogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZTogSU9wdGlvbnNJbWFnZSkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0NvbnRyb2wnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5Db250cm9sQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctY29udHJvbCB7eyAkY3RybC5hc2cuY2xhc3NlcyB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgRGVidWdDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcclxuXHRcdHByaXZhdGUgYXNnOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblx0XHRwcml2YXRlIHR5cGU7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKFxyXG5cdFx0XHRwcml2YXRlIHNlcnZpY2U6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0cHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdFx0dGhpcy50eXBlID0gJ2luZm8nO1xyXG5cdFx0XHR0aGlzLnRlbXBsYXRlID0gJy92aWV3cy9hc2ctZGVidWcuaHRtbCc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLmZpbGU7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0RlYnVnJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuRGVidWdDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImFzZy1kZWJ1ZyB7eyAkY3RybC5hc2cuY2xhc3NlcyB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgSW1hZ2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmwgOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ2ltYWdlJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHJvb3RTY29wZSA6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkZWxlbWVudCA6IG5nLklSb290RWxlbWVudFNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICR3aW5kb3cgOiBuZy5JV2luZG93U2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCgncmVzaXplJywgKGV2ZW50KSA9PiB7XHJcblx0XHRcdFx0dGhpcy5vblJlc2l6ZSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBvblJlc2l6ZSgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5oZWlnaHRBdXRvLm9ucmVzaXplKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRIZWlnaHQodGhpcy5hc2cuZmlsZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdC8vIHNldCBpbWFnZSBjb21wb25lbnQgaGVpZ2h0XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kb24odGhpcy5hc2cuZXZlbnRzLkZJUlNUX0lNQUdFICsgdGhpcy5pZCwgKGV2ZW50LCBkYXRhKSA9PiB7XHJcblxyXG5cdFx0XHRcdGlmICghdGhpcy5jb25maWcuaGVpZ2h0ICYmIHRoaXMuY29uZmlnLmhlaWdodEF1dG8uaW5pdGlhbCA9PT0gdHJ1ZSkge1x0XHRcdFxyXG5cdFx0XHRcdFx0dGhpcy4kdGltZW91dCgoKSA9PiB7XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRzZWxmLnNldEhlaWdodChkYXRhLmltZyk7XHJcblx0XHRcdFx0XHR9LCAxMCk7XHRcdFx0XHRcdFxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gc2NvcGUgYXBwbHkgd2hlbiBpbWFnZSBsb2FkZWRcclxuXHRcdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmFzZy5ldmVudHMuTE9BRF9JTUFHRSArIHRoaXMuaWQsIChldmVudCwgZGF0YSkgPT4ge1xyXG5cclxuXHRcdFx0XHR0aGlzLiRzY29wZS4kYXBwbHkoKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29tcG9uZW50IGhlaWdodFxyXG5cdFx0cHJpdmF0ZSBzZXRIZWlnaHQoaW1nKSB7XHJcblxyXG5cdFx0XHRsZXQgd2lkdGggPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCdkaXYnKVswXS5jbGllbnRXaWR0aDtcclxuXHRcdFx0bGV0IHJhdGlvID0gaW1nLndpZHRoIC8gaW1nLmhlaWdodDtcclxuXHRcdFx0dGhpcy5jb25maWcuaGVpZ2h0ID0gd2lkdGggLyByYXRpbztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaGVpZ2h0XHJcblx0XHRwdWJsaWMgZ2V0IGhlaWdodCgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5oZWlnaHQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zSW1hZ2UpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9CYWNrd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHRpZiAoJGV2ZW50KSB7XHJcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHN0b3ApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICgkZXZlbnQpIHtcclxuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZChzdG9wKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGhvdmVyKGluZGV4IDogbnVtYmVyLCAkZXZlbnQ/IDogTW91c2VFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmFycm93cy5wcmVsb2FkID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuaG92ZXJQcmVsb2FkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG1vZGFsIGF2YWlsYWJsZVxyXG5cdFx0cHVibGljIGdldCBtb2RhbEF2YWlsYWJsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5tb2RhbEF2YWlsYWJsZSAmJiB0aGlzLmNvbmZpZy5jbGljay5tb2RhbDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3BlbiB0aGUgbW9kYWxcclxuXHRcdHB1YmxpYyBtb2RhbE9wZW4oJGV2ZW50IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKCRldmVudCkge1xyXG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLm1vZGFsKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxPcGVuKHRoaXMuYXNnLnNlbGVjdGVkKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0ltYWdlJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnJGVsZW1lbnQnLCAnJHRpbWVvdXQnLCAnJHdpbmRvdycsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LkltYWdlQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hc2ctaW1hZ2UuaHRtbCcsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgSW5mb0NvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZDogc3RyaW5nO1xyXG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgdHlwZTtcclxuXHRcdHByaXZhdGUgdGVtcGxhdGU7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IoXHJcblx0XHRcdHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRwcml2YXRlICRzY29wZTogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHR0aGlzLnR5cGUgPSAnaW5mbyc7XHJcblx0XHRcdHRoaXMudGVtcGxhdGUgPSAnL3ZpZXdzL2FzZy1pbmZvLmh0bWwnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgZ2V0IGZpbGUoKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5maWxlO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dJbmZvJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuSW5mb0NvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYXNnLWluZm8ge3sgJGN0cmwuYXNnLmNsYXNzZXMgfX1cIj48ZGl2IG5nLWluY2x1ZGU9XCIkY3RybC50ZW1wbGF0ZVwiPjwvZGl2PjwvZGl2PicsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIE1vZGFsQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHRcdHB1YmxpYyBiYXNlVXJsIDogc3RyaW5nO1xyXG5cclxuXHRcdHByaXZhdGUgdHlwZSA9ICdtb2RhbCc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgYXJyb3dzVmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHdpbmRvdyA6IG5nLklXaW5kb3dTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkcm9vdFNjb3BlIDogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICRzY29wZSA6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHRcdFx0dGhpcy5hc2cubW9kYWxBdmFpbGFibGUgPSB0cnVlO1xyXG5cclxuXHRcdFx0Ly8gc2NvcGUgYXBwbHkgd2hlbiBpbWFnZSBsb2FkZWRcclxuXHRcdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmFzZy5ldmVudHMuTE9BRF9JTUFHRSArIHRoaXMuaWQsIChldmVudCwgZGF0YSkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuJHNjb3BlLiRhcHBseSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgZ2V0Q2xhc3MoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuY29uZmlnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgbmdDbGFzcyA9IFtdO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhlYWRlci5keW5hbWljKSB7XHJcblx0XHRcdFx0bmdDbGFzcy5wdXNoKCdkeW5hbWljJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5nQ2xhc3MucHVzaCh0aGlzLmFzZy5vcHRpb25zLnRoZW1lKTtcclxuXHJcblx0XHRcdHJldHVybiBuZ0NsYXNzLmpvaW4oJyAnKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGFjdGlvbiBmcm9tIGtleWNvZGVzXHJcblx0XHRwcml2YXRlIGdldEFjdGlvbkJ5S2V5Q29kZShrZXlDb2RlIDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmtleWNvZGVzKTtcclxuXHRcdFx0bGV0IGFjdGlvbjtcclxuXHJcblx0XHRcdGZvciAobGV0IGtleSBpbiBrZXlzKSB7XHJcblxyXG5cdFx0XHRcdGxldCBjb2RlcyA9IHRoaXMuY29uZmlnLmtleWNvZGVzW2tleXNba2V5XV07XHJcblxyXG5cdFx0XHRcdGlmICghY29kZXMpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGluZGV4ID0gY29kZXMuaW5kZXhPZihrZXlDb2RlKTtcclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcclxuXHRcdFx0XHRcdGFjdGlvbiA9IGtleXNba2V5XTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBhY3Rpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgY2xvc2UoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbG9zZSgpO1xyXG5cdFx0XHR0aGlzLmV4aXRGdWxsU2NyZWVuKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBpbWFnZUNsaWNrKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2suY2xvc2UpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbENsb3NlKCk7XHJcblx0XHRcdFx0dGhpcy5leGl0RnVsbFNjcmVlbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBob3ZlcihpbmRleCA6IG51bWJlciwgJGV2ZW50PyA6IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5hcnJvd3MucHJlbG9hZCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHNldEZvY3VzKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBhdXRvUGxheVRvZ2dsZSgkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy5hdXRvUGxheVRvZ2dsZSgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9GaXJzdChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnRvRmlyc3QoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHRvQmFja3dhcmQoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHN0b3ApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHN0b3ApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9MYXN0KHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cudG9MYXN0KHN0b3ApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBkbyBrZXlib2FyZCBhY3Rpb25cclxuXHRcdHB1YmxpYyBrZXlVcChlIDogS2V5Ym9hcmRFdmVudCkge1xyXG5cclxuXHRcdFx0bGV0IGFjdGlvbiA6IHN0cmluZyA9IHRoaXMuZ2V0QWN0aW9uQnlLZXlDb2RlKGUua2V5Q29kZSk7XHJcblxyXG5cdFx0XHRzd2l0Y2ggKGFjdGlvbikge1xyXG5cclxuXHRcdFx0XHRjYXNlICdleGl0JzpcclxuXHRcdFx0XHRcdHRoaXMuY2xvc2UoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdwbGF5cGF1c2UnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cuYXV0b1BsYXlUb2dnbGUoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdmb3J3YXJkJzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdiYWNrd2FyZCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2ZpcnN0JzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvRmlyc3QodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnbGFzdCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0xhc3QodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnZnVsbHNjcmVlbic6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUZ1bGxTY3JlZW4oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdtZW51JzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTWVudSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2NhcHRpb24nOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVDYXB0aW9uKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnaGVscCc6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUhlbHAoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdzaXplJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlU2l6ZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3RyYW5zaXRpb24nOlxyXG5cdFx0XHRcdFx0dGhpcy5uZXh0VHJhbnNpdGlvbigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy5sb2coJ3Vua25vd24ga2V5Ym9hcmQgYWN0aW9uOiAnICsgZS5rZXlDb2RlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gc3dpdGNoIHRvIG5leHQgdHJhbnNpdGlvbiBlZmZlY3RcclxuXHRcdHByaXZhdGUgbmV4dFRyYW5zaXRpb24oJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0bGV0IGlkeCA9IHRoaXMuYXNnLnRyYW5zaXRpb25zLmluZGV4T2YodGhpcy5jb25maWcudHJhbnNpdGlvbikgKyAxO1xyXG5cdFx0XHRsZXQgbmV4dCA9IGlkeCA+PSB0aGlzLmFzZy50cmFuc2l0aW9ucy5sZW5ndGggPyAwIDogaWR4O1xyXG5cdFx0XHR0aGlzLmNvbmZpZy50cmFuc2l0aW9uID0gdGhpcy5hc2cudHJhbnNpdGlvbnNbbmV4dF07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBmdWxsc2NyZWVuXHJcblx0XHRwcml2YXRlIHRvZ2dsZUZ1bGxTY3JlZW4oJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHRcdGlmICghdGhpcy4kd2luZG93LnNjcmVlbmZ1bGwpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsLnRvZ2dsZSgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBleGl0IGZ1bGxzY3JlZW5cclxuXHRcdHByaXZhdGUgZXhpdEZ1bGxTY3JlZW4oKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsLmlzRnVsbHNjcmVlbikge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwuZXhpdCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgdGh1bWJuYWlsc1xyXG5cdFx0cHJpdmF0ZSB0b2dnbGVUaHVtYm5haWxzKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuY29uZmlnLnRodW1ibmFpbC5keW5hbWljID0gIXRoaXMuY29uZmlnLnRodW1ibmFpbC5keW5hbWljO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdHJhbnNpdGlvbiBlZmZlY3RcclxuXHRcdHB1YmxpYyBzZXRUcmFuc2l0aW9uKHRyYW5zaXRpb24sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuY29uZmlnLnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdGhlbWVcclxuXHRcdHB1YmxpYyBzZXRUaGVtZSh0aGVtZSA6IHN0cmluZywgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cub3B0aW9ucy50aGVtZSA9IHRoZW1lO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgaGVscFxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVIZWxwKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuY29uZmlnLmhlbHAgPSAhdGhpcy5jb25maWcuaGVscDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIHNpemVcclxuXHRcdHByaXZhdGUgdG9nZ2xlU2l6ZSgkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHRsZXQgaW5kZXggPSB0aGlzLmFzZy5zaXplcy5pbmRleE9mKHRoaXMuY29uZmlnLnNpemUpO1xyXG5cdFx0XHRpbmRleCA9IChpbmRleCArIDEpID49IHRoaXMuYXNnLnNpemVzLmxlbmd0aCA/IDAgOiArK2luZGV4O1xyXG5cdFx0XHR0aGlzLmNvbmZpZy5zaXplID0gdGhpcy5hc2cuc2l6ZXNbaW5kZXhdO1xyXG5cdFx0XHR0aGlzLmFzZy5sb2coJ3RvZ2dsZSBpbWFnZSBzaXplOicsIFt0aGlzLmNvbmZpZy5zaXplLCBpbmRleF0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgbWVudVxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVNZW51KCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuY29uZmlnLmhlYWRlci5keW5hbWljID0gIXRoaXMuY29uZmlnLmhlYWRlci5keW5hbWljO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgY2FwdGlvblxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVDYXB0aW9uKCkge1xyXG5cclxuXHRcdFx0dGhpcy5jb25maWcuY2FwdGlvbi52aXNpYmxlID0gIXRoaXMuY29uZmlnLmNhcHRpb24udmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1hcmdpbnQgdG9wXHJcblx0XHRwdWJsaWMgZ2V0IG1hcmdpblRvcCgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5tYXJnaW5Ub3A7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtYXJnaW4gYm90dG9tXHJcblx0XHRwdWJsaWMgZ2V0IG1hcmdpbkJvdHRvbSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5tYXJnaW5Cb3R0b207XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtb2RhbCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgZ2V0IHZpc2libGUoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cubW9kYWxWaXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgbW9kYWwgdmlzaWJsZVxyXG5cdFx0cHVibGljIHNldCB2aXNpYmxlKHZhbHVlIDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxWaXNpYmxlID0gdmFsdWU7XHJcblx0XHRcdHRoaXMuYXNnLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbW9kYWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNNb2RhbCB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgbW9kYWwgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zTW9kYWwpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHJcblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dNb2RhbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckd2luZG93JywgJyRyb290U2NvcGUnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5Nb2RhbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXNnLW1vZGFsLmh0bWwnLFxyXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PycsXHJcblx0XHRcdGJhc2VVcmw6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgUGFuZWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtczogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmw6IHN0cmluZztcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgPSAncGFuZWwnO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZTtcclxuXHRcdHByaXZhdGUgYXNnOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IoXHJcblx0XHRcdHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRwcml2YXRlICRzY29wZTogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0XHR0aGlzLnRlbXBsYXRlID0gJy92aWV3cy9hc2ctcGFuZWwuaHRtbCc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldFNlbGVjdGVkKGluZGV4OiBudW1iZXIsICRldmVudD86IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5tb2RhbCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLm1vZGFsT3BlbihpbmRleCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2suc2VsZWN0KSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBob3ZlcihpbmRleDogbnVtYmVyLCAkZXZlbnQ/OiBNb3VzZUV2ZW50KSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuaG92ZXIucHJlbG9hZCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5ob3Zlci5zZWxlY3QgPT09IHRydWUpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5zZXRTZWxlY3RlZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHBhbmVsIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKTogSU9wdGlvbnNQYW5lbCB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgcGFuZWwgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZTogSU9wdGlvbnNQYW5lbCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnUGFuZWwnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5QYW5lbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYXNnLXBhbmVsIHt7ICRjdHJsLmFzZy5jbGFzc2VzIH19XCIgbmctbW91c2VvdmVyPVwiJGN0cmwuYXNnLm92ZXIucGFuZWwgPSB0cnVlO1wiIG5nLW1vdXNlbGVhdmU9XCIkY3RybC5hc2cub3Zlci5wYW5lbCA9IGZhbHNlO1wiIG5nLXNob3c9XCIkY3RybC5jb25maWcudmlzaWJsZVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPjwvZGl2PicsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAJyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR2aXNpYmxlOiAnPT8nLFxyXG5cdFx0XHR0ZW1wbGF0ZTogJ0A/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XG5cblx0Ly8gbW9kYWwgY29tcG9uZW50IG9wdGlvbnNcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc01vZGFsIHtcblxuXHRcdGhlYWRlcj86IHtcblx0XHRcdGVuYWJsZWQ/OiBib29sZWFuO1xuXHRcdFx0ZHluYW1pYz86IGJvb2xlYW47XG5cdFx0XHRidXR0b25zOiBBcnJheTxzdHJpbmc+O1xuXHRcdH07XG5cdFx0aGVscD86IGJvb2xlYW47XG5cdFx0Y2FwdGlvbj86IHtcblx0XHRcdGRpc2FibGVkPzogYm9vbGVhbjtcblx0XHRcdHZpc2libGU/OiBib29sZWFuO1xuXHRcdFx0cG9zaXRpb24/OiBzdHJpbmc7XG5cdFx0XHRkb3dubG9hZD86IGJvb2xlYW47XG5cdFx0fTtcblx0XHRwbGFjZWhvbGRlcj86IHN0cmluZztcblx0XHR0cmFuc2l0aW9uPzogc3RyaW5nO1xuXHRcdHRyYW5zaXRpb25TcGVlZD8gOiBudW1iZXI7XG5cdFx0dGl0bGU/OiBzdHJpbmc7XG5cdFx0c3VidGl0bGU/OiBzdHJpbmc7XG5cdFx0dGl0bGVGcm9tSW1hZ2U/IDogYm9vbGVhbjtcblx0XHRzdWJ0aXRsZUZyb21JbWFnZT8gOiBib29sZWFuO1xuXHRcdGFycm93cz86IHtcblx0XHRcdHByZWxvYWQ/OiBib29sZWFuO1xuXHRcdFx0ZW5hYmxlZD86IGJvb2xlYW47XG5cdFx0fTtcblx0XHRzaXplPzogc3RyaW5nO1xuXHRcdHRodW1ibmFpbD86IElPcHRpb25zVGh1bWJuYWlsO1xuXHRcdG1hcmdpblRvcD86IG51bWJlcjtcblx0XHRtYXJnaW5Cb3R0b20/OiBudW1iZXI7XG5cdFx0Y2xpY2s/OiB7XG5cdFx0XHRjbG9zZTogYm9vbGVhbjtcblx0XHR9O1xuXHRcdGtleWNvZGVzPzoge1xuXHRcdFx0ZXhpdD86IEFycmF5PG51bWJlcj47XG5cdFx0XHRwbGF5cGF1c2U/OiBBcnJheTxudW1iZXI+O1xuXHRcdFx0Zm9yd2FyZD86IEFycmF5PG51bWJlcj47XG5cdFx0XHRiYWNrd2FyZD86IEFycmF5PG51bWJlcj47XG5cdFx0XHRmaXJzdD86IEFycmF5PG51bWJlcj47XG5cdFx0XHRsYXN0PzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGZ1bGxzY3JlZW4/OiBBcnJheTxudW1iZXI+O1xuXHRcdFx0bWVudT86IEFycmF5PG51bWJlcj47XG5cdFx0XHRjYXB0aW9uPzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGhlbHA/OiBBcnJheTxudW1iZXI+O1xuXHRcdFx0c2l6ZT86IEFycmF5PG51bWJlcj47XG5cdFx0XHR0cmFuc2l0aW9uPzogQXJyYXk8bnVtYmVyPjtcblx0XHR9O1xuXHR9XG5cblx0Ly8gcGFuZWwgY29tcG9uZW50IG9wdGlvbnNcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc1BhbmVsIHtcblxuXHRcdHZpc2libGU/OiBib29sZWFuO1xuXHRcdGl0ZW1zPzoge1xuXHRcdFx0Y2xhc3M/OiBzdHJpbmc7XG5cdFx0fSxcblx0XHRpdGVtPzoge1xuXHRcdFx0Y2xhc3M/OiBzdHJpbmc7XG5cdFx0XHRjYXB0aW9uOiBib29sZWFuO1xuXHRcdFx0aW5kZXg6IGJvb2xlYW47XG5cdFx0fTtcblx0XHRob3Zlcj86IHtcblx0XHRcdHByZWxvYWQ6IGJvb2xlYW47XG5cdFx0XHRzZWxlY3Q6IGJvb2xlYW47XG5cdFx0fTtcblx0XHRjbGljaz86IHtcblx0XHRcdHNlbGVjdDogYm9vbGVhbjtcblx0XHRcdG1vZGFsOiBib29sZWFuO1xuXHRcdH07XG5cblx0fVxuXG5cdC8vIHRodW1ibmFpbCBjb21wb25lbnQgb3B0aW9uc1xuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zVGh1bWJuYWlsIHtcblxuXHRcdGhlaWdodD86IG51bWJlcjtcblx0XHRpbmRleD86IGJvb2xlYW47XG5cdFx0ZW5hYmxlZD86IGJvb2xlYW47XG5cdFx0ZHluYW1pYz86IGJvb2xlYW47XG5cdFx0YXV0b2hpZGU6IGJvb2xlYW47XG5cdFx0Y2xpY2s/OiB7XG5cdFx0XHRzZWxlY3Q6IGJvb2xlYW47XG5cdFx0XHRtb2RhbDogYm9vbGVhbjtcblx0XHR9O1xuXHRcdGhvdmVyPzoge1xuXHRcdFx0cHJlbG9hZDogYm9vbGVhbjtcblx0XHRcdHNlbGVjdDogYm9vbGVhbjtcblx0XHR9O1xuXHRcdGxvYWRlZD86IGJvb2xlYW47XG5cdFx0aW5pdGlhbGl6ZWQ/OiBib29sZWFuO1xuXG5cdH1cblxuXHQvLyBpbmZvIGNvbXBvbmVudCBvcHRpb25zXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNJbmZvIHtcblxuXHR9XG5cblx0Ly8gaW1hZ2UgY29tcG9uZW50IG9wdGlvbnNcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0ltYWdlIHtcblxuXHRcdHRyYW5zaXRpb24/OiBzdHJpbmc7XG5cdFx0dHJhbnNpdGlvblNwZWVkPyA6IG51bWJlcjtcblx0XHRzaXplPzogc3RyaW5nO1xuXHRcdGFycm93cz86IHtcblx0XHRcdHByZWxvYWQ/OiBib29sZWFuO1xuXHRcdFx0ZW5hYmxlZD86IGJvb2xlYW47XG5cdFx0fTtcblx0XHRjbGljaz86IHtcblx0XHRcdG1vZGFsOiBib29sZWFuO1xuXHRcdH07XG5cdFx0aGVpZ2h0PzogbnVtYmVyO1xuXHRcdGhlaWdodE1pbj86IG51bWJlcjtcblx0XHRoZWlnaHRBdXRvPzoge1xuXHRcdFx0aW5pdGlhbD86IGJvb2xlYW47XG5cdFx0XHRvbnJlc2l6ZT86IGJvb2xlYW47XG5cdFx0fTtcblx0XHRwbGFjZWhvbGRlcjogc3RyaW5nO1xuXHR9XG5cblx0Ly8gZ2FsbGVyeSBvcHRpb25zXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xuXG5cdFx0ZGVidWc/OiBib29sZWFuO1xuXHRcdGJhc2VVcmw/OiBzdHJpbmc7XG5cdFx0aGFzaFVybD86IGJvb2xlYW47XG5cdFx0ZHVwbGljYXRlcz86IGJvb2xlYW47XG5cdFx0c2VsZWN0ZWQ/OiBudW1iZXI7XG5cdFx0ZmllbGRzPzoge1xuXHRcdFx0c291cmNlPzoge1xuXHRcdFx0XHRtb2RhbD86IHN0cmluZztcblx0XHRcdFx0cGFuZWw/OiBzdHJpbmc7XG5cdFx0XHRcdGltYWdlPzogc3RyaW5nO1xuXHRcdFx0XHRwbGFjZWhvbGRlcj86IHN0cmluZztcblx0XHRcdH1cblx0XHRcdHRpdGxlPzogc3RyaW5nO1xuXHRcdFx0c3VidGl0bGU/OiBzdHJpbmc7XG5cdFx0XHRkZXNjcmlwdGlvbj86IHN0cmluZztcblx0XHRcdHRodW1ibmFpbD86IHN0cmluZztcblx0XHR9O1xuXHRcdGF1dG9wbGF5Pzoge1xuXHRcdFx0ZW5hYmxlZD86IGJvb2xlYW47XG5cdFx0XHRkZWxheT86IG51bWJlcjtcblx0XHR9O1xuXHRcdHRoZW1lPzogc3RyaW5nO1xuXHRcdHByZWxvYWQ/OiBBcnJheTxudW1iZXI+O1xuXHRcdHByZWxvYWROZXh0PzogYm9vbGVhbjtcblx0XHRwcmVsb2FkRGVsYXk/OiBudW1iZXI7XG5cdFx0bG9hZGluZ0ltYWdlPzogc3RyaW5nO1xuXHRcdG1vZGFsPzogSU9wdGlvbnNNb2RhbDtcblx0XHRwYW5lbD86IElPcHRpb25zUGFuZWw7XG5cdFx0aW1hZ2U/OiBJT3B0aW9uc0ltYWdlO1xuXHRcdHRodW1ibmFpbD86IElPcHRpb25zVGh1bWJuYWlsO1xuXG5cdH1cblxuXHQvLyBpbWFnZSBzb3VyY2Vcblx0ZXhwb3J0IGludGVyZmFjZSBJU291cmNlIHtcblxuXHRcdG1vZGFsOiBzdHJpbmc7IC8vIG9yaWdpbmFsLCByZXF1aXJlZFxuXHRcdHBhbmVsPzogc3RyaW5nO1xuXHRcdGltYWdlPzogc3RyaW5nO1xuXHRcdGNvbG9yPzogc3RyaW5nO1xuXHRcdHBsYWNlaG9sZGVyPzogc3RyaW5nO1xuXG5cdH1cblxuXHQvLyBpbWFnZSBmaWxlXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUZpbGUge1xuXG5cdFx0c291cmNlOiBJU291cmNlO1xuXHRcdHRpdGxlPzogc3RyaW5nO1xuXHRcdHN1YnRpdGxlPzogc3RyaW5nO1xuXHRcdG5hbWU/OiBzdHJpbmc7XG5cdFx0ZXh0ZW5zaW9uPzogc3RyaW5nO1xuXHRcdGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXHRcdGRvd25sb2FkPzogc3RyaW5nO1xuXHRcdGxvYWRlZD86IHtcblx0XHRcdG1vZGFsPzogYm9vbGVhbjtcblx0XHRcdHBhbmVsPzogYm9vbGVhbjtcblx0XHRcdGltYWdlPzogYm9vbGVhbjtcblx0XHR9O1xuXHRcdHdpZHRoPzogbnVtYmVyO1xuXHRcdGhlaWdodD86IG51bWJlcjtcblxuXHR9XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJT3ZlciB7XG5cdFx0bW9kYWxJbWFnZTogYm9vbGVhbjtcblx0XHRwYW5lbDogYm9vbGVhbjtcblx0fVxuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUVkaXQge1xuXHRcdGlkOiBudW1iZXI7XG5cdFx0ZGVsZXRlPzogbnVtYmVyO1xuXHRcdGFkZD86IEFycmF5PElGaWxlPjtcblx0XHR1cGRhdGU/OiBBcnJheTxJRmlsZT47XG5cdFx0cmVmcmVzaD86IGJvb2xlYW47XG5cdFx0c2VsZWN0ZWQ/OiBudW1iZXI7XG5cdFx0b3B0aW9ucz86IElPcHRpb25zO1xuXHRcdGRlbGF5VGh1bWJuYWlscz86IG51bWJlcjtcblx0XHRkZWxheVJlZnJlc2g/OiBudW1iZXI7XG5cdH1cblxuXHRleHBvcnQgaW50ZXJmYWNlIElTY29wZSBleHRlbmRzIG5nLklTY29wZSB7XG5cdFx0Zm9yd2FyZDogKCkgPT4gdm9pZDtcblx0XHRiYWNrd2FyZDogKCkgPT4gdm9pZDtcblx0fVxuXG5cdC8vIHNlcnZpY2UgY29udHJvbGxlciBpbnRlcmZhY2Vcblx0ZXhwb3J0IGludGVyZmFjZSBJU2VydmljZUNvbnRyb2xsZXIge1xuXG5cdFx0bW9kYWxWaXNpYmxlOiBib29sZWFuO1xuXHRcdHBhbmVsVmlzaWJsZTogYm9vbGVhbjtcblx0XHRtb2RhbEF2YWlsYWJsZTogYm9vbGVhbjtcblx0XHRtb2RhbEluaXRpYWxpemVkOiBib29sZWFuO1xuXHRcdHRyYW5zaXRpb25zOiBBcnJheTxzdHJpbmc+O1xuXHRcdHRoZW1lczogQXJyYXk8c3RyaW5nPjtcblx0XHRjbGFzc2VzOiBzdHJpbmc7XG5cdFx0b3B0aW9uczogSU9wdGlvbnM7XG5cdFx0aXRlbXM6IEFycmF5PElGaWxlPjtcblx0XHRzZWxlY3RlZDogbnVtYmVyO1xuXHRcdGZpbGU6IElGaWxlO1xuXHRcdGZpbGVzOiBBcnJheTxJRmlsZT47XG5cdFx0c2l6ZXM6IEFycmF5PHN0cmluZz47XG5cdFx0aWQ6IHN0cmluZztcblx0XHRpc1NpbmdsZTogYm9vbGVhbjtcblx0XHRldmVudHM6IHtcblx0XHRcdENPTkZJR19MT0FEOiBzdHJpbmc7XG5cdFx0XHRBVVRPUExBWV9TVEFSVDogc3RyaW5nO1xuXHRcdFx0QVVUT1BMQVlfU1RPUDogc3RyaW5nO1xuXHRcdFx0UEFSU0VfSU1BR0VTOiBzdHJpbmc7XG5cdFx0XHRMT0FEX0lNQUdFOiBzdHJpbmc7XG5cdFx0XHRGSVJTVF9JTUFHRTogc3RyaW5nO1xuXHRcdFx0Q0hBTkdFX0lNQUdFOiBzdHJpbmc7XG5cdFx0XHRET1VCTEVfSU1BR0U6IHN0cmluZztcblx0XHRcdE1PREFMX09QRU46IHN0cmluZztcblx0XHRcdE1PREFMX0NMT1NFOiBzdHJpbmc7XG5cdFx0XHRHQUxMRVJZX1VQREFURUQ6IHN0cmluZztcblx0XHRcdEdBTExFUllfRURJVDogc3RyaW5nO1xuXHRcdFx0TEFTVF9USFVNQk5BSUw6IHN0cmluZztcblx0XHR9O1xuXG5cdFx0Z2V0SW5zdGFuY2UoY29tcG9uZW50OiBhbnkpOiBJU2VydmljZUNvbnRyb2xsZXI7XG5cblx0XHRzZXREZWZhdWx0cygpOiB2b2lkO1xuXG5cdFx0c2V0T3B0aW9ucyhvcHRpb25zOiBJT3B0aW9ucyk6IElPcHRpb25zO1xuXG5cdFx0c2V0SXRlbXMoaXRlbXM6IEFycmF5PElGaWxlPiwgZm9yY2U/OiBib29sZWFuKTogdm9pZDtcblxuXHRcdHByZWxvYWQod2FpdD86IG51bWJlcik6IHZvaWQ7XG5cblx0XHRub3JtYWxpemUoaW5kZXg6IG51bWJlcik6IG51bWJlcjtcblxuXHRcdHNldEZvY3VzKCk6IHZvaWQ7XG5cblx0XHRzZXRTZWxlY3RlZChpbmRleDogbnVtYmVyKTtcblxuXHRcdG1vZGFsT3BlbihpbmRleDogbnVtYmVyKTogdm9pZDtcblxuXHRcdG1vZGFsQ2xvc2UoKTogdm9pZDtcblxuXHRcdG1vZGFsQ2xpY2soJGV2ZW50PzogVUlFdmVudCk6IHZvaWQ7XG5cblx0XHR0aHVtYm5haWxzTW92ZShkZWxheT86IG51bWJlcik6IHZvaWQ7XG5cblx0XHR0b0JhY2t3YXJkKHN0b3A/OiBib29sZWFuKTogdm9pZDtcblxuXHRcdHRvRm9yd2FyZChzdG9wPzogYm9vbGVhbik6IHZvaWQ7XG5cblx0XHR0b0ZpcnN0KHN0b3A/OiBib29sZWFuKTogdm9pZDtcblxuXHRcdHRvTGFzdChzdG9wPzogYm9vbGVhbik6IHZvaWQ7XG5cblx0XHRsb2FkSW1hZ2UoaW5kZXg/OiBudW1iZXIpOiB2b2lkO1xuXG5cdFx0bG9hZEltYWdlcyhpbmRleGVzOiBBcnJheTxudW1iZXI+KTogdm9pZDtcblxuXHRcdGhvdmVyUHJlbG9hZChpbmRleDogbnVtYmVyKTogdm9pZDtcblxuXHRcdGF1dG9QbGF5VG9nZ2xlKCk6IHZvaWQ7XG5cblx0XHR0b2dnbGUoZWxlbWVudDogc3RyaW5nKTogdm9pZDtcblxuXHRcdHNldEhhc2goKTogdm9pZDtcblxuXHRcdGRvd25sb2FkTGluaygpOiBzdHJpbmc7XG5cblx0XHRlbChzZWxlY3Rvcik6IE5vZGVMaXN0O1xuXG5cdFx0bG9nKGV2ZW50OiBzdHJpbmcsIGRhdGE/OiBhbnkpOiB2b2lkO1xuXG5cdFx0ZXZlbnQoZXZlbnQ6IHN0cmluZywgZGF0YT86IGFueSk7XG5cblx0fVxuXG5cdC8vIHNlcnZpY2UgY29udHJvbGxlclxuXHRleHBvcnQgY2xhc3MgU2VydmljZUNvbnRyb2xsZXIge1xuXG5cdFx0cHVibGljIHZlcnNpb24gPSBcIjIuMS41XCI7XG5cdFx0cHVibGljIHNsdWcgPSAnYXNnJztcblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcblx0XHRwdWJsaWMgaXRlbXM6IEFycmF5PElGaWxlPiA9IFtdO1xuXHRcdHB1YmxpYyBmaWxlczogQXJyYXk8SUZpbGU+ID0gW107XG5cdFx0cHVibGljIGRpcmVjdGlvbjogc3RyaW5nO1xuXHRcdHB1YmxpYyBtb2RhbEF2YWlsYWJsZSA9IGZhbHNlO1xuXHRcdHB1YmxpYyBtb2RhbEluaXRpYWxpemVkID0gZmFsc2U7XG5cblx0XHRwcml2YXRlIGluc3RhbmNlczoge30gPSB7fTtcblx0XHRwcml2YXRlIF9zZWxlY3RlZDogbnVtYmVyO1xuXHRcdHByaXZhdGUgX3Zpc2libGUgPSBmYWxzZTtcblx0XHRwcml2YXRlIGF1dG9wbGF5OiBhbmd1bGFyLklQcm9taXNlPGFueT47XG5cdFx0cHJpdmF0ZSBmaXJzdCA9IGZhbHNlO1xuXHRcdHByaXZhdGUgZWRpdGluZyA9IGZhbHNlO1xuXG5cdFx0cHVibGljIG9wdGlvbnM6IElPcHRpb25zID0gbnVsbDtcblx0XHRwdWJsaWMgb3B0aW9uc0xvYWRlZCA9IGZhbHNlO1xuXHRcdHB1YmxpYyBkZWZhdWx0czogSU9wdGlvbnMgPSB7XG5cdFx0XHRkZWJ1ZzogZmFsc2UsIC8vIGltYWdlIGxvYWQsIGF1dG9wbGF5LCBldGMuIGluZm8gaW4gY29uc29sZS5sb2dcblx0XHRcdGhhc2hVcmw6IHRydWUsIC8vIGVuYWJsZS9kaXNhYmxlIGhhc2ggdXNhZ2UgaW4gdXJsICgjYXNnLW5hdHVyZS00KVxuXHRcdFx0YmFzZVVybDogJycsIC8vIHVybCBwcmVmaXhcblx0XHRcdGR1cGxpY2F0ZXM6IGZhbHNlLCAvLyBlbmFibGUgb3IgZGlzYWJsZSBzYW1lIGltYWdlcyAodXJsKSBpbiBnYWxsZXJ5XG5cdFx0XHRzZWxlY3RlZDogMCwgLy8gc2VsZWN0ZWQgaW1hZ2Ugb24gaW5pdFxuXHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdHNvdXJjZToge1xuXHRcdFx0XHRcdG1vZGFsOiAndXJsJywgLy8gcmVxdWlyZWQsIGltYWdlIHVybCBmb3IgbW9kYWwgY29tcG9uZW50IChsYXJnZSBzaXplKVxuXHRcdFx0XHRcdHBhbmVsOiAndXJsJywgLy8gaW1hZ2UgdXJsIGZvciBwYW5lbCBjb21wb25lbnQgKHRodW1ibmFpbCBzaXplKVxuXHRcdFx0XHRcdGltYWdlOiAndXJsJywgLy8gaW1hZ2UgdXJsIGZvciBpbWFnZSAobWVkaXVtIG9yIGN1c3RvbSBzaXplKVxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyOiBudWxsIC8vIGltYWdlIHVybCBmb3IgcHJlbG9hZCBsb3dyZXMgaW1hZ2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0dGl0bGU6ICd0aXRsZScsIC8vIHRpdGxlIGZpZWxkIG5hbWVcblx0XHRcdFx0c3VidGl0bGU6ICdzdWJ0aXRsZScsIC8vIHN1YnRpdGxlIGZpZWxkIG5hbWVcblx0XHRcdFx0ZGVzY3JpcHRpb246ICdkZXNjcmlwdGlvbicsIC8vIGRlc2NyaXB0aW9uIGZpZWxkIG5hbWVcblx0XHRcdH0sXG5cdFx0XHRhdXRvcGxheToge1xuXHRcdFx0XHRlbmFibGVkOiBmYWxzZSwgLy8gc2xpZGVzaG93IHBsYXkgZW5hYmxlZC9kaXNhYmxlZFxuXHRcdFx0XHRkZWxheTogNDEwMCAvLyBhdXRvcGxheSBkZWxheSBpbiBtaWxsaXNlY29uZFxuXHRcdFx0fSxcblx0XHRcdHRoZW1lOiAnZGVmYXVsdCcsIC8vIGNzcyBzdHlsZSBbZGVmYXVsdCwgZGFya2JsdWUsIGRhcmtyZWQsIHdoaXRlZ29sZF1cblx0XHRcdHByZWxvYWROZXh0OiBmYWxzZSwgLy8gcHJlbG9hZCBuZXh0IGltYWdlIChmb3J3YXJkL2JhY2t3YXJkKVxuXHRcdFx0cHJlbG9hZERlbGF5OiA3NzAsIC8vIHByZWxvYWQgZGVsYXkgZm9yIHByZWxvYWROZXh0XG5cdFx0XHRsb2FkaW5nSW1hZ2U6ICdwcmVsb2FkLnN2ZycsIC8vIGxvYWRlciBpbWFnZVxuXHRcdFx0cHJlbG9hZDogW10sIC8vIHByZWxvYWQgaW1hZ2VzIGJ5IGluZGV4IG51bWJlclxuXHRcdFx0bW9kYWw6IHtcblx0XHRcdFx0dGl0bGU6ICcnLCAvLyBtb2RhbCB3aW5kb3cgdGl0bGVcblx0XHRcdFx0c3VidGl0bGU6ICcnLCAvLyBtb2RhbCB3aW5kb3cgc3VidGl0bGVcblx0XHRcdFx0dGl0bGVGcm9tSW1hZ2U6IGZhbHNlLCAvLyBmb3JjZSB1cGRhdGUgdGhlIGdhbGxlcnkgdGl0bGUgYnkgaW1hZ2UgdGl0bGVcblx0XHRcdFx0c3VidGl0bGVGcm9tSW1hZ2U6IGZhbHNlLCAvLyBmb3JjZSB1cGRhdGUgdGhlIGdhbGxlcnkgc3VidGl0bGUgYnkgaW1hZ2UgZGVzY3JpcHRpb25cblx0XHRcdFx0cGxhY2Vob2xkZXI6ICdwYW5lbCcsIC8vIHNldCBpbWFnZSBwbGFjZWhvbGRlciBzb3VyY2UgdHlwZSAodGh1bWJuYWlsKSBvciBmdWxsIHVybCAoaHR0cC4uLilcblx0XHRcdFx0Y2FwdGlvbjoge1xuXHRcdFx0XHRcdGRpc2FibGVkOiBmYWxzZSwgLy8gZGlzYWJsZSBpbWFnZSBjYXB0aW9uXG5cdFx0XHRcdFx0dmlzaWJsZTogdHJ1ZSwgLy8gc2hvdy9oaWRlIGltYWdlIGNhcHRpb25cblx0XHRcdFx0XHRwb3NpdGlvbjogJ3RvcCcsIC8vIGNhcHRpb24gcG9zaXRpb24gW3RvcCwgYm90dG9tXVxuXHRcdFx0XHRcdGRvd25sb2FkOiBmYWxzZSAvLyBzaG93L2hpZGUgZG93bmxvYWQgbGlua1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRoZWFkZXI6IHtcblx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLCAvLyBlbmFibGUvZGlzYWJsZSBtb2RhbCBtZW51XG5cdFx0XHRcdFx0ZHluYW1pYzogZmFsc2UsIC8vIHNob3cvaGlkZSBtb2RhbCBtZW51IG9uIG1vdXNlb3ZlclxuXHRcdFx0XHRcdGJ1dHRvbnM6IFsncGxheXN0b3AnLCAnaW5kZXgnLCAncHJldicsICduZXh0JywgJ3BpbicsICdzaXplJywgJ3RyYW5zaXRpb24nLCAndGh1bWJuYWlscycsICdmdWxsc2NyZWVuJywgJ2hlbHAnLCAnY2xvc2UnXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0aGVscDogZmFsc2UsIC8vIHNob3cvaGlkZSBoZWxwXG5cdFx0XHRcdGFycm93czoge1xuXHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsIC8vIHNob3cvaGlkZSBhcnJvd3Ncblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjbGljazoge1xuXHRcdFx0XHRcdGNsb3NlOiB0cnVlIC8vIHdoZW4gY2xpY2sgb24gdGhlIGltYWdlIGNsb3NlIHRoZSBtb2RhbFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aHVtYm5haWw6IHtcblx0XHRcdFx0XHRoZWlnaHQ6IDUwLCAvLyB0aHVtYm5haWwgaW1hZ2UgaGVpZ2h0IGluIHBpeGVsXG5cdFx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93IGluZGV4IG51bWJlciBvbiB0aHVtYm5haWxcblx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLCAvLyBlbmFibGUvZGlzYWJsZSB0aHVtYm5haWxzXG5cdFx0XHRcdFx0ZHluYW1pYzogZmFsc2UsIC8vIGlmIHRydWUgdGh1bWJuYWlscyB2aXNpYmxlIG9ubHkgd2hlbiBtb3VzZW92ZXJcblx0XHRcdFx0XHRhdXRvaGlkZTogdHJ1ZSwgLy8gaGlkZSB0aHVtYm5haWwgY29tcG9uZW50IHdoZW4gc2luZ2xlIGltYWdlXG5cdFx0XHRcdFx0Y2xpY2s6IHtcblx0XHRcdFx0XHRcdHNlbGVjdDogdHJ1ZSwgLy8gc2V0IHNlbGVjdGVkIGltYWdlIHdoZW4gdHJ1ZVxuXHRcdFx0XHRcdFx0bW9kYWw6IGZhbHNlIC8vIG9wZW4gbW9kYWwgd2hlbiB0cnVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRob3Zlcjoge1xuXHRcdFx0XHRcdFx0cHJlbG9hZDogdHJ1ZSwgLy8gcHJlbG9hZCBpbWFnZSBvbiBtb3VzZW92ZXJcblx0XHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XG5cdFx0XHRcdHRyYW5zaXRpb25TcGVlZDogMC43LCAvLyB0cmFuc2l0aW9uIHNwZWVkIDAuN3Ncblx0XHRcdFx0c2l6ZTogJ2NvdmVyJywgLy8gY29udGFpbiwgY292ZXIsIGF1dG8sIHN0cmV0Y2hcblx0XHRcdFx0a2V5Y29kZXM6IHtcblx0XHRcdFx0XHRleGl0OiBbMjddLCAvLyBlc2Ncblx0XHRcdFx0XHRwbGF5cGF1c2U6IFs4MF0sIC8vIHBcblx0XHRcdFx0XHRmb3J3YXJkOiBbMzIsIDM5XSwgLy8gc3BhY2UsIHJpZ2h0IGFycm93XG5cdFx0XHRcdFx0YmFja3dhcmQ6IFszN10sIC8vIGxlZnQgYXJyb3dcblx0XHRcdFx0XHRmaXJzdDogWzM4LCAzNl0sIC8vIHVwIGFycm93LCBob21lXG5cdFx0XHRcdFx0bGFzdDogWzQwLCAzNV0sIC8vIGRvd24gYXJyb3csIGVuZFxuXHRcdFx0XHRcdGZ1bGxzY3JlZW46IFsxM10sIC8vIGVudGVyXG5cdFx0XHRcdFx0bWVudTogWzc3XSwgLy8gbVxuXHRcdFx0XHRcdGNhcHRpb246IFs2N10sIC8vIGNcblx0XHRcdFx0XHRoZWxwOiBbNzJdLCAvLyBoXG5cdFx0XHRcdFx0c2l6ZTogWzgzXSwgLy8gc1xuXHRcdFx0XHRcdHRyYW5zaXRpb246IFs4NF0gLy8gdFxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0dGh1bWJuYWlsOiB7XG5cdFx0XHRcdGhlaWdodDogNTAsIC8vIHRodW1ibmFpbCBpbWFnZSBoZWlnaHQgaW4gcGl4ZWxcblx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93IGluZGV4IG51bWJlciBvbiB0aHVtYm5haWxcblx0XHRcdFx0ZHluYW1pYzogZmFsc2UsIC8vIGlmIHRydWUgdGh1bWJuYWlscyB2aXNpYmxlIG9ubHkgd2hlbiBtb3VzZW92ZXJcblx0XHRcdFx0YXV0b2hpZGU6IGZhbHNlLCAvLyBoaWRlIHRodW1ibmFpbCBjb21wb25lbnQgd2hlbiBzaW5nbGUgaW1hZ2Vcblx0XHRcdFx0Y2xpY2s6IHtcblx0XHRcdFx0XHRzZWxlY3Q6IHRydWUsIC8vIHNldCBzZWxlY3RlZCBpbWFnZSB3aGVuIHRydWVcblx0XHRcdFx0XHRtb2RhbDogZmFsc2UgLy8gb3BlbiBtb2RhbCB3aGVuIHRydWVcblx0XHRcdFx0fSxcblx0XHRcdFx0aG92ZXI6IHtcblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxuXHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0XHRwYW5lbDoge1xuXHRcdFx0XHR2aXNpYmxlOiB0cnVlLFxuXHRcdFx0XHRpdGVtczoge1xuXHRcdFx0XHRcdGNsYXNzOiAncm93JywgLy8gaXRlbXMgY2xhc3Ncblx0XHRcdFx0fSxcblx0XHRcdFx0aXRlbToge1xuXHRcdFx0XHRcdGNsYXNzOiAnY29sLW1kLTMnLCAvLyBpdGVtIGNsYXNzXG5cdFx0XHRcdFx0Y2FwdGlvbjogZmFsc2UsIC8vIHNob3cvaGlkZSBpbWFnZSBjYXB0aW9uXG5cdFx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93L2hpZGUgaW1hZ2UgaW5kZXhcblx0XHRcdFx0fSxcblx0XHRcdFx0aG92ZXI6IHtcblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxuXHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcblx0XHRcdFx0fSxcblx0XHRcdFx0Y2xpY2s6IHtcblx0XHRcdFx0XHRzZWxlY3Q6IGZhbHNlLCAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugd2hlbiB0cnVlXG5cdFx0XHRcdFx0bW9kYWw6IHRydWUgLy8gb3BlbiBtb2RhbCB3aGVuIHRydWVcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0XHRpbWFnZToge1xuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XG5cdFx0XHRcdHRyYW5zaXRpb25TcGVlZDogMC43LCAvLyB0cmFuc2l0aW9uIHNwZWVkIDAuN3Ncblx0XHRcdFx0c2l6ZTogJ2NvdmVyJywgLy8gY29udGFpbiwgY292ZXIsIGF1dG8sIHN0cmV0Y2hcblx0XHRcdFx0YXJyb3dzOiB7XG5cdFx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSwgIC8vIHNob3cvaGlkZSBhcnJvd3Ncblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjbGljazoge1xuXHRcdFx0XHRcdG1vZGFsOiB0cnVlIC8vIHdoZW4gY2xpY2sgb24gdGhlIGltYWdlIG9wZW4gdGhlIG1vZGFsIHdpbmRvd1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRoZWlnaHQ6IG51bGwsIC8vIGhlaWdodCBpbiBwaXhlbFxuXHRcdFx0XHRoZWlnaHRNaW46IG51bGwsIC8vIG1pbiBoZWlnaHQgaW4gcGl4ZWxcblx0XHRcdFx0aGVpZ2h0QXV0bzoge1xuXHRcdFx0XHRcdGluaXRpYWw6IHRydWUsIC8vIGNhbGN1bGF0ZSBkaXYgaGVpZ2h0IGJ5IGZpcnN0IGltYWdlXG5cdFx0XHRcdFx0b25yZXNpemU6IGZhbHNlIC8vIGNhbGN1bGF0ZSBkaXYgaGVpZ2h0IG9uIHdpbmRvdyByZXNpemVcblx0XHRcdFx0fSxcblx0XHRcdFx0cGxhY2Vob2xkZXI6ICdwYW5lbCcgLy8gc2V0IGltYWdlIHBsYWNlaG9sZGVyIHNvdXJjZSB0eXBlICh0aHVtYm5haWwpIG9yIGZ1bGwgdXJsIChodHRwLi4uKVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvLyBhdmFpbGFibGUgaW1hZ2Ugc2l6ZXNcblx0XHRwdWJsaWMgc2l6ZXM6IEFycmF5PHN0cmluZz4gPSBbXG5cdFx0XHQnY29udGFpbicsXG5cdFx0XHQnY292ZXInLFxuXHRcdFx0J2F1dG8nLFxuXHRcdFx0J3N0cmV0Y2gnXG5cdFx0XTtcblxuXHRcdC8vIGF2YWlsYWJsZSB0aGVtZXNcblx0XHRwdWJsaWMgdGhlbWVzOiBBcnJheTxzdHJpbmc+ID0gW1xuXHRcdFx0J2RlZmF1bHQnLFxuXHRcdFx0J2RhcmtibHVlJyxcblx0XHRcdCd3aGl0ZWdvbGQnXG5cdFx0XTtcblxuXHRcdC8vIGF2YWlsYWJsZSB0cmFuc2l0aW9uc1xuXHRcdHB1YmxpYyB0cmFuc2l0aW9uczogQXJyYXk8c3RyaW5nPiA9IFtcblx0XHRcdCdubycsXG5cdFx0XHQnZmFkZUluT3V0Jyxcblx0XHRcdCd6b29tSW4nLFxuXHRcdFx0J3pvb21PdXQnLFxuXHRcdFx0J3pvb21Jbk91dCcsXG5cdFx0XHQncm90YXRlTFInLFxuXHRcdFx0J3JvdGF0ZVRCJyxcblx0XHRcdCdyb3RhdGVaWScsXG5cdFx0XHQnc2xpZGVMUicsXG5cdFx0XHQnc2xpZGVUQicsXG5cdFx0XHQnemxpZGVMUicsXG5cdFx0XHQnemxpZGVUQicsXG5cdFx0XHQnZmxpcFgnLFxuXHRcdFx0J2ZsaXBZJ1xuXHRcdF07XG5cblx0XHRwdWJsaWMgZXZlbnRzID0ge1xuXHRcdFx0Q09ORklHX0xPQUQ6ICdBU0ctY29uZmlnLWxvYWQtJyxcblx0XHRcdEFVVE9QTEFZX1NUQVJUOiAnQVNHLWF1dG9wbGF5LXN0YXJ0LScsXG5cdFx0XHRBVVRPUExBWV9TVE9QOiAnQVNHLWF1dG9wbGF5LXN0b3AtJyxcblx0XHRcdFBBUlNFX0lNQUdFUzogJ0FTRy1wYXJzZS1pbWFnZXMtJyxcblx0XHRcdExPQURfSU1BR0U6ICdBU0ctbG9hZC1pbWFnZS0nLFxuXHRcdFx0RklSU1RfSU1BR0U6ICdBU0ctZmlyc3QtaW1hZ2UtJyxcblx0XHRcdENIQU5HRV9JTUFHRTogJ0FTRy1jaGFuZ2UtaW1hZ2UtJyxcblx0XHRcdERPVUJMRV9JTUFHRTogJ0FTRy1kb3VibGUtaW1hZ2UtJyxcblx0XHRcdE1PREFMX09QRU46ICdBU0ctbW9kYWwtb3Blbi0nLFxuXHRcdFx0TU9EQUxfQ0xPU0U6ICdBU0ctbW9kYWwtY2xvc2UtJyxcblx0XHRcdFRIVU1CTkFJTF9NT1ZFOiAnQVNHLXRodW1ibmFpbC1tb3ZlLScsXG5cdFx0XHRHQUxMRVJZX1VQREFURUQ6ICdBU0ctZ2FsbGVyeS11cGRhdGVkLScsXG5cdFx0XHRMQVNUX1RIVU1CTkFJTDogJ0FTRy1sYXN0LXRodW1ibmFpbC0nLFxuXHRcdFx0R0FMTEVSWV9FRElUOiAnQVNHLWdhbGxlcnktZWRpdCcsXG5cdFx0fTtcblxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSBpbnRlcnZhbDogbmcuSUludGVydmFsU2VydmljZSxcblx0XHRcdHByaXZhdGUgbG9jYXRpb246IG5nLklMb2NhdGlvblNlcnZpY2UsXG5cdFx0XHRwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSAkd2luZG93OiBuZy5JV2luZG93U2VydmljZSkge1xuXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCgncmVzaXplJywgKGV2ZW50KSA9PiB7XG5cdFx0XHRcdHRoaXMudGh1bWJuYWlsc01vdmUoMjAwKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyB1cGRhdGUgaW1hZ2VzIHdoZW4gZWRpdCBldmVudFxuXHRcdFx0JHJvb3RTY29wZS4kb24odGhpcy5ldmVudHMuR0FMTEVSWV9FRElULCAoZXZlbnQsIGRhdGEpID0+IHtcblx0XHRcdFx0aWYgKHRoaXMuaW5zdGFuY2VzW2RhdGEuaWRdKSB7XG5cdFx0XHRcdFx0dGhpcy5pbnN0YW5jZXNbZGF0YS5pZF0uZWRpdEdhbGxlcnkoZGF0YSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBwYXJzZUhhc2goKSB7XG5cblx0XHRcdGlmICghdGhpcy5pZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICghdGhpcy5vcHRpb25zLmhhc2hVcmwpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgaGFzaCA9IHRoaXMubG9jYXRpb24uaGFzaCgpO1xuXHRcdFx0bGV0IHBhcnRzID0gaGFzaCA/IGhhc2guc3BsaXQoJy0nKSA6IG51bGw7XG5cblx0XHRcdGlmIChwYXJ0cyA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChwYXJ0c1swXSAhPT0gdGhpcy5zbHVnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHBhcnRzLmxlbmd0aCAhPT0gMykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChwYXJ0c1sxXSAhPT0gdGhpcy5pZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBpbmRleCA9IHBhcnNlSW50KHBhcnRzWzJdLCAxMCk7XG5cblx0XHRcdGlmICghYW5ndWxhci5pc051bWJlcihpbmRleCkpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xuXG5cdFx0XHRcdGluZGV4LS07XG5cdFx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleDtcblx0XHRcdFx0dGhpcy5tb2RhbE9wZW4oaW5kZXgpO1xuXG5cdFx0XHR9LCAyMCk7XG5cblx0XHR9XG5cblx0XHQvLyBjYWxjdWxhdGUgb2JqZWN0IGhhc2ggaWRcblx0XHRwdWJsaWMgb2JqZWN0SGFzaElkKG9iamVjdDogYW55KTogc3RyaW5nIHtcblxuXHRcdFx0bGV0IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KG9iamVjdCk7XG5cblx0XHRcdGlmICghc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgYWJjID0gc3RyaW5nLnJlcGxhY2UoL1teYS16QS1aMC05XSsvZywgJycpO1xuXHRcdFx0bGV0IGNvZGUgPSAwO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMCwgbiA9IGFiYy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0bGV0IGNoYXJjb2RlID0gYWJjLmNoYXJDb2RlQXQoaSk7XG5cdFx0XHRcdGNvZGUgKz0gKGNoYXJjb2RlICogaSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAnaWQnICsgY29kZS50b1N0cmluZygyMSk7XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZSBmb3IgY3VycmVudCBnYWxsZXJ5IGJ5IGNvbXBvbmVudCBpZFxuXHRcdHB1YmxpYyBnZXRJbnN0YW5jZShjb21wb25lbnQ6IGFueSkge1xuXG5cdFx0XHRpZiAoIWNvbXBvbmVudC5pZCkge1xuXG5cdFx0XHRcdC8vIGdldCBwYXJlbnQgYXNnIGNvbXBvbmVudCBpZFxuXHRcdFx0XHRpZiAoY29tcG9uZW50LiRzY29wZSAmJiBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQgJiYgY29tcG9uZW50LiRzY29wZS4kcGFyZW50LiRwYXJlbnQgJiYgY29tcG9uZW50LiRzY29wZS4kcGFyZW50LiRwYXJlbnQuJGN0cmwpIHtcblx0XHRcdFx0XHRjb21wb25lbnQuaWQgPSBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQuJHBhcmVudC4kY3RybC5pZDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb21wb25lbnQuaWQgPSB0aGlzLm9iamVjdEhhc2hJZChjb21wb25lbnQub3B0aW9ucyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBpZCA9IGNvbXBvbmVudC5pZDtcblx0XHRcdGxldCBpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzW2lkXTtcblxuXHRcdFx0Ly8gbmV3IGluc3RhbmNlIGFuZCBzZXQgb3B0aW9ucyBhbmQgaXRlbXNcblx0XHRcdGlmIChpbnN0YW5jZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGluc3RhbmNlID0gbmV3IFNlcnZpY2VDb250cm9sbGVyKHRoaXMudGltZW91dCwgdGhpcy5pbnRlcnZhbCwgdGhpcy5sb2NhdGlvbiwgdGhpcy4kcm9vdFNjb3BlLCB0aGlzLiR3aW5kb3cpO1xuXHRcdFx0XHRpbnN0YW5jZS5pZCA9IGlkO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY29tcG9uZW50LmJhc2VVcmwpIHtcblx0XHRcdFx0Y29tcG9uZW50Lm9wdGlvbnMuYmFzZVVybCA9IGNvbXBvbmVudC5iYXNlVXJsO1xuXHRcdFx0fVxuXG5cdFx0XHRpbnN0YW5jZS5zZXRPcHRpb25zKGNvbXBvbmVudC5vcHRpb25zKTtcblx0XHRcdGluc3RhbmNlLnNldEl0ZW1zKGNvbXBvbmVudC5pdGVtcyk7XG5cdFx0XHRpbnN0YW5jZS5zZWxlY3RlZCA9IGNvbXBvbmVudC5zZWxlY3RlZCA/IGNvbXBvbmVudC5zZWxlY3RlZCA6IGluc3RhbmNlLm9wdGlvbnMuc2VsZWN0ZWQ7XG5cdFx0XHRpbnN0YW5jZS5wYXJzZUhhc2goKTtcblxuXHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMpIHtcblxuXHRcdFx0XHRpbnN0YW5jZS5sb2FkSW1hZ2VzKGluc3RhbmNlLm9wdGlvbnMucHJlbG9hZCk7XG5cblx0XHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMuYXV0b3BsYXkgJiYgaW5zdGFuY2Uub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkICYmICFpbnN0YW5jZS5hdXRvcGxheSkge1xuXHRcdFx0XHRcdGluc3RhbmNlLmF1dG9QbGF5U3RhcnQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuaW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xuXHRcdFx0cmV0dXJuIGluc3RhbmNlO1xuXG5cdFx0fVxuXG5cdFx0Ly8gcHJlcGFyZSBpbWFnZXMgYXJyYXlcblx0XHRwdWJsaWMgc2V0SXRlbXMoaXRlbXM6IEFycmF5PElGaWxlPikge1xuXG5cdFx0XHR0aGlzLml0ZW1zID0gaXRlbXMgPyBpdGVtcyA6IFtdO1xuXHRcdFx0dGhpcy5wcmVwYXJlSXRlbXMoKTtcblxuXHRcdH1cblxuXHRcdC8vIG9wdGlvbnMgc2V0dXBcblx0XHRwdWJsaWMgc2V0T3B0aW9ucyhvcHRpb25zOiBJT3B0aW9ucykge1xuXG5cdFx0XHQvLyBpZiBvcHRpb25zIGFscmVhZHkgc2V0dXBcblx0XHRcdGlmICh0aGlzLm9wdGlvbnNMb2FkZWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3B0aW9ucykge1xuXG5cdFx0XHRcdHRoaXMub3B0aW9ucyA9IGFuZ3VsYXIuY29weSh0aGlzLmRlZmF1bHRzKTtcblx0XHRcdFx0YW5ndWxhci5tZXJnZSh0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG5cdFx0XHRcdGlmIChvcHRpb25zLm1vZGFsICYmIG9wdGlvbnMubW9kYWwuaGVhZGVyICYmIG9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnMpIHtcblxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucyA9IG9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnM7XG5cblx0XHRcdFx0XHQvLyByZW1vdmUgZHVwbGljYXRlcyBmcm9tIGJ1dHRvbnNcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnMgPSB0aGlzLm9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnMuZmlsdGVyKGZ1bmN0aW9uICh4LCBpLCBhKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYS5pbmRleE9mKHgpID09PSBpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLm9wdGlvbnNMb2FkZWQgPSB0cnVlO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLm9wdGlvbnMgPSBhbmd1bGFyLmNvcHkodGhpcy5kZWZhdWx0cyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGlmICF0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbFxuXHRcdFx0aWYgKCF0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbCkge1xuXHRcdFx0XHR0aGlzLm9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnMgPSB0aGlzLm9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnMuZmlsdGVyKGZ1bmN0aW9uICh4LCBpLCBhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHggIT09ICdmdWxsc2NyZWVuJztcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblxuXHRcdFx0Ly8gaW1wb3J0YW50IVxuXHRcdFx0b3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5DT05GSUdfTE9BRCwgdGhpcy5vcHRpb25zKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucztcblxuXHRcdH1cblxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodjogbnVtYmVyKSB7XG5cblx0XHRcdHYgPSB0aGlzLm5vcm1hbGl6ZSh2KTtcblx0XHRcdGxldCBwcmV2ID0gdGhpcy5fc2VsZWN0ZWQ7XG5cblx0XHRcdHRoaXMuX3NlbGVjdGVkID0gdjtcblx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuX3NlbGVjdGVkKTtcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xuXG5cdFx0XHRpZiAodGhpcy5maWxlKSB7XG5cblx0XHRcdFx0aWYgKHRoaXMub3B0aW9ucy5tb2RhbC50aXRsZUZyb21JbWFnZSAmJiB0aGlzLmZpbGUudGl0bGUpIHtcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMubW9kYWwudGl0bGUgPSB0aGlzLmZpbGUudGl0bGU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpcy5vcHRpb25zLm1vZGFsLnN1YnRpdGxlRnJvbUltYWdlICYmIHRoaXMuZmlsZS5kZXNjcmlwdGlvbikge1xuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5tb2RhbC5zdWJ0aXRsZSA9IHRoaXMuZmlsZS5kZXNjcmlwdGlvbjtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdGlmIChwcmV2ICE9PSB0aGlzLl9zZWxlY3RlZCkge1xuXG5cdFx0XHRcdHRoaXMudGh1bWJuYWlsc01vdmUoKTtcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5DSEFOR0VfSU1BR0UsIHtcblx0XHRcdFx0XHRpbmRleDogdixcblx0XHRcdFx0XHRmaWxlOiB0aGlzLmZpbGVcblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblxuXHRcdFx0dGhpcy5vcHRpb25zLnNlbGVjdGVkID0gdGhpcy5fc2VsZWN0ZWQ7XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2Vcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG5cblx0XHR9XG5cblx0XHQvLyBmb3JjZSBzZWxlY3QgaW1hZ2Vcblx0XHRwdWJsaWMgZm9yY2VTZWxlY3QoaW5kZXgpIHtcblxuXHRcdFx0aW5kZXggPSB0aGlzLm5vcm1hbGl6ZShpbmRleCk7XG5cdFx0XHR0aGlzLl9zZWxlY3RlZCA9IGluZGV4O1xuXHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5fc2VsZWN0ZWQpO1xuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkNIQU5HRV9JTUFHRSwge1xuXHRcdFx0XHRpbmRleDogaW5kZXgsXG5cdFx0XHRcdGZpbGU6IHRoaXMuZmlsZVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cblxuXHRcdHB1YmxpYyBzZXRTZWxlY3RlZChpbmRleDogbnVtYmVyKSB7XG5cblx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9IGluZGV4ID4gdGhpcy5zZWxlY3RlZCA/ICdmb3J3YXJkJyA6ICdiYWNrd2FyZCc7XG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXg7XG5cdFx0XHR0aGlzLnNldEhhc2goKTtcblxuXHRcdH1cblxuXG5cdFx0Ly8gZ28gdG8gYmFja3dhcmRcblx0XHRwdWJsaWMgdG9CYWNrd2FyZChzdG9wPzogYm9vbGVhbikge1xuXG5cdFx0XHRpZiAoc3RvcCkge1xuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XG5cdFx0XHR0aGlzLnNlbGVjdGVkLS07XG5cdFx0XHR0aGlzLnNldEhhc2goKTtcblxuXHRcdH1cblxuXHRcdC8vIGdvIHRvIGZvcndhcmRcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKHN0b3A/OiBib29sZWFuKSB7XG5cblx0XHRcdGlmIChzdG9wKSB7XG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2ZvcndhcmQnO1xuXHRcdFx0dGhpcy5zZWxlY3RlZCsrO1xuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XG5cblx0XHR9XG5cblx0XHQvLyBnbyB0byBmaXJzdFxuXHRcdHB1YmxpYyB0b0ZpcnN0KHN0b3A/OiBib29sZWFuKSB7XG5cblx0XHRcdGlmIChzdG9wKSB7XG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2JhY2t3YXJkJztcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSAwO1xuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XG5cblx0XHR9XG5cblx0XHQvLyBnbyB0byBsYXN0XG5cdFx0cHVibGljIHRvTGFzdChzdG9wPzogYm9vbGVhbikge1xuXG5cdFx0XHRpZiAoc3RvcCkge1xuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdmb3J3YXJkJztcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLml0ZW1zLmxlbmd0aCAtIDE7XG5cdFx0XHR0aGlzLnNldEhhc2goKTtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyBzZXRIYXNoKCkge1xuXG5cdFx0XHRpZiAodGhpcy5tb2RhbFZpc2libGUgJiYgdGhpcy5vcHRpb25zLmhhc2hVcmwpIHtcblx0XHRcdFx0dGhpcy5sb2NhdGlvbi5oYXNoKFt0aGlzLnNsdWcsIHRoaXMuaWQsIHRoaXMuc2VsZWN0ZWQgKyAxXS5qb2luKCctJykpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cHVibGljIGF1dG9QbGF5VG9nZ2xlKCkge1xuXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQpIHtcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdGFydCgpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cblx0XHRwdWJsaWMgYXV0b1BsYXlTdG9wKCkge1xuXG5cdFx0XHRpZiAoIXRoaXMuYXV0b3BsYXkpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmludGVydmFsLmNhbmNlbCh0aGlzLmF1dG9wbGF5KTtcblx0XHRcdHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkID0gZmFsc2U7XG5cdFx0XHR0aGlzLmF1dG9wbGF5ID0gbnVsbDtcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQVVUT1BMQVlfU1RPUCwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCwgZmlsZTogdGhpcy5maWxlIH0pO1xuXG5cdFx0fVxuXG5cdFx0cHVibGljIGF1dG9QbGF5U3RhcnQoKSB7XG5cblx0XHRcdGlmICh0aGlzLmF1dG9wbGF5KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgPSB0cnVlO1xuXHRcdFx0dGhpcy5hdXRvcGxheSA9IHRoaXMuaW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0XHR0aGlzLnRvRm9yd2FyZCgpO1xuXHRcdFx0fSwgdGhpcy5vcHRpb25zLmF1dG9wbGF5LmRlbGF5KTtcblxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5BVVRPUExBWV9TVEFSVCwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCwgZmlsZTogdGhpcy5maWxlIH0pO1xuXG5cdFx0fVxuXG5cblx0XHRwcml2YXRlIHByZXBhcmVJdGVtcygpIHtcblxuXHRcdFx0bGV0IGxlbmd0aCA9IHRoaXMuaXRlbXMubGVuZ3RoO1xuXHRcdFx0Zm9yIChsZXQga2V5ID0gMDsga2V5IDwgbGVuZ3RoOyBrZXkrKykge1xuXHRcdFx0XHR0aGlzLmFkZEltYWdlKHRoaXMuaXRlbXNba2V5XSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuUEFSU0VfSU1BR0VTLCB0aGlzLmZpbGVzKTtcblxuXHRcdH1cblxuXHRcdC8vIHByZWxvYWQgdGhlIGltYWdlIHdoZW4gbW91c2VvdmVyXG5cdFx0cHVibGljIGhvdmVyUHJlbG9hZChpbmRleDogbnVtYmVyKSB7XG5cblx0XHRcdHRoaXMubG9hZEltYWdlKGluZGV4KTtcblxuXHRcdH1cblxuXHRcdC8vIGltYWdlIHByZWxvYWRcblx0XHRwcml2YXRlIHByZWxvYWQod2FpdD86IG51bWJlcikge1xuXG5cdFx0XHRsZXQgaW5kZXggPSB0aGlzLmRpcmVjdGlvbiA9PT0gJ2ZvcndhcmQnID8gdGhpcy5zZWxlY3RlZCArIDEgOiB0aGlzLnNlbGVjdGVkIC0gMTtcblxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5wcmVsb2FkTmV4dCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMubG9hZEltYWdlKGluZGV4KTtcblx0XHRcdFx0fSwgKHdhaXQgIT09IHVuZGVmaW5lZCkgPyB3YWl0IDogdGhpcy5vcHRpb25zLnByZWxvYWREZWxheSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgbm9ybWFsaXplKGluZGV4OiBudW1iZXIpIHtcblxuXHRcdFx0bGV0IGxhc3QgPSB0aGlzLmZpbGVzLmxlbmd0aCAtIDE7XG5cblx0XHRcdGlmIChpbmRleCA+IGxhc3QpIHtcblx0XHRcdFx0cmV0dXJuIChpbmRleCAtIGxhc3QpIC0gMTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGluZGV4IDwgMCkge1xuXHRcdFx0XHRyZXR1cm4gbGFzdCAtIE1hdGguYWJzKGluZGV4KSArIDE7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBpbmRleDtcblxuXHRcdH1cblxuXG5cdFx0cHVibGljIGxvYWRJbWFnZXMoaW5kZXhlczogQXJyYXk8bnVtYmVyPiwgdHlwZTogc3RyaW5nKSB7XG5cblx0XHRcdGlmICghaW5kZXhlcyB8fCBpbmRleGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBzZWxmID0gdGhpcztcblxuXHRcdFx0aW5kZXhlcy5mb3JFYWNoKChpbmRleDogbnVtYmVyKSA9PiB7XG5cdFx0XHRcdHNlbGYubG9hZEltYWdlKGluZGV4KTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cblx0XHRwdWJsaWMgbG9hZEltYWdlKGluZGV4PzogbnVtYmVyLCBjYWxsYmFjaz86IHt9KSB7XG5cblx0XHRcdGluZGV4ID0gaW5kZXggPyBpbmRleCA6IHRoaXMuc2VsZWN0ZWQ7XG5cdFx0XHRpbmRleCA9IHRoaXMubm9ybWFsaXplKGluZGV4KTtcblxuXHRcdFx0aWYgKCF0aGlzLmZpbGVzW2luZGV4XSkge1xuXHRcdFx0XHR0aGlzLmxvZygnaW52YWxpZCBmaWxlIGluZGV4JywgeyBpbmRleDogaW5kZXggfSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMubW9kYWxWaXNpYmxlKSB7XG5cblx0XHRcdFx0aWYgKHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZC5tb2RhbCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBtb2RhbCA9IG5ldyBJbWFnZSgpO1xuXHRcdFx0XHRtb2RhbC5zcmMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2UubW9kYWw7XG5cdFx0XHRcdG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcblx0XHRcdFx0XHR0aGlzLmFmdGVyTG9hZChpbmRleCwgJ21vZGFsJywgbW9kYWwpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRpZiAodGhpcy5maWxlc1tpbmRleF0ubG9hZGVkLmltYWdlID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGltYWdlID0gbmV3IEltYWdlKCk7XG5cdFx0XHRcdGltYWdlLnNyYyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5pbWFnZTtcblx0XHRcdFx0aW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLmFmdGVyTG9hZChpbmRleCwgJ2ltYWdlJywgaW1hZ2UpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IGZpbGUgbmFtZVxuXHRcdHByaXZhdGUgZ2V0RmlsZW5hbWUoaW5kZXg6IG51bWJlciwgdHlwZT86IHN0cmluZykge1xuXG5cdFx0XHR0eXBlID0gdHlwZSA/IHR5cGUgOiAnbW9kYWwnO1xuXHRcdFx0bGV0IGZpbGVwYXJ0cyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZVt0eXBlXS5zcGxpdCgnLycpO1xuXHRcdFx0bGV0IGZpbGVuYW1lID0gZmlsZXBhcnRzW2ZpbGVwYXJ0cy5sZW5ndGggLSAxXTtcblx0XHRcdHJldHVybiBmaWxlbmFtZTtcblxuXHRcdH1cblxuXHRcdC8vIGdldCBmaWxlIGV4dGVuc2lvblxuXHRcdHByaXZhdGUgZ2V0RXh0ZW5zaW9uKGluZGV4OiBudW1iZXIsIHR5cGU/OiBzdHJpbmcpIHtcblxuXHRcdFx0dHlwZSA9IHR5cGUgPyB0eXBlIDogJ21vZGFsJztcblx0XHRcdGxldCBmaWxlcGFydHMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2VbdHlwZV0uc3BsaXQoJy4nKTtcblx0XHRcdGxldCBleHRlbnNpb24gPSBmaWxlcGFydHNbZmlsZXBhcnRzLmxlbmd0aCAtIDFdO1xuXHRcdFx0cmV0dXJuIGV4dGVuc2lvbjtcblxuXHRcdH1cblxuXHRcdC8vIGFmdGVyIGxvYWQgaW1hZ2Vcblx0XHRwcml2YXRlIGFmdGVyTG9hZChpbmRleCwgdHlwZSwgaW1hZ2UpIHtcblxuXHRcdFx0aWYgKCF0aGlzLmZpbGVzW2luZGV4XSB8fCAhdGhpcy5maWxlc1tpbmRleF0ubG9hZGVkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZFt0eXBlXSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWRbdHlwZV0gPSB0cnVlO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0eXBlID09PSAnbW9kYWwnKSB7XG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLndpZHRoID0gaW1hZ2Uud2lkdGg7XG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmhlaWdodCA9IGltYWdlLmhlaWdodDtcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubmFtZSA9IHRoaXMuZ2V0RmlsZW5hbWUoaW5kZXgsIHR5cGUpO1xuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5leHRlbnNpb24gPSB0aGlzLmdldEV4dGVuc2lvbihpbmRleCwgdHlwZSk7XG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmRvd25sb2FkID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlLm1vZGFsO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWRbdHlwZV0gPSB0cnVlO1xuXG5cdFx0XHRsZXQgZGF0YSA9IHsgdHlwZTogdHlwZSwgaW5kZXg6IGluZGV4LCBmaWxlOiB0aGlzLmZpbGUsIGltZzogaW1hZ2UgfTtcblxuXHRcdFx0aWYgKCF0aGlzLmZpcnN0KSB7XG5cdFx0XHRcdHRoaXMuZmlyc3QgPSB0cnVlO1xuXHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkZJUlNUX0lNQUdFLCBkYXRhKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5MT0FEX0lNQUdFLCBkYXRhKTtcblxuXHRcdH1cblxuXG5cdFx0Ly8gaXMgc2luZ2xlP1xuXHRcdHB1YmxpYyBnZXQgaXNTaW5nbGUoKSB7XG5cblx0XHRcdHJldHVybiB0aGlzLmZpbGVzLmxlbmd0aCA+IDEgPyBmYWxzZSA6IHRydWU7XG5cblx0XHR9XG5cblxuXHRcdC8vIGdldCB0aGUgZG93bmxvYWQgbGlua1xuXHRcdHB1YmxpYyBkb3dubG9hZExpbmsoKSB7XG5cblx0XHRcdGlmICh0aGlzLnNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgdGhpcy5maWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdLnNvdXJjZS5tb2RhbDtcblx0XHRcdH1cblxuXHRcdH1cblxuXG5cdFx0Ly8gZ2V0IHRoZSBmaWxlXG5cdFx0cHVibGljIGdldCBmaWxlKCk6IElGaWxlIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuZmlsZXNbdGhpcy5zZWxlY3RlZF07XG5cblx0XHR9XG5cblx0XHQvLyB0b2dnbGUgZWxlbWVudCB2aXNpYmxlXG5cdFx0cHVibGljIHRvZ2dsZShlbGVtZW50OiBzdHJpbmcpOiB2b2lkIHtcblxuXHRcdFx0dGhpcy5vcHRpb25zW2VsZW1lbnRdLnZpc2libGUgPSAhdGhpcy5vcHRpb25zW2VsZW1lbnRdLnZpc2libGU7XG5cblx0XHR9XG5cblxuXHRcdC8vIGdldCB2aXNpYmxlXG5cdFx0cHVibGljIGdldCBtb2RhbFZpc2libGUoKTogYm9vbGVhbiB7XG5cblx0XHRcdHJldHVybiB0aGlzLl92aXNpYmxlO1xuXG5cdFx0fVxuXG5cblx0XHQvLyBnZXQgdGhlbWVcblx0XHRwdWJsaWMgZ2V0IHRoZW1lKCk6IHN0cmluZyB7XG5cblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnMudGhlbWU7XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgY2xhc3Nlc1xuXHRcdHB1YmxpYyBnZXQgY2xhc3NlcygpOiBzdHJpbmcge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLnRoZW1lICsgJyAnICsgdGhpcy5pZCArICh0aGlzLmVkaXRpbmcgPyAnIGVkaXRpbmcnIDogJycpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IHByZWxvYWQgc3R5bGVcblx0XHRwdWJsaWMgZHluYW1pY1N0eWxlKGZpbGU6IElGaWxlLCB0eXBlOiBzdHJpbmcsIGNvbmZpZzogSU9wdGlvbnNNb2RhbCB8IElPcHRpb25zSW1hZ2UpIHtcblxuXHRcdFx0bGV0IHN0eWxlID0ge307XG5cblx0XHRcdGlmIChmaWxlLnNvdXJjZS5jb2xvcikge1xuXHRcdFx0XHRzdHlsZVsnYmFja2dyb3VuZC1jb2xvciddID0gZmlsZS5zb3VyY2UuY29sb3I7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLm9wdGlvbnMubG9hZGluZ0ltYWdlICYmIGZpbGUubG9hZGVkW3R5cGVdID09PSBmYWxzZSkge1xuXHRcdFx0XHRzdHlsZVsnYmFja2dyb3VuZC1pbWFnZSddID0gJ3VybCgnICsgdGhpcy5vcHRpb25zLmxvYWRpbmdJbWFnZSArICcpJztcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvbmZpZy50cmFuc2l0aW9uU3BlZWQgIT09IHVuZGVmaW5lZCAmJiBjb25maWcudHJhbnNpdGlvblNwZWVkICE9PSBudWxsKSB7XG5cdFx0XHRcdHN0eWxlWyd0cmFuc2l0aW9uJ10gPSAnYWxsIGVhc2UgJyArIGNvbmZpZy50cmFuc2l0aW9uU3BlZWQgKyAncyc7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzdHlsZTtcblxuXHRcdH1cblxuXHRcdC8vIGdldCBwbGFjZWhvbGRlciBzdHlsZVxuXHRcdHB1YmxpYyBwbGFjZWhvbGRlclN0eWxlKGZpbGU6IElGaWxlLCB0eXBlOiBzdHJpbmcpIHtcblxuXHRcdFx0bGV0IHN0eWxlID0ge307XG5cblx0XHRcdGlmICh0aGlzLm9wdGlvbnNbdHlwZV0ucGxhY2Vob2xkZXIpIHtcblxuXHRcdFx0XHRsZXQgaW5kZXggPSB0aGlzLm9wdGlvbnNbdHlwZV0ucGxhY2Vob2xkZXI7XG5cdFx0XHRcdGxldCBpc0Z1bGwgPSAoaW5kZXguaW5kZXhPZignLy8nKSA9PT0gMCB8fCBpbmRleC5pbmRleE9mKCdodHRwJykgPT09IDApID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdFx0XHRsZXQgc291cmNlO1xuXG5cdFx0XHRcdGlmIChpc0Z1bGwpIHtcblx0XHRcdFx0XHRzb3VyY2UgPSBpbmRleDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzb3VyY2UgPSBmaWxlLnNvdXJjZVtpbmRleF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoc291cmNlKSB7XG5cdFx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtaW1hZ2UnXSA9ICd1cmwoJyArIHNvdXJjZSArICcpJztcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdGlmIChmaWxlLnNvdXJjZS5jb2xvcikge1xuXHRcdFx0XHRzdHlsZVsnYmFja2dyb3VuZC1jb2xvciddID0gZmlsZS5zb3VyY2UuY29sb3I7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChmaWxlLnNvdXJjZS5wbGFjZWhvbGRlcikge1xuXHRcdFx0XHRzdHlsZVsnYmFja2dyb3VuZC1pbWFnZSddID0gJ3VybCgnICsgZmlsZS5zb3VyY2UucGxhY2Vob2xkZXIgKyAnKSc7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzdHlsZTtcblxuXHRcdH1cblxuXHRcdC8vIHNldCB2aXNpYmxlXG5cdFx0cHVibGljIHNldCBtb2RhbFZpc2libGUodmFsdWU6IGJvb2xlYW4pIHtcblxuXHRcdFx0dGhpcy5fdmlzaWJsZSA9IHZhbHVlO1xuXG5cdFx0XHQvLyBzZXQgaW5kZXggMCBpZiAhc2VsZWN0ZWRcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkID8gdGhpcy5zZWxlY3RlZCA6IDA7XG5cblx0XHRcdGxldCBib2R5ID0gZG9jdW1lbnQuYm9keTtcblx0XHRcdGxldCBjbGFzc05hbWUgPSAnYXNnLXloaWRkZW4nO1xuXG5cdFx0XHRpZiAodmFsdWUpIHtcblxuXHRcdFx0XHRpZiAoYm9keS5jbGFzc05hbWUuaW5kZXhPZihjbGFzc05hbWUpIDwgMCkge1xuXHRcdFx0XHRcdGJvZHkuY2xhc3NOYW1lID0gYm9keS5jbGFzc05hbWUgKyAnICcgKyBjbGFzc05hbWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLm1vZGFsSW5pdCgpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGJvZHkuY2xhc3NOYW1lID0gYm9keS5jbGFzc05hbWUucmVwbGFjZShjbGFzc05hbWUsICcnKS50cmltKCk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIGluaXRpYWxpemUgdGhlIGdhbGxlcnlcblx0XHRwcml2YXRlIG1vZGFsSW5pdCgpIHtcblxuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRzZWxmLnNldEZvY3VzKCk7XG5cdFx0XHR9LCAxMDApO1xuXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR0aGlzLm1vZGFsSW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHRcdFx0fSwgNDYwKTtcblxuXHRcdH1cblxuXG5cdFx0cHVibGljIG1vZGFsT3BlbihpbmRleDogbnVtYmVyKSB7XG5cblx0XHRcdGlmICghdGhpcy5tb2RhbEF2YWlsYWJsZSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleCAhPT0gdW5kZWZpbmVkID8gaW5kZXggOiB0aGlzLnNlbGVjdGVkO1xuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoKTtcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5NT0RBTF9PUEVOLCB7IGluZGV4OiB0aGlzLnNlbGVjdGVkIH0pO1xuXG5cdFx0fVxuXG5cdFx0cHVibGljIG1vZGFsQ2xvc2UoKSB7XG5cblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuaGFzaFVybCkge1xuXHRcdFx0XHR0aGlzLmxvY2F0aW9uLmhhc2goJycpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLm1vZGFsSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblx0XHRcdHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XG5cdFx0XHR0aGlzLmxvYWRJbWFnZSgpO1xuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5NT0RBTF9DTE9TRSwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCB9KTtcblxuXHRcdH1cblxuXHRcdC8vIG1vdmUgdGh1bWJuYWlscyB0byBjb3JyZWN0IHBvc2l0aW9uXG5cdFx0cHVibGljIHRodW1ibmFpbHNNb3ZlKGRlbGF5PzogbnVtYmVyKSB7XG5cblx0XHRcdGxldCBtb3ZlID0gKCkgPT4ge1xuXG5cdFx0XHRcdGxldCBjb250YWluZXJzID0gdGhpcy5lbCgnZGl2LmFzZy10aHVtYm5haWwuJyArIHRoaXMuaWQpO1xuXG5cdFx0XHRcdGlmICghY29udGFpbmVycy5sZW5ndGgpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRhaW5lcnMubGVuZ3RoOyBpKyspIHtcblxuXHRcdFx0XHRcdGxldCBjb250YWluZXI6IGFueSA9IGNvbnRhaW5lcnNbaV07XG5cblx0XHRcdFx0XHRpZiAoY29udGFpbmVyLm9mZnNldFdpZHRoKSB7XG5cblx0XHRcdFx0XHRcdGxldCBpdGVtczogYW55ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5pdGVtcycpO1xuXHRcdFx0XHRcdFx0bGV0IGl0ZW06IGFueSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdkaXYuaXRlbScpO1xuXHRcdFx0XHRcdFx0bGV0IHRodW1ibmFpbCwgbW92ZVgsIHJlbWFpbjtcblxuXHRcdFx0XHRcdFx0aWYgKGl0ZW0pIHtcblxuXHRcdFx0XHRcdFx0XHRpZiAoaXRlbXMuc2Nyb2xsV2lkdGggPiBjb250YWluZXIub2Zmc2V0V2lkdGgpIHtcblx0XHRcdFx0XHRcdFx0XHR0aHVtYm5haWwgPSBpdGVtcy5zY3JvbGxXaWR0aCAvIHRoaXMuZmlsZXMubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRcdG1vdmVYID0gKGNvbnRhaW5lci5vZmZzZXRXaWR0aCAvIDIpIC0gKHRoaXMuc2VsZWN0ZWQgKiB0aHVtYm5haWwpIC0gdGh1bWJuYWlsIC8gMjtcblx0XHRcdFx0XHRcdFx0XHRyZW1haW4gPSBpdGVtcy5zY3JvbGxXaWR0aCArIG1vdmVYO1xuXHRcdFx0XHRcdFx0XHRcdG1vdmVYID0gbW92ZVggPiAwID8gMCA6IG1vdmVYO1xuXHRcdFx0XHRcdFx0XHRcdG1vdmVYID0gcmVtYWluIDwgY29udGFpbmVyLm9mZnNldFdpZHRoID8gY29udGFpbmVyLm9mZnNldFdpZHRoIC0gaXRlbXMuc2Nyb2xsV2lkdGggOiBtb3ZlWDtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR0aHVtYm5haWwgPSB0aGlzLmdldFJlYWxXaWR0aChpdGVtKTtcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IChjb250YWluZXIub2Zmc2V0V2lkdGggLSB0aHVtYm5haWwgKiB0aGlzLmZpbGVzLmxlbmd0aCkgLyAyO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aXRlbXMuc3R5bGUubGVmdCA9IG1vdmVYICsgJ3B4JztcblxuXHRcdFx0XHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLlRIVU1CTkFJTF9NT1ZFLCB7XG5cdFx0XHRcdFx0XHRcdFx0dGh1bWJuYWlsOiB0aHVtYm5haWwsXG5cdFx0XHRcdFx0XHRcdFx0bW92ZTogbW92ZVgsXG5cdFx0XHRcdFx0XHRcdFx0cmVtYWluOiByZW1haW4sXG5cdFx0XHRcdFx0XHRcdFx0Y29udGFpbmVyOiBjb250YWluZXIub2Zmc2V0V2lkdGgsXG5cdFx0XHRcdFx0XHRcdFx0aXRlbXM6IGl0ZW1zLnNjcm9sbFdpZHRoXG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKGRlbGF5KSB7XG5cdFx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0bW92ZSgpO1xuXHRcdFx0XHR9LCBkZWxheSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtb3ZlKCk7XG5cdFx0XHR9XG5cblxuXHRcdH1cblxuXHRcdHB1YmxpYyBtb2RhbENsaWNrKCRldmVudD86IFVJRXZlbnQpIHtcblxuXHRcdFx0aWYgKCRldmVudCkge1xuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuc2V0Rm9jdXMoKTtcblxuXHRcdH1cblxuXHRcdC8vIHNldCB0aGUgZm9jdXNcblx0XHRwdWJsaWMgc2V0Rm9jdXMoKSB7XG5cblx0XHRcdGlmICh0aGlzLm1vZGFsVmlzaWJsZSkge1xuXG5cdFx0XHRcdGxldCBlbGVtZW50OiBOb2RlID0gdGhpcy5lbCgnZGl2LmFzZy1tb2RhbC4nICsgdGhpcy5pZCArICcgLmtleUlucHV0JylbMF07XG5cblx0XHRcdFx0aWYgKGVsZW1lbnQpIHtcblx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbWVudClbMF1bJ2ZvY3VzJ10oKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgZXZlbnQoZXZlbnQ6IHN0cmluZywgZGF0YT86IGFueSkge1xuXG5cdFx0XHRldmVudCA9IGV2ZW50ICsgdGhpcy5pZDtcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kZW1pdChldmVudCwgZGF0YSk7XG5cdFx0XHR0aGlzLmxvZyhldmVudCwgZGF0YSk7XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgbG9nKGV2ZW50OiBzdHJpbmcsIGRhdGE/OiBhbnkpIHtcblxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5kZWJ1Zykge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhldmVudCwgZGF0YSA/IGRhdGEgOiBudWxsKTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIGdldCBlbGVtZW50XG5cdFx0cHVibGljIGVsKHNlbGVjdG9yKTogTm9kZUxpc3Qge1xuXG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cblx0XHR9XG5cblx0XHQvLyBjYWxjdWxhdGluZyBlbGVtZW50IHJlYWwgd2lkdGhcblx0XHRwdWJsaWMgZ2V0UmVhbFdpZHRoKGl0ZW0pIHtcblxuXHRcdFx0bGV0IHN0eWxlID0gaXRlbS5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUoaXRlbSksXG5cdFx0XHRcdHdpZHRoID0gaXRlbS5vZmZzZXRXaWR0aCxcblx0XHRcdFx0bWFyZ2luID0gcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5MZWZ0KSArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luUmlnaHQpLFxuXHRcdFx0XHQvLyBwYWRkaW5nID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdSaWdodCksXG5cdFx0XHRcdGJvcmRlciA9IHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyTGVmdFdpZHRoKSArIHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyUmlnaHRXaWR0aCk7XG5cblx0XHRcdHJldHVybiB3aWR0aCArIG1hcmdpbiArIGJvcmRlcjtcblxuXHRcdH1cblxuXHRcdC8vIGNhbGN1bGF0aW5nIGVsZW1lbnQgcmVhbCBoZWlnaHRcblx0XHRwdWJsaWMgZ2V0UmVhbEhlaWdodChpdGVtKSB7XG5cblx0XHRcdGxldCBzdHlsZSA9IGl0ZW0uY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGl0ZW0pLFxuXHRcdFx0XHRoZWlnaHQgPSBpdGVtLm9mZnNldEhlaWdodCxcblx0XHRcdFx0bWFyZ2luID0gcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Ub3ApICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Cb3R0b20pLFxuXHRcdFx0XHQvLyBwYWRkaW5nID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0JvdHRvbSksXG5cdFx0XHRcdGJvcmRlciA9IHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyVG9wV2lkdGgpICsgcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCk7XG5cblx0XHRcdHJldHVybiBoZWlnaHQgKyBtYXJnaW4gKyBib3JkZXI7XG5cblx0XHR9XG5cblxuXHRcdC8vIGVkaXQgZ2FsbGVyeVxuXHRcdHB1YmxpYyBlZGl0R2FsbGVyeShlZGl0OiBJRWRpdCkge1xuXG5cdFx0XHR0aGlzLmVkaXRpbmcgPSB0cnVlO1xuXHRcdFx0bGV0IHNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZDtcblxuXHRcdFx0aWYgKGVkaXQub3B0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMub3B0aW9uc0xvYWRlZCA9IGZhbHNlO1xuXHRcdFx0XHR0aGlzLnNldE9wdGlvbnMoZWRpdC5vcHRpb25zKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGVkaXQuZGVsZXRlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5kZWxldGVJbWFnZShlZGl0LmRlbGV0ZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlZGl0LmFkZCkge1xuXHRcdFx0XHRsZXQgbGVuZ3RoID0gZWRpdC5hZGQubGVuZ3RoO1xuXHRcdFx0XHRmb3IgKGxldCBrZXkgPSAwOyBrZXkgPCBsZW5ndGg7IGtleSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5hZGRJbWFnZShlZGl0LmFkZFtrZXldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZWRpdC51cGRhdGUpIHtcblxuXHRcdFx0XHRsZXQgbGVuZ3RoID0gZWRpdC51cGRhdGUubGVuZ3RoO1xuXG5cdFx0XHRcdGZvciAobGV0IGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcblx0XHRcdFx0XHR0aGlzLmFkZEltYWdlKGVkaXQudXBkYXRlW2tleV0sIGtleSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgY291bnQgPSB0aGlzLmZpbGVzLmxlbmd0aCAtIGVkaXQudXBkYXRlLmxlbmd0aDtcblx0XHRcdFx0aWYgKGNvdW50ID4gMCkge1xuXHRcdFx0XHRcdHRoaXMuZGVsZXRlSW1hZ2UobGVuZ3RoLCBjb3VudCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGVkaXQuc2VsZWN0ZWQgPj0gMCkge1xuXHRcdFx0XHRzZWxlY3RlZCA9IGVkaXQuc2VsZWN0ZWQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlZGl0LnNlbGVjdGVkID09IC0xKSB7XG5cdFx0XHRcdHNlbGVjdGVkID0gdGhpcy5maWxlcy5sZW5ndGggLSAxO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxlY3RlZCA9IHRoaXMuZmlsZXNbc2VsZWN0ZWRdID8gc2VsZWN0ZWQgOiAoc2VsZWN0ZWQgPj0gdGhpcy5maWxlcy5sZW5ndGggPyB0aGlzLmZpbGVzLmxlbmd0aCAtIDEgOiAwKTtcblx0XHRcdHRoaXMuZm9yY2VTZWxlY3QodGhpcy5maWxlc1tzZWxlY3RlZF0gPyBzZWxlY3RlZCA6IDApO1xuXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xuXG5cdFx0XHRcdHRoaXMuZWRpdGluZyA9IGZhbHNlO1xuXHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkdBTExFUllfVVBEQVRFRCwgZWRpdCk7XG5cdFx0XHRcdHRoaXMudGh1bWJuYWlsc01vdmUoZWRpdC5kZWxheVRodW1ibmFpbHMgIT09IHVuZGVmaW5lZCA/IGVkaXQuZGVsYXlUaHVtYm5haWxzIDogMjIwKTtcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5MQVNUX1RIVU1CTkFJTCk7XG5cblx0XHRcdH0sIChlZGl0LmRlbGF5UmVmcmVzaCAhPT0gdW5kZWZpbmVkID8gZWRpdC5kZWxheVJlZnJlc2ggOiA0MjApKTtcblxuXHRcdH1cblxuXG5cdFx0Ly8gZGVsZXRlIGltYWdlXG5cdFx0cHVibGljIGRlbGV0ZUltYWdlKGluZGV4OiBudW1iZXIsIGNvdW50PzogbnVtYmVyKSB7XG5cblx0XHRcdGluZGV4ID0gaW5kZXggPT09IG51bGwgfHwgaW5kZXggPT09IHVuZGVmaW5lZCA/IHRoaXMuc2VsZWN0ZWQgOiBpbmRleDtcblx0XHRcdGNvdW50ID0gY291bnQgPyBjb3VudCA6IDE7XG5cblx0XHRcdHRoaXMuZmlsZXMuc3BsaWNlKGluZGV4LCBjb3VudCk7XG5cblx0XHR9XG5cblx0XHQvLyBmaW5kIGltYWdlIGluIGdhbGxlcnkgYnkgbW9kYWwgc291cmNlXG5cdFx0cHVibGljIGZpbmRJbWFnZShmaWxlbmFtZSA6IHN0cmluZykge1xuXG5cdFx0XHRsZXQgbGVuZ3RoID0gdGhpcy5maWxlcy5sZW5ndGg7XG5cblx0XHRcdGZvciAobGV0IGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcblx0XHRcdFx0aWYgKHRoaXMuZmlsZXNba2V5XS5zb3VyY2UubW9kYWwgPT09IGZpbGVuYW1lKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZmlsZXNba2V5XTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHR9XG5cblxuXHRcdHB1YmxpYyBnZXRGdWxsVXJsKHVybCA6IHN0cmluZywgYmFzZVVybD86IHN0cmluZykge1xuXG5cdFx0XHRiYXNlVXJsID0gYmFzZVVybCA9PT0gdW5kZWZpbmVkID8gdGhpcy5vcHRpb25zLmJhc2VVcmwgOiBiYXNlVXJsO1xuXHRcdFx0bGV0IGlzRnVsbCA9ICh1cmwuaW5kZXhPZignLy8nKSA9PT0gMCB8fCB1cmwuaW5kZXhPZignaHR0cCcpID09PSAwKSA/IHRydWUgOiBmYWxzZTtcblxuXHRcdFx0cmV0dXJuIGlzRnVsbCA/IHVybCA6IGJhc2VVcmwgKyB1cmw7XG5cblx0XHR9XG5cblx0XHQvLyBhZGQgaW1hZ2Vcblx0XHRwdWJsaWMgYWRkSW1hZ2UodmFsdWU6IGFueSwgaW5kZXg/OiBudW1iZXIpIHtcblxuXHRcdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzZWxmID0gdGhpcztcblxuXHRcdFx0aWYgKGFuZ3VsYXIuaXNTdHJpbmcodmFsdWUpID09PSB0cnVlKSB7XG5cdFx0XHRcdHZhbHVlID0geyBzb3VyY2U6IHsgbW9kYWw6IHZhbHVlIH0gfTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGdldEF2YWlsYWJsZVNvdXJjZSA9IGZ1bmN0aW9uICh0eXBlOiBzdHJpbmcsIHNyYzogSVNvdXJjZSkge1xuXG5cdFx0XHRcdGlmIChzcmNbdHlwZV0pIHtcblxuXHRcdFx0XHRcdHJldHVybiBzZWxmLmdldEZ1bGxVcmwoc3JjW3R5cGVdKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICdwYW5lbCcpIHtcblx0XHRcdFx0XHRcdHR5cGUgPSAnaW1hZ2UnO1xuXHRcdFx0XHRcdFx0aWYgKHNyY1t0eXBlXSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5nZXRGdWxsVXJsKHNyY1t0eXBlXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICdpbWFnZScpIHtcblx0XHRcdFx0XHRcdHR5cGUgPSAnbW9kYWwnO1xuXHRcdFx0XHRcdFx0aWYgKHNyY1t0eXBlXSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5nZXRGdWxsVXJsKHNyY1t0eXBlXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICdtb2RhbCcpIHtcblx0XHRcdFx0XHRcdHR5cGUgPSAnaW1hZ2UnO1xuXHRcdFx0XHRcdFx0aWYgKHNyY1t0eXBlXSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5nZXRGdWxsVXJsKHNyY1t0eXBlXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCF2YWx1ZS5zb3VyY2UpIHtcblx0XHRcdFx0dmFsdWUuc291cmNlID0ge1xuXHRcdFx0XHRcdG1vZGFsOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5tb2RhbF0sXG5cdFx0XHRcdFx0cGFuZWw6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLnBhbmVsXSxcblx0XHRcdFx0XHRpbWFnZTogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UuaW1hZ2VdLFxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5wbGFjZWhvbGRlcl1cblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHNvdXJjZSA9IHtcblx0XHRcdFx0bW9kYWw6IGdldEF2YWlsYWJsZVNvdXJjZSgnbW9kYWwnLCB2YWx1ZS5zb3VyY2UpLFxuXHRcdFx0XHRwYW5lbDogZ2V0QXZhaWxhYmxlU291cmNlKCdwYW5lbCcsIHZhbHVlLnNvdXJjZSksXG5cdFx0XHRcdGltYWdlOiBnZXRBdmFpbGFibGVTb3VyY2UoJ2ltYWdlJywgdmFsdWUuc291cmNlKSxcblx0XHRcdFx0Y29sb3I6IHZhbHVlLmNvbG9yID8gdmFsdWUuY29sb3IgOiAndHJhbnNwYXJlbnQnLFxuXHRcdFx0XHRwbGFjZWhvbGRlcjogdmFsdWUucGxhY2Vob2xkZXIgPyBzZWxmLmdldEZ1bGxVcmwodmFsdWUucGxhY2Vob2xkZXIpIDogbnVsbFxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCFzb3VyY2UubW9kYWwpIHtcblx0XHRcdFx0c2VsZi5sb2coJ2ludmFsaWQgaW1hZ2UgZGF0YScsIHsgc291cmNlOiBzb3VyY2UsIHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgcGFydHMgPSBzb3VyY2UubW9kYWwuc3BsaXQoJy8nKTtcblx0XHRcdGxldCBmaWxlbmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuXHRcdFx0bGV0IHRpdGxlLCBzdWJ0aXRsZSwgZGVzY3JpcHRpb247XG5cblx0XHRcdGlmIChzZWxmLm9wdGlvbnMuZmllbGRzICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGl0bGUgPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRpdGxlXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdIDogZmlsZW5hbWU7XG5cdFx0XHRcdHN1YnRpdGxlID0gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zdWJ0aXRsZV0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnN1YnRpdGxlXSA6IG51bGw7XG5cdFx0XHRcdGRlc2NyaXB0aW9uID0gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5kZXNjcmlwdGlvbl0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA6IG51bGw7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aXRsZSA9IGZpbGVuYW1lO1xuXHRcdFx0XHRzdWJ0aXRsZSA9IG51bGw7XG5cdFx0XHRcdGRlc2NyaXB0aW9uID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGZpbGUgPSB7XG5cdFx0XHRcdHNvdXJjZTogc291cmNlLFxuXHRcdFx0XHR0aXRsZTogdGl0bGUsXG5cdFx0XHRcdHN1YnRpdGxlOiBzdWJ0aXRsZSxcblx0XHRcdFx0ZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuXHRcdFx0XHRsb2FkZWQ6IHtcblx0XHRcdFx0XHRtb2RhbDogZmFsc2UsXG5cdFx0XHRcdFx0cGFuZWw6IGZhbHNlLFxuXHRcdFx0XHRcdGltYWdlOiBmYWxzZVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoaW5kZXggIT09IHVuZGVmaW5lZCAmJiB0aGlzLmZpbGVzW2luZGV4XSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdID0gZmlsZTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKHNlbGYub3B0aW9ucy5kdXBsaWNhdGVzICE9PSB0cnVlICYmIHRoaXMuZmluZEltYWdlKGZpbGUuc291cmNlLm1vZGFsKSkge1xuXHRcdFx0XHRcdHNlbGYuZXZlbnQoc2VsZi5ldmVudHMuRE9VQkxFX0lNQUdFLCBmaWxlKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLmZpbGVzLnB1c2goZmlsZSk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9XG5cblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XG5cblx0YXBwLnNlcnZpY2UoJ2FzZ1NlcnZpY2UnLCBbJyR0aW1lb3V0JywgJyRpbnRlcnZhbCcsICckbG9jYXRpb24nLCAnJHJvb3RTY29wZScsICckd2luZG93JywgU2VydmljZUNvbnRyb2xsZXJdKTtcblxufVxuXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBUaHVtYm5haWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtczogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmw6IHN0cmluZztcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgPSAndGh1bWJuYWlsJztcclxuXHRcdHByaXZhdGUgdGVtcGxhdGU7XHJcblx0XHRwcml2YXRlIGFzZzogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSBtb2RhbCA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBsb2FkZWQgPSAwO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKFxyXG5cdFx0XHRwcml2YXRlIHNlcnZpY2U6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0cHJpdmF0ZSAkc2NvcGU6IElTY29wZSxcclxuXHRcdFx0cHJpdmF0ZSAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuXHRcdFx0cHJpdmF0ZSAkZWxlbWVudDogbmcuSVJvb3RFbGVtZW50U2VydmljZSxcclxuXHRcdFx0cHJpdmF0ZSAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlKSB7XHJcblxyXG5cdFx0XHR0aGlzLnRlbXBsYXRlID0gJy92aWV3cy9hc2ctdGh1bWJuYWlsLmh0bWwnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHBhcmVudCBhc2cgY29tcG9uZW50IChtb2RhbClcclxuXHRcdFx0aWYgKHRoaXMuJHNjb3BlICYmIHRoaXMuJHNjb3BlLiRwYXJlbnQgJiYgdGhpcy4kc2NvcGUuJHBhcmVudC4kcGFyZW50ICYmIHRoaXMuJHNjb3BlLiRwYXJlbnQuJHBhcmVudFsnJGN0cmwnXSkge1xyXG5cdFx0XHRcdHRoaXMubW9kYWwgPSB0aGlzLiRzY29wZS4kcGFyZW50LiRwYXJlbnRbJyRjdHJsJ10udHlwZSA9PT0gJ21vZGFsJyA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmFzZy5ldmVudHMuTEFTVF9USFVNQk5BSUwgKyB0aGlzLmlkLCAoZXZlbnQsIGRhdGEpID0+IHtcclxuXHJcblx0XHRcdFx0c2VsZi5hc2cudGh1bWJuYWlsc01vdmUoMTApO1xyXG5cdFx0XHRcdHNlbGYuJHRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0c2VsZi5jb25maWcuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdH0sIDEyMCk7XHJcblxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgb25Mb2FkKGZpbGU/OiBJRmlsZSkge1xyXG5cclxuXHRcdFx0ZmlsZS5sb2FkZWQucGFuZWwgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLmxvYWRlZCsrO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubG9hZGVkID09PSB0aGlzLmFzZy5maWxlcy5sZW5ndGgpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5ldmVudCh0aGlzLmFzZy5ldmVudHMuTEFTVF9USFVNQk5BSUwsIGZpbGUpO1xyXG5cdFx0XHRcdHRoaXMuY29uZmlnLmxvYWRlZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXg6IG51bWJlciwgJGV2ZW50PzogTW91c2VFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLm1vZGFsKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxPcGVuKGluZGV4KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5zZWxlY3QpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5zZXRTZWxlY3RlZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gcHJlbG9kIHdoZW4gbW91c2VvdmVyIGFuZCBzZXQgc2VsZWN0ZWQgaWYgZW5hYmxlZFxyXG5cdFx0cHVibGljIGhvdmVyKGluZGV4OiBudW1iZXIsICRldmVudD86IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5ob3Zlci5wcmVsb2FkID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuaG92ZXJQcmVsb2FkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhvdmVyLnNlbGVjdCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgdGh1bWJuYWlsIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKTogSU9wdGlvbnNUaHVtYm5haWwge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMubW9kYWwgPyB0aGlzLmFzZy5vcHRpb25zLm1vZGFsW3RoaXMudHlwZV0gOiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aHVtYm5haWwgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZTogSU9wdGlvbnNUaHVtYm5haWwpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm1vZGFsKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5hc2cub3B0aW9ucy5tb2RhbFt0aGlzLnR5cGVdID0gdmFsdWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHY6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBhYm92ZSBmcm9tIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBkeW5hbWljKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLmR5bmFtaWMgPyAnZHluYW1pYycgOiAnJztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gYXV0b2hpZGUgYW5kIGlzU2luZ2xlID09IHRydWUgP1xyXG5cdFx0cHVibGljIGdldCBhdXRvaGlkZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5hdXRvaGlkZSAmJiB0aGlzLmFzZy5pc1NpbmdsZSA/IHRydWUgOiBmYWxzZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGNsYXNzZXNcclxuXHRcdHB1YmxpYyBnZXQgY2xhc3NlcygpOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLmNsYXNzZXMgKyAnICcgKyB0aGlzLmR5bmFtaWMgKyAnICcgKyAodGhpcy5jb25maWcuaW5pdGlhbGl6ZWQgPyAnaW5pdGlhbGl6ZWQnIDogJ2luaXRpYWxpemluZycpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRsZXQgYXBwOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudCgnYXNnVGh1bWJuYWlsJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRlbGVtZW50JywgJyR0aW1lb3V0JywgYW5ndWxhclN1cGVyR2FsbGVyeS5UaHVtYm5haWxDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBkYXRhLW5nLWlmPVwiISRjdHJsLmF1dG9oaWRlXCIgY2xhc3M9XCJhc2ctdGh1bWJuYWlsIHt7ICRjdHJsLmNsYXNzZXMgfX1cIiBuZy1jbGljaz1cIiRjdHJsLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XCI+PGRpdiBuZy1pbmNsdWRlPVwiJGN0cmwudGVtcGxhdGVcIj48L2Rpdj48L2Rpdj4nLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAJyxcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR2aXNpYmxlOiAnPT8nLFxyXG5cdFx0XHR0ZW1wbGF0ZTogJ0A/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iXX0=

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('/views/asg-control.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.autoPlayToggle()"><span ng-if="!$ctrl.asg.options.autoplay.enabled" class="fa fa-play"></span> <span ng-if="$ctrl.asg.options.autoplay.enabled" class="fa fa-stop"></span></button> <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toFirst(true)">{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}</button> <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toBackward(true)"><span class="fa fa-chevron-left"></span></button> <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toForward(true)"><span class="fa fa-chevron-right"></span></button>');
$templateCache.put('/views/asg-debug.html','<pre>    \r\n    {{ $ctrl.file | json }}    \r\n</pre><hr><pre>        \r\n    {{ $ctrl.service.instances.abstracts.options | json }}\r\n</pre>');
$templateCache.put('/views/asg-help.html','<ul><li>SPACE : forward</li><li>RIGHT : forward</li><li>LEFT : backward</li><li>UP / HOME : first</li><li>DOWN / END : last</li><li>ENTER : toggle fullscreen</li><li>ESC : exit</li><li>p : play/pause</li><li>t : change transition effect</li><li>m : toggle menu</li><li>s : toggle image size</li><li>c : toggle caption</li><li>h : toggle help</li></ul>');
$templateCache.put('/views/asg-image.html','<div class="asg-image {{ $ctrl.asg.classes }}" ng-class="{\'modalon\' : $ctrl.modalAvailable }" ng-style="{\'min-height\' : $ctrl.config.heightMin + \'px\', \'height\' : $ctrl.height + \'px\'}"><div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)"><div class="img" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-show="$ctrl.asg.selected == key" ng-style="$ctrl.asg.dynamicStyle(file, \'image\', $ctrl.config)" ng-class="{\'loaded\' : file.loaded.image}"><div class="placeholder {{ $ctrl.config.size }}" ng-style="$ctrl.asg.placeholderStyle(file, \'image\')"></div><div class="source {{ $ctrl.config.size }}" ng-style="{\'background-image\': \'url(\' + file.source.image + \')\'}" ng-mouseover="$ctrl.asg.hoverPreload(key)" ng-click="$ctrl.modalOpen($event)"></div></div></div><div class="arrows" ng-if="$ctrl.config.arrows.enabled" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.modalOpen($event)"><div ng-if="!$ctrl.asg.isSingle" class="toBackward"><button class="btn btn-default btn-md pull-left" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)" ng-click="$ctrl.toBackward(true, $event)"><span class="fa fa-chevron-left"></span></button></div><div ng-if="!$ctrl.asg.isSingle" class="toForward"><button class="btn btn-default btn-md pull-right" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)" ng-click="$ctrl.toForward(true, $event)"><span class="fa fa-chevron-right"></span></button></div></div><ng-transclude></ng-transclude></div>');
$templateCache.put('/views/asg-info.html','<div class="row"><div class="col-md-12"><h3>{{ $ctrl.file.title }}</h3></div><div class="col-md-12">{{ $ctrl.file.description }} <a target="_blank" href="{{ $ctrl.download }}"><span class="fa fa-download"></span></a></div></div>');
$templateCache.put('/views/asg-modal.html','<div class="asg-modal {{ $ctrl.asg.classes }}" ng-class="$ctrl.getClass()" ng-click="$ctrl.imageClick($event);" ng-if="$ctrl.asg.modalVisible" ng-cloak><div tabindex="1" class="keyInput" ng-keydown="$ctrl.keyUp($event)"></div><div class="frame" ng-click="$ctrl.asg.modalClick($event);"><div class="header" ng-if="$ctrl.config.header.enabled" ng-click="$ctrl.asg.modalClick($event);"><span class="buttons d-block d-sm-none pull-right"><span ng-include="\'/views/button/asg-index-xs.html\'"></span> </span><span class="buttons d-none d-sm-block pull-right"><span ng-repeat="item in $ctrl.config.header.buttons" ng-include="(\'/views/button/asg-\' + item + \'.html\')"></span> </span><span ng-if="$ctrl.config.title"><span class="title">{{ $ctrl.config.title }}</span> <span class="subtitle d-none d-sm-block" ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span></span></div><div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}" ng-style="{\'top\': $ctrl.marginTop + \'px\', \'bottom\': $ctrl.marginBottom + \'px\'}" ng-mouseover="$ctrl.asg.over.modalImage = true;" ng-mouseleave="$ctrl.asg.over.modalImage = false;"><div class="help text-right" ng-click="$ctrl.toggleHelp($event)" ng-show="$ctrl.config.help" ng-include="\'/views/asg-help.html\'"></div><div class="arrows" ng-if="$ctrl.config.arrows.enabled" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.imageClick($event)"><div ng-if="!$ctrl.asg.isSingle" class="toBackward"><button class="btn btn-default btn-lg pull-left" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)" ng-click="$ctrl.toBackward(true, $event)"><span class="fa fa-chevron-left"></span></button></div><div ng-if="!$ctrl.asg.isSingle" class="toForward"><button class="btn btn-default btn-lg pull-right" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)" ng-click="$ctrl.toForward(true, $event)"><span class="fa fa-chevron-right"></span></button></div></div><div class="img" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-show="$ctrl.asg.selected == key" ng-style="$ctrl.asg.dynamicStyle(file, \'modal\', $ctrl.config)" ng-class="{\'loaded\' : file.loaded.modal}"><div class="placeholder {{ $ctrl.config.size }}" ng-style="$ctrl.asg.placeholderStyle(file, \'modal\')"></div><div class="source {{ $ctrl.config.size }}" ng-if="file.loaded.modal" ng-style="{\'background-image\': \'url(\' + file.source.modal + \')\'}"></div></div><div class="caption {{ $ctrl.config.caption.position }}" ng-show="!$ctrl.config.caption.disabled" ng-class="{\'visible\' : $ctrl.config.caption.visible}"><div class="content"><span class="title">{{ $ctrl.asg.file.title }}</span> <span ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description">- </span><span class="description">{{ $ctrl.asg.file.description }}</span> <a ng-if="$ctrl.config.caption.download" href="{{ $ctrl.asg.downloadLink() }}" target="_blank" class="btn btn-default btn-sm"><span class="fa fa-download"></span> Download</a></div></div></div><ng-transclude></ng-transclude></div></div>');
$templateCache.put('/views/asg-panel.html','<div class="items {{ $ctrl.asg.options.panel.items.class }}"><div class="item {{ $ctrl.asg.options.panel.item.class }}" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-style="{\'background-color\': file.source.color}" ng-class="{\'selected\' : $ctrl.asg.selected == key}"><img ng-src="{{ file.source.panel }}" ng-click="$ctrl.setSelected(key, $event)" alt="{{ file.title }}"><div class="caption" ng-if="$ctrl.config.item.caption"><span class="index" ng-if="$ctrl.config.item.index">{{ key + 1 }}</span> <span>{{ file.title }}</span></div></div></div>');
$templateCache.put('/views/asg-thumbnail.html','<div class="items"><div class="item" ng-click="$ctrl.setSelected(key, $event)" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-style="{\'background-color\': file.source.color}" ng-class="{\'selected\' : $ctrl.asg.selected == key}"><img ng-src="{{ file.source.panel }}" ng-on-load="$ctrl.onLoad(file)" ng-style="{\'height\': $ctrl.config.height + \'px\'}" alt="{{ file.title }}"> <span class="index" ng-if="$ctrl.config.index">{{ key + 1 }}</span></div></div>');
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