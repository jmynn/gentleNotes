export async function jl(){ //ф-я отображения журнала посещений
    await fetch('/jl', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({user_hash : sessionStorage.getItem('user-hash')})
    })
    .then(data => data.json())
    .then(({recordset}) => recordset)
    .then(arr => {
        console.log(arr)
        Array.from(arr).forEach(({u_id, user_enterDate, user_exitDate, user_differentTime}) => {
            const tr = document.createElement('tr')
            const td_id = document.createElement('td')
            const td_end = document.createElement('td')
            const td_exd = document.createElement('td')
            const td_dft = document.createElement('td')
            
            td_id.textContent = u_id
            td_end.textContent = new Date(+user_enterDate)
            td_exd.textContent = new Date(+user_exitDate)
            td_dft.textContent = msToTime(+user_differentTime)

            tr.appendChild(td_id)
            tr.appendChild(td_end)
            tr.appendChild(td_exd)
            tr.appendChild(td_dft)
            document.querySelector('tbody').insertAdjacentElement('beforeend', tr)
        })
    })
    .catch(err => { 
        const div = document.createElement('div')
        const jl = document.querySelector('.jl')
        div.style.cssText = `
            font-size: 22px;
            text-align: center;
            font-weight: 700;
            color: black;
            padding: 10px 0;
        `
        div.textContent = "Доступно только администраторам"
        jl.innerHTML = ''
        jl.insertAdjacentElement('beforeend', div)
    })
}
function msToTime(duration) { //ф-я форматирования миллисекунд в привычный формат даты и времени
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60),
      hours = parseInt((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
