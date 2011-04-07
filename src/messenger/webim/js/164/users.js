/*
 This file is part of Mibew Messenger project.
 http://mibew.org

 Copyright (c) 2005-2011 Mibew Messenger Community
 License: http://mibew.org/license.php
*/
Ajax.PeriodicalUpdater=Class.create();
Class.inherit(Ajax.PeriodicalUpdater,Ajax.Base,{initialize:function(a){this.setOptions(a);this._options.onComplete=this.requestComplete.bind(this);this._options.onException=this.handleException.bind(this);this._options.onTimeout=this.handleTimeout.bind(this);this._options.timeout=5E3;this.frequency=this._options.frequency||2;this.updater={};this.update()},handleException:function(){this._options.handleError&&this._options.handleError("offline, reconnecting");this.stopUpdate();this.timer=setTimeout(this.update.bind(this),
1E3)},handleTimeout:function(){this._options.handleError&&this._options.handleError("timeout, reconnecting");this.stopUpdate();this.timer=setTimeout(this.update.bind(this),1E3)},stopUpdate:function(){if(this.updater._options)this.updater._options.onComplete=void 0;clearTimeout(this.timer)},update:function(){if(this._options.updateParams)this._options.parameters=this._options.updateParams();this.updater=new Ajax.Request(this._options.url,this._options)},requestComplete:function(a){try{var b=Ajax.getXml(a);
b?(this._options.updateContent||Ajax.emptyFunction)(b):this._options.handleError&&this._options.handleError("reconnecting")}catch(c){}this.timer=setTimeout(this.update.bind(this),this.frequency*1E3)}});
var HtmlGenerationUtils={popupLink:function(a,b,c,d,f,g,j){return'<a href="'+a+'"'+(j!=null?' class="'+j+'"':"")+' target="_blank" title="'+b+'" onclick="this.newWindow = window.open(\''+a+"', '"+c+"', 'toolbar=0,scrollbars=0,location=0,status=1,menubar=0,width="+f+",height="+g+",resizable=1');this.newWindow.focus();this.newWindow.opener=window;return false;\">"+d+"</a>"},generateOneRowTable:function(a){return'<table class="inner"><tr>'+a+"</tr></table>"},viewOpenCell:function(a,b,c,d,f,g,j,n,m,o){var g=
2,b=b+"?thread="+c,e="<td>";e+=f||d?HtmlGenerationUtils.popupLink(n||!d?b:b+"&viewonly=true",localized[f?0:1],"ImCenter"+c,a,640,480,null):'<a href="#">'+a+"</a>";e+="</td>";f&&(e+='<td class="icon">',e+=HtmlGenerationUtils.popupLink(b,localized[0],"ImCenter"+c,'<img src="'+webimRoot+'/images/tbliclspeak.gif" width="15" height="15" border="0" alt="'+localized[0]+'">',640,480,null),e+="</td>",g++);d&&(e+='<td class="icon">',e+=HtmlGenerationUtils.popupLink(b+"&viewonly=true",localized[1],"ImCenter"+
c,'<img src="'+webimRoot+'/images/tbliclread.gif" width="15" height="15" border="0" alt="'+localized[1]+'">',640,480,null),e+="</td>",g++);m&&(e+='<td class="icon">',e+=HtmlGenerationUtils.popupLink(o+"?thread="+c,localized[6],"ImTracked"+c,'<img src="'+webimRoot+'/images/tblictrack.gif" width="15" height="15" border="0" alt="'+localized[6]+'">',640,480,null),e+="</td>",g++);j!=""&&(e+='</tr><tr><td class="firstmessage" colspan="'+g+'"><a href="javascript:void(0)" title="'+j+'" onclick="alert(this.title);return false;">',
e+=j.length>30?j.substring(0,30)+"...":j,e+="</a></td>");return HtmlGenerationUtils.generateOneRowTable(e)},banCell:function(a,b){return'<td class="icon">'+HtmlGenerationUtils.popupLink(webimRoot+"/operator/ban.php?"+(b?"id="+b:"thread="+a),localized[2],"ban"+a,'<img src="'+webimRoot+'/images/ban.gif" width="15" height="15" border="0" alt="'+localized[2]+'">',720,480,null)+"</td>"},viewVisOpenCell:function(a,b,c,d,f){var g="<td>";g+=f?HtmlGenerationUtils.popupLink(b+"?visitor="+c,localized[7],"ImCenter"+
c,a,640,480,null):'<a href="#">'+a+"</a>";g+="</td>";g+='<td class="icon">';a=HtmlGenerationUtils.popupLink(d+"?visitor="+c,localized[6],"ImTracked"+c,'<img src="'+webimRoot+'/images/tblictrack.gif" width="15" height="15" border="0" alt="'+localized[6]+'">',640,480,null);a=a.replace("scrollbars=0","scrollbars=1");g+=a;g+="</td>";return HtmlGenerationUtils.generateOneRowTable(g)}};Ajax.ThreadListUpdater=Class.create();
Class.inherit(Ajax.ThreadListUpdater,Ajax.Base,{initialize:function(a){this.setOptions(a);this._options.updateParams=this.updateParams.bind(this);this._options.handleError=this.handleError.bind(this);this._options.updateContent=this.updateContent.bind(this);this._options.lastrevision=0;this.threadTimers={};this.delta=0;this.t=this._options.table;this.t2=this._options.visitors_table;this.periodicalUpdater=new Ajax.PeriodicalUpdater(this._options);this.old_visitors={};this.visitors={};this.visitorTimers=
{}},updateParams:function(){return"since="+this._options.lastrevision+"&status="+this._options.istatus+(this._options.showonline?"&showonline=1":"")+(this._options.showvisitors?"&showvisitors=1":"")},setStatus:function(a){this._options.status.innerHTML=a},handleError:function(a){this.setStatus(a)},updateThread:function(a){function b(a,b,c,d){if(a=CommonUtils.getCell(c,b,a))a.innerHTML=d}for(var c,d,f,g=!1,j=!1,n=!1,m=null,o=null,e=0;e<a.attributes.length;e++){var l=a.attributes[e];if(l.nodeName==
"id")c=l.nodeValue;else if(l.nodeName=="stateid")d=l.nodeValue;else if(l.nodeName=="state")f=l.nodeValue;else if(l.nodeName=="canopen")j=!0;else if(l.nodeName=="canview")g=!0;else if(l.nodeName=="canban")n=!0;else if(l.nodeName=="ban")m=l.nodeValue;else if(l.nodeName=="banid")o=l.nodeValue}e=CommonUtils.getRow("thr"+c,this.t);if(d=="closed")e&&this.t.deleteRow(e.rowIndex),this.threadTimers[c]=null;else{var l=NodeUtils.getNodeValue(a,"name"),q=NodeUtils.getNodeValue(a,"addr"),p=NodeUtils.getNodeValue(a,
"time"),t=NodeUtils.getNodeValue(a,"agent"),s=NodeUtils.getNodeValue(a,"modified"),u=NodeUtils.getNodeValue(a,"message"),r="<td>"+NodeUtils.getNodeValue(a,"useragent")+"</td>";m!=null&&(r="<td>"+NodeUtils.getNodeValue(a,"reason")+"</td>");n&&(r+=HtmlGenerationUtils.banCell(c,o));r=HtmlGenerationUtils.generateOneRowTable(r);a=CommonUtils.getRow("t"+d,this.t);n=CommonUtils.getRow("t"+d+"end",this.t);if(e!=null&&(e.rowIndex<=a.rowIndex||e.rowIndex>=n.rowIndex))this.t.deleteRow(e.rowIndex),e=this.threadTimers[c]=
null;if(e==null){if(e=this.t.insertRow(a.rowIndex+1),e.className=m=="blocked"&&d!="chat"?"ban":"in"+d,e.id="thr"+c,this.threadTimers[c]=[p,s,d],CommonUtils.insertCell(e,"name","visitor",null,null,HtmlGenerationUtils.viewOpenCell(l,this._options.agentservl,c,g,j,m,u,d!="chat",this._options.showvisitors,this._options.trackedservl)),CommonUtils.insertCell(e,"contid","visitor","center",null,q),CommonUtils.insertCell(e,"state","visitor","center",null,f),CommonUtils.insertCell(e,"op","visitor","center",
null,t),CommonUtils.insertCell(e,"time","visitor","center",null,this.getTimeSince(p)),CommonUtils.insertCell(e,"wait","visitor","center",null,d!="chat"?this.getTimeSince(s):"-"),CommonUtils.insertCell(e,"etc","visitor","center",null,r),d=="wait"||d=="prio")return!0}else this.threadTimers[c]=[p,s,d],e.className=m=="blocked"&&d!="chat"?"ban":"in"+d,b(this.t,e,"name",HtmlGenerationUtils.viewOpenCell(l,this._options.agentservl,c,g,j,m,u,d!="chat",this._options.showvisitors,this._options.trackedservl)),
b(this.t,e,"contid",q),b(this.t,e,"state",f),b(this.t,e,"op",t),b(this.t,e,"time",this.getTimeSince(p)),b(this.t,e,"wait",d!="chat"?this.getTimeSince(s):"-"),b(this.t,e,"etc",r);return!1}},updateQueueMessages:function(){function a(a,b){var c=$(b),j=$(b+"end");if(c==null||j==null)return!1;return c.rowIndex+1<j.rowIndex}var b=$("statustd");if(b){var c=a(this.t,"twait")||a(this.t,"tprio")||a(this.t,"tchat");b.innerHTML=c?"":this._options.noclients;b.height=c?5:30}},getTimeSince:function(a){var a=Math.floor(((new Date).getTime()-
a-this.delta)/1E3),b=Math.floor(a/60),c="";a%=60;a<10&&(a="0"+a);b>=60&&(c=Math.floor(b/60),b%=60,b<10&&(b="0"+b),c+=":");return c+b+":"+a},updateTimers:function(){for(var a in this.threadTimers)if(this.threadTimers[a]!=null){var b=this.threadTimers[a],c=CommonUtils.getRow("thr"+a,this.t);if(c!=null){var d=function(a,b,c,d){if(a=CommonUtils.getCell(c,b,a))a.innerHTML=d};d(this.t,c,"time",this.getTimeSince(b[0]));d(this.t,c,"wait",b[2]!="chat"?this.getTimeSince(b[1]):"-")}}},updateThreads:function(a){var b=
!1,c=NodeUtils.getAttrValue(a,"time"),d=NodeUtils.getAttrValue(a,"revision");if(c)this.delta=(new Date).getTime()-c;if(d)this._options.lastrevision=d;for(c=0;c<a.childNodes.length;c++)d=a.childNodes[c],d.tagName=="thread"&&this.updateThread(d)&&(b=!0);this.updateQueueMessages();this.updateTimers();this.setStatus(this._options.istatus?"Away":"Up to date");b&&(playSound(webimRoot+"/sounds/new_user.wav"),window.focus(),updaterOptions.showpopup&&alert(localized[5]))},updateOperators:function(a){var b=
$("onlineoperators");if(b){for(var c=[],d=0;d<a.childNodes.length;d++){var f=a.childNodes[d];if(f.tagName=="operator"){var g=NodeUtils.getAttrValue(f,"name"),f=NodeUtils.getAttrValue(f,"away")!=null;c[c.length]='<img src="'+webimRoot+"/images/op"+(f?"away":"online")+'.gif" width="12" height="12" border="0" alt="'+localized[1]+'"> '+g}}b.innerHTML=c.join(", ")}},updateVisitorsTimers:function(){for(var a in this.visitorTimers)if(this.visitorTimers[a]!=null){var b=this.visitorTimers[a],c=CommonUtils.getRow("vis"+
a,this.t2);if(c!=null){var d=function(a,b,c,d){if(a=CommonUtils.getCell(c,b,a))a.innerHTML=d};d(this.t2,c,"time",this.getTimeSince(b[0]));d(this.t2,c,"modified",this.getTimeSince(b[1]));b[2]!=null&&d(this.t2,c,"invitationtime",this.getTimeSince(b[2]))}}},updateVisitor:function(a){function b(a,b,c,d){if(a=CommonUtils.getCell(c,b,a))a.innerHTML=d}for(var c,d=0;d<a.attributes.length;d++){var f=a.attributes[d];if(f.nodeName=="id")c=f.nodeValue}for(var f=NodeUtils.getNodeValue(a,"addr"),g=NodeUtils.getNodeValue(a,
"username"),j=NodeUtils.getNodeValue(a,"useragent"),n=NodeUtils.getNodeValue(a,"time"),m=NodeUtils.getNodeValue(a,"modified"),o=NodeUtils.getNodeValue(a,"invitations"),e=NodeUtils.getNodeValue(a,"chats"),l=null,q=null,a=a.getElementsByTagName("invitation")[0],d=0;d<a.childNodes.length;d++){var p=a.childNodes[d];if(p.tagName=="operator")l=p.firstChild.nodeValue;else if(p.tagName=="invitationtime")q=p.firstChild.nodeValue}p=l==null?"free":"invited";d=CommonUtils.getRow("vis"+c,this.t2);a=CommonUtils.getRow("vis"+
p,this.t2);p=CommonUtils.getRow("vis"+p+"end",this.t2);if(d!=null&&(d.rowIndex<=a.rowIndex||d.rowIndex>=p.rowIndex))this.t2.deleteRow(d.rowIndex),d=this.visitorTimers[c]=null;d==null?(d=this.t2.insertRow(a.rowIndex+1),d.id="vis"+c,this.visitorTimers[c]=[n,m,q],CommonUtils.insertCell(d,"username","visitor",null,null,HtmlGenerationUtils.viewVisOpenCell(g,this._options.inviteservl,c,this._options.trackedservl,l==null)),CommonUtils.insertCell(d,"addr","visitor","center",null,f),CommonUtils.insertCell(d,
"time","visitor","center",null,this.getTimeSince(n)),CommonUtils.insertCell(d,"modified","visitor","center",null,this.getTimeSince(m)),CommonUtils.insertCell(d,"operator","visitor","center",null,l!=null?l:"-"),CommonUtils.insertCell(d,"invitationtime","visitor","center",null,l!=null?this.getTimeSince(q):"-"),CommonUtils.insertCell(d,"invitations","visitor","center",null,o+" / "+e),CommonUtils.insertCell(d,"useragent","visitor","center",null,j)):(this.visitorTimers[c]=[n,m,q],b(this.t2,d,"username",
HtmlGenerationUtils.viewVisOpenCell(g,this._options.inviteservl,c,this._options.trackedservl,l==null)),b(this.t2,d,"addr",f),b(this.t2,d,"operator",l!=null?l:"-"),b(this.t2,d,"time",this.getTimeSince(n)),b(this.t2,d,"modified",this.getTimeSince(m)),b(this.t2,d,"invitationtime",l!=null?this.getTimeSince(q):"-"),b(this.t2,d,"invitations",o+" / "+e),b(this.t2,d,"useragent",j));this.visitors[c]=1;return!1},removeOldVisitors:function(){for(id in this.old_visitors)if(this.visitors[id]===void 0){var a=CommonUtils.getRow("vis"+
id,this.t2);a&&this.t2.deleteRow(a.rowIndex);this.visitorTimers[id]=null}},updateVisitorsList:function(a){var b=$("visstatustd");if(b)b.innerHTML=a>0?"":this._options.novisitors,b.height=a>0?5:30},updateVisitors:function(a){this.old_visitors=this.visitors;this.visitors={};for(var b=0,c=0;c<a.childNodes.length;c++){var d=a.childNodes[c];d.tagName=="visitor"&&(b++,this.updateVisitor(d))}this.updateVisitorsTimers();this.removeOldVisitors();this.updateVisitorsList(b)},updateContent:function(a){if(a.tagName==
"update")for(var b=0;b<a.childNodes.length;b++){var c=a.childNodes[b];c.tagName=="threads"?this.updateThreads(c):c.tagName=="operators"?this.updateOperators(c):c.tagName=="visitors"&&this.updateVisitors(c)}else a.tagName=="error"?this.setStatus(NodeUtils.getNodeValue(a,"descr")):this.setStatus("reconnecting")}});
function togglemenu(){if($("sidebar")&&$("wcontent")&&$("togglemenu"))$("wcontent").className=="contentnomenu"?($("sidebar").style.display="block",$("wcontent").className="contentinner",$("togglemenu").innerHTML=localized[4]):($("sidebar").style.display="none",$("wcontent").className="contentnomenu",$("togglemenu").innerHTML=localized[3])}var webimRoot="";Behaviour.register({"#togglemenu":function(a){a.onclick=function(){togglemenu()}}});
EventHelper.register(window,"onload",function(){webimRoot=updaterOptions.wroot;new Ajax.ThreadListUpdater({table:$("threadlist"),status:$("connstatus"),istatus:0,visitors_table:$("visitorslist")}.extend(updaterOptions||{}));updaterOptions.havemenu||togglemenu()});
