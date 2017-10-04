///<reference path="./../typings/index.d.ts" />

module ASG {

	// modal component options
	export interface IOptionsModal {

		menu? : boolean;
		help? : boolean;
		caption? : boolean;
		transition? : string;
		title? : string;
		subtitle? : string;
		wide? : boolean;
		keycodes? : {
			exit? : Array<number>;
			playpause? : Array<number>;
			forward? : Array<number>;
			backward? : Array<number>;
			first? : Array<number>;
			last? : Array<number>;
			fullscreen? : Array<number>;
			menu? : Array<number>;
			caption? : Array<number>;
			help? : Array<number>;
			wide? : Array<number>;
			transition? : Array<number>;
		}
	}

	// panel component options
	export interface IOptionsPanel {

		item? : {
			class? : string;
		},

	}

	// image component options
	export interface IOptionsImage {

		transition? : string;
		height? : number;
		wide? : boolean;

	}

	// gallery options
	export interface IOptions {

		debug? : boolean,
		baseUrl? : string;
		fields? : {
			source? : {
				modal? : string;
				panel? : string;
				image? : string;
			}
			title? : string;
			description? : string;
			thumbnail? : string;
		},
		autoplay? : {
			enabled? : boolean;
			delay? : number;
		},
		theme? : string;
		preloadDelay? : number;
		preload? : Array<number>;
		modal? : IOptionsModal;
		panel? : IOptionsPanel;
		image? : IOptionsImage;

	}

	// image source
	export interface ISource {

		modal : string; // original, required
		panel? : string;
		image? : string;

	}

	// image file
	export interface IFile {

		source : ISource;
		title? : string;
		description? : string;
		thumbnail? : string;
		loaded? : {
			modal? : boolean;
			panel? : boolean;
			image? : boolean;
		};
		size? : number;
		width? : number;
		height? : number;

	}

	// service controller interface
	export interface IServiceController {

		getInstance(component : any) : IServiceController,

		setDefaults() : void;

		setOptions(options : IOptions) : IOptions;

		setItems(items : Array<IFile>) : void;

		preload(wait? : number) : void;

		normalize(index : number) : number;

		setFocus() : void;

		modalOpen(index : number) : void;

		modalClose() : void;

		toBackward(stop? : boolean) : void;

		toForward(stop? : boolean) : void;

		toFirst(stop? : boolean) : void;

		toLast(stop? : boolean) : void;

		loadImage(index? : number) : void;

		loadImages(indexes : Array<number>) : void;

		autoPlayToggle() : void;

		el(selector) : any;

		setHash() : void;

		modalVisible : boolean;
		modalAvailable : boolean;
		transitions : Array<string>;
		themes : Array<string>;
		options : IOptions;
		items : Array<IFile>;
		selected : number;

	}

	// service controller
	export class ServiceController {

		public slug : string = 'asg';
		public id : string;
		public items : any;
		public files : Array<IFile> = [];
		public direction : string;
		public modalAvailable : boolean = false;

		private instances : {} = {}
		private _selected : number;
		private _visible : boolean = false;
		private autoplay : angular.IPromise<any>;

		public options : IOptions = {};
		public defaults : IOptions = {
			debug: false, // image load and autoplay info in console.log
			baseUrl: "", // url prefix
			fields: {
				source: {
					modal: "url", // required, image url for modal component (large size)
					panel: "url", // image url for panel component (thumbnail size)
					image: "url" // image url for image (medium size)
				},
				title: "title", // title input field name
				description: "description", // description input field name
				thumbnail: "thumbnail" // thumbnail input field name
			},
			autoplay: {
				enabled: false, // slideshow play enabled/disabled
				delay: 4100 // autoplay delay in millisecond
			},
			theme: 'default', // css style [default, darkblue, whitegold]
			preloadDelay: 770,
			preload: [], // preload images by index number
			modal: {
				title: "", // modal window title
				subtitle: "", // modal window subtitle
				caption: true, // show/hide image caption
				menu: true, // show/hide modal menu
				help: false, // show/hide help
				transition: 'slideLR', // transition effect
				wide: false, // enable/disable wide image display mode
				keycodes: {
					exit: [27], // ESC
					playpause: [80], // p
					forward: [32, 39], // SPACE, RIGHT ARROW
					backward: [37], // LEFT ARROW
					first: [38, 36], // UP ARROW, HOME
					last: [40, 35], // DOWN ARROW, END
					fullscreen: [70, 13], // f, ENTER
					menu: [77], // m
					caption: [67], // c
					help: [72], // h
					wide: [87], // w
					transition: [84] // t
				}
			},
			panel: {
				item: {
					class: 'col-md-3' // item class
				},
			},
			image: {
				transition: 'slideLR', // transition effect
				wide: false, // enable/disable wide image display mode
				height: 300, // height
			}
		};

		// available themes
		public themes : Array<string> = [
			'default',
			'darkblue',
			'whitegold'
		];

		// available transitions
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

		constructor(private timeout : ng.ITimeoutService,
					private interval : ng.IIntervalService,
					private location : ng.ILocationService) {

		}

		public $onInit() {


		}


		private parseHash() {

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

			this.timeout(() => {

				index--;
				this.selected = index;
				this.modalOpen(index);

			}, 20);

		}

		// get service instance for current gallery by component id
		public getInstance(component : any) {

			const id = component.id;
			let instance = this.instances[id];

			// new instance and set options and items
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

		}

