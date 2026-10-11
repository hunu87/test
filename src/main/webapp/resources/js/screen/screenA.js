/** 화면 A 전용 스크립트 — 공통 모듈을 초기화하고, A 에만 필요한 동작을 hooks 로 주입 */
document.addEventListener('DOMContentLoaded', function () {
    var ctx = document.body.getAttribute('data-context-path') || '';

    window.screenAList = SharedContent.init({
        root: '#screenA',
        listUrl: ctx + '/screenA/list.do',
        hooks: {
            beforeSearch: function (params) {
                params.type = 'A';
                return params;
            },
            onRowClick: function (item, e) {
                if (e.target.getAttribute('data-role') === 'btnEdit') {
                    location.href = ctx + '/screenA/form.do?no=' + encodeURIComponent(item.no);
                }
            },
            onAdd: function () {
                location.href = ctx + '/screenA/form.do';
            }
        }
    });
});
