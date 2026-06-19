<script setup lang="ts">
import type { Product } from '~/types/product'

definePageMeta({ middleware: 'auth', layout: 'admin', title: 'Produtos' })

const { getAll, remove, toggle, reorder } = useAdminProducts()
const router = useRouter()

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const confirmDelete = ref<Product | null>(null)
const search = ref('')
const orderChanged = ref(false)
const saving = ref(false)

// Drag state
const draggingId = ref<string | null>(null)
const overIdx = ref<number | null>(null)

const filtered = computed(() =>
  search.value
    ? products.value.filter(p =>
        p.title.toLowerCase().includes(search.value.toLowerCase()),
      )
    : products.value,
)

async function load() {
  try {
    products.value = await getAll()
  } catch {
    error.value = 'Erro ao carregar produtos.'
  } finally {
    loading.value = false
  }
}

async function handleToggle(product: Product) {
  try {
    const updated = await toggle(product.id)
    const idx = products.value.findIndex(p => p.id === product.id)
    if (idx !== -1) products.value[idx] = updated
  } catch {
    error.value = 'Erro ao alterar status.'
  }
}

async function handleDelete() {
  if (!confirmDelete.value) return
  try {
    await remove(confirmDelete.value.id)
    products.value = products.value.filter(p => p.id !== confirmDelete.value!.id)
  } catch {
    error.value = 'Erro ao excluir produto.'
  } finally {
    confirmDelete.value = null
  }
}

async function handleSaveOrder() {
  if (saving.value) return
  saving.value = true
  try {
    await reorder(products.value.map((p, i) => ({ id: p.id, position: i })))
    orderChanged.value = false
  } catch {
    error.value = 'Erro ao salvar ordem.'
  } finally {
    saving.value = false
  }
}

// Drag handlers
function onDragStart(id: string) {
  draggingId.value = id
}

function onDragOver(e: DragEvent, idx: number) {
  e.preventDefault()
  overIdx.value = idx
}

function onDrop(idx: number) {
  if (!draggingId.value) return
  const fromIdx = products.value.findIndex(p => p.id === draggingId.value)
  if (fromIdx === -1 || fromIdx === idx) return
  const reordered = [...products.value]
  const [moved] = reordered.splice(fromIdx, 1)
  reordered.splice(idx, 0, moved)
  products.value = reordered
  orderChanged.value = true
  draggingId.value = null
  overIdx.value = null
}

function onDragEnd() {
  draggingId.value = null
  overIdx.value = null
}

