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
                for (var key in data){
                    if(data.hasOwnProperty(key)){
                        rows+="<tr>";
                        rows+="<td>" + key + "</td>";
                        rows+="<td>" + data[key] + "</td>";
                        rows+="</tr>";
                    }
                } 
                jQuery("#response").html("<table>" + rows + "</table>");
            })
         .fail(function(jqXHR, textStatus, errorThrown){
                alert("The request failed.\n" + textStatus + "\n" + errorThrown);
            });
      }else{
        //display error
        jQuery("#response").html("Please fill all the fields");
      }
    });
});
