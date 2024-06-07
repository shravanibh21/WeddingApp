import React, { Component, MouseEvent, ChangeEvent } from 'react';
import { Guest } from './guest';
import { isRecord } from './record';

type AddGuestProps = {
    onAddGuest: (guest: Guest) =>  void;
    onBack: () => void;
    
}

type AddGuestSates = {
    name: string,
    host: "Host 1" | "Host 2" | "",
    isFamily: boolean,
    error: string,
}

export class AddGuest extends Component<AddGuestProps, AddGuestSates> {
    
    constructor(props: AddGuestProps) {
        super(props);
        this.state = {name: "", host: "", isFamily: false, error: ""};
    }

    render = (): JSX.Element => {
        return (
            <div>
                <h2>Add Guest</h2>
                <div id="name">
                    <label htmlFor="name">Guest Name:     </label>
                    <input id="name" type="text" value={this.state.name}
                    onChange={this.doNameChange}></input>
                </div>

                <div>
                    <h3>Invited By: </h3>
                    <input type="radio" id="hostClick" name="host" value="Host 1" checked={this.state.host === "Host 1"} onChange={this.doHostChange}></input>
                    <label htmlFor="Host 1">Host 1</label>
                    <br/>
                    <input type="radio" id="hostClick" name="host" value="Host 2" checked={this.state.host === "Host 2"} onChange={this.doHostChange}></input>
                    <label htmlFor="Host 2">Host 2</label>
                </div>
                <div>
                    <br/><br/>
                    <label htmlFor="Family">Family: </label>
                    <input type="checkbox" id="familyCheck" checked={this.state.isFamily} onChange={this.doIsFamilyChange}></input>
                </div>
                <br/><br/>
                <button id="addButton" onClick={this.doAddClick}>Add Guest</button>
                <button id="backButton" onClick={this.doBackClick}>Back</button>
                {this.renderError()}
            </div>
        )
    }

    renderError = (): JSX.Element => {
        if(this.state.error.length === 0) {
            return <div></div>
        } else {
            return <p>Error: {this.state.error}</p>
        }
    }

    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({name: evt.target.value, error: ""});
    };

    doHostChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        evt.target.value === "Host 1" ? this.setState({host: "Host 1", error: ""}) : 
                                       this.setState({host: "Host 2", error: ""})
        
    }

    doIsFamilyChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
        if(this.state.isFamily) {
            this.setState({isFamily: false, error: ""});
        } else {
            this.setState({isFamily: true, error: ""});
        }
    }

    doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if(this.state.name === "") {
            this.setState({error: "Name of the guest is missing"});
            return;
        }

        if(this.state.host === "") {
            this.setState({error: "Selection of a host is missing"});
            return;
        }

        const hostVal: "Host 1" | "Host 2" = this.state.host === "Host 1" ? "Host 1" : "Host 2";
        const args = { name: this.state.name,
            isFamily: this.state.isFamily, host: hostVal,
            hasPlusOne: -1, };
        const body = {name: this.state.name, content: args};
        fetch("/api/save", {
            method: "POST", body: JSON.stringify(body),
            headers: {"Content-Type": "application/json"} })
          .then(this.doSaveResp)
          .catch(() => this.doSaveError("failed to connect to server"));
    }

    doSaveResp = (resp: Response): void => {
        if (resp.status === 200) {
          resp.json().then(this.doSaveJson)
              .catch(() => this.doSaveError("200 response is not JSON"));
        } else if (resp.status === 400) {
          resp.text().then(this.doSaveError)
              .catch(() => this.doSaveError("400 response is not text"));
        } else {
          this.doSaveError(`bad status code from /api/save: ${resp.status}`);
        }
    };

    doSaveJson = (data: unknown): void => {
        if (!isRecord(data)) {
          console.error("bad data from /api/save: not a record", data);
          return;
        }
    
        const hostVal: "Host 1" | "Host 2" = this.state.host === "Host 1" ? "Host 1" : "Host 2";

        console.log("save successful");
        this.props.onAddGuest({
            name: this.state.name,
            isFamily: this.state.isFamily,
            host: hostVal,
            hasPlusOne: -1,
        });
    };

    doSaveError = (msg: string): void => {
        this.setState({error: msg})
    };
    

    doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBack();
    }

}
