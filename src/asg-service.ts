///<reference path="./../typings/index.d.ts" />

module ASG {

	export interface IOptionsModal {

		menu? : boolean;
		help? : boolean;
		caption? : boolean;
		transition? : string;
		title? : string;
		subtitle? : string;
		wide? : boolean;

	}

	export interface IOptionsPanel {

		item? : {
			class? : string;
		},

	}

	export interface IOptionsImage {

		transition? : string;
		height? : number;
		wide? : boolean;

	}

	export interface IOptions {

		baseUrl? : string;
		fields? : {
			url? : string;
			title? : string;
			description? : string;
			thumbnail? : string;
		},
		autoplay? : {
			enabled? : boolean;
			delay? : number;
		},
		theme? : string;
		preload? : Array<number>;
		modal? : IOptionsModal;
		panel? : IOptionsPanel;
		image? : IOptionsImage;

	}


	export interface IFile {

		url : string;
		title? : string;
		description? : string;
		thumbnail? : string;
		loaded? : boolean;
		size? : number;
		width? : number;
		height? : number;

	}

	export interface IServiceController {

		getInstance(id : any) : IServiceController,
		setDefaults() : void;
		setup(options, items) : IOptions;
		preload(wait? : number) : void;
		normalize(index : number) : number;
		setFocus() : void;
		modalOpen(index : number) : void;
		modalClose() : void;
		toBackward(stop? : boolean) : void;
		toForward(stop? : boolean) : void;
		toFirst(stop? : boolean) : void;
		toLast(stop? : boolean) : void;
		autoPlayToggle() : void;
		modalVisible : boolean;
		transitions : Array<string>;
		themes : Array<string>;
		options : IOptions;
		items : Array<IFile>;
		selected : number;

	}

	export class ServiceController {

		public id : string;
		public items : any;
		public files : Array<IFile> = [];
		public selected : number = 0;
		public options : IOptions = {};
		public defaults : IOptions = {
			baseUrl: "", // url prefix
			fields: {
				url: "url", // url input field name
				title: "title", // title input field name
				description: "description", // description input field name
				thumbnail: "thumbnail" // thumbnail input field name
			},
			autoplay: {
				enabled: false, // slideshow autoplay enabled/disabled
				delay: 4100 // autoplay delay in millisecond
			},
			theme: 'default', // css style [default, darkblue, whitegold]
			preload: [0], // preload images by index number
			modal: {
				title: "", // modal window title
				subtitle: "", // modal window subtitle
				caption: true, // show/hide image caption
				menu: true, // show/hide modal menu
				help: false, // show/hide help
				transition: 'rotateLR', // transition effect
				wide: false // enable/disable wide image display mode
			},
			panel: {
				item: {
					class: 'col-md-3' // item class
				},
			},
			image: {
				transition: 'rotateLR', // transition effect
				wide: false, // enable/disable wide image display mode
				height: 300 // height
			}
		};

		private instances : {} = {}
		private _visible : boolean = false;
		private autoplay : angular.IPromise<any>;
		public direction : string;

		public themes : Array<string> = [
			'default',
			'darkblue',
			'whitegold'
		];

		public transitions : Array<string> = [
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

		constructor(private timeout : ng.ITimeoutService,
					private interval : ng.IIntervalService) {

		}


		public $onInit() {

			console.log(this);

		}


		public getInstance(id : any) {

			if (this.instances[id] == undefined) {
				this.instances[id] = new ServiceController(this.timeout, this.interval);
				this.instances[id].id = id;
			}

			return this.instances[id];

		}

		public setup(options : IOptions, items : Array<IFile>) {

			this.options = angular.merge(this.defaults, options);
			this.items = items;
			this.prepareItems();

			if (this.options.autoplay.enabled) {
				this.autoPlayStart();
			}

			return this.options;

		}


		public setSelected(index : number) {

			this.autoPlayStop();
			this.direction = index > this.selected ? 'forward' : 'backward';
			this.selected = this.normalize(index);
			this.preload();

		}


		// go to backward
		public toBackward(stop? : boolean) {

			stop && this.autoPlayStop();
			this.direction = 'backward';
			this.selected = this.normalize(--this.selected);
			this.preload();

		}

		// go to forward
		public toForward(stop? : boolean) {

			stop && this.autoPlayStop();
			this.direction = 'forward';
			this.selected = this.normalize(++this.selected);
			this.preload();

		}

		// go to first
		public toFirst(stop? : boolean) {

			stop && this.autoPlayStop();
			this.direction = 'backward';
			this.selected = 0;
			this.preload();

		}

		// go to last
		public toLast(stop? : boolean) {

			stop && this.autoPlayStop();
			this.direction = 'forward';
			this.selected = this.items.length - 1;
			this.preload();

		}


		public autoPlayToggle() {

			if (this.options.autoplay.enabled) {
				this.autoPlayStop();
			} else {
				this.autoPlayStart();
			}

		}


		public autoPlayStop() {

			if (this.autoplay) {
				this.interval.cancel(this.autoplay);
				this.options.autoplay.enabled = false;
			}

		}

		public autoPlayStart() {

			this.options.autoplay.enabled = true;

			this.autoplay = this.interval(() => {
				this.toForward();
			}, this.options.autoplay.delay);

		}


		private initPreload() {

			var self = this;

			if (this.options.preload) {
				this.options.preload.forEach((index : number) => {
					self.loadImage(index);
				})
			}

		}

		private prepareItems() {

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


		// is single?
		public get isSingle() {

			return this.files.length > 1 ? false : true;

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


		// get visible
		public get modalVisible() {

			return this._visible;

		}


		// get theme
		public get theme() {

			return this.options.theme;

		}


		// set visible
		public set modalVisible(value : boolean) {

			this._visible = value;

			if (value) {

				this.modalInit();
				this.preload(1);
				angular.element('body').addClass('yhidden');

			} else {
				angular.element('body').removeClass('yhidden');
			}

		}

		// set the focus
		public setFocus() {

			angular.element('.asg-modal.' + this.id + ' .keyInput').trigger('focus').focus();

		}


		// initialize the gallery
		private modalInit() {

			var self = this;

			this.timeout(() => {

				// submenu click events
				var element = '.gallery-modal.' + self.id + ' li.dropdown-submenu';
				angular.element(element).off().on('click', function (event) {
					event.stopPropagation();
					if (angular.element(this).hasClass('open')) {
						angular.element(this).removeClass('open');
					} else {
						angular.element(element).removeClass('open');
						angular.element(this).addClass('open');
					}
				});

				self.setFocus();

			}, 100);

		}


		public modalOpen(index : number) {

			this.selected = index ? index : this.selected;
			this.modalVisible = true;

		}

		public modalClose() {

			this.modalVisible = false;

		}


	}

	var app : ng.IModule = angular.module('angularSuperGallery');

	app.service('asgService', ["$timeout", "$interval", ServiceController]);

}

