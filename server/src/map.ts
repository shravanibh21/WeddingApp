// TODO (Q5): 
//  a) Copy over your mutable map interface from HW7
//  b) Add a function that gets all the keys from the map
//  c) Create a class that implements the interface with a TS Map as its field
//  d) Implement a factory function that creates a new instance of the class

// import { nil, cons } from "./list";


/** Represents a map */
export interface MutableMap {

    /**@retruns true if the key exists in the map*/
    containsKey: (key : string) => boolean;

    /**@retruns the value asscoiated with the given key if it exists in the map*/
    getValue: (key : string) => unknown;

    /**@retruns true if the value associated with the given key is replaced*/
    setValue: (key : string, val : unknown) => boolean;

    /**@returns true if the value associated with the given key is removed */
    removeValue: (key: string) => boolean;
    
    /**Clears the map*/
    clearMap: () => void;

    /**Gets an array of all keys  */
    getKeys: () => Array<string>;

    /**Gets an array of all values of the map*/
    getValues: () => Array<unknown>;
   
}

class SimpleMap implements MutableMap {
    //AF: obj = this.map
   private simpleMap: Map<string, unknown>;

   //Create an empty map
   constructor() {
    this.simpleMap = new Map();
   }

    /**
     * Determines if the given key is within a pair in the given list
     * @param key to determine if list contains
     * @returns true if the key exists in the map
     */
    containsKey = (key: string): boolean => this.simpleMap.has(key);

    /**
     * Gets the value paired with the first instance of the given key 
     * in the given list
     * @param key to find the corresponding value for
     * @returns the value asscoiated with the given key if it exists in the map
     * @throws Error when key does not exist in the map
     */
    getValue = (key: string): unknown => {
        const val = this.simpleMap.get(key);
        if(val === undefined) {
            throw new Error("key is not contained in Map");
        } else {
            return val;
        }
    }

    /**
     * Replaces the value of the provided key with the provided value if the key is found
     * @param key is the key of whose value needs to replaced
     * @param val is the new value to assign to the key
     * @returns true if the provided key's value was updated, false otherwise
     * @modifies this.map
     * @effects this.map - same length, but replaces the value of the provided key with the 
       given value if the key is found.
     */
    setValue = (key: string, val: unknown): boolean => {
        let isReplaced: boolean; 
        if(this.simpleMap.has(key)) {
            isReplaced = true;
            this.simpleMap = this.simpleMap.set(key, val);
        } else {
            isReplaced = false;
            this.simpleMap = this.simpleMap.set(key, val);
        }
        return isReplaced;
    }

    /**
     * @param key: the pair associated with this key will be removed from the map
     * @returns true if the pair was successfully removed
     */
    removeValue = (key: string): boolean => {return this.simpleMap.delete(key);} 
    

    /**
     * Clears the map completely.
     * @modifies this.map
     * @effects this.map - removes all elements from the map
     */
    clearMap = (): void => this.simpleMap.clear();


    /**
     * Returns an array of keys for the map
     * @returns an array of keys with all unique keys.
     */
    getKeys = (): string[] => Array.from(this.simpleMap.keys());

    /**
     * Returns an array of values for the map
     * @returns an array of values for all elements in the map
     */
    getValues = (): unknown[] => Array.from(this.simpleMap.values());

}

const makeMap: SimpleMap = new SimpleMap();
  /**
   * Returns an emplty simple map.
   * @returns a an empty simple map object.
   */
  export const makeSimpleMap = (): SimpleMap => { return makeMap; }