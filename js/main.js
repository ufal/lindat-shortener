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
                    // Sort data by submitdate (newest to oldest) and take the first 5
                    data.sort(function(a, b) {
                        return new Date(b.submitdate) - new Date(a.submitdate);
                    });
                    
                    // Limit to 5 newest entries
                    var limitedData = data.slice(0, 5);
                    
                    var result = jQuery("#recently-generated table");
                    for (var i = 0; i < limitedData.length; i++) {
                        var sr = limitedData[i];
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
    }
);
