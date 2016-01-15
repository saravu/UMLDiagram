/**
 * Created by Sara on 18/12/2015.
 */
//diagramma di attività

/* bottoni pannello:
    linea control flow con freccia a V
    action, bordi stondati e nome azione
    initial node
    final node
    fork 1-N
    join N-1
    decision 1-N
    merge N-1
    flow final
    send signal
    accept signal

 */

window.addEventListener("load", function(e) {

    var myd = document.getElementById("btnD1");
    var mypanel = document.getElementById("DAtt");

    function click_btnD1() {
        reset_btn(document.getElementById("all"));
        reset_btn(mypanel);     //reset btn del pannello
        reset_btnD(myd.parentNode);
        myd.classList.add("diagram_btn_pressed");
        mypanel.style.display = "block";

        //sovrascrivere!
        mysvg.onmousedown = function(e) {
        };

        mysvg.onmousemove = function(e) {

        };

        mysvg.onmouseup = function(e) {

        };

    }

    myd.onclick = ("click", click_btnD1);

});