<template>
  <v-bts :listenScroll='!!0' class="container" :id="$route.name">
    <b-row>
      <b-col cols=12 class="px-0">
        <v-swiper ref='banner' :pagination="banner[0]">
          <div v-for="b in banner" :style="{backgroundImage:'url('+b.tumb_url+')'}" :key="b.id" class="sp-img swiper-slide"></div>
          <div @click="loadingTest()" v-if="!banner[0] && isLoading" class="sp-img loading">
            <div class="pre_loading_css">
              <div v-for="rl in 5" :key="rl"></div>
            </div>
          </div>
          <div @click="loadingTest()" v-if="!banner[0] && !isLoading" class="sp-img no-img"></div>
        </v-swiper>  
      </b-col>
    </b-row>
    <b-row v-if="data" class="lin-5">
      <b-col cols="12" class="is-break-line py-2">
        <h5 class="mb-2">{{data.name}}
          <span class="state-label-box">
            <span class="align-self-center" :class="['state-label','state-label-'+data.state]">{{data.state_name}}</span>
          </span>
        </h5>
        <p class="color-gy mb-1" v-if="data.code">车辆编号：{{data.code || '[暂无]'}}</p>
        <p class="color-gy mb-1">
          <span v-if="data.colorO">
            外观颜色：{{data.colorO}} &nbsp;&nbsp;
          </span>
          <span v-if="data.colorI">
            内饰颜色：{{data.colorI}}
          </span>
        </p>
        <p class="color-gy mb-1" v-if="data.price0">
          <span class="text-right">港口价：</span>
          <span class="d-inline text-danger">{{data.price0}}</span>
          <span class="">元</span>
        </p>
        <p class="color-gy mb-0" v-if="data.price0 && data.price0Date">
          <span class="text-right">港口价更新时间：{{data.price0Date}}</span>
        </p>
        <div class="bb mt-3 mb-3"></div>
<!--         
        <b-row v-if="data.price0">
          <b-col cols='auto' class="ml-auto">
            <span class="text-right">港口价</span>
            <h4 class="d-inline text-danger">{{data.price0}}</h4>
            <span class="text-danger font-weight-bold">元</span>
          </b-col>
        </b-row>
        <b-row v-if="data.price0 && data.price0Date">
          <b-col cols='auto' class="ml-auto">
            <span class="text-right">港口价更新时间：{{data.price0Date}}</span>
          </b-col>
        </b-row> -->

        <b-row v-if="data.price" class="pb-2">
          <b-col class="align-self-end">
            <!-- <span class="text-danger font-weight-bold">{{data.state_name}}</span> -->
          </b-col>
          <b-col cols='auto' class="ml-auto">
            <span class="text-right">采购价</span>
            <h4 class="d-inline text-danger">{{data.price}}</h4>
            <span class="text-danger font-weight-bold">元</span>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="12" class="is-break-line pt-2">
        <b-row class="pb-2 bb">
          <b-col>
            <h6 class="is-label">车辆详情</h6>
          </b-col>
        </b-row>
        <b-row class="more-info-text color-gy" v-for="(m, mno) in data.moreInfo" :key="mno">
          <span>{{m.name}}</span>
          <span class="ml-auto">{{m.value||'[暂无数据]'}}</span>
        </b-row>
      </b-col>
      <b-col cols="12" class="is-break-line pt-2">
        <b-row @click="toggleFree()" class="pb-2 bb">
          <b-col cols="auto">
            <h6 class="is-label">手续</h6>
          </b-col>
          <b-col cols="auto ml-auto">
            <!-- <span :class="!showFree?'active':''" class="color-gy icon toggle-icon"></span> -->
          </b-col>
        </b-row>
          <div class="animated0 fadeIn fast ttr pt" style="{height:freeBoxHeight + 'px'}" ref="freeBox" v-show="showFree">
            <b-row class="more-info-text color-gy" v-for="(f, fno) in data.free" :key="fno">
              <span>{{f.name}}</span>
              <span class="ml-auto icon free-icon align-self-center" :class="f.isCk?'active':''"></span>
            </b-row>
          </div>
      </b-col>
      <b-col cols="12" class="py-2 is-break-line">
        <b-row>
          <b-col cols="auto" style="width:6em">
            <h6 class="is-label">供货商</h6>
          </b-col>
          <b-col class="ml-auto">
            <span class="float-right color-gy">{{data.info.profile_value_json[1367].value_name || data.info.profile_value_json[1367].value}}</span>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="12" class="py-2">
        <b-row>
          <b-col cols="auto" style="width:7em">
            <h6 class="is-label">更新时间</h6>
          </b-col>
          <b-col class="ml-auto">
            <span class="float-right color-gy">{{data.info.updated_at}}</span>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="py-4">
    </b-row>
  </v-bts>
