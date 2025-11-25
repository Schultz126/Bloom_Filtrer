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