<template>
  <u-tabs
    :list="list"
    line-width="30"
    line-color="#f56c6c"
    :active-style="{
      color: '#303133',
      fontWeight: 'bold',
      transform: 'scale(1.05)'
    }"
    :inactive-style="{
      color: '#606266',
      transform: 'scale(1)'
    }"
    item-style="padding-left: 15px; padding-right: 15px; height: 34px;"
  />
</template>

<script>
  export default {
      data () {
          return {
              list: [{
                  name: '关注'
              }, {
                  name: '推荐',
              }, {
                  name: '电影',
              }, {
                  name: '科技'
              }, {
                  name: '音乐'
              }, {
                  name: '美食'
              }, {
                  name: '文化'
              }, {
                  name: '财经'
              }, {
                  name: '手工'
              }],
          }
      }
  }
</script>
