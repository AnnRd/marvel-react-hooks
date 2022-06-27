import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Switch } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";

import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

const App = () => {
    

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main> 
                    <Routes>
                    <Route path="/">
                        
                    </Route>
                    <Route path="/comics">
                        <AppBanner/>
                        <ComicsList/>
                    </Route>
                    </Routes>
                </main>
            </div>
        </Router>
    )
    
    
}

export default App;