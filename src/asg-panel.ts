module ASG {

	export class PanelController {

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

		// get panel config
		public get config() : IOptionsPanel {

			return this.asg.options.panel;

		}

		// set panel config
		public set config(value : IOptionsPanel) {

			this.asg.options.panel = value;

		}

	}

	var app : ng.IModule = angular.module('angularSuperGallery');

	app.component("asgPanel", {
		controller: ["asgService", ASG.PanelController],
		templateUrl: 'views/asg-panel.html',
		bindings: {
			id: "@",
			items: '=?',
			options: '=?',
			selected: '=?'
		}
	});

}