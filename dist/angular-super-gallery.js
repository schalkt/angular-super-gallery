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
                thumbnail: {
                    class: 'col-md-3'
                },
                preload: [0]
            };
            this.help = false;
            this.gui = true;
            this._visible = false;
            this._fullscreen = false;
            this.functionsVisible = false;
            this.transition = 'rotateLR';
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
            angular.forEach(this.files, function (value, key) {
                var source = self.options.baseUrl + value[self.options.fields.url];
                var thumbnail = self.options.baseUrl + (value[self.options.fields.thumbnail] ? value[self.options.fields.thumbnail] : value[self.options.fields.url]);
                self.files[key].source = source;
                self.files[key].thumbnail = thumbnail;
                self.files[key].title = value[self.options.fields.title] ? value[self.options.fields.title] : null;
                self.files[key].description = value[self.options.fields.description] ? value[self.options.fields.description] : null;
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
            img.src = this.files[index].source;
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
            this.transition = transition;
            this.setFocus();
        };
        GalleryViewController.prototype.functionsHide = function () {
            this.functionsVisible = false;
        };
        GalleryViewController.prototype.functionsShow = function () {
            this.functionsVisible = true;
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
                this.toggleGUI();
            }
            if (e.keyCode == 72) {
                this.toggleHelp();
            }
            if (e.keyCode == 84) {
                this.nextTransition();
            }
        };
        GalleryViewController.prototype.nextTransition = function () {
            var idx = this.transitions.indexOf(this.transition) + 1;
            var next = idx >= this.transitions.length ? 0 : idx;
            this.transition = this.transitions[next];
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
            this.help = !this.help;
            this.setFocus();
        };
        GalleryViewController.prototype.toggleGUI = function () {
            this.gui = !this.gui;
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
            files: '=',
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hbmd1bGFyLXN1cGVyLWdhbGxlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBTyxHQUFHLENBOGVUO0FBOWVELFdBQU8sR0FBRztJQW9CVDtRQWtEQywrQkFBb0IsVUFBVSxFQUNuQixPQUFPLEVBQ1AsU0FBUztZQUZBLGVBQVUsR0FBVixVQUFVLENBQUE7WUFDbkIsWUFBTyxHQUFQLE9BQU8sQ0FBQTtZQUNQLGNBQVMsR0FBVCxTQUFTLENBQUE7WUE3Q1osYUFBUSxHQUFHO2dCQUNsQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxRQUFRLEVBQUUsRUFBRTtnQkFDWixPQUFPLEVBQUUsRUFBRTtnQkFDWCxNQUFNLEVBQUU7b0JBQ1AsR0FBRyxFQUFFLEtBQUs7b0JBQ1YsS0FBSyxFQUFFLE9BQU87b0JBQ2QsV0FBVyxFQUFFLGFBQWE7b0JBQzFCLFNBQVMsRUFBRSxXQUFXO2lCQUN0QjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1YsS0FBSyxFQUFFLFVBQVU7aUJBQ2pCO2dCQUNELE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNaLENBQUM7WUFJSyxTQUFJLEdBQWEsS0FBSyxDQUFDO1lBQ3ZCLFFBQUcsR0FBYSxJQUFJLENBQUM7WUFHcEIsYUFBUSxHQUFhLEtBQUssQ0FBQztZQUMzQixnQkFBVyxHQUFhLEtBQUssQ0FBQztZQUc5QixxQkFBZ0IsR0FBYSxLQUFLLENBQUM7WUFDbkMsZUFBVSxHQUFZLFVBQVUsQ0FBQztZQUNqQyxnQkFBVyxHQUFtQjtnQkFDckMsSUFBSTtnQkFDSixXQUFXO2dCQUNYLFdBQVc7Z0JBQ1gsVUFBVTtnQkFDVixVQUFVO2dCQUNWLFVBQVU7Z0JBQ1YsU0FBUztnQkFDVCxTQUFTO2dCQUNULE9BQU87Z0JBQ1AsT0FBTzthQUNQLENBQUM7WUFRRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxFQUFFLEdBQUcsT0FBTyxH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QyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUE7WUFDM0QsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsQ0FBQztnQkFBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBRXBELElBQUksS0FBSyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFDbEQsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFdkQsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlGLENBQUMsQ0FBQTtJQUNGLENBQUMsQ0FBQyxDQUFDO0FBR0osQ0FBQyxFQTllTSxHQUFHLEtBQUgsR0FBRyxRQThlVCIsImZpbGUiOiJhbmd1bGFyLXN1cGVyLWdhbGxlcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5tb2R1bGUgQVNHIHtcclxuXHJcblx0aW50ZXJmYWNlIElPcHRpb25zIHtcclxuXHJcblx0XHR0aXRsZSA6IHN0cmluZztcclxuXHRcdHN1YnRpdGxlIDogc3RyaW5nO1xyXG5cdFx0YmFzZVVybCA6IHN0cmluZztcclxuXHRcdGZpZWxkcyA6IHtcclxuXHRcdFx0dXJsIDogc3RyaW5nO1xyXG5cdFx0XHR0aXRsZSA6IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb24gOiBzdHJpbmc7XHJcblx0XHRcdHRodW1ibmFpbCA6IHN0cmluZztcclxuXHRcdH0sXHJcblx0XHR0aHVtYm5haWwgOiB7XHJcblx0XHRcdGNsYXNzIDogc3RyaW5nO1xyXG5cdFx0fSxcclxuXHRcdHByZWxvYWQgOiBBcnJheTxudW1iZXI+O1xyXG5cclxuXHR9XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBHYWxsZXJ5Vmlld0NvbnRyb2xsZXIge1xyXG5cclxuXHJcblx0XHRwdWJsaWMgZmlsZXMgOiBhbnk7XHJcblx0XHRwdWJsaWMgc2VsZWN0ZWQgOiBudW1iZXI7XHJcblxyXG5cdFx0cHVibGljIG9wdGlvbnMgOiBJT3B0aW9ucztcclxuXHRcdHByaXZhdGUgZGVmYXVsdHMgPSB7XHJcblx0XHRcdHRpdGxlOiBcIlwiLFxyXG5cdFx0XHRzdWJ0aXRsZTogXCJcIixcclxuXHRcdFx0YmFzZVVybDogXCJcIixcclxuXHRcdFx0ZmllbGRzOiB7XHJcblx0XHRcdFx0dXJsOiBcInVybFwiLFxyXG5cdFx0XHRcdHRpdGxlOiBcInRpdGxlXCIsXHJcblx0XHRcdFx0ZGVzY3JpcHRpb246IFwiZGVzY3JpcHRpb25cIixcclxuXHRcdFx0XHR0aHVtYm5haWw6IFwidGh1bWJuYWlsXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0dGh1bWJuYWlsOiB7XHJcblx0XHRcdFx0Y2xhc3M6ICdjb2wtbWQtMydcclxuXHRcdFx0fSxcclxuXHRcdFx0cHJlbG9hZDogWzBdXHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHRwdWJsaWMgZGlyZWN0aW9uIDogc3RyaW5nO1xyXG5cdFx0cHVibGljIGhlbHAgOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHRwdWJsaWMgZ3VpIDogYm9vbGVhbiA9IHRydWU7XHJcblx0XHRwdWJsaWMgaWQgOiBzdHJpbmc7XHJcblxyXG5cdFx0cHJpdmF0ZSBfdmlzaWJsZSA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdHByaXZhdGUgX2Z1bGxzY3JlZW4gOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cclxuXHRcdHByaXZhdGUgZnVuY3Rpb25zVmlzaWJsZSA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdHByaXZhdGUgdHJhbnNpdGlvbiA6IHN0cmluZyA9ICdyb3RhdGVMUic7XHJcblx0XHRwcml2YXRlIHRyYW5zaXRpb25zIDogQXJyYXk8c3RyaW5nPiA9IFtcclxuXHRcdFx0J25vJyxcclxuXHRcdFx0J2ZhZGVJbk91dCcsXHJcblx0XHRcdCd6b29tSW5PdXQnLFxyXG5cdFx0XHQncm90YXRlTFInLFxyXG5cdFx0XHQncm90YXRlVEInLFxyXG5cdFx0XHQncm90YXRlWlknLFxyXG5cdFx0XHQnc2xpZGVMUicsXHJcblx0XHRcdCdzbGlkZVRCJyxcclxuXHRcdFx0J2ZsaXBYJyxcclxuXHRcdFx0J2ZsaXBZJ1xyXG5cdFx0XTtcclxuXHJcblx0XHQvL3Byb3RlY3RlZCBpbmZvVmlzaWJsZSA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIGZ1bGxzY3JlZW4sXHJcblx0XHRcdFx0XHRwcml2YXRlIHRpbWVvdXQsXHJcblx0XHRcdFx0XHRwcml2YXRlIGdhbGxlcnlJZCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuaWQgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy5pZCA9ICdhc2dpZCcgKyB0aGlzLmdhbGxlcnlJZC5nZXROZXh0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyAkb25Jbml0KCkge1xyXG5cclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHR0aGlzLnNldERlZmF1bHRzKCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnByZWxvYWQpIHtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMucHJlbG9hZC5mb3JFYWNoKChpbmRleCA6IG51bWJlcikgPT4ge1xyXG5cdFx0XHRcdFx0c2VsZi5sb2FkSW1hZ2UoaW5kZXgpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBzZXREZWZhdWx0cygpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmZpbGVzID09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHRoaXMuZmlsZXMgPSBbXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuc2VsZWN0ZWQgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy5zZWxlY3RlZCA9IDA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25zID0gdGhpcy5kZWZhdWx0cztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5vcHRpb25zID0gYW5ndWxhci5tZXJnZSh0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHRoaXMuZmlsZXMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XHJcblxyXG5cdFx0XHRcdHZhciBzb3VyY2UgPSBzZWxmLm9wdGlvbnMuYmFzZVVybCArIHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudXJsXTtcclxuXHRcdFx0XHR2YXIgdGh1bWJuYWlsID0gc2VsZi5vcHRpb25zLmJhc2VVcmwgKyAodmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aHVtYm5haWxdID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aHVtYm5haWxdIDogdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy51cmxdKTtcclxuXHJcblx0XHRcdFx0c2VsZi5maWxlc1trZXldLnNvdXJjZSA9IHNvdXJjZTtcclxuXHRcdFx0XHRzZWxmLmZpbGVzW2tleV0udGh1bWJuYWlsID0gdGh1bWJuYWlsO1xyXG5cdFx0XHRcdHNlbGYuZmlsZXNba2V5XS50aXRsZSA9IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy50aXRsZV0gOiBudWxsO1xyXG5cdFx0XHRcdHNlbGYuZmlsZXNba2V5XS5kZXNjcmlwdGlvbiA9IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuZGVzY3JpcHRpb25dID8gdmFsdWVbc2VsZi5vcHRpb25zLmZpZWxkcy5kZXNjcmlwdGlvbl0gOiBudWxsO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBpbml0aWFsaXplIHRoZSBnYWxsZXJ5XHJcblx0XHRwcml2YXRlIGluaXQoKSB7XHJcblxyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHR0aGlzLnRpbWVvdXQoKCkgPT4ge1xyXG5cclxuXHRcdFx0XHQvLyBzdWJtZW51IGNsaWNrIGV2ZW50c1xyXG5cdFx0XHRcdHZhciBlbGVtZW50ID0gJy5nYWxsZXJ5LXZpZXcuJyArIHNlbGYuaWQgKyAnIGxpLmRyb3Bkb3duLXN1Ym1lbnUnO1xyXG5cdFx0XHRcdGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS5vZmYoKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdFx0aWYgKGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5oYXNDbGFzcygnb3BlbicpKSB7XHJcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5hZGRDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHQvLyBzZXQgZm9jdXNcclxuXHRcdFx0XHRzZWxmLnNldEZvY3VzKCk7XHJcblxyXG5cdFx0XHR9LCAxMDApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBpbWFnZSBwcmVsb2FkXHJcblx0XHRwcml2YXRlIHByZWxvYWQod2FpdD8gOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblxyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQpO1xyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKDApO1xyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQgKyAxKTtcclxuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkIC0gMSk7XHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCArIDIpO1xyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuZmlsZXMubGVuZ3RoIC0gMSk7XHJcblxyXG5cdFx0XHR9LCAod2FpdCAhPSB1bmRlZmluZWQpID8gd2FpdCA6IDc1MCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBub3JtYWxpemUoaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHZhciBsYXN0ID0gdGhpcy5maWxlcy5sZW5ndGggLSAxO1xyXG5cclxuXHRcdFx0aWYgKGluZGV4ID4gbGFzdCkge1xyXG5cdFx0XHRcdHJldHVybiAoaW5kZXggLSBsYXN0KSAtIDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChpbmRleCA8IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gbGFzdCAtIE1hdGguYWJzKGluZGV4KSArIDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBpbmRleDtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgbG9hZEltYWdlKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHRpbmRleCA9IHRoaXMubm9ybWFsaXplKGluZGV4KTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5maWxlc1tpbmRleF0pIHtcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ0ludmFsaWQgZmlsZSBpbmRleDogJyArIGluZGV4KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdFx0aW1nLnNyYyA9IHRoaXMuZmlsZXNbaW5kZXhdLnNvdXJjZTtcclxuXHRcdFx0dGhpcy5maWxlc1tpbmRleF0ubG9hZGVkID0gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ2V0IHZpc2libGVcclxuXHRcdHB1YmxpYyBnZXQgdmlzaWJsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLl92aXNpYmxlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdmlzaWJsZVxyXG5cdFx0cHVibGljIHNldCB2aXNpYmxlKHZhbHVlIDogYm9vbGVhbikge1xyXG5cclxuXHRcdFx0dGhpcy5fdmlzaWJsZSA9IHZhbHVlO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuX3Zpc2libGUpIHtcclxuXHJcblx0XHRcdFx0dGhpcy5pbml0KCk7XHJcblx0XHRcdFx0dGhpcy5wcmVsb2FkKDEpO1xyXG5cdFx0XHRcdGFuZ3VsYXIuZWxlbWVudCgnYm9keScpLmFkZENsYXNzKCd5aGlkZGVuJyk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFuZ3VsYXIuZWxlbWVudCgnYm9keScpLnJlbW92ZUNsYXNzKCd5aGlkZGVuJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaXMgc2luZ2xlP1xyXG5cdFx0cHVibGljIGdldCBpc1NpbmdsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmZpbGVzLmxlbmd0aCA+IDEgPyBmYWxzZSA6IHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGUgZm9jdXNcclxuXHRcdHB1YmxpYyBzZXRGb2N1cygpIHtcclxuXHJcblx0XHRcdGFuZ3VsYXIuZWxlbWVudCgnLmdhbGxlcnktdmlldy4nICsgdGhpcy5pZCArICcgLmtleUlucHV0JykudHJpZ2dlcignZm9jdXMnKS5mb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdHJhbnNpdGlvbiBlZmZlY3RcclxuXHRcdHB1YmxpYyBzZXRUcmFuc2l0aW9uKHRyYW5zaXRpb24pIHtcclxuXHJcblx0XHRcdHRoaXMudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcblx0XHRcdHRoaXMuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3ZlcmxheSBhcnJvd3MgaGlkZVxyXG5cdFx0cHVibGljIGZ1bmN0aW9uc0hpZGUoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmZ1bmN0aW9uc1Zpc2libGUgPSBmYWxzZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3ZlcmxheSBhcnJvd3Mgc2hvd1xyXG5cdFx0cHVibGljIGZ1bmN0aW9uc1Nob3coKSB7XHJcblxyXG5cdFx0XHR0aGlzLmZ1bmN0aW9uc1Zpc2libGUgPSB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgdGhlIGRvd25sb2FkIGxpbmtcclxuXHRcdHB1YmxpYyBkb3dubG9hZExpbmsoKSB7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5zZWxlY3RlZCAhPSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLmJhc2VVcmwgKyB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdW3RoaXMub3B0aW9ucy5maWVsZHMudXJsXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgdGhlIGZpbGVcclxuXHRcdHB1YmxpYyBnZXQgZmlsZSgpIHtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmZpbGVzW3RoaXMuc2VsZWN0ZWRdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBiYWNrd2FyZFxyXG5cdFx0cHVibGljIHRvQmFja3dhcmQoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLm5vcm1hbGl6ZSh0aGlzLnNlbGVjdGVkIC0gMSk7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBmb3J3YXJkXHJcblx0XHRwdWJsaWMgdG9Gb3J3YXJkKCkge1xyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLm5vcm1hbGl6ZSh0aGlzLnNlbGVjdGVkICsgMSk7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBmaXJzdFxyXG5cdFx0cHVibGljIHRvRmlyc3QoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdiYWNrd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSAwO1xyXG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZ28gdG8gbGFzdFxyXG5cdFx0cHVibGljIHRvTGFzdCgpIHtcclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2ZvcndhcmQnO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gdGhpcy5maWxlcy5sZW5ndGggLSAxO1xyXG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHB1YmxpYyBvcGVuKGluZGV4IDogbnVtYmVyKSB7XHJcblxyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0gaW5kZXg7XHJcblx0XHRcdHRoaXMudmlzaWJsZSA9IHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGV4aXRcclxuXHRcdHB1YmxpYyBleGl0KCkge1xyXG5cclxuXHRcdFx0dGhpcy52aXNpYmxlID0gZmFsc2U7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGtleW1hcFxyXG5cdFx0cHVibGljIGtleVVwKGUpIHtcclxuXHJcblx0XHRcdC8vIGVzY1xyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDI3KSB7XHJcblx0XHRcdFx0dGhpcy5leGl0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHNwYWNlXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzIpIHtcclxuXHRcdFx0XHR0aGlzLnRvRm9yd2FyZCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBsZWZ0XHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzcpIHtcclxuXHRcdFx0XHR0aGlzLnRvQmFja3dhcmQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gcmlnaHRcclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzOSkge1xyXG5cdFx0XHRcdHRoaXMudG9Gb3J3YXJkKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHVwXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMzggfHwgZS5rZXlDb2RlID09IDM2KSB7XHJcblx0XHRcdFx0dGhpcy50b0ZpcnN0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGRvd25cclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSA0MCB8fCBlLmtleUNvZGUgPT0gMzUpIHtcclxuXHRcdFx0XHR0aGlzLnRvTGFzdCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBmIC0gZnVsbHNjcmVlblxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDcwIHx8IGUua2V5Q29kZSA9PSAxMykge1xyXG5cdFx0XHRcdHRoaXMudG9nZ2xlRnVsbFNjcmVlbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBnIC0gZ3VpXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gNzEpIHtcclxuXHRcdFx0XHR0aGlzLnRvZ2dsZUdVSSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBoIC0gaGVscFxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDcyKSB7XHJcblx0XHRcdFx0dGhpcy50b2dnbGVIZWxwKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHQgLSB0cmFuc2l0aW9uIG5leHRcclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSA4NCkge1xyXG5cdFx0XHRcdHRoaXMubmV4dFRyYW5zaXRpb24oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBzd2l0Y2ggdG8gbmV4dCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHJpdmF0ZSBuZXh0VHJhbnNpdGlvbigpIHtcclxuXHJcblx0XHRcdHZhciBpZHggPSB0aGlzLnRyYW5zaXRpb25zLmluZGV4T2YodGhpcy50cmFuc2l0aW9uKSArIDE7XHJcblx0XHRcdHZhciBuZXh0ID0gaWR4ID49IHRoaXMudHJhbnNpdGlvbnMubGVuZ3RoID8gMCA6IGlkeDtcclxuXHRcdFx0dGhpcy50cmFuc2l0aW9uID0gdGhpcy50cmFuc2l0aW9uc1tuZXh0XTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGZ1bGxzY3JlZW5cclxuXHRcdHByaXZhdGUgdG9nZ2xlRnVsbFNjcmVlbigpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmZ1bGxzY3JlZW4uaXNFbmFibGVkKCkpIHtcclxuXHRcdFx0XHR0aGlzLmZ1bGxzY3JlZW4uY2FuY2VsKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5mdWxsc2NyZWVuLmFsbCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIGhlbHBcclxuXHRcdHByaXZhdGUgdG9nZ2xlSGVscCgpIHtcclxuXHJcblx0XHRcdHRoaXMuaGVscCA9ICF0aGlzLmhlbHA7XHJcblx0XHRcdHRoaXMuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdG9nZ2xlIEdVSVxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVHVUkoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmd1aSA9ICF0aGlzLmd1aTtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gZ2FsbGVyeSB1bmlxdWUgaWQgc2VydmljZVxyXG5cdGV4cG9ydCBjbGFzcyBHYWxsZXJ5SWRTZXJ2aWNlIHtcclxuXHJcblx0XHRwcml2YXRlIGlkID0gMTtcclxuXHJcblx0XHRwdWJsaWMgZ2V0TmV4dCgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuaWQrKztcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHJcblx0dmFyIGFwcCA6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhclN1cGVyR2FsbGVyeScsIFsnbmdBbmltYXRlJ10pO1xyXG5cclxuXHRhcHAuc2VydmljZSgnZ2FsbGVyeUlkJywgR2FsbGVyeUlkU2VydmljZSk7XHJcblxyXG5cdGFwcC5jb21wb25lbnQoXCJnYWxsZXJ5Vmlld1wiLCB7XHJcblx0XHRjb250cm9sbGVyOiBbXCJGdWxsc2NyZWVuXCIsIFwiJHRpbWVvdXRcIiwgXCJnYWxsZXJ5SWRcIiwgQVNHLkdhbGxlcnlWaWV3Q29udHJvbGxlcl0sXHJcblx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FuZ3VsYXItc3VwZXItZ2FsbGVyeS5odG1sJyxcclxuXHRcdGJpbmRpbmdzOiB7XHJcblx0XHRcdHZpc2libGU6ICc9JyxcclxuXHRcdFx0c2VsZWN0ZWQ6ICc8JyxcclxuXHRcdFx0ZmlsZXM6ICc9JyxcclxuXHRcdFx0b3B0aW9uczogJz0/J1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRhcHAucHJvdmlkZXIoJ2FuZ3VsYXJTdXBlckdhbGxlcnlPcHRpb25zJywgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdHZhciBkZWZhdWx0cyA9IHt9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHNldE9wdHM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0XHRcdFx0YW5ndWxhci5leHRlbmQoZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQkZ2V0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH0pO1xyXG5cclxuXHRhcHAuZGlyZWN0aXZlKCdpbWFnZU9ubG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHJlc3RyaWN0OiAnQScsXHJcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMgOiBhbnkpIHtcclxuXHRcdFx0XHRlbGVtZW50LmJpbmQoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRzY29wZS4kYXBwbHkoYXR0cnMuaW1hZ2VPbmxvYWQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH0pO1xyXG5cclxuXHRhcHAuZmlsdGVyKCdieXRlcycsICgpID0+IHtcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoYnl0ZXMgOiBhbnksIHByZWNpc2lvbiA6IG51bWJlcikgOiBzdHJpbmcge1xyXG5cclxuXHRcdFx0aWYgKGlzTmFOKHBhcnNlRmxvYXQoYnl0ZXMpKSB8fCAhaXNGaW5pdGUoYnl0ZXMpKSByZXR1cm4gJydcclxuXHRcdFx0aWYgKGJ5dGVzID09PSAwKSByZXR1cm4gJzAnO1xyXG5cdFx0XHRpZiAodHlwZW9mIHByZWNpc2lvbiA9PT0gJ3VuZGVmaW5lZCcpIHByZWNpc2lvbiA9IDE7XHJcblxyXG5cdFx0XHR2YXIgdW5pdHMgPSBbJ2J5dGVzJywgJ2tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJ10sXHJcblx0XHRcdFx0bnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZygxMDI0KSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gKGJ5dGVzIC8gTWF0aC5wb3coMTAyNCwgTWF0aC5mbG9vcihudW1iZXIpKSkudG9GaXhlZChwcmVjaXNpb24pICsgJyAnICsgdW5pdHNbbnVtYmVyXTtcclxuXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxufVxyXG5cclxuIl19

angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {$templateCache.put('views/angular-super-gallery.html','<div class="gallery-panel">\r\n\r\n\t<div class="row">\r\n\t\t<div class="{{ $ctrl.options.thumbnail.class }}" data-ng-repeat="(key,file) in $ctrl.files">\r\n\t\t\t<a class="thumbnail" href="#{{key}}" data-ng-click="$ctrl.open(key)">\r\n\t\t\t\t<img data-ng-src="{{ file.thumbnail }}" alt="{{ file.title }}">\r\n\t\t\t</a>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>\r\n\r\n<div class="gallery-view {{ $ctrl.id }}" data-ng-class="{\'nogui\' : !$ctrl.gui}" data-ng-click="$ctrl.setFocus()" data-ng-show="$ctrl.visible" data-ng-cloak>\r\n\r\n\t<div tabindex="1" class="keyInput" data-ng-keydown="$ctrl.keyUp($event)"></div>\r\n\r\n\t<div class="header">\r\n\r\n        <span class="buttons pull-right visible-sm visible-md visible-lg">\r\n\r\n                <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.toFirst()">\r\n                    {{ $ctrl.selected + 1 }} | {{ $ctrl.files.length }}\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.toBackward()">\r\n                    <span class="glyphicon glyphicon-chevron-left"></span>\r\n                </button>\r\n\r\n                <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-sm" data-ng-click="$ctrl.toForward()">\r\n                    <span class="glyphicon glyphicon-chevron-right"></span>\r\n                </button>\r\n\r\n             <span data-ng-if="!$ctrl.isSingle" class="dropdown">\r\n                    <button class="btn btn-default btn-sm dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                        <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu pull-right">\r\n                        <li class="dropdown-submenu">\r\n                            <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                            <ul class="dropdown-menu">\r\n                                <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.transitions">\r\n                                    <span data-ng-class="{\'color-highlight\' : transition == $ctrl.transition}">\r\n                                        {{ transition }}</span></a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                        <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                    </ul>\r\n                </span>\r\n\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleGUI()">\r\n                    <span data-ng-if="$ctrl.gui" class="glyphicon glyphicon-chevron-up"></span>\r\n                    <span data-ng-if="!$ctrl.gui" class="glyphicon glyphicon-chevron-down"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.toggleFullScreen()">\r\n                    <span class="glyphicon glyphicon-fullscreen"></span>\r\n                </button>\r\n\r\n                <button class="btn btn-default btn-sm" data-ng-click="$ctrl.exit()">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n\r\n            </span>\r\n\r\n\t\t<span class="buttons pull-right visible-xs">\r\n\r\n                    <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.toFirst()">\r\n                        {{ $ctrl.selected + 1 }} | {{ $ctrl.files.length }}\r\n                    </button>\r\n\r\n                    <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.toBackward()">\r\n                        <span class="glyphicon glyphicon-chevron-left"></span>\r\n                    </button>\r\n\r\n                    <button data-ng-if="!$ctrl.isSingle" class="btn btn-default btn-xs" data-ng-click="$ctrl.toForward()">\r\n                        <span class="glyphicon glyphicon-chevron-right"></span>\r\n                    </button>\r\n\r\n                    <span data-ng-if="!$ctrl.isSingle" class="dropdown">\r\n                        <button class="btn btn-default btn-xs dropdown-toggle ng-binding" type="button" data-toggle="dropdown">\r\n                            <span class="glyphicon glyphicon-menu-hamburger"></span>\r\n                        </button>\r\n                        <ul class="dropdown-menu pull-right">\r\n                            <li class="dropdown-submenu">\r\n                                <a class="transitions" tabindex="-1" href="#">Transitions <span class="caret"></span></a>\r\n                                <ul class="dropdown-menu">\r\n                                    <li><a tabindex="-1" href="#" data-ng-click="$ctrl.setTransition(transition)" data-ng-repeat="transition in $ctrl.transitions">\r\n                                        <span data-ng-class="{\'color-highlight\' : transition == $ctrl.transition}">\r\n                                            {{ transition }}</span></a>\r\n                                    </li>\r\n                                </ul>\r\n                            </li>\r\n                            <li><a href="#" tabindex="-1" data-ng-click="$ctrl.toggleHelp()">Help</a></li>\r\n                        </ul>\r\n                    </span>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleGUI()">\r\n                        <span data-ng-if="$ctrl.gui" class="glyphicon glyphicon-chevron-up"></span>\r\n                        <span data-ng-if="!$ctrl.gui" class="glyphicon glyphicon-chevron-down"></span>\r\n                    </button>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.toggleFullScreen()">\r\n                        <span class="glyphicon glyphicon-fullscreen"></span>\r\n                    </button>\r\n\r\n                    <button class="btn btn-default btn-xs" data-ng-click="$ctrl.exit()">\r\n                        <span class="glyphicon glyphicon-remove"></span>\r\n                    </button>\r\n\r\n                </span>\r\n\r\n\t\t<h2 class="visible-md visible-lg">\r\n\t\t\t{{ $ctrl.options.title }} <span data-ng-if="$ctrl.options.subtitle" class="color-default badge">{{ $ctrl.options.subtitle }}</span>\r\n\t\t</h2>\r\n\r\n\t\t<h3 class="visible-sm">\r\n\t\t\t{{ $ctrl.options.title }} <span data-ng-if="$ctrl.options.subtitle" class="color-default badge">{{ $ctrl.options.subtitle }}</span>\r\n\t\t</h3>\r\n\r\n\t\t<h4 class="visible-xs">\r\n\t\t\t{{ $ctrl.options.title }} <span data-ng-if="$ctrl.options.subtitle" class="color-default badge">{{ $ctrl.options.subtitle }}</span>\r\n\t\t</h4>\r\n\r\n\t</div>\r\n\r\n\t<div class="help text-right" data-ng-click="$ctrl.toggleHelp()" data-ng-show="$ctrl.help">\r\n\t\tSPACE : forward<br>\r\n\t\tRIGHT : forward<br>\r\n\t\tLEFT : backward<br>\r\n\t\tUP : first<br>\r\n\t\tDOWN : last<br>\r\n\t\tESC : exit<br>\r\n\t\tT : change transition<br>\r\n\t\tF : toggle fullscreen<br>\r\n\t\tG : toggle gui<br>\r\n\t\tH : toggle help\r\n\t</div>\r\n\r\n\t<div class="images {{$ctrl.direction}} {{$ctrl.transition }}" data-ng-mouseover="$ctrl.functionsShow()" data-ng-mouseleave="$ctrl.functionsHide()" data-ng-swipe-left="$ctrl.toForward()" data-ng-swipe-right="$ctrl.toBackward()">\r\n\r\n\t\t<div class="img" data-ng-repeat="(key,file) in $ctrl.files" data-ng-show="$ctrl.selected == key" data-ng-class="{\'loading\' : !file.loaded}">\r\n\r\n\t\t\t<div class="source" data-ng-if="file.loaded" data-ng-style="{\'background-image\': \'url({{ file.source }})\'}"></div>\r\n\r\n\t\t\t<div class="description" data-ng-show="$ctrl.functionsVisible">\r\n\t\t\t\t<a href="{{ $ctrl.downloadLink() }}" target="_blank" class="btn btn-default btn-xs">\r\n\t\t\t\t\t<span class="glyphicon glyphicon-picture"></span> {{ $ctrl.file.description ?\r\n\t\t\t\t\t$ctrl.file.description : $ctrl.file.url }}\r\n\t\t\t\t\t| {{ $ctrl.file.size|bytes }}\r\n\t\t\t\t</a>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.isSingle" data-ng-show="$ctrl.functionsVisible" class="toBackward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-left visible-md visible-lg" data-ng-click="$ctrl.toBackward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-left visible-sm" data-ng-click="$ctrl.toBackward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-sm pull-left visible-xs" data-ng-click="$ctrl.toBackward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-left"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-if="!$ctrl.isSingle" data-ng-show="$ctrl.functionsVisible" class="toForward">\r\n\r\n\t\t\t<button class="btn btn-default btn-lg pull-right visible-md visible-lg" data-ng-click="$ctrl.toForward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-md pull-right visible-sm" data-ng-click="$ctrl.toForward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t\t<button class="btn btn-default btn-sm pull-right visible-xs" data-ng-click="$ctrl.toForward()">\r\n\t\t\t\t<span class="glyphicon glyphicon-chevron-right"></span>\r\n\t\t\t</button>\r\n\r\n\t\t</div>\r\n\r\n\t\t<div data-ng-show="$ctrl.functionsVisible" class="functions">\r\n\t\t</div>\r\n\r\n\t</div>\r\n\r\n\r\n</div>\r\n\r\n');}]);