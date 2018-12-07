<template>
    <div class="wrap" id="">
      <div class="count_box">
    <div class="count_group">
        <div class="count_btn" data-tar="minus" @click="tapBtn('minus')">
            <div>-</div>
        </div>
        <div class="count_input">
            <input class="count-input" v-model="count" @blur="blurHandle('count')" @focus="inputHandle('count')">
        </div>
        <div class="count_btn" data-tar="plus" @click="tapBtn('plus')">
            <div class="plus-btn">+</div>
        </div>
    </div>
    <div v-if='errorMsg' class="errorMsg">{{errorMsg}}</div> 
</div>

    </div>
</template>
<script>

export default {
  props: {
      code:{
          type:String,
          value:null
      },
      max: {
          type: Number,
          value: 99
      },
      min: {
          type: Number,
          value: 0
      },
    //   count: {
    //       type: Number,
    //       value: 1
    //   },
      errorMsg: {
          type:String,
          value: ''
      }
  },
  data(){
      return {
         count:1 
      }
  },
  methods: {
      /*逻辑事件*/
      setNewCount:function(count){
          let _count=this.count;
          if(count!=_count){
              let _data={};
              _data.count=count;
              if(this.code)_data.code=this.code;
              this.$emit('callChangeCount', _data);
              this.count=count;
          }
      },
      /*页面交互*/
      tapBtn: function(_tar) {
          //const _tar=evt.currentTarget.dataset.tar;
          const _max=this.max;
          const _min=this.min;
          let _count=this.count;
          if(_tar=='plus'){
              if(_count<_max){
                  _count++;
              }
          }else{
              if(_count>_min){
                  _count--;
              }
          };
          this.setNewCount(_count);
      },
      blurHandle: function(count){
          //let _value=evt.detail.value;
          const _max=this.data.max;
          const _min=this.data.min;
          let _count=count;
          if(_count>_max)_count=_max;
          if(_count<_min)_count=_min;
          this.setNewCount(_count);
      },
      inputHandle:function(count){
         // let _value=evt.detail.value;
          this.count=count;
      }
  }
}
</script>

<style lang="scss" scoped>
.count_box {
  width: 2.3rem;
}
.count_group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.2rem;
  height: 0.7rem;
  border-radius: 0.04rem;
}
.count_input{
  width: 0.8rem;
}
.count_btn {
  width:0.42rem;
  height:0.42rem;
  padding:0.12rem 0 0.1rem 0.1rem;
  font-size: 0.56rem; 
  line-height: 0.32rem;
}
.errorMsg {
  margin-top: 0.04rem;
  font-size: 0.26rem;
  color: #ff6600;
  text-align: right;
}
input{
  text-align: center;
  font-size: 0.36rem;
}
.count-input{
  width: 0.82rem;
  height: 0.52rem;
  background:#F7F7F7;
  line-height: 0.52rem;
}
.plus-btn{
  margin-left:0.15rem;
}
</style>


