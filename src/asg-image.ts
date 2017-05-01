module ASG {

	export class ImageController {

		public id : string;
		private asg : IServiceController;

		constructor(private service : IServiceController) {

		}

		public $onInit() {

			// get service instance by id
			this.asg = this.service.getInstance(this.id);
			this.asg.preload(1);

		}

		public get options() : IOptionsImage {

			return this.asg.options.image;

		}

		public set options(value : IOptionsImage) {

			this.asg.options.image = value;

		}

	}

	var app : ng.IModule = angular.module('angularSuperGallery');

	app.component("asgImage", {
		controller: ["asgService", ASG.ImageController],
		templateUrl: 'views/asg-image.html',
		bindings: {
			id: "@"
		}
	});


}