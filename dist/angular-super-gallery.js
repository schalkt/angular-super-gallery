/**
 * angular-super-gallery - Super Angular image gallery
 * 
 * @version v0.1.6
 * @link https://github.com/schalkt/angular-super-gallery
 * @license MIT
 */
var ASG;
(function (ASG) {
    var app = angular.module('angularSuperGallery', ['ngAnimate']);
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
        function ServiceController(timeout, interval) {
            this.timeout = timeout;
            this.interval = interval;
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
                    transition: 'rotateLR',
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
                    transition: 'rotateLR',
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
        ServiceController.prototype.getInstance = function (component) {
            var id = component.id;
            var instance = this.instances[id];
            if (instance == undefined) {
                instance = new ServiceController(this.timeout, this.interval);
                instance.id = id;
            }
            instance.setOptions(component.options);
            instance.setItems(component.items);
            instance.selected = component.selected ? component.selected : 0;
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
        };
        ServiceController.prototype.toForward = function (stop) {
            stop && this.autoPlayStop();
            this.direction = 'forward';
            this.selected = this.normalize(++this.selected);
            this.loadImage(this.selected + 1);
        };
        ServiceController.prototype.toFirst = function (stop) {
            stop && this.autoPlayStop();
            this.direction = 'backward';
            this.selected = 0;
        };
        ServiceController.prototype.toLast = function (stop) {
            stop && this.autoPlayStop();
            this.direction = 'forward';
            this.selected = this.items.length - 1;
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
                    angular.element('body').addClass('yhidden');
                }
                else {
                    angular.element('body').removeClass('yhidden');
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
            angular.element('.asg-modal.' + this.id + ' .keyInput').trigger('focus').focus();
        };
        ServiceController.prototype.modalInit = function () {
            var self = this;
            this.timeout(function () {
                var element = '.gallery-modal.' + self.id + ' li.dropdown-submenu';
                angular.element(element).off().on('click', function (event) {
                    event.stopPropagation();
                    if (angular.element(this).hasClass('open')) {
                        angular.element(this).removeClass('open');
                    }
                    else {
                        angular.element(element).removeClass('open');
                        angular.element(this).addClass('open');
                    }
                });
                self.setFocus();
            }, 100);
        };
        ServiceController.prototype.modalOpen = function (index) {
            this.selected = index ? index : this.selected;
            this.modalVisible = true;
        };
        ServiceController.prototype.modalClose = function () {
            this.modalVisible = false;
        };
        ServiceController.prototype.log = function (event, data) {
            if (this.options.debug) {
                console.log('ASG | ' + this.id + ' : ' + event, data ? data : null);
            }
        };
        return ServiceController;
    }());
    ASG.ServiceController = ServiceController;
    var app = angular.module('angularSuperGallery');
    app.service('asgService', ["$timeout", "$interval", ServiceController]);
})(ASG || (ASG = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hc2cudHMiLCJzcmMvYXNnLWltYWdlLnRzIiwic3JjL2FzZy1tb2RhbC50cyIsInNyYy9hc2ctcGFuZWwudHMiLCJzcmMvYXNnLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBTyxHQUFHLENBbUJUO0FBbkJELFdBQU8sR0FBRztJQUVULElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUU1RSxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtRQUN0QixNQUFNLENBQUMsVUFBVSxLQUFXLEVBQUUsU0FBa0I7WUFFL0MsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUE7WUFDM0QsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsQ0FBQztnQkFBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBRXBELElBQUksS0FBSyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFDbEQsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFdkQsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFT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QUMsUUFBUSxDQUFDO1lBQzlDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBRTFCLENBQUM7UUFFTSxzQ0FBVSxHQUFqQjtZQUVDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBRTNCLENBQUM7UUFHTywrQkFBRyxHQUFYLFVBQVksS0FBYyxFQUFFLElBQVc7WUFFdEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssR0FBRyxLQUFLLEVBQUUsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNyRSxDQUFDO1FBRUYsQ0FBQztRQUdGLHdCQUFDO0lBQUQsQ0FsZ0JBLEFBa2dCQyxJQUFBO0lBbGdCWSxxQkFBaUIsb0JBa2dCN0IsQ0FBQTtJQUVELElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFFN0QsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztBQUV6RSxDQUFDLEVBMW9CTSxHQUFHLEtBQUgsR0FBRyxRQTBvQlQiLCJmaWxlIjoiYW5ndWxhci1zdXBlci1nYWxsZXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi8uLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxyXG5cclxubW9kdWxlIEFTRyB7XHJcblxyXG5cdHZhciBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknLCBbJ25nQW5pbWF0ZSddKTtcclxuXHJcblx0YXBwLmZpbHRlcignYXNnQnl0ZXMnLCAoKSA9PiB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGJ5dGVzIDogYW55LCBwcmVjaXNpb24gOiBudW1iZXIpIDogc3RyaW5nIHtcclxuXHJcblx0XHRcdGlmIChpc05hTihwYXJzZUZsb2F0KGJ5dGVzKSkgfHwgIWlzRmluaXRlKGJ5dGVzKSkgcmV0dXJuICcnXHJcblx0XHRcdGlmIChieXRlcyA9PT0gMCkgcmV0dXJuICcwJztcclxuXHRcdFx0aWYgKHR5cGVvZiBwcmVjaXNpb24gPT09ICd1bmRlZmluZWQnKSBwcmVjaXNpb24gPSAxO1xyXG5cclxuXHRcdFx0dmFyIHVuaXRzID0gWydieXRlcycsICdrQicsICdNQicsICdHQicsICdUQicsICdQQiddLFxyXG5cdFx0XHRcdG51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5sb2coYnl0ZXMpIC8gTWF0aC5sb2coMTAyNCkpO1xyXG5cclxuXHRcdFx0cmV0dXJuIChieXRlcyAvIE1hdGgucG93KDEwMjQsIE1hdGguZmxvb3IobnVtYmVyKSkpLnRvRml4ZWQocHJlY2lzaW9uKSArICcgJyArIHVuaXRzW251bWJlcl07XHJcblxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxyXG5cclxuIiwibW9kdWxlIEFTRyB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBJbWFnZUNvbnRyb2xsZXIge1xyXG5cclxuXHRcdHByaXZhdGUgdHlwZSA6IHN0cmluZyA9ICdpbWFnZSc7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHRcdHB1YmxpYyBzZWxlY3RlZCA6IG51bWJlcjtcclxuXHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGltYWdlIGNvbmZpZ1xyXG5cdFx0cHVibGljIGdldCBjb25maWcoKSA6IElPcHRpb25zSW1hZ2Uge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IGltYWdlIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc0ltYWdlKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zW3RoaXMudHlwZV0gPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0dmFyIGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KFwiYXNnSW1hZ2VcIiwge1xyXG5cdFx0Y29udHJvbGxlcjogW1wiYXNnU2VydmljZVwiLCBBU0cuSW1hZ2VDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLWltYWdlLmh0bWwnLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6IFwiQFwiLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG59IiwibW9kdWxlIEFTRyB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBNb2RhbENvbnRyb2xsZXIge1xyXG5cclxuXHRcdHByaXZhdGUgdHlwZSA6IHN0cmluZyA9ICdtb2RhbCc7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHRcdHB1YmxpYyBzZWxlY3RlZCA6IG51bWJlcjtcclxuXHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRwcml2YXRlIF9mdWxsc2NyZWVuIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBfdmlzaWJsZSA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdHByaXZhdGUgYXJyb3dzVmlzaWJsZSA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdFx0XHRwcml2YXRlIGZ1bGxzY3JlZW4pIHtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2VcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwcml2YXRlIGdldENsYXNzKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmNvbmZpZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIG5nQ2xhc3MgPSBbXTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5jb25maWcubWVudSkge1xyXG5cdFx0XHRcdG5nQ2xhc3MucHVzaCgnbm9tZW51Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5nQ2xhc3MucHVzaCh0aGlzLmFzZy5vcHRpb25zLnRoZW1lKTtcclxuXHJcblx0XHRcdHJldHVybiBuZ0NsYXNzLmpvaW4oJyAnKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IGFjdGlvbiBmcm9tIGtleWNvZGVzXHJcblx0XHRwcml2YXRlIGdldEFjdGlvbkJ5S2V5Q29kZShrZXlDb2RlIDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmtleWNvZGVzKTtcclxuXHRcdFx0dmFyIGFjdGlvbjtcclxuXHJcblx0XHRcdGZvciAodmFyIGtleSBpbiBrZXlzKSB7XHJcblxyXG5cdFx0XHRcdHZhciBjb2RlcyA9IHRoaXMuY29uZmlnLmtleWNvZGVzW2tleXNba2V5XV07XHJcblxyXG5cdFx0XHRcdGlmICghY29kZXMpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIGluZGV4ID0gY29kZXMuaW5kZXhPZihrZXlDb2RlKTtcclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcclxuXHRcdFx0XHRcdGFjdGlvbiA9IGtleXNba2V5XTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBhY3Rpb247XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBkbyBrZXlib2FyZCBhY3Rpb25cclxuXHRcdHB1YmxpYyBrZXlVcChlIDogS2V5Ym9hcmRFdmVudCkge1xyXG5cclxuXHRcdFx0dmFyIGFjdGlvbiA6IHN0cmluZyA9IHRoaXMuZ2V0QWN0aW9uQnlLZXlDb2RlKGUua2V5Q29kZSk7XHJcblxyXG5cdFx0XHRzd2l0Y2ggKGFjdGlvbikge1xyXG5cclxuXHRcdFx0XHRjYXNlICdleGl0JzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLm1vZGFsQ2xvc2UoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdwbGF5cGF1c2UnOlxyXG5cdFx0XHRcdFx0dGhpcy5hc2cuYXV0b1BsYXlUb2dnbGUoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdmb3J3YXJkJzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvRm9yd2FyZCh0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdiYWNrd2FyZCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2ZpcnN0JzpcclxuXHRcdFx0XHRcdHRoaXMuYXNnLnRvRmlyc3QodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnbGFzdCc6XHJcblx0XHRcdFx0XHR0aGlzLmFzZy50b0xhc3QodHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnZnVsbHNjcmVlbic6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUZ1bGxTY3JlZW4oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdtZW51JzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTWVudSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2NhcHRpb24nOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVDYXB0aW9uKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnaGVscCc6XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUhlbHAoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICd3aWRlJzpcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlV2lkZSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ3RyYW5zaXRpb24nOlxyXG5cdFx0XHRcdFx0dGhpcy5uZXh0VHJhbnNpdGlvbigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBzd2l0Y2ggdG8gbmV4dCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHJpdmF0ZSBuZXh0VHJhbnNpdGlvbigpIHtcclxuXHJcblx0XHRcdHZhciBpZHggPSB0aGlzLmFzZy50cmFuc2l0aW9ucy5pbmRleE9mKHRoaXMuY29uZmlnLnRyYW5zaXRpb24pICsgMTtcclxuXHRcdFx0dmFyIG5leHQgPSBpZHggPj0gdGhpcy5hc2cudHJhbnNpdGlvbnMubGVuZ3RoID8gMCA6IGlkeDtcclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRoaXMuYXNnLnRyYW5zaXRpb25zW25leHRdO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGZ1bGxzY3JlZW5cclxuXHRcdHByaXZhdGUgdG9nZ2xlRnVsbFNjcmVlbigpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmZ1bGxzY3JlZW4uaXNFbmFibGVkKCkpIHtcclxuXHRcdFx0XHR0aGlzLmZ1bGxzY3JlZW4uY2FuY2VsKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5mdWxsc2NyZWVuLmFsbCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHVibGljIHNldFRyYW5zaXRpb24odHJhbnNpdGlvbikge1xyXG5cclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGVtZVxyXG5cdFx0cHVibGljIHNldFRoZW1lKHRoZW1lIDogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zLnRoZW1lID0gdGhlbWU7XHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG92ZXJsYXkgYXJyb3dzIGhpZGVcclxuXHRcdHB1YmxpYyBhcnJvd3NIaWRlKCkge1xyXG5cclxuXHRcdFx0dGhpcy5hcnJvd3NWaXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG92ZXJsYXkgYXJyb3dzIHNob3dcclxuXHRcdHB1YmxpYyBhcnJvd3NTaG93KCkge1xyXG5cclxuXHRcdFx0dGhpcy5hcnJvd3NWaXNpYmxlID0gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGhlbHBcclxuXHRcdHByaXZhdGUgdG9nZ2xlSGVscCgpIHtcclxuXHJcblx0XHRcdHRoaXMuY29uZmlnLmhlbHAgPSAhdGhpcy5jb25maWcuaGVscDtcclxuXHRcdFx0dGhpcy5hc2cuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHRvZ2dsZSB3aWRlXHJcblx0XHRwcml2YXRlIHRvZ2dsZVdpZGUoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmNvbmZpZy53aWRlID0gIXRoaXMuY29uZmlnLndpZGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyB0b2dnbGUgbWVudVxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVNZW51KCkge1xyXG5cclxuXHRcdFx0dGhpcy5jb25maWcubWVudSA9ICF0aGlzLmNvbmZpZy5tZW51O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgY2FwdGlvblxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVDYXB0aW9uKCkge1xyXG5cclxuXHRcdFx0dGhpcy5jb25maWcuY2FwdGlvbiA9ICF0aGlzLmNvbmZpZy5jYXB0aW9uO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbW9kYWwgdmlzaWJsZVxyXG5cdFx0cHVibGljIGdldCB2aXNpYmxlKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm1vZGFsVmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IG1vZGFsIHZpc2libGVcclxuXHRcdHB1YmxpYyBzZXQgdmlzaWJsZSh2YWx1ZSA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsVmlzaWJsZSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbW9kYWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNNb2RhbCB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgbW9kYWwgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zTW9kYWwpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHJcblx0dmFyIGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KFwiYXNnTW9kYWxcIiwge1xyXG5cdFx0Y29udHJvbGxlcjogW1wiYXNnU2VydmljZVwiLCBcIkZ1bGxzY3JlZW5cIiwgQVNHLk1vZGFsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FzZy1tb2RhbC5odG1sJyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiBcIkBcIixcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nLFxyXG5cdFx0XHR2aXNpYmxlOiBcIj0/XCJcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn0iLCJtb2R1bGUgQVNHIHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIFBhbmVsQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHJpdmF0ZSB0eXBlIDogc3RyaW5nID0gJ3BhbmVsJztcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIHNlbGVjdGVkIDogbnVtYmVyO1xyXG5cclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcikge1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgcGFuZWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNQYW5lbCB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9uc1t0aGlzLnR5cGVdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgcGFuZWwgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zUGFuZWwpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnNbdGhpcy50eXBlXSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoXCJhc2dQYW5lbFwiLCB7XHJcblx0XHRjb250cm9sbGVyOiBbXCJhc2dTZXJ2aWNlXCIsIEFTRy5QYW5lbENvbnRyb2xsZXJdLFxyXG5cdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9hc2ctcGFuZWwuaHRtbCcsXHJcblx0XHRiaW5kaW5nczoge1xyXG5cdFx0XHRpZDogXCJAXCIsXHJcblx0XHRcdGl0ZW1zOiAnPT8nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBBU0cge1xyXG5cclxuXHQvLyBtb2RhbCBjb21wb25lbnQgb3B0aW9uc1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNNb2RhbCB7XHJcblxyXG5cdFx0bWVudT8gOiBib29sZWFuO1xyXG5cdFx0aGVscD8gOiBib29sZWFuO1xyXG5cdFx0Y2FwdGlvbj8gOiBib29sZWFuO1xyXG5cdFx0dHJhbnNpdGlvbj8gOiBzdHJpbmc7XHJcblx0XHR0aXRsZT8gOiBzdHJpbmc7XHJcblx0XHRzdWJ0aXRsZT8gOiBzdHJpbmc7XHJcblx0XHR3aWRlPyA6IGJvb2xlYW47XHJcblx0XHRrZXljb2Rlcz8gOiB7XHJcblx0XHRcdGV4aXQ/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0cGxheXBhdXNlPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdGZvcndhcmQ/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0YmFja3dhcmQ/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0Zmlyc3Q/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0bGFzdD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRmdWxsc2NyZWVuPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdG1lbnU/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0Y2FwdGlvbj8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0XHRoZWxwPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRcdHdpZGU/IDogQXJyYXk8bnVtYmVyPjtcclxuXHRcdFx0dHJhbnNpdGlvbj8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gcGFuZWwgY29tcG9uZW50IG9wdGlvbnNcclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zUGFuZWwge1xyXG5cclxuXHRcdGl0ZW0/IDoge1xyXG5cdFx0XHRjbGFzcz8gOiBzdHJpbmc7XHJcblx0XHR9LFxyXG5cclxuXHR9XHJcblxyXG5cdC8vIGltYWdlIGNvbXBvbmVudCBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc0ltYWdlIHtcclxuXHJcblx0XHR0cmFuc2l0aW9uPyA6IHN0cmluZztcclxuXHRcdGhlaWdodD8gOiBudW1iZXI7XHJcblx0XHR3aWRlPyA6IGJvb2xlYW47XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gZ2FsbGVyeSBvcHRpb25zXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9ucyB7XHJcblxyXG5cdFx0ZGVidWc/IDogYm9vbGVhbixcclxuXHRcdGJhc2VVcmw/IDogc3RyaW5nO1xyXG5cdFx0ZmllbGRzPyA6IHtcclxuXHRcdFx0c291cmNlPyA6IHtcclxuXHRcdFx0XHRtb2RhbD8gOiBzdHJpbmc7XHJcblx0XHRcdFx0cGFuZWw/IDogc3RyaW5nO1xyXG5cdFx0XHRcdGltYWdlPyA6IHN0cmluZztcclxuXHRcdFx0fVxyXG5cdFx0XHR0aXRsZT8gOiBzdHJpbmc7XHJcblx0XHRcdGRlc2NyaXB0aW9uPyA6IHN0cmluZztcclxuXHRcdFx0dGh1bWJuYWlsPyA6IHN0cmluZztcclxuXHRcdH0sXHJcblx0XHRhdXRvcGxheT8gOiB7XHJcblx0XHRcdGVuYWJsZWQ/IDogYm9vbGVhbjtcclxuXHRcdFx0ZGVsYXk/IDogbnVtYmVyO1xyXG5cdFx0fSxcclxuXHRcdHRoZW1lPyA6IHN0cmluZztcclxuXHRcdHByZWxvYWREZWxheT8gOiBudW1iZXI7XHJcblx0XHRwcmVsb2FkPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRtb2RhbD8gOiBJT3B0aW9uc01vZGFsO1xyXG5cdFx0cGFuZWw/IDogSU9wdGlvbnNQYW5lbDtcclxuXHRcdGltYWdlPyA6IElPcHRpb25zSW1hZ2U7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gaW1hZ2Ugc291cmNlXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJU291cmNlIHtcclxuXHJcblx0XHRtb2RhbCA6IHN0cmluZzsgLy8gb3JpZ2luYWwsIHJlcXVpcmVkXHJcblx0XHRwYW5lbD8gOiBzdHJpbmc7XHJcblx0XHRpbWFnZT8gOiBzdHJpbmc7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gaW1hZ2UgZmlsZVxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUZpbGUge1xyXG5cclxuXHRcdHNvdXJjZSA6IElTb3VyY2U7XHJcblx0XHR0aXRsZT8gOiBzdHJpbmc7XHJcblx0XHRkZXNjcmlwdGlvbj8gOiBzdHJpbmc7XHJcblx0XHR0aHVtYm5haWw/IDogc3RyaW5nO1xyXG5cdFx0bG9hZGVkPyA6IHtcclxuXHRcdFx0bW9kYWw/IDogYm9vbGVhbjtcclxuXHRcdFx0cGFuZWw/IDogYm9vbGVhbjtcclxuXHRcdFx0aW1hZ2U/IDogYm9vbGVhbjtcclxuXHRcdH07XHJcblx0XHRzaXplPyA6IG51bWJlcjtcclxuXHRcdHdpZHRoPyA6IG51bWJlcjtcclxuXHRcdGhlaWdodD8gOiBudW1iZXI7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gc2VydmljZSBjb250cm9sbGVyIGludGVyZmFjZVxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVNlcnZpY2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRnZXRJbnN0YW5jZShjb21wb25lbnQgOiBhbnkpIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0c2V0RGVmYXVsdHMoKSA6IHZvaWQ7XHJcblx0XHRzZXRPcHRpb25zKG9wdGlvbnMgOiBJT3B0aW9ucykgOiBJT3B0aW9ucztcclxuXHRcdHNldEl0ZW1zKGl0ZW1zIDogQXJyYXk8SUZpbGU+KSA6IHZvaWQ7XHJcblx0XHRwcmVsb2FkKHdhaXQ/IDogbnVtYmVyKSA6IHZvaWQ7XHJcblx0XHRub3JtYWxpemUoaW5kZXggOiBudW1iZXIpIDogbnVtYmVyO1xyXG5cdFx0c2V0Rm9jdXMoKSA6IHZvaWQ7XHJcblx0XHRtb2RhbE9wZW4oaW5kZXggOiBudW1iZXIpIDogdm9pZDtcclxuXHRcdG1vZGFsQ2xvc2UoKSA6IHZvaWQ7XHJcblx0XHR0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cdFx0dG9Gb3J3YXJkKHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cdFx0dG9GaXJzdChzdG9wPyA6IGJvb2xlYW4pIDogdm9pZDtcclxuXHRcdHRvTGFzdChzdG9wPyA6IGJvb2xlYW4pIDogdm9pZDtcclxuXHRcdGxvYWRJbWFnZShpbmRleD8gOiBudW1iZXIpIDogdm9pZDtcclxuXHRcdGxvYWRJbWFnZXMoaW5kZXhlcyA6IEFycmF5PG51bWJlcj4pIDogdm9pZDtcclxuXHRcdGF1dG9QbGF5VG9nZ2xlKCkgOiB2b2lkO1xyXG5cdFx0bW9kYWxWaXNpYmxlIDogYm9vbGVhbjtcclxuXHRcdHRyYW5zaXRpb25zIDogQXJyYXk8c3RyaW5nPjtcclxuXHRcdHRoZW1lcyA6IEFycmF5PHN0cmluZz47XHJcblx0XHRvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHRcdHNlbGVjdGVkIDogbnVtYmVyO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIHNlcnZpY2UgY29udHJvbGxlclxyXG5cdGV4cG9ydCBjbGFzcyBTZXJ2aWNlQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogYW55O1xyXG5cdFx0cHVibGljIGZpbGVzIDogQXJyYXk8SUZpbGU+ID0gW107XHJcblx0XHRwdWJsaWMgZGlyZWN0aW9uIDogc3RyaW5nO1xyXG5cclxuXHRcdHByaXZhdGUgaW5zdGFuY2VzIDoge30gPSB7fVxyXG5cdFx0cHJpdmF0ZSBfc2VsZWN0ZWQgOiBudW1iZXI7XHJcblx0XHRwcml2YXRlIF92aXNpYmxlIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBhdXRvcGxheSA6IGFuZ3VsYXIuSVByb21pc2U8YW55PjtcclxuXHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zID0ge307XHJcblx0XHRwdWJsaWMgZGVmYXVsdHMgOiBJT3B0aW9ucyA9IHtcclxuXHRcdFx0ZGVidWc6IGZhbHNlLCAvLyBpbWFnZSBsb2FkIGFuZCBhdXRvcGxheSBpbmZvIGluIGNvbnNvbGUubG9nXHJcblx0XHRcdGJhc2VVcmw6IFwiXCIsIC8vIHVybCBwcmVmaXhcclxuXHRcdFx0ZmllbGRzOiB7XHJcblx0XHRcdFx0c291cmNlOiB7XHJcblx0XHRcdFx0XHRtb2RhbDogXCJ1cmxcIiwgLy8gcmVxdWlyZWQsIGltYWdlIHVybCBmb3IgbW9kYWwgY29tcG9uZW50IChsYXJnZSBzaXplKVxyXG5cdFx0XHRcdFx0cGFuZWw6IFwidXJsXCIsIC8vIGltYWdlIHVybCBmb3IgcGFuZWwgY29tcG9uZW50ICh0aHVtYm5haWwgc2l6ZSlcclxuXHRcdFx0XHRcdGltYWdlOiBcInVybFwiIC8vIGltYWdlIHVybCBmb3IgaW1hZ2UgKG1lZGl1bSBzaXplKVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dGl0bGU6IFwidGl0bGVcIiwgLy8gdGl0bGUgaW5wdXQgZmllbGQgbmFtZVxyXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBcImRlc2NyaXB0aW9uXCIsIC8vIGRlc2NyaXB0aW9uIGlucHV0IGZpZWxkIG5hbWVcclxuXHRcdFx0XHR0aHVtYm5haWw6IFwidGh1bWJuYWlsXCIgLy8gdGh1bWJuYWlsIGlucHV0IGZpZWxkIG5hbWVcclxuXHRcdFx0fSxcclxuXHRcdFx0YXV0b3BsYXk6IHtcclxuXHRcdFx0XHRlbmFibGVkOiBmYWxzZSwgLy8gc2xpZGVzaG93IHBsYXkgZW5hYmxlZC9kaXNhYmxlZFxyXG5cdFx0XHRcdGRlbGF5OiA0MTAwIC8vIGF1dG9wbGF5IGRlbGF5IGluIG1pbGxpc2Vjb25kXHJcblx0XHRcdH0sXHJcblx0XHRcdHRoZW1lOiAnZGVmYXVsdCcsIC8vIGNzcyBzdHlsZSBbZGVmYXVsdCwgZGFya2JsdWUsIHdoaXRlZ29sZF1cclxuXHRcdFx0cHJlbG9hZERlbGF5OiA3NzAsXHJcblx0XHRcdHByZWxvYWQ6IFtdLCAvLyBwcmVsb2FkIGltYWdlcyBieSBpbmRleCBudW1iZXJcclxuXHRcdFx0bW9kYWw6IHtcclxuXHRcdFx0XHR0aXRsZTogXCJcIiwgLy8gbW9kYWwgd2luZG93IHRpdGxlXHJcblx0XHRcdFx0c3VidGl0bGU6IFwiXCIsIC8vIG1vZGFsIHdpbmRvdyBzdWJ0aXRsZVxyXG5cdFx0XHRcdGNhcHRpb246IHRydWUsIC8vIHNob3cvaGlkZSBpbWFnZSBjYXB0aW9uXHJcblx0XHRcdFx0bWVudTogdHJ1ZSwgLy8gc2hvdy9oaWRlIG1vZGFsIG1lbnVcclxuXHRcdFx0XHRoZWxwOiBmYWxzZSwgLy8gc2hvdy9oaWRlIGhlbHBcclxuXHRcdFx0XHR0cmFuc2l0aW9uOiAncm90YXRlTFInLCAvLyB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0XHRcdHdpZGU6IGZhbHNlLCAvLyBlbmFibGUvZGlzYWJsZSB3aWRlIGltYWdlIGRpc3BsYXkgbW9kZVxyXG5cdFx0XHRcdGtleWNvZGVzOiB7XHJcblx0XHRcdFx0XHRleGl0OiBbMjddLCAvLyBFU0NcclxuXHRcdFx0XHRcdHBsYXlwYXVzZTogWzgwXSwgLy8gcFxyXG5cdFx0XHRcdFx0Zm9yd2FyZDogWzMyLCAzOV0sIC8vIFNQQUNFLCBSSUdIVCBBUlJPV1xyXG5cdFx0XHRcdFx0YmFja3dhcmQ6IFszN10sIC8vIExFRlQgQVJST1dcclxuXHRcdFx0XHRcdGZpcnN0OiBbMzgsIDM2XSwgLy8gVVAgQVJST1csIEhPTUVcclxuXHRcdFx0XHRcdGxhc3Q6IFs0MCwgMzVdLCAvLyBET1dOIEFSUk9XLCBFTkRcclxuXHRcdFx0XHRcdGZ1bGxzY3JlZW46IFs3MCwgMTNdLCAvLyBmLCBFTlRFUlxyXG5cdFx0XHRcdFx0bWVudTogWzc3XSwgLy8gbVxyXG5cdFx0XHRcdFx0Y2FwdGlvbjogWzY3XSwgLy8gY1xyXG5cdFx0XHRcdFx0aGVscDogWzcyXSwgLy8gaFxyXG5cdFx0XHRcdFx0d2lkZTogWzg3XSwgLy8gd1xyXG5cdFx0XHRcdFx0dHJhbnNpdGlvbjogWzg0XSAvLyB0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRwYW5lbDoge1xyXG5cdFx0XHRcdGl0ZW06IHtcclxuXHRcdFx0XHRcdGNsYXNzOiAnY29sLW1kLTMnIC8vIGl0ZW0gY2xhc3NcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRpbWFnZToge1xyXG5cdFx0XHRcdHRyYW5zaXRpb246ICdyb3RhdGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRcdFx0d2lkZTogZmFsc2UsIC8vIGVuYWJsZS9kaXNhYmxlIHdpZGUgaW1hZ2UgZGlzcGxheSBtb2RlXHJcblx0XHRcdFx0aGVpZ2h0OiAzMDAsIC8vIGhlaWdodFxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIGF2YWlsYWJsZSB0aGVtZXNcclxuXHRcdHB1YmxpYyB0aGVtZXMgOiBBcnJheTxzdHJpbmc+ID0gW1xyXG5cdFx0XHQnZGVmYXVsdCcsXHJcblx0XHRcdCdkYXJrYmx1ZScsXHJcblx0XHRcdCd3aGl0ZWdvbGQnXHJcblx0XHRdO1xyXG5cclxuXHRcdC8vIGF2YWlsYWJsZSB0cmFuc2l0aW9uc1xyXG5cdFx0cHVibGljIHRyYW5zaXRpb25zIDogQXJyYXk8c3RyaW5nPiA9IFtcclxuXHRcdFx0J25vJyxcclxuXHRcdFx0J2ZhZGVJbk91dCcsXHJcblx0XHRcdCd6b29tSW5PdXQnLFxyXG5cdFx0XHQncm90YXRlTFInLFxyXG5cdFx0XHQncm90YXRlVEInLFxyXG5cdFx0XHQncm90YXRlWlknLFxyXG5cdFx0XHQnc2xpZGVMUicsXHJcblx0XHRcdCdzbGlkZVRCJyxcclxuXHRcdFx0J2ZsaXBYJyxcclxuXHRcdFx0J2ZsaXBZJ1xyXG5cdFx0XTtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHRpbWVvdXQgOiBuZy5JVGltZW91dFNlcnZpY2UsXHJcblx0XHRcdFx0XHRwcml2YXRlIGludGVydmFsIDogbmcuSUludGVydmFsU2VydmljZSkge1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZSBmb3IgY3VycmVudCBnYWxsZXJ5IGJ5IGNvbXBvbmVudCBpZFxyXG5cdFx0cHVibGljIGdldEluc3RhbmNlKGNvbXBvbmVudCA6IGFueSkge1xyXG5cclxuXHRcdFx0Y29uc3QgaWQgPSBjb21wb25lbnQuaWQ7XHJcblx0XHRcdGxldCBpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzW2lkXTtcclxuXHJcblx0XHRcdC8vIG5ldyBpbnN0YW5jZSBhbmQgc2V0IG9wdGlvbnMgYW5kIGl0ZW1zXHJcblx0XHRcdGlmIChpbnN0YW5jZSA9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRpbnN0YW5jZSA9IG5ldyBTZXJ2aWNlQ29udHJvbGxlcih0aGlzLnRpbWVvdXQsIHRoaXMuaW50ZXJ2YWwpO1xyXG5cdFx0XHRcdGluc3RhbmNlLmlkID0gaWQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGluc3RhbmNlLnNldE9wdGlvbnMoY29tcG9uZW50Lm9wdGlvbnMpO1xyXG5cdFx0XHRpbnN0YW5jZS5zZXRJdGVtcyhjb21wb25lbnQuaXRlbXMpO1xyXG5cdFx0XHRpbnN0YW5jZS5zZWxlY3RlZCA9IGNvbXBvbmVudC5zZWxlY3RlZCA/IGNvbXBvbmVudC5zZWxlY3RlZCA6IDA7XHJcblxyXG5cdFx0XHRpZiAoaW5zdGFuY2Uub3B0aW9ucykge1xyXG5cclxuXHRcdFx0XHRpbnN0YW5jZS5sb2FkSW1hZ2VzKGluc3RhbmNlLm9wdGlvbnMucHJlbG9hZCk7XHJcblxyXG5cdFx0XHRcdGlmIChpbnN0YW5jZS5vcHRpb25zLmF1dG9wbGF5ICYmIGluc3RhbmNlLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCAmJiAhaW5zdGFuY2UuYXV0b3BsYXkpIHtcclxuXHRcdFx0XHRcdGluc3RhbmNlLmF1dG9QbGF5U3RhcnQoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmluc3RhbmNlc1tpZF0gPSBpbnN0YW5jZTtcclxuXHRcdFx0cmV0dXJuIGluc3RhbmNlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBwcmVwYXJlIGltYWdlcyBhcnJheVxyXG5cdFx0cHVibGljIHNldEl0ZW1zKGl0ZW1zIDogQXJyYXk8SUZpbGU+KSB7XHJcblxyXG5cdFx0XHRpZiAoIWl0ZW1zKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpZiBhbHJlYWR5XHJcblx0XHRcdGlmICh0aGlzLml0ZW1zKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLml0ZW1zID0gaXRlbXM7XHJcblx0XHRcdHRoaXMucHJlcGFyZUl0ZW1zKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG9wdGlvbnMgc2V0dXBcclxuXHRcdHB1YmxpYyBzZXRPcHRpb25zKG9wdGlvbnMgOiBJT3B0aW9ucykge1xyXG5cclxuXHRcdFx0aWYgKCFvcHRpb25zKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnMgPSBhbmd1bGFyLm1lcmdlKHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cdFx0XHR0aGlzLmxvZygnY29uZmlnJywgdGhpcy5vcHRpb25zKTtcclxuXHJcblx0XHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnM7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBzZWxlY3RlZCBpbWFnZVxyXG5cdFx0cHVibGljIHNldCBzZWxlY3RlZCh2IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLl9zZWxlY3RlZCA9IHY7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgc2VsZWN0ZWQgaW1hZ2VcclxuXHRcdHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgc2V0U2VsZWN0ZWQoaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gaW5kZXggPiB0aGlzLnNlbGVjdGVkID8gJ2ZvcndhcmQnIDogJ2JhY2t3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IHRoaXMubm9ybWFsaXplKGluZGV4KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdvIHRvIGJhY2t3YXJkXHJcblx0XHRwdWJsaWMgdG9CYWNrd2FyZChzdG9wPyA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdHN0b3AgJiYgdGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5ub3JtYWxpemUoLS10aGlzLnNlbGVjdGVkKTtcclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCAtIDEpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBmb3J3YXJkXHJcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0c3RvcCAmJiB0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdmb3J3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IHRoaXMubm9ybWFsaXplKCsrdGhpcy5zZWxlY3RlZCk7XHJcblx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQgKyAxKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gZmlyc3RcclxuXHRcdHB1YmxpYyB0b0ZpcnN0KHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0c3RvcCAmJiB0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSAwO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBsYXN0XHJcblx0XHRwdWJsaWMgdG9MYXN0KHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0c3RvcCAmJiB0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdmb3J3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IHRoaXMuaXRlbXMubGVuZ3RoIC0gMTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBhdXRvUGxheVRvZ2dsZSgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0YXJ0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBhdXRvUGxheVN0b3AoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5hdXRvcGxheSkge1xyXG5cdFx0XHRcdHRoaXMuaW50ZXJ2YWwuY2FuY2VsKHRoaXMuYXV0b3BsYXkpO1xyXG5cdFx0XHRcdHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5U3RhcnQoKSB7XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCA9IHRydWU7XHJcblxyXG5cdFx0XHR0aGlzLmF1dG9wbGF5ID0gdGhpcy5pbnRlcnZhbCgoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy50b0ZvcndhcmQoKTtcclxuXHRcdFx0XHR0aGlzLmxvZygnYXV0b3BsYXknLCB7aW5kZXg6IHRoaXMuc2VsZWN0ZWQsIGZpbGU6IHRoaXMuZmlsZX0pO1xyXG5cdFx0XHR9LCB0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZGVsYXkpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHJpdmF0ZSBwcmVwYXJlSXRlbXMoKSB7XHJcblxyXG5cdFx0XHRjb25zdCBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdHZhciBnZXRBdmFpbGFibGVTb3VyY2UgPSBmdW5jdGlvbiAodHlwZSA6IHN0cmluZywgc291cmNlIDogSVNvdXJjZSkge1xyXG5cclxuXHRcdFx0XHRpZiAoc291cmNlW3R5cGVdKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gc2VsZi5vcHRpb25zLmJhc2VVcmwgKyBzb3VyY2VbdHlwZV07XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodHlwZSA9PSAncGFuZWwnKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gc2VsZi5vcHRpb25zLmJhc2VVcmwgKyBnZXRBdmFpbGFibGVTb3VyY2UoJ2ltYWdlJywgc291cmNlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlID09ICdpbWFnZScpIHtcclxuXHRcdFx0XHRcdHJldHVybiBzZWxmLm9wdGlvbnMuYmFzZVVybCArIGdldEF2YWlsYWJsZVNvdXJjZSgnbW9kYWwnLCBzb3VyY2UpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH07XHJcblxyXG5cclxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHRoaXMuaXRlbXMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XHJcblxyXG5cdFx0XHRcdGlmICghdmFsdWUuc291cmNlKSB7XHJcblxyXG5cdFx0XHRcdFx0dmFsdWUuc291cmNlID0ge1xyXG5cdFx0XHRcdFx0XHRtb2RhbDogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UubW9kYWxdLFxyXG5cdFx0XHRcdFx0XHRwYW5lbDogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UucGFuZWxdLFxyXG5cdFx0XHRcdFx0XHRpbWFnZTogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5zb3VyY2UuaW1hZ2VdLFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgc291cmNlID0ge1xyXG5cdFx0XHRcdFx0bW9kYWw6IGdldEF2YWlsYWJsZVNvdXJjZSgnbW9kYWwnLCB2YWx1ZS5zb3VyY2UpLFxyXG5cdFx0XHRcdFx0cGFuZWw6IGdldEF2YWlsYWJsZVNvdXJjZSgncGFuZWwnLCB2YWx1ZS5zb3VyY2UpLFxyXG5cdFx0XHRcdFx0aW1hZ2U6IGdldEF2YWlsYWJsZVNvdXJjZSgnaW1hZ2UnLCB2YWx1ZS5zb3VyY2UpLFxyXG5cdFx0XHRcdH07XHJcblxyXG5cclxuXHRcdFx0XHRsZXQgcGFydHMgPSBzb3VyY2UubW9kYWwuc3BsaXQoJy8nKTtcclxuXHRcdFx0XHRsZXQgZmlsZW5hbWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRsZXQgdGl0bGUgPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRpdGxlXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdIDogZmlsZW5hbWU7XHJcblxyXG5cdFx0XHRcdGxldCBmaWxlID0ge1xyXG5cdFx0XHRcdFx0c291cmNlOiBzb3VyY2UsXHJcblx0XHRcdFx0XHR0aXRsZTogdGl0bGUsXHJcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5kZXNjcmlwdGlvbl0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA6IG51bGwsXHJcblx0XHRcdFx0XHRsb2FkZWQ6IHtcclxuXHRcdFx0XHRcdFx0bW9kYWw6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHRwYW5lbDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdGltYWdlOiBmYWxzZVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdHNlbGYuZmlsZXMucHVzaChmaWxlKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5sb2coJ2ltYWdlcycsIHRoaXMuZmlsZXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGhvdmVyUHJlbG9hZChpbmRleCA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dGhpcy5sb2FkSW1hZ2UoaW5kZXgpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gaW1hZ2UgcHJlbG9hZFxyXG5cdFx0cHJpdmF0ZSBwcmVsb2FkKHdhaXQ/IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkKTtcclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCArIDEpO1xyXG5cdFx0XHR9LCAod2FpdCAhPSB1bmRlZmluZWQpID8gd2FpdCA6IHRoaXMub3B0aW9ucy5wcmVsb2FkRGVsYXkpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgbm9ybWFsaXplKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR2YXIgbGFzdCA9IHRoaXMuZmlsZXMubGVuZ3RoIC0gMTtcclxuXHJcblx0XHRcdGlmIChpbmRleCA+IGxhc3QpIHtcclxuXHRcdFx0XHRyZXR1cm4gKGluZGV4IC0gbGFzdCkgLSAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoaW5kZXggPCAwKSB7XHJcblx0XHRcdFx0cmV0dXJuIGxhc3QgLSBNYXRoLmFicyhpbmRleCkgKyAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gaW5kZXg7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbG9hZEltYWdlcyhpbmRleGVzIDogQXJyYXk8bnVtYmVyPiwgdHlwZSA6IHN0cmluZykge1xyXG5cclxuXHRcdFx0aWYgKCFpbmRleGVzKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdGluZGV4ZXMuZm9yRWFjaCgoaW5kZXggOiBudW1iZXIpID0+IHtcclxuXHRcdFx0XHRzZWxmLmxvYWRJbWFnZShpbmRleCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGxvYWRJbWFnZShpbmRleD8gOiBudW1iZXIsIGNhbGxiYWNrPyA6IHt9KSB7XHJcblxyXG5cdFx0XHRpbmRleCA9IGluZGV4ID8gaW5kZXggOiB0aGlzLnNlbGVjdGVkO1xyXG5cdFx0XHRpbmRleCA9IHRoaXMubm9ybWFsaXplKGluZGV4KTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5maWxlc1tpbmRleF0pIHtcclxuXHRcdFx0XHR0aGlzLmxvZygnaW52YWxpZCBmaWxlIGluZGV4Jywge2luZGV4OiBpbmRleH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZFsnbW9kYWwnXSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0XHRpbWcuc3JjID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlWydpbWFnZSddO1xyXG5cdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWRbJ2ltYWdlJ10gPSB0cnVlO1xyXG5cclxuXHRcdFx0dmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0XHRpbWcuc3JjID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlWydtb2RhbCddO1xyXG5cdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWRbJ21vZGFsJ10gPSB0cnVlO1xyXG5cclxuXHRcdFx0dGhpcy5sb2coJ2xvYWQgaW1hZ2UnLCB7aW5kZXg6IGluZGV4LCBmaWxlOiB0aGlzLmZpbGV9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGlzIHNpbmdsZT9cclxuXHRcdHB1YmxpYyBnZXQgaXNTaW5nbGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlcy5sZW5ndGggPiAxID8gZmFsc2UgOiB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZSBkb3dubG9hZCBsaW5rXHJcblx0XHRwdWJsaWMgZG93bmxvYWRMaW5rKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuc2VsZWN0ZWQgIT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucy5iYXNlVXJsICsgdGhpcy5maWxlc1t0aGlzLnNlbGVjdGVkXVt0aGlzLm9wdGlvbnMuZmllbGRzLnNvdXJjZS5tb2RhbF07XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHRoZSBmaWxlXHJcblx0XHRwdWJsaWMgZ2V0IGZpbGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlc1t0aGlzLnNlbGVjdGVkXTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgZ2V0IG1vZGFsVmlzaWJsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLl92aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZW1lXHJcblx0XHRwdWJsaWMgZ2V0IHRoZW1lKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucy50aGVtZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHNldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgc2V0IG1vZGFsVmlzaWJsZSh2YWx1ZSA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcclxuXHJcblx0XHRcdGlmICh2YWx1ZSkge1xyXG5cclxuXHRcdFx0XHR0aGlzLnByZWxvYWQoMSk7XHJcblx0XHRcdFx0dGhpcy5tb2RhbEluaXQoKTtcclxuXHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKS5hZGRDbGFzcygneWhpZGRlbicpO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKS5yZW1vdmVDbGFzcygneWhpZGRlbicpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGUgZm9jdXNcclxuXHRcdHB1YmxpYyBzZXRGb2N1cygpIHtcclxuXHJcblx0XHRcdGFuZ3VsYXIuZWxlbWVudCgnLmFzZy1tb2RhbC4nICsgdGhpcy5pZCArICcgLmtleUlucHV0JykudHJpZ2dlcignZm9jdXMnKS5mb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gaW5pdGlhbGl6ZSB0aGUgZ2FsbGVyeVxyXG5cdFx0cHJpdmF0ZSBtb2RhbEluaXQoKSB7XHJcblxyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cclxuXHRcdFx0XHQvLyBzdWJtZW51IGNsaWNrIGV2ZW50c1xyXG5cdFx0XHRcdHZhciBlbGVtZW50ID0gJy5nYWxsZXJ5LW1vZGFsLicgKyBzZWxmLmlkICsgJyBsaS5kcm9wZG93bi1zdWJtZW51JztcclxuXHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCkub2ZmKCkub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHRcdGlmIChhbmd1bGFyLmVsZW1lbnQodGhpcykuaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG5cdFx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQodGhpcykuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0c2VsZi5zZXRGb2N1cygpO1xyXG5cclxuXHRcdFx0fSwgMTAwKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBtb2RhbE9wZW4oaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleCA/IGluZGV4IDogdGhpcy5zZWxlY3RlZDtcclxuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgbW9kYWxDbG9zZSgpIHtcclxuXHJcblx0XHRcdHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwcml2YXRlIGxvZyhldmVudCA6IHN0cmluZywgZGF0YT8gOiBhbnkpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZGVidWcpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnQVNHIHwgJyArIHRoaXMuaWQgKyAnIDogJyArIGV2ZW50LCBkYXRhID8gZGF0YSA6IG51bGwpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0fVxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5zZXJ2aWNlKCdhc2dTZXJ2aWNlJywgW1wiJHRpbWVvdXRcIiwgXCIkaW50ZXJ2YWxcIiwgU2VydmljZUNvbnRyb2xsZXJdKTtcclxuXHJcbn1cclxuXHJcbiJdfQ==

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/asg-image.html','<div class="asg-image {{ $ctrl.asg.theme }}" data-ng-style="{\'height\' : $ctrl.asg.options.image.height}">\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" data-ng-swipe-left="$ctrl.asg.toForward()" data-ng-swipe-right="$ctrl.asg.toBackward()">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.asg.files" data-ng-show="$ctrl.asg.selected == key" data-ng-class="{\'loading\' : !file.loaded.image}">\r\n\r\n\t\t\t<img class="img-responsive source" data-ng-if="file.loaded.image" data-ng-class="{ wide : $ctrl.config.wide }" data-ng-src="{{ file.source.image }}" data-ng-mouseover="$ctrl.asg.hoverPreload(key)" data-ng-click="$ctrl.asg.modalOpen()">\r\n\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>\r\n\r\n\r\n\r\n\r\n');
$templateCache.put('views/asg-modal.html','<script type="text/ng-template" id="help.html">\r\n\tSPACE : forward</br>\r\n\tRIGHT : forward</br>\r\n\tLEFT : backward</br>\r\n\tUP / HOME : first</br>\r\n\tDOWN / END : last</br>\r\n\tESC : exit</br>\r\n\tP : play/pause</br>\r\n\tF / ENTER : toggle fullscreen</br>\r\n\tM : toggle menu</br>\r\n\tW : toggle wide screen</br>\r\n\tC : toggle caption</br>\r\n\tH : toggle help\r\n</script>\r\n\r\n<div class="asg-modal {{ $ctrl.id }}" data-ng-class="$ctrl.getClass()" data-ng-click="$ctrl.asg.setFocus()" data-ng-show="$ctrl.asg.modalVisible" data-ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" data-ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="header">\r\n\r\n        <span class="buttons pull-right visible-sm visible-md visible-lg">\r\n\r\n\t\t\t   <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.autoPlayToggle()">\r\n                    <span data-ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t\t\t\t   <span data-ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toFirst(true)">\r\n                    {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toBackward(true)">\r\n                    <span class="glyphicon glyphicon-chevron-left"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toForward(true)">\r\n                    <span class="glyphicon glyphicon-chevron-right"></span>\r\n                </button>\r\n\r\n             <span data-ng-if="!$ctrl.asg.isSingle && false" class="dropdown">\r\n                    <button class="btn btn-default btn-sm dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                        <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu pull-right">\r\n                        <li class="dropdown-submenu">\r\n                            <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.asg.transitions">\r\n                                    <span data-ng-class="{\'highlight\' : transition == $ctrl.config.transition}">\r\n                                        {{ transition }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTheme(theme)" data-ng-repeat="theme in $ctrl.themes">\r\n                                    <span data-ng-class="{\'highlight\' : theme == $ctrl.asg.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                        <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                    </ul>\r\n                </span>\r\n\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleMenu()">\r\n                    <span data-ng-if="$ctrl.config.menu" class="glyphicon glyphicon-chevron-up"></span>\r\n                    <span data-ng-if="!$ctrl.config.menu" class="glyphicon glyphicon-chevron-down"></span>\r\n                </button>\r\n\r\n\t\t\t \t<button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleWide()">\r\n                    <span class="glyphicon glyphicon-resize-horizontal"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleFullScreen()">\r\n                    <span class="glyphicon glyphicon-fullscreen"></span>\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleHelp()">\r\n                    <span class="glyphicon glyphicon-question-sign"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.modalClose()">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n\r\n            </span>\r\n\r\n\t\t<span class="buttons pull-right visible-xs">\r\n\r\n\r\n\t\t\t\t \t<button data-ng-if="!$ctrl.asg.isSingle && $ctrl.asg.options.autoplay.enabled" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.autoPlayStop()">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-stop"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t   <button data-ng-if="!$ctrl.asg.isSingle && !$ctrl.asg.options.autoplay.enabled" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.autoPlayStart()">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-play"></span>\r\n\t\t\t\t   </button>\r\n\r\n                    <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.toFirst(true)">\r\n                        {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n                    </button>\r\n\r\n                    <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.toBackward(true)">\r\n                        <span class="glyphicon glyphicon-chevron-left"></span>\r\n                    </button>\r\n\r\n                    <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.toForward(true)">\r\n                        <span class="glyphicon glyphicon-chevron-right"></span>\r\n                    </button>\r\n\r\n                    <span data-ng-if="!$ctrl.asg.isSingle && false" class="dropdown">\r\n                        <button class="btn btn-default btn-xs dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                            <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                        </button>\r\n                        <ul class="dropdown-menu pull-right">\r\n                            <li class="dropdown-submenu">\r\n                                <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                                <ul class="dropdown-menu">\r\n                                    <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.transitions">\r\n                                        <span data-ng-class="{\'highlight\' : transition == $ctrl.transition}">\r\n                                            {{ transition }}</span></a>\r\n                                    </li>\r\n                                </ul>\r\n                            </li>\r\n\t\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTheme(theme)" data-ng-repeat="theme in $ctrl.themes">\r\n                                    <span data-ng-class="{\'highlight\' : theme == $ctrl.asg.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                            <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                        </ul>\r\n                    </span>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleMenu()">\r\n                        <span data-ng-if="$ctrl.config.header" class="glyphicon glyphicon-chevron-up"></span>\r\n                        <span data-ng-if="!$ctrl.config.header" class="glyphicon glyphicon-chevron-down"></span>\r\n                    </button>\r\n\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleWide()">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-resize-horizontal"></span>\r\n\t\t\t\t\t</button>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleFullScreen()">\r\n                        <span class="glyphicon glyphicon-fullscreen"></span>\r\n                    </button>\r\n\r\n\t\t\t  \t\t<button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleHelp()">\r\n                        <span class="glyphicon glyphicon-question-sign"></span>\r\n                    </button>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.modalClose()">\r\n                        <span class="glyphicon glyphicon-remove"></span>\r\n                    </button>\r\n\r\n                </span>\r\n\r\n\t\t<span data-ng-if="$ctrl.config.title">\r\n\t\t\t<span class="title">{{ $ctrl.config.title }}</span>\r\n\t\t\t<span class="subtitle" data-ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span>\r\n\t\t</span>\r\n\r\n\t</div>\r\n\r\n\t<div class="help text-right" data-ng-click="$ctrl.toggleHelp()" data-ng-show="$ctrl.config.help" data-ng-include src="\'help.html\'"></div>\r\n\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}" data-ng-mouseover="$ctrl.arrowsShow()" data-ng-mouseleave="$ctrl.arrowsHide()" data-ng-swipe-left="$ctrl.asg.toForward(true)" data-ng-swipe-right="$ctrl.asg.toBackward(true)">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.asg.files" data-ng-show="$ctrl.asg.selected == key" data-ng-class="{\'loading\' : !file.loaded.modal}">\r\n\r\n\t\t\t<img class="source" data-ng-class="{ wide : $ctrl.config.wide }" data-ng-src="{{ file.source.modal }}" data-ng-if="file.loaded.modal">\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.asg.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toBackward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.asg.toBackward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" data-ng-click="$ctrl.asg.toBackward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-sm pull-left visible-xs" data-ng-click="$ctrl.asg.toBackward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.asg.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toForward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.asg.toForward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" data-ng-click="$ctrl.asg.toForward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-sm pull-right visible-xs" data-ng-click="$ctrl.asg.toForward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-show="$ctrl.arrowsVisible" class="functions">\r\n\t\t</div>\r\n\r\n\t</div>\r\n\r\n\r\n\t<div class="caption" data-ng-if="$ctrl.config.caption">\r\n\t\t<div class="content">\r\n\t\t\t<span class="title">{{ $ctrl.asg.file.title }}</span>\r\n\t\t\t<span data-ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description"> - </span>\r\n\t\t\t<span class="description">{{ $ctrl.asg.file.description }}</span>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>');
$templateCache.put('views/asg-panel.html','<div class="asg-panel {{ $ctrl.asg.theme }}">\r\n\r\n\t<div data-ng-repeat="(key,file) in $ctrl.asg.files" class="item {{ $ctrl.asg.options.panel.item.class }}" data-ng-class="{\'selected\' : $ctrl.asg.selected == key}" data-ng-mouseover="indexShow = true" data-ng-mouseleave="indexShow = false">\r\n\r\n\t\t<img data-ng-src="{{ file.source.panel }}" data-ng-click="$ctrl.asg.setSelected(key)" data-ng-mouseover="$ctrl.asg.hoverPreload(key)" alt="{{ file.title }}">\r\n\t\t<span class="index" data-ng-if="$ctrl.config.item.index && indexShow">{{ key + 1 }}</span>\r\n\r\n\t\t<div class="caption" data-ng-if="$ctrl.config.item.caption">\r\n\t\t\t<span>{{ file.title }}</span>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>');}]);