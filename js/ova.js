$(function(){
    
	//instancia de iLightbox que abre los iframe
	//en la pantalla inicial
	//solo los link que contengan la meta data
	//data-lightbox-gallery

    $('.lightbox').iLightbox({
        type: 'iframe',
        loop: null,
        arrows: null,
        closeBtn: true,
        title: null,
        href: null,
        content: null        
    });

})