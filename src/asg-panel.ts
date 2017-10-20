module ASG {

	export class PanelController {

		public id : string;
		public options : IOptions;
		public items : Array<IFile>;

		private type : string = 'panel';
		private asg : IServiceController;

		constructor(private service : IServiceController,
					private $scope : ng.IScope) {

		}

		public $onInit() {

			// get service instance
			this.asg = this.service.getInstance(this);

		}

		// get panel config
		public get config() : IOptionsPanel {

			return this.asg.options[this.type];

		}

		// set panel config
		public set config(value : IOptionsPanel) {

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

	app.component("asgPanel", {
		controller: ["asgService", "$scope", ASG.PanelController],
		templateUrl: 'views/asg-panel.html',
		bindings: {
			id: "@",
			items: '=?',
			options: '=?',
			selected: '=?',
			visible: '=?'
		}
	});

}