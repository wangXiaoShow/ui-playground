<!--
<script setup lang="ts">
import { ref, version as vueVersion } from 'vue'
import onuUI, { OButton, OIcon } from 'onu-ui'

const msg = ref('Hello Onu UI!')
</script>

<template>
  <div class="container">
    <h1>{{ msg }}</h1>
    <o-button type="primary">
      <o-icon h-5 w-5 o="gray" name="i-carbon-moon" />
      Primary
    </o-button>
    <o-button type="secondary">
      <o-icon h-5 w-5 o="gray" name="i-carbon-moon" />
      Primary
    </o-button>
    <p>Vue {{ vueVersion }}</p>
    <p>onuUI {{ onuUI.version }}</p>
  </div>
</template>

<style>
.container {
  padding: 20px;
}
</style>
-->
<script setup lang="ts">
import { ref, version as vueVersion } from 'vue'

const msg = ref('Hello Onu UI!')
</script>

<template>
  <div class="container">
    <h1>{{ msg }}</h1>

    <p>Vue {{ vueVersion }}</p>
  </div>
</template>

<style>
.container {
  padding: 20px;
}
</style>
