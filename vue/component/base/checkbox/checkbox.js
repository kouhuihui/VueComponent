require("./Checkbox.css");
var tpl = require("./Checkbox.jade");

var Checkbox = Vue.extend({
	props: {
		fieldlabel: {default: ''},
		hidelabel: {default: false},
		isChecked: {default: false}
	},
	template: tpl(),
	methods:{
		init: function(){
			this.hidelabel = (this.hidelabel === 'false' || this.hidelabel === false) ? false : true;
		},
		doClick: function(){
			this.isChecked = !this.isChecked;
			alert(this.isChecked);
		},
		setValue: function(val){
			this.isChecked = val;
		},
		getValue: function(val){
			return this.isChecked;
		}
	}
})

module.exports = Vue.component('vcheckbox', Checkbox);