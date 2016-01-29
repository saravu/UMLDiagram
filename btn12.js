/**
 * Created by Sara on 18/12/2015.
 */
//action
window.addEventListener("load", function(e){

    var mybtn = document.getElementById("btn12");
    var mysvg = document.getElementById("mysvg");
    var mMx, mMy = 0;
    //var idA = 0;
    var fixed = true;
    var drawing = false;

    function Rect() {
        var _this = this;
        var myrect = null;
        var mytext = null;
        var mytextlenght = 0;
        var myx, myy, tx, ty = 0;
        var offx, offy = 0;
        var myw = stdw;
        var myh = stdh;

        this.myfig = null;  //metter a tutti lo stesso nome
        this.mytext = null;
        this.mytype = "rect";
        this.linesIN = new Array();
        this.linesOUT = new Array();
        var r1, r2, r3, r4 = null;
        this.myRes = new Array();

        this.newRect = function(x, y) {
            if (fixed) {
                myrect = document.createElementNS(svgNS, "rect");
                fixed = false;
                myrect.setAttributeNS(null, "stroke", standardcolor);
                myrect.setAttributeNS(null, "fill", "white");
                myrect.setAttributeNS(null, "style", "stroke-width:2;opacity:0.3");
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
                offx = myx - e.clientX;
                offy = myy - e.clientY;
                correlate(e, _this);
            };
            myrect.onmouseup = function(e) {
                drag = false;
                correlate(e, _this);
            };
            myrect.ondblclick = function(e) {
                setProp(true, false, false, function(t, i, o) {
                                                mytext.textContent = t;
                                               // mytextlenght = mytext.getComputedStyle.length;    //TODO text lenght?
                                             });
                //console.log("lunghezzaaaaaa " + mytextlenght);
            };
        };
        this.updateRect = function(x, y, w, h) {
            if (!fixed) {
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
                myrect.setAttributeNS(null, "style", "stroke-width:2;opacity:1");
            }

            if (w >= stdw) {
                myx = x;
                myw = w;
                myrect.setAttributeNS(null, "x", myx.toString());
                myrect.setAttributeNS(null, "width", myw.toString());
            }
            if (h >= stdh) {
                myy = y;
                myh = h;
                myrect.setAttributeNS(null, "y", myy.toString());
                myrect.setAttributeNS(null, "height", myh.toString());
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
            //var w = mytext.getComputedStyle().        TODO centrare il testo?
            this.setText();
            mytext.setAttributeNS(null, "style", "font-family:" + ffam +"; font-size:" + fsz);
            mytext.setAttributeNS(null, "fill", standardcolor);
            this.mytext = mytext;
            mysvg.appendChild(mytext);

            mytext.onmousedown = function(e) {
                select(e, _this);
                seeResize();
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
                setProp(true, false, false, function(t, i, o) {
                    mytext.textContent = t;
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
            this.setRes();
            this.setText();
            //TODO aggiornare anche l'attacco delle linee agli obj
            var l;
            for (i = 0; i<this.linesIN.length; i++) {
                l = this.linesIN[i];
                if (l.endX != myx && l.endX != myx + myw)
                    lx = l.endX + deltaw;
                if (l.endY < myy || l.endY > myy + myh)
                    ly = l.endY + deltah;
                l.setPosition(l.initX, l.initY, lx, ly);
            }
            for (i = 0; i<this.linesOUT.length; i++) {
                l = this.linesOUT[i];
                l.setPosition(l.initX, l.initY, l.endX+ deltaw, l.endY+ deltah);
            }
        };

        this.addLineIN = function(l) {        //aggiungo un oggetto Line
            this.linesIN.push(l);
        };
        this.addLineOut = function (l) {
            this.linesOUT.push(l);
        };
        this.removeLine = function (l) {        //quando cancello la linea, devo rimuoverla dall'array
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
            myrect.setAttributeNS(null, "stroke", c);
            if (mytext!=null) mytext.setAttributeNS(null, "fill", c);
        };
        this.dragRect = function(x, y) {
            myx = x;
            myy = y;
            myrect.setAttributeNS(null, "x", x.toString());
            myrect.setAttributeNS(null, "y", y.toString());
            this.setRes();
            this.setText();
        };
        this.dragObj = function(mx, my) {
            var deltax, deltay, i, l;
            deltax = (mx - myx) + offx;
            deltay = (my - myy) + offy;
            this.dragRect(myx + deltax, myy + deltay);
            for (i = 0; i<this.linesIN.length; i++) {
                l = this.linesIN[i];
                l.setPosition(l.initX + deltax, l.initY + deltay, l.endX, l.endY);
            }
            for (i = 0; i<this.linesOUT.length; i++) {
                l = this.linesOUT[i];
                l.setPosition(l.initX, l.initY, l.endX+ deltax, l.endY+ deltay);
            }
        };

        this.removeme = function() {
            if (myrect != null)  {
                var i;
                myrect.parentNode.removeChild(myrect);
                if (mytext != null) mytext.parentNode.removeChild(mytext);
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

        mysvg.onmousedown = function(e) {
            /*if (mybtn.classList.contains("btn_pressed")) {
                mDx = e.clientX;
                mDy = e.clientY;
                newRect(mDx, mDy);
                drawing = true;
            }*/
        };

        mysvg.onmousemove = function(e) {
            /*if (drawing) {
                mMx = e.clientX;
                mMy = e.clientY;
                updateRect(mDx, mDy, mMx, mMy);
            }*/
            if (mybtn.classList.contains("btn_pressed")) {
                mMx = e.clientX;
                mMy = e.clientY;
                if (fixed) {
                    rect = new Rect();
                }
                rect.newRect(mMx, mMy);
                drawing = true;
            }
        };

        mysvg.onmouseup = function(e) {
            if (drawing) {
                mMx = e.clientX;
                mMy = e.clientY;
                rect.updateRect(mMx, mMy, stdw, stdh);
                rect.addText();
                drawing = false;
            }
        };

        function onmouseenterbar() {
            if (mybtn.classList.contains("btn_pressed")) {
                deletelastsvgel("rect", fixed);
                //if (rect != null) rect.removeme();
                fixed = true;
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    mybtn.onclick=("click", click_btn12);

});