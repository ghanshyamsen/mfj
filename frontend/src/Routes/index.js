import React from 'react';
import { Routes, Route } from "react-router-dom";
import Layout from "../Layouts/layout";

//routes
import { publicRoutes, authProtectedRoutes, studentRoutes, parentsRoutes, managerRoutes } from "./allRoutes";
import {AuthProtected, AcesssRoute } from './AuthProtected';

import {AuthStudentProtected } from './AuthStudentProtected';

import {AuthParentsProtected } from './AuthParentsProtected';

import {AuthManagerProtected } from './AuthManagerProtected';

import ScrollToTop from './ScrollToTop'; // Path to the ScrollToTop component

const Index = () => {
     return (
        <React.Fragment>
            <ScrollToTop />
            <Routes>


                <Route>
                    {publicRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={<AcesssRoute>{route.component}</AcesssRoute>}
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>

                <Route>
                    {authProtectedRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={<AuthProtected><Layout >{route.component}</Layout></AuthProtected>}
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>

                <Route>
                    {studentRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={<AuthStudentProtected><Layout >{route.component}</Layout></AuthStudentProtected>}
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>

                <Route>
                    {parentsRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={<AuthParentsProtected><Layout >{route.component}</Layout></AuthParentsProtected>}
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>

                <Route>
                    {managerRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={<AuthManagerProtected><Layout >{route.component}</Layout></AuthManagerProtected>}
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>

            </Routes>
        </React.Fragment>
    );
};

export default Index;