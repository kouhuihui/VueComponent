/*
* 按钮组件: button
* @params:
*       theme: 主题，默认为default
*       filling: 按钮形状（默认为full格式）
*           @params:
*               full: 填充
*               hollow： 空心
*       size: 按钮大小，默认为medium
*       text: 按钮文本，默认为‘确定’
*       icon: 按钮图标
*/
/*var tpl = "<div class=\"v-button btn\" :class=\"'btn-'+ filling +' btn-' + theme +' btn-' + size + (disabled ? ' disabled' : '')\" @click=\"doClick\">"+ 
			"<i class=\"fa\" v-if=\"icon\" :class=\"icon\"></i><span v-text=\"text\"></span></div>";
*/
var tpl = require('./button.jade');

var Button = Vue.extend({
	props: {
		theme: {default: 'default'},
		filling: {default: 'full'},
		size: {default: 'medium'},
		disabled: {default: false},
		text: {default: '确定'}
	},
	template: tpl(),
	methods:{
		doClick: function(ev){
			if(this.disabled){
				return;
			}
			this.theme = "primary";
		},
		enable: function(){
			this.disabled = false;
		},
		disable: function(){
			this.disabled = true;
		}
	}
})

module.exports = Vue.component('vbutton', Button);