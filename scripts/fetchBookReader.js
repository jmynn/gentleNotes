import { root, SS, sessionKeys, openPopup, calcPositionModal } from "./resources.js";
// import { setMarkup } from "./markupScript.js";
//===========================================================
const colors = {
    pink: '#F78BB6',
    blue: '#56597A',
    gray: '#919299',
    white: '#FFFFFF',
    "l-pink": '#FFF1F9',
    grey: '#FCFCFC'
}
const styles = {
    titleStyle: `
        font-size: 20px;
        font-family: Proxima;
        font-weight: bold;
        color: ${colors.blue};
        line-height: 100%;
        text-align: center;
        padding: 0 0 15px 0;
    `,
    headersStyle : `
        color: #000000;
        font-family: Proxima;
        font-weight: bold;
        line-height: 100%;
        text-align: center;
        padding: 15px 0;
        text-transform: uppercase;
        font-size: 20px;
    `
}
const book = {
    bid : -1, //id книги 
    link : null //ссылка на хранилище книги
}
//===========================================================
export function fetchBookReader(){ // ф-я вывода интерфейса страницы чтения книги
    book.bid = +SS.getItem('bid')
    bookParser() // ф-я парсинга книги 
    return `<div id='loader'>
    </div>`
}
async function bookParser(){ // ф-я парсинга книги 
    await fetch(document.location.href, { //пост-запрос на сервер для получения ссылки на хранилище с книгой
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            user_hash: SS.getItem(sessionKeys.userHash),
            bid: book.bid,
        })
    })
    .then(data => data.json())
    .then(([obj]) => book.link = obj?.book_book ?? null)

    await fetch(book.link) // гет-запрос к харнилищу для получения файла книги
    .then(blob => blob.blob())
    .then(async blob => [await fetch(book.link).then(xml => xml.text()), blob])
    .then(([xml, blob]) => {   

        const parsedText = new DOMParser().parseFromString(xml, 'text/xml') //парсинг строки в XML DOM 
        const encode  = new XMLSerializer().serializeToString(parsedText).split('encoding="')[1].split('"?>')[0] //получение кодировки книги

        blob.arrayBuffer() 
        .then(data => new TextDecoder(encode).decode(data))
        .then(decodedText => new DOMParser().parseFromString(decodedText, 'text/xml'))
        .then(decodedAndParsedText => { //вывод книги на страницу
            if(document.getElementById('root').querySelector('#loader')) document.getElementById('root').removeChild(document.getElementById('loader'))
            decodedAndParsedText.querySelectorAll('a').forEach(link => link.parentNode.removeChild(link))
            decodedAndParsedText.querySelectorAll('myheader').forEach(item => item.parentNode.removeChild(item))
            decodedAndParsedText.querySelectorAll('myfooter').forEach(item => item.parentNode.removeChild(item))
        
            root.insertAdjacentHTML('beforeend', decodedAndParsedText.getElementsByTagName('body')[0].innerHTML)
            const titles = root.getElementsByTagName('title')
            Array.from(titles).forEach(title => {
                const parent = title.parentNode
                const childrens = parent.children

                if(title.getAttribute('xmlns') == 'http://www.gribuser.ru/xml/fictionbook/2.0') {
                    const div = document.createElement('div')
                    div.setAttribute('data-id', 'js-div')
                    div.insertAdjacentHTML('afterbegin', title.textContent)
                    parent.insertAdjacentElement('afterbegin', div)
                    parent.removeChild(title)
                    parent.setAttribute('data-section', 'reader')
                    div.style.cssText = styles.titleStyle 
                }
                else{
                    const div = document.createElement('div')
                    div.setAttribute('data-id', 'js-div')
                    div.insertAdjacentHTML('afterbegin', title.textContent)
                    parent.insertAdjacentElement('afterbegin', div)
                    parent.removeChild(title)     
                    childrens[0].style.cssText = styles.headersStyle      
                    parent.setAttribute('data-section', 'reader')

                }
            })
            root.setAttribute('data-section', 'reader')
            createIcon() //создание кнопки настроек
            createBookmark() //созданик кнопки сохранения процента прочитанного материала
            createHomeIcon() // создание кнопки возврата на главную страницу
            checkAndRecoveryStateReader() //восстановление примененной стилистики страницы чтения книги
            checkPositionAndScrollTo() // возврат на позицию на которой остановились при предыдущем чтении книги
            createNewNoteIcon(document.querySelector('[data-id="js-div"]')?.children ?? null) // создание кнопки создания быстрой заметки во время чтения
        }) 
    })
    .catch(err => console.log(err))
}
function closeSettings(){ //ф-я закрытия окна настроек страницы чтения книги
    if(document.getElementById('js-si')) return
    const settings = document.getElementById('js-settings-panel')
    settings.parentNode.removeChild(settings)
    createIcon()
}
function addClass(className){ //функция применения стилей в зависимости от изменения настроек страницы чтения книги
    const parent = root.parentNode

    parent.classList.add('reader')
    if(parent.classList.contains('yellow')) parent.classList.remove('yellow')
    if(parent.classList.contains('blue')) parent.classList.remove('blue')
    if(parent.classList.contains('gray')) parent.classList.remove('gray')
    parent.classList.add(className)

    localStorage.setItem('rtc', className)
    closeSettings()
}
function setFontSize(size){ //изменение размера шрифта в зависимости от изменения настроек страницы чтения книги
    const parent = root.parentNode

    parent.classList.add('reader')
    if(parent.classList.contains('small')) parent.classList.remove('small')
    if(parent.classList.contains('medium')) parent.classList.remove('medium')
    if(parent.classList.contains('large')) parent.classList.remove('large')
    parent.classList.add(size)

    localStorage.setItem('rsc', size)
    closeSettings()
}
function createSettingsPanel(){ //создание окна настроек
    const settingsPanel = document.createElement('div')
    settingsPanel.id = 'js-settings-panel'
    const containerPanel = document.createElement('div')
    containerPanel.classList.add('container-panel')
    const closePanel = document.createElement('div')
    closePanel.classList.add('close-panel')
    const buttonsBlock = document.createElement('div')
    buttonsBlock.classList.add('buttons-block')
    const buttonsBlock2 = document.createElement('div')
    buttonsBlock2.classList.add('buttons-block-2')
    const div1 = document.createElement('div')
    const div2 = document.createElement('div')

    const btnYellow = document.createElement('button')
    const btnBlue = document.createElement('button')
    const btnGray = document.createElement('button')
    btnYellow.setAttribute('data-theme-button', 'yellow')
    btnBlue.setAttribute('data-theme-button', 'blue')
    btnGray.setAttribute('data-theme-button', 'gray')
    btnYellow.onclick = () => addClass('yellow')
    btnBlue.onclick = () => addClass('blue')
    btnGray.onclick = () => addClass('gray')

    const btnSmall = document.createElement('button')
    const btnMedium = document.createElement('button')
    const btnLarge = document.createElement('button')
    btnSmall.setAttribute('data-size-button', 'small')
    btnMedium.setAttribute('data-size-button', 'medium')
    btnLarge.setAttribute('data-size-button', 'large')
    btnSmall.onclick = () => setFontSize('small')
    btnMedium.onclick = () => setFontSize('medium')
    btnLarge.onclick = () => setFontSize('large')
    btnSmall.textContent = 'S'
    btnMedium.textContent = 'M'
    btnLarge.textContent = 'L'

    const span = document.createElement('span')
    span.textContent = "Цветовые темы"
    span.classList.add('settings-span')
    const span2 = document.createElement('span')
    span2.textContent = "Размер текста"
    span2.classList.add('settings-span-2')

    closePanel.insertAdjacentHTML('afterbegin', `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(2.56,2.56)"><path d="M69.575,82h-39c-6.6,0 -12,-5.4 -12,-12v-39c0,-6.6 5.4,-12 12,-12h39c6.6,0 12,5.4 12,12v39c0,6.6 -5.4,12 -12,12z" fill="#f78bb6"></path><path d="M69.575,83h-39c-7.168,0 -13,-5.832 -13,-13v-39c0,-7.168 5.832,-13 13,-13h39c7.168,0 13,5.832 13,13v39c0,7.168 -5.832,13 -13,13zM30.575,20c-6.065,0 -11,4.935 -11,11v39c0,6.065 4.935,11 11,11h39c6.065,0 11,-4.935 11,-11v-39c0,-6.065 -4.935,-11 -11,-11z" fill="#1f212b"></path><path d="M77.075,48.5v18.663c0,5.685 -4.652,10.337 -10.337,10.337h-33.326c-5.685,0 -10.337,-4.652 -10.337,-10.337v-33.326c0,-5.685 4.652,-10.337 10.337,-10.337h33.663" fill="#f78bb6"></path><path d="M66.738,78h-33.326c-5.976,0 -10.837,-4.861 -10.837,-10.837v-33.326c0,-5.976 4.861,-10.837 10.837,-10.837h33.663c0.276,0 0.5,0.224 0.5,0.5c0,0.276 -0.224,0.5 -0.5,0.5h-33.663c-5.424,0 -9.837,4.413 -9.837,9.837v33.326c0,5.424 4.413,9.837 9.837,9.837h33.326c5.424,0 9.837,-4.413 9.837,-9.837v-18.663c0,-0.276 0.224,-0.5 0.5,-0.5c0.276,0 0.5,0.224 0.5,0.5v18.663c0,5.976 -4.862,10.837 -10.837,10.837zM77.075,46c-0.276,0 -0.5,-0.224 -0.5,-0.5v-4c0,-0.276 0.224,-0.5 0.5,-0.5c0.276,0 0.5,0.224 0.5,0.5v4c0,0.276 -0.224,0.5 -0.5,0.5zM77.075,40c-0.276,0 -0.5,-0.224 -0.5,-0.5v-2c0,-0.276 0.224,-0.5 0.5,-0.5c0.276,0 0.5,0.224 0.5,0.5v2c0,0.276 -0.224,0.5 -0.5,0.5z" fill="#1f212b"></path><path d="M62.786,60.19l-10.607,-10.607l10.607,-10.607c0.389,-0.389 0.389,-1.025 0,-1.414c-0.389,-0.389 -1.025,-0.389 -1.414,0l-10.607,10.607l-11.314,-11.314c-0.389,-0.389 -1.025,-0.389 -1.414,0c-0.389,0.389 -0.389,1.025 0,1.414l11.314,11.314l-11.314,11.314c-0.389,0.389 -0.389,1.025 0,1.414c0.389,0.389 1.025,0.389 1.414,0l11.314,-11.314l10.607,10.607c0.389,0.389 1.025,0.389 1.414,0c0.389,-0.389 0.389,-1.025 0,-1.414z" fill="#fefdef"></path><path d="M38.744,36.564c0.256,0 0.513,0.097 0.707,0.292l11.314,11.314l10.607,-10.607c0.194,-0.194 0.451,-0.292 0.707,-0.292c0.256,0 0.513,0.097 0.707,0.292c0.389,0.389 0.389,1.025 0,1.414l-10.607,10.606l10.607,10.607c0.389,0.389 0.389,1.025 0,1.414c-0.194,0.194 -0.451,0.292 -0.707,0.292c-0.256,0 -0.513,-0.097 -0.707,-0.292l-10.607,-10.606l-11.314,11.313c-0.194,0.194 -0.451,0.292 -0.707,0.292c-0.256,0 -0.513,-0.097 -0.707,-0.292c-0.389,-0.389 -0.389,-1.025 0,-1.414l11.314,-11.314l-11.314,-11.313c-0.389,-0.389 -0.389,-1.025 0,-1.414c0.195,-0.195 0.451,-0.292 0.707,-0.292M38.744,35.564c-0.535,0 -1.037,0.208 -1.414,0.585c-0.377,0.377 -0.585,0.879 -0.585,1.414c0,0.535 0.208,1.037 0.585,1.414l10.607,10.607l-10.607,10.606c-0.377,0.377 -0.585,0.879 -0.585,1.414c0,0.535 0.208,1.037 0.585,1.414c0.377,0.377 0.879,0.585 1.414,0.585c0.535,0 1.037,-0.208 1.414,-0.585l10.607,-10.607l9.9,9.899c0.377,0.377 0.879,0.585 1.414,0.585c0.535,0 1.037,-0.208 1.414,-0.585c0.377,-0.377 0.585,-0.879 0.585,-1.414c0,-0.535 -0.208,-1.037 -0.585,-1.414l-9.9,-9.899l9.9,-9.899c0.377,-0.377 0.585,-0.879 0.585,-1.414c0,-0.535 -0.208,-1.037 -0.585,-1.414c-0.377,-0.377 -0.879,-0.585 -1.414,-0.585c-0.535,0 -1.037,0.208 -1.414,0.585l-9.9,9.899l-10.606,-10.607c-0.378,-0.377 -0.88,-0.584 -1.415,-0.584z" fill="#1f212b"></path></g></g></svg>
    `)
    closePanel.children[0].addEventListener('click', closeSettings)

    buttonsBlock.insertAdjacentElement('afterbegin', span)
    div1.insertAdjacentElement('beforeend', btnYellow)
    div1.insertAdjacentElement('beforeend', btnBlue)
    div1.insertAdjacentElement('beforeend', btnGray)
    buttonsBlock.insertAdjacentElement('beforeend', div1)
    buttonsBlock2.insertAdjacentElement('afterbegin', span2)
    div2.insertAdjacentElement('beforeend', btnSmall)
    div2.insertAdjacentElement('beforeend', btnMedium)
    div2.insertAdjacentElement('beforeend', btnLarge)
    buttonsBlock2.insertAdjacentElement('beforeend', div2)
    containerPanel.insertAdjacentElement('beforeend', buttonsBlock)
    containerPanel.insertAdjacentElement('beforeend', buttonsBlock2)
    settingsPanel.insertAdjacentElement('afterbegin', closePanel)
    settingsPanel.insertAdjacentElement('beforeend', containerPanel)
    root.insertAdjacentElement('beforeend', settingsPanel)

}
function createIcon(){ //создание кнопки настроек
    const icon = document.createElement('div')
    const img  = document.createElement('img')
    icon.classList.add('setting-icon')
    icon.id = 'js-si'
    icon.title = 'Настройки читалки'
    img.src = './img/icons/setting.svg'
    icon.appendChild(img)
    icon.addEventListener('click', () => {
        createSettingsPanel()
        const si = document.getElementById('js-si')
        si.parentNode.removeChild(si)
    })
    document.querySelector('.wrapper').insertAdjacentElement('beforeend', icon)
}
function checkAndRecoveryStateReader(){ //восстановление примененной стилистики страницы чтения книги
    const rtc = localStorage.getItem('rtc')
    const rsc = localStorage.getItem('rsc')
    if(rtc) addClass(rtc)
    if(rsc) setFontSize(rsc)
}
async function savePosition(){ //ф-я сохранения процента прочитанного материала
    const scrollPercentage = window.pageYOffset / document.body.scrollHeight * 100 
        localStorage.setItem(`psw-bid-${book.bid}`, scrollPercentage)
        await fetch('/upload_bookmark', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                action: 'set',
                user_hash: SS.getItem(sessionKeys.userHash),
                bid: book.bid,
                scrollPercentage
            })
        }).catch(e => console.log(e)) //??
}
function createBookmark(){ //созданик кнопки сохранения процента прочитанного материала
    const icon = document.createElement('div')
    const img  = document.createElement('img')
    icon.classList.add('bookmark-icon')
    icon.id = 'js-bmi'
    icon.title = 'Создать закладку'
    img.src = './img/icons/bookmark.svg'
    icon.appendChild(img)
    icon.addEventListener('click', savePosition)
    document.querySelector('.wrapper').insertAdjacentElement('beforeend', icon)
}
async function checkPositionAndScrollTo(){ //ф-я проверки и скролла на сохраненную ранее позицию при открытии книги
    localStorage.getItem(`psw-bid-${book.bid}`) 
    ? scrollTo({top: +localStorage.getItem(`psw-bid-${book.bid}`) / 100 * document.body.scrollHeight}) 
    : await fetch('/upload_bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            action: 'get',
            user_hash: SS.getItem(sessionKeys.userHash),
            bid: book.bid
        })
    })
    .then(data => data.json())
    .then(position => {
        scrollTo({top: +position / 100 * document.body.scrollHeight})
        localStorage.setItem(`psw-bid-${book.bid}`, position)
    })
    .catch(e => console.error(e))
}
function createHomeIcon(){ // создание кнопки возврата на главную страницу
    const icon = document.createElement('div')
    const img  = document.createElement('img')
    icon.classList.add('home-icon')
    icon.id = 'js-hi'
    icon.title = 'Вернуться на главную'
    img.src = './img/icons/home.svg'
    icon.appendChild(img)
    icon.addEventListener('click', async () => {
        savePosition()
        window.history.pushState({}, "", '/')
        window.history.go()
        scrollTo({top:0})
    })
    document.querySelector('.wrapper').insertAdjacentElement('beforeend', icon)
}
function createNewNoteIcon(array=null){ // создание кнопки создания быстрой заметки во время чтения
    const icon = document.createElement('div')
    const img  = document.createElement('img')
    icon.classList.add('new-note-icon')
    icon.id = 'js-nni'
    icon.title = 'Создать новую заметку'
    img.src = './img/icons/note.svg'
    icon.appendChild(img)
    icon.addEventListener('click', () => {
        openPopup(icon, '.content')
        let [topBackdrop, positionModal] = calcPositionModal()
        document.getElementById('popup-note').style.top = positionModal+"px"
        document.getElementById('backdrop').style.top = topBackdrop+"px"
        if(array != null){
            const title = array[1].textContent
            const author = array[0].textContent
            document.getElementById('note-title').value = title
            document.getElementById('note-author').value = author
        }
    })
    document.querySelector('.wrapper').insertAdjacentElement('beforeend', icon)
}
