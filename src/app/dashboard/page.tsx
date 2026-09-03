"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  CalendarCheck,
  CalendarX,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MailCheck,
  MailWarning,
  MailX,
  Moon,
  MoreVertical,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Sun,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { Reservation, ReservationStatus } from "@/lib/reservations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const REFRESH_MS = 20000;

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function sortKey(r: Reservation): string {
  return `${r.date || "9999-99-99"}T${r.time || "99:99"}`;
}

function formatDate(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr || "—";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const label = date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: "Pendiente",
  accepted: "Confirmada",
  rejected: "Rechazada",
};

const STATUS_BADGE_VARIANT: Record<ReservationStatus, "pending" | "accepted" | "rejected"> = {
  pending: "pending",
  accepted: "accepted",
  rejected: "rejected",
};

const WEEKDAY_LABELS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

type CalendarCell = { day: number; dateStr: string } | null;

function buildCalendarCells(year: number, month: number): CalendarCell[] {
  const pad = (n: number) => String(n).padStart(2, "0");
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const numDays = new Date(year, month + 1, 0).getDate();
  const cells: CalendarCell[] = Array.from({ length: startOffset }, () => null);
  for (let day = 1; day <= numDays; day++) {
    cells.push({ day, dateStr: `${year}-${pad(month + 1)}-${pad(day)}` });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function monthLabel(year: number, month: number): string {
  const label = new Date(year, month, 1).toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// Sant Carles de Peralta, Ibiza.
const WEATHER_LAT = 38.9926;
const WEATHER_LON = 1.5591;

type DayWeather = { max: number; min: number; code: number };

// WMO weather codes (Open-Meteo) collapsed to a simple emoji.
function weatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 57) return "🌦️";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "🌧️";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "❄️";
  if (code >= 95) return "⛈️";
  return "🌡️";
}

const guestHasEmail = (r: Reservation) => !!r.email && r.email !== "—" && r.email.includes("@");

function matchesSearch(r: Reservation, q: string): boolean {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
  return r.name.toLowerCase().includes(needle) || r.phone.toLowerCase().includes(needle);
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("dashboard-theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <Button variant="outline" size="icon" onClick={toggle} aria-label="Cambiar tema">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}

function ReservationCard({
  r,
  busy,
  compact,
  onAccept,
  onReject,
  onRejectAndNotify,
  onUndo,
  onDelete,
}: {
  r: Reservation;
  busy: boolean;
  compact?: boolean;
  onAccept: () => void;
  onReject: () => void;
  onRejectAndNotify: () => void;
  onUndo: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className={compact ? "font-body font-bold text-lg" : "font-body font-bold"} style={{ color: "var(--dash-fg)" }}>
            {compact && r.time ? `${r.time} · ` : ""}
            {r.name}
          </div>
          <div className="flex items-center gap-3 mt-1 font-body text-sm text-muted-foreground">
            {!compact && (
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {formatDate(r.date)}
              </span>
            )}
            {!compact && (
              <span className="flex items-center gap-1">
                <Clock size={14} /> {r.time || "—"}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users size={14} /> {r.guests || "—"}
            </span>
          </div>
        </div>
        <Badge variant={STATUS_BADGE_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-body text-sm mb-2">
        {r.phone && r.phone !== "—" && (
          <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="flex items-center gap-1 font-semibold" style={{ color: "var(--dash-fg)" }}>
            <Phone size={14} /> {r.phone}
          </a>
        )}
        {!compact && r.email && r.email !== "—" && (
          <a href={`mailto:${r.email}`} className="flex items-center gap-1" style={{ color: "var(--dash-fg)" }}>
            <Mail size={14} /> {r.email}
          </a>
        )}
      </div>

      {!compact && r.message && r.message !== "—" && (
        <p className="font-body text-sm mb-3 italic text-muted-foreground">“{r.message}”</p>
      )}

      {r.status === "accepted" && (
        <p className="font-body text-xs mb-3 flex items-center gap-1" style={{ color: "var(--dash-accepted-fg)" }}>
          {r.confirmationSentAt ? (
            <>
              <MailCheck size={13} /> Confirmación enviada
            </>
          ) : (
            <>
              <MailWarning size={13} /> Sin confirmación por correo
            </>
          )}
        </p>
      )}

      {!compact && (
        <div className="flex items-center gap-2">
          {r.status === "pending" ? (
            <Button disabled={busy} onClick={onAccept} className="flex-1">
              <Check size={16} /> Aceptar
            </Button>
          ) : (
            <Button disabled={busy} onClick={onUndo} variant="ghost" size="sm" className="flex-1 justify-start px-0">
              <RotateCcw size={13} /> Deshacer
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={busy} variant="outline" size="icon" aria-label="Más opciones">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {r.status === "pending" && (
                <>
                  <DropdownMenuItem onClick={onReject} className="text-destructive">
                    <X size={14} /> Rechazar
                  </DropdownMenuItem>
                  {/* Explicit second action: rejecting on its own never mails
                      the guest, since it's often settled by phone already. */}
                  <DropdownMenuItem onClick={onRejectAndNotify} className="text-destructive">
                    <MailX size={14} /> Rechazar y avisar
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 size={14} /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {compact && r.status === "pending" && (
        <Button disabled={busy} onClick={onAccept} className="w-full">
          <Check size={16} /> Aceptar
        </Button>
      )}
    </article>
  );
}

export default function DashboardPage() {
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState<"pending" | "upcoming">("pending");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calMonth, setCalMonth] = useState<{ y: number; m: number } | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [weather, setWeather] = useState<Record<string, DayWeather> | null>(null);
  const [closedDates, setClosedDates] = useState<string[] | null>(null);
  const [closureBusy, setClosureBusy] = useState(false);
  // Delete flow: two confirmations in one window (step 1 = what will happen,
  // step 2 = the irreversible bit), because deleting has no undo.
  const [toDelete, setToDelete] = useState<Reservation | null>(null);
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [notifyOnDelete, setNotifyOnDelete] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [toClose, setToClose] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LAT}&longitude=${WEATHER_LON}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe%2FMadrid&forecast_days=16`,
    )
      .then((r) => r.json())
      .then((d) => {
        const days: Record<string, DayWeather> = {};
        const time: string[] = d?.daily?.time ?? [];
        time.forEach((date: string, i: number) => {
          days[date] = {
            max: Math.round(d.daily.temperature_2m_max[i]),
            min: Math.round(d.daily.temperature_2m_min[i]),
            code: d.daily.weathercode[i],
          };
        });
        setWeather(days);
      })
      .catch(() => {});
  }, []);

  async function loadClosures() {
    try {
      const res = await fetch("/api/dashboard/closures", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setClosedDates(data.dates ?? []);
    } catch {
      // Silent — closures are a secondary feature, don't block the dashboard.
    }
  }

  useEffect(() => {
    loadClosures();
  }, []);

  async function toggleClosure(date: string) {
    setClosureBusy(true);
    const isClosed = closedDates?.includes(date);
    try {
      const res = await fetch("/api/dashboard/closures", {
        method: isClosed ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setClosedDates(data.dates ?? []);
    } catch {
      setError("No se pudo actualizar el cierre de ese día.");
    } finally {
      setClosureBusy(false);
    }
  }

  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") as string)?.trim();
    if (!name) {
      setAddError("El nombre es obligatorio.");
      return;
    }
    setAdding(true);
    setAddError("");
    try {
      const res = await fetch("/api/dashboard/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: data.get("phone"),
          email: data.get("email"),
          date: data.get("date"),
          time: data.get("time"),
          guests: data.get("guests"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setReservations((list) => (list ? [json.reservation, ...list] : [json.reservation]));
      form.reset();
      setShowAddForm(false);
    } catch {
      setAddError("No se pudo guardar. Probá de nuevo.");
    } finally {
      setAdding(false);
    }
  }

  async function load() {
    try {
      const res = await fetch("/api/dashboard/reservas", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReservations(data.reservations);
      setError("");
    } catch {
      setError("No se pudo cargar. Reintentando…");
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  async function setStatus(id: string, status: ReservationStatus, notify = false) {
    setPendingIds((s) => new Set(s).add(id));
    setNotice("");
    try {
      const res = await fetch(`/api/dashboard/reservas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notify }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReservations((list) => list?.map((r) => (r.id === id ? data.reservation : r)) ?? list);

      // Accepting mails the customer — tell staff exactly what happened, since
      // a silent failure would leave the guest never hearing back.
      if (status === "accepted" || (status === "rejected" && notify)) {
        const to = data.reservation?.email;
        const hecho = status === "accepted" ? "Confirmada" : "Rechazada";
        if (data.emailSent) {
          setNotice(`${hecho}. Correo enviado a ${to}.`);
        } else if (data.emailError === "no_email") {
          setNotice(`${hecho}. No dejó correo — avisale por teléfono.`);
        } else if (data.emailError === "already_sent") {
          setNotice(`${hecho}. Ya se le había avisado por correo antes.`);
        } else {
          setError(`${hecho}, pero NO se pudo enviar el correo. Avisale por teléfono.`);
        }
      }
    } catch {
      setError("No se pudo actualizar esa reserva. Probá de nuevo.");
    } finally {
      setPendingIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  }

  async function confirmClosure() {
    const date = toClose;
    if (!date) return;
    await toggleClosure(date);
    setToClose(null);
    setNotice(`Cerrado el ${formatDate(date)}. La web ya no acepta reservas para ese día.`);
  }

  function askDelete(r: Reservation) {
    setToDelete(r);
    setDeleteStep(1);
    // Notifying is the common case (a real booking falling through); it gets
    // unticked for test rows and duplicates, where mailing the guest would
    // only confuse them.
    setNotifyOnDelete(guestHasEmail(r));
    setError("");
    setNotice("");
  }

  async function confirmDelete() {
    const r = toDelete;
    if (!r) return;
    setDeleting(true);
    setError("");
    try {
      const notify = notifyOnDelete && guestHasEmail(r);
      const res = await fetch(`/api/dashboard/reservas/${r.id}${notify ? "?notify=1" : ""}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        // The server refuses to delete when a requested mail failed, so the
        // booking is still there to retry or handle by phone.
        setError(
          data?.error === "email_failed"
            ? "No se pudo enviar el correo, así que NO se eliminó nada. Llamá al cliente y volvé a intentar."
            : "No se pudo eliminar esa reserva. Probá de nuevo.",
        );
        return;
      }
      setReservations((list) => list?.filter((x) => x.id !== r.id) ?? list);
      setNotice(
        data?.emailSent
          ? `Reserva de ${r.name} eliminada y avisada por correo. Llamalo igual al ${r.phone} para explicarle.`
          : `Reserva de ${r.name} eliminada.${notify ? " No se le pudo avisar por correo." : ""}`,
      );
      setToDelete(null);
    } catch {
      setError("No se pudo eliminar esa reserva. Probá de nuevo.");
    } finally {
      setDeleting(false);
    }
  }

  const today = todayISO();
  const [todayY, todayMNum] = today.split("-").map(Number);
  const { y: calY, m: calM } = calMonth ?? { y: todayY, m: todayMNum - 1 };

  function shiftMonth(delta: number) {
    setCalMonth(() => {
      const total = calY * 12 + calM + delta;
      return { y: Math.floor(total / 12), m: ((total % 12) + 12) % 12 };
    });
  }

  const countsByDate: Record<string, { total: number; pending: number }> = {};
  for (const r of reservations ?? []) {
    if (!r.date) continue;
    const c = countsByDate[r.date] ?? { total: 0, pending: 0 };
    c.total++;
    if (r.status === "pending") c.pending++;
    countsByDate[r.date] = c;
  }
  const calendarCells = buildCalendarCells(calY, calM);

  const todays = (reservations ?? []).filter((r) => r.date === today);
  const guestsSum = todays.reduce((sum, r) => sum + (parseInt(r.guests, 10) || 0), 0);
  const pendingCount = (reservations ?? []).filter((r) => r.status === "pending").length;
  const todayAccepted = todays.filter((r) => r.status === "accepted").length;
  const todayPending = todays.filter((r) => r.status === "pending").length;

  // With hundreds of backfilled bookings, a flat "everything" list is useless
  // on a phone: the default view is upcoming only, and history is reached
  // either by tapping a day in the calendar or by searching (searching spans
  // everything, since "that guest who came in July" is a real lookup).
  const searching = search.trim().length > 0;
  const list = (reservations ?? [])
    .filter((r) => {
      if (selectedDate) return r.date === selectedDate;
      if (searching) return true;
      if (filter === "pending") return r.status === "pending";
      return r.date >= today;
    })
    .filter((r) => matchesSearch(r, search))
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  const serviceList = todays
    .filter((r) => r.status !== "rejected")
    .filter((r) => matchesSearch(r, search))
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  return (
    <main className="mx-auto w-full" style={{ maxWidth: 560, padding: "1.25rem 1rem 4rem" }}>
      <Tabs defaultValue="panel">
        <div className="flex items-center justify-between mb-4 gap-2">
          <h1 className="font-body font-bold text-2xl" style={{ color: "var(--dash-fg)" }}>
            Reservas
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={showAddForm} onOpenChange={setShowAddForm}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus size={14} /> Agregar
                </Button>
              </SheetTrigger>
              <SheetContent fullScreen>
                <SheetHeader>
                  <SheetTitle>Agregar reserva</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
                  <div>
                    <Label htmlFor="add-name">Nombre</Label>
                    <Input id="add-name" name="name" type="text" required placeholder="Nombre del cliente" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="add-phone">Teléfono</Label>
                      <Input id="add-phone" name="phone" type="tel" placeholder="600 000 000" />
                    </div>
                    <div>
                      <Label htmlFor="add-email">Correo</Label>
                      <Input id="add-email" name="email" type="email" placeholder="correo@ej.com" />
                    </div>
                    <div>
                      <Label htmlFor="add-date">Día</Label>
                      <Input id="add-date" name="date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="add-time">Hora</Label>
                      <Input id="add-time" name="time" type="time" />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="add-guests">Personas</Label>
                      <Input id="add-guests" name="guests" type="text" inputMode="numeric" placeholder="2" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="add-message">Mensaje</Label>
                    <Textarea id="add-message" name="message" rows={2} placeholder="Notas, alergias…" />
                  </div>
                  {addError && <p className="font-body text-sm text-destructive">{addError}</p>}
                  <Button type="submit" disabled={adding} size="lg" className="w-full">
                    {adding ? "Guardando…" : "Guardar reserva"}
                  </Button>
                </form>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <TabsList className="mb-5">
          <TabsTrigger value="panel">Panel</TabsTrigger>
          <TabsTrigger value="service">Servicio de hoy</TabsTrigger>
        </TabsList>

        <div className="relative mb-5">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o teléfono…"
            className="pl-9"
          />
        </div>

        {error && <p className="text-sm mb-4 text-destructive font-body font-semibold">{error}</p>}

        {notice && (
          <p
            className="text-sm mb-4 font-body rounded-md px-3 py-2"
            style={{ background: "var(--dash-accepted-bg)", color: "var(--dash-accepted-fg)" }}
          >
            {notice}
          </p>
        )}

        <TabsContent value="panel">
          {/* Informe del día */}
          <section
            className="mb-6 rounded-2xl p-5"
            style={{ background: "var(--dash-primary)", color: "var(--dash-primary-fg)" }}
          >
            <div className="eyebrow text-xs opacity-65 mb-2">Informe de hoy · {formatDate(today)}</div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-2xl font-bold">{todays.length}</div>
                <div className="text-xs opacity-65">Reservas</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{guestsSum || "—"}</div>
                <div className="text-xs opacity-65">Personas</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: "var(--dash-stat-pending)" }}>
                  {todayPending}
                </div>
                <div className="text-xs opacity-65">Pendientes</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: "var(--dash-stat-accepted)" }}>
                  {todayAccepted}
                </div>
                <div className="text-xs opacity-65">Confirmadas</div>
              </div>
            </div>
          </section>

          {/* Calendar */}
          <section className="mb-5 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <Button variant="ghost" size="icon" onClick={() => shiftMonth(-1)} aria-label="Mes anterior">
                <ChevronLeft size={18} />
              </Button>
              <div className="font-body font-bold text-sm" style={{ color: "var(--dash-fg)" }}>
                {monthLabel(calY, calM)}
              </div>
              <Button variant="ghost" size="icon" onClick={() => shiftMonth(1)} aria-label="Mes siguiente">
                <ChevronRight size={18} />
              </Button>
            </div>
            <div className="grid grid-cols-7 mb-1 text-center font-body text-xs font-bold text-muted-foreground">
              {WEEKDAY_LABELS.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((cell, i) => {
                if (!cell) return <div key={`blank-${i}`} />;
                const counts = countsByDate[cell.dateStr];
                const isSelected = selectedDate === cell.dateStr;
                const isToday = cell.dateStr === today;
                const isClosed = closedDates?.includes(cell.dateStr);
                return (
                  <button
                    key={cell.dateStr}
                    onClick={() => setSelectedDate(isSelected ? null : cell.dateStr)}
                    className="flex flex-col items-center justify-center font-body rounded-lg"
                    style={{
                      aspectRatio: "1",
                      // A closed day has to read as closed even while it's the
                      // selected one — that's the moment right after you close it.
                      background: isClosed
                        ? isSelected
                          ? "var(--dash-destructive)"
                          : "rgba(162,34,51,0.12)"
                        : isSelected
                          ? "var(--dash-primary)"
                          : "transparent",
                      color: isClosed
                        ? isSelected
                          ? "var(--dash-destructive-fg)"
                          : "var(--dash-destructive)"
                        : isSelected
                          ? "var(--dash-primary-fg)"
                          : "var(--dash-fg)",
                      border: isToday && !isSelected ? "1px solid var(--dash-fg)" : "1px solid transparent",
                      fontSize: "0.8rem",
                      fontWeight: isToday ? 700 : 500,
                      textDecoration: isClosed ? "line-through" : "none",
                    }}
                  >
                    {cell.day}
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        marginTop: 2,
                        background: !counts
                          ? "transparent"
                          : isSelected
                            ? "var(--dash-primary-fg)"
                            : counts.pending > 0
                              ? "#C9922E"
                              : "#5B8A57",
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </section>

          {/* Filter tabs / selected-day header */}
          {selectedDate ? (
            <div className="flex items-center justify-between mb-4 gap-2">
              <div>
                <div className="font-body font-bold text-sm" style={{ color: "var(--dash-fg)" }}>
                  Reservas del {formatDate(selectedDate)}
                </div>
                {weather?.[selectedDate] && (
                  <div className="font-body text-xs text-muted-foreground">
                    {weatherEmoji(weather[selectedDate].code)} {weather[selectedDate].max}°/{weather[selectedDate].min}°
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="flex items-center gap-1 font-body text-sm text-muted-foreground flex-shrink-0"
              >
                <X size={13} /> Ver todas
              </button>
            </div>
          ) : null}

          {/* Cerrar reservas de un día: acción de peso, así que va en su propio
              botón a lo ancho (antes era un enlace chico al lado de otro, muy
              fácil de tocar por error) y pasa por una confirmación. */}
          {selectedDate ? (
            <div className="mb-4">
              {closedDates?.includes(selectedDate) ? (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={closureBusy}
                  onClick={() => toggleClosure(selectedDate)}
                >
                  <CalendarCheck size={16} /> Reabrir reservas de este día
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={closureBusy}
                  onClick={() => setToClose(selectedDate)}
                  style={{ color: "var(--dash-destructive)", borderColor: "var(--dash-destructive)" }}
                >
                  <CalendarX size={16} /> Cerrar reservas de este día
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-4">
              {(["pending", "upcoming"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f && !searching ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setFilter(f)}
                >
                  {f === "pending" ? `Pendientes (${pendingCount})` : "Próximas"}
                </Button>
              ))}
              {searching && <span className="font-body text-xs text-muted-foreground">buscando en todo el historial</span>}
            </div>
          )}

          {reservations === null && !error && <p className="font-body text-sm text-muted-foreground">Cargando…</p>}

          {reservations !== null && list.length === 0 && (
            <p className="font-body text-sm text-muted-foreground">
              {selectedDate
                ? "No hay reservas ese día."
                : search
                  ? "No hay resultados para esa búsqueda."
                  : filter === "pending"
                    ? "No hay reservas pendientes. 🎉"
                    : "No hay reservas próximas. Tocá un día en el calendario para ver el historial."}
            </p>
          )}

          <div className="flex flex-col gap-3">
            {list.map((r) => (
              <ReservationCard
                key={r.id}
                r={r}
                busy={pendingIds.has(r.id)}
                onAccept={() => setStatus(r.id, "accepted")}
                onReject={() => setStatus(r.id, "rejected")}
                onRejectAndNotify={() => setStatus(r.id, "rejected", true)}
                onUndo={() => setStatus(r.id, "pending")}
                onDelete={() => askDelete(r)}
              />
            ))}
          </div>

          {/* Próximos días — weather, for planning ahead */}
          {weather && (
            <section className="mt-6 mb-6">
              <div className="eyebrow text-xs text-muted-foreground mb-2">Próximos días · Sant Carles</div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(todayY, todayMNum - 1, Number(today.split("-")[2]) + i);
                  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                  const w = weather[dateStr];
                  const label = d.toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "");
                  return (
                    <div
                      key={dateStr}
                      className="flex flex-col items-center flex-shrink-0 font-body rounded-lg border border-border bg-card px-3 py-2.5"
                      style={{ minWidth: 62 }}
                    >
                      <div className="text-xs font-bold uppercase text-muted-foreground">
                        {i === 0 ? "Hoy" : label.charAt(0).toUpperCase() + label.slice(1)}
                      </div>
                      <div className="text-xl my-0.5">{w ? weatherEmoji(w.code) : "–"}</div>
                      <div className="text-sm font-bold" style={{ color: "var(--dash-fg)" }}>
                        {w ? `${w.max}°` : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">{w ? `${w.min}°` : ""}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </TabsContent>

        <TabsContent value="service">
          <p className="font-body text-sm text-muted-foreground mb-4">
            Solo las reservas de hoy ({formatDate(today)}), ordenadas por hora — para tener a mano durante el servicio.
          </p>
          {reservations === null && !error && <p className="font-body text-sm text-muted-foreground">Cargando…</p>}
          {reservations !== null && serviceList.length === 0 && (
            <p className="font-body text-sm text-muted-foreground">
              {search ? "No hay resultados para esa búsqueda." : "No hay reservas para hoy."}
            </p>
          )}
          <div className="flex flex-col gap-3">
            {serviceList.map((r) => (
              <ReservationCard
                key={r.id}
                r={r}
                busy={pendingIds.has(r.id)}
                compact
                onAccept={() => setStatus(r.id, "accepted")}
                onReject={() => setStatus(r.id, "rejected")}
                onRejectAndNotify={() => setStatus(r.id, "rejected", true)}
                onUndo={() => setStatus(r.id, "pending")}
                onDelete={() => askDelete(r)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Cerrar reservas de un día */}
      <Dialog open={!!toClose} onOpenChange={(open) => !open && setToClose(null)}>
        <DialogContent>
          {toClose && (
            <>
              <DialogTitle>¿Cerrar las reservas de este día?</DialogTitle>
              <DialogDescription>
                {formatDate(toClose)}
                {countsByDate[toClose] ? ` · ya hay ${countsByDate[toClose].total} reserva(s) ese día` : ""}
              </DialogDescription>
              <p className="mt-3 font-body text-sm" style={{ color: "var(--dash-fg)" }}>
                La web va a dejar de aceptar reservas para ese día: quien lo elija va a ver un aviso
                pidiéndole que llame o escriba.
              </p>
              {countsByDate[toClose]?.total ? (
                <p
                  className="mt-3 font-body text-sm rounded-md px-3 py-2"
                  style={{ background: "var(--dash-pending-bg)", color: "var(--dash-pending-fg)" }}
                >
                  Ojo: las {countsByDate[toClose].total} reserva(s) que ya tenés para ese día no se cancelan
                  ni se avisa a nadie. Si el día no se abre, avisales vos.
                </p>
              ) : null}
              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="flex-1" disabled={closureBusy} onClick={() => setToClose(null)}>
                  No, dejarlo abierto
                </Button>
                <Button variant="destructive" className="flex-1" disabled={closureBusy} onClick={confirmClosure}>
                  {closureBusy ? "Cerrando…" : "Sí, cerrar"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Eliminar: dos confirmaciones, porque no hay Deshacer */}
      <Dialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent>
          {toDelete && deleteStep === 1 && (
            <>
              <DialogTitle>Eliminar reserva</DialogTitle>
              <DialogDescription>
                {toDelete.name} · {formatDate(toDelete.date)} · {toDelete.time} · {toDelete.guests} pers.
              </DialogDescription>

              {guestHasEmail(toDelete) ? (
                <label className="flex items-start gap-2 mt-4 font-body text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyOnDelete}
                    onChange={(e) => setNotifyOnDelete(e.target.checked)}
                    className="mt-0.5 shrink-0"
                  />
                  <span style={{ color: "var(--dash-fg)" }}>
                    Avisar al cliente por correo que su reserva queda cancelada
                    <span className="block text-xs text-muted-foreground">
                      Destildá esto si es una prueba o un duplicado — no conviene avisarle a alguien que sí tiene mesa.
                    </span>
                  </span>
                </label>
              ) : (
                <p className="mt-4 font-body text-xs text-muted-foreground">
                  Esta reserva no tiene correo, así que no se le puede avisar por mail. Llamalo al {toDelete.phone}.
                </p>
              )}

              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="flex-1" onClick={() => setToDelete(null)}>
                  Cancelar
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => setDeleteStep(2)}>
                  Continuar
                </Button>
              </div>
            </>
          )}

          {toDelete && deleteStep === 2 && (
            <>
              <DialogTitle>¿Seguro? Esto no se puede deshacer</DialogTitle>
              <DialogDescription>
                Se va a borrar la reserva de <strong>{toDelete.name}</strong> definitivamente
                {notifyOnDelete && guestHasEmail(toDelete)
                  ? ", y se le va a enviar un correo avisándole que queda cancelada."
                  : ", sin avisarle nada al cliente."}
              </DialogDescription>
              {notifyOnDelete && guestHasEmail(toDelete) && (
                <p className="mt-3 font-body text-sm rounded-md px-3 py-2" style={{ background: "var(--dash-pending-bg)", color: "var(--dash-pending-fg)" }}>
                  Después llamalo al {toDelete.phone} y explicale — un correo solo puede quedar frío.
                </p>
              )}
              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="flex-1" disabled={deleting} onClick={() => setDeleteStep(1)}>
                  Volver
                </Button>
                <Button variant="destructive" className="flex-1" disabled={deleting} onClick={confirmDelete}>
                  {deleting ? "Eliminando…" : "Sí, eliminar"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
