/**
 * angular-super-gallery - AngularJS Super Gallery
 * 
 * @version v3.0.2
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
    var ContainerController = (function () {
        function ContainerController(service, $window, $rootScope, $element, $timeout, $scope) {
            var _this = this;
            this.service = service;
            this.$window = $window;
            this.$rootScope = $rootScope;
            this.$element = $element;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.type = 'container';
            this.arrowsVisible = false;
            this.options = this.options ? this.options : {};
            angular.element($window).bind('resize', function (event) {
                _this.onResize();
            });
        }
        ContainerController.prototype.onResize = function () {
            if (this.config.heightAuto.onresize) {
                this.setHeight(this.asg.file);
            }
        };
        ContainerController.prototype.$onInit = function () {
            var _this = this;
            this.asg = this.service.getInstance(this);
            this.config.available = true;
            this.config.visibleDefault = this.config.visible;
            var self = this;
            this.$rootScope.$on(this.asg.events.FIRST_IMAGE + this.id, function (event, data) {
                if (!_this.config.height && _this.config.heightAuto.initial === true) {
                    _this.$timeout(function () {
                        self.setHeight(data.img);
                    }, 100);
                }
            });
            this.$rootScope.$on(this.asg.events.LOAD_IMAGE + this.id, function (event, data) {
                _this.$scope.$apply();
            });
        };
        ContainerController.prototype.setHeight = function (img) {
            var el = this.$element.children('div')[0];
            if (el) {
                var width = this.$element.children('div')[0].clientWidth;
                var ratio = img.width / img.height;
                this.config.height = width / ratio;
            }
        };
        Object.defineProperty(ContainerController.prototype, "height", {
            get: function () {
                return this.config.height;
            },
            enumerable: false,
            configurable: true
        });
        ContainerController.prototype.getClass = function () {
            if (!this.config) {
                return;
            }
            var ngClass = [];
            if (this.config.header.dynamic) {
                ngClass.push('dynamic');
            }
            if (this.config.fullsize) {
                ngClass.push('fullsize');
            }
            ngClass.push(this.asg.options.theme);
            return ngClass.join(' ');
        };
        ContainerController.prototype.getActionByKeyCode = function (keyCode) {
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
        ContainerController.prototype.close = function ($event) {
            this.asg.modalClick($event);
            this.asg.modalClose();
            this.exitFullScreen();
            this.toggleFullSize();
        };
        ContainerController.prototype.imageClick = function ($event) {
            this.asg.modalClick($event);
            if (this.config.click.close) {
                this.toggleFullSize();
                this.exitFullScreen();
            }
        };
        ContainerController.prototype.hover = function (index, $event) {
            if (this.config.arrows.preload === true) {
                this.asg.hoverPreload(index);
            }
        };
        ContainerController.prototype.setFocus = function ($event) {
            this.asg.modalClick($event);
        };
        ContainerController.prototype.autoPlayToggle = function ($event) {
            this.asg.modalClick($event);
            this.asg.autoPlayToggle();
        };
        ContainerController.prototype.toFirst = function (stop, $event) {
            this.asg.modalClick($event);
            this.asg.toFirst();
            this.$scope.$apply();
        };
        ContainerController.prototype.toBackward = function (stop, $event) {
            this.asg.modalClick($event);
            this.asg.toBackward(stop);
            this.$scope.$apply();
        };
        ContainerController.prototype.toForward = function (stop, $event) {
            this.asg.modalClick($event);
            this.asg.toForward(stop);
            this.$scope.$apply();
        };
        ContainerController.prototype.toLast = function (stop, $event) {
            this.asg.modalClick($event);
            this.asg.toLast(stop);
            this.$scope.$apply();
        };
        ContainerController.prototype.keyUp = function (e) {
            var action = this.getActionByKeyCode(e.keyCode);
            this.asg.log('key up', action);
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
                case 'fullsize':
                    this.toggleFullSize();
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
        ContainerController.prototype.nextTransition = function ($event) {
            this.asg.modalClick($event);
            var idx = this.asg.transitions.indexOf(this.config.transition) + 1;
            var next = idx >= this.asg.transitions.length ? 0 : idx;
            this.config.transition = this.asg.transitions[next];
        };
        ContainerController.prototype.toggleFullSize = function ($event) {
            this.asg.modalClick($event);
            if (this.config.visibleDefault) {
                this.config.fullsize = !this.config.fullsize;
            }
            else {
                this.config.visible = !this.config.visible;
                if (this.asg.file.video && this.asg.file.video.playing) {
                    this.asg.file.video.player.pause();
                    this.asg.file.video.paused = true;
                }
            }
        };
        ContainerController.prototype.toggleFullScreen = function ($event) {
            this.asg.modalClick($event);
            if (!this.$window.screenfull) {
                return;
            }
            this.$window.screenfull.toggle();
        };
        ContainerController.prototype.exitFullScreen = function () {
            if (!this.$window.screenfull) {
                return;
            }
            if (!this.$window.screenfull.isFullscreen) {
                return;
            }
            this.$window.screenfull.exit();
        };
        ContainerController.prototype.toggleThumbnails = function ($event) {
            this.asg.modalClick($event);
            this.config.thumbnail.dynamic = !this.config.thumbnail.dynamic;
            console.log(this.config.thumbnail);
        };
        ContainerController.prototype.setTransition = function (transition, $event) {
            this.asg.modalClick($event);
            this.config.transition = transition;
        };
        ContainerController.prototype.setTheme = function (theme, $event) {
            this.asg.modalClick($event);
            this.asg.options.theme = theme;
        };
        ContainerController.prototype.toggleHelp = function ($event) {
            this.asg.modalClick($event);
            this.config.help = !this.config.help;
        };
        ContainerController.prototype.toggleSize = function ($event) {
            this.asg.modalClick($event);
            var index = this.asg.sizes.indexOf(this.config.size);
            index = (index + 1) >= this.asg.sizes.length ? 0 : ++index;
            this.config.size = this.asg.sizes[index];
            this.asg.log('toggle image size:', [this.config.size, index]);
        };
        ContainerController.prototype.toggleMenu = function ($event) {
            this.asg.modalClick($event);
            this.config.header.dynamic = !this.config.header.dynamic;
        };
        ContainerController.prototype.toggleCaption = function () {
            this.config.caption.visible = !this.config.caption.visible;
        };
        ContainerController.prototype.playVideo = function ($event) {
            if ($event) {
                $event.stopPropagation();
            }
            if (!this.asg.file.video.vimeoId) {
                return;
            }
            var self = this;
            this.asg.file.video.visible = true;
            this.asg.file.video.htmlId = 'modal_vimeo_video_' + this.asg.file.video.vimeoId;
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
                self.asg.file.video.visible = true;
                self.$scope.$apply();
            });
            player.on('pause', function () {
                self.asg.file.video.playing = false;
                self.asg.file.video.visible = false;
                self.$scope.$apply();
            });
            this.asg.file.video.player = player;
            this.asg.file.video.playing = true;
        };
        Object.defineProperty(ContainerController.prototype, "marginTop", {
            get: function () {
                return this.config.marginTop;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ContainerController.prototype, "marginBottom", {
            get: function () {
                return this.config.marginBottom;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ContainerController.prototype, "visible", {
            get: function () {
                if (!this.asg) {
                    return;
                }
                return this.config.visible;
            },
            set: function (value) {
                if (!this.asg) {
                    return;
                }
                this.config.visible = value;
                this.asg.setHash();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ContainerController.prototype, "selected", {
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
        Object.defineProperty(ContainerController.prototype, "config", {
            get: function () {
                return this.asg.options[this.type];
            },
            set: function (value) {
                this.asg.options[this.type] = value;
            },
            enumerable: false,
            configurable: true
        });
        return ContainerController;
    }());
    angularSuperGallery.ContainerController = ContainerController;
    var app = angular.module('angularSuperGallery');
    app.component('asgContainer', {
        controller: ['asgService', '$window', '$rootScope', '$element', '$timeout', '$scope', angularSuperGallery.ContainerController],
        templateUrl: '/views/asg-container.html',
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
    var ImageOldController = (function () {
        function ImageOldController(service, $rootScope, $element, $timeout, $window, $scope) {
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
        ImageOldController.prototype.onResize = function () {
            if (this.config.heightAuto.onresize) {
                this.setHeight(this.asg.file);
            }
        };
        ImageOldController.prototype.$onInit = function () {
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
        ImageOldController.prototype.setHeight = function (img) {
            var width = this.$element.children('div')[0].clientWidth;
            var ratio = img.width / img.height;
            this.config.height = width / ratio;
        };
        Object.defineProperty(ImageOldController.prototype, "height", {
            get: function () {
                return this.config.height;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ImageOldController.prototype, "config", {
            get: function () {
                return this.asg.options[this.type];
            },
            set: function (value) {
                this.asg.options[this.type] = value;
            },
            enumerable: false,
            configurable: true
        });
        ImageOldController.prototype.toBackward = function (stop, $event) {
            if ($event) {
                $event.stopPropagation();
            }
            this.asg.toBackward(stop);
        };
        ImageOldController.prototype.toForward = function (stop, $event) {
            if ($event) {
                $event.stopPropagation();
            }
            this.asg.toForward(stop);
        };
        ImageOldController.prototype.hover = function (index, $event) {
            if (this.config.arrows.preload === true) {
                this.asg.hoverPreload(index);
            }
        };
        Object.defineProperty(ImageOldController.prototype, "selected", {
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
        Object.defineProperty(ImageOldController.prototype, "modalAvailable", {
            get: function () {
                return this.asg.modalAvailable && this.config.click.modal;
            },
            enumerable: false,
            configurable: true
        });
        ImageOldController.prototype.modalOpen = function ($event) {
            if ($event) {
                $event.stopPropagation();
            }
            if (this.config.click.modal) {
                this.asg.modalOpen(this.asg.selected);
            }
        };
        ImageOldController.prototype.playVideo = function ($event) {
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
                self.asg.file.video.visible = true;
                console.log('play the video!');
            });
            player.on('pause', function () {
                self.asg.file.video.playing = false;
                self.asg.file.video.visible = false;
                console.log('paused the video!');
            });
            this.asg.file.video.player = player;
            this.asg.file.video.playing = true;
        };
        return ImageOldController;
    }());
    angularSuperGallery.ImageOldController = ImageOldController;
    var app = angular.module('angularSuperGallery');
    app.component('asgImageOld', {
        controller: ['asgService', '$rootScope', '$element', '$timeout', '$window', '$scope', angularSuperGallery.ImageOldController],
        templateUrl: '/views/asg-image-old.html',
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
            this.options = {};
            this.baseUrl = '';
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
            this.config.available = true;
            this.$rootScope.$on(this.asg.events.LOAD_IMAGE + this.id, function (event, data) {
                _this.$scope.$apply();
            });
            if (this.index) {
                this.file = this.asg.files[this.index] ? this.asg.files[this.index] : undefined;
                console.log('image index', this.index);
            }
            if (this.item) {
                this.file = this.asg.addImage(this.item);
                this.index = this.file.index;
            }
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
        ImageController.prototype.containerAction = function ($event) {
            if ($event) {
                $event.stopPropagation();
            }
            if (!this.asg.options.container.available) {
                return;
            }
            this.asg.setSelected(this.file.index);
            if (this.asg.options.container.fullsize) {
                this.asg.containerFullSize();
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
            item: '=?',
            index: '=?',
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

var Vimeo;
var angularSuperGallery;
(function (angularSuperGallery) {
    var ItemController = (function () {
        function ItemController(service, $rootScope, $element, $timeout, $window, $scope) {
            this.service = service;
            this.$rootScope = $rootScope;
            this.$element = $element;
            this.$timeout = $timeout;
            this.$window = $window;
            this.$scope = $scope;
            this.type = 'item';
        }
        ItemController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this);
            if (this.item) {
                this.file = this.asg.addImage(this.item);
            }
        };
        Object.defineProperty(ItemController.prototype, "config", {
            get: function () {
                return this.asg.options[this.type];
            },
            set: function (value) {
                this.asg.options[this.type] = value;
            },
            enumerable: false,
            configurable: true
        });
        ItemController.prototype.preload = function ($event, size) {
            if ($event) {
                $event.stopPropagation();
            }
            this.asg.preloadImage(this.file.index, size);
        };
        ItemController.prototype.click = function ($event) {
            if ($event) {
                $event.stopPropagation();
            }
            this.asg.setSelected(this.file.index);
            if (this.asg.options.container.fullsize) {
                this.asg.containerFullSize();
            }
        };
        return ItemController;
    }());
    angularSuperGallery.ItemController = ItemController;
    var app = angular.module('angularSuperGallery');
    app.component('asgItem', {
        controller: ['asgService', '$rootScope', '$element', '$timeout', '$window', '$scope', angularSuperGallery.ItemController],
        templateUrl: '/views/asg-item.html',
        transclude: true,
        bindings: {
            id: '@?',
            item: '=?',
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
        ModalController.prototype.playVideo = function ($event) {
            if ($event) {
                $event.stopPropagation();
            }
            var self = this;
            this.asg.file.video.visible = true;
            this.asg.file.video.htmlId = 'modal_vimeo_video_' + this.asg.file.video.vimeoId;
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
                self.asg.file.video.visible = true;
                console.log('play the video!');
            });
            player.on('pause', function () {
                self.asg.file.video.playing = false;
                self.asg.file.video.visible = false;
                console.log('paused the video!');
            });
            this.asg.file.video.player = player;
            this.asg.file.video.playing = true;
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
            this.version = "3.0.2";
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
                        large: 'url',
                        small: 'url',
                        medium: 'url',
                        lazy: null
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
                container: {
                    available: false,
                    fullsize: true,
                    visible: false,
                    title: '',
                    subtitle: '',
                    titleFromImage: false,
                    subtitleFromImage: false,
                    caption: {
                        disabled: true,
                        visible: true,
                        position: 'top',
                        download: false
                    },
                    header: {
                        enabled: true,
                        dynamic: false,
                        buttons: ['playstop', 'index', 'prev', 'next', 'pin', 'size', 'transition', 'thumbnails', 'fullsize', 'fullscreen', 'help', 'close'],
                    },
                    help: false,
                    arrows: {
                        enabled: true,
                        preload: false,
                    },
                    click: {
                        close: true
                    },
                    thumbnail: {
                        available: false,
                        height: 50,
                        index: false,
                        enabled: true,
                        dynamic: true,
                        autohide: true,
                        click: {
                            select: true,
                            modal: false
                        },
                        hover: {
                            preload: false,
                            select: false
                        },
                    },
                    transition: 'slideLR',
                    transitionSpeed: 0.7,
                    size: 'contain',
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
                    },
                    height: null,
                    heightMin: null,
                    heightAuto: {
                        initial: true,
                        onresize: false
                    },
                },
                modal: {
                    available: false,
                    title: '',
                    subtitle: '',
                    titleFromImage: false,
                    subtitleFromImage: false,
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
                        preload: false,
                    },
                    click: {
                        close: true
                    },
                    thumbnail: {
                        available: false,
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
                            preload: false,
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
                    available: false,
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
                    available: false,
                    visible: true,
                    size: 'cover',
                    items: {
                        class: 'row',
                    },
                    item: {
                        class: 'col-md-3',
                        caption: false,
                        index: false,
                    },
                    hover: {
                        preload: false,
                        select: false
                    },
                    click: {
                        select: false,
                        modal: true
                    },
                },
                image: {
                    available: false,
                    transition: 'slideLR',
                    transitionSpeed: 0.7,
                    size: 'cover',
                    arrows: {
                        enabled: false,
                        preload: false,
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
                },
                item: {
                    available: false,
                    transition: 'slideLR',
                    transitionSpeed: 0.7,
                    size: 'cover',
                    arrows: {
                        enabled: false,
                        preload: false,
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
                    component.id = this.objectHashId(component.options ? component.options : { 'asg': 1 });
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
            if (component.items) {
                instance.setItems(component.items);
            }
            instance.selected = component.selected ? component.selected : instance.options.selected;
            instance.parseHash();
            if (instance.options) {
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
            this.options = angular.copy(this.defaults);
            if (options) {
                angular.merge(this.options, options);
                var modalHeaderButtons = options.modal && options.modal.header && options.modal.header.buttons;
                var containerHeaderButtons = options.container && options.container.header && options.container.header.buttons;
                if (modalHeaderButtons) {
                    this.options.modal.header.buttons = options.modal.header.buttons;
                    this.options.modal.header.buttons = this.options.modal.header.buttons.filter(function (x, i, a) {
                        return a.indexOf(x) === i;
                    });
                }
                if (containerHeaderButtons) {
                    this.options.container.header.buttons = options.container.header.buttons;
                    this.options.container.header.buttons = this.options.container.header.buttons.filter(function (x, i, a) {
                        return a.indexOf(x) === i;
                    });
                }
                this.optionsLoaded = true;
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
                if (this.options.container.available && this.options.container.visible) {
                    this.preloadImage(this._selected, 'large');
                }
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
        ServiceController.prototype.preloadImage = function (index, size, callback) {
            var _this = this;
            index = index ? index : this.selected;
            index = this.normalize(index);
            if (!this.files[index]) {
                this.log('invalid file index', { index: index });
                return;
            }
            if (this.files[index].loaded[size] === true) {
                return;
            }
            var img = new Image();
            img.src = this.files[index].source[size];
            img.addEventListener('load', function (event) {
                _this.afterLoad(index, size, img);
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
                if (this.files[index].loaded.large === true) {
                    return;
                }
                var large_1 = new Image();
                large_1.src = this.files[index].source.large;
                large_1.addEventListener('load', function (event) {
                    _this.afterLoad(index, 'large', large_1);
                });
            }
            else {
                if (this.files[index].loaded.medium === true) {
                    return;
                }
                var medium_1 = new Image();
                medium_1.src = this.files[index].source.medium;
                medium_1.addEventListener('load', function () {
                    _this.afterLoad(index, 'medium', medium_1);
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
            if (type === 'large') {
                this.files[index].width = image.width;
                this.files[index].height = image.height;
                this.files[index].name = this.getFilename(index, type);
                this.files[index].extension = this.getExtension(index, type);
                this.files[index].download = this.files[index].source.large;
            }
            this.files[index].loaded[type] = true;
            var data = { type: type, index: index, file: this.file, img: image };
            if (!this.first) {
                this.first = true;
                this.event(this.events.FIRST_IMAGE, data);
            }
            else {
                this.event(this.events.LOAD_IMAGE, data);
            }
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
                return this.files[this.selected].source.large;
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
                return 'asg-theme-' + this.options.theme + ' ' + this.id + (this.editing ? ' editing' : '');
            },
            enumerable: false,
            configurable: true
        });
        ServiceController.prototype.dynamicStyle = function (file, type, config) {
            var style = {};
            if (!file) {
                return style;
            }
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
            return style;
            if (!file) {
                return style;
            }
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
            if (file.source.lazy) {
                style['background-image'] = 'url(' + file.source.lazy + ')';
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
            var path = 'div.asg-container.' + this.id + ' .keyInput';
            var element = this.el(path)[0];
            this.log('set focus', [path, element]);
            if (element) {
                angular.element(element)[0]['focus']();
            }
        };
        ServiceController.prototype.containerFullSize = function () {
            var _this = this;
            if (!this.options.container.available) {
                return;
            }
            this.options.container.fullsize = true;
            this.options.container.visible = true;
            this.timeout(function () {
                _this.setFocus();
            }, 100);
            this.timeout(function () {
                _this.event(_this.events.MODAL_OPEN, { index: _this.selected });
            }, 460);
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
                if (this.files[key].source.large === filename) {
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
            var self = this;
            if (value === undefined || value === null) {
                self.log('invalid image value');
                return;
            }
            if (angular.isString(value) === true) {
                value = { source: { medium: value } };
            }
            var getAvailableSource = function (type, src) {
                if (src[type]) {
                    return self.getFullUrl(src[type]);
                }
                else {
                    if (type === 'small') {
                        type = 'medium';
                        if (src[type]) {
                            return self.getFullUrl(src[type]);
                        }
                    }
                    if (type === 'medium') {
                        type = 'large';
                        if (src[type]) {
                            return self.getFullUrl(src[type]);
                        }
                    }
                    if (type === 'large') {
                        type = 'medium';
                        if (src[type]) {
                            return self.getFullUrl(src[type]);
                        }
                    }
                    if (type === 'lazy') {
                        type = 'medium';
                        if (src[type]) {
                            return self.getFullUrl(src[type]);
                        }
                    }
                }
            };
            if (!value.source) {
                value.source = {
                    large: value[self.options.fields.source.large],
                    small: value[self.options.fields.source.small],
                    medium: value[self.options.fields.source.medium],
                    lazy: value[self.options.fields.source.lazy],
                };
            }
            var source = {
                large: getAvailableSource('large', value.source),
                small: getAvailableSource('small', value.source),
                medium: getAvailableSource('medium', value.source),
                lazy: getAvailableSource('lazy', value.source),
                color: value.color ? value.color : 'transparent',
            };
            var sizes = {
                large: '1920w',
                medium: '1024w',
                small: '480w',
            };
            if (!source.large) {
                self.log('invalid image data', { source: source, value: value });
                return;
            }
            if (source.large.indexOf(' ') > 0) {
                var parts_1 = source.large.split(' ');
                sizes.large = parts_1[1].trim();
                source.large = parts_1[0].trim();
            }
            if (source.medium.indexOf(' ') > 0) {
                var parts_2 = source.medium.split(' ');
                sizes.medium = parts_2[1].trim();
                source.medium = parts_2[0].trim();
            }
            if (source.small.indexOf(' ') > 0) {
                var parts_3 = source.small.split(' ');
                sizes.small = parts_3[1].trim();
                source.small = parts_3[0].trim();
            }
            var parts = source.large.split('/');
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
                index: index,
                source: source,
                sizes: sizes,
                title: title,
                subtitle: subtitle,
                description: description,
                video: video && video.vimeoId ? video : null,
                'class': value.class ? value.class : '',
                loaded: {
                    large: false,
                    medium: false,
                    small: false
                }
            };
            if (index !== undefined && this.files[index] !== undefined) {
                this.files[index] = file;
                return file;
            }
            else {
                if (self.options.duplicates !== true && this.findImage(file.source.large)) {
                    self.event(self.events.DOUBLE_IMAGE, file);
                    return;
                }
                this.files.push(file);
                file.index = this.files.length - 1;
                return file;
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
            file.loaded.small = true;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzZy50cyIsImFzZy1jb250YWluZXIudHMiLCJhc2ctY29udHJvbC50cyIsImFzZy1kZWJ1Zy50cyIsImFzZy1pbWFnZS1vbGQudHMiLCJhc2ctaW1hZ2UudHMiLCJhc2ctaW5mby50cyIsImFzZy1pdGVtLnRzIiwiYXNnLW1vZGFsLnRzIiwiYXNnLXBhbmVsLnRzIiwiYXNnLXNlcnZpY2UudHMiLCJhc2ctdGh1bWJuYWlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLElBQVUsbUJBQW1CLENBMkI1QjtBQTNCRCxXQUFVLG1CQUFtQjtJQUU1QixJQUFJLEdBQUcsR0FBZ0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBRXZGLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO1FBQ3RCLE9BQU8sVUFBVSxLQUFXLEVBQUUsU0FBa0I7WUFFL0MsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2pELE9BQU8sRUFBRSxDQUFDO2FBQ1Y7WUFFRCxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7Z0JBQ2hCLE9BQU8sR0FBRyxDQUFDO2FBQ1g7WUFFRCxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsRUFBRTtnQkFDckMsU0FBUyxHQUFHLENBQUMsQ0FBQzthQUNkO1lBRUQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUNsRCxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUV2RCxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxH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LEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRWpILENBQUM7OztXQUFBO1FBRUYsMEJBQUM7SUFBRCxDQXBKQSxBQW9KQyxJQUFBO0lBcEpZLHVDQUFtQixzQkFvSi9CLENBQUE7SUFFRCxJQUFJLEdBQUcsR0FBZSxPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFFNUQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUU7UUFDN0IsVUFBVSxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQztRQUNuSCxRQUFRLEVBQUUsb0tBQW9LO1FBQzlLLFFBQVEsRUFBRTtZQUNULEVBQUUsRUFBRSxHQUFHO1lBQ1AsS0FBSyxFQUFFLElBQUk7WUFDWCxPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFLElBQUk7WUFDYixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxJQUFJO1NBQ2I7S0FDRCxDQUFDLENBQUM7QUFFSixDQUFDLEVBeEtTLG1CQUFtQixLQUFuQixtQkFBbUIsUUF3SzVCIiwiZmlsZSI6ImFuZ3VsYXItc3VwZXItZ2FsbGVyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5uYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGxldCBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknLCBbJ25nQW5pbWF0ZScsICduZ1RvdWNoJ10pO1xyXG5cclxuXHRhcHAuZmlsdGVyKCdhc2dCeXRlcycsICgpID0+IHtcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoYnl0ZXMgOiBhbnksIHByZWNpc2lvbiA6IG51bWJlcikgOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0aWYgKGlzTmFOKHBhcnNlRmxvYXQoYnl0ZXMpKSB8fCAhaXNGaW5pdGUoYnl0ZXMpKSB7XHJcblx0XHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoYnl0ZXMgPT09IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gJzAnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodHlwZW9mIHByZWNpc2lvbiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRwcmVjaXNpb24gPSAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgdW5pdHMgPSBbJ2J5dGVzJywgJ2tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJ10sXHJcblx0XHRcdFx0bnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZygxMDI0KSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gKGJ5dGVzIC8gTWF0aC5wb3coMTAyNCwgTWF0aC5mbG9vcihudW1iZXIpKSkudG9GaXhlZChwcmVjaXNpb24pICsgJyAnICsgdW5pdHNbbnVtYmVyXTtcclxuXHJcblx0XHR9O1xyXG5cdH0pO1xyXG5cclxufVxyXG5cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xuXG5cdGV4cG9ydCBjbGFzcyBDb250YWluZXJDb250cm9sbGVyIHtcblxuXHRcdHB1YmxpYyBpZDogc3RyaW5nO1xuXHRcdHB1YmxpYyBvcHRpb25zOiBJT3B0aW9ucztcblx0XHRwdWJsaWMgaXRlbXM6IEFycmF5PElGaWxlPjtcblx0XHRwdWJsaWMgYmFzZVVybDogc3RyaW5nO1xuXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ2NvbnRhaW5lcic7XG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcblx0XHRwcml2YXRlIGFycm93c1Zpc2libGUgPSBmYWxzZTtcblxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxuXHRcdFx0cHJpdmF0ZSAkd2luZG93OiBuZy5JV2luZG93U2VydmljZSxcblx0XHRcdHByaXZhdGUgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXG5cdFx0XHRwcml2YXRlICRlbGVtZW50OiBuZy5JUm9vdEVsZW1lbnRTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSkge1xuXG5cdFx0XHR0aGlzLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnMgPyB0aGlzLm9wdGlvbnMgOiB7fTtcblxuXHRcdFx0YW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoJ3Jlc2l6ZScsIChldmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLm9uUmVzaXplKCk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblxuXHRcdHByaXZhdGUgb25SZXNpemUoKSB7XG5cblx0XHRcdGlmICh0aGlzLmNvbmZpZy5oZWlnaHRBdXRvLm9ucmVzaXplKSB7XG5cdFx0XHRcdHRoaXMuc2V0SGVpZ2h0KHRoaXMuYXNnLmZpbGUpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cHVibGljICRvbkluaXQoKSB7XG5cblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcblx0XHRcdHRoaXMuY29uZmlnLmF2YWlsYWJsZSA9IHRydWU7XG5cdFx0XHR0aGlzLmNvbmZpZy52aXNpYmxlRGVmYXVsdCA9IHRoaXMuY29uZmlnLnZpc2libGU7XG5cblx0XHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdFx0Ly8gc2V0IGltYWdlIGNvbXBvbmVudCBoZWlnaHRcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kb24odGhpcy5hc2cuZXZlbnRzLkZJUlNUX0lNQUdFICsgdGhpcy5pZCwgKGV2ZW50LCBkYXRhKSA9PiB7XG5cblx0XHRcdFx0aWYgKCF0aGlzLmNvbmZpZy5oZWlnaHQgJiYgdGhpcy5jb25maWcuaGVpZ2h0QXV0by5pbml0aWFsID09PSB0cnVlKSB7XG5cblx0XHRcdFx0XHR0aGlzLiR0aW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdHNlbGYuc2V0SGVpZ2h0KGRhdGEuaW1nKTtcblx0XHRcdFx0XHR9LCAxMDApO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBzY29wZSBhcHBseSB3aGVuIGltYWdlIGxvYWRlZFxuXHRcdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmFzZy5ldmVudHMuTE9BRF9JTUFHRSArIHRoaXMuaWQsIChldmVudCwgZGF0YSkgPT4ge1xuXHRcdFx0XHR0aGlzLiRzY29wZS4kYXBwbHkoKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0Ly8gc2V0IGltYWdlIGNvbXBvbmVudCBoZWlnaHRcblx0XHRwcml2YXRlIHNldEhlaWdodChpbWcpIHtcblxuXHRcdFx0bGV0IGVsID0gdGhpcy4kZWxlbWVudC5jaGlsZHJlbignZGl2JylbMF07XG5cblx0XHRcdGlmIChlbCkge1xuXHRcdFx0XHRsZXQgd2lkdGggPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCdkaXYnKVswXS5jbGllbnRXaWR0aDtcblx0XHRcdFx0bGV0IHJhdGlvID0gaW1nLndpZHRoIC8gaW1nLmhlaWdodDtcblx0XHRcdFx0dGhpcy5jb25maWcuaGVpZ2h0ID0gd2lkdGggLyByYXRpbztcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIGhlaWdodFxuXHRcdHB1YmxpYyBnZXQgaGVpZ2h0KCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcuaGVpZ2h0O1xuXG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBnZXRDbGFzcygpIHtcblxuXHRcdFx0aWYgKCF0aGlzLmNvbmZpZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBuZ0NsYXNzID0gW107XG5cblx0XHRcdGlmICh0aGlzLmNvbmZpZy5oZWFkZXIuZHluYW1pYykge1xuXHRcdFx0XHRuZ0NsYXNzLnB1c2goJ2R5bmFtaWMnKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmZ1bGxzaXplKSB7XG5cdFx0XHRcdG5nQ2xhc3MucHVzaCgnZnVsbHNpemUnKTtcblx0XHRcdH1cblxuXHRcdFx0bmdDbGFzcy5wdXNoKHRoaXMuYXNnLm9wdGlvbnMudGhlbWUpO1xuXG5cdFx0XHRyZXR1cm4gbmdDbGFzcy5qb2luKCcgJyk7XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgYWN0aW9uIGZyb20ga2V5Y29kZXNcblx0XHRwcml2YXRlIGdldEFjdGlvbkJ5S2V5Q29kZShrZXlDb2RlOiBudW1iZXIpIHtcblxuXHRcdFx0bGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5rZXljb2Rlcyk7XG5cdFx0XHRsZXQgYWN0aW9uO1xuXG5cdFx0XHRmb3IgKGxldCBrZXkgaW4ga2V5cykge1xuXG5cdFx0XHRcdGxldCBjb2RlcyA9IHRoaXMuY29uZmlnLmtleWNvZGVzW2tleXNba2V5XV07XG5cblx0XHRcdFx0aWYgKCFjb2Rlcykge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGluZGV4ID0gY29kZXMuaW5kZXhPZihrZXlDb2RlKTtcblxuXHRcdFx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0XHRcdGFjdGlvbiA9IGtleXNba2V5XTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBhY3Rpb247XG5cblx0XHR9XG5cblxuXHRcdHB1YmxpYyBjbG9zZSgkZXZlbnQ/OiBVSUV2ZW50KSB7XG5cblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xvc2UoKTtcblx0XHRcdHRoaXMuZXhpdEZ1bGxTY3JlZW4oKTtcblx0XHRcdHRoaXMudG9nZ2xlRnVsbFNpemUoKTtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyBpbWFnZUNsaWNrKCRldmVudD86IFVJRXZlbnQpIHtcblxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xuXG5cdFx0XHRpZiAodGhpcy5jb25maWcuY2xpY2suY2xvc2UpIHtcblx0XHRcdFx0dGhpcy50b2dnbGVGdWxsU2l6ZSgpO1xuXHRcdFx0XHR0aGlzLmV4aXRGdWxsU2NyZWVuKCk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgaG92ZXIoaW5kZXg6IG51bWJlciwgJGV2ZW50PzogTW91c2VFdmVudCkge1xuXG5cdFx0XHRpZiAodGhpcy5jb25maWcuYXJyb3dzLnByZWxvYWQgPT09IHRydWUpIHtcblx0XHRcdFx0dGhpcy5hc2cuaG92ZXJQcmVsb2FkKGluZGV4KTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHB1YmxpYyBzZXRGb2N1cygkZXZlbnQ/OiBVSUV2ZW50KSB7XG5cblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyBhdXRvUGxheVRvZ2dsZSgkZXZlbnQ/OiBVSUV2ZW50KSB7XG5cblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcblx0XHRcdHRoaXMuYXNnLmF1dG9QbGF5VG9nZ2xlKCk7XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgdG9GaXJzdChzdG9wPzogYm9vbGVhbiwgJGV2ZW50PzogVUlFdmVudCkge1xuXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XG5cdFx0XHR0aGlzLmFzZy50b0ZpcnN0KCk7XG5cdFx0XHR0aGlzLiRzY29wZS4kYXBwbHkoKTtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyB0b0JhY2t3YXJkKHN0b3A/OiBib29sZWFuLCAkZXZlbnQ/OiBVSUV2ZW50KSB7XG5cblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcblx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQoc3RvcCk7XG5cdFx0XHR0aGlzLiRzY29wZS4kYXBwbHkoKTtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyB0b0ZvcndhcmQoc3RvcD86IGJvb2xlYW4sICRldmVudD86IFVJRXZlbnQpIHtcblxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xuXHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHN0b3ApO1xuXHRcdFx0dGhpcy4kc2NvcGUuJGFwcGx5KCk7XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgdG9MYXN0KHN0b3A/OiBib29sZWFuLCAkZXZlbnQ/OiBVSUV2ZW50KSB7XG5cblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcblx0XHRcdHRoaXMuYXNnLnRvTGFzdChzdG9wKTtcblx0XHRcdHRoaXMuJHNjb3BlLiRhcHBseSgpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZG8ga2V5Ym9hcmQgYWN0aW9uXG5cdFx0cHVibGljIGtleVVwKGU6IEtleWJvYXJkRXZlbnQpIHtcblxuXHRcdFx0bGV0IGFjdGlvbjogc3RyaW5nID0gdGhpcy5nZXRBY3Rpb25CeUtleUNvZGUoZS5rZXlDb2RlKTtcblxuXHRcdFx0dGhpcy5hc2cubG9nKCdrZXkgdXAnLCBhY3Rpb24pO1xuXG5cdFx0XHRzd2l0Y2ggKGFjdGlvbikge1xuXG5cdFx0XHRcdGNhc2UgJ2V4aXQnOlxuXHRcdFx0XHRcdHRoaXMuY2xvc2UoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlICdwbGF5cGF1c2UnOlxuXHRcdFx0XHRcdHRoaXMuYXNnLmF1dG9QbGF5VG9nZ2xlKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAnZm9yd2FyZCc6XG5cdFx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ2JhY2t3YXJkJzpcblx0XHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ2ZpcnN0Jzpcblx0XHRcdFx0XHR0aGlzLmFzZy50b0ZpcnN0KHRydWUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ2xhc3QnOlxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvTGFzdCh0cnVlKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlICdmdWxsc2NyZWVuJzpcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUZ1bGxTY3JlZW4oKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlICdmdWxsc2l6ZSc6XG5cdFx0XHRcdFx0dGhpcy50b2dnbGVGdWxsU2l6ZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ21lbnUnOlxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTWVudSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ2NhcHRpb24nOlxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlQ2FwdGlvbigpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ2hlbHAnOlxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlSGVscCgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ3NpemUnOlxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlU2l6ZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ3RyYW5zaXRpb24nOlxuXHRcdFx0XHRcdHRoaXMubmV4dFRyYW5zaXRpb24oKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRoaXMuYXNnLmxvZygndW5rbm93biBrZXlib2FyZCBhY3Rpb246ICcgKyBlLmtleUNvZGUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblxuXHRcdC8vIHN3aXRjaCB0byBuZXh0IHRyYW5zaXRpb24gZWZmZWN0XG5cdFx0cHJpdmF0ZSBuZXh0VHJhbnNpdGlvbigkZXZlbnQ/OiBVSUV2ZW50KSB7XG5cblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcblx0XHRcdGxldCBpZHggPSB0aGlzLmFzZy50cmFuc2l0aW9ucy5pbmRleE9mKHRoaXMuY29uZmlnLnRyYW5zaXRpb24pICsgMTtcblx0XHRcdGxldCBuZXh0ID0gaWR4ID49IHRoaXMuYXNnLnRyYW5zaXRpb25zLmxlbmd0aCA/IDAgOiBpZHg7XG5cdFx0XHR0aGlzLmNvbmZpZy50cmFuc2l0aW9uID0gdGhpcy5hc2cudHJhbnNpdGlvbnNbbmV4dF07XG5cblx0XHR9XG5cblxuXHRcdC8vIHRvZ2dsZSBmdWxsc2l6ZVxuXHRcdHByaXZhdGUgdG9nZ2xlRnVsbFNpemUoJGV2ZW50PzogVUlFdmVudCkge1xuXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XG5cblx0XHRcdGlmICh0aGlzLmNvbmZpZy52aXNpYmxlRGVmYXVsdCkge1xuXHRcdFx0XHR0aGlzLmNvbmZpZy5mdWxsc2l6ZSA9ICF0aGlzLmNvbmZpZy5mdWxsc2l6ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuY29uZmlnLnZpc2libGUgPSAhdGhpcy5jb25maWcudmlzaWJsZTtcblxuXHRcdFx0XHRpZiAodGhpcy5hc2cuZmlsZS52aWRlbyAmJiB0aGlzLmFzZy5maWxlLnZpZGVvLnBsYXlpbmcpIHtcblx0XHRcdFx0XHR0aGlzLmFzZy5maWxlLnZpZGVvLnBsYXllci5wYXVzZSgpO1xuXHRcdFx0XHRcdHRoaXMuYXNnLmZpbGUudmlkZW8ucGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblxuXHRcdC8vIHRvZ2dsZSBmdWxsc2NyZWVuXG5cdFx0cHJpdmF0ZSB0b2dnbGVGdWxsU2NyZWVuKCRldmVudD86IFVJRXZlbnQpIHtcblxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xuXG5cdFx0XHRpZiAoIXRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwudG9nZ2xlKCk7XG5cblx0XHR9XG5cblx0XHQvLyBleGl0IGZ1bGxzY3JlZW5cblx0XHRwcml2YXRlIGV4aXRGdWxsU2NyZWVuKCkge1xuXG5cdFx0XHRpZiAoIXRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCF0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbC5pc0Z1bGxzY3JlZW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbC5leGl0KCk7XG5cblx0XHR9XG5cblx0XHQvLyB0b2dnbGUgdGh1bWJuYWlsc1xuXHRcdHByaXZhdGUgdG9nZ2xlVGh1bWJuYWlscygkZXZlbnQ/OiBVSUV2ZW50KSB7XG5cblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcblx0XHRcdHRoaXMuY29uZmlnLnRodW1ibmFpbC5keW5hbWljID0gIXRoaXMuY29uZmlnLnRodW1ibmFpbC5keW5hbWljO1xuXG5cdFx0XHRjb25zb2xlLmxvZyh0aGlzLmNvbmZpZy50aHVtYm5haWwpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gc2V0IHRyYW5zaXRpb24gZWZmZWN0XG5cdFx0cHVibGljIHNldFRyYW5zaXRpb24odHJhbnNpdGlvbiwgJGV2ZW50PzogVUlFdmVudCkge1xuXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XG5cdFx0XHR0aGlzLmNvbmZpZy50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcblxuXHRcdH1cblxuXHRcdC8vIHNldCB0aGVtZVxuXHRcdHB1YmxpYyBzZXRUaGVtZSh0aGVtZTogc3RyaW5nLCAkZXZlbnQ/OiBVSUV2ZW50KSB7XG5cblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnMudGhlbWUgPSB0aGVtZTtcblxuXHRcdH1cblxuXHRcdC8vIHRvZ2dsZSBoZWxwXG5cdFx0cHJpdmF0ZSB0b2dnbGVIZWxwKCRldmVudD86IFVJRXZlbnQpIHtcblxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xuXHRcdFx0dGhpcy5jb25maWcuaGVscCA9ICF0aGlzLmNvbmZpZy5oZWxwO1xuXG5cdFx0fVxuXG5cdFx0Ly8gdG9nZ2xlIHNpemVcblx0XHRwcml2YXRlIHRvZ2dsZVNpemUoJGV2ZW50PzogVUlFdmVudCkge1xuXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XG5cdFx0XHRsZXQgaW5kZXggPSB0aGlzLmFzZy5zaXplcy5pbmRleE9mKHRoaXMuY29uZmlnLnNpemUpO1xuXHRcdFx0aW5kZXggPSAoaW5kZXggKyAxKSA+PSB0aGlzLmFzZy5zaXplcy5sZW5ndGggPyAwIDogKytpbmRleDtcblx0XHRcdHRoaXMuY29uZmlnLnNpemUgPSB0aGlzLmFzZy5zaXplc1tpbmRleF07XG5cdFx0XHR0aGlzLmFzZy5sb2coJ3RvZ2dsZSBpbWFnZSBzaXplOicsIFt0aGlzLmNvbmZpZy5zaXplLCBpbmRleF0pO1xuXG5cdFx0fVxuXG5cdFx0Ly8gdG9nZ2xlIG1lbnVcblx0XHRwcml2YXRlIHRvZ2dsZU1lbnUoJGV2ZW50PzogVUlFdmVudCkge1xuXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XG5cdFx0XHR0aGlzLmNvbmZpZy5oZWFkZXIuZHluYW1pYyA9ICF0aGlzLmNvbmZpZy5oZWFkZXIuZHluYW1pYztcblxuXHRcdH1cblxuXHRcdC8vIHRvZ2dsZSBjYXB0aW9uXG5cdFx0cHJpdmF0ZSB0b2dnbGVDYXB0aW9uKCkge1xuXG5cdFx0XHR0aGlzLmNvbmZpZy5jYXB0aW9uLnZpc2libGUgPSAhdGhpcy5jb25maWcuY2FwdGlvbi52aXNpYmxlO1xuXG5cdFx0fVxuXG5cblx0XHRwdWJsaWMgcGxheVZpZGVvKCRldmVudDogVUlFdmVudCkge1xuXG5cdFx0XHRpZiAoJGV2ZW50KSB7XG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCF0aGlzLmFzZy5maWxlLnZpZGVvLnZpbWVvSWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRcdHRoaXMuYXNnLmZpbGUudmlkZW8udmlzaWJsZSA9IHRydWU7XG5cdFx0XHR0aGlzLmFzZy5maWxlLnZpZGVvLmh0bWxJZCA9ICdtb2RhbF92aW1lb192aWRlb18nICsgdGhpcy5hc2cuZmlsZS52aWRlby52aW1lb0lkO1xuXG5cdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0aWQ6IHRoaXMuYXNnLmZpbGUudmlkZW8udmltZW9JZCxcblx0XHRcdFx0cmVzcG9uc2l2ZTogdHJ1ZSxcblx0XHRcdFx0bG9vcDogZmFsc2Vcblx0XHRcdH07XG5cblx0XHRcdC8vIGNvbnNvbGUubG9nKCd2aWRlbycsICB0aGlzLmFzZy5maWxlLnZpZGVvKTtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCd2aW1lbyBvcHRpb25zJywgb3B0aW9ucyk7XG5cblx0XHRcdGlmICh0aGlzLmFzZy5maWxlLnZpZGVvLnBsYXllcikge1xuXHRcdFx0XHR2YXIgcGxheWVyID0gdGhpcy5hc2cuZmlsZS52aWRlby5wbGF5ZXI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgcGxheWVyID0gbmV3IFZpbWVvLlBsYXllcih0aGlzLmFzZy5maWxlLnZpZGVvLmh0bWxJZCwgb3B0aW9ucyk7XG5cdFx0XHR9XG5cblx0XHRcdHBsYXllci5zZXRWb2x1bWUoMC41KTtcblx0XHRcdHBsYXllci5wbGF5KCkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2Vycm9yIHBsYXlpbmcgdGhlIHZpZGVvOicsIGVycm9yKTtcblx0XHRcdH0pXG5cblx0XHRcdC8vIHBsYXllci5sb2FkVmlkZW8odGhpcy5hc2cuZmlsZS52aWRlby52aW1lb0lkKS50aGVuKGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHQvLyB9KTtcblxuXHRcdFx0cGxheWVyLm9uKCdwbGF5JywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzZWxmLmFzZy5maWxlLnZpZGVvLnBsYXlpbmcgPSB0cnVlO1xuXHRcdFx0XHRzZWxmLmFzZy5maWxlLnZpZGVvLnZpc2libGUgPSB0cnVlO1xuXHRcdFx0XHRzZWxmLiRzY29wZS4kYXBwbHkoKTtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygncGxheSB0aGUgdmlkZW8hJyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cGxheWVyLm9uKCdwYXVzZScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0c2VsZi5hc2cuZmlsZS52aWRlby5wbGF5aW5nID0gZmFsc2Vcblx0XHRcdFx0c2VsZi5hc2cuZmlsZS52aWRlby52aXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdHNlbGYuJHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdwYXVzZWQgdGhlIHZpZGVvIScpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuYXNnLmZpbGUudmlkZW8ucGxheWVyID0gcGxheWVyO1xuXHRcdFx0dGhpcy5hc2cuZmlsZS52aWRlby5wbGF5aW5nID0gdHJ1ZTtcblxuXHRcdH1cblxuXHRcdC8vIGdldCBtYXJnaW50IHRvcFxuXHRcdHB1YmxpYyBnZXQgbWFyZ2luVG9wKCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcubWFyZ2luVG9wO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IG1hcmdpbiBib3R0b21cblx0XHRwdWJsaWMgZ2V0IG1hcmdpbkJvdHRvbSgpIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLm1hcmdpbkJvdHRvbTtcblxuXHRcdH1cblxuXHRcdC8vIGdldCBtb2RhbCB2aXNpYmxlXG5cdFx0cHVibGljIGdldCB2aXNpYmxlKCkge1xuXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLnZpc2libGU7XG5cblx0XHR9XG5cblx0XHQvLyBzZXQgbW9kYWwgdmlzaWJsZVxuXHRcdHB1YmxpYyBzZXQgdmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xuXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5jb25maWcudmlzaWJsZSA9IHZhbHVlO1xuXHRcdFx0dGhpcy5hc2cuc2V0SGFzaCgpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2OiBudW1iZXIpIHtcblxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcblxuXHRcdH1cblxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XG5cblx0XHRcdGlmICghdGhpcy5hc2cpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgY29udGFpbmVyIGNvbmZpZ1xuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCk6IElPcHRpb25zQ29udGFpbmVyIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcblxuXHRcdH1cblxuXHRcdC8vIHNldCBjb250YWluZXIgY29uZmlnXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWU6IElPcHRpb25zQ29udGFpbmVyKSB7XG5cblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xuXG5cdFx0fVxuXG5cdH1cblxuXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xuXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0NvbnRhaW5lcicsIHtcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHdpbmRvdycsICckcm9vdFNjb3BlJywgJyRlbGVtZW50JywgJyR0aW1lb3V0JywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuQ29udGFpbmVyQ29udHJvbGxlcl0sXG5cdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXNnLWNvbnRhaW5lci5odG1sJyxcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxuXHRcdGJpbmRpbmdzOiB7XG5cdFx0XHRpZDogJ0A/Jyxcblx0XHRcdGl0ZW1zOiAnPT8nLFxuXHRcdFx0b3B0aW9uczogJz0/Jyxcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxuXHRcdFx0dmlzaWJsZTogJz0/Jyxcblx0XHRcdGJhc2VVcmw6ICdAPydcblx0XHR9XG5cdH0pO1xuXG59XG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBDb250cm9sQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIHR5cGUgPSAnY29udHJvbCc7XHJcblx0XHRwcml2YXRlIGFzZzogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZTtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihcclxuXHRcdFx0cHJpdmF0ZSBzZXJ2aWNlOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBJU2NvcGUpIHtcclxuXHJcblx0XHRcdHRoaXMudGVtcGxhdGUgPSAnL3ZpZXdzL2FzZy1jb250cm9sLmh0bWwnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdFx0dGhpcy4kc2NvcGUuZm9yd2FyZCA9ICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQodHJ1ZSk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR0aGlzLiRzY29wZS5iYWNrd2FyZCA9ICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IGltYWdlIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKTogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZTogSU9wdGlvbnNJbWFnZSkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2OiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0NvbnRyb2wnLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5Db250cm9sQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctY29udHJvbCB7eyAkY3RybC5hc2cuY2xhc3NlcyB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiAnQD8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgRGVidWdDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcclxuXHRcdHByaXZhdGUgYXNnOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblx0XHRwcml2YXRlIHR5cGU7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKFxyXG5cdFx0XHRwcml2YXRlIHNlcnZpY2U6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0cHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdFx0dGhpcy50eXBlID0gJ2luZm8nO1xyXG5cdFx0XHR0aGlzLnRlbXBsYXRlID0gJy92aWV3cy9hc2ctZGVidWcuaHRtbCc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLmZpbGU7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0RlYnVnJywge1xyXG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuRGVidWdDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImFzZy1kZWJ1ZyB7eyAkY3RybC5hc2cuY2xhc3NlcyB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwidmFyIFZpbWVvO1xuXG5uYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XG5cblx0ZXhwb3J0IGNsYXNzIEltYWdlT2xkQ29udHJvbGxlciB7XG5cblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcblx0XHRwdWJsaWMgb3B0aW9uczogSU9wdGlvbnM7XG5cdFx0cHVibGljIGl0ZW1zOiBBcnJheTxJRmlsZT47XG5cdFx0cHVibGljIGJhc2VVcmw6IHN0cmluZztcblxuXHRcdHByaXZhdGUgdHlwZSA9ICdpbWFnZSc7XG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcblxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxuXHRcdFx0cHJpdmF0ZSAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcblx0XHRcdHByaXZhdGUgJGVsZW1lbnQ6IG5nLklSb290RWxlbWVudFNlcnZpY2UsXG5cdFx0XHRwcml2YXRlICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXG5cdFx0XHRwcml2YXRlICR3aW5kb3c6IG5nLklXaW5kb3dTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSkge1xuXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCgncmVzaXplJywgKGV2ZW50KSA9PiB7XG5cdFx0XHRcdHRoaXMub25SZXNpemUoKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBvblJlc2l6ZSgpIHtcblxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhlaWdodEF1dG8ub25yZXNpemUpIHtcblx0XHRcdFx0dGhpcy5zZXRIZWlnaHQodGhpcy5hc2cuZmlsZSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcblxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2Vcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xuXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRcdC8vIHNldCBpbWFnZSBjb21wb25lbnQgaGVpZ2h0XG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJG9uKHRoaXMuYXNnLmV2ZW50cy5GSVJTVF9JTUFHRSArIHRoaXMuaWQsIChldmVudCwgZGF0YSkgPT4ge1xuXG5cdFx0XHRcdGlmICghdGhpcy5jb25maWcuaGVpZ2h0ICYmIHRoaXMuY29uZmlnLmhlaWdodEF1dG8uaW5pdGlhbCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHRoaXMuJHRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0c2VsZi5zZXRIZWlnaHQoZGF0YS5pbWcpO1xuXHRcdFx0XHRcdH0sIDEwKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gc2NvcGUgYXBwbHkgd2hlbiBpbWFnZSBsb2FkZWRcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kb24odGhpcy5hc2cuZXZlbnRzLkxPQURfSU1BR0UgKyB0aGlzLmlkLCAoZXZlbnQsIGRhdGEpID0+IHtcblxuXHRcdFx0XHR0aGlzLiRzY29wZS4kYXBwbHkoKTtcblxuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0XHQvLyBzZXQgaW1hZ2UgY29tcG9uZW50IGhlaWdodFxuXHRcdHByaXZhdGUgc2V0SGVpZ2h0KGltZykge1xuXG5cdFx0XHRsZXQgd2lkdGggPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCdkaXYnKVswXS5jbGllbnRXaWR0aDtcblx0XHRcdGxldCByYXRpbyA9IGltZy53aWR0aCAvIGltZy5oZWlnaHQ7XG5cdFx0XHR0aGlzLmNvbmZpZy5oZWlnaHQgPSB3aWR0aCAvIHJhdGlvO1xuXG5cdFx0fVxuXG5cdFx0Ly8gaGVpZ2h0XG5cdFx0cHVibGljIGdldCBoZWlnaHQoKSB7XG5cblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5oZWlnaHQ7XG5cblx0XHR9XG5cblxuXHRcdC8vIGdldCBpbWFnZSBjb25maWdcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpOiBJT3B0aW9uc0ltYWdlIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcblxuXHRcdH1cblxuXHRcdC8vIHNldCBpbWFnZSBjb25maWdcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZTogSU9wdGlvbnNJbWFnZSkge1xuXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyB0b0JhY2t3YXJkKHN0b3A/OiBib29sZWFuLCAkZXZlbnQ/OiBVSUV2ZW50KSB7XG5cblx0XHRcdGlmICgkZXZlbnQpIHtcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHN0b3ApO1xuXG5cdFx0fVxuXG5cdFx0cHVibGljIHRvRm9yd2FyZChzdG9wPzogYm9vbGVhbiwgJGV2ZW50PzogVUlFdmVudCkge1xuXG5cdFx0XHRpZiAoJGV2ZW50KSB7XG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHN0b3ApO1xuXG5cdFx0fVxuXG5cdFx0cHVibGljIGhvdmVyKGluZGV4OiBudW1iZXIsICRldmVudD86IE1vdXNlRXZlbnQpIHtcblxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmFycm93cy5wcmVsb2FkID09PSB0cnVlKSB7XG5cdFx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Vcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHY6IG51bWJlcikge1xuXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcblxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcblxuXHRcdH1cblxuXHRcdC8vIG1vZGFsIGF2YWlsYWJsZVxuXHRcdHB1YmxpYyBnZXQgbW9kYWxBdmFpbGFibGUoKSB7XG5cblx0XHRcdHJldHVybiB0aGlzLmFzZy5tb2RhbEF2YWlsYWJsZSAmJiB0aGlzLmNvbmZpZy5jbGljay5tb2RhbDtcblxuXHRcdH1cblxuXHRcdC8vIG9wZW4gdGhlIG1vZGFsXG5cdFx0cHVibGljIG1vZGFsT3BlbigkZXZlbnQ6IFVJRXZlbnQpIHtcblxuXHRcdFx0aWYgKCRldmVudCkge1xuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5tb2RhbCkge1xuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbE9wZW4odGhpcy5hc2cuc2VsZWN0ZWQpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cHVibGljIHBsYXlWaWRlbygkZXZlbnQ6IFVJRXZlbnQpIHtcblxuXHRcdFx0aWYgKCRldmVudCkge1xuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdFx0dGhpcy5hc2cuZmlsZS52aWRlby52aXNpYmxlID0gdHJ1ZTtcblx0XHRcdHRoaXMuYXNnLmZpbGUudmlkZW8uaHRtbElkID0gJ3ZpbWVvX3ZpZGVvXycgKyB0aGlzLmFzZy5maWxlLnZpZGVvLnZpbWVvSWQ7XG5cblx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRpZDogdGhpcy5hc2cuZmlsZS52aWRlby52aW1lb0lkLFxuXHRcdFx0XHRyZXNwb25zaXZlOiB0cnVlLFxuXHRcdFx0XHRsb29wOiBmYWxzZVxuXHRcdFx0fTtcblxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ3ZpZGVvJywgIHRoaXMuYXNnLmZpbGUudmlkZW8pO1xuXHRcdFx0Ly8gY29uc29sZS5sb2coJ3ZpbWVvIG9wdGlvbnMnLCBvcHRpb25zKTtcblxuXHRcdFx0aWYgKHRoaXMuYXNnLmZpbGUudmlkZW8ucGxheWVyKSB7XG5cdFx0XHRcdHZhciBwbGF5ZXIgPSB0aGlzLmFzZy5maWxlLnZpZGVvLnBsYXllcjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBwbGF5ZXIgPSBuZXcgVmltZW8uUGxheWVyKHRoaXMuYXNnLmZpbGUudmlkZW8uaHRtbElkLCBvcHRpb25zKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gcGxheWVyLmxvYWRWaWRlbyh0aGlzLmFzZy5maWxlLnZpZGVvLnZpbWVvSWQpLnRoZW4oZnVuY3Rpb24oaWQpIHtcblxuXHRcdFx0Ly8gfSlcblxuXHRcdFx0cGxheWVyLnNldFZvbHVtZSgwLjUpO1xuXG5cdFx0XHRwbGF5ZXIucGxheSgpLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdlcnJvciBwbGF5aW5nIHRoZSB2aWRlbzonLCBlcnJvcik7XG5cdFx0XHR9KVxuXG5cdFx0XHRwbGF5ZXIub24oJ3BsYXknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0c2VsZi5hc2cuZmlsZS52aWRlby5wbGF5aW5nID0gdHJ1ZTtcblx0XHRcdFx0c2VsZi5hc2cuZmlsZS52aWRlby52aXNpYmxlID0gdHJ1ZTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ3BsYXkgdGhlIHZpZGVvIScpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHBsYXllci5vbigncGF1c2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0c2VsZi5hc2cuZmlsZS52aWRlby5wbGF5aW5nID0gZmFsc2Vcblx0XHRcdFx0c2VsZi5hc2cuZmlsZS52aWRlby52aXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdwYXVzZWQgdGhlIHZpZGVvIScpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuYXNnLmZpbGUudmlkZW8ucGxheWVyID0gcGxheWVyO1xuXHRcdFx0dGhpcy5hc2cuZmlsZS52aWRlby5wbGF5aW5nID0gdHJ1ZTtcblxuXHRcdH1cblxuXHR9XG5cblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XG5cblx0YXBwLmNvbXBvbmVudCgnYXNnSW1hZ2VPbGQnLCB7XG5cdFx0Y29udHJvbGxlcjogWydhc2dTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnJGVsZW1lbnQnLCAnJHRpbWVvdXQnLCAnJHdpbmRvdycsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LkltYWdlT2xkQ29udHJvbGxlcl0sXG5cdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXNnLWltYWdlLW9sZC5odG1sJyxcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxuXHRcdGJpbmRpbmdzOiB7XG5cdFx0XHRpZDogJ0A/Jyxcblx0XHRcdGl0ZW1zOiAnPT8nLFxuXHRcdFx0b3B0aW9uczogJz0/Jyxcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxuXHRcdFx0YmFzZVVybDogJ0A/J1xuXHRcdH1cblx0fSk7XG5cblxufVxuIiwidmFyIFZpbWVvO1xuXG5uYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XG5cblx0ZXhwb3J0IGNsYXNzIEltYWdlQ29udHJvbGxlciB7XG5cblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcblx0XHRwdWJsaWMgb3B0aW9uczogSU9wdGlvbnMgPSB7fTtcblx0XHRwdWJsaWMgYmFzZVVybDogc3RyaW5nID0gJyc7XG5cdFx0cHVibGljIGl0ZW06IElGaWxlO1xuXHRcdHB1YmxpYyBmaWxlOiBJRmlsZTtcblx0XHRwdWJsaWMgaW5kZXg6IG51bWJlcjtcblxuXHRcdHByaXZhdGUgdHlwZSA9ICdpbWFnZSc7XG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcblxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxuXHRcdFx0cHJpdmF0ZSAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcblx0XHRcdHByaXZhdGUgJGVsZW1lbnQ6IG5nLklSb290RWxlbWVudFNlcnZpY2UsXG5cdFx0XHRwcml2YXRlICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXG5cdFx0XHRwcml2YXRlICR3aW5kb3c6IG5nLklXaW5kb3dTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSkge1xuXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCgncmVzaXplJywgKGV2ZW50KSA9PiB7XG5cdFx0XHRcdHRoaXMub25SZXNpemUoKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBvblJlc2l6ZSgpIHtcblxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhlaWdodEF1dG8ub25yZXNpemUpIHtcblx0XHRcdFx0dGhpcy5zZXRIZWlnaHQodGhpcy5hc2cuZmlsZSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcblxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2Vcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xuXHRcdFx0dGhpcy5jb25maWcuYXZhaWxhYmxlID0gdHJ1ZTtcblxuXHRcdFx0Ly8gc2NvcGUgYXBwbHkgd2hlbiBpbWFnZSBsb2FkZWRcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kb24odGhpcy5hc2cuZXZlbnRzLkxPQURfSU1BR0UgKyB0aGlzLmlkLCAoZXZlbnQsIGRhdGEpID0+IHtcblx0XHRcdFx0dGhpcy4kc2NvcGUuJGFwcGx5KCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKHRoaXMuaW5kZXgpIHtcblx0XHRcdFx0dGhpcy5maWxlID0gdGhpcy5hc2cuZmlsZXNbdGhpcy5pbmRleF0gPyB0aGlzLmFzZy5maWxlc1t0aGlzLmluZGV4XSA6IHVuZGVmaW5lZDtcblxuXHRcdFx0XHRjb25zb2xlLmxvZygnaW1hZ2UgaW5kZXgnLCB0aGlzLmluZGV4KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuaXRlbSkge1xuXHRcdFx0XHR0aGlzLmZpbGUgPSB0aGlzLmFzZy5hZGRJbWFnZSh0aGlzLml0ZW0pO1xuXHRcdFx0XHR0aGlzLmluZGV4ID0gdGhpcy5maWxlLmluZGV4O1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gc2V0IGltYWdlIGNvbXBvbmVudCBoZWlnaHRcblx0XHRwcml2YXRlIHNldEhlaWdodChpbWcpIHtcblxuXHRcdFx0bGV0IHdpZHRoID0gdGhpcy4kZWxlbWVudC5jaGlsZHJlbignZGl2JylbMF0uY2xpZW50V2lkdGg7XG5cdFx0XHRsZXQgcmF0aW8gPSBpbWcud2lkdGggLyBpbWcuaGVpZ2h0O1xuXHRcdFx0dGhpcy5jb25maWcuaGVpZ2h0ID0gd2lkdGggLyByYXRpbztcblxuXHRcdH1cblxuXHRcdC8vIGhlaWdodFxuXHRcdHB1YmxpYyBnZXQgaGVpZ2h0KCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcuaGVpZ2h0O1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IGltYWdlIGNvbmZpZ1xuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCk6IElPcHRpb25zSW1hZ2Uge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xuXG5cdFx0fVxuXG5cdFx0Ly8gc2V0IGltYWdlIGNvbmZpZ1xuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlOiBJT3B0aW9uc0ltYWdlKSB7XG5cblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xuXG5cdFx0fVxuXG5cdFx0cHVibGljIGhvdmVyKGluZGV4OiBudW1iZXIsICRldmVudD86IE1vdXNlRXZlbnQpIHtcblxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmFycm93cy5wcmVsb2FkID09PSB0cnVlKSB7XG5cdFx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Vcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHY6IG51bWJlcikge1xuXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcblxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzLmFzZy5zZWxlY3RlZDtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyBjb250YWluZXJBY3Rpb24oJGV2ZW50OiBVSUV2ZW50KSB7XG5cblx0XHRcdGlmICgkZXZlbnQpIHtcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXRoaXMuYXNnLm9wdGlvbnMuY29udGFpbmVyLmF2YWlsYWJsZSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKHRoaXMuZmlsZS5pbmRleCk7XG5cblx0XHRcdGlmICh0aGlzLmFzZy5vcHRpb25zLmNvbnRhaW5lci5mdWxsc2l6ZSkge1xuXHRcdFx0XHR0aGlzLmFzZy5jb250YWluZXJGdWxsU2l6ZSgpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH1cblxuXHRsZXQgYXBwOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcblxuXHRhcHAuY29tcG9uZW50KCdhc2dJbWFnZScsIHtcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHJvb3RTY29wZScsICckZWxlbWVudCcsICckdGltZW91dCcsICckd2luZG93JywgJyRzY29wZScsIGFuZ3VsYXJTdXBlckdhbGxlcnkuSW1hZ2VDb250cm9sbGVyXSxcblx0XHR0ZW1wbGF0ZVVybDogJy92aWV3cy9hc2ctaW1hZ2UuaHRtbCcsXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcblx0XHRiaW5kaW5nczoge1xuXHRcdFx0aWQ6ICdAPycsXG5cdFx0XHRpdGVtOiAnPT8nLFxuXHRcdFx0aW5kZXg6ICc9PycsXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXG5cdFx0XHRiYXNlVXJsOiAnQD8nXG5cdFx0fVxuXHR9KTtcblxuXG59XG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBJbmZvQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIGFzZzogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSB0eXBlO1xyXG5cdFx0cHJpdmF0ZSB0ZW1wbGF0ZTtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihcclxuXHRcdFx0cHJpdmF0ZSBzZXJ2aWNlOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHRcdHRoaXMudHlwZSA9ICdpbmZvJztcclxuXHRcdFx0dGhpcy50ZW1wbGF0ZSA9ICcvdmlld3MvYXNnLWluZm8uaHRtbCc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLmZpbGU7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoJ2FzZ0luZm8nLCB7XHJcblx0XHRjb250cm9sbGVyOiBbJ2FzZ1NlcnZpY2UnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5JbmZvQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctaW5mbyB7eyAkY3RybC5hc2cuY2xhc3NlcyB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0A/JyxcclxuXHRcdFx0dGVtcGxhdGU6ICdAPydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuIiwidmFyIFZpbWVvO1xuXG5uYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XG5cblx0ZXhwb3J0IGNsYXNzIEl0ZW1Db250cm9sbGVyIHtcblxuXHRcdHB1YmxpYyBpZDogc3RyaW5nO1xuXHRcdHB1YmxpYyBpdGVtOiBJRmlsZTtcblx0XHRwdWJsaWMgZmlsZTogSUZpbGU7XG5cblx0XHRwcml2YXRlIHR5cGUgPSAnaXRlbSc7XG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcblxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZTogSVNlcnZpY2VDb250cm9sbGVyLFxuXHRcdFx0cHJpdmF0ZSAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcblx0XHRcdHByaXZhdGUgJGVsZW1lbnQ6IG5nLklSb290RWxlbWVudFNlcnZpY2UsXG5cdFx0XHRwcml2YXRlICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXG5cdFx0XHRwcml2YXRlICR3aW5kb3c6IG5nLklXaW5kb3dTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSkge1xuXG5cdFx0fVxuXG5cdFx0cHVibGljICRvbkluaXQoKSB7XG5cblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcblxuXHRcdFx0aWYgKHRoaXMuaXRlbSkge1xuXHRcdFx0XHR0aGlzLmZpbGUgPSB0aGlzLmFzZy5hZGRJbWFnZSh0aGlzLml0ZW0pO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IGltYWdlIGNvbmZpZ1xuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCk6IElPcHRpb25zSW1hZ2Uge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xuXG5cdFx0fVxuXG5cdFx0Ly8gc2V0IGltYWdlIGNvbmZpZ1xuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlOiBJT3B0aW9uc0ltYWdlKSB7XG5cblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xuXG5cdFx0fVxuXG5cdFx0cHVibGljIHByZWxvYWQoJGV2ZW50OiBNb3VzZUV2ZW50LCBzaXplIDogc3RyaW5nKSB7XG5cblx0XHRcdGlmICgkZXZlbnQpIHtcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmFzZy5wcmVsb2FkSW1hZ2UodGhpcy5maWxlLmluZGV4LCBzaXplKTtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyBjbGljaygkZXZlbnQ6IFVJRXZlbnQpIHtcblxuXHRcdFx0aWYgKCRldmVudCkge1xuXHRcdFx0XHQkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKHRoaXMuZmlsZS5pbmRleCk7XG5cblx0XHRcdGlmICh0aGlzLmFzZy5vcHRpb25zLmNvbnRhaW5lci5mdWxsc2l6ZSkge1xuXHRcdFx0XHR0aGlzLmFzZy5jb250YWluZXJGdWxsU2l6ZSgpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH1cblxuXHRsZXQgYXBwOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcblxuXHRhcHAuY29tcG9uZW50KCdhc2dJdGVtJywge1xuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckcm9vdFNjb3BlJywgJyRlbGVtZW50JywgJyR0aW1lb3V0JywgJyR3aW5kb3cnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5JdGVtQ29udHJvbGxlcl0sXG5cdFx0dGVtcGxhdGVVcmw6ICcvdmlld3MvYXNnLWl0ZW0uaHRtbCcsXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcblx0XHRiaW5kaW5nczoge1xuXHRcdFx0aWQ6ICdAPycsXG5cdFx0XHRpdGVtOiAnPT8nLFxuXHRcdH1cblx0fSk7XG5cblxufVxuIiwibmFtZXNwYWNlIGFuZ3VsYXJTdXBlckdhbGxlcnkge1xuXG5cdGV4cG9ydCBjbGFzcyBNb2RhbENvbnRyb2xsZXIge1xuXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xuXHRcdHB1YmxpYyBvcHRpb25zIDogSU9wdGlvbnM7XG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xuXHRcdHB1YmxpYyBiYXNlVXJsIDogc3RyaW5nO1xuXG5cdFx0cHJpdmF0ZSB0eXBlID0gJ21vZGFsJztcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcblx0XHRwcml2YXRlIGFycm93c1Zpc2libGUgPSBmYWxzZTtcblxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcblx0XHRcdFx0XHRwcml2YXRlICR3aW5kb3cgOiBuZy5JV2luZG93U2VydmljZSxcblx0XHRcdFx0XHRwcml2YXRlICRyb290U2NvcGUgOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcblx0XHRcdFx0XHRwcml2YXRlICRzY29wZSA6IG5nLklTY29wZSkge1xuXG5cdFx0fVxuXG5cblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcblxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2Vcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xuXHRcdFx0dGhpcy5hc2cubW9kYWxBdmFpbGFibGUgPSB0cnVlO1xuXG5cdFx0XHQvLyBzY29wZSBhcHBseSB3aGVuIGltYWdlIGxvYWRlZFxuXHRcdFx0dGhpcy4kcm9vdFNjb3BlLiRvbih0aGlzLmFzZy5ldmVudHMuTE9BRF9JTUFHRSArIHRoaXMuaWQsIChldmVudCwgZGF0YSkgPT4ge1xuXHRcdFx0XHR0aGlzLiRzY29wZS4kYXBwbHkoKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cblx0XHRwcml2YXRlIGdldENsYXNzKCkge1xuXG5cdFx0XHRpZiAoIXRoaXMuY29uZmlnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IG5nQ2xhc3MgPSBbXTtcblxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhlYWRlci5keW5hbWljKSB7XG5cdFx0XHRcdG5nQ2xhc3MucHVzaCgnZHluYW1pYycpO1xuXHRcdFx0fVxuXG5cdFx0XHRuZ0NsYXNzLnB1c2godGhpcy5hc2cub3B0aW9ucy50aGVtZSk7XG5cblx0XHRcdHJldHVybiBuZ0NsYXNzLmpvaW4oJyAnKTtcblxuXHRcdH1cblxuXHRcdC8vIGdldCBhY3Rpb24gZnJvbSBrZXljb2Rlc1xuXHRcdHByaXZhdGUgZ2V0QWN0aW9uQnlLZXlDb2RlKGtleUNvZGUgOiBudW1iZXIpIHtcblxuXHRcdFx0bGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5rZXljb2Rlcyk7XG5cdFx0XHRsZXQgYWN0aW9uO1xuXG5cdFx0XHRmb3IgKGxldCBrZXkgaW4ga2V5cykge1xuXG5cdFx0XHRcdGxldCBjb2RlcyA9IHRoaXMuY29uZmlnLmtleWNvZGVzW2tleXNba2V5XV07XG5cblx0XHRcdFx0aWYgKCFjb2Rlcykge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGluZGV4ID0gY29kZXMuaW5kZXhPZihrZXlDb2RlKTtcblxuXHRcdFx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0XHRcdGFjdGlvbiA9IGtleXNba2V5XTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBhY3Rpb247XG5cblx0XHR9XG5cblxuXHRcdHB1YmxpYyBjbG9zZSgkZXZlbnQ/IDogVUlFdmVudCkge1xuXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsb3NlKCk7XG5cdFx0XHR0aGlzLmV4aXRGdWxsU2NyZWVuKCk7XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgaW1hZ2VDbGljaygkZXZlbnQ/IDogVUlFdmVudCkge1xuXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XG5cblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5jbG9zZSkge1xuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbENsb3NlKCk7XG5cdFx0XHRcdHRoaXMuZXhpdEZ1bGxTY3JlZW4oKTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHB1YmxpYyBob3ZlcihpbmRleCA6IG51bWJlciwgJGV2ZW50PyA6IE1vdXNlRXZlbnQpIHtcblxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmFycm93cy5wcmVsb2FkID09PSB0cnVlKSB7XG5cdFx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgc2V0Rm9jdXMoJGV2ZW50PyA6IFVJRXZlbnQpIHtcblxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xuXG5cdFx0fVxuXG5cdFx0cHVibGljIGF1dG9QbGF5VG9nZ2xlKCRldmVudD8gOiBVSUV2ZW50KSB7XG5cblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcblx0XHRcdHRoaXMuYXNnLmF1dG9QbGF5VG9nZ2xlKCk7XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgdG9GaXJzdChzdG9wPyA6IGJvb2xlYW4sICRldmVudD8gOiBVSUV2ZW50KSB7XG5cblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcblx0XHRcdHRoaXMuYXNnLnRvRmlyc3QoKTtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyB0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcblxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xuXHRcdFx0dGhpcy5hc2cudG9CYWNrd2FyZChzdG9wKTtcblxuXHRcdH1cblxuXHRcdHB1YmxpYyB0b0ZvcndhcmQoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xuXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XG5cdFx0XHR0aGlzLmFzZy50b0ZvcndhcmQoc3RvcCk7XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgdG9MYXN0KHN0b3A/IDogYm9vbGVhbiwgJGV2ZW50PyA6IFVJRXZlbnQpIHtcblxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xuXHRcdFx0dGhpcy5hc2cudG9MYXN0KHN0b3ApO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZG8ga2V5Ym9hcmQgYWN0aW9uXG5cdFx0cHVibGljIGtleVVwKGUgOiBLZXlib2FyZEV2ZW50KSB7XG5cblx0XHRcdGxldCBhY3Rpb24gOiBzdHJpbmcgPSB0aGlzLmdldEFjdGlvbkJ5S2V5Q29kZShlLmtleUNvZGUpO1xuXG5cdFx0XHRzd2l0Y2ggKGFjdGlvbikge1xuXG5cdFx0XHRcdGNhc2UgJ2V4aXQnOlxuXHRcdFx0XHRcdHRoaXMuY2xvc2UoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlICdwbGF5cGF1c2UnOlxuXHRcdFx0XHRcdHRoaXMuYXNnLmF1dG9QbGF5VG9nZ2xlKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAnZm9yd2FyZCc6XG5cdFx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ2JhY2t3YXJkJzpcblx0XHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ2ZpcnN0Jzpcblx0XHRcdFx0XHR0aGlzLmFzZy50b0ZpcnN0KHRydWUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ2xhc3QnOlxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvTGFzdCh0cnVlKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlICdmdWxsc2NyZWVuJzpcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUZ1bGxTY3JlZW4oKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlICdtZW51Jzpcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1lbnUoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlICdjYXB0aW9uJzpcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUNhcHRpb24oKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlICdoZWxwJzpcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUhlbHAoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlICdzaXplJzpcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZVNpemUoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlICd0cmFuc2l0aW9uJzpcblx0XHRcdFx0XHR0aGlzLm5leHRUcmFuc2l0aW9uKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aGlzLmFzZy5sb2coJ3Vua25vd24ga2V5Ym9hcmQgYWN0aW9uOiAnICsgZS5rZXlDb2RlKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cblx0XHQvLyBzd2l0Y2ggdG8gbmV4dCB0cmFuc2l0aW9uIGVmZmVjdFxuXHRcdHByaXZhdGUgbmV4dFRyYW5zaXRpb24oJGV2ZW50PyA6IFVJRXZlbnQpIHtcblxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xuXHRcdFx0bGV0IGlkeCA9IHRoaXMuYXNnLnRyYW5zaXRpb25zLmluZGV4T2YodGhpcy5jb25maWcudHJhbnNpdGlvbikgKyAxO1xuXHRcdFx0bGV0IG5leHQgPSBpZHggPj0gdGhpcy5hc2cudHJhbnNpdGlvbnMubGVuZ3RoID8gMCA6IGlkeDtcblx0XHRcdHRoaXMuY29uZmlnLnRyYW5zaXRpb24gPSB0aGlzLmFzZy50cmFuc2l0aW9uc1tuZXh0XTtcblxuXHRcdH1cblxuXHRcdC8vIHRvZ2dsZSBmdWxsc2NyZWVuXG5cdFx0cHJpdmF0ZSB0b2dnbGVGdWxsU2NyZWVuKCRldmVudD8gOiBVSUV2ZW50KSB7XG5cblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcblxuXHRcdFx0aWYgKCF0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsLnRvZ2dsZSgpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZXhpdCBmdWxsc2NyZWVuXG5cdFx0cHJpdmF0ZSBleGl0RnVsbFNjcmVlbigpIHtcblxuXHRcdFx0aWYgKCF0aGlzLiR3aW5kb3cuc2NyZWVuZnVsbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICghdGhpcy4kd2luZG93LnNjcmVlbmZ1bGwuaXNGdWxsc2NyZWVuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4kd2luZG93LnNjcmVlbmZ1bGwuZXhpdCgpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gdG9nZ2xlIHRodW1ibmFpbHNcblx0XHRwcml2YXRlIHRvZ2dsZVRodW1ibmFpbHMoJGV2ZW50PyA6IFVJRXZlbnQpIHtcblxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xuXHRcdFx0dGhpcy5jb25maWcudGh1bWJuYWlsLmR5bmFtaWMgPSAhdGhpcy5jb25maWcudGh1bWJuYWlsLmR5bmFtaWM7XG5cblx0XHR9XG5cblx0XHQvLyBzZXQgdHJhbnNpdGlvbiBlZmZlY3Rcblx0XHRwdWJsaWMgc2V0VHJhbnNpdGlvbih0cmFuc2l0aW9uLCAkZXZlbnQ/IDogVUlFdmVudCkge1xuXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XG5cdFx0XHR0aGlzLmNvbmZpZy50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcblxuXHRcdH1cblxuXHRcdC8vIHNldCB0aGVtZVxuXHRcdHB1YmxpYyBzZXRUaGVtZSh0aGVtZSA6IHN0cmluZywgJGV2ZW50PyA6IFVJRXZlbnQpIHtcblxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xuXHRcdFx0dGhpcy5hc2cub3B0aW9ucy50aGVtZSA9IHRoZW1lO1xuXG5cdFx0fVxuXG5cdFx0Ly8gdG9nZ2xlIGhlbHBcblx0XHRwcml2YXRlIHRvZ2dsZUhlbHAoJGV2ZW50PyA6IFVJRXZlbnQpIHtcblxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xuXHRcdFx0dGhpcy5jb25maWcuaGVscCA9ICF0aGlzLmNvbmZpZy5oZWxwO1xuXG5cdFx0fVxuXG5cdFx0Ly8gdG9nZ2xlIHNpemVcblx0XHRwcml2YXRlIHRvZ2dsZVNpemUoJGV2ZW50PyA6IFVJRXZlbnQpIHtcblxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xuXHRcdFx0bGV0IGluZGV4ID0gdGhpcy5hc2cuc2l6ZXMuaW5kZXhPZih0aGlzLmNvbmZpZy5zaXplKTtcblx0XHRcdGluZGV4ID0gKGluZGV4ICsgMSkgPj0gdGhpcy5hc2cuc2l6ZXMubGVuZ3RoID8gMCA6ICsraW5kZXg7XG5cdFx0XHR0aGlzLmNvbmZpZy5zaXplID0gdGhpcy5hc2cuc2l6ZXNbaW5kZXhdO1xuXHRcdFx0dGhpcy5hc2cubG9nKCd0b2dnbGUgaW1hZ2Ugc2l6ZTonLCBbdGhpcy5jb25maWcuc2l6ZSwgaW5kZXhdKTtcblxuXHRcdH1cblxuXHRcdC8vIHRvZ2dsZSBtZW51XG5cdFx0cHJpdmF0ZSB0b2dnbGVNZW51KCRldmVudD8gOiBVSUV2ZW50KSB7XG5cblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcblx0XHRcdHRoaXMuY29uZmlnLmhlYWRlci5keW5hbWljID0gIXRoaXMuY29uZmlnLmhlYWRlci5keW5hbWljO1xuXG5cdFx0fVxuXG5cdFx0Ly8gdG9nZ2xlIGNhcHRpb25cblx0XHRwcml2YXRlIHRvZ2dsZUNhcHRpb24oKSB7XG5cblx0XHRcdHRoaXMuY29uZmlnLmNhcHRpb24udmlzaWJsZSA9ICF0aGlzLmNvbmZpZy5jYXB0aW9uLnZpc2libGU7XG5cblx0XHR9XG5cblxuXHRcdHB1YmxpYyBwbGF5VmlkZW8oJGV2ZW50OiBVSUV2ZW50KSB7XG5cblx0XHRcdGlmICgkZXZlbnQpIHtcblx0XHRcdFx0JGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRcdHRoaXMuYXNnLmZpbGUudmlkZW8udmlzaWJsZSA9IHRydWU7XG5cdFx0XHR0aGlzLmFzZy5maWxlLnZpZGVvLmh0bWxJZCA9ICdtb2RhbF92aW1lb192aWRlb18nICsgdGhpcy5hc2cuZmlsZS52aWRlby52aW1lb0lkO1xuXG5cdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0aWQ6IHRoaXMuYXNnLmZpbGUudmlkZW8udmltZW9JZCxcblx0XHRcdFx0cmVzcG9uc2l2ZTogdHJ1ZSxcblx0XHRcdFx0bG9vcDogZmFsc2Vcblx0XHRcdH07XG5cblx0XHRcdC8vIGNvbnNvbGUubG9nKCd2aWRlbycsICB0aGlzLmFzZy5maWxlLnZpZGVvKTtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCd2aW1lbyBvcHRpb25zJywgb3B0aW9ucyk7XG5cblx0XHRcdGlmICh0aGlzLmFzZy5maWxlLnZpZGVvLnBsYXllcikge1xuXHRcdFx0XHR2YXIgcGxheWVyID0gdGhpcy5hc2cuZmlsZS52aWRlby5wbGF5ZXI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgcGxheWVyID0gbmV3IFZpbWVvLlBsYXllcih0aGlzLmFzZy5maWxlLnZpZGVvLmh0bWxJZCwgb3B0aW9ucyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHBsYXllci5sb2FkVmlkZW8odGhpcy5hc2cuZmlsZS52aWRlby52aW1lb0lkKS50aGVuKGZ1bmN0aW9uKGlkKSB7XG5cblx0XHRcdC8vIH0pXG5cblx0XHRcdHBsYXllci5zZXRWb2x1bWUoMC41KTtcblxuXHRcdFx0cGxheWVyLnBsYXkoKS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignZXJyb3IgcGxheWluZyB0aGUgdmlkZW86JywgZXJyb3IpO1xuXHRcdFx0fSlcblxuXHRcdFx0cGxheWVyLm9uKCdwbGF5JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGYuYXNnLmZpbGUudmlkZW8ucGxheWluZyA9IHRydWU7XG5cdFx0XHRcdHNlbGYuYXNnLmZpbGUudmlkZW8udmlzaWJsZSA9IHRydWU7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdwbGF5IHRoZSB2aWRlbyEnKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRwbGF5ZXIub24oJ3BhdXNlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGYuYXNnLmZpbGUudmlkZW8ucGxheWluZyA9IGZhbHNlXG5cdFx0XHRcdHNlbGYuYXNnLmZpbGUudmlkZW8udmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0XHRjb25zb2xlLmxvZygncGF1c2VkIHRoZSB2aWRlbyEnKTtcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLmFzZy5maWxlLnZpZGVvLnBsYXllciA9IHBsYXllcjtcblx0XHRcdHRoaXMuYXNnLmZpbGUudmlkZW8ucGxheWluZyA9IHRydWU7XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgbWFyZ2ludCB0b3Bcblx0XHRwdWJsaWMgZ2V0IG1hcmdpblRvcCgpIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZmlnLm1hcmdpblRvcDtcblxuXHRcdH1cblxuXHRcdC8vIGdldCBtYXJnaW4gYm90dG9tXG5cdFx0cHVibGljIGdldCBtYXJnaW5Cb3R0b20oKSB7XG5cblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5tYXJnaW5Cb3R0b207XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgbW9kYWwgdmlzaWJsZVxuXHRcdHB1YmxpYyBnZXQgdmlzaWJsZSgpIHtcblxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzLmFzZy5tb2RhbFZpc2libGU7XG5cblx0XHR9XG5cblx0XHQvLyBzZXQgbW9kYWwgdmlzaWJsZVxuXHRcdHB1YmxpYyBzZXQgdmlzaWJsZSh2YWx1ZSA6IGJvb2xlYW4pIHtcblxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuYXNnLm1vZGFsVmlzaWJsZSA9IHZhbHVlO1xuXHRcdFx0dGhpcy5hc2cuc2V0SGFzaCgpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XG5cblx0XHRcdGlmICghdGhpcy5hc2cpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2Vcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xuXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IG1vZGFsIGNvbmZpZ1xuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc01vZGFsIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcblxuXHRcdH1cblxuXHRcdC8vIHNldCBtb2RhbCBjb25maWdcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zTW9kYWwpIHtcblxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XG5cblx0XHR9XG5cblx0fVxuXG5cblx0bGV0IGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xuXG5cdGFwcC5jb21wb25lbnQoJ2FzZ01vZGFsJywge1xuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckd2luZG93JywgJyRyb290U2NvcGUnLCAnJHNjb3BlJywgYW5ndWxhclN1cGVyR2FsbGVyeS5Nb2RhbENvbnRyb2xsZXJdLFxuXHRcdHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FzZy1tb2RhbC5odG1sJyxcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxuXHRcdGJpbmRpbmdzOiB7XG5cdFx0XHRpZDogJ0A/Jyxcblx0XHRcdGl0ZW1zOiAnPT8nLFxuXHRcdFx0b3B0aW9uczogJz0/Jyxcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxuXHRcdFx0dmlzaWJsZTogJz0/Jyxcblx0XHRcdGJhc2VVcmw6ICdAPydcblx0XHR9XG5cdH0pO1xuXG59XG4iLCJuYW1lc3BhY2UgYW5ndWxhclN1cGVyR2FsbGVyeSB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBQYW5lbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnM6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zOiBBcnJheTxJRmlsZT47XHJcblx0XHRwdWJsaWMgYmFzZVVybDogc3RyaW5nO1xyXG5cclxuXHRcdHByaXZhdGUgdHlwZSA9ICdwYW5lbCc7XHJcblx0XHRwcml2YXRlIHRlbXBsYXRlO1xyXG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRjb25zdHJ1Y3RvcihcclxuXHRcdFx0cHJpdmF0ZSBzZXJ2aWNlOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHRcdHRoaXMudGVtcGxhdGUgPSAnL3ZpZXdzL2FzZy1wYW5lbC5odG1sJztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXg6IG51bWJlciwgJGV2ZW50PzogTW91c2VFdmVudCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxDbGljaygkZXZlbnQpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmNsaWNrLm1vZGFsKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxPcGVuKGluZGV4KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5zZWxlY3QpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5zZXRTZWxlY3RlZChpbmRleCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGhvdmVyKGluZGV4OiBudW1iZXIsICRldmVudD86IE1vdXNlRXZlbnQpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5ob3Zlci5wcmVsb2FkID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cuaG92ZXJQcmVsb2FkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuY29uZmlnLmhvdmVyLnNlbGVjdCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnNldFNlbGVjdGVkKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgcGFuZWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpOiBJT3B0aW9uc1BhbmVsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBwYW5lbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlOiBJT3B0aW9uc1BhbmVsKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHY6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGxldCBhcHA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KCdhc2dQYW5lbCcsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCBhbmd1bGFyU3VwZXJHYWxsZXJ5LlBhbmVsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJhc2ctcGFuZWwge3sgJGN0cmwuYXNnLmNsYXNzZXMgfX1cIiBuZy1tb3VzZW92ZXI9XCIkY3RybC5hc2cub3Zlci5wYW5lbCA9IHRydWU7XCIgbmctbW91c2VsZWF2ZT1cIiRjdHJsLmFzZy5vdmVyLnBhbmVsID0gZmFsc2U7XCIgbmctc2hvdz1cIiRjdHJsLmNvbmZpZy52aXNpYmxlXCI+PGRpdiBuZy1pbmNsdWRlPVwiJGN0cmwudGVtcGxhdGVcIj48L2Rpdj48bmctdHJhbnNjbHVkZT48L25nLXRyYW5zY2x1ZGU+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogJ0AnLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6ICc9PycsXHJcblx0XHRcdHRlbXBsYXRlOiAnQD8nLFxyXG5cdFx0XHRiYXNlVXJsOiAnQD8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcblxuXHQvLyBjb250YWluZXIgY29tcG9uZW50IG9wdGlvbnNcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0NvbnRhaW5lciB7XG5cblx0XHRhdmFpbGFibGUgOiBib29sZWFuO1xuXHRcdGhlYWRlcj86IHtcblx0XHRcdGVuYWJsZWQ/OiBib29sZWFuO1xuXHRcdFx0ZHluYW1pYz86IGJvb2xlYW47XG5cdFx0XHRidXR0b25zOiBBcnJheTxzdHJpbmc+O1xuXHRcdH07XG5cdFx0aGVscD86IGJvb2xlYW47XG5cdFx0dmlzaWJsZT8gOiBib29sZWFuO1xuXHRcdHZpc2libGVEZWZhdWx0PzogYm9vbGVhbjtcblx0XHRjYXB0aW9uPzoge1xuXHRcdFx0ZGlzYWJsZWQ/OiBib29sZWFuO1xuXHRcdFx0dmlzaWJsZT86IGJvb2xlYW47XG5cdFx0XHRwb3NpdGlvbj86IHN0cmluZztcblx0XHRcdGRvd25sb2FkPzogYm9vbGVhbjtcblx0XHR9O1xuXHRcdHRyYW5zaXRpb24/OiBzdHJpbmc7XG5cdFx0dHJhbnNpdGlvblNwZWVkPyA6IG51bWJlcjtcblx0XHR0aXRsZT86IHN0cmluZztcblx0XHRzdWJ0aXRsZT86IHN0cmluZztcblx0XHR0aXRsZUZyb21JbWFnZT8gOiBib29sZWFuO1xuXHRcdHN1YnRpdGxlRnJvbUltYWdlPyA6IGJvb2xlYW47XG5cdFx0YXJyb3dzPzoge1xuXHRcdFx0cHJlbG9hZD86IGJvb2xlYW47XG5cdFx0XHRlbmFibGVkPzogYm9vbGVhbjtcblx0XHR9O1xuXHRcdGZ1bGxzaXplOiBib29sZWFuO1xuXHRcdHNpemU/OiBzdHJpbmc7XG5cdFx0dGh1bWJuYWlsPzogSU9wdGlvbnNUaHVtYm5haWw7XG5cdFx0bWFyZ2luVG9wPzogbnVtYmVyO1xuXHRcdG1hcmdpbkJvdHRvbT86IG51bWJlcjtcblx0XHRjbGljaz86IHtcblx0XHRcdGNsb3NlOiBib29sZWFuO1xuXHRcdH07XG5cdFx0a2V5Y29kZXM/OiB7XG5cdFx0XHRleGl0PzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdHBsYXlwYXVzZT86IEFycmF5PG51bWJlcj47XG5cdFx0XHRmb3J3YXJkPzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGJhY2t3YXJkPzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGZpcnN0PzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGxhc3Q/OiBBcnJheTxudW1iZXI+O1xuXHRcdFx0ZnVsbHNjcmVlbj86IEFycmF5PG51bWJlcj47XG5cdFx0XHRtZW51PzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGNhcHRpb24/OiBBcnJheTxudW1iZXI+O1xuXHRcdFx0aGVscD86IEFycmF5PG51bWJlcj47XG5cdFx0XHRzaXplPzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdHRyYW5zaXRpb24/OiBBcnJheTxudW1iZXI+O1xuXHRcdH07XG5cdFx0aGVpZ2h0PzogbnVtYmVyO1xuXHRcdGhlaWdodE1pbj86IG51bWJlcjtcblx0XHRoZWlnaHRBdXRvPzoge1xuXHRcdFx0aW5pdGlhbD86IGJvb2xlYW47XG5cdFx0XHRvbnJlc2l6ZT86IGJvb2xlYW47XG5cdFx0fTtcblx0fVxuXG5cdC8vIG1vZGFsIGNvbXBvbmVudCBvcHRpb25zXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNNb2RhbCB7XG5cblx0XHRhdmFpbGFibGUgOiBib29sZWFuO1xuXHRcdGhlYWRlcj86IHtcblx0XHRcdGVuYWJsZWQ/OiBib29sZWFuO1xuXHRcdFx0ZHluYW1pYz86IGJvb2xlYW47XG5cdFx0XHRidXR0b25zOiBBcnJheTxzdHJpbmc+O1xuXHRcdH07XG5cdFx0aGVscD86IGJvb2xlYW47XG5cdFx0Y2FwdGlvbj86IHtcblx0XHRcdGRpc2FibGVkPzogYm9vbGVhbjtcblx0XHRcdHZpc2libGU/OiBib29sZWFuO1xuXHRcdFx0cG9zaXRpb24/OiBzdHJpbmc7XG5cdFx0XHRkb3dubG9hZD86IGJvb2xlYW47XG5cdFx0fTtcblx0XHR0cmFuc2l0aW9uPzogc3RyaW5nO1xuXHRcdHRyYW5zaXRpb25TcGVlZD8gOiBudW1iZXI7XG5cdFx0dGl0bGU/OiBzdHJpbmc7XG5cdFx0c3VidGl0bGU/OiBzdHJpbmc7XG5cdFx0dGl0bGVGcm9tSW1hZ2U/IDogYm9vbGVhbjtcblx0XHRzdWJ0aXRsZUZyb21JbWFnZT8gOiBib29sZWFuO1xuXHRcdGFycm93cz86IHtcblx0XHRcdHByZWxvYWQ/OiBib29sZWFuO1xuXHRcdFx0ZW5hYmxlZD86IGJvb2xlYW47XG5cdFx0fTtcblx0XHRzaXplPzogc3RyaW5nO1xuXHRcdHRodW1ibmFpbD86IElPcHRpb25zVGh1bWJuYWlsO1xuXHRcdG1hcmdpblRvcD86IG51bWJlcjtcblx0XHRtYXJnaW5Cb3R0b20/OiBudW1iZXI7XG5cdFx0Y2xpY2s/OiB7XG5cdFx0XHRjbG9zZTogYm9vbGVhbjtcblx0XHR9O1xuXHRcdGtleWNvZGVzPzoge1xuXHRcdFx0ZXhpdD86IEFycmF5PG51bWJlcj47XG5cdFx0XHRwbGF5cGF1c2U/OiBBcnJheTxudW1iZXI+O1xuXHRcdFx0Zm9yd2FyZD86IEFycmF5PG51bWJlcj47XG5cdFx0XHRiYWNrd2FyZD86IEFycmF5PG51bWJlcj47XG5cdFx0XHRmaXJzdD86IEFycmF5PG51bWJlcj47XG5cdFx0XHRsYXN0PzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGZ1bGxzY3JlZW4/OiBBcnJheTxudW1iZXI+O1xuXHRcdFx0bWVudT86IEFycmF5PG51bWJlcj47XG5cdFx0XHRjYXB0aW9uPzogQXJyYXk8bnVtYmVyPjtcblx0XHRcdGhlbHA/OiBBcnJheTxudW1iZXI+O1xuXHRcdFx0c2l6ZT86IEFycmF5PG51bWJlcj47XG5cdFx0XHR0cmFuc2l0aW9uPzogQXJyYXk8bnVtYmVyPjtcblx0XHR9O1xuXHR9XG5cblx0Ly8gcGFuZWwgY29tcG9uZW50IG9wdGlvbnNcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc1BhbmVsIHtcblxuXHRcdGF2YWlsYWJsZSA6IGJvb2xlYW47XG5cdFx0dmlzaWJsZT86IGJvb2xlYW47XG5cdFx0c2l6ZT86IHN0cmluZztcblx0XHRpdGVtcz86IHtcblx0XHRcdGNsYXNzPzogc3RyaW5nO1xuXHRcdH0sXG5cdFx0aXRlbT86IHtcblx0XHRcdGNsYXNzPzogc3RyaW5nO1xuXHRcdFx0Y2FwdGlvbjogYm9vbGVhbjtcblx0XHRcdGluZGV4OiBib29sZWFuO1xuXHRcdH07XG5cdFx0aG92ZXI/OiB7XG5cdFx0XHRwcmVsb2FkOiBib29sZWFuO1xuXHRcdFx0c2VsZWN0OiBib29sZWFuO1xuXHRcdH07XG5cdFx0Y2xpY2s/OiB7XG5cdFx0XHRzZWxlY3Q6IGJvb2xlYW47XG5cdFx0XHRtb2RhbDogYm9vbGVhbjtcblx0XHR9O1xuXG5cdH1cblxuXHQvLyB0aHVtYm5haWwgY29tcG9uZW50IG9wdGlvbnNcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc1RodW1ibmFpbCB7XG5cblx0XHRhdmFpbGFibGUgOiBib29sZWFuO1xuXHRcdGhlaWdodD86IG51bWJlcjtcblx0XHRpbmRleD86IGJvb2xlYW47XG5cdFx0ZW5hYmxlZD86IGJvb2xlYW47XG5cdFx0ZHluYW1pYz86IGJvb2xlYW47XG5cdFx0YXV0b2hpZGU6IGJvb2xlYW47XG5cdFx0Y2xpY2s/OiB7XG5cdFx0XHRzZWxlY3Q6IGJvb2xlYW47XG5cdFx0XHRtb2RhbDogYm9vbGVhbjtcblx0XHR9O1xuXHRcdGhvdmVyPzoge1xuXHRcdFx0cHJlbG9hZDogYm9vbGVhbjtcblx0XHRcdHNlbGVjdDogYm9vbGVhbjtcblx0XHR9O1xuXHRcdGxvYWRlZD86IGJvb2xlYW47XG5cdFx0aW5pdGlhbGl6ZWQ/OiBib29sZWFuO1xuXG5cdH1cblxuXHQvLyBpbmZvIGNvbXBvbmVudCBvcHRpb25zXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNJbmZvIHtcblxuXHR9XG5cblx0Ly8gaW1hZ2UgY29tcG9uZW50IG9wdGlvbnNcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0ltYWdlIHtcblxuXHRcdGF2YWlsYWJsZSA6IGJvb2xlYW47XG5cdFx0dHJhbnNpdGlvbj86IHN0cmluZztcblx0XHR0cmFuc2l0aW9uU3BlZWQ/IDogbnVtYmVyO1xuXHRcdHNpemU/OiBzdHJpbmc7XG5cdFx0YXJyb3dzPzoge1xuXHRcdFx0cHJlbG9hZD86IGJvb2xlYW47XG5cdFx0XHRlbmFibGVkPzogYm9vbGVhbjtcblx0XHR9O1xuXHRcdGNsaWNrPzoge1xuXHRcdFx0bW9kYWw6IGJvb2xlYW47XG5cdFx0fTtcblx0XHRoZWlnaHQ/OiBudW1iZXI7XG5cdFx0aGVpZ2h0TWluPzogbnVtYmVyO1xuXHRcdGhlaWdodEF1dG8/OiB7XG5cdFx0XHRpbml0aWFsPzogYm9vbGVhbjtcblx0XHRcdG9ucmVzaXplPzogYm9vbGVhbjtcblx0XHR9O1xuXHR9XG5cblx0Ly8gZ2FsbGVyeSBvcHRpb25zXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xuXG5cdFx0ZGVidWc/OiBib29sZWFuO1xuXHRcdGJhc2VVcmw/OiBzdHJpbmc7XG5cdFx0aGFzaFVybD86IGJvb2xlYW47XG5cdFx0ZHVwbGljYXRlcz86IGJvb2xlYW47XG5cdFx0c2VsZWN0ZWQ/OiBudW1iZXI7XG5cdFx0ZmllbGRzPzoge1xuXHRcdFx0c291cmNlPzoge1xuXHRcdFx0XHRsYXJnZT86IHN0cmluZztcblx0XHRcdFx0c21hbGw/OiBzdHJpbmc7XG5cdFx0XHRcdG1lZGl1bT86IHN0cmluZztcblx0XHRcdFx0bGF6eT86IHN0cmluZztcblx0XHRcdH1cblx0XHRcdHRpdGxlPzogc3RyaW5nO1xuXHRcdFx0c3VidGl0bGU/OiBzdHJpbmc7XG5cdFx0XHRkZXNjcmlwdGlvbj86IHN0cmluZztcblx0XHRcdHRodW1ibmFpbD86IHN0cmluZztcblx0XHRcdHZpZGVvPzogc3RyaW5nO1xuXHRcdH07XG5cdFx0YXV0b3BsYXk/OiB7XG5cdFx0XHRlbmFibGVkPzogYm9vbGVhbjtcblx0XHRcdGRlbGF5PzogbnVtYmVyO1xuXHRcdH07XG5cdFx0dGhlbWU/OiBzdHJpbmc7XG5cdFx0cHJlbG9hZD86IEFycmF5PG51bWJlcj47XG5cdFx0cHJlbG9hZE5leHQ/OiBib29sZWFuO1xuXHRcdHByZWxvYWREZWxheT86IG51bWJlcjtcblx0XHRsb2FkaW5nSW1hZ2U/OiBzdHJpbmc7XG5cdFx0Y29udGFpbmVyPzogSU9wdGlvbnNDb250YWluZXI7XG5cdFx0bW9kYWw/OiBJT3B0aW9uc01vZGFsO1xuXHRcdHBhbmVsPzogSU9wdGlvbnNQYW5lbDtcblx0XHRpbWFnZT86IElPcHRpb25zSW1hZ2U7XG5cdFx0aXRlbT86IElPcHRpb25zSW1hZ2U7XG5cdFx0dGh1bWJuYWlsPzogSU9wdGlvbnNUaHVtYm5haWw7XG5cblx0fVxuXG5cdC8vIGltYWdlIHNvdXJjZVxuXHRleHBvcnQgaW50ZXJmYWNlIElTb3VyY2Uge1xuXG5cdFx0bGFyZ2U6IHN0cmluZzsgLy8gb3JpZ2luYWwsIHJlcXVpcmVkXG5cdFx0c21hbGw/OiBzdHJpbmc7XG5cdFx0bWVkaXVtPzogc3RyaW5nO1xuXHRcdGxhenk/OiBzdHJpbmc7XG5cdFx0Y29sb3I/OiBzdHJpbmc7XG5cblx0fVxuXG5cdC8vIGltYWdlIGZpbGVcblx0ZXhwb3J0IGludGVyZmFjZSBJRmlsZSB7XG5cblx0XHRpbmRleDogbnVtYmVyO1xuXHRcdHNvdXJjZTogSVNvdXJjZTtcblx0XHR0aXRsZT86IHN0cmluZztcblx0XHRzdWJ0aXRsZT86IHN0cmluZztcblx0XHRuYW1lPzogc3RyaW5nO1xuXHRcdGV4dGVuc2lvbj86IHN0cmluZztcblx0XHRkZXNjcmlwdGlvbj86IHN0cmluZztcblx0XHR2aWRlbz86IHtcblx0XHRcdHZpbWVvSWQ6IHN0cmluZztcblx0XHRcdHlvdXR1YmVJZDogc3RyaW5nO1xuXHRcdFx0aHRtbElkOiBzdHJpbmc7XG5cdFx0XHRhdXRvcGxheTogYm9vbGVhbjtcblx0XHRcdHBhdXNlZDogYm9vbGVhbjtcblx0XHRcdHZpc2libGU6IGJvb2xlYW47XG5cdFx0XHRwbGF5aW5nOiBib29sZWFuO1xuXHRcdFx0cGxheWVyOiBhbnlcblx0XHR9O1xuXHRcdGRvd25sb2FkPzogc3RyaW5nO1xuXHRcdGxvYWRlZD86IHtcblx0XHRcdGxhcmdlPzogYm9vbGVhbjtcblx0XHRcdG1lZGl1bT86IGJvb2xlYW47XG5cdFx0XHRzbWFsbD86IGJvb2xlYW47XG5cdFx0fTtcblx0XHR3aWR0aD86IG51bWJlcjtcblx0XHRoZWlnaHQ/OiBudW1iZXI7XG5cblx0fVxuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU92ZXIge1xuXHRcdG1vZGFsSW1hZ2U6IGJvb2xlYW47XG5cdFx0cGFuZWw6IGJvb2xlYW47XG5cdH1cblxuXHRleHBvcnQgaW50ZXJmYWNlIElFZGl0IHtcblx0XHRpZDogbnVtYmVyO1xuXHRcdGRlbGV0ZT86IG51bWJlcjtcblx0XHRhZGQ/OiBBcnJheTxJRmlsZT47XG5cdFx0dXBkYXRlPzogQXJyYXk8SUZpbGU+O1xuXHRcdHJlZnJlc2g/OiBib29sZWFuO1xuXHRcdHNlbGVjdGVkPzogbnVtYmVyO1xuXHRcdG9wdGlvbnM/OiBJT3B0aW9ucztcblx0XHRkZWxheVRodW1ibmFpbHM/OiBudW1iZXI7XG5cdFx0ZGVsYXlSZWZyZXNoPzogbnVtYmVyO1xuXHR9XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJU2NvcGUgZXh0ZW5kcyBuZy5JU2NvcGUge1xuXHRcdGZvcndhcmQ6ICgpID0+IHZvaWQ7XG5cdFx0YmFja3dhcmQ6ICgpID0+IHZvaWQ7XG5cdH1cblxuXHQvLyBzZXJ2aWNlIGNvbnRyb2xsZXIgaW50ZXJmYWNlXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVNlcnZpY2VDb250cm9sbGVyIHtcblxuXHRcdG1vZGFsVmlzaWJsZTogYm9vbGVhbjtcblx0XHRwYW5lbFZpc2libGU6IGJvb2xlYW47XG5cdFx0bW9kYWxBdmFpbGFibGU6IGJvb2xlYW47XG5cdFx0bW9kYWxJbml0aWFsaXplZDogYm9vbGVhbjtcblx0XHR0cmFuc2l0aW9uczogQXJyYXk8c3RyaW5nPjtcblx0XHR0aGVtZXM6IEFycmF5PHN0cmluZz47XG5cdFx0Y2xhc3Nlczogc3RyaW5nO1xuXHRcdG9wdGlvbnM6IElPcHRpb25zO1xuXHRcdGl0ZW1zOiBBcnJheTxJRmlsZT47XG5cdFx0c2VsZWN0ZWQ6IG51bWJlcjtcblx0XHRmaWxlOiBJRmlsZTtcblx0XHRmaWxlczogQXJyYXk8SUZpbGU+O1xuXHRcdHNpemVzOiBBcnJheTxzdHJpbmc+O1xuXHRcdGlkOiBzdHJpbmc7XG5cdFx0aXNTaW5nbGU6IGJvb2xlYW47XG5cdFx0ZXZlbnRzOiB7XG5cdFx0XHRDT05GSUdfTE9BRDogc3RyaW5nO1xuXHRcdFx0QVVUT1BMQVlfU1RBUlQ6IHN0cmluZztcblx0XHRcdEFVVE9QTEFZX1NUT1A6IHN0cmluZztcblx0XHRcdFBBUlNFX0lNQUdFUzogc3RyaW5nO1xuXHRcdFx0TE9BRF9JTUFHRTogc3RyaW5nO1xuXHRcdFx0RklSU1RfSU1BR0U6IHN0cmluZztcblx0XHRcdENIQU5HRV9JTUFHRTogc3RyaW5nO1xuXHRcdFx0RE9VQkxFX0lNQUdFOiBzdHJpbmc7XG5cdFx0XHRNT0RBTF9PUEVOOiBzdHJpbmc7XG5cdFx0XHRNT0RBTF9DTE9TRTogc3RyaW5nO1xuXHRcdFx0R0FMTEVSWV9VUERBVEVEOiBzdHJpbmc7XG5cdFx0XHRHQUxMRVJZX0VESVQ6IHN0cmluZztcblx0XHRcdExBU1RfVEhVTUJOQUlMOiBzdHJpbmc7XG5cdFx0fTtcblxuXHRcdGdldEluc3RhbmNlKGNvbXBvbmVudDogYW55KTogSVNlcnZpY2VDb250cm9sbGVyO1xuXG5cdFx0c2V0RGVmYXVsdHMoKTogdm9pZDtcblxuXHRcdHNldE9wdGlvbnMob3B0aW9uczogSU9wdGlvbnMpOiBJT3B0aW9ucztcblxuXHRcdHNldEl0ZW1zKGl0ZW1zOiBBcnJheTxJRmlsZT4sIGZvcmNlPzogYm9vbGVhbik6IHZvaWQ7XG5cblx0XHRhZGRJbWFnZSh2YWx1ZTogYW55LCBpbmRleD86IG51bWJlcikgOiBJRmlsZTtcblxuXHRcdHByZWxvYWQod2FpdD86IG51bWJlcik6IHZvaWQ7XG5cblx0XHRub3JtYWxpemUoaW5kZXg6IG51bWJlcik6IG51bWJlcjtcblxuXHRcdHNldEZvY3VzKCk6IHZvaWQ7XG5cblx0XHRzZXRTZWxlY3RlZChpbmRleDogbnVtYmVyKTtcblxuXHRcdGNvbnRhaW5lckZ1bGxTaXplKCk6IHZvaWQ7XG5cblx0XHRtb2RhbE9wZW4oaW5kZXg6IG51bWJlcik6IHZvaWQ7XG5cblx0XHRtb2RhbENsb3NlKCk6IHZvaWQ7XG5cblx0XHRtb2RhbENsaWNrKCRldmVudD86IFVJRXZlbnQpOiB2b2lkO1xuXG5cdFx0dGh1bWJuYWlsc01vdmUoZGVsYXk/OiBudW1iZXIpOiB2b2lkO1xuXG5cdFx0dG9CYWNrd2FyZChzdG9wPzogYm9vbGVhbik6IHZvaWQ7XG5cblx0XHR0b0ZvcndhcmQoc3RvcD86IGJvb2xlYW4pOiB2b2lkO1xuXG5cdFx0dG9GaXJzdChzdG9wPzogYm9vbGVhbik6IHZvaWQ7XG5cblx0XHR0b0xhc3Qoc3RvcD86IGJvb2xlYW4pOiB2b2lkO1xuXG5cdFx0bG9hZEltYWdlKGluZGV4PzogbnVtYmVyKTogdm9pZDtcblxuXHRcdGxvYWRJbWFnZXMoaW5kZXhlczogQXJyYXk8bnVtYmVyPik6IHZvaWQ7XG5cblx0XHRob3ZlclByZWxvYWQoaW5kZXg6IG51bWJlcik6IHZvaWQ7XG5cblx0XHRwcmVsb2FkSW1hZ2UoaW5kZXg6IG51bWJlciwgc2l6ZTogc3RyaW5nKTogdm9pZDtcblxuXHRcdGF1dG9QbGF5VG9nZ2xlKCk6IHZvaWQ7XG5cblx0XHR0b2dnbGUoZWxlbWVudDogc3RyaW5nKTogdm9pZDtcblxuXHRcdHNldEhhc2goKTogdm9pZDtcblxuXHRcdGRvd25sb2FkTGluaygpOiBzdHJpbmc7XG5cblx0XHRlbChzZWxlY3Rvcik6IE5vZGVMaXN0O1xuXG5cdFx0bG9nKGV2ZW50OiBzdHJpbmcsIGRhdGE/OiBhbnkpOiB2b2lkO1xuXG5cdFx0ZXZlbnQoZXZlbnQ6IHN0cmluZywgZGF0YT86IGFueSk7XG5cblx0fVxuXG5cdC8vIHNlcnZpY2UgY29udHJvbGxlclxuXHRleHBvcnQgY2xhc3MgU2VydmljZUNvbnRyb2xsZXIge1xuXG5cdFx0cHVibGljIHZlcnNpb24gPSBcIjMuMC4yXCI7XG5cdFx0cHVibGljIHNsdWcgPSAnYXNnJztcblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcblx0XHRwdWJsaWMgaXRlbXM6IEFycmF5PElGaWxlPiA9IFtdO1xuXHRcdHB1YmxpYyBmaWxlczogQXJyYXk8SUZpbGU+ID0gW107XG5cdFx0cHVibGljIGRpcmVjdGlvbjogc3RyaW5nO1xuXHRcdHB1YmxpYyBtb2RhbEF2YWlsYWJsZSA9IGZhbHNlO1xuXHRcdHB1YmxpYyBtb2RhbEluaXRpYWxpemVkID0gZmFsc2U7XG5cblx0XHRwcml2YXRlIGluc3RhbmNlczoge30gPSB7fTtcblx0XHRwcml2YXRlIF9zZWxlY3RlZDogbnVtYmVyO1xuXHRcdHByaXZhdGUgX3Zpc2libGUgPSBmYWxzZTtcblx0XHRwcml2YXRlIGF1dG9wbGF5OiBhbmd1bGFyLklQcm9taXNlPGFueT47XG5cdFx0cHJpdmF0ZSBmaXJzdCA9IGZhbHNlO1xuXHRcdHByaXZhdGUgZWRpdGluZyA9IGZhbHNlO1xuXG5cdFx0cHVibGljIG9wdGlvbnM6IElPcHRpb25zID0gbnVsbDtcblx0XHRwdWJsaWMgb3B0aW9uc0xvYWRlZCA9IGZhbHNlO1xuXHRcdHB1YmxpYyBkZWZhdWx0czogSU9wdGlvbnMgPSB7XG5cdFx0XHRkZWJ1ZzogZmFsc2UsIC8vIGltYWdlIGxvYWQsIGF1dG9wbGF5LCBldGMuIGluZm8gaW4gY29uc29sZS5sb2dcblx0XHRcdGhhc2hVcmw6IHRydWUsIC8vIGVuYWJsZS9kaXNhYmxlIGhhc2ggdXNhZ2UgaW4gdXJsICgjYXNnLW5hdHVyZS00KVxuXHRcdFx0YmFzZVVybDogJycsIC8vIHVybCBwcmVmaXhcblx0XHRcdGR1cGxpY2F0ZXM6IGZhbHNlLCAvLyBlbmFibGUgb3IgZGlzYWJsZSBzYW1lIGltYWdlcyAodXJsKSBpbiBnYWxsZXJ5XG5cdFx0XHRzZWxlY3RlZDogMCwgLy8gc2VsZWN0ZWQgaW1hZ2Ugb24gaW5pdFxuXHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdHNvdXJjZToge1xuXHRcdFx0XHRcdGxhcmdlOiAndXJsJywgLy8gcmVxdWlyZWQsIGltYWdlIHVybCBmb3IgbW9kYWwgY29tcG9uZW50IChsYXJnZSBzaXplKVxuXHRcdFx0XHRcdHNtYWxsOiAndXJsJywgLy8gaW1hZ2UgdXJsIGZvciBwYW5lbCBjb21wb25lbnQgKHRodW1ibmFpbCBzaXplKVxuXHRcdFx0XHRcdG1lZGl1bTogJ3VybCcsIC8vIGltYWdlIHVybCBmb3IgaW1hZ2UgKG1lZGl1bSBvciBjdXN0b20gc2l6ZSlcblx0XHRcdFx0XHRsYXp5OiBudWxsIC8vIGltYWdlIHVybCBmb3IgcHJlbG9hZCBsb3dyZXMgaW1hZ2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0dGl0bGU6ICd0aXRsZScsIC8vIHRpdGxlIGZpZWxkIG5hbWVcblx0XHRcdFx0c3VidGl0bGU6ICdzdWJ0aXRsZScsIC8vIHN1YnRpdGxlIGZpZWxkIG5hbWVcblx0XHRcdFx0ZGVzY3JpcHRpb246ICdkZXNjcmlwdGlvbicsIC8vIGRlc2NyaXB0aW9uIGZpZWxkIG5hbWVcblx0XHRcdFx0dmlkZW86ICd2aWRlbycsIC8vIHZpZGVvIGZpZWxkIG5hbWVcblx0XHRcdH0sXG5cdFx0XHRhdXRvcGxheToge1xuXHRcdFx0XHRlbmFibGVkOiBmYWxzZSwgLy8gc2xpZGVzaG93IHBsYXkgZW5hYmxlZC9kaXNhYmxlZFxuXHRcdFx0XHRkZWxheTogNDEwMCAvLyBhdXRvcGxheSBkZWxheSBpbiBtaWxsaXNlY29uZFxuXHRcdFx0fSxcblx0XHRcdHRoZW1lOiAnZGVmYXVsdCcsIC8vIGNzcyBzdHlsZSBbZGVmYXVsdCwgZGFya2JsdWUsIGRhcmtyZWQsIHdoaXRlZ29sZF1cblx0XHRcdHByZWxvYWROZXh0OiBmYWxzZSwgLy8gcHJlbG9hZCBuZXh0IGltYWdlIChmb3J3YXJkL2JhY2t3YXJkKVxuXHRcdFx0cHJlbG9hZERlbGF5OiA3NzAsIC8vIHByZWxvYWQgZGVsYXkgZm9yIHByZWxvYWROZXh0XG5cdFx0XHRsb2FkaW5nSW1hZ2U6ICdwcmVsb2FkLnN2ZycsIC8vIGxvYWRlciBpbWFnZVxuXHRcdFx0cHJlbG9hZDogW10sIC8vIHByZWxvYWQgaW1hZ2VzIGJ5IGluZGV4IG51bWJlclxuXHRcdFx0Y29udGFpbmVyOiB7XG5cdFx0XHRcdGF2YWlsYWJsZTogZmFsc2UsXG5cdFx0XHRcdGZ1bGxzaXplOiB0cnVlLFxuXHRcdFx0XHR2aXNpYmxlOiBmYWxzZSxcblx0XHRcdFx0dGl0bGU6ICcnLCAvLyBtb2RhbCB3aW5kb3cgdGl0bGVcblx0XHRcdFx0c3VidGl0bGU6ICcnLCAvLyBtb2RhbCB3aW5kb3cgc3VidGl0bGVcblx0XHRcdFx0dGl0bGVGcm9tSW1hZ2U6IGZhbHNlLCAvLyBmb3JjZSB1cGRhdGUgdGhlIGdhbGxlcnkgdGl0bGUgYnkgaW1hZ2UgdGl0bGVcblx0XHRcdFx0c3VidGl0bGVGcm9tSW1hZ2U6IGZhbHNlLCAvLyBmb3JjZSB1cGRhdGUgdGhlIGdhbGxlcnkgc3VidGl0bGUgYnkgaW1hZ2UgZGVzY3JpcHRpb25cblx0XHRcdFx0Y2FwdGlvbjoge1xuXHRcdFx0XHRcdGRpc2FibGVkOiB0cnVlLCAvLyBkaXNhYmxlIGltYWdlIGNhcHRpb25cblx0XHRcdFx0XHR2aXNpYmxlOiB0cnVlLCAvLyBzaG93L2hpZGUgaW1hZ2UgY2FwdGlvblxuXHRcdFx0XHRcdHBvc2l0aW9uOiAndG9wJywgLy8gY2FwdGlvbiBwb3NpdGlvbiBbdG9wLCBib3R0b21dXG5cdFx0XHRcdFx0ZG93bmxvYWQ6IGZhbHNlIC8vIHNob3cvaGlkZSBkb3dubG9hZCBsaW5rXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhlYWRlcjoge1xuXHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsIC8vIGVuYWJsZS9kaXNhYmxlIG1vZGFsIG1lbnVcblx0XHRcdFx0XHRkeW5hbWljOiBmYWxzZSwgLy8gc2hvdy9oaWRlIG1vZGFsIG1lbnUgb24gbW91c2VvdmVyXG5cdFx0XHRcdFx0YnV0dG9uczogWydwbGF5c3RvcCcsICdpbmRleCcsICdwcmV2JywgJ25leHQnLCAncGluJywgJ3NpemUnLCAndHJhbnNpdGlvbicsICd0aHVtYm5haWxzJywgJ2Z1bGxzaXplJywgJ2Z1bGxzY3JlZW4nLCAnaGVscCcsICdjbG9zZSddLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRoZWxwOiBmYWxzZSwgLy8gc2hvdy9oaWRlIGhlbHBcblx0XHRcdFx0YXJyb3dzOiB7XG5cdFx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSwgLy8gc2hvdy9oaWRlIGFycm93c1xuXHRcdFx0XHRcdHByZWxvYWQ6IGZhbHNlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjbGljazoge1xuXHRcdFx0XHRcdGNsb3NlOiB0cnVlIC8vIHdoZW4gY2xpY2sgb24gdGhlIGltYWdlIGNsb3NlIHRoZSBtb2RhbFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aHVtYm5haWw6IHtcblx0XHRcdFx0XHRhdmFpbGFibGU6IGZhbHNlLFxuXHRcdFx0XHRcdGhlaWdodDogNTAsIC8vIHRodW1ibmFpbCBpbWFnZSBoZWlnaHQgaW4gcGl4ZWxcblx0XHRcdFx0XHRpbmRleDogZmFsc2UsIC8vIHNob3cgaW5kZXggbnVtYmVyIG9uIHRodW1ibmFpbFxuXHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsIC8vIGVuYWJsZS9kaXNhYmxlIHRodW1ibmFpbHNcblx0XHRcdFx0XHRkeW5hbWljOiB0cnVlLCAvLyBpZiB0cnVlIHRodW1ibmFpbHMgdmlzaWJsZSBvbmx5IHdoZW4gbW91c2VvdmVyXG5cdFx0XHRcdFx0YXV0b2hpZGU6IHRydWUsIC8vIGhpZGUgdGh1bWJuYWlsIGNvbXBvbmVudCB3aGVuIHNpbmdsZSBpbWFnZVxuXHRcdFx0XHRcdGNsaWNrOiB7XG5cdFx0XHRcdFx0XHRzZWxlY3Q6IHRydWUsIC8vIHNldCBzZWxlY3RlZCBpbWFnZSB3aGVuIHRydWVcblx0XHRcdFx0XHRcdG1vZGFsOiBmYWxzZSAvLyBvcGVuIG1vZGFsIHdoZW4gdHJ1ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aG92ZXI6IHtcblx0XHRcdFx0XHRcdHByZWxvYWQ6IGZhbHNlLCAvLyBwcmVsb2FkIGltYWdlIG9uIG1vdXNlb3ZlclxuXHRcdFx0XHRcdFx0c2VsZWN0OiBmYWxzZSAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugb24gbW91c2VvdmVyIHdoZW4gdHJ1ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRyYW5zaXRpb246ICdzbGlkZUxSJywgLy8gdHJhbnNpdGlvbiBlZmZlY3Rcblx0XHRcdFx0dHJhbnNpdGlvblNwZWVkOiAwLjcsIC8vIHRyYW5zaXRpb24gc3BlZWQgMC43c1xuXHRcdFx0XHRzaXplOiAnY29udGFpbicsIC8vIGNvbnRhaW4sIGNvdmVyLCBhdXRvLCBzdHJldGNoXG5cdFx0XHRcdGtleWNvZGVzOiB7XG5cdFx0XHRcdFx0ZXhpdDogWzI3XSwgLy8gZXNjXG5cdFx0XHRcdFx0cGxheXBhdXNlOiBbODBdLCAvLyBwXG5cdFx0XHRcdFx0Zm9yd2FyZDogWzMyLCAzOV0sIC8vIHNwYWNlLCByaWdodCBhcnJvd1xuXHRcdFx0XHRcdGJhY2t3YXJkOiBbMzddLCAvLyBsZWZ0IGFycm93XG5cdFx0XHRcdFx0Zmlyc3Q6IFszOCwgMzZdLCAvLyB1cCBhcnJvdywgaG9tZVxuXHRcdFx0XHRcdGxhc3Q6IFs0MCwgMzVdLCAvLyBkb3duIGFycm93LCBlbmRcblx0XHRcdFx0XHRmdWxsc2NyZWVuOiBbMTNdLCAvLyBlbnRlclxuXHRcdFx0XHRcdG1lbnU6IFs3N10sIC8vIG1cblx0XHRcdFx0XHRjYXB0aW9uOiBbNjddLCAvLyBjXG5cdFx0XHRcdFx0aGVscDogWzcyXSwgLy8gaFxuXHRcdFx0XHRcdHNpemU6IFs4M10sIC8vIHNcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiBbODRdIC8vIHRcblx0XHRcdFx0fSxcblx0XHRcdFx0aGVpZ2h0OiBudWxsLCAvLyBoZWlnaHQgaW4gcGl4ZWxcblx0XHRcdFx0aGVpZ2h0TWluOiBudWxsLCAvLyBtaW4gaGVpZ2h0IGluIHBpeGVsXG5cdFx0XHRcdGhlaWdodEF1dG86IHtcblx0XHRcdFx0XHRpbml0aWFsOiB0cnVlLCAvLyBjYWxjdWxhdGUgZGl2IGhlaWdodCBieSBmaXJzdCBpbWFnZVxuXHRcdFx0XHRcdG9ucmVzaXplOiBmYWxzZSAvLyBjYWxjdWxhdGUgZGl2IGhlaWdodCBvbiB3aW5kb3cgcmVzaXplXG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdFx0bW9kYWw6IHtcblx0XHRcdFx0YXZhaWxhYmxlOiBmYWxzZSxcblx0XHRcdFx0dGl0bGU6ICcnLCAvLyBtb2RhbCB3aW5kb3cgdGl0bGVcblx0XHRcdFx0c3VidGl0bGU6ICcnLCAvLyBtb2RhbCB3aW5kb3cgc3VidGl0bGVcblx0XHRcdFx0dGl0bGVGcm9tSW1hZ2U6IGZhbHNlLCAvLyBmb3JjZSB1cGRhdGUgdGhlIGdhbGxlcnkgdGl0bGUgYnkgaW1hZ2UgdGl0bGVcblx0XHRcdFx0c3VidGl0bGVGcm9tSW1hZ2U6IGZhbHNlLCAvLyBmb3JjZSB1cGRhdGUgdGhlIGdhbGxlcnkgc3VidGl0bGUgYnkgaW1hZ2UgZGVzY3JpcHRpb25cblx0XHRcdFx0Y2FwdGlvbjoge1xuXHRcdFx0XHRcdGRpc2FibGVkOiBmYWxzZSwgLy8gZGlzYWJsZSBpbWFnZSBjYXB0aW9uXG5cdFx0XHRcdFx0dmlzaWJsZTogdHJ1ZSwgLy8gc2hvdy9oaWRlIGltYWdlIGNhcHRpb25cblx0XHRcdFx0XHRwb3NpdGlvbjogJ3RvcCcsIC8vIGNhcHRpb24gcG9zaXRpb24gW3RvcCwgYm90dG9tXVxuXHRcdFx0XHRcdGRvd25sb2FkOiBmYWxzZSAvLyBzaG93L2hpZGUgZG93bmxvYWQgbGlua1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRoZWFkZXI6IHtcblx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLCAvLyBlbmFibGUvZGlzYWJsZSBtb2RhbCBtZW51XG5cdFx0XHRcdFx0ZHluYW1pYzogZmFsc2UsIC8vIHNob3cvaGlkZSBtb2RhbCBtZW51IG9uIG1vdXNlb3ZlclxuXHRcdFx0XHRcdGJ1dHRvbnM6IFsncGxheXN0b3AnLCAnaW5kZXgnLCAncHJldicsICduZXh0JywgJ3BpbicsICdzaXplJywgJ3RyYW5zaXRpb24nLCAndGh1bWJuYWlscycsICdmdWxsc2NyZWVuJywgJ2hlbHAnLCAnY2xvc2UnXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0aGVscDogZmFsc2UsIC8vIHNob3cvaGlkZSBoZWxwXG5cdFx0XHRcdGFycm93czoge1xuXHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsIC8vIHNob3cvaGlkZSBhcnJvd3Ncblx0XHRcdFx0XHRwcmVsb2FkOiBmYWxzZSwgLy8gcHJlbG9hZCBpbWFnZSBvbiBtb3VzZW92ZXJcblx0XHRcdFx0fSxcblx0XHRcdFx0Y2xpY2s6IHtcblx0XHRcdFx0XHRjbG9zZTogdHJ1ZSAvLyB3aGVuIGNsaWNrIG9uIHRoZSBpbWFnZSBjbG9zZSB0aGUgbW9kYWxcblx0XHRcdFx0fSxcblx0XHRcdFx0dGh1bWJuYWlsOiB7XG5cdFx0XHRcdFx0YXZhaWxhYmxlOiBmYWxzZSxcblx0XHRcdFx0XHRoZWlnaHQ6IDUwLCAvLyB0aHVtYm5haWwgaW1hZ2UgaGVpZ2h0IGluIHBpeGVsXG5cdFx0XHRcdFx0aW5kZXg6IGZhbHNlLCAvLyBzaG93IGluZGV4IG51bWJlciBvbiB0aHVtYm5haWxcblx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLCAvLyBlbmFibGUvZGlzYWJsZSB0aHVtYm5haWxzXG5cdFx0XHRcdFx0ZHluYW1pYzogZmFsc2UsIC8vIGlmIHRydWUgdGh1bWJuYWlscyB2aXNpYmxlIG9ubHkgd2hlbiBtb3VzZW92ZXJcblx0XHRcdFx0XHRhdXRvaGlkZTogdHJ1ZSwgLy8gaGlkZSB0aHVtYm5haWwgY29tcG9uZW50IHdoZW4gc2luZ2xlIGltYWdlXG5cdFx0XHRcdFx0Y2xpY2s6IHtcblx0XHRcdFx0XHRcdHNlbGVjdDogdHJ1ZSwgLy8gc2V0IHNlbGVjdGVkIGltYWdlIHdoZW4gdHJ1ZVxuXHRcdFx0XHRcdFx0bW9kYWw6IGZhbHNlIC8vIG9wZW4gbW9kYWwgd2hlbiB0cnVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRob3Zlcjoge1xuXHRcdFx0XHRcdFx0cHJlbG9hZDogZmFsc2UsIC8vIHByZWxvYWQgaW1hZ2Ugb24gbW91c2VvdmVyXG5cdFx0XHRcdFx0XHRzZWxlY3Q6IGZhbHNlIC8vIHNldCBzZWxlY3RlZCBpbWFnZSBvbiBtb3VzZW92ZXIgd2hlbiB0cnVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSxcblx0XHRcdFx0dHJhbnNpdGlvbjogJ3NsaWRlTFInLCAvLyB0cmFuc2l0aW9uIGVmZmVjdFxuXHRcdFx0XHR0cmFuc2l0aW9uU3BlZWQ6IDAuNywgLy8gdHJhbnNpdGlvbiBzcGVlZCAwLjdzXG5cdFx0XHRcdHNpemU6ICdjb3ZlcicsIC8vIGNvbnRhaW4sIGNvdmVyLCBhdXRvLCBzdHJldGNoXG5cdFx0XHRcdGtleWNvZGVzOiB7XG5cdFx0XHRcdFx0ZXhpdDogWzI3XSwgLy8gZXNjXG5cdFx0XHRcdFx0cGxheXBhdXNlOiBbODBdLCAvLyBwXG5cdFx0XHRcdFx0Zm9yd2FyZDogWzMyLCAzOV0sIC8vIHNwYWNlLCByaWdodCBhcnJvd1xuXHRcdFx0XHRcdGJhY2t3YXJkOiBbMzddLCAvLyBsZWZ0IGFycm93XG5cdFx0XHRcdFx0Zmlyc3Q6IFszOCwgMzZdLCAvLyB1cCBhcnJvdywgaG9tZVxuXHRcdFx0XHRcdGxhc3Q6IFs0MCwgMzVdLCAvLyBkb3duIGFycm93LCBlbmRcblx0XHRcdFx0XHRmdWxsc2NyZWVuOiBbMTNdLCAvLyBlbnRlclxuXHRcdFx0XHRcdG1lbnU6IFs3N10sIC8vIG1cblx0XHRcdFx0XHRjYXB0aW9uOiBbNjddLCAvLyBjXG5cdFx0XHRcdFx0aGVscDogWzcyXSwgLy8gaFxuXHRcdFx0XHRcdHNpemU6IFs4M10sIC8vIHNcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiBbODRdIC8vIHRcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHRodW1ibmFpbDoge1xuXHRcdFx0XHRhdmFpbGFibGU6IGZhbHNlLFxuXHRcdFx0XHRoZWlnaHQ6IDUwLCAvLyB0aHVtYm5haWwgaW1hZ2UgaGVpZ2h0IGluIHBpeGVsXG5cdFx0XHRcdGluZGV4OiBmYWxzZSwgLy8gc2hvdyBpbmRleCBudW1iZXIgb24gdGh1bWJuYWlsXG5cdFx0XHRcdGR5bmFtaWM6IGZhbHNlLCAvLyBpZiB0cnVlIHRodW1ibmFpbHMgdmlzaWJsZSBvbmx5IHdoZW4gbW91c2VvdmVyXG5cdFx0XHRcdGF1dG9oaWRlOiBmYWxzZSwgLy8gaGlkZSB0aHVtYm5haWwgY29tcG9uZW50IHdoZW4gc2luZ2xlIGltYWdlXG5cdFx0XHRcdGNsaWNrOiB7XG5cdFx0XHRcdFx0c2VsZWN0OiB0cnVlLCAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugd2hlbiB0cnVlXG5cdFx0XHRcdFx0bW9kYWw6IGZhbHNlIC8vIG9wZW4gbW9kYWwgd2hlbiB0cnVlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhvdmVyOiB7XG5cdFx0XHRcdFx0cHJlbG9hZDogdHJ1ZSwgLy8gcHJlbG9hZCBpbWFnZSBvbiBtb3VzZW92ZXJcblx0XHRcdFx0XHRzZWxlY3Q6IGZhbHNlIC8vIHNldCBzZWxlY3RlZCBpbWFnZSBvbiBtb3VzZW92ZXIgd2hlbiB0cnVlXG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdFx0cGFuZWw6IHtcblx0XHRcdFx0YXZhaWxhYmxlOiBmYWxzZSxcblx0XHRcdFx0dmlzaWJsZTogdHJ1ZSxcblx0XHRcdFx0c2l6ZTogJ2NvdmVyJywgLy8gY29udGFpbiwgY292ZXIsIGF1dG8sIHN0cmV0Y2hcblx0XHRcdFx0aXRlbXM6IHtcblx0XHRcdFx0XHRjbGFzczogJ3JvdycsIC8vIGl0ZW1zIGNsYXNzXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGl0ZW06IHtcblx0XHRcdFx0XHRjbGFzczogJ2NvbC1tZC0zJywgLy8gaXRlbSBjbGFzc1xuXHRcdFx0XHRcdGNhcHRpb246IGZhbHNlLCAvLyBzaG93L2hpZGUgaW1hZ2UgY2FwdGlvblxuXHRcdFx0XHRcdGluZGV4OiBmYWxzZSwgLy8gc2hvdy9oaWRlIGltYWdlIGluZGV4XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhvdmVyOiB7XG5cdFx0XHRcdFx0cHJlbG9hZDogZmFsc2UsIC8vIHByZWxvYWQgaW1hZ2Ugb24gbW91c2VvdmVyXG5cdFx0XHRcdFx0c2VsZWN0OiBmYWxzZSAvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Ugb24gbW91c2VvdmVyIHdoZW4gdHJ1ZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjbGljazoge1xuXHRcdFx0XHRcdHNlbGVjdDogZmFsc2UsIC8vIHNldCBzZWxlY3RlZCBpbWFnZSB3aGVuIHRydWVcblx0XHRcdFx0XHRtb2RhbDogdHJ1ZSAvLyBvcGVuIG1vZGFsIHdoZW4gdHJ1ZVxuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHRcdGltYWdlOiB7XG5cdFx0XHRcdGF2YWlsYWJsZTogZmFsc2UsXG5cdFx0XHRcdHRyYW5zaXRpb246ICdzbGlkZUxSJywgLy8gdHJhbnNpdGlvbiBlZmZlY3Rcblx0XHRcdFx0dHJhbnNpdGlvblNwZWVkOiAwLjcsIC8vIHRyYW5zaXRpb24gc3BlZWQgMC43c1xuXHRcdFx0XHRzaXplOiAnY292ZXInLCAvLyBjb250YWluLCBjb3ZlciwgYXV0bywgc3RyZXRjaFxuXHRcdFx0XHRhcnJvd3M6IHtcblx0XHRcdFx0XHRlbmFibGVkOiBmYWxzZSwgIC8vIHNob3cvaGlkZSBhcnJvd3Ncblx0XHRcdFx0XHRwcmVsb2FkOiBmYWxzZSwgLy8gcHJlbG9hZCBpbWFnZSBvbiBtb3VzZW92ZXJcblx0XHRcdFx0fSxcblx0XHRcdFx0Y2xpY2s6IHtcblx0XHRcdFx0XHRtb2RhbDogdHJ1ZSAvLyB3aGVuIGNsaWNrIG9uIHRoZSBpbWFnZSBvcGVuIHRoZSBtb2RhbCB3aW5kb3dcblx0XHRcdFx0fSxcblx0XHRcdFx0aGVpZ2h0OiBudWxsLCAvLyBoZWlnaHQgaW4gcGl4ZWxcblx0XHRcdFx0aGVpZ2h0TWluOiBudWxsLCAvLyBtaW4gaGVpZ2h0IGluIHBpeGVsXG5cdFx0XHRcdGhlaWdodEF1dG86IHtcblx0XHRcdFx0XHRpbml0aWFsOiB0cnVlLCAvLyBjYWxjdWxhdGUgZGl2IGhlaWdodCBieSBmaXJzdCBpbWFnZVxuXHRcdFx0XHRcdG9ucmVzaXplOiBmYWxzZSAvLyBjYWxjdWxhdGUgZGl2IGhlaWdodCBvbiB3aW5kb3cgcmVzaXplXG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdFx0aXRlbToge1xuXHRcdFx0XHRhdmFpbGFibGU6IGZhbHNlLFxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XG5cdFx0XHRcdHRyYW5zaXRpb25TcGVlZDogMC43LCAvLyB0cmFuc2l0aW9uIHNwZWVkIDAuN3Ncblx0XHRcdFx0c2l6ZTogJ2NvdmVyJywgLy8gY29udGFpbiwgY292ZXIsIGF1dG8sIHN0cmV0Y2hcblx0XHRcdFx0YXJyb3dzOiB7XG5cdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsICAvLyBzaG93L2hpZGUgYXJyb3dzXG5cdFx0XHRcdFx0cHJlbG9hZDogZmFsc2UsIC8vIHByZWxvYWQgaW1hZ2Ugb24gbW91c2VvdmVyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNsaWNrOiB7XG5cdFx0XHRcdFx0bW9kYWw6IHRydWUgLy8gd2hlbiBjbGljayBvbiB0aGUgaW1hZ2Ugb3BlbiB0aGUgbW9kYWwgd2luZG93XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhlaWdodDogbnVsbCwgLy8gaGVpZ2h0IGluIHBpeGVsXG5cdFx0XHRcdGhlaWdodE1pbjogbnVsbCwgLy8gbWluIGhlaWdodCBpbiBwaXhlbFxuXHRcdFx0XHRoZWlnaHRBdXRvOiB7XG5cdFx0XHRcdFx0aW5pdGlhbDogdHJ1ZSwgLy8gY2FsY3VsYXRlIGRpdiBoZWlnaHQgYnkgZmlyc3QgaW1hZ2Vcblx0XHRcdFx0XHRvbnJlc2l6ZTogZmFsc2UgLy8gY2FsY3VsYXRlIGRpdiBoZWlnaHQgb24gd2luZG93IHJlc2l6ZVxuXHRcdFx0XHR9LFxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvLyBhdmFpbGFibGUgaW1hZ2Ugc2l6ZXNcblx0XHRwdWJsaWMgc2l6ZXM6IEFycmF5PHN0cmluZz4gPSBbXG5cdFx0XHQnY29udGFpbicsXG5cdFx0XHQnY292ZXInLFxuXHRcdFx0J2F1dG8nLFxuXHRcdFx0J3N0cmV0Y2gnXG5cdFx0XTtcblxuXHRcdC8vIGF2YWlsYWJsZSB0aGVtZXNcblx0XHRwdWJsaWMgdGhlbWVzOiBBcnJheTxzdHJpbmc+ID0gW1xuXHRcdFx0J2RlZmF1bHQnLFxuXHRcdFx0J2RhcmtibHVlJyxcblx0XHRcdCd3aGl0ZWdvbGQnXG5cdFx0XTtcblxuXHRcdC8vIGF2YWlsYWJsZSB0cmFuc2l0aW9uc1xuXHRcdHB1YmxpYyB0cmFuc2l0aW9uczogQXJyYXk8c3RyaW5nPiA9IFtcblx0XHRcdCdubycsXG5cdFx0XHQnZmFkZUluT3V0Jyxcblx0XHRcdCd6b29tSW4nLFxuXHRcdFx0J3pvb21PdXQnLFxuXHRcdFx0J3pvb21Jbk91dCcsXG5cdFx0XHQncm90YXRlTFInLFxuXHRcdFx0J3JvdGF0ZVRCJyxcblx0XHRcdCdyb3RhdGVaWScsXG5cdFx0XHQnc2xpZGVMUicsXG5cdFx0XHQnc2xpZGVUQicsXG5cdFx0XHQnemxpZGVMUicsXG5cdFx0XHQnemxpZGVUQicsXG5cdFx0XHQnZmxpcFgnLFxuXHRcdFx0J2ZsaXBZJ1xuXHRcdF07XG5cblx0XHRwdWJsaWMgZXZlbnRzID0ge1xuXHRcdFx0Q09ORklHX0xPQUQ6ICdBU0ctY29uZmlnLWxvYWQtJyxcblx0XHRcdEFVVE9QTEFZX1NUQVJUOiAnQVNHLWF1dG9wbGF5LXN0YXJ0LScsXG5cdFx0XHRBVVRPUExBWV9TVE9QOiAnQVNHLWF1dG9wbGF5LXN0b3AtJyxcblx0XHRcdFBBUlNFX0lNQUdFUzogJ0FTRy1wYXJzZS1pbWFnZXMtJyxcblx0XHRcdExPQURfSU1BR0U6ICdBU0ctbG9hZC1pbWFnZS0nLFxuXHRcdFx0RklSU1RfSU1BR0U6ICdBU0ctZmlyc3QtaW1hZ2UtJyxcblx0XHRcdENIQU5HRV9JTUFHRTogJ0FTRy1jaGFuZ2UtaW1hZ2UtJyxcblx0XHRcdERPVUJMRV9JTUFHRTogJ0FTRy1kb3VibGUtaW1hZ2UtJyxcblx0XHRcdE1PREFMX09QRU46ICdBU0ctbW9kYWwtb3Blbi0nLFxuXHRcdFx0TU9EQUxfQ0xPU0U6ICdBU0ctbW9kYWwtY2xvc2UtJyxcblx0XHRcdFRIVU1CTkFJTF9NT1ZFOiAnQVNHLXRodW1ibmFpbC1tb3ZlLScsXG5cdFx0XHRHQUxMRVJZX1VQREFURUQ6ICdBU0ctZ2FsbGVyeS11cGRhdGVkLScsXG5cdFx0XHRMQVNUX1RIVU1CTkFJTDogJ0FTRy1sYXN0LXRodW1ibmFpbC0nLFxuXHRcdFx0R0FMTEVSWV9FRElUOiAnQVNHLWdhbGxlcnktZWRpdCcsXG5cdFx0fTtcblxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSBpbnRlcnZhbDogbmcuSUludGVydmFsU2VydmljZSxcblx0XHRcdHByaXZhdGUgbG9jYXRpb246IG5nLklMb2NhdGlvblNlcnZpY2UsXG5cdFx0XHRwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSAkd2luZG93OiBuZy5JV2luZG93U2VydmljZSxcblx0XHRcdHByaXZhdGUgJHNjZTogbmcuSVNDRVNlcnZpY2UpIHtcblxuXHRcdFx0YW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoJ3Jlc2l6ZScsIChldmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKDIwMCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gdXBkYXRlIGltYWdlcyB3aGVuIGVkaXQgZXZlbnRcblx0XHRcdCRyb290U2NvcGUuJG9uKHRoaXMuZXZlbnRzLkdBTExFUllfRURJVCwgKGV2ZW50LCBkYXRhKSA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLmluc3RhbmNlc1tkYXRhLmlkXSkge1xuXHRcdFx0XHRcdHRoaXMuaW5zdGFuY2VzW2RhdGEuaWRdLmVkaXRHYWxsZXJ5KGRhdGEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdH1cblxuXHRcdHByaXZhdGUgcGFyc2VIYXNoKCkge1xuXG5cdFx0XHRpZiAoIXRoaXMuaWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXRoaXMub3B0aW9ucy5oYXNoVXJsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGhhc2ggPSB0aGlzLmxvY2F0aW9uLmhhc2goKTtcblx0XHRcdGxldCBwYXJ0cyA9IGhhc2ggPyBoYXNoLnNwbGl0KCctJykgOiBudWxsO1xuXG5cdFx0XHRpZiAocGFydHMgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAocGFydHNbMF0gIT09IHRoaXMuc2x1Zykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChwYXJ0cy5sZW5ndGggIT09IDMpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAocGFydHNbMV0gIT09IHRoaXMuaWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgaW5kZXggPSBwYXJzZUludChwYXJ0c1syXSwgMTApO1xuXG5cdFx0XHRpZiAoIWFuZ3VsYXIuaXNOdW1iZXIoaW5kZXgpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcblxuXHRcdFx0XHRpbmRleC0tO1xuXHRcdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXg7XG5cdFx0XHRcdHRoaXMubW9kYWxPcGVuKGluZGV4KTtcblxuXHRcdFx0fSwgMjApO1xuXG5cdFx0fVxuXG5cdFx0Ly8gY2FsY3VsYXRlIG9iamVjdCBoYXNoIGlkXG5cdFx0cHVibGljIG9iamVjdEhhc2hJZChvYmplY3Q6IGFueSk6IHN0cmluZyB7XG5cblx0XHRcdGxldCBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeShvYmplY3QpO1xuXG5cdFx0XHRpZiAoIXN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGFiYyA9IHN0cmluZy5yZXBsYWNlKC9bXmEtekEtWjAtOV0rL2csICcnKTtcblx0XHRcdGxldCBjb2RlID0gMDtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDAsIG4gPSBhYmMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdGxldCBjaGFyY29kZSA9IGFiYy5jaGFyQ29kZUF0KGkpO1xuXHRcdFx0XHRjb2RlICs9IChjaGFyY29kZSAqIGkpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gJ2lkJyArIGNvZGUudG9TdHJpbmcoMjEpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2UgZm9yIGN1cnJlbnQgZ2FsbGVyeSBieSBjb21wb25lbnQgaWRcblx0XHRwdWJsaWMgZ2V0SW5zdGFuY2UoY29tcG9uZW50OiBhbnkpIHtcblxuXHRcdFx0aWYgKCFjb21wb25lbnQuaWQpIHtcblxuXHRcdFx0XHQvLyBnZXQgcGFyZW50IGFzZyBjb21wb25lbnQgaWRcblx0XHRcdFx0aWYgKGNvbXBvbmVudC4kc2NvcGUgJiYgY29tcG9uZW50LiRzY29wZS4kcGFyZW50ICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudC4kcGFyZW50ICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudC4kcGFyZW50LiRjdHJsKSB7XG5cdFx0XHRcdFx0Y29tcG9uZW50LmlkID0gY29tcG9uZW50LiRzY29wZS4kcGFyZW50LiRwYXJlbnQuJGN0cmwuaWQ7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29tcG9uZW50LmlkID0gdGhpcy5vYmplY3RIYXNoSWQoY29tcG9uZW50Lm9wdGlvbnMgPyBjb21wb25lbnQub3B0aW9ucyA6IHsnYXNnJzogMX0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaWQgPSBjb21wb25lbnQuaWQ7XG5cdFx0XHRsZXQgaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1tpZF07XG5cblx0XHRcdC8vIG5ldyBpbnN0YW5jZSBhbmQgc2V0IG9wdGlvbnMgYW5kIGl0ZW1zXG5cdFx0XHRpZiAoaW5zdGFuY2UgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRpbnN0YW5jZSA9IG5ldyBTZXJ2aWNlQ29udHJvbGxlcih0aGlzLnRpbWVvdXQsIHRoaXMuaW50ZXJ2YWwsIHRoaXMubG9jYXRpb24sIHRoaXMuJHJvb3RTY29wZSwgdGhpcy4kd2luZG93LCB0aGlzLiRzY2UpO1xuXHRcdFx0XHRpbnN0YW5jZS5pZCA9IGlkO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY29tcG9uZW50LmJhc2VVcmwpIHtcblx0XHRcdFx0Y29tcG9uZW50Lm9wdGlvbnMuYmFzZVVybCA9IGNvbXBvbmVudC5iYXNlVXJsO1xuXHRcdFx0fVxuXG5cdFx0XHRpbnN0YW5jZS5zZXRPcHRpb25zKGNvbXBvbmVudC5vcHRpb25zKTtcblxuXHRcdFx0aWYgKGNvbXBvbmVudC5pdGVtcykge1xuXHRcdFx0XHRpbnN0YW5jZS5zZXRJdGVtcyhjb21wb25lbnQuaXRlbXMpO1xuXHRcdFx0fVxuXG5cdFx0XHRpbnN0YW5jZS5zZWxlY3RlZCA9IGNvbXBvbmVudC5zZWxlY3RlZCA/IGNvbXBvbmVudC5zZWxlY3RlZCA6IGluc3RhbmNlLm9wdGlvbnMuc2VsZWN0ZWQ7XG5cdFx0XHRpbnN0YW5jZS5wYXJzZUhhc2goKTtcblxuXHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMpIHtcblxuXHRcdFx0XHQvL2luc3RhbmNlLmxvYWRJbWFnZXMoaW5zdGFuY2Uub3B0aW9ucy5wcmVsb2FkKTtcblxuXHRcdFx0XHRpZiAoaW5zdGFuY2Uub3B0aW9ucy5hdXRvcGxheSAmJiBpbnN0YW5jZS5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgJiYgIWluc3RhbmNlLmF1dG9wbGF5KSB7XG5cdFx0XHRcdFx0aW5zdGFuY2UuYXV0b1BsYXlTdGFydCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0dGhpcy5pbnN0YW5jZXNbaWRdID0gaW5zdGFuY2U7XG5cdFx0XHRyZXR1cm4gaW5zdGFuY2U7XG5cblx0XHR9XG5cblx0XHQvLyBwcmVwYXJlIGltYWdlcyBhcnJheVxuXHRcdHB1YmxpYyBzZXRJdGVtcyhpdGVtczogQXJyYXk8SUZpbGU+KSB7XG5cblx0XHRcdHRoaXMuaXRlbXMgPSBpdGVtcyA/IGl0ZW1zIDogW107XG5cdFx0XHR0aGlzLnByZXBhcmVJdGVtcygpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gb3B0aW9ucyBzZXR1cFxuXHRcdHB1YmxpYyBzZXRPcHRpb25zKG9wdGlvbnM6IElPcHRpb25zKSB7XG5cblx0XHRcdC8vIGlmIG9wdGlvbnMgYWxyZWFkeSBzZXR1cFxuXHRcdFx0aWYgKHRoaXMub3B0aW9uc0xvYWRlZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMub3B0aW9ucyA9IGFuZ3VsYXIuY29weSh0aGlzLmRlZmF1bHRzKTtcblxuXHRcdFx0aWYgKG9wdGlvbnMpIHtcblxuXHRcdFx0XHRhbmd1bGFyLm1lcmdlKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cblx0XHRcdFx0bGV0IG1vZGFsSGVhZGVyQnV0dG9ucyA9IG9wdGlvbnMubW9kYWwgJiYgb3B0aW9ucy5tb2RhbC5oZWFkZXIgJiYgb3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucztcblx0XHRcdFx0bGV0IGNvbnRhaW5lckhlYWRlckJ1dHRvbnMgPSBvcHRpb25zLmNvbnRhaW5lciAmJiBvcHRpb25zLmNvbnRhaW5lci5oZWFkZXIgJiYgb3B0aW9ucy5jb250YWluZXIuaGVhZGVyLmJ1dHRvbnM7XG5cblx0XHRcdFx0aWYgKG1vZGFsSGVhZGVyQnV0dG9ucykge1xuXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLm1vZGFsLmhlYWRlci5idXR0b25zID0gb3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucztcblxuXHRcdFx0XHRcdC8vIHJlbW92ZSBkdXBsaWNhdGVzIGZyb20gYnV0dG9uc1xuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucyA9IHRoaXMub3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucy5maWx0ZXIoZnVuY3Rpb24gKHgsIGksIGEpIHtcblx0XHRcdFx0XHRcdHJldHVybiBhLmluZGV4T2YoeCkgPT09IGk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjb250YWluZXJIZWFkZXJCdXR0b25zKSB7XG5cblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuY29udGFpbmVyLmhlYWRlci5idXR0b25zID0gb3B0aW9ucy5jb250YWluZXIuaGVhZGVyLmJ1dHRvbnM7XG5cblx0XHRcdFx0XHQvLyByZW1vdmUgZHVwbGljYXRlcyBmcm9tIGJ1dHRvbnNcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuY29udGFpbmVyLmhlYWRlci5idXR0b25zID0gdGhpcy5vcHRpb25zLmNvbnRhaW5lci5oZWFkZXIuYnV0dG9ucy5maWx0ZXIoZnVuY3Rpb24gKHgsIGksIGEpIHtcblx0XHRcdFx0XHRcdHJldHVybiBhLmluZGV4T2YoeCkgPT09IGk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMub3B0aW9uc0xvYWRlZCA9IHRydWU7XG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gaWYgIXRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsXG5cdFx0XHRpZiAoIXRoaXMuJHdpbmRvdy5zY3JlZW5mdWxsKSB7XG5cdFx0XHRcdHRoaXMub3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucyA9IHRoaXMub3B0aW9ucy5tb2RhbC5oZWFkZXIuYnV0dG9ucy5maWx0ZXIoZnVuY3Rpb24gKHgsIGksIGEpIHtcblx0XHRcdFx0XHRyZXR1cm4geCAhPT0gJ2Z1bGxzY3JlZW4nO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXG5cdFx0XHQvLyBpbXBvcnRhbnQhXG5cdFx0XHRvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkNPTkZJR19MT0FELCB0aGlzLm9wdGlvbnMpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zO1xuXG5cdFx0fVxuXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2OiBudW1iZXIpIHtcblxuXHRcdFx0diA9IHRoaXMubm9ybWFsaXplKHYpO1xuXHRcdFx0bGV0IHByZXYgPSB0aGlzLl9zZWxlY3RlZDtcblxuXHRcdFx0aWYgKHByZXYgIT0gdiAmJiB0aGlzLmZpbGUgJiYgdGhpcy5maWxlLnZpZGVvICYmIHRoaXMuZmlsZS52aWRlby5wbGF5aW5nKSB7XG5cdFx0XHRcdHRoaXMuZmlsZS52aWRlby5wbGF5ZXIucGF1c2UoKTtcblx0XHRcdFx0dGhpcy5maWxlLnZpZGVvLnBhdXNlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX3NlbGVjdGVkID0gdjtcblxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5jb250YWluZXIuYXZhaWxhYmxlICYmIHRoaXMub3B0aW9ucy5jb250YWluZXIudmlzaWJsZSkge1xuXHRcdFx0XHR0aGlzLnByZWxvYWRJbWFnZSh0aGlzLl9zZWxlY3RlZCwgJ2xhcmdlJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vdGhpcy5sb2FkSW1hZ2UodGhpcy5fc2VsZWN0ZWQpO1xuXHRcdFx0Ly8gdGhpcy5wcmVsb2FkKCk7XG5cblx0XHRcdGlmICh0aGlzLmZpbGUpIHtcblxuXHRcdFx0XHRpZiAodGhpcy5vcHRpb25zLm1vZGFsLnRpdGxlRnJvbUltYWdlICYmIHRoaXMuZmlsZS50aXRsZSkge1xuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5tb2RhbC50aXRsZSA9IHRoaXMuZmlsZS50aXRsZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0aGlzLm9wdGlvbnMubW9kYWwuc3VidGl0bGVGcm9tSW1hZ2UgJiYgdGhpcy5maWxlLmRlc2NyaXB0aW9uKSB7XG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLm1vZGFsLnN1YnRpdGxlID0gdGhpcy5maWxlLmRlc2NyaXB0aW9uO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMuZmlsZS52aWRlbyAmJiB0aGlzLmZpbGUudmlkZW8ucGF1c2VkKSB7XG5cdFx0XHRcdFx0dGhpcy5maWxlLnZpZGVvLnBsYXllci5wbGF5KCk7XG5cdFx0XHRcdFx0dGhpcy5maWxlLnZpZGVvLnBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKHByZXYgIT09IHRoaXMuX3NlbGVjdGVkKSB7XG5cblx0XHRcdFx0dGhpcy50aHVtYm5haWxzTW92ZSgpO1xuXHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkNIQU5HRV9JTUFHRSwge1xuXHRcdFx0XHRcdGluZGV4OiB2LFxuXHRcdFx0XHRcdGZpbGU6IHRoaXMuZmlsZVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLm9wdGlvbnMuc2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3RlZDtcblxuXHRcdH1cblxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XG5cblx0XHRcdHJldHVybiB0aGlzLl9zZWxlY3RlZDtcblxuXHRcdH1cblxuXHRcdC8vIGZvcmNlIHNlbGVjdCBpbWFnZVxuXHRcdHB1YmxpYyBmb3JjZVNlbGVjdChpbmRleCkge1xuXG5cdFx0XHRpbmRleCA9IHRoaXMubm9ybWFsaXplKGluZGV4KTtcblx0XHRcdHRoaXMuX3NlbGVjdGVkID0gaW5kZXg7XG5cdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLl9zZWxlY3RlZCk7XG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcblx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuQ0hBTkdFX0lNQUdFLCB7XG5cdFx0XHRcdGluZGV4OiBpbmRleCxcblx0XHRcdFx0ZmlsZTogdGhpcy5maWxlXG5cdFx0XHR9KTtcblxuXHRcdH1cblxuXG5cdFx0cHVibGljIHNldFNlbGVjdGVkKGluZGV4OiBudW1iZXIpIHtcblxuXHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gaW5kZXggPiB0aGlzLnNlbGVjdGVkID8gJ2ZvcndhcmQnIDogJ2JhY2t3YXJkJztcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleDtcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xuXG5cdFx0fVxuXG5cblx0XHQvLyBnbyB0byBiYWNrd2FyZFxuXHRcdHB1YmxpYyB0b0JhY2t3YXJkKHN0b3A/OiBib29sZWFuKSB7XG5cblx0XHRcdGlmIChzdG9wKSB7XG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2JhY2t3YXJkJztcblx0XHRcdHRoaXMuc2VsZWN0ZWQtLTtcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdG8gZm9yd2FyZFxuXHRcdHB1YmxpYyB0b0ZvcndhcmQoc3RvcD86IGJvb2xlYW4pIHtcblxuXHRcdFx0aWYgKHN0b3ApIHtcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XG5cdFx0XHR0aGlzLnNlbGVjdGVkKys7XG5cdFx0XHR0aGlzLnNldEhhc2goKTtcblxuXHRcdH1cblxuXHRcdC8vIGdvIHRvIGZpcnN0XG5cdFx0cHVibGljIHRvRmlyc3Qoc3RvcD86IGJvb2xlYW4pIHtcblxuXHRcdFx0aWYgKHN0b3ApIHtcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnYmFja3dhcmQnO1xuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IDA7XG5cdFx0XHR0aGlzLnNldEhhc2goKTtcblxuXHRcdH1cblxuXHRcdC8vIGdvIHRvIGxhc3Rcblx0XHRwdWJsaWMgdG9MYXN0KHN0b3A/OiBib29sZWFuKSB7XG5cblx0XHRcdGlmIChzdG9wKSB7XG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2ZvcndhcmQnO1xuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IHRoaXMuaXRlbXMubGVuZ3RoIC0gMTtcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xuXG5cdFx0fVxuXG5cdFx0cHVibGljIHNldEhhc2goKSB7XG5cblx0XHRcdGlmICh0aGlzLm1vZGFsVmlzaWJsZSAmJiB0aGlzLm9wdGlvbnMuaGFzaFVybCkge1xuXHRcdFx0XHR0aGlzLmxvY2F0aW9uLmhhc2goW3RoaXMuc2x1ZywgdGhpcy5pZCwgdGhpcy5zZWxlY3RlZCArIDFdLmpvaW4oJy0nKSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgYXV0b1BsYXlUb2dnbGUoKSB7XG5cblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCkge1xuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0YXJ0KCk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblxuXHRcdHB1YmxpYyBhdXRvUGxheVN0b3AoKSB7XG5cblx0XHRcdGlmICghdGhpcy5hdXRvcGxheSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuaW50ZXJ2YWwuY2FuY2VsKHRoaXMuYXV0b3BsYXkpO1xuXHRcdFx0dGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgPSBmYWxzZTtcblx0XHRcdHRoaXMuYXV0b3BsYXkgPSBudWxsO1xuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5BVVRPUExBWV9TVE9QLCB7IGluZGV4OiB0aGlzLnNlbGVjdGVkLCBmaWxlOiB0aGlzLmZpbGUgfSk7XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgYXV0b1BsYXlTdGFydCgpIHtcblxuXHRcdFx0aWYgKHRoaXMuYXV0b3BsYXkpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCA9IHRydWU7XG5cdFx0XHR0aGlzLmF1dG9wbGF5ID0gdGhpcy5pbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdHRoaXMudG9Gb3J3YXJkKCk7XG5cdFx0XHR9LCB0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZGVsYXkpO1xuXG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkFVVE9QTEFZX1NUQVJULCB7IGluZGV4OiB0aGlzLnNlbGVjdGVkLCBmaWxlOiB0aGlzLmZpbGUgfSk7XG5cblx0XHR9XG5cblxuXHRcdHByaXZhdGUgcHJlcGFyZUl0ZW1zKCkge1xuXG5cdFx0XHRsZXQgbGVuZ3RoID0gdGhpcy5pdGVtcy5sZW5ndGg7XG5cdFx0XHRmb3IgKGxldCBrZXkgPSAwOyBrZXkgPCBsZW5ndGg7IGtleSsrKSB7XG5cdFx0XHRcdHRoaXMuYWRkSW1hZ2UodGhpcy5pdGVtc1trZXldKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5QQVJTRV9JTUFHRVMsIHRoaXMuZmlsZXMpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gcHJlbG9hZCB0aGUgaW1hZ2Ugd2hlbiBtb3VzZW92ZXJcblx0XHRwdWJsaWMgaG92ZXJQcmVsb2FkKGluZGV4OiBudW1iZXIpIHtcblxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoaW5kZXgpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gaW1hZ2UgcHJlbG9hZFxuXHRcdHByaXZhdGUgcHJlbG9hZCh3YWl0PzogbnVtYmVyKSB7XG5cblx0XHRcdGxldCBpbmRleCA9IHRoaXMuZGlyZWN0aW9uID09PSAnZm9yd2FyZCcgPyB0aGlzLnNlbGVjdGVkICsgMSA6IHRoaXMuc2VsZWN0ZWQgLSAxO1xuXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnByZWxvYWROZXh0ID09PSB0cnVlKSB7XG5cdFx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UoaW5kZXgpO1xuXHRcdFx0XHR9LCAod2FpdCAhPT0gdW5kZWZpbmVkKSA/IHdhaXQgOiB0aGlzLm9wdGlvbnMucHJlbG9hZERlbGF5KTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHB1YmxpYyBub3JtYWxpemUoaW5kZXg6IG51bWJlcikge1xuXG5cdFx0XHRsZXQgbGFzdCA9IHRoaXMuZmlsZXMubGVuZ3RoIC0gMTtcblxuXHRcdFx0aWYgKGluZGV4ID4gbGFzdCkge1xuXHRcdFx0XHRyZXR1cm4gKGluZGV4IC0gbGFzdCkgLSAxO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaW5kZXggPCAwKSB7XG5cdFx0XHRcdHJldHVybiBsYXN0IC0gTWF0aC5hYnMoaW5kZXgpICsgMTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGluZGV4O1xuXG5cdFx0fVxuXG5cblx0XHRwdWJsaWMgbG9hZEltYWdlcyhpbmRleGVzOiBBcnJheTxudW1iZXI+LCB0eXBlOiBzdHJpbmcpIHtcblxuXHRcdFx0aWYgKCFpbmRleGVzIHx8IGluZGV4ZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdFx0XHRpbmRleGVzLmZvckVhY2goKGluZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdFx0c2VsZi5sb2FkSW1hZ2UoaW5kZXgpO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cblxuXHRcdHB1YmxpYyBwcmVsb2FkSW1hZ2UoaW5kZXgsIHNpemUsIGNhbGxiYWNrPzoge30pIHtcblxuXHRcdFx0aW5kZXggPSBpbmRleCA/IGluZGV4IDogdGhpcy5zZWxlY3RlZDtcblx0XHRcdGluZGV4ID0gdGhpcy5ub3JtYWxpemUoaW5kZXgpO1xuXG5cdFx0XHRpZiAoIXRoaXMuZmlsZXNbaW5kZXhdKSB7XG5cdFx0XHRcdHRoaXMubG9nKCdpbnZhbGlkIGZpbGUgaW5kZXgnLCB7IGluZGV4OiBpbmRleCB9KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5maWxlc1tpbmRleF0ubG9hZGVkW3NpemVdID09PSB0cnVlKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGltZyA9IG5ldyBJbWFnZSgpO1xuXHRcdFx0aW1nLnNyYyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZVtzaXplXTtcblx0XHRcdGltZy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG5cdFx0XHRcdHRoaXMuYWZ0ZXJMb2FkKGluZGV4LCBzaXplLCBpbWcpO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgbG9hZEltYWdlKGluZGV4PzogbnVtYmVyLCBjYWxsYmFjaz86IHt9KSB7XG5cblx0XHRcdGluZGV4ID0gaW5kZXggPyBpbmRleCA6IHRoaXMuc2VsZWN0ZWQ7XG5cdFx0XHRpbmRleCA9IHRoaXMubm9ybWFsaXplKGluZGV4KTtcblxuXHRcdFx0aWYgKCF0aGlzLmZpbGVzW2luZGV4XSkge1xuXHRcdFx0XHR0aGlzLmxvZygnaW52YWxpZCBmaWxlIGluZGV4JywgeyBpbmRleDogaW5kZXggfSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMubW9kYWxWaXNpYmxlKSB7XG5cblx0XHRcdFx0aWYgKHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZC5sYXJnZSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBsYXJnZSA9IG5ldyBJbWFnZSgpO1xuXHRcdFx0XHRsYXJnZS5zcmMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2UubGFyZ2U7XG5cdFx0XHRcdGxhcmdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcblx0XHRcdFx0XHR0aGlzLmFmdGVyTG9hZChpbmRleCwgJ2xhcmdlJywgbGFyZ2UpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRpZiAodGhpcy5maWxlc1tpbmRleF0ubG9hZGVkLm1lZGl1bSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBtZWRpdW0gPSBuZXcgSW1hZ2UoKTtcblx0XHRcdFx0bWVkaXVtLnNyYyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5tZWRpdW07XG5cdFx0XHRcdG1lZGl1bS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuYWZ0ZXJMb2FkKGluZGV4LCAnbWVkaXVtJywgbWVkaXVtKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIGdldCBmaWxlIG5hbWVcblx0XHRwcml2YXRlIGdldEZpbGVuYW1lKGluZGV4OiBudW1iZXIsIHR5cGU/OiBzdHJpbmcpIHtcblxuXHRcdFx0dHlwZSA9IHR5cGUgPyB0eXBlIDogJ21vZGFsJztcblx0XHRcdGxldCBmaWxlcGFydHMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2VbdHlwZV0uc3BsaXQoJy8nKTtcblx0XHRcdGxldCBmaWxlbmFtZSA9IGZpbGVwYXJ0c1tmaWxlcGFydHMubGVuZ3RoIC0gMV07XG5cdFx0XHRyZXR1cm4gZmlsZW5hbWU7XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgZmlsZSBleHRlbnNpb25cblx0XHRwcml2YXRlIGdldEV4dGVuc2lvbihpbmRleDogbnVtYmVyLCB0eXBlPzogc3RyaW5nKSB7XG5cblx0XHRcdHR5cGUgPSB0eXBlID8gdHlwZSA6ICdtb2RhbCc7XG5cdFx0XHRsZXQgZmlsZXBhcnRzID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlW3R5cGVdLnNwbGl0KCcuJyk7XG5cdFx0XHRsZXQgZXh0ZW5zaW9uID0gZmlsZXBhcnRzW2ZpbGVwYXJ0cy5sZW5ndGggLSAxXTtcblx0XHRcdHJldHVybiBleHRlbnNpb247XG5cblx0XHR9XG5cblx0XHQvLyBhZnRlciBsb2FkIGltYWdlXG5cdFx0cHJpdmF0ZSBhZnRlckxvYWQoaW5kZXgsIHR5cGUsIGltYWdlKSB7XG5cblx0XHRcdGlmICghdGhpcy5maWxlc1tpbmRleF0gfHwgIXRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWRbdHlwZV0gPT09IHRydWUpIHtcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubG9hZGVkW3R5cGVdID0gdHJ1ZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZSA9PT0gJ2xhcmdlJykge1xuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS53aWR0aCA9IGltYWdlLndpZHRoO1xuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLm5hbWUgPSB0aGlzLmdldEZpbGVuYW1lKGluZGV4LCB0eXBlKTtcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0uZXh0ZW5zaW9uID0gdGhpcy5nZXRFeHRlbnNpb24oaW5kZXgsIHR5cGUpO1xuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5kb3dubG9hZCA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZS5sYXJnZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubG9hZGVkW3R5cGVdID0gdHJ1ZTtcblxuXHRcdFx0bGV0IGRhdGEgPSB7IHR5cGU6IHR5cGUsIGluZGV4OiBpbmRleCwgZmlsZTogdGhpcy5maWxlLCBpbWc6IGltYWdlIH07XG5cblx0XHRcdGlmICghdGhpcy5maXJzdCkge1xuXHRcdFx0XHR0aGlzLmZpcnN0ID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5GSVJTVF9JTUFHRSwgZGF0YSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLkxPQURfSU1BR0UsIGRhdGEpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cblx0XHQvLyBpcyBzaW5nbGU/XG5cdFx0cHVibGljIGdldCBpc1NpbmdsZSgpIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuZmlsZXMubGVuZ3RoID4gMSA/IGZhbHNlIDogdHJ1ZTtcblxuXHRcdH1cblxuXG5cdFx0Ly8gZ2V0IHRoZSBkb3dubG9hZCBsaW5rXG5cdFx0cHVibGljIGRvd25sb2FkTGluaygpIHtcblxuXHRcdFx0aWYgKHRoaXMuc2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZmlsZXNbdGhpcy5zZWxlY3RlZF0uc291cmNlLmxhcmdlO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cblx0XHQvLyBnZXQgdGhlIGZpbGVcblx0XHRwdWJsaWMgZ2V0IGZpbGUoKTogSUZpbGUge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlc1t0aGlzLnNlbGVjdGVkXTtcblxuXHRcdH1cblxuXHRcdC8vIHRvZ2dsZSBlbGVtZW50IHZpc2libGVcblx0XHRwdWJsaWMgdG9nZ2xlKGVsZW1lbnQ6IHN0cmluZyk6IHZvaWQge1xuXG5cdFx0XHR0aGlzLm9wdGlvbnNbZWxlbWVudF0udmlzaWJsZSA9ICF0aGlzLm9wdGlvbnNbZWxlbWVudF0udmlzaWJsZTtcblxuXHRcdH1cblxuXG5cdFx0Ly8gZ2V0IHZpc2libGVcblx0XHRwdWJsaWMgZ2V0IG1vZGFsVmlzaWJsZSgpOiBib29sZWFuIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuX3Zpc2libGU7XG5cblx0XHR9XG5cblxuXHRcdC8vIGdldCB0aGVtZVxuXHRcdHB1YmxpYyBnZXQgdGhlbWUoKTogc3RyaW5nIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucy50aGVtZTtcblxuXHRcdH1cblxuXHRcdC8vIGdldCBjbGFzc2VzXG5cdFx0cHVibGljIGdldCBjbGFzc2VzKCk6IHN0cmluZyB7XG5cblx0XHRcdHJldHVybiAnYXNnLXRoZW1lLScgKyB0aGlzLm9wdGlvbnMudGhlbWUgKyAnICcgKyB0aGlzLmlkICsgKHRoaXMuZWRpdGluZyA/ICcgZWRpdGluZycgOiAnJyk7XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgcHJlbG9hZCBzdHlsZVxuXHRcdHB1YmxpYyBkeW5hbWljU3R5bGUoZmlsZTogSUZpbGUsIHR5cGU6IHN0cmluZywgY29uZmlnOiBJT3B0aW9uc01vZGFsIHwgSU9wdGlvbnNJbWFnZSkge1xuXG5cdFx0XHRsZXQgc3R5bGUgPSB7fTtcblxuXHRcdFx0aWYgKCFmaWxlKSB7XG5cdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGZpbGUuc291cmNlLmNvbG9yKSB7XG5cdFx0XHRcdHN0eWxlWydiYWNrZ3JvdW5kLWNvbG9yJ10gPSBmaWxlLnNvdXJjZS5jb2xvcjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5sb2FkaW5nSW1hZ2UgJiYgZmlsZS5sb2FkZWRbdHlwZV0gPT09IGZhbHNlKSB7XG5cdFx0XHRcdHN0eWxlWydiYWNrZ3JvdW5kLWltYWdlJ10gPSAndXJsKCcgKyB0aGlzLm9wdGlvbnMubG9hZGluZ0ltYWdlICsgJyknO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY29uZmlnLnRyYW5zaXRpb25TcGVlZCAhPT0gdW5kZWZpbmVkICYmIGNvbmZpZy50cmFuc2l0aW9uU3BlZWQgIT09IG51bGwpIHtcblx0XHRcdFx0c3R5bGVbJ3RyYW5zaXRpb24nXSA9ICdhbGwgZWFzZSAnICsgY29uZmlnLnRyYW5zaXRpb25TcGVlZCArICdzJztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IHBsYWNlaG9sZGVyIHN0eWxlXG5cdFx0cHVibGljIHBsYWNlaG9sZGVyU3R5bGUoZmlsZTogSUZpbGUsIHR5cGU6IHN0cmluZykge1xuXG5cdFx0XHRsZXQgc3R5bGUgPSB7fTtcblxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXG5cdFx0XHRpZiAoIWZpbGUpIHtcblx0XHRcdFx0cmV0dXJuIHN0eWxlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zW3R5cGVdLnBsYWNlaG9sZGVyKSB7XG5cblx0XHRcdFx0bGV0IGluZGV4ID0gdGhpcy5vcHRpb25zW3R5cGVdLnBsYWNlaG9sZGVyO1xuXHRcdFx0XHRsZXQgaXNGdWxsID0gKGluZGV4LmluZGV4T2YoJy8vJykgPT09IDAgfHwgaW5kZXguaW5kZXhPZignaHR0cCcpID09PSAwKSA/IHRydWUgOiBmYWxzZTtcblx0XHRcdFx0bGV0IHNvdXJjZTtcblxuXHRcdFx0XHRpZiAoaXNGdWxsKSB7XG5cdFx0XHRcdFx0c291cmNlID0gaW5kZXg7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c291cmNlID0gZmlsZS5zb3VyY2VbaW5kZXhdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHNvdXJjZSkge1xuXHRcdFx0XHRcdHN0eWxlWydiYWNrZ3JvdW5kLWltYWdlJ10gPSAndXJsKCcgKyBzb3VyY2UgKyAnKSc7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZmlsZS5zb3VyY2UuY29sb3IpIHtcblx0XHRcdFx0c3R5bGVbJ2JhY2tncm91bmQtY29sb3InXSA9IGZpbGUuc291cmNlLmNvbG9yO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZmlsZS5zb3VyY2UubGF6eSkge1xuXHRcdFx0XHRzdHlsZVsnYmFja2dyb3VuZC1pbWFnZSddID0gJ3VybCgnICsgZmlsZS5zb3VyY2UubGF6eSArICcpJztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHN0eWxlO1xuXG5cdFx0fVxuXG5cdFx0Ly8gc2V0IHZpc2libGVcblx0XHRwdWJsaWMgc2V0IG1vZGFsVmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xuXG5cdFx0XHR0aGlzLl92aXNpYmxlID0gdmFsdWU7XG5cblx0XHRcdC8vIHNldCBpbmRleCAwIGlmICFzZWxlY3RlZFxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQgPyB0aGlzLnNlbGVjdGVkIDogMDtcblxuXHRcdFx0bGV0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuXHRcdFx0bGV0IGNsYXNzTmFtZSA9ICdhc2cteWhpZGRlbic7XG5cblx0XHRcdGlmICh2YWx1ZSkge1xuXG5cdFx0XHRcdGlmIChib2R5LmNsYXNzTmFtZS5pbmRleE9mKGNsYXNzTmFtZSkgPCAwKSB7XG5cdFx0XHRcdFx0Ym9keS5jbGFzc05hbWUgPSBib2R5LmNsYXNzTmFtZSArICcgJyArIGNsYXNzTmFtZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMubW9kYWxJbml0KCk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ym9keS5jbGFzc05hbWUgPSBib2R5LmNsYXNzTmFtZS5yZXBsYWNlKGNsYXNzTmFtZSwgJycpLnRyaW0oKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gaW5pdGlhbGl6ZSB0aGUgZ2FsbGVyeVxuXHRcdHByaXZhdGUgbW9kYWxJbml0KCkge1xuXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHNlbGYuc2V0Rm9jdXMoKTtcblx0XHRcdH0sIDEwMCk7XG5cblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHRoaXMubW9kYWxJbml0aWFsaXplZCA9IHRydWU7XG5cdFx0XHR9LCA0NjApO1xuXG5cdFx0fVxuXG5cblx0XHRwdWJsaWMgbW9kYWxPcGVuKGluZGV4OiBudW1iZXIpIHtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGFsQXZhaWxhYmxlKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IGluZGV4ICE9PSB1bmRlZmluZWQgPyBpbmRleCA6IHRoaXMuc2VsZWN0ZWQ7XG5cdFx0XHR0aGlzLm1vZGFsVmlzaWJsZSA9IHRydWU7XG5cdFx0XHR0aGlzLmxvYWRJbWFnZSgpO1xuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLk1PREFMX09QRU4sIHsgaW5kZXg6IHRoaXMuc2VsZWN0ZWQgfSk7XG5cblx0XHR9XG5cblx0XHRwdWJsaWMgbW9kYWxDbG9zZSgpIHtcblxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5oYXNoVXJsKSB7XG5cdFx0XHRcdHRoaXMubG9jYXRpb24uaGFzaCgnJyk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubW9kYWxJbml0aWFsaXplZCA9IGZhbHNlO1xuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcblx0XHRcdHRoaXMubG9hZEltYWdlKCk7XG5cdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLk1PREFMX0NMT1NFLCB7IGluZGV4OiB0aGlzLnNlbGVjdGVkIH0pO1xuXG5cdFx0fVxuXG5cdFx0Ly8gbW92ZSB0aHVtYm5haWxzIHRvIGNvcnJlY3QgcG9zaXRpb25cblx0XHRwdWJsaWMgdGh1bWJuYWlsc01vdmUoZGVsYXk/OiBudW1iZXIpIHtcblxuXHRcdFx0bGV0IG1vdmUgPSAoKSA9PiB7XG5cblx0XHRcdFx0bGV0IGNvbnRhaW5lcnMgPSB0aGlzLmVsKCdkaXYuYXNnLXRodW1ibmFpbC4nICsgdGhpcy5pZCk7XG5cblx0XHRcdFx0aWYgKCFjb250YWluZXJzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29udGFpbmVycy5sZW5ndGg7IGkrKykge1xuXG5cdFx0XHRcdFx0bGV0IGNvbnRhaW5lcjogYW55ID0gY29udGFpbmVyc1tpXTtcblxuXHRcdFx0XHRcdGlmIChjb250YWluZXIub2Zmc2V0V2lkdGgpIHtcblxuXHRcdFx0XHRcdFx0bGV0IGl0ZW1zOiBhbnkgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignZGl2Lml0ZW1zJyk7XG5cdFx0XHRcdFx0XHRsZXQgaXRlbTogYW55ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5pdGVtJyk7XG5cdFx0XHRcdFx0XHRsZXQgdGh1bWJuYWlsLCBtb3ZlWCwgcmVtYWluO1xuXG5cdFx0XHRcdFx0XHRpZiAoaXRlbSkge1xuXG5cdFx0XHRcdFx0XHRcdGlmIChpdGVtcy5zY3JvbGxXaWR0aCA+IGNvbnRhaW5lci5vZmZzZXRXaWR0aCkge1xuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbCA9IGl0ZW1zLnNjcm9sbFdpZHRoIC8gdGhpcy5maWxlcy5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdFx0bW92ZVggPSAoY29udGFpbmVyLm9mZnNldFdpZHRoIC8gMikgLSAodGhpcy5zZWxlY3RlZCAqIHRodW1ibmFpbCkgLSB0aHVtYm5haWwgLyAyO1xuXHRcdFx0XHRcdFx0XHRcdHJlbWFpbiA9IGl0ZW1zLnNjcm9sbFdpZHRoICsgbW92ZVg7XG5cdFx0XHRcdFx0XHRcdFx0bW92ZVggPSBtb3ZlWCA+IDAgPyAwIDogbW92ZVg7XG5cdFx0XHRcdFx0XHRcdFx0bW92ZVggPSByZW1haW4gPCBjb250YWluZXIub2Zmc2V0V2lkdGggPyBjb250YWluZXIub2Zmc2V0V2lkdGggLSBpdGVtcy5zY3JvbGxXaWR0aCA6IG1vdmVYO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHRodW1ibmFpbCA9IHRoaXMuZ2V0UmVhbFdpZHRoKGl0ZW0pO1xuXHRcdFx0XHRcdFx0XHRcdG1vdmVYID0gKGNvbnRhaW5lci5vZmZzZXRXaWR0aCAtIHRodW1ibmFpbCAqIHRoaXMuZmlsZXMubGVuZ3RoKSAvIDI7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpdGVtcy5zdHlsZS5sZWZ0ID0gbW92ZVggKyAncHgnO1xuXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuVEhVTUJOQUlMX01PVkUsIHtcblx0XHRcdFx0XHRcdFx0XHR0aHVtYm5haWw6IHRodW1ibmFpbCxcblx0XHRcdFx0XHRcdFx0XHRtb3ZlOiBtb3ZlWCxcblx0XHRcdFx0XHRcdFx0XHRyZW1haW46IHJlbWFpbixcblx0XHRcdFx0XHRcdFx0XHRjb250YWluZXI6IGNvbnRhaW5lci5vZmZzZXRXaWR0aCxcblx0XHRcdFx0XHRcdFx0XHRpdGVtczogaXRlbXMuc2Nyb2xsV2lkdGhcblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoZGVsYXkpIHtcblx0XHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRtb3ZlKCk7XG5cdFx0XHRcdH0sIGRlbGF5KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1vdmUoKTtcblx0XHRcdH1cblxuXG5cdFx0fVxuXG5cdFx0cHVibGljIG1vZGFsQ2xpY2soJGV2ZW50PzogVUlFdmVudCkge1xuXG5cdFx0XHRpZiAoJGV2ZW50KSB7XG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5zZXRGb2N1cygpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gc2V0IHRoZSBmb2N1c1xuXHRcdHB1YmxpYyBzZXRGb2N1cygpIHtcblxuXG5cdFx0XHRsZXQgcGF0aCA9ICdkaXYuYXNnLWNvbnRhaW5lci4nICsgdGhpcy5pZCArICcgLmtleUlucHV0Jztcblx0XHRcdGxldCBlbGVtZW50OiBOb2RlID0gdGhpcy5lbChwYXRoKVswXTtcblxuXHRcdFx0dGhpcy5sb2coJ3NldCBmb2N1cycsIFtwYXRoLCBlbGVtZW50XSk7XG5cblx0XHRcdGlmIChlbGVtZW50KSB7XG5cdFx0XHRcdGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KVswXVsnZm9jdXMnXSgpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cHVibGljIGNvbnRhaW5lckZ1bGxTaXplKCkge1xuXG5cdFx0XHRpZiAoIXRoaXMub3B0aW9ucy5jb250YWluZXIuYXZhaWxhYmxlKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5vcHRpb25zLmNvbnRhaW5lci5mdWxsc2l6ZSA9IHRydWU7XG5cdFx0XHR0aGlzLm9wdGlvbnMuY29udGFpbmVyLnZpc2libGUgPSB0cnVlO1xuXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR0aGlzLnNldEZvY3VzKCk7XG5cdFx0XHR9LCAxMDApO1xuXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmV2ZW50KHRoaXMuZXZlbnRzLk1PREFMX09QRU4sIHsgaW5kZXg6IHRoaXMuc2VsZWN0ZWQgfSk7XG5cdFx0XHR9LCA0NjApO1xuXG5cdFx0fVxuXG5cdFx0cHVibGljIGV2ZW50KGV2ZW50OiBzdHJpbmcsIGRhdGE/OiBhbnkpIHtcblxuXHRcdFx0ZXZlbnQgPSBldmVudCArIHRoaXMuaWQ7XG5cdFx0XHR0aGlzLiRyb290U2NvcGUuJGVtaXQoZXZlbnQsIGRhdGEpO1xuXHRcdFx0dGhpcy5sb2coZXZlbnQsIGRhdGEpO1xuXG5cdFx0fVxuXG5cdFx0cHVibGljIGxvZyhldmVudDogc3RyaW5nLCBkYXRhPzogYW55KSB7XG5cblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZGVidWcpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coZXZlbnQsIGRhdGEgPyBkYXRhIDogbnVsbCk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgZWxlbWVudFxuXHRcdHB1YmxpYyBlbChzZWxlY3Rvcik6IE5vZGVMaXN0IHtcblxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gY2FsY3VsYXRpbmcgZWxlbWVudCByZWFsIHdpZHRoXG5cdFx0cHVibGljIGdldFJlYWxXaWR0aChpdGVtKSB7XG5cblx0XHRcdGxldCBzdHlsZSA9IGl0ZW0uY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGl0ZW0pLFxuXHRcdFx0XHR3aWR0aCA9IGl0ZW0ub2Zmc2V0V2lkdGgsXG5cdFx0XHRcdG1hcmdpbiA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpblJpZ2h0KSxcblx0XHRcdFx0Ly8gcGFkZGluZyA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0xlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nUmlnaHQpLFxuXHRcdFx0XHRib3JkZXIgPSBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlckxlZnRXaWR0aCkgKyBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlclJpZ2h0V2lkdGgpO1xuXG5cdFx0XHRyZXR1cm4gd2lkdGggKyBtYXJnaW4gKyBib3JkZXI7XG5cblx0XHR9XG5cblx0XHQvLyBjYWxjdWxhdGluZyBlbGVtZW50IHJlYWwgaGVpZ2h0XG5cdFx0cHVibGljIGdldFJlYWxIZWlnaHQoaXRlbSkge1xuXG5cdFx0XHRsZXQgc3R5bGUgPSBpdGVtLmN1cnJlbnRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShpdGVtKSxcblx0XHRcdFx0aGVpZ2h0ID0gaXRlbS5vZmZzZXRIZWlnaHQsXG5cdFx0XHRcdG1hcmdpbiA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luQm90dG9tKSxcblx0XHRcdFx0Ly8gcGFkZGluZyA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1RvcCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pLFxuXHRcdFx0XHRib3JkZXIgPSBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlclRvcFdpZHRoKSArIHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyQm90dG9tV2lkdGgpO1xuXG5cdFx0XHRyZXR1cm4gaGVpZ2h0ICsgbWFyZ2luICsgYm9yZGVyO1xuXG5cdFx0fVxuXG5cblx0XHQvLyBlZGl0IGdhbGxlcnlcblx0XHRwdWJsaWMgZWRpdEdhbGxlcnkoZWRpdDogSUVkaXQpIHtcblxuXHRcdFx0dGhpcy5lZGl0aW5nID0gdHJ1ZTtcblx0XHRcdGxldCBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQ7XG5cblx0XHRcdGlmIChlZGl0Lm9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLm9wdGlvbnNMb2FkZWQgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5zZXRPcHRpb25zKGVkaXQub3B0aW9ucyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlZGl0LmRlbGV0ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuZGVsZXRlSW1hZ2UoZWRpdC5kZWxldGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZWRpdC5hZGQpIHtcblx0XHRcdFx0bGV0IGxlbmd0aCA9IGVkaXQuYWRkLmxlbmd0aDtcblx0XHRcdFx0Zm9yIChsZXQga2V5ID0gMDsga2V5IDwgbGVuZ3RoOyBrZXkrKykge1xuXHRcdFx0XHRcdHRoaXMuYWRkSW1hZ2UoZWRpdC5hZGRba2V5XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGVkaXQudXBkYXRlKSB7XG5cblx0XHRcdFx0bGV0IGxlbmd0aCA9IGVkaXQudXBkYXRlLmxlbmd0aDtcblxuXHRcdFx0XHRmb3IgKGxldCBrZXkgPSAwOyBrZXkgPCBsZW5ndGg7IGtleSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5hZGRJbWFnZShlZGl0LnVwZGF0ZVtrZXldLCBrZXkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGNvdW50ID0gdGhpcy5maWxlcy5sZW5ndGggLSBlZGl0LnVwZGF0ZS5sZW5ndGg7XG5cdFx0XHRcdGlmIChjb3VudCA+IDApIHtcblx0XHRcdFx0XHR0aGlzLmRlbGV0ZUltYWdlKGxlbmd0aCwgY291bnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlZGl0LnNlbGVjdGVkID49IDApIHtcblx0XHRcdFx0c2VsZWN0ZWQgPSBlZGl0LnNlbGVjdGVkO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZWRpdC5zZWxlY3RlZCA9PSAtMSkge1xuXHRcdFx0XHRzZWxlY3RlZCA9IHRoaXMuZmlsZXMubGVuZ3RoIC0gMTtcblx0XHRcdH1cblxuXHRcdFx0c2VsZWN0ZWQgPSB0aGlzLmZpbGVzW3NlbGVjdGVkXSA/IHNlbGVjdGVkIDogKHNlbGVjdGVkID49IHRoaXMuZmlsZXMubGVuZ3RoID8gdGhpcy5maWxlcy5sZW5ndGggLSAxIDogMCk7XG5cdFx0XHR0aGlzLmZvcmNlU2VsZWN0KHRoaXMuZmlsZXNbc2VsZWN0ZWRdID8gc2VsZWN0ZWQgOiAwKTtcblxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcblxuXHRcdFx0XHR0aGlzLmVkaXRpbmcgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5ldmVudCh0aGlzLmV2ZW50cy5HQUxMRVJZX1VQREFURUQsIGVkaXQpO1xuXHRcdFx0XHR0aGlzLnRodW1ibmFpbHNNb3ZlKGVkaXQuZGVsYXlUaHVtYm5haWxzICE9PSB1bmRlZmluZWQgPyBlZGl0LmRlbGF5VGh1bWJuYWlscyA6IDIyMCk7XG5cdFx0XHRcdHRoaXMuZXZlbnQodGhpcy5ldmVudHMuTEFTVF9USFVNQk5BSUwpO1xuXG5cdFx0XHR9LCAoZWRpdC5kZWxheVJlZnJlc2ggIT09IHVuZGVmaW5lZCA/IGVkaXQuZGVsYXlSZWZyZXNoIDogNDIwKSk7XG5cblx0XHR9XG5cblxuXHRcdC8vIGRlbGV0ZSBpbWFnZVxuXHRcdHB1YmxpYyBkZWxldGVJbWFnZShpbmRleDogbnVtYmVyLCBjb3VudD86IG51bWJlcikge1xuXG5cdFx0XHRpbmRleCA9IGluZGV4ID09PSBudWxsIHx8IGluZGV4ID09PSB1bmRlZmluZWQgPyB0aGlzLnNlbGVjdGVkIDogaW5kZXg7XG5cdFx0XHRjb3VudCA9IGNvdW50ID8gY291bnQgOiAxO1xuXG5cdFx0XHR0aGlzLmZpbGVzLnNwbGljZShpbmRleCwgY291bnQpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZmluZCBpbWFnZSBpbiBnYWxsZXJ5IGJ5IG1vZGFsIHNvdXJjZVxuXHRcdHB1YmxpYyBmaW5kSW1hZ2UoZmlsZW5hbWUgOiBzdHJpbmcpIHtcblxuXHRcdFx0bGV0IGxlbmd0aCA9IHRoaXMuZmlsZXMubGVuZ3RoO1xuXG5cdFx0XHRmb3IgKGxldCBrZXkgPSAwOyBrZXkgPCBsZW5ndGg7IGtleSsrKSB7XG5cdFx0XHRcdGlmICh0aGlzLmZpbGVzW2tleV0uc291cmNlLmxhcmdlID09PSBmaWxlbmFtZSkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZpbGVzW2tleV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0fVxuXG5cblx0XHRwdWJsaWMgZ2V0RnVsbFVybCh1cmwgOiBzdHJpbmcsIGJhc2VVcmw/OiBzdHJpbmcpIHtcblxuXHRcdFx0YmFzZVVybCA9IGJhc2VVcmwgPT09IHVuZGVmaW5lZCA/IHRoaXMub3B0aW9ucy5iYXNlVXJsIDogYmFzZVVybDtcblx0XHRcdGxldCBpc0Z1bGwgPSAodXJsLmluZGV4T2YoJy8vJykgPT09IDAgfHwgdXJsLmluZGV4T2YoJ2h0dHAnKSA9PT0gMCkgPyB0cnVlIDogZmFsc2U7XG5cblx0XHRcdHJldHVybiBpc0Z1bGwgPyB1cmwgOiBiYXNlVXJsICsgdXJsO1xuXG5cdFx0fVxuXG5cdFx0Ly8gYWRkIGltYWdlXG5cdFx0cHVibGljIGFkZEltYWdlKHZhbHVlOiBhbnksIGluZGV4PzogbnVtYmVyKSA6IElGaWxlIHtcblxuXHRcdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cblx0XHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdHNlbGYubG9nKCdpbnZhbGlkIGltYWdlIHZhbHVlJyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFuZ3VsYXIuaXNTdHJpbmcodmFsdWUpID09PSB0cnVlKSB7XG5cdFx0XHRcdHZhbHVlID0geyBzb3VyY2U6IHsgbWVkaXVtOiB2YWx1ZSB9IH07XG5cdFx0XHR9XG5cblx0XHRcdGxldCBnZXRBdmFpbGFibGVTb3VyY2UgPSBmdW5jdGlvbiAodHlwZTogc3RyaW5nLCBzcmM6IElTb3VyY2UpIHtcblxuXHRcdFx0XHRpZiAoc3JjW3R5cGVdKSB7XG5cblx0XHRcdFx0XHRyZXR1cm4gc2VsZi5nZXRGdWxsVXJsKHNyY1t0eXBlXSk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAnc21hbGwnKSB7XG5cdFx0XHRcdFx0XHR0eXBlID0gJ21lZGl1bSc7XG5cdFx0XHRcdFx0XHRpZiAoc3JjW3R5cGVdKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBzZWxmLmdldEZ1bGxVcmwoc3JjW3R5cGVdKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ21lZGl1bScpIHtcblx0XHRcdFx0XHRcdHR5cGUgPSAnbGFyZ2UnO1xuXHRcdFx0XHRcdFx0aWYgKHNyY1t0eXBlXSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5nZXRGdWxsVXJsKHNyY1t0eXBlXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICdsYXJnZScpIHtcblx0XHRcdFx0XHRcdHR5cGUgPSAnbWVkaXVtJztcblx0XHRcdFx0XHRcdGlmIChzcmNbdHlwZV0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHNlbGYuZ2V0RnVsbFVybChzcmNbdHlwZV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAnbGF6eScpIHtcblx0XHRcdFx0XHRcdHR5cGUgPSAnbWVkaXVtJztcblx0XHRcdFx0XHRcdGlmIChzcmNbdHlwZV0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHNlbGYuZ2V0RnVsbFVybChzcmNbdHlwZV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH07XG5cblx0XHRcdGlmICghdmFsdWUuc291cmNlKSB7XG5cdFx0XHRcdHZhbHVlLnNvdXJjZSA9IHtcblx0XHRcdFx0XHRsYXJnZTogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UubGFyZ2VdLFxuXHRcdFx0XHRcdHNtYWxsOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5zbWFsbF0sXG5cdFx0XHRcdFx0bWVkaXVtOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5tZWRpdW1dLFxuXHRcdFx0XHRcdGxhenk6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLmxhenldLFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgc291cmNlID0ge1xuXHRcdFx0XHRsYXJnZTogZ2V0QXZhaWxhYmxlU291cmNlKCdsYXJnZScsIHZhbHVlLnNvdXJjZSksXG5cdFx0XHRcdHNtYWxsOiBnZXRBdmFpbGFibGVTb3VyY2UoJ3NtYWxsJywgdmFsdWUuc291cmNlKSxcblx0XHRcdFx0bWVkaXVtOiBnZXRBdmFpbGFibGVTb3VyY2UoJ21lZGl1bScsIHZhbHVlLnNvdXJjZSksXG5cdFx0XHRcdGxhenk6IGdldEF2YWlsYWJsZVNvdXJjZSgnbGF6eScsIHZhbHVlLnNvdXJjZSksXG5cdFx0XHRcdGNvbG9yOiB2YWx1ZS5jb2xvciA/IHZhbHVlLmNvbG9yIDogJ3RyYW5zcGFyZW50Jyxcblx0XHRcdH07XG5cblx0XHRcdGxldCBzaXplcyA9IHtcblx0XHRcdFx0bGFyZ2U6ICcxOTIwdycsXG5cdFx0XHRcdG1lZGl1bTogJzEwMjR3Jyxcblx0XHRcdFx0c21hbGw6ICc0ODB3Jyxcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFzb3VyY2UubGFyZ2UpIHtcblx0XHRcdFx0c2VsZi5sb2coJ2ludmFsaWQgaW1hZ2UgZGF0YScsIHsgc291cmNlOiBzb3VyY2UsIHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc291cmNlLmxhcmdlLmluZGV4T2YoJyAnKSA+IDApIHtcblx0XHRcdFx0bGV0IHBhcnRzID0gc291cmNlLmxhcmdlLnNwbGl0KCcgJyk7XG5cdFx0XHRcdHNpemVzLmxhcmdlID0gcGFydHNbMV0udHJpbSgpO1xuXHRcdFx0XHRzb3VyY2UubGFyZ2UgPSBwYXJ0c1swXS50cmltKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzb3VyY2UubWVkaXVtLmluZGV4T2YoJyAnKSA+IDApIHtcblx0XHRcdFx0bGV0IHBhcnRzID0gc291cmNlLm1lZGl1bS5zcGxpdCgnICcpO1xuXHRcdFx0XHRzaXplcy5tZWRpdW0gPSBwYXJ0c1sxXS50cmltKCk7XG5cdFx0XHRcdHNvdXJjZS5tZWRpdW0gPSBwYXJ0c1swXS50cmltKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzb3VyY2Uuc21hbGwuaW5kZXhPZignICcpID4gMCkge1xuXHRcdFx0XHRsZXQgcGFydHMgPSBzb3VyY2Uuc21hbGwuc3BsaXQoJyAnKTtcblx0XHRcdFx0c2l6ZXMuc21hbGwgPSBwYXJ0c1sxXS50cmltKCk7XG5cdFx0XHRcdHNvdXJjZS5zbWFsbCA9IHBhcnRzWzBdLnRyaW0oKTtcblx0XHRcdH1cblxuXG5cdFx0XHRsZXQgcGFydHMgPSBzb3VyY2UubGFyZ2Uuc3BsaXQoJy8nKTtcblx0XHRcdGxldCBmaWxlbmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuXHRcdFx0bGV0IHRpdGxlLCBzdWJ0aXRsZSwgZGVzY3JpcHRpb24sIHZpZGVvO1xuXG5cdFx0XHRpZiAoc2VsZi5vcHRpb25zLmZpZWxkcyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRpdGxlID0gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aXRsZV0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRpdGxlXSA6IGZpbGVuYW1lO1xuXHRcdFx0XHRzdWJ0aXRsZSA9IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc3VidGl0bGVdID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zdWJ0aXRsZV0gOiBudWxsO1xuXHRcdFx0XHRkZXNjcmlwdGlvbiA9IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuZGVzY3JpcHRpb25dID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5kZXNjcmlwdGlvbl0gOiBudWxsO1xuXHRcdFx0XHR2aWRlbyA9IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudmlkZW9dID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy52aWRlb10gOiBudWxsO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGl0bGUgPSBmaWxlbmFtZTtcblx0XHRcdFx0c3VidGl0bGUgPSBudWxsO1xuXHRcdFx0XHRkZXNjcmlwdGlvbiA9IG51bGw7XG5cdFx0XHRcdHZpZGVvID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGZpbGUgPSB7XG5cdFx0XHRcdGluZGV4OiBpbmRleCxcblx0XHRcdFx0c291cmNlOiBzb3VyY2UsXG5cdFx0XHRcdHNpemVzOiBzaXplcyxcblx0XHRcdFx0dGl0bGU6IHRpdGxlLFxuXHRcdFx0XHRzdWJ0aXRsZTogc3VidGl0bGUsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcblx0XHRcdFx0dmlkZW86IHZpZGVvICYmIHZpZGVvLnZpbWVvSWQgPyB2aWRlbyA6IG51bGwsXG5cdFx0XHRcdCdjbGFzcyc6IHZhbHVlLmNsYXNzID8gdmFsdWUuY2xhc3MgOiAnJyxcblx0XHRcdFx0bG9hZGVkOiB7XG5cdFx0XHRcdFx0bGFyZ2U6IGZhbHNlLFxuXHRcdFx0XHRcdG1lZGl1bTogZmFsc2UsXG5cdFx0XHRcdFx0c21hbGw6IGZhbHNlXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGlmIChpbmRleCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZmlsZXNbaW5kZXhdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0gPSBmaWxlO1xuXHRcdFx0XHRyZXR1cm4gZmlsZTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKHNlbGYub3B0aW9ucy5kdXBsaWNhdGVzICE9PSB0cnVlICYmIHRoaXMuZmluZEltYWdlKGZpbGUuc291cmNlLmxhcmdlKSkge1xuXHRcdFx0XHRcdHNlbGYuZXZlbnQoc2VsZi5ldmVudHMuRE9VQkxFX0lNQUdFLCBmaWxlKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLmZpbGVzLnB1c2goZmlsZSk7XG5cdFx0XHRcdGZpbGUuaW5kZXggPSB0aGlzLmZpbGVzLmxlbmd0aCAtIDE7XG5cblx0XHRcdFx0cmV0dXJuIGZpbGU7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9XG5cblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XG5cblx0YXBwLnNlcnZpY2UoJ2FzZ1NlcnZpY2UnLCBbJyR0aW1lb3V0JywgJyRpbnRlcnZhbCcsICckbG9jYXRpb24nLCAnJHJvb3RTY29wZScsICckd2luZG93JywgJyRzY2UnLCBTZXJ2aWNlQ29udHJvbGxlcl0pO1xuXG59XG5cbiIsIm5hbWVzcGFjZSBhbmd1bGFyU3VwZXJHYWxsZXJ5IHtcblxuXHRleHBvcnQgY2xhc3MgVGh1bWJuYWlsQ29udHJvbGxlciB7XG5cblx0XHRwdWJsaWMgaWQ6IHN0cmluZztcblx0XHRwdWJsaWMgb3B0aW9uczogSU9wdGlvbnM7XG5cdFx0cHVibGljIGl0ZW1zOiBBcnJheTxJRmlsZT47XG5cdFx0cHVibGljIGJhc2VVcmw6IHN0cmluZztcblxuXHRcdHByaXZhdGUgdHlwZSA9ICd0aHVtYm5haWwnO1xuXHRcdHByaXZhdGUgdGVtcGxhdGU7XG5cdFx0cHJpdmF0ZSBhc2c6IElTZXJ2aWNlQ29udHJvbGxlcjtcblx0XHRwcml2YXRlIG1vZGFsID0gZmFsc2U7XG5cdFx0cHJpdmF0ZSBsb2FkZWQgPSAwO1xuXG5cdFx0Y29uc3RydWN0b3IoXG5cdFx0XHRwcml2YXRlIHNlcnZpY2U6IElTZXJ2aWNlQ29udHJvbGxlcixcblx0XHRcdHByaXZhdGUgJHNjb3BlOiBJU2NvcGUsXG5cdFx0XHRwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxuXHRcdFx0cHJpdmF0ZSAkZWxlbWVudDogbmcuSVJvb3RFbGVtZW50U2VydmljZSxcblx0XHRcdHByaXZhdGUgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZSkge1xuXG5cdFx0XHR0aGlzLnRlbXBsYXRlID0gJy92aWV3cy9hc2ctdGh1bWJuYWlsLmh0bWwnO1xuXG5cdFx0fVxuXG5cdFx0cHVibGljICRvbkluaXQoKSB7XG5cblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcblxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0XHQvLyBnZXQgcGFyZW50IGFzZyBjb21wb25lbnQgKG1vZGFsKVxuXHRcdFx0aWYgKHRoaXMuJHNjb3BlICYmIHRoaXMuJHNjb3BlLiRwYXJlbnQgJiYgdGhpcy4kc2NvcGUuJHBhcmVudC4kcGFyZW50ICYmIHRoaXMuJHNjb3BlLiRwYXJlbnQuJHBhcmVudFsnJGN0cmwnXSkge1xuXHRcdFx0XHR0aGlzLm1vZGFsID0gdGhpcy4kc2NvcGUuJHBhcmVudC4kcGFyZW50WyckY3RybCddLnR5cGUgPT09ICdtb2RhbCcgPyB0cnVlIDogZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kb24odGhpcy5hc2cuZXZlbnRzLkxBU1RfVEhVTUJOQUlMICsgdGhpcy5pZCwgKGV2ZW50LCBkYXRhKSA9PiB7XG5cblx0XHRcdFx0c2VsZi5hc2cudGh1bWJuYWlsc01vdmUoMTApO1xuXHRcdFx0XHRzZWxmLiR0aW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRzZWxmLmNvbmZpZy5pbml0aWFsaXplZCA9IHRydWU7XG5cdFx0XHRcdH0sIDEyMCk7XG5cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBvbkxvYWQoZmlsZT86IElGaWxlKSB7XG5cblx0XHRcdGZpbGUubG9hZGVkLnNtYWxsID0gdHJ1ZTtcblx0XHRcdHRoaXMubG9hZGVkKys7XG5cblx0XHRcdGlmICh0aGlzLmxvYWRlZCA9PT0gdGhpcy5hc2cuZmlsZXMubGVuZ3RoKSB7XG5cdFx0XHRcdHRoaXMuYXNnLmV2ZW50KHRoaXMuYXNnLmV2ZW50cy5MQVNUX1RIVU1CTkFJTCwgZmlsZSk7XG5cdFx0XHRcdHRoaXMuY29uZmlnLmxvYWRlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2Vcblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXg6IG51bWJlciwgJGV2ZW50PzogTW91c2VFdmVudCkge1xuXG5cdFx0XHR0aGlzLmFzZy5tb2RhbENsaWNrKCRldmVudCk7XG5cblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5tb2RhbCkge1xuXHRcdFx0XHR0aGlzLmFzZy5tb2RhbE9wZW4oaW5kZXgpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLmNvbmZpZy5jbGljay5zZWxlY3QpIHtcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gcHJlbG9kIHdoZW4gbW91c2VvdmVyIGFuZCBzZXQgc2VsZWN0ZWQgaWYgZW5hYmxlZFxuXHRcdHB1YmxpYyBob3ZlcihpbmRleDogbnVtYmVyLCAkZXZlbnQ/OiBNb3VzZUV2ZW50KSB7XG5cblx0XHRcdGlmICh0aGlzLmNvbmZpZy5ob3Zlci5wcmVsb2FkID09PSB0cnVlKSB7XG5cdFx0XHRcdHRoaXMuYXNnLmhvdmVyUHJlbG9hZChpbmRleCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLmNvbmZpZy5ob3Zlci5zZWxlY3QgPT09IHRydWUpIHtcblx0XHRcdFx0dGhpcy5hc2cuc2V0U2VsZWN0ZWQoaW5kZXgpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IHRodW1ibmFpbCBjb25maWdcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpOiBJT3B0aW9uc1RodW1ibmFpbCB7XG5cblx0XHRcdHJldHVybiB0aGlzLm1vZGFsID8gdGhpcy5hc2cub3B0aW9ucy5tb2RhbFt0aGlzLnR5cGVdIDogdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xuXG5cdFx0fVxuXG5cdFx0Ly8gc2V0IHRodW1ibmFpbCBjb25maWdcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZTogSU9wdGlvbnNUaHVtYm5haWwpIHtcblxuXHRcdFx0aWYgKHRoaXMubW9kYWwpIHtcblx0XHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmFzZy5vcHRpb25zLm1vZGFsW3RoaXMudHlwZV0gPSB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodjogbnVtYmVyKSB7XG5cblx0XHRcdGlmICghdGhpcy5hc2cpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmFzZy5zZWxlY3RlZCA9IHY7XG5cblx0XHR9XG5cblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2Vcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xuXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xuXG5cdFx0fVxuXG5cdFx0Ly8gZ2V0IGFib3ZlIGZyb20gY29uZmlnXG5cdFx0cHVibGljIGdldCBkeW5hbWljKCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcuZHluYW1pYyA/ICdkeW5hbWljJyA6ICcnO1xuXG5cdFx0fVxuXG5cdFx0Ly8gYXV0b2hpZGUgYW5kIGlzU2luZ2xlID09IHRydWUgP1xuXHRcdHB1YmxpYyBnZXQgYXV0b2hpZGUoKSB7XG5cblx0XHRcdHJldHVybiB0aGlzLmNvbmZpZy5hdXRvaGlkZSAmJiB0aGlzLmFzZy5pc1NpbmdsZSA/IHRydWUgOiBmYWxzZTtcblxuXHRcdH1cblxuXHRcdC8vIGdldCBjbGFzc2VzXG5cdFx0cHVibGljIGdldCBjbGFzc2VzKCk6IHN0cmluZyB7XG5cblx0XHRcdHJldHVybiB0aGlzLmFzZy5jbGFzc2VzICsgJyAnICsgdGhpcy5keW5hbWljICsgJyAnICsgKHRoaXMuY29uZmlnLmluaXRpYWxpemVkID8gJ2luaXRpYWxpemVkJyA6ICdpbml0aWFsaXppbmcnKTtcblxuXHRcdH1cblxuXHR9XG5cblx0bGV0IGFwcDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XG5cblx0YXBwLmNvbXBvbmVudCgnYXNnVGh1bWJuYWlsJywge1xuXHRcdGNvbnRyb2xsZXI6IFsnYXNnU2VydmljZScsICckc2NvcGUnLCAnJHJvb3RTY29wZScsICckZWxlbWVudCcsICckdGltZW91dCcsIGFuZ3VsYXJTdXBlckdhbGxlcnkuVGh1bWJuYWlsQ29udHJvbGxlcl0sXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGRhdGEtbmctaWY9XCIhJGN0cmwuYXV0b2hpZGVcIiBjbGFzcz1cImFzZy10aHVtYm5haWwge3sgJGN0cmwuY2xhc3NlcyB9fVwiIG5nLWNsaWNrPVwiJGN0cmwuYXNnLm1vZGFsQ2xpY2soJGV2ZW50KTtcIj48ZGl2IG5nLWluY2x1ZGU9XCIkY3RybC50ZW1wbGF0ZVwiPjwvZGl2PjwvZGl2PicsXG5cdFx0YmluZGluZ3M6IHtcblx0XHRcdGlkOiAnQCcsXG5cdFx0XHRpdGVtczogJz0/Jyxcblx0XHRcdG9wdGlvbnM6ICc9PycsXG5cdFx0XHRzZWxlY3RlZDogJz0/Jyxcblx0XHRcdHZpc2libGU6ICc9PycsXG5cdFx0XHR0ZW1wbGF0ZTogJ0A/Jyxcblx0XHRcdGJhc2VVcmw6ICdAPydcblx0XHR9XG5cdH0pO1xuXG59XG4iXX0=

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('/views/asg-container.html','<div ng-cloak class="asg-container {{ $ctrl.asg.classes }}" ng-class="$ctrl.getClass()" ng-if="$ctrl.visible" ng-click="$ctrl.imageClick($event);" ng-style="{\'min-height\' : $ctrl.config.heightMin + \'px\', \'height\' : $ctrl.height + \'px\'}"><div tabindex="1" class="keyInput" ng-keydown="$ctrl.keyUp($event)"></div><div class="frame" ng-click="$ctrl.asg.modalClick($event);"><div class="header" ng-if="$ctrl.config.header.enabled" ng-click="$ctrl.asg.modalClick($event);"><span class="buttons d-block d-sm-none pull-right"><span ng-include="\'/views/button/asg-index-xs.html\'"></span> </span><span class="buttons d-none d-sm-block pull-right"><span ng-repeat="item in $ctrl.config.header.buttons" ng-include="(\'/views/button/asg-\' + item + \'.html\')"></span> </span><span ng-if="$ctrl.config.title"><span class="title">{{ $ctrl.config.title }}</span> <span class="subtitle d-none d-sm-block" ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span></span></div><div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}" ng-style="{\'top\': $ctrl.marginTop + \'px\', \'bottom\': $ctrl.marginBottom + \'px\'}" ng-mouseover="$ctrl.asg.over.modalImage = true;" ng-mouseleave="$ctrl.asg.over.modalImage = false;"><div class="help text-right" ng-click="$ctrl.toggleHelp($event)" ng-show="$ctrl.config.help" ng-include="\'/views/asg-help.html\'"></div><div class="arrow left" ng-if="$ctrl.config.arrows.enabled && !$ctrl.asg.isSingle"><button class="btn btn-default btn-md pull-left" ng-click="$ctrl.toBackward(true, $event)" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)"><span class="fa fa-chevron-left"></span></button></div><div class="arrow right" ng-if="$ctrl.config.arrows.enabled && !$ctrl.asg.isSingle"><button class="btn btn-default btn-md pull-right" ng-click="$ctrl.toForward(true, $event)" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)"><span class="fa fa-chevron-right"></span></button></div><div class="image {{ $ctrl.config.size }}" ng-click="$ctrl.imageClick($event)" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-show="$ctrl.asg.selected == key" ng-style="$ctrl.asg.dynamicStyle(file, \'large\', $ctrl.config)" ng-class="{\'loaded\' : file.loaded.large || file.loaded.medium }"><div class="source {{ $ctrl.config.size }}"><img ng-src="{{ file.source.lazy ? file.source.lazy : file.source.small }}" ng-srcset="{{ file.source.large }} {{ file.sizes.large }}, {{ file.source.medium }} {{ file.sizes.medium }}, {{ file.source.small }} {{ file.sizes.small }}" alt="{{ file.title }}"></div><div class="video" ng-show="file.video.visible" id="modal_vimeo_video_{{ file.video.vimeoId }}" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)"></div><div class="play" ng-show="file.video && !file.video.playing"><div class="button" ng-click="$ctrl.playVideo($event)"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><circle class="circle" cx="256" cy="256" r="256" stroke-width="1"/></g><g><polygon class="icon" points="189.776,141.328 189.776,370.992 388.672,256.16"/></g></svg></div></div></div><div class="caption {{ $ctrl.config.caption.position }}" ng-show="!$ctrl.config.caption.disabled" ng-class="{\'visible\' : $ctrl.config.caption.visible}"><div class="content"><span class="title">{{ $ctrl.asg.file.title }}</span> <span ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description">- </span><span class="description">{{ $ctrl.asg.file.description }}</span> <a ng-if="$ctrl.config.caption.download" href="{{ $ctrl.asg.downloadLink() }}" target="_blank" class="btn btn-default btn-sm"><span class="fa fa-download"></span> Download</a></div></div></div><ng-transclude></ng-transclude></div></div>');
$templateCache.put('/views/asg-control.html','<button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.autoPlayToggle()"><span ng-if="!$ctrl.asg.options.autoplay.enabled" class="fa fa-play"></span> <span ng-if="$ctrl.asg.options.autoplay.enabled" class="fa fa-stop"></span></button> <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toFirst(true)">{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}</button> <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toBackward(true)"><span class="fa fa-chevron-left"></span></button> <button ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" ng-click="$ctrl.asg.toForward(true)"><span class="fa fa-chevron-right"></span></button>');
$templateCache.put('/views/asg-debug.html','<pre>    \r\n    {{ $ctrl.file | json }}    \r\n</pre><hr><pre>        \r\n    {{ $ctrl.service.instances.abstracts.options | json }}\r\n</pre>');
$templateCache.put('/views/asg-help.html','<ul><li>SPACE : forward</li><li>RIGHT : forward</li><li>LEFT : backward</li><li>UP / HOME : first</li><li>DOWN / END : last</li><li>ENTER : toggle fullscreen</li><li>ESC : exit</li><li>p : play/pause</li><li>t : change transition effect</li><li>m : toggle menu</li><li>s : toggle image size</li><li>c : toggle caption</li><li>h : toggle help</li></ul><br><br><a href="https://github.com/schalkt/angular-super-gallery">AngularJS Super Gallery</a><br><small class="text-muted">&copy; 2020 - Tamas Schalk</small>');
$templateCache.put('/views/asg-image-old copy.html','<div class="asg-image {{ $ctrl.asg.classes }}" ng-class="{\'modalon\' : $ctrl.modalAvailable }" ng-style="{\'min-height\' : $ctrl.config.heightMin + \'px\', \'height\' : $ctrl.height + \'px\'}"><div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)"><div class="img" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-show="$ctrl.asg.selected == key" ng-swipe-left="$ctrl.asg.toForward(true)" ng-swipe-right="$ctrl.asg.toBackward(true)" ng-click="$ctrl.modalOpen($event)" ng-style="$ctrl.asg.dynamicStyle(file, \'image\', $ctrl.config)" ng-class="{\'loaded\' : file.loaded.image}"><div class="placeholder {{ $ctrl.config.size }}" ng-style="$ctrl.asg.placeholderStyle(file, \'image\')"></div><div class="source {{ $ctrl.config.size }}" ng-style="{\'background-image\': \'url(\' + file.source.image + \')\'}" ng-mouseover="$ctrl.asg.hoverPreload(key)"></div><div class="video" ng-show="file.video.visible" id="vimeo_video_{{ file.video.vimeoId }}"></div><div class="play" ng-if="file.video && !file.video.playing"><div class="button" ng-click="$ctrl.playVideo($event)"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><circle class="circle" cx="256" cy="256" r="256" stroke-width="1"/></g><g><polygon class="icon" points="189.776,141.328 189.776,370.992 388.672,256.16"/></g></svg></div></div></div></div><div class="arrow left" ng-if="$ctrl.config.arrows.enabled && !$ctrl.asg.isSingle"><button class="btn btn-default btn-md pull-left" ng-click="$ctrl.toBackward(true, $event)" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)"><span class="fa fa-chevron-left"></span></button></div><div class="arrow right" ng-if="$ctrl.config.arrows.enabled && !$ctrl.asg.isSingle"><button class="btn btn-default btn-md pull-right" ng-click="$ctrl.toForward(true, $event)" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)"><span class="fa fa-chevron-right"></span></button></div><ng-transclude></ng-transclude></div>');
$templateCache.put('/views/asg-image.html','<div ng-cloak class="asg-image {{ $ctrl.file.class }} {{ $ctrl.asg.classes }} {{ $ctrl.config.size }}"><img ng-src="{{ $ctrl.file.source.lazy ? $ctrl.file.source.lazy : $ctrl.file.source.small }}" ng-srcset="{{ $ctrl.file.source.large }} {{ $ctrl.file.sizes.large }}, {{ $ctrl.file.source.medium }} {{ $ctrl.file.sizes.medium }}, {{ $ctrl.file.source.small }} {{ $ctrl.file.sizes.small }}" alt="{{ $ctrl.file.title }}" ng-click="$ctrl.containerAction($event)"><ng-transclude></ng-transclude></div>');
$templateCache.put('/views/asg-info.html','<div class="row"><div class="col-md-12"><h3>{{ $ctrl.file.title }}</h3></div><div class="col-md-12">{{ $ctrl.file.description }} <a target="_blank" href="{{ $ctrl.download }}"><span class="fa fa-download"></span></a></div></div>');
$templateCache.put('/views/asg-item.html','<div ng-cloak class="asg-item" ng-click="$ctrl.click($event)" ng-mouseover="$ctrl.preload($event, \'large\')"><ng-transclude></ng-transclude></div>');
$templateCache.put('/views/asg-modal.html','<div class="asg-modal {{ $ctrl.asg.classes }}" ng-class="$ctrl.getClass()" ng-click="$ctrl.imageClick($event);" ng-if="$ctrl.asg.modalVisible" ng-cloak><div tabindex="1" class="keyInput" ng-keydown="$ctrl.keyUp($event)"></div><div class="frame" ng-click="$ctrl.asg.modalClick($event);"><div class="header" ng-if="$ctrl.config.header.enabled" ng-click="$ctrl.asg.modalClick($event);"><span class="buttons d-block d-sm-none pull-right"><span ng-include="\'/views/button/asg-index-xs.html\'"></span> </span><span class="buttons d-none d-sm-block pull-right"><span ng-repeat="item in $ctrl.config.header.buttons" ng-include="(\'/views/button/asg-\' + item + \'.html\')"></span> </span><span ng-if="$ctrl.config.title"><span class="title">{{ $ctrl.config.title }}</span> <span class="subtitle d-none d-sm-block" ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span></span></div><div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}" ng-style="{\'top\': $ctrl.marginTop + \'px\', \'bottom\': $ctrl.marginBottom + \'px\'}" ng-mouseover="$ctrl.asg.over.modalImage = true;" ng-mouseleave="$ctrl.asg.over.modalImage = false;"><div class="help text-right" ng-click="$ctrl.toggleHelp($event)" ng-show="$ctrl.config.help" ng-include="\'/views/asg-help.html\'"></div><div class="arrow left" ng-if="$ctrl.config.arrows.enabled && !$ctrl.asg.isSingle"><button class="btn btn-default btn-md pull-left" ng-click="$ctrl.toBackward(true, $event)" ng-mouseover="$ctrl.hover($ctrl.asg.selected - 1, $event)"><span class="fa fa-chevron-left"></span></button></div><div class="arrow right" ng-if="$ctrl.config.arrows.enabled && !$ctrl.asg.isSingle"><button class="btn btn-default btn-md pull-right" ng-click="$ctrl.toForward(true, $event)" ng-mouseover="$ctrl.hover($ctrl.asg.selected + 1, $event)"><span class="fa fa-chevron-right"></span></button></div><div class="img" ng-click="$ctrl.imageClick($event)" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-show="$ctrl.asg.selected == key" ng-style="$ctrl.asg.dynamicStyle(file, \'modal\', $ctrl.config)" ng-class="{\'loaded\' : file.loaded.modal}"><div class="placeholder {{ $ctrl.config.size }}" ng-style="$ctrl.asg.placeholderStyle(file, \'modal\')"></div><div class="source {{ $ctrl.config.size }}" ng-if="file.loaded.modal" ng-style="{\'background-image\': \'url(\' + file.source.modal + \')\'}"></div><div class="video" ng-show="file.video.visible" id="modal_vimeo_video_{{ file.video.vimeoId }}"></div><div class="play" ng-if="file.video && !file.video.playing"><div class="button" ng-click="$ctrl.playVideo($event)"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><circle class="circle" cx="256" cy="256" r="256" stroke-width="1"/></g><g><polygon class="icon" points="189.776,141.328 189.776,370.992 388.672,256.16"/></g></svg></div></div></div><div class="caption {{ $ctrl.config.caption.position }}" ng-show="!$ctrl.config.caption.disabled" ng-class="{\'visible\' : $ctrl.config.caption.visible}"><div class="content"><span class="title">{{ $ctrl.asg.file.title }}</span> <span ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description">- </span><span class="description">{{ $ctrl.asg.file.description }}</span> <a ng-if="$ctrl.config.caption.download" href="{{ $ctrl.asg.downloadLink() }}" target="_blank" class="btn btn-default btn-sm"><span class="fa fa-download"></span> Download</a></div></div></div><ng-transclude></ng-transclude></div></div>');
$templateCache.put('/views/asg-panel.html','<div class="items {{ $ctrl.asg.options.panel.items.class }}"><div class="item {{ $ctrl.asg.options.panel.item.class }}" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-style="{\'background-color\': file.source.color}" ng-class="{\'selected\' : $ctrl.asg.selected == key}"><div class="source {{ $ctrl.config.size }}"><img ng-src="{{ file.source.image }}" ng-srcset="{{ file.source.modal }} {{ file.sizes.modal }}, {{ file.source.image }} {{ file.sizes.image }}, {{ file.source.panel }} {{ file.sizes.panel }}"></div><div class="caption" ng-if="$ctrl.config.item.caption"><span class="index" ng-if="$ctrl.config.item.index">{{ key + 1 }}</span> <span>{{ file.title }}</span></div></div></div>');
$templateCache.put('/views/asg-thumbnail.html','<div class="items"><div class="item" ng-click="$ctrl.setSelected(key, $event)" ng-mouseover="$ctrl.hover(key, $event)" ng-repeat="(key,file) in $ctrl.asg.files track by $index" ng-style="{\'background-color\': file.source.color}" ng-class="{\'selected\' : $ctrl.asg.selected == key}"><img ng-src="{{ file.source.panel }}" ng-on-load="$ctrl.onLoad(file)" ng-style="{\'height\': $ctrl.config.height + \'px\'}" alt="{{ file.title }}"> <span class="index" ng-if="$ctrl.config.index">{{ key + 1 }}</span></div></div>');
$templateCache.put('/views/button/asg-close.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.close($event)"><span class="fa fa-times"></span></button>');
$templateCache.put('/views/button/asg-fullscreen.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleFullScreen($event)"><span class="fas fa-desktop"></span></button>');
$templateCache.put('/views/button/asg-fullsize.html','<button class="btn btn-default btn-sm" ng-click="$ctrl.toggleFullSize($event)"><span class="fas fa-expand"></span></button>');
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