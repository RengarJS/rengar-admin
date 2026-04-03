<template>
  <NBreadcrumb>
    <NBreadcrumbItem v-for="item in breadcrumb" :clickable="false" :key="item.name">
      <div class="flex items-center gap-1">
        <NIcon>
          <MenuIcon :options="item.meta"></MenuIcon>
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
