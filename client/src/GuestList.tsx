import React, { Component, MouseEvent } from 'react';
import { Guest } from './guest';
import './StyleSheet.css'


type GuestListProps = {
    guests: ReadonlyArray<Guest>,
    onAddClick: () => void,
    onGuestClick: (index: number) => void
};



export class GuestList extends Component<GuestListProps, {}> {

    constructor(props: GuestListProps) {
        super(props);
        //set the initial states of the state, if any
        
    }

    render = (): JSX.Element =>  {
        return(
            <div>
                <h1>WEDDING APP</h1>
                <div id="guestList">
                    <h2>Guest List</h2>
                    <ul>{this.renderGuests()}</ul>
                </div>

                <div id="summary">
                    <h2>Summary</h2>
                    <p>{this.renderSummary()}</p>
                </div>
                <button className="animated-button" type="button" id="addGuest" onClick={this.doAddClick}>Add Guest</button>
            </div>
        )
    }

    //Renders the guests names, associtated host, and if they are bringing +1
    renderGuests = (): JSX.Element[] => {
        const guests: JSX.Element[] = [];
        // Inv: guests = LI for each of guests[0 .. i-1]
        for(let i=0; i<this.props.guests.length; i++) {
            const guest: Guest = this.props.guests[i];
            guests.push (
                <li key={guest.name}>
                    <a href="#" onClick={(evt) => this.doGuestClick(evt, i)}>{guest.name}</a><p> {this.getPlusOne(guest) + "    - Guest of " + guest.host}</p>
                </li>
            )
        }
        return guests;
    }  

    getPlusOne = (guest: Guest): string => {
        if(guest.hasPlusOne === -1) {
            return " AND ....";
        } else if(guest.hasPlusOne === 0) {
            return "";
        } else {
            return " AND " + guest.plusOneName; //plusOneName not empty by RI
        }
    }

    //Renders the summary section, calculates the rage or solid number and sends back JSX
    renderSummary = (): JSX.Element => {
        return (
            <div id="inner">
                <p>Guests of Host A - {this.getGuestNums("Host A")}</p>
                <p>Guests of Host B - {this.getGuestNums("Host B")}</p>
            </div>
        )
    }

    getHasUnconfirmed = (index: number, host: "Host A" | "Host B"): boolean => {
        if(index === this.props.guests.length) {
            return false;
        } else if(this.props.guests[index].host === host && this.props.guests[index].hasPlusOne === -1) {
            return true;
        } else {
            return this.getHasUnconfirmed(index+1, host);
        }
    }

    getMinConfirmed = (index: number, soFar: number, host: "Host A" | "Host B"): number => {
        if(index === this.props.guests.length) {
            return soFar;
        } else if(this.props.guests[index].host === host) {
            if(this.props.guests[index].hasPlusOne === 1) {
                return this.getMinConfirmed(index+1, soFar+2, host);
            } else {
                return this.getMinConfirmed(index+1, soFar+1, host);
            }
            
        } else {
            return this.getMinConfirmed(index+1, soFar, host);
        }
    }

    getMaxUnconfirmed = (index: number, soFar: number, host: "Host A" | "Host B"): number => {
        if(index === this.props.guests.length) {
            return soFar;
        } else if(this.props.guests[index].host === host && this.props.guests[index].hasPlusOne === -1) {
            return this.getMaxUnconfirmed(index+1, soFar+1, host);
        } else {
            return this.getMaxUnconfirmed(index+1, soFar, host);
        }
    }

    getFamilyCount = (index: number, soFar: number, host: "Host A" | "Host B" ): number => {
        if(index === this.props.guests.length) {
            return soFar;
        } else if((this.props.guests[index].host === host) && (this.props.guests[index].isFamily)) {
            return this.getFamilyCount(index+1, soFar+1, host);
        } else {
            return this.getFamilyCount(index+1, soFar, host);
        }
    }

    getGuestNums = (host: "Host A" | "Host B"): string => {
        const hasUncofirmed: boolean = this.getHasUnconfirmed(0, host);
        const minConfm: number = this.getMinConfirmed(0, 0, host);
        const maxUnConfm: number = this.getMaxUnconfirmed(0, 0, host);
        const familyCount: number = this.getFamilyCount(0, 0, host);

        if(hasUncofirmed) {
            return minConfm + "-" + (minConfm + maxUnConfm) + " (Family: " + familyCount + ")";
        } else {
            return minConfm.toString() + " (Family: " + familyCount + ")";
        }
    }

    doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onAddClick();
    }
    
    doGuestClick = (_evt: MouseEvent<HTMLAnchorElement>, index: number): void => {
        this.props.onGuestClick(index);
    }

}
