import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
//import { dummy } from './routes';
import {save, resetGuestsForTesting, values} from './routes'

describe('routes', function() {

  it('save', function() {
    // First branch, straight line code, error case
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: 1086, content: "some stuff"}});
    const res = httpMocks.createResponse();
    save(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(),
        'required argument "name" was missing');

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {saved: "some stuff"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');

    // Second branch, straight line code, error case
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "A"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.deepStrictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'required argument "content" was missing');

    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "L"}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);
    
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
        'required argument "content" was missing');

    // Third branch, straight line code

    const req4 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", content: "some stuff"}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.deepStrictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {saved: false});

    const req5 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", content: "different stuff"}});
    const res5 = httpMocks.createResponse();
    save(req5, res5);

    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {saved: true});

    // Called to clear all saved designs created in this test
    //    to not effect future tests
    resetGuestsForTesting();
  });

  it('values', function(){
    const emptyKeysRes = httpMocks.createResponse();
    const dummyReq = httpMocks.createRequest();
    values(dummyReq, emptyKeysRes);
    assert.deepStrictEqual(emptyKeysRes._getData(), {values: []});

    const req1 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "abc", content: "abc val"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);
    const resKeys1 = httpMocks.createResponse();
    values(dummyReq, resKeys1);
    assert.deepStrictEqual(resKeys1._getData(), {values: ['abc val']});

    const req2 = httpMocks.createRequest({method: 'POST', url: '/save',
    body: {name: "jkl", content: "jkl val"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);
    const resKeys2 = httpMocks.createResponse();
    values(dummyReq, resKeys2);
    assert.deepStrictEqual(resKeys2._getData(), {values: ['abc val', 'jkl val']});

    const req3 = httpMocks.createRequest({method: 'POST', url: '/save',
    body: {name: "abc", content: "abc val new"}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);
    const resKeys3 = httpMocks.createResponse();
    values(dummyReq, resKeys3);
    assert.deepStrictEqual(resKeys3._getData(), {values: ['abc val new', 'jkl val']});

    // Called to clear all saved designs created in this test
    //    to not effect future tests
    resetGuestsForTesting();
  })


});
