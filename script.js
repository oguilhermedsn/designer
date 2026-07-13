const btn = document.querySelector(".menu-btn");
const nav = document.querySelector("nav");

btn.addEventListener("click", ()=>{

    nav.classList.toggle("active");

    if(nav.classList.contains("active")){

        btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    }else{

        btn.innerHTML = '<i class="fa-solid fa-bars"></i>';

    }

});