
$(function(){
    //待办
    $.post(
        '/home/todo',
        function(data){
            var json = eval('('+data+')');
            if (json.redescr != null)
                errorPrint(json);

            var tags = "";
            var count = json.count;
            for (var p in json.data){
                var jObj = json.data[p];
                var tableName = jObj.YWMC;
                var JLNM = jObj.JLNM;    //记录内码
                var hjmc = jObj.HJMC;    //环节名称
                var ywmc = jObj.YWMS;    //业务名称

                var wjbt = jObj.WJBT;    //文件标题
                var YHZHXM = jObj.YHZHXM;    //接收用户姓名
                var djsj = jObj.DJSJ.substr(0,10);        //时间
                var tag = '<li class="ct2-itm">' +
                    ' <a href="#" class="elps a1" title="【' +hjmc + '】' + wjbt + '(' + YHZHXM + ' ' + djsj + ')"'
                    +' onclick=operate("'+JLNM+'","'+tableName+'") >' +
                    ' <div class="float-right">' +
                    ' <span>' + YHZHXM + ' '+ djsj + '</span> ' +
                    ' </div>' +
                    ' <div class="ct2-itm-ovh">' +
                    ' <span class="icon5"></span>' +
                    ' <span class="b">' + '【' + ywmc + '】' + '</span>' + wjbt  + ' ' +
                    ' </div>' +
                    ' </a>' +
                    ' </li>';
                tags += tag;
            }
            $("#todoUl").append(tags);
            $("#todoNum").html(count);
        }
    );

    //待阅事宜
    $.post(
        '/home/dysy',
        function(data){
            var json = eval('('+data+')');
            if (json.redescr != null)
                errorPrint(json);

            var tags = "";
            var count1 = json.count;
            var count2 = 0;
            for (var p in json.data){
                var jObj = json.data[p];
                var tableName = jObj.YWMC;
                var JLNM = jObj.JLNM;    //记录内码
                var hjmc = jObj.HJMC;    //环节名称
                var ywmc = jObj.YWMS;    //业务名称
                var wjbt = jObj.WJBT;    //文件标题
                var YHZHXM = jObj.YHZHXM;    //接收用户姓名
                var djsj = jObj.DJSJ.substr(0,10);        //时间
                var tag = '<li class="ct2-itm">' +
                    ' <a href="#" class="elps a1" title="【' +hjmc + '】' + wjbt + '(' + YHZHXM + ' ' + djsj + ')"'
                    +' onclick=operate("'+JLNM+'","'+tableName+'") >' +
                    ' <div class="float-right">' +
                    ' <span>' + YHZHXM + ' '+ djsj + '</span> ' +
                    ' </div>' +
                    ' <div class="ct2-itm-ovh">' +
                    ' <span class="icon5"></span>' +
                    ' <span class="b">' + '【' + ywmc + '】' + '</span>' + wjbt  + ' ' +
                    ' </div>' +
                    ' </a>' +
                    ' </li>';
                tags += tag;
            }

            //未读邮件  ../email/emailContent/toPage?yjnm='+jObj.YJNM+'&type=yjjs
            $.post(
                '/home/wdyj',
                function(data){
                    var json = eval('('+data+')');
                    if (json.redescr != null)
                        errorPrint(json);

                    //var tags = "";
                    count2 = json.count;
                    for (var p in json.data){
                        var jObj = json.data[p];
                        var wjbt = jObj.YJBT;    //邮件标题
                        var djsj = jObj.DJSJ.substr(0,10); //发件时间
                        var fsxm = jObj.FSXM;    //发件人姓名
                        var tag = '<li class="ct2-itm">' +
                            ' <a href="#" class="elps a1" title="【未读邮件】' + wjbt + '(' + fsxm + ' ' + djsj + ')'
                            +'" onclick=openForm("../email/index") >' +
                            ' <div class="float-right">' +
                            ' <span>' + fsxm + ' '+ djsj + '</span> ' +
                            ' </div>' +
                            ' <div class="ct2-itm-ovh">' +
                            ' <span class="icon5"></span>' +
                            ' <span class="b">' + '【未读邮件】' + '</span>' + wjbt  + ' ' +
                            ' </div>' +
                            ' </a>' +
                            ' </li>';
                        tags += tag;
                    }
                    $("#dysyNum").html(parseInt(count1)+parseInt(count2));
                    $("#dysy").append(tags);
                }
            );
        }
    );

    //通知公告
    $.post(
        '/home/tzgg',
        function(data){
            var json = eval('('+data+')');
            if (json.redescr != null)
                errorPrint(json);

            var tags = "";
            var count = json.count;
            for (var p in json.data){
                var jObj = json.data[p];
                var tableName = jObj.S_YWMC;
                var JLNM = jObj.S_NBBM;    //记录内码
                var wjbt = String(jObj.WJBT);    //文件标题
                var djsj = jObj.SQSJ.substr(0,10);        //申请时间
                var tag = '<li class="ct2-itm">' +
                    ' <a href="#" class="elps a1" title="' + wjbt + '('  + djsj + ')'
                    +'" onclick=operate("'+JLNM+'","'+tableName+'") >' +
                    ' <div class="float-right">' +
                    ' <span>' + djsj + '</span> ' +
                    ' </div>' +
                    ' <div class="ct2-itm-ovh">' +
                    ' <span class="icon5"></span>'
                    + wjbt +
                    ' </div>' +
                    ' </a>' +
                    ' </li>';
                tags += tag;
            }
            $("#tzggNum").html(parseInt(count) > 0 ? count : '0');
            $("#tzgg").append(tags);
        }
    );

    //校内公文
    $.post(
        '/home/xngw',
        function(data){
            var json = eval('('+data+')');
            if (json.redescr != null)
                errorPrint(json);

            var tags = "";
            var count = json.count;
            for (var p in json.data){
                var jObj = json.data[p];
                var tableName = jObj.YWMC;
                var JLNM = jObj.JLNM;    //记录内码
                var wjbt = jObj.WJBT;    //文件标题
                var djsj = jObj.DJSJ.substr(0,10);        //申请时间
                var tag = '<li class="ct2-itm">' +
                    ' <a href="#" class="elps a1" title="' + wjbt + '('  + djsj + ')'
                    +'" onclick=operate("'+JLNM+'","'+tableName+'") >' +
                    ' <div class="float-right">' +
                    ' <span>' + djsj + '</span> ' +
                    ' </div>' +
                    ' <div class="ct2-itm-ovh">' +
                    ' <span class="icon5"></span>'
                    + wjbt +
                    ' </div>' +
                    ' </a>' +
                    ' </li>';
                tags += tag;
            }
            $("#xngwNum").html(parseInt(count) > 0 ? count : '0');
            $("#xngw").append(tags);
        }
    );
});

function  operate(jlnm,tableName) {
    //判断权限
    if (!isHavePermission('EDIT', jlnm,tableName)) {
        return false;
    }
    //打开修改界面
    openForm('/page/toAddOrUpdatePage?JLNM=' + jlnm+"&tableName="+tableName, '');
}

//判断权限
function isHavePermission(CZFL, jlnm,tableName) {
    var bol = true;
    $.ajax({
        type: "POST",
        async: false,
        url: "/common/getOperatePermission",
        data:{CZFL:CZFL,JLNM:jlnm},
        success: function (result) {
            var json = eval("("+result+")");
            if (json.recode != null)
                return errorPrint(json);
            if (json.result == '0'){
                //打开只读界面
                openForm('/page/toSeePage?JLNM=' + jlnm+"&tableName="+tableName, '');
                bol = false;
            }
        }
    });
    return bol;
}


