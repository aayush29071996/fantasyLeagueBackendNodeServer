/*
 *  custombox v3.0.0 - 2015-08-04
 *  Modal Window Effects with transitions CSS3.
 *  http://dixso.github.io/custombox/
 *  (c) 2015 Julio de la Calle - @dixso9
 *
 *  Under MIT License - http://opensource.org/licenses/MIT
 */

!function(a, b) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define(b) : a.Custombox = b()
}(this, function() {
    "use strict";
    var a = {
        target: null,
        cache: !1,
        escKey: !0,
        zIndex: 9999,
        overlay: !0,
        overlayColor: "#000",
        overlayOpacity: .8,
        overlayClose: !0,
        overlaySpeed: 300,
        overlayEffect: "auto",
        width: null,
        effect: "fadein",
        position: ["center", "center"],
        animation: null,
        speed: 500,
        loading: !1,
        open: null,
        complete: null,
        close: null
    }
      , b = {
        oldIE: navigator.appVersion.indexOf("MSIE 8.") > -1 || navigator.appVersion.indexOf("MSIE 9.") > -1,
        oldMobile: /(iPhone|iPad|iPod)\sOS\s6/.test(navigator.userAgent),
        overlay: {
            perspective: ["letmein", "makeway", "slip"],
            together: ["corner", "slidetogether", "scale", "door", "push", "contentscale", "simplegenie", "slit", "slip"]
        },
        modal: {
            position: ["slide", "flip", "rotate"],
            animationend: ["swell", "rotatedown", "flash"]
        }
    }
      , c = {
        set: function(c) {
            if (this.cb && this.cb.length || (this.cb = [],
            this.item = -1),
            this.item++,
            c && "auto" === c.zIndex) {
                for (var d = 0, e = 0, f = document.getElementsByTagName("*"), g = f.length; g > e; e += 1) {
                    var h = window.getComputedStyle(f[e]).getPropertyValue("z-index");
                    h && (h = +h,
                    h > d && (d = h))
                }
                c.zIndex = d
            }
            this.cb.push({
                settings: b.oldIE && "undefined" != typeof cbExtendObjects ? cbExtendObjects({}, a, c) : Object.assign({}, a, c)
            }),
            "auto" === this.cb[this.item].settings.overlayEffect && (this.cb[this.item].settings.overlayEffect = this.cb[this.item].settings.effect)
        },
        get: function() {
            return this.cb[this.cb.length - 1] || null
        },
        init: function() {
            document.documentElement.classList.add("custombox-open"),
            document.documentElement.classList.add("custombox-open-" + this.cb[this.item].settings.overlayEffect),
            b.overlay.perspective.indexOf(this.cb[this.item].settings.overlayEffect) > -1 && (this.cb[this.item].scroll = document.documentElement && document.documentElement.scrollTop || document.body && document.body.scrollTop || 0,
            document.documentElement.classList.add("custombox-perspective"),
            window.scrollTo(0, 0)),
            this.main || this.built("container"),
            this.cb[this.item].settings.loading && this.cb[this.item].settings.loading.parent && this.built("loading"),
            this.cb[this.item].settings.overlay ? this.built("overlay").built("modal").open() : this.built("modal").open(),
            this.binds()
        },
        zIndex: function() {
            for (var a = 0, b = 0, c = document.getElementsByTagName("*"), d = c.length; d > b; b += 1) {
                var e = window.getComputedStyle(c[b]).getPropertyValue("z-index");
                e && (e = +e,
                e > a && (a = e))
            }
            return a
        },
        built: function(a) {
            var c;
            switch ("undefined" != typeof this.item && (c = this.cb[this.item]),
            a) {
            case "container":
                for (this.main = document.createElement("div"); document.body.firstChild; )
                    this.main.appendChild(document.body.firstChild);
                document.body.appendChild(this.main);
                break;
            case "overlay":
                c.overlay || (c.overlay = {}),
                c.overlay = document.createElement("div"),
                c.overlay.classList.add("custombox-overlay"),
                c.overlay.classList.add("custombox-overlay-" + c.settings.overlayEffect),
                c.overlay.style.zIndex = c.settings.zIndex + 2,
                c.overlay.style.backgroundColor = c.settings.overlayColor,
                b.overlay.perspective.indexOf(c.settings.overlayEffect) > -1 || b.overlay.together.indexOf(c.settings.overlayEffect) > -1 ? c.overlay.style.opacity = c.settings.overlayOpacity : c.overlay.classList.add("custombox-overlay-default"),
                c.overlay.style.transitionDuration = b.overlay.together.indexOf(c.settings.overlayEffect) > -1 ? c.settings.speed + "ms" : c.settings.overlaySpeed + "ms",
                document.body.insertBefore(c.overlay, document.body.lastChild.nextSibling);
                break;
            case "modal":
                "push" === c.settings.overlayEffect && (this.main.style.transitionDuration = c.settings.speed + "ms"),
                this.main.classList.add("custombox-container"),
                this.main.classList.add("custombox-container-" + c.settings.overlayEffect),
                c.wrapper = document.createElement("div"),
                c.wrapper.classList.add("custombox-modal-wrapper"),
                c.wrapper.classList.add("custombox-modal-wrapper-" + c.settings.effect),
                c.wrapper.style.zIndex = c.settings.zIndex + 3,
                document.body.insertBefore(c.wrapper, document.body.lastChild.nextSibling),
                c.container = document.createElement("div"),
                c.container.classList.add("custombox-modal-container"),
                c.container.classList.add("custombox-modal-container-" + c.settings.effect),
                c.container.style.zIndex = c.settings.zIndex + 4,
                b.modal.position.indexOf(c.settings.effect) > -1 && null === c.settings.animation && (c.settings.animation = "slide" === c.settings.effect ? ["top"] : "flip" === c.settings.effect ? ["horizontal"] : ["bottom"]),
                c.modal = document.createElement("div"),
                c.modal.classList.add("custombox-modal"),
                c.modal.classList.add("custombox-modal-" + c.settings.effect + (b.modal.position.indexOf(c.settings.effect) > -1 ? "-" + c.settings.animation[0].trim() : "")),
                c.modal.style.transitionDuration = c.settings.speed + "ms",
                c.modal.style.zIndex = c.settings.zIndex + 4,
                c.wrapper.appendChild(c.container).appendChild(c.modal);
                break;
            case "loading":
                this.loading = document.createElement("div"),
                this.loading.classList.add("custombox-loading");
                for (var d = document.createElement("div"), e = 0, f = this.cb[this.item].settings.loading.parent.length; f > e; e++)
                    d.classList.add(this.cb[this.item].settings.loading.parent[e]);
                if (this.loading.appendChild(d),
                this.loading.style.zIndex = c.settings.zIndex + 3,
                this.cb[this.item].settings.loading.childrens)
                    for (var g = 0, h = this.cb[this.item].settings.loading.childrens.length; h > g; g++) {
                        for (var i = document.createElement("div"), j = 0, k = this.cb[this.item].settings.loading.childrens[g].length; k > j; j++)
                            i.classList.add(this.cb[this.item].settings.loading.childrens[g][j]);
                        d.appendChild(i)
                    }
                document.body.appendChild(this.loading)
            }
            return this
        },
        load: function() {
            var a = this.cb[this.item];
            if ("function" == typeof a.settings.open && a.settings.open.call(),
            document.createEvent) {
                var b = document.createEvent("Event");
                b.initEvent("custombox.open", !0, !0),
                document.dispatchEvent(b)
            }
            return null !== a.settings.target && Array.isArray(a.settings.position) ? "#" === a.settings.target.charAt(0) || "." === a.settings.target.charAt(0) && "/" !== a.settings.target.charAt(1) ? document.querySelector(a.settings.target) ? (a.inline = document.createElement("div"),
            a.content = document.querySelector(a.settings.target),
            a.display = "none" === a.content.style.display,
            a.content.style.display = "block",
            a.content.parentNode.insertBefore(a.inline, a.content),
            this.size()) : this.error() : this.ajax() : this.error(),
            this
        },
        size: function() {
            var a = this.cb[this.item]
              , c = a.content.offsetWidth;
            if (b.oldIE && (window.innerHeight = document.documentElement.clientHeight),
            a.inline || (b.oldIE ? a.content.style.styleFloat = "none" : a.content.style.cssFloat = "none"),
            null !== a.settings.width && (isNaN(a.settings.width) ? (c = window.innerWidth,
            a.content.style.height = window.innerHeight + "px") : c = parseInt(a.settings.width, 0)),
            a.size = c,
            a.size + 60 >= window.innerWidth) {
                a.container.style.width = "auto",
                "full" !== a.settings.width && (a.container.style.margin = "5%"),
                a.wrapper.style.width = window.innerWidth + "px";
                for (var d = 0, e = a.content.querySelectorAll(":scope > *"), f = e.length; f > d; d++)
                    e[d].offsetWidth > window.innerWidth && (e[d].style.width = "auto")
            } else {
                switch (a.settings.position[0].trim()) {
                case "left":
                    a.container.style.marginLeft = 0;
                    break;
                case "right":
                    a.container.style.marginRight = 0
                }
                a.container.style.width = a.size + "px"
            }
            if (a.content.style.width = "auto",
            a.modal.appendChild(a.content),
            a.content.offsetHeight >= window.innerHeight && "full" !== a.settings.width)
                a.container.style.marginTop = "5%",
                a.container.style.marginBottom = "5%";
            else {
                var g;
                switch (a.settings.position[1].trim()) {
                case "top":
                    g = 0;
                    break;
                case "bottom":
                    g = window.innerHeight - a.content.offsetHeight + "px";
                    break;
                default:
                    g = window.innerHeight / 2 - a.content.offsetHeight / 2 + "px"
                }
                a.container.style.marginTop = g
            }
            this.loading && (document.body.removeChild(this.loading),
            delete this.loading),
            a.wrapper.classList.add("custombox-modal-open")
        },
        ajax: function() {
            var a = this
              , c = a.cb[a.item]
              , d = new XMLHttpRequest
              , e = document.createElement("div");
            d.onreadystatechange = function() {
                4 === d.readyState && (200 === d.status ? (e.innerHTML = d.responseText,
                c.content = e,
                c.content.style.display = "block",
                b.oldIE ? c.content.style.styleFloat = "left" : c.content.style.cssFloat = "left",
                c.container.appendChild(c.content),
                a.size()) : a.error())
            }
            ,
            d.open("GET", c.settings.target + (c.settings.cache ? "" : (/[?].+=/.test(c.settings.target) ? "&_=" : "?_=") + Date.now()), !0),
            d.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
            d.send(null)
        },
        scrollbar: function() {
            var a = document.createElement("div");
            a.classList.add("custombox-scrollbar"),
            document.body.appendChild(a);
            var b = a.offsetWidth - a.clientWidth;
            return document.body.removeChild(a),
            b
        },
        open: function() {
            var a = this
              , c = a.cb[a.item]
              , d = a.scrollbar();
            if (d && (document.body.style.paddingRight = d + "px"),
            a.main.classList.add("custombox-container-open"),
            c.settings.overlay)
                if (b.overlay.perspective.indexOf(c.settings.overlayEffect) > -1 || b.overlay.together.indexOf(c.settings.overlayEffect) > -1 ? c.overlay.classList.add("custombox-overlay-open") : c.overlay.style.opacity = c.settings.overlayOpacity,
                b.overlay.together.indexOf(c.settings.overlayEffect) > -1 || b.oldIE)
                    a.load(),
                    c.inline && c.wrapper.classList.add("custombox-modal-open");
                else {
                    var e = function() {
                        c.overlay.removeEventListener("transitionend", e),
                        a.load(),
                        c.inline && c.wrapper.classList.add("custombox-modal-open")
                    };
                    c.overlay.addEventListener("transitionend", e, !1)
                }
            else
                a.load(),
                c.inline && c.wrapper.classList.add("custombox-modal-open");
            return a
        },
        clean: function(a) {
            var c = this
              , d = this.cb[a];
            if (document.documentElement.classList.remove("custombox-open-" + d.settings.overlayEffect),
            d.settings.overlay && (d.overlay.style.opacity && (d.overlay.style.opacity = 0),
            d.overlay.classList.remove("custombox-overlay-open"),
            c.main.classList.remove("custombox-container-open")),
            b.oldIE || b.oldMobile || !d.overlay)
                c.remove(a);
            else {
                var e = function() {
                    d.overlay.removeEventListener("transitionend", e),
                    c.remove(a)
                };
                d.overlay.addEventListener("transitionend", e, !1)
            }
        },
        remove: function(a) {
            var c = this
              , d = this.cb[a];
            if (1 === c.cb.length && (document.documentElement.classList.remove("custombox-open", "custombox-perspective"),
            c.scrollbar() && (document.body.style.paddingRight = 0),
            "undefined" != typeof d.scroll && window.scrollTo(0, d.scroll)),
            d.inline && (b.oldIE ? (d.content.style.removeAttribute("width"),
            d.content.style.removeAttribute("height"),
            d.content.style.removeAttribute("display")) : (d.content.style.removeProperty("width"),
            d.content.style.removeProperty("height"),
            d.content.style.removeProperty("display")),
            d.display && (d.content.style.display = "none"),
            d.inline.parentNode.replaceChild(d.content, d.inline)),
            c.main.classList.remove("custombox-container-" + d.settings.overlayEffect),
            d.wrapper.parentNode.removeChild(d.wrapper),
            d.settings.overlay && d.overlay.parentNode.removeChild(d.overlay),
            "function" == typeof d.settings.close && d.settings.close.call(),
            document.createEvent) {
                var e = document.createEvent("Event");
                e.initEvent("custombox.close", !0, !0),
                document.dispatchEvent(e)
            }
            if (1 === c.cb.length) {
                for (var f = document.querySelectorAll(".custombox-container > *"), g = 0, h = f.length; h > g; g++)
                    document.body.insertBefore(f[g], c.main);
                c.main.parentNode && c.main.parentNode.removeChild(c.main),
                delete c.main
            }
            c.cb.splice(a, 1)
        },
        close: function(a) {
            var c, d = this;
            if (a) {
                for (var e = 0, f = this.cb.length; f > e; e++)
                    if (this.cb[e].settings.target === a) {
                        c = e;
                        break
                    }
            } else
                c = d.cb.length - 1;
            var g = d.cb[c];
            if (b.modal.position.indexOf(g.settings.effect) > -1 && g.settings.animation.length > 1 && (g.modal.classList.remove("custombox-modal-" + g.settings.effect + "-" + g.settings.animation[0]),
            g.modal.classList.add("custombox-modal-" + g.settings.effect + "-" + g.settings.animation[1].trim())),
            g.wrapper.classList.remove("custombox-modal-open"),
            b.oldIE || b.oldMobile || b.overlay.together.indexOf(g.settings.overlayEffect) > -1)
                d.clean(c);
            else {
                var h = function() {
                    g.wrapper.removeEventListener("transitionend", h),
                    d.clean(c)
                };
                b.modal.animationend.indexOf(g.settings.effect) > -1 ? g.wrapper.addEventListener("animationend", h, !1) : g.wrapper.addEventListener("transitionend", h, !1)
            }
        },
        responsive: function() {
            b.oldIE && (window.innerHeight = document.documentElement.clientHeight);
            for (var a, c = 0, d = this.cb.length; d > c; c++) {
                if (this.cb[c].size + 60 >= window.innerWidth)
                    "full" !== this.cb[c].settings.width && (this.cb[c].container.style.marginLeft = "5%",
                    this.cb[c].container.style.marginRight = "5%"),
                    this.cb[c].container.style.width = "auto",
                    this.cb[c].wrapper.style.width = window.innerWidth + "px";
                else {
                    switch (this.cb[c].settings.position[0].trim()) {
                    case "left":
                        this.cb[c].container.style.marginLeft = 0;
                        break;
                    case "right":
                        this.cb[c].container.style.marginRight = 0;
                        break;
                    default:
                        this.cb[c].container.style.marginLeft = "auto",
                        this.cb[c].container.style.marginRight = "auto"
                    }
                    this.cb[c].container.style.width = this.cb[c].size + "px",
                    this.cb[c].wrapper.style.width = "auto"
                }
                if (this.cb[c].content.offsetHeight >= window.innerHeight && "full" !== this.cb[c].settings.width)
                    this.cb[c].container.style.marginTop = "5%",
                    this.cb[c].container.style.marginBottom = "5%";
                else {
                    switch (this.cb[c].settings.position[1].trim()) {
                    case "top":
                        a = 0;
                        break;
                    case "bottom":
                        a = window.innerHeight - this.cb[c].content.offsetHeight + "px";
                        break;
                    default:
                        a = window.innerHeight / 2 - this.cb[c].content.offsetHeight / 2 + "px"
                    }
                    this.cb[c].container.style.marginTop = a
                }
            }
        },
        binds: function() {
            var a = this
              , c = a.cb[a.item]
              , d = !1;
            1 === a.cb.length && (a.esc = function(b) {
                1 === a.cb.length && document.removeEventListener("keydown", a.esc),
                b = b || window.event,
                !d && 27 === b.keyCode && a.get() && a.get().settings.escKey && (d = !0,
                a.close())
            }
            ,
            document.addEventListener("keydown", a.esc, !1),
            window.addEventListener("onorientationchange"in window ? "orientationchange" : "resize", function() {
                a.responsive()
            }, !1)),
            c.wrapper.event = function(b) {
                1 === a.cb.length && document.removeEventListener("keydown", c.wrapper.event),
                !d && b.target === c.wrapper && a.get() && a.get().settings.overlayClose && (d = !0,
                a.close())
            }
            ,
            c.wrapper.addEventListener("click", c.wrapper.event, !1),
            document.addEventListener("custombox.close", function() {
                d = !1
            });
            var e = function() {
                if (!c.inline)
                    for (var a = 0, b = c.modal.getElementsByTagName("script"), d = b.length; d > a; a++)
                        new Function(b[a].text)();
                if (c.settings && "function" == typeof c.settings.complete && c.settings.complete.call(),
                document.createEvent) {
                    var e = document.createEvent("Event");
                    e.initEvent("custombox.complete", !0, !0),
                    document.dispatchEvent(e)
                }
            }
              , f = function() {
                e(),
                c.modal.removeEventListener("transitionend", f)
            };
            b.oldIE || b.oldMobile ? setTimeout(function() {
                e()
            }, c.settings.overlaySpeed) : "slit" !== c.settings.effect ? c.modal.addEventListener("transitionend", f, !1) : c.modal.addEventListener("animationend", f, !1)
        },
        error: function() {
            var a = this
              , b = a.cb.length - 1;
            alert("Error to load this target: " + a.cb[b].settings.target),
            a.remove(b)
        }
    };
    return {
        set: function(a) {
            a.autobuild && c.built("container")
        },
        open: function(a) {
            c.set(a),
            c.init()
        },
        close: function(a) {
            c.close(a)
        }
    }
});
