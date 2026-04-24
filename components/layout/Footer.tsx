export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-space-950/80 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 text-sm text-slate-400 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Solar Explorer. Данные:{" "}
            <a
              className="text-accent-cyan hover:underline"
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noreferrer"
            >
              NASA Open APIs
            </a>
            , текстуры — Solar System Scope (CC BY 4.0) и NASA Visible Earth.
          </p>
          <p className="text-xs text-slate-500">
            Образовательный проект. Размеры и дистанции адаптированы для наглядности.
          </p>
        </div>
      </div>
    </footer>
  );
}
