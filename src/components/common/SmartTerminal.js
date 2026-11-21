import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiCornerDownLeft, FiMessageSquare, FiSend, FiTerminal, FiTrash2, FiX } from 'react-icons/fi';
import { useTerminal } from '../../context/TerminalContext';
import { answerPortfolio, guideWelcome } from '../../data/assistant';
import { crew } from '../../data/profile';
import { completeTerminalInput, runTerminalCommand, terminalPath, terminalShortcuts } from '../../data/terminal';
import './crew-chat.css';

function useConversation() {
  const conversation = useRef([]);
  const request = useRef(null);
  const sequence = useRef(0);
  const [turns, setTurns] = useState([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);

  const write = useCallback((entry) => {
    const id = sequence.current++;
    setTurns((previous) => [...previous.slice(-19), { ...entry, id }]);
    return id;
  }, []);

  const ask = useCallback(async (value, speaker, command) => {
    const question = value.trim().slice(0, 600);
    if (!question || request.current) return;
    const history = conversation.current;
    const entry = { input: command?.input ?? question, prompt: command?.prompt, speaker };
    setInput('');

    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    const id = write({ ...entry, reply: null });
    const signal = typeof AbortSignal.any === 'function' && typeof AbortSignal.timeout === 'function'
      ? AbortSignal.any([controller.signal, AbortSignal.timeout(9_000)])
      : null;
    const timeout = signal ? null : setTimeout(() => controller.abort(), 9_000);
    let reply;
    try {
      const response = await fetch('/api/crew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history, guide: speaker }),
        signal: signal ?? controller.signal,
      });
      if (response.ok) {
        const result = await response.json();
        if (typeof result.text === 'string' && result.text.trim()) reply = result;
      }
    } catch {
      // The portfolio answer is also available locally.
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) {
        request.current = null;
        if (!reply) {
          const { text, sources, followUps } = answerPortfolio(question, history.map((turn) => turn.question), speaker);
          reply = { text, sources, followUps, generated: false };
        }
        conversation.current = [...history, { question, answer: reply.text.slice(0, 720) }].slice(-3);
        setPending(false);
        setTurns((previous) => previous.map((turn) => turn.id === id ? { ...entry, id, reply } : turn));
      }
    }
  }, [write]);

  function reset() {
    const active = request.current;
    request.current = null;
    active?.abort();
    conversation.current = [];
    setTurns([]);
    setInput('');
    setPending(false);
  }

  useEffect(() => () => {
    const active = request.current;
    request.current = null;
    active?.abort();
  }, []);

  return { turns, input, setInput, pending, ask, write, reset };
}

function SourceLink({ source, onNavigate }) {
  if (source.external) {
    const newTab = source.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' };
    return <a href={source.href} {...newTab}>{source.label}<FiArrowUpRight aria-hidden="true" /></a>;
  }
  return <Link to={source.href} onClick={onNavigate}>{source.label}<FiArrowUpRight aria-hidden="true" /></Link>;
}

