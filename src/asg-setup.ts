module ASG {

	export class SetupController {

		public id : string;
		public options : IOptions;
		public items : Array<IFile>;
		private asg : IServiceController;

		constructor(private service : IServiceController) {

		}

		public $onInit() {

			this.asg = this.service.getInstance(this.id);
			this.options = this.asg.setup(this.options, this.items);

		}

	}

	var app : ng.IModule = angular.module('angularSuperGallery');

	app.component("asgSetup", {
		controller: ["asgService", ASG.SetupController],
		bindings: {
			id: "@",
			items: '=',
			options: '=?',
			selected: '=',
		}
	});

}