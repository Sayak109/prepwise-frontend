export function AppFooter() {
  return (
    <footer className="bg-white border-t border-[#e4e1eb] py-8 px-6 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <span className="text-sm font-bold text-[#1f108e]">PrepWise</span>
          <p className="text-xs text-[#777584]">
            © 2024 PrepWise. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6 text-xs text-[#777584]">
          <a className="hover:text-[#1f108e] transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-[#1f108e] transition-colors" href="#">
            Terms of Service
          </a>
          <a className="hover:text-[#1f108e] transition-colors" href="#">
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
}
