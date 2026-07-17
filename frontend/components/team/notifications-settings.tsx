import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { NOTIFICATION_CHANNELS, NOTIFICATION_EVENTS } from "./data";

export function NotificationsSettings({ className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [events, setEvents] = useState(NOTIFICATION_EVENTS);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleEvent = (eventId, channelId) => {
    setEvents((prev) => prev.map((e) =>
      e.id === eventId ? { ...e, channels: { ...e.channels, [channelId]: !e.channels[channelId] } } : e
    ));
  };

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Notifications</p>
        </div>

        {/* Channel headers */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
          <div className="flex-1" />
          {NOTIFICATION_CHANNELS.map((ch) => (
            <div key={ch.id} className="w-16 text-center">
              <p className="text-[8px] font-medium uppercase tracking-wider text-muted-foreground/60">{ch.label}</p>
            </div>
          ))}
        </div>

        {/* Event rows */}
        <div className="space-y-1">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-2 py-2 rounded-lg hover:bg-muted/10 transition-colors px-2 -mx-2">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-foreground">{event.label}</p>
                <p className="text-[9px] text-muted-foreground/60">{event.description}</p>
              </div>
              {NOTIFICATION_CHANNELS.map((ch) => (
                <div key={ch.id} className="w-16 flex justify-center">
                  <button
                    onClick={() => toggleEvent(event.id, ch.id)}
                    className={cn(
                      "h-5 w-9 rounded-full transition-all duration-200 relative",
                      event.channels[ch.id] ? "bg-accent" : "bg-muted/30"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                      event.channels[ch.id] ? "translate-x-[18px]" : "translate-x-0.5"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