</template>

<script>
import vSwiper from '@/components/swiper.vue'

export default {
  name: 'detail',
  data() {
    return {
      data: null,
      banner: [],
      isLoading: true,
      showFree: true,
      freeBoxHeight: null,
    }
  },
  components:{
    vSwiper,
  },
  mounted() {
    // console.log(this.$route, this.$route.params)
    // this.initInfo()
    // this.loadingTest()
    setTimeout(() => {
      this.getCarTime()
    }, 1000);
  },
  methods: {
    loadingTest(){
      this.banner = [];
      this.isLoading = !this.isLoading;
    },
    getCarTime(){
      let localInfo = window.localStorage.getItem(this.$route.params.ids);
      console.log(0)
      if(localInfo){
        try{
          localInfo = JSON.parse(localInfo)
        }catch(e){
          alert('数据异常！')
        }
        let getCarTimeUrl =process.env.NODE_ENV == 'development' || /\/demo\//g.test(window.location.href) ?
        './static/ajaxCarTime.json' :
        '/member/object/temp/profile/value/log/list/' + 1408;
        this.axios.get( getCarTimeUrl,{params:{
          ob_id: localInfo.id,
          format: 'json'
        }}).then((re)=>{
          re.data.list[0].created_at && (localInfo.price0Date = re.data.list[0].created_at)
          this.initInfo(localInfo)
        }).catch((re)=>{
          this.initInfo(localInfo)
          // console.error(re)
        })
      }else{
        alert('暂不支持页面分享，将跳转到车型列表')
        this.$router.replace('/')
      }
    },
    initInfo(localInfo){
        // let moreInfo = [],
        // infoIdList = [1360, 1361, 1364, 1365];
        // for(let k in infoIdList){
        //   let t_k = localInfo.info.profile_value_json[infoIdList[k]]
        //   if(!t_k){
        //     continue
        //   }
        //   switch (infoIdList[k]) {
        //     case 1360:
        //     case 1361:
        //       moreInfo.push({
        //         name: t_k.name,
        //         value: t_k.value,
        //       })
        //       break;
        //     default:
        //       moreInfo.push({
        //         name: t_k.name,
        //         value: t_k.value_name,
        //       })
        //       break;
        //   }
        // }
        // localInfo.moreInfo = moreInfo;
        this.$set(this, 'data', localInfo)
        this.$set(this, 'isLoading', true)
        this.$set(this, 'banner', localInfo.head_img)
        this.$nextTick(()=>{
          this.$set(this, 'freeBoxHeight', this.$refs.freeBox.scrollHeight)
          this.$refs.banner.swiper.update()
        })
        document.title = this.data.name
    },
    toggleFree(){
      return
      if(!this.showFree){
        this.showFree = true;
          this.$nextTick(()=>{
            this.$set(this, 'freeBoxHeight', this.$refs.freeBox.scrollHeight)
          })
        }else{
          setTimeout(() => {
            this.showFree = false;
          }, 500);
          this.$set(this, 'freeBoxHeight', 0)
        }
    }
  }
}
</script>
<style lang="stylus" scoped>
  bl = #f7f7f7
  bl = #eee
  #detail
    background-color bl
    .lin-5
      background-color #fff
      border-bottom 1rem solid bl
    .bb
      border-bottom .0625em solid bl
    p
    span
    h6
      font-size .9rem
    h6
      line-height 1.5
    .ttr
      // height 0
      transition height .5s ease-out
      overflow hidden
    .color-gy
      color #666666
    .more-info-text
      line-height 2.7
      // height 2.4em
      border-bottom 0.0625rem solid bl
      padding 0 15px
      &:last-of-type
        border-bottom-color transparent
    .sp-img
      padding-top 66.625%
      background #efefef center/cover no-repeat
      &.loading
        padding-top 0
        height 100vh
      &.no-img
        background-size contain
  .is-break-line
    border-bottom .3125rem solid bl
  .is-label
    padding-left .5rem
    position relative
    margin-bottom 0;
    &::before
      content ''
      display block
      width .25rem
      height 1rem
      position absolute
      left 0
      top 50%
      transform translateY(-50%)
      background-color #b39350
  .state-label-box
    font-size 1.125rem!important
    // line-height 1
    // height 1.5rem
    padding-left 5em
    position relative
  .state-label
    position absolute
    left 0
    top 50%
    white-space nowrap
    transform translate(0%, -50%)
    background-color #333
    display inline-block
    border-radius .25em
    font-size .8rem!important
    line-height 1.4
    height 1.4em
    padding 0 0.4em
    font-weight 100
    &.state-label-1
      background-color #dc3545
      color #fff
    &.state-label-2
      background-color #fff100
      color #0d0d0d
    &.state-label-3
      background-color #999
      color #fff
</style>


