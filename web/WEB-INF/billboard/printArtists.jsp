<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>打印作者</title>
</head>
<body>
    <c:forEach items="${artists}" var="artist">
        ${artist}<br>
    </c:forEach>
</body>
</html>
