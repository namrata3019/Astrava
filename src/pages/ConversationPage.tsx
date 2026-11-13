import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Footer } from '../components/navigation/Footer'
import { Navigation } from '../components/navigation/Navigation'
import { useVault } from '../features/vault/VaultProvider'
import type { Conversation, VaultContents } from '../features/vault/types'

const explorationTopics = [
  'Personality and inner nature',
  'Career and professional growth',
  'Love and relationships',
  'Family and relationships',
  'Education and learning',
  'Spirituality and inner growth',
  'A specific planet',
]

function sampleReply() {
  return 'Your question is saved in this conversation. This preview does not have verified chart calculations or a live interpretation engine, so it cannot yet offer personal chart evidence. No placements or predictions were generated.'
}

function newMessage(role: 'user' | 'assistant', content: string) {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  } as const
}

export default function ConversationPage() {
  const vault = useVault()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [question, setQuestion] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const contents = vault.contents
  const conversations = contents?.conversations ?? []

  useEffect(() => {
    if (vault.status === 'unchecked') void vault.refreshSession()
  }, [vault.status])

  const activeConversation = useMemo(
    () => conversations.find(({ id }) => id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  )

  async function saveQuestion(value: string) {
    if (!contents) return
    const trimmedQuestion = value.trim()
    if (!trimmedQuestion) return

    const conversationId = activeConversation?.id ?? crypto.randomUUID()
    const now = new Date().toISOString()
    const questionMessage = newMessage('user', trimmedQuestion)
    const responseMessage = newMessage('assistant', sampleReply())
    const nextConversation: Conversation = {
      id: conversationId,
      title: activeConversation?.title ?? trimmedQuestion.slice(0, 80),
      updatedAt: now,
      messages: [
        ...(activeConversation?.messages ?? []),
        questionMessage,
        responseMessage,
      ],
    }
    const nextConversations = [
      nextConversation,
      ...conversations.filter(({ id }) => id !== conversationId),
    ]
    const nextContents: VaultContents = {
      ...contents,
      conversations: nextConversations,
    }

    setBusy(true)
    setError('')
    try {
      await vault.saveContents(nextContents)
      setActiveConversationId(conversationId)
      setQuestion('')
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Your question could not be saved. Try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  async function deleteConversation(conversation: Conversation) {
    if (!contents) return
    setBusy(true)
    setError('')
    try {
      await vault.saveContents({
        ...contents,
        conversations: conversations.filter(({ id }) => id !== conversation.id),
      })
      if (activeConversationId === conversation.id) {
        setActiveConversationId(null)
      }
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'The conversation could not be deleted. Try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      <a
        className="sr-only z-50 rounded-full bg-champagne px-4 py-2 text-midnight focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main-content"
      >
        Skip to content
      </a>
      <Navigation />
      <main
        className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16"
        id="main-content"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge>Explore Your Chart</Badge>
              <h1 className="mt-4 font-display text-4xl text-midnight sm:text-5xl">
                A conversation you can return to
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-ink/75">
                Choose a topic or ask a question in your own words. Saved
                conversations are encrypted with your profile and stay private
                until you unlock your vault.
              </p>
            </div>
            {vault.status === 'unlocked' && (
              <Link
                className="min-h-11 rounded-full border border-champagne px-5 py-3 text-sm font-semibold text-ink hover:bg-champagne/10"
                to="/account"
              >
                Vault and profile
              </Link>
            )}
          </div>

          {(vault.status === 'checking' || vault.status === 'unchecked') && (
            <Card className="mt-8" role="status">
              Checking your encrypted account…
            </Card>
          )}
          {vault.status === 'unavailable' && (
            <Card className="mt-8">
              <div className="text-sm leading-6 text-red-900" role="alert">
                <p>
                  The account service is unavailable. Start the API and check
                  database configuration before opening saved conversations.
                </p>
                <Button
                  className="mt-3"
                  onClick={() => void vault.refreshSession()}
                  type="button"
                >
                  Retry account service
                </Button>
              </div>
            </Card>
          )}
          {vault.status === 'signed-out' && (
            <Card className="mt-8">
              <h2 className="font-display text-2xl text-midnight">
                Sign in to save and revisit conversations
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink/70">
                Your questions are not stored in this browser. Create an
                encrypted account or sign in to start a conversation.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  className="inline-flex min-h-11 items-center rounded-full border border-champagne bg-champagne px-5 text-sm font-semibold text-midnight"
                  to="/account?flow=register"
                >
                  Create account
                </Link>
                <Link
                  className="inline-flex min-h-11 items-center rounded-full border border-soft-gray px-5 text-sm font-semibold text-ink"
                  to="/account"
                >
                  Sign in
                </Link>
              </div>
            </Card>
          )}
          {vault.status === 'locked' && (
            <Card className="mt-8">
              <h2 className="font-display text-2xl text-midnight">
                Unlock your vault to continue
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink/70">
                Your saved conversations stay encrypted while the vault is
                locked.
              </p>
              <Link
                className="mt-5 inline-flex min-h-11 items-center rounded-full border border-champagne bg-champagne px-5 text-sm font-semibold text-midnight"
                to="/account"
              >
                Unlock vault
              </Link>
            </Card>
          )}

          {vault.status === 'unlocked' && contents && (
            <>
              <div className="mt-8">
                <Badge tone="dark">
                  Sample conversation · no verified chart analysis
                </Badge>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/70">
                  Your questions and this preview response are saved inside
                  your encrypted vault. The assistant does not calculate a
                  chart, interpret real placements, or send your question to an
                  AI service.
                </p>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
                <Card as="aside" aria-labelledby="history-title" className="h-fit">
                  <h2
                    className="font-display text-xl text-midnight"
                    id="history-title"
                  >
                    Conversation history
                  </h2>
                  <Button
                    className="mt-4 w-full"
                    disabled={busy}
                    onClick={() => {
                      setActiveConversationId(null)
                      setQuestion('')
                      inputRef.current?.focus()
                    }}
                    type="button"
                  >
                    Start a new conversation
                  </Button>
                  {conversations.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                      {conversations.map((conversation) => (
                        <li key={conversation.id}>
                          <button
                            aria-current={
                              activeConversationId === conversation.id
                                ? 'page'
                                : undefined
                            }
                            className={`min-h-11 w-full rounded-xl px-3 py-2 text-left text-sm ${activeConversationId === conversation.id ? 'bg-champagne/20 font-semibold text-midnight' : 'text-ink hover:bg-midnight/5'}`}
                            onClick={() => setActiveConversationId(conversation.id)}
                            type="button"
                          >
                            <span className="block truncate">{conversation.title}</span>
                            <span className="mt-1 block text-xs text-ink/70">
                              {new Date(conversation.updatedAt).toLocaleDateString()}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm leading-6 text-ink/65">
                      Your saved questions will appear here.
                    </p>
                  )}
                  {activeConversation && (
                    <Button
                      className="mt-4 w-full"
                      disabled={busy}
                      onClick={() => deleteConversation(activeConversation)}
                      type="button"
                      variant="quiet"
                    >
                      Delete this conversation
                    </Button>
                  )}
                </Card>

                <Card as="section" aria-labelledby="conversation-title">
                  <h2
                    className="font-display text-2xl text-midnight"
                    id="conversation-title"
                  >
                    {activeConversation?.title ?? 'What would you like to explore?'}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-ink/70">
                    Choose a starting point or write your own question. You can
                    continue the same thread later.
                  </p>

                  {!activeConversation && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {explorationTopics.map((topic) => (
                        <button
                          className="min-h-10 rounded-full border border-soft-gray px-4 py-2 text-left text-sm text-ink hover:border-champagne hover:bg-champagne/10"
                          key={topic}
                          onClick={() => {
                            setQuestion(`I would like to explore ${topic.toLowerCase()}.`)
                            inputRef.current?.focus()
                          }}
                          type="button"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  )}

                  {activeConversation ? (
                    <ol
                      aria-label="Messages in this saved sample conversation"
                      aria-live="polite"
                      className="mt-6 max-h-[34rem] space-y-4 overflow-y-auto rounded-2xl bg-ivory p-4 sm:p-6"
                      role="log"
                    >
                      {activeConversation.messages.map((message) => (
                        <li
                          className={`max-w-[90%] rounded-2xl p-4 text-sm leading-6 ${message.role === 'user' ? 'ml-auto bg-midnight text-ivory' : 'border border-soft-gray bg-white text-ink'}`}
                          key={message.id}
                        >
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-70">
                            {message.role === 'user' ? 'You' : 'ASTRAVA · sample'}
                          </p>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-dashed border-soft-gray p-6 text-sm leading-6 text-ink/65">
                      Your first question will start a new saved conversation.
                    </div>
                  )}

                  <form
                    className="mt-6"
                    onSubmit={(event) => {
                      event.preventDefault()
                      void saveQuestion(question)
                    }}
                  >
                    <label
                      className="mb-2 block text-sm font-semibold text-ink"
                      htmlFor="conversation-question"
                    >
                      Ask your question
                    </label>
                    <textarea
                      className="min-h-28 w-full rounded-2xl border border-soft-gray bg-white px-4 py-3 text-sm leading-6 text-ink"
                      id="conversation-question"
                      maxLength={4_000}
                      onChange={(event) => setQuestion(event.target.value)}
                      placeholder="What would you like to understand?"
                      ref={inputRef}
                      required
                      value={question}
                    />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-ink/70">
                        Saved only after encryption in your browser.
                      </p>
                      <Button disabled={busy || !question.trim()} type="submit">
                        {busy ? 'Saving…' : 'Save question'}
                      </Button>
                    </div>
                  </form>

                  {error && (
                    <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-900" role="alert">
                      {error}
                    </p>
                  )}
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
