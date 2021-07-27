const burgerBtn = document.querySelector('.header__burger');
const menuList = document.querySelector('.header__mobile');
const menuItem =document.querySelectorAll('.nav__list-item')


const openMenu = function () {
    burgerBtn.addEventListener('click', () => {
        menuList.classList.toggle('open')
        burgerBtn.classList.toggle('open')
    })
}
openMenu();

menuItem.forEach(elem => {
    elem.addEventListener('click', () => {
        menuList.classList.remove('open')
        burgerBtn.classList.remove('open')
    })
})
