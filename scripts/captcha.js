import { createPopupAndBackdropToShowMessageForCaptcha } from "./resources.js"

let code = null
let event = new Event('deleteCaptcha', {bubbles:true})

function createCaptcha() {
  document.getElementById('captcha').innerHTML = "";
  let charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*"
  let lengthOtp = 4
  let captcha = []
  for (var i = 0; i < lengthOtp; i++) {
    let index = Math.floor(Math.random() * charsArray.length + 1); 
    if (captcha.indexOf(charsArray[index]) == -1)
      captcha.push(charsArray[index]);
    else i--;
  }
  let canv = document.createElement("canvas");
  canv.id = "captcha";
  canv.width = 100;
  canv.height = 50;
  let ctx = canv.getContext("2d");
  ctx.font = "25px Georgia";
  ctx.strokeText(captcha.join(""), 0, 30);
  code = captcha.join("");
  document.getElementById("captcha").appendChild(canv); 
}
export function showCaptcha(){
    createPopupAndBackdropToShowMessageForCaptcha('captcha')
    createCaptcha()
    document.getElementById('form-captcha').addEventListener('submit', e => {
        e.preventDefault()
        if (document.getElementById("cpatchaTextBox").value == code) {
            deleteCaptcha()
            document.dispatchEvent(event)
        }else{
          alert("Invalid Captcha. try Again")
          createCaptcha()
        }
    })
}
function deleteCaptcha(){
    let b = document.getElementById('backdrop')
    let c = document.getElementById('popup-captcha')
    b.parentNode.removeChild(b)
    c.parentNode.removeChild(c)
}
