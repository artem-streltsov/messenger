import React, { useContext, useState } from 'react'
import UseLocalStorage from '../hooks/UseLocalStorage'
import { useContacts } from './ContactsProvider'

const ConversationsContext = React.createContext()

export function useConversations() {
  return useContext(ConversationsContext)
}

export function ConversationsProvider({ id, children }) {
  const [conversations, setConversations] = UseLocalStorage('conversations', [])
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0)

  const {contacts} = useContacts()

  function createConversation(recipients) {
    setConversations(prevConversations => {
      return [...prevConversations, { recipients, messages: [] }]
    })
  }

  function addMessageToConversations({ recipients, text, sender }) {

  }

  function sendMessage(recipients, text) {
    addMessageToConversations({ recipients, text, sender: id })
  }

  const formattedConversations = conversations.map((conversation, index) =>  {
    const recipients = conversation.recipients.map(recipient => {
      const contact = contacts.find(contact => {
        return contact.id === recipient
      })
      
      const name = (contact && contact.name) || recipient

      return { id: recipient, name }
    })

    const selected = index === selectedConversationIndex
    return { ...conversations, recipients, selected }
  })

  const value = {
    conversations: formattedConversations,
    selectedConversation: formattedConversations[selectedConversationIndex],
    selectedConversationIndex: setSelectedConversationIndex,
    sendMessage,
    createConversation
  }

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  )
}