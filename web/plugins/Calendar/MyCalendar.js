
var jdate = {
    id: null, //填充对象
    tp: 'm',  //m月|w周
    date: new Date(), //查询日期
    purl: null, //查询数据的
    param: null, //查询数据所带参数
    sdate: [{   //有事件时
        date: null, //事件日期
        id: null, //
        title: null, //提示内容
        link: null    //连接地址
    }]  //有数据 [{ date:"",id:"",title:"",link:"" }]
};
$.calendar = function (data) {

    jdate = $.extend(jdate, data);

    var today = new Date(),
        fday = new Date(jdate.date),
        lday = new Date(jdate.date),
        tpdate = jdate.date.Format("yyyy-MM");

    switch (jdate.tp) {
        case "w":
            LoadWeek();
            break;
        default:
            LoadMonth();
            break;
    }

    function LoadWeek() {
        getMonthFirstWeek(fday);
        getMonthLastWeek(lday);
        tpdate = fday.Format("yyyy-MM-dd") + " - " + lday.Format("yyyy-MM-dd");

        if (jdate.purl) {
            var nparam = { kssj: fday.Format("yyyy-MM-dd"), jssj: lday.Format("yyyy-MM-dd") };
            $.getJSON(jdate.purl, nparam, function (json) {
                jdate.sdate = json;
                LoadWeekHtml(jdate);
            });
        }
    }

    function LoadMonth() {
        fday = new Date(fday.setDate(1));

        lday = new Date(lday.setDate(1));
        lday = new Date(lday.setDate(new Date(lday.setMonth(lday.getMonth() + 1)).getDate() - 1));
        getMonthFirstWeek(fday);
        getMonthLastWeek(lday);

        if (jdate.purl) {
            var nparam = { kssj: fday.Format("yyyy-MM-dd"), jssj: lday.Format("yyyy-MM-dd") };
            $.getJSON(jdate.purl, nparam, function (json) {
                jdate.sdate = json;
                LoadMonthHtml(jdate);
            });
        }
    }

    //每月第一天
    function getMonthFirstWeek(fday) {
        var week = fday.getDay();
        fday.setDate(fday.getDate() - week);
    }
    //每月最后一天
    function getMonthLastWeek(lday) {
        var week = lday.getDay();
        lday.setDate(lday.getDate() - (week - 6));
    }



    //加载数据
    function LoadMonthHtml(options) {
        var html = '<table class="calendar">';

        html += '<tr class="hd">';
        html += '<th class="l"><span onclick="setMonth(-1,\'' + options.tp + '\');"><</span></th>';
        html += '<th class="d" colspan="5"><span title="回到当天" onclick="setMonth(0,\'' + options.tp + '\');">' + tpdate + '</span></th>';
        html += '<th class="r"><span onclick="setMonth(1,\'' + options.tp + '\');">></span></th>';
        html += '</tr>';

        html += '<tr>';
        html += '<th>日</th>';
        html += '<th>一</th>';
        html += '<th>二</th>';
        html += '<th>三</th>';
        html += '<th>四</th>';
        html += '<th>五</th>';
        html += '<th>六</th>';
        html += '</tr>';

        //html += '<tr>';

        while ((lday - fday) / (1000 * 60 * 60 * 24) >= 0) {
            if (fday.getDay() == 0)
                html += '<tr>';

            //是否有事务
            var _shtml = '';

            var jdata = JSON.parse(options.sdate);
            for (var item in jdata) {
                var _options = JSON.parse(options.sdate);
                var _sdate = $.GetDate(_options[item].s_date);
                if (_sdate.Format("yyyy-MM-dd") == fday.Format("yyyy-MM-dd")) {
                    _shtml += (_shtml == "" ? "" : "\n") + _options[item].s_title;
                }
            }

            //是否当月
            var tday = today.Format("yyyy-MM-dd") == fday.Format("yyyy-MM-dd");
            var tmon = options.date.getMonth() == fday.getMonth();
            html += '<td><div title="' + _shtml + '" class="' + (tmon ? 'tmon' : 'nmon') + (tday ? ' tday' : '') + '">' + fday.getDate()
                + (_shtml == '' ? '' : '<div class="sday"></div>')
                + '</div></td>';


            if (fday.getDay() == 6)
                html += '</tr>';

            fday = new Date(fday.setDate(fday.getDate() + 1));
        }
        //html += '</tr>';

        html += '</table>';

        $(options.id).html(html);
    }
    //加载数据
    function LoadWeekHtml(options) {
        var html = '<table class="calendar">';

        html += '<tr class="hd">';
        html += '<th class="l"><span onclick="setMonth(-1,\'' + options.tp + '\');"><</span></th>';
        html += '<th class="d" colspan="5"><span title="回到当天" onclick="setMonth(0,\'' + options.tp + '\');">' + tpdate + '</span></th>';
        html += '<th class="r"><span onclick="setMonth(1,\'' + options.tp + '\');">></span></th>';
        html += '</tr>';

        html += '<tr>';
        html += '<th>日</th>';
        html += '<th>一</th>';
        html += '<th>二</th>';
        html += '<th>三</th>';
        html += '<th>四</th>';
        html += '<th>五</th>';
        html += '<th>六</th>';
        html += '</tr>';

        //html += '<tr>';

        while ((lday - fday) / (1000 * 60 * 60 * 24) >= 0) {
            if (fday.getDay() == 0)
                html += '<tr>';

            //是否有事务
            var _shtml = '';
            var jdata = JSON.parse(options.sdate);
            for (var item in jdata) {
                var _options = JSON.parse(options.sdate);
                var _sdate = $.GetDate(_options[item].s_date);
                if (_sdate.Format("yyyy-MM-dd") == fday.Format("yyyy-MM-dd")) {
                    _shtml += (_shtml == "" ? "" : "\n") + _options[item].s_title;
                }
            }

            //是否当月
            var tday = today.Format("yyyy-MM-dd") == fday.Format("yyyy-MM-dd");
            var tmon = options.date.getMonth() == fday.getMonth();
            html += '<td><div onclick="LoadSWeekHtml(\'' + fday.Format("yyyy-MM-dd") + '\',this);" title="' + _shtml + '" class="mon ' + (tmon ? 'tmon' : 'nmon') + (tday ? ' tday' : '') + '">' + fday.getDate()
                + (_shtml == '' ? '' : '<div class="sday"></div>')
                + '</div></td>';


            if (fday.getDay() == 6)
                html += '</tr>';

            fday = new Date(fday.setDate(fday.getDate() + 1));
        }
        //html += '</tr>';

        html += '</table>';
        html += '<div class="calendar-w"></div>';

        $(options.id).html(html);
        LoadSWeekHtml(today.Format("yyyy-MM-dd"))
    }

}

