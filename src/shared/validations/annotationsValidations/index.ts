/**
 * Expressão regular para validar números de telefone com exatamente 11 dígitos.
 *
 * Esta regex verifica se a string contém apenas números e possui um comprimento fixo de 11 caracteres.
 *
 * Exemplos válidos:
 * - "11987654321"
 * - "21987654321"
 *
 * Exemplos inválidos:
 * - "987654321" (menos de 11 dígitos)
 * - "1198765432a" (contém caracteres não numéricos)
 * - "119876543210" (mais de 11 dígitos)
 */
const phoneRegex = /^[0-9]{11}$/;

/**
 * Expressão regular que verifica se uma string não está em branco.
 *
 * Esta regex valida que a string não é composta apenas por espaços em branco
 * e que contém pelo menos um caractere visível.
 *
 * Exemplos:
 * - "texto" -> válido
 * - "   " -> inválido
 * - "" -> inválido
 */
const notBlankRegex = /^(?!\s*$).+/;

/**
 * Expressão regular que valida se uma string contém apenas números.
 *
 * @example
 * ```typescript
 * onlyNumbersRegex.test("12345"); // true
 * onlyNumbersRegex.test("123a45"); // false
 * ```
 */
const onlyNumbersRegex = /^\d+$/;

export { phoneRegex, notBlankRegex, onlyNumbersRegex };
