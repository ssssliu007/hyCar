<template>
  <b-container :id="$route.name">
    <b-row class="py-3">
      <b-col>
        <b-input-group>
          <b-input class="sp1 plc0" variant='secondary' placeholder="搜索" v-model.lazy="ajaxData.keywords"></b-input>
          <b-input-group-append>
            <b-button class="search-sp0" @click="isEnsureSel(1)"></b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row class="nav-sel position-relative">
      <b-col cols="3">
        <b-button block class="sp0" 
        @click="swapNav('latest')" 
        :class="isNavActive == 'latest'?'active':''">最新</b-button>
      </b-col>
      <b-col cols="3">
        <b-button block class="sp0 dp" 
        @click="swapNav('price')" 
        :class="isNavActive == 'price'?'active':''">价格</b-button>
      </b-col>
      <b-col cols="3">
        <b-button block class="sp0 dp" 
        @click="swapNav('state')" 
        :class="isNavActive == 'state'?'active':''">销售状态</b-button>
      </b-col>
      <b-col cols="3">
        <b-button block class="sp0 dp" 
        @click="swapNav('time')" 
        :class="isNavActive == 'time'?'active':''">到库时间</b-button>
      </b-col>
    </b-row>
    <b-row class="position-relative">
      <!-- <transition leave-active-class="fadeOut"> -->
        <b-col class="nav-sel-box" :class="isHide?'isHide':''" :style="{height:navHeight+'px'}" cols="12" ref='navBox' v-show="isNavShow">
          <b-container>
            <b-row class="pt-3 nav-sel-btn">
              <b-col cols="3" v-for="(k, no) in nav.selList[isNavActive]" :key="no">
                <b-button block class="sp0 asp0" 
                @click="setNavSel(k)" 
                :class="nav.selSets[isNavActive] == k.key?'active':''">
                  {{k.name}}
                </b-button>
              </b-col>
            </b-row>
            <!-- <b-row v-show="isNavActive == 'time'" class="py-3">
              <b-container class="px-0">
                <b-row class="pb-3 flex-nowrap">
                  <b-col cols="auto">开始时间</b-col>
                  <b-col cols="" class="ml-auto">
                    <vue-datepicker-local 
                      :disabled-date="disabledDateS" 
                      v-model="nav.selSets.time.start" 
                      class="right">
                    </vue-datepicker-local>
                  </b-col>
                  <b-col cols="auto" class="pl-0">
                    <b-btn size="sm" class="bc-0 rounded-0 btn-x" @click="clearTime('start')" variant="outline-secondary">X</b-btn>
                  </b-col>
                </b-row>
                <b-row class="flex-nowrap">
                  <b-col cols="auto">结束时间</b-col>
                  <b-col cols="" class="ml-auto">
                    <vue-datepicker-local 
                      :disabled-date="disabledDateE" 
                      v-model="nav.selSets.time.end" 
                      class="right">
                    </vue-datepicker-local>
                  </b-col>
                  <b-col cols="auto" class="pl-0">
                    <b-btn size="sm" class="bc-0 rounded-0 btn-x" @click="clearTime('end')" variant="outline-secondary">X</b-btn>
                  </b-col>
                </b-row>
              </b-container>
            </b-row> -->
            <!-- <b-row>
                <b-button variant="danger" block class="sp2 fs-1" @click="isEnsureSel(1)">确定</b-button>
            </b-row> -->
          </b-container>
        </b-col>
      <!-- </transition> -->
    </b-row>
    <b-row class="position-relative">
      <b-col cols="12" class="p-0">
        <p class="show-amount" :class="[this.amount.isShow?'is-show':'',this.amount.isTop?'is-top':'']">
        当前加载{{this.amount.thisp}}项，一共{{this.amount.all}}项
        </p>
      </b-col>
    </b-row>
    <v-bts 
      ref="vList" 
      :pulldown="true" 
      @pulldown="reNewList" 
      :pullup="true" 
      @scrollToEnd="nextPage()" 
      @click.native="isEnsureSel(0)" 
      class="ng-wrapper isBox list" 
      :class="isNavShow?'coverOn':''">
      <b-row class="mx-0">
        <b-col cols="12" class="py-3 list-child fadeIn animated faster" 
        v-for="(l, lno) in showList" 
        :key="lno"
        @click="toDetail(l)">
          <b-row class="mx-0">
            <b-col cols="5" :class="['state_label', 'state_'+l.state]">
              <b-row>
                <b-col cols="12" class="car-img" :style="{backgroundImage:`url(${l.head_img[0].tumb_url})`}"></b-col>
              </b-row>
            </b-col>
            <b-col cols="7" class="pr-0">
              <h6 class="mb-1 name-label">{{ overName(l.name) }}</h6>
              <p class="text-muted mb-0 info-1">车辆编号:{{l.code || '[暂无]'}}</p>
              <p class="text-muted mb-0 info-1">
                外观: {{l.colorO}}&nbsp;&nbsp; 内饰: {{l.colorI}}
              </p>
              <p class="text-right mb-0 info-1">采购价<span class="text-danger font-price">{{l.price}}</span>元</p>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-col cols='12' v-if="nextLoading == 'isLoading'" class="py-4">
        <div class="pre_loading_css">
          <div></div> 
          <div></div> 
          <div></div> 
          <div></div> 
          <div></div>
        </div>
      </b-col>
      <b-col cols='12' v-else class="py-5 text-sm text-muted">
        <center>{{nextLoading == 'isError'?'listErrorMsg':'没有更多了'}}</center>
      </b-col>
    </v-bts>
      <b-btn class="back-top" @click="backTop()"></b-btn>
  </b-container>
