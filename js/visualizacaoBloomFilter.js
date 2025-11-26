// Variável global para controlar o tamanho do vetor
var tamanhoDoVetor = 32;
/* 
    Nota:   As funções de hash não foram criadas por mim. Elas são funções já existentes
        que tem o objetivo de tratar strings
*/
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
    document.getElementById('hash_1').textContent = idx1; // Caso seja necessário, esta parte também comporta
    document.getElementById('hash_2').textContent = idx2; // estilos CSS para demonstrar a mudança nos hash
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
    let elementosInseridos = document.querySelector('div#listaDePalavras'); // Itens que foram colocados na lista
    if(elementosInseridos) {
        let newElement = document.createElement('span');
        newElement.classList.add('addedItem'); // Classe já adicionada para que os novos elementos possam ser estilizados
        newElement.textContent = item.value;
        elementosInseridos.appendChild(newElement);
    }

    item.value = ""; // Limpa o input
});

document.querySelector('button#resetButton').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o refresh da página
    let items = document.getElementsByClassName('tableElement');
    if(items) { // Garante que o elemento DOM foi endereçado
        for(let i = 0; i < tamanhoDoVetor; i++) { // Percorre o vetor inteiro para substituir os bits por 0
            items[i].textContent = '0'; 
        }
    }
    let elementosInseridos = document.querySelector('div#listaDePalavras'); // Itens que foram colocados na lista
    if(elementosInseridos) {
        elementosInseridos.innerHTML = ""; // Remove todas as tags inseridas 
    }
    let messageBoard = document.querySelector('div#mensagem');
    let avisoAntigo = messageBoard.querySelector('p.warning');
    if (avisoAntigo) {
        avisoAntigo.remove();
    }
    let item = document.querySelector('input#textInput');
    if(item) {
        item.value = "";
    }
    document.getElementById('hash_1').textContent = "";
    document.getElementById('hash_2').textContent = "";
    document.getElementById('hash_3').textContent = "";
});

// Função reaproveitada do código da calculadora de parâmetros ótimos
function mostrarMensagem(mensagem) {
    // Remove qualquer aviso anterior
    let messageBoard = document.querySelector('div#mensagem');
    let avisoAntigo = messageBoard.querySelector('p.warning');
    if (avisoAntigo) {
        avisoAntigo.remove();
    }

    // Cria e adiciona o novo aviso
    let aviso = document.createElement('p');
    aviso.className = 'warning'; // Classe usada para detecções futuras
    aviso.textContent = mensagem;
    aviso.style.color = '#c00';
    messageBoard.appendChild(aviso);
}

document.querySelector('button#searchButton').addEventListener('click', function(event) {
    event.preventDefault(); // Evita o refresh
    let item = document.querySelector('input#textInput');
    // A sessão seguinte é idêntica à presente no código de inserção
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
    document.getElementById('hash_1').textContent = idx1; // Mesma coisa da outra função. CSS podem ser inseridos
    document.getElementById('hash_2').textContent = idx2; // aqui para criar uma visualização da mudança de hash
    document.getElementById('hash_3').textContent = idx3;
    let count = 0;

    for(let i = 0; i < 3; i++) {
        // Montamos o ID do elemento baseado no cálculo para evitar de criar um vetor inteiro com as 32 caixas"
        let idDoElemento = 'index' + hash_indexes[i];
        let caixaBit = document.getElementById(idDoElemento);
        
        if (caixaBit) {
            // caixaBit está com o endereço do elemento em questão, então pode-se usar esta variável para inserir os CSS
            if(caixaBit.textContent === '1') { 
                count++;
            }
            
        } else {
            console.error("Elemento não encontrado para o ID:", idDoElemento);
        }
    }
    if(count != 3) {
        mostrarMensagem(`O elemento "${item.value}" não está na lista`);
    } else {
        mostrarMensagem(`O elemento "${item.value}" pode estar na lista`);
    }
});
