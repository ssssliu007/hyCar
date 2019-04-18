<template>
  <div class="v_swiper swiper-container" :class="typeClass" ref="swiper">
    <div class="swiper-wrapper" ref="chlidDemo">
      <slot></slot>
    </div>
    <!-- 如果需要分页器 -->
    <div v-if="pagination" class="swiper-pagination"></div>
    <!-- 如果需要导航按钮 -->
    <div v-if="button" class="swiper-button-prev"></div>
    <div v-if="button" class="swiper-button-next"></div>
    <!-- 如果需要滚动条 -->
    <div v-if="scrollbar" class="swiper-scrollbar"></div>
  </div>
</template>
<script>
  import Swiper from 'swiper'
  export default {
    name: 'v_swiper',
    data() {
      return {

      }
    },
    props: ['option', 'typeClass', 'pagination', 'button', 'scrollbar'],
    mounted() {
      if (!this.$refs.swiper) {
        return
      }
      let chlidDemo = this.$refs.chlidDemo;
      console.dir(chlidDemo, this.$refs.swiper)
      if(chlidDemo){
        for(let cD = -1;chlidDemo.children[++cD];){
          chlidDemo.children[cD].classList.add('swiper-slide')
        }
      }
      let options = {};
      if(this.pagination){
        options.pagination = {
          el: '.swiper-pagination'
        }
      }
      if(this.button){
        options.navigation = {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
      if(this.scrollbar){
        options.scrollbar = {
          el: '.swiper-scrollbar'
        }
      }
      if(this.option){
        options = $.extend({},options, this.option)
      }
      // better-scroll的初始化
      this.$nextTick(()=>{
        this.swiper = new Swiper(this.$refs.swiper, options)
      })
    },
    methods: {
      resize(){
        this.swiper && this.swiper.resize()
      }
    },
    watch: {
      chlidDemo(re){
        console.log(re)
      }
    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
