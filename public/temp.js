$(document).ready(function(e) {

    // example products data
    var data = '{"products:['
                +'{"product_name": "yeezy", "product_des":"The adidas Yeezy 350 Boost is a low-top sneaker designed by Kanye West.' +
        'The shoes first debuted at the YEEZY Season fashion show in February 2015 and new colorways were unveiled during YEEZY Season 3 on February 11th, 2016.", ' +
        '"product_price":"200", "img_dir":"img/img/products_img/yeezy_350.jpg"}'
                +'{"product_name": "yeezy 2", "product_des":"The adidas Yeezy 350 Boost is a low-top sneaker designed by Kanye West.' +
        'The shoes first debuted at the YEEZY Season fashion show in February 2015 and new colorways were unveiled during YEEZY Season 3 on February 11th, 2016.", ' +
        '"product_price":"300", "img_dir":"img/img/products_img/yeezy_350.jpg"}'
                +'{"product_name": "yeezy 3", "product_des":"The adidas Yeezy 350 Boost is a low-top sneaker designed by Kanye West.' +
        'The shoes first debuted at the YEEZY Season fashion show in February 2015 and new colorways were unveiled during YEEZY Season 3 on February 11th, 2016.", ' +
        '"product_price":"400", "img_dir":"img/img/products_img/yeezy_350.jpg"}]"}';

    $('#shop').on('click', function () {
        console.log("display products");


    });

});
