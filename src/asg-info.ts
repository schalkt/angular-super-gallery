module ASG {

	export class InfoController {

		public id : string;
		private type : string = 'info';
		private asg : IServiceController;
		private template : string = 'views/asg-info.html';

		constructor(private service : IServiceController,
					private $scope : ng.IScope) {

		}

		public $onInit() {

			// get service instance
			this.asg = this.service.getInstance(this);

		}

		public get file() {
			return this.asg.file;
		}

	}

	var app : ng.IModule = angular.module('angularSuperGallery');

	app.component("asgInfo", {
		controller: ["asgService", "$scope", ASG.InfoController],
		template: '<div class="asg-info {{ $ctrl.asg.theme }}"><div ng-include="$ctrl.template"></div></div>',
		transclude: true,
		bindings: {
			id: "@",
			template: "@?"
		}
	});

}