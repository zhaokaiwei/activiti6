
///-------------------------------------------------------------------------
//jQuery弹出窗口 By Await [2010-08-12]
//--------------------------------------------------------------------------
/*参数：[可选参数在调用时可写可不写,其他为必写]
----------------------------------------------------------------------------
title:	窗口标题
content:  内容(可选内容为){ text | id | img | url | iframe }
width:	内容宽度
height:	内容高度
drag:  是否可以拖动(ture为是,false为否)
time:	自动关闭等待的时间，为空是则不自动关闭
showbg:	[可选参数]设置是否显示遮罩层(0为不显示,1为显示)
cssName:  [可选参数]附加class名称
------------------------------------------------------------------------*/
//示例:
//------------------------------------------------------------------------
//tipsWindown("例子","text:例子","500","400","true","3000","0","exa")
//------------------------------------------------------------------------
var showWindown = true;
var templateSrc = ""; //设置loading.gif路径
function tipsWindown(title, content, width, height, drag, time, showbg, cssName) {
    var sfjb=cssName=="jbyj"?"j-":"";
    $("#windown-box").remove(); //请除内容
    //	var width = width >= 1024 ? this.width = 1024 : this.width = width;     //设置最大窗口宽度
    //	var height = height >= 768 ? this.height = 768 : this.height = height;  //设置最大窗口高度
    if (showWindown == true) {
        if(cssName=='jbyj'){
            var simpleWindown_html = new String;
            simpleWindown_html = "<div id=\"j-windownbg\" style=\"background-color: white;width: 100%;position: absolute;top: 0px;left: 0px;height:" + $(document).height() + "px;;filter:alpha(opacity=0);opacity:1;z-index: 9999901\"><iframe style=\"width:100%;height:100%;border:none;filter:alpha(opacity=0);opacity:0;\"></iframe></div>";
            simpleWindown_html += "<div id=\"j-windown-box\" style='position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;z-index:9999999 '>";
            simpleWindown_html += "<div id=\"j-windown-title\"><h2 style=\"\"></h2><span id=\"j-windown-close2\" class=\"windown-close\">关闭</span></div>";
            simpleWindown_html += "<div id=\"windown-content-border\"><div id=\"j-windown-content\"></div></div>";
            simpleWindown_html += "</div>";
            $("body").append(simpleWindown_html);
        }else{
            var simpleWindown_html = new String;
            simpleWindown_html = "<div id=\"windownbg\" style=\"height:" + $(document).height() + "px;;filter:alpha(opacity=0);opacity:0;z-index: 999901\"><iframe style=\"width:100%;height:100%;border:none;filter:alpha(opacity=0);opacity:0;\"></iframe></div>";
            simpleWindown_html += "<div id=\"windown-box\">";
            simpleWindown_html += "<div id=\"windown-title\"><h2 style=\"\"></h2><span id=\"windown-close2\" class=\"windown-close\">关闭</span></div>";
            simpleWindown_html += "<div id=\"windown-content-border\"><div id=\"windown-content\"></div></div>";
            simpleWindown_html += "</div>";
            $("body").append(simpleWindown_html);
        }
        show = false;
    }

    contentType = content.substring(0, content.indexOf(":"));
    content = content.substring(content.indexOf(":") + 1, content.length);
    switch (contentType) {
        case "text":
            $("#windown-content").html(content);
            break;
        case "id":
            $("#windown-content").html($("#" + content + "").html());
            break;
        case "img":
            $("#windown-content").ajaxStart(function () {
                $(this).html("<img src=" + templateSrc + "'/images/DivLayer/loading.gif' class='loading' />");
            });
            $.ajax({
                error: function () {
                    $("#windown-content").html("<p class='windown-error'>加载数据出错...</p>");
                },
                success: function (html) {
                    $("#windown-content").html("<img src=" + content + " alt='' />");
                }
            });
            break;
        case "url":
            var content_array = content.split("?");
            $("#windown-content").ajaxStart(function () {

                $(this).html("<img src=" + templateSrc + "'/images/DivLayer/loading.gif' class='loading' />");
            });
            $.ajax({
                type: content_array[0],
                url: content_array[1],
                data: content_array[2],
                cache: false,
                error: function () {
                    $("#windown-content").html("<p class='windown-error'>加载数据出错...</p>");
                },
                success: function (html) {
                    $("#windown-content").html(html);
                }
            });
            break;
        case "iframe":
            $("#windown-content").ajaxStart(function () {
                $(this).html("<img src=" + templateSrc + "'/images/DivLayer/loading.gif' class='loading' />");
            });
            $.ajax({
                error: function () {
                    $("#"+sfjb+"windown-content").html("<p class='windown-error'>加载数据出错...</p>");
                },
                success: function (html) {
                    $("#"+sfjb+"windown-content").html("<iframe  style=\" margin:0\"  width=\"100%\" height=\"" + parseInt(height - 5) + "px" + "\" scrolling=\"auto\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\" src=\"" + content + "\"></iframe>");
                }
            });
    }
    $("#"+sfjb+"windown-title h2").html(title);
    if (showbg == "true") { $("#windownbg").show(); } else { $("#windownbg").remove(); };
    $("#windownbg").animate({ opacity: "0.5" }, "normal"); //设置透明度
    $("#windown-box").show();
    if (height == 0) {
        $("#windown-title").css({ width: (parseInt(width) + 10) + "px" });
        $("#windown-content").css({ width: width + "px" });
    } else if (height >= 527) {
        $("#windown-title").css({ width: (parseInt(width) + 22) + "px" });
        $("#windown-content").css({ width: (parseInt(width) + 17) + "px", height: height + "px" });
    } else {
        $("#windown-title").css({ width: (parseInt(width)) + "px" });
        $("#windown-content").css({ width: width + "px", height: height + "px" });
    }

    var cw, ch, est = document.documentElement.scrollTop; //窗口的高和宽
    //取得窗口的高和宽
    if (self.innerHeight) {
        cw = self.innerWidth;
        ch = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
        cw = document.documentElement.clientWidth;
        ch = document.documentElement.clientHeight;
    } else if (document.body) {
        cw = document.body.clientWidth;
        ch = document.body.clientHeight;
    }
    var isIE6 = false;
    if (height == 0) height = 460;
    if (isIE6) {
        $("#windown-box").css({ left: "50%", top: (parseInt((ch) / 2) + est) + "px", marginTop: -((parseInt(height) + 53) / 2) + "px", marginLeft: -((parseInt(width) + 32) / 2) + "px", zIndex: "999999" });
    } else {
        $("#windown-box").css({ left: "50%", top: "50%", marginTop: -((parseInt(height) + 53) / 2) + "px", marginLeft: -((parseInt(width) + 32) / 2) + "px", zIndex: "999999" });
    };
    var Drag_ID = document.getElementById(sfjb+"windown-box"), DragHead = document.getElementById(sfjb+"windown-title");

    var moveX = 0, moveY = 0, moveTop, moveLeft = 0, moveable = false;
    if (isIE6) {
        moveTop = est;
    } else {
        moveTop = 0;
    }
    var sw = Drag_ID.scrollWidth, sh = Drag_ID.scrollHeight;
    DragHead.onmouseover = function (e) {
        if (drag == "true") { DragHead.style.cursor = "move"; } else { DragHead.style.cursor = "default"; }
    };
    DragHead.onmousedown = function (e) {
        //		$("#windown-box").css({opacity:"0.5"},"normal");
        if (drag == "true") { moveable = true; } else { moveable = false; }
        e = window.event ? window.event : e;
        var ol = Drag_ID.offsetLeft, ot = Drag_ID.offsetTop - moveTop;
        moveX = e.clientX - ol;
        moveY = e.clientY - ot;
        document.onmousemove = function (e) {
            if (moveable) {

                e = window.event ? window.event : e;
                var x = e.clientX - moveX;
                var y = e.clientY - moveY;
                if (x > 0 && (x + sw < cw) && y > 0 && (y + sh < ch)) {
                    Drag_ID.style.left = x + "px";
                    Drag_ID.style.top = parseInt(y + moveTop) + "px";
                    Drag_ID.style.margin = "auto";
                }
            }
        }
        document.onmouseup = function () { moveable = false; $("#windown-box").css({ opacity: "1" }, "normal"); };
        Drag_ID.onselectstart = function (e) { return false; }
    }
    $("#windown-content").attr("class", "windown-" + cssName);
    var closeWindown = function () {
        $("#windownbg").remove();
        $("#windown-box").fadeOut("slow", function () { $(this).remove(); });
    }
    if (time == "" || typeof (time) == "undefined") {
        $(".windown-close").click(function () {
            var sfjb=cssName=="jbyj"?"j-":"";
            $("#"+sfjb+"windownbg").remove();
            $("#"+sfjb+"windown-box").fadeOut("slow", function () { $(this).remove(); });
        });
    } else {
        setTimeout(closeWindown, time);
    }
}


function closeTipsWindown() {
    $("#windownbg").remove();
    $("#windown-box").fadeOut("slow", function () { $(this).remove(); });
}