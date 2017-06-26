$(document).ready(function(e) {

    var url_add = 'http://localhost:8080';
    var isLoggedin = false;
    var isAdmin = false;
    var loggedin_user = '';
    // var password = '';
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
                var temp = JSON.parse(products);
                console.log("this is the products from severside: "+temp);
                $.each(products, function (i, product) {
                    $display_content.append(
                        '<li class="products_list" id=product.product_id>'+
                            '<img src="'+product.picture_dir+'" alt="'+product.product_name+'">'+
                            '<span class="products_des">'+
                                '<h2>'+product.product_name+'</h2>'+
                                '<p>'+product.product_des+'</p>'+
                                '<p>&#36; '+product.price+'</p>'+
                                '<p>product id: '+product.product_id+'</p>'+
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
                //var temp = JSON.parse(error.responseText);
                console.log("what is the error: "+temp);
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
                var user = $('#user_name').val();
                var password = $('#password').val();
                var confirm_password = $.trim($('#confirm_password').val());
                //check if any of these fields are empty
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
                        data: JSON.stringify( {user: user, pass:password}),
                        success: function (response) {
                            var temp = JSON.parse(response.responseText);
                            console.log(temp.data);
                            $msg.append('<h3 style="color: royalblue;">Successfully created a new user! welcome '+user+' !</h3>');
                        },
                        error: function(error){
                            var temp = JSON.parse(error.responseText);
                            console.log("Unsuccessful to add user "+temp.data);
                            $msg.append('<p>'+temp.data+', Please try again!!</p>');
                            console.log(error);
                            //stop the pop-up window to close for 3 seconds
                            setTimeout(function(){
                                $('#user_name').val('');
                                $('#password').val('');
                                $('#confirm_password').val('');
                                $msg.empty();
                            }, 4000);
                        }
                    });
                    setTimeout(function(){
                        $('#user_name').val('');
                        $('#password').val('');
                        $('#confirm_password').val('');
                        $msg.empty();
                        $('#display_register_form').dialog('close');
                    }, 2000);
                }
            },
            "Cancel": function(){
                //Reset all inputs and response msg
                $('#user_name').val('');
                $('#password').val('');
                $('#confirm_password').val('');
                $msg.empty();
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
                var username = $('#login_user_name').val();
                var password = $('#login_password').val();
                $msg = $('.response_msg');
                $msg.empty();
                if($.trim(username).length === 0 || $.trim(password).length === 0){
                    $msg.append('<p>User name/pass word can not be empty!</p> ');
                    return;
                }
                else {
                    $.ajax({
                        url: url_add + '/login',
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json",
                        data: JSON.stringify({user: username, pass: password}),
                        success: function (response) {
                            console.log(response);
                            //var temp = JSON.parse(response);
                            console.log("successful to log-in -- "+response.data);
                            isLoggedin = true;
                            $msg.append('<h3 style="color: royalblue;">Successfully logged in as ' + username + ' !</h3>');
                        },
                        error: function (error) {
                            var temp = JSON.parse(error.responseText);
                            console.log("error: "+error);
                            console.log("Unsuccessful to log-in -- "+temp.data);
                            $msg.append('<p>'+ temp.data+'</p>');
                            setTimeout(function(){
                                $('#login_user_name').val('');
                                $('#login_password').val('');
                                $msg.empty();
                            }, 4000);
                        }
                    });
                    setTimeout(function(){
                        $('#logout').css("display","normal");
                        $('#login').css("display","none");
                        $('#login_user_name').val('');
                        $('#login_password').val('');
                        $msg.empty();
                        $('#display_login_form').dialog('close');
                    }, 2000);
                }
            },
            "Cancel": function () {
                $('#login_user_name').val('');
                $('#login_password').val('');
                $msg.empty();
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
                isLoggedin = false;
                loggedin_user = '';
                //TODO may need to restore the admin infor aswell
                console.log("SUCCESS: logout: --- "+response.data);
            },
            error: function (error) {
                console.log("FAILURE: logout: --- "+error.data);
            }
        });
    });

//To add to the cart when the button is clicked
    $('#display_content').on('click', '.add_cart', function () {
        $.ajax({
            url: url_add+'/addtocart',
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify( {user: user, pass:password}),
            success: function (response) {
                console.log("this ")
            },
            error: function(error){

            }
        });
    });

//Shopping Cart
    $('#cart').click(function () {
        if(isLoggedin){
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
                                '<span class="del_cart"><button name="delFromCart">Delete</button></span>' +
                            '</li>'
                        );
                    });
                },
                error: function (error) {
                    console.log("Unsuccessful to load products from cart database");
                }
            });
        }
        else{
            console.log("only logged in user is able to open cart!");
            window.alert("Please log in, before check out the cart!");
        }
    });

//Search the product
    $('#search a').click(function () {
        var search_content=$('#search input').val();
        if($search_content !== '') {
            // window.alert($search_content);
            $.ajax({
                url: url_add + '/search',
                type: 'POST',
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
