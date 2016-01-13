/**
 * Created by Sara on 11/12/2015.
 */
window.addEventListener("load", function(e) {

    var svgNS = "http://www.w3.org/2000/svg";
    var p = document.getElementById("p");
    var c = document.getElementById("canc");
    var mysvg = document.getElementById("mysvg");

//selezione
    function click_btnp() {
        reset_btn(document.getElementById("DAtt"));
        reset_btn(document.getElementById("DClassi"));
        reset_btn(document.getElementById("MStati"));
        p.classList.add("btn_pressed");
        c.style.display = "block";

        selection = true;

        mysvg.onmousedown = function(e) {
            if(elementsel!=null) {
                elementsel.setColor(standardcolor);
                hideResize();
                resize = false;
                elementsel = null;
                drag = false;
            }
        };

        mysvg.onmousemove = function(e) {
            if(selection && elementsel!=null && drag) ondrag(e);
            if(resize && elementsel!=null) onresize(e);
        };

        mysvg.onmouseup = function(e) {
            drag = false;
            resize = false;
        };

        function onmouseenterbar(e) {
            drag = false;
            resize = false;
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    p.onclick=("click", click_btnp);


//cancellazione
    function click_btnc() {

        if(elementsel!=null) {
            elementsel.removeme();
            elementsel = null;
            drag = false;
        }

    }

    c.onclick=("click", click_btnc);

});