/**
 * Created by Sara on 11/12/2015.
 */
window.addEventListener("load", function(e) {

    mysvg = document.getElementById("mysvg");

    var p = document.getElementById("p");
    var c = document.getElementById("canc");
    var h = document.getElementById("hand");
    var w = document.getElementById("up");
    autorepeat(w, function() { translateSvg(0, -10) }, 1000, 2);
    var a = document.getElementById("left");
    autorepeat(a, function() { translateSvg(-10, 0) }, 1000, 2);
    var s = document.getElementById("down");
    autorepeat(s, function() { translateSvg(0, 10) }, 1000, 2);
    var d = document.getElementById("right");
    autorepeat(d, function() { translateSvg(10, 0) }, 1000, 2);
    var zi = document.getElementById("zin");
    var zo = document.getElementById("zout");
    var t = document.getElementById("txt");
    var note = document.getElementById("note");
    var mDx, mDy, mMx, mMy = 0;
    var pt = null;

//selezione
    function click_btnp() {
        reset_btn(document.getElementById("DAtt"));
        reset_btn(document.getElementById("Dann"));
        reset_btn(document.getElementById("Dview"));
        reset_btn(p.parentNode);
        p.classList.add("btn_pressed");
        c.style.display = "block";

        selection = true;

        setCursorByID("mysvg", "pointer");

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

    p.onclick=(click_btnp);

//cancellazione
    function click_btnc() {

        if(selection && elementsel!=null) {
            elementsel.removeme();
            elementsel = null;
            drag = false;
            resize = false;
        }
    }

    c.onclick=(click_btnc);


//mano per spostare vista
    function click_btnh() {
        reset_btn(document.getElementById("DAtt"));
        reset_btn(document.getElementById("Dann"));
        reset_btn(document.getElementById("Dview"));
        reset_btn(h.parentNode);
        h.classList.add("btn_pressed");
        var translate = false;
        var deltaX, deltaY = 0;

        setCursorByID("mysvg", "move");

        mysvg.onmousedown = function(e) {
            translate = true;
            pt = transformPoint(e.clientX, e.clientY);
            mDx = pt.x;
            mDy = pt.y;
        };

        mysvg.onmousemove = function(e) {
            if (translate) {
                pt = transformPoint(e.clientX, e.clientY);
                deltaX = pt.x - mDx;
                deltaY = pt.y - mDy;
                translateSvg(deltaX, deltaY);
            }
        };

        mysvg.onmouseup = function(e) {
            translate = false;
        };

        function onmouseenterbar(e) {
            translate = false;
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    h.onclick=(click_btnh);

//zoom in
    function click_btnzi() {
        reset_btn(document.getElementById("DAtt"));
        reset_btn(document.getElementById("Dann"));
        reset_btn(document.getElementById("Dview"));
        reset_btn(zi.parentNode);
        zi.classList.add("btn_pressed");
        var scale = false;

        mysvg.style = "cursor: -webkit-zoom-in; cursor: -moz-zoom-in ";

        mysvg.onmousedown = function(e) {
            scale = true;
            pt = transformPoint(e.clientX, e.clientY);
            scaleSvg(1.1, pt.x, pt.y);
        };

        mysvg.onmousemove = function(e) { };

        mysvg.onmouseup = function(e) {
            scale = false;
        };

        function onmouseenterbar(e) {
            scale = false;
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    zi.onclick=(click_btnzi);

//zoom out
    function click_btnzo() {
        reset_btn(document.getElementById("DAtt"));
        reset_btn(document.getElementById("Dann"));
        reset_btn(document.getElementById("Dview"));
        reset_btn(zo.parentNode);
        zo.classList.add("btn_pressed");
        var scale = false;

        mysvg.style = "cursor: -webkit-zoom-out; cursor: -moz-zoom-out ";

        mysvg.onmousedown = function(e) {
            scale = true;
            pt = transformPoint(e.clientX, e.clientY);
            scaleSvg(1/1.1, pt.x, pt.y);
        };

        mysvg.onmousemove = function(e) {
        };

        mysvg.onmouseup = function(e) {
            scale = false;
        };

        function onmouseenterbar(e) {
            scale = false;
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    zo.onclick=(click_btnzo);

//testo
    function Text() {
        var _this = this;
        var mytext = null;
        var mytbox = null;
        var myx, myy = 0;
        var offx, offy = 0;

        this.myfig = null;
        this.mytext = null;
        this.mytbox = null;
        this.mytype = "text";
        this.linesIN = new Array();
        this.linesOUT = new Array();
        this.myRes = null;

        this.newText = function(x, y) {
            myx = x;
            myy = y;
            var text;
            mytbox = document.createElement("input");
            var body = document.getElementsByTagName("body")[0];
            body.appendChild(mytbox);
            mytbox.type = "text";
            mytbox.setAttribute("id", "textbox");
            mytbox.style.stroke = standardcolor;
            mytbox.style.position = "absolute";
            mytbox.style.left = (myx+"px");
            mytbox.style.top = (myy+"px");
            mytbox.textAnchor = "start";
            mytbox.style.fontSize = 12+"px";
            setTimeout(function () {mytbox.focus(); }, 0);
            this.mytbox = mytbox;
            mytbox.addEventListener("keydown", function(evt) {
                if (evt.keyCode == 13) {
                    _this.setText();
                    _this.deleteinput();
                }
                else if (evt.keyCode == 46 || evt.keyCode == 27) {
                    _this.deleteinput();
                }
            });
        };
        this.setText = function() {
            mytext = document.createElementNS(svgNS, "text");
            this.setColor(standardcolor);
            mytext.setAttributeNS(null, "text-anchor", "start");
            mytext.setAttributeNS(null, "style", "font-family:" + ffam +"; font-size:" + fsz);
            pt = transformPoint(myx, myy);
            myx = pt.x;
            myy = pt.y;
            mytext.setAttributeNS(null, "x", myx.toString());
            mytext.setAttributeNS(null, "y", (myy+12).toString());
            mysvg.appendChild(mytext);
            this.myfig = mytext;
            this.mytext = mytext;
            mytext.textContent = mytbox.value;

            mytext.onmousedown = function(e) {
                select(e, _this);
                pt = transformPoint(e.clientX, e.clientY);
                offx = myx - pt.x;
                offy = myy - pt.y;
            };
            mytext.onmouseup = function(e) {
                drag = false;
            };
            mytext.ondblclick = function(e) {
                setProp(true, false, false, function(t, i, o) {
                    mytext.textContent = t;     });
            };
        };
        this.deleteinput = function() {
            var body = document.getElementsByTagName("body")[0];
            if(mytbox != null) body.removeChild(mytbox);
        };

        this.setColor = function(c) {
            mytext.setAttributeNS(null, "fill", c);
        };
        this.dragText = function(x, y) {
            myx = x;
            myy = y;
            mytext.setAttributeNS(null, "x", x.toString());
            mytext.setAttributeNS(null, "y", y.toString());
        };
        this.dragObj = function(mx, my) {
            var deltax, deltay = 0;
            deltax = (mx - myx) + offx;
            deltay = (my - myy) + offy;
            this.dragText(myx + deltax, myy + deltay);
        };

        this.toFront = function() {
            if (this.mytext!=null) {
                mysvg.removeChild(this.mytext);
                mysvg.appendChild(this.mytext);
            }
        };

        this.removeme = function() {
            if (mytext != null)  mytext.parentNode.removeChild(mytext);
        };

    }

    function click_btntext() {
        reset_btn(document.getElementById("DAtt"));
        reset_btn(document.getElementById("Dann"));
        reset_btn(document.getElementById("Dview"));
        reset_btn(document.getElementById("all"));
        reset_btn(t.parentNode);
        t.classList.add("btn_pressed");
        var mytxt = null;

        setCursorByID("mysvg", "text");

        mysvg.onmousedown = function(e) {
            if (t.classList.contains("btn_pressed")) {
                if (mytxt != null && mytxt.myfig == null) {
                    if (mytxt.mytbox.value.length > 0)
                        mytxt.setText();
                    mytxt.deleteinput();
                }
                mDx = e.clientX;
                mDy = e.clientY;
                mytxt = new Text();
                mytxt.newText(mDx, mDy);
            }
        };

        mysvg.onmousemove = function(e) {
        };

        mysvg.onmouseup = function(e) {
        };

        function onmouseenterbar() {
            if (t.classList.contains("btn_pressed")) {
                if (mytxt != null && mytxt.myfig == null) {
                    mytxt.deleteinput();
                    mytxt = null;
                }

            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    t.onclick=(click_btntext);


//note
    var fixed = true;
    function Note() {
        var _this = this;
        var myf = null;
        var mytext = null;
        var mytextlenght = 0;
        var c1, c2, c3, c4 = null;

        this.myfig = null;
        this.mytype = "note";
        this.mytext = null;
        this.linesIN = new Array();
        this.numconnIn = new Array();
        this.linesOUT = new Array();
        this.numconnOut = new Array();
        var r1, r2, r3, r4 = null;
        this.myRes = new Array();

        var myx, myy, tx, ty = null;
        var myw = stdw;
        var myh = stdh*2;
        var offx, offy;

        function ondblclickNote() {
            drag = false;
            if (selection) {
                setProp(true, false, false, function (t, i, o) {
                    mytext.textContent = t;
                    mytextlenght = mytext.textContent.length;
                    _this.updateNote(myx, myy, mytextlenght*9, myh);
                });
            }
        }

        this.newNote = function(x, y) {
            if (fixed) {
                myf = document.createElementNS(svgNS, "polygon");
                fixed = false;
                myf.setAttributeNS(null, "style", "stroke-width:2; opacity:0.3");
                myf.setAttributeNS(null, "fill", "white");
                mysvg.appendChild(myf);
                this.myfig = myf;
                this.setColor(standardcolor);
            }
            myx = x;
            myy = y;
            myf.setAttributeNS(null, "points", (myx + myw - 10).toString() + "," + myy.toString() + " " + (myx + myw).toString() + "," + (myy + 10).toString() +
                " " + (myx + myw - 10).toString() + "," + (myy + 10).toString() + " " + (myx + myw - 10).toString() + "," + myy.toString() +
                " " + (myx).toString() + "," + (myy).toString() + " " + (myx).toString() + "," + (myy + myh).toString() +
                " " + (myx + myw).toString() + "," + (myy + myh).toString() + " " + (myx + myw).toString() + "," + (myy + 10).toString());

            myf.onmousedown = function(e) {
                select(e, _this);
                seeResize();
                pt = transformPoint(e.clientX, e.clientY);
                offx = (myx - pt.x);
                offy = (myy - pt.y);
                //correlate(e, _this);
            };
            myf.onmouseup = function(e) {
                drag = false;
                //correlate(e, _this);
            };
            myf.ondblclick = function(e) {
                drag = false;
                ondblclickNote();
            };
        };

        this.updateNote = function(x, y, w, h) {
            if (!fixed) {
                c1 = new Connection(_this);
                c1.setN(1);
                mysvg.appendChild(c1.myfig);
                c2 = new Connection(_this);
                c2.setN(2);
                mysvg.appendChild(c2.myfig);
                c3 = new Connection(_this);
                c3.setN(3);
                mysvg.appendChild(c3.myfig);
                c4 = new Connection(_this);
                c4.setN(4);
                mysvg.appendChild(c4.myfig);

                r1 = new Resize(this, 1);
                mysvg.appendChild(r1.myfig);
                r2 = new Resize(this, 2);
                mysvg.appendChild(r2.myfig);
                r3 = new Resize(this, 3);
                mysvg.appendChild(r3.myfig);
                r4 = new Resize(this, 4);
                mysvg.appendChild(r4.myfig);
                this.myRes.push(r1, r2, r3, r4);

                myf.setAttributeNS(null, "style", "stroke-width:2; opacity:1");
                fixed = true;
            }
            var minw = Math.max(w, stdw, mytextlenght*9);
            myx = x;
            myw = minw;
            if (h >= stdh) {
                myy = y;
                myh = h;
            }
            myf.setAttributeNS(null, "points", (myx + myw - 10).toString() + "," + myy.toString() + " " + (myx + myw).toString() + "," + (myy + 10).toString() +
                " " + (myx + myw - 10).toString() + "," + (myy + 10).toString() + " " + (myx + myw - 10).toString() + "," + myy.toString() +
                " " + (myx).toString() + "," + (myy).toString() + " " + (myx).toString() + "," + (myy + myh).toString() +
                " " + (myx + myw).toString() + "," + (myy + myh).toString() + " " + (myx + myw).toString() + "," + (myy + 10).toString());

            this.setConn();
            this.setRes();
        };

        this.setConn = function () {
            c1.updateConnection(myx + myw/2 - cdim/2, myy - cdim/2);
            c2.updateConnection(myx + myw/2 - cdim/2, myy + myh - cdim/2);
            c3.updateConnection(myx - cdim/2, myy + myh/2 - cdim/2);
            c4.updateConnection(myx + myw - cdim/2, myy + myh/2 - cdim/2);
            var i;
            var l;
            for (i=0; i<this.linesIN.length; i++) {
                l =  this.linesIN[i];
                switch (this.numconnIn[i]) {
                    case 1: {
                        l.setPosition(c1.x, c1.y, l.endX, l.endY);
                        break;
                    }
                    case 2: {
                        l.setPosition(c2.x, c2.y, l.endX, l.endY);
                        break;
                    }
                    case 3: {
                        l.setPosition(c3.x, c3.y, l.endX, l.endY);
                        break;
                    }
                    case 4: {
                        l.setPosition(c4.x, c4.y, l.endX, l.endY);
                        break;
                    }
                }
            }
            for (i=0; i<this.linesOUT.length; i++) {
                l =  this.linesOUT[i];
                switch (this.numconnOut[i]) {
                    case 1: {
                        l.setPosition(l.initX, l.initY, c1.x, c1.y);
                        break;
                    }
                    case 2: {
                        l.setPosition(l.initX, l.initY, c2.x, c2.y);
                        break;
                    }
                    case 3: {
                        l.setPosition(l.initX, l.initY, c3.x, c3.y);
                        break;
                    }
                    case 4: {
                        l.setPosition(l.initX, l.initY, c4.x, c4.y);
                        break;
                    }
                }
            }

        };

        this.setText = function() {
            tx = myx + 3;
            ty = myy + 13;
            mytext.setAttributeNS(null, "x", tx.toString());
            mytext.setAttributeNS(null, "y", ty.toString());
        };
        this.addText = function() {
            mytext = document.createElementNS(svgNS, "text");
            this.setText();
            mytext.setAttributeNS(null, "style", "font-family:" + ffam +"; font-size:" + fsz);
            mytext.setAttributeNS(null, "fill", standardcolor);
            mytext.textContent = "note: ";
            mytextlenght = mytext.textContent.length;
            this.mytext = mytext;
            mysvg.appendChild(mytext);

            mytext.onmousedown = function(e) {
                select(e, _this);
                seeResize();
                pt = transformPoint(e.clientX, e.clientY);
                offx = myx - pt.x;
                offy = myy - pt.y;
                //correlate(e, _this);
            };
            mytext.onmouseup = function(e) {
                drag = false;
                //correlate(e, _this);
            };
            mytext.ondblclick = function(e) {
                drag = false;
                ondblclickNote();
            }
        };

        this.setRes = function () {
            r1.updateResize(myx - cdim/2, myy - cdim/2);
            r2.updateResize(myx + myw - cdim/2, myy - cdim/2);
            r4.updateResize(myx - cdim/2, myy + myh - cdim/2);
            r3.updateResize(myx + myw - cdim/2, myy + myh - cdim/2);
        };
        this.resizeObj = function(mx, my) {
            var i, deltaw, deltah, lx, ly = 0;
            switch (numresize) {
                case 1:
                {
                    this.updateNote(mx, my, myw + (myx - mx), myh + (myy - my));
                    break;
                }
                case 2:
                {
                    this.updateNote(myx, my, mx - myx, myh + (myy - my));
                    break;
                }
                case 3:
                {
                    this.updateNote(myx, myy, mx - myx, my - myy);
                    break;
                }
                case 4:
                {
                    this.updateNote(mx, myy, myw + (myx - mx), my - myy);
                    break;
                }
            }
            this.setText();
        };

        this.addLineIN = function(l) {
            this.linesIN.push(l);
            this.numconnIn.push(Cdown);
        };
        this.addLineOut = function (l) {
            this.linesOUT.push(l);
            this.numconnOut.push(Cup);
        };
        this.removeLine = function (l) {
            var i = this.linesIN.indexOf(l);
            if (i > -1) {
                this.linesIN.splice(i, 1);
                this.numconnIn.splice(i, 1);
            }
            else {
                i = this.linesOUT.indexOf(l);
                if (i > -1) {
                    this.linesOUT.splice(i, 1);
                    this.numconnOut.splice(i, 1);
                }
            }
        };

        this.setColor = function(c) {
            myf.setAttributeNS(null, "stroke", c);
            if (mytext!=null) mytext.setAttributeNS(null, "fill", c);
        };

        this.dragNote = function(dx, dy) {
            this.updateNote(myx + dx, myy + dy, myw, myh);
            this.setText();
        };
        this.dragObj = function(mx, my) {
            var deltax, deltay, i, l;
            deltax = (mx - myx) + offx;
            deltay = (my - myy) + offy;
            this.dragNote(deltax, deltay);
        };

        this.toFront = function() {
            if (this.myfig!=null) {
                mysvg.removeChild(this.myfig);
                mysvg.appendChild(this.myfig);
            }
            if (this.mytext!=null) {
                mysvg.removeChild(this.mytext);
                mysvg.appendChild(this.mytext);
            }
            if (this.myRes != null) {
                mysvg.removeChild(r1.myfig);
                mysvg.appendChild(r1.myfig);
                mysvg.removeChild(r2.myfig);
                mysvg.appendChild(r2.myfig);
                mysvg.removeChild(r3.myfig);
                mysvg.appendChild(r3.myfig);
                mysvg.removeChild(r4.myfig);
                mysvg.appendChild(r4.myfig);
            }

            if (elementsel == this) {
                var i;
                var n = this.linesIN.length;
                for (i = 0; i < n; i++)
                    this.linesIN[0].toFront();
                n = this.linesOUT.length;
                for (i = 0; i < n; i++)
                    this.linesOUT[0].toFront();
            }
        };

        this.removeme = function() {
            myf.parentNode.removeChild(myf);
            if (mytext != null) mytext.parentNode.removeChild(mytext);
            c1.removeme();
            c2.removeme();
            c3.removeme();
            c4.removeme();
            var n = this.linesIN.length;
            var i;
            for(i = 0; i<n; i++)
                this.linesIN[0].removeme();
            n = this.linesOUT.length;
            for(i = 0; i<n; i++)
                this.linesOUT[0].removeme();
            removeRes();
        };

    }

    var drawing = false;
    function click_btnnote() {
        reset_btn(document.getElementById("DAtt"));
        reset_btn(document.getElementById("Dann"));
        reset_btn(document.getElementById("Dview"));
        reset_btn(document.getElementById("all"));
        reset_btn(note.parentNode);
        note.classList.add("btn_pressed");
        var f = null;
        setCursorByID("mysvg", "none");

        mysvg.onmousedown = function(e){ };

        mysvg.onmousemove = function(e) {
            if (note.classList.contains("btn_pressed")) {
                pt = transformPoint(e.clientX, e.clientY);
                mMx = pt.x;
                mMy = pt.y;
                if (fixed) {
                    f = new Note();
                }
                f.newNote(mMx, mMy);
                drawing = true;
            }
        };

        mysvg.onmouseup = function(e) {
            if (drawing) {
                pt = transformPoint(e.clientX, e.clientY);
                mMx = pt.x;
                mMy = pt.y;
                f.updateNote(mMx, mMy, stdw, stdh*2);
                f.addText();
                drawing = false;
            }
        };

        function onmouseenterbar(e) {
            if (note.classList.contains("btn_pressed")) {
                deletelastsvgel("polygon", fixed);
                fixed = true;
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    note.onclick=(click_btnnote);

});