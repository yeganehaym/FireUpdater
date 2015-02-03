var variables=[];
var datevariables=[];
var period_time=60000;
var timer;
google.load("feeds", "1");



$(document).ready(function () {
	 addon.port.on("vars",  function(vars,datevars,interval) {
	 if (vars)
	{
		Variables=vars;
		
	}
	if (datevars)
	{
		datevariables=datevars;
	}
	if(interval)
		period_time=interval*60000;
	if(timer!=null)
	{
		clearInterval(timer);
	}
		
	alarmManager();
});
});

function alarmManager()
{
	timer = setInterval(Run,period_time);
}


function Run() {

		if(Variables[0]){RssReader(Links.postUrl,0, Messages.PostsUpdated);}
		if(Variables[1]){RssReader(Links.posts_commentsUrl,1,Messages.CommentsUpdated); }
		if(Variables[2]){RssReader(Links.sharesUrl,2,Messages.SharesUpdated);}
		if(Variables[3]){RssReader(Links.shares_CommentsUrl,3,Messages.SharesCommentsUpdated);}
}


function RssReader(URL,index,Message) {	
			

            var feed = new google.feeds.Feed(URL);
            feed.setResultFormat(google.feeds.Feed.XML_FORMAT);
                    feed.load(function (result) {
						if(result!=null)
						{
							var strRssUpdate = result.xmlDocument.firstChild.firstChild.childNodes[5].textContent;
							var RssUpdate=new Date(strRssUpdate);
							var lastupdate=new Date(datevariables[index]);
							
							if(RssUpdate>lastupdate)
							{
								datevariables[index]=strRssUpdate;
								addon.port.emit("notification",datevariables,Message);
							}
						
						}
                      });
        }
       
