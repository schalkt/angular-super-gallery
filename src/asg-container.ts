namespace angularSuperGallery {

	export class ContainerController {

		public id: string;
		public options: IOptions;
		public items: Array<IFile>;
		public baseUrl: string;

		private type = 'container';
		private asg: IServiceController;
		private arrowsVisible = false;

		constructor(private service: IServiceController,
			private $window: ng.IWindowService,
			private $rootScope: ng.IRootScopeService,
			private $element: ng.IRootElementService,
			private $timeout: ng.ITimeoutService,
			private $scope: ng.IScope) {

			this.options = this.options ? this.options : {};

			angular.element($window).bind('resize', (event) => {
				this.onResize();
			});

		}

		private onResize() {

			if (this.config.heightAuto.onresize) {
				this.setHeight(this.asg.file);
			}

		}

		public $onInit() {

			// get service instance
			this.asg = this.service.getInstance(this);
			this.config.available = true;
			this.config.visibleDefault = this.config.visible;

			var self = this;

			// set image component height
			this.$rootScope.$on(this.asg.events.FIRST_IMAGE + this.id, (event, data) => {

				if (!this.config.height && this.config.heightAuto.initial === true) {

					this.$timeout(() => {
						self.setHeight(data.img);
					}, 100);
				}

			});

			// scope apply when image loaded
			this.$rootScope.$on(this.asg.events.LOAD_IMAGE + this.id, (event, data) => {
				this.$scope.$apply();
			});

		}

		// set image component height
		private setHeight(img) {

			let el = this.$element.children('div')[0];

			if (el) {
				let width = this.$element.children('div')[0].clientWidth;
				let ratio = img.width / img.height;
				this.config.height = width / ratio;
			}

		}

		// height
		public get height() {

			return this.config.height;

		}

		private getClass() {

			if (!this.config) {
				return;
			}

			let ngClass = [];

			if (this.config.header.dynamic) {
				ngClass.push('dynamic');
			}

			if (this.config.fullsize) {
				ngClass.push('fullsize');
			}

			ngClass.push(this.asg.options.theme);

			return ngClass.join(' ');

		}

		// get action from keycodes
		private getActionByKeyCode(keyCode: number) {

			let keys = Object.keys(this.config.keycodes);
			let action;

			for (let key in keys) {

				let codes = this.config.keycodes[keys[key]];

				if (!codes) {
					continue;
				}

				let index = codes.indexOf(keyCode);

				if (index > -1) {
					action = keys[key];
					break;
				}

			}

			return action;

		}


		public close($event?: UIEvent) {

			this.asg.modalClick($event);
			this.asg.modalClose();
			this.exitFullScreen();
			this.toggleFullSize();

		}

		public imageClick($event?: UIEvent) {

			this.asg.modalClick($event);

			if (this.config.click.close) {
				this.toggleFullSize();
				this.exitFullScreen();
			}

		}

		public hover(index: number, $event?: MouseEvent) {

			if (this.config.arrows.preload === true) {
				this.asg.hoverPreload(index);
			}

		}

		public setFocus($event?: UIEvent) {

			this.asg.modalClick($event);

		}

		public autoPlayToggle($event?: UIEvent) {

			this.asg.modalClick($event);
			this.asg.autoPlayToggle();

		}

		public toFirst(stop?: boolean, $event?: UIEvent) {

			this.asg.modalClick($event);
			this.asg.toFirst();
			this.$scope.$apply();

		}

		public toBackward(stop?: boolean, $event?: UIEvent) {

			this.asg.modalClick($event);
			this.asg.toBackward(stop);
			this.$scope.$apply();

		}

		public toForward(stop?: boolean, $event?: UIEvent) {

			this.asg.modalClick($event);
			this.asg.toForward(stop);
			this.$scope.$apply();

		}

		public toLast(stop?: boolean, $event?: UIEvent) {

			this.asg.modalClick($event);
			this.asg.toLast(stop);
			this.$scope.$apply();

		}

		// do keyboard action
		public keyUp(e: KeyboardEvent) {

			let action: string = this.getActionByKeyCode(e.keyCode);

			this.asg.log('key up', action);

			switch (action) {

				case 'exit':
					this.close();
					break;

				case 'playpause':
					this.asg.autoPlayToggle();
					break;

				case 'forward':
					this.asg.toForward(true);
					break;

				case 'backward':
					this.asg.toBackward(true);
					break;

				case 'first':
					this.asg.toFirst(true);
					break;

				case 'last':
					this.asg.toLast(true);
					break;

				case 'fullscreen':
					this.toggleFullScreen();
					break;

				case 'fullsize':
					this.toggleFullSize();
					break;

				case 'menu':
					this.toggleMenu();
					break;

				case 'caption':
					this.toggleCaption();
					break;

				case 'help':
					this.toggleHelp();
					break;

				case 'size':
					this.toggleSize();
					break;

				case 'transition':
					this.nextTransition();
					break;

				default:
					this.asg.log('unknown keyboard action: ' + e.keyCode);
					break;

			}

		}


		// switch to next transition effect
		private nextTransition($event?: UIEvent) {

			this.asg.modalClick($event);
			let idx = this.asg.transitions.indexOf(this.config.transition) + 1;
			let next = idx >= this.asg.transitions.length ? 0 : idx;
			this.config.transition = this.asg.transitions[next];

		}


		// toggle fullsize
		private toggleFullSize($event?: UIEvent) {

			this.asg.modalClick($event);

			if (this.config.visibleDefault) {
				this.config.fullsize = !this.config.fullsize;
			} else {
				this.config.visible = !this.config.visible;

				if (this.asg.file.video && this.asg.file.video.playing) {
					this.asg.file.video.player.pause();
					this.asg.file.video.paused = true;
				}

			}

		}


		// toggle fullscreen
		private toggleFullScreen($event?: UIEvent) {

			this.asg.modalClick($event);

			if (!this.$window.screenfull) {
				return;
			}

			this.$window.screenfull.toggle();

		}

		// exit fullscreen
		private exitFullScreen() {

			if (!this.$window.screenfull) {
				return;
			}

			if (!this.$window.screenfull.isFullscreen) {
				return;
			}

			this.$window.screenfull.exit();

		}

		// toggle thumbnails
		private toggleThumbnails($event?: UIEvent) {

			this.asg.modalClick($event);
			this.config.thumbnail.dynamic = !this.config.thumbnail.dynamic;

			console.log(this.config.thumbnail);

		}

		// set transition effect
		public setTransition(transition, $event?: UIEvent) {

			this.asg.modalClick($event);
			this.config.transition = transition;

		}

		// set theme
		public setTheme(theme: string, $event?: UIEvent) {

			this.asg.modalClick($event);
			this.asg.options.theme = theme;

		}

		// toggle help
		private toggleHelp($event?: UIEvent) {

			this.asg.modalClick($event);
			this.config.help = !this.config.help;

		}

		// toggle size
		private toggleSize($event?: UIEvent) {

			this.asg.modalClick($event);
			let index = this.asg.sizes.indexOf(this.config.size);
			index = (index + 1) >= this.asg.sizes.length ? 0 : ++index;
			this.config.size = this.asg.sizes[index];
			this.asg.log('toggle image size:', [this.config.size, index]);

		}

		// toggle menu
		private toggleMenu($event?: UIEvent) {

			this.asg.modalClick($event);
			this.config.header.dynamic = !this.config.header.dynamic;

		}

		// toggle caption
		private toggleCaption() {

			this.config.caption.visible = !this.config.caption.visible;

		}


		public playVideo($event: UIEvent) {

			if ($event) {
				$event.stopPropagation();
			}

			if (!this.asg.file.video.vimeoId) {
				return;
			}

			var self = this;

			this.asg.file.video.visible = true;
			this.asg.file.video.htmlId = 'modal_vimeo_video_' + this.asg.file.video.vimeoId;

			var options = {
				id: this.asg.file.video.vimeoId,
				responsive: true,
				loop: false
			};

			// console.log('video',  this.asg.file.video);
			// console.log('vimeo options', options);

			if (this.asg.file.video.player) {
				var player = this.asg.file.video.player;
			} else {
				var player = new Vimeo.Player(this.asg.file.video.htmlId, options);
			}

			player.setVolume(0.5);
			player.play().catch(function (error) {
				console.error('error playing the video:', error);
			})

			// player.loadVideo(this.asg.file.video.vimeoId).then(function(id) {
			// });

			player.on('play', function () {
				self.asg.file.video.playing = true;
				self.asg.file.video.visible = true;
				self.$scope.$apply();
				//console.log('play the video!');
			});

			player.on('pause', function () {
				self.asg.file.video.playing = false
				self.asg.file.video.visible = false;
				self.$scope.$apply();
				//console.log('paused the video!');
			});

			this.asg.file.video.player = player;
			this.asg.file.video.playing = true;

		}

		// get margint top
		public get marginTop() {

			return this.config.marginTop;

		}

		// get margin bottom
		public get marginBottom() {

			return this.config.marginBottom;

		}

		// get modal visible
		public get visible() {

			if (!this.asg) {
				return;
			}

			return this.config.visible;

		}

		// set modal visible
		public set visible(value: boolean) {

			if (!this.asg) {
				return;
			}

			this.config.visible = value;
			this.asg.setHash();

		}

		// set selected image
		public set selected(v: number) {

			if (!this.asg) {
				return;
			}

			this.asg.selected = v;

		}

		// get selected image
		public get selected() {

			if (!this.asg) {
				return;
			}

			return this.asg.selected;

		}

		// get container config
		public get config(): IOptionsContainer {

			return this.asg.options[this.type];

		}

		// set container config
		public set config(value: IOptionsContainer) {

			this.asg.options[this.type] = value;

		}

	}


	let app: ng.IModule = angular.module('angularSuperGallery');

	app.component('asgContainer', {
		controller: ['asgService', '$window', '$rootScope', '$element', '$timeout', '$scope', angularSuperGallery.ContainerController],
		templateUrl: '/views/asg-container.html',
		transclude: true,
		bindings: {
			id: '@?',
			items: '=?',
			options: '=?',
			selected: '=?',
			visible: '=?',
			baseUrl: '@?'
		}
	});

}
