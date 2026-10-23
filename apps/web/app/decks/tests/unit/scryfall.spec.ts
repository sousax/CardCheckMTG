import { test } from '@japa/runner'
import sinon from 'sinon'

import Scryfall from '#decks/services/scryfall'

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

test.group('Scryfall', (group) => {
  group.each.teardown(() => sinon.restore())

  test('resolve tipos pelo nome e pela face da frente', async ({ assert }) => {
    sinon.stub(globalThis, 'fetch').resolves(
      jsonResponse({
        data: [
          { id: 'bolt-id', name: 'Lightning Bolt', type_line: 'Instant' },
          {
            id: 'delver-id',
            name: 'Delver of Secrets // Insectile Aberration',
            card_faces: [
              { name: 'Delver of Secrets', type_line: 'Creature — Human Wizard' },
              { name: 'Insectile Aberration', type_line: 'Creature — Human Insect' },
            ],
          },
        ],
        not_found: [{ name: 'Carta Inventada' }],
      })
    )

    const lookup = await new Scryfall().lookup([
      'Lightning Bolt',
      'Delver of Secrets',
      'Carta Inventada',
    ])

    assert.equal(lookup!.typeLines.get('lightning bolt'), 'Instant')
    assert.equal(lookup!.typeLines.get('delver of secrets'), 'Creature — Human Wizard')
    assert.equal(lookup!.ids.get('delver of secrets'), 'delver-id')
    assert.isTrue(lookup!.notFound.has('carta inventada'))
  })

  test('divide em lotes de 75', async ({ assert }) => {
    const fetch = sinon
      .stub(globalThis, 'fetch')
      .callsFake(async () => jsonResponse({ data: [], not_found: [] }))
    const names = Array.from({ length: 160 }, (_, i) => `Card ${i}`)

    await new Scryfall().lookup(names)

    assert.equal(fetch.callCount, 3)
    const sizes = fetch
      .getCalls()
      .map((call) => JSON.parse(String(call.args[1]!.body)).identifiers.length)
    assert.deepEqual(sizes, [75, 75, 10])
  })

  test('retorna null se a Scryfall falhar', async ({ assert }) => {
    sinon.stub(globalThis, 'fetch').resolves(jsonResponse({ details: 'down' }, 503))

    assert.isNull(await new Scryfall().lookup(['Island']))
  })
})
