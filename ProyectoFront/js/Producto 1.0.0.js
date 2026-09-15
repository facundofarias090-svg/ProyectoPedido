const frontendSeparado = window.location.protocol === "file:" ||
    (window.location.hostname === "localhost" && !["5221", "7146"].includes(window.location.port));

    const API_PRODUCTOS = frontendSeparado
    ? "http://localhost:5221/api/Producto"
    : "/api/Producto";

    let productoEnEdicion = null;

async function ObtenerProductos() {
    const tbody = document.getElementById("tabla-productos");

    if (!tbody) {
        console.error("No existe el elemento #tabla-productos.");
        return;
    }

    try {
        const respuesta = await fetch(API_PRODUCTOS, {
            headers: { Accept: "application/json" }
        });

        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}: ${await respuesta.text()}`);
        }

        const data = await respuesta.json();
        const productos = Array.isArray(data) ? data : data.$values;

        if (!Array.isArray(productos)) {
            throw new Error("La API no devolvió una lista de productos.");
        }

        mostrarProducto(productos);
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

function obtenerValor(elemento, nombre) {
    return elemento[nombre] ?? elemento[nombre.charAt(0).toUpperCase() + nombre.slice(1)] ?? "";
}

function mostrarProducto(data) {
    const tbody = document.getElementById("tabla-productos");

    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";

    data.forEach((element) => {
        const tr = tbody.insertRow();
        const productoId = obtenerValor(element, "productoId");
        tr.insertCell(0).textContent = obtenerValor(element, "nombre");
        tr.insertCell(1).textContent = obtenerValor(element, "descripcion");
        tr.insertCell(2).textContent = obtenerValor(element, "precioCosto");
        tr.insertCell(3).textContent = obtenerValor(element, "precioVenta");
        const stock = tr.insertCell(4);
        stock.textContent = obtenerValor(element, "stock");
        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.className = "btn btn-sm btn-warning ms-2";
        botonEditar.textContent = "Editar";
        botonEditar.addEventListener("click", () => abrirModalEdicion(element, productoId));
        stock.appendChild(botonEditar);
    });
}

function abrirModalEdicion(producto, productoId) {
    productoEnEdicion = productoId;
    document.getElementById("editar-nombre").value = obtenerValor(producto, "nombre");
    document.getElementById("editar-descripcion").value = obtenerValor(producto, "descripcion");
    document.getElementById("editar-precioCosto").value = obtenerValor(producto, "precioCosto");
    document.getElementById("editar-precioVenta").value = obtenerValor(producto, "precioVenta");
    document.getElementById("editar-stock").value = obtenerValor(producto, "stock");

    bootstrap.Modal.getOrCreateInstance(document.getElementById("modal-editar-producto")).show();
}

async function editarProducto(event) {
    event.preventDefault();

    if (!productoEnEdicion) {
        return;
    }

    const producto = {
        nombre: document.getElementById("editar-nombre").value.trim(),
        descripcion: document.getElementById("editar-descripcion").value.trim(),
        precioCosto: document.getElementById("editar-precioCosto").value.trim(),
        precioVenta: document.getElementById("editar-precioVenta").value.trim(),
        stock: document.getElementById("editar-stock").value.trim()
    };

    try {
        const respuesta = await fetch(`${API_PRODUCTOS}/${productoEnEdicion}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "text/plain"
            },
            body: JSON.stringify(producto)
        });

        const mensaje = await respuesta.text();

        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}: ${mensaje}`);
        }

        bootstrap.Modal.getInstance(document.getElementById("modal-editar-producto")).hide();
        productoEnEdicion = null;
        await ObtenerProductos();
    } catch (error) {
        console.error("Error al editar producto:", error);
    }
}




async function guardarProducto(event) {
    event.preventDefault();


    //llama por id de tabla
    const producto = {
        nombre: document.getElementById("nombre").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        precioCosto: document.getElementById("precioCosto").value.trim(),
        precioVenta: document.getElementById("precioVenta").value.trim(),
        stock: document.getElementById("stock").value.trim()
    };

    try {
        const respuesta = await fetch(API_PRODUCTOS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "text/plain"
            },
            body: JSON.stringify(producto)
        });

        const mensaje = await respuesta.text();

        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}: ${mensaje}`);
        }

        document.getElementById("form-producto").reset();
        await ObtenerProductos();
    } catch (error) {
        console.error("Error al guardar producto:", error);
    }
}

document.getElementById("form-producto").addEventListener("submit", guardarProducto);
document.getElementById("form-editar-producto").addEventListener("submit", editarProducto);
ObtenerProductos();