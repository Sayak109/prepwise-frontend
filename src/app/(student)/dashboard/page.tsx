import { StudentLayout } from "@/components/layout/student-layout";
import Link from "next/link";
import { attempts } from "@/data/attempts";
import { topics } from "@/data/topics";
import { tests } from "@/data/tests";
import { users } from "@/data/users";
import styles from "@/app/(student)/dashboard/dashboard.module.css";
import { ArrowRight, Flame, Sigma } from "lucide-react";

export default async function DashboardPage() {
  const activeUser = users.find((u) => u.role === "STUDENT") ?? users[3];
  const recent = attempts.filter((a) => a.userId === activeUser.id).slice(-3).reverse();

  const avgAccuracy = Math.round(
    recent.reduce((sum, item) => sum + item.accuracy, 0) / Math.max(recent.length, 1)
  );

  const testsCompleted = Math.min(20, attempts.length);
  const testsGoal = 20;
  const testsPct = Math.round((testsCompleted / testsGoal) * 100);

  const streakDays = 8;
  const overallScore = avgAccuracy || 78;

  const weakTopic = topics.find((t) => t.weakForUsers?.includes(activeUser.id)) ?? topics[0];

  return (
    <StudentLayout>
      <div className={styles.wrap}>
        <header className={styles.hero}>
          <h1>Good morning, {activeUser.name}.</h1>
          <p>You&apos;re making great progress. Ready to tackle today&apos;s goals?</p>
        </header>

        <section className={styles.metrics} aria-label="Core metrics">
          <article className={styles.card}>
            <p className={styles.label}>Overall Score</p>
            <div className={styles.valueRow}>
              <span className={styles.valuePrimary}>{overallScore}</span>
              <span className={styles.unit}>%</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${overallScore}%` }} />
            </div>
          </article>

          <article className={styles.card}>
            <p className={styles.label}>Tests Completed</p>
            <div className={styles.valueRow}>
              <span className={styles.valueNeutral}>{testsCompleted}</span>
              <span className={styles.unit}>/ {testsGoal}</span>
            </div>
            <div className={styles.subRow}>
              <Sigma size={16} color="#1f108e" />
              <span>{testsPct}% of goal</span>
            </div>
          </article>

          <article className={styles.card}>
            <p className={styles.label}>Study Streak</p>
            <div className={styles.valueRow}>
              <span className={styles.streakNum}>{streakDays}</span>
              <span className={styles.unit}>days</span>
            </div>
            <div className={styles.subRow} style={{ color: "#752c00" }}>
              <Flame size={16} />
              <span>Personal Best</span>
            </div>
          </article>
        </section>

        <section className={styles.recommend} aria-label="Recommended goal">
          <div className={styles.recImg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Recommended topic"
              src="https://images.unsplash.com/photo-1532635224-8fe0b757fb13?auto=format&fit=crop&w=1400&q=80"
            />
          </div>
          <div className={styles.recBody}>
            <span className={styles.pill}>Recommended Goal</span>
            <h2>Master {weakTopic.title}</h2>
            <p>
              Based on your recent practice, focusing on this topic can boost your score by an
              estimated 5%.
            </p>
            <div className={styles.recActions}>
              <Link className={styles.primaryBtn} href={`/practice/${weakTopic.id}`}>
                Start Practice <ArrowRight size={16} />
              </Link>
              <span className={styles.hint}>Estimated time: 25 mins</span>
            </div>
          </div>
        </section>

        <section aria-label="Recent attempts">
          <div className={styles.sectionHead}>
            <h3>Recent Attempts</h3>
            <button className={styles.linkBtn} type="button">
              View All History
            </button>
          </div>

          <div className={styles.attempts}>
            {recent.map((a) => {
              const test = tests.find((t) => t.id === a.testId);
              const pct = Math.round((a.score / a.total) * 100);
              const status = pct >= 85 ? "Mastered" : pct >= 70 ? "Passed" : "Incomplete";
              const statusClass =
                status === "Passed" ? styles.passed : status === "Mastered" ? styles.mastered : styles.incomplete;

              return (
                <article key={a.id} className={styles.attemptItem}>
                  <div className={styles.attemptLeft}>
                    <div className={styles.attemptIcon}>
                      <Sigma size={18} />
                    </div>
                    <div>
                      <p className={styles.attemptTitle}>{test?.title ?? "Practice Attempt"}</p>
                      <p className={styles.attemptSub}>{a.createdAt}</p>
                    </div>
                  </div>

                  <div className={styles.attemptRight}>
                    <p className={styles.attemptScore}>{pct}%</p>
                    <span className={`${styles.statusPill} ${statusClass}`}>{status}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </StudentLayout>
  );
}
