/**
 * 공통 컨텐츠 스크립트 (화면 A / 화면 B 공용)
 *
 * - 전역 오염을 막기 위해 SharedContent 네임스페이스 하나만 노출한다.
 * - init() 이 인스턴스를 반환하므로 한 페이지에서 여러 번 사용해도 서로 간섭하지 않는다.
 * - 화면마다 다른 동작은 options(설정값)와 hooks(콜백)로 주입한다.
 *   → 공통 파일 안에 if (mode === 'A') ... 분기를 늘리지 않는 것이 핵심.
 *
 * 사용 예)
 *   var list = SharedContent.init({
 *       root: '#screenA',
 *       listUrl: '/screenA/list.do',
 *       hooks: {
 *           beforeSearch: function (params) { params.type = 'A'; return params; },
 *           renderRow:    function (item, defaultHtml) { return defaultHtml; },
 *           onAdd:        function () { location.href = '/screenA/form.do'; }
 *       }
 *   });
 *   list.search();
 */
var SharedContent = (function () {
    'use strict';

    var DEFAULTS = {
        root: null,          // 루트 요소 셀렉터 (필수)
        listUrl: '',         // 목록 조회 URL (필수)
        method: 'GET',
        autoSearch: true,    // init 직후 자동 조회 여부
        hooks: {
            beforeSearch: null, // function(params) -> params   : 조회 파라미터 가공
            afterSearch:  null, // function(list)               : 조회 후처리
            renderRow:    null, // function(item, defaultHtml) -> html : 행 렌더링 커스터마이즈
            onRowClick:   null, // function(item)               : 행 클릭
            onAdd:        null  // function()                   : 등록 버튼
        }
    };

    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function serialize(form) {
        var params = {};
        Array.prototype.forEach.call(form.elements, function (el) {
            if (el.name) params[el.name] = el.value;
        });
        return params;
    }

    function toQuery(params) {
        return Object.keys(params).map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }).join('&');
    }

    /** 인스턴스 생성자 */
    function Instance(options) {
        this.opts  = Object.assign({}, DEFAULTS, options);
        this.hooks = Object.assign({}, DEFAULTS.hooks, options.hooks);
        this.root  = document.querySelector(this.opts.root);
        if (!this.root) throw new Error('[SharedContent] root not found: ' + this.opts.root);

        this.mode     = this.root.getAttribute('data-mode');
        this.editable = !!this.$('btnAdd');
        this.items    = [];
        this._bind();
    }

    Instance.prototype.$ = function (role) {
        return this.root.querySelector('[data-role="' + role + '"]');
    };

    Instance.prototype._bind = function () {
        var self = this;

        this.$('btnSearch').addEventListener('click', function () { self.search(); });
        this.$('searchForm').addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); self.search(); }
        });

        var btnAdd = this.$('btnAdd');
        if (btnAdd) {
            btnAdd.addEventListener('click', function () {
                if (self.hooks.onAdd) self.hooks.onAdd.call(self);
            });
        }

        // 이벤트 위임: 행이 다시 그려져도 바인딩 유지
        this.$('listBody').addEventListener('click', function (e) {
            var tr = e.target.closest('tr[data-index]');
            if (!tr || !self.hooks.onRowClick) return;
            self.hooks.onRowClick.call(self, self.items[tr.getAttribute('data-index')], e);
        });
    };

    Instance.prototype.search = function (extraParams) {
        var self   = this;
        var params = Object.assign(serialize(this.$('searchForm')), extraParams || {});
        if (this.hooks.beforeSearch) params = this.hooks.beforeSearch.call(this, params) || params;

        var url  = this.opts.listUrl;
        var init = { method: this.opts.method, headers: { 'Accept': 'application/json' } };
        if (this.opts.method === 'GET') {
            url += (url.indexOf('?') > -1 ? '&' : '?') + toQuery(params);
        } else {
            init.headers['Content-Type'] = 'application/json';
            init.body = JSON.stringify(params);
        }

        return fetch(url, init)
            .then(function (res) { return res.json(); })
            .then(function (data) {
                self.render(data.list || data);
                if (self.hooks.afterSearch) self.hooks.afterSearch.call(self, self.items, data);
                return data;
            })
            .catch(function (err) { console.error('[SharedContent] search failed', err); });
    };

    Instance.prototype.render = function (list) {
        var self = this;
        this.items = list || [];

        var html = this.items.map(function (item, i) {
            var row = '<tr data-index="' + i + '">'
                + '<td>' + escapeHtml(item.no) + '</td>'
                + '<td>' + escapeHtml(item.title) + '</td>'
                + '<td>' + escapeHtml(item.regDate) + '</td>'
                + (self.editable ? '<td><button type="button" data-role="btnEdit">수정</button></td>' : '')
                + '</tr>';
            return self.hooks.renderRow ? self.hooks.renderRow.call(self, item, row, i) : row;
        }).join('');

        var colspan = this.editable ? 4 : 3;
        this.$('listBody').innerHTML = html || '<tr><td colspan="' + colspan + '">조회된 데이터가 없습니다.</td></tr>';
    };

    return {
        init: function (options) {
            var instance = new Instance(options || {});
            if (instance.opts.autoSearch) instance.search();
            return instance;
        }
    };
})();
