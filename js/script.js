// Función para mostrar la fecha actual
function setCurrentDate(daysToAdd = 0) {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    const day = today.toLocaleDateString('es-ES', { weekday: 'long' });
    const date = today.getDate();
    const year = today.getFullYear();
    const month = today.toLocaleDateString('es-ES', { month: 'long' });

    const formattedDate = `${day}, ${date} de ${month} del ${year}`;
    document.getElementById('date-title').innerHTML = formattedDate;
}

let currentDayOffset = 0;
setCurrentDate(currentDayOffset);

// Función para cambiar la fecha al día siguiente
document.getElementById('nextDayBtn').addEventListener('click', function() {
    currentDayOffset++;
    setCurrentDate(currentDayOffset);
});

// Función para borrar la tabla con confirmación
document.getElementById('deleteBtn').addEventListener('click', function() {
    const password = prompt('Por favor, escribe la clave para eliminar:');
    if (password === 'alexander') {
        document.getElementById('gestionTable').remove();
        alert('Tabla eliminada correctamente.');
    } else {
        alert('Clave incorrecta. No se ha eliminado la tabla.');
    }
});

// Función para agregar nueva fila
document.getElementById('addRowBtn').addEventListener('click', function() {
    const tableWrapper = document.querySelector('tbody');
    const newRow = document.querySelector('tbody tr').cloneNode(true);
    const lastTimeInput = tableWrapper.querySelector('tr:first-child input[type="text"]').value;
    const nextTime = getNextHour(lastTimeInput); // Obtener la próxima hora
    newRow.querySelector('input[type="text"]').value = nextTime;
    newRow.querySelectorAll('input, textarea').forEach(input => {
        if (input.type !== 'text') input.value = ''; // Limpiar textos excepto la hora
    });
    tableWrapper.insertBefore(newRow, tableWrapper.firstChild); // Insertar por encima
});

// Función para obtener la próxima hora
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

// Función para exportar la tabla como JPG usando html2canvas
document.getElementById('exportBtn').addEventListener('click', function() {
    var tableWrapper = document.getElementById('gestionTable');
    
    html2canvas(tableWrapper).then(function(canvas) {
        var link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 1.0);
        link.download = 'tabla_gestion_comunicacion.jpg';
        link.click();
    });
});