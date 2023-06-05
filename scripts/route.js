import { fetchBookReader } from "./fetchBookReader.js"
import { JL, AdminPanel, Blog, Developer, ErrorPage, Login, Main, Personal, Register } from "./pages.js"
import { root, ID, CLASSES, toggleActivePersonalSection, personalSections, getCurrentStatePersonal, SS, openPopup, burgerMenuClick, closeMenu, burgerMenu, returnBMLValue, panelRebuild, sessionKeys, fillBlog, fetchJsonPostToServer, adminPanelSection, searchPostWhenInputChange, showWarningMessage, createIconForExit } from './resources.js'
import { animates, lazyLoading } from "./intersectionObserver.js"
import { registerOrLoginListener } from "./registerAndLoginListener.js"
import { jl } from "./jl.js"

if(!returnBMLValue(false)){
    returnBMLValue(true)
    burgerMenu.addEventListener('click', () => burgerMenuClick())
}

export const route = event => {
    event = event || window.event
    event.preventDefault()
    window.history.pushState({}, "", event.target.href)
    handleLocation()
}
const routes = {
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
const handleLocation = async () => { 
    burgerMenu.classList.contains('active') ? closeMenu('handleLocation') : null
    //===========================================================
    const path = window.location.pathname
    const routePage = routes[path] || routes['ErrorPage']
    const html = routePage()
    root.innerHTML = html
    //===========================================================
    scrollTo(0, 0)
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
    path === "/" ? animates() : null
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
        .then(result => result.json())
        .then(data => Array.from(data.recordset).forEach(post => fillBlog(post, ID.blogContainer)))

        lazyLoading()
    }
    //===========================================================
    path === '/jl' ? jl() : null
    //===========================================================
    if(SS.getItem('user-hash') && !document.getElementById('js-ei')) createIconForExit()
    document.querySelectorAll('[data-link]').forEach(item => item.onclick = route)
    SS.getItem('role') ? document.getElementById(ID.loginButton).style.display = "none" : document.getElementById(ID.loginButton).style.display = "flex"
}
window.onpopstate = handleLocation
window.route = route

handleLocation()
