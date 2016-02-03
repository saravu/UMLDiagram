/**
 * Created by Sara on 18/12/2015.
 */

//initial node
//final flow
//final node
window.addEventListener("load", function(e){

    var btninnode = document.getElementById("btn13");
    var btnfinnode = document.getElementById("btn14");
    var btnfinflow = document.getElementById("btn19");
    var mDx, mDy, mMx, mMy = 0;
    var fixed = true;
    var pt = null;

    function InitialNode() {
        var _this = this;
        var mycircle = null
        var myx, myy, tx, ty;
        var r = 10;
        var offx, offy;
        var c1, c2, c3, c4 = null;
        this.myfig = null;
        this.mytext = null;
        this.linesIN = new Array();
        this.linesOUT = new Array();
        this.myRes = null;

        this.mytype = "initial";

        this.newCircle = function(x, y) {
            if (fixed) {
                mycircle = document.createElementNS(svgNS, "circle");
                fixed = false;
                mycircle.setAttributeNS(null, "fill", "blue");
                mycircle.setAttributeNS(null, "style", "stroke-width:2;opacity:0.3");
                mycircle.setAttributeNS(null, "r", r.toString());
                mysvg.appendChild(mycircle);
                this.myfig = mycircle;
                this.setColor(standardcolor);
            }
            this.setPoint(x, y);

            mycircle.onmousedown = function(e) {
                select(e, _this);
                pt = transformPoint(e.clientX, e.clientY);
                offx = myx - pt.x;
                offy = myy - pt.y;
                //correlate(e, _this);
            };
            mycircle.onmouseup = function(e) {
                drag = false;
                //correlate(e, _this);
            };
        };
        this.updateCircle = function(x1, y1) {
            this.setPoint(x1, y1);
            c1 = new Connection(_this);
            mysvg.appendChild(c1.myfig);
            c2 = new Connection(_this);
            mysvg.appendChild(c2.myfig);
            c3 = new Connection(_this);
            mysvg.appendChild(c3.myfig);
            c4 = new Connection(_this);
            mysvg.appendChild(c4.myfig);
            this.setConn();
            fixed = true;
            mycircle.setAttributeNS(null, "style", "stroke-width:2;opacity:1");
        };

        this.setPoint = function(x, y) {
            myx = x;
            myy = y;
            mycircle.setAttributeNS(null, "cx", x.toString());
            mycircle.setAttributeNS(null, "cy", y.toString());
        };
        this.setConn = function () {
            c1.updateConnection(myx - cdim/2, myy - r - cdim/2);
            c2.updateConnection(myx + r - cdim/2, myy - cdim/2);
            c3.updateConnection(myx - cdim/2, myy + r - cdim/2);
            c4.updateConnection(myx - r - cdim/2, myy - cdim/2);
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
            mycircle.setAttributeNS(null, "stroke", c);
        };

        this.dragNode = function(x, y) {
            this.setPoint(x, y);
            this.setConn();
        };

        this.dragObj = function(mx, my) {
            var deltax, deltay, i, l;
            deltax = (mx - myx) + offx;
            deltay = (my - myy) + offy;
            this.dragNode(myx + deltax, myy + deltay);
            for (i = 0; i<this.linesIN.length; i++) {
                l = this.linesIN[i];
                l.setPosition(l.initX + deltax, l.initY + deltay, l.endX, l.endY);
            }
            for (i = 0; i<this.linesOUT.length; i++) {
                l = this.linesOUT[i];
                l.setPosition(l.initX, l.initY, l.endX+ deltax, l.endY+ deltay);
            }
        };

        this.toFront = function() {
            if (this.myfig!=null) {
                mysvg.removeChild(this.myfig);
                mysvg.appendChild(this.myfig);
            }
            if (c1 != null) {
                mysvg.removeChild(c1.myfig);
                mysvg.appendChild(c1.myfig);
                mysvg.removeChild(c2.myfig);
                mysvg.appendChild(c2.myfig);
                mysvg.removeChild(c3.myfig);
                mysvg.appendChild(c3.myfig);
                mysvg.removeChild(c4.myfig);
                mysvg.appendChild(c4.myfig);
            }
        };

        this.removeme = function() {
            mycircle.parentNode.removeChild(mycircle);
            c1.removeme();
            c2.removeme();
            c3.removeme();
            c4.removeme();
            var n = this.linesIN.length;
            for(var i = 0; i<n; i++)
                this.linesIN[0].removeme();
            n = this.linesOUT.length;
            for(var i = 0; i<n; i++)
                this.linesOUT[0].removeme()
        };

    }

    function click_btn13() {
        reset_btn(document.getElementById("all"));
        reset_btn(btninnode.parentNode);
        btninnode.classList.add("btn_pressed");
        var circle = null;
        setCursorByID("mysvg", "none");

        mysvg.onmousedown = function(e) {};

        mysvg.onmousemove = function(e) {
            pt = transformPoint(e.clientX, e.clientY);
            mMx = pt.x;
            mMy = pt.y;
            if (fixed) {
                circle = new InitialNode();
            }
            circle.newCircle(mMx, mMy);
        };

        mysvg.onmouseup = function(e) {
            //if (drawing) {
            pt = transformPoint(e.clientX, e.clientY);
            mMx = pt.x;
            mMy = pt.y;
            circle.updateCircle(mMx, mMy);
            //}
        };

        function onmouseenterbar() {
            if (btninnode.classList.contains("btn_pressed")) {
                deletelastsvgel("circle", fixed);
                fixed = true;
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }
    btninnode.onclick=(click_btn13);


    function FinalNode() {
        var _this = this;
        var myest = null;
        var myint = null;
        var myx, myy;
        var c1, c2, c3, c4 = null;
        var offx, offy;
        var re = 10;
        var ri = 5;

        this.mypath = null;
        this.myfig = null;
        this.mytext = null;
        this.linesIN = new Array();
        this.linesOUT = new Array();

        this.mytype = "finnode";

        this.newCircle = function (x, y) {
            if (fixed) {
                myest = document.createElementNS(svgNS, "circle");
                myint = document.createElementNS(svgNS, "circle");
                fixed = false;
                //template Action
                myest.setAttributeNS(null, "stroke", standardcolor);
                myest.setAttributeNS(null, "fill", "white");
                myest.setAttributeNS(null, "style", "stroke-width:2;opacity:0.3");
                myest.setAttributeNS(null, "r", re.toString());
                mysvg.appendChild(myest);
                this.myfig = myest;
                myint.setAttributeNS(null, "stroke", standardcolor);
                myint.setAttributeNS(null, "fill", "blue");
                myint.setAttributeNS(null, "style", "opacity:0.3");
                myint.setAttributeNS(null, "r", ri.toString());
                mysvg.appendChild(myint);
                this.mypath = myint;
            }
            this.setPoint(x, y);

            myest.onmousedown = function(e) {
                select(e, _this);
                pt = transformPoint(e.clientX, e.clientY);
                offx = myx - pt.x;
                offy = myy - pt.y;
                //correlate(e, _this);
            };
            myest.onmouseup = function(e) {
                drag = false;
                //correlate(e, _this);
            };
            myint.onmousedown = function(e) {
                select(e, _this);
                pt = transformPoint(e.clientX, e.clientY);
                offx = myx - pt.x;
                offy = myy - pt.y;
                //correlate(e, _this);
            };
            myint.onmouseup = function(e) {
                drag = false;
                //correlate(e, _this);
            };
        };
        this.updateCircle = function(x1, y1) {
            this.setPoint(x1, y1);
            c1 = new Connection(_this);
            mysvg.appendChild(c1.myfig);
            c2 = new Connection(_this);
            mysvg.appendChild(c2.myfig);
            c3 = new Connection(_this);
            mysvg.appendChild(c3.myfig);
            c4 = new Connection(_this);
            mysvg.appendChild(c4.myfig);
            this.setConn();
            fixed = true;
            myest.setAttributeNS(null, "style", "stroke-width:2;opacity:1");
            myint.setAttributeNS(null, "style", "stroke-width:2;opacity:1");
        };
        this.setPoint = function(x, y) {
            myx = x;
            myy = y;
            myest.setAttributeNS(null, "cx", x.toString());
            myest.setAttributeNS(null, "cy", y.toString());
            myint.setAttributeNS(null, "cx", x.toString());
            myint.setAttributeNS(null, "cy", y.toString());

        };
        this.setConn = function() {
            c1.updateConnection(myx - cdim/2, myy - re - cdim/2);
            c2.updateConnection(myx + re - cdim/2, myy - cdim/2);
            c3.updateConnection(myx - cdim/2, myy + re - cdim/2);
            c4.updateConnection(myx - re - cdim/2, myy - cdim/2);
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
            myest.setAttributeNS(null, "stroke", c);
        };

        this.dragNode = function(x, y) {
            this.setPoint(x, y);
            this.setConn();
        };

        this.dragObj = function(mx, my) {
            var deltax, deltay, i, l;
            deltax = (mx - myx) + offx;
            deltay = (my - myy) + offy;
            this.dragNode(myx + deltax, myy + deltay);
            for (i = 0; i<this.linesIN.length; i++) {
                l = this.linesIN[i];
                l.setPosition(l.initX + deltax, l.initY + deltay, l.endX, l.endY);
            }
            for (i = 0; i<this.linesOUT.length; i++) {
                l = this.linesOUT[i];
                l.setPosition(l.initX, l.initY, l.endX+ deltax, l.endY+ deltay);
            }
        };

        this.toFront = function() {
            if (myest!=null) {
                mysvg.removeChild(myest);
                mysvg.appendChild(myest);
            }
            if (myint!=null) {
                mysvg.removeChild(myint);
                mysvg.appendChild(myint);
            }
            if (c1 != null) {
                mysvg.removeChild(c1.myfig);
                mysvg.appendChild(c1.myfig);
                mysvg.removeChild(c2.myfig);
                mysvg.appendChild(c2.myfig);
                mysvg.removeChild(c3.myfig);
                mysvg.appendChild(c3.myfig);
                mysvg.removeChild(c4.myfig);
                mysvg.appendChild(c4.myfig);
            }
        };

        this.removeme = function() {
            myest.parentNode.removeChild(myest);
            myint.parentNode.removeChild(myint);
            c1.removeme();
            c2.removeme();
            c3.removeme();
            c4.removeme();
            var n = this.linesIN.length;
            for(var i = 0; i<n; i++)
                this.linesIN[0].removeme();
            n = this.linesOUT.length;
            for(var i = 0; i<n; i++)
                this.linesOUT[0].removeme()
        };

    }

    function click_btn14() {
        reset_btn(document.getElementById("all"));
        reset_btn(btnfinnode.parentNode);
        btnfinnode.classList.add("btn_pressed");
        var c = null;
        setCursorByID("mysvg", "none");

        mysvg.onmousedown = function(e) {};

        mysvg.onmousemove = function(e) {
            pt = transformPoint(e.clientX, e.clientY);
            mMx = pt.x;
            mMy = pt.y;
            if (fixed) {
                c = new FinalNode();
            }
            c.newCircle(mMx, mMy);
        };

        mysvg.onmouseup = function(e) {
            //if (drawing) {
            pt = transformPoint(e.clientX, e.clientY);
            mMx = pt.x;
            mMy = pt.y;
            c.updateCircle(mMx, mMy);
            //}
        };

        function onmouseenterbar() {
            if (btnfinnode.classList.contains("btn_pressed")) {
                deletelastsvgel("circle", fixed);
                //per il cerchio interno
                deletelastsvgel("circle", fixed);
                fixed = true;
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }
    btnfinnode.onclick=(click_btn14);


    function FinalFlow() {
        var _this = this;
        var myc = null;
        var p1, p2, p3, p4 = null;
        var myx, myy;
        var c1, c2, c3, c4 = null;
        var offx, offy;
        var r = 10;
        var linx1, linx2, linx3, linx4 = null;

        this.mypath = null;
        this.myfig = null;
        this.mytext = null;
        this.linesIN = new Array();
        this.linesOUT = new Array();

        this.mytype = "finflow";

        this.newCircle = function (x, y) {
            if (fixed) {
                myc = document.createElementNS(svgNS, "circle");
                p1 = document.createElementNS(svgNS, "path");
                p2 = document.createElementNS(svgNS, "path");
                p3 = document.createElementNS(svgNS, "path");
                p4 = document.createElementNS(svgNS, "path");
                fixed = false;
                myc.setAttributeNS(null, "fill", "white");
                myc.setAttributeNS(null, "style", "stroke-width:2;opacity:0.3");
                myc.setAttributeNS(null, "r", r.toString());
                mysvg.appendChild(myc);
                this.myfig = myc;
                p1.setAttributeNS(null, "fill", "blue");
                p1.setAttributeNS(null, "style", "opacity:0.3");
                mysvg.appendChild(p1);
                p2.setAttributeNS(null, "fill", "blue");
                p2.setAttributeNS(null, "style", "opacity:0.3");
                mysvg.appendChild(p2);
                p3.setAttributeNS(null, "fill", "blue");
                p3.setAttributeNS(null, "style", "opacity:0.3");
                mysvg.appendChild(p3);
                p4.setAttributeNS(null, "fill", "blue");
                p4.setAttributeNS(null, "style", "opacity:0.3");
                mysvg.appendChild(p4);

                this.setColor(standardcolor);
            }
            this.setPoint(x, y);

            myc.onmousedown = function(e) {
                select(e, _this);
                pt = transformPoint(e.clientX, e.clientY);
                offx = myx - pt.x;
                offy = myy - pt.y;
                //correlate(e, _this);
            };
            myc.onmouseup = function(e) {
                drag = false;
                //correlate(e, _this);
            };
        };
        this.updateCircle = function(x1, y1) {
            this.setPoint(x1, y1);
            fixed = true;
            myc.setAttributeNS(null, "style", "stroke-width:2;opacity:1");
            p1.setAttributeNS(null, "style", "stroke-width:2;opacity:1");
            p2.setAttributeNS(null, "style", "stroke-width:2;opacity:1");
            p3.setAttributeNS(null, "style", "stroke-width:2;opacity:1");
            p4.setAttributeNS(null, "style", "stroke-width:2;opacity:1");
            c1 = new Connection(_this);
            mysvg.appendChild(c1.myfig);
            c2 = new Connection(_this);
            mysvg.appendChild(c2.myfig);
            c3 = new Connection(_this);
            mysvg.appendChild(c3.myfig);
            c4 = new Connection(_this);
            mysvg.appendChild(c4.myfig);
            this.setConn();
        };

        this.setPoint = function(x, y) {
            myx = x;
            myy = y;
            myc.setAttributeNS(null, "cx", myx.toString());
            myc.setAttributeNS(null, "cy", myy.toString());
            linx1 = "M " + myx + "," + y + " L " + (myx - r*Math.cos(45)) + "," + (myy - r*Math.sin(45));
            p1.setAttributeNS(null, "d", linx1);
            linx2 = "M " + myx + "," + y + " L " + (myx + r*Math.cos(45)) + "," + (myy + r*Math.sin(45));
            p2.setAttributeNS(null, "d", linx2);
            linx3 = "M " + myx + "," + y + " L " + (myx - r*Math.cos(45)) + "," + (myy + r*Math.sin(45));
            p3.setAttributeNS(null, "d", linx3);
            linx4 = "M " + myx + "," + y + " L " + (myx + r*Math.cos(45)) + "," + (myy - r*Math.sin(45));
            p4.setAttributeNS(null, "d", linx4);
        };
        this.setConn = function() {
            c1.updateConnection(myx - cdim/2, myy - r - cdim/2);
            c2.updateConnection(myx + r - cdim/2, myy - cdim/2);
            c3.updateConnection(myx - cdim/2, myy + r - cdim/2);
            c4.updateConnection(myx - r - cdim/2, myy - cdim/2);
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
            myc.setAttributeNS(null, "stroke", c);
            p1.setAttributeNS(null, "stroke", c);
            p2.setAttributeNS(null, "stroke", c);
            p3.setAttributeNS(null, "stroke", c);
            p4.setAttributeNS(null, "stroke", c);
        };
        this.dragNode = function(x, y) {
            this.setPoint(x, y);
            this.setConn();
        };
        this.dragObj = function(mx, my) {
            var deltax, deltay, i, l;
            deltax = (mx - myx) + offx;
            deltay = (my - myy) + offy;
            this.dragNode(myx + deltax, myy + deltay);
            for (i = 0; i<this.linesIN.length; i++) {
                l = this.linesIN[i];
                l.setPosition(l.initX + deltax, l.initY + deltay, l.endX, l.endY);
            }
            for (i = 0; i<this.linesOUT.length; i++) {
                l = this.linesOUT[i];
                l.setPosition(l.initX, l.initY, l.endX+ deltax, l.endY+ deltay);
            }
        };

        this.toFront = function() {
            if (this.myfig!=null) {
                mysvg.removeChild(this.myfig);
                mysvg.appendChild(this.myfig);
                mysvg.removeChild(p1);
                mysvg.appendChild(p1);
                mysvg.removeChild(p2);
                mysvg.appendChild(p2);
                mysvg.removeChild(p3);
                mysvg.appendChild(p3);
                mysvg.removeChild(p4);
                mysvg.appendChild(p4);
            }
            if (c1 != null) {
                mysvg.removeChild(c1.myfig);
                mysvg.appendChild(c1.myfig);
                mysvg.removeChild(c2.myfig);
                mysvg.appendChild(c2.myfig);
                mysvg.removeChild(c3.myfig);
                mysvg.appendChild(c3.myfig);
                mysvg.removeChild(c4.myfig);
                mysvg.appendChild(c4.myfig);
            }
        };

        this.removeme = function() {
            myc.parentNode.removeChild(myc);
            p1.parentNode.removeChild(p1);
            p2.parentNode.removeChild(p2);
            p3.parentNode.removeChild(p3);
            p4.parentNode.removeChild(p4);
            c1.removeme();
            c2.removeme();
            c3.removeme();
            c4.removeme();
            var n = this.linesIN.length;
            for(var i = 0; i<n; i++)
                this.linesIN[0].removeme();
            n = this.linesOUT.length;
            for(var i = 0; i<n; i++)
                this.linesOUT[0].removeme()
        };

    }

    function click_btn19() {
        reset_btn(document.getElementById("all"));
        reset_btn(btnfinflow.parentNode);
        btnfinflow.classList.add("btn_pressed");
        var finflow = null;
        setCursorByID("mysvg", "none");

        mysvg.onmousedown = function(e) {};

        mysvg.onmousemove = function(e) {
            pt = transformPoint(e.clientX, e.clientY);
            mMx = pt.x;
            mMy = pt.y;
            if (fixed) {
                finflow = new FinalFlow();
            }
            finflow.newCircle(mMx, mMy);
        };

        mysvg.onmouseup = function(e) {
            //if (drawing) {
            pt = transformPoint(e.clientX, e.clientY);
            mMx = pt.x;
            mMy = pt.y;
            finflow.updateCircle(mMx, mMy);
            //}
        };

        function onmouseenterbar() {
            if (btnfinflow.classList.contains("btn_pressed")) {
                //finflow.removeme();
                deletelastsvgel("circle", fixed);
                //per il cerchio interno
                deletelastsvgel("path", fixed);
                deletelastsvgel("path", fixed);
                deletelastsvgel("path", fixed);
                deletelastsvgel("path", fixed);
                fixed = true;
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }
    btnfinflow.onclick=(click_btn19);

});

