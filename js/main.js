/* global jQuery */
jQuery(document).ready(
    function () {
        jQuery
            .ajax(
                {
                    type: 'GET',
                    url: "https://lindat.mff.cuni.cz/services/shortener/api/v1/handles",
                    contentType: "application/json",
                    dataType: "json"
                })
            .done(
                function (data) {
                    var j = 0;
                    var result = jQuery("#recently-generated table");
                    for (var i = data.length - 1; i >= 0; i--) {
                        if (j++ == 5) break;
                        var sr = data[i];
                        var time = sr['submitdate'].replace(/[TZ]/g, " ");
                        result.append("<tr><td class='text-center'>"
                            + sr['title'] + "<br>"
                            + "<a href='" + sr['handle'] + "' target='_blank'>" + sr['handle'] + "</a><br>"
                            + "<i class=\"fa fa-clock-o\"></i> <em>created at " + time + "</em>"
                            + "</td></tr>");
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
                    var subprefix = jQuery("#subprefix")
                        .val();
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
                                            subprefix: subprefix
                                        }),
                                    contentType: "application/json",
                                    dataType: "json"
                                })
                            .done(
                                function (data) {
                                    var rows = "";
                                    /*
                                     * for (var key
                                     * in data){
                                     * if(data.hasOwnProperty(key)){
                                     * rows+="<div>";
                                     * rows+="<span
                                     * class='col-md-3'>" +
                                     * key + "</span>";
                                     * rows+="<span
                                     * class='col-md-9'>" +
                                     * data[key] + "</span>";
                                     * rows+="</div>"; } }
                                     */
                                    rows += "<div class='label label-info'>Shorten Handle</div>";
                                    rows += "<div style='font-size: 150%; margin: 10px'><i class='glyphicon glyphicon-link'>&nbsp;</i><strong>"
                                        + data['handle']
                                        + "</strong></div>";
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
    }
);
