module ASG {

	export class ModalController {

		private type : string = 'modal';

		public id : string;
		public options : IOptions;
		public items : Array<IFile>;
		public selected : number;

		private asg : IServiceController;

		private _fullscreen : boolean = false;
		private _visible : boolean = false;
		private arrowsVisible : boolean = false;

		constructor(private service : IServiceController,
					private fullscreen) {

		}


		public $onInit() {

			// get service instance
			this.asg = this.service.getInstance(this);

		}


		private getClass() {

			if (!this.config) {
				return;
			}

			var ngClass = [];

			if (!this.config.menu) {
				ngClass.push('nomenu');
			}

			ngClass.push(this.asg.options.theme);

			return ngClass.join(' ');

		}

		// get action from keycodes
		private getActionByKeyCode(keyCode : number) {

			var keys = Object.keys(this.config.keycodes);
			var action;

			for (var key in keys) {

				var codes = this.config.keycodes[keys[key]];

				if (!codes) {
					continue;
				}

				var index = codes.indexOf(keyCode);

				if (index > -1) {
					action = keys[key];
					break;
				}

			}

			return action;

		}


		// do keyboard action
		public keyUp(e : KeyboardEvent) {

			var action : string = this.getActionByKeyCode(e.keyCode);

			switch (action) {

				case 'exit':
					this.asg.modalClose();
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

				case 'wide':
					this.toggleWide();
					break;

				case 'transition':
					this.nextTransition();
					break;

			}

		}


		// switch to next transition effect
		private nextTransition() {

			var idx = this.asg.transitions.indexOf(this.config.transition) + 1;
			var next = idx >= this.asg.transitions.length ? 0 : idx;
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


		// toggle wide
		private toggleWide() {

			this.config.wide = !this.config.wide;

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


	var app : ng.IModule = angular.module('angularSuperGallery');

	app.component("asgModal", {
		controller: ["asgService", "Fullscreen", ASG.ModalController],
		templateUrl: 'views/asg-modal.html',
		bindings: {
			id: "@",
			items: '=?',
			options: '=?',
			selected: '=?',
			visible: "=?"
		}
	});

}