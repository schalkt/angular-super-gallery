var demo = angular.module('demo', ['angularSuperGallery', 'FBAngular']);

demo.controller('DemoController', function ($http) {

	this.options1 = {
		baseUrl: "https://",
		fields: {
			url: "link"
		},
		theme: 'darkblue',
		preload: [0, 1],
		modal: {
			wide: true,
			caption: false,
			title: "Angular Super Gallery Demo",
			subtitle: "Nature Wallpapers Full HD",
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
			transition: 'rotateLR'
		},
	};

	this.files1 = [{
		"link": "wallpaperscraft.com/image/nature_waterfall_summer_lake_trees_90400_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/nature_waterfall_summer_lake_trees_90400_300x168.jpg",
	}, {
		"link": "wallpaperscraft.com/image/summer_mountains_nature_lake_river_grass_93164_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/summer_mountains_nature_lake_river_grass_93164_300x168.jpg",
	}, {
		"link": "wallpaperscraft.com/image/dawn_grass_sky_summer_light_87653_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/dawn_grass_sky_summer_light_87653_300x168.jpg",
	}, {
		"link": "wallpaperscraft.com/image/sea_sand_palm_trees_surf_84649_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/sea_sand_palm_trees_surf_84649_300x168.jpg",
	}, {
		"link": "wallpaperscraft.com/image/stones_tropical_ocean_sky_summer_92472_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/stones_tropical_ocean_sky_summer_92472_300x168.jpg",
	}, {
		"link": "wallpaperscraft.com/image/mountains_nature_river_grass_beautiful_landscape_93282_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/mountains_nature_river_grass_beautiful_landscape_93282_300x168.jpg",
	}, {
		"link": "wallpaperscraft.com/image/tree_sun_blue_lilac_krone_spring_flowering_from_below_light_53319_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/tree_sun_blue_lilac_krone_spring_flowering_from_below_light_53319_300x168.jpg",
	}, {
		"link": "wallpaperscraft.com/image/lake_sunset_trees_landscape_beach_art_night_reflection_48159_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/lake_sunset_trees_landscape_beach_art_night_reflection_48159_300x168.jpg",
	}];


	this.options2 = {
		autoplay: {
			enabled: true,
			delay: 3500
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
		"url": "https://wallpaperscraft.com/image/miranda_kerr_smile_celebrity_brunette_24761_1920x1080.jpg",
		"thumbnail": "https://i2.wallpaperscraft.com/image/miranda_kerr_smile_celebrity_brunette_24761_300x168.jpg",
		"title": "Miranda Kerr",
		"description": "Miranda May Kerr (born 20 April 1983) is an Australian model."
	}, {
		"url": "https://wallpaperscraft.com/image/emma_stone_face_red_hair_person_look_69999_1920x1080.jpg",
		"thumbnail": "https://i2.wallpaperscraft.com/image/emma_stone_face_red_hair_person_look_69999_300x168.jpg",
		"title": "Emma Stone"
	}, {
		"url": "https://wallpaperscraft.com/image/amanda_seyfried_blonde_dress_28910_1920x1080.jpg",
		"thumbnail": "https://i2.wallpaperscraft.com/image/amanda_seyfried_blonde_dress_28910_300x168.jpg",
		"title": "Amanda Seyfried"
	}, {
		"url": "https://wallpaperscraft.com/image/alizee_singer_face_hairstyle_sweet_750_1920x1080.jpg",
		"thumbnail": "https://i2.wallpaperscraft.com/image/alizee_singer_face_hairstyle_sweet_750_300x168.jpg",
		"title": "Alizee"
	}, {
		"url": "https://wallpaperscraft.com/image/selena_gomez_girl_smile_hat_hair_13141_1920x1080.jpg",
		"thumbnail": "https://i2.wallpaperscraft.com/image/selena_gomez_girl_smile_hat_hair_13141_300x168.jpg",
		"title": "Selena Gomez"
	}, {
		"url": "https://wallpaperscraft.com/image/margot_robbie_actress_celebrity_sweater_103421_1920x1080.jpg",
		"thumbnail": "https://i2.wallpaperscraft.com/image/margot_robbie_actress_celebrity_sweater_103421_300x168.jpg",
		"title": "Margot Robbie"
	}];

});
