<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=700 ,user-scalable=yes">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>湖南农业大学</title>
    <link href="${pageContext.request.contextPath}/css/common.css" type="text/css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/login.css?t=1" type="text/css" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/tipswindown.css" type="text/css" media="all" />

    <%@include file="/WEB-INF/common/head.jsp" %>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/md5.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/login.js" charset='gb2312'></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.placeholder.min.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/tipswindown.js"></script>


    <script type="text/javascript">
        $(function(){
            var message = "${message}";
            if (typeof (message) != 'undefined' && message != null && message != ''){
                layer.msg(message);
                return false;
            }
        })

        function login(){
            var username = $("#userName").val();
            var password = $("#password").val();
            if (username == '' || password == ''){
                layer.msg('用户名或密码不能为空!');
            }else{
                $("#form").submit();
            }
        }
    </script>
</head>
<body>

<div class="login-t-r">
</div>

<div class="login">

    <div class="login-qr-bg">
    </div>

    <div class="png32 login-bg">
        <div style="color:#FF0000; font-size:13pt; font-weight:bold; text-align:center; position:absolute; top:110px; left:50%; width:400px; margin-left:-200px;">
            上网信息不涉密  涉密信息不上网
        </div>
        <form id="form" action="${pageContext.request.contextPath}/login" method="post">
            <div class="login-ipt-pos">
                <input type="text" id="userName" name="userName" value="" placeholder="请输入用户名"
                       class="login-ipt1" tabindex="1">
                <input type="password" id="password" name="password" placeholder="请输入密码" class="login-ipt2"
                       tabindex="2">
                <input type="hidden" id="psw" name="psw" />
            </div>
        </form>
        <button onclick="login()" class="login-submit" tabindex="3" id="logbtn" style="color: white">登录</button>
        <div class="login-us"></div>
    </div>

    <div class="ft text-center fs-12">
        赵开未 ©版权所有Copyright <span id="year"></span>
    </div>

</div>

</body>

<script type="text/javascript">
    $(function () {
        $("#year").html(new Date().getFullYear());
    })

    //回车调用登陆
    $(document).keydown(function () {
        if (event.keyCode == 13) {
            $("#logbtn").click();
            return false;
        }
    });
</script>
</html>

</html>