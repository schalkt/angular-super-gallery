module ASG {

	export class ModalController {

		public id : string;
		private asg : IServiceController;

		private _fullscreen : boolean = false;
		private _visible : boolean = false;
		private arrowsVisible : boolean = false;

		constructor(private service : IServiceController,
					private fullscreen) {

		}


		public $onInit() {

			// get service instance by id
			this.asg = this.service.getInstance(this.id);

		}


		private getClass() {

			var ngClass = [];

			if (!this.options.menu) {
				ngClass.push('nomenu');
			}

			ngClass.push(this.asg.options.theme);

			return ngClass.join(' ');

		}


		// keymap
		public keyUp(e : KeyboardEvent) {

			// esc
			if (e.keyCode == 27) {
				this.asg.modalClose();
			}

			// play/pause
			if (e.keyCode == 80) {
				this.asg.autoPlayToggle();
			}

			// space
			if (e.keyCode == 32) {
				this.asg.toForward(true);
			}

			// left
			if (e.keyCode == 37) {
				this.asg.toBackward(true);
			}

			// right
			if (e.keyCode == 39) {
				this.asg.toForward(true);
			}

			// up
			if (e.keyCode == 38 || e.keyCode == 36) {
				this.asg.toFirst(true);
			}

			// down
			if (e.keyCode == 40 || e.keyCode == 35) {
				this.asg.toLast(true);
			}

			// f - fullscreen
			if (e.keyCode == 70 || e.keyCode == 13) {
				this.toggleFullScreen();
			}

			// m - menu
			if (e.keyCode == 77) {
				this.toggleMenu();
			}

			// c - caption
			if (e.keyCode == 67) {
				this.toggleCaption();
			}

			// h - help
			if (e.keyCode == 72) {
				this.toggleHelp();
			}

			// w - wide sceeen (image fit to images container)
			if (e.keyCode == 87) {
				this.toggleWide();
			}

			// t - transition next
			if (e.keyCode == 84) {
				this.nextTransition();
			}

		}


		// switch to next transition effect
		private nextTransition() {

			var idx = this.asg.transitions.indexOf(this.options.transition) + 1;
			var next = idx >= this.asg.transitions.length ? 0 : idx;
			this.options.transition = this.asg.transitions[next];

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

			this.options.transition = transition;
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

			this.options.help = !this.options.help;
			this.asg.setFocus();

		}


		// toggle wide
		private toggleWide() {

			this.options.wide = !this.options.wide;

		}


		// toggle menu
		private toggleMenu() {

			this.options.menu = !this.options.menu;

		}

		// toggle caption
		private toggleCaption() {

			this.options.caption = !this.options.caption;

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

		public get options() : IOptionsModal {

			return this.asg.options.modal;

		}

		public set options(value : IOptionsModal) {

			this.asg.options.modal = value;

		}

	}


	var app : ng.IModule = angular.module('angularSuperGallery');

	app.component("asgModal", {
		controller: ["asgService", "Fullscreen", ASG.ModalController],
		templateUrl: 'views/asg-modal.html',
		bindings: {
			id: "@",
			visible: "="
		}
	});

}