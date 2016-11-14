/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(5);
	__webpack_require__(11);
	__webpack_require__(18);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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
	var tpl = __webpack_require__(2);

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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(3);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div :class=\"'btn-' + filling + ' btn-' + theme + ' btn-' + size + (disabled ? ' disabled' : '')\" @click=\"doClick\" class=\"v-button btn\"><i v-if=\"icon\" :class=\"icon\" class=\"fa\"></i><span v-text=\"text\"></span></div>");;return buf.join("");
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */

	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];

	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }

	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }

	  return a;
	};

	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */

	function nulls(val) {
	  return val != null && val !== '';
	}

	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) :
	    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
	    [val]).filter(nulls).join(' ');
	}

	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};


	exports.style = function (val) {
	  if (val && typeof val === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
	                   'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' +
	                   'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};

	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse){
	  var buf = [];

	  var keys = Object.keys(obj);

	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i]
	        , val = obj[key];

	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }

	  return buf.join('');
	};

	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */

	var jade_encode_html_rules = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};
	var jade_match_html = /[&<>"]/g;

	function jade_encode_char(c) {
	  return jade_encode_html_rules[c] || c;
	}

	exports.escape = jade_escape;
	function jade_escape(html){
	  var result = String(html).replace(jade_match_html, jade_encode_char);
	  if (result === '' + html) return html;
	  else return result;
	};

	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */

	exports.rethrow = function rethrow(err, filename, lineno, str){
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(4).readFileSync(filename, 'utf8')
	  } catch (ex) {
	    rethrow(err, null, lineno)
	  }
	  var context = 3
	    , lines = str.split('\n')
	    , start = Math.max(lineno - context, 0)
	    , end = Math.min(lines.length, lineno + context);

	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');

	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno
	    + '\n' + context + '\n\n' + err.message;
	  throw err;
	};

	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(6);
	var tpl = __webpack_require__(10);

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(7);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(9)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./Checkbox.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./Checkbox.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(8)();
	// imports


	// module
	exports.push([module.id, ".v-checkbox {\r\n    display: inline-block;\r\n}\r\n\r\n.v-checkbox label:hover {\r\n    color: #1992fd;\r\n    cursor: pointer;\r\n }\r\n.v-checkbox i {\r\n    width: 13px;\r\n    margin-right: 10px;\r\n    }\r\n.v-checkbox .fa-check-square-o {\r\n    color: $#1992fd;\r\n}", ""]);

	// exports


