<template>
  <NBreadcrumb>
    <NBreadcrumbItem v-for="item in breadcrumb" :clickable="false" :key="item.name">
      <div class="flex items-center gap-1">
        <NIcon>
          <SvgIcon
            v-if="item.meta.icon || item.meta.localIcon"
            :icon="item.meta.icon"
            :local-icon="item.meta.localIcon"
          />
          <SvgIcon v-else icon="ic:baseline-menu" />
        </NIcon>
        <span> {{ item.meta.title }}</span>
      </div>
    </NBreadcrumbItem>
  </NBreadcrumb>
</template>

<script setup lang="ts">
const route = useRoute()
const breadcrumb = computed(() => {
  return route.matched
})
</script>

<style scoped></style>
