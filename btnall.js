/**
 * Created by Sara on 11/12/2015.
 */
window.addEventListener("load", function(e) {

    var p = document.getElementById("p");
    var c = document.getElementById("canc");
    var t = document.getElementById("txt");
    var note = document.getElementById("note");
    var mysvg = document.getElementById("mysvg");
    var mDx, mDy, mMx, mMy = 0;

//selezione
    function click_btnp() {
        reset_btn(document.getElementById("DAtt"));
        reset_btn(document.getElementById("DClassi"));
        reset_btn(document.getElementById("MStati"));
        reset_btn(p.parentNode);
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
            setCursorByID("mysvg", "default");
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    p.onclick=("click", click_btnp);

//cancellazione
    function click_btnc() {

        if(selection && elementsel!=null) {
            elementsel.removeme();
            elementsel = null;
            drag = false;
            resize = false;
        }
    }

    c.onclick=("click", click_btnc);

//testo     TODO !!!!!!!!!!!!!!!!!!!!!!!!!
    function Text() {
        var _this = this;
        var mytext = null;
        var mytbox = null;
        var myx, myy = 0;
        var offx, offy = 0;

        this.myfig = null;
        this.mytype = "text";
        this.linesIN = new Array();
        this.linesOUT = new Array();
        this.myRes = null;

        this.newText = function(x, y) {
            myx = x;
            myy = y;
            mytbox = document.createElement("textbox");
            mytbox.id = "mytbox";
            mytbox.style.borderColor = standardcolor;
            mytbox.style.borderWidth = 2+"px";
            mytbox.style.stroke = standardcolor;
            mytbox.style.position = "absolute";
            mytbox.style.left = (myx+"px");
            mytbox.style.top = (myy+"px");
            mytbox.textAnchor = "start";
            mytbox.fontFamily = "monospace";
            mytbox.fontSize = 20+"px";
            mytbox.textContent = "aaaaaaaaaaaaaaaaa";
            document.getElementById("canvas_container").appendChild(mytbox);

            mytext = document.createElementNS(svgNS, "text");
            mytext.setAttributeNS(null, "stroke", standardcolor);
            mytext.setAttributeNS(null, "fill", "white");
            mytext.setAttributeNS(null, "text-anchor", "start");
            mytext.setAttributeNS(null, "font-family", "monospace");
            mytext.setAttributeNS(null, "font-size", "14px");
            mytext.setAttributeNS(null, "x", myx.toString());
            mytext.setAttributeNS(null, "y", myy.toString());
            mytext.textContent = "ufffaa";
            mytext.setAttributeNS(null, "text-anchor", "start");
            mysvg.appendChild(mytext);

            this.myfig = mytext;

            mytbox.focus();

            mytext.onmousedown = function(e) {
                select(e, _this);
                offx = myx - e.clientX;
                offy = myy - e.clientY;
            };
            mytext.onmouseup = function(e) {
                drag = false;
            };
            mytext.ondblclick = function(e) {
                setProp(true, false, false, function(t, i, o) {
                    mytext.textContent = t;     });
            };
        };

        this.setText = function(val) {
            //tspan?! - textbox
            //var textNode = document.createTextNode(val);
            //mytext.appendChild(textNode);
            mytext.textContent = val;
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
            var deltax, deltay, i, l;
            deltax = (mx - myx) + offx;
            deltay = (my - myy) + offy;
            this.dragText(myx + deltax, myy + deltay);
        };

        this.removeme = function() {
            if (mytext != null)  {
                mytext.parentNode.removeChild(mytext);
            }
        };

    }

    function click_btntext() {
        reset_btn(document.getElementById("DAtt"));
        reset_btn(document.getElementById("DClassi"));
        reset_btn(document.getElementById("MStati"));
        reset_btn(t.parentNode);
        t.classList.add("btn_pressed");
        var mytxt = null;

        setCursorByID("mysvg", "text");

        mysvg.onmousedown = function(e) {
            if (t.classList.contains("btn_pressed")) {
                mDx = e.clientX;
                mDy = e.clientY;
                mytxt = new Text();
                mytxt.newText(mDx, mDy);
                //setProp(true, false, false, function(t, i, o) { mytxt.setText(t); });
            }
        };

        mysvg.onmousemove = function(e) {

        };

        mysvg.onmouseup = function(e) {

        };

        //TODO add evtlistener a Enter?

        function onmouseenterbar() {
            if (t.classList.contains("btn_pressed")) {
                deletelastsvgel("text", false);

            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    t.onclick=("click", click_btntext);


//note
    var fixed = true;
    function Note() {
        var _this = this;
        var myf = null;
        var mytext = null;          //TODO multiline??!!
        var c1, c2, c3, c4 = null;

        this.myfig = null;
        this.mytype = "note";
        this.mytext = null;
        this.linesIN = new Array();     //TODO solo out?
        this.linesOUT = new Array();
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
                offx = (myx - e.clientX);
                offy = (myy - e.clientY);
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
                mysvg.appendChild(c1.myfig);
                c2 = new Connection(_this);
                mysvg.appendChild(c2.myfig);
                c3 = new Connection(_this);
                mysvg.appendChild(c3.myfig);
                c4 = new Connection(_this);
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

                myf.setAttributeNS(null, "style", "opacity:1");
                fixed = true;
            }
            if (w >= stdw) {
                myx = x;
                myw = w;
            }
            if (h >= stdh) {
                myy = y;
                myh = h;
            }
            myf.setAttributeNS(null, "points", (myx + myw - 10).toString() + "," + myy.toString() + " " + (myx + myw).toString() + "," + (myy + 10).toString() +
                " " + (myx + myw - 10).toString() + "," + (myy + 10).toString() + " " + (myx + myw - 10).toString() + "," + myy.toString() +
                " " + (myx).toString() + "," + (myy).toString() + " " + (myx).toString() + "," + (myy + myh).toString() +
                " " + (myx + myw).toString() + "," + (myy + myh).toString() + " " + (myx + myw).toString() + "," + (myy + 10).toString());
            this.setConn();
        };
        this.setConn = function () {
            c1.updateConnection(myx + myw/2 - cdim/2, myy - cdim/2);
            c2.updateConnection(myx + myw/2 - cdim/2, myy + myh - cdim/2);
            c3.updateConnection(myx - cdim/2, myy + myh/2 - cdim/2);
            c4.updateConnection(myx + myw - cdim/2, myy + myh/2 - cdim/2)
        };

        this.setText = function() {
            tx = myx + 3;
            ty = myy + 10;
            mytext.setAttributeNS(null, "x", tx.toString());
            mytext.setAttributeNS(null, "y", ty.toString());
        };
        this.addText = function() {
            mytext = document.createElementNS(svgNS, "text");
            this.setText();
            mytext.setAttributeNS(null, "style", "font-family:arial; font-size:18");
            mytext.setAttributeNS(null, "fill", standardcolor);
            mytext.textContent = "note: ";
            this.mytext = mytext;
            mysvg.appendChild(mytext);

            mytext.onmousedown = function(e) {
                select(e, _this);
                seeResize();
                offx = myx - e.clientX;
                offy = myy - e.clientY;
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
            this.setRes();
            this.setText();
        };

        this.addLineIN = function(l) {
            this.linesIN.push(l);
        };
        this.addLineOut = function (l) {
            this.linesOUT.push(l);
        };
        this.removeLine = function (l) {
            var i = this.linesIN.indexOf(l);
            if (i > -1) {
                this.linesIN.splice(i, 1);
            }
            else {
                i = this.linesOUT.indexOf(l);
                if (i > -1) {
                    this.linesOUT.splice(i, 1);
                }
            }
        };

        this.setColor = function(c) {
            myf.setAttributeNS(null, "stroke", c);
            if (mytext!=null) mytext.setAttributeNS(null, "fill", c);
        };

        this.dragNote = function(dx, dy) {
            this.updateNote(myx + dx, myy + dy, myw, myh);
            this.setRes();
            this.setText();
        };
        this.dragObj = function(mx, my) {
            var deltax, deltay, i, l;
            deltax = (mx - myx) + offx;
            deltay = (my - myy) + offy;
            this.dragNote(deltax, deltay);
            for (i = 0; i<this.linesIN.length; i++) {
                l = this.linesIN[i];
                l.setPosition(l.initX + deltax, l.initY + deltay, l.endX, l.endY);
            }
            for (i = 0; i<this.linesOUT.length; i++) {
                l = this.linesOUT[i];
                l.setPosition(l.initX, l.initY, l.endX + deltax, l.endY + deltay);
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
        reset_btn(document.getElementById("DClassi"));
        reset_btn(document.getElementById("MStati"));
        reset_btn(note.parentNode);
        note.classList.add("btn_pressed");
        var f = null;

        mysvg.onmousedown = function(e){ };

        mysvg.onmousemove = function(e) {
            if (note.classList.contains("btn_pressed")) {
                mMx = e.clientX;
                mMy = e.clientY;
                if (fixed) {
                    f = new Note();
                }
                f.mytype = 1;
                f.newNote(mMx, mMy);
                drawing = true;
            }
        };

        mysvg.onmouseup = function(e) {
            if (drawing) {
                mMx = e.clientX;
                mMy = e.clientY;
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

    note.onclick=("click", click_btnnote);

});