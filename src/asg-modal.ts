namespace ASG {

	export class ModalController {

		public id : string;
		public options : IOptions;
		public items : Array<IFile>;

		private type = 'modal';
		private asg : IServiceController;
		private arrowsVisible = false;

		constructor(private service : IServiceController,
					private fullscreen,
					private $scope : ng.IScope) {

		}


		public $onInit() {

			// get service instance
			this.asg = this.service.getInstance(this);
			this.asg.modalAvailable = true;

		}


		private getClass() {

			if (!this.config) {
				return;
			}

			let ngClass = [];

			if (!this.config.menu) {
				ngClass.push('nomenu');
			}

			ngClass.push(this.asg.options.theme);

			return ngClass.join(' ');

		}

		// get action from keycodes
		private getActionByKeyCode(keyCode : number) {

			let keys = Object.keys(this.config.keycodes);
			let action;

			for (let key in keys) {

				let codes = this.config.keycodes[keys[key]];

				if (!codes) {
					continue;
				}

				let index = codes.indexOf(keyCode);

				if (index > -1) {
					action = keys[key];
					break;
				}

			}

			return action;

		}


		public close() {

			this.asg.modalClose();
			this.fullscreen.cancel();

		}

		// do keyboard action
		public keyUp(e : KeyboardEvent) {

			let action : string = this.getActionByKeyCode(e.keyCode);

			switch (action) {

				case 'exit':
					this.close();
					break;

				case 'playpause':
					this.asg.autoPlayToggle();
					break;

				case 'forward':
					this.asg.toForward(true);
					break;

				case 'backward':
					this.asg.toBackward(true);
					break;

				case 'first':
					this.asg.toFirst(true);
					break;

				case 'last':
					this.asg.toLast(true);
					break;

				case 'fullscreen':
					this.toggleFullScreen();
					break;

				case 'menu':
					this.toggleMenu();
					break;

				case 'caption':
					this.toggleCaption();
					break;

				case 'help':
					this.toggleHelp();
					break;

				case 'size':
					this.toggleSize();
					break;

				case 'transition':
					this.nextTransition();
					break;

				default:
					console.warn('unknown keyboard action');
					break;

			}

		}


		// switch to next transition effect
		private nextTransition() {

			let idx = this.asg.transitions.indexOf(this.config.transition) + 1;
			let next = idx >= this.asg.transitions.length ? 0 : idx;
			this.config.transition = this.asg.transitions[next];

		}


		// toggle fullscreen
		private toggleFullScreen() {

			if (this.fullscreen.isEnabled()) {
				this.fullscreen.cancel();
			} else {
				this.fullscreen.all();
			}

			this.asg.setFocus();

		}

		// set transition effect
		public setTransition(transition) {

			this.config.transition = transition;
			this.asg.setFocus();

		}

		// set theme
		public setTheme(theme : string) {

			this.asg.options.theme = theme;
			this.asg.setFocus();

		}

		// overlay arrows hide
		public arrowsHide() {

			this.arrowsVisible = false;

		}

		// overlay arrows show
		public arrowsShow() {

			this.arrowsVisible = true;

		}

		// toggle help
		private toggleHelp() {

			this.config.help = !this.config.help;
			this.asg.setFocus();

		}

		// toggle size
		private toggleSize() {

			let index = this.asg.sizes.indexOf(this.config.size);
			index = (index + 1) >= this.asg.sizes.length ? 0 : ++index;
			this.config.size = this.asg.sizes[index];
			this.asg.log('toggle image size:', [this.config.size, index]);

		}

		// toggle menu
		private toggleMenu() {

			this.config.menu = !this.config.menu;

		}

		// toggle caption
		private toggleCaption() {

			this.config.caption = !this.config.caption;

		}

		// get modal visible
		public get visible() {

			if (!this.asg) {
				return;
			}

			return this.asg.modalVisible;

		}

		// set modal visible
		public set visible(value : boolean) {

			if (!this.asg) {
				return;
			}

			this.asg.modalVisible = value;
			console.log('modal set visible', this.asg, this);
			this.asg.setHash();

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

		// get modal config
		public get config() : IOptionsModal {

			return this.asg.options[this.type];

		}

		// set modal config
		public set config(value : IOptionsModal) {

			this.asg.options[this.type] = value;

		}

	}


	let app : ng.IModule = angular.module('angularSuperGallery');

	app.component('asgModal', {
		controller: ['asgService', 'Fullscreen', '$scope', ASG.ModalController],
		templateUrl: 'views/asg-modal.html',
		bindings: {
			id: '@?',
			items: '=?',
			options: '=?',
			selected: '=?',
			visible: '=?'
		}
	});

}
