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
                theme: 'darkblue',
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
            ngClass.push(this.options.theme);
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
            this.options.theme = theme;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hbmd1bGFyLXN1cGVyLWdhbGxlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBTyxHQUFHLENBc2lCVDtBQXRpQkQsV0FBTyxHQUFHO0lBc0NUO1FBcURDLCtCQUFvQixVQUFVLEVBQ25CLE9BQU8sRUFDUCxTQUFTO1lBRkEsZUFBVSxHQUFWLFVBQVUsQ0FBQTtZQUNuQixZQUFPLEdBQVAsT0FBTyxDQUFBO1lBQ1AsY0FBUyxHQUFULFNBQVMsQ0FBQTtZQTlDWixhQUFRLEdBQUc7Z0JBQ2xCLEtBQUssRUFBRSxFQUFFO2dCQUNULFFBQVEsRUFBRSxFQUFFO2dCQUNaLE9BQU8sRUFBRSxFQUFFO2dCQUNYLE1BQU0sRUFBRTtvQkFDUCxHQUFHLEVBQUUsS0FBSztvQkFDVixLQUFLLEVBQUUsT0FBTztvQkFDZCxXQUFXLEVBQUUsYUFBYTtvQkFDMUIsU0FBUyxFQUFFLFdBQVc7aUJBQ3RCO2dCQUNELFVBQVUsRUFBRSxVQUFVO2dCQUN0QixLQUFLLEVBQUUsVUFBVTtnQkFDakIsU0FBUyxFQUFFO29CQUNWLEtBQUssRUFBRSxVQUFVO2lCQUNqQjtnQkFDRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osTUFBTSxFQUFFLElBQUk7Z0JBQ1osSUFBSSxFQUFFLEtBQUs7YUFDWCxDQUFDO1lBRU0sYUFBUSxHQUFhLEtBQUssQ0FBQztZQUMzQixnQkFBVyxHQUFhLEtBQUssQ0FBQztZQUM5QixrQkFBYSxHQUFhLEtBQUssQ0FBQztZQUVoQyxXQUFNLEdBQW1CO2dCQUNoQyxVQUFVO2dCQUNWLFdBQVc7YUFDWCxDQUFDO1lBRU0sZ0JBQVcsR0FBbUI7Z0JBQ3JDLElBQUk7Z0JBQ0osV0FBVztnQkFDWCxXQUFXO2dCQUNYLFVBQVU7Z0JBQ1YsVUFBVTtnQkFDVixVQUFVO2dCQUNWLFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxPQUFPO2dCQUNQLE9BQU87YUFDUCxDQUFDO1lBUUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUs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SUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2xELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5RixDQUFDLENBQUE7SUFDRixDQUFDLENBQUMsQ0FBQztBQUdKLENBQUMsRUF0aUJNLEdBQUcsS0FBSCxHQUFHLFFBc2lCVCIsImZpbGUiOiJhbmd1bGFyLXN1cGVyLWdhbGxlcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5tb2R1bGUgQVNHIHtcclxuXHJcblx0aW50ZXJmYWNlIElPcHRpb25zIHtcclxuXHJcblx0XHR0aXRsZSA6IHN0cmluZztcclxuXHRcdHN1YnRpdGxlIDogc3RyaW5nO1xyXG5cdFx0YmFzZVVybCA6IHN0cmluZztcclxuXHRcdGZpZWxkcyA6IHtcclxuXHRcdFx0dXJsIDogc3RyaW5nO1xyXG5cdFx0XHR0aXRsZSA6IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb24gOiBzdHJpbmc7XHJcblx0XHRcdHRodW1ibmFpbCA6IHN0cmluZztcclxuXHRcdH0sXHJcblx0XHR0cmFuc2l0aW9uIDogc3RyaW5nO1xyXG5cdFx0dGhlbWUgOiBzdHJpbmc7XHJcblx0XHR0aHVtYm5haWwgOiB7XHJcblx0XHRcdGNsYXNzIDogc3RyaW5nO1xyXG5cdFx0fSxcclxuXHRcdHByZWxvYWQgOiBBcnJheTxudW1iZXI+O1xyXG5cdFx0aGVhZGVyIDogYm9vbGVhbjtcclxuXHRcdGhlbHAgOiBib29sZWFuO1xyXG5cclxuXHR9XHJcblxyXG5cclxuXHRpbnRlcmZhY2UgSUZpbGUge1xyXG5cclxuXHRcdHVybCA6IHN0cmluZztcclxuXHRcdHRpdGxlPyA6IHN0cmluZztcclxuXHRcdGRlc2NyaXB0aW9uPyA6IHN0cmluZztcclxuXHRcdHRodW1ibmFpbD8gOiBzdHJpbmc7XHJcblx0XHRsb2FkZWQ/IDogYm9vbGVhbjtcclxuXHRcdHNpemU/IDogbnVtYmVyO1xyXG5cdFx0d2lkdGg/IDogbnVtYmVyO1xyXG5cdFx0aGVpZ2h0PyA6IG51bWJlcjtcclxuXHJcblx0fVxyXG5cclxuXHRleHBvcnQgY2xhc3MgR2FsbGVyeVZpZXdDb250cm9sbGVyIHtcclxuXHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblx0XHRwdWJsaWMgZGlyZWN0aW9uIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIGl0ZW1zIDogYW55O1xyXG5cdFx0cHVibGljIGZpbGVzIDogQXJyYXk8SUZpbGU+O1xyXG5cdFx0cHVibGljIHNlbGVjdGVkIDogbnVtYmVyO1xyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHJcblx0XHRwcml2YXRlIGRlZmF1bHRzID0ge1xyXG5cdFx0XHR0aXRsZTogXCJcIixcclxuXHRcdFx0c3VidGl0bGU6IFwiXCIsXHJcblx0XHRcdGJhc2VVcmw6IFwiXCIsXHJcblx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdHVybDogXCJ1cmxcIixcclxuXHRcdFx0XHR0aXRsZTogXCJ0aXRsZVwiLFxyXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBcImRlc2NyaXB0aW9uXCIsXHJcblx0XHRcdFx0dGh1bWJuYWlsOiBcInRodW1ibmFpbFwiXHJcblx0XHRcdH0sXHJcblx0XHRcdHRyYW5zaXRpb246ICdyb3RhdGVMUicsXHJcblx0XHRcdHRoZW1lOiAnZGFya2JsdWUnLFxyXG5cdFx0XHR0aHVtYm5haWw6IHtcclxuXHRcdFx0XHRjbGFzczogJ2NvbC1tZC0zJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRwcmVsb2FkOiBbMF0sXHJcblx0XHRcdGhlYWRlcjogdHJ1ZSxcclxuXHRcdFx0aGVscDogZmFsc2VcclxuXHRcdH07XHJcblxyXG5cdFx0cHJpdmF0ZSBfdmlzaWJsZSA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdHByaXZhdGUgX2Z1bGxzY3JlZW4gOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHRwcml2YXRlIGFycm93c1Zpc2libGUgOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdFx0cHJpdmF0ZSB0aGVtZXMgOiBBcnJheTxzdHJpbmc+ID0gW1xyXG5cdFx0XHQnZGFya2JsdWUnLFxyXG5cdFx0XHQnd2hpdGVibHVlJ1xyXG5cdFx0XTtcclxuXHJcblx0XHRwcml2YXRlIHRyYW5zaXRpb25zIDogQXJyYXk8c3RyaW5nPiA9IFtcclxuXHRcdFx0J25vJyxcclxuXHRcdFx0J2ZhZGVJbk91dCcsXHJcblx0XHRcdCd6b29tSW5PdXQnLFxyXG5cdFx0XHQncm90YXRlTFInLFxyXG5cdFx0XHQncm90YXRlVEInLFxyXG5cdFx0XHQncm90YXRlWlknLFxyXG5cdFx0XHQnc2xpZGVMUicsXHJcblx0XHRcdCdzbGlkZVRCJyxcclxuXHRcdFx0J2ZsaXBYJyxcclxuXHRcdFx0J2ZsaXBZJ1xyXG5cdFx0XTtcclxuXHJcblx0XHQvL3Byb3RlY3RlZCBpbmZvVmlzaWJsZSA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIGZ1bGxzY3JlZW4sXHJcblx0XHRcdFx0XHRwcml2YXRlIHRpbWVvdXQsXHJcblx0XHRcdFx0XHRwcml2YXRlIGdhbGxlcnlJZCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuaWQgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy5pZCA9ICdhc2dpZCcgKyB0aGlzLmdhbGxlcnlJZC5nZXROZXh0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHR0aGlzLnNldERlZmF1bHRzKCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnByZWxvYWQpIHtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMucHJlbG9hZC5mb3JFYWNoKChpbmRleCA6IG51bWJlcikgPT4ge1xyXG5cdFx0XHRcdFx0c2VsZi5sb2FkSW1hZ2UoaW5kZXgpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBzZXREZWZhdWx0cygpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLml0ZW1zID09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHRoaXMuaXRlbXMgPSBbXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuZmlsZXMgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy5maWxlcyA9IFtdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5zZWxlY3RlZCA9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHR0aGlzLnNlbGVjdGVkID0gMDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucyA9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMgPSB0aGlzLmRlZmF1bHRzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnMgPSBhbmd1bGFyLm1lcmdlKHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XHJcblxyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRhbmd1bGFyLmZvckVhY2godGhpcy5pdGVtcywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcclxuXHJcblx0XHRcdFx0dmFyIHVybCA9IHNlbGYub3B0aW9ucy5iYXNlVXJsICsgdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy51cmxdO1xyXG5cdFx0XHRcdHZhciB0aHVtYm5haWwgPSBzZWxmLm9wdGlvbnMuYmFzZVVybCArICh2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRodW1ibmFpbF0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRodW1ibmFpbF0gOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnVybF0pO1xyXG5cdFx0XHRcdHZhciBmaWxlbmFtZSA9IHVybC50b1N0cmluZygpLm1hdGNoKC8uKlxcLyguKz8pXFwuLyk7XHJcblx0XHRcdFx0dmFyIHRpdGxlID0gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aXRsZV0gPyB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRpdGxlXSA6IG51bGw7XHJcblxyXG5cdFx0XHRcdHZhciBmaWxlID0ge1xyXG5cdFx0XHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdFx0XHR0aHVtYm5haWw6IHRodW1ibmFpbCxcclxuXHRcdFx0XHRcdHRpdGxlOiB0aXRsZSxcclxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuZGVzY3JpcHRpb25dIDogbnVsbCxcclxuXHRcdFx0XHRcdGxvYWRlZDogZmFsc2VcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRzZWxmLmZpbGVzLnB1c2goZmlsZSk7XHJcblxyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBpbml0aWFsaXplIHRoZSBnYWxsZXJ5XHJcblx0XHRwcml2YXRlIGluaXQoKSB7XHJcblxyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cclxuXHRcdFx0XHQvLyBzdWJtZW51IGNsaWNrIGV2ZW50c1xyXG5cdFx0XHRcdHZhciBlbGVtZW50ID0gJy5nYWxsZXJ5LXZpZXcuJyArIHNlbGYuaWQgKyAnIGxpLmRyb3Bkb3duLXN1Ym1lbnUnO1xyXG5cdFx0XHRcdGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS5vZmYoKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdFx0aWYgKGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5oYXNDbGFzcygnb3BlbicpKSB7XHJcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5hZGRDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHQvLyBzZXQgZm9jdXNcclxuXHRcdFx0XHRzZWxmLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0XHR9LCAxMDApO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHJpdmF0ZSBnZXRDbGFzcygpIHtcclxuXHJcblx0XHRcdHZhciBuZ0NsYXNzID0gW107XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMub3B0aW9ucy5oZWFkZXIpIHtcclxuXHRcdFx0XHRuZ0NsYXNzLnB1c2goJ25vaGVhZGVyJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5nQ2xhc3MucHVzaCh0aGlzLm9wdGlvbnMudGhlbWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuIG5nQ2xhc3Muam9pbignICcpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBpbWFnZSBwcmVsb2FkXHJcblx0XHRwcml2YXRlIHByZWxvYWQod2FpdD8gOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblxyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQpO1xyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKDApO1xyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQgKyAxKTtcclxuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkIC0gMSk7XHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCArIDIpO1xyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuZmlsZXMubGVuZ3RoIC0gMSk7XHJcblxyXG5cdFx0XHR9LCAod2FpdCAhPSB1bmRlZmluZWQpID8gd2FpdCA6IDc1MCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBub3JtYWxpemUoaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHZhciBsYXN0ID0gdGhpcy5maWxlcy5sZW5ndGggLSAxO1xyXG5cclxuXHRcdFx0aWYgKGluZGV4ID4gbGFzdCkge1xyXG5cdFx0XHRcdHJldHVybiAoaW5kZXggLSBsYXN0KSAtIDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChpbmRleCA8IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gbGFzdCAtIE1hdGguYWJzKGluZGV4KSArIDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBpbmRleDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgbG9hZEltYWdlKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpbmRleCA9IHRoaXMubm9ybWFsaXplKGluZGV4KTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5maWxlc1tpbmRleF0pIHtcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ0ludmFsaWQgZmlsZSBpbmRleDogJyArIGluZGV4KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdFx0aW1nLnNyYyA9IHRoaXMuZmlsZXNbaW5kZXhdLnVybDtcclxuXHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubG9hZGVkID0gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHZpc2libGVcclxuXHRcdHB1YmxpYyBnZXQgdmlzaWJsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLl92aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdmlzaWJsZVxyXG5cdFx0cHVibGljIHNldCB2aXNpYmxlKHZhbHVlIDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0dGhpcy5fdmlzaWJsZSA9IHZhbHVlO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuX3Zpc2libGUpIHtcclxuXHJcblx0XHRcdFx0dGhpcy5pbml0KCk7XHJcblx0XHRcdFx0dGhpcy5wcmVsb2FkKDEpO1xyXG5cdFx0XHRcdGFuZ3VsYXIuZWxlbWVudCgnYm9keScpLmFkZENsYXNzKCd5aGlkZGVuJyk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFuZ3VsYXIuZWxlbWVudCgnYm9keScpLnJlbW92ZUNsYXNzKCd5aGlkZGVuJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaXMgc2luZ2xlP1xyXG5cdFx0cHVibGljIGdldCBpc1NpbmdsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmZpbGVzLmxlbmd0aCA+IDEgPyBmYWxzZSA6IHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGUgZm9jdXNcclxuXHRcdHB1YmxpYyBzZXRGb2N1cygpIHtcclxuXHJcblx0XHRcdGFuZ3VsYXIuZWxlbWVudCgnLmdhbGxlcnktdmlldy4nICsgdGhpcy5pZCArICcgLmtleUlucHV0JykudHJpZ2dlcignZm9jdXMnKS5mb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdHJhbnNpdGlvbiBlZmZlY3RcclxuXHRcdHB1YmxpYyBzZXRUcmFuc2l0aW9uKHRyYW5zaXRpb24pIHtcclxuXHJcblx0XHRcdHRoaXMub3B0aW9ucy50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcclxuXHRcdFx0dGhpcy5zZXRGb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdGhlbWVcclxuXHRcdHB1YmxpYyBzZXRUaGVtZSh0aGVtZSkge1xyXG5cclxuXHRcdFx0dGhpcy5vcHRpb25zLnRoZW1lID0gdGhlbWU7XHJcblx0XHRcdHRoaXMuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3ZlcmxheSBhcnJvd3MgaGlkZVxyXG5cdFx0cHVibGljIGFycm93c0hpZGUoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFycm93c1Zpc2libGUgPSBmYWxzZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3ZlcmxheSBhcnJvd3Mgc2hvd1xyXG5cdFx0cHVibGljIGFycm93c1Nob3coKSB7XHJcblxyXG5cdFx0XHR0aGlzLmFycm93c1Zpc2libGUgPSB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgdGhlIGRvd25sb2FkIGxpbmtcclxuXHRcdHB1YmxpYyBkb3dubG9hZExpbmsoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5zZWxlY3RlZCAhPSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLmJhc2VVcmwgKyB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdW3RoaXMub3B0aW9ucy5maWVsZHMudXJsXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgdGhlIGZpbGVcclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBiYWNrd2FyZFxyXG5cdFx0cHVibGljIHRvQmFja3dhcmQoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLm5vcm1hbGl6ZSh0aGlzLnNlbGVjdGVkIC0gMSk7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBmb3J3YXJkXHJcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKCkge1xyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLm5vcm1hbGl6ZSh0aGlzLnNlbGVjdGVkICsgMSk7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBmaXJzdFxyXG5cdFx0cHVibGljIHRvRmlyc3QoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSAwO1xyXG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gbGFzdFxyXG5cdFx0cHVibGljIHRvTGFzdCgpIHtcclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2ZvcndhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5maWxlcy5sZW5ndGggLSAxO1xyXG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBvcGVuKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXg7XHJcblx0XHRcdHRoaXMudmlzaWJsZSA9IHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGV4aXRcclxuXHRcdHB1YmxpYyBleGl0KCkge1xyXG5cclxuXHRcdFx0dGhpcy52aXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGtleW1hcFxyXG5cdFx0cHVibGljIGtleVVwKGUpIHtcclxuXHJcblx0XHRcdC8vIGVzY1xyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDI3KSB7XHJcblx0XHRcdFx0dGhpcy5leGl0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHNwYWNlXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzIpIHtcclxuXHRcdFx0XHR0aGlzLnRvRm9yd2FyZCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBsZWZ0XHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzcpIHtcclxuXHRcdFx0XHR0aGlzLnRvQmFja3dhcmQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gcmlnaHRcclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzOSkge1xyXG5cdFx0XHRcdHRoaXMudG9Gb3J3YXJkKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHVwXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzggfHwgZS5rZXlDb2RlID09IDM2KSB7XHJcblx0XHRcdFx0dGhpcy50b0ZpcnN0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGRvd25cclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSA0MCB8fCBlLmtleUNvZGUgPT0gMzUpIHtcclxuXHRcdFx0XHR0aGlzLnRvTGFzdCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBmIC0gZnVsbHNjcmVlblxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDcwIHx8IGUua2V5Q29kZSA9PSAxMykge1xyXG5cdFx0XHRcdHRoaXMudG9nZ2xlRnVsbFNjcmVlbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBnIC0gaGVhZGVyXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gNzEpIHtcclxuXHRcdFx0XHR0aGlzLnRvZ2dsZUhlYWRlcigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBoIC0gaGVscFxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDcyKSB7XHJcblx0XHRcdFx0dGhpcy50b2dnbGVIZWxwKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHQgLSB0cmFuc2l0aW9uIG5leHRcclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSA4NCkge1xyXG5cdFx0XHRcdHRoaXMubmV4dFRyYW5zaXRpb24oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzd2l0Y2ggdG8gbmV4dCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHJpdmF0ZSBuZXh0VHJhbnNpdGlvbigpIHtcclxuXHJcblx0XHRcdHZhciBpZHggPSB0aGlzLnRyYW5zaXRpb25zLmluZGV4T2YodGhpcy5vcHRpb25zLnRyYW5zaXRpb24pICsgMTtcclxuXHRcdFx0dmFyIG5leHQgPSBpZHggPj0gdGhpcy50cmFuc2l0aW9ucy5sZW5ndGggPyAwIDogaWR4O1xyXG5cdFx0XHR0aGlzLm9wdGlvbnMudHJhbnNpdGlvbiA9IHRoaXMudHJhbnNpdGlvbnNbbmV4dF07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBmdWxsc2NyZWVuXHJcblx0XHRwcml2YXRlIHRvZ2dsZUZ1bGxTY3JlZW4oKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5mdWxsc2NyZWVuLmlzRW5hYmxlZCgpKSB7XHJcblx0XHRcdFx0dGhpcy5mdWxsc2NyZWVuLmNhbmNlbCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuZnVsbHNjcmVlbi5hbGwoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRvZ2dsZSBoZWxwXHJcblx0XHRwcml2YXRlIHRvZ2dsZUhlbHAoKSB7XHJcblxyXG5cdFx0XHR0aGlzLm9wdGlvbnMuaGVscCA9ICF0aGlzLm9wdGlvbnMuaGVscDtcclxuXHRcdFx0dGhpcy5zZXRGb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgaGVhZGVyXHJcblx0XHRwcml2YXRlIHRvZ2dsZUhlYWRlcigpIHtcclxuXHJcblx0XHRcdHRoaXMub3B0aW9ucy5oZWFkZXIgPSAhdGhpcy5vcHRpb25zLmhlYWRlcjtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gZ2FsbGVyeSB1bmlxdWUgaWQgc2VydmljZVxyXG5cdGV4cG9ydCBjbGFzcyBHYWxsZXJ5SWRTZXJ2aWNlIHtcclxuXHJcblx0XHRwcml2YXRlIGlkID0gMTtcclxuXHJcblx0XHRwdWJsaWMgZ2V0TmV4dCgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuaWQrKztcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHJcblx0dmFyIGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScsIFsnbmdBbmltYXRlJ10pO1xyXG5cclxuXHRhcHAuc2VydmljZSgnZ2FsbGVyeUlkJywgR2FsbGVyeUlkU2VydmljZSk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoXCJnYWxsZXJ5Vmlld1wiLCB7XHJcblx0XHRjb250cm9sbGVyOiBbXCJGdWxsc2NyZWVuXCIsIFwiJHRpbWVvdXRcIiwgXCJnYWxsZXJ5SWRcIiwgQVNHLkdhbGxlcnlWaWV3Q29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FuZ3VsYXItc3VwZXItZ2FsbGVyeS5odG1sJyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdHZpc2libGU6ICc9JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc8JyxcclxuXHRcdFx0aXRlbXM6ICc9JyxcclxuXHRcdFx0b3B0aW9uczogJz0/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRhcHAucHJvdmlkZXIoJ2FuZ3VsYXJTdXBlckdhbGxlcnlPcHRpb25zJywgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdHZhciBkZWZhdWx0cyA9IHt9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHNldE9wdHM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0XHRcdFx0YW5ndWxhci5leHRlbmQoZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQkZ2V0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH0pO1xyXG5cclxuXHRhcHAuZGlyZWN0aXZlKCdpbWFnZU9ubG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHJlc3RyaWN0OiAnQScsXHJcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMgOiBhbnkpIHtcclxuXHRcdFx0XHRlbGVtZW50LmJpbmQoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRzY29wZS4kYXBwbHkoYXR0cnMuaW1hZ2VPbmxvYWQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH0pO1xyXG5cclxuXHRhcHAuZmlsdGVyKCdieXRlcycsICgpID0+IHtcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoYnl0ZXMgOiBhbnksIHByZWNpc2lvbiA6IG51bWJlcikgOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0aWYgKGlzTmFOKHBhcnNlRmxvYXQoYnl0ZXMpKSB8fCAhaXNGaW5pdGUoYnl0ZXMpKSByZXR1cm4gJydcclxuXHRcdFx0aWYgKGJ5dGVzID09PSAwKSByZXR1cm4gJzAnO1xyXG5cdFx0XHRpZiAodHlwZW9mIHByZWNpc2lvbiA9PT0gJ3VuZGVmaW5lZCcpIHByZWNpc2lvbiA9IDE7XHJcblxyXG5cdFx0XHR2YXIgdW5pdHMgPSBbJ2J5dGVzJywgJ2tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJ10sXHJcblx0XHRcdFx0bnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZygxMDI0KSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gKGJ5dGVzIC8gTWF0aC5wb3coMTAyNCwgTWF0aC5mbG9vcihudW1iZXIpKSkudG9GaXhlZChwcmVjaXNpb24pICsgJyAnICsgdW5pdHNbbnVtYmVyXTtcclxuXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxufVxyXG5cclxuIl19

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/angular-super-gallery.html','<div class="gallery-panel">\r\n\r\n\t<div class="row">\r\n\t\t<div class="{{ $ctrl.options.thumbnail.class }}" data-ng-repeat="(key,file) in $ctrl.files">\r\n\t\t\t<a class="thumbnail" href="#{{key}}" data-ng-click="$ctrl.open(key)">\r\n\t\t\t\t<img data-ng-src="{{ file.thumbnail }}" alt="{{ file.title }}">\r\n\t\t\t</a>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>\r\n\r\n<div class="gallery-view {{ $ctrl.id }}" data-ng-class="$ctrl.getClass()" data-ng-click="$ctrl.setFocus()" data-ng-show="$ctrl.visible" data-ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" data-ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="header">\r\n\r\n        <span class="buttons pull-right visible-sm visible-md visible-lg">\r\n\r\n                <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.toFirst()">\r\n                    {{ $ctrl.selected + 1 }} | {{ $ctrl.files.length }}\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.toBackward()">\r\n                    <span class="glyphicon glyphicon-chevron-left"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.toForward()">\r\n                    <span class="glyphicon glyphicon-chevron-right"></span>\r\n                </button>\r\n\r\n             <span data-ng-if="!$ctrl.isSingle" class="dropdown">\r\n                    <button class="btn btn-default btn-sm dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                        <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu pull-right">\r\n                        <li class="dropdown-submenu">\r\n                            <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.transitions">\r\n                                    <span data-ng-class="{\'highlight\' : transition == $ctrl.transition}">\r\n                                        {{ transition }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTheme(theme)" data-ng-repeat="theme in $ctrl.themes">\r\n                                    <span data-ng-class="{\'highlight\' : theme == $ctrl.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                        <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                    </ul>\r\n                </span>\r\n\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleHeader()">\r\n                    <span data-ng-if="$ctrl.options.header" class="glyphicon glyphicon-chevron-up"></span>\r\n                    <span data-ng-if="!$ctrl.options.header" class="glyphicon glyphicon-chevron-down"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleFullScreen()">\r\n                    <span class="glyphicon glyphicon-fullscreen"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.exit()">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n\r\n            </span>\r\n\r\n\t\t<span class="buttons pull-right visible-xs">\r\n\r\n                    <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.toFirst()">\r\n                        {{ $ctrl.selected + 1 }} | {{ $ctrl.files.length }}\r\n                    </button>\r\n\r\n                    <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.toBackward()">\r\n                        <span class="glyphicon glyphicon-chevron-left"></span>\r\n                    </button>\r\n\r\n                    <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.toForward()">\r\n                        <span class="glyphicon glyphicon-chevron-right"></span>\r\n                    </button>\r\n\r\n                    <span data-ng-if="!$ctrl.isSingle" class="dropdown">\r\n                        <button class="btn btn-default btn-xs dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                            <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                        </button>\r\n                        <ul class="dropdown-menu pull-right">\r\n                            <li class="dropdown-submenu">\r\n                                <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                                <ul class="dropdown-menu">\r\n                                    <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.transitions">\r\n                                        <span data-ng-class="{\'highlight\' : transition == $ctrl.transition}">\r\n                                            {{ transition }}</span></a>\r\n                                    </li>\r\n                                </ul>\r\n                            </li>\r\n\t\t\t\t\t\t\t<li class="dropdown-submenu">\r\n                            <a class="themes" tabindex="-1" href="#">Themes <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTheme(theme)" data-ng-repeat="theme in $ctrl.themes">\r\n                                    <span data-ng-class="{\'highlight\' : theme == $ctrl.options.theme}">\r\n                                        {{ theme }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                            <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                        </ul>\r\n                    </span>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleHeader()">\r\n                        <span data-ng-if="$ctrl.options.header" class="glyphicon glyphicon-chevron-up"></span>\r\n                        <span data-ng-if="!$ctrl.options.header" class="glyphicon glyphicon-chevron-down"></span>\r\n                    </button>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleFullScreen()">\r\n                        <span class="glyphicon glyphicon-fullscreen"></span>\r\n                    </button>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.exit()">\r\n                        <span class="glyphicon glyphicon-remove"></span>\r\n                    </button>\r\n\r\n                </span>\r\n\r\n\t\t<h2 class="visible-md visible-lg">\r\n\t\t\t{{ $ctrl.options.title }} <sup data-ng-if="$ctrl.options.subtitle">{{ $ctrl.options.subtitle }}</sup>\r\n\t\t</h2>\r\n\r\n\t\t<h3 class="visible-sm">\r\n\t\t\t{{ $ctrl.options.title }} <sup data-ng-if="$ctrl.options.subtitle">{{ $ctrl.options.subtitle }}</sup>\r\n\t\t</h3>\r\n\r\n\t\t<h4 class="visible-xs">\r\n\t\t\t{{ $ctrl.options.title }} <sup data-ng-if="$ctrl.options.subtitle">{{ $ctrl.options.subtitle }}</sup>\r\n\t\t</h4>\r\n\r\n\t</div>\r\n\r\n\t<div class="help text-right" data-ng-click="$ctrl.toggleHelp()" data-ng-show="$ctrl.options.help">\r\n\t\tSPACE : forward<br>\r\n\t\tRIGHT : forward<br>\r\n\t\tLEFT : backward<br>\r\n\t\tUP : first<br>\r\n\t\tDOWN : last<br>\r\n\t\tESC : exit<br>\r\n\t\tT : change transition<br>\r\n\t\tF : toggle fullscreen<br>\r\n\t\tG : toggle header<br>\r\n\t\tH : toggle help\r\n\t</div>\r\n\r\n\r\n\t<div class="images {{ $ctrl.direction }} {{ $ctrl.options.transition }}" data-ng-mouseover="$ctrl.arrowsShow()" data-ng-mouseleave="$ctrl.arrowsHide()" data-ng-swipe-left="$ctrl.toForward()" data-ng-swipe-right="$ctrl.toBackward()">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.files" data-ng-show="$ctrl.selected == key" data-ng-class="{\'loading\' : !file.loaded}">\r\n\r\n\t\t\t<img class="source" data-ng-src="{{ file.url }}" data-ng-if="file.loaded">\r\n\r\n\t\t\t<div class="details">\r\n\t\t\t\t<a href="{{ $ctrl.downloadLink() }}" target="_blank">\r\n\t\t\t\t\t<span class="title">{{ $ctrl.file.title }}</span>\r\n\t\t\t\t\t<span class="description">{{ $ctrl.file.description }}</span>\r\n\t\t\t\t</a>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toBackward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.toBackward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" data-ng-click="$ctrl.toBackward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-sm pull-left visible-xs" data-ng-click="$ctrl.toBackward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.isSingle" data-ng-show="$ctrl.arrowsVisible" class="toForward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.toForward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" data-ng-click="$ctrl.toForward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-sm pull-right visible-xs" data-ng-click="$ctrl.toForward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-show="$ctrl.arrowsVisible" class="functions">\r\n\t\t</div>\r\n\r\n\t</div>\r\n\r\n\r\n</div>\r\n\r\n');}]);