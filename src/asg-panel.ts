namespace angularSuperGallery {

	export class PanelController {

		public id: string;
		public options: IOptions;
		public items: Array<IFile>;
		public baseUrl: string;

		private type = 'panel';
		private template;
		private asg: IServiceController;

		constructor(
			private service: IServiceController,
			private $scope: ng.IScope) {

			this.template = '/views/asg-panel.html';

		}

		public $onInit() {

			// get service instance
			this.asg = this.service.getInstance(this);

		}

		// set selected image
		public setSelected(index: number, $event?: MouseEvent) {

			this.asg.modalClick($event);

			if (this.config.click.modal) {
				this.asg.modalOpen(index);
				return;
			}

			if (this.config.click.select) {
				this.asg.setSelected(index);
			}

		}

		public hover(index: number, $event?: MouseEvent) {

			if (this.config.hover.preload === true) {
				this.asg.hoverPreload(index);
			}

			if (this.config.hover.select === true) {
				this.asg.setSelected(index);
			}

		}

		// get panel config
		public get config(): IOptionsPanel {

			return this.asg.options[this.type];

		}

		// set panel config
		public set config(value: IOptionsPanel) {

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

	app.component('asgPanel', {
		controller: ['asgService', '$scope', angularSuperGallery.PanelController],
		template: '<div class="asg-panel {{ $ctrl.asg.classes }}" ng-mouseover="$ctrl.asg.over.panel = true;" ng-mouseleave="$ctrl.asg.over.panel = false;" ng-show="$ctrl.config.visible"><div ng-include="$ctrl.template"></div><ng-transclude></ng-transclude></div>',
		transclude: true,
		bindings: {
			id: '@',
			items: '=?',
			options: '=?',
			selected: '=?',
			visible: '=?',
			template: '@?',
			baseUrl: '@?'
		}
	});

}
