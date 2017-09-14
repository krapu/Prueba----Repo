(function ( $ ) {
 
    $.fn.dragAndDropV2 = function(options) {

        //var self = this;
        
        // This is the easiest way to have default options.
        var settings = $.extend({
            // estos seria los valores por default
            //color: "#556b2f",
            //backgroundColor: "white"
            info: {
                drags: {}, 
                drops: {}, 
                intentos: 0
            },
            tipologia: "categoria", //categoria o sencillo
            pregunta: "", //enunciado para visualizarse previo a la actividad
            tipo_drags: "imagen", //imagen, audio o texto
            tipo_drops: "imagen", //imagen, audio o texto
            intentos: 1,
            drags: {
                //se pasan en el tipo json definido en el archivo de configuracion
            },
            drops: {
                //se pasan en el tipo json definido en el archivo de configuracion
            },
            //callbacks----------------------------------
            start: function(){
                //se ejecuta al inicial el reto
                dr.showInst()
                //console.log(dr)
            },
            correct: function(objt_ev){
                //se ejecuta cuando el reto esta completo
                dr.showCorrect()
                //objt_ev.reset()            
            },
            fail: function(objt_ev){
                //se ejecuta cuando el reto ha sido  fallido
                //console.log("Ejecutando fail!") 
                dr.showFail()
                //objt_ev.reset();
            },/**/
            error: function(){
                //se ejecuta cuando hubo un error en el reto
                //se cuenta como un intento malo
                dr.showError()
            }

        }, options);

        //definicion de widgets-------------------------------------------------------------
        $.widget( "custom.droppable2", $.ui.droppable, {
            _create: function(){
                
                this._super();
                
                this.options.cont_accepted = 0;

                //alert("Comienza el reto!")
                settings.start()    
            },
            _validaAccepts: function(){
                console.log("Ejecutando la funcion de validacion.")
            },
            validacion: function(){
                console.log("La valicion se esta haciendo!")

                this.options.cont_accepted++;

                console.log(this.options.cont_accepted)

                if (this.options.cont_accepted === this.options.num_accepted) {
                    this._trigger("complete")
                }

                console.log(this.options)
            }
        });

        $.widget( "custom.draggable", $.ui.draggable, {
            _create: function(){
                
                this._super();
                
                this.options.cont_intentos = 0;

                //alert("Comienza el reto!")

                console.log(this.options)    
            },
            valIntento: function(total_intentos){

                console.log(total_intentos)

                this.options.cont_intentos++;

                console.log(this.options.cont_intentos)

                if (this.options.cont_intentos === total_intentos) {
                    this._trigger("reto_fail")
                }
            }
        });

        //--------------------------------------------------------------------------------------

        //Funciones globales---------------------------------------------------
        this.setEleDragDrop = function(elem, tipo, contenido){

            let res = elem;

            switch (tipo) {

                case "texto":
                {
                    res = $("<span>").html(contenido);
                    break;
                }
                case "imagen":
                {
                    res = $("<img>", {src: contenido});
                    break;
                }
                case "default":
                {
                    console.error("El tipo de drop especificado no existe");
                    break;
                }
            }

            return res;
        }

        //--------------------------------------------------------------------------------------
        //variables drags
        //------------------------------------------------------------------
        
        this.contador = 0;//era cont (puede ser innecesario)
        this.drag;//
        this.ele_drag;//elemento drag solo
        //contenedor de todos los drags
        this.dragsContainer = $("<div>", {class: "categoryDragsContainer"});
        //contenedor drag individual
        this.dragContainer = $("<div>", {class: "categoryDragContainer"});

        this.cantidad_accepted = 0;
        //------------------------------------------------------------------

        //--------------------------------------------------------------------------------------
        //funciones drags

        this.getDragsContainer = function(drags,tipo){

            var self = this;

            $.each(drags, function(index, val) {

                console.log(val.accepted)

                let ele = self.setEleDragDrop(self.ele_drag,tipo,val.contenido)

                let clase_ele = val.accepted ? "dragElement dragElement-accepted" : "dragElement";

                if (val.accepted) {
                    self.cantidad_accepted++;
                }

                self.drag = $("<div>", {"class": clase_ele}).append(ele);

                self.drag.prop("key", index);

                //settings.info.drags[index].posicion = {top: self.drag.position().top, left: self.drag.position().left};

                self.drag.draggable({
                    
                    revert: "invalid",                    
                    stop: function(event, ui){

                        console.log(ui)

                        if ( !$(ui.helper[0]).hasClass('dragElement-accepted') ){

                           settings.error()

                           self.drag.draggable("valIntento", settings.intentos)

                        }/**/ 
                    },
                    reto_fail: function(event, ui){
                        settings.fail(self)
                    }
                });

                console.log(self.drag)

                self.dragContainer.append(self.drag);
            });

            this.dragsContainer.append(this.dragContainer);

            console.log(self.cantidad_accepted)

            return this.dragsContainer;
        }
        //--------------------------------------------------------------------------------------

        this.reset = function(){

            var config = settings;

            console.log(config)

            $(this).empty();

            $(this).dragAndDropV2(config);            
        }
        
        console.log(settings.tipologia)

        if (settings.tipologia === "categoria") {

            //variables globales--------------------------------------------------

            var p = $("<p>", {"class": "pregunta"}).html(settings.pregunta);

            var innerContainer = $("<div>", {class:"dragDropContainer category"})

            //--------------------------------------------------------------------
            //variables drops
            var dropContainer = $("<div>", {class:"dropContainer"});
            var eleDropContainer = $("<div>", {class:"eleDropContainer"});

            //contenedor de los drops
            var dropsContainer = $("<div>", {class: "categoryDropsContainer"});
            //cada tipo de drop
            var ele_drop;
            //contenedor del tipo de drop que se puede arrastar
            var drop = $("<div>", {"class": "dropElement"});
            //---------------------------------------------------------------------


            //mete drags y drops en el contenedor principal
            innerContainer.append(dropsContainer);
            //obtiene los drags con la calse de funciones drags
            innerContainer.append(this.getDragsContainer(settings.drags, settings.tipo_drags));
            
            
            //---------------------------------------------------------------------

            var self = this;

            //desde los drops pasaron por configuracion----------------------------
            //ya no deben haber drops porque ya no hay nada que definir en el objeto
            //de drops

            $.each(settings.drops, function (key, value) {

                //crea el drop dentro de settings.info
                settings.info.drops[key] = {};

                //revisa que tipo de contenido va a ser y lo regresa a una variable
                
                self.setEleDragDrop(ele_drop, settings.tipo_drops,value.contenido)
                //------------------------------------------------------------------

                //------------------------------------------------------------------
                //luego se setean los elementos para que se puedan hacer arrastrables
                //y se meten en el contenedor de drops
                drop.append(ele_drop);

                //se setea dentro del drops de settings.info el objeto, los drags que lleva
                //y si es correcto o no                
                settings.info.drops[key].obj = drop;
                settings.info.drops[key].current_drags = {};
                settings.info.drops[key].correct = false;
                //------------------------------------------------------------------

                //------------------------------------------------------------------
                //con jquery ui se setea que el elemento drop creado se pueda arrastrar
                //de la siguiente forma:
                
                drop.droppable2({
                    accept: ".dragElement-accepted",
                    num_accepted: self.cantidad_accepted,                                        
                    drop: function (event, ui) {
                                            
                        if ($(ui.draggable[0]).hasClass('dragElement-accepted') && !$(ui.draggable[0]).hasClass('dragElement-dragged')) {

                            $(ui.draggable[0]).addClass('dragElement-dragged')                            

                            drop.droppable2("validacion")

                        }                                                

                        console.log($(ui.draggable[0]))

                    },                    
                    complete: function(event, ui){
                        settings.correct(self)
                    },                    
                    tolerance: "pointer"
                });

                console.log(drop)                
                //------------------------------------------------------------------

                //------------------------------------------------------------------
                //se maqueta los contenedores drop
                eleDropContainer.append(ele_drop);
                dropContainer.append(eleDropContainer);
                dropContainer.append(drop);
                dropsContainer.append(dropContainer);

                //console.log(dropsContainer)
                //------------------------------------------------------------------
            })

            //mete en el contenedor desde el cual se llama el plugin
            //lo maqueteado anteriormente
            $(this).append(innerContainer);
            //mete la pregunta antes del contenido anterior
            $(this).prepend(p);
            //-------------------------------------------------------------------------

        } else {
            console.error("La categoría de drag and drop seleccionada no existe");
        }
        //--------------------------------------------------------------------------------------
    };
 
}( jQuery ));