// Función para mostrar la fecha actual
function setCurrentDate(daysToAdd = 0) {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    const dateInput = document.getElementById('dateInput');
    dateInput.value = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

let currentDayOffset = 0;
setCurrentDate(currentDayOffset);

// Función para cambiar la fecha al día siguiente
document.getElementById('nextDayBtn').addEventListener('click', function() {
    currentDayOffset++;
    setCurrentDate(currentDayOffset);
});

// Función para cambiar la fecha al día anterior
document.getElementById('prevDayBtn').addEventListener('click', function() {
    currentDayOffset--;
    setCurrentDate(currentDayOffset);
});

// Función para crear una nueva hoja
document.getElementById('createSheetBtn').addEventListener('click', function() {
    const sheetName = prompt("Nombre de la nueva hoja (Por defecto: Fecha Actual)", document.getElementById('dateInput').value);
    if (sheetName) {
        const sheetSelector = document.getElementById('sheetSelector');
        const newOption = document.createElement('option');
        newOption.text = sheetName;
        newOption.value = sheetName;
        sheetSelector.add(newOption);

        // Restablecer la tabla a una sola línea por defecto
        const tbody = document.querySelector('#gestionTable tbody');
        tbody.innerHTML = ''; // Limpiar filas existentes

        // Crear una sola línea por defecto
        const defaultRow = createDefaultRow();
        tbody.appendChild(defaultRow);

        saveSheet(sheetName);
        alert('Hoja creada con éxito.');
    }
});

// Función para crear una fila por defecto
function createDefaultRow() {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><select>
            <option value="Seleccionar">Seleccionar</option>
            <option value="Boletín">Boletín</option>
            <option value="Diseño">Diseño</option>
            <option value="Reel">Reel</option>
            <option value="Video">Video</option>
            <option value="En Vivo">En Vivo</option>
        </select></td>
        <td><input type="text" value="07:00 a.m." readonly></td>
        <td><textarea class="resumen-aprobado" placeholder="Escribe aquí el resumen..."></textarea>
            <div class="icon-buttons">
                <button title="Ver más">&#x25BC;</button>
                <button title="Copiar">C</button>
                <button title="Pegar">P</button>
            </div>
        </td>
        <td><textarea class="copy-aprobado" placeholder="Escribe aquí el copy aprobado..."></textarea>
            <div class="icon-buttons">
                <button title="Ver más">&#x25BC;</button>
                <button title="Copiar">C</button>
                <button title="Pegar">P</button>
            </div>
        </td>
        <td class="social-icons">
            <input type="checkbox" id="alcaldia">
            <label for="alcaldia">A</label>
            <input type="checkbox" id="lacapital">
            <label for="lacapital">LC</label>
            <input type="checkbox" id="jp">
            <label for="jp">JP</label>
        </td>
        <td><select>
            <option value="Publicado">Publicado</option>
            <option value="En espera">En espera</option>
            <option value="Programado">Programado</option>
            <option value="En revisión">En revisión</option>
        </select></td>
    `;
    return newRow;
}

// Función para guardar una hoja
document.getElementById('saveSheetBtn').addEventListener('click', function() {
    const sheetSelector = document.getElementById('sheetSelector');
    if (sheetSelector.value !== "") {
        saveSheet(sheetSelector.value);
        alert('Hoja guardada con éxito.');
    } else {
        alert('Selecciona una hoja para guardar.');
    }
});

// Guardar hoja en LocalStorage
function saveSheet(sheetName) {
    const rows = [];
    document.querySelectorAll('#gestionTable tbody tr').forEach(tr => {
        const rowData = {
            categoria: tr.querySelector('select').value,
            hora: tr.querySelector('input[type="text"]').value,
            resumen: tr.querySelector('.resumen-aprobado').value,
            copy: tr.querySelector('.copy-aprobado').value,
            redes: [
                tr.querySelector('#alcaldia').checked,
                tr.querySelector('#lacapital').checked,
                tr.querySelector('#jp').checked
            ],
            estado: tr.querySelector('select:last-of-type').value
        };
        rows.push(rowData);
    });
    localStorage.setItem(sheetName, JSON.stringify(rows));
}

// Cargar hojas desde el selector
function loadSheet(sheetName) {
    const rows = JSON.parse(localStorage.getItem(sheetName));
    if (rows) {
        const tbody = document.querySelector('#gestionTable tbody');
        tbody.innerHTML = ''; // Limpiar filas existentes
        rows.forEach(rowData => {
            const newRow = createDefaultRow();
            newRow.querySelector('select').value = rowData.categoria;
            newRow.querySelector('input[type="text"]').value = rowData.hora;
            newRow.querySelector('.resumen-aprobado').value = rowData.resumen;
            newRow.querySelector('.copy-aprobado').value = rowData.copy;
            newRow.querySelector('#alcaldia').checked = rowData.redes[0];
            newRow.querySelector('#lacapital').checked = rowData.redes[1];
            newRow.querySelector('#jp').checked = rowData.redes[2];
            newRow.querySelector('select:last-of-type').value = rowData.estado;
            tbody.appendChild(newRow);
        });
    }
}

// Cargar una hoja seleccionada
document.getElementById('sheetSelector').addEventListener('change', function() {
    const selectedSheet = this.value;
    if (selectedSheet) {
        loadSheet(selectedSheet);
    }
});

// Función para editar el nombre de la hoja
document.getElementById('editSheetBtn').addEventListener('click', function() {
    const sheetSelector = document.getElementById('sheetSelector');
    if (sheetSelector.value !== "") {
        const newName = prompt('Nuevo nombre para la hoja:', sheetSelector.value);
        if (newName) {
            const oldName = sheetSelector.value;
            sheetSelector.options[sheetSelector.selectedIndex].text = newName;
            sheetSelector.options[sheetSelector.selectedIndex].value = newName;
            localStorage.setItem(newName, localStorage.getItem(oldName));
            localStorage.removeItem(oldName);
            alert('Hoja renombrada.');
        }
    } else {
        alert('Selecciona una hoja para editar.');
    }
});

// Función para borrar una hoja
document.getElementById('deleteBtn').addEventListener('click', function() {
    const sheetSelector = document.getElementById('sheetSelector');
    if (sheetSelector.value !== "") {
        const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta hoja?');
        if (confirmDelete) {
            localStorage.removeItem(sheetSelector.value);
            sheetSelector.remove(sheetSelector.selectedIndex);
            alert('Hoja eliminada.');
        }
    } else {
        alert('Selecciona una hoja para eliminar.');
    }
});

// Función para agregar nueva fila
document.getElementById('addRowBtn').addEventListener('click', function() {
    const tableBody = document.querySelector('#gestionTable tbody');
    const lastRow = tableBody.querySelector('tr:last-child'); // Seleccionamos la última fila
    const newRow = lastRow.cloneNode(true); // Clonamos la última fila

    // Obtener la hora de la última fila
    const lastTime = lastRow.querySelector('input[type="text"]').value;
    const nextTime = getNextHour(lastTime); // Calcular la próxima hora

    // Asignar la próxima hora a la nueva fila
    newRow.querySelector('input[type="text"]').value = nextTime;

    // Limpiar los campos de texto y los checkboxes
    newRow.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
    newRow.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
    newRow.querySelector('select').value = 'Seleccionar';

    // Insertar la nueva fila en la tabla
    tableBody.appendChild(newRow);
});

// Función para obtener la próxima hora en formato AM/PM
function getNextHour(lastHour) {
    const [time, period] = lastHour.split(" ");
    let [hour, minute] = time.split(":");
    hour = parseInt(hour);
    
    // Cambiar el formato AM/PM
    if (hour === 12) {
        if (period === "a.m.") {
            period = "p.m.";
        } else {
            period = "a.m.";
        }
    } else {
        hour += 1;
    }

    if (hour === 13) hour = 1; // Volver a 1 después de las 12

    return `${hour.toString().padStart(2, '0')}:${minute} ${period}`;
}

// Función para exportar la hoja seleccionada como PDF o JPG
document.getElementById('exportBtn').addEventListener('click', function() {
    const format = prompt("¿En qué formato deseas exportar la hoja? (PDF o JPG)", "PDF");

    if (!format) return;

    if (format.toLowerCase() === 'pdf') {
        exportToPDF();
    } else if (format.toLowerCase() === 'jpg') {
        exportToJPG();
    } else {
        alert('Formato no reconocido. Inténtalo de nuevo.');
    }
});

// Función para exportar a PDF
function exportToPDF() {
    const tableWrapper = document.getElementById('gestionTable');
    const sheetName = document.getElementById('sheetSelector').value || 'Hoja_Sin_Nombre';

    html2canvas(tableWrapper).then(function(canvas) {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('landscape');
        pdf.addImage(imgData, 'JPEG', 10, 10, 280, 150);
        pdf.save(`${sheetName}.pdf`);
    });
}

// Función para exportar a JPG
function exportToJPG() {
    const tableWrapper = document.getElementById('gestionTable');
    const sheetName = document.getElementById('sheetSelector').value || 'Hoja_Sin_Nombre';

    html2canvas(tableWrapper).then(function(canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 1.0);
        link.download = `${sheetName}.jpg`;
        link.click();
    });
}

// Función para expandir el área de texto ("Ver más")
document.querySelectorAll('.icon-buttons button[title="Ver más"]').forEach(button => {
    button.addEventListener('click', function() {
        const textarea = this.closest('td').querySelector('textarea');
        textarea.style.height = textarea.style.height === '5em' ? '10em' : '5em';
    });
});

// Función para copiar el contenido del área de texto
document.querySelectorAll('.icon-buttons button[title="Copiar"]').forEach(button => {
    button.addEventListener('click', function() {
        const textarea = this.closest('td').querySelector('textarea');
        navigator.clipboard.writeText(textarea.value).then(() => {
            alert("Contenido copiado");
        }).catch(err => {
            console.error("Error al copiar el texto: ", err);
        });
    });
});

// Función para pegar el contenido del portapapeles en el área de texto
document.querySelectorAll('.icon-buttons button[title="Pegar"]').forEach(button => {
    button.addEventListener('click', function() {
        const textarea = this.closest('td').querySelector('textarea');
        navigator.clipboard.readText().then(text => {
            textarea.value = text;
        }).catch(err => {
            console.error("Error al pegar el texto: ", err);
        });
    });
});
