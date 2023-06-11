export let animates = () => document.querySelectorAll('[data-animate]').forEach(item => observerAnimate.observe(item))
export let lazyLoading = () => document.querySelectorAll('[data-src]').forEach(item => LazyLoad.observe(item))
//===========================================================
const optionsAnimate = {
    root: null,
    rootMargin: '0px',
    threshold: 0.001
}
const observerAnimate = new IntersectionObserver((entries, observer) => { // наблюдатель пересечения элементов с анимацией
    entries.forEach(entry =>{ 
        if(entry.isIntersecting){
            entry.target.classList.add('animate__animated', 'animate__fadeInUp')
            observer.unobserve(entry.target)
        }
})}, optionsAnimate) 
//===========================================================
const optionsLazyLoad = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
}
const LazyLoad = new IntersectionObserver((entries, observer) => { // наблюдатель пересечения элементов подлежщих медленной загрузки
    entries.forEach(entry =>{ 
        if(entry.isIntersecting){
            entry.target.src = entry.target.dataset.src
            entry.target.dataset.src = ''
            observer.unobserve(entry.target)
        }
})}, optionsLazyLoad) 