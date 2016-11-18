/*
* 分页组件: pager
* @params:
*       type: 分页类型（‘加载更多:more’和‘页码展示:page’），默认为页码展示
*       total: 总条数
*       pagesize: 每一页显示数
*       count: 一共多少页，默认为0
*       currentpage: 当前页，默认为0（第一页）
*       predisabled: 上一页按钮是否不可点击，默认为true
*       nextdisabled: 下一页按钮是否不可点击，默认为false
*/


require('./pager.css');
var tpl = require('./pager.jade');

/*
* mixin
*/
var BaseMixin = require('../mixin/base');

var Pager = Vue.extend({
    mixins: [BaseMixin],
    props: ['type', 'total', 'pagesize'],
    template: tpl(),
    data: function(){
        return {
            currentpage: 0,
            predisabled: false,
            nextdisabled: false,
            vtype: this.type || 'page'
        }
    },
    methods: {
        doPage: function(){
            this.$dispatch('pager', this.currentpage);
        },
        doPre: function(){
            this.currentpage--;
            this.doPage();
        },
        doNext: function(){
            this.currentpage++;
            this.doPage();
        },
        doJump: function(index){
            this.setCurrentPage(index);
            this.doPage();
        },
        setCurrentPage: function(index){
            this.currentpage = index;
        }
    },
    computed: {
        count: function(){
            this.total = this.total || 0;
            this.pagesize = this.pagesize || 10;
            return Math.ceil(this.total / this.pagesize);
        },
        predisabled: function(){
            return this.currentpage === 0 ? true : false;
        },
        nextdisabled: function(){
            return this.currentpage === this.count - 1 ? true : false;
        }
    }
});

module.exports = Vue.component('vpager', Pager);