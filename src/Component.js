import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactTable from "react-table";
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import styles from 'main.css';
import rest from 'restcalls.js';

class Comp extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            selected: {
                index: -1,
                info: {}
            }
        };
    }
    updateState(updateObject) {
        const stateItems = this.state;
        for (let [key, value] of Object.entries(updateObject)) {
            stateItems[key] = value;
        }
        this.setState({
            stateItems
        });
    }
    custSearch(event) {
        var that = this;
        if (event.target){
            rest.MakeCustSearchRequest(event.target.value).then(data => {
                console.log(data);
                that.setState({ data: data.results });
            });
        }
    }
    render() {
        const displayObj = {
            showTable: {
                display: this.state.showDetails ? "none" : "block"
            },
            showDetails: {
                display: this.state.showDetails ? "block" : "none"
            }
        };
        return (
            <div>
                <div style={displayObj.showTable}>
                    <div>
                        <h1>Welcome to the Star Wars Character search!</h1>
                    </div>
                    <CharSearch state={this.state} custSearch={this.custSearch.bind(this)}/>
                    <div>
                        <CharacterTable state={this.state} updateState={this.updateState.bind(this)}/>
                    </div>
                </div>
                <div style={displayObj.showDetails}>
                    <Details state={this.state} updateState={this.updateState.bind(this)}/>
                </div>
            </div>
        );
    }
}

class Details extends Component {
    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
    }
    goBack(state) {
        this.props.updateState({showDetails: false})
    }
    render() {
        var info = this.props.state ? this.props.state.selected.info : {};
        return (
            <div>
                <div>
                    <div style={{display:"inline-block"}}>
                        <h1> {`${info.name}'s`} Details </h1>
                    </div>
                    <div className={styles.button}>
                        <Button onClick={this.goBack}>Back</Button>
                    </div>
                </div>
                <ListGroup>
                    <ListGroupItem>Gender: {info.gender}</ListGroupItem>
                    <ListGroupItem>Birth Year: {info.birth_year}</ListGroupItem>
                </ListGroup>
            </div>
        );
    }
}

class CharSearch extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    onChange(event) {
        this.props.custSearch(event)
    }
    render() {
        return (
            <div className={styles.searchInput}>
                Search for a Character: <input onChange={this.onChange} />
            </div>
        );
    }
}

class CharacterTable extends Component {
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
    }

    updateState(state) {
        this.props.updateState(state)
    }

    render() {
        const data = this.props.state.data;
        return (
            <div>
                <ReactTable
                    data={data}
                    columns={[
                        {
                            Header: "Name",
                            accessor: "name"
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    getTrProps={(state, rowInfo, column, instance) => {
                        if (typeof rowInfo !== "undefined") {
                            return {
                                onClick: (e) => {
                                    this.updateState({
                                        selected: {
                                            index:rowInfo.index,
                                            info: rowInfo.original
                                        },
                                        showDetails: true
                                    });
                                },
                                style: {
                                    background:
                                        rowInfo.index === this.props.state.selected.index
                                            ? "#00afec"
                                            : "white",
                                    color:
                                        rowInfo.index === this.props.state.selected.index
                                            ? "white"
                                            : "black"
                                }
                            };
                        } else {
                            return {};
                        }
                    }}
                />
            </div>
        );
    }
}

export default Comp;
