var Vimeo;

namespace angularSuperGallery {

	export class ItemController {

		public id: string;
		public item: IFile;
		public file: IFile;

		private type = 'item';
		private asg: IServiceController;

		constructor(private service: IServiceController,
			private $rootScope: ng.IRootScopeService,
			private $element: ng.IRootElementService,
			private $timeout: ng.ITimeoutService,
			private $window: ng.IWindowService,
			private $scope: ng.IScope) {

		}

		public $onInit() {

			// get service instance
			this.asg = this.service.getInstance(this);

			if (this.item) {
				this.file = this.asg.addImage(this.item);
			}

		}

		// get image config
		public get config(): IOptionsImage {

			return this.asg.options[this.type];

		}

		// set image config
		public set config(value: IOptionsImage) {

			this.asg.options[this.type] = value;

		}

		public preload($event: MouseEvent, size : string) {

			if ($event) {
				$event.stopPropagation();
			}

			this.asg.preloadImage(this.file.index, size);

		}

		public click($event: UIEvent) {

			if ($event) {
				$event.stopPropagation();
			}

			this.asg.setSelected(this.file.index);

			if (this.asg.options.container.fullsize) {
				this.asg.containerFullSize();
			}

		}

	}

	let app: ng.IModule = angular.module('angularSuperGallery');

	app.component('asgItem', {
		controller: ['asgService', '$rootScope', '$element', '$timeout', '$window', '$scope', angularSuperGallery.ItemController],
		templateUrl: '/views/asg-item.html',
		transclude: true,
		bindings: {
			id: '@?',
			item: '=?',
		}
	});


}
