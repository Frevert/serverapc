/// <reference path="../../typings/mocha/mocha.d.ts"/>
/// <reference path="../../typings/node/node.d.ts"/>
process.env.NODE_ENV = 'test';

var request = require('request'),
    s = require('string'),
    cheerio = require('cheerio'),
    expect = require('chai').expect,
    baseUrl = 'http://www.wasdabyx.de:8080';

describe('Home page', function(){
  it('should load properly', function(done) {
    request(baseUrl, function(error, response, body){
      expect(error).to.be.not.ok;
      expect(response).to.be.not.a('undefined');
      expect(response.statusCode).to.be.equal(200);
      
      var $ = cheerio.load(body);
      var footerText = $('footer p').html();
      expect(s(footerText).contains('Tanzim') && s(footerText).contains('Saqib')).to.be.ok;
      done();
    });
  });
  it('should navigate to login', function(done) {
    request(baseUrl + '/login', function(error, response, body){
      expect(error).to.be.not.ok;
      expect(response).to.be.not.a('undefined');
      expect(response.statusCode).to.be.equal(200);
      expect(s(body).contains('Not Found')).to.be.not.ok;
      done();
    });
  });
  it('should navigate to sign up', function(done){
    request(baseUrl + '/signup', function(error, response, body){
      expect(error).to.be.not.ok;
      expect(response).to.be.not.a('undefined');
      expect(response.statusCode).to.be.equal(200);
      expect(s(body).contains('Not Found')).to.be.not.ok;
      done();
    });
  });
});
