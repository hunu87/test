<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>화면 A</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/sharedContent.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/loadingBar.css">
</head>
<body data-context-path="${pageContext.request.contextPath}">

    <%-- 화면 A 고유 영역 --%>
    <h2>화면 A</h2>

    <%-- 공통 컨텐츠 --%>
    <jsp:include page="/WEB-INF/views/common/sharedContent.jsp">
        <jsp:param name="contentId" value="screenA"/>
        <jsp:param name="mode"      value="A"/>
        <jsp:param name="title"     value="화면 A 목록"/>
        <jsp:param name="editable"  value="true"/>
    </jsp:include>

    <%-- 공통 스크립트 → 화면 스크립트 순서로 로드 --%>
    <script src="${pageContext.request.contextPath}/resources/js/common/sharedContent.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/screen/screenA.js"></script>
</body>
</html>
