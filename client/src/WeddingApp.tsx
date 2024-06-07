import React, { Component } from "react";
import { isRecord } from './record';
import { Guest, parseGuest } from "./guest";
import { GuestList } from "./GuestList";
import { AddGuest } from "./AddGuest";
import { GuestDetails, GuestInfo } from "./GuestDetails";
import './StyleSheet.css'

/** Displays the UI of the Wedding rsvp application. */
type Page = "list" | "new" | {kind: "details", index: number};

type WeddingAppState = {
  show: Page;
  guests: Guest[];
};

/** Displays the UI of the Wedding rsvp application. */
export class WeddingApp extends Component<{}, WeddingAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {show: "list", guests: []};
  }
  
  render = (): JSX.Element => {
    console.log(this.state.guests);

    if(this.state.show === "list") {
      return <GuestList guests={this.state.guests}
                        onAddClick={this.doAddFromListClick}
                        onGuestClick={this.doGuestClick}
              />

    } else if(this.state.show === "new") {
      return <AddGuest onAddGuest={this.doAddFromNewClick}
                       onBack={this.doBackClick}
              />
    } else {
      return (
        <GuestDetails currGuest={this.state.guests[this.state.show.index]}
                      index={this.state.show.index}
                      onSave={this.doSaveFromDetailsClick}
                      onBack={this.doBackClick}
                      onDelete={this.doDeleteClick}
        />
      );
    }
  };

  componentDidMount = (): void => {
      this.doListGuestsFetch();
  }

  doDeleteClick = (name: string): void => {
    const body = {name: name};
    fetch("/api/remove", {
        method: "POST", body: JSON.stringify(body),
        headers: {"Content-Type": "application/json"} })
      .then(this.doDeleteResp)
      .catch(() => this.doDeleteError("failed to connect to server"));

  }

  doDeleteResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp.json().then(this.doDeleteJson)
          .catch(() => this.doDeleteError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp.text().then(this.doDeleteError)
          .catch(() => this.doDeleteError("400 response is not text"));
    } else {
      this.doDeleteError(`bad status code from /api/remove: ${resp.status}`);
    }
  }

  doDeleteJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/delete: not a record", data);
      return;
    }

    if(data.removed) {
      this.doListGuestsFetch();  //only re-fetch guest list from server if the guest was removed
    } else {
      this.setState({show: "list"}); //works like a back button if nothing removed.
    }

  };

  doDeleteError = (msg: string): void => {
    console.error(`Error fetching /api/remove: ${msg}`);
  }
  

  doAddFromListClick = (): void => {
    console.log("Add on list page clicked");
    this.setState({show: "new"});
  }

  doGuestClick = (index: number): void => {
    console.log("Item in guest list clicked");
    this.setState({show: {kind: "details", index: index}});
  }

  doAddFromNewClick = (_guest: Guest): void => {
    console.log("Add on add guest page clicked");
    // const updatedGuests = this.state.guests.concat(guest);
    // this.setState({guests: updatedGuests, show: "list"});
    this.doListGuestsFetch();
  }

  doBackClick = (): void => { //same call from either pages
    console.log("Back on add guest page or details page clicked");
    // this.setState({show: "list"});
    this.doListGuestsFetch();
  }


  doSaveFromDetailsClick = (_guest: GuestInfo, _index: number): void => {
    console.log("Save button from details page clicked");
    this.doListGuestsFetch();
    
  }

  doListGuestsFetch = (): void => {
    fetch("/api/values")
    .then((res) => this.doListResp(res))
    .catch(() => this.doListError("failed to connect to server"));
  }

  doListResp = (res: Response): void => {
  if (res.status === 200) {
    res.json().then((val) => this.doListJson(val))
      .catch(() => this.doListError("200 response is not JSON"));
  } else if (res.status === 400) {
    res.text().then(this.doListError)
      .catch(() => this.doListError("400 response is not text"));
  } else {
    this.doListError(`bad status code: ${res.status}`);
  }
};

doListJson = (val: unknown): void => {
  if (!isRecord(val) || !Array.isArray(val.values)) {
    console.error('Invalid JSON from /api/values', val);
    return;
  }

  const values: Guest[] = [];
  for (const value of val.values) {
    if (parseGuest(value) !== undefined) {
      values.push(value);
    } else {
      console.error('Invalid name from /api/values', value);
      return;
    }
  }

  this.setState({guests: values, show: "list"});
};

doListError = (msg: string): void => {
  console.error(`Error fetching /api/values: ${msg}`);
};



}