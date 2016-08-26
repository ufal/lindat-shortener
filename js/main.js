/* global jQuery */
jQuery(document).ready(
    function () {
    	
    	
    	jQuery("#url").focus();
    	
    	jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    		  var target = $(e.target).attr("href") // activated tab
    		  if(target=="#update") {
    			  jQuery("#handle").focus();
    		  } else {
    			  jQuery("#url").focus();
    		  }
    	});
    	
        jQuery
            .ajax(
                {
                    type: 'GET',
                    url: "https://lindat.mff.cuni.cz/services/shortener/api/v1/handles",
		    //desc is the default, just to be sure...
		    data: {limit:5, order:"desc"},
                    contentType: "application/json",
                    dataType: "json"
                })
            .done(
                function (data) {
                    var result = jQuery("#recently-generated table");
                    for (var i = 0; i < data.length; i++) {
                        var sr = data[i];
                        var time = sr['submitdate'].replace(/[TZ]/g, " ");
                        var str =
                        	"<tr>" +
                        		"<td class='text-center'>" + sr['title'] + "<br>";
                        	
                        	if(sr['datasetName']!=null) {
                        		str += sr['datasetName'];
                        		if(sr['datasetVersion']!=null) {
                        			str += " - " + sr['datasetVersion'] + "<br>";
                        		}else{
                        			str += "<br>";
                        		}                        		
                        	}
                        	
                        	if(sr['query']!=null) {
                        		str += "Associated Query: " + sr['query'] + "<br>";
                        	}                        	
                        	
                        	str +=	"<a href='" + sr['handle'] + "' target='_blank'>" + sr['handle'] + "</a><br>" +
                        			"<i class=\"fa fa-clock-o\"></i> <em>created at " + time + "</em>" +
                        	"</td></tr>";
                        result.append(str);
                    }
                }
            );

        jQuery("#submit-button")
            .click(
                function () {
                    jQuery("#error").html("");
                    jQuery("#response").html("");

                    var btn = jQuery(this).button('loading');

                    var url = jQuery("#url").val();
                    var email = jQuery("#email").val();
                    var title = jQuery("#title").val();
                    var subprefix = jQuery("#subprefix").val();
                    var datasetName = jQuery("#datasetName").val();
                    var datasetVersion = jQuery("#datasetVersion").val();
                    var query = jQuery("#query").val();
                    if (url && email && title) {
                        // send and display
                        jQuery
                            .ajax(
                                {
                                    type: 'POST',
                                    url: "https://lindat.mff.cuni.cz/services/shortener/api/v1/handles",
                                    data: JSON
                                        .stringify({
                                            url: url,
                                            title: title,
                                            reportemail: email,
                                            subprefix: subprefix,
                                            datasetName: datasetName,
                                            datasetVersion: datasetVersion,
                                            query: query                    
                                        }),
                                    contentType: "application/json",
                                    dataType: "json"
                                })
                            .done(
                                function (data) {
                                    var rows = "";
                                    rows += "<div class='label label-info'>Shorten Handle</div>";
                                    rows += "<div style='font-size: 150%; margin: 10px'><i class='glyphicon glyphicon-link'>&nbsp;</i><strong>"
                                        + data['handle']
                                        + "</strong></div>";
                                    rows += "<div style='font-size: 100%; margin: 10px;'>Remember the token "
                                   	 +  "<strong>" + data["token"] + "</strong> to update the handle in future."
                                   		"</div>";                                    
                                    jQuery(
                                        "#response")
                                        .html(
                                            "<div class='alert alert-info'>"
                                            + rows
                                            + "</div>");
                                    btn.button('reset');
                                })
                            .fail(
                                function (jqXHR,
                                          textStatus,
                                          errorThrown) {
                                    jQuery("#error")
                                        .html("<div class='text-danger' style='font-size: 100%; padding: 10px;'>The request failed.<br>"
                                            + textStatus
                                            + "<br>"
                                            + errorThrown
                                            + "</div>");
                                    btn.button('reset');
                                });
                    } else {
                        // display error
                        jQuery("#error")
                            .html(
                                "<div class='text-danger' style='font-size: 100%; padding: 10px;'>" +
                                "<strong>* Please fill the required fields</strong>");
                        btn.button('reset');
                    }
                });
        
        
        jQuery("#update-button")
        .click(
            function () {
                jQuery("#update-error").html("");
                jQuery("#update-response").html("");

                var btn = jQuery(this).button('loading');

                var url = jQuery("#newUrl").val();
                var handle = jQuery("#handle").val();
                var token = jQuery("#token").val();
                if (url && handle && token) {
                    // send and display
                    jQuery
                        .ajax(
                            {
                                type: 'PUT',
                                url: "https://lindat.mff.cuni.cz/services/shortener/api/v1/handles",
                                data: JSON
                                    .stringify({
                                        url: url,
                                        handle: handle,
                                        token: token                    
                                    }),
                                contentType: "application/json",
                                dataType: "json"
                            })
                        .done(
                            function (data) {
                                var rows = "";
                                rows += "<div style='font-size: 150%; margin: 10px'><i class='glyphicon glyphicon-link'>&nbsp;</i><strong>"
                                     + data['handle']
                                     + "</strong></div>";
                                rows += "<div style='font-size: 100%; margin: 10px;'>Handle Updated. Remember the token "
                                  	 +  "<strong>" + data["token"] + "</strong> to update the handle in future."
                                  		"</div>";
                                jQuery(
                                    "#update-response")
                                    .html(
                                        "<div class='alert alert-success'>"
                                        + rows
                                        + "</div>");
                                btn.button('reset');
                            })
                        .fail(
                            function (jqXHR,
                                      textStatus,
                                      errorThrown) {
                                jQuery("#update-error")
                                    .html("<div class='text-danger' style='font-size: 100%; padding: 10px;'>The request failed.<br>"
                                        + textStatus
                                        + "<br>"
                                        + errorThrown
                                        + "</div>");
                                btn.button('reset');
                            });
                } else {
                    // display error
                    jQuery("#update-error")
                        .html(
                            "<div class='text-danger' style='font-size: 100%; padding: 10px;'>" +
                            "<strong>* Please fill the required fields</strong>");
                    btn.button('reset');
                }
            });  
        
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
        
    }
);

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

