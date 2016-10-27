/**
 * Created by aaron.liu on 15-01-09.
 */
; (function (factory) {
    if (typeof define === 'function' && define.amd) {
        return define(['jquery'], factory);
    } else {
        factory(window.jqueryNew || window.jQuery);
    }
})(function ($) {
    "use strict";
    // 判断浏览器是否为IE8
    function isIE8() {
        var Fragment = document.createDocumentFragment();
        if (Fragment.createElement) {
            return true;
        } else {
            return false;
        }
    }
    function AtSelect(element, options) {
        this.$element = $(element);
        this.options = options;
        this.$menu = $('<div class="bazaSelectMenu"><ul></ul></div>');
        this.init();
    }
    AtSelect.prototype = {
        Constructor: AtSelect,
        init: function () {
            var self = this,
                options = this.options,
                $ele = self.$element;
            $ele.addClass('bazaAutoSelectInput').attr('autocomplete', 'off');
            self.selectedItems = [];  //初始化选中项
            //初始化存放key的隐藏域
            self.$hiddenEl = $ele.parent().find('input[type="hidden"][name="' + options.hiddenName + '"]');
            if (!self.$hiddenEl[0]) {
                self.$hiddenEl = $('<input type="hidden" name="' + options.hiddenName + '" />');
                self.$hiddenEl.insertBefore($ele);
            }
            //email reg
            self.emailReg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            //相似邮箱reg ,需要把真正的邮箱扣出来
            self.similarEmailReg = /([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
            self.$menu.appendTo($('body'));
            self.$menu.width(options.autocompleteWidth);
            //绑定事件
            self.bindEvent();
            self.renderMenuTime = null;
            self.transferValue = $ele.val(); // 转换textarea的值提交表单时用到
            //根据输入框已有的value初始化selectedItems值
            self.filterSelectedItems();
            if ($.isFunction(options.afterInit)) {
                options.afterInit.call(self, options);
            }
        },
        bindEvent: function () {
            var self = this,
                options = self.options;
            self.$element.bind('focus.autoSelect', $.proxy(self.focus, self));
            self.$element.bind('blur.autoSelect', $.proxy(self.blur, self));
            self.$element.bind('paste.autoSelect', function () {
                var _this = $(this);
                setTimeout(function () {
                    self.checkEmailSelect();
                }, 150);
            });
            self.$menu.delegate('li', 'mouseover', function () {
                $(this).addClass('active').siblings().removeClass('active');
            });
            self.$menu.delegate('li', 'click', function (e) {
                self.selectMenu();
                self.$element.focus();
            });
            //移动端输入中文选择不触发key事件
            if (/Mobile/i.test(navigator.userAgent) ||
                (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
                this.$element.bind('input.autoSelect propertychange.autoSelect', $.proxy(self.keyup, self))
            } else {
                self.$element.bind('keyup.autoSelect', $.proxy(self.keyup, self));
            }
            self.$element.bind('keydown.autoSelect', $.proxy(self.keydown, self));
        },
        // menu positon
        getListPos: function () {
            var self = this,
                $ele = self.$element,
                left = $ele.offset().left,
                top = $ele.offset().top;
            var cursorOffset = self.getCursorAreaPosition();
            left += cursorOffset.left - $ele.scrollLeft();
            if (!isIE8()) {
                top += cursorOffset.top + cursorOffset.height - $ele.scrollTop();
            }
            return {
                left: left,
                top: top
            };
        },
        //光标位置相对textarea位置
        getCursorAreaPosition: function (cursorPos) {
            if (document.selection) {
                return this.getIEAreaPosition(cursorPos);
            } else {
                return this.getW3cAreaPosition(cursorPos);
            }
        },
        getIEAreaPosition: function (cursorPos) {
            var h, inputorOffset, offset, x, y;
            offset = this.getIEOffset(cursorPos);
            inputorOffset = this.$element.offset();
            x = offset.left - inputorOffset.left;
            y = offset.top - inputorOffset.top;
            h = offset.height;
            return {
                left: x,
                top: y,
                height: h
            };
        },
        getIEOffset: function (cursorPos) {
            var h, textRange, x, y;
            textRange = this.$element[0].createTextRange();
            cursorPos || (cursorPos = this.getCursorPos());
            textRange.move('character', cursorPos);
            x = textRange.boundingLeft;
            y = textRange.boundingTop;
            h = textRange.boundingHeight;
            return {
                left: x,
                top: y,
                height: h
            };
        },
        getW3cAreaPosition: function (cursorPos) {
            var $inputor, end_range, format, html, mirror, start_range;
            $inputor = this.$element;
            format = function (value) {
                return $('<div></div>').text(value).html().replace(/\r\n|\r|\n/g, '<br/>').replace(/\s/g, '<span style="white-space:pre-wrap;">&nbsp;</span>');
            };
            if (typeof cursorPos === 'undefined') {
                cursorPos = this.getCursorPos();
            }
            start_range = $inputor.val().slice(0, cursorPos);
            end_range = $inputor.val().slice(cursorPos);
            html = "<span style='position: relative; display: inline;'>" + format(start_range) + "</span>";
            html += "<span id='caret' style='position: relative; display: inline;'>|</span>";
            html += "<span style='position: relative; display: inline;'>" + format(end_range) + "</span>";
            mirror = new Mirror($inputor);
            return mirror.create(html).rect();
        },
        // IE光标位置
        getIECursorPos: function () {
            var endRange, inputor, len, normalizedValue, pos, range, textInputRange, self = this;
            inputor = self.$element[0];
            range = document.selection.createRange();
            pos = 0;
            if (range && range.parentElement() === inputor) {
                normalizedValue = inputor.value.replace(/\r\n/g, "\n");
                len = normalizedValue.length;
                textInputRange = inputor.createTextRange();
                textInputRange.moveToBookmark(range.getBookmark());
                endRange = inputor.createTextRange();
                endRange.collapse(false);
                if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                    pos = len;
                } else {
                    pos = -textInputRange.moveStart("character", -len);
                }
            }
            return pos;
        },
        //光标位置
        getCursorPos: function () {
            if (document.selection) {
                return this.getIECursorPos();
            } else {
                return this.$element[0].selectionStart;
            }
        },
        //设置光标位置
        setCursorPos: function (pos) {
            var ele = this.$element[0], range;
            if (document.selection) {
                range = ele.createTextRange();
                range.move("character", pos);
                range.select();
            } else if (ele.setSelectionRange) {
                ele.setSelectionRange(pos, pos);
            }
        },
        getEmailSource: function () {
            var source = this.options.source,
                emails = $.map(source, function (v, k) {
                    return v['email'];
                });
            return emails;
        },
        focus: function (e) {
            //this.lookup();
        },
        blur: function (e) {
            var self = this;
            self.filterSelectedItems();  //过滤选择的items
        },
        keydown: function (e) {
            switch (e.which) {
                //Backspace
                case 8:
                    this.query = this.$element.val();
                    break;
                case 9: // tab
                case 13: // enter
                    //阻止默认事件换行
                    if (this.$menu.is(':visible')) {
                        e.preventDefault();
                    }
                    break;
                default:
                    break;
            }
        },
        keyup: function (e) {
            var menuVisible = this.$menu.is(':visible'), self = this;
            switch (e.which) {
                //backspace
                case 8:
                    if (self.query != '') {
                        this.lookup();
                        return;
                    }
                    break;
                case 13: // enter
                    if (!menuVisible) {
                        return;
                    }
                    this.selectMenu();
                    break;
                case 16: // shift
                case 17: // ctrl
                case 18: // alt
                case 37: //left
                case 39: //right
                    break;
                case 27: // escape
                    this.hideMenu();
                    break;
                case 38: // up arrow
                    e.preventDefault();
                    this.prev();
                    break;
                case 40: // down arrow
                    e.preventDefault();
                    this.next();
                    break;
                case 59://分号
                case 186://IE
                    //核对邮箱选择
                    self.checkEmailSelect();
                    break;
                default:
                    this.lookup();
                    break;
            }
        },
        lookup: function () {
            var self = this,
                options = self.options,
                val = (self.$element.val() || "").replace(/\s$/g, ''),
                insertTplBefore = $.trim(options.insertTpl).replace(/\{\{[^\}]+\}\}.*/, ''),//
                insertTplBeforeLen = insertTplBefore.length,
                atTplBefore = options.at,
                atTplBeforeLen = atTplBefore.length,
                cursorPos = self.getCursorPos(),//光标位置
                cursorBeforeVal = val.substring(0, cursorPos), //光标前的值
                lastIndexOfAtTplBefore = cursorBeforeVal.lastIndexOf(atTplBefore),
                lastIndexOfInsertTplBefore = cursorBeforeVal.lastIndexOf(insertTplBefore),
                atMatchPos = lastIndexOfInsertTplBefore, //at 或 最后一个insertTpl所在的索引
                atMathValLen = atMatchPos + insertTplBeforeLen; // at匹配值第一个字符的索引
            if (lastIndexOfAtTplBefore > lastIndexOfInsertTplBefore) { //
                atMatchPos = lastIndexOfAtTplBefore;
                atMathValLen = atMatchPos + atTplBeforeLen;
            }
            var atMathVal = cursorBeforeVal.substring(atMathValLen),  //at匹配的值
                beforeAtChar = cursorBeforeVal.charAt(atMatchPos - 1); //at前面的一个字符
            options.atTriggerReg.lastIndex = 0;
            if (!cursorBeforeVal || !~atMatchPos || !options.atTriggerReg.test(beforeAtChar)) {
                return;
            } else {
                self.cursorPos = cursorPos; //光标位置
                self.cursorBeforeVal = cursorBeforeVal; //光标前的值
                self.cursorAfterVal = val.substring(cursorPos); //光标后的值
                self.beforeAtVal = cursorBeforeVal.substring(0, atMatchPos); //at 前的字符串
            }
            self.query = atMathVal;
            self.queryItems = $.grep(options.source, function (v, k) {
                return self.matcher(v);
            });
            self.queryItems = self.sorter(self.queryItems);
            var queryItemsLength = self.queryItems.length;
            if (options.commentType === 'job' && queryItemsLength > options.maxItems) {
                var otherUsers = self.queryItems.slice(queryItemsLength - 2, queryItemsLength);
                self.queryItems = self.queryItems.slice(0, options.maxItems - 2);
                self.queryItems = self.queryItems.concat(otherUsers);
            } else {
                self.queryItems = self.queryItems.slice(0, options.maxItems);
            }
            clearTimeout(self.renderMenuTime);
            self.renderMenuTime = setTimeout(function () {
                self.renderMenu(self.queryItems);
            }, 60);
        },
        matcher: function (item) {
            var options = this.options, query = this.query.toLowerCase();
            if (query == '') {
                return item.isRelated;
            }
            var filterField = options.filterField.split(','), filterResult = 0;
            $.each(filterField, function (k, v) {
                filterResult = ~item[v].toLowerCase().indexOf(query);
                if (filterResult) {
                    return false;
                }
            })
            return filterResult;
        },
        sorter: function (items) {
            var options = this.options,
                query = this.query.toLowerCase(),
                item,
                valueDefault = '',
                valueEn = '',
                nearestItems = [], //和查询最接近的
                nearerItems = [],
                nearItems = [];
            while (item = items.shift()) {
                valueDefault = item[options.valueDefault].toLowerCase();
                valueEn = options.valueEn ? item[options.valueEn].toLowerCase() : '';
                if (!valueDefault.indexOf(query) || !valueEn.indexOf(query)) {
                    nearestItems.push(item);
                } else if (~valueDefault.indexOf(query) || ~valueEn.indexOf(query)) {
                    nearerItems.push(item);
                } else {
                    nearItems.push(item)
                }
            }
            return nearestItems.concat(nearerItems, nearItems);
        },
        prev: function (e) {
            var active = this.$menu.find('.active').removeClass('active'),
                prev = active.prev();
            if (!prev.length) {
                prev = this.$menu.find('li').last();
            }
            prev.addClass('active');
        },
        next: function (event) {
            var active = this.$menu.find('.active').removeClass('active'),
                next = active.next();
            if (!next.length) {
                next = $(this.$menu.find('li')[0]);
            }
            next.addClass('active');
        },
        judgeExist: function (source, name, userRoleName) {
            var hasFlag = false, existItem, options = this.options;
            var judgeFn = function (source, isAllSource) {
                $.each(source, function (k, v) {
                    var equalRoleName = userRoleName ? v['userRoleName'] == userRoleName : true;
                    if (v[options.valueDefault] == name && equalRoleName) {
                        existItem = v;
                        if (!isAllSource) {
                            hasFlag = true;
                        }
                        return false;
                    }
                });
            };
            judgeFn(source);  //判断在已选择的数据中是否存在
            if (!hasFlag && typeof existItem === 'undefined') {
                judgeFn(options.source, true); //判断在源数据中是否存在
            }
            return {
                exist: hasFlag,
                existItem: existItem
            };
        },
        selectMenu: function () {
            var self = this,
                options = self.options,
                insertTpl = options.insertTpl,
                activeItem = self.$menu.find('.active'),
                activeData = activeItem.data('item');
            if (activeData['userRole'] != 3) { //非候选人
                insertTpl = insertTpl.replace(/\{\{\{\w+\}\}\}/, '');
            }
            var insertTplVal = insertTpl.replace(/\{\{([^\{\}]+)\}\}/g, function ($0, $1) {
                return activeData[$1];
            }); //插入的模板

            var newVal = self.beforeAtVal + insertTplVal + self.cursorAfterVal,
                newCursorPos = (self.beforeAtVal + insertTplVal).length;  //新光标位置
            if (!options.beforeInsert(newVal)) {
                return;
            }
            self.$element.val(newVal);
            //重新设置光标位置
            self.setCursorPos(newCursorPos);
            var existInfo = self.judgeExist(self.selectedItems, activeData[options['valueDefault']], activeData['userRoleName']);
            if (!existInfo.exist) {
                self.selectedItems.push(existInfo.existItem);
            }
            self.setHiddenVal();
            self.hideMenu();
            if ($.isFunction(options.change)) {
                options.change.call(self, options);
            }
        },
        filterSelectedItems: function () {
            var self = this,
                options = self.options,
                eleVal = self.$element.val(),
                insertTplStr = $.trim(options.insertTpl).replace(/\[/g, '\\[')
                                             .replace(/\]/g, '\\]').replace(/\(/g, '\\(').replace(/\)/g, '\\)'),
                filterReg = /\[~([^@\n\r\t\[\]\{\}]+)(\{([^\}]+)\})?\]/g,
                transferReplaceReg,
                transferReplaceRegStr,
                retItems = [],
                curItemsName,
                curRoleName,
                curItemsNameRegStr,
                roleRegStr,
                existInfo,
                existRetInfo,
                transferTpl;
            self.transferValue = eleVal.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            while ((curItemsName = filterReg.exec(eleVal)) != null) {
                curRoleName = curItemsName[3];
                curItemsName = curItemsName[1];
                existInfo = self.judgeExist(options.source, curItemsName, curRoleName);
                existRetInfo = self.judgeExist(retItems, curItemsName, curRoleName);
                if (existInfo.exist) {
                    //替换转换的值
                    roleRegStr = curRoleName ? '\\{' + curRoleName + '\\}' : '';
                    curItemsNameRegStr = curItemsName.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
                    transferReplaceRegStr = insertTplStr.replace(/\{\{\w+\}\}/, curItemsNameRegStr).replace(/\{\{\{\w+\}\}\}/, roleRegStr);
                    if (!/[^\w]$/.test(transferReplaceRegStr)) { //insertTpl末尾没有特殊字符时
                        transferReplaceRegStr += '(?=[@\\[\\]\n\r\t\\s]+|$)';
                    }
                    transferReplaceReg = new RegExp(transferReplaceRegStr, 'mg');
                    transferTpl = options.transferTpl.replace('{{name}}', existInfo.existItem[options.transferValueField]);
                    self.transferValue = self.transferValue.replace(transferReplaceReg, transferTpl);
                    if (!existRetInfo.exist) { //source里面存在 retItems不存在 则添加
                        retItems.push(existInfo.existItem);
                    }
                }
            }
            self.selectedItems = retItems;
            self.setHiddenVal();
        },
        reloadData: function (data) {
            var self = this,
                options = self.options;
            options.source = data;
            self.selectedItems = [];
            self.transferValue = '';
            self.$hiddenEl.val('');
        },
        setHiddenVal: function (selectedItems) {
            var self = this,
                varStr = '';
            if ($.isArray(self.selectedItems)) {
                varStr += '[';
                $.each(self.selectedItems, function (k, v) {
                    varStr += '{';
                    for (var i in v) {
                        if (v.hasOwnProperty(i)) {
                            varStr += '"' + i + '":"' + v[i] + '",';
                        }
                    }
                    varStr = varStr.replace(/,$/, '');
                    varStr += '},';
                });
                varStr = varStr.replace(/,$/, '');
                varStr += ']';
            }
            this.$hiddenEl.val(varStr);
        },
        checkEmailSelect: function () {
            return;  //暂时屏蔽
            var self = this,
                options = self.options,
                emails = self.getEmailSource(),
                vals = self.$element.val().replace(/；/g, ';'),
                valsArr = vals.replace(/;$/, '').split(';');
            var newVals = vals;
            //根据输入的值判断是否为已存在的邮箱，是则自动选择上
            $.each(valsArr, function (k, v) {
                var index, createPersonMenu;
                self.emailReg.lastIndex = 0;
                self.similarEmailReg.lastIndex = 0;
                var similarEmail = self.similarEmailReg.exec(v),
                    similarMatchStr;
                if (self.emailReg.test(v) && (index = $.inArray(v, emails)) > -1) {
                    similarMatchStr = v;
                    setFilledEmail();
                } else if (similarEmail && (index = $.inArray(similarEmail[0], emails)) > -1) {
                    similarMatchStr = similarEmail['input']
                        .replace(/\(/g, '\\(')
                        .replace(/\)/g, '\\)').replace(/\:/g, '\\:');
                    setFilledEmail();
                }
                function setFilledEmail() {
                    newVals = newVals.replace(new RegExp(similarMatchStr + '(;|$)'), '');
                    self.selectItem(options.source[index]);
                    self.$element.val(newVals);
                }
            });

        },
        transferObjToStr: function (obj) {
            if (typeof JSON === 'object' && typeof JSON.stringify === 'function') {
                return JSON.stringify(obj);
            }
            var self = this,
                retStr = '';
            if (obj === null || obj === undefined || typeof obj === 'number' || typeof obj === 'boolean' || obj instanceof Function) {
                retStr = '"' + String(obj) + '"';
            } else if (typeof obj === 'string') {
                retStr = '"' + obj + '"';
            } else if ($.isArray(obj)) {
                retStr += '[';
                for (var i, j = obj.length; i < j; i++) {
                    retStr += self.transferObjToStr(obj[i]);
                    if (i < j - 1) {
                        retStr += ',';
                    }
                }
                retStr += ']';
            } else if ($.isPlainObject(obj)) {
                retStr += '{';
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        retStr += '"' + (i + '') + '":';
                        retStr += self.transferObjToStr(obj[i]) + ',';
                    }
                }
                retStr = retStr.substring(0, retStr.length - 1);
                retStr += '}';
            } else if (obj instanceof Date) {
                retStr = obj.getTime();
            }
            return retStr;
        },
        hideMenu: function () {
            this.$menu.hide();
        },
        renderMenu: function (items) {
            var self = this, options = self.options, menuReg = /{{(\w+)}}/g, menu = self.$menu;
            self.hasAddLine = false;
            if (items.length == 0) {
                self.hideMenu();
                return;
            }
            items = $.map(items.slice(0, options.maxItems), function (v, k) {
                var key,
                    itemContent = options.menuItemTpl;
                // 根据传入的模板替换相应的内容
                while (key = menuReg.exec(options.menuItemTpl)) {
                    itemContent = itemContent.replace(new RegExp('\{\{' + key[1] + '\}\}', 'g'), v[key[1]]);
                }
                var itemStr = self.transferObjToStr(v);
                var str = '';
                if (options.commentType === 'job' && !self.hasAddLine && v.type == 1 && self.query == '') {
                    str += '<p class="bazaSelectMenuTipsBox">@小猎或其他用户</p>';
                    self.hasAddLine = true;
                }
                str += '<li title="' + v[options['valueDefault']] + '" data-item=\'' + itemStr + '\'>' +
                        itemContent +
                    '</li>';
                return str;
            });
            menu.empty().append('<ul>' + items.join('') + '</ul>');
            menu.show().find('li:first').addClass('active');
            var menuPos = self.getListPos(),
                curLeft = menuPos.left;
            if (curLeft + menu.width() > document.body.scrollWidth) {
                menu.css({
                    right: 0
                });
            } else {
                menu.css({
                    left: curLeft
                });
            }
            menu.css("top", menuPos.top);
        },
        destroy: function () {
            this.$element.removeClass('bazaAutoSelectInput');
            $(document).unbind('click.autoSelect');
            self.$element.unbind('focus.autoSelect');
            self.$element.unbind('blur.autoSelect');
            self.$element.unbind('paste.autoSelect');
            self.$element.unbind('keyup.autoSelect');
            self.$element.unbind('keydown.autoSelect');
            $.cleanData($('.bazaSelectMenu'));
            $('.bazaSelectMenu').remove();
        }
    };
    $.fn.AtSelect = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('AtSelect'),
                opts = typeof option === 'object' ? option : {},
                options = $.extend({}, $.fn.AtSelect.defaults, opts);
            var init = function () {
                $this.data('AtSelect', (data = new AtSelect($this[0], options)));
                $this.trigger('atSelect.finish');
            };
            if (!data) {
                if (options.source) {
                    init();
                } else if (options.remote) {
                    $.get(options.remote, function (result) {
                        if (typeof result == 'string') {
                            result = $.parseJSON(result);
                        }
                        if (result['success'] || result['succeeded']) {
                            options.source = result['data'];
                            init();
                        } else {
                            alert(result['message']);
                        }
                    })
                }
            } else {
                data.reloadData(option.source || []);
            }
            if (typeof option === 'string') {
                data[option]();
            }
        });
    };
    $.fn.AtSelect.defaults = {
        at: '@', //at匹配字符
        atTriggerReg: /^[^\w]?$/, //根据at前面的字符触发at正则
        insertTpl: '@{{name}}', //at插入值模板
        menuItemTpl: '{{name}}({{departmentName}})', //menu 显示项内容模板
        transferTpl: '<a:{{name}}>', //提交时转换template
        maxItems: 10, //搜索智能提示的数量限制
        commentType: 'job', // 评论类型
        hiddenName: 'ids', //存储key的隐藏域名字
        source: null, //静态数据源
        remote: '/AtsApi/GetInterviewerShortInfos', //远程数据源地址
        key: 'id', //数据源key字段
        valueDefault: 'name',//数据源默认名字字段
        valueEn: '',//数据源英文名字段
        filterField: 'name',//输入时过滤的字段
        transferValueField: 'name',//将输入at的值转为需要值的字段用来存储
        autocompleteWidth: 'auto', // 智能提示下拉框宽度
        afterInit: null,  //初始化完成事件
        change: null, //选择时触发change事件
        beforeInsert: function (val) {
            return true;
        }
    };
    $.fn.AtSelect.Constructor = AtSelect;

    $(document).bind('click.autoSelect', function (e) {
        var target = $(e.target);
        if (!target.is('.bazaSelectMenu')
            && !target.parents('.bazaSelectMenu').length) {
            $('.bazaSelectMenu').hide();
        }
    });

    // mirrors
    function Mirror($inputor) {
        this.$inputor = $inputor;
    }
    Mirror.prototype.css_attr = ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopStyle", "borderRightStyle", "borderBottomStyle", "borderLeftStyle", "borderTopWidth", "boxSizing", "fontFamily", "fontSize", "fontWeight", "height", "letterSpacing", "lineHeight", "marginBottom", "marginLeft", "marginRight", "marginTop", "outlineWidth", "overflow", "overflowX", "overflowY", "paddingBottom", "paddingLeft", "paddingRight", "paddingTop", "textAlign", "textOverflow", "textTransform", "whiteSpace", "wordBreak", "wordWrap"];
    Mirror.prototype.mirrorCss = function () {
        var css,
            _this = this,
            inputOffset = _this.$inputor.offset();
        css = {
            position: 'absolute',
            left: inputOffset.left,
            top: inputOffset.top,
            opacity: 0,
            zIndex: -20000
        };
        if (this.$inputor.is('textarea')) {
            this.css_attr.push('width');
        }
        $.each(this.css_attr, function (i, p) {
            return css[p] = _this.$inputor.css(p);
        });
        return css;
    };
    Mirror.prototype.create = function (html) {
        this.$mirror = $('.mirrorWidgetBox');
        if (!this.$mirror[0]) {
            this.$mirror = $('<div class="mirrorWidgetBox"></div>');
            this.$inputor.after(this.$mirror);
        }
        this.$mirror.show().css(this.mirrorCss());
        this.$mirror.html(html);
        return this;
    };
    Mirror.prototype.rect = function () {
        var $flag, pos, rect;
        $flag = this.$mirror.find("#caret");
        pos = $flag.position();
        rect = {
            left: pos.left,
            top: pos.top,
            height: $flag.height()
        };
        this.$mirror.hide();
        return rect;
    };
    return AtSelect;
});