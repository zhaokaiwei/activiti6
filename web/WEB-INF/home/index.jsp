<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>华科请假申请</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/common.css" type="text/css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/index.css" type="text/css" />
    <link type="text/css" rel="stylesheet" href="${pageContext.request.contextPath}/plugins/jquery-dropdown/jquery.dropdown.css"/>
    <link href='${pageContext.request.contextPath}/plugins/Calendar/MyCalendar.css' type="text/css" rel='stylesheet'/>
    <link href="${pageContext.request.contextPath}/css/tipswindown.css" rel="stylesheet" type="text/css" media="all" />
    <link href="${pageContext.request.contextPath}/plugins/toastr/toastr.min.css" rel="stylesheet" type="text/css" media="all" />

    <%@include file="/WEB-INF/common/head.jsp" %>
    <script type="text/javascript"
            src="${pageContext.request.contextPath}/plugins/jquery-dropdown/jquery.dropdown.js"></script>
    <script src='${pageContext.request.contextPath}/plugins/Calendar/MyCalendar.js'></script>
    <script src="${pageContext.request.contextPath}/js/tipswindown.js" type="text/javascript"></script>
    <script src="${pageContext.request.contextPath}/plugins/toastr/toastr.min.js" type="text/javascript"></script>
</head>
<body class="fs-14 body">
<div class="hd2">
    <img src="${pageContext.request.contextPath}/ConfigFiles/images/logo1.png" class="hd2-logo" />
    <div class="hd2-logout text-center">
        <span class="hd2-txt">
            <span title="{sessionScope.userName}">${sessionScope.userName}</span>&nbsp;&nbsp;
            <span class="icon26 png32">
            </span>
            <a href="/" target="_self" class="a1" style="color: #fff;">退出</a>
        </span>
    </div>
    <div style="cursor: pointer" class="hd2-time text-center" data-jq-dropdown="#jq-dropdown-todo">
        <span class="icon25 png32"></span>
        <span class="hd2-txt" id="date"></span>
    </div>
</div>

<div class="td2">
    <div class="td2-c">
        <div style="float:left;">
            <span><b>快速通道：</b></span>
        </div>
        <ul style=" float:left; height:100%;">
            <li><span class="tt3-icon">&bull;</span><a href="/page/main" target="Main" class="">首页</a></li>

            <li><span class="tt3-icon">&bull;</span><a href="/common/WORK_TODO" target="Main" class="" onclick="" >待办已办</a></li>

            <li><span class="tt3-icon">&bull;</span><a href="/common/WORK_TOSEE" target="Main" class="" onclick="" >待阅已阅</a></li>

            <li><span class="tt3-icon">&bull;</span><a href="/common/GRBG_GRSC" target="Main" class="" onclick="" >个人收藏</a></li>

            <li><span class="tt3-icon">&bull;</span><a href="${pageContext.request.contextPath}/email/index" target="_blank" class="" onclick="">我的邮件</a></li>
        </ul>
    </div>
</div>

<div class="bd2 clear">
    <div class="bd2-l ct4">

        <a id="allProcesses" href="/page/my_processes" class="tt2 png32 ict2" target="Main">参与流程</a>
        <a id="apply" href="/page/vacate_apply" class="tt2 png32 ict2" target="Main">请假申请</a>
        <a id="dynamicSet" href="/page/dynamicSet" class="tt2 png32 ict2" target="Main">动态设置</a>
        <a id="billboardList" href="/page/billboardList" class="tt2 png32 ict2" target="Main">billboard</a>

        <div class="pd-tb-5" style="color:#FF0000; font-weight:bold; padding-left:40px; ">
            上网信息不涉密<br/>涉密信息不上网
        </div>

    </div>


    <div class="bd2-r">
        <iframe src="/page/my_processes" id = 'Main' name='Main' class="ifrm" frameborder="0" marginheight="0" marginwidth="0" allowtransparency="true"></iframe>
    </div>
</div>
<div class="ft1 text-center fs-12"> 赵开未©版权所有Copyright <span id="year"></span></div>
<div class="dhide">

</div>

<script type="text/javascript">
    (function () {
        showMessages();
        showTime();

        //初始化日期
        $("#year").html(new Date().getFullYear());

        var tt2 = $('.tt2'),
            ct5 = $('.ct5'),
            bd2r = $('.bd2-r'),
            ifrm = $(".ifrm"),
            ifrmSize;

        tt2.on('click', function () {
            var b = $(this).next().is(":hidden");
            tt2.removeClass('fcsli');
            ct5.hide("fast");
            b ? $(this).addClass('fcsli').next().show("fast") : $(this).addClass('fcsli');
        });

        $('.ttm').on('click',function(){
            var b=$(this).next().is(":hidden");
            $(".ct5 .ct5").hide("fast");
            if(b) $(this).next().show("fast");
        });
        $('.tt3').on('click', function () {
            $('.tt3').removeClass('fcs1');
            $(this).addClass('fcs1');
        });

        ifrmSize = function () {
            ifrm.hide().height($(window).innerHeight() - 139).width($(window).innerWidth() - 171).show();
        }
        $(window).resize(function () {
            ifrmSize();
        });
        ifrmSize();
    } ());

    //实时刷新时间
    function showTime() {
        var curTime = new Date();
        $("#date").html(curTime.Format('yyyy-MM-dd')+"<br/>星期"+curTime.Format("w"));
    }

    function showMessages() {
        var message = "";
        <c:forEach items="${messages}" var="message">
            message += '&nbsp;&nbsp;&nbsp;${message}<br>';
        </c:forEach>
        if (message == ''){
            return false;
        }
       layer.open({
            type:1,
            title:'新消息',
            content:message,
           area: ['500px', '300px']
       })
    }
</script>

</body>

</html>