/***/ },
/* 8 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(3);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div class=\"v-checkbox\"><label @click=\"doClick($event)\"><i :class=\"isChecked ? 'fa-check-square-o': 'fa-square-o'\" class=\"fa\"></i><span v-if=\"!hidelabel\">{{{ fieldlabel }}}</span></label></div>");;return buf.join("");
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

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
	__webpack_require__(12)
	var tpl = __webpack_require__(14);

	/*
	* mixin
	*/
	var FormMixin = __webpack_require__(15);

	var Combobox = Vue.extend({	
	    mixins: [FormMixin],
		props: ['width', 'store', 'filedlabel', 'hidelabel', 'placeholder', 'required', 'labelwidth','displayvalue', 'displaytext','allowedit'],
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
	            isautocomplete: false,
	            expand: false,
	            isreadonly: this.allowedit || false,
			}
		},
		methods: {
			init:function(){
				this.$body = $(this.$el);
				this.$input = this.$body.find('input');
			},
			doClick:function(){
				this.$input.focus();
				this.expand = !this.expand;
			}
		}
	})

	module.exports = Vue.component('vcombobox', Combobox);

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(13);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(9)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./combobox.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./combobox.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(8)();
	// imports


	// module
	exports.push([module.id, ".combobox {\r\n    height: 40px;\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.combobox>div {\r\n    float: left\r\n}\r\n\r\n.combobox .combobox-label {\r\n    padding-top: 10px;\r\n}\r\n\r\n.combobox .combobox-body {\r\n    height: 100%;\r\n    position: relative;\r\n}\r\n\r\n.combobox .combobox-body ul {\r\n    position: absolute;\r\n    width: 100%;\r\n    max-height: 210px;\r\n    overflow-y: scroll;\r\n    margin: 0;\r\n    padding: 5px 0;\r\n    list-style: none;\r\n    border: 1px solid #1992fd;\r\n    z-index: 99999;\r\n    cursor: pointer;\r\n    background-color: #fff\r\n}\r\n\r\n.combobox .combobox-body ul li {\r\n    padding-left: 10px\r\n}\r\n\r\n.combobox .combobox-body ul li.selected,.combobox .combobox-body ul li:hover {\r\n    color: #fff;\r\n    background-color: #1992fd\r\n}\r\n\r\n.combobox .combobox-body .combobox-field {\r\n    height: 100%;\r\n    position: relative;\r\n    padding-left: 0;\r\n}\r\n\r\n.combobox .combobox-body .combobox-field.active {\r\n    border-color: #1992fd\r\n}\r\n\r\n.combobox .combobox-body .combobox-field input {\r\n    display: inline-block;\r\n    width: 100%;\r\n    height: 100%;\r\n    padding-right: 20px;\r\n    border: none\r\n}\r\n.combobox .combobox-body .combobox-field i {\r\n    position: absolute;\r\n    top: 30%;\r\n    right: 8px\r\n}\r\n.combobox .combobox-body span {\r\n    color: #f96868\r\n}\r\n\r\n.combobox .combobox-body.autocomplete .combobox-field input {\r\n    padding-right: 0;\r\n    padding-left: 25px\r\n}\r\n\r\n.combobox .combobox-body.autocomplete .combobox-field i {\r\n    width: 20px;\r\n    left: 8px;\r\n    top: 32%\r\n}\r\n\r\n.combobox .required-tip {\r\n    color: #f96868;\r\n    margin-right: 3px\r\n}\r\n", ""]);

	// exports


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(3);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div class=\"combobox\"><div v-if=\"isshowlabel\" :style=\"labelstyle\" class=\"combobox-label\"><span v-if=\"isrequired\" class=\"required-tip\">*</span>{{ labeltext }}:</div><div :style=\"bodystyle\" class=\"combobox-body\"><div :class=\"{ 'active': expand }\" class=\"combobox-field form-control\"><i v-if=\"isautocomplete\" class=\"fa fa-search\"></i><input v-model=\"inputText\" :readOnly=\"!isreadonly\" class=\"form-control\"><i v-if=\"!isautocomplete\" :class=\"expand ? 'fa-angle-up' : 'fa-angle-down' \" @click=\"doClick\" class=\"fa\"></i></div><ul v-show=\"expand\"><template v-if=\"store.length &gt; 0\"><li v-for=\"option in store\">{{{ option[vdisplaytext] }}}</li></template><template v-else><li v-else>暂无数据</li></template></ul></div></div>");;return buf.join("");
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/*
	* mixin - form表单相关
	*/

	var BaseMixin = __webpack_require__(16);
	var Class = __webpack_require__(17);

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

/***/ },
/* 16 */
/***/ function(module, exports) {

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

/***/ },
/* 17 */
/***/ function(module, exports) {

	/*
	* 基础类 class
	*/
	var Class = {
	    extend: function(_parent, _child){
	        for(var i in _parent){
	            if(typeof _parent[i] === 'function'){
	                _child[i] = _parent[i];
	            }else{
	                for(var j in _parent[i]){
	                    _child[i][j] = _parent[i][j];
	                }
	            }
	        }
	    }
	}

	module.exports = Class;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(19);
	var tpl = __webpack_require__(21);
	/*
	* mixin
	*/
	var Basemixin = __webpack_require__(15);

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

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(20);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(9)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./fieldlabel.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./fieldlabel.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(8)();
	// imports


	// module
	exports.push([module.id, ".fieldlabel{\r\n\tpadding-top: 10px;\r\n}\r\n\r\n.fieldlabel .required-tip{\r\n\tcolor: red;\r\n\tmargin-top: 3px;\r\n}", ""]);

	// exports


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(3);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div :style=\"style\" class=\"fieldlabel\"><span v-if=\"required\" class=\"required-tip\">*</span>{{text}}</div>");;return buf.join("");
	}

/***/ }
/******/ ]);