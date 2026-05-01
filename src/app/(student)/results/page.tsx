import {
  CalendarCheck2,
  ChartColumnBig,
  CircleAlert,
  Home,
  BookOpen,
  Medal,
  Sparkles,
  Clock3,
  Timer,
  TrendingUp,
} from "lucide-react";
import styles from "@/app/(student)/results/results.module.css";
import { StudentTopNav } from "@/components/layout/student-top-nav";
import { AppFooter } from "@/components/layout/app-footer";
import { fetchAttemptHistory } from "@/services/server-student-api";

export default async function ResultsPage() {
  const history = await fetchAttemptHistory();
  const attempts = history.attempts;
  const latestAttempt = attempts[0];
  const overall = attempts.length
    ? Math.round(attempts.reduce((sum, item) => sum + item.scorePercent, 0) / attempts.length)
    : 0;

  const topicAccuracy = [
    { name: "Algebra & Functions", score: 90, color: "high" },
    { name: "Geometry & Trig", score: 60, color: "low" },
    { name: "Data Analysis & Stats", score: 75, color: "mid" },
    { name: "Critical Reading", score: 85, color: "high" },
  ];

  const bars = [40, 70, 95, 60, 45];

  return (
    <div className={styles.page}>
      <StudentTopNav />

      <main className={styles.main}>
        <section className={styles.heading}>
          <p className={styles.completed}>
            <CalendarCheck2 size={14} />
            Completed: {latestAttempt?.title ?? "No completed test yet"}
          </p>
          <h1>Performance Summary</h1>
          <p>
            Excellent effort! You have improved your overall score by 12% since your
            last attempt. Review your subject accuracy below to prioritize your study
            hours.
          </p>
        </section>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.mastery}`}>
            <h3>Overall Proficiency</h3>
            <div className={styles.ringWrap}>
              <svg className={styles.ringSvg} viewBox="0 0 220 220">
                <circle cx="110" cy="110" r="94" className={styles.ringBg} />
                <circle
                  cx="110"
                  cy="110"
                  r="94"
                  className={styles.ringValue}
                  strokeDasharray="590"
                  strokeDashoffset={590 - 590 * (overall / 100)}
                />
              </svg>
              <div className={styles.ringText}>
                <span>{overall}%</span>
                <small>Mastery Level</small>
              </div>
            </div>
            <div className={styles.kpiGrid}>
              <div>
                <p>Score</p>
                <strong>1280</strong>
              </div>
              <div>
                <p>Rank</p>
                <strong>Top 15%</strong>
              </div>
            </div>
          </article>

          <article className={`${styles.card} ${styles.topicBreakdown}`}>
            <div className={styles.cardHead}>
              <h3>Topic Accuracy</h3>
              <div className={styles.legend}>
                <span><i className={styles.dotHigh} />High</span>
                <span><i className={styles.dotMid} />Moderate</span>
              </div>
            </div>
            <div className={styles.topics}>
              {topicAccuracy.map((topic) => (
                <div key={topic.name} className={styles.topicItem}>
                  <div className={styles.topicLabel}>
                    <span>{topic.name}</span>
                    <strong
                      className={
                        topic.color === "low"
                          ? styles.lowText
                          : topic.color === "mid"
                            ? styles.midText
                            : styles.highText
                      }
                    >
                      {topic.score}%
                    </strong>
                  </div>
                  <div className={styles.track}>
                    <div
                      className={`${styles.fill} ${
                        topic.color === "low"
                          ? styles.fillLow
                          : topic.color === "mid"
                            ? styles.fillMid
                            : styles.fillHigh
                      }`}
                      style={{ width: `${topic.score}%` }}
                    />
                  </div>
                  {topic.color === "low" ? (
                    <p className={styles.warn}><CircleAlert size={13} />Focus recommended</p>
                  ) : null}
                </div>
              ))}
            </div>
          </article>

          <article className={`${styles.card} ${styles.timeCard}`}>
            <h3>Time Spent per Question</h3>
            <div className={styles.barWrap}>
              {bars.map((h, idx) => (
                <div key={h} className={styles.barCol}>
                  <div
                    className={`${styles.bar} ${idx === 2 ? styles.barMain : ""}`}
                    style={{ height: `${h}%` }}
                  />
                  <span>Q{idx * 10 + 1}-{idx * 10 + 10}</span>
                </div>
              ))}
            </div>
            <div className={styles.timeFoot}>
              <p>Average Time: <strong>48s / question</strong></p>
              <p><Timer size={14} />Slowing down on Geometry (Q21-30)</p>
            </div>
          </article>

          <article className={`${styles.card} ${styles.ctaCard}`}>
            <div>
              <div className={styles.sparkCircle}><Sparkles size={18} /></div>
              <h3>Master your weak areas</h3>
              <p>
                We identified specific concepts in Geometry and Statistics where you
                lost points. Start a focused practice session to bridge the gap.
              </p>
            </div>
            <button>Review Weak Areas</button>
          </article>
        </section>

        <section className={styles.activityRow}>
          <article>
            <span className={styles.activityIconA}><Clock3 size={16} /></span>
            <div><h4>Time Management</h4><p>15 mins faster than previous best.</p></div>
          </article>
          <article>
            <span className={styles.activityIconB}><TrendingUp size={16} /></span>
            <div><h4>Growth Rate</h4><p>Consistency score is at 94%.</p></div>
          </article>
          <article>
            <span className={styles.activityIconC}><Medal size={16} /></span>
            <div><h4>New Achievement</h4><p>Unlocked: &quot;Algebra Specialist&quot;</p></div>
          </article>
        </section>
      </main>

      <AppFooter />

      <nav className={styles.mobileBottomNav}>
        <a href="#"><Home size={18} /><span>Home</span></a>
        <a href="#"><BookOpen size={18} /><span>Library</span></a>
        <a href="#"><Timer size={18} /><span>Practice</span></a>
        <a href="#" className={styles.mobileActive}><ChartColumnBig size={18} /><span>Results</span></a>
      </nav>
    </div>
  );
}
