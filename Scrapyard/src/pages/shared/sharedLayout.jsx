import React from 'react'

export default function SharedLayout(props) {
  return (
    <div>
        <p>Shared Layout</p>
        {props.children}
    </div>
  )
}
