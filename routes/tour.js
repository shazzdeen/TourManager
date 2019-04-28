const NodeCouchDb = require('node-couchdb');
 
// node-couchdb instance with default options
const couch = new NodeCouchDb();
 
// node-couchdb instance with Memcached
/*
const MemcacheNode = require('node-couchdb-plugin-memcached');
const couchWithMemcache = new NodeCouchDb({
    cache: new MemcacheNode
});
 */
// node-couchdb instance talking to external service
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

/**
const mangoQuery = {
    selector: {
        $gte: {firstname: 'Ann'},
        $lt: {firstname: 'George'}
    }
};
const parameters = {};
 
couch.mango(dbName, mangoQuery, parameters).then(({data, headers, status}) => {
    // data is json response
    // headers is an object with all response headers
    // status is statusCode number
}, err => {
    // either request error occured
    // ...or err.code=EDOCMISSING if document is missing
    // ...or err.code=EUNKNOWN if statusCode is unexpected
});
*/



exports.catalogue = function(req, res) {
	console.log('==================');
	const mangoQuery = {
		selector: {
			'_id': {'$gt': null}
		}
	};
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
	
	//res.send(JSON.stringify({success: true}));
};
