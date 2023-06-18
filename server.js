const { initializeApp } = require('firebase/app')
const { getStorage, ref, getDownloadURL, listAll, uploadString, uploadBytes } = require('firebase/storage')
//*====================FIREBASE===========================
const express = require("express")
const path = require("path")
const app = express()
const multer = require("multer")
const md5 = require('md5')

const upload = multer({limits: {fieldSize: 25 * 1024 *1024} })
const jsonParser = express.json({limit: '50mb'})
//=======================================================
const sql = require('mssql')
const sqlConfig = {
  user: "jmynn_SQLLogin_1",
  password: "hrwb2eknq2",
  database: "gentleNote",
  server: 'gentleNote.mssql.somee.com', 
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, 
    trustServerCertificate: true 
  }
}

let pool = null;
(async () => pool = await sql.connect(sqlConfig))() //создание подключения к БД

const hashCode = s => { //ф-я хэширования данных
    for(var i = h = 0; i < s.length; i++) h = Math.imul(31,h) + s.charCodeAt(i) | 0
    return h
}
async function uploadFiles(req, res) { //ф-я загрузки данных в БД и хранилище  
    let {type, user_hash, ...rest} = req.body
    await addNewDataToUserFolders(type, user_hash, rest, req.file)
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(400))
}

//=======================================================
//=======================================================
app.use('/', express.static(path.resolve(__dirname)))
app.get("/*", (req, res) => res.sendFile(path.resolve(__dirname, "index.html")))
//*============FETCH=====================================
app.post('/blog', async (req, res) => res.json(await new sql.Request().query(`select * from posts order by id_post desc`))) //ok //отправка данных из БД на страницу "наш блог"
app.post('/login', jsonParser, async (req, res) => { //ok //сверка присланных логина и паролей, фиксация времени захода в аккаунт
    const enterDate = +Date.now()
    const {login, password} = req.body
    try{
        const {recordset} = await new sql.Request().query(`select [u_id], [user_hash], [user_role] from users where [user_hash]='${md5(`${login}${password}`)}'`) //? 
        const {u_id, user_role} = recordset[0]

        if(user_role == 'admin'){
            res.status(200).send(recordset)
            return
        }
        await new sql.Request().query(`insert into users_log ([u_id], [user_enterDate], [user_exitDate], [user_differentTime]) values (${u_id}, ${enterDate}, ${0}, ${0})`) 
        res.status(200).send(recordset)
    }
    catch(err){
        res.status(400).send('unexpected error login')
    }
}) 
app.post('/register', jsonParser, async (req, res) => { //ok //проверка на то, что такого пользователя не существует. создание индивидуального хранилища, занесение данных в БД
    const {login, password} = req.body
    const enterDate = +Date.now()
    if(login === undefined || password === undefined) return
    
    await searchRequest(login, password)
        .then(async state => {
            if(!state) {
                let {stateAdd, hash} = await addUser(login, password)
                return [{resultSearchUser : state,
                        resultAddUser : stateAdd,
                        resultCreateTableForUser : false}, hash]
            }
            return [{resultSearchUser : state,
                    resultAddUser :false,
                    resultCreateTableForUser : false}]
        })
        .then(async ([stateObject, hash=null]) => {
            if(stateObject.resultAddUser) {
                stateObject.resultCreateTableForUser = await createTablesForUser(hash)
                return [stateObject, hash]
            }
            stateObject.resultCreateTableForUser = false
            return [stateObject]
        })
        .then(async ([finalStateObject, hash=null]) => {
            let {recordset} = await new sql.Request().query(`select [u_id], [user_role],[user_hash] from users where [user_hash]='${hash}'`) 
            finalStateObject.data = recordset[0]

            await checkAndCreateFolderForUserInStorage(hash) 
            await new sql.Request().query(`insert into users_log ([u_id], [user_enterDate], [user_exitDate], [user_differentTime]) values (${recordset[0].u_id}, ${enterDate}, ${0}, ${0})`) 

            res.status(200).send(finalStateObject)
        })
        .catch(err => {
            console.log(err)
            res.status(400).send('unexpected error register')
        })
})
app.post('/personal', jsonParser, async (req, res) => { //ok // отправка данных в зависимости от данных авторизованного пользователя 
    const {user_hash, path, action, id, title} = req.body

    if(user_hash === null) {
        res.status(200).send({stateData : 'EMPTY'}) //*
        return
    }
    if(!action ?? action === null){ //отправка данных для заполнения разделов в ЛК
        if(path === "notes"){
            await new sql.Request().query(`select * from notes_${user_hash} order by note_id desc`, (err, result) => {
                if(err) {
                    res.status(400).send('oh error')
                    return
                }
                res.status(200).send(result.recordset)
            })
        }
        if(path === "books"){
            await new sql.Request().query(`select * from books_${user_hash} order by book_id desc`, (err, result) => {
                if(err) { 
                    res.sendStatus(400)
                    return
                }
                res.status(200).send(result.recordset)
            })
        }
    }
    if(action === 'delete'){ //удаление объекта в ЛК
        try{
            await new sql.Request().query(`delete ${path}_${user_hash} where ${path.substring(0, path.length-1)}_id=${Number(id)} and ${path.substring(0, path.length-1)}_title=N'${title}'`)
            res.sendStatus(200)
        } catch (e){res.sendStatus(400)}
    }
    if(action === 'read'){
        try{
            let {recordset} = await new sql.Request().query(`select ${path.substring(0, path.length-1)}_state from ${path}_${user_hash} where ${path.substring(0, path.length-1)}_id=${Number(id)} and ${path.substring(0, path.length-1)}_title=N'${title}'`)
            let state = Number(recordset[0][`${path.substring(0, path.length-1)}_state`])
            await new sql.Request().query(`update ${path}_${user_hash} set ${path.substring(0, path.length-1)}_state=N'${Number(!state)}' where ${path.substring(0, path.length-1)}_id=${Number(id)} and ${path.substring(0, path.length-1)}_title=N'${title}'`)
            res.send(await new sql.Request().query(`select ${path.substring(0, path.length-1)}_state from ${path}_${user_hash} where ${path.substring(0, path.length-1)}_id=${Number(id)} and ${path.substring(0, path.length-1)}_title=N'${title}'`))
        } catch (e){
            res.sendStatus(400)
        }
    }
    if(action === 'change-category-book'){ //изменение категории для книг
        const {state} =  req.body
        const stateString = state.toString()
        const regexp = new RegExp('[0-5]')      
        try{
            if(!stateString.match(regexp)) throw new Error()
            await new sql.Request().query(`update books_${user_hash} set book_state=N'${state}' where book_id=${Number(id)}`)
            res.status(200).send(await new sql.Request().query(`select book_state from books_${user_hash} where book_id=${Number(id)}`))
        } catch(e) {
            res.sendStatus(400)
        }
    }
    if(action === 'change-category-note'){ //изменение категории для заметок
        const {state} =  req.body
        const stateString = state.toString()
        const regexp = new RegExp('[0-5]')      
        try{
            if(!stateString.match(regexp)) throw new Error()
            await new sql.Request().query(`update notes_${user_hash} set note_state=N'${state}' where note_id=${Number(id)}`)
            res.status(200).send(await new sql.Request().query(`select note_state from notes_${user_hash} where note_id=${Number(id)}`))
        } catch(e) {
            res.sendStatus(400)
        }
    }
}) 
app.post('/dev', jsonParser, async (req, res) => { //ok сверка присланных логина и паролей
    const {login, password} = req.body

    try{
        const {recordset} = await new sql.Request().query(`select [user_hash], [user_role] from users where [user_hash]='${md5(`${login}${password}`)}'`) //?
        res.status(200).send(recordset)
    }
    catch(err){res.status(400).send('unexpected error admin')}
}) 
app.post('/adminpanel', jsonParser, async (req, res) => {// отправка данных для заполненния панели администратора постами
    const {action, id, title} = req.body //?доделать
    
    if(action === null) {
        res.json(await new sql.Request().query(`select * from posts order by id_post desc`))
        return
    }
    try { 
        await new sql.Request().query(`delete posts where id_post=${Number(id)} and title=N'${title}'`)
        res.sendStatus(200)
    } catch(e) {res.sendStatus(400)}
})
app.post("/upload_files", upload.single("book"), uploadFiles) //отправка пришедших данных в хранилище и БД
app.post('/bookreader', jsonParser, async (req, res) => { //отправка данных на клиент для вывода книги
    const {user_hash, bid} = req.body
    if(user_hash === null) {
        res.status(200).send({stateData : 'EMPTY'}) //*
        return
    }
    await new sql.Request().query(`select book_book from books_${user_hash} where book_id=${+bid}`, (err, result) => {
        if(err) {
            res.status(400).send('oh error')
            return
        }
        res.status(200).send(result.recordset)
    })
})
app.post('/exitDate', jsonParser, async (req, res) => { //фиксирование данных о выходе из аккаунта в БД
    const exitDate = +Date.now()
    const {user_hash} = req.body
    try{
        const data = await new sql.Request().query(`select * from users where [user_hash]='${user_hash}'`)
        const {recordset} = await new sql.Request().query(`select * from users_log where [u_id]=${data.recordset[0].u_id} order by l_id desc`)
        const lid = recordset[0].l_id
        const enterDate = +recordset[0].user_enterDate

        await new sql.Request().query(`update users_log set [user_exitDate]=${+exitDate}, [user_differentTime] = ${exitDate-enterDate} where [l_id]=${lid}`)
        res.sendStatus(200)
    } catch(err){ 
        console.log(err)
        res.status(400).send('unexpected error date')}
})
app.post('/jl', jsonParser, async (req, res) => { //отправка данных о посещениях пользователей
    const {user_hash} = req.body
    try{
        const {recordset} = await new sql.Request().query(`select * from users where [user_hash]='${user_hash}'`)
        if(recordset[0].user_role != 'admin') throw new Error()
        
        res.status(200).json(await new sql.Request().query(`select * from users_log`))
    } catch(err){
        console.log(err)
        res.sendStatus(400)
    }
})
app.post('/upload_bookmark', jsonParser, async (req, res) => { //сохранение процента прочитанного материала в определенной книге пользователя
    const {action, user_hash, bid, scrollPercentage} = req.body
    try{
       if(action == 'set'){
        await new sql.Request().query(`update books_${user_hash} set book_scrollPer='${scrollPercentage}' where book_id = ${+bid}`)
        res.sendStatus(200)
       }
       if(action == 'get'){
        const {recordset} = await new sql.Request().query(`select * from books_${user_hash} where [book_id]=${+bid}`)
        res.status(200).send(recordset[0].book_scrollPer)
       }
    } catch(err){
        console.log(err)
        res.sendStatus(400)
    }
})
//*====================FIREBASE==========================
const firebaseConfig = {
    apiKey: "AIzaSyDX19UB3d7vv0IBjdzrIkDg2D95WkAgFBI",
    authDomain: "project-d-v-1.firebaseapp.com",
    projectId: "project-d-v-1",
    storageBucket: "project-d-v-1.appspot.com",
    messagingSenderId: "814136262222",
    appId: "1:814136262222:web:b69e4071c3a599293c8d1f"
}
const firebasePostfix = {
    books : '_books',
    notes : '_notes',
    folder : '_folder',
    ghostfile : '.ghostfile' //items.filter(file => file.name !=== '.ghostfile')
}
/* note:
    - data - объект, префиксы - папки, items*
    - items - массив объектов с приватными свойствами
        + доступные свойства: name, fullPath(name)
        если items в папке, то в fullPath будет указана папка и файл (folder/file.ext) 
    - preffixes - массив объектов с приватными свойствами
        + доступные свойства: name, fullPath(name)
*/
const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage(firebaseApp, "gs://project-d-v-1.appspot.com")

