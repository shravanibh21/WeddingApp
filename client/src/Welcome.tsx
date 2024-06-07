import React, { Component, MouseEvent, ChangeEvent } from 'react';

type WelcomeProps = {
    onStart: (hosts: {host1: string, host2: string}) => void;
}
type WelcomeState = {
    host1: string;
    host2: string;
    error: string;
    
}

export class Welcome extends Component<WelcomeProps, WelcomeState> {
    constructor(props: WelcomeProps) {
        super(props);
        this.state = {host1: "", host2: "", error: ""};

    }

    render = (): JSX.Element => {
        return (
            <div>
                <h1>Welcome to Wedding App!</h1>
                <h3>So, who is getting married?</h3>
                <label htmlFor="Host 1">Host 1 Name: </label>
                    <input id="host1" type="text" value={this.state.host1}
                    onChange={this.doHost1Change}></input>
                <h5>AND</h5>
                <label htmlFor="Host 2">Host 2 Name: </label>
                    <input id="host2" type="text" value={this.state.host2}
                    onChange={this.doHost2Change}></input>
                <button id="startButton" onClick={this.doStartClick}>Start Planning</button>
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

    doHost1Change = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({host1: evt.target.value, error: ""});
    };

    
    doHost2Change = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({host2: evt.target.value, error: ""});
    };

    doStartClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        console.log("start button clicked");
        if(this.state.host1 === "") {
            this.setState({error: "Name of host 1 missing"});
            return;
        }

        if(this.state.host2 === "") {
            this.setState({error: "Name of host 2 missing"});
            return;
        }

        this.props.onStart({host1: this.state.host1, host2: this.state.host2});
    }

    getHost1 = (): string => {
        return this.state.host1; //no aliases: strings immutable
    }
    
    getHost2 = (): string => {
        return this.state.host2; //no aliases: strings immutable
    }
}