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

// progressBar.init()
// progressBar.on()