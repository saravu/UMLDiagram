/**
 * Created by Sara on 18/12/2015.
 */
//action
window.addEventListener("load", function(e){

    var mybtn = document.getElementById("btn12");
    var mMx, mMy = 0;
    var fixed = true;
    var drawing = false;
    var pt = null;

    function Rect() {
        var _this = this;
        var myrect = null;
        var mytext = null;
        var mytextlenght = 0;
        var myx, myy, tx, ty = 0;
        var offx, offy = 0;
        var myw = stdw;
        var myh = stdh;
        var c1, c2, c3, c4 = null;
        this.myfig = null;
        this.mytext = null;
        this.mytype = "rect";
        this.linesIN = new Array();
        this.numconnIn = new Array();
        this.linesOUT = new Array();
        this.numconnOut = new Array();
        var r1, r2, r3, r4 = null;
        this.myRes = new Array();

        this.newRect = function(x, y) {
            if (fixed) {
                myrect = document.createElementNS(svgNS, "rect");
                fixed = false;
                myrect.setAttributeNS(null, "stroke", standardcolor);
                myrect.setAttributeNS(null, "fill", "white");
                myrect.setAttributeNS(null, "style", "stroke-width:2; opacity:0.3");
                myrect.setAttributeNS(null, "rx", "10");
                myrect.setAttributeNS(null, "ry", "10");

                mysvg.appendChild(myrect);
                this.myfig = myrect;
            }
            myx = x;
            myy = y;
            myrect.setAttributeNS(null, "width", myw.toString());
            myrect.setAttributeNS(null, "height", myh.toString());
            myrect.setAttributeNS(null, "x", x.toString());
            myrect.setAttributeNS(null, "y", y.toString());

            myrect.onmousedown = function(e) {
                select(e, _this);
                seeResize();
                pt = transformPoint(e.clientX, e.clientY);
                offx = myx - pt.x;
                offy = myy - pt.y;
                //correlate(e, _this);
            };
            myrect.onmouseup = function(e) {
                drag = false;
                //correlate(e, _this);
            };
            myrect.ondblclick = function(e) {
                setProp(true, false, false, function(t, i, o) {
                        mytext.textContent = t;
                        mytextlenght = mytext.textContent.length;
                        _this.updateRect(myx, myy, mytextlenght*9, myh);
                                             });
            };
        };
        this.updateRect = function(x, y, w, h) {
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

                fixed = true;
                myrect.setAttributeNS(null, "style", "stroke-width:2; opacity:1");
            }

            var minw = Math.max(w, stdw, mytextlenght*9);
            myx = x;
            myw = minw;
            myrect.setAttributeNS(null, "x", myx.toString());
            myrect.setAttributeNS(null, "width", myw.toString());
            if (h >= stdh) {
                myy = y;
                myh = h;
                myrect.setAttributeNS(null, "y", myy.toString());
                myrect.setAttributeNS(null, "height", myh.toString());
            }

            this.setConn();
            this.setRes();
        };
        this.setConn = function () {
            c1.updateConnection(myx + myw/2 - cdim/2, myy - cdim/2);
            c2.updateConnection(myx + myw/2 - cdim/2, myy + myh - cdim/2);
            c3.updateConnection(myx - cdim/2, myy + myh/2 - cdim/2);
            c4.updateConnection(myx + myw - cdim/2, myy + myh/2 - cdim/2);
            //associare connettori e linee: posizionale su due array
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
            tx = myx + 5;
            ty = myy + myh/2;
            mytext.setAttributeNS(null, "x", tx.toString());
            mytext.setAttributeNS(null, "y", ty.toString());
        };
        this.addText = function() {
            mytext = document.createElementNS(svgNS, "text");
            mytext.textContent = "Action ";
            mytextlenght = mytext.textContent.length;
            this.setText();
            mytext.setAttributeNS(null, "style", "font-family:" + ffam +"; font-size:" + fsz);
            mytext.setAttributeNS(null, "fill", standardcolor);
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
                setProp(true, false, false, function(t, i, o) {
                    mytext.textContent = t;
                    mytextlenght = mytext.textContent.length;
                    _this.updateRect(myx, myy, mytextlenght*9, myh);
                });
            }
        };

        this.setRes = function () {
            r1.updateResize(myx - cdim/2, myy - cdim/2);
            r2.updateResize(myx + myw - cdim/2, myy - cdim/2);
            r3.updateResize(myx + myw - cdim/2, myy + myh - cdim/2);
            r4.updateResize(myx - cdim/2, myy + myh - cdim/2);
        };
        this.resizeObj = function(mx, my) {
            var i, lx, ly = 0;
            var deltaw = 0;
            var deltah = 0;
            switch (numresize) {
                case 1: {
                    deltaw = mx-myx;
                    deltah = my-myy;
                    this.updateRect(mx, my, myw+(myx-mx), myh+(myy-my));
                    break;
                }
                case 2: {
                    deltaw = mx - (myw + myx);
                    deltah = my-myy;
                    this.updateRect(myx, my, mx-myx, myh+(myy-my));
                    break;
                }
                case 3: {
                    deltaw = mx - (myw + myx);
                    deltah = my - (myh + myy);
                    this.updateRect(myx, myy, mx-myx, my-myy);
                    break;
                }
                case 4: {
                    deltaw = mx-myx;
                    deltah = my - (myh + myy);
                    this.updateRect(mx, myy, myw+(myx-mx), my-myy);
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
            myrect.setAttributeNS(null, "stroke", c);
            if (mytext!=null) mytext.setAttributeNS(null, "fill", c);
        };
        this.dragRect = function(x, y) {
            myx = x;
            myy = y;
            myrect.setAttributeNS(null, "x", x.toString());
            myrect.setAttributeNS(null, "y", y.toString());
            this.setConn();
            this.setRes();
            this.setText();
        };
        this.dragObj = function(mx, my) {
            var deltax, deltay, i, l;
            deltax = (mx - myx) + offx;
            deltay = (my - myy) + offy;
            this.dragRect(myx + deltax, myy + deltay);
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
            if (myrect != null)  {
                var i;
                myrect.parentNode.removeChild(myrect);
                if (mytext != null) mytext.parentNode.removeChild(mytext);
                c1.removeme();
                c2.removeme();
                c3.removeme();
                c4.removeme();
                var n = this.linesIN.length;
                for(i = 0; i<n; i++)
                    this.linesIN[0].removeme();
                n = this.linesOUT.length;
                for(i = 0; i<n; i++)
                    this.linesOUT[0].removeme();
                removeRes();
            }
        };

    }


    function click_btn12() {
        reset_btn(document.getElementById("all"));
        reset_btn(mybtn.parentNode);
        mybtn.classList.add("btn_pressed");
        var rect = null;
        setCursorByID("mysvg", "none");

        mysvg.onmousedown = function(e) { };

        mysvg.onmousemove = function(e) {
            if (mybtn.classList.contains("btn_pressed")) {
                pt = transformPoint(e.clientX, e.clientY);
                mMx = pt.x;
                mMy = pt.y;
                if (fixed) {
                    rect = new Rect();
                }
                rect.newRect(mMx, mMy);
                drawing = true;
            }
        };

        mysvg.onmouseup = function(e) {
            if (drawing) {
                pt = transformPoint(e.clientX, e.clientY);
                mMx = pt.x;
                mMy = pt.y;
                rect.updateRect(mMx, mMy, stdw, stdh);
                rect.addText();
                drawing = false;
            }
        };

        function onmouseenterbar() {
            if (mybtn.classList.contains("btn_pressed")) {
                deletelastsvgel("rect", fixed);
                fixed = true;
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    mybtn.onclick=(click_btn12);

});