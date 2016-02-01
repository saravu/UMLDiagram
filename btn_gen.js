/**
 * Created by Sara on 18/12/2015.
 */
    var svgNS = "http://www.w3.org/2000/svg";
    var mysvg = null;
    var standardcolor = "mediumblue";
    var selectioncolor = "red";
    var stdw = 70;
    var stdh = 30;
    var fsz = 12;
    var ffam = "monospace";
    var cdim = 6;                   //dimensioni dei connettori

    var selection = false;      //è attiva la selezione del puntatore
    var elementsel = null;      //elemento selezionato - oggetto
    var resize = false;         //è attivo il resize di elementsel
    var numresize = 0;          //numero del ResizeObj selezionato
    var drag = false;           //sto trascinando elementsel
    var dragX = null;
    var dragY = null;

    var drawline = false;           //è attivo il disegno della linea -> mostra connettori
    var svgline = null;             //linea che sto disegnando
    var elementcorreleted = null;   //elemento correlato nel disegno della linea, per controlli validità UML
    var correlated = false;         //correlato un el
    var connections = new Array();  //array dei connettori
    var Cdown = -1;                 //numero del connettore selezionato al mouse down, linesIN (nome inversi)
    var Cup = -1;                   //numero connettore selezionato al mouse up, linesOUT
    var connsel = null;             //connection selzionato, per verica UML flow
    var callback = null;            //registra la funzione da invocare al riorno dal settaggio delle proprietà - E usata per keypressed
    var clearsvg = false;           //conferma nuovo svg


//trasformazione punti
    function transformPoint(x, y) {
        var po = mysvg.createSVGPoint();
        po.x = x;
        po.y = y;
        po = po.matrixTransform(mysvg.getScreenCTM().inverse());
        x = po.x;
        y = po.y;
        return po;
    }
//translazione
    function translateSvg(x, y) {
        var matrix = mysvg.transform.baseVal.getItem(0).matrix;
        var tmp = matrix.translate(x, y);
        matrix.a = tmp.a;
        matrix.b = tmp.b;
        matrix.c = tmp.c;
        matrix.d = tmp.d;
        matrix.e = tmp.e;
        matrix.f = tmp.f;
        var t = mysvg.getAttribute("transform");
        mysvg.setAttribute("transform", "");
        mysvg.setAttribute("transform", t);

//non funziona su Chrome!
    }
//scalatura
function scaleSvg(s, x, y) {
    var matrix = mysvg.transform.baseVal.getItem(0).matrix;
    var tmp = matrix.translate(x, y).scale(s).translate(-x, -y);
    matrix.a = tmp.a;
    matrix.b = tmp.b;
    matrix.c = tmp.c;
    matrix.d = tmp.d;
    matrix.e = tmp.e;
    matrix.f = tmp.f;
    var t = mysvg.getAttribute("transform");
    mysvg.setAttribute("transform", "");
    mysvg.setAttribute("transform", t);
    /*var n = mysvg.childElementCount;
    var ch = mysvg.children;
    for (var i = 0; i < n; i++) {
        ch[i].setAttribute("transform", "");
        ch[i].setAttribute("transform", t);
    }*/
}

