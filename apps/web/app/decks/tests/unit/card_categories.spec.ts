import { test } from '@japa/runner'

import { categoryFromName, categoryFromTypeLine } from '#decks/services/card_categories'

test.group('categoryFromTypeLine', () => {
  test('mapeia tipos simples', ({ assert }) => {
    assert.equal(categoryFromTypeLine('Instant'), 'instants')
    assert.equal(categoryFromTypeLine('Sorcery'), 'sorceries')
    assert.equal(categoryFromTypeLine('Legendary Planeswalker — Jace'), 'planeswalkers')
    assert.equal(categoryFromTypeLine('Basic Land — Island'), 'lands')
    assert.equal(categoryFromTypeLine('Enchantment — Aura'), 'enchantments')
  })

  test('criatura vence artefato e encantamento', ({ assert }) => {
    assert.equal(categoryFromTypeLine('Artifact Creature — Thopter'), 'creatures')
    assert.equal(categoryFromTypeLine('Enchantment Creature — God'), 'creatures')
  })

  test('terreno vence artefato', ({ assert }) => {
    assert.equal(categoryFromTypeLine('Artifact Land'), 'lands')
  })

  test('usa a face da frente e nao confunde subtipos', ({ assert }) => {
    assert.equal(categoryFromTypeLine('Creature — Human Werewolf // Land'), 'creatures')
    assert.equal(categoryFromTypeLine('Kindred Instant — Faerie'), 'instants')
  })

  test('tipo desconhecido vira other', ({ assert }) => {
    assert.equal(categoryFromTypeLine('Battle — Siege'), 'other')
  })
})

test.group('categoryFromName', () => {
  test('terrenos basicos e tabela local', ({ assert }) => {
    assert.equal(categoryFromName('Island'), 'lands')
    assert.equal(categoryFromName("Yuriko, the Tiger's Shadow"), 'creatures')
    assert.equal(categoryFromName('Carta Inventada'), 'other')
  })
})
