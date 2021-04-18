const ticketCardList = document.querySelector("#ticketCardList");
//新增ticket
const name = document.querySelector("#ticketName");
const imgUrl = document.querySelector("#ticketImgUrl");
const area = document.querySelector("#ticketRegion");
const price = document.querySelector("#ticketPrice");
const group = document.querySelector("#ticketNum");
const rate = document.querySelector("#ticketRate");
const description = document.querySelector("#ticketDescription");
const addBtn = document.querySelector("#addTicketBtn");
const form = document.querySelector(".addTicketForm");
// 地區搜尋
const regionFilter = document.querySelector(".regionFilter");
const filterResult = document.querySelector("#filterResult");
// 查無關鍵字
const cantFindArea = document.querySelector(".cantFind-area")

let data = [];
const api = "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

function init(){
  axios.get(api).then(function(res){
    data = res.data.data;
    render();//景點列表渲染
    renderC3();//c3.js 圖表
  })
}
init();


function render(location){
  let str = "";
  let cacheData;

  // 篩選地區
  cacheData = data.filter(function(item){
      if (location === item.area){
          return item;
      }
      // 全部
      if (!location){
          return item;
      }
  });

  cacheData.forEach(function(item){
  content =  `<li class="col-4 ticketCard px-0 mb-10 mr-11">
  <div class="ticketImg">
    <a href="#">
      <img src=${item.imgUrl}" alt="${item.name}">
    </a>
    <div class="ticketRegion bg-secondary text-white">${item.area}</div>
    <div class="ticketRank bg-primary text-white">${item.rate}</div>
  </div>
  <div class="ticketContent d-flex flex-column justify-content-between bg-white p-11">
    <h3 class="ticketName text-primary font-weight-bold mb-11 pb-1">
    <a href="#">${item.name}</a>
    </a>
  </h3>
  <p class="ticketDescription text-dark ">${item.description}</p>
  
  <div class="ticketInfo d-flex align-items-end  justify-content-between text-primary font-weight-bold">
    <div class="ticketNum">
      <p><span class="material-icons">
        error
        </span>
        剩下最後
      <span>${item.group}</span>
    組</p>
    </div>
    <p class="ticketPrice">
      TWD$ <span>${item.price}</span>
    </p>
  </div>
</div>
</li>`
str += content;
})

ticketCardList.innerHTML = str;
filterResult.textContent = `本次搜尋共 ${cacheData.length} 筆資料`;

}

function renderC3(){
  let objTotal = {};
  data.forEach(function(item){
    if(objTotal[item.area] == undefined){
      objTotal[item.area] = 1;
    }
    else {
      objTotal[item.area] +=1;
    }
  }); 
  // objTotal {高雄: 1, 台北: 1, 台中: 1}
  
  let area = Object.keys(objTotal);
  let newData = [];
  area.forEach(function(item){
    let ary = [];
    ary.push(item);
    ary.push(objTotal[item]);
    newData.push(ary)
  })
  
  
  // 將 newData 丟入 c3 產生器
  const chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      columns: newData,
      type : 'donut',// 圖表種類
      colors: {
        台北: "#26BFC7",
        台中: "#5151D3",
        高雄: "#E68619"
      }
    },
    donut: {
      title: "套票地區比重",// 圖表名稱
      label: {
        show: false // 標籤不顯示  
      },
      width: 10,
    },
    size: {
      height: 170,
      width: 170
    }
  });

}

//新增套票+防呆
addBtn.addEventListener('click',function(e){
  e.preventDefault(); 
  if(form.ticketName.value == "" || form.ticketImgUrl.value == "" || form.ticketRegion.value == ""||form.ticketPrice.value == "" || form.ticketNum.value == "" || form.ticketRate.value == ""){
    alert("請填寫完整資料");
  }else if( form.ticketPrice.value < 1){
    alert("請填寫正確套票金額");
    return;
  }else if(form.ticketNum.value < 1){
    alert("請填寫正確套票組數");
  }else if(form.ticketRate.value < 1  || form.ticketRate.value > 10){
    alert("請填寫星級 1~10 星");
    
  }else if(form.ticketDescription.value.length > 100){
    alert("套票描述不得超過100字");
  } else {
    data.push({
      id: Date.now(),
      name: name.value,
      imgUrl: imgUrl.value,
      area: area.value,
      price: Number(price.value),
      group: Number(group.value),
      rate: Number(rate.value),
      description: description.value
  });
    alert("新增成功");
  };
  form.reset();
  render();
  renderC3();
})

//資料新增不全

//搜尋資料
regionFilter.addEventListener("change", function (e) {
  let count = 0;
  let str = "";
  data.forEach(function (item, index) {
    let content = `<li class="col-4 ticketCard px-0 mb-10 mr-11">
    <div class="ticketImg">
      <a href="#">
        <img src=${item.imgUrl}" alt="${item.name}">
      </a>
      <div class="ticketRegion bg-secondary text-white">${item.area}</div>
      <div class="ticketRank bg-primary text-white">${item.rate}</div>
    </div>
    <div class="ticketContent d-flex flex-column justify-content-between bg-white p-11">
      <h3 class="ticketName text-primary font-weight-bold mb-11 pb-1">
      <a href="#">${item.name}</a>
      </a>
    </h3>
    <p class="ticketDescription text-dark ">${item.description}</p>
    
    <div class="ticketInfo d-flex align-items-end  justify-content-between text-primary font-weight-bold">
      <div class="ticketNum">
        <p><span class="material-icons">
          error
          </span>
          剩下最後
        <span>${item.group}</span>
      組</p>
      </div>
      <p class="ticketPrice">
        TWD$ <span>${item.price}</span>
      </p>
    </div>
  </div>
  </li>
  `;
    if (regionFilter.value == ""){
      count ++;
      str += content;
    } else if (regionFilter.value == item.area) {
      count ++;
      str += content;
    }
  })
  if(count === 0){
    cantFindArea.classList.add('d-block');
    cantFindArea.classList.remove('d-none');
  }else{
    cantFindArea.classList.add('d-none');
    cantFindArea.classList.remove('d-block');
  }
  ticketCardList.innerHTML = str;
  filterResult.textContent = `本次搜尋共 ${count} 筆資料`;
})
