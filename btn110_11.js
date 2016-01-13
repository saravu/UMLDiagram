/**
 * Created by Sara on 11/12/2015.
 */

//azioni dall'esterno
//send/receive signal
window.addEventListener("load", function(e) {

    var btnSndSig = document.getElementById("btn110");
    var btnRcvSig = document.getElementById("btn111");
    var btnTimer = document.getElementById("btn112");
    var mysvg = document.getElementById("mysvg");
    var mDx, mDy, mMx, mMy = 0;
    var drawing = false;
    var fixed = true;

    function Signal() {
        var _this = this;
        var myf = null;
        var mytext = null;
        var c1, c2, c3, c4 = null;

        this.myfig = null;
        this.mytype = null;     // 0 = send, 1 = receive
        this.mytext = null;
        this.linesIN = new Array();
        this.linesOUT = new Array();

        var myx, myy, puntax, puntay, tx, ty = null;
        var w = stdw;
        var h = stdh;
        var offx, offy;

        function ondblclickSig() {
            drag = false;
            if (selection) {
                switch (_this.mytype) {
                    case 0:
                    {
                        setProp(true, false, false, function (t, i, o) {
                            mytext.textContent = t;
                        });
                        break;
                    }
                    case 1:
                    {
                        setProp(true, false, false, function (t, i, o) {
                            mytext.textContent = t;
                        });
                        break;
                    }
                }
            }
        }

        this.newSig = function(x, y) {
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
            switch (this.mytype) {
                case 0:
                {  //send signal
                    puntax = myx + 20;
                    puntay = myy + h/2;
                    myf.setAttributeNS(null, "points", myx.toString() + "," + myy.toString() + " " + (myx + w).toString() + "," + myy.toString() +
                        " " + (myx + w).toString() + "," + (myy + h).toString() + " " + (myx).toString() + "," + (myy + h).toString() +
                    " " + puntax.toString() + "," + puntay.toString());
                    break;
                }
                case 1:
                { //receive signal
                    puntax = myx + w + 20;
                    puntay = myy + h/2;
                    myf.setAttributeNS(null, "points", myx.toString() + "," + myy.toString() + " " + (myx + w).toString() + "," + myy.toString() +
                        " " + puntax.toString() + "," + (puntay).toString() + " " + (myx + w).toString() + "," + (myy + h).toString() +
                        " " + (myx).toString() + "," + (myy + h).toString());
                    break;
                }
            }

            myf.onmousedown = function(e) {
                select(e, _this);
                offx = (myx - e.clientX);
                offy = (myy - e.clientY);
                correlate(e, _this);
            };
            myf.onmouseup = function(e) {
                drag = false;
                correlate(e, _this);
            };
            myf.ondblclick = function(e) {
                drag = false;
                ondblclickSig();
            };
        };

        this.updateSig = function(x, y) {
            if (!fixed) {
                c1 = new Connection(_this);
                mysvg.appendChild(c1.myfig);
                c2 = new Connection(_this);
                mysvg.appendChild(c2.myfig);
                c3 = new Connection(_this);
                mysvg.appendChild(c3.myfig);
                c4 = new Connection(_this);
                mysvg.appendChild(c4.myfig);
            }
            myx = x;
            myy = y;
            switch (this.mytype) {
                case 0:
                {  //send signal
                    puntax = myx + 20;
                    puntay = myy + h/2;
                    myf.setAttributeNS(null, "points", myx.toString() + "," + myy.toString() + " " + (myx + w).toString() + "," + myy.toString() +
                        " " + (myx + w).toString() + "," + (myy + h).toString() + " " + (myx).toString() + "," + (myy + h).toString() +
                        " " + puntax.toString() + "," + puntay.toString());
                    break;
                }
                case 1:
                { //receive signal
                    puntax = myx + w + 20;
                    puntay = myy + h/2;
                    myf.setAttributeNS(null, "points", myx.toString() + "," + myy.toString() + " " + (myx + w).toString() + "," + myy.toString() +
                        " " + puntax.toString() + "," + (puntay).toString() + " " + (myx + w).toString() + "," + (myy + h).toString() +
                        " " + (myx).toString() + "," + (myy + h).toString());
                    break;
                }
            }
            this.setConn();
        };
        this.setConn = function () {
            c1.updateConnection(myx + w/2 - cdim/2, myy - cdim/2);
            c2.updateConnection(myx + w/2 - cdim/2, myy + h - cdim/2);
            c3.updateConnection(puntax - cdim/2, puntay - cdim/2);
            switch (this.mytype) {
                case 0: c4.updateConnection(myx + w - cdim/2, myy + h/2 - cdim/2); break;
                case 1: c4.updateConnection(myx - cdim/2, myy + h/2 - cdim/2); break;
            }
        };

        this.addText = function() {
            mytext = document.createElementNS(svgNS, "text");
            tx = myx + 20;
            ty = myy + h/2;
            mytext.setAttributeNS(null, "x", tx.toString());
            mytext.setAttributeNS(null, "y", ty.toString());
            mytext.setAttributeNS(null, "style", "font-family:arial; font-size:18");
            mytext.setAttributeNS(null, "fill", standardcolor);
            mytext.textContent = "signal";
            this.mytext = mytext;
            mysvg.appendChild(mytext);

            mytext.onmousedown = function(e) {
                select(e, _this);
                offx = myx - e.clientX;
                offy = myy - e.clientY;
                correlate(e, _this);
            };
            mytext.onmouseup = function(e) {
                drag = false;
                correlate(e, _this);
            };
            mytext.ondblclick = function(e) {
                drag = false;
                ondblclickSig();
            }
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

        this.dragSig = function(dx, dy) {
            this.updateSig(myx + dx, myy + dy);
            tx = myx + 20;
            ty = myy + h/2;
            mytext.setAttributeNS(null, "x", tx.toString());
            mytext.setAttributeNS(null, "y", ty.toString());
        };
        this.dragObj = function(mx, my) {
            var deltax, deltay, i, l;
            deltax = (mx - myx) + offx;
            deltay = (my - myy) + offy;
            this.dragSig(deltax, deltay);
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
        };

    }

//send signal
    function click_btn110() {
        reset_btn(btnSndSig.parentNode);
        btnSndSig.classList.add("btn_pressed");
        var f = null;
        mysvg.onmousedown = function(e){ };

        mysvg.onmousemove = function(e) {
            if (btnSndSig.classList.contains("btn_pressed")) {
                mMx = e.clientX;
                mMy = e.clientY;
                if (fixed) {
                    f = new Signal();
                }
                f.mytype = 0;
                f.newSig(mMx, mMy);
                drawing = true;
            }
        };

        mysvg.onmouseup = function(e) {
            if (drawing) {
                mMx = e.clientX;
                mMy = e.clientY;
                f.updateSig(mMx, mMy);
                f.addText();
                f.myfig.setAttributeNS(null, "style", "opacity:1");
                fixed = true;
                drawing = false;
            }
        };

        function onmouseenterbar(e) {
            if (btnSndSig.classList.contains("btn_pressed")) {
                deletelastsvgel("polygon", fixed);
                fixed = true;
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

//receive signal
    function click_btn111() {
        reset_btn(btnRcvSig.parentNode);
        btnRcvSig.classList.add("btn_pressed");
        var f = null;

        mysvg.onmousedown = function(e){ };

        mysvg.onmousemove = function(e) {
            if (btnRcvSig.classList.contains("btn_pressed")) {
                mMx = e.clientX;
                mMy = e.clientY;
                if (fixed) {
                    f = new Signal();
                }
                f.mytype = 1;
                f.newSig(mMx, mMy);
                drawing = true;
            }
        };

        mysvg.onmouseup = function(e) {
            if (drawing) {
                mMx = e.clientX;
                mMy = e.clientY;
                f.updateSig(mMx, mMy);
                f.addText();
                f.myfig.setAttributeNS(null, "style", "opacity:1");
                fixed = true;
                drawing = false;
            }
        };

        function onmouseenterbar(e) {
            if (btnRcvSig.classList.contains("btn_pressed")) {
                deletelastsvgel("polygon", fixed);
                fixed = true;
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    btnSndSig.onclick=("click", click_btn110);

    btnRcvSig.onclick=("click", click_btn111);


//timer
    function Timer() {
        var _this = this;
        var myf = null;
        var mytext = null;
        var c1, c2, c3 = null;

        this.myfig = null;
        this.mytype = "timer";
        this.mytext = null;
        this.linesIN = new Array();
        this.linesOUT = new Array();

        var myx, myy, puntax, puntay = null;
        var w = 40;
        var h = 30;
        var offx, offy;

        function ondblclickTimer() {
            drag = false;
            if (selection) {
                setProp(true, false, false, function (t, i, o) {
                    mytext.textContent = t;
                });
            }
        }

        this.newTimer = function(x, y) {
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
            puntax = myx + w/2;
            puntay = myy + h/2;
            myf.setAttributeNS(null, "points", myx.toString() + "," + myy.toString() + " " + (myx + w).toString() + "," + myy.toString() +
                " " + (myx).toString() + "," + (myy + h).toString() + " " + (myx + w).toString() + "," + (myy + h).toString());

            myf.onmousedown = function(e) {
                select(e, _this);
                offx = (myx - e.clientX);
                offy = (myy - e.clientY);
                correlate(e, _this);
            };
            myf.onmouseup = function(e) {
                drag = false;
                correlate(e, _this);
            };
            myf.ondblclick = function(e) {
                drag = false;
                ondblclickTimer();
            };
        };

        this.updateTimer = function(x, y) {
            if (!fixed) {
                c1 = new Connection(_this);
                mysvg.appendChild(c1.myfig);
                c2 = new Connection(_this);
                mysvg.appendChild(c2.myfig);
                c3 = new Connection(_this);
                mysvg.appendChild(c3.myfig);
            }
            myx = x;
            myy = y;
            puntax = myx + w/2;
            puntay = myy + h/2;
            myf.setAttributeNS(null, "points", myx.toString() + "," + myy.toString() + " " + (myx + w).toString() + "," + myy.toString() +
                " " + (myx).toString() + "," + (myy + h).toString() + " " + (myx + w).toString() + "," + (myy + h).toString());
            this.setConn();
        };
        this.setConn = function () {
            c1.updateConnection(myx + w/2 - cdim/2, myy - cdim/2);
            c2.updateConnection(myx + w/2 - cdim/2, myy + h - cdim/2);
            c3.updateConnection(puntax - cdim/2, puntay - cdim/2);
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

        this.dragTimer = function(dx, dy) {
            this.updateTimer(myx + dx, myy + dy);
        };
        this.dragObj = function(mx, my) {
            var deltax, deltay, i, l;
            deltax = (mx - myx) + offx;
            deltay = (my - myy) + offy;
            this.dragTimer(deltax, deltay);
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
            var n = this.linesIN.length;
            var i;
            for(i = 0; i<n; i++)
                this.linesIN[0].removeme();
            n = this.linesOUT.length;
            for(i = 0; i<n; i++)
                this.linesOUT[0].removeme();
        };

    }

//timer
    function click_btn112() {
        reset_btn(btnTimer.parentNode);
        btnTimer.classList.add("btn_pressed");
        var f = null;

        mysvg.onmousedown = function(e){ };

        mysvg.onmousemove = function(e) {
            if (btnTimer.classList.contains("btn_pressed")) {
                mMx = e.clientX;
                mMy = e.clientY;
                if (fixed) {
                    f = new Timer();
                }
                f.newTimer(mMx, mMy);
                drawing = true;
            }
        };

        mysvg.onmouseup = function(e) {
            if (drawing) {
                mMx = e.clientX;
                mMy = e.clientY;
                f.updateTimer(mMx, mMy);
                f.myfig.setAttributeNS(null, "style", "opacity:1");
                fixed = true;
                drawing = false;
            }
        };

        function onmouseenterbar(e) {
            if (btnTimer.classList.contains("btn_pressed")) {
                deletelastsvgel("polygon", fixed);
                fixed = true;
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    btnTimer.onclick=("click", click_btn112);
});

