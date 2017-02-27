$(document).ready(function(){

$("#alerts").click(function() {
	$(".container-fluid").hide();
    $("#alertsReport").show("slide");
    $("#dashboardLink").attr("class","inactive");
    $("#alertsLink").attr("class","active");
});

$("#dashboard").click(function(){

	$("#alertsReport").hide();
	$(".container-fluid").show("slide");
	  $("#alertsLink").attr("class","inactive");
    $("#dashboardLink").attr("class","active");

});

});
