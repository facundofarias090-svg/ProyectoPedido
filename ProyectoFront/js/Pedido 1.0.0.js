const apiProductos = `${APIURL}/producto`;

let detallesPedido = [];

function obtenerValor(elemento, nombre) {
  const nombreMayuscula = nombre.charAt(0).toUpperCase() + nombre.slice(1);
  return elemento[nombre] ?? elemento[nombreMayuscula] ?? "";
}

function obtenerProductos() {
  const selector = document.getElementById("producto");

  fetch(apiProductos, { headers: { Accept: "application/json" } })
    .then((respuesta) => {
      if (!respuesta.ok) {
        return respuesta.text().then((mensaje) => {
          throw new Error(mensaje || `Error HTTP: ${respuesta.status}`);
        });
      }

      return respuesta.json();
    })
    .then((data) => {
      const productos = Array.isArray(data) ? data : data.$values;

      if (!Array.isArray(productos)) {
        throw new Error("La API no devolvió una lista de productos.");
      }

      productos.forEach((producto) => {
        const option = document.createElement("option");
        option.value = obtenerValor(producto, "productoId");
        option.textContent = obtenerValor(producto, "nombre");
        option.dataset.precio = obtenerValor(producto, "precioVenta");
        selector.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("No se pudieron cargar los productos:", error);
    });
}

function cargarPrecio() {
  const selector = document.getElementById("producto");
  const opcion = selector.options[selector.selectedIndex];
  document.getElementById("precioUnitario").value =
    selector.value === "" ? "" : opcion.dataset.precio;
}

function AgregarDetalle() {
  const selector = document.getElementById("producto");
  const cantidad = Number(document.getElementById("cantidad").value);
  const precioInput = document.getElementById("precioUnitario");
  const precio = Number(precioInput.value);

  if (
    selector.value === "" ||
    !Number.isInteger(cantidad) ||
    cantidad <= 0 ||
    precioInput.value === "" ||
    !Number.isFinite(precio)
  ) {
    console.error("Seleccione un producto e indique una cantidad válida.");
    return;
  }

  detallesPedido.push({
    productoID: Number(selector.value),
    nombreProducto: selector.options[selector.selectedIndex].textContent.trim(),
    cantidad,
    precioUnitario: precio,
  });

  MostrarDetalles();
  document.getElementById("cantidad").value = "";
}

function MostrarDetalles() {
  const tbody = document.getElementById("tablaDetalles");
  tbody.innerHTML = "";

  const total = detallesPedido.reduce(
    (acumulado, detalle) =>
      acumulado + detalle.cantidad * detalle.precioUnitario,
    0,
  );

  detallesPedido.forEach((detalle, index) => {
    const subtotal = detalle.cantidad * detalle.precioUnitario;
    const fila = tbody.insertRow();
    fila.insertCell().textContent = detalle.nombreProducto;
    fila.insertCell().textContent = detalle.cantidad;
    fila.insertCell().textContent = `$${detalle.precioUnitario.toFixed(2)}`;
    fila.insertCell().textContent = `$${subtotal.toFixed(2)}`;

    const celdaEliminar = fila.insertCell();
    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "btn btn-danger btn-sm";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", () => EliminarDetalle(index));
    celdaEliminar.appendChild(botonEliminar);
  });

  document.getElementById("totalPedido").textContent = `$${total.toFixed(2)}`;
}

function EliminarDetalle(index) {
  detallesPedido.splice(index, 1);
  MostrarDetalles();
}

obtenerProductos();
