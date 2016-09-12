import React from 'react';
import ReactDOM from 'react-dom';
import style from '../scss/app.scss';
import axios from 'axios';

export default class Main extends React.Component {
  constructor(){
    super();
    this.comments = [];
  }
  loadData(){
    console.log( "@loadData");
    axios.get( '/api/comments' )
    .then( ( response) => {
      console.log( "got comment response:", response.data);
      //  this.setState( { response.data});
    })
    .catch( (error) => {
      console.log( error);
    });
  }
  componentDidMount(){
    this.loadData();
  }
  render(){
    return (
      <div className="example container">
        <h1>This is three cool app!</h1>
        <p>{this.comments}</p>
      </div>
    );
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Main />, app);
