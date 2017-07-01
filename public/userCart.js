$(document).ready(function(e) {
    //$('.add_cart')
    var url_add = window.location.href.match(/^.*\//)[0];
    

    //adds item to user cart
    $('.add_cart ').find('.product_button').on('click',function(){
        
        var product_target = $(this).parents('li');
        var p_amount = 1;
        var p_id = $.trim(product_target.attr('id'));
        //console.log("product id: "+p_id+" amount: "+p_amount);
        $.ajax({
            
            url: url_add+'addtocart',
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify({prodId : p_id, amount : p_amount}),
            success: function (response) {
                window.alert("this product is added to your cart!!")
                console.log("this product added to the user's cart!"+response.data);
            },
            error: function(error){
                ///var temp = JSON.parse(error.responseText);

                console.log("that is error when add to the cart: "+error.data);
            }
        });
    });

    $('.del_cart ').find('.del_button').on('click',function(){
        var product_target = $(this).parents('li');
        var id = product_target.attr('id');
        $.ajax({
            url: url_add+'user/cart/delete/'+id,
            type: 'DELETE',
            dataType: 'json',
            contentType: "application/json",
            success: function (response) {
                console.log("this product is deleted from user's cart: "+response.data);
                product_target.effect('drop', function () {
                    $(this).remove();
                });
            },
            error: function(error){
                console.log("that is error when del from the cart: "+error);
            }
        });
    });

});