<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>화면 B</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/sharedContent.css">
</head>
<body data-context-path="${pageContext.request.contextPath}">

    <%-- 화면 B 고유 영역 --%>
    <h2>화면 B <small>(총 <span id="screenBCount">0</span>건)</small></h2>

    <%-- 공통 컨텐츠 (조회 전용: editable=false) --%>
    <jsp:include page="/WEB-INF/views/common/sharedContent.jsp">
        <jsp:param name="contentId" value="screenB"/>
        <jsp:param name="mode"      value="B"/>
        <jsp:param name="title"     value="화면 B 목록"/>
        <jsp:param name="editable"  value="false"/>
    </jsp:include>

    <script src="${pageContext.request.contextPath}/resources/js/common/sharedContent.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/screen/screenB.js"></script>
</body>
</html>
