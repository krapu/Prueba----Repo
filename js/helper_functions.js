(function(){
	//opacidad general de todos los botones a los que se les hace click
	//al elemento que tenga el metadato data-opacity="true"

	self.opacity_js = function(){
		this.elementos = $("[data-opacity*='true']");
		this.opcity = ".5"; 
	}

	self.opacity_js.prototype = {
		
		init:function(){
			//console.log(this.elementos)
			var self = this;
			this.elementos.click(function(){
		        $(this).css("opacity", self.opcity);
		    });
		},
		setOpcity: function(val){
			this.opcity = val;
		}
	}
	//-------------------------------------------------------------------

	//-------------------------------------------------------------------
	//funcion de telon
	self.telon = function(){
		//contenidos interiores
		this.cont_int = $("[id*='cont_int_']");
		//botones telon
		this.btns_tl = $("[id*='btn_tl_']");
		//selector del telon
		this.telon_cont = $(".telonCont")
		//selector boton volver
		this.volver_btn = $(".volver")
	}

	self.telon.prototype = {

		init: function(){

			var self = this;

			this.hideContInt();

			this.volver_btn.click(function(event) {
				self.cierraTelon()
			});

			this.btns_tl.click(function(event) {
								
				let id_contenido = $(this).data('id-cont-tl')
				let src_iframe = $("#"+id_contenido).data('src')

				$("#"+id_contenido).html(self.createIframe(src_iframe)).show();

				self.abreTelon();
			});
		},
		hideContInt: function(){
			this.cont_int.hide()
		},
		abreTelon: function(){
			this.telon_cont.animate({
	            top: '10px'
	        }, 1000, 'easeOutExpo');
		},
		cierraTelon: function(){
			var self = this;

			this.telon_cont.animate({
	            top: '600px'
	        }, 400, 'linear', function(){
	        	//esconde los contenidos interiores
	            self.hideContInt()
	        });
		},
		createIframe: function(src){
			return '<iframe src="'+src+'" frameborder="0" scrolling="no" width="875" height="540"></iframe>';
		}
	}	
	//-------------------------------------------------------------------


	//-------------------------------------------------------------------
	//botones que funcionan como links
	self.buttonLink = function(){
		this.elements = $(':button');

	}

	self.buttonLink.prototype = {
		init: function(){
			//-----------------------------------------------
		    $.each(this.elements, function(index, val) {            

		        let link = $(this).data("href");

		        console.log(link)

		        if (link) {
		            
		            console.log("Boton link encontrado!")
		            
		            $(this).click(function(event) {
		                window.open(link, "_blank");
		            });
		            //-----------------------------------
		        }
		    });
		    //-----------------------------------------------
		}
	}
	//-------------------------------------------------------------------

	//-------------------------------------------------------------------
	//modals de tipo alerta botones recuerde y notificaciones
	self.notLert = function(){
		this.fondo = $(".black_not_lert");
		this.contenidos = $(".cont_not_lert");		
		this.btns_abrir = $('.op_not_lert');		
		this.btns_cerrar = $(".cls_not_lert")
	}

	self.notLert.prototype = {
		init: function(){

			var self = this;

			this.cerrar_f()

			this.btns_cerrar.click(function(event) {
				self.cerrar_f()
			});			

			this.btns_abrir.click(function(event) {
				let id_cont_muestra = $(this).data("id-cont-not-lert");
				self.showFondo()
		        $("#"+id_cont_muestra).fadeIn();
			});
		},
		hideFondo: function(){			
			this.fondo.hide()
		},		
		hideContenidos: function(){
			this.contenidos.hide()
		},
		cerrar_f: function(){
			this.hideFondo()
			this.hideContenidos()
		},
		showFondo: function(){
			this.fondo.fadeIn()
		},
	}
	//-------------------------------------------------------------------

	//-------------------------------------------------------------------
	//complemento para los tabs
	self.tab_s = function(){
		this.cont_tabs = $(".cont_tab_s");
		this.btn_tab_s = $(".btn_tab_s");
		this.btn_close_tab_s = $(".cls");
		this.click_default = true;
		this.id_last = "";
		this.id = "";		
	}

	self.tab_s.prototype = {
		init: function(){

			var self = this;

			this.hideContenidos()

			var def = this.click_default ? this.default() : console.log("no default");

			this.btn_tab_s.click(function(event) {
				self.actionBtn($(this))
			});

			if (this.btn_close_tab_s.length > 0) {

				this.btn_close_tab_s.click(function(event) {
					self.hideContenido($(this))
				});
			}
		},
		hideContenidos: function(){
			this.cont_tabs.hide()
		},
		hideContenido: function(btn){
			let id_cont = btn.data("close-id-tab");
			//console.log(id_cont)			
			$("#"+id_cont).hide();
		},
		actionBtn: function(btn){
			//default funtionality---------------------------------------------
			let id_cont = btn.data("cont-tab-s");
			this.hideContenidos()
			$("#"+id_cont).fadeIn();
			//-----------------------------------------------------------------
			
			//aditional functions----------------------------------------------
			//validates id of the element clicked------------------------------
			if (btn[0]["id"] !== "") {				

				this.id_last = this.id_last == "" ? btn[0]["id"] : this.id;

				this.id =  btn[0]["id"];

				//validate properties as need-----------------------------------
				if (this.validateDataEstates(btn)) {

					//properties the button must have---------------------
					let id_color = btn.data("color-tab-s");
					let id_color_active = btn.data("color-tab-s-active");
					//----------------------------------------------------
					console.log(this.id_last)
					console.log(this.id)
					//----------------------------------------------------
					if (this.id == this.id_last) {
						$("#"+this.id).css('background-color', id_color_active);
					}else{
						$("#"+this.id_last).css('background-color', id_color);
						$("#"+this.id).css('background-color', id_color_active);
					}

				}
				//--------------------------------------------------------------
			}
			//-------------------------------------------------------------------			
		},
		validateDataEstates: function(btn){
			if ( (btn.data("color-tab-s") !== "") && (btn.data("color-tab-s-active") !== "") ) {
				return true;
			}else{
				return false;
			}
		},
		default: function(){

			//default[click y muestra el primer tab]
			if (this.btn_tab_s.length > 0) {
				this.actionBtn(this.btn_tab_s)
				this.btn_tab_s[0].click()
			}
		},
		setDefault: function(val){
			this.click_default = val;
		}
	}
	//-------------------------------------------------------------------

	//-------------------------------------------------------------------
	//complemento acordeon ova

	self.acordion_o = function(){
	    this.contenedor = $(".acordeon_contenedor");
	    this.contenido = $(".accordeon_contenido");
	    this.click_button = $(".accordeon_click");
	}

	self.acordion_o.prototype = {
	    
	    init:function(){

	        var self = this;

	        //this.contenedor.hide();
	        this.contenido.hide();

	        this.click_button.click(function(event) {

	            if ($(this).hasClass('activo')) {
	                   $(this).removeClass('activo');
	                   $(this).next().slideUp();
	              } else {
	                   
	                   self.click_button.removeClass('activo');

	                   $(this).addClass('activo');

	                   //this.contenedor.slideUp();
	                   self.contenido.slideUp();

	                   $(this).next().slideDown();
	              }
	            
	        });
	    }

	}
	//-------------------------------------------------------------------

	//-------------------------------------------------------------------
	//complemento DOM retos
	/**/
	self.DOMretos = function(){
		this.blackout = $(".blackoutReto");
		this.instruccion = $(".instruccionReto");
		this.btnCerrar = $(".cerrar");
		this.error = $(".otro_intento");
		this.fail = $(".incorrecto");
		this.correct = $(".correcto");
		this.btnFeedback = $(".btnFeedback-revisar");
	}

	self.DOMretos.prototype = {

		showInst : function(){

			var self = this;

			this.hideBlot();
			this.instruccion.fadeIn(500);
			this.showBlot();

			this.btnCerrar.click(function () {
	            self.hideBlot();
	        });

		},
		showError : function(){

			var self = this;

			this.hideBlot();

			this.instruccion.hide();

			console.log(this.error)

			this.error.show();

			this.blackout.fadeIn(500);

			this.btnFeedback.click(function () {
	            
	            self.blackout.fadeOut(500);
	        });
		},
		showFail: function(){
	        //cuando la respuesta es incorrecta y ya no hay mas intentos

	        //mostrar retroalimentación incorrecto
	        this.hideBlot();

	        this.error.hide();

	        this.fail.fadeIn(500);

	        this.blackout.fadeIn(500);
	        
	    },
	    showCorrect(){

	        this.hideBlot();

	        this.instruccion.hide();
	        this.error.hide();

	        this.correct.fadeIn(500);
	        this.blackout.fadeIn(500);	        
	    },
		hideBlot : function(){

			this.blackout.hide();
		},
		showBlot : function(){

			this.blackout.css('display', 'flex').hide().fadeIn(500);
		}
	}
	//-------------------------------------------------------------------

})()

//var btL = new buttonLink();
//btL.init()

$(function(){

	console.log("inicializa en helper!")

	//----------------------------------------------------------------
    //telon de vista
    self.tl = new telon();
    tl.init()
    //----------------------------------------------------------------

	//------------------------------------------------
    //Opacidad de los objetos con data opacity

    //instancia clase opacity_js
    self.op = new opacity_js();
    //define opacidad si no se pone queda por defecto .8
    //op.setOpcity(".2")
    //inicializa la funcion
    op.init()
    //------------------------------------------------

    //------------------------------------------------
    //botones que funcionan como links con data-href
    self.btL = new buttonLink();
    btL.init()

    //------------------------------------------------
    //funcionalidad del etiquetado para notificaciones y alertas
    self.nl = new notLert()
    nl.init()


    //------------------------------------------------
    //funcionalidad del etiquetado para los elementos en pestañas
    self.tabS = new tab_s()
    tabS.init()


    //------------------------------------------------
    //inicializacion de complemento para el acordeon
	self.ac = new acordion_o();
	ac.init()
	//------------------------------------------------

	//------------------------------------------------
	//inicializacion complemento DOMretos
	self.dr = new DOMretos();
	//------------------------------------------------
})