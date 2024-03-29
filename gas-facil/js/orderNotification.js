var config = {appKey:"rMJLW7qybdglATi4FowrRFwmVqZkLoxuo6vntg1c",
    javascriptKey:"cvrkyMx0c4X2oG8vI9OkvtjnAClum3K9HMTkCj4i"};

var newNotification = true;
var lastOrderId = "";
var reloaded = false;


var checkOrders =  function(){
    Parse.initialize(config.appKey, config.javascriptKey);
    var notifications = Parse.Object.extend("Notificacao");
    var queryNotifications = new Parse.Query(notifications);
    queryNotifications.include("pedido.comprador");
    queryNotifications.count({success: function(count){
        if(count > 0){
            queryNotifications.find({
                success: function(results) {
                    var latestOrderPos = 0;
                    var latestOrder = results[latestOrderPos];
                    var order = latestOrder.get("pedido");
                    if(latestOrder.id == "" || lastOrderId != order.id) {
                        lastOrderId = order.id;
                        newNotification = true;
                    }else if(lastOrderId == order.id){
                        newNotification = false;
                    }
                    var buyerName = order.get("comprador").get("nome");
                    alertify.set({ delay: 30000 });
                    if(newNotification == true) {
                        alertify.log(buyerName + " fez um pedido!", "Notification", 0);
                        playSound("notification");
                    }
                    document.body.addEventListener('click', function (e) {
                        if(e.target.className.indexOf('alertify-log') > -1) {
                            stopSound();
                            latestOrder.destroy();
                            clickOnOrders();
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

var playSound = function(soundfile) {
    ion.sound({
        sounds: [
            {name: "door_bell"},
            {name: "notification"}
        ],
        path: getRootWebSitePath() + "/audio/",
        preload: true
    });
    console.log(getRootWebSitePath());
    ion.sound.play(soundfile, {
        loop: true
    });

};

var stopSound = function(){
  ion.sound.pause();
};

var clickOnOrders = function(){
    document.getElementById('orders-opt').click();

}
