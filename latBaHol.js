window.progressBar = {
    init: function () {
        this.el = document.querySelectorAll('#progress-bar')
        this._si = []
    },
    on: function () {
        this.el.forEach(el => {
            var highlight = el.querySelector('#progress-bar-highlight')
            highlight.style.background = "#1eb980"
            el.classList.add('on')
            highlight.classList.toggle('s')

            var _ci = setInterval(() => {
                highlight.classList.toggle('s')
            }, 1500)

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
    setFilterBtnInit(){
        var setting = localStorage.filtered==='true' ? true : false
        var btn = document.querySelector('#filter-toggle-btn')
        if(setting){
            btn.style.setProperty('color','var(--primary-hightlight)','important')
        }
        if(!setting){
            btn.style.setProperty('color','rgb(151, 151, 151)','important')
        }
    },
    filterToggle: function(){
        var setting = localStorage.filtered==='true' ? true : false
        setting = !setting
        var btn = document.querySelector('#filter-toggle-btn')
        
        if(setting){
            btn.style.setProperty('color','var(--primary-hightlight)','important')
            document.querySelectorAll('.raid-container:not(.me)').forEach(d=>{d.classList.add('hidden')})
        }
        if(!setting){
            btn.style.setProperty('color','rgb(151, 151, 151)','important')
            document.querySelectorAll('.raid-container:not(.me)').forEach(d=>{d.classList.remove('hidden')})
        }
        localStorage.setItem('filtered', setting)
    }
}
settingHandler.setFilterBtnInit()








        





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

            raidContainer.addEventListener('click',e=>{
                if(!e.target.classList.contains('raid-list')){
                    return
                }
                raidContainer.classList.toggle('unfold');
                raidMemberContainer.style.height = raidContainer.classList.contains('unfold') ? `calc(0.5rem + ${65*Math.round((raidinfo.checkedMember.length+1)/2)}px + 0.5rem)` : '70px';
            })
            
            raidContainer.id = `raid-${raidIdx}`

            // 레이드 컨테이이너 헤드
            var raidHeader = document.createElement('div')
            
            var myRaidCharacter = raidinfo.checkedMember
                .find(raidCheckedChar => this.myCharacter.includes(raidCheckedChar))

            raidHeader.classList.add("mdc-card","raid-list","ripple",'list')

            if(myRaidCharacter){
                raidHeader.classList.add('me')
                raidContainer.classList.add('me')
            }
            if(!myRaidCharacter && localStorage.getItem('filtered')==='true'){
                raidContainer.classList.add('hidden')
            }
            

            // 레이드 컨테이이너 헤드 이름
            var raidNameContainer = document.createElement('div')
            raidNameContainer.classList.add("raid-name-container")
            var arrowUp = document.createElement('i')
            var arrowDown = document.createElement('i')
            var arrows = [arrowUp,arrowDown]
            arrows.forEach(arrow=>{
                arrow.classList.add('material-icons','mdc-button__icon','text-white-2')
                arrow.areahidden = true
            })
            arrowUp.classList.add('arrow-up')
            arrowDown.classList.add('arrow-down')
            arrowUp.textContent = 'keyboard_arrow_up'
            arrowDown.textContent = 'keyboard_arrow_down'

            var raidNameSpan = document.createElement('span')
            raidNameSpan.classList.add('raid-name')
            raidNameSpan.textContent = raidinfo.name

            var raidTimeSapn = document.createElement('span')
            raidTimeSapn.classList.add('raid-time','text-white-2')
            raidTimeSapn.textContent = raidinfo.time==='' ? '' : `(${raidinfo.time})`

            raidNameContainer.append(arrowUp,arrowDown,raidNameSpan,raidTimeSapn)


            // 레이드 리스트 정보
            var raidListInfo = document.createElement('div')
            raidListInfo.classList.add("raid-list-info")
            
            var myCharSpan = document.createElement('span')
            myCharSpan.classList.add('text-color-highlight','m2-s-e')
            myCharSpan.textContent = myRaidCharacter
            var peopleIco = document.createElement('i')
            peopleIco.classList.add('material-icons','mdc-button__icon','text-white-2')
            peopleIco.textContent = 'people'
            var memberCountSpan = document.createElement('span')
            memberCountSpan.classList.add('text-white-2')
            memberCountSpan.textContent = `×${raidinfo.checkedMember.length}`
            raidListInfo.append(myCharSpan,peopleIco,memberCountSpan)

            raidHeader.append(raidNameContainer,raidListInfo)
            raidContainer.append(raidHeader)



            // 레이드 멤버 목록
            var raidMemberContainer = document.createElement('div')
            raidMemberContainer.classList.add("raid-member-container")
            var raidMemberList = document.createElement('div')
            raidMemberList.classList.add("raid-member-list")

            var minmax = getMinMaxIlv(raidinfo.checkedMember)
            console.log(minmax,raidinfo.checkedMember)

            raidinfo.checkedMember.forEach((raidMember, raidMemberIdx)=>{
                var raidMemberSimpleContainer = document.createElement('div')
                raidMemberSimpleContainer.classList.add("raid-member-simple")
                if(raidMember === myRaidCharacter){
                    raidMemberSimpleContainer.classList.add('me')
                }

                var raidMemberDiv = document.createElement('div')
                var userNameSpan = document.createElement('span')
                userNameSpan.classList.add('big','user-name')
                var charNameSpan = document.createElement('span')
                charNameSpan.classList.add('char-name')
                userNameSpan.textContent = this.data.members[raidMember]?.userName
                charNameSpan.textContent = `(${raidMember})`
                raidMemberDiv.append(userNameSpan,charNameSpan)

                // 캐릭터 뱃지 컨테이너
                var charBadgeContainer = document.createElement('div')
                charBadgeContainer.classList.add("char-badge-container")
                
                // iLv
                var iLvSpan = document.createElement('span')
                var iLv = this.data.members[raidMember]?.iLv
                iLvSpan.classList.add('badge','iLv')
                iLvSpan.textContent = iLv
                iLvSpan.style.backgroundColor = getMinMaxColor(iLv, minmax.maxLv, minmax.minLv,[0,93,86,1],[9,48,44,1])
                charBadgeContainer.append(iLvSpan)

                // classJob
                var classJobSpan = document.createElement('span')
                classJobSpan.classList.add('badge','job')
                classJobSpan.textContent = this.data.members[raidMember]?.job
                charBadgeContainer.append(classJobSpan)


                raidMemberSimpleContainer.append(raidMemberDiv,charBadgeContainer)
                raidMemberList.append(raidMemberSimpleContainer)
            })

            raidMemberContainer.append(raidMemberList)

            raidContainer.append(raidMemberContainer)



            // TODO 레이드 완료버튼
            if (raidinfo.time === "완료") {
                raidHeader.classList.add("complete")
                raidMemberContainer.classList.add("complete")

                var completeButtonContainer = document.createElement('div')
                completeButtonContainer.classList.add("complete-button-container",'disabled')
                var completeIcon = document.createElement('i')
                completeIcon.classList.add('material-icons', 'mdc-button__icon')
                completeIcon.textContent = 'fact_check'
                var completeBtnSpan = document.createElement('span')
                completeBtnSpan.style.paddingLeft = "0.4rem"
                completeBtnSpan.textContent = '완료된 레이드'
                completeButtonContainer.append(completeIcon, completeBtnSpan)
                raidMemberList.append(completeButtonContainer)

            }
            if (raidinfo.time !== "완료") {
                var completeButtonContainer = document.createElement('div')
                completeButtonContainer.classList.add("complete-button-container", "ripple", "primary")
                var completeIcon = document.createElement('i')
                completeIcon.classList.add('material-icons', 'mdc-button__icon')
                completeIcon.textContent = 'fact_check'
                var completeBtnSpan = document.createElement('span')
                completeBtnSpan.style.paddingLeft = "0.4rem"
                completeBtnSpan.textContent = '이 레이드 완료'
                completeButtonContainer.addEventListener('click', _ => {
                    // post로 레이드 이름, 시간을 보내 시간을 완료로 변경
                    alert(raidIdx)
                })
                completeButtonContainer.append(completeIcon, completeBtnSpan)
                raidMemberList.append(completeButtonContainer)
            }

            









            document.querySelector('main').append(raidContainer)
            console.log(myRaidCharacter, raidContainer)
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


function getMinMaxIlv(characters=[]){
    var iLvs = characters.map(charname=>window.$raid.data.members[charname].iLv)
    var minLv = Math.min(...iLvs)
    var maxLv = Math.max(...iLvs)
    return {minLv,maxLv}
}


function getMinMaxColor(iLv=50,minLv=0, maxLv=100,minRGBA=[0,0,0,0], maxRGBA=[255,255,255,0]){
    var percent = (iLv-minLv)/(maxLv-minLv)
    var r = minRGBA[0] + (maxRGBA[0]-minRGBA[0])*percent
    var g = minRGBA[1] + (maxRGBA[1]-minRGBA[1])*percent
    var b = minRGBA[2] + (maxRGBA[2]-minRGBA[2])*percent
    var a = minRGBA[3] + (maxRGBA[3]-minRGBA[3])*percent
    return `rgba(${r},${g},${b},${a})`
}