
const _ = require('lodash');
const NodeCouchDb = require('node-couchdb');
 
// node-couchdb instance with default options
const couch = new NodeCouchDb();
 

const couchExternal = new NodeCouchDb({
    host: 'localhost',
    protocol: 'http',
    port: 5984
});
 
// not admin party
const couchAuth = new NodeCouchDb({
    auth: {
        user: 'login',
        pass: 'secret'
    }
});


exports.AddBusiness = function(req, res) {
	console.log(req.body);
	res.setHeader('Content-Type', 'application/json');
	/*const mangoQuery = {
		selector: {
			'_id': {'$gt': null}
		}
	};
	
	transport, wildlife, healthcare, leisure, hotel
	
	
		{
			"BusinessName" :"Links hotels",
			"Location": "Gulu",
			"Description": "Luxurious hotels in masind, north eastern Uganda",
			"MapCoordinates": "",
			"BusinessCategory": "", //transport, wildlife, healthcare, leisure, hotel
			"Email": "",
			"Telno": "",
			"Services": [],
			"Offers": []
		}
	
	var req_
	const parameters = {};
 
	couch.mango('catalogue', mangoQuery, parameters).then(({data, headers, status}) => {
		// data is json response
		console.log(data);
		res.send(JSON.stringify({success: true, data: data}));
		// headers is an object with all response headers
		// status is statusCode number
	}, err => {
		// either request error occured
		// ...or err.code=EDOCMISSING if document is missing
		// ...or err.code=EUNKNOWN if statusCode is unexpected
		res.send(JSON.stringify({success: false, error:err}));
	});
	*/
	
	var reqKeys = ['BusinessName', 'Location', 'MapCoordinates', 'BusinessCategory', 'Description', 'Email', 'Telno', 'Services', 'Offers'];
	var body = req.body;
	
	if(!_.isEmpty(body)){
		body['_id'] = _.toLower(body.BusinessName.split(' ').join(''));
		body['BusinessName'] = _.capitalize(body.BusinessName);
		
		try {
			couch.insert("catalogue", body)
			.then(({data, headers, status}) => {
				// data is json response
				console.log(data);
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({success: true, data: data}));
				
			})
			.catch((error) => {
				console.log(error);
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({success: false, data: 'error'}));
			});
		  } catch (error) {
			console.error('(FROM ASYNC/AWAIT) Error cause is:', error);
			res.setHeader('Content-Type', 'application/json');
    		res.end(JSON.stringify({success: false, error: 'Business Exists'}));
		  }
		
		
	}else{
		res.setHeader('Content-Type', 'application/json');
    	res.end(JSON.stringify({success: false, error: 'wrong format'}));
	}
};

exports.UpdateBusiness = function(req, res) {
	console.log(req.body);
	if(!(req.body && req.body.BusinessName)){
		res.send(JSON.stringify({success: false, error: 'Wrong Query Format'}));
		return;
	}
	
	couch.get('catalogue', _.toLower(req.body.BusinessName.split(' ').join('')))
	.then(({data, headers, status}) => {
		console.log(data);
		var temp = data;
		_.forIn(req.body, function(v, k) { 
			_.set(temp, k, v);
		});
		
		console.log('================');
		console.log(temp);
		 
		couch.update("catalogue", temp)
		.then(({data2, headers2, status2}) => {
			// data is json response
			console.log(data2);
			res.send(JSON.stringify({success: true}));
			
		})
		.catch((error) => {
			console.log(error);
			res.send(JSON.stringify({success: false, error: error}));
		});
	}).catch((error) => {
		res.send(JSON.stringify({success: false, error: error}));
	});
	
	
	
};

exports.AddServices = function(req, res) {
	/**
		{
			"BusinessName": "",
			"Services": [
				{
					"ServiceName": "",  // Transport, Guided Tour, Bird watching, Game ride, Accomodation, Scenery, Swimming, Mountain Climbing, Sauna, Steam Bath, Indoor Games,Spa, General Medical Services, Emergency Services 
					"ServiceDescription": ""
				}
			]
		}
	*/
	
	if(req.body && req.body.BusinessName && req.body.Services && req.body.Services.length){
		
		couch.get('catalogue', _.toLower(req.body.BusinessName.split(' ').join('')))
		.then(({data, headers, status}) => {
			
			var doc = _.clone(data);
			var s = _.unionBy(req.body.Services, doc.Services, 'ServiceName');
			doc.Services = s;
			
		 
			couch.update("catalogue", doc)
			.then(({data2, headers2, status2}) => {
			
				res.send(JSON.stringify({success: true}));
			
			})
			.catch((error) => {
				res.send(JSON.stringify({success: false, error: error}));
			}); 
		}).catch((error) => {
			res.send(JSON.stringify({success: false, error: error}));
		});
		
	}else{
		res.send(JSON.stringify({success: false, error: 'Wrong Query Format'}));
		return;
	}
};
	
exports.AddOffers = function(req, res) {
	/**
		{
			"BusinessName": "",
			"Offers": [
				{
					"OfferName": "",  
					"OfferDescription": "",
					"Starts": "2019-12-30",
					"Ends": "2019-12-31"
				}
			]
		}
	*/
	
	if(req.body && req.body.BusinessName && req.body.Offers && req.body.Offers.length){
		
		couch.get('catalogue', _.toLower(req.body.BusinessName.split(' ').join('')))
		.then(({data, headers, status}) => {
			
			var doc = _.clone(data);
			var s = _.unionBy(req.body.Offers, doc.Offers, 'OfferName');
			doc.Offers = s;
			
		 
			couch.update("catalogue", doc)
			.then(({data2, headers2, status2}) => {
			
				res.send(JSON.stringify({success: true}));
			
			})
			.catch((error) => {
				res.send(JSON.stringify({success: false, error: error}));
			}); 
		}).catch((error) => {
			res.send(JSON.stringify({success: false, error: error}));
		});
		
	}else{
		res.send(JSON.stringify({success: false, error: 'Wrong Query Format'}));
		return;
	}	
	
};



