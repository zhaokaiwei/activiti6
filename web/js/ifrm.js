//为所有的tr定义事件
function init(){
    if ($('.tb1')[0]) { //数据列表事件
        var tr = $('.page_content tr');
        var old_bk_c = "#fff";
        tr.mouseover(function () {
            old_bk_c = $(this).css('background-color');
            $(this).css('background-color', '#FFF4F4');
        });
        tr.mouseout(function () {
            if ((old_bk_c != null ? old_bk_c.toLocaleLowerCase() : "#fff") == '#fff')
                $(this).css('background-color', '#FFF');
            else
                $(this).css('background-color', old_bk_c);
        });
        tr.click(function () {
            if ($(this).find(":checkbox").val() == null) {

                //                    $(this).find(":radio").attr("checked", "checked");

                if ($(this).find(":radio[name='guid']").length > 0) {
                    $(this).find(":radio[name='guid']")[0].checked = true;
                }
                if ($(this).find(":radio[name='YHZH']").length > 0) {
                    $(this).find(":radio[name='YHZH']")[0].checked = true;
                }
                $("table img").hide("fast");
                $(this).find('img').show("fast");
            } else {
                if ($(this).find(":checkbox").length > 0) {
                    var ck = $(this).find(":checkbox")[0];

                    if (ck.checked == true) {
                        if (ck.id.indexOf("checkAll") != -1) {
                            tr.find(":checkbox").prop("checked", false);
                            tr.find("img").prop("src", "../../images/view/iconTask0.gif");
                        } else {
                            ck.checked = false;
                            $(this).find("img").prop("src", "../../images/view/iconTask0.gif");
                        }
                    } else {
                        if (ck.id.indexOf("checkAll") != -1) {
                            tr.find(":checkbox").prop("checked", true);
                            tr.find("img").prop("src", "../../images/view/iconTask.gif");
                        } else {
                            ck.checked = true;
                            $(this).find("img").prop("src", "../../images/view/iconTask.gif");
                        }
                    }

//                    if ($(this).find(":checkbox")[0].checked == true) {
//                        $(this).find(":checkbox")[0].checked = false;
//                        $(this).find("img").hide("fast");
//                    } else {
//                        $(this).find(":checkbox")[0].checked = true;
//                        $(this).find('img').show("fast");
//                    }
                }
            }
        });

        if ($('#hid_odby')[0]) {
            var odby = $('#hid_odby').val();
            $(".th2 span").each(function () {
                if (odby.indexOf($(this).prop('class')) != -1) { //存在排序字段
                    if (odby.indexOf("asc") != -1) {
                        $(this).addClass("t-up");
//                        $(this).html("↑");
                    } else {
                        $(this).addClass("t-down");
//                        $(this).html("↓");
                    }
                }
            });
        }
    }

    if ($('.cth')[0]) { //首页高宽
        ch();
        $(window).resize(function () {
            ch();
        });
    }

}

//排序查询
function odby_click(obj, odbyid) {
    //↑↓
    var thodby = $(obj).parent().find("span");
    var thodby_old = thodby.prop("class"); //保存状态
    $(".th2 span").removeClass("t-up").removeClass("t-down"); //清空状态
    if (thodby_old.indexOf("t-down") != -1) {
        $("#hid_odby").val(odbyid + " asc");
        thodby.addClass("t-up");
    } else if (thodby_old.indexOf("t-up") != -1) {
        $("#hid_odby").val(odbyid + " desc");
        thodby.addClass("t-down");
    } else {
        $("#hid_odby").val(odbyid + " desc");
        thodby.addClass("t-down");
    }
    $("#search").click();
    return false;
}  

function ch() {
    $('.cth').height(($(window).innerHeight() - 150) / 2);
    $('.cth3').height(($(window).innerHeight() - 217) / 3);
}

function help_onclick(pagname) {
    pagname = pagname.toUpperCase();
    window.open('../../home/help/' + pagname, "", 'width=700,height=600,toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no');
}

//字符串全替换
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}
        