export default function SmartTerminal() {
  const { isTerminalOpen, opening, openTerminal, openShell, closeTerminal } = useTerminal();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const shell = opening?.mode === 'shell';
  const guideId = Object.hasOwn(crew, opening?.guide) ? opening.guide : 'scout';
  const guide = crew[guideId];
  const welcome = guideWelcome(guideId);
  const chat = useConversation();
  const terminal = useConversation();
  const session = shell ? terminal : chat;
  const { turns, input, setInput, pending } = session;
  const askChat = chat.ask;
  const title = shell ? 'Portfolio terminal' : `Ask ${guide.name}`;
  const prompt = `nihar@portfolio:${terminalPath(pathname)}$`;

  const dialog = useRef(null);
  const dialogTitle = useRef(null);
  const log = useRef(null);
  const lastOpening = useRef(null);
  const historyCursor = useRef(null);
  const historyDraft = useRef('');

  useEffect(() => {
    const modal = dialog.current;
    if (isTerminalOpen && !modal.open) {
      modal.showModal();
      dialogTitle.current.focus({ preventScroll: true });
    }
    if (!isTerminalOpen && modal.open) modal.close();
  }, [isTerminalOpen]);

  useEffect(() => {
    if (!shell && isTerminalOpen && !chat.pending && opening?.question && lastOpening.current !== opening) {
      lastOpening.current = opening;
      void askChat(opening.question, guideId);
    }
  }, [askChat, chat.pending, guideId, isTerminalOpen, opening, shell]);

  useEffect(() => {
    historyCursor.current = null;
    historyDraft.current = '';
  }, [shell, isTerminalOpen]);

  useEffect(() => {
    const panel = log.current;
    const latest = panel.lastElementChild;
    if (isTerminalOpen && latest) {
      panel.scrollTop += latest.getBoundingClientRect().top - panel.getBoundingClientRect().top - 12;
    }
  }, [isTerminalOpen, shell, turns]);

  function run(value) {
    const command = value.trim();
    if (!command || pending) return;
    historyCursor.current = null;
    if (!shell) {
      if (/^(?:clear|cls|reset)$/i.test(command)) chat.reset();
      else void askChat(command, guideId);
      return;
    }

    setInput('');
    const action = runTerminalCommand(command, pathname);
    if (action.type === 'clear') {
      terminal.reset();
    } else if (action.type === 'navigate') {
      terminal.write({ input: command, prompt, reply: { text: `Opening ${action.to}…` } });
      dialog.current.close();
      navigate(action.to);
    } else if (action.type === 'ask') {
      void terminal.ask(action.question, 'scout', { input: command, prompt });
    } else {
      terminal.write({ input: command, prompt, reply: action });
    }
  }

  function handleKeys(event) {
    if (event.nativeEvent.isComposing) return;
    if (shell && event.key === 'Tab' && !event.shiftKey) {
      const suggestion = completeTerminalInput(input);
      if (suggestion) {
        event.preventDefault();
        setInput(suggestion);
      }
      return;
    }

    if (!['ArrowUp', 'ArrowDown'].includes(event.key) || !turns.length) return;
    if (event.key === 'ArrowDown' && historyCursor.current === null) return;
    if (historyCursor.current === null) historyDraft.current = input;
    const index = historyCursor.current ?? turns.length;
    const next = Math.max(0, Math.min(turns.length, index + (event.key === 'ArrowUp' ? -1 : 1)));
    event.preventDefault();
    historyCursor.current = next === turns.length ? null : next;
    setInput(turns[next]?.input ?? historyDraft.current);
  }

  const followUps = turns.at(-1)?.reply?.followUps ?? [];
  const prompts = shell ? terminalShortcuts : turns.length ? followUps : welcome.followUps;
  const SubmitIcon = shell ? FiCornerDownLeft : FiSend;

  return (
    <>
      <button type="button" className="crew-launcher" aria-label="Ask Scout" aria-haspopup="dialog"
        aria-controls="crew-chat" data-sound="terminal" onClick={() => openTerminal()}>
        <img src="/images/crew/scout.webp" alt="" width="42" height="42" />
        <span>Ask Scout</span>
      </button>

      <dialog id="crew-chat" className={`crew-chat${shell ? ' crew-terminal' : ''}`}
        aria-labelledby="crew-chat-title" onClose={closeTerminal} ref={dialog}>
        <header className="crew-chat-header">
          {shell ? <span className="crew-terminal-mark"><FiTerminal aria-hidden="true" /></span>
            : <img src={`/images/crew/${guideId}.webp`} width="54" height="54" alt="" />}
          <div className="crew-chat-heading">
            <h2 id="crew-chat-title" ref={dialogTitle} tabIndex={-1}>{title}</h2>
            <p>{shell ? terminalPath(pathname) : guide.role}</p>
          </div>
          <button type="button" className="crew-icon-button" data-sound="terminal"
            onClick={() => shell ? openTerminal() : openShell()}
            aria-label={shell ? 'Switch to Scout chat' : 'Switch to terminal'}
            title={shell ? 'Scout chat' : 'Terminal'}>
            {shell ? <FiMessageSquare aria-hidden="true" /> : <FiTerminal aria-hidden="true" />}
          </button>
          <button type="button" className="crew-icon-button" onClick={() => {
            historyCursor.current = null;
            session.reset();
          }} aria-label={shell ? 'Clear terminal' : 'Clear conversation'} title={shell ? 'Clear terminal' : 'Clear conversation'}>
            <FiTrash2 aria-hidden="true" />
          </button>
          <form method="dialog">
            <button type="submit" className="crew-icon-button" aria-label={shell ? 'Close terminal' : 'Close chat'}>
              <FiX aria-hidden="true" />
            </button>
          </form>
        </header>

        <div className="crew-chat-log" role="log" aria-label={shell ? 'Terminal output' : 'Conversation'} tabIndex={0} ref={log}>
          {!turns.length && (shell ? <div className="crew-terminal-welcome">
            <p><code>{prompt}</code> <strong>help</strong></p>
            <p>Browse Nihar’s work with <code>ls</code> and <code>cat</code>, or try <code>ask</code> with a question.</p>
          </div> : <p className="crew-chat-greeting">{welcome.text}</p>)}
          {turns.map((turn) => (
            <article className="crew-chat-turn" key={turn.id}>
              <p className="crew-chat-question">{turn.prompt && <code>{turn.prompt} </code>}{turn.input}</p>
              {turn.reply ? (
                <div className="crew-chat-answer">
                  {turn.speaker && <strong>{crew[turn.speaker].name}</strong>}
                  {turn.reply.generated === false && <span className="crew-chat-mode">Portfolio notes</span>}
                  <p>{turn.reply.text}</p>
                  {!!turn.reply.sources?.length && <ul className="crew-chat-sources" aria-label="Related portfolio sources">
                    {turn.reply.sources.map((source) => <li key={source.href}>
                      <SourceLink source={source} onNavigate={() => dialog.current.close()} />
                    </li>)}
                  </ul>}
                </div>
              ) : <p className="crew-chat-pending" role="status">{crew[turn.speaker].name} is thinking…</p>}
            </article>
          ))}
        </div>

        {prompts.length > 0 && (
          <div className="crew-chat-prompts" aria-label={shell ? 'Quick commands' : 'Suggested questions'}>
            {prompts.map((item) => <button type="button" disabled={pending} key={item}
              data-sound="message" onClick={() => run(item)}>{item}</button>)}
          </div>
        )}

        <form className="crew-chat-form" aria-label={shell ? 'Run a portfolio command' : 'Ask a portfolio question'}
          onSubmit={(event) => {
            event.preventDefault();
            run(input);
          }}>
          <div className="crew-chat-field">
            <label htmlFor="crew-input" className={shell ? 'crew-terminal-prompt' : 'portfolio-visually-hidden'}>
              {shell ? <><span aria-hidden="true">{prompt}</span><span className="portfolio-visually-hidden">Terminal command</span></>
                : 'Ask a portfolio question'}
            </label>
            <input id="crew-input" name={shell ? 'command' : 'question'} placeholder={shell ? 'Type a command…' : `Ask ${guide.name} a question…`}
              autoComplete="off" autoCapitalize={shell ? 'none' : undefined} spellCheck={!shell} enterKeyHint={shell ? 'go' : 'send'}
              maxLength={600} type="text" value={input} onChange={(event) => {
                historyCursor.current = null;
                setInput(event.target.value);
              }} onKeyDown={handleKeys} />
          </div>
          <button type="submit" data-sound="message" aria-label={shell ? 'Run command' : 'Send question'}
            disabled={!input.trim() || pending}>
            <SubmitIcon aria-hidden="true" />
          </button>
        </form>
      </dialog>
    </>
  );
}
