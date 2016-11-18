/*
* 输入框组件: textfield
* @params:
*       val: 输入值
*       type: 输入框类型，默认为text
*       width: 输入框宽度，默认为200px
*       fieldlabel：前置label名
*       hidelabel: 是否隐藏label，默认为false
*       labelwidth：输入框对应label宽度
*       placeholder: 空白时显示的提示文案
*       required: 是否必填，默认为false
*       isempty: 是否为空，默认为false
*       regex: 正则校验
*       validated: 校验是否通过，默认为true
*       rows: 当type为textarea时行高，默认为6行
*       maxlength: 最大字数
*       showchange: 是否显示》还可以输入X个字 ，默认false
*       
*/

require('./textfield.css');
var tpl = require('./textfield.jade');

/*
* mixin
*/
var FormMixin = require('../mixin/form');

/*
* 依赖base组件
*/
require('../fieldlabel/fieldlabel');

var Textfield = Vue.extend({
    mixins: [FormMixin],
    props: ['width', 'val', 'name', 'type', 'readonly', 'hidelabel', 'fieldlabel', 'labelwidth', 'placeholder', 'required', 'emptytext', 'validatetext', 'regex', 'rows', 'maxlength', 'showchange', 'displaytext', 'filetype', 'filemaxsize', 'maxupload', 'action'],
    template: tpl(),
    data: function(){
        return {
            vtype: this.type || 'text',
            pholder:  this.placeholder,
            isrequired: this.required && this.required !== 'false' ? true : false,
            isempty: false,
            validated: true,
            showchange: this.showchange || false,
            contentlength: !isNaN(this.maxlength) ? this.maxlength : 0,
            vvalidatetext: this.validatetext || '格式不正确',
            displaytext: this.displaytext || '请上传附件',
            maxUploadNum: parseInt(this.maxupload, 10) || 0,
            currentUploadNum: 0,
            filetype: this.filetype || '',
            filemaxsize: this.filemaxsize || 0,           
            rows: this.rows || 6,
            bodystyle: {
                width:  this.transformCssUnit(this.width || '60px')
            }
        }
    },
    methods: {
        init: function(){
            if(this.type === 'file'){
                var _self = this;
                this.fileForm = $(this.$el).find('form');
                this.fileInput = this.fileForm.find('input[type="file"]');
                this.fileInput.attr('accept', this.filetype);
                this.fileForm.ajaxForm({
                    beforeSubmit: function () {
                        if (_self.maxUploadNum === 0 && _self.filemaxsize === 0) {
                            return true;
                        }
                        if (_self.checkValueBeforeUpload() === false) {
                            return false;
                        }                        
                    },
                    success: function (rtn) {
                        try {
                            rtn = JSON.parse(rtn);
                        }catch(err){
                            rtn = rtn || {};
                        }
                        rtn.data = rtn.data || {};
                        _self.val = rtn.data.url || '';
                        _self.doValidate();
                        _self.$dispatch('fileupload', rtn);
                    }
                });
            }
            this.$body = $(this.$el).find('.form-control');
            this.regex = this.regex && new RegExp(this.regex);
        },
        /*
        * 添加限制字数处理逻辑
        */
        computeNum: function(val){
            if(!this.maxlength){
                return;
            }
            this.contentlength = this.maxlength - val.length;
            if(this.contentlength <= 0){
                var substringVal = val.substring(0,this.maxlength);
                this.setValue(substringVal);
                this.contentlength = 0;
            }          
        },
        setContentLength: function(val){
            if(!this.maxlength || val === undefined || val === 'undefined' || val === null){
                return;
            }   
            this.contentlength = this.maxlength - val.length;
        },
        focus: function(){
            this.$body && this.$body.focus();
        },
        selectAll: function(){
            this.$body && this.$body.select();
        },
        /*
        * 为空检测
        */
        emptyCheck: function(){
            if(!this.isrequired){
                this.isempty = false;
                return true;
            }
            if(this.val === '' || this.val === undefined || this.val === null){
                this.isempty = true;
                this.vvalidatetext = this.emptytext;
            }else{
                this.isempty = false;
            }
            return !this.isempty;
        },
        /*
        * 正则检测
        */
        validatedCheck: function(){
            if(!this.regex || (!this.val && !this.isrequired)){
                this.validated = true;
                return true;
            }
            this.validated = this.regex.test(this.val);
            if(!this.validated){
                this.vvalidatetext = this.validatetext;
            }
        },
        doValidate: function(){
            this.emptyCheck() && this.validatedCheck();
            return !this.isempty && this.validated;
        },
        setValidate: function(bool, msg){
            this.vvalidatetext = msg || this.vvalidatetext;
            this.validated = bool;
        },
        /*
        *清除所有验证信息,还原初始状态
        */
        clearValidate: function(){
            this.validated = true;
            this.isempty = false;
        },
        /*
        * 添加focus判断，解决IE下placeholder触发input事件bug
        */
        doKeyUp: function(e){
            if(!$(e.target).is(':focus')){
                return;
            }
            if(this.doValidate()){
                this.$dispatch('input', this.val);
                this.computeNum(this.val);
            }else{
                this.$dispatch('validatefail', this.val);
            }
        },
        doChange: function(e){
            this.$dispatch('change', this.val);
        },
        doUpload: function(e){
            if(this.fileInput.val()){
                this.fileForm.submit();
            }
        },        
        /*
        * keycode为"enter"触发事件
        */
        doEnter: function(e){
            this.$dispatch('enter', e, this.val);
        },
        reset: function () {
            this.currentUploadNum = 0;
            if (this.fileInput) {
                this.fileInput.val('');
                this.currentUploadNum = 0;
            }
            this.setValue('');
        },
        checkValueBeforeUpload: function () {
            if (this.maxUploadNum !== 0 && this.currentUploadNum + 1 > this.maxUploadNum) {
                dialog.alert('最多能上传 ' + this.maxUploadNum + ' 个文件！');
                return false;
            }
            var fileSize = '';
            if (!browser.isIE9()) {
                fileSize = this.fileInput[0].files[0].size;
                if (this.filemaxsize < fileSize) {
                    dialog.alert('最大能上传 ' + this.filemaxsize / (1024 * 1024) + 'M 文件！');
                    return false;
                }
            }
        }

    },
    watch: {
        'val': function(){
            // 兼容IE9-10下v-model bug
            if (browser.isIE9() || browser.isIE10()) {
                this.$body && this.$body.val(this.val);
            }
            var _self = this;
            if(_self.ticker){
                clearTimeout(_self.ticker);
            }
            _self.ticker = setTimeout(function(){
                _self.$dispatch('valuechange', _self.val);
                _self.ticker = null;
            }, 300);
        }
    }
});

Vue.filter('vtrim', {
    read: function(val){
        return val;
    },
    write: function(val){
        return val.trim();
    }
});

module.exports = Vue.component('vtextfield', Textfield);