import React, { useContext } from 'react'
import UseLocalStorage from '../hooks/UseLocalStorage'
import { useContacts } from './ContactsProvider'

const ConversationsContext = React.createContext()

export function useConversations() {
  return useContext(ConversationsContext)
}

export function ConversationsProvider({ children }) {
  const [conversations, setConversations] = UseLocalStorage('conversations', [])
  const {contacts} = useContacts()

  function createConversation(recipients) {
    setConversations(prevConversations => {
      return [...prevConversations, { recipients, messages: [] }]
    })
  }

  const formattedConversations = conversations.map(conversation =>  {
    const recipients = conversation.recipients.map(recipient => {
      const contact = contacts.find(contact => {
        return contact.id === recipient
      })
      
      const name = (contact && contact.name) || recipient

      return { id: recipient, name }
    })

    return { ...conversations, recipients }
  })

  const value = {
    conversations: formattedConversations,
    createConversation
  }

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  )
}