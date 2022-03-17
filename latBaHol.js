window.progressBar = {
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
                    if (this.state === "down") {

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
                }, this.maxTime + 500)

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


window.progressBar.init()
scrollEventHandler.init(250)




let settingHandler = {
    toggle : function (){
        var visibility = document.querySelector('#modal').style.visibility ? 'hidden' : 'visible'
        document.querySelector('#modal').style.visibility = visibility
    },
    close : function (ele, event){
        if(event.target.id==='modal'){
            document.querySelector('#modal').style.visibility = 'hidden'
            return
        }

    },
    on : function (event){
        
        // var userName = document.querySelector('#user-name-text-input').value
        var userName = localStorage.userName || ''


        var MDCTextField = mdc.textField.MDCTextField;
        var textField = new MDCTextField(document.querySelector('.mdc-text-field'))
        textField.value = userName
        document.querySelector('#modal').style.visibility = 'visible'
    }, 
    submit: function(){
        var userName = document.querySelector('#user-name-text-input').value || ""
        localStorage.setItem('userName', userName)


        var MDCSnackbar = mdc.snackbar.MDCSnackbar
        var sn = new MDCSnackbar(document.querySelector('.mdc-snackbar'))
        sn.labelText = userName.length>0 ? `저장완료! 우상단 아이콘을 클릭하여 '${userName}' 캐릭터만 필터 가능`
                                           : `유저 닉네임이 없습니다. 닉네임 입력 시 레이드목록에서 보유한 캐릭터 필터가 가능합니다.`
        sn.open()

        settingHandler.toggle()
    },

    filterToggle: function(){
        var setting = localStorage.filtered || false
        setting = setting==='true' ? false : true
        console.log('toggle userName Filter')
    }
}









        





class Raid {
    constructor() {
        this.me = localStorage.getItem('userName') || ''
        this.myCharacter = []
        this.state = 'not init'
        // this.raids = json.raids
        // this.members = json.members
        // this.supports = json.supports
        // this.shortNames = json.shortNames
    }


    init(json){
        this.data = json
        this.raidNode = document.createElement('main')
        this.raidNode.classList.add("mdc-top-app-bar--fixed-adjust", "scroll")
        
        this.state = "data loaded"
        this.setMyCharacter()
        this.setRaidContent()
        console.log(this.state)
    }

    setMyCharacter() {
        if (this.me === '') {
            return
        }

        this.me = Object.values(this.data.members).find(e => e.charName === this.me || e.userName === this.me).userName

        this.myCharacter = Object.keys(this.data.members)
            .filter(charName => {
                return this.data.members[charName].userName === this.me
            })

    }

    setRaidContent() {
        
        this.data.raids.map((raidinfo, raidIdx)=>{
            var dummy = {
                "name": "아브하드1-4",
                "time": "",
                "checkedMember": [
                    "Alccia",
                    "LiereaG",
                    "까칠구름",
                    "뢰창",
                    "폭행강도",
                    "탐라국흑우",
                    "칭뚜오꽌쟈오",
                    "IdleBanana"
                ]
            }

            // 레이드 컨테이이너
            var raidContainer = document.createElement('div')
            raidContainer.classList.add("raid-container")
            raidContainer.addEventListener('click',e=>{e.target.classList.toggle('unfold')})
            raidContainer.id = `raid-${raidIdx}`

            // 레이드 컨테이이너 헤드
            var raidHeader = document.createElement('div')
            var myRaidCharacter = raidinfo.checkedMember
                .find(raidCheckedChar => this.myCharacter.includes(raidCheckedChar))

            raidHeader.classList.add("mdc-card","raid-list","ripple",`list-me${myRaidCharacter ? '' : '-not'}`)


            // TODO myRaidCharacter 세팅
            console.log(myRaidCharacter, raidHeader)
            // TODO 레이드 멤버목록
        })
    }

}







function raidInit() {
    window.progressBar.on()
    fetch('https://script.google.com/macros/s/AKfycbxz8bm2b9BrHUGi3GrgPMdF1kP6cXqjeofI2Q1MWQPNJ-5zs7phHS1c5IGsTFORBHJ6/exec')
        .then(res => res.json())
        .then(json => {

            window.$raid = new Raid()
            window.$raid.init(json)

            console.log($raid)
        })
        .finally(() => {
            window.progressBar.off()
        })
        .catch(err => {
            console.error(err)
            alert('데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.')
        })
}

raidInit()


