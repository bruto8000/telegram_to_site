


var app = new Vue({
    el: '#app',
    data: {
      
       goods : []

    }
})


let imgUrl = []
let imgDesc = []
let imgTitle = []
let imgDescSub = []

function renewUrl(){
$.ajax({
  type: 'GET',
  url: 'http://127.0.0.1/imgUrl',
  success: function(data){
   imgUrl = JSON.parse(data)

  

  }

});


}
function renewDesc(){
  $.ajax({
    type: 'GET',
    url: 'http://127.0.0.1/imgDesc',
    success: function(data){
     imgDesc = JSON.parse(data)

     app.$data.desc = imgDesc.desc;
      imgDescSub = imgDesc.desc;
    }
  
  });
  
  
}
function renewTitle(){
    $.ajax({
      type: 'GET',
      url: 'http://127.0.0.1/imgDesc',
      success: function(data){
       imgDesc = JSON.parse(data)
 
       app.$data.title = imgDesc.title;
       imgTitle = imgDesc.title
      }
    
    });
    
    
}


setTimeout(() => {
  go()
}, 1000);
setInterval(() => {
  go()
}, 5000);
function go(){
renewUrl();
renewDesc();
renewTitle();
setTimeout(() => {
  dataVue()
}, 1000);



}

function dataVue(){

  let goods = []

for(i=0; i<imgUrl.length; i ++){
 
goods.push(
  {
    url: imgUrl[i],
    title: imgTitle[i],
    desc:imgDescSub[i]

  }
)
}

app.$data.goods = goods;


}










//  $.ajax({
//   type: 'POST',
//   url: 'http://95.31.213.80',
//   data: msg,
//   success: function(data){
//    console.log(data, 'OK GOOD!')
//   }