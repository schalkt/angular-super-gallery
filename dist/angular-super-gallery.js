/**
 * angular-super-gallery - AngularJS Super Gallery
 * 
 * @version v1.0.0
 * @link https://github.com/schalkt/angular-super-gallery
 * @license MIT
 */
var ASG;
(function (ASG) {
    var app = angular.module('angularSuperGallery', ['ngAnimate', 'FBAngular', 'ngTouch']);
    app.filter('asgBytes', function () {
        return function (bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes))
                return '';
            if (bytes === 0)
                return '0';
            if (typeof precision === 'undefined')
                precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'], number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        };
    });
})(ASG || (ASG = {}));

var ASG;
(function (ASG) {
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
    ASG.ControlController = ControlController;
    var app = angular.module('angularSuperGallery');
    app.component("asgControl", {
        controller: ["asgService", "$scope", ASG.ControlController],
        template: '<div class="asg-control {{ $ctrl.asg.theme }}"><div ng-include="$ctrl.template"></div></div>',
        bindings: {
            id: "@?",
            selected: '=?',
            template: "@?"
        }
    });
})(ASG || (ASG = {}));

var ASG;
(function (ASG) {
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
            this.$rootScope.$on('asg-load-image-' + this.id, function (event, data) {
                if (!_this.config.height && _this.config.heightAuto.initial === true) {
                    _this.setHeight(data.img);
                }
            });
        };
        ImageController.prototype.setHeight = function (img) {
            var width = this.$element.children('div').width();
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
        return ImageController;
    }());
    ASG.ImageController = ImageController;
    var app = angular.module('angularSuperGallery');
    app.component("asgImage", {
        controller: ["asgService", "$rootScope", "$element", "$window", "$scope", ASG.ImageController],
        templateUrl: 'views/asg-image.html',
        transclude: true,
        bindings: {
            id: "@?",
            items: '=?',
            options: '=?',
            selected: '=?'
        }
    });
})(ASG || (ASG = {}));

var ASG;
(function (ASG) {
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
    ASG.InfoController = InfoController;
    var app = angular.module('angularSuperGallery');
    app.component("asgInfo", {
        controller: ["asgService", "$scope", ASG.InfoController],
        template: '<div class="asg-info {{ $ctrl.asg.theme }}"><div ng-include="$ctrl.template"></div></div>',
        transclude: true,
        bindings: {
            id: "@?",
            template: "@?"
        }
    });
})(ASG || (ASG = {}));

