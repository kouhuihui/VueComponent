/*
* 下拉框组件：combobox
*  @params:
		 width: 输入框宽度，默认200px
		 filedlabel: 前置label名
		 hidelabel：是否隐藏label，默认fasle
		 labelwidth：label宽度
		 placeholder: 空白时显示的提示文案
		 required：是否必选，默认为fasle		 
*/
require('./combobox.css')
var tpl = require('./combobox.jade');

/*
* mixin
*/
var FormMixin = require('../mixin/form');

var Combobox = Vue.extend({	
    mixins: [FormMixin],
	props: ['width', 'store', 'filedlabel', 'hidelabel', 'placeholder', 'required', 'labelwidth','displayvalue', 'displaytext','allowedit', 'isfilter', 'isremote', 'url', 'isselectall', 'afterload'],
	template: tpl(),
	data: function () {
		return {
			store: this.store || [],
			isshowlabel: !this.hidelabel,
			labeltext: this.filedlabel,
			labelstyle: {
				width: this.transformCssUnit(this.labelwidth || '200px')
			},
			bodystyle: {
                width: this.transformCssUnit(this.width || '60px')
            },
            vdisplayvalue: this.displayvalue || 'value',
            vdisplaytext: this.displaytext || 'text',
            isautocomplete: false,
            expand: false,
            isreadonly: this.allowedit || false,
            inputText: '',
            selected: '',
            visselectall: this.isselectall === undefined ? true : this.isselectall,
            vselectalltext: this.selectalltext || '选择所有'
		}
	},
	methods: {
		init: function(){
			this.$body = $(this.$el);
			this.$input = this.$body.find('input');
			this.loadData();
		},
		doClick: function(){
			this.$input.focus();
			if(this.isautocomplete){
				this.expand = false;
			}else{
				this.expand = !this.expand;
			}
		},
		doSearch: function(){
			if(this.isfilter){
  				var arr = [];
                for (var i = 0, items = this.originStore, len = items.length; i < len; i++) {
                    if (items[i][this.vdisplaytext].toLowerCase().trim().indexOf(this.inputText.toLowerCase().trim()) !== -1) {
                        arr.push(items[i]);
                    }
                }
                this.store = arr;
                this.selected = '';
                this.dropDown();
                this.isReset = false;
			}
		},
		doSelect: function(val, index, item){
			var text = item[this.vdisplaytext];
			this.setValue(val);
			this.$input.val(text);
			this.inputText = text;
			this.selected = index;
			this.doBlur();
		},
		doBlur: function(){
			this.packUp();
			if(this.getValue() === ''){
				this.inputText = '';
			}
		},
		dropDown: function(){
			if(this.isautocomplete && this.inputText == ''){
                this.expand = false;
            }else{
                this.expand = true;
            }
		},
		packUp: function(){
			this.expand = false;
		},
		getStoreLocal: function(){
			this.store = this.store || '';
			if(this.store instanceof Array){
				return this.store;
			}

			var item, rec, arr = [], items = this.store.split('|');
			for(var i = 0, len = items.length; i < len; i++){
				item = items[i];
				rec = item.split(',');
				arr.push({
					value: rec[0],
					text: rec[1]
				})
			}
			this.store = arr;
			this.originStore = arr;
			return arr;
		},
		getStoreAsync: function(){
			var _self = this;
			$.get(this.url, function(rtn){
				if (!rtn.succeeded) {
                    return parse.showError(rtn);
                }
                if (_self.visselectall) {
                	rtn.data.unshift({
                        value: _self.selectallvalue,
                        text: _self.vselectalltext
                    });
                }
                var data = rtn.data;
                _self.store = data;
                _self.originStore = data;
                Vue.nextTick(function () {
                    _self.afterload && _self.afterload(rtn.data);
                })
			})
		},
		loadData: function(){
			if(this.isremote){
				return this.getStoreAsync();
			}else{
				return this.getStoreLocal();
			}
		}
	}
})

module.exports = Vue.component('vcombobox', Combobox);