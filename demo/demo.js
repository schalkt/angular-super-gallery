var demo = angular.module('demo', ['angularSuperGallery', 'FBAngular']);

demo.controller('DemoController', function ($http) {

    this.options1 = {
        baseUrl: "",
        fields: {}
    };

    this.files1 = [{
        "url": "http://img07.deviantart.net/2144/i/2014/349/b/7/micropolis_wallpaper_by_lacza-d89y46i.jpg",
    }, {
        "url": "http://img14.deviantart.net/467e/i/2012/062/4/0/suborganic_space_by_joelbelessa-d4e7z8x.jpg",
    }, {
        "url": "http://orig08.deviantart.net/6a12/f/2010/037/0/4/the_hornet_by_ev_one.jpg"
    }, {
        "url": "http://orig06.deviantart.net/1a01/f/2014/073/5/c/abstract_wallpaper_by_bezo97-d7a58jc.png"
    }, {
        "url": "http://img01.deviantart.net/e9a5/i/2013/329/9/3/chemical_factory_by_lacza-d66a6sg.jpg"
    }];

    this.files2 = [];

});
