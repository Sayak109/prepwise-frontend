export function AppFooter() {
  return (
    <footer className="border-t mt-8">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground flex flex-col gap-2 sm:flex-row sm:justify-between">
        <p>PrepWise by Your Name</p>
        <div className="flex gap-4">
          <a href="https://github.com/your-username" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          <a href="https://linkedin.com/in/your-username" target="_blank" rel="noreferrer" className="hover:text-foreground">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
