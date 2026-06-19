<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })
await navigateTo('/admin/produtos', { replace: true })
</script>

<template>
  <div />
</template>
