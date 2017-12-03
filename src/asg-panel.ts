namespace angularSuperGallery {

	export class PanelController {

		public id : string;
		public options : IOptions;
		public items : Array<IFile>;

		private type = 'panel';
		private template = 'views/asg-panel.html';
		private asg : IServiceController;

		constructor(private service : IServiceController,
					private $scope : ng.IScope) {

		}

		public $onInit() {

			// get service instance
			this.asg = this.service.getInstance(this);

		}

		public setSelected(index : number, $event? : UIEvent) {

			this.asg.modalClick($event);
			this.asg.setSelected(index);

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

	let app : ng.IModule = angular.module('angularSuperGallery');

	app.component('asgPanel', {
		controller: ['asgService', '$scope', angularSuperGallery.PanelController],
		template: '<div class="asg-panel {{ $ctrl.asg.theme }}" ng-mouseover="$ctrl.asg.over.panel = true;" ng-mouseleave="$ctrl.asg.over.panel = false;" ng-show="$ctrl.config.visible"><div ng-include="$ctrl.template"></div></div>',
		bindings: {
			id: '@',
			items: '=?',
			options: '=?',
			selected: '=?',
			visible: '=?',
			template: '@?'
		}
	});

}
