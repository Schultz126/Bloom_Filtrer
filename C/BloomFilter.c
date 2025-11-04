#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <stdbool.h>
#include <string.h>

// -----------------------------------------------------------------------------
// Definição de tipo de função hash: recebe ponteiro genérico e retorna um int.
// Assim, qualquer função de hash pode ser passada por parâmetro.
// -----------------------------------------------------------------------------
typedef int (*HashFunction)(const void*);

// -----------------------------------------------------------------------------
// Estrutura principal do Bloom Filter
// -----------------------------------------------------------------------------
typedef struct {
    HashFunction getHashPrimary;     // Função hash primária
    HashFunction getHashSecondary;   // Função hash secundária
    int hashFunctionCount;           // Quantidade de funções hash (k)
    int bitCount;                    // Tamanho do vetor de bits (m)
    unsigned char* hashBits;         // Vetor que armazena os bits (m bits)
} BloomFilter;

// -----------------------------------------------------------------------------
// Funções auxiliares para manipular bits em um array de bytes
// -----------------------------------------------------------------------------

// Define o bit de índice "index" como 1
static void setBit(unsigned char* array, int index) {
    array[index / 8] |= (1 << (index % 8));
}

// Retorna o valor do bit (true se for 1)
static bool getBit(const unsigned char* array, int index) {
    return (array[index / 8] >> (index % 8)) & 1;
}

// -----------------------------------------------------------------------------
// Fórmulas para calcular os parâmetros ideais do Bloom Filter
// -----------------------------------------------------------------------------

// m = ceil( n * log(p) / log(1 / (2^log(2))) )
// onde:
//   n = capacidade (número esperado de elementos)
//   p = taxa de falso positivo desejada
// Essa fórmula é derivada de otimização para minimizar falsos positivos.
// -----------------------------------------------------------------------------
static int BestM(int capacity, float errorRate) {
    return (int)ceil(capacity * log(errorRate) / log(1.0 / pow(2.0, log(2.0))));
}

// k = round( (m / n) * ln(2) )
// onde:
//   k = número ótimo de funções hash
// Essa é a quantidade ideal de funções hash para o tamanho m e capacidade n.
// -----------------------------------------------------------------------------
static int BestK(int capacity, float errorRate) {
    return (int)round(log(2.0) * BestM(capacity, errorRate) / capacity);
}

// -----------------------------------------------------------------------------
// Dillinger-Manolios method
// Combina duas funções hash de forma eficiente:
//
//   hash_i(x) = (hash1(x) + i * hash2(x)) mod m
//
// Essa técnica evita ter que criar várias funções hash diferentes,
// usando apenas duas (hash primária e secundária) para gerar k variações.
// -----------------------------------------------------------------------------
static int ComputeHashUsingDillingerManoliosMethod(int primaryHash, int secondaryHash, int i, int m) {
    int resultingHash = (primaryHash + i * secondaryHash) % m;
    return abs(resultingHash);
}

// -----------------------------------------------------------------------------
// Inicializa e cria um Bloom Filter
// -----------------------------------------------------------------------------
BloomFilter* BloomFilter_create(int capacity, float errorRate,
                                HashFunction primaryHashFunction,
                                HashFunction secondaryHashFunction) {
    // Validação das funções hash
    if (!primaryHashFunction || !secondaryHashFunction) {
        fprintf(stderr, "Erro: funções de hash não podem ser nulas.\n");
        return NULL;
    }

    // Aloca memória para a estrutura
    BloomFilter* bf = malloc(sizeof(BloomFilter));
    if (!bf) return NULL;

    // Calcula m e k ideais para a capacidade e taxa de erro desejadas
    int m = BestM(capacity, errorRate);
    int k = BestK(capacity, errorRate);

    printf("Novo BloomFilter (k = %d; m = %d)\n", k, m);

    // Aloca o vetor de bits (m bits → arredondado para bytes)
    bf->hashBits = calloc((m + 7) / 8, sizeof(unsigned char));
    bf->bitCount = m;
    bf->hashFunctionCount = k;
    bf->getHashPrimary = primaryHashFunction;
    bf->getHashSecondary = secondaryHashFunction;

    return bf;
}

// -----------------------------------------------------------------------------
// Adiciona um item ao Bloom Filter
// Marca k posições no vetor de bits, uma para cada hash.
// -----------------------------------------------------------------------------
void BloomFilter_add(BloomFilter* bf, const void* item) {
    if (!bf || !item) return;

    // Calcula os dois hashes base
    int primaryHash = bf->getHashPrimary(item);
    int secondaryHash = bf->getHashSecondary(item);

    // Gera k variações e ativa os bits correspondentes
    for (int i = 0; i < bf->hashFunctionCount; i++) {
        int hash = ComputeHashUsingDillingerManoliosMethod(primaryHash, secondaryHash, i, bf->bitCount);
        setBit(bf->hashBits, hash);
    }
}

// -----------------------------------------------------------------------------
// Verifica se o item *pode* estar no Bloom Filter
// Se algum dos bits esperados estiver 0 → com certeza o item NÃO está.
// Se todos estão 1 → talvez esteja (possível falso positivo).
// -----------------------------------------------------------------------------
bool BloomFilter_maybeContains(BloomFilter* bf, const void* item) {
    if (!bf || !item) return false;

    int primaryHash = bf->getHashPrimary(item);
    int secondaryHash = bf->getHashSecondary(item);

    for (int i = 0; i < bf->hashFunctionCount; i++) {
        int hash = ComputeHashUsingDillingerManoliosMethod(primaryHash, secondaryHash, i, bf->bitCount);
        if (!getBit(bf->hashBits, hash))
            return false; // Bit 0 ⇒ certeza de que o item não foi inserido
    }

    return true; // Todos os bits 1 ⇒ possivelmente está
}

// -----------------------------------------------------------------------------
// Libera a memória do Bloom Filter
// -----------------------------------------------------------------------------
void BloomFilter_free(BloomFilter* bf) {
    if (bf) {
        free(bf->hashBits);
        free(bf);
    }
}

#include <string.h>

// Hash primária simples baseada em multiplicação e soma
int simpleHash(const void* input) {
    const char* str = (const char*)input;
    int hash = 0;
    while (*str)
        hash = (hash * 31 + *str++) % 100000;
    return hash;
}

// Segunda hash diferente, baseada em outro multiplicador primo
int secondaryHash(const void* input) {
    const char* str = (const char*)input;
    int hash = 7;
    while (*str)
        hash = (hash * 131 + *str++) % 100000;
    return hash;
}

int main() {
    // Cria Bloom Filter para 1000 itens com erro esperado de 1%
    BloomFilter* bf = BloomFilter_create(1000, 0.01f, simpleHash, secondaryHash);

    const char* item1 = "banana";
    const char* item2 = "maçã";

    // Adiciona "banana" ao filtro
    BloomFilter_add(bf, item1);

    // Verifica presença
    printf("banana está? %s\n", BloomFilter_maybeContains(bf, item1) ? "Sim" : "Não");
    printf("maçã está? %s\n", BloomFilter_maybeContains(bf, item2) ? "Sim" : "Não");

    // Libera recursos
    BloomFilter_free(bf);
    return 0;
}
