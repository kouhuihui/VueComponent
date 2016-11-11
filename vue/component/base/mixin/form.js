/*
* mixin - form表单相关
*/

var BaseMixin = require('./base');
var Class = require('../core/class');

var Form = {
    methods: {
        getValue: function(){
            return (this.val === undefined || this.val === 'undefined' || this.val === null ) ? '' : this.val;
        },
        setValue: function(val){
            this.val = (val === undefined || val === 'undefined' || val === null ) ? (this.val || '') : val;
        }
    }
};

Class.extend(BaseMixin, Form);

module.exports = Form;