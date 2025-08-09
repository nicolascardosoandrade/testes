document.addEventListener("DOMContentLoaded", () => {
    const recordsList = document.getElementById("recordsList");

    // Simulação de dados (pode vir do banco)
    const registros = [
        { id: 1, titulo: "Carteira preta perdida", data: "05/08/2025", status: "Pendente" },
        { id: 2, titulo: "Chaveiro encontrado", data: "03/08/2025", status: "Resolvido" }
    ];

    if (registros.length > 0) {
        registros.forEach(r => {
            const item = document.createElement("div");
            item.classList.add("record-item");
            item.innerHTML = `
                <h3>${r.titulo}</h3>
                <p>Data: ${r.data}</p>
                <span>Status: ${r.status}</span>
            `;
            recordsList.appendChild(item);
        });
    } else {
        recordsList.innerHTML = "<p>Nenhum registro encontrado.</p>";
    }
});
