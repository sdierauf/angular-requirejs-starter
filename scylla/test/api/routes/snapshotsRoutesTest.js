var expect = require('chai').expect;
var assert = require('assert');
var Mocha = require('mocha');

var host = "localhost";
var port = "3000";

var h = require('../util/asyncHelpers.js')(host, port);

describe("Snapshots", function(){
    var snapPage;
    var createdSnapshot;
    var snapsBaseUri = function(page){ return "/pages/" + page.id + "/snapshots"}

    /* Snapshots tests may fail if pages aren't working correctly */

    before(function(done){
        var page = {
            url:"http://127.0.0.1:3000/testFodder/neverChanges.html",
            name:"Snapshots Routes Test",
            state:"Complete"
        };
        return h.getJsonObject(h.postRequest("/pages", page))
            .then(function(result){
                snapPage = result;
                done();
            });
    });

    it('can create a snapshot', function(){
        this.timeout(5000);
        var snapshot = {
            notes:"Snapshot Post Test",
            params:"{width:800,height:800}"

        };
        return h.getJsonObject(h.postRequest(snapsBaseUri(snapPage), snapshot))
            .then(function(result){
                createdSnapshot = result;
                expect(result).to.exist;
                expect(result.id).to.exist;
            });
    });

    it('gets a list of snapshots', function(){
        return h.getJsonObject(h.getRequest(snapsBaseUri(snapPage)))
            .then(function(snapshots){
                expect(snapshots).to.be.instanceof(Array);
                expect(snapshots.length).to.be.greaterThan(0);
            });
    });
    

    it('can retrieve a snapshot', function(){
        //console.log(require('util').inspect(createdSnapshot));
        return h.getJsonObject(h.getRequest("/snapshots/" + createdSnapshot.id))
            .then(function(result){
                expect(result.PageId).to.equal(createdSnapshot.PageId);
                expect(result.console).to.equal(createdSnapshot.console);
                expect(result.createdAt).to.equal(createdSnapshot.createdAt);
                expect(result.updatedAt).to.equal(createdSnapshot.updatedAt);
                expect(result.id).to.equal(createdSnapshot.id);
                expect(result.notes).to.equal(createdSnapshot.notes);
                expect(result.params).to.equal(createdSnapshot.params);
                expect(result.state).to.equal(createdSnapshot.state);
            });
    });

    it('can modify a snapshot', function(){
        createdSnapshot.notes = "Snapshots Routes Test Modify";
        return h.getJsonObject(h.putRequest("/snapshots/" + createdSnapshot.id, createdSnapshot))
            .then(function(result){
                expect(result.id).to.equal(createdSnapshot.id);
                expect(result.notes).to.equal(createdSnapshot.notes);
                //MySQL doesn't store MS in time stamps, so this won't ever be updated.
                //expect(result.updatedAt).to.not.equal(createdSnapshot.updatedAt);
            });
    });

    it('can delete a snapshot', function(){
        return h.getResponse(h.delRequest("/snapshots/" + createdSnapshot.id, createdSnapshot))
            .then(function(response){
                expect(response.status).to.equal(200);
            });
    });

});