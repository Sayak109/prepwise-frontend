export function AppFooter() {
  return (
    <footer className="bg-white border-t border-[#e4e1eb] py-8 px-6 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <span className="text-sm font-bold text-[#1f108e]">PrepWise</span>
          <p className="text-xs text-[#777584]">
            © {new Date().getFullYear()} PrepWise. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[#777584]">
          <a
            className="font-semibold text-[#1b1b22] hover:text-[#1f108e] transition-colors"
            href="https://sayak-panda.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sayak Panda
          </a>
          <a
            className="hover:text-[#1f108e] transition-colors"
            href="https://github.com/Sayak109"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            className="hover:text-[#1f108e] transition-colors"
            href="https://www.linkedin.com/in/sayak-panda-ba0859263/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
