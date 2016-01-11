/**
 * Created by Sara on 18/12/2015.
 */
//end - vecchio! inglobato in 13
window.addEventListener("load", function(e){

    var svgNS = "http://www.w3.org/2000/svg";
    var btnfinnode = document.getElementById("btn14");
    var mysvg = document.getElementById("mysvg");
    var mDx, mDy, mMx, mMy = 0;
    var fixed = true;

    function FinalNode() {
        var _this = this;
        var myest = null;
        var myint = null;
        var mytext = null;
        var myx, myy, tx, ty;
        var offx, offy;

        this.mypath = null;
        this.mycircle = null;
        this.mytext = null;
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
                myest.setAttributeNS(null, "r", "10");
                mysvg.appendChild(myest);
                this.mycircle = myest;
                myint.setAttributeNS(null, "stroke", standardcolor);
                myint.setAttributeNS(null, "fill", "blue");
                myint.setAttributeNS(null, "style", "opacity:0.3");
                myint.setAttributeNS(null, "r", "5");
                mysvg.appendChild(myint);
                this.mypath = myint;
            }
            myx = x;
            myy = y;
            myest.setAttributeNS(null, "cx", x.toString());
            myest.setAttributeNS(null, "cy", y.toString());
            myint.setAttributeNS(null, "cx", x.toString());
            myint.setAttributeNS(null, "cy", y.toString());

            myest.onmousedown = function(e) {
                select(e);
                offx = myx - e.clientX;
                offy = myy - e.clientY;
            };
            myest.onmouseup = function(e) {
                drag = false;
            };
            myint.onmousedown = function(e) {
                select(e);
                offx = myx - e.clientX;
                offy = myy - e.clientY;
            };
            myint.onmouseup = function(e) {
                drag = false;
            };
        };

        this.updateCircle = function(x1, y1) {
            myx = x1;
            myy = y1;
            myest.setAttributeNS(null, "cx", x1.toString());
            myest.setAttributeNS(null, "cy", y1.toString());
            myint.setAttributeNS(null, "cx", x1.toString());
            myint.setAttributeNS(null, "cy", y1.toString());
            fixed = true;
            myest.setAttributeNS(null, "style", "stroke-width:2;opacity:1");
            myint.setAttributeNS(null, "style", "stroke-width:2;opacity:1");
        };

        this.dragFork = function(x, y) {
            myx = x;
            myy = y;
            myest.setAttributeNS(null, "cx", x.toString());
            myest.setAttributeNS(null, "cy", y.toString());
            myint.setAttributeNS(null, "cx", x.toString());
            myint.setAttributeNS(null, "cy", y.toString());
        };

        this.setColor = function(c) {
            myest.setAttributeNS(null, "stroke", c);
        };

        this.dragObj = function(mx, my) {
            var deltax, deltay;
            deltax = (mx - myx) + offx;
            deltay = (my - myy) + offy;
            this.dragFork(myx + deltax, myy + deltay);
        };

        this.removeme = function() {
            myest.parentNode.removeChild(myest);
            myint.parentNode.removeChild(myint);
        };


    }


    function click_btn14() {
        reset_btn(btnfinnode.parentNode);
        btnfinnode.classList.add("btn_pressed");
        var c = null;

        mysvg.onmousedown = function(e) {

        };

        mysvg.onmousemove = function(e) {
            mMx = e.clientX;
            mMy = e.clientY;
            if (fixed) {
                c = new FinalNode();
            }
            c.newCircle(mMx, mMy);
        };

        mysvg.onmouseup = function(e) {
            //if (drawing) {
                mMx = e.clientX;
                mMy = e.clientY;
                c.updateCircle(mMx, mMy);
            //}
        };

        function onmouseenterbar() {
            if (btnfinnode.classList.contains("btn_pressed")) {
                c.removeme();
                fixed = true;
            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    btnfinnode.onclick=("click", click_btn14);

});

