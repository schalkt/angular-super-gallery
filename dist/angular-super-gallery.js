var ASG;
(function (ASG) {
    var GalleryViewController = (function () {
        function GalleryViewController(fullscreen, timeout, galleryId) {
            this.fullscreen = fullscreen;
            this.timeout = timeout;
            this.galleryId = galleryId;
            this.defaults = {
                title: "",
                subtitle: "",
                baseUrl: "",
                fields: {
                    url: "url",
                    title: "title",
                    description: "description",
                    thumbnail: "thumbnail"
                },
                transition: 'rotateLR',
                thumbnail: {
                    class: 'col-md-3'
                },
                preload: [0],
                header: true,
                help: false
            };
            this._visible = false;
            this._fullscreen = false;
            this.arrowsVisible = false;
            this.theme = 'darkblue';
            this.themes = [
                'darkblue',
                'whiteblue'
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
            if (this.id == undefined) {
                this.id = 'asgid' + this.galleryId.getNext();
            }
        }
        GalleryViewController.prototype.$onInit = function () {
            var self = this;
            this.setDefaults();
            if (this.options.preload) {
                this.options.preload.forEach(function (index) {
                    self.loadImage(index);
                });
            }
        };
        GalleryViewController.prototype.setDefaults = function () {
            if (this.items == undefined) {
                this.items = [];
            }
            if (this.files == undefined) {
                this.files = [];
            }
            if (this.selected == undefined) {
                this.selected = 0;
            }
            if (this.options == undefined) {
                this.options = this.defaults;
            }
            this.options = angular.merge(this.defaults, this.options);
            var self = this;
            angular.forEach(this.items, function (value, key) {
                var url = self.options.baseUrl + value[self.options.fields.url];
                var thumbnail = self.options.baseUrl + (value[self.options.fields.thumbnail] ? value[self.options.fields.thumbnail] : value[self.options.fields.url]);
                var filename = url.toString().match(/.*\/(.+?)\./);
                var title = value[self.options.fields.title] ? value[self.options.fields.title] : null;
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
        GalleryViewController.prototype.init = function () {
            var self = this;
            this.timeout(function () {
                var element = '.gallery-view.' + self.id + ' li.dropdown-submenu';
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
        GalleryViewController.prototype.getClass = function () {
            var ngClass = [];
            if (!this.options.header) {
                ngClass.push('noheader');
            }
            ngClass.push(this.theme);
            return ngClass.join(' ');
        };
        GalleryViewController.prototype.preload = function (wait) {
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
        GalleryViewController.prototype.normalize = function (index) {
            var last = this.files.length - 1;
            if (index > last) {
                return (index - last) - 1;
            }
            if (index < 0) {
                return last - Math.abs(index) + 1;
            }
            return index;
        };
        GalleryViewController.prototype.loadImage = function (index) {
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
        Object.defineProperty(GalleryViewController.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            set: function (value) {
                this._visible = value;
                if (this._visible) {
                    this.init();
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
        Object.defineProperty(GalleryViewController.prototype, "isSingle", {
            get: function () {
                return this.files.length > 1 ? false : true;
            },
            enumerable: true,
            configurable: true
        });
        GalleryViewController.prototype.setFocus = function () {
            angular.element('.gallery-view.' + this.id + ' .keyInput').trigger('focus').focus();
        };
        GalleryViewController.prototype.setTransition = function (transition) {
            this.options.transition = transition;
            this.setFocus();
        };
        GalleryViewController.prototype.setTheme = function (theme) {
            this.theme = theme;
            this.setFocus();
        };
        GalleryViewController.prototype.arrowsHide = function () {
            this.arrowsVisible = false;
        };
        GalleryViewController.prototype.arrowsShow = function () {
            this.arrowsVisible = true;
        };
        GalleryViewController.prototype.downloadLink = function () {
            if (this.selected != undefined) {
                return this.options.baseUrl + this.files[this.selected][this.options.fields.url];
            }
        };
        Object.defineProperty(GalleryViewController.prototype, "file", {
            get: function () {
                return this.files[this.selected];
            },
            enumerable: true,
            configurable: true
        });
        GalleryViewController.prototype.toBackward = function () {
            this.direction = 'backward';
            this.selected = this.normalize(this.selected - 1);
            this.preload();
        };
        GalleryViewController.prototype.toForward = function () {
            this.direction = 'forward';
            this.selected = this.normalize(this.selected + 1);
            this.preload();
        };
        GalleryViewController.prototype.toFirst = function () {
            this.direction = 'backward';
            this.selected = 0;
            this.preload();
        };
        GalleryViewController.prototype.toLast = function () {
            this.direction = 'forward';
            this.selected = this.files.length - 1;
            this.preload();
        };
        GalleryViewController.prototype.open = function (index) {
            this.selected = index;
            this.visible = true;
        };
        GalleryViewController.prototype.exit = function () {
            this.visible = false;
        };
        GalleryViewController.prototype.keyUp = function (e) {
            if (e.keyCode == 27) {
                this.exit();
            }
            if (e.keyCode == 32) {
                this.toForward();
            }
            if (e.keyCode == 37) {
                this.toBackward();
            }
            if (e.keyCode == 39) {
                this.toForward();
            }
            if (e.keyCode == 38 || e.keyCode == 36) {
                this.toFirst();
            }
            if (e.keyCode == 40 || e.keyCode == 35) {
                this.toLast();
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
        GalleryViewController.prototype.nextTransition = function () {
            var idx = this.transitions.indexOf(this.options.transition) + 1;
            var next = idx >= this.transitions.length ? 0 : idx;
            this.options.transition = this.transitions[next];
        };
        GalleryViewController.prototype.toggleFullScreen = function () {
            if (this.fullscreen.isEnabled()) {
                this.fullscreen.cancel();
            }
            else {
                this.fullscreen.all();
            }
            this.setFocus();
        };
        GalleryViewController.prototype.toggleHelp = function () {
            this.options.help = !this.options.help;
            this.setFocus();
        };
        GalleryViewController.prototype.toggleHeader = function () {
            this.options.header = !this.options.header;
        };
        return GalleryViewController;
    }());
    ASG.GalleryViewController = GalleryViewController;
    var GalleryIdService = (function () {
        function GalleryIdService() {
            this.id = 1;
        }
        GalleryIdService.prototype.getNext = function () {
            return this.id++;
        };
        return GalleryIdService;
    }());
    ASG.GalleryIdService = GalleryIdService;
    var app = angular.module('angularSuperGallery', ['ngAnimate']);
    app.service('galleryId', GalleryIdService);
    app.component("galleryView", {
        controller: ["Fullscreen", "$timeout", "galleryId", ASG.GalleryViewController],
        templateUrl: 'views/angular-super-gallery.html',
        bindings: {
            visible: '=',
            selected: '<',
            items: '=',
            options: '=?'
        }
    });
    app.provider('angularSuperGalleryOptions', function () {
        var defaults = {};
        return {
            setOpts: function (options) {
                angular.extend(defaults, options);
            },
            $get: function () {
                return defaults;
            }
        };
    });
    app.directive('imageOnload', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('load', function () {
                    scope.$apply(attrs.imageOnload);
                });
            }
        };
    });
    app.filter('bytes', function () {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hbmd1bGFyLXN1cGVyLWdhbGxlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBTyxHQUFHLENBdWlCVDtBQXZpQkQsV0FBTyxHQUFHO0lBcUNUO1FBdURDLCtCQUFvQixVQUFVLEVBQ25CLE9BQU8sRUFDUCxTQUFTO1lBRkEsZUFBVSxHQUFWLFVBQVUsQ0FBQTtZQUNuQixZQUFPLEdBQVAsT0FBTyxDQUFBO1lBQ1AsY0FBUyxHQUFULFNBQVMsQ0FBQTtZQWxEWixhQUFRLEdBQUc7Z0JBQ2xCLEtBQUssRUFBRSxFQUFFO2dCQUNULFFBQVEsRUFBRSxFQUFFO2dCQUNaLE9BQU8sRUFBRSxFQUFFO2dCQUNYLE1BQU0sRUFBRTtvQkFDUCxHQUFHLEVBQUUsS0FBSztvQkFDVixLQUFLLEVBQUUsT0FBTztvQkFDZCxXQUFXLEVBQUUsYUFBYTtvQkFDMUIsU0FBUyxFQUFFLFdBQVc7aUJBQ3RCO2dCQUNELFVBQVUsRUFBRSxVQUFVO2dCQUN0QixTQUFTLEVBQUU7b0JBQ1YsS0FBSyxFQUFFLFVBQVU7aUJBQ2pCO2dCQUNELE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLEVBQUUsSUFBSTtnQkFDWixJQUFJLEVBQUUsS0FBSzthQUNYLENBQUM7WUFNTSxhQUFRLEdBQWEsS0FBSyxDQUFDO1lBQzNCLGdCQUFXLEdBQWEsS0FBSyxDQUFDO1lBQzlCLGtCQUFhLEdBQWEsS0FBSyxDQUFDO1lBRWhDLFVBQUssR0FBWSxVQUFVLENBQUM7WUFDNUIsV0FBTSxHQUFtQjtnQkFDaEMsVUFBVTtnQkFDVixXQUFXO2FBQ1gsQ0FBQztZQUVNLGdCQUFXLEdBQW1CO2dCQUNyQyxJQUFJO2dCQUNKLFdBQVc7Z0JBQ1gsV0FBVztnQkFDWCxVQUFVO2dCQUNWLFVBQVU7Z0JBQ1YsVUFBVTtnQkFDVixTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsT0FBTztnQkFDUCxPQUFPO2FBQ1AsQ0FBQztZQVFELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxF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QUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFDbEQsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFdkQsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlGLENBQUMsQ0FBQTtJQUNGLENBQUMsQ0FBQyxDQUFDO0FBR0osQ0FBQyxFQXZpQk0sR0FBRyxLQUFILEdBQUcsUUF1aUJUIiwiZmlsZSI6ImFuZ3VsYXItc3VwZXItZ2FsbGVyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBBU0cge1xyXG5cclxuXHRpbnRlcmZhY2UgSU9wdGlvbnMge1xyXG5cclxuXHRcdHRpdGxlIDogc3RyaW5nO1xyXG5cdFx0c3VidGl0bGUgOiBzdHJpbmc7XHJcblx0XHRiYXNlVXJsIDogc3RyaW5nO1xyXG5cdFx0ZmllbGRzIDoge1xyXG5cdFx0XHR1cmwgOiBzdHJpbmc7XHJcblx0XHRcdHRpdGxlIDogc3RyaW5nO1xyXG5cdFx0XHRkZXNjcmlwdGlvbiA6IHN0cmluZztcclxuXHRcdFx0dGh1bWJuYWlsIDogc3RyaW5nO1xyXG5cdFx0fSxcclxuXHRcdHRyYW5zaXRpb24gOiBzdHJpbmc7XHJcblx0XHR0aHVtYm5haWwgOiB7XHJcblx0XHRcdGNsYXNzIDogc3RyaW5nO1xyXG5cdFx0fSxcclxuXHRcdHByZWxvYWQgOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0aGVhZGVyIDogYm9vbGVhbjtcclxuXHRcdGhlbHAgOiBib29sZWFuO1xyXG5cclxuXHR9XHJcblxyXG5cclxuXHRpbnRlcmZhY2UgSUZpbGUge1xyXG5cclxuXHRcdHVybCA6IHN0cmluZztcclxuXHRcdHRpdGxlPyA6IHN0cmluZztcclxuXHRcdGRlc2NyaXB0aW9uPyA6IHN0cmluZztcclxuXHRcdHRodW1ibmFpbD8gOiBzdHJpbmc7XHJcblx0XHRsb2FkZWQ/IDogYm9vbGVhbjtcclxuXHRcdHNpemU/IDogbnVtYmVyO1xyXG5cdFx0d2lkdGg/IDogbnVtYmVyO1xyXG5cdFx0aGVpZ2h0PyA6IG51bWJlcjtcclxuXHJcblx0fVxyXG5cclxuXHRleHBvcnQgY2xhc3MgR2FsbGVyeVZpZXdDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaXRlbXMgOiBhbnk7XHJcblxyXG5cdFx0cHVibGljIGZpbGVzIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIHNlbGVjdGVkIDogbnVtYmVyO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdHByaXZhdGUgZGVmYXVsdHMgPSB7XHJcblx0XHRcdHRpdGxlOiBcIlwiLFxyXG5cdFx0XHRzdWJ0aXRsZTogXCJcIixcclxuXHRcdFx0YmFzZVVybDogXCJcIixcclxuXHRcdFx0ZmllbGRzOiB7XHJcblx0XHRcdFx0dXJsOiBcInVybFwiLFxyXG5cdFx0XHRcdHRpdGxlOiBcInRpdGxlXCIsXHJcblx0XHRcdFx0ZGVzY3JpcHRpb246IFwiZGVzY3JpcHRpb25cIixcclxuXHRcdFx0XHR0aHVtYm5haWw6IFwidGh1bWJuYWlsXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0dHJhbnNpdGlvbjogJ3JvdGF0ZUxSJyxcclxuXHRcdFx0dGh1bWJuYWlsOiB7XHJcblx0XHRcdFx0Y2xhc3M6ICdjb2wtbWQtMydcclxuXHRcdFx0fSxcclxuXHRcdFx0cHJlbG9hZDogWzBdLFxyXG5cdFx0XHRoZWFkZXI6IHRydWUsXHJcblx0XHRcdGhlbHA6IGZhbHNlXHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHRwdWJsaWMgZGlyZWN0aW9uIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cclxuXHRcdHByaXZhdGUgX3Zpc2libGUgOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHRwcml2YXRlIF9mdWxsc2NyZWVuIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0cHJpdmF0ZSBhcnJvd3NWaXNpYmxlIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRcdHByaXZhdGUgdGhlbWUgOiBzdHJpbmcgPSAnZGFya2JsdWUnO1xyXG5cdFx0cHJpdmF0ZSB0aGVtZXMgOiBBcnJheTxzdHJpbmc+ID0gW1xyXG5cdFx0XHQnZGFya2JsdWUnLFxyXG5cdFx0XHQnd2hpdGVibHVlJ1xyXG5cdFx0XTtcclxuXHJcblx0XHRwcml2YXRlIHRyYW5zaXRpb25zIDogQXJyYXk8c3RyaW5nPiA9IFtcclxuXHRcdFx0J25vJyxcclxuXHRcdFx0J2ZhZGVJbk91dCcsXHJcblx0XHRcdCd6b29tSW5PdXQnLFxyXG5cdFx0XHQncm90YXRlTFInLFxyXG5cdFx0XHQncm90YXRlVEInLFxyXG5cdFx0XHQncm90YXRlWlknLFxyXG5cdFx0XHQnc2xpZGVMUicsXHJcblx0XHRcdCdzbGlkZVRCJyxcclxuXHRcdFx0J2ZsaXBYJyxcclxuXHRcdFx0J2ZsaXBZJ1xyXG5cdFx0XTtcclxuXHJcblx0XHQvL3Byb3RlY3RlZCBpbmZvVmlzaWJsZSA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIGZ1bGxzY3JlZW4sXHJcblx0XHRcdFx0XHRwcml2YXRlIHRpbWVvdXQsXHJcblx0XHRcdFx0XHRwcml2YXRlIGdhbGxlcnlJZCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuaWQgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy5pZCA9ICdhc2dpZCcgKyB0aGlzLmdhbGxlcnlJZC5nZXROZXh0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHR0aGlzLnNldERlZmF1bHRzKCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnByZWxvYWQpIHtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMucHJlbG9hZC5mb3JFYWNoKChpbmRleCA6IG51bWJlcikgPT4ge1xyXG5cdFx0XHRcdFx0c2VsZi5sb2FkSW1hZ2UoaW5kZXgpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBzZXREZWZhdWx0cygpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLml0ZW1zID09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHRoaXMuaXRlbXMgPSBbXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuZmlsZXMgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy5maWxlcyA9IFtdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5zZWxlY3RlZCA9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHR0aGlzLnNlbGVjdGVkID0gMDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucyA9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMgPSB0aGlzLmRlZmF1bHRzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnMgPSBhbmd1bGFyLm1lcmdlKHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XHJcblxyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRhbmd1bGFyLmZvckVhY2godGhpcy5pdGVtcywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcclxuXHJcblx0XHRcdFx0dmFyIHVybCA9IHNlbGYub3B0aW9ucy5iYXNlVXJsICsgdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy51cmxdO1xyXG5cdFx0XHRcdHZhciB0aHVtYm5haWwgPSBzZWxmLm9wdGlvbnMuYmFzZVVybCArICh2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRodW1ibmFpbF0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRodW1ibmFpbF0gOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnVybF0pO1xyXG5cdFx0XHRcdHZhciBmaWxlbmFtZSA9IHVybC50b1N0cmluZygpLm1hdGNoKC8uKlxcLyguKz8pXFwuLyk7XHJcblx0XHRcdFx0dmFyIHRpdGxlID0gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aXRsZV0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRpdGxlXSA6IG51bGw7XHJcblxyXG5cdFx0XHRcdHZhciBmaWxlID0ge1xyXG5cdFx0XHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdFx0XHR0aHVtYm5haWw6IHRodW1ibmFpbCxcclxuXHRcdFx0XHRcdHRpdGxlOiB0aXRsZSxcclxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuZGVzY3JpcHRpb25dIDogbnVsbCxcclxuXHRcdFx0XHRcdGxvYWRlZDogZmFsc2VcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRzZWxmLmZpbGVzLnB1c2goZmlsZSk7XHJcblxyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBpbml0aWFsaXplIHRoZSBnYWxsZXJ5XHJcblx0XHRwcml2YXRlIGluaXQoKSB7XHJcblxyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cclxuXHRcdFx0XHQvLyBzdWJtZW51IGNsaWNrIGV2ZW50c1xyXG5cdFx0XHRcdHZhciBlbGVtZW50ID0gJy5nYWxsZXJ5LXZpZXcuJyArIHNlbGYuaWQgKyAnIGxpLmRyb3Bkb3duLXN1Ym1lbnUnO1xyXG5cdFx0XHRcdGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS5vZmYoKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdFx0aWYgKGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5oYXNDbGFzcygnb3BlbicpKSB7XHJcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5hZGRDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHQvLyBzZXQgZm9jdXNcclxuXHRcdFx0XHRzZWxmLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0XHR9LCAxMDApO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHJpdmF0ZSBnZXRDbGFzcygpIHtcclxuXHJcblx0XHRcdHZhciBuZ0NsYXNzID0gW107XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMub3B0aW9ucy5oZWFkZXIpIHtcclxuXHRcdFx0XHRuZ0NsYXNzLnB1c2goJ25vaGVhZGVyJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5nQ2xhc3MucHVzaCh0aGlzLnRoZW1lKTtcclxuXHJcblx0XHRcdHJldHVybiBuZ0NsYXNzLmpvaW4oJyAnKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaW1hZ2UgcHJlbG9hZFxyXG5cdFx0cHJpdmF0ZSBwcmVsb2FkKHdhaXQ/IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cclxuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkKTtcclxuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZSgwKTtcclxuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkICsgMSk7XHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCAtIDEpO1xyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQgKyAyKTtcclxuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLmZpbGVzLmxlbmd0aCAtIDEpO1xyXG5cclxuXHRcdFx0fSwgKHdhaXQgIT0gdW5kZWZpbmVkKSA/IHdhaXQgOiA3NTApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgbm9ybWFsaXplKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR2YXIgbGFzdCA9IHRoaXMuZmlsZXMubGVuZ3RoIC0gMTtcclxuXHJcblx0XHRcdGlmIChpbmRleCA+IGxhc3QpIHtcclxuXHRcdFx0XHRyZXR1cm4gKGluZGV4IC0gbGFzdCkgLSAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoaW5kZXggPCAwKSB7XHJcblx0XHRcdFx0cmV0dXJuIGxhc3QgLSBNYXRoLmFicyhpbmRleCkgKyAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gaW5kZXg7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwcml2YXRlIGxvYWRJbWFnZShpbmRleCA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0aW5kZXggPSB0aGlzLm5vcm1hbGl6ZShpbmRleCk7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuZmlsZXNbaW5kZXhdKSB7XHJcblx0XHRcdFx0Y29uc29sZS53YXJuKCdJbnZhbGlkIGZpbGUgaW5kZXg6ICcgKyBpbmRleCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5maWxlc1tpbmRleF0ubG9hZGVkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcblx0XHRcdGltZy5zcmMgPSB0aGlzLmZpbGVzW2luZGV4XS51cmw7XHJcblx0XHRcdHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZCA9IHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgZ2V0IHZpc2libGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5fdmlzaWJsZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHZpc2libGVcclxuXHRcdHB1YmxpYyBzZXQgdmlzaWJsZSh2YWx1ZSA6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRcdHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcclxuXHJcblx0XHRcdGlmICh0aGlzLl92aXNpYmxlKSB7XHJcblxyXG5cdFx0XHRcdHRoaXMuaW5pdCgpO1xyXG5cdFx0XHRcdHRoaXMucHJlbG9hZCgxKTtcclxuXHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKS5hZGRDbGFzcygneWhpZGRlbicpO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKS5yZW1vdmVDbGFzcygneWhpZGRlbicpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGlzIHNpbmdsZT9cclxuXHRcdHB1YmxpYyBnZXQgaXNTaW5nbGUoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5maWxlcy5sZW5ndGggPiAxID8gZmFsc2UgOiB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdGhlIGZvY3VzXHJcblx0XHRwdWJsaWMgc2V0Rm9jdXMoKSB7XHJcblxyXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJy5nYWxsZXJ5LXZpZXcuJyArIHRoaXMuaWQgKyAnIC5rZXlJbnB1dCcpLnRyaWdnZXIoJ2ZvY3VzJykuZm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRwdWJsaWMgc2V0VHJhbnNpdGlvbih0cmFuc2l0aW9uKSB7XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnMudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcblx0XHRcdHRoaXMuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRoZW1lXHJcblx0XHRwdWJsaWMgc2V0VGhlbWUodGhlbWUpIHtcclxuXHJcblx0XHRcdHRoaXMudGhlbWUgPSB0aGVtZTtcclxuXHRcdFx0dGhpcy5zZXRGb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBvdmVybGF5IGFycm93cyBoaWRlXHJcblx0XHRwdWJsaWMgYXJyb3dzSGlkZSgpIHtcclxuXHJcblx0XHRcdHRoaXMuYXJyb3dzVmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBvdmVybGF5IGFycm93cyBzaG93XHJcblx0XHRwdWJsaWMgYXJyb3dzU2hvdygpIHtcclxuXHJcblx0XHRcdHRoaXMuYXJyb3dzVmlzaWJsZSA9IHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCB0aGUgZG93bmxvYWQgbGlua1xyXG5cdFx0cHVibGljIGRvd25sb2FkTGluaygpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLnNlbGVjdGVkICE9IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnMuYmFzZVVybCArIHRoaXMuZmlsZXNbdGhpcy5zZWxlY3RlZF1bdGhpcy5vcHRpb25zLmZpZWxkcy51cmxdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCB0aGUgZmlsZVxyXG5cdFx0cHVibGljIGdldCBmaWxlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuZmlsZXNbdGhpcy5zZWxlY3RlZF07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGJhY2t3YXJkXHJcblx0XHRwdWJsaWMgdG9CYWNrd2FyZCgpIHtcclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2JhY2t3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IHRoaXMubm9ybWFsaXplKHRoaXMuc2VsZWN0ZWQgLSAxKTtcclxuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGZvcndhcmRcclxuXHRcdHB1YmxpYyB0b0ZvcndhcmQoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdmb3J3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IHRoaXMubm9ybWFsaXplKHRoaXMuc2VsZWN0ZWQgKyAxKTtcclxuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGZpcnN0XHJcblx0XHRwdWJsaWMgdG9GaXJzdCgpIHtcclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2JhY2t3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IDA7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBsYXN0XHJcblx0XHRwdWJsaWMgdG9MYXN0KCkge1xyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLmZpbGVzLmxlbmd0aCAtIDE7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIG9wZW4oaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleDtcclxuXHRcdFx0dGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZXhpdFxyXG5cdFx0cHVibGljIGV4aXQoKSB7XHJcblxyXG5cdFx0XHR0aGlzLnZpc2libGUgPSBmYWxzZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8ga2V5bWFwXHJcblx0XHRwdWJsaWMga2V5VXAoZSkge1xyXG5cclxuXHRcdFx0Ly8gZXNjXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMjcpIHtcclxuXHRcdFx0XHR0aGlzLmV4aXQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gc3BhY2VcclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzMikge1xyXG5cdFx0XHRcdHRoaXMudG9Gb3J3YXJkKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGxlZnRcclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzNykge1xyXG5cdFx0XHRcdHRoaXMudG9CYWNrd2FyZCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyByaWdodFxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDM5KSB7XHJcblx0XHRcdFx0dGhpcy50b0ZvcndhcmQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gdXBcclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzOCB8fCBlLmtleUNvZGUgPT0gMzYpIHtcclxuXHRcdFx0XHR0aGlzLnRvRmlyc3QoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gZG93blxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDQwIHx8IGUua2V5Q29kZSA9PSAzNSkge1xyXG5cdFx0XHRcdHRoaXMudG9MYXN0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGYgLSBmdWxsc2NyZWVuXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gNzAgfHwgZS5rZXlDb2RlID09IDEzKSB7XHJcblx0XHRcdFx0dGhpcy50b2dnbGVGdWxsU2NyZWVuKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGcgLSBoZWFkZXJcclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSA3MSkge1xyXG5cdFx0XHRcdHRoaXMudG9nZ2xlSGVhZGVyKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGggLSBoZWxwXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gNzIpIHtcclxuXHRcdFx0XHR0aGlzLnRvZ2dsZUhlbHAoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gdCAtIHRyYW5zaXRpb24gbmV4dFxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDg0KSB7XHJcblx0XHRcdFx0dGhpcy5uZXh0VHJhbnNpdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHN3aXRjaCB0byBuZXh0IHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRwcml2YXRlIG5leHRUcmFuc2l0aW9uKCkge1xyXG5cclxuXHRcdFx0dmFyIGlkeCA9IHRoaXMudHJhbnNpdGlvbnMuaW5kZXhPZih0aGlzLm9wdGlvbnMudHJhbnNpdGlvbikgKyAxO1xyXG5cdFx0XHR2YXIgbmV4dCA9IGlkeCA+PSB0aGlzLnRyYW5zaXRpb25zLmxlbmd0aCA/IDAgOiBpZHg7XHJcblx0XHRcdHRoaXMub3B0aW9ucy50cmFuc2l0aW9uID0gdGhpcy50cmFuc2l0aW9uc1tuZXh0XTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGZ1bGxzY3JlZW5cclxuXHRcdHByaXZhdGUgdG9nZ2xlRnVsbFNjcmVlbigpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmZ1bGxzY3JlZW4uaXNFbmFibGVkKCkpIHtcclxuXHRcdFx0XHR0aGlzLmZ1bGxzY3JlZW4uY2FuY2VsKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5mdWxsc2NyZWVuLmFsbCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGhlbHBcclxuXHRcdHByaXZhdGUgdG9nZ2xlSGVscCgpIHtcclxuXHJcblx0XHRcdHRoaXMub3B0aW9ucy5oZWxwID0gIXRoaXMub3B0aW9ucy5oZWxwO1xyXG5cdFx0XHR0aGlzLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBoZWFkZXJcclxuXHRcdHByaXZhdGUgdG9nZ2xlSGVhZGVyKCkge1xyXG5cclxuXHRcdFx0dGhpcy5vcHRpb25zLmhlYWRlciA9ICF0aGlzLm9wdGlvbnMuaGVhZGVyO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHQvLyBnYWxsZXJ5IHVuaXF1ZSBpZCBzZXJ2aWNlXHJcblx0ZXhwb3J0IGNsYXNzIEdhbGxlcnlJZFNlcnZpY2Uge1xyXG5cclxuXHRcdHByaXZhdGUgaWQgPSAxO1xyXG5cclxuXHRcdHB1YmxpYyBnZXROZXh0KCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5pZCsrO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5JywgWyduZ0FuaW1hdGUnXSk7XHJcblxyXG5cdGFwcC5zZXJ2aWNlKCdnYWxsZXJ5SWQnLCBHYWxsZXJ5SWRTZXJ2aWNlKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudChcImdhbGxlcnlWaWV3XCIsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFtcIkZ1bGxzY3JlZW5cIiwgXCIkdGltZW91dFwiLCBcImdhbGxlcnlJZFwiLCBBU0cuR2FsbGVyeVZpZXdDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYW5ndWxhci1zdXBlci1nYWxsZXJ5Lmh0bWwnLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0dmlzaWJsZTogJz0nLFxyXG5cdFx0XHRzZWxlY3RlZDogJzwnLFxyXG5cdFx0XHRpdGVtczogJz0nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdGFwcC5wcm92aWRlcignYW5ndWxhclN1cGVyR2FsbGVyeU9wdGlvbnMnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0dmFyIGRlZmF1bHRzID0ge307XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0c2V0T3B0czogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHRcdFx0XHRhbmd1bGFyLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdCRnZXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdHM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fSk7XHJcblxyXG5cdGFwcC5kaXJlY3RpdmUoJ2ltYWdlT25sb2FkJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVzdHJpY3Q6ICdBJyxcclxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycyA6IGFueSkge1xyXG5cdFx0XHRcdGVsZW1lbnQuYmluZCgnbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHNjb3BlLiRhcHBseShhdHRycy5pbWFnZU9ubG9hZCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fSk7XHJcblxyXG5cdGFwcC5maWx0ZXIoJ2J5dGVzJywgKCkgPT4ge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChieXRlcyA6IGFueSwgcHJlY2lzaW9uIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRpZiAoaXNOYU4ocGFyc2VGbG9hdChieXRlcykpIHx8ICFpc0Zpbml0ZShieXRlcykpIHJldHVybiAnJ1xyXG5cdFx0XHRpZiAoYnl0ZXMgPT09IDApIHJldHVybiAnMCc7XHJcblx0XHRcdGlmICh0eXBlb2YgcHJlY2lzaW9uID09PSAndW5kZWZpbmVkJykgcHJlY2lzaW9uID0gMTtcclxuXHJcblx0XHRcdHZhciB1bml0cyA9IFsnYnl0ZXMnLCAna0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInXSxcclxuXHRcdFx0XHRudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgubG9nKGJ5dGVzKSAvIE1hdGgubG9nKDEwMjQpKTtcclxuXHJcblx0XHRcdHJldHVybiAoYnl0ZXMgLyBNYXRoLnBvdygxMDI0LCBNYXRoLmZsb29yKG51bWJlcikpKS50b0ZpeGVkKHByZWNpc2lvbikgKyAnICcgKyB1bml0c1tudW1iZXJdO1xyXG5cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG59XHJcblxyXG4iXX0=

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/angular-super-gallery.html','<div class="gallery-panel">\r\n\r\n\t<div class="row">\r\n\t\t<div class="{{ $ctrl.options.thumbnail.class }}" data-ng-repeat="(key,file) in $ctrl.files">\r\n\t\t\t<a class="thumbnail" href="#{{key}}" data-ng-click="$ctrl.open(key)">\r\n\t\t\t\t<img data-ng-src="{{ file.thumbnail }}" alt="{{ file.title }}">\r\n\t\t\t</a>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>\r\n\r\n<div class="gallery-view {{ $ctrl.id }}" data-ng-class="$ctrl.getClass()" data-ng-click="$ctrl.setFocus()" data-ng-show="$ctrl.visible" data-ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" data-ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="header">\r\n\r\n        <span class="buttons pull-right visible-sm visible-md visible-lg">\r\n\r\n                <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.toFirst()">\r\n                    {{ $ctrl.selected + 1 }} | {{ $ctrl.files.length }}\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.toBackward()">\r\n                    <span class="glyphicon glyphicon-chevron-left"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.toForward()">\r\n                    <span class="glyphicon glyphicon-chevron-right"></span>\r\n                </button>\r\n\r\n             <span data-ng-if="!$ctrl.isSingle" class="dropdown">\r\n                    <button class="btn btn-default btn-sm dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                        <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu pull-right">\r\n                        <li class="dropdown-submenu">\r\n                            <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.transitions">\r\n                                    <span data-ng-class="{\'highlight\' : transition == $ctrl.transition}">\r\n                                        {{ transition }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTheme(theme)" data-ng-repeat="theme in $ctrl.themes">\r\n                                    <span data-ng-class="{\'highlight\' : theme == $ctrl.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                        <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                    </ul>\r\n                </span>\r\n\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleHeader()">\r\n                    <span data-ng-if="$ctrl.options.header" class="glyphicon glyphicon-chevron-up"></span>\r\n                    <span data-ng-if="!$ctrl.options.header" class="glyphicon glyphicon-chevron-down"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleFullScreen()">\r\n                    <span class="glyphicon glyphicon-fullscreen"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.exit()">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n\r\n            </span>\r\n\r\n\t\t<span class="buttons pull-right visible-xs">\r\n\r\n                    <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.toFirst()">\r\n                        {{ $ctrl.selected + 1 }} | {{ $ctrl.files.length }}\r\n                    </button>\r\n\r\n                    <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.toBackward()">\r\n                        <span class="glyphicon glyphicon-chevron-left"></span>\r\n                    </button>\r\n\r\n                    <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.toForward()">\r\n                        <span class="glyphicon glyphicon-chevron-right"></span>\r\n                    </button>\r\n\r\n                    <span data-ng-if="!$ctrl.isSingle" class="dropdown">\r\n                        <button class="btn btn-default btn-xs dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                            <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                        </button>\r\n                        <ul class="dropdown-menu pull-right">\r\n                            <li class="dropdown-submenu">\r\n                                <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                                <ul class="dropdown-menu">\r\n                                    <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.transitions">\r\n                                        <span data-ng-class="{\'highlight\' : transition == $ctrl.transition}">\r\n                                            {{ transition }}</span></a>\r\n                                    </li>\r\n                                </ul>\r\n                            </li>\r\n\t\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTheme(theme)" data-ng-repeat="theme in $ctrl.themes">\r\n                                    <span data-ng-class="{\'highlight\' : theme == $ctrl.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                            <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                        </ul>\r\n                    </span>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleHeader()">\r\n                        <span data-ng-if="$ctrl.options.header" class="glyphicon glyphicon-chevron-up"></span>\r\n                        <span data-ng-if="!$ctrl.options.header" class="glyphicon glyphicon-chevron-down"></span>\r\n                    </button>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleFullScreen()">\r\n                        <span class="glyphicon glyphicon-fullscreen"></span>\r\n                    </button>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.exit()">\r\n                        <span class="glyphicon glyphicon-remove"></span>\r\n                    </button>\r\n\r\n                </span>\r\n\r\n\t\t<h2 class="visible-md visible-lg">\r\n\t\t\t{{ $ctrl.options.title }} <sup data-ng-if="$ctrl.options.subtitle">{{ $ctrl.options.subtitle }}</sup>\r\n\t\t</h2>\r\n\r\n\t\t<h3 class="visible-sm">\r\n\t\t\t{{ $ctrl.options.title }} <sup data-ng-if="$ctrl.options.subtitle">{{ $ctrl.options.subtitle }}</sup>\r\n\t\t</h3>\r\n\r\n\t\t<h4 class="visible-xs">\r\n\t\t\t{{ $ctrl.options.title }} <sup data-ng-if="$ctrl.options.subtitle">{{ $ctrl.options.subtitle }}</sup>\r\n\t\t</h4>\r\n\r\n\t</div>\r\n\r\n\t<div class="help text-right" data-ng-click="$ctrl.toggleHelp()" data-ng-show="$ctrl.options.help">\r\n\t\tSPACE : forward<br>\r\n\t\tRIGHT : forward<br>\r\n\t\tLEFT : backward<br>\r\n\t\tUP : first<br>\r\n\t\tDOWN : last<br>\r\n\t\tESC : exit<br>\r\n\t\tT : change transition<br>\r\n\t\tF : toggle fullscreen<br>\r\n\t\tG : toggle header<br>\r\n\t\tH : toggle help\r\n\t</div>\r\n\r\n\r\n\t<div class="images {{ $ctrl.direction }} {{ $ctrl.options.transition }}" data-ng-mouseover="$ctrl.arrowsShow()" data-ng-mouseleave="$ctrl.arrowsHide()" data-ng-swipe-left="$ctrl.toForward()" data-ng-swipe-right="$ctrl.toBackward()">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.files" data-ng-show="$ctrl.selected == key" data-ng-class="{\'loading\' : !file.loaded}">\r\n\r\n\t\t\t<img class="source" data-ng-src="{{ file.url }}" data-ng-if="file.loaded">\r\n\r\n\t\t\t<div class="details">\r\n\t\t\t\t<a href="{{ $ctrl.downloadLink() }}" target="_blank">\r\n\t\t\t\t\t<span class="title">{{ $ctrl.file.title }}</span>\r\n\t\t\t\t\t<span class="description">{{ $ctrl.file.description }}</span>\r\n\t\t\t\t</a>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toBackward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.toBackward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" data-ng-click="$ctrl.toBackward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-sm pull-left visible-xs" data-ng-click="$ctrl.toBackward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toForward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.toForward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" data-ng-click="$ctrl.toForward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-sm pull-right visible-xs" data-ng-click="$ctrl.toForward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-show="$ctrl.arrowsVisible" class="functions">\r\n\t\t</div>\r\n\r\n\t</div>\r\n\r\n\r\n</div>\r\n\r\n');}]);