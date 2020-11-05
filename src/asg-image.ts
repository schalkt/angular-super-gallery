var Vimeo;

namespace angularSuperGallery {

	export class ImageController {

		public id: string;
		public options: IOptions = {};
		public baseUrl: string = '';
		public item: IFile;
		public file: IFile;
		public index: number;

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
			this.config.available = true;

			// scope apply when image loaded
			this.$rootScope.$on(this.asg.events.LOAD_IMAGE + this.id, (event, data) => {
				this.$scope.$apply();
			});

			if (this.index) {
				this.file = this.asg.files[this.index] ? this.asg.files[this.index] : undefined;

				console.log('image index', this.index);
			}

			if (this.item) {
				this.file = this.asg.addImage(this.item);
				this.index = this.file.index;
			}

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

		public containerAction($event: UIEvent) {

			if ($event) {
				$event.stopPropagation();
			}

			if (!this.asg.options.container.available) {
				return;
			}

			this.asg.setSelected(this.file.index);

			if (this.asg.options.container.fullsize) {
				this.asg.containerFullSize();
			}

		}

	}

	let app: ng.IModule = angular.module('angularSuperGallery');

	app.component('asgImage', {
		controller: ['asgService', '$rootScope', '$element', '$timeout', '$window', '$scope', angularSuperGallery.ImageController],
		templateUrl: '/views/asg-image.html',
		transclude: true,
		bindings: {
			id: '@?',
			item: '=?',
			index: '=?',
			options: '=?',
			selected: '=?',
			baseUrl: '@?'
		}
	});


}
