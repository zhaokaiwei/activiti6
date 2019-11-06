//判断opener页面地址
function pdfurl(winObj){
    var fym= winObj == null ? window.opener : winObj;
    if(fym==null || fym.closed == true){
        return false;
    }
    var opu=fym.document.URL;
    if(opu.indexOf("indexNew")>0){
        return true;
    }
    return false;
}

function help_onclick(pagname) {
    pagname = pagname.toUpperCase();
    window.open('../../home/help/' + pagname, "", 'width=700,height=600,toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no');
}

function openForm(url, name) {
    window.open(url, name, 'left=0,top=0,width=' + (screen.availWidth - 10) + ',height=' + (screen.availHeight - 55) + ',toolbar=no, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes');
}

function formSubmit(url, type) {
    var form = document.getElementById("list_form");
    form.action = url;
    if (type != undefined)
        form.method = type;
    else
        form.method = "post";
    form.submit();
}

/**
 * 实现select标签数据的移动
 * @param {String} leftselectId     左侧结构id
 * @param {String} rightselectId    右侧结构id
 * @param {String} addId            新增按钮id
 * @param {String} addallId         全部按钮id
 * @param {String} delId            删除按钮id
 * @param {String} delallId         全删按钮id
 */
function selectoption(leftselectId, rightselectId, addId, addallId, delId, delallId) {
    //左边列表的点击事件
    $('#' + leftselectId + '').dblclick(function () {
        //获得选中的数据，单条插入右侧列表
        var optionval = $(this).val();
        var optiontext = $(this).find("option:selected").text();
        if (optionval == "" || optiontext == "") {
            return;
        }
        $("#" + leftselectId + " option:selected").each(function () {
            $("#" + rightselectId + " option").each(function () {
                if ($(this).val() == optionval) {
                    $(this).remove();
                    return;
                }
            });


            $("<option title='"+$(this).attr("title")+"' value='" + $(this).val() + "' selected>" + $(this).text() + "</option>").appendTo(
                "#" + rightselectId + "");
            $(this).remove();
        });
        // $("#" + rightselectId + "").append("<option value='" + optionval + "' selected>" + optiontext + "</option>"); //添加一项option
        // $(this).find("option:selected").remove();　
    });
    //添加按钮事件
    $("#" + addId + "").click(function () {
        //将数据遍历移入右边列表
        $("#" + leftselectId + " option:selected").each(function () {
            var optionval = $(this).val();

            $("#" + rightselectId + " option").each(function () {
                if ($(this).val() == optionval) {
                    $(this).remove();
                    return;
                }
            });

            $("#" + rightselectId + "").append("<option title='"+$(this).attr("title")+"' value='" + $(this).val() + "' selected>" + $(this).text() + "</option>");
            $(this).remove();
        });
    });
    //添加按钮事件
    $("#" + addallId + "").click(function () {
        // //将数据遍历移入右边列表




        $("#" + leftselectId + " option").each(function () {


            var optionval = $(this).val();

            $("#" + rightselectId + " option").each(function () {
                if ($(this).val() == optionval) {
                    $(this).remove();
                }
            });

            $("<option title='"+$(this).attr("title")+"' value='" + $(this).val() + "' selected>" + $(this).text() + "</option>").appendTo(
                "#" + rightselectId + "");
            $(this).remove();
        });
    });



    //右边列表的点击事件
    $("#" + rightselectId + "").dblclick(function () {
        //获得选中的数据，单条插入右侧列表
        var optionval = $(this).val();
        var optiontext = $(this).find("option:selected").text();
        if (optionval == "" || optiontext == "") {
            return;
        }

        $("#" + leftselectId + " option").each(function () {
            if ($(this).val() == optionval) {
                $(this).remove();
                return;
            }
        });


        $("#" + rightselectId + " option:selected").each(function () {
            $("<option title='"+$(this).attr("title")+"' value='" + $(this).val() + "' selected>" + $(this).text() + "</option>").appendTo(
                "#" + leftselectId + "");
            $(this).remove();
        });

        // $("#" + leftselectId + "").append("<option value='" + optionval + "' selected>" + optiontext + "</option>"); //添加一项option
        // $(this).find("option:selected").remove();　
    });
    //添加按钮事件
    $("#" + delId + "").click(function () {
        //将数据遍历移入左边列表


        var optionval = $(this).val();
        $("#" + leftselectId + " option").each(function () {
            if ($(this).val() == optionval) {
                $(this).remove();
                return;
            }
        });


        $("#" + rightselectId + " option:selected").each(function () {
            $("#" + leftselectId + "").append("<option title='"+$(this).attr("title")+"' value='" + $(this).val() + "' selected>" + $(this).text() + "</option>");
            $(this).remove();
        });
    });
    $("#" + delallId + "").click(function () {
        //将数据遍历移入左边列表



        $("#" + rightselectId + " option").each(function () {


            var optionval = $(this).val();
            $("#" + leftselectId + " option").each(function () {
                if ($(this).val() == optionval) {
                    $(this).remove();
                }
            });

            $("<option title='"+$(this).attr("title")+"' value='" + $(this).val() + "' selected>" + $(this).text() + "</option>").appendTo(
                "#" + leftselectId + "");
            $(this).remove();
        });
    });
}

