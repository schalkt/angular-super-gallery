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
                    description: "description"
                },
                thumbnail: {
                    class: 'col-md-3'
                }
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
            this.setDefaults();
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
                self.files[key].source = source;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hbmd1bGFyLXN1cGVyLWdhbGxlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsSUFBTyxHQUFHLENBa2VUO0FBbGVELFdBQU8sR0FBRztJQWtCVDtRQWdEQywrQkFBb0IsVUFBVSxFQUNuQixPQUFPLEVBQ1AsU0FBUztZQUZBLGVBQVUsR0FBVixVQUFVLENBQUE7WUFDbkIsWUFBTyxHQUFQLE9BQU8sQ0FBQTtZQUNQLGNBQVMsR0FBVCxTQUFTLENBQUE7WUEzQ1osYUFBUSxHQUFHO2dCQUNsQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxRQUFRLEVBQUUsRUFBRTtnQkFDWixPQUFPLEVBQUUsRUFBRTtnQkFDWCxNQUFNLEVBQUU7b0JBQ1AsR0FBRyxFQUFFLEtBQUs7b0JBQ1YsS0FBSyxFQUFFLE9BQU87b0JBQ2QsV0FBVyxFQUFFLGFBQWE7aUJBQzFCO2dCQUNELFNBQVMsRUFBRTtvQkFDVixLQUFLLEVBQUUsVUFBVTtpQkFDakI7YUFDRCxDQUFDO1lBSUssU0FBSSxHQUFhLEtBQUssQ0FBQztZQUN2QixRQUFHLEdBQWEsSUFBSSxDQUFDO1lBR3BCLGFBQVEsR0FBYSxLQUFLLENBQUM7WUFDM0IsZ0JBQVcsR0FBYSxLQUFLLENBQUM7WUFHOUIscUJBQWdCLEdBQWEsS0FBSyxDQUFDO1lBQ25DLGVBQVUsR0FBWSxVQUFVLENBQUM7WUFDakMsZ0JBQVcsR0FBbUI7Z0JBQ3JDLElBQUk7Z0JBQ0osV0FBVztnQkFDWCxXQUFXO2dCQUNYLFVBQVU7Z0JBQ1YsVUFBVTtnQkFDVixVQUFVO2dCQUNWLFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxPQUFPO2dCQUNQLE9BQU87YUFDUCxDQUFDO1lBUUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixJQUFJLENBQUMsRUFBRSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzlDLENBQUM7UUFF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QyxDQUFDO0FBR0osQ0FBQyxFQWxlTSxHQUFHLEtBQUgsR0FBRyxRQWtlVCIsImZpbGUiOiJhbmd1bGFyLXN1cGVyLWdhbGxlcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5tb2R1bGUgQVNHIHtcclxuXHJcblx0aW50ZXJmYWNlIElPcHRpb25zIHtcclxuXHJcblx0XHR0aXRsZSA6IHN0cmluZztcclxuXHRcdHN1YnRpdGxlIDogc3RyaW5nO1xyXG5cdFx0YmFzZVVybCA6IHN0cmluZztcclxuXHRcdGZpZWxkcyA6IHtcclxuXHRcdFx0dXJsIDogc3RyaW5nO1xyXG5cdFx0XHR0aXRsZSA6IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb24gOiBzdHJpbmc7XHJcblx0XHR9LFxyXG5cdFx0dGh1bWJuYWlsIDoge1xyXG5cdFx0XHRjbGFzcyA6IHN0cmluZztcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRleHBvcnQgY2xhc3MgR2FsbGVyeVZpZXdDb250cm9sbGVyIHtcclxuXHJcblxyXG5cdFx0cHVibGljIGZpbGVzIDogYW55O1xyXG5cdFx0cHVibGljIHNlbGVjdGVkIDogbnVtYmVyO1xyXG5cclxuXHRcdHB1YmxpYyBvcHRpb25zIDogSU9wdGlvbnM7XHJcblx0XHRwcml2YXRlIGRlZmF1bHRzID0ge1xyXG5cdFx0XHR0aXRsZTogXCJcIixcclxuXHRcdFx0c3VidGl0bGU6IFwiXCIsXHJcblx0XHRcdGJhc2VVcmw6IFwiXCIsXHJcblx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdHVybDogXCJ1cmxcIixcclxuXHRcdFx0XHR0aXRsZTogXCJ0aXRsZVwiLFxyXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBcImRlc2NyaXB0aW9uXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0dGh1bWJuYWlsOiB7XHJcblx0XHRcdFx0Y2xhc3M6ICdjb2wtbWQtMydcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0cHVibGljIGRpcmVjdGlvbiA6IHN0cmluZztcclxuXHRcdHB1YmxpYyBoZWxwIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0cHVibGljIGd1aSA6IGJvb2xlYW4gPSB0cnVlO1xyXG5cdFx0cHVibGljIGlkIDogc3RyaW5nO1xyXG5cclxuXHRcdHByaXZhdGUgX3Zpc2libGUgOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHRwcml2YXRlIF9mdWxsc2NyZWVuIDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHJcblx0XHRwcml2YXRlIGZ1bmN0aW9uc1Zpc2libGUgOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHRwcml2YXRlIHRyYW5zaXRpb24gOiBzdHJpbmcgPSAncm90YXRlTFInO1xyXG5cdFx0cHJpdmF0ZSB0cmFuc2l0aW9ucyA6IEFycmF5PHN0cmluZz4gPSBbXHJcblx0XHRcdCdubycsXHJcblx0XHRcdCdmYWRlSW5PdXQnLFxyXG5cdFx0XHQnem9vbUluT3V0JyxcclxuXHRcdFx0J3JvdGF0ZUxSJyxcclxuXHRcdFx0J3JvdGF0ZVRCJyxcclxuXHRcdFx0J3JvdGF0ZVpZJyxcclxuXHRcdFx0J3NsaWRlTFInLFxyXG5cdFx0XHQnc2xpZGVUQicsXHJcblx0XHRcdCdmbGlwWCcsXHJcblx0XHRcdCdmbGlwWSdcclxuXHRcdF07XHJcblxyXG5cdFx0Ly9wcm90ZWN0ZWQgaW5mb1Zpc2libGUgOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBmdWxsc2NyZWVuLFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSB0aW1lb3V0LFxyXG5cdFx0XHRcdFx0cHJpdmF0ZSBnYWxsZXJ5SWQpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmlkID09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHRoaXMuaWQgPSAnYXNnaWQnICsgdGhpcy5nYWxsZXJ5SWQuZ2V0TmV4dCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwdWJsaWMgJG9uSW5pdCgpIHtcclxuXHJcblx0XHRcdHRoaXMuc2V0RGVmYXVsdHMoKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBzZXREZWZhdWx0cygpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLmZpbGVzID09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHRoaXMuZmlsZXMgPSBbXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuc2VsZWN0ZWQgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy5zZWxlY3RlZCA9IDA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25zID0gdGhpcy5kZWZhdWx0cztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5vcHRpb25zID0gYW5ndWxhci5tZXJnZSh0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHRoaXMuZmlsZXMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XHJcblxyXG5cdFx0XHRcdHZhciBzb3VyY2UgPSBzZWxmLm9wdGlvbnMuYmFzZVVybCArIHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudXJsXTtcclxuXHJcblx0XHRcdFx0c2VsZi5maWxlc1trZXldLnNvdXJjZSA9IHNvdXJjZTtcclxuXHRcdFx0XHRzZWxmLmZpbGVzW2tleV0udGl0bGUgPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLnRpdGxlXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMudGl0bGVdIDogbnVsbDtcclxuXHRcdFx0XHRzZWxmLmZpbGVzW2tleV0uZGVzY3JpcHRpb24gPSB2YWx1ZVtzZWxmLm9wdGlvbnMuZmllbGRzLmRlc2NyaXB0aW9uXSA/IHZhbHVlW3NlbGYub3B0aW9ucy5maWVsZHMuZGVzY3JpcHRpb25dIDogbnVsbDtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIGluaXRpYWxpemUgdGhlIGdhbGxlcnlcclxuXHRcdHByaXZhdGUgaW5pdCgpIHtcclxuXHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdHRoaXMudGltZW91dCgoKSA9PiB7XHJcblxyXG5cdFx0XHRcdC8vIHN1Ym1lbnUgY2xpY2sgZXZlbnRzXHJcblx0XHRcdFx0dmFyIGVsZW1lbnQgPSAnLmdhbGxlcnktdmlldy4nICsgc2VsZi5pZCArICcgbGkuZHJvcGRvd24tc3VibWVudSc7XHJcblx0XHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLm9mZigpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0XHRpZiAoYW5ndWxhci5lbGVtZW50KHRoaXMpLmhhc0NsYXNzKCdvcGVuJykpIHtcclxuXHRcdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KHRoaXMpLmFkZENsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdC8vIHNldCBmb2N1c1xyXG5cdFx0XHRcdHNlbGYuc2V0Rm9jdXMoKTtcclxuXHJcblx0XHRcdH0sIDEwMCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGltYWdlIHByZWxvYWRcclxuXHRcdHByaXZhdGUgcHJlbG9hZCh3YWl0PyA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dGhpcy50aW1lb3V0KCgpID0+IHtcclxuXHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCk7XHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UoMCk7XHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5zZWxlY3RlZCArIDEpO1xyXG5cdFx0XHRcdHRoaXMubG9hZEltYWdlKHRoaXMuc2VsZWN0ZWQgLSAxKTtcclxuXHRcdFx0XHR0aGlzLmxvYWRJbWFnZSh0aGlzLnNlbGVjdGVkICsgMik7XHJcblx0XHRcdFx0dGhpcy5sb2FkSW1hZ2UodGhpcy5maWxlcy5sZW5ndGggLSAxKTtcclxuXHJcblx0XHRcdH0sICh3YWl0ICE9IHVuZGVmaW5lZCkgPyB3YWl0IDogNzUwKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG5vcm1hbGl6ZShpbmRleCA6IG51bWJlcikge1xyXG5cclxuXHRcdFx0dmFyIGxhc3QgPSB0aGlzLmZpbGVzLmxlbmd0aCAtIDE7XHJcblxyXG5cdFx0XHRpZiAoaW5kZXggPiBsYXN0KSB7XHJcblx0XHRcdFx0cmV0dXJuIChpbmRleCAtIGxhc3QpIC0gMTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGluZGV4IDwgMCkge1xyXG5cdFx0XHRcdHJldHVybiBsYXN0IC0gTWF0aC5hYnMoaW5kZXgpICsgMTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGluZGV4O1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHJpdmF0ZSBsb2FkSW1hZ2UoaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdGluZGV4ID0gdGhpcy5ub3JtYWxpemUoaW5kZXgpO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLmZpbGVzW2luZGV4XSkge1xyXG5cdFx0XHRcdGNvbnNvbGUud2FybignSW52YWxpZCBmaWxlIGluZGV4OiAnICsgaW5kZXgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuZmlsZXNbaW5kZXhdLmxvYWRlZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0XHRpbWcuc3JjID0gdGhpcy5maWxlc1tpbmRleF0uc291cmNlO1xyXG5cdFx0XHR0aGlzLmZpbGVzW2luZGV4XS5sb2FkZWQgPSB0cnVlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnZXQgdmlzaWJsZVxyXG5cdFx0cHVibGljIGdldCB2aXNpYmxlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuX3Zpc2libGU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB2aXNpYmxlXHJcblx0XHRwdWJsaWMgc2V0IHZpc2libGUodmFsdWUgOiBib29sZWFuKSB7XHJcblxyXG5cdFx0XHR0aGlzLl92aXNpYmxlID0gdmFsdWU7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fdmlzaWJsZSkge1xyXG5cclxuXHRcdFx0XHR0aGlzLmluaXQoKTtcclxuXHRcdFx0XHR0aGlzLnByZWxvYWQoMSk7XHJcblx0XHRcdFx0YW5ndWxhci5lbGVtZW50KCdib2R5JykuYWRkQ2xhc3MoJ3loaWRkZW4nKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YW5ndWxhci5lbGVtZW50KCdib2R5JykucmVtb3ZlQ2xhc3MoJ3loaWRkZW4nKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBpcyBzaW5nbGU/XHJcblx0XHRwdWJsaWMgZ2V0IGlzU2luZ2xlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuZmlsZXMubGVuZ3RoID4gMSA/IGZhbHNlIDogdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2V0IHRoZSBmb2N1c1xyXG5cdFx0cHVibGljIHNldEZvY3VzKCkge1xyXG5cclxuXHRcdFx0YW5ndWxhci5lbGVtZW50KCcuZ2FsbGVyeS12aWV3LicgKyB0aGlzLmlkICsgJyAua2V5SW5wdXQnKS50cmlnZ2VyKCdmb2N1cycpLmZvY3VzKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0cmFuc2l0aW9uIGVmZmVjdFxyXG5cdFx0cHVibGljIHNldFRyYW5zaXRpb24odHJhbnNpdGlvbikge1xyXG5cclxuXHRcdFx0dGhpcy50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcclxuXHRcdFx0dGhpcy5zZXRGb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBvdmVybGF5IGFycm93cyBoaWRlXHJcblx0XHRwdWJsaWMgZnVuY3Rpb25zSGlkZSgpIHtcclxuXHJcblx0XHRcdHRoaXMuZnVuY3Rpb25zVmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBvdmVybGF5IGFycm93cyBzaG93XHJcblx0XHRwdWJsaWMgZnVuY3Rpb25zU2hvdygpIHtcclxuXHJcblx0XHRcdHRoaXMuZnVuY3Rpb25zVmlzaWJsZSA9IHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCB0aGUgZG93bmxvYWQgbGlua1xyXG5cdFx0cHVibGljIGRvd25sb2FkTGluaygpIHtcclxuXHJcblx0XHRcdGlmICh0aGlzLnNlbGVjdGVkICE9IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnMuYmFzZVVybCArIHRoaXMuZmlsZXNbdGhpcy5zZWxlY3RlZF1bdGhpcy5vcHRpb25zLmZpZWxkcy51cmxdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdldCB0aGUgZmlsZVxyXG5cdFx0cHVibGljIGdldCBmaWxlKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuZmlsZXNbdGhpcy5zZWxlY3RlZF07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGJhY2t3YXJkXHJcblx0XHRwdWJsaWMgdG9CYWNrd2FyZCgpIHtcclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2JhY2t3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IHRoaXMubm9ybWFsaXplKHRoaXMuc2VsZWN0ZWQgLSAxKTtcclxuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGZvcndhcmRcclxuXHRcdHB1YmxpYyB0b0ZvcndhcmQoKSB7XHJcblxyXG5cdFx0XHR0aGlzLmRpcmVjdGlvbiA9ICdmb3J3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IHRoaXMubm9ybWFsaXplKHRoaXMuc2VsZWN0ZWQgKyAxKTtcclxuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGdvIHRvIGZpcnN0XHJcblx0XHRwdWJsaWMgdG9GaXJzdCgpIHtcclxuXHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2JhY2t3YXJkJztcclxuXHRcdFx0dGhpcy5zZWxlY3RlZCA9IDA7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBnbyB0byBsYXN0XHJcblx0XHRwdWJsaWMgdG9MYXN0KCkge1xyXG5cclxuXHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnZm9yd2FyZCc7XHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSB0aGlzLmZpbGVzLmxlbmd0aCAtIDE7XHJcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cHVibGljIG9wZW4oaW5kZXggOiBudW1iZXIpIHtcclxuXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBpbmRleDtcclxuXHRcdFx0dGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZXhpdFxyXG5cdFx0cHVibGljIGV4aXQoKSB7XHJcblxyXG5cdFx0XHR0aGlzLnZpc2libGUgPSBmYWxzZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8ga2V5bWFwXHJcblx0XHRwdWJsaWMga2V5VXAoZSkge1xyXG5cclxuXHRcdFx0Ly8gZXNjXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gMjcpIHtcclxuXHRcdFx0XHR0aGlzLmV4aXQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gc3BhY2VcclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzMikge1xyXG5cdFx0XHRcdHRoaXMudG9Gb3J3YXJkKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGxlZnRcclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzNykge1xyXG5cdFx0XHRcdHRoaXMudG9CYWNrd2FyZCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyByaWdodFxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDM5KSB7XHJcblx0XHRcdFx0dGhpcy50b0ZvcndhcmQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gdXBcclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSAzOCB8fCBlLmtleUNvZGUgPT0gMzYpIHtcclxuXHRcdFx0XHR0aGlzLnRvRmlyc3QoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gZG93blxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDQwIHx8IGUua2V5Q29kZSA9PSAzNSkge1xyXG5cdFx0XHRcdHRoaXMudG9MYXN0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGYgLSBmdWxsc2NyZWVuXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gNzAgfHwgZS5rZXlDb2RlID09IDEzKSB7XHJcblx0XHRcdFx0dGhpcy50b2dnbGVGdWxsU2NyZWVuKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGcgLSBndWlcclxuXHRcdFx0aWYgKGUua2V5Q29kZSA9PSA3MSkge1xyXG5cdFx0XHRcdHRoaXMudG9nZ2xlR1VJKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGggLSBoZWxwXHJcblx0XHRcdGlmIChlLmtleUNvZGUgPT0gNzIpIHtcclxuXHRcdFx0XHR0aGlzLnRvZ2dsZUhlbHAoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gdCAtIHRyYW5zaXRpb24gbmV4dFxyXG5cdFx0XHRpZiAoZS5rZXlDb2RlID09IDg0KSB7XHJcblx0XHRcdFx0dGhpcy5uZXh0VHJhbnNpdGlvbigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHN3aXRjaCB0byBuZXh0IHRyYW5zaXRpb24gZWZmZWN0XHJcblx0XHRwcml2YXRlIG5leHRUcmFuc2l0aW9uKCkge1xyXG5cclxuXHRcdFx0dmFyIGlkeCA9IHRoaXMudHJhbnNpdGlvbnMuaW5kZXhPZih0aGlzLnRyYW5zaXRpb24pICsgMTtcclxuXHRcdFx0dmFyIG5leHQgPSBpZHggPj0gdGhpcy50cmFuc2l0aW9ucy5sZW5ndGggPyAwIDogaWR4O1xyXG5cdFx0XHR0aGlzLnRyYW5zaXRpb24gPSB0aGlzLnRyYW5zaXRpb25zW25leHRdO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgZnVsbHNjcmVlblxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVGdWxsU2NyZWVuKCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuZnVsbHNjcmVlbi5pc0VuYWJsZWQoKSkge1xyXG5cdFx0XHRcdHRoaXMuZnVsbHNjcmVlbi5jYW5jZWwoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmZ1bGxzY3JlZW4uYWxsKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5zZXRGb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgaGVscFxyXG5cdFx0cHJpdmF0ZSB0b2dnbGVIZWxwKCkge1xyXG5cclxuXHRcdFx0dGhpcy5oZWxwID0gIXRoaXMuaGVscDtcclxuXHRcdFx0dGhpcy5zZXRGb2N1cygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvLyB0b2dnbGUgR1VJXHJcblx0XHRwcml2YXRlIHRvZ2dsZUdVSSgpIHtcclxuXHJcblx0XHRcdHRoaXMuZ3VpID0gIXRoaXMuZ3VpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHQvLyBnYWxsZXJ5IHVuaXF1ZSBpZCBzZXJ2aWNlXHJcblx0ZXhwb3J0IGNsYXNzIEdhbGxlcnlJZFNlcnZpY2Uge1xyXG5cclxuXHRcdHByaXZhdGUgaWQgPSAxO1xyXG5cclxuXHRcdHB1YmxpYyBnZXROZXh0KCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5pZCsrO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cclxuXHR2YXIgYXBwIDogbmcuSU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyU3VwZXJHYWxsZXJ5JywgWyduZ0FuaW1hdGUnXSk7XHJcblxyXG5cdGFwcC5zZXJ2aWNlKCdnYWxsZXJ5SWQnLCBHYWxsZXJ5SWRTZXJ2aWNlKTtcclxuXHJcblx0YXBwLmNvbXBvbmVudChcImdhbGxlcnlWaWV3XCIsIHtcclxuXHRcdGNvbnRyb2xsZXI6IFtcIkZ1bGxzY3JlZW5cIiwgXCIkdGltZW91dFwiLCBcImdhbGxlcnlJZFwiLCBBU0cuR2FsbGVyeVZpZXdDb250cm9sbGVyXSxcclxuXHRcdHRlbXBsYXRlVXJsOiAndmlld3MvYW5ndWxhci1zdXBlci1nYWxsZXJ5Lmh0bWwnLFxyXG5cdFx0YmluZGluZ3M6IHtcclxuXHRcdFx0dmlzaWJsZTogJz0nLFxyXG5cdFx0XHRzZWxlY3RlZDogJzwnLFxyXG5cdFx0XHRmaWxlczogJz0nLFxyXG5cdFx0XHRvcHRpb25zOiAnPT8nXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdGFwcC5wcm92aWRlcignYW5ndWxhclN1cGVyR2FsbGVyeU9wdGlvbnMnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0dmFyIGRlZmF1bHRzID0ge307XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0c2V0T3B0czogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHRcdFx0XHRhbmd1bGFyLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdCRnZXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdHM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fSk7XHJcblxyXG5cdGFwcC5kaXJlY3RpdmUoJ2ltYWdlT25sb2FkJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVzdHJpY3Q6ICdBJyxcclxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycyA6IGFueSkge1xyXG5cdFx0XHRcdGVsZW1lbnQuYmluZCgnbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHNjb3BlLiRhcHBseShhdHRycy5pbWFnZU9ubG9hZCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fSk7XHJcblxyXG5cdGFwcC5maWx0ZXIoJ2J5dGVzJywgKCkgPT4ge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChieXRlcyA6IGFueSwgcHJlY2lzaW9uIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcblxyXG5cdFx0XHRpZiAoaXNOYU4ocGFyc2VGbG9hdChieXRlcykpIHx8ICFpc0Zpbml0ZShieXRlcykpIHJldHVybiAnJ1xyXG5cdFx0XHRpZiAoYnl0ZXMgPT09IDApIHJldHVybiAnMCc7XHJcblx0XHRcdGlmICh0eXBlb2YgcHJlY2lzaW9uID09PSAndW5kZWZpbmVkJykgcHJlY2lzaW9uID0gMTtcclxuXHJcblx0XHRcdHZhciB1bml0cyA9IFsnYnl0ZXMnLCAna0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInXSxcclxuXHRcdFx0XHRudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgubG9nKGJ5dGVzKSAvIE1hdGgubG9nKDEwMjQpKTtcclxuXHJcblx0XHRcdHJldHVybiAoYnl0ZXMgLyBNYXRoLnBvdygxMDI0LCBNYXRoLmZsb29yKG51bWJlcikpKS50b0ZpeGVkKHByZWNpc2lvbikgKyAnICcgKyB1bml0c1tudW1iZXJdO1xyXG5cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG59XHJcblxyXG4iXX0=
