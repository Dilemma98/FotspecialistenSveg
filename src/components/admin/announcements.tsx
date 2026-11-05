
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "./announcements.css";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "sjukdom" | "semester" | "öppettider" | "övrigt";
  is_active: boolean;
  start_at: string;
  end_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showManager, setShowManager] = useState(false);
  const [modalView, setModalView] = useState<"list" | "form">("list");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<Announcement["type"]>("övrigt");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation();
  const isAdmin = location.pathname === "/admin/edit";

  function formatDate(date: string) {
    return new Date(date).toLocaleString("sv-SE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  function getStatus(announcement: Announcement) {
    const now = new Date();

    if (!announcement.is_active) {
      return "Utkast";
    }

    if (new Date(announcement.start_at) > now) {
      return "Schemalagt";
    }

    if (announcement.end_at && new Date(announcement.end_at) <= now) {
      return "Avslutat";
    }

    return "Publicerat";
  }

  function toLocalDateTime(date: string) {
    const localDate = new Date(date);
    const offset = localDate.getTimezoneOffset() * 60000;

    return new Date(localDate.getTime() - offset)
      .toISOString()
      .slice(0, 16);
  }

  function editAnnouncement(announcement: Announcement) {
    setEditingId(announcement.id);
    setTitle(announcement.title);
    setMessage(announcement.message);
    setType(announcement.type);
    setStartAt(toLocalDateTime(announcement.start_at));
    setEndAt(
      announcement.end_at
        ? toLocalDateTime(announcement.end_at)
        : "",
    );
    setIsActive(announcement.is_active);
    setErrorMessage("");
    setModalView("form");
  }

  async function fetchAnnouncements() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/announcements", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Kunde inte hämta notiser.");
      }

      const data: Announcement[] = await response.json();

      setAnnouncements(data);
    } catch (error) {
      console.error("Kunde inte hämta notiser:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleAnnouncement(announcement: Announcement) {
    try {
      const response = await fetch(
        `/api/announcements/${announcement.id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: !announcement.is_active,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Kunde inte ändra notisens status.");
      }

      await fetchAnnouncements();
    } catch (error) {
      console.error("Kunde inte ändra notisens status:", error);
      setErrorMessage("Det gick inte att ändra meddelandets status.");
    }
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setMessage("");
    setType("övrigt");
    setStartAt("");
    setEndAt("");
    setIsActive(false);
    setErrorMessage("");
  }

  async function saveAnnouncement(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setErrorMessage("");

    const announcementData = {
      title,
      message,
      type,
      start_at: new Date(startAt).toISOString(),
      end_at: endAt ? new Date(endAt).toISOString() : null,
      is_active: isActive,
    };

    const url = editingId
      ? `/api/announcements/${editingId}`
      : "/api/announcements";

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(announcementData),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.error || "Det gick inte att spara meddelandet.",
        );
      }

      await fetchAnnouncements();

      resetForm();
      setModalView("list");
    } catch (error) {
      console.error("Kunde inte spara meddelandet:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Det gick inte att spara meddelandet.",
      );
    }
  }

  async function deleteAnnouncement(id: string) {
    const confirmed = window.confirm(
      "Är du säker på att du vill ta bort detta meddelande?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Kunde inte ta bort meddelandet.");
      }

      setAnnouncements((current) =>
        current.filter((item) => item.id !== id),
      );
    } catch (error) {
      console.error("Kunde inte ta bort meddelandet:", error);
      setErrorMessage("Det gick inte att ta bort meddelandet.");
    }
  }

  useEffect(() => {
    fetchAnnouncements();
  }, [isAdmin]);

  return (
    <section className="announcements">
      {/* ADMIN */}
      {isAdmin && (
        <>
          <button
            type="button"
            className="openAnnouncementForm"
            onClick={() => {
              setModalView("list");
              setShowManager(true);
              setErrorMessage("");
            }}
          >
            Hantera notiser
          </button>

          {showManager && (
            <div
              className="announcementModalOverlay"
              onClick={() => setShowManager(false)}
            >
              <div
                className="announcementModal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="announcementModalTitle"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="announcementModalHeader">
                  <h2 id="announcementModalTitle">
                    {modalView === "list"
                      ? "Alla notiser"
                      : editingId
                        ? "Redigera meddelande"
                        : "Nytt meddelande"}
                  </h2>

                  <button
                    type="button"
                    className="closeAnnouncementModal"
                    onClick={() => setShowManager(false)}
                    aria-label="Stäng"
                  >
                    ×
                  </button>
                </div>

                {modalView === "list" ? (
                  <>
                    <button
                      type="button"
                      className="createAnnouncementButton"
                      onClick={() => {
                        resetForm();
                        setModalView("form");
                      }}
                    >
                      + Skapa meddelande
                    </button>

                    {isLoading ? (
                      <p>Hämtar meddelanden...</p>
                    ) : announcements.length === 0 ? (
                      <p>Inga meddelanden ännu.</p>
                    ) : (
                      <div className="announcementAdminList">
                        {announcements.map((announcement) => (
                          <article
                            key={announcement.id}
                            className="announcementAdminItem"
                          >
                            <div>
                              <h3>{announcement.title}</h3>
                              <span>{announcement.type}</span>
                              <span className="adminStatus">
                                {getStatus(announcement)}
                              </span>
                            </div>

                            <div className="announcementActions">
                              <button
                                type="button"
                                onClick={() =>
                                  editAnnouncement(announcement)
                                }
                              >
                                Redigera
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleAnnouncement(announcement)
                                }
                              >
                                {announcement.is_active
                                  ? "Inaktivera"
                                  : "Aktivera"}
                              </button>

                              <button
                                type="button"
                                className="deleteAnnouncement"
                                onClick={() =>
                                  deleteAnnouncement(announcement.id)
                                }
                              >
                                Ta bort
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="backToAnnouncements"
                      onClick={() => {
                        resetForm();
                        setModalView("list");
                      }}
                    >
                      ← Till alla notiser
                    </button>

                    <form onSubmit={saveAnnouncement}>
                      <label>
                        Rubrik
                        <input
                          value={title}
                          onChange={(event) =>
                            setTitle(event.target.value)
                          }
                          required
                        />
                      </label>

                      <label>
                        Meddelande
                        <textarea
                          value={message}
                          onChange={(event) =>
                            setMessage(event.target.value)
                          }
                          required
                        />
                      </label>

                      <label>
                        Typ
                        <select
                          value={type}
                          onChange={(event) =>
                            setType(
                              event.target.value as Announcement["type"],
                            )
                          }
                        >
                          <option value="sjukdom">Sjukdom</option>
                          <option value="semester">Semester</option>
                          <option value="öppettider">Öppettider</option>
                          <option value="övrigt">Övrigt</option>
                        </select>
                      </label>

                      <label>
                        Från
                        <input
                          type="datetime-local"
                          value={startAt}
                          onChange={(event) =>
                            setStartAt(event.target.value)
                          }
                          required
                        />
                      </label>

                      <label>
                        Till (valfritt)
                        <input
                          type="datetime-local"
                          value={endAt}
                          onChange={(event) =>
                            setEndAt(event.target.value)
                          }
                          min={startAt || undefined}
                        />
                      </label>

                      <label className="announcementCheckbox">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(event) =>
                            setIsActive(event.target.checked)
                          }
                        />
                        Aktivera meddelandet
                      </label>

                      {errorMessage && <p>{errorMessage}</p>}

                      <button type="submit">
                        {editingId
                          ? "Spara ändringar"
                          : "Spara meddelande"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* PUBLIKA NOTISER */}
      {!isAdmin && !isLoading && announcements.length > 0 && (
        <div className="announcementList">
          {announcements.map((announcement) => (
            <article
              key={announcement.id}
              className="announcement"
            >
              <div className="announcementHeader">
                <h2>{announcement.title}</h2>
                <span className="announcementType">
                  {announcement.type}
                </span>
              </div>

              <p>{announcement.message}</p>

              <div className="announcementInfo">
                <span>Från: {formatDate(announcement.start_at)}</span>
                <span>
                  Till:{" "}
                  {announcement.end_at
                    ? formatDate(announcement.end_at)
                    : "Tills vidare"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