/**
 *
 * @param {List} columns 列配置项，详情请查看 列参数 表格.
 * @param {String} TableName 查询表名
 * @param {String} zdmc 查询字段
 */
function loadpageoptionTable(columns, TableName, zdmc,cxtj) {
    var option = {
        //url: 'http://47.96.11.170:808/ClxServer/getdataserver',
        url: '/businesslist',
        method: 'post',
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        ajaxOptions: {},
        toolbar: '#toolbar',                //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        singleSelect: true,                 //默认false，设为true则允许复选框仅选择一行
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        //strictSearch: true,
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        columns: columns,                   //加载列配置
        queryParams: function (params) {    //传递参数（*）
            var requestData = {
                "TableName": TableName,     //
                "zdmc": zdmc,               //
                "dqys": params.offset / params.limit + 1 + '',
                "myhs": params.limit + '',
                "cxtj": cxtj
            };
            return requestData;
        },
        responseHandler: function (res) {       //返回数据
            var data = jsonValuesDecode(res.data);
            return {
                "total": data.count,            //总行数
                "rows": data.data               //数据
            };
        },
        onLoadSuccess: function () {            //加载成功时执行
        },
        onLoadError: function (status) {        //加载失败时执行
        }
    }
    return option;
}

//关闭页面
function wclose() {
    window.opener = null;
    window.open("", "_self");
    window.close();
}

//返回跳转页面
function SetUrlBack(url) {
    if (url == "reload") {
        window.location.href = window.location.href;
        window.location.reload;
    } else {
        window.location.href = url;
    }
}

function openerReload() {
    try {
        window.opener.location.href = window.opener.location.href; 
        window.opener.location.reload(); 
    } catch (err) { };
}

/**IE版本**/
function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6; //IE版本<=7
        }
    } else if (isEdge) {
        return 'edge'; //edge
    } else if (isIE11) {
        return 11; //IE11  
    } else {
        return -1; //不是ie浏览器
    }
} 

/**iframe高度自适应**/
//兼容IE和FF
function setIframeHeight(iframeId) {
    var iframe = document.getElementById(iframeId); //iframe id   
    if (document.getElementById) {
        if (iframe && !window.opera) {
            if (iframe.contentDocument && iframe.contentDocument.body.offsetHeight) {
                iframe.height = iframe.contentDocument.body.offsetHeight;
            } else if (iframe.Document && iframe.Document.body.scrollHeight) {
                iframe.height = iframe.Document.body.scrollHeight;
            }
        }
    }
}

//对多位小数进行四舍五入
//num是要处理的数字  v为要保留的小数位数
function decimal(num, v) {
    var vv = Math.pow(10, v);
    return Math.round(num * vv) / vv;
}

