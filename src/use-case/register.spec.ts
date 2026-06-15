import {expect, test} from 'vitest'

// "test" cria um teste.
// O primeiro parâmetro é o nome/descrição do teste.
// O segundo parâmetro é a função que contém o código que será executado.
test('check if it works', () => {

    // "expect" recebe o valor que queremos verificar.
    // Aqui estamos verificando o resultado de 2 + 2.
    expect(2 + 2)

        // "toBe" compara o valor recebido pelo expect
        // com o valor informado aqui.
        // O teste só passa se 2 + 2 for exatamente igual a 4.
        // o expect realiza ess soma, logo no toBe eu informo o resultado
        .toBe(4)
})