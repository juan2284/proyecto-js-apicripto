const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedasSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
  moneda: '',
  criptomoneda: ''
}

// Crear el promise:
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
  resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
  consultarCriptomonedas();

  formulario.addEventListener('submit', submitFormulario);

  criptomonedasSelect.addEventListener('change', leerValor);
  monedasSelect.addEventListener('change', leerValor);
});

async function consultarCriptomonedas(){
  const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD';

  // fetch(url)
  //   .then(respuesta => respuesta.json())
  //   .then(resultado => obtenerCriptomonedas(resultado.Data)) // Añadimos el promise que se resuelva solamente cuando las criptomonedas se hayan descargado correctamente
  //   .then(criptomonedas => selectCriptomonedas(criptomonedas));

    try {
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();
      const criptomonedas = await obtenerCriptomonedas(resultado.Data);
      selectCriptomonedas(criptomonedas);   
      
    } catch (error) {
      console.log(error);
    }
}

function selectCriptomonedas(criptomonedas){
  criptomonedas.forEach(cripto => {
    const {FullName, Name} = cripto.CoinInfo;

    const option = document.createElement('option');
    option.value = Name;
    option.textContent = FullName;

    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e){
  // Agregar el valor de la criptomoneda al objeto de búsqueda
  objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e){
  e.preventDefault();

  // Validar
  const {moneda, criptomoneda} = objBusqueda;
  if(moneda === '' || criptomoneda === ''){
    mostrarAlerta('Ambos campos son obligatorios');
    return;
  }

  // Consultar la API con los resultados
  consultarAPI();
}

function mostrarAlerta(msg){
  // Evitar que el mensaje se repita
  const existeError = document.querySelector('.error');

  if(!existeError){
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');
    // Agregar el mensaje de error
    divMensaje.textContent = msg;
    // Insertar en el DOM
    formulario.appendChild(divMensaje);
    
    // Agregar el temporizador para eliminar el mensaje de error
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

async function consultarAPI(){
  const {moneda, criptomoneda} = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  // fetch(url)
  //   .then(respuesta => respuesta.json())
  //   .then(cotizacion => {
  //     mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
  //   });

  try {
    const respuesta = await fetch(url);
    const cotizacion = await respuesta.json();
    mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
  } catch (error) {
    console.log(error);
  }
  
}

function mostrarCotizacionHTML(cotizacion){
  limpiarHTML();

  const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE, FROMSYMBOL} = cotizacion;

  // Agregar el símbolo de la Criptomoneda
  const simbolo = document.createElement('p');
  simbolo.classList.add('precio');
  simbolo.innerHTML = `<span>${FROMSYMBOL}</span>`;  

  // Agregar el precio actual
  const precio = document.createElement('p');
  precio.classList.add('precio');
  precio.innerHTML = `El precio es: <span>${PRICE}</span>`;
  
  // Agregar el precio mas alto del día
  const precioAlto = document.createElement('p');
  precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span></p>`;

  // Agregar el precio mas bajo del día
  const precioBajo = document.createElement('p');
  precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span></p>`;

  // Cambio en las últimas horas
  const ultimasHoras = document.createElement('p');
  ultimasHoras.innerHTML = `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`;

  // Última Actualización
  const ultimaActualizacion = document.createElement('p');
  ultimaActualizacion.innerHTML = `<p>Última Actualización: <span>${LASTUPDATE}</span></p>`;


  resultado.appendChild(simbolo);
  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML(){
  while(resultado.firstChild){
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarSpinner(){
  limpiarHTML();

  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  `;

  resultado.appendChild(spinner);
}