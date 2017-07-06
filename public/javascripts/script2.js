var currentImg = 0;

var preload = function(src, callback) {
  // Create a temporary image.
  var img = new Image();
 
  // Invoke the callback as soon as the image is loaded
  // Has to be set **before** the .src attribute. Otherwise
  // `onload` could fire before the handler is set.
  $(img).load(callback);
 
  img.src = src;
};
 
 
// Example usage:
 


$(document).ready(function(){ 
  $("#content_container").css("height", $("#left_content").height()+20);
  //alert($("#left_content").height());
  $("body").addClass("loading-background");
  var bImage = $("body").data("background");
   
  preload(bImage, function() {
    $("body").addClass("background-loaded");
    $("body").css('backgroundImage','url('+bImage+')');

  });
  $("#left_content a[href^='http://']").prop("target", "_blank");
  $("#right_content a[href^='http://']").prop("target", "_blank");

  $("#left_content .sub").wrapAll("<div class='allSubs allSubsLeft'/>");
  $("#right_content .sub").wrapAll("<div class='allSubs allSubsRight'/>");
  $("#left_content").css("padding-bottom", "+=" + $(".allSubsLeft").height() + "px");
  $("#right_content").css("padding-bottom", "+=" + $(".allSubsRight").height() + "px");
  

  $(".sub > h1").click(function(){
    $(this).parent().toggleClass("divVisible");
    $(this).siblings().toggle();

    //loadImg(currentImg);
    if ($(this).parent().data("alttitle") == ""){
      next();  
    }
    else {
      var altTitle = $(this).parent().data("alttitle");
      var title = $(this).text();
      $(this).parent().data("alttitle", title);
      $(this).text(altTitle);
    };
  });  
  /*$(".sub > h1").hover(function(){
    if ($(this).hasClass("visible")==false){
      $(this).siblings().toggleClass('visHover');
    }
  });*/
  $("a#photo").click(function(){
    $(".activeMenu").removeClass("activeMenu");
    $(this).addClass("activeMenu");
    $("#img_container").show();
    $("#video_container").hide();
    $("#vNav").hide();
    $("#nav").show();
  });
  $("a#video").click(function(){
    $(".activeMenu").removeClass("activeMenu");
    $(this).addClass("activeMenu");
    $("#img_container").hide();
    $("#video_container").show();
    $("#nav").hide();
    $("#vNav").show();
  });

  

  if($("a#photo").length > 0){
    $("#img").show( function(){loadImg(1)});
  }
  else {
    $("#video_container").fadeIn();
    $("a#video").addClass("activeMenu");
  };
  loadVid(1);
});


function nextImg(){
  var count = parseInt($(".count").text());
  var num = parseInt($(".num").text());
  if(num < count){  
    num ++;
  }
  else {
    num = 1;
  };
  $(".num").text(num);
  loadImg(num);
}

function prevImg(){
  var count = parseInt($(".count").text());
  var num = parseInt($(".num").text());
  if(num > 1){  
    num --;
    
  }
  else {
    num = count;
  };
  $(".num").text(num);
  loadImg(num);
}

function loadImg(id){  
  $(".show").addClass("hide").removeClass("show");
  $("p.desc").addClass("hideP");
  /*var imgTop = $("#content").css("height");
  var imgHeight;
  $("#mediaContainer").css("top", imgTop);
  */
  $(".hide").fadeOut(0).removeClass('hide');
  //$(".hideP").fadeOut().removeClass('hideP');
  $("div#img"+id).addClass("show").fadeIn(300, function(){
    //imgHeight=$("div#img"+id+" > img").css("height");
    $("div#img"+id+">p.desc").show(1);
  });
  currentImg = id;
  
}

function nextVid(){
  var count = parseInt($(".vCount").text());
  var num = parseInt($(".vNum").text());
  if(num < count){  
    num ++;
    
  }
  else {
    num = 1;
  };
  $(".vNum").text(num);
  loadVid(num);
}

function prevVid(){
  var count = parseInt($(".vCount").text());
  var num = parseInt($(".vNum").text());
  if(num > 1){  
    num --;
    
  }
  else {
    num = count;
  };
  $(".vNum").text(num);
  loadVid(num);
}

function loadVid(id){
  $(".showV").fadeOut().removeClass("showV");
  $("div#vid"+id).addClass("showV").show();
}