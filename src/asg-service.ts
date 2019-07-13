namespace angularSuperGallery {

	// modal component options
	export interface IOptionsModal {

		header?: {
			enabled?: boolean;
			dynamic?: boolean;
			buttons: Array<string>;
		};
		help?: boolean;
		caption?: {
			disabled?: boolean;
			visible?: boolean;
			position?: string;
			download?: boolean;
		};
		placeholder?: string;
		transition?: string;
		title?: string;
		subtitle?: string;
		titleFromImage? : boolean;
		subtitleFromImage? : boolean;
		arrows?: {
			preload?: boolean;
			enabled?: boolean;
		};
		size?: string;
		thumbnail?: IOptionsThumbnail;
		marginTop?: number;
		marginBottom?: number;
		click?: {
			close: boolean;
		};
		keycodes?: {
			exit?: Array<number>;
			playpause?: Array<number>;
			forward?: Array<number>;
			backward?: Array<number>;
			first?: Array<number>;
			last?: Array<number>;
			fullscreen?: Array<number>;
			menu?: Array<number>;
			caption?: Array<number>;
			help?: Array<number>;
			size?: Array<number>;
			transition?: Array<number>;
		};
	}

	// panel component options
	export interface IOptionsPanel {

		visible?: boolean;
		item?: {
			class?: string;
			caption: boolean;
			index: boolean;
		};
		hover?: {
			preload: boolean;
			select: boolean;
		};
		click?: {
			select: boolean;
			modal: boolean;
		};

	}

	// thumbnail component options
	export interface IOptionsThumbnail {

		height?: number;
		index?: boolean;
		enabled?: boolean;
		dynamic?: boolean;
		autohide: boolean;
		click?: {
			select: boolean;
			modal: boolean;
		};
		hover?: {
			preload: boolean;
			select: boolean;
		};

	}

	// info component options
	export interface IOptionsInfo {

	}

	// image component options
	export interface IOptionsImage {

		transition?: string;
		size?: string;
		arrows?: {
			preload?: boolean;
			enabled?: boolean;
		};
		click?: {
			modal: boolean;
		};
		height?: number;
		heightMin?: number;
		heightAuto?: {
			initial?: boolean;
			onresize?: boolean;
		};
		placeholder: string;
	}

	// gallery options
	export interface IOptions {

		debug?: boolean;
		baseUrl?: string;
		hashUrl?: boolean;
		duplicates?: boolean;
		selected?: number;
		fields?: {
			source?: {
				modal?: string;
				panel?: string;
				image?: string;
				placeholder?: string;
			}
			title?: string;
			description?: string;
			thumbnail?: string;
		};
		autoplay?: {
			enabled?: boolean;
			delay?: number;
		};
		theme?: string;
		preload?: Array<number>;
		preloadNext?: boolean;
		preloadDelay?: number;
		loadingImage?: string;
		modal?: IOptionsModal;
		panel?: IOptionsPanel;
		image?: IOptionsImage;
		thumbnail?: IOptionsThumbnail;

	}

	// image source
	export interface ISource {

		modal: string; // original, required
		panel?: string;
		image?: string;
		color?: string;
		placeholder?: string;

	}

	// image file
	export interface IFile {

		source: ISource;
		title?: string;
		name?: string;
		extension?: string;
		description?: string;
		download?: string;
		loaded?: {
			modal?: boolean;
			panel?: boolean;
			image?: boolean;
		};
		width?: number;
		height?: number;

	}

	export interface IOver {
		modalImage: boolean;
		panel: boolean;
	}

	export interface IEdit {
		id: number;
		delete?: number;
		add?: Array<IFile>;
		update?: Array<IFile>;
		refresh?: boolean;
		selected?: number;
		options?: IOptions;
		delayThumbnails?: number;
		delayRefresh?: number;
	}

	export interface IScope extends ng.IScope {
		forward: () => void;
		backward: () => void;
	}

	// service controller interface
	export interface IServiceController {

		modalVisible: boolean;
		panelVisible: boolean;
		modalAvailable: boolean;
		modalInitialized: boolean;
		transitions: Array<string>;
		themes: Array<string>;
		classes: string;
		options: IOptions;
		items: Array<IFile>;
		selected: number;
		file: IFile;
		files: Array<IFile>;
		sizes: Array<string>;
		id: string;
		isSingle: boolean;
		events: {
			CONFIG_LOAD: string;
			AUTOPLAY_START: string;
			AUTOPLAY_STOP: string;
			PARSE_IMAGES: string;
			LOAD_IMAGE: string;
			FIRST_IMAGE: string;
			CHANGE_IMAGE: string;
			DOUBLE_IMAGE: string;
			MODAL_OPEN: string;
			MODAL_CLOSE: string;
			GALLERY_UPDATED: string;
			GALLERY_EDIT: string;
		};

		getInstance(component: any): IServiceController;

		setDefaults(): void;

		setOptions(options: IOptions): IOptions;

		setItems(items: Array<IFile>, force?: boolean): void;

		preload(wait?: number): void;

		normalize(index: number): number;

		setFocus(): void;

		setSelected(index: number);

		modalOpen(index: number): void;

		modalClose(): void;

		modalClick($event?: UIEvent): void;

		thumbnailsMove(delay?: number): void;

		toBackward(stop?: boolean): void;

		toForward(stop?: boolean): void;

		toFirst(stop?: boolean): void;

		toLast(stop?: boolean): void;

		loadImage(index?: number): void;

		loadImages(indexes: Array<number>): void;

		hoverPreload(index: number): void;

		autoPlayToggle(): void;

		toggle(element: string): void;

		setHash(): void;

		downloadLink(): string;

		el(selector): NodeList;

		log(event: string, data?: any): void;


	}

	// service controller
	export class ServiceController {

		public version = "2.0.8";
		public slug = 'asg';
		public id: string;
		public items: Array<IFile> = [];
		public files: Array<IFile> = [];
		public direction: string;
		public modalAvailable = false;
		public modalInitialized = false;

		private instances: {} = {};
		private _selected: number;
		private _visible = false;
		private autoplay: angular.IPromise<any>;
		private first = false;
		private editing = false;

		public options: IOptions = null;
		public optionsLoaded = false;
		public defaults: IOptions = {
			debug: false, // image load, autoplay, etc. info in console.log
			hashUrl: true, // enable/disable hash usage in url (#asg-nature-4)
			baseUrl: '', // url prefix
			duplicates: false, // enable or disable same images (url) in gallery
			selected: 0, // selected image on init
			fields: {
				source: {
					modal: 'url', // required, image url for modal component (large size)
					panel: 'url', // image url for panel component (thumbnail size)
					image: 'url', // image url for image (medium or custom size)
					placeholder: null // image url for preload lowres image
				},
				title: 'title', // title field name
				description: 'description', // description field name
			},
			autoplay: {
				enabled: false, // slideshow play enabled/disabled
				delay: 4100 // autoplay delay in millisecond
			},
			theme: 'default', // css style [default, darkblue, darkred, whitegold]
			preloadNext: false, // preload next image (forward/backward)
			preloadDelay: 770, // preload delay for preloadNext
			loadingImage: 'preload.svg', // loader image
			preload: [], // preload images by index number
			modal: {
				title: '', // modal window title
				subtitle: '', // modal window subtitle
				titleFromImage: false, // force update the gallery title by image title
				subtitleFromImage: false, // force update the gallery subtitle by image description
				placeholder: 'panel', // set image placeholder source type (thumbnail) or full url (http...)
				caption: {
					disabled: false, // disable image caption
					visible: true, // show/hide image caption
					position: 'top', // caption position [top, bottom]
					download: false // show/hide download link
				},
				header: {
					enabled: true, // enable/disable modal menu
					dynamic: false, // show/hide modal menu on mouseover
					buttons: ['playstop', 'index', 'prev', 'next', 'pin', 'size', 'transition', 'thumbnails', 'fullscreen', 'help', 'close'],
				},
				help: false, // show/hide help
				arrows: {
					enabled: true, // show/hide arrows
					preload: true, // preload image on mouseover
				},
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
						preload: true, // preload image on mouseover
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
					preload: true, // preload image on mouseover
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
					preload: true, // preload image on mouseover
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
				arrows: {
					enabled: true,  // show/hide arrows
					preload: true, // preload image on mouseover
				},
				click: {
					modal: true // when click on the image open the modal window
				},
				height: null, // height in pixel
				heightMin: null, // min height in pixel
				heightAuto: {
					initial: true, // calculate div height by first image
					onresize: false // calculate div height on window resize
				},
				placeholder: 'panel' // set image placeholder source type (thumbnail) or full url (http...)
			}
		};

		// available image sizes
		public sizes: Array<string> = [
			'contain',
			'cover',
			'auto',
			'stretch'
		];

		// available themes
		public themes: Array<string> = [
			'default',
			'darkblue',
			'whitegold'
		];

		// available transitions
		public transitions: Array<string> = [
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
			'zlideLR',
			'zlideTB',
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
			DOUBLE_IMAGE: 'ASG-double-image-',
			MODAL_OPEN: 'ASG-modal-open-',
			MODAL_CLOSE: 'ASG-modal-close-',
			THUMBNAIL_MOVE: 'ASG-thumbnail-move-',
			GALLERY_UPDATED: 'ASG-gallery-updated-',
			GALLERY_EDIT: 'ASG-gallery-edit',
		};

		constructor(private timeout: ng.ITimeoutService,
			private interval: ng.IIntervalService,
			private location: ng.ILocationService,
			private $rootScope: ng.IRootScopeService,
			private $window: ng.IWindowService) {

			angular.element($window).bind('resize', (event) => {
				this.thumbnailsMove(200);
			});

			// update images when edit event
			$rootScope.$on(this.events.GALLERY_EDIT, (event, data) => {
				if (this.instances[data.id]) {
					this.instances[data.id].editGallery(data);
				}
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
		public objectHashId(object: any): string {

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
		public getInstance(component: any) {

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
			instance.selected = component.selected ? component.selected : instance.options.selected;
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
		public setItems(items: Array<IFile>) {

			this.items = items ? items : [];
			this.prepareItems();

		}

		// options setup
		public setOptions(options: IOptions) {

			// if options already setup
			if (this.optionsLoaded) {
				return;
			}

			if (options) {

				this.options = angular.copy(this.defaults);
				angular.merge(this.options, options);

				if (options.modal && options.modal.header && options.modal.header.buttons) {

					this.options.modal.header.buttons = options.modal.header.buttons;

					// remove duplicates from buttons
					this.options.modal.header.buttons = this.options.modal.header.buttons.filter(function (x, i, a) {
						return a.indexOf(x) === i;
					});

				}

				this.optionsLoaded = true;

			} else {
				this.options = angular.copy(this.defaults);
			}

			// if !this.$window.screenfull
			if (!this.$window.screenfull) {
				this.options.modal.header.buttons = this.options.modal.header.buttons.filter(function (x, i, a) {
					return x !== 'fullscreen';
				});
			}


			// important!
			options = this.options;

			this.event(this.events.CONFIG_LOAD, this.options);

			return this.options;

		}

		// set selected image
		public set selected(v: number) {

			v = this.normalize(v);
			let prev = this._selected;

			this._selected = v;
			this.loadImage(this._selected);
			this.preload();

			if (this.file) {

				if (this.options.modal.titleFromImage && this.file.title) {
					this.options.modal.title = this.file.title;
				}

				if (this.options.modal.subtitleFromImage && this.file.description) {
					this.options.modal.subtitle = this.file.description;
				}

			}

			if (prev !== this._selected) {

				this.thumbnailsMove();
				this.event(this.events.CHANGE_IMAGE, {
					index: v,
					file: this.file
				});

			}

			this.options.selected = this._selected;

		}

		// get selected image
		public get selected() {

			return this._selected;

		}

		// force select image
		public forceSelect(index) {

			index = this.normalize(index);
			this._selected = index;
			this.loadImage(this._selected);
			this.preload();
			this.event(this.events.CHANGE_IMAGE, {
				index: index,
				file: this.file
			});

		}


		public setSelected(index: number) {

			this.autoPlayStop();
			this.direction = index > this.selected ? 'forward' : 'backward';
			this.selected = index;
			this.setHash();

		}


		// go to backward
		public toBackward(stop?: boolean) {

			if (stop) {
				this.autoPlayStop();
			}

			this.direction = 'backward';
			this.selected--;
			this.setHash();

		}

		// go to forward
		public toForward(stop?: boolean) {

			if (stop) {
				this.autoPlayStop();
			}

			this.direction = 'forward';
			this.selected++;
			this.setHash();

		}

		// go to first
		public toFirst(stop?: boolean) {

			if (stop) {
				this.autoPlayStop();
			}

			this.direction = 'backward';
			this.selected = 0;
			this.setHash();

		}

		// go to last
		public toLast(stop?: boolean) {

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
			this.event(this.events.AUTOPLAY_STOP, { index: this.selected, file: this.file });

		}

		public autoPlayStart() {

			if (this.autoplay) {
				return;
			}

			this.options.autoplay.enabled = true;
			this.autoplay = this.interval(() => {
				this.toForward();
			}, this.options.autoplay.delay);

			this.event(this.events.AUTOPLAY_START, { index: this.selected, file: this.file });

		}


		private prepareItems() {

			let length = this.items.length;
			for (let key = 0; key < length; key++) {
				this.addImage(this.items[key]);
			}

			this.event(this.events.PARSE_IMAGES, this.files);

		}

		// preload the image when mouseover
		public hoverPreload(index: number) {

			this.loadImage(index);

		}

		// image preload
		private preload(wait?: number) {

			let index = this.direction === 'forward' ? this.selected + 1 : this.selected - 1;

			if (this.options.preloadNext === true) {
				this.timeout(() => {
					this.loadImage(index);
				}, (wait !== undefined) ? wait : this.options.preloadDelay);
			}

		}

		public normalize(index: number) {

			let last = this.files.length - 1;

			if (index > last) {
				return (index - last) - 1;
			}

			if (index < 0) {
				return last - Math.abs(index) + 1;
			}

			return index;

		}


		public loadImages(indexes: Array<number>, type: string) {

			if (!indexes || indexes.length === 0) {
				return;
			}

			let self = this;

			indexes.forEach((index: number) => {
				self.loadImage(index);
			});

		}


		public loadImage(index?: number, callback?: {}) {

			index = index ? index : this.selected;
			index = this.normalize(index);

			if (!this.files[index]) {
				this.log('invalid file index', { index: index });
				return;
			}

			if (this.modalVisible) {

				if (this.files[index].loaded.modal === true) {
					return;
				}

				let modal = new Image();
				modal.src = this.files[index].source.modal;
				modal.addEventListener('load', (event) => {
					this.afterLoad(index, 'modal', modal);
				});

			} else {

				if (this.files[index].loaded.image === true) {
					return;
				}

				let image = new Image();
				image.src = this.files[index].source.image;
				image.addEventListener('load', () => {
					this.afterLoad(index, 'image', image);
				});

			}

		}

		// get file name
		private getFilename(index: number, type?: string) {

			type = type ? type : 'modal';
			let fileparts = this.files[index].source[type].split('/');
			let filename = fileparts[fileparts.length - 1];
			return filename;

		}

		// get file extension
		private getExtension(index: number, type?: string) {

			type = type ? type : 'modal';
			let fileparts = this.files[index].source[type].split('.');
			let extension = fileparts[fileparts.length - 1];
			return extension;

		}

		// after load image
		private afterLoad(index, type, image) {

			if (!this.files[index] || !this.files[index].loaded) {
				return;
			}

			if (this.files[index].loaded[type] === true) {
				this.files[index].loaded[type] = true;
				return;
			}

			if (type === 'modal') {
				this.files[index].width = image.width;
				this.files[index].height = image.height;
				this.files[index].name = this.getFilename(index, type);
				this.files[index].extension = this.getExtension(index, type);
				this.files[index].download = this.files[index].source.modal;
			}

			this.files[index].loaded[type] = true;

			let data = { type: type, index: index, file: this.file, img: image };

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
		public get file(): IFile {

			return this.files[this.selected];

		}

		// toggle element visible
		public toggle(element: string): void {

			this.options[element].visible = !this.options[element].visible;

		}


		// get visible
		public get modalVisible(): boolean {

			return this._visible;

		}


		// get theme
		public get theme(): string {

			return this.options.theme;

		}

		// get classes
		public get classes(): string {

			return this.options.theme + ' ' + this.id + (this.editing ? ' editing' : '');

		}

		// get preload style
		public preloadStyle(file: IFile, type: string) {

			let style = {};

			if (file.source.color) {
				style['background-color'] = file.source.color;
			}

			if (this.options.loadingImage && file.loaded[type] === false) {
				style['background-image'] = 'url(' + this.options.loadingImage + ')';
			}

			return style;

		}

		// get placeholder style
		public placeholderStyle(file: IFile, type: string) {

			let style = {};

			if (this.options[type].placeholder) {

				let index = this.options[type].placeholder;
				let isFull = (index.indexOf('//') === 0 || index.indexOf('http') === 0) ? true : false;
				let source;

				if (isFull) {
					source = index;
				} else {
					source = file.source[index];
				}

				if (source) {
					style['background-image'] = 'url(' + source + ')';
				}

			}

			if (file.source.color) {
				style['background-color'] = file.source.color;
			}

			if (file.source.placeholder) {
				style['background-image'] = 'url(' + file.source.placeholder + ')';
			}

			return style;

		}

		// set visible
		public set modalVisible(value: boolean) {

			this._visible = value;

			// set index 0 if !selected
			this.selected = this.selected ? this.selected : 0;

			let body = document.body;
			let className = 'asg-yhidden';

			if (value) {

				if (body.className.indexOf(className) < 0) {
					body.className = body.className + ' ' + className;
				}

				this.modalInit();

			} else {

				body.className = body.className.replace(className, '').trim();

			}

		}

		// initialize the gallery
		private modalInit() {

			let self = this;

			this.timeout(() => {
				self.setFocus();
			}, 100);

			this.thumbnailsMove(440);

			this.timeout(() => {
				this.modalInitialized = true;
			}, 460);

		}


		public modalOpen(index: number) {

			if (!this.modalAvailable) {
				return;
			}

			this.selected = index !== undefined ? index : this.selected;
			this.modalVisible = true;
			this.loadImage();
			this.setHash();
			this.event(this.events.MODAL_OPEN, { index: this.selected });

		}

		public modalClose() {

			if (this.options.hashUrl) {
				this.location.hash('');
			}

			this.modalInitialized = false;
			this.modalVisible = false;
			this.loadImage();
			this.event(this.events.MODAL_CLOSE, { index: this.selected });

		}

		// move thumbnails to correct position
		public thumbnailsMove(delay?: number) {

			let move = () => {

				let containers = this.el('div.asg-thumbnail.' + this.id);

				if (!containers.length) {
					return;
				}

				for (let i = 0; i < containers.length; i++) {

					let container: any = containers[i];

					if (container.offsetWidth) {

						let items: any = container.querySelector('div.items');
						let item: any = container.querySelector('div.item');
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
							});

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

		public modalClick($event?: UIEvent) {

			if ($event) {
				$event.stopPropagation();
			}

			this.setFocus();

		}

		// set the focus
		public setFocus() {

			if (this.modalVisible) {

				let element: Node = this.el('div.asg-modal.' + this.id + ' .keyInput')[0];

				if (element) {
					angular.element(element)[0]['focus']();
				}

			}

		}

		private event(event: string, data?: any) {

			event = event + this.id;
			this.$rootScope.$emit(event, data);
			this.log(event, data);

		}

		public log(event: string, data?: any) {

			if (this.options.debug) {
				console.log(event, data ? data : null);
			}

		}

		// get element
		public el(selector): NodeList {

			return document.querySelectorAll(selector);

		}

		// calculating element real width
		public getRealWidth(item) {

			let style = item.currentStyle || window.getComputedStyle(item),
				width = item.offsetWidth,
				margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
				// padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
				border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

			return width + margin + border;

		}

		// calculating element real height
		public getRealHeight(item) {

			let style = item.currentStyle || window.getComputedStyle(item),
				height = item.offsetHeight,
				margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom),
				// padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom),
				border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

			return height + margin + border;

		}


		// edit gallery
		public editGallery(edit: IEdit) {

			this.editing = true;
			let selected = this.selected;

			if (edit.options !== undefined) {
				this.optionsLoaded = false;
				this.setOptions(edit.options);
			}

			if (edit.delete !== undefined) {
				this.deleteImage(edit.delete);
			}

			if (edit.add) {
				let length = edit.add.length;
				for (let key = 0; key < length; key++) {
					this.addImage(edit.add[key]);
				}
			}

			if (edit.update) {

				let length = edit.update.length;

				for (let key = 0; key < length; key++) {
					this.addImage(edit.update[key], key);
				}

				let count = this.files.length - edit.update.length;
				if (count > 0) {
					this.deleteImage(length, count);
				}
			}

			this.timeout(() => {

				if (edit.selected >= 0) {
					selected = edit.selected;
				}

				selected = this.files[selected] ? selected : (selected >= this.files.length ? this.files.length - 1 : 0);

				this.forceSelect(this.files[selected] ? selected : 0);
				this.editing = false;
				this.event(this.events.GALLERY_UPDATED, edit);
				this.thumbnailsMove(edit.delayThumbnails !== undefined ? edit.delayThumbnails : 220);

			}, (edit.delayRefresh !== undefined ? edit.delayRefresh : 420));

		}


		// delete image
		public deleteImage(index: number, count?: number) {

			index = index === null || index === undefined ? this.selected : index;
			count = count ? count : 1;

			this.files.splice(index, count);

		}

		// find image in gallery by modal source
		public findImage(filename : string) {

			let length = this.files.length;

			for (let key = 0; key < length; key++) {
				if (this.files[key].source.modal === filename) {
					return this.files[key];
				}
			}

			return false;

		}


		public getFullUrl(url : string, baseUrl?: string) {

			baseUrl = baseUrl === undefined ? this.options.baseUrl : baseUrl;
			let isFull = (url.indexOf('//') === 0 || url.indexOf('http') === 0) ? true : false;

			return isFull ? url : baseUrl + url;

		}

		// add image
		public addImage(value: any, index?: number) {

			if (value === undefined || value === null) {
				return;
			}

			const self = this;

			if (angular.isString(value) === true) {
				value = { source: { modal: value } };
			}

			let getAvailableSource = function (type: string, src: ISource) {

				if (src[type]) {

					return self.getFullUrl(src[type]);

				} else {

					if (type === 'panel') {
						type = 'image';
						if (src[type]) {
							return self.getFullUrl(src[type]);
						}
					}

					if (type === 'image') {
						type = 'modal';
						if (src[type]) {
							return self.getFullUrl(src[type]);
						}
					}

					if (type === 'modal') {
						type = 'image';
						if (src[type]) {
							return self.getFullUrl(src[type]);
						}
					}

				}

			};

			if (!value.source) {
				value.source = {
					modal: value[self.options.fields.source.modal],
					panel: value[self.options.fields.source.panel],
					image: value[self.options.fields.source.image],
					placeholder: value[self.options.fields.source.placeholder]
				};
			}

			let source = {
				modal: getAvailableSource('modal', value.source),
				panel: getAvailableSource('panel', value.source),
				image: getAvailableSource('image', value.source),
				color: value.color ? value.color : 'transparent',
				placeholder: value.placeholder ? self.getFullUrl(value.placeholder) : null
			};

			if (!source.modal) {
				self.log('invalid image data', { source: source, value: value });
				return;
			}

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

			if (index !== undefined && this.files[index] !== undefined) {
				this.files[index] = file;
			} else {

				if (self.options.duplicates !== true && this.findImage(file.source.modal)) {
					self.event(self.events.DOUBLE_IMAGE, file);
					return;
				}

				this.files.push(file);

			}

		}

	}

	let app: ng.IModule = angular.module('angularSuperGallery');

	app.service('asgService', ['$timeout', '$interval', '$location', '$rootScope', '$window', ServiceController]);

}

