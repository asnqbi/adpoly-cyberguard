"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCheck,
  Inbox,
  LoaderCircle,
  LogOut,
  Mail,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  CONTACT_SUBJECTS,
  type ContactSubmission,
  type MessageList,
  type MessageStatus,
} from "@/lib/contact";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-AE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai",
  }).format(new Date(value));
function Status({ status }: { status: MessageStatus }) {
  return <span className={`message-status status-${status}`}>{status}</span>;
}

export default function MessagesDashboard({ email }: { email: string }) {
  const [result, setResult] = useState<MessageList | null>(null);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [order, setOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort("timeout"), 30000);
    setLoading(true);
    setError("");
    const params = new URLSearchParams({
      search,
      subject,
      order,
      page: String(page),
    });
    fetch(`/api/admin/messages?${params}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if ([401, 403].includes(response.status)) {
          window.location.replace("/admin/login");
          return;
        }
        if (!response.ok) throw new Error();
        const data: MessageList = await response.json();
        if (controller.signal.aborted) return;
        const maximumPage = Math.max(1, Math.ceil(data.count / data.pageSize));
        if (page > maximumPage) {
          setPage(maximumPage);
          return;
        }
        setResult(data);
      })
      .catch(() => {
        if (
          !controller.signal.aborted ||
          controller.signal.reason === "timeout"
        ) {
          setResult(null);
          setError("Unable to load messages. Please try again.");
        }
      })
      .finally(() => {
        clearTimeout(timeout);
        if (
          !controller.signal.aborted ||
          controller.signal.reason === "timeout"
        )
          setLoading(false);
      });
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search, subject, order, page, revision]);

  useEffect(() => {
    if (selected) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
      opener.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  function open(
    message: ContactSubmission,
    button: HTMLButtonElement,
    deleting = false,
  ) {
    opener.current = button;
    setSelected(message);
    setConfirmDelete(deleting);
    setActionError("");
  }
  async function act(id: string, status?: "read" | "contacted") {
    if (busy) return;
    setBusy(true);
    setActionError("");
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: status ? "PATCH" : "DELETE",
        headers: { "Content-Type": "application/json" },
        ...(status ? { body: JSON.stringify({ status }) } : {}),
        signal: AbortSignal.timeout(30000),
      });
      if ([401, 403].includes(response.status)) {
        window.location.replace("/admin/login");
        return;
      }
      if (!response.ok) throw new Error();
      if (status)
        setSelected((current) =>
          current?.id === id ? { ...current, status } : current,
        );
      else setSelected(null);
      setRevision((r) => r + 1);
    } catch {
      setActionError("Unable to save this change. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    setActionError("");
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error();
      window.location.replace("/admin/login");
    } catch {
      setActionError("Unable to sign out. Please try again.");
      setBusy(false);
    }
  }
  const pages = result
    ? Math.max(1, Math.ceil(result.count / result.pageSize))
    : 1;
  return (
    <>
      <header className="admin-header">
        <div className="container">
          <a className="footer-brand" href="/">
            ADPoly CyberGuard<span className="cyan">.</span>
          </a>
          <span className="admin-badge">TEAM ADMIN</span>
          <div className="admin-account">
            <span>{email}</span>
            <button
              className="button secondary"
              onClick={logout}
              disabled={busy}
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main id="main" className="container admin-dashboard">
        <div className="admin-heading">
          <div>
            <div className="eyebrow">YOUR TEAM INBOX</div>
            <h1>
              Messages<span className="cyan">.</span>
            </h1>
            <p>
              Review inquiries, follow up, and keep the conversation moving.
            </p>
          </div>
          <button
            className="button secondary"
            disabled={loading}
            onClick={() => setRevision((r) => r + 1)}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            Refresh
          </button>
        </div>
        <div className="admin-stats">
          {[
            {
              label: "Total Messages",
              value: result?.stats.total,
              icon: Inbox,
            },
            { label: "New Messages", value: result?.stats.new, icon: Mail },
            {
              label: "Messages Today",
              value: result?.stats.today,
              icon: CalendarDays,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label}>
              <Icon size={22} />
              <span>{label}</span>
              <strong>{value ?? "—"}</strong>
              {label === "Messages Today" && <small>Asia/Dubai · UTC+4</small>}
            </div>
          ))}
        </div>
        <section className="admin-inbox" aria-label="Contact submissions">
          <form
            className="admin-filters"
            onSubmit={(event) => {
              event.preventDefault();
              setSearch(searchDraft.trim());
              setPage(1);
            }}
          >
            <div className="admin-search">
              <label htmlFor="message-search">Search messages</label>
              <div>
                <Search size={17} />
                <input
                  id="message-search"
                  placeholder="Name, email, organization, or message…"
                  value={searchDraft}
                  maxLength={120}
                  onChange={(event) => setSearchDraft(event.target.value)}
                />
                <button type="submit" className="button secondary">
                  Search
                </button>
              </div>
            </div>
            <label htmlFor="subject-filter">
              Filter by subject
              <select
                id="subject-filter"
                value={subject}
                onChange={(event) => {
                  setSubject(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">All subjects</option>
                {CONTACT_SUBJECTS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label htmlFor="message-sort">
              Sort by
              <select
                id="message-sort"
                value={order}
                onChange={(event) => {
                  setOrder(event.target.value);
                  setPage(1);
                }}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </form>
          {error && (
            <div className="admin-error" role="alert">
              {error}{" "}
              <button
                className="text-link"
                onClick={() => setRevision((r) => r + 1)}
              >
                Retry
              </button>
            </div>
          )}
          {actionError && !selected && (
            <p className="admin-error" role="alert">
              {actionError}
            </p>
          )}
          <div className="admin-table-wrap" aria-busy={loading}>
            {loading ? (
              <div className="admin-empty" role="status">
                <LoaderCircle className="spin" size={25} />
                <p>Loading messages…</p>
              </div>
            ) : result?.messages.length ? (
              <table className="messages-table">
                <caption className="sr-only">
                  Contact submissions. Dates are shown in Asia/Dubai time.
                </caption>
                <thead>
                  <tr>
                    {[
                      "Name / Organization",
                      "Email",
                      "Subject / Message",
                      "Submission date",
                      "Status",
                      "Actions",
                    ].map((label) => (
                      <th scope="col" key={label}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.messages.map((message) => (
                    <tr key={message.id}>
                      <td>
                        <strong>{message.name}</strong>
                        <span>{message.organization || "—"}</span>
                      </td>
                      <td>
                        <a href={`mailto:${message.email}`}>{message.email}</a>
                      </td>
                      <td>
                        <strong>{message.subject}</strong>
                        <span className="message-preview">
                          {message.message}
                        </span>
                      </td>
                      <td>
                        <time dateTime={message.created_at}>
                          {formatDate(message.created_at)}
                        </time>
                      </td>
                      <td>
                        <Status status={message.status} />
                      </td>
                      <td>
                        <div className="message-row-actions">
                          <button
                            onClick={(event) =>
                              open(message, event.currentTarget)
                            }
                          >
                            View message
                          </button>
                          <button
                            className="delete-link"
                            onClick={(event) =>
                              open(message, event.currentTarget, true)
                            }
                            aria-label={`Delete message from ${message.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !error && (
                <div className="admin-empty">
                  <Inbox size={30} />
                  <h2>
                    {search || subject
                      ? "No matching messages"
                      : "Your inbox is ready"}
                  </h2>
                  <p>
                    {search || subject
                      ? "Try another search or subject."
                      : "New contact submissions will appear here."}
                  </p>
                </div>
              )
            )}
          </div>
          {result && (
            <div className="admin-pagination">
              <span>
                {result.count} {result.count === 1 ? "message" : "messages"} ·
                Page {page} of {pages}
              </span>
              <div>
                <button
                  className="button secondary"
                  disabled={loading || page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ArrowLeft size={14} />
                  Previous
                </button>
                <button
                  className="button secondary"
                  disabled={loading || page >= pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
      <dialog
        ref={dialog}
        className="message-dialog"
        aria-labelledby="message-dialog-title"
        onCancel={(event) => {
          if (busy) event.preventDefault();
          else setSelected(null);
        }}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget && !busy) setSelected(null);
        }}
      >
        {selected && (
          <div className="message-dialog-content">
            <div className="message-dialog-top">
              <span className="eyebrow">CONTACT SUBMISSION</span>
              <button
                className="icon-button"
                onClick={() => setSelected(null)}
                disabled={busy}
                aria-label="Close message"
              >
                <X size={20} />
              </button>
            </div>
            <h2 id="message-dialog-title">{selected.subject}</h2>
            <Status status={selected.status} />
            <dl>
              <div>
                <dt>Name</dt>
                <dd>{selected.name}</dd>
              </div>
              <div>
                <dt>Organization</dt>
                <dd>{selected.organization || "Not provided"}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                </dd>
              </div>
              <div>
                <dt>Submission date</dt>
                <dd>{formatDate(selected.created_at)} (UAE)</dd>
              </div>
            </dl>
            <h3>Message</h3>
            <p className="full-message">{selected.message}</p>
            {actionError && (
              <p className="admin-error" role="alert">
                {actionError}
              </p>
            )}
            {confirmDelete ? (
              <div className="delete-confirmation">
                <p>
                  Delete this message from {selected.name}? This cannot be
                  undone.
                </p>
                <div>
                  <button
                    className="button danger"
                    disabled={busy}
                    onClick={() => act(selected.id)}
                  >
                    {busy ? "Deleting…" : "Delete permanently"}
                  </button>
                  <button
                    className="button secondary"
                    disabled={busy}
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="message-actions">
                <button
                  className="button secondary"
                  disabled={busy || selected.status === "read"}
                  onClick={() => act(selected.id, "read")}
                >
                  <Check size={16} />
                  Mark as read
                </button>
                <button
                  className="button primary"
                  disabled={busy || selected.status === "contacted"}
                  onClick={() => act(selected.id, "contacted")}
                >
                  <CheckCheck size={16} />
                  Mark as contacted
                </button>
                <button
                  className="button danger"
                  disabled={busy}
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