		// prepare images array
		public setItems(items : Array<IFile>) {

			if (!items) {
				return;
			}

			// if already
			if (this.items) {
				return;
			}

			this.items = items;
			this.prepareItems();

		}

		// options setup
		public setOptions(options : IOptions) {

			if (options) {
				this.options = angular.merge(this.defaults, options);
			} else {
				this.options = this.defaults;
			}

			this.log('config', this.options);

			// important!
			options = this.options;

			return this.options;

		}

		// set selected image
		public set selected(v : number) {

			this._selected = v;
			this.preload();

		}

		// get selected image
		public get selected() {

			return this._selected;

		}


		public setSelected(index : number) {

			this.autoPlayStop();
			this.direction = index > this.selected ? 'forward' : 'backward';
			this.selected = this.normalize(index);

		}


		// go to backward
		public toBackward(stop? : boolean, $event? : UIEvent) {

			if ($event) {
				$event.stopPropagation();
			}

			stop && this.autoPlayStop();
			this.direction = 'backward';
			this.selected = this.normalize(--this.selected);
			this.loadImage(this.selected - 1);
			this.setHash();
			this.setFocus();

		}

		// go to forward
		public toForward(stop? : boolean, $event? : UIEvent) {

			if ($event) {
				$event.stopPropagation();
			}

			stop && this.autoPlayStop();
			this.direction = 'forward';
			this.selected = this.normalize(++this.selected);
			this.loadImage(this.selected + 1);
			this.setHash();
			this.setFocus();

		}

		// go to first
		public toFirst(stop? : boolean) {

			stop && this.autoPlayStop();
			this.direction = 'backward';
			this.selected = 0;
			this.setHash();

		}

		// go to last
		public toLast(stop? : boolean) {

			stop && this.autoPlayStop();
			this.direction = 'forward';
			this.selected = this.items.length - 1;
			this.setHash();

		}

		public setHash() {

			if (this.modalVisible) {
				this.location.hash([this.slug, this.id, this.selected + 1].join('-'));
			}

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
				this.log('autoplay', {index: this.selected, file: this.file});
			}, this.options.autoplay.delay);

		}


		private prepareItems() {

			const self = this;

			var getAvailableSource = function (type : string, source : ISource) {

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

				let source = {
					modal: getAvailableSource('modal', value.source),
					panel: getAvailableSource('panel', value.source),
					image: getAvailableSource('image', value.source),
				};


				let parts = source.modal.split('/');
				let filename = parts[parts.length - 1];

				if (self.options.fields != undefined) {
					var title = value[self.options.fields.title] ? value[self.options.fields.title] : filename;
				} else {
					var title = filename;
				}

				if (self.options.fields != undefined) {
					var description = value[self.options.fields.description] ? value[self.options.fields.description] : null;
				} else {
					var description = null;
				}

				let file = {
					source: source,
					title: title,
					description: description,
					loaded: {
						modal: false,
						panel: false,
						image: false
					}
				};

				self.files.push(file);

			});

			this.log('images', this.files);

		}


		public hoverPreload(index : number) {

			this.loadImage(index);

		}


		// image preload
		private preload(wait? : number) {

			this.loadImage(this.selected);

			this.timeout(() => {
				this.loadImage(this.selected + 1);
			}, (wait != undefined) ? wait : this.options.preloadDelay);

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


		public loadImages(indexes : Array<number>, type : string) {

			if (!indexes) {
				return;
			}

			var self = this;
			indexes.forEach((index : number) => {
				self.loadImage(index);
			});

		}


		public loadImage(index? : number, callback? : {}) {

			index = index ? index : this.selected;
			index = this.normalize(index);

			if (!this.files[index]) {
				this.log('invalid file index', {index: index});
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

			this.log('load image', {index: index, file: this.file});

		}


		// is single?
		public get isSingle() {

			return this.files.length > 1 ? false : true;

		}


		// get the download link
		public downloadLink() {

			if (this.selected != undefined && this.files.length > 0) {
				return this.files[this.selected].source.modal;
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

				this.preload(1);
				this.modalInit();
				this.el('body').addClass('yhidden');

			} else {

				this.el('body').removeClass('yhidden');

			}

		}

		// set the focus
		public setFocus() {

			this.el('.asg-modal.' + this.id + ' .keyInput').trigger('focus').focus();

		}


		// initialize the gallery
		private modalInit() {

			var self = this;

			this.timeout(() => {

				// submenu click events
				var element = '.gallery-modal.' + self.id + ' li.dropdown-submenu';
				this.el(element).off().on('click', function (event) {
					event.stopPropagation();
					if (this.el(this).hasClass('open')) {
						this.el(this).removeClass('open');
					} else {
						this.el(element).removeClass('open');
						this.el(this).addClass('open');
					}
				});

				self.setFocus();

			}, 100);

		}


		public modalOpen(index : number) {

			if (!this.modalAvailable) {
				return;
			}

			this.selected = index ? index : this.selected;
			this.modalVisible = true;
			this.setHash();

		}

		public modalClose() {

			this.location.hash('');
			this.modalVisible = false;

		}


		private log(event : string, data? : any) {

			if (this.options.debug) {
				console.log('ASG | ' + this.id + ' : ' + event, data ? data : null);
			}

		}

		public el(selector) : any {

			return angular.element(selector);

		}


	}

	var app : ng.IModule = angular.module('angularSuperGallery');

	app.service('asgService', ["$timeout", "$interval", "$location", ServiceController]);

}

