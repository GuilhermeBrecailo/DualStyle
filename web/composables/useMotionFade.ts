export function useMotionFade() {
  async function fadeIn(target: string | Element, delay = 0) {
    if (!import.meta.client) return
    const { gsap } = await import('gsap')
    gsap.from(target, { opacity: 0, y: 20, duration: 0.6, delay, ease: 'power2.out' })
  }

  async function staggerFadeIn(targets: string | Element[], stagger = 0.1) {
    if (!import.meta.client) return
    const { gsap } = await import('gsap')
    gsap.from(targets, { opacity: 0, y: 30, duration: 0.5, stagger, ease: 'power2.out' })
  }

  return { fadeIn, staggerFadeIn }
}
