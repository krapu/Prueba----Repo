(function ($) {
    $.fn.extend({
        dragAndDrop: function (config) {

            var $container = $(this);

            //define la propiedad config para el div contenedor que contiene la 
            //configuracion del plugin seteada desde la instancia inicial
            $container.prop("config", config);
            //define la propiedad info para el div contenedor, un json que contiene
            //drags, drops, y num de intentos
            $container.prop("info", {drags: {}, drops: {}, intentos: 0});
            //la variable foo contiene la información seteada anteriormente
            //foo es info
            var foo = $container.prop("info");

            //ejecución-----------------------------------------------------------------------------------
            //valida que se halla pasado los atributos tipologia,tipo_drags,drags,drops
            if (config.hasOwnProperty("tipologia") &&
                    config.hasOwnProperty("tipo_drags") &&
                    config.hasOwnProperty("drags") &&
                    config.hasOwnProperty("drops")) {

                //si no tiene la propiedad intentos la crea e iguala a 1
                if (!config.hasOwnProperty("intentos")) {
                    config.intentos = 1;
                }

                switch (config.tipologia) {
                    case "sencillo":
                    {
                        var $dropsContainer = $("<div>", {class: "simpleDropsContainer"});
                        $.each(config.drops, function (key, value) {
                            foo.drops[key] = {};
                            var $drop = $("<div>", {"class": "dropElement"});
                            foo.drops[key].obj = $drop;
                            foo.drops[key].current_drag = null;
                            foo.drops[key].correct = false;
                            $drop.droppable({
                                drop: function (event, ui) {
                                    var curDrag = foo.drops[key].current_drag;
                                    var dragKey = $(ui.draggable).prop("key");
                                    if (curDrag === null)
                                    {
                                        foo.drops[key].current_drag = dragKey;
                                    }
                                    else {
                                        if (curDrag !== $(ui.draggable).prop("key")) {
                                            moverDrag(foo.drags[curDrag].obj, foo.drags[curDrag].posicion);
                                            foo.drops[key].current_drag = dragKey;
                                        }
                                    }
                                    ui.draggable.position({
                                        my: "center",
                                        at: "center",
                                        of: $(this)
                                    });
                                    foo.drops[key].correct = value.accepted.indexOf(parseInt(foo.drops[key].current_drag)) >= 0;
                                },
                                out: function (event, ui) {
                                    var curDrag = foo.drops[key].current_drag;
                                    if (curDrag !== null && ($(ui.draggable).prop("key") === foo.drops[key].current_drag)) {
                                        foo.drops[key].current_drag = null;
                                        foo.drops[key].correct = false;
                                    }
                                },
                                tolerance: "pointer"
                            });

                            var $ele_drop;
                            switch (config.tipo_drops) {
                                case "texto":
                                {
                                    $ele_drop = $("<span>").html(value.contenido);
                                    break;
                                }
                                case "imagen":
                                {
                                    $ele_drop = $("<img>", {src: value.contenido});
                                    break;
                                }
                                case "audio":
                                    {
                                        var $audio = $("<audio>", {src: value.contenido});
                                        $ele_drop = $("<div>", {class: "audiobtn"}).html("<i class='fa fa-play'></i>");
                                        $ele_drop.prop("audio", $audio);
                                        $ele_drop.prop("key", key);
                                        $ele_drop.click(function () {
                                            var theaudio = $(this).prop("audio")[0];
                                            if (!theaudio.paused && !theaudio.ended && 0 < theaudio.currentTime) {
                                                theaudio.pause();
                                                theaudio.currentTime = 0;
                                            } else {
                                                $(".audiobtn", $container).each(function () {
                                                    if ($(this).prop("key") !== key) {
                                                        $(this).prop("audio")[0].pause();
                                                        $(this).prop("audio")[0].currentTime = 0;
                                                    }
                                                });
                                                $ele_drop.prop("audio")[0].play();
                                            }
                                        });

                                        $audio.on("playing", function () {
                                            $ele_drop.html("<i class='fa fa-stop'></i>");
                                        });

                                        $audio.on("ended", function () {
                                            $ele_drop.html("<i class='fa fa-play'></i>");
                                        });

                                        $audio.on("pause", function () {
                                            $ele_drop.html("<i class='fa fa-play'></i>");
                                        });
                                        break;
                                }
                                case "default":
                                {
                                    console.error("El tipo de drop especificado no existe");
                                    break;
                                }
                            }
                            
                            var $dropContainer = $("<div>", {class:"dropContainer"});
                            var $eleDropContainer = $("<div>", {class:"eleDropContainer"});
                            $eleDropContainer.append($ele_drop);
                            $dropContainer.append($eleDropContainer);
                            $dropContainer.append($drop);
                            $dropsContainer.append($dropContainer);
                        });
                        
                        var $dragContainer = $("<div>", {class: "simpleDragContainer"});
                        var $dragCol1 = $("<div>", {"class": "dragCol"});
                        var $dragCol2 = $("<div>", {"class": "dragCol"});
                        
                        var cont = 0;
                        $.each(config.drags, function (key, value) {
                            var $drag;
                            foo.drags[key] = {};
                            if (value.hasOwnProperty("contenido")) {
                                var $ele_drag;
                                switch (config.tipo_drags) {
                                    case "texto":
                                    {
                                        $ele_drag = $("<span>").html(value.contenido);
                                        break;
                                    }
                                    case "imagen":
                                    {
                                        $ele_drag = $("<img>", {src: value.contenido});
                                        break;
                                    }
                                    case "audio":
                                    {
                                        var $audio = $("<audio>", {src: value.contenido});
                                        $ele_drag = $("<div>", {class: "audiobtn"}).html("<i class='fa fa-play'></i>");
                                        $ele_drag.prop("audio", $audio);
                                        $ele_drag.prop("key", key);
                                        $ele_drag.click(function () {
                                            var theaudio = $(this).prop("audio")[0];
                                            if (!theaudio.paused && !theaudio.ended && 0 < theaudio.currentTime) {
                                                theaudio.pause();
                                                theaudio.currentTime = 0;
                                            } else {
                                                $(".audiobtn", $container).each(function () {
                                                    if ($(this).prop("key") !== key) {
                                                        $(this).prop("audio")[0].pause();
                                                        $(this).prop("audio")[0].currentTime = 0;
                                                    }
                                                });
                                                $ele_drag.prop("audio")[0].play();
                                            }
                                        });

                                        $audio.on("playing", function () {
                                            $ele_drag.html("<i class='fa fa-stop'></i>");
                                        });

                                        $audio.on("ended", function () {
                                            $ele_drag.html("<i class='fa fa-play'></i>");
                                        });

                                        $audio.on("pause", function () {
                                            $ele_drag.html("<i class='fa fa-play'></i>");
                                        });
                                        break;
                                    }
                                }
                                $drag = $("<div>", {"class": "dragElement"}).append($ele_drag);
                            }
                            else {
                                console.error("El contenido de un drag no ha sido definido correctamente.");
                            }

                            $drag.prop("key", key);
                            foo.drags[key].obj = $drag;
                            $drag.draggable({
                                stop: function () {
                                    var returnToOrigin = true;
                                    var dragKey = $(this).prop("key");
                                    $.each(foo.drops, function (key, value) {
                                        if (value.current_drag !== null && value.current_drag === dragKey) {
                                            returnToOrigin = false;
                                            return false;
                                        }
                                    });

                                    if (returnToOrigin) {
                                        moverDrag($(this), foo.drags[key].posicion);
                                    }
                                }
                            });
                            foo.drags[key].posicion = {top: $drag.position().top, left: $drag.position().left};
                            if(cont % 2 === 0){
                                $dragCol1.append($drag);
                            }else{
                                $dragCol2.append($drag);
                            }
                            cont++;
                        });
                        $dragContainer.append($dragCol1);
                        $dragContainer.append($dragCol2);
                        var $innerContainer = $("<div>", {class:"dragDropContainer"})
                        $innerContainer.append($dropsContainer);
                        $innerContainer.append($dragContainer);
                        $container.append($innerContainer);

                        var $p = $("<p>", {"class": "pregunta"}).html(config.pregunta);
                        $container.prepend($p);
                        break;
                    }

                    case "categoria":
                    {
                        var $dropsContainer = $("<div>", {class: "categoryDropsContainer"});
                        
                        //desde los drops pasadon por configuracion
                        $.each(config.drops, function (key, value) {
                            
                            //crea el drop dentro de info
                            foo.drops[key] = {};

                            var $ele_drop;

                            switch (config.tipo_drops) {
                                case "texto":
                                {
                                    $ele_drop = $("<span>").html(value.contenido);
                                    break;
                                }
                                case "imagen":
                                {
                                    $ele_drop = $("<img>", {src: value.contenido});
                                    break;
                                }
                                case "audio":
                                    {
                                        var $audio = $("<audio>", {src: value.contenido});
                                        $ele_drop = $("<div>", {class: "audiobtn"}).html("<i class='fa fa-play'></i>");
                                        $ele_drop.prop("audio", $audio);
                                        $ele_drop.prop("key", key);
                                        $ele_drop.click(function () {
                                            var theaudio = $(this).prop("audio")[0];
                                            if (!theaudio.paused && !theaudio.ended && 0 < theaudio.currentTime) {
                                                theaudio.pause();
                                                theaudio.currentTime = 0;
                                            } else {
                                                $(".audiobtn", $container).each(function () {
                                                    if ($(this).prop("key") !== key) {
                                                        $(this).prop("audio")[0].pause();
                                                        $(this).prop("audio")[0].currentTime = 0;
                                                    }
                                                });
                                                $ele_drop.prop("audio")[0].play();
                                            }
                                        });

                                        $audio.on("playing", function () {
                                            $ele_drop.html("<i class='fa fa-stop'></i>");
                                        });

                                        $audio.on("ended", function () {
                                            $ele_drop.html("<i class='fa fa-play'></i>");
                                        });

                                        $audio.on("pause", function () {
                                            $ele_drop.html("<i class='fa fa-play'></i>");
                                        });
                                        break;
                                }
                                case "default":
                                {
                                    console.error("El tipo de drop especificado no existe");
                                    break;
                                }
                            }

                            var $drop = $("<div>", {"class": "dropElement"});
                            
                            $drop.append($ele_drop);
                            
                            foo.drops[key].obj = $drop;
                            foo.drops[key].current_drags = {};
                            foo.drops[key].correct = false;

                            $drop.droppable({
                                drop: function (event, ui) {
                                    var dragKey = $(ui.draggable).prop("key");
                                    foo.drops[key].current_drags[dragKey] = $(ui.draggable);
                                    var curDrags = foo.drops[key].current_drags;
                                    var correct = value.accepted.length === Object.keys(curDrags).length;
                                    if (correct) {
                                        $.each(value.accepted, function (key, value) {
                                            if (!curDrags.hasOwnProperty(value)) {
                                                correct = false;
                                                return false;
                                            }
                                        });
                                    }
                                    foo.drops[key].correct = correct;
                                },
                                out: function (event, ui) {
                                    var curDrags = foo.drops[key].current_drags;
                                    if (curDrags.hasOwnProperty($(ui.draggable).prop("key"))) {
                                        delete curDrags[$(ui.draggable).prop("key")];
                                        var correct = value.accepted.length === Object.keys(curDrags).length;
                                        if (correct) {
                                            $.each(value.accepted, function (key, value) {
                                                if (!curDrags.hasOwnProperty(value)) {
                                                    correct = false;
                                                    return false;
                                                }
                                            });
                                        }
                                        foo.drops[key].correct = correct;
                                    }
                                },
                                tolerance: "pointer"
                            });
                            
                            var $dropContainer = $("<div>", {class:"dropContainer"});
                            var $eleDropContainer = $("<div>", {class:"eleDropContainer"});
                            $eleDropContainer.append($ele_drop);
                            $dropContainer.append($eleDropContainer);
                            $dropContainer.append($drop);
                            $dropsContainer.append($dropContainer);
                        });
                        
                        
                        var $dragsContainer = $("<div>", {class: "categoryDragsContainer"});
                        var $dragContainer = $("<div>", {class: "categoryDragContainer"});

                        var cont = 0;
                        $.each(config.drags, function (key, value) {
                            cont++;
                            var $drag;
                            foo.drags[key] = {};

                            if (value.hasOwnProperty("contenido")) {
                                var $ele_drag;
                                switch (config.tipo_drags) {
                                    case "texto":
                                    {
                                        $ele_drag = $("<span>").html(value.contenido);
                                        break;
                                    }
                                    case "imagen":
                                    {
                                        $ele_drag = $("<img>", {src: value.contenido});
                                        break;
                                    }

                                    case "audio":
                                    {
                                        var $audio = $("<audio>", {src: value.contenido});
                                        $ele_drag = $("<div>", {class: "audiobtn"}).html("<i class='fa fa-play'></i>");
                                        $ele_drag.prop("audio", $audio);
                                        $ele_drag.prop("key", key);
                                        $ele_drag.click(function () {
                                            var theaudio = $(this).prop("audio")[0];
                                            if (!theaudio.paused && !theaudio.ended && 0 < theaudio.currentTime) {
                                                theaudio.pause();
                                                theaudio.currentTime = 0;
                                            } else {
                                                $(".audiobtn", $container).each(function () {
                                                    if ($(this).prop("key") !== key) {
                                                        $(this).prop("audio")[0].pause();
                                                        $(this).prop("audio")[0].currentTime = 0;
                                                    }
                                                });
                                                $ele_drag.prop("audio")[0].play();
                                            }
                                        });

                                        $audio.on("playing", function () {
                                            $ele_drag.html("<i class='fa fa-stop'></i>");
                                        });

                                        $audio.on("ended", function () {
                                            $ele_drag.html("<i class='fa fa-play'></i>");
                                        });

                                        $audio.on("pause", function () {
                                            $ele_drag.html("<i class='fa fa-play'></i>");
                                        });
                                        break;
                                    }

                                    case "default":
                                    {
                                        console.error("El tipo de drop especificado no existe");
                                        break;
                                    }
                                }
                                $drag = $("<div>", {"class": "dragElement"}).append($ele_drag);
                            }
                            else {
                                console.error("El contenido de un drop no ha sido definido correctamente.");
                            }
                            
                            $drag.prop("key", key);
                            foo.drags[key].obj = $drag;
                            
                            $drag.draggable({
                                stop: function () {
                                    var returnToOrigin = true;
                                    var dragKey = $(this).prop("key");
                                    $.each(foo.drops, function (key, value) {
                                        if (value.current_drags !== null && value.current_drags.hasOwnProperty(dragKey)) {
                                            returnToOrigin = false;
                                            return false;
                                        }
                                    });

                                    if (returnToOrigin) {
                                        moverDrag($(this), foo.drags[key].posicion);
                                    }
                                }
                            });


                            foo.drags[key].posicion = {top: $drag.position().top, left: $drag.position().left};
                            if(cont<=6){
                                 $dragContainer.append($drag);
                            }else{
                                $dragsContainer.append($dragContainer);
                                $dragContainer = $("<div>", {class: "categoryDragContainer"});
                                $dragContainer.append($drag);
                                cont = 0;
                            }
                        });
                        
                        $dragsContainer.append($dragContainer);
                        var $p = $("<p>", {"class": "pregunta"}).html(config.pregunta);
                        var $innerContainer = $("<div>", {class:"dragDropContainer category"})
                        $innerContainer.append($dropsContainer);
                        $innerContainer.append($dragsContainer);
                        $container.append($innerContainer);
                        $container.prepend($p);
                        break;
                    }

                    case "default":
                    {
                        console.error("La categoría de drag and drop seleccionada no existe");
                        break;
                    }
                }
                
                var $btnContainer = $("<div>",{class: "dragDropBtnContainer"});
                var $button = $("<button>", {class: "dragDropButton"});
                $button.html("Validar");

                $button.click(function () {

                    $(".audiobtn", $container).each(function () {
                        $(this).prop("audio")[0].pause();
                        $(this).prop("audio")[0].currentTime = 0;
                    });

                    foo.intentos++;
                    var correct = true;
                    $.each(foo.drops, function (key, value) {
                        if (!value.correct) {
                            correct = false;
                            return false;
                        }
                    });

                    if (correct) {
                        var objEvt = {
                                type: "Retroalimentacion_DragAndDrop",
                                correct: true,
                                container: $container
                            };
                        $(document).trigger(objEvt);
                        $.each(foo.drags, function (key, value) {
                            value.obj.draggable("destroy");
                        });
                    } else {
                        if (foo.intentos >= config.intentos) {
                            
                            $(".audiobtn", $container).off();
                            
                             var objEvt = {
                                type: "Retroalimentacion_DragAndDrop",
                                correct: false,
                                intentos_restantes: 0,
                                container: $container
                            };
                            $(document).trigger(objEvt);
                            $.each(foo.drags, function (key, value) {
                                value.obj.draggable("destroy");
                            });
                        } else { 
                            var objEvt = {
                                type: "Retroalimentacion_DragAndDrop",
                                correct: false,
                                intentos_restantes: (config.intentos - foo.intentos),
                                container: $container
                            };
                            $(document).trigger(objEvt);
                            switch (config.tipologia) {
                                case "sencillo":
                                {
                                    $.each(foo.drops, function (key, value) {
                                        if (!value.correct && value.current_drag !== null) {
                                            moverDrag(foo.drags[value.current_drag].obj, foo.drags[key].posicion);
                                            value.current_drag = null;
                                        }
                                    });
                                    break;
                                }

                                case "categoria":
                                {
                                    $.each(foo.drops, function (key, value) {
                                        if (!value.correct && value.current_drags !== null) {
                                            $.each(value.current_drags, function (keys, values) {
                                                if (config.drops[key].accepted.indexOf(keys) < 0) {
                                                    moverDrag(values, foo.drags[keys].posicion);
                                                    delete value.current_drags[keys];
                                                }
                                            });
                                        }
                                    });
                                    break;
                                }
                            }
                        }
                    }
                });
                $btnContainer.append($button);
                $container.append($btnContainer);
            } else {
                console.error("Error en configuración del Drag and Drop");
            }
            
            if(!config.hasOwnProperty("reinicio")){
                var objEvt = {
                    type: "Inicio_DragAndDrop"
                };
                $(document).trigger(objEvt);
            }
        },
        reiniciar_dragDrop: function(){
            var config = $(this).prop("config");    
            if(config!==null && typeof config === "object"){
                $(this).empty();
                config.reinicio = true;
                $(this).dragAndDrop(config);
            }
        }
    });
})(jQuery);

