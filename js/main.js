jQuery(document).ready(function(){
    jQuery("#submit-button").click(function(){
      jQuery("#response").html("");
      var url = jQuery("#url").val();  
      var email = jQuery("#email").val();  
      var title = jQuery("#title").val();  
      var subprefix = jQuery("#subprefix").val();  
      if( url && email && title){
        //send and display
        jQuery.ajax({
            type: 'POST',
            url: "https://lindat.mff.cuni.cz/services/shortener/api/v1/handles",
            data: JSON.stringify({url: url, title: title, reportemail: email, subprefix: subprefix}),
            contentType: "application/json",
            dataType: "json",
        }).done(function(data){
                var rows = "";
                /*for (var key in data){
                    if(data.hasOwnProperty(key)){
			rows+="<div>";
                        rows+="<span class='col-md-3'>" + key + "</span>";
                        rows+="<span class='col-md-9'>" + data[key] + "</span>";
			rows+="</div>";
                    }
                }*/
		rows += "<div class='label label-info'>Shorten Handle</div>";
		rows += "<div style='font-size: 150%; margin: 20px'><i class='glyphicon glyphicon-link'>&nbsp;</i><strong>" + data['handle'] + "</strong></div>";
                jQuery("#response").html("<div class='panel panel-info' style='margin: 30px 0px;'><div class='panel-body'>" + rows + "</div></div>");
            })
         .fail(function(jqXHR, textStatus, errorThrown){
                alert("The request failed.\n" + textStatus + "\n" + errorThrown);
            });
      }else{
        //display error
        jQuery("#response").html("<div class='alert alert-danger'><strong>Please fill all the fields</strong></div>");
      }
    });
});
