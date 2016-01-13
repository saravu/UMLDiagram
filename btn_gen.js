/**
 * Created by Sara on 18/12/2015.
 */

    var svgNS = "http://www.w3.org/2000/svg";
    var standardcolor = "mediumblue";
    var selectioncolor = "red";
    var stdw = 70;
    var stdh = 30;

    var selection = false;      //è attiva la selezione del puntatore
    var elementsel = null;      //elemento selezionato - oggetto
    var resize = false;
    var numresize = 0;
    var drag = false;           //sto trascinando l'el selezionato
    var dragX = null;
    var dragY = null;

    var drawline = false;       // attivo il disegno della linea - mostra connettori
    var svgline = null;
    var elementcorreleted = null;
    var correlated = false;
    var connections = new Array();
    var cdim = 6;  //dimensioni dei connettori

    var callback = null;        //per proprietà

//oggetto per attaccare le linee agli elementi
    function Connection(el) {
        this.myelement = el;
        var _this = this;
        var myconn = document.createElementNS(svgNS, "rect");
        myconn.setAttributeNS(null, "stroke", selectioncolor);
        myconn.setAttributeNS(null, "fill", "white");
        myconn.setAttributeNS(null, "style", "stroke-width:2;opacity:0");   //1 per test, mettere 0
        myconn.setAttributeNS(null, "width", cdim.toString());
        myconn.setAttributeNS(null, "height", cdim.toString());
        var myx, myy;
        this.myfig = myconn;
        this.mytype = "conn";
        //var ok = false;

        connections.push(_this);

        this.updateConnection = function (x, y) {
            myx = x;
            myy = y;
            myconn.setAttributeNS(null, "x", x.toString());
            myconn.setAttributeNS(null, "y", y.toString());

            myconn.onmousedown = function (e) {
                if(drawline) {
                    correlate(e, _this.myelement);
                    myconn.setAttributeNS(null, "fill", selectioncolor);
                    //ok = true;
                }
            };
            myconn.onmouseup = function (e) {
                if(drawline) correlate(e, _this.myelement);
            };
            myconn.onmouseover = function(e) {
                if(drawline) {
                    myconn.setAttributeNS(null, "fill", "white");
                    myconn.setAttributeNS(null, "style", "opacity:1");
                    //myconn.setAttributeNS(null, "fill", selectioncolor);
                    //e.stopPropagation();
                }
            };
            myconn.onmouseout = function(e) {
                if(drawline) myconn.setAttributeNS(null, "style", "opacity:0");  e.stopPropagation();
                //if(drawline) myconn.setAttributeNS(null, "fill", "white");
            }
        };

        this.setColor = function (c) {
            myconn.setAttributeNS(null, "stroke", c);
        };
        this.visible = function (v) {
            if (v)
                myconn.setAttributeNS(null, "style", "opacity:1");
            else
                myconn.setAttributeNS(null, "style", "opacity:0");
        };
        this.removeme = function () {
            myconn.parentNode.removeChild(myconn);
        };
    }

//oggetto per ridimesonare rect, rombo, signal, lineFJ?
    function Resize(el, n) {
        this.myelement = el;
        var _this = this;
        var myr = document.createElementNS(svgNS, "rect");
        myr.setAttributeNS(null, "stroke", standardcolor);
        myr.setAttributeNS(null, "fill", "white");
        myr.setAttributeNS(null, "style", "stroke-width:2;opacity:0");
        myr.setAttributeNS(null, "width", cdim.toString());
        myr.setAttributeNS(null, "height", cdim.toString());
        var myx, myy;
        this.myfig = myr;
        this.mytype = "resize";
        this.mynum = n;

        this.updateResize = function (x, y) {
            myx = x;
            myy = y;
            myr.setAttributeNS(null, "x", x.toString());
            myr.setAttributeNS(null, "y", y.toString());

            myr.onmousedown = function (e) {
                elementsel = _this.myelement; //--dovrebbe essere già l'el selezionato, am non vedo i ResizeObj
                resize = true;
                numresize = _this.mynum;
                myr.setAttributeNS(null, "fill", "red");
                e.stopPropagation();
            };
            myr.onmouseup = function (e) {
                //elementsel = null;
                resize = false;
                e.stopPropagation();
            };
            myr.onmouseover = function(e) {
                myr.setAttributeNS(null, "fill", "red");
            };
            myr.onmouseout = function(e) {
                myr.setAttributeNS(null, "fill", "white");
            }
        };

        this.setColor = function (c) {
            myr.setAttributeNS(null, "stroke", c);
        };
        this.visible = function (v) {
            if (v)
                myr.setAttributeNS(null, "style", "opacity:1");
            else
                myr.setAttributeNS(null, "style", "opacity:0");
        };
        this.removeme = function () {
            myr.parentNode.removeChild(myr);
        };
    }

    function reset_var() {
        selection = false;
        resize = false;
        drag = false;
        drawline = false;
        elementcorreleted = null;

        if (elementsel!=null) {
            elementsel.setColor(standardcolor);
            elementsel.hideResize();        //TODO verificare che contenga il metoso, am eccezione
            elementsel = null;
        }
    }
    function reset_btn(div) {
        //seeConnectors(false);
        var children = div.getElementsByTagName("button");
        for (var c = 0; c < children.length; c++) {
            children[c].classList.remove("btn_pressed");
        }
        document.getElementById("p").classList.remove("btn_pressed");
        document.getElementById("canc").style.display = "none";
        reset_var();
    }
    function reset_btnD(div) {
        var children = div.getElementsByTagName("button");
        for (var c = 0; c < children.length; c++) {
            children[c].classList.remove("diagram_btn_pressed");
        }
        var contV = document.getElementById("container_vert");
        var btnDiv = contV.getElementsByTagName("div");
        for (c = 0; c < btnDiv.length; c++) {
            btnDiv[c].style.display = "none";
        }
        document.getElementById("all").style.display = "block";
        reset_var();
    }

