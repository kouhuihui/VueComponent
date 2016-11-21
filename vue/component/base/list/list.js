/*
* 列表组件: list
* @params:
*       store：数据源
*       isremote: 是否远程加载数据，默认为false
*       autoload: 是否自动加载数据，默认为true
*       rowtpl: row模板
*       ispager: 是否分页，默认为false
*       pagertype: 分页类型（‘加载更多:more’和‘页码展示:page’），默认为页码展示
*       beforerowrender: 在row render前的方法
*       afterload: 数据加载完毕后执行的方法
*/
require('./list.css');
var tpl = require('./list.jade');
var rowTpl = require('./row.jade');

/*
* 依赖分页组件
*/
require('../pager/pager');
var List = Vue.extend({
	props: ['store', 'rowtpl', 'isremote', 'url', 'params', 'ispager', 'pagertype', 'pagesize', 'beforerowrender', 'afterload', 'autoload'],
	template: tpl(),
	data: function () {
		return {
			total: 0,
			pagertype: this.pagertype || 'page',
			vispager: this.ispager || false,
			vpagesize: this.pagesize || 10,
			autoload: this.autoload === true || this.autoload === "false"
		}
	},
	methods: {
		init: function(){
            debugger;
			this.rowTpl = this.rowtpl || rowTpl;
			this.body = $(this.$el).find('ul');
			this.pager = this.$refs.pager;
            this.beforeRowRender = this.beforerowrender || function(record){return record;};
			if(this.autoload){
                this.load();
            }
            this.initEvents();
		},
		initEvents: function(){
			var _self = this;
			this.pager && this.pager.$on('pager', function(data){
                _self.params.start = data * _self.vpagesize;
                _self.load();
            });
		},
		parseParams: function(){
			var url = '?';
			for (var i in this.params) {
				url += '&' + i + '=' + this.params[i]
			}
			return url;
		},
		addRows: function (records) {
            records = records || [];
            for(var i = 0, len = records.length; i < len; i++){
                var $row = this._createRow(records[i], i);
                this.body.append($row);
            }
        },
        _createRow: function(record, index){
            record = this.beforeRowRender(record);
            var row  = this.rowTpl({
                data: record,
                columns: this.columns
            });
            var $row = $(row);
            if(index % 2 !== 0){
                $row.addClass('active');
            }
            $row.data('record', record);
            this._bindEvents($row, record);
            return $row;
        },
        _empty: function(){
            this.body.html('');
        },
        _bindEvents: function(row, record){
            var _self = this;
            // row click
            row.on('click', function(){
                _self.$dispatch('rowclick', row, record);
            });
            row.find('.btn').on('click', function(){
                var $this = $(this);
                if($this.attr('disabled')){
                    return;
                }
                _self.$dispatch($this.data('action'), $this, record);
            });
        },
		getStoreLocal: function(){

		},
		getStoreAsync: function(params, cb){
			this.params = params || this.params || {
                start: 0,
                take: this.vpagesize
            };
            var _self = this, url = this.url + this.parseParams();
            $.get(url,function(rtn){
            	if(!rtn.succeeded){
            		alert(rtn.Message)
            	};
            	_self.total = rtn.data.total;
            	if (_self.pagertype === 'page') {
                    _self._empty();
                }
                _self.addRows(rtn.data.list);
                cb && cb(rtn);
            })
		},
		load: function(params, cb){
			if(!this.isremote || this.isremote === 'false' || !this.url){
				this.getStoreLocal();
			}else{
				this.getStoreAsync(params, cb);
			}
		}
	},
    ready: function(){
        this.init();
    }
})

module.exports = Vue.component('vlist', List);