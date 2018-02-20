var demo = angular.module('demo', ['angularSuperGallery']);

demo.controller('DemoController', function () {

	this.options1 = {
		debug: false,
		baseUrl: "https://",
		fields: {
			source: {
				modal: "link",
				image: "medium",
				panel: "thumbnail"
			}
		},
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
			},
		},
		image: {
			height: 320,
			click: {
				modal: true
			},
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
		"link": "wallpaperscraft.com/image/tree_field_plain_green_sky_lonely_day_summer_45608_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/tree_field_plain_green_sky_lonely_day_summer_45608_300x168.jpg",
		"medium": "i1.wallpaperscraft.com/image/tree_field_plain_green_sky_lonely_day_summer_45608_602x339.jpg",
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
	}, {
		"link": "wallpaperscraft.com/image/mount_rainier_usa_mountains_snow_trees_grass_flowers_slope_100278_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/mount_rainier_usa_mountains_snow_trees_grass_flowers_slope_100278_300x168.jpg",
		"medium": "i1.wallpaperscraft.com/image/mount_rainier_usa_mountains_snow_trees_grass_flowers_slope_100278_602x339.jpg",
	}, {
		"link": "wallpaperscraft.com/image/trees_park_autumn_grass_leaves_90983_1920x1080.jpg",
		"thumbnail": "i1.wallpaperscraft.com/image/trees_park_autumn_grass_leaves_90983_300x168.jpg",
		"medium": "i1.wallpaperscraft.com/image/trees_park_autumn_grass_leaves_90983_602x339.jpg",
	}];

	this.options2 = {
		debug: false,
		preloadDelay: 1200,
		hashUrl: false,
		autoplay: {
			enabled: true,
			delay: 3800
		},
		theme: 'whitegold',
		modal: {
			transition: 'zoomInOut',
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
				class: "col-md-4 thumbnail",
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
			transition: 'zoomInOut'
		}
	};


	this.files2 = [{
		"source": {
			"modal": "https://wallpaperscraft.com/image/jessica_alba_girl_actress_107513_1920x1080.jpg",
			"panel": "https://i2.wallpaperscraft.com/image/jessica_alba_girl_actress_107513_300x168.jpg",
			"image": "https://i2.wallpaperscraft.com/image/jessica_alba_girl_actress_107513_602x339.jpg",
		},
		"title": "Jessica Alba",
		"description": "Jessica Marie Alba (born April 28, 1981) is an American actress and businesswoman.",
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/miranda_kerr_smile_celebrity_brunette_24761_1920x1080.jpg",
			"panel": "https://i2.wallpaperscraft.com/image/miranda_kerr_smile_celebrity_brunette_24761_300x168.jpg",
			"image": "https://i2.wallpaperscraft.com/image/miranda_kerr_smile_celebrity_brunette_24761_602x339.jpg",
		},
		"title": "Miranda Kerr",
		"description": "Miranda May Kerr (born 20 April, 1983) is an Australian model."
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/emma_stone_face_red_hair_person_look_69999_1920x1080.jpg",
			"panel": "https://i2.wallpaperscraft.com/image/emma_stone_face_red_hair_person_look_69999_300x168.jpg",
			"image": "https://i2.wallpaperscraft.com/image/emma_stone_face_red_hair_person_look_69999_602x339.jpg",
		},
		"title": "Emma Stone",
		"description": "Emily Jean Stone (born 6 November, 1988) is an American actress.",
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/amanda_seyfried_blonde_dress_28910_1920x1080.jpg",
			"panel": "https://i2.wallpaperscraft.com/image/amanda_seyfried_blonde_dress_28910_300x168.jpg",
			"image": "https://i2.wallpaperscraft.com/image/amanda_seyfried_blonde_dress_28910_602x339.jpg",
		},
		"title": "Amanda Seyfried",
		"description": "Amanda Michelle Seyfried (born 3 December, 1985) is an American actress and singer-songwriter.",
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/alizee_singer_face_hairstyle_sweet_750_1920x1080.jpg",
			"panel": "https://i2.wallpaperscraft.com/image/alizee_singer_face_hairstyle_sweet_750_300x168.jpg",
			"image": "https://i2.wallpaperscraft.com/image/alizee_singer_face_hairstyle_sweet_750_602x339.jpg",
		},
		"title": "Alizee",
		"description": "Alizée Jacotey (born 21 August, 1984) is a French singer, dancer and voice actress.",
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/selena_gomez_girl_smile_hat_hair_13141_1920x1080.jpg",
			"panel": "https://i2.wallpaperscraft.com/image/selena_gomez_girl_smile_hat_hair_13141_300x168.jpg",
			"image": "https://i2.wallpaperscraft.com/image/selena_gomez_girl_smile_hat_hair_13141_602x339.jpg",
		},
		"title": "Selena Gomez",
		"description": "Selena Marie Gomez (born 22 July, 1992) is an American singer and actress.",
	}, {
		"source": {
			"modal": "https://wallpaperscraft.com/image/margot_robbie_actress_celebrity_sweater_103421_1920x1080.jpg",
			"panel": "https://i2.wallpaperscraft.com/image/margot_robbie_actress_celebrity_sweater_103421_300x168.jpg",
			"image": "https://i2.wallpaperscraft.com/image/margot_robbie_actress_celebrity_sweater_103421_602x339.jpg",
		},
		"title": "Margot Robbie",
		"description": "Margot Elise Robbie (born 2 July, 1990) is an Australian actress and producer.",
	}];

});
