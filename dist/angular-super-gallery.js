/**
 * angular-super-gallery - AngularJS Super Gallery
 * 
 * @version v2.1.9
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
            enumerable: false,
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
            enumerable: false,
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
            enumerable: false,
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

var Vimeo;
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ImageController.prototype, "config", {
            get: function () {
                return this.asg.options[this.type];
            },
            set: function (value) {
                this.asg.options[this.type] = value;
            },
            enumerable: false,
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ImageController.prototype, "modalAvailable", {
            get: function () {
                return this.asg.modalAvailable && this.config.click.modal;
            },
            enumerable: false,
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
        ImageController.prototype.playVideo = function ($event) {
            if ($event) {
                $event.stopPropagation();
            }
            var self = this;
            this.asg.file.video.visible = true;
            this.asg.file.video.htmlId = 'vimeo_video_' + this.asg.file.video.vimeoId;
            var options = {
                id: this.asg.file.video.vimeoId,
                responsive: true,
                loop: false
            };
            if (this.asg.file.video.player) {
                var player = this.asg.file.video.player;
            }
            else {
                var player = new Vimeo.Player(this.asg.file.video.htmlId, options);
            }
            player.setVolume(0.5);
            player.play().catch(function (error) {
                console.error('error playing the video:', error);
            });
            player.on('play', function () {
                self.asg.file.video.playing = true;
                console.log('play the video!');
            });
            player.on('pause', function () {
                self.asg.file.video.playing = false;
                console.log('paused the video!');
            });
            this.asg.file.video.player = player;
            this.asg.file.video.playing = true;
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
            enumerable: false,
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ModalController.prototype, "marginBottom", {
            get: function () {
                return this.config.marginBottom;
            },
            enumerable: false,
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
            enumerable: false,
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ModalController.prototype, "config", {
            get: function () {
                return this.asg.options[this.type];
            },
            set: function (value) {
                this.asg.options[this.type] = value;
            },
            enumerable: false,
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
            enumerable: false,
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
            enumerable: false,
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
        function ServiceController(timeout, interval, location, $rootScope, $window, $sce) {
            var _this = this;
            this.timeout = timeout;
            this.interval = interval;
            this.location = location;
            this.$rootScope = $rootScope;
            this.$window = $window;
            this.$sce = $sce;
            this.version = "2.1.9";
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
                    video: 'video',
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
                instance = new ServiceController(this.timeout, this.interval, this.location, this.$rootScope, this.$window, this.$sce);
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
                if (prev != v && this.file && this.file.video && this.file.video.playing) {
                    this.file.video.player.pause();
                    this.file.video.paused = true;
                }
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
                    if (this.file.video && this.file.video.paused) {
                        this.file.video.player.play();
                        this.file.video.paused = false;
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
            enumerable: false,
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
            enumerable: false,
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
            enumerable: false,
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ServiceController.prototype, "theme", {
            get: function () {
                return this.options.theme;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ServiceController.prototype, "classes", {
            get: function () {
                return this.options.theme + ' ' + this.id + (this.editing ? ' editing' : '');
            },
            enumerable: false,
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
            var title, subtitle, description, video;
            if (self.options.fields !== undefined) {
                title = value[self.options.fields.title] ? value[self.options.fields.title] : filename;
                subtitle = value[self.options.fields.subtitle] ? value[self.options.fields.subtitle] : null;
                description = value[self.options.fields.description] ? value[self.options.fields.description] : null;
                video = value[self.options.fields.video] ? value[self.options.fields.video] : null;
            }
            else {
                title = filename;
                subtitle = null;
                description = null;
                video = null;
            }
            var file = {
                source: source,
                title: title,
                subtitle: subtitle,
                description: description,
                video: video,
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
    app.service('asgService', ['$timeout', '$interval', '$location', '$rootScope', '$window', '$sce', ServiceController]);
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
            enumerable: false,
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ThumbnailController.prototype, "dynamic", {
            get: function () {
                return this.config.dynamic ? 'dynamic' : '';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ThumbnailController.prototype, "autohide", {
            get: function () {
                return this.config.autohide && this.asg.isSingle ? true : false;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ThumbnailController.prototype, "classes", {
            get: function () {
                return this.asg.classes + ' ' + this.dynamic + ' ' + (this.config.initialized ? 'initialized' : 'initializing');
            },
            enumerable: false,
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzZy50cyIsImFzZy1jb250cm9sLnRzIiwiYXNnLWRlYnVnLnRzIiwiYXNnLWltYWdlLnRzIiwiYXNnLWluZm8udHMiLCJhc2ctbW9kYWwudHMiLCJhc2ctcGFuZWwudHMiLCJhc2ctc2VydmljZS50cyIsImFzZy10aHVtYm5haWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBVSxtQkFBbUIsQ0EyQjVCO0FBM0JELFdBQVUsbUJBQW1CO0lBRTVCLElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFdkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDdEIsT0FBTyxVQUFVLEtBQVcsRUFBRSxTQUFrQjtZQUUvQyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDakQsT0FBTyxFQUFFLENBQUM7YUFDVjtZQUVELElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtnQkFDaEIsT0FBTyxHQUFHLENBQUM7YUFDWDtZQUVELElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxFQUFFO2dCQUNyQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO2FBQ2Q7WUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FB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IjpbIlxyXG5uYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknLCBbJ25nQW5pbWF0ZScsICduZ1RvdWNoJ10pO1xyXG5cclxuXHRhcHAuZmlsdGVyKCdhc2dCeXRlcycsICgpID0+IHtcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoYnl0ZXMgOiBhbnksIHByZWNpc2lvbiA6IG51bWJlcikgOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0aWYgKGlzTmFOKHBhcnNlRmxvYXQoYnl0ZXMpKSB8fCAhaXNGaW5pdGUoYnl0ZXMpKSB7XHJcblx0XHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoYnl0ZXMgPT09IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gJzAnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodHlwZW9mIHByZWNpc2lvbiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRwcmVjaXNpb24gPSAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgdW5pdHMgPSBbJ2J5dGVzJywgJ2tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJ10sXHJcblx0XHRcdFx0bnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZygxMDI0KSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gKGJ5dGVzIC8gTWF0aC5wb3coMTAyNCwgTWF0aC5mbG9vcihudW1iZXIpKSkudG9GaXhlZChwcmVjaXNpb24pICsgJyAnICsgdW5pdHNbbnVtYmVyXTtcclxuXHJcblx0XHR9O1xyXG5cdH0pO1xyXG5cclxufVxyXG5cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgQ29udHJvbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZDogc3RyaW5nO1xyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ2NvbnRyb2wnO1xyXG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgdGVtcGxhdGU7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IoXHJcblx0XHRcdHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRwcml2YXRlICRzY29wZTogSVNjb3BlKSB7XHJcblxyXG5cdFx0XHR0aGlzLnRlbXBsYXRlID0gJy92aWV3cy9hc2ctY29udHJvbC5odG1sJztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHRcdHRoaXMuJHNjb3BlLmZvcndhcmQgPSAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dGhpcy4kc2NvcGUuYmFja3dhcmQgPSAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZCh0cnVlKTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCBpbWFnZSBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCk6IElPcHRpb25zSW1hZ2Uge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IGltYWdlIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWU6IElPcHRpb25zSW1hZ2UpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodjogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dDb250cm9sJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuQ29udHJvbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYXNnLWNvbnRyb2wge3sgJGN0cmwuYXNnLmNsYXNzZXMgfX1cIj48ZGl2IG5nLWluY2x1ZGU9XCIkY3RybC50ZW1wbGF0ZVwiPjwvZGl2PjwvZGl2PicsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIERlYnVnQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIGFzZzogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSB0eXBlO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZTtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihcclxuXHRcdFx0cHJpdmF0ZSBzZXJ2aWNlOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHRcdHRoaXMudHlwZSA9ICdpbmZvJztcclxuXHRcdFx0dGhpcy50ZW1wbGF0ZSA9ICcvdmlld3MvYXNnLWRlYnVnLmh0bWwnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgZ2V0IGZpbGUoKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5maWxlO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dEZWJ1ZycsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LkRlYnVnQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctZGVidWcge3sgJGN0cmwuYXNnLmNsYXNzZXMgfX1cIj48ZGl2IG5nLWluY2x1ZGU9XCIkY3RybC50ZW1wbGF0ZVwiPjwvZGl2PjwvZGl2PicsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsInZhciBWaW1lbztcblxubmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xuXG5cdGV4cG9ydCBjbGFzcyBJbWFnZUNvbnRyb2xsZXIge1xuXG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XG5cdFx0cHVibGljIG9wdGlvbnM6IElPcHRpb25zO1xuXHRcdHB1YmxpYyBpdGVtczogQXJyYXk8SUZpbGU+O1xuXHRcdHB1YmxpYyBiYXNlVXJsOiBzdHJpbmc7XG5cblx0XHRwcml2YXRlIHR5cGUgPSAnaW1hZ2UnO1xuXHRcdHByaXZhdGUgYXNnOiBJU2VydmljZUNvbnRyb2xsZXI7XG5cblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2U6IElTZXJ2aWNlQ29udHJvbGxlcixcblx0XHRcdHByaXZhdGUgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXG5cdFx0XHRwcml2YXRlICRlbGVtZW50OiBuZy5JUm9vdEVsZW1lbnRTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSAkd2luZG93OiBuZy5JV2luZG93U2VydmljZSxcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUpIHtcblxuXHRcdFx0YW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoJ3Jlc2l6ZScsIChldmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLm9uUmVzaXplKCk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblxuXHRcdHByaXZhdGUgb25SZXNpemUoKSB7XG5cblx0XHRcdGlmICh0aGlzLmNvbmZpZy5oZWlnaHRBdXRvLm9ucmVzaXplKSB7XG5cdFx0XHRcdHRoaXMuc2V0SGVpZ2h0KHRoaXMuYXNnLmZpbGUpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cHVibGljICRvbkluaXQoKSB7XG5cblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcblxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0XHQvLyBzZXQgaW1hZ2UgY29tcG9uZW50IGhlaWdodFxuXHRcdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmFzZy5ldmVudHMuRklSU1RfSU1BR0UgKyB0aGlzLmlkLCAoZXZlbnQsIGRhdGEpID0+IHtcblxuXHRcdFx0XHRpZiAoIXRoaXMuY29uZmlnLmhlaWdodCAmJiB0aGlzLmNvbmZpZy5oZWlnaHRBdXRvLmluaXRpYWwgPT09IHRydWUpIHtcblx0XHRcdFx0XHR0aGlzLiR0aW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdHNlbGYuc2V0SGVpZ2h0KGRhdGEuaW1nKTtcblx0XHRcdFx0XHR9LCAxMCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIHNjb3BlIGFwcGx5IHdoZW4gaW1hZ2UgbG9hZGVkXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJG9uKHRoaXMuYXNnLmV2ZW50cy5MT0FEX0lNQUdFICsgdGhpcy5pZCwgKGV2ZW50LCBkYXRhKSA9PiB7XG5cblx0XHRcdFx0dGhpcy4kc2NvcGUuJGFwcGx5KCk7XG5cblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0Ly8gc2V0IGltYWdlIGNvbXBvbmVudCBoZWlnaHRcblx0XHRwcml2YXRlIHNldEhlaWdodChpbWcpIHtcblxuXHRcdFx0bGV0IHdpZHRoID0gdGhpcy4kZWxlbWVudC5jaGlsZHJlbignZGl2JylbMF0uY2xpZW50V2lkdGg7XG5cdFx0XHRsZXQgcmF0aW8gPSBpbWcud2lkdGggLyBpbWcuaGVpZ2h0O1xuXHRcdFx0dGhpcy5jb25maWcuaGVpZ2h0ID0gd2lkdGggLyByYXRpbztcblxuXHRcdH1cblxuXHRcdC8vIGhlaWdodFxuXHRcdHB1YmxpYyBnZXQgaGVpZ2h0KCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcuaGVpZ2h0O1xuXG5cdFx0fVxuXG5cblx0XHQvLyBnZXQgaW1hZ2UgY29uZmlnXG5cdFx0cHVibGljIGdldCBjb25maWcoKTogSU9wdGlvbnNJbWFnZSB7XG5cblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XG5cblx0XHR9XG5cblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWU6IElPcHRpb25zSW1hZ2UpIHtcblxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgdG9CYWNrd2FyZChzdG9wPzogYm9vbGVhbiwgJGV2ZW50PzogVUlFdmVudCkge1xuXG5cdFx0XHRpZiAoJGV2ZW50KSB7XG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZChzdG9wKTtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyB0b0ZvcndhcmQoc3RvcD86IGJvb2xlYW4sICRldmVudD86IFVJRXZlbnQpIHtcblxuXHRcdFx0aWYgKCRldmVudCkge1xuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZChzdG9wKTtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyBob3ZlcihpbmRleDogbnVtYmVyLCAkZXZlbnQ/OiBNb3VzZUV2ZW50KSB7XG5cblx0XHRcdGlmICh0aGlzLmNvbmZpZy5hcnJvd3MucHJlbG9hZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHR0aGlzLmFzZy5ob3ZlclByZWxvYWQoaW5kZXgpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2OiBudW1iZXIpIHtcblxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcblxuXHRcdH1cblxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XG5cblx0XHRcdGlmICghdGhpcy5hc2cpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XG5cblx0XHR9XG5cblx0XHQvLyBtb2RhbCBhdmFpbGFibGVcblx0XHRwdWJsaWMgZ2V0IG1vZGFsQXZhaWxhYmxlKCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cubW9kYWxBdmFpbGFibGUgJiYgdGhpcy5jb25maWcuY2xpY2subW9kYWw7XG5cblx0XHR9XG5cblx0XHQvLyBvcGVuIHRoZSBtb2RhbFxuXHRcdHB1YmxpYyBtb2RhbE9wZW4oJGV2ZW50OiBVSUV2ZW50KSB7XG5cblx0XHRcdGlmICgkZXZlbnQpIHtcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2subW9kYWwpIHtcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxPcGVuKHRoaXMuYXNnLnNlbGVjdGVkKTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHB1YmxpYyBwbGF5VmlkZW8oJGV2ZW50OiBVSUV2ZW50KSB7XG5cblx0XHRcdGlmICgkZXZlbnQpIHtcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRcdHRoaXMuYXNnLmZpbGUudmlkZW8udmlzaWJsZSA9IHRydWU7XG5cdFx0XHR0aGlzLmFzZy5maWxlLnZpZGVvLmh0bWxJZCA9ICd2aW1lb192aWRlb18nICsgdGhpcy5hc2cuZmlsZS52aWRlby52aW1lb0lkO1xuXG5cdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0aWQ6IHRoaXMuYXNnLmZpbGUudmlkZW8udmltZW9JZCxcblx0XHRcdFx0cmVzcG9uc2l2ZTogdHJ1ZSxcblx0XHRcdFx0bG9vcDogZmFsc2Vcblx0XHRcdH07XG5cblx0XHRcdC8vIGNvbnNvbGUubG9nKCd2aWRlbycsICB0aGlzLmFzZy5maWxlLnZpZGVvKTtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCd2aW1lbyBvcHRpb25zJywgb3B0aW9ucyk7XG5cblx0XHRcdGlmICh0aGlzLmFzZy5maWxlLnZpZGVvLnBsYXllcikge1xuXHRcdFx0XHR2YXIgcGxheWVyID0gdGhpcy5hc2cuZmlsZS52aWRlby5wbGF5ZXI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgcGxheWVyID0gbmV3IFZpbWVvLlBsYXllcih0aGlzLmFzZy5maWxlLnZpZGVvLmh0bWxJZCwgb3B0aW9ucyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHBsYXllci5sb2FkVmlkZW8odGhpcy5hc2cuZmlsZS52aWRlby52aW1lb0lkKS50aGVuKGZ1bmN0aW9uKGlkKSB7XG5cblx0XHRcdC8vIH0pXG5cblx0XHRcdHBsYXllci5zZXRWb2x1bWUoMC41KTtcblxuXHRcdFx0cGxheWVyLnBsYXkoKS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignZXJyb3IgcGxheWluZyB0aGUgdmlkZW86JywgZXJyb3IpO1xuXHRcdFx0fSlcblxuXHRcdFx0cGxheWVyLm9uKCdwbGF5JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGYuYXNnLmZpbGUudmlkZW8ucGxheWluZyA9IHRydWU7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdwbGF5IHRoZSB2aWRlbyEnKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRwbGF5ZXIub24oJ3BhdXNlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGYuYXNnLmZpbGUudmlkZW8ucGxheWluZyA9IGZhbHNlXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdwYXVzZWQgdGhlIHZpZGVvIScpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuYXNnLmZpbGUudmlkZW8ucGxheWVyID0gcGxheWVyO1xuXHRcdFx0dGhpcy5hc2cuZmlsZS52aWRlby5wbGF5aW5nID0gdHJ1ZTtcblxuXHRcdH1cblxuXHR9XG5cblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XG5cblx0YXBwLmNvbXBvbmVudCgnYXNnSW1hZ2UnLCB7XG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnJGVsZW1lbnQnLCAnJHRpbWVvdXQnLCAnJHdpbmRvdycsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LkltYWdlQ29udHJvbGxlcl0sXG5cdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXNnLWltYWdlLmh0bWwnLFxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXG5cdFx0YmluZGluZ3M6IHtcblx0XHRcdGlkOiAnQD8nLFxuXHRcdFx0aXRlbXM6ICc9PycsXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXG5cdFx0XHRiYXNlVXJsOiAnQD8nXG5cdFx0fVxuXHR9KTtcblxuXG59XG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBJbmZvQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIGFzZzogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSB0eXBlO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZTtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihcclxuXHRcdFx0cHJpdmF0ZSBzZXJ2aWNlOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHRcdHRoaXMudHlwZSA9ICdpbmZvJztcclxuXHRcdFx0dGhpcy50ZW1wbGF0ZSA9ICcvdmlld3MvYXNnLWluZm8uaHRtbCc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLmZpbGU7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0luZm8nLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5JbmZvQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctaW5mbyB7eyAkY3RybC5hc2cuY2xhc3NlcyB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgTW9kYWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIGJhc2VVcmwgOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ21vZGFsJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSBhcnJvd3NWaXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkd2luZG93IDogbmcuSVdpbmRvd1NlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICRyb290U2NvcGUgOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbEF2YWlsYWJsZSA9IHRydWU7XHJcblxyXG5cdFx0XHQvLyBzY29wZSBhcHBseSB3aGVuIGltYWdlIGxvYWRlZFxyXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJG9uKHRoaXMuYXNnLmV2ZW50cy5MT0FEX0lNQUdFICsgdGhpcy5pZCwgKGV2ZW50LCBkYXRhKSA9PiB7XHJcblx0XHRcdFx0dGhpcy4kc2NvcGUuJGFwcGx5KCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHJpdmF0ZSBnZXRDbGFzcygpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5jb25maWcpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBuZ0NsYXNzID0gW107XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuaGVhZGVyLmR5bmFtaWMpIHtcclxuXHRcdFx0XHRuZ0NsYXNzLnB1c2goJ2R5bmFtaWMnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bmdDbGFzcy5wdXNoKHRoaXMuYXNnLm9wdGlvbnMudGhlbWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIG5nQ2xhc3Muam9pbignICcpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgYWN0aW9uIGZyb20ga2V5Y29kZXNcclxuXHRcdHByaXZhdGUgZ2V0QWN0aW9uQnlLZXlDb2RlKGtleUNvZGUgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGxldCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5jb25maWcua2V5Y29kZXMpO1xyXG5cdFx0XHRsZXQgYWN0aW9uO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQga2V5IGluIGtleXMpIHtcclxuXHJcblx0XHRcdFx0bGV0IGNvZGVzID0gdGhpcy5jb25maWcua2V5Y29kZXNba2V5c1trZXldXTtcclxuXHJcblx0XHRcdFx0aWYgKCFjb2Rlcykge1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgaW5kZXggPSBjb2Rlcy5pbmRleE9mKGtleUNvZGUpO1xyXG5cclxuXHRcdFx0XHRpZiAoaW5kZXggPiAtMSkge1xyXG5cdFx0XHRcdFx0YWN0aW9uID0ga2V5c1trZXldO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGFjdGlvbjtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBjbG9zZSgkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsb3NlKCk7XHJcblx0XHRcdHRoaXMuZXhpdEZ1bGxTY3JlZW4oKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGltYWdlQ2xpY2soJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5jbG9zZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xvc2UoKTtcclxuXHRcdFx0XHR0aGlzLmV4aXRGdWxsU2NyZWVuKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGhvdmVyKGluZGV4IDogbnVtYmVyLCAkZXZlbnQ/IDogTW91c2VFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmFycm93cy5wcmVsb2FkID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuaG92ZXJQcmVsb2FkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc2V0Rm9jdXMoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5VG9nZ2xlKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLmF1dG9QbGF5VG9nZ2xlKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0ZpcnN0KHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5hc2cudG9GaXJzdCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgdG9CYWNrd2FyZChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0ZvcndhcmQoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyB0b0xhc3Qoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy50b0xhc3Qoc3RvcCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGRvIGtleWJvYXJkIGFjdGlvblxyXG5cdFx0cHVibGljIGtleVVwKGUgOiBLZXlib2FyZEV2ZW50KSB7XHJcblxyXG5cdFx0XHRsZXQgYWN0aW9uIDogc3RyaW5nID0gdGhpcy5nZXRBY3Rpb25CeUtleUNvZGUoZS5rZXlDb2RlKTtcclxuXHJcblx0XHRcdHN3aXRjaCAoYWN0aW9uKSB7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2V4aXQnOlxyXG5cdFx0XHRcdFx0dGhpcy5jbG9zZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3BsYXlwYXVzZSc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy5hdXRvUGxheVRvZ2dsZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2ZvcndhcmQnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2JhY2t3YXJkJzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnZmlyc3QnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9GaXJzdCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdsYXN0JzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvTGFzdCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdmdWxsc2NyZWVuJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlRnVsbFNjcmVlbigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ21lbnUnOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNZW51KCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnY2FwdGlvbic6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUNhcHRpb24oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdoZWxwJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlSGVscCgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3NpemUnOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVTaXplKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAndHJhbnNpdGlvbic6XHJcblx0XHRcdFx0XHR0aGlzLm5leHRUcmFuc2l0aW9uKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLmxvZygndW5rbm93biBrZXlib2FyZCBhY3Rpb246ICcgKyBlLmtleUNvZGUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBzd2l0Y2ggdG8gbmV4dCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHJpdmF0ZSBuZXh0VHJhbnNpdGlvbigkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHRsZXQgaWR4ID0gdGhpcy5hc2cudHJhbnNpdGlvbnMuaW5kZXhPZih0aGlzLmNvbmZpZy50cmFuc2l0aW9uKSArIDE7XHJcblx0XHRcdGxldCBuZXh0ID0gaWR4ID49IHRoaXMuYXNnLnRyYW5zaXRpb25zLmxlbmd0aCA/IDAgOiBpZHg7XHJcblx0XHRcdHRoaXMuY29uZmlnLnRyYW5zaXRpb24gPSB0aGlzLmFzZy50cmFuc2l0aW9uc1tuZXh0XTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGZ1bGxzY3JlZW5cclxuXHRcdHByaXZhdGUgdG9nZ2xlRnVsbFNjcmVlbigkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwudG9nZ2xlKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGV4aXQgZnVsbHNjcmVlblxyXG5cdFx0cHJpdmF0ZSBleGl0RnVsbFNjcmVlbigpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy4kd2luZG93LnNjcmVlbmZ1bGwpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICghdGhpcy4kd2luZG93LnNjcmVlbmZ1bGwuaXNGdWxsc2NyZWVuKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbC5leGl0KCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSB0aHVtYm5haWxzXHJcblx0XHRwcml2YXRlIHRvZ2dsZVRodW1ibmFpbHMoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcudGh1bWJuYWlsLmR5bmFtaWMgPSAhdGhpcy5jb25maWcudGh1bWJuYWlsLmR5bmFtaWM7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHVibGljIHNldFRyYW5zaXRpb24odHJhbnNpdGlvbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGVtZVxyXG5cdFx0cHVibGljIHNldFRoZW1lKHRoZW1lIDogc3RyaW5nLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zLnRoZW1lID0gdGhlbWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBoZWxwXHJcblx0XHRwcml2YXRlIHRvZ2dsZUhlbHAoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcuaGVscCA9ICF0aGlzLmNvbmZpZy5oZWxwO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgc2l6ZVxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVTaXplKCRldmVudD8gOiBVSUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblx0XHRcdGxldCBpbmRleCA9IHRoaXMuYXNnLnNpemVzLmluZGV4T2YodGhpcy5jb25maWcuc2l6ZSk7XHJcblx0XHRcdGluZGV4ID0gKGluZGV4ICsgMSkgPj0gdGhpcy5hc2cuc2l6ZXMubGVuZ3RoID8gMCA6ICsraW5kZXg7XHJcblx0XHRcdHRoaXMuY29uZmlnLnNpemUgPSB0aGlzLmFzZy5zaXplc1tpbmRleF07XHJcblx0XHRcdHRoaXMuYXNnLmxvZygndG9nZ2xlIGltYWdlIHNpemU6JywgW3RoaXMuY29uZmlnLnNpemUsIGluZGV4XSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBtZW51XHJcblx0XHRwcml2YXRlIHRvZ2dsZU1lbnUoJGV2ZW50PyA6IFVJRXZlbnQpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcclxuXHRcdFx0dGhpcy5jb25maWcuaGVhZGVyLmR5bmFtaWMgPSAhdGhpcy5jb25maWcuaGVhZGVyLmR5bmFtaWM7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBjYXB0aW9uXHJcblx0XHRwcml2YXRlIHRvZ2dsZUNhcHRpb24oKSB7XHJcblxyXG5cdFx0XHR0aGlzLmNvbmZpZy5jYXB0aW9uLnZpc2libGUgPSAhdGhpcy5jb25maWcuY2FwdGlvbi52aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbWFyZ2ludCB0b3BcclxuXHRcdHB1YmxpYyBnZXQgbWFyZ2luVG9wKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLm1hcmdpblRvcDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1hcmdpbiBib3R0b21cclxuXHRcdHB1YmxpYyBnZXQgbWFyZ2luQm90dG9tKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLm1hcmdpbkJvdHRvbTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1vZGFsIHZpc2libGVcclxuXHRcdHB1YmxpYyBnZXQgdmlzaWJsZSgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5tb2RhbFZpc2libGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBtb2RhbCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgc2V0IHZpc2libGUodmFsdWUgOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbFZpc2libGUgPSB2YWx1ZTtcclxuXHRcdFx0dGhpcy5hc2cuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtb2RhbCBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc01vZGFsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBtb2RhbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNNb2RhbCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cclxuXHRsZXQgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ01vZGFsJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyR3aW5kb3cnLCAnJHJvb3RTY29wZScsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5Lk1vZGFsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hc2ctbW9kYWwuaHRtbCcsXHJcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6ICdAPycsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dmlzaWJsZTogJz0/JyxcclxuXHRcdFx0YmFzZVVybDogJ0A/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBQYW5lbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnM6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zOiBBcnJheTxJRmlsZT47XHJcblx0XHRwdWJsaWMgYmFzZVVybDogc3RyaW5nO1xyXG5cclxuXHRcdHByaXZhdGUgdHlwZSA9ICdwYW5lbCc7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlO1xyXG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihcclxuXHRcdFx0cHJpdmF0ZSBzZXJ2aWNlOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHRcdHRoaXMudGVtcGxhdGUgPSAnL3ZpZXdzL2FzZy1wYW5lbC5odG1sJztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXg6IG51bWJlciwgJGV2ZW50PzogTW91c2VFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLm1vZGFsKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxPcGVuKGluZGV4KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5zZWxlY3QpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5zZXRTZWxlY3RlZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGhvdmVyKGluZGV4OiBudW1iZXIsICRldmVudD86IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5ob3Zlci5wcmVsb2FkID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuaG92ZXJQcmVsb2FkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhvdmVyLnNlbGVjdCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgcGFuZWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpOiBJT3B0aW9uc1BhbmVsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBwYW5lbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlOiBJT3B0aW9uc1BhbmVsKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHY6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dQYW5lbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LlBhbmVsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctcGFuZWwge3sgJGN0cmwuYXNnLmNsYXNzZXMgfX1cIiBuZy1tb3VzZW92ZXI9XCIkY3RybC5hc2cub3Zlci5wYW5lbCA9IHRydWU7XCIgbmctbW91c2VsZWF2ZT1cIiRjdHJsLmFzZy5vdmVyLnBhbmVsID0gZmFsc2U7XCIgbmctc2hvdz1cIiRjdHJsLmNvbmZpZy52aXNpYmxlXCI+PGRpdiBuZy1pbmNsdWRlPVwiJGN0cmwudGVtcGxhdGVcIj48L2Rpdj48bmctdHJhbnNjbHVkZT48L25nLXRyYW5zY2x1ZGU+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0AnLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nLFxyXG5cdFx0XHRiYXNlVXJsOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcblxuXHQvLyBtb2RhbCBjb21wb25lbnQgb3B0aW9uc1xuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zTW9kYWwge1xuXG5cdFx0aGVhZGVyPzoge1xuXHRcdFx0ZW5hYmxlZD86IGJvb2xlYW47XG5cdFx0XHRkeW5hbWljPzogYm9vbGVhbjtcblx0XHRcdGJ1dHRvbnM6IEFycmF5PHN0cmluZz47XG5cdFx0fTtcblx0XHRoZWxwPzogYm9vbGVhbjtcblx0XHRjYXB0aW9uPzoge1xuXHRcdFx0ZGlzYWJsZWQ/OiBib29sZWFuO1xuXHRcdFx0dmlzaWJsZT86IGJvb2xlYW47XG5cdFx0XHRwb3NpdGlvbj86IHN0cmluZztcblx0XHRcdGRvd25sb2FkPzogYm9vbGVhbjtcblx0XHR9O1xuXHRcdHBsYWNlaG9sZGVyPzogc3RyaW5nO1xuXHRcdHRyYW5zaXRpb24/OiBzdHJpbmc7XG5cdFx0dHJhbnNpdGlvblNwZWVkPyA6IG51bWJlcjtcblx0XHR0aXRsZT86IHN0cmluZztcblx0XHRzdWJ0aXRsZT86IHN0cmluZztcblx0XHR0aXRsZUZyb21JbWFnZT8gOiBib29sZWFuO1xuXHRcdHN1YnRpdGxlRnJvbUltYWdlPyA6IGJvb2xlYW47XG5cdFx0YXJyb3dzPzoge1xuXHRcdFx0cHJlbG9hZD86IGJvb2xlYW47XG5cdFx0XHRlbmFibGVkPzogYm9vbGVhbjtcblx0XHR9O1xuXHRcdHNpemU/OiBzdHJpbmc7XG5cdFx0dGh1bWJuYWlsPzogSU9wdGlvbnNUaHVtYm5haWw7XG5cdFx0bWFyZ2luVG9wPzogbnVtYmVyO1xuXHRcdG1hcmdpbkJvdHRvbT86IG51bWJlcjtcblx0XHRjbGljaz86IHtcblx0XHRcdGNsb3NlOiBib29sZWFuO1xuXHRcdH07XG5cdFx0a2V5Y29kZXM/OiB7XG5cdFx0XHRleGl0PzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdHBsYXlwYXVzZT86IEFycmF5PG51bWJlcj47XG5cdFx0XHRmb3J3YXJkPzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGJhY2t3YXJkPzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGZpcnN0PzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGxhc3Q/OiBBcnJheTxudW1iZXI+O1xuXHRcdFx0ZnVsbHNjcmVlbj86IEFycmF5PG51bWJlcj47XG5cdFx0XHRtZW51PzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGNhcHRpb24/OiBBcnJheTxudW1iZXI+O1xuXHRcdFx0aGVscD86IEFycmF5PG51bWJlcj47XG5cdFx0XHRzaXplPzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdHRyYW5zaXRpb24/OiBBcnJheTxudW1iZXI+O1xuXHRcdH07XG5cdH1cblxuXHQvLyBwYW5lbCBjb21wb25lbnQgb3B0aW9uc1xuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zUGFuZWwge1xuXG5cdFx0dmlzaWJsZT86IGJvb2xlYW47XG5cdFx0aXRlbXM/OiB7XG5cdFx0XHRjbGFzcz86IHN0cmluZztcblx0XHR9LFxuXHRcdGl0ZW0/OiB7XG5cdFx0XHRjbGFzcz86IHN0cmluZztcblx0XHRcdGNhcHRpb246IGJvb2xlYW47XG5cdFx0XHRpbmRleDogYm9vbGVhbjtcblx0XHR9O1xuXHRcdGhvdmVyPzoge1xuXHRcdFx0cHJlbG9hZDogYm9vbGVhbjtcblx0XHRcdHNlbGVjdDogYm9vbGVhbjtcblx0XHR9O1xuXHRcdGNsaWNrPzoge1xuXHRcdFx0c2VsZWN0OiBib29sZWFuO1xuXHRcdFx0bW9kYWw6IGJvb2xlYW47XG5cdFx0fTtcblxuXHR9XG5cblx0Ly8gdGh1bWJuYWlsIGNvbXBvbmVudCBvcHRpb25zXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNUaHVtYm5haWwge1xuXG5cdFx0aGVpZ2h0PzogbnVtYmVyO1xuXHRcdGluZGV4PzogYm9vbGVhbjtcblx0XHRlbmFibGVkPzogYm9vbGVhbjtcblx0XHRkeW5hbWljPzogYm9vbGVhbjtcblx0XHRhdXRvaGlkZTogYm9vbGVhbjtcblx0XHRjbGljaz86IHtcblx0XHRcdHNlbGVjdDogYm9vbGVhbjtcblx0XHRcdG1vZGFsOiBib29sZWFuO1xuXHRcdH07XG5cdFx0aG92ZXI/OiB7XG5cdFx0XHRwcmVsb2FkOiBib29sZWFuO1xuXHRcdFx0c2VsZWN0OiBib29sZWFuO1xuXHRcdH07XG5cdFx0bG9hZGVkPzogYm9vbGVhbjtcblx0XHRpbml0aWFsaXplZD86IGJvb2xlYW47XG5cblx0fVxuXG5cdC8vIGluZm8gY29tcG9uZW50IG9wdGlvbnNcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0luZm8ge1xuXG5cdH1cblxuXHQvLyBpbWFnZSBjb21wb25lbnQgb3B0aW9uc1xuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zSW1hZ2Uge1xuXG5cdFx0dHJhbnNpdGlvbj86IHN0cmluZztcblx0XHR0cmFuc2l0aW9uU3BlZWQ/IDogbnVtYmVyO1xuXHRcdHNpemU/OiBzdHJpbmc7XG5cdFx0YXJyb3dzPzoge1xuXHRcdFx0cHJlbG9hZD86IGJvb2xlYW47XG5cdFx0XHRlbmFibGVkPzogYm9vbGVhbjtcblx0XHR9O1xuXHRcdGNsaWNrPzoge1xuXHRcdFx0bW9kYWw6IGJvb2xlYW47XG5cdFx0fTtcblx0XHRoZWlnaHQ/OiBudW1iZXI7XG5cdFx0aGVpZ2h0TWluPzogbnVtYmVyO1xuXHRcdGhlaWdodEF1dG8/OiB7XG5cdFx0XHRpbml0aWFsPzogYm9vbGVhbjtcblx0XHRcdG9ucmVzaXplPzogYm9vbGVhbjtcblx0XHR9O1xuXHRcdHBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cdH1cblxuXHQvLyBnYWxsZXJ5IG9wdGlvbnNcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9ucyB7XG5cblx0XHRkZWJ1Zz86IGJvb2xlYW47XG5cdFx0YmFzZVVybD86IHN0cmluZztcblx0XHRoYXNoVXJsPzogYm9vbGVhbjtcblx0XHRkdXBsaWNhdGVzPzogYm9vbGVhbjtcblx0XHRzZWxlY3RlZD86IG51bWJlcjtcblx0XHRmaWVsZHM/OiB7XG5cdFx0XHRzb3VyY2U/OiB7XG5cdFx0XHRcdG1vZGFsPzogc3RyaW5nO1xuXHRcdFx0XHRwYW5lbD86IHN0cmluZztcblx0XHRcdFx0aW1hZ2U/OiBzdHJpbmc7XG5cdFx0XHRcdHBsYWNlaG9sZGVyPzogc3RyaW5nO1xuXHRcdFx0fVxuXHRcdFx0dGl0bGU/OiBzdHJpbmc7XG5cdFx0XHRzdWJ0aXRsZT86IHN0cmluZztcblx0XHRcdGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXHRcdFx0dGh1bWJuYWlsPzogc3RyaW5nO1xuXHRcdFx0dmlkZW8/OiBzdHJpbmc7XG5cdFx0fTtcblx0XHRhdXRvcGxheT86IHtcblx0XHRcdGVuYWJsZWQ/OiBib29sZWFuO1xuXHRcdFx0ZGVsYXk/OiBudW1iZXI7XG5cdFx0fTtcblx0XHR0aGVtZT86IHN0cmluZztcblx0XHRwcmVsb2FkPzogQXJyYXk8bnVtYmVyPjtcblx0XHRwcmVsb2FkTmV4dD86IGJvb2xlYW47XG5cdFx0cHJlbG9hZERlbGF5PzogbnVtYmVyO1xuXHRcdGxvYWRpbmdJbWFnZT86IHN0cmluZztcblx0XHRtb2RhbD86IElPcHRpb25zTW9kYWw7XG5cdFx0cGFuZWw/OiBJT3B0aW9uc1BhbmVsO1xuXHRcdGltYWdlPzogSU9wdGlvbnNJbWFnZTtcblx0XHR0aHVtYm5haWw/OiBJT3B0aW9uc1RodW1ibmFpbDtcblxuXHR9XG5cblx0Ly8gaW1hZ2Ugc291cmNlXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVNvdXJjZSB7XG5cblx0XHRtb2RhbDogc3RyaW5nOyAvLyBvcmlnaW5hbCwgcmVxdWlyZWRcblx0XHRwYW5lbD86IHN0cmluZztcblx0XHRpbWFnZT86IHN0cmluZztcblx0XHRjb2xvcj86IHN0cmluZztcblx0XHRwbGFjZWhvbGRlcj86IHN0cmluZztcblxuXHR9XG5cblx0Ly8gaW1hZ2UgZmlsZVxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWxlIHtcblxuXHRcdHNvdXJjZTogSVNvdXJjZTtcblx0XHR0aXRsZT86IHN0cmluZztcblx0XHRzdWJ0aXRsZT86IHN0cmluZztcblx0XHRuYW1lPzogc3RyaW5nO1xuXHRcdGV4dGVuc2lvbj86IHN0cmluZztcblx0XHRkZXNjcmlwdGlvbj86IHN0cmluZztcblx0XHR2aWRlbz86IHtcblx0XHRcdHZpbWVvSWQ6IHN0cmluZztcblx0XHRcdHlvdXR1YmVJZDogc3RyaW5nO1xuXHRcdFx0aHRtbElkOiBzdHJpbmc7XG5cdFx0XHRhdXRvcGxheTogYm9vbGVhbjtcblx0XHRcdHBhdXNlZDogYm9vbGVhbjtcblx0XHRcdHZpc2libGU6IGJvb2xlYW47XG5cdFx0XHRwbGF5aW5nOiBib29sZWFuO1xuXHRcdFx0cGxheWVyOiBhbnlcblx0XHR9O1xuXHRcdGRvd25sb2FkPzogc3RyaW5nO1xuXHRcdGxvYWRlZD86IHtcblx0XHRcdG1vZGFsPzogYm9vbGVhbjtcblx0XHRcdHBhbmVsPzogYm9vbGVhbjtcblx0XHRcdGltYWdlPzogYm9vbGVhbjtcblx0XHR9O1xuXHRcdHdpZHRoPzogbnVtYmVyO1xuXHRcdGhlaWdodD86IG51bWJlcjtcblxuXHR9XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJT3ZlciB7XG5cdFx0bW9kYWxJbWFnZTogYm9vbGVhbjtcblx0XHRwYW5lbDogYm9vbGVhbjtcblx0fVxuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUVkaXQge1xuXHRcdGlkOiBudW1iZXI7XG5cdFx0ZGVsZXRlPzogbnVtYmVyO1xuXHRcdGFkZD86IEFycmF5PElGaWxlPjtcblx0XHR1cGRhdGU/OiBBcnJheTxJRmlsZT47XG5cdFx0cmVmcmVzaD86IGJvb2xlYW47XG5cdFx0c2VsZWN0ZWQ/OiBudW1iZXI7XG5cdFx0b3B0aW9ucz86IElPcHRpb25zO1xuXHRcdGRlbGF5VGh1bWJuYWlscz86IG51bWJlcjtcblx0XHRkZWxheVJlZnJlc2g/OiBudW1iZXI7XG5cdH1cblxuXHRleHBvcnQgaW50ZXJmYWNlIElTY29wZSBleHRlbmRzIG5nLklTY29wZSB7XG5cdFx0Zm9yd2FyZDogKCkgPT4gdm9pZDtcblx0XHRiYWNrd2FyZDogKCkgPT4gdm9pZDtcblx0fVxuXG5cdC8vIHNlcnZpY2UgY29udHJvbGxlciBpbnRlcmZhY2Vcblx0ZXhwb3J0IGludGVyZmFjZSBJU2VydmljZUNvbnRyb2xsZXIge1xuXG5cdFx0bW9kYWxWaXNpYmxlOiBib29sZWFuO1xuXHRcdHBhbmVsVmlzaWJsZTogYm9vbGVhbjtcblx0XHRtb2RhbEF2YWlsYWJsZTogYm9vbGVhbjtcblx0XHRtb2RhbEluaXRpYWxpemVkOiBib29sZWFuO1xuXHRcdHRyYW5zaXRpb25zOiBBcnJheTxzdHJpbmc+O1xuXHRcdHRoZW1lczogQXJyYXk8c3RyaW5nPjtcblx0XHRjbGFzc2VzOiBzdHJpbmc7XG5cdFx0b3B0aW9uczogSU9wdGlvbnM7XG5cdFx0aXRlbXM6IEFycmF5PElGaWxlPjtcblx0XHRzZWxlY3RlZDogbnVtYmVyO1xuXHRcdGZpbGU6IElGaWxlO1xuXHRcdGZpbGVzOiBBcnJheTxJRmlsZT47XG5cdFx0c2l6ZXM6IEFycmF5PHN0cmluZz47XG5cdFx0aWQ6IHN0cmluZztcblx0XHRpc1NpbmdsZTogYm9vbGVhbjtcblx0XHRldmVudHM6IHtcblx0XHRcdENPTkZJR19MT0FEOiBzdHJpbmc7XG5cdFx0XHRBVVRPUExBWV9TVEFSVDogc3RyaW5nO1xuXHRcdFx0QVVUT1BMQVlfU1RPUDogc3RyaW5nO1xuXHRcdFx0UEFSU0VfSU1BR0VTOiBzdHJpbmc7XG5cdFx0XHRMT0FEX0lNQUdFOiBzdHJpbmc7XG5cdFx0XHRGSVJTVF9JTUFHRTogc3RyaW5nO1xuXHRcdFx0Q0hBTkdFX0lNQUdFOiBzdHJpbmc7XG5cdFx0XHRET1VCTEVfSU1BR0U6IHN0cmluZztcblx0XHRcdE1PREFMX09QRU46IHN0cmluZztcblx0XHRcdE1PREFMX0NMT1NFOiBzdHJpbmc7XG5cdFx0XHRHQUxMRVJZX1VQREFURUQ6IHN0cmluZztcblx0XHRcdEdBTExFUllfRURJVDogc3RyaW5nO1xuXHRcdFx0TEFTVF9USFVNQk5BSUw6IHN0cmluZztcblx0XHR9O1xuXG5cdFx0Z2V0SW5zdGFuY2UoY29tcG9uZW50OiBhbnkpOiBJU2VydmljZUNvbnRyb2xsZXI7XG5cblx0XHRzZXREZWZhdWx0cygpOiB2b2lkO1xuXG5cdFx0c2V0T3B0aW9ucyhvcHRpb25zOiBJT3B0aW9ucyk6IElPcHRpb25zO1xuXG5cdFx0c2V0SXRlbXMoaXRlbXM6IEFycmF5PElGaWxlPiwgZm9yY2U/OiBib29sZWFuKTogdm9pZDtcblxuXHRcdHByZWxvYWQod2FpdD86IG51bWJlcik6IHZvaWQ7XG5cblx0XHRub3JtYWxpemUoaW5kZXg6IG51bWJlcik6IG51bWJlcjtcblxuXHRcdHNldEZvY3VzKCk6IHZvaWQ7XG5cblx0XHRzZXRTZWxlY3RlZChpbmRleDogbnVtYmVyKTtcblxuXHRcdG1vZGFsT3BlbihpbmRleDogbnVtYmVyKTogdm9pZDtcblxuXHRcdG1vZGFsQ2xvc2UoKTogdm9pZDtcblxuXHRcdG1vZGFsQ2xpY2soJGV2ZW50PzogVUlFdmVudCk6IHZvaWQ7XG5cblx0XHR0aHVtYm5haWxzTW92ZShkZWxheT86IG51bWJlcik6IHZvaWQ7XG5cblx0XHR0b0JhY2t3YXJkKHN0b3A/OiBib29sZWFuKTogdm9pZDtcblxuXHRcdHRvRm9yd2FyZChzdG9wPzogYm9vbGVhbik6IHZvaWQ7XG5cblx0XHR0b0ZpcnN0KHN0b3A/OiBib29sZWFuKTogdm9pZDtcblxuXHRcdHRvTGFzdChzdG9wPzogYm9vbGVhbik6IHZvaWQ7XG5cblx0XHRsb2FkSW1hZ2UoaW5kZXg/OiBudW1iZXIpOiB2b2lkO1xuXG5cdFx0bG9hZEltYWdlcyhpbmRleGVzOiBBcnJheTxudW1iZXI+KTogdm9pZDtcblxuXHRcdGhvdmVyUHJlbG9hZChpbmRleDogbnVtYmVyKTogdm9pZDtcblxuXHRcdGF1dG9QbGF5VG9nZ2xlKCk6IHZvaWQ7XG5cblx0XHR0b2dnbGUoZWxlbWVudDogc3RyaW5nKTogdm9pZDtcblxuXHRcdHNldEhhc2goKTogdm9pZDtcblxuXHRcdGRvd25sb2FkTGluaygpOiBzdHJpbmc7XG5cblx0XHRlbChzZWxlY3Rvcik6IE5vZGVMaXN0O1xuXG5cdFx0bG9nKGV2ZW50OiBzdHJpbmcsIGRhdGE/OiBhbnkpOiB2b2lkO1xuXG5cdFx0ZXZlbnQoZXZlbnQ6IHN0cmluZywgZGF0YT86IGFueSk7XG5cblx0fVxuXG5cdC8vIHNlcnZpY2UgY29udHJvbGxlclxuXHRleHBvcnQgY2xhc3MgU2VydmljZUNvbnRyb2xsZXIge1xuXG5cdFx0cHVibGljIHZlcnNpb24gPSBcIjIuMS45XCI7XG5cdFx0cHVibGljIHNsdWcgPSAnYXNnJztcblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcblx0XHRwdWJsaWMgaXRlbXM6IEFycmF5PElGaWxlPiA9IFtdO1xuXHRcdHB1YmxpYyBmaWxlczogQXJyYXk8SUZpbGU+ID0gW107XG5cdFx0cHVibGljIGRpcmVjdGlvbjogc3RyaW5nO1xuXHRcdHB1YmxpYyBtb2RhbEF2YWlsYWJsZSA9IGZhbHNlO1xuXHRcdHB1YmxpYyBtb2RhbEluaXRpYWxpemVkID0gZmFsc2U7XG5cblx0XHRwcml2YXRlIGluc3RhbmNlczoge30gPSB7fTtcblx0XHRwcml2YXRlIF9zZWxlY3RlZDogbnVtYmVyO1xuXHRcdHByaXZhdGUgX3Zpc2libGUgPSBmYWxzZTtcblx0XHRwcml2YXRlIGF1dG9wbGF5OiBhbmd1bGFyLklQcm9taXNlPGFueT47XG5cdFx0cHJpdmF0ZSBmaXJzdCA9IGZhbHNlO1xuXHRcdHByaXZhdGUgZWRpdGluZyA9IGZhbHNlO1xuXG5cdFx0cHVibGljIG9wdGlvbnM6IElPcHRpb25zID0gbnVsbDtcblx0XHRwdWJsaWMgb3B0aW9uc0xvYWRlZCA9IGZhbHNlO1xuXHRcdHB1YmxpYyBkZWZhdWx0czogSU9wdGlvbnMgPSB7XG5cdFx0XHRkZWJ1ZzogZmFsc2UsIC8vIGltYWdlIGxvYWQsIGF1dG9wbGF5LCBldGMuIGluZm8gaW4gY29uc29sZS5sb2dcblx0XHRcdGhhc2hVcmw6IHRydWUsIC8vIGVuYWJsZS9kaXNhYmxlIGhhc2ggdXNhZ2UgaW4gdXJsICgjYXNnLW5hdHVyZS00KVxuXHRcdFx0YmFzZVVybDogJycsIC8vIHVybCBwcmVmaXhcblx0XHRcdGR1cGxpY2F0ZXM6IGZhbHNlLCAvLyBlbmFibGUgb3IgZGlzYWJsZSBzYW1lIGltYWdlcyAodXJsKSBpbiBnYWxsZXJ5XG5cdFx0XHRzZWxlY3RlZDogMCwgLy8gc2VsZWN0ZWQgaW1hZ2Ugb24gaW5pdFxuXHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdHNvdXJjZToge1xuXHRcdFx0XHRcdG1vZGFsOiAndXJsJywgLy8gcmVxdWlyZWQsIGltYWdlIHVybCBmb3IgbW9kYWwgY29tcG9uZW50IChsYXJnZSBzaXplKVxuXHRcdFx0XHRcdHBhbmVsOiAndXJsJywgLy8gaW1hZ2UgdXJsIGZvciBwYW5lbCBjb21wb25lbnQgKHRodW1ibmFpbCBzaXplKVxuXHRcdFx0XHRcdGltYWdlOiAndXJsJywgLy8gaW1hZ2UgdXJsIGZvciBpbWFnZSAobWVkaXVtIG9yIGN1c3RvbSBzaXplKVxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyOiBudWxsIC8vIGltYWdlIHVybCBmb3IgcHJlbG9hZCBsb3dyZXMgaW1hZ2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0dGl0bGU6ICd0aXRsZScsIC8vIHRpdGxlIGZpZWxkIG5hbWVcblx0XHRcdFx0c3VidGl0bGU6ICdzdWJ0aXRsZScsIC8vIHN1YnRpdGxlIGZpZWxkIG5hbWVcblx0XHRcdFx0ZGVzY3JpcHRpb246ICdkZXNjcmlwdGlvbicsIC8vIGRlc2NyaXB0aW9uIGZpZWxkIG5hbWVcblx0XHRcdFx0dmlkZW86ICd2aWRlbycsIC8vIHZpZGVvIGZpZWxkIG5hbWVcblx0XHRcdH0sXG5cdFx0XHRhdXRvcGxheToge1xuXHRcdFx0XHRlbmFibGVkOiBmYWxzZSwgLy8gc2xpZGVzaG93IHBsYXkgZW5hYmxlZC9kaXNhYmxlZFxuXHRcdFx0XHRkZWxheTogNDEwMCAvLyBhdXRvcGxheSBkZWxheSBpbiBtaWxsaXNlY29uZFxuXHRcdFx0fSxcblx0XHRcdHRoZW1lOiAnZGVmYXVsdCcsIC8vIGNzcyBzdHlsZSBbZGVmYXVsdCwgZGFya2JsdWUsIGRhcmtyZWQsIHdoaXRlZ29sZF1cblx0XHRcdHByZWxvYWROZXh0OiBmYWxzZSwgLy8gcHJlbG9hZCBuZXh0IGltYWdlIChmb3J3YXJkL2JhY2t3YXJkKVxuXHRcdFx0cHJlbG9hZERlbGF5OiA3NzAsIC8vIHByZWxvYWQgZGVsYXkgZm9yIHByZWxvYWROZXh0XG5cdFx0XHRsb2FkaW5nSW1hZ2U6ICdwcmVsb2FkLnN2ZycsIC8vIGxvYWRlciBpbWFnZVxuXHRcdFx0cHJlbG9hZDogW10sIC8vIHByZWxvYWQgaW1hZ2VzIGJ5IGluZGV4IG51bWJlclxuXHRcdFx0bW9kYWw6IHtcblx0XHRcdFx0dGl0bGU6ICcnLCAvLyBtb2RhbCB3aW5kb3cgdGl0bGVcblx0XHRcdFx0c3VidGl0bGU6ICcnLCAvLyBtb2RhbCB3aW5kb3cgc3VidGl0bGVcblx0XHRcdFx0dGl0bGVGcm9tSW1hZ2U6IGZhbHNlLCAvLyBmb3JjZSB1cGRhdGUgdGhlIGdhbGxlcnkgdGl0bGUgYnkgaW1hZ2UgdGl0bGVcblx0XHRcdFx0c3VidGl0bGVGcm9tSW1hZ2U6IGZhbHNlLCAvLyBmb3JjZSB1cGRhdGUgdGhlIGdhbGxlcnkgc3VidGl0bGUgYnkgaW1hZ2UgZGVzY3JpcHRpb25cblx0XHRcdFx0cGxhY2Vob2xkZXI6ICdwYW5lbCcsIC8vIHNldCBpbWFnZSBwbGFjZWhvbGRlciBzb3VyY2UgdHlwZSAodGh1bWJuYWlsKSBvciBmdWxsIHVybCAoaHR0cC4uLilcblx0XHRcdFx0Y2FwdGlvbjoge1xuXHRcdFx0XHRcdGRpc2FibGVkOiBmYWxzZSwgLy8gZGlzYWJsZSBpbWFnZSBjYXB0aW9uXG5cdFx0XHRcdFx0dmlzaWJsZTogdHJ1ZSwgLy8gc2hvdy9oaWRlIGltYWdlIGNhcHRpb25cblx0XHRcdFx0XHRwb3NpdGlvbjogJ3RvcCcsIC8vIGNhcHRpb24gcG9zaXRpb24gW3RvcCwgYm90dG9tXVxuXHRcdFx0XHRcdGRvd25sb2FkOiBmYWxzZSAvLyBzaG93L2hpZGUgZG93bmxvYWQgbGlua1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRoZWFkZXI6IHtcblx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLCAvLyBlbmFibGUvZGlzYWJsZSBtb2RhbCBtZW51XG5cdFx0XHRcdFx0ZHluYW1pYzogZmFsc2UsIC8vIHNob3cvaGlkZSBtb2RhbCBtZW51IG9uIG1vdXNlb3ZlclxuXHRcdFx0XHRcdGJ1dHRvbnM6IFsncGxheXN0b3AnLCAnaW5kZXgnLCAncHJldicsICduZXh0JywgJ3BpbicsICdzaXplJywgJ3RyYW5zaXRpb24nLCAndGh1bWJuYWlscycsICdmdWxsc2NyZWVuJywgJ2hlbHAnLCAnY2xvc2UnXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0aGVscDogZmFsc2UsIC8vIHNob3cvaGlkZSBoZWxwXG5cdFx0XHRcdGFycm93czoge1xuXHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsIC8vIHNob3cvaGlkZSBhcnJvd3Ncblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjbGljazoge1xuXHRcdFx0XHRcdGNsb3NlOiB0cnVlIC8vIHdoZW4gY2xpY2sgb24gdGhlIGltYWdlIGNsb3NlIHRoZSBtb2RhbFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aHVtYm5haWw6IHtcblx0XHRcdFx0XHRoZWlnaHQ6IDUwLCAvLyB0aHVtYm5haWwgaW1hZ2UgaGVpZ2h0IGluIHBpeGVsXG5cdFx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93IGluZGV4IG51bWJlciBvbiB0aHVtYm5haWxcblx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLCAvLyBlbmFibGUvZGlzYWJsZSB0aHVtYm5haWxzXG5cdFx0XHRcdFx0ZHluYW1pYzogZmFsc2UsIC8vIGlmIHRydWUgdGh1bWJuYWlscyB2aXNpYmxlIG9ubHkgd2hlbiBtb3VzZW92ZXJcblx0XHRcdFx0XHRhdXRvaGlkZTogdHJ1ZSwgLy8gaGlkZSB0aHVtYm5haWwgY29tcG9uZW50IHdoZW4gc2luZ2xlIGltYWdlXG5cdFx0XHRcdFx0Y2xpY2s6IHtcblx0XHRcdFx0XHRcdHNlbGVjdDogdHJ1ZSwgLy8gc2V0IHNlbGVjdGVkIGltYWdlIHdoZW4gdHJ1ZVxuXHRcdFx0XHRcdFx0bW9kYWw6IGZhbHNlIC8vIG9wZW4gbW9kYWwgd2hlbiB0cnVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRob3Zlcjoge1xuXHRcdFx0XHRcdFx0cHJlbG9hZDogdHJ1ZSwgLy8gcHJlbG9hZCBpbWFnZSBvbiBtb3VzZW92ZXJcblx0XHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XG5cdFx0XHRcdHRyYW5zaXRpb25TcGVlZDogMC43LCAvLyB0cmFuc2l0aW9uIHNwZWVkIDAuN3Ncblx0XHRcdFx0c2l6ZTogJ2NvdmVyJywgLy8gY29udGFpbiwgY292ZXIsIGF1dG8sIHN0cmV0Y2hcblx0XHRcdFx0a2V5Y29kZXM6IHtcblx0XHRcdFx0XHRleGl0OiBbMjddLCAvLyBlc2Ncblx0XHRcdFx0XHRwbGF5cGF1c2U6IFs4MF0sIC8vIHBcblx0XHRcdFx0XHRmb3J3YXJkOiBbMzIsIDM5XSwgLy8gc3BhY2UsIHJpZ2h0IGFycm93XG5cdFx0XHRcdFx0YmFja3dhcmQ6IFszN10sIC8vIGxlZnQgYXJyb3dcblx0XHRcdFx0XHRmaXJzdDogWzM4LCAzNl0sIC8vIHVwIGFycm93LCBob21lXG5cdFx0XHRcdFx0bGFzdDogWzQwLCAzNV0sIC8vIGRvd24gYXJyb3csIGVuZFxuXHRcdFx0XHRcdGZ1bGxzY3JlZW46IFsxM10sIC8vIGVudGVyXG5cdFx0XHRcdFx0bWVudTogWzc3XSwgLy8gbVxuXHRcdFx0XHRcdGNhcHRpb246IFs2N10sIC8vIGNcblx0XHRcdFx0XHRoZWxwOiBbNzJdLCAvLyBoXG5cdFx0XHRcdFx0c2l6ZTogWzgzXSwgLy8gc1xuXHRcdFx0XHRcdHRyYW5zaXRpb246IFs4NF0gLy8gdFxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0dGh1bWJuYWlsOiB7XG5cdFx0XHRcdGhlaWdodDogNTAsIC8vIHRodW1ibmFpbCBpbWFnZSBoZWlnaHQgaW4gcGl4ZWxcblx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93IGluZGV4IG51bWJlciBvbiB0aHVtYm5haWxcblx0XHRcdFx0ZHluYW1pYzogZmFsc2UsIC8vIGlmIHRydWUgdGh1bWJuYWlscyB2aXNpYmxlIG9ubHkgd2hlbiBtb3VzZW92ZXJcblx0XHRcdFx0YXV0b2hpZGU6IGZhbHNlLCAvLyBoaWRlIHRodW1ibmFpbCBjb21wb25lbnQgd2hlbiBzaW5nbGUgaW1hZ2Vcblx0XHRcdFx0Y2xpY2s6IHtcblx0XHRcdFx0XHRzZWxlY3Q6IHRydWUsIC8vIHNldCBzZWxlY3RlZCBpbWFnZSB3aGVuIHRydWVcblx0XHRcdFx0XHRtb2RhbDogZmFsc2UgLy8gb3BlbiBtb2RhbCB3aGVuIHRydWVcblx0XHRcdFx0fSxcblx0XHRcdFx0aG92ZXI6IHtcblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxuXHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0XHRwYW5lbDoge1xuXHRcdFx0XHR2aXNpYmxlOiB0cnVlLFxuXHRcdFx0XHRpdGVtczoge1xuXHRcdFx0XHRcdGNsYXNzOiAncm93JywgLy8gaXRlbXMgY2xhc3Ncblx0XHRcdFx0fSxcblx0XHRcdFx0aXRlbToge1xuXHRcdFx0XHRcdGNsYXNzOiAnY29sLW1kLTMnLCAvLyBpdGVtIGNsYXNzXG5cdFx0XHRcdFx0Y2FwdGlvbjogZmFsc2UsIC8vIHNob3cvaGlkZSBpbWFnZSBjYXB0aW9uXG5cdFx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93L2hpZGUgaW1hZ2UgaW5kZXhcblx0XHRcdFx0fSxcblx0XHRcdFx0aG92ZXI6IHtcblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxuXHRcdFx0XHRcdHNlbGVjdDogZmFsc2UgLy8gc2V0IHNlbGVjdGVkIGltYWdlIG9uIG1vdXNlb3ZlciB3aGVuIHRydWVcblx0XHRcdFx0fSxcblx0XHRcdFx0Y2xpY2s6IHtcblx0XHRcdFx0XHRzZWxlY3Q6IGZhbHNlLCAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugd2hlbiB0cnVlXG5cdFx0XHRcdFx0bW9kYWw6IHRydWUgLy8gb3BlbiBtb2RhbCB3aGVuIHRydWVcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0XHRpbWFnZToge1xuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XG5cdFx0XHRcdHRyYW5zaXRpb25TcGVlZDogMC43LCAvLyB0cmFuc2l0aW9uIHNwZWVkIDAuN3Ncblx0XHRcdFx0c2l6ZTogJ2NvdmVyJywgLy8gY29udGFpbiwgY292ZXIsIGF1dG8sIHN0cmV0Y2hcblx0XHRcdFx0YXJyb3dzOiB7XG5cdFx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSwgIC8vIHNob3cvaGlkZSBhcnJvd3Ncblx0XHRcdFx0XHRwcmVsb2FkOiB0cnVlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjbGljazoge1xuXHRcdFx0XHRcdG1vZGFsOiB0cnVlIC8vIHdoZW4gY2xpY2sgb24gdGhlIGltYWdlIG9wZW4gdGhlIG1vZGFsIHdpbmRvd1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRoZWlnaHQ6IG51bGwsIC8vIGhlaWdodCBpbiBwaXhlbFxuXHRcdFx0XHRoZWlnaHRNaW46IG51bGwsIC8vIG1pbiBoZWlnaHQgaW4gcGl4ZWxcblx0XHRcdFx0aGVpZ2h0QXV0bzoge1xuXHRcdFx0XHRcdGluaXRpYWw6IHRydWUsIC8vIGNhbGN1bGF0ZSBkaXYgaGVpZ2h0IGJ5IGZpcnN0IGltYWdlXG5cdFx0XHRcdFx0b25yZXNpemU6IGZhbHNlIC8vIGNhbGN1bGF0ZSBkaXYgaGVpZ2h0IG9uIHdpbmRvdyByZXNpemVcblx0XHRcdFx0fSxcblx0XHRcdFx0cGxhY2Vob2xkZXI6ICdwYW5lbCcgLy8gc2V0IGltYWdlIHBsYWNlaG9sZGVyIHNvdXJjZSB0eXBlICh0aHVtYm5haWwpIG9yIGZ1bGwgdXJsIChodHRwLi4uKVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvLyBhdmFpbGFibGUgaW1hZ2Ugc2l6ZXNcblx0XHRwdWJsaWMgc2l6ZXM6IEFycmF5PHN0cmluZz4gPSBbXG5cdFx0XHQnY29udGFpbicsXG5cdFx0XHQnY292ZXInLFxuXHRcdFx0J2F1dG8nLFxuXHRcdFx0J3N0cmV0Y2gnXG5cdFx0XTtcblxuXHRcdC8vIGF2YWlsYWJsZSB0aGVtZXNcblx0XHRwdWJsaWMgdGhlbWVzOiBBcnJheTxzdHJpbmc+ID0gW1xuXHRcdFx0J2RlZmF1bHQnLFxuXHRcdFx0J2RhcmtibHVlJyxcblx0XHRcdCd3aGl0ZWdvbGQnXG5cdFx0XTtcblxuXHRcdC8vIGF2YWlsYWJsZSB0cmFuc2l0aW9uc1xuXHRcdHB1YmxpYyB0cmFuc2l0aW9uczogQXJyYXk8c3RyaW5nPiA9IFtcblx0XHRcdCdubycsXG5cdFx0XHQnZmFkZUluT3V0Jyxcblx0XHRcdCd6b29tSW4nLFxuXHRcdFx0J3pvb21PdXQnLFxuXHRcdFx0J3pvb21Jbk91dCcsXG5cdFx0XHQncm90YXRlTFInLFxuXHRcdFx0J3JvdGF0ZVRCJyxcblx0XHRcdCdyb3RhdGVaWScsXG5cdFx0XHQnc2xpZGVMUicsXG5cdFx0XHQnc2xpZGVUQicsXG5cdFx0XHQnemxpZGVMUicsXG5cdFx0XHQnemxpZGVUQicsXG5cdFx0XHQnZmxpcFgnLFxuXHRcdFx0J2ZsaXBZJ1xuXHRcdF07XG5cblx0XHRwdWJsaWMgZXZlbnRzID0ge1xuXHRcdFx0Q09ORklHX0xPQUQ6ICdBU0ctY29uZmlnLWxvYWQtJyxcblx0XHRcdEFVVE9QTEFZX1NUQVJUOiAnQVNHLWF1dG9wbGF5LXN0YXJ0LScsXG5cdFx0XHRBVVRPUExBWV9TVE9QOiAnQVNHLWF1dG9wbGF5LXN0b3AtJyxcblx0XHRcdFBBUlNFX0lNQUdFUzogJ0FTRy1wYXJzZS1pbWFnZXMtJyxcblx0XHRcdExPQURfSU1BR0U6ICdBU0ctbG9hZC1pbWFnZS0nLFxuXHRcdFx0RklSU1RfSU1BR0U6ICdBU0ctZmlyc3QtaW1hZ2UtJyxcblx0XHRcdENIQU5HRV9JTUFHRTogJ0FTRy1jaGFuZ2UtaW1hZ2UtJyxcblx0XHRcdERPVUJMRV9JTUFHRTogJ0FTRy1kb3VibGUtaW1hZ2UtJyxcblx0XHRcdE1PREFMX09QRU46ICdBU0ctbW9kYWwtb3Blbi0nLFxuXHRcdFx0TU9EQUxfQ0xPU0U6ICdBU0ctbW9kYWwtY2xvc2UtJyxcblx0XHRcdFRIVU1CTkFJTF9NT1ZFOiAnQVNHLXRodW1ibmFpbC1tb3ZlLScsXG5cdFx0XHRHQUxMRVJZX1VQREFURUQ6ICdBU0ctZ2FsbGVyeS11cGRhdGVkLScsXG5cdFx0XHRMQVNUX1RIVU1CTkFJTDogJ0FTRy1sYXN0LXRodW1ibmFpbC0nLFxuXHRcdFx0R0FMTEVSWV9FRElUOiAnQVNHLWdhbGxlcnktZWRpdCcsXG5cdFx0fTtcblxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSBpbnRlcnZhbDogbmcuSUludGVydmFsU2VydmljZSxcblx0XHRcdHByaXZhdGUgbG9jYXRpb246IG5nLklMb2NhdGlvblNlcnZpY2UsXG5cdFx0XHRwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSAkd2luZG93OiBuZy5JV2luZG93U2VydmljZSxcblx0XHRcdHByaXZhdGUgJHNjZTogbmcuSVNDRVNlcnZpY2UpIHtcblxuXHRcdFx0YW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoJ3Jlc2l6ZScsIChldmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKDIwMCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gdXBkYXRlIGltYWdlcyB3aGVuIGVkaXQgZXZlbnRcblx0XHRcdCRyb290U2NvcGUuJG9uKHRoaXMuZXZlbnRzLkdBTExFUllfRURJVCwgKGV2ZW50LCBkYXRhKSA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLmluc3RhbmNlc1tkYXRhLmlkXSkge1xuXHRcdFx0XHRcdHRoaXMuaW5zdGFuY2VzW2RhdGEuaWRdLmVkaXRHYWxsZXJ5KGRhdGEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdH1cblxuXHRcdHByaXZhdGUgcGFyc2VIYXNoKCkge1xuXG5cdFx0XHRpZiAoIXRoaXMuaWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXRoaXMub3B0aW9ucy5oYXNoVXJsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGhhc2ggPSB0aGlzLmxvY2F0aW9uLmhhc2goKTtcblx0XHRcdGxldCBwYXJ0cyA9IGhhc2ggPyBoYXNoLnNwbGl0KCctJykgOiBudWxsO1xuXG5cdFx0XHRpZiAocGFydHMgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAocGFydHNbMF0gIT09IHRoaXMuc2x1Zykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChwYXJ0cy5sZW5ndGggIT09IDMpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAocGFydHNbMV0gIT09IHRoaXMuaWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgaW5kZXggPSBwYXJzZUludChwYXJ0c1syXSwgMTApO1xuXG5cdFx0XHRpZiAoIWFuZ3VsYXIuaXNOdW1iZXIoaW5kZXgpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcblxuXHRcdFx0XHRpbmRleC0tO1xuXHRcdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXg7XG5cdFx0XHRcdHRoaXMubW9kYWxPcGVuKGluZGV4KTtcblxuXHRcdFx0fSwgMjApO1xuXG5cdFx0fVxuXG5cdFx0Ly8gY2FsY3VsYXRlIG9iamVjdCBoYXNoIGlkXG5cdFx0cHVibGljIG9iamVjdEhhc2hJZChvYmplY3Q6IGFueSk6IHN0cmluZyB7XG5cblx0XHRcdGxldCBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeShvYmplY3QpO1xuXG5cdFx0XHRpZiAoIXN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGFiYyA9IHN0cmluZy5yZXBsYWNlKC9bXmEtekEtWjAtOV0rL2csICcnKTtcblx0XHRcdGxldCBjb2RlID0gMDtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDAsIG4gPSBhYmMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdGxldCBjaGFyY29kZSA9IGFiYy5jaGFyQ29kZUF0KGkpO1xuXHRcdFx0XHRjb2RlICs9IChjaGFyY29kZSAqIGkpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gJ2lkJyArIGNvZGUudG9TdHJpbmcoMjEpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2UgZm9yIGN1cnJlbnQgZ2FsbGVyeSBieSBjb21wb25lbnQgaWRcblx0XHRwdWJsaWMgZ2V0SW5zdGFuY2UoY29tcG9uZW50OiBhbnkpIHtcblxuXHRcdFx0aWYgKCFjb21wb25lbnQuaWQpIHtcblxuXHRcdFx0XHQvLyBnZXQgcGFyZW50IGFzZyBjb21wb25lbnQgaWRcblx0XHRcdFx0aWYgKGNvbXBvbmVudC4kc2NvcGUgJiYgY29tcG9uZW50LiRzY29wZS4kcGFyZW50ICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudC4kcGFyZW50ICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudC4kcGFyZW50LiRjdHJsKSB7XG5cdFx0XHRcdFx0Y29tcG9uZW50LmlkID0gY29tcG9uZW50LiRzY29wZS4kcGFyZW50LiRwYXJlbnQuJGN0cmwuaWQ7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29tcG9uZW50LmlkID0gdGhpcy5vYmplY3RIYXNoSWQoY29tcG9uZW50Lm9wdGlvbnMpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaWQgPSBjb21wb25lbnQuaWQ7XG5cdFx0XHRsZXQgaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1tpZF07XG5cblx0XHRcdC8vIG5ldyBpbnN0YW5jZSBhbmQgc2V0IG9wdGlvbnMgYW5kIGl0ZW1zXG5cdFx0XHRpZiAoaW5zdGFuY2UgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRpbnN0YW5jZSA9IG5ldyBTZXJ2aWNlQ29udHJvbGxlcih0aGlzLnRpbWVvdXQsIHRoaXMuaW50ZXJ2YWwsIHRoaXMubG9jYXRpb24sIHRoaXMuJHJvb3RTY29wZSwgdGhpcy4kd2luZG93LCB0aGlzLiRzY2UpO1xuXHRcdFx0XHRpbnN0YW5jZS5pZCA9IGlkO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY29tcG9uZW50LmJhc2VVcmwpIHtcblx0XHRcdFx0Y29tcG9uZW50Lm9wdGlvbnMuYmFzZVVybCA9IGNvbXBvbmVudC5iYXNlVXJsO1xuXHRcdFx0fVxuXG5cdFx0XHRpbnN0YW5jZS5zZXRPcHRpb25zKGNvbXBvbmVudC5vcHRpb25zKTtcblx0XHRcdGluc3RhbmNlLnNldEl0ZW1zKGNvbXBvbmVudC5pdGVtcyk7XG5cdFx0XHRpbnN0YW5jZS5zZWxlY3RlZCA9IGNvbXBvbmVudC5zZWxlY3RlZCA/IGNvbXBvbmVudC5zZWxlY3RlZCA6IGluc3RhbmNlLm9wdGlvbnMuc2VsZWN0ZWQ7XG5cdFx0XHRpbnN0YW5jZS5wYXJzZUhhc2goKTtcblxuXHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMpIHtcblxuXHRcdFx0XHRpbnN0YW5jZS5sb2FkSW1hZ2VzKGluc3RhbmNlLm9wdGlvbnMucHJlbG9hZCk7XG5cblx0XHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMuYXV0b3BsYXkgJiYgaW5zdGFuY2Uub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkICYmICFpbnN0YW5jZS5hdXRvcGxheSkge1xuXHRcdFx0XHRcdGluc3RhbmNlLmF1dG9QbGF5U3RhcnQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuaW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xuXHRcdFx0cmV0dXJuIGluc3RhbmNlO1xuXG5cdFx0fVxuXG5cdFx0Ly8gcHJlcGFyZSBpbWFnZXMgYXJyYXlcblx0XHRwdWJsaWMgc2V0SXRlbXMoaXRlbXM6IEFycmF5PElGaWxlPikge1xuXG5cdFx0XHR0aGlzLml0ZW1zID0gaXRlbXMgPyBpdGVtcyA6IFtdO1xuXHRcdFx0dGhpcy5wcmVwYXJlSXRlbXMoKTtcblxuXHRcdH1cblxuXHRcdC8vIG9wdGlvbnMgc2V0dXBcblx0XHRwdWJsaWMgc2V0T3B0aW9ucyhvcHRpb25zOiBJT3B0aW9ucykge1xuXG5cdFx0XHQvLyBpZiBvcHRpb25zIGFscmVhZHkgc2V0dXBcblx0XHRcdGlmICh0aGlzLm9wdGlvbnNMb2FkZWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3B0aW9ucykge1xuXG5cdFx0XHRcdHRoaXMub3B0aW9ucyA9IGFuZ3VsYXIuY29weSh0aGlzLmRlZmF1bHRzKTtcblx0XHRcdFx0YW5ndWxhci5tZXJnZSh0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG5cdFx0XHRcdGlmIChvcHRpb25zLm1vZGFsICYmIG9wdGlvbnMubW9kYWwuaGVhZGVyICYmIG9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnMpIHtcblxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucyA9IG9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnM7XG5cblx0XHRcdFx0XHQvLyByZW1vdmUgZHVwbGljYXRlcyBmcm9tIGJ1dHRvbnNcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnMgPSB0aGlzLm9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnMuZmlsdGVyKGZ1bmN0aW9uICh4LCBpLCBhKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYS5pbmRleE9mKHgpID09PSBpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLm9wdGlvbnNMb2FkZWQgPSB0cnVlO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLm9wdGlvbnMgPSBhbmd1bGFyLmNvcHkodGhpcy5kZWZhdWx0cyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGlmICF0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbFxuXHRcdFx0aWYgKCF0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbCkge1xuXHRcdFx0XHR0aGlzLm9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnMgPSB0aGlzLm9wdGlvbnMubW9kYWwuaGVhZGVyLmJ1dHRvbnMuZmlsdGVyKGZ1bmN0aW9uICh4LCBpLCBhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHggIT09ICdmdWxsc2NyZWVuJztcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblxuXHRcdFx0Ly8gaW1wb3J0YW50IVxuXHRcdFx0b3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5DT05GSUdfTE9BRCwgdGhpcy5vcHRpb25zKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucztcblxuXHRcdH1cblxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodjogbnVtYmVyKSB7XG5cblx0XHRcdHYgPSB0aGlzLm5vcm1hbGl6ZSh2KTtcblx0XHRcdGxldCBwcmV2ID0gdGhpcy5fc2VsZWN0ZWQ7XG5cblx0XHRcdGlmIChwcmV2ICE9IHYgJiYgdGhpcy5maWxlICYmIHRoaXMuZmlsZS52aWRlbyAmJiB0aGlzLmZpbGUudmlkZW8ucGxheWluZykge1xuXHRcdFx0XHR0aGlzLmZpbGUudmlkZW8ucGxheWVyLnBhdXNlKCk7XG5cdFx0XHRcdHRoaXMuZmlsZS52aWRlby5wYXVzZWQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9zZWxlY3RlZCA9IHY7XG5cdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLl9zZWxlY3RlZCk7XG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcblxuXHRcdFx0aWYgKHRoaXMuZmlsZSkge1xuXG5cdFx0XHRcdGlmICh0aGlzLm9wdGlvbnMubW9kYWwudGl0bGVGcm9tSW1hZ2UgJiYgdGhpcy5maWxlLnRpdGxlKSB7XG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLm1vZGFsLnRpdGxlID0gdGhpcy5maWxlLnRpdGxlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMub3B0aW9ucy5tb2RhbC5zdWJ0aXRsZUZyb21JbWFnZSAmJiB0aGlzLmZpbGUuZGVzY3JpcHRpb24pIHtcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMubW9kYWwuc3VidGl0bGUgPSB0aGlzLmZpbGUuZGVzY3JpcHRpb247XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpcy5maWxlLnZpZGVvICYmIHRoaXMuZmlsZS52aWRlby5wYXVzZWQpIHtcblx0XHRcdFx0XHR0aGlzLmZpbGUudmlkZW8ucGxheWVyLnBsYXkoKTtcblx0XHRcdFx0XHR0aGlzLmZpbGUudmlkZW8ucGF1c2VkID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAocHJldiAhPT0gdGhpcy5fc2VsZWN0ZWQpIHtcblxuXHRcdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKCk7XG5cdFx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQ0hBTkdFX0lNQUdFLCB7XG5cdFx0XHRcdFx0aW5kZXg6IHYsXG5cdFx0XHRcdFx0ZmlsZTogdGhpcy5maWxlXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9XG5cblx0XHRcdHRoaXMub3B0aW9ucy5zZWxlY3RlZCA9IHRoaXMuX3NlbGVjdGVkO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZm9yY2Ugc2VsZWN0IGltYWdlXG5cdFx0cHVibGljIGZvcmNlU2VsZWN0KGluZGV4KSB7XG5cblx0XHRcdGluZGV4ID0gdGhpcy5ub3JtYWxpemUoaW5kZXgpO1xuXHRcdFx0dGhpcy5fc2VsZWN0ZWQgPSBpbmRleDtcblx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuX3NlbGVjdGVkKTtcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5DSEFOR0VfSU1BR0UsIHtcblx0XHRcdFx0aW5kZXg6IGluZGV4LFxuXHRcdFx0XHRmaWxlOiB0aGlzLmZpbGVcblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXg6IG51bWJlcikge1xuXG5cdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSBpbmRleCA+IHRoaXMuc2VsZWN0ZWQgPyAnZm9yd2FyZCcgOiAnYmFja3dhcmQnO1xuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IGluZGV4O1xuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XG5cblx0XHR9XG5cblxuXHRcdC8vIGdvIHRvIGJhY2t3YXJkXG5cdFx0cHVibGljIHRvQmFja3dhcmQoc3RvcD86IGJvb2xlYW4pIHtcblxuXHRcdFx0aWYgKHN0b3ApIHtcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnYmFja3dhcmQnO1xuXHRcdFx0dGhpcy5zZWxlY3RlZC0tO1xuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XG5cblx0XHR9XG5cblx0XHQvLyBnbyB0byBmb3J3YXJkXG5cdFx0cHVibGljIHRvRm9yd2FyZChzdG9wPzogYm9vbGVhbikge1xuXG5cdFx0XHRpZiAoc3RvcCkge1xuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdmb3J3YXJkJztcblx0XHRcdHRoaXMuc2VsZWN0ZWQrKztcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdG8gZmlyc3Rcblx0XHRwdWJsaWMgdG9GaXJzdChzdG9wPzogYm9vbGVhbikge1xuXG5cdFx0XHRpZiAoc3RvcCkge1xuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gMDtcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdG8gbGFzdFxuXHRcdHB1YmxpYyB0b0xhc3Qoc3RvcD86IGJvb2xlYW4pIHtcblxuXHRcdFx0aWYgKHN0b3ApIHtcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5pdGVtcy5sZW5ndGggLSAxO1xuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgc2V0SGFzaCgpIHtcblxuXHRcdFx0aWYgKHRoaXMubW9kYWxWaXNpYmxlICYmIHRoaXMub3B0aW9ucy5oYXNoVXJsKSB7XG5cdFx0XHRcdHRoaXMubG9jYXRpb24uaGFzaChbdGhpcy5zbHVnLCB0aGlzLmlkLCB0aGlzLnNlbGVjdGVkICsgMV0uam9pbignLScpKTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHB1YmxpYyBhdXRvUGxheVRvZ2dsZSgpIHtcblxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkKSB7XG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RhcnQoKTtcblx0XHRcdH1cblxuXHRcdH1cblxuXG5cdFx0cHVibGljIGF1dG9QbGF5U3RvcCgpIHtcblxuXHRcdFx0aWYgKCF0aGlzLmF1dG9wbGF5KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5pbnRlcnZhbC5jYW5jZWwodGhpcy5hdXRvcGxheSk7XG5cdFx0XHR0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0dGhpcy5hdXRvcGxheSA9IG51bGw7XG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkFVVE9QTEFZX1NUT1AsIHsgaW5kZXg6IHRoaXMuc2VsZWN0ZWQsIGZpbGU6IHRoaXMuZmlsZSB9KTtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyBhdXRvUGxheVN0YXJ0KCkge1xuXG5cdFx0XHRpZiAodGhpcy5hdXRvcGxheSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkID0gdHJ1ZTtcblx0XHRcdHRoaXMuYXV0b3BsYXkgPSB0aGlzLmludGVydmFsKCgpID0+IHtcblx0XHRcdFx0dGhpcy50b0ZvcndhcmQoKTtcblx0XHRcdH0sIHRoaXMub3B0aW9ucy5hdXRvcGxheS5kZWxheSk7XG5cblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQVVUT1BMQVlfU1RBUlQsIHsgaW5kZXg6IHRoaXMuc2VsZWN0ZWQsIGZpbGU6IHRoaXMuZmlsZSB9KTtcblxuXHRcdH1cblxuXG5cdFx0cHJpdmF0ZSBwcmVwYXJlSXRlbXMoKSB7XG5cblx0XHRcdGxldCBsZW5ndGggPSB0aGlzLml0ZW1zLmxlbmd0aDtcblx0XHRcdGZvciAobGV0IGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcblx0XHRcdFx0dGhpcy5hZGRJbWFnZSh0aGlzLml0ZW1zW2tleV0pO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLlBBUlNFX0lNQUdFUywgdGhpcy5maWxlcyk7XG5cblx0XHR9XG5cblx0XHQvLyBwcmVsb2FkIHRoZSBpbWFnZSB3aGVuIG1vdXNlb3ZlclxuXHRcdHB1YmxpYyBob3ZlclByZWxvYWQoaW5kZXg6IG51bWJlcikge1xuXG5cdFx0XHR0aGlzLmxvYWRJbWFnZShpbmRleCk7XG5cblx0XHR9XG5cblx0XHQvLyBpbWFnZSBwcmVsb2FkXG5cdFx0cHJpdmF0ZSBwcmVsb2FkKHdhaXQ/OiBudW1iZXIpIHtcblxuXHRcdFx0bGV0IGluZGV4ID0gdGhpcy5kaXJlY3Rpb24gPT09ICdmb3J3YXJkJyA/IHRoaXMuc2VsZWN0ZWQgKyAxIDogdGhpcy5zZWxlY3RlZCAtIDE7XG5cblx0XHRcdGlmICh0aGlzLm9wdGlvbnMucHJlbG9hZE5leHQgPT09IHRydWUpIHtcblx0XHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHR0aGlzLmxvYWRJbWFnZShpbmRleCk7XG5cdFx0XHRcdH0sICh3YWl0ICE9PSB1bmRlZmluZWQpID8gd2FpdCA6IHRoaXMub3B0aW9ucy5wcmVsb2FkRGVsYXkpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cHVibGljIG5vcm1hbGl6ZShpbmRleDogbnVtYmVyKSB7XG5cblx0XHRcdGxldCBsYXN0ID0gdGhpcy5maWxlcy5sZW5ndGggLSAxO1xuXG5cdFx0XHRpZiAoaW5kZXggPiBsYXN0KSB7XG5cdFx0XHRcdHJldHVybiAoaW5kZXggLSBsYXN0KSAtIDE7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpbmRleCA8IDApIHtcblx0XHRcdFx0cmV0dXJuIGxhc3QgLSBNYXRoLmFicyhpbmRleCkgKyAxO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gaW5kZXg7XG5cblx0XHR9XG5cblxuXHRcdHB1YmxpYyBsb2FkSW1hZ2VzKGluZGV4ZXM6IEFycmF5PG51bWJlcj4sIHR5cGU6IHN0cmluZykge1xuXG5cdFx0XHRpZiAoIWluZGV4ZXMgfHwgaW5kZXhlcy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0XHRcdGluZGV4ZXMuZm9yRWFjaCgoaW5kZXg6IG51bWJlcikgPT4ge1xuXHRcdFx0XHRzZWxmLmxvYWRJbWFnZShpbmRleCk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblxuXG5cdFx0cHVibGljIGxvYWRJbWFnZShpbmRleD86IG51bWJlciwgY2FsbGJhY2s/OiB7fSkge1xuXG5cdFx0XHRpbmRleCA9IGluZGV4ID8gaW5kZXggOiB0aGlzLnNlbGVjdGVkO1xuXHRcdFx0aW5kZXggPSB0aGlzLm5vcm1hbGl6ZShpbmRleCk7XG5cblx0XHRcdGlmICghdGhpcy5maWxlc1tpbmRleF0pIHtcblx0XHRcdFx0dGhpcy5sb2coJ2ludmFsaWQgZmlsZSBpbmRleCcsIHsgaW5kZXg6IGluZGV4IH0pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLm1vZGFsVmlzaWJsZSkge1xuXG5cdFx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWQubW9kYWwgPT09IHRydWUpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgbW9kYWwgPSBuZXcgSW1hZ2UoKTtcblx0XHRcdFx0bW9kYWwuc3JjID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlLm1vZGFsO1xuXHRcdFx0XHRtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5hZnRlckxvYWQoaW5kZXgsICdtb2RhbCcsIG1vZGFsKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZC5pbWFnZSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXHRcdFx0XHRpbWFnZS5zcmMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2UuaW1hZ2U7XG5cdFx0XHRcdGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5hZnRlckxvYWQoaW5kZXgsICdpbWFnZScsIGltYWdlKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIGdldCBmaWxlIG5hbWVcblx0XHRwcml2YXRlIGdldEZpbGVuYW1lKGluZGV4OiBudW1iZXIsIHR5cGU/OiBzdHJpbmcpIHtcblxuXHRcdFx0dHlwZSA9IHR5cGUgPyB0eXBlIDogJ21vZGFsJztcblx0XHRcdGxldCBmaWxlcGFydHMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2VbdHlwZV0uc3BsaXQoJy8nKTtcblx0XHRcdGxldCBmaWxlbmFtZSA9IGZpbGVwYXJ0c1tmaWxlcGFydHMubGVuZ3RoIC0gMV07XG5cdFx0XHRyZXR1cm4gZmlsZW5hbWU7XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgZmlsZSBleHRlbnNpb25cblx0XHRwcml2YXRlIGdldEV4dGVuc2lvbihpbmRleDogbnVtYmVyLCB0eXBlPzogc3RyaW5nKSB7XG5cblx0XHRcdHR5cGUgPSB0eXBlID8gdHlwZSA6ICdtb2RhbCc7XG5cdFx0XHRsZXQgZmlsZXBhcnRzID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlW3R5cGVdLnNwbGl0KCcuJyk7XG5cdFx0XHRsZXQgZXh0ZW5zaW9uID0gZmlsZXBhcnRzW2ZpbGVwYXJ0cy5sZW5ndGggLSAxXTtcblx0XHRcdHJldHVybiBleHRlbnNpb247XG5cblx0XHR9XG5cblx0XHQvLyBhZnRlciBsb2FkIGltYWdlXG5cdFx0cHJpdmF0ZSBhZnRlckxvYWQoaW5kZXgsIHR5cGUsIGltYWdlKSB7XG5cblx0XHRcdGlmICghdGhpcy5maWxlc1tpbmRleF0gfHwgIXRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWRbdHlwZV0gPT09IHRydWUpIHtcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubG9hZGVkW3R5cGVdID0gdHJ1ZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZSA9PT0gJ21vZGFsJykge1xuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS53aWR0aCA9IGltYWdlLndpZHRoO1xuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLm5hbWUgPSB0aGlzLmdldEZpbGVuYW1lKGluZGV4LCB0eXBlKTtcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0uZXh0ZW5zaW9uID0gdGhpcy5nZXRFeHRlbnNpb24oaW5kZXgsIHR5cGUpO1xuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5kb3dubG9hZCA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5tb2RhbDtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubG9hZGVkW3R5cGVdID0gdHJ1ZTtcblxuXHRcdFx0bGV0IGRhdGEgPSB7IHR5cGU6IHR5cGUsIGluZGV4OiBpbmRleCwgZmlsZTogdGhpcy5maWxlLCBpbWc6IGltYWdlIH07XG5cblx0XHRcdGlmICghdGhpcy5maXJzdCkge1xuXHRcdFx0XHR0aGlzLmZpcnN0ID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5GSVJTVF9JTUFHRSwgZGF0YSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuTE9BRF9JTUFHRSwgZGF0YSk7XG5cblx0XHR9XG5cblxuXHRcdC8vIGlzIHNpbmdsZT9cblx0XHRwdWJsaWMgZ2V0IGlzU2luZ2xlKCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlcy5sZW5ndGggPiAxID8gZmFsc2UgOiB0cnVlO1xuXG5cdFx0fVxuXG5cblx0XHQvLyBnZXQgdGhlIGRvd25sb2FkIGxpbmtcblx0XHRwdWJsaWMgZG93bmxvYWRMaW5rKCkge1xuXG5cdFx0XHRpZiAodGhpcy5zZWxlY3RlZCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZmlsZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5maWxlc1t0aGlzLnNlbGVjdGVkXS5zb3VyY2UubW9kYWw7XG5cdFx0XHR9XG5cblx0XHR9XG5cblxuXHRcdC8vIGdldCB0aGUgZmlsZVxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpOiBJRmlsZSB7XG5cblx0XHRcdHJldHVybiB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdO1xuXG5cdFx0fVxuXG5cdFx0Ly8gdG9nZ2xlIGVsZW1lbnQgdmlzaWJsZVxuXHRcdHB1YmxpYyB0b2dnbGUoZWxlbWVudDogc3RyaW5nKTogdm9pZCB7XG5cblx0XHRcdHRoaXMub3B0aW9uc1tlbGVtZW50XS52aXNpYmxlID0gIXRoaXMub3B0aW9uc1tlbGVtZW50XS52aXNpYmxlO1xuXG5cdFx0fVxuXG5cblx0XHQvLyBnZXQgdmlzaWJsZVxuXHRcdHB1YmxpYyBnZXQgbW9kYWxWaXNpYmxlKCk6IGJvb2xlYW4ge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fdmlzaWJsZTtcblxuXHRcdH1cblxuXG5cdFx0Ly8gZ2V0IHRoZW1lXG5cdFx0cHVibGljIGdldCB0aGVtZSgpOiBzdHJpbmcge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLnRoZW1lO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IGNsYXNzZXNcblx0XHRwdWJsaWMgZ2V0IGNsYXNzZXMoKTogc3RyaW5nIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucy50aGVtZSArICcgJyArIHRoaXMuaWQgKyAodGhpcy5lZGl0aW5nID8gJyBlZGl0aW5nJyA6ICcnKTtcblxuXHRcdH1cblxuXHRcdC8vIGdldCBwcmVsb2FkIHN0eWxlXG5cdFx0cHVibGljIGR5bmFtaWNTdHlsZShmaWxlOiBJRmlsZSwgdHlwZTogc3RyaW5nLCBjb25maWc6IElPcHRpb25zTW9kYWwgfCBJT3B0aW9uc0ltYWdlKSB7XG5cblx0XHRcdGxldCBzdHlsZSA9IHt9O1xuXG5cdFx0XHRpZiAoZmlsZS5zb3VyY2UuY29sb3IpIHtcblx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtY29sb3InXSA9IGZpbGUuc291cmNlLmNvbG9yO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmxvYWRpbmdJbWFnZSAmJiBmaWxlLmxvYWRlZFt0eXBlXSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtaW1hZ2UnXSA9ICd1cmwoJyArIHRoaXMub3B0aW9ucy5sb2FkaW5nSW1hZ2UgKyAnKSc7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb25maWcudHJhbnNpdGlvblNwZWVkICE9PSB1bmRlZmluZWQgJiYgY29uZmlnLnRyYW5zaXRpb25TcGVlZCAhPT0gbnVsbCkge1xuXHRcdFx0XHRzdHlsZVsndHJhbnNpdGlvbiddID0gJ2FsbCBlYXNlICcgKyBjb25maWcudHJhbnNpdGlvblNwZWVkICsgJ3MnO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgcGxhY2Vob2xkZXIgc3R5bGVcblx0XHRwdWJsaWMgcGxhY2Vob2xkZXJTdHlsZShmaWxlOiBJRmlsZSwgdHlwZTogc3RyaW5nKSB7XG5cblx0XHRcdGxldCBzdHlsZSA9IHt9O1xuXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zW3R5cGVdLnBsYWNlaG9sZGVyKSB7XG5cblx0XHRcdFx0bGV0IGluZGV4ID0gdGhpcy5vcHRpb25zW3R5cGVdLnBsYWNlaG9sZGVyO1xuXHRcdFx0XHRsZXQgaXNGdWxsID0gKGluZGV4LmluZGV4T2YoJy8vJykgPT09IDAgfHwgaW5kZXguaW5kZXhPZignaHR0cCcpID09PSAwKSA/IHRydWUgOiBmYWxzZTtcblx0XHRcdFx0bGV0IHNvdXJjZTtcblxuXHRcdFx0XHRpZiAoaXNGdWxsKSB7XG5cdFx0XHRcdFx0c291cmNlID0gaW5kZXg7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c291cmNlID0gZmlsZS5zb3VyY2VbaW5kZXhdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHNvdXJjZSkge1xuXHRcdFx0XHRcdHN0eWxlWydiYWNrZ3JvdW5kLWltYWdlJ10gPSAndXJsKCcgKyBzb3VyY2UgKyAnKSc7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZmlsZS5zb3VyY2UuY29sb3IpIHtcblx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtY29sb3InXSA9IGZpbGUuc291cmNlLmNvbG9yO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZmlsZS5zb3VyY2UucGxhY2Vob2xkZXIpIHtcblx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtaW1hZ2UnXSA9ICd1cmwoJyArIGZpbGUuc291cmNlLnBsYWNlaG9sZGVyICsgJyknO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gc3R5bGU7XG5cblx0XHR9XG5cblx0XHQvLyBzZXQgdmlzaWJsZVxuXHRcdHB1YmxpYyBzZXQgbW9kYWxWaXNpYmxlKHZhbHVlOiBib29sZWFuKSB7XG5cblx0XHRcdHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcblxuXHRcdFx0Ly8gc2V0IGluZGV4IDAgaWYgIXNlbGVjdGVkXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZCA/IHRoaXMuc2VsZWN0ZWQgOiAwO1xuXG5cdFx0XHRsZXQgYm9keSA9IGRvY3VtZW50LmJvZHk7XG5cdFx0XHRsZXQgY2xhc3NOYW1lID0gJ2FzZy15aGlkZGVuJztcblxuXHRcdFx0aWYgKHZhbHVlKSB7XG5cblx0XHRcdFx0aWYgKGJvZHkuY2xhc3NOYW1lLmluZGV4T2YoY2xhc3NOYW1lKSA8IDApIHtcblx0XHRcdFx0XHRib2R5LmNsYXNzTmFtZSA9IGJvZHkuY2xhc3NOYW1lICsgJyAnICsgY2xhc3NOYW1lO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5tb2RhbEluaXQoKTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRib2R5LmNsYXNzTmFtZSA9IGJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoY2xhc3NOYW1lLCAnJykudHJpbSgpO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBpbml0aWFsaXplIHRoZSBnYWxsZXJ5XG5cdFx0cHJpdmF0ZSBtb2RhbEluaXQoKSB7XG5cblx0XHRcdGxldCBzZWxmID0gdGhpcztcblxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcblx0XHRcdFx0c2VsZi5zZXRGb2N1cygpO1xuXHRcdFx0fSwgMTAwKTtcblxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcblx0XHRcdFx0dGhpcy5tb2RhbEluaXRpYWxpemVkID0gdHJ1ZTtcblx0XHRcdH0sIDQ2MCk7XG5cblx0XHR9XG5cblxuXHRcdHB1YmxpYyBtb2RhbE9wZW4oaW5kZXg6IG51bWJlcikge1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kYWxBdmFpbGFibGUpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXggIT09IHVuZGVmaW5lZCA/IGluZGV4IDogdGhpcy5zZWxlY3RlZDtcblx0XHRcdHRoaXMubW9kYWxWaXNpYmxlID0gdHJ1ZTtcblx0XHRcdHRoaXMubG9hZEltYWdlKCk7XG5cdFx0XHR0aGlzLnNldEhhc2goKTtcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuTU9EQUxfT1BFTiwgeyBpbmRleDogdGhpcy5zZWxlY3RlZCB9KTtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyBtb2RhbENsb3NlKCkge1xuXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmhhc2hVcmwpIHtcblx0XHRcdFx0dGhpcy5sb2NhdGlvbi5oYXNoKCcnKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5tb2RhbEluaXRpYWxpemVkID0gZmFsc2U7XG5cdFx0XHR0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoKTtcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuTU9EQUxfQ0xPU0UsIHsgaW5kZXg6IHRoaXMuc2VsZWN0ZWQgfSk7XG5cblx0XHR9XG5cblx0XHQvLyBtb3ZlIHRodW1ibmFpbHMgdG8gY29ycmVjdCBwb3NpdGlvblxuXHRcdHB1YmxpYyB0aHVtYm5haWxzTW92ZShkZWxheT86IG51bWJlcikge1xuXG5cdFx0XHRsZXQgbW92ZSA9ICgpID0+IHtcblxuXHRcdFx0XHRsZXQgY29udGFpbmVycyA9IHRoaXMuZWwoJ2Rpdi5hc2ctdGh1bWJuYWlsLicgKyB0aGlzLmlkKTtcblxuXHRcdFx0XHRpZiAoIWNvbnRhaW5lcnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb250YWluZXJzLmxlbmd0aDsgaSsrKSB7XG5cblx0XHRcdFx0XHRsZXQgY29udGFpbmVyOiBhbnkgPSBjb250YWluZXJzW2ldO1xuXG5cdFx0XHRcdFx0aWYgKGNvbnRhaW5lci5vZmZzZXRXaWR0aCkge1xuXG5cdFx0XHRcdFx0XHRsZXQgaXRlbXM6IGFueSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdkaXYuaXRlbXMnKTtcblx0XHRcdFx0XHRcdGxldCBpdGVtOiBhbnkgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignZGl2Lml0ZW0nKTtcblx0XHRcdFx0XHRcdGxldCB0aHVtYm5haWwsIG1vdmVYLCByZW1haW47XG5cblx0XHRcdFx0XHRcdGlmIChpdGVtKSB7XG5cblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW1zLnNjcm9sbFdpZHRoID4gY29udGFpbmVyLm9mZnNldFdpZHRoKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGh1bWJuYWlsID0gaXRlbXMuc2Nyb2xsV2lkdGggLyB0aGlzLmZpbGVzLmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IChjb250YWluZXIub2Zmc2V0V2lkdGggLyAyKSAtICh0aGlzLnNlbGVjdGVkICogdGh1bWJuYWlsKSAtIHRodW1ibmFpbCAvIDI7XG5cdFx0XHRcdFx0XHRcdFx0cmVtYWluID0gaXRlbXMuc2Nyb2xsV2lkdGggKyBtb3ZlWDtcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IG1vdmVYID4gMCA/IDAgOiBtb3ZlWDtcblx0XHRcdFx0XHRcdFx0XHRtb3ZlWCA9IHJlbWFpbiA8IGNvbnRhaW5lci5vZmZzZXRXaWR0aCA/IGNvbnRhaW5lci5vZmZzZXRXaWR0aCAtIGl0ZW1zLnNjcm9sbFdpZHRoIDogbW92ZVg7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dGh1bWJuYWlsID0gdGhpcy5nZXRSZWFsV2lkdGgoaXRlbSk7XG5cdFx0XHRcdFx0XHRcdFx0bW92ZVggPSAoY29udGFpbmVyLm9mZnNldFdpZHRoIC0gdGh1bWJuYWlsICogdGhpcy5maWxlcy5sZW5ndGgpIC8gMjtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGl0ZW1zLnN0eWxlLmxlZnQgPSBtb3ZlWCArICdweCc7XG5cblx0XHRcdFx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5USFVNQk5BSUxfTU9WRSwge1xuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbDogdGh1bWJuYWlsLFxuXHRcdFx0XHRcdFx0XHRcdG1vdmU6IG1vdmVYLFxuXHRcdFx0XHRcdFx0XHRcdHJlbWFpbjogcmVtYWluLFxuXHRcdFx0XHRcdFx0XHRcdGNvbnRhaW5lcjogY29udGFpbmVyLm9mZnNldFdpZHRoLFxuXHRcdFx0XHRcdFx0XHRcdGl0ZW1zOiBpdGVtcy5zY3JvbGxXaWR0aFxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGlmIChkZWxheSkge1xuXHRcdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdG1vdmUoKTtcblx0XHRcdFx0fSwgZGVsYXkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bW92ZSgpO1xuXHRcdFx0fVxuXG5cblx0XHR9XG5cblx0XHRwdWJsaWMgbW9kYWxDbGljaygkZXZlbnQ/OiBVSUV2ZW50KSB7XG5cblx0XHRcdGlmICgkZXZlbnQpIHtcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnNldEZvY3VzKCk7XG5cblx0XHR9XG5cblx0XHQvLyBzZXQgdGhlIGZvY3VzXG5cdFx0cHVibGljIHNldEZvY3VzKCkge1xuXG5cdFx0XHRpZiAodGhpcy5tb2RhbFZpc2libGUpIHtcblxuXHRcdFx0XHRsZXQgZWxlbWVudDogTm9kZSA9IHRoaXMuZWwoJ2Rpdi5hc2ctbW9kYWwuJyArIHRoaXMuaWQgKyAnIC5rZXlJbnB1dCcpWzBdO1xuXG5cdFx0XHRcdGlmIChlbGVtZW50KSB7XG5cdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW1lbnQpWzBdWydmb2N1cyddKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cHVibGljIGV2ZW50KGV2ZW50OiBzdHJpbmcsIGRhdGE/OiBhbnkpIHtcblxuXHRcdFx0ZXZlbnQgPSBldmVudCArIHRoaXMuaWQ7XG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJGVtaXQoZXZlbnQsIGRhdGEpO1xuXHRcdFx0dGhpcy5sb2coZXZlbnQsIGRhdGEpO1xuXG5cdFx0fVxuXG5cdFx0cHVibGljIGxvZyhldmVudDogc3RyaW5nLCBkYXRhPzogYW55KSB7XG5cblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZGVidWcpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coZXZlbnQsIGRhdGEgPyBkYXRhIDogbnVsbCk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgZWxlbWVudFxuXHRcdHB1YmxpYyBlbChzZWxlY3Rvcik6IE5vZGVMaXN0IHtcblxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gY2FsY3VsYXRpbmcgZWxlbWVudCByZWFsIHdpZHRoXG5cdFx0cHVibGljIGdldFJlYWxXaWR0aChpdGVtKSB7XG5cblx0XHRcdGxldCBzdHlsZSA9IGl0ZW0uY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGl0ZW0pLFxuXHRcdFx0XHR3aWR0aCA9IGl0ZW0ub2Zmc2V0V2lkdGgsXG5cdFx0XHRcdG1hcmdpbiA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpblJpZ2h0KSxcblx0XHRcdFx0Ly8gcGFkZGluZyA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0xlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nUmlnaHQpLFxuXHRcdFx0XHRib3JkZXIgPSBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlckxlZnRXaWR0aCkgKyBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlclJpZ2h0V2lkdGgpO1xuXG5cdFx0XHRyZXR1cm4gd2lkdGggKyBtYXJnaW4gKyBib3JkZXI7XG5cblx0XHR9XG5cblx0XHQvLyBjYWxjdWxhdGluZyBlbGVtZW50IHJlYWwgaGVpZ2h0XG5cdFx0cHVibGljIGdldFJlYWxIZWlnaHQoaXRlbSkge1xuXG5cdFx0XHRsZXQgc3R5bGUgPSBpdGVtLmN1cnJlbnRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShpdGVtKSxcblx0XHRcdFx0aGVpZ2h0ID0gaXRlbS5vZmZzZXRIZWlnaHQsXG5cdFx0XHRcdG1hcmdpbiA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luQm90dG9tKSxcblx0XHRcdFx0Ly8gcGFkZGluZyA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1RvcCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pLFxuXHRcdFx0XHRib3JkZXIgPSBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlclRvcFdpZHRoKSArIHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyQm90dG9tV2lkdGgpO1xuXG5cdFx0XHRyZXR1cm4gaGVpZ2h0ICsgbWFyZ2luICsgYm9yZGVyO1xuXG5cdFx0fVxuXG5cblx0XHQvLyBlZGl0IGdhbGxlcnlcblx0XHRwdWJsaWMgZWRpdEdhbGxlcnkoZWRpdDogSUVkaXQpIHtcblxuXHRcdFx0dGhpcy5lZGl0aW5nID0gdHJ1ZTtcblx0XHRcdGxldCBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQ7XG5cblx0XHRcdGlmIChlZGl0Lm9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLm9wdGlvbnNMb2FkZWQgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5zZXRPcHRpb25zKGVkaXQub3B0aW9ucyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlZGl0LmRlbGV0ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuZGVsZXRlSW1hZ2UoZWRpdC5kZWxldGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZWRpdC5hZGQpIHtcblx0XHRcdFx0bGV0IGxlbmd0aCA9IGVkaXQuYWRkLmxlbmd0aDtcblx0XHRcdFx0Zm9yIChsZXQga2V5ID0gMDsga2V5IDwgbGVuZ3RoOyBrZXkrKykge1xuXHRcdFx0XHRcdHRoaXMuYWRkSW1hZ2UoZWRpdC5hZGRba2V5XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGVkaXQudXBkYXRlKSB7XG5cblx0XHRcdFx0bGV0IGxlbmd0aCA9IGVkaXQudXBkYXRlLmxlbmd0aDtcblxuXHRcdFx0XHRmb3IgKGxldCBrZXkgPSAwOyBrZXkgPCBsZW5ndGg7IGtleSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5hZGRJbWFnZShlZGl0LnVwZGF0ZVtrZXldLCBrZXkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGNvdW50ID0gdGhpcy5maWxlcy5sZW5ndGggLSBlZGl0LnVwZGF0ZS5sZW5ndGg7XG5cdFx0XHRcdGlmIChjb3VudCA+IDApIHtcblx0XHRcdFx0XHR0aGlzLmRlbGV0ZUltYWdlKGxlbmd0aCwgY291bnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlZGl0LnNlbGVjdGVkID49IDApIHtcblx0XHRcdFx0c2VsZWN0ZWQgPSBlZGl0LnNlbGVjdGVkO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZWRpdC5zZWxlY3RlZCA9PSAtMSkge1xuXHRcdFx0XHRzZWxlY3RlZCA9IHRoaXMuZmlsZXMubGVuZ3RoIC0gMTtcblx0XHRcdH1cblxuXHRcdFx0c2VsZWN0ZWQgPSB0aGlzLmZpbGVzW3NlbGVjdGVkXSA/IHNlbGVjdGVkIDogKHNlbGVjdGVkID49IHRoaXMuZmlsZXMubGVuZ3RoID8gdGhpcy5maWxlcy5sZW5ndGggLSAxIDogMCk7XG5cdFx0XHR0aGlzLmZvcmNlU2VsZWN0KHRoaXMuZmlsZXNbc2VsZWN0ZWRdID8gc2VsZWN0ZWQgOiAwKTtcblxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcblxuXHRcdFx0XHR0aGlzLmVkaXRpbmcgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5HQUxMRVJZX1VQREFURUQsIGVkaXQpO1xuXHRcdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKGVkaXQuZGVsYXlUaHVtYm5haWxzICE9PSB1bmRlZmluZWQgPyBlZGl0LmRlbGF5VGh1bWJuYWlscyA6IDIyMCk7XG5cdFx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuTEFTVF9USFVNQk5BSUwpO1xuXG5cdFx0XHR9LCAoZWRpdC5kZWxheVJlZnJlc2ggIT09IHVuZGVmaW5lZCA/IGVkaXQuZGVsYXlSZWZyZXNoIDogNDIwKSk7XG5cblx0XHR9XG5cblxuXHRcdC8vIGRlbGV0ZSBpbWFnZVxuXHRcdHB1YmxpYyBkZWxldGVJbWFnZShpbmRleDogbnVtYmVyLCBjb3VudD86IG51bWJlcikge1xuXG5cdFx0XHRpbmRleCA9IGluZGV4ID09PSBudWxsIHx8IGluZGV4ID09PSB1bmRlZmluZWQgPyB0aGlzLnNlbGVjdGVkIDogaW5kZXg7XG5cdFx0XHRjb3VudCA9IGNvdW50ID8gY291bnQgOiAxO1xuXG5cdFx0XHR0aGlzLmZpbGVzLnNwbGljZShpbmRleCwgY291bnQpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZmluZCBpbWFnZSBpbiBnYWxsZXJ5IGJ5IG1vZGFsIHNvdXJjZVxuXHRcdHB1YmxpYyBmaW5kSW1hZ2UoZmlsZW5hbWUgOiBzdHJpbmcpIHtcblxuXHRcdFx0bGV0IGxlbmd0aCA9IHRoaXMuZmlsZXMubGVuZ3RoO1xuXG5cdFx0XHRmb3IgKGxldCBrZXkgPSAwOyBrZXkgPCBsZW5ndGg7IGtleSsrKSB7XG5cdFx0XHRcdGlmICh0aGlzLmZpbGVzW2tleV0uc291cmNlLm1vZGFsID09PSBmaWxlbmFtZSkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZpbGVzW2tleV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0fVxuXG5cblx0XHRwdWJsaWMgZ2V0RnVsbFVybCh1cmwgOiBzdHJpbmcsIGJhc2VVcmw/OiBzdHJpbmcpIHtcblxuXHRcdFx0YmFzZVVybCA9IGJhc2VVcmwgPT09IHVuZGVmaW5lZCA/IHRoaXMub3B0aW9ucy5iYXNlVXJsIDogYmFzZVVybDtcblx0XHRcdGxldCBpc0Z1bGwgPSAodXJsLmluZGV4T2YoJy8vJykgPT09IDAgfHwgdXJsLmluZGV4T2YoJ2h0dHAnKSA9PT0gMCkgPyB0cnVlIDogZmFsc2U7XG5cblx0XHRcdHJldHVybiBpc0Z1bGwgPyB1cmwgOiBiYXNlVXJsICsgdXJsO1xuXG5cdFx0fVxuXG5cdFx0Ly8gYWRkIGltYWdlXG5cdFx0cHVibGljIGFkZEltYWdlKHZhbHVlOiBhbnksIGluZGV4PzogbnVtYmVyKSB7XG5cblx0XHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cblx0XHRcdGlmIChhbmd1bGFyLmlzU3RyaW5nKHZhbHVlKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHsgc291cmNlOiB7IG1vZGFsOiB2YWx1ZSB9IH07XG5cdFx0XHR9XG5cblx0XHRcdGxldCBnZXRBdmFpbGFibGVTb3VyY2UgPSBmdW5jdGlvbiAodHlwZTogc3RyaW5nLCBzcmM6IElTb3VyY2UpIHtcblxuXHRcdFx0XHRpZiAoc3JjW3R5cGVdKSB7XG5cblx0XHRcdFx0XHRyZXR1cm4gc2VsZi5nZXRGdWxsVXJsKHNyY1t0eXBlXSk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAncGFuZWwnKSB7XG5cdFx0XHRcdFx0XHR0eXBlID0gJ2ltYWdlJztcblx0XHRcdFx0XHRcdGlmIChzcmNbdHlwZV0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHNlbGYuZ2V0RnVsbFVybChzcmNbdHlwZV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAnaW1hZ2UnKSB7XG5cdFx0XHRcdFx0XHR0eXBlID0gJ21vZGFsJztcblx0XHRcdFx0XHRcdGlmIChzcmNbdHlwZV0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHNlbGYuZ2V0RnVsbFVybChzcmNbdHlwZV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAnbW9kYWwnKSB7XG5cdFx0XHRcdFx0XHR0eXBlID0gJ2ltYWdlJztcblx0XHRcdFx0XHRcdGlmIChzcmNbdHlwZV0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHNlbGYuZ2V0RnVsbFVybChzcmNbdHlwZV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH07XG5cblx0XHRcdGlmICghdmFsdWUuc291cmNlKSB7XG5cdFx0XHRcdHZhbHVlLnNvdXJjZSA9IHtcblx0XHRcdFx0XHRtb2RhbDogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UubW9kYWxdLFxuXHRcdFx0XHRcdHBhbmVsOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5wYW5lbF0sXG5cdFx0XHRcdFx0aW1hZ2U6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLmltYWdlXSxcblx0XHRcdFx0XHRwbGFjZWhvbGRlcjogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UucGxhY2Vob2xkZXJdXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdGxldCBzb3VyY2UgPSB7XG5cdFx0XHRcdG1vZGFsOiBnZXRBdmFpbGFibGVTb3VyY2UoJ21vZGFsJywgdmFsdWUuc291cmNlKSxcblx0XHRcdFx0cGFuZWw6IGdldEF2YWlsYWJsZVNvdXJjZSgncGFuZWwnLCB2YWx1ZS5zb3VyY2UpLFxuXHRcdFx0XHRpbWFnZTogZ2V0QXZhaWxhYmxlU291cmNlKCdpbWFnZScsIHZhbHVlLnNvdXJjZSksXG5cdFx0XHRcdGNvbG9yOiB2YWx1ZS5jb2xvciA/IHZhbHVlLmNvbG9yIDogJ3RyYW5zcGFyZW50Jyxcblx0XHRcdFx0cGxhY2Vob2xkZXI6IHZhbHVlLnBsYWNlaG9sZGVyID8gc2VsZi5nZXRGdWxsVXJsKHZhbHVlLnBsYWNlaG9sZGVyKSA6IG51bGxcblx0XHRcdH07XG5cblx0XHRcdGlmICghc291cmNlLm1vZGFsKSB7XG5cdFx0XHRcdHNlbGYubG9nKCdpbnZhbGlkIGltYWdlIGRhdGEnLCB7IHNvdXJjZTogc291cmNlLCB2YWx1ZTogdmFsdWUgfSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHBhcnRzID0gc291cmNlLm1vZGFsLnNwbGl0KCcvJyk7XG5cdFx0XHRsZXQgZmlsZW5hbWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcblx0XHRcdGxldCB0aXRsZSwgc3VidGl0bGUsIGRlc2NyaXB0aW9uLCB2aWRlbztcblxuXHRcdFx0aWYgKHNlbGYub3B0aW9ucy5maWVsZHMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aXRsZSA9IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aXRsZV0gOiBmaWxlbmFtZTtcblx0XHRcdFx0c3VidGl0bGUgPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnN1YnRpdGxlXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc3VidGl0bGVdIDogbnVsbDtcblx0XHRcdFx0ZGVzY3JpcHRpb24gPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuZGVzY3JpcHRpb25dIDogbnVsbDtcblx0XHRcdFx0dmlkZW8gPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnZpZGVvXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudmlkZW9dIDogbnVsbDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRpdGxlID0gZmlsZW5hbWU7XG5cdFx0XHRcdHN1YnRpdGxlID0gbnVsbDtcblx0XHRcdFx0ZGVzY3JpcHRpb24gPSBudWxsO1xuXHRcdFx0XHR2aWRlbyA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBmaWxlID0ge1xuXHRcdFx0XHRzb3VyY2U6IHNvdXJjZSxcblx0XHRcdFx0dGl0bGU6IHRpdGxlLFxuXHRcdFx0XHRzdWJ0aXRsZTogc3VidGl0bGUsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcblx0XHRcdFx0dmlkZW86IHZpZGVvLFxuXHRcdFx0XHRsb2FkZWQ6IHtcblx0XHRcdFx0XHRtb2RhbDogZmFsc2UsXG5cdFx0XHRcdFx0cGFuZWw6IGZhbHNlLFxuXHRcdFx0XHRcdGltYWdlOiBmYWxzZVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoaW5kZXggIT09IHVuZGVmaW5lZCAmJiB0aGlzLmZpbGVzW2luZGV4XSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdID0gZmlsZTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKHNlbGYub3B0aW9ucy5kdXBsaWNhdGVzICE9PSB0cnVlICYmIHRoaXMuZmluZEltYWdlKGZpbGUuc291cmNlLm1vZGFsKSkge1xuXHRcdFx0XHRcdHNlbGYuZXZlbnQoc2VsZi5ldmVudHMuRE9VQkxFX0lNQUdFLCBmaWxlKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLmZpbGVzLnB1c2goZmlsZSk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9XG5cblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XG5cblx0YXBwLnNlcnZpY2UoJ2FzZ1NlcnZpY2UnLCBbJyR0aW1lb3V0JywgJyRpbnRlcnZhbCcsICckbG9jYXRpb24nLCAnJHJvb3RTY29wZScsICckd2luZG93JywgJyRzY2UnLCBTZXJ2aWNlQ29udHJvbGxlcl0pO1xuXG59XG5cbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIFRodW1ibmFpbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnM6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zOiBBcnJheTxJRmlsZT47XHJcblx0XHRwdWJsaWMgYmFzZVVybDogc3RyaW5nO1xyXG5cclxuXHRcdHByaXZhdGUgdHlwZSA9ICd0aHVtYm5haWwnO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZTtcclxuXHRcdHByaXZhdGUgYXNnOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblx0XHRwcml2YXRlIG1vZGFsID0gZmFsc2U7XHJcblx0XHRwcml2YXRlIGxvYWRlZCA9IDA7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IoXHJcblx0XHRcdHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRwcml2YXRlICRzY29wZTogSVNjb3BlLFxyXG5cdFx0XHRwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG5cdFx0XHRwcml2YXRlICRlbGVtZW50OiBuZy5JUm9vdEVsZW1lbnRTZXJ2aWNlLFxyXG5cdFx0XHRwcml2YXRlICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UpIHtcclxuXHJcblx0XHRcdHRoaXMudGVtcGxhdGUgPSAnL3ZpZXdzL2FzZy10aHVtYm5haWwuaHRtbCc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHQvLyBnZXQgcGFyZW50IGFzZyBjb21wb25lbnQgKG1vZGFsKVxyXG5cdFx0XHRpZiAodGhpcy4kc2NvcGUgJiYgdGhpcy4kc2NvcGUuJHBhcmVudCAmJiB0aGlzLiRzY29wZS4kcGFyZW50LiRwYXJlbnQgJiYgdGhpcy4kc2NvcGUuJHBhcmVudC4kcGFyZW50WyckY3RybCddKSB7XHJcblx0XHRcdFx0dGhpcy5tb2RhbCA9IHRoaXMuJHNjb3BlLiRwYXJlbnQuJHBhcmVudFsnJGN0cmwnXS50eXBlID09PSAnbW9kYWwnID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJG9uKHRoaXMuYXNnLmV2ZW50cy5MQVNUX1RIVU1CTkFJTCArIHRoaXMuaWQsIChldmVudCwgZGF0YSkgPT4ge1xyXG5cclxuXHRcdFx0XHRzZWxmLmFzZy50aHVtYm5haWxzTW92ZSgxMCk7XHJcblx0XHRcdFx0c2VsZi4kdGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHRzZWxmLmNvbmZpZy5pbml0aWFsaXplZCA9IHRydWU7XHJcblx0XHRcdFx0fSwgMTIwKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBvbkxvYWQoZmlsZT86IElGaWxlKSB7XHJcblxyXG5cdFx0XHRmaWxlLmxvYWRlZC5wYW5lbCA9IHRydWU7XHJcblx0XHRcdHRoaXMubG9hZGVkKys7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5sb2FkZWQgPT09IHRoaXMuYXNnLmZpbGVzLmxlbmd0aCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLmV2ZW50KHRoaXMuYXNnLmV2ZW50cy5MQVNUX1RIVU1CTkFJTCwgZmlsZSk7XHJcblx0XHRcdFx0dGhpcy5jb25maWcubG9hZGVkID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXRTZWxlY3RlZChpbmRleDogbnVtYmVyLCAkZXZlbnQ/OiBNb3VzZUV2ZW50KSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2subW9kYWwpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbE9wZW4oaW5kZXgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLnNlbGVjdCkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBwcmVsb2Qgd2hlbiBtb3VzZW92ZXIgYW5kIHNldCBzZWxlY3RlZCBpZiBlbmFibGVkXHJcblx0XHRwdWJsaWMgaG92ZXIoaW5kZXg6IG51bWJlciwgJGV2ZW50PzogTW91c2VFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhvdmVyLnByZWxvYWQgPT09IHRydWUpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5ob3ZlclByZWxvYWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5jb25maWcuaG92ZXIuc2VsZWN0ID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCB0aHVtYm5haWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpOiBJT3B0aW9uc1RodW1ibmFpbCB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5tb2RhbCA/IHRoaXMuYXNnLm9wdGlvbnMubW9kYWxbdGhpcy50eXBlXSA6IHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRodW1ibmFpbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlOiBJT3B0aW9uc1RodW1ibmFpbCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMubW9kYWwpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5vcHRpb25zLm1vZGFsW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodjogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGFib3ZlIGZyb20gY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGR5bmFtaWMoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcuZHluYW1pYyA/ICdkeW5hbWljJyA6ICcnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBhdXRvaGlkZSBhbmQgaXNTaW5nbGUgPT0gdHJ1ZSA/XHJcblx0XHRwdWJsaWMgZ2V0IGF1dG9oaWRlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLmF1dG9oaWRlICYmIHRoaXMuYXNnLmlzU2luZ2xlID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgY2xhc3Nlc1xyXG5cdFx0cHVibGljIGdldCBjbGFzc2VzKCk6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuY2xhc3NlcyArICcgJyArIHRoaXMuZHluYW1pYyArICcgJyArICh0aGlzLmNvbmZpZy5pbml0aWFsaXplZCA/ICdpbml0aWFsaXplZCcgOiAnaW5pdGlhbGl6aW5nJyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dUaHVtYm5haWwnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJGVsZW1lbnQnLCAnJHRpbWVvdXQnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LlRodW1ibmFpbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGRhdGEtbmctaWY9XCIhJGN0cmwuYXV0b2hpZGVcIiBjbGFzcz1cImFzZy10aHVtYm5haWwge3sgJGN0cmwuY2xhc3NlcyB9fVwiIG5nLWNsaWNrPVwiJGN0cmwuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcIj48ZGl2IG5nLWluY2x1ZGU9XCIkY3RybC50ZW1wbGF0ZVwiPjwvZGl2PjwvZGl2PicsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0AnLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nLFxyXG5cdFx0XHRiYXNlVXJsOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiJdfQ==

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('/views/asg-control.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.autoPlayToggle()"><span ng-if="!$ctrl.asg.options.autoplay.enabled" class="fa fa-play"></span> <span ng-if="$ctrl.asg.options.autoplay.enabled" class="fa fa-stop"></span></button> <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toFirst(true)">{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}</button> <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toBackward(true)"><span class="fa fa-chevron-left"></span></button> <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toForward(true)"><span class="fa fa-chevron-right"></span></button>');
$templateCache.put('/views/asg-debug.html','<pre>    \r\n    {{ $ctrl.file | json }}    \r\n</pre><hr><pre>        \r\n    {{ $ctrl.service.instances.abstracts.options | json }}\r\n</pre>');
$templateCache.put('/views/asg-help.html','<ul><li>SPACE : forward</li><li>RIGHT : forward</li><li>LEFT : backward</li><li>UP / HOME : first</li><li>DOWN / END : last</li><li>ENTER : toggle fullscreen</li><li>ESC : exit</li><li>p : play/pause</li><li>t : change transition effect</li><li>m : toggle menu</li><li>s : toggle image size</li><li>c : toggle caption</li><li>h : toggle help</li></ul>');
$templateCache.put('/views/asg-image.html','<div class="asg-image {{ $ctrl.asg.classes }}" ng-class="{\'modalon\' : $ctrl.modalAvailable }" ng-style="{\'min-height\' : $ctrl.config.heightMin + \'px\', \'height\' : $ctrl.height + \'px\'}"><div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)"><div class="img" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-show="$ctrl.asg.selected == key" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.modalOpen($event)" ng-style="$ctrl.asg.dynamicStyle(file, \'image\', $ctrl.config)" ng-class="{\'loaded\' : file.loaded.image}"><div style="position:absolute;top:0;left:0;width:100%;height:100%;z-index: 10;" ng-if="$ctrl.asg.options.debug">{{ file }}</div><div class="placeholder {{ $ctrl.config.size }}" ng-style="$ctrl.asg.placeholderStyle(file, \'image\')"></div><div class="source {{ $ctrl.config.size }}" ng-style="{\'background-image\': \'url(\' + file.source.image + \')\'}" ng-mouseover="$ctrl.asg.hoverPreload(key)"></div><div class="video" ng-show="file.video.visible" id="vimeo_video_{{ file.video.vimeoId }}"></div><div class="play" ng-if="file.video && !file.video.playing"><div class="button" ng-click="$ctrl.playVideo($event)"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><circle class="circle" cx="256" cy="256" r="256" stroke-width="1"/></g><g><polygon class="icon" points="189.776,141.328 189.776,370.992 388.672,256.16"/></g></svg></div></div></div></div><div class="arrow left" ng-if="$ctrl.config.arrows.enabled && !$ctrl.asg.isSingle"><button class="btn btn-default btn-md pull-left" ng-click="$ctrl.toBackward(true, $event)" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)"><span class="fa fa-chevron-left"></span></button></div><div class="arrow right" ng-if="$ctrl.config.arrows.enabled && !$ctrl.asg.isSingle"><button class="btn btn-default btn-md pull-right" ng-click="$ctrl.toForward(true, $event)" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)"><span class="fa fa-chevron-right"></span></button></div><ng-transclude></ng-transclude></div>');
$templateCache.put('/views/asg-info.html','<div class="row"><div class="col-md-12"><h3>{{ $ctrl.file.title }}</h3></div><div class="col-md-12">{{ $ctrl.file.description }} <a target="_blank" href="{{ $ctrl.download }}"><span class="fa fa-download"></span></a></div></div>');
$templateCache.put('/views/asg-modal.html','<div class="asg-modal {{ $ctrl.asg.classes }}" ng-class="$ctrl.getClass()" ng-click="$ctrl.imageClick($event);" ng-if="$ctrl.asg.modalVisible" ng-cloak><div tabindex="1" class="keyInput" ng-keydown="$ctrl.keyUp($event)"></div><div class="frame" ng-click="$ctrl.asg.modalClick($event);"><div class="header" ng-if="$ctrl.config.header.enabled" ng-click="$ctrl.asg.modalClick($event);"><span class="buttons d-block d-sm-none pull-right"><span ng-include="\'/views/button/asg-index-xs.html\'"></span> </span><span class="buttons d-none d-sm-block pull-right"><span ng-repeat="item in $ctrl.config.header.buttons" ng-include="(\'/views/button/asg-\' + item + \'.html\')"></span> </span><span ng-if="$ctrl.config.title"><span class="title">{{ $ctrl.config.title }}</span> <span class="subtitle d-none d-sm-block" ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span></span></div><div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}" ng-style="{\'top\': $ctrl.marginTop + \'px\', \'bottom\': $ctrl.marginBottom + \'px\'}" ng-mouseover="$ctrl.asg.over.modalImage = true;" ng-mouseleave="$ctrl.asg.over.modalImage = false;"><div class="help text-right" ng-click="$ctrl.toggleHelp($event)" ng-show="$ctrl.config.help" ng-include="\'/views/asg-help.html\'"></div><div class="arrow left" ng-if="$ctrl.config.arrows.enabled && !$ctrl.asg.isSingle" ng-click="$ctrl.toBackward(true, $event)"><button class="btn btn-default btn-md pull-left" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)"><span class="fa fa-chevron-left"></span></button></div><div class="arrow right" ng-if="$ctrl.config.arrows.enabled && !$ctrl.asg.isSingle" ng-click="$ctrl.toForward(true, $event)"><button class="btn btn-default btn-md pull-right" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)"><span class="fa fa-chevron-right"></span></button></div><div class="img" ng-click="$ctrl.imageClick($event)" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-show="$ctrl.asg.selected == key" ng-style="$ctrl.asg.dynamicStyle(file, \'modal\', $ctrl.config)" ng-class="{\'loaded\' : file.loaded.modal}"><div class="placeholder {{ $ctrl.config.size }}" ng-style="$ctrl.asg.placeholderStyle(file, \'modal\')"></div><div class="source {{ $ctrl.config.size }}" ng-if="file.loaded.modal" ng-style="{\'background-image\': \'url(\' + file.source.modal + \')\'}"></div></div><div class="caption {{ $ctrl.config.caption.position }}" ng-show="!$ctrl.config.caption.disabled" ng-class="{\'visible\' : $ctrl.config.caption.visible}"><div class="content"><span class="title">{{ $ctrl.asg.file.title }}</span> <span ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description">- </span><span class="description">{{ $ctrl.asg.file.description }}</span> <a ng-if="$ctrl.config.caption.download" href="{{ $ctrl.asg.downloadLink() }}" target="_blank" class="btn btn-default btn-sm"><span class="fa fa-download"></span> Download</a></div></div></div><ng-transclude></ng-transclude></div></div>');
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