</template>
<script>
import VueDatepickerLocal from 'vue-datepicker-local'

export default {
  name: 'home',
  data() {
    return {
      isNavShow: false,
      isNavActive:'state' || 'latest',
      navHeight: 0,
      isHide: false,
      amount: {
        isShow:false,
        no:0
      },
      nav:{
        isShow: false,
        onSelect: '',
        selList:{// 筛选导航列表
          price:[],
          state:[],
          time:[{
            name:'不限',
            key: null,
          },{
            name:'升序',
            key: 0,
          },{
            name:'降序',
            key: 1,
          }]
        },
        selSets:{// 筛选导航 值 当前生效（用于搜索）
          price: 0,
          state: 'select_1369_1',
          time:{
            start:'',
            end:''
          }
        },
        oNselSets:{// 筛选导航 值 备用（用于重置）
          price: 0,
          state: 'select_1369_1',
          time:{
            start:'',
            end:''
          }
        }
      },
      showList:[],
      ajaxUrl: process.env.NODE_ENV == 'development' || /\/demo\//g.test(window.location.href) ?'./static/ajaxEg.json':'/member/object/list/v3',
      ajaxData:{
        ids:'mot_pdy6w5jk4klm9rk',
        is_related:0,
        formate:'json',
        keywords:'',
        page:1,
        keywords_array:'',
      },
      nextLoading: 'isLoading',
      listErrorMsg: '数据异常，请检查网络后重试'
    }
  },
  components:{
    VueDatepickerLocal
  },
  mounted() {
    window.happ = this
    console.log(process.env.NODE_ENV)
    document.title = '和亿平行进口车'
    if(!this.showList[0]){
      this.getList()
    }
  },
  methods: {
    initNav(price, state){
      let deNone = {
        name:'不限',
        value: 0,
        key:''
      };
      price && (price.unshift(deNone),this.$set(this.nav.selList, 'price', price));
      state && (state.unshift(deNone),this.$set(this.nav.selList, 'state', state));
    },
    swapNav(typeName){
      let isThisType = this.isNavActive == typeName?1:0;
      this.$set(this, 'isNavActive', typeName)
      if(this.isHide){
        clearTimeout(this.isHide)
      }else{
        this.isHide = true
      }
      if(typeName != 'latest'){
        let setS = (dlay)=>{
          setTimeout(() => {
            if(isThisType){
              this.$set(this, 'isNavShow', !this.isNavShow)
            }else{
              this.$set(this, 'isNavShow', true)
            }
            // this.$set(this, 'isNavActive', typeName)
            this.$nextTick(()=>{
              let box = this.$refs.navBox
              this.navHeight = box.scrollHeight;
              this.isHide = setTimeout(() => {
                this.isHide = false
              }, 800);
            })
          }, dlay)
        },_this = this;
        this.navHeight = 0;
        if(!this.isNavShow){
          setS(0)
        }else{
          // if(!isThisType){
            setS(200)
          // }else{
          //   this.$set(this, 'isNavShow', !this.isNavShow)
          //   this.isHide = setTimeout(() => {
          //     this.isHide = false
          //   }, 800);
          // }
        }
      }else{
        this.reNewList('reset')
        // this.$set(this, 'isNavActive', typeName)
      }
    },
    setNavSel(sk){
      this.nav.selSets[this.isNavActive] = sk.key;
      this.isEnsureSel(1)
    },
    disabledDateS(tt){
      if(this.nav.selSets.time.end && tt > this.nav.selSets.time.end){
        return true
      }else if(tt >= new Date()){
        return true
      }
    },
    disabledDateE(tt){
      if(this.nav.selSets.time.start && tt < this.nav.selSets.time.start){
        return true
      }else if(tt >= new Date()){
        return true
      }
    },
    clearTime(tag){
      this.$set(this.nav.selSets.time, tag, '')
    },
    isEnsureSel(falg){// 筛选导航 确认/取消
        this.navHeight = 0;
        if(falg){
          console.log(0)
          // this.nav.selSets
          this.nav.oNselSets = JSON.parse(JSON.stringify(this.nav.selSets));
          this.ajaxData.page = 1
          this.isHide = setTimeout(()=>{
            this.$refs['vList'].toggleAc('on');
            setTimeout(() => {
              this.getList(()=>{
                this.$refs['vList'].toggleAc('off');
                this.$refs['vList'].refresh()
              })
            }, 400);
          },300)
        }else{
          clearTimeout(this.isHide)
          this.isHide = setTimeout(() => {
            this.isHide = false
          }, 800);
          this.nav.selSets = JSON.parse(JSON.stringify(this.nav.oNselSets));
        }
        setTimeout(()=>{
          this.$set(this, 'isNavShow', false)
        },300)
    },
    initAjaxData(){// 初始化 ajax data
      let newData = [];
      if(this.nav.oNselSets.state && this.nav.oNselSets.state !='false'){
        newData.push(this.nav.oNselSets.state)
      }
      if(this.nav.oNselSets.price  && this.nav.oNselSets.price !='false'){
        newData.push(this.nav.oNselSets.price)
      }
      if(parseInt(this.nav.oNselSets.time)>=0){
        this.ajaxData.is_desc = this.nav.oNselSets.time;
        this.ajaxData.sort_by = 1360;

      }else{
        delete this.ajaxData.is_desc;
        delete this.ajaxData.sort_by;
      }
      // if(this.nav.selSets.time.start){
      //   this.ajaxData.start_time = reDataForm(this.nav.selSets.time.start)
      // }else{
      //   delete this.ajaxData.start_time
      // }
      // if(this.nav.selSets.time.end){
      //   this.ajaxData.end_time = reDataForm(this.nav.selSets.time.end)
      // }else{
      //   delete this.ajaxData.end_time
      // }
      this.ajaxData.keywords_array = newData.join(',|,')
      console.log(this.ajaxData)
      function reDataForm(dateObj){
        let d = dateObj && dateObj.getFullYear && dateObj.getFullYear()
        if(!d){
          return ''
        }
        d += `-${reTen(dateObj.getMonth()+1)}-${reTen(dateObj.getDate())}`
        if(0){
          d += ` ${reTen(dateObj.getHours())}:${reTen(dateObj.getMinutes())}`
          return d
        }else{
          return d
        }
        function reTen(re){
          re = parseInt(re)
          if(re<=10){
            return '0' + re
          }else{
            return re
          }
        }
      }
    },
    getList(reCallBack, isAdd){// 获取列表 （包含初始化 ajax data）
      this.initAjaxData()
      this.axios.get(this.ajaxUrl, { params: this.ajaxData}).
      then((re)=>{
        // 初始化 筛选按钮
        this.initNav(setKeyObj(re.data.temp[1371]),setKeyObj(re.data.temp[1369]))
        // 初始化列表
        let dataList = [],freeInfoTemp = reObj(re.data.temp[1368].input_type).items;
        for(let ck in freeInfoTemp){
          if( (!freeInfoTemp[ck].value && freeInfoTemp[ck].value != 0) || !(freeInfoTemp[ck].name+'').length ){
            freeInfoTemp.splice(ck,1)
          }
        }
        for(let k in re.data.list){
          let t_k = re.data.list[k],to_push = {};
          // t_k.profile_value_json = (t_k.profile_value_json)
          let stateInfo = reNV(t_k, 1369, 'isObj'),
          freeInfo = reNV(t_k, 1368, 'isObj');
          // 详情页 更多详情列表
          let moreInfo = [],
          infoIdList = [1360, 1361, 1364, 1365];
          for(let k in infoIdList){
            let t_ik = re.data.temp[infoIdList[k]]
            if(!t_ik){
              continue
            }
            moreInfo.push({
              name: t_ik.temp,
              value: reNV(t_k, infoIdList[k]),
            })
          }
          to_push = {
            id: t_k.id,
            ids: t_k.id_strings,
            code: t_k.id_child,
            name: t_k.name,
            head_img: t_k.head_imgs && t_k.head_imgs[0] && t_k.head_imgs || [{
              url:'/img/no_img.svg',
              tumb_url:'/img/no_img.svg'
            }],
            colorO: reNV(t_k, 1363),
            colorI: reNV(t_k, 1396),
            // price: (parseInt(reNV(t_k, 1366)) / 10000).toFixed(2),
            price: rePrice(reNV(t_k, 1366)),
            price0:rePrice(reNV(t_k, 1408)),
            price0Date: t_k.created_at,
            state: stateInfo.value,
            state_name: stateInfo.value_name,
            // free: JSON.parse(JSON.stringify(freeInfoName)),
            free: freeInfoName(freeInfo, freeInfoTemp),
            info: t_k,
            moreInfo
          }
          dataList.push(to_push)
        }
        if(dataList.length != 20){
          this.nextLoading = 'isEnd'
        }
        // if(reCallBack === 'isFirst'){
          
        //   this.getList()
        // }
        if(isAdd){
          this.showAmount(re.data.lastIndice, re.data.amount, true)
          this.$set(this, 'showList', this.showList.concat(dataList))
        }else{
          this.showAmount(re.data.lastIndice, re.data.amount)
          this.showList = [];
          this.$set(this, 'showList', dataList)
          this.$nextTick(()=>{
            this.$refs.vList.scroll.scrollTo(0, 0, 600)
          })
        }
        if(reCallBack){
          reCallBack()
        }
      }).catch((rec,d,c)=>{
        console.log(rec,d,c);
        if(rec.response && rec.response.status == '500'){
          this.listErrorMsg = '系统维护中，请稍后再试';
        }else if(!rec.response || rec.response.status == '404'){
          this.listErrorMsg = '网络或登录异常，请检查网络或重新登录后再试！';
        }else{
          this.listErrorMsg = '未知错误，请联系管理员！';
        }
          alert(errorMsg)
        this.$refs['vList'].toggleAc('off');
        this.$refs['vList'].refresh()
        this.nextLoading = 'isError';
      })
      function freeInfoName(freeInfo, fName){
        for(let f in freeInfo.value){
          for(let ff in fName){
            if(freeInfo.value[f] == fName[ff].value){
              fName[ff].isCk = true;
            }
          }
        }
        return JSON.parse(JSON.stringify(fName))
      } 
      function reNV(t_k, id, isObject){
        let t_l = t_k && t_k.profile_value_json[id];
        if(!t_l){
          return ''
        }
        if(isObject == 'isObj'){
          return t_l || {}
        }else if(isObject){
          return t_l && t_l[isObject] || ''
        }else{
          console.log
          return t_l && t_l.value_name || t_l && t_l.value || ''
        }
      }
      function reObj(t_s){
        if(typeof t_s == 'string'){
          try {
            return JSON.parse(t_s)
          }catch(e){
            console.error(e)
          }
        }else{
          return t_s
        }
      }
      function setKeyObj(oObj){
        let t_i = reObj(oObj.input_type),
        re = [];
        for(let k in t_i.items){
          let t_k = t_i.items[k];
          re.push({
            name: t_k.name,
            value:t_k.value,
            key: `${t_i.type}_${oObj.id}_${t_k.value}`
          })
        }
        return re
      }
      function rePrice(str){
        if(!str){
          return ''
        }
        str += '';
        var str_d;
        str = str.split('.');
        str_d = str[1];
        str = str[0];
        str_d = parseInt(str_d) || 0;
        if(str_d<10){
          str_d = '.0'+str_d;
        }else{
          str_d = '.'+str_d;
        }
        return str.split("").reverse().reduce((prev, next, index) => {
          return ((index % 3) ? next : (next + ',')) + prev;
        }) + str_d;
      }
    },
    toDetail(t_item){
      window.localStorage.setItem(t_item.ids,JSON.stringify(t_item))
      this.$router.push('/detail/' + t_item.ids)
    },
    reNewList(flag){
      // console.log(flag)
      this.isHide = setTimeout(() => {
        this.isHide = false
      }, 800);
      let orD = {
        price: 0,
        state: 0,
        time:{}
      };
      this.$set(this, 'isNavShow', false)
      if(!this.$refs['vList'].isLoadingActive){
        this.$refs['vList'].toggleAc('on');
      }
      if(flag=='reset'){
        this.$set(this.nav, 'oNselSets', orD)
        this.$set(this.nav, 'selSets', orD)
      }
      this.ajaxData.page = 1
      setTimeout(() => {
        this.getList(()=>{
          this.$refs['vList'].toggleAc('off');
          this.$refs['vList'].refresh()
        })
      }, 600);
    },
    showAmount(thisp, all, isTop){
      this.amount.isShow = true;
      if(isTop){
        this.amount.isTop = true;
      }
      this.amount.thisp = thisp;
      this.amount.all = all;
      // setTimeout(() => {
        // this.amount.isShow = false;
      // }, 2200);
    },
    nextPage(){
      if(this.nextLoading != 'isEnd'){
        // setTimeout(() => {
        this.ajaxData.page++;
        this.nextLoading = 'isLoading';
        this.getList(()=>{
          this.$refs['vList'].refresh()
        },true)
        // }, 300);
      }
    },
    overName(text, len, af){
      len = parseInt(len) || 40;
      af = af || '...'
      var re = '',cLen = 0;
      for(var k in text){
        if (text.charCodeAt(k)>127 || text.charCodeAt(k)==94) {
          cLen += 2
        }else{
          cLen ++
        }
        if(cLen > len){
          re += af;
          break
        }
        re += text[k];
      }
      return re
    },
    backTop(){
      this.$refs.vList.scroll.scrollTo(0, 0, 600)
    }
  },
  watch:{
    isNavShow(){
      if(this.isNavShow){
        this.$refs.vList.scroll.disable()
      }else{
        this.$refs.vList.scroll.enable()
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  #home
    .form-control
    .btn
      box-shadow none      
      font-size .9rem
    p
    span
      font-size .9rem
    .state_label
      overflow hidden
      position relative
      &::before
        left -25%
        top 10%
        display block
        position absolute
        transform rotateZ(-40deg)
        z-index 3
        width 80%
        font-size .5rem
        line-height 1.8em
        text-align center
        font-weight 100
      &.state_2::before
        content '已受订'
        background-color #fff100
        color #0d0d0d
      &.state_3::before
        content '已交车'
        background-color #999
        color #fff
    // .form-control:focus
    //   box-shadow: 0 0 0 0.2rem rgba(130,138,145,.5);
    .ng-wrapper
      margin-left -15px;
      margin-right -15px;
    .sp1
      position relative
      padding-left 1.2em
      padding-right 1.2em
      border-radius 3rem 0 0 3rem
      background-color #f7f7f7
      border-color #f7f7f7
    .search-sp0
      background #f7f7f7 url('../assets/search_icon.png') center/40% no-repeat
      min-width 3.5rem
      border-radius 0 3rem 3rem 0
      border-color #f7f7f7
    .nav-sel
      z-index 999
      >.col-3
        padding 0
    .name-label
      height 2.4em
      overflow hidden
      font-size 1rem
    .info-1
      font-size .9rem
    .btn.sp0
      transition-duration 0s
      color: #bbbbbb
      background-color transparent
      border #f7f7f7 1px solid
      border-radius 0
      border-left-color transparent
      position relative
      padding .75em 0
      white-space nowrap
      overflow hidden
      text-overflow ellipsis 
      &:hover
      &:focus
      &.active
        color #333
        z-index 2
      &.asp0:hover
      &.asp0:focus
      &.asp0.active
        color #e63737
      &.dp::after
        content: ""
        display: inline-block
        margin-left: .255em
        vertical-align: .255em
        border-top: .3em solid
        border-right: .3em solid transparent
        border-bottom: 0
        border-left: .3em solid transparent
    .nav-sel-box
      position absolute;
      height 0
      z-index 3
      // bottom 0
      top 0
      transition all .3s ease-out
      // transform translateY(100%)
      width 100%
      background-color #fff
      border-radius 0 0 .5rem .5rem
      overflow hidden
      // &::after
      //   content ''
      //   display block
      //   height 1.5rem
      &.isHide
        overflow hidden
    sel_btn_gap = 0.25rem
    .nav-sel-btn
      margin-left calc(-15px - 0.25rem)
      margin-right calc(-15px - 0.25rem)
      .col-3
        padding-left sel_btn_gap
        padding-right sel_btn_gap
        padding-bottom 1rem
        >.sp0
          border-color #ededed
          padding-top .5rem
          padding-bottom .5rem
    .list
      position relative
      // height calc(100vh - 7.5rem)
      height calc(100vh - 9.2111rem)
      &.coverOn::before
        content ''
        display block
        position absolute
        left 0
        top 0
        z-index 2
        width 100%
        height inherit
        background-color rgba(0, 0, 0, .29)
      .list-child
        border-bottom 1px solid #f7f7f7
        background-color #fff
      .list-child:last-of-type
        border-bottom 0
      .car-img
        padding-top 66.625%
        background #efefef center/cover no-repeat
      .font-price
        font-size 1.1rem
        // font-size .6rem
    .fs-1
      font-size 1rem
  .bc-0
    border-color #e5e5e5
  .btn-x
    width 2.3em
    height 2.3em
    // padding 0
    // line-height 2.3em
    text-align center
  .show-amount
    height 0
    line-height 2.2rem
    background-color #d7f7f0
    color #1abc9a
    // background-color #f3f3f2
    // color #fff
    overflow hidden
    margin-bottom 0
    transition .5s height ease-out
    text-align center
  &.is-show
    height 2.2rem
    transition none
  // &.is-top
  //   z-index 99999999999999
  //   position absolute
  //   width 100%
  //   left 0
  //   top 0
  #home
    .back-top
      position fixed
      width 2rem
      height 2rem
      bottom 3rem
      right 2rem
      border-radius 2rem
      background rgba(108, 117, 125, 0.3) url('../assets/down.png') center/50% no-repeat
      border 0
      transform rotateZ(180deg)
      &:active
        background rgba(108, 117, 125, 0.3) url('../assets/down.png') center/50% no-repeat

</style>
