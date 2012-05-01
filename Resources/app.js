// create tab group
var tabGroup = Ti.UI.createTabGroup({exitOnClose: true});

// create home window
var homeWin = Ti.UI.createWindow({
    backgroundColor: '#fff'
});

// create photo window
var photoWin = Ti.UI.createWindow({
	backgroundColor: '#fff'
});

function loadJSON()
{
    // Empty array "rowData" for our tableview
    var rowData = [];
    // Create our HTTP Client and name it "loader"
    var loader = Ti.Network.createHTTPClient();
    // Sets the HTTP request method, and the URL to get data from
    loader.open("GET","http://ipresentonline.com/services/test_appcelerator_recent_activity");
 
    loader.setTimeout(10000);
 
    loader.onerror = function(e) { 
        alert('error getting data');
    };
 
    // Runs the function when the data is ready for us to process
    loader.onload = function() 
    {
        var testJSON = JSON.parse(this.responseText);
        for (var i = 0; i < testJSON.length; i++)
        {
            var title     = testJSON[i].title;
            var updatedAt = testJSON[i].updated_at;
            
            var theDate = new Date(updatedAt);
            
			var weekdays   = new Array(7);
			weekdays[0]     = "Sun ";
			weekdays[1]     = "Mon ";
			weekdays[2]     = "Tues ";
			weekdays[3]     = "Wed ";
			weekdays[4]     = "Thur ";
			weekdays[5]     = "Fri ";
			weekdays[6]     = "Sat ";
			// Day of the week
			var theWeekday = weekdays[theDate.getDay()];
			
			var months   = new Array();
			months[0]     = "Jan ";
			months[1]     = "Feb ";
			months[2]     = "Mar ";
			months[3]     = "Apr ";
			months[4]     = "May ";
			months[5]     = "Jun ";
			months[6]     = "Jul ";
			months[7]     = "Aug ";
			months[8]     = "Sep ";
			months[9]     = "Oct ";
			months[10]    = "Nov ";
			months[11]    = "Dec ";
			// Month of the year
			var theMonth = months[theDate.getMonth()];
			
			// Day of the month
			var theDay = theDate.getDate();
			
			// Time of day
			var hours = theDate.getHours()
			var minutes = theDate.getMinutes()
			
			var suffix = "am";
			if (hours >= 12) {
				suffix = "pm";
				hours  = hours - 12;
			}
			if (hours == 0) {
				hours = 12;
			}
			if (minutes < 10)
				minutes = "0" + minutes;
			
            // Create a row and set its height to auto
            var row = Ti.UI.createTableViewRow({
                height:'auto',
                backgroundColor: 'transparent'
            });
 
            // The Label with the JSON information
            var theLabel = Ti.UI.createLabel({
                text:      title + " updated: "
                           + theWeekday + theMonth + theDay
                           + " @ " + hours + ":" + minutes + suffix,
                color:     '#576996',
                font:      {fontSize:16,fontWeight:'bold', fontFamily:'Arial'},
                textAlign: 'left'
            });
 
            // Add the post view to the row
            row.add(theLabel);
            // Give each row a class name
            row.className = "item"+i;
            // Add row to the rowData array
            rowData[i] = row;
        }
        
        // Create the table view and set its data source to "rowData" array
        var tableView = Ti.UI.createTableView({
        	headerTitle: 'Recent Activity',
        	data:        rowData
        });
 
        //Add the table view to the window
        homeWin.add(tableView);
    };
    // Send the HTTP request
    loader.send();
}
loadJSON();

if (Ti.Platform.osname == 'android'){
	var tabHome = Ti.UI.createTab({
	    icon:   'KS_nav_views.png',
	    title:  'Home',
	    window: homeWin
	});
	var tabUpcoming = Titanium.UI.createTab({
	    icon:   'KS_nav_ui.png',
	    title:  'Upcoming',
	    window: homeWin
	});
	var tabCourses = Ti.UI.createTab({
		icon:   'KS_nav_ui.png',
		title:  'Courses',
		window: homeWin
	});
	var tabSettings = Ti.UI.createTab({
		icon:   'KS_nav_ui.png',
		title:  'Settings',
		window: homeWin
	});
	var tabPhoto = Ti.UI.createTab({
		icon:   'KS_nav_ui.png',
		title:  'Photo',
		window: photoWin
	});
	// Handle camera event
	tabPhoto.addEventListener('focus', function() {
		Ti.Media.showCamera({
			success:function(event){
				// Store image as variable
				var image = event.media;
				
				// Send image
				var client = Ti.Network.createHTTPClient();
				client.open('POST','http://ipresentonline.com/services/test_appcelerator_file_upload');
				client.send({media: image.read()});
				client.onload = function() {
		            alert(this.responseText); 
		        };
            },
            cancel:function(){
            	
            },
            error:function(error){
                // create alert
                var a = Ti.UI.createAlertDialog({title:'Camera'});
 
                // set message
                if (error.code == Ti.Media.NO_CAMERA){
                    a.setMessage('Device does not have camera capabilities');
                }
                else{
                    a.setMessage('Unexpected error: ' + error.code);
                }
 
                // show alert
                a.show();
            },
            saveToPhotoGallery:false,
            allowImageEditing:true
		});
	});
	
	//  add tabs
	tabGroup.addTab(tabHome);
	tabGroup.addTab(tabUpcoming);
	tabGroup.addTab(tabCourses);
	tabGroup.addTab(tabSettings);
	tabGroup.addTab(tabPhoto);
}

if (Ti.Platform.osname == 'iphone'){
	var tabHome = Ti.UI.createTab({
	    icon:   Ti.UI.iPhone.SystemIcon.FAVORITES,
	    title:  'Home',
	    window: homeWin
	});
	var tabUpcoming = Titanium.UI.createTab({
	    icon:   Ti.UI.iPhone.SystemIcon.BOOKMARKS,
	    title:  'Upcoming',
	    window: homeWin
	});
	var tabCourses = Ti.UI.createTab({
		icon:   Ti.UI.iPhone.SystemIcon.FEATURED,
		title:  'Courses',
		window: homeWin
	});
	var tabSettings = Ti.UI.createTab({
		icon:   Ti.UI.iPhone.SystemIcon.MORE,
		title:  'Settings',
		window: homeWin
	});
	
	//  add tabs
	tabGroup.addTab(tabHome);
	tabGroup.addTab(tabUpcoming);
	tabGroup.addTab(tabCourses);
	tabGroup.addTab(tabSettings);
}

// open tab group
tabGroup.open();