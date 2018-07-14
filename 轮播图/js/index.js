function banner(id,url) {
    this.banner=document.getElementById("banner");
    this.oul=this.banner.children[0];
    this.olis=this.oul.getElementsByTagName("li");
    this.oimg=this.oul.getElementsByTagName("img");
    this.bannerTip=utils.children(this.banner,"div")[0];
    this.btnLeft=utils.children(this.banner,"span")[0];
    this.btnRight=utils.children(this.banner,"span")[1];

    this.resData=null;
    this.step=0; // banner索引
    this.autotimer=null;
    this.url=url
    this.init();
}
banner.prototype={
    init:function(){
        // 1 获取数据
        this.getData();
        // 绑定数据
        this.bindHtml();
        // 延迟加载
         window.setTimeout(()=>{this.loadimg()},1000)

        // 自动轮播
        this.autotimer=window.setInterval(()=>{this.autoplay()},2000)
        // 启动和停止轮播
        this.overout()
        // 点击焦点切换banner
        this.bannerBtn();
        // 点击左右箭头切换
        this.handleArrow();
    },
    getData:function () {
        let xhr=new XMLHttpRequest();
        xhr.open("get",this.url,false);
        xhr.onreadystatechange=()=> {
            if (xhr.readyState==4&&/^2\d{2}$/.test(xhr.status)){
                this.resData=JSON.parse(xhr.responseText);
            }
        }
        xhr.send(null);
    },
    bindHtml:function () {
        let strLi="";
        let strA="";
        this.resData.forEach((item,index)=>{
            strLi+=`<li><img src="" realImg="${item.img}" alt=""></li>`;
            strA+=index==0?`<a href="javascript:;" class="bg"></a>`:`<a href="javascript:;"></a>`;


        })
        strLi+=`<li><img src="" realImg="${this.resData[0].img}" alt=""></li>`
        this.oul.innerHTML=strLi;
        this.oul.style.width=this.olis.length*this.olis[0].offsetWidth+"px";
        this.bannerTip.innerHTML=strA;
        console.log(this.resData);
        this.oAs=utils.children(this.bannerTip,"a");

    },
    loadimg:function () {

           [...this.oimg].forEach((item,index)=>{
               var tempImg=new Image();
               tempImg.src=item.getAttribute("realImg");
               tempImg.onload=function () {
                   item.src=this.src;
                   animate(item,{opacity:1},500);
               }
           })
    },
    autoplay:function () {
           this.step++;
           if (this.step===this.olis.length){
               this.oul.style.left=0;
               this.step=1;//紧接着是第二张显示
           }
           animate(this.oul,{left:-this.step*this.olis[0].offsetWidth},1000)
           this.foucusFn()



    },
    foucusFn:function(){
        let step=this.step==this.olis.length-1?0:this.step
          this.oAs.forEach((item,index)=>{
             step==index?utils.addClass(item,"bg"):utils.removeClass(item,"bg");
          })


    },

    overout:function () {
        this.banner.onmouseover=()=>{
            // 去掉自行轮播，左右箭头显示出来
            window.clearInterval(this.autotimer);
            this.btnLeft.style.display=this.btnRight.style.display="block";

        }

        this.banner.onmouseout=()=>{
            this.btnLeft.style.display=this.btnRight.style.display="none";
            this.autotimer=window.setInterval(()=>{
                this.autoplay();
            },2000)

        }

    },
    bannerBtn:function () {
        this.oAs=utils.children(this.bannerTip,"a");
  this.oAs.forEach((item,index)=>{
      item.onclick=()=>{
          this.step=index;
          animate(this.oul,{left:-this.step*this.olis[0].offsetWidth},1000)
          this.foucusFn();
      }

  })
    },
    handleArrow:function () {
     this.btnLeft.onclick=()=>{
     this.step--;
     if (this.step<0){
         this.oul.style.left=-(this.olis.length-1)*this.olis[0].offsetWidth+"px";
         this.step=this.olis.length-2;
     }
     animate(this.oul,{left:-this.step*this.olis[0].offsetWidth},1000)
         this.foucusFn();
     }
     this.btnRight.onclick=()=>{
         this.autoplay()
     }
    }

}