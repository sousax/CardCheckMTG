import { test } from '@japa/runner'

import { parseDecklist } from '#decks/services/decklist_parser'

test.group('parseDecklist', () => {
  test('le "N Nome" e "Nx Nome"', ({ assert }) => {
    assert.deepEqual(parseDecklist('4 Lightning Bolt\n1x Sol Ring'), [
      { name: 'Lightning Bolt', quantity: 4 },
      { name: 'Sol Ring', quantity: 1 },
    ])
  })

  test('remove codigo de set, numero de colecionador e marca de foil', ({ assert }) => {
    assert.deepEqual(parseDecklist('1 Counterspell (2XM) 51\n2 Island (stx) *F*'), [
      { name: 'Counterspell', quantity: 1 },
      { name: 'Island', quantity: 2 },
    ])
  })

  test('ignora cabecalhos, comentarios e linhas sem quantidade', ({ assert }) => {
    const text = 'Deck\n// main\n# notas\nSideboard:\nLightning Bolt\n\n3 Shock'
    assert.deepEqual(parseDecklist(text), [{ name: 'Shock', quantity: 3 }])
  })

  test('marca as cartas da secao Commander', ({ assert }) => {
    assert.deepEqual(parseDecklist('Commander\n1 Yuriko\n\nDeck\n1 Sol Ring'), [
      { name: 'Yuriko', quantity: 1, commander: true },
      { name: 'Sol Ring', quantity: 1 },
    ])
    assert.deepEqual(parseDecklist('Commander\n1 Yuriko\n\n1 Sol Ring'), [
      { name: 'Yuriko', quantity: 1, commander: true },
      { name: 'Sol Ring', quantity: 1 },
    ])
  })

  test('usa a face da frente de cartas dupla-face', ({ assert }) => {
    assert.deepEqual(parseDecklist('1 Fire // Ice'), [{ name: 'Fire', quantity: 1 }])
  })

  test('soma duplicatas sem diferenciar maiusculas', ({ assert }) => {
    assert.deepEqual(parseDecklist('2 Island\n3 island'), [{ name: 'Island', quantity: 5 }])
  })

  test('descarta quantidade zero', ({ assert }) => {
    assert.deepEqual(parseDecklist('0 Island'), [])
  })
})
