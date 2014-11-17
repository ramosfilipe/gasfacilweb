var config = {appKey:"rMJLW7qybdglATi4FowrRFwmVqZkLoxuo6vntg1c",
    javascriptKey:"cvrkyMx0c4X2oG8vI9OkvtjnAClum3K9HMTkCj4i"};

var checkOrders =  function(){
    Parse.initialize(config.appKey, config.javascriptKey);
    var notifications = Parse.Object.extend("Notificacao");
    var queryNotifications = new Parse.Query(notifications);
    queryNotifications.include("pedido.comprador");
    queryNotifications.count({success: function(count){

        if(count>0) {
            queryNotifications.find({
                success: function(results) {
                    var latestOrder = results[0];
                    var order = latestOrder.get("pedido");
                    var buyerName = order.get("comprador").get("nome");
                    alertify.set({ delay: 30000 });
                    alertify.log(buyerName + " fez um pedido!","Notification",0);
                    document.body.addEventListener('click', function (e) {
                        //while(e.target.className.indexOf('alertify-log') == -1) {
                        //    playSound("../audio/notification.mp3"); /*not working*/
                        //}
                        if(e.target.className.indexOf('alertify-log') != -1) {
                            latestOrder.destroy();
                        }
                    }, false);

                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });

        }
    }});

    setTimeout(checkOrders, 5000);
};

function playSound(soundfile) {
    document.getElementById("order-sound").innerHTML=
        "<embed src='"+soundfile+"' hidden=true autostart=true loop=false>";
}