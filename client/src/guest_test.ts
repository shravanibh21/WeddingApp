import * as assert from 'assert';
import { parseGuest } from './guest';


describe('guest', function(){



    it('parseGuest', function(){
        //Testing each branch that throws error
        assert.deepEqual(parseGuest(2), undefined); //not a guest
        
        assert.deepEqual(parseGuest({name: 2, host: "Host 1", isFamily: false, hasPlusOne: 0, 
            diet: "diet", plusOneName: "someone", plusOneDiet: "something"}), undefined); //name of the guest not a string
        
        assert.deepEqual(parseGuest({name: "name", host: 0, isFamily: false, hasPlusOne: 0, 
            diet: "diet", plusOneName: "someone", plusOneDiet: "something"}), undefined); //not a valid host
        
        assert.deepEqual (parseGuest({name: "name", host: "Host 1", isFamily: "str", hasPlusOne: 0, 
            diet: "diet", plusOneName: "someone", plusOneDiet: "something"}), undefined); //not valid isFamily

        assert.deepEqual (parseGuest({name: "name", host: "Host 1", isFamily: false, hasPlusOne: 3, 
            diet: "diet", plusOneName: "someone", plusOneDiet: "something"}), undefined); //not valid hasPlustOne
        
        assert.deepEqual (parseGuest({name: "name", host: "Host 1", isFamily: false, hasPlusOne: 0, 
            diet: 0, plusOneName: "someone", plusOneDiet: "something"}), undefined); //not valid diet
        
        assert.deepEqual (parseGuest({name: "name", host: "Host 1", isFamily: false, hasPlusOne: 0, 
            diet: "diet", plusOneName: 4, plusOneDiet: "something"}), undefined); //not valid plusOneName
        
        assert.deepEqual (parseGuest({name: "name", host: "Host 1", isFamily: false, hasPlusOne: 0, 
            diet: "diet", plusOneName: "someone", plusOneDiet: 0}), undefined); //not valid plusOneDiet
        
        //Testing a valid guest object
        assert.deepEqual (parseGuest({name: "name", host: "Host 1", isFamily: false, hasPlusOne: 0, 
            diet: "diet", plusOneName: "someone", plusOneDiet: "some diet"}), 
            
            {name: "name", host: "Host 1", isFamily: false, hasPlusOne: 0, 
            diet: "diet", plusOneName: "someone", plusOneDiet: "some diet"}); //valid guest

    });

});
