const frontendSeparado = window.location.protocol === "file:" ||
    (window.location.hostname === "localhost" && !["5221", "7146"].includes(window.location.port));

    const API_CATEGORIAS = frontendSeparado
    ? "http://localhost:5221/api/Categoria"
    : "/api/Categoria";

    let categoriaEnEdicion = null;

async function ObtenerCategorias() {
    const tbody = document.getElementById("tabla-categorias");

    if (!tbody) {
        console.error("No existe el elemento #tabla-categorias.");
        return;
    }

    try {
        const respuesta = await fetch(API_CATEGORIAS, {
            headers: { Accept: "application/json" }
        });

        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}: ${await respuesta.text()}`);
        }

        const data = await respuesta.json();
        const productos = Array.isArray(data) ? data : data.$values;

        if (!Array.isArray(productos)) {
            throw new Error("La API no devolvió una lista de categorías.");
        }

        mostrarCategoria(productos);
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}

function obtenerValor(elemento, nombre) {
    return elemento[nombre] ?? elemento[nombre.charAt(0).toUpperCase() + nombre.slice(1)] ?? "";
}

function mostrarCategoria(data) {
    const tbody = document.getElementById("tabla-categorias");

    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";

    data.forEach((element) => {
        const tr = tbody.insertRow();
        const categoriaId = obtenerValor(element, "categoriaId");
        tr.insertCell(0).textContent = obtenerValor(element, "nombre");
        tr.insertCell(1).textContent = obtenerValor(element, "descripcion");
        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.className = "btn btn-sm btn-warning ms-2";
        botonEditar.textContent = "Editar";
        botonEditar.addEventListener("click", () => abrirModalEdicion(element, categoriaId));
        const acciones = tr.insertCell(2);
        acciones.appendChild(botonEditar);

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "btn btn-sm btn-danger ms-2";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", () => eliminarCategoria(categoriaId));
        acciones.appendChild(botonEliminar);
    });
}

function abrirModalEdicion(categoria, categoriaId) {
    categoriaEnEdicion = categoriaId;
    document.getElementById("editar-nombre").value = obtenerValor(categoria, "nombre");
    document.getElementById("editar-descripcion").value = obtenerValor(categoria, "descripcion");

    bootstrap.Modal.getOrCreateInstance(document.getElementById("modal-editar-categoria")).show();
}

async function editarCategoria(event) {
    event.preventDefault();

    if (!categoriaEnEdicion) {
        return;
    }

    const categoria = {
        nombre: document.getElementById("editar-nombre").value.trim(),
        descripcion: document.getElementById("editar-descripcion").value.trim(),
    };

    try {
        const respuesta = await fetch(`${API_CATEGORIAS}/${categoriaEnEdicion}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "text/plain"
            },
            body: JSON.stringify(categoria)
        });

        const mensaje = await respuesta.text();

        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}: ${mensaje}`);
        }

        bootstrap.Modal.getInstance(document.getElementById("modal-editar-categoria")).hide();
        categoriaEnEdicion = null;
        await ObtenerCategorias();
    } catch (error) {
        console.error("Error al editar categoría:", error);
    }
}

async function eliminarCategoria(categoriaId) {
    if (!confirm("¿Desea eliminar esta categoría?")) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_CATEGORIAS}/${categoriaId}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}: ${await respuesta.text()}`);
        }

        await ObtenerCategorias();
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
    }
}




async function guardarCategoria(event) {
    event.preventDefault();


    //llama por id de tabla
    const categoria = {
        nombre: document.getElementById("nombre").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
    };

    try {
        const respuesta = await fetch(API_CATEGORIAS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "text/plain"
            },
            body: JSON.stringify(categoria)
        });

        const mensaje = await respuesta.text();

        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}: ${mensaje}`);
        }

        document.getElementById("form-categoria").reset();
        await ObtenerCategorias();
    } catch (error) {
        console.error("Error al guardar categoría:", error);
    }
}

document.getElementById("form-categoria").addEventListener("submit", guardarCategoria);
document.getElementById("form-editar-categoria").addEventListener("submit", editarCategoria);
ObtenerCategorias();