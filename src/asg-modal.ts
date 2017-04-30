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

			if (!this.asg.options.modal.header) {
				ngClass.push('noheader');
			}

			ngClass.push(this.asg.options.theme);

			return ngClass.join(' ');

		}


		// keymap
		public keyUp(e) {

			// esc
			if (e.keyCode == 27) {
				this.asg.modalClose();
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

			// g - header
			if (e.keyCode == 71) {
				this.toggleHeader();
			}

			// h - help
			if (e.keyCode == 72) {
				this.toggleHelp();
			}

			// t - transition next
			if (e.keyCode == 84) {
				this.nextTransition();
			}

		}


		// switch to next transition effect
		private nextTransition() {

			var idx = this.asg.transitions.indexOf(this.asg.options.modal.transition) + 1;
			var next = idx >= this.asg.transitions.length ? 0 : idx;
			this.asg.options.modal.transition = this.asg.transitions[next];

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

			this.asg.options.modal.transition = transition;
			this.asg.setFocus();

		}

		// set theme
		public setTheme(theme) {

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

			this.asg.options.modal.help = !this.asg.options.modal.help;
			this.asg.setFocus();

		}


		// toggle header
		private toggleHeader() {

			this.asg.options.modal.header = !this.asg.options.modal.header;

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