import Link from "next/link";
import { getCourse } from "@/lib/content";
import { ContinueLink, DoneMark, ModuleCount } from "@/components/ProgressBadge";

export const dynamic = "force-dynamic";

export default function Home() {
  const { modules, errors } = getCourse();
  const core = modules.filter((m) => m.track === "core");
  const fundamentals = modules.filter((m) => m.track === "fundamentals");
  const order = core.flatMap((m) => m.lessons.map((l) => l.id));
  const titles = Object.fromEntries(core.flatMap((m) => m.lessons).map((l) => [l.id, l.title]));

  return (
    <div className="page">
      <section className="hero">
        <h1>Learn to work with AI, by doing</h1>
        <p>
          Each lesson is a short read followed by a puzzle you solve with a real model. Start with the on-ramp; no experience
          needed beyond having tried a chat assistant.
        </p>
        <div className="row">
          {order[0] && <Link className="btn primary" href={`/lessons/${order[0]}`}>Start with {order[0]}</Link>}
          <ContinueLink order={order} titles={titles} />
        </div>
      </section>

      {errors.length > 0 && (
        <p className="notice" role="alert">{errors.length} puzzle file{errors.length > 1 ? "s" : ""} could not be loaded; see /api/health.</p>
      )}

      <h2 className="track">Core track</h2>
      <ModuleGrid modules={core} />

      {fundamentals.length > 0 && (
        <>
          <h2 className="track">Optional: how models work</h2>
          <p className="note">Math, computer science, hardware and architecture for the curious. The core track never requires it.</p>
          <ModuleGrid modules={fundamentals} />
        </>
      )}
    </div>
  );
}

function ModuleGrid({ modules }: { modules: ReturnType<typeof getCourse>["modules"] }) {
  return (
    <div className="modules">
      {modules.map((m) => (
        <section className="card" key={m.key}>
          <div className="mhead">
            <h3>{m.track === "core" && /^\d$/.test(m.key) ? `Module ${m.key}. ` : ""}{m.title}</h3>
            <ModuleCount ids={m.lessons.map((l) => l.id)} />
          </div>
          <ol className="lessons">
            {m.lessons.map((l) => (
              <li key={l.id}>
                <DoneMark id={l.id} />
                <Link href={`/lessons/${l.id}`}><span className="lid">{l.id}</span> {l.title}</Link>
                {l.runnable && <span className="chip">puzzle</span>}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
