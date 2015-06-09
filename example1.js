var labelType, useGradients, nativeTextSupport, animate;

(function () {
    var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
    elem: false,
    write: function (text) {
        if (!this.elem)
            this.elem = document.getElementById('log');
        this.elem.innerHTML = text;
        this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
    }
};


function init() {
    //init data


     var json$ = {
         id: "84XC3909E35S",
         name: "Commande", data: { time: "16/09/2013 à 17H" },
        children: [
        {
            id: "0035364288", name: "Facture", data: { time: "16/09/2013 à 17H", link: "facture.pdf" }

        }
    ]
    };

    var json = {
        id: "84XC3909E35S",
        name: "Commande", data: { num: "TP-2013-100200", time: "13/09/2013 à 13H40", link: "facture.pdf" },
        children: [
        {
            id: "0810980", name: "Réponse à la commande", data: { num: "0810980", time: "16/09/2013 à 17H", link: "facture.pdf" }

        },
        {
            id: "0810982", name: "Réponse à la commande ", data: { num: "0810980", time: "14/09/2013 à 17H", link: "facture.pdf" }

        },
        {
            id: "0810980744", name: "Avis d’expédition ", data: { num: "0810980744", time: "16/09/2013 à 4H", link: "facture.pdf" }

        },
        {
            id: "0035279316", name: "Facture", data: { num: "0035279316", time: "20/09/2013 à 4H", link: "facture.pdf" }

        },
        {
            id: "0810980743", name: "Avis d’expédition", data: { num: "0810980743", time: "17/09/2013 à 6H", link: "facture.pdf" }

        },
        {
            id: "0035279318", name: "Facture", data: { num: "TP-2013-100200", time: "20/09/2013 à 6H", link: "facture.pdf" }, children: [
             {
                 id: "0035279312", name: "Avoir", data: { num: "TP-2013-100200", time: "23/09/2013 à 6H", link: "facture.pdf" }

             },
             {
                 id: "003523495", name: "Avis de paiement", data: { num: "TP-2013-100200", time: "29/09/2013 à 12H", link: "facture.pdf" }

             }

            ]

        }

    ]
    };



     //end
     //init Spacetree
     //Create a new ST instance
     var st = new $jit.ST({
         //id of viz container element
         injectInto: 'infovis',
         //set duration for the animation
         duration: 300,
         //set animation transition type
         transition: $jit.Trans.Sine.easeOut,
         //set distance between node and its children
         levelDistance: 100,
         //enable panning
         Navigation: {
             enable: true,
             panning: true
         },
         //set node and edge styles
         //set overridable=true for styling individual
         //nodes or edges
         Node: {
             height: 84,
             width: 140,
             type: 'rectangle',
             color: '#aaa',
             overridable: true
         },

         Edge: {
             type: 'bezier',
             overridable: true

         },

         onBeforeCompute: function (node) {
             Log.write("loading " + node.name);
         },

         onAfterCompute: function () {
             Log.write("done");
         },

         //This method is called on DOM label creation.
         //Use this method to add event handlers and styles to
         //your node.
         onCreateLabel: function (label, node) {
             label.id = node.id;
             label.innerHTML = node.name + "<br/><span class='num'>" + node.data.num + "</span>" +
           "<a target='_parent' href='" + node.data.link + "'><div class='viewdetail'>Télécharger<br/><span class='time'>" + node.data.time + "</span></div></a>";


             //set label styles


             label.onclick = function () {

                 if (normal.checked) {

                     st.onClick(node.id);



                 } else {

                     st.setRoot(node.id, 'animate');


                 }
             };
             var style = label.style;
             if (node.selected) {
                 style.color = '#ffffff';
             } else {
                 style.color = '#000000';
             }

             style.width = 140 + 'px';
             style.height = 24 + 'px';
             style.cursor = 'pointer';
             style.fontSize = '1.0em';
             style.textAlign = 'center';
             style.paddingTop = '3px';

         },

         //This method is called right before plotting
         //a node. It's useful for changing an individual node
         //style properties before plotting it.
         //The data properties prefixed with a dollar
         //sign will override the global node style properties.
         onBeforePlotNode: function (node) {
             //add some color to the nodes in the path between the
             //root node and the selected node.
             if (node.selected) {
                 node.data.$color = "#00b2ff";
             }
             else {
                 delete node.data.$color;
                 //if the node belongs to the last plotted level
                 if (!node.anySubnode("exist")) {
                     //count children number
                     var count = 0;
                     node.eachSubnode(function (n) { count++; });
                     //assign a node color based on
                     //how many children it has
                     node.data.$color = ['#fff', '#baa', '#ffc17c', '#daa', '#eaa', '#faa'][count];
                 }
             }
         },

         //This method is called right before plotting
         //an edge. It's useful for changing an individual edge
         //style properties before plotting it.
         //Edge data proprties prefixed with a dollar sign will
         //override the Edge global style properties.
         onBeforePlotLine: function (adj) {
             if (adj.nodeFrom.selected && adj.nodeTo.selected) {
                 adj.data.$color = "#999999";
                 adj.data.$lineWidth = 3;
             }
             else {
                 delete adj.data.$color;
                 delete adj.data.$lineWidth;
             }
         }
     });
     //load json data
     st.loadJSON(json);
     //compute node positions and layout
     st.compute();
     //optional: make a translation of the tree
     st.geom.translate(new $jit.Complex(-200, 0), "current");
     //emulate a click on the root node.


     /*st.onClick(st.root);*/
    
     st.onClick("0035279318");

     //end
     //Add event handlers to switch spacetree orientation.
     var top = $jit.id('r-top'),
        left = $jit.id('r-left'),
        bottom = $jit.id('r-bottom'),
        right = $jit.id('r-right'),
        normal = $jit.id('s-normal');


     function changeHandler() {
         if (this.checked) {
             top.disabled = bottom.disabled = right.disabled = left.disabled = true;
             st.switchPosition(this.value, "animate", {
                 onComplete: function () {
                     top.disabled = bottom.disabled = right.disabled = left.disabled = false;
                 }
             });
         }
     };

     top.onchange = left.onchange = bottom.onchange = right.onchange = changeHandler;



     //end

 }
