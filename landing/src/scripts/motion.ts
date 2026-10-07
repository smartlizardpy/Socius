import { animate, inView, scroll, stagger } from 'motion';

// Motion's own form of the house curve in tokens.css.
const EASE = [0.2, 0.7, 0.3, 1] as const;

const root = document.documentElement;
const still = window.matchMedia('(prefers-reduced-motion: reduce)');
const failsafe = (window as unknown as { __revealFailsafe?: number }).__revealFailsafe;

/**
 * The pre-animation state lives in ONE place: the `.js [data-reveal]` rule in tokens.css.
 * Nothing here writes `opacity: 0` to an element, because a value written by this script
 * is a value the head script's failsafe cannot undo — and an animation that stalls would
 * then leave the page permanently blank. Motion's own inline styles outrank the CSS rule
 * while animating and after it commits, so the class can simply stay put.
 */
if (still.matches) {
	// Someone asking for less motion gets the finished page, not a slower version of it.
	clearTimeout(failsafe);
	root.classList.remove('js');
} else {
	try {
		start();
		// Only now is it safe to stand the failsafe down: the reveals are wired, so
		// something will un-hide every element. If start() threw instead, the timeout is
		// left running deliberately and the page comes back without its animation.
		clearTimeout(failsafe);
	} catch (err) {
		console.error('[motion] failed to start, falling back to a static page', err);
	}
}

function start() {
	// The hero plays once, on load — there is nothing to scroll it into.
	const hero = document.querySelectorAll<HTMLElement>('[data-hero-item]');
	if (hero.length) {
		animate(
			hero,
			{ opacity: [0, 1], y: [18, 0] },
			{ duration: 0.62, delay: stagger(0.075), ease: EASE },
		);
	}

	// Everything below the fold reveals as it arrives, once. Re-animating a section every
	// time it passes the viewport is what gets annoying on a page people scroll back up.
	// No `amount` threshold: a band taller than the viewport would never cross one.
	inView(
		document.querySelectorAll<HTMLElement>('[data-reveal]'),
		(el) => {
			const ms = Number.parseFloat(el.style.getPropertyValue('--reveal-delay')) || 0;
			animate(el, { opacity: [0, 1], y: [14, 0] }, { duration: 0.55, delay: ms / 1000, ease: EASE });
		},
		{ margin: '0px 0px -10% 0px' },
	);

	// Confetti drifts against the scroll. Decorative, so it is the first thing to go if
	// the browser cannot drive it cheaply.
	const heroSection = document.querySelector('.hero');
	if (heroSection) {
		document.querySelectorAll<HTMLElement>('.confetti .c').forEach((shape, i) => {
			scroll(
				// `y` composes with each shape's own `rotate:` property, which is why the
				// confetti rotations live there rather than in `transform`.
				animate(shape, { y: [0, i % 2 === 0 ? 70 : -55] }, { ease: 'linear' }),
				{ target: heroSection, offset: ['start start', 'end start'] },
			);
		});
	}
}
