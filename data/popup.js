
$(document).ready(function () {
addon.port.on("vars",  function(vars,interval) {
	 if (vars)
	{
		 $("#chkarticles").attr("checked", vars[0]);
			$("#chkarticlescomments").attr("checked", vars[1]);
			$("#chkshares").attr("checked", vars[2]);
			$("#chksharescomments").attr("checked", vars[3]);
	}

	$("#interval").val(interval);
});

   

    $("#btnsave").click(function() {
		
         var Vposts = $("#chkarticles").is(':checked');
         var VpostsComments = $("#chkarticlescomments").is(':checked');
         var  Vshares = $("#chkshares").is(':checked');
         var VsharesComments = $("#chksharescomments").is(':checked');
		 var Vinterval = $("#interval").val() ;
		 var Variables=[];
		 Variables[0]=Vposts;
		 Variables[1]=VpostsComments;
		 Variables[2]=Vshares;
		 Variables[3]=VsharesComments;
		 interval=Vinterval;
		 
		 addon.port.emit("vars", Variables,Vinterval);
		$("#messageboard").text( Messages.SettingsSaved);
	
    });
});

  