import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner'
import './GetRepos.css';
import RepoBody from '../RepoBody/RepoBody'

const RepoURL = 'https://arbeidsplassen.nav.no/public-feed/api/v1/ads?size=100';
const tokenVar = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwdWJsaWMudG9rZW4udjFAbmF2Lm5vIiwiYXVkIjoiZmVlZC1hcGktdjEiLCJpc3MiOiJuYXYubm8iLCJpYXQiOjE1NTc0NzM0MjJ9.jNGlLUF9HxoHo5JrQNMkweLj_91bgk97ZebLdfx3_UQ';

// Set initial states for pagination and error handeling
class GetRepos extends Component {
    constructor(props) {
        super(props);

        this.PageNumbers = this.PageNumbers.bind(this);
        this.state = {
            items: [],
            isLoading: false,
            error: null,
            startIndex: 0,
            endIndex: 20,
            disableNext: "",
            disablePrev: "displayNone",
        };
    };

    // Fetch API data and check for errors while loading
    componentDidMount() {
        this.setState({ isLoading: true });

        fetch(RepoURL,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + tokenVar,
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error();
            }
        }).then(data => this.setState( {items: data.content, isLoading: false }))
        .catch(error => this.setState({ error, isLoading: false }));
    };

    // Enable/Diable pagination next/prev buttons and update start/end values
    Pagination(direction) {
        let value = 0;

        if (direction === "next") {
            value = 20 
            this.setState({        
                disableNext:
                    this.state.endIndex >= this.state.items.length - value ? "displayNone" : "",
                disablePrev: ""
                });

        } else if (direction === "prev") {
            value = - 20;
            this.setState({
                disableNext: "",
                disablePrev:
                    (this.state.endIndex + value) <= Math.abs(value) ? "displayNone" : "",
            });
        } 

        this.setState({
            startIndex: this.state.startIndex + value,
            endIndex: this.state.endIndex + value,
        })
    };

    // Handle page number buttons for pagination
    PageNumbers() {
        let pagesMod = 0;
        let pageCount = 0;
        let pageArray = [];

        pagesMod = this.state.items.length % 20;
        (pagesMod === 0) ? pageCount = this.state.items.length / 20 : pageCount = Math.floor(this.state.items.length / 20) + 1;

        for (let i = 1; i <= pageCount; i++) {
            let j = i * 20;
            pageArray.push([[j-20], [j]])
        };

        return(
            <div className="button-holder pagenum">
                {pageArray.map((page, index) => (
                    <button 
                    onClick={() => this.SetPageIndex(Number(page[0]), Number(page[1]))} 
                    key={"PageNumber " + index} 
                    className={this.SetActive(index)}> {index + 1}  
                    </button>
                ))}
            </div>
        );
    };
    
    // Handle start/end values for paginations
    SetPageIndex(startValue, endValue) {
        this.setState({
            startIndex: startValue,
            endIndex: endValue,
            disableNext:
            (endValue >= this.state.items.length) ? "displayNone" : "",
            disablePrev:
            (startValue === 0) ? "displayNone" : "",
        });
    };
    
    // Handle current page
    SetActive(index) {
        let whatPage = 0;
        whatPage = (Math.floor(this.state.endIndex / 20) - 1)

        return  whatPage === index ? "active" : "";
    };
 
    // Render loading, error or ad repo listing
    render() {
        const { isLoading, error } = this.state;
        this.PageNumbers();

        if (isLoading) {
            return (
                <div className="loading-or-error">
                    <Spinner animation="border" className="margin-icon" />
                    <p>Loading...</p>
                </div>
            )
        };

        if (error) {
            return (
                <div className="loading-or-error">
                    <Spinner animation="grow" variant="danger" className="margin-icon" />
                    <p>Something went wrong...</p>
                    <p>{error.message}</p>
                </div>
            );
        };

        return (
            <div className="content-body">
                <RepoBody items={this.state.items} start={this.state.startIndex} end={this.state.endIndex} />

                <div className="button-holder" key={"buttonNextPrevHolder"}>
                    <button onClick={() => this.Pagination("prev")} disabled={this.state.disablePrev} key={"buttonPrev"} className={this.state.disablePrev}> Prev </button>
                    <button onClick={() => this.Pagination("next")} disabled={this.state.disableNext} key={"buttonNext"} className={this.state.disableNext}> Next </button>
                </div>
                <this.PageNumbers />
          </div>
        );

    };
};

export default GetRepos;