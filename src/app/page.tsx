"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { api } from "~/trpc/react";

const moods = [
  { id: "good", label: "Lancar", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { id: "normal", label: "Biasa", color: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  { id: "blocked", label: "Terhambat", color: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
] as const;

export default function Home() {
  const { data: session } = useSession();
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<"good" | "normal" | "blocked">("normal");

  const feed = api.update.list.useQuery({ workspaceSlug: "demo" }, { retry: false });
  const create = api.update.create.useMutation({
    onSuccess: () => {
      setBody("");
      void feed.refetch();
    },
  });

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-14">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Sprint</h1>
          <p className="mt-1 text-sm text-slate-400">Standup async untuk tim kecil</p>
        </div>
        {session?.user ? (
          <button onClick={() => signOut()} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300">
            Keluar
          </button>
        ) : (
          <button
            onClick={() => signIn("credentials", { email: "demo@sprint.dev" })}
            className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950"
          >
            Masuk
          </button>
        )}
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Apa yang selesai hari ini?"
          className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm outline-none focus:border-sky-500"
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            {moods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                className={`rounded-lg border px-3 py-1.5 text-xs ${m.color} ${mood === m.id ? "ring-1 ring-current" : "opacity-60"}`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <button
            disabled={!session?.user || body.trim().length < 3 || create.isPending}
            onClick={() => create.mutate({ workspaceSlug: "demo", body, mood })}
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-40"
          >
            Kirim
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        {(feed.data ?? []).map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{item.member.name}</span>
              <span>{new Date(item.createdAt).toLocaleString("id-ID")}</span>
            </div>
            <p className="mt-2 text-sm text-slate-200">{item.body}</p>
          </article>
        ))}
        {feed.data?.length === 0 && <p className="text-sm text-slate-500">Belum ada update.</p>}
      </section>
    </main>
  );
}
