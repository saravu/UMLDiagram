/**
 * Created by Sara on 18/12/2015.
 */
//action
window.addEventListener("load", function(e){

    var mybtn = document.getElementById("txt");
    var mysvg = document.getElementById("mysvg");
    var mDx, mDy, mMx, mMy = 0;
    var drawing = false;

    function Text() {
        var _this = this;
        var mytext = null;
        var myx, myy = 0;
        var offx, offy = 0;

        this.myfig = null;  //metter a tutti lo stesso nome
        this.mytype = "text";
        this.linesIN = new Array();
        this.linesOUT = new Array();
        this.myRes = null;

        this.newText = function(x, y) {
            mytext = document.createElementNS(svgNS, "text");
            mytext.setAttributeNS(null, "stroke", "trasparent");
            mytext.setAttributeNS(null, "fill", standardcolor);
            mytext.setAttributeNS(null, "text-anchor", "start");
            mytext.setAttributeNS(null, "font-family", "monospace");
            mytext.setAttributeNS(null, "font-size", "14px");
            myx = x;
            myy = y;
            mytext.setAttributeNS(null, "x", myx.toString());
            mytext.setAttributeNS(null, "y", myy.toString());

            this.myfig = mytext;

            mytext.onmousedown = function(e) {
                select(e, _this);
                seeResize();
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
            //tspan?!
            //var textNode = document.createTextNode(val);
            //mytext.appendChild(textNode);
            mytext.textContent = val;
            mysvg.appendChild(mytext);
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
        reset_btn(mybtn.parentNode);
        mybtn.classList.add("btn_pressed");
        var mytxt = null;

        setCursorByID("mysvg", "text");

        mysvg.onmousedown = function(e) {
            if (mybtn.classList.contains("btn_pressed")) {
                mDx = e.clientX;
                mDy = e.clientY;
                mytxt = new Text();
                mytxt.newText(mDx, mDy);
                setProp(true, false, false, function(t, i, o) {
                    mytxt.setText(t);
                });
                drawing = true;
            }
        };

        mysvg.onmousemove = function(e) {
            if (drawing) {

            }
        };

        mysvg.onmouseup = function(e) {
            if (drawing) {

            }
        };

        function onmouseenterbar() {
            if (mybtn.classList.contains("btn_pressed")) {
                deletelastsvgel("text", false);

            }
        }
        document.getElementById("container_vert").addEventListener("mouseenter", onmouseenterbar);
        document.getElementById("container_orizz").addEventListener("mouseenter", onmouseenterbar);

    }

    mybtn.onclick=("click", click_btntext());

});