const lista = document.querySelector('.contenedorDatos')

fetch('./js/datos.json')
    .then((res) => res.json())
    .then((datos) => {
        datos.forEach((producto) => {
            const div = document.createElement('div')
            div.innerHTML = `
            <div class="card shadow mb-1" style="background-color: #46362be0" style="width: 20rem;">
            <h5 class="card-title pt-2 text-center text-light ">${producto.nombre}</h5>
            <img src=${producto.img} class="card-img-top" alt="...">
            <div class="card-body">
                <p class="card-text text-white description">Autor: ${producto.autor}</p>
                <h5 class="text-light">Precio:<span>$</span> <span class="precio"> ${producto.precio}</span></h5>
                
            </div>
        </div>
    </div>
`
            lista.append(div)
        })
    })




let carrito = [];
const tbody = document.querySelector('.tbody')
const btnVaciar = document.querySelector('.vaciarCarrito');
const agregarBtn = document.querySelectorAll('.button');
const btnComprar = document.querySelector('.comprarCarrito')

agregarBtn.forEach(btn => {
    btn.addEventListener('click', agregarAlCarrito)
})

function agregarAlCarrito(e) {

    const button = e.target;
    const item = button.closest('.card');
    const itemTitulo = item.querySelector('.card-title').textContent;
    const itemPrecio = item.querySelector('.precio').textContent;
    const itemImg = item.querySelector('.card-img-top').src;

    const newItem = {
        titulo: itemTitulo,
        precio: parseFloat(itemPrecio),
        img: itemImg,
        cantidad: 1,
    }


    aniadirItemCarrito(newItem);
}

function aniadirItemCarrito(item) {

    const inputElemento = tbody.getElementsByClassName('inputElemento')

    for (let index = 0; index < carrito.length; index++) {
        if (carrito[index].titulo.trim() === item.titulo.trim()) {
            carrito[index].cantidad++;
            const inputValue = inputElemento[index];
            inputValue.value++;
            carritoTotal();
            return null;
        }
    }

    carrito.push(item);
    crearCarrito();
}

function crearCarrito() {
    tbody.innerHTML = '';
    carrito.map(item => {
        const tr = document.createElement('tr');
        tr.classList.add('itemCarrito')
        const Content = `

        <th scope="row" class="text-light text-center">1</th>
                <td class="table__productos pt-3">
                    <img class=" img-thumbnail rounded mx-auto d-block" src=${item.img}>
                    <h6 class="title text-light text-center pt-2">${item.titulo}</h6>
                </td>
                <td class="table__precio text-light pt-3 text-center"><p> $ ${item.precio}</p></td>
                <td class="table__cantidad pt-3 d-flex justify-content-center ">
                    <input  type="number"min="1" value=${item.cantidad} class="text-center inputElemento">
                    <button class="delete btn btn-danger"> X </button>
                </td>

        `
        tr.innerHTML = Content;
        tbody.append(tr);

        tr.querySelector('.delete').addEventListener('click', removerItemCarrito);
        tr.querySelector('.inputElemento').addEventListener('change', sumarCantidad)
    })
    carritoTotal();
}



function carritoTotal() {
    let total = 0;
    const itemCarritoTotal = document.querySelector('.precioCambiar');
    carrito.forEach((item) => {
        const precio = (item.precio)
        total += precio * item.cantidad
    })
    itemCarritoTotal.innerHTML = "$" + total;
    addLocalStorage();
}

function removerItemCarrito(e) {

    const buttonDelete = e.target
    const tr = buttonDelete.closest(".itemCarrito");

    const titulo = tr.querySelector('.title').textContent;
    for (let index = 0; index < carrito.length; index++) {

        if (carrito[index].titulo.trim() === titulo.trim()) {
            carrito.splice(index, 1)
        }
    }

    tr.remove();

    let timerInterval
    Swal.fire({
        title: 'Su producto fue eliminado',
        timer: 750,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    })

    carritoTotal();

}

function sumarCantidad(e) {
    const sumaInput = e.target;
    const tr = sumaInput.closest('.itemCarrito');
    const titulo = tr.querySelector('.title').textContent;
    carrito.forEach(item => {
        if (item.titulo.trim() === titulo) {
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
            item.cantidad = sumaInput.value;
            carritoTotal();
            /* if (sumaInput.value < 1) {
                sumaInput = 1;
            } else {
                item.cantidad = sumaInput.value;
                carritoTotal();

            } */
        }
    })
}

function addLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function () {
    const storage = JSON.parse(localStorage.getItem('carrito'));

    storage && (carrito = storage);
    crearCarrito();
    /* if (storage) {
        carrito = storage;
        crearCarrito();
    } */
}

btnComprar.addEventListener('click',() => {
    Swal.fire({
        title: 'Su compra se realizo con exito',
        timer: 1050,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    })
    tr = document.querySelectorAll("tr");
            carrito = [];
            tbody.innerHTML = '';
            carritoTotal();
})

btnVaciar.addEventListener('click', () => {
    Swal.fire({
        title: '¿Queres eliminar todo los productos?',
        icon: 'warning',
        iconColor: '#DD3333',
        showCancelButton: true,
        confirmButtonColor: '#FFC107',
        cancelButtonColor: '#d33',
        background: '#130b06e0',
        color: '#FFFFFF',
        confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Productos eliminados con exito',
            )
            tr = document.querySelectorAll("tr");
            carrito = [];
            tbody.innerHTML = '';
            carritoTotal();
        }
    })/* 
    tr = document.querySelectorAll("tr");
    carrito = [];
    tbody.innerHTML = '';
    carritoTotal(); */
})

