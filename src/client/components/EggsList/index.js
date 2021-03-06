import React, { PropTypes } from 'react'
import { List } from 'material-ui/List';
import EggsListItem from './EggsListItem'
import Infinite from 'react-infinite'

const EggsList = ({
  eggs
}) => {
  return (
    <List>
      <Infinite elementHeight={72}
       containerHeight={752}
       >
      {
        eggs && eggs.entrySeq().map(([key, egg]) => (
          <EggsListItem
            key={key}
            {...egg.toObject()}
          />
        ))
      }
      </Infinite>
    </List>
  )
}

export default EggsList
