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
	props: ['width', 'store', 'filedlabel', 'hidelabel', 'placeholder', 'required', 'labelwidth','displayvalue', 'displaytext','allowedit'],
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
            selected: ''
		}
	},
	methods: {
		init:function(){
			this.$body = $(this.$el);
			this.$input = this.$body.find('input');
		},
		doClick:function(){
			this.$input.focus();
			if(this.isautocomplete){
				this.expand = false;
			}else{
				this.expand = !this.expand;
			}
		},
		doSearch:function(){

		},
		doSelect:function(val, index, item){
			var text = item[this.vdisplaytext];
			this.setValue(val);
			this.$input.val(text);
			this.inputText = text;
			this.selected = index;
			this.doBlur();
		},
		doBlur:function(){
			this.packUp();
			if(this.getValue() === ''){
				this.inputText = '';
			}
		},
		packUp:function(){
			this.expand = false;
		}
	}
})

module.exports = Vue.component('vcombobox', Combobox);