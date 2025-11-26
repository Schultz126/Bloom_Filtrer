// Variável global para controlar o tamanho do vetor
var tamanhoDoVetor = 32;
/**
 * 1. DJB2 Hash
 * Criado por Daniel J. Bernstein. É uma das funções de hash mais populares
 * pela sua simplicidade e boa distribuição. Usa o número mágico 5381 e multiplicação por 33.
 */
function hash1(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        // A operação ((hash << 5) + hash) é o mesmo que hash * 33
        // Usamos charCodeAt para pegar o valor numérico do caractere
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    // O operador >>> 0 força o JS a tratar o resultado como um inteiro de 32 bits não assinado (positivo)
    return hash >>> 0; 
}

/**
 * 2. FNV-1a (Fowler–Noll–Vo) Hash
 * Conhecida por sua alta velocidade e baixa taxa de colisão.
 * Funciona através de operações XOR e multiplicações por primos.
 */
function hash2(str) {
    let hash = 0x811c9dc5; // Offset basis (2166136261)
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        // Math.imul é usado para simular a multiplicação de inteiros de 32 bits de C/C++
        hash = Math.imul(hash, 0x01000193); // Prime (16777619)
    }
    return hash >>> 0;
}

/**
 * 3. SDBM Hash
 * Algoritmo usado na biblioteca de banco de dados SDBM.
 * Matemáticamente diferente das anteriores, embaralhando bits de forma distinta.
 */
function hash3(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        // Fórmula: hash = char + (hash << 6) + (hash << 16) - hash
        hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
    }
    return hash >>> 0;
}

document.querySelector('button#insertButton').addEventListener('click', function(event) {
    event.preventDefault(); // Impede o refresh da página
    let item = document.querySelector('input#textInput');
    
    // Impede que o botão funcione sem um input
    if(item.value === "" || item.value === null) {
        return;
    }
    
    // Calcula os índices
    let idx1 = hash1(item.value) % tamanhoDoVetor;
    let idx2 = hash2(item.value) % tamanhoDoVetor;
    let idx3 = hash3(item.value) % tamanhoDoVetor;
    let hash_indexes = [idx1, idx2, idx3];

    // Atualiza os outputs com os valores das funções hash
    document.getElementById('hash_1').textContent = idx1;
    document.getElementById('hash_2').textContent = idx2;
    document.getElementById('hash_3').textContent = idx3;

    // Atualiza a tabela visual (Bits)
    for(let i = 0; i < 3; i++) {
        // Montamos o ID do elemento baseado no cálculo para evitar de criar um vetor inteiro com as 32 caixas"
        let idDoElemento = 'index' + hash_indexes[i];
        let caixaBit = document.getElementById(idDoElemento);
        
        if (caixaBit) {
            caixaBit.textContent = '1'; // Aqui muda o texto e pode ser colocado o CSS para uma animação
            
        } else {
            console.error("Elemento não encontrado para o ID:", idDoElemento);
        }
    }
    let elementosInseridos = document.querySelector('div#palavrasInseridas'); // Itens que foram colocados na lista
    if(elementosInseridos) {
        let newElement = document.createElement('p');
        newElement.classList.add('addedItem'); // Classe já adicionada para que os novos elementos possam ser estilizados
        newElement.textContent = item.value;
        elementosInseridos.appendChild(newElement);
    }

    item.value = ""; // Limpa o input
});
