/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STARTUP_PITCH_SLIDES } from '../data/deliverables';
import { ChevronLeft, ChevronRight, Award, Flame, Target, BookOpen, Users, DollarSign, ArrowUpRight } from 'lucide-react';

export default function PitchPRD() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [subTab, setSubTab] = useState<'pitch' | 'prd' | 'journey'>('pitch');

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % STARTUP_PITCH_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + STARTUP_PITCH_SLIDES.length) % STARTUP_PITCH_SLIDES.length);
  };

  const activeSlide = STARTUP_PITCH_SLIDES[currentSlide];

  return (
    <div className="space-y-8" id="pitch-prd-root">
      {/* Sub tabs for Startup Material */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-natural-border pb-4">
        <button
          id="btn-subtab-pitch"
          onClick={() => setSubTab('pitch')}
          className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            subTab === 'pitch'
              ? 'bg-natural-green text-white shadow-xs'
              : 'bg-natural-green-light/45 text-natural-dark hover:bg-natural-green-light'
          }`}
        >
          <Award className="w-4 h-4" />
          Investor Pitch Slide Deck
        </button>
        <button
          id="btn-subtab-prd"
          onClick={() => setSubTab('prd')}
          className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            subTab === 'prd'
              ? 'bg-natural-green text-white shadow-xs'
              : 'bg-natural-green-light/45 text-natural-dark hover:bg-natural-green-light'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Product Requirements (PRD)
        </button>
        <button
          id="btn-subtab-journey"
          onClick={() => setSubTab('journey')}
          className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            subTab === 'journey'
              ? 'bg-natural-green text-white shadow-xs'
              : 'bg-natural-green-light/45 text-natural-dark hover:bg-natural-green-light'
          }`}
        >
          <Users className="w-4 h-4" />
          User Journey Mapping
        </button>
      </div>

      {subTab === 'pitch' && (
        <div className="max-w-4xl mx-auto" id="pitch-deck-presenter">
          {/* Keynote Deck Emulation */}
          <div className="bg-natural-dark text-[#FCFAF7] rounded-3xl overflow-hidden shadow-2xl relative border border-natural-dark-hover">
            <div className="aspect-[16/9] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
              {/* Subtle visual ambient glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-natural-green/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-natural-green-light/10 rounded-full blur-2xl pointer-events-none" />

              {/* Logo Badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-natural-green-light font-sans tracking-wider font-bold text-xs uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-natural-green-light animate-pulse" />
                  Cook With What You Have — Pitch Slide {currentSlide + 1}
                </span>
                <span className="font-mono text-white/50 text-xs">AISTUDIO SEED FUNDING</span>
              </div>

              {/* Slide Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-5 gap-8 my-auto"
                >
                  <div className="md:col-span-3 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-sans tracking-tight font-extrabold text-white leading-tight">
                      {activeSlide.title}
                    </h2>
                    {activeSlide.subtitle && (
                      <p className="text-[#FCFAF7]/95 opacity-85 font-medium text-sm md:text-base italic">
                        "{activeSlide.subtitle}"
                      </p>
                    )}
                    <ul className="space-y-2.5 pt-2">
                      {activeSlide.bullets?.map((bullet, idx) => (
                        <li key={idx} className="text-white/80 text-sm flex items-start gap-2.5 leading-relaxed">
                          <span className="text-natural-green-light mt-1.5 shrink-0">■</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {activeSlide.metric && (
                    <div className="md:col-span-2 flex flex-col justify-center items-center bg-white/10 rounded-2xl p-6 border border-white/5 relative text-center">
                      <div className="text-natural-green-light font-mono text-5xl md:text-6xl font-extrabold tracking-tight">
                        {activeSlide.metric}
                      </div>
                      <div className="text-white/80 font-sans text-xs md:text-sm font-medium mt-2 max-w-[200px]">
                        {activeSlide.metricLabel}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Deck Navigation Controls */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex gap-2">
                  <button
                    id="btn-deck-prev"
                    onClick={prevSlide}
                    className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    id="btn-deck-next"
                    onClick={nextSlide}
                    className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Progress Indicators */}
                <div className="flex gap-1.5 items-center">
                  {STARTUP_PITCH_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      id={`btn-deck-indicator-${idx}`}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentSlide ? 'w-6 bg-natural-green-light' : 'w-2 bg-white/15'
                      }`}
                    />
                  ))}
                </div>

                <div className="font-mono text-white/50 text-xs">
                  {currentSlide + 1} / {STARTUP_PITCH_SLIDES.length}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Pitch Summary Box */}
          <div className="mt-8 bg-natural-green-light/40 border border-natural-green/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-md font-bold text-natural-dark flex items-center gap-2 uppercase tracking-wide font-sans">
              <Target className="w-5 h-5 text-natural-green" />
              Investor Pitch Opportunity Summary
            </h3>
            <p className="text-natural-text text-sm leading-relaxed">
              <strong>Cook With What You Have</strong> drives customer stickiness through visual computer-vision " fridge cataloguing" coupled with personalized high-fidelity Gemini cooking scripts. Over the past 6 months, user counts on localized closed betas matched a 35% weekly retention index. By structuring direct affiliate hooks into Instacart and optimizing food sustainability targets, our platform hits double carbon-offset monetization blocks.
            </p>
          </div>
        </div>
      )}

      {subTab === 'prd' && (
        <div className="max-w-4xl mx-auto bg-natural-light-bg border border-natural-border rounded-2xl p-8 space-y-8 shadow-sm text-natural-text animate-fade-in" id="notion-prd-workspace">
          {/* Header styling to mimic highly professional documentations */}
          <div className="border-b border-natural-border pb-6 space-y-2">
            <div className="flex items-center gap-2 text-natural-muted text-xs font-mono">
              <span>DOC-ID: PRD-2026-CWWH</span>
              <span>•</span>
              <span>VERSION: 1.2</span>
              <span>•</span>
              <span>CONFIDENTIAL</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-natural-dark tracking-tight font-sans">
              Product Requirements Document (PRD)
            </h1>
            <p className="text-natural-muted text-sm italic">
              Platform specifications for the "Cook With What You Have" SaaS Ecosystem.
            </p>
          </div>

          {/* Section 1: Introduction */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-natural-dark flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-natural-green flex items-center justify-center text-white text-xs font-mono font-bold">1</span>
              Executive Intent & User Groundwork
            </h3>
            <p className="text-natural-text text-sm leading-relaxed">
              The primary intent of <strong>"Cook With What You Have"</strong> is to reduce localized food waste, alleviate grocery cost fatigue, and bypass high-friction kitchen stress. The average consumer undergoes decision fatigue twice daily when auditing their storage compartments. By connecting smart cataloguing to a personalized adaptive recipe engine, we bridge this utility void.
            </p>
          </section>

          {/* Section 2: Core User Persona & Requirements */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-natural-dark flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-natural-green flex items-center justify-center text-white text-xs font-mono font-bold">2</span>
              User Requirements & Core Modules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-white border border-natural-border rounded-xl space-y-2 shadow-xs">
                <h4 className="font-bold text-natural-dark">FR1: Multimodal Fridge Vision</h4>
                <p className="text-natural-muted leading-relaxed">
                  System must ingest uploads or direct camera streams, calling a multimodal Gemini configuration model to output formatted inventory objects inside our client UI.
                </p>
              </div>
              <div className="p-4 bg-white border border-natural-border rounded-xl space-y-2 shadow-xs">
                <h4 className="font-bold text-natural-dark">FR2: Adaptive Recipe Compilation</h4>
                <p className="text-natural-muted leading-relaxed">
                  AI recipes must compile based on localized items, allowing tags (Vegan, Keto, Family-scale) and optimizing step instructions for minimal pan count.
                </p>
              </div>
              <div className="p-4 bg-white border border-natural-border rounded-xl space-y-2 shadow-xs">
                <h4 className="font-bold text-natural-dark">FR3: Dynamic Meal Planner & Shopping Cart</h4>
                <p className="text-natural-muted leading-relaxed">
                  Interactive bento planner. Users drag matching recipes into planned blocks. The engine extracts missing components and compiles clean checkout arrays.
                </p>
              </div>
              <div className="p-4 bg-white border border-natural-border rounded-xl space-y-2 shadow-xs">
                <h4 className="font-bold text-natural-dark">FR4: Voice Chef Hands-Free Ingress</h4>
                <p className="text-natural-muted leading-relaxed">
                  Includes localized interactive audio synthesis (TTS). Allows users to cook with messy hands without touching tablets or screens.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: MVP Scoping */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-natural-dark flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-natural-green flex items-center justify-center text-white text-xs font-mono font-bold">3</span>
              MVP Scope Boundary Rules
            </h3>
            <p className="text-natural-text text-sm leading-relaxed">
              To guarantee speed-to-market, the MVP focuses strictly on Web execution using a standard Node/Express backend paired with front-end React. Cloud SQL or Firestore maintains local user storage. Smart vision functions leverage lazy models to prevent cold startup bottlenecks.
            </p>
          </section>
        </div>
      )}

      {subTab === 'journey' && (
        <div className="max-w-4xl mx-auto space-y-6" id="user-journey-map">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-xl font-extrabold text-natural-dark">Ecosystem User Journey Mapping</h2>
            <p className="text-natural-muted text-sm">
              Tracing how an everyday busy home cook transitions into a loyal, paying, zero-waste advocate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                stage: "1. Discovery & Hook",
                action: "Sees TikTok #ShowMyFridge challenge. Click programmatic recipe link matching random leftover ingredients.",
                feel: "Curious, skeptical of computer vision speed.",
                status: "Visitor"
              },
              {
                stage: "2. The Visual 'Aha' Moment",
                action: "Uploads fridge image. AI detects carrots, yogurt and eggs in under 3 seconds. Offers a perfect budget soufflé.",
                feel: "Amaze, delighted by the instant personalization.",
                status: "Activated User"
              },
              {
                stage: "3. Interactive Cook",
                action: "Switches to hands-free Voice Chef. System reads directions out loud while they stir the skillet.",
                feel: "Guided, relaxed, culinary competent.",
                status: "Engaged User"
              },
              {
                stage: "4. Hyper-Retention",
                action: "Sets weekly bento planners, captures local milestone badges, and unlocks Pro subscription to plan for the family.",
                feel: "Frugal, green, eco-conscious.",
                status: "Paying Partner"
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-natural-border rounded-2xl p-5 space-y-3 shadow-xs relative">
                <div className="absolute top-4 right-4 text-xs font-mono font-bold text-natural-green bg-natural-green-light px-2.5 py-0.5 rounded-full">
                  Step {idx + 1}
                </div>
                <h4 className="font-bold text-natural-dark text-sm pr-12">{step.stage}</h4>
                <hr className="border-natural-soft-bg" />
                <p className="text-natural-text text-xs leading-relaxed">
                  <strong>Action:</strong> {step.action}
                </p>
                <p className="text-natural-muted text-xs italic">
                  <strong>Feelings:</strong> {step.feel}
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase bg-natural-green text-white px-2 py-1 rounded">
                    Role: {step.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Growth & Monetization Summary Banner */}
          <div className="bg-natural-dark text-white rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center border border-natural-dark-hover">
            <div className="space-y-2">
              <span className="text-xs font-bold text-natural-green-light uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Flame className="w-4 h-4 text-natural-green-light animate-pulse" />
                SaaS Monetization Strategy
              </span>
              <h3 className="text-xl font-extrabold text-white">High-LTV SaaS Channels</h3>
              <p className="text-[#FCFAF7]/90 text-xs leading-relaxed opacity-85">
                Driving direct programmatic revenue across consumer and grocery provider networks.
              </p>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center justify-between">
                  AI Chef Pro ($9.99/mo)
                  <ArrowUpRight className="w-3.5 h-3.5 text-natural-green-light" />
                </h4>
                <p className="text-white/80 text-[11px] leading-normal font-sans">
                  Unlocks family scaling recipes, continuous visual scanner logs, custom macro guides, and multi-speaker voice coaching.
                </p>
              </div>
              <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center justify-between">
                  Affiliate Cart Filling
                  <ArrowUpRight className="w-3.5 h-3.5 text-natural-green-light" />
                </h4>
                <p className="text-white/80 text-[11px] leading-normal font-sans">
                  Earn premium commissions on items fulfilled via Instacart, UberEats, and Whole Foods in our custom planners.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
