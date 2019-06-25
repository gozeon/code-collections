import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Search from './Search'
import Document from './Document'

function NoMatch() {
    return <h2>404</h2>;
}

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Search}/>
                <Route path="/document" exact component={Document}/>
                <Route component={NoMatch}/>
            </Switch>
        </Router>
    )
}

export default App