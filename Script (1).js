// Obtener referencias a elementos del DOM
const carrito = document.getElementById('carrito');
const totalElement = document.getElementById('total');
let total = 0;
let productosEnCarrito = {};  // Objeto para almacenar productos en el carrito

// Manejar evento de clic en los botones "Agregar al carrito"
document.querySelectorAll('.btn-agregar').forEach(button => {
    button.addEventListener('click', () => {
        // Obtener los datos del producto
        const id = button.getAttribute('data-id');
        const nombre = button.getAttribute('data-nombre');
        const precio = parseFloat(button.getAttribute('data-precio'));
        const stock = parseInt(button.getAttribute('data-stock'));

        // Obtener la cantidad seleccionada por el usuario
        const cantidadSeleccionada = parseInt(button.previousElementSibling.value);

        // Validar la cantidad seleccionada
        if (isNaN(cantidadSeleccionada) || cantidadSeleccionada <= 0 || cantidadSeleccionada > stock) {
            alert('Por favor, ingrese una cantidad válida.');
            return;
        }

        // Verificar si el producto ya está en el carrito
        if (productosEnCarrito[id]) {
            // Si está en el carrito, actualizar la cantidad y el precio
            productosEnCarrito[id].cantidad += cantidadSeleccionada;
            productosEnCarrito[id].total += precio * cantidadSeleccionada;
        } else {
            // Si no está en el carrito, agregarlo
            productosEnCarrito[id] = {
                nombre: nombre,
                cantidad: cantidadSeleccionada,
                total: precio * cantidadSeleccionada
            };
        }

        // Actualizar el total
        total += precio * cantidadSeleccionada;
        totalElement.textContent = total.toFixed(2);

        // Reducir la cantidad disponible
        const cantidadDisponibleElement = button.parentElement.querySelector('.cantidad-disponible');
        const nuevaCantidadDisponible = stock - cantidadSeleccionada;
        cantidadDisponibleElement.textContent = nuevaCantidadDisponible;

        // Actualizar el stock en el botón
        button.setAttribute('data-stock', nuevaCantidadDisponible);

        // Renderizar el carrito actualizado
        renderizarCarrito();
    });
});

// Función para renderizar el carrito en el DOM
function renderizarCarrito() {
    // Limpiar el carrito
    carrito.innerHTML = '';

    // Agregar cada producto en el carrito al DOM
    Object.keys(productosEnCarrito).forEach(id => {
        const producto = productosEnCarrito[id];
        const itemCarrito = document.createElement('li');
        itemCarrito.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        itemCarrito.innerHTML = `
            ${producto.nombre} x${producto.cantidad} - $${producto.total.toFixed(2)}
            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${id}">Eliminar</button>
        `;
        carrito.appendChild(itemCarrito);
    });

    // Manejar evento de clic en los botones "Eliminar"
    document.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            eliminarProducto(id);
        });
    });
}

// Función para eliminar un producto del carrito
function eliminarProducto(id) {
    const producto = productosEnCarrito[id];
    
    // Actualizar el total restando el producto eliminado
    total -= producto.total;
    totalElement.textContent = total.toFixed(2);

    // Restaurar la cantidad disponible
    const buttonAgregar = document.querySelector(`.btn-agregar[data-id='${id}']`);
    const stock = parseInt(buttonAgregar.getAttribute('data-stock'));
    const nuevaCantidadDisponible = stock + producto.cantidad;
    buttonAgregar.setAttribute('data-stock', nuevaCantidadDisponible);
    buttonAgregar.parentElement.querySelector('.cantidad-disponible').textContent = nuevaCantidadDisponible;

    // Eliminar el producto del carrito
    delete productosEnCarrito[id];

    // Renderizar el carrito actualizado
    renderizarCarrito();
}

