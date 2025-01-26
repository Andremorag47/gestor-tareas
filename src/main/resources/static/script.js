// Definir la URL base de la API
const apiUrl = 'http://localhost:8080/api/tareas';

// Obtener todas las tareas al cargar la página
window.onload = function () {
    obtenerTareas();
};

// Función para obtener todas las tareas y mostrarlas en la página
function obtenerTareas() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            mostrarTareas(data);
            actualizarProgreso(data); // Actualizar barra de progreso
        })
        .catch(error => console.error('Error al obtener tareas:', error));
}

// Función para mostrar todas las tareas en la página como una tabla
function mostrarTareas(tareas) {
    const tareasList = document.getElementById('tareas-list');
    tareasList.innerHTML = ''; // Limpiar el contenido antes de agregar los nuevos datos

    // Crear tabla
    const table = document.createElement('table');
    table.classList.add('tabla-tareas'); // Clase para estilos

    // Crear encabezados de la tabla
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['ID', 'Título', 'Descripción', 'Completada', 'Acciones'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.innerText = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Crear el cuerpo de la tabla
    const tbody = document.createElement('tbody');
    tareas.forEach(tarea => {
        const row = document.createElement('tr');

        // Crear columnas de la fila
        const tdId = document.createElement('td');
        tdId.innerText = tarea.id;
        const tdTitulo = document.createElement('td');
        tdTitulo.innerText = tarea.titulo;
        const tdDescripcion = document.createElement('td');
        tdDescripcion.innerText = tarea.descripcion;
        const tdCompletada = document.createElement('td');
        tdCompletada.innerText = tarea.completada ? 'Sí' : 'No';
        const tdAcciones = document.createElement('td');

        // Botón de marcar/desmarcar
        const btnMarcar = document.createElement('button');
        btnMarcar.innerText = tarea.completada ? 'Desmarcar' : 'Marcar como completada';
        btnMarcar.classList.add(tarea.completada ? 'btn-desmarcar' : 'btn-marcar');
        btnMarcar.onclick = () => marcarCompletada(tarea.id, tarea.completada);

        // Botón de editar
        const btnEditar = document.createElement('button');
        btnEditar.innerText = 'Editar';
        btnEditar.classList.add('btn-editar');
        btnEditar.onclick = () => editarTarea(tarea.id, tarea.titulo, tarea.descripcion);

        // Botón de eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.innerText = 'Eliminar';
        btnEliminar.classList.add('btn-eliminar');
        btnEliminar.onclick = () => eliminarTarea(tarea.id);

        // Agregar botones a la columna de acciones
        tdAcciones.appendChild(btnMarcar);
        tdAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(btnEliminar);

        // Agregar columnas a la fila
        row.appendChild(tdId);
        row.appendChild(tdTitulo);
        row.appendChild(tdDescripcion);
        row.appendChild(tdCompletada);
        row.appendChild(tdAcciones);

        // Agregar fila al cuerpo de la tabla
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tareasList.appendChild(table);
}

function agregarTarea() {
    const tituloInput = document.getElementById('titulo');
    const descripcionInput = document.getElementById('descripcion');

    const titulo = tituloInput.value.trim(); // Eliminar espacios en blanco
    const descripcion = descripcionInput.value.trim(); // Eliminar espacios en blanco

    if (!titulo || !descripcion) {
        alert('Por favor, complete ambos campos antes de agregar la tarea.');
        return;
    }

    const tarea = {
        titulo: titulo,
        descripcion: descripcion,
        completada: false
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tarea)
    })
    .then(response => response.json())
    .then(() => {
        obtenerTareas(); // Refrescar la lista de tareas
        tituloInput.value = ''; // Limpiar los campos
        descripcionInput.value = '';

        // Mostrar mensaje de éxito
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Tarea agregada exitosamente',
            showConfirmButton: false,
            timer: 1500
        });
    })
    .catch(error => console.error('Error al agregar tarea:', error));
}

// Función para actualizar la barra de progreso circular
function actualizarProgreso(tareas) {
    const completadas = tareas.filter(tarea => tarea.completada).length;
    const total = tareas.length;
    const progreso = total > 0 ? (completadas / total) * 100 : 0;

    // Actualizar porcentaje en el texto del círculo
    document.getElementById('progreso-text').innerText = `${Math.round(progreso)}%`;

    // Actualizar la barra circular
    const circle = document.querySelector('.circle');
    const offset = 440 - (440 * progreso) / 100;
    circle.style.strokeDashoffset = offset;
}

function eliminarTarea(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        obtenerTareas(); // Refrescar la lista de tareas

        // Mostrar mensaje de éxito
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Tarea eliminada exitosamente',
            showConfirmButton: false,
            timer: 1500
        });
    })
    .catch(error => console.error('Error al eliminar tarea:', error));
}


// Función para editar una tarea
function editarTarea(id, tituloActual, descripcionActual) {
    const nuevoTitulo = prompt('Nuevo título de la tarea:', tituloActual);
    const nuevaDescripcion = prompt('Nueva descripción de la tarea:', descripcionActual);

    if (nuevoTitulo && nuevaDescripcion) {
        const tareaActualizada = {
            titulo: nuevoTitulo,
            descripcion: nuevaDescripcion
        };

        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tareaActualizada)
        })
        .then(() => {
            obtenerTareas(); // Refrescar la lista de tareas después de editar
        })
        .catch(error => console.error('Error al editar tarea:', error));
    }
}

// Función para marcar o desmarcar una tarea como completada
function marcarCompletada(id, completadaActual) {
    // Obtener la tarea actual desde el backend
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(tarea => {
            // Actualizar el estado de completada
            tarea.completada = !completadaActual;

            // Enviar la tarea actualizada al backend
            fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tarea)
            })
            .then(() => {
                obtenerTareas(); // Refrescar la lista de tareas
            })
            .catch(error => console.error('Error al marcar/desmarcar tarea:', error));
        })
        .catch(error => console.error('Error al obtener la tarea para marcar/desmarcar:', error));
}