function moverDrag(dragObj, position) {
    dragObj.css({top: position.top, left: position.left});
}

//soporte móviles

!function (a) {
    function f(a, b) {
        if (!(a.originalEvent.touches.length > 1)) {
            a.preventDefault();
            var c = a.originalEvent.changedTouches[0], d = document.createEvent("MouseEvents");
            d.initMouseEvent(b, !0, !0, window, 1, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null), a.target.dispatchEvent(d)
        }
    }
    if (a.support.touch = "ontouchend"in document, a.support.touch) {
        var e, b = a.ui.mouse.prototype, c = b._mouseInit, d = b._mouseDestroy;
        b._touchStart = function (a) {
            var b = this;
            !e && b._mouseCapture(a.originalEvent.changedTouches[0]) && (e = !0, b._touchMoved = !1, f(a, "mouseover"), f(a, "mousemove"), f(a, "mousedown"))
        }, b._touchMove = function (a) {
            e && (this._touchMoved = !0, f(a, "mousemove"))
        }, b._touchEnd = function (a) {
            e && (f(a, "mouseup"), f(a, "mouseout"), this._touchMoved || f(a, "click"), e = !1)
        }, b._mouseInit = function () {
            var b = this;
            b.element.bind({touchstart: a.proxy(b, "_touchStart"), touchmove: a.proxy(b, "_touchMove"), touchend: a.proxy(b, "_touchEnd")}), c.call(b)
        }, b._mouseDestroy = function () {
            var b = this;
            b.element.unbind({touchstart: a.proxy(b, "_touchStart"), touchmove: a.proxy(b, "_touchMove"), touchend: a.proxy(b, "_touchEnd")}), d.call(b)
        }
    }
}(jQuery);
