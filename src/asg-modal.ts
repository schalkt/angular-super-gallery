namespace angularSuperGallery {

	export class ModalController {

		public id : string;
		public options : IOptions;
		public items : Array<IFile>;
		public baseUrl : string;

		private type = 'modal';
		private asg : IServiceController;
		private arrowsVisible = false;

		constructor(private service : IServiceController,
					private $window : ng.IWindowService,
					private $rootScope : ng.IRootScopeService,
					private $scope : ng.IScope) {

		}


		public $onInit() {

			// get service instance
			this.asg = this.service.getInstance(this);
			this.asg.modalAvailable = true;

			// scope apply when image loaded
			this.$rootScope.$on(this.asg.events.LOAD_IMAGE + this.id, (event, data) => {
				this.$scope.$apply();
			});

		}


		private getClass() {

			if (!this.config) {
				return;
			}

			let ngClass = [];

			if (this.config.header.dynamic) {
				ngClass.push('dynamic');
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


		public close($event? : UIEvent) {

			this.asg.modalClick($event);
			this.asg.modalClose();
			this.exitFullScreen();

		}

		public imageClick($event? : UIEvent) {

			this.asg.modalClick($event);

			if (this.config.click.close) {
				this.asg.modalClose();
				this.exitFullScreen();
			}

		}

		public hover(index : number, $event? : MouseEvent) {

			if (this.config.arrows.preload === true) {
				this.asg.hoverPreload(index);
			}

		}

		public setFocus($event? : UIEvent) {

			this.asg.modalClick($event);

		}

		public autoPlayToggle($event? : UIEvent) {

			this.asg.modalClick($event);
			this.asg.autoPlayToggle();

		}

		public toFirst(stop? : boolean, $event? : UIEvent) {

			this.asg.modalClick($event);
			this.asg.toFirst();

		}

		public toBackward(stop? : boolean, $event? : UIEvent) {

			this.asg.modalClick($event);
			this.asg.toBackward(stop);

		}

		public toForward(stop? : boolean, $event? : UIEvent) {

			this.asg.modalClick($event);
			this.asg.toForward(stop);

		}

		public toLast(stop? : boolean, $event? : UIEvent) {

			this.asg.modalClick($event);
			this.asg.toLast(stop);

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
					this.asg.log('unknown keyboard action: ' + e.keyCode);
					break;

			}

		}


		// switch to next transition effect
		private nextTransition($event? : UIEvent) {

			this.asg.modalClick($event);
			let idx = this.asg.transitions.indexOf(this.config.transition) + 1;
			let next = idx >= this.asg.transitions.length ? 0 : idx;
			this.config.transition = this.asg.transitions[next];

		}

		// toggle fullscreen
		private toggleFullScreen($event? : UIEvent) {

			this.asg.modalClick($event);

			if (!this.$window.screenfull) {
				return;
			}

			this.$window.screenfull.toggle();

		}

		// exit fullscreen
		private exitFullScreen() {

			if (!this.$window.screenfull) {
				return;
			}

			if (!this.$window.screenfull.isFullscreen) {
				return;
			}

			this.$window.screenfull.exit();

		}

		// toggle thumbnails
		private toggleThumbnails($event? : UIEvent) {

			this.asg.modalClick($event);
			this.config.thumbnail.dynamic = !this.config.thumbnail.dynamic;

		}

		// set transition effect
		public setTransition(transition, $event? : UIEvent) {

			this.asg.modalClick($event);
			this.config.transition = transition;

		}

		// set theme
		public setTheme(theme : string, $event? : UIEvent) {

			this.asg.modalClick($event);
			this.asg.options.theme = theme;

		}

		// toggle help
		private toggleHelp($event? : UIEvent) {

			this.asg.modalClick($event);
			this.config.help = !this.config.help;

		}

		// toggle size
		private toggleSize($event? : UIEvent) {

			this.asg.modalClick($event);
			let index = this.asg.sizes.indexOf(this.config.size);
			index = (index + 1) >= this.asg.sizes.length ? 0 : ++index;
			this.config.size = this.asg.sizes[index];
			this.asg.log('toggle image size:', [this.config.size, index]);

		}

		// toggle menu
		private toggleMenu($event? : UIEvent) {

			this.asg.modalClick($event);
			this.config.header.dynamic = !this.config.header.dynamic;

		}

		// toggle caption
		private toggleCaption() {

			this.config.caption.visible = !this.config.caption.visible;

		}

		// get margint top
		public get marginTop() {

			return this.config.marginTop;

		}

		// get margin bottom
		public get marginBottom() {

			return this.config.marginBottom;

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
		controller: ['asgService', '$window', '$rootScope', '$scope', angularSuperGallery.ModalController],
		templateUrl: '/views/asg-modal.html',
		transclude: true,
		bindings: {
			id: '@?',
			items: '=?',
			options: '=?',
			selected: '=?',
			visible: '=?',
			baseUrl: '@?'
		}
	});

}
