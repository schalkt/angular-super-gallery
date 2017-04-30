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