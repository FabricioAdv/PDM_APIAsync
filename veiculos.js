(async() =>
{   
    buscaVeiculos().then(json => 
    {
        window.dados = json
        listaVeiculos();
    }).catch(error => erroLoading(error));
})();

// Busca de veículos através do link
async function buscaVeiculos(link = 'http://swapi.dev/api/vehicles/?page=1')
{
    const response = await fetch(link);

    if (!response.ok)
    {
        throw new Error(response.status);
    }

    const json = await response.json();

    return json;
}

// Listagem dos itens na página
function listaVeiculos()
{
    //console.log(window.dados);

    const json = window.dados;

    //document.getElementById("veiculo-lista").innerHTML = "";

    for (var i = 0 ; i < json.results.length; i++)
    {
        const aux = json.results[i];

        console.log(aux.name);

        novoElemento(document.getElementById("veiculoLista"), "li", ["veiculo-lista-item"]);

        var veiculos = document.getElementsByTagName("li");

        var dadosVeiculo = '';

        dadosVeiculo += '<div class="container-fluid mx-0">';
        dadosVeiculo += '<div class="row"><div class="col-md-2 border-end border-3 border-dark d-flex align-content-center flex-wrap"><p class="fw-bold">'+ aux.name +'</p></div>';
        dadosVeiculo += '<div class="col-md-8">';
        dadosVeiculo += '<div class="row"><p>Modelo: '+ aux.model +'</p></div>';
        dadosVeiculo += '<div class="row"><p>Fabricante: '+ aux.manufacturer +'</p></div>';
        dadosVeiculo += '<div class="row"><p>Valor: '+ aux.cost_in_credits +'</p></div>';
        dadosVeiculo += '<div class="row"><p>Capacidade de carga: '+ aux.cargo_capacity +'</p></div></div>';
        dadosVeiculo += '<div class="col-md-2 d-flex align-content-center flex-wrap"><button class="veiculo-editar js-veiculo-editar" onclick="editarVeiculo(' + i + ')">Editar</button>';
        dadosVeiculo += '<button class="veiculo-remover js-veiculo-remover" onclick="apagaVeiculo(this.parentElement)">Remover</button></div></div></div>';
        
        veiculos[veiculos.length - 1].innerHTML = dadosVeiculo;
    }

    if (json.previous != null)
    {
        const anterior = document.getElementById("anterior");

        anterior.classList.remove("js-escondido");
        anterior.dataset.page = new URL(json.previous).searchParams.get("page");
    }

    if (json.next != null)
    {
        const anterior = document.getElementById("proximo");

        anterior.classList.remove("js-escondido");
        anterior.dataset.page = new URL(json.next).searchParams.get("page");
    }

    document.getElementById("loader").classList.add("js-escondido");
}

// Acesso a página
async function accessPage(element)
{
    removeAll();

    buscaVeiculos("http://swapi.dev/api/vehicles/?page=" + element.dataset.page).then(json => 
        {
            window.dados = json
            listaVeiculos();
        }).catch(error => erroLoading(error));
}

// Mensagem de erro no carregamento
async function erroLoading(error)
{
    console.log(error);
    document.getElementById("loader").childNodes[0].textContent = "- Erro no carregamento -" + error;
}

// Adicionar novo elemento
function novoElemento(elem, type, newClass = null, newID = null)
{
    var newElem = elem.appendChild(document.createElement(type));

    if (newClass != null)
    {
        for (let i = 0 ; i < newClass.length ; i++)
        {
            newElem.classList.add(newClass[i]);
        }
    }

    if (newID != null)
    {
        newElem.id = newID;
    }
}

// Remover todos os veiculos listados
function removeAll()
{
    const node = document.getElementById("veiculoLista");
    while (node.lastElementChild) 
    {
        node.removeChild(node.lastElementChild);
    }

    document.getElementById("loader").classList.remove("js-escondido");
    document.getElementById("anterior").classList.add("js-escondido");
    document.getElementById("proximo").classList.add("js-escondido");
}

// Editar veiculo
function editarVeiculo(item)
{
    const json = window.dados.results[item];

    document.getElementById("lista").classList.add("js-escondido");
    document.getElementById("editar").classList.remove("js-escondido");

    var editar = document.getElementById("editar");

    var dadosVeiculo = '';

    dadosVeiculo += '<div class="titulo">Editar veículo - Star Wars</div>';
    dadosVeiculo += '<label for="nomeVeiculo" class="form-label fs-5 text-white fw-bold">Nome do veiculo</label>';
    dadosVeiculo += '<input type="text" class="form-control mb-4" id="nomeVeiculo">';
    dadosVeiculo += '<label for="modelo" class="form-label fs-5 text-white fw-bold">Modelo</label>';
    dadosVeiculo += '<input type="text" class="form-control mb-4" id="modelo">';
    dadosVeiculo += '<label for="fabricante" class="form-label fs-5 text-white fw-bold">Fabricante</label>';
    dadosVeiculo += '<input type="text" class="form-control mb-4" id="fabricante">';
    dadosVeiculo += '<label for="valor" class="form-label fs-5 text-white fw-bold">Valor</label>';
    dadosVeiculo += '<input type="text" class="form-control mb-4" id="valor">';
    dadosVeiculo += '<label for="capCarga" class="form-label fs-5 text-white fw-bold">Capacidade de carga</label>';
    dadosVeiculo += '<input type="text" class="form-control mb-4" id="capCarga">';
    dadosVeiculo += '<button type="button" class="btn btn-primary mt-3" onclick="alterarVeiculo(' + item + ')">Alterar</button>';

    editar.innerHTML = dadosVeiculo;

    document.getElementById("nomeVeiculo").value = json.name;
    document.getElementById("modelo").value = json.model;
    document.getElementById("fabricante").value = json.manufacturer;
    document.getElementById("valor").value = json.cost_in_credits;
    document.getElementById("capCarga").value = json.cargo_capacity;
}

function alterarVeiculo(item)
{
    window.dados.results[item].name = document.getElementById("nomeVeiculo").value;
    window.dados.results[item].model = document.getElementById("modelo").value;
    window.dados.results[item].manufacturer = document.getElementById("fabricante").value;
    window.dados.results[item].cost_in_credits = document.getElementById("valor").value;
    window.dados.results[item].cargo_capacity = document.getElementById("capCarga").value;

    removeAll();
    
    document.getElementById("editar").classList.add("js-escondido");
    document.getElementById("lista").classList.remove("js-escondido");
    
    listaVeiculos();
}

// Remover veiculo
function apagaVeiculo(element)
{
    element.parentElement.parentElement.parentElement.remove();
}