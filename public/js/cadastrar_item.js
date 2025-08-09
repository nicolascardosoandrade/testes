document.getElementById("form-cadastrar").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const local = document.getElementById("local").value.trim();
    const data = document.getElementById("data").value;
    const foto = document.getElementById("foto").files[0];

    if (!nome || !descricao || !local || !data) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    alert(`Item "${nome}" cadastrado com sucesso!`);
    this.reset();
});
