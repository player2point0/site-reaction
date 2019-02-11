$(function() 
{
	let url;
	let database;
	let ref;
	let data;
	let edited = {
		record: false,
		happy: false,
		sad: false,
		angry: false,
		love: false,
		funny: false	
	}

	main();

	//assign button event listeners
	$("#happy, #sad, #angry, #love, #funny").click(function(d){
		updateRecord(d.currentTarget.getAttribute("id"));
	});
	
	async function main()
	{
	//check if url is in database
	//if it isn't add a new entry

	//increment view count
	//increment emotion counts based on button clicks 

	setupDatabase();
	getTabUrl();
	
	async function getTabUrl()
	{
		chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
			url = tabs[0].url.replace(/\./g, 'dot');
			
			console.log( tabs[0].url.replace(/\./g, 'dot'));
			
			getRecord();
		});	

		if(url == undefined) url = "error";	
	}
	async function setupDatabase()
	{
		// Initialize Firebase
		let config = {
			apiKey: "AIzaSyBZG7yy9p4_6qkT1vv501uIiGwe8kISJ_A",
			authDomain: "site-reaction.firebaseapp.com",
			databaseURL: "https://site-reaction.firebaseio.com",
			projectId: "site-reaction",
			storageBucket: "",
			messagingSenderId: "509152108135"
		};

		firebase.initializeApp(config);

		database = firebase.database();
		ref = database.ref("sites");
	}

	function createRecord()
	{
		data = {
			happy: 0,
			sad: 0,
			angry: 0,
			love: 0,
			funny: 0,
			viewCount: 0
		}
		
		ref.child(url).set(data);
	}

	async function getRecord()
	{
		try
		{
			let promise = await ref.child(url).once("value", gotData);	
		}
		
		catch
		{
			//new site
			createRecord();
			setOpacity();
		}

	}	
	function gotData(Data)
	{
		if(Data.val() == null)
		{
			createRecord();
			return;
		}

		data = Data.val();
		setOpacity();
	}

	function setOpacity()
	{
		for (let property in data) 
		{
				if (data.hasOwnProperty(property) && property != "viewCount"	) 
				{
					let percentage = (data[property] / data.viewCount) + 0.1;//prevents invisible emojis

					$("#"+property).attr("style", "opacity: "+percentage+";");
				}
		}	
	}
	}

	function updateRecord(field)
	{		
		if(!edited.record)
		{
			//increment viewCount
			data.viewCount = data.viewCount	+ 1;
			edited.record = true;
		}

		if(!edited[field])
		{
			//increment count
			data[field] = data[field] + 1;
			edited[field] = !edited[field];
			$("#"+field).attr("style", "background-color : orange;");
		}

		else
		{
			//decrement count
			data[field] = data[field] - 1;
			edited[field] = !edited[field];
			$("#"+field).attr("style", "background-color : none;");
		}

		//check if all emotions cleared
		let changed = false;

		for (let property in edited) 
		{
				if (edited.hasOwnProperty(property) && property != "record"	) 
				{				
					changed = changed || edited[property];	
				}
		}	

		if(!changed)
		{
			//decrease viewCount
			data.viewCount = data.viewCount - 1;
			console.log("decrease "+data.viewCount);
			edited.record = false;
		}

		//update record
		ref.child(url).set(data);	
	}

});