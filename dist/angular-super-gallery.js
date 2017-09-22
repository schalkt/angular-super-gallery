/**
 * angular-super-gallery - Super Angular image gallery
 * 
 * @version v0.1.14
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
    var ImageController = (function () {
        function ImageController(service) {
            this.service = service;
            this.type = 'image';
        }
        ImageController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this);
        };
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
        return ImageController;
    }());
    ASG.ImageController = ImageController;
    var app = angular.module('angularSuperGallery');
    app.component("asgImage", {
        controller: ["asgService", ASG.ImageController],
        templateUrl: 'views/asg-image.html',
        bindings: {
            id: "@",
            items: '=?',
            options: '=?',
            selected: '=?'
        }
    });
})(ASG || (ASG = {}));

var ASG;
(function (ASG) {
    var ModalController = (function () {
        function ModalController(service, fullscreen) {
            this.service = service;
            this.fullscreen = fullscreen;
            this.type = 'modal';
            this._fullscreen = false;
            this._visible = false;
            this.arrowsVisible = false;
        }
        ModalController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this);
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
        ModalController.prototype.keyUp = function (e) {
            var action = this.getActionByKeyCode(e.keyCode);
            switch (action) {
                case 'exit':
                    this.asg.modalClose();
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
                case 'wide':
                    this.toggleWide();
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
        ModalController.prototype.toggleWide = function () {
            this.config.wide = !this.config.wide;
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
                this.asg.setHash();
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
        controller: ["asgService", "Fullscreen", ASG.ModalController],
        templateUrl: 'views/asg-modal.html',
        bindings: {
            id: "@",
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
        function PanelController(service) {
            this.service = service;
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
        return PanelController;
    }());
    ASG.PanelController = PanelController;
    var app = angular.module('angularSuperGallery');
    app.component("asgPanel", {
        controller: ["asgService", ASG.PanelController],
        templateUrl: 'views/asg-panel.html',
        bindings: {
            id: "@",
            items: '=?',
            options: '=?',
            selected: '=?'
        }
    });
})(ASG || (ASG = {}));

var ASG;
(function (ASG) {
    var ServiceController = (function () {
        function ServiceController(timeout, interval, location) {
            this.timeout = timeout;
            this.interval = interval;
            this.location = location;
            this.slug = 'asg';
            this.files = [];
            this.instances = {};
            this._visible = false;
            this.options = {};
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
                    wide: false,
                    keycodes: {
                        exit: [27],
                        playpause: [80],
                        forward: [32, 39],
                        backward: [37],
                        first: [38, 36],
                        last: [40, 35],
                        fullscreen: [70, 13],
                        menu: [77],
                        caption: [67],
                        help: [72],
                        wide: [87],
                        transition: [84]
                    }
                },
                panel: {
                    item: {
                        class: 'col-md-3'
                    },
                },
                image: {
                    transition: 'slideLR',
                    wide: false,
                    height: 300,
                }
            };
            this.themes = [
                'default',
                'darkblue',
                'whitegold'
            ];
            this.transitions = [
                'no',
                'fadeInOut',
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
            index--;
            this.selected = index;
            this.modalOpen(index);
        };
        ServiceController.prototype.getInstance = function (component) {
            var id = component.id;
            var instance = this.instances[id];
            if (instance == undefined) {
                instance = new ServiceController(this.timeout, this.interval, this.location);
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
            this.items = items;
            this.prepareItems();
        };
        ServiceController.prototype.setOptions = function (options) {
            if (!options) {
                return;
            }
            this.options = angular.merge(this.defaults, options);
            this.log('config', this.options);
            options = this.options;
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
        ServiceController.prototype.toBackward = function (stop) {
            stop && this.autoPlayStop();
            this.direction = 'backward';
            this.selected = this.normalize(--this.selected);
            this.loadImage(this.selected - 1);
            this.setHash();
        };
        ServiceController.prototype.toForward = function (stop) {
            stop && this.autoPlayStop();
            this.direction = 'forward';
            this.selected = this.normalize(++this.selected);
            this.loadImage(this.selected + 1);
            this.setHash();
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
                    return self.options.baseUrl + source[type];
                }
                if (type == 'panel') {
                    return self.options.baseUrl + getAvailableSource('image', source);
                }
                if (type == 'image') {
                    return self.options.baseUrl + getAvailableSource('modal', source);
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
                    modal: getAvailableSource('modal', value.source),
                    panel: getAvailableSource('panel', value.source),
                    image: getAvailableSource('image', value.source),
                };
                var parts = source.modal.split('/');
                var filename = parts[parts.length - 1];
                var title = value[self.options.fields.title] ? value[self.options.fields.title] : filename;
                var file = {
                    source: source,
                    title: title,
                    description: value[self.options.fields.description] ? value[self.options.fields.description] : null,
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
            index = index ? index : this.selected;
            index = this.normalize(index);
            if (!this.files[index]) {
                this.log('invalid file index', { index: index });
                return;
            }
            if (this.files[index].loaded['modal']) {
                return;
            }
            var img = new Image();
            img.src = this.files[index].source['image'];
            this.files[index].loaded['image'] = true;
            var img = new Image();
            img.src = this.files[index].source['modal'];
            this.files[index].loaded['modal'] = true;
            this.log('load image', { index: index, file: this.file });
        };
        Object.defineProperty(ServiceController.prototype, "isSingle", {
            get: function () {
                return this.files.length > 1 ? false : true;
            },
            enumerable: true,
            configurable: true
        });
        ServiceController.prototype.downloadLink = function () {
            if (this.selected != undefined) {
                return this.options.baseUrl + this.files[this.selected][this.options.fields.source.modal];
            }
        };
        Object.defineProperty(ServiceController.prototype, "file", {
            get: function () {
                return this.files[this.selected];
            },
            enumerable: true,
            configurable: true
        });
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
    app.service('asgService', ["$timeout", "$interval", "$location", ServiceController]);
})(ASG || (ASG = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzZy50cyIsImFzZy1pbWFnZS50cyIsImFzZy1tb2RhbC50cyIsImFzZy1wYW5lbC50cyIsImFzZy1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLElBQU8sR0FBRyxDQW1CVDtBQW5CRCxXQUFPLEdBQUc7SUFFVCxJQUFJLEdBQUcsR0FBZ0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUVwRyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtRQUN0QixNQUFNLENBQUMsVUFBVSxLQUFXLEVBQUUsU0FBa0I7WUFFL0MsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUE7WUFDM0QsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsQ0FBQztnQkFBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBRXBELElBQUksS0FBSyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFDbEQsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFdkQsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFT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R0FBRyxJQUFJLENBQUMsQ0FBQztZQUNyRSxDQUFDO1FBRUYsQ0FBQztRQUVNLDhCQUFFLEdBQVQsVUFBVSxRQUFRO1lBRWpCLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWxDLENBQUM7UUFHRix3QkFBQztJQUFELENBL2pCQSxBQStqQkMsSUFBQTtJQS9qQlkscUJBQWlCLG9CQStqQjdCLENBQUE7SUFFRCxJQUFJLEdBQUcsR0FBZ0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRTdELEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0FBRXRGLENBQUMsRUEzdEJNLEdBQUcsS0FBSCxHQUFHLFFBMnRCVCIsImZpbGUiOiJhbmd1bGFyLXN1cGVyLWdhbGxlcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5tb2R1bGUgQVNHIHtcclxuXHJcblx0dmFyIGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScsIFsnbmdBbmltYXRlJywgJ0ZCQW5ndWxhcicsICduZ1RvdWNoJ10pO1xyXG5cclxuXHRhcHAuZmlsdGVyKCdhc2dCeXRlcycsICgpID0+IHtcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoYnl0ZXMgOiBhbnksIHByZWNpc2lvbiA6IG51bWJlcikgOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0aWYgKGlzTmFOKHBhcnNlRmxvYXQoYnl0ZXMpKSB8fCAhaXNGaW5pdGUoYnl0ZXMpKSByZXR1cm4gJydcclxuXHRcdFx0aWYgKGJ5dGVzID09PSAwKSByZXR1cm4gJzAnO1xyXG5cdFx0XHRpZiAodHlwZW9mIHByZWNpc2lvbiA9PT0gJ3VuZGVmaW5lZCcpIHByZWNpc2lvbiA9IDE7XHJcblxyXG5cdFx0XHR2YXIgdW5pdHMgPSBbJ2J5dGVzJywgJ2tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJ10sXHJcblx0XHRcdFx0bnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZygxMDI0KSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gKGJ5dGVzIC8gTWF0aC5wb3coMTAyNCwgTWF0aC5mbG9vcihudW1iZXIpKSkudG9GaXhlZChwcmVjaXNpb24pICsgJyAnICsgdW5pdHNbbnVtYmVyXTtcclxuXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XHJcblxyXG4iLCJtb2R1bGUgQVNHIHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIEltYWdlQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlIDogc3RyaW5nID0gJ2ltYWdlJztcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIHNlbGVjdGVkIDogbnVtYmVyO1xyXG5cclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcikge1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zSW1hZ2UpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoXCJhc2dJbWFnZVwiLCB7XHJcblx0XHRjb250cm9sbGVyOiBbXCJhc2dTZXJ2aWNlXCIsIEFTRy5JbWFnZUNvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9hc2ctaW1hZ2UuaHRtbCcsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogXCJAXCIsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcbn0iLCJtb2R1bGUgQVNHIHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIE1vZGFsQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlIDogc3RyaW5nID0gJ21vZGFsJztcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIHNlbGVjdGVkIDogbnVtYmVyO1xyXG5cclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdHByaXZhdGUgX2Z1bGxzY3JlZW4gOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHRwcml2YXRlIF92aXNpYmxlIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBhcnJvd3NWaXNpYmxlIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgZnVsbHNjcmVlbikge1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgZ2V0Q2xhc3MoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuY29uZmlnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgbmdDbGFzcyA9IFtdO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmNvbmZpZy5tZW51KSB7XHJcblx0XHRcdFx0bmdDbGFzcy5wdXNoKCdub21lbnUnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bmdDbGFzcy5wdXNoKHRoaXMuYXNnLm9wdGlvbnMudGhlbWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIG5nQ2xhc3Muam9pbignICcpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgYWN0aW9uIGZyb20ga2V5Y29kZXNcclxuXHRcdHByaXZhdGUgZ2V0QWN0aW9uQnlLZXlDb2RlKGtleUNvZGUgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXModGhpcy5jb25maWcua2V5Y29kZXMpO1xyXG5cdFx0XHR2YXIgYWN0aW9uO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIga2V5IGluIGtleXMpIHtcclxuXHJcblx0XHRcdFx0dmFyIGNvZGVzID0gdGhpcy5jb25maWcua2V5Y29kZXNba2V5c1trZXldXTtcclxuXHJcblx0XHRcdFx0aWYgKCFjb2Rlcykge1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgaW5kZXggPSBjb2Rlcy5pbmRleE9mKGtleUNvZGUpO1xyXG5cclxuXHRcdFx0XHRpZiAoaW5kZXggPiAtMSkge1xyXG5cdFx0XHRcdFx0YWN0aW9uID0ga2V5c1trZXldO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGFjdGlvbjtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGRvIGtleWJvYXJkIGFjdGlvblxyXG5cdFx0cHVibGljIGtleVVwKGUgOiBLZXlib2FyZEV2ZW50KSB7XHJcblxyXG5cdFx0XHR2YXIgYWN0aW9uIDogc3RyaW5nID0gdGhpcy5nZXRBY3Rpb25CeUtleUNvZGUoZS5rZXlDb2RlKTtcclxuXHJcblx0XHRcdHN3aXRjaCAoYWN0aW9uKSB7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2V4aXQnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cubW9kYWxDbG9zZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3BsYXlwYXVzZSc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy5hdXRvUGxheVRvZ2dsZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2ZvcndhcmQnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2JhY2t3YXJkJzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvQmFja3dhcmQodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnZmlyc3QnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cudG9GaXJzdCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdsYXN0JzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvTGFzdCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdmdWxsc2NyZWVuJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlRnVsbFNjcmVlbigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ21lbnUnOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNZW51KCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnY2FwdGlvbic6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUNhcHRpb24oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdoZWxwJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlSGVscCgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3dpZGUnOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVXaWRlKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAndHJhbnNpdGlvbic6XHJcblx0XHRcdFx0XHR0aGlzLm5leHRUcmFuc2l0aW9uKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHN3aXRjaCB0byBuZXh0IHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRwcml2YXRlIG5leHRUcmFuc2l0aW9uKCkge1xyXG5cclxuXHRcdFx0dmFyIGlkeCA9IHRoaXMuYXNnLnRyYW5zaXRpb25zLmluZGV4T2YodGhpcy5jb25maWcudHJhbnNpdGlvbikgKyAxO1xyXG5cdFx0XHR2YXIgbmV4dCA9IGlkeCA+PSB0aGlzLmFzZy50cmFuc2l0aW9ucy5sZW5ndGggPyAwIDogaWR4O1xyXG5cdFx0XHR0aGlzLmNvbmZpZy50cmFuc2l0aW9uID0gdGhpcy5hc2cudHJhbnNpdGlvbnNbbmV4dF07XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyB0b2dnbGUgZnVsbHNjcmVlblxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVGdWxsU2NyZWVuKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuZnVsbHNjcmVlbi5pc0VuYWJsZWQoKSkge1xyXG5cdFx0XHRcdHRoaXMuZnVsbHNjcmVlbi5jYW5jZWwoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmZ1bGxzY3JlZW4uYWxsKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5hc2cuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRwdWJsaWMgc2V0VHJhbnNpdGlvbih0cmFuc2l0aW9uKSB7XHJcblxyXG5cdFx0XHR0aGlzLmNvbmZpZy50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcclxuXHRcdFx0dGhpcy5hc2cuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRoZW1lXHJcblx0XHRwdWJsaWMgc2V0VGhlbWUodGhlbWUgOiBzdHJpbmcpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnMudGhlbWUgPSB0aGVtZTtcclxuXHRcdFx0dGhpcy5hc2cuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3ZlcmxheSBhcnJvd3MgaGlkZVxyXG5cdFx0cHVibGljIGFycm93c0hpZGUoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFycm93c1Zpc2libGUgPSBmYWxzZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3ZlcmxheSBhcnJvd3Mgc2hvd1xyXG5cdFx0cHVibGljIGFycm93c1Nob3coKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFycm93c1Zpc2libGUgPSB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgaGVscFxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVIZWxwKCkge1xyXG5cclxuXHRcdFx0dGhpcy5jb25maWcuaGVscCA9ICF0aGlzLmNvbmZpZy5oZWxwO1xyXG5cdFx0XHR0aGlzLmFzZy5zZXRGb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gdG9nZ2xlIHdpZGVcclxuXHRcdHByaXZhdGUgdG9nZ2xlV2lkZSgpIHtcclxuXHJcblx0XHRcdHRoaXMuY29uZmlnLndpZGUgPSAhdGhpcy5jb25maWcud2lkZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHRvZ2dsZSBtZW51XHJcblx0XHRwcml2YXRlIHRvZ2dsZU1lbnUoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmNvbmZpZy5tZW51ID0gIXRoaXMuY29uZmlnLm1lbnU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBjYXB0aW9uXHJcblx0XHRwcml2YXRlIHRvZ2dsZUNhcHRpb24oKSB7XHJcblxyXG5cdFx0XHR0aGlzLmNvbmZpZy5jYXB0aW9uID0gIXRoaXMuY29uZmlnLmNhcHRpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBtb2RhbCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgZ2V0IHZpc2libGUoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cubW9kYWxWaXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgbW9kYWwgdmlzaWJsZVxyXG5cdFx0cHVibGljIHNldCB2aXNpYmxlKHZhbHVlIDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5hc2cubW9kYWxWaXNpYmxlID0gdmFsdWU7XHJcblx0XHRcdHRoaXMuYXNnLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IG1vZGFsIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKSA6IElPcHRpb25zTW9kYWwge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IG1vZGFsIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc01vZGFsKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblxyXG5cdHZhciBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudChcImFzZ01vZGFsXCIsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFtcImFzZ1NlcnZpY2VcIiwgXCJGdWxsc2NyZWVuXCIsIEFTRy5Nb2RhbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9hc2ctbW9kYWwuaHRtbCcsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogXCJAXCIsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/JyxcclxuXHRcdFx0dmlzaWJsZTogXCI9P1wiXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59IiwibW9kdWxlIEFTRyB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBQYW5lbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHByaXZhdGUgdHlwZSA6IHN0cmluZyA9ICdwYW5lbCc7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHRcdHB1YmxpYyBzZWxlY3RlZCA6IG51bWJlcjtcclxuXHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHBhbmVsIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKSA6IElPcHRpb25zUGFuZWwge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHBhbmVsIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc1BhbmVsKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0dmFyIGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KFwiYXNnUGFuZWxcIiwge1xyXG5cdFx0Y29udHJvbGxlcjogW1wiYXNnU2VydmljZVwiLCBBU0cuUGFuZWxDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLXBhbmVsLmh0bWwnLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6IFwiQFwiLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5tb2R1bGUgQVNHIHtcclxuXHJcblx0Ly8gbW9kYWwgY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zTW9kYWwge1xyXG5cclxuXHRcdG1lbnU/IDogYm9vbGVhbjtcclxuXHRcdGhlbHA/IDogYm9vbGVhbjtcclxuXHRcdGNhcHRpb24/IDogYm9vbGVhbjtcclxuXHRcdHRyYW5zaXRpb24/IDogc3RyaW5nO1xyXG5cdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0c3VidGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0d2lkZT8gOiBib29sZWFuO1xyXG5cdFx0a2V5Y29kZXM/IDoge1xyXG5cdFx0XHRleGl0PyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdHBsYXlwYXVzZT8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRmb3J3YXJkPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGJhY2t3YXJkPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGZpcnN0PyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGxhc3Q/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0ZnVsbHNjcmVlbj8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRtZW51PyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGNhcHRpb24/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0aGVscD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHR3aWRlPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdHRyYW5zaXRpb24/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIHBhbmVsIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc1BhbmVsIHtcclxuXHJcblx0XHRpdGVtPyA6IHtcclxuXHRcdFx0Y2xhc3M/IDogc3RyaW5nO1xyXG5cdFx0fSxcclxuXHJcblx0fVxyXG5cclxuXHQvLyBpbWFnZSBjb21wb25lbnQgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0dHJhbnNpdGlvbj8gOiBzdHJpbmc7XHJcblx0XHRoZWlnaHQ/IDogbnVtYmVyO1xyXG5cdFx0d2lkZT8gOiBib29sZWFuO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGdhbGxlcnkgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xyXG5cclxuXHRcdGRlYnVnPyA6IGJvb2xlYW4sXHJcblx0XHRiYXNlVXJsPyA6IHN0cmluZztcclxuXHRcdGZpZWxkcz8gOiB7XHJcblx0XHRcdHNvdXJjZT8gOiB7XHJcblx0XHRcdFx0bW9kYWw/IDogc3RyaW5nO1xyXG5cdFx0XHRcdHBhbmVsPyA6IHN0cmluZztcclxuXHRcdFx0XHRpbWFnZT8gOiBzdHJpbmc7XHJcblx0XHRcdH1cclxuXHRcdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0XHRkZXNjcmlwdGlvbj8gOiBzdHJpbmc7XHJcblx0XHRcdHRodW1ibmFpbD8gOiBzdHJpbmc7XHJcblx0XHR9LFxyXG5cdFx0YXV0b3BsYXk/IDoge1xyXG5cdFx0XHRlbmFibGVkPyA6IGJvb2xlYW47XHJcblx0XHRcdGRlbGF5PyA6IG51bWJlcjtcclxuXHRcdH0sXHJcblx0XHR0aGVtZT8gOiBzdHJpbmc7XHJcblx0XHRwcmVsb2FkRGVsYXk/IDogbnVtYmVyO1xyXG5cdFx0cHJlbG9hZD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0bW9kYWw/IDogSU9wdGlvbnNNb2RhbDtcclxuXHRcdHBhbmVsPyA6IElPcHRpb25zUGFuZWw7XHJcblx0XHRpbWFnZT8gOiBJT3B0aW9uc0ltYWdlO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIHNvdXJjZVxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVNvdXJjZSB7XHJcblxyXG5cdFx0bW9kYWwgOiBzdHJpbmc7IC8vIG9yaWdpbmFsLCByZXF1aXJlZFxyXG5cdFx0cGFuZWw/IDogc3RyaW5nO1xyXG5cdFx0aW1hZ2U/IDogc3RyaW5nO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGZpbGVcclxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWxlIHtcclxuXHJcblx0XHRzb3VyY2UgOiBJU291cmNlO1xyXG5cdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0ZGVzY3JpcHRpb24/IDogc3RyaW5nO1xyXG5cdFx0dGh1bWJuYWlsPyA6IHN0cmluZztcclxuXHRcdGxvYWRlZD8gOiB7XHJcblx0XHRcdG1vZGFsPyA6IGJvb2xlYW47XHJcblx0XHRcdHBhbmVsPyA6IGJvb2xlYW47XHJcblx0XHRcdGltYWdlPyA6IGJvb2xlYW47XHJcblx0XHR9O1xyXG5cdFx0c2l6ZT8gOiBudW1iZXI7XHJcblx0XHR3aWR0aD8gOiBudW1iZXI7XHJcblx0XHRoZWlnaHQ/IDogbnVtYmVyO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIHNlcnZpY2UgY29udHJvbGxlciBpbnRlcmZhY2VcclxuXHRleHBvcnQgaW50ZXJmYWNlIElTZXJ2aWNlQ29udHJvbGxlciB7XHJcblxyXG5cdFx0Z2V0SW5zdGFuY2UoY29tcG9uZW50IDogYW55KSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHJcblx0XHRzZXREZWZhdWx0cygpIDogdm9pZDtcclxuXHJcblx0XHRzZXRPcHRpb25zKG9wdGlvbnMgOiBJT3B0aW9ucykgOiBJT3B0aW9ucztcclxuXHJcblx0XHRzZXRJdGVtcyhpdGVtcyA6IEFycmF5PElGaWxlPikgOiB2b2lkO1xyXG5cclxuXHRcdHByZWxvYWQod2FpdD8gOiBudW1iZXIpIDogdm9pZDtcclxuXHJcblx0XHRub3JtYWxpemUoaW5kZXggOiBudW1iZXIpIDogbnVtYmVyO1xyXG5cclxuXHRcdHNldEZvY3VzKCkgOiB2b2lkO1xyXG5cclxuXHRcdG1vZGFsT3BlbihpbmRleCA6IG51bWJlcikgOiB2b2lkO1xyXG5cclxuXHRcdG1vZGFsQ2xvc2UoKSA6IHZvaWQ7XHJcblxyXG5cdFx0dG9CYWNrd2FyZChzdG9wPyA6IGJvb2xlYW4pIDogdm9pZDtcclxuXHJcblx0XHR0b0ZvcndhcmQoc3RvcD8gOiBib29sZWFuKSA6IHZvaWQ7XHJcblxyXG5cdFx0dG9GaXJzdChzdG9wPyA6IGJvb2xlYW4pIDogdm9pZDtcclxuXHJcblx0XHR0b0xhc3Qoc3RvcD8gOiBib29sZWFuKSA6IHZvaWQ7XHJcblxyXG5cdFx0bG9hZEltYWdlKGluZGV4PyA6IG51bWJlcikgOiB2b2lkO1xyXG5cclxuXHRcdGxvYWRJbWFnZXMoaW5kZXhlcyA6IEFycmF5PG51bWJlcj4pIDogdm9pZDtcclxuXHJcblx0XHRhdXRvUGxheVRvZ2dsZSgpIDogdm9pZDtcclxuXHJcblx0XHRlbChzZWxlY3RvcikgOiBhbnk7XHJcblxyXG5cdFx0c2V0SGFzaCgpIDogdm9pZDtcclxuXHJcblx0XHRtb2RhbFZpc2libGUgOiBib29sZWFuO1xyXG5cdFx0dHJhbnNpdGlvbnMgOiBBcnJheTxzdHJpbmc+O1xyXG5cdFx0dGhlbWVzIDogQXJyYXk8c3RyaW5nPjtcclxuXHRcdG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0c2VsZWN0ZWQgOiBudW1iZXI7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gc2VydmljZSBjb250cm9sbGVyXHJcblx0ZXhwb3J0IGNsYXNzIFNlcnZpY2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgc2x1ZyA6IHN0cmluZyA9ICdhc2cnO1xyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogYW55O1xyXG5cdFx0cHVibGljIGZpbGVzIDogQXJyYXk8SUZpbGU+ID0gW107XHJcblx0XHRwdWJsaWMgZGlyZWN0aW9uIDogc3RyaW5nO1xyXG5cclxuXHRcdHByaXZhdGUgaW5zdGFuY2VzIDoge30gPSB7fVxyXG5cdFx0cHJpdmF0ZSBfc2VsZWN0ZWQgOiBudW1iZXI7XHJcblx0XHRwcml2YXRlIF92aXNpYmxlIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBhdXRvcGxheSA6IGFuZ3VsYXIuSVByb21pc2U8YW55PjtcclxuXHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zID0ge307XHJcblx0XHRwdWJsaWMgZGVmYXVsdHMgOiBJT3B0aW9ucyA9IHtcclxuXHRcdFx0ZGVidWc6IGZhbHNlLCAvLyBpbWFnZSBsb2FkIGFuZCBhdXRvcGxheSBpbmZvIGluIGNvbnNvbGUubG9nXHJcblx0XHRcdGJhc2VVcmw6IFwiXCIsIC8vIHVybCBwcmVmaXhcclxuXHRcdFx0ZmllbGRzOiB7XHJcblx0XHRcdFx0c291cmNlOiB7XHJcblx0XHRcdFx0XHRtb2RhbDogXCJ1cmxcIiwgLy8gcmVxdWlyZWQsIGltYWdlIHVybCBmb3IgbW9kYWwgY29tcG9uZW50IChsYXJnZSBzaXplKVxyXG5cdFx0XHRcdFx0cGFuZWw6IFwidXJsXCIsIC8vIGltYWdlIHVybCBmb3IgcGFuZWwgY29tcG9uZW50ICh0aHVtYm5haWwgc2l6ZSlcclxuXHRcdFx0XHRcdGltYWdlOiBcInVybFwiIC8vIGltYWdlIHVybCBmb3IgaW1hZ2UgKG1lZGl1bSBzaXplKVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dGl0bGU6IFwidGl0bGVcIiwgLy8gdGl0bGUgaW5wdXQgZmllbGQgbmFtZVxyXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBcImRlc2NyaXB0aW9uXCIsIC8vIGRlc2NyaXB0aW9uIGlucHV0IGZpZWxkIG5hbWVcclxuXHRcdFx0XHR0aHVtYm5haWw6IFwidGh1bWJuYWlsXCIgLy8gdGh1bWJuYWlsIGlucHV0IGZpZWxkIG5hbWVcclxuXHRcdFx0fSxcclxuXHRcdFx0YXV0b3BsYXk6IHtcclxuXHRcdFx0XHRlbmFibGVkOiBmYWxzZSwgLy8gc2xpZGVzaG93IHBsYXkgZW5hYmxlZC9kaXNhYmxlZFxyXG5cdFx0XHRcdGRlbGF5OiA0MTAwIC8vIGF1dG9wbGF5IGRlbGF5IGluIG1pbGxpc2Vjb25kXHJcblx0XHRcdH0sXHJcblx0XHRcdHRoZW1lOiAnZGVmYXVsdCcsIC8vIGNzcyBzdHlsZSBbZGVmYXVsdCwgZGFya2JsdWUsIHdoaXRlZ29sZF1cclxuXHRcdFx0cHJlbG9hZERlbGF5OiA3NzAsXHJcblx0XHRcdHByZWxvYWQ6IFtdLCAvLyBwcmVsb2FkIGltYWdlcyBieSBpbmRleCBudW1iZXJcclxuXHRcdFx0bW9kYWw6IHtcclxuXHRcdFx0XHR0aXRsZTogXCJcIiwgLy8gbW9kYWwgd2luZG93IHRpdGxlXHJcblx0XHRcdFx0c3VidGl0bGU6IFwiXCIsIC8vIG1vZGFsIHdpbmRvdyBzdWJ0aXRsZVxyXG5cdFx0XHRcdGNhcHRpb246IHRydWUsIC8vIHNob3cvaGlkZSBpbWFnZSBjYXB0aW9uXHJcblx0XHRcdFx0bWVudTogdHJ1ZSwgLy8gc2hvdy9oaWRlIG1vZGFsIG1lbnVcclxuXHRcdFx0XHRoZWxwOiBmYWxzZSwgLy8gc2hvdy9oaWRlIGhlbHBcclxuXHRcdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRcdFx0d2lkZTogZmFsc2UsIC8vIGVuYWJsZS9kaXNhYmxlIHdpZGUgaW1hZ2UgZGlzcGxheSBtb2RlXHJcblx0XHRcdFx0a2V5Y29kZXM6IHtcclxuXHRcdFx0XHRcdGV4aXQ6IFsyN10sIC8vIEVTQ1xyXG5cdFx0XHRcdFx0cGxheXBhdXNlOiBbODBdLCAvLyBwXHJcblx0XHRcdFx0XHRmb3J3YXJkOiBbMzIsIDM5XSwgLy8gU1BBQ0UsIFJJR0hUIEFSUk9XXHJcblx0XHRcdFx0XHRiYWNrd2FyZDogWzM3XSwgLy8gTEVGVCBBUlJPV1xyXG5cdFx0XHRcdFx0Zmlyc3Q6IFszOCwgMzZdLCAvLyBVUCBBUlJPVywgSE9NRVxyXG5cdFx0XHRcdFx0bGFzdDogWzQwLCAzNV0sIC8vIERPV04gQVJST1csIEVORFxyXG5cdFx0XHRcdFx0ZnVsbHNjcmVlbjogWzcwLCAxM10sIC8vIGYsIEVOVEVSXHJcblx0XHRcdFx0XHRtZW51OiBbNzddLCAvLyBtXHJcblx0XHRcdFx0XHRjYXB0aW9uOiBbNjddLCAvLyBjXHJcblx0XHRcdFx0XHRoZWxwOiBbNzJdLCAvLyBoXHJcblx0XHRcdFx0XHR3aWRlOiBbODddLCAvLyB3XHJcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiBbODRdIC8vIHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHBhbmVsOiB7XHJcblx0XHRcdFx0aXRlbToge1xyXG5cdFx0XHRcdFx0Y2xhc3M6ICdjb2wtbWQtMycgLy8gaXRlbSBjbGFzc1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdGltYWdlOiB7XHJcblx0XHRcdFx0dHJhbnNpdGlvbjogJ3NsaWRlTFInLCAvLyB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0XHRcdHdpZGU6IGZhbHNlLCAvLyBlbmFibGUvZGlzYWJsZSB3aWRlIGltYWdlIGRpc3BsYXkgbW9kZVxyXG5cdFx0XHRcdGhlaWdodDogMzAwLCAvLyBoZWlnaHRcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBhdmFpbGFibGUgdGhlbWVzXHJcblx0XHRwdWJsaWMgdGhlbWVzIDogQXJyYXk8c3RyaW5nPiA9IFtcclxuXHRcdFx0J2RlZmF1bHQnLFxyXG5cdFx0XHQnZGFya2JsdWUnLFxyXG5cdFx0XHQnd2hpdGVnb2xkJ1xyXG5cdFx0XTtcclxuXHJcblx0XHQvLyBhdmFpbGFibGUgdHJhbnNpdGlvbnNcclxuXHRcdHB1YmxpYyB0cmFuc2l0aW9ucyA6IEFycmF5PHN0cmluZz4gPSBbXHJcblx0XHRcdCdubycsXHJcblx0XHRcdCdmYWRlSW5PdXQnLFxyXG5cdFx0XHQnem9vbUluT3V0JyxcclxuXHRcdFx0J3JvdGF0ZUxSJyxcclxuXHRcdFx0J3JvdGF0ZVRCJyxcclxuXHRcdFx0J3JvdGF0ZVpZJyxcclxuXHRcdFx0J3NsaWRlTFInLFxyXG5cdFx0XHQnc2xpZGVUQicsXHJcblx0XHRcdCdmbGlwWCcsXHJcblx0XHRcdCdmbGlwWSdcclxuXHRcdF07XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSB0aW1lb3V0IDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSBpbnRlcnZhbCA6IG5nLklJbnRlcnZhbFNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlIGxvY2F0aW9uIDogbmcuSUxvY2F0aW9uU2VydmljZSkge1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwcml2YXRlIHBhcnNlSGFzaCgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5pZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGhhc2ggPSB0aGlzLmxvY2F0aW9uLmhhc2goKTtcclxuXHRcdFx0dmFyIHBhcnRzID0gaGFzaCA/IGhhc2guc3BsaXQoJy0nKSA6IG51bGw7XHJcblxyXG5cdFx0XHRpZiAocGFydHMgPT09IG51bGwpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChwYXJ0c1swXSAhPT0gdGhpcy5zbHVnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocGFydHMubGVuZ3RoICE9PSAzKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocGFydHNbMV0gIT09IHRoaXMuaWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBpbmRleCA9IHBhcnNlSW50KHBhcnRzWzJdLCAxMCk7XHJcblxyXG5cdFx0XHRpZiAoIWFuZ3VsYXIuaXNOdW1iZXIoaW5kZXgpKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpbmRleC0tO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXg7XHJcblx0XHRcdHRoaXMubW9kYWxPcGVuKGluZGV4KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2UgZm9yIGN1cnJlbnQgZ2FsbGVyeSBieSBjb21wb25lbnQgaWRcclxuXHRcdHB1YmxpYyBnZXRJbnN0YW5jZShjb21wb25lbnQgOiBhbnkpIHtcclxuXHJcblx0XHRcdGNvbnN0IGlkID0gY29tcG9uZW50LmlkO1xyXG5cdFx0XHRsZXQgaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1tpZF07XHJcblxyXG5cdFx0XHQvLyBuZXcgaW5zdGFuY2UgYW5kIHNldCBvcHRpb25zIGFuZCBpdGVtc1xyXG5cdFx0XHRpZiAoaW5zdGFuY2UgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0aW5zdGFuY2UgPSBuZXcgU2VydmljZUNvbnRyb2xsZXIodGhpcy50aW1lb3V0LCB0aGlzLmludGVydmFsLCB0aGlzLmxvY2F0aW9uKTtcclxuXHRcdFx0XHRpbnN0YW5jZS5pZCA9IGlkO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpbnN0YW5jZS5zZXRPcHRpb25zKGNvbXBvbmVudC5vcHRpb25zKTtcclxuXHRcdFx0aW5zdGFuY2Uuc2V0SXRlbXMoY29tcG9uZW50Lml0ZW1zKTtcclxuXHRcdFx0aW5zdGFuY2Uuc2VsZWN0ZWQgPSBjb21wb25lbnQuc2VsZWN0ZWQgPyBjb21wb25lbnQuc2VsZWN0ZWQgOiAwO1xyXG5cdFx0XHRpbnN0YW5jZS5wYXJzZUhhc2goKTtcclxuXHJcblx0XHRcdGlmIChpbnN0YW5jZS5vcHRpb25zKSB7XHJcblxyXG5cdFx0XHRcdGluc3RhbmNlLmxvYWRJbWFnZXMoaW5zdGFuY2Uub3B0aW9ucy5wcmVsb2FkKTtcclxuXHJcblx0XHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMuYXV0b3BsYXkgJiYgaW5zdGFuY2Uub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkICYmICFpbnN0YW5jZS5hdXRvcGxheSkge1xyXG5cdFx0XHRcdFx0aW5zdGFuY2UuYXV0b1BsYXlTdGFydCgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuaW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xyXG5cdFx0XHRyZXR1cm4gaW5zdGFuY2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHByZXBhcmUgaW1hZ2VzIGFycmF5XHJcblx0XHRwdWJsaWMgc2V0SXRlbXMoaXRlbXMgOiBBcnJheTxJRmlsZT4pIHtcclxuXHJcblx0XHRcdGlmICghaXRlbXMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGlmIGFscmVhZHlcclxuXHRcdFx0aWYgKHRoaXMuaXRlbXMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuaXRlbXMgPSBpdGVtcztcclxuXHRcdFx0dGhpcy5wcmVwYXJlSXRlbXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3B0aW9ucyBzZXR1cFxyXG5cdFx0cHVibGljIHNldE9wdGlvbnMob3B0aW9ucyA6IElPcHRpb25zKSB7XHJcblxyXG5cdFx0XHRpZiAoIW9wdGlvbnMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMub3B0aW9ucyA9IGFuZ3VsYXIubWVyZ2UodGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XHJcblx0XHRcdHRoaXMubG9nKCdjb25maWcnLCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuXHRcdFx0b3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHNlbGVjdGVkIGltYWdlXHJcblx0XHRwdWJsaWMgc2V0IHNlbGVjdGVkKHYgOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMuX3NlbGVjdGVkID0gdjtcclxuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIGdldCBzZWxlY3RlZCgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLl9zZWxlY3RlZDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBzZXRTZWxlY3RlZChpbmRleCA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSBpbmRleCA+IHRoaXMuc2VsZWN0ZWQgPyAnZm9yd2FyZCcgOiAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5ub3JtYWxpemUoaW5kZXgpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ28gdG8gYmFja3dhcmRcclxuXHRcdHB1YmxpYyB0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0c3RvcCAmJiB0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLm5vcm1hbGl6ZSgtLXRoaXMuc2VsZWN0ZWQpO1xyXG5cdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkIC0gMSk7XHJcblx0XHRcdHRoaXMuc2V0SGFzaCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBmb3J3YXJkXHJcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0c3RvcCAmJiB0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdmb3J3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IHRoaXMubm9ybWFsaXplKCsrdGhpcy5zZWxlY3RlZCk7XHJcblx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQgKyAxKTtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGZpcnN0XHJcblx0XHRwdWJsaWMgdG9GaXJzdChzdG9wPyA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdHN0b3AgJiYgdGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gMDtcclxuXHRcdFx0dGhpcy5zZXRIYXNoKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGxhc3RcclxuXHRcdHB1YmxpYyB0b0xhc3Qoc3RvcD8gOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRzdG9wICYmIHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2ZvcndhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5pdGVtcy5sZW5ndGggLSAxO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHNldEhhc2goKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5tb2RhbFZpc2libGUpIHtcclxuXHRcdFx0XHR0aGlzLmxvY2F0aW9uLmhhc2goW3RoaXMuc2x1ZywgdGhpcy5pZCwgdGhpcy5zZWxlY3RlZCArIDFdLmpvaW4oJy0nKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5VG9nZ2xlKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkKSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RhcnQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5U3RvcCgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0dGhpcy5pbnRlcnZhbC5jYW5jZWwodGhpcy5hdXRvcGxheSk7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlTdGFydCgpIHtcclxuXHJcblx0XHRcdHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkID0gdHJ1ZTtcclxuXHJcblx0XHRcdHRoaXMuYXV0b3BsYXkgPSB0aGlzLmludGVydmFsKCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnRvRm9yd2FyZCgpO1xyXG5cdFx0XHRcdHRoaXMubG9nKCdhdXRvcGxheScsIHtpbmRleDogdGhpcy5zZWxlY3RlZCwgZmlsZTogdGhpcy5maWxlfSk7XHJcblx0XHRcdH0sIHRoaXMub3B0aW9ucy5hdXRvcGxheS5kZWxheSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwcml2YXRlIHByZXBhcmVJdGVtcygpIHtcclxuXHJcblx0XHRcdGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0dmFyIGdldEF2YWlsYWJsZVNvdXJjZSA9IGZ1bmN0aW9uICh0eXBlIDogc3RyaW5nLCBzb3VyY2UgOiBJU291cmNlKSB7XHJcblxyXG5cdFx0XHRcdGlmIChzb3VyY2VbdHlwZV0pIHtcclxuXHRcdFx0XHRcdHJldHVybiBzZWxmLm9wdGlvbnMuYmFzZVVybCArIHNvdXJjZVt0eXBlXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlID09ICdwYW5lbCcpIHtcclxuXHRcdFx0XHRcdHJldHVybiBzZWxmLm9wdGlvbnMuYmFzZVVybCArIGdldEF2YWlsYWJsZVNvdXJjZSgnaW1hZ2UnLCBzb3VyY2UpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHR5cGUgPT0gJ2ltYWdlJykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHNlbGYub3B0aW9ucy5iYXNlVXJsICsgZ2V0QXZhaWxhYmxlU291cmNlKCdtb2RhbCcsIHNvdXJjZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fTtcclxuXHJcblxyXG5cdFx0XHRhbmd1bGFyLmZvckVhY2godGhpcy5pdGVtcywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcclxuXHJcblx0XHRcdFx0aWYgKCF2YWx1ZS5zb3VyY2UpIHtcclxuXHJcblx0XHRcdFx0XHR2YWx1ZS5zb3VyY2UgPSB7XHJcblx0XHRcdFx0XHRcdG1vZGFsOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5tb2RhbF0sXHJcblx0XHRcdFx0XHRcdHBhbmVsOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5wYW5lbF0sXHJcblx0XHRcdFx0XHRcdGltYWdlOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5pbWFnZV0sXHJcblx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBzb3VyY2UgPSB7XHJcblx0XHRcdFx0XHRtb2RhbDogZ2V0QXZhaWxhYmxlU291cmNlKCdtb2RhbCcsIHZhbHVlLnNvdXJjZSksXHJcblx0XHRcdFx0XHRwYW5lbDogZ2V0QXZhaWxhYmxlU291cmNlKCdwYW5lbCcsIHZhbHVlLnNvdXJjZSksXHJcblx0XHRcdFx0XHRpbWFnZTogZ2V0QXZhaWxhYmxlU291cmNlKCdpbWFnZScsIHZhbHVlLnNvdXJjZSksXHJcblx0XHRcdFx0fTtcclxuXHJcblxyXG5cdFx0XHRcdGxldCBwYXJ0cyA9IHNvdXJjZS5tb2RhbC5zcGxpdCgnLycpO1xyXG5cdFx0XHRcdGxldCBmaWxlbmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdGxldCB0aXRsZSA9IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aXRsZV0gOiBmaWxlbmFtZTtcclxuXHJcblx0XHRcdFx0bGV0IGZpbGUgPSB7XHJcblx0XHRcdFx0XHRzb3VyY2U6IHNvdXJjZSxcclxuXHRcdFx0XHRcdHRpdGxlOiB0aXRsZSxcclxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuZGVzY3JpcHRpb25dIDogbnVsbCxcclxuXHRcdFx0XHRcdGxvYWRlZDoge1xyXG5cdFx0XHRcdFx0XHRtb2RhbDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdHBhbmVsOiBmYWxzZSxcclxuXHRcdFx0XHRcdFx0aW1hZ2U6IGZhbHNlXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0c2VsZi5maWxlcy5wdXNoKGZpbGUpO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmxvZygnaW1hZ2VzJywgdGhpcy5maWxlcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgaG92ZXJQcmVsb2FkKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLmxvYWRJbWFnZShpbmRleCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBpbWFnZSBwcmVsb2FkXHJcblx0XHRwcml2YXRlIHByZWxvYWQod2FpdD8gOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQpO1xyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkICsgMSk7XHJcblx0XHRcdH0sICh3YWl0ICE9IHVuZGVmaW5lZCkgPyB3YWl0IDogdGhpcy5vcHRpb25zLnByZWxvYWREZWxheSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBub3JtYWxpemUoaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHZhciBsYXN0ID0gdGhpcy5maWxlcy5sZW5ndGggLSAxO1xyXG5cclxuXHRcdFx0aWYgKGluZGV4ID4gbGFzdCkge1xyXG5cdFx0XHRcdHJldHVybiAoaW5kZXggLSBsYXN0KSAtIDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChpbmRleCA8IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gbGFzdCAtIE1hdGguYWJzKGluZGV4KSArIDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBpbmRleDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBsb2FkSW1hZ2VzKGluZGV4ZXMgOiBBcnJheTxudW1iZXI+LCB0eXBlIDogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHRpZiAoIWluZGV4ZXMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0aW5kZXhlcy5mb3JFYWNoKChpbmRleCA6IG51bWJlcikgPT4ge1xyXG5cdFx0XHRcdHNlbGYubG9hZEltYWdlKGluZGV4KTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbG9hZEltYWdlKGluZGV4PyA6IG51bWJlciwgY2FsbGJhY2s/IDoge30pIHtcclxuXHJcblx0XHRcdGluZGV4ID0gaW5kZXggPyBpbmRleCA6IHRoaXMuc2VsZWN0ZWQ7XHJcblx0XHRcdGluZGV4ID0gdGhpcy5ub3JtYWxpemUoaW5kZXgpO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmZpbGVzW2luZGV4XSkge1xyXG5cdFx0XHRcdHRoaXMubG9nKCdpbnZhbGlkIGZpbGUgaW5kZXgnLCB7aW5kZXg6IGluZGV4fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5maWxlc1tpbmRleF0ubG9hZGVkWydtb2RhbCddKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcblx0XHRcdGltZy5zcmMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2VbJ2ltYWdlJ107XHJcblx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZFsnaW1hZ2UnXSA9IHRydWU7XHJcblxyXG5cdFx0XHR2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcblx0XHRcdGltZy5zcmMgPSB0aGlzLmZpbGVzW2luZGV4XS5zb3VyY2VbJ21vZGFsJ107XHJcblx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZFsnbW9kYWwnXSA9IHRydWU7XHJcblxyXG5cdFx0XHR0aGlzLmxvZygnbG9hZCBpbWFnZScsIHtpbmRleDogaW5kZXgsIGZpbGU6IHRoaXMuZmlsZX0pO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gaXMgc2luZ2xlP1xyXG5cdFx0cHVibGljIGdldCBpc1NpbmdsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmZpbGVzLmxlbmd0aCA+IDEgPyBmYWxzZSA6IHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgdGhlIGRvd25sb2FkIGxpbmtcclxuXHRcdHB1YmxpYyBkb3dubG9hZExpbmsoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5zZWxlY3RlZCAhPSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLmJhc2VVcmwgKyB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdW3RoaXMub3B0aW9ucy5maWVsZHMuc291cmNlLm1vZGFsXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgdGhlIGZpbGVcclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHZpc2libGVcclxuXHRcdHB1YmxpYyBnZXQgbW9kYWxWaXNpYmxlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuX3Zpc2libGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBnZXQgdGhlbWVcclxuXHRcdHB1YmxpYyBnZXQgdGhlbWUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLnRoZW1lO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gc2V0IHZpc2libGVcclxuXHRcdHB1YmxpYyBzZXQgbW9kYWxWaXNpYmxlKHZhbHVlIDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0dGhpcy5fdmlzaWJsZSA9IHZhbHVlO1xyXG5cclxuXHRcdFx0aWYgKHZhbHVlKSB7XHJcblxyXG5cdFx0XHRcdHRoaXMucHJlbG9hZCgxKTtcclxuXHRcdFx0XHR0aGlzLm1vZGFsSW5pdCgpO1xyXG5cdFx0XHRcdHRoaXMuZWwoJ2JvZHknKS5hZGRDbGFzcygneWhpZGRlbicpO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0dGhpcy5lbCgnYm9keScpLnJlbW92ZUNsYXNzKCd5aGlkZGVuJyk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGUgZm9jdXNcclxuXHRcdHB1YmxpYyBzZXRGb2N1cygpIHtcclxuXHJcblx0XHRcdHRoaXMuZWwoJy5hc2ctbW9kYWwuJyArIHRoaXMuaWQgKyAnIC5rZXlJbnB1dCcpLnRyaWdnZXIoJ2ZvY3VzJykuZm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGluaXRpYWxpemUgdGhlIGdhbGxlcnlcclxuXHRcdHByaXZhdGUgbW9kYWxJbml0KCkge1xyXG5cclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHJcblx0XHRcdFx0Ly8gc3VibWVudSBjbGljayBldmVudHNcclxuXHRcdFx0XHR2YXIgZWxlbWVudCA9ICcuZ2FsbGVyeS1tb2RhbC4nICsgc2VsZi5pZCArICcgbGkuZHJvcGRvd24tc3VibWVudSc7XHJcblx0XHRcdFx0dGhpcy5lbChlbGVtZW50KS5vZmYoKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuZWwodGhpcykuaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVsKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVsKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHRcdHRoaXMuZWwodGhpcykuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0c2VsZi5zZXRGb2N1cygpO1xyXG5cclxuXHRcdFx0fSwgMTAwKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBtb2RhbE9wZW4oaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleCA/IGluZGV4IDogdGhpcy5zZWxlY3RlZDtcclxuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLnNldEhhc2goKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG1vZGFsQ2xvc2UoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmxvY2F0aW9uLmhhc2goJycpO1xyXG5cdFx0XHR0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHJpdmF0ZSBsb2coZXZlbnQgOiBzdHJpbmcsIGRhdGE/IDogYW55KSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmRlYnVnKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ0FTRyB8ICcgKyB0aGlzLmlkICsgJyA6ICcgKyBldmVudCwgZGF0YSA/IGRhdGEgOiBudWxsKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgZWwoc2VsZWN0b3IpIDogYW55IHtcclxuXHJcblx0XHRcdHJldHVybiBhbmd1bGFyLmVsZW1lbnQoc2VsZWN0b3IpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdH1cclxuXHJcblx0dmFyIGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuc2VydmljZSgnYXNnU2VydmljZScsIFtcIiR0aW1lb3V0XCIsIFwiJGludGVydmFsXCIsIFwiJGxvY2F0aW9uXCIsIFNlcnZpY2VDb250cm9sbGVyXSk7XHJcblxyXG59XHJcblxyXG4iXX0=

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/asg-image.html','<div class="asg-image {{ $ctrl.asg.theme }}" data-ng-style="{\'height\' : $ctrl.asg.options.image.height}">\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" data-ng-swipe-left="$ctrl.asg.toForward()" data-ng-swipe-right="$ctrl.asg.toBackward()">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.asg.files" data-ng-show="$ctrl.asg.selected == key" data-ng-class="{\'loading\' : !file.loaded.image}">\r\n\r\n\t\t\t<img class="img-responsive source" data-ng-if="file.loaded.image" data-ng-class="{ wide : $ctrl.config.wide }" data-ng-src="{{ file.source.image }}" data-ng-mouseover="$ctrl.asg.hoverPreload(key)" data-ng-click="$ctrl.asg.modalOpen()">\r\n\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>\r\n\r\n\r\n\r\n\r\n');
$templateCache.put('views/asg-modal.html','<script type="text/ng-template" id="help.html">\r\n\t<ul>\r\n\t\t<li>SPACE : forward</li>\r\n\t\t<li>RIGHT : forward</li>\r\n\t\t<li>LEFT : backward</li>\r\n\t\t<li>UP / HOME : first</li>\r\n\t\t<li>DOWN / END : last</li>\r\n\t\t<li>ESC : exit</li>\r\n\t\t<li>P : play/pause</li>\r\n\t\t<li>F / ENTER : toggle fullscreen</li>\r\n\t\t<li>T : change transition effect</li>\r\n\t\t<li>M : toggle menu</li>\r\n\t\t<li>W : toggle wide screen</li>\r\n\t\t<li>C : toggle caption</li>\r\n\t\t<li>H : toggle help</li>\r\n\t</ul>\r\n</script>\r\n\r\n<div class="asg-modal {{ $ctrl.id }}" data-ng-class="$ctrl.getClass()" data-ng-click="$ctrl.asg.setFocus()" data-ng-show="$ctrl.asg.modalVisible" data-ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" data-ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="header">\r\n\r\n        <span class="buttons pull-right">\r\n\r\n\t\t\t   <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.autoPlayToggle()">\r\n                    <span data-ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t\t\t\t   <span data-ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toFirst(true)">\r\n                    {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toBackward(true)">\r\n                    <span class="glyphicon glyphicon-chevron-left"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toForward(true)">\r\n                    <span class="glyphicon glyphicon-chevron-right"></span>\r\n                </button>\r\n\r\n             <span data-ng-if="!$ctrl.asg.isSingle && false" class="dropdown">\r\n                    <button class="btn btn-default btn-sm dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                        <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu pull-right">\r\n                        <li class="dropdown-submenu">\r\n                            <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.asg.transitions">\r\n                                    <span data-ng-class="{\'highlight\' : transition == $ctrl.config.transition}">\r\n                                        {{ transition }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTheme(theme)" data-ng-repeat="theme in $ctrl.themes">\r\n                                    <span data-ng-class="{\'highlight\' : theme == $ctrl.asg.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                        <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                    </ul>\r\n                </span>\r\n\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleMenu()">\r\n                    <span data-ng-if="$ctrl.config.menu" class="glyphicon glyphicon-chevron-up"></span>\r\n                    <span data-ng-if="!$ctrl.config.menu" class="glyphicon glyphicon-chevron-down"></span>\r\n                </button>\r\n\r\n\t\t\t \t<button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleWide()">\r\n                    <span class="glyphicon glyphicon-resize-horizontal"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleFullScreen()">\r\n                    <span class="glyphicon glyphicon-fullscreen"></span>\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleHelp()">\r\n                    <span class="glyphicon glyphicon-question-sign"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.modalClose()">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n\r\n            </span>\r\n\r\n\t\t<span data-ng-if="$ctrl.config.title">\r\n\t\t\t<span class="title">{{ $ctrl.config.title }}</span>\r\n\t\t\t<span class="subtitle" data-ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span>\r\n\t\t</span>\r\n\r\n\t</div>\r\n\r\n\t<div class="help text-right" data-ng-click="$ctrl.toggleHelp()" data-ng-show="$ctrl.config.help" data-ng-include src="\'help.html\'"></div>\r\n\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}" data-ng-mouseover="$ctrl.arrowsShow()" data-ng-mouseleave="$ctrl.arrowsHide()" data-ng-swipe-left="$ctrl.asg.toForward(true)" data-ng-swipe-right="$ctrl.asg.toBackward(true)">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.asg.files" data-ng-show="$ctrl.asg.selected == key" data-ng-class="{\'loading\' : !file.loaded.modal}">\r\n\r\n\t\t\t<img class="source" data-ng-class="{ wide : $ctrl.config.wide }" data-ng-src="{{ file.source.modal }}" data-ng-if="file.loaded.modal">\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.asg.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toBackward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.asg.toBackward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" data-ng-click="$ctrl.asg.toBackward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-sm pull-left visible-xs" data-ng-click="$ctrl.asg.toBackward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.asg.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toForward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.asg.toForward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" data-ng-click="$ctrl.asg.toForward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-sm pull-right visible-xs" data-ng-click="$ctrl.asg.toForward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-show="$ctrl.arrowsVisible" class="functions">\r\n\t\t</div>\r\n\r\n\t</div>\r\n\r\n\r\n\t<div class="caption" data-ng-if="$ctrl.config.caption">\r\n\t\t<div class="content">\r\n\t\t\t<span class="title">{{ $ctrl.asg.file.title }}</span>\r\n\t\t\t<span data-ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description"> - </span>\r\n\t\t\t<span class="description">{{ $ctrl.asg.file.description }}</span>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>');
$templateCache.put('views/asg-panel.html','<div class="asg-panel {{ $ctrl.asg.theme }}">\r\n\r\n\t<div data-ng-repeat="(key,file) in $ctrl.asg.files" class="item {{ $ctrl.asg.options.panel.item.class }}" data-ng-class="{\'selected\' : $ctrl.asg.selected == key}" data-ng-mouseover="indexShow = true" data-ng-mouseleave="indexShow = false">\r\n\r\n\t\t<img data-ng-src="{{ file.source.panel }}" data-ng-click="$ctrl.asg.setSelected(key)" data-ng-mouseover="$ctrl.asg.hoverPreload(key)" alt="{{ file.title }}">\r\n\t\t<span class="index" data-ng-if="$ctrl.config.item.index && indexShow">{{ key + 1 }}</span>\r\n\r\n\t\t<div class="caption" data-ng-if="$ctrl.config.item.caption">\r\n\t\t\t<span>{{ file.title }}</span>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>');}]);