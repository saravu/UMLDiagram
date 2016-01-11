/**
 * Created by Sara on 18/12/2015.
 */
//action
window.addEventListener("load", function(e){

    var mybtn = document.getElementById("btn12");
    var mysvg = document.getElementById("mysvg");
    var mDx, mDy, mMx, mMy = 0;
    var idA = 0;
    var fixed = true;
    var drawing = false;
    var tmptext;

    function Rect() {
        var _this = this;
        var myrect = null;
        var mytext = null;
        var myx, myy, tx, ty;
        var offx, offy;
        var w = 80;
        var h = 50;

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
                myrect.setAttributeNS(null, "width", w.toString());
                myrect.setAttributeNS(null, "height", h.toString());
                mysvg.appendChild(myrect);
                this.myfig = myrect;
            }
            myx = x;
            myy = y;
            myrect.setAttributeNS(null, "x", x.toString());
            myrect.setAttributeNS(null, "y", y.toString());

            myrect.onmousedown = function(e) {
                select(e, _this);
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

        this.updateRect = function(x1, y1) {
            myx = x1;
            myy = y1;
            myrect.setAttributeNS(null, "x", x1.toString());
            myrect.setAttributeNS(null, "y", y1.toString());
            fixed = true;
            myrect.setAttributeNS(null, "style", "stroke-width:2;opacity:1");
        };

        this.addText = function() {
            mytext = document.createElementNS(svgNS, "text");
            idA++;
            mytext.textContent = "Action " + idA;
            //centrare il testo
            //var w = mytext.getComputedStyle().        TODO
            tx = myx + 8;
            ty = myy + 30;
            mytext.setAttributeNS(null, "x", tx.toString());
            mytext.setAttributeNS(null, "y", ty.toString());
            mytext.setAttributeNS(null, "style", "font-family:arial; font-size:18");
            mytext.setAttributeNS(null, "fill", standardcolor);

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
                setProp(true, false, false, function(t, i, o) {
                    mytext.textContent = t;
                });
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
            tx = myx + 8;
            ty = myy + 30;
            mytext.setAttributeNS(null, "x", tx.toString());
            mytext.setAttributeNS(null, "y", ty.toString());
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
                rect.updateRect(mMx, mMy);
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

