import { checkAndInstallIconAccount, fetchToExitDate, ID, openPopup, panelRebuild } from "./resources.js"
//================SECURE===================================
let flag = false //флаг отображения кнопки прокрутки
const savedStaticPanelRow = ` 
  <div class="panel__column">
    <button class="panel__button panel-button__book" id="js-panel-book">Загрузить книгу</button>
  </div>
  <div class="panel__column">
    <div class="panel__title">Мои <span>заметки</span></div>
  </div>
  <div class="panel__column">
    <button class="panel__button panel-button__note" id="js-panel-note">Создать заметку</button>
  </div>
` //шаблон мобильной разметки в ЛК
//================SECURE===================================
//=======================================================
window.addEventListener('load', async () => { //обработчик события загрузки страницы
  const panelRow = document.querySelector('.panel__row') //панель элементов в ЛК
  //*======================================================
  checkAndInstallIconAccount() //ф-я проверки состояния авторизации пользователя и смена интерфейса
  //=====serviceWorker=====================================
  if ('serviceWorker' in navigator) { // подключение сервис воркера для кеширования файлов
      try {
        const reg = await navigator.serviceWorker.register('/sw.js')
      } catch (e) {
        console.error('Service worker register fail')
      }
  }
  //=====resize============================================
  window.addEventListener('resize', e => { //обработчик события изменения размера окна

    if(window.matchMedia('(max-width: 650px)').matches){
      window.location.pathname === '/personal' ? panelRebuild() : null
    }
    else{
      if(window.location.pathname === '/personal'){
        Array.from(panelRow?.children).forEach(child => panelRow.removeChild(child)) //?
        panelRow.insertAdjacentHTML('afterbegin', savedStaticPanelRow)

        document.getElementById(ID.buttonAddBook).addEventListener('click', e => openPopup(e.target))
        document.getElementById(ID.buttonAddNote).addEventListener('click', e => openPopup(e.target))
      }
    }
  })
  //=====scroll============================================
  window.addEventListener('scroll', () =>{ //обработчик событий скролла окна
    if(window.scrollY >= 300 && !flag){
      flag = !flag
      document.body.insertAdjacentHTML('beforeend', `<div id="arrow-up-btn"></div>`)
      document.body.querySelector('#arrow-up-btn').addEventListener('click', () => scrollTo({top: 0, left: 0, behavior: 'smooth'}))
    }
    if(window.scrollY < 300 && flag){
      flag = !flag
      document.body.removeChild(document.body.querySelector('#arrow-up-btn'))
    }
  })
  
})
window.addEventListener('unload', async () => { //обработчик закрытия вкладки
  if(localStorage.getItem('auth')){
    localStorage.removeItem('auth')
    return
  }
  if(!sessionStorage.getItem('user-hash')) return
  if(sessionStorage.getItem('role')) return
  await fetchToExitDate()
})





