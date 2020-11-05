var demo = angular.module('demo', ['angularSuperGallery']);

demo.controller('DemoController', ['$rootScope', function ($rootScope) {

	this.gallery = {
		nature: true,
		abstracts: true,
		portraits: true,
		logos: true,
	};

	this.options1 = {
		debug: true,
		baseUrl: "https://images.unsplash.com/",
		selected: 0,
		fields: {
			source: {
				modal: "link",
				image: "medium",
				panel: "thumbnail"
			}
		},
		loadingImage: 'preload.svg',
		preloadNext: true,
		preloadDelay: 420,
		autoplay: {
			enabled: false,
			delay: 3200
		},
		theme: 'darkblue',
		thumbnail: {
			height: 64,
			index: true,
		},

		container: {
			caption: {
				visible: true,
				position: 'bottom'
			},
			header: {
				enabled: true,
				dynamic: false
			},
			transition: 'rotateLR',
			title: "AngularJS Super Gallery Demo",
			subtitle: "Nature Wallpapers Full HD",
			thumbnail: {
				height: 77,
				index: true,
			},
		},

		modal: {
			caption: {
				visible: true,
				position: 'bottom'
			},
			header: {
				enabled: true,
				dynamic: false
			},
			transition: 'rotateLR',
			title: "AngularJS Super Gallery Demo",
			subtitle: "Nature Wallpapers Full HD",
			thumbnail: {
				height: 77,
				index: true,
			},
		},
		panel: {
			click: {
				select: false,
				modal: true
			},
			hover: {
				select: true
			},
			items: {
				class: "",
			},
			item: {
				class: "custom",
				title: false
			}
		},
		image: {
			height: 580,
			click: {
				modal: true
			},
			transition: 'zlideLR',
			placeholder: 'panel'
		},
	};

	var imagesBackGroundColor = 'black';

	this.files1 = [{
		"source": {
			"modal": "photo-1462480803487-a2edfd796460?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1462480803487-a2edfd796460?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1462480803487-a2edfd796460?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
		},
		"title": "Marmolada, Italy",
		"description": "Marco Bonomo",
		'color': imagesBackGroundColor,
		'video': {
			'vimeoId': '173523597'
		}
	}, {
		"source": {
			"modal": "photo-1577951930508-9b26cce01b4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1577951930508-9b26cce01b4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1577951930508-9b26cce01b4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
		},
		"title": "ALEKSEY KUPRIKOV",
		"description": "",
		'color': imagesBackGroundColor,
		'video': {
			'vimeoId': '137468479'
		}
	}, {
		"source": {
			"modal": "photo-1577578306649-09e937512e28?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1577578306649-09e937512e28?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1577578306649-09e937512e28?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
		},
		"title": "Tindfjöll, Iceland",
		"description": "Gissur Steinarsson",
		'color': imagesBackGroundColor
	}, {
		"source": {
			"modal": "photo-1577688723008-7c501eae6f26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1577688723008-7c501eae6f26?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1577688723008-7c501eae6f26?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
		},
		"title": "Ky Quan San (Bạch Mộc Lương Tử), Bát Xát, Lào Cai, Việt Nam",
		"description": "Dương Trần Quốc",
		'color': imagesBackGroundColor
	}, {
		"source": {
			"modal": "photo-1577833780113-9ce85d64d49d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1577833780113-9ce85d64d49d?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1577833780113-9ce85d64d49d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
		},
		"title": "Arhavi, Artvin, Turkey",
		"description": "Emre Öztürk",
		'color': imagesBackGroundColor
	},

	{
		"source": {
			"modal": "photo-1555985202-12975b0235dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1555985202-12975b0235dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1555985202-12975b0235dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
		},
		"title": "Grand Canyon North Rim",
		"description": "Stephen Walker",
		'color': imagesBackGroundColor
	},
	{
		"source": {
			"modal": "photo-1483977399921-6cf94f6fdc3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1483977399921-6cf94f6fdc3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1483977399921-6cf94f6fdc3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
		},
		"title": "Paris, France",
		"description": "Nicolas Prieto",
		'color': imagesBackGroundColor
	},

	{
		"source": {
			"modal": "photo-1434394354979-a235cd36269d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1434394354979-a235cd36269d?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1434394354979-a235cd36269d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
		},
		"title": "Ales Krivec",
		"description": "",
		'color': imagesBackGroundColor
	},


	{
		"source": {
			"modal": "photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
		},
		"title": "Kluane National Park and Reserve of Canada, Canada",
		"description": "Kalen Emsley",
		'color': imagesBackGroundColor
	},

	{
		"source": {
			"modal": "photo-1466927593098-4d4aa7a2b2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1466927593098-4d4aa7a2b2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1466927593098-4d4aa7a2b2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
		},
		"title": "Playa de la Misericordia, Spain",
		"description": "Quino Al",
		'color': imagesBackGroundColor
	},
	{
		"source": {
			"modal": "photo-1542810104-c5f07c7357ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1542810104-c5f07c7357ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1542810104-c5f07c7357ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
		},
		"title": "Francesco Ungaro",
		"description": "",
		'color': imagesBackGroundColor
	},
	{
		"source": {
			"modal": "photo-1572152269271-c652a70dd517?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1572152269271-c652a70dd517?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1572152269271-c652a70dd517?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
		},
		"title": "Heping Island Park, Keelung City, Taiwan",
		"description": "Andy Wang",
		'color': imagesBackGroundColor
	},



	{
		"source": {
			"modal": "photo-1512089425728-b012186ab3cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1512089425728-b012186ab3cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1512089425728-b012186ab3cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
		},
		"title": "Sun rays a game only on 3-6 minutes…",
		"description": "Valeriy Andrushko",
		'color': imagesBackGroundColor
	},

	];

	this.add1 = function () {
		$rootScope.$broadcast('ASG-gallery-edit', {
			id: 'nature',
			selected: -1,
			add: [{
				"source": {
					"modal": "photo-1527437934671-61474b530017?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
					"image": "photo-1527437934671-61474b530017?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
					"panel": "photo-1527437934671-61474b530017?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
				},
				"title": "Seychelles",
				"description": "Nenad Radojčić",
				'color': imagesBackGroundColor
			}]
		});
	};

	this.update1options = function () {
		$rootScope.$broadcast('ASG-gallery-edit', {
			id: 'nature',
			options: this.options1
		});
	};

	this.update1selected = function () {
		$rootScope.$broadcast('ASG-gallery-edit', {
			id: 'nature',
			selected: this.options1.selected
		});
	};

	this.update1 = function () {

		var newGalleryImages = [{
			"source": {
				"modal": "photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
				"image": "photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
				"panel": "photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
			},
			"title": "North Shore, Waialua, United States",
			"description": "Sean O.",
			'color': imagesBackGroundColor
		}, {
			"source": {
				"modal": "photo-1560294572-28b9874e5ada?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
				"image": "photo-1560294572-28b9874e5ada?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
				"panel": "photo-1560294572-28b9874e5ada?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=75",
			},
			"title": "Beach, Fuerteventura, Spain",
			"description": "Uwe Jelting",
			'color': imagesBackGroundColor
		}];

		this.options1.selected = 1;

		$rootScope.$broadcast('ASG-gallery-edit', {
			id: 'nature',
			update: newGalleryImages
		});

	};

	this.delete1 = function () {
		$rootScope.$broadcast('ASG-gallery-edit', {
			id: 'nature',
			delete: null // index number or null for delete selected image
		});
	};

	this.reset1 = function () {

		this.options1 = angular.copy(this.options1Backup);
		this.files1 = angular.copy(this.files1Backup);

		$rootScope.$broadcast('ASG-gallery-edit', {
			id: 'nature',
			selected: 0,
			update: this.files1,
			options: this.options1
		});
	};

	this.options1Backup = angular.copy(this.options1);
	this.files1Backup = angular.copy(this.files1);

	//-----------------------------

	this.options2 = {
		debug: false,
		loadingImage: 'preload.svg',
		preloadNext: true,
		preloadDelay: 1200,
		baseUrl: "https://images.unsplash.com/",
		hashUrl: false,
		autoplay: {
			enabled: true,
			delay: 4200
		},
		theme: 'darkred',
		modal: {
			title: '',
			transition: 'fadeInOut',
			transitionSpeed: 1,
			titleFromImage: true,
			subtitleFromImage: true,
			caption: {
				visible: false,
				position: 'bottom'
			},
			thumbnail: {
				height: 90,
				index: false,
				dynamic: true
			},
		},
		panel: {
			visible: false,
			item: {
				class: "col-md-4 float-left",
				caption: true,
				index: true
			},
			click: {
				select: true,
				modal: false
			},
		},
		image: {
			heightAuto: {
				initial: true,
				onresize: true,
			},
			transition: 'zoomInOut',
			transitionSpeed: 0.9,
			placeholder: 'panel'
		},
	};


	this.files2 = [{
		"source": {
			"modal": "photo-1541701494587-cb58502866ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1541701494587-cb58502866ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1541701494587-cb58502866ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=70",
		},
		"title": "Lucas Benjamin",
		"description": ""
	}, {
		"source": {
			"modal": "photo-1516670428252-df97bba108d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1516670428252-df97bba108d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1516670428252-df97bba108d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=70",
		},
		"title": "Fairhaven, Bellingham, United States",
		"description": "Adrien Converse"
	}, {
		"source": {
			"modal": "photo-1519017524945-ed31bb7a3786?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1519017524945-ed31bb7a3786?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1519017524945-ed31bb7a3786?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=70",
		},
		"title": "Red Vein",
		"description": "Lucas Benjamin"

	}, {
		"source": {
			"modal": "photo-1565638459249-c85cbb2faaa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1565638459249-c85cbb2faaa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1565638459249-c85cbb2faaa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=70",
		},
		"title": "Paweł Czerwiński",
		"description": ""

	}, {
		"source": {
			"modal": "photo-1470485661945-c52d58c91f51?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1470485661945-c52d58c91f51?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1470485661945-c52d58c91f51?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=70",
		},
		"title": "The Titanic Memorial Garden, Belfast, United Kingdom",
		"description": "Yaniv Knobel"

	}, {
		"source": {
			"modal": "photo-1552084162-ec07b3f162dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1552084162-ec07b3f162dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1552084162-ec07b3f162dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=70",
		},
		"title": "Paweł Czerwiński",
		"description": ""

	}, {
		"source": {
			"modal": "photo-1484626753559-5fa3ea273ae8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=90",
			"image": "photo-1484626753559-5fa3ea273ae8?ixlib=rb-1.2.1&auto=format&fit=crop&w=960&q=85",
			"panel": "photo-1484626753559-5fa3ea273ae8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=70",
		},
		"title": "Petersen Automotive Museum, Los Angeles, United States",
		"description": "Denys Nevozhai"

	}

	];

}]);
