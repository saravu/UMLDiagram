/**
 * Created by Sara on 18/12/2015.
 */
//action
window.addEventListener("load", function(e){

    var mybtn = document.getElementById("btn12");
    var mysvg = document.getElementById("mysvg");
    var mMx, mMy = 0;
    var idA = 0;
    var fixed = true;
    var drawing = false;

    function Rect() {
        var _this = this;
        var myrect = null;
        var mytext = null;
        var myx, myy, tx, ty = 0;
        var offx, offy = 0;
        var myw = stdw;
        var myh = stdh;
        var r1, r2, r3, r4 = null;

        this.myfig = null;  //metter a tutti lo stesso nome
        this.mytext = null;
        this.mytype = "rect";
        this.linesIN = new Array();
        this.linesOUT = new Array();

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
                _this.seeResize();
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
                                             });
            };
        };
        this.updateRect = function(x, y, w, h) {
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
            if (!fixed) {
                r1 = new Resize(this, 1);
                mysvg.appendChild(r1.myfig);
                r2 = new Resize(this, 2);
                mysvg.appendChild(r2.myfig);
                r3 = new Resize(this, 3);
                mysvg.appendChild(r3.myfig);
                r4 = new Resize(this, 4);
                mysvg.appendChild(r4.myfig);

                fixed = true;
                myrect.setAttributeNS(null, "style", "stroke-width:2;opacity:1");
            }
        };

        this.setText = function() {
            tx = myx + myw/6;
            ty = myy + myh/2;
            mytext.setAttributeNS(null, "x", tx.toString());
            mytext.setAttributeNS(null, "y", ty.toString());
        };
        this.addText = function() {
            mytext = document.createElementNS(svgNS, "text");
            idA++;
            mytext.textContent = "Action " + idA;
            //centrare il testo
            //var w = mytext.getComputedStyle().        TODO
            this.setText();
            mytext.setAttributeNS(null, "style", "font-family:arial; font-size:18");
            mytext.setAttributeNS(null, "fill", standardcolor);
            this.mytext = mytext;
            mysvg.appendChild(mytext);

            mytext.onmousedown = function(e) {
                select(e, _this);
                _this.seeResize();
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

        this.seeResize = function() {
            if (!drawline) {
                r1.visible(true);
                r2.visible(true);
                r3.visible(true);
                r4.visible(true);
                this.setRes();
            }
        };
        this.hideResize = function() {
            r1.visible(false);
            r2.visible(false);
            r3.visible(false);
            r4.visible(false);
        };
        this.setRes = function () {
            r1.updateResize(myx - cdim/2, myy - cdim/2);
            r2.updateResize(myx + myw - cdim/2, myy - cdim/2);
            r4.updateResize(myx - cdim/2, myy + myh - cdim/2);
            r3.updateResize(myx + myw - cdim/2, myy + myh - cdim/2);
        };
        this.removeRes = function () {
            if (r1 != null) r1.removeme();
            if (r2 != null) r2.removeme();
            if (r3 != null) r3.removeme();
            if (r4 != null) r4.removeme();
        };
        this.resizeObj = function(mx, my) { //TODO
            switch (numresize) {
                case 1: {
                    this.updateRect(mx, my, myw+(myx-mx), myh+(myy-my));
                    break;
                }
                case 2: {
                    this.updateRect(myx, my, mx-myx, myh+(myy-my));
                    break;
                }
                case 3: {
                    this.updateRect(myx, myy, mx-myx, my-myy);
                    break;
                }
                case 4: {
                    this.updateRect(mx, myy, myw+(myx-mx), my-myy);
                    break;
                }
            }
            this.setRes();
            this.setText();
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
                myrect.parentNode.removeChild(myrect);
                idA--;
                if (mytext != null) mytext.parentNode.removeChild(mytext);
                var n = this.linesIN.length;
                for(var i = 0; i<n; i++)
                    this.linesIN[0].removeme();
                n = this.linesOUT.length;
                for(var i = 0; i<n; i++)
                    this.linesOUT[0].removeme();
                this.removeRes();
            }
        };

    }


    function click_btn12() {
        reset_btn(mybtn.parentNode);
        mybtn.classList.add("btn_pressed");
        var rect = null;

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

      /*  mysvg.onmouseout = function(e) {
            console.log("uscito da svg?");
            onmouseleavesvg(e);
        };
        function onmouseleavesvg(e) {
            var contv = parseInt(document.getElementById("container_vert").style.width.replace("px", ""));
            var conto = parseInt(document.getElementById("container_orizz").style.height.replace("px", ""));
            if (e.clientX < contv || e.clientY < conto) {
                console.log("uscito davverooooo");
                var rects = document.getElementsByTagName("rect");
                if (rects.length > 0 && !fixed ) {
                    var last_r = rects[rects.length - 1];
                    last_r.parentNode.removeChild(last_r);
                }
                fixed = true;
            }
        };
    */
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

