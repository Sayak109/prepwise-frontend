"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Calculator, Minus, UserCircle2, X } from "lucide-react";
import styles from "@/components/layout/student-top-nav.module.css";
import { logoutAction } from "@/app/actions/auth";
import { AUTH_COOKIE } from "@/lib/constants";

function readAuthTokenPresent(): boolean {
  if (typeof document === "undefined") return false;
  const row = document.cookie.split("; ").find((r) => r.startsWith(`${AUTH_COOKIE}=`));
  const raw = row?.split("=")[1];
  return Boolean(raw && decodeURIComponent(raw).length > 0);
}

const menu = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/topics", label: "Topics" },
  { href: "/tests", label: "Mock test" },
];

export function StudentTopNav({
  subtitle,
  rightSlot,
  navigationGuard,
}: {
  subtitle?: string;
  rightSlot?: ReactNode;
  navigationGuard?: (href: string) => void;
}) {
  const pathname = usePathname();
  const [authPresent, setAuthPresent] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcExpr, setCalcExpr] = useState("");
  const [calcResult, setCalcResult] = useState("0");
  const [calcPos, setCalcPos] = useState({ x: 24, y: 88 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const profileRef = useRef<HTMLDivElement | null>(null);
  const calcRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAuthPresent(readAuthTokenPresent());
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const w = 320;
      const h = 420;
      const nextX = Math.min(
        Math.max(8, e.clientX - dragOffset.current.x),
        window.innerWidth - w - 8,
      );
      const nextY = Math.min(
        Math.max(72, e.clientY - dragOffset.current.y),
        window.innerHeight - h - 8,
      );
      setCalcPos({ x: nextX, y: nextY });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  const appendCalc = (value: string) => {
    if (value === "." && /(^|[+\-*/])\d*\.\d*$/.test(calcExpr)) return;
    setCalcExpr((prev) => `${prev}${value}`);
  };

  const clearCalc = () => {
    setCalcExpr("");
    setCalcResult("0");
  };

  const backspaceCalc = () => {
    setCalcExpr((prev) => prev.slice(0, -1));
  };

  const evalCalc = () => {
    try {
      if (!calcExpr.trim()) return;
      if (!/^[\d+\-*/().\s]+$/.test(calcExpr)) return;
      // eslint-disable-next-line no-new-func
      const value = Function(`"use strict"; return (${calcExpr})`)();
      if (typeof value !== "number" || !Number.isFinite(value)) {
        setCalcResult("Error");
        return;
      }
      setCalcResult(String(value));
      setCalcExpr(String(value));
    } catch {
      setCalcResult("Error");
    }
  };

  const calculatorAllowed =
    pathname.startsWith("/practice/") ||
    pathname.startsWith("/tests/") ||
    pathname.startsWith("/test/");

  const calculatorButton = (
    <button
      className={styles.calcButton}
      type="button"
      onClick={() => setCalcOpen((v) => !v)}
      aria-pressed={calcOpen}
    >
      <Calculator size={16} />
      Calculator
    </button>
  );

  const defaultRight = (
    <>
      {calculatorAllowed ? calculatorButton : null}
      <button className={styles.proButton} type="button">
        Upgrade Pro
      </button>
      {authPresent ? (
        <>
          <div className={styles.iconGroup}>
            <button type="button" className={styles.iconBtn} aria-label="Notifications">
              <Bell size={18} />
            </button>
          </div>
          <div className={styles.profileWrap} ref={profileRef}>
            <button
              type="button"
              className={styles.avatarBtn}
              aria-label="Profile menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((v) => !v)}
            >
              <UserCircle2 size={20} />
            </button>
            {profileOpen ? (
              <div className={styles.profileMenu}>
                <Link href="/profile" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                  My Profile
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className={styles.profileMenuItemDanger}>
                    Logout
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </>
  );

  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.left}>
          <Link href="/dashboard" className={styles.brand}>
            PrepWise
          </Link>
          {subtitle ? (
            <>
              <span className={styles.separator} />
              <p className={styles.subtitle}>{subtitle}</p>
            </>
          ) : null}
          <nav className={styles.nav}>
            {menu.map((item) => {
              const active =
                (item.href === "/dashboard" && pathname.startsWith("/dashboard")) ||
                (item.href === "/topics" && (pathname.startsWith("/topics") || pathname.startsWith("/practice"))) ||
                (item.href === "/tests" &&
                  (pathname.startsWith("/tests") || pathname.startsWith("/test"))) ||
                pathname === item.href;
              return (
                navigationGuard ? (
                  <button
                    key={item.href}
                    type="button"
                    className={`${styles.navBtn} ${active ? styles.active : ""}`}
                    onClick={() => navigationGuard(item.href)}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link key={item.href} href={item.href} className={active ? styles.active : ""}>
                    {item.label}
                  </Link>
                )
              );
            })}
          </nav>
        </div>
        <div className={styles.right}>
          {rightSlot ? (
            <>
              {calculatorAllowed ? calculatorButton : null}
              {rightSlot}
            </>
          ) : (
            defaultRight
          )}
        </div>
      </header>

      {calcOpen && calculatorAllowed ? (
        <div
          ref={calcRef}
          className={styles.calcPanel}
          style={{ left: calcPos.x, top: calcPos.y }}
        >
          <div
            className={styles.calcHead}
            onMouseDown={(e) => {
              const rect = calcRef.current?.getBoundingClientRect();
              dragOffset.current = {
                x: e.clientX - (rect?.left ?? calcPos.x),
                y: e.clientY - (rect?.top ?? calcPos.y),
              };
              setDragging(true);
            }}
          >
            <div className={styles.calcTitle}>
              <Calculator size={14} />
               Calculator
            </div>
            <div className={styles.calcHeadActions}>
              <button type="button" className={styles.calcIconBtn} onClick={() => setCalcOpen(false)}>
                <Minus size={14} />
              </button>
              <button type="button" className={styles.calcIconBtn} onClick={() => setCalcOpen(false)}>
                <X size={14} />
              </button>
            </div>
          </div>

          <div className={styles.calcDisplay}>
            <p className={styles.calcExpr}>{calcExpr || "0"}</p>
            <p className={styles.calcResult}>{calcResult}</p>
          </div>

          <div className={styles.calcGrid}>
            <button type="button" className={styles.calcBtnSoft} onClick={clearCalc}>AC</button>
            <button type="button" className={styles.calcBtnSoft} onClick={backspaceCalc}>⌫</button>
            <button type="button" className={styles.calcBtnSoft} onClick={() => appendCalc("(")}>(</button>
            <button type="button" className={styles.calcBtnOp} onClick={() => appendCalc(")")}>)</button>

            <button type="button" className={styles.calcBtn} onClick={() => appendCalc("7")}>7</button>
            <button type="button" className={styles.calcBtn} onClick={() => appendCalc("8")}>8</button>
            <button type="button" className={styles.calcBtn} onClick={() => appendCalc("9")}>9</button>
            <button type="button" className={styles.calcBtnOp} onClick={() => appendCalc("/")}>÷</button>

            <button type="button" className={styles.calcBtn} onClick={() => appendCalc("4")}>4</button>
            <button type="button" className={styles.calcBtn} onClick={() => appendCalc("5")}>5</button>
            <button type="button" className={styles.calcBtn} onClick={() => appendCalc("6")}>6</button>
            <button type="button" className={styles.calcBtnOp} onClick={() => appendCalc("*")}>×</button>

            <button type="button" className={styles.calcBtn} onClick={() => appendCalc("1")}>1</button>
            <button type="button" className={styles.calcBtn} onClick={() => appendCalc("2")}>2</button>
            <button type="button" className={styles.calcBtn} onClick={() => appendCalc("3")}>3</button>
            <button type="button" className={styles.calcBtnOp} onClick={() => appendCalc("-")}>−</button>

            <button type="button" className={styles.calcBtnWide} onClick={() => appendCalc("0")}>0</button>
            <button type="button" className={styles.calcBtn} onClick={() => appendCalc(".")}>.</button>
            <button type="button" className={styles.calcBtnOp} onClick={() => appendCalc("+")}>+</button>

            <button type="button" className={styles.calcBtnEq} onClick={evalCalc}>=</button>
          </div>
        </div>
      ) : null}
    </>
  );
}
