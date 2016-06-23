/**
 * Created by andrew.larsen on 2/13/2016.
 */
var Issue = require('../model/issue.js');
var config = require('config').get('COMIC_API_PARAMS');

var issues = {
    findByQuery: function(req, res){
    	var test = req.query
    	var offset = req.query.offset
    	var key = req.query.key
    	var param = req.query.param
        new Issue().findByQuery(key, param, offset,function(issues){
        	var issues = new Issue(issues)
            //now we need to set the next offset
            var next_offset = getOffsetValue(issues)
            issues.set('next_offset', next_offset)
            res.json(issues);
        });
    }
};

//add unit tests, for now I eye ball tested it with POSTMAN
function getOffsetValue(issues){
    //get the current offset and the total number of results
    var current_offset = issues.get('offset');
    //subtract 1 because technically the last offset is nothing (starts at 0)
    var num_results = issues.get('number_of_total_results') - 1
    console.log(current_offset)
    console.log(num_results)
    //make sure these are good
    //now add the configured max limit to be returned
    var new_offset = issues.get('offset') + config.LIMIT
        console.log(new_offset)

    //check to make sure new val isn't greater than total number
    if(new_offset > num_results){
        //if so, just set it as max
        new_offset = num_results;
    }
    //set the new_offset value
                console.log(new_offset)

    return new_offset;
    
}

module.exports = issues;