//金额转大写
function chineseNumber(num) {
    if (isNaN(num) || num > Math.pow(10, 12)) return "金额有误"
    var cn = "零壹贰叁肆伍陆柒捌玖"
    var unit = new Array("拾佰仟", "分角")
    var unit1 = new Array("万亿", "")
    var numArray = num.toString().split(".")
    var start = new Array(numArray[0].length - 1, 2)
    function toChinese(num, index) {
        var num = num.replace(/\d/g, function ($1) {
            return cn.charAt($1) + unit[index].charAt(start-- % 4 ? start % 4 : -1)
        })
        return num
    }
    for (var i = 0; i < numArray.length; i++) {
        var tmp = ""
        for (var j = 0; j * 4 < numArray[i].length; j++) {
            var strIndex = numArray[i].length - (j + 1) * 4
            var str = numArray[i].substring(strIndex, strIndex + 4)
            var start = i ? 2 : str.length - 1
            var tmp1 = toChinese(str, i)
            tmp1 = tmp1.replace(/(零.)+/g, "零").replace(/零+$/, "")
            //tmp1 = tmp1.replace(/^壹拾/, "拾")
            tmp = (tmp1 + unit1[i].charAt(j - 1)) + tmp
        }
        numArray[i] = tmp
    }
    numArray[1] = numArray[1] ? numArray[1] : ""
    numArray[0] = numArray[0] ? numArray[0] + "元" : numArray[0], numArray[1] = numArray[1].replace(/^零+/, "")
    numArray[1] = numArray[1].match(/分/) ? numArray[1] : numArray[1] + "整"
    return numArray[0] + numArray[1]
}

//金额统计
function MoneySum(moneylist) {
    var sum = 0;
    var reg = /^(([1-9]\d*)|\d)(\.\d{1,2})?$/;
    for (var i = 0; i < moneylist.length; i++) {
        if (reg.test(moneylist[i].value)) sum += Number(moneylist[i].value);
    }
    return Number(sum).toFixed(2);
}

//加载层
function load_div_mask() {
    if (!$("#div_mask")[0]) {
        var div_mask_html = new String;
        div_mask_html += "<div id='div_mask' style='position:absolute; top:0; left:0; right:0; bottom:0; background-color:#000; opacity:0.5; -moz-opacity:0.5; filter:alpha(opacity=50); z-index:99999;' >";
        div_mask_html += "<div style='position:absolute; top:40%; left:50%; width:200px; margin-left:-100px; text-align:center;'>";
        div_mask_html += "<img src='../../images/loading.gif' /><br /><span style='color:#fff;'>正在加载数据...</span>";
        div_mask_html += "</div>";
        div_mask_html += "</div>";
        $("body").append(div_mask_html);
    }
}
function close_div_mask() {
    $("#div_mask").remove();
}

//把date转化成指定pattern的字符串时间，date可为date对象，也可为字符串
function getFormatTime(date,pattern){
    if (date instanceof Date)
        return date.Format(pattern);
    if (date instanceof String){
        if (date) {         //把yyyy-MM-dd hh:mm:ss转成指定pattern的字符串
            var arr1 = date.split(" ");
            var sdate = arr1[0].split('-');
            var time = new Date(sdate[0], sdate[1]-1, sdate[2]);
            return time.Format(pattern);
        }
    }
        return new Date().setTime()
}

//---------------------------------------------------
// 日期格式化
// 格式 YYYY/yyyy/YY/yy 表示年份
// MM/M 月份
// W/w 星期
// dd/DD/d/D 日期
// hh/HH/h/H 时间
// mm/m 分钟
// ss/SS/s/S 秒
//---------------------------------------------------
Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
    str = str.replace(/MM/, this.getMonth() > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
    str = str.replace(/M/g, (this.getMonth()+1));
    str = str.replace(/w|W/g, Week[this.getDay()]);
    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());
    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());
    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());
    return str;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18

Date.prototype.Format2 = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Date.prototype.TimeInterval = function () {
    var hour = this.getHours();
    if (hour < 6) { return "凌晨"; }
    else if (hour < 12) { return "上午"; }
    else if (hour < 14) { return "中午"; }
    else if (hour < 18) { return "下午"; }
    else if (hour < 24) { return "晚上"; }
    else { return "夜里"; }

}