onMounted(load)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 gap-4 flex-wrap">
      <h2 class="text-white font-semibold">Produtos</h2>

      <div class="flex items-center gap-3">
        <!-- Order save button -->
        <button
          v-if="orderChanged"
          :disabled="saving"
          class="bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-[10px] font-semibold uppercase tracking-widest px-5 py-2.5 hover:bg-brand-yellow/20 transition-colors duration-200 disabled:opacity-50"
          @click="handleSaveOrder"
        >
          {{ saving ? 'Salvando...' : 'Salvar ordem ↑↓' }}
        </button>

        <NuxtLink
          to="/admin/produtos/novo"
          class="bg-brand-yellow text-brand-black text-xs font-bold uppercase tracking-widest px-6 py-2.5 hover:opacity-90 transition-opacity"
        >
          Novo produto
        </NuxtLink>
      </div>
    </div>

    <!-- Search -->
    <div class="relative mb-5">
      <input
        v-model="search"
        type="search"
        placeholder="Buscar produto..."
        class="w-full bg-[#0f0f0f] border border-white/[0.08] text-white/80 text-sm px-4 py-2.5 placeholder-gray-700 focus:outline-none focus:border-brand-yellow/30 transition-colors duration-200 pr-10"
      />
      <svg
        v-if="!search"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700"
      >
        <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
      </svg>
      <button
        v-else
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
        @click="search = ''"
      >✕</button>
    </div>

    <p v-if="error" class="mb-4 text-red-400 text-xs">{{ error }}</p>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="h-16 bg-[#111] animate-pulse" />
    </div>

    <!-- Table with DnD -->
    <div v-else-if="filtered.length" class="overflow-x-auto">
      <p v-if="search && filtered.length !== products.length" class="text-[10px] text-gray-600 uppercase tracking-widest mb-3">
        {{ filtered.length }} resultado{{ filtered.length > 1 ? 's' : '' }}
      </p>
      <p v-if="!search && products.length > 1" class="text-[10px] text-gray-700 mb-3 flex items-center gap-1.5">
        <span>⠿</span> Arraste as linhas para reordenar
      </p>

      <table class="w-full text-xs">
        <thead>
          <tr class="border-b border-white/[0.06] text-left">
            <th v-if="!search" class="pb-3 w-8 text-gray-700 font-normal pr-3" />
            <th class="pb-3 text-gray-600 uppercase tracking-widest font-normal">Produto</th>
            <th class="pb-3 text-gray-600 uppercase tracking-widest font-normal text-center">Status</th>
            <th class="pb-3 text-gray-600 uppercase tracking-widest font-normal text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(product, idx) in (search ? filtered : products)"
            :key="product.id"
            class="border-b border-white/[0.04] group transition-colors duration-150"
            :class="[
              draggingId === product.id ? 'opacity-40' : '',
              overIdx === idx && draggingId && draggingId !== product.id ? 'border-t border-brand-yellow/30' : '',
            ]"
            :draggable="!search"
            @dragstart="onDragStart(product.id)"
            @dragover="onDragOver($event, idx)"
            @drop="onDrop(idx)"
            @dragend="onDragEnd"
          >
            <!-- Drag handle -->
            <td v-if="!search" class="py-3 pr-3 text-gray-700 group-hover:text-gray-500 cursor-grab active:cursor-grabbing select-none">
              ⠿
            </td>

            <!-- Product info -->
            <td class="py-3 pr-4">
              <div class="flex items-center gap-3">
                <img
                  :src="product.image_url"
                  :alt="product.title"
                  class="w-10 h-10 object-cover object-top shrink-0 bg-[#111]"
                  loading="lazy"
                />
                <div class="min-w-0">
                  <p class="text-white/80 truncate max-w-[200px]">{{ product.title }}</p>
                  <p v-if="product.description" class="text-gray-600 text-[10px] truncate max-w-[200px]">{{ product.description }}</p>
                </div>
              </div>
            </td>

            <!-- Status -->
            <td class="py-3 text-center">
              <button
                class="text-[9px] uppercase tracking-widest px-2.5 py-1 border transition-colors duration-200"
                :class="product.active
                  ? 'border-green-800/50 text-green-600 hover:bg-green-900/20'
                  : 'border-white/[0.08] text-gray-600 hover:bg-white/5'"
                @click="handleToggle(product)"
              >
                {{ product.active ? 'Ativo' : 'Oculto' }}
              </button>
            </td>

            <!-- Actions -->
            <td class="py-3 text-right">
              <div class="flex items-center justify-end gap-3">
                <button
                  class="text-[10px] text-gray-600 hover:text-white uppercase tracking-widest transition-colors duration-200"
                  @click="router.push(`/admin/produtos/${product.id}`)"
                >
                  Editar
                </button>
                <button
                  class="text-[10px] text-gray-700 hover:text-red-400 uppercase tracking-widest transition-colors duration-200"
                  @click="confirmDelete = product"
                >
                  Excluir
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!loading" class="py-16 text-center">
      <p class="text-gray-700 text-[11px] uppercase tracking-widest">
        {{ search ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado.' }}
      </p>
    </div>

    <AdminConfirmDialog
      v-if="confirmDelete"
      title="Excluir produto"
      :message="`Deseja excluir &quot;${confirmDelete.title}&quot;? Esta ação não pode ser desfeita.`"
      @confirm="handleDelete"
      @cancel="confirmDelete = null"
    />
  </div>
</template>
