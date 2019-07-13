namespace angularSuperGallery {

	export class ControlController {

		public id: string;
		private type = 'control';
		private asg: IServiceController;
		private template;

		constructor(
			private service: IServiceController,
			private $scope: IScope) {

			this.template = '/views/asg-control.html';

		}

		public $onInit() {

			// get service instance
			this.asg = this.service.getInstance(this);

			this.$scope.forward = () => {
				this.asg.toForward(true);
			};

			this.$scope.backward = () => {
				this.asg.toBackward(true);
			};

		}


		// get image config
		public get config(): IOptionsImage {

			return this.asg.options[this.type];

		}

		// set image config
		public set config(value: IOptionsImage) {

			this.asg.options[this.type] = value;

		}

		// set selected image
		public set selected(v: number) {

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

	let app: ng.IModule = angular.module('angularSuperGallery');

	app.component('asgControl', {
		controller: ['asgService', '$scope', angularSuperGallery.ControlController],
		template: '<div class="asg-control {{ $ctrl.asg.classes }}"><div ng-include="$ctrl.template"></div></div>',
		bindings: {
			id: '@?',
			selected: '=?',
			template: '@?'
		}
	});

}
