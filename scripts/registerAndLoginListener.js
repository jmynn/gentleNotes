import { inputListener, ID_LOGIN_REGISTER, loginOrRegister} from './resources.js'
//===========================================================
export function registerOrLoginListener (event){ //ф-я определения произошедшего события и вызов функции авторизации/регистрации в зависимости от него
    if(event === 'register'){
        //?=================VARIABLES============================
        const regForm = document.forms['regForm']
        //*================EVENTS================================
        regForm.addEventListener('submit', e => {
            e.preventDefault()
            loginOrRegister(e.target, ID_LOGIN_REGISTER.regInputLogin, ID_LOGIN_REGISTER.regInputPassword, event)
        })
    }
    if(event === 'login'){
        //?=================VARIABLES============================
        const logForm = document.forms['logForm']
        //*================EVENTS================================
        logForm.addEventListener('submit', e => {
            e.preventDefault()
            loginOrRegister(e.target, ID_LOGIN_REGISTER.logInputLogin, ID_LOGIN_REGISTER.logInputPassword, event)
        })
    }
    if(event === 'admin'){
        //?=================VARIABLES============================
        const adminForm = document.forms['adminForm']
        //*================EVENTS================================
        adminForm.addEventListener('submit', e => {
            e.preventDefault()
            loginOrRegister(e.target, ID_LOGIN_REGISTER.logInputLoginAdmin, ID_LOGIN_REGISTER.logInputPasswordAdmin, event)
        })
    }
    //=======================================================
    document.querySelectorAll('input').forEach(item => { //удаление предупреждающей подстветки с полей авторизации при фокусе на них
        item.addEventListener('focus', e => {
            inputListener(e.target)
        })
    })
}
