export function ErrorPage(){ //шаблон страницы "Error"
    return `
    <div class="error">
        ERROR
        PAGE NOT FOUND
    </div>
    `
}
export function Main(){ //шаблон страницы "Главная"
    return `
               <div class="main">
                <div class="main__row">
                    <div class="main__column">
                        <div class="main__title animate__animated animate__fadeInUp"><span>__</span>Индивидуальная библиотека литературных произведений</div>
                        <div class="main__subtitle animate__animated animate__fadeInUp">Загружайте любимые книги и читайте их в любое время</div>
                        <div class="main__text animate__animated animate__fadeInUp">Ставьте книгам оценки и описывайте свои впечатления о прочитанных книгах в заметках. Составляйте списки книг, желаемых к прочтению, и оценивайте, насколько сильно Вы хотите прочитать ту или иную книгу.
                        </div>
                    </div>
                    <div class="main__column">
                        <div class="main__image animate__animated animate__fadeInUp">
                            <img src="img/hero.svg" alt="man">
                        </div>
                    </div>
                </div>
               </div>
               <div class="favs">
                <div class="favs__row">
                    <div class="favs__column">
                        <div class="favs__title" data-animate>Добавляйте картинки к заметкам и книгам</div>
                        <div class="favs__subtitle" data-animate>Читайте когда хотите</div>
                        <div class="favs__text" data-animate>Отмечайте книги прочитанными. Ставьте отметку о успешной покупке желанной книги.
                            <div>(Для загрузки книг доступен формат FB2)</div>
                        </div>
                    </div>
                    <div class="favs__column">
                        <div class="favs__image" data-animate>
                            <img src="img/womans.svg" alt="womans">
                        </div>
                    </div>
                </div>
               </div>
    `
}
export function Login(){ //шаблон страницы "Авторизация"
    return `
    <div class="auth">
                <form action="#" class="auth__form form" name="logForm">
                    <input type="text" name="login" id="js-login" class="form__input" placeholder="Введите логин" autocomplete="off">
                    <input type="password" name="password" id="js-password" class="form__input" placeholder="Введите пароль" autocomplete="off">
                    <button class="form__btn" id="js-logon">Войти</button>
                </form>
                <div class="auth__reg reg">
                    <div class="reg__info">Если у Вас нет <span>аккаунта</span> на нашем сайте - Вы можете его создать!</div>
                    <a href="/register" data-link class="reg__btn" id="js-reg">Зарегистрироваться</a>
                </div>
            </div>
    `
}
export function Developer(){ //шаблон страницы "Авторизация админа"
    return `
    <div class="auth-admin">
        <form action="#" class="auth-admin__form form" name="adminForm">
            <input type="text" name="login" id="js-login-admin" class="form__input" placeholder="Введите логин" autocomplete="off">
            <input type="text" name="password" id="js-password-admin" class="form__input" placeholder="Введите пароль" autocomplete="off">
            <button class="form__btn" id="js-logon-admin">Войти</button>
        </form>
    </div>
    `
}
export function Register(){ //шаблон страницы "Регистрация"
    return `
    <div class="reg-container" id="reg-container">
    <div class="reg">
        <form action="#" class="reg__form form" name="regForm">
            <input type="text" name="login" id="js-reg-login" class="form__input" placeholder="Введите логин" autocomplete="off">
            <input type="text" name="password" id="js-reg-password" class="form__input" placeholder="Введите пароль" autocomplete="off">
            <button class="form__btn" id="js-registr">Зарегистрироваться</button>
        </form>
    </div>
</div>
    `
}
export function Personal(){ //шаблон страницы "Личный кабинет"
    return `
        <div class="personal">
            <div class="personal__row">
                <div class="personal__column">
                    <div class="personal__panel panel">
                        <div class="panel__row">
                            <div class="panel__column">
                                <button class="panel__button panel-button__book" id="js-panel-book">Загрузить книгу</button>
                            </div>
                            <div class="panel__column">
                                <div class="panel__title">Мои <span>заметки</span></div>
                            </div>
                            <div class="panel__column">
                                <button class="panel__button panel-button__note" id="js-panel-note">Создать заметку</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="personal__column">
                    <div class="personal__aside aside-personal" id="js-personal-aside">
                        <ul class="aside-personal__list">
                            <li class="js-aside-personal active" id="js-section-personal-note" class="active">Мои заметки</li>
                            <li class="js-aside-personal" id="js-section-personal-book">Мои книги</li>
                            <li id="js-section-personal-search">
                                <img src="img/icons/magnifier.svg" alt="magnifier">
                                <input type="text" placeholder="Введите запрос..." id="input-search-personal" title="Введите текст, нажмите Enter">                              
                                <img src="img/icons/magnifier.svg" alt="magnifier">
                            </li>
                            <li id="js-aside-filter" class="blockFilters">
                                <!-- <div>
                                    <input type="checkbox" id="js-check-only-read">
                                    <label for="js-check-only-read">Только прочитанные</label>
                                </div> -->
                                <div>
                                    <select id="js-book-category">
                                        <option value="title" disabled selected>Категория</option>
                                        <option value="0">Не прочитано</option>
                                        <option value="1">Прочитано</option>
                                        <option value="2">Запланировано</option>
                                        <option value="3">Брошено</option>
                                        <option value="4">Любимое</option>
                                        <option value="5">Не понравилось</option>
                                    </select>
                                </div>
                                <div>
                                    <select id="filter-search">
                                        <option value="d" disabled selected>Сортировать</option>
                                        <option value="r">По рейтингу</option>
                                        <option value="s">По прочитанности</option>
                                        <option value="t">По названию</option>
                                    </select>                                    
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="personal__body body-personal" id="js-body-personal" data-isActive>
                    
                    </div>
                </div>
            </div>
            
        </div>
    `
}
//!
export function Blog(){ //шаблон страницы "Наш блог"
    return `
    <div class="blog" id="blog">
    </div>
    `
}
export function AdminPanel(){ //шаблон страницы "Панель администратора"
    return`
       <div class="adminpanel" id="admin-panel-add-post">
        
       </div>
    `
}
export function JL(){ //шаблон страницы "Журнал посещений"
    return `
        <div class="jl">
            <div class="thead">::Журнал посещений</div>
            <table>
                <tbody>
                    <tr>
                        <th>userID</th>
                        <th>Дата и время входа</th>
                        <th>Дата и время выхода</th>
                        <th>Время работы (0 - по н.в.)</th>
                    </tr>
                </tbody>
            </table>
        </div>
    `
}

