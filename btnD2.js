/**
 * Created by Sara on 21/12/2015.
 */
//diagramma delle classi

window.addEventListener("load", function(e) {

    var myd2 = document.getElementById("btnD2");
    var mypanel = document.getElementById("DClassi");

    function click_btnD2() {
        console.log("btn diagramma classi");
        reset_btn(mypanel);     //reset btn del pannello
        reset_btnD(myd2.parentNode);
        myd2.classList.add("diagram_btn_pressed");
        mypanel.style.display = "block";
    }

    myd2.onclick = ("click", click_btnD2);

});