import React from 'react';
import PokeMap from '@components/PokeMap'
import { getEncounters, getEncounter } from '@selectors/encounters'
import { getBots, getSelectedBot } from '@selectors/bots'
import { getPokestops } from '@selectors/pokestops'
import Encounters from '@collections/encounters'
import Pokestops from '@collections/pokestops'
import Bots from '@collections/bots'
import { call } from '@ducks/methods'
import { selectEncounter,
  selectBot,
  setBotPosition,
  getPokestop,
  catchPokemon,
  encounterPokemon,
} from '@ducks/game'
import { connect } from 'react-redux'
import { composeWithTracker } from 'react-komposer';

const composer = (props, onData) => {
  const onError = (err) => {
    onData(new Error(err))
  }

  const selectedBot = getSelectedBot(Bots)

  let latitude
  let longitude
  if (selectedBot) {
    latitude = selectedBot.coords.latitude
    longitude = selectedBot.coords.longitude
  }

  console.log(latitude, longitude)
  const handlerEncounters = Meteor.subscribe('encounters', { onError })
  const handlerPokestops = Meteor.subscribe('pokestops', { latitude, longitude }, { onError })
  const handlerBots = Meteor.subscribe('bots', { onError })


  if (handlerEncounters.ready() && handlerPokestops.ready() && handlerBots.ready()) {
    let currentEncounter = null
    let catchedEncounters = []
    let fleedEncounters = []
    let currentEncounterCP
    const encounters = getEncounters(Encounters)
    const pokestops = getPokestops(Pokestops)
    const bots = getBots(Bots)
    if (selectedBot) {
      //  const selectedBotDocument = getSelectedBotDocument(Bots, selectedBot) || {}
      currentEncounter = selectedBot.currentEncounter && getEncounter(Encounters, selectedBot.currentEncounter)
      catchedEncounters = selectedBot.catchedEncounters
      fleedEncounters = selectedBot.fleedEncounters
      currentEncounterCP = selectedBot.currentEncounterCP
    }
    onData(null, {
      encounters,
      pokestops,
      bots,
      currentEncounter,
      currentEncounterCP,
      catchedEncounters,
      fleedEncounters,
      selectedBot,
    })
  }
}

const mapStateToProps = (state) => {
  return {
    itemsAwardedDisplay: state.game.get('itemsAwardedDisplay')
  }
}

const mapDispatchToProps = dispatch => ({
  onLeft(botId) {
    dispatch(call('bots.changeAngle', { botId, direction: 1 }))
  },
  onRight(botId) {
    dispatch(call('bots.changeAngle', { botId, direction: -1 }))
  },
  onUp(botId) {
    dispatch(call('bots.walk', { botId, direction: 1 }))
  },
  onDown(botId) {
    dispatch(call('bots.walk', { botId, direction: -1 }))
  },
  handleSelectEncounter(encounterId) {
    dispatch(selectEncounter(encounterId))
  },
  onMapClick(botId, latitude, longitude) {
    dispatch(setBotPosition(botId, latitude, longitude))
  },
  onBotClick(botId) {
    dispatch(selectBot(botId))
  },
  onPokestopClick(botId, pokestopId) {
    console.log(botId, pokestopId)
    dispatch(getPokestop(botId, pokestopId))
  },
  onClickCatch(botId, encounterId, pokeball) {
    dispatch(catchPokemon(botId, encounterId, pokeball))
  },
  onClickRun(botId) {
    dispatch(call('bots.run', { botId }))
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  },
  onClickMapPokemon(botId, encounterIdNumber) {
    dispatch(encounterPokemon(botId, encounterIdNumber))
  },
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(composeWithTracker(composer)(PokeMap))
