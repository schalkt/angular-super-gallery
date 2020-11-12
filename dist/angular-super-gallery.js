/**
 * angular-super-gallery - AngularJS Super Gallery
 * 
 * @version v3.0.3
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
        };
        ContainerController.prototype.toBackward = function (stop, $event) {
            this.asg.modalClick($event);
            this.asg.toBackward(stop);
        };
        ContainerController.prototype.toForward = function (stop, $event) {
            this.asg.modalClick($event);
            this.asg.toForward(stop);
        };
        ContainerController.prototype.toLast = function (stop, $event) {
            this.asg.modalClick($event);
            this.asg.toLast(stop);
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
            this.asg.stopVideos();
            if (this.config.visibleDefault) {
                this.config.fullsize = !this.config.fullsize;
            }
            else {
                this.config.visible = !this.config.visible;
            }
        };
        ContainerController.prototype.toggleFullScreen = function ($event) {
            this.asg.modalClick($event);
            this.asg.stopVideos();
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
            var self = this;
            this.asg.createVideo(this.asg.file);
            this.asg.file.video.player.setVolume(0.5);
            this.asg.file.video.player.play().catch(function (error) {
                console.error('error playing the video:', error);
            });
            this.asg.file.video.player.on('play', function () {
                self.asg.file.video.playing = true;
                self.asg.file.video.visible = true;
                self.$scope.$apply();
            });
            this.asg.file.video.player.on('pause', function () {
                self.asg.file.video.playing = false;
                self.asg.file.video.visible = false;
                self.$scope.$apply();
            });
            this.asg.file.video.visible = true;
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
            this.version = "3.0.3";
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
        ServiceController.prototype.createVideo = function (file, options) {
            if (!file.video || !file.video.vimeoId) {
                return;
            }
            options = options === undefined ? {} : options;
            options.id = file.video.vimeoId;
            options.responsive = options.responsive ? options.responsive : true;
            ;
            options.loop = options.loop ? options.loop : false;
            file.video.htmlId = 'modal_vimeo_video_' + file.video.vimeoId;
            file.video.player = new Vimeo.Player(file.video.htmlId, options);
            file.video.player.setVolume(0.77);
        };
        ServiceController.prototype.stopVideos = function () {
            this.files.forEach(function (item) {
                if (item.video && item.video.player) {
                    item.video.paused = true;
                    item.video.visible = false;
                    item.video.playing = false;
                }
            });
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