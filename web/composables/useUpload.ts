export function useUpload() {
  const nuxtApp = useNuxtApp()

  async function upload(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)

    const res = await nuxtApp.$api<{ url: string }>('/api/v1/admin/upload', {
      method: 'POST',
      body: form,
    })

    return res.url
  }

  return { upload }
}
