$(document).ready(function(e) {

    var url_add = 'http://localhost:8080';
    var isLoggedin = false;
    var username = '';
    var password = '';
// the nav "shop" is clicked
    $('#shop').click(function () {
        console.log("display products");
        $('#display_form').empty();
        $('#display_content').empty();
        loadProducts();

    });
// load the products info from data and display
    function loadProducts(){
        $display_content = $('#display_content');
        $.ajax({
            url: url_add+'/products',//may change this later for the according the serverside
            type:'GET',
            dataType: 'json',
            success: function (products) {
                $.each(products, function (i, product) {
                    $display_content.append(
                        '<li class="products_list">'+
                            '<img src="'+product.picture_dir+'" alt="'+product.product_name+'">'+
                            '<span class="products_des">'+
                                '<h2>'+product.product_name+'</h2>'+
                                '<p>'+product.product_des+'</p>'+
                                '<p>&#36; '+product.price+'</p>'+
                            '</span>'+
                            '<span class="add_cart"></span>' +
                        '</li>'
                    );
                });
                if(isLoggedin){
                    $('.add_cart').append('<button name="addToCart">Add to cart</button>');
                }
            },
            error: function (error) {
                console.log("Unsuccessful to load products from database");
            }
        });
    }

// register a new user
    $('#register').click(function (){
        $('#display_register_form').dialog('open');
    });

    $('#display_register_form').dialog({
        modal: true,
        autoOpen: false,
        height: 350,
        width: 350,
        buttons: {
            "Submit": function () {
                $msg = $('.response_msg');
                $msg.empty();
                var user = $.trim($('#user_name').val());
                var password = $.trim($('#password').val());
                var confirm_password = $.trim($('#confirm_password').val());
                if(user.length===0){
                    $msg.append('<p>please enter User Name...</p> ');
                    console.log("empty 'username' fields");
                    return;
                }
                else if(password.length===0){
                    $msg.append('<p>please enter Password...</p> ');
                    console.log("empty 'psw' fields");
                    return;
                }
                else if(password!==confirm_password){
                    $msg.append('<p>Your passwords are not match, please try again...</p> ');
                    console.log("passwords are not match");
                    return;
                }
                else{
                    $.ajax({
                        url: url_add+'/register',
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json",
                        data: JSON.stringify( {username: user, password:password}),
                        success: function (response) {
                            console.log("successfully add a new user!");
                            $display_register_form = $('#display_register_form');
                            $display_register_form.empty();
                            $display_register_form.append('<h3>Successfully created a new user! welcome '+user+' !</h3>');
                            //$('#content').appendChild('<p>Successfully registered! '+user+', welcome!</p>');
                            //$('.response_msg').append('<p>Successfully registered! '+user+', welcome!</p> ');
                        },
                        error: function(error){
                            console.log("Unsuccessful to add user"+error);
                        }
                    });
                    setTimeout(function(){$('#display_register_form').dialog('close');}, 2000);
                }
            },
            "Cancel": function(){
                $(this).dialog('close');
            }
        }
    });

/// Log-in existing user
    $('#login').click(function (){
        $('#display_login_form').dialog('open');
    });
    $('#display_login_form').dialog({
        modal: true,
        autoOpen: false,
        height: 350,
        width: 350,
        buttons: {
            "Log-in": function () {
                username = $('#login_user_name').val();
                password = $('#login_password').val();
                $('response_msg').empty();
                if($.trim(username).length === 0 || $.trim(password).length === 0){
                    $('.response_msg').append('<p>User name/pass word can not be empty!</p> ');
                    return;
                }
                else {
                    $.ajax({
                        url: url_add + '/login',
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json",
                        data: JSON.stringify({username: username, password: password}),
                        success: function (user) {
                            console.log("successfully logged in");
                            //window.alert(user.user);
                            // if (user.user === username && user.pass === password) {//TODO this condition is not working
                            //     window.alert("go");
                                // $('#nav #login h2').text('Log out');
                                // $('#nav #x_logout a').attr('id', 'log_out');

                            // }
                            isLoggedin = true;
                            // $('#nav #login h2').text('Log out');
                            // $('#nav #x_logout a').attr('id', 'log_out');
                            $('#logout').css("display","normal");
                            $('#login').css("display","none");
                            $display_login_form = $('#display_login_form');
                            $display_login_form.empty();
                            $display_login_form.append('<h3>Successfully logged in as ' + username + ' !</h3>');
                        },
                        error: function (error) {
                            console.log("Unsuccessful to log-in"+error);
                            $('.response_msg').append('<p>This user does not existed, please try again!</p> ');
                            return;
                        }
                    });
                }
                setTimeout(function(){$('#display_login_form').dialog('close');}, 2000);
            },
            "Cancel": function () {
                $(this).dialog('close');
            }
        }
    });

//Log out
    $('#logout').click(function () {
        isLoggedin = false;
        $('#login').css("display","normal");
        $('#logout').css("display","none");
        $.ajax({
            url: url_add+'/logout',
            type:'POST',
            dataType: 'json',
            success: function (response) {

                window.alert(response);

            },
            error: function (error) {
                console.log("");
            }
        });
    });

//To add to the cart when the button is clicked
    $('#display_content').on('click', '.add_cart', function () {
        $.ajax({
            url: url_add+'/addToCart',
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify( {user: user, pass:password}),
            success: function (response) {

            },
            error: function(error){

            }
        });
    });

//Shopping Cart
    $('#cart').click(function () {
        $('#display_content').empty();
        $display_content = $('#display_content');
        $.ajax({
            url: url_add+'/cart',//may change this later for the according the serverside
            type:'GET',
            dataType: 'json',
            success: function (products) {
                $.each(products, function (i, product) {
                    $display_content.append(
                        '<li class="products_list">'+
                            '<img src="'+product.picture_dir+'" alt="'+product.product_name+'">'+
                            '<span class="products_des">'+
                                '<h2>'+product.product_name+'</h2>'+
                                '<p>'+product.product_des+'</p>'+
                                '<p>&#36; '+product.price+'</p>'+
                            '</span>'+
                            '<span class="add_cart"></span>' +
                        '</li>'
                    );
                });
            },
            error: function (error) {
                console.log("Unsuccessful to load products from cart database");
            }
        });
    });

//Search the product
    $('#search a').click(function () {
        var search_content=$('#search input').val();
        if($search_content !== '') {
            // window.alert($search_content);
            $.ajax({
                url: url_add + '/search',
                type: 'GET',
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify({product_name: search_content}),//TODO search for the product name
                success: function (product) {
                //found or not found
                
                },
                error: function (error) {

                }
            });
        }
        $('#search input').val('');
    });

});//ends
