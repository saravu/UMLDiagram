/**
 * Created by Sara on 11/12/2015.
 */
//decision, merge
window.addEventListener("load", function(e){

    var btnDec = document.getElementById("btn17");
    var btnMerge = document.getElementById("btn18");
    var mDx, mDy, mMx, mMy = 0;
    var drawing = false;
    var fixed = true;
    var pt = null;

    function DecMer() {
        var _this = this;
        var myf = null;
        var mytext = null;
        var mytextlenght = 0;
        var myin= new Array();
        var myout= new Array();
        var connOut = new Array();
        var connIn = new Array();
        var ni, no;

        this.myfig = null;
        this.mytype = null;     // 0 = dec, 1 = merge
        this.mytext = null;
        this.linesIN = new Array();
        this.numconnIn = new Array();
        this.linesOUT = new Array();
        this.numconnOut = new Array();
        var r1, r2, r3, r4 = null;
        this.myRes = new Array();

        var myx, myy, tx, ty = null;
        var myD = stdw;
        var myd = stdh;
        var offx, offy;

        function ondblclickDM() {
            drag = false;
            if (selection) {
                switch (_this.mytype) {
                    case 0:
                    {
                        setProp(true, false, true, function (t, i, o) {
                            mytext.textContent = t;
                            mytextlenght = mytext.textContent.length;
                            _this.updateDM(myx, myy, mytextlenght*13, myd);
                            _this.setText();
                            _this.removeO();
                            _this.removeI();
                            no = o;
                            _this.drawIO(ni, no);
                        });
                        break;
                    }
                    case 1:
                    {
                        setProp(true, true, false, function (t, i, o) {
                            mytext.textContent = t;
                            mytextlenght = mytext.textContent.length;
                            _this.updateDM(myx, myy, mytextlenght*13, myd);
                            _this.setText();
                            _this.removeO();
                            _this.removeI();
                            ni = i;
                            _this.drawIO(ni, no);
                        });
                        break;
                    }
                }
                hideResize();
            }
        }

        this.newDM = function(x, y) {
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
            //rombo
            myf.setAttributeNS(null, "points", myx.toString()+","+myy.toString()+" "+(myx+myD/2).toString()+","+(myy-myd/2).toString()+
                " "+(myx+myD).toString()+","+myy.toString()+" "+(myx+myD/2).toString()+","+(myy+myd/2).toString());

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
                ondblclickDM();
            };
        };

        this.updateDM = function(x, y, D, d) {
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
                myf.setAttributeNS(null, "style", "stroke-width:2; opacity:1");
            }
            var minD = Math.max(D, stdw, mytextlenght*13);
            myx = x;
            myD = minD;
            if (d >= stdh) {
                myy = y;
                myd = d;
            }
            myf.setAttributeNS(null, "points", myx.toString()+","+myy.toString()+" "+(myx+myD/2).toString()+","+(myy-myd/2).toString()+
                " "+(myx+myD).toString()+","+myy.toString()+" "+(myx+myD/2).toString()+","+(myy+myd/2).toString());

            this.setRes();
        };

        //QUI massimo 5, attenzione!
        this.drawIO = function(i, o) {
            ni = parseInt(i);
            no = parseInt(o);
            var idx = 0;
            var conn;
            if (!drag && !resize) {
                var c;
                for (c=0; c<ni; c++) {
                    myin.push(document.createElementNS(svgNS, "line"));
                    connIn.push(new Connection(_this));
                }
                for (c=0; c<no; c++) {
                    myout.push(document.createElementNS(svgNS, "line"));
                    connOut.push(new Connection(_this));
                }
            }
            function setin(x1, y1, x2, y2) {
                updateLine(myin[idx], x1, y1, x2, y2);
                conn = connIn[idx];
                conn.updateConnection(x2 - cdim/2, y2 - cdim/2);
                if (!drag) {
                    mysvg.appendChild(myin[idx]);
                    _this.setColor(standardcolor);
                    mysvg.appendChild(connIn[idx].myfig);
                }
                idx++;
            }
            function setout(x1, y1, x2, y2) {
                updateLine(myout[idx], x1, y1, x2, y2);
                conn = connOut[idx];
                conn.updateConnection(x2 - cdim/2, y2 - cdim/2);
                if (!drag) {
                    mysvg.appendChild(myout[idx]);
                    _this.setColor(standardcolor);
                    mysvg.appendChild(connOut[idx].myfig);
                }
                idx++;
            }
            if (ni == 1 || ni == 3 || ni == 5) {
                connIn[0].setN(0);
                setin(myx, myy, (myx - 10), myy);
            }
            if (ni == 2 || ni == 3 || ni == 4 || ni == 5) {
                if (ni == 2 || ni == 4) {
                    connIn[0].setN(0);
                    connIn[1].setN(1);
                }
                else {
                    connIn[1].setN(1);
                    connIn[2].setN(2);
                }
                setin(myx+(myD)/4, myy-(myd/2)/2, myx+(myD)/4, myy-(myd/2)/2-10);
                setin(myx+(myD)/4, myy+(myd/2)/2, myx+(myD)/4, myy+(myd/2)/2+10);
            }
            if (ni == 4 || ni == 5) {
                if (ni == 4) {
                    connIn[2].setN(2);
                    connIn[3].setN(3);
                }
                else {
                    connIn[3].setN(3);
                    connIn[4].setN(4);
                }
                setin(myx+(myD)/2, myy-(myd/2), myx+(myD)/2, myy-(myd/2)-10);
                setin(myx+(myD)/2, myy+(myd/2), myx+(myD)/2, myy+(myd/2)+10);
            }
            idx = 0;
            if (no == 1 || no == 3 || no == 5) {
                connOut[0].setN(0);
                setout(myx+myD, myy, myx+myD+10, myy);
            }
            if (no == 2 || no == 3 || no == 4 || no == 5) {
                if (no == 2 || no == 4) {
                    connOut[0].setN(0);
                    connOut[1].setN(1);
                }
                else {
                    connOut[1].setN(1);
                    connOut[2].setN(2);
                }
                setout(myx+(myD)*3/4, myy-(myd/2)/2, myx+(myD)*3/4, myy-(myd/2)/2-10);
                setout(myx+(myD)*3/4, myy+(myd/2)/2, myx+(myD)*3/4, myy+(myd/2)/2+10);
            }
            if (no == 4 || no == 5) {
                if (no == 4) {
                    connOut[2].setN(2);
                    connOut[3].setN(3);
                }
                else {
                    connOut[3].setN(3);
                    connOut[4].setN(4);
                }
                setout(myx+(myD)/2, myy-(myd/2), myx+(myD)/2, myy-(myd/2)-10);
                setout(myx+(myD)/2, myy+(myd/2), myx+(myD)/2, myy+(myd/2)+10);
            }
            idx = 0;
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

        this.setText = function() {
            if (mytext != null) {
                tx = myx + myD / 5;
                ty = myy;
                mytext.setAttributeNS(null, "x", tx.toString());
                mytext.setAttributeNS(null, "y", ty.toString());
            }
        };
        this.addText = function() {
            mytext = document.createElementNS(svgNS, "text");
            this.setText();
            mytext.setAttributeNS(null, "style", "font-family:" + ffam +"; font-size:" + fsz);
            mytext.setAttributeNS(null, "fill", standardcolor);
            mytext.textContent = "cond";
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
                ondblclickDM();
            }
        };

        this.setRes = function () {
            r1.updateResize(myx - cdim/2, myy - myd/2 - cdim/2);
            r2.updateResize(myx + myD - cdim/2, myy - myd/2 - cdim/2);
            r3.updateResize(myx + myD - cdim/2, myy + myd/2 - cdim/2);
            r4.updateResize(myx - cdim/2, myy + myd/2 - cdim/2);
        };
        this.resizeObj = function(mx, my) {
            var i, deltaw, deltah, lx, ly = 0;
            switch (numresize) {
                case 1: {
                    this.updateDM(mx, myy, myD+(myx-mx), (myy-my)*2);
                    break;
                }
                case 2: {
                    this.updateDM(myx, myy, mx-myx, (myy-my)*2);
                    break;
                }
                case 3: {
                    this.updateDM(myx, myy, mx-myx, (my-myy)*2);
                    break;
                }
                case 4: {
                    this.updateDM(mx, myy, myD+(myx-mx), (my-myy)*2);
                    break;
                }
            }
            this.drawIO(ni, no);
            this.setText();
            this.setColor(selectioncolor);
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
            if (mytext!=null) mytext.setAttributeNS(null, "fill", c);
        };

        this.dragDM = function(dx, dy) {
            this.updateDM(myx + dx, myy + dy, myD, myd);
            this.drawIO(ni, no);
            this.setText();
        };
        this.dragObj = function(mx, my) {
            var deltax, deltay, i, l;
            deltax = (mx - myx) + offx;
            deltay = (my - myy) + offy;
            this.dragDM(deltax, deltay);
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
        };

        this.removeI = function() {
            var el, idx;
            for(idx=0; idx<myin.length; idx++) {
                el = myin[idx];
                el.parentNode.removeChild(el);
                connIn[idx].removeme();
            }
            myin = new Array();
            connIn = new Array();
        };
        this.removeO = function() {
            var el, idx;
            for(idx=0; idx<myout.length; idx++) {
                el = myout[idx];
                el.parentNode.removeChild(el);
                connOut[idx].removeme();
            }
            myout = new Array();
            connOut = new Array();
        };
        this.removeme = function() {
            var i;
            myf.parentNode.removeChild(myf);
            if (mytext != null) mytext.parentNode.removeChild(mytext);
            this.removeI();
            this.removeO();
            var n = this.linesIN.length;
            for(i = 0; i<n; i++)
                this.linesIN[0].removeme();
            n = this.linesOUT.length;
            for(i = 0; i<n; i++)
                this.linesOUT[0].removeme()
            removeRes();
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

//dec
    function click_btn17() {
        reset_btn(document.getElementById("all"));
        reset_btn(btnDec.parentNode);
        btnDec.classList.add("btn_pressed");
        var f = null;
        setCursorByID("mysvg", "none");

        mysvg.onmousedown = function(e){ };

        mysvg.onmousemove = function(e) {
            if (btnDec.classList.contains("btn_pressed")) {
                pt = transformPoint(e.clientX, e.clientY);
                mMx = pt.x;
                mMy = pt.y;
                if (fixed) {
                    f = new DecMer();
                }
                f.newDM(mMx, mMy);
                drawing = true;
            }
        };

        mysvg.onmouseup = function(e) {
            if (drawing) {
                pt = transformPoint(e.clientX, e.clientY);
                mMx = pt.x;
                mMy = pt.y;
                f.updateDM(mMx, mMy, stdw, stdh);
                f.addText();
                f.drawIO(1, 2);
                f.mytype = 0;
                drawing = false;
            }
        };

        function onmouseenterbar(e) {
            if (btnDec.classList.contains("btn_pressed")) {
                deletelastsvgel("polygon", fixed);
                fixed = true;
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

//merge
    function click_btn18() {
        reset_btn(document.getElementById("all"));
        reset_btn(btnMerge.parentNode);
        btnMerge.classList.add("btn_pressed");
        var f = null;
        setCursorByID("mysvg", "none");

        mysvg.onmousedown = function(e){ };

        mysvg.onmousemove = function(e) {
            if (btnMerge.classList.contains("btn_pressed")) {
                pt = transformPoint(e.clientX, e.clientY);
                mMx = pt.x;
                mMy = pt.y;
                if (fixed) {
                    f = new DecMer();
                }
                f.newDM(mMx, mMy);
                drawing = true;
            }
        };

        mysvg.onmouseup = function(e) {
            if (drawing) {
                pt = transformPoint(e.clientX, e.clientY);
                mMx = pt.x;
                mMy = pt.y;
                f.updateDM(mMx, mMy, stdw, stdh);
                f.addText();
                f.drawIO(2, 1);
                f.mytype = 1;
                drawing = false;
            }
        };

        function onmouseenterbar(e) {
            if (btnMerge.classList.contains("btn_pressed")) {
                deletelastsvgel("polygon", fixed);
                fixed = true;
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    btnDec.onclick=(click_btn17);

    btnMerge.onclick=(click_btn18);

});