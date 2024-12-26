<template>
  <u-image
    :show-loading="true"
    :src="src"
    width="80px"
    height="80px"
    @click="click"
  />
</template>

<script>
	export default {
		data () {
			return {
				src: 'https://cdn.uviewui.com/uview/album/1.jpg'
			}
		}
	}
</script>
