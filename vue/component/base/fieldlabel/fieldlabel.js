require('./fieldlabel.css');
var tpl = require('./fieldlabel.jade');
/*
* mixin
*/
var Basemixin = require('../mixin/form');

var FieldLabel = Vue.extend({
	mixins: [Basemixin],
	props:  {
        'isshowlabel': {
            type: Boolean,
            default: true
        }, 
        'required': {
            type: Boolean,
            default: false
        }, 
        'text': {
            type: String
        }, 
        'width': {
            type: String,
            default: '200px'
        }
    },
	template: tpl(),
	data: function () {
		return {
			style: {
				width: this.transformCssUnit(this.width)
			}
		}
	},
	methods:{

	}
})

module.exports = Vue.component('vfieldlabel', FieldLabel);