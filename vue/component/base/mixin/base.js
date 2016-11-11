/*
* mixin - base表单相关
*/

var Base = {
    methods: {
        init: function(){
        },
        transformCssUnit: function(val){
            var type = isNaN(val);
            val = type ? val : val + 'px';
            return val;
        }
    },
    ready: function(){
        this.init();
    }
};

module.exports = Base;