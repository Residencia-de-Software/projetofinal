$(() => {

    var carrinhoBarley = sessionStorage.getItem('carrinhoBarley');
    if (carrinhoBarley) {
        $("#carrinhoIcon").attr("src", "img/shop-icon-full.png");
    }

    //****************************************************
    //Funções para exibição dos videos de fundo
    //****************************************************

    $('.navbar a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        var id = $(this).attr('href'),
            targetOffset = $(id).offset().top - 50;

        $('html, body').animate({
            scrollTop: targetOffset
        }, 500);
    });
    function deferVideo() {
        //defer html5 video loading
        $("video source").each(function () {
            var sourceFile = $(this).attr("data-src");
            $(this).attr("src", sourceFile);
            var video = this.parentElement;
            video.load();
            // uncomment if video is not autoplay
            //video.play();
        });
    }
    window.onload = deferVideo;

    //*****************************************************
    //Carregar as cervejas
    //*****************************************************

    axios.get('http://localhost:8160/api/produtos')
        .then((res) => {
            res.data.forEach(
                (e, index) => {
                    let cerveja =
                        ` <div class="col-sm-12 col-md-6 col-lg-4 col-ex-3 p-3">
                  <div class="card text-center h-100 p-2">
                      <img src="${e.url_img}" class="img-fluid card-img-top">
                      <div class="card-body>
                          <div class="card-title">
                            <h3>${e.nome}</h3>
                          </div>
                          <a href="#" class="btn btn-primary" 
                                    role="button" data-toggle="modal" data-target="#modalAdicionar"
                                    data-whatever="${e._id}">Mais Detalhes...</a>
                      </div>
                  </div>
              </div>`;
                    $("#listaProdutos").append(cerveja);
                })
        })


    //*********************************************************************************
    // Preenche o modal de compras
    //*********************************************************************************

    $('#modalAdicionar').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Botão que acionou o modal
        var recipient = button.data('whatever') // Extrai informação dos atributos data-*
        // Se necessário, você pode iniciar uma requisição AJAX aqui e, então, fazer a atualização em um callback.
        // Atualiza o conteúdo do modal. Nós vamos usar jQuery, aqui. No entanto, você poderia usar uma biblioteca de data binding ou outros métodos.
        axios.get(`http://localhost:8160/api/produtos/${recipient}`)
            .then((res) => {
                var modal = $(this)
                modal.find('h5').text(res.data.nome);
                modal.find('h4').text(`R$ ${res.data.preco.toFixed(2)}`)
                modal.find('img').attr('src', res.data.url_img);
                modal.find('#carrinho').attr('onclick', `adicionar("${res.data._id}")`);
                modal.find('#comprar').attr('onclick', `comprar("${res.data._id}")`);
            })
    })
})

function adicionar(id) {

    var carrinhoBarley = sessionStorage.getItem('carrinhoBarley');

    if (carrinhoBarley == null || carrinhoBarley == undefined) {
        carrinhoBarley = {
            produtos: []
       }
    }
    else{
        carrinhoBarley = JSON.parse(carrinhoBarley);
    }

    axios.get(`http://localhost:8160/api/produtos/${id}`)
        .then((res) => {
            pedido = {
                quantidade: $("#quantidade").val(),
                produto: res.data
            }

            carrinhoBarley.produtos.push(pedido);

            sessionStorage.setItem('carrinhoBarley',JSON.stringify(carrinhoBarley));

            window.location.reload();
        })
}

function comprar(id) {

    var carrinhoBarley = sessionStorage.getItem('carrinhoBarley');

    if (carrinhoBarley == null || carrinhoBarley == undefined) {
        carrinhoBarley = {
            produtos: []
       }
    }
    else{
        carrinhoBarley = JSON.parse(carrinhoBarley);
    }

    axios.get(`http://localhost:8160/api/produtos/${id}`)
        .then((res) => {
            pedido = {
                quantidade: $("#quantidade").val(),
                produto: res.data
            }

            carrinhoBarley.produtos.push(pedido);

            sessionStorage.setItem('carrinhoBarley',JSON.stringify(carrinhoBarley));

            window.location.href = 'carrinho.html';
        })
}