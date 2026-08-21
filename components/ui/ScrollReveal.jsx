"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE_OUT = [0.16, 1, 0.3, 1];

// IMPORTANT — read before changing this value.
// With a small fixed-pixel margin (e.g. "-80px"), a section's reveal fires
// the instant its top edge grazes the bottom of the screen. By the time a
// visitor has actually scrolled far enough to READ it, the animation has
// already finished playing — they never see it happen. Shrinking the
// trigger zone's bottom edge means a section has to scroll meaningfully
// further into view before triggering, so the reveal plays out while it's
// actually landing in front of the visitor rather than off-screen below it.
// -20% wasn't enough at normal scroll speed (verified by hand) — -38% means
// a section's top has to clear more than a third of the viewport height
// before it's considered "in view," which is roughly where it's actually
// readable rather than just barely poking up from the bottom edge.
const VIEWPORT = { once: true, margin: "0% 0% -38% 0%" };

/** Single fade-up reveal, shared by every section so the whole site moves
 * with one consistent motion language instead of each section inventing its
 * own timing/easing. */
export const revealItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Wraps revealItem children so they stagger in one after another instead of
 * all at once — put this on the parent, revealItem (via <ScrollRevealItem>
 * or a plain motion.div with variants={revealItem} and no initial/animate of
 * its own) on each child. */
export const revealContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

/**
 * A single element that fades/rises into place the first time it scrolls
 * into view. For a group of siblings that should stagger in together, use
 * ScrollRevealGroup + ScrollRevealItem instead — stacking individual
 * ScrollReveals next to each other would have each one's own viewport check
 * fire independently, not as a coordinated sequence.
 */
export function ScrollReveal({ children, className, style, delay = 0, as = "div", id }) {
  const reduceMotion = useReducedMotion();
  const Tag = as === "span" ? motion.span : motion.div;

  if (reduceMotion) {
    return as === "span" ? (
      <span id={id} className={className} style={style}>
        {children}
      </span>
    ) : (
      <div id={id} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <Tag
      id={id}
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={revealItem}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
    >
      {children}
    </Tag>
  );
}

/** Coordinating parent for a staggered group — children should be
 * ScrollRevealItem (or any motion.div with variants={revealItem} and no own
 * initial/animate, which inherits hidden/visible from this parent). */
export function ScrollRevealGroup({ children, className, style }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className} style={style}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={revealContainer}
    >
      {children}
    </motion.div>
  );
}

/** One item inside a ScrollRevealGroup — deliberately has no initial/
 * whileInView of its own, so it inherits "hidden"/"visible" from the nearest
 * animating parent (the group) and stays in lockstep with its siblings'
 * stagger timing instead of running its own separate viewport check. */
export function ScrollRevealItem({ children, className, style }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className} style={style}>{children}</div>;

  return (
    <motion.div className={className} style={style} variants={revealItem}>
      {children}
    </motion.div>
  );
}
