/*
 *  custombox v3.0.0 - 2015-08-04
 *  Modal Window Effects with transitions CSS3.
 *  http://dixso.github.io/custombox/
 *  (c) 2015 Julio de la Calle - @dixso9
 *
 *  dataset - https://gist.github.com/brettz9/4093766
 *  classList - http://purl.eligrey.com/github/classList.js/blob/master/classList.js
 *  addEventListener - https://gist.github.com/2864711/946225eb3822c203e8d6218095d888aac5e1748e
 *  :scope polyfill - http://stackoverflow.com/questions/6481612/queryselector-search-immediate-children
 *  forEach - http://es5.github.com/#x15.4.4.18
 *  Object.assign() - https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/assign
 *  Array.isArray() - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
 *
 *  Under MIT License - http://opensource.org/licenses/MIT
 */

function cbExtendObjects() {
    for (var a = 1, b = arguments.length; b > a; a++)
        for (var c in arguments[a])
            arguments[a].hasOwnProperty(c) && (arguments[0][c] = arguments[a][c]);
    return arguments[0]
}
if (function(a) {
    a.getComputedStyle || (a.getComputedStyle = function(a) {
        return this.el = a,
        this.getPropertyValue = function(b) {
            var c = /(\-([a-z]){1})/g;
            return "float" == b && (b = "styleFloat"),
            c.test(b) && (b = b.replace(c, function() {
                return arguments[2].toUpperCase()
            })),
            a.currentStyle[b] ? a.currentStyle[b] : null
        }
        ,
        this
    }
    )
}(window),
Function.prototype.bind || (Function.prototype.bind = function(a) {
    "use strict";
    if ("function" != typeof this)
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    var b = Array.prototype.slice.call(arguments, 1)
      , c = this
      , d = function() {}
      , e = function() {
        return c.apply(this instanceof d && a ? this : a, b.concat(Array.prototype.slice.call(arguments)))
    };
    return d.prototype = this.prototype,
    e.prototype = new d,
    e
}
),
function() {
    "use strict";
    var a = Object.prototype
      , b = a.__defineGetter__
      , c = a.__defineSetter__
      , d = a.__lookupGetter__
      , e = a.__lookupSetter__
      , f = a.hasOwnProperty;
    b && c && d && e && (Object.defineProperty || (Object.defineProperty = function(a, g, h) {
        if (arguments.length < 3)
            throw new TypeError("Arguments not optional");
        if (g += "",
        f.call(h, "value") && (d.call(a, g) || e.call(a, g) || (a[g] = h.value),
        f.call(h, "get") || f.call(h, "set")))
            throw new TypeError("Cannot specify an accessor and a value");
        if (!(h.writable && h.enumerable && h.configurable))
            throw new TypeError("This implementation of Object.defineProperty does not support false for configurable, enumerable, or writable.");
        return h.get && b.call(a, g, h.get),
        h.set && c.call(a, g, h.set),
        a
    }
    ),
    Object.getOwnPropertyDescriptor || (Object.getOwnPropertyDescriptor = function(a, b) {
        if (arguments.length < 2)
            throw new TypeError("Arguments not optional.");
        b += "";
        var c = {
            configurable: !0,
            enumerable: !0,
            writable: !0
        }
          , g = d.call(a, b)
          , h = e.call(a, b);
        return f.call(a, b) ? g || h ? (delete c.writable,
        c.get = c.set = void 0,
        g && (c.get = g),
        h && (c.set = h),
        c) : (c.value = a[b],
        c) : c
    }
    ),
    Object.defineProperties || (Object.defineProperties = function(a, b) {
        var c;
        for (c in b)
            f.call(b, c) && Object.defineProperty(a, c, b[c])
    }
    ))
}(),
!(document.documentElement.dataset || Object.getOwnPropertyDescriptor(Element.prototype, "dataset") && Object.getOwnPropertyDescriptor(Element.prototype, "dataset").get)) {
    var propDescriptor = {
        enumerable: !0,
        get: function() {
            "use strict";
            var a, b, c, d, e, f, g = this, h = this.attributes, i = h.length, j = function(a) {
                return a.charAt(1).toUpperCase()
            }, k = function() {
                return this
            }, l = function(a, b) {
                return "undefined" != typeof b ? this.setAttribute(a, b) : this.removeAttribute(a)
            };
            try {
                ({}).__defineGetter__("test", function() {}),
                b = {}
            } catch (m) {
                b = document.createElement("div")
            }
            for (a = 0; i > a; a++)
                if (f = h[a],
                f && f.name && /^data-\w[\w\-]*$/.test(f.name)) {
                    c = f.value,
                    d = f.name,
                    e = d.substr(5).replace(/-./g, j);
                    try {
                        Object.defineProperty(b, e, {
                            enumerable: this.enumerable,
                            get: k.bind(c || ""),
                            set: l.bind(g, d)
                        })
                    } catch (n) {
                        b[e] = c
                    }
                }
            return b
        }
    };
    try {
        Object.defineProperty(Element.prototype, "dataset", propDescriptor)
    } catch (e) {
        propDescriptor.enumerable = !1,
        Object.defineProperty(Element.prototype, "dataset", propDescriptor)
    }
}
"document"in self && ("classList"in document.createElement("_") ? !function() {
    "use strict";
    var a = document.createElement("_");
    if (a.classList.add("c1", "c2"),
    !a.classList.contains("c2")) {
        var b = function(a) {
            var b = DOMTokenList.prototype[a];
            DOMTokenList.prototype[a] = function(a) {
                var c, d = arguments.length;
                for (c = 0; d > c; c++)
                    a = arguments[c],
                    b.call(this, a)
            }
        };
        b("add"),
        b("remove")
    }
    if (a.classList.toggle("c3", !1),
    a.classList.contains("c3")) {
        var c = DOMTokenList.prototype.toggle;
        DOMTokenList.prototype.toggle = function(a, b) {
            return 1 in arguments && !this.contains(a) == !b ? b : c.call(this, a)
        }
    }
    a = null
}() : !function(a) {
    "use strict";
    if ("Element"in a) {
        var b = "classList"
          , c = "prototype"
          , d = a.Element[c]
          , e = Object
          , f = String[c].trim || function() {
            return this.replace(/^\s+|\s+$/g, "")
        }
          , g = Array[c].indexOf || function(a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a)
                    return b;
            return -1
        }
          , h = function(a, b) {
            this.name = a,
            this.code = DOMException[a],
            this.message = b
        }
          , i = function(a, b) {
            if ("" === b)
                throw new h("SYNTAX_ERR","An invalid or illegal string was specified");
            if (/\s/.test(b))
                throw new h("INVALID_CHARACTER_ERR","String contains an invalid character");
            return g.call(a, b)
        }
          , j = function(a) {
            for (var b = f.call(a.getAttribute("class") || ""), c = b ? b.split(/\s+/) : [], d = 0, e = c.length; e > d; d++)
                this.push(c[d]);
            this._updateClassName = function() {
                a.setAttribute("class", this.toString())
            }
        }
          , k = j[c] = []
          , l = function() {
            return new j(this)
        };
        if (h[c] = Error[c],
        k.item = function(a) {
            return this[a] || null
        }
        ,
        k.contains = function(a) {
            return a += "",
            -1 !== i(this, a)
        }
        ,
        k.add = function() {
            var a, b = arguments, c = 0, d = b.length, e = !1;
            do
                a = b[c] + "",
                -1 === i(this, a) && (this.push(a),
                e = !0);
            while (++c < d);e && this._updateClassName()
        }
        ,
        k.remove = function() {
            var a, b, c = arguments, d = 0, e = c.length, f = !1;
            do
                for (a = c[d] + "",
                b = i(this, a); -1 !== b; )
                    this.splice(b, 1),
                    f = !0,
                    b = i(this, a);
            while (++d < e);f && this._updateClassName()
        }
        ,
        k.toggle = function(a, b) {
            a += "";
            var c = this.contains(a)
              , d = c ? b !== !0 && "remove" : b !== !1 && "add";
            return d && this[d](a),
            b === !0 || b === !1 ? b : !c
        }
        ,
        k.toString = function() {
            return this.join(" ")
        }
        ,
        e.defineProperty) {
            var m = {
                get: l,
                enumerable: !0,
                configurable: !0
            };
            try {
                e.defineProperty(d, b, m)
            } catch (n) {
                -2146823252 === n.number && (m.enumerable = !1,
                e.defineProperty(d, b, m))
            }
        } else
            e[c].__defineGetter__ && d.__defineGetter__(b, l)
    }
}(self)),
String.prototype.trim || !function() {
    var a = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    String.prototype.trim = function() {
        return this.replace(a, "")
    }
}(),
Array.prototype.indexOf || (Array.prototype.indexOf = function(a, b) {
    var c;
    if (null == this)
        throw new TypeError('"this" is null or not defined');
    var d = Object(this)
      , e = d.length >>> 0;
    if (0 === e)
        return -1;
    var f = +b || 0;
    if (1 / 0 === Math.abs(f) && (f = 0),
    f >= e)
        return -1;
    for (c = Math.max(f >= 0 ? f : e - Math.abs(f), 0); e > c; ) {
        if (c in d && d[c] === a)
            return c;
        c++
    }
    return -1
}
),
function(a, b, c) {
    if ((!a.addEventListener || !a.removeEventListener) && a.attachEvent && a.detachEvent) {
        var d = function(a) {
            return "function" == typeof a
        }
          , e = function(a, b) {
            var d = b[c];
            if (d)
                for (var e, f = d.length; f--; )
                    if (e = d[f],
                    e[0] === a)
                        return e[1]
        }
          , f = function(a, b, d) {
            var f = b[c] || (b[c] = []);
            return e(a, b) || (f[f.length] = [a, d],
            d)
        }
          , g = function(a) {
            var c = b[a];
            b[a] = function(a) {
                return j(c(a))
            }
        }
          , h = function(c, e) {
            if (d(e)) {
                var g = this;
                g.attachEvent("on" + c, f(g, e, function(c) {
                    c = c || a.event,
                    c.preventDefault = c.preventDefault || function() {
                        c.returnValue = !1
                    }
                    ,
                    c.stopPropagation = c.stopPropagation || function() {
                        c.cancelBubble = !0
                    }
                    ,
                    c.target = c.target || c.srcElement || b.documentElement,
                    c.currentTarget = c.currentTarget || g,
                    c.timeStamp = c.timeStamp || (new Date).getTime(),
                    e.call(g, c)
                }))
            }
        }
          , i = function(a, b) {
            if (d(b)) {
                var c = this
                  , f = e(c, b);
                f && c.detachEvent("on" + a, f)
            }
        }
          , j = function(a) {
            var b = a.length;
            if (b)
                for (; b--; )
                    a[b].addEventListener = h,
                    a[b].removeEventListener = i;
            else
                a.addEventListener = h,
                a.removeEventListener = i;
            return a
        };
        if (j([b, a]),
        "Element"in a) {
            var k = a.Element;
            k.prototype.addEventListener = h,
            k.prototype.removeEventListener = i
        } else
            b.attachEvent("onreadystatechange", function() {
                j(b.all)
            }),
            g("getElementsByTagName"),
            g("getElementById"),
            g("createElement"),
            j(b.all)
    }
}(window, document, "x-ms-event-listeners"),
Array.prototype.forEach || (Array.prototype.forEach = function(a, b) {
    "use strict";
    var c, d;
    if (null == this)
        throw new TypeError("this is null or not defined");
    var e, f = Object(this), g = f.length >>> 0;
    if ("[object Function]" !== {}.toString.call(a))
        throw new TypeError(a + " is not a function");
    for (arguments.length >= 2 && (c = b),
    d = 0; g > d; )
        d in f && (e = f[d],
        a.call(c, e, d, f)),
        d++
}
),
function(a, b) {
    try {
        a.querySelector(":scope body")
    } catch (c) {
        ["querySelector", "querySelectorAll"].forEach(function(c) {
            var d = b[c];
            b[c] = function(b) {
                if (/(^|,)\s*:scope/.test(b)) {
                    var e = this.id;
                    this.id = "ID_" + Date.now(),
                    b = b.replace(/((^|,)\s*):scope/g, "$1#" + this.id);
                    var f = a[c](b);
                    return this.id = e,
                    f
                }
                return d.call(this, b)
            }
        })
    }
}(window.document, Element.prototype),
-1 === navigator.appVersion.indexOf("MSIE 8.") && -1 === navigator.appVersion.indexOf("MSIE 9.") && (Object.assign || Object.defineProperty(Object, "assign", {
    enumerable: !1,
    configurable: !0,
    writable: !0,
    value: function(a) {
        "use strict";
        if (void 0 === a || null === a)
            throw new TypeError("Cannot convert first argument to object");
        for (var b = Object(a), c = 1; c < arguments.length; c++) {
            var d = arguments[c];
            if (void 0 !== d && null !== d)
                for (var e = Object.keys(Object(d)), f = 0, g = e.length; g > f; f++) {
                    var h = e[f]
                      , i = Object.getOwnPropertyDescriptor(d, h);
                    void 0 !== i && i.enumerable && (b[h] = d[h])
                }
        }
        return b
    }
})),
Array.isArray || (Array.isArray = function(a) {
    return "[object Array]" === Object.prototype.toString.call(a)
}
);
