$(document).ready(function(e) {

    var url_add = 'http://localhost:8080';
    var loggedin = false;
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
                            '<span class="add_cart"><button name="addToCart">Add to cart</button> <a>Add to cart</a></span>' +
                        '</li>'
                    );
                });
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
                        data: JSON.stringify( {user: user, pass:password}),
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

// Log-in existing user
    
    // $('#login').click(function () {
    //     console.log("display Login form");
    //     $('#display_content').empty();
    //     $content = $('#display_form');
    //     $content.empty();
    //     $content.append(
    //         '<div id="login_form">'+
    //         '<form>'+
    //         '<label for="user_name"><h2>User name:</h2></label>'+
    //         '<input id="user_name" type="text" name="user_name"/>'+
    //         '<label for="password"><h2>Password:</h2></label>'+
    //         '<input id="password" type="text" name="password"/>'+
    //         '<button name="login" id="login">Login</button>'+
    //         //'<button name="register_link" id="register_link">Register</button>'+
    //         '</form>'+
    //         '<span class="response_msg"></span>'+
    //         '</div>'
    //     );
    // });
    //
    // $('#content').on('click', '#login', function () {
    //     var username = $('#user_name').val();
    //     var password = $('#password').val();
    //     console.log(username);
    //     $.ajax({
    //         url: url_add+'/login',
    //         type: 'POST',
    //         dataType: 'json',
    //         contentType: "application/json",
    //         data: JSON.stringify({user: username, pass:password}),
    //         success: function (user) {
    //             console.log("successfully logged in");
    //             if(user.user === username && user.pass === password){
    //                 $('#login h2').text('Log out');
    //                 $('#x_logout a').attr('id', 'log_out');
    //             }
    //             $('.response_msg').append('<p>Successfully logged! '+username+', welcome!</p> ');
    //
    //         },
    //         error: function(error){
    //             console.log("Unsuccessful to log-in");
    //             $('.response_msg').append('<p>unsuccessfully logged! '+username+'</p> ');
    //         }
    //     });
    // });
    //

});//ends
