var sinon = require('sinon'),
    rewire = require('rewire'),
    Issue = rewire('../model/issue'),
    assert = require('chai').assert,
    expect = require('chai').expect


describe('Issue model sanatize test', function () {
	var sampleResponse = {"error":"OK","limit":1,"offset":0,"number_of_page_results":1,"number_of_total_results":741,"status_code":1,"results":[{"cover_date":"1952-12-01","deck":null,"description":"<ol><li>Cover by J. Winslow Mortimer.<\/li><li>\"<em>The Crazy Crime Clown!<\/em>\" written by Alvin Schwartz, penciled by Dick Sprang and inked by Charles Paris.<\/li><li>\"<em>The Movie That Killed Batman<\/em>\" written by Bill Finger, penciled and inked by Dick Sprang.<\/li><li>\"<em>The Water Crimes of Mr.Hydro<\/em>\" written by Bill Finger, penciled by Lew Schwartz and inked by Stan Kaye.<\/li><\/ol>","id":183,"image":{"icon_url":"http:\/\/static1.comicvine.com\/uploads\/square_avatar\/0\/4\/173-796-183-1-batman.jpg","medium_url":"http:\/\/static2.comicvine.com\/uploads\/scale_medium\/0\/4\/173-796-183-1-batman.jpg","screen_url":"http:\/\/static3.comicvine.com\/uploads\/screen_medium\/0\/4\/173-796-183-1-batman.jpg","small_url":"http:\/\/static4.comicvine.com\/uploads\/scale_small\/0\/4\/173-796-183-1-batman.jpg","super_url":"http:\/\/static5.comicvine.com\/uploads\/scale_large\/0\/4\/173-796-183-1-batman.jpg","thumb_url":"http:\/\/static6.comicvine.com\/uploads\/scale_avatar\/0\/4\/173-796-183-1-batman.jpg","tiny_url":"http:\/\/static7.comicvine.com\/uploads\/square_mini\/0\/4\/173-796-183-1-batman.jpg"},"issue_number":"74","name":"The Crazy Crime Clown! \/ The Movie That Killed Batman \/ The Water Crimes of Mr.Hydro","volume":{"api_detail_url":"http:\/\/www.comicvine.gamespot.com\/api\/volume\/4050-796\/","id":796,"name":"Batman","site_detail_url":"http:\/\/comicvine.gamespot.com\/batman\/4050-796\/"}}],"version":"1.0"}
    
    it('error should have been stripped', function () {
    	var issue = new Issue(sampleResponse);
    	assert(issue.error == null)
    });
    it('number of total results is still here', function () {
    	var issue = new Issue(sampleResponse);
    	assert(issue.data.number_of_total_results == 741)
    });
    it('results is still there', function () {
    	var issue = new Issue(sampleResponse);

    	assert(issue.data.results.length == 1)
    });
    
});

