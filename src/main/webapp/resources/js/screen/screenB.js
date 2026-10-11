/** 화면 B 전용 스크립트 — 조회 전용 화면: 행 클릭 시 상세 팝업, 행 강조 렌더링 */
document.addEventListener('DOMContentLoaded', function () {
    var ctx = document.body.getAttribute('data-context-path') || '';

    window.screenBList = SharedContent.init({
        root: '#screenB',
        listUrl: ctx + '/screenB/list.do',
        method: 'POST',
        hooks: {
            renderRow: function (item, defaultHtml) {
                // B 화면만 신규 건 강조
                return item.isNew ? defaultHtml.replace('<tr ', '<tr class="is-new" ') : defaultHtml;
            },
            onRowClick: function (item) {
                window.open(ctx + '/screenB/detail.do?no=' + encodeURIComponent(item.no), 'detail', 'width=800,height=600');
            },
            afterSearch: function (list) {
                document.getElementById('screenBCount').textContent = list.length;
            }
        }
    });
});
