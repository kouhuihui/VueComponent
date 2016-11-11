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
	props: ['width', 'store', 'filedlabel', 'hidelabel', 'placeholder', 'required', 'labelwidth','displayvalue', 'displaytext'],
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
		}
	},
	methods: {
	}
})

module.exports = Vue.component('vcombobox', Combobox);