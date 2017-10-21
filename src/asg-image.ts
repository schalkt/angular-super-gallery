module ASG {

	export class ImageController {

		public id : string;
		public options : IOptions;
		public items : Array<IFile>;

		private type : string = 'image';
		private asg : IServiceController;

		constructor(private service : IServiceController,
					private $rootScope : ng.IRootScopeService,
					private $element : ng.IRootElementService,
					private $window : ng.IWindowService,
					private $scope : ng.IScope) {

			angular.element($window).bind('resize', (event) => {
				this.onResize()
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

			});

		}

		// set image component height
		private setHeight(img) {

			var width = this.$element.children('div').width();
			var ratio = img.width / img.height;
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

	}

	var app : ng.IModule = angular.module('angularSuperGallery');

	app.component("asgImage", {
		controller: ["asgService", "$rootScope", "$element", "$window", "$scope", ASG.ImageController],
		templateUrl: 'views/asg-image.html',
		transclude: true,
		bindings: {
			id: "@?",
			items: '=?',
			options: '=?',
			selected: '=?'
		}
	});


}