var ASG;
(function (ASG) {
    var ModalController = (function () {
        function ModalController(service, fullscreen, $scope) {
            this.service = service;
            this.fullscreen = fullscreen;
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
        ModalController.prototype.close = function () {
            this.asg.modalClose();
            this.fullscreen.cancel();
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
            }
        };
        ModalController.prototype.nextTransition = function () {
            var idx = this.asg.transitions.indexOf(this.config.transition) + 1;
            var next = idx >= this.asg.transitions.length ? 0 : idx;
            this.config.transition = this.asg.transitions[next];
        };
        ModalController.prototype.toggleFullScreen = function () {
            if (this.fullscreen.isEnabled()) {
                this.fullscreen.cancel();
            }
            else {
                this.fullscreen.all();
            }
            this.asg.setFocus();
        };
        ModalController.prototype.setTransition = function (transition) {
            this.config.transition = transition;
            this.asg.setFocus();
        };
        ModalController.prototype.setTheme = function (theme) {
            this.asg.options.theme = theme;
            this.asg.setFocus();
        };
        ModalController.prototype.arrowsHide = function () {
            this.arrowsVisible = false;
        };
        ModalController.prototype.arrowsShow = function () {
            this.arrowsVisible = true;
        };
        ModalController.prototype.toggleHelp = function () {
            this.config.help = !this.config.help;
            this.asg.setFocus();
        };
        ModalController.prototype.toggleSize = function () {
            var index = this.asg.sizes.indexOf(this.config.size);
            index = (index + 1) >= this.asg.sizes.length ? 0 : ++index;
            this.config.size = this.asg.sizes[index];
            this.asg.log('toggle image size:', [this.config.size, index]);
        };
        ModalController.prototype.toggleMenu = function () {
            this.config.menu = !this.config.menu;
        };
        ModalController.prototype.toggleCaption = function () {
            this.config.caption = !this.config.caption;
        };
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
                console.log('modal set visible', this.asg, this);
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
    ASG.ModalController = ModalController;
    var app = angular.module('angularSuperGallery');
    app.component("asgModal", {
        controller: ["asgService", "Fullscreen", "$scope", ASG.ModalController],
        templateUrl: 'views/asg-modal.html',
        bindings: {
            id: "@?",
            items: '=?',
            options: '=?',
            selected: '=?',
            visible: "=?"
        }
    });
})(ASG || (ASG = {}));

var ASG;
(function (ASG) {
    var PanelController = (function () {
        function PanelController(service, $scope) {
            this.service = service;
            this.$scope = $scope;
            this.type = 'panel';
        }
        PanelController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this);
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
    ASG.PanelController = PanelController;
    var app = angular.module('angularSuperGallery');
    app.component("asgPanel", {
        controller: ["asgService", "$scope", ASG.PanelController],
        templateUrl: 'views/asg-panel.html',
        bindings: {
            id: "@",
            items: '=?',
            options: '=?',
            selected: '=?',
            visible: '=?'
        }
    });
})(ASG || (ASG = {}));

var ASG;
(function (ASG) {
    var ServiceController = (function () {
        function ServiceController(timeout, interval, location, $rootScope) {
            this.timeout = timeout;
            this.interval = interval;
            this.location = location;
            this.$rootScope = $rootScope;
            this.slug = 'asg';
            this.files = [];
            this.modalAvailable = false;
            this.instances = {};
            this._visible = false;
            this.options = null;
            this.optionsLoaded = false;
            this.defaults = {
                debug: false,
                baseUrl: "",
                fields: {
                    source: {
                        modal: "url",
                        panel: "url",
                        image: "url"
                    },
                    title: "title",
                    description: "description",
                    thumbnail: "thumbnail"
                },
                autoplay: {
                    enabled: false,
                    delay: 4100
                },
                theme: 'default',
                preloadDelay: 770,
                preload: [],
                modal: {
                    title: "",
                    subtitle: "",
                    caption: true,
                    menu: true,
                    help: false,
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
                panel: {
                    visible: true,
                    item: {
                        class: 'col-md-3',
                        caption: false
                    },
                },
                image: {
                    transition: 'slideLR',
                    size: 'cover',
                    height: 0,
                    heightMin: 0,
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
        }
        ServiceController.prototype.$onInit = function () {
        };
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
        ServiceController.prototype.getInstance = function (component) {
            if (!component.id) {
                if (component.$scope && component.$scope.$parent && component.$scope.$parent.$parent && component.$scope.$parent.$parent.$ctrl) {
                    component.id = component.$scope.$parent.$parent.$ctrl.id;
                }
                else {
                    component.id = Math.random().toString(36).substring(7);
                }
            }
            var id = component.id;
            var instance = this.instances[id];
            if (instance == undefined) {
                instance = new ServiceController(this.timeout, this.interval, this.location, this.$rootScope);
                instance.id = id;
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
            this.log('config', this.options);
            return this.options;
        };
        Object.defineProperty(ServiceController.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (v) {
                this._selected = v;
                this.preload();
            },
            enumerable: true,
            configurable: true
        });
        ServiceController.prototype.setSelected = function (index) {
            this.autoPlayStop();
            this.direction = index > this.selected ? 'forward' : 'backward';
            this.selected = this.normalize(index);
        };
        ServiceController.prototype.toBackward = function (stop, $event) {
            if ($event) {
                $event.stopPropagation();
            }
            stop && this.autoPlayStop();
            this.direction = 'backward';
            this.selected = this.normalize(--this.selected);
            this.loadImage(this.selected - 1);
            this.setHash();
            this.setFocus();
        };
        ServiceController.prototype.toForward = function (stop, $event) {
            if ($event) {
                $event.stopPropagation();
            }
            stop && this.autoPlayStop();
            this.direction = 'forward';
            this.selected = this.normalize(++this.selected);
            this.loadImage(this.selected + 1);
            this.setHash();
            this.setFocus();
        };
        ServiceController.prototype.toFirst = function (stop) {
            stop && this.autoPlayStop();
            this.direction = 'backward';
            this.selected = 0;
            this.setHash();
        };
        ServiceController.prototype.toLast = function (stop) {
            stop && this.autoPlayStop();
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
            if (this.autoplay) {
                this.interval.cancel(this.autoplay);
                this.options.autoplay.enabled = false;
            }
        };
        ServiceController.prototype.autoPlayStart = function () {
            var _this = this;
            this.options.autoplay.enabled = true;
            this.autoplay = this.interval(function () {
                _this.toForward();
                _this.log('autoplay', { index: _this.selected, file: _this.file });
            }, this.options.autoplay.delay);
        };
        ServiceController.prototype.prepareItems = function () {
            var self = this;
            var getAvailableSource = function (type, source) {
                if (source[type]) {
                    return source[type];
                }
                if (type == 'panel') {
                    return getAvailableSource('image', source);
                }
                if (type == 'image') {
                    return getAvailableSource('modal', source);
                }
                if (type == 'modal') {
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
                if (self.options.fields != undefined) {
                    title = value[self.options.fields.title] ? value[self.options.fields.title] : filename;
                }
                else {
                    title = filename;
                }
                if (self.options.fields != undefined) {
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
            this.log('images', this.files);
        };
        ServiceController.prototype.hoverPreload = function (index) {
            this.loadImage(index);
        };
        ServiceController.prototype.preload = function (wait) {
            var _this = this;
            this.loadImage(this.selected);
            this.timeout(function () {
                _this.loadImage(_this.selected + 1);
            }, (wait != undefined) ? wait : this.options.preloadDelay);
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
            if (this.files[index].loaded['modal']) {
                return;
            }
            var image = new Image();
            image.src = this.files[index].source['image'];
            image.addEventListener('load', function () {
                _this.afterLoad(index, 'image', image);
            });
            var modal = new Image();
            modal.src = this.files[index].source['modal'];
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
            this.files[index].loaded[type] = true;
            if (type == 'modal') {
                this.files[index].width = image.width;
                this.files[index].height = image.height;
                this.files[index].name = this.getFilename(index, type);
                this.files[index].extension = this.getExtension(index, type);
                this.files[index].download = this.files[index].source.modal;
            }
            var data = { index: index, file: this.file, img: image };
            var eventName = ['asg-load', type, this.id].join('-');
            this.$rootScope.$emit(eventName, data);
            this.log('load source: ' + type, data);
        };
        Object.defineProperty(ServiceController.prototype, "isSingle", {
            get: function () {
                return this.files.length > 1 ? false : true;
            },
            enumerable: true,
            configurable: true
        });
        ServiceController.prototype.downloadLink = function () {
            if (this.selected != undefined && this.files.length > 0) {
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
        ServiceController.prototype.setFocus = function () {
            this.el('.asg-modal.' + this.id + ' .keyInput').trigger('focus').focus();
        };
        ServiceController.prototype.modalInit = function () {
            var _this = this;
            var self = this;
            this.timeout(function () {
                var element = '.gallery-modal.' + self.id + ' li.dropdown-submenu';
                _this.el(element).off().on('click', function (event) {
                    event.stopPropagation();
                    if (this.el(this).hasClass('open')) {
                        this.el(this).removeClass('open');
                    }
                    else {
                        this.el(element).removeClass('open');
                        this.el(this).addClass('open');
                    }
                });
                self.setFocus();
            }, 100);
        };
        ServiceController.prototype.modalOpen = function (index) {
            if (!this.modalAvailable) {
                return;
            }
            this.selected = index ? index : this.selected;
            this.modalVisible = true;
            this.setHash();
        };
        ServiceController.prototype.modalClose = function () {
            this.location.hash('');
            this.modalVisible = false;
        };
        ServiceController.prototype.log = function (event, data) {
            if (this.options.debug) {
                console.log('ASG | ' + this.id + ' : ' + event, data ? data : null);
            }
        };
        ServiceController.prototype.el = function (selector) {
            return angular.element(selector);
        };
        return ServiceController;
    }());
    ASG.ServiceController = ServiceController;
    var app = angular.module('angularSuperGallery');
    app.service('asgService', ["$timeout", "$interval", "$location", "$rootScope", ServiceController]);
})(ASG || (ASG = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzZy50cyIsImFzZy1jb250cm9sLnRzIiwiYXNnLWltYWdlLnRzIiwiYXNnLWluZm8udHMiLCJhc2ctbW9kYWwudHMiLCJhc2ctcGFuZWwudHMiLCJhc2ctc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxJQUFPLEdBQUcsQ0FtQlQ7QUFuQkQsV0FBTyxHQUFHO0lBRVQsSUFBSSxHQUFHLEdBQWdCLE9BQU8sQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFcEcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDdEIsTUFBTSxDQUFDLFVBQVUsS0FBVyxFQUFFLFNBQWtCO1lBRS9DLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsRUFBRSxDQUFBO1lBQzNELEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUM1QixFQUFFLENBQUMsQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLENBQUM7Z0JBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztZQUVwRCxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FB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QUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDaEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFFMUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRW5DLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUVaLEtBQUssRUFBRSxDQUFDO2dCQUNSLEtBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2dCQUN0QixLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXZCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVSLENBQUM7UUFHTSx1Q0FBVyxHQUFsQixVQUFtQixTQUFlO1lBRWpDLEVBQUUsQ0FBQyxDQUFDLENBQUMs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QVEsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssR0FBRyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JFLENBQUM7UUFFRixDQUFDO1FBRU0sOEJBQUUsR0FBVCxVQUFVLFFBQVE7WUFFakIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbEMsQ0FBQztRQUdGLHdCQUFDO0lBQUQsQ0Exc0JBLEFBMHNCQyxJQUFBO0lBMXNCWSxxQkFBaUIsb0JBMHNCN0IsQ0FBQTtJQUVELElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFFN0QsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0FBRXBHLENBQUMsRUE5M0JNLEdBQUcsS0FBSCxHQUFHLFFBODNCVCIsImZpbGUiOiJhbmd1bGFyLXN1cGVyLWdhbGxlcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5tb2R1bGUgQVNHIHtcclxuXHJcblx0dmFyIGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScsIFsnbmdBbmltYXRlJywgJ0ZCQW5ndWxhcicsICduZ1RvdWNoJ10pO1xyXG5cclxuXHRhcHAuZmlsdGVyKCdhc2dCeXRlcycsICgpID0+IHtcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoYnl0ZXMgOiBhbnksIHByZWNpc2lvbiA6IG51bWJlcikgOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0aWYgKGlzTmFOKHBhcnNlRmxvYXQoYnl0ZXMpKSB8fCAhaXNGaW5pdGUoYnl0ZXMpKSByZXR1cm4gJydcclxuXHRcdFx0aWYgKGJ5dGVzID09PSAwKSByZXR1cm4gJzAnO1xyXG5cdFx0XHRpZiAodHlwZW9mIHByZWNpc2lvbiA9PT0gJ3VuZGVmaW5lZCcpIHByZWNpc2lvbiA9IDE7XHJcblxyXG5cdFx0XHR2YXIgdW5pdHMgPSBbJ2J5dGVzJywgJ2tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJ10sXHJcblx0XHRcdFx0bnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZygxMDI0KSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gKGJ5dGVzIC8gTWF0aC5wb3coMTAyNCwgTWF0aC5mbG9vcihudW1iZXIpKSkudG9GaXhlZChwcmVjaXNpb24pICsgJyAnICsgdW5pdHNbbnVtYmVyXTtcclxuXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcblxyXG4iLCJtb2R1bGUgQVNHIHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIENvbnRyb2xDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIHR5cGUgOiBzdHJpbmcgPSAnY29udHJvbCc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgdGVtcGxhdGUgOiBzdHJpbmcgPSAndmlld3MvYXNnLWNvbnRyb2wuaHRtbCc7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkc2NvcGUgOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHRcdHRoaXMuJHNjb3BlLmZvcndhcmQgPSAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLiRzY29wZS5iYWNrd2FyZCA9ICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zSW1hZ2UpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0fVxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoXCJhc2dDb250cm9sXCIsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFtcImFzZ1NlcnZpY2VcIiwgXCIkc2NvcGVcIiwgQVNHLkNvbnRyb2xDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImFzZy1jb250cm9sIHt7ICRjdHJsLmFzZy50aGVtZSB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiBcIkA/XCIsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR0ZW1wbGF0ZTogXCJAP1wiXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxufSIsIm1vZHVsZSBBU0cge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgSW1hZ2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cclxuXHRcdHByaXZhdGUgdHlwZSA6IHN0cmluZyA9ICdpbWFnZSc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdFx0XHRwcml2YXRlICRyb290U2NvcGUgOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgJGVsZW1lbnQgOiBuZy5JUm9vdEVsZW1lbnRTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkd2luZG93IDogbmcuSVdpbmRvd1NlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlICRzY29wZSA6IG5nLklTY29wZSkge1xyXG5cclxuXHRcdFx0YW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoJ3Jlc2l6ZScsIChldmVudCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMub25SZXNpemUoKVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBvblJlc2l6ZSgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmNvbmZpZy5oZWlnaHRBdXRvLm9ucmVzaXplKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRIZWlnaHQodGhpcy5hc2cuZmlsZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHRcdC8vIHNldCBpbWFnZSBjb21wb25lbnQgaGVpZ2h0XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kb24oJ2FzZy1sb2FkLWltYWdlLScgKyB0aGlzLmlkLCAoZXZlbnQsIGRhdGEpID0+IHtcclxuXHJcblx0XHRcdFx0aWYgKCF0aGlzLmNvbmZpZy5oZWlnaHQgJiYgdGhpcy5jb25maWcuaGVpZ2h0QXV0by5pbml0aWFsID09PSB0cnVlKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldEhlaWdodChkYXRhLmltZyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBpbWFnZSBjb21wb25lbnQgaGVpZ2h0XHJcblx0XHRwcml2YXRlIHNldEhlaWdodChpbWcpIHtcclxuXHJcblx0XHRcdHZhciB3aWR0aCA9IHRoaXMuJGVsZW1lbnQuY2hpbGRyZW4oJ2RpdicpLndpZHRoKCk7XHJcblx0XHRcdHZhciByYXRpbyA9IGltZy53aWR0aCAvIGltZy5oZWlnaHQ7XHJcblx0XHRcdHRoaXMuY29uZmlnLmhlaWdodCA9IHdpZHRoIC8gcmF0aW87XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGhlaWdodFxyXG5cdFx0cHVibGljIGdldCBoZWlnaHQoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcuaGVpZ2h0O1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IGltYWdlIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKSA6IElPcHRpb25zSW1hZ2Uge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IGltYWdlIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc0ltYWdlKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoXCJhc2dJbWFnZVwiLCB7XHJcblx0XHRjb250cm9sbGVyOiBbXCJhc2dTZXJ2aWNlXCIsIFwiJHJvb3RTY29wZVwiLCBcIiRlbGVtZW50XCIsIFwiJHdpbmRvd1wiLCBcIiRzY29wZVwiLCBBU0cuSW1hZ2VDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLWltYWdlLmh0bWwnLFxyXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiBcIkA/XCIsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcbn0iLCJtb2R1bGUgQVNHIHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIEluZm9Db250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIHR5cGUgOiBzdHJpbmcgPSAnaW5mbyc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHRcdHByaXZhdGUgdGVtcGxhdGUgOiBzdHJpbmcgPSAndmlld3MvYXNnLWluZm8uaHRtbCc7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkc2NvcGUgOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGdldCBmaWxlKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuZmlsZTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoXCJhc2dJbmZvXCIsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFtcImFzZ1NlcnZpY2VcIiwgXCIkc2NvcGVcIiwgQVNHLkluZm9Db250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImFzZy1pbmZvIHt7ICRjdHJsLmFzZy50aGVtZSB9fVwiPjxkaXYgbmctaW5jbHVkZT1cIiRjdHJsLnRlbXBsYXRlXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogXCJAP1wiLFxyXG5cdFx0XHR0ZW1wbGF0ZTogXCJAP1wiXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59IiwibW9kdWxlIEFTRyB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBNb2RhbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHB1YmxpYyBpZCA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRwdWJsaWMgaXRlbXMgOiBBcnJheTxJRmlsZT47XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlIDogc3RyaW5nID0gJ21vZGFsJztcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cdFx0cHJpdmF0ZSBhcnJvd3NWaXNpYmxlIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgZnVsbHNjcmVlbixcclxuXHRcdFx0XHRcdHByaXZhdGUgJHNjb3BlIDogbmcuSVNjb3BlKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbEF2YWlsYWJsZSA9IHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwcml2YXRlIGdldENsYXNzKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmNvbmZpZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIG5nQ2xhc3MgPSBbXTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5jb25maWcubWVudSkge1xyXG5cdFx0XHRcdG5nQ2xhc3MucHVzaCgnbm9tZW51Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5nQ2xhc3MucHVzaCh0aGlzLmFzZy5vcHRpb25zLnRoZW1lKTtcclxuXHJcblx0XHRcdHJldHVybiBuZ0NsYXNzLmpvaW4oJyAnKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGFjdGlvbiBmcm9tIGtleWNvZGVzXHJcblx0XHRwcml2YXRlIGdldEFjdGlvbkJ5S2V5Q29kZShrZXlDb2RlIDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmtleWNvZGVzKTtcclxuXHRcdFx0dmFyIGFjdGlvbjtcclxuXHJcblx0XHRcdGZvciAodmFyIGtleSBpbiBrZXlzKSB7XHJcblxyXG5cdFx0XHRcdHZhciBjb2RlcyA9IHRoaXMuY29uZmlnLmtleWNvZGVzW2tleXNba2V5XV07XHJcblxyXG5cdFx0XHRcdGlmICghY29kZXMpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIGluZGV4ID0gY29kZXMuaW5kZXhPZihrZXlDb2RlKTtcclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcclxuXHRcdFx0XHRcdGFjdGlvbiA9IGtleXNba2V5XTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiBhY3Rpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgY2xvc2UoKXtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xvc2UoKTtcclxuXHRcdFx0dGhpcy5mdWxsc2NyZWVuLmNhbmNlbCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBkbyBrZXlib2FyZCBhY3Rpb25cclxuXHRcdHB1YmxpYyBrZXlVcChlIDogS2V5Ym9hcmRFdmVudCkge1xyXG5cclxuXHRcdFx0dmFyIGFjdGlvbiA6IHN0cmluZyA9IHRoaXMuZ2V0QWN0aW9uQnlLZXlDb2RlKGUua2V5Q29kZSk7XHJcblxyXG5cdFx0XHRzd2l0Y2ggKGFjdGlvbikge1xyXG5cclxuXHRcdFx0XHRjYXNlICdleGl0JzpcclxuXHRcdFx0XHRcdHRoaXMuY2xvc2UoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdwbGF5cGF1c2UnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cuYXV0b1BsYXlUb2dnbGUoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdmb3J3YXJkJzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdiYWNrd2FyZCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2ZpcnN0JzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvRmlyc3QodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnbGFzdCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0xhc3QodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnZnVsbHNjcmVlbic6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUZ1bGxTY3JlZW4oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdtZW51JzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTWVudSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2NhcHRpb24nOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVDYXB0aW9uKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnaGVscCc6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUhlbHAoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdzaXplJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlU2l6ZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3RyYW5zaXRpb24nOlxyXG5cdFx0XHRcdFx0dGhpcy5uZXh0VHJhbnNpdGlvbigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBzd2l0Y2ggdG8gbmV4dCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHJpdmF0ZSBuZXh0VHJhbnNpdGlvbigpIHtcclxuXHJcblx0XHRcdHZhciBpZHggPSB0aGlzLmFzZy50cmFuc2l0aW9ucy5pbmRleE9mKHRoaXMuY29uZmlnLnRyYW5zaXRpb24pICsgMTtcclxuXHRcdFx0dmFyIG5leHQgPSBpZHggPj0gdGhpcy5hc2cudHJhbnNpdGlvbnMubGVuZ3RoID8gMCA6IGlkeDtcclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRoaXMuYXNnLnRyYW5zaXRpb25zW25leHRdO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGZ1bGxzY3JlZW5cclxuXHRcdHByaXZhdGUgdG9nZ2xlRnVsbFNjcmVlbigpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmZ1bGxzY3JlZW4uaXNFbmFibGVkKCkpIHtcclxuXHRcdFx0XHR0aGlzLmZ1bGxzY3JlZW4uY2FuY2VsKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5mdWxsc2NyZWVuLmFsbCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHVibGljIHNldFRyYW5zaXRpb24odHJhbnNpdGlvbikge1xyXG5cclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGVtZVxyXG5cdFx0cHVibGljIHNldFRoZW1lKHRoZW1lIDogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zLnRoZW1lID0gdGhlbWU7XHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG92ZXJsYXkgYXJyb3dzIGhpZGVcclxuXHRcdHB1YmxpYyBhcnJvd3NIaWRlKCkge1xyXG5cclxuXHRcdFx0dGhpcy5hcnJvd3NWaXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG92ZXJsYXkgYXJyb3dzIHNob3dcclxuXHRcdHB1YmxpYyBhcnJvd3NTaG93KCkge1xyXG5cclxuXHRcdFx0dGhpcy5hcnJvd3NWaXNpYmxlID0gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGhlbHBcclxuXHRcdHByaXZhdGUgdG9nZ2xlSGVscCgpIHtcclxuXHJcblx0XHRcdHRoaXMuY29uZmlnLmhlbHAgPSAhdGhpcy5jb25maWcuaGVscDtcclxuXHRcdFx0dGhpcy5hc2cuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIHNpemVcclxuXHRcdHByaXZhdGUgdG9nZ2xlU2l6ZSgpIHtcclxuXHJcblx0XHRcdHZhciBpbmRleCA9IHRoaXMuYXNnLnNpemVzLmluZGV4T2YodGhpcy5jb25maWcuc2l6ZSk7XHJcblx0XHRcdGluZGV4ID0gKGluZGV4ICsgMSkgPj0gdGhpcy5hc2cuc2l6ZXMubGVuZ3RoID8gMCA6ICsraW5kZXg7XHJcblx0XHRcdHRoaXMuY29uZmlnLnNpemUgPSB0aGlzLmFzZy5zaXplc1tpbmRleF07XHJcblx0XHRcdHRoaXMuYXNnLmxvZygndG9nZ2xlIGltYWdlIHNpemU6JywgW3RoaXMuY29uZmlnLnNpemUsIGluZGV4XSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBtZW51XHJcblx0XHRwcml2YXRlIHRvZ2dsZU1lbnUoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmNvbmZpZy5tZW51ID0gIXRoaXMuY29uZmlnLm1lbnU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBjYXB0aW9uXHJcblx0XHRwcml2YXRlIHRvZ2dsZUNhcHRpb24oKSB7XHJcblxyXG5cdFx0XHR0aGlzLmNvbmZpZy5jYXB0aW9uID0gIXRoaXMuY29uZmlnLmNhcHRpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtb2RhbCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgZ2V0IHZpc2libGUoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cubW9kYWxWaXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgbW9kYWwgdmlzaWJsZVxyXG5cdFx0cHVibGljIHNldCB2aXNpYmxlKHZhbHVlIDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxWaXNpYmxlID0gdmFsdWU7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdtb2RhbCBzZXQgdmlzaWJsZScsIHRoaXMuYXNnLCB0aGlzKTtcclxuXHRcdFx0dGhpcy5hc2cuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cuc2VsZWN0ZWQgPSB2O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cuc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtb2RhbCBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc01vZGFsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBtb2RhbCBjb25maWdcclxuXHRcdHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlIDogSU9wdGlvbnNNb2RhbCkge1xyXG5cclxuXHRcdFx0dGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoXCJhc2dNb2RhbFwiLCB7XHJcblx0XHRjb250cm9sbGVyOiBbXCJhc2dTZXJ2aWNlXCIsIFwiRnVsbHNjcmVlblwiLCBcIiRzY29wZVwiLCBBU0cuTW9kYWxDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLW1vZGFsLmh0bWwnLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6IFwiQD9cIixcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR2aXNpYmxlOiBcIj0/XCJcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn0iLCJtb2R1bGUgQVNHIHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIFBhbmVsQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHJcblx0XHRwcml2YXRlIHR5cGUgOiBzdHJpbmcgPSAncGFuZWwnO1xyXG5cdFx0cHJpdmF0ZSBhc2cgOiBJU2VydmljZUNvbnRyb2xsZXI7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkc2NvcGUgOiBuZy5JU2NvcGUpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHBhbmVsIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKSA6IElPcHRpb25zUGFuZWwge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHBhbmVsIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc1BhbmVsKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLnNlbGVjdGVkID0gdjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLnNlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoXCJhc2dQYW5lbFwiLCB7XHJcblx0XHRjb250cm9sbGVyOiBbXCJhc2dTZXJ2aWNlXCIsIFwiJHNjb3BlXCIsIEFTRy5QYW5lbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9hc2ctcGFuZWwuaHRtbCcsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogXCJAXCIsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dmlzaWJsZTogJz0/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBBU0cge1xyXG5cclxuXHQvLyBtb2RhbCBjb21wb25lbnQgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNNb2RhbCB7XHJcblxyXG5cdFx0bWVudT8gOiBib29sZWFuO1xyXG5cdFx0aGVscD8gOiBib29sZWFuO1xyXG5cdFx0Y2FwdGlvbj8gOiBib29sZWFuO1xyXG5cdFx0dHJhbnNpdGlvbj8gOiBzdHJpbmc7XHJcblx0XHR0aXRsZT8gOiBzdHJpbmc7XHJcblx0XHRzdWJ0aXRsZT8gOiBzdHJpbmc7XHJcblx0XHRzaXplPyA6IHN0cmluZztcclxuXHRcdGtleWNvZGVzPyA6IHtcclxuXHRcdFx0ZXhpdD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRwbGF5cGF1c2U/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0Zm9yd2FyZD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRiYWNrd2FyZD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRmaXJzdD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRsYXN0PyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGZ1bGxzY3JlZW4/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0bWVudT8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRjYXB0aW9uPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGhlbHA/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0c2l6ZT8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHR0cmFuc2l0aW9uPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBwYW5lbCBjb21wb25lbnQgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNQYW5lbCB7XHJcblxyXG5cdFx0dmlzaWJsZT8gOiBib29sZWFuO1xyXG5cdFx0aXRlbT8gOiB7XHJcblx0XHRcdGNsYXNzPyA6IHN0cmluZztcclxuXHRcdFx0Y2FwdGlvbiA6IGJvb2xlYW47XHJcblx0XHR9LFxyXG5cclxuXHR9XHJcblxyXG5cdC8vIGluZm8gY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zSW5mbyB7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gaW1hZ2UgY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zSW1hZ2Uge1xyXG5cclxuXHRcdHRyYW5zaXRpb24/IDogc3RyaW5nO1xyXG5cdFx0c2l6ZT8gOiBzdHJpbmc7XHJcblx0XHRoZWlnaHQ/IDogbnVtYmVyO1xyXG5cdFx0aGVpZ2h0TWluPyA6IG51bWJlcjtcclxuXHRcdGhlaWdodEF1dG8/IDoge1xyXG5cdFx0XHRpbml0aWFsPyA6IGJvb2xlYW4sXHJcblx0XHRcdG9ucmVzaXplPyA6IGJvb2xlYW5cclxuXHRcdH07XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gZ2FsbGVyeSBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9ucyB7XHJcblxyXG5cdFx0ZGVidWc/IDogYm9vbGVhbixcclxuXHRcdGJhc2VVcmw/IDogc3RyaW5nO1xyXG5cdFx0ZmllbGRzPyA6IHtcclxuXHRcdFx0c291cmNlPyA6IHtcclxuXHRcdFx0XHRtb2RhbD8gOiBzdHJpbmc7XHJcblx0XHRcdFx0cGFuZWw/IDogc3RyaW5nO1xyXG5cdFx0XHRcdGltYWdlPyA6IHN0cmluZztcclxuXHRcdFx0fVxyXG5cdFx0XHR0aXRsZT8gOiBzdHJpbmc7XHJcblx0XHRcdGRlc2NyaXB0aW9uPyA6IHN0cmluZztcclxuXHRcdFx0dGh1bWJuYWlsPyA6IHN0cmluZztcclxuXHRcdH0sXHJcblx0XHRhdXRvcGxheT8gOiB7XHJcblx0XHRcdGVuYWJsZWQ/IDogYm9vbGVhbjtcclxuXHRcdFx0ZGVsYXk/IDogbnVtYmVyO1xyXG5cdFx0fSxcclxuXHRcdHRoZW1lPyA6IHN0cmluZztcclxuXHRcdHByZWxvYWREZWxheT8gOiBudW1iZXI7XHJcblx0XHRwcmVsb2FkPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRtb2RhbD8gOiBJT3B0aW9uc01vZGFsO1xyXG5cdFx0cGFuZWw/IDogSU9wdGlvbnNQYW5lbDtcclxuXHRcdGltYWdlPyA6IElPcHRpb25zSW1hZ2U7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gaW1hZ2Ugc291cmNlXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJU291cmNlIHtcclxuXHJcblx0XHRtb2RhbCA6IHN0cmluZzsgLy8gb3JpZ2luYWwsIHJlcXVpcmVkXHJcblx0XHRwYW5lbD8gOiBzdHJpbmc7XHJcblx0XHRpbWFnZT8gOiBzdHJpbmc7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gaW1hZ2UgZmlsZVxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUZpbGUge1xyXG5cclxuXHRcdHNvdXJjZSA6IElTb3VyY2U7XHJcblx0XHR0aXRsZT8gOiBzdHJpbmc7XHJcblx0XHRuYW1lPyA6IHN0cmluZztcclxuXHRcdGV4dGVuc2lvbj8gOiBzdHJpbmc7XHJcblx0XHRkZXNjcmlwdGlvbj8gOiBzdHJpbmc7XHJcblx0XHQvL3RodW1ibmFpbD8gOiBzdHJpbmc7XHJcblx0XHRkb3dubG9hZD8gOiBzdHJpbmc7XHJcblx0XHRsb2FkZWQ/IDoge1xyXG5cdFx0XHRtb2RhbD8gOiBib29sZWFuO1xyXG5cdFx0XHRwYW5lbD8gOiBib29sZWFuO1xyXG5cdFx0XHRpbWFnZT8gOiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHRcdHdpZHRoPyA6IG51bWJlcjtcclxuXHRcdGhlaWdodD8gOiBudW1iZXI7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gc2VydmljZSBjb250cm9sbGVyIGludGVyZmFjZVxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVNlcnZpY2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRnZXRJbnN0YW5jZShjb21wb25lbnQgOiBhbnkpIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cclxuXHRcdHNldERlZmF1bHRzKCkgOiB2b2lkO1xyXG5cclxuXHRcdHNldE9wdGlvbnMob3B0aW9ucyA6IElPcHRpb25zKSA6IElPcHRpb25zO1xyXG5cclxuXHRcdHNldEl0ZW1zKGl0ZW1zIDogQXJyYXk8SUZpbGU+KSA6IHZvaWQ7XHJcblxyXG5cdFx0cHJlbG9hZCh3YWl0PyA6IG51bWJlcikgOiB2b2lkO1xyXG5cclxuXHRcdG5vcm1hbGl6ZShpbmRleCA6IG51bWJlcikgOiBudW1iZXI7XHJcblxyXG5cdFx0c2V0Rm9jdXMoKSA6IHZvaWQ7XHJcblxyXG5cdFx0bW9kYWxPcGVuKGluZGV4IDogbnVtYmVyKSA6IHZvaWQ7XHJcblxyXG5cdFx0bW9kYWxDbG9zZSgpIDogdm9pZDtcclxuXHJcblx0XHR0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cclxuXHRcdHRvRm9yd2FyZChzdG9wPyA6IGJvb2xlYW4pIDogdm9pZDtcclxuXHJcblx0XHR0b0ZpcnN0KHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cclxuXHRcdHRvTGFzdChzdG9wPyA6IGJvb2xlYW4pIDogdm9pZDtcclxuXHJcblx0XHRsb2FkSW1hZ2UoaW5kZXg/IDogbnVtYmVyKSA6IHZvaWQ7XHJcblxyXG5cdFx0bG9hZEltYWdlcyhpbmRleGVzIDogQXJyYXk8bnVtYmVyPikgOiB2b2lkO1xyXG5cclxuXHRcdGF1dG9QbGF5VG9nZ2xlKCkgOiB2b2lkO1xyXG5cclxuXHRcdHRvZ2dsZShlbGVtZW50IDogc3RyaW5nKSA6IHZvaWQ7XHJcblxyXG5cdFx0ZWwoc2VsZWN0b3IpIDogYW55O1xyXG5cclxuXHRcdHNldEhhc2goKSA6IHZvaWQ7XHJcblxyXG5cdFx0ZG93bmxvYWRMaW5rKCkgOiBzdHJpbmc7XHJcblxyXG5cdFx0bG9nKGV2ZW50IDogc3RyaW5nLCBkYXRhPyA6IGFueSkgOiB2b2lkO1xyXG5cclxuXHRcdG1vZGFsVmlzaWJsZSA6IGJvb2xlYW47XHJcblx0XHRwYW5lbFZpc2libGUgOiBib29sZWFuO1xyXG5cdFx0bW9kYWxBdmFpbGFibGUgOiBib29sZWFuO1xyXG5cdFx0dHJhbnNpdGlvbnMgOiBBcnJheTxzdHJpbmc+O1xyXG5cdFx0dGhlbWVzIDogQXJyYXk8c3RyaW5nPjtcclxuXHRcdG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0c2VsZWN0ZWQgOiBudW1iZXI7XHJcblx0XHRmaWxlIDogSUZpbGU7XHJcblx0XHRzaXplcyA6IEFycmF5PHN0cmluZz47XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gc2VydmljZSBjb250cm9sbGVyXHJcblx0ZXhwb3J0IGNsYXNzIFNlcnZpY2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgc2x1ZyA6IHN0cmluZyA9ICdhc2cnO1xyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogYW55O1xyXG5cdFx0cHVibGljIGZpbGVzIDogQXJyYXk8SUZpbGU+ID0gW107XHJcblx0XHRwdWJsaWMgZGlyZWN0aW9uIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG1vZGFsQXZhaWxhYmxlIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRcdHByaXZhdGUgaW5zdGFuY2VzIDoge30gPSB7fTtcclxuXHRcdHByaXZhdGUgX3NlbGVjdGVkIDogbnVtYmVyO1xyXG5cdFx0cHJpdmF0ZSBfdmlzaWJsZSA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdHByaXZhdGUgYXV0b3BsYXkgOiBhbmd1bGFyLklQcm9taXNlPGFueT47XHJcblxyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucyA9IG51bGw7XHJcblx0XHRwdWJsaWMgb3B0aW9uc0xvYWRlZCA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0XHRwdWJsaWMgZGVmYXVsdHMgOiBJT3B0aW9ucyA9IHtcclxuXHRcdFx0ZGVidWc6IGZhbHNlLCAvLyBpbWFnZSBsb2FkIGFuZCBhdXRvcGxheSBpbmZvIGluIGNvbnNvbGUubG9nXHJcblx0XHRcdGJhc2VVcmw6IFwiXCIsIC8vIHVybCBwcmVmaXhcclxuXHRcdFx0ZmllbGRzOiB7XHJcblx0XHRcdFx0c291cmNlOiB7XHJcblx0XHRcdFx0XHRtb2RhbDogXCJ1cmxcIiwgLy8gcmVxdWlyZWQsIGltYWdlIHVybCBmb3IgbW9kYWwgY29tcG9uZW50IChsYXJnZSBzaXplKVxyXG5cdFx0XHRcdFx0cGFuZWw6IFwidXJsXCIsIC8vIGltYWdlIHVybCBmb3IgcGFuZWwgY29tcG9uZW50ICh0aHVtYm5haWwgc2l6ZSlcclxuXHRcdFx0XHRcdGltYWdlOiBcInVybFwiIC8vIGltYWdlIHVybCBmb3IgaW1hZ2UgKG1lZGl1bSBzaXplKVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dGl0bGU6IFwidGl0bGVcIiwgLy8gdGl0bGUgaW5wdXQgZmllbGQgbmFtZVxyXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBcImRlc2NyaXB0aW9uXCIsIC8vIGRlc2NyaXB0aW9uIGlucHV0IGZpZWxkIG5hbWVcclxuXHRcdFx0XHR0aHVtYm5haWw6IFwidGh1bWJuYWlsXCIgLy8gdGh1bWJuYWlsIGlucHV0IGZpZWxkIG5hbWVcclxuXHRcdFx0fSxcclxuXHRcdFx0YXV0b3BsYXk6IHtcclxuXHRcdFx0XHRlbmFibGVkOiBmYWxzZSwgLy8gc2xpZGVzaG93IHBsYXkgZW5hYmxlZC9kaXNhYmxlZFxyXG5cdFx0XHRcdGRlbGF5OiA0MTAwIC8vIGF1dG9wbGF5IGRlbGF5IGluIG1pbGxpc2Vjb25kXHJcblx0XHRcdH0sXHJcblx0XHRcdHRoZW1lOiAnZGVmYXVsdCcsIC8vIGNzcyBzdHlsZSBbZGVmYXVsdCwgZGFya2JsdWUsIHdoaXRlZ29sZF1cclxuXHRcdFx0cHJlbG9hZERlbGF5OiA3NzAsXHJcblx0XHRcdHByZWxvYWQ6IFtdLCAvLyBwcmVsb2FkIGltYWdlcyBieSBpbmRleCBudW1iZXJcclxuXHRcdFx0bW9kYWw6IHtcclxuXHRcdFx0XHR0aXRsZTogXCJcIiwgLy8gbW9kYWwgd2luZG93IHRpdGxlXHJcblx0XHRcdFx0c3VidGl0bGU6IFwiXCIsIC8vIG1vZGFsIHdpbmRvdyBzdWJ0aXRsZVxyXG5cdFx0XHRcdGNhcHRpb246IHRydWUsIC8vIHNob3cvaGlkZSBpbWFnZSBjYXB0aW9uXHJcblx0XHRcdFx0bWVudTogdHJ1ZSwgLy8gc2hvdy9oaWRlIG1vZGFsIG1lbnVcclxuXHRcdFx0XHRoZWxwOiBmYWxzZSwgLy8gc2hvdy9oaWRlIGhlbHBcclxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRcdFx0c2l6ZTogJ2NvdmVyJywgLy8gY29udGFpbiwgY292ZXIsIGF1dG8sIHN0cmV0Y2hcclxuXHRcdFx0XHRrZXljb2Rlczoge1xyXG5cdFx0XHRcdFx0ZXhpdDogWzI3XSwgLy8gRVNDXHJcblx0XHRcdFx0XHRwbGF5cGF1c2U6IFs4MF0sIC8vIHBcclxuXHRcdFx0XHRcdGZvcndhcmQ6IFszMiwgMzldLCAvLyBTUEFDRSwgUklHSFQgQVJST1dcclxuXHRcdFx0XHRcdGJhY2t3YXJkOiBbMzddLCAvLyBMRUZUIEFSUk9XXHJcblx0XHRcdFx0XHRmaXJzdDogWzM4LCAzNl0sIC8vIFVQIEFSUk9XLCBIT01FXHJcblx0XHRcdFx0XHRsYXN0OiBbNDAsIDM1XSwgLy8gRE9XTiBBUlJPVywgRU5EXHJcblx0XHRcdFx0XHRmdWxsc2NyZWVuOiBbMTNdLCAvLyBFTlRFUlxyXG5cdFx0XHRcdFx0bWVudTogWzc3XSwgLy8gbVxyXG5cdFx0XHRcdFx0Y2FwdGlvbjogWzY3XSwgLy8gY1xyXG5cdFx0XHRcdFx0aGVscDogWzcyXSwgLy8gaFxyXG5cdFx0XHRcdFx0c2l6ZTogWzgzXSwgLy8gc1xyXG5cdFx0XHRcdFx0dHJhbnNpdGlvbjogWzg0XSAvLyB0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRwYW5lbDoge1xyXG5cdFx0XHRcdHZpc2libGU6IHRydWUsXHJcblx0XHRcdFx0aXRlbToge1xyXG5cdFx0XHRcdFx0Y2xhc3M6ICdjb2wtbWQtMycsIC8vIGl0ZW0gY2xhc3NcclxuXHRcdFx0XHRcdGNhcHRpb246IGZhbHNlXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fSxcclxuXHRcdFx0aW1hZ2U6IHtcclxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRcdFx0c2l6ZTogJ2NvdmVyJywgLy8gY29udGFpbiwgY292ZXIsIGF1dG8sIHN0cmV0Y2hcclxuXHRcdFx0XHRoZWlnaHQ6IDAsIC8vIGhlaWdodFxyXG5cdFx0XHRcdGhlaWdodE1pbjogMCwgLy8gbWluIGhlaWdodFxyXG5cdFx0XHRcdGhlaWdodEF1dG86IHtcclxuXHRcdFx0XHRcdGluaXRpYWw6IHRydWUsXHJcblx0XHRcdFx0XHRvbnJlc2l6ZTogZmFsc2VcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gYXZhaWxhYmxlIGltYWdlIHNpemVzXHJcblx0XHRwdWJsaWMgc2l6ZXMgOiBBcnJheTxzdHJpbmc+ID0gW1xyXG5cdFx0XHQnY29udGFpbicsXHJcblx0XHRcdCdjb3ZlcicsXHJcblx0XHRcdCdhdXRvJyxcclxuXHRcdFx0J3N0cmV0Y2gnXHJcblx0XHRdO1xyXG5cclxuXHRcdC8vIGF2YWlsYWJsZSB0aGVtZXNcclxuXHRcdHB1YmxpYyB0aGVtZXMgOiBBcnJheTxzdHJpbmc+ID0gW1xyXG5cdFx0XHQnZGVmYXVsdCcsXHJcblx0XHRcdCdkYXJrYmx1ZScsXHJcblx0XHRcdCd3aGl0ZWdvbGQnXHJcblx0XHRdO1xyXG5cclxuXHRcdC8vIGF2YWlsYWJsZSB0cmFuc2l0aW9uc1xyXG5cdFx0cHVibGljIHRyYW5zaXRpb25zIDogQXJyYXk8c3RyaW5nPiA9IFtcclxuXHRcdFx0J25vJyxcclxuXHRcdFx0J2ZhZGVJbk91dCcsXHJcblx0XHRcdCd6b29tSW4nLFxyXG5cdFx0XHQnem9vbU91dCcsXHJcblx0XHRcdCd6b29tSW5PdXQnLFxyXG5cdFx0XHQncm90YXRlTFInLFxyXG5cdFx0XHQncm90YXRlVEInLFxyXG5cdFx0XHQncm90YXRlWlknLFxyXG5cdFx0XHQnc2xpZGVMUicsXHJcblx0XHRcdCdzbGlkZVRCJyxcclxuXHRcdFx0J2ZsaXBYJyxcclxuXHRcdFx0J2ZsaXBZJ1xyXG5cdFx0XTtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHRpbWVvdXQgOiBuZy5JVGltZW91dFNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlIGludGVydmFsIDogbmcuSUludGVydmFsU2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgbG9jYXRpb24gOiBuZy5JTG9jYXRpb25TZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSAkcm9vdFNjb3BlIDogbmcuSVJvb3RTY29wZVNlcnZpY2UpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHJpdmF0ZSBwYXJzZUhhc2goKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuaWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBoYXNoID0gdGhpcy5sb2NhdGlvbi5oYXNoKCk7XHJcblx0XHRcdHZhciBwYXJ0cyA9IGhhc2ggPyBoYXNoLnNwbGl0KCctJykgOiBudWxsO1xyXG5cclxuXHRcdFx0aWYgKHBhcnRzID09PSBudWxsKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocGFydHNbMF0gIT09IHRoaXMuc2x1Zykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHBhcnRzLmxlbmd0aCAhPT0gMykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHBhcnRzWzFdICE9PSB0aGlzLmlkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgaW5kZXggPSBwYXJzZUludChwYXJ0c1syXSwgMTApO1xyXG5cclxuXHRcdFx0aWYgKCFhbmd1bGFyLmlzTnVtYmVyKGluZGV4KSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHJcblx0XHRcdFx0aW5kZXgtLTtcclxuXHRcdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXg7XHJcblx0XHRcdFx0dGhpcy5tb2RhbE9wZW4oaW5kZXgpO1xyXG5cclxuXHRcdFx0fSwgMjApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZSBmb3IgY3VycmVudCBnYWxsZXJ5IGJ5IGNvbXBvbmVudCBpZFxyXG5cdFx0cHVibGljIGdldEluc3RhbmNlKGNvbXBvbmVudCA6IGFueSkge1xyXG5cclxuXHRcdFx0aWYgKCFjb21wb25lbnQuaWQpIHtcclxuXHJcblx0XHRcdFx0Ly8gZ2V0IHBhcmVudCBhc2cgY29tcG9uZW50IGlkXHJcblx0XHRcdFx0aWYgKGNvbXBvbmVudC4kc2NvcGUgJiYgY29tcG9uZW50LiRzY29wZS4kcGFyZW50ICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudC4kcGFyZW50ICYmIGNvbXBvbmVudC4kc2NvcGUuJHBhcmVudC4kcGFyZW50LiRjdHJsKSB7XHJcblx0XHRcdFx0XHRjb21wb25lbnQuaWQgPSBjb21wb25lbnQuJHNjb3BlLiRwYXJlbnQuJHBhcmVudC4kY3RybC5pZDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y29tcG9uZW50LmlkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDcpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IGlkID0gY29tcG9uZW50LmlkO1xyXG5cdFx0XHRsZXQgaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1tpZF07XHJcblxyXG5cdFx0XHQvLyBuZXcgaW5zdGFuY2UgYW5kIHNldCBvcHRpb25zIGFuZCBpdGVtc1xyXG5cdFx0XHRpZiAoaW5zdGFuY2UgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0aW5zdGFuY2UgPSBuZXcgU2VydmljZUNvbnRyb2xsZXIodGhpcy50aW1lb3V0LCB0aGlzLmludGVydmFsLCB0aGlzLmxvY2F0aW9uLCB0aGlzLiRyb290U2NvcGUpO1xyXG5cdFx0XHRcdGluc3RhbmNlLmlkID0gaWQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGluc3RhbmNlLnNldE9wdGlvbnMoY29tcG9uZW50Lm9wdGlvbnMpO1xyXG5cdFx0XHRpbnN0YW5jZS5zZXRJdGVtcyhjb21wb25lbnQuaXRlbXMpO1xyXG5cdFx0XHRpbnN0YW5jZS5zZWxlY3RlZCA9IGNvbXBvbmVudC5zZWxlY3RlZCA/IGNvbXBvbmVudC5zZWxlY3RlZCA6IDA7XHJcblx0XHRcdGluc3RhbmNlLnBhcnNlSGFzaCgpO1xyXG5cclxuXHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMpIHtcclxuXHJcblx0XHRcdFx0aW5zdGFuY2UubG9hZEltYWdlcyhpbnN0YW5jZS5vcHRpb25zLnByZWxvYWQpO1xyXG5cclxuXHRcdFx0XHRpZiAoaW5zdGFuY2Uub3B0aW9ucy5hdXRvcGxheSAmJiBpbnN0YW5jZS5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgJiYgIWluc3RhbmNlLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0XHRpbnN0YW5jZS5hdXRvUGxheVN0YXJ0KCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5pbnN0YW5jZXNbaWRdID0gaW5zdGFuY2U7XHJcblx0XHRcdHJldHVybiBpbnN0YW5jZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gcHJlcGFyZSBpbWFnZXMgYXJyYXlcclxuXHRcdHB1YmxpYyBzZXRJdGVtcyhpdGVtcyA6IEFycmF5PElGaWxlPikge1xyXG5cclxuXHRcdFx0aWYgKCFpdGVtcykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYgYWxyZWFkeVxyXG5cdFx0XHRpZiAodGhpcy5pdGVtcykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gcGFyc2UgYXJyYXkgc3RyaW5nIGVsZW1lbnRzXHJcblx0XHRcdGlmIChhbmd1bGFyLmlzU3RyaW5nKGl0ZW1zWzBdKSA9PT0gdHJ1ZSkge1xyXG5cclxuXHRcdFx0XHR0aGlzLml0ZW1zID0gW107XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0dGhpcy5pdGVtcy5wdXNoKHtzb3VyY2U6IHttb2RhbDogaXRlbXNbaV19fSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0dGhpcy5pdGVtcyA9IGl0ZW1zO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5wcmVwYXJlSXRlbXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3B0aW9ucyBzZXR1cFxyXG5cdFx0cHVibGljIHNldE9wdGlvbnMob3B0aW9ucyA6IElPcHRpb25zKSB7XHJcblxyXG5cdFx0XHQvLyBpZiBvcHRpb25zIGFscmVhZHkgc2V0dXBcclxuXHRcdFx0aWYgKHRoaXMub3B0aW9uc0xvYWRlZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKG9wdGlvbnMpIHtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMgPSBhbmd1bGFyLm1lcmdlKHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cdFx0XHRcdHRoaXMub3B0aW9uc0xvYWRlZCA9IHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25zID0gdGhpcy5kZWZhdWx0cztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaW1wb3J0YW50IVxyXG5cdFx0XHRvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuXHRcdFx0dGhpcy5sb2coJ2NvbmZpZycsIHRoaXMub3B0aW9ucyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBzZXQgc2VsZWN0ZWQodiA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dGhpcy5fc2VsZWN0ZWQgPSB2O1xyXG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIHNldFNlbGVjdGVkKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9IGluZGV4ID4gdGhpcy5zZWxlY3RlZCA/ICdmb3J3YXJkJyA6ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLm5vcm1hbGl6ZShpbmRleCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnbyB0byBiYWNrd2FyZFxyXG5cdFx0cHVibGljIHRvQmFja3dhcmQoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKCRldmVudCkge1xyXG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3RvcCAmJiB0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLm5vcm1hbGl6ZSgtLXRoaXMuc2VsZWN0ZWQpO1xyXG5cdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkIC0gMSk7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cdFx0XHR0aGlzLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGZvcndhcmRcclxuXHRcdHB1YmxpYyB0b0ZvcndhcmQoc3RvcD8gOiBib29sZWFuLCAkZXZlbnQ/IDogVUlFdmVudCkge1xyXG5cclxuXHRcdFx0aWYgKCRldmVudCkge1xyXG5cdFx0XHRcdCRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3RvcCAmJiB0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdmb3J3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IHRoaXMubm9ybWFsaXplKCsrdGhpcy5zZWxlY3RlZCk7XHJcblx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQgKyAxKTtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblx0XHRcdHRoaXMuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gZmlyc3RcclxuXHRcdHB1YmxpYyB0b0ZpcnN0KHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0c3RvcCAmJiB0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSAwO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gbGFzdFxyXG5cdFx0cHVibGljIHRvTGFzdChzdG9wPyA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdHN0b3AgJiYgdGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLml0ZW1zLmxlbmd0aCAtIDE7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc2V0SGFzaCgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm1vZGFsVmlzaWJsZSkge1xyXG5cdFx0XHRcdHRoaXMubG9jYXRpb24uaGFzaChbdGhpcy5zbHVnLCB0aGlzLmlkLCB0aGlzLnNlbGVjdGVkICsgMV0uam9pbignLScpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlUb2dnbGUoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQpIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdGFydCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlTdG9wKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuYXV0b3BsYXkpIHtcclxuXHRcdFx0XHR0aGlzLmludGVydmFsLmNhbmNlbCh0aGlzLmF1dG9wbGF5KTtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBhdXRvUGxheVN0YXJ0KCkge1xyXG5cclxuXHRcdFx0dGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgPSB0cnVlO1xyXG5cclxuXHRcdFx0dGhpcy5hdXRvcGxheSA9IHRoaXMuaW50ZXJ2YWwoKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMudG9Gb3J3YXJkKCk7XHJcblx0XHRcdFx0dGhpcy5sb2coJ2F1dG9wbGF5Jywge2luZGV4OiB0aGlzLnNlbGVjdGVkLCBmaWxlOiB0aGlzLmZpbGV9KTtcclxuXHRcdFx0fSwgdGhpcy5vcHRpb25zLmF1dG9wbGF5LmRlbGF5KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgcHJlcGFyZUl0ZW1zKCkge1xyXG5cclxuXHRcdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHR2YXIgZ2V0QXZhaWxhYmxlU291cmNlID0gZnVuY3Rpb24gKHR5cGUgOiBzdHJpbmcsIHNvdXJjZSA6IElTb3VyY2UpIHtcclxuXHJcblx0XHRcdFx0aWYgKHNvdXJjZVt0eXBlXSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHNvdXJjZVt0eXBlXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlID09ICdwYW5lbCcpIHtcclxuXHRcdFx0XHRcdHJldHVybiBnZXRBdmFpbGFibGVTb3VyY2UoJ2ltYWdlJywgc291cmNlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlID09ICdpbWFnZScpIHtcclxuXHRcdFx0XHRcdHJldHVybiBnZXRBdmFpbGFibGVTb3VyY2UoJ21vZGFsJywgc291cmNlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlID09ICdtb2RhbCcpIHtcclxuXHRcdFx0XHRcdHJldHVybiBnZXRBdmFpbGFibGVTb3VyY2UoJ2ltYWdlJywgc291cmNlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHJcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh0aGlzLml0ZW1zLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG5cclxuXHRcdFx0XHRpZiAoIXZhbHVlLnNvdXJjZSkge1xyXG5cclxuXHRcdFx0XHRcdHZhbHVlLnNvdXJjZSA9IHtcclxuXHRcdFx0XHRcdFx0bW9kYWw6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLm1vZGFsXSxcclxuXHRcdFx0XHRcdFx0cGFuZWw6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLnBhbmVsXSxcclxuXHRcdFx0XHRcdFx0aW1hZ2U6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuc291cmNlLmltYWdlXSxcclxuXHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IHNvdXJjZSA9IHtcclxuXHRcdFx0XHRcdG1vZGFsOiBzZWxmLm9wdGlvbnMuYmFzZVVybCArIGdldEF2YWlsYWJsZVNvdXJjZSgnbW9kYWwnLCB2YWx1ZS5zb3VyY2UpLFxyXG5cdFx0XHRcdFx0cGFuZWw6IHNlbGYub3B0aW9ucy5iYXNlVXJsICsgZ2V0QXZhaWxhYmxlU291cmNlKCdwYW5lbCcsIHZhbHVlLnNvdXJjZSksXHJcblx0XHRcdFx0XHRpbWFnZTogc2VsZi5vcHRpb25zLmJhc2VVcmwgKyBnZXRBdmFpbGFibGVTb3VyY2UoJ2ltYWdlJywgdmFsdWUuc291cmNlKSxcclxuXHRcdFx0XHR9O1xyXG5cclxuXHJcblx0XHRcdFx0bGV0IHBhcnRzID0gc291cmNlLm1vZGFsLnNwbGl0KCcvJyk7XHJcblx0XHRcdFx0bGV0IGZpbGVuYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XHJcblxyXG5cdFx0XHRcdGxldCB0aXRsZSwgZGVzY3JpcHRpb247XHJcblxyXG5cdFx0XHRcdGlmIChzZWxmLm9wdGlvbnMuZmllbGRzICE9IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0dGl0bGUgPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRpdGxlXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdIDogZmlsZW5hbWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRpdGxlID0gZmlsZW5hbWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoc2VsZi5vcHRpb25zLmZpZWxkcyAhPSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uID0gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5kZXNjcmlwdGlvbl0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA6IG51bGw7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uID0gbnVsbDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBmaWxlID0ge1xyXG5cdFx0XHRcdFx0c291cmNlOiBzb3VyY2UsXHJcblx0XHRcdFx0XHR0aXRsZTogdGl0bGUsXHJcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRsb2FkZWQ6IHtcclxuXHRcdFx0XHRcdFx0bW9kYWw6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHRwYW5lbDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdGltYWdlOiBmYWxzZVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdHNlbGYuZmlsZXMucHVzaChmaWxlKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5sb2coJ2ltYWdlcycsIHRoaXMuZmlsZXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGhvdmVyUHJlbG9hZChpbmRleCA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoaW5kZXgpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gaW1hZ2UgcHJlbG9hZFxyXG5cdFx0cHJpdmF0ZSBwcmVsb2FkKHdhaXQ/IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkKTtcclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCArIDEpO1xyXG5cdFx0XHR9LCAod2FpdCAhPSB1bmRlZmluZWQpID8gd2FpdCA6IHRoaXMub3B0aW9ucy5wcmVsb2FkRGVsYXkpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgbm9ybWFsaXplKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR2YXIgbGFzdCA9IHRoaXMuZmlsZXMubGVuZ3RoIC0gMTtcclxuXHJcblx0XHRcdGlmIChpbmRleCA+IGxhc3QpIHtcclxuXHRcdFx0XHRyZXR1cm4gKGluZGV4IC0gbGFzdCkgLSAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoaW5kZXggPCAwKSB7XHJcblx0XHRcdFx0cmV0dXJuIGxhc3QgLSBNYXRoLmFicyhpbmRleCkgKyAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gaW5kZXg7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbG9hZEltYWdlcyhpbmRleGVzIDogQXJyYXk8bnVtYmVyPiwgdHlwZSA6IHN0cmluZykge1xyXG5cclxuXHRcdFx0aWYgKCFpbmRleGVzKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdGluZGV4ZXMuZm9yRWFjaCgoaW5kZXggOiBudW1iZXIpID0+IHtcclxuXHRcdFx0XHRzZWxmLmxvYWRJbWFnZShpbmRleCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGxvYWRJbWFnZShpbmRleD8gOiBudW1iZXIsIGNhbGxiYWNrPyA6IHt9KSB7XHJcblxyXG5cdFx0XHRpbmRleCA9IGluZGV4ID8gaW5kZXggOiB0aGlzLnNlbGVjdGVkO1xyXG5cdFx0XHRpbmRleCA9IHRoaXMubm9ybWFsaXplKGluZGV4KTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5maWxlc1tpbmRleF0pIHtcclxuXHRcdFx0XHR0aGlzLmxvZygnaW52YWxpZCBmaWxlIGluZGV4Jywge2luZGV4OiBpbmRleH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZFsnbW9kYWwnXSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGltYWdlID0gbmV3IEltYWdlKCk7XHJcblx0XHRcdGltYWdlLnNyYyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZVsnaW1hZ2UnXTtcclxuXHRcdFx0aW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFmdGVyTG9hZChpbmRleCwgJ2ltYWdlJywgaW1hZ2UpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHZhciBtb2RhbCA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0XHRtb2RhbC5zcmMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2VbJ21vZGFsJ107XHJcblx0XHRcdG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcclxuXHRcdFx0XHR0aGlzLmFmdGVyTG9hZChpbmRleCwgJ21vZGFsJywgbW9kYWwpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGZpbGUgbmFtZVxyXG5cdFx0cHJpdmF0ZSBnZXRGaWxlbmFtZShpbmRleCA6IG51bWJlciwgdHlwZT8gOiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdHR5cGUgPSB0eXBlID8gdHlwZSA6ICdtb2RhbCc7XHJcblx0XHRcdHZhciBmaWxlcGFydHMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2VbdHlwZV0uc3BsaXQoJy8nKTtcclxuXHRcdFx0dmFyIGZpbGVuYW1lID0gZmlsZXBhcnRzW2ZpbGVwYXJ0cy5sZW5ndGggLSAxXTtcclxuXHRcdFx0cmV0dXJuIGZpbGVuYW1lO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgZmlsZSBleHRlbnNpb25cclxuXHRcdHByaXZhdGUgZ2V0RXh0ZW5zaW9uKGluZGV4IDogbnVtYmVyLCB0eXBlPyA6IHN0cmluZykge1xyXG5cclxuXHRcdFx0dHlwZSA9IHR5cGUgPyB0eXBlIDogJ21vZGFsJztcclxuXHRcdFx0dmFyIGZpbGVwYXJ0cyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZVt0eXBlXS5zcGxpdCgnLicpO1xyXG5cdFx0XHR2YXIgZXh0ZW5zaW9uID0gZmlsZXBhcnRzW2ZpbGVwYXJ0cy5sZW5ndGggLSAxXTtcclxuXHRcdFx0cmV0dXJuIGV4dGVuc2lvbjtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gYWZ0ZXIgbG9hZCBpbWFnZVxyXG5cdFx0cHJpdmF0ZSBhZnRlckxvYWQoaW5kZXgsIHR5cGUsIGltYWdlKSB7XHJcblxyXG5cdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWRbdHlwZV0gPSB0cnVlO1xyXG5cclxuXHRcdFx0aWYgKHR5cGUgPT0gJ21vZGFsJykge1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLndpZHRoID0gaW1hZ2Uud2lkdGg7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0uaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xyXG5cdFx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLm5hbWUgPSB0aGlzLmdldEZpbGVuYW1lKGluZGV4LCB0eXBlKTtcclxuXHRcdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5leHRlbnNpb24gPSB0aGlzLmdldEV4dGVuc2lvbihpbmRleCwgdHlwZSk7XHJcblx0XHRcdFx0dGhpcy5maWxlc1tpbmRleF0uZG93bmxvYWQgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2UubW9kYWw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBkYXRhID0ge2luZGV4OiBpbmRleCwgZmlsZTogdGhpcy5maWxlLCBpbWc6IGltYWdlfTtcclxuXHRcdFx0dmFyIGV2ZW50TmFtZSA9IFsnYXNnLWxvYWQnLCB0eXBlLCB0aGlzLmlkXS5qb2luKCctJyk7XHJcblx0XHRcdHRoaXMuJHJvb3RTY29wZS4kZW1pdChldmVudE5hbWUsIGRhdGEpO1xyXG5cdFx0XHR0aGlzLmxvZygnbG9hZCBzb3VyY2U6ICcgKyB0eXBlLCBkYXRhKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGlzIHNpbmdsZT9cclxuXHRcdHB1YmxpYyBnZXQgaXNTaW5nbGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlcy5sZW5ndGggPiAxID8gZmFsc2UgOiB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZSBkb3dubG9hZCBsaW5rXHJcblx0XHRwdWJsaWMgZG93bmxvYWRMaW5rKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuc2VsZWN0ZWQgIT0gdW5kZWZpbmVkICYmIHRoaXMuZmlsZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdLnNvdXJjZS5tb2RhbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZSBmaWxlXHJcblx0XHRwdWJsaWMgZ2V0IGZpbGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlc1t0aGlzLnNlbGVjdGVkXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGVsZW1lbnQgdmlzaWJsZVxyXG5cdFx0cHVibGljIHRvZ2dsZShlbGVtZW50IDogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnNbZWxlbWVudF0udmlzaWJsZSA9ICF0aGlzLm9wdGlvbnNbZWxlbWVudF0udmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgZ2V0IG1vZGFsVmlzaWJsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLl92aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZW1lXHJcblx0XHRwdWJsaWMgZ2V0IHRoZW1lKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucy50aGVtZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHNldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgc2V0IG1vZGFsVmlzaWJsZSh2YWx1ZSA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcclxuXHJcblx0XHRcdGlmICh2YWx1ZSkge1xyXG5cclxuXHRcdFx0XHR0aGlzLnByZWxvYWQoMSk7XHJcblx0XHRcdFx0dGhpcy5tb2RhbEluaXQoKTtcclxuXHRcdFx0XHR0aGlzLmVsKCdib2R5JykuYWRkQ2xhc3MoJ3loaWRkZW4nKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdHRoaXMuZWwoJ2JvZHknKS5yZW1vdmVDbGFzcygneWhpZGRlbicpO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdGhlIGZvY3VzXHJcblx0XHRwdWJsaWMgc2V0Rm9jdXMoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmVsKCcuYXNnLW1vZGFsLicgKyB0aGlzLmlkICsgJyAua2V5SW5wdXQnKS50cmlnZ2VyKCdmb2N1cycpLmZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBpbml0aWFsaXplIHRoZSBnYWxsZXJ5XHJcblx0XHRwcml2YXRlIG1vZGFsSW5pdCgpIHtcclxuXHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblxyXG5cdFx0XHRcdC8vIHN1Ym1lbnUgY2xpY2sgZXZlbnRzXHJcblx0XHRcdFx0dmFyIGVsZW1lbnQgPSAnLmdhbGxlcnktbW9kYWwuJyArIHNlbGYuaWQgKyAnIGxpLmRyb3Bkb3duLXN1Ym1lbnUnO1xyXG5cdFx0XHRcdHRoaXMuZWwoZWxlbWVudCkub2ZmKCkub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmVsKHRoaXMpLmhhc0NsYXNzKCdvcGVuJykpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lbCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lbChlbGVtZW50KS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVsKHRoaXMpLmFkZENsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdHNlbGYuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHRcdH0sIDEwMCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbW9kYWxPcGVuKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMubW9kYWxBdmFpbGFibGUpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleCA/IGluZGV4IDogdGhpcy5zZWxlY3RlZDtcclxuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG1vZGFsQ2xvc2UoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmxvY2F0aW9uLmhhc2goJycpO1xyXG5cdFx0XHR0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGxvZyhldmVudCA6IHN0cmluZywgZGF0YT8gOiBhbnkpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZGVidWcpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnQVNHIHwgJyArIHRoaXMuaWQgKyAnIDogJyArIGV2ZW50LCBkYXRhID8gZGF0YSA6IG51bGwpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBlbChzZWxlY3RvcikgOiBhbnkge1xyXG5cclxuXHRcdFx0cmV0dXJuIGFuZ3VsYXIuZWxlbWVudChzZWxlY3Rvcik7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0fVxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5zZXJ2aWNlKCdhc2dTZXJ2aWNlJywgW1wiJHRpbWVvdXRcIiwgXCIkaW50ZXJ2YWxcIiwgXCIkbG9jYXRpb25cIiwgXCIkcm9vdFNjb3BlXCIsIFNlcnZpY2VDb250cm9sbGVyXSk7XHJcblxyXG59XHJcblxyXG4iXX0=

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/asg-control.html','<button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.autoPlayToggle()">\r\n\t<span data-ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t<span data-ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n</button>\r\n\r\n<button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toFirst(true)">\r\n\t{{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n</button>\r\n\r\n<button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toBackward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n</button>\r\n\r\n<button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toForward(true)">\r\n\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n</button>\r\n\r\n');
$templateCache.put('views/asg-image.html','<div class="asg-image {{ $ctrl.asg.theme }}" data-ng-class="{\'nomodal\' : !$ctrl.asg.modalAvailable}" data-ng-style="{\'min-height\' : $ctrl.config.heightMin, \'height\' : $ctrl.height}">\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" data-ng-swipe-left="$ctrl.asg.toForward(true)" data-ng-swipe-right="$ctrl.asg.toBackward(true)">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.asg.files" data-ng-show="$ctrl.asg.selected == key" data-ng-class="{\'loading\' : !file.loaded.image}">\r\n\r\n\t\t\t<div class="source {{ $ctrl.config.size }}" data-ng-style="{\'background-image\': \'url(\' + file.source.image + \')\'}" data-ng-if="file.loaded.image" data-ng-mouseover="$ctrl.asg.hoverPreload(key)" data-ng-click="$ctrl.asg.modalOpen()"></div>\r\n\r\n\t\t</div>\r\n\t</div>\r\n\t<ng-transclude></ng-transclude>\r\n</div>\r\n\r\n\r\n\r\n');
$templateCache.put('views/asg-info.html','<div class="row">\r\n\r\n\t<div class="col-md-12">\r\n\t\t<h3>{{ $ctrl.file.title }}</h3>\r\n\t</div>\r\n\r\n\t<div class="col-md-12">\r\n\t\t{{ $ctrl.file.description }}\r\n\t\t<a target="_blank" href="{{ $ctrl.download }}"><span class="glyphicon glyphicon-download"></span></a>\r\n\t</div>\r\n\r\n</div>\r\n\r\n\r\n');
$templateCache.put('views/asg-modal.html','<script type="text/ng-template" id="help.html">\r\n\t<ul>\r\n\t\t<li>SPACE : forward</li>\r\n\t\t<li>RIGHT : forward</li>\r\n\t\t<li>LEFT : backward</li>\r\n\t\t<li>UP / HOME : first</li>\r\n\t\t<li>DOWN / END : last</li>\r\n\t\t<li>ENTER : toggle fullscreen</li>\r\n\t\t<li>ESC : exit</li>\r\n\t\t<li>p : play/pause</li>\r\n\t\t<li>t : change transition effect</li>\r\n\t\t<li>m : toggle menu</li>\r\n\t\t<li>s : toggle image size</li>\r\n\t\t<li>c : toggle caption</li>\r\n\t\t<li>h : toggle help</li>\r\n\t</ul>\r\n</script>\r\n\r\n<div class="asg-modal {{ $ctrl.id }}" data-ng-class="$ctrl.getClass()" data-ng-click="$ctrl.asg.setFocus()" data-ng-show="$ctrl.asg.modalVisible" data-ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" data-ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="header">\r\n\r\n\t\t<span class="buttons visible-xs pull-right">\r\n\t\t\t <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs">\r\n                    {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n\t\t\t </button>\r\n\t\t</span>\r\n\r\n\t\t<span class="buttons hidden-xs pull-right">\r\n\r\n\t\t\t   <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.autoPlayToggle()">\r\n                    <span data-ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t\t\t\t   <span data-ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toFirst(true)">\r\n                    {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toBackward(true)">\r\n                    <span class="glyphicon glyphicon-chevron-left"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toForward(true)">\r\n                    <span class="glyphicon glyphicon-chevron-right"></span>\r\n                </button>\r\n\r\n             <span data-ng-if="!$ctrl.asg.isSingle && false" class="dropdown">\r\n                    <button class="btn btn-default btn-sm dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                        <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu pull-right">\r\n                        <li class="dropdown-submenu">\r\n                            <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.asg.transitions">\r\n                                    <span data-ng-class="{\'highlight\' : transition == $ctrl.config.transition}">\r\n                                        {{ transition }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTheme(theme)" data-ng-repeat="theme in $ctrl.themes">\r\n                                    <span data-ng-class="{\'highlight\' : theme == $ctrl.asg.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                        <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                    </ul>\r\n                </span>\r\n\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleMenu()">\r\n                    <span data-ng-if="$ctrl.config.menu" class="glyphicon glyphicon-chevron-up"></span>\r\n                    <span data-ng-if="!$ctrl.config.menu" class="glyphicon glyphicon-chevron-down"></span>\r\n                </button>\r\n\r\n\t\t\t \t<button class="btn btn-default btn-sm btn-size" data-ng-click="$ctrl.toggleSize()">\r\n                    {{ $ctrl.config.size }}\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm hidden-xs btn-transitions" data-ng-click="$ctrl.nextTransition()">\r\n                    {{ $ctrl.config.transition }}\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleFullScreen()">\r\n                    <span class="glyphicon glyphicon-fullscreen"></span>\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleHelp()">\r\n                    <span class="glyphicon glyphicon-question-sign"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.close()">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n\r\n            </span>\r\n\r\n\t\t<span data-ng-click="$ctrl.asg.modalClose()" data-ng-if="$ctrl.config.title">\r\n\t\t\t<span class="title">{{ $ctrl.config.title }}</span>\r\n\t\t\t<span class="subtitle hidden-xs" data-ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span>\r\n\t\t</span>\r\n\r\n\t</div>\r\n\r\n\t<div class="help text-right" data-ng-click="$ctrl.toggleHelp()" data-ng-show="$ctrl.config.help" data-ng-include src="\'help.html\'"></div>\r\n\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.asg.files" data-ng-show="$ctrl.asg.selected == key" data-ng-class="{\'loading\' : !file.loaded.modal}">\r\n\r\n\t\t\t<div class="source {{ $ctrl.config.size }}" data-ng-style="{\'background-image\': \'url(\' + file.source.modal + \')\'}" data-ng-if="file.loaded.modal"></div>\r\n\r\n\t\t</div>\r\n\r\n\t</div>\r\n\r\n\t<div class="arrows" data-ng-mouseover="$ctrl.arrowsShow()" data-ng-mouseleave="$ctrl.arrowsHide()" data-ng-swipe-left="$ctrl.asg.toForward(true)" data-ng-swipe-right="$ctrl.asg.toBackward(true)" data-ng-click="$ctrl.asg.modalClose()">\r\n\r\n\t\t<div data-ng-if="!$ctrl.asg.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toBackward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.asg.toBackward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" data-ng-click="$ctrl.asg.toBackward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.asg.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toForward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.asg.toForward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" data-ng-click="$ctrl.asg.toForward(true, $event)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t</div>\r\n\r\n\t<div class="caption" data-ng-class="{\'visible\' : $ctrl.config.caption}">\r\n\t\t<div class="content">\r\n\t\t\t<span class="title">{{ $ctrl.asg.file.title }}</span>\r\n\t\t\t<span data-ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description"> - </span>\r\n\t\t\t<span class="description">{{ $ctrl.asg.file.description }}</span>\r\n\t\t\t<a href="{{ $ctrl.asg.downloadLink() }}" target="_blank" class="btn btn-default btn-xs">\r\n\t\t\t\t<span class="glyphicon glyphicon-download"></span> Download\r\n\t\t\t</a>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>');
$templateCache.put('views/asg-panel.html','<div class="asg-panel {{ $ctrl.asg.theme }}" data-ng-show="$ctrl.config.visible">\r\n\r\n\t<div data-ng-repeat="(key,file) in $ctrl.asg.files" class="item {{ $ctrl.asg.options.panel.item.class }}" data-ng-class="{\'selected\' : $ctrl.asg.selected == key}" data-ng-mouseover="indexShow = true" data-ng-mouseleave="indexShow = false">\r\n\r\n\t\t<img data-ng-src="{{ file.source.panel }}" data-ng-click="$ctrl.asg.setSelected(key)" data-ng-mouseover="$ctrl.asg.hoverPreload(key)" alt="{{ file.title }}">\r\n\t\t<span class="index" data-ng-if="$ctrl.config.item.index && indexShow">{{ key + 1 }}</span>\r\n\r\n\t\t<div class="caption" data-ng-if="$ctrl.config.item.caption">\r\n\t\t\t<span>{{ file.title }}</span>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>');}]);