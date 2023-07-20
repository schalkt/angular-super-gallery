namespace angularSuperGallery {

	export class DebugController {

		public id: string;
		private asg: IServiceController;
		private type;
		private template;

		constructor(
			private service: IServiceController,
			private $scope: ng.IScope) {

			this.type = 'info';
			this.template = '/views/asg-debug.html';

		}

		public $onInit() {

			// get service instance
			this.asg = this.service.getInstance(this);

		}

		public get file() {
			return this.asg ? this.asg.file : null;
		}

	}

	let app: ng.IModule = angular.module('angularSuperGallery');

	app.component('asgDebug', {
		controller: ['asgService', '$scope', angularSuperGallery.DebugController],
		template: '<div class="asg-debug {{ $ctrl.asg.classes }}"><div ng-include="$ctrl.template"></div></div>',
		transclude: true,
		bindings: {
			id: '@?',
			template: '@?'
		}
	});

}
