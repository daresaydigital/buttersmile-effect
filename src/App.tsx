import React from 'react';
import './App.scss';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {routes} from "./routes/routes";
import {Layout} from "./layout/main-layout/layout";

export default function App() {

    const routeComponents = routes.map((route, key) => {
        return <Route path={route.path} element={<route.component/>} key={key}/>
    })

    return (
        <div className="App">
            <>
                <Layout>
                    <Router>
                        <Routes>{routeComponents}</Routes>
                    </Router>
                </Layout>
            </>
        </div>
    );
}

