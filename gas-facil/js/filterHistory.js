/**
 * Created by rodrigo on 06/12/14.
 */
$(document).ready(function(e){
    $(function() {
        $('#calendar').datepicker({
            dateFormat: 'dd/mm/yy',
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
            dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro'
                , 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        });

        $('#calendar2').datepicker({
            dateFormat: 'dd/mm/yy',
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
            dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro'
                , 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        });

        $('#filter-history-bnt').click(function(){
            var fromTextDate = $('#calendar').val();
            var toTextDate = $('#calendar2').val();
            if(fromTextDate != '' && toTextDate == ''){
                getHistoryByDate(fromTextDate);
            }else if (fromTextDate == '' && toTextDate != ''){
                getHistoryByDate(toTextDate);

            }else if(fromTextDate == '' && toTextDate == ''){
                getHistory();
            }else{
                getHistoryByRangeData(fromTextDate , toTextDate);
            }

        });

    });

    var getHistoryByDate = function(chosenTextDate) {
        var queryOrders = initializeOrders();

        deleteOldHistory(); //clean the table before adding the elements again (to avoid duplication)

        queryOrders.find({
            success : function(results) {
                orders = [];
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    order = [];

                    var status = object.get('status');
                    var currentStatus = status;
                    var orderDate = object.createdAt;
                    var orderDay = orderDate.getDate();
                    if(orderDay >= '1' && orderDay <= '9'){
                        orderDay = '0' + orderDay; // add zero to day if necessary
                    }
                    var orderDateFormat = orderDay+"/"+(orderDate.getMonth()+1)+"/"+orderDate.getFullYear();
                    console.log("date format: " + orderDateFormat + " chosen date: " + chosenTextDate);
                    if(status != orderStatus.pending && status != "pendente" && (orderDateFormat == chosenTextDate)) {
                        var order = fillOrderArray(object, status);
                        orders.push(order);
                    }
                }

                if(orders.length == 0){
                    alertify.alert("Nenhum pedido efetuado na data " + chosenTextDate);
                    return false;
                }

                var table = document.getElementById("history-table");

                var tbody = document.createElement("tbody");
                table.appendChild(tbody);
                orders.forEach(function(items) {
                    var row = document.createElement("tr");

                    historyCount++;
                    var dropdownId = "dropdown-history" + historyCount ;
                    var dd_process_order = createDropdownMenuHistory(dropdownId);
                    var searchId = '#' + dropdownId;
                    console.log("searchID: " + searchId);
                    dd_process_order.onchange= function() {
                        var selected = $(this).find(':selected').val();
                        console.log("selected opt: " + selected + " current status: " + status);
                        queryOrders.equalTo("objectId", items[0]);
                        queryOrders.first({
                            success: function(object) {
                                object.set("status", selected);
                                object.save();
                                currentStatus = selected;
                                var canDismiss = false;
                                var notification = alertify.success('Pedido alterado com sucesso!');
                                notification.ondismiss = function(){ return canDismiss; };
                                setTimeout(function(){ canDismiss = true;}, 1000);

                                clickOnHistory();
                            },
                            error: function(error) {
                                alert("Error: " + error.code + " " + error.message);
                            }
                        });

                    };

                    items.splice(0,1); //remove the id (not display it)
                    items.forEach(function(item) {
                        var cell = document.createElement("td");
                        cell.textContent = item;

                        row.appendChild(cell);
                    });


                    row.appendChild(dd_process_order);
                    tbody.appendChild(row);

                });
            },
            error : function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });

    };

    var getHistoryByRangeData = function(fromTextDate, toTextDate){
        var queryOrders = initializeOrders();

        deleteOldHistory(); //clean the table before adding the elements again (to avoid duplication)

        queryOrders.find({
            success : function(results) {
                orders = [];
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    order = [];

                    var status = object.get('status');
                    var currentStatus = status;
                    var orderDate = object.createdAt;
                    var orderDay = orderDate.getDate();
                    if(orderDay >= '1' && orderDay <= '9'){
                        orderDay = '0' + orderDay; // add zero to day if necessary
                    }
                    var orderDateFormat = orderDay+"/"+(orderDate.getMonth()+1)+"/"+orderDate.getFullYear();
                    var d1 = fromTextDate.split("/");
                    var d2 = toTextDate.split("/");
                    var c = orderDateFormat.split("/");
                    var currentOrderDate = new Date(c[2], c[1]-1, c[0]);
                    var fromDate =  new Date(d1[2], d1[1]-1, d1[0]);
                    var toDate = new Date(d2[2], d2[1]-1, d2[0]);
                    console.log("current: " + currentOrderDate + " from: " + fromDate + " to: " + toDate);
                    if(status != orderStatus.pending && status != "pendente" && (currentOrderDate >= fromDate &&
                        currentOrderDate <= toDate)) {
                        var order = fillOrderArray(object, status);
                        orders.push(order);
                    }
                }

                if(orders.length == 0){
                    alertify.alert("Nenhum pedido efetuado no período de " + fromTextDate + " - " + toTextDate);
                    return false;
                }

                var table = document.getElementById("history-table");

                var tbody = document.createElement("tbody");
                table.appendChild(tbody);
                orders.forEach(function(items) {
                    var row = document.createElement("tr");

                    historyCount++;
                    var dropdownId = "dropdown-history" + historyCount ;
                    var dd_process_order = createDropdownMenuHistory(dropdownId);
                    var searchId = '#' + dropdownId;
                    console.log("searchID: " + searchId);
                    dd_process_order.onchange= function() {
                        var selected = $(this).find(':selected').val();
                        console.log("selected opt: " + selected + " current status: " + status);
                        queryOrders.equalTo("objectId", items[0]);
                        queryOrders.first({
                            success: function(object) {
                                object.set("status", selected);
                                object.save();
                                currentStatus = selected;
                                var canDismiss = false;
                                var notification = alertify.success('Pedido alterado com sucesso!');
                                notification.ondismiss = function(){ return canDismiss; };
                                setTimeout(function(){ canDismiss = true;}, 1000);

                                clickOnHistory();
                            },
                            error: function(error) {
                                alert("Error: " + error.code + " " + error.message);
                            }
                        });

                    };

                    items.splice(0,1); //remove the id (not display it)
                    items.forEach(function(item) {
                        var cell = document.createElement("td");
                        cell.textContent = item;

                        row.appendChild(cell);
                    });


                    row.appendChild(dd_process_order);
                    tbody.appendChild(row);

                });
            },
            error : function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });

    };



});