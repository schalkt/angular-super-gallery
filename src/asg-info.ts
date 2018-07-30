import { IServiceController } from './asg-interfaces';

export class InfoController {

	public id: string;
	private asg: IServiceController;
	private type;
	private template;

	constructor(
		private service: IServiceController,
		private $scope: ng.IScope) {

		this.type = 'info';
		this.template = 'views/asg-info.html';

	}

	public $onInit() {

		// get service instance
		this.asg = this.service.getInstance(this);

	}

	public get file() {
		return this.asg.file;
	}

}

export const asgInfoComponent = {
	controller: ['asgService', '$scope', InfoController],
	template: '<div class="asg-info {{ $ctrl.asg.classes }}"><div ng-include="$ctrl.template"></div></div>',
	transclude: true,
	bindings: {
		id: '@?',
		template: '@?'
	}
};