//字符串转换成date
$.GetDate = function (str) {
    var dtime = new Date(Date.parse(str.replace(/-/g, "/")));
    return dtime;
}

//多选框绑定数据
$.fn.checkbox = function (valName, isRadio) {
    var obj = $(this); //获取对象
    var id = obj.prop("id");

    var mclist = obj.val().split(",");

    //添加事件
    $("input[name='" + valName + "']").each(function () {
        for (var i = 0; i < mclist.length; i++) {
            if (mclist[i] == $(this).val()) {
                $(this).prop("checked", "true"); //加载选择
            }
        }
    });

    $("input[name='" + valName + "']").change(function () {
        var ckval = "";
        if (isRadio) {
            var oldck = $(this).prop("checked");
            $("input[name='" + valName + "']").prop("checked", false);
            if (oldck == true)
                $(this).prop("checked", true); //单选
        }
        $("input[name='" + valName + "']:checked").each(function () {
            ckval += (ckval ? "," : "") + this.value;
        });
        $("#" + id).val(ckval); //赋值
    });
}

//下拉可输入
$.fn.selectbox = function () {
    //用变量idm存储select的id或name
    var idm = $(this).prop("id") || $(this).prop("name");

    if ($("#" + idm + "div").length <= 0) {//判断动态创建的div是否已经存在，如果不存在则创建
        var divHtml = "<div style='display:none' id='" + idm + "div'><input name='' type='text' id='" + idm + "inputText' class='ipt1' /></div>";
        $(this).prop("tabindex", -1).after(divHtml);
        $("#" + idm + "div").css({ "position": "absolute", "top": $(this).position().top + 1, "left": $(this).position().left + 1 }).show();
        $("#" + idm + "inputText").val($(this).find("option:selected").text()).css({ "width": ($(this).width() - 24) + "px", "height": ($(this).height()) + "px", "line-height": ($(this).height() - 2) + "px", "border": 0 });
        $("#" + idm + "inputText").prop("name", $(this).val());
        //select注册onchange事件
        $(this).change(function () {
            $("#" + idm + "inputText").val($(this).find("option:selected").text());
            $("#" + idm + "inputText").prop("name", $(this).val());
        });
        $("#" + idm + "inputText").change(function () {
            var opval = $(this).val(), optxt = $(this).val();       //获取当前输入的值
            var option = $("<option>").val(opval).text(optxt);      //创建标签
            var opsel = $("#" + idm + " option[value='" + opval + "']");    //获取跟当前值相等的option标签
            if (opsel.length == 0) {        //自己添加新的值，就创建该select的一个附属input标签，用来把添加的参数存到数据库中
                $("#" + idm).append(option);     //如果不存在，就把创建的标签添加到select中中
                if ($("#"+idm+"_select").length == 0){
                    var info = $("#"+idm).attr("info");     //获取select的类别内码和最大的参数编号
                    $("#submitForm").append("<input id='"+idm+"_select' name='option_new' type='hidden' value='"+info+"@'/>");
                }
                $("#"+idm+"_select").val($("#"+idm+"_select").val()+opval+",");
            }

            $("#" + idm).val(opval);

        });
}
    //解决ie6下select浮在div上面的bug
    //                $("#" + idm + "div").bgIframe();
    var res = { "val": $("#" + idm + "inputText").prop("name"), "text": $("#" + idm + "inputText").val() };
    return res;
};

//文本自动高度
(function ($) {
    $.fn.autoTextarea = function (options) {
        var defaults = {
            maxHeight: null, //文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
            minHeight: $(this).height() //默认最小高度，也就是文本框最初的高度，当内容高度小于这个高度的时候，文本以这个高度显示
        };
        var opts = $.extend({}, defaults, options);
        return $(this).each(function () {
            $(this).css("height", $(this).prop("scrollHeight") + "px"); //加载时高度
            $(this).bind("paste cut keydown keyup focus blur", function () {
                var height, style = this.style;
                this.style.height = opts.minHeight + 'px';
                if (this.scrollHeight > opts.minHeight) {
                    if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
                        height = opts.maxHeight;
                        style.overflowY = 'scroll';
                    } else {
                        height = this.scrollHeight;
                        style.overflowY = 'hidden';
                    }
                    style.height = height + 'px';
                }
            });
        });


        //        
        //        $(this).each(function () {
        //            $(this).bind("paste cut keydown keyup focus blur", function () {
        //                $(this).css("height",this.scrollHeight+"px");
        //            });
        //        });

    };
    

})(jQuery);



