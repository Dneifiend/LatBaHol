let progressBar = {
    init: function () {
        this.el = document.querySelectorAll('#progress-bar')
        this._si = []
    },
    on: function () {
        this.el.forEach(el => {
            var highlight = el.querySelector('#progress-bar-highlight')
            highlight.style.background = "linear-gradient(90deg, #045d56 20%, #1eb980 60%, #045d56)"
            el.classList.add('on')
            highlight.classList.toggle('s')

            var _ci = setInterval(() => {
                highlight.classList.toggle('s')
            }, 3000)

            this._si.push(_ci)
        });
    },
    off: function () {
        clearInterval(this._si)
        this.el.forEach(el => {
            var highlight = el.querySelector('#progress-bar-highlight')
            el.classList.remove('on')
            highlight.style.background = null
        })
        this._si.forEach(si => { clearInterval(si) })
    }
}




let scrollEventHandler = {
    rule: undefined,
    timer: 0,
    que: undefined,
    maxTime: 1000,
    state: "stand",
    doingFlag: false,
    changeOpacity: function (val) {
        this.rule.style.boxShadow = `rgba(0, 0, 0, ${val}) 5px 0px 0px 0px inset`
    },
    handler: function (opacity) {
        this.changeOpacity(opacity)
        return wait(this.maxTime / 5)
    },

    el: [],
    init: function (duration) {
        this.maxTime = duration || 1000

        var cssSheet = Object.values(document.styleSheets).find(e => e.href.includes('css.css'));
        var _rule = Object.values(cssSheet.rules).find(e => e.selectorText === ".scroll::-webkit-scrollbar-thumb");
        this.rule = _rule;
        this.rule.style.boxShadow = `rgba(0, 0, 0, 0) 5px 0px 0px 0px inset`


        this.el = document.querySelectorAll('.scroll')
        this.el.forEach(scrollElement => {
            scrollElement.addEventListener('scroll', e => {
                clearTimeout(this.que)
                this.que = setTimeout(() => {
                    if(this.state === "down"){

                        wait(0)
                            .then(_ => this.handler(0.5))
                            .then(_ => this.handler(0.4))
                            .then(_ => this.handler(0.3))
                            .then(_ => this.handler(0.2))
                            .then(_ => this.handler(0.1))
                            .then(_ => this.handler(0.0))
                            .finally(_ => { this.state = "stand"; this.doingFlag = false; })
                    }
                    this.doingFlag = false
                    
                    this.que = null;
                }, this.maxTime+1000)

                if (!this.doingFlag) {
                    this.doingFlag = true

                    if (this.state === "stand") {
                        wait(0)
                            .then(_ => this.handler(0.1))
                            .then(_ => this.handler(0.2))
                            .then(_ => this.handler(0.3))
                            .then(_ => this.handler(0.4))
                            .then(_ => this.handler(0.5))
                            .then(_ => {
                                this.state = "down"
                            })
                    }
                }
            })
        })
    }
}




function wait(time) {
    return new Promise(r => {
        setTimeout(() => {
            r()
        }, time)
    })
}

progressBar.init()
scrollEventHandler.init(250)

