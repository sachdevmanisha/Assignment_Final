
<template>
  <div class="tree-graph-wrapper">

    <div ref="treeContainer" class="tree-container"></div>
    
    <transition name="slide">
      <div v-if="selectedNode" class="sidebar">
        <button class="close-btn" @click="closeSidebar">×</button>
        <h3>{{ selectedNode.name }}</h3>
        <p>{{ selectedNode.description }}</p>
      </div>
    </transition>

  </div>
  
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';
import type { TreeNode } from '../data/mockGraphData';


const props = defineProps<{
  data: TreeNode;
}>();

const treeContainer = ref<HTMLElement | null>(null);
const selectedNode = ref<TreeNode | null>(null);

const width = 800;
const height = 600;
const margin = { top: 40, right: 90, bottom: 50, left: 90 };

const closeSidebar = () => {
  selectedNode.value = null;
  if (treeContainer.value) {
    d3.select(treeContainer.value).selectAll('circle').attr('fill', '#fff');
  }
};

const renderTree = () => {
  if (!treeContainer.value) return;

  // Clear previous SVG if any
  d3.select(treeContainer.value).select('svg').remove();

  const svg = d3.select(treeContainer.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .on('click', (event: MouseEvent) => {
        // Close sidebar if clicking on background
        const target = event.target as HTMLElement;
        if (target.tagName === 'svg') {
            closeSidebar();
        }
    });

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Data is already hierarchical from backend
  const root = d3.hierarchy<TreeNode>(props.data);
  
  // Tree layout
  const treeLayout = d3.tree<TreeNode>().size([
      height - margin.top - margin.bottom, 
      width - margin.left - margin.right
  ]);

  const rootPoint = treeLayout(root);

  // Links
  g.selectAll('.link')
    .data(rootPoint.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d3.linkHorizontal<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
        .x((d) => d.y)
        .y((d) => d.x)
    )
    .attr('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('stroke-width', 2);

  // Nodes
  const node = g.selectAll('.node')
    .data(rootPoint.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', (d) => `translate(${d.y},${d.x})`)
    .style('cursor', 'pointer')
    .on('click', (event: MouseEvent, d: d3.HierarchyPointNode<TreeNode>) => {
      event.stopPropagation(); 
      selectedNode.value = d.data;
      
      // Update highlights
      if (treeContainer.value) {
        d3.select(treeContainer.value).selectAll('circle').attr('fill', '#fff');
        d3.select(event.currentTarget as SVGGElement).select('circle').attr('fill', '#ffeb3b');
      }
    });

  node.append('circle')
    .attr('r', 10)
    .attr('fill', '#fff')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 3);

  node.append('text')
    .attr('dy', '.35em')
    .attr('x', (d) => d.children ? -13 : 13)
    .style('text-anchor', (d) => d.children ? 'end' : 'start')
    .text((d) => d.data.name);
};

onMounted(() => {
  renderTree();
});

watch(() => props.data, renderTree);
</script>

<style scoped>
.tree-graph-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}

.tree-container {
  overflow: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fafafa;
}

.sidebar {
  position: absolute;
  top: 0;
  right: 0;
  width: 250px;
  height: 100%;
  background: white;
  border-left: 1px solid #ccc;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0,0,0,0.1);
  overflow-y: auto;
  box-sizing: border-box;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
