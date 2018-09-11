import React, { Component } from "react";

class Counter extends Component {
  state = {
    count: 0,
    value: this.props.counter.value,
    tags: []
    // imageUrl: "https://picsum.photos/200",
  };

  styles = {
    fontSize: 15,
    fontWeight: "bold"
  };

  // constructor() {
  //   super();
  //   // console.log(this);
  //   this.handleIncrement = this.handleIncrement.bind(this);
  // }

  renderTags() {
    if (this.state.tags.length === 0) return <p>There are no tags!</p>;

    return (
      <ul>
        {this.state.tags.map(tag => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    );
  }

  handleIncrement = () => {
    console.log("Increment Clicked");

    this.setState({ value: this.state.value + 1 });
  };

  render() {
    return (
      <div>
        {/* <img src={this.state.imageUrl} alt="" /> */}
        <span style={this.styles} className={this.getClassName()}>
          {this.formatCount()}
        </span>
        <button
          onClick={() => this.props.onIncrement(this.props.counter)}
          className="btn btn-secondary btn-sm"
        >
          Increment
        </button>
        <button
          onClick={() => this.props.onDelete(this.props.counter.id)}
          className="btn btn-danger btn-sm m-2"
        >
          Delete
        </button>
        {/* {this.state.tags.length === 0 && "Please create a new tag!"} */}
        {/* {this.renderTags()} */}
      </div>
      //   <React.Fragment>
      //   <h1>Hello world!</h1>
      //   <button>Increment</button>
      // </React.Fragment>
    );
  }

  getClassName() {
    let classes = "badge m-2 badge-";
    classes += this.props.counter.value === 0 ? "warning" : "primary";
    return classes;
  }

  formatCount() {
    const { value } = this.props.counter;
    return value === 0 ? "Zero" : value;
    // return count === 0 ? <h1>Zero</h1> : count;
  }
}

export default Counter;
