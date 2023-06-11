$(document).ready(function(){
    
    document.getElementById("selecao").value = "0"

    function esp(){
      
      let _nomes = []
      let _imgs = []
      let _precos = []
      let _rates = []
      let _ids = []

      for(i = 0; i < itens.length; i += 1){
        _nomes.push(itens[i]['title'])
        _imgs.push(itens[i]['image'])
        _precos.push('R$' + ((Number(itens[i]['price']).toFixed(2)).toString()).replace('.',','))
        _rates.push(parseInt(Math.round(itens[i]['rating']['rate'])))
        _ids.push(itens[i]['id'])
      }

      
      let _prod = $('._img_prod').toArray()
      let _prod_txt = $('._title_prod').toArray()
      let _prod_price = $('._price_prod').toArray()
      let _estrelas = $('._estrelas').toArray()

      for(i = 0; i < _prod.length; i += 1){
        $(_prod[i]).attr('src', _imgs[i])
        $(_prod_txt[i]).text(_nomes[i])
        $(_prod_price[i]).text(_precos[i])
        $(_estrelas[i]).children('i').slice(0, _rates[i]).addClass('_amarelo')
      }
      
      console.log(_imgs)

    }
  
    var imagens = ["img/imagem1.png", "img/imagem2.png", "img/imagem3.png"]
    var txt = [
        "Roupas para todas as estações!",
        "Temos Nike, Adidas e outros!",
        "Últimas tendências da moda!"
    ]

    var init = true
    var indice_carrossel = 0
    let itens = []
    let nomes = []
    let precos = []
    let imgs = []
    let rates = []
    let ids = []
    let actual_page = 1
    let actual_url_get = 'https://diwserver.vps.webdock.cloud/products'
    let filtrar = false
    let categorias = []
    
    $.ajax({
      url: 'https://diwserver.vps.webdock.cloud/products/categories/',
      method: 'GET',
      success: (e) => {
        categorias = e
      }
    })

    function req(url, num){
      $.ajax({
        url: url,
        method: "GET",
        data: {page : num},
        success: (e) => {
          console.log(e)
          itens = e['products']
          console.log(itens)
          if(init){
            esp()
            init = false
          }
          api_success(0, true)
        },
        error: (e) => {
          console.log(e)
        }
      });
    }

    req('https://diwserver.vps.webdock.cloud/products', actual_page)

    $('#page-e').click(() => {
      if(actual_page > 0)actual_page -= 1
      if(filtrar = true) req(actual_url_get, actual_page)
      else req('https://diwserver.vps.webdock.cloud/products', actual_page)
    })

    $('#page-d').click(() => {
      if(actual_page == 0) actual_page += 1
      if(itens.length == 0) actual_page -= 2
      actual_page += 1
      if(filtrar = true) req(actual_url_get, actual_page)
      else req('https://diwserver.vps.webdock.cloud/products', actual_page)
    })

    function api_success(indicador, ft){
      
      console.log(itens)

      nomes = []
      imgs = []
      precos = []
      rates = []
      ids = []

      let precos_reais = []

      if(indicador == 0){

        filtrar = false

        for(i = 0; i < itens.length; i += 1){
          nomes.push(itens[i]['title'])
          imgs.push(itens[i]['image'])
          precos.push('R$' + ((Number(itens[i]['price']).toFixed(2)).toString()).replace('.',','))
          precos_reais.push(Number(itens[i]['price']))
          rates.push(parseInt(Math.round(itens[i]['rating']['rate'])))
          ids.push(itens[i]['id'])
        }
      }

      else{
        
        filtrar = true
        actual_page = 0

        for(i = 0; i < itens.length; i += 1){
          
          actual_url_get = 'https://diwserver.vps.webdock.cloud/products/category/' + categorias[indicador - 1]
          req(actual_url_get, actual_page)
          nomes.push(itens[i]['title'])
          imgs.push(itens[i]['image'])
          precos.push('R$' + ((Number(itens[i]['price']).toFixed(2)).toString()).replace('.',','))
          precos_reais.push(Number(itens[i]['price']))
          rates.push(parseInt(Math.round(itens[i]['rating']['rate'])))
          ids.push(itens[i]['id'])
        
        }
      }

      precos = precos.filter((e) => {
        return e != -1;
      });

      nomes = nomes.filter((e) => {
        return e != -1;
      });

      imgs = imgs.filter((e) => {
        return e != -1;
      });

      rates = rates.filter((e) => {
        return e != -1;
      });
      
      let prod = $('.img_prod').toArray()
      let prod_txt = $('.title_prod').toArray()
      let prod_price = $('.price_prod').toArray()
      let estrelas = $('.estrelas').toArray()

      let cards = $('.livro').toArray()

      $('.amarelo').removeClass('amarelo')

      for(i = 0; i < prod.length; i += 1){
        $(prod[i]).attr('src', imgs[i])
        $(prod_txt[i]).text(nomes[i])
        $(prod_price[i]).text(precos[i])
        $(estrelas[i]).children('i').slice(0, rates[i]).addClass('amarelo')
      }

      for(i = 0; i < prod.length; i += 1){
        $(cards[i]).css('display', 'inline-block')
      }

      console.log(ids)
      for(i = nomes.length; i < prod.length; i += 1){
        $(cards[i]).css('display', 'none')
      }
    }



    $('#pesquisar').click(() => {
      actual_page = 1
      req(actual_url_get, actual_page)
      if($('#selecao').val() == 0) location.reload()
      $('.page-c').css('display', 'block')
      api_success($('#selecao').val(), false)
    })

    $('.btn-quer').click(() => {
      $('.page-c').css('display', 'none')
      if($('#header-p1').css('display') != 'none') {
        $.ajax({
          url: 'https://diwserver.vps.webdock.cloud/products/search?query=' + $('#inp-quer').val(),
          async: true,
          method: 'GET',
          success: (e) => {
            itens = e
            api_success(0, false)
          }
        })
      }
      else{
        $.ajax({
          url: 'https://diwserver.vps.webdock.cloud/products/search?query=' + $('#inp-quer-1').val(),
          async: true,
          method: 'GET',
          success: (e) => {
            itens = e
            api_success(0, false)
          }
        })
      }
    })


    $(".livro").click(function() {
      var id = $(this).attr("id")
      id = id.substring(1) - 1
      url = 'detalhes.html?id=' + ids[id]
      window.location.href = url
    });


    $("._livro").click(function() {
      var id = $(this).attr("id")
      id = id.substring(1) - 1
      url = 'detalhes.html?id=' + ids[id]
      window.location.href = url
    });



    setInterval(function() {

      if(window.innerWidth <= 1020){
        $("#header").css("position", "sticky")
        $("#header-p1, #header-p2").css("display", "none")
        $("#menu-celular-barra").css("display", "block")
      }
      else{
        $("#header").css("position", "static")
        $("#header-p1, #header-p2").css("display", "block")
        $("#menu-celular-barra, #menu-celular").css("display", "none")
        $("#menu-celular").width(0)
      }
    },100)

  
    
    $("#menu-celular-barra").click(function(){  
      if($("#menu-celular").width() == 0){
        $("#menu-celular-barra").css("position", "fixed")
        $("#menu-celular-barra").css("top", "0rem")
        $("#menu-celular-barra").css("right", "2.5rem")
        $(window).on("scroll")
        $("#menu-celular").css("display", "block")
        $("#menu-celular").animate({
          width: "50vw"
        }, 100)
      }
      else{
        $("#menu-celular-barra").css("position", "static")
        $("#menu-celular").animate({
          width: "-10",
          display: "none"
        }, 100)
      }
    })


    setInterval(() => {
      $('#carrossel-e').click()
    }, 10000)

    $("#carrossel-e").click(function(){
        if(indice_carrossel == 0) indice_carrossel = 2;
        else indice_carrossel -= 1
        $("#img-carrossel").fadeOut("0", function() {
            $(this).attr("src", imagens[indice_carrossel]);
            $(this).fadeIn("0");
          });
          $("#txt-carrossel").fadeOut("0", function() {
            $(this).text(txt[indice_carrossel])
            $(this).fadeIn("0")
          })
    })

    $("#carrossel-d").click(function(){
        if(indice_carrossel == 2) indice_carrossel = 0;
        else indice_carrossel += 1
        $("#img-carrossel").fadeOut("0", function() {
            $(this).attr("src", imagens[indice_carrossel]);
            $(this).fadeIn("0");
          });
          $("#txt-carrossel").fadeOut("0", function() {
            $(this).text(txt[indice_carrossel])
            $(this).fadeIn("0")
          })
    })
})
