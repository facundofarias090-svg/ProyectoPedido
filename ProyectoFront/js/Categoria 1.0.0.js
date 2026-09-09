const API_URL = '/api/Categoria';

const categoryForm = document.querySelector('#category-form');
const categoryName = document.querySelector('#category-name');
const submitButton = document.querySelector('#submit-button');
const refreshButton = document.querySelector('#refresh-button');
const tableBody = document.querySelector('#category-table-body');
const emptyState = document.querySelector('#empty-state');
const feedback = document.querySelector('#feedback');
const categorySummary = document.querySelector('#category-summary');

function showFeedback(message, type = 'danger') {
	feedback.textContent = message;
	feedback.className = `alert alert-${type}`;
}

function clearFeedback() {
	feedback.textContent = '';
	feedback.className = 'alert d-none';
}

function renderCategories(categories) {
	tableBody.innerHTML = categories.map(category => `
		<tr>
			<td>${category.categoriaId}</td>
			<td class="fw-semibold">${category.nombre ?? ''}</td>
		</tr>
	`).join('');

	emptyState.classList.toggle('d-none', categories.length > 0);
	categorySummary.textContent = `${categories.length} ${categories.length === 1 ? 'categoría encontrada' : 'categorías encontradas'}`;
}

async function loadCategories() {
	clearFeedback();
	refreshButton.disabled = true;
	categorySummary.textContent = 'Cargando categorías...';

	try {
		const response = await fetch(API_URL);
		if (!response.ok) {
			throw new Error('No se pudieron obtener las categorías.');
		}

		const categories = await response.json();
		renderCategories(categories);
	} catch (error) {
		tableBody.innerHTML = '';
		emptyState.classList.add('d-none');
		categorySummary.textContent = 'No se pudo cargar el listado';
		showFeedback(`${error.message} Verificá que la API esté ejecutándose.`);
	} finally {
		refreshButton.disabled = false;
	}
}

categoryForm.addEventListener('submit', async event => {
	event.preventDefault();
	clearFeedback();

	const nombre = categoryName.value.trim();
	if (!nombre) {
		showFeedback('Ingresá un nombre para la categoría.');
		return;
	}

	submitButton.disabled = true;
	submitButton.textContent = 'Guardando...';

	try {
		const response = await fetch(API_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ nombre })
		});

		if (!response.ok) {
			throw new Error('No se pudo guardar la categoría.');
		}

		categoryForm.reset();
		showFeedback('Categoría creada correctamente.', 'success');
		await loadCategories();
	} catch (error) {
		showFeedback(`${error.message} Verificá que la API esté ejecutándose.`);
	} finally {
		submitButton.disabled = false;
		submitButton.textContent = 'Guardar categoría';
	}
});

refreshButton.addEventListener('click', loadCategories);
loadCategories();
