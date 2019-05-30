var demo = angular.module('demo', ['angularSuperGallery']);

demo.controller('DemoController', ['$rootScope', function ($rootScope) {

	this.gallery =  {
		nature: true,
		girls: true,
		honda: true,
		logos: true,
	};

	this.options1 = {
		debug: true,
		baseUrl: "https://",
		selected: 2,
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
		theme: 'darkblue',
		thumbnail: {
			height: 42,
			index: true,
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
			title: "Angular Super Gallery Demo",
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
			item: {
				class: "custom",
				title: false
			}
		},
		image: {
			height: 320,
			click: {
				modal: true
			},
			transition: 'zlideLR',
			placeholder: 'panel'
		},
	};

	var imagesBackGroundColor = 'black';

	this.files1 = [{
			"link": "wallpaperscraft.com/image/beach_tropics_sea_sand_summer_84726_1920x1080.jpg",
			"thumbnail": "images.wallpaperscraft.com/image/beach_tropics_sea_sand_summer_84726_300x168.jpg",
			"medium": "images.wallpaperscraft.com/image/beach_tropics_sea_sand_summer_84726_960x544.jpg",
			'color': imagesBackGroundColor
		}, {
			"link": "wallpaperscraft.com/image/mountains_grass_trees_day_summer_93030_1920x1080.jpg",
			"thumbnail": "images.wallpaperscraft.com/image/mountains_grass_trees_day_summer_93030_300x168.jpg",
			"medium": "images.wallpaperscraft.com/image/mountains_grass_trees_day_summer_93030_960x544.jpg",
			'color': imagesBackGroundColor
		}, {
			"link": "wallpaperscraft.com/image/dawn_grass_sky_summer_light_87653_1920x1080.jpg",
			"thumbnail": "images.wallpaperscraft.com/image/dawn_grass_sky_summer_light_87653_300x168.jpg",
			"medium": "images.wallpaperscraft.com/image/dawn_grass_sky_summer_light_87653_960x544.jpg",
			'color': imagesBackGroundColor
		}, {
			"link": "wallpaperscraft.com/image/beach_sand_palm_trees_tropical_90404_1920x1080.jpg",
			"thumbnail": "images.wallpaperscraft.com/image/beach_sand_palm_trees_tropical_90404_300x168.jpg",
			"medium": "images.wallpaperscraft.com/image/beach_sand_palm_trees_tropical_90404_960x544.jpg",
			'color': imagesBackGroundColor
		}, {
			"link": "wallpaperscraft.com/image/tree_field_plain_green_sky_lonely_day_summer_45608_1920x1080.jpg",
			"thumbnail": "images.wallpaperscraft.com/image/tree_field_plain_green_sky_lonely_day_summer_45608_300x168.jpg",
			"medium": "images.wallpaperscraft.com/image/tree_field_plain_green_sky_lonely_day_summer_45608_960x544.jpg",
			'color': imagesBackGroundColor
		}, {
			"link": "wallpaperscraft.com/image/mountains_nature_river_grass_beautiful_landscape_93282_1920x1080.jpg",
			"thumbnail": "images.wallpaperscraft.com/image/mountains_nature_river_grass_beautiful_landscape_93282_300x168.jpg",
			"medium": "images.wallpaperscraft.com/image/mountains_nature_river_grass_beautiful_landscape_93282_960x544.jpg",
			'color': imagesBackGroundColor
		}, {
			"link": "wallpaperscraft.com/image/tree_sun_blue_lilac_krone_spring_flowering_from_below_light_53319_1920x1080.jpg",
			"thumbnail": "images.wallpaperscraft.com/image/tree_sun_blue_lilac_krone_spring_flowering_from_below_light_53319_300x168.jpg",
			"medium": "images.wallpaperscraft.com/image/tree_sun_blue_lilac_krone_spring_flowering_from_below_light_53319_960x544.jpg",
			'color': imagesBackGroundColor
		}, {
			"link": "wallpaperscraft.com/image/lake_sunset_trees_landscape_beach_art_night_reflection_48159_1920x1080.jpg",
			"thumbnail": "images.wallpaperscraft.com/image/lake_sunset_trees_landscape_beach_art_night_reflection_48159_300x168.jpg",
			"medium": "images.wallpaperscraft.com/image/lake_sunset_trees_landscape_beach_art_night_reflection_48159_960x544.jpg",
			'color': imagesBackGroundColor
		}, {
			"link": "wallpaperscraft.com/image/mount_rainier_usa_mountains_snow_trees_grass_flowers_slope_100278_1920x1080.jpg",
			"thumbnail": "images.wallpaperscraft.com/image/mount_rainier_usa_mountains_snow_trees_grass_flowers_slope_100278_300x168.jpg",
			"medium": "images.wallpaperscraft.com/image/mount_rainier_usa_mountains_snow_trees_grass_flowers_slope_100278_960x544.jpg",
			'color': imagesBackGroundColor
		},{
			"link": "wallpaperscraft.com/image/trees_park_autumn_grass_leaves_90983_1920x1080.jpg",
			"thumbnail": "images.wallpaperscraft.com/image/trees_park_autumn_grass_leaves_90983_300x168.jpg",
			"medium": "images.wallpaperscraft.com/image/trees_park_autumn_grass_leaves_90983_960x544.jpg",
			'color': imagesBackGroundColor
		}
	];

	this.add1 = function () {
		$rootScope.$broadcast('ASG-gallery-edit', {
			id: 'nature',
			add: [{
				"link": "wallpaperscraft.com/image/tree_fog_nature_beautiful_84257_1920x1080.jpg",
				"thumbnail": "images.wallpaperscraft.com/image/tree_fog_nature_beautiful_84257_300x168.jpg",
				"medium": "images.wallpaperscraft.com/image/tree_fog_nature_beautiful_84257_960x544.jpg",
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
			"title": "Road trees",
			"source" : {
				"modal": "images.wallpaperscraft.com/image/summer_nature_road_leaves_trees_90616_1920x1080.jpg",
				"panel": "images.wallpaperscraft.com/image/summer_nature_road_leaves_trees_90616_300x168.jpg",
				"image": "images.wallpaperscraft.com/image/summer_nature_road_leaves_trees_90616_960x544.jpg",
			}
		}, {
			"link": "images.wallpaperscraft.com/image/sea_wave_beautifully_90798_1920x1080.jpg",
			"thumbnail": "images.wallpaperscraft.com/image/sea_wave_beautifully_90798_300x168.jpg",
			"medium": "images.wallpaperscraft.com/image/sea_wave_beautifully_90798_960x544.jpg",
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
		preloadNext: false,
		preloadDelay: 1200,
		hashUrl: false,
		autoplay: {
			enabled: false,
			delay: 3800
		},
		theme: 'whitegold',
		modal: {
			title: '',
			transition: 'zoomInOut',
			titleFromImage: true,
			caption: {
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
				class: "col-md-4 float-left img-thumbnail",
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
			placeholder: 'panel'
		},
	};


	this.files2 = [{
		"source": {
			"modal": "https://wallpaperscraft.com/image/alizee_singer_face_hairstyle_sweet_750_1600x900.jpg",
			"panel": "https://images.wallpaperscraft.com/image/alizee_singer_face_hairstyle_sweet_750_300x168.jpg",
			"image": "https://images.wallpaperscraft.com/image/alizee_singer_face_hairstyle_sweet_750_960x544.jpg",
		},
		"title": "Alizee",
		"description": "Alizée Jacotey (born 21 August, 1984) is a French singer, dancer and voice actress.",
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/jessica_alba_girl_actress_107513_1600x900.jpg",
			"panel": "https://images.wallpaperscraft.com/image/jessica_alba_girl_actress_107513_300x168.jpg",
			"image": "https://images.wallpaperscraft.com/image/jessica_alba_girl_actress_107513_960x544.jpg",
		},
		"title": "Jessica Alba",
		"description": "Jessica Marie Alba (born April 28, 1981) is an American actress and businesswoman.",
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/miranda_kerr_smile_celebrity_brunette_24761_1600x900.jpg",
			"panel": "https://images.wallpaperscraft.com/image/miranda_kerr_smile_celebrity_brunette_24761_300x168.jpg",
			"image": "https://images.wallpaperscraft.com/image/miranda_kerr_smile_celebrity_brunette_24761_960x544.jpg",
		},
		"title": "Miranda Kerr",
		"description": "Miranda May Kerr (born 20 April, 1983) is an Australian model."
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/emma_stone_face_red_hair_person_look_69999_1600x900.jpg",
			"panel": "https://images.wallpaperscraft.com/image/emma_stone_face_red_hair_person_look_69999_300x168.jpg",
			"image": "https://images.wallpaperscraft.com/image/emma_stone_face_red_hair_person_look_69999_960x544.jpg",
		},
		"title": "Emma Stone",
		"description": "Emily Jean Stone (born 6 November, 1988) is an American actress.",
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/amanda_seyfried_blonde_dress_28910_1600x900.jpg",
			"panel": "https://images.wallpaperscraft.com/image/amanda_seyfried_blonde_dress_28910_300x168.jpg",
			"image": "https://images.wallpaperscraft.com/image/amanda_seyfried_blonde_dress_28910_960x544.jpg",
		},
		"title": "Amanda Seyfried",
		"description": "Amanda Michelle Seyfried (born 3 December, 1985) is an American actress and singer-songwriter.",
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/selena_gomez_girl_smile_hat_hair_13141_1600x900.jpg",
			"panel": "https://images.wallpaperscraft.com/image/selena_gomez_girl_smile_hat_hair_13141_300x168.jpg",
			"image": "https://images.wallpaperscraft.com/image/selena_gomez_girl_smile_hat_hair_13141_960x544.jpg",
		},
		"title": "Selena Gomez",
		"description": "Selena Marie Gomez (born 22 July, 1992) is an American singer and actress.",
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/margot_robbie_actress_celebrity_sweater_103421_1600x900.jpg",
			"panel": "https://images.wallpaperscraft.com/image/margot_robbie_actress_celebrity_sweater_103421_300x168.jpg",
			"image": "https://images.wallpaperscraft.com/image/margot_robbie_actress_celebrity_sweater_103421_960x544.jpg",
		},
		"title": "Margot Robbie",
		"description": "Margot Elise Robbie (born 2 July, 1990) is an Australian actress and producer.",
	}];

}]);
