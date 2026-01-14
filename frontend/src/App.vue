<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TreeGraph from './components/TreeGraph.vue';
import type { TreeNode } from './data/mockGraphData';

const graphData = ref<TreeNode | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3001/api/graph-data');
    if (!response.ok) throw new Error('Failed to fetch data');
    graphData.value = await response.json();
  } catch (err: any) {
    error.value = err.message || 'Error loading data';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="app-container">
    <h1>Hierarchical Graph Visualization</h1>
    
    <div v-if="loading">Loading graph data...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <TreeGraph v-else-if="graphData" :data="graphData" />
  </div>
</template>

<style>
.app-container {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}
</style>
