

$(document).ready(function(){
  $("#mediaUpload").click(function(){
    $("#uploadContainer").toggle();
  });
  $("#mediaVideo").click(function(){
    $("#videoContainer").toggle();
  });
  $("#mediaEdit").click(function(){
    $("#mediaEditor").toggle();
  });
  $( "ul, ol" ).sortable();

  $("ul.projectList").on("sortupdate", function(event, ui) {
    var ul = ui.item.parent();
    var dataObj = { };
    ul.children("li").each(function(i) {
      var li = $(this);
      projectId = li.data("projectId");
      dataObj["position" + projectId] = i;
    });
    console.log(dataObj);
    $.ajax({
      url: "/admin/projectsort/" + $("li.selected").data("projectId"),
      type: "post",
      data: dataObj
    }).done(function() {
      location.reload();
    });
  });

  $( "ol.mediaList.mediaImg" ).on("sortupdate", function(event, ui) {
    // console.log(ui.item.data("mediaId"));
    var ul = ui.item.parent();
    var dataObj = { };
    ul.children("li").each(function(i) {
      var li = $(this);
      mediaId = li.data("mediaId");
      dataObj["position" + mediaId] = i;
    });
    $.ajax({
      url: "/admin/imgedit/" + ul.data("projectId"),
      type: "post",
      data: dataObj
    }).done(function() {
      location.reload();
    });
  });
  $( "ol.mediaList.mediaVid" ).on("sortupdate", function(event, ui) {
    // console.log(ui.item.data("mediaId"));
    var ul = ui.item.parent();
    var dataObj = { };
    ul.children("li").each(function(i) {
      var li = $(this);
      mediaId = li.data("mediaId");
      dataObj["position" + mediaId] = i;
    });
    $.ajax({
      url: "/admin/videdit/" + ul.data("projectId"),
      type: "post",
      data: dataObj
    }).done(function() {
      location.reload();
    });
  });
  $( "ul, ol" ).disableSelection();
  $(".draggable").draggable();
  $("#info > img").click(function(){
    $("#infoBox").toggle();
  });

});

function checkWhichArea(area){

  var thisArea = $("textarea:focus").attr("id");
  if (thisArea == undefined){
    alert("No textarea selected.");
  }
  else {
    insertAtCaret(thisArea, "\n<div class='sub' markdown='1' data-alttitle='ALT-TITLE'>\n<h1>TITLE</h1> \n<span>CONTENT here ...</span>\n</div>\n");
    return false;
  }
}

function insertAtCaret(areaId,text) {
    var txtarea = document.getElementById(areaId);
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
      "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") { 
      txtarea.focus();
      var range = document.selection.createRange();
      range.moveStart ('character', -txtarea.value.length);
      strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0,strPos);  
    var back = (txtarea.value).substring(strPos,txtarea.value.length); 
    txtarea.value=front+text+back;
    strPos = strPos + text.length;
    if (br == "ie") { 
      txtarea.focus();
      var range = document.selection.createRange();
      range.moveStart ('character', -txtarea.value.length);
      range.moveStart ('character', strPos);
      range.moveEnd ('character', 0);
      range.select();
    }
    else if (br == "ff") {
      txtarea.selectionStart = strPos;
      txtarea.selectionEnd = strPos;
      txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}
