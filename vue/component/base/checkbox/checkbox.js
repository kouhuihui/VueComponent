var tpl = "<div class=\"v-checkbox\" @click=\"doClick($event)\"><label><i class=\"fa\" :class=\"isChecked ? 'fa-check-square-o' :'fa-square-o'\">"
 + "</i><span v-if=\"!hidelabel\">{{fieldlabel}}</span></label></div>";

var Checkbox = Vue.extend({
	props: {
		fieldlabel: {default: ''},
		hidelabel: {default: false},
		isChecked: {default: false}
	},
	template: tpl,
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