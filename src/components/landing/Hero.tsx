"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslation } from "@/hooks/useTranslation";

function ArrowIcon() {
  return (
    <svg className="arrow-icon" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Hero() {
  const { t } = useTranslation();
  const root = useRef<HTMLDivElement | null>(null);

  const statKeys = [
    "setupTime",
    "languages",
    "costReduce",
    "available",
  ];

  const STATS = statKeys.map((key) => ({
    val: t("hero", `stats.${key}.val`),
    label: t("hero", `stats.${key}.label`),
  }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // انيميشن الدخول الأساسي
      tl.from(".hero-grid", { opacity: 0, scale: 1.05, duration: 2, ease: "power2.out" }, 0)
        .from(".hero-orb", { opacity: 0, scale: 0, duration: 1.5, ease: "back.out(1.2)" }, 0.2)
        .from(".hero-tag", { y: 30, opacity: 0, duration: 0.8 }, "-=1")
        .from(".hero-title", { y: 40, opacity: 0, rotationX: 15, transformOrigin: "bottom center", duration: 1 }, "-=0.6")
        .from(".hero-sub", { y: 20, opacity: 0, duration: 1 }, "-=0.8")
        .from(".hero-actions", { y: 20, opacity: 0, scale: 0.9, duration: 0.8, ease: "back.out(1.5)" }, "-=0.6")
        .from(".hero-stat", { y: 30, opacity: 0, scale: 0.9, stagger: 0.15, duration: 0.8, ease: "back.out(1.2)" }, "-=0.4");

      // انيميشن دوران الكرة 360 درجة
      gsap.to(".hero-orb", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });

      // انيميشن الحركة العائمة للكرة
      gsap.to(".hero-orb", {
        y: "-=25",
        x: "+=10",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // انيميشن نبض الكرة
      gsap.to(".hero-orb", {
        scale: "+=0.1",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0
      });

      // انيميشن الأزرار عند الـ Hover
      gsap.utils.toArray<HTMLElement>(".hero-actions button").forEach((button) => {
        button.addEventListener("mouseenter", () => {
          gsap.to(button, { 
            scale: 1.08, 
            duration: 0.4, 
            overwrite: "auto",
            ease: "back.out(1.5)"
          });
        });
        button.addEventListener("mouseleave", () => {
          gsap.to(button, { 
            scale: 1, 
            duration: 0.4, 
            overwrite: "auto",
            ease: "back.out(1.5)"
          });
        });
      });

      // انيميشن الإحصائيات عند الـ Hover
      gsap.utils.toArray<HTMLElement>(".hero-stat").forEach((stat) => {
        stat.addEventListener("mouseenter", () => {
          gsap.to(stat, { 
            y: -15, 
            duration: 0.4, 
            overwrite: "auto",
            ease: "back.out(1.5)"
          });
        });
        stat.addEventListener("mouseleave", () => {
          gsap.to(stat, { 
            y: 0, 
            duration: 0.4, 
            overwrite: "auto",
            ease: "back.out(1.5)"
          });
        });
      });

    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={root}
      style={{ perspective: "1000px", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", padding: "80px 0", boxSizing: "border-box" }}>
      <div className="container" style={{ width: "100%", padding: "0 20px" }}>
        <div className="hero-inner" style={{ textAlign: "center" }}>
          <div className="hero-grid" />
          <div className="hero-orb" />

          <h1 className="hero-title" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: "1.1" }}>
            {t("hero", "title1")}<br />
            {t("hero", "title2")} <span className="accent">{t("hero", "titleAccent")}</span>
          </h1>

          <p className="hero-sub" style={{ maxWidth: "600px", margin: "20px auto" }}>
            {t("hero", "subtitle")}
          </p>

          <div className="hero-actions" style={{ gap: "15px", marginBottom: "40px", display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/auth?mode=register">
              <button className="btn-primary">
                {t("hero", "cta")} <ArrowIcon />
              </button>
            </Link>
            <button className="btn-ghost">{t("hero", "watchDemo")}</button>
          </div>

          <div className="hero-stats" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            {STATS.map((s) => (
              <div className="hero-stat" key={s.label}>
                <div className="hero-stat-val">{s.val}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}