async function addNewDataToUserFolders(type, user_hash, {author, title, rate, cover, note, post}, file){ //добавление данных о книга, постах, заметках в БД и хранилище
    if(user_hash === 'null') return false

    const storageRef = ref(storage, `${user_hash}${firebasePostfix.folder}`) 

    const coverExtension = cover.substring(cover.indexOf('/')+1, cover.indexOf(';'))

    if(type === 'book'){ //ok
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'))
        const metadata = {contentType : `image/${coverExtension}`}      
        let uploadCoverRef = undefined
        
        await checkHasDataInUserFolder(type, user_hash, author.concat(title), extension).catch(e => {throw e})

        const booksRef = ref(storageRef, `${user_hash}${firebasePostfix.books}/[book]${author}_${title}${extension}`)

        let uploadBookRef = await uploadBytes(booksRef, file.buffer)
            .then(response => response.ref)
            .then(async reference => await getDownloadURL(reference))
            .then(url => url)
            .catch(err => console.log(err))

        try{
            if(!cover.includes('(none)')){
                const croppedBase64UrlImage = cover.split(',')[1]
                const coverRef = ref(storageRef, `${user_hash}${firebasePostfix.books}/[cover]${author}_${title}.${coverExtension}`)
                uploadCoverRef =  await uploadString(coverRef, croppedBase64UrlImage, "base64", metadata)
                .then(response => response.ref)
                .then(async reference => await getDownloadURL(reference))
                .then(url => url)
                .catch(err => console.log(err)) 
            } else {
        uploadCoverRef = `https://firebasestorage.googleapis.com/v0/b/project-d-v-1.appspot.com/o/none.png?alt=media&token=9f6b79b8-98bf-49a3-9b66-ec3af62b945d`
            }
        } catch (e){console.log(e)}

        try{
            await new sql
            .Request()
            .query(`insert into books_${user_hash} 
                ([user_hash], 
                [book_rate], 
                [book_title], 
                [book_author], 
                [book_book], 
                [book_image], 
                [book_state],
                [book_scrollPer]) 
            values('${user_hash}', ${Number(rate)}, N'${title}', N'${author}', '${uploadBookRef}', '${uploadCoverRef}', '0', 0)`) //??
        }
        catch (e){
            console.log(e)
            throw e
        }
    }
    if(type === 'note'){ //ok
        const notesRef = ref(storageRef, `${user_hash}${firebasePostfix.notes}/[cover]${author}_${title}.${coverExtension}`)
        const croppedBase64UrlImage = cover.split(',')[1]
        const metadata = {contentType : `image/${coverExtension}`}

        let uploadCoverRef = await uploadString(notesRef, croppedBase64UrlImage, "base64", metadata)
            .then(response => response.ref)
            .then(async reference => await getDownloadURL(reference))
            .then(url => url)
            .catch(err => console.log(err)) 

        try{
            await new sql
            .Request()
            .query(`insert into notes_${user_hash} 
                ([user_hash]
                ,[note_rate]
                ,[note_title]
                ,[note_author]
                ,[note_description]
                ,[note_image]
                ,[note_state]) 
            values('${user_hash}', ${Number(rate)}, N'${title}', N'${author}', N'${note}', '${uploadCoverRef}', '0')`)
        }
        catch (e){throw e}
    }
    if(type === 'post'){
        const postsRef = ref(storage, `post images/[post][cover]${author}_${title}.${coverExtension}`)
        const croppedBase64UrlImage = cover.split(',')[1]
        const metadata = {contentType : `image/${coverExtension}`}

        let uploadCoverRef = await uploadString(postsRef, croppedBase64UrlImage, "base64", metadata)
            .then(response => response.ref)
            .then(async reference => await getDownloadURL(reference))
            .then(url => url)
            .catch(err => console.log(err)) //?

        try{
            await new sql
            .Request()
            .query(`insert into posts 
                ([title]
                ,[description]
                ,[author]
                ,[link_image]) 
            values(N'${title}', N'${post}', N'${author}', '${uploadCoverRef}')`)
        }
        catch (e){throw e}
    }
} 
//*====================FIREBASE==========================
//=======================================================
app.listen(process.env.PORT || 3000, () => console.log("Server running..."))
//=======================================================
async function createTablesForUser(hash){ //ok //ф-я создания таблиц в БД при регистрации нового пользователя
    await new sql.Request().query(`create table notes_${hash}(
        [note_id] [int] IDENTITY(1,1) NOT NULL primary key,
        [user_hash] [nvarchar](max) NOT NULL,
        [note_rate] [smallint] NOT NULL,
        [note_title] [nvarchar](max) NOT NULL,
        [note_author] [nvarchar](max) NOT NULL,
        [note_description] [nvarchar](max) NOT NULL,
        [note_image] [nvarchar](max) NULL,
        [note_state] [nchar](1) NOT NULL,
    )`)
    await new sql.Request().query(`create table books_${hash}(
        [book_id] [int] IDENTITY(1,1) NOT NULL primary key,
        [user_hash] [nvarchar](max) NOT NULL,
        [book_rate] [smallint] NOT NULL,
        [book_title] [nvarchar](max) NOT NULL,
        [book_author] [nvarchar](max) NOT NULL,
        [book_book] [nvarchar](max) NOT NULL,
        [book_image] [nvarchar](max) NULL,
        [book_state] [nchar](1) NOT NULL,
    )`)
    return true
} 
async function searchRequest(login, password){ //ok //ф-я проверки отсутствия пользователя с похожими логином и паролдем
    let {recordset} = await new sql.Request().query(`select [user_role] from users where [user_hash]='${md5(`${login}${password}`)}'`) //?
    if(recordset.length) return true
    return false
} 
async function addUser(login, password){ //ok //ф-я добавления нового пользователя в базу данных
    const hash = md5(`${login}${password}`)
    await new sql.Request().query(`insert into users ([u_id], [user_login], [user_password], [user_role], [user_hash]) values(${BigInt(Math.abs(hashCode(`${login}${password}`)))}, N'${login}', N'${password}', 'user', '${hash}')`)
    return {
        stateAdd : true, 
        hash
    }
} 
//=======================================================
//*====================FIREBASE==========================
async function checkHasDataInUserFolder(type, path, name, extension){ //ok //ф-я проверки существующих объектов в хранилище 
    const searchPath = `${path}${firebasePostfix[type + 's']}`
    const searchFolder = ref(storage, `${path}${firebasePostfix.folder}`)
    const seacrhRef = ref(searchFolder, searchPath)
    await listAll(seacrhRef).then(async ({items}) => {
        items.forEach(item => {if(item.name.toString().includes(`[${type}]${name}${extension}`)) throw "such a file already exists"})
    })
} 
async function checkAndCreateFolderForUserInStorage(hash){ //ok //создание хранидища для ново-зарегистрированного пользователя
    const storageRef = ref(storage)
    await listAll(storageRef).then(data => {
        data.prefixes.forEach(async folder => {
            if(folder.name !== `${hash}${firebasePostfix.folder}`){
                const folderRef = ref(storage, `${hash}${firebasePostfix.folder}`)

                const booksRef = ref(folderRef, `${hash}${firebasePostfix.books}`)
                const ghostBook = ref(booksRef, firebasePostfix.ghostfile)
            
                const notesRef = ref(folderRef, `${hash}${firebasePostfix.notes}`)
                const ghostNote = ref(notesRef, firebasePostfix.ghostfile)
                
                await uploadString(ghostBook, '')
                await uploadString(ghostNote, '')
            } else throw 'unexpected error firebase'
        })
    })
}
//=======================================================
