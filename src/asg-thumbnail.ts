namespace angularSuperGallery {

	export class ThumbnailController {

		public id: string;
		public options: IOptions;
		public items: Array<IFile>;
		public baseUrl: string;

		private type = 'thumbnail';
		private template;
		private asg: IServiceController;
		private modal = false;
		private initialized = false;

		constructor(
			private service: IServiceController,
			private $scope: IScope,
			private $element: ng.IRootElementService,
			private $timeout: ng.ITimeoutService) {

			this.template = '/views/asg-thumbnail.html';

		}

		public $onInit() {

			// get service instance
			this.asg = this.service.getInstance(this);

			// get parent asg component (modal)
			if (this.$scope && this.$scope.$parent && this.$scope.$parent.$parent && this.$scope.$parent.$parent['$ctrl']) {
				this.modal = this.$scope.$parent.$parent['$ctrl'].type === 'modal' ? true : false;
			}

			if (!this.modal) {
				this.$timeout(() => {
					this.initialized = true;
				}, 420);
			}

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

		// prelod when mouseover and set selected if enabled
		public hover(index: number, $event?: MouseEvent) {

			if (this.config.hover.preload === true) {
				this.asg.hoverPreload(index);
			}

			if (this.config.hover.select === true) {
				this.asg.setSelected(index);
			}

		}

		// get thumbnail config
		public get config(): IOptionsThumbnail {

			return this.modal ? this.asg.options.modal[this.type] : this.asg.options[this.type];

		}

		// set thumbnail config
		public set config(value: IOptionsThumbnail) {

			if (this.modal) {
				this.asg.options[this.type] = value;
			} else {
				this.asg.options.modal[this.type] = value;
			}

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

		// get above from config
		public get dynamic() {

			return this.config.dynamic ? 'dynamic' : '';

		}

		// autohide and isSingle == true ?
		public get autohide() {

			return this.config.autohide && this.asg.isSingle ? true : false;

		}

		// get classes
		public get classes(): string {

			let show;

			if (this.modal) {
				show = this.asg.modalInitialized ? 'initialized' : 'initializing';
			} else {
				show = this.initialized ? 'initialized' : 'initializing';
			}

			return this.asg.classes + ' ' + this.dynamic + ' ' + show;

		}

	}

	let app: ng.IModule = angular.module('angularSuperGallery');

	app.component('asgThumbnail', {
		controller: ['asgService', '$scope', '$element', '$timeout', angularSuperGallery.ThumbnailController],
		template: '<div data-ng-if="!$ctrl.autohide" class="asg-thumbnail {{ $ctrl.classes }}" ng-click="$ctrl.asg.modalClick($event);"><div ng-include="$ctrl.template"></div></div>',
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
