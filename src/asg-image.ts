var Vimeo;

namespace angularSuperGallery {

	export class ImageController {

		public id: string;
		public options: IOptions;
		public items: Array<IFile>;
		public baseUrl: string;

		private type = 'image';
		private asg: IServiceController;

		constructor(private service: IServiceController,
			private $rootScope: ng.IRootScopeService,
			private $element: ng.IRootElementService,
			private $timeout: ng.ITimeoutService,
			private $window: ng.IWindowService,
			private $scope: ng.IScope) {

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

			var self = this;

			// set image component height
			this.$rootScope.$on(this.asg.events.FIRST_IMAGE + this.id, (event, data) => {

				if (!this.config.height && this.config.heightAuto.initial === true) {
					this.$timeout(() => {
						self.setHeight(data.img);
					}, 10);
				}

			});

			// scope apply when image loaded
			this.$rootScope.$on(this.asg.events.LOAD_IMAGE + this.id, (event, data) => {

				this.$scope.$apply();

			});

		}

		// set image component height
		private setHeight(img) {

			let width = this.$element.children('div')[0].clientWidth;
			let ratio = img.width / img.height;
			this.config.height = width / ratio;

		}

		// height
		public get height() {

			return this.config.height;

		}


		// get image config
		public get config(): IOptionsImage {

			return this.asg.options[this.type];

		}

		// set image config
		public set config(value: IOptionsImage) {

			this.asg.options[this.type] = value;

		}

		public toBackward(stop?: boolean, $event?: UIEvent) {

			if ($event) {
				$event.stopPropagation();
			}

			this.asg.toBackward(stop);

		}

		public toForward(stop?: boolean, $event?: UIEvent) {

			if ($event) {
				$event.stopPropagation();
			}

			this.asg.toForward(stop);

		}

		public hover(index: number, $event?: MouseEvent) {

			if (this.config.arrows.preload === true) {
				this.asg.hoverPreload(index);
			}

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

		// modal available
		public get modalAvailable() {

			return this.asg.modalAvailable && this.config.click.modal;

		}

		// open the modal
		public modalOpen($event: UIEvent) {

			if ($event) {
				$event.stopPropagation();
			}

			if (this.config.click.modal) {
				this.asg.modalOpen(this.asg.selected);
			}

		}

		public playVideo($event: UIEvent) {

			if ($event) {
				$event.stopPropagation();
			}

			var self = this;

			this.asg.file.video.visible = true;
			this.asg.file.video.htmlId = 'vimeo_video_' + this.asg.file.video.vimeoId;

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

			// player.loadVideo(this.asg.file.video.vimeoId).then(function(id) {

			// })

			player.setVolume(0.5);

			player.play().catch(function (error) {
				console.error('error playing the video:', error);
			})

			player.on('play', function() {
				self.asg.file.video.playing = true;
				console.log('play the video!');
			});

			player.on('pause', function() {
				self.asg.file.video.playing = false
				console.log('paused the video!');
			});

			this.asg.file.video.player = player;
			this.asg.file.video.playing = true;

		}

	}

	let app: ng.IModule = angular.module('angularSuperGallery');

	app.component('asgImage', {
		controller: ['asgService', '$rootScope', '$element', '$timeout', '$window', '$scope', angularSuperGallery.ImageController],
		templateUrl: '/views/asg-image.html',
		transclude: true,
		bindings: {
			id: '@?',
			items: '=?',
			options: '=?',
			selected: '=?',
			baseUrl: '@?'
		}
	});


}
