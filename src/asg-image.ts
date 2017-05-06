module ASG {

	export class ImageController {

		private type : string = 'image';

		public id : string;
		public options : IOptions;
		public items : Array<IFile>;
		public selected : number;

		private asg : IServiceController;

		constructor(private service : IServiceController) {

		}

		public $onInit() {

			// get service instance
			this.asg = this.service.getInstance(this);

		}

		// get image config
		public get config() : IOptionsImage {

			return this.asg.options[this.type];

		}

		// set image config
		public set config(value : IOptionsImage) {

			this.asg.options[this.type] = value;

		}

	}

	var app : ng.IModule = angular.module('angularSuperGallery');

	app.component("asgImage", {
		controller: ["asgService", ASG.ImageController],
		templateUrl: 'views/asg-image.html',
		bindings: {
			id: "@",
			items: '=?',
			options: '=?',
			selected: '=?'
		}
	});


}