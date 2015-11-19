jQuery(document)
		.ready(
				function() {
					
					jQuery(window).scroll(function(){
						var hd = jQuery("#header");
						var scroll = jQuery(window).scrollTop();
						
						if (scroll >= 100) {
							hd.css("height", "80px")
							hd.css("position", "fixed");
						} else {
							hd.css("height", "180px")
							hd.css("position", "absolute");
						}
												
						
					});

					jQuery("#submit-button")
							.click(
									function() {
										jQuery("#error").html("");
										jQuery("#response").html("");

										var $btn = $(this).button('loading');

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
																type : 'POST',
																url : "https://lindat.mff.cuni.cz/services/shortener/api/v1/handles",
																data : JSON
																		.stringify({
																			url : url,
																			title : title,
																			reportemail : email,
																			subprefix : subprefix
																		}),
																contentType : "application/json",
																dataType : "json"
															})
													.done(
															function(data) {
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
																$btn.button('reset');
															})
													.fail(
															function(jqXHR,
																	textStatus,
																	errorThrown) {
																jQuery("#error")
																.html("<div class='text-danger' style='font-size: 100%; padding: 10px;'>The request failed.<br>"
																		+ textStatus
																		+ "<br>"
																		+ errorThrown
																		+ "</div>");
																$btn.button('reset');
															});
										} else {
											// display error
											jQuery("#error")
													.html(
															"<div class='text-danger' style='font-size: 100%; padding: 10px;'>" +
															"<strong>* Please fill all the fields</strong>");
											$btn.button('reset');
										}
									});
				});
