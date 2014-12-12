$(document).ready(function(e){
    $("#register-product-btn").on('click',function(e){
        e.preventDefault();
        Parse.initialize(config.appKey, config.javascriptKey);
        var Product = Parse.Object.extend("Produto");
        var newProduct = new Product();
        productPrice = $("#product-price-input").val();
        productDescription = $("#product-description-input").val();
        var fileUploadControl = $("#product-image")[0];
        if(validateForm(fileUploadControl) == true) {
            parseFile = new Parse.File(productImage.name, productImage);
            console.log("image: " + parseFile);
            newProduct.set("photo", parseFile);
            console.log("price: " + productPrice);
            newProduct.set("price", productPrice);
            newProduct.set("descricao", productDescription);
            console.log("type: " + productType);
            newProduct.set('thumbnailBlur', parseFile);
            newProduct.set("type", productType);
            newProduct.set("emCirculacao", true);
            newProduct.save(null, {
                success: function (newProduct) {
                    // Execute any logic that should take place after the object is saved.
                    $("#message").html("<span style='color:green' id='error_message' >Produto cadastrado com sucesso!</span>");

                },
                error: function (logic, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    $("#message").html("<span style='color:red' id='error_message' >Cadastro do produto falhou!</span>");
                }
            });
            $('#message').show();

        }
    });


    $(function(){
        $('#product-type-select').change(function() {
            var selected = $(this).find(':selected').val();
            productType = selected;
        });
    });

    // Function to preview image
    $(function() {
        $("#product-image").change(function() {
            $("#message").empty();         // To remove the previous error message
            var file = this.files[0];
            var imagefile = file.type;
            checkFileType(imagefile, file);
        });
    });

    // close overlay when the ESC key is pressed
    $(document).keyup(function(e) {
        var ESC_KEY =27;
        if (e.keyCode == ESC_KEY) { // if user presses esc key
            $('#overlay-product-form').hide(); //hide the overlay
        }
    });

});


var resetForm = function(){
    $('#product-type-select').val('Escolher tipo');
    $("#product-price-input").val('');
    $("#product-description-input").val('');
    $('#previewing').attr('src', 'images/placeholder.png');
    productImage = null;
    productPrice = "";
    productType = "";
    productDescription = "";
};

function checkFileType(imagefile, file){
    var match= ["image/jpeg","image/png","image/jpg"];
    var match= ["image/jpeg","image/png","image/jpg"];
    if(!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2])))
    {
        $('#previewing').attr('src','images/placeholder.png');
        $("#message").html("<span style='color:red' id='error_message' >Apenas imagens jpeg, jpg e png são " +
        "permitidas</span>");
        $("#message").show();
        return false;
    }
    else
    {
        var reader = new FileReader();
        reader.onload = imageIsLoaded;
        reader.readAsDataURL(file);
        return true;
    }
};

function imageIsLoaded(e) {
    $("#product-image").css("color","green");
    $('#image_preview').css("display", "block");
    $('#previewing').attr('src', e.target.result);
    $('#previewing').attr('width', '250px');
    $('#previewing').attr('height', '150px');
};

function validateForm(fileUploadControl) {
    var file;
    var result = true;
    if (fileUploadControl.files.length > 0 && checkFileType(fileUploadControl.files[0].type, fileUploadControl.files[0])) {
        file = fileUploadControl.files[0];
        productImage = file;
    } else {
        $("#message").html("<span style='color:red' id='error_message' >Escolha uma imagem!</span>");
        $("#message").show();
        result = false;
    }
    if (productPrice == "" || isNumber(productPrice) == false) {
        $("#message").html("<span style='color:red' id='error_message' >Preço deve conter apenas números!</span>");
        $("#message").show();
        result = false;
    }
    if (productType == "") {
        $("#message").html("<span style='color:red' id='error_message' >Selecione um tipo de produto!</span>");
        $("#message").show();
        result = false;
    }
    if(productDescription == ""){
        $("#message").html("<span style='color:red' id='error_message' >Informe a descrição do produto!</span>");
        $("#message").show();
        result = false;
    }

    return result;
};



function isNumber(value) {

    return /^[+-]?\d+(\.\d+)?$/.test(value);
};