//ajax请求业务处理
function ajaxrequet(o, servername, infostr) {
    var ajaxoption = {
        type: "post",
        async: false,
        timeout: 10000,
        dataType: 'json',
        url: BASE_URL + servername,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(infostr),
        success: function (data) {

        },
        error: function (err) {}
    };
    ajaxoption = $.extend(ajaxoption, o || {});

    $.ajax(ajaxoption);
}


/**
 * Json对象value解码
 * @param {*} json 
 */
function jsonValuesDecode(json) {
    for (var obj in json) {
        if (json[obj] instanceof Array) {
            var jsonItem = json[obj];
            for (var i = 0; i < jsonItem.length; i++) {
                jsonValuesDecode(jsonItem[i])
            }
            continue;
        } else if (json[obj] instanceof Object) { //内部JsonObject处理
            var jsonobject = json[obj];
            jsonValuesDecode(jsonobject);
            continue;
        }
        json[obj] = b64DecodeUnicode(json[obj]);
    }
    return json;
}
//js base64解码
function b64DecodeUnicode(str) {
    if (str == undefined) {
        str = '';
    }
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

// base64编码
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}
/**
 * Json对象value编码
 * @param {*} json 
 */
function jsonValuesEncode(json) {
    for (var obj in json) {
        if (json[obj] instanceof Array) { //内部JsonArray处理
            var jsonItem = json[obj];
            for (var i = 0; i < jsonItem.length; i++) {
                jsonValuesEncode(jsonItem[i])
            }
            continue;
        } else if (json[obj] instanceof Object) { //内部JsonObject处理
            var jsonobject = json[obj];
            // for (var childrenobj in jsonobject) {
            //     jsonValuesEncode(jsonobject[childrenobj])
            // }
            jsonValuesEncode(jsonobject);
            continue;
        }
        if (json[obj] == undefined) {
            json[obj] = "";
        }
        json[obj] = window.encodeURI(json[obj]);
    }
    return json;
}


//用户信息赋值
function SetUserInfo(data) {
    sessionStorage.setItem("dwnm", data.DWNM);
    sessionStorage.setItem("snum", data.SNUM);
    sessionStorage.setItem("yhnm", data.NBBM);
    sessionStorage.setItem("yhxm", data.YHXM);
    sessionStorage.setItem("bmmc", data.BMMC);
    sessionStorage.setItem("bmnm", data.BMNM);
    sessionStorage.setItem("dlzh", data.DLZH);
    sessionStorage.setItem("lxdh", data.LXDH);
    sessionStorage.setItem("zw", data.ZW);
    sessionStorage.setItem("xb", data.XB);
}

function getIPs(callback) {
    var ip_dups = {};

    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;

    //bypass naive webrtc blocking
    if (!RTCPeerConnection) {
        var iframe = document.createElement('iframe');
        //invalidate content script
        iframe.sandbox = 'allow-same-origin';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        var win = iframe.contentWindow;
        window.RTCPeerConnection = win.RTCPeerConnection;
        window.mozRTCPeerConnection = win.mozRTCPeerConnection;
        window.webkitRTCPeerConnection = win.webkitRTCPeerConnection;
        RTCPeerConnection = window.RTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection;
    }

    //minimal requirements for data connection
    var mediaConstraints = {
        optional: [{
            RtpDataChannels: true
        }]
    };

    //firefox already has a default stun server in about:config
    //    media.peerconnection.default_iceservers =
    //    [{"url": "stun:stun.services.mozilla.com"}]
    var servers = undefined;

    //add same stun server for chrome
    if (window.webkitRTCPeerConnection)
        servers = {
            iceServers: [{
                urls: "stun:stun.services.mozilla.com"
            }]
        };

    //construct a new RTCPeerConnection

    try {
        var pc = new RTCPeerConnection(servers, mediaConstraints);

        //listen for candidate events
        pc.onicecandidate = function (ice) {

            //skip non-candidate events
            if (ice.candidate) {

                //match just the IP address
                var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
                var ip_addr = ip_regex.exec(ice.candidate.candidate)[1];

                //remove duplicates
                if (ip_dups[ip_addr] === undefined)
                    callback(ip_addr);

                ip_dups[ip_addr] = true;
            }
        };

        //create a bogus data channel
        pc.createDataChannel("");

        //create an offer sdp
        pc.createOffer(function (result) {

            //trigger the stun server request
            pc.setLocalDescription(result, function () {}, function () {});

        }, function () {});
    } catch (error) {
        //callback('127.0.0.1');
    }
}

