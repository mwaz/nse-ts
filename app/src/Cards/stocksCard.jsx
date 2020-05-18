import React from 'react';

import MyChart from  '../Charts/StocksChart';


const stocksCard = (props) => {

    return (
        <div className="info-card">
            <div className="card">
                {/* <img className="card-img-top" alt="" src={require('../logo.svg')} /> */}
                <div className="card-body">
                    <h5 className="card-title"> {props.name}</h5>
                    <p className="card-text"> {props.tradingName}</p>

                   
                 
                    {/* <!-- Modal Button --> */}

                    <button style={{paddingBottom: '5px'}} className="btn btn-dark" type="button" data-toggle="modal" data-target={`#${props.tradingName}`} aria-expanded="false" aria-controls="collapseExample">
                        More Stock Details
                    </button>

                    {/* <!-- Modal --> */}

                    <div className="modal fade" id={props.tradingName} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLongTitle"> {props.name} - {props.tradingName} </h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                 <MyChart/>
                                    {props.children}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- End of  Modal --> */}
                </div>
            </div >
        </div >
    );
}

export default stocksCard; 
