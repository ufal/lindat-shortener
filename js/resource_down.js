jQuery(document).ready(
    function () {
        	var hdl = getUrlParameter("hdl");

        	if(hdl){
                jQuery.ajax({
                    type: 'GET',
                    url: "https://hdl.handle.net/api/handles/" + hdl,
                }).done(function(data){
                    var rows = "";
                    data.values.forEach(function showVals(element, index, array){
                        var type = element.type;
                        var value = element.data.value;
                        if(type === 'URL'){
                            //URL refers to us do nothing
                            ;
                        }else if(type === 'ORIG_URL'){
                            jQuery("#orig_url").append('<a href="'+value+'">'+value+'</a>');
                        }else if(type === 'DEAD_SINCE'){
                            jQuery("#dead_since").text('since ' + value);
                        }else{
                            rows += "<tr><td style='font-size:90%' class='text-right'><strong>" + type + "</strong></td><td style='font-size: 90%;'>" + value + "</td></tr>"

                        }
                    });
                    jQuery("#metadata").append(rows);
                }).fail(function error(jqXHR, textStatus, errorThrown){
                    alert("The request failed.\n" + textStatus + "\n" + errorThrown);
                });
            }else{
                    alert("Missing parameter 'hdl'");
            }        	
        

});

//using hash instead of search, https://github.com/ufal/lindat-dspace/issues/586
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.hash
                        .substring(1)), sURLVariables = sPageURL
                        .split('&'), sParameterName, i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}    