//收藏
function collectCommon(path){
    var JLNM = $("#S_JLNM").val();
    if (typeof (JLNM) == "undefined" || JLNM == null || JLNM == ""){
        layer.msg("先保存文档再收藏!!");
        return false;
    }

    $.post(
        path,
        {"JLNM":JLNM,"type":'0'},
        function (data) {
            var json = eval('('+data+')');
            if (json['recode'] != null)
                return errorPrint(json);
            layer.msg(json.result == '0' ? "收藏失败" : "收藏成功");
        }
    )
}

//对错误信息进行检测打印
function errorPrint(jsonObj){
    if (jsonObj.recode == '0' || jsonObj.redescr.lastIndexOf('SNum已失效') != -1){
        top.location.href = "/";
        return false;
    }
    // -1是接口方法异常，-10是未知
    if(jsonObj.recode == '-1') layer_alert(jsonObj.redescr,false);

    if (jsonObj.recode == '-10') layer_alert('后台接口调用异常',false);

    return false;
}

//layer的弹出框.isFlush表示关闭后是否刷新页面
function layer_alert(content,isFlush) {
    layer.open({
        title: '提示',
        content: content,
        cancel: function(index, layero){
            if (isFlush) window.location.reload();
        },
        yes: function(index, layero){
            if (isFlush) window.location.reload();
            layer.close(index);
        }
    });
}

//layer的弹出框
function layer_confirm(content,method1,method2) {
    layer.confirm(content,
        {btn: ['确定', '取消']
        }, method1, function(index){
            if (method2 != null) method2();
            else layer.close(index);
        });
}

//滚动条滑到底部
function scrollToBottom(selector) {
    $(selector).scrollTop($(selector)[0].scrollHeight);
}

(function(){
    var Base64;
    if(window.atob){
        Base64 = window.Base64 || {
            encode : function (input) {
                return window.b64EncodeUnicode(input);
            },
            decode : function (input) {
                return window.b64DecodeUnicode(input);
            }
        }
    } else{
        Base64 = window.Base64 || {
            /* private property*/
            _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

            /* public method for encoding */
            encode : function (input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;

                input = Base64._utf8_encode(input);

                while (i < input.length) {

                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                        Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

                }

                return output;
            },

            /* public method for decoding */
            decode : function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;

                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                while (i < input.length) {

                    enc1 = Base64._keyStr.indexOf(input.charAt(i++));
                    enc2 = Base64._keyStr.indexOf(input.charAt(i++));
                    enc3 = Base64._keyStr.indexOf(input.charAt(i++));
                    enc4 = Base64._keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                }

                output = Base64._utf8_decode(output);

                return output;

            },

            /* private method for UTF-8 encoding */
            _utf8_encode : function (string) {
                string = string.replace(/\r\n/g,"\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }

                return utftext;
            },

            /* private method for UTF-8 decoding */
            _utf8_decode : function (utftext) {
                var string = "";
                var i = 0;
                var c = c1 = c2 = 0;

                while ( i < utftext.length ) {

                    c = utftext.charCodeAt(i);

                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    }
                    else if((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i+1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    }
                    else {
                        c2 = utftext.charCodeAt(i+1);
                        c3 = utftext.charCodeAt(i+2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }

                }
                return string;
            }
        }
    }
    window.Base64 = Base64;
})();

