/**
 * Created by Sara on 11/12/2015.
 */

//linea ortogonale
window.addEventListener("load", function(e) {

    var mybtn = document.getElementById("btn11");
    var mysvg = document.getElementById("mysvg");
    var mDx, mDy, mMx, mMy = 0;
    var drawing = false;

    function Line() {
        var _this = this;
        var myline1, myline2, myline3= null;
        var bcr1, bcr2, bcr3 = null;        //bounding client rectangle della linea - aggiungerli alla fine
        var mytext = null;
        var lin1x1, lin1y1, lin1x2, lin1y2, lin3x1, lin3y1, lin3x2, lin3y2 = null;
        var tx, ty;
        var draggedline = null;
        var offx, offy;

        this.mytype = "line";
        this.elemento0=null;
        this.elemento1=null;
        this.myline1 = null;
        this.myline2 = null;
        this.myline3 = null;
        this.mytext = mytext;
        this.myRes = null;this.initX = null;
        this.initY = null;
        this.endX = null;
        this.endY = null;

        this.newLine = function() {
            myline1 = document.createElementNS(svgNS, "line");
            myline1.setAttributeNS(null, "style", "opacity:0.3");
            mysvg.appendChild(myline1);
            _this.myline1 = myline1;
            myline2 = document.createElementNS(svgNS, "line");
            myline2.setAttributeNS(null, "style", "opacity:0.3");
            mysvg.appendChild(myline2);
            _this.myline2 = myline2;
            myline3 = document.createElementNS(svgNS, "line");
            myline3.setAttributeNS(null, "style", "opacity:0.3");
            mysvg.appendChild(myline3);
            _this.myline3= myline3;

            this.setColor(standardcolor);

            myline1.onmousedown = function(e) {
                select(e, _this);
                draggedline = 1;
                offx = (lin1x1 - e.clientX);
                offy = (lin1y1 - e.clientY);
            };
            myline2.onmousedown = function(e) {
                select(e, _this);
                draggedline = 2;
                offx = (lin1x2 - e.clientX);
                offy = (lin1y2 - e.clientY);
            };
            myline3.onmousedown = function(e) {
                select(e, _this);
                draggedline = 3;
                offx = (lin3x1 - e.clientX);
                offy = (lin3y1 - e.clientY);
            };
            myline1.onmouseup = function(e) {
                drag = false;
            };
            myline2.onmouseup = function(e) {
                drag = false;
            };
            myline3.onmouseup = function(e) {
                drag = false;
            };
            myline1.ondblclick = function (e) {
                setProp(true, false, false, function(t, i, o) {
                    mytext.textContent = t;
                });
            };
            myline2.ondblclick = function (e) {
                setProp(true, false, false, function(t, i, o) {
                    mytext.textContent = t;
                });
            };
            myline3.ondblclick = function (e) {
                setProp(true, false, false, function(t, i, o) {
                    mytext.textContent = t;
                });
            }
        };

        this.setPosition = function(x1, y1, x2, y2) {
            this.initX = x1;
            this.initY = y1;
            this.endX = x2;
            this.endY = y2;
            if (Math.abs(x1-x2) > Math.abs(y1-y2)) {
                if (y1 != y2) {
                    lin1x1 = x1;
                    lin1y1 = y1;
                    lin1x2 = (x1 + x2)/2;
                    lin1y2 = y1;
                    lin3x1 = (x1 + x2)/2;
                    lin3y1 = y2;
                    lin3x2 = x2;
                    lin3y2 = y2;
                }
                else {
                    lin1x1 = x1;
                    lin1y1 = y1;
                    lin1x2 = x1;
                    lin1y2 = y1;
                    lin3x1 = x2;
                    lin3y1 = y2;
                    lin3x2 = x2;
                    lin3y2 = y2;
                }
            }
            else {
                if (x1 != x2) {
                    lin1x1 = x1;
                    lin1y1 = y1;
                    lin1x2 = x1;
                    lin1y2 = (y1 + y2)/2;
                    lin3x1 = x2;
                    lin3y1 = (y1 + y2)/2;
                    lin3x2 = x2;
                    lin3y2 = y2;
                }
                else {
                    lin1x1 = x1;
                    lin1y1 = y1;
                    lin1x2 = x1;
                    lin1y2 = y1;
                    lin3x1 = x2;
                    lin3y1 = y2;
                    lin3x2 = x2;
                    lin3y2 = y2;
                }
            }
            updateLine(myline1, lin1x1, lin1y1, lin1x2, lin1y2);
            updateLine(myline2, lin1x2, lin1y2, lin3x1, lin3y1);
            updateLine(myline3, lin3x1, lin3y1, lin3x2-1, lin3y2-1);
            if (bcr1 != null) updateRect(bcr1, Math.min(lin1x1, lin1x2)-5, Math.min(lin1y1, lin1y2)-5, (lin1x2-lin1x1+10), (lin1y2-lin1y1+10));
            if (bcr2 != null) updateRect(bcr2, Math.min(lin3x1, lin1x2)-5, Math.min(lin1y2, lin3y1)-5, (lin3x1-lin1x2+10), (lin3y1-lin1y2+10));
            if (bcr3 != null) updateRect(bcr3, Math.min(lin3x1, lin3x2)-5, Math.min(lin3y1, lin3y2)-5, (lin3x2-lin3x1+5-1), (lin3y2-lin3y1+5-1));
            if (!drawing) {
                myline1.setAttributeNS(null, "style", "opacity:1");
                myline2.setAttributeNS(null, "style", "opacity:1");
                myline3.setAttributeNS(null, "style", "opacity:1");
            }
        };

        this.addclientrect = function() {
            bcr1 = document.createElementNS(svgNS, "rect");
            bcr1.setAttributeNS(null, "style", "opacity:0");
            updateRect(bcr1, Math.min(lin1x1, lin1x2)-5, Math.min(lin1y1, lin1y2)-5, (lin1x2-lin1x1+10), (lin1y2-lin1y1+10));
            mysvg.appendChild(bcr1);
            bcr2 = document.createElementNS(svgNS, "rect");
            bcr2.setAttributeNS(null, "style", "opacity:0");
            updateRect(bcr2, Math.min(lin3x1, lin1x2)-5, Math.min(lin1y2, lin3y1)-5, (lin3x1-lin1x2+10), (lin3y1-lin1y2+10));
            mysvg.appendChild(bcr2);
            bcr3 = document.createElementNS(svgNS, "rect");
            bcr3.setAttributeNS(null, "style", "opacity:0");
            updateRect(bcr3, Math.min(lin3x1, lin3x2)-5, Math.min(lin3y1, lin3y2)-5, (lin3x2-lin3x1+5-1), (lin3y2-lin3y1+5-1));
            mysvg.appendChild(bcr3);

            bcr1.onmousedown = function(e) {
                select(e, _this);
                draggedline = 1;
                offx = (lin1x1 - e.clientX);
                offy = (lin1y1 - e.clientY);
            };
            bcr2.onmousedown = function(e) {
                select(e, _this);
                draggedline = 2;
                offx = (lin1x2 - e.clientX);
                offy = (lin1y2 - e.clientY);
            };
            bcr3.onmousedown = function(e) {
                select(e, _this);
                draggedline = 3;
                offx = (lin3x1 - e.clientX);
                offy = (lin3y1 - e.clientY);
            };
            bcr1.onmouseup = function(e) {
                drag = false;
            };
            bcr2.onmouseup = function(e) {
                drag = false;
            };
            bcr3.onmouseup = function(e) {
                drag = false;
            };
            bcr1.ondblclick = function (e) {
                setProp(true, false, false, function(t, i, o) {
                    mytext.textContent = t;
                });
            };
            bcr2.ondblclick = function (e) {
                setProp(true, false, false, function(t, i, o) {
                    mytext.textContent = t;
                });
            };
            bcr3.ondblclick = function (e) {
                setProp(true, false, false, function(t, i, o) {
                    mytext.textContent = t;
                });
            }
        };

        this.addText = function() {
            mytext = document.createElementNS(svgNS, "text");
            //TODO trova posizione per testo su linea -- o solo add btnText
            if (lin1x1 != lin1x2) {
                tx = lin1x2 + 5;
                ty = Math.min(lin1y2, lin3y1) + Math.abs(lin1y2 - lin3y1)/2;
            }
            else {
                tx = Math.min(lin1x2, lin3x1) + Math.abs(lin1x2 - lin3x1)/2;
                ty = lin1y2 - 5;
            }
            mytext.setAttributeNS(null, "x", tx.toString());
            mytext.setAttributeNS(null, "y", ty.toString());
            mytext.setAttributeNS(null, "style", "font-family:" + ffam +"; font-size:" + fsz);
            mytext.setAttributeNS(null, "fill", standardcolor);
            mytext.textContent = null;
            this.mytext = mytext;
            mysvg.appendChild(mytext);

            mytext.ondblclick = function(e) {
                setProp(true, false, false, function(t, i, o) {
                    mytext.textContent = t;
                });
            }
        };

        this.setColor = function(c) {
            myline1.setAttributeNS(null, "stroke", c);
            myline2.setAttributeNS(null, "stroke", c);
            myline3.setAttributeNS(null, "stroke", c);
            if (mytext!=null) mytext.setAttributeNS(null, "fill", c);
            //document.getElementById("AFp").setAttributeNS(null, "stroke", c);   //TODO punta freccia colore
        };
        this.setStyle = function(s) {   //TODO
            if (s=="dashed") {
                //far diventae PATH
                myline1.setAttributeNS(null, "style", "stroke-dasharray: 10, 5");
                myline2.setAttributeNS(null, "style", "stroke-dasharray: 10, 5");
                myline3.setAttributeNS(null, "style", "stroke-dasharray: 10, 5");
            }
        };
        this.dragObj = function(mx, my) {
            var deltax = 0;
            var deltay = 0;
            /*if (draggedline == 1) {
                deltax = (mx - lin1x1) + offx;
                deltay = (my - lin1y1) + offy;
            }
            else if (draggedline == 3) {
                deltax = (mx - lin3x1) + offx;
                deltay = (my - lin3y1) + offy;
            }*/
            if (draggedline == 2) {        //sposto il pezzo centrale
                if (lin1x2 == lin3x1) deltax = (mx - lin1x2) + offx;
                if (lin1y2 == lin3y1) deltay = (my - lin1y2) + offy;
            //non è possibile che el non siano settati, perche elimino la linea
                //TODO è possibile il drag della linea? come? come aggiorno i punti?
                if (this.elemento0 == null && this.elemento1 == null) {
                    lin1x1 = lin1x1 + deltax;
                    lin1y1 = lin1y1 + deltay;
                    lin3x2 = lin3x2 + deltax;
                    lin3y2 = lin3y2 + deltay;
                }
                lin1x2 = lin1x2 + deltax;
                lin1y2 = lin1y2 + deltay;
                lin3x1 = lin3x1 + deltax;
                lin3y1 = lin3y1 + deltay;
                updateLine(myline1, lin1x1, lin1y1, lin1x2, lin1y2);
                updateLine(myline2, lin1x2, lin1y2, lin3x1, lin3y1);
                updateLine(myline3, lin3x1, lin3y1, lin3x2, lin3y2);
                updateRect(bcr1, Math.min(lin1x1, lin1x2)-5, Math.min(lin1y1, lin1y2)-5, (lin1x2-lin1x1+10), (lin1y2-lin1y1+10));
                updateRect(bcr2, Math.min(lin3x1, lin1x2)-5, Math.min(lin1y2, lin3y1)-5, (lin3x1-lin1x2+10), (lin3y1-lin1y2+10));
                updateRect(bcr3, Math.min(lin3x1, lin3x2)-5, Math.min(lin3y1, lin3y2)-5, (lin3x2-lin3x1+5-1), (lin3y2-lin3y1+5-1));
                tx = tx + deltax;
                ty = ty + deltay;
                mytext.setAttributeNS(null, "x", tx.toString());
                mytext.setAttributeNS(null, "y", ty.toString());
            }
        };

        this.removeme = function() {
            if (myline1!=null) myline1.parentNode.removeChild(myline1);
            if (myline2!=null) myline2.parentNode.removeChild(myline2);
            if (myline3!=null) myline3.parentNode.removeChild(myline3);
            if (bcr1!=null) bcr1.parentNode.removeChild(bcr1);
            if (bcr2!=null) bcr2.parentNode.removeChild(bcr2);
            if (bcr3!=null) bcr3.parentNode.removeChild(bcr3);
            if (mytext!=null) mytext.parentNode.removeChild(mytext);
            if (this.elemento0 != null) this.elemento0.removeLine(this);
            if (this.elemento1 != null) this.elemento1.removeLine(this);
        };

    }

    function updateRect(bcr, x, y, w, h) {
        bcr.setAttributeNS(null, "x", x.toString());
        bcr.setAttributeNS(null, "y", y.toString());
        if (Math.abs(w) < 5) w=10;
        if (Math.abs(h) < 5) h=10;
        bcr.setAttributeNS(null, "width", Math.abs(w).toString());
        bcr.setAttributeNS(null, "height", Math.abs(h).toString());
    }

    function setDownUp(el, mx, my) {
        var elx, ely, elw, elh, midx, midy;
        var tag = el.myfig.tagName;
//TODO ricontrolla sul text del rect
        if(tag == "rect") {
            elx = parseFloat(el.myfig.getAttributeNS(null, "x"));
            ely = parseFloat(el.myfig.getAttributeNS(null, "y"));
            elw = parseFloat(el.myfig.getAttributeNS(null, "width"));
            elh = parseFloat(el.myfig.getAttributeNS(null, "height"));
            midx = elx + (elw)/2;
            midy = ely + (elh)/2;
            if (mx < midx && my < midy)
                if (Math.abs(mx - (elx)) < Math.abs(my - (ely)))
                    mx = elx;
                else
                    my = ely;
            else if (mx > midx && my < midy)
                if (Math.abs(mx - (elx + elw)) < Math.abs(my - (ely)))
                    mx = elx + elw;
                else
                    my = ely;
            else if (mx > midx && my > midy)
                if (Math.abs(mx - (elx + elw)) < Math.abs(my - (ely + elh)))
                    mx = elx + elw;
                else
                    my = ely + elh;
            else if (mx < midx && my > midy)
                if (Math.abs(mx - (elx)) < Math.abs(my - (ely + elh)))
                    mx = elx;
                else
                    my = ely + elh;
        }

        return {
            mx: mx,
            my: my
        };
    }

    function click_btn11() {
        reset_btn(mybtn.parentNode);
        reset_btn(document.getElementById("all"));
        mybtn.classList.add("btn_pressed");
        var line;

        seeConnectors(true);
        drawline = true;

        mysvg.onmousedown = function(e) {
            if (mybtn.classList.contains("btn_pressed")) {
                drawing = true;
                mDx = e.clientX;
                mDy = e.clientY;
                line = new Line();
                line.newLine();
                svgline = line;
                if (elementcorreleted != null) {
                    line.elemento0 = elementcorreleted;
                    elementcorreleted = null;
                }
                else {
                    //line.removeme();
                    console.log("invalid connection start, UMLControlFlow")
                }
            }
        };

        mysvg.onmousemove = function(e) {
            if(drawing) {
                mMx = e.clientX;
                mMy = e.clientY;
                line.setPosition(mDx, mDy, mMx, mMy);
            }
        };

        mysvg.onmouseup = function(e) {
            if (drawing) {
                drawing = false;
                mMx = e.clientX;
                mMy = e.clientY;

                if (line.elemento0 != null && elementcorreleted != null) {

                    correlate(e, elementcorreleted);        //AAA
                    //test el0 != el1 ?? ma è possibile
                    line.elemento1 = elementcorreleted;
                    elementcorreleted = null;
                    var r0 = setDownUp(line.elemento0, mDx, mDy);
                    var r1 = setDownUp(line.elemento1, mMx, mMy);
                    mDx = r0.mx;
                    mDy = r0.my;
                    mMx = r1.mx;
                    mMy = r1.my;
                    if (Math.abs(mDx - mMx) < 10 && Math.abs(mDy - mMy) < 10) {
                        line.removeme();
                        //line.remove();    // TODO come rimuovere obj?!
                    }
                    else {
                        line.setPosition(mDx, mDy, mMx, mMy);
                        line.myline3.setAttributeNS(null, "marker-end", "url(#arrowFlow)");
                        line.addText();
                        line.addclientrect();

                        line.elemento0.addLineIN(svgline);
                        line.elemento1.addLineOut(svgline);
                        if (line.elemento0.mytype=="note" || line.elemento1.mytype=="note")
                            line.setStyle("dashed");
                        svgline = null;
                    }
                }
                else {
                    line.removeme();
                    //obj??
                    console.log("invalid connection end, UMLControlFlow");
                }
            }
        };


        function onmouseenterbar(e) {
            if (mybtn.classList.contains("btn_pressed")) {
                if (drawing) {
                    deletelastsvgel("line", false);
                    deletelastsvgel("line", false);
                    deletelastsvgel("line", false);
                    //line.removeme();
                    //line.myline1.setAttributeNS(null, "style", "opacity:1");line.myline2.setAttributeNS(null, "style", "opacity:1");line.myline3.setAttributeNS(null, "style", "opacity:1");
                    drawing = false;
                }
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    mybtn.onclick=("click", click_btn11);

});