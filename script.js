// Base de datos nutricional (valores reales de tu primera imagen)
const baseNutricional = [
    { id: "avena", nombre: "Heno de avena", pt: 8.0, fdn: 63.0, precio: 0.60, inicial: 40.0 },
    { id: "haba", nombre: "Broza de haba", pt: 9.6, fdn: 62.8, precio: 0.10, inicial: 10.0 },
    { id: "maiz", nombre: "Maíz amarillo", pt: 9.8, fdn: 10.8, precio: 1.00, inicial: 10.0 },
    { id: "afrecho", nombre: "Afrecho de trigo (SPT)", pt: 15.0, fdn: 42.8, precio: 1.30, inicial: 10.0 },
    { id: "polvillo", nombre: "Polvillo de arroz", pt: 14.4, fdn: 33.0, precio: 1.00, inicial: 10.0 },
    { id: "soya", nombre: "Torta de soya", pt: 44.0, fdn: 14.9, precio: 2.15, inicial: 16.0 },
    { id: "soyaintegral", nombre: "Harina integral de soya", pt: 38.0, fdn: 22.0, precio: 2.22, inicial: 6.0},
    { id: "melaza", nombre: "Melaza", pt: 5.8, fdn: 1.0, precio: 2.0, inicial: 0},
    { id: "sal", nombre: "Sal común", pt: 0.0, fdn: 0.0, precio: 0.20, inicial: 0.5 },
    { id: "rocsalfos", nombre: "Rocsalfos", pt: 0.0, fdn: 0.0, precio: 2.10, inicial: 0.5 },
];

const tbody = document.getElementById("tabla-insumos");

// Generación de las filas de la tabla de forma automática al cargar la web
baseNutricional.forEach(insumo => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><strong>${insumo.nombre}</strong></td>
        <td><input type="number" id="input-${insumo.id}" value="${insumo.inicial}" step="0.1" min="0" oninput="calcularRacion()"></td>
        <td id="pt-${insumo.id}">0.00%</td>
        <td id="fdn-${insumo.id}">0.00%</td>
        <td id="precio-${insumo.id}">S/. 0.00</td>
    `;
    tbody.appendChild(tr);
});

// Función matemática de cálculo automático
function calcularRacion() {
    let totalKilos = 0;
    let aportePTTotal = 0;
    let aporteFDNTotal = 0;
    let costoTotalMezcla = 0;

    // Calcular la sumatoria de kilos ingresados por el usuario
    baseNutricional.forEach(insumo => {
        const kilosInput = parseFloat(document.getElementById(`input-${insumo.id}`).value) || 0;
        totalKilos += kilosInput;
    });

    const divisor = totalKilos > 0 ? totalKilos : 100;

    // Calcular y renderizar los porcentajes nutricionales de cada fila
    baseNutricional.forEach(insumo => {
        const kilos = parseFloat(document.getElementById(`input-${insumo.id}`).value) || 0;
        
        const aportePT = (kilos / divisor) * insumo.pt;
        const aporteFDN = (kilos / divisor) * insumo.fdn;
        const costoFila = kilos * insumo.precio;

        document.getElementById(`pt-${insumo.id}`).innerText = `${aportePT.toFixed(2)}%`;
        document.getElementById(`fdn-${insumo.id}`).innerText = `${aporteFDN.toFixed(2)}%`;
        document.getElementById(`precio-${insumo.id}`).innerText = `S/. ${costoFila.toFixed(2)}`;

        aportePTTotal += aportePT;
        aporteFDNTotal += aporteFDN;
        costoTotalMezcla += costoFila;
    });

    const precioPorKilo = totalKilos > 0 ? (costoTotalMezcla / totalKilos) : 0;

    // Actualizar las tarjetas de resumen final en la pantalla
    document.getElementById("total-peso").innerText = `${totalKilos.toFixed(2)} kg`;
    document.getElementById("total-pt").innerText = `${aportePTTotal.toFixed(2)}%`;
    document.getElementById("total-fdn").innerText = `${aporteFDNTotal.toFixed(2)}%`;
    document.getElementById("total-precio").innerText = `S/. ${precioPorKilo.toFixed(2)}`;

    // Validación visual de Peso (Suma 100 kg)
    const statusPeso = document.getElementById("status-peso");
    if (Math.abs(totalKilos - 100) < 0.05) {
        statusPeso.innerText = "¡Mezcla de 100kg exacta!";
        statusPeso.className = "status cumple";
    } else {
        statusPeso.innerText = `Ajusta para sumar 100kg`;
        statusPeso.className = "status no-cumple";
    }

    // Validación visual de Proteína Mínima (15.00%)
    const statusPT = document.getElementById("status-pt");
    if (aportePTTotal >= 15.0) {
        statusPT.innerText = "✓ Cumple Requerimiento (15%)";
        statusPT.className = "status cumple";
    } else {
        statusPT.innerText = "✗ Falta proteína (< 15%)";
        statusPT.className = "status no-cumple";
    }

        // Validación visual dinámica de la Salud del Rumen (FDN)
    const statusFDN = document.getElementById("status-fdn");
    if (aporteFDNTotal < 33.0) {
        statusFDN.innerText = "⚠ Alerta: ¡Riesgo de Acidosis! FDN muy bajo";
        statusFDN.className = "status no-cumple";
    } else if (aporteFDNTotal > 40.0) {
        statusFDN.innerText = "⚠ Alerta: Alimento muy fibroso / Engorde lento";
        statusFDN.classNamse = "status no-cumple";
    } else {
        statusFDN.innerText = "✓ Rumen Sano e Ideal";
        statusFDN.className = "status cumple";
    }

}

// Inicializar el primer cálculo al abrir la aplicación
calcularRacion();
