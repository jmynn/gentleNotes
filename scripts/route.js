import { fetchBookReader } from "./fetchBookReader.js"
import { JL, AdminPanel, Blog, Developer, ErrorPage, Login, Main, Personal, Register } from "./pages.js"
import { root, ID, CLASSES, toggleActivePersonalSection, personalSections, getCurrentStatePersonal, SS, openPopup, burgerMenuClick, closeMenu, burgerMenu, returnBMLValue, panelRebuild, sessionKeys, fillBlog, fetchJsonPostToServer, adminPanelSection, searchPostWhenInputChange, showWarningMessage, createIconForExit } from './resources.js'
import { animates, lazyLoading } from "./intersectionObserver.js"
import { registerOrLoginListener } from "./registerAndLoginListener.js"
import { jl } from "./jl.js"

if(!returnBMLValue(false)){ // изменения состояния бургер меню
    returnBMLValue(true)
    burgerMenu.addEventListener('click', () => burgerMenuClick()) //обработчик события клика по бургре меню
}

export const route = event => { //ф-я перехода на другую страницу
    event = event || window.event
    event.preventDefault()
    window.history.pushState({}, "", event.target.href) //смена  адреса в строке и истории
    handleLocation() //загрузка шаблона страницы
}
const routes = { //пути страниц и функции отображения
    "ErrorPage": ErrorPage,
    "/": Main,
    "/login" : Login,
    "/register" : Register,
    "/bookreader" : fetchBookReader,
    "/dev" : Developer,
    "/blog" : Blog,
    "/adminpanel" : AdminPanel,
    "/personal" : Personal,
    "/jl" : JL
}
const handleLocation = async () => { //ф-я загрузки интерфейса в зависимости от адреса страницы на которую перешли
    burgerMenu.classList.contains('active') ? closeMenu('handleLocation') : null
    //===========================================================
    const path = window.location.pathname
    const routePage = routes[path] || routes['ErrorPage']
    const html = routePage()
    root.innerHTML = html
    //===========================================================
    scrollTo(0, 0) //скролл страниы на самую верхнюю позицию
    //===========================================================
    if(root.getAttribute('data-section') && path !== "/bookreader") {
        document.querySelector('.container').className = 'container'
        root.removeAttribute('data-section')
        document.getElementById('js-si')?.parentNode.removeChild(document.getElementById('js-si'))
        document.getElementById('js-hi')?.parentNode.removeChild(document.getElementById('js-hi'))
        document.getElementById('js-bmi')?.parentNode.removeChild(document.getElementById('js-bmi'))
        document.getElementById('js-nni')?.parentNode.removeChild(document.getElementById('js-nni'))
    }
    //================main=======================================
    path === "/" ? animates() : null //активация анимаций на главной странице
    //================login======================================
    if(path === "/login") {
        if(showWarningMessage('login')) return
        registerOrLoginListener('login') 
    }
    //================register===================================
    if(path === "/register") {
        if(showWarningMessage('reg')) return
        registerOrLoginListener('register') 
    }
    //================developer==================================
    if(path === "/dev"){
        if(showWarningMessage('admin')) return
        if(SS.getItem('role')) {
            document.location.replace('/adminpanel')
            return
        }
        registerOrLoginListener('admin')
        document.body.classList.add('admin')
    } else document.body.classList.remove('admin')
    //================adminpanel=================================
    if(path === '/adminpanel'){   
        await adminPanelSection.posts.body(document.getElementById(ID.adminPanel))
        lazyLoading()
    }
    //================perosnal===================================
    if(path === '/personal'){ 
        if(window.innerWidth <= 650) panelRebuild()
        else{
            document.getElementById(ID.buttonAddBook).addEventListener('click', e => openPopup(e.target, '.personal'))
            document.getElementById(ID.buttonAddNote).addEventListener('click', e => openPopup(e.target, '.personal'))
        }
        if(SS.getItem(sessionKeys.userHash) && SS.getItem(sessionKeys.personalState)) getCurrentStatePersonal()
        else personalSections.personalAsideNote.body(document.getElementById('js-body-personal'))

        document.querySelectorAll(`.${CLASSES.personalAside}`).forEach(buttonSection => buttonSection.addEventListener('click', e => toggleActivePersonalSection(e.target)))
        document.getElementById(ID.inputSearchPersonal).addEventListener('change', e => searchPostWhenInputChange(e.target, document.getElementById('js-body-personal')))
        document.getElementById(ID.filterForAllElems).addEventListener('change', () => searchPostWhenInputChange(document.getElementById(ID.inputSearchPersonal), document.getElementById('js-body-personal')))
        document.getElementById(ID.bookCategory).addEventListener('change', () => searchPostWhenInputChange(document.getElementById(ID.inputSearchPersonal), document.getElementById('js-body-personal')))
    } 
    //================blog=======================================
    if(path === '/blog'){ 
        await fetchJsonPostToServer()
        .then(result => { console.log(4857348573450345)
            try{
                return result.json()
            } catch(e){
                console.log(result)
                document.getElementById(ID.blogContainer).insertAdjacentHTML(result)
                throw `нет сети`
            }
        })
        .then(data => Array.from(data.recordset).forEach(post => fillBlog(post, ID.blogContainer)))
        .catch(err => console.log(2222222))

        lazyLoading()
    }
    //===========================================================
    path === '/jl' ? jl() : null
    //===========================================================
    if(SS.getItem('user-hash') && !document.getElementById('js-ei')) createIconForExit() //ф-я создания кнопки выхода из аккаунта
    document.querySelectorAll('[data-link]').forEach(item => item.onclick = route) //обаработчик перехода по ссылкам
    SS.getItem('role') ? document.getElementById(ID.loginButton).style.display = "none" : document.getElementById(ID.loginButton).style.display = "flex" //скрытие и показ кнокп и "Войти" в зависимости от авторизации пользователя
}
window.onpopstate = handleLocation
window.route = route

handleLocation()

