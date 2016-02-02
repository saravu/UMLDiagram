/**
 * Created by Sara on 11/12/2015.
 */

//link, otogonale
window.addEventListener("load", function(e) {

    var mybtn = document.getElementById("link");
    var mDx, mDy, mMx, mMy = 0;
    var drawing = false;
    var pt = null;

    function Link() {
        var _this = this;
        var mypath = null;
        var bcr1, bcr2, bcr3 = null;        //bounding client rectangle della linea - aggiungerli alla fine
        var lin1x1, lin1y1, lin1x2, lin1y2, lin3x1, lin3y1, lin3x2, lin3y2 = null;
        var draggedline = null;
        var offx, offy;
        var path = null;

        this.mytype = "link";
        this.elemento0=null;
        this.elemento1=null;
        this.mypath = null;
        this.mytext = null;
        this.myRes = null;
        this.initX = null;
        this.initY = null;
        this.endX = null;
        this.endY = null;

        this.newLine = function() {
            mypath = document.createElementNS(svgNS, "path");
            mypath.setAttributeNS(null, "style", "opacity:0.3");
            mypath.setAttributeNS(null, "fill", "none");
            mysvg.appendChild(mypath);
            _this.mypath = mypath;
            this.setColor(standardcolor);
            this.setStyle("dashed");

            mypath.onmousedown = function(e) {
                select(e, _this);
                draggedline = 0;
            };
            mypath.onmouseup = function(e) {
                drag = false;
            };
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
            path = "M" + lin1x1 + " " + lin1y1 + " L" + lin1x2 + " " +  lin1y2 + " L" + lin3x1 + " " +  lin3y1 + " L" + lin3x2 + " " +  lin3y2;
            mypath.setAttributeNS(null, "d", path);
            if (bcr1 != null) updateRect(bcr1, Math.min(lin1x1, lin1x2)-5, Math.min(lin1y1, lin1y2)-5, (lin1x2-lin1x1+10), (lin1y2-lin1y1+10));
            if (bcr2 != null) updateRect(bcr2, Math.min(lin3x1, lin1x2)-5, Math.min(lin1y2, lin3y1)-5, (lin3x1-lin1x2+10), (lin3y1-lin1y2+10));
            if (bcr3 != null) updateRect(bcr3, Math.min(lin3x1, lin3x2)-5, Math.min(lin3y1, lin3y2)-5, (lin3x2-lin3x1+5-1), (lin3y2-lin3y1+5-1));
            if (!drawing) {
                mypath.setAttributeNS(null, "style", "opacity:1");
                mypath.setAttributeNS(null, "style", "stroke-dasharray: 10, 5; marker-end: url(#arrowFlow)");
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
                pt = transformPoint(e.clientX, e.clientY);
                offx = (lin1x1 - pt.x);
                offy = (lin1y1 - pt.y);
            };
            bcr2.onmousedown = function(e) {
                select(e, _this);
                draggedline = 2;
                pt = transformPoint(e.clientX, e.clientY);
                offx = (lin1x2 - pt.x);
                offy = (lin1y2 - pt.y);
            };
            bcr3.onmousedown = function(e) {
                select(e, _this);
                draggedline = 3;
                pt = transformPoint(e.clientX, e.clientY);
                offx = (lin3x1 - pt.x);
                offy = (lin3y1 - pt.y);
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
        };

        this.setColor = function(c) {
            mypath.setAttributeNS(null, "stroke", c);
            //document.getElementById("AFp").setAttributeNS(null, "style", "stroke:" + c + "; fill: none");
        };
        this.setStyle = function(s) {
            if (s=="dashed") {
                mypath.setAttributeNS(null, "style", "stroke-dasharray: 10, 5");
            }
        };
        this.dragObj = function(mx, my) {
            var deltax = 0;
            var deltay = 0;
            if (draggedline == 2) {        //sposto -solo- il pezzo centrale
                if (lin1x2 == lin3x1) deltax = (mx - lin1x2) + offx;
                if (lin1y2 == lin3y1) deltay = (my - lin1y2) + offy;
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

                path = "M" + lin1x1 + " " +  lin1y1 + " L" + lin1x2 + " " +  lin1y2 + " L" + lin3x1 + " " +  lin3y1 + " L" + lin3x2 + " " +  lin3y2;
                mypath.setAttributeNS(null, "d", path);
                updateRect(bcr1, Math.min(lin1x1, lin1x2)-5, Math.min(lin1y1, lin1y2)-5, (lin1x2-lin1x1+10), (lin1y2-lin1y1+10));
                updateRect(bcr2, Math.min(lin3x1, lin1x2)-5, Math.min(lin1y2, lin3y1)-5, (lin3x1-lin1x2+10), (lin3y1-lin1y2+10));
                updateRect(bcr3, Math.min(lin3x1, lin3x2)-5, Math.min(lin3y1, lin3y2)-5, (lin3x2-lin3x1+5-1), (lin3y2-lin3y1+5-1));
            }
        };

        this.removeme = function() {
            if (mypath!=null) mypath.parentNode.removeChild(mypath);
            if (bcr1!=null) bcr1.parentNode.removeChild(bcr1);
            if (bcr2!=null) bcr2.parentNode.removeChild(bcr2);
            if (bcr3!=null) bcr3.parentNode.removeChild(bcr3);
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

    function click_btnLink() {
        reset_btn(mybtn.parentNode);
        reset_btn(document.getElementById("all"));
        mybtn.classList.add("btn_pressed");
        var path;
        var invalid = false;
        var divinv = document.getElementById("path");

        seeConnectors(true);
        drawline = true;

        mysvg.onmousedown = function(e) {
            if (mybtn.classList.contains("btn_pressed")) {
                drawing = true;
                pt = transformPoint(e.clientX, e.clientY);
                mDx = pt.x;
                mDy = pt.y;
                path = new Link();
                path.newLine();
                svgline = path;
                if (elementcorreleted != null) {
                    mDx = connsel.x;
                    mDy = connsel.y;
                    path.elemento0 = elementcorreleted;
                    elementcorreleted = null;
                }
                else {
                    divinv.style.display = "block";
                    setTimeout(function() {divinv.style.display = "none";}, 2500);
                    invalid = true;
                }
            }
        };

        mysvg.onmousemove = function(e) {
            if(drawing) {
                pt = transformPoint(e.clientX, e.clientY);
                mMx = pt.x;
                mMy = pt.y;
                path.setPosition(mDx, mDy, mMx, mMy);
            }
        };

        mysvg.onmouseup = function(e) {
            if (drawing) {
                drawing = false;
                pt = transformPoint(e.clientX, e.clientY);
                mMx = pt.x;
                mMy = pt.y;

                if (invalid) {
                    path.removeme();
                    invalid = false;
                }
                else if (path.elemento0 != null && elementcorreleted != null) {
                    correlate(e, elementcorreleted);        //AAA
                    if (elementcorreleted.mytype == "note" || path.elemento0.mytype == "note") {
                        path.elemento1 = elementcorreleted;
                        elementcorreleted = null;
                        mMx = connsel.x;
                        mMy = connsel.y;
                        if (Math.abs(mDx - mMx) < 10 && Math.abs(mDy - mMy) < 10) {
                            path.removeme();
                        }
                        else {
                            path.setPosition(mDx, mDy, mMx, mMy);
                            path.mypath.setAttributeNS(null, "style", "stroke-dasharray: 10, 5; marker-end: url(#arrowFlow)");
                            path.addclientrect();
                            //AAA attenzione i nomi sono invertiti
                            path.elemento0.addLineIN(svgline);
                            path.elemento1.addLineOut(svgline);
                            svgline = null;
                        }
                    }
                    else {
                        path.removeme();
                        divinv.style.display = "block";
                        setTimeout(function() {divinv.style.display = "none";}, 2500);
                    }
                }
                else {
                    path.removeme();
                    divinv.style.display = "block";
                    setTimeout(function() {divinv.style.display = "none";}, 2500);
                }
            }
        };


        function onmouseenterbar(e) {
            if (mybtn.classList.contains("btn_pressed")) {
                if (drawing) {
                    deletelastsvgel("path", false);
                    //line.removeme();
                    drawing = false;
                    invalid = false;
                }
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    mybtn.onclick=("click", click_btnLink);

});