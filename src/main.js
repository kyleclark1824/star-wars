import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactTable from "react-table/lib";
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import styles from 'main.css';
import rest from 'rest-calls.js';

class StarWars extends Component {
    constructor() {
        super();
        this.state = {
            table: {
                data: [],
                loading: false,
                pages: 0,
                next: null,
                previous: null
            },
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
        if (event && event.target){
            rest.MakeCustSearchRequest(event.target.value).then(data => {
                that.setState({
                    table: {
                        data: data.results,
                        loading: false,
                        pages: (Math.ceil(data.count/10)),
                        previous: data.previous,
                        next: data.next
                    }
                });
            });
        } else {
            rest.MakeCustSearchRequest('').then(data => {
                that.setState({
                    table: {
                        data: data.results,
                        loading: false,
                        pages: (Math.ceil(data.count/10)),
                        previous: data.previous,
                        next: data.next
                    }
                });
                console.log(that.state);
            });
        }
    }
    getDetails(info) {
        if(info) {
            return rest.MakeDetailsRequests(info);
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
                        <h1 className={styles.searchInput}>Welcome to the Star Wars Character search!</h1>
                    </div>
                    <CharSearch state={this.state} custSearch={this.custSearch.bind(this)}/>
                    <div>
                        <CharacterTable state={this.state} updateState={this.updateState.bind(this)} getDetails={this.getDetails.bind(this)}/>
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
        this.state = {
            info: {}
        };
    }
    goBack(state) {
        this.props.updateState({showDetails: false})
    }

    render() {
        // FILMS AS LIST<ListGroup>{info.films ? info.films.map((film, index) => (<ListGroupItem key={index}>{film.data.title}</ListGroupItem>)) : 'None'}</ListGroup>
        var info = this.props.state.selected.info || {};
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
                    <ListGroupItem><h3>Gender: {info.gender}</h3></ListGroupItem>
                    <ListGroupItem><h3>Species: {(info.species || {}).name}</h3></ListGroupItem>
                    <ListGroupItem> <h3>Films</h3>
                        <ReactTable
                            data={info.films}
                            columns={[
                                {
                                    Header: "Title",
                                    accessor: "data.title"
                                },
                                {
                                    Header: "Release",
                                    accessor: "data.release_date"
                                },
                                {
                                    Header: "Director",
                                    accessor: "data.director"
                                }
                            ]}
                            pageSize={info.films ? info.films.length : 0}
                            className="-striped -highlight"
                            showPagination={true}
                            showPaginationTop={false}
                            showPaginationBottom={false}
                        />
                    </ListGroupItem>
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
    componentDidMount() {
        this.props.custSearch('');
    }
    render() {
        return (
            <div className={styles.searchInput}>
                <h3>Search for a Character: <input onChange={this.onChange} /></h3>
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
        const { data, pages, loading } = this.props.state.table;
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
                                    this.props.getDetails(rowInfo.original)
                                        .then(details => {
                                            this.updateState({
                                                selected: {
                                                    index:rowInfo.index,
                                                    info: details
                                                },
                                                showDetails: true
                                            });
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
                    loading={this.props.state.table.loading}
                    showPagination={true}
                    showPaginationTop={false}
                    showPaginationBottom={true}
                    manual
                    pages={pages}
                    loading={loading}
                    pageSizeOptions={[10]}
                    onFetchData={(state, instance) => {
                        var that = this;
                        if (this.props.state.table.data.length) {
                            rest.MakeCustSearchRequest(null, this.props.state.table.next).then(data => {
                                console.log("data:", data);
                                that.updateState({ table:{ data:data.results, loading: false, pages: Math.ceil(data.count/10), next: data.next, previous: data.previous}});
                            });
                        } else {
                            return;
                        }

                    }}
                />
            </div>
        );
    }
}

export default StarWars;