describe('Redis cache tests getCache', function () {
    it('when cache returns null, and issue returns an error, model should return error', sinon.test(function (done) {
        var nextStub = sinon.stub(),
            clientNextStub = sinon.stub(),
            restClientMock = sinon.stub(),
            cacheMock = sinon.stub(),
            error = new Error("Error");

        cacheMock.getValue = this.stub().
        callsArgWith(1,error, null)

        restClientMock.getIssues = this.stub().
        callsArgWith(2, error, null)

        Issue.__set__({
            'client': restClientMock,
            'cache' : cacheMock
        });
        Issue.prototype.findByQuery("key", "param", 0, nextStub)
        assert(nextStub.called);
        //make sure our next method was called withour error object that was returned
        assert(nextStub.calledWith(error))
        done() 
    }))
     it('when cache returns body it is returned', sinon.test(function (done) {
        var nextStub = sinon.stub(),
            clientNextStub = sinon.stub(),
            cacheMock = sinon.stub(),
            sampleResponse = {"error":"OK","limit":1,"offset":0,"number_of_page_results":1,"number_of_total_results":741,"status_code":1,"results":[{"cover_date":"1952-12-01","deck":null,"description":"<ol><li>Cover by J. Winslow Mortimer.<\/li><li>\"<em>The Crazy Crime Clown!<\/em>\" written by Alvin Schwartz, penciled by Dick Sprang and inked by Charles Paris.<\/li><li>\"<em>The Movie That Killed Batman<\/em>\" written by Bill Finger, penciled and inked by Dick Sprang.<\/li><li>\"<em>The Water Crimes of Mr.Hydro<\/em>\" written by Bill Finger, penciled by Lew Schwartz and inked by Stan Kaye.<\/li><\/ol>","id":183,"image":{"icon_url":"http:\/\/static1.comicvine.com\/uploads\/square_avatar\/0\/4\/173-796-183-1-batman.jpg","medium_url":"http:\/\/static2.comicvine.com\/uploads\/scale_medium\/0\/4\/173-796-183-1-batman.jpg","screen_url":"http:\/\/static3.comicvine.com\/uploads\/screen_medium\/0\/4\/173-796-183-1-batman.jpg","small_url":"http:\/\/static4.comicvine.com\/uploads\/scale_small\/0\/4\/173-796-183-1-batman.jpg","super_url":"http:\/\/static5.comicvine.com\/uploads\/scale_large\/0\/4\/173-796-183-1-batman.jpg","thumb_url":"http:\/\/static6.comicvine.com\/uploads\/scale_avatar\/0\/4\/173-796-183-1-batman.jpg","tiny_url":"http:\/\/static7.comicvine.com\/uploads\/square_mini\/0\/4\/173-796-183-1-batman.jpg"},"issue_number":"74","name":"The Crazy Crime Clown! \/ The Movie That Killed Batman \/ The Water Crimes of Mr.Hydro","volume":{"api_detail_url":"http:\/\/www.comicvine.gamespot.com\/api\/volume\/4050-796\/","id":796,"name":"Batman","site_detail_url":"http:\/\/comicvine.gamespot.com\/batman\/4050-796\/"}}],"version":"1.0"}

        cacheMock.getValue = this.stub().
        callsArgWith(1,null, sampleResponse)

        Issue.__set__({
            'cache' : cacheMock
        });
        Issue.prototype.findByQuery("key", "param", 0, nextStub)
        assert(nextStub.called);
        //make sure our next method was called withour error object that was returned
        assert(nextStub.calledWith(null, new Issue(sampleResponse)))
        done() 
    }))
    it('when cache returns null, and issue service returns correctly, issue is sent to cache', sinon.test(function (done) {
        var nextStub = sinon.stub(),
            clientNextStub = sinon.stub(),
            restClientMock = sinon.stub(),
            cacheMock = sinon.stub(),
            error = new Error("Error");

        cacheMock.getValue = this.stub().
        callsArgWith(1,error, null)

        restClientMock.getIssues = this.stub().
        callsArgWith(2, null, {body:1})

       cacheMock.addToCache = sinon.spy()

        Issue.__set__({
            'client': restClientMock,
            'cache' : cacheMock
        });
        Issue.prototype.findByQuery("key", "param", 0, nextStub)
        assert(nextStub.called);
        //make sure our next method was called withour error object that was returned
        assert(cacheMock.addToCache.called)
        done() 
    }))
    it('when cache returns null, and issue service returns correctly, next is called with issue', sinon.test(function (done) {
        var nextStub = sinon.stub(),
            clientNextStub = sinon.stub(),
            restClientMock = sinon.stub(),
            cacheMock = sinon.stub(),
            error = new Error("Error");
            sampleResponse = {"error":"OK","limit":1,"offset":0,"number_of_page_results":1,"number_of_total_results":741,"status_code":1,"results":[{"cover_date":"1952-12-01","deck":null,"description":"<ol><li>Cover by J. Winslow Mortimer.<\/li><li>\"<em>The Crazy Crime Clown!<\/em>\" written by Alvin Schwartz, penciled by Dick Sprang and inked by Charles Paris.<\/li><li>\"<em>The Movie That Killed Batman<\/em>\" written by Bill Finger, penciled and inked by Dick Sprang.<\/li><li>\"<em>The Water Crimes of Mr.Hydro<\/em>\" written by Bill Finger, penciled by Lew Schwartz and inked by Stan Kaye.<\/li><\/ol>","id":183,"image":{"icon_url":"http:\/\/static1.comicvine.com\/uploads\/square_avatar\/0\/4\/173-796-183-1-batman.jpg","medium_url":"http:\/\/static2.comicvine.com\/uploads\/scale_medium\/0\/4\/173-796-183-1-batman.jpg","screen_url":"http:\/\/static3.comicvine.com\/uploads\/screen_medium\/0\/4\/173-796-183-1-batman.jpg","small_url":"http:\/\/static4.comicvine.com\/uploads\/scale_small\/0\/4\/173-796-183-1-batman.jpg","super_url":"http:\/\/static5.comicvine.com\/uploads\/scale_large\/0\/4\/173-796-183-1-batman.jpg","thumb_url":"http:\/\/static6.comicvine.com\/uploads\/scale_avatar\/0\/4\/173-796-183-1-batman.jpg","tiny_url":"http:\/\/static7.comicvine.com\/uploads\/square_mini\/0\/4\/173-796-183-1-batman.jpg"},"issue_number":"74","name":"The Crazy Crime Clown! \/ The Movie That Killed Batman \/ The Water Crimes of Mr.Hydro","volume":{"api_detail_url":"http:\/\/www.comicvine.gamespot.com\/api\/volume\/4050-796\/","id":796,"name":"Batman","site_detail_url":"http:\/\/comicvine.gamespot.com\/batman\/4050-796\/"}}],"version":"1.0"}
       
        cacheMock.getValue = this.stub().
        callsArgWith(1,error, null)

        restClientMock.getIssues = this.stub().
        callsArgWith(2, null, sampleResponse)

       cacheMock.addToCache = sinon.spy()

        Issue.__set__({
            'client': restClientMock,
            'cache' : cacheMock
        });
        Issue.prototype.findByQuery("key", "param", 0, nextStub)
        assert(nextStub.called);
        //make sure our next method was called withour error object that was returned
        assert(nextStub.calledWith(null, new Issue(sampleResponse)))
        done() 
    }))
 })

 