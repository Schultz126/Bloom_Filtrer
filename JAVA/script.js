window.addEventListener("DOMContentLoaded", () => {
  const flower = document.getElementById("flower");
  setTimeout(() => {
    flower.classList.add("open");
  }, 20);
});

let formulario = document.querySelector('article#calculadora');
// Função auxiliar para colocar mensagens na calculadora
function mostrarAviso(mensagem) {
    // Remove qualquer aviso anterior
    let avisoAntigo = formulario.querySelector('p.warning');
    if (avisoAntigo) {
        avisoAntigo.remove();
    }

    // Cria e adiciona o novo aviso
    let aviso = document.createElement('p');
    aviso.className = 'warning'; // Classe usada para detecções futuras
    aviso.textContent = mensagem;
    aviso.style.color = '#c00';
    formulario.appendChild(aviso);
}
// Função em que serão feitos os cálculos
document.querySelector('input#calculate').addEventListener('click', function(event) {
    event.preventDefault();
    let hashNumberInput = document.querySelector('input#hashNumber'); // k
    let bitsInput = document.querySelector('input#bits'); // m
    let numberOfElementsInput = document.querySelector('input#numberOfElements'); // n
    /*
        ---- Função verificadora dos inputs ----
        Sua principal função será a de retornar um valor 
        diferente para cada possibilidade de input deixados em branco
    */
    function inputBoxesVerifier() {
        let k = hashNumber.value;
        let m = bits.value;
        let n = numberOfElements.value;
        let camposVazios = 0;

        if(k === null || k === "") camposVazios++;
        if(m === null || m === "") camposVazios++;
        if(n === null || n === "") camposVazios++;

        return camposVazios;

    }
    let k = hashNumber.value;
    let m = bits.value;
    let n = numberOfElements.value;
    switch(inputBoxesVerifier()) {
        case 0:
            mostrarAviso("Deixe ao menos UM campo vazio");
            break;
        case 1:
            // Calcular número do hash (k)
            if(k === null || k === "") {
                let m_float = Number.parseFloat(m);
                let n_float = Number.parseFloat(n);
                let k_calc = (m_float / n_float) * Math.log(2);
                hashNumberInput.value = k_calc.toFixed(2);  
            } 
            // calcular a quantidade de bits (m)
            else if(m === null || m === "") {
                let k_float = Number.parseFloat(k);
                let n_float = Number.parseFloat(n);
                let m_calc = (k_float / Math.log(2)) * n_float;
                bitsInput.value = m_calc.toFixed(2);
            }
            // calcular o número de elementos (n)
            else if(n === null || n === "") {
                let k_float = Number.parseFloat(k);
                let m_float = Number.parseFloat(m);
                let n_calc = (m_float / k_float) * Math.log(2);
                numberOfElementsInput.value = n_calc.toFixed(2);
            }
            break;
        case 2:
            mostrarAviso("Preencha pelo menos DOIS campos");
            break;
        case 3:
            mostrarAviso("Deixe somente UM campo vazio");
    }
})
