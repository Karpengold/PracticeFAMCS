
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>



<html>
    <body>
        <h2>Your token is <c:out value="${pageScope.username}"/></h2>
        <div><c:out value="${cookie.get('uid').value}"/></div>
    </body>
</html>