//modificare?? posso ancellare direttamente l'obj --- !!! attenzione erroriiii TODO
    function deletelastsvgel(typefig, fixed) {
        var figs = document.getElementsByTagName(typefig);
        if (figs.length > 0 && !fixed) {
            var last_f = figs[figs.length - 1];
            last_f.parentNode.removeChild(last_f);
        }
    }

//principlamente cè il controllo
    function ondrag(e) {
        if(selection && elementsel!=null && drag) {
            //calcola offset x e y
            elementsel.dragObj(e.clientX, e.clientY);
        }
    }
    function onresize(e) {
        if(resize && elementsel!= null) {
            //calco la offset x e y
            elementsel.resizeObj(e.clientX, e.clientY);
        }
    }

//selezione elemento
    function select(e, t) {
        if (selection) {
            if (elementsel!=null) {
                elementsel.setColor(standardcolor);
                elementsel.hideResize();        //TODO verifica
            }
            elementsel = t;
            elementsel.setColor(selectioncolor);
            drag = true;
            dragX = e.clientX;
            dragY = e.clientY;
            e.stopPropagation();
        }
    }

//correlazione elemento: ok per rect, chiamare SOLO sui connettori? TODO
    function correlate(e, t) {
        //console.log("CORRELOOOO oggettooooooo");
        if (drawline) {
            //console.log("correlato elemento " + t.myfig.tagName);
            elementcorreleted = t;
        }
        correlated = true;
    }

 /*   function seeConnectors(v) {
        for(var i = 0; i<connections.length; i++) {
            connections[i].visible(v);
        }
    }*/

//standard aggiorna linea
    function updateLine(l, x1, y1, x2, y2) {
        l.setAttributeNS(null, "x1", x1.toString());
        l.setAttributeNS(null, "y1", y1.toString());
        l.setAttributeNS(null, "x2", x2.toString());
        l.setAttributeNS(null, "y2", y2.toString());
    }


//al dbl click - settare testo, num ingressi, num uscite
    function setProp(b_text, b_in, b_out, myc) {
        if (selection && elementsel!=null) {
            var box = document.getElementById("setProp");
            box.style.display = "block";
            box.style.visibility = "visible";
            box.style.opacity = 1;

            if(b_text) {
                var oldtext = elementsel.mytext.textContent;
                if(oldtext!=null)
                    document.getElementById("textval").value = oldtext;
                document.getElementById("text").style.display="table-row";
                document.getElementById("textval").focus();
                document.getElementById("textval").select();
            }
            else
                document.getElementById("text").style.display="none";
            //TODO aggiungi num iniziale
            if(b_in)
                document.getElementById("Input").style.display="table-row";
            else
                document.getElementById("Input").style.display="none";
            if(b_out)
                document.getElementById("Output").style.display="table-row";
            else
                document.getElementById("Output").style.display="none";

            callback = myc;

            document.getElementById("ok").addEventListener("click", conferma);
            document.getElementById("delete").addEventListener("click", annulla);
        }
    }
    function conferma() {
        document.getElementById("setProp").style.display = "none";

        document.getElementById("ok").removeEventListener("click", conferma);

        if(callback!=null) {
            var textval = document.getElementById("textval");
            var In = document.getElementById("selectIn");
            var Out = document.getElementById("selectOut");
            //console.log("output value " + Out.options[Out.selectedIndex].value);
            callback(textval.value, In.options[In.selectedIndex].value, Out.options[Out.selectedIndex].value);
        }
    }
    function annulla() {
        document.getElementById("setProp").style.display = "none";
        document.getElementById("delete").removeEventListener("click", annulla);
    }