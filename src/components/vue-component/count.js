//输入 
export default {
    props: { 
        code:{
            type:String,
            value:null
        },
        max: {//传的最大值
            type: Number,
            value: 99
        },
        min: {
            type: Number,
            value: 0
        },
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


//输出
Component({
  properties: {
      code:{
          type:String,
          value:null
      },
      max: {//传如的最大值
          type: Number,
          value: 5
      },
      min: {
          type: Number,
          value: 0
      },
      count: {
          type: Number,
          value: 1
      },
      errorMsg: {
          type:String,
          value: ''
      }
  },
  data: {},
  methods: {
      /*逻辑事件*/
      setNewCount:function(count){
          let _count=this.data.count;
          if(count!=_count){
              let _data={};
              _data.count=count;
              if(this.data.code)_data.code=this.data.code;
              this.triggerEvent('callChangeCount', _data);
              this.setData({ count:count });
          }
      },
      /*页面交互*/
      tapBtn: function(evt) {
          const _tar=evt.currentTarget.dataset.tar;
          const _max=this.data.max;
          const _min=this.data.min;
          let _count=this.data.count;
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
      blurHandle: function(evt){
          let _value=evt.detail.value;
          const _max=this.data.max;
          const _min=this.data.min;
          let _count=_value;
          if(_count>_max)_count=_max;
          if(_count<_min)_count=_min;
          this.setNewCount(_count);
      },
      inputHandle:function(evt){
          let _value=evt.detail.value;
          this.setData({ count:_value });
      }
  
  }
})
