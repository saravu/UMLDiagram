/**
 * Created by Sara on 21/12/2015.
 */
//diagramma delle classi

//
window.addEventListener("load", function(e) {

    var myb = document.getElementById("btnAct");
    var mypanel = document.getElementById("DAtt");

    function click_btnD2() {
        reset_btn(mypanel);
        reset_btnD(myb.parentNode);
        myb.classList.add("diagram_btn_pressed");
        mypanel.style.display = "block";

        mysvg.onmousedown = function (e) {
        };

        mysvg.onmousemove = function (e) {

        };

        mysvg.onmouseup = function (e) {

        };
    }

    myb.onclick = ("click", click_btnD2);

});