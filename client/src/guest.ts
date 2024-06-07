// Description of an individual guest
// RI: hasPlusOne === 1 -> plusOneName, plusOneDiet required fields
import { isRecord } from "./record";

export type Guest = {
    readonly name: string,
    readonly isFamily: boolean,
    readonly host: "Host A" | "Host B",
    readonly hasPlusOne: -1 | 0 | 1,
    readonly diet?: string,
    readonly plusOneName?: string,
    readonly plusOneDiet?: string
  };

  /**Parses a unknown data into a Guest */
  export const parseGuest = (val: unknown): undefined | Guest => {
    if (!isRecord(val)) {
      console.error("not a guest", val)
      return undefined;
    }
  
    if (typeof val.name !== "string") {
      console.error("not a guest: missing 'name'", val)
      return undefined;
    }
  
    if ((val.host !== "Host A") && (val.host !== "Host B")) {
      console.error("not a guest: missing 'host'", val)
      return undefined;
    }
  
    if (typeof val.isFamily !== "boolean") {
      console.error("not a guest: missing whether is family or not", val)
      return undefined;
    }
  
    if ((val.hasPlusOne !== -1) && (val.hasPlusOne !== 0) && (val.hasPlusOne !== 1)) {
      console.error("not a guest: missing if the guest has a plus one", val)
      return undefined;
    }
  
    if ((typeof val.diet !== "string") && (typeof val.diet !== "undefined")) {
      console.log(typeof val.diet);
      console.error("not an guest: missing guest diet", val)
      return undefined;
    }

    if ((typeof val.plusOneName !== "string") && (typeof val.plusOneName !== "undefined")) {
      console.error("not a guest: plus one's name", val)
      return undefined;
    }
  
    if ((typeof val.plusOneDiet !== "string") && (typeof val.plusOneDiet !== "undefined")) {
      console.error("not a guest: missing or invalid plus one's diet", val)
      return undefined;
    }
  
    return {
      name: val.name, host: val.host, isFamily: val.isFamily, hasPlusOne: val.hasPlusOne, 
      plusOneName: val.plusOneName, plusOneDiet: val.plusOneDiet, diet: val.diet
    };

  };