// modal component options
export interface IOptionsModal {

	header?: {
		enabled?: boolean;
		dynamic?: boolean;
		buttons: Array<string>;
	};
	help?: boolean;
	caption?: {
		disabled?: boolean;
		visible?: boolean;
		position?: string;
	};
	transition?: string;
	title?: string;
	subtitle?: string;
	arrows?: {
		preload?: boolean;
		enabled?: boolean;
	};
	size?: string;
	thumbnail?: IOptionsThumbnail;
	marginTop?: number;
	marginBottom?: number;
	click?: {
		close: boolean;
	};
	keycodes?: {
		exit?: Array<number>;
		playpause?: Array<number>;
		forward?: Array<number>;
		backward?: Array<number>;
		first?: Array<number>;
		last?: Array<number>;
		fullscreen?: Array<number>;
		menu?: Array<number>;
		caption?: Array<number>;
		help?: Array<number>;
		size?: Array<number>;
		transition?: Array<number>;
	};
}

// panel component options
export interface IOptionsPanel {

	visible?: boolean;
	item?: {
		class?: string;
		caption: boolean;
		index: boolean;
	};
	hover?: {
		preload: boolean;
		select: boolean;
	};
	click?: {
		select: boolean;
		modal: boolean;
	};

}

// thumbnail component options
export interface IOptionsThumbnail {

	height?: number;
	index?: boolean;
	enabled?: boolean;
	dynamic?: boolean;
	autohide: boolean;
	click?: {
		select: boolean;
		modal: boolean;
	};
	hover?: {
		preload: boolean;
		select: boolean;
	};

}

// info component options
export interface IOptionsInfo {

}

// image component options
export interface IOptionsImage {

	transition?: string;
	size?: string;
	arrows?: {
		preload?: boolean;
		enabled?: boolean;
	};
	click?: {
		modal: boolean;
	};
	height?: number;
	heightMin?: number;
	heightAuto?: {
		initial?: boolean;
		onresize?: boolean;
	};

}

// gallery options
export interface IOptions {

	debug?: boolean;
	baseUrl?: string;
	hashUrl?: boolean;
	fields?: {
		source?: {
			modal?: string;
			panel?: string;
			image?: string;
			placeholder?: string;
		}
		title?: string;
		description?: string;
		thumbnail?: string;
	};
	autoplay?: {
		enabled?: boolean;
		delay?: number;
	};
	theme?: string;
	preload?: Array<number>;
	preloadNext?: boolean;
	preloadDelay?: number;
	loadingImage?: string;
	modal?: IOptionsModal;
	panel?: IOptionsPanel;
	image?: IOptionsImage;
	thumbnail?: IOptionsThumbnail;

}

// image source
export interface ISource {

	modal: string; // original, required
	panel?: string;
	image?: string;
	color?: string;
	placeholder?: string;

}

// image file
export interface IFile {

	source: ISource;
	title?: string;
	name?: string;
	extension?: string;
	description?: string;
	download?: string;
	loaded?: {
		modal?: boolean;
		panel?: boolean;
		image?: boolean;
	};
	width?: number;
	height?: number;

}

export interface IOver {
	modalImage: boolean;
	panel: boolean;
}

export interface IEdit {
	delete: number;
	add: Array<IFile>;
	update: Array<IFile>;
	refresh: boolean;
	options: IOptions;
	delayThumbnails: number;
	delayRefresh: number;
}

// service controller interface
export interface IServiceController {

	modalVisible: boolean;
	panelVisible: boolean;
	modalAvailable: boolean;
	modalInitialized: boolean;
	transitions: Array<string>;
	themes: Array<string>;
	classes: string;
	options: IOptions;
	items: Array<IFile>;
	selected: number;
	file: IFile;
	sizes: Array<string>;
	id: string;
	isSingle: boolean;
	events: {
		CONFIG_LOAD: string;
		AUTOPLAY_START: string;
		AUTOPLAY_STOP: string;
		PARSE_IMAGES: string;
		LOAD_IMAGE: string;
		FIRST_IMAGE: string;
		CHANGE_IMAGE: string;
		MODAL_OPEN: string;
		MODAL_CLOSE: string;
		GALLERY_UPDATED: string;
		GALLERY_EDIT: string;
	};

	getInstance(component: any): IServiceController;

	setDefaults(): void;

	setOptions(options: IOptions): IOptions;

	setItems(items: Array<IFile>, force?: boolean): void;

	preload(wait?: number): void;

	normalize(index: number): number;

	setFocus(): void;

	setSelected(index: number);

	modalOpen(index: number): void;

	modalClose(): void;

	modalClick($event?: UIEvent): void;

	thumbnailsMove(delay?: number): void;

	toBackward(stop?: boolean): void;

	toForward(stop?: boolean): void;

	toFirst(stop?: boolean): void;

	toLast(stop?: boolean): void;

	loadImage(index?: number): void;

	loadImages(indexes: Array<number>): void;

	hoverPreload(index: number): void;

	autoPlayToggle(): void;

	toggle(element: string): void;

	setHash(): void;

	downloadLink(): string;

	el(selector): NodeList;

	log(event: string, data?: any): void;


}
