"use strict";function Chart(e,t,a,l,o){this.dataset=a||null,this.width=l,this.height=o,this.svg=d3.select(e),this.path=null,this.textLabel=t,this.total={value:0,text:null}}function ChartArc(e,t,a,l,o,s,n){Chart.call(this,e,t,a,l,o),this.pie=d3.pie(),this.arc=d3.arc(),this.radius=Math.min(this.width,this.height)/2,this.thickness=s,this.cornerRadius=n,this.init(),this.initArc()}function ChartDonut(e,t,a,l,o,s){Chart.call(this,e,t,a,l,o),this.pie=d3.pie(),this.arc=d3.arc(),this.radius=Math.min(this.width,this.height)/2,this.thickness=s,this.init(),this.initDonut()}function ChartGraph(e,t,a,l,o,s,n){Chart.call(this,e,t,a,l,o),this.margin={top:20,right:20,bottom:30,left:20},this.domain={x:{label:s},y:{label:n}},this.line=d3.line(),this.init(),this.initGraph()}function parseJSONFile(e,t){var a,l;e&&(a="data/json",l=a+"/min/"+e+".json",$.ajax({url:l,method:"GET",async:!0,contentType:"application/json",success:function(e){t(e)}}))}function parseJSONFiles(e,t){var a,l,o,s;if(l=[],o=0,e)for(s=0,a=e.length;s<a;s++)l[s]=null,function(a){parseJSONFile(e[a],function(s){var n,i,r,c,d,u,h,g,v;if(v=[],s){for(n=0,i=s.Pharos.Playlist[0].BlockList[0].Block[0].PlaylistItem.length;n<i;n++){for(g=!1,u=s.Pharos.Playlist[0].BlockList[0].Block[0].PlaylistItem[n],d={title:null,programId:null,time:null,name:null,status:null},d.name=s.Pharos.Playlist[0].ChannelName[0],d.time=u.ScheduledDuration[0],r=0,c=u.Template[0].DataElementList[0].DataElement.length;r<c;r++)h=u.Template[0].DataElementList[0].DataElement[r],"video"===h.Name[0]&&(d.title=h.Value[0].DataElementCompoundList[0].DataElementList[0].DataElement[1].Value[0],d.programId=h.Value[0].DataElementCompoundList[0].DataElementList[0].DataElement[0].Value[0]),"bug"===h.Name[0]&&(d.status="issue",g=!0);g&&v.push(d)}l[a]=v,console.log(a,o),++o===e.length&&(console.log(l),t(l))}})}(s)}function reset(e){for(i=0,i<e.length;i<len;i++)for(j=0,len=e[i].length;j<len;i++)results[i][j]=null}var $=require("jquery"),d3=require("d3");window.PageSupport=function(){$(document).ready(function(){function e(){$(".has-subnav").on("click",function(){$(this).hasClass("subnav-opened")?$(".has-subnav").removeClass("subnav-opened"):($(".has-subnav").removeClass("subnav-opened"),$(this).addClass("subnav-opened"))})}e(),$(".content--table").on("click",".display-tooltip, .icon--close",function(e){e.preventDefault(),$(this).closest("td").find(".display-tooltip").toggleClass("status--active"),$("#modal--target").toggleClass("hidden")}),$(".content--table").on("click",".tooltip, .icon--close",function(e){e.stopPropagation()}),$("#modal--target").on("click",function(e){e.preventDefault(),$("#modal--target").toggleClass("hidden"),$(".display-tooltip.status--active").toggleClass("status--active")}),$(".select--styled").on("click",function(e){$(this).toggleClass("active")})})},window.PageReports=function(){$(document).ready(function(){function e(){$(".has-subnav").on("click",function(){$(this).hasClass("subnav-opened")?$(".has-subnav").removeClass("subnav-opened"):($(".has-subnav").removeClass("subnav-opened"),$(this).addClass("subnav-opened"))})}e(),$(".content--table").on("click",".display-tooltip, .icon--close",function(e){e.preventDefault(),$(this).closest("td").find(".display-tooltip").toggleClass("status--active"),$("#modal--target").toggleClass("hidden")}),$(".content--table").on("click",".tooltip, .icon--close",function(e){e.stopPropagation()}),$("#modal--target").on("click",function(e){e.preventDefault(),$("#modal--target").toggleClass("hidden"),$(".display-tooltip.status--active").toggleClass("status--active")}),$(".select--styled").on("click",function(e){$(this).toggleClass("active")})})},window.PageFAQ=function(){$(document).ready(function(){function e(){$(".has-subnav").on("click",function(){$(this).hasClass("subnav-opened")?$(".has-subnav").removeClass("subnav-opened"):($(".has-subnav").removeClass("subnav-opened"),$(this).addClass("subnav-opened"))})}e(),$(".content--table").on("click",".display-tooltip, .icon--close",function(e){e.preventDefault(),$(this).closest("td").find(".display-tooltip").toggleClass("status--active"),$("#modal--target").toggleClass("hidden")}),$(".content--table").on("click",".tooltip, .icon--close",function(e){e.stopPropagation()}),$("#modal--target").on("click",function(e){e.preventDefault(),$("#modal--target").toggleClass("hidden"),$(".display-tooltip.status--active").toggleClass("status--active")}),$(".select--styled").on("click",function(e){$(this).toggleClass("active")})})},window.PageAssetTracking=function(){$(document).ready(function(){function e(e,t,a){var l={isOverflowing:!1,overflow:{top:null,right:null,bottom:null,left:null}};return e.left-a<t.left&&(l.isOverflowing=!0,l.overflow.left=t.left-e.left),t.top>e.top+a&&(l.isOverflowing=!0,l.overflow.top=e.top-t.top),t.right<e.left+e.width-a&&(l.isOverflowing=!0,l.overflow.right=t.right-e.left),t.bottom<e.top+e.height-a&&(l.isOverflowing=!0,l.overflow.bottom=t.bottom-(e.top+e.height)),l}function t(){$(".has-subnav").on("click",function(){$(this).hasClass("subnav-opened")?$(".has-subnav").removeClass("subnav-opened"):($(".has-subnav").removeClass("subnav-opened"),$(this).addClass("subnav-opened"))})}function a(){$(".has-comments").on("click",function(){$(this).hasClass("comments-opened")?$(".has-comments").removeClass("comments-opened"):($(".has-comments").removeClass("comments-opened"),$(this).addClass("comments-opened"))})}function l(){var e=(document.getElementsByClassName("clickable-row"),document.getElementsByClassName("has-hover"));if(e)for(var t=0,a=e.length;t<a;t++){e[t];document.addEventListener("click",function(e){e.target&&"TR"===e.target.nodeName?window.document.location=e.target.getAttribute("data-href"):e.target&&"TD"===e.target.nodeName&&(window.document.location=e.target.parentElement.getAttribute("data-href"))},!0)}}function o(e){var t,a,l,o,s,n;if(s=[],e)for(t=0,a=e.length;t<a;t+=1)l=e[t],l&&(n="#chart-"+l.type+"-"+(t+1),console.log(n),"donut"===l.type&&(o=new ChartDonut(n,l.label,l.data,174,174,40)),s.push(o))}var s;s=[{type:"donut",data:[{label:"Received",colorClass:"donut--dark-blue",value:750},{label:"Processing",colorClass:"donut--medium-blue",value:358},{label:"Missing",colorClass:"donut--red",value:15},{label:"Rejected",colorClass:"donut--red",value:2},{label:"Processed",colorClass:"donut--light-blue",value:275}]}],t(),a(),o(s),l(),$(".content--table").on("click",".display-tooltip, .icon--close",function(t){if(t.preventDefault(),$("#modal--target").hasClass("hidden")){console.log(t);var a=600,l=$(".tooltip").outerHeight();console.log(t.target.getBoundingClientRect().left);var o={left:t.target.getBoundingClientRect().left,top:t.target.getBoundingClientRect().top,right:t.target.getBoundingClientRect().right,bottom:t.target.getBoundingClientRect().bottom,width:a,height:l,clickedElementWidth:t.target.getBoundingClientRect().width,clickedElementHeight:t.target.getBoundingClientRect().height},s=t.delegateTarget.getBoundingClientRect(),n=20,i={left:41,right:41,top:15,bottom:15};console.log(o),console.log(s);var r=e(o,s,n);console.log(r),r.isOverflowing?(r.overflow.bottom&&$(".tooltip").css({marginTop:-l-o.clickedElementHeight-2*i.bottom+"px"}),r.overflow.left&&$(".tooltip").css({marginLeft:-i.left+"px"}),r.overflow.right&&$(".tooltip").css({marginLeft:-a+i.right+n+24+"px"}),r.overflow.right&&r.overflow.bottom&&$(".tooltip").addClass("tooltip--bottom-right")):($(".tooltip").addClass("tooltip--top-left"),$(".tooltip").css({marginTop:"15px",marginLeft:"-41px"}))}$(this).closest("td").find(".display-tooltip").toggleClass("status--active"),$("#modal--target").toggleClass("hidden")}),$(".content--table").on("click",".tooltip, .icon--close",function(e){e.stopPropagation()}),$("#modal--target").on("click",function(e){e.preventDefault(),$("#modal--target").toggleClass("hidden"),$(".display-tooltip.status--active").toggleClass("status--active")}),$(".select--styled").on("click",function(e){$(this).toggleClass("active")})})},window.PageDashboard=function(){$(document).ready(function(){function e(e){var t,a,l,o,s,n,i,r,c;if(a=l=o=0,r=[],e)for(t=0,s=e.length;t<s;t+=1)n=e[t],n&&("donut"===n.type?(a++,c="#chart-"+n.type+"-"+a,i=new ChartDonut(c,n.label,n.data,174,174,40)):"arc"===n.type?(l++,c="#chart-"+n.type+"-"+l,i=new ChartArc(c,n.label,n.data,78,78,6,2)):"graph"===n.type&&(o++,c="#chart-"+n.type+"-"+o,i=new ChartGraph(c,n.label,n.data,800,328,"Archive Usage (TB)","Sample Dates")),r.push(i))}function t(e,t){var l=$(window).width()-466-40-20-4;$(e).find(".grid--"+t).each(function(){$(this).width(l)}),a(e,".switches",l+20)}function a(e,t,a){var l,o;$(t).on("click",".switch-grid",function(s){l=$(t).find(".switch-grid.selected").parent().index(),console.log(l),o=$(this).parent().index(),$(this).hasClass("selected")||($(t).find(".switch-grid").removeClass("selected"),$(this).addClass("selected"),m+=(l-o)*a,console.log(m),i(e,m)),console.log(o)})}function l(e,t,a){var l,o;l="left"===t?1:-1,o=a*l,f+=o,b=Math.round(f/256)*-1,i(e,f)}function o(e){i("#calendar--year",e*-256),b=e,f=e*-256}function s(e,t,a){$(t).on("click",function(t){t.preventDefault(),b>0&&l(e,"left",256)}),$(a).on("click",function(t){t.preventDefault(),b<11&&l(e,"right",256)})}function n(){$(".close-alert").on("click",function(){$(this).closest(".module--alert").toggleClass("hidden")})}function i(e,t){$(e).css({transform:"translate("+t+"px, 0)","-webkit-transform":"translate("+t+"px, 0)","-moz-transform":"translate("+t+"px, 0)"})}function r(e,t,a,l,o){var s,n,i,r,c,d,u,h,g,v,p,f;for(g="",v="",c=a,p=l,s=0,i=o.length;s<i;s+=1){for(h=o[s],d=(c-1+h.days)%7,u=0===d?6:7-d-1,g+="<li>",g+='<h2 class="calendar--month article--title">'+h.month+" "+t+"</h2>",g+='<ol class="calendar--week"><li>Sun</li><li>Mon</li><li>Tue</li><li>Wed</li><li>Thu</li><li>Fri</li><li>Sat</li></ol>',g+='<ol id="calendar--days" class="calendar--days">',n=c,r=0;n>r;n-=1)v+='<li class="day day--opaque">',v+='<a href="#," class="day--link">',v+=p-(p+n)%(p+1),v+="</a>",v+="</li>";for(n=0,r=h.days;n<r;n+=1)v+='<li class="day">',v+='<a href="#," class="day--link">',v+=n+1,v+="</a>",v+="</li>";for(n=0,r=u;n<r;n+=1)v+='<li class="day day--opaque">',v+='<a href="#," class="day--link">',v+=n+1,v+="</a>",v+="</li>";c=(d+1)%7,console.log("start index end loop: "+c),g+=v,p=h.days,v="",g+="</ol>",g+="</li>"}$(e).each(function(){var e,t,a,l,o,n,r=$(this);if(r.append(g),r.parent().hasClass("date-picker"))n=r.children().get(7),$(n).find(".day:not(:nth-child(n+7):nth-child(-n+15))").addClass("day--opaque"),r.on("click",".day:not(.day--opaque) .day--link",function(s){e=$(this).text(),console.log(e.toString),l=1===e.toString().length?"0":"",t=b+1,a=2016,o=1===t.toString().length?"0":"",$("#schedule--date-from").val(l+e+"/"+o+t+"/"+a)});else for(f=[5,17],n=r.children().get(7),s=0,i=f.length;s<i;s++)$(n).find(".day:nth-child("+(f[s]+1)+")").addClass("day--filled")})}function c(){$(".has-subnav").on("click",function(){$(this).hasClass("subnav-opened")?$(".has-subnav").removeClass("subnav-opened"):($(".has-subnav").removeClass("subnav-opened"),$(this).addClass("subnav-opened"))})}function d(){var e=(document.getElementsByClassName("clickable-row"),document.getElementsByClassName("has-hover"));if(e)for(var t=0,a=e.length;t<a;t++){var l=e[t];l.addEventListener("click",function(e){e.target&&"TR"===e.target.nodeName?window.document.location=e.target.getAttribute("data-href"):e.target&&"TD"===e.target.nodeName&&(window.document.location=e.target.parentElement.getAttribute("data-href"))},!0)}}function u(e){var t,a,l;l=$("#missing-list-body"),l.html(""),t=1,parseJSONFiles(e,function(e){a=h(e,t),l.html(a)})}function h(e,t){var a,l,o,s,n,i,r;for(a="",l=0,s=e.length;l<s;l++)for(o=0,n=t;o<n;o++)if(i=e[l][o]){a+="<tr>";for(r in i)"status"===r?(a+='<td><span class="status status--warning">',a+="Warning",a+="</span>Unavailable</td>"):(a+="<td>","programId"===r&&(a+="NBCU000-"),a+=i[r],a+="</td>");a+="</tr>"}return a}var g,v,p,b,f,m,C,y;m=0,f=0,v=31,g=5,y=["20160817115924_SFPL_08-18-16_V1","20160817103117_DVRO_08-18-16_V1","20160817163943_UNIR_08-18-16_v1","20160816143539_UNPL_08-18-16_v1","20160817163047_UNUK_08-18-16_v1","20160816155158_UNHU_08-18-16_1","20160817164454_SFUK_08-18-16_FINAL1","20160817165608_MOUK_08-18-16_V1","20160817165215_MPUK_08-18-16_V1","20160815170714_TMAF_08-18-16_V1","20160817164558_UNSA_08-18-16_1","20160816141420_SFME_08-18-16_1","20160812110155_13FR_08-18-16_1","20160817152940_SUSA_08-18-16_1"],p=[{month:"January",days:31},{month:"February",days:29},{month:"March",days:31},{month:"April",days:30},{month:"May",days:31},{month:"June",days:30},{month:"July",days:31},{month:"August",days:31},{month:"September",days:30},{month:"October",days:31},{month:"November",days:30},{month:"December",days:31}],C=[{type:"donut",data:[{label:"Received",colorClass:"donut--dark-blue",value:2750},{label:"Processing",colorClass:"donut--medium-blue",value:964},{label:"Missing",colorClass:"donut--red",value:10},{label:"Rejected",colorClass:"donut--red",value:1},{label:"Processed",colorClass:"donut--light-blue",value:275}]},{type:"donut",data:[{label:"Processed",colorClass:"donut--purple",value:1850},{label:"Failed",colorClass:"donut--red",value:1150}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--grey",value:0},{label:"Processed",colorClass:"arc--green",value:75}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--red",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--grey",value:0},{label:"Processed",colorClass:"arc--green",value:75}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--red",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:25}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--grey",value:0},{label:"Processed",colorClass:"arc--green",value:75}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--grey",value:0},{label:"Processed",colorClass:"arc--green",value:75}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--grey",value:0},{label:"Processed",colorClass:"arc--green",value:75}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--grey",value:0},{label:"Processed",colorClass:"arc--green",value:75}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--red",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--grey",value:0},{label:"Processed",colorClass:"arc--green",value:75}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--red",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:25}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--grey",value:0},{label:"Processed",colorClass:"arc--green",value:75}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--grey",value:0},{label:"Processed",colorClass:"arc--green",value:75}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--blue",value:0},{label:"Processing",colorClass:"arc--green",value:75}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"100",data:[{label:"Else",colorClass:"arc--yellow",value:0},{label:"Processed",colorClass:"arc--green",value:50}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"50",data:[{label:"Rejected",colorClass:"arc--yellow",value:50},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"0",data:[{label:"Rejected",colorClass:"arc--yellow",value:0},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"0",data:[{label:"Rejected",colorClass:"arc--yellow",value:0},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"0",data:[{label:"Rejected",colorClass:"arc--yellow",value:0},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"arc",label:"0",data:[{label:"Rejected",colorClass:"arc--yellow",value:0},{label:"Processing",colorClass:"arc--blue",value:50}]},{type:"graph",label:"ARCHIVE USAGE",cols:["Date","TB"],data:[{date:"2015-12-27T14:15:38-08:00",value:947},{date:"2015-10-29T15:08:45-07:00",value:921},{date:"2015-10-20T15:39:52-07:00",value:974},{date:"2015-11-04T15:10:00-08:00",value:899},{date:"2016-01-20T02:51:13-08:00",value:945},{date:"2015-09-17T18:38:56-07:00",value:906},{date:"2015-10-18T03:36:49-07:00",value:934},{date:"2015-11-06T14:51:59-08:00",value:924},{date:"2015-12-31T23:40:22-08:00",value:887},{date:"2015-09-09T22:07:51-07:00",value:901},{date:"2015-11-28T15:44:09-08:00",value:924},{date:"2015-09-15T08:14:47-07:00",value:894},{date:"2015-10-28T02:16:56-07:00",value:966},{date:"2015-09-13T03:16:19-07:00",value:926},{date:"2015-09-07T16:21:58-07:00",value:965},{date:"2016-01-14T15:19:02-08:00",value:954},{date:"2015-10-17T06:38:23-07:00",value:939},{date:"2016-01-18T01:45:09-08:00",value:876},{date:"2015-09-03T21:49:18-07:00",value:954},{date:"2015-12-09T05:30:51-08:00",value:917},{date:"2015-09-17T21:32:37-07:00",value:936},{date:"2016-01-10T01:26:30-08:00",value:975},{date:"2016-01-19T13:19:41-08:00",value:941},{date:"2015-08-18T13:18:59-07:00",value:899},{date:"2015-09-05T01:57:19-07:00",value:970},{date:"2015-10-25T12:40:26-07:00",value:940},{date:"2015-10-19T21:07:51-07:00",value:930},{date:"2015-09-18T16:25:40-07:00",value:934},{date:"2015-11-02T14:27:22-08:00",value:939},{date:"2016-01-25T15:27:19-08:00",value:966},{date:"2015-11-10T18:51:27-08:00",value:959},{date:"2015-10-05T15:54:11-07:00",value:958},{date:"2015-09-03T13:30:52-07:00",value:915},{date:"2015-11-04T12:41:09-08:00",value:931},{date:"2015-11-22T18:21:07-08:00",value:893},{date:"2015-10-29T21:03:31-07:00",value:965},{date:"2015-10-12T03:03:39-07:00",value:911},{date:"2015-10-03T04:54:02-07:00",value:939},{date:"2015-09-13T13:04:33-07:00",value:899},{date:"2015-12-17T11:55:22-08:00",value:953},{date:"2015-10-12T01:02:22-07:00",value:971},{date:"2015-08-24T08:41:47-07:00",value:969},{date:"2015-08-18T08:41:51-07:00",value:889},{date:"2015-11-29T11:29:20-08:00",value:894},{date:"2015-09-07T04:24:53-07:00",value:891},{date:"2015-09-08T23:51:21-07:00",value:881},{date:"2016-01-17T15:11:15-08:00",value:934},{date:"2016-01-18T08:22:15-08:00",value:895},{date:"2015-08-21T00:25:30-07:00",value:940},{date:"2015-08-25T19:18:16-07:00",value:927},{date:"2016-01-06T04:31:17-08:00",value:879},{date:"2015-09-30T10:29:10-07:00",value:883},{date:"2015-11-07T02:52:56-08:00",value:922},{date:"2015-10-18T06:18:46-07:00",value:955},{date:"2015-09-02T15:32:28-07:00",value:906},{date:"2015-08-31T04:57:02-07:00",value:923},{date:"2016-01-13T20:58:01-08:00",value:899},{date:"2015-09-15T06:04:20-07:00",value:878},{date:"2015-11-20T04:04:00-08:00",value:915},{date:"2015-09-13T19:42:00-07:00",value:884},{date:"2015-12-24T13:33:10-08:00",value:941},{date:"2016-01-18T14:03:14-08:00",value:945},{date:"2015-11-07T15:26:28-08:00",value:915},{date:"2015-09-01T10:04:27-07:00",value:878},{date:"2015-12-06T12:48:00-08:00",value:909},{date:"2015-09-18T21:11:33-07:00",value:881},{date:"2016-01-01T13:22:01-08:00",value:876},{date:"2015-08-23T10:14:39-07:00",value:968},{date:"2015-12-22T16:06:35-08:00",value:884},{date:"2016-01-05T10:25:16-08:00",value:969},{date:"2015-12-27T21:50:04-08:00",value:930},{date:"2015-12-07T03:26:00-08:00",value:933},{date:"2015-08-19T12:57:13-07:00",value:887},{date:"2015-11-07T06:52:09-08:00",value:901},{date:"2015-09-26T21:04:43-07:00",value:920},{date:"2015-10-07T04:27:02-07:00",value:927},{date:"2015-12-18T23:14:27-08:00",value:895},{date:"2015-11-02T19:20:38-08:00",value:933},{date:"2015-12-02T12:25:35-08:00",value:905},{date:"2015-12-29T05:33:28-08:00",value:951},{date:"2015-09-11T15:19:26-07:00",value:881},{date:"2016-01-17T10:31:57-08:00",value:927},{date:"2016-01-08T04:48:25-08:00",value:920},{date:"2016-01-18T18:35:47-08:00",value:909},{date:"2015-09-08T13:15:15-07:00",value:880},{date:"2015-11-15T15:29:35-08:00",value:913},{date:"2016-01-11T09:58:36-08:00",value:962},{date:"2015-09-03T07:21:11-07:00",value:922},{date:"2015-11-05T22:58:34-08:00",value:878},{date:"2015-12-13T05:29:27-08:00",value:909},{date:"2015-12-09T12:10:40-08:00",value:939},{date:"2015-11-15T07:29:04-08:00",value:946},{date:"2015-11-24T18:23:02-08:00",value:897},{date:"2015-12-03T05:12:38-08:00",value:973},{date:"2015-10-19T05:22:27-07:00",value:892},{date:"2015-09-11T11:56:14-07:00",value:911},{date:"2015-09-09T01:31:18-07:00",value:927},{date:"2016-01-18T00:58:04-08:00",value:927},{date:"2015-08-22T21:34:26-07:00",value:920},{date:"2015-12-22T08:21:49-08:00",value:945}]}],c(),n(),d(),r(".calendar--year",2016,g,v,p),o(7),s("#calendar--year","#arrow--prev","#arrow--next"),t("#grid--container","arcs"),e(C),u(y)})},window.PageAssetDetail=function(){$(document).ready(function(){function e(){$(".has-subnav").on("click",function(){$(this).hasClass("subnav-opened")?$(".has-subnav").removeClass("subnav-opened"):($(".has-subnav").removeClass("subnav-opened"),$(this).addClass("subnav-opened"))})}function t(){$(".has-comments").on("click",function(){$(this).hasClass("comments-opened")?$(".has-comments").removeClass("comments-opened"):($(".has-comments").removeClass("comments-opened"),$(this).addClass("comments-opened"))})}e(),t(),$(".content--table").on("click",".display-tooltip, .icon--close",function(e){e.preventDefault(),$(this).closest("td").find(".display-tooltip").toggleClass("status--active"),$("#modal--target").toggleClass("hidden")}),$(".content--table").on("click",".tooltip, .icon--close",function(e){e.stopPropagation()}),$("#modal--target").on("click",function(e){e.preventDefault(),$("#modal--target").toggleClass("hidden"),$(".display-tooltip.status--active").toggleClass("status--active")}),$(".select--styled").on("click",function(e){$(this).toggleClass("active")})})},window.PageSchedules=function(){var e=154;$(document).ready(function(){function t(e,t,a){var l={isOverflowing:!1,overflow:{top:null,right:null,bottom:null,left:null}};return e.left-a<t.left&&(l.isOverflowing=!0,l.overflow.left=t.left-e.left),t.top>e.top+a&&(l.isOverflowing=!0,l.overflow.top=e.top-t.top),t.right<e.left+e.width-a&&(l.isOverflowing=!0,l.overflow.right=t.right-e.left),t.bottom<e.top+e.height-a&&(l.isOverflowing=!0,l.overflow.bottom=t.bottom-(e.top+e.height)),l}function a(){$("body").on("click",".display-calendar",function(e){$(".calendar--container").toggleClass("active")})}function l(){$(".has-subnav").on("click",function(){$(this).hasClass("subnav-opened")?$(".has-subnav").removeClass("subnav-opened"):($(".has-subnav").removeClass("subnav-opened"),$(this).addClass("subnav-opened"))})}function o(){$(".has-comments").on("click",function(){$(this).hasClass("comments-opened")?$(".has-comments").removeClass("comments-opened"):($(".has-comments").removeClass("comments-opened"),$(this).addClass("comments-opened"))})}function s(){var e=(document.getElementsByClassName("clickable-row"),document.getElementsByClassName("has-hover"));if(e)for(var t=0,a=e.length;t<a;t++){e[t];document.addEventListener("click",function(e){e.target&&"TR"===e.target.nodeName?window.document.location=e.target.getAttribute("data-href"):e.target&&"TD"===e.target.nodeName&&(window.document.location=e.target.parentElement.getAttribute("data-href"))},!0)}}function n(e){i(".calendar--year",e*-256),h=e,g=e*-256}function i(e,t){$(e).css({transform:"translate("+t+"px, 0)","-webkit-transform":"translate("+t+"px, 0)","-moz-transform":"translate("+t+"px, 0)"})}function r(e,t,a,l,o){var s,n,i,r,c,d,u,g,v,p,b;for(v="",p="",c=a,b=l,s=0,i=o.length;s<i;s+=1){for(g=o[s],d=(c-1+g.days)%7,u=0===d?6:7-d-1,v+="<li>",v+='<h2 class="calendar--month article--title">'+g.month+" "+t+"</h2>",v+='<ol class="calendar--week"><li>Sun</li><li>Mon</li><li>Tue</li><li>Wed</li><li>Thu</li><li>Fri</li><li>Sat</li></ol>',v+='<ol id="calendar--days" class="calendar--days">',n=c,r=0;n>r;n-=1)p+='<li class="day day--opaque">',p+='<a href="#," class="day--link">',p+=b-(b+n)%(b+1),p+="</a>",p+="</li>";for(n=0,r=g.days;n<r;n+=1)p+='<li class="day">',p+='<a href="#," class="day--link">',p+=n+1,p+="</a>",p+="</li>";for(n=0,r=u;n<r;n+=1)p+='<li class="day day--opaque">',p+='<a href="#," class="day--link">',p+=n+1,p+="</a>",p+="</li>";c=(d+1)%7,console.log("start index end loop: "+c),v+=p,b=g.days,p="",v+="</ol>",v+="</li>"}$(e).each(function(){var e,t,a,l,o,s,n=$(this);n.append(v),n.parent().hasClass("date-picker")&&(s=n.children().get(7),console.log(s),$(s).find(".day:not(:nth-child(n+7):nth-child(-n+15))").addClass("day--opaque"),n.on("click",".day:not(.day--opaque) .day--link",function(s){e=$(this).text(),console.log(e.toString),l=1===e.toString().length?"0":"",t=h+1,a=2016,o=1===t.toString().length?"0":"",$("#schedule--date-from").val(l+e+"/"+o+t+"/"+a)}))})}var c,d,u,h,g,v;g=0,v=0,d=31,c=5,u=[{month:"January",days:31},{month:"February",days:29},{month:"March",days:31},{month:"April",days:30},{month:"May",days:31},{month:"June",days:30},{month:"July",days:31},{month:"August",days:31},{month:"September",days:30},{month:"October",days:31},{month:"November",days:30},{month:"December",days:31}];var p=($(".content--table-container th").length-1)*e,b=$(".content--table-container.table--schedule").width()-e,f=p-b,m=$(".content--table-container.table--schedule").scrollLeft();0===m&&$("#arrow--prev").hide(),console.log("total width container:"+p),console.log("visible width container:"+b),console.log("max scroll: "+f),l(),o(),s(),r(".calendar--year",2016,c,d,u),n(7),a(),$(".content--table").on("click",".display-tooltip, .icon--close",function(e){if(e.preventDefault(),$("#modal--target").hasClass("hidden")){console.log(e);var a=600,l=$(".tooltip").outerHeight();console.log(e.target.getBoundingClientRect().left);var o={left:e.target.getBoundingClientRect().left,top:e.target.getBoundingClientRect().top,right:e.target.getBoundingClientRect().right,bottom:e.target.getBoundingClientRect().bottom,width:a,height:l,clickedElementWidth:e.target.getBoundingClientRect().width,clickedElementHeight:e.target.getBoundingClientRect().height},s=e.delegateTarget.getBoundingClientRect(),n=20,i={left:41,right:41,top:15,bottom:15};console.log(o),console.log(s);var r=t(o,s,n);console.log(r),r.isOverflowing?(r.overflow.bottom&&$(".tooltip").css({marginTop:-l-o.clickedElementHeight-2*i.bottom+"px"}),r.overflow.left&&(v=-i.left,$(".tooltip").css({marginLeft:v+"px"})),r.overflow.right&&(v=-a+i.right+n+24,$(".tooltip").css({marginLeft:v+"px"})),r.overflow.right&&r.overflow.bottom&&$(".tooltip").addClass("tooltip--bottom-right")):($(".tooltip").addClass("tooltip--top-left"),v=-41,$(".tooltip").css({marginTop:"15px",marginLeft:v-m+"px"}))}$(this).closest("td").find(".display-tooltip").toggleClass("status--active"),$("#modal--target").toggleClass("hidden")}),$(".content--table").on("click",".display-tooltip",function(e){e.stopPropagation()}),$(".content--table").on("click",".tooltip, .icon--close",function(e){e.stopPropagation()}),$("#modal--target").on("click",function(e){e.preventDefault(),$("#modal--target").toggleClass("hidden"),$(".display-tooltip.status--active").toggleClass("status--active")}),$("#arrow--prev").on("click",function(t){m>=e&&($(".content--table-container.table--schedule").animate({scrollLeft:m-e},100),m-=e,0===m&&$("#arrow--prev").hide())}),$("#arrow--next").on("click",function(t){m<f&&($(".content--table-container.table--schedule").animate({scrollLeft:m+e},100),m+=e,m>0&&$("#arrow--prev").show())})})},window.PageCatalogue=function(){$(document).ready(function(){function e(e,t,a){var l={isOverflowing:!1,overflow:{top:null,right:null,bottom:null,left:null}};return e.left-a<t.left&&(l.isOverflowing=!0,l.overflow.left=t.left-e.left),t.top>e.top+a&&(l.isOverflowing=!0,l.overflow.top=e.top-t.top),t.right<e.left+e.width-a&&(l.isOverflowing=!0,l.overflow.right=t.right-e.left),t.bottom<e.top+e.height-a&&(l.isOverflowing=!0,l.overflow.bottom=t.bottom-(e.top+e.height)),l}function t(e){var t,a,l,o,s,n;if(s=[],e)for(t=0,a=e.length;t<a;t+=1)l=e[t],l&&(n="#chart-"+l.type+"-"+(t+1),console.log(n),"donut"===l.type&&(o=new ChartDonut(n,l.label,l.data,174,174,40)),s.push(o))}function a(e,t){var a=$(window).width()-466-40-20-4-20;$(e).find(".grid--"+t).each(function(){$(this).width(a)}),l(e,".switches",a+20)}function l(e,t,a){var l,o,s;s=$(t).find("a").filter(function(e){return $(this).hasClass("switch-grid")}),console.log(s),$(t).on("click",".switch-grid",function(i){l=s.index($(t).find(".switch-grid.selected")),
console.log("prev element index: "+l),o=s.index($(this)),console.log("clicked element index: "+o),$(this).hasClass("selected")||($(t).find(".switch-grid").removeClass("selected"),$(this).addClass("selected"),c+=(l-o)*a,console.log(c),n(e,c)),console.log(o)})}function o(){$(".has-subnav").on("click",function(){$(this).hasClass("subnav-opened")?$(".has-subnav").removeClass("subnav-opened"):($(".has-subnav").removeClass("subnav-opened"),$(this).addClass("subnav-opened"))})}function s(){$(".has-comments").on("click",function(){$(this).hasClass("comments-opened")?$(".has-comments").removeClass("comments-opened"):($(".has-comments").removeClass("comments-opened"),$(this).addClass("comments-opened"))})}function n(e,t){$(e).css({left:t+"px"})}function i(){var e=(document.getElementsByClassName("clickable-row"),document.getElementsByClassName("has-hover"));if(e)for(var t=0,a=e.length;t<a;t++){e[t];document.addEventListener("click",function(e){e.target&&"TR"===e.target.nodeName?window.document.location=e.target.getAttribute("data-href"):e.target&&"TD"===e.target.nodeName&&(window.document.location=e.target.parentElement.getAttribute("data-href"))},!0)}}var r,c;c=0,r=[{type:"donut",data:[{label:"Received",colorClass:"donut--dark-blue",value:750},{label:"Processing",colorClass:"donut--medium-blue",value:358},{label:"Missing",colorClass:"donut--red",value:15},{label:"Rejected",colorClass:"donut--red",value:2},{label:"Processed",colorClass:"donut--light-blue",value:275}]},{type:"donut",label:"Tb",data:[{label:"Received",colorClass:"donut--dark-blue",value:48.8},{label:"Processing",colorClass:"donut--medium-blue",value:14.2}]}],o(),s(),a("#grid--container","table"),t(r),i(),$(".content--table").on("click",".display-tooltip, .icon--close",function(t){if(t.preventDefault(),$("#modal--target").hasClass("hidden")){console.log(t);var a=600,l=$(".tooltip").outerHeight();console.log(t.target.getBoundingClientRect().left);var o={left:t.target.getBoundingClientRect().left,top:t.target.getBoundingClientRect().top,right:t.target.getBoundingClientRect().right,bottom:t.target.getBoundingClientRect().bottom,width:a,height:l,clickedElementWidth:t.target.getBoundingClientRect().width,clickedElementHeight:t.target.getBoundingClientRect().height},s=t.delegateTarget.getBoundingClientRect(),n=20,i={left:41,right:41,top:15,bottom:15};console.log(o),console.log(s);var r=e(o,s,n);console.log(r),r.isOverflowing?(r.overflow.bottom&&$(".tooltip").css({marginTop:-l-o.clickedElementHeight-2*i.bottom+"px"}),r.overflow.left&&$(".tooltip").css({marginLeft:-i.left+"px"}),r.overflow.right&&$(".tooltip").css({marginLeft:-a+i.right+n+24+"px"}),r.overflow.right&&r.overflow.bottom&&$(".tooltip").addClass("tooltip--bottom-right")):($(".tooltip").addClass("tooltip--top-left"),$(".tooltip").css({marginTop:"15px",marginLeft:"-41px"}))}$(this).closest("td").find(".display-tooltip").toggleClass("status--active"),$("#modal--target").toggleClass("hidden")}),$(".content--table").on("click",".tooltip, .icon--close",function(e){e.stopPropagation()}),$("#modal--target").on("click",function(e){e.preventDefault(),$("#modal--target").toggleClass("hidden"),$(".display-tooltip.status--active").toggleClass("status--active")}),$(".select--styled").on("click",function(e){$(this).toggleClass("active")})})},Chart.prototype={init:function(){this.svg=this.svg.insert("svg",":first-child").attr("width",this.width).attr("height",this.height)}},ChartArc.prototype=Object.create(Chart.prototype),ChartArc.prototype.initArc=function(){var e=this;this.svg=this.svg.attr("class","chart--arc--svg").append("g").attr("transform","translate("+this.width/2+","+this.height/2+")"),this.arc=this.arc.innerRadius(this.radius-this.thickness).cornerRadius(this.cornerRadius).outerRadius(this.radius),this.pie=this.pie.value(function(e){return e.value}).sort(null),this.path=this.svg.selectAll("path").data(this.pie(this.dataset)).enter().append("path").attr("d",this.arc).attr("class",function(t,a){return e.total.value+=t.data.value,t.data.colorClass}),this.total.text=this.svg.append("text").text(function(){var t=e.textLabel?e.textLabel:"";return t}).attr("class","chart--total").attr("dx",4).attr("y",8).append("tspan").attr("class","chart--total--percentage").attr("dx",2).attr("dy",-4).text("%")},ChartArc.prototype.constructor=ChartArc,ChartDonut.prototype=Object.create(Chart.prototype),ChartDonut.prototype.initDonut=function(){var e=this;this.svg=this.svg.attr("class","chart--donut--svg").append("g").attr("transform","translate("+this.width/2+","+this.height/2+")"),this.arc=this.arc.innerRadius(this.radius-this.thickness).outerRadius(this.radius),this.pie=this.pie.value(function(e){return e.value}).sort(null),this.path=this.svg.selectAll("path").data(this.pie(this.dataset)).enter().append("path").attr("d",this.arc).attr("class",function(t,a){return e.total.value+=t.data.value,t.data.colorClass}),this.total.text=this.svg.append("text").text(function(){var t=e.textLabel?e.textLabel:"";return e.total.value+t}).attr("class","chart--total").attr("y",10)},ChartDonut.prototype.constructor=ChartDonut,ChartGraph.prototype=Object.create(Chart.prototype),ChartGraph.prototype.initGraph=function(){var e,t,a,l;e=this,l=function(e,t){return new Date(e.date)-new Date(t.date)},t=d3.timeParse("%Y-%m-%dT%H:%M:%S%Z"),a=d3.timeFormat("%d %b"),this.svg=this.svg.attr("class","chart--graph--svg").attr("width",this.width).attr("height",this.height+2*this.margin.bottom).append("g").attr("transform","translate(0,0)"),this.dataset=this.dataset.sort(l),console.log(this.dataset),this.domain.x.scale=d3.scaleTime().range([0,this.width-this.margin.left]).domain(d3.extent(this.dataset,function(e){return t(e.date)})),this.domain.y.scale=d3.scaleLinear().range([this.height,this.margin.top]).domain(d3.extent(this.dataset,function(e){return e.value/10})),console.log(this.domain.x.scale.domain()),this.line=this.line.curve(d3.curveBasisOpen).x(function(a,l){return e.domain.x.scale(t(a.date))}).y(function(t,a){return e.domain.y.scale(t.value/10)}),this.domain.x.axis=this.svg.append("g").attr("class","axis--x").attr("transform","translate(0,"+this.height+")").call(d3.axisBottom(this.domain.x.scale).tickFormat(a).ticks(8).tickSizeInner(-this.height).tickSizeOuter(0).tickPadding(10)),this.domain.y.axis=this.svg.append("g").attr("class","axis--y").attr("transform","translate(0, 0)").call(d3.axisLeft(this.domain.y.scale).ticks(5).tickSizeInner(-this.width).tickSizeOuter(0).tickPadding(0)),this.path=this.svg.append("g").append("path").datum(this.dataset).attr("class","graph--line").attr("d",this.line).attr("transform","translate("+(this.margin.left+5)+",0)"),this.svg.append("text").attr("class","graph--label-x").attr("x",this.margin.left-4).attr("y",this.margin.top+5).text(this.domain.x.label),this.svg.append("text").attr("class","graph--label-y").attr("x",this.width/2).attr("y",this.height+this.margin.bottom+10).text(this.domain.y.label),this.svg.append("text").attr("x",this.width/2).attr("y",this.margin.bottom).attr("class","graph--title").text(this.textLabel)},ChartGraph.prototype.constructor=ChartGraph;