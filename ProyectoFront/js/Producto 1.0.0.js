const apiProductos = `${APIURL}/producto`;
const apiCategorias = `${APIURL}/categoria`;

let categoriasCargadas = [];
let productoEnEdicion = null;

function obtenerValor(elemento, nombre) {
  const nombreMayuscula = nombre.charAt(0).toUpperCase() + nombre.slice(1);
  return elemento[nombre] ?? elemento[nombreMayuscula] ?? "";
}

function procesarRespuesta(respuesta) {
  return respuesta.text().then((mensaje) => {
    if (!respuesta.ok) {
      throw new Error(mensaje || `Error HTTP: ${respuesta.status}`);
    }

    return mensaje;
  });
}

function obtenerLista(respuesta, nombreLista) {
  if (!respuesta.ok) {
    return respuesta.text().then((mensaje) => {
      throw new Error(mensaje || `Error HTTP: ${respuesta.status}`);
    });
  }

  return respuesta.json().then((data) => {
    const lista = Array.isArray(data) ? data : data.$values;

    if (!Array.isArray(lista)) {
      throw new Error(`La API no devolvió una lista de ${nombreLista}.`);
    }

    return lista;
  });
}

function cargarCategorias() {
  return fetch(apiCategorias, { headers: { Accept: "application/json" } })
    .then((respuesta) => obtenerLista(respuesta, "categorías"))
    .then((categorias) => {
      categoriasCargadas = categorias;

      ["categoria", "editar-categoria"].forEach((id) => {
        const select = document.getElementById(id);

        categorias.forEach((categoria) => {
          const option = document.createElement("option");
          option.value = obtenerValor(categoria, "categoriaId");
          option.textContent = obtenerValor(categoria, "nombre");
          select.appendChild(option);
        });
      });
    });
}

function obtenerProductos() {
  fetch(apiProductos, { headers: { Accept: "application/json" } })
    .then((respuesta) => obtenerLista(respuesta, "productos"))
    .then(mostrarProductos)
    .catch((error) => {
      console.error("No se pudieron cargar los productos:", error);
    });
}

function mostrarProductos(productos) {
  const tbody = document.getElementById("tabla-productos");
  tbody.innerHTML = "";

  productos.forEach((producto) => {
    const productoId = obtenerValor(producto, "productoId");
    const categoriaId = obtenerValor(producto, "categoriaId");
    const categoria = categoriasCargadas.find(
      (item) =>
        String(obtenerValor(item, "categoriaId")) === String(categoriaId),
    );
    const fila = tbody.insertRow();
    fila.insertCell().textContent = obtenerValor(producto, "nombre");
    fila.insertCell().textContent = obtenerValor(producto, "descripcion");
    fila.insertCell().textContent = obtenerValor(categoria || {}, "nombre");
    fila.insertCell().textContent = obtenerValor(producto, "precioCosto");
    fila.insertCell().textContent = obtenerValor(producto, "precioVenta");
    fila.insertCell().textContent = obtenerValor(producto, "stock");

    const acciones = fila.insertCell();
    acciones.appendChild(
      crearBoton("Editar", "btn btn-sm btn-warning ms-2", () =>
        abrirModalEdicion(producto, productoId),
      ),
    );
    acciones.appendChild(
      crearBoton("Eliminar", "btn btn-sm btn-danger ms-2", () =>
        eliminarProducto(productoId),
      ),
    );
  });
}

function crearBoton(texto, clase, accion) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = clase;
  boton.textContent = texto;
  boton.addEventListener("click", accion);
  return boton;
}

function abrirModalEdicion(producto, productoId) {
  productoEnEdicion = productoId;
  document.getElementById("editar-nombre").value = obtenerValor(
    producto,
    "nombre",
  );
  document.getElementById("editar-descripcion").value = obtenerValor(
    producto,
    "descripcion",
  );
  document.getElementById("editar-categoria").value = obtenerValor(
    producto,
    "categoriaId",
  );
  document.getElementById("editar-precioCosto").value = obtenerValor(
    producto,
    "precioCosto",
  );
  document.getElementById("editar-precioVenta").value = obtenerValor(
    producto,
    "precioVenta",
  );
  document.getElementById("editar-stock").value = obtenerValor(
    producto,
    "stock",
  );

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("modal-editar-producto"),
  ).show();
}

function obtenerDatosProducto(prefijo = "") {
  return {
    nombre: document.getElementById(`${prefijo}nombre`).value.trim(),
    descripcion: document
      .getElementById(`${prefijo}descripcion`)
      .value.trim(),
    categoriaId: Number(
      document.getElementById(`${prefijo}categoria`).value,
    ),
    precioCosto: document
      .getElementById(`${prefijo}precioCosto`)
      .value.trim(),
    precioVenta: document
      .getElementById(`${prefijo}precioVenta`)
      .value.trim(),
    stock: document.getElementById(`${prefijo}stock`).value.trim(),
  };
}

function guardarProducto(event) {
  event.preventDefault();

  fetch(apiProductos, {
    method: "POST",
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obtenerDatosProducto()),
  })
    .then(procesarRespuesta)
    .then(() => {
      document.getElementById("form-producto").reset();
      obtenerProductos();
    })
    .catch((error) => {
      console.error("No se pudo guardar el producto:", error);
      alert(error.message || "No se pudo guardar el producto.");
    });
}

function editarProducto(event) {
  event.preventDefault();

  if (productoEnEdicion === null) {
    return;
  }

  fetch(`${apiProductos}/${productoEnEdicion}`, {
    method: "PUT",
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obtenerDatosProducto("editar-")),
  })
    .then(procesarRespuesta)
    .then(() => {
      bootstrap.Modal.getInstance(
        document.getElementById("modal-editar-producto"),
      ).hide();
      productoEnEdicion = null;
      obtenerProductos();
    })
    .catch((error) => {
      console.error("No se pudo editar el producto:", error);
      alert(error.message || "No se pudo editar el producto.");
    });
}

function eliminarProducto(productoId) {
  if (!confirm("¿Desea eliminar este producto?")) {
    return;
  }

  fetch(`${apiProductos}/${productoId}`, { method: "DELETE" })
    .then(procesarRespuesta)
    .then(obtenerProductos)
    .catch((error) => {
      console.error("No se pudo eliminar el producto:", error);
      alert(error.message || "No se pudo eliminar el producto.");
    });
}

document
  .getElementById("form-producto")
  .addEventListener("submit", guardarProducto);
document
  .getElementById("form-editar-producto")
  .addEventListener("submit", editarProducto);

cargarCategorias()
  .then(obtenerProductos)
  .catch((error) => {
    console.error("No se pudieron cargar las categorías:", error);
  });
