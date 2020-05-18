import React from 'react';

const NavigationBar = (props) => {
    return (
        <div className="navigation-banner">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="/#"> NSE Stocks Data</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav mr-auto">
                    </ul>
                    <span className="navbar-text">
                        Welcome {props.name}
                    </span>
                </div>
            </nav>
        </div>
    );
}

export default NavigationBar;
