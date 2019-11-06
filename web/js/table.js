$(function () {
    var $trs = $(".trs>tr");  //选择所有行
    $trs.filter(":odd").addClass("odd");  //给奇数行添加odd样式
    $trs.filter(":even").addClass("even"); //给偶数行添加odd样式

    //点击行,添加变色样式
    $trs.click(function (e) {
        $(this).addClass("selected")
        .siblings().removeClass("selected");

        $(this).find("input[type=radio]").attr("checked", "true");

        if ($(this).find("input[type=checkbox]").val() == null) {
            $("img").hide("fast");
            $(this).find('img').show("fast");
        }
        else {
            if ($(this).find("input[type=checkbox]").attr("checked") == true) {
                $(this).find("input[type=checkbox]").attr("checked", false);
                $(this).find('img').hide("fast");
            }
            else {
                $(this).find("input[type=checkbox]").attr("checked", true);
                $(this).find('img').show("fast");
            }
        }
    })
})