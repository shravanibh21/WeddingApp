
import * as assert from 'assert';
import { makeSimpleMap } from './map';


describe('map', function(){
    const testMap = makeSimpleMap();


    it('containsKey', function(){
        //0-1-many heuristic: base case
        assert.deepStrictEqual(testMap.containsKey('abc'), false); //false for empty list
        testMap.setValue('abc', 'abc val');
        assert.deepStrictEqual(testMap.containsKey('abc'), true); //true for single element list
        testMap.setValue('def', 'def val');
        assert.deepStrictEqual(testMap.containsKey('def'), true); //true for multiple element list

        //0-1-many heuristic: single call case
        assert.deepStrictEqual(testMap.containsKey('abc'), true); //true base case from single call
        testMap.clearMap();
        testMap.setValue('ghi', 'ghi val');
        assert.deepStrictEqual(testMap.containsKey('abc'), false); //false base case from single call

        //0-1-many heuristic: single call case
        testMap.setValue('jkl', 'jkl val');
        testMap.setValue('mno', 'mno val'); 
        testMap.setValue('pqr', 'pqr val'); //total 4 elements: ghi, jkl, mno, pqr
        assert.deepStrictEqual(testMap.containsKey('mno'), true); //true base case from multiple call
        assert.deepStrictEqual(testMap.containsKey('zzz'), false); //false base case from multiple call

    });

    it('getValue', function() {
        testMap.clearMap();
        //0-1-many heuristic: base case
        assert.throws(() => testMap.getValue('abc'), Error); //false for empty list
        testMap.setValue('abc', 'abc val');
        assert.deepStrictEqual(testMap.getValue('abc'), 'abc val'); //true for single element list
        testMap.setValue('def', 'def val');
        assert.deepStrictEqual(testMap.getValue('def'), 'def val'); //true for multiple element list

        //0-1-many heuristic: single call case
        assert.deepStrictEqual(testMap.getValue('abc'), 'abc val'); //true base case from single call
        testMap.clearMap();
        testMap.setValue('ghi', 'ghi val');
        assert.throws(() => testMap.getValue('abc'), Error);//false base case from single call

        //0-1-many heuristic: single call case
        testMap.setValue('jkl', 'jkl val');
        testMap.setValue('mno', 'mno val'); 
        testMap.setValue('pqr', 'pqr val'); //total 4 elements: ghi, jkl, mno, pqr
        assert.deepStrictEqual(testMap.getValue('mno'), 'mno val'); //true base case from multiple call
        assert.throws(() => testMap.getValue('zzz'), Error); //false base case from multiple call

    });
    
    it('setValue', function() {
        testMap.clearMap();
        testMap.setValue('abc', 'abc val');
        testMap.setValue('jkl', 'jkl val');
        testMap.setValue('mno', 'mno val'); 
        testMap.setValue('pqr', 'pqr val');
        //Checking when key being set already exists
        assert.deepStrictEqual(testMap.setValue('jkl', 'new val jkl'), true); //checking the existing key is replaced
        assert.deepStrictEqual(testMap.getValue('jkl'), 'new val jkl'); //checking the new value is used, not the old
        //checking when the key being set does not exist
        assert.deepStrictEqual(testMap.setValue('new key','new val for new key'), false); //checking if the new key is added
        assert.deepStrictEqual(testMap.getValue('new key'), 'new val for new key'); //checking in the new value is used correctly

    });

    
    it('clearMap', function() {
        testMap.clearMap();
        testMap.setValue('abc', 'abc val');
        testMap.setValue('jkl', 'jkl val');
        testMap.setValue('mno', 'mno val'); 
        testMap.setValue('pqr', 'pqr val');
        assert.deepStrictEqual(testMap.containsKey('jkl'), true);
        assert.deepStrictEqual(testMap.containsKey('abc'), true);
        testMap.clearMap(); //testing this call of clear map
        assert.deepStrictEqual(testMap.containsKey('abc'), false);
    });

    it('getKeys', function() {
        testMap.clearMap();
        assert.deepStrictEqual(testMap.getKeys(), []);
        testMap.setValue('abc', 'abc val');
        assert.deepStrictEqual(testMap.getKeys(), ['abc']);
        testMap.setValue('jkl', 'jkl val');
        testMap.setValue('mno', 'mno val');
        assert.deepStrictEqual(testMap.getKeys(), ['abc', 'jkl', 'mno']);
        testMap.setValue('jkl', 'new val jkl')
        assert.deepStrictEqual(testMap.getKeys(), ['abc', 'jkl', 'mno']);
    }),

    it('getValues', function() {
        testMap.clearMap();
        assert.deepStrictEqual(testMap.getValues(), []);
        testMap.setValue('abc', 'abc val');
        assert.deepStrictEqual(testMap.getValues(), ['abc val']);
        testMap.setValue('jkl', 'jkl val');
        testMap.setValue('mno', 'mno val');
        assert.deepStrictEqual(testMap.getValues(), ['abc val', 'jkl val', 'mno val']);
        testMap.setValue('jkl', 'new val jkl')
        assert.deepStrictEqual(testMap.getValues(), ['abc val', 'new val jkl', 'mno val']);
    })

    it('removeValues', function() {
        testMap.clearMap();
        assert.deepStrictEqual(testMap.removeValue("abc"), false);
        testMap.setValue('abc', 'abc val');
        testMap.setValue('abc', 'abc val new')
        assert.deepStrictEqual(testMap.removeValue("abc"), true);
        assert.deepStrictEqual(testMap.removeValue("abc"), false); //one remove call must remove all pairs of that key
        testMap.setValue('def', 'def val');
        testMap.setValue('ghi', 'ghi val');
        assert.deepStrictEqual(testMap.removeValue("xyz"), false);
        
        
    })
});