function LoadSWeekHtml(Wdate,uview) {
    if (uview != undefined) {
        var d = document.getElementsByClassName("tday")[0];
        if (d != undefined) {
            var classVal = d.getAttribute("class");
            classVal = classVal.replace("tday", "");
            d.setAttribute("class", classVal);
        }


        uview.classList.add("tday");
    }

    var _shtml = '';
    var jdata = JSON.parse(jdate.sdate);
    for (var item in jdata) {
        var _jdate = JSON.parse(jdate.sdate);
        var _sdate = $.GetDate(_jdate[item].s_date);
        if (_sdate.Format("yyyy-MM-dd") == Wdate) {
            _shtml += '<div id="' + _jdate[item].s_id + '" class="ct" title="' + _jdate[item].s_content + '" onclick= jdate.fun("'+_jdate[item].s_id+'")>' +
                '<div class="r">' + _sdate.Format("yyyy-MM-dd HH:mm") + '</div>' +
                '<div class="l">' + _jdate[item].s_title + '</div>' +
                '</div>';
        }
    }
    if (_shtml == "") {
        _shtml = '<div class="n">没有日程</div>';
    }
    $('.calendar-w').html(_shtml);
}
function setMonth(imon, tp) {
    if (imon == 0) //回到当天
        jdate.date = new Date();
    else {
        switch (tp) {
            case "w":
                jdate.date.setDate(jdate.date.getDate() + imon * 7);
                break;
            default:
                jdate.date.setMonth(jdate.date.getMonth() + imon);
                break;
        }
    }
    $.calendar(jdate);
}
