<script setup lang="ts">
const dotEl = ref<HTMLElement | null>(null)
const ringEl = ref<HTMLElement | null>(null)

onMounted(() => {
  let px = -200, py = -200, lx = -200, ly = -200, shown = false

  const show = () => {
    if (shown) return
    shown = true
    dotEl.value?.classList.add('shown')
    ringEl.value?.classList.add('shown')
  }

  const onMove = (e: MouseEvent) => {
    px = e.clientX; py = e.clientY
    show()
  }

  const onOver = (e: MouseEvent) => {
    const hovering = !!(e.target as Element).closest('a, button, [data-cursor-hover]')
    ringEl.value?.classList.toggle('is-hover', hovering)
  }

  window.addEventListener('mousemove', onMove, { passive: true })
  document.addEventListener('mouseover', onOver)

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  let raf: number
  const tick = () => {
    lx = lerp(lx, px, 0.12)
    ly = lerp(ly, py, 0.12)
    if (dotEl.value) { dotEl.value.style.left = `${px}px`; dotEl.value.style.top = `${py}px` }
    if (ringEl.value) { ringEl.value.style.left = `${lx}px`; ringEl.value.style.top = `${ly}px` }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseover', onOver)
    cancelAnimationFrame(raf)
  })
})
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <div ref="dotEl" class="cursor-dot" />
      <div ref="ringEl" class="cursor-ring" />
    </Teleport>
  </ClientOnly>
</template>
