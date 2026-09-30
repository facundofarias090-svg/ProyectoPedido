const frontendSeparado = window.location.protocol === "file:" ||
	(window.location.hostname === "localhost" && !["5221", "7146"].includes(window.location.port));

const API_PRODUCTOS = frontendSeparado
	? "http://localhost:5221/api/Producto"
	: "/api/Producto";

let detallesPedido = [];

async function obtenerProductos() {
	const productoSeleccionado = document.getElementById("producto");

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

		productos.forEach((producto) => {
			const option = document.createElement("option");
			option.value = producto.productoId ?? producto.ProductoId;
			option.textContent = producto.nombre ?? producto.Nombre;
			option.dataset.precio = producto.precioVenta ?? producto.PrecioVenta ?? "";
			productoSeleccionado.appendChild(option);
		});
	} catch (error) {
		console.error("Error al obtener productos:", error);
	}
}

function cargarPrecio() {
	const producto = document.getElementById("producto");
	const precioInput = document.getElementById("precioUnitario");
	const opcionSeleccionada = producto.options[producto.selectedIndex];

	precioInput.value = producto.value === "" ? "" : opcionSeleccionada.dataset.precio;
}

function AgregarDetalle() {
	const producto = document.getElementById("producto");
	const cantidad = Number(document.getElementById("cantidad").value);
	const precioInput = document.getElementById("precioUnitario");
	const precio = Number(precioInput.value);

	if (producto.value === "" || !Number.isInteger(cantidad) || cantidad <= 0 || precioInput.value === "" || !Number.isFinite(precio)) {
		console.error("Seleccione un producto e indique una cantidad válida.");
		return;
	}

	detallesPedido.push({
		productoID: Number(producto.value),
		nombreProducto: producto.options[producto.selectedIndex].textContent.trim(),
		cantidad: cantidad,
		precioUnitario: precio
	});

	MostrarDetalles();
	document.getElementById("cantidad").value = "";
}

function MostrarDetalles() {
	const tbody = document.getElementById("tablaDetalles");

	if (!tbody) {
		return;
	}

	tbody.innerHTML = "";
	let totalAcumulado = 0;

	detallesPedido.forEach((detalle, index) => {
		const subtotal = detalle.cantidad * detalle.precioUnitario;
		totalAcumulado += subtotal;

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

	document.getElementById("totalPedido").textContent = `$${totalAcumulado.toFixed(2)}`;
}

function EliminarDetalle(index) {
	detallesPedido.splice(index, 1);
	MostrarDetalles();
}

obtenerProductos();
