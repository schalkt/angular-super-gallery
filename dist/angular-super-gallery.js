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
            this.asg = this.service.getInstance(this.id);
            this.asg.preload(1);
        };
        return ImageController;
    }());
    ASG.ImageController = ImageController;
    var app = angular.module('angularSuperGallery');
    app.component("asgImage", {
        controller: ["asgService", ASG.ImageController],
        templateUrl: 'views/asg-image.html',
        bindings: {
            id: "@"
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
            this.asg = this.service.getInstance(this.id);
        };
        ModalController.prototype.getClass = function () {
            var ngClass = [];
            if (!this.asg.options.modal.header) {
                ngClass.push('noheader');
            }
            ngClass.push(this.asg.options.theme);
            return ngClass.join(' ');
        };
        ModalController.prototype.keyUp = function (e) {
            if (e.keyCode == 27) {
                this.asg.modalClose();
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
            if (e.keyCode == 71) {
                this.toggleHeader();
            }
            if (e.keyCode == 72) {
                this.toggleHelp();
            }
            if (e.keyCode == 84) {
                this.nextTransition();
            }
        };
        ModalController.prototype.nextTransition = function () {
            var idx = this.asg.transitions.indexOf(this.asg.options.modal.transition) + 1;
            var next = idx >= this.asg.transitions.length ? 0 : idx;
            this.asg.options.modal.transition = this.asg.transitions[next];
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
            this.asg.options.modal.transition = transition;
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
            this.asg.options.modal.help = !this.asg.options.modal.help;
            this.asg.setFocus();
        };
        ModalController.prototype.toggleHeader = function () {
            this.asg.options.modal.header = !this.asg.options.modal.header;
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
        return ModalController;
    }());
    ASG.ModalController = ModalController;
    var app = angular.module('angularSuperGallery');
    app.component("asgModal", {
        controller: ["asgService", "Fullscreen", ASG.ModalController],
        templateUrl: 'views/asg-modal.html',
        bindings: {
            id: "@",
            visible: "="
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
            this.asg = this.service.getInstance(this.id);
        };
        Object.defineProperty(PanelController.prototype, "options", {
            get: function () {
                return this.asg.options.panel;
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
            id: "@"
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
                    delay: 2500
                },
                theme: 'default',
                preload: [0],
                modal: {
                    title: "",
                    subtitle: "",
                    header: true,
                    help: false,
                    transition: 'rotateLR',
                },
                panel: {
                    thumbnail: {
                        class: 'col-md-3'
                    },
                },
                image: {
                    transition: 'rotateLR',
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
            console.log(this);
        };
        ServiceController.prototype.getInstance = function (id) {
            if (this.instances[id] == undefined) {
                this.instances[id] = new ServiceController(this.timeout, this.interval);
                this.instances[id].id = id;
            }
            return this.instances[id];
        };
        ServiceController.prototype.setup = function (options, items) {
            this.options = angular.merge(this.defaults, options);
            this.items = items;
            this.prepareItems();
            if (this.options.autoplay.enabled) {
                this.autoPlayStart();
            }
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
        ServiceController.prototype.initPreload = function () {
            var self = this;
            if (this.options.preload) {
                this.options.preload.forEach(function (index) {
                    self.loadImage(index);
                });
            }
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
            }, (wait != undefined) ? wait : 750);
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
var ASG;
(function (ASG) {
    var SetupController = (function () {
        function SetupController(service) {
            this.service = service;
        }
        SetupController.prototype.$onInit = function () {
            this.asg = this.service.getInstance(this.id);
            this.options = this.asg.setup(this.options, this.items);
        };
        return SetupController;
    }());
    ASG.SetupController = SetupController;
    var app = angular.module('angularSuperGallery');
    app.component("asgSetup", {
        controller: ["asgService", ASG.SetupController],
        bindings: {
            id: "@",
            items: '=',
            options: '=?',
            selected: '=',
        }
    });
})(ASG || (ASG = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hc2cudHMiLCJzcmMvYXNnLWltYWdlLnRzIiwic3JjL2FzZy1tb2RhbC50cyIsInNyYy9hc2ctcGFuZWwudHMiLCJzcmMvYXNnLXNlcnZpY2UudHMiLCJzcmMvYXNnLXNldHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLElBQU8sR0FBRyxDQW1CVDtBQW5CRCxXQUFPLEdBQUc7SUFFVCxJQUFJLEdBQUcsR0FBZ0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFFNUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDdEIsTUFBTSxDQUFDLFVBQVUsS0FBVyxFQUFFLFNBQWtCO1lBRS9DLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsRUFBRSxDQUFBO1lBQzNELEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUM1QixFQUFFLENBQUMsQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLENBQUM7Z0JBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztZQUVwRCxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMs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SUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFekQsQ0FBQztRQUVGLHNCQUFDO0lBQUQsQ0FsQkEsQUFrQkMsSUFBQTtJQWxCWSxtQkFBZSxrQkFrQjNCLENBQUE7SUFFRCxJQUFJLEdBQUcsR0FBZ0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRTdELEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFO1FBQ3pCLFVBQVUsRUFBRSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDO1FBQy9DLFFBQVEsRUFBRTtZQUNULEVBQUUsRUFBRSxHQUFHO1lBQ1AsS0FBSyxFQUFFLEdBQUc7WUFDVixPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVEsRUFBRSxHQUFHO1NBQ2I7S0FDRCxDQUFDLENBQUM7QUFFSixDQUFDLEVBbENNLEdBQUcsS0FBSCxHQUFHLFFBa0NUIiwiZmlsZSI6ImFuZ3VsYXItc3VwZXItZ2FsbGVyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBBU0cge1xyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5JywgWyduZ0FuaW1hdGUnXSk7XHJcblxyXG5cdGFwcC5maWx0ZXIoJ2FzZ0J5dGVzJywgKCkgPT4ge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChieXRlcyA6IGFueSwgcHJlY2lzaW9uIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRpZiAoaXNOYU4ocGFyc2VGbG9hdChieXRlcykpIHx8ICFpc0Zpbml0ZShieXRlcykpIHJldHVybiAnJ1xyXG5cdFx0XHRpZiAoYnl0ZXMgPT09IDApIHJldHVybiAnMCc7XHJcblx0XHRcdGlmICh0eXBlb2YgcHJlY2lzaW9uID09PSAndW5kZWZpbmVkJykgcHJlY2lzaW9uID0gMTtcclxuXHJcblx0XHRcdHZhciB1bml0cyA9IFsnYnl0ZXMnLCAna0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInXSxcclxuXHRcdFx0XHRudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgubG9nKGJ5dGVzKSAvIE1hdGgubG9nKDEwMjQpKTtcclxuXHJcblx0XHRcdHJldHVybiAoYnl0ZXMgLyBNYXRoLnBvdygxMDI0LCBNYXRoLmZsb29yKG51bWJlcikpKS50b0ZpeGVkKHByZWNpc2lvbikgKyAnICcgKyB1bml0c1tudW1iZXJdO1xyXG5cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cclxuXHJcbiIsIm1vZHVsZSBBU0cge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgSW1hZ2VDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZSBieSBpZFxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzLmlkKTtcclxuXHRcdFx0dGhpcy5hc2cucHJlbG9hZCgxKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0dmFyIGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuY29tcG9uZW50KFwiYXNnSW1hZ2VcIiwge1xyXG5cdFx0Y29udHJvbGxlcjogW1wiYXNnU2VydmljZVwiLCBBU0cuSW1hZ2VDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLWltYWdlLmh0bWwnLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6IFwiQFwiXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxufSIsIm1vZHVsZSBBU0cge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgTW9kYWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRwcml2YXRlIF9mdWxsc2NyZWVuIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBfdmlzaWJsZSA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdHByaXZhdGUgYXJyb3dzVmlzaWJsZSA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIsXHJcblx0XHRcdFx0XHRwcml2YXRlIGZ1bGxzY3JlZW4pIHtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHNlcnZpY2UgaW5zdGFuY2UgYnkgaWRcclxuXHRcdFx0dGhpcy5hc2cgPSB0aGlzLnNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcy5pZCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwcml2YXRlIGdldENsYXNzKCkge1xyXG5cclxuXHRcdFx0dmFyIG5nQ2xhc3MgPSBbXTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cub3B0aW9ucy5tb2RhbC5oZWFkZXIpIHtcclxuXHRcdFx0XHRuZ0NsYXNzLnB1c2goJ25vaGVhZGVyJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5nQ2xhc3MucHVzaCh0aGlzLmFzZy5vcHRpb25zLnRoZW1lKTtcclxuXHJcblx0XHRcdHJldHVybiBuZ0NsYXNzLmpvaW4oJyAnKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGtleW1hcFxyXG5cdFx0cHVibGljIGtleVVwKGUpIHtcclxuXHJcblx0XHRcdC8vIGVzY1xyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDI3KSB7XHJcblx0XHRcdFx0dGhpcy5hc2cubW9kYWxDbG9zZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBzcGFjZVxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDMyKSB7XHJcblx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBsZWZ0XHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzcpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0JhY2t3YXJkKHRydWUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyByaWdodFxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDM5KSB7XHJcblx0XHRcdFx0dGhpcy5hc2cudG9Gb3J3YXJkKHRydWUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyB1cFxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDM4IHx8IGUua2V5Q29kZSA9PSAzNikge1xyXG5cdFx0XHRcdHRoaXMuYXNnLnRvRmlyc3QodHJ1ZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGRvd25cclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSA0MCB8fCBlLmtleUNvZGUgPT0gMzUpIHtcclxuXHRcdFx0XHR0aGlzLmFzZy50b0xhc3QodHJ1ZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGYgLSBmdWxsc2NyZWVuXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gNzAgfHwgZS5rZXlDb2RlID09IDEzKSB7XHJcblx0XHRcdFx0dGhpcy50b2dnbGVGdWxsU2NyZWVuKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGcgLSBoZWFkZXJcclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSA3MSkge1xyXG5cdFx0XHRcdHRoaXMudG9nZ2xlSGVhZGVyKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGggLSBoZWxwXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gNzIpIHtcclxuXHRcdFx0XHR0aGlzLnRvZ2dsZUhlbHAoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gdCAtIHRyYW5zaXRpb24gbmV4dFxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDg0KSB7XHJcblx0XHRcdFx0dGhpcy5uZXh0VHJhbnNpdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBzd2l0Y2ggdG8gbmV4dCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHJpdmF0ZSBuZXh0VHJhbnNpdGlvbigpIHtcclxuXHJcblx0XHRcdHZhciBpZHggPSB0aGlzLmFzZy50cmFuc2l0aW9ucy5pbmRleE9mKHRoaXMuYXNnLm9wdGlvbnMubW9kYWwudHJhbnNpdGlvbikgKyAxO1xyXG5cdFx0XHR2YXIgbmV4dCA9IGlkeCA+PSB0aGlzLmFzZy50cmFuc2l0aW9ucy5sZW5ndGggPyAwIDogaWR4O1xyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zLm1vZGFsLnRyYW5zaXRpb24gPSB0aGlzLmFzZy50cmFuc2l0aW9uc1tuZXh0XTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHRvZ2dsZSBmdWxsc2NyZWVuXHJcblx0XHRwcml2YXRlIHRvZ2dsZUZ1bGxTY3JlZW4oKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5mdWxsc2NyZWVuLmlzRW5hYmxlZCgpKSB7XHJcblx0XHRcdFx0dGhpcy5mdWxsc2NyZWVuLmNhbmNlbCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuZnVsbHNjcmVlbi5hbGwoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmFzZy5zZXRGb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdHJhbnNpdGlvbiBlZmZlY3RcclxuXHRcdHB1YmxpYyBzZXRUcmFuc2l0aW9uKHRyYW5zaXRpb24pIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnMubW9kYWwudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGVtZVxyXG5cdFx0cHVibGljIHNldFRoZW1lKHRoZW1lKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5vcHRpb25zLnRoZW1lID0gdGhlbWU7XHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG92ZXJsYXkgYXJyb3dzIGhpZGVcclxuXHRcdHB1YmxpYyBhcnJvd3NIaWRlKCkge1xyXG5cclxuXHRcdFx0dGhpcy5hcnJvd3NWaXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG92ZXJsYXkgYXJyb3dzIHNob3dcclxuXHRcdHB1YmxpYyBhcnJvd3NTaG93KCkge1xyXG5cclxuXHRcdFx0dGhpcy5hcnJvd3NWaXNpYmxlID0gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGhlbHBcclxuXHRcdHByaXZhdGUgdG9nZ2xlSGVscCgpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnMubW9kYWwuaGVscCA9ICF0aGlzLmFzZy5vcHRpb25zLm1vZGFsLmhlbHA7XHJcblx0XHRcdHRoaXMuYXNnLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyB0b2dnbGUgaGVhZGVyXHJcblx0XHRwcml2YXRlIHRvZ2dsZUhlYWRlcigpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnLm9wdGlvbnMubW9kYWwuaGVhZGVyID0gIXRoaXMuYXNnLm9wdGlvbnMubW9kYWwuaGVhZGVyO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IG1vZGFsIHZpc2libGVcclxuXHRcdHB1YmxpYyBnZXQgdmlzaWJsZSgpIHtcclxuXHJcblx0XHRcdGlmICghdGhpcy5hc2cpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmFzZy5tb2RhbFZpc2libGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCBtb2RhbCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgc2V0IHZpc2libGUodmFsdWUgOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuYXNnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmFzZy5tb2RhbFZpc2libGUgPSB2YWx1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHR9XHJcblxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoXCJhc2dNb2RhbFwiLCB7XHJcblx0XHRjb250cm9sbGVyOiBbXCJhc2dTZXJ2aWNlXCIsIFwiRnVsbHNjcmVlblwiLCBBU0cuTW9kYWxDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYXNnLW1vZGFsLmh0bWwnLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6IFwiQFwiLFxyXG5cdFx0XHR2aXNpYmxlOiBcIj1cIlxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufSIsIm1vZHVsZSBBU0cge1xyXG5cclxuXHRleHBvcnQgY2xhc3MgUGFuZWxDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwcml2YXRlIGFzZyA6IElTZXJ2aWNlQ29udHJvbGxlcjtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2UgOiBJU2VydmljZUNvbnRyb2xsZXIpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljICRvbkluaXQoKSB7XHJcblxyXG5cdFx0XHQvLyBnZXQgc2VydmljZSBpbnN0YW5jZSBieSBpZFxyXG5cdFx0XHR0aGlzLmFzZyA9IHRoaXMuc2VydmljZS5nZXRJbnN0YW5jZSh0aGlzLmlkKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGdldCBvcHRpb25zKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuYXNnLm9wdGlvbnMucGFuZWw7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdHZhciBhcHAgOiBuZy5JTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXJTdXBlckdhbGxlcnknKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudChcImFzZ1BhbmVsXCIsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFtcImFzZ1NlcnZpY2VcIiwgQVNHLlBhbmVsQ29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FzZy1wYW5lbC5odG1sJyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdGlkOiBcIkBcIlxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBBU0cge1xyXG5cclxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zIHtcclxuXHJcblx0XHRiYXNlVXJsPyA6IHN0cmluZztcclxuXHRcdGZpZWxkcz8gOiB7XHJcblx0XHRcdHVybD8gOiBzdHJpbmc7XHJcblx0XHRcdHRpdGxlPyA6IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb24/IDogc3RyaW5nO1xyXG5cdFx0XHR0aHVtYm5haWw/IDogc3RyaW5nO1xyXG5cdFx0fSxcclxuXHRcdGF1dG9wbGF5PyA6IHtcclxuXHRcdFx0ZW5hYmxlZD8gOiBib29sZWFuO1xyXG5cdFx0XHRkZWxheT8gOiBudW1iZXI7XHJcblx0XHR9LFxyXG5cdFx0dGhlbWU/IDogc3RyaW5nO1xyXG5cdFx0cHJlbG9hZD8gOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0bW9kYWw/IDoge1xyXG5cdFx0XHRoZWFkZXI/IDogYm9vbGVhbjtcclxuXHRcdFx0aGVscD8gOiBib29sZWFuO1xyXG5cdFx0XHR0cmFuc2l0aW9uPyA6IHN0cmluZztcclxuXHRcdFx0dGl0bGU/IDogc3RyaW5nO1xyXG5cdFx0XHRzdWJ0aXRsZT8gOiBzdHJpbmc7XHJcblx0XHR9LFxyXG5cdFx0cGFuZWw/IDoge1xyXG5cdFx0XHR0aHVtYm5haWw/IDoge1xyXG5cdFx0XHRcdGNsYXNzPyA6IHN0cmluZztcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0XHRpbWFnZT8gOiB7XHJcblx0XHRcdHRyYW5zaXRpb24/IDogc3RyaW5nO1xyXG5cdFx0XHRoZWlnaHQ/IDogbnVtYmVyXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUZpbGUge1xyXG5cclxuXHRcdHVybCA6IHN0cmluZztcclxuXHRcdHRpdGxlPyA6IHN0cmluZztcclxuXHRcdGRlc2NyaXB0aW9uPyA6IHN0cmluZztcclxuXHRcdHRodW1ibmFpbD8gOiBzdHJpbmc7XHJcblx0XHRsb2FkZWQ/IDogYm9vbGVhbjtcclxuXHRcdHNpemU/IDogbnVtYmVyO1xyXG5cdFx0d2lkdGg/IDogbnVtYmVyO1xyXG5cdFx0aGVpZ2h0PyA6IG51bWJlcjtcclxuXHJcblx0fVxyXG5cclxuXHRleHBvcnQgaW50ZXJmYWNlIElTZXJ2aWNlQ29udHJvbGxlciB7XHJcblxyXG5cdFx0Z2V0SW5zdGFuY2UoaWQgOiBhbnkpIDogSVNlcnZpY2VDb250cm9sbGVyLFxyXG5cdFx0c2V0RGVmYXVsdHMoKSA6IHZvaWQ7XHJcblx0XHRzZXR1cChvcHRpb25zLCBpdGVtcykgOiBJT3B0aW9ucztcclxuXHRcdHByZWxvYWQod2FpdD8gOiBudW1iZXIpIDogdm9pZDtcclxuXHRcdG5vcm1hbGl6ZShpbmRleCA6IG51bWJlcikgOiBudW1iZXI7XHJcblx0XHRzZXRGb2N1cygpIDogdm9pZDtcclxuXHRcdG1vZGFsT3BlbihpbmRleCA6IG51bWJlcikgOiB2b2lkO1xyXG5cdFx0bW9kYWxDbG9zZSgpIDogdm9pZDtcclxuXHRcdHRvQmFja3dhcmQoc3RvcD8gOiBib29sZWFuKSA6IHZvaWQ7XHJcblx0XHR0b0ZvcndhcmQoc3RvcD8gOiBib29sZWFuKSA6IHZvaWQ7XHJcblx0XHR0b0ZpcnN0KHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cdFx0dG9MYXN0KHN0b3A/IDogYm9vbGVhbikgOiB2b2lkO1xyXG5cdFx0bW9kYWxWaXNpYmxlIDogYm9vbGVhbjtcclxuXHRcdHRyYW5zaXRpb25zIDogQXJyYXk8c3RyaW5nPjtcclxuXHRcdHRoZW1lcyA6IEFycmF5PHN0cmluZz47XHJcblx0XHRvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHRcdHNlbGVjdGVkIDogbnVtYmVyO1xyXG5cclxuXHR9XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBTZXJ2aWNlQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogYW55O1xyXG5cdFx0cHVibGljIGZpbGVzIDogQXJyYXk8SUZpbGU+ID0gW107XHJcblx0XHRwdWJsaWMgc2VsZWN0ZWQgOiBudW1iZXIgPSAwO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucyA9IHt9O1xyXG5cdFx0cHVibGljIGRlZmF1bHRzIDogSU9wdGlvbnMgPSB7XHJcblx0XHRcdGJhc2VVcmw6IFwiXCIsXHJcblx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdHVybDogXCJ1cmxcIixcclxuXHRcdFx0XHR0aXRsZTogXCJ0aXRsZVwiLFxyXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBcImRlc2NyaXB0aW9uXCIsXHJcblx0XHRcdFx0dGh1bWJuYWlsOiBcInRodW1ibmFpbFwiXHJcblx0XHRcdH0sXHJcblx0XHRcdGF1dG9wbGF5OiB7XHJcblx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXHJcblx0XHRcdFx0ZGVsYXk6IDI1MDBcclxuXHRcdFx0fSxcclxuXHRcdFx0dGhlbWU6ICdkZWZhdWx0JyxcclxuXHRcdFx0cHJlbG9hZDogWzBdLFxyXG5cdFx0XHRtb2RhbDoge1xyXG5cdFx0XHRcdHRpdGxlOiBcIlwiLFxyXG5cdFx0XHRcdHN1YnRpdGxlOiBcIlwiLFxyXG5cdFx0XHRcdGhlYWRlcjogdHJ1ZSxcclxuXHRcdFx0XHRoZWxwOiBmYWxzZSxcclxuXHRcdFx0XHR0cmFuc2l0aW9uOiAncm90YXRlTFInLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRwYW5lbDoge1xyXG5cdFx0XHRcdHRodW1ibmFpbDoge1xyXG5cdFx0XHRcdFx0Y2xhc3M6ICdjb2wtbWQtMydcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRpbWFnZToge1xyXG5cdFx0XHRcdHRyYW5zaXRpb246ICdyb3RhdGVMUicsXHJcblx0XHRcdFx0aGVpZ2h0OiAzMDBcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHRwcml2YXRlIGluc3RhbmNlcyA6IHt9ID0ge31cclxuXHRcdHByaXZhdGUgX3Zpc2libGUgOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHRwcml2YXRlIGF1dG9wbGF5IDogYW5ndWxhci5JUHJvbWlzZTxhbnk+O1xyXG5cdFx0cHVibGljIGRpcmVjdGlvbiA6IHN0cmluZztcclxuXHJcblx0XHRwdWJsaWMgdGhlbWVzIDogQXJyYXk8c3RyaW5nPiA9IFtcclxuXHRcdFx0J2RlZmF1bHQnLFxyXG5cdFx0XHQnZGFya2JsdWUnLFxyXG5cdFx0XHQnd2hpdGVnb2xkJ1xyXG5cdFx0XTtcclxuXHJcblx0XHRwdWJsaWMgdHJhbnNpdGlvbnMgOiBBcnJheTxzdHJpbmc+ID0gW1xyXG5cdFx0XHQnbm8nLFxyXG5cdFx0XHQnZmFkZUluT3V0JyxcclxuXHRcdFx0J3pvb21Jbk91dCcsXHJcblx0XHRcdCdyb3RhdGVMUicsXHJcblx0XHRcdCdyb3RhdGVUQicsXHJcblx0XHRcdCdyb3RhdGVaWScsXHJcblx0XHRcdCdzbGlkZUxSJyxcclxuXHRcdFx0J3NsaWRlVEInLFxyXG5cdFx0XHQnZmxpcFgnLFxyXG5cdFx0XHQnZmxpcFknXHJcblx0XHRdO1xyXG5cclxuXHRcdC8vcHJvdGVjdGVkIGluZm9WaXNpYmxlIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgdGltZW91dCA6IG5nLklUaW1lb3V0U2VydmljZSxcclxuXHRcdFx0XHRcdHByaXZhdGUgaW50ZXJ2YWwgOiBuZy5JSW50ZXJ2YWxTZXJ2aWNlKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdGNvbnNvbGUubG9nKHRoaXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGdldEluc3RhbmNlKGlkIDogYW55KSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5pbnN0YW5jZXNbaWRdID09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHRoaXMuaW5zdGFuY2VzW2lkXSA9IG5ldyBTZXJ2aWNlQ29udHJvbGxlcih0aGlzLnRpbWVvdXQsIHRoaXMuaW50ZXJ2YWwpO1xyXG5cdFx0XHRcdHRoaXMuaW5zdGFuY2VzW2lkXS5pZCA9IGlkO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5pbnN0YW5jZXNbaWRdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc2V0dXAob3B0aW9ucywgaXRlbXMpIHtcclxuXHJcblx0XHRcdHRoaXMub3B0aW9ucyA9IGFuZ3VsYXIubWVyZ2UodGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XHJcblx0XHRcdHRoaXMuaXRlbXMgPSBpdGVtcztcclxuXHRcdFx0dGhpcy5wcmVwYXJlSXRlbXMoKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZW5hYmxlZCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b1BsYXlTdGFydCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIHNldFNlbGVjdGVkKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9IGluZGV4ID4gdGhpcy5zZWxlY3RlZCA/ICdmb3J3YXJkJyA6ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLm5vcm1hbGl6ZShpbmRleCk7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ28gdG8gYmFja3dhcmRcclxuXHRcdHB1YmxpYyB0b0JhY2t3YXJkKHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0c3RvcCAmJiB0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLm5vcm1hbGl6ZSgtLXRoaXMuc2VsZWN0ZWQpO1xyXG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gZm9yd2FyZFxyXG5cdFx0cHVibGljIHRvRm9yd2FyZChzdG9wPyA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdHN0b3AgJiYgdGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLm5vcm1hbGl6ZSgrK3RoaXMuc2VsZWN0ZWQpO1xyXG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gZmlyc3RcclxuXHRcdHB1YmxpYyB0b0ZpcnN0KHN0b3A/IDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0c3RvcCAmJiB0aGlzLmF1dG9QbGF5U3RvcCgpO1xyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSAwO1xyXG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gbGFzdFxyXG5cdFx0cHVibGljIHRvTGFzdChzdG9wPyA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdHN0b3AgJiYgdGhpcy5hdXRvUGxheVN0b3AoKTtcclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLml0ZW1zLmxlbmd0aCAtIDE7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIGF1dG9QbGF5U3RvcCgpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0dGhpcy5pbnRlcnZhbC5jYW5jZWwodGhpcy5hdXRvcGxheSk7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25zLmF1dG9wbGF5LmVuYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgYXV0b1BsYXlTdGFydCgpIHtcclxuXHJcblx0XHRcdHRoaXMub3B0aW9ucy5hdXRvcGxheS5lbmFibGVkID0gdHJ1ZTtcclxuXHJcblx0XHRcdHRoaXMuYXV0b3BsYXkgPSB0aGlzLmludGVydmFsKCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnRvRm9yd2FyZCgpO1xyXG5cdFx0XHR9LCB0aGlzLm9wdGlvbnMuYXV0b3BsYXkuZGVsYXkpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHJpdmF0ZSBpbml0UHJlbG9hZCgpIHtcclxuXHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMucHJlbG9hZCkge1xyXG5cdFx0XHRcdHRoaXMub3B0aW9ucy5wcmVsb2FkLmZvckVhY2goKGluZGV4IDogbnVtYmVyKSA9PiB7XHJcblx0XHRcdFx0XHRzZWxmLmxvYWRJbWFnZShpbmRleCk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIHByZXBhcmVJdGVtcygpIHtcclxuXHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh0aGlzLml0ZW1zLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG5cclxuXHRcdFx0XHR2YXIgdXJsID0gc2VsZi5vcHRpb25zLmJhc2VVcmwgKyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnVybF07XHJcblx0XHRcdFx0dmFyIHRodW1ibmFpbCA9IHNlbGYub3B0aW9ucy5iYXNlVXJsICsgKHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGh1bWJuYWlsXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGh1bWJuYWlsXSA6IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudXJsXSk7XHJcblx0XHRcdFx0dmFyIHBhcnRzID0gdXJsLnNwbGl0KCcvJyk7XHJcblx0XHRcdFx0dmFyIGZpbGVuYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0dmFyIHRpdGxlID0gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aXRsZV0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRpdGxlXSA6IGZpbGVuYW1lO1xyXG5cclxuXHRcdFx0XHR2YXIgZmlsZSA9IHtcclxuXHRcdFx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRcdFx0dGh1bWJuYWlsOiB0aHVtYm5haWwsXHJcblx0XHRcdFx0XHR0aXRsZTogdGl0bGUsXHJcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5kZXNjcmlwdGlvbl0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA6IG51bGwsXHJcblx0XHRcdFx0XHRsb2FkZWQ6IGZhbHNlXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0c2VsZi5maWxlcy5wdXNoKGZpbGUpO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBpbWFnZSBwcmVsb2FkXHJcblx0XHRwcml2YXRlIHByZWxvYWQod2FpdD8gOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblxyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQpO1xyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKDApO1xyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQgKyAxKTtcclxuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkIC0gMSk7XHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCArIDIpO1xyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuZmlsZXMubGVuZ3RoIC0gMSk7XHJcblxyXG5cdFx0XHR9LCAod2FpdCAhPSB1bmRlZmluZWQpID8gd2FpdCA6IDc1MCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBub3JtYWxpemUoaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHZhciBsYXN0ID0gdGhpcy5maWxlcy5sZW5ndGggLSAxO1xyXG5cclxuXHRcdFx0aWYgKGluZGV4ID4gbGFzdCkge1xyXG5cdFx0XHRcdHJldHVybiAoaW5kZXggLSBsYXN0KSAtIDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChpbmRleCA8IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gbGFzdCAtIE1hdGguYWJzKGluZGV4KSArIDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBpbmRleDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgbG9hZEltYWdlKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpbmRleCA9IHRoaXMubm9ybWFsaXplKGluZGV4KTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5maWxlc1tpbmRleF0pIHtcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ0ludmFsaWQgZmlsZSBpbmRleDogJyArIGluZGV4KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdFx0aW1nLnNyYyA9IHRoaXMuZmlsZXNbaW5kZXhdLnVybDtcclxuXHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubG9hZGVkID0gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGlzIHNpbmdsZT9cclxuXHRcdHB1YmxpYyBnZXQgaXNTaW5nbGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlcy5sZW5ndGggPiAxID8gZmFsc2UgOiB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gZ2V0IHRoZSBkb3dubG9hZCBsaW5rXHJcblx0XHRwdWJsaWMgZG93bmxvYWRMaW5rKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuc2VsZWN0ZWQgIT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMub3B0aW9ucy5iYXNlVXJsICsgdGhpcy5maWxlc1t0aGlzLnNlbGVjdGVkXVt0aGlzLm9wdGlvbnMuZmllbGRzLnVybF07XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHRoZSBmaWxlXHJcblx0XHRwdWJsaWMgZ2V0IGZpbGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlc1t0aGlzLnNlbGVjdGVkXTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGdldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgZ2V0IG1vZGFsVmlzaWJsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLl92aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdmlzaWJsZVxyXG5cdFx0cHVibGljIHNldCBtb2RhbFZpc2libGUodmFsdWUgOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHR0aGlzLl92aXNpYmxlID0gdmFsdWU7XHJcblxyXG5cdFx0XHRpZiAodmFsdWUpIHtcclxuXHJcblx0XHRcdFx0dGhpcy5tb2RhbEluaXQoKTtcclxuXHRcdFx0XHR0aGlzLnByZWxvYWQoMSk7XHJcblx0XHRcdFx0YW5ndWxhci5lbGVtZW50KCdib2R5JykuYWRkQ2xhc3MoJ3loaWRkZW4nKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YW5ndWxhci5lbGVtZW50KCdib2R5JykucmVtb3ZlQ2xhc3MoJ3loaWRkZW4nKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdGhlIGZvY3VzXHJcblx0XHRwdWJsaWMgc2V0Rm9jdXMoKSB7XHJcblxyXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJy5hc2ctbW9kYWwuJyArIHRoaXMuaWQgKyAnIC5rZXlJbnB1dCcpLnRyaWdnZXIoJ2ZvY3VzJykuZm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGluaXRpYWxpemUgdGhlIGdhbGxlcnlcclxuXHRcdHByaXZhdGUgbW9kYWxJbml0KCkge1xyXG5cclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHJcblx0XHRcdFx0Ly8gc3VibWVudSBjbGljayBldmVudHNcclxuXHRcdFx0XHR2YXIgZWxlbWVudCA9ICcuZ2FsbGVyeS1tb2RhbC4nICsgc2VsZi5pZCArICcgbGkuZHJvcGRvd24tc3VibWVudSc7XHJcblx0XHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLm9mZigpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0XHRpZiAoYW5ndWxhci5lbGVtZW50KHRoaXMpLmhhc0NsYXNzKCdvcGVuJykpIHtcclxuXHRcdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KHRoaXMpLmFkZENsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdHNlbGYuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHRcdH0sIDEwMCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgbW9kYWxPcGVuKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXggPyBpbmRleCA6IHRoaXMuc2VsZWN0ZWQ7XHJcblx0XHRcdHRoaXMubW9kYWxWaXNpYmxlID0gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG1vZGFsQ2xvc2UoKSB7XHJcblxyXG5cdFx0XHR0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdH1cclxuXHJcblx0dmFyIGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScpO1xyXG5cclxuXHRhcHAuc2VydmljZSgnYXNnU2VydmljZScsIFtcIiR0aW1lb3V0XCIsIFwiJGludGVydmFsXCIsIFNlcnZpY2VDb250cm9sbGVyXSk7XHJcblxyXG59XHJcblxyXG4iLCJtb2R1bGUgQVNHIHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIFNldHVwQ29udHJvbGxlciB7XHJcblxyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdHB1YmxpYyBpdGVtcyA6IEFycmF5PElGaWxlPjtcclxuXHRcdHByaXZhdGUgYXNnIDogSVNlcnZpY2VDb250cm9sbGVyO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZSA6IElTZXJ2aWNlQ29udHJvbGxlcikge1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdHRoaXMuYXNnID0gdGhpcy5zZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMuaWQpO1xyXG5cdFx0XHR0aGlzLm9wdGlvbnMgPSB0aGlzLmFzZy5zZXR1cCh0aGlzLm9wdGlvbnMsIHRoaXMuaXRlbXMpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5Jyk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoXCJhc2dTZXR1cFwiLCB7XHJcblx0XHRjb250cm9sbGVyOiBbXCJhc2dTZXJ2aWNlXCIsIEFTRy5TZXR1cENvbnRyb2xsZXJdLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0aWQ6IFwiQFwiLFxyXG5cdFx0XHRpdGVtczogJz0nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nLFxyXG5cdFx0XHRzZWxlY3RlZDogJz0nLFxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufSJdfQ==

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/asg-image.html','<div class="asg-image" data-ng-style="{\'height\' : $ctrl.asg.options.image.height}">\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.image.transition }}" data-ng-swipe-left="$ctrl.asg.toForward()" data-ng-swipe-right="$ctrl.asg.toBackward()">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.asg.files" data-ng-show="$ctrl.asg.selected == key" data-ng-class="{\'loading\' : !file.loaded}">\r\n\r\n\t\t\t<img class="img-responsive source" data-ng-if="file.loaded" data-ng-src="{{ file.url }}" data-ng-click="$ctrl.asg.modalOpen()">\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>\r\n\r\n\r\n\r\n\r\n');
$templateCache.put('views/asg-modal.html','<script type="text/ng-template" id="help.html">\r\n\tSPACE : forward</br>\r\n\tRIGHT : forward</br>\r\n\tLEFT : backward</br>\r\n\tUP : first</br>\r\n\tDOWN : last</br>\r\n\tESC : exit</br>\r\n\tF : toggle fullscreen</br>\r\n\tG : toggle header</br>\r\n\tH : toggle help\r\n</script>\r\n\r\n<div class="asg-modal {{ $ctrl.id }}" data-ng-class="$ctrl.getClass()" data-ng-click="$ctrl.asg.setFocus()" data-ng-show="$ctrl.asg.modalVisible" data-ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" data-ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="header">\r\n\r\n        <span class="buttons pull-right visible-sm visible-md visible-lg">\r\n\r\n\r\n\t\t\t   <button data-ng-if="!$ctrl.asg.isSingle && $ctrl.asg.options.autoplay.enabled" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.autoPlayStop()">\r\n                    <span class="glyphicon glyphicon-stop"></span>\r\n                </button>\r\n\r\n\t\t\t   <button data-ng-if="!$ctrl.asg.isSingle && !$ctrl.asg.options.autoplay.enabled" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.autoPlayStart()">\r\n                    <span class="glyphicon glyphicon-play"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toFirst(true)">\r\n                    {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toBackward(true)">\r\n                    <span class="glyphicon glyphicon-chevron-left"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.toForward(true)">\r\n                    <span class="glyphicon glyphicon-chevron-right"></span>\r\n                </button>\r\n\r\n             <span data-ng-if="!$ctrl.asg.isSingle && false" class="dropdown">\r\n                    <button class="btn btn-default btn-sm dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                        <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu pull-right">\r\n                        <li class="dropdown-submenu">\r\n                            <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.asg.transitions">\r\n                                    <span data-ng-class="{\'highlight\' : transition == $ctrl.asg.options.modal.transition}">\r\n                                        {{ transition }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTheme(theme)" data-ng-repeat="theme in $ctrl.themes">\r\n                                    <span data-ng-class="{\'highlight\' : theme == $ctrl.asg.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                        <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                    </ul>\r\n                </span>\r\n\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleHeader()">\r\n                    <span data-ng-if="$ctrl.asg.options.modal.header" class="glyphicon glyphicon-chevron-up"></span>\r\n                    <span data-ng-if="!$ctrl.asg.options.modal.header" class="glyphicon glyphicon-chevron-down"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleFullScreen()">\r\n                    <span class="glyphicon glyphicon-fullscreen"></span>\r\n                </button>\r\n\r\n\t\t\t\t<button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleHelp()">\r\n                    <span class="glyphicon glyphicon-question-sign"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.asg.modalClose()">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n\r\n            </span>\r\n\r\n\t\t<span class="buttons pull-right visible-xs">\r\n\r\n\r\n\t\t\t\t \t<button data-ng-if="!$ctrl.asg.isSingle && $ctrl.asg.options.autoplay.enabled" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.autoPlayStop()">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-stop"></span>\r\n\t\t\t\t\t</button>\r\n\r\n\t\t\t\t   <button data-ng-if="!$ctrl.asg.isSingle && !$ctrl.asg.options.autoplay.enabled" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.autoPlayStart()">\r\n\t\t\t\t\t\t<span class="glyphicon glyphicon-play"></span>\r\n\t\t\t\t   </button>\r\n\r\n                    <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.toFirst(true)">\r\n                        {{ $ctrl.asg.selected + 1 }} | {{ $ctrl.asg.files.length }}\r\n                    </button>\r\n\r\n                    <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.toBackward(true)">\r\n                        <span class="glyphicon glyphicon-chevron-left"></span>\r\n                    </button>\r\n\r\n                    <button data-ng-if="!$ctrl.asg.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.toForward(true)">\r\n                        <span class="glyphicon glyphicon-chevron-right"></span>\r\n                    </button>\r\n\r\n                    <span data-ng-if="!$ctrl.asg.isSingle && false" class="dropdown">\r\n                        <button class="btn btn-default btn-xs dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                            <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                        </button>\r\n                        <ul class="dropdown-menu pull-right">\r\n                            <li class="dropdown-submenu">\r\n                                <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                                <ul class="dropdown-menu">\r\n                                    <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.transitions">\r\n                                        <span data-ng-class="{\'highlight\' : transition == $ctrl.transition}">\r\n                                            {{ transition }}</span></a>\r\n                                    </li>\r\n                                </ul>\r\n                            </li>\r\n\t\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTheme(theme)" data-ng-repeat="theme in $ctrl.themes">\r\n                                    <span data-ng-class="{\'highlight\' : theme == $ctrl.asg.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                            <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                        </ul>\r\n                    </span>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleHeader()">\r\n                        <span data-ng-if="$ctrl.asg.options.modal.header" class="glyphicon glyphicon-chevron-up"></span>\r\n                        <span data-ng-if="!$ctrl.asg.options.modal.header" class="glyphicon glyphicon-chevron-down"></span>\r\n                    </button>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleFullScreen()">\r\n                        <span class="glyphicon glyphicon-fullscreen"></span>\r\n                    </button>\r\n\r\n\t\t\t  \t\t<button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleHelp()">\r\n                        <span class="glyphicon glyphicon-question-sign"></span>\r\n                    </button>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.asg.modalClose()">\r\n                        <span class="glyphicon glyphicon-remove"></span>\r\n                    </button>\r\n\r\n                </span>\r\n\r\n\t\t<span data-ng-if="$ctrl.asg.options.modal.title">\r\n\t\t\t<span class="title">{{ $ctrl.asg.options.modal.title }}</span>\r\n\t\t\t<span class="subtitle" data-ng-if="$ctrl.asg.options.modal.subtitle">{{ $ctrl.asg.options.modal.subtitle }}</span>\r\n\t\t</span>\r\n\r\n\t\t<span class="file">{{ $ctrl.asg.file.title }}</span>\r\n\r\n\t</div>\r\n\r\n\t<div class="help text-right" data-ng-click="$ctrl.toggleHelp()" data-ng-show="$ctrl.asg.options.modal.help" data-ng-include src="\'help.html\'"></div>\r\n\r\n\r\n\t<div class="images {{ $ctrl.asg.direction }} {{ $ctrl.asg.options.modal.transition }}" data-ng-mouseover="$ctrl.arrowsShow()" data-ng-mouseleave="$ctrl.arrowsHide()" data-ng-swipe-left="$ctrl.asg.toForward(true)" data-ng-swipe-right="$ctrl.asg.toBackward(true)">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.asg.files" data-ng-show="$ctrl.asg.selected == key" data-ng-class="{\'loading\' : !file.loaded}">\r\n\r\n\t\t\t<img class="source" data-ng-src="{{ file.url }}" data-ng-if="file.loaded">\r\n\r\n\t\t\t<div class="details">\r\n\t\t\t\t<a href="{{ $ctrl.downloadLink() }}" target="_blank">Download</a>\r\n\t\t\t\t<span class="description">{{ $ctrl.asg.file.description }}</span>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.asg.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toBackward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.asg.toBackward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" data-ng-click="$ctrl.toBackward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-sm pull-left visible-xs" data-ng-click="$ctrl.asg.toBackward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.asg.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toForward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.asg.toForward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" data-ng-click="$ctrl.toForward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-sm pull-right visible-xs" data-ng-click="$ctrl.asg.toForward(true)">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-show="$ctrl.arrowsVisible" class="functions">\r\n\t\t</div>\r\n\r\n\t</div>\r\n\r\n\r\n</div>');
$templateCache.put('views/asg-panel.html','<div class="asg-panel">\r\n\r\n\t<div class="row">\r\n\t\t<div class="{{ $ctrl.asg.options.panel.thumbnail.class }}" data-ng-repeat="(key,file) in $ctrl.asg.files">\r\n\t\t\t<div class="thumbnail" href="#{{key}}" data-ng-class="{\'selected\' : $ctrl.asg.selected == key}" data-ng-mouseover="indexShow = true" data-ng-mouseleave="indexShow = false">\r\n\r\n\t\t\t\t<img data-ng-src="{{ file.thumbnail }}" data-ng-click="$ctrl.asg.setSelected(key)" alt="{{ file.title }}">\r\n\t\t\t\t<span class="index" data-ng-if="$ctrl.options.thumbnail.index && indexShow">{{ key + 1 }}</span>\r\n\r\n\t\t\t\t<div class="caption" data-ng-if="$ctrl.options.thumbnail.caption">\r\n\t\t\t\t\t<span>{{ file.title }}</span>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>');}]);