//oggetto per attaccare le linee agli elementi
    function Connection(el) {
        this.myelement = el;
        var _this = this;
        var myconn = document.createElementNS(svgNS, "rect");
        myconn.setAttributeNS(null, "stroke", selectioncolor);
        myconn.setAttributeNS(null, "fill", "white");
        myconn.setAttributeNS(null, "style", "opacity:0");
        myconn.setAttributeNS(null, "width", cdim.toString());
        myconn.setAttributeNS(null, "height", cdim.toString());
        var myx, myy;
        var myn;
        this.myfig = myconn;
        this.mytype = "conn";
        this.x = 0;
        this.y = 0;

        connections.push(_this);

        this.setN = function(n) {
            myn = n;
        };
        this.updateConnection = function (x, y) {
            myx = x;
            myy = y;
            this.x = myx+3;
            this.y = myy+3;
            myconn.setAttributeNS(null, "x", x.toString());
            myconn.setAttributeNS(null, "y", y.toString());

            myconn.onmousedown = function (e) {
                if(drawline) {
                    correlate(e, _this.myelement);
                    Cdown = myn;
                    connsel = _this;
                }
            };

            myconn.onmouseover = function(e) {
                if(drawline) {
                    myconn.setAttributeNS(null, "fill", standardcolor);
                    elementcorreleted = _this.myelement;
                    Cup = myn;
                    connsel = _this;
                    e.stopPropagation();
                }
            };
            myconn.onmouseout = function(e) {
                if(drawline) {
                    myconn.setAttributeNS(null, "fill", "white");
                    elementcorreleted = null;
                    //Cup = -1;
                    //connsel = null;
                    e.stopPropagation();
                }
            };
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
            var i = connections.indexOf(this);
            if (i > -1) {
                connections.splice(i, 1);
            }
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
                elementsel = _this.myelement;
                resize = true;
                numresize = _this.mynum;
                myr.setAttributeNS(null, "fill", "red");
                e.stopPropagation();
            };
            myr.onmouseup = function (e) {
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
    function seeResize() {
        if (!drawline && selection) {
            if (elementsel.myRes != null) {
                for (var i = 0; i<elementsel.myRes.length; i++)
                    elementsel.myRes[i].visible(true);
                elementsel.setRes();
            }
        }
    }
    function hideResize() {
        if (elementsel.myRes != null) {
            for (var i = 0; i<elementsel.myRes.length; i++)
                elementsel.myRes[i].visible(false);
        }
    }
    function removeRes() {
        if (elementsel.myRes != null) {
            var el = null;
            for (var i = 0; i<elementsel.myRes.length; i++) {
                el = elementsel.myRes[i];
                if (el != null) el.removeme();
            }
        }
    }

    function reset_var() {
        selection = false;
        resize = false;
        drag = false;
        drawline = false;
        elementcorreleted = null;
        if (elementsel!=null) {
            elementsel.setColor(standardcolor);
            hideResize();
            elementsel = null;
        }
        setCursorByID("mysvg", "default");
    }
    function reset_svg() {
        if (mysvg.childElementCount > 1) {
            clearSvg(function(t, i, o) {
                if (clearsvg) {
                    while (mysvg.childElementCount > 1) {   //AAA num di defs in cima
                        mysvg.removeChild(mysvg.lastChild);
                    }
                    mysvg.setAttribute("transform", "matrix(1, 0, 0, 1, 0, 0)");
                    //mysvg.lastChild.setAttribute("transform", "matrix(1, 0, 0, 1, 0, 0)");        ???
                    var newsvg = document.getElementById("btnD1");
                    var mypanelN = document.getElementById("DAtt");
                    reset_btn(mypanelN);
                    reset_btnD(newsvg.parentNode);
                    //myb.classList.add("diagram_btn_pressed");
                    document.getElementById("btnAct").classList.add("diagram_btn_pressed");
                    mypanelN.style.display = "block";
                    mysvg.onmousedown = function (e) { };
                    mysvg.onmousemove = function (e) { };
                    mysvg.onmouseup = function (e) { };
                }
            });
        }
        else clearsvg = true;
    }
    function reset_btn(div) {
        seeConnectors(false);
        var children = div.getElementsByTagName("button");
        for (var c = 0; c < children.length; c++) {
            children[c].classList.remove("btn_pressed");
        }
        document.getElementById("canc").style.display = "none";
        reset_var();
    }
    function reset_btnD(div) {
        //reset_svg();
        //if (clearsvg) {
            var children = div.getElementsByTagName("button");
            for (var c = 0; c < children.length; c++) {
                children[c].classList.remove("diagram_btn_pressed");
            }
            var contV = document.getElementById("container_vert");
            var btnDiv = contV.getElementsByTagName("div");
            for (c = 0; c < btnDiv.length; c++) {
                reset_btn(btnDiv[c]);
                btnDiv[c].style.display = "none";
            }
            document.getElementById("all").style.display = "block";
            reset_var();
      //  }
        clearsvg = false;
    }

//modificare?? posso cancellare direttamente l'obj --- !!! attenzione erroriiii TODO
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
            var pt = transformPoint(e.clientX, e.clientY);
            //calcola offset x e y
            elementsel.dragObj(pt.x, pt.y);
        }
    }
    function onresize(e) {
        if(resize && elementsel!= null) {
            //calco la offset x e y
            var pt = transformPoint(e.clientX, e.clientY);
            elementsel.resizeObj(pt.x, pt.y);
        }
    }

