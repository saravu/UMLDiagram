/**
 * Created by Sara on 11/12/2015.
 */

//fork - da uno a tanti -
//join - da tanti a uno - parallelizza
window.addEventListener("load", function(e){

    var btnFork = document.getElementById("btn15");
    var btnJoin = document.getElementById("btn16");
    var mDx, mDy, mMx, mMy = 0;
    var drawing = false;
    var pt = null;

    function ForkJoin() {
        var _this = this;
        var myf = null;
        var myin= new Array();
        var myout= new Array();
        var connOut = new Array();
        var connIn = new Array();
        var ni, no;
        var distO, distI;

        this.myfig = null;
        this.mytype = null;     // 0 = fork, 1 = join
        this.linesIN = new Array();
        this.numconnIn = new Array();
        this.linesOUT = new Array();
        this.numconnOut = new Array()
        this.mytext = null;

        var myx1, myy1, myx2, myy2 = null;
        var offx, offy;

        this.newLine = function(x1, y1, x2, y2) {
            myf = document.createElementNS(svgNS, "line");
            myf.setAttributeNS(null, "style", "stroke-width:5; opacity:0.3");
            myx1 = x1;
            myy1 = y1;
            myx2 = x2;
            myy2 = y2;
            updateLine(myf, myx1, myy1, myx2, myy2);
            mysvg.appendChild(myf);
            this.myfig = myf;
            this.setColor(standardcolor);

            myf.onmousedown = function(e) {
                select(e, _this);
                pt = transformPoint(e.clientX, e.clientY);
                offx = (myx1 - pt.x);
                offy = (myy1 - pt.y);
                //correlate(e, _this);
            };
            myf.onmouseup = function(e) {
                drag = false;
                //correlate(e, _this);
            };

            //settare nuovo numero ingressi/uscite
            myf.ondblclick = function(e) {
                drag = false;
                if (selection) {
                    switch (_this.mytype) {
                        case 0: {
                            setProp(false, false, true, function (t, i, o) {
                                _this.removeO();
                                _this.removeI();
                                no = o;
                                _this.drawIO(ni, no);
                            });
                            break;
                        }
                        case 1: {
                            setProp(false, true, false, function (t, i, o) {
                                _this.removeO();
                                _this.removeI();
                                ni = i;
                                _this.drawIO(ni, no);
                            });
                            break;
                        }
                    }
                }
            };

        };

        this.setLine = function(x1, y1, x2, y2) {
            //sempre linea retta - capire se orizz o vert
            if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {    //retta orizz - stessa y
                myx2 = x2;
                myy2 = y1;
            }
            else {  //retta vert - stessa x
                myx2 = x1;
                myy2 = y2;
            }
            myf.setAttributeNS(null, "x2", myx2.toString());
            myf.setAttributeNS(null, "y2", myy2.toString());
        };

        this.drawIO = function(i, o) {
            ni = parseInt(i);
            no = parseInt(o);
            var idx;
            var el;
            var conn;
            var lx, ly;
            if (!drag && !resize) {
                var c;
                for (c=0; c<ni; c++) {
                    myin.push(document.createElementNS(svgNS, "line"));
                    connIn.push(new Connection(_this));
                    connIn[c].setN(c);
                }
                for (c=0; c<no; c++) {
                    myout.push(document.createElementNS(svgNS, "line"));
                    connOut.push(new Connection(_this));
                    connOut[c].setN(c);
                }
            }
            //in -- out
            if (myx1 == myx2) { //verticale
                distI = (Math.abs(myy1 - myy2)) / (ni + 1);
                ly = Math.min(myy1, myy2) + distI;
                for (idx = 0; idx < myin.length; idx++) {
                    el = myin[idx];
                    updateLine(el, myx1, ly, (myx1 - 10), ly);
                    conn = connIn[idx];
                    conn.updateConnection(myx1 - 10 - cdim/2, ly - cdim/2);
                    if (!drag) {
                        mysvg.appendChild(el);
                        this.setColor(standardcolor);
                        mysvg.appendChild(connIn[idx].myfig);
                    }
                    ly = ly + distI;
                }
                distO = (Math.abs(myy1 - myy2)) / (no + 1);
                ly = Math.min(myy1, myy2) + distO;
                for (idx = 0; idx < myout.length; idx++) {
                    el = myout[idx];
                    updateLine(el, myx1, ly, (myx1 + 10), ly);
                    conn = connOut[idx];
                    conn.updateConnection(myx1 + 10 - cdim/2, ly - cdim/2);
                    if (!drag) {
                        mysvg.appendChild(el);
                        this.setColor(standardcolor);
                        mysvg.appendChild(connOut[idx].myfig);
                    }
                    ly = ly + distO;
                }
            }
            else if (myy1 == myy2) { //orizzontale
                distO = (Math.abs(myx1 - myx2)) / (no + 1);
                lx = Math.min(myx1, myx2) + distO;
                for (idx = 0; idx < myout.length; idx++) {
                    el = myout[idx];
                    updateLine(el, lx, myy1, lx, (myy1 + 10));
                    conn = connOut[idx];
                    conn.updateConnection(lx - cdim/2, myy1 + 10 - cdim/2);
                    if (!drag) {
                        mysvg.appendChild(el);
                        this.setColor(standardcolor);
                        mysvg.appendChild(connOut[idx].myfig);
                    }
                    lx = lx + distO;
                }
                distI = (Math.abs(myx1 - myx2)) / (ni + 1);
                lx = Math.min(myx1, myx2) + distI;
                for (idx = 0; idx < myin.length; idx++) {
                    el = myin[idx];
                    updateLine(el, lx, myy1, lx, (myy1 - 10));
                    conn = connIn[idx];
                    conn.updateConnection(lx - cdim/2, myy1 - 10 - cdim/2);
                    if (!drag) {
                        mysvg.appendChild(el);
                        this.setColor(standardcolor);
                        mysvg.appendChild(connIn[idx].myfig);
                    }
                    lx = lx + distI;
                }
            }

            var l;
            for (idx=0; idx<this.linesIN.length; idx++) {
                l =  this.linesIN[idx];
                if (parseInt(this.numconnIn[idx])>(no-1)) {
                    l.removeme()
                }
                else {
                    conn = connOut[parseInt(this.numconnIn[idx])];
                    l.setPosition(conn.x, conn.y, l.endX, l.endY);
                }
            }
            for (idx=0; idx<this.linesOUT.length; idx++) {
                l =  this.linesOUT[idx];
                if (parseInt(this.numconnOut[idx])>(ni-1)) {
                    l.removeme()
                }
                else {
                    conn = connIn[parseInt(this.numconnOut[idx])];
                    l.setPosition(l.initX, l.initY, conn.x, conn.y);
                }
            }
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
            var idx;
            myf.setAttributeNS(null, "stroke", c);
            for(idx=0; idx<myout.length; idx++) {
                myout[idx].setAttributeNS(null, "stroke", c);
            }
            for(idx=0; idx<myin.length; idx++) {
                myin[idx].setAttributeNS(null, "stroke", c);
            }
        };

        this.dragFJ= function(dx, dy) {
            myx1 = myx1 + dx;
            myy1 = myy1 + dy;
            myx2 = myx2 + dx;
            myy2 = myy2 + dy ;
            updateLine(myf, myx1, myy1, myx2, myy2);
            this.drawIO(ni, no);
        };
        this.dragObj = function(mx, my) {
            var deltax, deltay, i, l;
            deltax = (mx - myx1) + offx;
            deltay = (my - myy1) + offy;
            this.dragFJ(deltax, deltay);
        };

        this.toFront = function() {
            if (this.myfig!=null) {
                mysvg.removeChild(this.myfig);
                mysvg.appendChild(this.myfig);
            }
            var i, l;
            var n = myin.length;
            for (i=0; i<n; i++) {
                l = myin[i];
                mysvg.removeChild(l);
                mysvg.appendChild(l);
            }
            n = myout.length;
            for (i=0; i<n; i++) {
                l = myout[i];
                mysvg.removeChild(l);
                mysvg.appendChild(l);
            }

            if (elementsel == this) {
                n = this.linesIN.length;
                for (i = 0; i < n; i++)
                    this.linesIN[0].toFront();
                n = this.linesOUT.length;
                for (i = 0; i < n; i++)
                    this.linesOUT[0].toFront();
            }
        };

        this.removeI = function() {
            var el;
            for(var idx=0; idx<myin.length; idx++) {
                el = myin[idx];
                el.parentNode.removeChild(el);
                connIn[idx].removeme();
            }
            myin = new Array();
            connIn = new Array();
        };
        this.removeO = function() {
            var el;
            for(var idx=0; idx<myout.length; idx++) {
                el = myout[idx];
                el.parentNode.removeChild(el);
                connOut[idx].removeme();
            }
            myout = new Array();
            connOut = new Array();
        };
        this.removeme = function() {
            myf.parentNode.removeChild(myf);
            this.removeI();
            this.removeO();
            var n = this.linesIN.length;
            var i;
            for(i = 0; i<n; i++)
                this.linesIN[0].removeme();
            n = this.linesOUT.length;
            for(i = 0; i<n; i++)
                this.linesOUT[0].removeme()
        };

        this.UMLvalid = function(l) {
            if (this.mytype == 0) {
                if (l == 0) { //elemento di inizio linea
                    if (connsel != connIn[0])  //unico connettore di uscita
                        return true;
                }   //else elmem di fine linea
                else if (connsel == connIn[0])
                    return true;
            }
            else {
                if (l == 0) { //elemento di inizio linea
                    if (connsel == connOut[0])   //unico connettore di entrata
                        return true;
                }
                else if (connsel != connOut[0])
                    return true;
            }
            return false;
        }

    }

//fork
    function click_btn15() {
        reset_btn(document.getElementById("all"));
        reset_btn(btnFork.parentNode);
        btnFork.classList.add("btn_pressed");
        var f = null;

        mysvg.onmousedown = function(e){
            if (btnFork.classList.contains("btn_pressed")) {
                drawing = true;
                pt = transformPoint(e.clientX, e.clientY);
                mDx = pt.x;
                mDy = pt.y;
                f = new ForkJoin();
                f.newLine(mDx, mDy, mDx, mDy);
                f.mytype = 0;
            }
        };

        mysvg.onmousemove = function(e) {
            if(drawing) {
                pt = transformPoint(e.clientX, e.clientY);
                mMx = pt.x;
                mMy = pt.y;
                f.setLine(mDx, mDy, mMx, mMy);
            }
        };

        mysvg.onmouseup = function(e) {
            if (drawing) {
                drawing = false;
                pt = transformPoint(e.clientX, e.clientY);
                mMx = pt.x;
                mMy = pt.y;
                if (Math.abs(mDx - mMx) < 10 && Math.abs(mDy - mMy) < 10) {
                    f.removeme();
                }
                else {
                    f.setLine(mDx, mDy, mMx, mMy);
                    f.myfig.setAttributeNS(null, "style", "stroke-width:5; opacity:1");
                    f.drawIO(1, 2);     //default per fork
                }
            }
        };

        function onmouseenterbar(e) {
            if (btnFork.classList.contains("btn_pressed")) {
                //deletelastsvgel("line", false);
                if (drawing) {
                    f.myfig.setAttributeNS(null, "style", "stroke-width:5; opacity:1");
                }
                drawing = false;
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

//join
    function click_btn16() {
        reset_btn(document.getElementById("all"));
        reset_btn(btnJoin.parentNode);
        btnJoin.classList.add("btn_pressed");
        var f = null;

        mysvg.onmousedown = function(e){
            if (btnJoin.classList.contains("btn_pressed")) {
                drawing = true;
                pt = transformPoint(e.clientX, e.clientY);
                mDx = pt.x;
                mDy = pt.y;
                f = new ForkJoin();
                f.newLine(mDx, mDy, mDx, mDy);
                f.mytype = 1;
            }
        };

        mysvg.onmousemove = function(e) {
            if(drawing) {
                pt = transformPoint(e.clientX, e.clientY);
                mMx = pt.x;
                mMy = pt.y;
                f.setLine(mDx, mDy, mMx, mMy);
            }
        };

        mysvg.onmouseup = function(e) {
            if (drawing) {
                drawing = false;
                pt = transformPoint(e.clientX, e.clientY);
                mMx = pt.x;
                mMy = pt.y;
                if (Math.abs(mDx - mMx) < 10 && Math.abs(mDy - mMy) < 10) {
                    f.removeme();
                }
                else {
                    f.setLine(mDx, mDy, mMx, mMy);
                    f.myfig.setAttributeNS(null, "style", "stroke-width:5; opacity:1");
                    f.drawIO(2, 1);     //default per join
                }
            }
        };

        function onmouseenterbar(e) {
            if (btnFork.classList.contains("btn_pressed")) {
                //deletelastsvgel("line", false);
                if (drawing) {
                    f.myfig.setAttributeNS(null, "style", "stroke-width:5; opacity:1");
                }
                drawing = false;
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    btnFork.onclick=(click_btn15);

    btnJoin.onclick=(click_btn16);

});