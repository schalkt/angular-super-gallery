///<reference path="./../typings/index.d.ts" />

module ASG {

	interface IOptions {

		title : string;
		subtitle : string;
		baseUrl : string;
		fields : {
			url : string;
			title : string;
			description : string;
			thumbnail : string;
		},
		transition : string;
		theme : string;
		thumbnail : {
			class : string;
		},
		preload : Array<number>;
		header : boolean;
		help : boolean;

	}


	interface IFile {

		url : string;
		title? : string;
		description? : string;
		thumbnail? : string;
		loaded? : boolean;
		size? : number;
		width? : number;
		height? : number;

	}

	export class GalleryViewController {

		public id : string;
		public direction : string;
		public items : any;
		public files : Array<IFile>;
		public selected : number;
		public options : IOptions;

		private defaults = {
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

		private _visible : boolean = false;
		private _fullscreen : boolean = false;
		private arrowsVisible : boolean = false;

		private themes : Array<string> = [
			'darkblue',
			'whiteblue'
		];

		private transitions : Array<string> = [
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

		//protected infoVisible : boolean = false;

		constructor(private fullscreen,
					private timeout,
					private galleryId) {

			if (this.id == undefined) {
				this.id = 'asgid' + this.galleryId.getNext();
			}

		}


		public $onInit() {

			var self = this;
			this.setDefaults();

			if (this.options.preload) {
				this.options.preload.forEach((index : number) => {
					self.loadImage(index);
				})
			}

		}

		private setDefaults() {

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

		}


		// initialize the gallery
		private init() {

			var self = this;

			this.timeout(() => {

				// submenu click events
				var element = '.gallery-view.' + self.id + ' li.dropdown-submenu';
				angular.element(element).off().on('click', function (event) {
					event.stopPropagation();
					if (angular.element(this).hasClass('open')) {
						angular.element(this).removeClass('open');
					} else {
						angular.element(element).removeClass('open');
						angular.element(this).addClass('open');
					}
				});

				// set focus
				self.setFocus();

			}, 100);

		}


		private getClass() {

			var ngClass = [];

			if (!this.options.header) {
				ngClass.push('noheader');
			}

			ngClass.push(this.options.theme);

			return ngClass.join(' ');

		}

		// image preload
		private preload(wait? : number) {

			this.timeout(() => {

				this.loadImage(this.selected);
				this.loadImage(0);
				this.loadImage(this.selected + 1);
				this.loadImage(this.selected - 1);
				this.loadImage(this.selected + 2);
				this.loadImage(this.files.length - 1);

			}, (wait != undefined) ? wait : 750);

		}

		public normalize(index : number) {

			var last = this.files.length - 1;

			if (index > last) {
				return (index - last) - 1;
			}

			if (index < 0) {
				return last - Math.abs(index) + 1;
			}

			return index;

		}


		private loadImage(index : number) {

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

		}

		// get visible
		public get visible() {

			return this._visible;

		}

		// set visible
		public set visible(value : boolean) {

			this._visible = value;

			if (this._visible) {

				this.init();
				this.preload(1);
				angular.element('body').addClass('yhidden');

			} else {
				angular.element('body').removeClass('yhidden');
			}

		}

		// is single?
		public get isSingle() {

			return this.files.length > 1 ? false : true;

		}

		// set the focus
		public setFocus() {

			angular.element('.gallery-view.' + this.id + ' .keyInput').trigger('focus').focus();

		}

		// set transition effect
		public setTransition(transition) {

			this.options.transition = transition;
			this.setFocus();

		}

		// set theme
		public setTheme(theme) {

			this.options.theme = theme;
			this.setFocus();

		}

		// overlay arrows hide
		public arrowsHide() {

			this.arrowsVisible = false;

		}

		// overlay arrows show
		public arrowsShow() {

			this.arrowsVisible = true;

		}

		// get the download link
		public downloadLink() {

			if (this.selected != undefined) {
				return this.options.baseUrl + this.files[this.selected][this.options.fields.url];
			}

		}

		// get the file
		public get file() {

			return this.files[this.selected];

		}

		// go to backward
		public toBackward() {

			this.direction = 'backward';
			this.selected = this.normalize(this.selected - 1);
			this.preload();

		}

		// go to forward
		public toForward() {

			this.direction = 'forward';
			this.selected = this.normalize(this.selected + 1);
			this.preload();

		}

		// go to first
		public toFirst() {

			this.direction = 'backward';
			this.selected = 0;
			this.preload();

		}

		// go to last
		public toLast() {

			this.direction = 'forward';
			this.selected = this.files.length - 1;
			this.preload();

		}


		public open(index : number) {

			this.selected = index;
			this.visible = true;

		}

		// exit
		public exit() {

			this.visible = false;

		}

		// keymap
		public keyUp(e) {

			// esc
			if (e.keyCode == 27) {
				this.exit();
			}

			// space
			if (e.keyCode == 32) {
				this.toForward();
			}

			// left
			if (e.keyCode == 37) {
				this.toBackward();
			}

			// right
			if (e.keyCode == 39) {
				this.toForward();
			}

			// up
			if (e.keyCode == 38 || e.keyCode == 36) {
				this.toFirst();
			}

			// down
			if (e.keyCode == 40 || e.keyCode == 35) {
				this.toLast();
			}

			// f - fullscreen
			if (e.keyCode == 70 || e.keyCode == 13) {
				this.toggleFullScreen();
			}

			// g - header
			if (e.keyCode == 71) {
				this.toggleHeader();
			}

			// h - help
			if (e.keyCode == 72) {
				this.toggleHelp();
			}

			// t - transition next
			if (e.keyCode == 84) {
				this.nextTransition();
			}

		}

		// switch to next transition effect
		private nextTransition() {

			var idx = this.transitions.indexOf(this.options.transition) + 1;
			var next = idx >= this.transitions.length ? 0 : idx;
			this.options.transition = this.transitions[next];

		}

		// toggle fullscreen
		private toggleFullScreen() {

			if (this.fullscreen.isEnabled()) {
				this.fullscreen.cancel();
			} else {
				this.fullscreen.all();
			}
			this.setFocus();

		}

		// toggle help
		private toggleHelp() {

			this.options.help = !this.options.help;
			this.setFocus();

		}

		// toggle header
		private toggleHeader() {

			this.options.header = !this.options.header;

		}

	}

	// gallery unique id service
	export class GalleryIdService {

		private id = 1;

		public getNext() {
			return this.id++;
		}

	}


	var app : ng.IModule = angular.module('angularSuperGallery', ['ngAnimate']);

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
		}

	});

	app.directive('imageOnload', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs : any) {
				element.bind('load', function () {
					scope.$apply(attrs.imageOnload);
				});
			}
		};
	});

	app.filter('bytes', () => {
		return function (bytes : any, precision : number) : string {

			if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return ''
			if (bytes === 0) return '0';
			if (typeof precision === 'undefined') precision = 1;

			var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
				number = Math.floor(Math.log(bytes) / Math.log(1024));

			return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];

		}
	});


}