//selezione elemento
    function select(e, t) {
        if (selection) {
            if (elementsel!=null) {
                elementsel.setColor(standardcolor);
                hideResize();
            }
            elementsel = t;
            elementsel.setColor(selectioncolor);
            drag = true;
            var pt = transformPoint(e.clientX, e.clientY);
            dragX = pt.x;
            dragY = pt.y;
            e.stopPropagation();
        }
    }

//correlazione elemento: chiamare SOLO sui connettori/lineUP!!! TODO
    function correlate(e, t) {
        if (drawline) {
            elementcorreleted = t;
        }
        correlated = true;
    }
    function seeConnectors(v) {
        for(var i = 0; i<connections.length; i++) {
            connections[i].visible(v);
        }
    }

//standard aggiorna linea
    function updateLine(l, x1, y1, x2, y2) {
        l.setAttributeNS(null, "x1", x1.toString());
        l.setAttributeNS(null, "y1", y1.toString());
        l.setAttributeNS(null, "x2", x2.toString());
        l.setAttributeNS(null, "y2", y2.toString());
    }


//cambiare lo stile del cursore
    function setCursorByID(id, cursorStyle) {
        var elem;
        if (document.getElementById &&
            (elem=document.getElementById(id)) ) {
            if (elem.style) elem.style.cursor=cursorStyle;
        }
    }

//al dbl click - settare testo, num ingressi, num uscite
    function setProp(b_text, b_in, b_out, myc) {
        if (selection && elementsel!=null) {
            var box = document.getElementById("setProp");
            box.style.display = "block";
            box.style.visibility = "visible";
            box.style.opacity = 1;

            document.getElementById("clearsvg").style.display="none";
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

    function clearSvg(myc) {
        var box = document.getElementById("setProp");
        box.style.display = "block";
        box.style.visibility = "visible";
        box.style.opacity = 1;
        document.getElementById("clearsvg").style.display="block";
        document.getElementById("text").style.display="none";
        document.getElementById("Input").style.display="none";
        document.getElementById("Output").style.display="none";

        callback = myc;

        document.getElementById("ok").addEventListener("click", conferma);
        document.getElementById("delete").addEventListener("click", annulla);
    }

    function conferma() {
        document.getElementById("setProp").style.display = "none";
        document.getElementById("ok").removeEventListener("click", conferma);
        clearsvg = true;

        if(callback!=null) {
            var textval = document.getElementById("textval");
            var In = document.getElementById("selectIn");
            var Out = document.getElementById("selectOut");
            callback(textval.value, In.options[In.selectedIndex].value, Out.options[Out.selectedIndex].value);
            callback = null;
        }
    }
    function annulla() {
        document.getElementById("setProp").style.display = "none";
        document.getElementById("delete").removeEventListener("click", annulla);
        clearsvg = false;
        callback = null;
    }
    function keyBody(e) {
        var k = e.keyCode;
        if (k == 46) {          //canc
            if (selection && elementsel != null && callback == null) {
                elementsel.removeme();
                elementsel = null;
                drag = false;
                resize = false;
            }
            else if (callback != null) annulla();
        }
        else if (k == 27) {     //esc
            if (callback != null) annulla();
        }
        else if (k == 13) {      //enter
            if (callback != null) conferma();       //il controllo ci vuole??
        }
        else if (!document.getElementById("txt").classList.contains("btn_pressed") && callback == null) {
            if (k == 87 || k == 38) {    //W
                translateSvg(0, -10);
            }
            else if (k == 65 || k == 37) {    //A
                translateSvg(-10, 0);
            }
            else if (k == 83 || k == 40) {    //S
                translateSvg(0, 10);
            }
            else if (k == 68 || k == 39) {    //D
                translateSvg(10, 0);
            }
            else if (k == 90) {    //Z - zoom in        TODO 0 o 1 ??
                scaleSvg(1.1, 0, 0);
            }
            else if (k == 88) {    //X - zoom out
                //sul centro
                scaleSvg(1/1.1, 0, 0);
            }
        }
    }