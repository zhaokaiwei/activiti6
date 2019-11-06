<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>上榜最多</title>
</head>
<body>
    <c:forEach items="${maps}" var="map">
        ${map.title}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${map.num}<br>
    </c:forEach>
</body>
</html>
