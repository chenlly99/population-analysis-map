
var Golbal = {
		init: function(){
			Golbal.domEventHandler();
		},
		resizeLayout: function(){
			var winH = $(window).height();
	        var winW = $(window).width();
	        $("#main_wrap").height(winH);
	        $("#main_wrap").width(winW);
	        $("#content-box").height(winH-90);
	        $("#dropshow-list").height($(".dropshow").height()-122);
	        var contentW = winW - 480;
	        var _left =480;
	        if($(".dropshow").hasClass("hidden")){
	        	contentW = winW - 240;
	        	_left =240;
	        }
	        $(".content").width(contentW);
	        $(".content").css({"left": _left+ "px"});
	        $(".map-box").height($(".content").height() - 36);
		},
		domEventHandler: function(){
			//resize========
			$(window).on("resize", function() {
				Golbal.resizeLayout();
		    });
		    $(window).trigger("resize");
		   //resize============END
		    
		    $("#drop-btn").off("click").on("click", function(e){
		    	$(".dropshow").toggleClass("hidden");
		    	Golbal.resizeLayout();
		    });
		    
		    $(".menu-item").off("click").on("click", function(e){
		    	var type = $(this).attr("type");
		    	$(this).find(".menu-item-arrowicon-down").toggleClass("up");
		    	if($(this).find(".menu-item-arrowicon-down").hasClass("up")){
		    		$(".all-sub-menus-wrap[for='"+type+"']").addClass("open");
		    	}else{
		    		$(".all-sub-menus-wrap[for='"+type+"']").removeClass("open");
		    	}
		    });
		},
};

$(function(){
	Golbal.init();
});