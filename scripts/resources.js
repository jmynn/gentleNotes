import { showCaptcha } from "./captcha.js"
import { lazyLoading } from "./intersectionObserver.js"

export const root = document.getElementById("root")
export const wrapper = document.querySelector('.wrapper')
export const SS = window.sessionStorage

let bmL = false //burger menu listener
let opened = false
let stateCompletion = false
//!=======================================================
export const sessionKeys = {
    loggedIn : 'loggedIn',
    personalState : 'personal-state',
    visited : 'visited',
    registered : 'registered',
    userId : 'user-id',
    role : 'role',
    userHash : 'user-hash'
}
export const ID_LOGIN_REGISTER = {
    'logContainer': 'log-container',
    'logInputLogin': 'js-login',
    'logInputPassword': 'js-password',
    'logInputLoginAdmin': 'js-login-admin',
    'logInputPasswordAdmin': 'js-password-admin',
    'logButton': 'js-logon',
    'regContainer': 'reg-container',
    'firstRegButton': 'js-reg',
    'mainRegButton': 'js-registr',
    'regInputLogin': 'js-reg-login',
    'regInputPassword': 'js-reg-password',
}
export const ID = {
    'authorButton' : 'author-btn',
    'loginButton' : 'login-btn',
    'personalAsideBook' : 'js-section-personal-book',
    'personalAsideNote' : 'js-section-personal-note',
    'bodyPersonalNotes' : 'body-personal-notes',
    'bodyPersonalBooks' : 'body-personal-books',
    'personalAside' : 'js-personal-aside',
    'uploadBookBlock' : 'upload-book',
    'uploadCoverBlock' : 'upload-cover',
    'popupClose' : 'popup-close',
    'bookForm' : 'book-form',
    'noteForm' : 'note-form',
    'inputUploadBook' : 'input-book',
    'bookRate' : 'book-rate',
    'noteRate' : 'note-rate',
    'bookAuthor' : 'book-author',
    'noteAuthor' : 'note-author',
    'bookTitle' : 'book-title',
    'noteTitle' : 'note-title',
    'submitBookUpload' : 'book-form-button',
    'submitNoteUpload' : 'note-form-button',
    'inputUploadBookCover' : 'input-book-cover',
    'inputUploadNoteCover' : 'input-note-cover',
    'popupBook' : 'popup-book',
    'popupNote' : 'popup-note',
    'popupPost' : 'popup-post',
    'buttonAddBook' : 'js-panel-book',
    'buttonAddNote' : 'js-panel-note',
    'burgerMenu' : 'burger-menu',
    'blogContainer' : 'blog',
    'registerContainer' : 'reg-container', 
    'adminPanel' : 'admin-panel-add-post',
    'adminAddPostPanel' : 'panel-add-post',
    'allAdminsPost' : 'all-posts',
    'buttonAddNewPost' : 'add-post-btn',
    'inputSearchPost' : 'search-post-input',
    'inputSearchPersonal' : 'input-search-personal',
    'filterForAllElems' : 'filter-search',
    'checkboxReadOnly' : 'js-check-only-read',
    'JL' : 'log-btn',
    'bookCategory' : 'js-book-category'
}
export const CLASSES = {
    'personalAside' : 'js-aside-personal',
    'panelTitle' : 'panel__title'
}
export const dataAttribures = {
    'rateNote' : 'rateNote',
    'rateBook' : 'rateBook',
    'buttonNoteDelete' : 'buttonNoteDelete',
    'buttonNoteRead' : 'buttonNoteRead',
    'buttonBookDelete' : 'buttonBookDelete',
    'buttonBookRead' : 'buttonBookRead',
    'isActive' : 'isActive'
}
const noneImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjZCMDI2RjU4MjcxRDExRTFBNUIxQTIwMEI5NEE1NEZBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZCMDI2RjU5MjcxRDExRTFBNUIxQTIwMEI5NEE1NEZBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NkIwMjZGNTYyNzFEMTFFMUE1QjFBMjAwQjk0QTU0RkEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NkIwMjZGNTcyNzFEMTFFMUE1QjFBMjAwQjk0QTU0RkEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6Ri9sqAAAMa0lEQVR42uzdzXXT6B7A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`
//!=======================================================
export const burgerMenu = document.getElementById(ID.burgerMenu)
//================SECURE=================================
function createHtmlPanelTitle(title){
    const span = document.createElement('span')
    span.insertAdjacentText('afterbegin', title)
    return span
}
function createHtmlPopup(id){
    if(id === ID.buttonAddBook) return `
    <div class="popup" id="popup-book">
    <div id="popup-title">Загрузить книгу</div>
    <div class="popup__close" id="popup-close"></div>
    <form method="post" class="popup__row" id="book-form">
        <div class="popup__column column-popup" id="upload-book">
            <img src="img/icons/upload.svg" alt="upload files" class="upload-image">
            <div class="column-popup__book">
                <input type="file" name="book" id="input-book" accept="text/xml,text/fb2+xml,.fb2,.xml">
                <label for="input-book">Выберите книгу</label>
                <span>или перетащите сюда</span>
            </div>
        </div>
        <div class="popup__column column-popup">
            <div class="column-popup__body">
                <div class="column-popup__block">
                    <div class="column-popup__rate">
                        <label for="bookRate">Насколько Вы хотите прочитать данную книгу?</label>
                        <input type="number" class="popup__rate" required name="bookRate" min="1" max="10" id="book-rate"> / 10
                    </div>
                    <input type="text" class="column-popup__author" required name="bookAuthor" id="book-author" placeholder="Введите автора">
                    <input type="text" class="column-popup__title" required name="bookTitle" id="book-title" placeholder="Введите название">
                    <button type="submit" class="column-popup__button" id="book-form-button">Загрузить книгу</button>
                </div>
                <div class="column-popup__block" id="upload-cover">
                    <img src="img/icons/upload.svg" alt="upload files" class="upload-image">
                    <div class="column-popup__image">
                        <input type="file" name="bookCover" id="input-book-cover" accept="image/jpeg,image/png">
                        <label for="input-book-cover">Выберите обложку</label>
                        <span>или перетащите сюда</span>
                    </div>
                </div>
            </div>
        </div>
    </form>
    </div>
    `
    if(id === ID.buttonAddNote || id === 'js-nni') return `
    <div class="popup" id="popup-note">
    <div id="popup-title">Загрузить заметку</div>
    <div class="popup__close" id="popup-close"></div>
    <form method="post" action="#" class="popup__row" id="note-form">
        <div class="popup__block">
            <div class="popup__rate">
                <label for="noteRate">Уровень приоритета</label>
                <input type="number" class="popup__rate" required name="noteRate" min="1" max="10" id="note-rate"> / 10
            </div>
            <input type="text" class="popup__author" required name="noteAuthor" id="note-author" placeholder="Введите автора">
            <input type="text" class="popup__title" required name="noteTitle" id="note-title" placeholder="Введите название">
            <textarea name="noteDescription" required class="popup__description" id="note-descripton" cols="30" rows="7" placeholder="Введите текст..." ></textarea>
            <button type="submit" class="popup__button" id="note-form-button">Загрузить заметку</button>
        </div>
        <div class="popup__block" id="upload-cover">
            <img src="img/icons/upload.svg" alt="upload files" class="upload-image">
            <div class="popup__image">
                <input type="file" name="noteCover" id="input-note-cover" multiple accept="image/jpeg,image/png">
                <label for="input-note-cover">Выберите обложку</label>
                <span>или перетащите сюда</span>
            </div>
        </div>
    </form>
    </div>
    `
    if(id === 'register-message') return `
    <div class="popup" id="popup-register">
        <div id="popup-title">придумайте новые данные для регистрации!</div>
        <div id="message-popup-close">Понятно!</div>
    </div>
    `
    if(id === 'register-error') return `
    <div class="popup" id="popup-register">
        <div id="popup-title">повторите попытку позднее.</div>
        <div id="message-popup-close">Понятно!</div>
    </div>
    `
    if(id === 'not-found') return `
    <div class="popup" id="popup-not-found">
        <div id="popup-title">Совпадений не найдено. Проверьте правильность запроса.</div>
        <div id="message-popup-close">Понятно!</div>
    </div>
    `
    if(id === 'incorrect-format') return `
    <div class="popup" id="popup-book-message-incorrect">
        <div id="popup-title">Доступные форматы для загрузки книг: <span>fb2</span>. Выберите другой формат.</div>
        <div id="message-popup-close">Понятно!</div>
    </div>
    `
    if(id === 'successful-addition') return `
    <div class="popup" id="popup-message-successful">
        <div id="popup-title">Успешно добавлено!</div>
        <div id="message-popup-close">Понятно!</div>
    </div>
    `
    if(id === 'successful-deleted-post') return `
        <div class="popup" id="popup-message-successful">
            <div id="popup-title">Успешно удалено!</div>
            <div id="message-popup-close">Понятно!</div>
        </div>
    `
    if(id === ID.buttonAddNewPost) return `
    <div class="popup" id="popup-post">
    <div id="popup-title">Загрузить пост</div>
    <div class="popup__close" id="popup-close"></div>
    <form method="post" action="#" class="popup__row" id="post-form">
        <div class="popup__block">
            <input type="text" class="popup__author" required name="postAuthor" id="post-author" placeholder="Введите автора">
            <input type="text" class="popup__title" required name="postTitle" id="post-title" placeholder="Введите название">
            <textarea name="postDescription" required class="popup__description" id="post-descripton" cols="30" rows="7" placeholder="Введите текст..." ></textarea>
            <button type="submit" class="popup__button" id="post-form-button">Загрузить заметку</button>
        </div>
        <div class="popup__block" id="upload-cover">
            <img src="img/icons/upload.svg" alt="upload files" class="upload-image">
            <div class="popup__image">
                <input type="file" name="postCover" id="input-post-cover" multiple accept=".png, .jpg">
                <label for="postCover">Выберите обложку</label>
                <span>или перетащите сюда</span>
            </div>
        </div>
    </form>
    </div>
    `
    if(id === 'login-error') return `
    <div class="popup" id="popup-register">
        <div id="popup-title">неверный логин или пароль</div>
        <div id="message-popup-close">Понятно!</div>
    </div>
    `
    if(id === 'captcha') return `
    <div class="popup" id="popup-captcha">
        <div class='title'>Вы ввели неверный логин или пароль. Подтвердите каптчу и повторите попытку.</div>
        <form id='form-captcha'>
            <div id="captcha"></div>
            <input type="text" placeholder="Captcha" id="cpatchaTextBox"/>
            <button type="submit">Submit</button>
        </form>
    </div>
    `
}
//=======================================================//ok??
function createBackdrop(parent){
    const backdrop  = document.createElement('div')
    backdrop.id = 'backdrop'
    backdrop.style.cssText = `
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: #0000008a;
        position: absolute;
        z-index: 100;
    `
    addListenerBackdrop(backdrop, parent)
    document.body.insertAdjacentElement("afterbegin", backdrop)
}
function addListenerBackdrop(el, parent){
    el.addEventListener('click', e => deleteBackdrop(e.target, parent))
}

function deleteBackdrop(target, parent){
    target !== null && !document.getElementById(ID.burgerMenu).classList.contains('active') ? deletePopup(target, parent) : closeMenu('backdrop')

    const el = document.getElementById('backdrop')
    document.body.removeChild(el)
    removeListenerBackdrop(el, parent) //??target
}
function removeListenerBackdrop(el, parent){
    el.removeEventListener('click', e => deleteBackdrop(e.target, parent))
}

function deletePopup(target, parent){
    if(target.id === 'backdrop') {
        const popup = document.querySelector(parent).lastElementChild
        popup.parentNode.removeChild(popup)
    }
    if(target.parentNode.id === ID.popupBook){
        const popup = document.getElementById(ID.popupBook)
        popup.parentNode.removeChild(popup)
    }
    if(target.parentNode.id === ID.popupNote) {
        const popup = document.getElementById(ID.popupNote)
        popup.parentNode.removeChild(popup)
    }
    if(target.parentNode.id === ID.popupPost) {
        const popup = document.getElementById(ID.popupPost)
        popup.parentNode.removeChild(popup)
    }
    target.removeEventListener('click', e => closePopup(e.target, parent))
    document.body.style.overflow = ''
}
async function createPopup(id, parent){  
    document.body.style.overflow = 'hidden'
    document.querySelector(parent).insertAdjacentHTML('beforeend', createHtmlPopup(id))
    document.getElementById(ID.popupClose).addEventListener('click', e => closePopup(e.target, parent))
    addDragListener(document.querySelector(parent).lastElementChild.id)

    document.forms[0].addEventListener('submit', async e => {
        e.preventDefault()
        await addNewDataToDatabase(id, e.target.elements)
    })
    if(id === ID.buttonAddBook){
        const inputUploadBook = document.getElementById(ID.inputUploadBook)
        const uploadBook = document.getElementById(ID.uploadBookBlock)
        inputUploadBook.addEventListener('change', e => {
            if(e.target.value) {
                DAD.start('book', uploadBook, ID.bookForm, inputUploadBook)
                fillInputsAfterUploadBook(inputUploadBook)
            }
        })
    }
}

function closePopup(target, parent){
    deleteBackdrop(target, parent)
}
//=======================================================
async function panelAddWindow(target){
    let isActive = false

    if(target.nodeName === 'DIV'){
        target.classList.toggle('active')
        if(target.classList.contains('active')){
          target.children[0].src = 'img/icons/close.svg'
          isActive = true
        }
        else{
          target.children[0].src = 'img/icons/add.svg'
          isActive = false
        }
      }
      if(target.nodeName === 'IMG'){
        target.parentNode.classList.toggle('active')
        if(target.parentNode.classList.contains('active')) {
          target.src = 'img/icons/close.svg'
          isActive = true
        }
        else {
          target.src = 'img/icons/add.svg'
          isActive = false
        }
      }
      if(isActive){
        const panelColumn = document.querySelector('.panel__column')
        panelColumn.insertAdjacentHTML('afterbegin', `
        <div id="addButtonPanelWindow">
          <span id="js-panel-book">Загрузить книгу</span>
          <span id="js-panel-note">Создать заметку</span>
        </div>
        `)
        panelColumn.querySelector('#addButtonPanelWindow').addEventListener('click', e => openPopup(e.target, '.personal'))
      }
      if(!isActive){
        const panelColumn = document.querySelector('.panel__column')
        panelColumn.removeChild(panelColumn.querySelector('#addButtonPanelWindow'))
      }
}
export function panelRebuild(){
  const panelRow = document.querySelector('.panel__row')
  const panelTitle = panelRow.children[1].innerHTML
  const buttonAdd = `
    <div id="add-panel" style='text-align:right;'>
      <img src='img/icons/add.svg' style='max-width:30px;'>
    </div>
  `
  
  Array.from(panelRow.children).forEach(child => {
    Array.from(child.children).forEach(ch => {
      child.removeChild(ch)
    })
  })
  const [column_1, column_2, column_3] = panelRow.children
  column_2.insertAdjacentHTML('afterbegin', panelTitle)
  column_1.insertAdjacentHTML('afterbegin', buttonAdd)

  const addButton = document.getElementById('add-panel')
  addButton.addEventListener('click', e => panelAddWindow(e.target))
}
//=======================================================
export function closeMenu(whence){
    const {menu, btnMenu} = returnElementForBurgerMenu()
    opened = false

    whence !== 'backdrop' ? deleteBackdrop(null, '.personal') : null

    btnMenu.classList.remove('active')
    menu.classList.remove('active')

    document.body.style.overflow = ''
}
function openMenu({menu, btnMenu}){
    opened = true

    btnMenu.classList.add('active')
    menu.classList.add('active')

    createBackdrop('.personal')

    document.body.style.overflow = 'hidden'
}
function returnElementForBurgerMenu(){
    return {
        menu : document.getElementsByClassName('header__column')[1],
        btnMenu : burgerMenu
    }
}
//================SECURE=================================
//=======================================================
export const personalSections = { //ok 
    returnHMTL : function(el, state){
        return `
        <div class="body-personal__card card" ${el?.book_image !== 'https://firebasestorage.googleapis.com/v0/b/project-d-v-1.appspot.com/o/none.png?alt=media&token=9f6b79b8-98bf-49a3-9b66-ec3af62b945d' && el?.book_id ? 'data-book-card' : ''} id="${el?.book_id ?? el?.note_id}-${el?.note_title ?? el?.book_title}" style="${Number(el?.note_state) === 1||Number(el?.book_state) === 1 
        ? 'background:#98b1986b' 
        : Number(el?.note_state) === 4||Number(el?.book_state) === 4  ? 'background:#FFF1F9' : 'background:#FFFFFF'
    }">
            <div class="card__info">
                <div class="card__image"><img src="${el?.note_image ?? el?.book_image}" loading='lazy' alt="${state}'s cover"></div>
                <div class="card__block block-card">
                    <div class="block-card__rate" id="js-${state}-rate"><span>${el?.note_rate ?? el?.book_rate}</span>/10</div>
                    <div class="block-card__title">${el?.note_title ?? el?.book_title}</div>
                    <div class="block-card__author">${el?.book_author ?? el?.note_author}</div>
                    ${el?.note_description ? `<div class="block-card__description">${el?.note_description}</div>` : ''}
                </div>
            </div>
            <div class="card__buttons button-card">
                ${el?.book_id ? `<div class="button-card__readBook" data-button${state[0].toUpperCase()+state.substring(1)}ReadBook><img src="img/icons/book.svg" alt=""><span>Читать</span></div>` : ""}
                ${el?.note_id ? VK.Share.button({url: `${document.location.origin}`, title: `${el?.note_title}`, image: `${el?.note_image}`}, 
                {type: 'custom', text: '<img src="img/icons/vk-share.svg" />'}) : ""}
                <div class="button-card__delete" data-button${state[0].toUpperCase()+state.substring(1)}Delete><img src="img/icons/trash.svg" alt=""><span>Удалить</span></div>
                
                <select class="js-book-category" data-select-change-state-${el?.book_id ? 'book' : 'note'}>
                    <option value="title" disabled selected>Категория</option>
                    <option value="0" ${el?.book_state == 0 || el?.note_state == 0 ? 'selected' : ''}>Не прочитано</option>
                    <option value="1" ${el?.book_state == 1 || el?.note_state == 1 ? 'selected' : ''}>Прочитано</option>
                    <option value="2" ${el?.book_state == 2 || el?.note_state == 2 ? 'selected' : ''}>Запланировано</option>
                    <option value="3" ${el?.book_state == 3 || el?.note_state == 3 ? 'selected' : ''}>Брошено</option>
                    <option value="4" ${el?.book_state == 4 || el?.note_state == 4 ? 'selected' : ''}>Любимое</option>
                    <option value="5" ${el?.book_state == 5 || el?.note_state == 5 ? 'selected' : ''}>Не понравилось</option>
                </select>
            </div>
        </div>
    `},
    addEventListenerOnButtons : function(bodyPersonal, state){
        bodyPersonal.querySelectorAll(`[data-button${state}delete]`).forEach(btn => btn.addEventListener('click', () => {
            const card = btn.parentNode.parentNode
            if(!confirm(`Вы уверены, что хотите удалить данную запись? (${card.id.split('-')[1]})`)) return
            deleteOrRead('delete', card, state)
                .then(() => this.refill())
                .catch(err => console.log(err)) //?
        }))
        bodyPersonal.querySelectorAll(`[data-button${state}read]`).forEach(btn => btn.addEventListener('click', () => { 
            const card = btn.parentNode.parentNode
            deleteOrRead('read', card, state)
                .then(res => res.json())
                .then(({recordset}) => recordset)
                .then(([recordset]) => recordset[`${state}_state`])
                .then(elState => {
                    if(Number(elState)) card.style.background = '#98b1986b'
                    else card.style.background = '#FFFFFF'
                })
                .catch(err => console.log(err)) //?
        }))
        bodyPersonal.querySelectorAll(`[data-button${state}ReadBook]`).forEach(btn => btn.addEventListener('click', () => {
            const card = btn.parentNode.parentNode
            const id = card.id.split('-')[0]
            SS.setItem('bid', id)
            window.history.pushState({}, "", '/bookreader')
            window.history.go()
        }))
        bodyPersonal.querySelectorAll(`[data-select-change-state-${state}]`).forEach(select => select.addEventListener('change', async () => {
            const card = select.parentNode.parentNode
            await fetch(document.location.href, {
                method: 'POST',
                headers: {'Content-type': 'application/json;charset=utf-8'},
                body: JSON.stringify({
                    user_hash: SS.getItem(sessionKeys.userHash) ?? null,
                    action: `change-category-${state}`,
                    state: select.value ?? 2,
                    id: card.id.split('-')[0]
                })
            })
            .then(res => res.json())
            .then(({recordset}) => recordset)
            .then(([obj]) => {
                let status = obj?.note_state ?? obj?.book_state
                return Number(status)
            })
            .then(status => { 
                if(status === 1) {
                    card.style.background = '#98b1986b'
                    return
                }
                if(status === 4) {
                    card.style.background = '#FFF1F9'
                    return
                }
                else card.style.background = '#FFF'
            })
        }))
    },
    fetch : async function(state){
        return await fetch(document.location.href, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                user_hash: SS.getItem(sessionKeys.userHash),
                path: state+"s",
                // action : null
            })
        })
    },
    checks : function(option, bodyPersonal, state=null, data=null){
        switch(option){
            case 'auth':
                if(!SS.getItem(sessionKeys.userHash) || !SS.getItem(sessionKeys.loggedIn)){ 
                    bodyPersonal.insertAdjacentHTML("beforeend", `
                    <div style="
                    text-align: center;
                    font-size: 20px;
                    color: #F78BB6;
                    text-transform: uppercase;
                    margin: auto 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    ">
                        <span>Для просмотра заметок и книг необходимо авторизоваться</span>
                    </div>
                    <div class="dynamicAuthButton">
                        <a href='/login' data-link onclick='route()'>Войти в аккаунт</a>
                    </div>
                    `)
                    document.getElementById(ID.buttonAddBook).disabled = true
                    document.getElementById(ID.buttonAddNote).disabled = true
                    return
                }
                return
            case 'empty':
                if(!data.length && SS.getItem(sessionKeys.userHash)){ 
                    bodyPersonal.insertAdjacentHTML("beforeend", `
                    <div style="
                    text-align: center;
                    font-size: 20px;
                    color: #F78BB6;
                    text-transform: uppercase;
                    margin: auto 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    ">
                        <span>Здесь пока пусто! Загрузите книгу или создайте заметку.</span>
                    </div>
                    `)
                    document.getElementById(ID.buttonAddBook).disabled = false
                    document.getElementById(ID.buttonAddNote).disabled = false
                }
                return
            case 'full':
                if(data.length && SS.getItem(sessionKeys.userHash)){
                    Array.from(data).forEach(el => bodyPersonal.insertAdjacentHTML("beforeend", this.returnHMTL(el, state)))
                    this.addEventListenerOnButtons(bodyPersonal, state)
                    document.getElementById(ID.buttonAddBook).disabled = false
                    document.getElementById(ID.buttonAddNote).disabled = false
                }
                return
            case 'error':
                bodyPersonal.insertAdjacentHTML("beforeend", `
                <div style="
                text-align: center;
                font-size: 28px;
                color: red;
                font-weight: bold;
                text-transform: uppercase;
                margin: auto 0;
                width: 100%;
                ">
                    повторите попытку позднее!
                </div>
            `)
        }
    },
    personalAsideBook : {
        tab: 'js-section-personal-book',
        id: 'body-personal-books',
        panelTitle: 'книги',
        body: async function(bodyPersonal){
            const state = this.tab.split('-')[3]
            personalSections.checks('auth', bodyPersonal, state)

            await personalSections.fetch(state)
            .then(res => res.json())
            .then(data => { 
                personalSections.checks('empty', bodyPersonal, state, data)
                personalSections.checks('full', bodyPersonal, state, data)
                
            })
            .catch((err) => {
                console.log(err)
                personalSections.checks('error', bodyPersonal)
            })
        }
    },
    personalAsideNote : {
        tab: 'js-section-personal-note',
        id : 'body-personal-notes',
        panelTitle: 'заметки',
        body: async function (bodyPersonal){
            const state = this.tab.split('-')[3]
            personalSections.checks('auth', bodyPersonal, state)

            await personalSections.fetch(state)
            .then(res => res.json()) 
            .then(data => {
                personalSections.checks('empty', bodyPersonal, state, data)
                personalSections.checks('full', bodyPersonal, state, data)

            })
            .catch(() => personalSections.checks('error', bodyPersonal))
        }
    },
    refill : async function(personalState=null, array=null, lengthRequest=null){
        const body = document.getElementById('js-body-personal')
        const state = personalState?.split('-')[3] ?? SS.getItem(sessionKeys.personalState)?.split('-')[3]
        body.innerHTML = ''

        await this.fetch(state)
            .then(res => res.json())
            .then(data => {
                let arr = Array.from(data)
                if(document.getElementById(ID.bookCategory).selectedIndex != 0) arr = arr.filter(el => Number(el?.note_state ?? el?.book_state) === document.getElementById(ID.bookCategory).selectedIndex-1)
                if(array?.length && lengthRequest) arr = arr.filter(data => Array.from(array).includes(Number(data?.book_id ?? data?.note_id)))
                if(!array?.length && lengthRequest) createPopupAndBackdropToShowMessage('not-found')
                arr.sort((a, b) => sortElements(a, b)).forEach(el => body.insertAdjacentHTML("beforeend", this.returnHMTL(el, state)))
                this.addEventListenerOnButtons(body, state)
            })
    }
}
export const adminPanelSection = { //ok
    posts: {
        id: 'all-posts',
        body: async function(bodyPersonal){ 
            if(!SS.getItem(sessionKeys.role) || !SS.getItem(sessionKeys.loggedIn)){
                bodyPersonal.insertAdjacentHTML("beforeend", `
                <div style="
                text-align: center;
                font-size: 20px;
                color: #F78BB6;
                text-transform: uppercase;
                margin: auto 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                ">
                    <span>Для добавления и удаления постов необходимо авторизоваться как администратор</span>
                </div>
                <div class="dynamicAuthButton">
                    <a href='/dev' data-link onclick='route()'>Войти в аккаунт</a>
                </div>
                `)
                return
            }
            bodyPersonal.insertAdjacentHTML('beforeend', `
            <div class="adminpanel__add add-post" id="panel-add-post">
                <div class="add-post__button" id="add-post-btn">Добавить пост</div>
                <div class="add-post__button" id="log-btn">Журнал посещений</div>
                <div class="add-post__input"><input type="text" id="search-post-input" placeholder="Введите запрос..."></div>
            </div>
            <div class="adminpanel__posts" id="all-posts"></div>
            `)
            await fetchJsonPostToServer()
                .then(result => result.json())
                .then(data => Array.from(data.recordset).forEach(post => fillBlog(post, ID.allAdminsPost)))
                .catch(err => console.log(err)) //?
            Array.from(document.querySelectorAll('[data-id]'))
                .forEach(child => child.addEventListener('click', e => deletePost(e.target.parentNode.parentNode.parentNode.id)))
            document.getElementById(ID.buttonAddNewPost).addEventListener('click', e => openPopup(e.target, '.adminpanel'))
            document.getElementById(ID.JL).addEventListener('click', () => {
                window.history.pushState({}, "", '/jl')
                window.history.go()
            })
            document.getElementById(ID.inputSearchPost).addEventListener('change', e => searchPostWhenInputChange(e.target, document.getElementById(ID.allAdminsPost)))
        },
        refill: async function(array=null, lengthRequest=null){
            document.getElementById(ID.allAdminsPost).innerHTML = ""
            await fetchJsonPostToServer()
                .then(result => result.json())
                .then(data => {
                    if(array?.length && lengthRequest){
                        Array.from(data.recordset).filter(({id_post}) => Array.from(array).includes(Number(id_post))).forEach(post => fillBlog(post, ID.allAdminsPost))
                        return 
                    }
                    if(!array?.length && lengthRequest) createPopupAndBackdropToShowMessage('not-found')
                    Array.from(data.recordset).forEach(post => fillBlog(post, ID.allAdminsPost))
                })
                .catch(err => console.log(err)) //?
            Array.from(document.querySelectorAll('[data-id]'))
                .forEach(child => child.addEventListener('click', e => deletePost(e.target.parentNode.parentNode.parentNode.id)))
        }
    }
}
//=======================================================
export function checkEmptyInput(logInput, passInput, login, password){
    if(!login && !password) {   
        logInput.classList.add('js-warning')
        passInput.classList.add('js-warning')
        return false
    }
    else if(!login) {
        logInput.classList.add('js-warning')
        return false
    }
    else if(!password) {
        passInput.classList.add('js-warning')
        return false
    } 
    else return true
}
export function inputListener(item){
    let input = item
    input.classList.contains('js-warning') ? input.classList.remove('js-warning') : null
}
//=======================================================
export async function toggleActivePersonalSection(target){
    const PABook = document.getElementById(ID.personalAsideBook)
    const PANote = document.getElementById(ID.personalAsideNote)
    const panelTitle = document.querySelector(`.${CLASSES.panelTitle}`)
    const bodyPersonal = document.getElementById('js-body-personal')

    setCurrentStatePersonal(target)
    document.getElementById(ID.filterForAllElems).value = 'd' //?
    document.getElementById(ID.bookCategory).value = 'title'

    target.classList.add('active')
    panelTitle.removeChild(panelTitle.querySelector('span'))
    
    if(target.id === ID.personalAsideBook){
        PANote.classList.contains('active') ? PANote.classList.remove('active') : null

        bodyPersonal.innerHTML = ''
        personalSections.personalAsideBook.body(bodyPersonal)
        
        panelTitle.insertAdjacentElement('beforeend', createHtmlPanelTitle(personalSections.personalAsideBook.panelTitle))
    }
    if(target.id === ID.personalAsideNote){
        PABook.classList.contains('active') ? PABook.classList.remove('active') : null

        bodyPersonal.innerHTML = ''
        personalSections.personalAsideNote.body(bodyPersonal)
        
        panelTitle.insertAdjacentElement('beforeend', createHtmlPanelTitle(personalSections.personalAsideNote.panelTitle))
    }
}
export function setCurrentStatePersonal(currentState){
   SS.setItem(sessionKeys.personalState, currentState.id)
}
export function getCurrentStatePersonal(){
    const currentItem = SS.getItem(sessionKeys.personalState)
    const panelTitle = document.querySelector(`.${CLASSES.panelTitle}`)

    Object.entries(ID).forEach(idArray => {
        if(idArray[1] === currentItem) {
            personalSections[idArray[0]].body(document.getElementById('js-body-personal'))
            panelTitle.removeChild(panelTitle.querySelector('span'))
            panelTitle.insertAdjacentElement('beforeend', createHtmlPanelTitle(personalSections[idArray[0]].panelTitle))

            document.querySelectorAll(`.${CLASSES.personalAside}`).forEach(asideTab => asideTab.classList.contains('active') ? asideTab.classList.remove('active') : null)
            document.getElementById(personalSections[idArray[0]].tab).classList.add('active')
        }
    })
}
//=======================================================
export function openPopup(target, parent){
    createBackdrop(parent)
    createPopup(target.id, parent)
}
//=======================================================
export function addDragListener(id){ 
    if(id === ID.popupBook){
        const uploadCover = document.getElementById(ID.uploadCoverBlock)
        const uploadBook = document.getElementById(ID.uploadBookBlock)
        const inputUploadBook = document.getElementById(ID.inputUploadBook)
        const inputUploadBookCover = document.getElementById(ID.inputUploadBookCover)

        Array.from(['drag',  'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']).forEach(ev => {
            uploadBook.addEventListener(ev, e => {
                e.preventDefault()
                e.stopPropagation()
            })
            uploadCover.addEventListener(ev, e => {
                e.preventDefault()
                e.stopPropagation()
            })
        })
        Array.from(['dragover', 'dragenter']).forEach(ev => {
            uploadBook.addEventListener(ev, e => {
                uploadBook.classList.add('dragover')
            })
            uploadCover.addEventListener(ev, e => {
                uploadCover.classList.add('dragover')
            })
        })

        uploadBook.addEventListener('dragleave', e => {
            let dx = e.pageX - uploadBook.offsetLeft
            let dy = e.pageY - uploadBook.offsetTop
            if ((dx < 0) || (dx > uploadBook.offsetWidth) || (dy < 0) || (dy > uploadBook.offsetHeight)) {
                uploadBook.classList.remove('dragover')
            }
        })
        uploadCover.addEventListener('dragleave', e => {
            let dx = e.pageX - uploadCover.offsetLeft
            let dy = e.pageY - uploadCover.offsetTop
            if ((dx < 0) || (dx > uploadCover.offsetWidth) || (dy < 0) || (dy > uploadCover.offsetHeight)) {
                uploadCover.classList.remove('dragover')
            }
        })
        uploadBook.addEventListener('drop', async e => {
            if(e.dataTransfer.files[0].name.substring(e.dataTransfer.files[0].name.lastIndexOf('.')+1).trim() !== 'fb2') { 
                createPopupAndBackdropToShowMessage('incorrect-format')
                if(uploadBook.classList.contains('dragover')) uploadBook.classList.remove('dragover')
                return
            }
            uploadBook.classList.remove('dragover')
            inputUploadBook.files = e.dataTransfer.files

            DAD.start('book', uploadBook, ID.bookForm, inputUploadBook)

            fillInputsAfterUploadBook(inputUploadBook)
        })
        uploadCover.addEventListener('drop', e => {
            uploadCover.classList.remove('dragover')
            inputUploadBookCover.files = e.dataTransfer.files

            DAD.start('cover', uploadCover, ID.bookForm, inputUploadBookCover)

        })
    }
    if(id === ID.popupNote || id === ID.popupPost){
        const uploadCover = document.getElementById(ID.uploadCoverBlock) 
        const inputUploadNoteCover = document.getElementById(ID.inputUploadNoteCover) ?? document.getElementById('input-post-cover')

        Array.from(['drag',  'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']).forEach(ev => {
            uploadCover.addEventListener(ev, e => {
                e.preventDefault()
                e.stopPropagation()
            })
        })
        Array.from(['dragover', 'dragenter']).forEach(ev => {
            uploadCover.addEventListener(ev, e => {
                uploadCover.classList.add('dragover')
            })
        })

        uploadCover.addEventListener('dragleave', e => {
            let dx = e.pageX - uploadCover.offsetLeft
            let dy = e.pageY - uploadCover.offsetTop
            if ((dx < 0) || (dx > uploadCover.offsetWidth) || (dy < 0) || (dy > uploadCover.offsetHeight)) {
                uploadCover.classList.remove('dragover')
            }
        })
        uploadCover.addEventListener('drop', e => {
            uploadCover.classList.remove('dragover')
            inputUploadNoteCover.files = e.dataTransfer.files

            id === ID.popupNote ? DAD.start('note', uploadCover,  ID.noteForm, inputUploadNoteCover) 
            : DAD.start('post', uploadCover,  'post-form', inputUploadNoteCover) 
        })
    }
}
const DAD = {
    html : function(type, input){
        return `
            <div class="loaded" id="loaded-${type}">
                <div class="loaded__image"><img src="img/icons/file.svg" alt="file icon"></div>
                <div class="loaded__name">
                    <span>${input.files[0].name}</span>
                </div>
                <img class="loaded__btn" id="delete-loaded-btn" src='img/icons/trash.svg'>
            </div>
    `
    },
    removeAndInsert : function(type, container, form, input){
        if(type === 'book' || type === 'note' || type === 'post'){
            // form.removeChild(container)
            container.style.display = 'none'
            form.insertAdjacentHTML(`${type === 'book' ? 'afterbegin' : 'beforeend'}`, this.html(type, input))
        }
        if(type === 'cover') {
            // form.lastElementChild.firstElementChild.removeChild(container)
            container.style.display = 'none'
            form.lastElementChild.firstElementChild.insertAdjacentHTML('beforeend', this.html(type, input))
        }
    },
    listeners : function(type, form, container){
        let parent = document.querySelector(`#loaded-${type}`)
        parent.querySelector('#delete-loaded-btn').addEventListener('click', e => {
            if(type === 'book' || type === 'note' || type === 'post'){
                form.removeChild(e.target.parentNode)
                // form.insertAdjacentElement(`${type === 'book' ? 'afterbegin' : 'beforeend'}`, container)
                container.style.display = 'flex'
                container.querySelector('input').value = ''
                if(stateCompletion){
                    document.getElementById('book-title').value = ''
                    document.getElementById('book-author').value = ''
                    stateCompletion = false
                }
            }
            if(type === 'cover') {
                form.lastElementChild.firstElementChild.removeChild(e.target.parentNode)
                // form.lastElementChild.firstElementChild.insertAdjacentElement('beforeend', container)
                container.style.display = 'flex'
                container.querySelector('input').value = ''
            }
        })
    }, 
    start : function(type, container, form, input){
        const formEl = document.getElementById(form)

        this.removeAndInsert(type, container, formEl, input)
        this.listeners(type, formEl, container)
    }
}
function fillInputsAfterUploadBook(inputUploadBook){
    const reader = new FileReader()
    let encode = null
    reader.addEventListener('loadend', ()=> {
        if(encode){
            const parsedText = new DOMParser().parseFromString(reader.result, 'text/xml')
            const firstName = parsedText.querySelector('author').querySelector('first-name').textContent
            const lastName = parsedText.querySelector('author').querySelector('last-name').textContent
            const bookTitle = parsedText.querySelector('book-title').textContent
            
            document.getElementById('book-title').value = bookTitle
            document.getElementById('book-author').value = `${firstName} ${lastName}`
            stateCompletion = true
            return
        }
        encode = reader.result.split('encoding="')[1].split('"?>')[0]
        reader.readAsText(inputUploadBook.files[0], encode)
    })
    reader.readAsText(inputUploadBook.files[0])
    
}
//=======================================================
export function burgerMenuClick(){
    opened ? closeMenu('button') : openMenu(returnElementForBurgerMenu())
}
//=======================================================
export function returnBMLValue(changeState){
    if(changeState) bmL = changeState 
    else return bmL
}
//=======================================================
export function checkAndInstallIconAccount(){ 
    const linkLogin = document.querySelector('[href="/login"]')
     
    if(SS.getItem(sessionKeys.loggedIn) === 'true') {
        linkLogin.href = '/personal'
        linkLogin.addEventListener('click', () => {
            window.history.pushState({}, "", '/personal')
            window.history.go()

            !SS.getItem(sessionKeys.personalState) ? setCurrentStatePersonal({id : ID.personalAsideNote}) : null
        })
        linkLogin.innerHTML = `<?xml version="1.0" ?><svg data-name="Livello 1" id="Livello_1" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><title/><path d="M128,122a28.62,28.62,0,0,0-28.58-28.5H85.59a1.85,1.85,0,0,1-1.87-1.83V81.17l5.52-6.76a14.85,14.85,0,0,0,3.34-9.36V60.38A8,8,0,0,0,98,52.81v-8a8,8,0,0,0-5-7.42V34.1a13.49,13.49,0,0,0,8.31-20.81,3,3,0,0,0-4.56-.46A7.52,7.52,0,0,1,95,14.08,13.52,13.52,0,0,0,89.85,2.57a3,3,0,0,0-4.48.94,7.44,7.44,0,0,1-3,3A29,29,0,0,0,35,29v8.39a8,8,0,0,0-5,7.42v8a8,8,0,0,0,5.42,7.57v4.67a14.86,14.86,0,0,0,3.34,9.36l5.52,6.76v10.5a1.85,1.85,0,0,1-1.87,1.83H28.58A28.63,28.63,0,0,0,0,122.09V125a3,3,0,0,0,3,3H125a3,3,0,0,0,3-3ZM6,122A22.61,22.61,0,0,1,28.58,99.51H42.41a7.86,7.86,0,0,0,7.87-7.83V80.11a3,3,0,0,0-.68-1.9L43.4,70.62a8.84,8.84,0,0,1-2-5.57V57.81a3,3,0,0,0-3-3H38a2,2,0,0,1-2-2v-8a2,2,0,0,1,2-2,3,3,0,0,0,3-3V29A23,23,0,0,1,79.71,12.21a3,3,0,0,0,2.91.68,13.46,13.46,0,0,0,5.54-3.23,7.51,7.51,0,0,1,.1,6.9,3,3,0,0,0,2.51,4.34,13.58,13.58,0,0,0,6.77-1.38,7.5,7.5,0,0,1-2.06,6.69A7.3,7.3,0,0,1,90,28.39a3.15,3.15,0,0,0-2.15.86,3,3,0,0,0-.9,2.14v8.42a3,3,0,0,0,3,3,2,2,0,0,1,2,2v8a2,2,0,0,1-2,2h-.42a3,3,0,0,0-3,3v7.24a8.83,8.83,0,0,1-2,5.57L78.4,78.21a3,3,0,0,0-.68,1.9V91.67a7.86,7.86,0,0,0,7.87,7.83H99.42A22.61,22.61,0,0,1,122,122Z"/></svg> <span>Личный кабинет</span>`
    }
    else {
        linkLogin.href = '/login'
        linkLogin.innerText = `Войти`
    }
}
export async function loginOrRegister(form, loginInput, passwordInput, event){ //ok
    let logInput = form.elements[loginInput]
    let passInput = form.elements[passwordInput]

    let login = logInput.value.trim()
    let password = passInput.value.trim()
    localStorage.setItem('auth', true)
    if(!checkEmptyInput(logInput, passInput, login, password)) return false
    if(event === 'login'){ //ok
        await fetchJsonAuthPostToServer(login, password)
        .then(res => res.json())
        .then(([data]) => { 
            if(!data) throw new Error()
            SS.getItem(sessionKeys.personalState) ? SS.removeItem(sessionKeys.personalState) : null
            SS.setItem(sessionKeys.loggedIn, 'true')
            SS.setItem(sessionKeys.userHash, data.user_hash)
            checkAndInstallIconAccount()
            
            window.history.pushState({}, "", '/personal')
            window.history.go()
            setCurrentStatePersonal({id : ID.personalAsideNote})
        })
        .catch(async rej => {
            SS.getItem(sessionKeys.loggedIn) ? SS.removeItem(sessionKeys.loggedIn) : null
            // createPopupAndBackdropToShowMessage('login-error')
            showCaptcha()
            document.addEventListener('deleteCaptcha', () => {
                form.lastElementChild.disabled = true
                setTimeout(()=>form.lastElementChild.disabled = false, 10000)
            })
        })
    }
    if(event === 'register'){ //ok
        if(login === undefined || password === undefined) return
        await fetchJsonAuthPostToServer(login, password)
        .then(res => res.json())
        .then(({resultSearchUser, resultAddUser, resultCreateTableForUser, data}) => { //data.user_hash, data.user_role
            if(resultSearchUser){
                createPopupAndBackdropToShowMessage('register-message')
                logInput.value = ''
                passInput.value = ''
            }
            if(resultAddUser && resultCreateTableForUser){
                SS.setItem(sessionKeys.userHash, data.user_hash)
                SS.setItem(sessionKeys.loggedIn, 'true')
                checkAndInstallIconAccount()
                window.history.pushState({}, "", '/personal')
                window.history.go()
                personalSections.personalAsideNote.body(document.getElementById('js-body-personal'))
                setCurrentStatePersonal({id : ID.personalAsideNote})
            }
        })
        .catch(rej => {
            SS.getItem(sessionKeys.loggedIn) ? SS.removeItem(sessionKeys.loggedIn) : null 
            createPopupAndBackdropToShowMessage('register-error')
        })
    }

    if(event === 'admin'){ //ok
        await fetchJsonAuthPostToServer(login, password)
        .then(res => res.json())
        .then(([data]) => {
            if(!data) throw new Error() 
            //? убрать СС
            SS.getItem(sessionKeys.personalState) ? SS.removeItem(sessionKeys.personalState) : null
            SS.setItem(sessionKeys.loggedIn, 'true')
            SS.setItem(sessionKeys.userHash, data.user_hash)
            SS.setItem(sessionKeys.role, 'admin')
            
            window.history.pushState({}, "", '/adminpanel')
            window.history.go()
        })
        .catch(rej => {
            SS.getItem(sessionKeys.loggedIn) ? SS.removeItem(sessionKeys.loggedIn) : null
            createPopupAndBackdropToShowMessage('register-error') //?
        })
    }
}
//=======================================================
async function deletePost(idAndTitle){
    const splitted = idAndTitle.split('-')
    const title = splitted[1]
    const id = splitted[0]
    
    if(!confirm(`Хотите удалить пост - "${title}"?`)) return

    await fetchJsonPostToServer('deletePost', id, title)
        .then(response => (response.status === 400) ? createPopupAndBackdropToShowMessage('register-error') : createPopupAndBackdropToShowMessage('successful-deleted-post'))
        .then(async () => await adminPanelSection.posts.refill()) //? проверить на ошибки при рефиле
    document.getElementById(ID.inputSearchPost).value = ''
}
//======================================================= 
export async function searchPostWhenInputChange(input, body){ 
    const posts = body.children
    const postsId = []
    let lengthRequest = null
    Array.from(posts).forEach(post => {
        const title = post.querySelector('[class*="title"]').textContent.toLowerCase()
        const author = post.querySelector('[class*="author"]').textContent.toLowerCase()
        const description = post.querySelector('[class*="text"]')?.textContent.toLowerCase() ?? post.querySelector('[class*="description"]')?.textContent.toLowerCase() ?? null

        const value = input.value.trim().toLowerCase()     

        lengthRequest = value.length

        if(!value.length) return value.length
        if(title.indexOf(value) !== -1) { 
            postsId.push(returnContainRequestId(post))
            return 
        }
        if(author.indexOf(value) !== -1){
            postsId.push(returnContainRequestId(post))
            return 
        }
        if((description?.indexOf(value) ?? -1) !== -1 ){ //если ошибка - description && description?.indexOf(value) !== -1
            postsId.push(returnContainRequestId(post))
            return
        }
    })
    input.blur()
    if(SS.getItem(sessionKeys.personalState)) await personalSections.refill(SS.getItem(sessionKeys.personalState), postsId, lengthRequest) 
    else {
        await adminPanelSection.posts.refill(postsId, lengthRequest)
        lazyLoading()
    }
}
function returnContainRequestId(post){
    const id = post.id.split('-')[0]
    const bodyPost = post.children[0]

    bodyPost.style.border = '1px solid #F78BB6'

    return Number(id)
}
//======================================================= 
export function fillBlog({link_image, author, title, description, id_post}, id){
    document.getElementById(id).insertAdjacentHTML('beforeend',`
    <div class="blog__post post" id="${id_post}-${title.toUpperCase()}">
        <div class="post__body">
            <div class="post__image"><img loading='lazy' src="img/1x1.png" data-src="${link_image === null ? "img/none.png" : link_image}" alt="blog's cover"></div>
            <div class="post__info">
                <div class="post__author">${author == null ? "НЕТ АВТОРА" : author.toUpperCase()}</div>
                <div class="post__title">${title.toUpperCase()}</div>
                <div class="post__text">${description}</div>
                ${document.location.pathname === "/adminpanel" ? '<div data-id="delete-post-button">Удалить</div>' : ''}
            </div>
        </div>
    </div>`
    ) 
}
//=======================================================
async function fetchJsonAuthPostToServer(login, password){
    return await fetch(`${document.location.href}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            login: `${login}`,
            password: `${password}`
        })
    })
}
export async function fetchJsonPostToServer(action=null, id=null, title=null){
    return await fetch(`${document.location.href}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            action,
            id,
            title
        })
    })
}
//=======================================================
export function createPopupAndBackdropToShowMessage(code){
    document.querySelector('#root').insertAdjacentHTML('beforeend', createHtmlPopup(code))
    document.getElementById('message-popup-close').addEventListener('click', e => {
        e.target.parentNode.parentNode.removeChild(e.target.parentNode)
        document.body.removeChild(document.getElementById('backdrop'))
        document.body.style.overflow = ''
    })
    const backdrop  = document.createElement('div')
    backdrop.id = 'backdrop'
    backdrop.style.cssText = `
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: #0000008a;
        position: absolute;
        z-index: 1000;
    `
    document.body.insertAdjacentElement("afterbegin", backdrop)
    document.body.style.overflow = 'hidden'
    addListenerBackdrop(document.getElementById('backdrop'), "#root")
}
export function createPopupAndBackdropToShowMessageForCaptcha(code){
    document.querySelector('#root').insertAdjacentHTML('beforeend', createHtmlPopup(code))
    const backdrop  = document.createElement('div')
    backdrop.id = 'backdrop'
    backdrop.style.cssText = `
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: #0000008a;
        position: absolute;
        z-index: 1000;
    `
    document.body.insertAdjacentElement("afterbegin", backdrop)
    document.body.style.overflow = 'hidden'
}
//=======================================================
async function deleteOrRead(action, card, state){ //?
    const id = card.id.split('-')[0]
    const title = card.id.split('-')[1]

    return await fetch(document.location.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            user_hash: `${SS.getItem(sessionKeys.userHash) ?? null}`,
            path: state+'s',
            action,
            id,
            title
        })
    })
}
//!====================FIREBASE==========================
function readFileAsync(file, type) { //ok
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onloadend = () => resolve(reader.result) 
      reader.onerror = () => reject()
      if(type === 'book') reader.readAsText(file)
      if(type === 'cover') reader.readAsDataURL(file)
    })
}
//=======================================================
async function addNewDataToDatabase(id, data){  //ok 3/3n
    let rate, author, title, note, post, cover
    // let URLCoverString
    let type

    let bookData = {}

    // book
    if(id === ID.buttonAddBook) { //ok 
        let { book, bookCover, bookRate, bookAuthor, bookTitle } = data

        if(book.files.length && book.files[0].name.substring(book.files[0].name.lastIndexOf('.')+1).trim() === 'fb2'){ 
            bookData.book = new Blob([book.files[0]])
            bookData.name = book.files[0].name

            if(!bookCover.files.length){
                book = await readFileAsync(book.files[0], 'book')
                let urlImageBase64 = new DOMParser().parseFromString(book, 'text/xml').getElementsByTagName('binary')[0]?.childNodes[0].nodeValue.replace(/(\r\n|\n|\r)/gm, "") ?? '(none)'+noneImage.split(',')[1]
                urlImageBase64 = `data:image/jpeg;base64,${urlImageBase64}`
                bookData.cover = urlImageBase64

                // let imageURL = new URL(`https://lexica.art/api/v1/search`)
             
                // const sourceLang = 'ru'
                // const targetLang = 'en'
                // const sourceText = `${bookTitle.value} ${bookAuthor.value}`
                // const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURI(sourceText)}`
                // await fetch(url)
                //     .then(data => data.json())
                //     .then(([[[result]]]) => imageURL.searchParams.set('q', result))
                //     .catch(e => console.log(e))
                
                // await fetch(imageURL)
                //     .then(data => data.json())
                //     .then(({images}) => URLCoverString = images[Math.floor(Math.random() * 50)].src)
                //     .catch(e => console.log(e))
                
            } else {
                let urlImageBase64 = await readFileAsync(bookCover.files[0], 'cover')
                bookData.cover = urlImageBase64
            } 
        } else {
            createPopupAndBackdropToShowMessage('incorrect-format')
            book.value = ''
            return
        }
        rate = bookRate.value
        author = bookAuthor.value
        title = bookTitle.value  

        type = 'book'
    }
    // note
    if(id === ID.buttonAddNote || id == 'js-nni'){ //ok
        const { noteRate, noteAuthor, noteTitle, noteDescription, noteCover } = data

        if(noteCover.files.length) {
            let urlImageBase64 = await readFileAsync(noteCover.files[0], 'cover')
            cover = urlImageBase64
        }
        rate = noteRate.value
        author = noteAuthor.value
        title = noteTitle.value 
        note = noteDescription.value

        type = 'note'
    }
    // post
    if(id === ID.buttonAddNewPost){
        const { postAuthor, postTitle, postDescription, postCover } = data

        if(postCover.files.length) {
            let urlImageBase64 = await readFileAsync(postCover.files[0], 'cover')
            cover = urlImageBase64
        }
        author = postAuthor.value
        title = postTitle.value 
        post = postDescription.value

        type = 'post'
    }

    await fetchPostToStorage({ //ok
        type,
        bookData,
        rate, 
        post,
        title,
        author,
        note,
        cover,
        user_hash : SS.getItem(sessionKeys.userHash),
        // URLCoverString
    })
        .then(response => {
            if(response.status !== 200) {
                closePopup(document.getElementById('popup-close'))
                createPopupAndBackdropToShowMessage('register-error')
                return
            } 
            closePopup(document.getElementById('popup-close'))
            createPopupAndBackdropToShowMessage('successful-addition')
            if(document.location.pathname.includes('bookreader')) {
                let [topBackdrop, positionModal] = calcPositionModal()
                document.getElementById('popup-message-successful').style.top = positionModal+"px"
                document.getElementById('backdrop').style.top = topBackdrop+"px"
            }
        }) 
        .then(async () => {
            if(document.location.pathname.includes('adminpanel')) {
                await adminPanelSection.posts.refill()
                lazyLoading()
                return
            }
            if(document.location.pathname.includes('bookreader')) return
            else await personalSections.refill()
        })
        .catch(err => console.log(err))

    return
}
async function fetchPostToStorage({type, bookData, rate, post, cover, title, author, note, user_hash}){ //ok
    let formData = new FormData()

    formData.set('type', type)
    type === 'book' ? formData.set('book', bookData.book, bookData.name) :  formData.set('book', null)
    formData.set('cover', bookData?.cover ?? cover ?? noneImage)
    formData.set('note', note ?? null)
    formData.set('rate', rate ?? null)
    formData.set('post', post ?? null)
    formData.set('title', title)
    formData.set('author', author)
    formData.set('user_hash', user_hash ?? null)
    // formData.set('URLCoverString', URLCoverString ?? null)

    return await fetch(`/upload_files`, {
        method: 'POST',
        body : formData
    })
    
}
//!====================FIREBASE==========================
function sortElements(a, b){
    let state = document.getElementById(ID.filterForAllElems).value
    if(state == 'd') return 0
    if(state == 't')
        if ((a?.note_title ?? a?.book_title) < (b?.note_title ?? b?.book_title)) return -1      
    if(state == 'r')          
        if ((a?.note_rate ?? a?.book_rate) > (b?.note_rate ?? b?.book_rate)) return -1
    if(state == 's')
        if ((a?.note_state ?? a?.book_state) > (b?.note_state ?? b?.book_state)) return -1
}
//=======================================================
export function showWarningMessage(state){
    if(state === 'login' || state === 'reg') {
        if(SS.getItem('user-hash')) {
            checkAndInsertMessageToRoot('Для продолжения необходимо разлогониться')
            return true
        }
    }
    if(state === 'admin') {
        if(SS.getItem('user-hash') && !SS.getItem('role')) {
            checkAndInsertMessageToRoot("Для продолжения необходимо разлогониться в качестве пользователя")  
            return true
        }
    }
    return false
}
function checkAndInsertMessageToRoot(message){
    const root = document.getElementById('root')
    const div = document.createElement('div')
    div.style.cssText = `
    font-size: 22px;
    text-align: center;
    font-weight: 700;
    color: black;
    padding: 10px 0;
    `
    div.textContent = `${message}`
    root.innerHTML = ''
    root.insertAdjacentElement('beforeend', div)
}
//=======================================================
export function createIconForExit(){
    const icon = document.createElement('div')
    const img  = document.createElement('img')
    icon.classList.add('exit-icon')
    icon.id = 'js-ei'
    icon.title = 'Выйти из аккаунта'
    img.src = './img/icons/exit.svg'
    icon.appendChild(img)
    icon.addEventListener('click', async e => {
        await fetchToExitDate()
        sessionStorage.clear()
        localStorage.clear()
        e.target.parentNode.removeChild(e.target)
        window.history.pushState({}, "", '/')
        window.history.go()
    })
    document.querySelector('.wrapper').insertAdjacentElement('beforeend', icon)
}
//=======================================================
export function fetchToExitDate(){
    return fetch('/exitDate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          user_hash: sessionStorage.getItem('user-hash')
        })
    })
}
//=======================================================
export function calcPositionModal(){
    let {top, height} = document.body.getBoundingClientRect()
    top = Math.abs(top)
    return [top, top+(height/2)]
}