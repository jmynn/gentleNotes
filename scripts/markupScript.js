import { MD5 } from "./MD5.js"

export function setMarkup(){
    document.body.addEventListener('mouseup', async e => {
        const selection = document.getSelection()
        const ao = selection.anchorOffset
        const fo = selection.focusOffset
        const hash = MD5(`markup-points-${ao}-${fo}`)
        const pid = e.target.dataset.pid
         console.log(e.pageX, e.pageY)
        selection.empty()

        e.target.setAttribute(`data-points`, `${ao}-${fo}`)
        e.target.setAttribute('data-hash', hash)

        await fetch(`${document.location.origin}/markups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
            body : createDataObject('set', sessionStorage.getItem('user-hash'), hash, ao, fo, pid)
        })
        .then(res => res.json())
        .then(([{ao, fo, markup_hash, pid}]) => {
            const range = document.createRange()
            const node = document.querySelector(`[data-pid='${pid}']`).childNodes[0]
            range.setStart(node, ao)
            range.setEnd(node, fo)
        
            let span = document.createElement('span')
            span.style.background = 'pink'
            span.setAttribute('data-hash', markup_hash)
            span.setAttribute(`data-points`, `${ao}-${fo}`)

            range.surroundContents(span)
        })
        .catch(e => console.log(e))
    })  
}
async function getMarkup(hash){
    await fetch('/markups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body : createDataObject('get', sessionStorage.getItem('user-hash'), hash)
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(e => console.log(e))
}
function createDataObject(state, uh, mh, ao=null, fo=null, pid=null){
    return JSON.stringify({
        state,
        user_hash : uh,
        markup_hash : mh,
        ao, 
        fo,
        book_id : sessionStorage.getItem('bid'),
        pid
    })
}