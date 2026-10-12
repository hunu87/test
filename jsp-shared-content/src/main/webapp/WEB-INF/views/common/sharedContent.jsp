<%--
  공통 컨텐츠 조각 (화면 A / 화면 B 공용)

  사용법 (호출 JSP):
    <jsp:include page="/WEB-INF/views/common/sharedContent.jsp">
        <jsp:param name="contentId" value="screenA"/>   <!-- 루트 요소 id (필수, 페이지 내 유일) -->
        <jsp:param name="mode"      value="A"/>         <!-- 화면 구분값 -->
        <jsp:param name="title"     value="화면 A 목록"/>
        <jsp:param name="editable"  value="true"/>      <!-- 화면별 차이: 버튼 노출 여부 등 -->
    </jsp:include>

  원칙
    - 이 파일에는 "두 화면이 똑같이 쓰는 마크업"만 둔다.
    - 화면마다 다른 부분은 param 으로 분기하거나, 호출 JSP 쪽에 둔다.
    - id 대신 data-role / class 로 요소를 찾는다 (같은 페이지에 2번 include 해도 충돌 없음).
    - 스크립트는 여기서 실행하지 않는다. 초기화는 각 화면 JSP에서 SharedContent.init() 호출.
--%>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div id="${param.contentId}" class="shared-content" data-mode="${param.mode}">

    <div class="shared-content__header">
        <h3 data-role="title"><c:out value="${param.title}"/></h3>
    </div>

    <form data-role="searchForm" class="shared-content__search" onsubmit="return false;">
        <input type="text" name="keyword" placeholder="검색어를 입력하세요"/>
        <button type="button" data-role="btnSearch">조회</button>
    </form>

    <table class="shared-content__table">
        <thead>
            <tr>
                <th>번호</th>
                <th>제목</th>
                <th>등록일</th>
                <%-- 화면별 차이를 param 으로 분기하는 예시 --%>
                <c:if test="${param.editable eq 'true'}">
                    <th>관리</th>
                </c:if>
            </tr>
        </thead>
        <tbody data-role="listBody">
            <%-- SharedContent.render() 가 채움 --%>
        </tbody>
    </table>

    <c:if test="${param.editable eq 'true'}">
        <div class="shared-content__footer">
            <button type="button" data-role="btnAdd">등록</button>
        </div>
    </c:if>
</div>
