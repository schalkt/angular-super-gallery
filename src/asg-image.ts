namespace angularSuperGallery {

	export class ImageController {

		public id : string;
		public options : IOptions;
		public items : Array<IFile>;
		public baseUrl : string;

		private type = 'image';
		private asg : IServiceController;

		constructor(private service : IServiceController,
					private $rootScope : ng.IRootScopeService,
					private $element : ng.IRootElementService,
					private $window : ng.IWindowService,
					private $scope : ng.IScope) {

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

			// set image component height
			this.$rootScope.$on(this.asg.events.FIRST_IMAGE + this.id, (event, data) => {

				if (!this.config.height && this.config.heightAuto.initial === true) {
					this.setHeight(data.img);
				}

				this.asg.thumbnailsMove(200);

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
		public get config() : IOptionsImage {

			return this.asg.options[this.type];

		}

		// set image config
		public set config(value : IOptionsImage) {

			this.asg.options[this.type] = value;

		}

		public toBackward(stop? : boolean, $event? : UIEvent) {

			if ($event) {
				$event.stopPropagation();
			}

			this.asg.toBackward(stop);

		}

		public toForward(stop? : boolean, $event? : UIEvent) {

			if ($event) {
				$event.stopPropagation();
			}

			this.asg.toForward(stop);

		}

		public hover(index : number, $event? : MouseEvent) {

			if (this.config.arrows.preload === true) {
				this.asg.hoverPreload(index);
			}

		}

		// set selected image
		public set selected(v : number) {

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
		public modalOpen($event : UIEvent) {

			if ($event) {
				$event.stopPropagation();
			}

			if (this.config.click.modal) {
				this.asg.modalOpen(this.asg.selected);
			}

		}

	}

	let app : ng.IModule = angular.module('angularSuperGallery');

	app.component('asgImage', {
		controller: ['asgService', '$rootScope', '$element', '$window', '$scope', angularSuperGallery.ImageController],
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
