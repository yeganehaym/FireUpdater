//ali yeganeh.make
//yeganehaym@gmail.com
//fireupdater for dotnettips.info
//the extenstion is for tutorial and we made it on dotnettips.info

// ==================== Include Headers =======================

var tgbutton = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var contextMenu = require("sdk/context-menu");
var ss = require("sdk/simple-storage");
var perf=require("sdk/simple-prefs");
var preferences = perf.prefs;
var pageWorker = require("sdk/page-worker");	
	
	//=============== initialize values =========================
	 if (!ss.storage.Variables)
	 {
		 ss.storage.Variables=[];
		 ss.storage.Variables.push(true);
		 ss.storage.Variables.push(false);
		 ss.storage.Variables.push(false);
		 ss.storage.Variables.push(false);
	 }
	
	if (!ss.storage.interval)
		ss.storage.interval=10;

	 if (!ss.storage.DateVariables) {
		 var now=String(new Date());// 'Tue, 27 Jan 2015 22:05:01 +0330';
		 ss.storage.DateVariables=[];
		 ss.storage.DateVariables.push(now);
		 ss.storage.DateVariables.push(now);
		 ss.storage.DateVariables.push(now);
		 ss.storage.DateVariables.push(now);
	 }

	 //================== make a toggle button for dispaly a panel=========================================
	 
var button =  require('sdk/ui/button/toggle').ToggleButton({
  id: "updaterui",
  label: ".Net Updater",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});

var panel = panels.Panel({
  contentURL: self.data.url("./popup.html"),
 // contentScriptFile: [self.data.url("jquery.min.js"),self.data.url("const.js"),self.data.url("popup.js")],
  onHide: handleHide,

});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
	
	 var v1=[],v2;
	 if (ss.storage.Variables)
		v1=ss.storage.Variables;
	
	if (ss.storage.interval)
		v2=ss.storage.interval;
	
	panel.port.emit("vars",v1,v2);
  }
}

panel.port.on("vars", function (vars,interval) {
	  ss.storage.Variables=vars;
	  ss.storage.interval=interval;
	  SendData();
	  Perf_Default_Value();
});

function handleHide() {
  button.state('window', {checked: false});
}


//=============================== context menu for open website (2 sub menu)  =============================

var home = contextMenu.Item({
  label: "صفحه اصلی",
  data: "http://www.dotnettips.info/"
});
var postsarchive = contextMenu.Item({
  label: "مطالب سایت",
  data: "http://www.dotnettips.info/postsarchive"
});

var menuItem = contextMenu.Menu({
  label: "Open .Net Tips",
  context: contextMenu.PageContext(),
   items: [home, postsarchive],
  image: self.data.url("icon-16.png"),
  contentScript: 'self.on("click", function (node, data) {' +
                 '  self.postMessage(data);' +
                 '});',
				 onMessage: function (data) {
     tabs.open(data);
  }
});

//====================== Content Menu for search ===========================

var Url="http://www.dotnettips.info/search?term=";
var searchMenu = contextMenu.Item({
  label: "search for",
  context: [contextMenu.PredicateContext(checkText),contextMenu.SelectionContext()],
    image: self.data.url("icon-16.png"),
  contentScript: 'self.on("click", function () {' +
  '  var text = window.getSelection().toString();' +
                 '  if (text.length > 20)' +
                 '   text = text.substr(0, 20);' +
                 '  self.postMessage(text);'+
                '})',
		onMessage: function (data) {
     tabs.open(Url+data);
  }
				 
});

function checkText(data) {

       if(data.selectionText === null)
           return false;

       console.log('selectionText: ' + data.selectionText);

       //handle showing or hiding of menu items based on the text content.
       menuItemToggle(data.selectionText);

       return true;
};

function menuItemToggle(text){
	var searchText="جست و جو برای ";
    searchMenu.label=searchText+text;

}

//==================================================== Page worker for background service =============================================================

page= pageWorker.Page({
	contentScriptWhen: "ready",
	contentURL: self.data.url("./background.htm")
});

function SendData(){
	page.port.emit("vars",ss.storage.Variables,ss.storage.DateVariables,ss.storage.interval);
}

SendData();

page.port.on("notification",function(lastupdate,Message){
	ss.storage.DateVariables=lastupdate;
	Make_a_Notification(Message);
})

//============= Creat a Simple Notification ============================

function Make_a_Notification(Message){
	var notifications = require("sdk/notifications");
	notifications.notify({
	  title: "سایت به روز شد",
	  text: Message,
	  iconURL:self.data.url("./icon-64.png"),
	  data:"http://www.dotnettips.info",
	  onClick: function (data) {
		tabs.open(data);
	  }
	});
}

// =============== set Default Value for preferences =====================

function Perf_Default_Value(){

preferences.post = ss.storage.Variables[0];
preferences.postcomments = ss.storage.Variables[1];
preferences.shares = ss.storage.Variables[2];
preferences.sharescomments = ss.storage.Variables[3];
preferences["myinterval"] =parseInt(ss.storage.interval);
}

Perf_Default_Value();

//====== Listen to changes on preferences	==========================

function onPrefChange(prefName) {

  switch(prefName) {
    case "post":
		ss.storage.Variables[0]=preferences[prefName];
		break;
	case "postcomments":
		ss.storage.Variables[1]=preferences[prefName];
		break;
	case "shares":
		ss.storage.Variables[2]=preferences[prefName];
		break;
	case "sharescomments":
		ss.storage.Variables[3]=preferences[prefName];
		break;
	case "myinterval":
		ss.storage.interval=preferences[prefName];
		break;
  }
}


//perf.on("post", onPrefChange);
//perf.on("postcomments", onPrefChange);

perf.on("", onPrefChange);