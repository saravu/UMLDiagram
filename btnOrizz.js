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
    timer
 */

window.addEventListener("load", function(e) {

//nuovo diagramma!
    var newsvg = document.getElementById("btnD1");

    function click_btnD1() {
        reset_svg();
    }

    newsvg.onclick = (click_btnD1);


//mostra bottoni attività
    var act = document.getElementById("btnAct");
    var mypanelAct = document.getElementById("DAtt");

    function click_btnAct() {
        reset_btn(mypanelAct);
        reset_btnD(act.parentNode);
        act.classList.add("diagram_btn_pressed");
        mypanelAct.style.display = "block";

        mysvg.onmousedown = function (e) {};
        mysvg.onmousemove = function (e) {};
        mysvg.onmouseup = function (e) { };
    }

    act.onclick = (click_btnAct);


//mostra bottoni annotazioni
    var ann = document.getElementById("btnAnn");
    var mypanelAnn = document.getElementById("Dann");

    function click_btnAnn() {
        reset_btn(mypanelAnn);
        reset_btnD(ann.parentNode);
        ann.classList.add("diagram_btn_pressed");
        mypanelAnn.style.display = "block";

        mysvg.onmousedown = function (e) {  };
        mysvg.onmousemove = function (e) { };
        mysvg.onmouseup = function (e) { };
    }

    ann.onclick = (click_btnAnn);


//mostra bottoni modifica vista
    var view = document.getElementById("btnView");
    var mypanelV = document.getElementById("Dview");

    function click_btnV() {
        reset_btn(mypanelV);
        reset_btnD(view.parentNode);
        view.classList.add("diagram_btn_pressed");
        mypanelV.style.display = "block";
        //document.getElementById("all").style.display = "none";

        mysvg.onmousedown = function (e) {};
        mysvg.onmousemove = function (e) { };
        mysvg.onmouseup = function (e) { };
    }

    view.onclick = (click_btnV);


//esporta diagramma svg --> btn vista per eventuali modifiche necessarie
    var btnexport = document.getElementById("btnExport");

    function click_btnExport() {
        reset_btnD(btnexport.parentNode);
        view.classList.add("diagram_btn_pressed");
        mypanelV.style.display = "block";

        //get svg source
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(mysvg);
        //add name spaces
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
        //xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        //convert svg source to URI data scheme.
        var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        //set url value to a element's href attribute.
        var a = document.createElement("a");
        a.setAttribute("download", "ActivityDiagram.svg");
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(a);
        a.href = url;
        a.click();

        mysvg.onmousedown = function (e) {};
        mysvg.onmousemove = function (e) {};
        mysvg.onmouseup = function (e) {};

    }

    btnexport.onclick = (click_btnExport);

});