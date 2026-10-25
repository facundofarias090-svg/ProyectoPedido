const apiCategorias = `${APIURL}/categoria`;

let categoriaEnEdicion = null;

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

function obtenerLista(respuesta) {
  return respuesta.json().then((data) => {
    const categorias = Array.isArray(data) ? data : data.$values;

    if (!Array.isArray(categorias)) {
      throw new Error("La API no devolvió una lista de categorías.");
    }

    return categorias;
  });
}

function obtenerCategorias() {
  fetch(apiCategorias, { headers: { Accept: "application/json" } })
    .then((respuesta) => {
      if (!respuesta.ok) {
        return respuesta.text().then((mensaje) => {
          throw new Error(mensaje || `Error HTTP: ${respuesta.status}`);
        });
      }

      return obtenerLista(respuesta);
    })
    .then(mostrarCategorias)
    .catch((error) => {
      console.error("No se pudieron cargar las categorías:", error);
    });
}

function mostrarCategorias(categorias) {
  const tbody = document.getElementById("tabla-categorias");
  tbody.innerHTML = "";

  categorias.forEach((categoria) => {
    const categoriaId = obtenerValor(categoria, "categoriaId");
    const fila = tbody.insertRow();
    fila.insertCell().textContent = obtenerValor(categoria, "nombre");
    fila.insertCell().textContent = obtenerValor(categoria, "descripcion");

    const acciones = fila.insertCell();
    acciones.appendChild(
      crearBoton("Editar", "btn btn-sm btn-warning ms-2", () =>
        abrirModalEdicion(categoria, categoriaId),
      ),
    );
    acciones.appendChild(
      crearBoton("Eliminar", "btn btn-sm btn-danger ms-2", () =>
        eliminarCategoria(categoriaId),
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

function abrirModalEdicion(categoria, categoriaId) {
  categoriaEnEdicion = categoriaId;
  document.getElementById("editar-nombre").value = obtenerValor(
    categoria,
    "nombre",
  );
  document.getElementById("editar-descripcion").value = obtenerValor(
    categoria,
    "descripcion",
  );

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("modal-editar-categoria"),
  ).show();
}

function guardarCategoria(event) {
  event.preventDefault();

  const categoria = {
    nombre: document.getElementById("nombre").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
  };

  fetch(apiCategorias, {
    method: "POST",
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoria),
  })
    .then(procesarRespuesta)
    .then(() => {
      document.getElementById("form-categoria").reset();
      obtenerCategorias();
    })
    .catch((error) => {
      console.error("No se pudo guardar la categoría:", error);
      alert(error.message || "No se pudo guardar la categoría.");
    });
}

function editarCategoria(event) {
  event.preventDefault();

  if (categoriaEnEdicion === null) {
    return;
  }

  const categoria = {
    nombre: document.getElementById("editar-nombre").value.trim(),
    descripcion: document.getElementById("editar-descripcion").value.trim(),
  };

  fetch(`${apiCategorias}/${categoriaEnEdicion}`, {
    method: "PUT",
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoria),
  })
    .then(procesarRespuesta)
    .then(() => {
      bootstrap.Modal.getInstance(
        document.getElementById("modal-editar-categoria"),
      ).hide();
      categoriaEnEdicion = null;
      obtenerCategorias();
    })
    .catch((error) => {
      console.error("No se pudo editar la categoría:", error);
      alert(error.message || "No se pudo editar la categoría.");
    });
}

function eliminarCategoria(categoriaId) {
  if (!confirm("¿Desea eliminar esta categoría?")) {
    return;
  }

  fetch(`${apiCategorias}/${categoriaId}`, { method: "DELETE" })
    .then(procesarRespuesta)
    .then(obtenerCategorias)
    .catch((error) => {
      console.error("No se pudo eliminar la categoría:", error);
      alert(error.message || "No se pudo eliminar la categoría.");
    });
}

document
  .getElementById("form-categoria")
  .addEventListener("submit", guardarCategoria);
document
  .getElementById("form-editar-categoria")
  .addEventListener("submit", editarCategoria);

obtenerCategorias();
