/**
 * angular-super-gallery - Super Angular image gallery
 * 
 * @version v0.1.4
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
        }
        ImageController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this);
        };
        Object.defineProperty(ImageController.prototype, "config", {
            get: function () {
                return this.asg.options.image;
            },
            set: function (value) {
                this.asg.options.image = value;
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
        ModalController.prototype.keyUp = function (e) {
            if (e.keyCode == 27) {
                this.asg.modalClose();
            }
            if (e.keyCode == 80) {
                this.asg.autoPlayToggle();
            }
            if (e.keyCode == 32) {
                this.asg.toForward(true);
            }
            if (e.keyCode == 37) {
                this.asg.toBackward(true);
            }
            if (e.keyCode == 39) {
                this.asg.toForward(true);
            }
            if (e.keyCode == 38 || e.keyCode == 36) {
                this.asg.toFirst(true);
            }
            if (e.keyCode == 40 || e.keyCode == 35) {
                this.asg.toLast(true);
            }
            if (e.keyCode == 70 || e.keyCode == 13) {
                this.toggleFullScreen();
            }
            if (e.keyCode == 77) {
                this.toggleMenu();
            }
            if (e.keyCode == 67) {
                this.toggleCaption();
            }
            if (e.keyCode == 72) {
                this.toggleHelp();
            }
            if (e.keyCode == 87) {
                this.toggleWide();
            }
            if (e.keyCode == 84) {
                this.nextTransition();
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
                return this.asg.options.modal;
            },
            set: function (value) {
                this.asg.options.modal = value;
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
        }
        PanelController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this);
            console.log(this.asg);
        };
        Object.defineProperty(PanelController.prototype, "config", {
            get: function () {
                return this.asg.options.panel;
            },
            set: function (value) {
                this.asg.options.panel = value;
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
            this.selected = 0;
            this.options = {};
            this.defaults = {
                baseUrl: "",
                fields: {
                    url: "url",
                    title: "title",
                    description: "description",
                    thumbnail: "thumbnail"
                },
                autoplay: {
                    enabled: false,
                    delay: 4100
                },
                theme: 'default',
                preload: [0],
                modal: {
                    title: "",
                    subtitle: "",
                    caption: true,
                    menu: true,
                    help: false,
                    transition: 'rotateLR',
                    wide: false
                },
                panel: {
                    item: {
                        class: 'col-md-3'
                    },
                },
                image: {
                    transition: 'rotateLR',
                    wide: false,
                    height: 300
                }
            };
            this.instances = {};
            this._visible = false;
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
        ServiceController.prototype.getInstance = function (asg) {
            var id = asg.id;
            var instance = this.instances[id];
            if (instance == undefined) {
                instance = new ServiceController(this.timeout, this.interval);
                instance.id = id;
            }
            instance.setOptions(asg.options);
            instance.setItems(asg.items);
            instance.loadImages(instance.options.preload);
            instance.selected = asg.selected ? asg.selected : 0;
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
            if (this.options.autoplay.enabled) {
                this.autoPlayStart();
            }
            options = this.options;
            return this.options;
        };
        ServiceController.prototype.setSelected = function (index) {
            this.autoPlayStop();
            this.direction = index > this.selected ? 'forward' : 'backward';
            this.selected = this.normalize(index);
            this.preload();
        };
        ServiceController.prototype.toBackward = function (stop) {
            stop && this.autoPlayStop();
            this.direction = 'backward';
            this.selected = this.normalize(--this.selected);
            this.preload();
        };
        ServiceController.prototype.toForward = function (stop) {
            stop && this.autoPlayStop();
            this.direction = 'forward';
            this.selected = this.normalize(++this.selected);
            this.preload();
        };
        ServiceController.prototype.toFirst = function (stop) {
            stop && this.autoPlayStop();
            this.direction = 'backward';
            this.selected = 0;
            this.preload();
        };
        ServiceController.prototype.toLast = function (stop) {
            stop && this.autoPlayStop();
            this.direction = 'forward';
            this.selected = this.items.length - 1;
            this.preload();
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
            }, this.options.autoplay.delay);
        };
        ServiceController.prototype.prepareItems = function () {
            var self = this;
            angular.forEach(this.items, function (value, key) {
                var url = self.options.baseUrl + value[self.options.fields.url];
                var thumbnail = self.options.baseUrl + (value[self.options.fields.thumbnail] ? value[self.options.fields.thumbnail] : value[self.options.fields.url]);
                var parts = url.split('/');
                var filename = parts[parts.length - 1];
                var title = value[self.options.fields.title] ? value[self.options.fields.title] : filename;
                var file = {
                    url: url,
                    thumbnail: thumbnail,
                    title: title,
                    description: value[self.options.fields.description] ? value[self.options.fields.description] : null,
                    loaded: false
                };
                self.files.push(file);
            });
        };
        ServiceController.prototype.preload = function (wait) {
            var _this = this;
            this.timeout(function () {
                _this.loadImage(_this.selected);
                _this.loadImage(0);
                _this.loadImage(_this.selected + 1);
                _this.loadImage(_this.selected - 1);
                _this.loadImage(_this.selected + 2);
                _this.loadImage(_this.files.length - 1);
            }, (wait != undefined) ? wait : 770);
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
        ServiceController.prototype.loadImages = function (indexes) {
            if (!indexes) {
                return;
            }
            var self = this;
            indexes.forEach(function (index) {
                self.loadImage(index);
            });
        };
        ServiceController.prototype.loadImage = function (index) {
            index = this.normalize(index);
            if (!this.files[index]) {
                console.warn('Invalid file index: ' + index);
                return;
            }
            if (this.files[index].loaded) {
                return;
            }
            var img = new Image();
            img.src = this.files[index].url;
            this.files[index].loaded = true;
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
                return this.options.baseUrl + this.files[this.selected][this.options.fields.url];
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
                    this.modalInit();
                    this.preload(1);
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
        return ServiceController;
    }());
    ASG.ServiceController = ServiceController;
    var app = angular.module('angularSuperGallery');
    app.service('asgService', ["$timeout", "$interval", ServiceController]);
})(ASG || (ASG = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hc2cudHMiLCJzcmMvYXNnLWltYWdlLnRzIiwic3JjL2FzZy1tb2RhbC50cyIsInNyYy9hc2ctcGFuZWwudHMiLCJzcmMvYXNnLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBTyxHQUFHLENBbUJUO0FBbkJELFdBQU8sR0FBRztJQUVULElBQUksR0FBRyxHQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUU1RSxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtRQUN0QixNQUFNLENBQUMsVUFBVSxLQUFXLEVBQUUsU0FBa0I7WUFFL0MsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUE7WUFDM0QsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsQ0FBQztnQkFBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBRXBELElBQUksS0FBSyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFDbEQsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFdkQsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFT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YyxFQUFFLENBQUM7WUFDM0IsQ0FBQztZQUdELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUIsQ0FBQztZQUdELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsQ0FBQztZQUdELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUIsQ0FBQztZQUdELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUdELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkIsQ0FBQztZQUdELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDekIsQ0FBQztZQUdELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckIs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InNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBBU0cge1xyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5JywgWyduZ0FuaW1hdGUnXSk7XHJcblxyXG5cdGFwcC5maWx0ZXIoJ2FzZ0J5dGVzJywgKCkgPT4ge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChieXRlcyA6IGFueSwgcHJlY2lzaW9uIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRpZiAoaXNOYU4ocGFyc2VGbG9hdChieXRlcykpIHx8ICFpc0Zpbml0ZShieXRlcykpIHJldHVybiAnJ1xyXG5cdFx0XHRpZiAoYnl0ZXMgPT09IDApIHJldHVybiAnMCc7XHJcblx0XHRcdGlmICh0eXBlb2YgcHJlY2lzaW9uID09PSAndW5kZWZpbmVkJykgcHJlY2lzaW9uID0gMTtcclxuXHJcblx0XHRcdHZhciB1bml0cyA9IFsnYnl0ZXMnLCAna0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInXSxcclxuXHRcdFx0XHRudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgubG9nKGJ5dGVzKSAvIE1hdGgubG9nKDEwMjQpKTtcclxuXHJcblx0XHRcdHJldHVybiAoYnl0ZXMgLyBNYXRoLnBvdygxMDI0LCBNYXRoLmZsb29yKG51bWJlcikpKS50b0ZpeGVkKHByZWNpc2lvbikgKyAnICcgKyB1bml0c1tudW1iZXJdO1xyXG5cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuXHJcbiIsIm1vZHVsZSBBU0cge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgSW1hZ2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIHNlbGVjdGVkIDogbnVtYmVyO1xyXG5cclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcikge1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgaW1hZ2UgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9ucy5pbWFnZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IGltYWdlIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc0ltYWdlKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zLmltYWdlID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdHZhciBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudChcImFzZ0ltYWdlXCIsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFtcImFzZ1NlcnZpY2VcIiwgQVNHLkltYWdlQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FzZy1pbWFnZS5odG1sJyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiBcIkBcIixcclxuXHRcdFx0aXRlbXM6ICc9PycsXHJcblx0XHRcdG9wdGlvbnM6ICc9PycsXHJcblx0XHRcdHNlbGVjdGVkOiAnPT8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxufSIsIm1vZHVsZSBBU0cge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgTW9kYWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIHNlbGVjdGVkIDogbnVtYmVyO1xyXG5cclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdHByaXZhdGUgX2Z1bGxzY3JlZW4gOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHRwcml2YXRlIF92aXNpYmxlIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBhcnJvd3NWaXNpYmxlIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcixcclxuXHRcdFx0XHRcdHByaXZhdGUgZnVsbHNjcmVlbikge1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZVxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgZ2V0Q2xhc3MoKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuY29uZmlnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgbmdDbGFzcyA9IFtdO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmNvbmZpZy5tZW51KSB7XHJcblx0XHRcdFx0bmdDbGFzcy5wdXNoKCdub21lbnUnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bmdDbGFzcy5wdXNoKHRoaXMuYXNnLm9wdGlvbnMudGhlbWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIG5nQ2xhc3Muam9pbignICcpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8ga2V5bWFwXHJcblx0XHRwdWJsaWMga2V5VXAoZSA6IEtleWJvYXJkRXZlbnQpIHtcclxuXHJcblx0XHRcdC8vIGVzY1xyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDI3KSB7XHJcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxDbG9zZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBwbGF5L3BhdXNlXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gODApIHtcclxuXHRcdFx0XHR0aGlzLmFzZy5hdXRvUGxheVRvZ2dsZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBzcGFjZVxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDMyKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBsZWZ0XHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzcpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyByaWdodFxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDM5KSB7XHJcblx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyB1cFxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDM4IHx8IGUua2V5Q29kZSA9PSAzNikge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnRvRmlyc3QodHJ1ZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGRvd25cclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSA0MCB8fCBlLmtleUNvZGUgPT0gMzUpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0xhc3QodHJ1ZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGYgLSBmdWxsc2NyZWVuXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gNzAgfHwgZS5rZXlDb2RlID09IDEzKSB7XHJcblx0XHRcdFx0dGhpcy50b2dnbGVGdWxsU2NyZWVuKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIG0gLSBtZW51XHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gNzcpIHtcclxuXHRcdFx0XHR0aGlzLnRvZ2dsZU1lbnUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gYyAtIGNhcHRpb25cclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSA2Nykge1xyXG5cdFx0XHRcdHRoaXMudG9nZ2xlQ2FwdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBoIC0gaGVscFxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDcyKSB7XHJcblx0XHRcdFx0dGhpcy50b2dnbGVIZWxwKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHcgLSB3aWRlIHNjZWVlbiAoaW1hZ2UgZml0IHRvIGltYWdlcyBjb250YWluZXIpXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gODcpIHtcclxuXHRcdFx0XHR0aGlzLnRvZ2dsZVdpZGUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gdCAtIHRyYW5zaXRpb24gbmV4dFxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDg0KSB7XHJcblx0XHRcdFx0dGhpcy5uZXh0VHJhbnNpdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBzd2l0Y2ggdG8gbmV4dCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHJpdmF0ZSBuZXh0VHJhbnNpdGlvbigpIHtcclxuXHJcblx0XHRcdHZhciBpZHggPSB0aGlzLmFzZy50cmFuc2l0aW9ucy5pbmRleE9mKHRoaXMuY29uZmlnLnRyYW5zaXRpb24pICsgMTtcclxuXHRcdFx0dmFyIG5leHQgPSBpZHggPj0gdGhpcy5hc2cudHJhbnNpdGlvbnMubGVuZ3RoID8gMCA6IGlkeDtcclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRoaXMuYXNnLnRyYW5zaXRpb25zW25leHRdO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGZ1bGxzY3JlZW5cclxuXHRcdHByaXZhdGUgdG9nZ2xlRnVsbFNjcmVlbigpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmZ1bGxzY3JlZW4uaXNFbmFibGVkKCkpIHtcclxuXHRcdFx0XHR0aGlzLmZ1bGxzY3JlZW4uY2FuY2VsKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5mdWxsc2NyZWVuLmFsbCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHVibGljIHNldFRyYW5zaXRpb24odHJhbnNpdGlvbikge1xyXG5cclxuXHRcdFx0dGhpcy5jb25maWcudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGVtZVxyXG5cdFx0cHVibGljIHNldFRoZW1lKHRoZW1lIDogc3RyaW5nKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zLnRoZW1lID0gdGhlbWU7XHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG92ZXJsYXkgYXJyb3dzIGhpZGVcclxuXHRcdHB1YmxpYyBhcnJvd3NIaWRlKCkge1xyXG5cclxuXHRcdFx0dGhpcy5hcnJvd3NWaXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG92ZXJsYXkgYXJyb3dzIHNob3dcclxuXHRcdHB1YmxpYyBhcnJvd3NTaG93KCkge1xyXG5cclxuXHRcdFx0dGhpcy5hcnJvd3NWaXNpYmxlID0gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGhlbHBcclxuXHRcdHByaXZhdGUgdG9nZ2xlSGVscCgpIHtcclxuXHJcblx0XHRcdHRoaXMuY29uZmlnLmhlbHAgPSAhdGhpcy5jb25maWcuaGVscDtcclxuXHRcdFx0dGhpcy5hc2cuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHRvZ2dsZSB3aWRlXHJcblx0XHRwcml2YXRlIHRvZ2dsZVdpZGUoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmNvbmZpZy53aWRlID0gIXRoaXMuY29uZmlnLndpZGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyB0b2dnbGUgbWVudVxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVNZW51KCkge1xyXG5cclxuXHRcdFx0dGhpcy5jb25maWcubWVudSA9ICF0aGlzLmNvbmZpZy5tZW51O1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgY2FwdGlvblxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVDYXB0aW9uKCkge1xyXG5cclxuXHRcdFx0dGhpcy5jb25maWcuY2FwdGlvbiA9ICF0aGlzLmNvbmZpZy5jYXB0aW9uO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbW9kYWwgdmlzaWJsZVxyXG5cdFx0cHVibGljIGdldCB2aXNpYmxlKCkge1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmFzZykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm1vZGFsVmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IG1vZGFsIHZpc2libGVcclxuXHRcdHB1YmxpYyBzZXQgdmlzaWJsZSh2YWx1ZSA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYXNnLm1vZGFsVmlzaWJsZSA9IHZhbHVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgbW9kYWwgY29uZmlnXHJcblx0XHRwdWJsaWMgZ2V0IGNvbmZpZygpIDogSU9wdGlvbnNNb2RhbCB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5hc2cub3B0aW9ucy5tb2RhbDtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IG1vZGFsIGNvbmZpZ1xyXG5cdFx0cHVibGljIHNldCBjb25maWcodmFsdWUgOiBJT3B0aW9uc01vZGFsKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zLm1vZGFsID0gdmFsdWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoXCJhc2dNb2RhbFwiLCB7XHJcblx0XHRjb250cm9sbGVyOiBbXCJhc2dTZXJ2aWNlXCIsIFwiRnVsbHNjcmVlblwiLCBBU0cuTW9kYWxDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLW1vZGFsLmh0bWwnLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6IFwiQFwiLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PycsXHJcblx0XHRcdHZpc2libGU6IFwiPT9cIlxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufSIsIm1vZHVsZSBBU0cge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgUGFuZWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgb3B0aW9ucyA6IElPcHRpb25zO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIHNlbGVjdGVkIDogbnVtYmVyO1xyXG5cclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcikge1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdC8vIGdldCBzZXJ2aWNlIGluc3RhbmNlXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyh0aGlzLmFzZyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCBwYW5lbCBjb25maWdcclxuXHRcdHB1YmxpYyBnZXQgY29uZmlnKCkgOiBJT3B0aW9uc1BhbmVsIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5vcHRpb25zLnBhbmVsO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgcGFuZWwgY29uZmlnXHJcblx0XHRwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZSA6IElPcHRpb25zUGFuZWwpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnMucGFuZWwgPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0dmFyIGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KFwiYXNnUGFuZWxcIiwge1xyXG5cdFx0Y29udHJvbGxlcjogW1wiYXNnU2VydmljZVwiLCBBU0cuUGFuZWxDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLXBhbmVsLmh0bWwnLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6IFwiQFwiLFxyXG5cdFx0XHRpdGVtczogJz0/JyxcclxuXHRcdFx0b3B0aW9uczogJz0/JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc9PydcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5tb2R1bGUgQVNHIHtcclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uc01vZGFsIHtcclxuXHJcblx0XHRtZW51PyA6IGJvb2xlYW47XHJcblx0XHRoZWxwPyA6IGJvb2xlYW47XHJcblx0XHRjYXB0aW9uPyA6IGJvb2xlYW47XHJcblx0XHR0cmFuc2l0aW9uPyA6IHN0cmluZztcclxuXHRcdHRpdGxlPyA6IHN0cmluZztcclxuXHRcdHN1YnRpdGxlPyA6IHN0cmluZztcclxuXHRcdHdpZGU/IDogYm9vbGVhbjtcclxuXHJcblx0fVxyXG5cclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zUGFuZWwge1xyXG5cclxuXHRcdGl0ZW0/IDoge1xyXG5cdFx0XHRjbGFzcz8gOiBzdHJpbmc7XHJcblx0XHR9LFxyXG5cclxuXHR9XHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnNJbWFnZSB7XHJcblxyXG5cdFx0dHJhbnNpdGlvbj8gOiBzdHJpbmc7XHJcblx0XHRoZWlnaHQ/IDogbnVtYmVyO1xyXG5cdFx0d2lkZT8gOiBib29sZWFuO1xyXG5cclxuXHR9XHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xyXG5cclxuXHRcdGJhc2VVcmw/IDogc3RyaW5nO1xyXG5cdFx0ZmllbGRzPyA6IHtcclxuXHRcdFx0dXJsPyA6IHN0cmluZztcclxuXHRcdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0XHRkZXNjcmlwdGlvbj8gOiBzdHJpbmc7XHJcblx0XHRcdHRodW1ibmFpbD8gOiBzdHJpbmc7XHJcblx0XHR9LFxyXG5cdFx0YXV0b3BsYXk/IDoge1xyXG5cdFx0XHRlbmFibGVkPyA6IGJvb2xlYW47XHJcblx0XHRcdGRlbGF5PyA6IG51bWJlcjtcclxuXHRcdH0sXHJcblx0XHR0aGVtZT8gOiBzdHJpbmc7XHJcblx0XHRwcmVsb2FkPyA6IEFycmF5PG51bWJlcj47XHJcblx0XHRtb2RhbD8gOiBJT3B0aW9uc01vZGFsO1xyXG5cdFx0cGFuZWw/IDogSU9wdGlvbnNQYW5lbDtcclxuXHRcdGltYWdlPyA6IElPcHRpb25zSW1hZ2U7XHJcblxyXG5cdH1cclxuXHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUZpbGUge1xyXG5cclxuXHRcdHVybCA6IHN0cmluZztcclxuXHRcdHRpdGxlPyA6IHN0cmluZztcclxuXHRcdGRlc2NyaXB0aW9uPyA6IHN0cmluZztcclxuXHRcdHRodW1ibmFpbD8gOiBzdHJpbmc7XHJcblx0XHRsb2FkZWQ/IDogYm9vbGVhbjtcclxuXHRcdHNpemU/IDogbnVtYmVyO1xyXG5cdFx0d2lkdGg/IDogbnVtYmVyO1xyXG5cdFx0aGVpZ2h0PyA6IG51bWJlcjtcclxuXHJcblx0fVxyXG5cclxuXHRleHBvcnQgaW50ZXJmYWNlIElTZXJ2aWNlQ29udHJvbGxlciB7XHJcblxyXG5cdFx0Z2V0SW5zdGFuY2UoaWQgOiBhbnkpIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0c2V0RGVmYXVsdHMoKSA6IHZvaWQ7XHJcblx0XHRzZXRPcHRpb25zKG9wdGlvbnMgOiBJT3B0aW9ucykgOiBJT3B0aW9ucztcclxuXHRcdHNldEl0ZW1zKGl0ZW1zIDogQXJyYXk8SUZpbGU+KSA6IHZvaWQ7XHJcblx0XHRwcmVsb2FkKHdhaXQ/IDogbnVtYmVyKSA6IHZvaWQ7XHJcblx0XHRub3JtYWxpemUoaW5kZXggOiBudW1iZXIpIDogbnVtYmVyO1xyXG5cdFx0c2V0Rm9jdXMoKSA6IHZvaWQ7XHJcblx0XHRtb2RhbE9wZW4oaW5kZXggOiBudW1iZXIpIDogdm9pZDtcclxuXHRcdG1vZGFsQ2xvc2UoKSA6IHZvaWQ7XHJcblx0XHR0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cdFx0dG9Gb3J3YXJkKHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cdFx0dG9GaXJzdChzdG9wPyA6IGJvb2xlYW4pIDogdm9pZDtcclxuXHRcdHRvTGFzdChzdG9wPyA6IGJvb2xlYW4pIDogdm9pZDtcclxuXHRcdGxvYWRJbWFnZXMoaW5kZXhlcyA6IEFycmF5PG51bWJlcj4pIDogdm9pZDtcclxuXHRcdGF1dG9QbGF5VG9nZ2xlKCkgOiB2b2lkO1xyXG5cdFx0bW9kYWxWaXNpYmxlIDogYm9vbGVhbjtcclxuXHRcdHRyYW5zaXRpb25zIDogQXJyYXk8c3RyaW5nPjtcclxuXHRcdHRoZW1lcyA6IEFycmF5PHN0cmluZz47XHJcblx0XHRvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHRcdHNlbGVjdGVkIDogbnVtYmVyO1xyXG5cclxuXHR9XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBTZXJ2aWNlQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogYW55O1xyXG5cdFx0cHVibGljIGZpbGVzIDogQXJyYXk8SUZpbGU+ID0gW107XHJcblx0XHRwdWJsaWMgc2VsZWN0ZWQgOiBudW1iZXIgPSAwO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucyA9IHt9O1xyXG5cdFx0cHVibGljIGRlZmF1bHRzIDogSU9wdGlvbnMgPSB7XHJcblx0XHRcdGJhc2VVcmw6IFwiXCIsIC8vIHVybCBwcmVmaXhcclxuXHRcdFx0ZmllbGRzOiB7XHJcblx0XHRcdFx0dXJsOiBcInVybFwiLCAvLyB1cmwgaW5wdXQgZmllbGQgbmFtZVxyXG5cdFx0XHRcdHRpdGxlOiBcInRpdGxlXCIsIC8vIHRpdGxlIGlucHV0IGZpZWxkIG5hbWVcclxuXHRcdFx0XHRkZXNjcmlwdGlvbjogXCJkZXNjcmlwdGlvblwiLCAvLyBkZXNjcmlwdGlvbiBpbnB1dCBmaWVsZCBuYW1lXHJcblx0XHRcdFx0dGh1bWJuYWlsOiBcInRodW1ibmFpbFwiIC8vIHRodW1ibmFpbCBpbnB1dCBmaWVsZCBuYW1lXHJcblx0XHRcdH0sXHJcblx0XHRcdGF1dG9wbGF5OiB7XHJcblx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsIC8vIHNsaWRlc2hvdyBhdXRvcGxheSBlbmFibGVkL2Rpc2FibGVkXHJcblx0XHRcdFx0ZGVsYXk6IDQxMDAgLy8gYXV0b3BsYXkgZGVsYXkgaW4gbWlsbGlzZWNvbmRcclxuXHRcdFx0fSxcclxuXHRcdFx0dGhlbWU6ICdkZWZhdWx0JywgLy8gY3NzIHN0eWxlIFtkZWZhdWx0LCBkYXJrYmx1ZSwgd2hpdGVnb2xkXVxyXG5cdFx0XHRwcmVsb2FkOiBbMF0sIC8vIHByZWxvYWQgaW1hZ2VzIGJ5IGluZGV4IG51bWJlclxyXG5cdFx0XHRtb2RhbDoge1xyXG5cdFx0XHRcdHRpdGxlOiBcIlwiLCAvLyBtb2RhbCB3aW5kb3cgdGl0bGVcclxuXHRcdFx0XHRzdWJ0aXRsZTogXCJcIiwgLy8gbW9kYWwgd2luZG93IHN1YnRpdGxlXHJcblx0XHRcdFx0Y2FwdGlvbjogdHJ1ZSwgLy8gc2hvdy9oaWRlIGltYWdlIGNhcHRpb25cclxuXHRcdFx0XHRtZW51OiB0cnVlLCAvLyBzaG93L2hpZGUgbW9kYWwgbWVudVxyXG5cdFx0XHRcdGhlbHA6IGZhbHNlLCAvLyBzaG93L2hpZGUgaGVscFxyXG5cdFx0XHRcdHRyYW5zaXRpb246ICdyb3RhdGVMUicsIC8vIHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRcdFx0d2lkZTogZmFsc2UgLy8gZW5hYmxlL2Rpc2FibGUgd2lkZSBpbWFnZSBkaXNwbGF5IG1vZGVcclxuXHRcdFx0fSxcclxuXHRcdFx0cGFuZWw6IHtcclxuXHRcdFx0XHRpdGVtOiB7XHJcblx0XHRcdFx0XHRjbGFzczogJ2NvbC1tZC0zJyAvLyBpdGVtIGNsYXNzXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fSxcclxuXHRcdFx0aW1hZ2U6IHtcclxuXHRcdFx0XHR0cmFuc2l0aW9uOiAncm90YXRlTFInLCAvLyB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0XHRcdHdpZGU6IGZhbHNlLCAvLyBlbmFibGUvZGlzYWJsZSB3aWRlIGltYWdlIGRpc3BsYXkgbW9kZVxyXG5cdFx0XHRcdGhlaWdodDogMzAwIC8vIGhlaWdodFxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHByaXZhdGUgaW5zdGFuY2VzIDoge30gPSB7fVxyXG5cdFx0cHJpdmF0ZSBfdmlzaWJsZSA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdHByaXZhdGUgYXV0b3BsYXkgOiBhbmd1bGFyLklQcm9taXNlPGFueT47XHJcblx0XHRwdWJsaWMgZGlyZWN0aW9uIDogc3RyaW5nO1xyXG5cclxuXHRcdHB1YmxpYyB0aGVtZXMgOiBBcnJheTxzdHJpbmc+ID0gW1xyXG5cdFx0XHQnZGVmYXVsdCcsXHJcblx0XHRcdCdkYXJrYmx1ZScsXHJcblx0XHRcdCd3aGl0ZWdvbGQnXHJcblx0XHRdO1xyXG5cclxuXHRcdHB1YmxpYyB0cmFuc2l0aW9ucyA6IEFycmF5PHN0cmluZz4gPSBbXHJcblx0XHRcdCdubycsXHJcblx0XHRcdCdmYWRlSW5PdXQnLFxyXG5cdFx0XHQnem9vbUluT3V0JyxcclxuXHRcdFx0J3JvdGF0ZUxSJyxcclxuXHRcdFx0J3JvdGF0ZVRCJyxcclxuXHRcdFx0J3JvdGF0ZVpZJyxcclxuXHRcdFx0J3NsaWRlTFInLFxyXG5cdFx0XHQnc2xpZGVUQicsXHJcblx0XHRcdCdmbGlwWCcsXHJcblx0XHRcdCdmbGlwWSdcclxuXHRcdF07XHJcblxyXG5cdFx0Ly9wcm90ZWN0ZWQgaW5mb1Zpc2libGUgOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSB0aW1lb3V0IDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSBpbnRlcnZhbCA6IG5nLklJbnRlcnZhbFNlcnZpY2UpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBnZXRJbnN0YW5jZShhc2cgOiBhbnkpIHtcclxuXHJcblx0XHRcdHZhciBpZCA9IGFzZy5pZDtcclxuXHRcdFx0dmFyIGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbaWRdO1xyXG5cclxuXHRcdFx0Ly8gbmV3IGluc3RhbmNlIGFuZCBzZXQgb3B0aW9ucyBhbmQgaXRlbXNcclxuXHRcdFx0aWYgKGluc3RhbmNlID09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGluc3RhbmNlID0gbmV3IFNlcnZpY2VDb250cm9sbGVyKHRoaXMudGltZW91dCwgdGhpcy5pbnRlcnZhbCk7XHJcblx0XHRcdFx0aW5zdGFuY2UuaWQgPSBpZDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aW5zdGFuY2Uuc2V0T3B0aW9ucyhhc2cub3B0aW9ucyk7XHJcblx0XHRcdGluc3RhbmNlLnNldEl0ZW1zKGFzZy5pdGVtcyk7XHJcblx0XHRcdGluc3RhbmNlLmxvYWRJbWFnZXMoaW5zdGFuY2Uub3B0aW9ucy5wcmVsb2FkKTtcclxuXHRcdFx0aW5zdGFuY2Uuc2VsZWN0ZWQgPSBhc2cuc2VsZWN0ZWQgPyBhc2cuc2VsZWN0ZWQgOiAwO1xyXG5cclxuXHRcdFx0dGhpcy5pbnN0YW5jZXNbaWRdID0gaW5zdGFuY2U7XHJcblx0XHRcdHJldHVybiBpbnN0YW5jZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBzZXRJdGVtcyhpdGVtcyA6IEFycmF5PElGaWxlPikge1xyXG5cclxuXHRcdFx0aWYgKCFpdGVtcykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYgYWxyZWFkeVxyXG5cdFx0XHRpZiAodGhpcy5pdGVtcykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5pdGVtcyA9IGl0ZW1zO1xyXG5cdFx0XHR0aGlzLnByZXBhcmVJdGVtcygpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIHNldE9wdGlvbnMob3B0aW9ucyA6IElPcHRpb25zKSB7XHJcblxyXG5cdFx0XHRpZiAoIW9wdGlvbnMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMub3B0aW9ucyA9IGFuZ3VsYXIubWVyZ2UodGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQpIHtcclxuXHRcdFx0XHR0aGlzLmF1dG9QbGF5U3RhcnQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0b3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucztcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBzZXRTZWxlY3RlZChpbmRleCA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSBpbmRleCA+IHRoaXMuc2VsZWN0ZWQgPyAnZm9yd2FyZCcgOiAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5ub3JtYWxpemUoaW5kZXgpO1xyXG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdvIHRvIGJhY2t3YXJkXHJcblx0XHRwdWJsaWMgdG9CYWNrd2FyZChzdG9wPyA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdHN0b3AgJiYgdGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5ub3JtYWxpemUoLS10aGlzLnNlbGVjdGVkKTtcclxuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGZvcndhcmRcclxuXHRcdHB1YmxpYyB0b0ZvcndhcmQoc3RvcD8gOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRzdG9wICYmIHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2ZvcndhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5ub3JtYWxpemUoKyt0aGlzLnNlbGVjdGVkKTtcclxuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGZpcnN0XHJcblx0XHRwdWJsaWMgdG9GaXJzdChzdG9wPyA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdHN0b3AgJiYgdGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnYmFja3dhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gMDtcclxuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGxhc3RcclxuXHRcdHB1YmxpYyB0b0xhc3Qoc3RvcD8gOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRzdG9wICYmIHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2ZvcndhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5pdGVtcy5sZW5ndGggLSAxO1xyXG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBhdXRvUGxheVRvZ2dsZSgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdG9wKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5hdXRvUGxheVN0YXJ0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBhdXRvUGxheVN0b3AoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5hdXRvcGxheSkge1xyXG5cdFx0XHRcdHRoaXMuaW50ZXJ2YWwuY2FuY2VsKHRoaXMuYXV0b3BsYXkpO1xyXG5cdFx0XHRcdHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5U3RhcnQoKSB7XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCA9IHRydWU7XHJcblxyXG5cdFx0XHR0aGlzLmF1dG9wbGF5ID0gdGhpcy5pbnRlcnZhbCgoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy50b0ZvcndhcmQoKTtcclxuXHRcdFx0fSwgdGhpcy5vcHRpb25zLmF1dG9wbGF5LmRlbGF5KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgcHJlcGFyZUl0ZW1zKCkge1xyXG5cclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHRoaXMuaXRlbXMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XHJcblxyXG5cdFx0XHRcdHZhciB1cmwgPSBzZWxmLm9wdGlvbnMuYmFzZVVybCArIHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudXJsXTtcclxuXHRcdFx0XHR2YXIgdGh1bWJuYWlsID0gc2VsZi5vcHRpb25zLmJhc2VVcmwgKyAodmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aHVtYm5haWxdID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aHVtYm5haWxdIDogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy51cmxdKTtcclxuXHRcdFx0XHR2YXIgcGFydHMgPSB1cmwuc3BsaXQoJy8nKTtcclxuXHRcdFx0XHR2YXIgZmlsZW5hbWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHR2YXIgdGl0bGUgPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRpdGxlXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdIDogZmlsZW5hbWU7XHJcblxyXG5cdFx0XHRcdHZhciBmaWxlID0ge1xyXG5cdFx0XHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdFx0XHR0aHVtYm5haWw6IHRodW1ibmFpbCxcclxuXHRcdFx0XHRcdHRpdGxlOiB0aXRsZSxcclxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuZGVzY3JpcHRpb25dIDogbnVsbCxcclxuXHRcdFx0XHRcdGxvYWRlZDogZmFsc2VcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRzZWxmLmZpbGVzLnB1c2goZmlsZSk7XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGltYWdlIHByZWxvYWRcclxuXHRcdHByaXZhdGUgcHJlbG9hZCh3YWl0PyA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCk7XHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UoMCk7XHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCArIDEpO1xyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQgLSAxKTtcclxuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkICsgMik7XHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5maWxlcy5sZW5ndGggLSAxKTtcclxuXHJcblx0XHRcdH0sICh3YWl0ICE9IHVuZGVmaW5lZCkgPyB3YWl0IDogNzcwKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG5vcm1hbGl6ZShpbmRleCA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dmFyIGxhc3QgPSB0aGlzLmZpbGVzLmxlbmd0aCAtIDE7XHJcblxyXG5cdFx0XHRpZiAoaW5kZXggPiBsYXN0KSB7XHJcblx0XHRcdFx0cmV0dXJuIChpbmRleCAtIGxhc3QpIC0gMTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGluZGV4IDwgMCkge1xyXG5cdFx0XHRcdHJldHVybiBsYXN0IC0gTWF0aC5hYnMoaW5kZXgpICsgMTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGluZGV4O1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGxvYWRJbWFnZXMoaW5kZXhlcyA6IEFycmF5PG51bWJlcj4pIHtcclxuXHJcblx0XHRcdGlmICghaW5kZXhlcykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRpbmRleGVzLmZvckVhY2goKGluZGV4IDogbnVtYmVyKSA9PiB7XHJcblx0XHRcdFx0c2VsZi5sb2FkSW1hZ2UoaW5kZXgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgbG9hZEltYWdlKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpbmRleCA9IHRoaXMubm9ybWFsaXplKGluZGV4KTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5maWxlc1tpbmRleF0pIHtcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ0ludmFsaWQgZmlsZSBpbmRleDogJyArIGluZGV4KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdFx0aW1nLnNyYyA9IHRoaXMuZmlsZXNbaW5kZXhdLnVybDtcclxuXHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubG9hZGVkID0gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGlzIHNpbmdsZT9cclxuXHRcdHB1YmxpYyBnZXQgaXNTaW5nbGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlcy5sZW5ndGggPiAxID8gZmFsc2UgOiB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZSBkb3dubG9hZCBsaW5rXHJcblx0XHRwdWJsaWMgZG93bmxvYWRMaW5rKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuc2VsZWN0ZWQgIT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucy5iYXNlVXJsICsgdGhpcy5maWxlc1t0aGlzLnNlbGVjdGVkXVt0aGlzLm9wdGlvbnMuZmllbGRzLnVybF07XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHRoZSBmaWxlXHJcblx0XHRwdWJsaWMgZ2V0IGZpbGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlc1t0aGlzLnNlbGVjdGVkXTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgZ2V0IG1vZGFsVmlzaWJsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLl92aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZW1lXHJcblx0XHRwdWJsaWMgZ2V0IHRoZW1lKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucy50aGVtZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHNldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgc2V0IG1vZGFsVmlzaWJsZSh2YWx1ZSA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcclxuXHJcblx0XHRcdGlmICh2YWx1ZSkge1xyXG5cclxuXHRcdFx0XHR0aGlzLm1vZGFsSW5pdCgpO1xyXG5cdFx0XHRcdHRoaXMucHJlbG9hZCgxKTtcclxuXHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKS5hZGRDbGFzcygneWhpZGRlbicpO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKS5yZW1vdmVDbGFzcygneWhpZGRlbicpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGUgZm9jdXNcclxuXHRcdHB1YmxpYyBzZXRGb2N1cygpIHtcclxuXHJcblx0XHRcdGFuZ3VsYXIuZWxlbWVudCgnLmFzZy1tb2RhbC4nICsgdGhpcy5pZCArICcgLmtleUlucHV0JykudHJpZ2dlcignZm9jdXMnKS5mb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gaW5pdGlhbGl6ZSB0aGUgZ2FsbGVyeVxyXG5cdFx0cHJpdmF0ZSBtb2RhbEluaXQoKSB7XHJcblxyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cclxuXHRcdFx0XHQvLyBzdWJtZW51IGNsaWNrIGV2ZW50c1xyXG5cdFx0XHRcdHZhciBlbGVtZW50ID0gJy5nYWxsZXJ5LW1vZGFsLicgKyBzZWxmLmlkICsgJyBsaS5kcm9wZG93bi1zdWJtZW51JztcclxuXHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCkub2ZmKCkub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHRcdGlmIChhbmd1bGFyLmVsZW1lbnQodGhpcykuaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG5cdFx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQodGhpcykuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0c2VsZi5zZXRGb2N1cygpO1xyXG5cclxuXHRcdFx0fSwgMTAwKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBtb2RhbE9wZW4oaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleCA/IGluZGV4IDogdGhpcy5zZWxlY3RlZDtcclxuXHRcdFx0dGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgbW9kYWxDbG9zZSgpIHtcclxuXHJcblx0XHRcdHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0fVxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5zZXJ2aWNlKCdhc2dTZXJ2aWNlJywgW1wiJHRpbWVvdXRcIiwgXCIkaW50ZXJ2YWxcIiwgU2VydmljZUNvbnRyb2xsZXJdKTtcclxuXHJcbn1cclxuXHJcbiJdfQ==

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/asg-image.html','<div class="asg-image {{ $ctrl.asg.theme }}" data-ng-style="{\'height\' : $ctrl.asg.options.image.height}">\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" data-ng-swipe-left="$ctrl.asg.toForward()" data-ng-swipe-right="$ctrl.asg.toBackward()">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.asg.files" data-ng-show="$ctrl.asg.selected == key" data-ng-class="{\'loading\' : !file.loaded}">\r\n\r\n\t\t\t<img class="img-responsive source" data-ng-if="file.loaded" data-ng-class="{ wide : $ctrl.config.wide }" data-ng-src="{{ file.url }}" data-ng-click="$ctrl.asg.modalOpen()">\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>\r\n\r\n\r\n\r\n\r\n');
$templateCache.put('views/asg-modal.html','<script type="text/ng-template" id="help.html">\r\n\tSPACE : forward</br>\r\n\tRIGHT : forward</br>\r\n\tLEFT : backward</br>\r\n\tUP : first</br>\r\n\tDOWN : last</br>\r\n\tESC : exit</br>\r\n\tP : play/pause</br>\r\n\tF : toggle fullscreen</br>\r\n\tM : toggle menu</br>\r\n\tW : toggle wide screen</br>\r\n\tC : toggle caption</br>\r\n\tH : toggle help\r\n</script>\r\n\r\n<div class="asg-modal {{ $ctrl.id }}" data-ng-class="$ctrl.getClass()" data-ng-click="$ctrl.asg.setFocus()" data-ng-show="$ctrl.asg.modalVisible" data-ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" data-ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="header">\r\n\r\n        <span class="buttons pull-right visible-sm visible-md visible-lg">\r\n\r\n\t\t\t   <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.autoPlayToggle()">\r\n                    <span data-ng-if="!$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-play"></span>\r\n\t\t\t\t   <span data-ng-if="$ctrl.asg.options.autoplay.enabled" class="glyphicon glyphicon-stop"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toFirst(true)">\r\n                    {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toBackward(true)">\r\n                    <span class="glyphicon glyphicon-chevron-left"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toForward(true)">\r\n                    <span class="glyphicon glyphicon-chevron-right"></span>\r\n                </button>\r\n\r\n             <span data-ng-if="!$ctrl.asg.isSingle && false" class="dropdown">\r\n                    <button class="btn btn-default btn-sm dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                        <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu pull-right">\r\n                        <li class="dropdown-submenu">\r\n                            <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.asg.transitions">\r\n                                    <span data-ng-class="{\'highlight\' : transition == $ctrl.config.transition}">\r\n                                        {{ transition }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTheme(theme)" data-ng-repeat="theme in $ctrl.themes">\r\n                                    <span data-ng-class="{\'highlight\' : theme == $ctrl.asg.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                        <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                    </ul>\r\n                </span>\r\n\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleMenu()">\r\n                    <span data-ng-if="$ctrl.config.menu" class="glyphicon glyphicon-chevron-up"></span>\r\n                    <span data-ng-if="!$ctrl.config.menu" class="glyphicon glyphicon-chevron-down"></span>\r\n                </button>\r\n\r\n\t\t\t \t<button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleWide()">\r\n                    <span class="glyphicon glyphicon-resize-horizontal"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleFullScreen()">\r\n                    <span class="glyphicon glyphicon-fullscreen"></span>\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleHelp()">\r\n                    <span class="glyphicon glyphicon-question-sign"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.modalClose()">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n\r\n            </span>\r\n\r\n\t\t<span class="buttons pull-right visible-xs">\r\n\r\n\r\n\t\t\t\t \t<button data-ng-if="!$ctrl.asg.isSingle && $ctrl.asg.options.autoplay.enabled" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.autoPlayStop()">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-stop"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t   <button data-ng-if="!$ctrl.asg.isSingle && !$ctrl.asg.options.autoplay.enabled" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.autoPlayStart()">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-play"></span>\r\n\t\t\t\t   </button>\r\n\r\n                    <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.toFirst(true)">\r\n                        {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n                    </button>\r\n\r\n                    <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.toBackward(true)">\r\n                        <span class="glyphicon glyphicon-chevron-left"></span>\r\n                    </button>\r\n\r\n                    <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.toForward(true)">\r\n                        <span class="glyphicon glyphicon-chevron-right"></span>\r\n                    </button>\r\n\r\n                    <span data-ng-if="!$ctrl.asg.isSingle && false" class="dropdown">\r\n                        <button class="btn btn-default btn-xs dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                            <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                        </button>\r\n                        <ul class="dropdown-menu pull-right">\r\n                            <li class="dropdown-submenu">\r\n                                <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                                <ul class="dropdown-menu">\r\n                                    <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.transitions">\r\n                                        <span data-ng-class="{\'highlight\' : transition == $ctrl.transition}">\r\n                                            {{ transition }}</span></a>\r\n                                    </li>\r\n                                </ul>\r\n                            </li>\r\n\t\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTheme(theme)" data-ng-repeat="theme in $ctrl.themes">\r\n                                    <span data-ng-class="{\'highlight\' : theme == $ctrl.asg.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                            <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                        </ul>\r\n                    </span>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleMenu()">\r\n                        <span data-ng-if="$ctrl.config.header" class="glyphicon glyphicon-chevron-up"></span>\r\n                        <span data-ng-if="!$ctrl.config.header" class="glyphicon glyphicon-chevron-down"></span>\r\n                    </button>\r\n\r\n\r\n\t\t\t\t\t<button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleWide()">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-resize-horizontal"></span>\r\n\t\t\t\t\t</button>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleFullScreen()">\r\n                        <span class="glyphicon glyphicon-fullscreen"></span>\r\n                    </button>\r\n\r\n\t\t\t  \t\t<button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleHelp()">\r\n                        <span class="glyphicon glyphicon-question-sign"></span>\r\n                    </button>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.modalClose()">\r\n                        <span class="glyphicon glyphicon-remove"></span>\r\n                    </button>\r\n\r\n                </span>\r\n\r\n\t\t<span data-ng-if="$ctrl.config.title">\r\n\t\t\t<span class="title">{{ $ctrl.config.title }}</span>\r\n\t\t\t<span class="subtitle" data-ng-if="$ctrl.config.subtitle">{{ $ctrl.config.subtitle }}</span>\r\n\t\t</span>\r\n\r\n\t</div>\r\n\r\n\t<div class="help text-right" data-ng-click="$ctrl.toggleHelp()" data-ng-show="$ctrl.config.help" data-ng-include src="\'help.html\'"></div>\r\n\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.config.transition }}" data-ng-mouseover="$ctrl.arrowsShow()" data-ng-mouseleave="$ctrl.arrowsHide()" data-ng-swipe-left="$ctrl.asg.toForward(true)" data-ng-swipe-right="$ctrl.asg.toBackward(true)">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.asg.files" data-ng-show="$ctrl.asg.selected == key" data-ng-class="{\'loading\' : !file.loaded}">\r\n\r\n\t\t\t<img class="source" data-ng-class="{ wide : $ctrl.config.wide }" data-ng-src="{{ file.url }}" data-ng-if="file.loaded">\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.asg.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toBackward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.asg.toBackward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" data-ng-click="$ctrl.toBackward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-sm pull-left visible-xs" data-ng-click="$ctrl.asg.toBackward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.asg.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toForward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.asg.toForward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" data-ng-click="$ctrl.toForward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-sm pull-right visible-xs" data-ng-click="$ctrl.asg.toForward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-show="$ctrl.arrowsVisible" class="functions">\r\n\t\t</div>\r\n\r\n\t</div>\r\n\r\n\r\n\t<div class="caption" data-ng-if="$ctrl.config.caption">\r\n\t\t<div class="content">\r\n\t\t\t<span class="title">{{ $ctrl.asg.file.title }}</span>\r\n\t\t\t<span data-ng-if="$ctrl.asg.file.title && $ctrl.asg.file.description"> - </span>\r\n\t\t\t<span class="description">{{ $ctrl.asg.file.description }}</span>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>');
$templateCache.put('views/asg-panel.html','<div class="asg-panel {{ $ctrl.asg.theme }}">\r\n\r\n\t<div data-ng-repeat="(key,file) in $ctrl.asg.files" class="item {{ $ctrl.asg.options.panel.item.class }}" data-ng-class="{\'selected\' : $ctrl.asg.selected == key}" data-ng-mouseover="indexShow = true" data-ng-mouseleave="indexShow = false">\r\n\r\n\t\t<img data-ng-src="{{ file.thumbnail }}" data-ng-click="$ctrl.asg.setSelected(key)" alt="{{ file.title }}">\r\n\t\t<span class="index" data-ng-if="$ctrl.config.item.index && indexShow">{{ key + 1 }}</span>\r\n\r\n\t\t<div class="caption" data-ng-if="$ctrl.config.item.caption">\r\n\t\t\t<span>{{ file.title }}</span>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>');}]);