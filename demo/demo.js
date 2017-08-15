var demo = angular.module('demo', ['angularSuperGallery']);

demo.controller('DemoController', function () {

	this.options1 = {
		baseUrl: "https://",
		fields: {
			source: {
				modal: "link",
				image: "medium",
				panel: "thumbnail"
			}
		},
		theme: 'darkblue',
		modal: {
			wide: true,
			caption: false,
			title: "Angular Super Gallery Demo",
			subtitle: "Nature Wallpapers Full HD",
			keycodes: {
				exit: [27, 81],
				playpause: [80, 75],
				forward: [32, 39, 76],
				backward: [37, 74],
				fullscreen: null
			}
		},
		panel: {
			item: {
				class: "thumbnail-custom",
				title: false,
				index: true
			},
		},
		image: {
			height: 210,
			wide: true,
			transition: 'rotateLR',
		},
	};

	this.files1 = [{
		"link": "wallpaperscraft.com/image/beach_tropics_sea_sand_summer_84726_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/beach_tropics_sea_sand_summer_84726_300x168.jpg",
		"medium": "i1.wallpaperscraft.com/image/beach_tropics_sea_sand_summer_84726_602x339.jpg",
	}, {
		"link": "wallpaperscraft.com/image/mountains_grass_trees_day_summer_93030_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/mountains_grass_trees_day_summer_93030_300x168.jpg",
		"medium": "i1.wallpaperscraft.com/image/mountains_grass_trees_day_summer_93030_602x339.jpg",
	}, {
		"link": "wallpaperscraft.com/image/dawn_grass_sky_summer_light_87653_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/dawn_grass_sky_summer_light_87653_300x168.jpg",
		"medium": "i1.wallpaperscraft.com/image/dawn_grass_sky_summer_light_87653_602x339.jpg",
	}, {
		"link": "wallpaperscraft.com/image/beach_sand_palm_trees_tropical_90404_1920x1200.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/beach_sand_palm_trees_tropical_90404_300x168.jpg",
		"medium": "i1.wallpaperscraft.com/image/beach_sand_palm_trees_tropical_90404_602x339.jpg",
	}, {
		"link": "wallpaperscraft.com/image/stones_tropical_ocean_sky_summer_92472_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/stones_tropical_ocean_sky_summer_92472_300x168.jpg",
		"medium": "i1.wallpaperscraft.com/image/stones_tropical_ocean_sky_summer_92472_602x339.jpg",
	}, {
		"link": "wallpaperscraft.com/image/mountains_nature_river_grass_beautiful_landscape_93282_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/mountains_nature_river_grass_beautiful_landscape_93282_300x168.jpg",
		"medium": "i1.wallpaperscraft.com/image/mountains_nature_river_grass_beautiful_landscape_93282_602x339.jpg",
	}, {
		"link": "wallpaperscraft.com/image/tree_sun_blue_lilac_krone_spring_flowering_from_below_light_53319_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/tree_sun_blue_lilac_krone_spring_flowering_from_below_light_53319_300x168.jpg",
		"medium": "i1.wallpaperscraft.com/image/tree_sun_blue_lilac_krone_spring_flowering_from_below_light_53319_602x339.jpg",
	}, {
		"link": "wallpaperscraft.com/image/lake_sunset_trees_landscape_beach_art_night_reflection_48159_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/lake_sunset_trees_landscape_beach_art_night_reflection_48159_300x168.jpg",
		"medium": "i1.wallpaperscraft.com/image/lake_sunset_trees_landscape_beach_art_night_reflection_48159_602x339.jpg",
	}];


	this.options2 = {
		debug: true,
		preloadDelay: 1200,
		autoplay: {
			enabled: true,
			delay: 3800
		},
		theme: 'whitegold',
		modal: {
			menu: false,
			transition: 'zoomInOut',
			wide: true,
		},
		panel: {
			item: {
				class: "col-md-4 thumbnail",
				caption: true
			},
		},
		image: {
			transition: 'fadeInOut'
		}
	};

	this.files2 = [{
		"source": {
			"modal": "https://wallpaperscraft.com/image/miranda_kerr_smile_celebrity_brunette_24761_1920x1080.jpg",
			"panel": "https://i2.wallpaperscraft.com/image/miranda_kerr_smile_celebrity_brunette_24761_300x168.jpg",
			"image": "https://i2.wallpaperscraft.com/image/miranda_kerr_smile_celebrity_brunette_24761_602x339.jpg",
		},
		"title": "Miranda Kerr",
		"description": "Miranda May Kerr (born 20 April 1983) is an Australian model."
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/emma_stone_face_red_hair_person_look_69999_1920x1080.jpg",
			"panel": "https://i2.wallpaperscraft.com/image/emma_stone_face_red_hair_person_look_69999_300x168.jpg",
			"image": "https://i2.wallpaperscraft.com/image/emma_stone_face_red_hair_person_look_69999_602x339.jpg",
		},
		"title": "Emma Stone"
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/amanda_seyfried_blonde_dress_28910_1920x1080.jpg",
			"panel": "https://i2.wallpaperscraft.com/image/amanda_seyfried_blonde_dress_28910_300x168.jpg",
			"image": "https://i2.wallpaperscraft.com/image/amanda_seyfried_blonde_dress_28910_602x339.jpg",
		},
		"title": "Amanda Seyfried"
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/alizee_singer_face_hairstyle_sweet_750_1920x1080.jpg",
			"panel": "https://i2.wallpaperscraft.com/image/alizee_singer_face_hairstyle_sweet_750_300x168.jpg",
			"image": "https://i2.wallpaperscraft.com/image/alizee_singer_face_hairstyle_sweet_750_602x339.jpg",
		},
		"title": "Alizee"
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/selena_gomez_girl_smile_hat_hair_13141_1920x1080.jpg",
			"panel": "https://i2.wallpaperscraft.com/image/selena_gomez_girl_smile_hat_hair_13141_300x168.jpg",
			"image": "https://i2.wallpaperscraft.com/image/selena_gomez_girl_smile_hat_hair_13141_602x339.jpg",
		},
		"title": "Selena Gomez"
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/margot_robbie_actress_celebrity_sweater_103421_1920x1080.jpg",
			"panel": "https://i2.wallpaperscraft.com/image/margot_robbie_actress_celebrity_sweater_103421_300x168.jpg",
			"image": "https://i2.wallpaperscraft.com/image/margot_robbie_actress_celebrity_sweater_103421_602x339.jpg",
		},
		"title": "Margot Robbie"
	}];

});
