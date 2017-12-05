namespace angularSuperGallery {

	export class InfoController {

		public id : string;
		private type = 'info';
		private asg : IServiceController;
		private template = 'views/asg-info.html';

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

	let app : ng.IModule = angular.module('angularSuperGallery');

	app.component('asgInfo', {
		controller: ['asgService', '$scope', angularSuperGallery.InfoController],
		template: '<div class="asg-info {{ $ctrl.asg.classes }}"><div ng-include="$ctrl.template"></div></div>',
		transclude: true,
		bindings: {
			id: '@?',
			template: '@?'
		}
	});

}
