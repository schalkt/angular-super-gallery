namespace angularSuperGallery {

	export class ThumbnailController {

		public id : string;
		public options : IOptions;
		public items : Array<IFile>;

		private type = 'thumbnail';
		private template = 'views/asg-thumbnail.html';
		private asg : IServiceController;
		private modal = false;

		constructor(private service : IServiceController,
					private $scope : ng.IScope,
					private $element : ng.IRootElementService) {

		}

		public $onInit() {

			// get service instance
			this.asg = this.service.getInstance(this);

			// get parent asg component (modal)
			if (this.$scope && this.$scope.$parent && this.$scope.$parent.$parent && this.$scope.$parent.$parent.$ctrl) {
				this.modal = this.$scope.$parent.$parent.$ctrl.type == 'modal' ? true : false;
			}

		}

		// get above from config
		public get dynamic() {

			return this.config.dynamic ? 'dynamic' : null;

		}

		// set selected image
		public setSelected(index : number, $event? : MouseEvent) {

			this.asg.modalClick($event);
			this.asg.setSelected(index);

		}

		// get thumbnail config
		public get config() : IOptionsThumbnail {

			return this.modal ? this.asg.options['modal'][this.type] : this.asg.options[this.type];

		}

		// set thumbnail config
		public set config(value : IOptionsThumbnail) {

			if (this.modal) {
				this.asg.options[this.type] = value;
			} else {
				this.asg.options['modal'][this.type] = value;
			}

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

	app.component('asgThumbnail', {
		controller: ['asgService', '$scope', '$element', angularSuperGallery.ThumbnailController],
		template: '<div ng-show="$ctrl.config.visible" class="asg-thumbnail {{ $ctrl.asg.theme }} {{ $ctrl.id }} {{ $ctrl.dynamic }}" ng-click="$ctrl.asg.modalClick($event);"><div ng-include="$ctrl.template"></div></div>',
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
