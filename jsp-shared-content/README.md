# JSP 공통 컨텐츠 분리 구조

화면 A / 화면 B 에 중복된 HTML · JS 를 **공통 JSP 조각 1개 + 공통 JS 모듈 1개**로 모으고,
화면별 차이는 **JSP param(마크업)** 과 **JS options/hooks(동작)** 로 주입하는 구조입니다.

```
src/main/webapp
├── WEB-INF/views
│   ├── common/sharedContent.jsp      ← 공통 HTML (1개)
│   ├── screenA/screenA.jsp           ← include + param 만 다름
│   └── screenB/screenB.jsp
└── resources
    ├── js/common/sharedContent.js    ← 공통 JS (1개, SharedContent.init)
    ├── js/screen/screenA.js          ← A 전용: hooks 주입만
    ├── js/screen/screenB.js          ← B 전용: hooks 주입만
    └── css/common/sharedContent.css
```

## 규칙

| 구분 | 공통 파일에 둔다 | 화면 파일에 둔다 |
|---|---|---|
| HTML | 두 화면이 똑같은 마크업 | 화면 고유 영역, include 시 `jsp:param` |
| JS | 조회/렌더링/이벤트 바인딩 등 공통 로직 | `options`(URL 등) · `hooks`(콜백) |
| 분기 | `param.editable` 같은 **기능 플래그** | `mode === 'A'` 같은 **화면명 분기는 금지** → hooks 로 |

- 공통 마크업에서는 `id` 대신 `data-role` 을 사용 → 한 페이지에 2번 include 해도 충돌 없음.
- `SharedContent.init()` 은 인스턴스를 반환하므로 전역 변수 충돌이 없음.
- 스크립트 로드 순서: `sharedContent.js` → `screenX.js`.

## include 방식 선택

- `<jsp:include>` (동적, 이 구조에서 사용): `jsp:param` 으로 화면별 값 전달 가능, 공통 파일 수정 시 개별 화면 재컴파일 불필요.
- `<%@ include file="...jspf" %>` (정적): 호출 페이지의 변수/`taglib` 를 그대로 공유해야 할 때. param 전달 불가 → `<c:set>` 으로 넘김.

## 기존 소스 이관 순서

1. 두 JSP 를 diff 해서 **동일 블록**을 `common/sharedContent.jsp` 로 이동.
2. 다른 부분 중 작은 차이(버튼 노출, 문구, 컬럼)는 `jsp:param` 으로, 큰 차이는 화면 JSP 에 남김.
3. 중복 JS 함수를 `SharedContent` 의 `Instance.prototype` 로 이동하고, 셀렉터를 `this.$('role')` 로 교체.
4. 화면마다 다른 함수 본문은 `hooks` 로 빼서 `screenA.js` / `screenB.js` 에서 주입.
5. 한 화면씩 교체하고 동작 확인 후 기존 중복 코드 삭제.

## 로딩바 (CSS 전용) — `css/common/loadingBar.css`

애니메이션은 CSS만으로 동작합니다. JS는 표시/숨김 속성만 바꿉니다.

```html
<!-- 1) 단독 로딩바: 원하는 위치에 두고, 숨길 땐 hidden -->
<div class="loading-bar"></div>
<div class="loading-bar loading-bar--top" hidden></div>   <!-- 화면 최상단 고정 -->

<!-- 2) 영역 로딩바: aria-busy="true" 동안 상단에 로딩바 + 내용 흐림/클릭 차단 -->
<div class="loading-area" aria-busy="true">...</div>
```

- 공통 목록(`sharedContent`)은 이미 `loading-area` 가 적용되어 있어, `search()` 중 자동으로 표시됩니다.
- 색/두께 변경: `--loading-bar-color`, `--loading-bar-track`, `--loading-bar-height`, `--loading-bar-duration`
