///<reference path="./../typings/index.d.ts" />

namespace angularSuperGallery {

	// modal component options
	export interface IOptionsModal {

		header? : {
			enabled? : boolean;
			dynamic? : boolean;
			buttons : Array<string>;
		};
		help? : boolean;
		caption? : {
			disabled? : boolean;
			visible? : boolean;
			position? : string;
		};
		transition? : string;
		title? : string;
		subtitle? : string;
		arrows? : boolean;
		size? : string;
		thumbnail? : IOptionsThumbnail;
		marginTop? : number;
		marginBottom? : number;
		click? : {
			close : boolean;
		};
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
			size? : Array<number>;
			transition? : Array<number>;
		};
	}

	// panel component options
	export interface IOptionsPanel {

		visible? : boolean;
		item? : {
			class? : string;
			caption : boolean;
			index : boolean;
		};
		hover? : {
			select : boolean;
		};
		click? : {
			select : boolean;
			modal : boolean;
		};

	}

	// thumbnail component options
	export interface IOptionsThumbnail {

		height? : number,
		index? : boolean;
		enabled? : boolean;
		dynamic? : boolean;
		autohide : boolean;
		click? : {
			select : boolean;
			modal : boolean;
		};
		hover? : {
			select : boolean;
		};

	}

	// info component options
	export interface IOptionsInfo {

	}

	// image component options
	export interface IOptionsImage {

		transition? : string;
		size? : string;
		arrows? : boolean;
		click? : {
			modal : boolean;
		};
		height? : number;
		heightMin? : number;
		heightAuto? : {
			initial? : boolean;
			onresize? : boolean;
		};

	}

	// gallery options
	export interface IOptions {

		debug? : boolean;
		baseUrl? : string;
		hashUrl? : boolean;
		fields? : {
			source? : {
				modal? : string;
				panel? : string;
				image? : string;
			}
			title? : string;
			description? : string;
			thumbnail? : string;
		};
		autoplay? : {
			enabled? : boolean;
			delay? : number;
		};
		theme? : string;
		preloadDelay? : number;
		preload? : Array<number>;
		modal? : IOptionsModal;
		panel? : IOptionsPanel;
		image? : IOptionsImage;
		thumbnail? : IOptionsThumbnail;

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
		name? : string;
		extension? : string;
		description? : string;
		download? : string;
		loaded? : {
			modal? : boolean;
			panel? : boolean;
			image? : boolean;
		};
		width? : number;
		height? : number;

	}

	export interface IOver {
		modalImage : boolean;
		panel : boolean;
	}

	// service controller interface
	export interface IServiceController {

		modalVisible : boolean;
		panelVisible : boolean;
		modalAvailable : boolean;
		transitions : Array<string>;
		themes : Array<string>;
		classes : string;
		options : IOptions;
		items : Array<IFile>;
		selected : number;
		file : IFile;
		sizes : Array<string>;
		id : string;
		isSingle : boolean;
		events : {
			CONFIG_LOAD : string;
			AUTOPLAY_START : string;
			AUTOPLAY_STOP : string;
			PARSE_IMAGES : string;
			LOAD_IMAGE : string;
			FIRST_IMAGE : string;
			CHANGE_IMAGE : string;
			MODAL_OPEN : string;
			MODAL_CLOSE : string;
		};

		getInstance(component : any) : IServiceController;

		setDefaults() : void;

		setOptions(options : IOptions) : IOptions;

		setItems(items : Array<IFile>) : void;

		preload(wait? : number) : void;

		normalize(index : number) : number;

		setFocus() : void;

		setSelected(index : number);

		modalOpen(index : number) : void;

		modalClose() : void;

		modalClick($event? : UIEvent) : void;

		thumbnailsMove(delay? : number) : void;

		toBackward(stop? : boolean) : void;

		toForward(stop? : boolean) : void;

		toFirst(stop? : boolean) : void;

		toLast(stop? : boolean) : void;

		loadImage(index? : number) : void;

		loadImages(indexes : Array<number>) : void;

		hoverPreload(index : number) : void;

		autoPlayToggle() : void;

		toggle(element : string) : void;

		setHash() : void;

		downloadLink() : string;

		el(selector) : NodeList;

		log(event : string, data? : any) : void;


	}

	// service controller
	export class ServiceController {

		public slug = 'asg';
		public id : string;
		public items : any;
		public files : Array<IFile> = [];
		public direction : string;
		public modalAvailable = false;

		private instances : {} = {};
		private _selected : number;
		private _visible = false;
		private autoplay : angular.IPromise<any>;
		private first = false;

		public options : IOptions = null;
		public optionsLoaded = false;
		public defaults : IOptions = {
			debug: false, // image load, autoplay, etc. info in console.log
			hashUrl: true, // enable/disable hash usage in url (#asg-nature-4)
			baseUrl: '', // url prefix
			fields: {
				source: {
					modal: 'url', // required, image url for modal component (large size)
					panel: 'url', // image url for panel component (thumbnail size)
					image: 'url' // image url for image (medium or custom size)
				},
				title: 'title', // title field name
				description: 'description', // description field name
			},
			autoplay: {
				enabled: false, // slideshow play enabled/disabled
				delay: 4100 // autoplay delay in millisecond
			},
			theme: 'default', // css style [default, darkblue, whitegold]
			preloadDelay: 770,
			preload: [], // preload images by index number
			modal: {
				title: '', // modal window title
				subtitle: '', // modal window subtitle
				caption: {
					disabled: false, // disable image caption
					visible: true, // show/hide image caption
					position: 'top' // caption position [top, bottom]
				},
				header: {
					enabled: true, // enable/disable modal menu
					dynamic: false, // show/hide modal menu on mouseover
					buttons: ['playstop', 'index', 'prev', 'next', 'pin', 'size', 'transition', 'thumbnails', 'fullscreen', 'help', 'close'],
				},
				help: false, // show/hide help
				arrows: true, // show/hide arrows
				click: {
					close: true // when click on the image close the modal
				},
				thumbnail: {
					height: 50, // thumbnail image height in pixel
					index: false, // show index number on thumbnail
					enabled: true, // enable/disable thumbnails
					dynamic: false, // if true thumbnails visible only when mouseover
					autohide: true, // hide thumbnail component when single image
					click: {
						select: true, // set selected image when true
						modal: false // open modal when true
					},
					hover: {
						select: false // set selected image on mouseover when true
					},
				},
				transition: 'slideLR', // transition effect
				size: 'cover', // contain, cover, auto, stretch
				keycodes: {
					exit: [27], // esc
					playpause: [80], // p
					forward: [32, 39], // space, right arrow
					backward: [37], // left arrow
					first: [38, 36], // up arrow, home
					last: [40, 35], // down arrow, end
					fullscreen: [13], // enter
					menu: [77], // m
					caption: [67], // c
					help: [72], // h
					size: [83], // s
					transition: [84] // t
				}
			},
			thumbnail: {
				height: 50, // thumbnail image height in pixel
				index: false, // show index number on thumbnail
				dynamic: false, // if true thumbnails visible only when mouseover
				autohide: false, // hide thumbnail component when single image
				click: {
					select: true, // set selected image when true
					modal: false // open modal when true
				},
				hover: {
					select: false // set selected image on mouseover when true
				},
			},
			panel: {
				visible: true,
				item: {
					class: 'col-md-3', // item class
					caption: false, // show/hide image caption
					index: false, // show/hide image index
				},
				hover: {
					select: false // set selected image on mouseover when true
				},
				click: {
					select: false, // set selected image when true
					modal: true // open modal when true
				},
			},
			image: {
				transition: 'slideLR', // transition effect
				size: 'cover', // contain, cover, auto, stretch
				arrows: true, // show/hide arrows
				click: {
					modal: true // when click on the image open the modal window
				},
				height: null, // height in pixel
				heightMin: null, // min height in pixel
				heightAuto: {
					initial: true, // calculate div height by first image
					onresize: false // calculate div height on window resize
				}
			}
		};

		// available image sizes
		public sizes : Array<string> = [
			'contain',
			'cover',
			'auto',
			'stretch'
		];

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
			'zoomIn',
			'zoomOut',
			'zoomInOut',
			'rotateLR',
			'rotateTB',
			'rotateZY',
			'slideLR',
			'slideTB',
			'flipX',
			'flipY'
		];

		public events = {
			CONFIG_LOAD: 'ASG-config-load-',
			AUTOPLAY_START: 'ASG-autoplay-start-',
			AUTOPLAY_STOP: 'ASG-autoplay-stop-',
			PARSE_IMAGES: 'ASG-parse-images-',
			LOAD_IMAGE: 'ASG-load-image-',
			FIRST_IMAGE: 'ASG-first-image-',
			CHANGE_IMAGE: 'ASG-change-image-',
			MODAL_OPEN: 'ASG-modal-open-',
			MODAL_CLOSE: 'ASG-modal-close-',
			THUMBNAIL_MOVE: 'ASG-thumbnail-move-',
		};

		constructor(private timeout : ng.ITimeoutService,
					private interval : ng.IIntervalService,
					private location : ng.ILocationService,
					private $rootScope : ng.IRootScopeService,
					private $window : ng.IWindowService) {

			angular.element($window).bind('resize', (event) => {
				this.thumbnailsMove(200);
			});

		}

		private parseHash() {

			if (!this.id) {
				return;
			}

			if (!this.options.hashUrl) {
				return;
			}

			let hash = this.location.hash();
			let parts = hash ? hash.split('-') : null;

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

			let index = parseInt(parts[2], 10);

			if (!angular.isNumber(index)) {
				return;
			}

			this.timeout(() => {

				index--;
				this.selected = index;
				this.modalOpen(index);

			}, 20);

		}

		// calculate object hash id
		public objectHashId(object : any) : string {

			let string = JSON.stringify(object);

			if (!string) {
				return null;
			}

			let abc = string.replace(/[^a-zA-Z0-9]+/g, '');
			let code = 0;

			for (let i = 0, n = abc.length; i < n; i++) {
				let charcode = abc.charCodeAt(i);
				code += (charcode * i);
			}

			return 'id' + code.toString(21);

		}

		// get service instance for current gallery by component id
		public getInstance(component : any) {

			if (!component.id) {

				// get parent asg component id
				if (component.$scope && component.$scope.$parent && component.$scope.$parent.$parent && component.$scope.$parent.$parent.$ctrl) {
					component.id = component.$scope.$parent.$parent.$ctrl.id;
				} else {
					component.id = this.objectHashId(component.options);
				}

			}

			const id = component.id;
			let instance = this.instances[id];

			// new instance and set options and items
			if (instance === undefined) {
				instance = new ServiceController(this.timeout, this.interval, this.location, this.$rootScope, this.$window);
				instance.id = id;
			}

			if (component.baseUrl) {
				component.options.baseUrl = component.baseUrl;
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

			// parse array string elements
			if (angular.isString(items[0]) === true) {

				this.items = [];
				for (let i = 0; i < items.length; i++) {
					this.items.push({source: {modal: items[i]}});
				}

			} else {

				this.items = items;

			}

			this.prepareItems();

		}

		// options setup
		public setOptions(options : IOptions) {

			// if options already setup
			if (this.optionsLoaded) {
				return;
			}

			if (options) {
				this.options = angular.merge(this.defaults, options);

				if (options.modal && options.modal.header && options.modal.header.buttons) {
					this.options.modal.header.buttons = options.modal.header.buttons;
				}

				this.optionsLoaded = true;
			} else {
				this.options = this.defaults;
			}

			// important!
			options = this.options;

			this.event(this.events.CONFIG_LOAD, this.options);

			return this.options;

		}

		// set selected image
		public set selected(v : number) {

			v = this.normalize(v);
			let prev = this._selected;

			this._selected = v;
			this.preload();

			if (prev !== this._selected) {

				this.thumbnailsMove();
				this.event(this.events.CHANGE_IMAGE, {
					index: v,
					file: this.file
				});

			}

		}

		// get selected image
		public get selected() {

			return this._selected;

		}


		public setSelected(index : number) {

			this.autoPlayStop();
			this.direction = index > this.selected ? 'forward' : 'backward';
			this.selected = index;
			this.setHash();

		}


		// go to backward
		public toBackward(stop? : boolean) {

			if (stop) {
				this.autoPlayStop();
			}

			this.direction = 'backward';
			this.selected--;
			this.loadImage(this.selected - 1);
			this.setHash();

		}

		// go to forward
		public toForward(stop? : boolean) {

			if (stop) {
				this.autoPlayStop();
			}

			this.direction = 'forward';
			this.selected++;
			this.loadImage(this.selected + 1);
			this.setHash();

		}

		// go to first
		public toFirst(stop? : boolean) {

			if (stop) {
				this.autoPlayStop();
			}

			this.direction = 'backward';
			this.selected = 0;
			this.setHash();

		}

		// go to last
		public toLast(stop? : boolean) {

			if (stop) {
				this.autoPlayStop();
			}

			this.direction = 'forward';
			this.selected = this.items.length - 1;
			this.setHash();

		}

		public setHash() {

			if (this.modalVisible && this.options.hashUrl) {
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

			if (!this.autoplay) {
				return;
			}

			this.interval.cancel(this.autoplay);
			this.options.autoplay.enabled = false;
			this.autoplay = null;
			this.event(this.events.AUTOPLAY_STOP, {index: this.selected, file: this.file});

		}

		public autoPlayStart() {

			if (this.autoplay) {
				return;
			}

			this.options.autoplay.enabled = true;
			this.autoplay = this.interval(() => {
				this.toForward();
			}, this.options.autoplay.delay);

			this.event(this.events.AUTOPLAY_START, {index: this.selected, file: this.file});

		}


		private prepareItems() {

			const self = this;

			let getAvailableSource = function (type : string, source : ISource) {

				if (source[type]) {
					return source[type];
				}

				if (type === 'panel') {
					return getAvailableSource('image', source);
				}

				if (type === 'image') {
					return getAvailableSource('modal', source);
				}

				if (type === 'modal') {
					return getAvailableSource('image', source);
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
					modal: self.options.baseUrl + getAvailableSource('modal', value.source),
					panel: self.options.baseUrl + getAvailableSource('panel', value.source),
					image: self.options.baseUrl + getAvailableSource('image', value.source),
				};


				let parts = source.modal.split('/');
				let filename = parts[parts.length - 1];

				let title, description;

				if (self.options.fields !== undefined) {
					title = value[self.options.fields.title] ? value[self.options.fields.title] : filename;
				} else {
					title = filename;
				}

				if (self.options.fields !== undefined) {
					description = value[self.options.fields.description] ? value[self.options.fields.description] : null;
				} else {
					description = null;
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

			this.event(this.events.PARSE_IMAGES, this.files);

		}

		// preload the image when mouseover
		public hoverPreload(index : number) {
			this.loadImage(index);
		}


		// image preload
		private preload(wait? : number) {

			this.loadImage(this.selected);

			this.timeout(() => {
				this.loadImage(this.selected + 1);
			}, (wait !== undefined) ? wait : this.options.preloadDelay);

		}

		public normalize(index : number) {

			let last = this.files.length - 1;

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

			let self = this;

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

			if (this.files[index].loaded.modal) {
				return;
			}

			let image = new Image();
			image.src = this.files[index].source.image;
			image.addEventListener('load', () => {
				this.afterLoad(index, 'image', image);
			});

			let modal = new Image();
			modal.src = this.files[index].source.modal;
			modal.addEventListener('load', (event) => {
				this.afterLoad(index, 'modal', modal);
			});

		}

		// get file name
		private getFilename(index : number, type? : string) {

			type = type ? type : 'modal';
			let fileparts = this.files[index].source[type].split('/');
			let filename = fileparts[fileparts.length - 1];
			return filename;

		}

		// get file extension
		private getExtension(index : number, type? : string) {

			type = type ? type : 'modal';
			let fileparts = this.files[index].source[type].split('.');
			let extension = fileparts[fileparts.length - 1];
			return extension;

		}

		// after load image
		private afterLoad(index, type, image) {

			if (this.files[index].loaded[type] === true) {
				return;
			}

			this.files[index].loaded[type] = true;

			if (type === 'modal') {
				this.files[index].width = image.width;
				this.files[index].height = image.height;
				this.files[index].name = this.getFilename(index, type);
				this.files[index].extension = this.getExtension(index, type);
				this.files[index].download = this.files[index].source.modal;
			}

			let data = {type: type, index: index, file: this.file, img: image};

			if (!this.first) {
				this.first = true;
				this.event(this.events.FIRST_IMAGE, data);
			}

			this.event(this.events.LOAD_IMAGE, data);

		}


		// is single?
		public get isSingle() {

			return this.files.length > 1 ? false : true;

		}


		// get the download link
		public downloadLink() {

			if (this.selected !== undefined && this.files.length > 0) {
				return this.files[this.selected].source.modal;
			}

		}


		// get the file
		public get file() : IFile {

			return this.files[this.selected];

		}

		// toggle element visible
		public toggle(element : string) : void {

			this.options[element].visible = !this.options[element].visible;

		}


		// get visible
		public get modalVisible() : boolean {

			return this._visible;

		}


		// get theme
		public get theme() : string {

			return this.options.theme;

		}

		// get classes
		public get classes() : string {

			return this.options.theme + ' ' + this.id;

		}


		// set visible
		public set modalVisible(value : boolean) {

			this._visible = value;

			let body = document.body;
			let className = ' asg-yhidden';

			if (value) {

				this.preload(1);
				this.modalInit();

				if (body.className.indexOf(className) < 0) {
					body.className = body.className + className;
				}

			} else {

				body.className = body.className.replace(className, '');

			}

		}

		// initialize the gallery
		private modalInit() {

			let self = this;

			this.timeout(() => {
				self.setFocus();
			}, 100);

		}


		public modalOpen(index : number) {

			if (!this.modalAvailable) {
				return;
			}

			this.selected = index !== undefined ? index : this.selected;
			this.modalVisible = true;
			this.setHash();
			this.event(this.events.MODAL_OPEN, {index: this.selected});
			this.setFocus();
			this.thumbnailsMove(200);

		}

		public modalClose() {

			if (this.options.hashUrl) {
				this.location.hash('');
			}

			this.modalVisible = false;
			this.event(this.events.MODAL_CLOSE, {index: this.selected});

		}

		// move thumbnails to correct position
		public thumbnailsMove(delay? : number) {

			let move = () => {

				let containers = this.el('div.asg-thumbnail.' + this.id);

				if (!containers.length) {
					return;
				}

				for (var i = 0; i < containers.length; i++) {

					let container : any = containers[i];

					if (container.offsetWidth) {

						let items : any = container.querySelector('div.items');
						let item : any = container.querySelector('div.item');
						let thumbnail, moveX, remain;

						if (item) {

							if (items.scrollWidth > container.offsetWidth) {
								thumbnail = items.scrollWidth / this.files.length;
								moveX = (container.offsetWidth / 2) - (this.selected * thumbnail) - thumbnail / 2;
								remain = items.scrollWidth + moveX;
								moveX = moveX > 0 ? 0 : moveX;
								moveX = remain < container.offsetWidth ? container.offsetWidth - items.scrollWidth : moveX;
							} else {
								thumbnail = this.getRealWidth(item);
								moveX = (container.offsetWidth - thumbnail * this.files.length) / 2;
							}

							items.style.left = moveX + 'px';

							this.event(this.events.THUMBNAIL_MOVE, {
								thumbnail: thumbnail,
								move: moveX,
								remain: remain,
								container: container.offsetWidth,
								items: items.scrollWidth
							})

						}

					}

				}
			};

			if (delay) {
				this.timeout(() => {
					move();
				}, delay);
			} else {
				move();
			}


		}

		public modalClick($event? : UIEvent) {

			if ($event) {
				$event.stopPropagation();
			}

			this.setFocus();

		}

		// set the focus
		public setFocus() {

			if (this.modalVisible) {

				let element : Node = this.el('div.asg-modal.' + this.id + ' .keyInput')[0];

				if (element) {
					angular.element(element)[0].focus();
				}

			}

		}

		private event(event : string, data? : any) {

			event = event + this.id;
			this.$rootScope.$emit(event, data);
			this.log(event, data);

		}

		public log(event : string, data? : any) {

			if (this.options.debug) {
				console.log(event, data ? data : null);
			}

		}

		// get element
		public el(selector) : NodeList {

			return document.querySelectorAll(selector);

		}

		// calculating element real width
		public getRealWidth(item) {

			let style = item.currentStyle || window.getComputedStyle(item),
				width = item.offsetWidth,
				margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
				//padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
				border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

			return width + margin + border;

		}

		// calculating element real height
		public getRealHeight(item) {

			let style = item.currentStyle || window.getComputedStyle(item),
				height = item.offsetHeight,
				margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom),
				//padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom),
				border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

			return height + margin + border;

		}

	}

	let app : ng.IModule = angular.module('angularSuperGallery');

	app.service('asgService', ['$timeout', '$interval', '$location', '$rootScope', '$window', ServiceController]);

}

