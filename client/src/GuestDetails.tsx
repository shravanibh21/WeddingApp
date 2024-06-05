import React, { Component, MouseEvent, ChangeEvent } from 'react';
import { Guest } from './guest';
import { isRecord } from './record';

export type GuestInfo = {
    diet: string | undefined,
    hasPlusOne: -1 | 0 | 1,
    plusOneName: string | undefined,
    plusOneDiet: string | undefined,
}

type GuestDetailsProps = {
    index: number;
    currGuest: Guest,
    onSave: (guest: GuestInfo, index: number) => void,
    onBack: () => void,
}

type GuestDetailsState = {
    diet: string | undefined,
    hasPlusOne: string,
    plusOneName: string | undefined,
    plusOneDiet: string | undefined,
    error: string,
}

export class GuestDetails extends Component<GuestDetailsProps, GuestDetailsState> {

    constructor(props: GuestDetailsProps) {
        super(props);
        this.state = {diet: this.props.currGuest.diet || "", hasPlusOne: "", 
            plusOneName: this.props.currGuest.plusOneName || "", 
            plusOneDiet: this.props.currGuest.plusOneDiet || "", error: "" }
    }

    render = (): JSX.Element => {
        return (
            <div>
                <h2>Guest Details</h2>
                <p>{this.props.currGuest.name}, guest of {this.props.currGuest.host} {this.props.currGuest.isFamily ? ", family" : ""}</p>
                <label htmlFor="guestDiet">Dietary Restrictions ('none' if none)</label><br/>
                <input id="guestDiet" type="text" onChange={this.doDietChange} value={this.state.diet}/><br/><br/>
                <label htmlFor='hasplusOne'>Additional Guests?</label>
                <select name="Additonal" id="numGuestSelect" onChange={this.doHasPlusOneChange} value={this.state.hasPlusOne}>
                    <option value="SelectOne">Select</option>
                    <option value="unknown">Unknown</option>
                    <option value= "1">1</option>
                    <option value= "0">0</option>
                </select>
                {this.renderPlusOneInfo()}<br/><br/>
                <button type='button' onClick={this.doSaveClick}>Save</button>
                <button type='button' onClick={this.doBackClick}>Back</button>
                {this.renderError()}
            </div>
        )
        
    }

    renderPlusOneInfo = (): JSX.Element => {
        if(this.state.hasPlusOne !== "1") {
            return <div></div>
        } else {
            return (
                <div>
                    <h4>Plus One Details</h4>
                    <label htmlFor='plusOneName'>Guest Name: </label>
                    <input id="plusOneName" type="text" onChange={this.doPlusOneNameChange} value={this.state.plusOneName}/><br/><br/>
                    <label htmlFor="guestDiet">Plus One Dietary Restrictions ('none' if none)</label><br/>
                    <input id="plusOneDiet" type="text" onChange={this.doPlusOneDietChange} value={this.state.plusOneDiet}/>

                </div>
            )
        }
    }

    renderError = (): JSX.Element => {
        if(this.state.error.length === 0) {
            return <div></div>
        } else {
            return <p>Error: {this.state.error}</p>
        }
    }

    doDietChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({diet: evt.target.value, error: ""});
    }

    doHasPlusOneChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
        this.setState({hasPlusOne: evt.target.value, error: ""});
    }

    doSaveClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if(this.state.diet === "") {
            this.setState({error: "Diet of the guest is missing. Type \"none \" if none"});
            return;
        }

        if(this.state.hasPlusOne === "") {
            this.setState({error: "Please indicate if you will bring a plus one. Select \"Unknown\" if not sure"});
            return;
        }

        if(this.state.hasPlusOne === "1") {

            if(this.state.plusOneName === "") {
                this.setState({error: "Name of the plus one is missing"});
                return;
            }

            if(this.state.plusOneDiet === "") {
                this.setState({error: "Diet of the plus one is missing. Type \"none \" if none"});
                return;
            }
        }   

       

        const hasPlusOneVal: -1 | 0 | 1 = this.state.hasPlusOne === "unknown" ? -1 : 
                                          (this.state.hasPlusOne === "0" ? 0 : 1);

        const args = { 
            name: this.props.currGuest.name,
            isFamily: this.props.currGuest.isFamily, 
            host: this.props.currGuest.host,
            hasPlusOne: hasPlusOneVal, 
            diet: this.state.diet, 
            plusOneName: this.state.plusOneName,
            plusOneDiet: this.state.plusOneDiet };

        const body = {name: this.props.currGuest.name, content: args};
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

        const hasPlusOneVal: -1 | 0 | 1 = this.state.hasPlusOne === "unknown" ? -1 : 
                                          (this.state.hasPlusOne === "0" ? 0 : 1);

        this.props.onSave({
            diet: this.state.diet,
            hasPlusOne: hasPlusOneVal,
            plusOneName: this.state.plusOneName,
            plusOneDiet: this.state.plusOneDiet,
        }, this.props.index);


    };

    doSaveError = (msg: string): void => {
        this.setState({error: msg})
    };
    

    doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBack();
    }

    doPlusOneNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({plusOneName: evt.target.value, error: ""});
    }

    doPlusOneDietChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({plusOneDiet: evt.target.value, error: ""});
    }
}