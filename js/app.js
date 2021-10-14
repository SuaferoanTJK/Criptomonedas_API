const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedasSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
    moneda: "",
    criptomoneda: ""
}

// Crear un promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})
 
document.addEventListener("DOMContentLoaded", () => {
    consultarCriptomonedas();
    formulario.addEventListener("submit",submitFormulario);
    criptomonedasSelect.addEventListener("change",leerValor);
    monedasSelect.addEventListener("change",leerValor);
});

function consultarCriptomonedas(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    fetch(url)
        .then(respuesta => {
            return respuesta.json();
        })
        .then(resultado => {
            return obtenerCriptomonedas(resultado.Data);
        })
        .then(criptomonedas => {
            return selectCriptomonedas(criptomonedas);
        })
        .catch(error => {
            console.log(error);
        })
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {FullName,Name} = cripto.CoinInfo;

        const option = document.createElement("option");
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(evento){
    objBusqueda[evento.target.name] = evento.target.value;
}

function submitFormulario(evento){
    evento.preventDefault();

    // Validar
    const {moneda,criptomoneda} = objBusqueda;
    if(moneda === "" || criptomoneda === ""){
        mostrarAlerta("Ambos campos son obligatorios");
        return;
    }

    // Consultar la API
    consultarAPI();
}

function mostrarAlerta(mensaje){
    const alertaMensaje = document.querySelector(".error");

    if(!alertaMensaje){
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("error");
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove();
        }, 2500);
    }    
}

function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();
    fetch(url)
        .then(respuesta => {
            return respuesta.json();
        })
        .then(resultado => {
            mostrarConversion(resultado.DISPLAY[criptomoneda][moneda]);
        })
        .catch(error => {
            console.log(error);
        })
}

function mostrarConversion(dato){
    limpiarHTML();
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = dato;
    
    const precio = document.createElement("p");
    precio.classList.add("precio");
    precio.innerHTML = ` 
        El precio es: <span> ${PRICE} </span>
    `;
    const precioAlto  = document.createElement("p");
    precioAlto.innerHTML = ` 
        El precio más alto en el día es: <span> ${HIGHDAY} </span>
    `;
    const precioBajo  = document.createElement("p");
    precioBajo.innerHTML = ` 
        El precio más bajo en el día es: <span> ${LOWDAY} </span>
    `;
    const cambioPrecio  = document.createElement("p");
    cambioPrecio.innerHTML = ` 
        El cambio en el precio ha sido de: <span> ${CHANGEPCT24HOUR} </span>
    `;
    const updatePrecio  = document.createElement("p");
    updatePrecio.innerHTML = ` 
    La última actualización se llevó a cabo: <span> ${LASTUPDATE} </span>
    `;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(cambioPrecio);
    resultado.appendChild(updatePrecio);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();
    const divSpinner = document.createElement("div");
    divSpinner.className = "spinner";
    divSpinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    resultado.appendChild(divSpinner);
}